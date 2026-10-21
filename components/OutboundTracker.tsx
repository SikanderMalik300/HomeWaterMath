'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

// One delegated listener for outbound clicks (A8 outbound_click). Fires for any
// anchor whose href points to another origin. No-op unless GA is on (track()
// handles that).
export default function OutboundTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('a');
      if (!el) return;
      const href = el.getAttribute('href');
      if (!href) return;
      try {
        const url = new URL(href, window.location.href);
        const isHttp = url.protocol === 'http:' || url.protocol === 'https:';
        if (isHttp && url.origin !== window.location.origin) {
          track('outbound_click', { url: url.href });
        }
      } catch {
        /* non-URL href (mailto:, tel:, #) - ignore */
      }
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
