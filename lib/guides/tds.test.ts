import { describe, it, expect } from 'vitest';
import { tdsCheck, tasteBand } from './tds';
import { roundTo } from '@/lib/calc/round';

describe('tdsCheck', () => {
  it('default 180 ppm: Excellent, below the EPA 500 mg/L guideline, no RO math', () => {
    const r = tdsCheck({ reading: 180, before: null, ec: false, factor: 0.5 });
    expect(r.ppm).toBe(180);
    expect(r.band).toBe('Excellent');
    expect(r.aboveEpa).toBe(false);
    expect(r.reductionPct).toBeNull();
    expect(r.roMeets).toBeNull();
  });

  it('before 180, after 12: 93% reduction, meets the 75% RO minimum', () => {
    const r = tdsCheck({ reading: 12, before: 180, ec: false, factor: 0.5 });
    expect(Math.round(r.reductionPct ?? 0)).toBe(93);
    expect(r.roMeets).toBe(true);
  });

  it('a 60% reduction is below the RO minimum', () => {
    const r = tdsCheck({ reading: 200, before: 500, ec: false, factor: 0.5 });
    expect(Math.round(r.reductionPct ?? 0)).toBe(60);
    expect(r.roMeets).toBe(false);
  });

  it('above 500 ppm is flagged above the EPA guideline', () => {
    expect(tdsCheck({ reading: 700, before: null, ec: false, factor: 0.5 }).aboveEpa).toBe(true);
    expect(tdsCheck({ reading: 500, before: null, ec: false, factor: 0.5 }).aboveEpa).toBe(false);
  });

  it('EC mode converts microsiemens to ppm with the factor', () => {
    const r = tdsCheck({ reading: 1000, before: null, ec: true, factor: 0.5 });
    expect(r.ppm).toBe(500);
    expect(roundTo(r.ppm, 0)).toBe(500);
  });

  it('taste bands follow the WHO breakpoints', () => {
    expect(tasteBand(299)).toBe('Excellent');
    expect(tasteBand(300)).toBe('Good');
    expect(tasteBand(600)).toBe('Fair');
    expect(tasteBand(900)).toBe('Poor');
    expect(tasteBand(1200)).toBe('Unacceptable');
  });

  it('no RO math when the after reading is higher than before', () => {
    const r = tdsCheck({ reading: 200, before: 150, ec: false, factor: 0.5 });
    expect(r.reductionPct).toBeNull();
  });
});
