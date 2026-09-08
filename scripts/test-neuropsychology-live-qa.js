#!/usr/bin/env node
/* =========================================================================
   Regression test: four Neuropsychology learner-facing defects
   -------------------------------------------------------------------------
       node scripts/test-neuropsychology-live-qa.js

   These four defects were discovered independently while drafting the
   Neuropsychology teaching guides and are fixed together in this branch:

   1. modules/neuropsychology/tools/06-memory-systems-amnesia-detective/
      index.html had a screen-reader-only figcaption claiming "Seven memory
      measures" when the activity implements exactly six.
   2. simplified/modules/neuropsychology/tools/06-memory-systems-amnesia-detective/
      overstated a double dissociation: its learner-facing reasoning said a
      "single shared system cannot produce" a crossed profile, and its
      synthesis said a claim about one shared system is "forbidden" by it.
      The correct, narrower claim is that a crossed profile counts against a
      simple shared-resource account without proving separate systems or
      ruling out every single-system account.
   3. simplified/modules/neuropsychology/tools/10-face-recognition-prosopagnosia-detective/
      falsely described the Full edition as adding "a sixth component, covert
      recognition." The Full edition has no such component; its extra
      material is a matched visual control and a parallel voice-recognition
      route.
   4. modules/neuropsychology/tools/09-hemispheric-lateralisation-split-brain/
      tool.js's initialState() defaulted the corpus callosum to "sectioned"
      rather than "intact," contradicting the interface's intact-first
      design, and its own documentation (and metadata.json's) claimed "six
      succeed after a section" when only three of the six field-response
      combinations do.

   This test runs the actual initialState() function extracted from
   tool.js for defect 4, and does plain string checks against the actual
   repository files for the other three and for defect 4's documentation
   half, rather than duplicating the corrected prose here more than
   necessary.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const MEMORY_FULL_HTML = path.join(
  ROOT, 'modules/neuropsychology/tools/06-memory-systems-amnesia-detective/index.html');
const MEMORY_SIMPLE_HTML = path.join(
  ROOT, 'simplified/modules/neuropsychology/tools/06-memory-systems-amnesia-detective/index.html');
const MEMORY_SIMPLE_JS = path.join(
  ROOT, 'simplified/modules/neuropsychology/tools/06-memory-systems-amnesia-detective/activity.js');
const FACE_SIMPLE_HTML = path.join(
  ROOT, 'simplified/modules/neuropsychology/tools/10-face-recognition-prosopagnosia-detective/index.html');
const FACE_SIMPLE_JS = path.join(
  ROOT, 'simplified/modules/neuropsychology/tools/10-face-recognition-prosopagnosia-detective/activity.js');
const FACE_SIMPLE_META = path.join(
  ROOT, 'simplified/modules/neuropsychology/tools/10-face-recognition-prosopagnosia-detective/metadata.json');
const SIMPLIFIED_CATALOGUE = path.join(ROOT, 'data/catalogue-simplified.json');
const SPLIT_BRAIN_JS = path.join(
  ROOT, 'modules/neuropsychology/tools/09-hemispheric-lateralisation-split-brain/tool.js');
const SPLIT_BRAIN_META = path.join(
  ROOT, 'modules/neuropsychology/tools/09-hemispheric-lateralisation-split-brain/metadata.json');
const SPLIT_BRAIN_HTML = path.join(
  ROOT, 'modules/neuropsychology/tools/09-hemispheric-lateralisation-split-brain/index.html');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

/** Extract `var NAME = [ ... ];`, tracking bracket depth so nested object
    literals (including function properties) inside the array don't confuse
    the boundary. */
function extractArray(source, name, file) {
  const start = new RegExp('var ' + name + ' = \\[').exec(source);
  if (!start) throw new Error('could not find "var ' + name + '" in ' + file);
  let i = start.index + start[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '[') depth += 1;
    else if (source[i] === ']') depth -= 1;
    i += 1;
  }
  while (source[i] !== ';') { i += 1; }
  return source.slice(start.index, i + 1);
}

/** Extract `function name(...) { ... }` by counting braces. */
function extractFunction(source, name, file) {
  const start = new RegExp('function ' + name + '\\s*\\([^)]*\\)\\s*\\{').exec(source);
  if (!start) throw new Error('could not find "function ' + name + '" in ' + file);
  let i = start.index + start[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  return source.slice(start.index, i);
}

function loadSplitBrainInitialState() {
  const source = read(SPLIT_BRAIN_JS);
  const snippet = [
    extractArray(source, 'ITEMS', SPLIT_BRAIN_JS),
    extractArray(source, 'FIELDS', SPLIT_BRAIN_JS),
    extractArray(source, 'CHANNELS', SPLIT_BRAIN_JS),
    extractArray(source, 'CALLOSUM', SPLIT_BRAIN_JS),
    extractFunction(source, 'initialState', SPLIT_BRAIN_JS),
    'module.exports = { initialState: initialState };',
  ].join('\n\n');

  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: 'extracted-split-brain-internals.js' });
  return sandbox.module.exports;
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

function main() {
  // 1. Full Memory Systems Detective: six, not seven, memory measures.
  const memoryFullHtml = read(MEMORY_FULL_HTML);
  check(!/seven memory measures/i.test(memoryFullHtml),
    'Full Memory Systems index.html no longer claims "seven memory measures"');
  check(/six memory measures/i.test(memoryFullHtml),
    'Full Memory Systems index.html states "six memory measures" in the accessible figcaption');

  // 2. Simplified Memory Systems Detective: no deterministic single-system
  // overclaim in the learner-facing reasoning or synthesis.
  const memorySimpleHtml = read(MEMORY_SIMPLE_HTML);
  const memorySimpleJs = read(MEMORY_SIMPLE_JS);
  const overclaimPatterns = [/cannot produce/i, /system\s+forbids/i];
  overclaimPatterns.forEach(function (pattern) {
    check(!pattern.test(memorySimpleHtml) && !pattern.test(memorySimpleJs),
      'Simplified Memory Systems activity.js/index.html contains no match for ' + pattern);
  });
  check(!/one and the same system/i.test(memorySimpleJs),
    'Simplified Memory Systems activity.js no longer states Claim 1 as "one and the same system"');

  // 3. Simplified Face Recognition Detective: "covert recognition" fully
  // removed, including its catalogue mirror.
  [FACE_SIMPLE_HTML, FACE_SIMPLE_JS, FACE_SIMPLE_META, SIMPLIFIED_CATALOGUE].forEach(function (file) {
    const content = read(file);
    check(!/covert recognition/i.test(content),
      path.relative(ROOT, file) + ' does not mention "covert recognition"');
  });

  // 4. Split-Brain Laboratory: initialState() defaults to an intact callosum.
  const splitBrain = loadSplitBrainInitialState();
  const state = splitBrain.initialState();
  check(state.callosum === 'intact',
    'Split-Brain initialState() defaults callosum to "intact" (got "' + state.callosum + '")');

  // 5. Split-Brain Laboratory: documentation matches the actual six-combination
  // grid (three of six succeed after a section, not "six").
  const splitBrainJs = read(SPLIT_BRAIN_JS);
  const splitBrainMeta = read(SPLIT_BRAIN_META);
  const splitBrainHtml = read(SPLIT_BRAIN_HTML);
  check(!/six succeed after a section/i.test(splitBrainJs),
    'tool.js no longer claims "six succeed after a section"');
  [splitBrainJs, splitBrainMeta, splitBrainHtml].forEach(function (content, i) {
    const label = ['tool.js', 'metadata.json', 'index.html'][i];
    check(!/twelve combinations/i.test(content),
      label + ' no longer uses the muddled "twelve combinations" framing');
  });
  check(/three succeed after a section/i.test(splitBrainJs),
    'tool.js states the correct figure, "three succeed after a section"');

  console.log('\n' + failures.length + ' failure(s).');
  return failures.length ? 1 : 0;
}

process.exit(main());
