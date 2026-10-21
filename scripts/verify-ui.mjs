// Local verification: serves out/, drives Chrome to capture screenshots, measure
// hero/container alignment, and read window.dataLayer after a calculator input
// change. Not part of the build or the committed site.

import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const SHOTS = path.join(ROOT, 'docs', 'screenshots');
const PORT = 5055;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.avif': 'image/avif', '.webp': 'image/webp', '.txt': 'text/plain',
  '.xml': 'application/xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
};

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

async function main() {
  await fs.mkdir(SHOTS, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const base = `http://localhost:${PORT}`;
  const results = {};

  // Hero alignment at several widths.
  const page = await browser.newPage();
  const aligns = {};
  for (const w of [1280, 1440, 1920]) {
    await page.setViewport({ width: w, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`${base}/`, { waitUntil: 'load' });
    // Force a classic 15px scrollbar that reserves layout width (as on Windows
    // Chrome) so a 100vw-based bug would surface as a left-offset.
    await page.addStyleTag({
      content:
        'html{overflow-y:scroll} ::-webkit-scrollbar{width:15px;background:#eee} ::-webkit-scrollbar-thumb{background:#999}',
    });
    await delay(400);
    const m = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2 = document.getElementById('popular-heading');
      const logo = document.querySelector('header a[aria-label="HomeWaterMath home"]');
      return {
        logoLeft: logo ? Math.round(logo.getBoundingClientRect().left) : null,
        h1Left: h1 ? Math.round(h1.getBoundingClientRect().left) : null,
        h2Left: h2 ? Math.round(h2.getBoundingClientRect().left) : null,
      };
    });
    aligns[w] = {
      ...m,
      h1MinusLogo: m.h1Left != null && m.logoLeft != null ? m.h1Left - m.logoLeft : null,
      h1MinusH2: m.h1Left != null && m.h2Left != null ? m.h1Left - m.h2Left : null,
    };
  }
  results.heroAlignment = aligns;

  // Homepage hero screenshot at 1440.
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await delay(500);
  await page.screenshot({ path: path.join(SHOTS, 'home-1440-hero.png') });

  // Homepage full page at 390 (well band + tiles).
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await delay(500);
  await page.screenshot({ path: path.join(SHOTS, 'home-390-full.png'), fullPage: true });

  // Well band element (contains the pressure tank tile) at 390.
  const wellBand = await page.$('section[aria-labelledby="well-heading"]');
  if (wellBand) await wellBand.screenshot({ path: path.join(SHOTS, 'well-band-390.png') });

  // Well band at 1440 (pressure tank tile arrow must stay on the name line).
  await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await delay(500);
  const wellBand1440 = await page.$('section[aria-labelledby="well-heading"]');
  if (wellBand1440) await wellBand1440.screenshot({ path: path.join(SHOTS, 'well-band-1440.png') });

  // dataLayer after changing one input on the size calculator.
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${base}/water-softener-size-calculator/`, { waitUntil: 'load' });
  await delay(2500); // let the lazyOnload gtag stub run
  const before = await page.evaluate(() => ({
    gtag: typeof window.gtag,
    dataLayer: Array.isArray(window.dataLayer),
  }));
  await page.click('#size-people', { clickCount: 3 });
  await page.type('#size-people', '5');
  await delay(1800); // past the 1500ms tool_result_shown debounce
  const dataLayer = await page.evaluate(() => {
    try {
      return JSON.stringify((window.dataLayer || []).map((a) => Array.from(a)));
    } catch {
      return '[]';
    }
  });
  results.dataLayerBefore = before;
  results.dataLayer = dataLayer;

  await browser.close();
  server.close();

  await fs.writeFile(path.join(SHOTS, 'verify-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
