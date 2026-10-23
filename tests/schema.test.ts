import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { PAGES } from '@/lib/data/pages';

// Structured-data checks against the built HTML (fix-04): every page has exactly
// one WebPage-family node with author + datePublished + dateModified, and every
// @id reference inside the page graph resolves to a node in the same graph.
const OUT = path.join(process.cwd(), 'out');
const WEBPAGE_TYPES = ['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'ProfilePage'];

function graphFor(html: string): Array<Record<string, unknown>> {
  const nodes: Array<Record<string, unknown>> = [];
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? [];
  for (const b of blocks) {
    const json = b.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data['@graph'])) nodes.push(...data['@graph']);
      else nodes.push(data);
    } catch {
      /* ignore */
    }
  }
  return nodes;
}

function collectIdRefs(value: unknown, out: string[]): void {
  if (Array.isArray(value)) value.forEach((v) => collectIdRefs(v, out));
  else if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 1 && typeof obj['@id'] === 'string') out.push(obj['@id'] as string);
    else Object.entries(obj).forEach(([k, v]) => (k === '@id' ? null : collectIdRefs(v, out)));
  }
}

describe.skipIf(!existsSync(OUT))('structured data (built HTML)', () => {
  PAGES.forEach((p) => {
    it(`${p.slug} has one WebPage node with author + dates and resolving @ids`, () => {
      const file = path.join(OUT, p.slug === '/' ? 'index.html' : path.join(p.slug.replace(/^\/|\/$/g, ''), 'index.html'));
      const nodes = graphFor(readFileSync(file, 'utf8'));
      expect(nodes.length, `${p.slug} has JSON-LD`).toBeGreaterThan(0);

      const webpages = nodes.filter((n) => WEBPAGE_TYPES.includes(String(n['@type'])));
      expect(webpages.length, `${p.slug} exactly one WebPage-type node`).toBe(1);
      const wp = webpages[0];
      expect(wp.author, `${p.slug} webpage.author`).toBeTruthy();
      expect(wp.datePublished, `${p.slug} webpage.datePublished`).toBeTruthy();
      expect(wp.dateModified, `${p.slug} webpage.dateModified`).toBeTruthy();

      const definedIds = new Set(nodes.map((n) => n['@id']).filter(Boolean) as string[]);
      const refs: string[] = [];
      collectIdRefs(nodes, refs);
      refs.forEach((ref) => expect(definedIds.has(ref), `${p.slug} @id ${ref} resolves`).toBe(true));
    });
  });
});
