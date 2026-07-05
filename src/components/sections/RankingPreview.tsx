import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RankingEntry } from "@/data/rankings";

type RankingPreviewProps = {
  entries: RankingEntry[];
  fallback: {
    title: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
};

export function RankingPreview({ entries, fallback }: RankingPreviewProps) {
  if (entries.length === 0) {
    return (
      <div className="ranking-board ranking-board--empty">
        <h3>{fallback.title}</h3>
        <p>{fallback.text}</p>
        <Link href={fallback.ctaHref} className="btn btn--outline">
          <span>{fallback.ctaLabel}</span>
          <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
        </Link>
      </div>
    );
  }

  return (
    <div className="ranking-board">
      {entries.slice(0, 5).map((entry) => (
        <article className="ranking-board__item" key={entry.id}>
          <span className="ranking-board__position">
            {String(entry.position).padStart(2, "0")}
          </span>
          {entry.image ? (
            <div className="ranking-board__image">
              <Image src={entry.image} alt={entry.fighterName} fill sizes="(max-width: 768px) 40vw, 15vw" />
            </div>
          ) : null}
          <div className="ranking-board__info">
            {entry.fighterSlug ? (
              <h3>
                <Link href={`/champions/${entry.fighterSlug}`}>{entry.fighterName}</Link>
              </h3>
            ) : (
              <h3>{entry.fighterName}</h3>
            )}
            <p>{entry.weightClass}</p>
            {entry.record ? <span>{entry.record}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
