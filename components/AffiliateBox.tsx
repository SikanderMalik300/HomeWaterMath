import { AFFILIATES } from '@/lib/data/affiliates';

// Renders only when NEXT_PUBLIC_AFFILIATES_ON=1 and products exist for the slug.
export default function AffiliateBox({ slug }: { slug: string }) {
  if (process.env.NEXT_PUBLIC_AFFILIATES_ON !== '1') return null;
  const products = (AFFILIATES[slug] ?? []).slice(0, 3);
  if (products.length === 0) return null;
  return (
    <aside className="my-6 rounded-card border border-line bg-surface p-5">
      <h3 className="mb-2 text-[16px] font-medium">Systems in this size</h3>
      <ul className="space-y-2 text-[15px]">
        {products.map((p, i) => (
          <li key={i}>
            <a
              href={p.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="link-brand"
            >
              {p.name}
            </a>
            {p.note && <span className="text-muted"> {p.note}</span>}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">
        We may earn a commission if you buy through these links. It doesn&apos;t change the result.
      </p>
    </aside>
  );
}
