import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPhotoForSlug } from '@/lib/data/photos';
import { getPage } from '@/lib/data/pages';
import Picture from './Picture';

// One shared tile: whole tile is a single link. Photo 1:1 with focal-point crop,
// name + arrow, one muted blurb line. Until a photo is approved, a mist square
// stands in (never a stock or AI placeholder).
export default function PhotoTile({ slug }: { slug: string }) {
  const page = getPage(slug);
  if (!page) return null;
  const photo = getPhotoForSlug(slug);
  const name = page.h1;
  const blurb = page.cardBlurb ?? '';

  return (
    <Link
      href={slug}
      prefetch={false}
      className="group block rounded-photo focus-visible:outline-none"
    >
      <div className="overflow-hidden rounded-photo border border-line bg-band-1">
        <div className="aspect-square w-full">
          {photo && photo.status === 'approved' ? (
            <Picture
              baseName={photo.baseName}
              alt={photo.alt}
              kind="tile"
              focalX={photo.focalX}
              focalY={photo.focalY}
              imgClassName="h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-band-1 p-4 text-center text-[15px] font-medium text-brand">
              {name}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-[16px] font-medium text-ink group-hover:underline">{name}</span>
        <ArrowRight className="h-4 w-4 text-brand" strokeWidth={1.5} aria-hidden="true" />
      </div>
      {blurb && <p className="mt-0.5 text-[14px] text-muted">{blurb}</p>}
    </Link>
  );
}
