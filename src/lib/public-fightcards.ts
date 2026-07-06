import { createClient } from "@supabase/supabase-js";
import { fightcards, type FightCardEntry } from "@/data/fightcards";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type EventIdRow = {
  id: number;
  slug: string;
};

type PublicFightCardRow = {
  id: number;
  event_id: number;
  sort_order: number | null;
  label: string | null;
  fighter_a: string | null;
  fighter_b: string | null;
  fighter_a_image_path: string | null;
  fighter_b_image_path: string | null;
  weight_class: string | null;
  discipline: string | null;
  is_visible: boolean | null;
};

function fallbackFightcards(eventSlug: string) {
  return fightcards
    .filter((fight) => fight.eventId === eventSlug && fight.visible)
    .sort((a, b) => a.order - b.order);
}

function rowToFightCard(row: PublicFightCardRow, eventSlug: string): FightCardEntry {
  return {
    id: String(row.id),
    eventId: eventSlug,
    order: row.sort_order ?? 0,
    fighterA: row.fighter_a || "Wird bekanntgegeben",
    fighterB: row.fighter_b || "Wird bekanntgegeben",
    fighterAImage: row.fighter_a_image_path ?? undefined,
    fighterBImage: row.fighter_b_image_path ?? undefined,
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
      "id, event_id, sort_order, label, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, weight_class, discipline, is_visible"
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
