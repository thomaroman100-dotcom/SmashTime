import { upcomingEvent } from "@/data/events";

export const fightNight = {
  title: "Kampfabend.",
  redTitle: "Die Highlights des Abends.",
  text:
    "Elite-Kämpfe, harte Duelle und echte Emotionen. Der SmashTime-Kampfabend zeigt die sportliche Dramaturgie des Abends.",
  eventName: upcomingEvent.name,
  eventDate: upcomingEvent.date,
  dateLabel: upcomingEvent.dateLabel,
  location: upcomingEvent.location,
  mainEventLabel: "Main Event",
  championship: "SmashTime Titelkampf",
  mainEvent: {
    fighterA: "Kämpfer wird bekanntgegeben",
    fighterB: "Kämpfer wird bekanntgegeben",
    weightClass: "Gewichtsklasse wird bekanntgegeben",
    discipline: "Kampfart wird bekanntgegeben"
  },
  backgroundImage: "/images/backgrounds/hero-events-cage-wide.png"
};

export const fightNightRules = upcomingEvent.disciplines.map((discipline) => ({
  title: discipline,
  text:
    discipline === "MMA"
      ? "Mixed Martial Arts mit klarem Regelwerk und professioneller Betreuung."
      : discipline === "K1"
        ? "Standkampf mit Tempo, Präzision und kompromisslosen Runden."
        : discipline === "Xtreme Boxen"
          ? "Boxen mit besonderer Härte und SmashTime-Inszenierung."
          : "Klassisches Boxen: klare Fäuste, klare Regeln, echte Action."
}));

export const fightNightHighlights = [
  {
    title: "Top-Paarungen",
    text: "Die Paarungen werden erst veröffentlicht, wenn sie offiziell bestätigt sind.",
    icon: "target"
  },
  {
    title: "Mitreißende Atmosphäre",
    text: "Licht, Sound und Energie im Stil einer echten Fight-Night-Produktion.",
    icon: "megaphone"
  },
  {
    title: "Unvergessliche Momente",
    text: "Jede Runde soll sich nach SmashTime anfühlen: direkt, laut und intensiv.",
    icon: "trophy"
  },
  {
    title: "Premium-Erlebnis",
    text: "Klare Sicht, starke Inszenierung und ein Abend mit Eventcharakter.",
    icon: "diamond"
  }
];
