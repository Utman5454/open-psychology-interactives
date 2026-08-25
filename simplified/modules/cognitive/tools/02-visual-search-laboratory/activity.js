/* =========================================================================
   Visual Search Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/02-visual-search-laboratory/

   TEACHING JOB
   ------------
   The interesting quantity in a search task is not how fast you were, it is
   how much every extra item cost you: the slope of reaction time on set size.

   WHAT IS PRESERVED
   -----------------
   The performed searches at three set sizes in two conditions, and the search
   functions they produce. Both conditions are essential and neither can go:
   one flat line means nothing without a steep one beside it, drawn from the
   same person in the same session.

       slope = SUM (n - nbar)(rt - rtbar) / SUM (n - nbar)^2      ms per item

   THE STIMULI
   -----------
   Feature search      target: a tilted bar
                       distractors: upright bars, all the same colour
                       The target differs in ONE feature, orientation.

   Conjunction search  target: a gold tilted bar
                       distractors: gold upright bars and blue tilted bars
                       Every distractor shares one of the target's two
                       features, so neither feature alone identifies it.

   Orientation is the defining feature rather than colour so that the feature
   condition works without colour vision. The conjunction condition needs a
   second dimension and uses gold against blue, which is the colour axis that
   survives the common forms of colour blindness. It is also the only place
   colour carries meaning, and the display description names the target in
   words on every trial.

   WHAT WAS REDUCED
   ----------------
   Target-absent trials, which in the original support a second teaching job
   about the ratio of absent to present slopes. That is the largest cut and
   the caution says so plainly. Also the untimed inspection stage, the
   feedback-on-everything practice mode and the transfer challenge.

   Because every display contains a target, the response cannot be
   present-or-absent. It is which half of the panel the target was in, which
   keeps a two-key response, makes guessing visible as an error rate, and
   requires the target actually to be found rather than merely detected.

   THE TRIAL
   ---------
       fixation cross   400 ms
       display          until the learner responds, never timed out

   One display change per trial. Nothing fades, moves or animates.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var FIXATION_MS = 400;
  var PRACTICE_FEEDBACK_MS = 1200;
  var INTER_TRIAL_MS = 350;

  var SET_SIZES = [8, 16, 32];
  var CONDITIONS = ["feature", "conjunction"];
  var COND_LABEL = { feature: "One feature", conjunction: "Two features together" };
  var TRIALS_PER_CELL = 8;
  var PRACTICE_TRIALS = 6;

  var ANTICIPATION_MS = 200;
  var LAPSE_MS = 12000;

  /* Both inks clear 7:1 on the dark stage ground, and gold against blue is
     the colour axis that survives the common forms of colour blindness. */
  var INK = { gold: "#FFD166", blue: "#7EC8E3", cross: "#FFFFFF" };

  var SIDES = ["left", "right"];
  var SIDE_LABEL = { left: "Left half", right: "Right half" };

  var field = document.getElementById("field");
  var fieldDesc = document.getElementById("field-desc");
  var feedback = document.getElementById("feedback");
  var keypad = document.getElementById("keypad");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var stop = document.getElementById("stop");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var targetNote = document.getElementById("target-note");
  var synthesis = document.getElementById("synthesis");
  var resultLead = document.getElementById("result-lead");
  var readout = document.getElementById("readout");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var accuracyLine = document.getElementById("accuracy");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, random) {
    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var s = list[k]; list[k] = list[j]; list[j] = s;
      k -= 1;
    }
    return list;
  }

  /* --- Building a display ----------------------------------------------- */

  /* A grid of candidate slots, jittered, with a gap down the middle so which
     half an item is in is never ambiguous. */
  var COLS = 8, ROWS = 5;
  var MARGIN = 40, GUTTER = 34;

  function slots(random) {
    var list = [];
    var halfWidth = (600 - 2 * MARGIN - GUTTER) / 2;
    var cellW = halfWidth / (COLS / 2);
    var cellH = (300 - 2 * MARGIN) / ROWS;
    var c = 0;
    while (c < COLS) {
      var r = 0;
      var leftSide = c < COLS / 2;
      var baseX = leftSide
        ? MARGIN + c * cellW
        : MARGIN + halfWidth + GUTTER + (c - COLS / 2) * cellW;
      while (r < ROWS) {
        list.push({
          x: baseX + cellW * (0.25 + 0.5 * random()),
          y: MARGIN + r * cellH + cellH * (0.25 + 0.5 * random()),
          side: leftSide ? "left" : "right"
        });
        r += 1;
      }
      c += 1;
    }
    return shuffle(list, random);
  }

  function buildDisplay(condition, setSize, random) {
    var places = slots(random).slice(0, setSize);
    var items = places.map(function (p, i) {
      if (i === 0) {
        return { x: p.x, y: p.y, side: p.side, tilted: true, colour: INK.gold, target: true };
      }
      if (condition === "feature") {
        return { x: p.x, y: p.y, side: p.side, tilted: false, colour: INK.gold, target: false };
      }
      /* Conjunction: half share the colour, half share the orientation. */
      var shareColour = i % 2 === 1;
      return {
        x: p.x, y: p.y, side: p.side,
        tilted: !shareColour,
        colour: shareColour ? INK.gold : INK.blue,
        target: false
      };
    });
    return { items: shuffle(items, random), targetSide: places[0].side };
  }

  /* --- Drawing ---------------------------------------------------------- */

  function drawFixation() {
    wb.clearFigure(field);
    field.appendChild(svg("line", {
      x1: 288, y1: 150, x2: 312, y2: 150,
      stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round"
    }));
    field.appendChild(svg("line", {
      x1: 300, y1: 138, x2: 300, y2: 162,
      stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round"
    }));
    fieldDesc.textContent = "A central cross. The display is about to appear.";
  }

  function drawDisplay(display, condition, setSize) {
    wb.clearFigure(field);
    display.items.forEach(function (item) {
      var bar = svg("rect", {
        x: (item.x - 4).toFixed(1), y: (item.y - 15).toFixed(1),
        width: 8, height: 30, rx: 3, fill: item.colour
      });
      if (item.tilted) {
        bar.setAttribute("transform",
          "rotate(40 " + item.x.toFixed(1) + " " + item.y.toFixed(1) + ")");
      }
      field.appendChild(bar);
    });
    fieldDesc.textContent =
      setSize + " bars are showing. " + targetSentence(condition) +
      " It is in the " + display.targetSide + " half. Press Left or Right.";
  }

  function targetSentence(condition) {
    return condition === "feature"
      ? "Exactly one of them is tilted; the rest are upright, and all are gold."
      : "Exactly one of them is both gold and tilted; the others are either " +
        "gold and upright, or blue and tilted.";
  }

  function clearField() {
    wb.clearFigure(field);
    fieldDesc.textContent = "Nothing is showing.";
  }

  /* --- Keypad ----------------------------------------------------------- */

  function buildKeypad() {
    keypad.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which half was the target in?";
    keypad.appendChild(legend);
    SIDES.forEach(function (side, index) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-side", side);
      key.disabled = true;
      var name = document.createElement("span");
      name.textContent = SIDE_LABEL[side];
      var hint = document.createElement("span");
      hint.className = "keypad__hint";
      hint.textContent = index === 0 ? "left arrow" : "right arrow";
      key.appendChild(name);
      key.appendChild(hint);
      key.addEventListener("click", function () { respond(side); });
      keypad.appendChild(key);
    });
  }

  function keysEnabled(on) {
    Array.prototype.forEach.call(
      keypad.querySelectorAll("[data-side]"),
      function (key) { key.disabled = !on; }
    );
  }

  /* --- Running ---------------------------------------------------------- */

  var phase = "idle";
  var trials = [];
  var index = 0;
  var results = [];
  var shownAt = 0;
  var awaiting = false;
  var timer = null;
  var current = null;
  var random = mulberry32(31337);

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }
  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }

  function buildTrials(perCell, seed) {
    var r = mulberry32(seed);
    var list = [];
    CONDITIONS.forEach(function (condition) {
      SET_SIZES.forEach(function (setSize) {
        var i = 0;
        while (i < perCell) { list.push({ condition: condition, setSize: setSize }); i += 1; }
      });
    });
    return shuffle(list, r);
  }

  function runTrial() {
    if (index >= trials.length) { finishPhase(); return; }
    var trial = trials[index];
    feedback.hidden = true;
    keysEnabled(false);
    awaiting = false;
    drawFixation();
    updateCounter();
    timer = window.setTimeout(function () {
      current = buildDisplay(trial.condition, trial.setSize, random);
      drawDisplay(current, trial.condition, trial.setSize);
      shownAt = now();
      awaiting = true;
      keysEnabled(true);
    }, FIXATION_MS);
  }

  function respond(side) {
    if (!awaiting) { return; }
    awaiting = false;
    keysEnabled(false);
    var rt = now() - shownAt;
    var trial = trials[index];
    var correct = side === current.targetSide;

    if (phase === "block") {
      results.push({
        condition: trial.condition, setSize: trial.setSize,
        rt: rt, correct: correct,
        tooFast: rt < ANTICIPATION_MS, tooSlow: rt > LAPSE_MS
      });
    }
    index += 1;

    if (phase === "practice") {
      clearField();
      feedback.textContent = correct
        ? "Correct. " + Math.round(rt) + " ms."
        : "The target was in the " + current.targetSide + " half.";
      feedback.hidden = false;
      timer = window.setTimeout(runTrial, PRACTICE_FEEDBACK_MS);
      return;
    }
    clearField();
    timer = window.setTimeout(runTrial, INTER_TRIAL_MS);
  }

  function updateCounter() {
    var trial = trials[index];
    var what = trial
      ? " Looking for: " + (trial.condition === "feature"
        ? "the one tilted bar." : "the one gold tilted bar.")
      : "";
    counter.textContent = (phase === "practice"
      ? "Practice trial " + (index + 1) + " of " + trials.length + "."
      : "Trial " + (index + 1) + " of " + trials.length + ".") + what;
  }

  function startPractice() {
    phase = "practice";
    trials = buildTrials(1, 5150).slice(0, PRACTICE_TRIALS);
    index = 0; results = [];
    wb.progress.set(0);
    stepLabel.textContent = "Practice";
    start.hidden = true; stop.hidden = false;
    wb.announce("Practice started. Find the target, then press Left or Right for the half it was in.");
    runTrial();
  }

  function startBlock() {
    phase = "block";
    trials = buildTrials(TRIALS_PER_CELL, 90210);
    index = 0; results = [];
    wb.progress.set(1);
    stepLabel.textContent = "The block";
    taskHeading.textContent = "The scored block";
    taskLead.textContent = "No feedback now until the block ends. " +
      trials.length + " trials, about three minutes. The two searches are " +
      "mixed together and the line above the buttons tells you which one each " +
      "trial is.";
    wb.announce("Block started. " + trials.length + " trials, no feedback until the end.");
    runTrial();
  }

  function finishPhase() {
    clearTimer();
    keysEnabled(false);
    clearField();
    if (phase === "practice") {
      wb.announce("Practice complete. The scored block gives no feedback until it ends.");
      startBlock();
      return;
    }
    report();
  }

  /* --- Results ---------------------------------------------------------- */

  function cellKey(c, n) { return c + "-" + n; }

  function summarise() {
    var cells = {};
    CONDITIONS.forEach(function (c) {
      SET_SIZES.forEach(function (n) {
        cells[cellKey(c, n)] = { used: [], errors: 0, dropped: 0, total: 0 };
      });
    });
    results.forEach(function (r) {
      var cell = cells[cellKey(r.condition, r.setSize)];
      cell.total += 1;
      if (!r.correct) { cell.errors += 1; return; }
      if (r.tooFast || r.tooSlow) { cell.dropped += 1; return; }
      cell.used.push(r.rt);
    });
    Object.keys(cells).forEach(function (k) {
      var cell = cells[k];
      cell.n = cell.used.length;
      cell.mean = cell.n
        ? cell.used.reduce(function (a, b) { return a + b; }, 0) / cell.n : null;
      cell.accuracy = cell.total ? (cell.total - cell.errors) / cell.total : null;
    });
    return cells;
  }

  /* Least squares of mean RT on set size: the slope in ms per item. */
  function slopeOf(cells, condition) {
    var pts = [];
    SET_SIZES.forEach(function (n) {
      var cell = cells[cellKey(condition, n)];
      if (cell.mean !== null) { pts.push({ x: n, y: cell.mean }); }
    });
    if (pts.length < 2) { return null; }
    var mx = pts.reduce(function (a, p) { return a + p.x; }, 0) / pts.length;
    var my = pts.reduce(function (a, p) { return a + p.y; }, 0) / pts.length;
    var sxy = 0, sxx = 0;
    pts.forEach(function (p) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) * (p.x - mx); });
    var slope = sxx > 0 ? sxy / sxx : 0;
    return { slope: slope, intercept: my - slope * mx, points: pts };
  }

  function report() {
    phase = "done";
    stop.hidden = true;
    wb.progress.markAllDone();
    stepLabel.textContent = "Your two slopes";
    taskHeading.textContent = "Block finished";
    taskLead.textContent = "Your result is below.";
    counter.textContent = "";
    targetNote.hidden = true;

    var cells = summarise();
    var fit = { feature: slopeOf(cells, "feature"), conjunction: slopeOf(cells, "conjunction") };
    if (!fit.feature || !fit.conjunction) {
      resultLead.textContent =
        "There were not enough usable trials to fit both search functions. " +
        "Press Start again and run another block.";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough usable trials for a result.");
      return;
    }

    var ratio = Math.abs(fit.feature.slope) > 0.5
      ? fit.conjunction.slope / fit.feature.slope : null;

    resultLead.textContent =
      "Searching for the single tilted bar cost you about " +
      fit.feature.slope.toFixed(1) + " ms for every extra item on screen. " +
      "Searching for the bar that was gold and tilted cost you about " +
      fit.conjunction.slope.toFixed(1) + " ms per item" +
      (ratio && ratio > 1.5
        ? ", roughly " + ratio.toFixed(1) + " times as much."
        : ".") +
      " Both searches used the same displays and the same response; only what " +
      "defined the target changed.";

    renderReadout(fit, ratio);
    renderChart(cells, fit);
    renderTable(cells);
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Block complete. Feature slope " + fit.feature.slope.toFixed(1) +
      " milliseconds per item, conjunction slope " +
      fit.conjunction.slope.toFixed(1) + ".");
  }

  function renderReadout(fit, ratio) {
    readout.textContent = "";
    tile("One feature", fit.feature.slope.toFixed(1) + " ms",
      "per extra item on screen");
    tile("Two features together", fit.conjunction.slope.toFixed(1) + " ms",
      "per extra item on screen");
    tile("How much steeper",
      ratio && ratio > 0 ? ratio.toFixed(1) + "x" : "not measurable",
      ratio && ratio > 0
        ? "the conjunction slope against the feature slope"
        : "your feature slope was too near zero to divide by");
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);
  }

  var SERIES = {
    feature: { stroke: "#1C7293", dash: null, label: "One feature" },
    conjunction: { stroke: "#9E7318", dash: "7 5", label: "Two features together" }
  };

  function renderChart(cells, fit) {
    var LEFT = 96, RIGHT = 700, TOP = 56, BOTTOM = 340;
    var all = [];
    CONDITIONS.forEach(function (c) {
      SET_SIZES.forEach(function (n) {
        var m = cells[cellKey(c, n)].mean;
        if (m !== null) { all.push(m); }
      });
    });
    var lo = Math.max(0, Math.floor((Math.min.apply(null, all) - 200) / 200) * 200);
    var hi = Math.ceil((Math.max.apply(null, all) + 200) / 200) * 200;
    var X = function (n) { return LEFT + ((n - 4) / 32) * (RIGHT - LEFT); };
    var Y = function (v) { return BOTTOM - ((v - lo) / (hi - lo)) * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 66));

    var title = svg("text", { x: LEFT, y: 24, class: "plot__label" });
    title.textContent = "Your search functions";
    chart.appendChild(title);

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));

    SET_SIZES.forEach(function (n) {
      var tick = svg("text", { x: X(n).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(n);
      chart.appendChild(tick);
    });
    var xcap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    xcap.textContent = "Items on screen";
    chart.appendChild(xcap);
    [lo, (lo + hi) / 2, hi].forEach(function (v) {
      var tick = svg("text", {
        x: LEFT - 10, y: (Y(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = Math.round(v);
      chart.appendChild(tick);
    });
    var ycap = svg("text", {
      x: 34, y: ((TOP + BOTTOM) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
      transform: "rotate(-90 34 " + ((TOP + BOTTOM) / 2).toFixed(1) + ")"
    });
    ycap.textContent = "Reaction time (ms)";
    chart.appendChild(ycap);

    CONDITIONS.forEach(function (c) {
      var f = fit[c], s = SERIES[c];
      var line = {
        x1: X(4).toFixed(1), y1: Y(f.intercept + f.slope * 4).toFixed(1),
        x2: X(36).toFixed(1), y2: Y(f.intercept + f.slope * 36).toFixed(1),
        stroke: s.stroke, "stroke-width": "2.4"
      };
      if (s.dash) { line["stroke-dasharray"] = s.dash; }
      chart.appendChild(svg("line", line));
      f.points.forEach(function (p) {
        if (c === "feature") {
          chart.appendChild(svg("circle", {
            cx: X(p.x).toFixed(1), cy: Y(p.y).toFixed(1), r: 6, fill: s.stroke
          }));
        } else {
          chart.appendChild(svg("rect", {
            x: (X(p.x) - 5.5).toFixed(1), y: (Y(p.y) - 5.5).toFixed(1),
            width: 11, height: 11, fill: "none", stroke: s.stroke, "stroke-width": 2.4
          }));
        }
      });
    });

    /* A key in the space beside the plot, with a sample of each line, so the
       two series are told apart by shape and dash as well as by colour. */
    var KEY_X = RIGHT + 34, KEY_Y = TOP + 26;
    var head = svg("text", { x: KEY_X, y: KEY_Y - 22, class: "plot__label" });
    head.textContent = "Searching for";
    chart.appendChild(head);
    CONDITIONS.forEach(function (c, i) {
      /* 44 apart, not 30: the label sits 20 below its own sample, so a
         tighter pitch puts the next sample on top of it. */
      var s = SERIES[c], y = KEY_Y + i * 44;
      var sample = { x1: KEY_X, y1: y, x2: KEY_X + 30, y2: y, stroke: s.stroke, "stroke-width": "2.4" };
      if (s.dash) { sample["stroke-dasharray"] = s.dash; }
      chart.appendChild(svg("line", sample));
      if (c === "feature") {
        chart.appendChild(svg("circle", { cx: KEY_X + 15, cy: y, r: 5, fill: s.stroke }));
      } else {
        chart.appendChild(svg("rect", {
          x: KEY_X + 10, y: y - 5, width: 10, height: 10,
          fill: "none", stroke: s.stroke, "stroke-width": 2.2
        }));
      }
      var text = svg("text", { x: KEY_X, y: y + 20, class: "plot__sub", fill: s.stroke });
      text.textContent = s.label;
      chart.appendChild(text);
    });

    chartDesc.textContent =
      "Mean reaction time plotted against the number of items on screen, with " +
      "a fitted line for each search. Searching for one feature gave means of " +
      fit.feature.points.map(function (p) { return Math.round(p.y); }).join(", ") +
      " milliseconds at " + SET_SIZES.join(", ") + " items, a slope of " +
      fit.feature.slope.toFixed(1) + " milliseconds per item. Searching for " +
      "two features together gave " +
      fit.conjunction.points.map(function (p) { return Math.round(p.y); }).join(", ") +
      " milliseconds, a slope of " + fit.conjunction.slope.toFixed(1) +
      " milliseconds per item.";
  }

  function renderTable(cells) {
    tableBody.textContent = "";
    var dropped = 0;
    CONDITIONS.forEach(function (c) {
      SET_SIZES.forEach(function (n) {
        var cell = cells[cellKey(c, n)];
        dropped += cell.dropped;
        var row = document.createElement("tr");
        [
          COND_LABEL[c], String(n),
          cell.mean === null ? "no data" : Math.round(cell.mean) + " ms",
          String(cell.n),
          cell.accuracy === null ? "-" : Math.round(100 * cell.accuracy) + "%"
        ].forEach(function (text, i) {
          var td = document.createElement(i === 0 ? "th" : "td");
          if (i === 0) { td.setAttribute("scope", "row"); }
          td.textContent = text;
          row.appendChild(td);
        });
        tableBody.appendChild(row);
      });
    });
    tableCaption.textContent =
      "Your block: " + TRIALS_PER_CELL + " trials per point, means over correct trials only.";
    accuracyLine.textContent =
      "Errors are left out of the means. " + dropped +
      (dropped === 1 ? " correct response was" : " correct responses were") +
      " also left out for being faster than " + ANTICIPATION_MS +
      " ms or slower than " + (LAPSE_MS / 1000) + " seconds.";
  }

  /* --- Wiring ----------------------------------------------------------- */

  buildKeypad();
  clearField();

  document.addEventListener("keydown", function (event) {
    if (!awaiting) { return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); respond("left"); }
    if (event.key === "ArrowRight") { event.preventDefault(); respond("right"); }
  });

  start.addEventListener("click", startPractice);

  stop.addEventListener("click", function () {
    clearTimer();
    if (phase === "block" && results.length >= 18) { report(); return; }
    doReset();
    wb.announce("Stopped before there was enough data for a result. " +
      "Press Start the practice to run a block from the beginning.");
  });

  function doReset() {
    clearTimer();
    phase = "idle"; trials = []; index = 0; results = []; awaiting = false;
    random = mulberry32(31337);
    keysEnabled(false);
    feedback.hidden = true;
    targetNote.hidden = false;
    clearField();
    stepLabel.textContent = "Practice";
    taskHeading.textContent = "Find the target, then say which half it is in";
    taskLead.textContent = "Every display contains exactly one target. Find it, " +
      "then press Left or Right to say which half of the panel it was in. Six " +
      "untimed practice trials first, with feedback.";
    counter.textContent = "Practice trial 1 of " + PRACTICE_TRIALS + ".";
    start.hidden = false; stop.hidden = true;
    wb.progress.reset();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
})();
