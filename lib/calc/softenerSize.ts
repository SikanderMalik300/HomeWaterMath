// Water softener sizing. All maths here; no formulas in components.

import {
  CAPACITY_PER_CUFT,
  SIZES,
  SOFT_WATER_GPG,
  IRON_MAX_PPM,
  type SoftenerSizeSpec,
} from '@/lib/data/constants';

export interface SoftenerSizeInput {
  people: number;
  galPerPerson: number;
  hardnessGpg: number;
  ironPpm: number;
  ironAllowance: number; // 4 or 5
  daysBetweenRegen: number;
  salt: number; // 6 | 9 | 12 | 15
}

export type SizeState = 'ok' | 'soft' | 'oversize';

export interface SizeRow {
  label: number;
  cuFt: number;
  realCapacity: number;
  daysItLasts: number;
  fits: boolean; // realCapacity >= grainsNeeded
}

export interface SoftenerSizeResult {
  state: SizeState;
  compensatedGpg: number;
  grainsPerDay: number;
  grainsNeeded: number;
  capacityPerCuFt: number;
  recommended: SoftenerSizeSpec | null;
  realCapacity: number; // of recommended (0 if none)
  daysItLasts: number;
  saltPerRegenLb: number;
  ironWarning: boolean;
  rows: SizeRow[];
  // oversize-only helpers
  realCapacity96: number;
  days96: number; // floor(realCapacity96 / grainsPerDay)
}

export function capacityPerCuFt(salt: number): number {
  return CAPACITY_PER_CUFT[salt] ?? CAPACITY_PER_CUFT[9];
}

export function softenerSize(input: SoftenerSizeInput): SoftenerSizeResult {
  const { people, galPerPerson, hardnessGpg, ironPpm, ironAllowance, daysBetweenRegen, salt } =
    input;

  const compensatedGpg = hardnessGpg + ironPpm * ironAllowance;
  const grainsPerDay = people * galPerPerson * compensatedGpg;
  const grainsNeeded = grainsPerDay * daysBetweenRegen;
  const capPerCuFt = capacityPerCuFt(salt);

  const rows: SizeRow[] = SIZES.map((s) => {
    const realCapacity = s.cuFt * capPerCuFt;
    return {
      label: s.label,
      cuFt: s.cuFt,
      realCapacity,
      daysItLasts: grainsPerDay > 0 ? realCapacity / grainsPerDay : 0,
      fits: realCapacity >= grainsNeeded,
    };
  });

  const recommendedRow = rows.find((r) => r.fits) ?? null;
  const recommended = recommendedRow
    ? { label: recommendedRow.label, cuFt: recommendedRow.cuFt }
    : null;

  const realCapacity = recommendedRow ? recommendedRow.realCapacity : 0;
  const daysItLasts = recommendedRow && grainsPerDay > 0 ? realCapacity / grainsPerDay : 0;
  const saltPerRegenLb = recommended ? recommended.cuFt * salt : 0;

  const largest = SIZES[SIZES.length - 1];
  const realCapacity96 = largest.cuFt * capPerCuFt;
  const days96 = grainsPerDay > 0 ? Math.floor(realCapacity96 / grainsPerDay) : 0;

  let state: SizeState = 'ok';
  if (compensatedGpg < SOFT_WATER_GPG) state = 'soft';
  else if (!recommendedRow) state = 'oversize';

  return {
    state,
    compensatedGpg,
    grainsPerDay,
    grainsNeeded,
    capacityPerCuFt: capPerCuFt,
    recommended,
    realCapacity,
    daysItLasts,
    saltPerRegenLb,
    ironWarning: ironPpm > IRON_MAX_PPM,
    rows,
    realCapacity96,
    days96,
  };
}

/**
 * Size chart used by the reference table and homepage: the recommended label
 * for a household and hardness at 75 gal/person, 7 days, 9 lb, no iron.
 * Returns the label number, or null for the "over 96,000" state.
 */
export function sizeChartCell(people: number, hardnessGpg: number): number | null {
  const r = softenerSize({
    people,
    galPerPerson: 75,
    hardnessGpg,
    ironPpm: 0,
    ironAllowance: 4,
    daysBetweenRegen: 7,
    salt: 9,
  });
  return r.recommended ? r.recommended.label : null;
}
