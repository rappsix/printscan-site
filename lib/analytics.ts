declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}

const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

export function trackGoal(goal: string) {
  if (typeof window !== "undefined" && window.ym && METRIKA_ID) {
    window.ym(METRIKA_ID, "reachGoal", goal);
  }
}
