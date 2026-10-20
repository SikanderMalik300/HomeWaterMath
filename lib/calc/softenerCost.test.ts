import { describe, it, expect } from 'vitest';
import { softenerCost, type CostInput } from './softenerCost';

const base: CostInput = {
  type: 'single',
  installer: 'plumber',
  people: 4,
  hardnessGpg: 15,
  pricePerBag: 7,
  proService: false,
  quote: null,
};

describe('softenerCost', () => {
  it('default (single, plumber, 4, 15) -> $1,700 / $650-$2,700 / 48k / 15 bags / $105 / $2,750', () => {
    const r = softenerCost(base);
    expect(r.upfront.typical).toBe(1700);
    expect(r.upfront.low).toBe(650);
    expect(r.upfront.high).toBe(2700);
    expect(r.recommendedLabel).toBe(48000);
    expect(r.bagsPerYear).toBe(15);
    expect(r.saltCostPerYear).toBe(105);
    expect(r.serviceCostPerYear).toBe(0);
    expect(r.tenYearTotal).toBe(2750);
  });

  it('DIY single -> $1,275 ($675-$1,875), 10-yr $2,325', () => {
    const r = softenerCost({ ...base, installer: 'diy' });
    expect(r.upfront.typical).toBe(1275);
    expect(r.upfront.low).toBe(675);
    expect(r.upfront.high).toBe(1875);
    expect(r.tenYearTotal).toBe(2325);
  });

  it('Dealer single -> $2,500 ($1,200-$3,800), 10-yr $3,550', () => {
    const r = softenerCost({ ...base, installer: 'dealer' });
    expect(r.upfront.typical).toBe(2500);
    expect(r.upfront.low).toBe(1200);
    expect(r.upfront.high).toBe(3800);
    expect(r.tenYearTotal).toBe(3550);
  });

  it('comparison rows (single, default home, no pro service)', () => {
    const r = softenerCost(base);
    expect(r.comparison.diy).toEqual({ upfront: 1275, tenYear: 2325 });
    expect(r.comparison.plumber).toEqual({ upfront: 1700, tenYear: 2750 });
    expect(r.comparison.dealer).toEqual({ upfront: 2500, tenYear: 3550 });
  });

  it('example 2 (dual, dealer, 5 people, 20 gpg, pro) -> $3,350 / 80k / 25 bags $175 / $375 yr / $7,100', () => {
    const r = softenerCost({
      ...base,
      type: 'dual',
      installer: 'dealer',
      people: 5,
      hardnessGpg: 20,
      proService: true,
    });
    expect(r.upfront.typical).toBe(3350);
    expect(r.recommendedLabel).toBe(80000);
    expect(r.bagsPerYear).toBe(25);
    expect(r.saltCostPerYear).toBe(175);
    expect(r.yearlyCost).toBe(375);
    expect(r.tenYearTotal).toBe(7100);
  });

  it('salt-free plumber -> typical $3,000 ($950-$5,000), salt $0', () => {
    const r = softenerCost({ ...base, type: 'saltFree' });
    expect(r.upfront.typical).toBe(3000);
    expect(r.upfront.low).toBe(950);
    expect(r.upfront.high).toBe(5000);
    expect(r.saltCostPerYear).toBe(0);
    expect(r.recommendedLabel).toBeNull();
  });

  it('quote checks for single dealer: 4,200 above, 1,000 below, 2,000 within', () => {
    expect(softenerCost({ ...base, installer: 'dealer', quote: 4200 }).quoteVerdict).toBe('above');
    expect(softenerCost({ ...base, installer: 'dealer', quote: 1000 }).quoteVerdict).toBe('below');
    expect(softenerCost({ ...base, installer: 'dealer', quote: 2000 }).quoteVerdict).toBe('within');
  });

  it('salt price $10 default home -> $150/yr', () => {
    const r = softenerCost({ ...base, pricePerBag: 10 });
    expect(r.saltCostPerYear).toBe(150);
  });

  it('empty people -> no NaN in totals', () => {
    const r = softenerCost({ ...base, people: 0 });
    expect(Number.isNaN(r.tenYearTotal)).toBe(false);
    expect(Number.isNaN(r.upfront.typical)).toBe(false);
  });

  it('pro service adds the $200 typical to yearly and ten-year totals', () => {
    const r = softenerCost({ ...base, proService: true });
    expect(r.serviceCostPerYear).toBe(200);
    expect(r.yearlyCost).toBe(305);
    expect(r.tenYearTotal).toBe(1700 + 10 * 305);
  });
});
