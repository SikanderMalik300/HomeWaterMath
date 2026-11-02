// Well shock chlorination. All maths here; no formulas in components.
// Water volume uses the University of Nevada FS-06-69 method (well + pressure
// tank + water heater + toilets + plumbing), bleach from the target ppm.

import { roundTo } from '@/lib/calc/round';

// Gallons of water per foot of casing, by casing diameter in inches.
// UGA C858-4 and Univ. Nevada FS-06-69; 2 in is the calculated geometric value.
export const GAL_PER_FT: Record<number, number> = {
  2: 0.163,
  4: 0.653,
  5: 1.02,
  6: 1.47,
  8: 2.61,
  24: 23.5,
  36: 52.9,
};

export const CASING_DIAMETERS = [2, 4, 5, 6, 8, 24, 36] as const;
export const GAL_PER_TOILET = 3;
export const PLUMBING_GAL = 10;

export interface WellShockInput {
  wellDepth: number; // ft
  staticLevel: number; // ft, depth to water
  dia: number; // casing diameter in inches (key of GAL_PER_FT)
  tankGal: number; // pressure tank
  heaterGal: number; // water heater
  toilets: number;
  ppm: number; // target chlorine strength
  bleachPct: number; // bleach strength percent
}

export interface WellShockResult {
  valid: boolean;
  waterColumnFt: number;
  wellGal: number;
  houseGal: number;
  totalGal: number;
  bleachGal: number;
  bleachQt: number;
  bleachCups: number;
  bleachPints: number;
  highPpm: boolean; // ppm >= 250
  dugWell: boolean; // dia >= 24
  fullCasing: boolean; // staticLevel 0
}

/** Bleach to reach a target ppm in a number of gallons. */
export function bleachForGallons(totalGal: number, ppm: number, bleachPct: number) {
  const gal = bleachPct > 0 ? (totalGal * ppm) / (bleachPct * 10000) : 0;
  return { gal, qt: gal * 4, cups: gal * 16, pints: gal * 8 };
}

export function galPerFt(dia: number): number {
  return GAL_PER_FT[dia] ?? GAL_PER_FT[6];
}

export function wellShock(input: WellShockInput): WellShockResult {
  const { wellDepth, staticLevel, dia, tankGal, heaterGal, toilets, ppm, bleachPct } = input;

  const waterColumnFt = wellDepth - staticLevel;
  const valid =
    Number.isFinite(wellDepth) &&
    wellDepth > 0 &&
    Number.isFinite(staticLevel) &&
    staticLevel >= 0 &&
    staticLevel < wellDepth &&
    ppm > 0 &&
    bleachPct > 0;

  if (!valid) {
    return {
      valid: false,
      waterColumnFt: 0,
      wellGal: 0,
      houseGal: 0,
      totalGal: 0,
      bleachGal: 0,
      bleachQt: 0,
      bleachCups: 0,
      bleachPints: 0,
      highPpm: ppm >= 250,
      dugWell: dia >= 24,
      fullCasing: staticLevel === 0,
    };
  }

  const wellGal = waterColumnFt * galPerFt(dia);
  const houseGal =
    (tankGal || 0) + (heaterGal || 0) + (toilets || 0) * GAL_PER_TOILET + PLUMBING_GAL;
  const totalGal = wellGal + houseGal;
  const b = bleachForGallons(totalGal, ppm, bleachPct);

  return {
    valid: true,
    waterColumnFt,
    wellGal,
    houseGal,
    totalGal,
    bleachGal: b.gal,
    bleachQt: b.qt,
    bleachCups: b.cups,
    bleachPints: b.pints,
    highPpm: ppm >= 250,
    dugWell: dia >= 24,
    fullCasing: staticLevel === 0,
  };
}

/** Round to at most 2 decimals and trim trailing zeros (gallon display). */
export function galStr(x: number): string {
  return String(roundTo(x, 2));
}
