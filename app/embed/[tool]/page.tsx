import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CalculatorSize from '@/components/calc/CalculatorSize';
import CalculatorHardness from '@/components/calc/CalculatorHardness';
import CalculatorSalt from '@/components/calc/CalculatorSalt';
import CalculatorPressureTank from '@/components/calc/CalculatorPressureTank';
import EmbedAutoHeight from '@/components/EmbedAutoHeight';
import { EMBED_TOOLS, embedToolByParam, toolUrl } from '@/lib/embed';

export const dynamicParams = false;

export function generateStaticParams() {
  return EMBED_TOOLS.map((t) => ({ tool: t.param }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool: param } = await params;
  const tool = embedToolByParam(param);
  if (!tool) return {};
  return {
    title: tool.title,
    robots: { index: false, follow: true },
    alternates: { canonical: toolUrl(tool) },
  };
}

function calculatorFor(param: string) {
  switch (param) {
    case 'water-softener-size-calculator':
      return <CalculatorSize embed />;
    case 'water-hardness-converter':
      return <CalculatorHardness embed />;
    case 'water-softener-salt-calculator':
      return <CalculatorSalt embed />;
    case 'well-pressure-tank-size-calculator':
      return <CalculatorPressureTank embed />;
    default:
      return null;
  }
}

export default async function EmbedPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: param } = await params;
  const tool = embedToolByParam(param);
  if (!tool) notFound();
  const calc = calculatorFor(param);

  return (
    <div className="min-w-[300px] bg-white p-4">
      <EmbedAutoHeight tool={tool.param} />
      <h1 className="mb-3 text-[18px] font-semibold text-ink">{tool.title}</h1>
      {calc}
      <p className="mt-4 text-[13px] text-muted">
        <a href={toolUrl(tool)} target="_blank" rel="noopener" className="link-brand">
          Open the full calculator, with sources, on HomeWaterMath
        </a>
      </p>
    </div>
  );
}
