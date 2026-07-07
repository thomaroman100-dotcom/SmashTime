import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { CountdownBar } from "@/components/sections/CountdownBar";
import { CTASection } from "@/components/sections/CTASection";
import { EventCard } from "@/components/sections/EventCard";
import { HeroSection } from "@/components/sections/HeroSection";
import { MainFightBanner } from "@/components/sections/MainFightBanner";
import { SectionHead } from "@/components/ui/SectionHead";
import { champions } from "@/data/champions";
import { upcomingEvent } from "@/data/events";
import {
  homeEventPoster,
  homeSections,
  mainFightFallback,
  nextEvent
} from "@/data/homepage";
import type { HomeEventPoster } from "@/data/homepage";
import { newsItems } from "@/data/news";
import { sponsorLogos } from "@/data/sponsors";
import { getPublicHeroEvent, type PublicHomeEvent } from "@/lib/public-events";
import { getPublicFightcardsForEvent, pickFeaturedFight } from "@/lib/public-fightcards";
import { getPublicSiteSettings } from "@/lib/site-settings";

function eventNumberFromShortName(shortName: string) {
  return (/\d+/.exec(shortName)?.[0] ?? shortName.replace(/smashtime/i, "").trim()) || "ST";
}

function posterFromEvent(event: PublicHomeEvent | typeof upcomingEvent, showInHero: boolean): HomeEventPoster {
  return {
    eventNumber: eventNumberFromShortName(event.shortName),
    eventTitle: event.subtitle,
    dateLabel: event.dateLabel,
    venueLabel: event.location,
    image: event.image,
    imageAlt: `${event.name} Eventposter`,
    showInHero
  };
}

export default async function Home() {
  const [publicSettings, heroEvent] = await Promise.all([
    getPublicSiteSettings(),
    getPublicHeroEvent()
  ]);
  const configuredHome = publicSettings.home;
  const homepageEvent = heroEvent ?? nextEvent;
  const heroPoster = heroEvent ? posterFromEvent(heroEvent, heroEvent.showInHero) : { ...homeEventPoster, showInHero: false };
  const upcomingEvents = [homepageEvent];
  const configuredSite = publicSettings.site;
  const homepageFightcard = await getPublicFightcardsForEvent(homepageEvent.id);
  const featuredFight = pickFeaturedFight(homepageFightcard);

  return (
    <div className="home-page home-page--poster">
      <HeroSection hero={configuredHome.hero} poster={heroPoster} />

      {configuredHome.countdown.enabled ? (
        <CountdownBar
          label={configuredHome.countdown.label}
          targetDate={heroEvent?.date || configuredHome.countdown.targetDate}
          ctaLabel={configuredHome.countdown.ctaLabel}
          ctaHref={configuredHome.countdown.ctaHref}
          fallback={configuredHome.countdown.fallback}
        />
      ) : null}

      <MainFightBanner event={homepageEvent} fight={featuredFight} fights={homepageFightcard} fallback={mainFightFallback} />

      {configuredHome.sections.champions.enabled ? (
        <section className="home-champions" aria-label={configuredHome.sections.champions.title}>
          <div className="container">
            <SectionHead
              title={configuredHome.sections.champions.title}
              description={configuredHome.sections.champions.description}
              ctaLabel={configuredHome.sections.champions.ctaLabel}
              ctaHref={configuredHome.sections.champions.ctaHref}
            />
            <div className="home-champions__grid">
              {champions.slice(0, configuredHome.sections.champions.displayLimit).map((champion) => (
                <Link
                  href={`/champions/${champion.slug}`}
                  className="champion-tile"
                  key={champion.slug}
                >
                  <div className="champion-tile__image">
                    <Image
                      src={champion.image}
                      alt={champion.name}
                      fill
                      sizes="(max-width: 767px) 46vw, (max-width: 1023px) 30vw, 22vw"
                    />
                    <span className="champion-tile__crown" aria-hidden="true">
                      <Crown size={16} strokeWidth={2.2} />
                    </span>
                  </div>
                  <strong>{champion.name}</strong>
                  <span>{champion.weightClass}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="home-about" aria-label={homeSections.about.title}>
        <div className="container home-about__inner">
          <div className="home-about__media">
            <Image
              src={homeSections.about.image}
              alt={homeSections.about.imageAlt}
              fill
              sizes="(max-width: 1023px) 92vw, 40vw"
            />
          </div>
          <div className="home-about__copy">
            <SectionHead title={homeSections.about.title} />
            {homeSections.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href={homeSections.about.ctaHref} className="btn btn--outline">
              <span>{homeSections.about.ctaLabel}</span>
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="home-about__brush">
            <Image
              src={homeSections.about.brushImage}
              alt={homeSections.about.brushAlt}
              width={340}
              height={340}
            />
          </div>
        </div>
      </section>

      <section className="home-lower" aria-label="Veranstaltungen und Neuigkeiten">
        <div className="container home-lower__grid">
          <div className="home-lower__col home-lower__col--events">
            <SectionHead title={homeSections.events.title} />
            <div className="event-row-list">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} ticketHref={configuredSite.ticketHref} />
              ))}
              <p className="event-row-list__note">{homeSections.events.emptyNote}</p>
            </div>
            <Link href={homeSections.events.ctaHref} className="section-head__cta home-lower__more">
              {homeSections.events.ctaLabel} <ArrowRight aria-hidden="true" size={15} strokeWidth={2.6} />
            </Link>
          </div>

          <div className="home-lower__col home-lower__col--news">
            {configuredHome.sections.news.enabled ? (
              <>
                <SectionHead
                  title={configuredHome.sections.news.title}
                  description={configuredHome.sections.news.description}
                />
                <div className="home-news-list">
                  {newsItems.slice(0, configuredHome.sections.news.displayLimit).map((item) => (
                    <Link href={`/neuigkeiten/${item.slug}`} className="home-news-item" key={item.id}>
                      {item.image ? (
                        <div className="home-news-item__thumb">
                          <Image src={item.image} alt="" fill sizes="120px" />
                        </div>
                      ) : null}
                      <div>
                        <span className="home-news-item__category">{item.category}</span>
                        <h3>{item.title}</h3>
                        <time>{item.date}</time>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href={configuredHome.sections.news.ctaHref} className="section-head__cta home-lower__more">
                  {configuredHome.sections.news.ctaLabel} <ArrowRight aria-hidden="true" size={15} strokeWidth={2.6} />
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {configuredHome.sections.sponsors.enabled ? (
        <section className="home-sponsors" aria-label={configuredHome.sections.sponsors.title}>
          <div className="container">
            <SectionHead
              title={configuredHome.sections.sponsors.title}
              description={configuredHome.sections.sponsors.description}
              ctaLabel={configuredHome.sections.sponsors.ctaLabel}
              ctaHref={configuredHome.sections.sponsors.ctaHref}
            />
            <div className="home-sponsors__logos">
              {sponsorLogos.slice(0, configuredHome.sections.sponsors.displayLimit).map((logo) => (
                <div className="sponsor-logo" key={logo.name}>
                  <strong>{logo.name}</strong>
                  <span>{logo.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        title={configuredHome.ticketCta.title}
        text={configuredHome.ticketCta.text}
        ctaLabel={configuredHome.ticketCta.ctaLabel}
        ctaHref={configuredHome.ticketCta.ctaHref}
      />
    </div>
  );
}
