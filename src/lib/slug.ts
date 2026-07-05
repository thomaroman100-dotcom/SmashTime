const umlautMap: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss"
};

/** Client-sicherer Slug-Generator (identisch zur Server-Variante in action-helpers). */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => umlautMap[char] ?? char)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
