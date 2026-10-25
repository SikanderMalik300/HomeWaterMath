import { describe, it, expect } from 'vitest';
import { sodium } from './sodium';
import { formatDecimal, formatInt } from '@/lib/calc/round';

describe('sodium', () => {
  it('default 15 gpg, 2 L/day: 118.0 mg/L, 236 mg a day, 10% of 2,300, 16% of 1,500, both flags', () => {
    const r = sodium(15, 'gpg', 2);
    expect(formatDecimal(r.mgPerL, 1)).toBe('118.0');
    expect(formatInt(r.mgPerDay)).toBe('236');
    expect(formatInt(r.pct2300)).toBe('10');
    expect(formatInt(r.pct1500)).toBe('16');
    expect(r.aboveEpaGuidance).toBe(true);
    expect(r.mayTasteSalty).toBe(true);
  });

  it('20 gpg gives 157.3 mg/L and about 315 mg at 2 L a day (table check)', () => {
    const r = sodium(20, 'gpg', 2);
    expect(formatDecimal(r.mgPerL, 1)).toBe('157.3');
    expect(formatInt(r.mgPerDay)).toBe('315');
  });

  it('5 gpg: about 39 mg/L and about 79 mg at 2 L', () => {
    const r = sodium(5, 'gpg', 2);
    expect(formatInt(r.mgPerL)).toBe('39');
    expect(formatInt(r.mgPerDay)).toBe('79');
  });

  it('low hardness stays under the EPA guidance and taste flags', () => {
    const r = sodium(2, 'gpg', 2);
    expect(r.aboveEpaGuidance).toBe(false);
    expect(r.mayTasteSalty).toBe(false);
  });

  it('taste flag triggers only above 60 mg/L', () => {
    // 8 gpg -> 62.9 mg/L, above 60; 7 gpg -> 55.0, below.
    expect(sodium(8, 'gpg', 2).mayTasteSalty).toBe(true);
    expect(sodium(7, 'gpg', 2).mayTasteSalty).toBe(false);
  });

  it('accepts mg/L input', () => {
    const r = sodium(256.8, 'mgl', 2);
    expect(formatDecimal(r.mgPerL, 1)).toBe('118.0');
  });
});
