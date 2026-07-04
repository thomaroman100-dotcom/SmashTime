import type { FightCardEntry } from "@/data/fightcards";
import { BrushLabel } from "@/components/ui/BrushLabel";

type FightCardListProps = {
  fights: FightCardEntry[];
};

export function FightCardList({ fights }: FightCardListProps) {
  const visibleFights = fights.filter((fight) => fight.visible);

  return (
    <section className="fightcard-list" id="fightcard" aria-labelledby="fightcard-title">
      <BrushLabel>Fightcard</BrushLabel>
      <h2 id="fightcard-title">Kampfkarte</h2>
      {visibleFights.length === 0 ? (
        <p className="fightcard-list__empty">Fightcard wird bald veröffentlicht.</p>
      ) : (
        <ol>
          {visibleFights
            .sort((a, b) => a.order - b.order)
            .map((fight) => (
              <li key={fight.id}>
                <span>{fight.label}</span>
                <strong>
                  {fight.fighterA} <em>vs.</em> {fight.fighterB}
                </strong>
                <small>
                  {fight.weightClass} · {fight.discipline}
                </small>
              </li>
            ))}
        </ol>
      )}
    </section>
  );
}
