// Iron treatment picker logic for /iron-filter-for-well-water/.

export const IRON_MESSAGES = {
  slime: "Possible iron bacteria. Shock-chlorinate the well first; filters alone won't fix it.",
  none: "Below EPA's taste and staining guideline. No iron treatment needed.",
  chlorine: 'Chlorine (or another oxidizer) injection followed by a filter.',
  softener:
    'A water softener can usually handle this, if the iron is clear-water (dissolved) iron and pH is above 6.7. Size it with the iron included.',
  aio: 'Air-injection oxidizing (AIO) filter. Many are rated up to about 10 ppm iron and 3 ppm hydrogen sulfide.',
  aioOrGreensand: 'Air-injection oxidizing filter or a manganese dioxide (greensand-type) filter.',
  birmYes: 'Birm media is an option (needs pH 6.8 or higher and no hydrogen sulfide).',
  birmNo: "Birm media isn't a fit.",
  manganese: 'Manganese above 0.05 ppm stains black. Oxidizing filters remove it; Birm needs pH 8 to 9 for manganese.',
  tankOver: 'Larger than standard residential tanks. Ask for a commercial sizing.',
  cost: 'Installed iron filters usually cost $1,000 to $3,500.',
};

export type IronRec = 'none' | 'chlorine' | 'softener' | 'aio' | 'aioOrGreensand';

export interface IronInput {
  iron: number;
  manganese: number;
  h2s: boolean;
  ph: number;
  slime: boolean;
  peakFlow: number;
}

export interface IronTank {
  label: string;
  cuFt: number;
  backwash: number;
}

export interface IronResult {
  combined: number;
  recommendation: IronRec;
  message: string;
  isFilter: boolean;
  isSoftener: boolean;
  slimeNote: string | null;
  birm: 'yes' | 'no';
  birmMessage: string;
  manganeseNote: string | null;
  tank: IronTank | null;
  tankOver: boolean;
  backwashLine: string | null;
  costLine: string | null;
}

export function ironPicker(input: IronInput): IronResult {
  const { iron, manganese, h2s, ph, slime, peakFlow } = input;
  const combined = iron + manganese;

  let recommendation: IronRec;
  let message: string;
  let isFilter = false;
  let isSoftener = false;

  if (iron <= 0.3 && manganese <= 0.05) {
    recommendation = 'none';
    message = IRON_MESSAGES.none;
  } else if (combined > 10) {
    recommendation = 'chlorine';
    message = IRON_MESSAGES.chlorine;
    isFilter = true;
  } else if (iron <= 2 && !h2s && manganese <= 0.3) {
    recommendation = 'softener';
    message = IRON_MESSAGES.softener;
    isSoftener = true;
  } else if (h2s) {
    recommendation = 'aio';
    message = IRON_MESSAGES.aio;
    isFilter = true;
  } else {
    recommendation = 'aioOrGreensand';
    message = IRON_MESSAGES.aioOrGreensand;
    isFilter = true;
  }

  const birm: 'yes' | 'no' = ph < 6.8 || h2s ? 'no' : 'yes';
  const birmMessage = birm === 'yes' ? IRON_MESSAGES.birmYes : IRON_MESSAGES.birmNo;
  const manganeseNote = manganese > 0.05 ? IRON_MESSAGES.manganese : null;
  const slimeNote = slime ? IRON_MESSAGES.slime : null;

  let tank: IronTank | null = null;
  let tankOver = false;
  if (isFilter) {
    if (peakFlow <= 6) tank = { label: '9 x 48 in', cuFt: 1, backwash: 7 };
    else if (peakFlow <= 9) tank = { label: '10 x 54 in', cuFt: 1.5, backwash: 10 };
    else if (peakFlow <= 12) tank = { label: '12 x 52 in', cuFt: 2, backwash: 15 };
    else tankOver = true;
  }
  const backwashLine = tank
    ? `Your well pump must supply ${tank.backwash} gpm during backwash. Check your pump's flow before you buy.`
    : null;
  const costLine = isFilter ? IRON_MESSAGES.cost : null;

  return {
    combined,
    recommendation,
    message,
    isFilter,
    isSoftener,
    slimeNote,
    birm,
    birmMessage,
    manganeseNote,
    tank,
    tankOver,
    backwashLine,
    costLine,
  };
}
