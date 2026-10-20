import { getPhoto } from '@/lib/data/photos';
import Picture from './Picture';

export default function PhotoFigure({ photoId }: { photoId: string | null }) {
  const photo = getPhoto(photoId);
  if (!photo || photo.status !== 'approved') return null;
  return (
    <figure className="max-w-[360px]">
      <div className="overflow-hidden rounded-photo border border-line">
        <div className="aspect-square w-full">
          <Picture
            baseName={photo.baseName}
            alt={photo.alt}
            kind={photo.kind}
            focalX={photo.focalX}
            focalY={photo.focalY}
            imgClassName="h-full w-full"
          />
        </div>
      </div>
      <figcaption className="mt-2 text-[13px] text-muted">
        Photo:{' '}
        <a href={photo.photographerUrl} target="_blank" rel="noopener noreferrer" className="link-brand">
          {photo.photographer}
        </a>{' '}
        / {photo.source}
      </figcaption>
    </figure>
  );
}
