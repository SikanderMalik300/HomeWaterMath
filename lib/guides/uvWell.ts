// UV-for-well-water pre-treatment check and 10-year cost for /uv-light-for-well-water/.
// Pre-treatment limits from the VIQUA UV system FAQ.

export type PreStatus = 'ok' | 'treat' | 'untested';

export interface UvPreInput {
  iron: number | null;
  manganese: number | null;
  hardness: number | null;
  tannins: number | null;
  turbidity: number | null;
  uvt: number | null;
}

export interface PreRow {
  key: keyof UvPreInput;
  label: string;
  status: PreStatus;
  fix: string | null; // inline markdown when status is 'treat'
}

interface Limit {
  key: keyof UvPreInput;
  label: string;
  // pass when below `max` (or, for uvt, above `min`)
  max?: number;
  min?: number;
  fix: string;
}

export const UV_LIMITS: Limit[] = [
  { key: 'iron', label: 'Iron', max: 0.3, fix: '[iron filter](/iron-filter-for-well-water/)' },
  { key: 'manganese', label: 'Manganese', max: 0.05, fix: '[iron filter](/iron-filter-for-well-water/)' },
  { key: 'hardness', label: 'Hardness', max: 7, fix: '[water softener](/water-softener-size-calculator/)' },
  { key: 'tannins', label: 'Tannins', max: 0.1, fix: 'tannin filter' },
  { key: 'turbidity', label: 'Turbidity', max: 1, fix: 'sediment filter' },
  { key: 'uvt', label: 'UV transmittance', min: 75, fix: 'find out why: tannins, iron or turbidity are usual causes' },
];

export function preCheck(input: UvPreInput): PreRow[] {
  return UV_LIMITS.map((l) => {
    const v = input[l.key];
    if (v == null || !Number.isFinite(v)) {
      return { key: l.key, label: l.label, status: 'untested' as PreStatus, fix: null };
    }
    const pass = l.min != null ? v > l.min : v < (l.max as number);
    return {
      key: l.key,
      label: l.label,
      status: pass ? ('ok' as PreStatus) : ('treat' as PreStatus),
      fix: pass ? null : l.fix,
    };
  });
}

export interface UvCostInput {
  unitPrice: number;
  install: number; // 0 for DIY
  outlet: number; // 0 or 250
  lampPrice: number; // per year
  sleevePrice: number; // every 3 years
  watts: number;
  rate: number; // $ per kWh
}

export interface UvCostResult {
  lampsOver10: number;
  sleevesOver10: number;
  power10: number;
  total10: number;
  perYear: number;
}

export function uvCost(i: UvCostInput): UvCostResult {
  const lampsOver10 = 9 * i.lampPrice; // the first lamp comes with the unit
  const sleevesOver10 = 3 * i.sleevePrice; // years 4, 7, 10
  const power10 = i.watts * 8.76 * i.rate * 10; // kWh a year = W x 8,760 h / 1,000
  const total10 = i.unitPrice + i.install + i.outlet + lampsOver10 + sleevesOver10 + power10;
  return { lampsOver10, sleevesOver10, power10, total10, perYear: total10 / 10 };
}
