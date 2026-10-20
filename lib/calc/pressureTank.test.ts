import { describe, it, expect } from 'vitest';
import {
  pressureTank,
  drawdownFactor,
  runMinutesFor,
  type PressureTankInput,
} from './pressureTank';
import { roundTo } from './round';

const base: PressureTankInput = {
  gpm: 10,
  hp: 1,
  runOverride: null,
  cutIn: 40,
  cutOut: 60,
};

describe('pressureTank', () => {
  it('factors 0.3446 / 0.2953 / 0.2579', () => {
    expect(roundTo(drawdownFactor(20, 40), 4)).toBe(0.3446);
    expect(roundTo(drawdownFactor(30, 50), 4)).toBe(0.2953);
    expect(roundTo(drawdownFactor(40, 60), 4)).toBe(0.2579);
  });

  it('default -> 86 gal, 20 needed, 77.5 min vol, 22.2 drawdown, 38 psi, 25.8%', () => {
    const r = pressureTank(base);
    expect(r.recommended).toBe(86);
    expect(r.drawdownNeeded).toBe(20);
    expect(roundTo(r.tankNeeded, 1)).toBe(77.5);
    expect(roundTo(r.drawdownOfRecommended, 1)).toBe(22.2);
    expect(r.preCharge).toBe(38);
    expect(roundTo(r.factor * 100, 1)).toBe(25.8);
  });

  it('example 2 (7 gpm, 1/2 hp, 30/50) -> 26 gal, 7 needed, 23.7 min, 7.7 drawdown, 28 psi', () => {
    const r = pressureTank({ gpm: 7, hp: 0.5, runOverride: null, cutIn: 30, cutOut: 50 });
    expect(r.recommended).toBe(26);
    expect(r.drawdownNeeded).toBe(7);
    expect(roundTo(r.tankNeeded, 1)).toBe(23.7);
    expect(roundTo(r.drawdownOfRecommended, 1)).toBe(7.7);
    expect(r.preCharge).toBe(28);
  });

  it('12 gpm, 1 hp, 40/60 -> 24 needed -> 93.0 -> 119 (30.7)', () => {
    const r = pressureTank({ ...base, gpm: 12 });
    expect(r.drawdownNeeded).toBe(24);
    expect(roundTo(r.tankNeeded, 1)).toBe(93.0);
    expect(r.recommended).toBe(119);
    expect(roundTo(r.drawdownOfRecommended, 1)).toBe(30.7);
  });

  it('20 gpm, 2 hp, 40/60 -> 40 needed -> 155.1 -> 2 x 119', () => {
    const r = pressureTank({ ...base, gpm: 20, hp: 2 });
    expect(r.drawdownNeeded).toBe(40);
    expect(roundTo(r.tankNeeded, 1)).toBe(155.1);
    expect(r.recommended).toBeNull();
    expect(r.multipleCount).toBe(2);
  });

  it('3/4 hp boundary -> 1 minute run time', () => {
    expect(runMinutesFor(0.75, null)).toBe(1);
    expect(runMinutesFor(1, null)).toBe(2);
  });

  it('override 2 min with 1/2 hp', () => {
    const r = pressureTank({ gpm: 10, hp: 0.5, runOverride: 2, cutIn: 40, cutOut: 60 });
    expect(r.runMinutes).toBe(2);
    expect(r.drawdownNeeded).toBe(20);
  });

  it('drawdown table (21 cells) pinned', () => {
    const tanks = [20, 26, 32, 44, 62, 86, 119];
    const switches: [number, number][] = [
      [20, 40],
      [30, 50],
      [40, 60],
    ];
    const expected: number[][] = [
      [6.9, 5.9, 5.2],
      [9.0, 7.7, 6.7],
      [11.0, 9.4, 8.3],
      [15.2, 13.0, 11.3],
      [21.4, 18.3, 16.0],
      [29.6, 25.4, 22.2],
      [41.0, 35.1, 30.7],
    ];
    let cells = 0;
    tanks.forEach((t, i) => {
      switches.forEach(([ci, co], j) => {
        expect(roundTo(t * drawdownFactor(ci, co), 1)).toBe(expected[i][j]);
        cells++;
      });
    });
    expect(cells).toBe(21);
  });

  it('common pumps table (min tank for 30/50 and 40/60)', () => {
    const rows: { gpm: number; hp: number; expect3050: number | null; expect4060: number | null }[] = [
      { gpm: 5, hp: 0.5, expect3050: 20, expect4060: 20 },
      { gpm: 7, hp: 0.5, expect3050: 26, expect4060: 32 },
      { gpm: 10, hp: 0.75, expect3050: 44, expect4060: 44 },
      { gpm: 10, hp: 1, expect3050: 86, expect4060: 86 },
      { gpm: 12, hp: 1, expect3050: 86, expect4060: 119 },
      { gpm: 15, hp: 1.5, expect3050: 119, expect4060: 119 },
      { gpm: 20, hp: 2, expect3050: null, expect4060: null },
    ];
    rows.forEach((row) => {
      const r3050 = pressureTank({ gpm: row.gpm, hp: row.hp, runOverride: null, cutIn: 30, cutOut: 50 });
      const r4060 = pressureTank({ gpm: row.gpm, hp: row.hp, runOverride: null, cutIn: 40, cutOut: 60 });
      expect(r3050.recommended).toBe(row.expect3050);
      expect(r4060.recommended).toBe(row.expect4060);
    });
  });

  it('0 gpm -> drawdown 0, recommended smallest tank, no NaN', () => {
    const r = pressureTank({ ...base, gpm: 0 });
    expect(r.drawdownNeeded).toBe(0);
    expect(Number.isNaN(r.tankNeeded)).toBe(false);
    expect(r.recommended).toBe(20);
  });
});
