import { AtSign, Clock3, Mail, MapPin } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { upcomingEvent } from "@/data/events";
import { pageHeroes } from "@/data/heroes";
import { site } from "@/data/site";

export const metadata = {
  title: "Kontakt | SmashTime"
};

export default function ContactPage() {
  const instagramHref = site.socialLinks.find((item) => item.label === "Instagram" && item.href !== "#")?.href;
  const contactEmail = site.contact.email.trim();

  return (
    <>
      <PageHero
        title="Kontakt."
        redTitle="Direkter Draht."
        text="Du hast Fragen, Anregungen oder möchtest Teil von SmashTime werden? Schreib uns – wir melden uns so schnell wie möglich."
        preset={pageHeroes.contact}
        compact
      />

      <section className="contact-page">
        <div className="container contact-page__grid">
          <ContactForm />

          <aside className="contact-info">
            <h2>Veranstaltungsort</h2>
            <div className="contact-info__row">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Nächste Veranstaltung</strong>
                <span>{upcomingEvent.name}</span>
              </div>
            </div>
            <div className="contact-info__row">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Datum</strong>
                <span>{upcomingEvent.dateLabel}</span>
              </div>
            </div>
            <div className="contact-info__row">
              <MapPin aria-hidden="true" />
              <div>
                <strong>{upcomingEvent.location}</strong>
                <span>{upcomingEvent.address}</span>
              </div>
            </div>
            <div className="contact-info__row">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Einlass</strong>
                <span>{upcomingEvent.admission}</span>
              </div>
            </div>
            <div className="contact-info__row">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Beginn</strong>
                <span>{upcomingEvent.start}</span>
              </div>
            </div>
            <div className="contact-info__row">
              <Clock3 aria-hidden="true" />
              <div>
                <strong>Disziplinen</strong>
                <span>{upcomingEvent.disciplines.join(" · ")}</span>
              </div>
            </div>
            {upcomingEvent.gastro ? (
              <div className="contact-info__row">
                <Clock3 aria-hidden="true" />
                <div>
                  <strong>Gastro</strong>
                  <span>Gastro: {upcomingEvent.gastro}</span>
                </div>
              </div>
            ) : null}
            <div className="contact-info__row">
              <AtSign aria-hidden="true" />
              <div>
                <strong>Instagram</strong>
                {instagramHref ? (
                  <a href={instagramHref} target="_blank" rel="noreferrer">
                    {site.contact.instagram}
                  </a>
                ) : (
                  <span>{site.contact.instagram}</span>
                )}
              </div>
            </div>
            {contactEmail ? (
              <div className="contact-info__row">
                <Mail aria-hidden="true" />
                <div>
                  <strong>E-Mail</strong>
                  <span>{contactEmail}</span>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
