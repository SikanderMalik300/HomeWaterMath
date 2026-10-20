// All numeric constants for HomeWaterMath. Every number on the site comes from
// here (or is computed from it). Each constant lists its source id (see
// lib/data/sources.ts) with the figure it is drawn from. Accessed 2026-10-20.

import type { SourceId } from './sources';

export interface ConstantMeta {
  key: string;
  label: string;
  value: string;
  unit: string;
  sources: SourceId[];
}

// --- Hardness unit conversion (to mg/L as CaCO3) ---

// 1 grain = 64.79891 mg, 1 US gallon = 3.785411784 L -> 64.79891 / 3.785411784.
// Industry rounding is 17.1 (wqa-ion-exchange).
export const MG_PER_GPG = 17.1181; // nist-hb44 (derived)
export const MG_PER_MMOL = 100.087; // CaCO3 molar mass (derived)
export const MG_PER_DH = 17.848; // German degree: sigma-hardness
export const MG_PER_FH = 10; // French degree: sigma-hardness

// Sodium a salt-based softener adds, per gpg of hardness removed.
export const SODIUM_MG_PER_L_PER_GPG = 7.864; // derived; unl-g1274, psu-softening

// --- Hardness classes (thresholds in mg/L as CaCO3) ---
// WQA (unl-g1274, psu-softening): <17.1 Soft; <=60 Slightly hard;
//   <=120 Moderately hard; <=180 Hard; >180 Very hard.
// USGS (usgs-hardness): <=60 Soft; <=120 Moderately hard; <=180 Hard; >180 Very hard.
export const SOFT_WATER_GPG = 1; // wqa-dummies, NSF/ANSI 44

// --- Softener sizing ---
export const GAL_PER_PERSON_DEFAULT = 75; // wqa-design-2025, nelsen-sizing, csi-manual
export const GAL_PER_PERSON_OPTIONS = [60, 75, 80] as const; // 60 wqa-design-2025; 80 epa-watersense-stats
export const IRON_ALLOWANCE_DEFAULT = 4; // gpg per ppm: nelsen-sizing, csi-manual
export const IRON_ALLOWANCE_ALT = 5; // whirlpool-manual, aosmith-lowes-manual
export const IRON_MAX_PPM = 2; // nelsen-sizing
export const DAYS_BETWEEN_REGEN_DEFAULT = 7; // convention; psu-softening 6-7, nelsen-sizing 3-5

// Resin capacity (grains) per cubic foot at each salt dose (lb per cu ft).
// aosmith-c43 6/10/15 lb = 20k/25k/30k; wcp-slovak-2004 for 9 and 12 lb (adjusted).
export const CAPACITY_PER_CUFT: Record<number, number> = {
  6: 20000,
  9: 25000,
  12: 27500,
  15: 30000,
};
export const SALT_SETTINGS = [6, 9, 12, 15] as const;
export const SALT_SETTING_DEFAULT = 9;

// Standard softener sizes: label grains -> cubic feet of resin.
// aquatell-clack-ws1, csi-manual.
export interface SoftenerSizeSpec {
  label: number;
  cuFt: number;
}
export const SIZES: SoftenerSizeSpec[] = [
  { label: 24000, cuFt: 0.75 },
  { label: 32000, cuFt: 1.0 },
  { label: 48000, cuFt: 1.5 },
  { label: 64000, cuFt: 2.0 },
  { label: 80000, cuFt: 2.5 },
  { label: 96000, cuFt: 3.0 },
];

export const NSF_EFFICIENCY_GRAINS_PER_LB = 3350; // pnnl-softeners
export const KCL_EXTRA_PCT_LOW = 13; // wqa-getting-smart-2024
export const KCL_EXTRA_PCT_HIGH = 15; // wqa-getting-smart-2024

// --- Salt ---
export const SALT_BAG_LB_DEFAULT = 40; // lowes-salt-40lb
export const SALT_BAG_OPTIONS = [40, 50] as const;
export const SALT_PRICE_DEFAULT = 7; // range 5-10: ndsu-wq1031, thisoldhouse-cost

// --- Cost (US dollars, 2026) ---
export const UNIT_ONLY: Record<string, [number, number]> = {
  single: [500, 1700], // thisoldhouse-cost (updated 2026-06-16)
  dual: [1000, 5000],
  saltFree: [800, 4000],
};
export const DIY_KIT = 175; // hd-pentair-kit
export const LABOR: [number, number] = [150, 1000]; // thisoldhouse-cost, fixr-cost
export const LABOR_TYPICAL = 600; // thisoldhouse-cost "most $500-$700"
export const DEALER_INSTALLED: Record<string, [number, number]> = {
  single: [1200, 3800], // homeguide-cost
  dual: [1700, 5000],
  saltFree: [1500, 4500],
};
export const PRO_SERVICE: [number, number] = [100, 300]; // homeguide-cost, thisoldhouse-cost
export const PRO_SERVICE_TYPICAL = 200;
export const LIFESPAN_YEARS: [number, number] = [10, 15]; // culligan-lifespan
export const COST_HORIZON_YEARS = 10;

// --- Well pressure tank ---
export const ATM_PSI = 14.7; // sea level
export const PRECHARGE_BELOW_CUTIN = 2; // goulds-crsgtank, driller-pelikan-2006
// Minimum pump run time: 1 min up to 3/4 hp, 2 min above (amtrol-mc10188, goulds-crsgtank).
export const RUN_MIN_SMALL = 1;
export const RUN_MIN_LARGE = 2;
export const HP_RUN_THRESHOLD = 0.75;
export const PRESSURE_TANKS = [20, 26, 32, 44, 62, 86, 119]; // gallons, total volume (amtrol-mc10188)
export const PRESSURE_SWITCHES = [
  { label: '20/40', cutIn: 20, cutOut: 40 },
  { label: '30/50', cutIn: 30, cutOut: 50 },
  { label: '40/60', cutIn: 40, cutOut: 60 },
] as const;

// Table shown in "How we calculate": constant, value, unit, source(s).
export const CONSTANTS_TABLE: ConstantMeta[] = [
  { key: 'MG_PER_GPG', label: 'mg/L per grain per gallon', value: '17.1181', unit: 'mg/L as CaCO3', sources: ['nist-hb44', 'wqa-ion-exchange'] },
  { key: 'MG_PER_MMOL', label: 'mg/L per mmol/L', value: '100.087', unit: 'mg/L as CaCO3', sources: ['sigma-hardness'] },
  { key: 'MG_PER_DH', label: 'mg/L per German degree', value: '17.848', unit: 'mg/L as CaCO3', sources: ['sigma-hardness'] },
  { key: 'MG_PER_FH', label: 'mg/L per French degree', value: '10', unit: 'mg/L as CaCO3', sources: ['sigma-hardness'] },
  { key: 'SODIUM_MG_PER_L_PER_GPG', label: 'Sodium added per gpg removed', value: '7.864', unit: 'mg/L per gpg', sources: ['unl-g1274', 'psu-softening'] },
  { key: 'GAL_PER_PERSON_DEFAULT', label: 'Water use per person per day', value: '75', unit: 'gallons', sources: ['wqa-design-2025', 'nelsen-sizing', 'csi-manual'] },
  { key: 'IRON_ALLOWANCE_DEFAULT', label: 'Hardness added per ppm of iron', value: '4', unit: 'gpg per ppm', sources: ['nelsen-sizing', 'csi-manual'] },
  { key: 'IRON_MAX_PPM', label: 'Maximum iron for a softener', value: '2', unit: 'ppm', sources: ['nelsen-sizing'] },
  { key: 'DAYS_BETWEEN_REGEN_DEFAULT', label: 'Days between regenerations (common default)', value: '7', unit: 'days', sources: ['psu-softening', 'nelsen-sizing'] },
  { key: 'CAPACITY_6', label: 'Capacity at 6 lb per cu ft', value: '20,000', unit: 'grains per cu ft', sources: ['aosmith-c43', 'wcp-slovak-2004'] },
  { key: 'CAPACITY_9', label: 'Capacity at 9 lb per cu ft', value: '25,000', unit: 'grains per cu ft', sources: ['aosmith-c43', 'wcp-slovak-2004'] },
  { key: 'CAPACITY_12', label: 'Capacity at 12 lb per cu ft', value: '27,500', unit: 'grains per cu ft', sources: ['wcp-slovak-2004'] },
  { key: 'CAPACITY_15', label: 'Capacity at 15 lb per cu ft', value: '30,000', unit: 'grains per cu ft', sources: ['aosmith-c43'] },
  { key: 'NSF_EFFICIENCY', label: 'NSF/ANSI 44 efficiency threshold', value: '3,350', unit: 'grains per lb of salt', sources: ['pnnl-softeners'] },
  { key: 'SALT_BAG_LB_DEFAULT', label: 'Salt bag size', value: '40', unit: 'lb', sources: ['lowes-salt-40lb'] },
  { key: 'SALT_PRICE_DEFAULT', label: 'Salt price per 40 lb bag', value: '7', unit: 'US dollars', sources: ['ndsu-wq1031', 'thisoldhouse-cost'] },
  { key: 'DIY_KIT', label: 'DIY install kit', value: '175', unit: 'US dollars', sources: ['hd-pentair-kit'] },
  { key: 'LABOR', label: 'Plumber labor to install a unit you buy', value: '150 to 1,000 (most 500 to 700)', unit: 'US dollars', sources: ['thisoldhouse-cost', 'fixr-cost'] },
  { key: 'PRO_SERVICE', label: 'Pro service visit per year', value: '100 to 300', unit: 'US dollars', sources: ['homeguide-cost', 'thisoldhouse-cost'] },
  { key: 'LIFESPAN_YEARS', label: 'Softener lifespan', value: '10 to 15', unit: 'years', sources: ['culligan-lifespan'] },
  { key: 'ATM_PSI', label: 'Atmospheric pressure (sea level)', value: '14.7', unit: 'psi', sources: ['goulds-crsgtank'] },
  { key: 'PRECHARGE_BELOW_CUTIN', label: 'Pre-charge below cut-in pressure', value: '2', unit: 'psi', sources: ['goulds-crsgtank', 'driller-pelikan-2006'] },
  { key: 'RUN_MINUTES', label: 'Minimum pump run time', value: '1 (up to 3/4 hp), 2 (above)', unit: 'minutes', sources: ['amtrol-mc10188', 'goulds-crsgtank'] },
];
