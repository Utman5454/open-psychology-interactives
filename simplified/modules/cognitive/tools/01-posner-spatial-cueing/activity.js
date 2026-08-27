/* =========================================================================
   Posner Spatial Cueing — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/01-posner-spatial-cueing/

   TEACHING JOB
   ------------
   Attention can move without the eyes moving, and a cue produces two separate
   things: a benefit when it is right and a cost when it is wrong.

   WHAT IS PRESERVED
   -----------------
   The performed experiment, which is the whole point: the learner feels the
   cue working before any number appears. And the neutral condition, without
   which there is one difference and no way to say which half produced it.

       benefit = mean neutral RT - mean valid RT
       cost    = mean invalid RT - mean neutral RT

   THE TRIAL, as in the original
   -----------------------------
       fixation cross         500 ms
       cue (a box brightens)  100 ms
       gap                    100 ms      so cue onset to target onset is 200
       target (a filled disc) until the learner responds, never timed out

   The response is localisation, Left or Right, as in the original rather than
   simple detection. A single detection key can be pressed before anything
   appears; two keys cannot be, so accuracy is meaningful and anticipations
   are visible as errors rather than as fast correct trials.

   THE DESIGN, as in the original
   ------------------------------
   A third of trials are neutral, both boxes cued, so the cue points nowhere.
   Of the cued trials three quarters are valid. The cue therefore has to be
   worth believing, which is what makes the effect appear, and which is also
   why the invalid mean rests on the fewest trials. The caution says so.

   CLEANING, as in the original
   ----------------------------
   Responses under 150 ms cannot be reactions to the target and responses over
   2000 ms are lapses of a different kind. Both are counted, reported, and
   kept out of the means rather than silently averaged in.

   RESULTS ARE WITHHELD UNTIL THE BLOCK ENDS
   -----------------------------------------
   A running condition mean during a speeded block changes how people answer
   the next trial. Practice gives feedback; scored trials give none.

   WHAT WAS REDUCED
   ----------------
   The second cue-to-target interval, which in the original is used to make
   the effect reverse into inhibition of return. That is a second teaching
   job and it is the first thing cut. Also the running table of every block,
   the worked example and the transfer challenge.

   Two display changes per trial, neither faster than about five per second,
   and nothing fades, moves or animates, so there is nothing for a
   reduced-motion rule to switch off.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var FIXATION_MS = 500;
  var CUE_MS = 100;
  var GAP_MS = 100;
  var PRACTICE_FEEDBACK_MS = 1100;
  var INTER_TRIAL_MS = 350;

  var PRACTICE_TRIALS = 6;
  var BLOCK_TRIALS = 72;
  var NEUTRAL_SHARE = 1 / 3;
  var VALID_SHARE_OF_CUED = 0.75;

  var ANTICIPATION_MS = 150;
  var LAPSE_MS = 2000;

  var CONDITIONS = ["valid", "neutral", "invalid"];
  var LABEL = { valid: "Valid", neutral: "Neutral", invalid: "Invalid" };
  var SIDES = ["left", "right"];
  var SIDE_LABEL = { left: "Left", right: "Right" };

  /* Every ink used against the dark stage ground clears 7:1. */
  var INK = {
    box: "#7A8494",
    cue: "#FFFFFF",
    cross: "#FFFFFF",
    target: "#FFD166"
  };

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
  var synthesis = document.getElementById("synthesis");
  var resultLead = document.getElementById("result-lead");
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

  /* --- Trial list ------------------------------------------------------- */

  /* Deterministic shuffle from a seed, so a block can be described exactly
     in the teaching notes without being predictable to the learner. */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildTrials(total, random) {
    var neutral = Math.round(total * NEUTRAL_SHARE);
    var cued = total - neutral;
    var valid = Math.round(cued * VALID_SHARE_OF_CUED);
    var invalid = cued - valid;

    var list = [];
    function push(condition, count) {
      var i = 0;
      while (i < count) {
        var targetSide = SIDES[i % 2];
        var cueSide;
        if (condition === "neutral") { cueSide = "both"; }
        else if (condition === "valid") { cueSide = targetSide; }
        else { cueSide = targetSide === "left" ? "right" : "left"; }
        list.push({ condition: condition, cue: cueSide, target: targetSide });
        i += 1;
      }
    }
    push("valid", valid);
    push("neutral", neutral);
    push("invalid", invalid);

    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var swap = list[k]; list[k] = list[j]; list[j] = swap;
      k -= 1;
    }
    return list;
  }

  /* --- Drawing ---------------------------------------------------------- */

  var BOX = {
    left: { x: 70, y: 55, w: 150, h: 110 },
    right: { x: 380, y: 55, w: 150, h: 110 }
  };
  var CENTRE = { x: 300, y: 110 };

  function draw(state) {
    wb.clearFigure(field);

    SIDES.forEach(function (side) {
      var b = BOX[side];
      var cued = state.cue === side || state.cue === "both";
      field.appendChild(svg("rect", {
        x: b.x, y: b.y, width: b.w, height: b.h, rx: 10,
        fill: "none",
        stroke: cued ? INK.cue : INK.box,
        "stroke-width": cued ? 6 : 2.5
      }));
    });

    if (state.cross) {
      field.appendChild(svg("line", {
        x1: CENTRE.x - 12, y1: CENTRE.y, x2: CENTRE.x + 12, y2: CENTRE.y,
        stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round"
      }));
      field.appendChild(svg("line", {
        x1: CENTRE.x, y1: CENTRE.y - 12, x2: CENTRE.x, y2: CENTRE.y + 12,
        stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round"
      }));
    }

    if (state.target) {
      var t = BOX[state.target];
      field.appendChild(svg("circle", {
        cx: t.x + t.w / 2, cy: t.y + t.h / 2, r: 22, fill: INK.target
      }));
    }

    fieldDesc.textContent = describeField(state);
  }

  function describeField(state) {
    if (state.target) {
      return "A filled disc has appeared in the " + state.target + " box. " +
        "Press Left or Right to say which side it is on.";
    }
    if (state.cue === "both") { return "Both boxes have brightened."; }
    if (state.cue) { return "The " + state.cue + " box has brightened."; }
    return "A central cross with a box to its left and a box to its right. " +
      "Keep looking at the cross.";
  }

  /* --- Keypad ----------------------------------------------------------- */

  function buildKeypad() {
    keypad.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which box is the target in?";
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

  /* --- Running the block ------------------------------------------------ */

  var phase = "idle";        /* idle | practice | block | done */
  var trials = [];
  var index = 0;
  var results = [];
  var shownAt = 0;
  var awaiting = false;
  var timer = null;

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }

  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }

  function runTrial() {
    if (index >= trials.length) { finishPhase(); return; }
    var trial = trials[index];
    feedback.hidden = true;
    keysEnabled(false);
    awaiting = false;

    draw({ cross: true });
    updateCounter();

    timer = window.setTimeout(function () {
      draw({ cross: true, cue: trial.cue });
      timer = window.setTimeout(function () {
        draw({ cross: true });
        timer = window.setTimeout(function () {
          draw({ cross: true, target: trial.target });
          shownAt = now();
          awaiting = true;
          keysEnabled(true);
        }, GAP_MS);
      }, CUE_MS);
    }, FIXATION_MS);
  }

  function respond(side) {
    if (!awaiting) { return; }
    awaiting = false;
    keysEnabled(false);
    var rt = now() - shownAt;
    var trial = trials[index];
    var correct = side === trial.target;

    if (phase === "block") {
      results.push({
        condition: trial.condition, rt: rt, correct: correct,
        tooFast: rt < ANTICIPATION_MS, tooSlow: rt > LAPSE_MS
      });
    }

    index += 1;

    if (phase === "practice") {
      draw({ cross: true });
      feedback.textContent = correct
        ? "Correct. " + Math.round(rt) + " ms."
        : "That was the other side. The disc was on the " + trial.target + ".";
      feedback.hidden = false;
      timer = window.setTimeout(runTrial, PRACTICE_FEEDBACK_MS);
      return;
    }

    draw({ cross: true });
    timer = window.setTimeout(runTrial, INTER_TRIAL_MS);
  }

  function updateCounter() {
    counter.textContent = phase === "practice"
      ? "Practice trial " + (index + 1) + " of " + trials.length + "."
      : "Trial " + (index + 1) + " of " + trials.length + ".";
  }

  function startPractice() {
    phase = "practice";
    trials = buildTrials(PRACTICE_TRIALS, mulberry32(4801));
    index = 0;
    results = [];
    wb.progress.set(0);
    stepLabel.textContent = "Practice";
    taskHeading.textContent = "Say which box the target is in";
    start.hidden = true;
    stop.hidden = false;
    wb.announce("Practice started. Keep your eyes on the cross and press Left or Right when the disc appears.");
    runTrial();
  }

  function startBlock() {
    phase = "block";
    trials = buildTrials(BLOCK_TRIALS, mulberry32(90210));
    index = 0;
    results = [];
    wb.progress.set(1);
    stepLabel.textContent = "The block";
    taskHeading.textContent = "The scored block";
    taskLead.textContent = "No feedback now until the block ends, because seeing " +
      "how you are doing changes how you answer the next trial. " +
      BLOCK_TRIALS + " trials, about three minutes.";
    wb.announce("Block started. " + BLOCK_TRIALS + " trials, no feedback until the end.");
    runTrial();
  }

  function finishPhase() {
    clearTimer();
    keysEnabled(false);
    draw({ cross: true });
    if (phase === "practice") {
      wb.announce("Practice complete. The scored block gives no feedback until it ends.");
      startBlock();
      return;
    }
    report();
  }

  /* --- The result ------------------------------------------------------- */

  function summarise() {
    var by = {};
    CONDITIONS.forEach(function (c) {
      by[c] = { used: [], errors: 0, dropped: 0, total: 0 };
    });
    results.forEach(function (r) {
      var cell = by[r.condition];
      cell.total += 1;
      if (!r.correct) { cell.errors += 1; return; }
      if (r.tooFast || r.tooSlow) { cell.dropped += 1; return; }
      cell.used.push(r.rt);
    });
    CONDITIONS.forEach(function (c) {
      var cell = by[c];
      cell.n = cell.used.length;
      cell.mean = cell.n
        ? cell.used.reduce(function (a, b) { return a + b; }, 0) / cell.n : null;
      cell.accuracy = cell.total ? (cell.total - cell.errors) / cell.total : null;
    });
    return by;
  }

  function report() {
    phase = "done";
    stop.hidden = true;
    wb.progress.markAllDone();
    stepLabel.textContent = "Your result";
    taskHeading.textContent = "Block finished";
    taskLead.textContent = "Your result is below.";
    counter.textContent = "";

    var by = summarise();
    var enough = CONDITIONS.every(function (c) { return by[c].n >= 3; });
    if (!enough) {
      resultLead.textContent =
        "There were not enough usable trials in every condition to compare " +
        "them. Press Start again and run another block.";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough usable trials for a result.");
      return;
    }

    var benefit = by.neutral.mean - by.valid.mean;
    var cost = by.invalid.mean - by.neutral.mean;

    resultLead.textContent =
      "Against your own neutral baseline of " + Math.round(by.neutral.mean) +
      " ms, a valid cue " +
      (benefit >= 0
        ? "saved you " + Math.round(benefit) + " ms"
        : "cost you " + Math.round(-benefit) + " ms") +
      " and an invalid cue " +
      (cost >= 0
        ? "cost you " + Math.round(cost) + " ms"
        : "saved you " + Math.round(-cost) + " ms") +
      ". Reporting only the gap between valid and invalid, " +
      Math.round(by.invalid.mean - by.valid.mean) +
      " ms, would have hidden both of those numbers.";

    renderChart(by, benefit, cost);
    renderTable(by);
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Block complete. Valid " + Math.round(by.valid.mean) +
      " milliseconds, neutral " + Math.round(by.neutral.mean) +
      ", invalid " + Math.round(by.invalid.mean) + ".");
  }

  function renderChart(by, benefit, cost) {
    var LEFT = 150;
    var RIGHT = 840;
    var TOP = 54;
    var ROW = 62;
    var BASE = TOP + CONDITIONS.length * ROW;

    var means = CONDITIONS.map(function (c) { return by[c].mean; });
    var lo = Math.min.apply(null, means) - 60;
    var hi = Math.max.apply(null, means) + 60;
    lo = Math.max(0, Math.floor(lo / 50) * 50);
    hi = Math.ceil(hi / 50) * 50;
    var X = function (v) { return LEFT + ((v - lo) / (hi - lo)) * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 76));

    var title = svg("text", { x: LEFT, y: 24, class: "plot__label" });
    title.textContent = "Your mean reaction time, in milliseconds";
    chart.appendChild(title);

    /* The neutral baseline, drawn first so no bar sits under its label. */
    var nx = X(by.neutral.mean);
    chart.appendChild(svg("line", {
      x1: nx.toFixed(1), y1: TOP - 12, x2: nx.toFixed(1), y2: BASE + 6,
      class: "plot__zero", "stroke-dasharray": "6 5"
    }));
    var baseTag = svg("text", {
      x: nx.toFixed(1), y: TOP - 20, "text-anchor": "middle", class: "plot__sub"
    });
    baseTag.textContent = "your neutral baseline";
    chart.appendChild(baseTag);

    CONDITIONS.forEach(function (c, i) {
      var y = TOP + i * ROW;
      var name = svg("text", {
        x: LEFT - 16, y: y + 24, "text-anchor": "end", class: "plot__label"
      });
      name.textContent = LABEL[c];
      chart.appendChild(name);

      var from = Math.min(by[c].mean, by.neutral.mean);
      var to = Math.max(by[c].mean, by.neutral.mean);
      chart.appendChild(svg("rect", {
        x: X(from).toFixed(1), y: y + 6, width: Math.max(2, X(to) - X(from)).toFixed(1),
        height: 30, rx: 4,
        fill: c === "neutral" ? "#5F6878" : (c === "valid" ? "#2E7D5B" : "#C0434F"),
        "fill-opacity": "0.75"
      }));
      var value = svg("text", {
        x: (X(by[c].mean) + (by[c].mean >= by.neutral.mean ? 10 : -10)).toFixed(1),
        y: y + 26,
        "text-anchor": by[c].mean >= by.neutral.mean ? "start" : "end",
        class: "plot__sub plot__over"
      });
      value.textContent = Math.round(by[c].mean) + " ms";
      chart.appendChild(value);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE + 6, x2: RIGHT, y2: BASE + 6, class: "plot__axis" }));
    var step = (hi - lo) / 4;
    var k = 0;
    while (k <= 4) {
      var v = lo + k * step;
      var tick = svg("text", {
        x: X(v).toFixed(1), y: BASE + 28, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = Math.round(v);
      chart.appendChild(tick);
      k += 1;
    }
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BASE + 52, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Reaction time (ms). Shorter is faster.";
    chart.appendChild(cap);

    chartDesc.textContent =
      "A bar for each trial type, drawn from your neutral mean of " +
      Math.round(by.neutral.mean) + " milliseconds. Valid trials averaged " +
      Math.round(by.valid.mean) + " milliseconds, a benefit of " +
      Math.round(benefit) + ", and invalid trials averaged " +
      Math.round(by.invalid.mean) + " milliseconds, a cost of " +
      Math.round(cost) + ".";
  }

  function renderTable(by) {
    tableBody.textContent = "";
    var dropped = 0;
    CONDITIONS.forEach(function (c) {
      dropped += by[c].dropped;
      var row = document.createElement("tr");
      [
        LABEL[c],
        Math.round(by[c].mean) + " ms",
        String(by[c].n),
        Math.round(100 * by[c].accuracy) + "%"
      ].forEach(function (text, i) {
        var cell = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
    tableCaption.textContent =
      "Your block: " + BLOCK_TRIALS + " trials, means over correct trials only.";
    accuracyLine.textContent =
      "Errors are left out of the means. " + dropped +
      (dropped === 1 ? " correct response was" : " correct responses were") +
      " also left out for being faster than " + ANTICIPATION_MS +
      " ms or slower than " + LAPSE_MS + " ms.";
  }

  /* --- Wiring ----------------------------------------------------------- */

  buildKeypad();
  draw({ cross: true });

  document.addEventListener("keydown", function (event) {
    if (!awaiting) { return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); respond("left"); }
    if (event.key === "ArrowRight") { event.preventDefault(); respond("right"); }
  });

  start.addEventListener("click", startPractice);

  stop.addEventListener("click", function () {
    clearTimer();
    if (phase === "block" && results.length >= 12) { report(); return; }
    /* Announce AFTER the reset: resetting clears the live region, so saying
       why nothing appeared before it would be wiped out immediately. */
    doReset();
    wb.announce("Stopped before there was enough data for a result. " +
      "Press Start the practice to run a block from the beginning.");
  });

  function doReset() {
    clearTimer();
    phase = "idle";
    trials = []; index = 0; results = []; awaiting = false;
    keysEnabled(false);
    feedback.hidden = true;
    draw({ cross: true });
    stepLabel.textContent = "Practice";
    taskHeading.textContent = "Say which box the target is in";
    taskLead.textContent = "A box brightens, then a filled disc appears in one " +
      "of the two boxes. Press Left or Right to say which. Six untimed practice " +
      "trials first, with feedback.";
    counter.textContent = "Practice trial 1 of " + PRACTICE_TRIALS + ".";
    start.hidden = false;
    stop.hidden = true;
    wb.progress.reset();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
})();
