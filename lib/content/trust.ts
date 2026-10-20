// Exact trust and legal page copy. Paragraph text may contain inline markdown
// links [text](/url) and [text](mailto:...), rendered by InlineText. Pages with
// dynamic parts (constants tables, corrections log, pages list, contact form)
// compose those in their route.

export interface Block {
  type: 'p' | 'h2';
  text: string;
}

export const ABOUT: Block[] = [
  {
    type: 'p',
    text: "HomeWaterMath is an independent site of calculators for home water treatment: water softeners, hardness, salt, and private well systems. It's run by Sikander Mushtaq.",
  },
  {
    type: 'p',
    text: 'Most answers online about softener sizes or costs are a single rough number, or a calculator from a company that sells the product. We wanted tools that show their math, use published figures, and tell you where each number comes from.',
  },
  {
    type: 'p',
    text: 'How we work: every calculator starts from manufacturer spec sheets, extension-service guides from US universities, and industry standards such as NSF/ANSI 44. Each formula is tested with the worked examples printed on its page before it goes live. When a source changes or we find a mistake, we fix it and log it on our [editorial policy](/editorial-policy/) page.',
  },
  {
    type: 'p',
    text: "What we don't do: we don't sell water treatment equipment, we don't accept payment to change a result, and we don't publish reviews of products we haven't used.",
  },
  {
    type: 'p',
    text: 'How the site is paid for: the site may show ads and may link to retailers or manufacturers through affiliate programs. If we earn a commission from a link, the page says so. It never changes what a calculator recommends.',
  },
  {
    type: 'p',
    text: 'Contact: [hello@homewatermath.com](mailto:hello@homewatermath.com) or the [contact form](/contact/).',
  },
];

export const HOW_WE_CALCULATE = {
  intro:
    'Every calculator on HomeWaterMath uses the formulas and constants below. Each one links to its source and the date we last checked it.',
  roundingHeading: 'How we round',
  roundingBody:
    'Grains and dollars are shown as whole numbers, pounds and gallons to 1 decimal. Anything you buy as a whole item, such as bags of salt or tanks, is rounded up.',
  assumptionsHeading: 'Assumptions you can change',
  assumptionsBody:
    'The calculators start from these defaults, which you can change on each page: 75 gallons of water per person per day, 7 days between regenerations, a 9 lb per cubic foot salt setting, 4 gpg of hardness added per 1 ppm of iron, sea-level air pressure for pressure tanks, and $7 for a 40 lb bag of salt.',
};

export const EDITORIAL: Block[] = [
  {
    type: 'p',
    text: 'Who writes and builds: Sikander Mushtaq writes and builds the calculators and pages on HomeWaterMath.',
  },
  {
    type: 'p',
    text: 'Sources: we use manufacturer spec sheets and manuals, US government and university extension publications, and industry standards. Cost ranges come from named national cost surveys and retailer listings, with the date we checked them. Each page lists its sources.',
  },
  {
    type: 'p',
    text: 'How calculators are checked: every formula is written as code with automated tests built from the worked examples, tables and FAQ numbers on its page. Where a manufacturer publishes its own calculator or table, we compare our results with it and note the comparison on the page.',
  },
  {
    type: 'p',
    text: "AI tools: we use AI tools to help with research, drafting and code. A person checks every number, formula and sentence before it's published.",
  },
  {
    type: 'p',
    text: 'Updates: prices and constants are reviewed at least once a year. A page\'s "Last updated" date changes only when its content changes.',
  },
  {
    type: 'p',
    text: 'Corrections: if you find an error, email [hello@homewatermath.com](mailto:hello@homewatermath.com). We fix confirmed errors and list them below.',
  },
];

export const AUTHOR: Block[] = [
  {
    type: 'p',
    text: "Sikander Mushtaq is the founder of HomeWaterMath. He builds the site's calculators and checks every formula and number against manufacturer spec sheets, extension-service guides and industry standards before a page goes live.",
  },
  {
    type: 'p',
    text: "He started HomeWaterMath because water softener and well questions were getting answered with guesses or sales pitches, and the math behind them isn't hard once it's laid out.",
  },
];

export const CONTACT_INTRO =
  'Questions, corrections and calculator ideas are welcome. Use the form or email hello@homewatermath.com. We usually reply within a few days.';

export const PRIVACY: Block[] = [
  { type: 'h2', text: 'Who we are' },
  { type: 'p', text: 'HomeWaterMath is run by Sikander Mushtaq. Email hello@homewatermath.com.' },
  { type: 'h2', text: 'What we collect' },
  {
    type: 'p',
    text: 'The calculators run in your browser. The numbers you type stay on your device and are not sent to us, except that they appear in the page address if you use the Share button and copy that link.',
  },
  { type: 'h2', text: 'Analytics' },
  {
    type: 'p',
    text: 'We use Cloudflare Web Analytics, which sets no cookies and collects aggregate data only. If Google Analytics 4 is turned on, it uses cookies, Google anonymizes your IP address, and the data is kept for 14 months. In the EEA, the UK and Switzerland, Google Analytics runs only after you accept it, using Consent Mode.',
  },
  { type: 'h2', text: 'Contact form' },
  {
    type: 'p',
    text: 'Messages you send through the contact form are processed by Web3Forms and delivered to our email.',
  },
  { type: 'h2', text: 'Hosting' },
  { type: 'p', text: 'The site is hosted on Cloudflare, which keeps logs for security.' },
  { type: 'h2', text: 'Advertising and affiliates' },
  {
    type: 'p',
    text: "We don't show ads or use affiliate links yet. This section will be updated before that changes.",
  },
  { type: 'h2', text: 'Your choices' },
  {
    type: 'p',
    text: "You can decline or withdraw analytics consent, block cookies in your browser, and opt out of Google Analytics with Google's browser add-on at [https://tools.google.com/dlpage/gaoptout](https://tools.google.com/dlpage/gaoptout).",
  },
  { type: 'h2', text: 'Children' },
  { type: 'p', text: 'This site is not directed at children under 13.' },
  { type: 'h2', text: 'Changes' },
  { type: 'p', text: 'The date at the top shows when this policy last changed.' },
  { type: 'h2', text: 'Contact' },
  { type: 'p', text: 'Questions about privacy go to [hello@homewatermath.com](mailto:hello@homewatermath.com).' },
];

export const TERMS: Block[] = [
  { type: 'h2', text: 'Use of the site' },
  {
    type: 'p',
    text: "You're welcome to use HomeWaterMath for your own planning and to share links to its pages. Don't copy the text, code or photos for another site without permission.",
  },
  { type: 'h2', text: 'Estimates only' },
  {
    type: 'p',
    text: 'The calculators give estimates from published figures and the numbers you enter. Your real result can differ with your equipment, water test and local conditions.',
  },
  { type: 'h2', text: 'No professional advice' },
  {
    type: 'p',
    text: "The site doesn't give plumbing, well, legal or health advice. For a purchase or installation, check your equipment's spec sheet and local code, and ask a licensed plumber or well contractor.",
  },
  { type: 'h2', text: 'Accuracy not guaranteed' },
  {
    type: 'p',
    text: 'We check every formula and number, but we can\'t promise the site is free of errors or always up to date. If you find a mistake, tell us and we\'ll fix it.',
  },
  { type: 'h2', text: 'Links to other sites' },
  {
    type: 'p',
    text: "Some pages link to other sites for sources or products. We don't control those sites and aren't responsible for their content.",
  },
  { type: 'h2', text: 'Changes' },
  {
    type: 'p',
    text: 'We may update these terms. The date at the top shows when they last changed.',
  },
  { type: 'h2', text: 'Contact' },
  {
    type: 'p',
    text: 'Questions about these terms go to [hello@homewatermath.com](mailto:hello@homewatermath.com).',
  },
];

export const DISCLAIMER: Block[] = [
  {
    type: 'p',
    text: "HomeWaterMath's calculators give estimates based on published figures and the inputs you enter. They don't replace a water test, the manufacturer's instructions or a licensed plumber or well contractor. Local plumbing codes, permits and your specific equipment can change the right answer. Drinking water safety questions should go to your local health department or a certified lab. We're not responsible for decisions made from these estimates.",
  },
];

export const AFFILIATE: Block[] = [
  {
    type: 'p',
    text: 'Some pages may link to retailers or manufacturers through affiliate programs. If you buy through one of those links, we may earn a commission at no extra cost to you. Affiliate links are marked, and they never change a calculator\'s result or what we recommend. As of the date above, HomeWaterMath has no active affiliate links.',
  },
];
