import { getSource } from '@/lib/data/sources';
import type { SourceId } from '@/lib/data/sources';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function SourcesBlock({ sources }: { sources: SourceId[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="mb-4 text-[28px] font-medium">
        Sources
      </h2>
      <ul className="space-y-2 text-[15px]">
        {sources.map((id) => {
          const s = getSource(id);
          return (
            <li key={id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-brand"
              >
                {s.name}
              </a>
              <span className="text-muted"> (accessed {formatDate(s.accessed)})</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
