import type { FightCardEntry } from "@/data/fightcards";
import { formatFightCardLabel, isTeamFight } from "@/data/fightcards";
import { BrushLabel } from "@/components/ui/BrushLabel";
import { CTAButton } from "@/components/ui/CTAButton";
import { FightBoutCard, TeamBoutCard } from "@/components/sections/FightBoutCard";

type FightCardListProps = {
  fights: FightCardEntry[];
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const SECTION_ORDER = ["Länderturnier", "Main Event", "Co-Main Event", "Hauptkarte", "Vorkämpfe", "Kampf"];

function sectionForFight(fight: FightCardEntry) {
  if (isTeamFight(fight)) {
    return "Länderturnier";
  }
  return formatFightCardLabel(fight.label);
}

function groupedFights(fights: FightCardEntry[]) {
  const groups = new Map<string, FightCardEntry[]>();

  for (const fight of fights) {
    const section = sectionForFight(fight);
    groups.set(section, [...(groups.get(section) ?? []), fight]);
  }

  return [...groups.entries()].sort(([sectionA], [sectionB]) => {
    const indexA = SECTION_ORDER.indexOf(sectionA);
    const indexB = SECTION_ORDER.indexOf(sectionB);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });
}

export function FightCardList({ fights, title = "Kampfkarte", description, ctaHref, ctaLabel }: FightCardListProps) {
  const visibleFights = fights.filter((fight) => fight.visible).sort((a, b) => a.order - b.order);
  const sections = groupedFights(visibleFights);

  return (
    <section className="fightcard-list" id="fightcard" aria-labelledby="fightcard-title">
      <BrushLabel>Fightcard</BrushLabel>
      <div className="fightcard-list__head">
        <div>
          <h2 id="fightcard-title">{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {ctaHref && ctaLabel ? (
          <CTAButton href={ctaHref} variant="outline">
            {ctaLabel}
          </CTAButton>
        ) : null}
      </div>
      {visibleFights.length === 0 ? (
        <p className="fightcard-list__empty">Fightcard wird bald veröffentlicht.</p>
      ) : (
        <div className="fightcard-list__sections">
          {sections.map(([section, sectionFights]) => (
            <section className="fightcard-list__section" key={section} aria-label={section}>
              <h3>{section}</h3>
              <ol className="fightcard-list__rows">
                {sectionFights.map((fight) => (
                  <li key={fight.id}>
                    {isTeamFight(fight) ? <TeamBoutCard fight={fight} /> : <FightBoutCard fight={fight} />}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
