import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  Download,
  Eye,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search
} from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  type EventRow,
  deleteEventAction,
  setEventStatusAction
} from "@/lib/admin/actions/events";
import { eventSelectColumns } from "@/lib/admin/resource-shared";
import { calendarBadge, formatDate, parseDate } from "@/lib/admin/format";
import { Badge, type BadgeTone, EmptyState, Pagination, Panel, StatCard } from "@/components/admin/ui/primitives";
import { RowMenu } from "@/components/admin/ui/RowMenu";

export const metadata = {
  title: "Veranstaltungen | SmashTime Admin"
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

const statusMeta: Record<EventRow["status"], { label: string; tone: BadgeTone }> = {
  published: { label: "Veröffentlicht", tone: "green" },
  draft: { label: "In Vorbereitung", tone: "blue" },
  archived: { label: "Archiviert", tone: "gray" }
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    ort?: string;
    monat?: string;
    seite?: string;
  }>;
};

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const { q, status, ort, monat, seite } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let events: EventRow[] = [];
  let loadError: string | null = null;

  if (!supabase) {
    loadError = "Supabase ist nicht konfiguriert.";
  } else {
    const { data, error } = await supabase
      .from("events")
      .select(eventSelectColumns)
      .order("event_date", { ascending: false, nullsFirst: false });

    if (error) {
      loadError = `Veranstaltungen konnten nicht geladen werden: ${error.message}`;
    } else {
      events = (data ?? []) as unknown as EventRow[];
    }
  }

  const now = new Date();
  const in90Days = new Date(now.getTime() + 90 * 86_400_000);

  const total = events.length;
  const upcoming = events.filter((event) => {
    const date = parseDate(event.event_date);
    return date && date >= now && date <= in90Days && event.status !== "archived";
  }).length;
  const published = events.filter((event) => event.status === "published").length;
  const archived = events.filter((event) => event.status === "archived").length;

  const locations = [...new Set(events.map((event) => event.location).filter(Boolean))] as string[];

  const query = (q ?? "").trim().toLowerCase();
  const filtered = events.filter((event) => {
    if (query) {
      const haystack = `${event.name} ${event.subtitle ?? ""} ${event.location ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    if (status && event.status !== status) {
      return false;
    }
    if (ort && event.location !== ort) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(seite ?? "1", 10) || 1), pageCount);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Kalender: Monat aus ?monat=YYYY-MM, sonst aktueller Monat */
  const monthMatch = /^(\d{4})-(\d{2})$/.exec(monat ?? "");
  const calYear = monthMatch ? Number.parseInt(monthMatch[1], 10) : now.getFullYear();
  const calMonth = monthMatch ? Number.parseInt(monthMatch[2], 10) - 1 : now.getMonth();
  const firstOfMonth = new Date(calYear, calMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const eventDays = new Set(
    events
      .map((event) => parseDate(event.event_date))
      .filter((date): date is Date => Boolean(date && date.getFullYear() === calYear && date.getMonth() === calMonth))
      .map((date) => date.getDate())
  );
  const monthLabel = new Intl.DateTimeFormat("de-AT", { month: "long", year: "numeric" }).format(firstOfMonth);
  const monthHref = (offset: number) => {
    const target = new Date(calYear, calMonth + offset, 1);
    const value = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}`;
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (ort) params.set("ort", ort);
    params.set("monat", value);
    return `/admin/events?${params.toString()}`;
  };

  const nextEvents = events
    .filter((event) => {
      const date = parseDate(event.event_date);
      return date && date >= new Date(now.getFullYear(), now.getMonth(), now.getDate()) && event.status !== "archived";
    })
    .sort((a, b) => new Date(a.event_date ?? 0).getTime() - new Date(b.event_date ?? 0).getTime())
    .slice(0, 4);

  const tableColumns = "minmax(260px, 1.6fr) 110px 170px minmax(160px, 1fr) 140px 130px";

  return (
    <div>
      <div className="adm-head">
        <div>
          <h1>Veranstaltungen</h1>
          <p>Verwalte und überwache alle Events, Termine und Veranstaltungsdetails.</p>
        </div>
        <div className="adm-head__actions">
          <Link className="adm-btn adm-btn--primary" href="/admin/events/new">
            <Plus aria-hidden="true" size={16} /> Event hinzufügen
          </Link>
          <a className="adm-btn" href="/admin/events/export" download>
            <Download aria-hidden="true" size={16} /> Export
          </a>
        </div>
      </div>

      {loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{loadError}</strong>
        </div>
      ) : null}

      <section className="adm-stats" aria-label="Event-Kennzahlen">
        <StatCard icon={CalendarDays} tone="red" label="Gesamt Events" value={total} detail="Alle Veranstaltungen" />
        <StatCard
          icon={CalendarRange}
          tone="green"
          label="Kommende Events"
          value={upcoming}
          detail="In den nächsten 90 Tagen"
        />
        <StatCard icon={Eye} tone="orange" label="Veröffentlicht" value={published} detail="Öffentlich sichtbar" />
        <StatCard icon={Archive} tone="purple" label="Archiviert" value={archived} detail="Abgeschlossene Events" />
      </section>

      <div className="adm-cols adm-cols--main-rail">
        <section className="adm-panel">
          <form className="adm-toolbar" method="get" action="/admin/events">
            <div className="adm-search">
              <Search aria-hidden="true" size={16} />
              <input type="search" name="q" defaultValue={q ?? ""} placeholder="Events suchen…" aria-label="Events suchen" />
            </div>
            <div className="adm-filter">
              <span>Status</span>
              <select name="status" defaultValue={status ?? ""}>
                <option value="">Alle Status</option>
                <option value="published">Veröffentlicht</option>
                <option value="draft">In Vorbereitung</option>
                <option value="archived">Archiviert</option>
              </select>
            </div>
            <div className="adm-filter">
              <span>Ort</span>
              <select name="ort" defaultValue={ort ?? ""}>
                <option value="">Alle Orte</option>
                {locations.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <button className="adm-btn" type="submit">
              Filtern
            </button>
            <Link className="adm-btn adm-btn--ghost" href="/admin/events">
              <RotateCcw aria-hidden="true" size={14} /> Filter zurücksetzen
            </Link>
          </form>

          {pageRows.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title={filtered.length === 0 && total > 0 ? "Keine Treffer" : "Noch keine Veranstaltungen"}
              description={
                filtered.length === 0 && total > 0
                  ? "Für die aktuelle Suche/Filter gibt es keine Events."
                  : "Lege die erste Veranstaltung über „Event hinzufügen“ an."
              }
            />
          ) : (
            <div className="adm-table">
              <div className="adm-table__head" style={{ gridTemplateColumns: tableColumns }}>
                <span>Event</span>
                <span>Kategorie</span>
                <span>Datum</span>
                <span>Ort</span>
                <span>Status</span>
                <span style={{ textAlign: "right" }}>Aktionen</span>
              </div>
              {pageRows.map((event) => (
                <div className="adm-table__row" key={event.id} style={{ gridTemplateColumns: tableColumns }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                    <span className="adm-thumb">
                      {event.image_path ? (
                        <Image
                          src={event.image_path}
                          alt=""
                          width={76}
                          height={44}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span className="adm-thumb--empty" style={{ display: "flex", width: "100%", height: "100%" }}>
                          <ImageIcon aria-hidden="true" size={16} />
                        </span>
                      )}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <strong>{event.name}</strong>
                      {event.subtitle ? <span className="adm-cell-sub adm-cell-sub--red">{event.subtitle}</span> : null}
                    </div>
                  </div>
                  <span className="adm-cell-muted">
                    {event.disciplines.length > 0 ? event.disciplines.join(", ") : "–"}
                  </span>
                  <div>
                    <span>{event.date_label ?? formatDate(event.event_date)}</span>
                    <span className="adm-cell-sub">
                      {event.starts_at ? `Beginn: ${event.starts_at}` : "Beginn offen"}
                    </span>
                  </div>
                  <div>
                    <span>{event.location ?? "–"}</span>
                    {event.address ? <span className="adm-cell-sub">{event.address}</span> : null}
                  </div>
                  <span>
                    <Badge tone={statusMeta[event.status].tone}>{statusMeta[event.status].label}</Badge>
                  </span>
                  <div className="adm-row-actions">
                    <Link className="adm-icon-btn" href={`/admin/events/${event.id}`} aria-label={`${event.name} bearbeiten`}>
                      <Pencil aria-hidden="true" size={15} />
                    </Link>
                    <Link
                      className="adm-icon-btn"
                      href="/veranstaltungen"
                      target="_blank"
                      aria-label={`${event.name} auf der Website ansehen`}
                    >
                      <Eye aria-hidden="true" size={15} />
                    </Link>
                    <RowMenu
                      label={`Weitere Aktionen für ${event.name}`}
                      items={[
                        {
                          type: "link",
                          label: "Fightcard öffnen",
                          href: `/admin/fightcards?event=${event.id}`
                        },
                        event.status !== "published"
                          ? {
                              type: "action",
                              label: "Veröffentlichen",
                              action: setEventStatusAction.bind(null, event.id, "published")
                            }
                          : {
                              type: "action",
                              label: "Archivieren",
                              action: setEventStatusAction.bind(null, event.id, "archived")
                            },
                        ...(event.status === "archived"
                          ? [
                              {
                                type: "action" as const,
                                label: "Als Entwurf reaktivieren",
                                action: setEventStatusAction.bind(null, event.id, "draft")
                              }
                            ]
                          : []),
                        {
                          type: "action",
                          label: "Löschen",
                          danger: true,
                          action: deleteEventAction.bind(null, event.id),
                          confirm: {
                            title: "Event löschen?",
                            message: "Zugehörige Fightcard-Einträge werden mitgelöscht.",
                            itemLabel: event.name,
                            itemMeta: event.date_label ?? formatDate(event.event_date)
                          }
                        }
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="adm-panel__body" style={{ borderTop: "1px solid var(--adm-border-soft)" }}>
            <Pagination
              basePath="/admin/events"
              page={page}
              pageCount={pageCount}
              totalLabel={
                filtered.length === 0
                  ? "0 Events"
                  : `Zeige ${(page - 1) * PAGE_SIZE + 1} bis ${Math.min(page * PAGE_SIZE, filtered.length)} von ${filtered.length} Events`
              }
              searchParams={{ q, status, ort, monat }}
            />
          </div>
        </section>

        <aside className="adm-rail">
          <Panel icon={CalendarDays} title="Kalender">
            <div className="adm-cal">
              <div className="adm-cal__head">
                <span>{monthLabel}</span>
                <span className="adm-cal__nav">
                  <Link className="adm-icon-btn" href={monthHref(-1)} aria-label="Vorheriger Monat" style={{ width: 28, height: 28 }}>
                    ‹
                  </Link>
                  <Link className="adm-icon-btn" href={monthHref(1)} aria-label="Nächster Monat" style={{ width: 28, height: 28 }}>
                    ›
                  </Link>
                </span>
              </div>
              <div className="adm-cal__grid">
                {WEEKDAYS.map((day) => (
                  <span className="adm-cal__dow" key={day}>
                    {day}
                  </span>
                ))}
                {Array.from({ length: startOffset }).map((_, index) => (
                  <span className="adm-cal__day adm-cal__day--muted" key={`pad-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const isToday =
                    day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
                  const hasEvent = eventDays.has(day);
                  return (
                    <span
                      key={day}
                      className={[
                        "adm-cal__day",
                        isToday ? "adm-cal__day--today" : "",
                        hasEvent && !isToday ? "adm-cal__day--event" : ""
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </Panel>

          <Panel
            icon={CalendarRange}
            title="Nächste Events"
            footer={
              <Link href="/admin/events">
                Alle Events anzeigen <ChevronRight aria-hidden="true" size={14} />
              </Link>
            }
          >
            {nextEvents.length === 0 ? (
              <EmptyState title="Keine kommenden Events" description="Lege ein Event mit Datum an, um es hier zu sehen." />
            ) : (
              <div className="adm-timeline">
                {nextEvents.map((event) => {
                  const badge = calendarBadge(event.event_date);
                  return (
                    <div className="adm-timeline__row" key={event.id}>
                      <span className="adm-timeline__date">
                        <strong>{badge.day}</strong>
                        <span>{badge.month}</span>
                      </span>
                      <div className="adm-timeline__body">
                        <strong>{event.name}</strong>
                        <p>
                          <MapPin aria-hidden="true" size={12} /> {event.location ?? "Ort offen"}
                        </p>
                      </div>
                      <Badge tone={statusMeta[event.status].tone}>{statusMeta[event.status].label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}
