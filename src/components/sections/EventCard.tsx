import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SmashEvent } from "@/data/events";

type EventCardProps = {
  event: SmashEvent;
  ticketHref: string;
};

function getDateBox(event: SmashEvent) {
  if (!event.date) {
    return { day: "–", month: "TBA" };
  }
  const date = new Date(event.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date
    .toLocaleDateString("de-AT", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  return { day, month };
}

export function EventCard({ event, ticketHref }: EventCardProps) {
  const { day, month } = getDateBox(event);

  return (
    <article className="event-row">
      <span className="event-row__date" aria-hidden="true">
        <strong>{day}</strong>
        <span>{month}</span>
      </span>
      <div className="event-row__info">
        <h3>
          <Link href={event.detailHref ?? "/veranstaltungen"}>
            {event.shortName}: {event.subtitle}
          </Link>
        </h3>
        <p>{event.location}</p>
      </div>
      <Link href={ticketHref} className="event-row__tickets">
        Ticketinfos <ArrowRight aria-hidden="true" size={15} strokeWidth={2.6} />
      </Link>
    </article>
  );
}
