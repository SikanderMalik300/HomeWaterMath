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
  formulaIntro: string;
  formulaEquations: string[];
  formulaAfter?: string;
  examples: WorkedExample[];
  exampleNote?: string;
  notCovered: string[];
  tips: string[];
  tipsNote?: string;
  faq: FaqItem[];
}
