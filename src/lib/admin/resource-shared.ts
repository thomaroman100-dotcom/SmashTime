export const EVENT_DISCIPLINES = ["Xtreme Boxen", "K1", "MMA", "Boxen"] as const;

export const eventSelectColumns =
  "id, slug, name, short_name, subtitle, event_date, date_label, location, address, admission, starts_at, disciplines, gastro, image_path, ticket_url, status, updated_at";

export const NEWS_CATEGORIES = ["Veranstaltung", "Fightcard", "Sponsoring", "Neuigkeit"] as const;

export const CONTACT_STATUSES = ["neu", "gelesen", "erledigt"] as const;

export const FIGHT_STATUSES = ["planned", "confirmed", "cancelled", "completed"] as const;

export const FIGHT_STATUS_LABELS: Record<(typeof FIGHT_STATUSES)[number], string> = {
  planned: "Geplant",
  confirmed: "Bestätigt",
  cancelled: "Abgesagt",
  completed: "Beendet"
};

export const FIGHT_SECTIONS = ["Main Event", "Co-Main Event", "Main Card", "Preliminary Card"] as const;

export const MEDIA_TYPES = ["Hintergrund", "Champion", "Veranstaltung", "News", "Sponsor", "Logo", "Sonstiges"] as const;

export const SPONSOR_PACKAGES = ["Bronze", "Silber", "Gold", "Hauptpartner"] as const;

export const SETTING_FIELDS = [
  { key: "general.siteTitle", label: "Website-Titel", placeholder: "SmashTime" },
  { key: "general.siteTagline", label: "Tagline / Slogan", placeholder: "The Next Level of Fighting." },
  { key: "general.siteDescription", label: "Website-Beschreibung", placeholder: "Kurzbeschreibung der Website" },
  { key: "general.locale", label: "Sprache", placeholder: "Deutsch (DE)" },
  { key: "general.timezone", label: "Zeitzone", placeholder: "(UTC+01:00) Wien, Berlin, Bern" },
  { key: "branding.headerLogoUrl", label: "Logo (Header)", placeholder: "/images/logo/smashtime-logo.png" },
  { key: "branding.faviconUrl", label: "Favicon", placeholder: "/favicon.ico" },
  { key: "branding.theme.primaryColor", label: "Primärfarbe", placeholder: "#E30613" },
  { key: "branding.theme.accentColor", label: "Akzentfarbe", placeholder: "#D4AF37" },
  { key: "branding.theme.textColor", label: "Textfarbe", placeholder: "#E5E5E5" },
  { key: "navigation.items", label: "Navigation", placeholder: "[]" },
  { key: "countdown.enabled", label: "Countdown aktivieren", placeholder: "true" },
  { key: "countdown.featuredEventId", label: "Nächste Veranstaltung", placeholder: "smashtime-3-respekt-steigt-in-den-ring" },
  { key: "countdown.countdownEndAt", label: "Countdown-Ende", placeholder: "2026-10-17T18:00:00+02:00" },
  { key: "countdown.label", label: "Countdown-Text", placeholder: "Der Kampf beginnt in" },
  { key: "homepage.hero.title", label: "Hero Titel", placeholder: "SmashTime 3" },
  { key: "homepage.hero.subtitle", label: "Hero Untertitel", placeholder: "Die Elite des Kampfes." },
  { key: "homepage.hero.backgroundImageUrl", label: "Hero Hintergrundbild", placeholder: "/images/backgrounds/..." },
  { key: "homepage.cta.primaryLabel", label: "Haupt-CTA Text", placeholder: "Tickets sichern" },
  { key: "homepage.cta.primaryUrl", label: "Haupt-CTA Link", placeholder: "/tickets" },
  { key: "homepage.cta.secondaryLabel", label: "Sekundärer CTA Text", placeholder: "Fightcard ansehen" },
  { key: "homepage.cta.secondaryUrl", label: "Sekundärer CTA Link", placeholder: "/fight-night#fightcard" },
  { key: "homepage.modules.champions.enabled", label: "Champions-Modul aktiv", placeholder: "true" },
  { key: "homepage.modules.champions.title", label: "Champions Titel", placeholder: "Unsere Champions" },
  { key: "homepage.modules.champions.description", label: "Champions Beschreibung", placeholder: "Lerne die Athleten kennen..." },
  { key: "homepage.modules.champions.displayLimit", label: "Anzahl Champions", placeholder: "6" },
  { key: "homepage.modules.champions.buttonLabel", label: "Champions Button", placeholder: "Alle Champions ansehen" },
  { key: "homepage.modules.champions.buttonUrl", label: "Champions Link", placeholder: "/champions" },
  { key: "homepage.modules.news.enabled", label: "News-Modul aktiv", placeholder: "true" },
  { key: "homepage.modules.news.title", label: "News Titel", placeholder: "Aktuelle News" },
  { key: "homepage.modules.news.description", label: "News Beschreibung", placeholder: "Bleib auf dem Laufenden..." },
  { key: "homepage.modules.news.displayLimit", label: "Anzahl News", placeholder: "3" },
  { key: "homepage.modules.news.buttonLabel", label: "News Button", placeholder: "Alle News ansehen" },
  { key: "homepage.modules.news.buttonUrl", label: "News Link", placeholder: "/neuigkeiten" },
  { key: "homepage.modules.sponsors.enabled", label: "Sponsorenbereich aktiv", placeholder: "true" },
  { key: "homepage.modules.sponsors.title", label: "Sponsoren Titel", placeholder: "Unsere Partner" },
  { key: "homepage.modules.sponsors.description", label: "Sponsoren Beschreibung", placeholder: "Gemeinsam stark..." },
  { key: "homepage.modules.sponsors.displayLimit", label: "Anzahl Logos", placeholder: "8" },
  { key: "homepage.modules.sponsors.buttonLabel", label: "Sponsoren Button", placeholder: "Alle Partner ansehen" },
  { key: "homepage.modules.sponsors.buttonUrl", label: "Sponsoren Link", placeholder: "/sponsoren" },
  { key: "contact_email", label: "Kontakt-E-Mail", placeholder: "kontakt@example.com" },
  { key: "ticket_url", label: "Ticketlink", placeholder: "https://… oder /tickets" },
  { key: "instagram_url", label: "Instagram-Link", placeholder: "https://instagram.com/…" },
  { key: "facebook_url", label: "Facebook-Link", placeholder: "https://facebook.com/…" },
  { key: "youtube_url", label: "YouTube-Link", placeholder: "https://youtube.com/…" },
  { key: "tiktok_url", label: "TikTok-Link", placeholder: "https://tiktok.com/@…" },
  { key: "home_cta_title", label: "Startseiten-CTA Titel", placeholder: "Sei dabei. Erlebe Geschichte." },
  { key: "footer_claim", label: "Footer-Claim", placeholder: "Keine Regeln. Nur Respekt." }
] as const;
