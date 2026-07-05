"use server";

import { revalidatePath } from "next/cache";
import {
  type ActionResult,
  fieldBool,
  fieldInt,
  fieldText,
  fieldTextOrNull,
  getAdminClient,
  supabaseErrorMessage
} from "@/lib/admin/action-helpers";
import { FIGHT_STATUSES } from "@/lib/admin/resource-shared";

export type FightStatus = (typeof FIGHT_STATUSES)[number];

export type FightRow = {
  id: number;
  event_id: number;
  sort_order: number;
  label: string | null;
  fighter_a: string | null;
  fighter_b: string | null;
  fighter_a_is_tba: boolean;
  fighter_b_is_tba: boolean;
  weight_class: string | null;
  discipline: string | null;
  is_main_event: boolean;
  is_visible: boolean;
  status: FightStatus;
  notes: string | null;
};

function fightPayload(formData: FormData) {
  const eventId = fieldInt(formData, "event_id", 0);
  if (!eventId) {
    return { error: "Bitte eine Veranstaltung auswählen." } as const;
  }

  const status = fieldText(formData, "status") || "planned";
  if (!FIGHT_STATUSES.includes(status as FightStatus)) {
    return { error: "Ungültiger Kampfstatus." } as const;
  }

  const fighterA = fieldTextOrNull(formData, "fighter_a");
  const fighterB = fieldTextOrNull(formData, "fighter_b");

  return {
    payload: {
      event_id: eventId,
      sort_order: fieldInt(formData, "sort_order", 0),
      label: fieldTextOrNull(formData, "label"),
      fighter_a: fighterA,
      fighter_b: fighterB,
      fighter_a_is_tba: !fighterA,
      fighter_b_is_tba: !fighterB,
      weight_class: fieldTextOrNull(formData, "weight_class"),
      discipline: fieldTextOrNull(formData, "discipline"),
      is_main_event: fieldBool(formData, "is_main_event"),
      is_visible: fieldBool(formData, "is_visible"),
      status: status as FightStatus,
      notes: fieldTextOrNull(formData, "notes")
    }
  } as const;
}

function revalidateFightcards() {
  revalidatePath("/admin/fightcards");
  revalidatePath("/fight-night");
  revalidatePath("/veranstaltungen");
  revalidatePath("/");
}

export async function createFightAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = fightPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Kampfdaten sind unvollständig." };
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
  const admin = await getAdminClient();
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const result = fightPayload(formData);
  if ("error" in result) {
    return { ok: false, error: result.error ?? "Kampfdaten sind unvollständig." };
  }

  const { error } = await admin.supabase.from("fight_cards").update(result.payload).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Kampf gespeichert." };
}

export async function toggleFightVisibilityAction(id: number, isVisible: boolean): Promise<ActionResult> {
  const admin = await getAdminClient();
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
  const admin = await getAdminClient();
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
  const admin = await getAdminClient();
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
  const admin = await getAdminClient();
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
  const admin = await getAdminClient();
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
