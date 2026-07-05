import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { NewsItem } from "@/data/news";

type NewsCardProps = {
  item: NewsItem;
  featured?: boolean;
  hideImage?: boolean;
};

export function NewsCard({ item, featured, hideImage }: NewsCardProps) {
  return (
    <article
      className={
        featured
          ? "news-card news-card--featured card-grunge card-grunge--news"
          : "news-card card-grunge card-grunge--news"
      }
    >
      {item.image && !hideImage ? (
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
        <Link href={`/neuigkeiten/${item.slug}`} aria-label={`${item.title} lesen`}>
          Mehr lesen <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}
