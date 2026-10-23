// Symptom checker helpers for /water-softener-not-working/. The exact checklist
// text lives in lib/content/guides.ts (SOFTENER_SYMPTOMS).

import { SOFTENER_SYMPTOMS, type Symptom } from '@/lib/content/guides';

export const DEFAULT_SYMPTOM_ID = 1;

export function getSymptom(id: number): Symptom {
  return SOFTENER_SYMPTOMS.find((s) => s.id === id) ?? SOFTENER_SYMPTOMS[0];
}

export { SOFTENER_SYMPTOMS };
export type { Symptom };
