import { describe, it, expect } from 'vitest';
import { roCost, type ROInput } from './roCost';
import { roundTo } from './round';

const base: ROInput = {
  system: 'tank',
  installer: 'plumber',
  people: 4,
  galPerPersonDay: 1,
  efficiency: 'standard',
  customRatio: 3,
  filtersPerYear: 50,
  rate: null,
  fridge: false,
  stoneHole: false,
  drain: false,
};

describe('roCost', () => {
  it('default -> 500 / 300-700 / 1460 / 8273 / 5.7 / 1000 / 6.8 / WaterSense 3407', () => {
    const r = roCost(base);
    expect(r.upfront.typical).toBe(500);
    expect(r.upfront.low).toBe(300);
    expect(r.upfront.high).toBe(700);
    expect(r.product).toBe(1460);
    expect(roundTo(r.toDrain, 0)).toBe(8273);
    expect(roundTo(r.drainRatio, 1)).toBe(5.7);
    expect(r.tenYear).toBe(1000);
    expect(roundTo(r.centsPerGal, 1)).toBe(6.8);
    expect(roundTo(r.waterSenseToDrain, 0)).toBe(3407);
    expect(r.showComparison).toBe(true);
  });

  it('WaterSense -> 3407 drain, no comparison line', () => {
    const r = roCost({ ...base, efficiency: 'watersense' });
    expect(roundTo(r.toDrain, 0)).toBe(3407);
    expect(r.showComparison).toBe(false);
  });

  it('rate 12 -> water ~99, 10-yr 1993, 13.6', () => {
    const r = roCost({ ...base, rate: 12 });
    expect(roundTo(r.waterCost, 0)).toBe(99);
    expect(Math.round(r.tenYear)).toBe(1993);
    expect(roundTo(r.centsPerGal, 1)).toBe(13.6);
  });

  it('WaterSense + rate 12 -> 1409, 9.6', () => {
    const r = roCost({ ...base, efficiency: 'watersense', rate: 12 });
    expect(Math.round(r.tenYear)).toBe(1409);
    expect(roundTo(r.centsPerGal, 1)).toBe(9.6);
  });

  it('tankless ratio 1 + fridge -> 525-1080, typ 802.5, 10-yr 1302.5, 8.9', () => {
    const r = roCost({ ...base, system: 'tankless', efficiency: 'custom', customRatio: 1, fridge: true });
    expect(r.upfront.low).toBe(525);
    expect(r.upfront.high).toBe(1080);
    expect(r.upfront.typical).toBe(802.5);
    expect(roundTo(r.tenYear, 1)).toBe(1302.5);
    expect(roundTo(r.centsPerGal, 1)).toBe(8.9);
  });

  it('countertop 2 people -> 200-700, 450, 730 gal, 4137 drain, 950, 13.0', () => {
    const r = roCost({ ...base, system: 'counter', installer: 'diy', people: 2 });
    expect(r.upfront.low).toBe(200);
    expect(r.upfront.high).toBe(700);
    expect(r.upfront.typical).toBe(450);
    expect(r.product).toBe(730);
    expect(roundTo(r.toDrain, 0)).toBe(4137);
    expect(r.tenYear).toBe(950);
    expect(roundTo(r.centsPerGal, 1)).toBe(13.0);
  });

  it('DIY tank -> 150-350, 250, 10-yr 750, 5.1', () => {
    const r = roCost({ ...base, installer: 'diy' });
    expect(r.upfront.low).toBe(150);
    expect(r.upfront.high).toBe(350);
    expect(r.upfront.typical).toBe(250);
    expect(r.tenYear).toBe(750);
    expect(roundTo(r.centsPerGal, 1)).toBe(5.1);
  });

  it('all extras on tank plumber -> 725-1880', () => {
    const r = roCost({ ...base, fridge: true, stoneHole: true, drain: true });
    expect(r.upfront.low).toBe(725);
    expect(r.upfront.high).toBe(1880);
  });

  it('people empty (0) -> no NaN', () => {
    const r = roCost({ ...base, people: 0 });
    expect(Number.isNaN(r.centsPerGal)).toBe(false);
    expect(r.toDrain).toBe(0);
  });
});
