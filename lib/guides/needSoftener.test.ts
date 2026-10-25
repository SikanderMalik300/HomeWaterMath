import { describe, it, expect } from 'vitest';
import { needSoftener } from './needSoftener';

describe('needSoftener', () => {
  it('default 15 gpg: Very hard (WQA), hard recommendation, about 118 mg/L sodium', () => {
    const r = needSoftener(15, 'gpg', 0);
    expect(r.wqa).toBe('Very hard');
    expect(r.need).toBe('hard');
    expect(r.recommendation).toContain('Hard. A softener is usually worth it');
    expect(r.sodiumMgPerL).toBe(118);
    expect(r.sodiumNote).toContain('about 118 mg of sodium per liter');
  });

  it('2 gpg is soft or slightly hard: no softener needed', () => {
    const r = needSoftener(2, 'gpg', 0);
    expect(r.need).toBe('soft');
    expect(r.recommendation).toContain("don't need a softener");
  });

  it('5 gpg is moderately hard: a softener is optional', () => {
    const r = needSoftener(5, 'gpg', 0);
    expect(r.need).toBe('optional');
    expect(r.recommendation).toContain('optional');
  });

  it('iron above 0.3 ppm adds the iron filter note', () => {
    expect(needSoftener(15, 'gpg', 0.5).ironNote).toContain('iron filter guide');
    expect(needSoftener(15, 'gpg', 0.2).ironNote).toBeNull();
  });

  it('accepts mg/L input', () => {
    const r = needSoftener(256.8, 'mgl', 0);
    expect(r.need).toBe('hard');
    expect(r.wqa).toBe('Very hard');
  });

  it('the 3.5 and 7 gpg boundaries land in the moderate band', () => {
    expect(needSoftener(3.5, 'gpg', 0).need).toBe('optional');
    expect(needSoftener(7, 'gpg', 0).need).toBe('optional');
    expect(needSoftener(7.1, 'gpg', 0).need).toBe('hard');
  });
});
