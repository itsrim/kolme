import { useEffect, useState } from "react";
import type { WikiArticle } from "../server/wiki";

interface WikiPayload {
  articles: WikiArticle[];
  fetchedAt: string;
}

export function useWikiDay(enabled: boolean) {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancel = false;
    setLoading(true);
    setError(null);
    fetch("/api/wiki")
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        return (await response.json()) as WikiPayload;
      })
      .then((payload) => {
        if (cancel) return;
        if (!payload.articles?.length) throw new Error("vide");
        setArticles(payload.articles);
      })
      .catch(() => {
        if (cancel) return;
        setArticles([]);
        setError("Les articles du jour n'ont pas pu être chargés. Relance l'application avec npm run dev, puis réessaie.");
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [enabled]);

  return { articles, loading, error };
}
