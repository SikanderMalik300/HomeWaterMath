import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { EMBED_TOOLS, embedSnippet, embedUrl, applyEmbedHeight, embedToolBySlug } from '@/lib/embed';
import { getPage } from '@/lib/data/pages';

const OUT = path.join(process.cwd(), 'out');

describe('embed: single source of truth', () => {
  it('has 4 embeddable tools, each a real tool page in the registry', () => {
    expect(EMBED_TOOLS).toHaveLength(4);
    EMBED_TOOLS.forEach((t) => {
      const page = getPage(t.slug);
      expect(page, t.slug).toBeDefined();
      expect(page?.type).toBe('tool');
      expect(t.param).toBe(t.slug.replace(/\//g, ''));
    });
  });

  it('embedSnippet builds the exact iframe + credit + script line', () => {
    const t = embedToolBySlug('/water-softener-size-calculator/')!;
    expect(embedSnippet(t)).toBe(
      '<iframe src="https://homewatermath.com/embed/water-softener-size-calculator/" title="Water softener size calculator" width="100%" height="1030" style="border:0;max-width:680px" loading="lazy"></iframe>' +
        '<p style="font:14px/1.4 sans-serif;margin:6px 0 0">Calculator by <a href="https://homewatermath.com/water-softener-size-calculator/">HomeWaterMath</a></p>' +
        '<script src="https://homewatermath.com/embed.js" async></script>',
    );
  });

  it('applyEmbedHeight sets height only on the matching iframe src', () => {
    const make = (src: string) => ({ getAttribute: () => src, style: { height: '' } });
    const a = make('https://homewatermath.com/embed/water-hardness-converter/');
    const b = make('https://homewatermath.com/embed/water-softener-salt-calculator/');
    applyEmbedHeight([a, b], { type: 'hwm-embed-height', tool: 'water-hardness-converter', height: 500 });
    expect(a.style.height).toBe('500px');
    expect(b.style.height).toBe('');
  });

  it('applyEmbedHeight ignores malformed messages', () => {
    const a = { getAttribute: () => 'https://homewatermath.com/embed/water-hardness-converter/', style: { height: '' } };
    applyEmbedHeight([a], { type: 'other', tool: 'water-hardness-converter', height: 500 });
    applyEmbedHeight([a], { type: 'hwm-embed-height', tool: 'water-hardness-converter' });
    expect(a.style.height).toBe('');
  });
});

describe.skipIf(!existsSync(OUT))('embed: built output', () => {
  EMBED_TOOLS.forEach((t) => {
    it(`${t.param} embed page: default result, noindex, canonical, no site chrome`, () => {
      const html = readFileSync(path.join(OUT, 'embed', t.param, 'index.html'), 'utf8');
      expect(html).toMatch(/content="noindex/);
      expect(html).toContain(`<link rel="canonical" href="https://homewatermath.com${t.slug}"`);
      expect(html).toContain('Open the full calculator, with sources, on HomeWaterMath');
      // No site header nav rendered inside the embed.
      expect(html).not.toContain('Skip to content');
      // No GA inside the embed.
      expect(html).not.toContain('googletagmanager');
    });
  });

  it('each embeddable tool page contains its embed snippet URLs', () => {
    EMBED_TOOLS.forEach((t) => {
      const html = readFileSync(path.join(OUT, t.slug.replace(/^\/|\/$/g, ''), 'index.html'), 'utf8');
      expect(html, `${t.slug} has embed url`).toContain(embedUrl(t));
    });
  });

  it('_headers has an /embed/* block that unsets X-Frame-Options', () => {
    const headers = readFileSync(path.join(OUT, '_headers'), 'utf8');
    expect(headers).toContain('/embed/*');
    const block = headers.slice(headers.indexOf('/embed/*'));
    expect(block).toContain('X-Robots-Tag: noindex');
    expect(block).toContain('no-transform');
    expect(block).toContain('frame-ancestors *');
    expect(block).toContain('! X-Frame-Options');
  });

  it('/embed/ is excluded from sitemap.xml and llms.txt', () => {
    expect(readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8')).not.toContain('/embed/');
    expect(readFileSync(path.join(OUT, 'llms.txt'), 'utf8')).not.toContain('/embed/');
  });

  it('the default size-calc result (48,000-grain) renders in the size embed HTML', () => {
    const html = readFileSync(path.join(OUT, 'embed', 'water-softener-size-calculator', 'index.html'), 'utf8');
    expect(html).toContain('48,000-grain softener');
  });
});
