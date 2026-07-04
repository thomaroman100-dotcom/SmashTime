import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { IconBadge } from "@/components/ui/IconBadge";
import { aboutHero, aboutInvites, aboutPillars, aboutStats, aboutStory, aboutValues } from "@/data/about";
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
        image={pageHeroes.eventsModule.image}
        imagePosition={pageHeroes.eventsModule.position}
        compact
      />

      <div className="phase-page about-page">
        <section className="about-pillars card-grunge">
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

        <section className="about-values">
          {aboutValues.map((value) => (
            <article className="about-value card-grunge" key={value.title}>
              <IconBadge name={value.icon} size="lg" />
              <h2>{value.title}</h2>
              <p>{value.text}</p>
            </article>
          ))}
        </section>

        <section className="about-story card-grunge">
          <div className="about-story__image">
            <Image src={aboutStory.image} alt="" fill sizes="(max-width: 920px) 100vw, 42vw" />
          </div>
          <div className="about-story__copy">
            <span>{aboutStory.label}</span>
            <h2>{aboutStory.title}</h2>
            <p>{aboutStory.text}</p>
          </div>
        </section>

        <section className="about-stats card-grunge" aria-label="SmashTime Kennzahlen">
          {aboutStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="about-invite card-grunge">
          <div>
            <h2>Wir laden dich ein</h2>
            <p>Erlebe SmashTime live, sichere dir dein Ticket oder werde Teil der Partnerseite.</p>
          </div>
          <div className="about-invite__links">
            {aboutInvites.map((invite) => (
              <Link href={invite.href} key={invite.title}>
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
