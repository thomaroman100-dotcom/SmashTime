import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CTAButton } from "@/components/ui/CTAButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { eventRecaps, getEventRecap } from "@/data/eventRecaps";
import { site } from "@/data/site";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return eventRecaps.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventRecap(slug);

  return {
    title: event ? `${event.title} ${event.redTitle} | SmashTime` : "Veranstaltung | SmashTime"
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = getEventRecap(slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <article className="event-detail">
        <div className="container">
          <Link className="news-detail__back" href="/veranstaltungen">
            <ArrowLeft aria-hidden="true" size={18} /> Zurück zu den Veranstaltungen
          </Link>

          <header className="event-detail__hero">
            <div>
              <h1>
                <span>{event.title}</span>
                <span>{event.redTitle}</span>
              </h1>
              <p>{event.intro}</p>
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
            </div>
            <div className="event-detail__image">
              <Image src={event.image} alt="" fill priority sizes="(max-width: 920px) 100vw, 52vw" />
            </div>
          </header>

          <section className="event-stats">
            {event.stats.map((stat) => (
              <article className="card-grunge" key={stat.label}>
                <IconBadge name={stat.icon} size="md" />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </section>

          <section className="event-detail__content">
            <div className="event-description card-grunge">
              <h2>Das Event</h2>
              {event.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="event-results card-grunge">
              <div className="event-results__head">
                <h2>Ergebnisse</h2>
                <CTAButton href={site.fightNightHref} variant="outline">
                  Fight Night ansehen
                </CTAButton>
              </div>
              {event.results.length === 0 ? (
                <p className="event-results__empty">Ergebnisse werden nach dem Event veröffentlicht.</p>
              ) : (
                <div className="event-results__grid">
                  {event.results.map((result) => (
                    <article key={result.id}>
                      <span>{result.label}</span>
                      <strong>
                        {result.fighterA} <em>vs.</em> {result.fighterB}
                      </strong>
                      <small>
                        {result.winner ? `Sieger: ${result.winner}` : "Sieger wird ergänzt"} · {result.method}
                      </small>
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
      <CallToActionBand href="/tickets" />
    </>
  );
}
