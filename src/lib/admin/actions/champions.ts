"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type ActionResult,
  type AdminClientResult,
  fieldBool,
  fieldInt,
  fieldText,
  fieldTextOrNull,
  formFile,
  getAdminClient,
  slugify,
  supabaseErrorMessage,
  uploadAdminMediaAsset,
  cleanupAdminMediaUrls,
  cleanupReplacedAdminMedia
} from "@/lib/admin/action-helpers";

type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type ChampionRow = {
  id: number;
  slug: string;
  fighter_user_id: string | null;
  name: string;
  age: string | null;
  weight: string | null;
  weight_class: string | null;
  record: string | null;
  origin: string | null;
  image_path: string | null;
  stance: string | null;
  bio: string | null;
  quote: string | null;
  title: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

async function verifiedFighterName(supabase: AdminSupabaseClient, userId: string | null) {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("fighter_profiles")
    .select("user_id, nickname, profiles!inner(display_name, profile_type, status)")
    .eq("user_id", userId)
    .eq("is_verified", true)
    .maybeSingle();

  if (error || !data) {
    return { ok: false as const, error: "Ausgewählter Kämpfer ist nicht verifiziert oder nicht verfügbar." };
  }

  const row = data as unknown as {
    user_id: string;
    nickname: string | null;
    profiles: { display_name: string | null; profile_type: string | null; status: string | null } | null;
  };

  if (row.profiles?.profile_type !== "fighter" || row.profiles.status !== "active") {
    return { ok: false as const, error: "Ausgewählter Kämpfer ist nicht aktiv freigegeben." };
  }

  return {
    ok: true as const,
    userId: row.user_id,
    name: row.nickname || row.profiles.display_name || "Champion"
  };
}

async function championPayload(supabase: AdminSupabaseClient, formData: FormData, requireFighter: boolean) {
  const fighterUserId = fieldTextOrNull(formData, "fighter_user_id");
  const fighter = await verifiedFighterName(supabase, fighterUserId);

  if (fighter && !fighter.ok) {
    return { error: fighter.error } as const;
  }

  if (requireFighter && !fighter?.ok) {
    return { error: "Bitte ein verifiziertes Kämpferprofil auswählen." } as const;
  }

  const name = fieldText(formData, "name");

  if (!name) {
    return { error: "Name ist ein Pflichtfeld." } as const;
  }

  const slugInput = fieldText(formData, "slug");
  const slug = slugify(slugInput || name);

  if (!slug) {
    return { error: "Aus dem Namen konnte kein gültiger Slug erzeugt werden." } as const;
  }

  return {
    payload: {
      slug,
      fighter_user_id: fighter?.ok ? fighter.userId : null,
      name,
      age: fieldTextOrNull(formData, "age"),
      weight: fieldTextOrNull(formData, "weight"),
      weight_class: fieldTextOrNull(formData, "weight_class"),
      record: fieldTextOrNull(formData, "record"),
      origin: fieldTextOrNull(formData, "origin"),
      image_path: fieldBool(formData, "clear_image_path") ? null : fieldTextOrNull(formData, "image_path"),
      stance: fieldTextOrNull(formData, "stance"),
      bio: fieldTextOrNull(formData, "bio"),
      quote: fieldTextOrNull(formData, "quote"),
      title: fieldTextOrNull(formData, "title"),
      sort_order: fieldInt(formData, "sort_order", 0),
      is_active: fieldBool(formData, "is_active")
    }
  };
}

type ChampionPayload = Extract<Awaited<ReturnType<typeof championPayload>>, { payload: unknown }>["payload"];

async function applyChampionPhotoUpload({
  supabase,
  payload,
  formData
}: {
  supabase: AdminSupabaseClient;
  payload: ChampionPayload;
  formData: FormData;
}) {
  const photoFile = formFile(formData, "champion_image_file");
  if (!photoFile) {
    return { ok: true as const };
  }

  const uploaded = await uploadAdminMediaAsset({
    supabase,
    file: photoFile,
    folder: `champions/${payload.slug}`,
    assetType: "Champion",
    altText: `${payload.name} Champion-Foto`,
    usageNote: `Champion-Foto: ${payload.name}`,
    isPublic: true,
    isChecked: true
  });

  if (!uploaded.ok) {
    return uploaded;
  }

  payload.image_path = uploaded.publicUrl;
  return { ok: true as const };
}

function revalidateChampions() {
  revalidatePath("/admin/champions");
  revalidatePath("/champions");
  revalidatePath("/");
}

export async function createChampionAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("champions.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = await championPayload(admin.supabase, formData, true);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Champion-Daten sind unvollständig." };
  }

  const uploadResult = await applyChampionPhotoUpload({
    supabase: admin.supabase,
    payload: result.payload,
    formData
  });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { error } = await admin.supabase.from("champions").insert(result.payload);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateChampions();
  redirect("/admin/champions");
}

export async function updateChampionAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("champions.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = await championPayload(admin.supabase, formData, false);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Champion-Daten sind unvollständig." };
  }

  const { data: existingData, error: existingError } = await admin.supabase
    .from("champions")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: supabaseErrorMessage(existingError) };
  }

  const uploadResult = await applyChampionPhotoUpload({
    supabase: admin.supabase,
    payload: result.payload,
    formData
  });
  if (!uploadResult.ok) {
    return { ok: false, error: uploadResult.error };
  }

  const { error } = await admin.supabase.from("champions").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const cleanup = await cleanupReplacedAdminMedia({
    supabase: admin.supabase,
    previousUrl: (existingData as { image_path: string | null } | null)?.image_path,
    nextUrl: result.payload.image_path
  });
  if (!cleanup.ok) {
    return cleanup;
  }

  revalidateChampions();
  return { ok: true, message: "Champion gespeichert." };
}

export async function setChampionActiveAction(id: number, isActive: boolean): Promise<ActionResult> {
  const admin = await getAdminClient("champions.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("champions").update({ is_active: isActive }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateChampions();
  return { ok: true, message: isActive ? "Champion aktiviert." : "Champion deaktiviert." };
}

export async function deleteChampionAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("champions.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: existingData, error: selectError } = await admin.supabase
    .from("champions")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (selectError) {
    return { ok: false, error: supabaseErrorMessage(selectError) };
  }

  const { error } = await admin.supabase.from("champions").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const cleanup = await cleanupAdminMediaUrls({
    supabase: admin.supabase,
    publicUrls: [(existingData as { image_path: string | null } | null)?.image_path]
  });
  if (!cleanup.ok) {
    return cleanup;
  }

  revalidateChampions();
  return { ok: true, message: "Champion gelöscht." };
}
