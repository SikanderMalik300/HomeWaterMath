// Water softener control settings. All maths here; no formulas in components.
// Reuses SIZES and CAPACITY_PER_CUFT. Gives every number a metered or timer
// valve asks for from the household, the iron and the real capacity.

import { CAPACITY_PER_CUFT, SIZES, IRON_MAX_PPM } from '@/lib/data/constants';
import { ceilCount, roundTo } from '@/lib/calc/round';

export interface SettingsInput {
  people: number;
  galPerPerson: number;
  hardnessGpg: number;
  ironPpm: number;
  ironAllowance: number; // 4 or 5
  sizeGrains: number; // label grains, maps to cu ft via SIZES
  salt: number; // 6 | 9 | 12 | 15
  metered: boolean;
}

export interface SettingsResult {
  cuFt: number;
  hardnessSetting: number; // whole gpg, rounded up
  capacity: number; // grains to enter as capacity
  gallonsBetween: number;
  dailyGallons: number;
  reserve: number;
  usableGallons: number;
  dayOverride: number; // metered: max days between regenerations, 1..14
  timerDays: number; // timer: days between regenerations, 1..14
  saltPerRegenLb: number;
  capped: boolean; // the active valve's days hit the 14-day cap
  smallSoftener: boolean; // active valve's days below 3
  ironWarning: boolean; // iron above 2 ppm
}

export function cuFtForSize(sizeGrains: number): number {
  return SIZES.find((s) => s.label === sizeGrains)?.cuFt ?? 1.5;
}

export function capacityAtSalt(salt: number): number {
  return CAPACITY_PER_CUFT[salt] ?? CAPACITY_PER_CUFT[9];
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

export function softenerSettings(input: SettingsInput): SettingsResult {
  const { people, galPerPerson, hardnessGpg, ironPpm, ironAllowance, sizeGrains, salt, metered } =
    input;

  const cuFt = cuFtForSize(sizeGrains);
  // Round the compensated hardness to the tenth we display before rounding up,
  // so 256.8 mg/L (the 1-decimal display of 15 gpg) sets 15, not 16.
  const compensatedGpg = roundTo(hardnessGpg + ironPpm * ironAllowance, 1);
  const hardnessSetting = Math.max(1, ceilCount(compensatedGpg));

  const capacity = cuFt * capacityAtSalt(salt);
  const gallonsBetween = capacity / hardnessSetting;
  const dailyGallons = people * galPerPerson;

  const reserve = dailyGallons > 0 ? Math.min(dailyGallons, gallonsBetween / 2) : 0;
  const usableGallons = gallonsBetween - reserve;

  const rawDayOverride = dailyGallons > 0 ? Math.floor(usableGallons / dailyGallons) : 0;
  const rawTimerDays =
    dailyGallons > 0 ? Math.floor(capacity / (dailyGallons * hardnessSetting)) : 0;
  const dayOverride = clamp(rawDayOverride, 1, 14);
  const timerDays = clamp(rawTimerDays, 1, 14);

  const saltPerRegenLb = cuFt * salt;

  const activeRaw = metered ? rawDayOverride : rawTimerDays;
  const activeDays = metered ? dayOverride : timerDays;

  return {
    cuFt,
    hardnessSetting,
    capacity,
    gallonsBetween,
    dailyGallons,
    reserve,
    usableGallons,
    dayOverride,
    timerDays,
    saltPerRegenLb,
    capped: activeRaw > 14,
    smallSoftener: activeDays < 3,
    ironWarning: ironPpm > IRON_MAX_PPM,
  };
}
