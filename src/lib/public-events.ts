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

function rowToPublicEvent(row: PublicEventRow): PublicHomeEvent {
  return {
    id: row.slug,
    name: row.name,
    shortName: row.short_name,
    subtitle: row.subtitle ?? row.name,
    date: row.event_date ?? "",
    dateLabel: row.date_label ?? formatEventDate(row.event_date),
    location: row.location ?? "Ort wird bekanntgegeben",
    address: row.address ?? "Adresse wird bekanntgegeben",
    admission: row.admission ?? "Einlass wird bekanntgegeben",
    start: row.starts_at ?? "Beginn wird bekanntgegeben",
    disciplines: (row.disciplines ?? []) as PublicHomeEvent["disciplines"],
    gastro: row.gastro ?? undefined,
    status: "upcoming",
    image: row.image_path ?? upcomingEvent.image,
    detailHref: `/veranstaltungen/${row.slug}`,
    ticketHref: row.ticket_url ?? undefined,
    showInHero: Boolean(row.show_in_hero)
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
    .select(
      "slug, name, short_name, subtitle, event_date, date_label, location, address, admission, starts_at, disciplines, gastro, image_path, ticket_url, status, show_in_hero"
    )
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
