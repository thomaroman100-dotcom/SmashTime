import { upcomingEvent } from "@/data/events";

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
    redTitle: "Respekt steigt in den Ring.",
    intro:
      "Gemeinsam gegen Mobbing: SmashTime 3 bringt Respekt, Stärke und Zusammenhalt in die Jahnturnhalle St. Pölten.",
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
      { value: "4", label: "Disziplinen", icon: "fighter" },
      { value: "Bald", label: "Fightcard", icon: "list" }
    ],
    description: [
      "SmashTime 3 findet am 17. Oktober 2026 in der Jahnturnhalle St. Pölten statt. Einlass ist um 17:00 Uhr, Beginn um 18:00 Uhr.",
      "Die Veranstaltung steht unter dem Motto \"Respekt steigt in den Ring\" und setzt ein klares Zeichen für Respekt, Stärke und Zusammenhalt gegen Mobbing.",
      "Die Fightcard wird erst veröffentlicht, sobald Paarungen offiziell bestätigt sind. Bis dahin bleiben Ergebnisse und Rückblick bewusst vorbereitet, ohne Namen zu erfinden."
    ],
    results: [],
    quote: {
      text: "Ein Abend für Respekt, Stärke und Zusammenhalt.",
      author: "SmashTime Team"
    },
    gallery: [
      { src: "/images/events/smashtime-3-respekt-steigt-in-den-ring.png", alt: "SmashTime 3 Eventposter Respekt steigt in den Ring" },
      { src: "/images/backgrounds/hero-events-cage-wide.png", alt: "Cage und Arena bei SmashTime" },
      { src: "/images/backgrounds/arena-seats-cage.png", alt: "Arena mit Käfig" }
    ]
  }
];

export function getEventRecap(slug: string) {
  return eventRecaps.find((event) => event.slug === slug);
}
