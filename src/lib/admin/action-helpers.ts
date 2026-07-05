import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export type AdminClientResult =
  | { ok: true; supabase: ServerClient }
  | { ok: false; error: string };

export const ADMIN_MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
export const ADMIN_ALLOWED_IMAGE_MIME = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"] as const;

export async function getAdminClient(): Promise<AdminClientResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, error: "Supabase ist nicht konfiguriert. Admin-Aktionen sind gesperrt." };
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Keine aktive Admin-Sitzung. Bitte melde dich neu an." };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!(profile as { is_active: boolean | null } | null)?.is_active) {
    return { ok: false, error: "Dein Konto ist nicht als aktiver Admin freigeschaltet." };
  }

  return { ok: true, supabase };
}

const umlautMap: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss"
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => umlautMap[char] ?? char)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function fieldText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function fieldTextOrNull(formData: FormData, name: string) {
  const value = fieldText(formData, name);
  return value.length > 0 ? value : null;
}

export function fieldInt(formData: FormData, name: string, fallback: number) {
  const parsed = Number.parseInt(fieldText(formData, name), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function fieldBool(formData: FormData, name: string) {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}

export function toParagraphs(value: string) {
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function supabaseErrorMessage(error: { message?: string; code?: string } | null) {
  if (!error) {
    return "Unbekannter Fehler beim Speichern.";
  }
  if (error.code === "23505") {
    return "Dieser Eintrag existiert bereits (Slug/Name muss eindeutig sein).";
  }
  return error.message ? `Speichern fehlgeschlagen: ${error.message}` : "Speichern fehlgeschlagen.";
}

export function formFile(formData: FormData, name: string) {
  const file = formData.get(name);
  return file instanceof File && file.size > 0 ? file : null;
}

export function formFiles(formData: FormData, name: string) {
  return formData.getAll(name).filter((file): file is File => file instanceof File && file.size > 0);
}

export async function uploadAdminMediaAsset({
  supabase,
  file,
  folder,
  assetType,
  altText,
  usageNote,
  isPublic = true,
  isChecked = false
}: {
  supabase: ServerClient;
  file: File;
  folder: string;
  assetType: string;
  altText?: string | null;
  usageNote?: string | null;
  isPublic?: boolean;
  isChecked?: boolean;
}) {
  if (file.size > ADMIN_MAX_UPLOAD_BYTES) {
    return { ok: false as const, error: "Datei ist zu groß (max. 6 MB)." };
  }

  if (!ADMIN_ALLOWED_IMAGE_MIME.includes(file.type as (typeof ADMIN_ALLOWED_IMAGE_MIME)[number])) {
    return { ok: false as const, error: "Nur Bilddateien (PNG, JPG, WebP, AVIF, SVG) sind erlaubt." };
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "bin";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "asset";
  const path = `${folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${baseName}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("smashtime-media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false as const, error: `Upload fehlgeschlagen: ${uploadError.message}` };
  }

  const publicUrl = supabase.storage.from("smashtime-media").getPublicUrl(path).data.publicUrl;

  const { data, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      bucket: "smashtime-media",
      path,
      asset_type: assetType,
      alt_text: altText ?? file.name,
      usage_note: usageNote,
      is_public: isPublic,
      is_checked: isChecked
    })
    .select("id")
    .maybeSingle();

  if (insertError) {
    await supabase.storage.from("smashtime-media").remove([path]);
    return { ok: false as const, error: supabaseErrorMessage(insertError) };
  }

  return { ok: true as const, mediaAssetId: (data as { id: number } | null)?.id ?? null, path, publicUrl };
}
