// Water softener cost. Reuses softenerSize and salt for the salt-based path.

import {
  UNIT_ONLY,
  DIY_KIT,
  LABOR,
  LABOR_TYPICAL,
  DEALER_INSTALLED,
  PRO_SERVICE_TYPICAL,
  COST_HORIZON_YEARS,
} from '@/lib/data/constants';
import { softenerSize } from './softenerSize';
import { salt } from './salt';

export type SystemType = 'single' | 'dual' | 'saltFree';
export type Installer = 'diy' | 'plumber' | 'dealer';
export type QuoteVerdict = 'below' | 'within' | 'above' | null;

export interface CostInput {
  type: SystemType;
  installer: Installer;
  people: number;
  hardnessGpg: number;
  pricePerBag: number;
  proService: boolean;
  quote: number | null;
}

export interface CostUpfront {
  low: number;
  high: number;
  typical: number;
}

export interface CostResult {
  upfront: CostUpfront;
  recommendedLabel: number | null; // grains, salt-based only
  recommendedCuFt: number | null;
  saltCostPerYear: number;
  bagsPerYear: number;
  serviceCostPerYear: number;
  yearlyCost: number;
  tenYearTotal: number;
  quoteVerdict: QuoteVerdict;
  comparison: Record<Installer, { upfront: number; tenYear: number }>;
}

function upfrontFor(type: SystemType, installer: Installer): CostUpfront {
  const [unitLow, unitHigh] = UNIT_ONLY[type];
  const mid = (unitLow + unitHigh) / 2;
  if (installer === 'diy') {
    return { low: unitLow + DIY_KIT, high: unitHigh + DIY_KIT, typical: mid + DIY_KIT };
  }
  if (installer === 'plumber') {
    return { low: unitLow + LABOR[0], high: unitHigh + LABOR[1], typical: mid + LABOR_TYPICAL };
  }
  // dealer
  const [dLow, dHigh] = DEALER_INSTALLED[type];
  return { low: dLow, high: dHigh, typical: (dLow + dHigh) / 2 };
}

export function softenerCost(input: CostInput): CostResult {
  const { type, installer, people, hardnessGpg, pricePerBag, proService, quote } = input;

  const upfront = upfrontFor(type, installer);

  const saltBased = type !== 'saltFree';
  let recommendedLabel: number | null = null;
  let recommendedCuFt: number | null = null;
  let saltCostPerYear = 0;
  let bagsPerYear = 0;

  if (saltBased) {
    const size = softenerSize({
      people,
      galPerPerson: 75,
      hardnessGpg,
      ironPpm: 0,
      ironAllowance: 4,
      daysBetweenRegen: 7,
      salt: 9,
    });
    if (size.recommended) {
      recommendedLabel = size.recommended.label;
      recommendedCuFt = size.recommended.cuFt;
      const s = salt({
        people,
        galPerPerson: 75,
        hardnessGpg,
        ironPpm: 0,
        ironAllowance: 4,
        cuFt: size.recommended.cuFt,
        salt: 9,
        metered: true,
        timerDays: 7,
        bagLb: 40,
        pricePerBag,
      });
      saltCostPerYear = s.costPerYear;
      bagsPerYear = s.bagsPerYear;
    }
  }

  const serviceCostPerYear = proService ? PRO_SERVICE_TYPICAL : 0;
  const yearlyCost = saltCostPerYear + serviceCostPerYear;
  const tenYearTotal = upfront.typical + COST_HORIZON_YEARS * yearlyCost;

  let quoteVerdict: QuoteVerdict = null;
  if (quote != null && Number.isFinite(quote)) {
    if (quote < upfront.low) quoteVerdict = 'below';
    else if (quote > upfront.high) quoteVerdict = 'above';
    else quoteVerdict = 'within';
  }

  const comparison = {} as Record<Installer, { upfront: number; tenYear: number }>;
  (['diy', 'plumber', 'dealer'] as Installer[]).forEach((inst) => {
    const uf = upfrontFor(type, inst);
    comparison[inst] = {
      upfront: uf.typical,
      tenYear: uf.typical + COST_HORIZON_YEARS * yearlyCost,
    };
  });

  return {
    upfront,
    recommendedLabel,
    recommendedCuFt,
    saltCostPerYear,
    bagsPerYear,
    serviceCostPerYear,
    yearlyCost,
    tenYearTotal,
    quoteVerdict,
    comparison,
  };
}
