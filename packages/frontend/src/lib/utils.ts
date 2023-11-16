export function computeGrowth(current: number, previous: number): number {
  return ((current - previous) / Math.abs(previous)) * 100;
}
