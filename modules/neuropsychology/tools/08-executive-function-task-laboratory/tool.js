/* =========================================================================
   Executive Function Task Laboratory
   -------------------------------------------------------------------------
   Two staged experiments on four original executive tasks and six capacities.

     Experiment 1  For each task, the learner ticks which processes they think
                   it needs, then reveals the model's weights. Every task
                   requires at least five of the six.
     Experiment 2  Six capacity sliders plus a strategy slider. Reduce one
                   capacity and watch all four task scores.

   THE EDUCATIONAL MODEL
   ---------------------
   Each task is a set of weights w(i) on the six capacities. Each capacity has
   a level c(i) between 0 and 1, where 1 is typical. The simulated score is a
   weighted average expressed as a percentage:

       score = 100 x sum( w(i) x c(i) ) / sum( w(i) )

   With every capacity at 1 every task scores 100, so any drop is attributable
   to the sliders and to nothing else.

   THE TWO THINGS THIS MAKES VISIBLE
   ---------------------------------
     1. No row of the matrix has fewer than five non-zero weights. There is no
        pure executive task, which is the central finding of the literature
        rather than an artefact of this model.
     2. The mapping from "lowest task" to "reduced capacity" is many-to-one.
        Reducing inhibition alone and reducing processing speed alone both make
        the colour-word task the lowest of the four; reducing updating alone
        and reducing sustained effort alone both make the running-total task
        the lowest. The tool computes which single reductions share the current
        lowest task rather than asserting it.

   THE STRATEGY SLIDER
   -------------------
   For the two timed tasks the summary score is split into an accuracy figure
   and a speed figure that move in opposite directions by the same amount:

       accuracy = score - 12 x s        speed = score + 12 x s

   where s runs from -1 (accuracy first) to +1 (speed first). The summary score
   is their mean and therefore does not move at all. Two people with identical
   scores can be doing entirely different things.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   The weights are an argument about task demands, not measured loadings.
   Six capacities is fewer than the literature separates. A weighted average
   has no thresholds, no floor or ceiling effects and no interactions between
   capacities. Nobody performs these tasks; no standardised test, subtest or
   item is reproduced; and no anatomy is mentioned anywhere.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var STRATEGY_SWING = 12;   /* points traded between accuracy and speed */
  var REDUCED = 0.35;        /* the level a "reduced" capacity is set to */

  var CAPACITIES = [
    { id: "inhibit", name: "Holding back an automatic response", short: "Inhibition" },
    { id: "switch", name: "Switching between rules", short: "Switching" },
    { id: "update", name: "Keeping a changing total in mind", short: "Updating" },
    { id: "plan", name: "Planning several steps ahead", short: "Planning" },
    { id: "speed", name: "Sheer speed of processing", short: "Processing speed" },
    { id: "effort", name: "Keeping going without lapses", short: "Sustained effort" }
  ];

  var TASKS = [
    {
      id: "conflict", name: "Colour-word conflict task", short: "Colour-word",
      timed: true,
      description:
        "Words naming colours are printed in a different colour. Say the ink " +
        "colour, as fast as you can, for three minutes.",
      weights: { inhibit: 0.9, switch: 0.1, update: 0.15, plan: 0, speed: 0.7, effort: 0.5 }
    },
    {
      id: "sorting", name: "Rule-change sorting task", short: "Rule change",
      timed: true,
      description:
        "Sort cards by a rule you have to work out from feedback. Without " +
        "warning the rule changes, and you have to work out the new one.",
      weights: { inhibit: 0.5, switch: 0.9, update: 0.4, plan: 0.2, speed: 0.3, effort: 0.5 }
    },
    {
      id: "running", name: "Running-total task", short: "Running total",
      timed: false,
      description:
        "Hear a long stream of numbers and keep a running total of only the " +
        "last three, reporting it whenever asked.",
      weights: { inhibit: 0.3, switch: 0.1, update: 0.9, plan: 0, speed: 0.5, effort: 0.6 }
    },
    {
      id: "discs", name: "Disc-moving puzzle", short: "Disc puzzle",
      timed: false,
      description:
        "Move discs between three pegs to reach a shown arrangement, in as few " +
        "moves as possible, moving one disc at a time.",
      weights: { inhibit: 0.5, switch: 0.2, update: 0.6, plan: 0.9, speed: 0.15, effort: 0.4 }
    }
  ];

  var PRESETS = [
    { id: "typical", label: "Everything typical", set: {},
      note: "All six capacities at their typical level. Every task scores 100." },
    { id: "inhibit", label: "Reduced inhibition only", set: { inhibit: REDUCED },
      note: "One capacity reduced. Note which task comes out lowest." },
    { id: "speed", label: "Reduced processing speed only", set: { speed: REDUCED },
      note: "A different capacity, and the same task comes out lowest." },
    { id: "update", label: "Reduced updating only", set: { update: REDUCED },
      note: "The running-total task is lowest here." },
    { id: "effort", label: "Reduced sustained effort only", set: { effort: REDUCED },
      note: "A different capacity again, and the running-total task is lowest again." },
    { id: "broad", label: "Everything mildly reduced", set: {
      inhibit: 0.75, switch: 0.75, update: 0.75, plan: 0.75, speed: 0.75, effort: 0.75 },
      note: "Every task at 75. Uniformly low profiles are common and identify nothing." }
  ];

  /* =======================================================================
     The model
     ===================================================================== */

  function scoreOf(task, levels) {
    var total = 0;
    var weighted = 0;
    CAPACITIES.forEach(function (capacity) {
      var w = task.weights[capacity.id];
      total += w;
      weighted += w * levels[capacity.id];
    });
    return total === 0 ? 100 : 100 * weighted / total;
  }

  function allScores(levels) {
    return TASKS.map(function (task) {
      return { task: task, score: scoreOf(task, levels) };
    });
  }

  function lowestTask(levels) {
    return allScores(levels).reduce(function (low, row) {
      return row.score < low.score - 0.001 ? row : low;
    }).task;
  }

  /** Which single-capacity reductions make the same task the lowest? */
  function sharersOfLowest(levels) {
    var target = lowestTask(levels).id;
    return CAPACITIES.filter(function (capacity) {
      var trial = {};
      CAPACITIES.forEach(function (other) {
        trial[other.id] = other.id === capacity.id ? REDUCED : 1;
      });
      return lowestTask(trial).id === target;
    });
  }

  function typicalLevels() {
    var levels = {};
    CAPACITIES.forEach(function (capacity) { levels[capacity.id] = 1; });
    return levels;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  var NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(x, y, className, anchor, text) {
    var node = svgEl("text", { x: x, y: y, class: className, "text-anchor": anchor });
    node.textContent = text;
    return node;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#exec");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var track = $("[data-track]");
  var stageTitle = $("[data-stage-title]");
  var stageBrief = $("[data-stage-brief]");
  var oneControls = $("[data-stage-one-controls]");
  var twoControls = $("[data-stage-two-controls]");
  var onePrimary = $("[data-stage-one-primary]");
  var twoPrimary = $("[data-stage-two-primary]");
  var taskControls = $("[data-task-controls]");
  var processControls = $("[data-process-controls]");
  var presetHost = $("[data-presets]");
  var capacityControls = $("[data-capacity-controls]");
  var strategyRange = $("#strategy-range");
  var weightsSvg = $("[data-weights]");
  var weightsText = $("[data-weights-text]");
  var weightsHeading = $("[data-weights-heading]");
  var scoresSvg = $("[data-scores]");
  var scoresText = $("[data-scores-text]");
  var stageFeedback = $("[data-stage-feedback]");
  var interpretation = $("[data-interpretation]");
  var interpretationBody = $("[data-interpretation-body]");
  var tableHeading = $("[data-table-heading]");
  var tableNote = $("[data-table-note]");
  var tableHead = $("[data-table-head]");
  var mainTable = $("[data-main-table]");
  var matrixHead = $("[data-matrix-head]");
  var matrixTable = $("[data-matrix-table]");
  var revealProgress = $("[data-reveal-progress]");
  var toStageTwo = $('[data-action="to-stage-two"]');
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = {
    stage: 1,
    taskIndex: 0,
    ticks: {},          /* ticks[taskId][capacityId] = true */
    revealed: {},       /* revealed[taskId] = true */
    levels: typicalLevels(),
    strategy: 0
  };

  function currentTask() { return TASKS[state.taskIndex]; }

  /* --- Controls, built once --------------------------------------------- */

  TASKS.forEach(function (task, index) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "task";
    input.value = task.id;
    input.checked = index === 0;
    input.addEventListener("change", function () {
      state.taskIndex = index;
      stageFeedback.hidden = true;
      syncTicks();
      render();
      shell.announce(task.name + ". " + task.description, { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(task.name));
    taskControls.appendChild(label);
  });

  CAPACITIES.forEach(function (capacity) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("data-process", capacity.id);
    input.addEventListener("change", function () {
      var task = currentTask();
      if (!state.ticks[task.id]) { state.ticks[task.id] = {}; }
      state.ticks[task.id][capacity.id] = input.checked;
      if (!input.checked) { delete state.ticks[task.id][capacity.id]; }
      render();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(capacity.name));
    processControls.appendChild(label);
  });

  function syncTicks() {
    var ticks = state.ticks[currentTask().id] || {};
    Array.prototype.forEach.call(
      processControls.querySelectorAll("[data-process]"),
      function (input) {
        input.checked = Boolean(ticks[input.getAttribute("data-process")]);
      });
  }

  PRESETS.forEach(function (preset) {
    var button = make("button", "button button--secondary", preset.label);
    button.type = "button";
    button.addEventListener("click", function () {
      state.levels = typicalLevels();
      Object.keys(preset.set).forEach(function (id) {
        state.levels[id] = preset.set[id];
      });
      syncCapacitySliders();
      render();
      shell.announce(preset.label + ". " + preset.note, { immediate: true });
    });
    presetHost.appendChild(button);
  });

  var capacityInputs = {};
  CAPACITIES.forEach(function (capacity) {
    var wrap = make("div", "control");
    var header = make("div", "control__header");
    var label = make("label", "control__label", capacity.short);
    label.setAttribute("for", "cap-" + capacity.id);
    var output = document.createElement("output");
    output.className = "control__value";
    output.setAttribute("for", "cap-" + capacity.id);
    header.appendChild(label);
    header.appendChild(output);
    wrap.appendChild(header);

    var input = document.createElement("input");
    input.type = "range";
    input.id = "cap-" + capacity.id;
    input.min = "20";
    input.max = "100";
    input.step = "5";
    input.value = "100";
    wrap.appendChild(input);
    capacityControls.appendChild(wrap);
    capacityInputs[capacity.id] = input;

    shell.bindRange(input, {
      format: function (v) { return v + "%"; },
      describe: function (v) {
        return capacity.short + " at " + v + " per cent of the typical level";
      },
      onInput: function (v) {
        state.levels[capacity.id] = v / 100;
        if (state.stage === 2 && !suspendRender) { render(); }
      }
    });
  });

  /* Assigning to input.value does not fire an input event, so the bound
     <output> would go on showing the old number. Dispatching one fixes that;
     the suspend flag stops the six dispatches triggering six redraws. */
  var suspendRender = false;

  function syncCapacitySliders() {
    suspendRender = true;
    CAPACITIES.forEach(function (capacity) {
      var input = capacityInputs[capacity.id];
      input.value = String(Math.round(state.levels[capacity.id] * 100));
      input.dispatchEvent(new Event("input"));
    });
    suspendRender = false;
  }

  shell.bindRange(strategyRange, {
    format: function (v) {
      return v === 0 ? "balanced" : v < 0 ? "accuracy first" : "speed first";
    },
    describe: function (v) {
      return v === 0 ? "balanced between accuracy and speed"
        : v < 0 ? "leaning towards accuracy, " + Math.abs(v) + " per cent"
          : "leaning towards speed, " + v + " per cent";
    },
    onInput: function (v) {
      state.strategy = v / 100;
      if (state.stage === 2) { render(); }
    }
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (state.stage === 1) { reveal(); }
  });

  toStageTwo.addEventListener("click", function () { goToStage(2); });
  $('[data-action="to-stage-one"]').addEventListener("click", function () {
    goToStage(1);
  });

  function goToStage(stage) {
    state.stage = stage;
    stageFeedback.hidden = true;
    render();
    shell.announce(stage === 1
      ? "Experiment 1. Predict what each task needs."
      : "Experiment 2. Reduce a capacity and watch all four tasks.",
      { immediate: true });
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    oneControls.hidden = state.stage !== 1;
    twoControls.hidden = state.stage !== 2;
    onePrimary.hidden = state.stage !== 1;
    twoPrimary.hidden = state.stage !== 2;

    Array.prototype.forEach.call(track.children, function (item, index) {
      item.removeAttribute("aria-current");
      item.removeAttribute("data-state");
      if (index + 1 < state.stage) { item.setAttribute("data-state", "done"); }
      if (index + 1 === state.stage) { item.setAttribute("aria-current", "step"); }
    });

    if (state.stage === 1) { renderStageOne(); } else { renderStageTwo(); }
    renderMatrix();
  }

  function renderStageOne() {
    var task = currentTask();
    var revealed = Boolean(state.revealed[task.id]);
    var count = Object.keys(state.revealed).length;

    stageTitle.textContent = "Experiment 1 - what each task needs";
    stageBrief.textContent = task.description;
    weightsHeading.textContent = revealed
      ? "What the model says " + task.short.toLowerCase() + " needs"
      : "Tick your prediction, then reveal";
    tableHeading.textContent = "Your prediction against the model";
    tableNote.textContent =
      "A shaded row is one where your tick and the model disagree. The " +
      "weights are an argument about task demands, so a disagreement is worth " +
      "arguing about rather than a mistake.";
    revealProgress.textContent = count + " of " + TASKS.length +
      " tasks revealed." + (count === TASKS.length
        ? " Experiment 2 is now available."
        : "");
    toStageTwo.disabled = count < TASKS.length;

    drawWeights(task, revealed);
    renderPredictionTable(task, revealed);

    interpretation.hidden = !revealed;
    if (revealed) {
      var nonZero = CAPACITIES.filter(function (c) {
        return task.weights[c.id] > 0;
      }).length;
      interpretationBody.textContent =
        task.name + " loads on " + nonZero + " of the six capacities. No task " +
        "in this set loads on fewer than five: a task named after a process " +
        "requires that process and several others.";
      interpretation.setAttribute("data-tone", "caution");
    }
  }

  function renderStageTwo() {
    var rows = allScores(state.levels);
    var lowest = lowestTask(state.levels);
    var sharers = sharersOfLowest(state.levels);
    var spread = Math.max.apply(null, rows.map(function (r) { return r.score; })) -
      Math.min.apply(null, rows.map(function (r) { return r.score; }));

    stageTitle.textContent = "Experiment 2 - taking a capacity away";
    stageBrief.textContent =
      "Every capacity starts at its typical level, where all four tasks score " +
      "100. Reduce one and watch which tasks notice, and by how much.";
    tableHeading.textContent = "The four tasks at these settings";
    tableNote.textContent =
      "On this scale 100 is the typical level, not a ceiling. For the two " +
      "timed tasks, the accuracy and speed columns are the summary score with " +
      "the strategy setting traded between them; the summary score is their " +
      "mean.";

    drawScores(rows);
    renderScoreTable(rows);

    interpretation.hidden = false;
    if (spread < 0.5) {
      interpretationBody.textContent =
        "All four tasks score the same. Either nothing is reduced or " +
        "everything is reduced equally, and a uniformly low profile identifies " +
        "nothing. Reduce one capacity on its own.";
      interpretation.setAttribute("data-tone", "neutral");
    } else {
      interpretationBody.textContent =
        "The lowest score is " + lowest.name.toLowerCase() + ", at " +
        rows.filter(function (r) { return r.task.id === lowest.id; })[0].score.toFixed(0) +
        ". Reducing " + sharers.map(function (c) { return c.short.toLowerCase(); })
          .join(" on its own, or reducing ") + " on its own, each makes that " +
        "the lowest of the four" +
        (sharers.length > 1
          ? " - so knowing which task came out lowest does not tell you which " +
            "capacity was reduced."
          : ", and no other single reduction does, which makes this the one " +
            "pattern in the set that does point somewhere.") +
        (Math.abs(state.strategy) > 0.001
          ? " The strategy setting has moved accuracy and speed apart on the " +
            "two timed tasks without moving either summary score at all."
          : "");
      interpretation.setAttribute("data-tone",
        sharers.length > 1 ? "warn" : "caution");
    }
  }

  /* Horizontal weight bars, with the learner's ticks marked before the reveal
     and kept visible after it. */
  function drawWeights(task, revealed) {
    var LABEL = 190, AXIS_START = 198, AXIS_END = 396;
    var ROW = 28, TOP = 8;
    var ticks = state.ticks[task.id] || {};

    clear(weightsSvg);
    var axisY = TOP + CAPACITIES.length * ROW + 4;
    weightsSvg.setAttribute("viewBox", "0 0 460 " + (axisY + 26));

    CAPACITIES.forEach(function (capacity, index) {
      var y = TOP + index * ROW;
      var mid = y + ROW / 2;
      var weight = task.weights[capacity.id];

      weightsSvg.appendChild(
        svgText(LABEL, mid + 4, "chart__count", "end", capacity.short));

      weightsSvg.appendChild(svgEl("rect", {
        x: AXIS_START, y: mid - 8, width: AXIS_END - AXIS_START, height: 16,
        class: "chart__track"
      }));

      if (revealed) {
        weightsSvg.appendChild(svgEl("rect", {
          x: AXIS_START, y: mid - 8,
          width: Math.max(1, weight * (AXIS_END - AXIS_START)), height: 16,
          class: "chart__bar"
        }));
        weightsSvg.appendChild(
          svgText(AXIS_END + 8, mid + 4, "chart__count", "start",
            weight.toFixed(2)));
      }

      if (ticks[capacity.id]) {
        weightsSvg.appendChild(svgEl("path", {
          d: "M " + (AXIS_START - 14) + " " + mid + " l 5 5 l 8 -11",
          class: "exec__tick"
        }));
      }
    });

    weightsSvg.appendChild(svgEl("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "chart__baseline"
    }));
    [0, 0.5, 1].forEach(function (tick) {
      weightsSvg.appendChild(
        svgText(AXIS_START + tick * (AXIS_END - AXIS_START), axisY + 14,
          "chart__axis", "middle", tick.toFixed(1)));
    });
    weightsSvg.appendChild(
      svgText(0, axisY + 14, "chart__axis", "start",
        revealed ? "how heavily the task loads   ✓ = you ticked it"
          : "ticks show your prediction"));

    /* The chart's visible text equivalent. The pinned block stays on screen
       while the table below it scrolls away, so the pin needs its own words. */
    var tickedNames = CAPACITIES.filter(function (c) { return ticks[c.id]; })
      .map(function (c) { return c.short.toLowerCase(); });
    weightsText.textContent =
      (revealed
        ? "Weights out of 1: " + CAPACITIES.map(function (c) {
            var w = task.weights[c.id];
            return c.short.toLowerCase() + " " + (w === 0 ? "none" : w.toFixed(2));
          }).join(", ") + ". "
        : "Weights not revealed yet. ") +
      (tickedNames.length
        ? "You ticked " + tickedNames.join(", ") + "."
        : "You have ticked nothing yet.");
  }

  function drawScores(rows) {
    var LABEL = 140, AXIS_START = 148, AXIS_END = 396;
    var ROW = 30, TOP = 8;

    clear(scoresSvg);
    var axisY = TOP + rows.length * ROW + 4;
    scoresSvg.setAttribute("viewBox", "0 0 460 " + (axisY + 26));

    var lowest = Math.min.apply(null, rows.map(function (r) { return r.score; }));

    rows.forEach(function (row, index) {
      var y = TOP + index * ROW;
      var mid = y + ROW / 2;

      scoresSvg.appendChild(
        svgText(LABEL, mid + 4, "chart__count", "end", row.task.short));
      scoresSvg.appendChild(svgEl("rect", {
        x: AXIS_START, y: mid - 9, width: AXIS_END - AXIS_START, height: 18,
        class: "chart__track"
      }));
      scoresSvg.appendChild(svgEl("rect", {
        x: AXIS_START, y: mid - 9,
        width: Math.max(1, (row.score / 100) * (AXIS_END - AXIS_START)), height: 18,
        class: "chart__bar" + (row.score <= lowest + 0.001 ? " exec__bar--lowest" : "")
      }));
      scoresSvg.appendChild(
        svgText(AXIS_END + 8, mid + 4, "chart__count", "start",
          row.score.toFixed(0)));
    });

    scoresSvg.appendChild(svgEl("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "chart__baseline"
    }));
    [0, 50, 100].forEach(function (tick) {
      scoresSvg.appendChild(
        svgText(AXIS_START + (tick / 100) * (AXIS_END - AXIS_START), axisY + 14,
          "chart__axis", "middle", String(tick)));
    });
    scoresSvg.appendChild(
      svgText(0, axisY + 14, "chart__axis", "start", "simulated score"));

    /* The chart's visible text equivalent, for the same reason as above. */
    scoresText.textContent = "Simulated scores out of 100: " +
      rows.map(function (row) {
        return row.task.short.toLowerCase() + " " + row.score.toFixed(0);
      }).join(", ") + ". Lowest: " +
      rows.filter(function (row) { return row.score <= lowest + 0.001; })
        .map(function (row) { return row.task.short.toLowerCase(); })
        .join(" and ") + ".";
  }

  function renderPredictionTable(task, revealed) {
    clear(tableHead);
    ["Capacity", "You ticked", "The model's weight"].forEach(function (text) {
      var th = make("th", null, text);
      th.setAttribute("scope", "col");
      tableHead.appendChild(th);
    });

    var ticks = state.ticks[task.id] || {};
    clear(mainTable);
    CAPACITIES.forEach(function (capacity) {
      var tr = make("tr");
      var th = make("th", null, capacity.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, ticks[capacity.id] ? "yes" : "no"));
      tr.appendChild(make("td", null,
        revealed ? task.weights[capacity.id].toFixed(2) : "not revealed yet"));
      if (revealed) {
        var needed = task.weights[capacity.id] > 0;
        if (needed !== Boolean(ticks[capacity.id])) { tr.className = "exec__miss"; }
      }
      mainTable.appendChild(tr);
    });
  }

  function renderScoreTable(rows) {
    clear(tableHead);
    ["Task", "Summary score", "Accuracy", "Speed"].forEach(function (text) {
      var th = make("th", null, text);
      th.setAttribute("scope", "col");
      tableHead.appendChild(th);
    });

    clear(mainTable);
    rows.forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row.task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row.score.toFixed(0)));
      if (row.task.timed) {
        tr.appendChild(make("td", null,
          (row.score - STRATEGY_SWING * state.strategy).toFixed(0)));
        tr.appendChild(make("td", null,
          (row.score + STRATEGY_SWING * state.strategy).toFixed(0)));
      } else {
        tr.appendChild(make("td", null, "not timed"));
        tr.appendChild(make("td", null, "not timed"));
      }
      mainTable.appendChild(tr);
    });
  }

  function renderMatrix() {
    clear(matrixHead);
    var corner = make("th", null, "Task");
    corner.setAttribute("scope", "col");
    matrixHead.appendChild(corner);
    CAPACITIES.forEach(function (capacity) {
      var th = make("th", null, capacity.short);
      th.setAttribute("scope", "col");
      matrixHead.appendChild(th);
    });

    clear(matrixTable);
    TASKS.forEach(function (task) {
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      CAPACITIES.forEach(function (capacity) {
        var weight = task.weights[capacity.id];
        var cell = make("td", null, weight === 0 ? "-" : weight.toFixed(2));
        if (weight >= 0.7) { cell.setAttribute("data-mark", "heavy"); }
        tr.appendChild(cell);
      });
      matrixTable.appendChild(tr);
    });
  }

  /* --- Experiment 1 reveal ---------------------------------------------- */

  function reveal() {
    var task = currentTask();
    var ticks = state.ticks[task.id] || {};
    state.revealed[task.id] = true;

    var needed = CAPACITIES.filter(function (c) { return task.weights[c.id] > 0; });
    var missed = needed.filter(function (c) { return !ticks[c.id]; });
    var extra = CAPACITIES.filter(function (c) {
      return ticks[c.id] && task.weights[c.id] === 0;
    });

    render();

    clear(stageFeedback);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      missed.length === 0 && extra.length === 0
        ? "Every one of the " + needed.length + "."
        : "The model loads on " + needed.length + " of the six."));
    lead.appendChild(document.createTextNode(
      " " + needed.map(function (c) { return c.short.toLowerCase(); }).join(", ") +
      "."));
    stageFeedback.appendChild(lead);

    if (missed.length) {
      stageFeedback.appendChild(make("p", null,
        "You left out: " + missed.map(function (c) {
          return c.short.toLowerCase() + " (weight " +
            task.weights[c.id].toFixed(2) + ")";
        }).join("; ") + ". Most people tick the process the task is named " +
        "after and stop there."));
    }
    if (extra.length) {
      stageFeedback.appendChild(make("p", null,
        "You included " + extra.map(function (c) {
          return c.short.toLowerCase();
        }).join(" and ") + ", which the model gives no weight at all. A " +
        "defensible disagreement: the weights are an argument, not a " +
        "measurement."));
    }

    stageFeedback.setAttribute("data-tone",
      missed.length === 0 && extra.length === 0 ? "good" : "caution");
    stageFeedback.hidden = false;

    shell.announce(
      task.name + " loads on " + needed.length + " of the six capacities.",
      { immediate: true });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    inhibition: {
      tone: "caution",
      verdict: "The natural reading, and not the safe one.",
      text:
        "The colour-word task is the most inhibition-loaded of the four and " +
        "also the most speed-loaded. In experiment 2 you can reduce inhibition " +
        "alone, and reduce processing speed alone, and both make that task the " +
        "lowest of the four. A low score there is compatible with either."
    },
    frontal: {
      tone: "caution",
      verdict: "Two steps beyond the evidence.",
      text:
        "It assumes the task measures one process and that the process has one " +
        "location. Executive tasks are impaired by damage in many places, " +
        "frontal damage does not reliably impair them, and this tool mentions " +
        "no anatomy at all on purpose."
    },
    several: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The mapping from a low score to a reduced capacity is many-to-one. " +
        "Experiment 2 computes which single reductions produce the same lowest " +
        "task rather than asserting it, and for the colour-word task there are " +
        "two."
    },
    general: {
      tone: "caution",
      verdict: "Ruled out by the other three scores.",
      text:
        "A general reduction lowers everything, because processing speed and " +
        "sustained effort appear in all four tasks. Three scores within range " +
        "and one below is a selective pattern - it just is not selective " +
        "enough to name one capacity."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockLab();
  });

  function unlockLab() {
    lockForm(openingForm);
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Laboratory open. Experiment 1.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    one: {
      tone: "caution",
      verdict: "True, and not the biggest problem.",
      text:
        "One task is thin evidence, and the report has three others within " +
        "range, so it is not resting on a single measure. The problem is what " +
        "the fourth measure can support: reduced processing speed produces the " +
        "same pattern, and the colour-word task is the most speed-loaded of " +
        "the four."
    },
    speed: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Load \"reduced inhibition only\", then \"reduced processing speed " +
        "only\", and compare. Both make the colour-word task the lowest of " +
        "the four. To choose between them you would measure processing speed " +
        "on a task with almost no executive load."
    },
    frontal: {
      tone: "caution",
      verdict: "That would make it worse.",
      text:
        "Adding a region would add a second unsupported inference on top of " +
        "the first. Executive tasks are impaired by damage in many places, and " +
        "frontal damage does not reliably impair them."
    },
    nothing: {
      tone: "caution",
      verdict: "That is the assumption the tool exists to question.",
      text:
        "The colour-word task loads on inhibition at 0.90 and also on " +
        "processing speed at 0.70 and sustained effort at 0.50. It is named " +
        "after one process and requires four."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var entry = CHALLENGE[answer.value];
    showFeedback(challengeFeedback, entry.tone, entry.verdict, entry.text);
    shell.announce("Challenge answered.", { immediate: true });
  });

  /* --- Feedback plumbing ------------------------------------------------ */

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

  /* --- Reset ------------------------------------------------------------ */

  shell.onReset(function () {
    state = {
      stage: 1, taskIndex: 0, ticks: {}, revealed: {},
      levels: typicalLevels(), strategy: 0
    };
    Array.prototype.forEach.call(
      taskControls.querySelectorAll("input"),
      function (input) { input.checked = input.value === TASKS[0].id; });
    syncTicks();
    CAPACITIES.forEach(function (capacity) {
      capacityInputs[capacity.id].value = "100";
    });
    strategyRange.value = "0";
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    stageFeedback.hidden = true;
    interpretation.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the laboratory.",
    { immediate: true });
})();
