// Generates build-time static assets into public/:
//  - copies the supplied logo files (favicons, brand) exactly as given
//  - robots.txt, sitemap.xml (with image entries), llms.txt, _headers
//  - site.webmanifest
//  - OG images (1200x630 PNG per page: brand block, H1, domain; no gradients/emoji)
// Mirrors lib/data/pages.ts and lib/data/photos.ts (kept in sync by hand so the
// script stays plain ESM with no TypeScript build step).

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LOGO = path.join(ROOT, 'logo');

const SITE = 'https://homewatermath.com';
const DATE = '2026-10-20';

// slug, h1, optional photo { base, kind }
const PAGES = [
  { slug: '/', h1: 'Water softener and well water calculators', photo: { base: 'glass-filled-with-tap-water', kind: 'hero' } },
  { slug: '/water-softeners/', h1: 'Water softener calculators' },
  { slug: '/well-water/', h1: 'Well water calculators' },
  { slug: '/water-softener-size-calculator/', h1: 'Water Softener Size Calculator', photo: { base: 'water-treatment-resin-tanks', kind: 'tile' } },
  { slug: '/water-softener-cost/', h1: 'Water Softener Cost Calculator', photo: { base: 'plumber-fitting-pipe-connection', kind: 'tile' } },
  { slug: '/water-softener-salt-calculator/', h1: 'Water Softener Salt Calculator', photo: { base: 'coarse-white-salt-crystals', kind: 'tile' } },
  { slug: '/water-hardness-converter/', h1: 'Water Hardness Converter', photo: { base: 'water-sample-in-beaker', kind: 'tile' } },
  { slug: '/well-pressure-tank-size-calculator/', h1: 'Well Pressure Tank Size Calculator', photo: { base: 'water-pressure-gauge-psi', kind: 'tile' } },
  { slug: '/well-pump-replacement-cost/', h1: 'Well Pump Replacement Cost Calculator', photo: { base: 'rural-home-green-lawn', kind: 'tile' } },
  { slug: '/water-softener-vs-salt-free-cost/', h1: 'Salt vs Salt-Free Water Softener Cost Calculator', photo: { base: 'chrome-faucet-water-droplet-scale', kind: 'tile' } },
  { slug: '/reverse-osmosis-system-cost/', h1: 'Reverse Osmosis System Cost Calculator', photo: { base: 'chrome-kitchen-faucet-double-sink', kind: 'tile' } },
  { slug: '/whole-house-water-filter-cost/', h1: 'Whole House Water Filter Cost Calculator', photo: { base: 'rain-shower-head-water', kind: 'tile' } },
  { slug: '/water-softener-installation-cost/', h1: 'Water Softener Installation Cost Calculator', photo: { base: 'plumber-hands-pipe-fitting', kind: 'tile' } },
  { slug: '/water-filters/', h1: 'Water filter calculators' },
  { slug: '/water-softener-not-working/', h1: 'Water Softener Not Working? Find the Cause', photo: { base: 'gloved-hand-adjustable-wrench', kind: 'tile' } },
  { slug: '/iron-filter-for-well-water/', h1: 'Iron Filter for Well Water: Which Type and Size', photo: { base: 'rusty-pipe-stained-wall', kind: 'tile' } },
  { slug: '/how-to-test-water-hardness/', h1: 'How to Test Water Hardness at Home' },
  { slug: '/well-water-test-kit/', h1: 'Well Water Testing: What to Test and What It Costs', photo: { base: 'hand-filling-glass-tap-water', kind: 'tile' } },
  { slug: '/how-long-do-water-softeners-last/', h1: 'How Long Do Water Softeners Last?' },
  { slug: '/water-softener-settings/', h1: 'Water Softener Settings Calculator' },
  { slug: '/water-softener-cleaner/', h1: 'Water Softener Cleaner: How Much to Use and How Often' },
  { slug: '/tds-meter-chart/', h1: 'TDS Meter Chart: What Your Reading Means' },
  { slug: '/hard-water-vs-soft-water/', h1: 'Hard Water vs Soft Water: What Actually Changes', photo: { base: 'soap-lather-hands', kind: 'tile' } },
  { slug: '/can-you-drink-softened-water/', h1: 'Can You Drink Softened Water?', photo: { base: 'clear-glass-of-water', kind: 'tile' } },
  { slug: '/about/', h1: 'About HomeWaterMath' },
  { slug: '/how-we-calculate/', h1: 'How we calculate' },
  { slug: '/editorial-policy/', h1: 'Editorial policy' },
  { slug: '/authors/sikander-mushtaq/', h1: 'Sikander Mushtaq' },
  { slug: '/contact/', h1: 'Contact' },
  { slug: '/privacy/', h1: 'Privacy policy' },
  { slug: '/terms/', h1: 'Terms of use' },
  { slug: '/disclaimer/', h1: 'Disclaimer' },
  { slug: '/affiliate-disclosure/', h1: 'Affiliate disclosure' },
  { slug: '/sitemap/', h1: 'Sitemap' },
  { slug: '/calculators-for-your-site/', h1: 'Free water calculators for your website' },
];

// llms.txt sections, mirrored from the registry: [slug, title, cardBlurb].
const TOOL_LINES = [
  ['/water-softener-size-calculator/', 'Water softener size calculator', 'Grains you need from your household and hardness, at your real salt setting.'],
  ['/water-softener-settings/', 'Water softener settings calculator', 'What to enter on your softener: hardness, capacity, reserve and day override.'],
  ['/water-softener-cost/', 'Water softener cost calculator', 'Unit, install, salt and service, with a 10-year total and a quote check.'],
  ['/water-softener-salt-calculator/', 'Water softener salt calculator', 'Pounds per month, bags per year and yearly cost for your softener.'],
  ['/water-softener-installation-cost/', 'Water softener installation cost calculator', 'Itemized install labor: loop, drain, outlet, removal and permit.'],
  ['/water-softener-vs-salt-free-cost/', 'Salt vs salt-free water softener cost calculator', 'Salt vs salt-free over 10 years for your home, with what each one does.'],
  ['/water-hardness-converter/', 'Water hardness converter', 'gpg, ppm, mg/L, mmol/L and German or French degrees in one step.'],
  ['/well-pressure-tank-size-calculator/', 'Well pressure tank size calculator', "Tank size and pre-charge from your pump's gpm, horsepower and switch setting."],
  ['/well-pump-replacement-cost/', 'Well pump replacement cost calculator', 'Pump, pipe, wire, tank and call-out by type and depth, plus repair-or-replace.'],
  ['/reverse-osmosis-system-cost/', 'Reverse osmosis system cost calculator', 'Under-sink, tankless or countertop, with filters and water sent to drain.'],
  ['/whole-house-water-filter-cost/', 'Whole house water filter cost calculator', 'Cartridge, carbon tank or well system, with media changes for your use.'],
];

const GUIDE_LINES = [
  ['/water-softener-not-working/', 'Water softener not working? Find the cause', 'Five free checks, repair costs, and repair-or-replace.'],
  ['/iron-filter-for-well-water/', 'Iron filter for well water: which type and size', 'Which filter and size from your iron, manganese, sulfur and flow.'],
  ['/how-to-test-water-hardness/', 'How to test water hardness at home', 'Strips, drop-count kits, a lab or your utility report.'],
  ['/well-water-test-kit/', 'Well water testing: what to test and what it costs', 'What to test, when, EPA limits, and what it costs.'],
  ['/how-long-do-water-softeners-last/', 'How long do water softeners last?', 'Life by part, what wears out first, warranties.'],
  ['/water-softener-cleaner/', 'Water softener cleaner: dose and how often', 'Dose and how often, with label doses and a dose calculator.'],
  ['/tds-meter-chart/', 'TDS meter chart: what your reading means', 'What your reading means, taste bands and an RO check.'],
  ['/hard-water-vs-soft-water/', 'Hard water vs soft water: what actually changes', 'Scale, soap, skin, health and sodium, with the test results.'],
  ['/can-you-drink-softened-water/', 'Can you drink softened water?', 'How much sodium softening adds, and when to keep a plain tap.'],
];

const HUB_LINES = [
  ['/water-softeners/', 'Water softener calculators', 'Size, cost, salt, install, salt vs salt-free, and hardness for US homes.'],
  ['/well-water/', 'Well water calculators', 'Pressure tank sizing, well pump replacement cost, hardness and softener sizing.'],
  ['/water-filters/', 'Water filter calculators', 'Reverse osmosis and whole house filter cost, filters and media over 10 years.'],
];

const ABOUT_LINES = [
  ['/about/', 'About HomeWaterMath', 'Who runs the site and how the calculators are built.'],
  ['/how-we-calculate/', 'How we calculate', 'The formulas, constants and sources behind every calculator.'],
  ['/editorial-policy/', 'Editorial policy', 'How we research, build, check and correct the calculators.'],
  ['/authors/sikander-mushtaq/', 'Sikander Mushtaq', 'Founder of HomeWaterMath. Builds and checks every calculator.'],
];

const LOGO_FILES = [
  'icon.svg',
  'logo.svg',
  'logo-on-dark.svg',
  'logo-512.png',
  'favicon-48.png',
  'favicon-96.png',
  'icon-192.png',
  'apple-touch-icon.png',
  'logo-wordmark.png',
];

function ogName(slug) {
  if (slug === '/') return 'home';
  return slug.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
}

function canonical(slug) {
  return slug === '/' ? `${SITE}/` : `${SITE}${slug}`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyLogos() {
  await ensureDir(PUBLIC);
  await ensureDir(path.join(PUBLIC, 'brand'));
  for (const file of LOGO_FILES) {
    const src = path.join(LOGO, file);
    try {
      const buf = await fs.readFile(src);
      await fs.writeFile(path.join(PUBLIC, file), buf);
      await fs.writeFile(path.join(PUBLIC, 'brand', file), buf);
    } catch (e) {
      console.warn(`logo copy skipped (${file}): ${e.message}`);
    }
  }
}

async function writeRobots() {
  // Allow all, plus explicit groups so the intent is obvious to auditors.
  // /embed/ is intentionally not disallowed: those pages use noindex, which
  // needs crawling to take effect.
  const txt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
  await fs.writeFile(path.join(PUBLIC, 'robots.txt'), txt);
}

async function writeSitemap() {
  const urls = PAGES.map((p) => {
    const loc = canonical(p.slug);
    let img = '';
    if (p.photo) {
      const w = p.photo.kind === 'hero' ? 1280 : 600;
      img = `\n    <image:image><image:loc>${SITE}/photos/${p.photo.base}-${w}.jpg</image:loc></image:image>`;
    }
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${DATE}</lastmod>${img}\n  </url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`;
  await fs.writeFile(path.join(PUBLIC, 'sitemap.xml'), xml);
}

async function writeLlms() {
  const section = (rows) => rows.map(([slug, title, desc]) => `- [${title}](${canonical(slug)}): ${desc}`);
  const lines = [
    '# HomeWaterMath',
    '',
    'Free, source-backed calculators and guides for home water: water softeners, private wells and water filters. Every formula and source is shown.',
    '',
    '## Calculators',
    ...section(TOOL_LINES),
    '',
    '## Guides',
    ...section(GUIDE_LINES),
    '',
    '## Category pages',
    ...section(HUB_LINES),
    '',
    '## About this site',
    ...section(ABOUT_LINES),
    '',
  ];
  await fs.writeFile(path.join(PUBLIC, 'llms.txt'), lines.join('\n'));
}

async function writeHeaders() {
  // /embed/* unsets X-Frame-Options so the pages can be framed cross-origin,
  // allows any frame ancestor, is noindex, and uses no-transform so Cloudflare
  // does not inject its analytics beacon into the HTML.
  const txt = `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
/photos/*
  Cache-Control: public, max-age=31536000, immutable
/embed/*
  X-Robots-Tag: noindex
  Cache-Control: public, max-age=3600, no-transform
  Content-Security-Policy: frame-ancestors *
  Referrer-Policy: strict-origin-when-cross-origin
  ! X-Frame-Options
`;
  await fs.writeFile(path.join(PUBLIC, '_headers'), txt);
}

async function writeManifest() {
  const manifest = {
    name: 'HomeWaterMath',
    short_name: 'HomeWaterMath',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#1d5a7e',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
  await fs.writeFile(path.join(PUBLIC, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrap(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function writeOgImages() {
  const dir = path.join(PUBLIC, 'og');
  await ensureDir(dir);
  for (const p of PAGES) {
    const lines = wrap(p.h1, 20);
    const startY = 300 - (lines.length - 1) * 38;
    const tspans = lines
      .map((l, i) => `<tspan x="80" y="${startY + i * 76}">${escapeXml(l)}</tspan>`)
      .join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect width="1200" height="630" fill="#ffffff"/>
      <rect width="1200" height="16" fill="#1d5a7e"/>
      <text x="80" y="140" font-family="Arial, sans-serif" font-size="34" font-weight="600" fill="#1d5a7e">HomeWater<tspan fill="#16212b">Math</tspan></text>
      <text font-family="Arial, sans-serif" font-size="60" font-weight="600" fill="#16212b">${tspans}</text>
      <text x="80" y="560" font-family="Arial, sans-serif" font-size="28" fill="#4f5d68">homewatermath.com</text>
    </svg>`;
    await sharp(Buffer.from(svg)).png().toFile(path.join(dir, `${ogName(p.slug)}.png`));
  }
}

async function main() {
  await ensureDir(PUBLIC);
  await copyLogos();
  await writeRobots();
  await writeSitemap();
  await writeLlms();
  await writeHeaders();
  await writeManifest();
  await writeOgImages();
  console.log(`generate-assets: ${PAGES.length} pages, OG images + sitemap + robots + llms + _headers + manifest + logos done.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
