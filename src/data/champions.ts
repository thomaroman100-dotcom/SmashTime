export type Champion = {
  slug: string;
  name: string;
  age: string;
  weight: string;
  weightClass: string;
  record: string;
  origin?: string;
  image: string;
  stance: string;
  bio: string;
  quote: string;
  title: string;
  stats: {
    label: string;
    value: string;
  }[];
  lastFights: {
    result: "Sieg" | "Niederlage" | "Unentschieden";
    method: string;
    opponent: string;
    date: string;
    event: string;
  }[];
};

export const champions: Champion[] = [
  {
    slug: "tanyo-tanev",
    name: "Tanyo Tanev",
    age: "26 Jahre",
    weight: "80 kg",
    weightClass: "Light Heavyweight",
    record: "10 Siege / 5 Niederlagen / 2 Unentschieden",
    image: "/images/champions/tanyo-tanev.png",
    stance: "Disziplin. Druck. Kontrolle.",
    bio:
      "Tanyo Tanev bringt Erfahrung, Ruhe und klare Wettkampfhärte in den Cage. Weitere biografische Details werden nachgetragen, sobald sie offiziell bestätigt sind.",
    quote: "Ich kämpfe fokussiert. Alles Weitere entscheidet der Cage.",
    title: "SmashTime Light Heavyweight Champion",
    stats: [
      { label: "Siege", value: "10" },
      { label: "Niederlagen", value: "5" },
      { label: "Unentschieden", value: "2" },
      { label: "Gewicht", value: "80 kg" }
    ],
    lastFights: []
  },
  {
    slug: "mike-capellan-rodriguez",
    name: "Mike Capellan Rodriguez",
    age: "19 Jahre",
    weight: "71 kg",
    weightClass: "Middleweight",
    record: "15 / 3 / 1 / 0",
    origin: "Dominikanische Republik",
    image: "/images/champions/mike-capellan-rodriguez.png",
    stance: "Tempo. Technik. Hunger.",
    bio:
      "Mike Capellan Rodriguez steht für junges Tempo und präzise Aktionen. Seine Herkunft und Bilanz sind bestätigt; weitere Profildetails werden redaktionell ergänzt.",
    quote: "Jede Runde ist eine Chance, klarer zu werden.",
    title: "SmashTime Middleweight Champion",
    stats: [
      { label: "Bilanz", value: "15 / 3 / 1 / 0" },
      { label: "Alter", value: "19" },
      { label: "Gewicht", value: "71 kg" },
      { label: "Herkunft", value: "Dominikanische Republik" }
    ],
    lastFights: []
  },
  {
    slug: "liam-stancel",
    name: "Liam Stancel",
    age: "18 Jahre",
    weight: "70 kg",
    weightClass: "Middleweight",
    record: "7 / 1 / 0 / 0",
    origin: "England / Österreich",
    image: "/images/champions/liam-stancel.png",
    stance: "Mut. Fokus. Entwicklung.",
    bio:
      "Liam Stancel verbindet junge Energie mit konsequenter Arbeit. Seine offiziellen Basisdaten sind hinterlegt; sportliche Details werden später erweitert.",
    quote: "Ich bleibe ruhig, auch wenn es laut wird.",
    title: "SmashTime Middleweight Champion",
    stats: [
      { label: "Bilanz", value: "7 / 1 / 0 / 0" },
      { label: "Alter", value: "18" },
      { label: "Gewicht", value: "70 kg" },
      { label: "Herkunft", value: "England / Österreich" }
    ],
    lastFights: []
  },
  {
    slug: "denis-berisha",
    name: "Denis Berisha",
    age: "23 Jahre",
    weight: "Wird nachgetragen",
    weightClass: "Klasse wird nachgetragen",
    record: "25 / 1 / 1",
    image: "/images/champions/denis-berisha.png",
    stance: "Erfahrung. Ruhe. Präsenz.",
    bio:
      "Denis Berisha kommt mit einer starken bestätigten Bilanz. Gewichtsklasse und weitere Details bleiben bewusst offen, bis offizielle Daten vorliegen.",
    quote: "Respekt beginnt mit Vorbereitung.",
    title: "SmashTime Champion",
    stats: [
      { label: "Bilanz", value: "25 / 1 / 1" },
      { label: "Alter", value: "23" },
      { label: "Gewicht", value: "Wird nachgetragen" },
      { label: "Klasse", value: "Wird nachgetragen" }
    ],
    lastFights: []
  }
];

export const weightFilters = [
  "Alle",
  "Middleweight",
  "Light Heavyweight",
  "Klasse wird nachgetragen"
];

export function getChampion(slug: string) {
  return champions.find((champion) => champion.slug === slug);
}
