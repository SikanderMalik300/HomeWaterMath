import PhotoTile from './PhotoTile';

export default function RelatedTools({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="mb-4 text-[28px] font-medium">
        Related calculators
      </h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {slugs.slice(0, 3).map((slug) => (
          <PhotoTile key={slug} slug={slug} />
        ))}
      </div>
    </section>
  );
}
