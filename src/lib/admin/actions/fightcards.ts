"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResult,
  type AdminClientResult,
  fieldBool,
  fieldHrefOrNull,
  fieldInt,
  fieldText,
  fieldTextOrNull,
  getAdminClient,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";
import { FIGHT_STATUSES } from "@/lib/admin/resource-shared";

export type FightStatus = (typeof FIGHT_STATUSES)[number];
type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type FightRow = {
  id: number;
  event_id: number;
  sort_order: number;
  label: string | null;
  fighter_a_user_id: string | null;
  fighter_b_user_id: string | null;
  fighter_a: string | null;
  fighter_b: string | null;
  fighter_a_image_path: string | null;
  fighter_b_image_path: string | null;
  fighter_a_is_tba: boolean;
  fighter_b_is_tba: boolean;
  weight_class: string | null;
  discipline: string | null;
  is_main_event: boolean;
  is_visible: boolean;
  status: FightStatus;
  notes: string | null;
};

async function verifiedFighterSnapshot(supabase: AdminSupabaseClient, userId: string | null) {
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("fighter_profiles")
    .select("user_id, nickname, weight_class, image_path, profiles!inner(display_name, profile_type, status)")
    .eq("user_id", userId)
    .eq("is_verified", true)
    .maybeSingle();

  if (error || !data) {
    return { ok: false as const, error: "Ausgewählter Kämpfer ist nicht verifiziert oder nicht verfügbar." };
  }

  const row = data as unknown as {
    user_id: string;
    nickname: string | null;
    weight_class: string | null;
    image_path: string | null;
    profiles: { display_name: string | null; profile_type: string | null; status: string | null } | null;
  };

  if (row.profiles?.profile_type !== "fighter" || row.profiles.status !== "active") {
    return { ok: false as const, error: "Ausgewählter Kämpfer ist nicht aktiv freigegeben." };
  }

  return {
    ok: true as const,
    userId: row.user_id,
    name: row.nickname || row.profiles.display_name || "Kämpfer",
    weightClass: row.weight_class,
    imagePath: row.image_path
  };
}

async function fightPayload(supabase: AdminSupabaseClient, formData: FormData) {
  const eventId = fieldInt(formData, "event_id", 0);
  if (!eventId) {
    return { error: "Bitte eine Veranstaltung auswählen." } as const;
  }

  const status = fieldText(formData, "status") || "planned";
  if (!FIGHT_STATUSES.includes(status as FightStatus)) {
    return { error: "Ungültiger Kampfstatus." } as const;
  }

  const fighterAUserId = fieldTextOrNull(formData, "fighter_a_user_id");
  const fighterBUserId = fieldTextOrNull(formData, "fighter_b_user_id");

  if (fighterAUserId && fighterAUserId === fighterBUserId) {
    return { error: "Ein Kämpfer kann nicht gegen sich selbst angesetzt werden." } as const;
  }

  const fighterAResult = await verifiedFighterSnapshot(supabase, fighterAUserId);
  if (fighterAResult && !fighterAResult.ok) {
    return { error: fighterAResult.error } as const;
  }

  const fighterBResult = await verifiedFighterSnapshot(supabase, fighterBUserId);
  if (fighterBResult && !fighterBResult.ok) {
    return { error: fighterBResult.error } as const;
  }

  const fighterA = fighterAResult?.ok ? fighterAResult.name : fieldTextOrNull(formData, "fighter_a");
  const fighterB = fighterBResult?.ok ? fighterBResult.name : fieldTextOrNull(formData, "fighter_b");

  return {
    payload: {
      event_id: eventId,
      sort_order: fieldInt(formData, "sort_order", 0),
      label: fieldTextOrNull(formData, "label"),
      fighter_a_user_id: fighterAResult?.ok ? fighterAResult.userId : null,
      fighter_b_user_id: fighterBResult?.ok ? fighterBResult.userId : null,
      fighter_a: fighterA,
      fighter_b: fighterB,
      fighter_a_image_path: fighterAResult?.ok ? fighterAResult.imagePath : fieldHrefOrNull(formData, "fighter_a_image_path"),
      fighter_b_image_path: fighterBResult?.ok ? fighterBResult.imagePath : fieldHrefOrNull(formData, "fighter_b_image_path"),
      fighter_a_is_tba: !fighterA,
      fighter_b_is_tba: !fighterB,
      weight_class:
        fieldTextOrNull(formData, "weight_class") ??
        (fighterAResult?.ok ? fighterAResult.weightClass : null) ??
        (fighterBResult?.ok ? fighterBResult.weightClass : null) ??
        null,
      discipline: fieldTextOrNull(formData, "discipline"),
      is_main_event: fieldBool(formData, "is_main_event"),
      is_visible: fieldBool(formData, "is_visible"),
      status: status as FightStatus,
      notes: fieldTextOrNull(formData, "notes")
    }
  } as const;
}

function normalizedFightName(value: string | null) {
  return value?.trim().replace(/\s+/g, " ").toLowerCase() ?? "";
}

async function duplicateFightError(
  supabase: AdminSupabaseClient,
  payload: { event_id: number; fighter_a: string | null; fighter_b: string | null },
  ignoreId?: number
) {
  const fighterA = normalizedFightName(payload.fighter_a);
  const fighterB = normalizedFightName(payload.fighter_b);

  if (!fighterA || !fighterB) {
    return null;
  }

  const { data, error } = await supabase
    .from("fight_cards")
    .select("id, fighter_a, fighter_b")
    .eq("event_id", payload.event_id);

  if (error) {
    return `Doppelungsprüfung fehlgeschlagen: ${supabaseErrorMessage(error)}`;
  }

  const duplicate = (data ?? []).find((row) => {
    const fight = row as Pick<FightRow, "id" | "fighter_a" | "fighter_b">;
    if (ignoreId && fight.id === ignoreId) {
      return false;
    }

    const existingA = normalizedFightName(fight.fighter_a);
    const existingB = normalizedFightName(fight.fighter_b);
    return (
      (existingA === fighterA && existingB === fighterB) ||
      (existingA === fighterB && existingB === fighterA)
    );
  });

  return duplicate ? "Diese Paarung existiert für das ausgewählte Event bereits." : null;
}

function revalidateFightcards() {
  revalidatePath("/admin/fightcards");
  revalidatePath("/fight-night");
  revalidatePath("/veranstaltungen");
  revalidatePath("/veranstaltungen/[slug]", "page");
  revalidatePath("/");
}

export async function createFightAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = await fightPayload(admin.supabase, formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Kampfdaten sind unvollständig." };
  }

  const duplicateError = await duplicateFightError(admin.supabase, result.payload);
  if (duplicateError) {
    return { ok: false, error: duplicateError };
  }

  const { error } = await admin.supabase.from("fight_cards").insert(result.payload);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Kampf gespeichert." };
}

export async function updateFightAction(
  id: number,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = await fightPayload(admin.supabase, formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Kampfdaten sind unvollständig." };
  }

  const duplicateError = await duplicateFightError(admin.supabase, result.payload, id);
  if (duplicateError) {
    return { ok: false, error: duplicateError };
  }

  const { error } = await admin.supabase.from("fight_cards").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Kampf gespeichert." };
}

export async function toggleFightVisibilityAction(id: number, isVisible: boolean): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("fight_cards").update({ is_visible: isVisible }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: isVisible ? "Kampf ist jetzt öffentlich sichtbar." : "Kampf ist verborgen." };
}

export async function moveFightAction(id: number, direction: "up" | "down"): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: current, error: currentError } = await admin.supabase
    .from("fight_cards")
    .select("id, event_id, sort_order")
    .eq("id", id)
    .maybeSingle();

  const fight = current as Pick<FightRow, "id" | "event_id" | "sort_order"> | null;

  if (currentError || !fight) {
    return { ok: false, error: "Kampf wurde nicht gefunden." };
  }

  const query = admin.supabase
    .from("fight_cards")
    .select("id, sort_order")
    .eq("event_id", fight.event_id)
    .limit(1);

  const { data: neighborData, error: neighborError } =
    direction === "up"
      ? await query.lt("sort_order", fight.sort_order).order("sort_order", { ascending: false })
      : await query.gt("sort_order", fight.sort_order).order("sort_order", { ascending: true });

  if (neighborError) {
    return { ok: false, error: supabaseErrorMessage(neighborError) };
  }

  const neighbor = (neighborData ?? [])[0] as Pick<FightRow, "id" | "sort_order"> | undefined;

  if (!neighbor) {
    return { ok: true, message: "Der Kampf steht bereits am Rand der Liste." };
  }

  const { error: swapError1 } = await admin.supabase
    .from("fight_cards")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", fight.id);

  if (swapError1) {
    return { ok: false, error: supabaseErrorMessage(swapError1) };
  }

  const { error: swapError2 } = await admin.supabase
    .from("fight_cards")
    .update({ sort_order: fight.sort_order })
    .eq("id", neighbor.id);

  if (swapError2) {
    return { ok: false, error: supabaseErrorMessage(swapError2) };
  }

  revalidateFightcards();
  return { ok: true, message: "Reihenfolge aktualisiert." };
}

/** Persistiert die per Drag & Drop festgelegte Reihenfolge einer Event-Fightcard. */
export async function reorderFightsAction(eventId: number, orderedIds: number[]): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  if (orderedIds.length === 0) {
    return { ok: true, message: "Keine Kämpfe zum Sortieren." };
  }

  for (let index = 0; index < orderedIds.length; index += 1) {
    const { error } = await admin.supabase
      .from("fight_cards")
      .update({ sort_order: (index + 1) * 10 })
      .eq("id", orderedIds[index])
      .eq("event_id", eventId);

    if (error) {
      return { ok: false, error: supabaseErrorMessage(error) };
    }
  }

  revalidateFightcards();
  return { ok: true, message: "Kampfreihenfolge aktualisiert." };
}

/** Schaltet alle Kämpfe eines Events öffentlich sichtbar. */
export async function publishFightcardAction(eventId: number): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase
    .from("fight_cards")
    .update({ is_visible: true })
    .eq("event_id", eventId);

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Fightcard veröffentlicht – alle Kämpfe sind sichtbar." };
}

export async function deleteFightAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase.from("fight_cards").delete().eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Kampf gelöscht." };
}
