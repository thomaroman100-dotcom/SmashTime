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
    slug: "smashtime-3-cagetime",
    title: "SmashTime 3.",
    redTitle: "Cagetime.",
    intro:
      "Die nächste SmashTime-Ausgabe ist vorbereitet. Ergebnisse und Rückblick werden nach der Veranstaltung ergänzt.",
    date: upcomingEvent.dateLabel,
    location: upcomingEvent.location,
    address: upcomingEvent.address,
    admission: upcomingEvent.admission,
    start: upcomingEvent.start,
    disciplines: upcomingEvent.disciplines,
    image: "/images/backgrounds/arena-cage-front.png",
    stats: [
      { value: "17.10.", label: "Veranstaltungsdatum", icon: "calendar" },
      { value: "19:00", label: "Beginn", icon: "clock" },
      { value: "4", label: "Disziplinen", icon: "fighter" },
      { value: "Bald", label: "Fightcard", icon: "list" }
    ],
    description: [
      "SmashTime 3 / Cagetime findet am 17. Oktober 2026 in der Jahnturnhalle St. Pölten statt.",
      "Die Detailseite ist bereits vorbereitet. Sobald Ergebnisse, Bilder und offizielle Rückblicke vorliegen, können sie strukturiert ergänzt werden."
    ],
    results: [],
    quote: {
      text: "SmashTime steht für klare Inszenierung, echte Kämpfe und ein Publikum, das jede Runde spürt.",
      author: "SmashTime Team"
    },
    gallery: [
      { src: "/images/backgrounds/hero-events-cage-wide.png", alt: "Cage und Arena bei SmashTime" },
      { src: "/images/backgrounds/arena-seats-cage.png", alt: "Arena mit Käfig" },
      { src: "/images/backgrounds/backstage-wide.png", alt: "Backstage-Bereich" }
    ]
  }
];

export function getEventRecap(slug: string) {
  return eventRecaps.find((event) => event.slug === slug);
}
