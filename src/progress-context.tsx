import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EMPTY_PROGRESS,
  LESSON_TOTAL,
  dayNumber,
  levelForWeek,
  loadProgress,
  saveProgress,
  streakCount,
  todayISO,
  weekFromDay,
  type ProgressState,
} from "./lib/progress";

interface ProgressApi {
  state: ProgressState;
  day: number | null;
  week: number;
  level: "A1" | "A2" | "B1";
  streak: number;
  doneCount: number;
  total: number;
  studiedToday: boolean;
  isDone: (id: string) => boolean;
  start: () => void;
  toggle: (id: string) => void;
  markToday: () => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const api = useMemo<ProgressApi>(() => {
    const day = dayNumber(state.startedOn);
    const week = weekFromDay(day);
    const done = new Set(state.lessons);
    return {
      state,
      day,
      week,
      level: levelForWeek(week),
      streak: streakCount(state.studyDays),
      doneCount: done.size,
      total: LESSON_TOTAL,
      studiedToday: state.studyDays.includes(todayISO()),
      isDone: (id) => done.has(id),
      start: () => {
        setState((current) => {
          if (current.startedOn) return current;
          const today = todayISO();
          return {
            ...current,
            startedOn: today,
            studyDays: current.studyDays.includes(today) ? current.studyDays : [...current.studyDays, today],
          };
        });
      },
      toggle: (id) => {
        setState((current) => {
          const has = current.lessons.includes(id);
          const today = todayISO();
          return {
            ...current,
            lessons: has ? current.lessons.filter((item) => item !== id) : [...current.lessons, id],
            studyDays: has || current.studyDays.includes(today) ? current.studyDays : [...current.studyDays, today],
          };
        });
      },
      markToday: () => {
        setState((current) => {
          const today = todayISO();
          if (current.studyDays.includes(today)) return current;
          return { ...current, studyDays: [...current.studyDays, today] };
        });
      },
      reset: () => setState(EMPTY_PROGRESS),
    };
  }, [state]);

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("Progression hors contexte");
  return value;
}
