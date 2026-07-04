import { CallToActionBand } from "@/components/sections/CallToActionBand";
import { NewsCard } from "@/components/sections/NewsCard";
import { PageHero } from "@/components/sections/PageHero";
import { SponsorStrip } from "@/components/sections/SponsorStrip";
import { pageHeroes } from "@/data/heroes";
import { featuredNews, newsItems } from "@/data/news";

export const metadata = {
  title: "Neuigkeiten | SmashTime"
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="Aktuelle"
        redTitle="Neuigkeiten."
        text="Bleib auf dem Laufenden: Veranstaltungen, Fightcard-Status, Sponsoring und alles rund um SmashTime."
        image={pageHeroes.news.image}
        imagePosition={pageHeroes.news.position}
        compact
      />
      <section className="news-page" id="neuigkeiten">
        <div className="container">
          <NewsCard item={featuredNews} featured />
          <div className="news-page__grid">
            {newsItems
              .filter((item) => item.id !== featuredNews.id)
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      </section>
      <SponsorStrip />
      <CallToActionBand />
    </>
  );
}
