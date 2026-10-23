import Link from 'next/link';
import { AUTHOR_NAME, AUTHOR_SLUG } from '@/lib/data/pages';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function GuideByline({ lastUpdated }: { lastUpdated: string }) {
  return (
    <p className="mt-2 text-[14px] text-muted">
      By{' '}
      <Link href={AUTHOR_SLUG} prefetch={false} className="link-brand">
        {AUTHOR_NAME}
      </Link>{' '}
      · Last updated {formatDate(lastUpdated)} ·{' '}
      <Link href="/editorial-policy/" prefetch={false} className="link-brand">
        Editorial policy
      </Link>
    </p>
  );
}
