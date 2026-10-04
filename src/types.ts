export type VerbType = 1 | 2 | 3 | 4 | 5 | 6;
export type Harmony = "back" | "front";
export type Six = [string, string, string, string, string, string];
export type Five = [string, string, string, string, string];
export type Polarity = "pos" | "neg";
export type TenseId =
  | "present"
  | "future"
  | "imperfect"
  | "perfect"
  | "pluperfect"
  | "conditional"
  | "imperative";

export interface Verb {
  id: string;
  infinitive: string;
  fr: string;
  type: VerbType;
  harmony: Harmony;
  gradation?: string;
  note?: string;
  present: Six;
  imperfect: Six;
  conditional: Six;
  /** sinä, hän, me, te, he */
  imperative: Five;
  imperativeNegative: Five;
  /** radical après en / et / ei */
  negative: string;
  participle: { sg: string; pl: string };
}

export type CaseId =
  | "nom"
  | "gen"
  | "par"
  | "ine"
  | "ela"
  | "ill"
  | "ade"
  | "abl"
  | "all"
  | "ess"
  | "tra"
  | "abe"
  | "com"
  | "ins";

export type PossId = "none" | "ni" | "si" | "nsa" | "mme" | "nne";
export type CliticId = "none" | "ko" | "kin" | "kaan" | "han" | "pa" | "s";
export type Level = "A1" | "A2" | "B1" | "B2";
export type WordSection = "assembleur" | "cas" | "particules" | "radicaux";
export type LexSection = "tout" | "quotidien" | "adverbes" | "adjectifs" | "autres" | "expressions";

export interface LessonLink {
  label: string;
  hash: string;
}

export interface Lesson {
  id: string;
  week: number;
  title: string;
  minutes: number;
  points: string[];
  examples?: { fi: string; fr: string }[];
  link?: LessonLink;
}

export interface WeekPlan {
  week: number;
  level: "A1" | "A2" | "B1";
  title: string;
  goal: string;
}
