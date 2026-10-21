// Shared content types for exact page copy.

export interface WorkedExample {
  lead: string; // italic lead-in
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SimpleTable {
  caption?: string;
  captionBelow?: string; // caption rendered under the table
  headers: string[];
  rows: (string | number)[][];
  // which columns are numeric (right-aligned, tabular-nums)
  numericCols?: number[];
}

export interface ToolCopy {
  quickAnswer: string;
  howToUse: string[];
  formulaIntro: string; // may hold multiple paragraphs separated by a blank line
  formulaEquations: string[]; // rendered as highlighted boxes; empty to skip
  formulaAfter?: string; // may hold multiple paragraphs separated by a blank line
  examples: WorkedExample[];
  exampleNote?: string;
  notCovered: string[];
  tips: string[];
  tipsNote?: string;
  faq: FaqItem[];
  // Formula lines for the "How we calculate" page; defaults to formulaEquations.
  formulaLines?: string[];
}
