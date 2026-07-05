import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Globe2,
  Handshake,
  ImageIcon,
  ListOrdered,
  Mail,
  MapPin,
  Newspaper,
  Pencil,
  Shield,
  ShieldCheck,
  Sparkles,
  Ticket
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { eventSelectColumns } from "@/lib/admin/resource-shared";
import type { EventRow } from "@/lib/admin/actions/events";

export const metadata = {
  title: "Übersicht | SmashTime Admin"
};

export const dynamic = "force-dynamic";

type MetricTone = "red" | "green" | "amber";

type DashboardMetric = {
  label: string;
  value: number;
  detail: string;
  tone: MetricTone;
  icon: LucideIcon;
};

type DashboardEvent = {
  id: number;
  name: string;
  subtitle: string | null;
  date: string;
  time: string;
  venue: string;
  address: string | null;
  ticketState: string;
  status: string;
  imagePath: string | null;
};

type DashboardViewModel = {
  loadError: string | null;
  metrics: DashboardMetric[];
  nextEvent: DashboardEvent | null;
  checklist: Array<{ label: string; done: boolean }>;
  quickLinks: Array<{
    label: string;
    detail: string;
    href: string;
    icon: LucideIcon;
    count?: number;
  }>;
  activities: Array<{
    title: string;
    detail: string;
    time: string;
  }>;
  todos: Array<{
    title: string;
    detail: string;
    href: string;
  }>;
  systemRows: Array<{
    label: string;
    detail: string;
    badge: string;
    tone: "green" | "amber" | "blue";
    icon: LucideIcon;
  }>;
};

const dashboardPoster = "/images/admin/smashtime-36-dashboard-poster.png";

const referenceModel: DashboardViewModel = {
  loadError: null,
  metrics: [
    { label: "Gesamt Events", value: 24, detail: "Alle Veranstaltungen", tone: "red", icon: CalendarDays },
    { label: "Aktive Champions", value: 36, detail: "Aktive Titelträger", tone: "green", icon: ShieldCheck },
    { label: "Offene Kontaktanfragen", value: 3, detail: "Neue Anfragen", tone: "amber", icon: Mail },
    { label: "Veröffentlichte Neuigkeiten", value: 12, detail: "Aktuelle News", tone: "red", icon: Newspaper }
  ],
  nextEvent: {
    id: 36,
    name: "SmashTime 36",
    subtitle: "MIDDLEWEIGHT TITLE FIGHT",
    date: "18. Mai 2024",
    time: "Beginn: 19:00 Uhr",
    venue: "Wiener Stadthalle, Halle D",
    address: "Roland-Rainer-Platz 1, 1150 Wien",
    ticketState: "Verkauf aktiv",
    status: "In Vorbereitung",
    imagePath: dashboardPoster
  },
  checklist: [
    { label: "Fightcard", done: true },
    { label: "Venue & Datum", done: true },
    { label: "Sponsoren", done: true },
    { label: "Medien", done: false }
  ],
  quickLinks: [
    { label: "Veranstaltungen", detail: "Events verwalten", href: "/admin/events", icon: CalendarDays },
    { label: "Fightcard", detail: "Kämpfe organisieren", href: "/admin/fightcards", icon: ListOrdered },
    { label: "Neuigkeiten", detail: "News veröffentlichen", href: "/admin/news", icon: Newspaper },
    { label: "Sponsoren", detail: "Partner verwalten", href: "/admin/sponsors", icon: Shield },
    { label: "Kontaktanfragen", detail: "Anfragen beantworten", href: "/admin/contact", icon: Mail, count: 3 },
    { label: "Medien", detail: "Bilder verwalten", href: "/admin/media", icon: ImageIcon }
  ],
  activities: [
    { title: "Referenzmodus aktiv", detail: "Diese Daten sind nur im Dev-Referenzmodus sichtbar.", time: "Dev" }
  ],
  todos: [],
  systemRows: [
    { label: "Website Status", detail: "Admin erreichbar", badge: "Online", tone: "green", icon: Globe2 },
    { label: "Offene Kontaktanfragen", detail: "3 neue Anfragen", badge: "3 offen", tone: "amber", icon: Mail },
    { label: "Aktive Champions", detail: "Titelträger im System", badge: "36 aktiv", tone: "green", icon: ShieldCheck }
  ]
};

const statusLabel: Record<EventRow["status"], string> = {
  draft: "In Vorbereitung",
  published: "Veröffentlicht",
  archived: "Archiviert"
};

function formatDashboardDate(value: string | null) {
  if (!value) {
    return "Datum offen";
  }
  return new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

function formatDashboardTime(value: string | null) {
  if (!value) {
    return "Zeit offen";
  }
  return new Intl.DateTimeFormat("de-AT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value)
  );
}

function emptyModel(loadError: string | null): DashboardViewModel {
  return {
    loadError,
    metrics: [
      { label: "Gesamt Events", value: 0, detail: "Alle Veranstaltungen", tone: "red", icon: CalendarDays },
      { label: "Aktive Champions", value: 0, detail: "Aktive Titelträger", tone: "green", icon: ShieldCheck },
      { label: "Neuigkeiten", value: 0, detail: "Beiträge insgesamt", tone: "red", icon: Newspaper },
      { label: "Kontaktanfragen", value: 0, detail: "Offene Anfragen", tone: "amber", icon: Mail },
      { label: "Sponsoren", value: 0, detail: "Partner insgesamt", tone: "green", icon: Handshake },
      { label: "Medien", value: 0, detail: "Assets insgesamt", tone: "amber", icon: ImageIcon }
    ],
    nextEvent: null,
    checklist: [],
    quickLinks: [
      { label: "Veranstaltungen", detail: "Events verwalten", href: "/admin/events", icon: CalendarDays },
      { label: "Fightcard", detail: "Kämpfe organisieren", href: "/admin/fightcards", icon: ListOrdered },
      { label: "Neuigkeiten", detail: "News veröffentlichen", href: "/admin/news", icon: Newspaper },
      { label: "Sponsoren", detail: "Partner verwalten", href: "/admin/sponsors", icon: Shield },
      { label: "Kontaktanfragen", detail: "Anfragen beantworten", href: "/admin/contact", icon: Mail },
      { label: "Medien", detail: "Bilder verwalten", href: "/admin/media", icon: ImageIcon }
    ],
    activities: [],
    todos: [],
    systemRows: []
  };
}

async function getDashboardModel(referenceMode: boolean): Promise<DashboardViewModel> {
  if (referenceMode) {
    return referenceModel;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return emptyModel("Supabase ist nicht konfiguriert. Admin-Daten können nicht geladen werden.");
  }

  const [eventsRes, championsRes, contactsRes, newsRes, newsDraftsRes, sponsorsRes, mediaRes] = await Promise.all([
    supabase.from("events").select(eventSelectColumns).order("event_date", { ascending: false, nullsFirst: false }),
    supabase.from("champions").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("contact_requests").select("id", { count: "exact", head: true }).eq("status", "neu"),
    supabase.from("news_posts").select("id", { count: "exact", head: true }),
    supabase.from("news_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("sponsors").select("id", { count: "exact", head: true }),
    supabase.from("media_assets").select("id", { count: "exact", head: true })
  ]);

  const firstError = [eventsRes, championsRes, contactsRes, newsRes, newsDraftsRes, sponsorsRes, mediaRes].find(
    (result) => result.error
  )?.error;

  if (firstError) {
    return emptyModel(`Dashboard-Daten konnten nicht geladen werden: ${firstError.message}`);
  }

  const events = (eventsRes.data ?? []) as unknown as EventRow[];
  const now = Date.now();
  const next =
    events
      .filter((event) => event.status !== "archived" && event.event_date && new Date(event.event_date).getTime() >= now - 86_400_000)
      .sort((a, b) => new Date(a.event_date ?? 0).getTime() - new Date(b.event_date ?? 0).getTime())[0] ?? events[0];

  const fightsCountRes = next
    ? await supabase.from("fight_cards").select("id", { count: "exact", head: true }).eq("event_id", next.id)
    : { count: 0, error: null };
  const galleryCountRes = next
    ? await supabase.from("event_gallery").select("id", { count: "exact", head: true }).eq("event_id", next.id)
    : { count: 0, error: null };

  const openContacts = contactsRes.count ?? 0;
  const newsDrafts = newsDraftsRes.count ?? 0;
  const activeChampions = championsRes.count ?? 0;

  return {
    loadError: fightsCountRes.error || galleryCountRes.error ? "Event-Statusdetails konnten teilweise nicht geladen werden." : null,
    metrics: [
      { label: "Gesamt Events", value: events.length, detail: "Alle Veranstaltungen", tone: "red", icon: CalendarDays },
      { label: "Aktive Champions", value: activeChampions, detail: "Aktive Titelträger", tone: "green", icon: ShieldCheck },
      { label: "Neuigkeiten", value: newsRes.count ?? 0, detail: "Beiträge insgesamt", tone: "red", icon: Newspaper },
      { label: "Kontaktanfragen", value: openContacts, detail: "Offene Anfragen", tone: "amber", icon: Mail },
      { label: "Sponsoren", value: sponsorsRes.count ?? 0, detail: "Partner insgesamt", tone: "green", icon: Handshake },
      { label: "Medien", value: mediaRes.count ?? 0, detail: "Assets insgesamt", tone: "amber", icon: ImageIcon }
    ],
    nextEvent: next
      ? {
          id: next.id,
          name: next.name,
          subtitle: next.subtitle,
          date: next.date_label ?? formatDashboardDate(next.event_date),
          time: next.starts_at ? `Beginn: ${next.starts_at} Uhr` : "Beginn offen",
          venue: next.location ?? "Ort offen",
          address: next.address,
          ticketState: next.ticket_url ? "Verkauf aktiv" : "Ticketlink offen",
          status: statusLabel[next.status],
          imagePath: next.image_path
        }
      : null,
    checklist: next
      ? [
          { label: "Fightcard", done: (fightsCountRes.count ?? 0) > 0 },
          { label: "Venue & Datum", done: Boolean(next.event_date && next.location) },
          { label: "Tickets", done: Boolean(next.ticket_url) },
          { label: "Medien", done: Boolean(next.image_path || (galleryCountRes.count ?? 0) > 0) }
        ]
      : [],
    quickLinks: emptyModel(null).quickLinks.map((link) =>
      link.label === "Kontaktanfragen" ? { ...link, count: openContacts || undefined } : link
    ),
    activities: [
      ...events.slice(0, 2).map((event) => ({
        title: `Event „${event.name}“`,
        detail: event.status === "published" ? "Öffentlich sichtbar" : statusLabel[event.status],
        time: formatDashboardTime(event.updated_at)
      }))
    ],
    todos: [
      ...(next && !next.image_path
        ? [{ title: "Event-Medien ergänzen", detail: `${next.name} hat noch kein Poster/Flyer-Bild.`, href: `/admin/events/${next.id}` }]
        : []),
      ...(newsDrafts > 0
        ? [{ title: "Entwürfe prüfen", detail: `${newsDrafts} Neuigkeit${newsDrafts === 1 ? "" : "en"} warten auf Veröffentlichung.`, href: "/admin/news" }]
        : []),
      ...(openContacts > 0
        ? [{ title: "Kontaktanfragen beantworten", detail: `${openContacts} Anfrage${openContacts === 1 ? "" : "n"} offen.`, href: "/admin/contact" }]
        : [])
    ],
    systemRows: [
      { label: "Website Status", detail: "Admin-Daten erreichbar", badge: "Online", tone: "green", icon: Globe2 },
      {
        label: "Offene Kontaktanfragen",
        detail: `${openContacts} neue Anfrage${openContacts === 1 ? "" : "n"}`,
        badge: `${openContacts} offen`,
        tone: openContacts > 0 ? "amber" : "green",
        icon: Mail
      },
      { label: "Ungeplante Neuigkeiten", detail: "Warten auf Veröffentlichung", badge: `${newsDrafts} offen`, tone: "amber", icon: FileText },
      {
        label: "Events im System",
        detail: next ? `Aktuell: ${next.name}` : "Kein Event vorhanden",
        badge: `${events.length} Event${events.length === 1 ? "" : "s"}`,
        tone: "blue",
        icon: CalendarDays
      },
      { label: "Aktive Champions", detail: "Titelträger im System", badge: `${activeChampions} aktiv`, tone: "green", icon: ShieldCheck }
    ]
  };
}

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
}) {
  const params = await Promise.resolve(searchParams ?? {});
  const referenceMode = process.env.NODE_ENV !== "production" && params.reference === "1";
  const model = await getDashboardModel(referenceMode);

  return (
    <main className="adm-dashboard" data-reference={referenceMode ? "true" : undefined}>
      <header className="adm-dashboard__head">
        <h1>Übersicht</h1>
        <p>Zentrale Steuerung für Inhalte, Events, Fightcards und Anfragen.</p>
      </header>

      {model.loadError ? (
        <div className="adm-alert adm-alert--error" role="alert">
          <strong>{model.loadError}</strong>
        </div>
      ) : null}

      <section className="adm-dashboard__metrics" aria-label="Kennzahlen">
        {model.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="adm-dashboard__hero-grid">
        <DashboardPanel className="adm-dashboard__event-panel" icon={Shield} title="Aktuelles Event">
          {model.nextEvent ? (
            <div className="adm-next-event">
              <div className="adm-next-event__poster">
                {model.nextEvent.imagePath ? (
                  <Image src={model.nextEvent.imagePath} alt={model.nextEvent.name} fill sizes="296px" priority unoptimized />
                ) : (
                  <span className="adm-thumb--empty">
                    <ImageIcon aria-hidden="true" size={26} />
                    Kein Eventbild hinterlegt
                  </span>
                )}
              </div>
              <div className="adm-next-event__body">
                <h2>{model.nextEvent.name}</h2>
                {model.nextEvent.subtitle ? <p className="adm-next-event__subtitle">{model.nextEvent.subtitle}</p> : null}
                <div className="adm-next-event__meta">
                  <span>
                    <CalendarDays aria-hidden="true" size={16} />
                    <span>
                      {model.nextEvent.date}
                      <small>{model.nextEvent.time}</small>
                    </span>
                  </span>
                  <span>
                    <MapPin aria-hidden="true" size={16} />
                    <span>
                      {model.nextEvent.venue}
                      <small>{model.nextEvent.address ?? "Adresse offen"}</small>
                    </span>
                  </span>
                  <span>
                    <Ticket aria-hidden="true" size={16} />
                    <span>
                      Tickets
                      <small>{model.nextEvent.ticketState}</small>
                    </span>
                  </span>
                </div>
              </div>
              <aside className="adm-event-status">
                <span className="adm-event-status__badge">{model.nextEvent.status}</span>
                <div className="adm-event-status__checks">
                  {model.checklist.map((item) => (
                    <span key={item.label}>
                      {item.label}
                      {item.done ? <Check aria-hidden="true" size={14} /> : <i aria-hidden="true" />}
                    </span>
                  ))}
                </div>
                <Link className="adm-event-status__button" href={`/admin/events/${model.nextEvent.id}`}>
                  <Pencil aria-hidden="true" size={15} />
                  Event bearbeiten
                </Link>
              </aside>
            </div>
          ) : (
            <div className="adm-empty-inline">
              <CalendarDays aria-hidden="true" size={28} />
              <strong>Kein Event vorhanden</strong>
              <p>Lege ein Event an, damit es hier und in der Fightcard-Verwaltung erscheint.</p>
              <Link className="adm-btn adm-btn--primary" href="/admin/events/new">
                Event anlegen
              </Link>
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel icon={Sparkles} title="Schnellzugriff" subtitle="Häufig verwendete Bereiche">
          <div className="adm-quick-grid">
            {model.quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link className="adm-quick-link" href={link.href} key={link.label}>
                  <span className="adm-quick-link__icon">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span>
                    <strong>{link.label}</strong>
                    <small>{link.detail}</small>
                  </span>
                  {link.count ? <em>{link.count}</em> : <ChevronRight aria-hidden="true" size={17} />}
                </Link>
              );
            })}
          </div>
        </DashboardPanel>
      </section>

      <section className="adm-dashboard__lower-grid">
        <DashboardPanel icon={ClipboardCheck} title="Letzte Aktivitäten" subtitle="Aus echten Verwaltungsdaten abgeleitet">
          {model.activities.length > 0 ? (
            <div className="adm-activity-list">
              {model.activities.map((activity) => (
                <article className="adm-activity" key={`${activity.title}-${activity.time}`}>
                  <span className="adm-activity__avatar adm-activity__avatar--icon">
                    <CalendarDays aria-hidden="true" size={15} />
                  </span>
                  <span>
                    <strong>{activity.title}</strong>
                    <small>{activity.detail}</small>
                  </span>
                  <time>{activity.time}</time>
                </article>
              ))}
            </div>
          ) : (
            <p className="adm-panel-empty">Noch keine Aktivitäten aus echten Daten ableitbar.</p>
          )}
        </DashboardPanel>

        <DashboardPanel icon={ClipboardCheck} title="To-do / Offene Aufgaben">
          {model.todos.length > 0 ? (
            <div className="adm-task-list">
              {model.todos.map((todo) => (
                <Link className="adm-task" href={todo.href} key={todo.title}>
                  <span className="adm-task__box" aria-hidden="true" />
                  <span>
                    <strong>{todo.title}</strong>
                    <small>{todo.detail}</small>
                  </span>
                  <ChevronRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="adm-panel-empty">Keine offenen Aufgaben aus den aktuellen Daten erkannt.</p>
          )}
        </DashboardPanel>

        <DashboardPanel icon={Shield} title="System Status" subtitle="Status der Website und Inhalte">
          {model.systemRows.length > 0 ? (
            <div className="adm-system-list">
              {model.systemRows.map((row) => {
                const Icon = row.icon;
                return (
                  <article className="adm-system-row" key={row.label}>
                    <span className="adm-system-row__icon">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span>
                      <strong>{row.label}</strong>
                      <small>{row.detail}</small>
                    </span>
                    <em className={`adm-system-row__badge adm-system-row__badge--${row.tone}`}>{row.badge}</em>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="adm-panel-empty">Systemstatus wird angezeigt, sobald echte Daten geladen werden können.</p>
          )}
        </DashboardPanel>
      </section>
    </main>
  );
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metric.icon;

  return (
    <article className="adm-metric">
      <span className={`adm-metric__icon adm-metric__icon--${metric.tone}`}>
        <Icon aria-hidden="true" size={24} />
      </span>
      <div>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
        <small>{metric.detail}</small>
      </div>
    </article>
  );
}

function DashboardPanel({
  icon: Icon,
  title,
  subtitle,
  footer,
  className,
  children
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={["adm-dashboard-panel", className].filter(Boolean).join(" ")}>
      <header className="adm-dashboard-panel__head">
        <Icon aria-hidden="true" size={17} />
        <span>
          <strong>{title}</strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </span>
      </header>
      <div className="adm-dashboard-panel__body">{children}</div>
      {footer ? <footer className="adm-dashboard-panel__footer">{footer}</footer> : null}
    </article>
  );
}
