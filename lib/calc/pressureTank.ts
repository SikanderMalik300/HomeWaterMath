// Well pressure tank sizing via Boyle's law, pre-charge 2 psi below cut-in.

import {
  ATM_PSI,
  PRECHARGE_BELOW_CUTIN,
  RUN_MIN_SMALL,
  RUN_MIN_LARGE,
  HP_RUN_THRESHOLD,
  PRESSURE_TANKS,
} from '@/lib/data/constants';
import { ceilCount } from './round';

export interface PressureTankInput {
  gpm: number;
  hp: number; // 0.5 | 0.75 | 1 | 1.5 | 2
  runOverride: number | null; // null -> use the rule; else 1 or 2
  cutIn: number;
  cutOut: number;
}

export interface PressureTankResult {
  preCharge: number;
  factor: number; // usable drawdown share of tank volume
  runMinutes: number;
  drawdownNeeded: number;
  tankNeeded: number;
  recommended: number | null; // gallons, null -> needs multiple
  multipleCount: number; // tanks of 119 when recommended is null
  drawdownOfRecommended: number;
}

/** Usable drawdown fraction for a switch setting, pre-charge 2 psi below cut-in. */
export function drawdownFactor(cutIn: number, cutOut: number): number {
  const preCharge = cutIn - PRECHARGE_BELOW_CUTIN;
  return (
    (preCharge + ATM_PSI) / (cutIn + ATM_PSI) -
    (preCharge + ATM_PSI) / (cutOut + ATM_PSI)
  );
}

export function runMinutesFor(hp: number, override: number | null): number {
  if (override != null) return override;
  return hp > HP_RUN_THRESHOLD ? RUN_MIN_LARGE : RUN_MIN_SMALL;
}

export function pressureTank(input: PressureTankInput): PressureTankResult {
  const { gpm, hp, runOverride, cutIn, cutOut } = input;

  const preCharge = cutIn - PRECHARGE_BELOW_CUTIN;
  const factor = drawdownFactor(cutIn, cutOut);
  const runMinutes = runMinutesFor(hp, runOverride);
  const drawdownNeeded = gpm * runMinutes;
  const tankNeeded = factor > 0 ? drawdownNeeded / factor : 0;

  const largest = PRESSURE_TANKS[PRESSURE_TANKS.length - 1];
  const found = PRESSURE_TANKS.find((t) => t >= tankNeeded) ?? null;

  const recommended = found;
  const multipleCount = found ? 0 : ceilCount(tankNeeded / largest);
  const drawdownOfRecommended = (found ?? largest) * factor;

  return {
    preCharge,
    factor,
    runMinutes,
    drawdownNeeded,
    tankNeeded,
    recommended,
    multipleCount,
    drawdownOfRecommended,
  };
}
