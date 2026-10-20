// Shared rounding and formatting helpers.
// All display rounding is "round half up" at the given decimal places.

/** Round half up to `dp` decimal places, guarding against binary float drift. */
export function roundTo(x: number, dp: number): number {
  if (!Number.isFinite(x)) return 0;
  const f = Math.pow(10, dp);
  // Scale, nudge by a tiny relative epsilon so values like 6.75 -> 67.5 round up,
  // then round half up.
  const scaled = x * f;
  return Math.round(scaled + (scaled >= 0 ? 1 : -1) * 1e-9) / f;
}

/** Ceil to a whole count, for things bought as whole units (bags, tanks). */
export const ceilCount = (x: number): number => Math.ceil(Math.round(x * 1e6) / 1e6);

/** Thousands separators, no decimals. */
export function formatInt(x: number): string {
  return Math.round(x).toLocaleString('en-US');
}

/** Thousands separators with a fixed number of decimals. */
export function formatDecimal(x: number, dp: number): string {
  const r = roundTo(x, dp);
  return r.toLocaleString('en-US', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/** Whole-dollar amount with $ and thousands separators. */
export function formatDollars(x: number): string {
  return '$' + Math.round(x).toLocaleString('en-US');
}

/**
 * Round to `dp` decimals, then drop a trailing ".0" so whole values show as
 * whole numbers (e.g. 15, 20) but fractions keep their decimal (e.g. 7.5).
 */
export function formatTrim(x: number, dp = 1): string {
  const r = roundTo(x, dp);
  if (Math.abs(r - Math.round(r)) < 1e-9) return Math.round(r).toLocaleString('en-US');
  return r.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/** Grains-per-gallon display: trim to a whole number when whole, else 1 dp. */
export function formatGpg(x: number): string {
  return formatTrim(x, 1);
}
