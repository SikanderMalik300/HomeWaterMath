'use client';

import { ChevronRight } from 'lucide-react';

// Expandable "Show the math": the formula written out with the user's numbers.
export default function ShowTheMath({ lines }: { lines: string[] }) {
  return (
    <details className="mt-4 group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-[15px] font-medium text-brand marker:hidden [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="h-4 w-4 transition-transform group-open:rotate-90 motion-reduce:transition-none"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        Show the math
      </summary>
      <div className="mt-3 space-y-1.5 rounded-card bg-band-4 p-4 text-[14px] tnum">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </details>
  );
}
