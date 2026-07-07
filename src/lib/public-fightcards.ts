import { createClient } from "@supabase/supabase-js";
import { fightcards, type FightCardEntry, type FightMatchupType, type FightParticipant } from "@/data/fightcards";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type EventIdRow = {
  id: number;
  slug: string;
};

type PublicFightCardRow = {
  id: number;
  event_id: number;
  sort_order: number | null;
  matchup_type: FightMatchupType | null;
  label: string | null;
  fighter_a: string | null;
  fighter_b: string | null;
  fighter_a_image_path: string | null;
  fighter_b_image_path: string | null;
  weight_class: string | null;
  discipline: string | null;
  corner_a_label: string | null;
  corner_b_label: string | null;
  corner_a_country_code: string | null;
  corner_b_country_code: string | null;
  is_visible: boolean | null;
  fight_card_participants?: PublicFightParticipantRow[] | null;
};

type PublicFightParticipantRow = {
  id: number;
  corner: "red" | "blue";
  slot: number;
  fighter_user_id: string | null;
  display_name: string | null;
  image_path: string | null;
  is_tba: boolean | null;
};

function fallbackFightcards(eventSlug: string) {
  return fightcards
    .filter((fight) => fight.eventId === eventSlug && fight.visible)
    .sort((a, b) => a.order - b.order);
}

function fallbackParticipant(slot: number, name: string | null, image?: string | null): FightParticipant {
  const displayName = name || "Wird bekanntgegeben";
  return {
    slot,
    name: displayName,
    image: image ?? undefined,
    isTba: !name,
    userId: null
  };
}

function rowParticipants(row: PublicFightCardRow, corner: "red" | "blue") {
  const participants = (row.fight_card_participants ?? [])
    .filter((participant) => participant.corner === corner)
    .sort((a, b) => a.slot - b.slot)
    .map((participant) => ({
      slot: participant.slot,
      name: participant.display_name || "Wird bekanntgegeben",
      image: participant.image_path ?? undefined,
      isTba: Boolean(participant.is_tba) || !participant.display_name,
      userId: participant.fighter_user_id
    }));

  if (participants.length > 0) {
    return participants;
  }

  return corner === "red"
    ? [fallbackParticipant(1, row.fighter_a, row.fighter_a_image_path)]
    : [fallbackParticipant(1, row.fighter_b, row.fighter_b_image_path)];
}

function rowToFightCard(row: PublicFightCardRow, eventSlug: string): FightCardEntry {
  const matchupType = row.matchup_type === "team_2v2" ? "team_2v2" : "single";
  const redParticipants = rowParticipants(row, "red");
  const blueParticipants = rowParticipants(row, "blue");
  const fighterA = matchupType === "team_2v2"
    ? row.corner_a_label || row.fighter_a || "Team Rot"
    : redParticipants[0]?.name ?? row.fighter_a ?? "Wird bekanntgegeben";
  const fighterB = matchupType === "team_2v2"
    ? row.corner_b_label || row.fighter_b || "Team Blau"
    : blueParticipants[0]?.name ?? row.fighter_b ?? "Wird bekanntgegeben";

  return {
    id: String(row.id),
    eventId: eventSlug,
    order: row.sort_order ?? 0,
    matchupType,
    fighterA,
    fighterB,
    redCorner: {
      label: matchupType === "team_2v2" ? fighterA : redParticipants[0]?.name ?? fighterA,
      countryCode: row.corner_a_country_code ?? undefined,
      participants: redParticipants
    },
    blueCorner: {
      label: matchupType === "team_2v2" ? fighterB : blueParticipants[0]?.name ?? fighterB,
      countryCode: row.corner_b_country_code ?? undefined,
      participants: blueParticipants
    },
    fighterAImage: redParticipants[0]?.image ?? row.fighter_a_image_path ?? undefined,
    fighterBImage: blueParticipants[0]?.image ?? row.fighter_b_image_path ?? undefined,
    weightClass: row.weight_class || "Wird nachgetragen",
    discipline: row.discipline || "Disziplin wird bekanntgegeben",
    label: row.label ?? undefined,
    visible: Boolean(row.is_visible)
  };
}

export async function getPublicFightcardsForEvent(eventSlug: string): Promise<FightCardEntry[]> {
  if (!isSupabaseConfigured()) {
    return fallbackFightcards(eventSlug);
  }

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, slug")
    .eq("slug", eventSlug)
    .eq("status", "published")
    .maybeSingle();

  if (eventError || !event) {
    return fallbackFightcards(eventSlug);
  }

  const eventRow = event as EventIdRow;
  const { data, error } = await supabase
    .from("fight_cards")
    .select(
      "id, event_id, sort_order, matchup_type, label, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, weight_class, discipline, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, is_visible, fight_card_participants(id, corner, slot, fighter_user_id, display_name, image_path, is_tba)"
    )
    .eq("event_id", eventRow.id)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return fallbackFightcards(eventSlug);
  }

  const fights = ((data ?? []) as PublicFightCardRow[]).map((row) => rowToFightCard(row, eventSlug));
  return fights.length > 0 ? fights : fallbackFightcards(eventSlug);
}

export function pickFeaturedFight(fights: FightCardEntry[]) {
  return [...fights].sort((a, b) => {
    const aMain = a.label?.toLowerCase() === "main event" ? -1 : 0;
    const bMain = b.label?.toLowerCase() === "main event" ? -1 : 0;
    return aMain - bMain || a.order - b.order;
  })[0];
}
