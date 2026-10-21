// Reverse osmosis system cost.

import { RO, RO_EXTRAS, RO_EFF_STANDARD, RO_EFF_WATERSENSE } from '@/lib/data/constants';
import { range, addRanges, type Range } from './range';

export type ROSystem = 'tank' | 'tankless' | 'counter';
export type ROInstaller = 'diy' | 'plumber';
export type ROEfficiency = 'standard' | 'watersense' | 'custom';

export interface ROInput {
  system: ROSystem;
  installer: ROInstaller;
  people: number;
  galPerPersonDay: number;
  efficiency: ROEfficiency;
  customRatio: number;
  filtersPerYear: number;
  rate: number | null;
  fridge: boolean;
  stoneHole: boolean;
  drain: boolean;
}

export interface ROResult {
  upfront: Range;
  product: number;
  drainRatio: number;
  toDrain: number;
  waterCost: number;
  filtersPerYear: number;
  yearly: number;
  tenYear: number;
  centsPerGal: number;
  waterSenseToDrain: number;
  showComparison: boolean;
}

export function roCost(input: ROInput): ROResult {
  const spec = RO[input.system];
  const useUnit = input.installer === 'diy' || input.system === 'counter';
  const base = useUnit ? spec.unit : spec.installed ?? spec.unit;

  const parts: Range[] = [range(base[0], base[1])];
  if (input.fridge) parts.push(range(RO_EXTRAS.fridge[0], RO_EXTRAS.fridge[1]));
  if (input.stoneHole) parts.push(range(RO_EXTRAS.stoneHole[0], RO_EXTRAS.stoneHole[1]));
  if (input.drain) parts.push(range(RO_EXTRAS.drain[0], RO_EXTRAS.drain[1]));
  const upfront = addRanges(...parts);

  const product = input.people * input.galPerPersonDay * 365;
  const eff =
    input.efficiency === 'standard' ? RO_EFF_STANDARD : input.efficiency === 'watersense' ? RO_EFF_WATERSENSE : null;
  const drainRatio = input.efficiency === 'custom' ? input.customRatio : eff != null ? 1 / eff - 1 : 0;
  const toDrain = product * drainRatio;
  const waterCost = input.rate != null && Number.isFinite(input.rate) ? (toDrain / 1000) * input.rate : 0;
  const yearly = input.filtersPerYear + waterCost;
  const tenYear = upfront.typical + 10 * yearly;
  const centsPerGal = product > 0 ? (tenYear / (10 * product)) * 100 : 0;
  const waterSenseToDrain = product * (1 / RO_EFF_WATERSENSE - 1);

  return {
    upfront,
    product,
    drainRatio,
    toDrain,
    waterCost,
    filtersPerYear: input.filtersPerYear,
    yearly,
    tenYear,
    centsPerGal,
    waterSenseToDrain,
    showComparison: input.efficiency !== 'watersense',
  };
}
