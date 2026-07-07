export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: "Neuigkeit" | "Veranstaltung" | "Sponsoring" | "Fightcard";
  excerpt: string;
  image?: string;
  heroImage?: string;
  body: string[];
  quote?: {
    text: string;
    author: string;
  };
  eventInfo?: {
    title: string;
    date: string;
    location: string;
    admission: string;
    start: string;
    href: string;
  };
  relatedIds?: string[];
  featured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    id: "tickets-smashtime-3",
    slug: "tickets-smashtime-3",
    title: "SmashTime 3: Respekt steigt in den Ring",
    date: "03. Juli 2026",
    category: "Veranstaltung",
    excerpt:
      "Die nächste Ausgabe setzt ein klares Zeichen für Respekt, Stärke und Zusammenhalt.",
    image: "/images/backgrounds/arena-brush-wide.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "Die nächste SmashTime-Ausgabe nimmt Form an. Am 17. Oktober 2026 steht SmashTime 3 in der Jahnturnhalle St. Pölten an.",
      "Der Abend steht unter dem Motto \"Respekt steigt in den Ring\" und setzt ein klares Zeichen für Respekt, Stärke und Zusammenhalt gegen Mobbing.",
      "Tickets, Fightcard und weitere organisatorische Informationen werden datengetrieben vorbereitet, damit die Seite später sauber mit echten Verwaltungsdaten verbunden werden kann."
    ],
    quote: {
      text: "Wir bauen SmashTime als klare Bühne für Kampfsport, Atmosphäre und Respekt.",
      author: "SmashTime Team"
    },
    eventInfo: {
      title: "SmashTime 3 - Respekt steigt in den Ring",
      date: "17. Oktober 2026",
      location: "Jahnturnhalle St. Pölten",
      admission: "17:00 Uhr",
      start: "18:00 Uhr",
      href: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring"
    },
    relatedIds: ["fightcard-bald", "smashtime-3-format", "kontakt-fuer-anfragen"],
    featured: true
  },
  {
    id: "fightcard-bald",
    slug: "fightcard-wird-bald-veroeffentlicht",
    title: "Fightcard wird bald veröffent­licht",
    date: "03. Juli 2026",
    category: "Fightcard",
    excerpt:
      "Die Kampfpaarungen werden als echte Datenstruktur vorbereitet und später offiziell ergänzt.",
    image: "/images/ui/dark-grunge-texture.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "Die Fightcard wird erst veröffentlicht, wenn die Paarungen offiziell bestätigt sind.",
      "Technisch ist der Bereich bereits vorbereitet: Jede Paarung kann später mit Reihenfolge, Disziplin, Gewichtsklasse, Label und Sichtbarkeit gepflegt werden.",
      "Bis zur offiziellen Veröffentlichung zeigt die Website bewusst keine erfundenen Namen."
    ],
    quote: {
      text: "Keine Fake-Fightcard. Erst wenn Paarungen bestätigt sind, werden sie sichtbar.",
      author: "Redaktion SmashTime"
    },
    relatedIds: ["tickets-smashtime-3", "smashtime-3-format", "hinter-den-kulissen"]
  },
  {
    id: "partnerbereich",
    slug: "sponsorenbereich-vorbereitet",
    title: "Sponsoren­bereich für Phase 1 vorbereitet",
    date: "03. Juli 2026",
    category: "Sponsoring",
    excerpt:
      "Sponsorplätze, Pakete und Kontaktwege sind als lokale Daten angelegt und später verwaltbar.",
    image: "/images/sponsors/handshake-cage.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "Der Sponsorenbereich ist so aufgebaut, dass Sponsorplätze, Vorteile und Pakete später verwaltbar bleiben.",
      "In Phase 2 werden Kontaktwege, Pakete und Sponsorenflächen weiter verdichtet, ohne echte Logos oder Zusagen zu erfinden.",
      "Interessierte Unternehmen können über den Kontaktbereich eine Anfrage stellen."
    ],
    relatedIds: ["kontakt-fuer-anfragen", "tickets-smashtime-3", "hinter-den-kulissen"]
  },
  {
    id: "hinter-den-kulissen",
    slug: "hinter-den-kulissen-von-smashtime",
    title: "Hinter den Kulissen von SmashTime",
    date: "03. Juli 2026",
    category: "Neuigkeit",
    excerpt:
      "Backstage, Licht und Aufbau prägen den Look einer SmashTime-Veranstaltung.",
    image: "/images/backgrounds/backstage-wide.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "Der SmashTime-Look entsteht nicht erst im Cage. Backstage, Licht, Sound und Wegeführung prägen das gesamte Erlebnis.",
      "Die Website nimmt diese Stimmung auf und übersetzt sie in harte Kanten, dunkle Flächen, rote Akzente und klare Informationsbereiche.",
      "So bleibt das öffentliche Frontend nah an der Atmosphäre, ohne auf statische Screenshots als Seitenersatz zurückzugreifen."
    ],
    relatedIds: ["partnerbereich", "smashtime-3-format", "fightcard-bald"]
  },
  {
    id: "smashtime-3-format",
    slug: "smashtime-3-setzt-auf-klare-disziplinen",
    title: "SmashTime 3 setzt auf klare Disziplinen",
    date: "03. Juli 2026",
    category: "Veranstaltung",
    excerpt:
      "Xtreme Boxen, K1, MMA und Boxen stehen im Mittelpunkt der kommenden Ausgabe.",
    image: "/images/events/k1-ring.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "SmashTime 3 konzentriert sich auf MMA, K1, Xtreme Boxen und Boxen.",
      "Diese Disziplinen werden auf der Website konsistent geführt und nicht durch alte Referenzdaten ersetzt.",
      "Sobald offizielle Paarungen vorliegen, werden sie im Fightcard-Bereich als echte UI veröffentlicht."
    ],
    eventInfo: {
      title: "SmashTime 3 - Respekt steigt in den Ring",
      date: "17. Oktober 2026",
      location: "Jahnturnhalle St. Pölten",
      admission: "17:00 Uhr",
      start: "18:00 Uhr",
      href: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring"
    },
    relatedIds: ["tickets-smashtime-3", "fightcard-bald", "hinter-den-kulissen"]
  },
  {
    id: "kontakt-fuer-anfragen",
    slug: "anfragen-fuer-presse-und-sponsoring",
    title: "Anfragen für Presse und Sponsoring",
    date: "03. Juli 2026",
    category: "Neuigkeit",
    excerpt:
      "Das Kontaktformular bündelt Anfragen zu Sponsoring, Presse, Kämpfern und allgemeinen Themen.",
    image: "/images/backgrounds/backstage-corridor.png",
    heroImage: "/images/backgrounds/smashtime-hero-news-press-table.png",
    body: [
      "Anfragen zu Sponsoring, Presse, Kämpfern und allgemeinen Themen werden über den Kontaktbereich gebündelt.",
      "Das Formular ist in Phase 2 als öffentliche Oberfläche vorbereitet. Eine echte Backend- oder Mail-Anbindung folgt erst nach ausdrücklicher Freigabe.",
      "Bis dahin bleiben Kontaktwege transparent als Platzhalter gekennzeichnet."
    ],
    relatedIds: ["partnerbereich", "tickets-smashtime-3", "hinter-den-kulissen"]
  }
];

export const featuredNews = newsItems.find((item) => item.featured) ?? newsItems[0];

export function getNewsItem(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}

export function getRelatedNews(item: NewsItem) {
  const relatedIds = item.relatedIds ?? [];
  const related = relatedIds
    .map((id) => newsItems.find((news) => news.id === id))
    .filter((news): news is NewsItem => Boolean(news));

  if (related.length > 0) {
    return related;
  }

  return newsItems.filter((news) => news.id !== item.id).slice(0, 3);
}
