export type FightMatchupType = "single" | "team_2v2";

export type FightParticipant = {
  slot: number;
  name: string;
  image?: string;
  isTba: boolean;
  userId?: string | null;
};

export type FightCorner = {
  label: string;
  countryCode?: string;
  participants: FightParticipant[];
};

export type FightCardEntry = {
  id: string;
  eventId: string;
  order: number;
  matchupType: FightMatchupType;
  fighterA: string;
  fighterB: string;
  redCorner: FightCorner;
  blueCorner: FightCorner;
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
  "Preliminary Card": "Vorkämpfe",
  "Länderturnier": "Länderturnier"
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

export function isTeamFight(fight: FightCardEntry) {
  return fight.matchupType === "team_2v2";
}

export function fightCornerTitle(fight: FightCardEntry, corner: "red" | "blue") {
  return corner === "red" ? fight.redCorner.label : fight.blueCorner.label;
}

function singleParticipant(slot: number, name: string, image?: string): FightParticipant {
  return {
    slot,
    name,
    image,
    isTba: name.trim().toLowerCase().includes("bekanntgegeben") || name.trim().toLowerCase() === "tba"
  };
}

export const fightcards: FightCardEntry[] = [
  {
    id: "just-rob-vs-karl-heinz",
    eventId: "smashtime-3-respekt-steigt-in-den-ring",
    order: 30,
    matchupType: "single",
    fighterA: "Just Rob",
    fighterB: "Karl-Heinz",
    redCorner: {
      label: "Just Rob",
      participants: [singleParticipant(1, "Just Rob", "/images/fightcards/just-rob.png")]
    },
    blueCorner: {
      label: "Karl-Heinz",
      participants: [singleParticipant(1, "Karl-Heinz", "/images/fightcards/karl-heinz.png")]
    },
    weightClass: "Wird nachgetragen",
    discipline: "Influenza Kämpfe",
    label: "Main Card",
    fighterAImage: "/images/fightcards/just-rob.png",
    fighterBImage: "/images/fightcards/karl-heinz.png",
    visible: true
  }
];
