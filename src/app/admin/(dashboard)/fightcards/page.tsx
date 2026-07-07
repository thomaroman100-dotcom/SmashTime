import Link from "next/link";
import { ListOrdered, Plus, ShieldAlert } from "lucide-react";
import { FightcardBoard } from "@/components/admin/FightcardBoard";
import type { FighterProfileOption } from "@/components/admin/FighterProfilePicker";
import { upcomingEvent } from "@/data/events";
import type { FightRow } from "@/lib/admin/actions/fightcards";
import { loadVerifiedFighterOptions } from "@/lib/admin/fighters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Fightcard | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type AdminFightcardsPageProps = {
  searchParams: Promise<{ event?: string }>;
};

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

export default async function AdminFightcardsPage({ searchParams }: AdminFightcardsPageProps) {
  const { event } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let events: Array<{ id: number; slug: string; name: string; dateLabel: string; location: string }> = [];
  let fights: FightRow[] = [];
  let fighterOptions: FighterProfileOption[] = [];
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
    const { data, error } = await supabase
      .from("fight_cards")
      .select(
        "id, event_id, sort_order, matchup_type, label, corner_a_label, corner_b_label, corner_a_country_code, corner_b_country_code, fighter_a_user_id, fighter_b_user_id, fighter_a, fighter_b, fighter_a_image_path, fighter_b_image_path, fighter_a_is_tba, fighter_b_is_tba, weight_class, discipline, is_main_event, is_visible, status, notes, fight_card_participants(id, fight_card_id, corner, slot, fighter_user_id, display_name, image_path, is_tba)"
      )
      .eq("event_id", activeEventId)
      .order("sort_order", { ascending: true });

    if (error) {
      loadError = `Fightcard konnte nicht geladen werden: ${error.message}`;
    } else {
      fights = (data ?? []) as FightRow[];
    }
  }

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Fightcard</h1>
          <p>Organisiere und verwalte alle Kämpfe für das ausgewählte Event.</p>
        </div>
      </div>

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
        <div className="adm-cols adm-cols--main-rail">
          <section>
            <FightcardBoard events={events} activeEventId={activeEventId} fights={fights} fighterOptions={fighterOptions} />
          </section>
          <aside className="adm-rail">
            <section className="adm-panel">
              <div className="adm-panel__head">
                <ListOrdered aria-hidden="true" size={16} />
                <div className="adm-panel__head-text">
                  <h2>Event-Zusammenfassung</h2>
                  <p>Diese Fightcard ist direkt mit dem gewählten Event verbunden.</p>
                </div>
              </div>
              <div className="adm-panel__body">
                <div className="adm-system-list">
                  <article className="adm-system-row">
                    <span className="adm-system-row__icon">
                      <ListOrdered aria-hidden="true" size={20} />
                    </span>
                    <span>
                      <strong>{fights.length} Kämpfe</strong>
                      <small>In dieser Fightcard angelegt</small>
                    </span>
                  </article>
                  <article className="adm-system-row">
                    <span className="adm-system-row__icon">
                      <ListOrdered aria-hidden="true" size={20} />
                    </span>
                    <span>
                      <strong>{fights.filter((fight) => fight.is_visible).length} öffentlich</strong>
                      <small>Sichtbar auf der Website</small>
                    </span>
                  </article>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
