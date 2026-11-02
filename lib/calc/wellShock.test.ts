import { describe, it, expect } from 'vitest';
import { wellShock, bleachForGallons, GAL_PER_FT } from './wellShock';
import { roundTo } from './round';

const base = {
  wellDepth: 200,
  staticLevel: 50,
  dia: 6,
  tankGal: 20,
  heaterGal: 50,
  toilets: 2,
  ppm: 100,
  bleachPct: 6,
};

describe('wellShock', () => {
  it('default: 220.5 well, 86 house, 306.5 total, 0.51 gal, 8.2 cups', () => {
    const r = wellShock(base);
    expect(roundTo(r.wellGal, 1)).toBe(220.5);
    expect(r.houseGal).toBe(86);
    expect(roundTo(r.totalGal, 1)).toBe(306.5);
    expect(roundTo(r.bleachGal, 2)).toBe(0.51);
    expect(roundTo(r.bleachCups, 1)).toBe(8.2);
  });

  it('example 2: 150 ft 4-inch well, water at 30 ft, 200 ppm, 8.25% -> 164.4 gal, 0.40 gal, 6.4 cups', () => {
    const r = wellShock({ wellDepth: 150, staticLevel: 30, dia: 4, tankGal: 20, heaterGal: 50, toilets: 2, ppm: 200, bleachPct: 8.25 });
    expect(roundTo(r.totalGal, 1)).toBe(164.4);
    expect(roundTo(r.bleachGal, 2)).toBe(0.4);
    expect(roundTo(r.bleachCups, 1)).toBe(6.4);
  });

  it('UGA check: 100 gallons at 200 ppm, 6% -> 0.33 gal, about 2.7 pints', () => {
    const b = bleachForGallons(100, 200, 6);
    expect(roundTo(b.gal, 2)).toBe(0.33);
    expect(roundTo(b.pints, 1)).toBe(2.7);
  });

  it('WI check: 100 gallons at 200 ppm, 5.25% -> 1.52 quarts', () => {
    const b = bleachForGallons(100, 200, 5.25);
    expect(roundTo(b.qt, 2)).toBe(1.52);
  });

  it('static level >= well depth is invalid with no NaN', () => {
    const r = wellShock({ ...base, staticLevel: 200 });
    expect(r.valid).toBe(false);
    expect(Number.isNaN(r.totalGal)).toBe(false);
    expect(r.totalGal).toBe(0);
    expect(r.bleachGal).toBe(0);
  });

  it('static level 0 sets the full-casing note', () => {
    const r = wellShock({ ...base, staticLevel: 0 });
    expect(r.valid).toBe(true);
    expect(r.fullCasing).toBe(true);
  });

  it('250 ppm sets the high-ppm warning', () => {
    expect(wellShock({ ...base, ppm: 250 }).highPpm).toBe(true);
    expect(wellShock({ ...base, ppm: 200 }).highPpm).toBe(false);
  });

  it('36-inch dug well, 20 ft deep, water at 5 ft -> 793.5 gal in the well and the dug-well warning', () => {
    const r = wellShock({ ...base, dia: 36, wellDepth: 20, staticLevel: 5 });
    expect(roundTo(r.wellGal, 1)).toBe(793.5);
    expect(r.dugWell).toBe(true);
  });

  it('pool chlorine 12.5% at the default -> 0.25 gal', () => {
    const r = wellShock({ ...base, bleachPct: 12.5 });
    expect(roundTo(r.bleachGal, 2)).toBe(0.25);
  });

  it('empty (NaN) inputs produce no NaN', () => {
    const r = wellShock({ ...base, wellDepth: NaN, staticLevel: NaN });
    expect(r.valid).toBe(false);
    expect(Number.isNaN(r.bleachGal)).toBe(false);
    expect(Number.isNaN(r.totalGal)).toBe(false);
  });

  it('GAL_PER_FT has the seven casing sizes', () => {
    expect(Object.keys(GAL_PER_FT).map(Number)).toEqual([2, 4, 5, 6, 8, 24, 36]);
  });
});
