/* =========================================================================
   Dual-Task Capacity Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/08-dual-task-capacity-lab/

   TEACHING JOB
   ------------
   Two tasks that are trivial alone both get slower when done together, and
   the cost is measured against the learner's own single-task speed.

   WHAT IS PRESERVED
   -----------------
   The performed blocks and the enforced order: each task alone first, then
   both. Without the two baselines there is no cost to report, only a pair of
   dual-task times that mean nothing on their own.

       cost(letter) = mean letter RT together - mean letter RT alone
       cost(side)   = mean side   RT together - mean side   RT alone

   Both costs are reported rather than one combined figure, because whether
   the cost falls evenly is the more interesting half of the finding and it
   costs nothing extra to show.

   THE TWO TASKS
   -------------
       letter   a letter appears in the middle: vowel or consonant
                answered with the up and down arrows
       side     a disc appears left or right of centre: which side
                answered with the left and right arrows

   Different response keys for the two tasks, so that a dual trial requires
   two distinct actions rather than one. Different judgements too, one on
   identity and one on position, so neither is simply the other repeated.

   THE TRIAL
   ---------
       fixation      400 ms
       stimulus      until answered, never timed out
       on a dual trial BOTH appear at once and BOTH must be answered; the
       order is the learner's own, and which one they choose to protect is
       part of what the result shows

   WHAT WAS REDUCED
   ----------------
   The difficulty manipulation, the response-overlap manipulation that
   separates a bottleneck at the response from one earlier, and the
   block-by-block record. The order is fixed rather than counterbalanced,
   which is a real limitation and the caution says so.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var FIXATION_MS = 400;
  var INTER_TRIAL_MS = 350;
  var SINGLE_TRIALS = 16;
  var DUAL_TRIALS = 20;
  var ANTICIPATION_MS = 150;
  var LAPSE_MS = 4000;

  var VOWELS = "AEIU".split("");
  var CONSONANTS = "BDFGHKLMNPRSTVZ".split("");
  var SIDES = ["left", "right"];

  var INK = { letter: "#FFFFFF", disc: "#FFD166", cross: "#FFFFFF" };

  var BLOCKS = [
    { key: "letter", label: "Letters alone", dual: false },
    { key: "side", label: "Sides alone", dual: false },
    { key: "dual", label: "Both at once", dual: true }
  ];

  var field = document.getElementById("field");
  var fieldDesc = document.getElementById("field-desc");
  var feedback = document.getElementById("feedback");
  var padLetter = document.getElementById("keypad-letter");
  var padSide = document.getElementById("keypad-side");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var stop = document.getElementById("stop");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var setupNote = document.getElementById("setup-note");
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
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* --- Keypads ----------------------------------------------------------- */

  function fillPad(pad, entries, handler, legendText) {
    pad.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = legendText;
    pad.appendChild(legend);
    entries.forEach(function (entry) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-value", entry.value);
      key.disabled = true;
      var name = document.createElement("span");
      name.textContent = entry.label;
      var hint = document.createElement("span");
      hint.className = "keypad__hint";
      hint.textContent = entry.hint;
      key.appendChild(name); key.appendChild(hint);
      key.addEventListener("click", function () { handler(entry.value); });
      pad.appendChild(key);
    });
  }

  function enable(pad, on) {
    Array.prototype.forEach.call(pad.querySelectorAll("[data-value]"), function (k) {
      k.disabled = !on;
    });
  }

  /* --- Drawing ---------------------------------------------------------- */

  function drawFixation() {
    wb.clearFigure(field);
    field.appendChild(svg("line", { x1: 288, y1: 120, x2: 312, y2: 120, stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round" }));
    field.appendChild(svg("line", { x1: 300, y1: 108, x2: 300, y2: 132, stroke: INK.cross, "stroke-width": 3, "stroke-linecap": "round" }));
    fieldDesc.textContent = "A central cross.";
  }

  function drawTrial(trial) {
    wb.clearFigure(field);
    var described = [];
    if (trial.letter) {
      var text = svg("text", {
        x: 300, y: 92, "text-anchor": "middle", fill: INK.letter,
        "font-size": "72", "font-weight": "800"
      });
      text.textContent = trial.letter;
      field.appendChild(text);
      described.push("the letter " + trial.letter);
    }
    if (trial.side) {
      field.appendChild(svg("circle", {
        cx: trial.side === "left" ? 170 : 430, cy: 168, r: 22, fill: INK.disc
      }));
      described.push("a disc on the " + trial.side);
    }
    fieldDesc.textContent = "Showing " + described.join(" and ") + ".";
  }

  function clearField() {
    wb.clearFigure(field);
    fieldDesc.textContent = "Nothing is showing.";
  }

  /* --- Trials ------------------------------------------------------------ */

  function buildTrials(block, random) {
    var count = block.dual ? DUAL_TRIALS : SINGLE_TRIALS;
    var list = [];
    var i = 0;
    while (i < count) {
      var isVowel = i % 2 === 0;
      var pool = isVowel ? VOWELS : CONSONANTS;
      var trial = { needLetter: false, needSide: false };
      if (block.key === "letter" || block.dual) {
        trial.letter = pool[Math.floor(random() * pool.length)];
        trial.isVowel = isVowel;
        trial.needLetter = true;
      }
      if (block.key === "side" || block.dual) {
        trial.side = SIDES[i % 2];
        trial.needSide = true;
      }
      list.push(trial);
      i += 1;
    }
    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var s = list[k]; list[k] = list[j]; list[j] = s;
      k -= 1;
    }
    return list;
  }

  /* --- Running ----------------------------------------------------------- */

  var blockIndex = 0;
  var trials = [];
  var index = 0;
  var results = { letter: { alone: [], together: [] }, side: { alone: [], together: [] } };
  var errors = { letterTogether: 0, sideTogether: 0, letterAlone: 0, sideAlone: 0 };
  var shownAt = 0;
  var awaiting = false;
  var answered = { letter: false, side: false };
  var timer = null;
  var running = false;

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }
  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }
  function block() { return BLOCKS[blockIndex]; }

  function runTrial() {
    if (index >= trials.length) { finishBlock(); return; }
    var trial = trials[index];
    awaiting = false;
    answered = { letter: false, side: false };
    enable(padLetter, false);
    enable(padSide, false);
    drawFixation();
    counter.textContent = "Trial " + (index + 1) + " of " + trials.length + ".";
    timer = window.setTimeout(function () {
      drawTrial(trial);
      shownAt = now();
      awaiting = true;
      if (trial.needLetter) { enable(padLetter, true); }
      if (trial.needSide) { enable(padSide, true); }
    }, FIXATION_MS);
  }

  function record(task, value) {
    if (!awaiting) { return; }
    var trial = trials[index];
    if (task === "letter" && (!trial.needLetter || answered.letter)) { return; }
    if (task === "side" && (!trial.needSide || answered.side)) { return; }

    var rt = now() - shownAt;
    var correct = task === "letter"
      ? (value === "vowel") === trial.isVowel
      : value === trial.side;
    var where = block().dual ? "together" : "alone";
    var usable = rt >= ANTICIPATION_MS && rt <= LAPSE_MS;

    if (correct && usable) { results[task][where].push(rt); }
    if (!correct) {
      errors[task + (where === "together" ? "Together" : "Alone")] += 1;
    }

    answered[task] = true;
    if (task === "letter") { enable(padLetter, false); }
    if (task === "side") { enable(padSide, false); }

    var done = (!trial.needLetter || answered.letter) && (!trial.needSide || answered.side);
    if (!done) { return; }

    awaiting = false;
    index += 1;
    clearField();
    timer = window.setTimeout(runTrial, INTER_TRIAL_MS);
  }

  function startBlock(i) {
    blockIndex = i;
    var b = block();
    trials = buildTrials(b, mulberry32(7001 + i * 991));
    index = 0;
    running = true;
    wb.progress.set(i);
    stepLabel.textContent = "Block " + (i + 1) + " of 3";
    setupNote.hidden = true;
    start.hidden = true;
    stop.hidden = false;
    padLetter.hidden = !(b.key === "letter" || b.dual);
    padSide.hidden = !(b.key === "side" || b.dual);

    if (b.key === "letter") {
      taskHeading.textContent = "The letter task, on its own";
      taskLead.textContent = "A letter appears in the middle. Say whether it " +
        "is a vowel or a consonant. Nothing else is happening in this block.";
    } else if (b.key === "side") {
      taskHeading.textContent = "The side task, on its own";
      taskLead.textContent = "A disc appears to the left or the right of the " +
        "middle. Say which side. Nothing else is happening in this block.";
    } else {
      taskHeading.textContent = "Both at once";
      taskLead.textContent = "Now a letter and a disc appear together, and " +
        "both need answering. Do them in whichever order you like, and try to " +
        "be quick on both. This is the block that costs you something.";
    }
    wb.announce(taskHeading.textContent + ". " + trials.length + " trials.");
    runTrial();
  }

  function finishBlock() {
    clearTimer();
    clearField();
    enable(padLetter, false);
    enable(padSide, false);
    if (blockIndex < BLOCKS.length - 1) {
      wb.announce("Block finished. The next one starts now.");
      startBlock(blockIndex + 1);
      return;
    }
    running = false;
    report();
  }

  /* --- Result ------------------------------------------------------------ */

  function mean(list) {
    return list.length
      ? list.reduce(function (a, b) { return a + b; }, 0) / list.length : null;
  }

  function report() {
    stop.hidden = true;
    wb.progress.markAllDone();
    stepLabel.textContent = "What it cost";
    taskHeading.textContent = "All three blocks finished";
    taskLead.textContent = "Your result is below.";
    counter.textContent = "";
    padLetter.hidden = true;
    padSide.hidden = true;

    var stats = {};
    ["letter", "side"].forEach(function (task) {
      stats[task] = {
        alone: mean(results[task].alone),
        together: mean(results[task].together),
        nAlone: results[task].alone.length,
        nTogether: results[task].together.length
      };
      stats[task].cost = (stats[task].alone !== null && stats[task].together !== null)
        ? stats[task].together - stats[task].alone : null;
    });

    if (stats.letter.cost === null || stats.side.cost === null) {
      resultLead.textContent =
        "There were not enough usable trials in every block to work out a " +
        "cost. Press Start again and run the three blocks through.";
      /* An empty chart and an empty table read as a broken page rather than
         as a missing result, so neither is shown. */
      wb.hide("#chart-wrap");
      wb.hide("#values");
      accuracyLine.textContent = "";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough usable trials for a result.");
      return;
    }

    var bigger = stats.letter.cost >= stats.side.cost ? "letter" : "side";
    var smaller = bigger === "letter" ? "side" : "letter";
    var name = { letter: "the letter task", side: "the side task" };

    resultLead.textContent =
      "On its own the letter task took you " + Math.round(stats.letter.alone) +
      " ms and the side task " + Math.round(stats.side.alone) +
      " ms. Doing both at once cost the letter task " +
      Math.round(stats.letter.cost) + " ms and the side task " +
      Math.round(stats.side.cost) + " ms" +
      (Math.abs(stats.letter.cost - stats.side.cost) > 40
        ? ", so most of the delay landed on " + name[bigger] +
          " and " + name[smaller] + " kept more of its speed."
        : ", which is about the same for both.") +
      " Neither task got any harder.";

    wb.show("#chart-wrap");
    wb.show("#values");
    renderChart(stats);
    renderTable(stats);
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All blocks complete. Letter cost " +
      Math.round(stats.letter.cost) + " milliseconds, side cost " +
      Math.round(stats.side.cost) + ".");
  }

  var TASK_LABEL = { letter: "Letter task", side: "Side task" };

  function renderChart(stats) {
    var LEFT = 170, RIGHT = 840, TOP = 56, ROW = 84;
    var BASE = TOP + 2 * ROW + 10;
    var top = Math.max(stats.letter.together, stats.side.together);
    var hi = Math.ceil((top + 120) / 100) * 100;
    var X = function (v) { return LEFT + (v / hi) * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 70));

    var title = svg("text", { x: LEFT, y: 24, class: "plot__label" });
    title.textContent = "Your mean reaction time, in milliseconds";
    chart.appendChild(title);

    ["letter", "side"].forEach(function (task, i) {
      var y = TOP + i * ROW;
      var label = svg("text", { x: LEFT - 16, y: y + 34, "text-anchor": "end", class: "plot__label" });
      label.textContent = TASK_LABEL[task];
      chart.appendChild(label);

      /* Alone: pale and outlined. Together: solid. Fill against outline
         carries the pairing without depending on colour. */
      chart.appendChild(svg("rect", {
        x: LEFT, y: y, width: Math.max(2, X(stats[task].alone) - LEFT).toFixed(1),
        height: 24, rx: 4, fill: "#1C7293", "fill-opacity": "0.22",
        stroke: "#1C7293", "stroke-width": 1.5
      }));
      chart.appendChild(svg("rect", {
        x: LEFT, y: y + 30, width: Math.max(2, X(stats[task].together) - LEFT).toFixed(1),
        height: 24, rx: 4, fill: "#1C7293", "fill-opacity": "0.85"
      }));
      var aloneTag = svg("text", { x: (X(stats[task].alone) + 10).toFixed(1), y: y + 17, class: "plot__sub" });
      aloneTag.textContent = "alone " + Math.round(stats[task].alone) + " ms";
      chart.appendChild(aloneTag);
      var togTag = svg("text", { x: (X(stats[task].together) + 10).toFixed(1), y: y + 47, class: "plot__sub" });
      togTag.textContent = "together " + Math.round(stats[task].together) +
        " ms, costing " + Math.round(stats[task].cost);
      chart.appendChild(togTag);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    var k = 0;
    while (k <= 4) {
      var v = (hi / 4) * k;
      var tick = svg("text", { x: X(v).toFixed(1), y: BASE + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = Math.round(v);
      chart.appendChild(tick);
      k += 1;
    }
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BASE + 48, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Reaction time (ms). Shorter is faster.";
    chart.appendChild(cap);

    chartDesc.textContent =
      "Two pairs of bars. The letter task took " + Math.round(stats.letter.alone) +
      " milliseconds alone and " + Math.round(stats.letter.together) +
      " together, a cost of " + Math.round(stats.letter.cost) +
      ". The side task took " + Math.round(stats.side.alone) +
      " milliseconds alone and " + Math.round(stats.side.together) +
      " together, a cost of " + Math.round(stats.side.cost) + ".";
  }

  function renderTable(stats) {
    tableBody.textContent = "";
    ["letter", "side"].forEach(function (task) {
      var togetherTotal = stats[task].nTogether + errors[task + "Together"];
      var row = document.createElement("tr");
      [
        TASK_LABEL[task],
        Math.round(stats[task].alone) + " ms",
        Math.round(stats[task].together) + " ms",
        (stats[task].cost >= 0 ? "+" : "−") + Math.abs(Math.round(stats[task].cost)) + " ms",
        togetherTotal ? Math.round(100 * stats[task].nTogether / togetherTotal) + "%" : "-"
      ].forEach(function (text, i) {
        var cell = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
    tableCaption.textContent =
      "Your blocks: " + SINGLE_TRIALS + " trials of each task alone and " +
      DUAL_TRIALS + " with both together. Means over correct trials only.";
    accuracyLine.textContent =
      "Errors are left out of the means, as are responses faster than " +
      ANTICIPATION_MS + " ms or slower than " + (LAPSE_MS / 1000) +
      " seconds. The accuracy column is for the both-at-once block, which is " +
      "where accuracy usually falls as well as speed.";
  }

  /* --- Wiring ------------------------------------------------------------ */

  fillPad(padLetter, [
    { value: "vowel", label: "Vowel", hint: "up arrow" },
    { value: "consonant", label: "Consonant", hint: "down arrow" }
  ], function (v) { record("letter", v); }, "Is the letter a vowel or a consonant?");

  fillPad(padSide, [
    { value: "left", label: "Left", hint: "left arrow" },
    { value: "right", label: "Right", hint: "right arrow" }
  ], function (v) { record("side", v); }, "Which side is the disc on?");

  document.addEventListener("keydown", function (event) {
    if (!awaiting) { return; }
    if (event.key === "ArrowUp") { event.preventDefault(); record("letter", "vowel"); }
    if (event.key === "ArrowDown") { event.preventDefault(); record("letter", "consonant"); }
    if (event.key === "ArrowLeft") { event.preventDefault(); record("side", "left"); }
    if (event.key === "ArrowRight") { event.preventDefault(); record("side", "right"); }
  });

  start.addEventListener("click", function () { startBlock(0); });

  stop.addEventListener("click", function () {
    clearTimer();
    var enough = results.letter.alone.length >= 4 && results.side.alone.length >= 4 &&
      results.letter.together.length >= 4 && results.side.together.length >= 4;
    if (enough) { running = false; report(); return; }
    doReset();
    wb.announce("Stopped before all three blocks were finished, so there is " +
      "nothing to compare. Press Start block 1 to run them through.");
  });

  function doReset() {
    clearTimer();
    running = false;
    blockIndex = 0; trials = []; index = 0; awaiting = false;
    results = { letter: { alone: [], together: [] }, side: { alone: [], together: [] } };
    errors = { letterTogether: 0, sideTogether: 0, letterAlone: 0, sideAlone: 0 };
    enable(padLetter, false); enable(padSide, false);
    padLetter.hidden = false; padSide.hidden = true;
    feedback.hidden = true;
    clearField();
    setupNote.hidden = false;
    stepLabel.textContent = "Block 1 of 3";
    taskHeading.textContent = "The letter task, on its own";
    taskLead.textContent = "A letter appears in the middle. Say whether it is " +
      "a vowel or a consonant, using the two buttons or the up and down arrow " +
      "keys. Nothing else is happening in this block.";
    counter.textContent = "";
    start.hidden = false; stop.hidden = true;
    wb.progress.reset();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
  doReset();
})();
