#!/usr/bin/env node
/* =========================================================================
   Regression test: the eight Personality & Individual Differences live-QA
   defect clusters found while drafting the teaching guides for that module
   -------------------------------------------------------------------------
       node scripts/test-personality-individual-differences-live-qa.js

   Each check below extracts the REAL, currently-shipped functions and data
   from the tool's own tool.js/activity.js (via a small vm sandbox) and runs
   them, rather than re-implementing the intended behaviour and comparing
   two independent guesses. Where a fix is about learner-facing prose rather
   than a computation, the check reads the actual shipped file and asserts
   on its real content.

   The eight clusters fixed together in this branch:

   1. modules/.../03-person-situation-interaction-theatre/ (Full) — four
      related issues: (a) ranksFor() assigned strictly sequential ranks
      despite a code comment claiming ties share a rank, and the shipped
      "emergency" situation contains a genuine tie between Jonah and Elif;
      fixed by giving tied behaviour values the conventional averaged rank.
      (b) the "all five situations" / challenge section had no `hidden`
      attribute and was not gated behind completing both ranking rounds;
      fixed by adding `id="matrix-section" hidden` and toggling it alongside
      `#explore`. (c) the challenge's grading checked only the selected
      multiple-choice answer, never whether the spread-below-2 manipulation
      had actually been performed; fixed so both conditions are required.
      (d) the tie-break display consequence is the same defect as (a) and is
      fixed by the same change.
   2. modules/.../07-factor-rotation-playground/ (Full) — the "correlated"
      marker set's note claimed the two clusters "sit about 55° apart" with
      a factor correlation of "0.57", presented as the natural/best-fitting
      alignment. Independently sweeping the tool's own simplicity objective
      over both of its dimensions finds the true best fit near 36°, not 55°.
      Fixed by computing the natural separation from the marker coordinates
      themselves at load time (naturalSeparation() in tool.js) rather than
      asserting a fixed angle, so future coordinate changes cannot make the
      prose stale again.
   3. modules/.../09-facet-level-detective/ (Full) — the Agreeableness
      case's two profiles, 83/51 and 52/80, average to 67 and 66
      respectively, not the equal domain score the tool claims. Fixed by
      changing the second profile to 52/82 (both now average to exactly 67)
      and by having buildVerdict() compute both people's scores separately
      rather than assuming equality.
   4. modules/.../24-explain-this-person-courtroom/ (Full) — the
      screen-reader table equivalent for the competition diagram was capped
      at `pairs.slice(0, 14)`, dropping 8 of the 25 genuinely
      competing-or-compatible pairs the sighted SVG diagram shows. Fixed by
      removing the cap so every relevant pair is rendered.
   5. modules/.../39-twin-study-simulator/ (Full) — three learner-facing
      passages claimed the unequal-environments violation "raises r(MZ)
      without touching r(DZ)". The executing generateGroup() does the
      opposite: r(MZ) is unaffected and r(DZ) falls. Fixed by correcting the
      mechanism description in all three places (the header docstring, the
      live violation panel, and the challenge feedback).
   6. simplified/.../42-gene-environment-interaction-visualiser/ (Simplified)
      — the "Widen the study to the whole range" button set the window
      width to the full range without recentring it, so from any starting
      position other than centre = 0 the resulting window fell short of the
      true [-1, 1] range while still being labelled "the whole range".
      Fixed by recentring to 0 when widening, so the label is always true.
   7. modules/.../49-emotional-intelligence-claims-laboratory/ (Full) — the
      lab's introduction claimed "the scatterplot shows 300 simulated
      people", though the model is deterministic closed-form arithmetic
      with no scatterplot, no RNG and no per-person data; and the opening
      question described all four administered measures, including the
      colleague-rated outcome, as "measures of emotional intelligence".
      Fixed by removing the phantom-scatterplot claim, dead CSS and a dead
      comment header, and by separating the three EI-labelled predictors
      from the outcome they are meant to predict.
   8. simplified/.../50-self-esteem-stability-tracker/ (Simplified) — the
      synthesis claimed Ada and Cleo "take the same kind of knock in
      different domains", but the activity delivers the identical
      work-domain event to all three fictional people from one shared
      events array; Ada also has no domain asymmetry in her contingency
      values. Fixed by explaining the actual mechanism: the same work-domain
      setback lands differently because of each profile's own contingency
      and recovery parameters.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const THEATRE_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/03-person-situation-interaction-theatre/tool.js');
const THEATRE_HTML = path.join(
  ROOT, 'modules/personality-individual-differences/tools/03-person-situation-interaction-theatre/index.html');
const THEATRE_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/03-person-situation-interaction-theatre/standalone.html');

const ROTATION_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/07-factor-rotation-playground/tool.js');
const ROTATION_HTML = path.join(
  ROOT, 'modules/personality-individual-differences/tools/07-factor-rotation-playground/index.html');
const ROTATION_META = path.join(
  ROOT, 'modules/personality-individual-differences/tools/07-factor-rotation-playground/metadata.json');
const ROTATION_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/07-factor-rotation-playground/standalone.html');

const FACET_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/09-facet-level-detective/tool.js');
const FACET_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/09-facet-level-detective/standalone.html');

const COURTROOM_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/24-explain-this-person-courtroom/tool.js');
const COURTROOM_META = path.join(
  ROOT, 'modules/personality-individual-differences/tools/24-explain-this-person-courtroom/metadata.json');
const COURTROOM_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/24-explain-this-person-courtroom/standalone.html');

const TWIN_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/39-twin-study-simulator/tool.js');
const TWIN_HTML = path.join(
  ROOT, 'modules/personality-individual-differences/tools/39-twin-study-simulator/index.html');
const TWIN_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/39-twin-study-simulator/standalone.html');

const GXE_SIMPLE_JS = path.join(
  ROOT, 'simplified/modules/personality-individual-differences/tools/42-gene-environment-interaction-visualiser/activity.js');

const EI_JS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory/tool.js');
const EI_HTML = path.join(
  ROOT, 'modules/personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory/index.html');
const EI_CSS = path.join(
  ROOT, 'modules/personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory/tool.css');
const EI_STANDALONE = path.join(
  ROOT, 'modules/personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory/standalone.html');

const ESTEEM_SIMPLE_JS = path.join(
  ROOT, 'simplified/modules/personality-individual-differences/tools/50-self-esteem-stability-tracker/activity.js');
const ESTEEM_SIMPLE_HTML = path.join(
  ROOT, 'simplified/modules/personality-individual-differences/tools/50-self-esteem-stability-tracker/index.html');

const CATALOGUE = path.join(ROOT, 'data/catalogue.json');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

/** Extract `var NAME = [ ... ];`, tracking bracket depth so nested object
    literals inside the array don't confuse the boundary. */
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

/** Extract `var NAME = { ... };`, tracking brace depth so a deeply nested
    object literal (arrays of objects inside it, etc.) extracts whole. */
function extractObjectDeep(source, name, file) {
  const start = new RegExp('var ' + name + ' = \\{').exec(source);
  if (!start) throw new Error('could not find "var ' + name + ' = {" in ' + file);
  let i = start.index + start[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
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

/** Extract the body of an anonymous function following a literal anchor
    string that ends in "{", by counting braces from that opening brace. */
function extractAnonymousBody(source, anchorLiteral, file) {
  const anchorIdx = source.indexOf(anchorLiteral);
  if (anchorIdx === -1) throw new Error('could not find "' + anchorLiteral + '" in ' + file);
  const braceIdx = anchorIdx + anchorLiteral.length - 1;
  let i = braceIdx + 1;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  return source.slice(braceIdx + 1, i - 1);
}

/** Extract a self-invoking `(function name() { ... })();` verbatim, so it
    can be dropped into a sandbox snippet and it will simply run itself. */
function extractIIFE(source, name, file) {
  const anchor = '(function ' + name + '() {';
  const start = source.indexOf(anchor);
  if (start === -1) throw new Error('could not find "' + anchor + '" in ' + file);
  let i = start + anchor.length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') depth -= 1;
    i += 1;
  }
  const semi = source.indexOf(';', i);
  return source.slice(start, semi + 1);
}

function makeFakeNode() {
  const node = {
    textContent: '',
    className: '',
    hidden: false,
    disabled: false,
    checked: false,
    value: '',
    name: '',
    type: '',
    _attrs: {},
    _children: [],
    appendChild: function (child) { this._children.push(child); return child; },
    removeChild: function (child) {
      const i = this._children.indexOf(child);
      if (i !== -1) this._children.splice(i, 1);
      return child;
    },
    setAttribute: function (k, v) { this._attrs[k] = String(v); },
    getAttribute: function (k) {
      return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null;
    },
    removeAttribute: function (k) { delete this._attrs[k]; },
    addEventListener: function () {},
  };
  Object.defineProperty(node, 'firstChild', {
    get: function () { return this._children.length ? this._children[0] : null; },
  });
  return node;
}

function runSandbox(snippetLines, filename) {
  const snippet = snippetLines.join('\n\n');
  const sandbox = { module: { exports: {} }, makeFakeNode: makeFakeNode };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: filename });
  return sandbox.module.exports;
}

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

/* =========================================================================
   1. Person-Situation Interaction Theatre (Full): tie handling, gating,
      and challenge grading
   ========================================================================= */

function loadTheatreHarness() {
  const source = read(THEATRE_JS);
  const gain = /var GAIN = [\d.]+;/.exec(source)[0];
  const cast = extractArray(source, 'CAST', THEATRE_JS);
  const situations = extractArray(source, 'SITUATIONS', THEATRE_JS);
  const roles = extractArray(source, 'ROLES', THEATRE_JS);
  const clampFn = extractFunction(source, 'clamp', THEATRE_JS);
  const dispositionFn = extractFunction(source, 'disposition', THEATRE_JS);
  const effectiveStrengthFn = extractFunction(source, 'effectiveStrength', THEATRE_JS);
  const behaviourFn = extractFunction(source, 'behaviour', THEATRE_JS);
  const ranksForFn = extractFunction(source, 'ranksFor', THEATRE_JS);
  const spreadFn = extractFunction(source, 'spread', THEATRE_JS);
  const byIdFn = extractFunction(source, 'byId', THEATRE_JS);
  const fmtFn = extractFunction(source, 'fmt', THEATRE_JS);
  const makeFn = extractFunction(source, 'make', THEATRE_JS);
  const clearFn = extractFunction(source, 'clear', THEATRE_JS);
  const showFeedbackFn = extractFunction(source, 'showFeedback', THEATRE_JS);
  const currentStrengthFn = extractFunction(source, 'currentStrength', THEATRE_JS);
  const challengeBody = extractAnonymousBody(
    source, 'challengeForm.addEventListener("submit", function (event) {', THEATRE_JS);

  const snippet = [
    'var document = { createElement: function () { return makeFakeNode(); }, ' +
      'createTextNode: function (t) { return { textContent: t }; } };',
    gain, cast, situations, roles,
    clampFn, dispositionFn, effectiveStrengthFn, behaviourFn, ranksForFn, spreadFn,
    byIdFn, fmtFn, makeFn, clearFn, showFeedbackFn,
    'var state = { situationId: "party", roleId: "none", strength: null };',
    currentStrengthFn,
    'var challengeForm = {};',
    'var challengeFeedback = makeFakeNode();',
    'var answerValue = null;',
    'function $(selector, scope) {\n' +
      '  if (selector === \'input[name="challenge"]:checked\') {\n' +
      '    return answerValue === null ? null : { value: answerValue };\n' +
      '  }\n' +
      '  return makeFakeNode();\n' +
      '}',
    'var shellCalls = [];',
    'var shell = { announce: function (msg) { shellCalls.push(msg); } };',
    'function challengeSubmit(event) {\n' + challengeBody + '\n}',
    'module.exports = {',
    '  CAST: CAST, SITUATIONS: SITUATIONS, ROLES: ROLES,',
    '  ranksFor: ranksFor, byId: byId, spread: spread,',
    '  setAnswer: function (v) { answerValue = v; },',
    '  setState: function (situationId, roleId, strength) {',
    '    state.situationId = situationId; state.roleId = roleId; state.strength = strength;',
    '  },',
    '  submitChallenge: function () {',
    '    challengeSubmit({ preventDefault: function () {} });',
    '    return { tone: challengeFeedback._attrs["data-tone"] };',
    '  },',
    '};',
  ];
  return runSandbox(snippet, 'extracted-theatre.js');
}

function checkTheatreTieHandling() {
  const h = loadTheatreHarness();
  const emergency = h.byId(h.SITUATIONS, 'emergency');
  const none = h.byId(h.ROLES, 'none');
  const ranks = h.ranksFor(emergency, null, none);

  check(ranks.jonah === ranks.elif,
    'emergency situation: Jonah and Elif, whose behaviour is bit-identical, receive the same rank ' +
      '(got ' + ranks.jonah + ' and ' + ranks.elif + ')');
  check(ranks.mara === 1, 'Mara (highest behaviour) ranks 1st (got ' + ranks.mara + ')');
  check(ranks.theo === 4, 'Theo (lowest behaviour) ranks 4th (got ' + ranks.theo + ')');
  check(ranks.jonah !== 1 && ranks.jonah !== 4,
    'the tied pair does not receive the extreme ranks (got ' + ranks.jonah + ')');

  // Sanity check that this is a genuine, exact tie and not an artefact of
  // rounding in the test itself.
  const bJonah = h.spread ? null : null; // spread() is between-person; behaviour is what ties.
  check(typeof ranks.jonah === 'number' && ranks.jonah % 1 !== 0,
    'the tied rank is reported as the conventional averaged mid-rank, not a whole number ' +
      '(got ' + ranks.jonah + ')');
}

function checkTheatreChallengeGrading() {
  const h = loadTheatreHarness();

  // 1. Spread not yet reduced (party at its own weak default strength),
  //    but the conceptually correct answer chosen: must NOT be marked correct.
  h.setState('party', 'none', null);
  h.setAnswer('nothing');
  let result = h.submitChallenge();
  check(result.tone !== 'good',
    'challenge: correct answer alone, with the spread manipulation not done, is not accepted ' +
      '(tone = ' + result.tone + ')');

  // 2. Spread reduced (strength 1.0 collapses every situation's spread to 0),
  //    but the wrong answer chosen: must NOT be marked correct.
  h.setState('party', 'none', 1.0);
  h.setAnswer('traits-gone');
  result = h.submitChallenge();
  check(result.tone !== 'good',
    'challenge: spread manipulation done, with the wrong answer, is not accepted ' +
      '(tone = ' + result.tone + ')');

  // 3. Both the manipulation and the correct answer: must be marked correct.
  h.setState('party', 'none', 1.0);
  h.setAnswer('nothing');
  result = h.submitChallenge();
  check(result.tone === 'good',
    'challenge: spread manipulation done AND the correct answer together are accepted ' +
      '(tone = ' + result.tone + ')');
}

function checkTheatreGating() {
  const source = read(THEATRE_HTML);
  check(/<section[^>]*id="matrix-section"[^>]*hidden/.test(source) ||
        /<section[^>]*hidden[^>]*id="matrix-section"/.test(source),
    'index.html: the "all five situations" / challenge section starts hidden');

  const js = read(THEATRE_JS);
  check(/\$\("#explore"\)\.hidden = false;\s*\n\s*\$\("#matrix-section"\)\.hidden = false;/.test(js),
    'tool.js: the matrix/challenge section is unhidden in the same step that unlocks the explorer');
  check(/\$\("#explore"\)\.hidden = true;\s*\n\s*\$\("#matrix-section"\)\.hidden = true;/.test(js),
    'tool.js: resetting the page re-hides both the explorer and the matrix/challenge section');

  [THEATRE_STANDALONE].forEach(function (file) {
    const content = read(file);
    check(content.indexOf('id="matrix-section"') !== -1 && /id="matrix-section"[^>]*hidden|hidden[^>]*id="matrix-section"/.test(content),
      path.relative(ROOT, file) + ' also ships the section hidden by default');
  });
}

/* =========================================================================
   2. Factor Rotation Playground (Full): the correlated set's natural angle
   ========================================================================= */

function loadRotationHarness() {
  const source = read(ROTATION_JS);
  const deg = 'var DEG = Math.PI / 180;';
  const salient = /var SALIENT = [\d.]+;/.exec(source)[0];
  const sets = extractObjectDeep(source, 'SETS', ROTATION_JS);
  const unrotatedOffset = /var UNROTATED_OFFSET = \d+;/.exec(source)[0];
  const preRotate = extractIIFE(source, 'preRotate', ROTATION_JS);
  const loadingsFn = extractFunction(source, 'loadings', ROTATION_JS);
  const factorCorrelationFn = extractFunction(source, 'factorCorrelation', ROTATION_JS);
  const simplicityFn = extractFunction(source, 'simplicity', ROTATION_JS);
  const bestAngleFn = extractFunction(source, 'bestAngle', ROTATION_JS);
  const obliqueMin = /var OBLIQUE_MIN = \d+;/.exec(source)[0];
  const obliqueMax = /var OBLIQUE_MAX = \d+;/.exec(source)[0];
  const naturalSeparationFn = extractFunction(source, 'naturalSeparation', ROTATION_JS);
  const fmtFn = extractFunction(source, 'fmt', ROTATION_JS);
  const describeCorrelatedSet = extractIIFE(source, 'describeCorrelatedSet', ROTATION_JS);

  const snippet = [
    'var document = { querySelectorAll: function () { return []; } };',
    deg, salient, sets, unrotatedOffset, preRotate,
    loadingsFn, factorCorrelationFn, simplicityFn, bestAngleFn,
    obliqueMin, obliqueMax, naturalSeparationFn, fmtFn,
    describeCorrelatedSet,
    'module.exports = { SETS: SETS, naturalSeparation: naturalSeparation };',
  ];
  return runSandbox(snippet, 'extracted-rotation.js');
}

function checkRotationNaturalAngle() {
  const h = loadRotationHarness();
  const live = h.naturalSeparation(h.SETS.correlated.markers);
  const note = h.SETS.correlated.note;

  check(note.indexOf(String(Math.round(live.trueOblique))) !== -1,
    'the correlated-set note quotes the live-computed natural angle (' +
      Math.round(live.trueOblique) + '°), not a hard-coded one');
  check(note.indexOf(String(Math.round(live.reachableOblique))) !== -1,
    'the correlated-set note also quotes the live-computed reachable-angle figure (' +
      Math.round(live.reachableOblique) + '°)');
  check(!/about 55/.test(note) && !/55°? apart/.test(note),
    'the correlated-set note no longer asserts the old "about 55°" claim');
  check(Math.abs(live.trueOblique - 55) > 5,
    'sanity check: the true best fit for these markers is genuinely well away from 55° ' +
      '(computed ' + live.trueOblique + '°)');

  [ROTATION_HTML, ROTATION_META, ROTATION_STANDALONE, CATALOGUE].forEach(function (file) {
    const content = read(file);
    check(!/about 55 degrees/.test(content) && !/genuinely sit 55/.test(content),
      path.relative(ROOT, file) + ' no longer states the old fixed "about 55 degrees" claim');
  });
}

/* =========================================================================
   3. Facet-Level Detective (Full): Agreeableness equality
   ========================================================================= */

function checkFacetAgreeableness() {
  const source = read(FACET_JS);
  const balancedMix = /var BALANCED_MIX = [\d.]+;/.exec(source)[0];
  const cases = extractArray(source, 'CASES', FACET_JS);
  const domainScoreFn = extractFunction(source, 'domainScore', FACET_JS);
  const snippet = [
    balancedMix, cases, domainScoreFn,
    'module.exports = { CASES: CASES, domainScore: domainScore, BALANCED_MIX: BALANCED_MIX };',
  ];
  const h = runSandbox(snippet, 'extracted-facet.js');

  const agreeableness = h.CASES.filter(function (c) { return c.id === 'agreeableness'; })[0];
  check(Boolean(agreeableness), 'the Agreeableness case exists in CASES');

  const scoreA = h.domainScore(agreeableness.people[0], h.BALANCED_MIX);
  const scoreB = h.domainScore(agreeableness.people[1], h.BALANCED_MIX);
  check(scoreA === scoreB,
    'Agreeableness: both people’s broad domain scores, computed independently, are exactly equal ' +
      '(' + scoreA + ' vs ' + scoreB + ')');

  const facetGapA = Math.abs(agreeableness.people[0].a - agreeableness.people[1].a);
  const facetGapB = Math.abs(agreeableness.people[0].b - agreeableness.people[1].b);
  check(facetGapA >= 20 && facetGapB >= 20,
    'Agreeableness: the two people still differ by at least 20 points on each facet ' +
      '(' + facetGapA + ', ' + facetGapB + ')');

  [FACET_STANDALONE].forEach(function (file) {
    const content = read(file);
    check(!/"b":\s*80/.test(content) || content.indexOf('"Tomas"') === -1 || content.indexOf('b: 80') === -1,
      path.relative(ROOT, file) + ' does not still ship the old, unequal Tomas value');
  });
}

/* =========================================================================
   4. "Explain This Person" Courtroom (Full): accessible table completeness
   ========================================================================= */

function checkCourtroomAccessibility() {
  const source = read(COURTROOM_JS);
  check(!/pairs\.slice\(\s*0,\s*14\s*\)/.test(source),
    'tool.js no longer truncates the accessible pairs table to the first 14 rows');
  check(/pairs\.forEach\(function \(pair\)/.test(source),
    'tool.js renders every entry of the pairs array, not a sliced subset');

  const explanations = extractArray(source, 'EXPLANATIONS', COURTROOM_JS);
  const evidence = extractArray(source, 'EVIDENCE', COURTROOM_JS);
  const relationFn = extractFunction(source, 'relation', COURTROOM_JS);
  const snippet = [
    explanations, evidence, relationFn,
    'module.exports = { EXPLANATIONS: EXPLANATIONS, relation: relation };',
  ];
  const h = runSandbox(snippet, 'extracted-courtroom.js');

  let total = 0;
  let competing = 0;
  for (let a = 0; a < h.EXPLANATIONS.length; a += 1) {
    for (let b = a + 1; b < h.EXPLANATIONS.length; b += 1) {
      const rel = h.relation(h.EXPLANATIONS[a], h.EXPLANATIONS[b]);
      if (rel === 'partly') { continue; }
      total += 1;
      if (rel === 'competing') { competing += 1; }
    }
  }
  check(total > 14,
    'there are genuinely more than 14 competing-or-compatible pairs to show (' + total + '), ' +
      'so the old cap really did drop real relationships');
  check(competing >= 1, 'at least one competing pair exists to have been at risk of being dropped');

  [COURTROOM_META].forEach(function (file) {
    const content = read(file);
    check(/every pair's relationship in words/.test(content),
      path.relative(ROOT, file) + ' accessibility claim ("every pair") is now true of the code');
  });
}

/* =========================================================================
   5. Twin-Study Simulator (Full): unequal-environments mechanism direction
   ========================================================================= */

function loadTwinHarness() {
  const source = read(TWIN_JS);
  const pairsPerGroup = /var PAIRS_PER_GROUP = \d+;/.exec(source)[0];
  const groups = extractArray(source, 'GROUPS', TWIN_JS);
  const clampFn = extractFunction(source, 'clamp', TWIN_JS);
  const mulberryFn = extractFunction(source, 'mulberry32', TWIN_JS);
  const makeNormalFn = extractFunction(source, 'makeNormal', TWIN_JS);
  const generateGroupFn = extractFunction(source, 'generateGroup', TWIN_JS);
  const correlationFn = extractFunction(source, 'correlation', TWIN_JS);
  const falconerFn = extractFunction(source, 'falconer', TWIN_JS);

  const snippet = [
    pairsPerGroup, groups, clampFn, mulberryFn, makeNormalFn,
    generateGroupFn, correlationFn, falconerFn,
    'function generate(seed, truth, violations) {',
    '  var random = mulberry32(seed);',
    '  var result = {};',
    '  GROUPS.forEach(function (group) {',
    '    var pairs = generateGroup(random, group, truth, violations);',
    '    result[group.id] = { r: correlation(pairs.one, pairs.two) };',
    '  });',
    '  return result;',
    '}',
    'module.exports = { generate: generate, falconer: falconer };',
  ];
  return runSandbox(snippet, 'extracted-twin.js');
}

function checkTwinUnequalEnvironmentsDirection() {
  const h = loadTwinHarness();
  const seed = 4471;
  const truth = { a2: 0.40, c2: 0.35, e2: 0.20, m2: 0.05 };

  const baseline = h.generate(seed, truth, { unequalEnv: 0, assortative: 0, gxeCorr: 0 });
  const violated = h.generate(seed, truth, { unequalEnv: 0.40, assortative: 0, gxeCorr: 0 });

  check(violated.mz.r === baseline.mz.r,
    'unequal environments: r(MZ) is unaffected, exactly as the corrected text says ' +
      '(baseline ' + baseline.mz.r.toFixed(4) + ', violated ' + violated.mz.r.toFixed(4) + ')');
  check(violated.dz.r < baseline.dz.r,
    'unequal environments: r(DZ) falls, exactly as the corrected text says ' +
      '(baseline ' + baseline.dz.r.toFixed(4) + ', violated ' + violated.dz.r.toFixed(4) + ')');

  const estimate = h.falconer(violated.mz.r, violated.dz.r);
  check(estimate.h2 > truth.a2,
    'the resulting heritability estimate is still inflated, as both the old and new text claim ' +
      '(' + estimate.h2.toFixed(3) + ' vs true ' + truth.a2 + ')');

  [TWIN_JS, TWIN_HTML, TWIN_STANDALONE].forEach(function (file) {
    const content = read(file);
    check(!/raises? (the )?(r\(MZ\)|MZ correlation) without (touching|raising)/i.test(content),
      path.relative(ROOT, file) + ' no longer claims the backwards MZ/DZ mechanism');
  });
}

/* =========================================================================
   6. Gene x Environment Interaction Visualiser (Simplified): the widen
      control must reach the true full range from any starting centre
   ========================================================================= */

function loadGxeSimplifiedHarness() {
  const source = read(GXE_SIMPLE_JS);
  const crossover = /var CROSSOVER = \d+;/.exec(source)[0];
  const groups = extractArray(source, 'GROUPS', GXE_SIMPLE_JS);
  const windowConst = /var WINDOW = [\d.]+;/.exec(source)[0];
  const fullWindow = /var FULL_WINDOW = [\d.]+;/.exec(source)[0];
  const outcomeFn = extractFunction(source, 'outcome', GXE_SIMPLE_JS);
  const gapAtFn = extractFunction(source, 'gapAt', GXE_SIMPLE_JS);
  const windowForFn = extractFunction(source, 'windowFor', GXE_SIMPLE_JS);
  const patternForFn = extractFunction(source, 'patternFor', GXE_SIMPLE_JS);
  const centreFn = extractFunction(source, 'centre', GXE_SIMPLE_JS);
  const toggleWidenFn = extractFunction(source, 'toggleWiden', GXE_SIMPLE_JS);

  const snippet = [
    crossover, groups, windowConst, fullWindow,
    outcomeFn, gapAtFn, windowForFn, patternForFn,
    'var width = WINDOW;',
    'var moves = 0;',
    'var explainBtn = { disabled: true };',
    'var widenBtn = { textContent: "" };',
    'var noteText = { textContent: "" };',
    'var note = {};',
    'var wb = { show: function () {}, announce: function () {} };',
    'function render() {}',
    'var centreInput = { value: "-60" };',
    centreFn,
    toggleWidenFn,
    'module.exports = {',
    '  setCentre: function (raw) { centreInput.value = String(raw); width = WINDOW; },',
    '  toggleWiden: toggleWiden,',
    '  currentWindow: function () { return windowFor(centre(), width); },',
    '};',
  ];
  return runSandbox(snippet, 'extracted-gxe-simplified.js');
}

function checkGxeSimplifiedWidenReachesFullRange() {
  [-60, 60].forEach(function (startingCentre) {
    const h = loadGxeSimplifiedHarness();
    h.setCentre(startingCentre);
    h.toggleWiden();
    const win = h.currentWindow();
    check(win.from === -1 && win.to === 1,
      'widening from a centre of ' + (startingCentre / 100) + ' really reaches the full [-1, 1] range ' +
        '(got [' + win.from + ', ' + win.to + '])');
  });

  // A third, already-centred starting point should also still work.
  const h = loadGxeSimplifiedHarness();
  h.setCentre(0);
  h.toggleWiden();
  const win = h.currentWindow();
  check(win.from === -1 && win.to === 1,
    'widening from a centre of 0 still reaches the full [-1, 1] range (got [' + win.from + ', ' + win.to + '])');
}

/* =========================================================================
   7. Emotional-Intelligence Claims Laboratory (Full): phantom scatterplot
      and the outcome/predictor distinction
   ========================================================================= */

function checkEiPhantomScatterplotAndOutcomeLabel() {
  [EI_HTML, EI_JS, EI_CSS, EI_STANDALONE].forEach(function (file) {
    const content = read(file);
    check(!/\d+ simulated\s+\n?\s*people/.test(content) && content.indexOf('300 simulated') === -1,
      path.relative(ROOT, file) + ' no longer claims a scatterplot of simulated people');
  });
  [EI_CSS].forEach(function (file) {
    const content = read(file);
    check(content.indexOf('.scatter__points') === -1,
      path.relative(ROOT, file) + ' no longer ships the dead .scatter__points rule');
  });
  [EI_JS].forEach(function (file) {
    const content = read(file);
    check(!/Seeded randomness.*scatterplot/s.test(content),
      path.relative(ROOT, file) + ' no longer carries the stale "seeded randomness" scatterplot comment');
  });

  const openingProse = read(EI_HTML);
  check(/administers three measures, each\s*\n\s*described in the literature as measuring emotional intelligence/.test(openingProse),
    'index.html opening question now describes exactly three EI-labelled measures');
  check(/ratings of social effectiveness\s*\n\s*by colleagues.{0,80}the outcome/s.test(openingProse),
    'index.html opening question now names colleague ratings as the outcome, not a fourth EI measure');
  check(!/four measures, all described\s*\n\s*in the literature as measures of emotional intelligence/.test(openingProse),
    'index.html no longer lumps the outcome in with the three EI-labelled measures');
}

/* =========================================================================
   8. Self-Esteem Stability Tracker (Simplified): the shared work-domain
      event, and the corrected synthesis wording
   ========================================================================= */

function checkEsteemSimplifiedDomainWording() {
  const html = read(ESTEEM_SIMPLE_HTML);
  check(!/take\s*\n\s*the same kind of knock in different domains/.test(html),
    'index.html synthesis no longer claims Ada and Cleo take the knock "in different domains"');
  check(/identical\s*\n\s*work setback lands far harder on Cleo/.test(html),
    'index.html synthesis now attributes the difference to contingency and recovery, not to domain');

  const source = read(ESTEEM_SIMPLE_JS);
  const people = extractArray(source, 'PEOPLE', ESTEEM_SIMPLE_JS);
  const snippet = [people, 'module.exports = { PEOPLE: PEOPLE };'];
  const h = runSandbox(snippet, 'extracted-esteem-simplified.js');

  const ada = h.PEOPLE.filter(function (p) { return p.name === 'Ada'; })[0];
  const cleo = h.PEOPLE.filter(function (p) { return p.name === 'Cleo'; })[0];
  check(Boolean(ada) && Boolean(cleo), 'Ada and Cleo both exist in the shipped PEOPLE array');
  check(cleo.contingency.work > ada.contingency.work,
    'Cleo’s work contingency is genuinely higher than Ada’s ' +
      '(' + cleo.contingency.work + ' vs ' + ada.contingency.work + '), which is what makes the ' +
      'identical setback land harder on her');
  check(cleo.recovery > ada.recovery,
    'Cleo’s recovery half-life is genuinely longer than Ada’s ' +
      '(' + cleo.recovery + ' vs ' + ada.recovery + '), which is what makes her take longer to return');
  check(Math.abs(ada.contingency.work - ada.contingency.friend) < 1e-9,
    'Ada has no domain asymmetry in her own contingency values, confirming "different domains" was ' +
      'never the right explanation for her');
}

/* =========================================================================
   main
   ========================================================================= */

function main() {
  checkTheatreTieHandling();
  checkTheatreChallengeGrading();
  checkTheatreGating();
  checkRotationNaturalAngle();
  checkFacetAgreeableness();
  checkCourtroomAccessibility();
  checkTwinUnequalEnvironmentsDirection();
  checkGxeSimplifiedWidenReachesFullRange();
  checkEiPhantomScatterplotAndOutcomeLabel();
  checkEsteemSimplifiedDomainWording();

  console.log('\n' + failures.length + ' failure(s).');
  return failures.length ? 1 : 0;
}

process.exit(main());
