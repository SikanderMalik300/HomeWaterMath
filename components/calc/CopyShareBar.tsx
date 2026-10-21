'use client';

import { useState } from 'react';
import { Copy, Share2, Printer, Check } from 'lucide-react';
import { track } from '@/lib/analytics';

// Copy result text, Share a link with the current query params, Print.
export default function CopyShareBar({
  resultText,
  query,
  tool,
}: {
  resultText: string;
  query: string; // e.g. "people=4&hardness=15"
  tool?: string;
}) {
  const [copied, setCopied] = useState<null | 'result' | 'link'>(null);

  const flash = (which: 'result' | 'link') => {
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyResult = async () => {
    if (tool) track('copy_result', { tool });
    try {
      await navigator.clipboard.writeText(resultText);
      flash('result');
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareLink = async () => {
    if (tool) track('share_link', { tool });
    const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const url = query ? `${base}?${query}` : base;
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        flash('link');
      }
    } catch {
      /* cancelled or unavailable */
    }
  };

  const btn =
    'inline-flex min-h-[44px] items-center gap-1.5 rounded-pill border border-line bg-surface px-4 text-[14px] font-medium text-ink hover:border-brand';

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" onClick={copyResult} className={btn}>
        {copied === 'result' ? (
          <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        )}
        {copied === 'result' ? 'Copied' : 'Copy result'}
      </button>
      <button type="button" onClick={shareLink} className={btn}>
        {copied === 'link' ? (
          <Check className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        )}
        {copied === 'link' ? 'Link copied' : 'Share'}
      </button>
      <button type="button" onClick={() => window.print()} className={btn}>
        <Printer className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        Print
      </button>
    </div>
  );
}
