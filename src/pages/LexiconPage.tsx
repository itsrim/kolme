import { useMemo, useState } from "react";
import { Picture } from "../components/Picture";
import { LEXICON, LEX_SECTIONS, lexiconCount } from "../data/lexicon";
import { go, type AppRoute } from "../lib/route";
import type { LexSection } from "../types";

function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function LexiconPage({ route }: { route: AppRoute }) {
  const [query, setQuery] = useState("");
  const section = route.lex;
  const needle = fold(query.trim());

  const groups = useMemo(() => {
    return LEXICON.filter((group) => section === "tout" || group.section === section)
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!needle) return true;
          const blob = [item.fi, item.fr, item.note ?? "", item.example?.fi ?? "", item.example?.fr ?? ""].join(" ");
          return fold(blob).includes(needle);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [needle, section]);

  const shown = groups.reduce((sum, group) => sum + group.items.length, 0);

  function open(next: LexSection) {
    go({ ...route, tab: "utile", lex: next }, "replace");
  }

  return (
    <div className="page lex-page">
      <header className="page-head">
        <p className="kicker">
          Arki
          <span>
            {shown} mot{shown > 1 ? "s" : ""}
            {section !== "tout" ? ` sur ${lexiconCount()}` : ""}
          </span>
        </p>
        <h1>Les mots utiles</h1>
        <p className="lede">
          Le vocabulaire qu'on répète chaque jour : salutations, adverbes, adjectifs, petits mots de liaison, et les phrases toutes faites.
        </p>
      </header>

      <label className="search">
        <span className="sr">Chercher un mot ou une expression</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="merci, huomenna, faim, kahvi…"
        />
      </label>

      <div className="chips section-nav" role="tablist" aria-label="Catégories">
        {LEX_SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={section === item.id}
            className={section === item.id ? "chip on" : "chip"}
            onClick={() => open(item.id)}
          >
            {item.fr}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="empty">Rien sous ce filtre.</p>
      ) : (
        <div className="lex-groups">
          {groups.map((group) => (
            <section key={group.id} className="lex-group">
              <h2>{group.title}</h2>
              {group.intro ? <p className="note">{group.intro}</p> : null}
              <ul className="lex-list">
                {group.items.map((item) => (
                  <li key={item.fi} className="lex-item">
                    <Picture id={item.fi || group.id} size={58} />
                    <strong lang="fi">{item.fi}</strong>
                    <span>{item.fr}</span>
                    {item.note ? <small>{item.note}</small> : null}
                    {item.example ? (
                      <p className="example" lang="fi">
                        {item.example.fi}
                        <span lang="fr">{item.example.fr}</span>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
