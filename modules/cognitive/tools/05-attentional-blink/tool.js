/* =========================================================================
   Attentional Blink
   -------------------------------------------------------------------------
   A two-target RSVP task. A stream of consonants appears one at a time in the
   same place. One item is a DIGIT (the first target, reported by pressing a
   key on a small on-screen keypad). On most trials the letter X appears some
   number of items later (the second target, reported yes or no). That number
   of items is the LAG, and second-target accuracy plotted against it is the
   lag function.

   THE DESIGN
   ----------
       stream length      18 items
       first target       a digit from 2 to 7, at stream position 5, 6 or 7
       second target      the letter X, at lags 1, 2, 3, 5 or 8 after it
       catch trials       5 trials with no X at all, so a "yes" bias shows up
       block              25 trials: 4 per lag plus 5 catch trials
       item duration      100 ms by default; 140 and 180 ms are offered

   Four trials per lag is far too few for a stable estimate. That is
   deliberate and stated in the results panel: the useful exercise is to
   compare an individual block with the worked example, not to treat either as
   a measurement.

   CONDITIONING ON THE FIRST TARGET
   --------------------------------
   Second-target accuracy is reported twice: over all trials, and over trials
   where the first target was reported correctly. The second is the
   convention, because trials where the first target was missed are trials
   where attention may never have been engaged at all. Showing both makes the
   size of that analytic choice visible instead of hiding it.

   PRESENTATION SAFETY
   -------------------
   Only the glyph changes. The box, its background, its size and its position
   are constant, so the changing region is a single character rather than a
   large area of screen, and nothing fades, moves or animates. Every trial
   waits indefinitely for both answers, the block can be stopped between
   trials, and the worked example reaches every conclusion without running a
   stream at all. Under prefers-reduced-motion the tool says so and points to
   the worked example.

   THE WORKED EXAMPLE (the non-timed route)
   ----------------------------------------
   Second-target detection is generated as a Bernoulli draw per trial with:

       p(T2 | T1 correct) by lag:  1 -> 0.86,  2 -> 0.48,  3 -> 0.41,
                                   5 -> 0.72,  8 -> 0.88
       p(T1 correct)               0.88 at every lag
       false-alarm rate on catch trials  0.08
       48 trials per lag, 40 catch trials, seed 20260935 — twelve times what a
       learner's own block provides per lag, which is the point of having both

   The lag-1 value is set above lags 2 and 3 because lag-1 sparing is a robust
   finding; it is BUILT IN here rather than discovered, and the results panel
   and the challenge both say so. These numbers are illustrative. They are not
   norms, not published estimates, and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var STREAM_LENGTH = 18;
  var T1_POSITIONS = [5, 6, 7];
  var LAGS = [1, 2, 3, 5, 8];
  var TRIALS_PER_LAG = 4;
  var CATCH_TRIALS = 5;
  var PRACTICE_TRIALS = 4;
  var PRACTICE_ITEM_MS = 220;
  var BLANK_BEFORE_MS = 700;
  var BLANK_AFTER_MS = 250;

  /* Consonants only, with X reserved for the second target and I, O and Q
     left out because they are easily confused with digits at speed. */
  var DISTRACTORS = "BCDFGHJKLMNPRSTVWYZ".split("").filter(function (c) {
    return c !== "X";
  });
  var DIGITS = ["2", "3", "4", "5", "6", "7"];

  var SIM = {
    seed: 20260935,
    perLag: 48,
    catchTrials: 40,
    t1Accuracy: 0.88,
    t2GivenT1: { 1: 0.86, 2: 0.48, 3: 0.41, 5: 0.72, 8: 0.88 },
    falseAlarm: 0.08
  };

  /* =======================================================================
     Seeded randomness
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

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  /* =======================================================================
     Trial construction
     ===================================================================== */

  function buildStream(lag, itemMs) {
    var t1Index = T1_POSITIONS[Math.floor(Math.random() * T1_POSITIONS.length)];
    var digit = DIGITS[Math.floor(Math.random() * DIGITS.length)];
    var items = [];
    for (var i = 0; i < STREAM_LENGTH; i += 1) {
      items.push(DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)]);
    }
    items[t1Index] = digit;

    var t2Index = null;
    if (lag !== null) {
      t2Index = t1Index + lag;
      if (t2Index >= STREAM_LENGTH) { t2Index = STREAM_LENGTH - 1; }
      items[t2Index] = "X";
    }

    return {
      items: items,
      digit: digit,
      t1Index: t1Index,
      t2Index: t2Index,
      lag: lag,
      itemMs: itemMs
    };
  }

  function buildBlock() {
    var trials = [];
    LAGS.forEach(function (lag) {
      for (var i = 0; i < TRIALS_PER_LAG; i += 1) { trials.push(lag); }
    });
    for (var c = 0; c < CATCH_TRIALS; c += 1) { trials.push(null); }
    return shuffle(trials);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#blink");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var rateSelect = $("#rate-select");
  var startPractice = $('[data-action="start-practice"]');
  var startBlock = $('[data-action="start-block"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');

  var streamItem = $("[data-stream-item]");
  var streamCaption = $("[data-stream-caption]");
  var trialStatus = $("[data-trial-status]");
  var answerForm = $("[data-answer-form]");
  var digitButtons = $("[data-digit-buttons]");
  var xGroup = $("[data-x-group]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var chartCaption = $("[data-chart-caption]");
  var lagChart = $("[data-lag-chart]");
  var lagTable = $("[data-lag-table]");
  var blinkReadout = $("[data-blink-readout]");
  var blinkText = $("[data-blink-text]");
  var blinkNote = $("[data-blink-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
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

  /* --- Digit keypad ----------------------------------------------------- */

  function renderDigits() {
    clear(digitButtons);
    DIGITS.forEach(function (digit) {
      var button = make("button", "button button--secondary", digit);
      button.type = "button";
      button.setAttribute("data-digit", digit);
      button.setAttribute("aria-label", "The digit was " + digit);
      button.addEventListener("click", function () { answerDigit(digit); });
      digitButtons.appendChild(button);
    });
  }

  /* --- Running a trial -------------------------------------------------- */

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.blockDone
        ? "Block complete. Reset to run another one."
        : state.practiceDone
          ? "Practice done. Start the scored block when you are ready."
          : "Not started. Practice first — it is slower and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial " : "Trial ") +
      (state.index + 1) + " of " + state.queue.length +
      ". Watch the middle of the box.";
  }

  function beginTrial() {
    var lag = state.queue[state.index];
    var itemMs = state.mode === "practice" ? PRACTICE_ITEM_MS : state.itemMs;
    state.stream = buildStream(lag, itemMs);
    state.frame = 0;
    state.answerDigit = null;
    answerForm.hidden = true;
    xGroup.hidden = true;
    taskFeedback.hidden = true;
    streamItem.textContent = "+";
    streamCaption.textContent = "Get ready.";
    updateTrialStatus();

    later(function () {
      showFrame();
    }, BLANK_BEFORE_MS);
  }

  function showFrame() {
    if (state.frame >= state.stream.items.length) {
      streamItem.textContent = "";
      later(askAnswers, BLANK_AFTER_MS);
      return;
    }
    streamItem.textContent = state.stream.items[state.frame];
    state.frame += 1;
    later(showFrame, state.stream.itemMs);
  }

  function askAnswers() {
    streamCaption.textContent = "Stream finished. Both questions wait as long as you need.";
    answerForm.hidden = false;
    xGroup.hidden = true;
    Array.prototype.forEach.call(digitButtons.querySelectorAll("button"),
      function (b) { b.disabled = false; });
    var first = digitButtons.querySelector("button");
    if (first) { first.focus(); }
    shell.announce("Stream finished. Which digit was in it?", { immediate: true });
  }

  function answerDigit(digit) {
    if (answerForm.hidden || state.answerDigit !== null) { return; }
    state.answerDigit = digit;
    Array.prototype.forEach.call(digitButtons.querySelectorAll("button"),
      function (b) { b.disabled = true; });
    xGroup.hidden = false;
    var yes = xGroup.querySelector('[data-x="yes"]');
    if (yes) { yes.focus(); }
    shell.announce("Digit recorded. Did the letter X appear?", { immediate: true });
  }

  function answerX(sawX) {
    if (xGroup.hidden) { return; }
    var stream = state.stream;
    var t1Correct = state.answerDigit === stream.digit;
    var xPresent = stream.t2Index !== null;
    var t2Correct = sawX === xPresent;

    answerForm.hidden = true;
    xGroup.hidden = true;

    if (state.mode === "practice") {
      showFeedback(taskFeedback,
        t1Correct && t2Correct ? "good" : "caution",
        t1Correct && t2Correct ? "Both right." : "Not quite.",
        "The digit was " + stream.digit + " and " +
        (xPresent
          ? "an X appeared " + stream.lag + " item" +
            (stream.lag === 1 ? "" : "s") + " after it."
          : "there was no X in that stream — some trials have none, so that " +
            "answering \"yes\" every time cannot work.") +
        " Practice tells you straight away; the scored block will not.");
    } else {
      state.results.push({
        lag: stream.lag,
        xPresent: xPresent,
        t1Correct: t1Correct,
        sawX: sawX,
        t2Correct: t2Correct
      });
    }

    state.index += 1;
    if (state.index >= state.queue.length) {
      finishRun();
    } else {
      later(beginTrial, state.mode === "practice" ? 1300 : 400);
      updateTrialStatus();
    }
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    state.mode = "idle";
    cancelPending();
    streamItem.textContent = "";
    startPractice.disabled = false;
    startBlock.disabled = false;
    stopButton.disabled = true;
    rateSelect.disabled = false;

    if (wasPractice) {
      state.practiceDone = true;
      streamCaption.textContent = "Practice finished.";
      showFeedback(taskFeedback, "good", "Practice finished.",
        "The scored block is 25 trials at your chosen rate, with no feedback " +
        "until it ends. Every trial still waits for both your answers.");
      startBlock.focus();
      shell.announce("Practice finished. The scored block is available.",
        { immediate: true });
    } else {
      state.blockDone = true;
      streamCaption.textContent = "Block finished. The lag function is below.";
      taskFeedback.hidden = true;
      showResults(summarise(state.results), { source: "own", itemMs: state.itemMs });
      shell.announce("Block finished. The lag function is below.",
        { immediate: true });
    }
    updateTrialStatus();
  }

  function stopBlock() {
    cancelPending();
    var collected = state.results.slice();
    state.mode = "idle";
    streamItem.textContent = "";
    answerForm.hidden = true;
    xGroup.hidden = true;
    startPractice.disabled = false;
    startBlock.disabled = false;
    stopButton.disabled = true;
    rateSelect.disabled = false;
    streamCaption.textContent = "Block stopped.";
    updateTrialStatus();
    if (collected.length) {
      showResults(summarise(collected), { source: "own", itemMs: state.itemMs, partial: true });
    }
    shell.announce("Block stopped." + (collected.length
      ? " The trials you completed are summarised below." : ""), { immediate: true });
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  function summarise(trials) {
    var byLag = {};
    LAGS.forEach(function (lag) {
      var all = trials.filter(function (t) { return t.lag === lag; });
      var t1ok = all.filter(function (t) { return t.t1Correct; });
      byLag[lag] = {
        lag: lag,
        n: all.length,
        t1: all.length ? t1ok.length / all.length : null,
        t2All: all.length
          ? all.filter(function (t) { return t.sawX; }).length / all.length : null,
        t2GivenT1: t1ok.length
          ? t1ok.filter(function (t) { return t.sawX; }).length / t1ok.length : null,
        nGivenT1: t1ok.length
      };
    });

    var catchTrials = trials.filter(function (t) { return t.lag === null; });
    return {
      total: trials.length,
      byLag: byLag,
      catchN: catchTrials.length,
      falseAlarm: catchTrials.length
        ? catchTrials.filter(function (t) { return t.sawX; }).length / catchTrials.length
        : null,
      t1Overall: trials.length
        ? trials.filter(function (t) { return t.t1Correct; }).length / trials.length
        : null
    };
  }

  function simulatedTrials() {
    var rand = mulberry32(SIM.seed);
    var trials = [];
    LAGS.forEach(function (lag) {
      for (var i = 0; i < SIM.perLag; i += 1) {
        var t1Correct = rand() < SIM.t1Accuracy;
        // Second-target detection is generated conditional on the first
        // target, which is the quantity the literature reports. On trials
        // where the first target was missed, detection is set a little higher
        // because attention was not engaged by it.
        var p = t1Correct ? SIM.t2GivenT1[lag] : Math.min(0.95, SIM.t2GivenT1[lag] + 0.15);
        var sawX = rand() < p;
        trials.push({
          lag: lag, xPresent: true, t1Correct: t1Correct,
          sawX: sawX, t2Correct: sawX
        });
      }
    });
    for (var c = 0; c < SIM.catchTrials; c += 1) {
      var ok = rand() < SIM.t1Accuracy;
      var falseAlarm = rand() < SIM.falseAlarm;
      trials.push({
        lag: null, xPresent: false, t1Correct: ok,
        sawX: falseAlarm, t2Correct: !falseAlarm
      });
    }
    return trials;
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function showResults(stats, meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "The lag function — worked example, simulated"
      : "The lag function — your block";
    renderResultsProse(stats, meta);
    renderChart(stats);
    renderLagTable(stats);
    renderReadout(stats, meta);
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";

    var trough = LAGS.reduce(function (best, lag) {
      var cell = stats.byLag[lag];
      if (cell.t2GivenT1 === null) { return best; }
      return (best === null || cell.t2GivenT1 < stats.byLag[best].t2GivenT1) ? lag : best;
    }, null);

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Simulated data, seed " + SIM.seed + ": " + SIM.perLag +
        " trials per lag plus " + SIM.catchTrials + " catch trials."
      : (meta.partial ? "A partial block. " : "") + "Your block: " +
        stats.total + " trials at about " + meta.itemMs + " ms per item."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "Simulated from a fixed seed. Lag-1 sparing is built into the " +
        "generator, not discovered here."));
    } else {
      resultsBody.appendChild(make("p", null,
        "Four trials per lag. One trial moves a point by 25 percentage " +
        "points, so read the shape as suggestive and compare it with the " +
        "worked example."));
    }

    if (trough !== null) {
      resultsBody.appendChild(make("p", null,
        "The lowest point of your curve is at lag " + trough + " — about " +
        (trough * (simulated ? 100 : meta.itemMs)) + " ms after the digit — at " +
        pct(stats.byLag[trough].t2GivenT1) + ". Compare that with lag 8, at " +
        pct(stats.byLag[8].t2GivenT1) + "."));
    }

    if (stats.falseAlarm !== null) {
      resultsBody.appendChild(make("p", null,
        "On the " + stats.catchN + " catch trials with no X in them at all, " +
        "you said \"yes\" " + pct(stats.falseAlarm) + " of the time. That is " +
        "the check on simply guessing yes: a high figure here would make the " +
        "whole lag function uninterpretable."));
    }
  }

  function renderChart(stats) {
    var W = 440, H = 280;
    var PAD_L = 56, PAD_R = 22, PAD_T = 18, PAD_B = 52;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    clear(lagChart);

    var xAt = function (lag) {
      return PAD_L + ((lag - LAGS[0]) / (LAGS[LAGS.length - 1] - LAGS[0])) * plotW;
    };
    var yAt = function (p) { return PAD_T + (1 - p) * plotH; };

    [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
      svgNode("line", {
        x1: PAD_L, y1: yAt(p).toFixed(1), x2: W - PAD_R, y2: yAt(p).toFixed(1),
        class: "chart__grid"
      }, lagChart);
      svgNode("text", {
        x: PAD_L - 8, y: (yAt(p) + 4).toFixed(1), "text-anchor": "end",
        class: "chart__axis"
      }, lagChart).textContent = Math.round(p * 100) + "%";
    });

    LAGS.forEach(function (lag) {
      svgNode("text", {
        x: xAt(lag).toFixed(1), y: H - 30, "text-anchor": "middle",
        class: "chart__axis"
      }, lagChart).textContent = String(lag);
    });
    svgNode("text", {
      x: (PAD_L + plotW / 2).toFixed(1), y: H - 10, "text-anchor": "middle",
      class: "chart__axis"
    }, lagChart).textContent = "Lag (items after the digit)";
    svgNode("text", {
      x: 14, y: (PAD_T + plotH / 2).toFixed(1), "text-anchor": "middle",
      class: "chart__axis",
      transform: "rotate(-90 14 " + (PAD_T + plotH / 2).toFixed(1) + ")"
    }, lagChart).textContent = "Accuracy";

    [["t2", "t2GivenT1", "X seen, digit correct"],
     ["t1", "t1", "digit correct"]].forEach(function (series) {
      var points = LAGS.filter(function (lag) {
        return stats.byLag[lag][series[1]] !== null;
      }).map(function (lag) {
        return { x: xAt(lag), y: yAt(stats.byLag[lag][series[1]]) };
      });
      if (!points.length) { return; }
      if (points.length > 1) {
        svgNode("path", {
          d: points.map(function (p, i) {
            return (i === 0 ? "M " : "L ") + p.x.toFixed(1) + " " + p.y.toFixed(1);
          }).join(" "),
          class: "blink__line--" + series[0]
        }, lagChart);
      }
      points.forEach(function (p) {
        if (series[0] === "t2") {
          svgNode("circle", {
            cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 5,
            class: "blink__point--t2"
          }, lagChart);
        } else {
          svgNode("rect", {
            x: (p.x - 5).toFixed(1), y: (p.y - 5).toFixed(1),
            width: 10, height: 10, class: "blink__point--t1"
          }, lagChart);
        }
      });
      var last = points[points.length - 1];
      svgNode("text", {
        x: (last.x - 6).toFixed(1),
        y: (last.y + (series[0] === "t2" ? 20 : -12)).toFixed(1),
        "text-anchor": "end", class: "chart__label"
      }, lagChart).textContent = series[2];
    });
  }

  function renderLagTable(stats) {
    clear(lagTable);
    LAGS.forEach(function (lag) {
      var cell = stats.byLag[lag];
      var row = make("tr");
      var head = make("th", null, String(lag));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, "about " + lag * 100 + " ms"));
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, pct(cell.t1)));
      row.appendChild(make("td", null, pct(cell.t2All)));
      row.appendChild(make("td", null,
        cell.t2GivenT1 === null ? "—"
          : pct(cell.t2GivenT1) + " (" + cell.nGivenT1 + " trials)"));
      lagTable.appendChild(row);
    });
  }

  function renderReadout(stats, meta) {
    var lag3 = stats.byLag[3].t2GivenT1;
    var lag8 = stats.byLag[8].t2GivenT1;
    var lag1 = stats.byLag[1].t2GivenT1;
    var lag2 = stats.byLag[2].t2GivenT1;

    clear(blinkReadout);
    [
      ["Blink depth (lag 8 − lag 3)",
        lag3 === null || lag8 === null ? "—" : Math.round((lag8 - lag3) * 100) + " pts"],
      ["Lag 1 minus lag 2",
        lag1 === null || lag2 === null ? "—" : Math.round((lag1 - lag2) * 100) + " pts"],
      ["Digit reported correctly", pct(stats.t1Overall)],
      ["False alarms on catch trials", pct(stats.falseAlarm)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      blinkReadout.appendChild(cell);
    });

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated data (seed " + SIM.seed + "): "
      : "Your block: ") +
      "second-target accuracy given the first target was correct, with " +
      "first-target accuracy shown separately";

    var sentences = [];
    if (lag3 !== null && lag8 !== null) {
      var depth = (lag8 - lag3) * 100;
      sentences.push(depth > 15
        ? "There is a dip: the X was reported " + Math.round(depth) +
          " percentage points less often at lag 3 than at lag 8, from the same " +
          "stream at the same rate."
        : depth > 0
          ? "There is a dip in the right direction, " + Math.round(depth) +
            " percentage points deep, which is small enough that this many " +
            "trials cannot tell it from noise."
          : "Your curve does not dip. With four trials per lag that happens " +
            "often; the worked example shows the shape the design is capable " +
            "of producing.");
    }
    if (lag1 !== null && lag2 !== null) {
      sentences.push(lag1 > lag2
        ? "Lag 1 sits above lag 2, which is the pattern called lag-1 sparing: " +
          "an X arriving in the very next position often escapes the cost " +
          "altogether."
        : "Lag 1 does not sit above lag 2 here. Lag-1 sparing is a robust " +
          "finding in the literature, but four trials cannot show it.");
    }
    sentences.push(
      "Notice how much the last two columns of the table differ. Conditioning " +
      "on the first target being correct is a choice about which trials count, " +
      "and it changes every number in the curve.");
    blinkText.textContent = sentences.join(" ");

    blinkNote.textContent = meta.source === "simulated"
      ? "Simulated values from a documented generator with a fixed seed, in " +
        "which lag-1 sparing is built in. Not a norm, not a published effect " +
        "size and not anybody's data."
      : "Your own trials, in a browser tab, at a requested item duration the " +
        "browser cannot guarantee. Four trials per lag is far too few for an " +
        "estimate, and nothing here measures anything about you.";
  }

  /* =======================================================================
     Buttons
     ===================================================================== */

  Array.prototype.forEach.call(xGroup.querySelectorAll("[data-x]"),
    function (button) {
      button.addEventListener("click", function () {
        answerX(button.getAttribute("data-x") === "yes");
      });
    });

  startPractice.addEventListener("click", function () {
    cancelPending();
    state.mode = "practice";
    state.index = 0;
    state.queue = shuffle([1, 3, 8, null]).slice(0, PRACTICE_TRIALS);
    startPractice.disabled = true;
    startBlock.disabled = true;
    rateSelect.disabled = true;
    stopButton.disabled = false;
    beginTrial();
    shell.announce("Practice started: four slower trials with feedback.",
      { immediate: true });
  });

  startBlock.addEventListener("click", function () {
    cancelPending();
    state.mode = "block";
    state.index = 0;
    state.results = [];
    state.queue = buildBlock();
    state.itemMs = Number(rateSelect.value);
    state.blockDone = false;
    resultsSection.hidden = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    rateSelect.disabled = true;
    stopButton.disabled = false;
    beginTrial();
    shell.announce("Block started: " + state.queue.length +
      " trials, no feedback until the end.", { immediate: true });
  });

  stopButton.addEventListener("click", function () {
    if (state.mode === "practice") {
      cancelPending();
      state.mode = "idle";
      streamItem.textContent = "";
      answerForm.hidden = true;
      xGroup.hidden = true;
      startPractice.disabled = false;
      startBlock.disabled = false;
      stopButton.disabled = true;
      rateSelect.disabled = false;
      streamCaption.textContent = "Practice stopped.";
      updateTrialStatus();
      shell.announce("Practice stopped.", { immediate: true });
      return;
    }
    stopBlock();
  });

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    streamItem.textContent = "";
    answerForm.hidden = true;
    xGroup.hidden = true;
    streamCaption.textContent =
      "Worked example loaded below. The experiment is still available.";
    showResults(summarise(simulatedTrials()), { source: "simulated" });
    updateTrialStatus();
    shell.announce("Worked example loaded: simulated data with a fixed seed.",
      { immediate: true });
  });

  rateSelect.addEventListener("change", function () {
    state.itemMs = Number(rateSelect.value);
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    dip: {
      tone: "good", verdict: "That is the classic lag function.",
      text: "A dip that is deepest two or three items after the first target, " +
        "with lag 1 often spared. The shape is the finding — a general " +
        "\"two things are harder than one\" account predicts no particular shape."
    },
    "worst-early": {
      tone: "caution", verdict: "Close, and the exception is the interesting bit.",
      text: "The cost really does shrink as the gap grows. But the very " +
        "shortest lag is often as good as the longest, which is what makes " +
        "lag-1 sparing awkward for any account in which the first target " +
        "simply blocks a channel."
    },
    flat: {
      tone: "caution", verdict: "It is not flat.",
      text: "Reporting the first target costs the second one, and the cost has " +
        "a definite time course. Run a block, or load the worked example, and " +
        "look at the shape."
    },
    "worst-late": {
      tone: "caution", verdict: "The other way round.",
      text: "By lag 8 — about eight hundred milliseconds later — performance " +
        "has recovered. It is the short and middle lags that suffer."
    }
  };

  function unlockExperiment(message) {
    startPractice.disabled = false;
    startBlock.disabled = false;
    rateSelect.disabled = false;
    streamCaption.textContent = "Ready. Practice first if this is new to you.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four patterns before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockExperiment("Experiment unlocked. Practice is slower and gives feedback.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The experiment is unlocked. Loading the worked example first is the " +
      "quickest way to show a room the shape they are looking for.");
    lockForm(openingForm);
    unlockExperiment("Prediction skipped. Experiment unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_CLAIMS = [
    {
      id: "shape",
      text: "Second-target accuracy dips a few items after the first target and recovers by lag 8.",
      answer: "supported",
      why: "A description of the lag function, and the least committal thing " +
        "you can say about it."
    },
    {
      id: "consolidation",
      text: "The dip happens because the first target occupies a limited consolidation process.",
      answer: "beyond",
      why: "A two-stage account, and a good one — but attentional-control " +
        "accounts, loss-of-control accounts and task-switching accounts all " +
        "predict the same dip. The lag function does not choose between them."
    },
    {
      id: "sparing",
      text: "The absence of a cost at lag 1 is hard for any account in which the first target simply blocks processing for a fixed period.",
      answer: "supported",
      why: "An argument about what the shape constrains rather than a claim " +
        "about a mechanism — and the shape does constrain it. The support " +
        "comes from the published finding, not from this page's data."
    },
    {
      id: "capacity",
      text: "People who show a smaller blink have more attentional capacity.",
      answer: "beyond",
      why: "Two separate problems. The blink measured here has no established " +
        "reliability at this number of trials, and interpreting an individual " +
        "difference in it as \"capacity\" adds a construct the design never " +
        "measured."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["supported", "Supported by data like these"],
    ["beyond", "Goes beyond what these data can show"]
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
        "Answer at least one. Ask each time whether the claim describes the " +
        "curve or explains it.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_CLAIMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_CLAIMS.length + " correct" +
      (answered < CHALLENGE_CLAIMS.length
        ? " (" + (CHALLENGE_CLAIMS.length - answered) + " left blank)." : "."),
      "The lag function is compatible with every serious account of the blink. " +
      "That is why it has been argued about for thirty years.");

    var list = make("ul");
    CHALLENGE_CLAIMS.forEach(function (claim) {
      var item = make("li");
      item.appendChild(make("strong", null, "“" + claim.text + "” "));
      item.appendChild(document.createTextNode(claim.why));
      list.appendChild(item);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_CLAIMS.length + " correct.", { immediate: true });
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
      stream: null,
      frame: 0,
      answerDigit: null,
      itemMs: 100,
      practiceDone: false,
      blockDone: false
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    answerForm.hidden = true;
    xGroup.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "The lag function";
    challengeFeedback.hidden = true;

    rateSelect.value = "100";
    rateSelect.disabled = true;
    startPractice.disabled = true;
    startBlock.disabled = true;
    stopButton.disabled = true;

    streamItem.textContent = "";
    streamCaption.textContent =
      "Answer the question above to unlock the experiment.";

    renderDigits();
    renderChallenge();
    updateTrialStatus();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    shell.prefersReducedMotion()
      ? "Ready. Your system asks for reduced motion, and this task presents " +
        "text rapidly. The worked example reaches every conclusion on this " +
        "page without running a stream."
      : "Ready. Every trial waits for your answers, the block can be stopped " +
        "between trials, and the worked example needs no stream at all.",
    { immediate: true });
})();
