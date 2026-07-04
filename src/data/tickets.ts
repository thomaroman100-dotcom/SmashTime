import { upcomingEvent } from "@/data/events";

export type TicketPackage = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  popular?: boolean;
  features: string[];
};

export type TicketFaq = {
  question: string;
  answer: string;
};

export const ticketEvent = {
  title: upcomingEvent.name,
  shortName: upcomingEvent.shortName,
  subtitle: upcomingEvent.subtitle,
  date: upcomingEvent.dateLabel,
  location: upcomingEvent.location,
  address: upcomingEvent.address,
  admission: upcomingEvent.admission,
  start: upcomingEvent.start,
  disciplines: upcomingEvent.disciplines,
  image: "/images/backgrounds/hero-events-cage-wide.png"
};

export const ticketPackages: TicketPackage[] = [
  {
    id: "standard",
    name: "Standard",
    subtitle: "Dein Einstieg in die Action",
    price: "39 Euro",
    features: [
      "Sitzplatz in den hinteren Blöcken",
      "Sicht auf den Käfig",
      "Zugang zum Veranstaltungsbereich",
      "Digitales Eventprogramm"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Bessere Sicht. Mehr erleben.",
    price: "69 Euro",
    features: [
      "Sitzplatz in mittleren Blöcken",
      "Bessere Sicht auf den Käfig",
      "Zugang zum Veranstaltungsbereich",
      "Getränke-Gutschein"
    ]
  },
  {
    id: "vip",
    name: "VIP",
    subtitle: "Exklusiv. Komfort. Premium.",
    price: "129 Euro",
    popular: true,
    features: [
      "Sitzplatz in vorderen Blöcken",
      "Beste Sicht auf den Käfig",
      "Zugang zum VIP-Bereich",
      "Eventprogramm gedruckt",
      "Getränke-Gutscheine"
    ]
  },
  {
    id: "cage-side",
    name: "Käfigseite",
    subtitle: "Direkt dran. Maximale Nähe.",
    price: "249 Euro",
    features: [
      "Premium-Sitzplatz am Käfig",
      "Unverbaute Sicht auf die Action",
      "Zugang zum VIP-Bereich",
      "Meet & Greet nach Verfügbarkeit",
      "Getränke und Snack inklusive"
    ]
  }
];

export const ticketInclusions = [
  {
    title: "Sicherer Einlass",
    text: "Schneller und klar geregelter Zugang zur Veranstaltung.",
    icon: "shield"
  },
  {
    title: "Beste Atmosphäre",
    text: "Licht, Sound und Show im kompromisslosen SmashTime-Stil.",
    icon: "megaphone"
  },
  {
    title: "Digitales Ticket",
    text: "Dein Ticket wird später direkt über den offiziellen Verkauf verwaltet.",
    icon: "ticket"
  },
  {
    title: "Fan-Zone Zugang",
    text: "Vor Ort entstehen Bereiche für Fans, Partner und Community.",
    icon: "users"
  }
];

export const ticketFaqs: TicketFaq[] = [
  {
    question: "Ab wann ist der Einlass?",
    answer: "Der Einlass beginnt um 18:00 Uhr."
  },
  {
    question: "Kann ich mein Ticket zurückgeben?",
    answer: "Die endgültigen Ticketbedingungen werden mit dem offiziellen Ticketshop veröffentlicht."
  },
  {
    question: "Wie erhalte ich mein Ticket?",
    answer: "In Phase 2 ist der Ticketshop vorbereitet. Der echte Verkauf wird später angebunden."
  },
  {
    question: "Gibt es barrierearme Plätze?",
    answer: "Anfragen zu barrierearmen Plätzen können aktuell über das Kontaktformular gestellt werden."
  }
];
