export type EventDiscipline = "Xtreme Boxen" | "K1" | "MMA" | "Boxen";

export type SmashEvent = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  date: string;
  dateLabel: string;
  location: string;
  address: string;
  admission: string;
  start: string;
  disciplines: EventDiscipline[];
  gastro?: string;
  status: "upcoming" | "archive-placeholder";
  image: string;
};

export const upcomingEvent: SmashEvent = {
  id: "smashtime-3-cagetime",
  name: "SmashTime 3 / Cagetime",
  shortName: "SmashTime 3",
  subtitle: "Cagetime",
  date: "2026-10-17T19:00:00+02:00",
  dateLabel: "17. Oktober 2026",
  location: "Jahnturnhalle St. Pölten",
  address: "Jahnstraße 15, 3100 St. Pölten",
  admission: "18:00 Uhr",
  start: "19:00 Uhr",
  disciplines: ["Xtreme Boxen", "K1", "MMA", "Boxen"],
  gastro: "Figl Ratzersdorf",
  status: "upcoming",
  image: "/images/backgrounds/arena-cage-front.png?v=20260704"
};

export const eventArchive: SmashEvent[] = [
  {
    id: "archiv-ausgabe-1",
    name: "SmashTime Archiv",
    shortName: "Archiv",
    subtitle: "Ausgabe wird nachgetragen",
    date: "",
    dateLabel: "Datum wird nachgetragen",
    location: "Ort wird nachgetragen",
    address: "Archivdaten folgen",
    admission: "Wird nachgetragen",
    start: "Wird nachgetragen",
    disciplines: ["MMA", "K1", "Boxen", "Xtreme Boxen"],
    status: "archive-placeholder",
    image: "/images/backgrounds/cage-chainlink.png"
  },
  {
    id: "archiv-ausgabe-2",
    name: "SmashTime Archiv",
    shortName: "Archiv",
    subtitle: "Rückblick in Vorbereitung",
    date: "",
    dateLabel: "Datum wird nachgetragen",
    location: "Ort wird nachgetragen",
    address: "Archivdaten folgen",
    admission: "Wird nachgetragen",
    start: "Wird nachgetragen",
    disciplines: ["MMA", "K1", "Boxen", "Xtreme Boxen"],
    status: "archive-placeholder",
    image: "/images/backgrounds/arena-seats-cage.png"
  }
];
