/* =========================================================================
   Stroop Interference Laboratory
   -------------------------------------------------------------------------
   An original colour-word interference task the learner performs, followed
   by a summary that splits the usual single "Stroop effect" into two
   quantities using the neutral condition as the baseline:

       interference  = mean incongruent RT  -  mean neutral RT
       facilitation  = mean neutral RT      -  mean congruent RT

   Reporting only (incongruent - congruent) collapses those two, and the
   collapse is exactly what students need to see undone.

   THE TRIAL
   ---------
       fixation cross      500 ms
       word                until the learner responds - never timed out

   Only two display changes per trial, neither faster than about twice a
   second, and nothing fades, moves or animates. There is therefore nothing
   for a reduced-motion rule to switch off, which is stated on the page.

   THE STIMULI (all original; no proprietary test material)
   -------------------------------------------------------
       congruent     a colour word printed in its own colour
       incongruent   a colour word printed in a different colour from the set
       neutral       an ordinary non-colour word printed in one of the inks

   Neutral items are common concrete nouns of roughly the same length as the
   colour words. Length matching is approximate, not controlled, and the
   teaching notes say so: a fully matched neutral set would also need to
   control frequency and orthographic neighbourhood.

   Two colour sets are offered. The four-colour set (red, green, blue,
   yellow) is the usual one. The two-colour set (blue and yellow) differs in
   luminance as well as hue and exists because the task itself requires
   discriminating ink colours, which cannot be removed without removing the
   phenomenon. The worked example is the complete route for anyone who does
   not want to respond to colour at all.

   THE MIX (the transfer manipulation)
   -----------------------------------
       balanced             a third congruent, a third neutral, a third incongruent
       mostly incongruent   a sixth, a sixth, and two-thirds

   Both are real, runnable blocks. Every completed block is kept in a table
   with its own interference and facilitation, so a learner can compare the
   two mixes rather than being told what would happen.

   CLEANING
   --------
   Responses under 200 ms cannot be reactions to a four-choice display;
   responses over 3000 ms are lapses of a different kind. Both are counted,
   reported in the "excluded responses" panel, and kept out of the condition
   means rather than silently averaged in. Errors are also excluded from the
   RT means and reported as accuracy instead.

   WHY RESULTS ARE WITHHELD UNTIL THE BLOCK ENDS
   ---------------------------------------------
   A deliberate exception to the usual rule that a learner should see the
   consequence of a manipulation while making it. A running condition mean on
   screen during a speeded block changes how people answer the next trial.
   Practice trials give immediate feedback; scored trials give none until the
   block is over.

   THE WORKED EXAMPLE (the non-timed, non-colour route)
   ---------------------------------------------------
   Two simulated blocks, generated as

       RT = base + condition offset + Normal(0, 70) + Exponential(mean 60)
       floored at 260 ms

   Block A - balanced mix, seed 20260923, 80 trials per condition
       base 620; offsets congruent -22, neutral 0, incongruent +78
       accuracy congruent .98, neutral .97, incongruent .93
       produces interference +78 ms, facilitation +24 ms

   Block B - mostly incongruent, seed 20260987, 30 / 30 / 120 trials
       base 640; offsets congruent -6, neutral 0, incongruent +38
       accuracy congruent .97, neutral .97, incongruent .95
       produces interference +35 ms, facilitation +3 ms

   Both seeds were CHOSEN so that the sample means land near the generator's
   parameters, because a worked example whose job is to show a pattern should
   show it. That choice is worth saying aloud to a class: with eighty trials
   per condition, plenty of other seeds produce a facilitation of zero or
   below from the same generator, which is the clearest possible statement of
   how little a single sample is obliged to resemble the process behind it.

   The shrunken effect in Block B is BUILT IN, not discovered: it illustrates
   the proportion-congruency finding rather than providing evidence for it,
   and the results panel, the challenge feedback and the debrief all say so.
   These numbers are illustrative. They are not norms, not published effect
   sizes and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* --- Trial timing (milliseconds). Requested durations: the browser cannot
     guarantee them, which is stated on the page. -------------------------- */
  var FIXATION_MS = 500;
  var PRACTICE_FEEDBACK_MS = 1400;
  var INTER_TRIAL_MS = 400;
  var PRACTICE_TRIALS = 6;

  /* Cleaning bounds, documented in the teaching notes. */
  var ANTICIPATION_MS = 200;
  var LAPSE_MS = 3000;

  var CONDITIONS = ["congruent", "neutral", "incongruent"];
  var CONDITION_LABEL = {
    congruent: "Congruent",
    neutral: "Neutral",
    incongruent: "Incongruent"
  };

  /* Ink table. Contrast against the fixed #15181d stimulus panel is 7:1 or
     better for every entry; see tool.css. */
  var INKS = {
    red: { name: "Red", hex: "#ff7b7b" },
    green: { name: "Green", hex: "#5fd47a" },
    blue: { name: "Blue", hex: "#7fb0ff" },
    yellow: { name: "Yellow", hex: "#f2d24b" }
  };

  var PALETTES = {
    four: { key: "four", label: "Four colours", inks: ["red", "green", "blue", "yellow"] },
    two: { key: "two", label: "Two colours", inks: ["blue", "yellow"] }
  };

  /* Common concrete nouns, roughly matched in length to the colour words.
     Approximate matching only - see the header note. */
  var NEUTRAL_WORDS = [
    "CUP", "DESK", "CHAIR", "MONTH", "TABLE", "PLANT", "HOUSE", "WATER"
  ];

  /* Trial mixes: shares of the block given to each condition. */
  var MIXES = {
    balanced: {
      key: "balanced",
      label: "Balanced",
      shares: { congruent: 1 / 3, neutral: 1 / 3, incongruent: 1 / 3 }
    },
    "mostly-incongruent": {
      key: "mostly-incongruent",
      label: "Mostly incongruent",
      shares: { congruent: 1 / 6, neutral: 1 / 6, incongruent: 2 / 3 }
    }
  };

  /* Worked-example generators. */
  var SIM_SHARED = { sd: 70, tailMean: 60, floor: 260 };
  var SIM_BLOCKS = [
    {
      label: "Worked example A",
      seed: 20260923,
      mix: "balanced",
      palette: "four",
      base: 620,
      counts: { congruent: 80, neutral: 80, incongruent: 80 },
      offsets: { congruent: -22, neutral: 0, incongruent: 78 },
      accuracy: { congruent: 0.98, neutral: 0.97, incongruent: 0.93 }
    },
    {
      label: "Worked example B",
      seed: 20260987,
      mix: "mostly-incongruent",
      palette: "four",
      base: 640,
      counts: { congruent: 30, neutral: 30, incongruent: 120 },
      offsets: { congruent: -6, neutral: 0, incongruent: 38 },
      accuracy: { congruent: 0.97, neutral: 0.97, incongruent: 0.95 }
    }
  ];

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

  /* Box-Muller: one standard normal draw from two uniforms. */
  function normal(rand) {
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* Exponential draw, for the right tail every reaction-time distribution
     has. */
  function exponential(rand, meanValue) {
    return -meanValue * Math.log(1 - rand());
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

  function ms(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value) + " ms";
  }

  function signedMs(value) {
    if (value === null || value === undefined || isNaN(value)) { return "—"; }
    var rounded = Math.round(value);
    return (rounded > 0 ? "+" : "") + rounded + " ms";
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function meanOf(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function medianOf(values) {
    if (!values.length) { return null; }
    var sorted = values.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /* Sample standard deviation: these are estimates from a handful of trials,
     so the n-1 denominator is the right one. */
  function sdOf(values) {
    if (values.length < 2) { return null; }
    var m = meanOf(values);
    var sum = values.reduce(function (t, x) { return t + (x - m) * (x - m); }, 0);
    return Math.sqrt(sum / (values.length - 1));
  }

  function shuffle(items, rand) {
    var draw = rand || Math.random;
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(draw() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }

  /* =======================================================================
     Trial construction
     ===================================================================== */

  /**
   * Build one trial of a given condition, balancing which ink is used.
   * @param {string} condition  congruent | neutral | incongruent
   * @param {Array<string>} inks  ink keys available in the current palette
   * @param {number} index  position within the condition, used to rotate inks
   */
  function buildTrial(condition, inks, index) {
    // Rotating rather than sampling keeps every ink equally often in every
    // condition, so ink identity carries no information about condition.
    var ink = inks[index % inks.length];
    var word;

    if (condition === "congruent") {
      word = INKS[ink].name.toUpperCase();
    } else if (condition === "incongruent") {
      var others = inks.filter(function (key) { return key !== ink; });
      word = INKS[others[index % others.length]].name.toUpperCase();
    } else {
      word = NEUTRAL_WORDS[index % NEUTRAL_WORDS.length];
    }

    return { condition: condition, ink: ink, word: word };
  }

  function buildBlock(total, mixKey, paletteKey) {
    var shares = MIXES[mixKey].shares;
    var inks = PALETTES[paletteKey].inks;
    var counts = {};
    var assigned = 0;

    CONDITIONS.forEach(function (condition, i) {
      if (i === CONDITIONS.length - 1) {
        counts[condition] = total - assigned;
      } else {
        counts[condition] = Math.round(total * shares[condition]);
        assigned += counts[condition];
      }
    });

    var trials = [];
    CONDITIONS.forEach(function (condition) {
      for (var i = 0; i < counts[condition]; i += 1) {
        trials.push(buildTrial(condition, inks, i));
      }
    });
    return shuffle(trials);
  }

  function practiceBlock(paletteKey) {
    // Two of each condition, so nobody meets an incongruent trial for the
    // first time in the scored block.
    var inks = PALETTES[paletteKey].inks;
    var trials = [];
    CONDITIONS.forEach(function (condition) {
      trials.push(buildTrial(condition, inks, 0));
      trials.push(buildTrial(condition, inks, 1));
    });
    return shuffle(trials).slice(0, PRACTICE_TRIALS);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#stroop");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var paletteSelect = $("#palette-select");
  var mixSelect = $("#mix-select");
  var lengthSelect = $("#length-select");
  var startPractice = $('[data-action="start-practice"]');
  var startBlock = $('[data-action="start-block"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');

  var stimulus = $("[data-stimulus]");
  var stimulusWord = $("[data-stimulus-word]");
  var stimulusCaption = $("[data-stimulus-caption]");
  var trialStatus = $("[data-trial-status]");
  var responseButtons = $("[data-response-buttons]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var chartCaption = $("[data-chart-caption]");
  var rtChart = $("[data-rt-chart]");
  var rtTable = $("[data-rt-table]");
  var effectReadout = $("[data-effect-readout]");
  var effectText = $("[data-effect-text]");
  var effectNote = $("[data-effect-note]");
  var blocksTable = $("[data-blocks-table]");
  var blocksNote = $("[data-blocks-note]");
  var excludedBody = $("[data-excluded-body]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");
  var challengeLock = $("[data-challenge-lock]");
  var challengeButton = $('[data-action="check-challenge"]');

  var DEFAULTS = { palette: "four", mix: "balanced", length: 36 };

  var state = null;
  var pending = [];   // outstanding setTimeout ids, so reset can cancel them

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
     Response buttons
     ===================================================================== */

  function renderResponses() {
    clear(responseButtons);
    PALETTES[state.palette].inks.forEach(function (key, index) {
      var ink = INKS[key];
      var button = make("button", "button button--secondary response");
      button.type = "button";
      button.disabled = true;
      button.setAttribute("data-response", key);
      button.setAttribute("aria-label",
        "The ink is " + ink.name.toLowerCase() + ", number key " + (index + 1));

      var swatch = make("span", "ink-swatch");
      swatch.setAttribute("aria-hidden", "true");
      swatch.style.setProperty("--swatch", ink.hex);
      button.appendChild(swatch);
      button.appendChild(make("span", null, ink.name));
      var key_ = make("span", "response__key", String(index + 1));
      key_.setAttribute("aria-hidden", "true");
      button.appendChild(key_);

      button.addEventListener("click", function () { respond(key); });
      responseButtons.appendChild(button);
    });
  }

  function setResponseEnabled(enabled) {
    Array.prototype.forEach.call(
      responseButtons.querySelectorAll("button"),
      function (button) { button.disabled = !enabled; }
    );
  }

  /* Number keys 1..n, matching the labels printed on the buttons. Ignored
     while focus is inside a form control so that keyboard use of the selects
     is unaffected. */
  document.addEventListener("keydown", function (event) {
    if (!state || !state.awaiting) { return; }
    if (event.metaKey || event.ctrlKey || event.altKey) { return; }
    var tag = event.target && event.target.tagName;
    if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") { return; }
    var inks = PALETTES[state.palette].inks;
    var index = parseInt(event.key, 10) - 1;
    if (isNaN(index) || index < 0 || index >= inks.length) { return; }
    event.preventDefault();
    respond(inks[index]);
  });

  /* =======================================================================
     Running a block
     ===================================================================== */

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.blocksRun
        ? "Idle. Change a setting and run another block, or read the results below."
        : state.practiceDone
          ? "Practice done. Start the scored block when you are ready."
          : "Not started. Practice first — it is untimed and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial " : "Trial ") +
      (state.index + 1) + " of " + state.queue.length +
      ". Name the ink colour, not the word.";
  }

  function showFixation() {
    stimulusWord.style.setProperty("--ink", "#f2f2f2");
    stimulusWord.textContent = "+";
  }

  function beginTrial() {
    var trial = state.queue[state.index];
    state.awaiting = null;
    setResponseEnabled(false);
    taskFeedback.hidden = true;
    showFixation();
    stimulusCaption.textContent = "Get ready.";
    updateTrialStatus();

    later(function () {
      stimulusWord.style.setProperty("--ink", INKS[trial.ink].hex);
      stimulusWord.textContent = trial.word;
      stimulusCaption.textContent =
        "Name the ink colour. There is no time limit.";
      state.awaiting = trial;
      state.shownAt = now();
      setResponseEnabled(true);
    }, FIXATION_MS);
  }

  function respond(inkKey) {
    if (!state.awaiting) { return; }
    var trial = state.awaiting;
    var rt = now() - state.shownAt;
    var correct = inkKey === trial.ink;

    state.awaiting = null;
    setResponseEnabled(false);
    showFixation();

    if (state.mode === "practice") {
      showFeedback(taskFeedback,
        correct ? "good" : "caution",
        correct ? "Correct." : "That was the word, not the ink.",
        "The word was “" + trial.word + "” and the ink was " +
        INKS[trial.ink].name.toLowerCase() + ", so that was " +
        describeCondition(trial.condition) +
        " Practice trials tell you straight away; scored trials will not.");
    } else {
      state.results.push({
        condition: trial.condition,
        rt: rt,
        correct: correct
      });
    }

    state.index += 1;

    if (state.index >= state.queue.length) {
      finishRun();
    } else {
      later(beginTrial,
        state.mode === "practice" ? PRACTICE_FEEDBACK_MS : INTER_TRIAL_MS);
      updateTrialStatus();
    }
  }

  function describeCondition(condition) {
    if (condition === "congruent") {
      return "a congruent trial — the word named the ink it was printed in.";
    }
    if (condition === "incongruent") {
      return "an incongruent trial — the word named a different colour.";
    }
    return "a neutral trial — the word was not a colour word at all.";
  }

  function idleControls() {
    startPractice.disabled = false;
    startBlock.disabled = false;
    stopButton.disabled = true;
    paletteSelect.disabled = false;
    mixSelect.disabled = false;
    lengthSelect.disabled = false;
  }

  function runningControls() {
    startPractice.disabled = true;
    startBlock.disabled = true;
    stopButton.disabled = false;
    paletteSelect.disabled = true;
    mixSelect.disabled = true;
    lengthSelect.disabled = true;
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    state.mode = "idle";
    cancelPending();
    state.awaiting = null;
    setResponseEnabled(false);
    showFixation();
    idleControls();

    if (wasPractice) {
      state.practiceDone = true;
      stimulusCaption.textContent = "Practice finished.";
      showFeedback(taskFeedback, "good", "Practice finished.",
        "The scored block gives no feedback until it ends. Every trial still " +
        "waits for your answer — there is no time limit on any of them.");
      startBlock.focus();
      shell.announce("Practice finished. The scored block is available.",
        { immediate: true });
    } else {
      stimulusCaption.textContent = "Block finished. The results are below.";
      taskFeedback.hidden = true;
      recordBlock(state.results, false);
      shell.announce("Block finished. The results are below.",
        { immediate: true });
    }
    updateTrialStatus();
  }

  function stopRun() {
    var wasPractice = state.mode === "practice";
    var collected = state.results.slice();
    cancelPending();
    state.mode = "idle";
    state.awaiting = null;
    setResponseEnabled(false);
    showFixation();
    idleControls();
    stimulusCaption.textContent = wasPractice ? "Practice stopped." : "Block stopped.";
    updateTrialStatus();

    if (!wasPractice && collected.length) {
      recordBlock(collected, true);
      shell.announce("Block stopped. The trials you completed are summarised below.",
        { immediate: true });
    } else {
      shell.announce(wasPractice ? "Practice stopped." : "Block stopped.",
        { immediate: true });
    }
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  /**
   * Summarise one block of trials.
   * Correct responses inside the cleaning window go into the RT means;
   * errors, anticipations and lapses are counted separately.
   */
  function summarise(trials) {
    var byCondition = {};
    var excluded = { errors: 0, anticipations: 0, lapses: 0 };

    CONDITIONS.forEach(function (condition) {
      var all = trials.filter(function (t) { return t.condition === condition; });
      var kept = [];
      all.forEach(function (t) {
        if (!t.correct) { excluded.errors += 1; return; }
        if (t.rt < ANTICIPATION_MS) { excluded.anticipations += 1; return; }
        if (t.rt > LAPSE_MS) { excluded.lapses += 1; return; }
        kept.push(t.rt);
      });
      byCondition[condition] = {
        condition: condition,
        n: all.length,
        nKept: kept.length,
        accuracy: all.length
          ? all.filter(function (t) { return t.correct; }).length / all.length
          : null,
        mean: meanOf(kept),
        median: medianOf(kept),
        sd: sdOf(kept)
      };
    });

    var c = byCondition.congruent.mean;
    var nt = byCondition.neutral.mean;
    var inc = byCondition.incongruent.mean;

    return {
      total: trials.length,
      byCondition: byCondition,
      excluded: excluded,
      interference: (inc === null || nt === null) ? null : inc - nt,
      facilitation: (nt === null || c === null) ? null : nt - c,
      stroop: (inc === null || c === null) ? null : inc - c
    };
  }

  function simulateBlock(spec) {
    var rand = mulberry32(spec.seed);
    var trials = [];
    CONDITIONS.forEach(function (condition) {
      for (var i = 0; i < spec.counts[condition]; i += 1) {
        var rt = spec.base + spec.offsets[condition] +
          normal(rand) * SIM_SHARED.sd +
          exponential(rand, SIM_SHARED.tailMean);
        trials.push({
          condition: condition,
          rt: Math.max(SIM_SHARED.floor, rt),
          correct: rand() < spec.accuracy[condition]
        });
      }
    });
    return trials;
  }

  /* =======================================================================
     Recording and display
     ===================================================================== */

  function recordBlock(trials, partial) {
    var stats = summarise(trials);
    state.blocks.push({
      label: "Block " + (state.blocks.length + 1),
      source: "Your trials",
      palette: PALETTES[state.palette].label,
      mix: MIXES[state.mix].label,
      partial: partial,
      stats: stats
    });
    state.blocksRun += 1;
    showResults(stats, {
      source: "own",
      partial: partial,
      palette: state.palette,
      mix: state.mix
    });
  }

  function loadWorkedExample() {
    var first = null;
    SIM_BLOCKS.forEach(function (spec) {
      var stats = summarise(simulateBlock(spec));
      state.blocks.push({
        label: spec.label,
        source: "Simulated",
        palette: PALETTES[spec.palette].label,
        mix: MIXES[spec.mix].label,
        partial: false,
        stats: stats
      });
      if (!first) { first = stats; }
    });
    showResults(first, { source: "simulated", mix: "balanced", palette: "four" });
  }

  function showResults(stats, meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "Two effects, not one — worked example, simulated"
      : "Two effects, not one — your block";
    renderReadout(stats, meta);
    renderResultsProse(stats, meta);
    renderChart(stats);
    renderRtTable(stats);
    renderBlocksTable();
    renderExcluded(stats);
    resultsSection.hidden = false;
    unlockChallenge();
    $("#results-heading").focus();
  }

  function renderReadout(stats, meta) {
    clear(effectReadout);
    [
      ["Interference (incongruent − neutral)", signedMs(stats.interference)],
      ["Facilitation (neutral − congruent)", signedMs(stats.facilitation)],
      ["The two collapsed (incongruent − congruent)", signedMs(stats.stroop)],
      ["Scored trials in this block", String(stats.total)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      effectReadout.appendChild(cell);
    });

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated data (seed " + SIM_BLOCKS[0].seed + "): "
      : "Your block: ") +
      "mean correct reaction time by condition, with neutral marked as the " +
      "baseline the two effects are measured from";

    var sentences = [];
    if (stats.interference !== null && stats.facilitation !== null) {
      var i = stats.interference;
      var f = stats.facilitation;
      sentences.push(
        "Incongruent trials cost you " + signedMs(i) + " relative to neutral, " +
        "and congruent trials " + (f >= 0 ? "saved you " : "cost you ") +
        Math.abs(Math.round(f)) + " ms relative to neutral.");
      if (i > 0 && f > 0 && i > f * 1.5) {
        sentences.push(
          "Interference is the larger of the two, which is the usual finding: " +
          "a disagreeing word hurts more than an agreeing word helps. That " +
          "asymmetry is itself something an account of the effect has to explain.");
      } else if (i > 0 && f <= 0) {
        sentences.push(
          "Your congruent trials were no faster than neutral. Facilitation is " +
          "the smaller and less reliable of the two effects, and a dozen " +
          "trials per condition will often fail to show it at all.");
      } else if (i <= 0) {
        sentences.push(
          "Your incongruent trials were not slower than neutral. With this " +
          "many trials that happens; it is a statement about the size of the " +
          "noise, not about you.");
      } else {
        sentences.push(
          "Here the two effects are of similar size. Published work usually " +
          "finds interference much the larger; with a dozen trials per " +
          "condition either can come out ahead by chance.");
      }
    }
    sentences.push(
      "Notice what the third figure hides. Incongruent minus congruent is one " +
      "number made of two different things, and without the neutral condition " +
      "there is no way to say how much of it is a cost and how much a benefit.");
    effectText.textContent = sentences.join(" ");

    effectNote.textContent = meta.source === "simulated"
      ? "Simulated values from documented generators with fixed seeds, in " +
        "which the sizes of both effects are set by hand. Not a norm, not a " +
        "published effect size and not anybody's data."
      : "Your own trials, in a browser tab, with uncontrolled display and " +
        "input timing. A difference between two noisy means is mostly noise " +
        "at this number of trials, and nothing here measures anything about you.";
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Two simulated blocks loaded: a balanced mix (seed " +
        SIM_BLOCKS[0].seed + ") and a mostly-incongruent mix (seed " +
        SIM_BLOCKS[1].seed + ")."
      : (meta.partial ? "A partial block. " : "") + "Your block: " +
        stats.total + " scored trials, " + PALETTES[meta.palette].label.toLowerCase() +
        ", " + MIXES[meta.mix].label.toLowerCase() + " mix."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "Simulated. The smaller effect in the second block is built into " +
        "the generator, not discovered by it. Run the same two mixes " +
        "yourself and compare."));
      resultsBody.appendChild(make("p", null,
        "Both seeds were chosen to land near the generator's parameters. " +
        "Even at eighty trials a condition, other seeds give a facilitation " +
        "of zero or below from the same model."));
    } else {
      resultsBody.appendChild(make("p", null,
        "Correct responses between " + ANTICIPATION_MS + " ms and " +
        LAPSE_MS + " ms go into the means. Errors, anticipations and lapses " +
        "are counted separately and listed at the foot of this section rather " +
        "than averaged in silently."));
    }

    var others = state.blocks.filter(function (b) {
      return b.stats.interference !== null;
    });
    if (others.length > 1) {
      resultsBody.appendChild(make("p", null,
        "You now have " + others.length + " blocks to compare. The table " +
        "below lists each one with its own interference and facilitation. " +
        "Two blocks differing in mix also differ in order, practice and " +
        "fatigue, so read the comparison as suggestive rather than as an " +
        "experiment."));
    }
  }

  function renderChart(stats) {
    var W = 460, H = 240;
    var PAD_L = 108, PAD_R = 58, PAD_T = 28, PAD_B = 44;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var rowH = plotH / CONDITIONS.length;
    var barH = Math.min(30, rowH * 0.55);
    clear(rtChart);

    var means = CONDITIONS.map(function (c) { return stats.byCondition[c].mean; })
      .filter(function (v) { return v !== null; });
    if (!means.length) {
      svgNode("text", {
        x: W / 2, y: H / 2, "text-anchor": "middle", class: "chart__axis"
      }, rtChart).textContent = "No usable reaction times in this block.";
      return;
    }

    var top = Math.max.apply(null, means) * 1.18;
    var xAt = function (value) { return PAD_L + (value / top) * plotW; };

    // Axis line and two ticks: enough to show that the bars start at zero.
    svgNode("line", {
      x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH, class: "chart__baseline"
    }, rtChart);
    [0, top].forEach(function (value) {
      svgNode("text", {
        x: xAt(value).toFixed(1), y: H - 24, "text-anchor": "middle",
        class: "chart__axis"
      }, rtChart).textContent = Math.round(value);
    });
    svgNode("text", {
      x: (PAD_L + plotW / 2).toFixed(1), y: H - 6, "text-anchor": "middle",
      class: "chart__axis"
    }, rtChart).textContent = "Mean correct reaction time (ms)";

    CONDITIONS.forEach(function (condition, row) {
      var cell = stats.byCondition[condition];
      var y = PAD_T + row * rowH + (rowH - barH) / 2;

      svgNode("text", {
        x: PAD_L - 8, y: (y + barH / 2 + 4).toFixed(1), "text-anchor": "end",
        class: "chart__label"
      }, rtChart).textContent = CONDITION_LABEL[condition];

      if (cell.mean === null) {
        svgNode("text", {
          x: PAD_L + 6, y: (y + barH / 2 + 4).toFixed(1), class: "chart__count"
        }, rtChart).textContent = "no usable trials";
        return;
      }

      var width = xAt(cell.mean) - PAD_L;
      svgNode("rect", {
        x: PAD_L, y: y.toFixed(1), width: width.toFixed(1), height: barH,
        class: "stroop__bar--" + condition
      }, rtChart);

      // The incongruent bar is hatched as well as differently filled, so the
      // condition it belongs to does not depend on hue.
      if (condition === "incongruent") {
        for (var x = PAD_L + 10; x < PAD_L + width - 2; x += 12) {
          svgNode("line", {
            x1: x.toFixed(1), y1: (y + 2).toFixed(1),
            x2: (x - 8).toFixed(1), y2: (y + barH - 2).toFixed(1),
            class: "stroop__hatch"
          }, rtChart);
        }
      }

      svgNode("text", {
        x: (PAD_L + width + 6).toFixed(1), y: (y + barH / 2 + 4).toFixed(1),
        class: "chart__count"
      }, rtChart).textContent = Math.round(cell.mean);
    });

    // The neutral baseline, drawn across all three rows and labelled.
    var neutral = stats.byCondition.neutral.mean;
    if (neutral !== null) {
      svgNode("line", {
        x1: xAt(neutral).toFixed(1), y1: PAD_T,
        x2: xAt(neutral).toFixed(1), y2: PAD_T + plotH,
        class: "stroop__baseline"
      }, rtChart);
      svgNode("text", {
        x: xAt(neutral).toFixed(1), y: PAD_T - 8,
        "text-anchor": "middle", class: "chart__axis"
      }, rtChart).textContent = "neutral baseline";
    }
  }

  function renderRtTable(stats) {
    clear(rtTable);
    var neutral = stats.byCondition.neutral.mean;
    CONDITIONS.forEach(function (condition) {
      var cell = stats.byCondition[condition];
      var row = make("tr");
      var head = make("th", null, CONDITION_LABEL[condition]);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, pct(cell.accuracy)));
      row.appendChild(make("td", null, ms(cell.mean)));
      row.appendChild(make("td", null, ms(cell.median)));
      row.appendChild(make("td", null, cell.sd === null ? "—" : ms(cell.sd)));
      row.appendChild(make("td", null,
        condition === "neutral" ? "baseline"
          : (cell.mean === null || neutral === null)
            ? "—" : signedMs(cell.mean - neutral)));
      rtTable.appendChild(row);
    });
  }

  function renderBlocksTable() {
    clear(blocksTable);
    state.blocks.forEach(function (block) {
      var row = make("tr");
      var head = make("th", null, block.label + (block.partial ? " (partial)" : ""));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, block.source));
      row.appendChild(make("td", null, block.palette));
      row.appendChild(make("td", null, block.mix));
      row.appendChild(make("td", null, String(block.stats.total)));
      row.appendChild(make("td", null, signedMs(block.stats.interference)));
      row.appendChild(make("td", null, signedMs(block.stats.facilitation)));
      blocksTable.appendChild(row);
    });

    var mixes = {};
    state.blocks.forEach(function (b) { mixes[b.mix] = true; });
    blocksNote.textContent = Object.keys(mixes).length > 1
      ? "You have blocks from more than one mix. Compare their interference " +
        "columns — but remember they also differ in order and practice, so " +
        "this is a comparison, not a controlled experiment."
      : "Run the other trial mix to add a row here. Blocks are kept only in " +
        "this tab and disappear on reload or reset.";
  }

  function renderExcluded(stats) {
    clear(excludedBody);
    var e = stats.excluded;
    excludedBody.appendChild(make("p", null,
      "Errors: " + e.errors + ". Responses under " + ANTICIPATION_MS +
      " ms: " + e.anticipations + ". Responses over " + LAPSE_MS + " ms: " +
      e.lapses + "."));
    excludedBody.appendChild(make("p", null,
      "A response faster than " + ANTICIPATION_MS + " ms cannot be a reaction " +
      "to a display with this many alternatives, and one slower than " +
      LAPSE_MS + " ms is a lapse of a different kind. Both are counted here " +
      "rather than averaged in. The cut-offs are a documented choice, not a " +
      "fact about the data: moving them moves the numbers above."));
    excludedBody.appendChild(make("p", null,
      "Errors are excluded from the reaction-time means and reported as " +
      "accuracy. If accuracy differs between conditions, a difference in mean " +
      "reaction time is harder to interpret, because people can trade one " +
      "against the other."));
  }

  /* =======================================================================
     Buttons
     ===================================================================== */

  startPractice.addEventListener("click", function () {
    cancelPending();
    state.mode = "practice";
    state.index = 0;
    state.queue = practiceBlock(state.palette);
    runningControls();
    beginTrial();
    shell.announce("Practice started: " + PRACTICE_TRIALS +
      " trials with feedback after each one.", { immediate: true });
  });

  startBlock.addEventListener("click", function () {
    cancelPending();
    state.mode = "block";
    state.index = 0;
    state.results = [];
    state.length = Number(lengthSelect.value);
    state.queue = buildBlock(state.length, state.mix, state.palette);
    runningControls();
    beginTrial();
    shell.announce("Block started: " + state.queue.length +
      " trials, no feedback until the end.", { immediate: true });
  });

  stopButton.addEventListener("click", stopRun);

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    state.awaiting = null;
    setResponseEnabled(false);
    showFixation();
    idleControls();
    stimulusCaption.textContent =
      "Worked example loaded below. The experiment is still available.";
    loadWorkedExample();
    updateTrialStatus();
    shell.announce("Worked example loaded: two simulated blocks with fixed seeds.",
      { immediate: true });
  });

  paletteSelect.addEventListener("change", function () {
    state.palette = paletteSelect.value;
    renderResponses();
    shell.announce(PALETTES[state.palette].label +
      " selected: " + PALETTES[state.palette].inks.map(function (k) {
        return INKS[k].name.toLowerCase();
      }).join(", ") + ".", { immediate: true });
  });

  mixSelect.addEventListener("change", function () {
    state.mix = mixSelect.value;
  });

  lengthSelect.addEventListener("change", function () {
    state.length = Number(lengthSelect.value);
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    between: {
      tone: "good", verdict: "That is the usual finding.",
      text: "Neutral sits between the two, which is what allows one effect to " +
        "be split into two: the distance above neutral is interference, the " +
        "distance below it is facilitation. Watch which of the two is larger."
    },
    "with-congruent": {
      tone: "caution", verdict: "Closer than it sounds.",
      text: "Neutral usually does sit nearer congruent than incongruent, " +
        "because facilitation is the smaller effect. But it is generally not " +
        "zero — a matching word does help a little, and that small benefit is " +
        "exactly what a neutral baseline is for."
    },
    "with-incongruent": {
      tone: "caution", verdict: "That would be a strong claim.",
      text: "It would mean an ordinary word such as “chair” interferes as much " +
        "as the word “blue” does when the ink is red. It does not: the cost " +
        "comes from the word naming a competing response, not from there being " +
        "a word at all."
    },
    fastest: {
      tone: "caution", verdict: "Not quite.",
      text: "A non-colour word cannot compete for the colour response, so it " +
        "produces no interference — but it also gives you no help, whereas a " +
        "matching colour word does. That is why neutral is usually slower than " +
        "congruent rather than faster."
    }
  };

  function unlockExperiment(message) {
    idleControls();
    stimulusCaption.textContent = "Ready. Practice first if this is new to you.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose one of the four positions before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockExperiment("Experiment unlocked. Practice is untimed and gives feedback.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The experiment is unlocked. Loading the worked example first is the " +
      "quickest way to show a room both effects and the mix comparison.");
    lockForm(openingForm);
    unlockExperiment("Prediction skipped. Experiment unlocked.");
  });

  /* =======================================================================
     Transfer challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "read-word",
      text: "The instruction is reversed: read the word aloud and ignore the ink it is printed in.",
      answer: "smaller",
      why: "Much smaller, usually close to nothing. Ink colour barely delays " +
        "reading a word; a word substantially delays naming an ink. That " +
        "asymmetry is what the automaticity account was invented to handle."
    },
    {
      id: "proportion",
      text: "Two-thirds of the trials are incongruent instead of one-third.",
      answer: "smaller",
      why: "Smaller. When conflict is the norm the word gets less weight, " +
        "and the gap between conditions shrinks. This is the one row you can " +
        "check here: run both mixes."
    },
    {
      id: "case",
      text: "The words are printed in lower case instead of capitals.",
      answer: "same",
      why: "About the same. Skilled readers handle both cases fluently, so the " +
        "word is still read and still competes. Worth including because not " +
        "every change to a display changes the effect, and predicting which " +
        "ones do is the actual skill."
    },
    {
      id: "vocal",
      text: "Responses are spoken aloud (“blue”) instead of pressed on a keypad.",
      answer: "larger",
      why: "Larger. A spoken colour word competes directly with the word on " +
        "screen; a keypress puts a translation step between them. Effect " +
        "sizes are not comparable across response modes."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["larger", "Larger"],
    ["smaller", "Smaller"],
    ["same", "About the same"]
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
      select.id = "transfer-" + item.id;
      var label = make("label", "visually-hidden",
        "What happens to the effect when: " + item.text);
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

  function unlockChallenge() {
    challengeLock.hidden = true;
    challengeButton.disabled = false;
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0;
    var right = 0;

    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#transfer-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each row, ask what the change does to the " +
        "competition between the word and the ink.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "Every one of these moves the effect without changing anything about the " +
      "person doing the task. That is the strongest reason not to read a " +
      "Stroop difference as a measurement of somebody's cognitive control.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Transfer challenge marked: " + right + " of " +
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
      index: 0,
      queue: [],
      results: [],
      blocks: [],
      blocksRun: 0,
      awaiting: null,
      shownAt: 0,
      palette: DEFAULTS.palette,
      mix: DEFAULTS.mix,
      length: DEFAULTS.length,
      practiceDone: false
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "Two effects, not one";
    clear(blocksTable);
    clear(rtTable);
    clear(rtChart);
    clear(effectReadout);
    clear(resultsBody);
    clear(excludedBody);
    blocksNote.textContent = "";
    effectText.textContent = "";
    effectNote.textContent = "";

    paletteSelect.value = DEFAULTS.palette;
    mixSelect.value = DEFAULTS.mix;
    lengthSelect.value = String(DEFAULTS.length);
    paletteSelect.disabled = true;
    mixSelect.disabled = true;
    lengthSelect.disabled = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    stopButton.disabled = true;

    challengeLock.hidden = false;
    challengeButton.disabled = true;

    stimulusWord.style.setProperty("--ink", "#f2f2f2");
    stimulusWord.textContent = "";
    stimulusCaption.textContent =
      "Answer the question above to unlock the experiment.";

    renderResponses();
    renderChallenge();
    updateTrialStatus();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Every trial waits for your answer, the block can be stopped " +
    "between trials, and the worked example needs no colour responses at all.",
    { immediate: true });
})();
