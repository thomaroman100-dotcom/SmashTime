export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRecord(record: string) {
  const numbers = record.match(/\d+/g);

  if (numbers?.length) {
    return numbers.join(" - ");
  }

  return record.replaceAll(" / ", " - ");
}
