// Plumber mean hourly wages by state, U.S. Bureau of Labor Statistics OEWS
// May 2025 (47-2152). Used to scale the labor part of an install quote.

export const PLUMBER_WAGE_MAY2025: Record<string, number> = {
  'United States': 34.70,
  'Alabama': 27.77,
  'Alaska': 43.49,
  'Arizona': 32.66,
  'Arkansas': 24.35,
  'California': 39.58,
  'Colorado': 33.22,
  'Connecticut': 36.25,
  'Delaware': 32.75,
  'District of Columbia': 43.85,
  'Florida': 26.94,
  'Georgia': 27.99,
  'Hawaii': 39.81,
  'Idaho': 28.10,
  'Illinois': 44.91,
  'Indiana': 36.37,
  'Iowa': 33.67,
  'Kansas': 34.33,
  'Kentucky': 33.11,
  'Louisiana': 30.11,
  'Maine': 32.00,
  'Maryland': 35.34,
  'Massachusetts': 43.46,
  'Michigan': 37.14,
  'Minnesota': 41.68,
  'Mississippi': 27.25,
  'Missouri': 36.06,
  'Montana': 37.59,
  'Nebraska': 31.59,
  'Nevada': 34.38,
  'New Hampshire': 31.84,
  'New Jersey': 44.51,
  'New Mexico': 29.71,
  'New York': 40.29,
  'North Carolina': 27.27,
  'North Dakota': 31.81,
  'Ohio': 33.51,
  'Oklahoma': 28.35,
  'Oregon': 47.33,
  'Pennsylvania': 37.05,
  'Rhode Island': 39.23,
  'South Carolina': 26.87,
  'South Dakota': 26.70,
  'Tennessee': 29.09,
  'Texas': 29.22,
  'Utah': 30.87,
  'Vermont': 33.16,
  'Virginia': 29.16,
  'Washington': 42.69,
  'West Virginia': 28.26,
  'Wisconsin': 40.73,
  'Wyoming': 29.76,
};

export const US_WAGE = 34.70;
export const US_STATE = 'United States';

// National typical labor figures (dollars) scaled by state.
const LABOR_LOW = 150;
const LABOR_HIGH = 1000;
const LABOR_TYP = 600;

/** The 51 selectable states (50 states + DC), alphabetical. */
export const STATE_LIST: string[] = Object.keys(PLUMBER_WAGE_MAY2025)
  .filter((s) => s !== US_STATE)
  .sort();

/** Select options: US average first, then the 51 states alphabetically. */
export const STATE_SELECT_OPTIONS: { value: string; label: string }[] = [
  { value: US_STATE, label: 'United States average' },
  ...STATE_LIST.map((s) => ({ value: s, label: s })),
];

export function wageFor(state: string): number {
  return PLUMBER_WAGE_MAY2025[state] ?? US_WAGE;
}

export function laborIndex(state: string): number {
  return wageFor(state) / US_WAGE;
}

export function round5(x: number): number {
  return Math.round(x / 5) * 5;
}

export interface StateLabor {
  low: number;
  high: number;
  typical: number;
}

export function stateLabor(state: string): StateLabor {
  const i = laborIndex(state);
  return { low: round5(LABOR_LOW * i), high: round5(LABOR_HIGH * i), typical: round5(LABOR_TYP * i) };
}

/** Exact phrase comparing a state's labor to the US average. */
export function laborComparison(state: string): string {
  const diff = laborIndex(state) - 1;
  if (Math.abs(diff) < 0.03) return 'about the same as';
  const x = Math.round(Math.abs(diff) * 100);
  return diff > 0 ? `about ${x}% above` : `about ${x}% below`;
}
