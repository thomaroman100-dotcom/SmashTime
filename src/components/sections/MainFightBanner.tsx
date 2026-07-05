import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SmashEvent } from "@/data/events";
import type { FightCardEntry } from "@/data/fightcards";

type MainFightBannerProps = {
  event: SmashEvent;
  fight?: FightCardEntry;
  fallback: {
    label: string;
    title: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export function MainFightBanner({ event, fight, fallback }: MainFightBannerProps) {
  const href = event.detailHref ?? fallback.ctaHref;

  return (
    <section className="main-fight" aria-label="Main Event">
      <div className="container">
        <Link href={href} className="main-fight__banner">
          <div className="main-fight__content">
            <span className="main-fight__label">
              {fight ? `${fight.weightClass} · ${fight.discipline}` : fallback.label}
            </span>
            {fight ? (
              <h2 className="main-fight__title">
                <span>{fight.fighterA}</span>
                <em>vs</em>
                <span>{fight.fighterB}</span>
              </h2>
            ) : (
              <h2 className="main-fight__title main-fight__title--fallback">{fallback.title}</h2>
            )}
            <p className="main-fight__meta">
              {event.dateLabel} <em>|</em> {event.location}
            </p>
            {!fight ? <p className="main-fight__note">{fallback.text}</p> : null}
          </div>
          <span className="btn btn--outline main-fight__cta">
            <span>{fallback.ctaLabel}</span>
            <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
          </span>
        </Link>
      </div>
    </section>
  );
}
