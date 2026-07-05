import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { IconBadge } from "@/components/ui/IconBadge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  aboutHero,
  aboutInvites,
  aboutPillars,
  aboutStats,
  aboutStory,
  aboutValues
} from "@/data/about";
import { pageHeroes } from "@/data/heroes";

export const metadata = {
  title: "Über uns | SmashTime"
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={aboutHero.title}
        redTitle={aboutHero.redTitle}
        text={aboutHero.text}
        preset={pageHeroes.about}
        compact
      />
      <div className="container about-page">
        <section className="about-pillars card-grunge" aria-label="Mission und Werte im Überblick">
          {aboutPillars.map((pillar) => (
            <article key={pillar.title}>
              <IconBadge name={pillar.icon} size="lg" />
              <div>
                <h2>{pillar.title}</h2>
                <p>{pillar.text}</p>
              </div>
            </article>
          ))}
        </section>

        <SectionTitle>Unsere Werte</SectionTitle>
        <div className="about-values">
          {aboutValues.map((value) => (
            <article className="about-value card-grunge" key={value.title}>
              <IconBadge name={value.icon} />
              <h2>{value.title}</h2>
              <p>{value.text}</p>
            </article>
          ))}
        </div>

        <section className="about-story card-grunge">
          <div className="about-story__image">
            <Image src={aboutStory.image} alt="" fill sizes="(max-width: 960px) 100vw, 45vw" />
          </div>
          <div className="about-story__copy">
            <span>{aboutStory.label}</span>
            <h2>{aboutStory.title}</h2>
            <p>{aboutStory.text}</p>
          </div>
        </section>

        <div className="about-stats card-grunge" aria-label="SmashTime in Zahlen">
          {aboutStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <section className="about-invite card-grunge">
          <div>
            <h2>Werde Teil von SmashTime</h2>
            <p>Ob als Fan, Sponsor oder zukünftiger Kämpfer – hier findest du deinen Einstieg.</p>
          </div>
          <div className="about-invite__links">
            {aboutInvites.map((invite) => (
              <Link key={invite.title} href={invite.href}>
                <IconBadge name={invite.icon} size="sm" />
                <span>
                  <strong>{invite.title}</strong>
                  <small>{invite.text}</small>
                </span>
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
