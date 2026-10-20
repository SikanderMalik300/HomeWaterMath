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
];

const TOOL_LINES = [
  ['/water-softener-size-calculator/', 'Size a water softener in grains for your home and hardness.'],
  ['/water-softener-cost/', 'Water softener cost: unit, install, salt and a 10-year total.'],
  ['/water-softener-salt-calculator/', 'Salt use per month and year, bags and cost.'],
  ['/water-hardness-converter/', 'Convert hardness between gpg, ppm, mg/L, mmol/L and degrees.'],
  ['/well-pressure-tank-size-calculator/', 'Size a well pressure tank from pump flow, horsepower and switch.'],
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
  const txt = `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`;
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
  const lines = [
    '# HomeWaterMath',
    '',
    'Free, source-backed calculators for home water: water softeners and private wells. Every formula and source is shown.',
    '',
    '## Calculators',
    ...TOOL_LINES.map(([slug, desc]) => `- ${canonical(slug)}: ${desc}`),
    '',
  ];
  await fs.writeFile(path.join(PUBLIC, 'llms.txt'), lines.join('\n'));
}

async function writeHeaders() {
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
