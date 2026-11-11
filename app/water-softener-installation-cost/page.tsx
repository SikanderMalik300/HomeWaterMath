import type { Metadata } from 'next';
import ToolPage from '@/components/ToolPage';
import CalculatorSoftenerInstall from '@/components/calc/CalculatorSoftenerInstall';
import ReferenceTable from '@/components/ReferenceTable';
import GuideBody from '@/components/GuideBody';
import { SOFTENER_INSTALL, SOFTENER_INSTALL_TABLE, SOFTENER_INSTALL_BODY } from '@/lib/content/tools2';
import { buildMetadata } from '@/lib/seo';

const SLUG = '/water-softener-installation-cost/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <ToolPage
      slug={SLUG}
      copy={SOFTENER_INSTALL}
      calculator={<CalculatorSoftenerInstall />}
      referenceTables={<ReferenceTable table={SOFTENER_INSTALL_TABLE} />}
      body={<GuideBody blocks={SOFTENER_INSTALL_BODY} />}
    />
  );
}
