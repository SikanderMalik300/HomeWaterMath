import Breadcrumbs from './Breadcrumbs';
import QuickAnswer from './QuickAnswer';
import HowToUse from './HowToUse';
import FormulaBlock from './FormulaBlock';
import NotCovered from './NotCovered';
import Tips from './Tips';
import Faq from './Faq';
import RelatedTools from './RelatedTools';
import SourcesBlock from './SourcesBlock';
import AuthorBox from './AuthorBox';
import PhotoFigure from './PhotoFigure';
import AdSlot from './AdSlot';
import AffiliateBox from './AffiliateBox';
import EmailSignup from './EmailSignup';
import AddToSiteBox from './AddToSiteBox';
import JsonLd from './JsonLd';
import { pageJsonLd } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';
import type { ToolCopy } from '@/lib/content/types';

export default function ToolPage({
  slug,
  copy,
  calculator,
  referenceTables,
  showEmailSignup = false,
}: {
  slug: string;
  copy: ToolCopy;
  calculator: React.ReactNode;
  referenceTables?: React.ReactNode;
  showEmailSignup?: boolean;
}) {
  const page = getPage(slug);
  if (!page) return null;

  return (
    <article className="container-hw py-6 md:py-10">
      <JsonLd data={pageJsonLd(slug, { faq: copy.faq })} />

      <div className="mx-auto max-w-content">
        <Breadcrumbs slug={slug} />
        <h1 className="mt-3 text-[30px] font-medium leading-tight md:text-[40px]">{page.h1}</h1>

        <div className="mt-5">
          <QuickAnswer text={copy.quickAnswer} />
        </div>

        <div className="mt-6">{calculator}</div>

        <div className="mt-6">
          <AffiliateBox slug={slug} />
        </div>

        <div className="mt-10 space-y-10">
          <HowToUse steps={copy.howToUse} />
          <FormulaBlock copy={copy} />
          <AdSlot id={`${slug}-after-formula`} />
          <NotCovered items={copy.notCovered} />
          {referenceTables && (
            <section aria-label="Reference tables">{referenceTables}</section>
          )}
          {page.ownerNote && (
            <section aria-labelledby="owner-note-heading">
              <h2 id="owner-note-heading" className="mb-3 text-[28px] font-medium">
                From Sikander
              </h2>
              <p className="text-[16px]">{page.ownerNote}</p>
            </section>
          )}
          <Tips tips={copy.tips} note={copy.tipsNote} />
          {showEmailSignup && <EmailSignup />}
          <Faq items={copy.faq} />
          <AdSlot id={`${slug}-after-faq`} />
          <RelatedTools slugs={page.related} />
          <AddToSiteBox slug={slug} />
          <PhotoFigure photoId={page.photoId} />
          <SourcesBlock sources={page.sources} />
          <AuthorBox lastUpdated={page.lastUpdated} />
          <p className="text-[14px] text-muted">
            Estimates only. Check your equipment&apos;s spec sheet and local plumbing code before you buy or install.
          </p>
        </div>
      </div>
    </article>
  );
}
