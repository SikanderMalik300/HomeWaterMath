import InlineText from './InlineText';
import ReferenceTable from './ReferenceTable';
import type { GuideBlock } from '@/lib/content/guides';

export default function GuideBody({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <h2 key={i} className="mt-8 text-[28px] font-medium">
                {b.text}
              </h2>
            );
          case 'p':
            return (
              <p key={i} className="text-[16px]">
                <InlineText text={b.text} />
              </p>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 text-[16px]">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <InlineText text={it} />
                  </li>
                ))}
              </ol>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc space-y-2 pl-6 text-[16px]">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <InlineText text={it} />
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return <ReferenceTable key={i} table={b.table} />;
        }
      })}
    </div>
  );
}
