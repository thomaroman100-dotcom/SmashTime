import { upcomingEvent } from "@/data/events";
import { fightcards } from "@/data/fightcards";

export type EventResult = {
  id: string;
  label: string;
  fighterA: string;
  fighterB: string;
  winner?: string;
  method: string;
  discipline: string;
};

export type EventRecap = {
  slug: string;
  title: string;
  redTitle: string;
  intro: string;
  date: string;
  location: string;
  address: string;
  admission: string;
  start: string;
  disciplines: string[];
  image: string;
  stats: { value: string; label: string; icon: string }[];
  description: string[];
  results: EventResult[];
  quote: {
    text: string;
    author: string;
  };
  gallery: { src: string; alt: string }[];
};

export const eventRecaps: EventRecap[] = [
  {
    slug: "smashtime-3-respekt-steigt-in-den-ring",
    title: "SmashTime 3.",
    redTitle: "Gemeinsam gegen Mobbing.",
    intro:
      "Gemeinsam gegen Mobbing: SmashTime 3 bringt Respekt, Stärke und Zusammenhalt in den Ring.",
    date: upcomingEvent.dateLabel,
    location: upcomingEvent.location,
    address: upcomingEvent.address,
    admission: upcomingEvent.admission,
    start: upcomingEvent.start,
    disciplines: upcomingEvent.disciplines,
    image: upcomingEvent.image,
    stats: [
      { value: "17.10.", label: "Veranstaltungsdatum", icon: "calendar" },
      { value: "18:00", label: "Beginn", icon: "clock" },
      { value: upcomingEvent.disciplines.length.toString(), label: "Disziplinen", icon: "fighter" },
      { value: fightcards.filter((fight) => fight.eventId === upcomingEvent.id && fight.visible).length.toString(), label: "Bestätigte Paarung", icon: "list" }
    ],
    description: [
      "SmashTime 3 findet am 17. Oktober 2026 in der Jahnturnhalle St. Pölten statt. Einlass ist um 17:00 Uhr, Beginn um 18:00 Uhr.",
      "Die Veranstaltung steht unter dem Motto \"Gemeinsam gegen Mobbing\" und setzt ein klares Zeichen für Respekt, Stärke und Zusammenhalt.",
      "Die erste bestätigte Paarung ist Just Rob vs. Karl-Heinz unter Influenza Kämpfe. Weitere Paarungen werden ergänzt, sobald sie offiziell feststehen."
    ],
    results: [],
    quote: {
      text: "Ein Abend für Respekt, Stärke und Zusammenhalt.",
      author: "SmashTime Team"
    },
    gallery: [
      { src: "/images/events/smashtime-3-gemeinsam-gegen-mobbing.png", alt: "SmashTime 3 Eventposter Gemeinsam gegen Mobbing" },
      { src: "/images/backgrounds/smashtime-hero-faceoff-cage.png", alt: "Cage und Arena bei SmashTime" },
      { src: "/images/backgrounds/arena-seats-cage.png", alt: "Arena mit Käfig" }
    ]
  }
];

export function getEventRecap(slug: string) {
  return eventRecaps.find((event) => event.slug === slug);
}
