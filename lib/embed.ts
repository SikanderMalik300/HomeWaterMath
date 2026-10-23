// Single source of truth for embeddable calculators: which tools, the iframe
// snippet, and the auto-height matcher. Used by the embed pages, the
// "add to site" box, the landing page and embed.js (logic mirrored).

export interface EmbedTool {
  slug: string; // full tool slug, e.g. /water-softener-size-calculator/
  param: string; // slug segment, e.g. water-softener-size-calculator
  title: string; // sentence-case title for the iframe and credit
  height: number; // fixed fallback iframe height
}

export const SITE = 'https://homewatermath.com';

// Heights measured from the default render at 680px wide, rounded up with a
// small margin; embed.js corrects them live for input and show-the-math changes.
export const EMBED_TOOLS: EmbedTool[] = [
  { slug: '/water-softener-size-calculator/', param: 'water-softener-size-calculator', title: 'Water softener size calculator', height: 1380 },
  { slug: '/water-hardness-converter/', param: 'water-hardness-converter', title: 'Water hardness converter', height: 720 },
  { slug: '/water-softener-salt-calculator/', param: 'water-softener-salt-calculator', title: 'Water softener salt calculator', height: 1200 },
  { slug: '/well-pressure-tank-size-calculator/', param: 'well-pressure-tank-size-calculator', title: 'Well pressure tank size calculator', height: 760 },
];

export function isEmbeddable(slug: string): boolean {
  return EMBED_TOOLS.some((t) => t.slug === slug);
}

export function embedToolBySlug(slug: string): EmbedTool | undefined {
  return EMBED_TOOLS.find((t) => t.slug === slug);
}

export function embedToolByParam(param: string): EmbedTool | undefined {
  return EMBED_TOOLS.find((t) => t.param === param);
}

export function embedUrl(tool: EmbedTool): string {
  return `${SITE}/embed/${tool.param}/`;
}

export function toolUrl(tool: EmbedTool): string {
  return `${SITE}${tool.slug}`;
}

/** The exact one-line embed snippet (iframe + credit + auto-height script). */
export function embedSnippet(tool: EmbedTool): string {
  return (
    `<iframe src="${embedUrl(tool)}" title="${tool.title}" width="100%" height="${tool.height}" style="border:0;max-width:680px" loading="lazy"></iframe>` +
    `<p style="font:14px/1.4 sans-serif;margin:6px 0 0">Calculator by <a href="${toolUrl(tool)}">HomeWaterMath</a></p>` +
    `<script src="${SITE}/embed.js" async></script>`
  );
}

interface FrameLike {
  getAttribute?(name: string): string | null;
  src?: string;
  style: { height: string };
}

/** Set height on iframes whose src is the embed for data.tool (matcher used by embed.js). */
export function applyEmbedHeight(
  frames: ArrayLike<FrameLike>,
  data: { type?: string; tool?: string; height?: number },
): void {
  if (!data || data.type !== 'hwm-embed-height' || !data.tool || typeof data.height !== 'number') return;
  const needle = `/embed/${data.tool}/`;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const src = f.getAttribute ? f.getAttribute('src') : f.src;
    if (src && src.indexOf(needle) !== -1) f.style.height = `${data.height}px`;
  }
}
