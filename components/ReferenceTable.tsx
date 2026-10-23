import type { SimpleTable } from '@/lib/content/types';

// Quiet table inside a horizontally scrollable wrapper. The label is a real
// <caption> inside the table (caption-side top), styled like the old heading.
// The source note stays as a <p> after the table. Numbers right-aligned.
export default function ReferenceTable({ table }: { table: SimpleTable }) {
  const numeric = new Set(table.numericCols ?? []);
  return (
    <figure className="my-6">
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full border-collapse text-[15px]">
          {table.caption && (
            <caption className="caption-top px-3 pb-2 pt-3 text-left text-[16px] font-medium text-ink">
              {table.caption}
            </caption>
          )}
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`border-b border-line px-3 py-2.5 text-[14px] font-medium text-muted ${
                    numeric.has(i) ? 'text-right tnum' : 'text-left'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    className={`border-b border-line px-3 py-2.5 ${
                      numeric.has(c) ? 'text-right tnum' : 'text-left'
                    } ${r === table.rows.length - 1 ? 'border-b-0' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.captionBelow && (
        <p className="mt-2 text-[14px] text-muted">{table.captionBelow}</p>
      )}
    </figure>
  );
}
