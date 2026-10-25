// Sodium-in-softened-water calculator for /can-you-drink-softened-water/.
// A softener adds about 7.864 mg/L of sodium for each gpg of hardness removed.

import { toGpg, type HardnessUnit } from '@/lib/calc/hardness';
import { SODIUM_MG_PER_L_PER_GPG } from '@/lib/data/constants';

export const SODIUM_LIMIT_MG = 2300; // American Heart Association daily limit
export const SODIUM_IDEAL_MG = 1500; // AHA ideal
export const SODIUM_EPA_GUIDANCE = 20; // mg/L, strict 500 mg/day diet
export const SODIUM_TASTE_MG_PER_L = 60; // EPA taste threshold 30 to 60 mg/L

export const SODIUM_EPA_FLAG =
  "Above EPA's 20 mg/L guidance level for people on a strict 500 mg a day sodium diet.";
export const SODIUM_TASTE_FLAG = 'May taste slightly salty (EPA: 30 to 60 mg/L).';

export interface SodiumResult {
  gpg: number;
  mgPerL: number;
  mgPerDay: number;
  pct2300: number; // percent of 2,300 mg
  pct1500: number; // percent of 1,500 mg
  aboveEpaGuidance: boolean;
  mayTasteSalty: boolean;
}

export function sodium(value: number, unit: HardnessUnit, litersPerDay: number): SodiumResult {
  const gpg = toGpg(value, unit);
  const liters = Number.isFinite(litersPerDay) && litersPerDay > 0 ? litersPerDay : 0;
  const mgPerL = gpg * SODIUM_MG_PER_L_PER_GPG;
  const mgPerDay = mgPerL * liters;
  return {
    gpg,
    mgPerL,
    mgPerDay,
    pct2300: (mgPerDay / SODIUM_LIMIT_MG) * 100,
    pct1500: (mgPerDay / SODIUM_IDEAL_MG) * 100,
    aboveEpaGuidance: mgPerL > SODIUM_EPA_GUIDANCE,
    mayTasteSalty: mgPerL > SODIUM_TASTE_MG_PER_L,
  };
}
