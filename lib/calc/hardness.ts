// Water hardness: convert any unit to mg/L as CaCO3, then out to all units.
// Pure functions, no I/O. Display formatting lives in the components.

import {
  MG_PER_GPG,
  MG_PER_MMOL,
  MG_PER_DH,
  MG_PER_FH,
  SODIUM_MG_PER_L_PER_GPG,
} from '@/lib/data/constants';

export type HardnessUnit = 'gpg' | 'mgl' | 'mmol' | 'dh' | 'fh';

export const HARDNESS_UNITS: { value: HardnessUnit; label: string }[] = [
  { value: 'gpg', label: 'gpg' },
  { value: 'mgl', label: 'mg/L (ppm)' },
  { value: 'mmol', label: 'mmol/L' },
  { value: 'dh', label: '°dH' },
  { value: 'fh', label: '°fH' },
];

export type HardnessClass =
  | 'Soft'
  | 'Slightly hard'
  | 'Moderately hard'
  | 'Hard'
  | 'Very hard';

/** Convert a value in any supported unit to mg/L as CaCO3. */
export function toMgL(value: number, unit: HardnessUnit): number {
  switch (unit) {
    case 'gpg':
      return value * MG_PER_GPG;
    case 'mgl':
      return value;
    case 'mmol':
      return value * MG_PER_MMOL;
    case 'dh':
      return value * MG_PER_DH;
    case 'fh':
      return value * MG_PER_FH;
  }
}

/** Convert mg/L as CaCO3 to grains per gallon. */
export function mgLToGpg(mgl: number): number {
  return mgl / MG_PER_GPG;
}

/** Convert any input value+unit straight to gpg (used by the other calculators). */
export function toGpg(value: number, unit: HardnessUnit): number {
  return mgLToGpg(toMgL(value, unit));
}

export function classifyWQA(mgl: number): HardnessClass {
  if (mgl < 17.1) return 'Soft';
  if (mgl <= 60) return 'Slightly hard';
  if (mgl <= 120) return 'Moderately hard';
  if (mgl <= 180) return 'Hard';
  return 'Very hard';
}

export function classifyUSGS(mgl: number): HardnessClass {
  if (mgl <= 60) return 'Soft';
  if (mgl <= 120) return 'Moderately hard';
  if (mgl <= 180) return 'Hard';
  return 'Very hard';
}

export interface HardnessResult {
  mgl: number;
  gpg: number;
  mmol: number;
  dh: number;
  fh: number;
  wqa: HardnessClass;
  usgs: HardnessClass;
  sodiumAddedMgPerL: number;
}

export function convertHardness(value: number, unit: HardnessUnit): HardnessResult {
  const mgl = toMgL(value, unit);
  const gpg = mgl / MG_PER_GPG;
  return {
    mgl,
    gpg,
    mmol: mgl / MG_PER_MMOL,
    dh: mgl / MG_PER_DH,
    fh: mgl / MG_PER_FH,
    wqa: classifyWQA(mgl),
    usgs: classifyUSGS(mgl),
    sodiumAddedMgPerL: gpg * SODIUM_MG_PER_L_PER_GPG,
  };
}

/** Input validation: a hardness value must be a finite number >= 0. */
export function isValidHardnessInput(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
