#!/usr/bin/env node
/* =========================================================================
   Regression test: four Social and Critical Psychology learner-facing
   defects, plus the related stale Full Tool 12 metadata
   -------------------------------------------------------------------------
       node scripts/test-social-critical-live-qa.js

   These defects were found while drafting the Social and Critical
   Psychology teaching guides and are fixed together in this branch:

   1. modules/social-critical-psychology/tools/05-self-through-different-lenses/
      claimed, in several places, that six of the seven frameworks have no
      concept for the fee-rise/hours-cut statement and only the seventh can
      reach it indirectly. The tool's own `LENSES[*].coding[8]` data instead
      gives: no framework central, five with no concept, and two ("possible
      selves" and "relational") reaching it only indirectly.
   2. modules/social-critical-psychology/tools/06-discourse-subject-position-lab/
      claimed, in several places, that none of the five accounts mentions
      the halved programme hours. The advocacy bulletin's own text mentions
      it; the other four genres have no field for it.
   3. modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/
      tool.js contained stale three-round state logic (`answers.length ===
      3`, `answers[2]`, `round === 2` as the final-round check) left over
      from an earlier three-round design, even though `ROUND_TITLES` and
      `ROUND_FEEDBACK` had already been reduced to two rounds. A learner
      completing round 2 advanced to a nonexistent round index 2, which
      produced an "undefined" round heading and then crashed on
      `ROUND_FEEDBACK[2]` before the closing summary could render.
   4. simplified/modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/
      told learners the comparison team's exhaustion score (38) is "less
      than half" the reference team's (74). Half of 74 is 37, so 38 is
      slightly more than half.

   This test extracts and runs the actual data (LENSES, the advocacy
   account) and the actual Experiment 1 state-machine functions (renderExp1,
   renderTrail, renderRoundFeedback, visibleEvidence, the commit-button
   click handler) from the real modules/.../12-.../tool.js via a minimal
   fake DOM, rather than duplicating the intended two-round arithmetic here.
   It also does plain string checks against the repository files, including
   the generated standalone.html exports and data/catalogue.json, for every
   stale phrase and for the specific stale code patterns named above.
   ========================================================================= */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const LENSES_JS = path.join(
  ROOT, 'modules/social-critical-psychology/tools/05-self-through-different-lenses/tool.js');
const LENSES_HTML = path.join(
  ROOT, 'modules/social-critical-psychology/tools/05-self-through-different-lenses/index.html');
const LENSES_STANDALONE = path.join(
  ROOT, 'modules/social-critical-psychology/tools/05-self-through-different-lenses/standalone.html');
const LENSES_META = path.join(
  ROOT, 'modules/social-critical-psychology/tools/05-self-through-different-lenses/metadata.json');
const LENSES_README = path.join(
  ROOT, 'modules/social-critical-psychology/tools/README.md');

const DISCOURSE_JS = path.join(
  ROOT, 'modules/social-critical-psychology/tools/06-discourse-subject-position-lab/tool.js');
const DISCOURSE_HTML = path.join(
  ROOT, 'modules/social-critical-psychology/tools/06-discourse-subject-position-lab/index.html');
const DISCOURSE_STANDALONE = path.join(
  ROOT, 'modules/social-critical-psychology/tools/06-discourse-subject-position-lab/standalone.html');
const DISCOURSE_CSS = path.join(
  ROOT, 'modules/social-critical-psychology/tools/06-discourse-subject-position-lab/tool.css');
const DISCOURSE_META = path.join(
  ROOT, 'modules/social-critical-psychology/tools/06-discourse-subject-position-lab/metadata.json');

const FULL12_JS = path.join(
  ROOT, 'modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/tool.js');
const FULL12_HTML = path.join(
  ROOT, 'modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/index.html');
const FULL12_STANDALONE = path.join(
  ROOT, 'modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/standalone.html');
const FULL12_META = path.join(
  ROOT, 'modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/metadata.json');

const SIMPLE12_HTML = path.join(
  ROOT, 'simplified/modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/index.html');
const SIMPLE12_JS = path.join(
  ROOT, 'simplified/modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/activity.js');
const SIMPLE12_META = path.join(
  ROOT, 'simplified/modules/social-critical-psychology/tools/12-person-or-setting-workplace-lab/metadata.json');

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

/** Extract `var NAME = { ... };` (a single, non-nested object literal). */
function extractObjectStatement(source, name, file) {
  const re = new RegExp('var ' + name + ' = \\{[^{}]*\\};');
  const match = re.exec(source);
  if (!match) throw new Error('could not find "var ' + name + ' = {...};" in ' + file);
  return match[0];
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

const failures = [];
function check(condition, message) {
  console.log((condition ? 'ok   ' : 'FAIL ') + message);
  if (!condition) failures.push(message);
}

/* =========================================================================
   1. Self Through Different Lenses (Full): statement-8 framework count
   ========================================================================= */

function loadLenses() {
  const source = read(LENSES_JS);
  const snippet = [
    extractArray(source, 'LENSES', LENSES_JS),
    'module.exports = { LENSES: LENSES };',
  ].join('\n\n');
  const sandbox = { module: { exports: {} } };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: 'extracted-lenses.js' });
  return sandbox.module.exports.LENSES;
}

function checkLenses() {
  const lenses = loadLenses();
  check(lenses.length === 7, 'LENSES has seven frameworks (got ' + lenses.length + ')');

  const codes = lenses.map(function (l) { return { id: l.id, code: l.coding[8] }; });
  const central = codes.filter(function (c) { return c.code === 'c'; });
  const usable = codes.filter(function (c) { return c.code === 'u'; });
  const none = codes.filter(function (c) { return c.code === 'n'; });

  check(central.length === 0,
    'statement 8 is central to zero frameworks (got ' + central.length + ')');
  check(none.length === 5,
    'statement 8 has "no concept" in five frameworks (got ' + none.length + ')');
  check(usable.length === 2,
    'statement 8 is usable indirectly in two frameworks (got ' + usable.length + ')');
  const usableIds = usable.map(function (c) { return c.id; }).sort();
  check(usableIds.length === 2 && usableIds[0] === 'possible' && usableIds[1] === 'relational',
    'the two indirect frameworks are "possible" and "relational" (got ' + usableIds.join(', ') + ')');

  [LENSES_JS, LENSES_HTML, LENSES_STANDALONE, LENSES_META, LENSES_README, CATALOGUE].forEach(function (file) {
    const content = read(file);
    check(!/six of the seven/i.test(content),
      path.relative(ROOT, file) + ' does not claim "six of the seven"');
    // "almost none of them can use" is the corrected wording and is fine;
    // only the unqualified false claim is checked for.
    check(!/(?<!almost )none of them can use/i.test(content),
      path.relative(ROOT, file) + ' does not claim (the unqualified) "none of them can use"');
  });
  check(/five of the seven/i.test(read(LENSES_JS)) || /five frameworks/i.test(read(LENSES_JS)),
    'tool.js states the corrected five-frameworks figure somewhere');
}

/* =========================================================================
   2. Discourse and Subject Position Lab (Full): the hours-reduction claim
   -------------------------------------------------------------------------
   Two successive bugs affected the same fact. The first ("none of the five
   accounts mentions the hours reduction") was fixed in an earlier pass by
   saying only the advocacy bulletin mentions it. That replacement was
   itself too strong: the commissioning report's own text ("Reduced-hours
   model implemented on schedule and within budget") does acknowledge the
   reduction, just recoded as implementation performance rather than named
   as the council's decision. The real distinction is three-way: advocacy
   states it outright, the commissioning report abstracts it, and the
   remaining three genres (case note, risk register, recovery summary) omit
   it entirely. This section checks for that three-way distinction directly
   and guards against both the original and the intermediate overclaim.
   ========================================================================= */

function checkDiscourse() {
  const source = read(DISCOURSE_JS);
  // The advocacy and commissioning accounts' own text are plain string
  // properties; check them directly against the source rather than
  // requiring a full ACCOUNTS extraction, since ACCOUNTS mixes string and
  // function values.
  const advocacyMatch = /advocacy[\s\S]{0,400}?halved the hours/i.exec(source);
  check(Boolean(advocacyMatch),
    'tool.js\'s advocacy account text explicitly states the hours were halved');

  const commissioningMatch = /market[\s\S]{0,200}?Reduced-hours model/.exec(source);
  check(Boolean(commissioningMatch),
    'tool.js\'s commissioning report ("market") account text contains ' +
    '"Reduced-hours model"');

  [DISCOURSE_JS, DISCOURSE_HTML, DISCOURSE_STANDALONE, DISCOURSE_CSS, DISCOURSE_META, CATALOGUE]
    .forEach(function (file) {
      const content = read(file);
      const label = path.relative(ROOT, file);
      // The original bug: claiming nobody mentions it at all.
      check(!/none of the five accounts/i.test(content),
        label + ' does not claim "none of the five accounts"');
      check(!/none of them mentions/i.test(content),
        label + ' does not claim "none of them mentions"');
      // The intermediate overclaim: treating the commissioning report as
      // though it were just another genre with no field for the entry.
      check(!/only one of the five accounts/i.test(content),
        label + ' does not claim "only one of the five accounts" (mentions)');
      check(!/the other four (genres|accounts)/i.test(content),
        label + ' does not claim "the other four genres/accounts" lack the entry');
      check(!/appears in only one of the five/i.test(content),
        label + ' does not claim the entry "appears in only one of the five"');
    });

  // The synthesis (and the equivalent static copy) must no longer be able
  // to say the commissioning report has "no field for" the reduction, and
  // must distinguish stating it outright from recoding it.
  check(!/mentionsCut/.test(source),
    'tool.js no longer has a binary "mentionsCut" (advocacy-only) variable');
  check(/reduced-hours model/i.test(source) &&
    /(recodes|recoded|turns the change into|abstracts)/i.test(source),
    'tool.js\'s learner-facing copy names the "reduced-hours model" wording ' +
    'and describes it as a recoding, not an omission');
  check(/case note, (the )?risk register and (the )?recovery summary/i.test(source),
    'tool.js identifies the three genres that actually omit the reduction ' +
    '(case note, risk register, recovery summary)');

  // tool.css's ledger annotation is deliberately a short muted marker, not
  // full prose, so it is checked only for the absence of the overclaim
  // above, not for repeating "reduced-hours model" verbatim.
  [DISCOURSE_HTML, DISCOURSE_META].forEach(function (file) {
    const content = read(file);
    const label = path.relative(ROOT, file);
    check(/reduced-hours model/i.test(content),
      label + ' names the commissioning report\'s "reduced-hours model" wording');
  });

  // data/catalogue.json's Tool 06 entry must match metadata.json exactly.
  const catalogue = JSON.parse(read(CATALOGUE));
  const metaObj = JSON.parse(read(DISCOURSE_META));
  let entry = null;
  catalogue.modules.forEach(function (m) {
    m.tools.forEach(function (t) {
      if (t.moduleSlug === 'social-critical-psychology' &&
          t.toolSlug === '06-discourse-subject-position-lab') {
        entry = t;
      }
    });
  });
  check(Boolean(entry), 'data/catalogue.json has an entry for 06-discourse-subject-position-lab');
  if (entry) {
    check(JSON.stringify(entry) === JSON.stringify(metaObj),
      'data/catalogue.json entry for Tool 06 matches metadata.json exactly');
  }
}

/* =========================================================================
   3. Person or Setting? Workplace Lab (Full): the two-round state machine
   ========================================================================= */

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

function loadExp1Harness() {
  const source = read(FULL12_JS);

  const startExhaustion = /var START_EXHAUSTION = \d+;/.exec(source)[0];
  const comparisonTeam = /var COMPARISON_TEAM = \d+;/.exec(source)[0];
  const evidence = extractArray(source, 'EVIDENCE', FULL12_JS);
  const roundTitles = extractArray(source, 'ROUND_TITLES', FULL12_JS);
  const roundFeedback = extractArray(source, 'ROUND_FEEDBACK', FULL12_JS);
  const explanations = extractArray(source, 'EXPLANATIONS', FULL12_JS);
  const exp1Initial = extractObjectStatement(source, 'EXP1_INITIAL', FULL12_JS);
  const makeFn = extractFunction(source, 'make', FULL12_JS);
  const clearFn = extractFunction(source, 'clear', FULL12_JS);
  const visibleEvidenceFn = extractFunction(source, 'visibleEvidence', FULL12_JS);
  const renderTrailFn = extractFunction(source, 'renderTrail', FULL12_JS);
  const renderRoundFeedbackFn = extractFunction(source, 'renderRoundFeedback', FULL12_JS);
  const renderExp1Fn = extractFunction(source, 'renderExp1', FULL12_JS);
  const commitBody = extractAnonymousBody(
    source, 'commitButton.addEventListener("click", function () {', FULL12_JS);

  const snippet = [
    'var document = { createElement: function () { return makeFakeNode(); } };',
    startExhaustion,
    comparisonTeam,
    evidence,
    roundTitles,
    roundFeedback,
    explanations,
    'var EXPLANATION_LABELS = {};',
    'EXPLANATIONS.forEach(function (e) { EXPLANATION_LABELS[e.value] = e.short; });',
    exp1Initial,
    'var exp1 = null;',
    makeFn,
    clearFn,
    visibleEvidenceFn,
    renderTrailFn,
    renderRoundFeedbackFn,
    'var roundLegend = makeFakeNode();',
    'var commitButton = makeFakeNode();',
    'var trail = makeFakeNode();',
    'var roundFeedback = makeFakeNode();',
    'var roundNote = makeFakeNode();',
    'var roundsShell = { announce: function () {}, calls: [] };',
    'roundsShell.announce = function (msg) { roundsShell.calls.push(msg); };',
    // Unrelated to the reported defect and not implicated in it: stubbed
    // out rather than reimplemented, so this harness runs the real
    // round/answers state machine without needing a full DOM.
    'function buildEvidence() {}',
    'function buildExplanationOptions() {}',
    'function renderTrack() {}',
    renderExp1Fn,
    'function commit() {\n' + commitBody + '\n}',
    'module.exports = {',
    '  reset: function () {',
    '    exp1 = JSON.parse(JSON.stringify(EXP1_INITIAL));',
    '    renderExp1();',
    '  },',
    '  chooseAndCommit: function (choice) {',
    '    exp1.choice = choice;',
    '    commit();',
    '  },',
    '  state: function () {',
    '    return {',
    '      round: exp1.round,',
    '      answers: exp1.answers.slice(),',
    '      buttonHidden: commitButton.hidden,',
    '      buttonText: commitButton.textContent,',
    '      legend: roundLegend.textContent,',
    '      feedbackBlocks: roundFeedback._children.length,',
    '      trailNotes: trail._children.filter(function (li) {',
    '        return li.className === "trail__note";',
    '      }).length,',
    '    };',
    '  },',
    '  roundTitleCount: ROUND_TITLES.length,',
    '  roundFeedbackCount: ROUND_FEEDBACK.length,',
    '};',
  ].join('\n\n');

  const sandbox = { module: { exports: {} }, makeFakeNode: makeFakeNode };
  vm.createContext(sandbox);
  vm.runInContext(snippet, sandbox, { filename: 'extracted-person-or-setting-exp1.js' });
  return sandbox.module.exports;
}

function checkFull12StateMachine() {
  const harness = loadExp1Harness();

  check(harness.roundTitleCount === 2, 'ROUND_TITLES has exactly two rounds');
  check(harness.roundFeedbackCount === 2, 'ROUND_FEEDBACK has exactly two rounds');

  let threw = null;
  let s0, s1, s2;
  try {
    harness.reset();
    s0 = harness.state();
    harness.chooseAndCommit('individual');
    s1 = harness.state();
    harness.chooseAndCommit('structural');
    s2 = harness.state();
  } catch (error) {
    threw = error;
  }

  check(!threw, 'committing round 1 then round 2 raises no exception' +
    (threw ? ' (' + threw.message + ')' : ''));
  if (threw) { return; }

  check(s0.round === 0 && s0.answers.length === 0,
    'the initial state is round index 0 with no answers');
  check(s1.round === 1 && s1.answers.length === 1,
    'after round 1, round advances to index 1 with one answer (got round=' +
    s1.round + ', answers=' + s1.answers.length + ')');
  check(s1.buttonHidden === false,
    'after round 1, the commit button is still visible for round 2');
  check(s2.round === 1 && s2.answers.length === 2,
    'after round 2, round stays at index 1 (no round index 2) with two answers ' +
    '(got round=' + s2.round + ', answers=' + s2.answers.length + ')');
  check(s2.buttonHidden === true,
    'after round 2, the commit button is hidden (no third round is offered)');
  check(s2.legend !== 'undefined' && typeof s2.legend === 'string' && s2.legend.length > 0,
    'the round heading is a real title, never "undefined" (got ' + JSON.stringify(s2.legend) + ')');
  check(s2.feedbackBlocks === 3,
    'round feedback renders two per-round blocks plus the closing summary ' +
    '(got ' + s2.feedbackBlocks + ' blocks)');
  check(s2.trailNotes === 1,
    'the trail shows the round-1-vs-round-2 comparison note exactly once ' +
    '(got ' + s2.trailNotes + ')');

  // Reset must return to round 1 (index 0) with no answers.
  harness.reset();
  const afterReset = harness.state();
  check(afterReset.round === 0 && afterReset.answers.length === 0,
    'reset returns Experiment 1 to round index 0 with no answers');

  // A stray extra commit after the button should be hidden must not expose
  // a third round or throw: the guard on exp1.choice makes this a no-op
  // unless a new choice is set, and even if one is set the round must not
  // advance past index 1.
  let strayThrew = null;
  try {
    harness.reset();
    harness.chooseAndCommit('individual');
    harness.chooseAndCommit('structural');
    harness.chooseAndCommit('several');
  } catch (error) {
    strayThrew = error;
  }
  check(!strayThrew, 'an extra commit attempt after round 2 raises no exception' +
    (strayThrew ? ' (' + strayThrew.message + ')' : ''));
  if (!strayThrew) {
    const strayState = harness.state();
    check(strayState.round === 1,
      'an extra commit attempt after round 2 does not advance past round index 1');
  }
}

function checkFull12StalePatternsAbsent() {
  [FULL12_JS, FULL12_HTML, FULL12_STANDALONE].forEach(function (file) {
    const content = read(file);
    check(!/answers\.length\s*===\s*3/.test(content),
      path.relative(ROOT, file) + ' has no "answers.length === 3" check');
    check(!/answers\[2\]/.test(content),
      path.relative(ROOT, file) + ' has no "answers[2]" access');
    check(!/exp1\.round\s*===\s*2/.test(content),
      path.relative(ROOT, file) + ' has no "exp1.round === 2" final-round check');
    check(!/answers\.length\s*>=\s*3/.test(content),
      path.relative(ROOT, file) + ' has no "answers.length >= 3" hide condition');
    check(!/three rounds/i.test(content),
      path.relative(ROOT, file) + ' does not describe Experiment 1 as three rounds');
    check(!/round 3\b/i.test(content) && !/round three\b/i.test(content),
      path.relative(ROOT, file) + ' does not refer to a round 3');
  });
}

/* =========================================================================
   4. Full Tool 12 metadata: no stale three-round / pair-bonus / leaver text
   ========================================================================= */

function checkFull12Metadata() {
  [FULL12_META, CATALOGUE].forEach(function (file) {
    const content = read(file);
    check(!/projected leaver/i.test(content),
      path.relative(ROOT, file) + ' does not mention projected leavers');
    // "There are no pair bonuses" is the corrected wording and is fine;
    // only the old sentence describing an actual bonus mechanic is checked
    // for.
    check(!/a further \d+ for taking/i.test(content),
      path.relative(ROOT, file) + ' does not describe an actual pair-bonus mechanic');
    check(!/reach(?:es)? 50 \(/i.test(content) && !/and 35 \(/i.test(content),
      path.relative(ROOT, file) + ' does not state the stale 50/35 extremes');
  });
  const meta = read(FULL12_META);
  check(/\b53\b/.test(meta) && /\b40\b/.test(meta),
    'metadata.json states the correct 53/40 ten-unit extremes');

  const catalogue = JSON.parse(read(CATALOGUE));
  const metaObj = JSON.parse(read(FULL12_META));
  let entry = null;
  catalogue.modules.forEach(function (m) {
    m.tools.forEach(function (t) {
      if (t.moduleSlug === 'social-critical-psychology' &&
          t.toolSlug === '12-person-or-setting-workplace-lab') {
        entry = t;
      }
    });
  });
  check(Boolean(entry), 'data/catalogue.json has an entry for 12-person-or-setting-workplace-lab');
  if (entry) {
    check(JSON.stringify(entry) === JSON.stringify(metaObj),
      'data/catalogue.json entry for Full Tool 12 matches metadata.json exactly');
  }
}

/* =========================================================================
   5. Simplified Person or Setting: "less than half" wording
   ========================================================================= */

function checkSimplified12Wording() {
  [SIMPLE12_HTML, SIMPLE12_JS, SIMPLE12_META].forEach(function (file) {
    const content = read(file);
    check(!/less than half/i.test(content),
      path.relative(ROOT, file) + ' does not say "less than half"');
  });
}

/* =========================================================================
   main
   ========================================================================= */

function main() {
  checkLenses();
  checkDiscourse();
  checkFull12StateMachine();
  checkFull12StalePatternsAbsent();
  checkFull12Metadata();
  checkSimplified12Wording();

  console.log('\n' + failures.length + ' failure(s).');
  return failures.length ? 1 : 0;
}

process.exit(main());
