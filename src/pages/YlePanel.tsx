import { useCallback, useEffect, useState } from "react";
import { Picture } from "../components/Picture";
import type { YleItem } from "../server/yle-rss";

interface YlePayload {
  selko: YleItem[];
  news: YleItem[];
  fetchedAt: string;
}

function formatWhen(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function ArticleList({ items }: { items: YleItem[] }) {
  return (
    <ul className="yle-list">
      {items.map((item) => (
        <li key={item.link}>
          <a className="yle-item" href={item.link} target="_blank" rel="noopener noreferrer">
            <Picture id={item.category ?? item.title} size={52} />
            <span lang="fi">{item.title}</span>
            <small>
              {formatWhen(item.published)}
              {item.category ? ` · ${item.category}` : ""} · yle.fi
            </small>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function YlePanel() {
  const [data, setData] = useState<YlePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/yle");
      if (!response.ok) throw new Error(String(response.status));
      const payload = (await response.json()) as YlePayload;
      if (!payload.news?.length && !payload.selko?.length) throw new Error("vide");
      setData(payload);
    } catch {
      setData(null);
      setError("Les titres Yle n'ont pas pu être chargés. Relance l'application avec npm run dev, puis réessaie.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <section className="stage yle-block" aria-label="Articles Yle">
      <header className="stage-head">
        <div>
          <p className="kicker">
            Yle
            <span>titres du jour</span>
          </p>
          <h2>Articles récents</h2>
        </div>
        <button type="button" className="ghost" onClick={() => void load()} disabled={loading}>
          {loading ? "Chargement…" : "Actualiser"}
        </button>
      </header>
      <p className="note">
        Deux flux : le finnois facile des selkouutiset, puis les dernières dépêches. Yle ne permet d'afficher que le titre. Le lien ouvre l'article sur yle.fi.
      </p>
      {error && <p className="note warn">{error}</p>}
      {data && (
        <>
          <h3>Selkouutiset</h3>
          <p className="note">Le journal en finnois facile, écrit pour être lu sans dictionnaire.</p>
          <ArticleList items={data.selko} />
          <h3>Tuoreimmat</h3>
          <p className="note">Les dernières dépêches, en finnois standard.</p>
          <ArticleList items={data.news} />
          <p className="note">Mis à jour {formatWhen(data.fetchedAt)}. Source : flux RSS de Yle.</p>
        </>
      )}
    </section>
  );
}
