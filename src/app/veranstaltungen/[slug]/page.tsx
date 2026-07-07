import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { FightCardList } from "@/components/sections/FightCardList";
import { IconBadge } from "@/components/ui/IconBadge";
import { eventRecaps, getEventRecap, type EventRecap } from "@/data/eventRecaps";
import { pageHeroes } from "@/data/heroes";
import { site } from "@/data/site";
import { getPublicFightcardsForEvent } from "@/lib/public-fightcards";
import { getPublicEventBySlug, type PublicEvent } from "@/lib/public-events";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return eventRecaps.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const publicEvent = await getPublicEventBySlug(slug);
  const fallbackEvent = publicEvent ? null : getEventRecap(slug);
  const metadataTitle = publicEvent ? publicEvent.name : fallbackEvent?.title;

  return {
    title: metadataTitle ? `${metadataTitle} | SmashTime` : "Veranstaltung | SmashTime"
  };
}

function shortDateLabel(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

function publicEventToRecap(event: PublicEvent, fightCount: number): EventRecap & { ticketHref?: string } {
  const title = event.shortName.endsWith(".") ? event.shortName : `${event.shortName}.`;
  const redTitle = event.subtitle.endsWith(".") ? event.subtitle : `${event.subtitle}.`;
  const detailSentence = `${event.shortName} findet am ${event.dateLabel} in der ${event.location} statt. Einlass ist ${event.admission}, Beginn ${event.start}.`;

  return {
    slug: event.id,
    title,
    redTitle,
    intro: `${event.subtitle}: ${event.shortName} bringt Kampfsport, Haltung und Live-Atmosphäre in den Ring.`,
    date: event.dateLabel,
    location: event.location,
    address: event.address,
    admission: event.admission,
    start: event.start,
    disciplines: event.disciplines,
    image: event.image,
    stats: [
      { value: shortDateLabel(event.date), label: "Veranstaltungsdatum", icon: "calendar" },
      { value: event.start, label: "Beginn", icon: "clock" },
      { value: event.disciplines.length.toString(), label: "Disziplinen", icon: "fighter" },
      { value: fightCount.toString(), label: fightCount === 1 ? "Bestätigte Paarung" : "Bestätigte Paarungen", icon: "list" }
    ],
    description: [
      detailSentence,
      `Der Kampfabend steht unter dem Motto "${event.subtitle}" und setzt ein klares Zeichen für Respekt, Stärke und Zusammenhalt.`,
      event.gastro
        ? event.gastro
        : "Fightcard und weitere Informationen werden ergänzt, sobald sie offiziell bestätigt sind."
    ],
    results: [],
    quote: {
      text: "Ein Abend für Respekt, Stärke und Zusammenhalt.",
      author: "SmashTime Team"
    },
    gallery: [
      { src: event.image, alt: `${event.name} Eventposter` },
      { src: "/images/backgrounds/smashtime-hero-faceoff-cage.png", alt: "Cage und Arena bei SmashTime" },
      { src: "/images/backgrounds/arena-seats-cage.png", alt: "Arena mit Käfig" }
    ],
    ticketHref: event.ticketHref
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const publicEvent = await getPublicEventBySlug(slug);
  const fallbackEvent = publicEvent ? null : getEventRecap(slug);

  if (!publicEvent && !fallbackEvent) {
    notFound();
  }

  const visibleFights = await getPublicFightcardsForEvent(slug);
  const event = publicEvent ? publicEventToRecap(publicEvent, visibleFights.length) : fallbackEvent!;
  const ticketHref = publicEvent?.ticketHref ?? site.ticketHref;

  return (
    <>
      <article className="event-detail">
        <PageHero
          className="page-hero--detail"
          kicker="SmashTime Kampfabend"
          preset={pageHeroes.events}
          preContent={
            <Link className="page-hero__back" href="/veranstaltungen">
              <ArrowLeft aria-hidden="true" size={18} /> Zurück zu den Veranstaltungen
            </Link>
          }
          redTitle={event.redTitle}
          text={event.intro}
          title={event.title}
        />

        <div className="container">
          <div className="event-detail__info card-grunge">
            <dl>
              <div>
                <dt>Datum</dt>
                <dd>{event.date}</dd>
              </div>
              <div>
                <dt>Ort</dt>
                <dd>{event.location}</dd>
              </div>
              <div>
                <dt>Einlass</dt>
                <dd>{event.admission}</dd>
              </div>
              <div>
                <dt>Beginn</dt>
                <dd>{event.start}</dd>
              </div>
              <div>
                <dt>Disziplinen</dt>
                <dd>{event.disciplines.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <section className="event-stats">
            {event.stats.map((stat) => (
              <article className="card-grunge" key={stat.label}>
                <IconBadge name={stat.icon} size="md" />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </section>

          <FightCardList
            fights={visibleFights}
            title="Fightcard"
            description="Die zentrale Kampfkarte für diesen Kampfabend: Länderduelle, Hauptkarte und weitere Paarungen werden hier gepflegt."
            ctaHref={ticketHref}
            ctaLabel="Tickets sichern"
          />

          <section className="event-detail__content">
            <div className="event-description card-grunge">
              <h2>Die Veranstaltung</h2>
              {event.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="event-results card-grunge" id="ergebnisse">
              <div className="event-results__head">
                <h2>Ergebnisse</h2>
              </div>
              {event.results.length === 0 ? (
                <p className="event-results__empty">Ergebnisse werden nach der Veranstaltung veröffentlicht.</p>
              ) : (
                <div className="event-results__grid">
                  {event.results.map((result) => (
                    <article key={result.id}>
                      <span>{result.label}</span>
                      <strong>
                        {result.fighterA} <em>vs.</em> {result.fighterB}
                      </strong>
                      <small>{result.method}</small>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="event-media-grid">
            <div className="event-quote card-grunge">
              <span aria-hidden="true">“</span>
              <blockquote>{event.quote.text}</blockquote>
              <strong>- {event.quote.author}</strong>
            </div>

            <div className="event-gallery card-grunge">
              <h2>Bildergalerie</h2>
              <div>
                {event.gallery.map((image) => (
                  <figure key={image.src}>
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 920px) 30vw, 180px" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </div>
      </article>

      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
