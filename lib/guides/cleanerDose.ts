// Water softener cleaner dose calculator for /water-softener-cleaner/.
// Label doses are from each product's own instructions (see source ids).

import { SIZES } from '@/lib/data/constants';

export type CleanerType = 'liquid' | 'powder';

export interface CleanerProduct {
  id: string;
  label: string;
  type: CleanerType;
  firstPerCuFt: number; // oz per cu ft for a first (deep) clean (liquids)
  maintLowPerCuFt: number; // oz per cu ft per regeneration (liquids)
  maintHighPerCuFt: number; // same; equals low when there is no range
}

// Res Care: 4 oz/cu ft first, 0.5 oz/cu ft maintenance (pro-res-care-label).
// Res-Up: 3 to 4 oz/cu ft first (use 4), 0.5 to 1 maintenance (resup-instructions).
// Iron OUT: powder, dosed per treatment and per bag of salt (ironout-summit).
// OUT Filter Mate HD: 4 oz/cu ft first, 1 to 2 maintenance (outfiltermate-summit).
export const CLEANER_PRODUCTS: CleanerProduct[] = [
  { id: 'resCare', label: 'Res Care (liquid)', type: 'liquid', firstPerCuFt: 4, maintLowPerCuFt: 0.5, maintHighPerCuFt: 0.5 },
  { id: 'resUp', label: 'Res-Up (liquid)', type: 'liquid', firstPerCuFt: 4, maintLowPerCuFt: 0.5, maintHighPerCuFt: 1 },
  { id: 'ironOut', label: 'Iron OUT (powder)', type: 'powder', firstPerCuFt: 0, maintLowPerCuFt: 0, maintHighPerCuFt: 0 },
  { id: 'filterMate', label: 'OUT Filter Mate Heavy Duty (liquid)', type: 'liquid', firstPerCuFt: 4, maintLowPerCuFt: 1, maintHighPerCuFt: 2 },
];

export const OZ_PER_GALLON = 128;
export const OZ_PER_CUP = 8;

export function cleanerProduct(id: string): CleanerProduct {
  return CLEANER_PRODUCTS.find((p) => p.id === id) ?? CLEANER_PRODUCTS[0];
}

export function cuFtForSize(sizeGrains: number): number {
  return SIZES.find((s) => s.label === sizeGrains)?.cuFt ?? 1.5;
}

export interface CleanerDoseResult {
  type: CleanerType;
  cuFt: number;
  hasRange: boolean;
  // Liquids only (0 for powder):
  firstOz: number;
  firstCups: number;
  maintOzLow: number;
  maintOzHigh: number;
  maintYearLow: number;
  maintYearHigh: number;
  gallonYearsLow: number; // a 1-gal bottle lasts this long at the heavier rate
  gallonYearsHigh: number; // and this long at the lighter rate
}

export function cleanerDose(productId: string, sizeGrains: number, regensPerYear: number): CleanerDoseResult {
  const p = cleanerProduct(productId);
  const cuFt = cuFtForSize(sizeGrains);
  const regens = Number.isFinite(regensPerYear) && regensPerYear > 0 ? regensPerYear : 0;

  if (p.type === 'powder') {
    return {
      type: 'powder',
      cuFt,
      hasRange: false,
      firstOz: 0,
      firstCups: 0,
      maintOzLow: 0,
      maintOzHigh: 0,
      maintYearLow: 0,
      maintYearHigh: 0,
      gallonYearsLow: 0,
      gallonYearsHigh: 0,
    };
  }

  const firstOz = p.firstPerCuFt * cuFt;
  const maintOzLow = p.maintLowPerCuFt * cuFt;
  const maintOzHigh = p.maintHighPerCuFt * cuFt;
  const maintYearLow = maintOzLow * regens;
  const maintYearHigh = maintOzHigh * regens;

  return {
    type: 'liquid',
    cuFt,
    hasRange: p.maintHighPerCuFt !== p.maintLowPerCuFt,
    firstOz,
    firstCups: firstOz / OZ_PER_CUP,
    maintOzLow,
    maintOzHigh,
    maintYearLow,
    maintYearHigh,
    gallonYearsLow: maintYearHigh > 0 ? OZ_PER_GALLON / maintYearHigh : 0,
    gallonYearsHigh: maintYearLow > 0 ? OZ_PER_GALLON / maintYearLow : 0,
  };
}

/** Format ounces as cups using eighth-of-a-cup fractions (8 oz = 1 cup). */
export function formatCups(cups: number): string {
  const whole = Math.floor(cups + 1e-9);
  const frac = cups - whole;
  const eighth = Math.round(frac * 8);
  const glyphs = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];
  let w = whole;
  let g = glyphs[eighth] ?? '';
  if (eighth === 8) {
    w += 1;
    g = '';
  }
  const text = w > 0 ? (g ? `${w}${g}` : `${w}`) : g || '0';
  const unit = cups <= 1 ? 'cup' : 'cups';
  return `${text} ${unit}`;
}
