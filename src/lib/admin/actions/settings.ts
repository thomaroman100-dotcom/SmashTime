"use server";

import { revalidatePath } from "next/cache";
import {
  type AdminClientResult,
  type ActionResult,
  ADMIN_ALLOWED_IMAGE_MIME,
  ADMIN_MAX_UPLOAD_BYTES,
  fieldText,
  getAdminClient,
  slugify,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";
import { SETTING_FIELDS } from "@/lib/admin/resource-shared";
import { normalizePublicHref } from "@/lib/public-url";

export type SettingRow = {
  key: string;
  value: { text?: string };
};

type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

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

function uploadedFile(formData: FormData, fieldName: string) {
  const file = formData.get(fieldName);
  return file instanceof File && file.size > 0 ? file : null;
}

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

async function uploadSettingsAsset({
  file,
  folder,
  assetType,
  supabase
}: {
  file: File;
  folder: string;
  assetType: string;
  supabase: AdminSupabaseClient;
}) {
  if (file.size > ADMIN_MAX_UPLOAD_BYTES) {
    return { ok: false as const, error: "Datei ist zu groß (max. 6 MB)." };
  }

  if (!ADMIN_ALLOWED_IMAGE_MIME.includes(file.type as (typeof ADMIN_ALLOWED_IMAGE_MIME)[number])) {
    return { ok: false as const, error: "Nur Bilddateien (PNG, JPG, WebP, AVIF, SVG) sind erlaubt." };
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "asset";
  const path = `${folder}/${Date.now()}-${baseName}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("smashtime-media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false as const, error: `Upload fehlgeschlagen: ${uploadError.message}` };
  }

  const publicUrl = supabase.storage.from("smashtime-media").getPublicUrl(path).data.publicUrl;

  const { error: insertError } = await supabase.from("media_assets").insert({
    bucket: "smashtime-media",
    path,
    asset_type: assetType,
    alt_text: file.name,
    usage_note: "Admin-Einstellungen",
    is_public: true,
    is_checked: true
  });

  if (insertError) {
    await supabase.storage.from("smashtime-media").remove([path]);
    return { ok: false as const, error: supabaseErrorMessage(insertError) };
  }

  return { ok: true as const, publicUrl };
}

export async function saveSettingsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("settings.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const uploadedValues: Record<string, string> = {};
  for (const [fieldName, config] of Object.entries(SETTINGS_UPLOAD_FIELDS)) {
    const file = uploadedFile(formData, fieldName);
    if (!file) {
      continue;
    }

    const uploaded = await uploadSettingsAsset({
      file,
      folder: config.folder,
      assetType: config.assetType,
      supabase: admin.supabase
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

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/");
  return { ok: true, message: "Einstellungen gespeichert." };
}
