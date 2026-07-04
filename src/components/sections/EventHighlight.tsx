import { Ticket } from "lucide-react";
import type { SmashEvent } from "@/data/events";
import { CTAButton } from "@/components/ui/CTAButton";
import { BrushLabel } from "@/components/ui/BrushLabel";
import { Countdown } from "@/components/sections/Countdown";
import { MetaItem } from "@/components/ui/MetaItem";
import { site } from "@/data/site";

type EventHighlightProps = {
  event: SmashEvent;
  showFightcard?: boolean;
  mediaImage?: string;
  mediaPosition?: string;
  detailsHref?: string;
  children?: React.ReactNode;
};

export function EventHighlight({
  event,
  showFightcard,
  mediaImage,
  mediaPosition,
  detailsHref,
  children
}: EventHighlightProps) {
  return (
    <section className="event-highlight card-grunge card-grunge--event" id="naechste-veranstaltung">
      <BrushLabel>Nächste Veranstaltung</BrushLabel>
      <div
        className="event-highlight__media"
        style={{
          backgroundImage: `url(${mediaImage ?? event.image})`,
          backgroundPosition: mediaPosition
        }}
      />
      <div className="event-highlight__content">
        <div className="event-highlight__main">
          <h2>
            <span>{event.shortName}</span>
            <span>{event.subtitle}</span>
          </h2>
          <p className="event-highlight__official-name">{event.name}</p>
          <div className="event-highlight__meta">
            <MetaItem icon="calendar" value={event.dateLabel} />
            <MetaItem icon="map" value={event.location} detail={event.address} />
            <MetaItem icon="clock" label="Einlass" value={event.admission} />
            <MetaItem icon="clock" label="Beginn" value={event.start} />
          </div>
          <div className="event-highlight__actions">
            {detailsHref ? (
              <CTAButton href={detailsHref}>
                Details ansehen
              </CTAButton>
            ) : null}
            <CTAButton href={site.ticketHref} variant={detailsHref ? "outline" : "solid"}>
              Tickets sichern
            </CTAButton>
          </div>
        </div>

        <Countdown targetDate={event.date} />

        <div className="discipline-list">
          <h3>Disziplinen</h3>
          {event.disciplines.map((discipline) => (
            <span key={discipline}>{discipline}</span>
          ))}
          {event.gastro ? <small>Gastro: {event.gastro}</small> : null}
        </div>
      </div>
      {showFightcard && children ? <div className="event-highlight__extra">{children}</div> : null}
      <Ticket className="event-highlight__watermark" aria-hidden="true" size={90} />
    </section>
  );
}
