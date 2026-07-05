import { upcomingEvent, type SmashEvent } from "@/data/events";
import { fightcards, type FightCardEntry } from "@/data/fightcards";

// Zentrale, austauschbare Inhalte der Startseite. Alles, was sich mit einem
// neuen Event ändert (Eventnummer, Name, Datum, Ort, Countdown-Ziel, Poster,
// Main Fight, CTA-Texte), kommt aus dieser Datei bzw. aus src/data/events.ts
// und src/data/fightcards.ts – nichts davon ist im JSX festgeschrieben.

export type HomeHero = {
  title?: string;
  subtitle?: string;
  claimLines: string[];
  brandLine: string;
  tagline: string;
  backgroundImage: string;
  backgroundPosition: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type HomeEventPoster = {
  eventNumber: string;
  eventTitle: string;
  dateLabel: string;
  venueLabel: string;
};

export const nextEvent: SmashEvent = upcomingEvent;
export const featuredEvent: SmashEvent = upcomingEvent;

export const homeHero: HomeHero = {
  claimLines: ["Keine Regeln.", "Nur Respekt."],
  brandLine: "SmashTime.",
  tagline: "Kämpfe. Ehre. Vermächtnis.",
  backgroundImage: "/images/backgrounds/atmosphere-fight-action-grunge-wide.png",
  backgroundPosition: "center 30%",
  primaryCta: { label: "Tickets sichern", href: "/tickets" },
  secondaryCta: {
    label: "Details ansehen",
    href: nextEvent.detailHref ?? "/veranstaltungen"
  }
};

export const homeEventPoster: HomeEventPoster = {
  eventNumber: "3",
  eventTitle: nextEvent.subtitle,
  dateLabel: nextEvent.dateLabel,
  venueLabel: nextEvent.location
};

export const homeCountdown = {
  label: "Nächste Veranstaltung in",
  targetDate: nextEvent.date,
  ctaLabel: "Tickets sichern",
  ctaHref: "/tickets",
  fallback: "Nächste Veranstaltung wird bald bekanntgegeben"
};

// Main Fight aus der kanonischen Fightcard-Datenquelle ableiten. Solange keine
// bestätigten Paarungen existieren, greift der ehrliche Fallback – es werden
// keine Kämpfe oder Namen erfunden.
export const mainFight: FightCardEntry | undefined = [...fightcards]
  .filter((fight) => fight.visible && fight.eventId === nextEvent.id)
  .sort((a, b) => a.order - b.order)[0];

export const mainFightFallback = {
  label: "Main Event",
  title: "Fightcard wird bald veröffentlicht",
  text: "Die Kampfpaarungen für den nächsten Kampfabend werden offiziell bestätigt und danach hier angekündigt.",
  ctaLabel: "Details ansehen",
  ctaHref: nextEvent.detailHref ?? "/veranstaltungen"
};

export const homeSections = {
  champions: {
    title: "Unsere Champions",
    ctaLabel: "Alle ansehen",
    ctaHref: "/champions"
  },
  about: {
    title: "Über SmashTime",
    paragraphs: [
      "SmashTime ist mehr als ein Kampf. Wir sind eine Bewegung – eine Bühne für kompromisslosen Kampfsport aus St. Pölten.",
      "Echte Duelle. Echte Emotionen. Echte Athleten."
    ],
    brushImage: "/images/ui/brush-born-to-fight.png",
    brushAlt: "Born to fight. Built to last.",
    image: "/images/backgrounds/atmosphere-empty-cage-wide.png",
    imageAlt: "Leerer Cage in dunkler Arena vor der Kampfnacht",
    ctaLabel: "Mehr erfahren",
    ctaHref: "/ueber-uns"
  },
  events: {
    title: "Kommende Veranstaltungen",
    ctaLabel: "Alle Veranstaltungen ansehen",
    ctaHref: "/veranstaltungen",
    emptyNote: "Weitere Termine werden bald angekündigt."
  },
  rankings: {
    title: "Top Fighter Rangliste",
    ctaLabel: "Gesamte Rangliste ansehen",
    ctaHref: "/champions"
  },
  news: {
    title: "Neuigkeiten",
    ctaLabel: "Alle Neuigkeiten ansehen",
    ctaHref: "/neuigkeiten"
  }
};

export const homeTicketCta = {
  title: "Sei dabei. Erlebe Geschichte.",
  text: "Sichere dir jetzt dein Ticket für die nächste Veranstaltung.",
  ctaLabel: "Tickets sichern",
  ctaHref: "/tickets"
};
