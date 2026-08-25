/* =========================================================================
   Working-Memory Load Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/09-working-memory-load-lab/

   TEACHING JOB
   ------------
   What holding material in mind costs depends on what else you are doing with
   it. A concurrent task made of the same stuff competes; one made of
   different stuff competes much less.

   WHAT IS PRESERVED
   -----------------
   The performed load task and the factorial that makes the point: load
   crossed with the domain of the concurrent task. Neither factor can go. One
   line falling with load shows only that load costs something; two lines
   falling at different rates is the finding.

       load        2 or 6 letters
       in between  VERBAL   is this letter a vowel?      same domain
                   SPATIAL  is this disc left or right?  different domain

   THE TRIAL
   ---------
       study        the letters, shown together, 600 + 350 per letter
       retention    four paced judgements, RETENTION_STEP_MS each
       recall       pick the letters out of a grid of eight

   Recall is picking from a grid rather than a single yes-or-no probe because
   a probe yields one bit per trial, and with a handful of trials per cell
   that is far too little to draw anything. Picking N of 8 yields N.

   The retention judgements are PACED and move on without the learner. That is
   deliberate and stated on the page: a self-paced filler can be rushed
   through, or ignored while rehearsing, and then it is not a load at all.

   WHAT WAS REDUCED
   ----------------
   The third load level, the practice trials with explanatory feedback on
   every one, and the fuller treatment of what separable parts means.

   HONEST LIMITATION, ON THE PAGE
   ------------------------------
   The two in-between tasks are matched for pacing and for number of
   judgements but not for difficulty. Part of any difference could therefore
   be that one is simply harder rather than that it shares a domain. A
   properly matched pair is genuinely hard to build and this is not one; the
   caution says so rather than leaving it to be discovered.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var LOADS = [2, 6];
  var DOMAINS = ["verbal", "spatial"];
  var DOMAIN_LABEL = { verbal: "Letters", spatial: "Positions" };
  var TRIALS_PER_CELL = 5;
  var PRACTICE_TRIALS = 2;
  var RETENTION_JUDGEMENTS = 4;
  var RETENTION_STEP_MS = 1500;
  var STUDY_BASE_MS = 600;
  var STUDY_PER_LETTER_MS = 350;
  var GAP_MS = 500;
  var FEEDBACK_MS = 1800;

  var POOL = "BDFGHJKLMNPRSTVZ".split("");
  var VOWELS = "AEIOU".split("");
  /* The recall grid holds the targets plus an equal number of lures, so it
     grows with the load. A FIXED grid would be a serious confound: with eight
     options, load 2 offers six lures and load 6 offers two, so guessing scores
     25 per cent at the low load and 75 per cent at the high one, and the load
     effect would be swamped by a difference in how easy guessing is. One lure
     per target keeps chance at 50 per cent whatever the load. */
  var LURES_PER_TARGET = 1;

  var INK = { letter: "#FFFFFF", disc: "#FFD166", dim: "#9AA6B4" };

  var field = document.getElementById("field");
  var fieldDesc = document.getElementById("field-desc");
  var feedback = document.getElementById("feedback");
  var padInter = document.getElementById("keypad-inter");
  var padRecall = document.getElementById("keypad-recall");
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
  function shuffle(list, random) {
    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var s = list[k]; list[k] = list[j]; list[j] = s;
      k -= 1;
    }
    return list;
  }

  /* --- Trials ------------------------------------------------------------ */

  function buildTrial(load, domain, random) {
    var pool = shuffle(POOL.slice(), random);
    var targets = pool.slice(0, load);
    var lures = pool.slice(load, load + load * LURES_PER_TARGET);
    var grid = shuffle(targets.concat(lures), random);
    var fillers = [];
    var i = 0;
    while (i < RETENTION_JUDGEMENTS) {
      if (domain === "verbal") {
        var isVowel = random() < 0.5;
        var letter = isVowel
          ? VOWELS[Math.floor(random() * VOWELS.length)]
          : POOL[Math.floor(random() * POOL.length)];
        fillers.push({ kind: "verbal", letter: letter, answer: isVowel ? "yes" : "no" });
      } else {
        var side = random() < 0.5 ? "left" : "right";
        fillers.push({ kind: "spatial", side: side, answer: side });
      }
      i += 1;
    }
    return { load: load, domain: domain, targets: targets, grid: grid, fillers: fillers };
  }

  function buildTrials(perCell, seed) {
    var random = mulberry32(seed);
    var list = [];
    LOADS.forEach(function (load) {
      DOMAINS.forEach(function (domain) {
        var i = 0;
        while (i < perCell) { list.push(buildTrial(load, domain, random)); i += 1; }
      });
    });
    return shuffle(list, random);
  }

  /* --- Drawing ---------------------------------------------------------- */

  function drawStudy(trial) {
    wb.clearFigure(field);
    var spacing = Math.min(88, 520 / trial.targets.length);
    var startX = 300 - spacing * (trial.targets.length - 1) / 2;
    trial.targets.forEach(function (letter, i) {
      var text = svg("text", {
        x: (startX + i * spacing).toFixed(1), y: 140, "text-anchor": "middle",
        fill: INK.letter, "font-size": "58", "font-weight": "800"
      });
      text.textContent = letter;
      field.appendChild(text);
    });
    fieldDesc.textContent = "Hold these " + trial.targets.length + " letters in mind: " +
      trial.targets.join(", ") + ".";
  }

  function drawFiller(filler, n) {
    wb.clearFigure(field);
    var head = svg("text", {
      x: 300, y: 52, "text-anchor": "middle", fill: INK.dim,
      "font-size": "18", "font-weight": "700"
    });
    head.textContent = "In between, " + n + " of " + RETENTION_JUDGEMENTS;
    field.appendChild(head);
    if (filler.kind === "verbal") {
      var text = svg("text", {
        x: 300, y: 160, "text-anchor": "middle", fill: INK.letter,
        "font-size": "64", "font-weight": "800"
      });
      text.textContent = filler.letter;
      field.appendChild(text);
      fieldDesc.textContent = "In between: is the letter " + filler.letter + " a vowel?";
    } else {
      field.appendChild(svg("circle", {
        cx: filler.side === "left" ? 180 : 420, cy: 148, r: 26, fill: INK.disc
      }));
      fieldDesc.textContent = "In between: is the disc on the left or the right?";
    }
  }

  function drawRecall(trial) {
    wb.clearFigure(field);
    var text = svg("text", {
      x: 300, y: 130, "text-anchor": "middle", fill: INK.letter,
      "font-size": "26", "font-weight": "800"
    });
    text.textContent = "Which " + trial.load + " letters were they?";
    field.appendChild(text);
    fieldDesc.textContent = "Recall: pick the " + trial.load +
      " letters you were holding, from the " + trial.grid.length +
      " in the grid below.";
  }

  function clearField(message) {
    wb.clearFigure(field);
    if (message) {
      var text = svg("text", {
        x: 300, y: 128, "text-anchor": "middle", fill: INK.dim,
        "font-size": "20", "font-weight": "700"
      });
      text.textContent = message;
      field.appendChild(text);
    }
    fieldDesc.textContent = message || "Nothing is showing.";
  }

  /* --- Keypads ----------------------------------------------------------- */

  function fillInter(filler) {
    padInter.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = filler.kind === "verbal"
      ? "Is this letter a vowel?" : "Which side is the disc on?";
    padInter.appendChild(legend);
    var entries = filler.kind === "verbal"
      ? [{ v: "yes", l: "Vowel" }, { v: "no", l: "Not a vowel" }]
      : [{ v: "left", l: "Left" }, { v: "right", l: "Right" }];
    entries.forEach(function (e) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-value", e.v);
      key.textContent = e.l;
      key.addEventListener("click", function () { answerFiller(e.v); });
      padInter.appendChild(key);
    });
    padInter.hidden = false;
  }

  function fillRecall(trial) {
    padRecall.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Pick the " + trial.load + " letters you were holding.";
    padRecall.appendChild(legend);
    trial.grid.forEach(function (letter) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-letter", letter);
      key.setAttribute("aria-pressed", "false");
      key.textContent = letter;
      key.addEventListener("click", function () { pickLetter(key, letter); });
      padRecall.appendChild(key);
    });
    padRecall.hidden = false;
  }

  /* --- Running ----------------------------------------------------------- */

  var phase = "idle";
  var trials = [];
  var index = 0;
  var results = [];
  var timer = null;
  var current = null;
  var fillerIndex = 0;
  var fillerHits = 0;
  var fillerTotal = 0;
  var picked = [];

  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }

  function runTrial() {
    if (index >= trials.length) { finishPhase(); return; }
    current = trials[index];
    picked = [];
    fillerIndex = 0;
    feedback.hidden = true;
    padInter.hidden = true;
    padRecall.hidden = true;
    counter.textContent = (phase === "practice" ? "Practice trial " : "Trial ") +
      (index + 1) + " of " + trials.length + ".";
    drawStudy(current);
    wb.announce("Hold these letters: " + current.targets.join(", ") + ".");
    timer = window.setTimeout(nextFiller,
      STUDY_BASE_MS + STUDY_PER_LETTER_MS * current.load);
  }

  function nextFiller() {
    if (fillerIndex >= current.fillers.length) {
      padInter.hidden = true;
      clearField("Now recall.");
      timer = window.setTimeout(startRecall, GAP_MS);
      return;
    }
    var filler = current.fillers[fillerIndex];
    drawFiller(filler, fillerIndex + 1);
    fillInter(filler);
    /* Paced: it moves on whether or not an answer arrives. */
    timer = window.setTimeout(function () {
      fillerTotal += 1;
      fillerIndex += 1;
      nextFiller();
    }, RETENTION_STEP_MS);
  }

  function answerFiller(value) {
    if (padInter.hidden) { return; }
    var filler = current.fillers[fillerIndex];
    if (value === filler.answer) { fillerHits += 1; }
    fillerTotal += 1;
    fillerIndex += 1;
    padInter.hidden = true;
    clearTimer();
    timer = window.setTimeout(nextFiller, 150);
  }

  function startRecall() {
    drawRecall(current);
    fillRecall(current);
    wb.announce("Now pick the " + current.load + " letters you were holding.");
  }

  function pickLetter(key, letter) {
    if (padRecall.hidden) { return; }
    var at = picked.indexOf(letter);
    if (at >= 0) {
      picked.splice(at, 1);
      key.setAttribute("aria-pressed", "false");
      wb.choices.mark(key, null);
      return;
    }
    if (picked.length >= current.load) { return; }
    picked.push(letter);
    key.setAttribute("aria-pressed", "true");
    wb.choices.mark(key, "chosen");
    if (picked.length === current.load) { scoreRecall(); }
  }

  function scoreRecall() {
    padRecall.hidden = true;
    var hits = picked.filter(function (l) {
      return current.targets.indexOf(l) >= 0;
    }).length;
    if (phase === "block") {
      results.push({
        load: current.load, domain: current.domain,
        hits: hits, of: current.load
      });
    }
    index += 1;
    if (phase === "practice") {
      feedback.hidden = false;
      feedback.textContent = "They were " + current.targets.join(", ") +
        ". You got " + hits + " of " + current.load + ".";
      clearField();
      timer = window.setTimeout(runTrial, FEEDBACK_MS);
      return;
    }
    clearField();
    timer = window.setTimeout(runTrial, 350);
  }

  function startPractice() {
    phase = "practice";
    trials = buildTrials(1, 606).slice(0, PRACTICE_TRIALS);
    index = 0; results = []; fillerHits = 0; fillerTotal = 0;
    wb.progress.set(0);
    stepLabel.textContent = "Practice";
    setupNote.hidden = true;
    start.hidden = true; stop.hidden = false;
    wb.announce("Practice started.");
    runTrial();
  }

  function startBlock() {
    phase = "block";
    trials = buildTrials(TRIALS_PER_CELL, 90909);
    index = 0; results = []; fillerHits = 0; fillerTotal = 0;
    wb.progress.set(1);
    stepLabel.textContent = "The block";
    taskHeading.textContent = "The scored block";
    taskLead.textContent = trials.length + " trials, about five minutes, with " +
      "no feedback until the end. The number of letters and the kind of " +
      "in-between task both change from trial to trial.";
    wb.announce("Block started. " + trials.length + " trials.");
    runTrial();
  }

  function finishPhase() {
    clearTimer();
    padInter.hidden = true;
    padRecall.hidden = true;
    clearField("Finished.");
    if (phase === "practice") {
      wb.announce("Practice complete.");
      startBlock();
      return;
    }
    report();
  }

  /* --- Result ------------------------------------------------------------ */

  function cellKey(d, l) { return d + "-" + l; }

  function summarise() {
    var cells = {};
    DOMAINS.forEach(function (d) {
      LOADS.forEach(function (l) { cells[cellKey(d, l)] = { hits: 0, of: 0, trials: 0 }; });
    });
    results.forEach(function (r) {
      var cell = cells[cellKey(r.domain, r.load)];
      cell.hits += r.hits; cell.of += r.of; cell.trials += 1;
    });
    Object.keys(cells).forEach(function (k) {
      var cell = cells[k];
      cell.rate = cell.of ? cell.hits / cell.of : null;
    });
    return cells;
  }

  function report() {
    phase = "done";
    stop.hidden = true;
    wb.progress.markAllDone();
    stepLabel.textContent = "What it cost";
    taskHeading.textContent = "Block finished";
    taskLead.textContent = "Your result is below.";
    counter.textContent = "";

    var cells = summarise();
    var complete = Object.keys(cells).every(function (k) { return cells[k].rate !== null; });
    if (!complete) {
      resultLead.textContent =
        "There were not enough completed trials in every condition to compare " +
        "them. Press Start again and run another block.";
      wb.hide("#chart-wrap"); wb.hide("#values");
      accuracyLine.textContent = "";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough completed trials for a result.");
      return;
    }

    var dropVerbal = cells[cellKey("verbal", 2)].rate - cells[cellKey("verbal", 6)].rate;
    var dropSpatial = cells[cellKey("spatial", 2)].rate - cells[cellKey("spatial", 6)].rate;

    resultLead.textContent =
      "With letters to judge in between, going from two letters to six cost " +
      "you " + pc(dropVerbal) + " of your recall. With positions to judge in " +
      "between, the same change cost " + pc(dropSpatial) + ". " +
      (dropVerbal - dropSpatial > 0.06
        ? "The same amount of extra load cost you more when the thing you were " +
          "doing in between was made of the same material as the thing you " +
          "were holding."
        : dropSpatial - dropVerbal > 0.06
          ? "That is the other way round from the usual finding, which happens " +
            "with this few trials and is worth treating as noise rather than " +
            "as a discovery."
          : "The two costs came out close together this time, which with this " +
            "few trials is a perfectly ordinary outcome.");

    wb.show("#chart-wrap"); wb.show("#values");
    renderChart(cells);
    renderTable(cells);
    accuracyLine.textContent =
      "You answered " + fillerHits + " of the " + fillerTotal +
      " in-between judgements correctly. Those judgements are paced and move " +
      "on without you, so a missed one counts as unanswered rather than wrong; " +
      "they are there to occupy you rather than to be scored.";
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Block complete. The two lines are below.");
  }

  function pc(x) { return Math.round(100 * x) + "%"; }

  var SERIES = {
    verbal: { stroke: "#C0434F", dash: null, label: "Judging letters in between" },
    spatial: { stroke: "#1C7293", dash: "7 5", label: "Judging positions in between" }
  };

  function renderChart(cells) {
    var LEFT = 150, RIGHT = 600, TOP = 60, BOTTOM = 330;
    /* Domain 1 to 7 rather than 2 to 6: with load 2 sitting exactly on the
       y-axis its value label straddles the axis line. */
    var X = function (load) { return LEFT + ((load - 1) / 6) * (RIGHT - LEFT); };
    var Y = function (r) { return BOTTOM - r * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 70));

    var title = svg("text", { x: LEFT - 60, y: 26, class: "plot__label" });
    title.textContent = "How much you recalled";
    chart.appendChild(title);

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    [0, 0.5, 1].forEach(function (r) {
      var tick = svg("text", { x: LEFT - 10, y: (Y(r) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick" });
      tick.textContent = pc(r);
      chart.appendChild(tick);
    });
    LOADS.forEach(function (load) {
      var tick = svg("text", { x: X(load).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(load);
      chart.appendChild(tick);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Letters held in mind";
    chart.appendChild(cap);

    DOMAINS.forEach(function (d) {
      var s = SERIES[d];
      var line = {
        x1: X(LOADS[0]).toFixed(1), y1: Y(cells[cellKey(d, LOADS[0])].rate).toFixed(1),
        x2: X(LOADS[1]).toFixed(1), y2: Y(cells[cellKey(d, LOADS[1])].rate).toFixed(1),
        stroke: s.stroke, "stroke-width": "2.6"
      };
      if (s.dash) { line["stroke-dasharray"] = s.dash; }
      chart.appendChild(svg("line", line));
      LOADS.forEach(function (load) {
        var r = cells[cellKey(d, load)].rate;
        if (d === "verbal") {
          chart.appendChild(svg("circle", { cx: X(load).toFixed(1), cy: Y(r).toFixed(1), r: 6, fill: s.stroke }));
        } else {
          chart.appendChild(svg("rect", {
            x: (X(load) - 5.5).toFixed(1), y: (Y(r) - 5.5).toFixed(1),
            width: 11, height: 11, fill: "none", stroke: s.stroke, "stroke-width": 2.4
          }));
        }
        var value = svg("text", {
          x: X(load).toFixed(1), y: (Y(r) - 14).toFixed(1), "text-anchor": "middle",
          class: "plot__sub plot__over", fill: s.stroke
        });
        value.textContent = pc(r);
        chart.appendChild(value);
      });
    });

    var KEY_X = RIGHT + 46, KEY_Y = TOP + 30;
    var head = svg("text", { x: KEY_X, y: KEY_Y - 22, class: "plot__label" });
    head.textContent = "In between";
    chart.appendChild(head);
    DOMAINS.forEach(function (d, i) {
      var s = SERIES[d], y = KEY_Y + i * 46;
      var sample = { x1: KEY_X, y1: y, x2: KEY_X + 30, y2: y, stroke: s.stroke, "stroke-width": "2.6" };
      if (s.dash) { sample["stroke-dasharray"] = s.dash; }
      chart.appendChild(svg("line", sample));
      if (d === "verbal") {
        chart.appendChild(svg("circle", { cx: KEY_X + 15, cy: y, r: 5, fill: s.stroke }));
      } else {
        chart.appendChild(svg("rect", { x: KEY_X + 10, y: y - 5, width: 10, height: 10, fill: "none", stroke: s.stroke, "stroke-width": 2.2 }));
      }
      var text = svg("text", { x: KEY_X, y: y + 22, class: "plot__sub", fill: s.stroke });
      text.textContent = s.label;
      chart.appendChild(text);
    });

    chartDesc.textContent =
      "Two lines of recall accuracy against the number of letters held. " +
      DOMAINS.map(function (d) {
        return SERIES[d].label + ": " +
          LOADS.map(function (l) { return pc(cells[cellKey(d, l)].rate) + " at " + l + " letters"; }).join(", ");
      }).join(". ") + ".";
  }

  function renderTable(cells) {
    tableBody.textContent = "";
    DOMAINS.forEach(function (d) {
      LOADS.forEach(function (load) {
        var cell = cells[cellKey(d, load)];
        var row = document.createElement("tr");
        [DOMAIN_LABEL[d], String(load), pc(cell.rate), String(cell.trials)]
          .forEach(function (text, i) {
            var td = document.createElement(i === 0 ? "th" : "td");
            if (i === 0) { td.setAttribute("scope", "row"); }
            td.textContent = text;
            row.appendChild(td);
          });
        tableBody.appendChild(row);
      });
    });
    tableCaption.textContent =
      "Your block: " + TRIALS_PER_CELL + " trials per cell, scored as the " +
      "proportion of the held letters picked correctly.";
  }

  /* --- Wiring ------------------------------------------------------------ */

  start.addEventListener("click", startPractice);

  stop.addEventListener("click", function () {
    clearTimer();
    if (phase === "block" && results.length >= 8) { report(); return; }
    doReset();
    wb.announce("Stopped before there was enough data for a result. " +
      "Press Start the practice to run a block from the beginning.");
  });

  function doReset() {
    clearTimer();
    phase = "idle"; trials = []; index = 0; results = []; current = null;
    picked = []; fillerIndex = 0; fillerHits = 0; fillerTotal = 0;
    padInter.hidden = true; padRecall.hidden = true;
    padInter.textContent = ""; padRecall.textContent = "";
    feedback.hidden = true;
    clearField();
    setupNote.hidden = false;
    stepLabel.textContent = "Practice";
    taskHeading.textContent = "Hold the letters, do the other thing, then recall";
    taskLead.textContent = "Each trial has three parts. You are shown some " +
      "letters to hold in mind. Then you make four quick judgements about " +
      "something else. Then you pick the letters out of a grid. Two practice " +
      "trials first.";
    counter.textContent = "";
    start.hidden = false; stop.hidden = true;
    wb.progress.reset();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
  doReset();
})();
