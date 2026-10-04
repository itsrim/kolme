export interface YleItem {
  title: string;
  link: string;
  published: string;
  category?: string;
}

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number.parseInt(num, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function field(block: string, name: string): string {
  const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1]) : "";
}

/** Titres du flux RSS de Yle. Le lien reste celui du flux, vers l'article. */
export function parseYleRss(xml: string, limit = 12): YleItem[] {
  const items: YleItem[] = [];
  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = match[1];
    const title = field(block, "title");
    const link = field(block, "link");
    const publishedRaw = field(block, "pubDate");
    const category = field(block, "category");
    const published = new Date(publishedRaw);
    if (!title || !link.startsWith("https://yle.fi/")) continue;
    items.push({
      title,
      link,
      published: Number.isNaN(published.getTime()) ? "" : published.toISOString(),
      category: category || undefined,
    });
    if (items.length >= limit) break;
  }
  return items;
}
