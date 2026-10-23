// Checks that inside <main>, no heading level jumps by more than 1 from the
// previous heading, on every tool page. Run after `next build`.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');

const TOOL_SLUGS = [
  'water-softener-size-calculator',
  'water-softener-cost',
  'water-softener-salt-calculator',
  'water-softener-installation-cost',
  'water-softener-vs-salt-free-cost',
  'water-hardness-converter',
  'well-pressure-tank-size-calculator',
  'well-pump-replacement-cost',
  'reverse-osmosis-system-cost',
  'whole-house-water-filter-cost',
  'water-softener-not-working',
  'iron-filter-for-well-water',
  'how-to-test-water-hardness',
  'well-water-test-kit',
  'how-long-do-water-softeners-last',
];

export function headingLevelsInMain(html) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = main ? main[1] : html;
  return [...scope.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
}

export function findSkips(levels) {
  const skips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) skips.push(`h${levels[i - 1]} -> h${levels[i]}`);
  }
  return skips;
}

async function main() {
  let failures = 0;
  for (const slug of TOOL_SLUGS) {
    const file = path.join(OUT, slug, 'index.html');
    let html;
    try {
      html = await fs.readFile(file, 'utf8');
    } catch {
      console.log(`SKIP /${slug}/ (no build output)`);
      continue;
    }
    const levels = headingLevelsInMain(html);
    const skips = findSkips(levels);
    if (skips.length === 0) {
      console.log(`ok   /${slug}/  [${levels.map((l) => 'h' + l).join(' ')}]`);
    } else {
      failures++;
      console.log(`FAIL /${slug}/  skips: ${skips.join(', ')}  [${levels.map((l) => 'h' + l).join(' ')}]`);
    }
  }
  if (failures > 0) {
    console.error(`\n${failures} tool page(s) have heading-order skips.`);
    process.exit(1);
  }
  console.log('\nAll tool pages pass heading order.');
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('check-heading-order.mjs')) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
