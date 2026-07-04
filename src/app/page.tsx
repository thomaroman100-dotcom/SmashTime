import { CTAButton } from "@/components/ui/CTAButton";
import { EventHighlight } from "@/components/sections/EventHighlight";
import { PageHero } from "@/components/sections/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IconBadge } from "@/components/ui/IconBadge";
import { NewsCard } from "@/components/sections/NewsCard";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { upcomingEvent } from "@/data/events";
import { fightCardNotice } from "@/data/fights";
import { fightNight, fightNightHighlights } from "@/data/fightNight";
import { featureItems } from "@/data/site";
import { newsItems } from "@/data/news";

export default function Home() {
  return (
    <div className="home-page">
      <PageHero
        title="Smash Time."
        redTitle="Echte Action."
        text="SmashTime ist die neue Generation des Kampfsports. Härter. Lauter. Unvergesslich."
        className="page-hero--home"
      >
        <CTAButton href="#was-dich-erwartet" variant="outline">
          Mehr erfahren
        </CTAButton>
      </PageHero>

      <section className="home-event-section" aria-label="Nächste Veranstaltung">
        <div className="container home-event-wrap">
          <EventHighlight event={upcomingEvent} detailsHref={upcomingEvent.detailHref} />
        </div>
      </section>

      <section className="home-fight-preview" aria-labelledby="home-fight-preview-title">
        <div className="container home-fight-preview__grid">
          <article className="home-fight-preview__main card-grunge">
            <span>Kampfabend</span>
            <h2 id="home-fight-preview-title">Fightcard & Ablauf</h2>
            <p>{fightNight.text}</p>
            <div className="home-fight-preview__actions">
              <CTAButton href="/veranstaltungen#fightcard">Zum Kampfabend</CTAButton>
              <CTAButton href="/veranstaltungen#fightcard" variant="outline">
                Fightcard ansehen
              </CTAButton>
            </div>
          </article>

          <aside className="home-fight-preview__notice card-grunge" aria-label="Fightcard Status">
            <strong>{fightCardNotice}</strong>
            <p>{fightNightHighlights[0]?.text}</p>
          </aside>
        </div>
      </section>

      <section className="expect-section" id="was-dich-erwartet">
        <div className="container">
          <SectionTitle>Was dich erwartet</SectionTitle>
          <div className="expect-section__grid">
            {featureItems.map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} size="lg" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="preview-section" id="neuigkeiten">
        <div className="container">
          <SectionTitle>Aktuelle Neuigkeiten</SectionTitle>
          <div className="preview-section__grid">
            {newsItems.slice(0, 4).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <SponsorStrip />
      <CallToActionBand />
    </div>
  );
}
