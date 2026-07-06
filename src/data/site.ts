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
  claim: "Keine Regeln. Nur Respekt.",
  description:
    "SmashTime aus St. Pölten steht für harte Kampfsportmomente, klare Inszenierung und echte Live-Atmosphäre.",
  logo: "/images/logo/smashtime-logo.png",
  navigation: [
    { label: "Startseite", href: "/" },
    { label: "Champions", href: "/champions" },
    { label: "Neuigkeiten", href: "/neuigkeiten" },
    { label: "Über uns", href: "/ueber-uns" },
    {
      label: "Mehr",
      href: "/veranstaltungen",
      children: [
        { label: "Veranstaltungen", href: "/veranstaltungen" },
        { label: "Nächste Veranstaltung", href: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring" },
        { label: "Kampfabend", href: "/fight-night" },
        { label: "Fightcard", href: "/fight-night#fightcard" },
        { label: "Sponsoren", href: "/sponsoren" },
        { label: "Kontakt", href: "/kontakt" }
      ]
    }
  ] satisfies NavigationItem[],
  headerCta: {
    label: "Tickets sichern",
    href: "/tickets"
  },
  loginLink: {
    label: "Login",
    href: "/login"
  },
  footerNavigation: [
    { label: "Veranstaltungen", href: "/veranstaltungen" },
    { label: "Champions", href: "/champions" },
    { label: "Neuigkeiten", href: "/neuigkeiten" },
    { label: "Sponsoren", href: "/sponsoren" },
    { label: "Kontakt", href: "/kontakt" }
  ],
  footerColumns: [
    {
      title: "SmashTime",
      links: [
        { label: "Über uns", href: "/ueber-uns" },
        { label: "Sponsoren", href: "/sponsoren" },
        { label: "Kontakt", href: "/kontakt" },
        { label: "Kampfabend", href: "/fight-night" }
      ]
    },
    {
      title: "Service",
      links: [
        { label: "Tickets sichern", href: "/tickets" },
        { label: "Veranstaltungen", href: "/veranstaltungen" },
        { label: "Champions", href: "/champions" },
        { label: "Neuigkeiten", href: "/neuigkeiten" }
      ]
    },
    {
      title: "Rechtliches",
      links: [
        { label: "Impressum", href: "/impressum" },
        { label: "Datenschutz", href: "/datenschutz" }
      ]
    }
  ],
  newsletter: {
    title: "Newsletter",
    text: "Keine Kampfnacht verpassen. Melde dich jetzt an!",
    placeholder: "Deine E-Mail-Adresse",
    success: "Danke! Deine Anmeldung ist eingegangen.",
    error: "Bitte gib eine gültige E-Mail-Adresse ein."
  },
  ticketHref: "/tickets",
  eventHref: "/veranstaltungen/smashtime-3-respekt-steigt-in-den-ring",
  fightNightHref: "/fight-night#fightcard",
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/smash_time_st/" },
    { label: "YouTube", href: "https://www.youtube.com/@Smashtimestp" }
  ],
  contact: {
    email: "",
    instagram: "@smash_time_st"
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
