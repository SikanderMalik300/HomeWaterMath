// Photo registry. Files are processed by scripts/process-photos.mjs into
// public/photos/ as <baseName>-<width>.{avif,webp,jpg}. Credits are copied
// exactly from homewatermath-photos.md. All six slots approved 2026-10-20.

export type PhotoSource = 'Unsplash' | 'Pexels' | 'Owner';

export interface Photo {
  id: string;
  baseName: string; // file stem in public/photos (no size/extension)
  kind: 'hero' | 'tile'; // controls which widths were generated
  sourceUrl: string; // the photo's own page
  downloadUrl: string; // direct image used by the processing script
  photographer: string;
  photographerUrl: string;
  source: PhotoSource;
  license: string;
  alt: string;
  focalX: number; // 0..1
  focalY: number; // 0..1
  usedOn: string[]; // slugs
  status: 'approved' | 'pending';
}

export const PHOTOS: Record<string, Photo> = {
  'hero-home': {
    id: 'hero-home',
    baseName: 'glass-filled-with-tap-water',
    kind: 'hero',
    sourceUrl: 'https://unsplash.com/photos/a-hand-holding-a-glass-of-water-MUOhSYEqbHo',
    downloadUrl: 'https://images.unsplash.com/photo-1669139470813-827cbcf54b20?fm=jpg&q=90&w=2560',
    photographer: 'Swanky Fella',
    photographerUrl: 'https://unsplash.com/@swankyfella',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'A glass being filled with tap water at a kitchen sink',
    focalX: 0.55,
    focalY: 0.5,
    usedOn: ['/'],
    status: 'approved',
  },
  'tool-softener-size': {
    id: 'tool-softener-size',
    baseName: 'water-treatment-resin-tanks',
    kind: 'tile',
    sourceUrl: 'https://www.pexels.com/photo/purifiers-at-a-water-treatment-plant-12726229/',
    downloadUrl: 'https://images.pexels.com/photos/12726229/pexels-photo-12726229.jpeg',
    photographer: 'Alexey Demidov',
    photographerUrl: 'https://www.pexels.com/@alexeydemidov/',
    source: 'Pexels',
    license: 'Pexels License',
    alt: 'Row of resin treatment tanks with control valves and blue piping',
    focalX: 0.5,
    focalY: 0.45,
    usedOn: ['/water-softener-size-calculator/', '/', '/water-softeners/', '/well-water/'],
    status: 'approved',
  },
  'tool-cost': {
    id: 'tool-cost',
    baseName: 'plumber-fitting-pipe-connection',
    kind: 'tile',
    sourceUrl: 'https://www.pexels.com/photo/professional-plumber-installing-a-radiator-pipe-29226620/',
    downloadUrl: 'https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg',
    photographer: 'Sergei Starostin',
    photographerUrl: 'https://www.pexels.com/@sejio402/',
    source: 'Pexels',
    license: 'Pexels License',
    alt: 'Gloved hands fitting a threaded pipe connection during an installation',
    focalX: 0.45,
    focalY: 0.6,
    usedOn: ['/water-softener-cost/', '/', '/water-softeners/'],
    status: 'approved',
  },
  'tool-salt': {
    id: 'tool-salt',
    baseName: 'coarse-white-salt-crystals',
    kind: 'tile',
    sourceUrl: 'https://unsplash.com/photos/white-snow-on-brown-sand-sSLI7KXPwzU',
    downloadUrl: 'https://images.unsplash.com/photo-1604697976327-4f28ff459803?fm=jpg&q=90&w=2560',
    photographer: 'Charles Deluvio',
    photographerUrl: 'https://unsplash.com/@charlesdeluvio',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Close-up of coarse white salt crystals',
    focalX: 0.5,
    focalY: 0.45,
    usedOn: ['/water-softener-salt-calculator/', '/', '/water-softeners/'],
    status: 'approved',
  },
  'tool-hardness': {
    id: 'tool-hardness',
    baseName: 'water-sample-in-beaker',
    kind: 'tile',
    sourceUrl: 'https://unsplash.com/photos/three-clear-beakers-placed-on-tabletop-lQGJCMY5qcM',
    downloadUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?fm=jpg&q=90&w=2560',
    photographer: 'Hans Reniers',
    photographerUrl: 'https://unsplash.com/@hansreniers',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Water sample in a glass beaker with a pipette',
    focalX: 0.45,
    focalY: 0.6,
    usedOn: ['/water-hardness-converter/', '/', '/water-softeners/', '/well-water/'],
    status: 'approved',
  },
  'tool-pressure-tank': {
    id: 'tool-pressure-tank',
    baseName: 'water-pressure-gauge-psi',
    kind: 'tile',
    sourceUrl: 'https://unsplash.com/photos/a-close-up-of-a-pressure-gauge-on-a-machine-iQprhuG2ALk',
    downloadUrl: 'https://images.unsplash.com/photo-1674471361523-195aa08e69b5?fm=jpg&q=90&w=2560',
    photographer: 'Anton Savinov',
    photographerUrl: 'https://unsplash.com/@tonchik',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Water pressure gauge in psi on a plumbing manifold',
    focalX: 0.55,
    focalY: 0.5,
    usedOn: ['/well-pressure-tank-size-calculator/', '/well-water/'],
    status: 'approved',
  },
  // --- Batch 02 photos (2 approved by browser agent, 3 chosen by coding agent).
  'tool-well-pump': {
    id: 'tool-well-pump',
    baseName: 'rural-home-green-lawn',
    kind: 'tile',
    sourceUrl: 'https://www.pexels.com/photo/house-surrounded-by-green-grass-below-clouds-and-sky-226407/',
    downloadUrl: 'https://images.pexels.com/photos/226407/pexels-photo-226407.jpeg',
    photographer: 'Dianne',
    photographerUrl: 'https://www.pexels.com/@dianne-60973/',
    source: 'Pexels',
    license: 'Pexels License',
    alt: 'A country home with a large green lawn in daylight',
    focalX: 0.4,
    focalY: 0.45,
    usedOn: ['/well-pump-replacement-cost/'],
    status: 'approved',
  },
  'tool-ro': {
    id: 'tool-ro',
    baseName: 'chrome-kitchen-faucet-double-sink',
    kind: 'tile',
    sourceUrl: 'https://unsplash.com/photos/stainless-steel-faucet-turned-off-IcNpBCQS3fk',
    downloadUrl: 'https://images.unsplash.com/photo-1629078692818-c5a0443f4ae3?fm=jpg&q=90&w=2560',
    photographer: 'Steven Ungermann',
    photographerUrl: 'https://unsplash.com/@steveungermann',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Chrome kitchen faucet over a stainless steel double sink',
    focalX: 0.35,
    focalY: 0.5,
    usedOn: ['/reverse-osmosis-system-cost/'],
    status: 'approved',
  },
  'tool-whole-house-filter': {
    id: 'tool-whole-house-filter',
    baseName: 'rain-shower-head-water',
    kind: 'tile',
    sourceUrl: 'https://unsplash.com/photos/a-shower-head-with-a-lot-of-water-coming-out-of-it-kvNXrgbmCGM',
    downloadUrl: 'https://images.unsplash.com/photo-1698724624855-e9dbc5a0bddb?fm=jpg&q=90&w=2560',
    photographer: 'natalia menin',
    photographerUrl: 'https://unsplash.com/@nmenin',
    source: 'Unsplash',
    license: 'Unsplash License',
    alt: 'Water falling from a round rain shower head',
    focalX: 0.5,
    focalY: 0.4,
    usedOn: ['/whole-house-water-filter-cost/'],
    status: 'approved',
  },
  'tool-salt-free': {
    id: 'tool-salt-free',
    baseName: 'chrome-faucet-water-droplet-scale',
    kind: 'tile',
    sourceUrl: 'https://www.pexels.com/photo/close-up-photo-of-water-drop-2583028/',
    downloadUrl: 'https://images.pexels.com/photos/2583028/pexels-photo-2583028.jpeg',
    photographer: 'Nithin PA',
    photographerUrl: 'https://www.pexels.com/@nithin-pa-789164/',
    source: 'Pexels',
    license: 'Pexels License',
    alt: 'Water droplet forming on a chrome faucet aerator with light mineral scale',
    focalX: 0.45,
    focalY: 0.55,
    usedOn: ['/water-softener-vs-salt-free-cost/'],
    status: 'approved',
  },
  'tool-softener-install': {
    id: 'tool-softener-install',
    baseName: 'plumber-hands-pipe-fitting',
    kind: 'tile',
    sourceUrl: 'https://www.pexels.com/photo/plumber-installs-pipe-fittings-6419128/',
    downloadUrl: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg',
    photographer: 'Anıl Karakaya',
    photographerUrl: 'https://www.pexels.com/@anilkarakaya/',
    source: 'Pexels',
    license: 'Pexels License',
    alt: 'Hands tightening a brass fitting on a water pipe',
    focalX: 0.5,
    focalY: 0.45,
    usedOn: ['/water-softener-installation-cost/'],
    status: 'approved',
  },
};

export function getPhoto(id: string | null): Photo | null {
  if (!id) return null;
  return PHOTOS[id] ?? null;
}

export function getPhotoForSlug(slug: string): Photo | null {
  return Object.values(PHOTOS).find((p) => p.usedOn.includes(slug)) ?? null;
}

export const HERO_CREDIT = 'Photo: Swanky Fella / Unsplash';
