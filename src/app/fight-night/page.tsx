import { CalendarDays } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { Countdown } from "@/components/sections/Countdown";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { FightBoutCard } from "@/components/sections/FightBoutCard";
import { CTAButton } from "@/components/ui/CTAButton";
import { IconBadge, type IconName } from "@/components/ui/IconBadge";
import { upcomingEvent } from "@/data/events";
import { fightNight, fightNightHighlights, fightNightRules } from "@/data/fightNight";
import { pageHeroes } from "@/data/heroes";
import { site } from "@/data/site";
import { getPublicFightcardsForEvent } from "@/lib/public-fightcards";

export const metadata = {
  title: "Kampfabend | SmashTime"
};

const disciplineIconNames: Record<string, IconName> = {
  MMA: "fighter",
  K1: "target",
  "Xtreme Boxen": "flame",
  Boxen: "shield",
  "Influenza Kämpfe": "users"
};

export default async function FightNightPage() {
  const visibleFights = await getPublicFightcardsForEvent(upcomingEvent.id);

  return (
    <>
      <PageHero
        title={fightNight.title}
        redTitle={fightNight.redTitle}
        text={fightNight.text}
        preset={pageHeroes.fightNight}
        kicker={upcomingEvent.disciplines.join(" · ")}
        compact
      />
      <div className="container fight-night-page">
        <section className="fight-main card-grunge">
          <span className="fight-main__label">{fightNight.championship}</span>
          <div className="fight-main__fighter">
            <small>Rote Ecke</small>
            <strong>{fightNight.mainEvent.fighterA}</strong>
          </div>
          <div className="fight-main__center">
            <span>{fightNight.mainEventLabel}</span>
            <b>VS</b>
            <dl>
              <div>
                <dt>Gewichtsklasse</dt>
                <dd>{fightNight.mainEvent.weightClass}</dd>
              </div>
              <div>
                <dt>Disziplin</dt>
                <dd>{fightNight.mainEvent.discipline}</dd>
              </div>
            </dl>
            <CTAButton href={site.ticketHref}>Tickets sichern</CTAButton>
          </div>
          <div className="fight-main__fighter fight-main__fighter--right">
            <small>Blaue Ecke</small>
            <strong>{fightNight.mainEvent.fighterB}</strong>
          </div>
        </section>

        <div className="fight-night-grid">
          <section className="fight-table card-grunge" id="fightcard" aria-labelledby="fight-table-title">
            <h2 id="fight-table-title">Fightcard</h2>
            {visibleFights.length === 0 ? (
              <p className="fight-table__empty">Fightcard wird bald veröffentlicht.</p>
            ) : (
              <div className="fight-table__rows">
                {visibleFights.map((fight) => (
                  <FightBoutCard key={fight.id} fight={fight} variant="compact" />
                ))}
              </div>
            )}
          </section>

          <section className="fight-rules card-grunge" aria-labelledby="fight-rules-title">
            <h2 id="fight-rules-title">Regelwerk &amp; Disziplinen</h2>
            {fightNightRules.map((rule) => (
              <article key={rule.title}>
                <IconBadge name={disciplineIconNames[rule.title] ?? "shield"} />
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.text}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="fight-expect card-grunge" aria-labelledby="fight-expect-title">
            <h2 id="fight-expect-title">Was dich erwartet</h2>
            {fightNightHighlights.map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="fight-countdown card-grunge" aria-labelledby="fight-countdown-title">
            <h2 id="fight-countdown-title">Countdown</h2>
            <Countdown targetDate={upcomingEvent.date} />
          </section>

          <section className="fight-cta card-grunge" aria-label="Tickets sichern">
            <p>
              <CalendarDays aria-hidden="true" size={20} /> {fightNight.dateLabel}
            </p>
            <CTAButton href={site.ticketHref}>Tickets sichern</CTAButton>
          </section>
        </div>
      </div>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
