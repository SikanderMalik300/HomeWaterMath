'use client';

import { useEffect } from 'react';

// Posts the document height to the parent window on load and whenever the
// content resizes (e.g. a result changes). No network calls, no cookies.
export default function EmbedAutoHeight({ tool }: { tool: string }) {
  useEffect(() => {
    const post = () => {
      try {
        window.parent.postMessage(
          { type: 'hwm-embed-height', tool, height: document.documentElement.scrollHeight },
          '*',
        );
      } catch {
        /* cross-origin parent without a listener is fine */
      }
    };
    post();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(post);
      ro.observe(document.documentElement);
    }
    window.addEventListener('load', post);
    return () => {
      ro?.disconnect();
      window.removeEventListener('load', post);
    };
  }, [tool]);
  return null;
}
