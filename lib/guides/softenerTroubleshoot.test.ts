import { describe, it, expect } from 'vitest';
import { SOFTENER_SYMPTOMS, getSymptom, DEFAULT_SYMPTOM_ID } from './softenerTroubleshoot';

describe('softener troubleshoot symptom data', () => {
  it('has all eight symptoms with unique ids 1..8', () => {
    expect(SOFTENER_SYMPTOMS).toHaveLength(8);
    expect(SOFTENER_SYMPTOMS.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('default symptom is 1 (water is hard again)', () => {
    expect(DEFAULT_SYMPTOM_ID).toBe(1);
    expect(getSymptom(DEFAULT_SYMPTOM_ID).label).toBe('Water is hard again');
  });

  it('symptom 1 checks mention salt bridge and bypass, with the service-call cost', () => {
    const s = getSymptom(1);
    expect(s.checks).toContain('salt bridge');
    expect(s.checks).toContain('bypass');
    expect(s.proCost).toContain('$40 to $100');
  });

  it('symptom 3 (brine tank full) has a brine-parts cost line', () => {
    expect(getSymptom(3).proCost).toContain('$150 to $300');
  });

  it('symptom 7 (error code) uses the Fleck manual wording and a generic Clack line', () => {
    const s = getSymptom(7);
    expect(s.checks).toContain("Error 2 means the system hasn't regenerated in more than 99 days");
    expect(s.checks).toContain('including Clack WS1');
    expect(s.checks).not.toContain('E1 to E3');
    expect(s.checks).not.toContain('Err 2');
  });

  it('symptom 8 (beads at faucets) references the distributor', () => {
    expect(getSymptom(8).checks).toContain('distributor');
  });

  it('every symptom has non-empty checks and a pro cost line', () => {
    SOFTENER_SYMPTOMS.forEach((s) => {
      expect(s.checks.length).toBeGreaterThan(0);
      expect(s.proCost.length).toBeGreaterThan(0);
    });
  });
});
