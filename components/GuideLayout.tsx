import Breadcrumbs from './Breadcrumbs';
import GuideByline from './GuideByline';
import QuickAnswer from './QuickAnswer';
import GuideBody from './GuideBody';
import Faq from './Faq';
import RelatedTools from './RelatedTools';
import SourcesBlock from './SourcesBlock';
import AuthorBox from './AuthorBox';
import PhotoFigure from './PhotoFigure';
import JsonLd from './JsonLd';
import { graph, articleLd, breadcrumbLd, faqLd } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';
import type { GuideCopy } from '@/lib/content/guides';

export default function GuideLayout({
  slug,
  copy,
  widget,
}: {
  slug: string;
  copy: GuideCopy;
  widget: React.ReactNode;
}) {
  const page = getPage(slug);
  if (!page) return null;

  return (
    <article className="container-hw py-6 md:py-10">
      <JsonLd data={graph(articleLd(page), breadcrumbLd(slug), faqLd(copy.faq))} />

      <div className="mx-auto max-w-content">
        <Breadcrumbs slug={slug} />
        <h1 className="mt-3 text-[30px] font-medium leading-tight md:text-[40px]">{page.h1}</h1>
        <GuideByline lastUpdated={page.lastUpdated} />

        <div className="mt-5">
          <QuickAnswer text={copy.quickAnswer} />
        </div>

        <div className="mt-6">{widget}</div>

        <div className="mt-8">
          <GuideBody blocks={copy.body} />
        </div>

        <div className="mt-10 space-y-10">
          {page.ownerNote && (
            <section aria-labelledby="owner-note-heading">
              <h2 id="owner-note-heading" className="mb-3 text-[28px] font-medium">
                From Sikander
              </h2>
              <p className="text-[16px]">{page.ownerNote}</p>
            </section>
          )}
          <Faq items={copy.faq} />
          <RelatedTools slugs={page.related} />
          <PhotoFigure photoId={page.photoId} />
          <SourcesBlock sources={page.sources} />
          <AuthorBox lastUpdated={page.lastUpdated} />
          <p className="text-[14px] text-muted">
            General information only. Check your equipment&apos;s manual, and use a certified lab for health-related water tests.
          </p>
        </div>
      </div>
    </article>
  );
}
