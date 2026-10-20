// Minimal static server for the `out/` export (trailing-slash directories ->
// index.html). For local Lighthouse checks only.
import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'out');
const PORT = Number(process.env.PORT || 5055);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let full = path.join(OUT, p);
  try {
    const stat = await fs.stat(full);
    if (stat.isDirectory()) full = path.join(full, 'index.html');
    return full;
  } catch {
    // try adding .html (clean urls) or 404 page
    try {
      await fs.stat(full + '.html');
      return full + '.html';
    } catch {
      return path.join(OUT, '404.html');
    }
  }
}

createServer(async (req, res) => {
  const full = await resolveFile(req.url || '/');
  try {
    const buf = await fs.readFile(full);
    const ext = path.extname(full);
    res.writeHead(full.endsWith('404.html') ? 404 : 200, {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
    });
    res.end(buf);
  } catch {
    res.writeHead(500);
    res.end('error');
  }
}).listen(PORT, () => console.log(`serving out/ on http://localhost:${PORT}`));
