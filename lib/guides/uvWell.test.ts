import { describe, it, expect } from 'vitest';
import { preCheck, uvCost } from './uvWell';
import { roundTo } from '@/lib/calc/round';

describe('uvWell preCheck', () => {
  it('defaults: iron/manganese/hardness/tannins OK, turbidity and UVT not tested', () => {
    const rows = preCheck({ iron: 0.1, manganese: 0, hardness: 5, tannins: 0, turbidity: null, uvt: null });
    const by = Object.fromEntries(rows.map((r) => [r.key, r.status]));
    expect(by.iron).toBe('ok');
    expect(by.manganese).toBe('ok');
    expect(by.hardness).toBe('ok');
    expect(by.tannins).toBe('ok');
    expect(by.turbidity).toBe('untested');
    expect(by.uvt).toBe('untested');
  });

  it('iron above 0.3 needs treatment with the iron filter fix', () => {
    const rows = preCheck({ iron: 0.5, manganese: 0, hardness: 5, tannins: 0, turbidity: null, uvt: null });
    const iron = rows.find((r) => r.key === 'iron')!;
    expect(iron.status).toBe('treat');
    expect(iron.fix).toContain('iron-filter-for-well-water');
  });

  it('hardness at 7 gpg needs a softener; 6 gpg is OK', () => {
    expect(preCheck({ iron: 0, manganese: 0, hardness: 7, tannins: 0, turbidity: null, uvt: null }).find((r) => r.key === 'hardness')!.status).toBe('treat');
    expect(preCheck({ iron: 0, manganese: 0, hardness: 6, tannins: 0, turbidity: null, uvt: null }).find((r) => r.key === 'hardness')!.status).toBe('ok');
  });

  it('UV transmittance above 75 is OK; 75 or below needs treatment', () => {
    expect(preCheck({ iron: 0, manganese: 0, hardness: 5, tannins: 0, turbidity: null, uvt: 80 }).find((r) => r.key === 'uvt')!.status).toBe('ok');
    expect(preCheck({ iron: 0, manganese: 0, hardness: 5, tannins: 0, turbidity: null, uvt: 75 }).find((r) => r.key === 'uvt')!.status).toBe('treat');
  });
});

describe('uvWell uvCost', () => {
  it('default: lamps $1,215, sleeves $147, power $521, total $3,068, about $307 a year', () => {
    const r = uvCost({ unitPrice: 685, install: 500, outlet: 0, lampPrice: 135, sleevePrice: 49, watts: 35, rate: 0.17 });
    expect(r.lampsOver10).toBe(1215);
    expect(r.sleevesOver10).toBe(147);
    expect(roundTo(r.power10, 0)).toBe(521);
    expect(roundTo(r.total10, 0)).toBe(3068);
    expect(roundTo(r.perYear, 0)).toBe(307);
  });

  it('DIY with a new outlet changes the total', () => {
    const r = uvCost({ unitPrice: 685, install: 0, outlet: 250, lampPrice: 135, sleevePrice: 49, watts: 35, rate: 0.17 });
    expect(roundTo(r.total10, 0)).toBe(2818);
  });
});
