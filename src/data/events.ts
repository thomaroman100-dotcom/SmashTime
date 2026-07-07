export type EventDiscipline = "Xtreme Boxen" | "K1" | "MMA" | "Boxen" | "Influenza Kämpfe";

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
  detailHref?: string;
};

export const upcomingEvent: SmashEvent = {
  id: "smashtime-3-respekt-steigt-in-den-ring",
  name: "SmashTime 3 - Gemeinsam gegen Mobbing",
  shortName: "SmashTime 3",
  subtitle: "Gemeinsam gegen Mobbing",
  date: "2026-10-17T18:00:00+02:00",
  dateLabel: "17. Oktober 2026",
  location: "Jahnturnhalle St. Pölten",
  address: "Jahnstraße 15, 3100 St. Pölten",
  admission: "17:00 Uhr",
  start: "18:00 Uhr",
  disciplines: ["Xtreme Boxen", "K1", "MMA", "Boxen", "Influenza Kämpfe"],
  status: "upcoming",
  image: "/images/events/smashtime-3-gemeinsam-gegen-mobbing.png",
  detailHref: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring"
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
    disciplines: ["MMA", "K1", "Boxen", "Xtreme Boxen", "Influenza Kämpfe"],
    status: "archive-placeholder",
    image: "/images/backgrounds/cage-chainlink.png",
    detailHref: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring"
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
    disciplines: ["MMA", "K1", "Boxen", "Xtreme Boxen", "Influenza Kämpfe"],
    status: "archive-placeholder",
    image: "/images/backgrounds/arena-seats-cage.png",
    detailHref: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring"
  }
];
