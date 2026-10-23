import { describe, it, expect } from 'vitest';
import { ironPicker, type IronInput } from './ironPicker';

const base: IronInput = { iron: 3, manganese: 0, h2s: false, ph: 7, slime: false, peakFlow: 9 };

describe('ironPicker', () => {
  it('default (3, 0, no H2S, pH 7, no slime, 9 gpm) -> AIO or greensand, 10x54 tank, Birm option, cost', () => {
    const r = ironPicker(base);
    expect(r.recommendation).toBe('aioOrGreensand');
    expect(r.isFilter).toBe(true);
    expect(r.tank).toEqual({ label: '10 x 54 in', cuFt: 1.5, backwash: 10 });
    expect(r.birm).toBe('yes');
    expect(r.backwashLine).toContain('10 gpm');
    expect(r.costLine).toContain('$1,000 to $3,500');
  });

  it('iron 0.2, Mn 0 -> none, no tank', () => {
    const r = ironPicker({ ...base, iron: 0.2 });
    expect(r.recommendation).toBe('none');
    expect(r.isFilter).toBe(false);
    expect(r.tank).toBeNull();
    expect(r.costLine).toBeNull();
  });

  it('combined > 10 -> chlorine + filter', () => {
    const r = ironPicker({ ...base, iron: 8, manganese: 3 });
    expect(r.recommendation).toBe('chlorine');
    expect(r.isFilter).toBe(true);
  });

  it('clear-water <= 2 ppm, no H2S -> softener, no tank', () => {
    const r = ironPicker({ ...base, iron: 1.5 });
    expect(r.recommendation).toBe('softener');
    expect(r.isSoftener).toBe(true);
    expect(r.tank).toBeNull();
  });

  it('H2S present with low iron -> AIO filter', () => {
    const r = ironPicker({ ...base, iron: 1, h2s: true });
    expect(r.recommendation).toBe('aio');
    expect(r.isFilter).toBe(true);
  });

  it('Birm not a fit when pH < 6.8 or H2S', () => {
    expect(ironPicker({ ...base, ph: 6.5 }).birm).toBe('no');
    expect(ironPicker({ ...base, h2s: true }).birm).toBe('no');
  });

  it('manganese note when Mn > 0.05; slime note when slime', () => {
    expect(ironPicker({ ...base, manganese: 0.1 }).manganeseNote).toContain('stains black');
    expect(ironPicker({ ...base, slime: true }).slimeNote).toContain('iron bacteria');
  });

  it('tank sizing by peak flow', () => {
    expect(ironPicker({ ...base, peakFlow: 5 }).tank).toEqual({ label: '9 x 48 in', cuFt: 1, backwash: 7 });
    expect(ironPicker({ ...base, peakFlow: 12 }).tank).toEqual({ label: '12 x 52 in', cuFt: 2, backwash: 15 });
    const big = ironPicker({ ...base, peakFlow: 15 });
    expect(big.tank).toBeNull();
    expect(big.tankOver).toBe(true);
    expect(big.costLine).toContain('$1,000 to $3,500');
  });
});
