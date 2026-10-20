import type { Metadata } from 'next';
import Link from 'next/link';
import TrustLayout from '@/components/TrustLayout';
import { toolsInCategory, trustPages, getPage } from '@/lib/data/pages';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/sitemap/';
export const metadata: Metadata = buildMetadata(SLUG);

function PageList({ slugs }: { slugs: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {slugs.map((slug) => {
        const p = getPage(slug);
        if (!p) return null;
        return (
          <li key={slug}>
            <Link href={slug} prefetch={false} className="link-brand">
              {p.h1}
            </Link>
            {p.cardBlurb && <span className="text-muted"> · {p.cardBlurb}</span>}
          </li>
        );
      })}
    </ul>
  );
}

export default function Page() {
  const softeners = toolsInCategory('softeners').map((p) => p.slug);
  const well = toolsInCategory('well').map((p) => p.slug);
  const about = trustPages.map((p) => p.slug);

  return (
    <TrustLayout slug={SLUG}>
      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">Calculators</h2>

      <h3 className="mt-5 text-[20px] font-medium">
        <Link href="/water-softeners/" prefetch={false} className="link-brand">
          Water softeners
        </Link>
      </h3>
      <PageList slugs={softeners} />

      <h3 className="mt-5 text-[20px] font-medium">
        <Link href="/well-water/" prefetch={false} className="link-brand">
          Well water
        </Link>
      </h3>
      <PageList slugs={well} />

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">Guides</h2>
      <p className="mt-3 text-[16px] text-muted">No guides yet.</p>

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">About and legal</h2>
      <PageList slugs={about} />
    </TrustLayout>
  );
}
