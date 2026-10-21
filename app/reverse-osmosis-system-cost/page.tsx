import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorRO from '@/components/calc/CalculatorRO';
import ReferenceTable from '@/components/ReferenceTable';
import { RO_COPY, RO_TABLE_TYPE, RO_TABLE_FILTERS, RO_TABLE_DRAIN } from '@/lib/content/tools2';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/reverse-osmosis-system-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={RO_COPY}
      calculator={<CalculatorRO />}
      referenceTables={
        <>
          <ReferenceTable table={RO_TABLE_TYPE} />
          <ReferenceTable table={RO_TABLE_FILTERS} />
          <ReferenceTable table={RO_TABLE_DRAIN} />
        </>
      }
    />
  );
}
