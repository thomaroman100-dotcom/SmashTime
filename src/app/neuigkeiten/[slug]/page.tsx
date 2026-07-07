import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { NewsCard } from "@/components/sections/NewsCard";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { CTAButton } from "@/components/ui/CTAButton";
import { pageHeroes } from "@/data/heroes";
import { getNewsItem, getRelatedNews, newsItems } from "@/data/news";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = getNewsItem(slug);

  return {
    title: item ? `${item.title} | SmashTime` : "Neuigkeit | SmashTime"
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = getNewsItem(slug);

  if (!item) {
    notFound();
  }

  const relatedNews = getRelatedNews(item).slice(0, 3);
  const [newsTitle, ...newsRedTitleParts] = item.title.split(": ");
  const newsRedTitle = newsRedTitleParts.join(": ") || undefined;

  return (
    <>
      <article className="news-detail">
        <PageHero
          className="page-hero--detail"
          kicker={item.category}
          preset={pageHeroes.news}
          preContent={
            <Link className="page-hero__back" href="/neuigkeiten">
              <ArrowLeft aria-hidden="true" size={18} /> Zurück zur Neuigkeiten-Übersicht
            </Link>
          }
          redTitle={newsRedTitle}
          text={item.excerpt}
          title={newsTitle}
        />

        <div className="container">
          <div className="news-detail__grid">
            <div className="news-detail__body card-grunge">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <aside className="news-detail__side">
              {item.quote ? (
                <section className="news-quote card-grunge">
                  <span aria-hidden="true">“</span>
                  <blockquote>{item.quote.text}</blockquote>
                  <strong>- {item.quote.author}</strong>
                </section>
              ) : null}

              {item.eventInfo ? (
                <section className="news-event-box card-grunge">
                  <span>Veranstaltungsinfos</span>
                  <h2>{item.eventInfo.title}</h2>
                  <dl>
                    <div>
                      <dt>Datum</dt>
                      <dd>{item.eventInfo.date}</dd>
                    </div>
                    <div>
                      <dt>Ort</dt>
                      <dd>{item.eventInfo.location}</dd>
                    </div>
                    <div>
                      <dt>Einlass</dt>
                      <dd>{item.eventInfo.admission}</dd>
                    </div>
                    <div>
                      <dt>Beginn</dt>
                      <dd>{item.eventInfo.start}</dd>
                    </div>
                  </dl>
                  <CTAButton href={item.eventInfo.href}>Details ansehen</CTAButton>
                </section>
              ) : null}
            </aside>
          </div>

          <section className="related-news">
            <h2>Weitere Neuigkeiten</h2>
            <div className="related-news__grid">
              {relatedNews.map((news) => (
                <NewsCard key={news.id} item={news} />
              ))}
            </div>
          </section>
        </div>
      </article>

      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
