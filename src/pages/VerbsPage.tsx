import { useMemo, useState } from "react";
import { Picture } from "../components/Picture";
import { VERBS, VERB_TYPES, verbById } from "../data/verbs";
import { TENSES, paradigm } from "../lib/conjugate";
import { go, type AppRoute } from "../lib/route";
import type { Polarity, TenseId, VerbType } from "../types";

function fold(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function VerbsPage({ route }: { route: AppRoute }) {
  const [query, setQuery] = useState("");
  const tense: TenseId = route.tense ?? "present";
  const polarity: Polarity = route.polarity ?? "pos";
  const tenseMeta = TENSES.find((item) => item.id === tense) ?? TENSES[0];

  const filtered = useMemo(() => {
    const needle = fold(query.trim());
    return VERBS.filter((verb) => {
      if (route.verbType && verb.type !== route.verbType) return false;
      if (!needle) return true;
      return fold(verb.infinitive).includes(needle) || fold(verb.fr).includes(needle);
    });
  }, [query, route.verbType]);

  const verb = verbById(route.verbId) ?? filtered[0] ?? VERBS[0];
  const typeInfo = VERB_TYPES.find((item) => item.type === verb.type);
  const rows = paradigm(verb, tense, polarity);

  function selectVerb(id: string) {
    go({ ...route, tab: "verbes", verbId: id, verbType: undefined }, "replace");
  }

  function selectType(type: VerbType) {
    const next = route.verbType === type ? undefined : type;
    go({ ...route, tab: "verbes", verbId: undefined, verbType: next }, "replace");
  }

  function selectTense(next: TenseId) {
    go({ ...route, tab: "verbes", verbId: verb.id, tense: next, polarity }, "replace");
  }

  function selectPolarity(next: Polarity) {
    go({ ...route, tab: "verbes", verbId: verb.id, tense, polarity: next }, "replace");
  }

  return (
    <div className="page verbs-page">
      <header className="page-head">
        <p className="kicker">
          Verbit
          <span>futur, passé composé, et les autres temps</span>
        </p>
        <h1>Les verbes</h1>
        <p className="lede">
          Trente verbes du finnois standard. Le passé composé et le plus-que-parfait se construisent avec olla et le participe. Le futur passe par aikoa.
        </p>
      </header>

      <div className="verbs">
        <div className="verb-side">
          <label className="search">
            <span className="sr">Chercher un verbe</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="parler, syödä, vouloir…"
            />
          </label>
          <div className="chips" role="toolbar" aria-label="Types">
            {VERB_TYPES.map((item) => (
              <button
                key={item.type}
                type="button"
                className={route.verbType === item.type ? "chip on" : "chip"}
                onClick={() => selectType(item.type)}
              >
                {item.type}
                <small>{item.mark}</small>
              </button>
            ))}
          </div>
          <ul className="verb-list">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={item.id === verb.id ? "verb-item on" : "verb-item"}
                  onClick={() => selectVerb(item.id)}
                >
                  <Picture id={item.infinitive} size={42} />
                  <span className="verb-copy">
                    <span className="verb-label" lang="fi">
                      {item.infinitive}
                    </span>
                    <small>{item.fr}</small>
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="empty">Aucun verbe pour cette recherche.</li>}
          </ul>
        </div>

        <article className="paradigm">
          <header className="verb-title">
            <Picture id={verb.infinitive} size={92} />
            <div className="verb-copy">
            <p className="kicker">
              Type {verb.type}
              <span>{typeInfo?.mark}</span>
            </p>
            <h2 lang="fi">{verb.infinitive}</h2>
            <p className="lede">{verb.fr}</p>
            <div className="verb-flags">
              {verb.gradation && <span>Alternance {verb.gradation}</span>}
              <span>
                Participe <b lang="fi">{verb.participle.sg}</b> / <b lang="fi">{verb.participle.pl}</b>
              </span>
            </div>
            {verb.note && <p className="note">{verb.note}</p>}
            {typeInfo && <p className="rule">{typeInfo.rule}</p>}
            </div>
          </header>

          <div className="tense-bar" role="tablist" aria-label="Temps et modes">
            {TENSES.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === tense}
                className={item.id === tense ? "chip on" : "chip"}
                onClick={() => selectTense(item.id)}
              >
                {item.fr}
              </button>
            ))}
          </div>
          <div className="polarity">
            <button type="button" className={polarity === "pos" ? "chip on" : "chip"} onClick={() => selectPolarity("pos")}>
              Affirmatif
            </button>
            <button type="button" className={polarity === "neg" ? "chip on" : "chip"} onClick={() => selectPolarity("neg")}>
              Négatif
            </button>
            <p>{tenseMeta.hint}</p>
          </div>
          {tense === "future" && (
            <p className="note">
              Avec un moment, le présent suffit : <b lang="fi">{verb.present[0]} huomenna</b>.
            </p>
          )}

          <table className="grid">
            <thead>
              <tr>
                <th>Personne</th>
                <th lang="fi">{tenseMeta.fi}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.fi}>
                  <th>
                    <span lang="fi">{row.fi}</span>
                    <small>{row.fr}</small>
                  </th>
                  <td lang="fi">{row.form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </div>
  );
}
