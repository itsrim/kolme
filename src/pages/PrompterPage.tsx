import { useEffect, useMemo, useRef, useState } from "react";
import { Picture } from "../components/Picture";
import { LEVELS, READINGS, readingById, type Reading } from "../data/readings";
import { align, heardWords, tokenizeParagraphs, type WordStatus } from "../lib/follow";
import { go, type AppRoute } from "../lib/route";
import { useWikiDay } from "../lib/wiki-client";
import type { Level } from "../types";
import { YlePanel } from "./YlePanel";

interface SpeechResult {
  readonly isFinal: boolean;
  readonly [index: number]: { readonly transcript: string };
}

interface SpeechEvent {
  resultIndex: number;
  results: ArrayLike<SpeechResult> & { length: number };
}

interface SpeechRec {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

function recognitionCtor(): (new () => SpeechRec) | null {
  const host = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

function errorText(code: string): string | null {
  if (code === "not-allowed") return "Le micro est bloqué. Autorise-le pour cette page, puis relance.";
  if (code === "audio-capture") return "Aucun micro n'a été trouvé.";
  if (code === "language-not-supported") return "Ce navigateur n'écoute pas le finnois. Tu peux avancer à la main : clique un mot ou appuie sur la flèche droite.";
  if (code === "network") return "La reconnaissance vocale a besoin du réseau.";
  if (code === "no-speech" || code === "aborted") return null;
  return "La reconnaissance s'est arrêtée. Relance le micro.";
}

export function PrompterPage({ route }: { route: AppRoute }) {
  const yleMode = route.textId === "yle";
  const wikiMode = route.textId === "wiki";
  const reading = readingById(yleMode || wikiMode ? undefined : route.textId) ?? READINGS[0];
  const wiki = useWikiDay(wikiMode);
  const article =
    wiki.articles.find((item) => item.title === route.wikiTitle) ??
    wiki.articles.find((item) => item.title.replace(/ /g, "_") === route.wikiTitle);
  const paragraphs = useMemo(() => {
    if (wikiMode) return (article?.paragraphs ?? []).map((fi) => ({ fi, fr: "" }));
    return reading.paragraphs;
  }, [wikiMode, article, reading]);
  const tokens = useMemo(() => tokenizeParagraphs(paragraphs), [paragraphs]);
  const [filter, setFilter] = useState<Level>(reading.level);
  const [status, setStatus] = useState<WordStatus[]>(() => tokens.map(() => "wait"));
  const [cursor, setCursor] = useState(0);
  const [ghost, setGhost] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const cursorRef = useRef(0);
  const tokensRef = useRef(tokens);
  const listeningRef = useRef(false);
  const recognitionRef = useRef<SpeechRec | null>(null);
  const currentRef = useRef<HTMLElement | null>(null);
  const canListen = recognitionCtor() !== null;

  useEffect(() => {
    tokensRef.current = tokens;
  }, [tokens]);

  useEffect(() => {
    if (!wikiMode && !yleMode) setFilter(reading.level);
    setStatus(tokens.map(() => "wait"));
    setCursor(0);
    cursorRef.current = 0;
    setGhost(null);
    setHeard("");
    setNotice(null);
    stopMic();
    // stopMic is stable enough for a reading change; it only touches refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading.id, tokens, wikiMode, yleMode]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    currentRef.current?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }, [cursor, ghost, reading.id, article?.title]);

  useEffect(() => {
    return () => {
      listeningRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  function applyAlign(heardList: string[], commitSkips: boolean) {
    const result = align(tokensRef.current, cursorRef.current, heardList, commitSkips);
    if (!commitSkips) {
      setGhost(result.ok.length > 0 ? result.ok[result.ok.length - 1] : null);
      return;
    }
    if (result.ok.length === 0 && result.miss.length === 0) return;
    cursorRef.current = result.next;
    setCursor(result.next);
    setGhost(null);
    setStatus((current) => {
      const next = current.slice();
      for (const index of result.miss) {
        if (next[index] === "wait") next[index] = "miss";
      }
      for (const index of result.ok) next[index] = "ok";
      return next;
    });
  }

  function markWord(index: number) {
    const from = cursorRef.current;
    cursorRef.current = Math.max(from, index + 1);
    setCursor(cursorRef.current);
    setGhost(null);
    setStatus((current) => {
      const next = current.slice();
      for (let slot = from; slot < index; slot += 1) {
        if (next[slot] === "wait") next[slot] = "miss";
      }
      if (index >= 0 && index < next.length && next[index] !== "ok") next[index] = "ok";
      return next;
    });
  }

  function reset() {
    stopMic();
    cursorRef.current = 0;
    setCursor(0);
    setGhost(null);
    setHeard("");
    setStatus(tokens.map(() => "wait"));
  }

  function stopMic() {
    listeningRef.current = false;
    setListening(false);
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    if (!rec) return;
    rec.onend = null;
    rec.onresult = null;
    rec.onerror = null;
    rec.abort();
  }

  function startMic() {
    const Ctor = recognitionCtor();
    if (!Ctor) {
      setNotice("Ce navigateur n'écoute pas le finnois. Clique un mot, ou avance avec la flèche droite.");
      return;
    }
    stopMic();
    const rec = new Ctor();
    rec.lang = "fi-FI";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finals = "";
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const piece = event.results[index][0].transcript;
        if (event.results[index].isFinal) finals += ` ${piece}`;
        else interim += ` ${piece}`;
      }
      const live = (finals || interim).trim();
      if (live) setHeard(live);
      if (finals.trim()) applyAlign(heardWords(finals), true);
      else if (interim.trim()) applyAlign(heardWords(interim), false);
    };
    rec.onerror = (event) => {
      const message = errorText(event.error);
      if (message) setNotice(message);
      if (event.error === "not-allowed" || event.error === "audio-capture" || event.error === "language-not-supported") {
        listeningRef.current = false;
        setListening(false);
      }
    };
    rec.onend = () => {
      if (!listeningRef.current) return;
      try {
        rec.start();
      } catch {
        listeningRef.current = false;
        setListening(false);
      }
    };
    recognitionRef.current = rec;
    listeningRef.current = true;
    setListening(true);
    setNotice(null);
    try {
      rec.start();
    } catch {
      listeningRef.current = false;
      setListening(false);
      setNotice("Le micro n'a pas pu démarrer. Réessaie dans un instant.");
    }
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const next = Math.min(tokensRef.current.length - 1, cursorRef.current);
        if (next >= 0 && next < tokensRef.current.length) markWord(next);
      }
      if (event.key === "Escape") stopMic();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = READINGS.filter((item) => item.level === filter);
  const activeIndex = ghost ?? Math.min(cursor, Math.max(0, tokens.length - 1));
  const activeParagraph = tokens[Math.min(activeIndex, tokens.length - 1)]?.paragraph ?? 0;
  const okCount = status.filter((item) => item === "ok").length;
  const missCount = status.filter((item) => item === "miss").length;
  const done = cursor >= tokens.length && tokens.length > 0;

  function openReading(item: Reading, hide = route.hideTranslation) {
    go({ ...route, tab: "lecture", textId: item.id, wikiTitle: undefined, hideTranslation: hide }, "replace");
  }

  useEffect(() => {
    if (!wikiMode || route.wikiTitle || wiki.articles.length === 0) return;
    go({ ...route, tab: "lecture", textId: "wiki", wikiTitle: wiki.articles[0].title }, "replace");
  }, [wikiMode, route, wiki.articles]);

  return (
    <div className="page prompter-page">
      <header className="page-head">
        <p className="kicker">
          Luku
          <span>texte suivi, mot après mot</span>
        </p>
        <h1>Le prompteur</h1>
        <p className="lede">
          Lis le texte à voix haute. Les mots reconnus passent au vert, le mot en cours est en or, ceux que tu sautes passent au rouge. La traduction du paragraphe reste à côté. Yle donne les titres du jour. Wiki met l'introduction d'articles du jour dans le prompteur.
        </p>
      </header>

      <div className="chips" role="toolbar" aria-label="Niveaux">
        {LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            className={!yleMode && filter === level.id ? "chip on" : "chip"}
            onClick={() => {
              setFilter(level.id);
              const first = READINGS.find((item) => item.level === level.id);
              if (first && (yleMode || reading.level !== level.id)) openReading(first);
            }}
          >
            {level.id}
            <small>{level.fr}</small>
          </button>
        ))}
        <button
          type="button"
          className={yleMode ? "chip on" : "chip"}
          onClick={() => go({ ...route, tab: "lecture", textId: "yle", wikiTitle: undefined }, "replace")}
        >
          Yle
          <small>Titres</small>
        </button>
        <button
          type="button"
          className={wikiMode ? "chip on" : "chip"}
          onClick={() => go({ ...route, tab: "lecture", textId: "wiki", wikiTitle: undefined }, "replace")}
        >
          Wiki
          <small>Du jour</small>
        </button>
      </div>
      {yleMode ? (
        <YlePanel />
      ) : wikiMode ? (
        <>
          <p className="note">
            L'introduction des articles du jour sur Wikipédia en finnois. Le texte change avec l'actualité et les pages les plus lues. Il est sous licence CC BY-SA : le lien mène à l'article et à ses auteurs.
          </p>
          {wiki.loading && <p className="note">Chargement des articles…</p>}
          {wiki.error && <p className="note warn">{wiki.error}</p>}
          <ul className="text-list">
            {wiki.articles.map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  className={item.title === article?.title ? "verb-item on" : "verb-item"}
                  onClick={() => go({ ...route, tab: "lecture", textId: "wiki", wikiTitle: item.title }, "replace")}
                >
                  <Picture scene="book" size={42} />
                  <span className="verb-copy">
                    <span className="verb-label" lang="fi">
                      {item.title}
                    </span>
                    <small>{item.description ?? "Wikipédia"}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
      <p className="note">{LEVELS.find((level) => level.id === filter)?.hint}</p>

      <ul className="text-list">
        {visible.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={item.id === reading.id ? "verb-item on" : "verb-item"}
              onClick={() => openReading(item)}
            >
              <Picture id={item.id} size={48} />
              <span className="verb-copy">
                <span className="verb-label" lang="fi">
                  {item.fiTitle}
                </span>
                <small>
                  {item.title} · {item.minutes} min
                </small>
              </span>
            </button>
          </li>
        ))}
      </ul>
        </>
      )}

      {!yleMode && (!wikiMode || article) && (
      <section className="stage" aria-label={article?.title ?? reading.title}>
        <header className="stage-head">
          <div className="stage-title">
            <Picture id={article ? "book" : reading.id} scene={article ? "book" : undefined} size={76} />
            <div>
            <p className="kicker">
              {article ? "Wiki" : reading.level}
              <span lang="fi">{article?.title ?? reading.fiTitle}</span>
            </p>
            <h2>{article ? article.title : reading.title}</h2>
            </div>
          </div>
          <p className="score">
            <strong>{okCount}</strong> justes
            <span>{missCount} sautés</span>
            <span>
              {Math.min(cursor, tokens.length)}/{tokens.length}
            </span>
          </p>
        </header>
        <p className="note">
          {article
            ? "Lis l'introduction à voix haute. Le français n'est pas préparé pour ces articles : le texte suit les mots finnois."
            : reading.intro}
        </p>
        <div className="legend" aria-hidden="true">
          <span className="w now">en cours</span>
          <span className="w ok">reconnu</span>
          <span className="w miss">sauté</span>
          <span className="w">à lire</span>
        </div>

        <div className={`prompter scale-${scale}`}>
          {paragraphs.map((paragraph, paragraphIndex) => {
            const slice = tokens.filter((token) => token.paragraph === paragraphIndex);
            const start = tokens.findIndex((token) => token.paragraph === paragraphIndex);
            return (
              <article key={paragraph.fi.slice(0, 24)} className={paragraphIndex === activeParagraph ? "text-pair on" : "text-pair"}>
                <p className="fi-col" lang="fi">
                  {slice.map((token, localIndex) => {
                    const index = start + localIndex;
                    const state = status[index] ?? "wait";
                    const current = index === activeIndex && state === "wait";
                    return (
                      <span
                        key={token.key}
                        ref={current ? currentRef : undefined}
                        className={current ? "w now" : `w ${state}`}
                        aria-current={current ? "true" : undefined}
                        onClick={() => markWord(index)}
                      >
                        {token.text}{" "}
                      </span>
                    );
                  })}
                </p>
                {!route.hideTranslation && paragraph.fr ? <p className="fr-col">{paragraph.fr}</p> : null}
              </article>
            );
          })}
        </div>

        {done && (
          <p className="result">
            {missCount === 0
              ? "Tout le texte a été reconnu."
              : `${okCount} mots reconnus, ${missCount} sautés. Les mots rouges sont ceux que le micro n'a pas entendus.`}
          </p>
        )}
        {heard && (
          <p className="heard">
            Entendu <span lang="fi">{heard}</span>
          </p>
        )}
        {notice && <p className="note warn">{notice}</p>}

        <div className="controls">
          <button type="button" className={listening ? "ghost on" : "cta slim"} onClick={() => (listening ? stopMic() : startMic())}>
            {listening ? "Arrêter le micro" : canListen ? "Lire à voix haute" : "Micro indisponible"}
          </button>
          <button type="button" className="ghost" onClick={reset}>
            Recommencer
          </button>
          <div className="chips">
            {[0, 1, 2].map((value) => (
              <button
                key={value}
                type="button"
                className={scale === value ? "chip on" : "chip"}
                onClick={() => setScale(value)}
                aria-label={`Taille ${value + 1}`}
              >
                A
              </button>
            ))}
          </div>
          {!article && (
            <button
              type="button"
              className={route.hideTranslation ? "ghost on" : "ghost"}
              aria-pressed={route.hideTranslation}
              onClick={() => openReading(reading, !route.hideTranslation)}
            >
              {route.hideTranslation ? "Montrer le français" : "Cacher le français"}
            </button>
          )}
        </div>
        {article && (
          <p className="note">
            Introduction de{" "}
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>{" "}
            sur Wikipédia en finnois, par les contributeurs de la page. Licence{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" target="_blank" rel="noopener noreferrer">
              CC BY-SA 4.0
            </a>
            .
          </p>
        )}
        <p className="note">
          Chrome et Edge écoutent le finnois. La flèche droite marque le mot en cours si tu veux avancer sans micro. La reconnaissance vocale utilise le service du navigateur.
        </p>
      </section>
      )}
    </div>
  );
}
