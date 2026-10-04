import { articleWordCount, introParagraphs, wikiPageUrl, type WikiArticle } from "./wiki";

const UA = "Kolme/1.0 (apprentissage du finnois)";

interface FeedLink {
  title?: string;
  description?: string;
}

interface FeaturedFeed {
  news?: { links?: FeedLink[] }[];
  mostread?: { articles?: FeedLink[] };
}

function helsinkiDate(now = new Date()): { year: string; month: string; day: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Helsinki",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const [year, month, day] = parts.split("-");
  return { year, month, day };
}

function titlesFrom(feed: FeaturedFeed): { title: string; description?: string }[] {
  const seen = new Set<string>();
  const picked: { title: string; description?: string }[] = [];
  const links = [
    ...(feed.news ?? []).flatMap((item) => item.links ?? []),
    ...(feed.mostread?.articles ?? []),
  ];
  for (const link of links) {
    const title = link.title?.replace(/_/g, " ").trim();
    if (!title || seen.has(title)) continue;
    seen.add(title);
    picked.push({ title, description: link.description });
    if (picked.length >= 12) break;
  }
  return picked;
}

async function plainExtract(title: string): Promise<{ title: string; extract: string }> {
  const url = `https://fi.wikipedia.org/w/api.php?${new URLSearchParams({
    action: "query",
    format: "json",
    prop: "extracts",
    explaintext: "1",
    exsectionformat: "plain",
    redirects: "1",
    titles: title,
  })}`;
  const response = await fetch(url, {
    headers: { "user-agent": UA, "api-user-agent": UA },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(String(response.status));
  const data = (await response.json()) as {
    query?: { pages?: Record<string, { title?: string; extract?: string; missing?: string }> };
  };
  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page || page.missing !== undefined) return { title, extract: "" };
  return { title: page.title || title, extract: page.extract ?? "" };
}

export async function loadWikiDay(): Promise<{ articles: WikiArticle[]; fetchedAt: string }> {
  const { year, month, day } = helsinkiDate();
  const feedUrl = `https://fi.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`;
  const feedResponse = await fetch(feedUrl, {
    headers: { "user-agent": UA, "api-user-agent": UA },
    signal: AbortSignal.timeout(8000),
  });
  if (!feedResponse.ok) throw new Error(String(feedResponse.status));
  const feed = (await feedResponse.json()) as FeaturedFeed;
  const wanted = titlesFrom(feed);
  const loaded = await Promise.all(
    wanted.map(async (item) => {
      try {
        const page = await plainExtract(item.title);
        const paragraphs = introParagraphs(page.extract);
        if (articleWordCount(paragraphs) < 45) return null;
        const title = page.title || item.title;
        const article: WikiArticle = {
          title,
          url: wikiPageUrl(title),
          paragraphs,
        };
        if (item.description) article.description = item.description;
        return article;
      } catch {
        return null;
      }
    }),
  );
  const articles = loaded.filter((item): item is WikiArticle => item !== null).slice(0, 6);
  if (articles.length === 0) throw new Error("aucun article lisible");
  return {
    articles,
    fetchedAt: new Date().toISOString(),
  };
}
