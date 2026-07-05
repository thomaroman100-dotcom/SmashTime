const dateFormatter = new Intl.DateTimeFormat("de-AT", {
  day: "2-digit",
  month: "long",
  year: "numeric"
});

const shortDateFormatter = new Intl.DateTimeFormat("de-AT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

const timeFormatter = new Intl.DateTimeFormat("de-AT", {
  hour: "2-digit",
  minute: "2-digit"
});

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value: string | null | undefined, fallback = "–"): string {
  const date = parseDate(value);
  return date ? dateFormatter.format(date) : fallback;
}

export function formatDateShort(value: string | null | undefined, fallback = "–"): string {
  const date = parseDate(value);
  return date ? shortDateFormatter.format(date) : fallback;
}

export function formatTime(value: string | null | undefined, fallback = "–"): string {
  const date = parseDate(value);
  return date ? `${timeFormatter.format(date)} Uhr` : fallback;
}

/** "Heute, 14:37" / "Gestern, 09:12" / "18. Mai 2026" */
export function formatRelative(value: string | null | undefined, fallback = "–"): string {
  const date = parseDate(value);
  if (!date) {
    return fallback;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);

  if (diffDays === 0) {
    return `Heute, ${timeFormatter.format(date)}`;
  }
  if (diffDays === 1) {
    return `Gestern, ${timeFormatter.format(date)}`;
  }
  return dateFormatter.format(date);
}

/** Kalendertag-Kürzel für Timeline-Karten: { day: "18", month: "MAI" } */
export function calendarBadge(value: string | null | undefined): { day: string; month: string } {
  const date = parseDate(value);
  if (!date) {
    return { day: "–", month: "" };
  }
  const month = new Intl.DateTimeFormat("de-AT", { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
  return { day: String(date.getDate()), month };
}
