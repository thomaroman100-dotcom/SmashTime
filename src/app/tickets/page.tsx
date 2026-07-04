import Image from "next/image";
import { Check } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CTAButton } from "@/components/ui/CTAButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { pageHeroes } from "@/data/heroes";
import { ticketEvent, ticketFaqs, ticketInclusions, ticketPackages } from "@/data/tickets";

export const metadata = {
  title: "Tickets | SmashTime"
};

export default function TicketsPage() {
  return (
    <>
      <PageHero
        title="Tickets."
        redTitle="Dein Platz. Echte Action."
        text="Informiere dich über Plätze für SmashTime 3 / Cagetime. Der offizielle Verkauf wird später angebunden."
        image={pageHeroes.eventsModule.image}
        imagePosition={pageHeroes.eventsModule.position}
        compact
      />

      <div className="phase-page tickets-page">
        <section className="ticket-event card-grunge card-grunge--event">
          <div className="ticket-event__media">
            <Image src={ticketEvent.image} alt="" fill sizes="(max-width: 920px) 100vw, 46vw" />
          </div>
          <div className="ticket-event__content">
            <span>Nächste Veranstaltung</span>
            <h2>
              {ticketEvent.shortName}
              <strong>{ticketEvent.subtitle}</strong>
            </h2>
            <dl>
              <div>
                <dt>Datum</dt>
                <dd>{ticketEvent.date}</dd>
              </div>
              <div>
                <dt>Ort</dt>
                <dd>{ticketEvent.location}</dd>
              </div>
              <div>
                <dt>Einlass</dt>
                <dd>{ticketEvent.admission}</dd>
              </div>
              <div>
                <dt>Beginn</dt>
                <dd>{ticketEvent.start}</dd>
              </div>
            </dl>
          </div>
          <div className="ticket-event__benefits">
            {ticketInclusions.slice(0, 3).map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} size="sm" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ticket-packages" id="ticketpakete" aria-label="Ticketpakete">
          {ticketPackages.map((item) => (
            <article
              className={item.popular ? "ticket-package ticket-package--popular card-grunge" : "ticket-package card-grunge"}
              key={item.id}
            >
              {item.popular ? <span className="ticket-package__flag">Beliebteste Wahl</span> : null}
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
        </section>

        <section className="ticket-info-grid">
          <div className="ticket-info-panel card-grunge">
            <h2>Was ist inklusive?</h2>
            <div className="ticket-info-panel__items">
              {ticketInclusions.map((item) => (
                <article key={item.title}>
                  <IconBadge name={item.icon} size="md" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="ticket-faq card-grunge">
            <h2>Wichtige Infos</h2>
            {ticketFaqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="ticket-venue card-grunge">
            <h2>Event & Venue Info</h2>
            <dl>
              <div>
                <dt>Veranstaltung</dt>
                <dd>{ticketEvent.title}</dd>
              </div>
              <div>
                <dt>Ort</dt>
                <dd>{ticketEvent.location}</dd>
              </div>
              <div>
                <dt>Datum</dt>
                <dd>{ticketEvent.date}</dd>
              </div>
              <div>
                <dt>Disziplinen</dt>
                <dd>{ticketEvent.disciplines.join(" · ")}</dd>
              </div>
            </dl>
            <CTAButton href="/veranstaltungen/smashtime-3-cagetime" variant="outline">
              Event ansehen
            </CTAButton>
          </div>
        </section>
      </div>

      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
