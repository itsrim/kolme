export interface WikiArticle {
  title: string;
  url: string;
  description?: string;
  paragraphs: string[];
}

export function wikiPageUrl(title: string): string {
  const slug = encodeURIComponent(title.replace(/ /g, "_")).replace(/%3A/g, ":");
  return `https://fi.wikipedia.org/wiki/${slug}`;
}

function isHeading(block: string): boolean {
  return block.length < 80 && !/[.!?…]/.test(block);
}

/** Garde l'introduction en prose, et s'arrête à la première section. */
export function introParagraphs(extract: string, maxChars = 1600): string[] {
  const paragraphs: string[] = [];
  let count = 0;
  for (const block of extract.split(/\n+/).map((part) => part.trim()).filter(Boolean)) {
    if (isHeading(block)) break;
    if (paragraphs.length >= 4) break;
    if (paragraphs.length > 0 && count >= maxChars) break;
    paragraphs.push(block);
    count += block.length;
  }
  return paragraphs;
}

export function articleWordCount(paragraphs: string[]): number {
  return paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
}
