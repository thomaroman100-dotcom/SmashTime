const legacyOwnHosts = new Set(["smashtime.at", "www.smashtime.at", "smash-time-website.vercel.app"]);

const routeAliases: Record<string, string> = {
  "/about": "/ueber-uns",
  "/career": "/kontakt",
  "/contact": "/kontakt",
  "/events": "/veranstaltungen",
  "/faq": "/kontakt",
  "/fightcard": "/fight-night#fightcard",
  "/fighters": "/champions",
  "/legal/agb": "/datenschutz",
  "/legal/datenschutz": "/datenschutz",
  "/legal/impressum": "/impressum",
  "/media": "/neuigkeiten",
  "/news": "/neuigkeiten",
  "/partners": "/sponsoren",
  "/rankings": "/champions",
  "/shop": "/tickets",
  "/sponsors": "/sponsoren"
};

const routePrefixAliases: Array<[from: string, to: string]> = [
  ["/events/", "/veranstaltungen/"],
  ["/news/", "/neuigkeiten/"],
  ["/sponsors/", "/sponsoren/"]
];

function aliasPathname(pathname: string) {
  const exactAlias = routeAliases[pathname];
  if (exactAlias) {
    return exactAlias;
  }

  const prefixAlias = routePrefixAliases.find(([from]) => pathname.startsWith(from));
  if (!prefixAlias) {
    return pathname;
  }

  const [from, to] = prefixAlias;
  return `${to}${pathname.slice(from.length)}`;
}

function configuredHost() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    return null;
  }

  try {
    return new URL(siteUrl).host.toLowerCase();
  } catch {
    return null;
  }
}

function isOwnHost(host: string) {
  const normalized = host.toLowerCase();
  const currentHost = configuredHost();
  return legacyOwnHosts.has(normalized) || normalized === currentHost || normalized === "localhost:3000";
}

export function normalizeInternalPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "/";
  }

  const parsed = new URL(trimmed.startsWith("/") ? trimmed : `/${trimmed}`, "https://smashtime.local");
  const alias = aliasPathname(parsed.pathname);
  const aliasParts = new URL(alias, "https://smashtime.local");

  if (aliasParts.hash && !parsed.hash) {
    return `${aliasParts.pathname}${parsed.search}${aliasParts.hash}`;
  }

  return `${aliasParts.pathname}${parsed.search}${parsed.hash || aliasParts.hash}`;
}

export function normalizePublicHref(value: string, fallback = "/") {
  const trimmed = value.trim();
  if (!trimmed) {
    return normalizeInternalPath(fallback);
  }

  if (/^(mailto:|tel:|#)/i.test(trimmed)) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (isOwnHost(url.host)) {
        return normalizeInternalPath(`${url.pathname}${url.search}${url.hash}`);
      }
      return trimmed;
    } catch {
      return normalizeInternalPath(fallback);
    }
  }

  return normalizeInternalPath(trimmed);
}
