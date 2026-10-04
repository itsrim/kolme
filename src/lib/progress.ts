import { LESSONS } from "../data/path";

const KEY = "kolme-progress-v1";

export interface ProgressState {
  startedOn: string | null;
  lessons: string[];
  studyDays: string[];
}

export const EMPTY_PROGRESS: ProgressState = {
  startedOn: null,
  lessons: [],
  studyDays: [],
};

export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const data = JSON.parse(raw) as Partial<ProgressState>;
    return {
      startedOn: typeof data.startedOn === "string" ? data.startedOn : null,
      lessons: Array.isArray(data.lessons) ? data.lessons.filter((id) => typeof id === "string") : [],
      studyDays: Array.isArray(data.studyDays) ? data.studyDays.filter((id) => typeof id === "string") : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function dayNumber(startedOn: string | null, today = new Date()): number | null {
  if (!startedOn) return null;
  const start = parseISODate(startedOn);
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  if (diff < 0) return 1;
  return Math.min(90, diff + 1);
}

export function weekFromDay(day: number | null): number {
  if (!day) return 1;
  return Math.min(12, Math.ceil(day / 7));
}

export function streakCount(days: string[], today = new Date()): number {
  const set = new Set(days);
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!set.has(todayISO(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(todayISO(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function levelForWeek(week: number): "A1" | "A2" | "B1" {
  if (week <= 4) return "A1";
  if (week <= 8) return "A2";
  return "B1";
}

export const LESSON_TOTAL = LESSONS.length;
