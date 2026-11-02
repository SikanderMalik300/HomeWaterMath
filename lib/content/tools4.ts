// Exact tool-page copy for batch 05. Text is final and copied word for word from
// the spec. No em dashes.

import type { ToolCopy } from './types';
import type { GuideBlock } from './guides';

export const SHOCK: ToolCopy = {
  quickAnswer:
    'To shock a well, mix enough plain unscented bleach to reach about 100 to 200 ppm chlorine in all the water in the well and your plumbing, run it to every tap, leave it 12 to 24 hours, then flush and retest. A 200 ft, 6-inch well with water at 50 ft, plus a typical house, holds about 307 gallons and needs about ½ gallon (8 cups) of 6% bleach for 100 ppm. The calculator below works it out for your well.',
  howToUse: [
    'Enter the well depth and the depth to water from your well log.',
    'Choose the casing diameter. Most drilled wells are 4 or 6 inches; dug wells are 2 to 3 feet across.',
    'Enter your pressure tank and water heater sizes and the number of toilets.',
    "Choose the strength your state recommends and the bleach on the label.",
    'Buy a little more bleach than the result, and follow the steps below.',
  ],
  formulaIntro: '',
  formulaEquations: [
    'Water in the well = (well depth − depth to water) × gallons per foot of casing',
    'Water in the house = pressure tank + water heater + 3 gallons per toilet + 10 gallons for pipes',
    'Bleach (gallons) = total gallons × target ppm ÷ (bleach % × 10,000)',
  ],
  examples: [
    {
      lead: 'Example 1: 200 ft, 6-inch well, water at 50 ft, 100 ppm, 6% bleach.',
      body: '150 ft × 1.47 = 220.5 gallons in the well, plus 86 in the house, is 306.5 gallons. 306.5 × 100 ÷ 60,000 = 0.51 gallons, about 8 cups.',
    },
    {
      lead: 'Example 2: 150 ft, 4-inch well, water at 30 ft, 200 ppm, 8.25% bleach.',
      body: '120 ft × 0.653 = 78.4 gallons, plus 86 in the house, is 164.4 gallons. 164.4 × 200 ÷ 82,500 = 0.40 gallons, about 6.4 cups.',
    },
  ],
  notCovered: [],
  tips: [],
  faq: [
    {
      q: 'How much bleach do I need to shock a well?',
      a: 'It depends on the water in the well and your plumbing. A 200 ft, 6-inch well with water at 50 ft and a typical house needs about ½ gallon of 6% bleach for 100 ppm.',
    },
    {
      q: 'How long should bleach stay in a well?',
      a: "At least 12 hours, and 24 hours is common. Minnesota's health department gives a 2-hour minimum but prefers 6 hours or overnight.",
    },
    {
      q: 'How long after shocking a well can I drink the water?',
      a: "After you've flushed it until you can't smell chlorine, and after a retest shows no coliform bacteria. Use bottled water until then.",
    },
    {
      q: 'Can I use pool chlorine to shock a well?',
      a: "Plain liquid pool chlorine (sodium hypochlorite) works, but it's about twice as strong as household bleach, so use about half as much. Choose 12.5% in the calculator.",
    },
    {
      q: 'Will shocking a well hurt my septic system?',
      a: 'Large amounts of chlorinated water can. Flush most of it outside, away from the septic system; the University of Georgia suggests no more than 100 gallons to the septic tank.',
    },
    {
      q: 'Why did my well test positive again after shocking?',
      a: 'Shocking kills bacteria present at the time, but doesn\'t fix how they got in. Penn State found it solved the problem in only about 15% of positive wells. Have the well cap, casing and seal checked.',
    },
  ],
};

export const SHOCK_AGENCY_LINE =
  "Minnesota Dept. of Health: 50 to 200 ppm. Wisconsin DNR: 100 ppm. CDC: over 100 ppm. Pennsylvania DEP: 100 to 150 ppm. Oregon State: 50 to 100 ppm. Texas A&M: 200 ppm. University of Nevada: 250 ppm. Follow your state's guidance if it has one.";

export const SHOCK_BODY: GuideBlock[] = [
  { kind: 'h2', text: 'How to shock a well' },
  {
    kind: 'ol',
    items: [
      'Turn off or bypass water treatment: softeners, RO systems and filters (cartridges can be removed). Chlorine can damage them.',
      'Turn off power to the pump before you open the well cap.',
      'Mix the bleach into 3 to 5 gallons of water and pour it into the well.',
      'Turn the power back on. Run a hose from an outside tap back into the well for 10 to 30 minutes to mix the water.',
      'Open every tap, hot and cold, one at a time, until you smell chlorine, then close it. Flush toilets once.',
      'Leave the chlorinated water in the system for 12 to 24 hours without using it.',
      'Flush the water out through an outside hose, away from lawns, gardens, streams and your septic system, until the chlorine smell is gone.',
      'Retest for coliform bacteria 7 to 14 days later.',
    ],
  },
  { kind: 'h2', text: 'Safety' },
  {
    kind: 'p',
    text: "Wear goggles and rubber gloves. Never mix bleach with ammonia or other cleaners. Don't climb into a well pit; fumes collect there. Use plain, unscented household bleach with no additives, not splashless or scented bleach. Bleach weakens over time, so use a fresh, unopened bottle.",
  },
  { kind: 'h2', text: 'When to shock a well' },
  {
    kind: 'p',
    text: "After a test finds coliform bacteria, after flooding, when a well is new or has had work done (a new pump, for example), and after the system has been opened. It isn't a routine treatment. If bacteria come back after shocking, the well likely has a defect, such as a cracked casing or a loose cap, and needs a well contractor; a [UV system](/uv-light-for-well-water/) can treat ongoing bacteria once the source is checked.",
  },
  { kind: 'h2', text: 'What it costs' },
  {
    kind: 'p',
    text: 'Doing it yourself costs a few dollars of bleach. A professional well shock costs about $80 to $200, with an average around $140. A coliform bacteria test costs about $10 to $30 at many labs; state labs vary.',
  },
];
