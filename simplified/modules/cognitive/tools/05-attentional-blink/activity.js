/* =========================================================================
   Attentional Blink — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/05-attentional-blink/

   TEACHING JOB
   ------------
   Reporting one target in a fast stream leaves a few hundred milliseconds in
   which a second target is displayed, looked at, and not reported.

   WHAT IS PRESERVED
   -----------------
   The performed RSVP task and the lag function it produces, which is the
   whole point: the dip has to be produced rather than described. The stream,
   the target definitions and the lags all follow the original.

       stream        18 consonants at ITEM_MS each
       T1            one digit, at position 5, 6 or 7
       T2            the letter X, at T1 position + lag
       lags          1, 2, 3, 5, 8 items, so 100 to 800 ms after T1
       catch trials  no X at all, so "yes" is not free

   Accuracy for T2 is computed ONLY over streams where T1 was reported
   correctly. This is not tidying: an attentional blink is defined as the cost
   of having processed the first target, so streams where the first target was
   missed cannot speak to it.

   T1's report is odd-or-even rather than which digit. Two keys instead of
   six, the same requirement to have identified the digit, and a response that
   is quick enough not to eat into the next stream.

   THE SAFETY QUESTION, AND WHY THERE IS A SECOND ROUTE
   ----------------------------------------------------
   RSVP at ten items a second is the paradigm; slowing it down abolishes the
   effect, so it cannot be made gentler and still be itself. The ground never
   changes and nothing flashes or moves, but it is still rapid change in one
   spot. A worked-example route therefore produces the same figure from
   simulated data with a per-lag accuracy profile taken from the original, is
   labelled as simulated everywhere it appears, and reaches every conclusion
   the performed route reaches. It is offered before the task rather than
   after it.

   WHAT WAS REDUCED
   ----------------
   The practice block with explanatory feedback on every stream, the second
   response mode, and the across-block comparison.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var STREAM_LENGTH = 18;
  var T1_POSITIONS = [5, 6, 7];
  var LAGS = [1, 2, 3, 5, 8];
  var ITEM_MS = 100;
  var PRACTICE_ITEM_MS = 220;
  var BLANK_BEFORE_MS = 700;
  var BLANK_AFTER_MS = 250;
  var FEEDBACK_MS = 1400;
  var TRIALS_PER_LAG = 5;
  var CATCH_TRIALS = 6;
  var PRACTICE_TRIALS = 4;

  /* Consonants only. X is reserved for the second target, and I, O and Q are
     left out because they are easily confused with digits at speed. */
  var DISTRACTORS = "BCDFGHJKLMNPRSTVWYZ".split("").filter(function (c) {
    return c !== "X";
  });
  var DIGITS = ["2", "3", "4", "5", "6", "7"];

  /* Worked-example parameters, taken from the original. */
  var SIM = {
    seed: 20260935, perLag: 48, catchTrials: 40,
    t1Accuracy: 0.88,
    t2GivenT1: { 1: 0.86, 2: 0.48, 3: 0.41, 5: 0.72, 8: 0.88 },
    falseAlarm: 0.08
  };

  var stageMessage = document.getElementById("stage-message");
  var stimulus = document.getElementById("stimulus");
  var answers = document.getElementById("answers");
  var q1Lead = document.getElementById("q1-lead");
  var q2Lead = document.getElementById("q2-lead");
  var padOne = document.getElementById("keypad-one");
  var padTwo = document.getElementById("keypad-two");
  var feedback = document.getElementById("feedback");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var worked = document.getElementById("worked");
  var stop = document.getElementById("stop");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var safety = document.getElementById("safety");
  var resultStep = document.getElementById("result-step");
  var resultHeading = document.getElementById("result-heading");
  var resultLead = document.getElementById("result-lead");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var notesLine = document.getElementById("notes-line");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

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
  function shuffle(list, random) {
    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var s = list[k]; list[k] = list[j]; list[j] = s;
      k -= 1;
    }
    return list;
  }

  /* --- Building streams -------------------------------------------------- */

  function buildStream(lag, random) {
    var items = [];
    var i = 0;
    while (i < STREAM_LENGTH) {
      items.push(DISTRACTORS[Math.floor(random() * DISTRACTORS.length)]);
      i += 1;
    }
    var t1Pos = T1_POSITIONS[Math.floor(random() * T1_POSITIONS.length)];
    var digit = DIGITS[Math.floor(random() * DIGITS.length)];
    items[t1Pos] = digit;
    var t2Pos = null;
    if (lag !== null) {
      t2Pos = t1Pos + lag;
      if (t2Pos >= STREAM_LENGTH) { t2Pos = STREAM_LENGTH - 1; }
      items[t2Pos] = "X";
    }
    return {
      items: items, lag: lag, digit: digit,
      parity: Number(digit) % 2 === 0 ? "even" : "odd",
      hasX: lag !== null
    };
  }

  function buildTrials(random) {
    var list = [];
    LAGS.forEach(function (lag) {
      var i = 0;
      while (i < TRIALS_PER_LAG) { list.push(lag); i += 1; }
    });
    var c = 0;
    while (c < CATCH_TRIALS) { list.push(null); c += 1; }
    return shuffle(list, random).map(function (lag) { return buildStream(lag, random); });
  }

  /* --- Keypads ----------------------------------------------------------- */

  function fillPad(pad, entries, handler) {
    pad.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = pad === padOne ? "Was the digit odd or even?" : "Did you see an X?";
    pad.appendChild(legend);
    entries.forEach(function (entry) {
      var key = document.createElement("button");
      key.type = "button";
      key.className = "keypad__key";
      key.setAttribute("data-value", entry.value);
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

  /* --- Running ----------------------------------------------------------- */

  var phase = "idle";
  var trials = [];
  var index = 0;
  var results = [];
  var timer = null;
  var current = null;
  var parityAnswer = null;

  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }
  function itemMs() { return phase === "practice" ? PRACTICE_ITEM_MS : ITEM_MS; }

  function showItem(pos) {
    if (pos >= current.items.length) {
      stimulus.hidden = true;
      stageMessage.hidden = false;
      stageMessage.textContent = "·";
      timer = window.setTimeout(askParity, BLANK_AFTER_MS);
      return;
    }
    stageMessage.hidden = true;
    stimulus.hidden = false;
    stimulus.textContent = current.items[pos];
    timer = window.setTimeout(function () { showItem(pos + 1); }, itemMs());
  }

  function runTrial() {
    if (index >= trials.length) { finishPhase(); return; }
    current = trials[index];
    parityAnswer = null;
    feedback.hidden = true;
    wb.hide("#answers");
    padTwo.hidden = true;
    q2Lead.hidden = true;
    stimulus.hidden = true;
    stageMessage.hidden = false;
    stageMessage.textContent = "+";
    updateCounter();
    timer = window.setTimeout(function () { showItem(0); }, BLANK_BEFORE_MS);
  }

  function askParity() {
    stageMessage.textContent = "Answer below.";
    wb.show("#answers");
    padOne.hidden = false;
    q1Lead.hidden = false;
    wb.announce("Stream finished. Was the digit odd or even?");
  }

  function answerParity(value) {
    parityAnswer = value;
    q2Lead.hidden = false;
    padTwo.hidden = false;
    padOne.hidden = true;
    q1Lead.hidden = true;
    wb.announce("Now, did you see an X?");
  }

  function answerX(value) {
    var saidYes = value === "yes";
    var t1Correct = parityAnswer === current.parity;
    if (phase === "block") {
      results.push({
        lag: current.lag, hasX: current.hasX,
        t1Correct: t1Correct, saidYes: saidYes
      });
    }
    index += 1;

    if (phase === "practice") {
      wb.hide("#answers");
      feedback.hidden = false;
      feedback.textContent =
        "The digit was " + current.digit + ", which is " + current.parity + ", and " +
        (current.hasX ? "there was an X." : "there was no X.") +
        " You said " + parityAnswer + " and " + (saidYes ? "yes." : "no.");
      timer = window.setTimeout(runTrial, FEEDBACK_MS);
      return;
    }
    wb.hide("#answers");
    timer = window.setTimeout(runTrial, 250);
  }

  function updateCounter() {
    counter.textContent = phase === "practice"
      ? "Practice stream " + (index + 1) + " of " + trials.length + ", running slowly."
      : "Stream " + (index + 1) + " of " + trials.length + ".";
  }

  function startPractice() {
    phase = "practice";
    trials = buildTrials(mulberry32(4242)).slice(0, PRACTICE_TRIALS);
    index = 0; results = [];
    wb.progress.set(0);
    stepLabel.textContent = "Practice";
    taskHeading.textContent = "Practice, at half speed";
    taskLead.textContent = "Four practice streams, slowed down, with the answers " +
      "shown after each one. The scored block runs at full speed.";
    safety.hidden = true;
    start.hidden = true; worked.hidden = true; stop.hidden = false;
    wb.announce("Practice started, at half speed.");
    runTrial();
  }

  function startBlock() {
    phase = "block";
    trials = buildTrials(mulberry32(20260935));
    index = 0; results = [];
    wb.progress.set(1);
    stepLabel.textContent = "The block";
    taskHeading.textContent = "The scored block, at full speed";
    taskLead.textContent = trials.length + " streams, about three minutes, with " +
      "no feedback until the end. Some streams contain no X at all, so answering " +
      "yes every time will not help you.";
    wb.announce("Block started. " + trials.length + " streams at full speed.");
    runTrial();
  }

  function finishPhase() {
    clearTimer();
    wb.hide("#answers");
    stimulus.hidden = true;
    stageMessage.hidden = false;
    stageMessage.textContent = "Finished.";
    if (phase === "practice") {
      wb.announce("Practice complete. The scored block runs at full speed.");
      startBlock();
      return;
    }
    report(summarise(results), "performed");
  }

  /* --- Results ----------------------------------------------------------- */

  function summarise(rows) {
    var byLag = {};
    LAGS.forEach(function (lag) { byLag[lag] = { seen: 0, counted: 0 }; });
    var catches = { total: 0, falseAlarms: 0 };
    var t1Right = 0, t1Total = 0;
    rows.forEach(function (r) {
      t1Total += 1;
      if (r.t1Correct) { t1Right += 1; }
      if (!r.hasX) {
        catches.total += 1;
        if (r.saidYes) { catches.falseAlarms += 1; }
        return;
      }
      if (!r.t1Correct) { return; }
      byLag[r.lag].counted += 1;
      if (r.saidYes) { byLag[r.lag].seen += 1; }
    });
    LAGS.forEach(function (lag) {
      var cell = byLag[lag];
      cell.rate = cell.counted ? cell.seen / cell.counted : null;
    });
    return {
      byLag: byLag, catches: catches,
      t1Accuracy: t1Total ? t1Right / t1Total : null
    };
  }

  function simulate() {
    var random = mulberry32(SIM.seed);
    var rows = [];
    LAGS.forEach(function (lag) {
      var i = 0;
      while (i < SIM.perLag) {
        var t1 = random() < SIM.t1Accuracy;
        rows.push({
          lag: lag, hasX: true, t1Correct: t1,
          saidYes: random() < SIM.t2GivenT1[lag]
        });
        i += 1;
      }
    });
    var c = 0;
    while (c < SIM.catchTrials) {
      rows.push({
        lag: null, hasX: false,
        t1Correct: random() < SIM.t1Accuracy,
        saidYes: random() < SIM.falseAlarm
      });
      c += 1;
    }
    return summarise(rows);
  }

  function report(stats, source) {
    phase = "done";
    clearTimer();
    stop.hidden = true;
    wb.progress.markAllDone();
    stepLabel.textContent = "The lag function";
    counter.textContent = "";

    var simulated = source === "simulated";
    resultStep.textContent = simulated ? "Worked example" : "The lag function";
    resultHeading.textContent = simulated
      ? "The dip, from simulated data"
      : "The dip";

    var usable = LAGS.filter(function (l) { return stats.byLag[l].rate !== null; });
    if (usable.length < 3) {
      resultLead.textContent =
        "There were not enough streams with the digit reported correctly to " +
        "draw the curve. Press Start again and run another block.";
      wb.show("#synthesis");
      wb.scrollTo("#synthesis", { focus: true });
      wb.announce("Not enough usable streams for a result.");
      return;
    }

    var early = stats.byLag[1].rate, dip = null, dipLag = null;
    LAGS.forEach(function (l) {
      var r = stats.byLag[l].rate;
      if (r !== null && (dip === null || r < dip)) { dip = r; dipLag = l; }
    });
    var late = stats.byLag[8].rate;

    resultLead.textContent =
      (simulated
        ? "These are simulated data, not yours, generated from a typical set of "
          + "per-lag accuracies. "
        : "") +
      "You spotted the X on " + pc(stats.byLag[1].rate) +
      " of the streams where it arrived immediately after the digit, on " +
      pc(dip) + " where it arrived " + dipLag + " items later" +
      (dipLag === 1 ? "" : ", the worst point of the curve") +
      ", and on " + pc(late) + " where it arrived eight items later, which is " +
      "eight tenths of a second. The X was equally visible in all of them.";

    renderChart(stats, simulated);
    renderTable(stats, simulated);

    notesLine.textContent =
      (stats.t1Accuracy !== null
        ? "The digit was reported correctly on " + pc(stats.t1Accuracy) +
          " of streams, and only those streams are counted above. "
        : "") +
      "On the " + stats.catches.total + " streams containing no X at all, an X " +
      "was reported on " + stats.catches.falseAlarms + " of them, which is the " +
      "check that yes was not simply being said by default." +
      (simulated ? " All of these figures are simulated." : "");

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce((simulated ? "Worked example ready. " : "Block complete. ") +
      "The curve dips to " + pc(dip) + " at lag " + dipLag + ".");
  }

  function pc(x) { return x === null ? "no data" : Math.round(100 * x) + "%"; }

  function renderChart(stats, simulated) {
    var LEFT = 110, RIGHT = 830, TOP = 60, BOTTOM = 330;
    /* Domain 0 to 9 rather than 1 to 8: with lag 1 sitting exactly on the
       y-axis its value label straddles the axis line. */
    var X = function (lag) { return LEFT + (lag / 9) * (RIGHT - LEFT); };
    var Y = function (r) { return BOTTOM - r * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 78));

    var title = svg("text", { x: LEFT, y: 26, class: "plot__label" });
    title.textContent = simulated
      ? "How often the X was spotted, simulated data"
      : "How often you spotted the X";
    chart.appendChild(title);

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    [0, 0.25, 0.5, 0.75, 1].forEach(function (r) {
      var tick = svg("text", {
        x: LEFT - 10, y: (Y(r) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = Math.round(100 * r) + "%";
      chart.appendChild(tick);
    });
    LAGS.forEach(function (lag) {
      var tick = svg("text", { x: X(lag).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(lag);
      chart.appendChild(tick);
      var ms = svg("text", { x: X(lag).toFixed(1), y: BOTTOM + 44, "text-anchor": "middle", class: "plot__tick" });
      ms.textContent = (lag * 100) + " ms";
      chart.appendChild(ms);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 68, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "How long after the digit the X arrived";
    chart.appendChild(cap);
    var ycap = svg("text", {
      x: 40, y: ((TOP + BOTTOM) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
      transform: "rotate(-90 40 " + ((TOP + BOTTOM) / 2).toFixed(1) + ")"
    });
    ycap.textContent = "X spotted";
    chart.appendChild(ycap);

    var path = LAGS.filter(function (l) { return stats.byLag[l].rate !== null; })
      .map(function (l, i) {
        return (i === 0 ? "M " : "L ") + X(l).toFixed(1) + " " + Y(stats.byLag[l].rate).toFixed(1);
      }).join(" ");
    chart.appendChild(svg("path", {
      d: path, fill: "none", stroke: "#1C7293", "stroke-width": "2.6", "stroke-linejoin": "round"
    }));
    LAGS.forEach(function (l) {
      var r = stats.byLag[l].rate;
      if (r === null) { return; }
      chart.appendChild(svg("circle", {
        cx: X(l).toFixed(1), cy: Y(r).toFixed(1), r: 6, fill: "#1C7293"
      }));
      var value = svg("text", {
        x: X(l).toFixed(1), y: (Y(r) - 14).toFixed(1), "text-anchor": "middle",
        class: "plot__sub plot__over"
      });
      value.textContent = pc(r);
      chart.appendChild(value);
    });

    chartDesc.textContent =
      (simulated ? "Simulated data. " : "") +
      "A curve of how often the X was reported against how many items after " +
      "the digit it arrived. The values are " +
      LAGS.map(function (l) {
        return "lag " + l + ", " + (l * 100) + " milliseconds, " + pc(stats.byLag[l].rate);
      }).join("; ") + ".";
  }

  function renderTable(stats, simulated) {
    tableBody.textContent = "";
    LAGS.forEach(function (lag) {
      var cell = stats.byLag[lag];
      var row = document.createElement("tr");
      [String(lag), (lag * 100) + " ms", pc(cell.rate), String(cell.counted)]
        .forEach(function (text, i) {
          var td = document.createElement(i === 0 ? "th" : "td");
          if (i === 0) { td.setAttribute("scope", "row"); }
          td.textContent = text;
          row.appendChild(td);
        });
      tableBody.appendChild(row);
    });
    tableCaption.textContent = simulated
      ? "Simulated worked example: " + SIM.perLag + " streams per lag."
      : "Your block: streams counted are those where the digit was reported correctly.";
  }

  /* --- Wiring ------------------------------------------------------------ */

  fillPad(padOne, [
    { value: "odd", label: "Odd", hint: "left arrow" },
    { value: "even", label: "Even", hint: "right arrow" }
  ], answerParity);
  fillPad(padTwo, [
    { value: "yes", label: "Yes, I saw an X", hint: "left arrow" },
    { value: "no", label: "No X", hint: "right arrow" }
  ], answerX);

  document.addEventListener("keydown", function (event) {
    if (answers.hidden) { return; }
    var left = event.key === "ArrowLeft", right = event.key === "ArrowRight";
    if (!left && !right) { return; }
    event.preventDefault();
    if (!padOne.hidden) { answerParity(left ? "odd" : "even"); return; }
    if (!padTwo.hidden) { answerX(left ? "yes" : "no"); }
  });

  start.addEventListener("click", startPractice);

  worked.addEventListener("click", function () {
    clearTimer();
    phase = "done";
    stepLabel.textContent = "Worked example";
    taskHeading.textContent = "A worked example instead";
    taskLead.textContent = "Nothing was run. The figure below is built from " +
      "simulated data with a typical accuracy at each lag, and every part of " +
      "it is labelled as simulated.";
    safety.hidden = true;
    start.hidden = true; worked.hidden = true;
    stageMessage.textContent = "Nothing was run.";
    report(simulate(), "simulated");
  });

  stop.addEventListener("click", function () {
    clearTimer();
    if (phase === "block" && results.length >= 12) {
      report(summarise(results), "performed");
      return;
    }
    doReset();
    wb.announce("Stopped before there was enough data for a result. " +
      "Press Start the practice to run a block from the beginning.");
  });

  function doReset() {
    clearTimer();
    phase = "idle"; trials = []; index = 0; results = []; current = null;
    parityAnswer = null;
    wb.hide("#answers");
    padOne.hidden = false; padTwo.hidden = true;
    q1Lead.hidden = false; q2Lead.hidden = true;
    feedback.hidden = true;
    stimulus.hidden = true;
    stageMessage.hidden = false;
    stageMessage.textContent = "Ready when you are.";
    safety.hidden = false;
    stepLabel.textContent = "Before you start";
    taskHeading.textContent = "Two things to find in each stream";
    taskLead.innerHTML = "Letters appear one at a time in the middle of the " +
      "panel. Somewhere in each stream there is <strong>one digit</strong>, and " +
      "somewhere after it there may or may not be the letter <strong>X</strong>. " +
      "After each stream you answer two questions: was the digit odd or even, " +
      "and did you see an X.";
    counter.textContent = "";
    start.hidden = false; worked.hidden = false; stop.hidden = true;
    wb.progress.reset();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
})();
