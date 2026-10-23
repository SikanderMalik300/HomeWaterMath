import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PAGES } from '@/lib/data/pages';

// Every <table> inside <main> on every built page must have a non-empty
// <caption> (fix-04 AEO/GEO). Requires a prior `next build`.
const OUT = path.join(process.cwd(), 'out');

function mainHtml(html: string): string {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

describe.skipIf(!existsSync(OUT))('table captions (built HTML)', () => {
  PAGES.forEach((p) => {
    it(`every table in <main> has a non-empty caption on ${p.slug}`, () => {
      const file = path.join(OUT, p.slug.replace(/^\/|\/$/g, ''), 'index.html');
      if (!existsSync(file)) return;
      const scope = mainHtml(readFileSync(file, 'utf8'));
      const tables = scope.match(/<table[\s\S]*?<\/table>/gi) ?? [];
      tables.forEach((t, i) => {
        const cap = t.match(/<caption[^>]*>([\s\S]*?)<\/caption>/i);
        expect(cap, `${p.slug} table ${i} has a <caption>`).not.toBeNull();
        const text = (cap?.[1] ?? '').replace(/<[^>]+>/g, '').trim();
        expect(text.length, `${p.slug} table ${i} caption non-empty`).toBeGreaterThan(0);
      });
    });
  });
});
