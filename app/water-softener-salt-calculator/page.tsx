import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorSalt from '@/components/calc/CalculatorSalt';
import ReferenceTable from '@/components/ReferenceTable';
import { SaltYearlyTable } from '@/components/tables';
import { SALT, SALT_TABLE_PER_REGEN } from '@/lib/content/tools';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-salt-calculator/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SALT}
      calculator={<CalculatorSalt />}
      showEmailSignup
      referenceTables={
        <>
          <SaltYearlyTable />
          <ReferenceTable table={SALT_TABLE_PER_REGEN} />
        </>
      }
    />
  );
}
