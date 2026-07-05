import Link from "next/link";
import { ArrowRight, Ticket } from "lucide-react";
import type { HomeEventPoster, HomeHero } from "@/data/homepage";

type HeroSectionProps = {
  hero: HomeHero;
  poster: HomeEventPoster;
};

export function HeroSection({ hero, poster }: HeroSectionProps) {
  const style = {
    "--home-hero-image": `url(${hero.backgroundImage})`,
    "--home-hero-position": hero.backgroundPosition
  } as React.CSSProperties;
  const hasConfiguredTitle = Boolean(hero.title?.trim());

  return (
    <section className="home-hero" style={style} aria-label="SmashTime Kampfnacht">
      <div className="container home-hero__inner">
        <div className="home-hero__copy">
          <h1 className="home-hero__headline">
            {hasConfiguredTitle ? (
              <span className="home-hero__brand">{hero.title}</span>
            ) : (
              <>
                {hero.claimLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <span className="home-hero__brand">{hero.brandLine}</span>
              </>
            )}
          </h1>
          {hero.subtitle ? <p className="home-hero__subtitle">{hero.subtitle}</p> : null}
          <p className="home-hero__tagline">{hero.tagline}</p>
          <div className="home-hero__actions">
            <Link href={hero.primaryCta.href} className="btn btn--primary">
              <Ticket aria-hidden="true" size={17} strokeWidth={2.4} />
              <span>{hero.primaryCta.label}</span>
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn--outline">
              <span>{hero.secondaryCta.label}</span>
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
            </Link>
          </div>
        </div>

        <div className="home-hero__poster">
          <span className="home-hero__poster-number">{poster.eventNumber}</span>
          <span className="home-hero__poster-title">{poster.eventTitle}</span>
          <span className="home-hero__poster-date">{poster.dateLabel}</span>
          <span className="home-hero__poster-venue">{poster.venueLabel}</span>
        </div>
      </div>
    </section>
  );
}
