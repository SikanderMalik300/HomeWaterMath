import Link from 'next/link';
import { HeroSearch } from '@/components/SiteSearch';
import { toolPages } from '@/lib/data/pages';

export const metadata = {
  title: 'Page not found | HomeWaterMath',
};

export default function NotFound() {
  return (
    <div className="container-hw py-16">
      <div className="mx-auto max-w-content">
        <h1 className="text-[30px] font-medium md:text-[40px]">Page not found</h1>
        <p className="mt-4 text-[16px]">
          That page doesn&apos;t exist or has moved. Try one of these calculators:
        </p>
        <ul className="mt-4 space-y-2">
          {toolPages.map((p) => (
            <li key={p.slug}>
              <Link href={p.slug} prefetch={false} className="link-brand">
                {p.h1}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <HeroSearch placeholder="Search calculators" />
        </div>
      </div>
    </div>
  );
}
