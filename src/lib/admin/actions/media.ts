"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResult,
  ADMIN_ALLOWED_IMAGE_MIME,
  ADMIN_MAX_UPLOAD_BYTES,
  fieldBool,
  fieldText,
  fieldTextOrNull,
  getAdminClient,
  supabaseErrorMessage,
  uploadAdminMediaAsset
} from "@/lib/admin/action-helpers";
import { MEDIA_TYPES } from "@/lib/admin/resource-shared";

export type MediaAssetRow = {
  id: number;
  bucket: string;
  path: string;
  asset_type: string;
  alt_text: string | null;
  usage_note: string | null;
  is_public: boolean;
  is_checked: boolean;
  created_at: string;
};

function revalidateMedia() {
  revalidatePath("/admin/media");
}

export async function uploadMediaAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Bitte eine Datei auswählen." };
  }

  if (file.size > ADMIN_MAX_UPLOAD_BYTES) {
    return { ok: false, error: "Datei ist zu groß (max. 6 MB)." };
  }

  if (!ADMIN_ALLOWED_IMAGE_MIME.includes(file.type as (typeof ADMIN_ALLOWED_IMAGE_MIME)[number])) {
    return { ok: false, error: "Nur Bilddateien (PNG, JPG, WebP, AVIF, SVG) sind erlaubt." };
  }

  const assetType = fieldText(formData, "asset_type") || "Sonstiges";
  if (!MEDIA_TYPES.includes(assetType as (typeof MEDIA_TYPES)[number])) {
    return { ok: false, error: "Ungültiger Asset-Typ." };
  }

  const uploaded = await uploadAdminMediaAsset({
    supabase: admin.supabase,
    file,
    folder: "uploads",
    assetType,
    altText: fieldTextOrNull(formData, "alt_text"),
    usageNote: fieldTextOrNull(formData, "usage_note"),
    isPublic: fieldBool(formData, "is_public"),
    isChecked: fieldBool(formData, "is_checked")
  });

  if (!uploaded.ok) {
    return { ok: false, error: uploaded.error };
  }

  revalidateMedia();
  return { ok: true, message: "Datei hochgeladen." };
}

export async function updateMediaAssetAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const assetType = fieldText(formData, "asset_type") || "Sonstiges";
  if (!MEDIA_TYPES.includes(assetType as (typeof MEDIA_TYPES)[number])) {
    return { ok: false, error: "Ungültiger Asset-Typ." };
  }

  const { error } = await admin.supabase
    .from("media_assets")
    .update({
      asset_type: assetType,
      alt_text: fieldTextOrNull(formData, "alt_text"),
      usage_note: fieldTextOrNull(formData, "usage_note"),
      is_public: fieldBool(formData, "is_public"),
      is_checked: fieldBool(formData, "is_checked")
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateMedia();
  return { ok: true, message: "Asset gespeichert." };
}

export async function deleteMediaAssetAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data } = await admin.supabase
    .from("media_assets")
    .select("path, bucket")
    .eq("id", id)
    .maybeSingle();

  const asset = data as Pick<MediaAssetRow, "path" | "bucket"> | null;

  if (asset) {
    const { error: storageError } = await admin.supabase.storage.from(asset.bucket).remove([asset.path]);
    if (storageError) {
      return { ok: false, error: `Datei konnte nicht gelöscht werden: ${storageError.message}` };
    }
  }

  const { error } = await admin.supabase.from("media_assets").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateMedia();
  return { ok: true, message: "Asset gelöscht." };
}
