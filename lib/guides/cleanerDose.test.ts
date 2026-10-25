import { describe, it, expect } from 'vitest';
import { cleanerDose, formatCups, CLEANER_PRODUCTS } from './cleanerDose';
import { roundTo } from '@/lib/calc/round';

describe('cleanerDose', () => {
  it('default Res Care, 48,000 (1.5 cu ft): first clean 6 oz (0.75 cup)', () => {
    const r = cleanerDose('resCare', 48000, 44);
    expect(r.type).toBe('liquid');
    expect(r.cuFt).toBe(1.5);
    expect(r.firstOz).toBe(6);
    expect(r.firstCups).toBe(0.75);
    expect(formatCups(r.firstCups)).toBe('¾ cup');
  });

  it('Res Care maintenance for 1.5 cu ft: 0.75 oz per regen, 33 oz a year, gallon lasts about 3.9 years', () => {
    const r = cleanerDose('resCare', 48000, 44);
    expect(r.hasRange).toBe(false);
    expect(r.maintOzLow).toBe(0.75);
    expect(r.maintYearLow).toBe(33);
    expect(roundTo(r.gallonYearsLow, 1)).toBe(3.9);
  });

  it('Res-Up shows a maintenance range of 0.5 to 1 oz per cu ft', () => {
    const r = cleanerDose('resUp', 48000, 44);
    expect(r.hasRange).toBe(true);
    expect(r.firstOz).toBe(6);
    expect(r.maintOzLow).toBe(0.75);
    expect(r.maintOzHigh).toBe(1.5);
  });

  it('OUT Filter Mate maintenance range is 1 to 2 oz per cu ft', () => {
    const r = cleanerDose('filterMate', 48000, 44);
    expect(r.hasRange).toBe(true);
    expect(r.maintOzLow).toBe(1.5);
    expect(r.maintOzHigh).toBe(3);
  });

  it('Iron OUT is a powder with no per-cu-ft liquid math', () => {
    const r = cleanerDose('ironOut', 48000, 44);
    expect(r.type).toBe('powder');
    expect(r.firstOz).toBe(0);
    expect(r.maintYearLow).toBe(0);
  });

  it('a 1 cu ft softener (32,000) takes 4 oz (0.5 cup) for a first Res Care clean', () => {
    const r = cleanerDose('resCare', 32000, 44);
    expect(r.firstOz).toBe(4);
    expect(formatCups(r.firstCups)).toBe('½ cup');
  });

  it('formatCups renders eighth-of-a-cup fractions', () => {
    expect(formatCups(0.375)).toBe('⅜ cup');
    expect(formatCups(1)).toBe('1 cup');
    expect(formatCups(1.25)).toBe('1¼ cups');
    expect(formatCups(1.5)).toBe('1½ cups');
  });

  it('has four products', () => {
    expect(CLEANER_PRODUCTS.map((p) => p.id)).toEqual(['resCare', 'resUp', 'ironOut', 'filterMate']);
  });
});
