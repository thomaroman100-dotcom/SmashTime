import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { homeCountdown, homeHero, homeSections, homeTicketCta } from "@/data/homepage";
import { site, type NavigationItem } from "@/data/site";
import { normalizePublicHref } from "@/lib/public-url";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type SettingRow = {
  key: string;
  value: { text?: string } | null;
};

type StoredNavigationItem = {
  label?: string;
  path?: string;
  href?: string;
  isVisible?: boolean;
  order?: number;
};

export type PublicThemeSettings = {
  primaryColor: string;
  accentColor: string;
  textColor: string;
};

export type PublicSiteContent = Omit<typeof site, "navigation"> & {
  navigation: NavigationItem[];
};

export type PublicHomeModuleSettings = {
  enabled: boolean;
  title: string;
  description: string;
  displayLimit: number;
  ctaLabel: string;
  ctaHref: string;
};

export type PublicSettings = {
  faviconUrl: string;
  theme: PublicThemeSettings;
  site: PublicSiteContent;
  home: {
    hero: typeof homeHero;
    countdown: typeof homeCountdown & { enabled: boolean };
    sections: typeof homeSections & {
      champions: typeof homeSections.champions & PublicHomeModuleSettings;
      news: typeof homeSections.news & PublicHomeModuleSettings;
      sponsors: PublicHomeModuleSettings;
    };
    ticketCta: typeof homeTicketCta;
  };
};

function setting(rows: Record<string, string>, key: string, fallback: string) {
  const value = rows[key]?.trim();
  return value ? value : fallback;
}

function normalizeHomeHeroPrimaryCta(label: string, href: string, ticketLabel: string, ticketHref: string) {
  const lowerLabel = label.trim().toLowerCase();
  const isLegacyTicketCta =
    (lowerLabel === "tickets sichern" || lowerLabel === "ticket sichern") &&
    (href === ticketHref || href === site.ticketHref || href === "/tickets");

  return isLegacyTicketCta ? homeHero.primaryCta : { label, href };
}

function normalizeHomeHeroSecondaryCta(label: string, href: string) {
  const lowerLabel = label.trim().toLowerCase();
  const isLegacyFightcardCta =
    (lowerLabel === "fightcard ansehen" || lowerLabel === "kampfabend ansehen") && href.startsWith("/fight-night");

  return isLegacyFightcardCta ? homeHero.secondaryCta : { label, href };
}

function boolSetting(rows: Record<string, string>, key: string, fallback: boolean) {
  const value = rows[key];
  if (value === "true" || value === "1" || value === "on") {
    return true;
  }
  if (value === "false" || value === "0" || value === "off") {
    return false;
  }
  return fallback;
}

function intSetting(rows: Record<string, string>, key: string, fallback: number) {
  const parsed = Number.parseInt(rows[key] ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizePath(path: string) {
  return normalizePublicHref(path);
}

function normalizeNavigationLabel(label: string) {
  const trimmed = label.trim();
  const publicLabelAliases: Record<string, string> = {
    home: "Startseite",
    news: "Neuigkeiten",
    sponsors: "Partner",
    contact: "Kontakt",
    fighters: "Kämpfer"
  };

  return publicLabelAliases[trimmed.toLowerCase()] ?? trimmed;
}

function isRankingNavigationLink(labelValue?: string, hrefValue?: string) {
  const label = (labelValue ?? "").trim().toLowerCase();
  const href = (hrefValue ?? "").trim().toLowerCase();
  return label === "ranglisten" || label === "rankings" || href === "/rankings" || href.startsWith("/rankings?");
}

function isRankingNavigationItem(item: StoredNavigationItem) {
  return isRankingNavigationLink(item.label, item.path ?? item.href);
}

function defaultNavigationWithoutRankings() {
  return site.navigation
    .filter((item) => !isRankingNavigationLink(item.label, item.href))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => !isRankingNavigationLink(child.label, child.href))
    }));
}

const legacyHomeHeroBackgroundImages = new Set([
  "/images/backgrounds/atmosphere-fight-action-grunge-wide.png",
  "/images/backgrounds/atmosphere-fighters-faceoff-wide.png"
]);

function homeHeroBackgroundImage(rows: Record<string, string>) {
  const configuredImage = setting(rows, "homepage.hero.backgroundImageUrl", homeHero.backgroundImage);
  return legacyHomeHeroBackgroundImages.has(configuredImage) ? homeHero.backgroundImage : configuredImage;
}

function normalizeHomeHeroTitle(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  const legacyTitles = new Set([
    "smashtime 3",
    "über smashtime.",
    "ueber smashtime.",
    "bei uns wird nicht gespielt.",
    "bei uns wird nicht gespielt"
  ]);
  return legacyTitles.has(normalized) ? homeHero.title : value;
}

function normalizeHomeHeroSubtitle(value: string) {
  const normalized = value.trim().toLowerCase();
  const isLegacySubtitle =
    normalized.includes("geboren als untergrund-format") ||
    normalized.includes("smashtime bringt kämpfer") ||
    normalized.includes("smashtime bringt kaempfer") ||
    normalized.includes("die elite des kampfes") ||
    normalized.includes("respekt steigt in den ring");

  return isLegacySubtitle ? homeHero.subtitle : value;
}

function parseNavigation(rows: Record<string, string>) {
  const raw = rows["navigation.items"];
  let parsed: StoredNavigationItem[] = [];

  if (raw) {
    try {
      const value = JSON.parse(raw) as StoredNavigationItem[];
      parsed = Array.isArray(value) ? value : [];
    } catch {
      parsed = [];
    }
  }

  if (parsed.length === 0) {
    return defaultNavigationWithoutRankings();
  }

  const visibleItems = parsed
    .filter((item) => !isRankingNavigationItem(item))
    .filter((item) => item.isVisible !== false && (item.label ?? "").trim())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({
      label: normalizeNavigationLabel(item.label!),
      href: normalizePath(item.path ?? item.href ?? "/")
    }));

  if (visibleItems.length <= 4) {
    return visibleItems;
  }

  const topLevel = visibleItems.slice(0, 4);
  const overflow = visibleItems.slice(4);

  return [
    ...topLevel,
    {
      label: "Mehr",
      href: overflow[0]?.href ?? "/",
      children: overflow
    }
  ] satisfies NavigationItem[];
}

async function readPublicSettingRows() {
  if (!isSupabaseConfigured()) {
    return {};
  }

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .eq("is_public", true);

  if (error) {
    return {};
  }

  return ((data ?? []) as SettingRow[]).reduce<Record<string, string>>((accumulator, row) => {
    accumulator[row.key] = row.value?.text ?? "";
    return accumulator;
  }, {});
}

export const getPublicSiteSettings = cache(async (): Promise<PublicSettings> => {
  const rows = await readPublicSettingRows();
  const primaryColor = setting(rows, "branding.theme.primaryColor", "#D71920");
  const accentColor = setting(rows, "branding.theme.accentColor", "#C9A24A");
  const textColor = setting(rows, "branding.theme.textColor", "#E5E5E5");
  const heroTitle = normalizeHomeHeroTitle(setting(rows, "homepage.hero.title", homeHero.title));
  const heroSubtitle = normalizeHomeHeroSubtitle(setting(rows, "homepage.hero.subtitle", homeHero.subtitle));
  const ticketHref = normalizePublicHref(setting(rows, "header.cta.url", site.ticketHref), site.ticketHref);
  const ticketLabel = setting(rows, "header.cta.label", site.headerCta.label);
  const heroPrimaryHref = normalizePublicHref(
    setting(rows, "homepage.cta.primaryUrl", homeHero.primaryCta.href),
    homeHero.primaryCta.href
  );
  const heroPrimaryCta = normalizeHomeHeroPrimaryCta(
    setting(rows, "homepage.cta.primaryLabel", homeHero.primaryCta.label),
    heroPrimaryHref,
    ticketLabel,
    ticketHref
  );
  const secondaryLabel = setting(rows, "homepage.cta.secondaryLabel", homeHero.secondaryCta.label);
  const secondaryHref = normalizePublicHref(
    setting(rows, "homepage.cta.secondaryUrl", homeHero.secondaryCta.href),
    homeHero.secondaryCta.href
  );
  const heroSecondaryCta = normalizeHomeHeroSecondaryCta(secondaryLabel, secondaryHref);

  const configuredSite: PublicSiteContent = {
    ...site,
    name: setting(rows, "general.siteTitle", site.name),
    claim: setting(rows, "general.siteTagline", site.claim),
    description: setting(rows, "general.siteDescription", site.description),
    logo: setting(rows, "branding.headerLogoUrl", site.logo),
    navigation: parseNavigation(rows),
    headerCta: {
      label: ticketLabel,
      href: ticketHref
    },
    ticketHref,
    socialLinks: site.socialLinks.map((item) => {
      const key = `${item.label.toLowerCase()}_url`;
      return { ...item, href: setting(rows, key, item.href) };
    }),
    contact: {
      email: setting(rows, "contact_email", site.contact.email),
      instagram: setting(rows, "instagram_url", site.contact.instagram)
    }
  };

  return {
    faviconUrl: setting(rows, "branding.faviconUrl", "/favicon.svg"),
    theme: {
      primaryColor,
      accentColor,
      textColor
    },
    site: configuredSite,
    home: {
      hero: {
        ...homeHero,
        title: heroTitle,
        subtitle: heroSubtitle,
        backgroundImage: homeHeroBackgroundImage(rows),
        primaryCta: heroPrimaryCta,
        secondaryCta: heroSecondaryCta
      },
      countdown: {
        ...homeCountdown,
        enabled: boolSetting(rows, "countdown.enabled", true),
        label: setting(rows, "countdown.label", homeCountdown.label),
        targetDate: setting(rows, "countdown.countdownEndAt", homeCountdown.targetDate),
        ctaLabel: setting(rows, "countdown.ctaLabel", homeCountdown.ctaLabel),
        ctaHref: normalizePublicHref(setting(rows, "countdown.ctaHref", homeCountdown.ctaHref), homeCountdown.ctaHref)
      },
      sections: {
        ...homeSections,
        champions: {
          ...homeSections.champions,
          enabled: boolSetting(rows, "homepage.modules.champions.enabled", true),
          title: setting(rows, "homepage.modules.champions.title", homeSections.champions.title),
          description: setting(rows, "homepage.modules.champions.description", ""),
          displayLimit: intSetting(rows, "homepage.modules.champions.displayLimit", 4),
          ctaLabel: setting(rows, "homepage.modules.champions.buttonLabel", homeSections.champions.ctaLabel),
          ctaHref: normalizePublicHref(
            setting(rows, "homepage.modules.champions.buttonUrl", homeSections.champions.ctaHref),
            homeSections.champions.ctaHref
          )
        },
        news: {
          ...homeSections.news,
          enabled: boolSetting(rows, "homepage.modules.news.enabled", true),
          title: setting(rows, "homepage.modules.news.title", homeSections.news.title),
          description: setting(rows, "homepage.modules.news.description", ""),
          displayLimit: intSetting(rows, "homepage.modules.news.displayLimit", 3),
          ctaLabel: setting(rows, "homepage.modules.news.buttonLabel", homeSections.news.ctaLabel),
          ctaHref: normalizePublicHref(
            setting(rows, "homepage.modules.news.buttonUrl", homeSections.news.ctaHref),
            homeSections.news.ctaHref
          )
        },
        sponsors: {
          enabled: boolSetting(rows, "homepage.modules.sponsors.enabled", true),
          title: setting(rows, "homepage.modules.sponsors.title", "Unsere Partner"),
          description: setting(rows, "homepage.modules.sponsors.description", ""),
          displayLimit: intSetting(rows, "homepage.modules.sponsors.displayLimit", 6),
          ctaLabel: setting(rows, "homepage.modules.sponsors.buttonLabel", "Alle Partner ansehen"),
          ctaHref: normalizePublicHref(setting(rows, "homepage.modules.sponsors.buttonUrl", "/sponsoren"), "/sponsoren")
        }
      },
      ticketCta: {
        ...homeTicketCta,
        ctaLabel: ticketLabel,
        ctaHref: ticketHref
      }
    }
  };
});
