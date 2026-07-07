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
  formFile,
  getAdminClient,
  supabaseErrorMessage,
  uploadAdminMediaAsset,
  cleanupReplacedAdminMedia
} from "@/lib/admin/action-helpers";
import { DEFAULT_FIGHTCARD_SETTINGS, type FightcardSettings } from "@/lib/admin/fightcard-settings";
import { FIGHT_MATCHUP_TYPES, FIGHT_STATUSES } from "@/lib/admin/resource-shared";

export type FightStatus = (typeof FIGHT_STATUSES)[number];
export type FightMatchupType = (typeof FIGHT_MATCHUP_TYPES)[number];
type AdminSupabaseClient = Extract<AdminClientResult, { ok: true }>["supabase"];
type FightCorner = "red" | "blue";

export type FightParticipantRow = {
  id?: number;
  fight_card_id?: number;
  corner: FightCorner;
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
  rounds: number | null;
  round_duration: string | null;
  scheduled_at: string | null;
  winner_corner: FightCorner | null;
  is_main_event: boolean;
  is_visible: boolean;
  status: FightStatus;
  notes: string | null;
  fight_card_participants?: FightParticipantRow[] | null;
};

type ParticipantPayload = Omit<FightParticipantRow, "id" | "fight_card_id">;

function normalizedFightName(value: string | null) {
  return value?.trim().replace(/\s+/g, " ").toLowerCase() ?? "";
}

function isTeamMatchup(matchupType: string): matchupType is Exclude<FightMatchupType, "single"> {
  return matchupType.startsWith("team_");
}

function teamSizeForMatchup(matchupType: string) {
  if (!isTeamMatchup(matchupType)) {
    return 1;
  }

  const parsed = Number.parseInt(matchupType.match(/team_(\d)v\d/)?.[1] ?? "1", 10);
  return [1, 2, 3, 4].includes(parsed) ? parsed : 1;
}

function participantName(participant: ParticipantPayload | undefined) {
  return participant?.display_name?.trim() || null;
}

function firstImage(participants: ParticipantPayload[]) {
  return participants.find((participant) => participant.image_path)?.image_path ?? null;
}

function parseScheduledAt(formData: FormData) {
  const value = fieldText(formData, "scheduled_at");
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseWinnerCorner(formData: FormData) {
  const value = fieldText(formData, "winner_corner");
  return value === "red" || value === "blue" ? value : null;
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

async function participantFromForm(
  supabase: AdminSupabaseClient,
  formData: FormData,
  prefix: string,
  corner: FightCorner,
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

async function participantsForPayload(
  supabase: AdminSupabaseClient,
  formData: FormData,
  matchupType: FightMatchupType
) {
  if (!isTeamMatchup(matchupType)) {
    return [
      await participantFromForm(supabase, formData, "fighter_a", "red", 1),
      await participantFromForm(supabase, formData, "fighter_b", "blue", 1)
    ];
  }

  const teamSize = teamSizeForMatchup(matchupType);
  const results = [];
  for (let slot = 1; slot <= teamSize; slot += 1) {
    results.push(await participantFromForm(supabase, formData, `participant_red_${slot}`, "red", slot));
  }
  for (let slot = 1; slot <= teamSize; slot += 1) {
    results.push(await participantFromForm(supabase, formData, `participant_blue_${slot}`, "blue", slot));
  }
  return results;
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

  const typedMatchup = matchupType as FightMatchupType;
  const participantResults = await participantsForPayload(supabase, formData, typedMatchup);
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

  const isTeamFight = isTeamMatchup(typedMatchup);
  const isVisible = fieldBool(formData, "is_visible");
  const cornerALabel = fieldTextOrNull(formData, "corner_a_label");
  const cornerBLabel = fieldTextOrNull(formData, "corner_b_label");
  const redParticipants = participants.filter((participant) => participant.corner === "red");
  const blueParticipants = participants.filter((participant) => participant.corner === "blue");
  const fighterA = isTeamFight ? cornerALabel : participantName(redParticipants[0]);
  const fighterB = isTeamFight ? cornerBLabel : participantName(blueParticipants[0]);

  if (!isTeamFight && redParticipants[0].fighter_user_id && redParticipants[0].fighter_user_id === blueParticipants[0].fighter_user_id) {
    return { error: "Ein Kämpfer kann nicht gegen sich selbst angesetzt werden." } as const;
  }

  if (isTeamFight) {
    if (!cornerALabel || !cornerBLabel) {
      return { error: "Bitte beide Länder oder Teamnamen eintragen." } as const;
    }
    if (normalizedFightName(cornerALabel) === normalizedFightName(cornerBLabel)) {
      return { error: "Ein Länderduell braucht zwei unterschiedliche Länder oder Teams." } as const;
    }
  }

  if (isVisible && !isTeamFight && (!fighterA || !fighterB)) {
    return { error: "Ein sichtbarer Einzelkampf braucht beide Kämpfer oder muss verborgen bleiben." } as const;
  }

  return {
    payload: {
      event_id: eventId,
      sort_order: fieldInt(formData, "sort_order", 0),
      matchup_type: typedMatchup,
      label: fieldTextOrNull(formData, "label"),
      corner_a_label: isTeamFight ? cornerALabel : fighterA,
      corner_b_label: isTeamFight ? cornerBLabel : fighterB,
      corner_a_country_code: fieldTextOrNull(formData, "corner_a_country_code"),
      corner_b_country_code: fieldTextOrNull(formData, "corner_b_country_code"),
      fighter_a_user_id: !isTeamFight ? redParticipants[0].fighter_user_id : null,
      fighter_b_user_id: !isTeamFight ? blueParticipants[0].fighter_user_id : null,
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
      rounds: Math.max(1, fieldInt(formData, "rounds", 3)),
      round_duration: fieldTextOrNull(formData, "round_duration") ?? "3 Minuten",
      scheduled_at: parseScheduledAt(formData),
      winner_corner: parseWinnerCorner(formData),
      is_main_event: fieldBool(formData, "is_main_event"),
      is_visible: isVisible,
      status: status as FightStatus,
      notes: fieldTextOrNull(formData, "notes")
    },
    participants
  } as const;
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

export async function updateFightStatusAction(id: number, status: FightStatus): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  if (!FIGHT_STATUSES.includes(status)) {
    return { ok: false, error: "Ungültiger Kampfstatus." };
  }

  const { error } = await admin.supabase.from("fight_cards").update({ status }).eq("id", id);
  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: "Status aktualisiert." };
}

export async function setFightWinnerAction(id: number, winnerCorner: FightCorner | null): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { error } = await admin.supabase
    .from("fight_cards")
    .update({ winner_corner: winnerCorner, status: winnerCorner ? "completed" : "planned" })
    .eq("id", id);

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  revalidateFightcards();
  return { ok: true, message: winnerCorner ? "Gewinner gesetzt." : "Gewinner zurückgesetzt." };
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
  return { ok: true, message: "Fightcard veröffentlicht - alle Kämpfe sind sichtbar." };
}

export async function duplicateFightAction(id: number): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const { data: current, error: currentError } = await admin.supabase
    .from("fight_cards")
    .select(
      "id, event_id, sort_order, matchup_type, label, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, rounds, round_duration, scheduled_at, winner_corner, is_main_event, is_visible, status, notes"
    )
    .eq("id", id)
    .maybeSingle();

  if (currentError || !current) {
    return { ok: false, error: "Kampf wurde nicht gefunden." };
  }

  const fight = current as FightRow;
  const { data: last } = await admin.supabase
    .from("fight_cards")
    .select("sort_order")
    .eq("event_id", fight.event_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder = ((last as { sort_order: number } | null)?.sort_order ?? fight.sort_order) + 10;
  const clonePayload = {
    event_id: fight.event_id,
    sort_order: nextSortOrder,
    matchup_type: fight.matchup_type,
    label: fight.label,
    corner_a_label: fight.corner_a_label,
    corner_b_label: fight.corner_b_label,
    corner_a_country_code: fight.corner_a_country_code,
    corner_b_country_code: fight.corner_b_country_code,
    fighter_a_user_id: fight.fighter_a_user_id,
    fighter_b_user_id: fight.fighter_b_user_id,
    fighter_a: fight.fighter_a,
    fighter_b: fight.fighter_b,
    fighter_a_image_path: fight.fighter_a_image_path,
    fighter_b_image_path: fight.fighter_b_image_path,
    fighter_a_is_tba: fight.fighter_a_is_tba,
    fighter_b_is_tba: fight.fighter_b_is_tba,
    weight_class: fight.weight_class,
    discipline: fight.discipline,
    rounds: fight.rounds,
    round_duration: fight.round_duration,
    scheduled_at: fight.scheduled_at,
    winner_corner: null,
    is_main_event: false,
    is_visible: false,
    status: "planned" as FightStatus,
    notes: fight.notes
  };

  const { data: inserted, error: insertError } = await admin.supabase
    .from("fight_cards")
    .insert(clonePayload)
    .select("id")
    .single();

  if (insertError) {
    return { ok: false, error: supabaseErrorMessage(insertError) };
  }

  const nextFight = inserted as Pick<FightRow, "id"> | null;
  if (!nextFight) {
    return { ok: false, error: "Kopie wurde erstellt, aber die ID konnte nicht geladen werden." };
  }

  const { data: participants, error: participantsError } = await admin.supabase
    .from("fight_card_participants")
    .select("corner, slot, fighter_user_id, display_name, image_path, is_tba")
    .eq("fight_card_id", id)
    .order("slot", { ascending: true });

  if (participantsError) {
    return { ok: false, error: supabaseErrorMessage(participantsError) };
  }

  if ((participants ?? []).length > 0) {
    const { error: cloneParticipantsError } = await admin.supabase.from("fight_card_participants").insert(
      ((participants ?? []) as ParticipantPayload[]).map((participant) => ({
        fight_card_id: nextFight.id,
        corner: participant.corner,
        slot: participant.slot,
        fighter_user_id: participant.fighter_user_id,
        display_name: participant.display_name,
        image_path: participant.image_path,
        is_tba: participant.is_tba
      }))
    );

    if (cloneParticipantsError) {
      return { ok: false, error: supabaseErrorMessage(cloneParticipantsError) };
    }
  }

  revalidateFightcards();
  return { ok: true, message: "Kampf dupliziert." };
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

function textList(formData: FormData, name: string, fallback: string[]) {
  const value = fieldText(formData, name);
  if (!value) {
    return fallback;
  }
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mergeBool(formData: FormData, name: string, fallback: boolean) {
  return formData.has(name) ? fieldBool(formData, name) : fallback;
}

function settingsPayload(formData: FormData, media: FightcardSettings["media"]): FightcardSettings {
  const defaultMatchupType = fieldText(formData, "default_matchup_type") || DEFAULT_FIGHTCARD_SETTINGS.general.defaultMatchupType;
  const defaultStatus = fieldText(formData, "default_status") || DEFAULT_FIGHTCARD_SETTINGS.general.defaultStatus;
  const defaultVisibility = fieldText(formData, "default_visibility") || DEFAULT_FIGHTCARD_SETTINGS.general.defaultVisibility;

  return {
    general: {
      defaultMatchupType: FIGHT_MATCHUP_TYPES.includes(defaultMatchupType as FightMatchupType)
        ? (defaultMatchupType as FightMatchupType)
        : DEFAULT_FIGHTCARD_SETTINGS.general.defaultMatchupType,
      defaultRounds: Math.max(1, fieldInt(formData, "default_rounds", DEFAULT_FIGHTCARD_SETTINGS.general.defaultRounds)),
      defaultRoundDuration:
        fieldTextOrNull(formData, "default_round_duration") ?? DEFAULT_FIGHTCARD_SETTINGS.general.defaultRoundDuration,
      defaultStatus: FIGHT_STATUSES.includes(defaultStatus as FightStatus)
        ? (defaultStatus as FightStatus)
        : DEFAULT_FIGHTCARD_SETTINGS.general.defaultStatus,
      defaultVisibility: defaultVisibility === "public" ? "public" : "admin"
    },
    display: {
      autoNumbering: mergeBool(formData, "display_auto_numbering", DEFAULT_FIGHTCARD_SETTINGS.display.autoNumbering),
      showNationality: mergeBool(formData, "display_show_nationality", DEFAULT_FIGHTCARD_SETTINGS.display.showNationality),
      showWeightClass: mergeBool(formData, "display_show_weight_class", DEFAULT_FIGHTCARD_SETTINGS.display.showWeightClass),
      showTeamLogos: mergeBool(formData, "display_show_team_logos", DEFAULT_FIGHTCARD_SETTINGS.display.showTeamLogos),
      showTeamFlags: mergeBool(formData, "display_show_team_flags", DEFAULT_FIGHTCARD_SETTINGS.display.showTeamFlags),
      hideCompleted: mergeBool(formData, "display_hide_completed", DEFAULT_FIGHTCARD_SETTINGS.display.hideCompleted)
    },
    tournament: {
      enabled: mergeBool(formData, "tournament_enabled", DEFAULT_FIGHTCARD_SETTINGS.tournament.enabled),
      maxTeamSize: Math.min(4, Math.max(1, fieldInt(formData, "tournament_max_team_size", 4))),
      publicBracket: mergeBool(formData, "tournament_public_bracket", DEFAULT_FIGHTCARD_SETTINGS.tournament.publicBracket),
      liveUpdates: mergeBool(formData, "tournament_live_updates", DEFAULT_FIGHTCARD_SETTINGS.tournament.liveUpdates)
    },
    system: {
      autosave: mergeBool(formData, "system_autosave", DEFAULT_FIGHTCARD_SETTINGS.system.autosave),
      saveHistory: mergeBool(formData, "system_save_history", DEFAULT_FIGHTCARD_SETTINGS.system.saveHistory),
      backupEnabled: mergeBool(formData, "system_backup", DEFAULT_FIGHTCARD_SETTINGS.system.backupEnabled)
    },
    categories: textList(formData, "categories", DEFAULT_FIGHTCARD_SETTINGS.categories),
    weightClasses: textList(formData, "weight_classes", DEFAULT_FIGHTCARD_SETTINGS.weightClasses),
    rules: {
      format: fieldTextOrNull(formData, "rules_format") ?? DEFAULT_FIGHTCARD_SETTINGS.rules.format,
      tiebreaker: fieldTextOrNull(formData, "rules_tiebreaker") ?? DEFAULT_FIGHTCARD_SETTINGS.rules.tiebreaker
    },
    points: {
      win: fieldInt(formData, "points_win", DEFAULT_FIGHTCARD_SETTINGS.points.win),
      draw: fieldInt(formData, "points_draw", DEFAULT_FIGHTCARD_SETTINGS.points.draw),
      loss: fieldInt(formData, "points_loss", DEFAULT_FIGHTCARD_SETTINGS.points.loss),
      teamWin: fieldTextOrNull(formData, "points_team_win") ?? DEFAULT_FIGHTCARD_SETTINGS.points.teamWin
    },
    media
  };
}

export async function saveFightcardSettingsAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const admin = await getAdminClient("fightcards.manage");
  if (!admin.ok) {
    return { ok: false, error: admin.error };
  }

  const eventId = fieldInt(formData, "event_id", 0);
  if (!eventId) {
    return { ok: false, error: "Bitte eine Veranstaltung auswählen." };
  }

  const { data: existingSettingsData, error: existingSettingsError } = await admin.supabase
    .from("fightcard_settings")
    .select("media")
    .eq("event_id", eventId)
    .maybeSingle();

  if (existingSettingsError) {
    return { ok: false, error: supabaseErrorMessage(existingSettingsError) };
  }

  const existingMedia =
    (existingSettingsData as { media: FightcardSettings["media"] | null } | null)?.media ?? null;

  let media: FightcardSettings["media"] = {
    bannerUrl: fieldBool(formData, "clear_banner_url") ? null : fieldHrefOrNull(formData, "media_banner_url"),
    logoUrl: fieldBool(formData, "clear_logo_url") ? null : fieldHrefOrNull(formData, "media_logo_url")
  };

  const bannerFile = formFile(formData, "banner_file");
  if (bannerFile) {
    const upload = await uploadAdminMediaAsset({
      supabase: admin.supabase,
      file: bannerFile,
      folder: `fightcards/${eventId}`,
      assetType: "Veranstaltung",
      altText: "Fightcard Banner",
      usageNote: "Admin Fightcard Standard Banner",
      isPublic: true,
      isChecked: true
    });

    if (!upload.ok) {
      return { ok: false, error: upload.error };
    }
    media = { ...media, bannerUrl: upload.publicUrl };
  }

  const logoFile = formFile(formData, "logo_file");
  if (logoFile) {
    const upload = await uploadAdminMediaAsset({
      supabase: admin.supabase,
      file: logoFile,
      folder: `fightcards/${eventId}`,
      assetType: "Logo",
      altText: "Fightcard Event Logo",
      usageNote: "Admin Fightcard Event Logo",
      isPublic: true,
      isChecked: true
    });

    if (!upload.ok) {
      return { ok: false, error: upload.error };
    }
    media = { ...media, logoUrl: upload.publicUrl };
  }

  const settings = settingsPayload(formData, media);
  const { error } = await admin.supabase.from("fightcard_settings").upsert(
    {
      event_id: eventId,
      general: settings.general,
      display: settings.display,
      tournament: settings.tournament,
      system: settings.system,
      categories: settings.categories,
      weight_classes: settings.weightClasses,
      rules: settings.rules,
      points: settings.points,
      media: settings.media
    },
    { onConflict: "event_id" }
  );

  if (error) {
    return { ok: false, error: supabaseErrorMessage(error) };
  }

  const cleanupBanner = await cleanupReplacedAdminMedia({
    supabase: admin.supabase,
    previousUrl: existingMedia?.bannerUrl,
    nextUrl: settings.media.bannerUrl
  });
  if (!cleanupBanner.ok) {
    return cleanupBanner;
  }

  const cleanupLogo = await cleanupReplacedAdminMedia({
    supabase: admin.supabase,
    previousUrl: existingMedia?.logoUrl,
    nextUrl: settings.media.logoUrl
  });
  if (!cleanupLogo.ok) {
    return cleanupLogo;
  }

  revalidateFightcards();
  return { ok: true, message: "Fightcard-Einstellungen gespeichert." };
}
