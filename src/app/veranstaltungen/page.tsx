import { CalendarDays, MapPin } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { EventHighlight } from "@/components/sections/EventHighlight";
import { FightCardList } from "@/components/sections/FightCardList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTAButton } from "@/components/ui/CTAButton";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { eventArchive, upcomingEvent } from "@/data/events";
import { pageHeroes } from "@/data/heroes";
import { getPublicFightcardsForEvent } from "@/lib/public-fightcards";

export const metadata = {
  title: "Veranstaltungen | SmashTime"
};

export default async function EventsPage() {
  const visibleFights = await getPublicFightcardsForEvent(upcomingEvent.id);

  return (
    <>
      <PageHero
        title="Veranstaltungen."
        redTitle="Nächte, die bleiben."
        text="Erlebe echte Action, packende Kämpfe und unvergessliche Nächte. Hier findest du die nächste SmashTime-Veranstaltung."
        preset={pageHeroes.events}
        meta={[upcomingEvent.dateLabel, upcomingEvent.location]}
        compact
      />
      <div className="container events-page">
        <EventHighlight
          event={upcomingEvent}
          mediaPosition="center center"
          detailsHref={upcomingEvent.detailHref}
          showFightcard
        >
          <FightCardList fights={visibleFights} />
        </EventHighlight>

        <section className="events-ticket-section card-grunge" id="tickets" aria-label="Tickets sichern">
          <SectionTitle>Tickets sichern</SectionTitle>
          <p>
            Vier Ticketpakete, Einlassinfos und alle Antworten zum Kampfabend findest du auf der Ticketseite.
          </p>
          <CTAButton href="/tickets">Alle Ticketinfos ansehen</CTAButton>
        </section>

        <section className="archive-section" id="archiv">
          <SectionTitle>Weitere Veranstaltungen</SectionTitle>
          <div className="archive-section__grid">
            {eventArchive.map((event) => (
              <article key={event.id} className="archive-card">
                <div>
                  <strong>{event.shortName}</strong>
                  <span>{event.subtitle}</span>
                </div>
                <p>
                  <CalendarDays aria-hidden="true" size={18} /> {event.dateLabel}
                </p>
                <p>
                  <MapPin aria-hidden="true" size={18} /> {event.location}
                </p>
                <CTAButton href={event.detailHref ?? upcomingEvent.detailHref} variant="outline">
                  Details ansehen
                </CTAButton>
              </article>
            ))}
          </div>
        </section>
      </div>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
