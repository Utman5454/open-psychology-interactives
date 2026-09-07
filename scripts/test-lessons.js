#!/usr/bin/env node
/* =========================================================================
   Regression tests for the lesson builder and player
   -------------------------------------------------------------------------
       node scripts/test-lessons.js

   Drives lessons/build.html and lessons/index.html in headless Chromium and
   asserts the behaviours that a page load alone (scripts/smoke-browser.js)
   cannot see:

     1. Copy and Preview use the lesson as it is at the moment of the click,
        not a link generated before the last edit, and an older encode that
        finishes late never overwrites a newer link.
     2. The player's question prompt is rendered Markdown outside the
        <label>; the input keeps a short label and is described by the
        prompt; a link inside the prompt is not inside any label.
     3. Opening a lesson file or clearing the draft repeatedly does not
        accumulate input listeners on the top fields.

   Development-only, like the smoke test: needs Playwright at run time,
   prints "SKIPPED:" and exits 0 when it is unavailable, and adds nothing
   to the site. Exits 1 on the first failed assertion.
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
    await new Promise(r => setTimeout(r, 150));
  }
  throw new Error('local server did not start');
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

/* A lesson file the builder can open. */
const FILE_LESSON = {
  schema: 1, title: 'Opened from a file', intro: '', author: '',
  steps: [{ type: 'note', text: 'A note.' }],
};

async function testBuilder(page, base) {
  // Count 'input' listeners on the title field from before any script runs.
  await page.addInitScript(() => {
    window.__inputListeners = 0;
    const original = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...rest) {
      if (type === 'input' && this instanceof Element && this.id === 'lesson-title') window.__inputListeners += 1;
      return original.call(this, type, ...rest);
    };
  });
  await page.goto(base + 'lessons/build.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // Build a valid lesson: a title and one note.
  await page.fill('#lesson-title', 'First title');
  await page.click('[data-action="add-note"]');
  await page.fill('#step-0-text', 'Read this.');
  await page.waitForTimeout(700);
  const firstLink = await page.inputValue('#student-link');
  check(firstLink.includes('#l='), 'a student link exists once the lesson is valid');

  /* 1a. Copy immediately after an edit, inside the debounce. */
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.fill('#lesson-title', 'Edited title');
  await page.click('[data-action="copy"]');            // no wait: inside the 400 ms debounce
  await page.waitForTimeout(300);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  const decodedCopied = await page.evaluate(url => OPI.decodeLesson(decodeURIComponent(url.split('#l=')[1])), copied);
  check(decodedCopied.title === 'Edited title', 'Copy encodes the lesson as it is at the click, not the stale link');
  check(copied !== firstLink, 'the copied link differs from the pre-edit link');

  /* 1b. An older encode finishing late must not overwrite a newer link. */
  await page.evaluate(() => {
    const real = OPI.encodeLesson;
    let calls = 0;
    OPI.encodeLesson = function (lesson) {
      calls += 1;
      const delay = calls === 1 ? 600 : 0;    // the first call is slow, the second fast
      return new Promise(resolve => setTimeout(() => resolve(real(lesson)), delay));
    };
  });
  await page.fill('#lesson-title', 'Slow');
  await page.waitForTimeout(450);              // debounce fires: slow encode (600 ms) starts
  await page.fill('#lesson-title', 'Fast');
  await page.waitForTimeout(450);              // debounce fires: fast encode completes first
  await page.waitForTimeout(700);              // the slow one now completes and must be ignored
  const shown = await page.inputValue('#student-link');
  const decodedShown = await page.evaluate(url => OPI.decodeLesson(decodeURIComponent(url.split('#l=')[1])), shown);
  check(decodedShown.title === 'Fast', 'a late older encode does not overwrite the newer link');
  await page.reload({ waitUntil: 'networkidle' });         // discards the instrumented encoder

  /* 1c. Preview opens the player on the current lesson, clicked inside the debounce. */
  await page.fill('#lesson-title', 'Preview title');
  const [popup] = await Promise.all([
    page.context().waitForEvent('page'),
    page.click('[data-action="preview"]'),     // no wait
  ]);
  await popup.waitForLoadState('networkidle');
  await popup.waitForSelector('[data-player-title]');
  const previewed = (await popup.textContent('[data-player-title]')).trim();
  check(previewed === 'Preview title', 'Preview opens the lesson as it is at the click (got "' + previewed + '")');
  await popup.close();

  /* 3. Repeated open-file and clear-draft do not accumulate listeners. */
  const before = await page.evaluate(() => window.__inputListeners);
  check(before === 1, 'one input listener on the title field after start (got ' + before + ')');
  for (let i = 0; i < 3; i++) {
    await page.setInputFiles('#open-file', {
      name: 'lesson.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(FILE_LESSON)),
    });
    await page.waitForTimeout(150);
  }
  check((await page.inputValue('#lesson-title')) === 'Opened from a file', 'opening a lesson file fills the title');
  page.once('dialog', d => d.accept());
  await page.click('[data-action="clear"]');
  await page.waitForTimeout(150);
  check((await page.inputValue('#lesson-title')) === '', 'clearing the draft empties the title');
  const after = await page.evaluate(() => window.__inputListeners);
  check(after === 1, 'still one input listener after three opens and a clear (got ' + after + ')');
  // And the single listener still works on the replaced lesson object.
  await page.fill('#lesson-title', 'After clear');
  await page.waitForTimeout(600);
  const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('opi.lesson.draft.v1')));
  check(draft && draft.title === 'After clear', 'typing after a clear updates the new lesson and the draft');
}

async function testPlayer(page, base) {
  const lesson = {
    schema: 1, title: 'Player markup', intro: '', author: '',
    steps: [{ type: 'question', prompt: 'Read [the notes](https://example.org) then **answer**.', kind: 'long' }],
  };
  await page.goto(base + 'lessons/build.html', { waitUntil: 'networkidle' });
  const encoded = await page.evaluate(l => OPI.encodeLesson(l), lesson);
  await page.goto(base + 'lessons/index.html#l=' + encoded, { waitUntil: 'networkidle' });
  await page.click('[data-player-next]');
  await page.waitForSelector('#answer-0');

  const facts = await page.evaluate(() => {
    const input = document.getElementById('answer-0');
    const label = document.querySelector('label[for="answer-0"]');
    const prompt = document.getElementById(input.getAttribute('aria-describedby'));
    const link = prompt && prompt.querySelector('a');
    return {
      labelText: label && label.textContent.trim(),
      labelHasBlock: Boolean(label && label.querySelector('div, p, ul, ol, table, h1, h2, h3, h4')),
      promptExists: Boolean(prompt),
      promptHasStrong: Boolean(prompt && prompt.querySelector('strong')),
      linkExists: Boolean(link),
      linkInsideLabel: Boolean(link && link.closest('label')),
      promptInsideLabel: Boolean(prompt && prompt.closest('label')),
    };
  });
  check(facts.labelText === 'Your answer', 'the input has a short visible label');
  check(!facts.labelHasBlock, 'the label contains no block-level Markdown');
  check(facts.promptExists && facts.promptHasStrong, 'the input is described by the rendered prompt');
  check(facts.linkExists && !facts.linkInsideLabel, 'a link in the prompt is not inside any label');
  check(!facts.promptInsideLabel, 'the prompt is not inside a label');

  // Clicking the prompt's link must not be treated as a label click on the input.
  await page.evaluate(() => {
    const link = document.querySelector('#prompt-0 a');
    link.addEventListener('click', e => e.preventDefault(), { once: true });
    link.click();
  });
  const focusedIsInput = await page.evaluate(() => document.activeElement && document.activeElement.id === 'answer-0');
  check(!focusedIsInput, 'activating the prompt link does not move focus to the input');
}

async function main() {
  const playwright = loadPlaywright();
  if (!playwright) { console.log('SKIPPED: Playwright is not available.'); return 0; }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opi-lessons-'));
  fs.symlinkSync(REPO, path.join(tmp, BASE_PATH), 'dir');
  const port = await freePort();
  const base = `http://127.0.0.1:${port}/${BASE_PATH}/`;
  const server = spawn(process.env.PYTHON || 'python3',
    ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], { cwd: tmp, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer(base + 'index.html');
    browser = await playwright.chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1100, height: 800 } });
    const errors = [];
    context.on('page', p => {
      p.on('pageerror', e => errors.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    });
    await testBuilder(await context.newPage(), base);
    await testPlayer(await context.newPage(), base);
    check(errors.length === 0, 'no console errors or exceptions (' + errors.join(' | ') + ')');
  } finally {
    if (browser) await browser.close();
    server.kill();
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  console.log(`\n${failures.length} failure(s).`);
  return failures.length ? 1 : 0;
}

main().then(code => process.exit(code), err => { console.error(err); process.exit(1); });
