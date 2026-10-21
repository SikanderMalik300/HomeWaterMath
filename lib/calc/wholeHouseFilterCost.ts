// Whole house water filter cost.

import {
  WHF_INSTALLED,
  UV_ADD,
  CARTRIDGE_SET,
  CARTRIDGE_GAL,
  SEDIMENT_ONLY,
  CARBON_TANK_GAL,
  CARBON_TANK_YEARS,
  CARBON_TANK_MEDIA,
  UV_LAMP,
} from '@/lib/data/constants';
import { range, addRanges, type Range } from './range';

export type WHFSystem = 'cartridge' | 'carbonTank' | 'well';

export interface WHFInput {
  system: WHFSystem;
  uv: boolean;
  people: number;
  galPerPerson: number;
}

export interface WHFResult {
  gal: number;
  upfront: Range;
  setsPerYear: number; // cartridge / well
  yearly: number;
  media: number; // one-off inside 10 years (carbon tank)
  mediaYears: number; // carbon tank only
  tenYear: number;
  system: WHFSystem;
  uv: boolean;
}

export function wholeHouseFilterCost(input: WHFInput): WHFResult {
  const gal = input.people * input.galPerPerson * 365;

  const base = WHF_INSTALLED[input.system];
  const parts: Range[] = [range(base[0], base[1])];
  if (input.uv) parts.push(range(UV_ADD[0], UV_ADD[1]));
  const upfront = addRanges(...parts);

  const setsPerYear = gal > 0 ? Math.max(1, gal / CARTRIDGE_GAL) : 0;

  let yearly = 0;
  let media = 0;
  let mediaYears = 0;
  if (input.system === 'cartridge') {
    yearly = setsPerYear * CARTRIDGE_SET;
  } else if (input.system === 'carbonTank') {
    yearly = 0;
    mediaYears = gal > 0 ? Math.min(CARBON_TANK_YEARS, CARBON_TANK_GAL / gal) : CARBON_TANK_YEARS;
    media = gal * 10 > CARBON_TANK_GAL ? CARBON_TANK_MEDIA : 0;
  } else {
    // well: priced on the sediment pre-filter; media replacement not priced (note)
    yearly = setsPerYear * SEDIMENT_ONLY;
  }
  if (input.uv) yearly += UV_LAMP;

  const tenYear = upfront.typical + 10 * yearly + media;

  return {
    gal,
    upfront,
    setsPerYear,
    yearly,
    media,
    mediaYears,
    tenYear,
    system: input.system,
    uv: input.uv,
  };
}
