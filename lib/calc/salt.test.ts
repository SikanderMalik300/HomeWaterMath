import { describe, it, expect } from 'vitest';
import { salt, saltPerYearForTable, type SaltInput } from './salt';
import { roundTo, formatInt, formatDecimal } from './round';

const base: SaltInput = {
  people: 4,
  galPerPerson: 75,
  hardnessGpg: 15,
  ironPpm: 0,
  ironAllowance: 4,
  cuFt: 1.5,
  salt: 9,
  metered: true,
  timerDays: 7,
  bagLb: 40,
  pricePerBag: 7,
};

describe('salt', () => {
  it('default case -> 591 lb, 49.3/mo, 15 bags, $105, 43.8 regens, every 8.3 days, 13.5/regen', () => {
    const r = salt(base);
    expect(Math.round(r.saltPerYearLb)).toBe(591);
    expect(roundTo(r.saltPerMonthLb, 1)).toBe(49.3);
    expect(r.bagsPerYear).toBe(15);
    expect(r.costPerYear).toBe(105);
    expect(roundTo(r.regensPerYear, 1)).toBe(43.8);
    expect(roundTo(r.daysBetween, 1)).toBe(8.3);
    expect(roundTo(r.saltPerRegenLb, 1)).toBe(13.5);
  });

  it('timer 7 days -> 52.14 regens, 703.9 lb, 18 bags, $126', () => {
    const r = salt({ ...base, metered: false, timerDays: 7 });
    expect(roundTo(r.regensPerYear, 2)).toBe(52.14);
    expect(roundTo(r.saltPerYearLb, 1)).toBe(703.9);
    expect(r.bagsPerYear).toBe(18);
    expect(r.costPerYear).toBe(126);
  });

  it('example 2 -> 2,100/day, 15,000 cap, 51.1 regens, 230.0 lb, 6 bags, ~7.1 days', () => {
    const r = salt({
      ...base,
      people: 2,
      hardnessGpg: 10,
      ironPpm: 1,
      cuFt: 0.75,
      salt: 6,
    });
    expect(r.grainsPerDay).toBe(2100);
    expect(r.capacity).toBe(15000);
    expect(roundTo(r.regensPerYear, 1)).toBe(51.1);
    expect(roundTo(r.saltPerYearLb, 1)).toBe(230.0);
    expect(r.bagsPerYear).toBe(6);
    expect(roundTo(r.daysBetween, 1)).toBe(7.1);
  });

  it('50 lb bags default home -> 591.3/50 = 11.83 -> 12 bags', () => {
    const r = salt({ ...base, bagLb: 50 });
    expect(r.bagsPerYear).toBe(12);
  });

  it('timer interval too long (4, 15 gpg, 48k, timer 9 days) -> warn, suggest 8', () => {
    const r = salt({ ...base, metered: false, timerDays: 9 });
    expect(r.warning).toBe('timerTooLong');
    expect(r.timerSuggestDays).toBe(8);
  });

  it('metered > 14 days note (1 person, 5 gpg, 24k) -> 50 days -> note', () => {
    const r = salt({ ...base, people: 1, hardnessGpg: 5, cuFt: 0.75 });
    expect(roundTo(r.daysBetween, 0)).toBe(50);
    expect(r.warning).toBe('meteredOver14');
  });

  it('reference table cells pinned: 4/15 = 591 (15); 2/10 = 197 (5)', () => {
    expect(saltPerYearForTable(4, 15)).toEqual({ lbYear: 591, bags40: 15 });
    expect(saltPerYearForTable(2, 10)).toEqual({ lbYear: 197, bags40: 5 });
  });

  it('comparison for default home at 6 / 12 / 15 lb (metered)', () => {
    const s6 = salt({ ...base, salt: 6 });
    expect(s6.capacity).toBe(30000);
    expect(roundTo(s6.regensPerYear, 2)).toBe(54.75);
    expect(s6.saltPerRegenLb).toBe(9);
    expect(roundTo(s6.saltPerYearLb, 2)).toBe(492.75);

    const s12 = salt({ ...base, salt: 12 });
    expect(s12.capacity).toBe(41250);
    expect(roundTo(s12.regensPerYear, 2)).toBe(39.82);
    expect(s12.saltPerRegenLb).toBe(18);
    expect(roundTo(s12.saltPerYearLb, 1)).toBe(716.7);

    const s15 = salt({ ...base, salt: 15 });
    expect(s15.capacity).toBe(45000);
    expect(roundTo(s15.regensPerYear, 1)).toBe(36.5);
    expect(s15.saltPerRegenLb).toBe(22.5);
    expect(roundTo(s15.saltPerYearLb, 2)).toBe(821.25);
  });

  it('salt-per-regeneration table matches static reference (round half up)', () => {
    const sizes = [0.75, 1.0, 1.5, 2.0, 2.5, 3.0];
    const settings = [6, 9, 12, 15];
    const expected = [
      [4.5, 6.8, 9.0, 11.3],
      [6.0, 9.0, 12.0, 15.0],
      [9.0, 13.5, 18.0, 22.5],
      [12.0, 18.0, 24.0, 30.0],
      [15.0, 22.5, 30.0, 37.5],
      [18.0, 27.0, 36.0, 45.0],
    ];
    sizes.forEach((cuFt, i) => {
      settings.forEach((set, j) => {
        expect(roundTo(cuFt * set, 1)).toBe(expected[i][j]);
      });
    });
  });

  it('empty input -> no NaN in formatted strings', () => {
    const r = salt({ ...base, people: 0, cuFt: 0 });
    const strings = [
      formatInt(r.saltPerYearLb),
      formatDecimal(r.saltPerMonthLb, 1),
      formatInt(r.bagsPerYear),
      formatDecimal(r.regensPerYear, 1),
    ];
    strings.forEach((s) => expect(s).not.toContain('NaN'));
  });
});
