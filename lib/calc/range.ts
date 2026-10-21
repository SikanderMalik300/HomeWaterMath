// Shared cost-range helper. "Typical" is the midpoint of the range unless a
// caller overrides it. Round only for display.

export type Range = { low: number; high: number; typical: number };

export function mid(a: number, b: number): number {
  return (a + b) / 2;
}

/** Build a range from a [low, high] tuple; typical defaults to the midpoint. */
export function range(low: number, high: number, typical?: number): Range {
  return { low, high, typical: typical ?? mid(low, high) };
}

/** Sum any number of ranges component-wise (low+low, high+high, typical+typical). */
export function addRanges(...ranges: Range[]): Range {
  return ranges.reduce(
    (acc, r) => ({ low: acc.low + r.low, high: acc.high + r.high, typical: acc.typical + r.typical }),
    { low: 0, high: 0, typical: 0 },
  );
}
