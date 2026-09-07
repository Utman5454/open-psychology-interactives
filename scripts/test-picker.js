#!/usr/bin/env node
/* =========================================================================
   Regression tests for shared catalogue filtering and the two places that
   use it: the library and the lesson builder's compact activity picker
   -------------------------------------------------------------------------
       node scripts/test-picker.js

   Covers two things a page load alone (scripts/smoke-browser.js) cannot see:

     1. The compact picker (lessons/build.html) filters by edition, module,
        length and level exactly as the library does, because both call the
        same OPI.filterActivities() in assets/product/catalogue.js.
     2. Clicking a result immediately after typing a search term - before
        tabbing or clicking anywhere else - is not silently dropped.

        Live QA found this on the picker's "Add" button: binding both
        "input" and "change" to the whole control (matching how the library
        bound both to its form) meant a text input's own "change" event,
        which fires on blur, rebuilt the results list between mousedown and
        mouseup of the click that was blurring it, so the browser saw the
        click's target change mid-click and never dispatched a "click" event
        at all. The fix was binding only "input" (which every affected
        control - text, select, radio, checkbox - fires in every evergreen
        browser), in both the library and the picker; this test exercises
        the exact mousedown-blurs-the-search-box sequence in both places, on
        the level of a real Playwright mouse click, not a scripted
        .click(), which does not reproduce a browser's click-target check.

   Development-only, like the other Playwright checks: prints "SKIPPED:" and
   exits 0 without Playwright, needs nothing else, and adds nothing to the
   site.
   ========================================================================= */

'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const net = require('net');

const REPO = path.resolve(__dirname, '..');
const BASE_PATH = 'open-psychology-interactives';

function loadPlaywright() {
  for (const dir of [null, process.env.NODE_PATH, '/opt/node22/lib/node_modules', '/usr/local/lib/node_modules', '/usr/lib/node_modules']) {
    try { return require(dir ? path.join(dir, 'playwright') : 'playwright'); } catch { /* next */ }
  }
  return null;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, '127.0.0.1', () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
    srv.on('error', reject);
  });
}

async function waitForServer(url) {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(url)).ok) return; } catch { /* not yet */ }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('local server did not start');
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

async function testLibraryFilters(page, base) {
  await page.goto(base + 'library/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const total = await page.$$eval('.results .result', (els) => els.length);
  check(total === 150, `library lists all 150 activities unfiltered (got ${total})`);

  await page.check('[data-library-filter="edition"] input[value="simplified"]');
  await page.check('[data-library-filter="module"] input[value="cognitive"]');
  await page.waitForTimeout(300);
  const filtered = await page.$$eval('.results .result .result__eyebrow', (els) => els.map((e) => e.textContent));
  check(filtered.length > 0 && filtered.every((t) => t.includes('Cognitive Psychology') && t.includes('Simplified')),
    `library edition+module filters combine with AND (${filtered.length} results, all Cognitive+Simplified)`);

  // The regression: click a result the instant after typing, before any
  // blur has otherwise occurred. A real Playwright click, not page.evaluate.
  await page.uncheck('[data-library-filter="edition"] input[value="simplified"]');
  await page.uncheck('[data-library-filter="module"] input[value="cognitive"]');
  await page.waitForTimeout(300);
  await page.fill('#library-query', 'stroop');
  await page.waitForTimeout(150);
  const before = page.url();
  await page.click('.results .result:first-child h3 a');
  await page.waitForTimeout(400);
  check(page.url() !== before && page.url().includes('activity.html'),
    'library: clicking a result immediately after typing a search term navigates (the click is not dropped)');
}

async function testPickerFilters(page, base) {
  await page.goto(base + 'lessons/build.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.click('[data-action="add-activity"]');
  await page.waitForTimeout(200);
  const total = await page.textContent('[data-builder-picker-count]');
  check(/150 matches|Showing the first \d+ of 150 matches/.test(total),
    `picker starts with all 150 activities in scope (got "${total.trim()}")`);

  await page.check('.picker__edition input[value="simplified"]');
  await page.selectOption('#picker-module', 'cognitive');
  await page.waitForTimeout(200);
  const metas = await page.$$eval('[data-builder-picker-results] .picker__item .picker__meta', (els) => els.map((e) => e.textContent));
  check(metas.length > 0 && metas.every((m) => m.includes('Cognitive Psychology') && m.includes('Simplified')),
    `picker edition+module filters combine with AND (${metas.length} results, all Cognitive+Simplified)`);

  await page.selectOption('#picker-band', 'short');
  await page.waitForTimeout(200);
  const withBand = await page.$$eval('[data-builder-picker-results] .picker__item .picker__meta', (els) => els.map((e) => e.textContent));
  check(withBand.length <= metas.length, 'picker: adding a length filter narrows (or holds) the result count');

  // The same regression, on the picker's own Add button, with an active search.
  await page.selectOption('#picker-band', '');
  await page.fill('#picker-query', 'stroop');
  await page.waitForTimeout(150);
  const stepsBefore = await page.evaluate(() => document.querySelectorAll('[data-builder-steps] > li').length);
  await page.click('[data-builder-picker-results] .picker__item button');
  await page.waitForTimeout(300);
  const stepsAfter = await page.evaluate(() => document.querySelectorAll('[data-builder-steps] > li').length);
  check(stepsAfter === stepsBefore + 1,
    `picker: clicking Add immediately after typing a search term adds the step (before ${stepsBefore}, after ${stepsAfter})`);
  const addedTitle = await page.textContent('[data-builder-steps] .step:last-child .step__title');
  check(addedTitle.includes('Stroop'), 'picker: the step added is the one that was showing (Stroop)');

  // Clearing every filter returns to the full catalogue.
  await page.check('.picker__edition input[value=""]');
  await page.selectOption('#picker-module', '');
  await page.fill('#picker-query', '');
  await page.waitForTimeout(200);
  const resetCount = await page.textContent('[data-builder-picker-count]');
  check(/150/.test(resetCount), `picker: clearing edition, module and search returns to all 150 (got "${resetCount.trim()}")`);
}

async function main() {
  const playwright = loadPlaywright();
  if (!playwright) { console.log('SKIPPED: Playwright is not available.'); return 0; }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opi-picker-'));
  fs.symlinkSync(REPO, path.join(tmp, BASE_PATH), 'dir');
  const port = await freePort();
  const base = `http://127.0.0.1:${port}/${BASE_PATH}/`;
  const server = spawn(process.env.PYTHON || 'python3',
    ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: tmp, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer(base + 'index.html');
    browser = await playwright.chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const errors = [];
    context.on('page', (p) => {
      p.on('pageerror', (e) => errors.push(e.message));
      p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    });
    await testLibraryFilters(await context.newPage(), base);
    await testPickerFilters(await context.newPage(), base);
    check(errors.length === 0, 'no console errors or exceptions (' + errors.join(' | ') + ')');
  } finally {
    if (browser) await browser.close();
    server.kill();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`\n${failures.length} failure(s).`);
  return failures.length ? 1 : 0;
}

main().then((code) => process.exit(code), (err) => { console.error(err); process.exit(1); });
