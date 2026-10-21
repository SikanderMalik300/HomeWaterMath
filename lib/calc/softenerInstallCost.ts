// Water softener installation cost (labor and extras only; not the unit).

import {
  INSTALL_BASE_LABOR,
  INSTALL_BASE_TYPICAL,
  INSTALL_REMOVAL,
  INSTALL_LOOP,
  INSTALL_LOOP_TYPICAL,
  INSTALL_DRAIN,
  INSTALL_OUTLET,
} from '@/lib/data/constants';
import { range, addRanges, type Range } from './range';

export type InstallSetup = 'replace' | 'loopInPlace' | 'noLoop';

export interface SoftenerInstallInput {
  setup: InstallSetup;
  drainInReach: boolean;
  outletNear: boolean;
  permit: number;
  quote: number | null;
}

export interface SoftenerInstallResult {
  labor: Range;
  removal: Range | null;
  loop: Range | null;
  drain: Range | null;
  outlet: Range | null;
  permit: number;
  total: Range;
  quoteVerdict: 'below' | 'within' | 'above' | null;
}

export function softenerInstallCost(input: SoftenerInstallInput): SoftenerInstallResult {
  const labor = range(INSTALL_BASE_LABOR[0], INSTALL_BASE_LABOR[1], INSTALL_BASE_TYPICAL);
  const removal = input.setup === 'replace' ? range(INSTALL_REMOVAL[0], INSTALL_REMOVAL[1]) : null;
  const loop = input.setup === 'noLoop' ? range(INSTALL_LOOP[0], INSTALL_LOOP[1], INSTALL_LOOP_TYPICAL) : null;
  const drain = input.drainInReach ? null : range(INSTALL_DRAIN[0], INSTALL_DRAIN[1]);
  const outlet = input.outletNear ? null : range(INSTALL_OUTLET[0], INSTALL_OUTLET[1]);

  const permit = Number.isFinite(input.permit) && input.permit > 0 ? input.permit : 0;

  const summed = addRanges(
    labor,
    removal ?? { low: 0, high: 0, typical: 0 },
    loop ?? { low: 0, high: 0, typical: 0 },
    drain ?? { low: 0, high: 0, typical: 0 },
    outlet ?? { low: 0, high: 0, typical: 0 },
  );
  const total: Range = {
    low: summed.low + permit,
    high: summed.high + permit,
    typical: summed.typical + permit,
  };

  let quoteVerdict: 'below' | 'within' | 'above' | null = null;
  if (input.quote != null && Number.isFinite(input.quote)) {
    if (input.quote < total.low) quoteVerdict = 'below';
    else if (input.quote > total.high) quoteVerdict = 'above';
    else quoteVerdict = 'within';
  }

  return { labor, removal, loop, drain, outlet, permit, total, quoteVerdict };
}
