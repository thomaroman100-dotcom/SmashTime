export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRecord(record: string) {
  return record.replaceAll(" / ", " - ");
}
