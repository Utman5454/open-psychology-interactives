/* =========================================================================
   Stroop Interference Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/cognitive/tools/06-stroop-interference-lab/

   WHAT IS PRESERVED
   -----------------
   The performed task, which is the whole point: the learner feels the
   conflict before any number appears. Everything the original needs to split
   one "Stroop effect" into two is kept.

       interference  = mean incongruent RT  -  mean neutral RT
       facilitation  = mean neutral RT      -  mean congruent RT

   Reporting only (incongruent - congruent) collapses those two, and the
   collapse is exactly what a learner needs to see undone. The neutral
   condition is therefore not optional here; it is the baseline both effects
   are measured from, and the figure draws them from it in opposite
   directions.

   THE TRIAL, as in the original
   -----------------------------
       fixation cross      500 ms
       word                until the learner responds, never timed out

   Two display changes per trial, neither faster than about twice a second.
   Nothing fades, moves or animates, so there is nothing for a reduced-motion
   rule to switch off, which the page states.

   THE STIMULI (all original; no proprietary test material)
   -------------------------------------------------------
       congruent     a colour word printed in its own colour
       incongruent   a colour word printed in a different colour from the set
       neutral       an ordinary non-colour word printed in one of the inks

   Neutral items are common concrete nouns of roughly the same length as the
   colour words. Length matching is approximate and the teaching notes say so:
   a fully matched neutral set would control frequency and orthographic
   neighbourhood too.

   RESULTS ARE WITHHELD UNTIL THE BLOCK ENDS
   -----------------------------------------
   A deliberate exception to the usual rule that a learner should see the
   consequence while making it. A running condition mean on screen during a
   speeded block changes how people answer the next trial. Practice trials
   give immediate feedback; scored trials give none until the block is over.

   CLEANING, as in the original
   ----------------------------
   Responses under 200 ms cannot be reactions to a four-choice display, and
   responses over 3000 ms are lapses of a different kind. Both are counted,
   reported, and kept out of the condition means rather than silently
   averaged in. Errors are excluded from the means and reported as accuracy.

   WHAT WAS REDUCED
   ----------------
   One configuration instead of three menus: four colours, an even mix, one
   block length. The two-colour palette, the mostly-incongruent mix, the
   block-length control, the running table of every block, the opening
   prediction, the transfer challenge and the simulated worked example are all
   gone. The mix manipulation in particular is a second teaching job, that the
   effect moves when the context moves, and it needs two blocks to make.

   45 scored trials, 15 per condition, is enough to feel the effect and far
   too few to measure it. The limitation section says so in those words.

   NO PREDICTION PANEL, deliberately
   ---------------------------------
   The collection's standard loop asks for a judgement before the reveal, and
   CLAUDE.md allows a different structure where one is pedagogically stronger.
   Here the performed task is itself the commitment: the learner meets the
   conflict on trial one and feels it long before a number appears, which is a
   stronger initial encounter than choosing between three sentences about it.

   Trial order is randomised per run, with no more than two consecutive trials
   sharing a correct response, so a repeated run is a fresh order rather than
   the same one again. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var FIXATION_MS = 500;
  var FEEDBACK_MS = 1400;
  var INTER_TRIAL_MS = 400;
  var PRACTICE_TRIALS = 6;
  var SCORED_PER_CONDITION = 15;

  var ANTICIPATION_MS = 200;   /* too fast to be a four-choice response */
  var LAPSE_MS = 3000;         /* a lapse of a different kind */
  var MIN_USABLE_PER_CONDITION = 3;

  var CONDITIONS = ["congruent", "neutral", "incongruent"];
  var CONDITION_LABEL = {
    congruent: "Congruent",
    neutral: "Neutral",
    incongruent: "Incongruent"
  };

  /* Every ink clears 7:1 against the #15181D task panel. */
  var INKS = [
    { key: "red", name: "Red", hex: "#FF7B7B" },
    { key: "green", name: "Green", hex: "#5FD47A" },
    { key: "blue", name: "Blue", hex: "#7FB0FF" },
    { key: "yellow", name: "Yellow", hex: "#F2D24B" }
  ];

  var NEUTRAL_WORDS = ["CUP", "DESK", "CHAIR", "MONTH", "TABLE", "PLANT", "HOUSE", "WATER"];

  /* --- Elements -------------------------------------------------------- */

  var stepLabel = document.getElementById("step-label");
  var taskLead = document.getElementById("task-lead");
  var stageMessage = document.getElementById("stage-message");
  var stimulus = document.getElementById("stimulus");
  var feedback = document.getElementById("feedback");
  var keypad = document.getElementById("keypad");
  var counter = document.getElementById("counter");
  var startButton = document.getElementById("start");
  var stopButton = document.getElementById("stop");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var resultLead = document.getElementById("result-lead");
  var accuracyLine = document.getElementById("accuracy");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");

  var SVG_NS = "http://www.w3.org/2000/svg";

  /* --- State ----------------------------------------------------------- */

  var phase = "idle";     /* idle | practice | block | done */
  var trials = [];
  var at = 0;
  var results = [];
  var shownAt = 0;
  var accepting = false;
  var timer = null;

  /* --- Stimulus construction ------------------------------------------- */

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function inkOther(than) {
    var others = INKS.filter(function (ink) {
      return ink.key !== than.key;
    });
    return pick(others);
  }

  function makeTrial(condition) {
    var ink;
    var word;

    if (condition === "congruent") {
      ink = pick(INKS);
      word = ink.name.toUpperCase();
    } else if (condition === "incongruent") {
      ink = pick(INKS);
      word = inkOther(ink).name.toUpperCase();
    } else {
      ink = pick(INKS);
      word = pick(NEUTRAL_WORDS);
    }

    return { condition: condition, ink: ink, word: word };
  }

  /**
   * Build a block and order it so that no more than two consecutive trials
   * share a correct response. A run of the same key invites a repetition
   * effect that has nothing to do with the word.
   */
  function buildBlock(perCondition) {
    var wanted = [];
    CONDITIONS.forEach(function (condition) {
      var count = perCondition;
      while (count > 0) {
        wanted.push(condition);
        count -= 1;
      }
    });

    var ordered = [];
    var attempts = 0;

    while (wanted.length && attempts < 4000) {
      attempts += 1;
      var index = Math.floor(Math.random() * wanted.length);
      var trial = makeTrial(wanted[index]);
      var n = ordered.length;

      if (n >= 2 &&
          ordered[n - 1].ink.key === trial.ink.key &&
          ordered[n - 2].ink.key === trial.ink.key) {
        continue;   /* would be a third in a row; redraw */
      }

      ordered.push(trial);
      wanted.splice(index, 1);
    }

    return ordered;
  }

  function buildPractice(count) {
    var mix = [];
    var i = 0;
    while (i < count) {
      mix.push(CONDITIONS[i % CONDITIONS.length]);
      i += 1;
    }
    return mix.map(makeTrial);
  }

  /* --- The keypad ------------------------------------------------------ */

  function renderKeypad() {
    keypad.textContent = "";

    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which colour is the ink?";
    keypad.appendChild(legend);

    INKS.forEach(function (ink, position) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-ink", ink.key);
      key.disabled = true;

      var swatch = document.createElement("span");
      swatch.className = "keypad__swatch";
      swatch.style.background = ink.hex;

      var name = document.createElement("span");
      name.textContent = ink.name;

      var hint = document.createElement("span");
      hint.className = "keypad__hint";
      hint.textContent = "key " + (position + 1);

      key.appendChild(swatch);
      key.appendChild(name);
      key.appendChild(hint);
      key.addEventListener("click", function () {
        respond(ink.key);
      });

      keypad.appendChild(key);
    });
  }

  function keysEnabled(on) {
    Array.prototype.forEach.call(
      keypad.querySelectorAll("[data-ink]"),
      function (key) {
        key.disabled = !on;
      }
    );
  }

  document.addEventListener("keydown", function (event) {
    if (!accepting) {
      return;
    }
    var position = ["1", "2", "3", "4"].indexOf(event.key);
    if (position === -1) {
      return;
    }
    event.preventDefault();
    respond(INKS[position].key);
  });

  /* --- Running a trial ------------------------------------------------- */

  function runTrial() {
    if (at >= trials.length) {
      finishPhase();
      return;
    }

    var trial = trials[at];

    accepting = false;
    keysEnabled(false);
    wb.hide(stimulus);
    wb.hide(feedback);
    stageMessage.textContent = "+";
    wb.show(stageMessage);

    counter.textContent = phase === "practice"
      ? "Practice trial " + (at + 1) + " of " + trials.length + "."
      : "Trial " + (at + 1) + " of " + trials.length + ".";

    timer = window.setTimeout(function () {
      wb.hide(stageMessage);
      stimulus.textContent = trial.word;
      stimulus.style.color = trial.ink.hex;
      wb.show(stimulus);
      keysEnabled(true);
      accepting = true;
      shownAt = window.performance && window.performance.now
        ? window.performance.now()
        : new Date().getTime();
    }, FIXATION_MS);
  }

  function respond(inkKey) {
    if (!accepting) {
      return;
    }
    accepting = false;
    keysEnabled(false);

    var now = window.performance && window.performance.now
      ? window.performance.now()
      : new Date().getTime();
    var trial = trials[at];
    var rt = now - shownAt;
    var correct = inkKey === trial.ink.key;

    if (phase === "block") {
      results.push({ condition: trial.condition, rt: rt, correct: correct });
    }

    at += 1;

    if (phase === "practice") {
      /* Practice tells you what happened. The scored block does not, because
         a running score changes how people answer the next trial. */
      feedback.textContent = correct
        ? "Correct. The ink was " + trial.ink.name.toLowerCase() + "."
        : "The ink was " + trial.ink.name.toLowerCase() + ", not " +
          inkName(inkKey).toLowerCase() + ".";
      wb.show(feedback);
      wb.hide(stimulus);
      timer = window.setTimeout(runTrial, FEEDBACK_MS);
      return;
    }

    wb.hide(stimulus);
    timer = window.setTimeout(runTrial, INTER_TRIAL_MS);
  }

  function inkName(key) {
    var found = key;
    INKS.forEach(function (ink) {
      if (ink.key === key) {
        found = ink.name;
      }
    });
    return found;
  }

  /* --- Phases ---------------------------------------------------------- */

  function startPractice() {
    phase = "practice";
    trials = buildPractice(PRACTICE_TRIALS);
    at = 0;
    results = [];

    stepLabel.textContent = "Practice";
    taskLead.textContent =
      "Six untimed practice trials, with feedback after each one. Ignore what " +
      "the word says. Respond to the colour it is printed in.";
    wb.hide(startButton);
    wb.hide(stopButton);
    wb.progress.set(0);
    wb.announce("Practice started. Name the ink colour. Keys 1 to 4, or use the buttons.");
    runTrial();
  }

  function startBlock() {
    phase = "block";
    trials = buildBlock(SCORED_PER_CONDITION);
    at = 0;
    results = [];

    stepLabel.textContent = "The block";
    taskLead.textContent =
      "Now " + trials.length + " scored trials, with no feedback until the end. " +
      "Go as fast as you comfortably can while staying accurate.";
    wb.hide(startButton);
    wb.show(stopButton);
    wb.progress.set(1);
    wb.announce("Block started. " + trials.length + " trials, no feedback until the end.");
    runTrial();
  }

  function finishPhase() {
    window.clearTimeout(timer);
    accepting = false;
    keysEnabled(false);
    wb.hide(stimulus);
    wb.hide(feedback);

    if (phase === "practice") {
      phase = "idle";
      stageMessage.textContent = "Practice done.";
      wb.show(stageMessage);
      startButton.textContent = "Start the scored block";
      wb.show(startButton);
      counter.textContent = "Practice complete.";
      wb.announce("Practice complete. The scored block gives no feedback until it ends.");
      return;
    }

    phase = "done";
    stageMessage.textContent = "Block complete.";
    wb.show(stageMessage);
    wb.hide(stopButton);
    wb.progress.markAllDone();
    report();
  }

  /* --- The result ------------------------------------------------------ */

  function summarise() {
    var byCondition = {};
    var excluded = 0;

    CONDITIONS.forEach(function (condition) {
      byCondition[condition] = { rts: [], correct: 0, total: 0 };
    });

    results.forEach(function (entry) {
      var cell = byCondition[entry.condition];
      cell.total += 1;
      if (entry.correct) {
        cell.correct += 1;
        if (entry.rt >= ANTICIPATION_MS && entry.rt <= LAPSE_MS) {
          cell.rts.push(entry.rt);
        } else {
          excluded += 1;
        }
      }
    });

    var summary = { excluded: excluded, usable: true, cells: {} };

    CONDITIONS.forEach(function (condition) {
      var cell = byCondition[condition];
      var mean = cell.rts.length
        ? cell.rts.reduce(function (a, b) { return a + b; }, 0) / cell.rts.length
        : null;
      if (cell.rts.length < MIN_USABLE_PER_CONDITION) {
        summary.usable = false;
      }
      summary.cells[condition] = {
        mean: mean,
        used: cell.rts.length,
        total: cell.total,
        accuracy: cell.total ? cell.correct / cell.total : 0
      };
    });

    if (summary.usable) {
      summary.interference =
        summary.cells.incongruent.mean - summary.cells.neutral.mean;
      summary.facilitation =
        summary.cells.neutral.mean - summary.cells.congruent.mean;
    }

    return summary;
  }

  function report() {
    var summary = summarise();

    if (!summary.usable) {
      resultLead.textContent =
        "There are not enough usable trials to work out a mean for every " +
        "condition. That happens if the block was stopped early or if a lot of " +
        "responses were errors. Start again to run a full block.";
      chartDesc.textContent = "No chart: not enough usable trials.";
      while (chart.childNodes.length > 2) {
        chart.removeChild(chart.lastChild);
      }
      accuracyLine.textContent = "";
      tableBody.textContent = "";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough usable trials for a result.");
      return;
    }

    resultLead.textContent =
      "Both effects are measured from the same place, your neutral mean of " +
      Math.round(summary.cells.neutral.mean) + " ms. Interference is " +
      signed(summary.interference) + " ms, the cost of a word that conflicts " +
      "with the ink. Facilitation is " + signed(summary.facilitation) +
      " ms, the benefit of a word that agrees with it.";

    renderChart(summary);
    renderTable(summary);

    accuracyLine.textContent =
      "Accuracy: " + CONDITIONS.map(function (condition) {
        return CONDITION_LABEL[condition].toLowerCase() + " " +
          Math.round(summary.cells[condition].accuracy * 100) + "%";
      }).join(", ") + ". " +
      (summary.excluded === 0
        ? "No responses were excluded."
        : summary.excluded + (summary.excluded === 1 ? " response" : " responses") +
          " excluded as faster than " + ANTICIPATION_MS + " ms or slower than " +
          LAPSE_MS + " ms.");

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce(
      "Block complete. Interference " + signed(summary.interference) +
      " milliseconds, facilitation " + signed(summary.facilitation) +
      " milliseconds. Your result is below."
    );
  }

  function signed(value) {
    var rounded = Math.round(value);
    return (rounded > 0 ? "+" : "") + rounded;
  }

  /* --- One figure, three conditions, both effects from the baseline ---- */

  function renderChart(summary) {
    var LEFT = 150;
    var AXIS_START = 160;
    var AXIS_END = 840;
    var ROW = 62;
    var TOP = 34;     /* headroom for the baseline caption */
    var BAR = 30;

    var means = CONDITIONS.map(function (condition) {
      return summary.cells[condition].mean;
    });
    var top = Math.max.apply(null, means) * 1.18;
    var scaleMax = Math.ceil(top / 100) * 100;

    function xOf(ms) {
      return AXIS_START + (Math.max(0, Math.min(scaleMax, ms)) / scaleMax) *
        (AXIS_END - AXIS_START);
    }

    var axisY = TOP + CONDITIONS.length * ROW + 6;
    var total = axisY + 46;

    while (chart.childNodes.length > 2) {
      chart.removeChild(chart.lastChild);
    }
    chart.setAttribute("viewBox", "0 0 900 " + total);

    var defs = svg("defs", {});
    var marker = svg("marker", {
      id: "stroop-arrow", viewBox: "0 0 10 10", refX: "8", refY: "5",
      markerWidth: "7", markerHeight: "7", orient: "auto"
    });
    marker.appendChild(svg("path", { d: "M0 0L10 5L0 10Z", fill: "#3D5A80" }));
    defs.appendChild(marker);
    chart.appendChild(defs);

    var neutralX = xOf(summary.cells.neutral.mean);
    /* Every value in one column past the longest bar. Beside each bar end the
       dashed baseline cut straight through the congruent one. */
    var valueX = xOf(Math.max.apply(null, means)) + 12;

    CONDITIONS.forEach(function (condition, row) {
      var y = TOP + row * ROW;
      var mean = summary.cells[condition].mean;

      var label = svg("text", {
        x: LEFT, y: y + BAR / 2 + 5, "text-anchor": "end", class: "plot__label"
      });
      label.textContent = CONDITION_LABEL[condition];
      chart.appendChild(label);

      chart.appendChild(svg("rect", {
        x: AXIS_START, y: y, width: xOf(mean) - AXIS_START, height: BAR,
        rx: 4, class: "plot__bar"
      }));

      var value = svg("text", {
        x: valueX, y: y + BAR / 2 + 5, class: "plot__sub"
      });
      value.textContent = Math.round(mean) + " ms";
      chart.appendChild(value);

      /* The two effects, drawn from the neutral line in opposite directions
         at the same scale as the bars, so each arrow is literally as long as
         the difference it names. */
      if (condition !== "neutral") {
        var effect = condition === "incongruent"
          ? summary.interference
          : summary.facilitation;
        var to = xOf(mean);
        var arrowY = y + BAR + 14;

        chart.appendChild(svg("line", {
          x1: neutralX, y1: arrowY, x2: to, y2: arrowY,
          class: "plot__interval", "marker-end": "url(#stroop-arrow)"
        }));

        var name = svg("text", {
          x: condition === "incongruent" ? neutralX + 12 : neutralX - 12,
          y: arrowY + 16,
          "text-anchor": condition === "incongruent" ? "start" : "end",
          class: "plot__sub"
        });
        name.textContent =
          (condition === "incongruent" ? "Interference " : "Facilitation ") +
          signed(effect) + " ms";
        chart.appendChild(name);
      }
    });

    /* The baseline, drawn last so it sits above the bars. */
    chart.appendChild(svg("line", {
      x1: neutralX, y1: TOP - 8, x2: neutralX, y2: axisY,
      class: "plot__zero", "stroke-dasharray": "5 4"
    }));
    var baseline = svg("text", {
      x: neutralX, y: TOP - 20, "text-anchor": "middle", class: "plot__tick"
    });
    baseline.textContent = "Neutral baseline";
    chart.appendChild(baseline);

    chart.appendChild(svg("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "plot__axis"
    }));

    var step = scaleMax / 4;
    [0, step, step * 2, step * 3, scaleMax].forEach(function (tick) {
      var mark = svg("text", {
        x: xOf(tick), y: axisY + 20, "text-anchor": "middle", class: "plot__tick"
      });
      mark.textContent = String(Math.round(tick));
      chart.appendChild(mark);
    });

    var caption = svg("text", {
      x: (AXIS_START + AXIS_END) / 2, y: axisY + 38,
      "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Mean reaction time in milliseconds";
    chart.appendChild(caption);

    chartDesc.textContent =
      "Three horizontal bars on one millisecond scale. " +
      CONDITIONS.map(function (condition) {
        return CONDITION_LABEL[condition].toLowerCase() + " " +
          Math.round(summary.cells[condition].mean) + " milliseconds";
      }).join(", ") + ". A dashed line marks the neutral mean. An arrow runs " +
      "right from it to the incongruent bar, interference " +
      signed(summary.interference) + " milliseconds, and left from it to the " +
      "congruent bar, facilitation " + signed(summary.facilitation) +
      " milliseconds.";
  }

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function renderTable(summary) {
    tableBody.textContent = "";

    CONDITIONS.forEach(function (condition) {
      var cell = summary.cells[condition];
      var tr = document.createElement("tr");

      var th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = CONDITION_LABEL[condition];
      tr.appendChild(th);

      tr.appendChild(cellOf(Math.round(cell.mean) + " ms"));
      tr.appendChild(cellOf(cell.used + " of " + cell.total));
      tr.appendChild(cellOf(Math.round(cell.accuracy * 100) + "%"));
      tableBody.appendChild(tr);
    });

    tableCaption.textContent =
      "Correct responses only, after removing anything faster than " +
      ANTICIPATION_MS + " ms or slower than " + LAPSE_MS + " ms.";
  }

  function cellOf(text) {
    var td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  /* --- Controls -------------------------------------------------------- */

  startButton.addEventListener("click", function () {
    if (phase === "idle" && results.length === 0 && startButton.textContent.indexOf("practice") !== -1) {
      startPractice();
      return;
    }
    startBlock();
  });

  stopButton.addEventListener("click", function () {
    if (phase !== "block") {
      return;
    }
    trials = trials.slice(0, at);
    finishPhase();
  });

  wb.onReset(function () {
    window.clearTimeout(timer);
    phase = "idle";
    trials = [];
    at = 0;
    results = [];
    accepting = false;

    keysEnabled(false);
    wb.hide(stimulus);
    wb.hide(feedback);
    wb.hide(stopButton);
    wb.show(startButton);
    wb.hide("#synthesis");

    stepLabel.textContent = "Practice";
    taskLead.textContent =
      "Six untimed practice trials first, with feedback after each one. " +
      "Ignore what the word says. Respond to the colour it is printed in.";
    stageMessage.textContent = "Ready when you are.";
    wb.show(stageMessage);
    startButton.textContent = "Start the practice";
    counter.textContent = "Practice trial 1 of " + PRACTICE_TRIALS + ".";
    wb.progress.reset();
  });

  renderKeypad();
})();
