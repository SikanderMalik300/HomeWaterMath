import Link from 'next/link';
import { breadcrumbsFor } from '@/lib/data/pages';

export default function Breadcrumbs({ slug }: { slug: string }) {
  const crumbs = breadcrumbsFor(slug);
  if (crumbs.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-x-1.5">
            {c.slug ? (
              <Link href={c.slug} prefetch={false} className="hover:text-brand underline-offset-2 hover:underline">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            )}
            {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
