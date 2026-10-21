// Builds the IndexNow URL list and payload for .github/workflows/indexnow.yml.
//  - workflow_dispatch: submit every canonical URL in out/sitemap.xml.
//  - push: submit only the URLs whose page changed in the last commit. A change
//    to anything shared (layout, components, lib/**, config) submits all.
// Writes scripts/indexnow-payload.json and prints "count=N" to GITHUB_OUTPUT.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const HOST = 'homewatermath.com';
const SITE = `https://${HOST}`;
const KEY = '7239ecb4b098e1d2afc0abeff215d484';

async function sitemapUrls() {
  const xml = await fs.readFile(path.join(ROOT, 'out', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/** app/<path>/page.tsx -> "/<path>/", app/page.tsx -> "/". */
function pageFileToSlug(file) {
  const m = file.match(/^app\/(.*)\/page\.(tsx|ts)$/);
  if (m) return `/${m[1]}/`;
  if (file === 'app/page.tsx' || file === 'app/page.ts') return '/';
  return null;
}

function isShared(file) {
  return (
    file === 'app/layout.tsx' ||
    file === 'app/globals.css' ||
    file.startsWith('components/') ||
    file.startsWith('lib/') ||
    file === 'tailwind.config.ts' ||
    file === 'next.config.mjs' ||
    file === 'postcss.config.mjs'
  );
}

function changedFiles() {
  try {
    const out = execSync('git diff --name-only HEAD~1 HEAD', { cwd: ROOT, encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

async function main() {
  const all = await sitemapUrls();
  const allSet = new Set(all);
  const event = process.env.GITHUB_EVENT_NAME || 'workflow_dispatch';

  let urls = [];
  if (event === 'workflow_dispatch') {
    urls = all;
  } else {
    const files = changedFiles();
    let sendAll = false;
    const picked = new Set();
    for (const f of files) {
      const slug = pageFileToSlug(f);
      if (slug) {
        const u = slug === '/' ? `${SITE}/` : `${SITE}${slug}`;
        if (allSet.has(u)) picked.add(u);
      } else if (isShared(f)) {
        sendAll = true;
      }
      // other files (scripts, .github, md, config assets) -> no page impact
    }
    urls = sendAll ? all : [...picked];
  }

  urls = [...new Set(urls)];
  const outPath = path.join(__dirname, 'indexnow-payload.json');
  if (urls.length === 0) {
    await fs.writeFile(outPath, JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: [] }));
  } else {
    await fs.writeFile(
      outPath,
      JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }, null, 2),
    );
  }

  console.log(`IndexNow (${event}): ${urls.length} URL(s)`);
  urls.forEach((u) => console.log('  ' + u));

  if (process.env.GITHUB_OUTPUT) {
    await fs.appendFile(process.env.GITHUB_OUTPUT, `count=${urls.length}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
