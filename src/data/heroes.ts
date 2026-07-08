export type PageHeroVariant =
  | "champions"
  | "news"
  | "about"
  | "events"
  | "fight"
  | "sponsors"
  | "contact"
  | "tickets";

export type PageHeroPreset = {
  image: string;
  position: string;
  variant?: PageHeroVariant;
  kicker?: string;
  watermark?: string;
};

export const pageHeroes = {
  champions: {
    image: "/images/backgrounds/smashtime-hero-champion-victory-belt.png",
    position: "center 50%",
    variant: "champions",
    kicker: "Vier Namen. Vier Titel.",
    watermark: "CHAMPIONS"
  },
  championProfile: {
    image: "/images/backgrounds/smashtime-hero-champion-victory-belt.png",
    position: "center 50%",
    variant: "champions",
    kicker: "SmashTime Titelträger",
    watermark: "CHAMPION"
  },
  news: {
    image: "/images/backgrounds/smashtime-hero-news-press-table.png",
    position: "center 58%",
    variant: "news",
    kicker: "Direkt aus dem Cage",
    watermark: "AKTUELL"
  },
  events: {
    image: "/images/backgrounds/smashtime-hero-arena-crowd-screens.png",
    position: "center 52%",
    variant: "events",
    kicker: "SmashTime Events",
    watermark: "LIVE"
  },
  eventsModule: {
    image: "/images/backgrounds/smashtime-hero-arena-crowd-screens.png",
    position: "center 52%"
  },
  sponsors: {
    image: "/images/backgrounds/smashtime-hero-partner-handshake-arena.png",
    position: "center 50%",
    variant: "sponsors",
    kicker: "Partnerschaften mit Wirkung",
    watermark: "SPONSOREN"
  },
  contact: {
    image: "/images/backgrounds/smashtime-hero-contact-ringside-desk.png",
    position: "center 56%",
    variant: "contact",
    kicker: "Wir melden uns schnell",
    watermark: "KONTAKT"
  },
  fightNight: {
    image: "/images/backgrounds/smashtime-hero-arena-crowd-screens.png",
    position: "center 52%",
    variant: "fight",
    watermark: "VS"
  },
  tickets: {
    image: "/images/backgrounds/smashtime-hero-arena-crowd-screens.png",
    position: "center 52%",
    variant: "tickets",
    kicker: "Sei live dabei",
    watermark: "CAGETIME"
  },
  about: {
    image: "/images/backgrounds/smashtime-hero-training-logo-ring.png",
    position: "center 50%",
    variant: "about",
    kicker: "Unsere Geschichte",
    watermark: "SMASHTIME"
  }
} as const satisfies Record<string, PageHeroPreset>;
