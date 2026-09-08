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
  const spearmanFn = extractFunction(source, 'spearman', THEATRE_JS);
  const spreadFn = extractFunction(source, 'spread', THEATRE_JS);
  const consistencyFn = extractFunction(source, 'consistency', THEATRE_JS);
  const byIdFn = extractFunction(source, 'byId', THEATRE_JS);
  const fmtFn = extractFunction(source, 'fmt', THEATRE_JS);
  const makeFn = extractFunction(source, 'make', THEATRE_JS);
  const clearFn = extractFunction(source, 'clear', THEATRE_JS);
  const showFeedbackFn = extractFunction(source, 'showFeedback', THEATRE_JS);
  const currentStrengthFn = extractFunction(source, 'currentStrength', THEATRE_JS);
  const renderMatrixFn = extractFunction(source, 'renderMatrix', THEATRE_JS);
  const challengeBody = extractAnonymousBody(
    source, 'challengeForm.addEventListener("submit", function (event) {', THEATRE_JS);

  const snippet = [
    'var document = { createElement: function () { return makeFakeNode(); }, ' +
      'createTextNode: function (t) { return { textContent: t }; } };',
    gain, cast, situations, roles,
    clampFn, dispositionFn, effectiveStrengthFn, behaviourFn, ranksForFn, spearmanFn,
    spreadFn, consistencyFn,
    byIdFn, fmtFn, makeFn, clearFn, showFeedbackFn,
    'var state = { situationId: "party", roleId: "none", strength: null };',
    currentStrengthFn,
    'var challengeForm = {};',
    'var challengeFeedback = makeFakeNode();',
    'var matrixTable = makeFakeNode();',
    'var matrixNote = makeFakeNode();',
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
    renderMatrixFn,
    'module.exports = {',
    '  CAST: CAST, SITUATIONS: SITUATIONS, ROLES: ROLES,',
    '  ranksFor: ranksFor, byId: byId, spread: spread,',
    '  spearman: spearman, consistency: consistency,',
    '  setAnswer: function (v) { answerValue = v; },',
    '  setState: function (situationId, roleId, strength) {',
    '    state.situationId = situationId; state.roleId = roleId; state.strength = strength;',
    '  },',
    '  submitChallenge: function () {',
    '    challengeSubmit({ preventDefault: function () {} });',
    '    return { tone: challengeFeedback._attrs["data-tone"] };',
    '  },',
    '  renderMatrixAt: function (strength, roleId) {',
    '    renderMatrix(strength, byId(ROLES, roleId || "none"));',
    '    return matrixNote.textContent;',
    '  },',
    '};',
  ];
  return runSandbox(snippet, 'extracted-theatre.js');
}

function checkTheatreTieHandling() {
  const h = loadTheatreHarness();
  const emergency = h.byId(h.SITUATIONS, 'emergency');
  const party = h.byId(h.SITUATIONS, 'party');
  const none = h.byId(h.ROLES, 'none');
  const ranks = h.ranksFor(emergency, null, none);

  check(ranks.jonah === ranks.elif,
    'emergency situation: Jonah and Elif, whose behaviour is bit-identical, receive the same rank ' +
      '(got ' + ranks.jonah + ' and ' + ranks.elif + ')');
  check(ranks.mara === 1, 'Mara (highest behaviour) ranks 1st (got ' + ranks.mara + ')');
  check(ranks.theo === 4, 'Theo (lowest behaviour) ranks 4th (got ' + ranks.theo + ')');
  check(ranks.jonah !== 1 && ranks.jonah !== 4,
    'the tied pair does not receive the extreme ranks (got ' + ranks.jonah + ')');

  check(typeof ranks.jonah === 'number' && ranks.jonah % 1 !== 0,
    'the tied rank is reported as the conventional averaged mid-rank, not a whole number ' +
      '(got ' + ranks.jonah + ')');

  // The Spearman shortcut 1 - 6*sum(d^2)/(n(n^2-1)) is only exact without
  // ties; with the shipped emergency tie in play, rho must be the Pearson
  // correlation of the (mid-)rank vectors, which independently comes to
  // 0.632455532... for party vs. emergency, not the shortcut's 0.65.
  const partyRanks = h.ranksFor(party, null, none);
  const rhoPartyEmergency = h.spearman(partyRanks, ranks);
  check(rhoPartyEmergency !== null &&
      Math.abs(rhoPartyEmergency - 0.6324555320336759) < 1e-9,
    'party vs. emergency Spearman rho, computed on the real shipped ranks, is the tie-correct ' +
      '0.632455532... rather than the untied shortcut\'s 0.65 (got ' +
      rhoPartyEmergency + ')');
  check(Math.abs(rhoPartyEmergency - 0.65) > 1e-6,
    'the old untied-shortcut value of 0.65 is not what production now reports');

  // Another genuinely tied comparison: emergency against itself is a
  // perfect (defined) correlation of 1, exercising the tie-aware formula
  // on both sides of the pair at once.
  const rhoEmergencySelf = h.spearman(ranks, ranks);
  check(rhoEmergencySelf !== null && Math.abs(rhoEmergencySelf - 1) < 1e-9,
    'emergency ranks correlated with themselves (tie included on both sides) give a defined rho of 1 ' +
      '(got ' + rhoEmergencySelf + ')');
}

function checkTheatreDegenerateAllTied() {
  const h = loadTheatreHarness();

  // At maximum situation strength every character's behaviour collapses to
  // an exact four-way tie in every situation, so no pairwise rank
  // correlation is defined and consistency() must not silently report 1.
  const none = h.byId(h.ROLES, 'none');
  const emergency = h.byId(h.SITUATIONS, 'emergency');
  const maxRanks = h.ranksFor(emergency, 1, none);
  check(Object.keys(maxRanks).every(function (id) { return maxRanks[id] === 2.5; }),
    'sanity check: at maximum strength, every character in a situation shares the same mid-rank ' +
      '(got ' + JSON.stringify(maxRanks) + ')');

  const selfRho = h.spearman(maxRanks, maxRanks);
  check(selfRho === null,
    'spearman() between two fully-tied (zero-variance) rank vectors is undefined (null), not 1 ' +
      '(got ' + selfRho + ')');

  const overallConsistency = h.consistency(1, none);
  check(overallConsistency === null,
    'consistency() at maximum strength, where every situation ties everyone, is undefined (null) ' +
      'rather than defaulting to a numeric value such as 1 (got ' + overallConsistency + ')');

  // Production-render check: drive the real renderMatrix() at maximum
  // strength and confirm the learner-facing note explicitly says
  // consistency is undefined, and never claims "High" consistency for a
  // state where no between-person ordering survives.
  const noteAtMax = h.renderMatrixAt(1, 'none');
  check(/not defined/i.test(noteAtMax),
    'renderMatrix(): the learner-facing matrix note at maximum strength says consistency is not ' +
      'defined (got "' + noteAtMax + '")');
  check(!/high/i.test(noteAtMax),
    'renderMatrix(): the all-tied state is never described as "High" consistency (got "' +
      noteAtMax + '")');
  check(noteAtMax.indexOf('1.00') === -1,
    'renderMatrix(): the all-tied state does not report a numeric rho of 1.00 (got "' +
      noteAtMax + '")');

  // Sanity check the render path still reports an ordinary numeric verdict
  // away from the degenerate case, so the null branch above is additive
  // rather than having disabled the normal reading.
  const noteAtDefault = h.renderMatrixAt(null, 'none');
  check(/Mean rank correlation/.test(noteAtDefault) && !/not defined/i.test(noteAtDefault),
    'renderMatrix(): away from maximum strength, the ordinary numeric verdict still renders ' +
      '(got "' + noteAtDefault + '")');
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

/** Independently computes the simplicity optimum for a marker set, from
    first principles, without calling or importing any of tool.js's own
    loadings()/simplicity()/bestAngle()/naturalSeparation() functions. This
    exists so the check below validates that production actually found the
    right answer, rather than only checking that production's prose agrees
    with production's own arithmetic (which would pass even if
    naturalSeparation() itself were wrong).

    Two oblique angles that sum to 180 always describe the same physical
    pair of axes (the second axis merely points the other way), so they are
    mathematically guaranteed to score identically; this oracle reports the
    conventional acute (<=90 degree) member of that pair, exactly as
    production's naturalSeparation() is now expected to. */
function independentNaturalSeparation(markers) {
  const RAD = Math.PI / 180;
  function loadingsOf(marker, angle, obliqueAngle) {
    const a = angle * RAD;
    const b = (angle + obliqueAngle) * RAD;
    return {
      one: marker.x * Math.cos(a) + marker.y * Math.sin(a),
      two: marker.x * Math.cos(b) + marker.y * Math.sin(b),
    };
  }
  function simplicityOf(markerList, angle, obliqueAngle) {
    let total = 0;
    markerList.forEach(function (marker) {
      const l = loadingsOf(marker, angle, obliqueAngle);
      const a = l.one * l.one;
      const b = l.two * l.two;
      const sum = a + b;
      if (sum < 1e-9) { return; }
      const p = Math.max(a, b) / sum;
      total += (p - 0.5) * 2;
    });
    return total / markerList.length;
  }
  function bestScoreForOblique(markerList, obliqueAngle) {
    let bestScore = -Infinity;
    for (let angle = 0; angle < 180; angle += 0.5) {
      const score = simplicityOf(markerList, angle, obliqueAngle);
      if (score > bestScore) { bestScore = score; }
    }
    return bestScore;
  }
  let best = null;
  let bestScore = -Infinity;
  for (let oblique = 5; oblique <= 175; oblique += 0.5) {
    const score = bestScoreForOblique(markers, oblique);
    if (score > bestScore) { bestScore = score; best = oblique; }
  }
  if (best > 90) { best = 180 - best; }
  return { oblique: best, correlation: Math.cos(best * RAD), score: bestScore };
}

function checkRotationNaturalAngle() {
  const h = loadRotationHarness();
  const live = h.naturalSeparation(h.SETS.correlated.markers);
  const note = h.SETS.correlated.note;

  // Independent oracle, computed with fresh test-side code (not production's
  // own naturalSeparation()) over the actual shipped, post-preRotate marker
  // coordinates, so this genuinely checks that production found the right
  // answer rather than merely echoing whatever production itself computed.
  const independent = independentNaturalSeparation(h.SETS.correlated.markers);
  check(independent.oblique >= 33 && independent.oblique <= 41,
    'independent oracle: the correlated set\'s true simplicity optimum, computed from scratch, ' +
      'falls in the already-reviewed neighbourhood of roughly 36-38 degrees (got ' +
      independent.oblique + '°)');
  check(independent.correlation > 0.75 && independent.correlation < 0.85,
    'independent oracle: the implied factor correlation at that optimum is in the reviewed ' +
      'neighbourhood of roughly 0.79-0.81 (got ' + independent.correlation.toFixed(3) + ')');
  check(Math.abs(live.trueOblique - independent.oblique) <= 0.5,
    'production naturalSeparation().trueOblique agrees with the independent oracle within the ' +
      '0.5-degree sweep resolution (production ' + live.trueOblique + '°, independent ' +
      independent.oblique + '°)');

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

  // The learner-facing value (the debrief prose's [data-natural-angle]
  // figure, populated from the same live computation) must also agree with
  // the independent result, not just with production's own self-report.
  const debriefHtml = read(ROTATION_HTML);
  const spanMatch = /data-natural-angle>(\d+)</.exec(debriefHtml);
  check(Boolean(spanMatch),
    'index.html carries a [data-natural-angle] placeholder for the debrief prose to populate');
  if (spanMatch) {
    check(Math.abs(Number(spanMatch[1]) - independent.oblique) <= 1,
      'the learner-facing debrief figure agrees with the independent oracle within 1 degree ' +
        '(placeholder ' + spanMatch[1] + '°, independent ' + independent.oblique + '°)');
  }

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

/** Loads the real buildVerdict() plus everything it calls, with a fake DOM,
    so the fail-safe branch can be exercised directly rather than assumed
    from reading the source. */
function loadFacetVerdictHarness() {
  const source = read(FACET_JS);
  const balancedMix = /var BALANCED_MIX = [\d.]+;/.exec(source)[0];
  const domainScoreFn = extractFunction(source, 'domainScore', FACET_JS);
  const facetTendencyFn = extractFunction(source, 'facetTendency', FACET_JS);
  const domainTendencyFn = extractFunction(source, 'domainTendency', FACET_JS);
  const likelierPersonFn = extractFunction(source, 'likelierPerson', FACET_JS);
  const fmtFn = extractFunction(source, 'fmt', FACET_JS);
  const makeFn = extractFunction(source, 'make', FACET_JS);
  const clearFn = extractFunction(source, 'clear', FACET_JS);
  const buildVerdictFn = extractFunction(source, 'buildVerdict', FACET_JS);

  const snippet = [
    'var document = { createElement: function () { return makeFakeNode(); } };',
    balancedMix,
    domainScoreFn, facetTendencyFn, domainTendencyFn, likelierPersonFn,
    fmtFn, makeFn, clearFn,
    'var verdictBody = makeFakeNode();',
    'var predictionTable = makeFakeNode();',
    'var state = { assignments: {} };',
    buildVerdictFn,
    'module.exports = {',
    // assignmentsMode: "all-correct" fills state.assignments so every
    // observation matches likelierPerson() (right === total); "zero-correct"
    // (or omitted) leaves it empty so nothing can match (right === 0) —
    // exercising both of buildVerdict()\'s lead-paragraph branches, not
    // just the "none matched" one the empty default happens to hit.
    '  renderVerdict: function (theCase, assignmentsMode) {',
    '    state.assignments = {};',
    '    if (assignmentsMode === "all-correct") {',
    '      theCase.observations.forEach(function (observation) {',
    '        state.assignments[observation.id] = likelierPerson(theCase, observation);',
    '      });',
    '    }',
    '    verdictBody._children.length = 0;',
    '    buildVerdict(theCase);',
    '    return {',
    '      lead: verdictBody._children[0].textContent,',
    '      full: verdictBody._children.map(function (p) { return p.textContent; }).join(" "),',
    '    };',
    '  },',
    '};',
  ];
  return runSandbox(snippet, 'extracted-facet-verdict.js');
}

function checkFacetVerdictFailSafe() {
  const source = read(FACET_JS);
  const balancedMix = /var BALANCED_MIX = [\d.]+;/.exec(source)[0];
  const cases = extractArray(source, 'CASES', FACET_JS);
  const domainScoreFn = extractFunction(source, 'domainScore', FACET_JS);
  const dataHarness = runSandbox([
    balancedMix, cases, domainScoreFn,
    'module.exports = { CASES: CASES };',
  ], 'extracted-facet-cases.js');
  const agreeableness = dataHarness.CASES.filter(function (c) { return c.id === 'agreeableness'; })[0];

  const h = loadFacetVerdictHarness();

  // The shipped, genuinely-equal case: buildVerdict() must still state the
  // scores are equal, in the same words as before, and the lead paragraph's
  // equality-dependent framing must hold in BOTH of its states (all correct
  // and none correct), not just the one the harness happens to default to.
  const equalZero = h.renderVerdict(agreeableness, 'zero-correct');
  check(/blind to the difference by construction/.test(equalZero.full),
    'buildVerdict(): the shipped, genuinely-equal Agreeableness case still states the two scores ' +
      'are equal by construction');
  check(!/not the equal broad score/.test(equalZero.full),
    'buildVerdict(): the equal-case sentence does not also show the fail-safe unequal wording');
  check(/gave you nothing to go on/.test(equalZero.lead),
    'buildVerdict(): equal case, zero correct — lead paragraph gives the "broad score gave you ' +
      'nothing to go on" reasoning, which is only true because the scores are equal ' +
      '(got: "' + equalZero.lead + '")');

  const equalAll = h.renderVerdict(agreeableness, 'all-correct');
  check(/whose broad .* scores are identical/.test(equalAll.lead),
    'buildVerdict(): equal case, all correct — lead paragraph states the two broad scores are ' +
      'identical (got: "' + equalAll.lead + '")');

  // Defence-in-depth: if the case data were ever edited so the two scores
  // stopped matching, buildVerdict() must show both real numbers and must
  // NOT keep asserting equality anywhere, including the lead paragraph, and
  // regardless of how many observations happen to be answered correctly.
  // This is not permission to ship unequal data (see checkFacetAgreeableness
  // above, which still requires the shipped case to be exactly equal) — it
  // is a guard against the display silently lying if that ever regresses.
  const brokenCase = JSON.parse(JSON.stringify(agreeableness));
  brokenCase.people[1].b += 1; // deliberately break the equality

  const brokenZero = h.renderVerdict(brokenCase, 'zero-correct');
  check(!/blind to the difference by construction/.test(brokenZero.full),
    'buildVerdict(): with a deliberately broken (unequal) case, it no longer claims the scores are ' +
      'equal by construction');
  check(/not the equal broad score/.test(brokenZero.full),
    'buildVerdict(): with a deliberately broken case, it states both real, unequal scores instead ' +
      '(got: "' + brokenZero.full + '")');
  check(!/two domain-score columns are identical/.test(brokenZero.full),
    'buildVerdict(): with a deliberately broken case, the second paragraph also stops claiming the ' +
      'domain-score columns are identical (got: "' + brokenZero.full + '")');
  check(!/gave you nothing to go on/.test(brokenZero.lead) &&
      !/whose broad .* scores are identical/.test(brokenZero.lead),
    'buildVerdict(): broken case, zero correct — the lead paragraph does not use either ' +
      'equality-dependent claim (got: "' + brokenZero.lead + '")');

  const brokenAll = h.renderVerdict(brokenCase, 'all-correct');
  check(/^All \d+ correct\.$/.test(brokenAll.lead.trim()),
    'buildVerdict(): broken case, all correct — the lead paragraph reports the plain count with ' +
      'no equality claim attached (got: "' + brokenAll.lead + '")');
  check(!/blind to the difference by construction/.test(brokenAll.full) &&
      !/two domain-score columns are identical/.test(brokenAll.full),
    'buildVerdict(): broken case, all correct — no paragraph anywhere claims the scores are equal ' +
      '(got: "' + brokenAll.full + '")');
}

/* =========================================================================
   4. "Explain This Person" Courtroom (Full): accessible table completeness
   ========================================================================= */

/** Loads the real renderDiagram() plus everything it calls, with a fake
    SVG/DOM, so the number of rows the accessible table actually renders can
    be counted directly rather than inferred from source-text patterns. */
function loadCourtroomDiagramHarness() {
  const source = read(COURTROOM_JS);
  const explanations = extractArray(source, 'EXPLANATIONS', COURTROOM_JS);
  const evidence = extractArray(source, 'EVIDENCE', COURTROOM_JS);
  const byIdFn = extractFunction(source, 'byId', COURTROOM_JS);
  const makeFn = extractFunction(source, 'make', COURTROOM_JS);
  const clearFn = extractFunction(source, 'clear', COURTROOM_JS);
  const standingFn = extractFunction(source, 'standing', COURTROOM_JS);
  const relationFn = extractFunction(source, 'relation', COURTROOM_JS);
  const renderDiagramFn = extractFunction(source, 'renderDiagram', COURTROOM_JS);

  const snippet = [
    'var document = {\n' +
      '  createElementNS: function () { return makeFakeNode(); },\n' +
      '  createElement: function () { return makeFakeNode(); },\n' +
      '};',
    explanations, evidence,
    byIdFn, makeFn, clearFn, standingFn, relationFn,
    'var diagramSvg = makeFakeNode();',
    'var diagramTable = makeFakeNode();',
    'var state = { requested: [] };',
    renderDiagramFn,
    'module.exports = {',
    '  EXPLANATIONS: EXPLANATIONS, EVIDENCE: EVIDENCE, relation: relation,',
    '  renderAndCountRows: function () {',
    '    renderDiagram();',
    '    return diagramTable._children.length;',
    '  },',
    '};',
  ];
  return runSandbox(snippet, 'extracted-courtroom-diagram.js');
}

function checkCourtroomAccessibility() {
  const source = read(COURTROOM_JS);
  check(!/pairs\.slice\(\s*0,\s*14\s*\)/.test(source),
    'tool.js no longer truncates the accessible pairs table to the first 14 rows');
  check(/pairs\.forEach\(function \(pair\)/.test(source),
    'tool.js renders every entry of the pairs array, not a sliced subset');
  check(!/if \(rel === "partly"\) \{ continue; \}/.test(source),
    'tool.js no longer skips "partly" relationships when building the accessible pairs table');

  const h = loadCourtroomDiagramHarness();
  const n = h.EXPLANATIONS.length;
  const expectedTotal = (n * (n - 1)) / 2;

  let total = 0;
  let competing = 0;
  let compatible = 0;
  let partly = 0;
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      const rel = h.relation(h.EXPLANATIONS[a], h.EXPLANATIONS[b]);
      total += 1;
      if (rel === 'competing') { competing += 1; }
      else if (rel === 'compatible') { compatible += 1; }
      else { partly += 1; }
    }
  }
  check(total === expectedTotal,
    'independent count: there are exactly ' + expectedTotal + ' unordered pairs among the ' +
      n + ' shipped explanations (got ' + total + ')');
  check(competing >= 1, 'at least one competing pair exists to have been at risk of being dropped');
  check(partly >= 1,
    'the shipped explanations genuinely include at least one "partly" relationship, so ' +
      'excluding that category was a real, not hypothetical, omission (got ' + partly + ')');

  // Production-render check: drive the REAL renderDiagram() with a fake DOM
  // and count how many table rows it actually appends. This must equal
  // every unordered pair, including the "partly" ones, independently of
  // the pair count computed above.
  const renderedRows = h.renderAndCountRows();
  check(renderedRows === expectedTotal,
    'renderDiagram(): the accessible table actually renders all ' + expectedTotal +
      ' unordered pairs (including "partly" relationships), not just the competing/compatible ' +
      'ones (got ' + renderedRows + ' rows)');
  check(renderedRows === total,
    'renderDiagram()\'s rendered row count matches the independently computed pair count ' +
      '(rendered ' + renderedRows + ', independent ' + total + ')');

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
  checkTheatreDegenerateAllTied();
  checkTheatreChallengeGrading();
  checkTheatreGating();
  checkRotationNaturalAngle();
  checkFacetAgreeableness();
  checkFacetVerdictFailSafe();
  checkCourtroomAccessibility();
  checkTwinUnequalEnvironmentsDirection();
  checkGxeSimplifiedWidenReachesFullRange();
  checkEiPhantomScatterplotAndOutcomeLabel();
  checkEsteemSimplifiedDomainWording();

  console.log('\n' + failures.length + ' failure(s).');
  return failures.length ? 1 : 0;
}

process.exit(main());
