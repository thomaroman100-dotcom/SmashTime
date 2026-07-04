export type NavigationItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

export const site = {
  name: "SmashTime",
  description:
    "SmashTime aus St. Pölten steht für harte Kampfsportmomente, klare Inszenierung und echte Live-Atmosphäre.",
  logo: "/images/logo/smashtime-logo.png",
  navigation: [
    {
      label: "Veranstaltungen",
      href: "/veranstaltungen",
      children: [
        { label: "Nächste Veranstaltung", href: "/veranstaltungen/smashtime-3-cagetime" },
        { label: "Kampfabend", href: "/fight-night" },
        { label: "Fightcard", href: "/fight-night#fightcard" },
        { label: "Vergangene Veranstaltungen", href: "/veranstaltungen#archiv" }
      ]
    },
    {
      label: "Kämpfer",
      href: "/champions",
      children: [
        { label: "Champions", href: "/champions" },
        { label: "Gewichtsklassen", href: "/champions#gewichtsklassen" }
      ]
    },
    { label: "Neuigkeiten", href: "/neuigkeiten" },
    {
      label: "Über uns",
      href: "/ueber-uns",
      children: [
        { label: "SmashTime", href: "/ueber-uns" },
        { label: "Sponsoren", href: "/sponsoren" },
        { label: "Kontakt", href: "/kontakt" }
      ]
    }
  ] satisfies NavigationItem[],
  headerCta: {
    label: "Nächste Veranstaltung",
    href: "/veranstaltungen/smashtime-3-cagetime"
  },
  footerNavigation: [
    { label: "Veranstaltungen", href: "/veranstaltungen" },
    { label: "Champions", href: "/champions" },
    { label: "Neuigkeiten", href: "/neuigkeiten" },
    { label: "Sponsoren", href: "/sponsoren" },
    { label: "Kontakt", href: "/kontakt" }
  ],
  ticketHref: "/tickets",
  eventHref: "/veranstaltungen/smashtime-3-cagetime",
  fightNightHref: "/fight-night",
  socialLinks: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" }
  ],
  contact: {
    email: "kontakt@smashtime.at (Platzhalter)",
    instagram: "Instagram wird ergänzt"
  }
};

export const featureItems = [
  {
    title: "Top-Paarungen",
    text: "Starke Paarungen, klare Dramaturgie und Kämpfe, die im Kopf bleiben.",
    icon: "settings"
  },
  {
    title: "Mitreißende Atmosphäre",
    text: "Licht, Sound, Druck und ein Publikum, das jede Runde spüren lässt.",
    icon: "megaphone"
  },
  {
    title: "Oktagon-Action",
    text: "MMA, K1, Xtreme Boxen und Boxen in einem kompromisslosen Rahmen.",
    icon: "box"
  },
  {
    title: "Premium-Erlebnis",
    text: "Klare Sicht, harte Inszenierung und ein Abend mit echtem Eventgefühl.",
    icon: "diamond"
  },
  {
    title: "Unvergessliche Momente",
    text: "Adrenalin, Respekt und Leidenschaft direkt aus St. Pölten.",
    icon: "trophy"
  }
];
