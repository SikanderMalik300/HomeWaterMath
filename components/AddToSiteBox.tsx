'use client';

import { useState } from 'react';
import { embedToolBySlug, embedSnippet } from '@/lib/embed';
import { track } from '@/lib/analytics';

// "Get this calculator for your site" box, shown only on embeddable tool pages.
// The snippet comes from lib/embed.ts (single source of truth).
export default function AddToSiteBox({ slug }: { slug: string }) {
  const tool = embedToolBySlug(slug);
  const [copied, setCopied] = useState(false);
  if (!tool) return null;
  const snippet = embedSnippet(tool);

  const copy = async () => {
    track('embed_code_copied', { tool: slug });
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <details className="rounded-card border border-line bg-surface p-5">
      <summary className="cursor-pointer list-none text-[16px] font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
        Add this calculator to your site (free)
      </summary>
      <div className="mt-3">
        <p className="text-[15px] text-ink">
          Free to use on your website, newsletter platform or intranet. No sign-up, no tracking inside the frame. Paste this code where you want the calculator to appear:
        </p>
        <textarea
          readOnly
          rows={4}
          value={snippet}
          aria-label="Embed code"
          className="mt-3 w-full rounded-card border border-line bg-band-4 p-3 font-mono text-[13px] text-ink"
        />
        <button
          type="button"
          onClick={copy}
          className="mt-2 h-10 rounded-pill bg-brand px-4 text-[14px] font-medium text-white hover:bg-brand-hover"
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
        <p className="mt-3 text-[14px] text-muted">
          Please keep the credit line under the calculator. Questions? hello@homewatermath.com
        </p>
      </div>
    </details>
  );
}
