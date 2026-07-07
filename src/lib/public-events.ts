import { createClient } from "@supabase/supabase-js";
import { upcomingEvent, type SmashEvent } from "@/data/events";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

type PublicEventRow = {
  slug: string;
  name: string;
  short_name: string;
  subtitle: string | null;
  event_date: string | null;
  date_label: string | null;
  location: string | null;
  address: string | null;
  admission: string | null;
  starts_at: string | null;
  disciplines: string[] | null;
  gastro: string | null;
  image_path: string | null;
  ticket_url: string | null;
  status: "draft" | "published" | "archived";
  show_in_hero?: boolean | null;
};

export type PublicHomeEvent = SmashEvent & {
  showInHero: boolean;
  ticketHref?: string;
};

export type PublicEventStatus = "upcoming" | "past" | "archived";

export type PublicEvent = Omit<PublicHomeEvent, "status"> & {
  databaseStatus: PublicEventRow["status"];
  eventStatus: PublicEventStatus;
};

const publicEventSelect =
  "slug, name, short_name, subtitle, event_date, date_label, location, address, admission, starts_at, disciplines, gastro, image_path, ticket_url, status, show_in_hero";

const smashtime3Slug = "smashtime-3-respekt-steigt-in-den-ring";
const smashtime3Title = "SmashTime 3 - Gemeinsam gegen Mobbing";
const smashtime3Subtitle = "Gemeinsam gegen Mobbing";
const smashtime3Poster = "/images/events/smashtime-3-gemeinsam-gegen-mobbing.png";

function formatEventDate(value: string | null) {
  if (!value) {
    return "Datum wird bekanntgegeben";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Datum wird bekanntgegeben";
  }

  return new Intl.DateTimeFormat("de-AT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function getEventStatus(row: PublicEventRow): PublicEventStatus {
  if (row.status === "archived") {
    return "archived";
  }

  if (!row.event_date) {
    return "upcoming";
  }

  const date = new Date(row.event_date);
  if (Number.isNaN(date.getTime())) {
    return "upcoming";
  }

  return date.getTime() >= Date.now() ? "upcoming" : "past";
}

function rowToPublicEvent(row: PublicEventRow): PublicHomeEvent {
  const isSmashtime3Legacy = row.slug === smashtime3Slug;
  const normalizedName = row.name.toLowerCase();
  const normalizedSubtitle = row.subtitle?.toLowerCase() ?? "";
  const name = isSmashtime3Legacy && (normalizedName.includes("respekt steigt") || normalizedName === smashtime3Title.toLowerCase())
    ? smashtime3Title
    : row.name;
  const subtitle = isSmashtime3Legacy && (!row.subtitle || normalizedSubtitle.includes("respekt steigt") || normalizedSubtitle === smashtime3Subtitle.toLowerCase())
    ? smashtime3Subtitle
    : row.subtitle ?? row.name;
  const image = isSmashtime3Legacy && (!row.image_path || row.image_path.endsWith("smashtime-3-respekt-steigt-in-den-ring.png"))
    ? smashtime3Poster
    : row.image_path ?? upcomingEvent.image;

  return {
    id: row.slug,
    name,
    shortName: row.short_name,
    subtitle,
    date: row.event_date ?? "",
    dateLabel: row.date_label ?? formatEventDate(row.event_date),
    location: row.location ?? "Ort wird bekanntgegeben",
    address: row.address ?? "Adresse wird bekanntgegeben",
    admission: row.admission ?? "Einlass wird bekanntgegeben",
    start: row.starts_at ?? "Beginn wird bekanntgegeben",
    disciplines: (row.disciplines ?? []) as PublicHomeEvent["disciplines"],
    gastro: row.gastro ?? undefined,
    status: "upcoming",
    image,
    detailHref: `/veranstaltungen/${row.slug}`,
    ticketHref: row.ticket_url ?? undefined,
    showInHero: Boolean(row.show_in_hero)
  };
}

function rowToEventLibraryItem(row: PublicEventRow): PublicEvent {
  const event = rowToPublicEvent(row);

  return {
    ...event,
    databaseStatus: row.status,
    eventStatus: getEventStatus(row)
  };
}

function fallbackHeroEvent(): PublicHomeEvent {
  return {
    ...upcomingEvent,
    showInHero: true
  };
}

export async function getPublicHeroEvent(): Promise<PublicHomeEvent | null> {
  if (!isSupabaseConfigured()) {
    return fallbackHeroEvent();
  }

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from("events")
    .select(publicEventSelect)
    .eq("status", "published")
    .eq("show_in_hero", true)
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Before the hero-visibility migration has been applied, keep the current
    // local event visible instead of breaking the public homepage.
    if (error.code === "42703") {
      return fallbackHeroEvent();
    }
    return null;
  }

  return data ? rowToPublicEvent(data as PublicEventRow) : null;
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  if (!isSupabaseConfigured()) {
    return [
      {
        ...fallbackHeroEvent(),
        databaseStatus: "published",
        eventStatus: "upcoming"
      }
    ];
  }

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from("events")
    .select(publicEventSelect)
    .in("status", ["published", "archived"])
    .order("event_date", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "42703") {
      return [
        {
          ...fallbackHeroEvent(),
          databaseStatus: "published",
          eventStatus: "upcoming"
        }
      ];
    }
    return [];
  }

  return ((data ?? []) as PublicEventRow[]).map(rowToEventLibraryItem);
}

export async function getPublicEventBySlug(slug: string): Promise<PublicEvent | null> {
  if (!isSupabaseConfigured()) {
    const fallback = fallbackHeroEvent();
    return fallback.id === slug
      ? {
          ...fallback,
          databaseStatus: "published",
          eventStatus: "upcoming"
        }
      : null;
  }

  const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from("events")
    .select(publicEventSelect)
    .eq("slug", slug)
    .in("status", ["published", "archived"])
    .maybeSingle();

  if (error) {
    if (error.code === "42703" && slug === upcomingEvent.id) {
      const fallback = fallbackHeroEvent();
      return {
        ...fallback,
        databaseStatus: "published",
        eventStatus: "upcoming"
      };
    }
    return null;
  }

  return data ? rowToEventLibraryItem(data as PublicEventRow) : null;
}
