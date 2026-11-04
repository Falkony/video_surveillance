declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
    metrikaId?: number
  }
}

// Отправка цели в Метрику; без счётчика (локально, без ID) — тихо ничего не делает.
export function reachGoal(goal: string) {
  if (window.ym && window.metrikaId) {
    window.ym(window.metrikaId, 'reachGoal', goal)
  }
}
