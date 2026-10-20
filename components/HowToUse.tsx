import InlineText from './InlineText';

export default function HowToUse({ steps }: { steps: string[] }) {
  return (
    <section aria-labelledby="howto-heading">
      <h2 id="howto-heading" className="mb-3 text-[28px] font-medium">
        How to use this calculator
      </h2>
      <ol className="list-decimal space-y-2 pl-6 text-[16px]">
        {steps.map((step, i) => (
          <li key={i}>
            <InlineText text={step} />
          </li>
        ))}
      </ol>
    </section>
  );
}
