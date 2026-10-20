import type { ToolCopy } from '@/lib/content/types';

// "The formula" section: intro, formula equations, optional trailing paragraph,
// then two worked examples and an optional note.
export default function FormulaBlock({ copy }: { copy: ToolCopy }) {
  return (
    <section aria-labelledby="formula-heading">
      <h2 id="formula-heading" className="mb-3 text-[28px] font-medium">
        The formula
      </h2>
      <p className="mb-4 text-[16px]">{copy.formulaIntro}</p>
      <div className="my-4 space-y-2">
        {copy.formulaEquations.map((eq, i) => (
          <p key={i} className="rounded-card bg-band-4 px-4 py-2 text-[15px] tnum">
            {eq}
          </p>
        ))}
      </div>
      {copy.formulaAfter && <p className="mb-4 text-[16px]">{copy.formulaAfter}</p>}
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
