// Downloads the six approved photos and processes them per the photos file:
//  - focal-point cover crop to each target aspect ratio
//  - tiles 300 + 600 px (1:1), hero 640 + 1280 px (16:9)
//  - AVIF (q ~60), WebP (q ~75), JPEG; EXIF stripped (sharp drops metadata by default)
//  - lowercase hyphenated descriptive file names
// Outputs an image weight report to scripts/image-weight-report.json.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'photos');
const CACHE = path.join(__dirname, '.photo-cache');

const PHOTOS = [
  { base: 'glass-filled-with-tap-water', kind: 'hero', url: 'https://images.unsplash.com/photo-1669139470813-827cbcf54b20?fm=jpg&q=90&w=2560', focalX: 0.55, focalY: 0.5 },
  { base: 'water-treatment-resin-tanks', kind: 'tile', url: 'https://images.pexels.com/photos/12726229/pexels-photo-12726229.jpeg', focalX: 0.5, focalY: 0.45 },
  { base: 'plumber-fitting-pipe-connection', kind: 'tile', url: 'https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg', focalX: 0.45, focalY: 0.6 },
  { base: 'coarse-white-salt-crystals', kind: 'tile', url: 'https://images.unsplash.com/photo-1604697976327-4f28ff459803?fm=jpg&q=90&w=2560', focalX: 0.5, focalY: 0.45 },
  { base: 'water-sample-in-beaker', kind: 'tile', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?fm=jpg&q=90&w=2560', focalX: 0.45, focalY: 0.6 },
  { base: 'water-pressure-gauge-psi', kind: 'tile', url: 'https://images.unsplash.com/photo-1674471361523-195aa08e69b5?fm=jpg&q=90&w=2560', focalX: 0.55, focalY: 0.5 },
];

const SIZES = {
  tile: { ar: 1, widths: [300, 600] },
  hero: { ar: 16 / 9, widths: [640, 1280] },
};

// AVIF quality ~60 per the photos file, but tiles must stay <= 35 KB at 600 px.
// Higher effort plus a slightly lower AVIF quality keeps noisy tiles (salt,
// gauge) under budget; hero has plenty of headroom.
const AVIF_Q = 54;
const WEBP_Q = 75;
const JPEG_Q = 80;
const AVIF_EFFORT = 6;

async function ensureDir(d) {
  await fs.mkdir(d, { recursive: true });
}

async function download(url, dest) {
  try {
    const stat = await fs.stat(dest);
    if (stat.size > 0) return await fs.readFile(dest);
  } catch {
    /* not cached */
  }
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 HomeWaterMath/1.0' } });
  if (!res.ok) throw new Error(`download ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf;
}

function cropBox(sw, sh, ar, fx, fy) {
  const sourceAR = sw / sh;
  let cw, ch;
  if (sourceAR > ar) {
    ch = sh;
    cw = Math.round(sh * ar);
  } else {
    cw = sw;
    ch = Math.round(sw / ar);
  }
  let left = Math.round(fx * sw - cw / 2);
  let top = Math.round(fy * sh - ch / 2);
  left = Math.max(0, Math.min(left, sw - cw));
  top = Math.max(0, Math.min(top, sh - ch));
  return { left, top, width: cw, height: ch };
}

async function main() {
  await ensureDir(OUT);
  await ensureDir(CACHE);
  const report = [];

  for (const photo of PHOTOS) {
    const srcPath = path.join(CACHE, `${photo.base}.src`);
    const buf = await download(photo.url, srcPath);
    const meta = await sharp(buf).metadata();
    const { ar, widths } = SIZES[photo.kind];
    const box = cropBox(meta.width, meta.height, ar, photo.focalX, photo.focalY);

    for (const w of widths) {
      const h = Math.round(w / ar);
      const base = sharp(buf).extract(box).resize(w, h, { fit: 'cover' });

      const avif = await base.clone().avif({ quality: AVIF_Q, effort: AVIF_EFFORT }).toBuffer();
      const webp = await base.clone().webp({ quality: WEBP_Q }).toBuffer();
      const jpeg = await base.clone().jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();

      const files = [
        [`${photo.base}-${w}.avif`, avif],
        [`${photo.base}-${w}.webp`, webp],
        [`${photo.base}-${w}.jpg`, jpeg],
      ];
      for (const [name, data] of files) {
        await fs.writeFile(path.join(OUT, name), data);
        report.push({ file: name, bytes: data.length, kb: +(data.length / 1024).toFixed(1) });
      }
    }
    console.log(`processed ${photo.base} (${meta.width}x${meta.height} -> ${photo.kind})`);
  }

  report.sort((a, b) => a.file.localeCompare(b.file));
  await fs.writeFile(path.join(__dirname, 'image-weight-report.json'), JSON.stringify(report, null, 2));

  // Quick budget check summary.
  const avif600 = report.filter((r) => /-600\.avif$/.test(r.file));
  const heroAvif = report.filter((r) => /glass-filled-with-tap-water-1280\.avif$/.test(r.file));
  console.log('tile 600 AVIF KB:', avif600.map((r) => `${r.file}=${r.kb}`).join(', '));
  console.log('hero 1280 AVIF KB:', heroAvif.map((r) => `${r.file}=${r.kb}`).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
