export type SponsorLogo = {
  name: string;
  label: string;
};

export type SponsorPackage = {
  name: string;
  price: string;
  tone: "bronze" | "silver" | "gold" | "red";
  benefits: string[];
};

export const sponsorLogos: SponsorLogo[] = [
  { name: "Sponsorplatz 01", label: "Logofläche" },
  { name: "Sponsorplatz 02", label: "Logofläche" },
  { name: "Sponsorplatz 03", label: "Logofläche" },
  { name: "Sponsorplatz 04", label: "Logofläche" },
  { name: "Sponsorplatz 05", label: "Logofläche" },
  { name: "Sponsorplatz 06", label: "Logofläche" }
];

export const sponsorBenefits = [
  {
    title: "Reichweite & Sichtbarkeit",
    text:
      "Präsenz vor einem wachsenden Kampfsportpublikum vor Ort und auf digitalen Kanälen.",
    icon: "users"
  },
  {
    title: "Starke Markenassoziation",
    text:
      "Positioniere deine Marke in einem Umfeld aus Energie, Disziplin und Leidenschaft.",
    icon: "target"
  },
  {
    title: "Netzwerk & Kontakte",
    text:
      "Verbinde dich mit Athleten, Unternehmen und Entscheidern aus Sport, Medien und Wirtschaft.",
    icon: "handshake"
  },
  {
    title: "Langfristiges Sponsoring",
    text:
      "Pakete werden bewusst als Platzhalter angelegt und später verwaltbar gemacht.",
    icon: "chart"
  }
];

export const sponsorPackages: SponsorPackage[] = [
  {
    name: "Bronze",
    price: "ab 1.000 Euro",
    tone: "bronze",
    benefits: [
      "Logo auf der Sponsorenseite",
      "Nennung auf sozialen Kanälen",
      "Sichtbarkeit bei Veranstaltungen"
    ]
  },
  {
    name: "Silber",
    price: "ab 2.500 Euro",
    tone: "silver",
    benefits: [
      "Alle Bronze-Leistungen",
      "Logo auf Veranstaltungs-Bannern",
      "Erwähnung in Veranstaltungsbeiträgen"
    ]
  },
  {
    name: "Gold",
    price: "ab 5.000 Euro",
    tone: "gold",
    benefits: [
      "Alle Silber-Leistungen",
      "Werbefläche im Käfig-/Eventbereich",
      "Feature in Neuigkeiten und sozialen Beiträgen"
    ]
  },
  {
    name: "Hauptpartner",
    price: "ab 10.000 Euro",
    tone: "red",
    benefits: [
      "Alle Gold-Leistungen",
      "Exklusive Präsentationsrechte",
      "Individuelle Aktivierungen"
    ]
  }
];
