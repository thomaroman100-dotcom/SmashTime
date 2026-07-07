import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SmashEvent } from "@/data/events";
import { formatFightCardLabel, isTeamFight, type FightCardEntry } from "@/data/fightcards";
import { getMemberImageSrc } from "@/lib/media-placeholders";

type MainFightBannerProps = {
  event: SmashEvent;
  fight?: FightCardEntry;
  fights?: FightCardEntry[];
  fallback: {
    label: string;
    title: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

type BannerPortraitProps = {
  name: string;
  image?: string;
  side: "left" | "right";
};

function BannerPortrait({ name, image, side }: BannerPortraitProps) {
  return (
    <div className={`main-fight__portrait main-fight__portrait--${side}`}>
      <Image src={getMemberImageSrc(image)} alt={`${name} Fightcard-Portrait`} fill sizes="(max-width: 900px) 0px, 260px" />
    </div>
  );
}

export function MainFightBanner({ event, fight, fights = [], fallback }: MainFightBannerProps) {
  const href = fallback.ctaHref;
  const fightcard = fights.length > 0 ? fights : fight ? [fight] : [];
  const featuredFight = fight ?? fightcard[0];
  const marqueeItems = fightcard.length > 1 ? [...fightcard, ...fightcard] : fightcard;
  const hasFightcard = Boolean(featuredFight);
  const featuredIsTeamFight = featuredFight ? isTeamFight(featuredFight) : false;

  return (
    <section className="main-fight" aria-label="Fightcard">
      <div className="container">
        <Link href={href} className={`main-fight__banner${hasFightcard ? " main-fight__banner--active" : ""}`}>
          {featuredFight ? (
            <BannerPortrait name={featuredFight.fighterA} image={featuredFight.fighterAImage} side="left" />
          ) : null}
          <div className="main-fight__content">
            <span className="main-fight__label">
              {featuredFight
                ? featuredIsTeamFight
                  ? "2 gegen 2 Länderduell"
                  : formatFightCardLabel(featuredFight.label)
                : fallback.label}
            </span>
            {featuredFight ? (
              <h2 className="main-fight__title">
                <span>{featuredFight.fighterA}</span>
                <em>vs</em>
                <span>{featuredFight.fighterB}</span>
              </h2>
            ) : (
              <h2 className="main-fight__title main-fight__title--fallback">{fallback.title}</h2>
            )}
            <p className="main-fight__meta">
              {event.dateLabel} <em>|</em> {event.location}
            </p>
            {fightcard.length > 0 ? (
              <div className={`main-fight__ticker${fightcard.length > 1 ? " main-fight__ticker--marquee" : ""}`}>
                <div className="main-fight__track">
                  {marqueeItems.map((item, index) => (
                    <span className="main-fight__pill" key={`${item.id}-${index}`}>
                      <b>{isTeamFight(item) ? "2 gegen 2" : formatFightCardLabel(item.label)}</b>
                      <strong>
                        {item.fighterA} <em>vs</em> {item.fighterB}
                      </strong>
                      <small>{item.discipline}</small>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="main-fight__note">{fallback.text}</p>
            )}
          </div>
          {featuredFight ? (
            <BannerPortrait name={featuredFight.fighterB} image={featuredFight.fighterBImage} side="right" />
          ) : null}
          <span className="btn btn--outline main-fight__cta">
            <span>{fallback.ctaLabel}</span>
            <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
          </span>
        </Link>
      </div>
    </section>
  );
}
