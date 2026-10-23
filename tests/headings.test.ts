import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { toolPages, guidePages, getPage } from '@/lib/data/pages';

const landing = getPage('/calculators-for-your-site/');
const checkedPages = [...toolPages, ...guidePages, ...(landing ? [landing] : [])];

// Heading-order check against the built HTML. Inside <main>, no heading level
// may jump by more than 1 from the previous heading (PageSpeed a11y). Requires
// a prior `next build`; when out/ is absent the suite is skipped.
const OUT = path.join(process.cwd(), 'out');

function headingLevelsInMain(html: string): number[] {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const scope = main ? main[1] : html;
  return [...scope.matchAll(/<h([1-6])[^>]*>/gi)].map((m) => Number(m[1]));
}

function findSkips(levels: number[]): string[] {
  const skips: string[] = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) skips.push(`h${levels[i - 1]} -> h${levels[i]}`);
  }
  return skips;
}

describe.skipIf(!existsSync(OUT))('tool and guide page heading order (built HTML)', () => {
  checkedPages.forEach((p) => {
    it(`no heading-level skip inside <main> on ${p.slug}`, () => {
      const file = path.join(OUT, p.slug.replace(/^\/|\/$/g, ''), 'index.html');
      const html = readFileSync(file, 'utf8');
      const levels = headingLevelsInMain(html);
      expect(levels[0], `${p.slug} first heading should be h1`).toBe(1);
      expect(findSkips(levels), `${p.slug} headings: ${levels.map((l) => 'h' + l).join(' ')}`).toEqual([]);
    });
  });
});
