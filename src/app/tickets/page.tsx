import { Check } from "lucide-react";
import Image from "next/image";
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
        redTitle="Sichere dir deinen Platz."
        text="Alle Informationen zu Ticketpaketen, Einlass und Veranstaltungsort für den nächsten SmashTime-Kampfabend."
        preset={pageHeroes.tickets}
        meta={[ticketEvent.date, ticketEvent.location, `Einlass ${ticketEvent.admission}`]}
        compact
      />
      <div className="container tickets-page">
        <section className="ticket-event card-grunge" aria-label={ticketEvent.title}>
          <div className="ticket-event__media">
            <Image src={ticketEvent.image} alt="" fill sizes="(max-width: 960px) 100vw, 33vw" />
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
            {ticketInclusions.slice(0, 2).map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

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

        <div className="ticket-info-grid">
          <div className="ticket-info-panel card-grunge">
            <h2>Was ist inklusive?</h2>
            <div className="ticket-info-panel__items">
              {ticketInclusions.map((item) => (
                <article key={item.title}>
                  <IconBadge name={item.icon} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="ticket-faq card-grunge">
            <h2>Häufige Fragen</h2>
            {ticketFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="ticket-venue card-grunge">
            <h2>Veranstaltungsort</h2>
            <dl>
              <div>
                <dt>Ort</dt>
                <dd>{ticketEvent.location}</dd>
              </div>
              <div>
                <dt>Adresse</dt>
                <dd>{ticketEvent.address}</dd>
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
            <CTAButton href="/kontakt" variant="outline">
              Kontakt aufnehmen
            </CTAButton>
          </div>
        </div>
      </div>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
