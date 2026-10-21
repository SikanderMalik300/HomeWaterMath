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
  // Batch 02
  { key: 'PUMP_INSTALLED', label: 'Submersible pump, installed', value: '1,000 to 2,500', unit: 'US dollars', sources: ['homeguide-pump', 'ahs-pump'] },
  { key: 'PIPE_PER_FT', label: 'Drop pipe, 1-1/4 in poly, per foot', value: '1.48 to 4.74', unit: 'US dollars', sources: ['hd-poly-pipe', 'supplyhouse-poly-pipe'] },
  { key: 'WIRE_PER_FT', label: '10/3 submersible pump cable, per foot', value: '1.92 to 4.00', unit: 'US dollars', sources: ['nassau-103-wire', 'backwoods-103-wire'] },
  { key: 'PUMP_LIFESPAN', label: 'Well pump lifespan', value: '8 to 15', unit: 'years', sources: ['homeadvisor-pump', 'forbes-pump'] },
  { key: 'SALT_FREE_MEDIA', label: 'Salt-free media life and cost', value: '1,000,000 gal, $1,548', unit: 'gallons / US dollars', sources: ['aquasana-simplysoft', 'aquasana-simplysoft-media'] },
  { key: 'PREFILTER_PER_YEAR', label: 'Salt-free pre-filter per year', value: '27', unit: 'US dollars', sources: ['waterfilterguru-futuresoft'] },
  { key: 'REGEN_GAL', label: 'Water per softener regeneration', value: '50 (20 to 70)', unit: 'gallons', sources: ['epa-watersense-softener-2026'] },
  { key: 'RO_EFF_STANDARD', label: 'RO efficiency, typical point-of-use', value: '15% (10 to 20%)', unit: 'efficiency', sources: ['epa-ro-statement'] },
  { key: 'RO_EFF_WATERSENSE', label: 'RO efficiency, WaterSense minimum', value: '30%', unit: 'efficiency', sources: ['epa-ro-spec'] },
  { key: 'RO_FILTERS_PER_YEAR', label: 'RO filters per year', value: '50', unit: 'US dollars', sources: ['apec-ro-sets', 'forbes-ro'] },
  { key: 'CARTRIDGE_SET', label: 'Whole-house cartridge set (sediment + carbon)', value: '76.98', unit: 'US dollars', sources: ['expresswater-sediment', 'expresswater-carbon'] },
  { key: 'CARTRIDGE_GAL', label: 'Cartridge rated life', value: '100,000', unit: 'gallons', sources: ['ispring-f4wgb22b'] },
  { key: 'CARBON_TANK_MEDIA', label: 'Carbon tank media replacement', value: '1,898 (1,000,000 gal or 10 yr)', unit: 'US dollars', sources: ['aquasana-rhino-media'] },
  { key: 'UV_LAMP', label: 'UV lamp, yearly', value: '125.99', unit: 'US dollars', sources: ['aquasana-uv-lamp'] },
  { key: 'INSTALL_LOOP', label: 'New softener loop', value: '200 to 2,000', unit: 'US dollars', sources: ['thisoldhouse-cost', 'fixr-cost'] },
  { key: 'INSTALL_DRAIN', label: 'New drain line', value: '300 to 800', unit: 'US dollars', sources: ['homeguide-ro', 'homeguide-wf'] },
  { key: 'INSTALL_OUTLET', label: 'New 120 V outlet', value: '150 to 300', unit: 'US dollars', sources: ['homeguide-outlet'] },
];

// --- Batch 02: well pump replacement ---
export const PUMP_INSTALLED: Record<string, [number, number]> = {
  submersible: [1000, 2500], // homeguide-pump; ahs-pump
  shallowJet: [400, 1000], // homeguide-pump; forbes-pump
  deepJet: [500, 1400], // homeguide-pump; ahs-pump
  constantPressure: [2000, 5000], // homeguide-pump; forbes-pump; homeadvisor-pump; ahs-pump
};
export const PIPE_PER_FT: [number, number] = [1.48, 4.74]; // hd-poly-pipe; supplyhouse-poly-pipe
export const WIRE_PER_FT: [number, number] = [1.92, 4.0]; // nassau-103-wire; backwoods-103-wire
export const PUMP_TANK_INSTALLED: [number, number] = [200, 1500];
export const PUMP_TANK_TYPICAL = 850; // mean of forbes-tank/homeguide-tank averages
export const AFTER_HOURS: [number, number] = [250, 1000]; // homeadvisor-pump; homeguide-pump
export const SHALLOW_JET_MAX_FT = 25; // goulds-residential
export const DEEP_JET_MAX_FT = 150; // homeadvisor-pump
export const HOIST_FT = 200; // thumbtack-pump
export const PUMP_LIFESPAN: [number, number] = [8, 15]; // homeadvisor-pump; forbes-pump; homeguide-repair

// --- Batch 02: salt vs salt-free ---
export const SALT_FREE_MEDIA_GAL = 1_000_000; // aquasana-simplysoft
export const SALT_FREE_MEDIA_COST = 1548; // aquasana-simplysoft-media
export const PREFILTER_PER_YEAR = 27; // waterfilterguru-futuresoft
export const REGEN_GAL_DEFAULT = 50; // epa-watersense-softener-2026
export const REGEN_GAL_RANGE: [number, number] = [20, 70];
export const CONTROLLER_WATTS = 3; // pentair-autotrol-368 -> ~26 kWh/yr
export const SALT_FREE_MAX_GPG = 75; // watts-oneflow; springwell-futuresoft
export const SALT_FREE_MAX_IRON = 0.3;
export const TAC_SCALE_REDUCTION = '>88%'; // wrrf-08-06

// --- Batch 02: reverse osmosis ---
export const RO: Record<string, { unit: [number, number]; installed?: [number, number] }> = {
  tank: { unit: [150, 350], installed: [300, 700] }, // homeguide-ro
  tankless: { unit: [300, 600], installed: [450, 950] }, // homeguide-ro; angi-ro
  counter: { unit: [200, 700] }, // angi-ro
};
export const RO_EXTRAS: Record<string, [number, number]> = {
  fridge: [75, 130],
  stoneHole: [50, 250],
  drain: [300, 800],
};
export const RO_FILTERS_PER_YEAR = 50; // apec-ro-sets; forbes-ro
export const RO_EFF_STANDARD = 0.15; // epa-ro-statement
export const RO_EFF_WATERSENSE = 0.3; // epa-ro-spec
export const RO_GAL_PER_PERSON_DAY = 1; // epa-ro-statement
export const WHOLE_HOUSE_RO: [number, number] = [1000, 8000]; // table only (thisoldhouse-ro/angi-ro/homeguide-ro)

// --- Batch 02: whole house filter ---
export const WHF_INSTALLED: Record<string, [number, number]> = {
  cartridge: [500, 1200], // homeadvisor-wf
  carbonTank: [800, 1500],
  well: [1000, 4000], // bobvila-wf; waterfilterguru-wf
};
export const UV_ADD: [number, number] = [500, 1500]; // homeadvisor-wf; bobvila-wf
export const WHF_LABOR: [number, number] = [200, 600]; // homeguide-wf
export const CARTRIDGE_SET = 76.98; // expresswater sediment 32.99 + carbon 43.99
export const CARTRIDGE_GAL = 100_000; // expresswater; ispring-f4wgb22b
export const SEDIMENT_ONLY = 32.99; // well pre-filter
export const CARBON_TANK_GAL = 1_000_000;
export const CARBON_TANK_YEARS = 10;
export const CARBON_TANK_MEDIA = 1898; // aquasana-rhino-media
export const UV_LAMP = 125.99; // aquasana-uv-lamp
export const WHF_GAL_PER_PERSON = 82; // epa-watersense-stats

// --- Batch 02: softener installation ---
export const INSTALL_BASE_LABOR: [number, number] = [150, 1000]; // thisoldhouse-cost; fixr-cost; angi-install
export const INSTALL_BASE_TYPICAL = 600;
export const INSTALL_REMOVAL: [number, number] = [50, 100]; // fixr-cost; homeguide-repair-softener
export const INSTALL_LOOP: [number, number] = [200, 2000]; // thisoldhouse-cost; fixr-cost
export const INSTALL_LOOP_TYPICAL = 900; // mean of the two midpoints
export const INSTALL_DRAIN: [number, number] = [300, 800]; // homeguide-ro; homeguide-wf
export const INSTALL_OUTLET: [number, number] = [150, 300]; // homeguide-outlet
export const INSTALL_HOURS: [number, number] = [2, 4]; // angi-install; homeadvisor-install
export const INSTALL_PLUMBER_RATE: [number, number] = [45, 200]; // angi-plumber
