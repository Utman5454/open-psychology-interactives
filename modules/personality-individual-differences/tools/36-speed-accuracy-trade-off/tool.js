/* =========================================================================
   Speed–Accuracy Trade-Off
   -------------------------------------------------------------------------
   A rapid discrimination task the student actually performs, followed by
   three fictional strategies and a caution slider that reproduces the same
   trade-off from the other direction. Speed and accuracy are plotted jointly
   throughout, because plotting either alone is the error being taught.

   THE TASK
   --------
   A row of arrows appears; the student judges whether MOST of them point left
   or right. Difficulty is the proportion pointing the majority way — 0.85 is
   easy, 0.55 is hard. Responses are the left and right arrow keys, or two
   large on-screen buttons, so the task is fully operable by keyboard, by
   pointer and by touch with no time pressure imposed by the interface itself.

   Accessibility is designed in rather than bolted on:
     * a PRACTICE MODE with no timing and immediate feedback runs first;
     * the key mapping is stated on screen before any block begins;
     * nothing flashes; stimuli persist until answered;
     * a NON-TIMED ROUTE — the fictional-strategy simulator and the caution
       slider — reaches the same conclusions for anyone who cannot or does not
       wish to do a speeded task at all. The debrief does not depend on having
       performed it.

   THE MODEL BEHIND THE FICTIONAL STRATEGIES
   -----------------------------------------
   Evidence accumulates towards a threshold. With drift rate v, threshold a
   and non-decision time t0:

       expected accuracy      = 1 / (1 + exp(-2·v·a))
       expected decision time = (a / v) · tanh(v · a)
       expected RT            = t0 + decision time

   This is the standard closed form for a simple diffusion process with
   unbiased starting point. Raising the threshold raises accuracy AND raises
   reaction time — one dial, two outcomes moving together, which is exactly
   what makes a single outcome measure uninterpretable.

   The three fictional respondents differ ONLY in threshold. They share a
   drift rate, so they are equally able; the differences in their scores are
   entirely strategic. A fourth respondent is provided with a lower drift rate
   and a middling threshold, so that a genuine ability difference can be
   compared against a purely strategic one.

   WHAT THIS DOES NOT MEASURE
   --------------------------
   Not intelligence, not impulsivity, not inhibition, not attention, and
   nothing clinical. A few dozen trials on a web page in unknown conditions
   estimate a person's response caution on this task at this moment and
   nothing more. The page says so before the task starts and again afterwards.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var ARROWS = 9;
  var PRACTICE_TRIALS = 4;
  var BLOCK_TRIALS = 16;

  /* Responses faster than this cannot be reactions to the stimulus — nobody
     perceives nine arrows, decides and moves a finger in under 150 ms. Real
     reaction-time work excludes them as anticipations, and so does this tool:
     they are counted, reported and kept out of the central tendency rather
     than silently averaged in. Doing it this way also makes the tool robust
     to responses arriving before the browser has painted, which is what an
     automated click produces. */
  var ANTICIPATION_MS = 150;

  /* Fictional respondents. The first three share a drift rate — equally able,
     differently cautious. The fourth differs in drift rate instead. */
  var STRATEGIES = [
    {
      id: "impulsive", name: "Impulsive", drift: 1.5, threshold: 0.55, t0: 260,
      note: "Answers as soon as anything tips the balance. Fast, and wrong more often."
    },
    {
      id: "balanced", name: "Balanced", drift: 1.5, threshold: 1.05, t0: 260,
      note: "The same ability, waiting for more evidence before committing."
    },
    {
      id: "cautious", name: "Cautious", drift: 1.5, threshold: 1.75, t0: 260,
      note: "The same ability again. Accurate, and noticeably slower."
    },
    {
      id: "slower", name: "Lower drift rate", drift: 0.85, threshold: 1.05, t0: 260,
      note: "A genuine difference in how fast evidence accumulates — not a strategy."
    }
  ];

  /* =======================================================================
     The diffusion closed form
     ===================================================================== */

  function expectedAccuracy(drift, threshold) {
    return 1 / (1 + Math.exp(-2 * drift * threshold));
  }

  function expectedRt(drift, threshold, t0) {
    if (drift <= 1e-6) { return t0 + threshold * threshold * 1000; }
    var decision = (threshold / drift) * Math.tanh(drift * threshold);
    return t0 + decision * 1000;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(v, p) {
    return v === null || v === undefined || isNaN(v) ? "—" : v.toFixed(p === undefined ? 0 : p);
  }

  function pct(v) { return Math.round(v * 100) + "%"; }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  function mean(v) {
    return v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : 0;
  }

  function median(v) {
    if (!v.length) { return 0; }
    var s = v.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }

  function sd(v) {
    if (v.length < 2) { return 0; }
    var m = mean(v);
    return Math.sqrt(v.reduce(function (t, x) { return t + (x - m) * (x - m); }, 0) / v.length);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#sat");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var stimulus = $("[data-stimulus]");
  var trialStatus = $("[data-trial-status]");
  var taskFeedback = $("[data-task-feedback]");
  var leftButton = $('[data-response="left"]');
  var rightButton = $('[data-response="right"]');
  var startPractice = $('[data-action="start-practice"]');
  var startBlock = $('[data-action="start-block"]');
  var difficultySelect = $("#difficulty-select");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var yourPoint = $("[data-your-point]");

  var strategyChart = $("[data-strategy-chart]");
  var strategyTable = $("[data-strategy-table]");
  var cautionRange = $("#caution-range");
  var cautionReadout = $("[data-caution-readout]");
  var cautionNote = $("[data-caution-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var INITIAL = {
    mode: "idle",          // idle | practice | block
    trial: 0,
    correctSide: null,
    shownAt: 0,
    difficulty: 0.7,
    caution: 105,
    results: [],           // {correct, rt}
    completed: false
  };
  var state = null;
  var rangeSyncs = [];

  function bindRange(input, options) {
    var settings = options || {};
    var output = page.querySelector('output[for="' + input.id + '"]');
    function sync() {
      var value = Number(input.value);
      if (output) {
        output.textContent = settings.format ? settings.format(value) : String(value);
      }
      input.setAttribute("aria-valuetext",
        (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() { rangeSyncs.forEach(function (s) { s(); }); }

  /* --- The task -------------------------------------------------------------
     No time limit is imposed by the interface. The stimulus stays until the
     student answers, and reaction time is simply recorded. Nothing flashes. */

  function totalTrials() {
    return state.mode === "practice" ? PRACTICE_TRIALS : BLOCK_TRIALS;
  }

  function beginTrial() {
    state.correctSide = Math.random() < 0.5 ? "left" : "right";
    var majority = Math.round(ARROWS * state.difficulty);

    var sides = [];
    for (var i = 0; i < ARROWS; i += 1) {
      sides.push(i < majority ? state.correctSide
        : (state.correctSide === "left" ? "right" : "left"));
    }
    // Shuffle so position carries no information.
    for (var j = sides.length - 1; j > 0; j -= 1) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = sides[j]; sides[j] = sides[k]; sides[k] = tmp;
    }

    clear(stimulus);
    var row = make("div", "arrows");
    sides.forEach(function (side) {
      var arrow = make("span", "arrow arrow--" + side, side === "left" ? "◀" : "▶");
      arrow.setAttribute("aria-hidden", "true");
      row.appendChild(arrow);
    });
    stimulus.appendChild(row);

    // The text equivalent: a screen-reader user gets the counts, which is the
    // same information the display carries, without needing to perceive nine
    // small glyphs.
    var leftCount = sides.filter(function (s) { return s === "left"; }).length;
    stimulus.appendChild(
      make("p", "arrows__text",
        leftCount + " arrows point left and " + (ARROWS - leftCount) +
        " point right. Which way do most of them point?"));

    state.shownAt = (page.defaultView.performance || Date).now();
    setResponseEnabled(true);
    updateTrialStatus();
  }

  function respond(side) {
    if (state.mode === "idle" || !state.correctSide) { return; }
    var now = (page.defaultView.performance || Date).now();
    var rt = now - state.shownAt;
    var correct = side === state.correctSide;

    setResponseEnabled(false);

    if (state.mode === "practice") {
      showTaskFeedback(
        correct ? "good" : "caution",
        correct ? "Correct." : "Not that one.",
        "Most of them pointed " + state.correctSide + ". In practice you are " +
        "told immediately; in the block that follows you will not be, and " +
        "nothing is timed out — take as long as you want on any trial.");
    } else {
      state.results.push({ correct: correct, rt: rt });
    }

    state.trial += 1;
    state.correctSide = null;

    if (state.trial >= totalTrials()) {
      finishRun();
    } else {
      page.defaultView.setTimeout(beginTrial, state.mode === "practice" ? 900 : 350);
      updateTrialStatus();
    }
  }

  function finishRun() {
    var wasPractice = state.mode === "practice";
    state.mode = "idle";
    setResponseEnabled(false);
    clear(stimulus);
    stimulus.appendChild(
      make("p", "arrows__text",
        wasPractice ? "Practice finished." : "Block finished."));

    if (wasPractice) {
      showTaskFeedback("good", "Practice finished.",
        "The real block is 16 trials with no feedback until the end. There is " +
        "still no time limit on any trial.");
      startBlock.disabled = false;
      startBlock.focus();
      shell.announce("Practice finished. The scored block is now available.",
        { immediate: true });
    } else {
      state.completed = true;
      buildResults();
      resultsSection.hidden = false;
      renderStrategies();
      $("#results-heading").focus();
      shell.announce("Block finished. Your results are below.", { immediate: true });
    }
    updateTrialStatus();
  }

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.completed
        ? "Block complete. Run it again from Reset if you want a second go."
        : "Not started. Practice first — it is untimed and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial " : "Trial ") +
      (state.trial + 1) + " of " + totalTrials() +
      ". Press the Left or Right arrow key, or use the buttons.";
  }

  function setResponseEnabled(enabled) {
    leftButton.disabled = !enabled;
    rightButton.disabled = !enabled;
  }

  function showTaskFeedback(tone, verdict, text) {
    clear(taskFeedback);
    taskFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(page.createTextNode(" " + text)); }
    taskFeedback.appendChild(p);
    taskFeedback.hidden = false;
  }

  leftButton.addEventListener("click", function () { respond("left"); });
  rightButton.addEventListener("click", function () { respond("right"); });

  /* Arrow keys, scoped to the interactive so the page stays scrollable
     elsewhere. Only intercepted while a trial is actually awaiting a
     response. */
  page.addEventListener("keydown", function (event) {
    if (state.mode === "idle" || !state.correctSide) { return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); respond("left"); }
    if (event.key === "ArrowRight") { event.preventDefault(); respond("right"); }
  });

  startPractice.addEventListener("click", function () {
    state.mode = "practice";
    state.trial = 0;
    taskFeedback.hidden = true;
    startPractice.disabled = true;
    beginTrial();
    shell.announce(
      "Practice started. Four untimed trials with feedback.", { immediate: true });
  });

  startBlock.addEventListener("click", function () {
    state.mode = "block";
    state.trial = 0;
    state.results = [];
    taskFeedback.hidden = true;
    startBlock.disabled = true;
    resultsSection.hidden = true;
    beginTrial();
    shell.announce(
      "Block started. Sixteen trials, no feedback until the end, no time limit.",
      { immediate: true });
  });

  difficultySelect.addEventListener("change", function () {
    state.difficulty = Number(difficultySelect.value);
  });

  /* --- Results ---------------------------------------------------------------- */

  function buildResults() {
    // Anticipations are separated before anything is averaged. This is the
    // first cleaning decision every reaction-time analysis makes, and making
    // it visible is part of the point.
    var anticipations = state.results.filter(function (r) {
      return r.rt < ANTICIPATION_MS;
    });
    var scored = state.results.filter(function (r) {
      return r.rt >= ANTICIPATION_MS;
    });

    var correct = scored.filter(function (r) { return r.correct; });
    var accuracy = scored.length ? correct.length / scored.length : 0;
    var allRts = scored.map(function (r) { return r.rt; });
    var correctRts = correct.map(function (r) { return r.rt; });

    // The cleaning demonstration: the same data with and without a common
    // exclusion rule.
    var lower = 200, upper = 4000;
    var kept = scored.filter(function (r) { return r.rt >= lower && r.rt <= upper; });
    var keptRts = kept.map(function (r) { return r.rt; });
    var removed = scored.length - kept.length;

    clear(resultsBody);

    if (!scored.length) {
      resultsBody.appendChild(
        make("p", "reveal__lead",
          "Every one of your " + state.results.length + " responses arrived in " +
          "under " + ANTICIPATION_MS + " ms, which is faster than anyone can " +
          "perceive nine arrows and decide."));
      resultsBody.appendChild(
        make("p", null,
          "Those are anticipations rather than reactions, so there is nothing " +
          "here to average. A response is not a datum simply because it was " +
          "recorded. Run the block again, or use the strategy simulator " +
          "below."));
      yourPoint.hidden = true;
      return;
    }

    resultsBody.appendChild(
      make("p", "reveal__lead",
        "You were " + pct(accuracy) + " correct, with a median reaction time of " +
        fmt(median(allRts)) + " ms."));

    if (anticipations.length) {
      resultsBody.appendChild(
        make("p", null,
          anticipations.length + " of your " + state.results.length +
          " responses arrived in under " + ANTICIPATION_MS + " ms. Nobody " +
          "perceives nine arrows and decides that quickly, so those are " +
          "anticipations rather than reactions and have been set aside before " +
          "anything was averaged. Deciding what counts as a response at all is " +
          "the first cleaning decision."));
    }

    resultsBody.appendChild(
      make("p", null,
        "Neither number means anything on its own. Somebody who answered " +
        "faster than you may have been less accurate; somebody slower may have " +
        "been more accurate; and both could have exactly your ability on this " +
        "task. The plot below shows the two together."));

    var figures = make("ul", "reveal__figures");
    [
      ["Accuracy", pct(accuracy)],
      ["Median RT", fmt(median(allRts)) + " ms"],
      ["Mean RT", fmt(mean(allRts)) + " ms"],
      ["RT spread", fmt(sd(allRts)) + " ms"],
      ["Median RT, correct only", fmt(median(correctRts)) + " ms"]
    ].forEach(function (pair) {
      var item = make("li");
      item.appendChild(make("span", "reveal__figure-label", pair[0]));
      item.appendChild(make("span", "reveal__figure-value", pair[1]));
      figures.appendChild(item);
    });
    resultsBody.appendChild(figures);

    resultsBody.appendChild(
      make("p", null,
        "Notice that the mean and the median differ by " +
        fmt(Math.abs(mean(allRts) - median(allRts))) + " ms. Reaction-time " +
        "distributions have a long right tail — a few slow trials drag the " +
        "mean and leave the median alone — which is why medians, or a model " +
        "fitted to the whole distribution, are usually preferred."));

    resultsBody.appendChild(
      make("p", null,
        removed === 0
          ? "A common cleaning rule removes trials under 200 ms or over 4000 ms. " +
            "None of your trials met either condition, so the rule changed " +
            "nothing here. On a real dataset it usually removes a few per cent, " +
            "and the choice of cut-offs is a researcher decision that is rarely " +
            "pre-registered and can move a result."
          : "A common cleaning rule removing trials under 200 ms or over 4000 ms " +
            "would drop a further " + removed + " of your " + scored.length +
            " scored trials, moving the median from " + fmt(median(allRts)) +
            " to " + fmt(median(keptRts)) + " ms. That cut-off was a decision, " +
            "not a measurement, and it changed the answer."));

    resultsBody.appendChild(
      make("p", "verdict__note",
        "This is a handful of trials in a browser, in unknown conditions, on " +
        "unknown hardware. It estimates your response caution on this task at " +
        "this moment, and nothing more stable than that."));

    yourPoint.textContent =
      "Your block: " + pct(accuracy) + " correct, median " +
      fmt(median(allRts)) + " ms.";
    yourPoint.hidden = false;
  }

  /* --- Strategy simulator (the non-timed route) --------------------------------
     Everything the task teaches is reachable here without performing it. */

  bindRange(cautionRange, {
    format: function (v) { return (v / 100).toFixed(2); },
    describe: function (v) {
      var t = v / 100;
      return t < 0.7 ? "low caution, answers early, threshold " + t.toFixed(2)
        : t > 1.4 ? "high caution, waits for more evidence, threshold " + t.toFixed(2)
        : "moderate caution, threshold " + t.toFixed(2);
    },
    onInput: function (v) { state.caution = v; renderStrategies(); }
  });

  function renderStrategies() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 460, H = 280, PAD_L = 52, PAD_R = 16, PAD_T = 16, PAD_B = 44;
    var plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;
    var rtMin = 300, rtMax = 1500;

    var xAt = function (rt) {
      return PAD_L + ((Math.min(Math.max(rt, rtMin), rtMax) - rtMin) / (rtMax - rtMin)) * plotW;
    };
    var yAt = function (acc) { return PAD_T + (1 - (acc - 0.4) / 0.6) * plotH; };

    clear(strategyChart);
    strategyChart.setAttribute("viewBox", "0 0 " + W + " " + H);

    [0.5, 0.6, 0.7, 0.8, 0.9, 1.0].forEach(function (acc) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(PAD_L)); line.setAttribute("y1", String(yAt(acc)));
      line.setAttribute("x2", String(W - PAD_R)); line.setAttribute("y2", String(yAt(acc)));
      line.setAttribute("class", "chart__grid");
      strategyChart.appendChild(line);
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(PAD_L - 6)); label.setAttribute("y", String(yAt(acc) + 4));
      label.setAttribute("text-anchor", "end"); label.setAttribute("class", "chart__axis");
      label.textContent = pct(acc);
      strategyChart.appendChild(label);
    });

    [400, 700, 1000, 1300].forEach(function (rt) {
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(xAt(rt))); label.setAttribute("y", String(H - 24));
      label.setAttribute("text-anchor", "middle"); label.setAttribute("class", "chart__axis");
      label.textContent = rt + " ms";
      strategyChart.appendChild(label);
    });

    var axis = document.createElementNS(NS, "text");
    axis.setAttribute("x", String(PAD_L + plotW / 2)); axis.setAttribute("y", String(H - 6));
    axis.setAttribute("text-anchor", "middle"); axis.setAttribute("class", "chart__axis");
    axis.textContent = "slower →  (accuracy up the side)";
    strategyChart.appendChild(axis);

    // The trade-off curve traced by varying threshold at the shared drift rate.
    var curve = [];
    for (var t = 0.3; t <= 2.2; t += 0.05) {
      curve.push([expectedRt(1.5, t, 260), expectedAccuracy(1.5, t)]);
    }
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", curve.map(function (p, i) {
      return (i === 0 ? "M " : "L ") + xAt(p[0]).toFixed(1) + " " + yAt(p[1]).toFixed(1);
    }).join(" "));
    path.setAttribute("class", "sat__curve");
    strategyChart.appendChild(path);

    STRATEGIES.forEach(function (strategy, index) {
      var acc = expectedAccuracy(strategy.drift, strategy.threshold);
      var rt = expectedRt(strategy.drift, strategy.threshold, strategy.t0);
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(xAt(rt)));
      dot.setAttribute("cy", String(yAt(acc)));
      dot.setAttribute("r", "6");
      dot.setAttribute("class", "sat__point sat__point--" + (index === 3 ? "other" : "same"));
      strategyChart.appendChild(dot);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(xAt(rt)));
      label.setAttribute("y", String(yAt(acc) - 11));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "chart__label");
      label.textContent = strategy.name;
      strategyChart.appendChild(label);
    });

    // The student's own threshold setting.
    var yourThreshold = state.caution / 100;
    var yourAcc = expectedAccuracy(1.5, yourThreshold);
    var yourRt = expectedRt(1.5, yourThreshold, 260);
    var marker = document.createElementNS(NS, "circle");
    marker.setAttribute("cx", String(xAt(yourRt)));
    marker.setAttribute("cy", String(yAt(yourAcc)));
    marker.setAttribute("r", "8");
    marker.setAttribute("class", "sat__marker");
    strategyChart.appendChild(marker);

    clear(cautionReadout);
    [
      ["Threshold", (yourThreshold).toFixed(2)],
      ["Expected accuracy", pct(yourAcc)],
      ["Expected reaction time", fmt(yourRt) + " ms"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      cautionReadout.appendChild(cell);
    });

    cautionNote.textContent =
      "One dial moved two outcomes. Raising caution raised accuracy from " +
      pct(expectedAccuracy(1.5, 0.3)) + " to " + pct(expectedAccuracy(1.5, 2.2)) +
      " across its range and raised reaction time by " +
      fmt(expectedRt(1.5, 2.2, 260) - expectedRt(1.5, 0.3, 260)) +
      " ms. Nothing about ability changed at any point — the drift rate was " +
      "constant throughout.";

    clear(strategyTable);
    STRATEGIES.forEach(function (strategy) {
      var acc = expectedAccuracy(strategy.drift, strategy.threshold);
      var rt = expectedRt(strategy.drift, strategy.threshold, strategy.t0);
      var row = make("tr");
      var th = make("th", null, strategy.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, strategy.drift.toFixed(2)));
      row.appendChild(make("td", null, strategy.threshold.toFixed(2)));
      row.appendChild(make("td", null, pct(acc)));
      row.appendChild(make("td", null, fmt(rt) + " ms"));
      strategyTable.appendChild(row);
    });
  }

  /* --- Opening prediction --------------------------------------------------- */

  var OPENING = {
    faster: {
      tone: "caution",
      verdict: "Not on this evidence.",
      text:
        "Faster with the same accuracy could mean a better ability to " +
        "discriminate, or the same ability with a lower threshold for " +
        "committing — and those predict different things everywhere else. One " +
        "number cannot separate them."
    },
    both: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Speed and accuracy have to be read together, because a person can " +
        "move along the trade-off at will. Reporting either alone lets a pure " +
        "strategy difference masquerade as an ability difference."
    },
    accuracy: {
      tone: "caution",
      verdict: "Not sufficient either.",
      text:
        "Accuracy alone has the same problem in reverse: someone can buy " +
        "accuracy simply by slowing down. If you score only accuracy, the " +
        "most cautious respondent wins regardless of ability."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    startPractice.disabled = false;
    renderStrategies();
    shell.announce(
      "Task unlocked. Practice is untimed and gives feedback.", { immediate: true });
  });

  /* --- Challenge -------------------------------------------------------------- */

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "cannot";
    showFeedback(
      challengeFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "Look at the table: Impulsive, Balanced and Cautious have identical " +
        "drift rates — they are equally able — and produce accuracies from " +
        pct(expectedAccuracy(1.5, 0.55)) + " to " + pct(expectedAccuracy(1.5, 1.75)) +
        ". \"Lower drift rate\" has a genuinely lower ability and sits at a " +
        "middling accuracy. An accuracy score alone cannot separate a cautious " +
        "person from an able one; a speed score alone cannot separate an " +
        "impulsive person from a fast one."
    );
    shell.announce("Challenge answered.", { immediate: true });
  });

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(page.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = false; });
    form.reset();
  }

  /* --- Reset ------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    resultsSection.hidden = true;
    yourPoint.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;

    startPractice.disabled = true;
    startBlock.disabled = true;
    setResponseEnabled(false);
    difficultySelect.value = String(state.difficulty);
    cautionRange.value = String(state.caution);

    clear(stimulus);
    stimulus.appendChild(
      make("p", "arrows__text",
        "Answer the question above to unlock the task."));
    updateTrialStatus();
    syncRanges();
    renderStrategies();
  });

  /* --- Start-up ----------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. The task is untimed on every trial, and the strategy simulator " +
      "below reaches the same conclusions without performing it.",
    { immediate: true });
})();
