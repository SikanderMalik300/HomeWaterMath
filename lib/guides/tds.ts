// TDS reading checker for /tds-meter-chart/.
// Taste bands from the WHO TDS background document (2003); EPA secondary
// guideline is 500 mg/L; certified RO must remove at least 75%.

export const EPA_TDS_GUIDELINE = 500;
export const RO_MIN_REDUCTION = 75;

export type TasteBand = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unacceptable';

export function tasteBand(ppm: number): TasteBand {
  if (ppm < 300) return 'Excellent';
  if (ppm < 600) return 'Good';
  if (ppm < 900) return 'Fair';
  if (ppm < 1200) return 'Poor';
  return 'Unacceptable';
}

export interface TdsResult {
  ppm: number;
  band: TasteBand;
  aboveEpa: boolean; // above the 500 mg/L guideline
  reductionPct: number | null; // when a before value is given
  roMeets: boolean | null; // reduction >= 75%
}

export interface TdsInput {
  reading: number; // the meter reading (ppm, or EC if ec is true)
  before: number | null; // reading before an RO or filter, in ppm
  ec: boolean; // the reading is in microsiemens per cm
  factor: number; // EC-to-ppm factor (about 0.5 for fresh water)
}

export function tdsCheck(input: TdsInput): TdsResult {
  const { reading, before, ec, factor } = input;
  const ppm = ec ? reading * factor : reading;

  let reductionPct: number | null = null;
  let roMeets: boolean | null = null;
  if (before != null && before > 0 && ppm <= before) {
    reductionPct = ((before - ppm) / before) * 100;
    roMeets = reductionPct >= RO_MIN_REDUCTION;
  }

  return {
    ppm,
    band: tasteBand(ppm),
    aboveEpa: ppm > EPA_TDS_GUIDELINE,
    reductionPct,
    roMeets,
  };
}
