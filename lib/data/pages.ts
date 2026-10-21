// Page registry: the single source of truth. Navigation, hubs, related links,
// breadcrumbs, sitemap.xml, the HTML sitemap and llms.txt are all generated
// from this.

import type { SourceId } from './sources';
import { SIZE, SALT, HARDNESS, COST, PRESSURE } from '@/lib/content/tools';

export type PageType = 'tool' | 'hub' | 'trust' | 'home';
export type Category = 'softeners' | 'well' | null;

export interface PageMeta {
  slug: string; // with trailing slash, e.g. "/water-softener-cost/"
  type: PageType;
  title: string;
  metaDescription: string;
  h1: string;
  category: Category;
  related: string[]; // slugs
  lastUpdated: string; // YYYY-MM-DD
  published: string; // YYYY-MM-DD
  sources: SourceId[];
  photoId: string | null;
  ownerNote: string | null;
  notCovered: string[];
  cardBlurb: string | null;
}

const DATE = '2026-10-20';

export const PAGES: PageMeta[] = [
  {
    slug: '/',
    type: 'home',
    title: 'HomeWaterMath: Water Softener and Well Water Calculators',
    metaDescription:
      'Free calculators for home water: softener size, softener cost, salt use, hardness conversions and well pressure tanks. Every formula and source shown.',
    h1: 'Water softener and well water calculators',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: 'hero-home',
    ownerNote: null,
    notCovered: [],
    cardBlurb: null,
  },
  {
    slug: '/water-softeners/',
    type: 'hub',
    title: 'Water Softener Calculators: Size, Cost, Salt | HomeWaterMath',
    metaDescription:
      'Water softener calculators for US homes: what size you need, what it costs installed, how much salt it uses and how to convert hardness units.',
    h1: 'Water softener calculators',
    category: 'softeners',
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: null,
  },
  {
    slug: '/well-water/',
    type: 'hub',
    title: 'Well Water Calculators | HomeWaterMath',
    metaDescription:
      "Calculators for private well owners, starting with pressure tank sizing from your pump's flow rate, horsepower and pressure switch setting.",
    h1: 'Well water calculators',
    category: 'well',
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: ['epa-privatewells'],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: null,
  },
  {
    slug: '/water-softener-size-calculator/',
    type: 'tool',
    title: 'Water Softener Size Calculator | HomeWaterMath',
    metaDescription:
      'Find the right water softener size in grains from your household, hardness and iron, with real capacity at your salt setting, not just the label.',
    h1: 'Water Softener Size Calculator',
    category: 'softeners',
    related: [
      '/water-softener-salt-calculator/',
      '/water-hardness-converter/',
      '/water-softener-cost/',
    ],
    lastUpdated: DATE,
    published: DATE,
    sources: [
      'wqa-design-2025',
      'nelsen-sizing',
      'csi-manual',
      'aosmith-c43',
      'wcp-slovak-2004',
      'unl-g1274',
      'usgs-hardness',
      'pnnl-softeners',
      'whirlpool-manual',
      'aosmith-lowes-manual',
      'aquatell-clack-ws1',
      'freshwater-fleck-48k',
    ],
    photoId: 'tool-softener-size',
    ownerNote: null,
    notCovered: SIZE.notCovered,
    cardBlurb: 'Grains you need from your household and hardness, at your real salt setting.',
  },
  {
    slug: '/water-softener-cost/',
    type: 'tool',
    title: 'Water Softener Cost Calculator, Installed | HomeWaterMath',
    metaDescription:
      'Estimate water softener cost for your home: unit price, installation, salt and service, with a 10-year total. Compare DIY, plumber and dealer installs.',
    h1: 'Water Softener Cost Calculator',
    category: 'softeners',
    related: [
      '/water-softener-size-calculator/',
      '/water-softener-salt-calculator/',
      '/water-hardness-converter/',
    ],
    lastUpdated: DATE,
    published: DATE,
    sources: [
      'thisoldhouse-cost',
      'homeguide-cost',
      'fixr-cost',
      'angi-chicago',
      'hd-pentair-kit',
      'freshwater-clack-bypass',
      'culligan-lifespan',
      'homeserve-cost',
      'wcp-michaud-2011',
    ],
    photoId: 'tool-cost',
    ownerNote: null,
    notCovered: COST.notCovered,
    cardBlurb: 'Unit, install, salt and service, with a 10-year total and a quote check.',
  },
  {
    slug: '/water-softener-salt-calculator/',
    type: 'tool',
    title: 'Water Softener Salt Calculator: Bags a Year | HomeWaterMath',
    metaDescription:
      'Estimate how much salt your water softener uses per month and year, how many 40 lb bags to buy and the yearly cost, from your hardness and settings.',
    h1: 'Water Softener Salt Calculator',
    category: 'softeners',
    related: [
      '/water-softener-size-calculator/',
      '/water-softener-cost/',
      '/water-hardness-converter/',
    ],
    lastUpdated: DATE,
    published: DATE,
    sources: [
      'aosmith-c43',
      'wcp-slovak-2004',
      'pnnl-softeners',
      'wqa-getting-smart-2024',
      'alberta-agdex',
      'ndsu-wq1031',
      'thisoldhouse-cost',
      'homeguide-cost',
      'ace-salt',
      'lowes-salt-40lb',
    ],
    photoId: 'tool-salt',
    ownerNote: null,
    notCovered: SALT.notCovered,
    cardBlurb: 'Pounds per month, bags per year and yearly cost for your softener.',
  },
  {
    slug: '/water-hardness-converter/',
    type: 'tool',
    title: 'Water Hardness Converter: gpg, ppm, mg/L | HomeWaterMath',
    metaDescription:
      'Convert water hardness between grains per gallon, ppm (mg/L as CaCO3), mmol/L, German and French degrees, and see where your water falls on the scale.',
    h1: 'Water Hardness Converter',
    category: 'softeners',
    related: [
      '/water-softener-size-calculator/',
      '/water-softener-salt-calculator/',
      '/water-softener-cost/',
    ],
    lastUpdated: DATE,
    published: DATE,
    sources: [
      'nist-hb44',
      'wqa-ion-exchange',
      'usgs-hardness',
      'unl-g1274',
      'psu-softening',
      'sigma-hardness',
    ],
    photoId: 'tool-hardness',
    ownerNote: null,
    notCovered: HARDNESS.notCovered,
    cardBlurb: 'gpg, ppm, mg/L, mmol/L and German or French degrees in one step.',
  },
  {
    slug: '/well-pressure-tank-size-calculator/',
    type: 'tool',
    title: 'Well Pressure Tank Size Calculator | HomeWaterMath',
    metaDescription:
      'Size a well pressure tank from your pump\'s gallons per minute, horsepower and pressure switch setting. Shows drawdown, tank size and pump cycles.',
    h1: 'Well Pressure Tank Size Calculator',
    category: 'well',
    related: [
      '/water-hardness-converter/',
      '/water-softener-size-calculator/',
      '/water-softener-cost/',
    ],
    lastUpdated: DATE,
    published: DATE,
    sources: [
      'amtrol-mc10188',
      'goulds-crsgtank',
      'goulds-brhptank',
      'driller-pelikan-2006',
      'fws-tank-blog',
      'amtrol-older-chart',
    ],
    photoId: 'tool-pressure-tank',
    ownerNote: null,
    notCovered: PRESSURE.notCovered,
    cardBlurb: "Tank size and pre-charge from your pump's gpm, horsepower and switch setting.",
  },
  // Trust and legal pages
  {
    slug: '/about/',
    type: 'trust',
    title: 'About HomeWaterMath',
    metaDescription:
      'Who runs HomeWaterMath, why it exists and how the calculators are built, checked and paid for.',
    h1: 'About HomeWaterMath',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'Who runs the site and how the calculators are built.',
  },
  {
    slug: '/how-we-calculate/',
    type: 'trust',
    title: 'How We Calculate | HomeWaterMath',
    metaDescription:
      'The formulas, constants and sources behind every HomeWaterMath calculator, with the date each source was checked.',
    h1: 'How we calculate',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'The formulas, constants and sources behind every calculator.',
  },
  {
    slug: '/editorial-policy/',
    type: 'trust',
    title: 'Editorial Policy | HomeWaterMath',
    metaDescription:
      'How HomeWaterMath researches, builds, checks and corrects its calculators and guides, how we use AI tools and how the site makes money.',
    h1: 'Editorial policy',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'How we research, build, check and correct the calculators.',
  },
  {
    slug: '/authors/sikander-mushtaq/',
    type: 'trust',
    title: 'Sikander Mushtaq, Founder | HomeWaterMath',
    metaDescription:
      'Sikander Mushtaq builds the calculators on HomeWaterMath and checks each formula against manufacturer specs, standards and extension guides.',
    h1: 'Sikander Mushtaq',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'Founder of HomeWaterMath. Builds and checks every calculator.',
  },
  {
    slug: '/contact/',
    type: 'trust',
    title: 'Contact HomeWaterMath',
    metaDescription:
      'Send a question, correction or suggestion to HomeWaterMath. We read every message.',
    h1: 'Contact',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'Send a question, correction or calculator idea.',
  },
  {
    slug: '/privacy/',
    type: 'trust',
    title: 'Privacy Policy | HomeWaterMath',
    metaDescription:
      'What HomeWaterMath collects, which services process it, and your choices.',
    h1: 'Privacy policy',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'What we collect, who processes it, and your choices.',
  },
  {
    slug: '/terms/',
    type: 'trust',
    title: 'Terms of Use | HomeWaterMath',
    metaDescription:
      'How you may use HomeWaterMath, the limits of our estimates, and that the calculators are not professional plumbing or well advice.',
    h1: 'Terms of use',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'How you may use the site and the limits of our estimates.',
  },
  {
    slug: '/disclaimer/',
    type: 'trust',
    title: 'Disclaimer | HomeWaterMath',
    metaDescription:
      "HomeWaterMath's calculators give estimates from published figures. They don't replace a water test, the maker's instructions or a plumber.",
    h1: 'Disclaimer',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'The limits of the estimates these calculators give.',
  },
  {
    slug: '/affiliate-disclosure/',
    type: 'trust',
    title: 'Affiliate Disclosure | HomeWaterMath',
    metaDescription:
      "How HomeWaterMath handles affiliate links. The site has no active affiliate links yet, and links never change a calculator's result.",
    h1: 'Affiliate disclosure',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'How we handle affiliate links. None are active yet.',
  },
  {
    slug: '/sitemap/',
    type: 'trust',
    title: 'Sitemap | HomeWaterMath',
    metaDescription:
      'Every page on HomeWaterMath: water softener and well water calculators, plus guides and site information.',
    h1: 'Sitemap',
    category: null,
    related: [],
    lastUpdated: DATE,
    published: DATE,
    sources: [],
    photoId: null,
    ownerNote: null,
    notCovered: [],
    cardBlurb: 'Every page on HomeWaterMath in one place.',
  },
];

// --- Derived helpers ---

export const SITE_URL = 'https://homewatermath.com';
export const SITE_NAME = 'HomeWaterMath';
export const SITE_EMAIL = 'hello@homewatermath.com';
export const AUTHOR_NAME = 'Sikander Mushtaq';
export const AUTHOR_SLUG = '/authors/sikander-mushtaq/';

export function getPage(slug: string): PageMeta | undefined {
  return PAGES.find((p) => p.slug === slug);
}

export function getPageByTitle(slug: string): string {
  return getPage(slug)?.h1 ?? slug;
}

export const toolPages = PAGES.filter((p) => p.type === 'tool');
export const hubPages = PAGES.filter((p) => p.type === 'hub');
export const trustPages = PAGES.filter((p) => p.type === 'trust');

export const HUB_FOR_CATEGORY: Record<'softeners' | 'well', string> = {
  softeners: '/water-softeners/',
  well: '/well-water/',
};

export function toolsInCategory(category: 'softeners' | 'well'): PageMeta[] {
  return toolPages.filter((p) => p.category === category);
}

export function canonical(slug: string): string {
  return slug === '/' ? `${SITE_URL}/` : `${SITE_URL}${slug}`;
}

/** Short page name for nav, breadcrumbs and short links. */
export function shortName(slug: string): string {
  const map: Record<string, string> = {
    '/water-softener-size-calculator/': 'Water softener size calculator',
    '/water-softener-cost/': 'Water softener cost calculator',
    '/water-softener-salt-calculator/': 'Water softener salt calculator',
    '/water-hardness-converter/': 'Water hardness converter',
    '/well-pressure-tank-size-calculator/': 'Well pressure tank size calculator',
  };
  return map[slug] ?? getPage(slug)?.h1 ?? slug;
}

export interface Crumb {
  name: string;
  slug: string | null; // null for the current page (not a link)
}

export function breadcrumbsFor(slug: string): Crumb[] {
  const page = getPage(slug);
  if (!page || slug === '/') return [{ name: 'Home', slug: null }];
  const crumbs: Crumb[] = [{ name: 'Home', slug: '/' }];
  if (page.type === 'tool' && page.category) {
    const hubSlug = HUB_FOR_CATEGORY[page.category];
    const hub = getPage(hubSlug);
    if (hub) crumbs.push({ name: hub.h1, slug: hubSlug });
  }
  crumbs.push({ name: page.h1, slug: null });
  return crumbs;
}

/** Latest updates for the homepage, newest first, max 6. */
export function latestUpdates(max = 6): PageMeta[] {
  return [...PAGES]
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : a.lastUpdated > b.lastUpdated ? -1 : 0))
    .slice(0, max);
}

export const NAV_ITEMS = [
  { label: 'Water softeners', href: '/water-softeners/' },
  { label: 'Well water', href: '/well-water/' },
  { label: 'How we calculate', href: '/how-we-calculate/' },
  { label: 'About', href: '/about/' },
];
