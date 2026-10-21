import InlineText from './InlineText';

export default function NotCovered({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="notcovered-heading">
      <h2 id="notcovered-heading" className="mb-3 text-[28px] font-medium">
        What this calculator doesn&apos;t cover
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-[16px]">
        {items.map((item, i) => (
          <li key={i}>
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
