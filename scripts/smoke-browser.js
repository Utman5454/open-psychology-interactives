#!/usr/bin/env node
/* =========================================================================
   Browser smoke test
   -------------------------------------------------------------------------
       node scripts/smoke-browser.js                # report, exit 1 on any error
       node scripts/smoke-browser.js --shots DIR    # also save screenshots
       node scripts/smoke-browser.js --all-tools    # every activity, both editions

   Serves the repository over HTTP, opens a set of representative pages in
   headless Chromium at a desktop and a phone viewport, and fails if any page
   produces a console error, an uncaught exception, a failed request or
   horizontal page scrolling.

   The repository is served under the same sub-path GitHub Pages uses,
   `/open-psychology-interactives/`, by serving a temporary directory that
   holds a symbolic link of that name to the repository. That is what makes
   the test meaningful: a relative path one `../` short works from disk and
   from a root-served server, and breaks only under the sub-path (see
   docs/lessons.md, L-005). It also lets 404.html, the one page with
   root-absolute paths, load its assets. Where a symbolic link cannot be
   created the test falls back to serving the root and says so.

   This is a DEVELOPMENT check, not part of the site. The site ships no
   dependencies and this file changes nothing about that: it needs Playwright
   only when it runs, finds it through NODE_PATH or a global install, and
   prints "SKIPPED:" and exits 0 when Playwright is not available so that
   scripts/check-all.py can report the gate as skipped rather than broken.
   Nothing here is loaded by any page.

   The server is Python's http.server, because Python 3 is the one tool the
   repository already requires for its scripts.
   ========================================================================= */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const net = require('net');

const REPO = path.resolve(__dirname, '..');
const BASE_PATH = 'open-psychology-interactives';
const VIEWPORTS = [['desktop', 1280, 900], ['phone', 360, 780]];
const GOTO_TIMEOUT_MS = 30000;
const SETTLE_MS = 300;

/** The pages that between them exercise every kind of page the site has. */
const REPRESENTATIVE = [
  ['home', 'index.html'],
  ['404-page', '404.html'],
  ['module-research-methods', 'modules/research-methods/index.html'],
  ['module-personality', 'modules/personality-individual-differences/index.html'],
  ['tool-rm-08', 'modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/index.html'],
  ['tool-cog-06', 'modules/cognitive/tools/06-stroop-interference-lab/index.html'],
  ['tool-neuro-01', 'modules/neuropsychology/tools/01-double-dissociation-detective/index.html'],
  ['tool-pid-12', 'modules/personality-individual-differences/tools/12-alpha-trap/index.html'],
  ['tool-soc-08', 'modules/social-critical-psychology/tools/08-minimal-group-positive-distinctiveness/index.html'],
  ['simplified-home', 'simplified/index.html'],
  ['simplified-module-cognitive', 'simplified/modules/cognitive/index.html'],
  ['simplified-rm-08', 'simplified/modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/index.html'],
  ['simplified-soc-08', 'simplified/modules/social-critical-psychology/tools/08-minimal-group-positive-distinctiveness/index.html'],
];

/* ------------------------------------------------------------------ setup */

function loadPlaywright() {
  const candidates = [
    null,
    process.env.NODE_PATH,
    '/opt/node22/lib/node_modules',
    '/usr/local/lib/node_modules',
    '/usr/lib/node_modules',
  ];
  for (const dir of candidates) {
    try {
      return require(dir ? path.join(dir, 'playwright') : 'playwright');
    } catch {
      // try the next location
    }
  }
  return null;
}

function allToolPages() {
  const pages = [];
  for (const edition of ['modules', 'simplified/modules']) {
    for (const mod of fs.readdirSync(path.join(REPO, edition))) {
      const toolsDir = path.join(REPO, edition, mod, 'tools');
      if (!fs.existsSync(toolsDir)) continue;
      for (const slug of fs.readdirSync(toolsDir)) {
        const page = path.join(toolsDir, slug, 'index.html');
        if (!fs.existsSync(page)) continue;
        const prefix = edition === 'modules' ? 'full' : 'simp';
        pages.push([`${prefix}-${mod}-${slug}`, path.relative(REPO, page).split(path.sep).join('/')]);
      }
    }
  }
  return pages;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

/** A temporary directory containing `<BASE_PATH> -> REPO`, or null. */
function makeSubPathRoot() {
  try {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opi-smoke-'));
    fs.symlinkSync(REPO, path.join(dir, BASE_PATH), 'dir');
    return dir;
  } catch {
    return null;
  }
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('local server did not start');
}

function startServer(port, root) {
  return spawn(process.env.PYTHON || 'python3',
    ['-m', 'http.server', String(port), '--bind', '127.0.0.1'],
    { cwd: root, stdio: 'ignore' });
}

/* --------------------------------------------------------------- one page */

function collectProblems(page) {
  const problems = [];
  page.on('console', m => { if (m.type() === 'error') problems.push('console: ' + m.text()); });
  page.on('pageerror', e => problems.push('exception: ' + e.message));
  page.on('requestfailed', r => problems.push('request failed: ' + r.url()));
  page.on('response', r => { if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
  return problems;
}

async function inspect(page, url) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: GOTO_TIMEOUT_MS });
  await page.waitForTimeout(SETTLE_MS);
  const h1 = (await page.locator('h1').first().textContent().catch(() => '')) || '';
  const hscroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  return { status: response ? response.status() : 0, h1: h1.trim(), hscroll };
}

async function checkPage(browser, url, name, vp, shotsDir) {
  const [label, width, height] = vp;
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const problems = collectProblems(page);
  const found = await inspect(page, url);
  if (found.status !== 200) problems.push(`status ${found.status}`);
  if (!found.h1) problems.push('no <h1>');
  if (found.hscroll) problems.push('horizontal page scroll');
  if (shotsDir) await page.screenshot({ path: path.join(shotsDir, `${name}-${label}.png`) });
  await context.close();

  console.log(`${(problems.length ? 'FAIL' : 'ok').padEnd(4)} ${name}/${label}  "${found.h1.slice(0, 50)}"`);
  for (const p of problems) console.log('       ' + p.slice(0, 220));
  return problems.length === 0;
}

/* ------------------------------------------------------------------- main */

function parseArgs(argv) {
  const shots = argv.indexOf('--shots');
  return {
    shotsDir: shots >= 0 ? argv[shots + 1] : null,
    pages: argv.includes('--all-tools') ? allToolPages() : REPRESENTATIVE,
  };
}

async function runAll(playwright, base, pages, shotsDir) {
  const browser = await playwright.chromium.launch();
  let failures = 0;
  try {
    for (const [name, rel] of pages) {
      for (const vp of VIEWPORTS) {
        if (!(await checkPage(browser, base + rel, name, vp, shotsDir))) failures++;
      }
    }
  } finally {
    await browser.close();
  }
  return failures;
}

async function main() {
  const { shotsDir, pages } = parseArgs(process.argv.slice(2));
  const playwright = loadPlaywright();
  if (!playwright) {
    console.log('SKIPPED: Playwright is not available (install it globally or set NODE_PATH).');
    return 0;
  }
  if (shotsDir) fs.mkdirSync(shotsDir, { recursive: true });

  const subPathRoot = makeSubPathRoot();
  const root = subPathRoot || REPO;
  const port = await freePort();
  const base = `http://127.0.0.1:${port}/` + (subPathRoot ? BASE_PATH + '/' : '');
  console.log(subPathRoot
    ? `serving under /${BASE_PATH}/ (as GitHub Pages does)`
    : 'could not create a symbolic link; serving at the root instead');

  const server = startServer(port, root);
  let failures;
  try {
    await waitForServer(base + 'index.html');
    failures = await runAll(playwright, base, pages, shotsDir);
  } finally {
    server.kill();
    if (subPathRoot) fs.rmSync(subPathRoot, { recursive: true, force: true });
  }
  console.log(`\n${pages.length * VIEWPORTS.length} page loads, ${failures} with problems.`);
  return failures ? 1 : 0;
}

main().then(code => process.exit(code), err => { console.error(err); process.exit(1); });
