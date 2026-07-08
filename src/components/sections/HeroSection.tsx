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
  const heroTitle = hero.title.trim();
  const explicitTitleLines = heroTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const titleWords = heroTitle.replace(/\s+/g, " ").split(" ").filter(Boolean);
  const titleBreakIndex = Math.ceil(titleWords.length / 2);
  const titleLead = explicitTitleLines[0] ?? titleWords.slice(0, titleBreakIndex).join(" ");
  const titlePunch = explicitTitleLines.length > 1
    ? explicitTitleLines.slice(1).join(" ")
    : titleWords.slice(titleBreakIndex).join(" ");
  const heroSubtitle = hero.subtitle.trim();
  const showPoster = poster.showInHero && Boolean(poster.image || poster.eventTitle);
  const posterClassName = poster.image
    ? "home-hero__poster home-hero__poster--image"
    : "home-hero__poster home-hero__poster--fallback";

  return (
    <section
      className={`home-hero${showPoster ? "" : " home-hero--no-poster"}`}
      style={style}
      aria-label="SmashTime Kampfnacht"
    >
      <div className="container home-hero__inner">
        <div className="home-hero__copy">
          <h1 className="home-hero__headline" aria-label={heroTitle}>
            <span className="home-hero__headline-lead">{titleLead || heroTitle}</span>
            {titlePunch ? <span className="home-hero__headline-punch">{titlePunch}</span> : null}
          </h1>
          <p className="home-hero__tagline">{heroSubtitle}</p>
        </div>

        {showPoster ? (
          <div className={posterClassName}>
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
                {heroTitle ? <span className="home-hero__poster-edition">{heroTitle}</span> : null}
                <span className="home-hero__poster-number">{poster.eventNumber}</span>
                <span className="home-hero__poster-title">{poster.eventTitle}</span>
                <span className="home-hero__poster-date">{poster.dateLabel}</span>
                <span className="home-hero__poster-venue">{poster.venueLabel}</span>
              </div>
            )}
          </div>
        ) : null}

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
    </section>
  );
}
