// "Do I need to test now?" logic for /well-water-test-kit/.

export const WELL_TEST_MESSAGES = {
  yes: 'Yes, test now.',
  no: 'No urgent need. Next routine test: within 12 months of your last one.',
  babyNote: "Nitrate is the priority: babies under 6 months shouldn't drink water above 10 mg/L.",
  floodNote: 'Test for bacteria after disinfecting.',
};

export const WELL_CORE_TESTS = ['total coliform', 'nitrate', 'pH', 'total dissolved solids'];
export const WELL_TASTE_TESTS = ['iron', 'manganese', 'hardness', 'sulfate'];

export type MonthsCategory = 'under12' | '12plus' | 'never';

export interface WellTestInput {
  months: MonthsCategory;
  flooding: boolean;
  repair: boolean;
  tasteColorSmell: boolean;
  babyOrPregnant: boolean;
  construction: boolean;
}

export interface WellTestResult {
  testNow: boolean;
  message: string;
  tests: string[];
  notes: string[];
}

export function wellTestChecker(input: WellTestInput): WellTestResult {
  const anyBox =
    input.flooding || input.repair || input.tasteColorSmell || input.babyOrPregnant || input.construction;
  const testNow = input.months !== 'under12' || anyBox;

  if (!testNow) {
    return { testNow: false, message: WELL_TEST_MESSAGES.no, tests: [], notes: [] };
  }

  const tests = [...WELL_CORE_TESTS];
  if (input.tasteColorSmell) tests.push(...WELL_TASTE_TESTS);

  const notes: string[] = [];
  if (input.babyOrPregnant) notes.push(WELL_TEST_MESSAGES.babyNote);
  if (input.flooding || input.repair) notes.push(WELL_TEST_MESSAGES.floodNote);

  return { testNow: true, message: WELL_TEST_MESSAGES.yes, tests, notes };
}
