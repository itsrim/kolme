import { useEffect, useState } from "react";
import { Picture } from "../components/Picture";
import {
  CASES,
  CLITICS,
  FUSED_CLITICS,
  GRADATION,
  NOUNS,
  ORDER_EXAMPLES,
  POSSESSIVES,
  caseById,
} from "../data/grammar";
import { assemble } from "../lib/agglutinate";
import { go, type AppRoute } from "../lib/route";
import type { CaseId, CliticId, PossId, WordSection } from "../types";

const SECTIONS: { id: WordSection; fr: string }[] = [
  { id: "assembleur", fr: "Assembleur" },
  { id: "cas", fr: "Les 15 cas" },
  { id: "particules", fr: "Particules" },
  { id: "radicaux", fr: "Radicaux" },
];

const CASE_IDS = new Set(CASES.map((item) => item.id));

export function WordsPage({ route }: { route: AppRoute }) {
  const [nounId, setNounId] = useState(NOUNS[0].id);
  const [caseId, setCaseId] = useState<CaseId>("ine");
  const [poss, setPoss] = useState<PossId>("ni");
  const [clitic, setClitic] = useState<CliticId>("kin");
  const [number, setNumber] = useState<"sg" | "pl">("sg");

  const noun = NOUNS.find((item) => item.id === nounId) ?? NOUNS[0];
  const built = assemble(noun, caseId, poss, clitic);

  useEffect(() => {
    if (!route.focus) return;
    document.getElementById(`focus-${route.focus}`)?.scrollIntoView({ block: "start" });
  }, [route.focus, route.section]);

  function open(section: WordSection, focus?: string) {
    go({ ...route, tab: "mots", section, focus }, "replace");
  }

  return (
    <div className="page words-page">
      <header className="page-head">
        <p className="kicker">
          Sanat
          <span>radical + cas + possessif + particule</span>
        </p>
        <h1>Les mots qui se collent</h1>
        <p className="lede">
          Le finnois n'ajoute pas des petits mots devant. Il colle le sens à la fin : le lieu, le possesseur, la question.
        </p>
      </header>

      <div className="chips section-nav" role="tablist" aria-label="Chapitres">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={route.section === section.id}
            className={route.section === section.id ? "chip on" : "chip"}
            onClick={() => open(section.id)}
          >
            {section.fr}
          </button>
        ))}
      </div>

      {route.section === "assembleur" && (
        <section className="assembler">
          <div className="choice">
            <p>Mot</p>
            <div className="chips">
              {NOUNS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === noun.id ? "chip on" : "chip"}
                  onClick={() => setNounId(item.id)}
                >
                  <Picture id={item.fi} size={40} />
                  <span lang="fi">{item.fi}</span>
                  <small>{item.fr}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="choice">
            <p>Cas</p>
            <div className="chips">
              {CASES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === caseId ? "chip on" : "chip"}
                  onClick={() => setCaseId(item.id)}
                >
                  {item.fr}
                  <small>{item.endings}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="choice">
            <p>Possessif</p>
            <div className="chips">
              {POSSESSIVES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === poss ? "chip on" : "chip"}
                  onClick={() => setPoss(item.id)}
                >
                  {item.label}
                  <small>{item.fr}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="choice">
            <p>Particule</p>
            <div className="chips">
              {CLITICS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === clitic ? "chip on" : "chip"}
                  onClick={() => setClitic(item.id)}
                >
                  {item.label || "—"}
                  <small>{item.fr}</small>
                </button>
              ))}
            </div>
          </div>

          <article className="assembly">
            <p className="kicker">
              Forme
              <span>{built.complete ? noun.stemNote : "forme incomplète"}</span>
            </p>
            <h2 lang="fi">{built.form}</h2>
            <p className="gloss">{built.gloss}</p>
            <ul className="pieces">
              {built.chips.map((chip) => (
                <li key={chip.label}>
                  <span>{chip.label}</span>
                  <strong lang="fi">{chip.value}</strong>
                </li>
              ))}
            </ul>
            {built.notes.length > 0 && (
              <ul className="notes">
                {built.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </article>

          <div className="paradigm-block">
            <div className="plan-head">
              <h3 lang="fi">{noun.fi}</h3>
              <div className="chips">
                <button type="button" className={number === "sg" ? "chip on" : "chip"} onClick={() => setNumber("sg")}>
                  Singulier
                </button>
                <button type="button" className={number === "pl" ? "chip on" : "chip"} onClick={() => setNumber("pl")}>
                  Pluriel
                </button>
              </div>
            </div>
            <p className="note">
              {number === "sg"
                ? "Le collage au-dessus modifie le singulier. Le tableau montre le mot sans possessif."
                : "Le pluriel a son propre radical. Les possessifs du tableau interactif restent au singulier."}
            </p>
            <table className="grid compact">
              <tbody>
                {(number === "sg" ? CASES : CASES).map((item) => {
                  const form = noun[number === "sg" ? "singular" : "plural"][item.id];
                  return (
                    <tr key={item.id} className={item.id === caseId ? "on" : ""}>
                      <th>
                        {item.fr}
                        <small>{item.endings}</small>
                      </th>
                      <td lang="fi">{number === "sg" && item.id === "com" ? `${form}-` : form}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {route.section === "cas" && (
        <section className="catalog">
          {CASES.map((item) => (
            <article key={item.id} id={`focus-${item.id}`} className={route.focus === item.id ? "case-card on" : "case-card"}>
              <header className="case-head">
                <Picture id={item.example.fi} size={56} />
                <div>
                  <p className="kicker">
                    <span lang="fi">{item.fi}</span>
                    <span lang="fi">{item.question}</span>
                  </p>
                  <h2>{item.fr}</h2>
                  <p className="ending" lang="fi">
                    {item.endings}
                  </p>
                </div>
              </header>
              <p>{item.use}</p>
              <p className="example" lang="fi">
                {item.example.fi}
                <span>{item.example.fr}</span>
              </p>
              <button type="button" className="textish" onClick={() => {
                if (CASE_IDS.has(item.id)) setCaseId(item.id);
                open("assembleur");
              }}>
                Coller ce cas dans l'assembleur
              </button>
            </article>
          ))}
        </section>
      )}

      {route.section === "particules" && (
        <section className="catalog">
          <article className="case-card">
            <h2>L'ordre</h2>
            <p>Sur un nom, les pièces se suivent toujours dans le même sens. La particule est la dernière.</p>
            <ul className="order-list">
              {ORDER_EXAMPLES.map((example) => (
                <li key={example.form}>
                  <span className="pieces inline">
                    {example.parts.map((part) => (
                      <b key={part} lang="fi">{part}</b>
                    ))}
                  </span>
                  <strong lang="fi">{example.form}</strong>
                  <em>{example.fr}</em>
                </li>
              ))}
            </ul>
          </article>
          {CLITICS.filter((item) => item.id !== "none").map((item) => (
            <article key={item.id} id={`focus-${item.id}`} className={route.focus === item.id ? "case-card on" : "case-card"}>
              <header>
                <p className="kicker">
                  liitepartikkeli
                  <span>{item.fr}</span>
                </p>
                <h2 lang="fi">{item.fi}</h2>
              </header>
              <p>{item.use}</p>
              <dl className="examples">
                {item.examples.map((example) => (
                  <div key={example.fi}>
                    <dt lang="fi">{example.fi}</dt>
                    <dd>{example.fr}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
          <article className="case-card">
            <h2>Fusions fréquentes</h2>
            <p>À l'oral, deux particules se soudent. Ce ne sont pas des cas nouveaux.</p>
            <ul className="order-list">
              {FUSED_CLITICS.map((item) => (
                <li key={item.form}>
                  <strong lang="fi">{item.form}</strong>
                  <em>{item.fr}</em>
                  <span lang="fi">{item.example}</span>
                  <em>{item.gloss}</em>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}

      {route.section === "radicaux" && (
        <section className="catalog">
          <article className="case-card" id="focus-harmonie">
            <h2>Harmonie vocalique</h2>
            <p>
              a, o, u appellent -ssa, -ko, -han, -pa, -kaan. ä, ö, y appellent -ssä, -kö, -hän, -pä, -kään. e et i sont neutres. Un mot qui ne contient qu'eux, comme kieli ou vesi, prend les désinences avant.
            </p>
            <p className="example">
              <span lang="fi">talossa / ystävässä</span>
              <span>la maison, dedans / l'ami, dedans</span>
            </p>
          </article>
          <article className="case-card">
            <h2>Alternance consonantique</h2>
            <p>
              Si la syllabe suivante est fermée — elle finit par une consonne — la consonne à la jointure passe au degré faible. tyttö reste fort, tytön devient faible à cause du -n.
            </p>
            <table className="grid compact">
              <thead>
                <tr>
                  <th>Fort</th>
                  <th>Faible</th>
                  <th>Exemple</th>
                </tr>
              </thead>
              <tbody>
                {GRADATION.map((row) => (
                  <tr key={row.strong + row.weak}>
                    <td lang="fi">{row.strong}</td>
                    <td lang="fi">{row.weak}</td>
                    <td lang="fi">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          {NOUNS.map((item) => (
            <article key={item.id} className="case-card">
              <header>
                <p className="kicker">
                  <span lang="fi">{item.fi}</span>
                  <span>{item.fr}</span>
                </p>
                <h2 lang="fi">{item.vowelStem}-</h2>
              </header>
              <p>{item.stemNote}</p>
              <p className="example">
                <span lang="fi">
                  {item.singular.nom} → {item.singular.gen} → {item.singular.ine} → {item.singular.ill}
                </span>
                <span>nominatif, génitif, inessif, illatif</span>
              </p>
            </article>
          ))}
          <p className="note">
            Le cas illustré ici est {caseById("ine").fr.toLowerCase()}, {caseById("ine").endings}. Le même radical reçoit les quatorze autres désinences.
          </p>
        </section>
      )}
    </div>
  );
}
