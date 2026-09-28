/** Remaining seconds based on elapsed time, including time in background tabs. */
export function remainingSeconds(deadline: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}
