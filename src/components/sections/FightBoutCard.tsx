import Image from "next/image";
import { formatFightCardLabel, type FightCardEntry } from "@/data/fightcards";

type FightBoutCardProps = {
  fight: FightCardEntry;
  variant?: "default" | "compact";
};

type FightPortraitProps = {
  name: string;
  image?: string;
  corner: "red" | "blue";
};

function FightPortrait({ name, image, corner }: FightPortraitProps) {
  return (
    <div className={`fight-bout-card__fighter fight-bout-card__fighter--${corner}`}>
      {image ? (
        <Image
          src={image}
          alt={`${name} Fightcard-Portrait`}
          fill
          sizes="(max-width: 767px) 86vw, (max-width: 1180px) 28vw, 360px"
        />
      ) : (
        <span className="fight-bout-card__fallback" aria-hidden="true">
          {name.slice(0, 2).toUpperCase()}
        </span>
      )}
      <strong>{name}</strong>
    </div>
  );
}

export function FightBoutCard({ fight, variant = "default" }: FightBoutCardProps) {
  return (
    <article className={`fight-bout-card fight-bout-card--${variant}`}>
      <FightPortrait name={fight.fighterA} image={fight.fighterAImage} corner="red" />
      <div className="fight-bout-card__center">
        <span>{formatFightCardLabel(fight.label)}</span>
        <b>VS</b>
        <small>
          {fight.weightClass} · {fight.discipline}
        </small>
      </div>
      <FightPortrait name={fight.fighterB} image={fight.fighterBImage} corner="blue" />
    </article>
  );
}
