// Responsive <picture>: AVIF -> WebP -> JPEG. Plain <img>, explicit dimensions
// to keep CLS at 0. Files come from scripts/process-photos.mjs.

interface PictureProps {
  baseName: string;
  alt: string;
  kind: 'tile' | 'hero';
  focalX?: number;
  focalY?: number;
  priority?: boolean; // hero on desktop: eager + high fetch priority
  className?: string;
  imgClassName?: string;
}

const CONFIG = {
  tile: {
    widths: [300, 600],
    sizes: '(min-width: 768px) 280px, 45vw',
    w: 600,
    h: 600,
    fallback: 600,
  },
  hero: {
    widths: [640, 1280],
    sizes: '(min-width: 768px) 45vw, 100vw',
    w: 1280,
    h: 720,
    fallback: 1280,
  },
};

export default function Picture({
  baseName,
  alt,
  kind,
  focalX = 0.5,
  focalY = 0.5,
  priority = false,
  className,
  imgClassName,
}: PictureProps) {
  const c = CONFIG[kind];
  const srcSet = (ext: string) =>
    c.widths.map((w) => `/photos/${baseName}-${w}.${ext} ${w}w`).join(', ');
  const objectPosition = `${Math.round(focalX * 100)}% ${Math.round(focalY * 100)}%`;

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={c.sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={c.sizes} />
      <img
        src={`/photos/${baseName}-${c.fallback}.jpg`}
        srcSet={srcSet('jpg')}
        sizes={c.sizes}
        alt={alt}
        width={c.w}
        height={c.h}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        className={imgClassName}
        style={{ objectFit: 'cover', objectPosition }}
      />
    </picture>
  );
}
