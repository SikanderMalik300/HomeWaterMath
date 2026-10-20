import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import Blocks from '@/components/Blocks';
import { EDITORIAL } from '@/lib/content/trust';
import { CORRECTIONS } from '@/lib/data/corrections';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/editorial-policy/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <Blocks blocks={EDITORIAL} />
      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">Corrections log</h2>
      {CORRECTIONS.length === 0 ? (
        <p className="mt-4 text-[16px] text-muted">No corrections yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-card border border-line">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr>
                <th scope="col" className="border-b border-line px-3 py-2.5 text-left text-[14px] font-medium text-muted">Date</th>
                <th scope="col" className="border-b border-line px-3 py-2.5 text-left text-[14px] font-medium text-muted">Page</th>
                <th scope="col" className="border-b border-line px-3 py-2.5 text-left text-[14px] font-medium text-muted">What changed</th>
              </tr>
            </thead>
            <tbody>
              {CORRECTIONS.map((c, i) => (
                <tr key={i}>
                  <td className="border-b border-line px-3 py-2.5">{c.date}</td>
                  <td className="border-b border-line px-3 py-2.5">{c.page}</td>
                  <td className="border-b border-line px-3 py-2.5">{c.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TrustLayout>
  );
}
