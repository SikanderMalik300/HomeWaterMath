import { describe, it, expect } from 'vitest';
import { softenerSettings } from './softenerSettings';
import { toGpg } from './hardness';

const base = {
  people: 4,
  galPerPerson: 75,
  hardnessGpg: 15,
  ironPpm: 0,
  ironAllowance: 4,
  sizeGrains: 48000,
  salt: 9,
  metered: true,
};

describe('softenerSettings', () => {
  it('default metered: 15 gpg, 37,500 grains, 2,500 gal, 300 reserve, 7 days, 13.5 lb', () => {
    const r = softenerSettings(base);
    expect(r.hardnessSetting).toBe(15);
    expect(r.capacity).toBe(37500);
    expect(r.gallonsBetween).toBe(2500);
    expect(r.reserve).toBe(300);
    expect(r.dayOverride).toBe(7);
    expect(r.saltPerRegenLb).toBe(13.5);
  });

  it('default timer: regenerate every 8 days', () => {
    const r = softenerSettings({ ...base, metered: false });
    expect(r.timerDays).toBe(8);
  });

  it('example 2: couple, 10 gpg, 1 ppm iron, 24,000 @6, timer', () => {
    const r = softenerSettings({
      people: 2,
      galPerPerson: 75,
      hardnessGpg: 10,
      ironPpm: 1,
      ironAllowance: 4,
      sizeGrains: 24000,
      salt: 6,
      metered: false,
    });
    expect(r.hardnessSetting).toBe(14);
    expect(r.capacity).toBe(15000);
    expect(r.timerDays).toBe(7);
    expect(r.saltPerRegenLb).toBe(4.5);
  });

  it('5 people, 20 gpg, 80,000 @9: hardness 20, capacity 62,500, 3,125 gal, reserve 375, day override 7', () => {
    const r = softenerSettings({
      people: 5,
      galPerPerson: 75,
      hardnessGpg: 20,
      ironPpm: 0,
      ironAllowance: 4,
      sizeGrains: 80000,
      salt: 9,
      metered: true,
    });
    expect(r.hardnessSetting).toBe(20);
    expect(r.capacity).toBe(62500);
    expect(r.gallonsBetween).toBe(3125);
    expect(r.reserve).toBe(375);
    expect(r.dayOverride).toBe(7);
  });

  it('6 people, 25 gpg, 2 ppm iron, allowance 5, 64,000 @12: hardness 35, capacity 55,000, day override 2, small-softener warning', () => {
    const r = softenerSettings({
      people: 6,
      galPerPerson: 75,
      hardnessGpg: 25,
      ironPpm: 2,
      ironAllowance: 5,
      sizeGrains: 64000,
      salt: 12,
      metered: true,
    });
    expect(r.hardnessSetting).toBe(35);
    expect(r.capacity).toBe(55000);
    expect(r.dayOverride).toBe(2);
    expect(r.smallSoftener).toBe(true);
  });

  it('1 person, 8 gpg, 48,000 @9: day override capped at 14 with cap note', () => {
    const r = softenerSettings({
      people: 1,
      galPerPerson: 75,
      hardnessGpg: 8,
      ironPpm: 0,
      ironAllowance: 4,
      sizeGrains: 48000,
      salt: 9,
      metered: true,
    });
    expect(r.dayOverride).toBe(14);
    expect(r.capped).toBe(true);
  });

  it('mg/L input 256.8 sets 15 gpg (not 16)', () => {
    const r = softenerSettings({ ...base, hardnessGpg: toGpg(256.8, 'mgl') });
    expect(r.hardnessSetting).toBe(15);
  });

  it('reserve is never above half the gallons between regenerations', () => {
    const cases = [base, { ...base, people: 1 }, { ...base, people: 8, hardnessGpg: 30 }];
    cases.forEach((c) => {
      const r = softenerSettings(c);
      expect(r.reserve).toBeLessThanOrEqual(r.gallonsBetween / 2 + 1e-9);
    });
  });

  it('empty people (0) produces no NaN and clamps days to 1', () => {
    const r = softenerSettings({ ...base, people: 0 });
    expect(Number.isNaN(r.dayOverride)).toBe(false);
    expect(Number.isNaN(r.reserve)).toBe(false);
    expect(r.dayOverride).toBe(1);
    expect(r.timerDays).toBe(1);
  });

  it('iron above 2 ppm sets the iron warning', () => {
    expect(softenerSettings({ ...base, ironPpm: 3 }).ironWarning).toBe(true);
    expect(softenerSettings({ ...base, ironPpm: 2 }).ironWarning).toBe(false);
  });
});
