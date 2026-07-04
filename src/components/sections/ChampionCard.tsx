import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";
import type { Champion } from "@/data/champions";
import { CTAButton } from "@/components/ui/CTAButton";
import { formatRecord } from "@/lib/utils";

type ChampionCardProps = {
  champion: Champion;
};

export function ChampionCard({ champion }: ChampionCardProps) {
  return (
    <article className="champion-card">
      <div className="champion-card__image">
        <Image
          src={champion.image}
          alt={champion.name}
          fill
          sizes="(max-width: 768px) 44vw, 25vw"
        />
      </div>
      <div className="champion-card__content">
        <div>
          <span>{champion.weightClass}</span>
          <strong className="champion-card__label">
            <Crown aria-hidden="true" size={15} /> Champion
          </strong>
        </div>
        <h2>
          <Link href={`/champions/${champion.slug}`}>{champion.name}</Link>
        </h2>
        <dl>
          <div>
            <dt>Rekord</dt>
            <dd>{formatRecord(champion.record)}</dd>
          </div>
        </dl>
        <CTAButton href={`/champions/${champion.slug}`} variant="outline">
          Profil ansehen
        </CTAButton>
      </div>
    </article>
  );
}
