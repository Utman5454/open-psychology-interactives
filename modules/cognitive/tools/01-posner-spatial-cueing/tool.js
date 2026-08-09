/* =========================================================================
   Posner Spatial Cueing
   -------------------------------------------------------------------------
   A spatial-cueing experiment the student performs, followed by a summary
   that separates the BENEFIT of a valid cue from the COST of an invalid one
   using the neutral condition as the baseline.

   THE TRIAL
   ---------
       fixation only            500 ms
       cue on (one box, or both on neutral trials)   = the cue-to-target
                                                       interval, 100/400/700 ms
       target on                until the learner responds — never timed out

   The cue stays on once it appears and the target stays until answered, so
   the display changes at most twice per trial and never faster than about
   once a second. Nothing animates, nothing flashes, and there is therefore
   nothing for a reduced-motion rule to switch off.

   The cue is carried by three things at once — a much heavier border, the
   accent colour, and a caret glyph printed under the box — so it is legible
   in greyscale and in forced-colours mode.

   THE DESIGN
   ----------
   A third of the trials are neutral. Of the remaining (cued) trials, three in
   four are valid, so the cue is worth using. Target side is balanced within
   every condition. A 48-trial block is therefore 16 neutral, 24 valid and 8
   invalid — and the smallness of that last cell is a teaching point rather
   than an oversight.

   WHY RESULTS ARE WITHHELD UNTIL THE BLOCK ENDS
   ---------------------------------------------
   This is a deliberate exception to the usual rule that a learner should see
   the consequence of what they are doing while they do it. Showing a running
   condition mean during a speeded block would change how people respond to
   the next trial. Practice trials give immediate feedback; scored trials give
   none until the block is over.

   THE NON-TIMED ROUTE
   -------------------
   Nobody has to perform the task. "Load the worked example" fills the same
   results panel from a documented, seeded generator:

       RT = 340 + condition offset + Normal(0, 45) + Exponential(mean 35)
       condition offset:  valid -28, neutral 0, invalid +52
       accuracy:          valid .98, neutral .97, invalid .94
       n = 96 (48 valid, 32 neutral, 16 invalid), seed 20260823

   Ninety-six trials is twice the default block, which is the point: the
   worked example is meant to show the pattern the design is capable of
   producing, and a learner's own 48-trial block is meant to show how much
   noise sits on top of it.

   Those numbers were chosen to make the benefit and the cost legible, with
   the cost larger than the benefit as it usually is in the literature. They
   are illustrative. They are not a norm, an effect size or anybody's data,
   and the page says so wherever they appear.

   ANTICIPATIONS AND LAPSES
   ------------------------
   Responses under 150 ms cannot be reactions to the target; responses over
   2000 ms are lapses of a different kind. Both are counted, reported and kept
   out of the condition means rather than silently averaged in.

   WHAT THIS CANNOT DO
   -------------------
   It cannot measure eye position. Every result here is equally compatible
   with covert orienting and with a small eye movement to the cue. The page
   says so in the hero, in the debrief and in the teaching notes.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* --- Trial timing (milliseconds). Approximate targets: the browser cannot
     guarantee them, which is stated on the page. -------------------------- */
  var FIXATION_MS = 500;
  var PRACTICE_FEEDBACK_MS = 1100;
  var INTER_TRIAL_MS = 350;
  var PRACTICE_TRIALS = 6;

  /* Cleaning bounds, documented in the teaching notes. */
  var ANTICIPATION_MS = 150;
  var LAPSE_MS = 2000;

  /* Design proportions. */
  var NEUTRAL_SHARE = 1 / 3;
  var VALID_SHARE_OF_CUED = 0.75;

  /* Worked-example generator constants. */
  var SIM = {
    seed: 20260823,
    n: 96,
    base: 340,
    offsets: { valid: -28, neutral: 0, invalid: 52 },
    sd: 45,
    tailMean: 35,
    accuracy: { valid: 0.98, neutral: 0.97, invalid: 0.94 },
    floor: 180
  };

  var CONDITIONS = ["valid", "neutral", "invalid"];
  var CONDITION_LABEL = {
    valid: "Valid",
    neutral: "Neutral",
    invalid: "Invalid"
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

  /* Box-Muller: one standard normal draw from two uniforms. */
  function normal(rand) {
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* Exponential draw, used for the right tail that every reaction-time
     distribution has. */
  function exponential(rand, mean) {
    return -mean * Math.log(1 - rand());
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
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
    return value === null || isNaN(value) ? "—" : Math.round(value * 100) + "%";
  }

  function mean(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function median(values) {
    if (!values.length) { return null; }
    var sorted = values.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /* Sample standard deviation: these are estimates from a handful of trials,
     so the n-1 denominator is the right one. */
  function sd(values) {
    if (values.length < 2) { return null; }
    var m = mean(values);
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
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#posner");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var display = $("[data-display]");
  var displayCaption = $("[data-display-caption]");
  var boxes = {
    left: $('[data-box="left"]'),
    right: $('[data-box="right"]')
  };
  var trialStatus = $("[data-trial-status]");
  var taskFeedback = $("[data-task-feedback]");
  var leftButton = $('[data-response="left"]');
  var rightButton = $('[data-response="right"]');
  var startPractice = $('[data-action="start-practice"]');
  var startBlock = $('[data-action="start-block"]');
  var workedExample = $('[data-action="worked-example"]');
  var blockLength = $("#block-length");
  var soaSelect = $("#soa-select");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var chartCaption = $("[data-chart-caption]");
  var rtChart = $("[data-rt-chart]");
  var rtTable = $("[data-rt-table]");
  var effectReadout = $("[data-effect-readout]");
  var effectText = $("[data-effect-text]");
  var effectNote = $("[data-effect-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var DEFAULTS = { blockLength: 48, soa: 400 };

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
     The trial sequence
     ===================================================================== */

  /**
   * Build a balanced, shuffled list of trials.
   * @param {number} total  Number of trials in the block.
   * @returns {Array<{condition:string, targetSide:string, cueSide:string}>}
   */
  function buildTrials(total) {
    var neutralCount = Math.round(total * NEUTRAL_SHARE);
    var cuedCount = total - neutralCount;
    var validCount = Math.round(cuedCount * VALID_SHARE_OF_CUED);
    var invalidCount = cuedCount - validCount;

    var counts = {
      valid: validCount,
      neutral: neutralCount,
      invalid: invalidCount
    };

    var trials = [];
    CONDITIONS.forEach(function (condition) {
      for (var i = 0; i < counts[condition]; i += 1) {
        // Target side is balanced within each condition, so side carries no
        // information about which condition a trial belongs to.
        var targetSide = i % 2 === 0 ? "left" : "right";
        var other = targetSide === "left" ? "right" : "left";
        trials.push({
          condition: condition,
          targetSide: targetSide,
          cueSide: condition === "valid" ? targetSide
            : condition === "invalid" ? other : "both"
        });
      }
    });

    return shuffle(trials);
  }

  function practiceTrials() {
    // Practice deliberately shows all three conditions, twice each, so the
    // learner has met an invalid trial before anything is scored.
    var trials = [];
    CONDITIONS.forEach(function (condition) {
      ["left", "right"].forEach(function (targetSide) {
        var other = targetSide === "left" ? "right" : "left";
        trials.push({
          condition: condition,
          targetSide: targetSide,
          cueSide: condition === "valid" ? targetSide
            : condition === "invalid" ? other : "both"
        });
      });
    });
    return shuffle(trials).slice(0, PRACTICE_TRIALS);
  }

  /* --- Display -------------------------------------------------------- */

  function setFixation(visible) {
    display.setAttribute("data-fixation-visible", visible ? "yes" : "no");
  }

  function setCue(side) {
    boxes.left.setAttribute("data-cued",
      side === "left" || side === "both" ? "yes" : "no");
    boxes.right.setAttribute("data-cued",
      side === "right" || side === "both" ? "yes" : "no");
  }

  function setTarget(side) {
    boxes.left.setAttribute("data-target-visible", side === "left" ? "yes" : "no");
    boxes.right.setAttribute("data-target-visible", side === "right" ? "yes" : "no");
  }

  function clearDisplay() {
    setFixation(false);
    setCue(null);
    setTarget(null);
  }

  function setResponseEnabled(enabled) {
    leftButton.disabled = !enabled;
    rightButton.disabled = !enabled;
  }

  /* --- Running a block ------------------------------------------------- */

  function totalTrials() {
    return state.queue.length;
  }

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.blockDone
        ? "Block complete. Reset to run another one."
        : state.practiceDone
          ? "Practice done. Start the scored block when you are ready."
          : "Not started. Practice first — it is untimed and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial " : "Trial ") +
      (state.index + 1) + " of " + totalTrials() +
      ". Look at the cross; press Left or Right when the disc appears.";
  }

  function beginTrial() {
    var trial = state.queue[state.index];
    state.awaiting = null;
    clearDisplay();
    setFixation(true);
    displayCaption.textContent = "Keep looking at the cross.";
    updateTrialStatus();

    later(function () {
      setCue(trial.cueSide);
      displayCaption.textContent = trial.cueSide === "both"
        ? "Both boxes cued." : "One box cued.";
      later(function () {
        setTarget(trial.targetSide);
        displayCaption.textContent =
          "Target showing. Press Left or Right — there is no time limit.";
        state.awaiting = trial;
        state.shownAt = now();
        setResponseEnabled(true);
      }, state.soa);
    }, FIXATION_MS);
  }

  function respond(side) {
    if (!state.awaiting) { return; }
    var trial = state.awaiting;
    var rt = now() - state.shownAt;
    var correct = side === trial.targetSide;

    state.awaiting = null;
    setResponseEnabled(false);
    setTarget(null);
    setCue(null);

    if (state.mode === "practice") {
      showFeedback(taskFeedback,
        correct ? "good" : "caution",
        correct ? "Correct." : "Other side.",
        "That was " + (trial.condition === "neutral"
          ? "a neutral trial — both boxes were cued, so the cue pointed nowhere."
          : trial.condition === "valid"
            ? "a valid trial — the target appeared in the cued box."
            : "an invalid trial — the target appeared in the box that was not cued.") +
        " Practice trials tell you straight away; scored trials will not.");
    } else {
      state.results.push({
        condition: trial.condition,
        rt: rt,
        correct: correct
      });
    }

    state.index += 1;

    if (state.index >= totalTrials()) {
      finishRun();
    } else {
      later(beginTrial,
        state.mode === "practice" ? PRACTICE_FEEDBACK_MS : INTER_TRIAL_MS);
      updateTrialStatus();
    }
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    state.mode = "idle";
    setResponseEnabled(false);
    clearDisplay();

    if (wasPractice) {
      state.practiceDone = true;
      displayCaption.textContent = "Practice finished.";
      showFeedback(taskFeedback, "good", "Practice finished.",
        "The scored block gives no feedback until it ends, and still has no " +
        "time limit on any trial.");
      startBlock.disabled = false;
      startPractice.disabled = false;
      startBlock.focus();
      shell.announce("Practice finished. The scored block is now available.",
        { immediate: true });
    } else {
      state.blockDone = true;
      displayCaption.textContent = "Block finished. Your results are below.";
      taskFeedback.hidden = true;
      startPractice.disabled = false;
      startBlock.disabled = false;
      showResults(summarise(state.results), {
        source: "block",
        soa: state.soa,
        total: totalTrials()
      });
      shell.announce("Block finished. Your three condition means are below.",
        { immediate: true });
    }
    updateTrialStatus();
  }

  /* =======================================================================
     Summarising a set of trials
     ===================================================================== */

  /**
   * @param {Array<{condition:string, rt:number, correct:boolean}>} trials
   * @returns {object} per-condition statistics plus the cleaning counts
   */
  function summarise(trials) {
    var anticipations = trials.filter(function (t) { return t.rt < ANTICIPATION_MS; });
    var lapses = trials.filter(function (t) { return t.rt > LAPSE_MS; });
    var usable = trials.filter(function (t) {
      return t.rt >= ANTICIPATION_MS && t.rt <= LAPSE_MS;
    });

    var byCondition = {};
    CONDITIONS.forEach(function (condition) {
      var all = usable.filter(function (t) { return t.condition === condition; });
      var correct = all.filter(function (t) { return t.correct; });
      var rts = correct.map(function (t) { return t.rt; });
      byCondition[condition] = {
        n: all.length,
        nCorrect: correct.length,
        accuracy: all.length ? correct.length / all.length : null,
        rts: rts,
        mean: mean(rts),
        median: median(rts),
        sd: sd(rts)
      };
    });

    var usableCorrect = usable.filter(function (t) { return t.correct; }).length;

    return {
      total: trials.length,
      anticipations: anticipations.length,
      lapses: lapses.length,
      usable: usable.length,
      incorrect: usable.length - usableCorrect,
      byCondition: byCondition,
      accuracy: usable.length ? usableCorrect / usable.length : null
    };
  }

  /**
   * Standard error of a difference between two independent condition means.
   * Used to say honestly how much of an observed difference could be noise.
   */
  function seOfDifference(a, b) {
    if (!a.sd || !b.sd || a.rts.length < 2 || b.rts.length < 2) { return null; }
    return Math.sqrt(
      (a.sd * a.sd) / a.rts.length + (b.sd * b.sd) / b.rts.length
    );
  }

  /**
   * A clause describing how a difference compares with the noise on it.
   * Written to complete the sentence "... relative to neutral, <clause>."
   */
  function describeDifference(difference, se) {
    if (difference === null || se === null) {
      return "and there were too few usable trials to judge how much of that is noise";
    }
    var size = Math.abs(difference);
    if (size < se) {
      return "which is smaller than the trial-to-trial noise on it, so this block cannot tell it from zero";
    }
    if (size < 2 * se) {
      return "which is about the size of the noise on it, so it is suggestive at best from one block";
    }
    return "which is comfortably larger than the noise on it in this block";
  }

  /* =======================================================================
     The worked example
     ===================================================================== */

  function simulatedTrials() {
    var rand = mulberry32(SIM.seed);
    var neutralCount = Math.round(SIM.n * NEUTRAL_SHARE);
    var cuedCount = SIM.n - neutralCount;
    var validCount = Math.round(cuedCount * VALID_SHARE_OF_CUED);
    var counts = {
      valid: validCount,
      neutral: neutralCount,
      invalid: cuedCount - validCount
    };

    var trials = [];
    CONDITIONS.forEach(function (condition) {
      for (var i = 0; i < counts[condition]; i += 1) {
        var rt = SIM.base + SIM.offsets[condition] +
          normal(rand) * SIM.sd + exponential(rand, SIM.tailMean);
        trials.push({
          condition: condition,
          rt: Math.max(SIM.floor, rt),
          correct: rand() < SIM.accuracy[condition]
        });
      }
    });
    return trials;
  }

  /* =======================================================================
     Rendering the results
     ===================================================================== */

  function showResults(stats, meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "Worked example — three conditions, simulated"
      : "Your block — three conditions";
    renderResultsProse(stats, meta);
    renderChart(stats);
    renderTable(stats);
    renderEffects(stats, meta);
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);

    var simulated = meta.source === "simulated";
    var valid = stats.byCondition.valid;
    var neutral = stats.byCondition.neutral;
    var invalid = stats.byCondition.invalid;

    if (!valid.rts.length || !neutral.rts.length || !invalid.rts.length) {
      resultsBody.appendChild(make("p", "reveal__lead",
        "There are not enough usable trials in at least one condition to " +
        "summarise this block."));
      resultsBody.appendChild(make("p", null,
        "Of " + stats.total + " trials, " + stats.anticipations +
        " arrived in under " + ANTICIPATION_MS + " ms and " + stats.lapses +
        " took longer than " + LAPSE_MS + " ms. Responses faster than the " +
        "first bound cannot be reactions to the target, and both are kept " +
        "out of the means rather than averaged in. Run the block again, or " +
        "load the worked example, which reaches every conclusion on this " +
        "page without performing the task."));
      return;
    }

    resultsBody.appendChild(make("p", "reveal__lead",
      simulated
        ? "Simulated data, seed " + SIM.seed + ": valid " + ms(valid.mean) +
          ", neutral " + ms(neutral.mean) + ", invalid " + ms(invalid.mean) + "."
        : "Your means: valid " + ms(valid.mean) + ", neutral " +
          ms(neutral.mean) + ", invalid " + ms(invalid.mean) + "."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "These numbers were generated by the model documented at the top of " +
        "tool.js, using a fixed seed so that they are identical every time " +
        "this button is pressed. They are illustrative."));
      resultsBody.appendChild(make("p", null,
        "The example runs " + SIM.n + " trials — twice the default block. " +
        "That is deliberate: it shows the pattern this design is capable of " +
        "producing when there are enough trials to see it. A block you run " +
        "yourself will be noisier, and comparing the two is the more useful " +
        "exercise."));
    } else {
      resultsBody.appendChild(make("p", null,
        "A " + meta.total + "-trial block at a cue-to-target interval of about " +
        meta.soa + " ms, in a browser tab. Reaction times measured this way " +
        "include display and input latency and are illustrative rather than " +
        "psychophysical measurement."));
    }

    if (stats.anticipations || stats.lapses) {
      resultsBody.appendChild(make("p", null,
        stats.anticipations + " response" +
        (stats.anticipations === 1 ? "" : "s") + " arrived in under " +
        ANTICIPATION_MS + " ms and " + stats.lapses + " took longer than " +
        LAPSE_MS + " ms. Nobody reacts to a target in under " +
        ANTICIPATION_MS + " ms, so those are anticipations rather than " +
        "reactions; the slow ones are lapses of attention of a different " +
        "kind. Both are set aside before anything is averaged, and that " +
        "decision is a researcher's choice rather than a measurement."));
    }

    resultsBody.appendChild(make("p", null,
      "Only correct trials contribute to the means, which is the usual " +
      "convention and also a choice: overall accuracy here was " +
      pct(stats.accuracy) + ", so " + stats.incorrect +
      " usable trial" + (stats.incorrect === 1 ? " was" : "s were") +
      " dropped for being wrong."));
  }

  function renderChart(stats) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 460, H = 260;
    var PAD_L = 58, PAD_R = 18, PAD_T = 18, PAD_B = 48;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;

    clear(rtChart);

    var allRts = [];
    CONDITIONS.forEach(function (condition) {
      allRts = allRts.concat(stats.byCondition[condition].rts);
    });
    if (!allRts.length) { return; }

    var lo = Math.min.apply(null, allRts);
    var hi = Math.max.apply(null, allRts);
    var pad = Math.max(20, (hi - lo) * 0.1);

    // Round tick values, so the axis reads 300 / 400 / 500 rather than
    // 306 / 412 / 519. Pick the smallest step that keeps the axis to about
    // four or five gridlines.
    var TICK_STEPS = [25, 50, 100, 150, 200, 250, 500];
    var span = (hi + pad) - Math.max(0, lo - pad);
    var step = TICK_STEPS[TICK_STEPS.length - 1];
    for (var s = 0; s < TICK_STEPS.length; s += 1) {
      if (span / TICK_STEPS[s] <= 5) { step = TICK_STEPS[s]; break; }
    }
    var yMin = Math.max(0, Math.floor((lo - pad) / step) * step);
    var yMax = yMin + Math.ceil(((hi + pad) - yMin) / step) * step;
    var tickCount = Math.round((yMax - yMin) / step);

    var yAt = function (rt) {
      return PAD_T + (1 - (rt - yMin) / (yMax - yMin)) * plotH;
    };
    var xAt = function (index) {
      return PAD_L + (index + 0.5) * (plotW / CONDITIONS.length);
    };

    function add(tag, attributes, text) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attributes).forEach(function (key) {
        node.setAttribute(key, String(attributes[key]));
      });
      if (text !== undefined) { node.textContent = text; }
      rtChart.appendChild(node);
      return node;
    }

    // Y axis: gridlines at round millisecond values.
    for (var g = 0; g <= tickCount; g += 1) {
      var value = yMin + g * step;
      add("line", {
        x1: PAD_L, y1: yAt(value).toFixed(1),
        x2: W - PAD_R, y2: yAt(value).toFixed(1),
        class: "chart__grid"
      });
      add("text", {
        x: PAD_L - 8, y: (yAt(value) + 4).toFixed(1),
        "text-anchor": "end", class: "chart__axis"
      }, Math.round(value) + "");
    }

    // The neutral mean, drawn right across the plot: this is the baseline
    // that makes benefit and cost separable, so it is the one reference line
    // the chart carries.
    var neutralMean = stats.byCondition.neutral.mean;
    if (neutralMean !== null) {
      add("line", {
        x1: PAD_L, y1: yAt(neutralMean).toFixed(1),
        x2: W - PAD_R, y2: yAt(neutralMean).toFixed(1),
        class: "posner__baseline"
      });
    }

    CONDITIONS.forEach(function (condition, index) {
      var cell = stats.byCondition[condition];
      var cx = xAt(index);
      var halfWidth = (plotW / CONDITIONS.length) * 0.3;

      // Every scored trial as a dot, spread deterministically across the
      // column so the trial-to-trial spread is visible rather than implied.
      cell.rts.forEach(function (rt, i) {
        var spread = cell.rts.length > 1 ? (i / (cell.rts.length - 1)) - 0.5 : 0;
        add("circle", {
          cx: (cx + spread * halfWidth * 1.6).toFixed(1),
          cy: yAt(rt).toFixed(1),
          r: 3.2,
          class: "posner__dot"
        });
      });

      if (cell.mean !== null) {
        add("line", {
          x1: (cx - halfWidth).toFixed(1), y1: yAt(cell.mean).toFixed(1),
          x2: (cx + halfWidth).toFixed(1), y2: yAt(cell.mean).toFixed(1),
          class: "posner__mean"
        });
        add("text", {
          x: cx.toFixed(1), y: (yAt(cell.mean) - 10).toFixed(1),
          "text-anchor": "middle", class: "chart__count"
        }, ms(cell.mean));
      }

      add("text", {
        x: cx.toFixed(1), y: H - 26,
        "text-anchor": "middle", class: "chart__label"
      }, CONDITION_LABEL[condition]);
      add("text", {
        x: cx.toFixed(1), y: H - 10,
        "text-anchor": "middle", class: "chart__axis"
      }, "n = " + cell.rts.length);
    });

    add("text", {
      x: 14, y: PAD_T + plotH / 2,
      "text-anchor": "middle", class: "chart__axis",
      transform: "rotate(-90 14 " + (PAD_T + plotH / 2) + ")"
    }, "Reaction time (ms)");
  }

  function renderTable(stats) {
    clear(rtTable);
    CONDITIONS.forEach(function (condition) {
      var cell = stats.byCondition[condition];
      var row = make("tr");
      var head = make("th", null, CONDITION_LABEL[condition]);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null,
        cell.n ? cell.nCorrect + " of " + cell.n + " (" + pct(cell.accuracy) + ")" : "—"));
      row.appendChild(make("td", null, ms(cell.mean)));
      row.appendChild(make("td", null, ms(cell.median)));
      row.appendChild(make("td", null, cell.sd === null ? "—" : ms(cell.sd)));
      rtTable.appendChild(row);
    });
  }

  function renderEffects(stats, meta) {
    var valid = stats.byCondition.valid;
    var neutral = stats.byCondition.neutral;
    var invalid = stats.byCondition.invalid;

    var benefit = (neutral.mean !== null && valid.mean !== null)
      ? neutral.mean - valid.mean : null;
    var cost = (invalid.mean !== null && neutral.mean !== null)
      ? invalid.mean - neutral.mean : null;
    var total = (invalid.mean !== null && valid.mean !== null)
      ? invalid.mean - valid.mean : null;

    var benefitSe = seOfDifference(neutral, valid);
    var costSe = seOfDifference(invalid, neutral);

    clear(effectReadout);
    [
      ["Benefit (neutral − valid)", signedMs(benefit)],
      ["Cost (invalid − neutral)", signedMs(cost)],
      ["Total cueing effect (invalid − valid)", signedMs(total)],
      ["Accuracy overall", pct(stats.accuracy)]
    ].forEach(function (pair) {
      var cellNode = make("div");
      cellNode.appendChild(make("dt", null, pair[0]));
      cellNode.appendChild(make("dd", null, pair[1]));
      effectReadout.appendChild(cellNode);
    });

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated data (seed " + SIM.seed + "): mean"
      : "Your block: mean") +
      " correct reaction time by cue type, with every scored trial plotted " +
      "behind it and the neutral mean drawn across as the baseline";

    var sentences = [];
    if (benefit === null || cost === null) {
      sentences.push(
        "At least one condition has too few usable trials to compare. The " +
        "invalid cell is the smallest in this design, so it runs out first.");
    } else {
      sentences.push(
        (benefit > 0
          ? "Attention already in the right place saved " +
            Math.round(benefit) + " ms relative to neutral, "
          : "Valid trials were not faster than neutral here — " +
            signedMs(benefit) + " on the benefit side, ") +
        describeDifference(benefit, benefitSe) + ".");
      sentences.push(
        (cost > 0
          ? "Having to leave the wrong place cost " +
            Math.round(cost) + " ms relative to neutral, "
          : "Invalid trials were not slower than neutral here — " +
            signedMs(cost) + " on the cost side, ") +
        describeDifference(cost, costSe) + ".");
      sentences.push(
        "Reporting valid against invalid alone would have given a single " +
        "number, " + signedMs(total) + ", which conceals which of those two " +
        "produced it.");
    }
    effectText.textContent = sentences.join(" ");

    effectNote.textContent = meta.source === "simulated"
      ? "Simulated from a fixed seed. Illustrative, not a published effect size."
      : "One block, in a browser tab, with no record of where you were looking.";
  }

  /* =======================================================================
     Feedback helper
     ===================================================================== */

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
    return p;
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
     Opening prediction
     ===================================================================== */

  var OPENING = {
    both: {
      tone: "good",
      verdict: "That is the usual finding.",
      text:
        "Valid fastest, invalid slowest, neutral between. Those are two " +
        "separate effects. Run a block and see which half is larger in yours."
    },
    benefit: {
      tone: "caution",
      verdict: "Half of it, and usually the smaller half.",
      text:
        "The benefit is real. In most published work the cost of an invalid " +
        "cue is the larger of the two. Watch for that asymmetry in your block."
    },
    cost: {
      tone: "caution",
      verdict: "Also half of it.",
      text:
        "Usually the larger half, so this is often nearer the truth than the " +
        "opposite answer. A benefit is normally there too, and the neutral " +
        "baseline is what lets you see both."
    },
    none: {
      tone: "caution",
      verdict: "This is the intuition the paradigm was built to test.",
      text:
        "A reasonable intuition, and the one the paradigm was built to test. " +
        "A cue you never look at usually does matter. Whether your own block " +
        "shows it is a separate question."
    }
  };

  function unlockExperiment(message) {
    startPractice.disabled = false;
    startBlock.disabled = false;
    displayCaption.textContent =
      "Ready. Practice first if you have not done this before.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose one of the four patterns before starting.";
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
      "The experiment is unlocked.");
    lockForm(openingForm);
    unlockExperiment("Prediction skipped. Experiment unlocked.");
  });

  /* =======================================================================
     Running the task
     ===================================================================== */

  leftButton.addEventListener("click", function () { respond("left"); });
  rightButton.addEventListener("click", function () { respond("right"); });

  document.addEventListener("keydown", function (event) {
    if (!state || !state.awaiting) { return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); respond("left"); }
    if (event.key === "ArrowRight") { event.preventDefault(); respond("right"); }
  });

  startPractice.addEventListener("click", function () {
    cancelPending();
    state.mode = "practice";
    state.index = 0;
    state.queue = practiceTrials();
    state.soa = Number(soaSelect.value);
    taskFeedback.hidden = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    beginTrial();
    shell.announce("Practice started. Six untimed trials with feedback.",
      { immediate: true });
  });

  startBlock.addEventListener("click", function () {
    cancelPending();
    state.mode = "block";
    state.index = 0;
    state.results = [];
    state.queue = buildTrials(Number(blockLength.value));
    state.soa = Number(soaSelect.value);
    state.blockDone = false;
    taskFeedback.hidden = true;
    resultsSection.hidden = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    beginTrial();
    shell.announce(
      "Block started. " + state.queue.length +
      " trials, no feedback until the end, no time limit on any trial.",
      { immediate: true });
  });

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    state.awaiting = null;
    setResponseEnabled(false);
    clearDisplay();
    displayCaption.textContent =
      "Worked example loaded below. The task itself is still available.";
    showResults(summarise(simulatedTrials()), { source: "simulated" });
    shell.announce(
      "Worked example loaded. Simulated data with a fixed seed, shown below.",
      { immediate: true });
  });

  /* =======================================================================
     Challenge — four fictional studies, one classification each
     ===================================================================== */

  var CHALLENGE_STUDIES = [
    {
      id: "a", name: "Study A", valid: 402, neutral: 404, invalid: 461,
      answer: "cost",
      why: "Valid is 2 ms faster than neutral, which is nothing. Invalid is " +
        "57 ms slower than neutral. The cue did not help when it was right; " +
        "it hurt when it was wrong. That is a disengagement cost with no " +
        "detectable facilitation."
    },
    {
      id: "b", name: "Study B", valid: 371, neutral: 405, invalid: 409,
      answer: "benefit",
      why: "Valid is 34 ms faster than neutral; invalid is only 4 ms slower. " +
        "Attention already in the right place helped, and being in the wrong " +
        "place cost almost nothing. That is facilitation with no detectable " +
        "cost."
    },
    {
      id: "c", name: "Study C", valid: 378, neutral: 404, invalid: 448,
      answer: "both",
      why: "Valid is 26 ms faster than neutral and invalid is 44 ms slower. " +
        "Both halves are present, and the cost is the larger of the two — " +
        "the pattern most often reported."
    },
    {
      id: "d", name: "Study D", valid: 401, neutral: 403, invalid: 405,
      answer: "neither",
      why: "All three conditions are within 4 ms of each other. Note that " +
        "invalid is still numerically slower than valid, so a study " +
        "reporting only that comparison could describe a 4 ms 'cueing " +
        "effect' — which is why the neutral baseline matters."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["benefit", "A benefit of valid cueing only"],
    ["cost", "A cost of invalid cueing only"],
    ["both", "Both a benefit and a cost"],
    ["neither", "Neither — no cueing effect worth the name"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_STUDIES.forEach(function (study) {
      var row = make("tr");
      var head = make("th", null, study.name);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, study.valid + " ms"));
      row.appendChild(make("td", null, study.neutral + " ms"));
      row.appendChild(make("td", null, study.invalid + " ms"));

      var choiceCell = make("td");
      var select = make("select");
      select.id = "challenge-" + study.id;
      select.setAttribute("data-study", study.id);
      var label = make("label", "visually-hidden",
        "What does the " + study.name + " pattern support?");
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      choiceCell.appendChild(label);
      choiceCell.appendChild(select);
      choiceCell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(choiceCell);
      challengeRows.appendChild(row);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var answered = 0;
    var right = 0;
    CHALLENGE_STUDIES.forEach(function (study) {
      var select = $("#challenge-" + study.id, challengeForm);
      var markNode = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) {
        markNode.textContent = "Not answered yet.";
        return;
      }
      answered += 1;
      var correct = select.value === study.answer;
      if (correct) { right += 1; }
      markNode.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Pick an answer for at least one study. Comparing each condition " +
        "against the neutral row is the whole method here.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_STUDIES.length ? "good" : "caution",
      right + " of " + CHALLENGE_STUDIES.length + " correct" +
      (answered < CHALLENGE_STUDIES.length
        ? " (" + (CHALLENGE_STUDIES.length - answered) + " left blank)." : "."),
      "The method is the same every time: compare each condition against " +
      "neutral, not against each other.");

    var list = make("ul");
    CHALLENGE_STUDIES.forEach(function (study) {
      var item = make("li");
      item.appendChild(make("strong", null, study.name + ": "));
      item.appendChild(document.createTextNode(study.why));
      list.appendChild(item);
    });
    challengeFeedback.appendChild(list);

    challengeFeedback.appendChild(make("p", null,
      "None of these four studies establishes a mechanism. Facilitation and " +
      "disengagement are descriptions of where the effect sits relative to " +
      "baseline; explaining why it sits there needs more than three means."));

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_STUDIES.length + " correct.", { immediate: true });
  });

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
      awaiting: null,
      shownAt: 0,
      soa: DEFAULTS.soa,
      practiceDone: false,
      blockDone: false
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    resultsSection.hidden = true;
    challengeFeedback.hidden = true;

    blockLength.value = String(DEFAULTS.blockLength);
    soaSelect.value = String(DEFAULTS.soa);

    startPractice.disabled = true;
    startBlock.disabled = true;
    setResponseEnabled(false);
    clearDisplay();
    displayCaption.textContent =
      "Answer the question above to unlock the experiment.";

    renderChallenge();
    updateTrialStatus();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. No trial is timed out, and the worked example reaches every " +
      "conclusion on this page without performing the task.",
    { immediate: true });
})();
