export type NewsItem = {
  id: string;
  title: string;
  date: string;
  category: "Neuigkeit" | "Veranstaltung" | "Sponsoring" | "Fightcard";
  excerpt: string;
  image?: string;
  featured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    id: "tickets-smashtime-3",
    title: "SmashTime 3 / Cagetime rückt näher",
    date: "03. Juli 2026",
    category: "Veranstaltung",
    excerpt:
      "Die nächste Ausgabe findet am 17. Oktober 2026 in der Jahnturnhalle St. Pölten statt.",
    image: "/images/backgrounds/arena-brush-wide.png",
    featured: true
  },
  {
    id: "fightcard-bald",
    title: "Fightcard wird bald veröffentlicht",
    date: "03. Juli 2026",
    category: "Fightcard",
    excerpt:
      "Die Kampfpaarungen werden als echte Datenstruktur vorbereitet und später offiziell ergänzt.",
    image: "/images/ui/dark-grunge-texture.png"
  },
  {
    id: "partnerbereich",
    title: "Sponsorenbereich für Phase 1 vorbereitet",
    date: "03. Juli 2026",
    category: "Sponsoring",
    excerpt:
      "Partnerplätze, Pakete und Kontaktwege sind als lokale Daten angelegt und später verwaltbar.",
    image: "/images/sponsors/handshake-cage.png"
  },
  {
    id: "hinter-den-kulissen",
    title: "Hinter den Kulissen von SmashTime",
    date: "03. Juli 2026",
    category: "Neuigkeit",
    excerpt:
      "Backstage, Licht und Aufbau prägen den Look einer SmashTime-Veranstaltung.",
    image: "/images/backgrounds/backstage-wide.png"
  },
  {
    id: "cagetime-format",
    title: "Cagetime setzt auf klare Disziplinen",
    date: "03. Juli 2026",
    category: "Veranstaltung",
    excerpt:
      "Xtreme Boxen, K1, MMA und Boxen stehen im Mittelpunkt der kommenden Ausgabe.",
    image: "/images/events/k1-ring.png"
  },
  {
    id: "kontakt-fuer-anfragen",
    title: "Anfragen für Presse und Sponsoring",
    date: "03. Juli 2026",
    category: "Neuigkeit",
    excerpt:
      "Das Kontaktformular bündelt Anfragen zu Sponsoring, Presse, Kämpfern und allgemeinen Themen.",
    image: "/images/backgrounds/backstage-corridor.png"
  }
];

export const featuredNews = newsItems.find((item) => item.featured) ?? newsItems[0];
