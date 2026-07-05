export type RankingEntry = {
  id: string;
  position: number;
  fighterName: string;
  fighterSlug?: string;
  weightClass: string;
  record?: string;
  image?: string;
  trend?: "auf" | "ab" | "gleich";
};

// Offizielle Ranglisten werden erst veröffentlicht, wenn bestätigte Daten
// vorliegen. Bis dahin bleibt die Liste bewusst leer – die Startseite und
// spätere Ranglisten-Ansichten zeigen dann den Fallback-Text an.
export const rankings: RankingEntry[] = [];

export const rankingsFallback = {
  title: "Rangliste wird bald veröffentlicht",
  text: "Die offiziellen SmashTime-Platzierungen werden nach den nächsten Kampfabenden bestätigt und hier veröffentlicht.",
  ctaLabel: "Champions ansehen",
  ctaHref: "/champions"
};
