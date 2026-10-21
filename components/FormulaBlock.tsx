import type { ToolCopy } from '@/lib/content/types';

function paragraphs(text?: string): string[] {
  if (!text) return [];
  return text.split('\n\n').map((p) => p.trim()).filter(Boolean);
}

// "The formula" section: intro prose, optional formula boxes, trailing prose,
// then the worked examples and an optional note. Intro and trailing text may
// each hold several paragraphs separated by a blank line.
export default function FormulaBlock({ copy }: { copy: ToolCopy }) {
  return (
    <section aria-labelledby="formula-heading">
      <h2 id="formula-heading" className="mb-3 text-[28px] font-medium">
        The formula
      </h2>
      {paragraphs(copy.formulaIntro).map((p, i) => (
        <p key={i} className="mb-4 text-[16px]">
          {p}
        </p>
      ))}
      {copy.formulaEquations.length > 0 && (
        <div className="my-4 space-y-2">
          {copy.formulaEquations.map((eq, i) => (
            <p key={i} className="rounded-card bg-band-4 px-4 py-2 text-[15px] tnum">
              {eq}
            </p>
          ))}
        </div>
      )}
      {paragraphs(copy.formulaAfter).map((p, i) => (
        <p key={i} className="mb-4 text-[16px]">
          {p}
        </p>
      ))}
      <div className="space-y-4">
        {copy.examples.map((ex, i) => (
          <p key={i} className="text-[16px]">
            <em className="text-ink">{ex.lead}</em> {ex.body}
          </p>
        ))}
      </div>
      {copy.exampleNote && <p className="mt-3 text-[14px] text-muted">{copy.exampleNote}</p>}
    </section>
  );
}
