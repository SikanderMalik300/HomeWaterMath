import Breadcrumbs from './Breadcrumbs';
import AuthorBox from './AuthorBox';
import JsonLd from './JsonLd';
import { graph, webPageLd, breadcrumbLd } from '@/lib/seo';
import { getPage } from '@/lib/data/pages';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function TrustLayout({
  slug,
  children,
  jsonLd,
  showAuthorBox = false,
}: {
  slug: string;
  children: React.ReactNode;
  jsonLd?: object;
  showAuthorBox?: boolean;
}) {
  const page = getPage(slug);
  if (!page) return null;
  return (
    <article className="container-hw py-6 md:py-10">
      <JsonLd data={jsonLd ?? graph(webPageLd(page), breadcrumbLd(slug))} />
      <div className="mx-auto max-w-prose68">
        <Breadcrumbs slug={slug} />
        <h1 className="mt-3 text-[30px] font-medium leading-tight md:text-[40px]">{page.h1}</h1>
        <div className="prose-hw mt-2">{children}</div>
        <p className="mt-8 text-[14px] text-muted">Last updated: {formatDate(page.lastUpdated)}</p>
        {showAuthorBox && (
          <div className="mt-8">
            <AuthorBox lastUpdated={page.lastUpdated} />
          </div>
        )}
      </div>
    </article>
  );
}
