import type { Metadata } from 'next';
import Script from 'next/script';
import Breadcrumbs from '@/components/Breadcrumbs';
import AddToSiteBox from '@/components/AddToSiteBox';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, pageJsonLd } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';
import { EMBED_TOOLS, embedUrl } from '@/lib/embed';

const SLUG = '/calculators-for-your-site/';
export const metadata: Metadata = buildMetadata(SLUG);

export default function Page() {
  return (
    <article className="container-hw py-6 md:py-10">
      <JsonLd data={pageJsonLd(SLUG)} />
      <Script src="/embed.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-content">
        <Breadcrumbs slug={SLUG} />
        <h1 className="mt-3 text-[30px] font-medium leading-tight md:text-[40px]">
          Free water calculators for your website
        </h1>
        <p className="mt-4 max-w-prose68 text-[16px]">
          Our calculators are free to embed on any website: county and extension pages, utility sites, blogs and community groups. Every number is sourced, the math is shown, and nothing inside the frame tracks your visitors.
        </p>

        <div className="mt-8 space-y-10">
          {EMBED_TOOLS.map((tool) => {
            const page = getPage(tool.slug);
            return (
              <section key={tool.slug} aria-label={tool.title}>
                <h2 className="mb-2 text-[24px] font-medium md:text-[28px]">{tool.title}</h2>
                {page?.cardBlurb && <p className="mb-4 text-[16px] text-muted">{page.cardBlurb}</p>}
                <iframe
                  src={embedUrl(tool)}
                  title={tool.title}
                  width="100%"
                  height={tool.height}
                  loading="lazy"
                  style={{ border: 0, maxWidth: 680 }}
                />
                <div className="mt-4">
                  <AddToSiteBox slug={tool.slug} />
                </div>
              </section>
            );
          })}

          <section aria-labelledby="terms-heading">
            <h2 id="terms-heading" className="mb-2 text-[24px] font-medium md:text-[28px]">
              Terms
            </h2>
            <p className="max-w-prose68 text-[16px]">
              Free for any non-misleading use. Keep the credit line visible. Don&apos;t change the results or present them as your own. We may update formulas when sources change; embeds update automatically.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
