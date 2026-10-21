import { describe, it, expect } from 'vitest';
import { wellPumpCost, type WellPumpInput } from './wellPumpCost';

const base: WellPumpInput = {
  type: 'submersible',
  depth: 200,
  pipeWire: false,
  tank: false,
  afterHours: false,
  age: 12,
  repairQuote: null,
  replacementQuote: null,
};

describe('wellPumpCost', () => {
  it('default -> 1,750 typical, 1,000 to 2,500, hoist note', () => {
    const r = wellPumpCost(base);
    expect(r.total.typical).toBe(1750);
    expect(r.total.low).toBe(1000);
    expect(r.total.high).toBe(2500);
    expect(r.warnings).toContain('hoist');
    expect(r.pipeWire).toBeNull();
  });

  it('submersible 200 ft + pipe/wire -> 1,680 to 4,248, typ 2,964', () => {
    const r = wellPumpCost({ ...base, pipeWire: true });
    expect(r.total.low).toBe(1680);
    expect(r.total.high).toBe(4248);
    expect(r.total.typical).toBe(2964);
  });

  it('example 2: constant-pressure 300 ft + pipe/wire + tank -> 3,220 to 9,122, typ 6,171', () => {
    const r = wellPumpCost({ ...base, type: 'constantPressure', depth: 300, pipeWire: true, tank: true });
    expect(r.total.low).toBe(3220);
    expect(r.total.high).toBe(9122);
    expect(r.total.typical).toBe(6171);
  });

  it('shallow jet 20 ft -> 400 to 1,000, typ 700, no warning', () => {
    const r = wellPumpCost({ ...base, type: 'shallowJet', depth: 20 });
    expect(r.total.low).toBe(400);
    expect(r.total.high).toBe(1000);
    expect(r.total.typical).toBe(700);
    expect(r.warnings).toHaveLength(0);
  });

  it('shallow jet 40 ft -> warning', () => {
    const r = wellPumpCost({ ...base, type: 'shallowJet', depth: 40 });
    expect(r.warnings).toContain('shallowJet');
  });

  it('deep jet 100 ft + after-hours -> 750 to 2,400, typ 1,575', () => {
    const r = wellPumpCost({ ...base, type: 'deepJet', depth: 100, afterHours: true });
    expect(r.total.low).toBe(750);
    expect(r.total.high).toBe(2400);
    expect(r.total.typical).toBe(1575);
  });

  it('deep jet 200 ft -> warning', () => {
    const r = wellPumpCost({ ...base, type: 'deepJet', depth: 200 });
    expect(r.warnings).toContain('deepJet');
  });

  it('submersible 400 ft + all options -> 2,810 to 8,496, typ 5,653', () => {
    const r = wellPumpCost({ ...base, depth: 400, pipeWire: true, tank: true, afterHours: true });
    expect(r.total.low).toBe(2810);
    expect(r.total.high).toBe(8496);
    expect(r.total.typical).toBe(5653);
  });

  it('repair 900 on default (age 12) -> Replace, 51%', () => {
    const r = wellPumpCost({ ...base, repairQuote: 900 });
    expect(r.repairVerdict).toBe('replace');
    expect(r.repairPct).toBe(51);
  });

  it('repair 500 age 5 -> Repair, 29%', () => {
    const r = wellPumpCost({ ...base, age: 5, repairQuote: 500 });
    expect(r.repairVerdict).toBe('repair');
    expect(r.repairPct).toBe(29);
  });

  it('repair 900 age 5 -> Replace (ratio >= 0.5)', () => {
    const r = wellPumpCost({ ...base, age: 5, repairQuote: 900 });
    expect(r.repairVerdict).toBe('replace');
  });

  it('replacement quote 3,000 on default -> above', () => {
    const r = wellPumpCost({ ...base, replacementQuote: 3000 });
    expect(r.quoteVerdict).toBe('above');
  });

  it('depth empty (0) + pipe/wire -> no NaN', () => {
    const r = wellPumpCost({ ...base, depth: 0, pipeWire: true });
    expect(Number.isNaN(r.total.typical)).toBe(false);
    expect(r.total.typical).toBe(1750);
  });
});
