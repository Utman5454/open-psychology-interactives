#!/usr/bin/env node
/* =========================================================================
   Regression test: Multiple Comparisons Experiment 1's predicted FWER
   -------------------------------------------------------------------------
       node scripts/test-multiple-comparisons-fwer.js

   Experiment 1 runs k tests, `real` of which carry a genuine effect, so the
   false-positive family contains only the m0 = k - real true-null tests: a
   test with a real effect can only be a correct detection or a miss, never
   a false positive. An earlier version of
   modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/tool.js
   predicted the family-wise rate and the expected false-positive count from
   the full k, which is only correct when real is 0; whenever real > 0 the
   displayed "predicted" figures overstated the true prediction and visibly
   disagreed with the simulated rate. This test fails against that
   pre-fix formula and guards against a regression back to it.

   It runs the actual `predictedFWER` and `predictedFalsePositives` helpers
   straight out of tool.js, extracted at run time with a small
   bracket-counting reader rather than re-typed here, so an edit to the real
   calculation is what this test sees.

   No Playwright needed - this is plain Node - but it still fits alongside
   the browser-tier checks in scripts/check-all.py, since only Node itself
   is assumed, not a browser.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const TOOL_FILE = path.join(
  __dirname, '..',
  'modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/tool.js');

/** Extract `function name(...) { ... }` by counting braces, so nested
    blocks do not truncate it early. */
function extractFunction(source, name) {
  const start = new RegExp('function ' + name + '\\s*\\([^)]*\\)\\s*\\{').exec(source);
  if (!start) throw new Error('could not find "function ' + name + '" in ' + TOOL_FILE);
  let i = start.index + start[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  return source.slice(start.index, i);
}

function loadToolInternals() {
  const source = fs.readFileSync(TOOL_FILE, 'utf8');
  const snippet = [
    extractFunction(source, 'predictedFWER'),
    extractFunction(source, 'predictedFalsePositives'),
    'module.exports = { predictedFWER: predictedFWER, ' +
      'predictedFalsePositives: predictedFalsePositives };',
  ].join('\n\n');

  const sandbox = { module: { exports: {} }, Math: Math };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: 'extracted-mc-fwer-internals.js' });
  return sandbox.module.exports;
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

function close(actual, expected, tolerance) {
  return Math.abs(actual - expected) <= tolerance;
}

function main() {
  const { predictedFWER, predictedFalsePositives } = loadToolInternals();

  // k = 20, alpha = .05, uncorrected: acceptance values from the defect
  // report. m0 = k - real in each case.
  const alpha = 0.05;

  const fwer20_0 = predictedFWER(alpha, 20 - 0);
  check(close(fwer20_0 * 100, 64.15, 0.05),
    `k=20 real=0 (m0=20): predicted FWER ~= 64.15% (got ${(fwer20_0 * 100).toFixed(2)}%)`);

  const fwer20_5 = predictedFWER(alpha, 20 - 5);
  check(close(fwer20_5 * 100, 53.67, 0.05),
    `k=20 real=5 (m0=15): predicted FWER ~= 53.67% (got ${(fwer20_5 * 100).toFixed(2)}%)`);

  const fwer20_20 = predictedFWER(alpha, 20 - 20);
  check(fwer20_20 === 0,
    `k=20 real=20 (m0=0): predicted FWER is exactly 0 (got ${fwer20_20})`);
  check(!Number.isNaN(fwer20_20), 'k=20 real=20: predicted FWER is not NaN');

  // The regression this test exists for: a formula that used k instead of
  // m0 would give 64.15% here too, not 53.67%. Guard explicitly against the
  // old exponent by checking the two differ once real > 0.
  const buggyFwer20_5 = 1 - Math.pow(1 - alpha, 20);
  check(!close(fwer20_5, buggyFwer20_5, 1e-6),
    'k=20 real=5: predicted FWER does not match the old (exponent k) formula');

  // Bonferroni, k = 20, alpha = .05, real = 5: per-test threshold stays
  // alpha / k (the correction is defined across the full family), but the
  // false-positive-family probability uses only m0 = 15 true nulls.
  const bonferroniThreshold = alpha / 20;
  const fwerBonferroni = predictedFWER(bonferroniThreshold, 20 - 5);
  check(close(fwerBonferroni * 100, 3.69, 0.05),
    `k=20 real=5 Bonferroni: predicted FWER ~= 3.69% (got ${(fwerBonferroni * 100).toFixed(2)}%)`);

  // Expected false positives per experiment must use m0 = k - real, not k.
  check(close(predictedFalsePositives(alpha, 20 - 0), 1.0, 1e-9),
    'k=20 real=0: expected false positives = m0 * threshold = 1.00');
  check(close(predictedFalsePositives(alpha, 20 - 5), 0.75, 1e-9),
    'k=20 real=5: expected false positives = m0 * threshold = 0.75 (not 20 * .05 = 1.00)');
  check(predictedFalsePositives(alpha, 20 - 20) === 0,
    'k=20 real=20: expected false positives is exactly 0, not NaN');

  console.log(`\n${failures.length} failure(s).`);
  return failures.length ? 1 : 0;
}

process.exit(main());
