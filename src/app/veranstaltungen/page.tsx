import { CalendarDays, Check, MapPin } from "lucide-react";
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
import { ticketInclusions, ticketPackages } from "@/data/tickets";

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

        <section className="events-ticket-section" id="tickets" aria-label="Tickets sichern">
          <SectionTitle>Tickets sichern</SectionTitle>
          <div className="ticket-packages">
            {ticketPackages.map((item) => (
              <article
                className={item.popular ? "ticket-package ticket-package--popular card-grunge" : "ticket-package card-grunge"}
                key={item.id}
              >
                {item.popular ? <span className="ticket-package__flag">Beliebte Wahl</span> : null}
                <h2>{item.name}</h2>
                <p>{item.subtitle}</p>
                <strong>{item.price}</strong>
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" size={17} /> {feature}
                    </li>
                  ))}
                </ul>
                <CTAButton href="/kontakt" variant={item.popular ? "solid" : "outline"}>
                  Ticketinfos anfragen
                </CTAButton>
              </article>
            ))}
          </div>

          <div className="ticket-info-panel card-grunge">
            <h2>Was ist vorbereitet?</h2>
            <div className="ticket-info-panel__items">
              {ticketInclusions.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
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
