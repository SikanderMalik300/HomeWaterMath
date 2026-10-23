import { describe, it, expect } from 'vitest';
import { wellTestChecker, type WellTestInput } from './wellTestChecker';

const base: WellTestInput = {
  months: '12plus',
  flooding: false,
  repair: false,
  tasteColorSmell: false,
  babyOrPregnant: false,
  construction: false,
};

describe('wellTestChecker', () => {
  it('default (12 or more, no boxes) -> Yes, test now with four core tests', () => {
    const r = wellTestChecker(base);
    expect(r.testNow).toBe(true);
    expect(r.message).toBe('Yes, test now.');
    expect(r.tests).toEqual(['total coliform', 'nitrate', 'pH', 'total dissolved solids']);
    expect(r.notes).toEqual([]);
  });

  it('under 12 months and no boxes -> no urgent need', () => {
    const r = wellTestChecker({ ...base, months: 'under12' });
    expect(r.testNow).toBe(false);
    expect(r.message).toContain('No urgent need');
  });

  it('under 12 months but a box ticked -> yes', () => {
    const r = wellTestChecker({ ...base, months: 'under12', flooding: true });
    expect(r.testNow).toBe(true);
  });

  it('never tested -> yes', () => {
    expect(wellTestChecker({ ...base, months: 'never' }).testNow).toBe(true);
  });

  it('baby/pregnant adds the nitrate priority note', () => {
    const r = wellTestChecker({ ...base, babyOrPregnant: true });
    expect(r.notes.join(' ')).toContain('Nitrate is the priority');
  });

  it('taste/color/smell adds iron, manganese, hardness, sulfate', () => {
    const r = wellTestChecker({ ...base, tasteColorSmell: true });
    expect(r.tests).toContain('iron');
    expect(r.tests).toContain('sulfate');
  });

  it('flooding or repair adds the bacteria-after-disinfecting note', () => {
    expect(wellTestChecker({ ...base, repair: true }).notes.join(' ')).toContain('bacteria after disinfecting');
  });
});
