import { CASES, type Noun } from "../data/grammar";
import type { CaseId, CliticId, PossId } from "../types";

const VOWELS = new Set(["a", "ä", "e", "i", "o", "ö", "u", "y"]);

export interface Assembly {
  form: string;
  complete: boolean;
  gloss: string;
  notes: string[];
  chips: { label: string; value: string }[];
}

function possSuffix(poss: PossId): string {
  if (poss === "ni" || poss === "si" || poss === "mme" || poss === "nne") return poss;
  return "";
}

function nsa(noun: Noun): string {
  return noun.harmony === "front" ? "nsä" : "nsa";
}

function isLongVowelEnding(form: string): boolean {
  if (form.length < 2) return false;
  const last = form[form.length - 1];
  return last === form[form.length - 2] && VOWELS.has(last);
}

function cliticText(noun: Noun, clitic: CliticId): string {
  const front = noun.harmony === "front";
  if (clitic === "ko") return front ? "kö" : "ko";
  if (clitic === "kaan") return front ? "kään" : "kaan";
  if (clitic === "han") return front ? "hän" : "han";
  if (clitic === "pa") return front ? "pä" : "pa";
  if (clitic === "kin") return "kin";
  if (clitic === "s") return "s";
  return "";
}

function glossOf(noun: Noun, caseId: CaseId, poss: PossId, clitic: CliticId, complete: boolean): string {
  const owned = noun.owned[poss];
  const templates: Record<CaseId, string> = {
    nom: owned,
    gen: `de ${owned}`,
    par: `${owned}, au partitif`,
    ine: `dans ${owned}`,
    ela: `depuis l'intérieur de ${owned}`,
    ill: `vers l'intérieur de ${owned}`,
    ade: `sur ${owned}, ou chez ${owned}`,
    abl: `depuis ${owned}`,
    all: `vers ${owned}`,
    ess: `en tant que ${owned}`,
    tra: `pour devenir ${owned}`,
    abe: `sans ${owned}`,
    com: complete ? `avec ${owned}` : `avec ${noun.owned.none} — forme incomplète`,
    ins: `au moyen de ${owned}`,
  };
  let text = templates[caseId];
  if (clitic === "ko") text = `Est-ce ${text} ?`;
  if (clitic === "kin") text = `${text} aussi`;
  if (clitic === "kaan") text = `${text} non plus`;
  if (clitic === "han") text = `${text}, comme tu le sais`;
  if (clitic === "pa") text = `${text} — tiens`;
  if (clitic === "s") text = `${text}, ton familier`;
  return text;
}

export function assemble(noun: Noun, caseId: CaseId, poss: PossId, clitic: CliticId): Assembly {
  const notes: string[] = [];
  let core = noun.singular[caseId];
  let complete = true;
  let usedPoss = poss;

  if (caseId === "ins" && poss !== "none") {
    notes.push("L'instructif s'emploie presque toujours sans possessif. Le suffixe n'a pas été ajouté.");
    usedPoss = "none";
  }

  if (caseId === "com" && usedPoss === "none") {
    core = `${noun.comStem}-`;
    complete = false;
    notes.push("Le comitatif exige un possessif. Choisis -ni, -si, -nsa, -mme ou -nne.");
  } else if (caseId === "com") {
    core = noun.comStem + (usedPoss === "nsa" ? "en" : possSuffix(usedPoss));
    notes.push("Le comitatif part du radical pluriel en -ine-, puis le possessif.");
  } else if (usedPoss !== "none" && (caseId === "nom" || caseId === "gen")) {
    core = noun.vowelStem + (usedPoss === "nsa" ? nsa(noun) : possSuffix(usedPoss));
    if (caseId === "gen") notes.push("Le -n du génitif disparaît devant le possessif.");
    if (noun.vowelStem !== noun.fi) {
      notes.push(`Le possessif se colle au radical « ${noun.vowelStem}- », pas à la forme nue « ${noun.fi} ».`);
    }
  } else if (usedPoss !== "none" && caseId === "ill") {
    core = noun.singular.ill.slice(0, -1) + (usedPoss === "nsa" ? nsa(noun) : possSuffix(usedPoss));
    notes.push("Devant un possessif, le -n de l'illatif tombe.");
  } else if (usedPoss !== "none" && caseId === "all") {
    const base = noun.singular.all;
    if (usedPoss === "nsa") {
      core = `${base.slice(0, -1)}een`;
      notes.push("À la 3e personne, -lle suivi du possessif donne -lleen.");
    } else {
      core = base + possSuffix(usedPoss);
    }
  } else if (usedPoss !== "none" && caseId === "tra") {
    const stem = noun.singular.tra.slice(0, -1);
    if (usedPoss === "nsa") {
      core = `${stem}een`;
      notes.push("À la 3e personne, -ksi suivi du possessif donne -kseen.");
    } else {
      core = `${stem}e${possSuffix(usedPoss)}`;
      notes.push("Le -i de -ksi devient -e devant -ni, -si, -mme et -nne.");
    }
  } else if (usedPoss !== "none") {
    const base = noun.singular[caseId];
    if (usedPoss === "nsa") {
      core = isLongVowelEnding(base) ? base + nsa(noun) : `${base}${base[base.length - 1]}n`;
      notes.push("À la 3e personne, la voyelle finale brève s'allonge et prend -n. Si elle est déjà longue, on ajoute -nsa ou -nsä.");
    } else {
      core = base + possSuffix(usedPoss);
    }
  }

  let form = core;
  if (complete && clitic !== "none") form += cliticText(noun, clitic);
  if (clitic === "kaan") notes.push("« -kaan / -kään » vit dans une phrase négative.");
  if (clitic === "s") notes.push("« -s » est familier. Il n'a pas de variante d'harmonie.");

  const caseInfo = CASES.find((item) => item.id === caseId);
  const chips = [
    { label: "Mot", value: noun.fi },
    { label: caseInfo?.fr ?? "Cas", value: caseInfo?.endings ?? "" },
  ];
  if (usedPoss === "ni") chips.push({ label: "Possessif", value: "-ni" });
  if (usedPoss === "si") chips.push({ label: "Possessif", value: "-si" });
  if (usedPoss === "nsa") chips.push({ label: "Possessif", value: noun.harmony === "front" ? "-nsä" : "-nsa" });
  if (usedPoss === "mme") chips.push({ label: "Possessif", value: "-mme" });
  if (usedPoss === "nne") chips.push({ label: "Possessif", value: "-nne" });
  if (complete && clitic !== "none") chips.push({ label: "Particule", value: `-${cliticText(noun, clitic)}` });

  return {
    form,
    complete,
    gloss: glossOf(noun, caseId, usedPoss, complete ? clitic : "none", complete),
    notes,
    chips,
  };
}
