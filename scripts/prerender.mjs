// Post-build prerender step.
//
// The site is a client-rendered SPA (React mounts into an empty <div id="root">
// via createRoot().render()). Many AI crawlers (and some SEO tools) fetch raw
// HTML without executing JavaScript, so without this step every route except
// "/" would look empty to them, and even "/" would be missing its actual
// content — only the static <head> tags in index.html would be visible.
//
// This script boots the built `dist/` output with `vite preview`, visits each
// route with a real browser, waits for React to render and for usePageMeta to
// apply that route's title/description/canonical/JSON-LD, then writes the
// resulting HTML to disk as that route's own static index.html. Because
// main.tsx uses createRoot (not hydrateRoot), real browsers simply re-render
// over this on load — there's no hydration mismatch risk.
//
// Requires a Chromium build reachable via Playwright. Not wired into `npm run
// build` automatically so a plain build never fails in an environment without
// a browser installed — run `npm run prerender` after `npm run build` when
// you want crawlable static output.

import { preview } from 'vite';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROUTES = ['/', '/about', '/faq', '/request-quote', '/terms', '/privacy', '/cookies'];
const PLAYWRIGHT_PATH = process.env.PLAYWRIGHT_MODULE ?? '/opt/node22/lib/node_modules/playwright/index.js';
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const pw = (await import(PLAYWRIGHT_PATH)).default;
const { chromium } = pw;

const server = await preview({ preview: { port: 4321, strictPort: true } });
const baseUrl = server.resolvedUrls.local[0];

const browser = await chromium.launch({ executablePath: CHROMIUM_PATH, args: ['--no-sandbox'] });
const page = await browser.newPage();

for (const route of ROUTES) {
  await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const html = await page.content();
  const outPath = route === '/' ? 'dist/index.html' : join('dist', route.slice(1), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`prerendered ${route} -> ${outPath}`);
}

await browser.close();
await new Promise((resolve) => server.httpServer.close(resolve));
