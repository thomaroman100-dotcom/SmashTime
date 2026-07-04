import { upcomingEvent } from "@/data/events";

export type FightCardBout = {
  id: string;
  eventId: string;
  reihenfolge: number;
  fighterA: string;
  fighterB: string;
  gewichtsklasse: string;
  kampfart: string;
  label: string;
  sichtbar: boolean;
};

export const fightCardNotice = "Fightcard wird bald veröffentlicht.";

export const fightCardBouts: FightCardBout[] = [];

export const fightCardEventId = upcomingEvent.id;
