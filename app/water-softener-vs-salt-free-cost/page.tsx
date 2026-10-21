import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorSaltVsSaltFree from '@/components/calc/CalculatorSaltVsSaltFree';
import ReferenceTable from '@/components/ReferenceTable';
import { SALT_FREE, SALT_FREE_TABLE_COMPARE, SALT_FREE_TABLE_MEDIA } from '@/lib/content/tools2';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-vs-salt-free-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SALT_FREE}
      calculator={<CalculatorSaltVsSaltFree />}
      referenceTables={
        <>
          <ReferenceTable table={SALT_FREE_TABLE_COMPARE} />
          <ReferenceTable table={SALT_FREE_TABLE_MEDIA} />
        </>
      }
    />
  );
}
