// Measures each embed's default height at 680px wide and screenshots at 360/680.

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const SHOTS = path.join(ROOT, 'docs', 'screenshots', 'embed');
const PORT = 5058;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.txt': 'text/plain', '.woff2': 'font/woff2' };

function startServer() {
  return new Promise((resolve) => {
    const s = http.createServer(async (req, res) => {
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
        res.end('x');
      }
    });
    s.listen(PORT, () => resolve(s));
  });
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const TOOLS = ['water-softener-size-calculator', 'water-hardness-converter', 'water-softener-salt-calculator', 'well-pressure-tank-size-calculator'];

async function main() {
  await fs.mkdir(SHOTS, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const base = `http://localhost:${PORT}`;
  for (const t of TOOLS) {
    await page.setViewport({ width: 680, height: 2400, deviceScaleFactor: 1 });
    await page.goto(`${base}/embed/${t}/`, { waitUntil: 'load' });
    await delay(500);
    const h = await page.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
    await page.screenshot({ path: path.join(SHOTS, `${t}-680.png`), fullPage: true });
    await page.setViewport({ width: 360, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${base}/embed/${t}/`, { waitUntil: 'load' });
    await delay(400);
    await page.screenshot({ path: path.join(SHOTS, `${t}-360.png`), fullPage: true });
    console.log(`${t}: ${h}px at 680 wide`);
  }
  await browser.close();
  server.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
