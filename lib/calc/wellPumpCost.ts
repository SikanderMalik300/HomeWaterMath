// Well pump replacement cost.

import {
  PUMP_INSTALLED,
  PIPE_PER_FT,
  WIRE_PER_FT,
  PUMP_TANK_INSTALLED,
  PUMP_TANK_TYPICAL,
  AFTER_HOURS,
  SHALLOW_JET_MAX_FT,
  DEEP_JET_MAX_FT,
  HOIST_FT,
} from '@/lib/data/constants';
import { range, addRanges, type Range } from './range';

export type PumpType = 'submersible' | 'shallowJet' | 'deepJet' | 'constantPressure';

export interface WellPumpInput {
  type: PumpType;
  depth: number;
  pipeWire: boolean;
  tank: boolean;
  afterHours: boolean;
  age: number;
  repairQuote: number | null;
  replacementQuote: number | null;
}

export type PumpWarning = 'shallowJet' | 'deepJet' | 'hoist';

export interface WellPumpResult {
  pump: Range;
  pipeWire: Range | null;
  tank: Range | null;
  afterHours: Range | null;
  total: Range;
  repairVerdict: 'repair' | 'replace' | null;
  repairPct: number;
  quoteVerdict: 'below' | 'within' | 'above' | null;
  warnings: PumpWarning[];
}

const ZERO: Range = { low: 0, high: 0, typical: 0 };

export function wellPumpCost(input: WellPumpInput): WellPumpResult {
  const [pLow, pHigh] = PUMP_INSTALLED[input.type];
  const pump = range(pLow, pHigh);

  const perFtLow = PIPE_PER_FT[0] + WIRE_PER_FT[0]; // 3.40
  const perFtHigh = PIPE_PER_FT[1] + WIRE_PER_FT[1]; // 8.74
  const pipeWire = input.pipeWire
    ? range(input.depth * perFtLow, input.depth * perFtHigh)
    : null;

  const tank = input.tank ? range(PUMP_TANK_INSTALLED[0], PUMP_TANK_INSTALLED[1], PUMP_TANK_TYPICAL) : null;
  const afterHours = input.afterHours ? range(AFTER_HOURS[0], AFTER_HOURS[1]) : null;

  const total = addRanges(pump, pipeWire ?? ZERO, tank ?? ZERO, afterHours ?? ZERO);

  let repairVerdict: 'repair' | 'replace' | null = null;
  let repairPct = 0;
  if (input.repairQuote != null && Number.isFinite(input.repairQuote) && total.typical > 0) {
    const ratio = input.repairQuote / total.typical;
    repairPct = Math.round(ratio * 100);
    repairVerdict = input.age >= 10 || ratio >= 0.5 ? 'replace' : 'repair';
  }

  let quoteVerdict: 'below' | 'within' | 'above' | null = null;
  if (input.replacementQuote != null && Number.isFinite(input.replacementQuote)) {
    if (input.replacementQuote < total.low) quoteVerdict = 'below';
    else if (input.replacementQuote > total.high) quoteVerdict = 'above';
    else quoteVerdict = 'within';
  }

  const warnings: PumpWarning[] = [];
  if (input.type === 'shallowJet' && input.depth > SHALLOW_JET_MAX_FT) warnings.push('shallowJet');
  if (input.type === 'deepJet' && input.depth > DEEP_JET_MAX_FT) warnings.push('deepJet');
  if ((input.type === 'submersible' || input.type === 'constantPressure') && input.depth >= HOIST_FT)
    warnings.push('hoist');

  return { pump, pipeWire, tank, afterHours, total, repairVerdict, repairPct, quoteVerdict, warnings };
}
