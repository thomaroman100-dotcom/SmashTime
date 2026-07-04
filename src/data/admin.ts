import { champions } from "@/data/champions";
import { upcomingEvent, eventArchive } from "@/data/events";
import { fightcards } from "@/data/fightcards";
import { newsItems } from "@/data/news";
import { site } from "@/data/site";
import { sponsorLogos, sponsorPackages } from "@/data/sponsors";

export const adminStats = [
  { label: "Champions", value: champions.length.toString(), detail: "Aktiv" },
  { label: "Veranstaltungen", value: "1", detail: "Veröffentlicht" },
  { label: "Neuigkeiten", value: newsItems.length.toString(), detail: "Lokal vorbereitet" },
  { label: "Kontaktanfragen", value: "0", detail: "Keine echten Anfragen" }
];

export const adminEvents = [upcomingEvent, ...eventArchive];

export const adminFightcards = fightcards;

export const adminContactRequests: Array<{
  id: string;
  category: string;
  subject: string;
  sender: string;
  status: string;
}> = [];

export const adminMediaAssets = [
  {
    name: "SmashTime Logo",
    type: "Logo",
    path: site.logo,
    usage: "Header und Footer",
    checked: true
  },
  {
    name: "Hero Veranstaltungen",
    type: "Hintergrund",
    path: "/images/backgrounds/hero-events-stage.png",
    usage: "Veranstaltungen",
    checked: true
  },
  {
    name: "Cage-Modul",
    type: "Hintergrund",
    path: "/images/backgrounds/hero-events-cage-wide.png",
    usage: "Eventmodul",
    checked: true
  },
  {
    name: "Sponsorenbild",
    type: "Hintergrund",
    path: "/images/backgrounds/hero-sponsors-corridor.png",
    usage: "Sponsoren",
    checked: true
  }
];

export const adminSettings = [
  { label: "Ticket-Ziel", value: site.ticketHref },
  { label: "Nächste Veranstaltung", value: site.eventHref },
  { label: "Fightcard-Ziel", value: site.fightNightHref },
  { label: "Instagram", value: site.contact.instagram },
  { label: "E-Mail", value: site.contact.email }
];

export const adminSponsorRows = sponsorLogos.map((logo, index) => ({
  id: logo.name,
  name: logo.name,
  packageName: sponsorPackages[index % sponsorPackages.length]?.name ?? "Wird nachgetragen",
  status: "Platzhalter",
  label: logo.label
}));
