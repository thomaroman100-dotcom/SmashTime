import { CalendarDays, MapPin } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { EventHighlight } from "@/components/sections/EventHighlight";
import { FightCardList } from "@/components/sections/FightCardList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CTAButton } from "@/components/ui/CTAButton";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { eventArchive, upcomingEvent } from "@/data/events";
import { fightcards } from "@/data/fightcards";
import { pageHeroes } from "@/data/heroes";

export const metadata = {
  title: "Veranstaltungen | SmashTime"
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        title="Veranstaltungen."
        text="Erlebe echte Action, packende Kämpfe und unvergessliche Nächte. Hier findest du die nächste SmashTime-Veranstaltung."
        image={pageHeroes.events.image}
        imagePosition={pageHeroes.events.position}
        compact
      />
      <div className="container events-page">
        <EventHighlight
          event={upcomingEvent}
          mediaImage={pageHeroes.eventsModule.image}
          mediaPosition={pageHeroes.eventsModule.position}
          detailsHref={upcomingEvent.detailHref}
          showFightcard
        >
          <FightCardList fights={fightcards} />
        </EventHighlight>

        <section className="archive-section">
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
