import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import ConsentBanner from '@/components/ConsentBanner';
import OutboundTracker from '@/components/OutboundTracker';
import SiteChrome from '@/components/SiteChrome';
import { SITE_URL, SITE_NAME } from '@/lib/data/pages';

// Figtree, weights 400/500/600, display: swap (A11). Self-hosted from the
// @fontsource/figtree woff2 files via next/font/local. Functionally identical to
// next/font/google (both self-host at build); used here because this build
// environment cannot reach fonts.googleapis.com. Swap to next/font/google in a
// networked build if preferred.
const figtree = localFont({
  src: [
    { path: '../fonts/figtree-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/figtree-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/figtree-600.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HomeWaterMath: Water Softener and Well Water Calculators',
    template: '%s',
  },
  applicationName: SITE_NAME,
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport = {
  themeColor: '#1d5a7e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="font-sans">
        <SiteChrome
          header={<Header />}
          footer={<Footer />}
          analytics={
            <>
              <Analytics />
              <ConsentBanner />
              <OutboundTracker />
            </>
          }
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
