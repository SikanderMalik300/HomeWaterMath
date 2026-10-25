// Exact tool-page copy for batch 04. Text is final and copied word for word from
// the spec. No em dashes.

import type { ToolCopy } from './types';

export const SETTINGS: ToolCopy = {
  quickAnswer:
    "Set the hardness to your water's hardness in grains per gallon, plus 4 gpg for every ppm of iron. For a family of 4 with 15 gpg water and a 48,000-grain softener at a 9 lb salt setting, that's a hardness setting of 15, a capacity of 37,500 grains, a reserve of about 300 gallons and a regeneration about every 7 to 8 days. The calculator below works it out for your home.",
  howToUse: [
    'Enter your household and water use. 75 gallons per person a day is the usual sizing figure.',
    'Enter your hardness from a test, plus any iron.',
    'Choose your softener\'s size (on the label or manual) and the salt setting you plan to run.',
    'Choose your valve type. Metered valves measure water and regenerate when the capacity runs low; timer valves regenerate on a set schedule.',
    'Enter the results on your softener\'s control. Your manual shows where each one goes.',
  ],
  formulaIntro: '',
  formulaEquations: [
    'Hardness setting = hardness in gpg + (iron in ppm × 4), rounded up',
    'Capacity = cubic feet of resin × grains per cubic foot at your salt setting (20,000 at 6 lb, 25,000 at 9 lb, 27,500 at 12 lb, 30,000 at 15 lb)',
    'Gallons between regenerations = capacity ÷ hardness setting',
  ],
  formulaAfter:
    'A metered valve keeps about one day of water in reserve, so it regenerates when the remaining gallons drop to that reserve.',
  examples: [
    {
      lead: 'Example 1: family of 4, 15 gpg, no iron, 48,000-grain softener at 9 lb, metered.',
      body: 'Hardness setting 15. The 1.5 cubic feet of resin hold 37,500 grains at 9 lb, so the softener treats 2,500 gallons between regenerations. The home uses 300 gallons a day, so the reserve is 300 gallons and the softener regenerates about every 7 days, using 13.5 lb of salt each time.',
    },
    {
      lead: 'Example 2: couple, 10 gpg, 1 ppm iron, 24,000-grain softener at 6 lb, timer.',
      body: 'Hardness setting 10 + 4 = 14. Capacity is 0.75 × 20,000 = 15,000 grains. The home uses 150 gallons × 14 gpg = 2,100 grains a day, so set the timer to every 7 days. Each regeneration uses 4.5 lb of salt.',
    },
  ],
  notCovered: [
    "Brine draw, backwash and rinse times. Leave these at your valve's defaults unless your installer changes them.",
    'Manganese, which some makers ask you to add to the hardness as well.',
    "Twin-tank softeners, which don't need a reserve.",
    'Softeners that learn your water use automatically.',
  ],
  tips: [
    'Test your hardness again after moving or if your water source changes, and update the setting.',
    'If you still get hard water just before regeneration, raise the reserve, not the hardness setting.',
    'Use a lower salt setting with more frequent regenerations to save salt; the [salt calculator](/water-softener-salt-calculator/) shows the difference.',
    'Reset the clock after a power cut longer than about 8 hours, or the softener regenerates at the wrong time.',
  ],
  faq: [
    {
      q: 'What number should I set my water softener to?',
      a: "Your water's hardness in grains per gallon, plus 4 gpg for each ppm of iron. If your test is in mg/L or ppm, divide by 17.1 to get gpg.",
    },
    {
      q: 'How often should a water softener regenerate?',
      a: "Usually every 3 to 14 days, depending on the softener's capacity, your hardness and your water use. A family of 4 with 15 gpg water and a 48,000-grain softener at a 9 lb salt setting regenerates about every 7 days.",
    },
    {
      q: 'Should I set my softener hardness higher than my water test?',
      a: 'Only to account for iron, about 4 gpg per ppm. Setting it much higher wastes salt and water.',
    },
    {
      q: 'What is the reserve setting on a water softener?',
      a: "The gallons the softener keeps in reserve before it regenerates, so you don't run out of soft water. About one day of household water use is typical.",
    },
    {
      q: 'What capacity should I enter?',
      a: 'The grains your softener actually holds at your salt setting, not the number on the label. A 48,000-grain softener holds about 37,500 grains at 9 lb of salt per cubic foot.',
    },
  ],
};

export const SETTINGS_VALVE_NOTE =
  'Fleck 5600SXT: Feed Water Hardness, System Capacity, Reserve (gallons) and Day Override. Clack WS1: Hardness and Capacity in the installer settings. Many big-box softeners (Whirlpool, GE, Morton) ask only for hardness; enter the hardness setting above.';
