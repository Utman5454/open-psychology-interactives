#!/usr/bin/env node
/* =========================================================================
   Regression test: the Simplified Dual-Task Capacity Laboratory's stimuli
   -------------------------------------------------------------------------
       node scripts/test-dual-task-balance.js

   The dual block shows a letter (vowel or consonant) and a disc (left or
   right) together on every trial. An earlier version paired the two by the
   same trial index for both, so every vowel fell on the same side as every
   other vowel: a learner could answer the side task by reading the letter,
   which is not the dual-task cost the activity means to measure. The fix in
   simplified/modules/cognitive/tools/08-dual-task-capacity-lab/activity.js
   assigns the two dimensions from an orthogonal design instead. This test
   fails if that independence regresses.

   It runs the actual `buildTrials`, `planBlock`, `mulberry32` and the
   letter/side pools straight out of activity.js, extracted at run time with
   a small bracket-counting reader rather than re-typed here, so an edit to
   the real algorithm is what this test sees - a hand-copied reimplementation
   could drift from the source and stop meaning anything. Nothing here needs
   a DOM: all four extracted units are plain functions over letters, sides
   and a seeded random source.

   No Playwright needed - this is plain Node - but it still fits alongside
   the browser-tier checks in scripts/check-all.py, since only Node itself
   is assumed, not a browser.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ACTIVITY_FILE = path.join(
  __dirname, '..',
  'simplified/modules/cognitive/tools/08-dual-task-capacity-lab/activity.js');

function extractVar(source, name) {
  const match = source.match(new RegExp('var ' + name + ' = [^;]*;'));
  if (!match) throw new Error('could not find "var ' + name + '" in ' + ACTIVITY_FILE);
  return match[0];
}

/** Extract `function name(...) { ... }` by counting braces, so nested
    blocks and strings containing braces do not truncate it early. */
function extractFunction(source, name) {
  const start = new RegExp('function ' + name + '\\s*\\([^)]*\\)\\s*\\{').exec(source);
  if (!start) throw new Error('could not find "function ' + name + '" in ' + ACTIVITY_FILE);
  let i = start.index + start[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  return source.slice(start.index, i);
}

function loadActivityInternals() {
  const source = fs.readFileSync(ACTIVITY_FILE, 'utf8');
  const snippet = [
    extractVar(source, 'VOWELS'),
    extractVar(source, 'CONSONANTS'),
    extractVar(source, 'SIDES'),
    extractVar(source, 'DUAL_TRIALS'),
    extractVar(source, 'SINGLE_TRIALS'),
    extractFunction(source, 'mulberry32'),
    extractFunction(source, 'planBlock'),
    extractFunction(source, 'shuffle'),
    extractFunction(source, 'buildTrials'),
    'module.exports = { buildTrials: buildTrials, mulberry32: mulberry32, ' +
      'DUAL_TRIALS: DUAL_TRIALS, SINGLE_TRIALS: SINGLE_TRIALS };',
  ].join('\n\n');

  const sandbox = { module: { exports: {} }, Math: Math };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: 'extracted-dual-task-internals.js' });
  return sandbox.module.exports;
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

function main() {
  const { buildTrials, mulberry32, DUAL_TRIALS, SINGLE_TRIALS } = loadActivityInternals();

  // The dual block, tried under several seeds so the fix is shown to hold in
  // general rather than for today's one fixed seed (7001 + 2 * 991 in
  // production, since the dual block is index 2 of BLOCKS).
  const dualBlock = { key: 'dual', dual: true };
  const seeds = [7001 + 2 * 991, 1, 42, 999999, 123456789];

  seeds.forEach((seed) => {
    const trials = buildTrials(dualBlock, mulberry32(seed));
    check(trials.length === DUAL_TRIALS, `seed ${seed}: produced ${DUAL_TRIALS} dual trials`);

    const counts = { vowelLeft: 0, vowelRight: 0, consonantLeft: 0, consonantRight: 0 };
    trials.forEach((trial) => {
      const key = (trial.isVowel ? 'vowel' : 'consonant') + (trial.side === 'left' ? 'Left' : 'Right');
      counts[key] += 1;
    });
    const values = Object.values(counts);
    check(Math.max(...values) - Math.min(...values) <= 1,
      `seed ${seed}: the four letter/side combinations are balanced within one of each other (${JSON.stringify(counts)})`);

    // The regression this test exists for: one dimension perfectly
    // predicting the other. If every vowel trial has the same side, this
    // set has one member instead of two.
    const vowelSides = new Set(trials.filter((t) => t.isVowel).map((t) => t.side));
    const consonantSides = new Set(trials.filter((t) => !t.isVowel).map((t) => t.side));
    check(vowelSides.size === 2, `seed ${seed}: vowel trials appear on both sides (not just ${[...vowelSides]})`);
    check(consonantSides.size === 2, `seed ${seed}: consonant trials appear on both sides (not just ${[...consonantSides]})`);

    // Each dimension is still separately balanced 50/50, as it was before the fix.
    const vowelCount = trials.filter((t) => t.isVowel).length;
    const leftCount = trials.filter((t) => t.side === 'left').length;
    check(vowelCount === DUAL_TRIALS / 2, `seed ${seed}: vowel/consonant marginal is 50/50 (${vowelCount} vowels of ${DUAL_TRIALS})`);
    check(leftCount === DUAL_TRIALS / 2, `seed ${seed}: left/right marginal is 50/50 (${leftCount} left of ${DUAL_TRIALS})`);
  });

  // The single-task blocks are untouched by the fix: each still varies only
  // its own dimension, still 50/50.
  const letterTrials = buildTrials({ key: 'letter', dual: false }, mulberry32(11));
  check(letterTrials.length === SINGLE_TRIALS, 'the letters-alone block produces the single-task trial count');
  check(letterTrials.every((t) => t.side === undefined), 'the letters-alone block never sets a side');
  check(letterTrials.filter((t) => t.isVowel).length === SINGLE_TRIALS / 2,
    'the letters-alone block is 50/50 vowel and consonant');

  const sideTrials = buildTrials({ key: 'side', dual: false }, mulberry32(12));
  check(sideTrials.every((t) => t.letter === undefined), 'the sides-alone block never sets a letter');
  check(sideTrials.filter((t) => t.side === 'left').length === SINGLE_TRIALS / 2,
    'the sides-alone block is 50/50 left and right');

  console.log(`\n${failures.length} failure(s).`);
  return failures.length ? 1 : 0;
}

process.exit(main());
