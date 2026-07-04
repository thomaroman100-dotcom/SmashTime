import { CTAButton } from "@/components/ui/CTAButton";
import { EventHighlight } from "@/components/sections/EventHighlight";
import { PageHero } from "@/components/sections/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { IconBadge } from "@/components/ui/IconBadge";
import { NewsCard } from "@/components/sections/NewsCard";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { upcomingEvent } from "@/data/events";
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
          <EventHighlight event={upcomingEvent} />
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
