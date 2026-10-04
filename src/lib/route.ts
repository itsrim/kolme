import type { LexSection, Polarity, TenseId, VerbType, WordSection } from "../types";

export type TabId = "parcours" | "verbes" | "mots" | "utile" | "lecture";

export interface AppRoute {
  tab: TabId;
  verbId?: string;
  verbType?: VerbType;
  tense?: TenseId;
  polarity?: Polarity;
  section: WordSection;
  lex: LexSection;
  focus?: string;
  textId?: string;
  wikiTitle?: string;
  hideTranslation: boolean;
}

const TABS: TabId[] = ["parcours", "verbes", "mots", "utile", "lecture"];
const LEX: LexSection[] = ["tout", "quotidien", "adverbes", "adjectifs", "autres", "expressions"];
const TENSES: TenseId[] = ["present", "future", "imperfect", "perfect", "pluperfect", "conditional", "imperative"];
const SECTIONS: WordSection[] = ["assembleur", "cas", "particules", "radicaux"];

function isTab(value: string): value is TabId {
  return TABS.includes(value as TabId);
}

export function parseHash(hash: string): AppRoute {
  const cleaned = hash.replace(/^#/, "");
  const [pathPart, queryPart] = cleaned.split("?");
  const parts = pathPart.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  const params = new URLSearchParams(queryPart ?? "");
  const head = parts[0] ?? "parcours";
  const tab: TabId = isTab(head) ? head : "parcours";
  const typeRaw = Number(params.get("type"));
  const tenseRaw = params.get("temps");
  const sectionRaw = parts[1];

  return {
    tab,
    verbId: tab === "verbes" ? parts[1] : undefined,
    verbType: typeRaw >= 1 && typeRaw <= 6 ? (typeRaw as VerbType) : undefined,
    tense: TENSES.includes(tenseRaw as TenseId) ? (tenseRaw as TenseId) : undefined,
    polarity: params.get("pol") === "neg" ? "neg" : undefined,
    section:
      tab === "mots" && SECTIONS.includes(sectionRaw as WordSection)
        ? (sectionRaw as WordSection)
        : "assembleur",
    lex: tab === "utile" && LEX.includes(sectionRaw as LexSection) ? (sectionRaw as LexSection) : "tout",
    focus: tab === "mots" ? parts[2] : undefined,
    textId: tab === "lecture" ? parts[1] : undefined,
    wikiTitle: tab === "lecture" && parts[1] === "wiki" ? parts[2] : undefined,
    hideTranslation: params.get("cacher") === "1",
  };
}

export function buildHash(route: AppRoute): string {
  const params = new URLSearchParams();
  if (route.tab === "verbes" && route.verbType && !route.verbId) params.set("type", String(route.verbType));
  if (route.tab === "verbes" && route.tense && route.tense !== "present") params.set("temps", route.tense);
  if (route.tab === "verbes" && route.polarity === "neg") params.set("pol", "neg");
  if (route.tab === "lecture" && route.hideTranslation) params.set("cacher", "1");

  let path = `/${route.tab}`;
  if (route.tab === "verbes" && route.verbId) path += `/${encodeURIComponent(route.verbId)}`;
  if (route.tab === "utile" && route.lex !== "tout") path += `/${route.lex}`;
  if (route.tab === "mots" && route.section !== "assembleur") path += `/${route.section}`;
  if (route.tab === "mots" && route.focus) path += `/${route.focus}`;
  if (route.tab === "lecture" && route.textId) path += `/${route.textId}`;
  if (route.tab === "lecture" && route.textId === "wiki" && route.wikiTitle) {
    path += `/${encodeURIComponent(route.wikiTitle)}`;
  }

  const query = params.toString();
  return `#${path}${query ? `?${query}` : ""}`;
}

export function go(route: AppRoute, mode: "push" | "replace" = "push"): void {
  const next = buildHash(route);
  if (window.location.hash === next) return;
  if (mode === "push") {
    window.location.hash = next;
    return;
  }
  history.replaceState(null, "", next);
  window.dispatchEvent(new Event("hashchange"));
}
