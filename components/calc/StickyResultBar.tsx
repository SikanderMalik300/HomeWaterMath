'use client';

import { useEffect, useRef, useState } from 'react';

// Mobile-only slim bar that appears after the result card scrolls out of view.
// Position fixed so it reserves no layout space (CLS 0).
export default function StickyResultBar({
  headline,
  watchRef,
}: {
  headline: string;
  watchRef: React.RefObject<HTMLElement | null>;
}) {
  const [show, setShow] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = watchRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, [watchRef]);

  return (
    <div
      ref={barRef}
      // Use visibility (not aria-hidden) when off-screen so the "Back to
      // calculator" link is removed from both the a11y tree and the focus
      // order, avoiding an aria-hidden-focus conflict.
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface transition-transform duration-200 md:hidden ${
        show ? 'translate-y-0' : 'invisible translate-y-full'
      }`}
    >
      <div className="container-hw flex h-14 items-center justify-between">
        <span className="truncate text-[15px] font-semibold text-ink tnum">{headline}</span>
        <a
          href="#calculator"
          tabIndex={show ? undefined : -1}
          className="shrink-0 text-[14px] font-medium text-brand hover:underline"
        >
          Back to calculator
        </a>
      </div>
    </div>
  );
}
