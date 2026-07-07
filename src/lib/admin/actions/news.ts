"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type ActionResult,
  fieldBool,
  fieldText,
  fieldTextOrNull,
  formFile,
  type AdminClientResult,
  getAdminClient,
  slugify,
  supabaseErrorMessage,
  toParagraphs,
  uploadAdminMediaAsset,
  cleanupAdminMediaUrls,
  cleanupReplacedAdminMedia
} from "@/lib/admin/action-helpers";
import { NEWS_CATEGORIES } from "@/lib/admin/resource-shared";

type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type NewsStatus = "draft" | "published" | "archived";

export type NewsRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string[];
  image_path: string | null;
  hero_image_path: string | null;
  status: NewsStatus;
  published_at: string | null;
  updated_at: string;
};

function newsPayload(formData: FormData) {
  const title = fieldText(formData, "title");
  if (!title) {
    return { error: "Titel ist ein Pflichtfeld." } as const;
  }

  const slug = slugify(fieldText(formData, "slug") || title);
  if (!slug) {
    return { error: "Aus dem Titel konnte kein gültiger Slug erzeugt werden." } as const;
  }

  const status = fieldText(formData, "status");
  if (!["draft", "published", "archived"].includes(status)) {
    return { error: "Ungültiger Status." } as const;
  }

  const category = fieldText(formData, "category");
  if (!NEWS_CATEGORIES.includes(category as (typeof NEWS_CATEGORIES)[number])) {
    return { error: "Ungültige Kategorie." } as const;
  }

  return {
    payload: {
      slug,
      title,
      category,
      excerpt: fieldTextOrNull(formData, "excerpt"),
      body: toParagraphs(fieldText(formData, "body")),
      image_path: fieldBool(formData, "clear_image_path") ? null : fieldTextOrNull(formData, "image_path"),
      hero_image_path: fieldBool(formData, "clear_hero_image_path") ? null : fieldTextOrNull(formData, "hero_image_path"),
      status: status as NewsStatus
    }
  };
}

type NewsPayload = Extract<ReturnType<typeof newsPayload>, { payload: unknown }>["payload"];

function revalidateNews() {
  revalidatePath("/admin/news");
  revalidatePath("/neuigkeiten");
  revalidatePath("/");
}

async function applyNewsImageUploads({
  supabase,
  payload,
  formData
}: {
  supabase: AdminSupabaseClient;
  payload: NewsPayload;
  formData: FormData;
}) {
  const imageFile = formFile(formData, "news_image_file");
  const heroFile = formFile(formData, "news_hero_image_file");

  if (imageFile) {
    const uploaded = await uploadAdminMediaAsset({
      supabase,
      file: imageFile,
      folder: `news/${payload.slug}/card`,
      assetType: "News",
      altText: `${payload.title} Beitragsbild`,
      usageNote: `News-Beitragsbild: ${payload.title}`,
      isPublic: true,
      isChecked: true
    });
    if (!uploaded.ok) {
      return uploaded;
    }
    payload.image_path = uploaded.publicUrl;
  }

  if (heroFile) {
    const uploaded = await uploadAdminMediaAsset({
      supabase,
      file: heroFile,
      folder: `news/${payload.slug}/hero`,
      assetType: "News",
      altText: `${payload.title} Hero-Bild`,
      usageNote: `News-Hero: ${payload.title}`,
      isPublic: true,
      isChecked: true
    });
    if (!uploaded.ok) {
      return uploaded;
    }
    payload.hero_image_path = uploaded.publicUrl;
  }

  return { ok: true as const };
}

export async function createNewsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("news.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = newsPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Beitragsdaten sind unvollständig." };
  }

  const uploadResult = await applyNewsImageUploads({ supabase: admin.supabase, payload: result.payload, formData });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { error } = await admin.supabase.from("news_posts").insert({
    ...result.payload,
    published_at: result.payload.status === "published" ? new Date().toISOString() : null
  });

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateNews();
  redirect("/admin/news");
}

export async function updateNewsAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("news.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = newsPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Beitragsdaten sind unvollständig." };
  }

  const uploadResult = await applyNewsImageUploads({ supabase: admin.supabase, payload: result.payload, formData });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { data: existingData, error: existingError } = await admin.supabase
    .from("news_posts")
    .select("published_at, image_path, hero_image_path")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: supabaseErrorMessage(existingError) };
  }

  const existing = existingData as { published_at: string | null; image_path: string | null; hero_image_path: string | null } | null;
  const publishedAt =
    result.payload.status === "published" ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null;

  const { error } = await admin.supabase
    .from("news_posts")
    .update({ ...result.payload, published_at: publishedAt })
    .eq("id", id);

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const cleanupCard = await cleanupReplacedAdminMedia({
    supabase: admin.supabase,
    previousUrl: existing?.image_path,
    nextUrl: result.payload.image_path
  });
  if (!cleanupCard.ok) {
    return cleanupCard;
  }

  const cleanupHero = await cleanupReplacedAdminMedia({
    supabase: admin.supabase,
    previousUrl: existing?.hero_image_path,
    nextUrl: result.payload.hero_image_path
  });
  if (!cleanupHero.ok) {
    return cleanupHero;
  }

  revalidateNews();
  return { ok: true, message: "Beitrag gespeichert." };
}

export async function setNewsStatusAction(id: number, status: NewsStatus): Promise<ActionResult> {
  const admin = await getAdminClient("news.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const update: Record<string, unknown> = { status };
  if (status === "published") {
    update.published_at = new Date().toISOString();
  }

  const { error } = await admin.supabase.from("news_posts").update(update).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateNews();
  const labels: Record<NewsStatus, string> = {
    draft: "Beitrag als Entwurf gespeichert.",
    published: "Beitrag veröffentlicht.",
    archived: "Beitrag archiviert."
  };
  return { ok: true, message: labels[status] };
}

export async function deleteNewsAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("news.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: existingData, error: selectError } = await admin.supabase
    .from("news_posts")
    .select("image_path, hero_image_path")
    .eq("id", id)
    .maybeSingle();

  if (selectError) {
    return { ok: false, error: supabaseErrorMessage(selectError) };
  }

  const { error } = await admin.supabase.from("news_posts").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const existing = existingData as { image_path: string | null; hero_image_path: string | null } | null;
  const cleanup = await cleanupAdminMediaUrls({
    supabase: admin.supabase,
    publicUrls: [existing?.image_path, existing?.hero_image_path]
  });
  if (!cleanup.ok) {
    return cleanup;
  }

  revalidateNews();
  return { ok: true, message: "Beitrag gelöscht." };
}
