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
    image: "/images/backgrounds/hero-champions-belt.png",
    position: "center center",
    variant: "champions",
    kicker: "Vier Namen. Vier Titel.",
    watermark: "CHAMPIONS"
  },
  championProfile: {
    image: "/images/backgrounds/hero-champion-profile-cage.png",
    position: "center center",
    variant: "champions",
    kicker: "SmashTime Titelträger",
    watermark: "CHAMPION"
  },
  news: {
    image: "/images/backgrounds/hero-news-cage-smoke.png",
    position: "center center",
    variant: "news",
    kicker: "Direkt aus dem Cage",
    watermark: "AKTUELL"
  },
  events: {
    image: "/images/backgrounds/hero-events-stage.png",
    position: "center center",
    variant: "events",
    kicker: "Live in St. Pölten",
    watermark: "LIVE"
  },
  eventsModule: {
    image: "/images/backgrounds/hero-events-cage-wide.png",
    position: "center center"
  },
  sponsors: {
    image: "/images/backgrounds/hero-sponsors-corridor.png",
    position: "center center",
    variant: "sponsors",
    kicker: "Partnerschaften mit Wirkung",
    watermark: "SPONSOREN"
  },
  contact: {
    image: "/images/backgrounds/hero-contact-backstage.png",
    position: "center center",
    variant: "contact",
    kicker: "Wir melden uns schnell",
    watermark: "KONTAKT"
  },
  fightNight: {
    image: "/images/backgrounds/atmosphere-fighters-faceoff-wide.png",
    position: "center 30%",
    variant: "fight",
    watermark: "VS"
  },
  tickets: {
    image: "/images/backgrounds/atmosphere-arena-crowd-cage-wide.png",
    position: "center 40%",
    variant: "tickets",
    kicker: "Sei live dabei",
    watermark: "CAGETIME"
  },
  about: {
    image: "/images/backgrounds/arena-cage-front.png",
    position: "center center",
    variant: "about",
    kicker: "Kampfsport aus St. Pölten",
    watermark: "SMASHTIME"
  }
} as const satisfies Record<string, PageHeroPreset>;
