// Repair-or-replace check for /how-long-do-water-softeners-last/.

export const REPAIR_REPLACE_TEMPLATES = {
  replace: 'Replace: the repair is {pct}% of a new softener.',
  consider:
    'Consider replacing: the repair is only {pct}% of a new unit, but at {age} years other parts may follow.',
  budget:
    'Repair, but start budgeting: the repair is {pct}% of a new softener, and at {age} years the softener is in its last third.',
  repair: 'Repair: the repair is {pct}% of a new softener and the unit is {age} years old.',
};

export type RepairKey = 'replace' | 'consider' | 'budget' | 'repair';

export interface RepairInput {
  age: number;
  repair: number;
  newPrice: number;
}

export interface RepairResult {
  key: RepairKey;
  pct: number;
  ratio: number;
  message: string;
}

export function repairOrReplace(input: RepairInput): RepairResult {
  const ratio = input.newPrice > 0 ? input.repair / input.newPrice : 0;
  const pct = Math.round(ratio * 100);

  let key: RepairKey;
  if (ratio > 0.5) key = 'replace';
  else if (input.age >= 15) key = 'consider';
  else if (input.age >= 10) key = 'budget';
  else key = 'repair';

  const message = REPAIR_REPLACE_TEMPLATES[key]
    .replace('{pct}', String(pct))
    .replace('{age}', String(input.age));

  return { key, pct, ratio, message };
}
