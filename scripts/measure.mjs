// Measurement pass for the launch report:
//  - per-page first-load JS, gzipped (A11 budget: <= 100 KB gzipped per tool page)
//  - WCAG contrast ratios for the design tokens (design section 3)
//  - homepage first mobile-load image bytes + image weight summary

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');

const gzip = (buf) => zlib.gzipSync(buf, { level: 9 }).length;

async function fileGzip(rel) {
  const p = path.join(OUT, rel.replace(/^\//, ''));
  try {
    const buf = await fs.readFile(p);
    return gzip(buf);
  } catch {
    return 0;
  }
}

const PAGES = [
  ['/', 'index.html'],
  ['/water-softener-size-calculator/', 'water-softener-size-calculator/index.html'],
  ['/water-softener-cost/', 'water-softener-cost/index.html'],
  ['/water-softener-salt-calculator/', 'water-softener-salt-calculator/index.html'],
  ['/water-hardness-converter/', 'water-hardness-converter/index.html'],
  ['/well-pressure-tank-size-calculator/', 'well-pressure-tank-size-calculator/index.html'],
];

async function perPageJs() {
  console.log('\n== First-load JS (gzipped) ==');
  for (const [slug, file] of PAGES) {
    const html = await fs.readFile(path.join(OUT, file), 'utf8');
    // Only real first-load scripts: <script src="..."> and <link ... href="...">
    // preloads. Excludes chunk names listed in the RSC flight payload (those are
    // for client-side navigation, not the initial page load).
    const jsRefs = [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+?\.js)"/g)].map(
      (m) => m[1],
    );
    const uniq = [...new Set(jsRefs)];
    let total = 0;
    for (const ref of uniq) total += await fileGzip(ref);
    console.log(`${slug.padEnd(42)} ${(total / 1024).toFixed(1)} KB gzip  (${uniq.length} chunks)`);
  }
}

// --- WCAG contrast ---
function lum(hex) {
  const c = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function ratio(fg, bg) {
  const a = lum(fg) + 0.05;
  const b = lum(bg) + 0.05;
  return +( (Math.max(a, b) / Math.min(a, b)).toFixed(2) );
}

function contrast() {
  const ink = '#16212B', muted = '#4F5D68', brand = '#1D5A7E', white = '#FFFFFF';
  const bands = { white: '#FFFFFF', mist: '#EAF1F4', sage: '#E4EDE7', stone: '#EEEBE5', paper: '#F6F4F0' };
  console.log('\n== WCAG contrast ratios ==');
  for (const [name, hex] of Object.entries(bands)) {
    console.log(`ink   on ${name.padEnd(6)} ${ratio(ink, hex)}`);
  }
  for (const [name, hex] of Object.entries(bands)) {
    console.log(`muted on ${name.padEnd(6)} ${ratio(muted, hex)}`);
  }
  for (const [name, hex] of Object.entries(bands)) {
    console.log(`brand on ${name.padEnd(6)} ${ratio(brand, hex)}`);
  }
  console.log(`white on brand  ${ratio(white, brand)}`);
  console.log(`warn-ink #6B4A00 on warn-bg #FFF6E5  ${ratio('#6B4A00', '#FFF6E5')}  (target >= 7)`);
}

async function images() {
  console.log('\n== Images ==');
  const hero = await fs.readFile(path.join(OUT, 'photos/glass-filled-with-tap-water-1280.avif')).catch(() => null);
  const heroMobile = await fs.readFile(path.join(OUT, 'photos/glass-filled-with-tap-water-640.avif')).catch(() => null);
  if (heroMobile) console.log(`hero 640 AVIF (mobile first load): ${(heroMobile.length / 1024).toFixed(1)} KB`);
  if (hero) console.log(`hero 1280 AVIF (desktop): ${(hero.length / 1024).toFixed(1)} KB`);
  const dir = path.join(OUT, 'photos');
  const files = await fs.readdir(dir);
  let total = 0;
  for (const f of files) total += (await fs.stat(path.join(dir, f))).size;
  console.log(`all processed photo files: ${files.length}, total ${(total / 1024).toFixed(0)} KB`);
}

async function main() {
  await perPageJs();
  contrast();
  await images();
}
main().catch((e) => { console.error(e); process.exit(1); });
