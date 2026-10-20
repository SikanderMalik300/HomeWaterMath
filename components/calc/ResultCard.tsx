import { TriangleAlert } from 'lucide-react';

export interface ResultRow {
  label: string;
  value: string;
}

export default function ResultCard({
  headline,
  subline,
  rows,
  warnings = [],
  invalid = false,
  invalidMessage,
  children,
}: {
  headline: string;
  subline?: string;
  rows: ResultRow[];
  warnings?: string[];
  invalid?: boolean;
  invalidMessage?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-line pt-6">
      <div aria-live="polite">
        <div className={invalid ? 'opacity-40' : ''}>
          <p className="text-[28px] font-semibold leading-tight text-ink tnum md:text-[32px]">
            {headline}
          </p>
          {subline && <p className="mt-0.5 text-[16px] text-muted">{subline}</p>}
        </div>

        {invalid && invalidMessage && (
          <p className="mt-2 text-[14px] text-muted">{invalidMessage}</p>
        )}

        <dl className={`mt-4 divide-y divide-line border-y border-line ${invalid ? 'opacity-40' : ''}`}>
          {rows.map((row, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="text-[15px] text-muted">{row.label}</dt>
              <dd className="text-[15px] font-medium text-ink tnum text-right">{row.value}</dd>
            </div>
          ))}
        </dl>

        {warnings.map((w, i) => (
          <div
            key={i}
            className="mt-3 flex gap-2 rounded-card bg-warn-bg p-3 text-[14px] text-warn-ink"
          >
            <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <span>{w}</span>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}
