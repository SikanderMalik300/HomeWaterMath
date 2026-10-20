// Water softener salt usage.

import { capacityPerCuFt } from './softenerSize';
import { ceilCount } from './round';

export interface SaltInput {
  people: number;
  galPerPerson: number;
  hardnessGpg: number;
  ironPpm: number;
  ironAllowance: number;
  cuFt: number;
  salt: number; // 6 | 9 | 12 | 15
  metered: boolean;
  timerDays: number; // used only when !metered
  bagLb: number; // 40 | 50
  pricePerBag: number;
}

export type SaltWarning = 'none' | 'meteredOver14' | 'timerTooLong';

export interface SaltResult {
  grainsPerDay: number;
  capacity: number;
  regensPerYear: number;
  saltPerRegenLb: number;
  saltPerYearLb: number;
  saltPerMonthLb: number;
  bagsPerYear: number;
  costPerYear: number;
  daysBetween: number;
  warning: SaltWarning;
  timerSuggestDays: number; // floor(capacity / grainsPerDay) when timer too long
}

export function salt(input: SaltInput): SaltResult {
  const {
    people,
    galPerPerson,
    hardnessGpg,
    ironPpm,
    ironAllowance,
    cuFt,
    salt: setting,
    metered,
    timerDays,
    bagLb,
    pricePerBag,
  } = input;

  const grainsPerDay = people * galPerPerson * (hardnessGpg + ironPpm * ironAllowance);
  const capacity = cuFt * capacityPerCuFt(setting);

  const regensPerYear = metered
    ? capacity > 0
      ? (365 * grainsPerDay) / capacity
      : 0
    : timerDays > 0
      ? 365 / timerDays
      : 0;

  const saltPerRegenLb = cuFt * setting;
  const saltPerYearLb = regensPerYear * saltPerRegenLb;
  const saltPerMonthLb = saltPerYearLb / 12;
  const bagsPerYear = bagLb > 0 ? ceilCount(saltPerYearLb / bagLb) : 0;
  const costPerYear = bagsPerYear * pricePerBag;
  const daysBetween = metered
    ? grainsPerDay > 0
      ? capacity / grainsPerDay
      : 0
    : timerDays;

  const timerSuggestDays = grainsPerDay > 0 ? Math.floor(capacity / grainsPerDay) : 0;

  let warning: SaltWarning = 'none';
  if (metered && daysBetween > 14) warning = 'meteredOver14';
  else if (!metered && grainsPerDay * timerDays > capacity) warning = 'timerTooLong';

  return {
    grainsPerDay,
    capacity,
    regensPerYear,
    saltPerRegenLb,
    saltPerYearLb,
    saltPerMonthLb,
    bagsPerYear,
    costPerYear,
    daysBetween,
    warning,
    timerSuggestDays,
  };
}

/** Salt per year for the reference table (metered, 48k/9lb, 75 gal). */
export function saltPerYearForTable(people: number, hardnessGpg: number): {
  lbYear: number;
  bags40: number;
} {
  const r = salt({
    people,
    galPerPerson: 75,
    hardnessGpg,
    ironPpm: 0,
    ironAllowance: 4,
    cuFt: 1.5,
    salt: 9,
    metered: true,
    timerDays: 7,
    bagLb: 40,
    pricePerBag: 7,
  });
  return { lbYear: Math.round(r.saltPerYearLb), bags40: r.bagsPerYear };
}
