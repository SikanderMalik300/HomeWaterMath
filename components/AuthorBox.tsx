import Link from 'next/link';
import { AUTHOR_NAME, AUTHOR_SLUG } from '@/lib/data/pages';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function AuthorBox({ lastUpdated }: { lastUpdated: string }) {
  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-band-1 text-[18px] font-semibold text-brand"
          aria-hidden="true"
        >
          SM
        </div>
        <div className="min-w-0">
          <Link href={AUTHOR_SLUG} prefetch={false} className="text-[16px] font-medium text-ink hover:text-brand hover:underline">
            {AUTHOR_NAME}
          </Link>
          <p className="text-[14px] text-muted">
            Founder of HomeWaterMath. Builds and checks every calculator.
          </p>
          <p className="mt-1 text-[14px] text-muted">
            Last updated: {formatDate(lastUpdated)} ·{' '}
            <Link href="/editorial-policy/" prefetch={false} className="link-brand">
              Editorial policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
