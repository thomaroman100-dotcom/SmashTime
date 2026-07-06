import Image from "next/image";
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
  const claimLines = hero.claimLines.length > 0 ? hero.claimLines : ["Keine Regeln.", "Nur Respekt."];
  const showPoster = poster.showInHero && Boolean(poster.image || poster.eventTitle);

  return (
    <section
      className={`home-hero${showPoster ? "" : " home-hero--no-poster"}`}
      style={style}
      aria-label="SmashTime Kampfnacht"
    >
      <div className="container home-hero__inner">
        <div className="home-hero__copy">
          <h1 className="home-hero__headline">
            {claimLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className="home-hero__brand">{hero.brandLine}</span>
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

        {showPoster ? (
          <div className="home-hero__poster">
            {poster.image ? (
              <div className="home-hero__poster-media">
                <Image
                  src={poster.image}
                  alt={poster.imageAlt ?? `${poster.eventTitle} Eventposter`}
                  fill
                  sizes="(max-width: 1023px) 90vw, 34vw"
                  priority
                  unoptimized
                  className="home-hero__poster-image"
                />
              </div>
            ) : (
              <div className="home-hero__poster-fallback">
                {hasConfiguredTitle ? <span className="home-hero__poster-edition">{hero.title}</span> : null}
                <span className="home-hero__poster-number">{poster.eventNumber}</span>
                <span className="home-hero__poster-title">{poster.eventTitle}</span>
                <span className="home-hero__poster-date">{poster.dateLabel}</span>
                <span className="home-hero__poster-venue">{poster.venueLabel}</span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
