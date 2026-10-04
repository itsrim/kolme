import { LEXICON, lexiconCount } from "../src/data/lexicon";
import { parseYleRss } from "../src/server/yle-rss";
import { articleWordCount, introParagraphs } from "../src/server/wiki";
import { LESSONS, WEEKS } from "../src/data/path";
import { READINGS } from "../src/data/readings";
import { NOUNS } from "../src/data/grammar";
import { VERBS } from "../src/data/verbs";
import { assemble } from "../src/lib/agglutinate";
import { TENSES, formAt } from "../src/lib/conjugate";
import { align, heardWords, similar, tokenizeParagraphs } from "../src/lib/follow";
import type { CaseId, CliticId, PossId } from "../src/types";

let failed = 0;

function expectForm(nounId: string, caseId: CaseId, poss: PossId, clitic: CliticId, expected: string) {
  const noun = NOUNS.find((item) => item.id === nounId);
  if (!noun) throw new Error(nounId);
  const got = assemble(noun, caseId, poss, clitic).form;
  if (got !== expected) {
    failed += 1;
    console.error(`${nounId} ${caseId} ${poss} ${clitic}: attendu ${expected}, obtenu ${got}`);
  }
}

const cases: [string, CaseId, PossId, CliticId, string][] = [
  ["talo", "ine", "ni", "kin", "talossanikin"],
  ["talo", "all", "ni", "none", "talolleni"],
  ["talo", "all", "nsa", "none", "talolleen"],
  ["talo", "tra", "ni", "none", "talokseni"],
  ["talo", "tra", "nsa", "none", "talokseen"],
  ["talo", "ill", "ni", "none", "talooni"],
  ["talo", "ill", "nsa", "none", "taloonsa"],
  ["talo", "gen", "ni", "none", "taloni"],
  ["talo", "par", "nsa", "none", "taloaan"],
  ["talo", "nom", "nsa", "none", "talonsa"],
  ["talo", "ine", "nsa", "none", "talossaan"],
  ["talo", "com", "ni", "none", "taloineni"],
  ["talo", "com", "nsa", "none", "taloineen"],
  ["ystava", "ine", "ni", "ko", "ystävässänikö"],
  ["ystava", "par", "nsa", "none", "ystäväänsä"],
  ["ystava", "all", "ni", "none", "ystävälleni"],
  ["ystava", "tra", "nsa", "none", "ystäväkseen"],
  ["ystava", "com", "ni", "none", "ystävineni"],
  ["kieli", "nom", "ni", "none", "kieleni"],
  ["kieli", "ine", "ni", "none", "kielessäni"],
  ["kieli", "par", "ni", "none", "kieltäni"],
  ["kieli", "ill", "si", "none", "kieleesi"],
  ["vesi", "nom", "ni", "none", "veteni"],
  ["vesi", "gen", "si", "none", "vetesi"],
  ["vesi", "ine", "nsa", "none", "vedessään"],
  ["vesi", "par", "ni", "none", "vettäni"],
  ["vesi", "ill", "ni", "none", "veteeni"],
  ["vesi", "all", "nsa", "none", "vedelleen"],
  ["vesi", "tra", "ni", "none", "vedekseni"],
  ["nainen", "nom", "ni", "none", "naiseni"],
  ["nainen", "ine", "none", "ko", "naisessako"],
  ["nainen", "ill", "ni", "none", "naiseeni"],
  ["maa", "ill", "ni", "none", "maahani"],
  ["maa", "nom", "ni", "none", "maani"],
  ["maa", "ine", "none", "kin", "maassakin"],
  ["tytto", "nom", "ni", "none", "tyttöni"],
  ["tytto", "gen", "nsa", "none", "tyttönsä"],
  ["tytto", "ine", "ni", "none", "tytössäni"],
  ["tytto", "par", "nsa", "none", "tyttöään"],
  ["tytto", "ill", "ni", "none", "tyttööni"],
  ["lapsi", "nom", "ni", "none", "lapseni"],
  ["lapsi", "par", "ni", "none", "lastani"],
  ["lapsi", "ine", "nsa", "none", "lapsessaan"],
  ["lapsi", "ill", "ni", "none", "lapseeni"],
];

for (const [nounId, caseId, poss, clitic, expected] of cases) {
  expectForm(nounId, caseId, poss, clitic, expected);
}

for (const noun of NOUNS) {
  if (!noun.singular.ill.endsWith("n")) {
    failed += 1;
    console.error(`${noun.fi} illatif sans -n`);
  }
  if (!noun.singular.tra.endsWith("i")) {
    failed += 1;
    console.error(`${noun.fi} translatif inattendu`);
  }
}

const ids = new Set<string>();
for (const verb of VERBS) {
  if (ids.has(verb.id)) {
    failed += 1;
    console.error(`verbe en double ${verb.id}`);
  }
  ids.add(verb.id);
  for (const tense of ["present", "imperfect", "conditional"] as const) {
    for (let i = 0; i < 6; i++) {
      const form = formAt(verb, tense, "pos", i);
      if (!form || form.includes("undefined")) {
        failed += 1;
        console.error(`${verb.id} ${tense} ${i} vide`);
      }
    }
  }
  const third = verb.conditional[2];
  if (!third.includes("isi")) {
    failed += 1;
    console.error(`${verb.id} conditionnel sans -isi- : ${third}`);
  }
  const order = verb.imperative[1];
  if (!order.includes("koon") && !order.includes("köön")) {
    failed += 1;
    console.error(`${verb.id} impératif 3e inattendu : ${order}`);
  }
}

if (LESSONS.length !== 48) {
  failed += 1;
  console.error(`48 leçons attendues, ${LESSONS.length} trouvées`);
}
for (const week of WEEKS) {
  const count = LESSONS.filter((lesson) => lesson.week === week.week).length;
  if (count !== 4) {
    failed += 1;
    console.error(`semaine ${week.week} : ${count} leçons`);
  }
}
const nahda = VERBS.find((verb) => verb.id === "nähdä");
if (!nahda || formAt(nahda, "future", "pos", 0) !== "aion nähdä" || formAt(nahda, "future", "neg", 5) !== "eivät aio nähdä") {
  failed += 1;
  console.error("futur inattendu");
}
if (!nahda || formAt(nahda, "perfect", "pos", 0) !== "olen nähnyt") {
  failed += 1;
  console.error("passé composé inattendu");
}
if (!TENSES.some((tense) => tense.fr === "Futur") || !TENSES.some((tense) => tense.fr === "Passé composé")) {
  failed += 1;
  console.error("libellés de temps manquants");
}
if (READINGS.length < 8) {
  failed += 1;
  console.error("textes manquants");
}
for (const reading of READINGS) {
  if (reading.paragraphs.length < 3) {
    failed += 1;
    console.error(`${reading.id} n'a pas assez de paragraphes`);
  }
  const words = tokenizeParagraphs(reading.paragraphs);
  if (words.length < 40) {
    failed += 1;
    console.error(`${reading.id} est trop court (${words.length} mots)`);
  }
}
const sample = tokenizeParagraphs([{ fi: "Minä olen Anna ja asun Helsingissä." }]);
const hit = align(sample, 0, heardWords("Minä olen Anna"), true);
if (hit.next !== 3 || hit.ok.join() !== "0,1,2") {
  failed += 1;
  console.error(`alignement inattendu ${JSON.stringify(hit)}`);
}
const skipped = align(sample, 0, ["anna"], true);
if (!skipped.miss.includes(0) || !skipped.ok.includes(2)) {
  failed += 1;
  console.error(`saut inattendu ${JSON.stringify(skipped)}`);
}
if (similar("on", "en") || !similar("helsingissa", "helsingissä")) {
  failed += 1;
  console.error("similarité finlandaise incorrecte");
}

const lexSections = ["quotidien", "adverbes", "adjectifs", "autres", "expressions"] as const;
for (const section of lexSections) {
  const count = lexiconCount(section);
  if (count < 20) {
    failed += 1;
    console.error(`${section} trop court (${count})`);
  }
}
const seen = new Set<string>();
for (const group of LEXICON) {
  const local = new Set<string>();
  if (!group.intro && group.items.length === 0) {
    failed += 1;
    console.error(`${group.id} est vide`);
  }
  for (const item of group.items) {
    if (!item.fi.trim() || !item.fr.trim()) {
      failed += 1;
      console.error(`${group.id} a une entrée vide`);
    }
    if (local.has(item.fi)) {
      failed += 1;
      console.error(`${group.id} répète ${item.fi}`);
    }
    local.add(item.fi);
    seen.add(item.fi);
  }
}
for (const phrase of ["hyvää huomenta", "ei koskaan", "Minulla on nälkä.", "Hauska tutustua.", "täällä", "hyvä", "millainen", "päällä", "alla", "edessä", "housut"]) {
  if (!seen.has(phrase)) {
    failed += 1;
    console.error(`mot utile manquant : ${phrase}`);
  }
}
const yleSample = `<?xml version="1.0"?><rss><channel><item><title>Selkouutiset &amp; sää</title><link>https://yle.fi/a/74-1?origin=rss</link><description>Ne pas copier ceci.</description><category>Yle Uutiset selkosuomeksi</category><pubDate>Sat, 03 Oct 2026 11:41:13 +0300</pubDate></item><item><title>Ailleurs</title><link>https://example.com/a</link><pubDate>Sat, 03 Oct 2026 11:41:13 +0300</pubDate></item></channel></rss>`;
const yleItems = parseYleRss(yleSample, 5);
if (yleItems.length !== 1 || yleItems[0].title !== "Selkouutiset & sää" || !yleItems[0].link.startsWith("https://yle.fi/")) {
  failed += 1;
  console.error(`flux Yle inattendu ${JSON.stringify(yleItems)}`);
}
const wikiIntro = introParagraphs(
  "Stratovarius on suomalainen yhtye. Se on perustettu vuonna 1984.\n\nYhtye myy äänitteitään ympäri maailmaa ja soittaa yhä.\n\nHistoria\n\n1980-luku\n\nRumpali perusti yhtyeen vuonna 1984 ja vaihtoi nimeä myöhemmin.",
);
if (wikiIntro.length !== 2 || wikiIntro.some((paragraph) => paragraph.startsWith("Historia") || paragraph.startsWith("1980"))) {
  failed += 1;
  console.error(`introduction wiki inattendue ${JSON.stringify(wikiIntro)}`);
}
if (articleWordCount(["yksi kaksi"]) !== 2) {
  failed += 1;
  console.error("compte de mots wiki incorrect");
}

if (yleItems[0] && "description" in yleItems[0]) {
  failed += 1;
  console.error("le flux Yle ne doit garder que le titre");
}

if (lexiconCount() < 180) {
  failed += 1;
  console.error(`lexique trop court (${lexiconCount()})`);
}

if (failed) {
  console.error(`${failed} contrôle(s) en échec`);
  process.exit(1);
}
console.log(`ok — ${cases.length} assemblages, ${VERBS.length} verbes, ${LESSONS.length} leçons, ${lexiconCount()} mots utiles`);
