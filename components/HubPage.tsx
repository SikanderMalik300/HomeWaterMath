import Breadcrumbs from './Breadcrumbs';
import ReferenceTable from './ReferenceTable';
import PhotoTile from './PhotoTile';
import Faq from './Faq';
import AuthorBox from './AuthorBox';
import SourcesBlock from './SourcesBlock';
import JsonLd from './JsonLd';
import { graph, collectionPageLd, breadcrumbLd, faqLd } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';
import type { SimpleTable, FaqItem } from '@/lib/content/types';

export default function HubPage({
  slug,
  intro,
  whichTable,
  faq,
  tileSlugs,
}: {
  slug: string;
  intro: string[];
  whichTable: SimpleTable;
  faq: FaqItem[];
  tileSlugs: string[];
}) {
  const page = getPage(slug);
  if (!page) return null;
  return (
    <article className="container-hw py-6 md:py-10">
      <JsonLd data={graph(collectionPageLd(page), breadcrumbLd(slug), faqLd(faq))} />
      <Breadcrumbs slug={slug} />
      <h1 className="mt-3 text-[30px] font-medium leading-tight md:text-[40px]">{page.h1}</h1>

      <div className="prose-hw mt-5 space-y-4 text-[16px]">
        {intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <ReferenceTable table={whichTable} />

      <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
        {tileSlugs.map((s) => (
          <PhotoTile key={s} slug={s} />
        ))}
      </div>

      <div className="mt-12">
        <Faq items={faq} />
      </div>

      {page.sources.length > 0 && (
        <div className="mt-12">
          <SourcesBlock sources={page.sources} />
        </div>
      )}

      <div className="mt-10">
        <AuthorBox lastUpdated={page.lastUpdated} />
      </div>
    </article>
  );
}
