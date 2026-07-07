import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type AdminAccessRequirement, getAdminSession } from "@/lib/admin/auth";
import { normalizePublicHref } from "@/lib/public-url";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

type ServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

export type AdminClientResult =
  | { ok: true; supabase: ServerClient }
  | { ok: false; error: string };

export const ADMIN_MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
export const ADMIN_ALLOWED_IMAGE_MIME = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"] as const;
export const ADMIN_MEDIA_BUCKET = "smashtime-media";
const ADMIN_MEDIA_PUBLIC_MARKER = `/storage/v1/object/public/${ADMIN_MEDIA_BUCKET}/`;

export async function getAdminClient(requirement: AdminAccessRequirement = "admin.access"): Promise<AdminClientResult> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { ok: false, error: "Supabase ist nicht konfiguriert. Admin-Aktionen sind gesperrt." };
  }

  const session = await getAdminSession(requirement);
  if (session.status !== "authenticated") {
    const errorByStatus: Record<typeof session.status, string> = {
      "missing-config": "Supabase ist nicht konfiguriert. Admin-Aktionen sind gesperrt.",
      unauthenticated: "Keine aktive Admin-Sitzung. Bitte melde dich neu an.",
      forbidden: "Dir fehlt die Berechtigung für diese Aktion."
    };
    return { ok: false, error: errorByStatus[session.status] };
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

export function fieldHrefOrNull(
  formData: FormData,
  name: string,
  options: { allowRelative?: boolean; allowContactProtocols?: boolean } = {}
) {
  const value = fieldText(formData, name);
  if (!value) {
    return null;
  }

  const allowRelative = options.allowRelative ?? true;
  const allowContactProtocols = options.allowContactProtocols ?? false;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);

  if (hasScheme && !/^(https?:|mailto:|tel:)/i.test(value)) {
    return null;
  }

  if (!allowContactProtocols && /^(mailto:|tel:)/i.test(value)) {
    return null;
  }

  const withProtocol =
    !hasScheme && /^[a-z0-9.-]+\.[a-z]{2,}(?:[/?#].*)?$/i.test(value) ? `https://${value}` : value;
  const normalized = normalizePublicHref(withProtocol);

  if (normalized === "#" || normalized.startsWith("#")) {
    return null;
  }

  if (!allowRelative && normalized.startsWith("/")) {
    return null;
  }

  return normalized;
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
    .from(ADMIN_MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false as const, error: `Upload fehlgeschlagen: ${uploadError.message}` };
  }

  const publicUrl = supabase.storage.from(ADMIN_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;

  const { data, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      bucket: ADMIN_MEDIA_BUCKET,
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
    await supabase.storage.from(ADMIN_MEDIA_BUCKET).remove([path]);
    return { ok: false as const, error: supabaseErrorMessage(insertError) };
  }

  return { ok: true as const, mediaAssetId: (data as { id: number } | null)?.id ?? null, path, publicUrl };
}

export function adminMediaStoragePathFromPublicUrl(value: string | null | undefined) {
  const raw = value?.trim() ?? "";
  if (!raw || raw.startsWith("blob:") || raw.startsWith("data:")) {
    return null;
  }

  const fromPathname = (pathname: string) => {
    const markerIndex = pathname.indexOf(ADMIN_MEDIA_PUBLIC_MARKER);
    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = pathname.slice(markerIndex + ADMIN_MEDIA_PUBLIC_MARKER.length).replace(/^\/+/, "");
    return encodedPath ? decodeURIComponent(encodedPath) : null;
  };

  try {
    return fromPathname(new URL(raw).pathname);
  } catch {
    return fromPathname(raw);
  }
}

export async function deleteAdminMediaAssetByPath({
  supabase,
  path,
  bucket = ADMIN_MEDIA_BUCKET
}: {
  supabase: ServerClient;
  path: string | null | undefined;
  bucket?: string;
}) {
  const storagePath = path?.trim();
  if (!storagePath) {
    return { ok: true as const };
  }

  const { error: storageError } = await supabase.storage.from(bucket).remove([storagePath]);
  if (storageError) {
    return { ok: false as const, error: `Datei konnte nicht gelöscht werden: ${storageError.message}` };
  }

  const { error: rowError } = await supabase.from("media_assets").delete().eq("bucket", bucket).eq("path", storagePath);
  if (rowError) {
    return { ok: false as const, error: supabaseErrorMessage(rowError) };
  }

  return { ok: true as const };
}

export async function deleteAdminMediaAssetByPublicUrl({
  supabase,
  publicUrl
}: {
  supabase: ServerClient;
  publicUrl: string | null | undefined;
}) {
  return deleteAdminMediaAssetByPath({
    supabase,
    path: adminMediaStoragePathFromPublicUrl(publicUrl)
  });
}

export async function cleanupReplacedAdminMedia({
  supabase,
  previousUrl,
  nextUrl
}: {
  supabase: ServerClient;
  previousUrl: string | null | undefined;
  nextUrl: string | null | undefined;
}) {
  const previousPath = adminMediaStoragePathFromPublicUrl(previousUrl);
  const nextPath = adminMediaStoragePathFromPublicUrl(nextUrl);
  if (!previousPath || previousPath === nextPath) {
    return { ok: true as const };
  }

  return deleteAdminMediaAssetByPath({ supabase, path: previousPath });
}

export async function cleanupAdminMediaUrls({
  supabase,
  publicUrls
}: {
  supabase: ServerClient;
  publicUrls: Array<string | null | undefined>;
}) {
  const uniquePaths = Array.from(
    new Set(publicUrls.map((url) => adminMediaStoragePathFromPublicUrl(url)).filter((path): path is string => Boolean(path)))
  );

  for (const path of uniquePaths) {
    const deleted = await deleteAdminMediaAssetByPath({ supabase, path });
    if (!deleted.ok) {
      return deleted;
    }
  }

  return { ok: true as const };
}
