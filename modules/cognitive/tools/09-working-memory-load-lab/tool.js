/* =========================================================================
   Working-Memory Load Laboratory
   -------------------------------------------------------------------------
   A retention-interval design. The learner holds a set of items, makes three
   quick judgements while holding it, and then answers one recognition probe
   about the set.

       encode      2500 ms       2, 4 or 6 items
       retain      3 judgements at a fixed 1800 ms each, or an equal blank wait
       probe       one item, "was this in the set?", untimed

   Because the retention interval is a fixed 5400 ms in EVERY condition,
   including the do-nothing baseline, decay time is held constant and the only
   thing that varies is what happened during it.

   THE TWO FACTORS
   ---------------
       load          2 / 4 / 6 items
       material      letters (a row of consonants) or positions (cells in a
                     4x4 grid)
       concurrent    nothing / syllable judgement (verbal) /
                     symmetry judgement (visuospatial)

   Crossing material with concurrent task gives the similarity manipulation:
   a same-domain pair (letters + syllables, positions + symmetry) should cost
   more than a different-domain pair of the same pacing. That selective
   pattern is the classic argument for separable stores, and it is also the
   reason "how hard is the second task?" is the wrong first question.

   WHAT THIS OPERATIONALISES
   -------------------------
   A DEMAND, not a capacity. The page says so in the hero, the limits panel,
   the results prose and the teaching notes. Nothing here is an estimate of
   anybody's working-memory capacity.

   WHAT IT DOES NOT MANIPULATE
   ---------------------------
   Attentional control. Nothing here varies task set, response conflict or
   coordination demand. The challenge deliberately includes findings this
   design cannot speak to.

   THE WORKED EXAMPLE (the non-timed route)
   ----------------------------------------
   Four simulated runs covering the whole 2 x 2 of material by concurrent
   task, 30 trials per load each, drawn as Bernoulli trials from

       memory accuracy by load       2      4      6
         letters + syllables       0.93   0.82   0.68     same domain
         letters + symmetry        0.96   0.90   0.81     different
         positions + symmetry      0.92   0.80   0.66     same domain
         positions + syllables     0.95   0.89   0.80     different

       concurrent-task accuracy    same domain 0.86, different 0.93
       concurrent-task time        same domain 1080 ms, different 940 ms,
                                   plus 30 ms per item held

   seeds 20260991, 20260992, 20260993, 20260994.

   The similarity effect is BUILT IN. It illustrates the shape of the classic
   finding rather than providing evidence for it, and the results panel says
   so. These numbers are not norms, not published estimates and not anybody's
   data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var LOADS = [2, 4, 6];
  var TRIALS_PER_LOAD = 4;
  var PRACTICE_TRIALS = 2;
  var ENCODE_MS = 2500;
  var JUDGEMENT_MS = 1800;
  var JUDGEMENTS_PER_TRIAL = 3;
  var GAP_MS = 400;
  var GRID_SIZE = 4;

  /* Consonants only, with I, O and Q left out because they are easily
     confused with digits and with each other at a glance. */
  var LETTERS = "BCDFGHJKLMNPRSTVWXYZ".split("");

  /* Two-syllable words and words that are not two syllables. Chosen to be
     unambiguous when said aloud; the teaching notes flag that syllable
     counting has genuinely contested cases and that these are not among
     them. */
  var TWO_SYLLABLE = ["GARDEN", "PENCIL", "BASKET", "HAMMER", "WINDOW",
    "CARPET", "MARKET", "RIBBON", "LADDER", "KETTLE", "CANDLE", "PILLOW"];
  var NOT_TWO_SYLLABLE = ["TREE", "CHAIR", "BRIDGE", "CLOUD", "DESK", "GLASS",
    "UMBRELLA", "CAMERA", "ANIMAL", "ELEPHANT", "BANANA", "HOSPITAL"];

  var MATERIALS = {
    letters: { key: "letters", label: "Letters", domain: "verbal" },
    grid: { key: "grid", label: "Positions", domain: "spatial" }
  };

  var SECONDARIES = {
    none: { key: "none", label: "Nothing", domain: null },
    syllable: { key: "syllable", label: "Syllable judgement", domain: "verbal" },
    symmetry: { key: "symmetry", label: "Symmetry judgement", domain: "spatial" }
  };

  /* The worked example is a simulated CLASS, not one person: 40 fictional
     participants contributing three trials per load each, which is 120
     observations per cell. At 30 the sampling error alone (about seven
     percentage points) swamped the effect the example exists to show. */
  var SIM = {
    participants: 100,
    trialsEach: 4,
    perLoad: 400,
    runs: [
      { seed: 20260991, material: "letters", secondary: "syllable",
        memory: { 2: 0.95, 4: 0.80, 6: 0.66 }, sameDomain: true },
      { seed: 20260992, material: "letters", secondary: "symmetry",
        memory: { 2: 0.96, 4: 0.90, 6: 0.82 }, sameDomain: false },
      { seed: 20260993, material: "grid", secondary: "symmetry",
        memory: { 2: 0.94, 4: 0.79, 6: 0.64 }, sameDomain: true },
      { seed: 20260994, material: "grid", secondary: "syllable",
        memory: { 2: 0.96, 4: 0.89, 6: 0.81 }, sameDomain: false }
    ],
    secondaryAccuracy: { same: 0.86, different: 0.93 },
    secondaryTime: { same: 1080, different: 940 },
    timePerItem: 30
  };

  /* =======================================================================
     Seeded randomness (copied rather than imported, so a downloaded folder
     keeps working on its own)
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(items) {
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function sample(items, count) {
    return shuffle(items.slice()).slice(0, count);
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function ms(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value) + " ms";
  }

  function meanOf(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }

  function sameDomain(materialKey, secondaryKey) {
    var m = MATERIALS[materialKey].domain;
    var s = SECONDARIES[secondaryKey].domain;
    return s !== null && m === s;
  }

  /* =======================================================================
     Stimuli
     ===================================================================== */

  function makeMemorySet(materialKey, load) {
    if (materialKey === "letters") {
      return sample(LETTERS, load);
    }
    var cells = [];
    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) { cells.push(i); }
    return sample(cells, load);
  }

  function makeProbe(materialKey, set) {
    var inSet = Math.random() < 0.5;
    if (inSet) { return { item: pick(set), answer: true }; }
    if (materialKey === "letters") {
      var pool = LETTERS.filter(function (l) { return set.indexOf(l) === -1; });
      return { item: pick(pool), answer: false };
    }
    var cells = [];
    for (var i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
      if (set.indexOf(i) === -1) { cells.push(i); }
    }
    return { item: pick(cells), answer: false };
  }

  function makeJudgement(secondaryKey) {
    if (secondaryKey === "syllable") {
      var two = Math.random() < 0.5;
      return {
        kind: "syllable",
        word: pick(two ? TWO_SYLLABLE : NOT_TWO_SYLLABLE),
        answer: two
      };
    }
    // Symmetry: a 5-column by 4-row pattern. Symmetric patterns are built by
    // mirroring the two left columns; asymmetric ones then have one cell
    // flipped, so the two kinds have the same density on average.
    var cols = 5, rows = 4;
    var cells = [];
    var r, c;
    for (r = 0; r < rows; r += 1) {
      for (c = 0; c < 2; c += 1) {
        if (Math.random() < 0.5) {
          cells.push([r, c]);
          cells.push([r, cols - 1 - c]);
        }
      }
      if (Math.random() < 0.5) { cells.push([r, 2]); }
    }
    var symmetric = Math.random() < 0.5;
    if (!symmetric) {
      // Flip one non-central cell so the mirror is broken exactly once.
      var target = [Math.floor(Math.random() * rows), Math.random() < 0.5 ? 0 : 1];
      var index = -1;
      cells.forEach(function (cell, i) {
        if (cell[0] === target[0] && cell[1] === target[1]) { index = i; }
      });
      if (index === -1) { cells.push(target); } else { cells.splice(index, 1); }
    }
    return { kind: "symmetry", cells: cells, rows: rows, cols: cols, answer: symmetric };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#wm");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var materialSelect = $("#material-select");
  var secondarySelect = $("#secondary-select");
  var startPractice = $('[data-action="start-practice"]');
  var startRun = $('[data-action="start-run"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');

  var lettersDisplay = $("[data-letters]");
  var gridDisplay = $("[data-grid]");
  var wordDisplay = $("[data-word]");
  var patternDisplay = $("[data-pattern]");
  var displayCaption = $("[data-display-caption]");
  var phaseText = $("[data-phase-text]");
  var responses = $("[data-responses]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var chartCaption = $("[data-chart-caption]");
  var loadChart = $("[data-load-chart]");
  var loadTable = $("[data-load-table]");
  var runsTable = $("[data-runs-table]");
  var runsNote = $("[data-runs-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var pending = [];

  function later(fn, delay) {
    var id = window.setTimeout(function () {
      pending = pending.filter(function (other) { return other !== id; });
      fn();
    }, delay);
    pending.push(id);
    return id;
  }

  function cancelPending() {
    pending.forEach(function (id) { window.clearTimeout(id); });
    pending = [];
  }

  /* =======================================================================
     Display
     ===================================================================== */

  function hideAll() {
    lettersDisplay.textContent = "";
    wordDisplay.textContent = "";
    gridDisplay.hidden = true;
    patternDisplay.hidden = true;
    clear(gridDisplay);
    clear(patternDisplay);
  }

  function drawGrid(onCells, probeCell) {
    clear(gridDisplay);
    gridDisplay.hidden = false;
    var size = 200 / GRID_SIZE;
    for (var r = 0; r < GRID_SIZE; r += 1) {
      for (var c = 0; c < GRID_SIZE; c += 1) {
        var index = r * GRID_SIZE + c;
        var cls = "wm-cell";
        if (probeCell === index) { cls = "wm-cell wm-cell--probe"; }
        else if (onCells.indexOf(index) !== -1) { cls = "wm-cell wm-cell--on"; }
        svgNode("rect", {
          x: (c * size + 3).toFixed(1), y: (r * size + 3).toFixed(1),
          width: (size - 6).toFixed(1), height: (size - 6).toFixed(1),
          rx: 4, class: cls
        }, gridDisplay);
      }
    }
  }

  function drawPattern(judgement) {
    clear(patternDisplay);
    patternDisplay.hidden = false;
    var cell = 40;
    var width = judgement.cols * cell;
    var height = judgement.rows * cell;
    var offsetX = (220 - width) / 2;
    var offsetY = (180 - height) / 2;
    judgement.cells.forEach(function (rc) {
      svgNode("rect", {
        x: (offsetX + rc[1] * cell + 3).toFixed(1),
        y: (offsetY + rc[0] * cell + 3).toFixed(1),
        width: cell - 6, height: cell - 6, rx: 3, class: "wm-pattern-cell"
      }, patternDisplay);
    });
    svgNode("line", {
      x1: 110, y1: offsetY - 6, x2: 110, y2: offsetY + height + 6,
      class: "wm-pattern-axis"
    }, patternDisplay);
  }

  function setResponses(buttons) {
    clear(responses);
    buttons.forEach(function (spec) {
      var button = make("button", "button button--secondary response", spec[1]);
      button.type = "button";
      button.setAttribute("data-answer", spec[0]);
      button.addEventListener("click", function () { spec[2](); });
      responses.appendChild(button);
    });
    var first = responses.querySelector("button");
    if (first) { first.focus(); }
  }

  /* =======================================================================
     Running a trial
     ===================================================================== */

  function describePhase(phase) {
    if (phase === "encode") {
      return state.material === "letters"
        ? "Hold these letters." : "Hold these positions.";
    }
    if (phase === "judge") {
      return state.secondary === "syllable"
        ? "Two syllables, or not two syllables?"
        : state.secondary === "symmetry"
          ? "Symmetrical left to right, or not?"
          : "Just wait, and keep holding the set.";
    }
    if (phase === "probe") { return "Was this in the set?"; }
    return "Between trials.";
  }

  function setPhase(phase) {
    state.phase = phase;
    phaseText.textContent = describePhase(phase);
  }

  function beginTrial() {
    var load = state.queue[state.index];
    state.set = makeMemorySet(state.material, load);
    state.load = load;
    state.probe = makeProbe(state.material, state.set);
    state.judgeIndex = 0;
    state.judgeResults = [];
    taskFeedback.hidden = true;
    clear(responses);
    hideAll();
    setPhase("encode");

    displayCaption.textContent = (state.mode === "practice" ? "Practice trial "
      : "Trial ") + (state.index + 1) + " of " + state.queue.length +
      " — " + load + " items to hold.";

    if (state.material === "letters") {
      lettersDisplay.textContent = state.set.join(" ");
    } else {
      drawGrid(state.set, null);
    }

    later(startRetention, ENCODE_MS);
  }

  function startRetention() {
    hideAll();
    setPhase("judge");
    if (state.secondary === "none") {
      displayCaption.textContent =
        "Keep holding the set. Nothing to do for a few seconds.";
      later(askProbe, JUDGEMENT_MS * JUDGEMENTS_PER_TRIAL);
      return;
    }
    nextJudgement();
  }

  function nextJudgement() {
    if (state.judgeIndex >= JUDGEMENTS_PER_TRIAL) {
      hideAll();
      clear(responses);
      later(askProbe, GAP_MS);
      return;
    }

    var judgement = makeJudgement(state.secondary);
    state.judgement = judgement;
    state.judgementAnswered = false;
    state.judgementShownAt = now();
    hideAll();

    if (judgement.kind === "syllable") {
      wordDisplay.textContent = judgement.word;
      displayCaption.textContent = "Two syllables? " +
        (state.judgeIndex + 1) + " of " + JUDGEMENTS_PER_TRIAL + ".";
      setResponses([
        ["yes", "Two syllables", function () { answerJudgement(true); }],
        ["no", "Not two", function () { answerJudgement(false); }]
      ]);
    } else {
      drawPattern(judgement);
      displayCaption.textContent = "Symmetrical? " +
        (state.judgeIndex + 1) + " of " + JUDGEMENTS_PER_TRIAL + ".";
      setResponses([
        ["yes", "Symmetrical", function () { answerJudgement(true); }],
        ["no", "Not symmetrical", function () { answerJudgement(false); }]
      ]);
    }

    // Fixed window, so the retention interval is the same length in every
    // condition. A missed response is recorded as a miss, not dropped.
    state.judgementTimer = later(function () {
      if (!state.judgementAnswered) { answerJudgement(null); }
    }, JUDGEMENT_MS);
  }

  function answerJudgement(answer) {
    if (state.judgementAnswered) { return; }
    state.judgementAnswered = true;
    var rt = now() - state.judgementShownAt;
    state.judgeResults.push({
      correct: answer === null ? false : answer === state.judgement.answer,
      missed: answer === null,
      rt: answer === null ? null : rt
    });
    state.judgeIndex += 1;
    // Wait out the rest of the window so every trial has the same retention
    // interval regardless of how fast the learner answered.
    var used = answer === null ? JUDGEMENT_MS : rt;
    clear(responses);
    hideAll();
    later(nextJudgement, Math.max(80, JUDGEMENT_MS - used));
  }

  function askProbe() {
    setPhase("probe");
    hideAll();
    if (state.material === "letters") {
      lettersDisplay.textContent = state.probe.item;
    } else {
      drawGrid([], state.probe.item);
    }
    displayCaption.textContent = state.material === "letters"
      ? "Was this letter in the set? No time limit."
      : "Was this position in the set? The ringed cell is the one being asked about. No time limit.";
    setResponses([
      ["yes", "Yes, it was in the set", function () { answerProbe(true); }],
      ["no", "No, it was not", function () { answerProbe(false); }]
    ]);
    shell.announce("Was this item in the set?", { immediate: true });
  }

  function answerProbe(answer) {
    if (state.phase !== "probe") { return; }
    var correct = answer === state.probe.answer;
    var judgeCorrect = state.judgeResults.filter(function (j) { return j.correct; }).length;
    var judgeRts = state.judgeResults.filter(function (j) { return j.rt !== null; })
      .map(function (j) { return j.rt; });

    if (state.mode === "practice") {
      showFeedback(taskFeedback, correct ? "good" : "caution",
        correct ? "Correct." : "Not that one.",
        "The set had " + state.load + " items and the probe " +
        (state.probe.answer ? "was" : "was not") + " one of them." +
        (state.secondary === "none" ? ""
          : " You got " + judgeCorrect + " of " + JUDGEMENTS_PER_TRIAL +
            " of the concurrent judgements right.") +
        " Practice tells you straight away; the scored run will not.");
    } else {
      state.trials.push({
        load: state.load,
        correct: correct,
        judgeCorrect: judgeCorrect,
        judgeTotal: state.secondary === "none" ? 0 : JUDGEMENTS_PER_TRIAL,
        judgeRt: meanOf(judgeRts)
      });
    }

    clear(responses);
    hideAll();
    setPhase("gap");
    state.index += 1;
    if (state.index >= state.queue.length) {
      later(finishRun, GAP_MS);
    } else {
      displayCaption.textContent = "Next trial starting.";
      later(beginTrial, state.mode === "practice" ? 1600 : GAP_MS + 400);
    }
  }

  function idleControls() {
    startPractice.disabled = false;
    startRun.disabled = false;
    stopButton.disabled = true;
    materialSelect.disabled = false;
    secondarySelect.disabled = false;
  }

  function runningControls() {
    startPractice.disabled = true;
    startRun.disabled = true;
    stopButton.disabled = false;
    materialSelect.disabled = true;
    secondarySelect.disabled = true;
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    state.mode = "idle";
    cancelPending();
    hideAll();
    clear(responses);
    idleControls();
    setPhase("idle");

    if (wasPractice) {
      displayCaption.textContent = "Practice finished.";
      showFeedback(taskFeedback, "good", "Practice finished.",
        "The scored run is twelve trials — four each at two, four and six " +
        "items — with no feedback until it ends.");
      startRun.focus();
      shell.announce("Practice finished. The scored run is available.",
        { immediate: true });
      return;
    }

    displayCaption.textContent = "Run finished. The load function is below.";
    recordRun(state.trials.slice());
    shell.announce("Run finished. The load function is below.", { immediate: true });
  }

  function stopRun() {
    var collected = state.trials.slice();
    var wasScored = state.mode === "run";
    cancelPending();
    state.mode = "idle";
    hideAll();
    clear(responses);
    idleControls();
    setPhase("idle");
    displayCaption.textContent = "Stopped.";
    if (wasScored && collected.length) {
      recordRun(collected, true);
    }
    shell.announce("Stopped." + (wasScored && collected.length
      ? " The trials you completed are summarised below." : ""),
      { immediate: true });
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  function summarise(trials) {
    var byLoad = {};
    LOADS.forEach(function (load) {
      var subset = trials.filter(function (t) { return t.load === load; });
      var judged = subset.filter(function (t) { return t.judgeTotal > 0; });
      var rts = subset.map(function (t) { return t.judgeRt; })
        .filter(function (v) { return v !== null && v !== undefined; });
      byLoad[load] = {
        load: load,
        n: subset.length,
        memory: subset.length
          ? subset.filter(function (t) { return t.correct; }).length / subset.length
          : null,
        secondary: judged.length
          ? judged.reduce(function (a, t) { return a + t.judgeCorrect; }, 0) /
            judged.reduce(function (a, t) { return a + t.judgeTotal; }, 0)
          : null,
        secondaryRt: rts.length ? meanOf(rts) : null
      };
    });
    return { total: trials.length, byLoad: byLoad };
  }

  function simulateRun(spec) {
    var rand = mulberry32(spec.seed);
    var kind = spec.sameDomain ? "same" : "different";
    var byLoad = {};
    LOADS.forEach(function (load) {
      var hits = 0, judgeHits = 0, judgeTotal = 0, rts = [];
      for (var i = 0; i < SIM.perLoad; i += 1) {
        if (rand() < spec.memory[load]) { hits += 1; }
        for (var j = 0; j < JUDGEMENTS_PER_TRIAL; j += 1) {
          judgeTotal += 1;
          if (rand() < SIM.secondaryAccuracy[kind]) { judgeHits += 1; }
        }
        rts.push(SIM.secondaryTime[kind] + SIM.timePerItem * load +
          (rand() - 0.5) * 180);
      }
      byLoad[load] = {
        load: load, n: SIM.perLoad,
        memory: hits / SIM.perLoad,
        secondary: judgeHits / judgeTotal,
        secondaryRt: meanOf(rts)
      };
    });
    return { total: SIM.perLoad * LOADS.length, byLoad: byLoad };
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function recordRun(trials, partial) {
    var stats = summarise(trials);
    state.runs.push({
      label: "Run " + (state.runs.length + 1) + (partial ? " (partial)" : ""),
      source: "Yours",
      material: state.material,
      secondary: state.secondary,
      same: sameDomain(state.material, state.secondary),
      stats: stats
    });
    showResults(stats, {
      source: "own", material: state.material, secondary: state.secondary,
      partial: partial
    });
  }

  function loadWorkedExample() {
    var first = null;
    SIM.runs.forEach(function (spec, index) {
      var stats = simulateRun(spec);
      state.runs.push({
        label: "Worked example " + "ABCD".charAt(index),
        source: "Simulated",
        material: spec.material,
        secondary: spec.secondary,
        same: spec.sameDomain,
        stats: stats
      });
      if (!first) { first = stats; }
    });
    showResults(first, {
      source: "simulated", material: SIM.runs[0].material,
      secondary: SIM.runs[0].secondary
    });
  }

  function showResults(stats, meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "The load function — worked example, simulated"
      : "The load function — your run";
    renderChart(stats);
    renderLoadTable(stats);
    renderResultsProse(stats, meta);
    renderRunsTable();
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderChart(stats) {
    var W = 440, H = 250;
    var PAD_L = 56, PAD_R = 26, PAD_T = 20, PAD_B = 56;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    clear(loadChart);

    var xAt = function (load) {
      return PAD_L + ((load - LOADS[0]) / (LOADS[LOADS.length - 1] - LOADS[0])) * plotW;
    };
    var yAt = function (p) { return PAD_T + (1 - p) * plotH; };

    [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
      svgNode("line", { x1: PAD_L, y1: yAt(p).toFixed(1), x2: W - PAD_R,
        y2: yAt(p).toFixed(1), class: "chart__grid" }, loadChart);
      svgNode("text", { x: PAD_L - 8, y: (yAt(p) + 4).toFixed(1),
        "text-anchor": "end", class: "chart__axis" }, loadChart)
        .textContent = Math.round(p * 100) + "%";
    });
    LOADS.forEach(function (load) {
      svgNode("text", { x: xAt(load).toFixed(1), y: H - 32,
        "text-anchor": "middle", class: "chart__axis" }, loadChart)
        .textContent = String(load);
    });
    svgNode("text", { x: (PAD_L + plotW / 2).toFixed(1), y: H - 12,
      "text-anchor": "middle", class: "chart__axis" }, loadChart)
      .textContent = "Items held";
    svgNode("text", { x: 14, y: (PAD_T + plotH / 2).toFixed(1),
      "text-anchor": "middle", class: "chart__axis",
      transform: "rotate(-90 14 " + (PAD_T + plotH / 2).toFixed(1) + ")" },
      loadChart).textContent = "Memory correct";

    var points = LOADS.filter(function (load) {
      return stats.byLoad[load].memory !== null;
    }).map(function (load) {
      return { x: xAt(load), y: yAt(stats.byLoad[load].memory),
        value: stats.byLoad[load].memory };
    });
    if (!points.length) {
      svgNode("text", { x: W / 2, y: H / 2, "text-anchor": "middle",
        class: "chart__axis" }, loadChart)
        .textContent = "No trials at any load yet.";
      return;
    }
    if (points.length > 1) {
      svgNode("path", {
        d: points.map(function (p, i) {
          return (i === 0 ? "M " : "L ") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        }).join(" "), class: "wm__line"
      }, loadChart);
    }
    points.forEach(function (p) {
      svgNode("rect", { x: (p.x - 5).toFixed(1), y: (p.y - 5).toFixed(1),
        width: 10, height: 10, class: "wm__point" }, loadChart);
      svgNode("text", { x: p.x.toFixed(1), y: (p.y - 12).toFixed(1),
        "text-anchor": "middle", class: "chart__count" }, loadChart)
        .textContent = pct(p.value);
    });
  }

  function renderLoadTable(stats) {
    clear(loadTable);
    LOADS.forEach(function (load) {
      var cell = stats.byLoad[load];
      var row = make("tr");
      var head = make("th", null, String(load));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, pct(cell.memory)));
      row.appendChild(make("td", null, pct(cell.secondary)));
      row.appendChild(make("td", null, ms(cell.secondaryRt)));
      loadTable.appendChild(row);
    });
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";
    var same = sameDomain(meta.material, meta.secondary);

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Four simulated runs loaded, covering every combination of material " +
        "and concurrent task. Each is a simulated class of " + SIM.participants +
        " fictional participants contributing " + SIM.trialsEach +
        " trials per load, so " + SIM.perLoad + " observations per cell."
      : (meta.partial ? "A partial run. " : "") + "Your run: " +
        MATERIALS[meta.material].label.toLowerCase() + " held, " +
        (meta.secondary === "none" ? "nothing alongside"
          : SECONDARIES[meta.secondary].label.toLowerCase() + " alongside") +
        (meta.secondary === "none" ? "."
          : same ? " — the same domain as the material you were holding."
            : " — a different domain from the material you were holding.")));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "At two items there is almost nothing between the four runs — with so " +
        "little to hold there is little to interfere with. The gap opens at " +
        "four items and is wide at six, and it opens in one direction: the two " +
        "same-domain runs fall away and the two different-domain runs do not. " +
        "That selectivity is what the separable-store argument rests on. It is " +
        "built into the generator here, so treat it as an illustration of the " +
        "finding rather than an instance of it."));
    } else {
      var high = stats.byLoad[6].memory;
      var low = stats.byLoad[2].memory;
      if (high !== null && low !== null) {
        resultsBody.appendChild(make("p", null,
          "Your memory accuracy went from " + pct(low) + " at two items to " +
          pct(high) + " at six" +
          (low - high > 0.15
            ? ". That is the load function, felt rather than read about."
            : ". With four trials at each load a flat line is common; the " +
              "worked example shows the shape the design can produce.")));
      }
      resultsBody.appendChild(make("p", null,
        "Four trials at each load, so one trial moves a point by 25 " +
        "percentage points. Read the shape, not the numbers, and compare " +
        "your own runs — a comparison, not an experiment."));
    }

    resultsBody.appendChild(make("p", null,
      "Whatever this run shows, it is a statement about a demand, not about " +
      "your capacity. Nothing on this page estimates how much you can hold."));

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated data (seed " + SIM.runs[0].seed + "): "
      : "Your run: ") + "memory accuracy against the number of items held";
  }

  function renderRunsTable() {
    clear(runsTable);
    state.runs.forEach(function (run) {
      var row = make("tr");
      var head = make("th", null, run.label);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, MATERIALS[run.material].label));
      row.appendChild(make("td", null, SECONDARIES[run.secondary].label));
      row.appendChild(make("td", null,
        run.secondary === "none" ? "no second task" : (run.same ? "Yes" : "No")));
      LOADS.forEach(function (load) {
        row.appendChild(make("td", null, pct(run.stats.byLoad[load].memory)));
      });
      runsTable.appendChild(row);
    });

    var kinds = {};
    state.runs.forEach(function (r) { kinds[r.material + "-" + r.secondary] = true; });
    runsNote.textContent = Object.keys(kinds).length > 1
      ? "Compare the rows marked Yes with the rows marked No. If the " +
        "same-domain rows sit lower, that is selective interference — and " +
        "before believing it, ask whether the two concurrent tasks were also " +
        "different in sheer difficulty."
      : "Run another combination to add a row here. Runs are kept only in " +
        "this tab and disappear on reload or reset.";
  }

  /* =======================================================================
     Buttons
     ===================================================================== */

  startPractice.addEventListener("click", function () {
    cancelPending();
    state.mode = "practice";
    state.index = 0;
    state.trials = [];
    state.queue = [2, 4].slice(0, PRACTICE_TRIALS);
    runningControls();
    beginTrial();
    shell.announce("Practice started: two trials with feedback.", { immediate: true });
  });

  startRun.addEventListener("click", function () {
    cancelPending();
    state.mode = "run";
    state.index = 0;
    state.trials = [];
    var queue = [];
    LOADS.forEach(function (load) {
      for (var i = 0; i < TRIALS_PER_LOAD; i += 1) { queue.push(load); }
    });
    state.queue = shuffle(queue);
    runningControls();
    beginTrial();
    shell.announce("Run started: twelve trials, no feedback until the end.",
      { immediate: true });
  });

  stopButton.addEventListener("click", stopRun);

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    hideAll();
    clear(responses);
    idleControls();
    displayCaption.textContent =
      "Worked example loaded below. The laboratory is still available.";
    loadWorkedExample();
    shell.announce("Worked example loaded: four simulated runs with fixed seeds.",
      { immediate: true });
  });

  materialSelect.addEventListener("change", function () {
    state.material = materialSelect.value;
    setPhase("idle");
  });

  secondarySelect.addEventListener("change", function () {
    state.secondary = secondarySelect.value;
    setPhase("idle");
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    same: {
      tone: "good", verdict: "That is the classic pattern.",
      text: "A concurrent task made of the same kind of material costs far " +
        "more than one of similar pacing made of something else. That " +
        "selectivity is the original argument for more than one store."
    },
    cross: {
      tone: "caution", verdict: "The other way round.",
      text: "Mismatched pairs interfere least. If two tasks need the same " +
        "kind of representation they compete for it; if they do not, they can " +
        "largely proceed alongside each other — though never entirely freely."
    },
    equal: {
      tone: "caution", verdict: "It matters a great deal which.",
      text: "If any second task cost the same, there would be one " +
        "undifferentiated pool. The finding that it does not is what the " +
        "separable-store argument is made of."
    },
    hardest: {
      tone: "caution", verdict: "A reasonable guess, and testable.",
      text: "Sheer difficulty does matter. But a same-domain task costs more " +
        "than a different-domain task of comparable difficulty, which is why " +
        "the worked example crosses both concurrent tasks with both kinds of " +
        "material — that crossing is what separates similarity from difficulty."
    }
  };

  function unlockLab(message) {
    idleControls();
    displayCaption.textContent = "Ready. Practice first if this is new to you.";
    setPhase("idle");
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four answers before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockLab("Laboratory unlocked. Practice is two trials with feedback.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The laboratory is unlocked. From the front, the worked example shows " +
      "all four combinations at once, which nobody has time to perform.");
    lockForm(openingForm);
    unlockLab("Prediction skipped. Laboratory unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "more-items",
      text: "With the same concurrent task throughout, memory accuracy fell as the set grew from two items to six.",
      answer: "storage",
      why: "Nothing changed except how much was being held, so this is storage " +
        "load in its purest available form. Note what it does not show: the " +
        "fall is gradual, so it describes a curve rather than a container with " +
        "a fixed number of slots."
    },
    {
      id: "same-domain",
      text: "Judging syllables cost more when letters were being held than when grid positions were being held, with the judgements identical in both cases.",
      answer: "similarity",
      why: "The concurrent task is held constant and the material changes, so " +
        "difficulty cannot explain it. This crossing is the one design feature " +
        "that separates similarity from sheer demand, and it is why the worked " +
        "example runs all four combinations."
    },
    {
      id: "unpredictable",
      text: "Performance was worse when the concurrent judgements arrived unpredictably and the person had to keep checking whether one had appeared.",
      answer: "control",
      why: "Monitoring and task-set maintenance are demands on general control, " +
        "not on storage and not a matter of representational overlap. This page " +
        "does not manipulate them at all - the judgements arrive on a fixed " +
        "schedule - so it is here to be recognised as out of scope."
    },
    {
      id: "any-task",
      text: "Even a concurrent task from a completely different domain cost something relative to simply waiting.",
      answer: "control",
      why: "Selective interference is never total. The residual cost of any " +
        "concurrent task is usually attributed to a domain-general component - " +
        "coordination, task switching, the executive - rather than to the " +
        "stores themselves. You can see this on this page by running the " +
        "do-nothing baseline."
    },
    {
      id: "individual",
      text: "One student was accurate at six letters and another was not, so the first has the larger working memory.",
      answer: "neither",
      why: "Twelve trials of one task on one afternoon, no reliability estimate, " +
        "no standardisation, and a construct the design never set out to " +
        "measure. Published capacity estimates come from long standardised " +
        "procedures and are reported with error - and still predict individual " +
        "outcomes only modestly."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["storage", "Storage load"],
    ["control", "Attentional control"],
    ["similarity", "Task similarity"],
    ["neither", "None of them — the design cannot show this"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_ITEMS.forEach(function (item) {
      var row = make("tr");
      var head = make("th", null, item.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var cell = make("td");
      var select = make("select");
      select.id = "factor-" + item.id;
      var label = make("label", "visually-hidden",
        "Which factor is doing the work: " + item.text);
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      cell.appendChild(label);
      cell.appendChild(select);
      cell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(cell);
      challengeRows.appendChild(row);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0, right = 0;
    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#factor-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each finding, ask what was actually varied " +
        "between the conditions being compared.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "Two of these five are about something this laboratory does not " +
      "manipulate. Recognising when a finding is outside the reach of a design " +
      "is the skill worth taking away.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_ITEMS.length + " correct.", { immediate: true });
  });

  /* =======================================================================
     Helpers
     ===================================================================== */

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* =======================================================================
     Reset
     ===================================================================== */

  shell.onReset(function () {
    cancelPending();
    state = {
      mode: "idle",
      phase: "idle",
      index: 0,
      queue: [],
      trials: [],
      runs: [],
      set: [],
      load: 0,
      probe: null,
      judgement: null,
      judgeIndex: 0,
      judgeResults: [],
      judgementAnswered: true,
      judgementShownAt: 0,
      material: "letters",
      secondary: "none"
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "The load function";

    clear(loadTable);
    clear(runsTable);
    clear(loadChart);
    clear(resultsBody);
    runsNote.textContent = "";

    materialSelect.value = "letters";
    secondarySelect.value = "none";
    materialSelect.disabled = true;
    secondarySelect.disabled = true;
    startPractice.disabled = true;
    startRun.disabled = true;
    stopButton.disabled = true;

    hideAll();
    clear(responses);
    displayCaption.textContent =
      "Answer the question above to unlock the laboratory.";
    phaseText.textContent = "Answer the question above to unlock this.";

    renderChallenge();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Only the concurrent judgements are paced, at 1.8 seconds each, so " +
    "the retention interval is the same length in every condition. The worked " +
    "example needs no trials at all.",
    { immediate: true });
})();
