'use client';

import { useEffect, useState } from 'react';

// Shown only to EEA/UK/CH visitors (Europe/* timezone) and only when GA is on.
// Choice stored in localStorage (try/catch). Off at launch (no GA id).
export default function ConsentBanner() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!gaId) return;
    let tz = '';
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      /* noop */
    }
    if (tz.indexOf('Europe/') !== 0) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('hwm-consent');
    } catch {
      /* noop */
    }
    if (!stored) setShow(true);
  }, [gaId]);

  const choose = (value: 'granted' | 'denied') => {
    try {
      localStorage.setItem('hwm-consent', value);
    } catch {
      /* noop */
    }
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    if (w.gtag) {
      w.gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: value,
      });
    }
    setShow(false);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface">
      <div className="container-hw flex flex-col items-start gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-ink">
          We use analytics cookies to see which calculators help.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => choose('granted')}
            className="h-10 rounded-pill bg-brand px-4 text-[14px] font-medium text-white hover:bg-brand-hover"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => choose('denied')}
            className="h-10 rounded-pill border border-line px-4 text-[14px] font-medium text-ink"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
