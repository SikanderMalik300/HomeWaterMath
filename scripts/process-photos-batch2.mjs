// Downloads and processes the batch-02 photos (same pipeline as process-photos.mjs).
// tool-well-pump is intentionally omitted: no free-stock photo met the rules
// (all results were vintage hand pumps, farm irrigation or community boreholes),
// so that slot keeps the mist square.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'photos');
const CACHE = path.join(__dirname, '.photo-cache');

const PHOTOS = [
  { base: 'chrome-kitchen-faucet-double-sink', url: 'https://images.unsplash.com/photo-1629078692818-c5a0443f4ae3?fm=jpg&q=90&w=2560', focalX: 0.35, focalY: 0.5 },
  { base: 'rain-shower-head-water', url: 'https://images.unsplash.com/photo-1698724624855-e9dbc5a0bddb?fm=jpg&q=90&w=2560', focalX: 0.5, focalY: 0.4 },
  { base: 'chrome-faucet-water-droplet-scale', url: 'https://images.pexels.com/photos/2583028/pexels-photo-2583028.jpeg', focalX: 0.45, focalY: 0.55 },
  { base: 'plumber-hands-pipe-fitting', url: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg', focalX: 0.5, focalY: 0.45 },
  { base: 'rural-home-green-lawn', url: 'https://images.pexels.com/photos/226407/pexels-photo-226407.jpeg', focalX: 0.4, focalY: 0.45 },
];

const AR = 1; // tiles only
const WIDTHS = [300, 600];
const AVIF_Q = 46;
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
  for (const photo of PHOTOS) {
    const srcPath = path.join(CACHE, `${photo.base}.src`);
    const buf = await download(photo.url, srcPath);
    const meta = await sharp(buf).metadata();
    const box = cropBox(meta.width, meta.height, AR, photo.focalX, photo.focalY);
    const sizes = [];
    for (const w of WIDTHS) {
      const h = Math.round(w / AR);
      const base = sharp(buf).extract(box).resize(w, h, { fit: 'cover' });
      const avif = await base.clone().avif({ quality: AVIF_Q, effort: AVIF_EFFORT }).toBuffer();
      const webp = await base.clone().webp({ quality: WEBP_Q }).toBuffer();
      const jpeg = await base.clone().jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();
      await fs.writeFile(path.join(OUT, `${photo.base}-${w}.avif`), avif);
      await fs.writeFile(path.join(OUT, `${photo.base}-${w}.webp`), webp);
      await fs.writeFile(path.join(OUT, `${photo.base}-${w}.jpg`), jpeg);
      if (w === 600) sizes.push(`600 avif ${(avif.length / 1024).toFixed(1)}KB`);
    }
    console.log(`processed ${photo.base} (${meta.width}x${meta.height}) ${sizes.join(', ')}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
