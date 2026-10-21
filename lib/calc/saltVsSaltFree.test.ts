import { describe, it, expect } from 'vitest';
import { saltVsSaltFree, type SaltVsSaltFreeInput } from './saltVsSaltFree';
import { roundTo } from './round';

const base: SaltVsSaltFreeInput = {
  people: 4,
  hardnessGpg: 15,
  ironPpm: 0,
  installer: 'plumber',
  pricePerBag: 7,
  waterPerRegen: 50,
  rate: null,
  mediaLife: 1_000_000,
  mediaCost: 1548,
  prefilterPerYear: 27,
};

describe('saltVsSaltFree', () => {
  it('default -> salt 1700/105/2750, free 3000/27/4818, diff 2068, 2190 gal, year 9.1', () => {
    const r = saltVsSaltFree(base);
    expect(r.salt.upfront).toBe(1700);
    expect(r.salt.saltCostPerYear).toBe(105);
    expect(r.salt.tenYear).toBe(2750);
    expect(r.saltFree.upfront).toBe(3000);
    expect(r.saltFree.yearly).toBe(27);
    expect(r.saltFree.tenYear).toBe(4818);
    expect(r.difference).toBe(2068);
    expect(r.cheaper).toBe('salt');
    expect(roundTo(r.salt.regenGal, 0)).toBe(2190);
    expect(roundTo(r.saltFree.mediaYear, 1)).toBe(9.1);
  });

  it('rate 12 -> salt 3013, water ~26', () => {
    const r = saltVsSaltFree({ ...base, rate: 12 });
    expect(Math.round(r.salt.tenYear)).toBe(3013);
    expect(Math.round(r.salt.waterCost)).toBe(26);
  });

  it('couple 10 gpg -> 2050 vs 3270, 0 media', () => {
    const r = saltVsSaltFree({ ...base, people: 2, hardnessGpg: 10 });
    expect(r.salt.tenYear).toBe(2050);
    expect(r.saltFree.tenYear).toBe(3270);
    expect(r.saltFree.media).toBe(0);
  });

  it('5 people 20 gpg dealer rate 10 -> salt up 2500, 25 bags $175, water ~22, 10-yr 4469; free 4818', () => {
    const r = saltVsSaltFree({ ...base, people: 5, hardnessGpg: 20, installer: 'dealer', rate: 10 });
    expect(r.salt.upfront).toBe(2500);
    expect(r.salt.bags).toBe(25);
    expect(r.salt.saltCostPerYear).toBe(175);
    expect(Math.round(r.salt.waterCost)).toBe(22);
    expect(Math.round(r.salt.tenYear)).toBe(4469);
    expect(r.saltFree.tenYear).toBe(4818);
  });

  it('6 people -> 64,000 grains, 23 bags', () => {
    const r = saltVsSaltFree({ ...base, people: 6 });
    expect(r.salt.sizeLabel).toBe(64000);
    expect(r.salt.bags).toBe(23);
  });

  it('hardness 80 -> salt-free gpg warning', () => {
    const r = saltVsSaltFree({ ...base, hardnessGpg: 80 });
    expect(r.warnings).toContain('saltFreeGpg');
  });

  it('iron 0.5 -> salt-free iron warning', () => {
    const r = saltVsSaltFree({ ...base, ironPpm: 0.5 });
    expect(r.warnings).toContain('saltFreeIron');
  });

  it('DIY -> salt 1275 and salt-free 2575 upfront', () => {
    const r = saltVsSaltFree({ ...base, installer: 'diy' });
    expect(r.salt.upfront).toBe(1275);
    expect(r.saltFree.upfront).toBe(2575);
  });

  it('empty rate -> no water cost, no NaN', () => {
    const r = saltVsSaltFree({ ...base, rate: null });
    expect(r.salt.waterCost).toBe(0);
    expect(Number.isNaN(r.salt.tenYear)).toBe(false);
  });

  it('example 1 with rate 12 -> salt 3013', () => {
    const r = saltVsSaltFree({ ...base, rate: 12 });
    expect(Math.round(r.salt.tenYear)).toBe(3013);
    expect(r.saltFree.media).toBe(1548);
  });
});
