import type { Metadata } from 'next';
import TrustLayout from '@/components/TrustLayout';
import { HOW_WE_CALCULATE } from '@/lib/content/trust';
import { SIZE, COST, SALT, HARDNESS, PRESSURE } from '@/lib/content/tools';
import { CONSTANTS_TABLE } from '@/lib/data/constants';
import { getSource, type SourceId } from '@/lib/data/sources';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/how-we-calculate/';
export const metadata: Metadata = buildMetadata(SLUG);

const SECTIONS = [
  { h: 'Water softener size calculator', eqs: SIZE.formulaEquations },
  { h: 'Water softener cost calculator', eqs: COST.formulaEquations },
  { h: 'Water softener salt calculator', eqs: SALT.formulaEquations },
  { h: 'Water hardness converter', eqs: HARDNESS.formulaEquations },
  { h: 'Well pressure tank size calculator', eqs: PRESSURE.formulaEquations },
];

function Checked({ ids }: { ids: SourceId[] }) {
  return <>{getSource(ids[0]).accessed}</>;
}

export default function Page() {
  return (
    <TrustLayout slug={SLUG}>
      <p className="mt-4 text-[16px]">{HOW_WE_CALCULATE.intro}</p>

      {SECTIONS.map((s) => (
        <section key={s.h}>
          <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">{s.h}</h2>
          <div className="mt-3 space-y-2">
            {s.eqs.map((eq, i) => (
              <p key={i} className="rounded-card bg-band-4 px-4 py-2 text-[15px] tnum">
                {eq}
              </p>
            ))}
          </div>
        </section>
      ))}

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">Constants</h2>
      <div className="mt-3 overflow-x-auto rounded-card border border-line">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {['Constant', 'Value', 'Unit', 'Source', 'Checked'].map((h) => (
                <th key={h} scope="col" className="border-b border-line px-3 py-2.5 text-left text-[13px] font-medium text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONSTANTS_TABLE.map((c) => (
              <tr key={c.key}>
                <td className="border-b border-line px-3 py-2.5">{c.label}</td>
                <td className="border-b border-line px-3 py-2.5 tnum">{c.value}</td>
                <td className="border-b border-line px-3 py-2.5">{c.unit}</td>
                <td className="border-b border-line px-3 py-2.5">
                  {c.sources.map((id, i) => (
                    <span key={id}>
                      {i > 0 && ', '}
                      <a href={getSource(id as SourceId).url} target="_blank" rel="noopener noreferrer" className="link-brand">
                        {getSource(id as SourceId).name}
                      </a>
                    </span>
                  ))}
                </td>
                <td className="border-b border-line px-3 py-2.5 whitespace-nowrap">
                  <Checked ids={c.sources as SourceId[]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">{HOW_WE_CALCULATE.roundingHeading}</h2>
      <p className="mt-4 text-[16px]">{HOW_WE_CALCULATE.roundingBody}</p>

      <h2 className="mt-8 text-[24px] font-medium md:text-[28px]">{HOW_WE_CALCULATE.assumptionsHeading}</h2>
      <p className="mt-4 text-[16px]">{HOW_WE_CALCULATE.assumptionsBody}</p>
    </TrustLayout>
  );
}
