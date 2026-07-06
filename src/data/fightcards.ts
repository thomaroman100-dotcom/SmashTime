export type FightCardEntry = {
  id: string;
  eventId: string;
  order: number;
  fighterA: string;
  fighterB: string;
  weightClass: string;
  discipline: string;
  label?: string;
  fighterAImage?: string;
  fighterBImage?: string;
  visible: boolean;
};

const PUBLIC_FIGHT_LABELS: Record<string, string> = {
  "Main Event": "Main Event",
  "Co-Main Event": "Co-Main Event",
  "Main Card": "Hauptkarte",
  "Preliminary Card": "Vorkämpfe"
};

export function formatFightCardLabel(label?: string) {
  if (!label) {
    return "Kampf";
  }

  return PUBLIC_FIGHT_LABELS[label] ?? label;
}

export function isMainEventFight(fight: FightCardEntry) {
  const label = fight.label?.trim().toLowerCase();
  return label === "main event" || label === "hauptkampf";
}

export const fightcards: FightCardEntry[] = [
  {
    id: "just-rob-vs-karl-heinz",
    eventId: "smashtime-3-respekt-steigt-in-den-ring",
    order: 30,
    fighterA: "Just Rob",
    fighterB: "Karl-Heinz",
    weightClass: "Wird nachgetragen",
    discipline: "Influenza Kämpfe",
    label: "Main Card",
    fighterAImage: "/images/fightcards/just-rob.png",
    fighterBImage: "/images/fightcards/karl-heinz.png",
    visible: true
  }
];
