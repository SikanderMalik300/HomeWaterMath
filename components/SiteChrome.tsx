'use client';

import { usePathname } from 'next/navigation';

// Wraps the page. On /embed/* it renders only the page content (no header,
// footer, nav, analytics, consent or outbound tracking), so embedded
// calculators carry no site chrome and no tracking. Everywhere else it renders
// the full site chrome. The header/footer/analytics are passed in as already
// server-rendered nodes so they stay server components.
export default function SiteChrome({
  header,
  footer,
  analytics,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  analytics: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith('/embed/')) {
    return <>{children}</>;
  }
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {header}
      <main id="main">{children}</main>
      {footer}
      {analytics}
    </>
  );
}
