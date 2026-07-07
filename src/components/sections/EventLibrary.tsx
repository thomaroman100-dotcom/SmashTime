"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Countdown } from "@/components/sections/Countdown";
import type { PublicEvent, PublicEventStatus } from "@/lib/public-events";

type EventLibraryProps = {
  events: PublicEvent[];
  ticketHref: string;
};

type StatusFilter = "all" | PublicEventStatus | "soldout";
type SortKey = "date-asc" | "date-desc" | "title-asc";

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "Alle", value: "all" },
  { label: "Bevorstehend", value: "upcoming" },
  { label: "Vergangen", value: "past" },
  { label: "Ausverkauft", value: "soldout" }
];

function eventTime(event: PublicEvent) {
  const time = new Date(event.date).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

function eventYear(event: PublicEvent) {
  const date = new Date(event.date);
  return Number.isNaN(date.getTime()) ? "" : String(date.getFullYear());
}

function eventStatusLabel(status: PublicEventStatus) {
  if (status === "upcoming") return "Bevorstehend";
  if (status === "archived") return "Archiv";
  return "Vergangen";
}

function eventStatusClass(status: PublicEventStatus) {
  if (status === "upcoming") return "event-library__status--upcoming";
  if (status === "archived") return "event-library__status--archived";
  return "event-library__status--past";
}

export function EventLibrary({ events, ticketHref }: EventLibraryProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [discipline, setDiscipline] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortKey>("date-asc");
  const [visibleCount, setVisibleCount] = useState(24);

  const nextEvent = useMemo(
    () =>
      events
        .filter((event) => event.eventStatus === "upcoming")
        .sort((a, b) => eventTime(a) - eventTime(b))[0] ?? events[0],
    [events]
  );

  const disciplines = useMemo(
    () => Array.from(new Set(events.flatMap((event) => event.disciplines))).sort((a, b) => a.localeCompare(b, "de")),
    [events]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(events.map(eventYear).filter(Boolean))).sort((a, b) => Number(b) - Number(a)),
    [events]
  );

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events
      .filter((event) => {
        if (status === "soldout") return false;
        if (status === "upcoming" && event.eventStatus !== "upcoming") return false;
        if (status === "past" && event.eventStatus === "upcoming") return false;
        if (status === "archived" && event.eventStatus !== "archived") return false;
        if (discipline !== "all" && !event.disciplines.some((item) => item === discipline)) {
          return false;
        }
        if (year !== "all" && eventYear(event) !== year) return false;
        if (!normalizedQuery) return true;

        const haystack = [
          event.name,
          event.shortName,
          event.subtitle,
          event.location,
          event.dateLabel,
          event.disciplines.join(" ")
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sort === "title-asc") return a.shortName.localeCompare(b.shortName, "de");
        if (sort === "date-desc") return eventTime(b) - eventTime(a);
        return eventTime(a) - eventTime(b);
      });
  }, [discipline, events, query, sort, status, year]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const eventCountLabel = filteredEvents.length === 1 ? "1 Event gefunden" : `${filteredEvents.length} Events gefunden`;

  const updateFilter = (callback: () => void) => {
    callback();
    setVisibleCount(24);
  };

  return (
    <section className="event-library" aria-label="Event-Bibliothek">
      {nextEvent ? (
        <div className="event-library__featured" aria-label="Nächste Veranstaltung">
          <div className="event-library__featured-label">
            <span>Nächste</span>
            <strong>Veranstaltung</strong>
          </div>
          <Link className="event-library__featured-poster" href={nextEvent.detailHref ?? "/veranstaltungen"}>
            <Image src={nextEvent.image} alt={`${nextEvent.name} Eventposter`} fill sizes="180px" priority />
          </Link>
          <div className="event-library__featured-main">
            <span>{nextEvent.subtitle}</span>
            <h2>{nextEvent.shortName}</h2>
            <p>
              <CalendarDays aria-hidden="true" size={15} />
              {nextEvent.dateLabel}
              <MapPin aria-hidden="true" size={15} />
              {nextEvent.location}
            </p>
          </div>
          {nextEvent.date ? (
            <Countdown targetDate={nextEvent.date} />
          ) : (
            <div className="event-library__countdown-empty">Datum folgt</div>
          )}
          <div className="event-library__featured-actions">
            <Link className="btn btn--primary" href={nextEvent.ticketHref ?? ticketHref}>
              <span>Tickets sichern</span>
            </Link>
            <Link className="btn btn--outline" href={nextEvent.detailHref ?? "/veranstaltungen"}>
              <span>Details ansehen</span>
            </Link>
          </div>
        </div>
      ) : null}

      <div className="event-library__controls" aria-label="Events filtern">
        <label className="event-library__search">
          <span className="sr-only">Events durchsuchen</span>
          <Search aria-hidden="true" size={17} />
          <input
            type="search"
            placeholder="Events durchsuchen..."
            value={query}
            onChange={(event) => updateFilter(() => setQuery(event.target.value))}
          />
        </label>

        <div className="event-library__filter-group" aria-label="Statusfilter">
          {statusOptions.map((option) => (
            <button
              className={status === option.value ? "is-active" : undefined}
              key={option.value}
              type="button"
              onClick={() => updateFilter(() => setStatus(option.value))}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="event-library__select">
          <span>Disziplin</span>
          <select value={discipline} onChange={(event) => updateFilter(() => setDiscipline(event.target.value))}>
            <option value="all">Alle Disziplinen</option>
            {disciplines.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" size={15} />
        </label>

        <label className="event-library__select">
          <span>Sortieren nach</span>
          <select value={sort} onChange={(event) => updateFilter(() => setSort(event.target.value as SortKey))}>
            <option value="date-asc">Datum (nächste)</option>
            <option value="date-desc">Datum (neueste)</option>
            <option value="title-asc">Titel A-Z</option>
          </select>
          <ChevronDown aria-hidden="true" size={15} />
        </label>

        <label className="event-library__select">
          <span>Jahr</span>
          <select value={year} onChange={(event) => updateFilter(() => setYear(event.target.value))}>
            <option value="all">Alle Jahre</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" size={15} />
        </label>
      </div>

      <div className="event-library__head">
        <div>
          <h2>Event-Bibliothek</h2>
          <p>{eventCountLabel}</p>
        </div>
      </div>

      {visibleEvents.length > 0 ? (
        <div className="event-library__grid">
          {visibleEvents.map((event) => (
            <article className="event-library-card" key={event.id}>
              <Link className="event-library-card__image" href={event.detailHref ?? "/veranstaltungen"}>
                <Image src={event.image} alt={`${event.name} Eventposter`} fill sizes="(max-width: 767px) 100vw, (max-width: 1180px) 50vw, 25vw" />
                <span className={`event-library__status ${eventStatusClass(event.eventStatus)}`}>
                  {eventStatusLabel(event.eventStatus)}
                </span>
              </Link>
              <div className="event-library-card__body">
                <h3>{event.shortName}</h3>
                <p className="event-library-card__meta">
                  <CalendarDays aria-hidden="true" size={14} />
                  {event.dateLabel}
                  <MapPin aria-hidden="true" size={14} />
                  {event.location}
                </p>
                <div className="event-library-card__disciplines">
                  {event.disciplines.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="event-library-card__actions">
                  <Link className="btn btn--outline" href={event.detailHref ?? "/veranstaltungen"}>
                    <span>Details</span>
                  </Link>
                  {event.eventStatus === "upcoming" ? (
                    <Link className="btn btn--primary" href={event.ticketHref ?? ticketHref}>
                      <span>Ticketinfos</span>
                    </Link>
                  ) : (
                    <Link className="btn btn--outline" href={event.detailHref ?? "/veranstaltungen"}>
                      <span>Archiv</span>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="event-library__empty">
          <h3>Keine Veranstaltung gefunden.</h3>
          <p>Für diese Filter gibt es aktuell kein veröffentlichtes SmashTime-Event.</p>
        </div>
      )}

      {visibleCount < filteredEvents.length ? (
        <button className="event-library__load-more" type="button" onClick={() => setVisibleCount((current) => current + 24)}>
          Mehr laden <ChevronDown aria-hidden="true" size={16} />
        </button>
      ) : null}
    </section>
  );
}
