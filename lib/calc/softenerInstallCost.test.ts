import { describe, it, expect } from 'vitest';
import { softenerInstallCost, type SoftenerInstallInput } from './softenerInstallCost';

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
});
