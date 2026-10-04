import type { ReactNode } from "react";
import { useProgress } from "../progress-context";
import { go, type AppRoute, type TabId } from "../lib/route";

const TABS: { id: TabId; fr: string; fi: string }[] = [
  { id: "parcours", fr: "Parcours", fi: "Polku" },
  { id: "verbes", fr: "Verbes", fi: "Verbit" },
  { id: "mots", fr: "Mots", fi: "Sanat" },
  { id: "utile", fr: "Utile", fi: "Arki" },
  { id: "lecture", fr: "Lecture", fi: "Luku" },
];

export function Shell({ route, children }: { route: AppRoute; children: ReactNode }) {
  const { day, level, streak } = useProgress();

  return (
    <div className="app">
      <aside className="nav">
        <a className="brand" href="#/parcours">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>Kolme</strong>
            <small>kolme kuukautta</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={`#/${tab.id}`}
              className={route.tab === tab.id ? "nav-link on" : "nav-link"}
              aria-current={route.tab === tab.id ? "page" : undefined}
            >
              <span>{tab.fr}</span>
              <small lang="fi">{tab.fi}</small>
            </a>
          ))}
        </nav>
        <div className="nav-meta">
          <p>
            <span>Jour</span>
            <strong>{day ?? "—"}</strong>
            <span>/ 90</span>
          </p>
          <p>
            <span>{level}</span>
            <span className="dot" aria-hidden="true" />
            <span>{streak} j</span>
          </p>
        </div>
      </aside>
      <div className="workspace">
        <a className="mobile-brand" href="#/parcours">
          Kolme
        </a>
        <main id="contenu">{children}</main>
      </div>
      <nav className="tabbar" aria-label="Sections">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={`#/${tab.id}`}
            className={route.tab === tab.id ? "on" : ""}
            aria-current={route.tab === tab.id ? "page" : undefined}
            onClick={(event) => {
              if (route.tab === tab.id) {
                event.preventDefault();
                go(
                  { ...route, tab: tab.id, focus: undefined, verbId: undefined, textId: undefined, wikiTitle: undefined, lex: "tout" },
                  "replace",
                );
              }
            }}
          >
            <span lang="fi">{tab.fi}</span>
            {tab.fr}
          </a>
        ))}
      </nav>
    </div>
  );
}
