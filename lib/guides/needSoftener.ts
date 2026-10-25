// "Do I need a softener?" check for /hard-water-vs-soft-water/.

import { toGpg, toMgL, classifyWQA, type HardnessUnit, type HardnessClass } from '@/lib/calc/hardness';
import { SODIUM_MG_PER_L_PER_GPG } from '@/lib/data/constants';

export type SoftenerNeed = 'soft' | 'optional' | 'hard';

export interface NeedSoftenerResult {
  gpg: number;
  wqa: HardnessClass;
  need: SoftenerNeed;
  recommendation: string; // may contain an inline markdown link
  ironHigh: boolean;
  ironNote: string | null;
  sodiumMgPerL: number; // whole mg/L added by softening this water
  sodiumNote: string;
}

export function needSoftener(value: number, unit: HardnessUnit, ironPpm: number): NeedSoftenerResult {
  const gpg = toGpg(value, unit);
  const mgl = toMgL(value, unit);
  const wqa = classifyWQA(mgl);

  let need: SoftenerNeed;
  let recommendation: string;
  if (gpg < 3.5) {
    need = 'soft';
    recommendation = "Soft or slightly hard. You don't need a softener.";
  } else if (gpg <= 7) {
    need = 'optional';
    recommendation = "Moderately hard. A softener is optional; you'll notice some spotting and scale.";
  } else {
    need = 'hard';
    recommendation = 'Hard. A softener is usually worth it; [size one with our calculator](/water-softener-size-calculator/).';
  }

  const ironHigh = ironPpm > 0.3;
  const ironNote = ironHigh
    ? 'Your iron is above the 0.3 ppm staining level; see the [iron filter guide](/iron-filter-for-well-water/).'
    : null;

  const sodiumMgPerL = Math.round(gpg * SODIUM_MG_PER_L_PER_GPG);
  const sodiumNote = `Softening this water adds about ${sodiumMgPerL} mg of sodium per liter.`;

  return { gpg, wqa, need, recommendation, ironHigh, ironNote, sodiumMgPerL, sodiumNote };
}
