// Yearly cost by water softener salt type for /water-softener-salt-types/.
// Prices are 40 lb bag prices (Home Depot, Walmart, Tractor Supply 2026-10-26).

import { ceilCount } from '@/lib/calc/round';

export interface SaltType {
  id: string;
  label: string;
  defaultPrice: number; // per 40 lb bag
  factor: number; // how much more by weight than pellets
}

export const SALT_TYPES: SaltType[] = [
  { id: 'pellets', label: 'Evaporated pellets', defaultPrice: 8.76, factor: 1.0 },
  { id: 'solar', label: 'Solar salt', defaultPrice: 8.76, factor: 1.0 },
  { id: 'ironPell', label: 'Iron-fighting pellets', defaultPrice: 9.99, factor: 1.0 },
  { id: 'kcl', label: 'Potassium chloride', defaultPrice: 41.99, factor: 1.14 },
];

export const BAG_LB = 40;

export interface SaltTypeCost {
  poundsYear: number;
  bagsYear: number;
  costYear: number;
}

export function saltTypeCost(lbPerYear: number, price: number, factor: number): SaltTypeCost {
  const lb = Number.isFinite(lbPerYear) && lbPerYear > 0 ? lbPerYear : 0;
  const p = Number.isFinite(price) && price >= 0 ? price : 0;
  const poundsYear = lb * factor;
  return {
    poundsYear,
    bagsYear: ceilCount(poundsYear / BAG_LB),
    costYear: (poundsYear * p) / BAG_LB,
  };
}
