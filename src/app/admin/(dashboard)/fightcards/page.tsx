import Link from "next/link";
import { Plus, ShieldAlert } from "lucide-react";
import { FightcardBoard } from "@/components/admin/FightcardBoard";
import type { FighterProfileOption } from "@/components/admin/FighterProfilePicker";
import { upcomingEvent } from "@/data/events";
import type { FightParticipantRow, FightRow } from "@/lib/admin/actions/fightcards";
import {
  mergeFightcardSettings,
  type FightcardSettings,
  type FightcardSettingsRow
} from "@/lib/admin/fightcard-settings";
import { loadVerifiedFighterOptions } from "@/lib/admin/fighters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Fightcard | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const fightCardSelect =
  "id, event_id, sort_order, matchup_type, label, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, rounds, round_duration, scheduled_at, winner_corner, is_main_event, is_visible, status, notes";

const teamFightCardSelect =
  "id, event_id, sort_order, matchup_type, label, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, is_main_event, is_visible, status, notes";

const legacyFightCardSelect =
  "id, event_id, sort_order, label, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, is_main_event, is_visible, status, notes";

const baseFightCardSelect =
  "id, event_id, sort_order, label, fighter_a, fighter_b, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, is_main_event, is_visible, status, notes";

const participantSelect =
  "id, fight_card_id, corner, slot, fighter_user_id, display_name, image_path, is_tba";

type AdminFightcardsPageProps = {
  searchParams: Promise<{ event?: string; tab?: string; edit?: string }>;
};

const fightcardTabs = ["overview", "list", "tournament", "add", "settings"] as const;

function dateLabelFor(event: { date_label: string | null; event_date: string | null }) {
  if (event.date_label) {
    return event.date_label;
  }
  if (!event.event_date) {
    return "Datum offen";
  }
  return new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(event.event_date)
  );
}

function normalizeFightRow(row: Partial<FightRow>): FightRow {
  return {
    id: row.id ?? 0,
    event_id: row.event_id ?? 0,
    sort_order: row.sort_order ?? 0,
    matchup_type: row.matchup_type ?? "single",
    label: row.label ?? null,
    corner_a_label: row.corner_a_label ?? row.fighter_a ?? null,
    corner_b_label: row.corner_b_label ?? row.fighter_b ?? null,
    corner_a_country_code: row.corner_a_country_code ?? null,
    corner_b_country_code: row.corner_b_country_code ?? null,
    fighter_a_user_id: row.fighter_a_user_id ?? null,
    fighter_b_user_id: row.fighter_b_user_id ?? null,
    fighter_a: row.fighter_a ?? null,
    fighter_b: row.fighter_b ?? null,
    fighter_a_image_path: row.fighter_a_image_path ?? null,
    fighter_b_image_path: row.fighter_b_image_path ?? null,
    fighter_a_is_tba: row.fighter_a_is_tba ?? !row.fighter_a,
    fighter_b_is_tba: row.fighter_b_is_tba ?? !row.fighter_b,
    weight_class: row.weight_class ?? null,
    discipline: row.discipline ?? null,
    rounds: row.rounds ?? 3,
    round_duration: row.round_duration ?? "3 Minuten",
    scheduled_at: row.scheduled_at ?? null,
    winner_corner: row.winner_corner ?? null,
    is_main_event: row.is_main_event ?? false,
    is_visible: row.is_visible ?? false,
    status: row.status ?? "planned",
    notes: row.notes ?? null,
    fight_card_participants: row.fight_card_participants ?? []
  };
}

export default async function AdminFightcardsPage({ searchParams }: AdminFightcardsPageProps) {
  const { event, tab, edit } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let events: Array<{ id: number; slug: string; name: string; dateLabel: string; location: string }> = [];
  let fights: FightRow[] = [];
  let fighterOptions: FighterProfileOption[] = [];
  let settings: FightcardSettings = mergeFightcardSettings(null);
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const [{ data: eventData, error: eventError }, fighterOptionsResult] = await Promise.all([
      supabase
        .from("events")
        .select("id, slug, name, date_label, event_date, location")
        .order("event_date", { ascending: false, nullsFirst: false }),
      loadVerifiedFighterOptions(supabase)
    ]);

    if (eventError || fighterOptionsResult.error) {
      loadError = eventError?.message ?? fighterOptionsResult.error?.message ?? "Fightcard-Daten konnten nicht geladen werden.";
    } else {
      events = (eventData ?? []).map((item) => {
        const row = item as {
          id: number;
          slug: string;
          name: string;
          date_label: string | null;
          event_date: string | null;
          location: string | null;
        };
        return {
          id: row.id,
          slug: row.slug,
          name: row.name,
          dateLabel: dateLabelFor(row),
          location: row.location ?? "Ort offen"
        };
      });
      fighterOptions = fighterOptionsResult.options;
    }
  }

  const selectedEventId = Number.parseInt(event ?? "", 10);
  const activeEventId = Number.isFinite(selectedEventId) && events.some((item) => item.id === selectedEventId)
    ? selectedEventId
    : events.find((item) => item.slug === upcomingEvent.id)?.id ?? events[0]?.id;

  if (supabase && !loadError && activeEventId) {
    const fightResult = await supabase
      .from("fight_cards")
      .select(fightCardSelect)
      .eq("event_id", activeEventId)
      .order("sort_order", { ascending: true });

    let fightData = fightResult.data as Array<Partial<FightRow>> | null;
    let fightError = fightResult.error;
    let teamColumnsMissing = Boolean(fightError?.message.includes("matchup_type") || fightError?.message.includes("corner_a_label"));
    const detailColumnsMissing = Boolean(
      fightError?.message.includes("rounds") ||
      fightError?.message.includes("round_duration") ||
      fightError?.message.includes("scheduled_at") ||
      fightError?.message.includes("winner_corner")
    );

    if (detailColumnsMissing && !teamColumnsMissing) {
      const teamResult = await supabase
        .from("fight_cards")
        .select(teamFightCardSelect)
        .eq("event_id", activeEventId)
        .order("sort_order", { ascending: true });

      fightData = teamResult.data as Array<Partial<FightRow>> | null;
      fightError = teamResult.error;
      teamColumnsMissing = Boolean(fightError?.message.includes("matchup_type") || fightError?.message.includes("corner_a_label"));
    }

    if (teamColumnsMissing) {
      const legacyResult = await supabase
        .from("fight_cards")
        .select(legacyFightCardSelect)
        .eq("event_id", activeEventId)
        .order("sort_order", { ascending: true });

      fightData = legacyResult.data as Array<Partial<FightRow>> | null;
      fightError = legacyResult.error;

      const imageColumnsMissing = Boolean(
        fightError?.message.includes("fighter_a_image_path") || fightError?.message.includes("fighter_a_user_id")
      );

      if (imageColumnsMissing) {
        const baseResult = await supabase
          .from("fight_cards")
          .select(baseFightCardSelect)
          .eq("event_id", activeEventId)
          .order("sort_order", { ascending: true });

        fightData = baseResult.data as Array<Partial<FightRow>> | null;
        fightError = baseResult.error;
      }
    }

    if (fightError) {
      loadError = `Fightcard konnte nicht geladen werden: ${fightError.message}`;
    } else {
      const fightRows = (fightData ?? []).map(normalizeFightRow);
      fights = fightRows;

      const fightIds = fightRows.map((fight) => fight.id);
      if (!teamColumnsMissing && fightIds.length > 0) {
        const { data: participantData, error: participantError } = await supabase
          .from("fight_card_participants")
          .select(participantSelect)
          .in("fight_card_id", fightIds)
          .order("slot", { ascending: true });

        if (!participantError) {
          const participantsByFight = new Map<number, FightParticipantRow[]>();
          for (const participant of (participantData ?? []) as FightParticipantRow[]) {
            const fightId = participant.fight_card_id;
            if (!fightId) {
              continue;
            }
            participantsByFight.set(fightId, [...(participantsByFight.get(fightId) ?? []), participant]);
          }

          fights = fightRows.map((fight) => ({
            ...fight,
            fight_card_participants: participantsByFight.get(fight.id) ?? []
          }));
        }
      }

      const { data: settingsData } = await supabase
        .from("fightcard_settings")
        .select("event_id, general, display, tournament, system, categories, weight_classes, rules, points, media")
        .eq("event_id", activeEventId)
        .maybeSingle();

      settings = mergeFightcardSettings(settingsData as Partial<FightcardSettingsRow> | null);
    }
  }

  const activeTab = fightcardTabs.includes(tab as (typeof fightcardTabs)[number])
    ? (tab as (typeof fightcardTabs)[number])
    : "overview";

  return (
    <div>
      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      {!loadError && events.length === 0 ? (
        <section className="adm-panel">
          <div className="adm-empty-inline">
            <ShieldAlert aria-hidden="true" size={30} />
            <strong>Noch keine Veranstaltung vorhanden</strong>
            <p>Lege zuerst ein echtes Event an. Danach kann hier die Fightcard dafür gepflegt werden.</p>
            <Link className="adm-btn adm-btn--primary" href="/admin/events/new">
              <Plus aria-hidden="true" size={16} /> Event anlegen
            </Link>
          </div>
        </section>
      ) : activeEventId ? (
        <FightcardBoard
          events={events}
          activeEventId={activeEventId}
          fights={fights}
          fighterOptions={fighterOptions}
          settings={settings}
          initialTab={activeTab}
          editFightId={edit ?? null}
        />
      ) : null}
    </div>
  );
}
