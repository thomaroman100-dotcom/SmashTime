import { CalendarDays, MapPin } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { Countdown } from "@/components/sections/Countdown";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CTAButton } from "@/components/ui/CTAButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { fightNight, fightNightHighlights, fightNightRules } from "@/data/fightNight";
import { fightCardBouts, fightCardNotice } from "@/data/fights";
import { site } from "@/data/site";

export const metadata = {
  title: "Kampfabend | SmashTime"
};

export default function FightNightPage() {
  const visibleBouts = fightCardBouts
    .filter((bout) => bout.sichtbar)
    .sort((a, b) => a.reihenfolge - b.reihenfolge);

  return (
    <>
      <PageHero
        title={fightNight.title}
        redTitle={fightNight.redTitle}
        text={fightNight.text}
        image={fightNight.backgroundImage}
        imagePosition="center center"
        compact
      />

      <div className="phase-page fight-night-page">
        <section className="fight-main card-grunge card-grunge--event">
          <span className="fight-main__label">{fightNight.mainEventLabel}</span>
          <div className="fight-main__fighter">
            <strong>{fightNight.mainEvent.fighterA}</strong>
            <small>{fightNight.mainEvent.discipline}</small>
          </div>
          <div className="fight-main__center">
            <span>{fightNight.championship}</span>
            <b>VS.</b>
            <dl>
              <div>
                <dt>
                  <CalendarDays aria-hidden="true" size={18} /> Datum
                </dt>
                <dd>{fightNight.dateLabel}</dd>
              </div>
              <div>
                <dt>
                  <MapPin aria-hidden="true" size={18} /> Ort
                </dt>
                <dd>{fightNight.location}</dd>
              </div>
            </dl>
            <CTAButton href={site.headerCta.href}>Nächste Veranstaltung ansehen</CTAButton>
          </div>
          <div className="fight-main__fighter fight-main__fighter--right">
            <strong>{fightNight.mainEvent.fighterB}</strong>
            <small>{fightNight.mainEvent.weightClass}</small>
          </div>
        </section>

        <section className="fight-night-grid">
          <div className="fight-table card-grunge" id="fightcard">
            <h2>Fightcard</h2>
            <div className="fight-table__rows">
              {visibleBouts.length > 0 ? (
                visibleBouts.map((bout) => (
                  <article key={bout.id}>
                    <span>{bout.label}</span>
                    <strong>
                      {bout.fighterA} <em>vs.</em> {bout.fighterB}
                    </strong>
                    <small>
                      {bout.gewichtsklasse} · {bout.kampfart}
                    </small>
                  </article>
                ))
              ) : (
                <p className="fight-table__empty">{fightCardNotice}</p>
              )}
            </div>
          </div>

          <div className="fight-rules card-grunge">
            <h2>Regelwerk & Disziplinen</h2>
            {fightNightRules.map((rule) => (
              <article key={rule.title}>
                <IconBadge name="fighter" size="sm" />
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="fight-expect card-grunge">
            <h2>Das erwartet dich</h2>
            {fightNightHighlights.map((item) => (
              <article key={item.title}>
                <IconBadge name={item.icon} size="sm" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="fight-countdown card-grunge">
            <h2>Kampfabend startet in</h2>
            <Countdown targetDate={fightNight.eventDate} />
          </div>

          <div className="fight-cta card-grunge">
            <h2>Sei dabei.</h2>
            <p>Erlebe echte Action.</p>
            <CTAButton href="/kontakt">Kontakt aufnehmen</CTAButton>
          </div>
        </section>
      </div>

      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
