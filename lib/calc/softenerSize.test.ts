import { describe, it, expect } from 'vitest';
import { softenerSize, sizeChartCell, type SoftenerSizeInput } from './softenerSize';
import { toGpg } from './hardness';
import { roundTo, formatInt, formatDecimal } from './round';

const base: SoftenerSizeInput = {
  people: 4,
  galPerPerson: 75,
  hardnessGpg: 15,
  ironPpm: 0,
  ironAllowance: 4,
  daysBetweenRegen: 7,
  salt: 9,
};

describe('softenerSize', () => {
  it('1. default case -> 48,000 / 1.5 / 31,500 / 4,500 / 37,500 / 8.3 days / 13.5 lb', () => {
    const r = softenerSize(base);
    expect(r.recommended?.label).toBe(48000);
    expect(r.recommended?.cuFt).toBe(1.5);
    expect(r.grainsNeeded).toBe(31500);
    expect(r.grainsPerDay).toBe(4500);
    expect(r.realCapacity).toBe(37500);
    expect(roundTo(r.daysItLasts, 1)).toBe(8.3);
    expect(roundTo(r.saltPerRegenLb, 1)).toBe(13.5);
    expect(r.compensatedGpg).toBe(15);
    expect(r.state).toBe('ok');
  });

  it('2. example 2 (2, 75, 10 gpg, 1 ppm Fe, x4) -> 14 / 2,100 / 14,700 / 24,000 / 18,750 / 8.9 / 6.75', () => {
    const r = softenerSize({ ...base, people: 2, hardnessGpg: 10, ironPpm: 1 });
    expect(r.compensatedGpg).toBe(14);
    expect(r.grainsPerDay).toBe(2100);
    expect(r.grainsNeeded).toBe(14700);
    expect(r.recommended?.label).toBe(24000);
    expect(r.realCapacity).toBe(18750);
    expect(roundTo(r.daysItLasts, 1)).toBe(8.9);
    expect(roundTo(r.saltPerRegenLb, 1)).toBe(6.8);
    expect(r.saltPerRegenLb).toBeCloseTo(6.75, 6);
  });

  it('3. default at 15 lb -> still 48,000, real 45,000, salt 22.5', () => {
    const r = softenerSize({ ...base, salt: 15 });
    expect(r.recommended?.label).toBe(48000);
    expect(r.realCapacity).toBe(45000);
    expect(roundTo(r.saltPerRegenLb, 1)).toBe(22.5);
    // 32,000 would give 30,000 < 31,500
    expect(r.rows.find((x) => x.label === 32000)?.realCapacity).toBe(30000);
  });

  it('4. 4 people, 10 gpg -> 32,000 (needs 21,000; 32k gives 25,000)', () => {
    const r = softenerSize({ ...base, hardnessGpg: 10 });
    expect(r.grainsNeeded).toBe(21000);
    expect(r.recommended?.label).toBe(32000);
    expect(r.realCapacity).toBe(25000);
  });

  it('5. iron allowance 5: 2 people, 10 gpg, 1 ppm -> compensated 15', () => {
    const r = softenerSize({ ...base, people: 2, hardnessGpg: 10, ironPpm: 1, ironAllowance: 5 });
    expect(r.compensatedGpg).toBe(15);
  });

  it('6. hardness entered as 256.77 mg/L -> 15.00 gpg -> same as default', () => {
    const gpg = toGpg(256.77, 'mgl');
    expect(roundTo(gpg, 2)).toBe(15.0);
    const r = softenerSize({ ...base, hardnessGpg: gpg });
    expect(r.recommended?.label).toBe(48000);
  });

  it('7. 6 people, 25 gpg -> over 96,000 state; 96k at 9 lb = 75,000; 11,250/day; lasts 6 days', () => {
    const r = softenerSize({ ...base, people: 6, hardnessGpg: 25 });
    expect(r.state).toBe('oversize');
    expect(r.recommended).toBeNull();
    expect(r.realCapacity96).toBe(75000);
    expect(r.grainsPerDay).toBe(11250);
    expect(r.days96).toBe(6);
  });

  it('8. hardness 0.5 gpg -> already soft headline', () => {
    const r = softenerSize({ ...base, hardnessGpg: 0.5 });
    expect(r.state).toBe('soft');
  });

  it('9. iron 2.5 ppm -> iron warning shown', () => {
    const r = softenerSize({ ...base, ironPpm: 2.5 });
    expect(r.ironWarning).toBe(true);
    expect(softenerSize({ ...base, ironPpm: 2 }).ironWarning).toBe(false);
  });

  it('10. size chart table generated equals Reference table 2 exactly (30 cells)', () => {
    const expected: (number | null)[][] = [
      [24000, 24000, 24000, 24000, 24000],
      [24000, 24000, 24000, 32000, 48000],
      [24000, 24000, 32000, 48000, 64000],
      [24000, 32000, 48000, 64000, 80000],
      [24000, 48000, 64000, 80000, 96000],
      [24000, 48000, 64000, 96000, null],
    ];
    const hardness = [5, 10, 15, 20, 25];
    let cells = 0;
    for (let p = 1; p <= 6; p++) {
      for (let h = 0; h < hardness.length; h++) {
        expect(sizeChartCell(p, hardness[h])).toBe(expected[p - 1][h]);
        cells++;
      }
    }
    expect(cells).toBe(30);
  });

  it('11. zero people -> finite numbers, no NaN in formatted output strings', () => {
    const r = softenerSize({ ...base, people: 0 });
    const strings = [
      formatInt(r.grainsNeeded),
      formatInt(r.grainsPerDay),
      formatDecimal(r.daysItLasts, 1),
      formatDecimal(r.saltPerRegenLb, 1),
    ];
    strings.forEach((s) => expect(s).not.toContain('NaN'));
  });

  it('12. FAQ number checks: 25,000/7=3,571.4; /150=23.8; /225=15.9; /300=11.9', () => {
    const perDay = 25000 / 7;
    expect(roundTo(perDay, 1)).toBe(3571.4);
    expect(roundTo(perDay / 150, 1)).toBe(23.8);
    expect(roundTo(perDay / 225, 1)).toBe(15.9);
    expect(roundTo(perDay / 300, 1)).toBe(11.9);
  });
});
