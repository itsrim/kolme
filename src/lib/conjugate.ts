import type { Polarity, TenseId, Verb } from "../types";

export const PERSONS: { fi: string; fr: string }[] = [
  { fi: "minä", fr: "je" },
  { fi: "sinä", fr: "tu" },
  { fi: "hän", fr: "il / elle" },
  { fi: "me", fr: "nous" },
  { fi: "te", fr: "vous" },
  { fi: "he", fr: "ils / elles" },
];

const NEGATION = ["en", "et", "ei", "emme", "ette", "eivät"] as const;
const OLLA_PRESENT = ["olen", "olet", "on", "olemme", "olette", "ovat"] as const;
const OLLA_IMPERFECT = ["olin", "olit", "oli", "olimme", "olitte", "olivat"] as const;
const AION = ["aion", "aiot", "aikoo", "aiomme", "aiotte", "aikovat"] as const;

export const TENSES: { id: TenseId; fi: string; fr: string; hint: string }[] = [
  {
    id: "present",
    fi: "preesens",
    fr: "Présent",
    hint: "Ce qui a lieu maintenant, une habitude, ou un futur daté : huomenna menen.",
  },
  {
    id: "future",
    fi: "aikoa + infinitif",
    fr: "Futur",
    hint: "Pas de désinence de futur. aikoa + infinitif dit « je vais, j'ai l'intention de ». Le présent suffit dès qu'un moment est nommé.",
  },
  {
    id: "imperfect",
    fi: "imperfekti",
    fr: "Imparfait",
    hint: "Le temps du récit. Une action passée, située, terminée.",
  },
  {
    id: "perfect",
    fi: "perfekti",
    fr: "Passé composé",
    hint: "Le passé composé : j'ai parlé. En finnois, perfekti = olen + participe.",
  },
  {
    id: "pluperfect",
    fi: "pluskvamperfekti",
    fr: "Plus-que-parfait",
    hint: "olin + participe. Une action antérieure à une autre action passée.",
  },
  {
    id: "conditional",
    fi: "konditionaali",
    fr: "Conditionnel",
    hint: "La marque est -isi-. Hypothèse, souhait, politesse : puhuisitko?",
  },
  {
    id: "imperative",
    fi: "imperatiivi",
    fr: "Impératif",
    hint: "Ordre ou conseil. Pas de forme pour minä. Le négatif passe par älä, älköön, älkää.",
  },
];

function participle(verb: Verb, index: number): string {
  return index >= 3 ? verb.participle.pl : verb.participle.sg;
}

export function formAt(verb: Verb, tense: TenseId, polarity: Polarity, index: number): string {
  if (tense === "imperative") {
    if (index === 0) return "—";
    const slot = index - 1;
    return polarity === "pos" ? verb.imperative[slot] : verb.imperativeNegative[slot];
  }

  if (polarity === "neg") {
    const negation = NEGATION[index];
    if (tense === "present") return `${negation} ${verb.negative}`;
    if (tense === "imperfect") return `${negation} ${participle(verb, index)}`;
    if (tense === "perfect") return `${negation} ole ${participle(verb, index)}`;
    if (tense === "pluperfect") {
      const been = index >= 3 ? "olleet" : "ollut";
      return `${negation} ${been} ${participle(verb, index)}`;
    }
    if (tense === "future") return `${negation} aio ${verb.infinitive}`;
    return `${negation} ${verb.conditional[2]}`;
  }

  if (tense === "future") return `${AION[index]} ${verb.infinitive}`;

  if (tense === "present") return verb.present[index];
  if (tense === "imperfect") return verb.imperfect[index];
  if (tense === "conditional") return verb.conditional[index];
  if (tense === "perfect") return `${OLLA_PRESENT[index]} ${participle(verb, index)}`;
  return `${OLLA_IMPERFECT[index]} ${participle(verb, index)}`;
}

export interface ParadigmRow {
  fi: string;
  fr: string;
  form: string;
}

export function paradigm(verb: Verb, tense: TenseId, polarity: Polarity): ParadigmRow[] {
  return PERSONS.map((person, index) => ({
    fi: person.fi,
    fr: person.fr,
    form: formAt(verb, tense, polarity, index),
  }));
}
