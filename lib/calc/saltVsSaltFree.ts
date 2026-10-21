// Salt-based softener vs salt-free conditioner, 10-year cost.

import { softenerCost, type Installer } from './softenerCost';
import { softenerSize } from './softenerSize';
import { salt } from './salt';
import { IRON_MAX_PPM, SALT_FREE_MAX_GPG, SALT_FREE_MAX_IRON } from '@/lib/data/constants';

export interface SaltVsSaltFreeInput {
  people: number;
  hardnessGpg: number;
  ironPpm: number;
  installer: Installer;
  pricePerBag: number;
  waterPerRegen: number;
  rate: number | null; // $ per 1,000 gallons
  mediaLife: number; // gallons
  mediaCost: number;
  prefilterPerYear: number;
}

export type SvsWarning = 'saltFreeGpg' | 'saltFreeIron' | 'ironMax';

export interface SaltVsSaltFreeResult {
  salt: {
    upfront: number;
    sizeLabel: number | null;
    cuFt: number | null;
    regensPerYear: number;
    bags: number;
    saltCostPerYear: number;
    regenGal: number;
    waterCost: number;
    yearly: number;
    tenYear: number;
  };
  saltFree: {
    upfront: number;
    gal10: number;
    media: number;
    mediaYear: number;
    yearly: number; // prefilter only
    tenYear: number;
  };
  difference: number;
  cheaper: 'salt' | 'saltFree';
  hardnessGpg: number;
  warnings: SvsWarning[];
}

export function saltVsSaltFree(input: SaltVsSaltFreeInput): SaltVsSaltFreeResult {
  const { people, hardnessGpg, ironPpm, installer, pricePerBag, waterPerRegen, rate } = input;

  // Salt-based side.
  const saltUpfront = softenerCost({
    type: 'single',
    installer,
    people,
    hardnessGpg,
    pricePerBag,
    proService: false,
    quote: null,
  }).upfront.typical;

  const size = softenerSize({
    people,
    galPerPerson: 75,
    hardnessGpg,
    ironPpm,
    ironAllowance: 4,
    daysBetweenRegen: 7,
    salt: 9,
  });
  const cuFt = size.recommended?.cuFt ?? 0;
  const s = salt({
    people,
    galPerPerson: 75,
    hardnessGpg,
    ironPpm,
    ironAllowance: 4,
    cuFt,
    salt: 9,
    metered: true,
    timerDays: 7,
    bagLb: 40,
    pricePerBag,
  });
  const regenGal = s.regensPerYear * waterPerRegen;
  const waterCost = rate != null && Number.isFinite(rate) ? (regenGal / 1000) * rate : 0;
  const saltYearly = s.costPerYear + waterCost;
  const saltTenYear = saltUpfront + 10 * saltYearly;

  // Salt-free side.
  const saltFreeUpfront = softenerCost({
    type: 'saltFree',
    installer,
    people,
    hardnessGpg,
    pricePerBag,
    proService: false,
    quote: null,
  }).upfront.typical;
  const galPerYear = people * 75 * 365;
  const gal10 = galPerYear * 10;
  const media = input.mediaLife > 0 ? Math.floor(gal10 / input.mediaLife) * input.mediaCost : 0;
  const mediaYear = galPerYear > 0 ? input.mediaLife / galPerYear : 0;
  const saltFreeYearly = input.prefilterPerYear;
  const saltFreeTenYear = saltFreeUpfront + 10 * saltFreeYearly + media;

  const difference = Math.abs(saltTenYear - saltFreeTenYear);
  const cheaper: 'salt' | 'saltFree' = saltTenYear <= saltFreeTenYear ? 'salt' : 'saltFree';

  const warnings: SvsWarning[] = [];
  if (hardnessGpg > SALT_FREE_MAX_GPG) warnings.push('saltFreeGpg');
  if (ironPpm > SALT_FREE_MAX_IRON) warnings.push('saltFreeIron');
  if (ironPpm > IRON_MAX_PPM) warnings.push('ironMax');

  return {
    salt: {
      upfront: saltUpfront,
      sizeLabel: size.recommended?.label ?? null,
      cuFt: size.recommended?.cuFt ?? null,
      regensPerYear: s.regensPerYear,
      bags: s.bagsPerYear,
      saltCostPerYear: s.costPerYear,
      regenGal,
      waterCost,
      yearly: saltYearly,
      tenYear: saltTenYear,
    },
    saltFree: {
      upfront: saltFreeUpfront,
      gal10,
      media,
      mediaYear,
      yearly: saltFreeYearly,
      tenYear: saltFreeTenYear,
    },
    difference,
    cheaper,
    hardnessGpg,
    warnings,
  };
}
