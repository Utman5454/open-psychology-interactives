/* =========================================================================
   Visual Search Laboratory
   -------------------------------------------------------------------------
   Two search conditions, three set sizes, target present and absent, and the
   search functions that fall out of them.

   THE STIMULI
   -----------
   Every item is a bar with two independent properties:

       ORIENTATION   upright (0 degrees) or tilted (40 degrees)
       FILL          solid or hollow (outline only)

   The target is always TILTED AND SOLID.

       Feature displays      every distractor is UPRIGHT SOLID, so the target
                             is the only tilted thing on screen and orientation
                             alone identifies it.
       Conjunction displays  half the distractors are UPRIGHT SOLID and half
                             are TILTED HOLLOW, so the target shares fill with
                             one distractor type and orientation with the
                             other. Neither property alone picks it out.

   Neither property is a colour. The whole paradigm therefore survives
   greyscale, colour vision deficiency and forced-colours mode with no
   substitute encoding needed, which is why orientation and fill were chosen
   over the more familiar colour-and-shape version.

   Positions are drawn from an 8 x 5 grid with per-item jitter, so nothing sits
   in a predictable place and the target is never at a fixed location.

   THE DESIGN
   ----------
   Set sizes 8, 16 and 32; target present on half the trials; three trials per
   cell, giving an 18-trial block per condition. Three per cell is far too few
   for a stable slope, and the results panel says so: the point of running your
   own block is to compare its raggedness with the worked example, not to
   estimate anything.

   Displays persist until answered. Nothing is timed out, nothing flashes and
   nothing animates.

   WHY RESULTS ARE WITHHELD UNTIL A BLOCK ENDS
   -------------------------------------------
   A deliberate exception to the usual rule that a learner should see the
   consequence of a manipulation while making it. A running search function on
   screen would change how the next display is searched. The untimed panel
   above the experiment is where manipulation and consequence do sit together.

   THE WORKED EXAMPLE (the non-timed route)
   ----------------------------------------
   Nobody has to perform either block.

       RT = intercept + slope * setSize + Normal(0, sd) + Exponential(tail)

       feature      intercept 430, slope 1.5 (present) / 2.5 (absent),
                    sd 70,  tail 60,  accuracy .98 / .98
       conjunction  intercept 470, slope 24 (present) / 46 (absent),
                    sd 90,  tail 70,  accuracy .94 / .96

       14 trials per cell per condition (84 per condition), seed 20260825.
       That is several times more than a learner's own block, which is the
       point: the example shows what the design produces when there are
       enough trials, and a learner's 18-trial block shows how ragged three
       trials per point really is.

   The absent slopes are set to roughly twice the present slopes because that
   ratio is what is commonly reported. It is built in here rather than
   discovered, and the page says so: the tool illustrates the pattern, it does
   not provide evidence for it.

   These parameters are illustrative. They are not norms, not published
   estimates and not anybody's data.

   CLEANING
   --------
   Responses under 200 ms and over 10000 ms are counted, reported and kept out
   of the means. Only correct trials contribute to reaction-time means.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var SET_SIZES = [8, 16, 32];
  var REPS_PER_CELL = 3;
  var PRACTICE_TRIALS = 4;
  var INTER_TRIAL_MS = 450;
  var PRACTICE_FEEDBACK_MS = 1400;

  var ANTICIPATION_MS = 200;
  var LAPSE_MS = 10000;

  /* Display geometry, in viewBox units. */
  var GRID_COLS = 8;
  var GRID_ROWS = 5;
  var CELL = 60;
  var JITTER = 13;
  var BAR_W = 12;
  var BAR_H = 38;
  var TILT_DEG = 40;

  var CONDITIONS = ["feature", "conjunction"];
  var CONDITION_LABEL = {
    feature: "Feature search",
    conjunction: "Conjunction search"
  };

  var SIM = {
    seed: 20260825,
    repsPerCell: 14,
    feature: {
      intercept: 430, slopePresent: 1.5, slopeAbsent: 2.5,
      sd: 70, tail: 60, accPresent: 0.98, accAbsent: 0.98
    },
    conjunction: {
      intercept: 470, slopePresent: 24, slopeAbsent: 46,
      sd: 90, tail: 70, accPresent: 0.94, accAbsent: 0.96
    },
    floor: 220
  };

  /* =======================================================================
     Seeded randomness (copied, so a downloaded folder keeps working alone)
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

  function normal(rand) {
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function exponential(rand, meanValue) {
    return -meanValue * Math.log(1 - rand());
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svg(tag, attributes, parent) {
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

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function meanOf(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
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

  /**
   * Ordinary least squares of y on x. Returns null when there is no variation
   * in x, which happens if only one set size produced usable trials.
   */
  function regress(points) {
    if (points.length < 2) { return null; }
    var xs = points.map(function (p) { return p.x; });
    var ys = points.map(function (p) { return p.y; });
    var mx = meanOf(xs);
    var my = meanOf(ys);
    var sxx = 0;
    var sxy = 0;
    for (var i = 0; i < points.length; i += 1) {
      sxx += (xs[i] - mx) * (xs[i] - mx);
      sxy += (xs[i] - mx) * (ys[i] - my);
    }
    if (sxx === 0) { return null; }
    var slope = sxy / sxx;
    return { slope: slope, intercept: my - slope * mx, n: points.length };
  }

  /* =======================================================================
     Display generation
     ===================================================================== */

  /**
   * Build one display.
   * @param {string} condition  "feature" | "conjunction"
   * @param {number} setSize    number of items
   * @param {boolean} present   whether the target is included
   * @returns {{items:Array, target:object|null, counts:object}}
   */
  function buildDisplay(condition, setSize, present) {
    var cells = [];
    for (var c = 0; c < GRID_COLS; c += 1) {
      for (var r = 0; r < GRID_ROWS; r += 1) { cells.push({ col: c, row: r }); }
    }
    shuffle(cells);
    var chosen = cells.slice(0, setSize);

    var items = chosen.map(function (cell) {
      return {
        col: cell.col,
        row: cell.row,
        x: cell.col * CELL + CELL / 2 + (Math.random() * 2 - 1) * JITTER,
        y: cell.row * CELL + CELL / 2 + (Math.random() * 2 - 1) * JITTER,
        tilted: false,
        solid: true
      };
    });

    // Distractors. In the conjunction condition half of them are tilted and
    // hollow, so the target's orientation and its fill are each shared with
    // some of the distractors.
    if (condition === "conjunction") {
      items.forEach(function (item, index) {
        if (index % 2 === 1) { item.tilted = true; item.solid = false; }
      });
    }

    var target = null;
    if (present) {
      // The target replaces a randomly chosen item, so it is equally likely to
      // land anywhere in the display.
      target = items[Math.floor(Math.random() * items.length)];
      target.tilted = true;
      target.solid = true;
      target.isTarget = true;
    }

    var counts = {
      uprightSolid: items.filter(function (i) { return !i.tilted && i.solid; }).length,
      tiltedHollow: items.filter(function (i) { return i.tilted && !i.solid; }).length,
      tiltedSolid: items.filter(function (i) { return i.tilted && i.solid; }).length
    };

    return { items: items, target: target, counts: counts, setSize: setSize };
  }

  function drawDisplay(svgNode, display) {
    clear(svgNode);
    display.items.forEach(function (item) {
      svg("rect", {
        x: (-BAR_W / 2).toFixed(1),
        y: (-BAR_H / 2).toFixed(1),
        width: BAR_W,
        height: BAR_H,
        rx: 2,
        class: "search-item" + (item.solid ? "" : " search-item--hollow"),
        transform: "translate(" + item.x.toFixed(1) + " " + item.y.toFixed(1) +
          ") rotate(" + (item.tilted ? TILT_DEG : 0) + ")"
      }, svgNode);
    });
  }

  function markTarget(svgNode, display) {
    if (!display.target) { return; }
    svg("circle", {
      cx: display.target.x.toFixed(1),
      cy: display.target.y.toFixed(1),
      r: 26,
      class: "search-marker"
    }, svgNode);
  }

  function describeDisplay(condition, display) {
    var parts = [
      display.setSize + " items: " + display.counts.uprightSolid +
        " upright solid, " + display.counts.tiltedHollow + " tilted hollow, " +
        display.counts.tiltedSolid + " tilted solid."
    ];
    parts.push(display.target
      ? "The target is present."
      : "The target is absent — no bar is both tilted and solid.");
    if (condition === "feature") {
      parts.push("In this condition every distractor is upright and solid, so " +
        "orientation alone identifies the target.");
    } else {
      parts.push("In this condition the target shares its fill with the " +
        "upright solid bars and its orientation with the tilted hollow ones, " +
        "so neither property alone identifies it.");
    }
    return parts.join(" ").trim();
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var displaysShell = InteractiveShell.attach("#displays");
  var searchShell = InteractiveShell.attach("#search");
  if (!displaysShell || !searchShell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  // Untimed panel
  var inspectType = $("#inspect-type");
  var inspectSize = $("#inspect-size");
  var inspectPresent = $("#inspect-present");
  var newDisplay = $('[data-action="new-display"]');
  var revealTarget = $('[data-action="reveal-target"]');
  var inspectSvg = $("[data-inspect-svg]");
  var inspectCaption = $("[data-inspect-caption]");
  var inspectText = $("[data-inspect-text]");

  // Experiment
  var blockType = $("#block-type");
  var startPractice = $('[data-action="start-practice"]');
  var startBlock = $('[data-action="start-block"]');
  var workedExample = $('[data-action="worked-example"]');
  var searchSvg = $("[data-search-svg]");
  var searchCaption = $("[data-search-caption]");
  var trialStatus = $("[data-trial-status]");
  var taskFeedback = $("[data-task-feedback]");
  var presentButton = $('[data-response="present"]');
  var absentButton = $('[data-response="absent"]');

  // Results
  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var slopeTable = $("[data-slope-table]");
  var slopeText = $("[data-slope-text]");
  var slopeNote = $("[data-slope-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var inspectState = null;
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
     The untimed panel
     ===================================================================== */

  function renderInspect() {
    var condition = inspectType.value;
    var setSize = Number(inspectSize.value);
    var present = inspectPresent.value === "random"
      ? Math.random() < 0.5 : inspectPresent.value === "yes";

    inspectState = buildDisplay(condition, setSize, present);
    inspectState.condition = condition;
    drawDisplay(inspectSvg, inspectState);
    inspectCaption.textContent = CONDITION_LABEL[condition] + " display, " +
      setSize + " items. Nothing here is timed.";
    inspectText.textContent = describeDisplay(condition, inspectState);
    revealTarget.disabled = false;
    displaysShell.announce(
      CONDITION_LABEL[condition] + " display drawn with " + setSize +
      " items. " + (present ? "Target present." : "Target absent."),
      { immediate: true });
  }

  newDisplay.addEventListener("click", renderInspect);

  revealTarget.addEventListener("click", function () {
    if (!inspectState) { return; }
    if (!inspectState.target) {
      inspectText.textContent =
        "There is no target in this display. Every bar is either upright, or " +
        "hollow, or both — none is tilted and solid. " +
        describeDisplay(inspectState.condition, inspectState);
      displaysShell.announce("No target in this display.", { immediate: true });
      return;
    }
    markTarget(inspectSvg, inspectState);
    var where = "row " + (inspectState.target.row + 1) + " of " + GRID_ROWS +
      ", column " + (inspectState.target.col + 1) + " of " + GRID_COLS +
      " (counting from the top left)";
    inspectText.textContent = "The target is ringed: " + where + ". " +
      describeDisplay(inspectState.condition, inspectState);
    displaysShell.announce("Target ringed at " + where + ".", { immediate: true });
  });

  /* =======================================================================
     The experiment
     ===================================================================== */

  function buildTrials(condition) {
    var trials = [];
    SET_SIZES.forEach(function (setSize) {
      [true, false].forEach(function (present) {
        for (var i = 0; i < REPS_PER_CELL; i += 1) {
          trials.push({ condition: condition, setSize: setSize, present: present });
        }
      });
    });
    return shuffle(trials);
  }

  function practiceTrialList(condition) {
    // One of each combination that matters most: smallest and largest set
    // size, target present and absent.
    var trials = [
      { condition: condition, setSize: 8, present: true },
      { condition: condition, setSize: 8, present: false },
      { condition: condition, setSize: 32, present: true },
      { condition: condition, setSize: 32, present: false }
    ];
    return shuffle(trials).slice(0, PRACTICE_TRIALS);
  }

  function totalTrials() { return state.queue.length; }

  function setResponseEnabled(enabled) {
    presentButton.disabled = !enabled;
    absentButton.disabled = !enabled;
  }

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.blocksDone.length
        ? "Blocks finished: " + state.blocksDone.map(function (c) {
            return CONDITION_LABEL[c];
          }).join(", ") + ". Choose a condition and run another if you want."
        : "Not started. Practice first — it is untimed and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial " : "Trial ") +
      (state.index + 1) + " of " + totalTrials() + ", " +
      CONDITION_LABEL[state.condition].toLowerCase() +
      ". Press J if the tilted solid bar is there, F if it is not.";
  }

  function beginTrial() {
    var trial = state.queue[state.index];
    state.awaiting = null;
    clear(searchSvg);
    searchCaption.textContent = "Next display coming.";
    updateTrialStatus();

    later(function () {
      var display = buildDisplay(trial.condition, trial.setSize, trial.present);
      state.display = display;
      drawDisplay(searchSvg, display);
      searchCaption.textContent =
        "Is a tilted solid bar there? J for yes, F for no. No time limit.";
      state.awaiting = trial;
      state.shownAt = now();
      setResponseEnabled(true);
    }, INTER_TRIAL_MS);
  }

  function respond(answer) {
    if (!state.awaiting) { return; }
    var trial = state.awaiting;
    var rt = now() - state.shownAt;
    var correct = (answer === "present") === trial.present;

    state.awaiting = null;
    setResponseEnabled(false);
    clear(searchSvg);

    if (state.mode === "practice") {
      showFeedback(taskFeedback,
        correct ? "good" : "caution",
        correct ? "Correct." : "Not that one.",
        "That display had " + trial.setSize + " items and the target was " +
        (trial.present ? "present" : "absent") + ". Practice tells you " +
        "straight away; the scored block will not until it ends.");
    } else {
      state.results.push({
        condition: trial.condition,
        setSize: trial.setSize,
        present: trial.present,
        rt: rt,
        correct: correct
      });
    }

    state.index += 1;

    if (state.index >= totalTrials()) {
      finishRun();
    } else {
      later(beginTrial,
        state.mode === "practice" ? PRACTICE_FEEDBACK_MS : 0);
      updateTrialStatus();
    }
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    var condition = state.condition;
    state.mode = "idle";
    setResponseEnabled(false);
    clear(searchSvg);

    startPractice.disabled = false;
    startBlock.disabled = false;
    blockType.disabled = false;

    if (wasPractice) {
      searchCaption.textContent = "Practice finished.";
      showFeedback(taskFeedback, "good", "Practice finished.",
        "The scored block is 18 trials with no feedback until it ends, and " +
        "still no time limit on any trial.");
      startBlock.focus();
      searchShell.announce("Practice finished. The scored block is available.",
        { immediate: true });
    } else {
      searchCaption.textContent = "Block finished. The results are below.";
      taskFeedback.hidden = true;
      if (state.blocksDone.indexOf(condition) === -1) {
        state.blocksDone.push(condition);
      }
      // Own data replaces any worked example currently on screen, so the two
      // are never silently mixed.
      if (state.source === "simulated") {
        state.collected = [];
        state.source = "own";
      }
      state.collected = state.collected.filter(function (row) {
        return row.condition !== condition;
      }).concat(state.results);
      showResults(state.collected, "own");
      searchShell.announce("Block finished. Search functions are below.",
        { immediate: true });
    }
    updateTrialStatus();
  }

  presentButton.addEventListener("click", function () { respond("present"); });
  absentButton.addEventListener("click", function () { respond("absent"); });

  document.addEventListener("keydown", function (event) {
    if (!state || !state.awaiting) { return; }
    var key = event.key.toLowerCase();
    if (key === "j") { event.preventDefault(); respond("present"); }
    if (key === "f") { event.preventDefault(); respond("absent"); }
  });

  startPractice.addEventListener("click", function () {
    cancelPending();
    state.mode = "practice";
    state.condition = blockType.value;
    state.index = 0;
    state.queue = practiceTrialList(state.condition);
    taskFeedback.hidden = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    blockType.disabled = true;
    beginTrial();
    searchShell.announce("Practice started: four untimed trials with feedback.",
      { immediate: true });
  });

  startBlock.addEventListener("click", function () {
    cancelPending();
    state.mode = "block";
    state.condition = blockType.value;
    state.index = 0;
    state.results = [];
    state.queue = buildTrials(state.condition);
    taskFeedback.hidden = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    blockType.disabled = true;
    beginTrial();
    searchShell.announce(
      CONDITION_LABEL[state.condition] + " block started: " +
      state.queue.length + " trials, no feedback until the end.",
      { immediate: true });
  });

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    state.awaiting = null;
    setResponseEnabled(false);
    clear(searchSvg);
    searchCaption.textContent =
      "Worked example loaded below. The experiment is still available.";
    state.collected = simulatedTrials();
    state.source = "simulated";
    state.blocksDone = CONDITIONS.slice();
    showResults(state.collected, "simulated");
    updateTrialStatus();
    searchShell.announce(
      "Worked example loaded: simulated data for both conditions.",
      { immediate: true });
  });

  /* =======================================================================
     Simulated data
     ===================================================================== */

  function simulatedTrials() {
    var rand = mulberry32(SIM.seed);
    var trials = [];
    CONDITIONS.forEach(function (condition) {
      var p = SIM[condition];
      SET_SIZES.forEach(function (setSize) {
        [true, false].forEach(function (present) {
          var slope = present ? p.slopePresent : p.slopeAbsent;
          var accuracy = present ? p.accPresent : p.accAbsent;
          for (var i = 0; i < SIM.repsPerCell; i += 1) {
            var rt = p.intercept + slope * setSize +
              normal(rand) * p.sd + exponential(rand, p.tail);
            trials.push({
              condition: condition,
              setSize: setSize,
              present: present,
              rt: Math.max(SIM.floor, rt),
              correct: rand() < accuracy
            });
          }
        });
      });
    });
    return trials;
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function summarise(trials, condition) {
    var mine = trials.filter(function (t) { return t.condition === condition; });
    if (!mine.length) { return null; }

    var anticipations = mine.filter(function (t) { return t.rt < ANTICIPATION_MS; }).length;
    var lapses = mine.filter(function (t) { return t.rt > LAPSE_MS; }).length;
    var usable = mine.filter(function (t) {
      return t.rt >= ANTICIPATION_MS && t.rt <= LAPSE_MS;
    });

    var cells = [];
    SET_SIZES.forEach(function (setSize) {
      [true, false].forEach(function (present) {
        var all = usable.filter(function (t) {
          return t.setSize === setSize && t.present === present;
        });
        var correct = all.filter(function (t) { return t.correct; });
        cells.push({
          setSize: setSize,
          present: present,
          n: all.length,
          nCorrect: correct.length,
          accuracy: all.length ? correct.length / all.length : null,
          mean: meanOf(correct.map(function (t) { return t.rt; }))
        });
      });
    });

    var fits = {};
    [true, false].forEach(function (present) {
      var points = usable.filter(function (t) {
        return t.present === present && t.correct;
      }).map(function (t) { return { x: t.setSize, y: t.rt }; });
      fits[present ? "present" : "absent"] = regress(points);
    });

    return {
      condition: condition,
      total: mine.length,
      anticipations: anticipations,
      lapses: lapses,
      usable: usable.length,
      accuracy: usable.length
        ? usable.filter(function (t) { return t.correct; }).length / usable.length
        : null,
      cells: cells,
      fits: fits
    };
  }

  function showResults(trials, source) {
    var summaries = {};
    CONDITIONS.forEach(function (condition) {
      summaries[condition] = summarise(trials, condition);
    });

    $("#results-heading").textContent = source === "simulated"
      ? "Search functions — worked example, simulated"
      : "Search functions — your blocks";

    renderResultsProse(summaries, source);
    CONDITIONS.forEach(function (condition) {
      var panel = $('[data-panel="' + condition + '"]');
      if (!summaries[condition]) {
        panel.hidden = true;
        return;
      }
      panel.hidden = false;
      renderChart($('[data-chart="' + condition + '"]'), summaries[condition]);
      renderCellTable($('[data-table="' + condition + '"]'), summaries[condition]);
    });
    renderSlopes(summaries, source);

    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderResultsProse(summaries, source) {
    clear(resultsBody);
    var available = CONDITIONS.filter(function (c) { return summaries[c]; });

    if (source === "simulated") {
      resultsBody.appendChild(make("p", "reveal__lead",
        "Simulated data, seed " + SIM.seed + ": " + SIM.repsPerCell +
        " trials per cell in each condition."));
      resultsBody.appendChild(make("p", null,
        "Simulated from a fixed seed. The two-to-one slope ratio is built " +
        "into the generator, not discovered here."));
    } else {
      resultsBody.appendChild(make("p", "reveal__lead",
        available.length === 1
          ? "Your " + CONDITION_LABEL[available[0]].toLowerCase() + " block."
          : "Your feature and conjunction blocks."));
      if (available.length === 1) {
        resultsBody.appendChild(make("p", null,
          "Run the other condition to see both search functions side by side. " +
          "Change the condition in the controls above and start another block."));
      }
      resultsBody.appendChild(make("p", null,
        REPS_PER_CELL + " trials per cell, in a browser tab, on an " +
        "uncontrolled display size. Reaction times measured this way include " +
        "display and input latency, and a slope from " + REPS_PER_CELL +
        " trials per point carries enormous uncertainty. Load the worked " +
        "example and compare how much tidier the same design looks with more " +
        "trials."));
    }

    var cleaningNotes = available.map(function (condition) {
      var summary = summaries[condition];
      return CONDITION_LABEL[condition].toLowerCase() + ": " +
        summary.anticipations + " under " + ANTICIPATION_MS + " ms, " +
        summary.lapses + " over " + LAPSE_MS + " ms, accuracy " +
        pct(summary.accuracy);
    }).join("; ");

    resultsBody.appendChild(make("p", null,
      "Cleaning and accuracy — " + cleaningNotes + ". Responses outside those " +
      "bounds are set aside before anything is averaged, and only correct " +
      "trials contribute to the reaction-time means. Both are researcher " +
      "choices rather than measurements."));
  }

  function renderChart(chartNode, summary) {
    var W = 420, H = 280;
    var PAD_L = 62, PAD_R = 20, PAD_T = 18, PAD_B = 52;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;

    clear(chartNode);

    var means = summary.cells
      .map(function (cell) { return cell.mean; })
      .filter(function (value) { return value !== null; });
    if (!means.length) { return; }

    var lo = Math.min.apply(null, means);
    var hi = Math.max.apply(null, means);
    var pad = Math.max(40, (hi - lo) * 0.15);
    var TICK_STEPS = [50, 100, 200, 250, 500, 1000];
    var span = (hi + pad) - Math.max(0, lo - pad);
    var step = TICK_STEPS[TICK_STEPS.length - 1];
    for (var s = 0; s < TICK_STEPS.length; s += 1) {
      if (span / TICK_STEPS[s] <= 5) { step = TICK_STEPS[s]; break; }
    }
    var yMin = Math.max(0, Math.floor((lo - pad) / step) * step);
    var yMax = yMin + Math.ceil(((hi + pad) - yMin) / step) * step;
    var ticks = Math.round((yMax - yMin) / step);

    var xMin = SET_SIZES[0];
    var xMax = SET_SIZES[SET_SIZES.length - 1];
    var xAt = function (n) { return PAD_L + ((n - xMin) / (xMax - xMin)) * plotW; };
    var yAt = function (rt) {
      return PAD_T + (1 - (rt - yMin) / (yMax - yMin)) * plotH;
    };

    for (var g = 0; g <= ticks; g += 1) {
      var value = yMin + g * step;
      svg("line", {
        x1: PAD_L, y1: yAt(value).toFixed(1),
        x2: W - PAD_R, y2: yAt(value).toFixed(1), class: "chart__grid"
      }, chartNode);
      svg("text", {
        x: PAD_L - 8, y: (yAt(value) + 4).toFixed(1),
        "text-anchor": "end", class: "chart__axis"
      }, chartNode).textContent = String(Math.round(value));
    }

    SET_SIZES.forEach(function (n) {
      svg("text", {
        x: xAt(n).toFixed(1), y: H - 30, "text-anchor": "middle",
        class: "chart__axis"
      }, chartNode).textContent = String(n);
    });
    svg("text", {
      x: (PAD_L + plotW / 2).toFixed(1), y: H - 10,
      "text-anchor": "middle", class: "chart__axis"
    }, chartNode).textContent = "Items on screen";
    svg("text", {
      x: 14, y: (PAD_T + plotH / 2).toFixed(1), "text-anchor": "middle",
      class: "chart__axis",
      transform: "rotate(-90 14 " + (PAD_T + plotH / 2).toFixed(1) + ")"
    }, chartNode).textContent = "Reaction time (ms)";

    [true, false].forEach(function (present) {
      var key = present ? "present" : "absent";
      var points = summary.cells.filter(function (cell) {
        return cell.present === present && cell.mean !== null;
      });
      if (!points.length) { return; }

      if (points.length > 1) {
        svg("path", {
          d: points.map(function (cell, index) {
            return (index === 0 ? "M " : "L ") + xAt(cell.setSize).toFixed(1) +
              " " + yAt(cell.mean).toFixed(1);
          }).join(" "),
          class: "search__line--" + key
        }, chartNode);
      }

      points.forEach(function (cell) {
        if (present) {
          svg("circle", {
            cx: xAt(cell.setSize).toFixed(1), cy: yAt(cell.mean).toFixed(1),
            r: 5, class: "search__point--present"
          }, chartNode);
        } else {
          svg("rect", {
            x: (xAt(cell.setSize) - 5).toFixed(1),
            y: (yAt(cell.mean) - 5).toFixed(1),
            width: 10, height: 10, class: "search__point--absent"
          }, chartNode);
        }
      });

      // Series labelled in place: the line style, the marker shape and the
      // word all carry the same distinction.
      var last = points[points.length - 1];
      svg("text", {
        x: (xAt(last.setSize) - 6).toFixed(1),
        y: (yAt(last.mean) + (present ? 20 : -12)).toFixed(1),
        "text-anchor": "end", class: "chart__label"
      }, chartNode).textContent = present ? "target present" : "target absent";
    });
  }

  function renderCellTable(tableBody, summary) {
    clear(tableBody);
    summary.cells.slice().sort(function (a, b) {
      return a.setSize - b.setSize || (a.present === b.present ? 0 : a.present ? -1 : 1);
    }).forEach(function (cell) {
      var row = make("tr");
      var head = make("th", null, String(cell.setSize));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, cell.present ? "Present" : "Absent"));
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null,
        cell.n ? cell.nCorrect + " of " + cell.n + " (" + pct(cell.accuracy) + ")" : "—"));
      row.appendChild(make("td", null, ms(cell.mean)));
      tableBody.appendChild(row);
    });
  }

  function renderSlopes(summaries, source) {
    clear(slopeTable);
    var rows = 0;
    CONDITIONS.forEach(function (condition) {
      var summary = summaries[condition];
      if (!summary) { return; }
      ["present", "absent"].forEach(function (key) {
        var fit = summary.fits[key];
        var row = make("tr");
        var head = make("th", null, CONDITION_LABEL[condition]);
        head.setAttribute("scope", "row");
        row.appendChild(head);
        row.appendChild(make("td", null, key === "present" ? "Present" : "Absent"));
        row.appendChild(make("td", null, fit ? ms(fit.intercept) : "—"));
        row.appendChild(make("td", null,
          fit ? fit.slope.toFixed(1) + " ms/item" : "—"));
        row.appendChild(make("td", null, fit ? String(fit.n) : "0"));
        slopeTable.appendChild(row);
        rows += 1;
      });
    });

    if (!rows) {
      slopeText.textContent = "No usable trials yet.";
      slopeNote.textContent = "";
      return;
    }

    var sentences = [];
    var feature = summaries.feature;
    var conjunction = summaries.conjunction;

    if (feature && feature.fits.present) {
      sentences.push("Feature search added about " +
        feature.fits.present.slope.toFixed(1) +
        " ms per extra item on target-present trials.");
    }
    if (conjunction && conjunction.fits.present) {
      sentences.push("Conjunction search added about " +
        conjunction.fits.present.slope.toFixed(1) + " ms per extra item.");
    }
    if (feature && conjunction && feature.fits.present && conjunction.fits.present) {
      // A difference rather than a ratio: the feature slope sits near zero, so
      // a ratio against it is wildly unstable and would read as precision the
      // estimate does not have.
      var gap = conjunction.fits.present.slope - feature.fits.present.slope;
      sentences.push(gap > 5
        ? "The conjunction slope is about " + gap.toFixed(0) +
          " ms per item steeper, from displays that differ only in what the " +
          "distractors are."
        : "The two slopes do not separate cleanly here, which is what a few " +
          "trials per point often produces.");
    }

    ["feature", "conjunction"].forEach(function (condition) {
      var summary = summaries[condition];
      if (!summary || !summary.fits.present || !summary.fits.absent) { return; }
      var presentSlope = summary.fits.present.slope;
      var absentSlope = summary.fits.absent.slope;
      if (Math.abs(presentSlope) < 0.5) { return; }
      sentences.push("In " + CONDITION_LABEL[condition].toLowerCase() +
        " the absent slope was " + absentSlope.toFixed(1) +
        " ms/item against " + presentSlope.toFixed(1) +
        " for present, a ratio of " + (absentSlope / presentSlope).toFixed(1) +
        ".");
    });

    slopeText.textContent = sentences.join(" ");

    slopeNote.textContent = source === "simulated"
      ? "Simulated, with the two-to-one ratio built in. A ratio near two " +
        "fits self-terminating serial search — and several other accounts."
      : "Three trials per point. A negative or wildly large slope here is " +
        "noise, not a finding.";
  }

  /* =======================================================================
     Feedback helpers
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
     Opening prediction
     ===================================================================== */

  var OPENING = {
    dissociate: {
      tone: "good",
      verdict: "That is the classic pattern.",
      text:
        "Feature search is close to flat and conjunction search is steep. " +
        "Watch how much steeper, and watch what the target-absent trials do — " +
        "they are usually steeper again."
    },
    both: {
      tone: "caution",
      verdict: "Reasonable, and it is half right.",
      text:
        "More items really is more work in the conjunction condition. What is " +
        "surprising is that it is almost free in the feature condition: " +
        "adding twenty-four items barely moves the reaction time at all."
    },
    reverse: {
      tone: "caution",
      verdict: "The other way round.",
      text:
        "The conjunction target is the harder one to find, because neither of " +
        "its two properties picks it out on its own. Look at a 32-item " +
        "display of each in the panel below before you run anything."
    },
    neither: {
      tone: "caution",
      verdict: "True for one condition only.",
      text:
        "A single distinguishing feature does behave roughly like that. A " +
        "target defined by a combination of two features does not, and the " +
        "difference between those two cases is the finding this design was " +
        "built to produce."
    }
  };

  function unlockPage(message) {
    [inspectType, inspectSize, inspectPresent, newDisplay,
      blockType, startPractice, startBlock].forEach(function (control) {
      control.disabled = false;
    });
    inspectCaption.textContent = "Press New display to draw one.";
    searchCaption.textContent =
      "Ready. Practice first if you have not done this before.";
    searchShell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose one of the four patterns before going on. Committing to an " +
        "answer first is the point of this step.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockPage("Laboratory unlocked. Look at some displays before timing anything.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "Everything is unlocked. If you are running this with a group, take the " +
      "prediction aloud before you show a display — the contrast lands harder " +
      "when the room has committed to an answer.");
    lockForm(openingForm);
    unlockPage("Prediction skipped. Laboratory unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_CLAIMS = [
    {
      id: "steeper",
      text: "Adding items slowed conjunction search far more than it slowed feature search.",
      answer: "supported",
      why: "This is a description of the two search functions, and it is what " +
        "the data show. It is also the least committal thing you can say " +
        "about them, which is why it is the safest."
    },
    {
      id: "flat",
      text: "Feature search is completely unaffected by the number of items.",
      answer: "beyond",
      why: "The feature slope is small, but it is not zero, and it is " +
        "measured with error. \"Small\" is what the data support; " +
        "\"completely unaffected\" is a stronger claim than any finite sample " +
        "can establish."
    },
    {
      id: "serial",
      text: "Conjunction search must proceed one item at a time.",
      answer: "beyond",
      why: "A steep slope is consistent with an item-by-item scan, and also " +
        "with a limited-capacity process that handles everything at once but " +
        "less well as competition grows. The slope does not choose between " +
        "them."
    },
    {
      id: "absent",
      text: "Target-absent trials produced a steeper slope than target-present trials.",
      answer: "supported",
      why: "Again a description rather than an explanation. Note that the " +
        "worked example has this ratio built into its generator, so the " +
        "simulated data illustrate the pattern rather than evidencing it; " +
        "your own block, if you ran one, is the only place it could show up " +
        "by itself."
    },
    {
      id: "faster",
      text: "Adding items made feature search faster.",
      answer: "contradicted",
      why: "The feature slope is small and positive. A negative slope in " +
        "somebody's own 18-trial block is noise, not a finding — which is " +
        "itself worth knowing about small samples."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["supported", "Supported by data like these"],
    ["beyond", "Goes beyond what these data can show"],
    ["contradicted", "Contradicted by data like these"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_CLAIMS.forEach(function (claim) {
      var row = make("tr");
      var head = make("th", null, claim.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);

      var cell = make("td");
      var select = make("select");
      select.id = "claim-" + claim.id;
      var label = make("label", "visually-hidden",
        "How does the evidence bear on the claim: " + claim.text);
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
    var answered = 0;
    var right = 0;

    CHALLENGE_CLAIMS.forEach(function (claim) {
      var select = $("#claim-" + claim.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === claim.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. The useful question each time is whether the " +
        "claim describes the numbers or explains them.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_CLAIMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_CLAIMS.length + " correct" +
      (answered < CHALLENGE_CLAIMS.length
        ? " (" + (CHALLENGE_CLAIMS.length - answered) + " left blank)." : "."),
      "The dividing line is between describing a search function and " +
      "explaining it. Descriptions are supported; mechanisms are not.");

    var list = make("ul");
    CHALLENGE_CLAIMS.forEach(function (claim) {
      var item = make("li");
      item.appendChild(make("strong", null, "“" + claim.text + "” "));
      item.appendChild(document.createTextNode(claim.why));
      list.appendChild(item);
    });
    challengeFeedback.appendChild(list);

    searchShell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_CLAIMS.length + " correct.", { immediate: true });
  });

  /* =======================================================================
     Reset
     ===================================================================== */

  function resetInspectPanel() {
    inspectState = null;
    clear(inspectSvg);
    inspectText.textContent = "A description of the display will appear here.";
    revealTarget.disabled = true;
    inspectType.value = "feature";
    inspectSize.value = "16";
    inspectPresent.value = "yes";
    inspectCaption.textContent = newDisplay.disabled
      ? "Answer the question above to unlock this panel."
      : "Press New display to draw one.";
  }

  displaysShell.onReset(resetInspectPanel);

  searchShell.onReset(function () {
    cancelPending();
    state = {
      mode: "idle",
      condition: "feature",
      index: 0,
      queue: [],
      results: [],
      collected: [],
      blocksDone: [],
      source: null,
      awaiting: null,
      shownAt: 0,
      display: null
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    resultsSection.hidden = true;
    challengeFeedback.hidden = true;
    CONDITIONS.forEach(function (condition) {
      $('[data-panel="' + condition + '"]').hidden = true;
    });

    blockType.value = "feature";
    blockType.disabled = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    setResponseEnabled(false);
    clear(searchSvg);
    searchCaption.textContent =
      "Answer the question above to unlock the experiment.";

    [inspectType, inspectSize, inspectPresent, newDisplay].forEach(
      function (control) { control.disabled = true; });
    resetInspectPanel();

    renderChallenge();
    updateTrialStatus();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  searchShell.reset({ silent: true });
  searchShell.announce(
    "Ready. No trial is timed out, and the worked example reaches every " +
      "conclusion on this page without performing the task.",
    { immediate: true });
})();
