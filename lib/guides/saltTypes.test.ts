import { describe, it, expect } from 'vitest';
import { saltTypeCost, SALT_TYPES } from './saltTypes';
import { formatInt } from '@/lib/calc/round';

function cost(id: string, lb: number) {
  const t = SALT_TYPES.find((s) => s.id === id)!;
  return saltTypeCost(lb, t.defaultPrice, t.factor);
}

describe('saltTypeCost', () => {
  it('default 600 lb/year: pellets 15 bags, $131', () => {
    const r = cost('pellets', 600);
    expect(r.poundsYear).toBe(600);
    expect(r.bagsYear).toBe(15);
    expect(formatInt(r.costYear)).toBe('131');
  });

  it('solar matches pellets at 15 bags, $131', () => {
    const r = cost('solar', 600);
    expect(r.bagsYear).toBe(15);
    expect(formatInt(r.costYear)).toBe('131');
  });

  it('iron-fighting pellets: 15 bags, $150', () => {
    const r = cost('ironPell', 600);
    expect(r.bagsYear).toBe(15);
    expect(formatInt(r.costYear)).toBe('150');
  });

  it('potassium chloride needs 684 lb, 18 bags, $718', () => {
    const r = cost('kcl', 600);
    expect(formatInt(r.poundsYear)).toBe('684');
    expect(r.bagsYear).toBe(18);
    expect(formatInt(r.costYear)).toBe('718');
  });

  it('potassium chloride costs more than five times pellets', () => {
    const kcl = cost('kcl', 600).costYear;
    const pellets = cost('pellets', 600).costYear;
    expect(kcl / pellets).toBeGreaterThan(5);
  });

  it('has four salt types', () => {
    expect(SALT_TYPES.map((s) => s.id)).toEqual(['pellets', 'solar', 'ironPell', 'kcl']);
  });

  it('empty usage gives no NaN', () => {
    const r = saltTypeCost(0, 8.76, 1);
    expect(r.bagsYear).toBe(0);
    expect(r.costYear).toBe(0);
  });
});
