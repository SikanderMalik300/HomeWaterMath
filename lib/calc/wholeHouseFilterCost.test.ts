import { describe, it, expect } from 'vitest';
import { wholeHouseFilterCost, type WHFInput } from './wholeHouseFilterCost';
import { roundTo } from './round';

const base: WHFInput = { system: 'cartridge', uv: false, people: 4, galPerPerson: 82 };

describe('wholeHouseFilterCost', () => {
  it('default -> 850 / 500-1200 / 119,720 gal / 1.2 sets / 92.16 / 1772', () => {
    const r = wholeHouseFilterCost(base);
    expect(r.upfront.typical).toBe(850);
    expect(r.upfront.low).toBe(500);
    expect(r.upfront.high).toBe(1200);
    expect(r.gal).toBe(119720);
    expect(roundTo(r.setsPerYear, 1)).toBe(1.2);
    expect(roundTo(r.yearly, 2)).toBe(92.16);
    expect(roundTo(r.tenYear, 0)).toBe(1772);
  });

  it('2 people cartridge -> 59,860 gal, 1 set minimum, 76.98, 1620', () => {
    const r = wholeHouseFilterCost({ ...base, people: 2 });
    expect(r.gal).toBe(59860);
    expect(r.setsPerYear).toBe(1);
    expect(roundTo(r.yearly, 2)).toBe(76.98);
    expect(roundTo(r.tenYear, 0)).toBe(1620);
  });

  it('6 people -> 1.8 sets, 138.24, 2232', () => {
    const r = wholeHouseFilterCost({ ...base, people: 6 });
    expect(roundTo(r.setsPerYear, 1)).toBe(1.8);
    expect(roundTo(r.yearly, 2)).toBe(138.24);
    expect(roundTo(r.tenYear, 0)).toBe(2232);
  });

  it('carbon tank 4 -> 1150, year 8.4, media 1898, 3048', () => {
    const r = wholeHouseFilterCost({ ...base, system: 'carbonTank' });
    expect(r.upfront.typical).toBe(1150);
    expect(roundTo(r.mediaYears, 1)).toBe(8.4);
    expect(r.media).toBe(1898);
    expect(r.tenYear).toBe(3048);
  });

  it('carbon tank 2 -> no media (not inside 10 years), 1150', () => {
    const r = wholeHouseFilterCost({ ...base, system: 'carbonTank', people: 2 });
    expect(r.media).toBe(0);
    expect(r.tenYear).toBe(1150);
    expect(roundTo(r.mediaYears, 1)).toBe(10.0);
  });

  it('well + UV 4 -> 1500-5500, typ 3500, yearly 165.49, 10-yr 5155', () => {
    const r = wholeHouseFilterCost({ ...base, system: 'well', uv: true });
    expect(r.upfront.low).toBe(1500);
    expect(r.upfront.high).toBe(5500);
    expect(r.upfront.typical).toBe(3500);
    expect(roundTo(r.yearly, 2)).toBe(165.49);
    expect(roundTo(r.tenYear, 0)).toBe(5155);
  });

  it('cartridge + UV adds the lamp to yearly', () => {
    const r = wholeHouseFilterCost({ ...base, uv: true });
    expect(roundTo(r.yearly, 2)).toBe(roundTo(1.1972 * 76.98 + 125.99, 2));
  });

  it('people empty (0) -> no NaN', () => {
    const r = wholeHouseFilterCost({ ...base, people: 0 });
    expect(Number.isNaN(r.tenYear)).toBe(false);
    expect(r.gal).toBe(0);
  });

  it('carbon tank 4 media years is under 10 and media charged', () => {
    const r = wholeHouseFilterCost({ ...base, system: 'carbonTank', people: 4 });
    expect(r.mediaYears).toBeLessThan(10);
    expect(r.media).toBe(1898);
  });
});
