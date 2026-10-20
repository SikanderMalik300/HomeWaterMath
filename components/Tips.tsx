import InlineText from './InlineText';

export default function Tips({ tips, note }: { tips: string[]; note?: string }) {
  return (
    <section aria-labelledby="tips-heading">
      <h2 id="tips-heading" className="mb-3 text-[28px] font-medium">
        Tips
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-[16px]">
        {tips.map((tip, i) => (
          <li key={i}>
            <InlineText text={tip} />
          </li>
        ))}
      </ul>
      {note && <p className="mt-3 text-[14px] text-muted">{note}</p>}
    </section>
  );
}
