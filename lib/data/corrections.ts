// Corrections log, rendered on /editorial-policy/. Empty at launch.

export interface Correction {
  date: string; // YYYY-MM-DD
  page: string; // slug or title
  change: string;
}

export const CORRECTIONS: Correction[] = [];
