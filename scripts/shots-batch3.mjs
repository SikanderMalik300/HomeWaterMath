// Screenshots for the batch-03 report: each guide at 390px (full page).

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const SHOTS = path.join(ROOT, 'docs', 'screenshots', 'batch3');
const PORT = 5057;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(req.url.split('?')[0]);
        let file = path.join(OUT, p);
        if (p.endsWith('/')) file = path.join(OUT, p, 'index.html');
        else if (!path.extname(file)) file = path.join(OUT, p + '.html');
        const data = await fs.readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
        res.end(data);
      } catch {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const GUIDES = [
  ['water-softener-not-working', 'softener-not-working'],
  ['iron-filter-for-well-water', 'iron-filter'],
  ['how-to-test-water-hardness', 'hardness-test'],
  ['well-water-test-kit', 'well-test'],
  ['how-long-do-water-softeners-last', 'softener-lifespan'],
];

async function main() {
  await fs.mkdir(SHOTS, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const base = `http://localhost:${PORT}`;
  const page = await browser.newPage();
  for (const [slug, name] of GUIDES) {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto(`${base}/${slug}/`, { waitUntil: 'load' });
    await delay(600);
    await page.screenshot({ path: path.join(SHOTS, `${name}-390.png`), fullPage: true });
    console.log(`shot ${name}-390.png`);
  }
  await browser.close();
  server.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
