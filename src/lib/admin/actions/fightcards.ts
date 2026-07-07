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
import { FIGHT_MATCHUP_TYPES, FIGHT_STATUSES } from "@/lib/admin/resource-shared";

export type FightStatus = (typeof FIGHT_STATUSES)[number];
export type FightMatchupType = (typeof FIGHT_MATCHUP_TYPES)[number];
type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];

export type FightParticipantRow = {
  id?: number;
  fight_card_id?: number;
  corner: "red" | "blue";
  slot: number;
  fighter_user_id: string | null;
  display_name: string | null;
  image_path: string | null;
  is_tba: boolean;
};

export type FightRow = {
  id: number;
  event_id: number;
  sort_order: number;
  matchup_type: FightMatchupType;
  label: string | null;
  corner_a_label: string | null;
  corner_b_label: string | null;
  corner_a_country_code: string | null;
  corner_b_country_code: string | null;
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
  fight_card_participants?: FightParticipantRow[] | null;
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

type ParticipantPayload = Omit<FightParticipantRow, "id" | "fight_card_id">;

async function participantFromForm(
  supabase: AdminSupabaseClient,
  formData: FormData,
  prefix: string,
  corner: "red" | "blue",
  slot: number
) {
  const fighterUserId = fieldTextOrNull(formData, `${prefix}_user_id`);
  const fighterResult = await verifiedFighterSnapshot(supabase, fighterUserId);

  if (fighterResult && !fighterResult.ok) {
    return { error: fighterResult.error } as const;
  }

  const manualName = fieldTextOrNull(formData, prefix);
  const displayName = fighterResult?.ok ? fighterResult.name : manualName;

  return {
    participant: {
      corner,
      slot,
      fighter_user_id: fighterResult?.ok ? fighterResult.userId : null,
      display_name: displayName,
      image_path: fighterResult?.ok ? fighterResult.imagePath : fieldHrefOrNull(formData, `${prefix}_image_path`),
      is_tba: !displayName
    },
    weightClass: fighterResult?.ok ? fighterResult.weightClass : null
  } as const;
}

function participantName(participant: ParticipantPayload) {
  return participant.display_name?.trim() || null;
}

function firstImage(participants: ParticipantPayload[]) {
  return participants.find((participant) => participant.image_path)?.image_path ?? null;
}

function duplicateParticipantError(participants: ParticipantPayload[]) {
  const userIds = participants
    .map((participant) => participant.fighter_user_id)
    .filter((userId): userId is string => Boolean(userId));
  if (new Set(userIds).size !== userIds.length) {
    return "Ein Kämpfer kann nicht doppelt im selben Matchup eingetragen werden.";
  }

  const names = participants
    .map((participant) => normalizedFightName(participant.display_name))
    .filter(Boolean);
  if (new Set(names).size !== names.length) {
    return "Ein manueller Teilnehmername ist im selben Matchup doppelt vergeben.";
  }

  return null;
}

async function fightPayload(supabase: AdminSupabaseClient, formData: FormData) {
  const eventId = fieldInt(formData, "event_id", 0);
  if (!eventId) {
    return { error: "Bitte eine Veranstaltung auswählen." } as const;
  }

  const matchupType = fieldText(formData, "matchup_type") || "single";
  if (!FIGHT_MATCHUP_TYPES.includes(matchupType as FightMatchupType)) {
    return { error: "Ungültiger Matchup-Typ." } as const;
  }

  const status = fieldText(formData, "status") || "planned";
  if (!FIGHT_STATUSES.includes(status as FightStatus)) {
    return { error: "Ungültiger Kampfstatus." } as const;
  }

  const isVisible = fieldBool(formData, "is_visible");
  const participantResults =
    matchupType === "team_2v2"
      ? [
          await participantFromForm(supabase, formData, "participant_red_1", "red", 1),
          await participantFromForm(supabase, formData, "participant_red_2", "red", 2),
          await participantFromForm(supabase, formData, "participant_blue_1", "blue", 1),
          await participantFromForm(supabase, formData, "participant_blue_2", "blue", 2)
        ]
      : [
          await participantFromForm(supabase, formData, "fighter_a", "red", 1),
          await participantFromForm(supabase, formData, "fighter_b", "blue", 1)
        ];

  const participantError = participantResults.find((result) => "error" in result);
  if (participantError && "error" in participantError) {
    return { error: participantError.error } as const;
  }

  const validParticipantResults = participantResults as Array<{
    participant: ParticipantPayload;
    weightClass: string | null;
  }>;
  const participants = validParticipantResults.map((result) => result.participant);
  const duplicateError = duplicateParticipantError(participants);

  if (duplicateError) {
    return { error: duplicateError } as const;
  }

  const cornerALabel = fieldTextOrNull(formData, "corner_a_label");
  const cornerBLabel = fieldTextOrNull(formData, "corner_b_label");
  const redParticipants = participants.filter((participant) => participant.corner === "red");
  const blueParticipants = participants.filter((participant) => participant.corner === "blue");
  const fighterA = matchupType === "team_2v2" ? cornerALabel : participantName(redParticipants[0]);
  const fighterB = matchupType === "team_2v2" ? cornerBLabel : participantName(blueParticipants[0]);

  if (matchupType === "single" && redParticipants[0].fighter_user_id && redParticipants[0].fighter_user_id === blueParticipants[0].fighter_user_id) {
    return { error: "Ein Kämpfer kann nicht gegen sich selbst angesetzt werden." } as const;
  }

  if (matchupType === "team_2v2") {
    if (!cornerALabel || !cornerBLabel) {
      return { error: "Bitte beide Länder oder Teamnamen eintragen." } as const;
    }
    if (normalizedFightName(cornerALabel) === normalizedFightName(cornerBLabel)) {
      return { error: "Ein Länderduell braucht zwei unterschiedliche Länder oder Teams." } as const;
    }
  }

  if (isVisible && matchupType === "single" && (!fighterA || !fighterB)) {
    return { error: "Ein sichtbarer Einzelkampf braucht beide Kämpfer oder muss verborgen bleiben." } as const;
  }

  return {
    payload: {
      event_id: eventId,
      sort_order: fieldInt(formData, "sort_order", 0),
      matchup_type: matchupType as FightMatchupType,
      label: fieldTextOrNull(formData, "label"),
      corner_a_label: matchupType === "team_2v2" ? cornerALabel : fighterA,
      corner_b_label: matchupType === "team_2v2" ? cornerBLabel : fighterB,
      corner_a_country_code: fieldTextOrNull(formData, "corner_a_country_code"),
      corner_b_country_code: fieldTextOrNull(formData, "corner_b_country_code"),
      fighter_a_user_id: matchupType === "single" ? redParticipants[0].fighter_user_id : null,
      fighter_b_user_id: matchupType === "single" ? blueParticipants[0].fighter_user_id : null,
      fighter_a: fighterA,
      fighter_b: fighterB,
      fighter_a_image_path: firstImage(redParticipants),
      fighter_b_image_path: firstImage(blueParticipants),
      fighter_a_is_tba: !fighterA,
      fighter_b_is_tba: !fighterB,
      weight_class:
        fieldTextOrNull(formData, "weight_class") ??
        validParticipantResults.find((result) => result.weightClass)?.weightClass ??
        null,
      discipline: fieldTextOrNull(formData, "discipline"),
      is_main_event: fieldBool(formData, "is_main_event"),
      is_visible: isVisible,
      status: status as FightStatus,
      notes: fieldTextOrNull(formData, "notes")
    },
    participants
  } as const;
}

function normalizedFightName(value: string | null) {
  return value?.trim().replace(/\s+/g, " ").toLowerCase() ?? "";
}

async function replaceFightParticipants(
  supabase: AdminSupabaseClient,
  fightId: number,
  participants: ParticipantPayload[]
) {
  const { error: deleteError } = await supabase.from("fight_card_participants").delete().eq("fight_card_id", fightId);
  if (deleteError) {
    return supabaseErrorMessage(deleteError);
  }

  if (participants.length === 0) {
    return null;
  }

  const { error: insertError } = await supabase.from("fight_card_participants").insert(
    participants.map((participant) => ({
      fight_card_id: fightId,
      corner: participant.corner,
      slot: participant.slot,
      fighter_user_id: participant.fighter_user_id,
      display_name: participant.display_name,
      image_path: participant.image_path,
      is_tba: participant.is_tba
    }))
  );

  return insertError ? supabaseErrorMessage(insertError) : null;
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

  const { data, error } = await admin.supabase.from("fight_cards").insert(result.payload).select("id").single();
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const fight = data as Pick<FightRow, "id"> | null;
  if (!fight) {
    return { ok: false, error: "Kampf wurde gespeichert, aber die ID konnte nicht geladen werden." };
  }

  const participantError = await replaceFightParticipants(admin.supabase, fight.id, result.participants);
  if (participantError) {
    return { ok: false, error: participantError };
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

  const participantError = await replaceFightParticipants(admin.supabase, id, result.participants);
  if (participantError) {
    return { ok: false, error: participantError };
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
