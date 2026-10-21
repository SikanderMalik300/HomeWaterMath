// Checks that every batch-02 source URL (accessed 2026-10-21) returns 200.
// Reports non-200s; does not remove anything (per batch-02 spec section 8).
// Many retailer/cost sites block automated requests (403) even when live.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const text = await fs.readFile(path.join(ROOT, 'lib', 'data', 'sources.ts'), 'utf8');
  // Batch-02 entries carry accessed: '2026-10-21'. Match per line (single-line
  // entries) and capture the id and url from the same line.
  const entries = [];
  for (const line of text.split('\n')) {
    if (!line.includes("accessed: '2026-10-21'")) continue;
    const id = line.match(/^\s*'([^']+)':/);
    const url = line.match(/url:\s*'([^']+)'/);
    if (id && url) entries.push({ id: id[1], url: url[1] });
  }

  const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
  const results = [];
  const limit = 8;
  let i = 0;
  async function worker() {
    while (i < entries.length) {
      const e = entries[i++];
      let status = 0;
      let err = '';
      for (const method of ['HEAD', 'GET']) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 15000);
          const res = await fetch(e.url, { method, redirect: 'follow', headers: { 'User-Agent': UA }, signal: ctrl.signal });
          clearTimeout(t);
          status = res.status;
          if (status < 400) break;
        } catch (ex) {
          err = ex.name === 'AbortError' ? 'timeout' : ex.code || ex.message;
        }
      }
      results.push({ id: e.id, url: e.url, status, err });
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));

  results.sort((a, b) => a.id.localeCompare(b.id));
  const ok = results.filter((r) => r.status >= 200 && r.status < 400);
  const bad = results.filter((r) => !(r.status >= 200 && r.status < 400));
  console.log(`Checked ${results.length} batch-02 source URLs: ${ok.length} returned 200/OK, ${bad.length} did not.`);
  if (bad.length) {
    console.log('\nNon-200 (reported, not removed):');
    bad.forEach((r) => console.log(`  ${r.status || r.err || 'ERR'}  ${r.id}  ${r.url}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
