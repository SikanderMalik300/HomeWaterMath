import type { Metadata } from 'next';
import Link from 'next/link';
import TrustLayout from '@/components/TrustLayout';
import Blocks from '@/components/Blocks';
import { AUTHOR } from '@/lib/content/trust';
import { PAGES } from '@/lib/data/pages';
import { graph, profilePageLd, breadcrumbLd } from '@/lib/seo';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/authors/sikander-mushtaq/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG} jsonLd={graph(profilePageLd(), breadcrumbLd(SLUG))}>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-band-1 text-[18px] font-semibold text-brand"
          aria-hidden="true"
        >
          SM
        </div>
        <p className="text-[15px] text-muted">Founder and calculator builder</p>
      </div>

      <Blocks blocks={AUTHOR} />

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">Pages by Sikander</h2>
      <ul className="mt-4 space-y-2">
        {PAGES.filter((p) => p.slug !== SLUG).map((p) => (
          <li key={p.slug}>
            <Link href={p.slug} prefetch={false} className="link-brand">
              {p.h1}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[16px]">
        Contact:{' '}
        <a href="mailto:hello@homewatermath.com" className="link-brand">
          hello@homewatermath.com
        </a>
      </p>
    </TrustLayout>
  );
}
