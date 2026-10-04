export type WordStatus = "wait" | "ok" | "miss";

export interface WordToken {
  key: string;
  text: string;
  norm: string;
  paragraph: number;
}

const PUNCT = /[.,!?;:"“”„«»()[\]…–—]/gu;

export function normalizeWord(raw: string): string {
  return raw.toLocaleLowerCase("fi").replace(PUNCT, "").trim();
}

export function foldFi(word: string): string {
  return word.replaceAll("ä", "a").replaceAll("ö", "o").replaceAll("å", "a");
}

export function tokenizeParagraphs(paragraphs: { fi: string }[]): WordToken[] {
  const tokens: WordToken[] = [];
  paragraphs.forEach((paragraph, index) => {
    for (const part of paragraph.fi.split(/\s+/)) {
      const norm = normalizeWord(part);
      if (!norm) continue;
      tokens.push({
        key: `${index}-${tokens.length}`,
        text: part,
        norm,
        paragraph: index,
      });
    }
  });
  return tokens;
}

export function heardWords(transcript: string): string[] {
  return transcript.split(/\s+/).map(normalizeWord).filter(Boolean);
}

/** Les mots courts exigent la voyelle juste : « on » n'est pas « en ». */
export function similar(target: string, heard: string): boolean {
  if (!target || !heard) return false;
  if (target === heard) return true;
  if (target.length < 4 || heard.length < 4) return false;
  return foldFi(target) === foldFi(heard);
}

export interface AlignResult {
  next: number;
  ok: number[];
  miss: number[];
}

const WINDOW = 4;

export function align(tokens: { norm: string }[], start: number, heard: string[], commitSkips: boolean): AlignResult {
  const ok: number[] = [];
  const miss: number[] = [];
  let pos = start;
  for (const word of heard) {
    if (!word || pos >= tokens.length) continue;
    let found = -1;
    const end = Math.min(tokens.length, pos + WINDOW);
    for (let index = pos; index < end; index += 1) {
      if (similar(tokens[index].norm, word)) {
        found = index;
        break;
      }
    }
    if (found === -1) continue;
    if (commitSkips) {
      for (let index = pos; index < found; index += 1) miss.push(index);
    }
    ok.push(found);
    pos = found + 1;
  }
  return { next: pos, ok, miss };
}
