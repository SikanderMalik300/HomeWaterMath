import type { FaqItem } from '@/lib/content/types';
import { Plus, Minus } from 'lucide-react';
import InlineText from './InlineText';

// Accordion built on <details>/<summary> so every answer is in the HTML and
// works without JS. Plus/minus icon toggles with [open].
export default function Faq({ items, heading = 'FAQ' }: { items: FaqItem[]; heading?: string }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-[28px] font-medium md:text-[28px]">
        {heading}
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <details key={i} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-[17px] font-medium text-ink marker:hidden [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <Plus
                className="h-5 w-5 shrink-0 text-brand group-open:hidden"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <Minus
                className="hidden h-5 w-5 shrink-0 text-brand group-open:block"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </summary>
            <div className="pb-4 pr-8 text-[16px] text-ink">
              <InlineText text={item.a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
