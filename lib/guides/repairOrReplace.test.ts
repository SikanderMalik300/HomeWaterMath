import { describe, it, expect } from 'vitest';
import { repairOrReplace, type RepairInput } from './repairOrReplace';

const base: RepairInput = { age: 12, repair: 500, newPrice: 1500 };

describe('repairOrReplace', () => {
  it('default (age 12, $500, $1,500) -> budget message, 33%', () => {
    const r = repairOrReplace(base);
    expect(r.key).toBe('budget');
    expect(r.pct).toBe(33);
    expect(r.message).toBe(
      'Repair, but start budgeting: the repair is 33% of a new softener, and at 12 years the softener is in its last third.',
    );
  });

  it('repair over half -> replace', () => {
    const r = repairOrReplace({ ...base, repair: 900 });
    expect(r.key).toBe('replace');
    expect(r.pct).toBe(60);
  });

  it('age 15+ with low ratio -> consider', () => {
    const r = repairOrReplace({ age: 16, repair: 300, newPrice: 1500 });
    expect(r.key).toBe('consider');
    expect(r.pct).toBe(20);
  });

  it('young unit, low ratio -> repair', () => {
    const r = repairOrReplace({ age: 5, repair: 300, newPrice: 1500 });
    expect(r.key).toBe('repair');
    expect(r.message).toContain('5 years old');
  });

  it('boundary age 10 -> budget; age 9 -> repair', () => {
    expect(repairOrReplace({ age: 10, repair: 300, newPrice: 1500 }).key).toBe('budget');
    expect(repairOrReplace({ age: 9, repair: 300, newPrice: 1500 }).key).toBe('repair');
  });

  it('exactly 50% is not replace (ratio must exceed 0.5)', () => {
    expect(repairOrReplace({ age: 5, repair: 750, newPrice: 1500 }).key).toBe('repair');
  });

  it('pct rounds the ratio', () => {
    expect(repairOrReplace({ age: 5, repair: 333, newPrice: 1500 }).pct).toBe(22);
  });
});
