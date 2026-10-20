import { describe, it, expect } from 'vitest';
import {
  convertHardness,
  toGpg,
  classifyWQA,
  classifyUSGS,
  isValidHardnessInput,
} from './hardness';
import { roundTo } from './round';

describe('hardness converter', () => {
  it('15 gpg -> 256.8 mg/L, 2.565 mmol/L, 14.39 dH, 25.7 fH; Very hard both; sodium 118', () => {
    const r = convertHardness(15, 'gpg');
    expect(roundTo(r.gpg, 2)).toBe(15.0);
    expect(roundTo(r.mgl, 1)).toBe(256.8);
    expect(roundTo(r.mmol, 3)).toBe(2.565);
    expect(roundTo(r.dh, 2)).toBe(14.39);
    expect(roundTo(r.fh, 1)).toBe(25.7);
    expect(r.wqa).toBe('Very hard');
    expect(r.usgs).toBe('Very hard');
    expect(Math.round(r.sodiumAddedMgPerL)).toBe(118);
  });

  it('120 mg/L -> 7.01 gpg, Moderately hard on both scales', () => {
    const r = convertHardness(120, 'mgl');
    expect(roundTo(r.gpg, 2)).toBe(7.01);
    expect(r.wqa).toBe('Moderately hard');
    expect(r.usgs).toBe('Moderately hard');
  });

  it('WQA boundaries: 17.0 Soft, 17.1 Slightly hard, 60 Slightly hard, 60.5 Moderately hard', () => {
    expect(classifyWQA(17.0)).toBe('Soft');
    expect(classifyWQA(17.1)).toBe('Slightly hard');
    expect(classifyWQA(60)).toBe('Slightly hard');
    expect(classifyWQA(60.5)).toBe('Moderately hard');
  });

  it('USGS boundaries: 60 Soft, 60.5 Moderately hard, 180 Hard, 180.1 Very hard', () => {
    expect(classifyUSGS(60)).toBe('Soft');
    expect(classifyUSGS(60.5)).toBe('Moderately hard');
    expect(classifyUSGS(180)).toBe('Hard');
    expect(classifyUSGS(180.1)).toBe('Very hard');
  });

  it('180 Hard both, 180.1 Very hard both', () => {
    expect(classifyWQA(180)).toBe('Hard');
    expect(classifyWQA(180.1)).toBe('Very hard');
    expect(classifyUSGS(180)).toBe('Hard');
    expect(classifyUSGS(180.1)).toBe('Very hard');
  });

  it('10 dH -> 178.48 mg/L -> 10.43 gpg', () => {
    const r = convertHardness(10, 'dh');
    expect(roundTo(r.mgl, 2)).toBe(178.48);
    expect(roundTo(r.gpg, 2)).toBe(10.43);
  });

  it('2 mmol/L -> 200.17 mg/L -> 11.69 gpg', () => {
    const r = convertHardness(2, 'mmol');
    expect(roundTo(r.mgl, 2)).toBe(200.17);
    expect(roundTo(r.gpg, 2)).toBe(11.69);
  });

  it('25 fH -> 250 mg/L -> 14.60 gpg', () => {
    const r = convertHardness(25, 'fh');
    expect(roundTo(r.mgl, 1)).toBe(250.0);
    expect(roundTo(r.gpg, 2)).toBe(14.6);
  });

  it('FAQ: 200/17.1181 = 11.68 (text rounds to 11.7); 300 -> 17.53', () => {
    expect(roundTo(toGpg(200, 'mgl'), 2)).toBe(11.68);
    expect(roundTo(toGpg(300, 'mgl'), 2)).toBe(17.53);
  });

  it('sodium: 15 gpg -> 117.96 -> 118', () => {
    const r = convertHardness(15, 'gpg');
    expect(roundTo(r.sodiumAddedMgPerL, 2)).toBe(117.96);
    expect(Math.round(r.sodiumAddedMgPerL)).toBe(118);
  });

  it('0 input -> all zeros, Soft on both', () => {
    const r = convertHardness(0, 'gpg');
    expect(r.mgl).toBe(0);
    expect(r.gpg).toBe(0);
    expect(r.wqa).toBe('Soft');
    expect(r.usgs).toBe('Soft');
  });

  it('negative -> invalid input', () => {
    expect(isValidHardnessInput(-5)).toBe(false);
    expect(isValidHardnessInput(15)).toBe(true);
    expect(isValidHardnessInput(NaN)).toBe(false);
  });

  it('quick-conversions table pin: 10 gpg = 171.2 mg/L, 1.71 mmol/L, 9.6 dH', () => {
    const r = convertHardness(10, 'gpg');
    expect(roundTo(r.mgl, 1)).toBe(171.2);
    expect(roundTo(r.mmol, 2)).toBe(1.71);
    expect(roundTo(r.dh, 1)).toBe(9.6);
  });
});
