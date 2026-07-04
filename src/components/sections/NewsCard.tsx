import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { NewsItem } from "@/data/news";

type NewsCardProps = {
  item: NewsItem;
  featured?: boolean;
};

export function NewsCard({ item, featured }: NewsCardProps) {
  return (
    <article
      className={
        featured
          ? "news-card news-card--featured card-grunge card-grunge--news"
          : "news-card card-grunge card-grunge--news"
      }
    >
      {item.image ? (
        <div className="news-card__image">
          <Image
            src={item.image}
            alt=""
            fill
            sizes={featured ? "(max-width: 768px) 90vw, 42vw" : "(max-width: 768px) 36vw, 20vw"}
          />
        </div>
      ) : null}
      <div className="news-card__content">
        <div className="news-card__meta">
          <span>{item.category}</span>
          <time>{item.date}</time>
        </div>
        <h2>{item.title}</h2>
        <p>{item.excerpt}</p>
        <a href="#neuigkeiten" aria-label={`${item.title} lesen`}>
          Mehr lesen <ArrowRight aria-hidden="true" size={17} />
        </a>
      </div>
    </article>
  );
}
