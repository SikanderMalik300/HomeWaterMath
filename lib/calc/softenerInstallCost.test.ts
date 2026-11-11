import { describe, it, expect } from 'vitest';
import { softenerInstallCost, type SoftenerInstallInput } from './softenerInstallCost';
import {
  stateLabor,
  laborComparison,
  laborIndex,
  STATE_LIST,
  PLUMBER_WAGE_MAY2025,
} from '@/lib/data/plumberWages';

const base: SoftenerInstallInput = {
  setup: 'replace',
  drainInReach: true,
  outletNear: true,
  permit: 0,
  quote: null,
};

describe('softenerInstallCost', () => {
  it('default (replace, drain+outlet in reach) -> 675 / 200-1100, labor + removal rows', () => {
    const r = softenerInstallCost(base);
    expect(r.total.typical).toBe(675);
    expect(r.total.low).toBe(200);
    expect(r.total.high).toBe(1100);
    expect(r.removal).not.toBeNull();
    expect(r.loop).toBeNull();
  });

  it('loop in place, no softener -> 600 / 150-1000', () => {
    const r = softenerInstallCost({ ...base, setup: 'loopInPlace' });
    expect(r.total.typical).toBe(600);
    expect(r.total.low).toBe(150);
    expect(r.total.high).toBe(1000);
    expect(r.removal).toBeNull();
  });

  it('no loop -> 1500 / 350-3000', () => {
    const r = softenerInstallCost({ ...base, setup: 'noLoop' });
    expect(r.total.typical).toBe(1500);
    expect(r.total.low).toBe(350);
    expect(r.total.high).toBe(3000);
  });

  it('no loop + no drain + no outlet + 84 permit -> 2359 / 884-4184', () => {
    const r = softenerInstallCost({ ...base, setup: 'noLoop', drainInReach: false, outletNear: false, permit: 84 });
    expect(r.total.typical).toBe(2359);
    expect(r.total.low).toBe(884);
    expect(r.total.high).toBe(4184);
  });

  it('no loop + no drain -> 2050 / 650-3800', () => {
    const r = softenerInstallCost({ ...base, setup: 'noLoop', drainInReach: false });
    expect(r.total.typical).toBe(2050);
    expect(r.total.low).toBe(650);
    expect(r.total.high).toBe(3800);
  });

  it('quote 1,500 on default -> above', () => {
    expect(softenerInstallCost({ ...base, quote: 1500 }).quoteVerdict).toBe('above');
  });

  it('quote 150 on default -> below', () => {
    expect(softenerInstallCost({ ...base, quote: 150 }).quoteVerdict).toBe('below');
  });

  it('empty permit stays 0 and does not add to totals', () => {
    const r = softenerInstallCost({ ...base, permit: 0 });
    expect(r.permit).toBe(0);
    expect(r.total.typical).toBe(675);
  });

  it('default US average (replacing) keeps labor 150-1000 and typical total 675', () => {
    const r = softenerInstallCost({ ...base, state: 'United States' });
    expect(r.labor.low).toBe(150);
    expect(r.labor.high).toBe(1000);
    expect(r.labor.typical).toBe(600);
    expect(r.total.typical).toBe(675);
  });

  it('Oregon (replacing): labor 205-1365, typical labor 820, typical total 895', () => {
    const r = softenerInstallCost({ ...base, state: 'Oregon' });
    expect(r.labor.low).toBe(205);
    expect(r.labor.high).toBe(1365);
    expect(r.labor.typical).toBe(820);
    expect(r.total.typical).toBe(895);
    expect(laborComparison('Oregon')).toBe('about 36% above');
  });

  it('Arkansas (replacing): labor 105-700, typical 420, typical total 495, about 30% below', () => {
    const r = softenerInstallCost({ ...base, state: 'Arkansas' });
    expect(r.labor.low).toBe(105);
    expect(r.labor.high).toBe(700);
    expect(r.labor.typical).toBe(420);
    expect(r.total.typical).toBe(495);
    expect(laborComparison('Arkansas')).toBe('about 30% below');
  });

  it('typical labor by state: Wisconsin 705, Texas 505, California 685, Florida 465', () => {
    expect(stateLabor('Wisconsin').typical).toBe(705);
    expect(stateLabor('Texas').typical).toBe(505);
    expect(stateLabor('California').typical).toBe(685);
    expect(stateLabor('Florida').typical).toBe(465);
  });

  it('comparison wording: Kentucky about 5% below, Kansas about the same as', () => {
    expect(laborComparison('Kentucky')).toBe('about 5% below');
    expect(laborComparison('Kansas')).toBe('about the same as');
  });

  it('every state in the data has a finite wage and index, 51 selectable states', () => {
    expect(STATE_LIST).toHaveLength(51);
    STATE_LIST.forEach((s) => {
      expect(Number.isFinite(PLUMBER_WAGE_MAY2025[s]), s).toBe(true);
      const sl = stateLabor(s);
      expect(Number.isFinite(sl.low) && Number.isFinite(sl.high) && Number.isFinite(sl.typical), s).toBe(true);
      expect(Number.isFinite(laborIndex(s)), s).toBe(true);
    });
  });

  it('an unknown state falls back to the US average (no NaN)', () => {
    const r = softenerInstallCost({ ...base, state: 'Atlantis' });
    expect(r.labor.typical).toBe(600);
    expect(Number.isNaN(r.total.typical)).toBe(false);
  });
});
