import { describe, it, expect } from 'vitest';
import {
  SIZE_TABLE_CAPACITY,
  SIZE_TABLE_STANDARD,
  SALT_TABLE_PER_REGEN,
  COST_TABLE_BY_TYPE,
  HARDNESS_TABLE_SCALE,
} from '@/lib/content/tools';
import { CAPACITY_PER_CUFT, SIZES, UNIT_ONLY, DEALER_INSTALLED } from '@/lib/data/constants';
import { roundTo } from '@/lib/calc/round';
import { convertHardness, classifyWQA, classifyUSGS } from '@/lib/calc/hardness';

describe('static reference tables match the constants/code', () => {
  it('SIZE_TABLE_CAPACITY: capacity and grains per lb of salt', () => {
    const settings = [6, 9, 12, 15];
    settings.forEach((set, i) => {
      const cap = CAPACITY_PER_CUFT[set];
      const grainsPerLb = Math.round(cap / set);
      const row = SIZE_TABLE_CAPACITY.rows[i];
      expect(String(row[0])).toBe(String(set));
      expect(String(row[1]).replace(/,/g, '')).toBe(String(cap));
      expect(String(row[2]).replace(/,/g, '')).toBe(String(grainsPerLb));
    });
  });

  it('SIZE_TABLE_STANDARD: real capacity at 6 / 9 / 15 lb', () => {
    SIZES.forEach((s, i) => {
      const row = SIZE_TABLE_STANDARD.rows[i];
      expect(String(row[0]).replace(/,/g, '')).toBe(String(s.label));
      expect(Number(row[1])).toBe(s.cuFt);
      expect(Number(String(row[2]).replace(/,/g, ''))).toBe(s.cuFt * CAPACITY_PER_CUFT[6]);
      expect(Number(String(row[3]).replace(/,/g, ''))).toBe(s.cuFt * CAPACITY_PER_CUFT[9]);
      expect(Number(String(row[4]).replace(/,/g, ''))).toBe(s.cuFt * CAPACITY_PER_CUFT[15]);
    });
  });

  it('SALT_TABLE_PER_REGEN: cuFt x setting, round half up to 1 dp', () => {
    const settings = [6, 9, 12, 15];
    SIZES.forEach((s, i) => {
      const row = SALT_TABLE_PER_REGEN.rows[i];
      settings.forEach((set, j) => {
        expect(Number(row[j + 1])).toBe(roundTo(s.cuFt * set, 1));
      });
    });
  });

  it('COST_TABLE_BY_TYPE: ranges match the constants', () => {
    const fmt = (r: [number, number]) => `$${r[0].toLocaleString('en-US')} to $${r[1].toLocaleString('en-US')}`;
    expect(Sseq(COST_TABLE_BY_TYPE.rows[0][1])).toBe(fmt(UNIT_ONLY.single));
    expect(Sseq(COST_TABLE_BY_TYPE.rows[1][1])).toBe(fmt(UNIT_ONLY.dual));
    expect(Sseq(COST_TABLE_BY_TYPE.rows[2][1])).toBe(fmt(UNIT_ONLY.saltFree));
    expect(Sseq(COST_TABLE_BY_TYPE.rows[0][2])).toBe(fmt(DEALER_INSTALLED.single));
    expect(Sseq(COST_TABLE_BY_TYPE.rows[1][2])).toBe(fmt(DEALER_INSTALLED.dual));
    expect(Sseq(COST_TABLE_BY_TYPE.rows[2][2])).toBe(fmt(DEALER_INSTALLED.saltFree));
  });

  it('HARDNESS quick conversions pin: 10 gpg = 171.2 / 1.71 / 9.6', () => {
    const r = convertHardness(10, 'gpg');
    expect(roundTo(r.mgl, 1)).toBe(171.2);
    expect(roundTo(r.mmol, 2)).toBe(1.71);
    expect(roundTo(r.dh, 1)).toBe(9.6);
  });

  it('HARDNESS_TABLE_SCALE class boundaries agree with classifiers', () => {
    // Representative mg/L points within each band.
    expect(classifyWQA(10)).toBe('Soft');
    expect(classifyWQA(40)).toBe('Slightly hard');
    expect(classifyWQA(90)).toBe('Moderately hard');
    expect(classifyWQA(150)).toBe('Hard');
    expect(classifyWQA(200)).toBe('Very hard');
    expect(classifyUSGS(40)).toBe('Soft');
    // The table has five WQA rows.
    expect(HARDNESS_TABLE_SCALE.rows).toHaveLength(5);
  });
});

function Sseq(v: string | number): string {
  return String(v);
}
