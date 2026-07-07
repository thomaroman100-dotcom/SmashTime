export type FightMatchupType = "single" | "team_1v1" | "team_2v2" | "team_3v3" | "team_4v4";

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
  rounds?: number;
  roundDuration?: string;
  scheduledAt?: string;
  winnerCorner?: "red" | "blue" | null;
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
  return fight.matchupType.startsWith("team_");
}

export function teamSizeForMatchup(matchupType: FightMatchupType) {
  if (!matchupType.startsWith("team_")) {
    return 1;
  }

  const parsed = Number.parseInt(matchupType.replace("team_", "").split("v")[0], 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 4) : 2;
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
