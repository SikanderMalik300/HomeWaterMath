'use client';

import Script from 'next/script';

// GA4 loads only when NEXT_PUBLIC_GA_ID is set (off at launch). Consent Mode v2:
// analytics_storage and ad_storage default to denied for EEA/UK/CH visitors
// (Europe/* timezone heuristic, since CF-IPCountry is not available on static
// pages), granted elsewhere. Loaded lazily so it never blocks the main thread.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return (
    <>
      <Script id="ga-consent" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var tz = '';
          try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e) {}
          var eu = tz.indexOf('Europe/') === 0;
          var stored = null;
          try { stored = localStorage.getItem('hwm-consent'); } catch(e) {}
          var granted = eu ? (stored === 'granted') : true;
          gtag('consent', 'default', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: granted ? 'granted' : 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="lazyOnload"
      />
    </>
  );
}
