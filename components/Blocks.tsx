import InlineText from './InlineText';
import type { Block } from '@/lib/content/trust';

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'h2' ? (
          <h2 key={i} className="mt-8 text-[24px] font-medium md:text-[28px]">
            {b.text}
          </h2>
        ) : (
          <p key={i} className="mt-4 text-[16px]">
            <InlineText text={b.text} />
          </p>
        ),
      )}
    </>
  );
}
