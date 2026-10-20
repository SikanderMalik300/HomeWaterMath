// Exact home and hub copy.

import type { FaqItem, SimpleTable } from './types';

export const HOME = {
  heroIntro:
    'Size a water softener, price it, work out your salt and convert hardness units, all with the math shown. Every number comes from manufacturer spec sheets, extension services and industry standards, and each page lists its sources.',
  searchPlaceholder: 'Try "softener size", "salt" or "pressure tank"',
  chips: [
    { label: 'Softener size', href: '/water-softener-size-calculator/' },
    { label: 'Softener cost', href: '/water-softener-cost/' },
    { label: 'Salt use', href: '/water-softener-salt-calculator/' },
    { label: 'Hardness converter', href: '/water-hardness-converter/' },
  ],
  softenersIntro:
    'Hard water above 7 gpg leaves scale in heaters and fixtures. Start with your hardness, then size, price and run your softener.',
  wellIntro:
    'Private well? Size the pressure tank so your pump runs long enough each cycle.',
  pressureTankBlurb:
    "Tank size and pre-charge from your pump's gpm, horsepower and switch setting.",
  popularAnswers: [
    {
      number: '48,000 grains',
      text: 'A family of 4 with 15 gpg water needs a 48,000-grain softener at a 9 lb salt setting.',
      linkText: 'Size yours',
      href: '/water-softener-size-calculator/',
    },
    {
      number: '17.1',
      text: '1 grain per gallon equals 17.1 ppm (mg/L) of hardness.',
      linkText: 'Convert yours',
      href: '/water-hardness-converter/',
    },
    {
      number: 'About 590 lb',
      text: 'Salt a family of 4 with 15 gpg water uses in a year on a metered softener.',
      linkText: 'Work out yours',
      href: '/water-softener-salt-calculator/',
    },
  ],
  whyTrust: [
    {
      h: 'Sources on every page',
      body: 'Each calculator lists the spec sheets, standards and extension guides its numbers come from, with the date we checked them.',
    },
    {
      h: 'The math is shown',
      body: 'Open "Show the math" under any result to see the formula with your own numbers.',
    },
    {
      h: 'Tested before publishing',
      body: 'Every formula has automated tests built from the worked examples, tables and FAQ numbers on its page.',
    },
  ],
};

export const SOFTENERS_HUB = {
  intro: [
    'A water softener swaps the calcium and magnesium in hard water for sodium or potassium as water passes through a tank of resin beads. When the beads are full, the softener rinses them with brine from the salt tank. That cycle is called regeneration, and it\'s what every number on these pages is built around.',
    "Start with your hardness. Your water utility's yearly water quality report lists it, usually in mg/L. On a well, use a test strip or a lab test. Then size the softener from your household and hardness, check what it should cost to buy and install, and work out the salt it will use each year.",
    'Three numbers decide most of it: hardness in grains per gallon, the number of people in the home, and the salt setting on the control valve. A lower salt setting softens more water per pound of salt but needs a slightly larger tank. The calculators below let you see that trade-off for your own home.',
  ],
  whichTable: {
    caption: 'Which calculator do I need?',
    headers: ['If you want to know', 'Use'],
    rows: [
      ['What size softener to buy', 'Water softener size calculator'],
      ['What it will cost, installed and over 10 years', 'Water softener cost calculator'],
      ['How much salt it will use', 'Water softener salt calculator'],
      ['How to turn ppm or mg/L into gpg', 'Water hardness converter'],
    ],
  } as SimpleTable,
  faq: [
    {
      q: 'Do I need a water softener?',
      a: "If your water is above about 7 gpg (120 mg/L), a softener usually pays off in less scale, longer water heater life and less soap. Below 3.5 gpg most homes don't need one.",
    },
    {
      q: 'How do I find my water hardness?',
      a: "City water customers can find it in the utility's yearly Consumer Confidence Report. Well owners can use hardness test strips or send a sample to a certified lab.",
    },
    {
      q: "What's the difference between a water softener and a water filter?",
      a: 'A softener removes hardness minerals by ion exchange. A filter removes particles, chlorine, chemicals or other contaminants depending on its media. Many homes with hard, chlorinated water use both.',
    },
  ] as FaqItem[],
};

export const WELL_HUB = {
  intro: [
    'Millions of American homes get their water from a private well, and the owners are responsible for its pump, tank and treatment. The calculators here cover the parts that are easy to get wrong.',
    "The pressure tank is the first. A tank that's too small makes the pump start and stop every few seconds, which wears it out. Size the tank from your pump's flow rate and horsepower, set the air pre-charge correctly, and the pump runs long enough each cycle to stay cool. Well water also tends to be harder and more likely to carry iron than city water, so the water softener calculators apply here too.",
  ],
  whichTable: {
    caption: 'Which calculator do I need?',
    headers: ['If you want to know', 'Use'],
    rows: [
      ['What size pressure tank for my well', 'Well pressure tank size calculator'],
      ['Hardness on a well', 'Water hardness converter'],
      ['A softener for well water', 'Water softener size calculator'],
    ],
  } as SimpleTable,
  faq: [
    {
      q: 'How often should I test my well water?',
      a: 'The EPA and most state health departments advise testing at least once a year for bacteria, nitrates and anything common in your area, and after floods or repairs.',
    },
    {
      q: 'What size pressure tank do most homes have?',
      a: "Many homes use tanks between 20 and 86 gallons. The right size depends on the pump's flow rate and horsepower, not the size of the house.",
    },
    {
      q: 'Does well water need a softener?',
      a: 'Only if it\'s hard. Test hardness and iron first. If it\'s above about 7 gpg, or has iron, a softener or iron filter is worth pricing.',
    },
  ] as FaqItem[],
};
