"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  type ActionResult,
  fieldBool,
  fieldInt,
  fieldText,
  fieldTextOrNull,
  getAdminClient,
  slugify,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";

export type ChampionRow = {
  id: number;
  slug: string;
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

function championPayload(formData: FormData) {
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
      name,
      age: fieldTextOrNull(formData, "age"),
      weight: fieldTextOrNull(formData, "weight"),
      weight_class: fieldTextOrNull(formData, "weight_class"),
      record: fieldTextOrNull(formData, "record"),
      origin: fieldTextOrNull(formData, "origin"),
      image_path: fieldTextOrNull(formData, "image_path"),
      stance: fieldTextOrNull(formData, "stance"),
      bio: fieldTextOrNull(formData, "bio"),
      quote: fieldTextOrNull(formData, "quote"),
      title: fieldTextOrNull(formData, "title"),
      sort_order: fieldInt(formData, "sort_order", 0),
      is_active: fieldBool(formData, "is_active")
    }
  } as const;
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
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = championPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Champion-Daten sind unvollständig." };
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
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = championPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Champion-Daten sind unvollständig." };
  }

  const { error } = await admin.supabase.from("champions").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateChampions();
  return { ok: true, message: "Champion gespeichert." };
}

export async function setChampionActiveAction(id: number, isActive: boolean): Promise<ActionResult> {
  const admin = await getAdminClient();
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
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("champions").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateChampions();
  return { ok: true, message: "Champion gelöscht." };
}
