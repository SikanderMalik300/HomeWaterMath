import { describe, it, expect } from 'vitest';
import { stripDecode, STRIP_BLOCKS } from './stripDecoder';

describe('stripDecode', () => {
  it('default 120 ppm -> 7.0 gpg, 100 to 150 ppm, 5.8 to 8.8 gpg, Moderately hard (USGS)', () => {
    const r = stripDecode(120);
    expect(r.block).toBe(120);
    expect(r.blockGpg).toBe(7.0);
    expect(r.low).toBe(100);
    expect(r.high).toBe(150);
    expect(r.lowGpg).toBe(5.8);
    expect(r.highGpg).toBe(8.8);
    expect(r.usgsClass).toBe('Moderately hard');
  });

  it('first block 0 -> low 0, high 20, Soft', () => {
    const r = stripDecode(0);
    expect(r.low).toBe(0);
    expect(r.high).toBe(20);
    expect(r.usgsClass).toBe('Soft');
  });

  it('40 ppm -> low 20, high 60', () => {
    const r = stripDecode(40);
    expect(r.low).toBe(20);
    expect(r.high).toBe(60);
  });

  it('top block 1000 -> open-ended high (null), low 712.5', () => {
    const r = stripDecode(1000);
    expect(r.low).toBe(712.5);
    expect(r.high).toBeNull();
    expect(r.highGpg).toBeNull();
  });

  it('180 ppm -> Hard (USGS); 250 ppm -> Very hard', () => {
    expect(stripDecode(180).usgsClass).toBe('Hard');
    expect(stripDecode(250).usgsClass).toBe('Very hard');
  });

  it('gpg conversions use divide by 17.1', () => {
    const r = stripDecode(180);
    expect(r.blockGpg).toBe(10.5);
    expect(r.low).toBe(150);
    expect(r.high).toBe(215);
  });

  it('has all eight blocks', () => {
    expect(STRIP_BLOCKS).toEqual([0, 40, 80, 120, 180, 250, 425, 1000]);
  });
});
