// Test-strip reading decoder for /how-to-test-water-hardness/.

import { classifyUSGS, type HardnessClass } from '@/lib/calc/hardness';
import { roundTo } from '@/lib/calc/round';

export const STRIP_BLOCKS = [0, 40, 80, 120, 180, 250, 425, 1000];
export const STRIP_NOTE =
  'Block values from Industrial Test Systems WaterWorks strips. Other brands use different blocks; check your bottle.';
export const STRIP_CONFIRM = 'For softener sizing, confirm with a drop-count kit or lab.';

const GPG = 17.1;

export interface StripResult {
  block: number;
  blockGpg: number;
  low: number; // ppm
  high: number | null; // ppm, null for the open-ended top block
  lowGpg: number;
  highGpg: number | null;
  usgsClass: HardnessClass;
}

export function stripDecode(block: number): StripResult {
  const i = STRIP_BLOCKS.indexOf(block);
  const idx = i < 0 ? 3 : i;
  const value = STRIP_BLOCKS[idx];
  const low = idx === 0 ? 0 : (STRIP_BLOCKS[idx - 1] + value) / 2;
  const high = idx === STRIP_BLOCKS.length - 1 ? null : (value + STRIP_BLOCKS[idx + 1]) / 2;
  return {
    block: value,
    blockGpg: roundTo(value / GPG, 1),
    low,
    high,
    lowGpg: roundTo(low / GPG, 1),
    highGpg: high == null ? null : roundTo(high / GPG, 1),
    usgsClass: classifyUSGS(value),
  };
}
