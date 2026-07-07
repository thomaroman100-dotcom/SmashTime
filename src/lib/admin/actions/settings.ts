"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResult,
  fieldText,
  formFile,
  getAdminClient,
  supabaseErrorMessage,
  uploadAdminMediaAsset,
  cleanupReplacedAdminMedia
} from "@/lib/admin/action-helpers";
import { SETTING_FIELDS } from "@/lib/admin/resource-shared";
import { normalizePublicHref } from "@/lib/public-url";

export type SettingRow = {
  key: string;
  value: { text?: string };
};

const SETTINGS_UPLOAD_FIELDS: Record<string, { settingKey: string; folder: string; assetType: string }> = {
  headerLogoFile: {
    settingKey: "branding.headerLogoUrl",
    folder: "settings/logos",
    assetType: "Logo"
  },
  faviconFile: {
    settingKey: "branding.faviconUrl",
    folder: "settings/favicons",
    assetType: "Logo"
  },
  heroBackgroundFile: {
    settingKey: "homepage.hero.backgroundImageUrl",
    folder: "settings/hero",
    assetType: "Hintergrund"
  }
};

const INTERNAL_HREF_SETTINGS = new Set([
  "homepage.cta.primaryUrl",
  "homepage.cta.secondaryUrl",
  "homepage.modules.champions.buttonUrl",
  "homepage.modules.news.buttonUrl",
  "homepage.modules.sponsors.buttonUrl",
  "ticket_url"
]);

function normalizeNavigationItems(value: string) {
  try {
    const parsed = JSON.parse(value) as Array<Record<string, unknown>>;
    if (!Array.isArray(parsed)) {
      return value;
    }

    return JSON.stringify(
      parsed.map((item) => {
        const path = typeof item.path === "string" ? item.path : typeof item.href === "string" ? item.href : "/";
        return {
          ...item,
          path: normalizePublicHref(path)
        };
      })
    );
  } catch {
    return value;
  }
}

function normalizeSettingValue(key: string, value: string) {
  if (key === "navigation.items") {
    return normalizeNavigationItems(value);
  }

  if (INTERNAL_HREF_SETTINGS.has(key)) {
    return normalizePublicHref(value);
  }

  return value;
}

export async function saveSettingsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("settings.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const uploadSettingKeys = Object.values(SETTINGS_UPLOAD_FIELDS).map((config) => config.settingKey);
  const { data: previousRows, error: previousError } = await admin.supabase
    .from("site_settings")
    .select("key, value")
    .in("key", uploadSettingKeys);

  if (previousError) {
    return { ok: false, error: supabaseErrorMessage(previousError) };
  }

  const previousByKey = new Map(
    ((previousRows as SettingRow[] | null) ?? []).map((row) => [row.key, typeof row.value?.text === "string" ? row.value.text : ""])
  );

  const uploadedValues: Record<string, string> = {};
  for (const [fieldName, config] of Object.entries(SETTINGS_UPLOAD_FIELDS)) {
    const file = formFile(formData, fieldName);
    if (!file) {
      continue;
    }

    const uploaded = await uploadAdminMediaAsset({
      supabase: admin.supabase,
      file,
      folder: config.folder,
      assetType: config.assetType,
      altText: file.name,
      usageNote: "Admin-Einstellungen",
      isPublic: true,
      isChecked: true
    });

    if (!uploaded.ok) {
      return { ok: false, error: uploaded.error };
    }

    uploadedValues[config.settingKey] = uploaded.publicUrl;
  }

  const rows = SETTING_FIELDS.map((field) => {
    const value = uploadedValues[field.key] ?? fieldText(formData, field.key);

    return {
      key: field.key,
      value: { text: normalizeSettingValue(field.key, value) },
      is_public: true
    };
  });

  const { error } = await admin.supabase.from("site_settings").upsert(rows, { onConflict: "key" });

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  for (const key of uploadSettingKeys) {
    const next = rows.find((row) => row.key === key)?.value.text ?? "";
    const cleanup = await cleanupReplacedAdminMedia({
      supabase: admin.supabase,
      previousUrl: previousByKey.get(key),
      nextUrl: next
    });
    if (!cleanup.ok) {
      return cleanup;
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { ok: true, message: "Einstellungen gespeichert." };
}
