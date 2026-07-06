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

export const fightCardNotice = "Erste Paarung bestätigt. Weitere Kämpfe werden bald veröffentlicht.";

export const fightCardBouts: FightCardBout[] = [
  {
    id: "just-rob-vs-karl-heinz",
    eventId: upcomingEvent.id,
    reihenfolge: 30,
    fighterA: "Just Rob",
    fighterB: "Karl-Heinz",
    gewichtsklasse: "Wird nachgetragen",
    kampfart: "Influenza Kämpfe",
    label: "Hauptkarte",
    sichtbar: true
  }
];

export const fightCardEventId = upcomingEvent.id;
