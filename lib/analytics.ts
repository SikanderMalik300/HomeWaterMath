// Minimal GA4 event helper. No-op unless gtag is present (i.e. GA is on, which
// only happens when NEXT_PUBLIC_GA_ID is set). Consent is handled by Consent
// Mode defaults set in components/Analytics.tsx, so events while consent is
// denied are sent cookieless and storage-less.

export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.('event', name, params);
}
