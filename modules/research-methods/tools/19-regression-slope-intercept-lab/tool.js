/* =========================================================================
   Regression: Intercept, Slope and Least Squares
   -------------------------------------------------------------------------
   Thirty generated observations. The learner moves a candidate line by hand
   and every residual, and the sum of their squares, is recomputed live:

       predicted   = b0 + b1 * x
       residual    = observed y - predicted y
       SSE         = sum of the squared residuals
       R^2         = 1 - SSE / SST,   SST = sum of (y - mean y)^2

   R^2 is reported for the candidate line as well as for the fitted one, and
   can go NEGATIVE for a bad candidate - a line worse than simply predicting
   the mean of y for everybody. The tool says so rather than clamping it,
   because that is exactly what the quantity means.

   The least-squares solution is written down directly rather than searched
   for:

       b1 = sum((x - mx)(y - my)) / sum((x - mx)^2)
       b0 = my - b1 * mx

   so the reveal is an answer, not a better guess. No candidate can beat it,
   which is the point of the exercise.

   THE INTERCEPT AND CENTRING
   --------------------------
   The generated x values run from roughly 12 to 68 minutes, so x = 0 lies
   well outside them and the intercept is a prediction for a person who does
   not appear in the data. The region outside the observed range is shaded on
   the picture, and a disclosure shows the identical fit with x centred on its
   mean: the slope, every prediction and every residual are unchanged, and the
   intercept becomes the predicted score at an average amount of practice.

   WHAT IS NOT CLAIMED
   -------------------
   The slope compares people who differ in x; it does not say what would
   happen if one person's x were changed. No standard errors or intervals are
   computed, and the assumptions behind least squares are not checked here -
   that is the next tool in the module.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var N = 30;
  var SEED = 2884;
  var TRUE_B0 = 30;
  var TRUE_B1 = 0.6;
  var NOISE = 7;
  var X_MIN = 12;
  var X_MAX = 68;
  var DEFAULTS = { b0: 52.5, b1: 0 };

  /* =======================================================================
     The dataset
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normal(random) {
    var u = Math.max(random(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  }

  var DATA = (function () {
    var random = mulberry32(SEED);
    var points = [];
    for (var i = 0; i < N; i += 1) {
      var x = X_MIN + (X_MAX - X_MIN) * random();
      points.push({
        x: x,
        y: TRUE_B0 + TRUE_B1 * x + normal(random) * NOISE
      });
    }
    points.sort(function (a, b) { return a.x - b.x; });
    return points;
  }());

  var SUMMARY = (function () {
    var mx = 0;
    var my = 0;
    DATA.forEach(function (p) { mx += p.x; my += p.y; });
    mx /= N;
    my /= N;
    var sxx = 0;
    var sxy = 0;
    var syy = 0;
    DATA.forEach(function (p) {
      sxx += (p.x - mx) * (p.x - mx);
      sxy += (p.x - mx) * (p.y - my);
      syy += (p.y - my) * (p.y - my);
    });
    var b1 = sxy / sxx;
    return {
      mx: mx, my: my, sst: syy, b1: b1, b0: my - b1 * mx,
      xLo: DATA[0].x, xHi: DATA[N - 1].x
    };
  }());

  function errorsFor(b0, b1) {
    var sse = 0;
    DATA.forEach(function (p) {
      var e = p.y - (b0 + b1 * p.x);
      sse += e * e;
    });
    return { sse: sse, r2: 1 - sse / SUMMARY.sst };
  }

  var BEST = errorsFor(SUMMARY.b0, SUMMARY.b1);

  /* =======================================================================
     Small DOM helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(attrs, text, className) {
    var node = svgNode("text", attrs);
    if (className) { node.setAttribute("class", className); }
    node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function fmt(value, places) {
    return value.toFixed(places === undefined ? 2 : places);
  }

  function pct(p) { return (100 * p).toFixed(1) + "%"; }

  function row(cells) {
    var tr = make("tr");
    cells.forEach(function (cell, i) {
      if (i === 0) {
        var th = make("th", null, cell);
        th.setAttribute("scope", "row");
        tr.appendChild(th);
      } else {
        tr.appendChild(make("td", null, cell));
      }
    });
    return tr;
  }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
    return p;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#reg");
  if (!shell) { return; }

  var b0Range = $("#b0-range");
  var b1Range = $("#b1-range");
  var showResiduals = $("#show-residuals");
  var showSquares = $("#show-squares");
  var chartHeading = $("[data-chart-heading]");
  var regSvg = $("[data-reg]");
  var fitTable = $("[data-fit-table]");
  var readout = $("[data-readout]");
  var goalText = $("[data-goal-text]");
  var goalChecks = $("[data-goal-checks]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var extrapolation = $("[data-extrapolation]");
  var centreNote = $("[data-centre-note]");
  var centreTable = $("[data-centre-table]");
  var snapButton = $('[data-action="snap"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var revealed = false;
  var bestSoFar = Infinity;

  /* =======================================================================
     Drawing
     ===================================================================== */

  var PLOT = { left: 40, right: 448, top: 12, base: 156 };
  var AX = { xLo: 0, xHi: 75, yLo: 20, yHi: 95 };

  function X(v) {
    return PLOT.left + ((v - AX.xLo) / (AX.xHi - AX.xLo)) * (PLOT.right - PLOT.left);
  }
  function Y(v) {
    return PLOT.base - ((v - AX.yLo) / (AX.yHi - AX.yLo)) * (PLOT.base - PLOT.top);
  }

  function draw(b0, b1) {
    clear(regSvg);

    // Outside the observed range of x: arithmetic rather than evidence.
    [[AX.xLo, SUMMARY.xLo], [SUMMARY.xHi, AX.xHi]].forEach(function (span) {
      if (span[1] <= span[0]) { return; }
      regSvg.appendChild(svgNode("rect", {
        x: X(span[0]), y: PLOT.top, width: X(span[1]) - X(span[0]),
        height: PLOT.base - PLOT.top, class: "rg__outside"
      }));
      for (var hx = X(span[0]) + 4; hx < X(span[1]); hx += 8) {
        regSvg.appendChild(svgNode("line", {
          x1: hx, y1: PLOT.top, x2: hx, y2: PLOT.base, class: "rg__outside-hatch"
        }));
      }
    });
    regSvg.appendChild(svgText(
      { x: X(SUMMARY.xLo) - 4, y: PLOT.top + 10, "text-anchor": "end" },
      "no data", "chart__axis"));

    // Residuals, optionally as squares.
    if (showSquares.checked) {
      DATA.forEach(function (p) {
        var pred = b0 + b1 * p.x;
        var side = Math.abs(Y(p.y) - Y(pred));
        if (side < 1) { return; }
        regSvg.appendChild(svgNode("rect", {
          x: X(p.x), y: Math.min(Y(p.y), Y(pred)),
          width: side, height: side, class: "rg__square"
        }));
      });
    }
    if (showResiduals.checked) {
      DATA.forEach(function (p) {
        var pred = b0 + b1 * p.x;
        regSvg.appendChild(svgNode("line", {
          x1: X(p.x), y1: Y(p.y), x2: X(p.x), y2: Y(pred), class: "rg__residual"
        }));
      });
    }

    if (revealed) {
      regSvg.appendChild(svgNode("line", {
        x1: X(AX.xLo), y1: Y(SUMMARY.b0 + SUMMARY.b1 * AX.xLo),
        x2: X(AX.xHi), y2: Y(SUMMARY.b0 + SUMMARY.b1 * AX.xHi),
        class: "rg__least"
      }));
      regSvg.appendChild(svgText(
        { x: PLOT.right - 3,
          y: Math.max(PLOT.top + 22, Y(SUMMARY.b0 + SUMMARY.b1 * AX.xHi) + 16),
          "text-anchor": "end" },
        "least squares", "chart__label"));
    }

    regSvg.appendChild(svgNode("line", {
      x1: X(AX.xLo), y1: Y(b0 + b1 * AX.xLo),
      x2: X(AX.xHi), y2: Y(b0 + b1 * AX.xHi), class: "rg__candidate"
    }));
    regSvg.appendChild(svgText(
      { x: PLOT.right - 3,
        y: Math.max(PLOT.top + 10, Math.min(PLOT.base - 4, Y(b0 + b1 * AX.xHi) - 6)),
        "text-anchor": "end" },
      "your line", "chart__label"));

    DATA.forEach(function (p) {
      regSvg.appendChild(svgNode("circle",
        { cx: X(p.x), cy: Y(p.y), r: 3.2, class: "rg__point" }));
    });

    // Axes.
    regSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.top, x2: PLOT.left, y2: PLOT.base, class: "rg__axis" }));
    regSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base, class: "rg__axis" }));
    for (var v = 0; v <= 75; v += 15) {
      regSvg.appendChild(svgNode("line",
        { x1: X(v), y1: PLOT.base, x2: X(v), y2: PLOT.base + 4, class: "rg__axis" }));
      regSvg.appendChild(svgText(
        { x: X(v), y: PLOT.base + 16, "text-anchor": "middle" },
        String(v), "chart__axis"));
    }
    for (var w = 20; w <= 95; w += 15) {
      regSvg.appendChild(svgNode("line",
        { x1: PLOT.left - 4, y1: Y(w), x2: PLOT.left, y2: Y(w), class: "rg__axis" }));
      regSvg.appendChild(svgText(
        { x: PLOT.left - 7, y: Y(w) + 4, "text-anchor": "end" },
        String(w), "chart__axis"));
    }
    regSvg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 32, "text-anchor": "middle" },
      "minutes of practice a day — shaded region has no data", "chart__axis"));
    regSvg.appendChild(svgText(
      { x: PLOT.left - 7, y: PLOT.top - 1, "text-anchor": "end" },
      "score", "chart__axis"));
  }

  function render() {
    var b0 = Number(b0Range.value);
    var b1 = Number(b1Range.value);
    var e = errorsFor(b0, b1);
    if (e.sse < bestSoFar) { bestSoFar = e.sse; }

    chartHeading.textContent =
      "Your line: predicted score = " + fmt(b0, 1) + " + " + fmt(b1) +
      " × minutes";
    draw(b0, b1);

    clear(fitTable);
    [
      ["Intercept b₀", fmt(b0, 1), revealed ? fmt(SUMMARY.b0, 1) : "hidden"],
      ["Slope b₁", fmt(b1), revealed ? fmt(SUMMARY.b1) : "hidden"],
      ["Sum of squared errors", fmt(e.sse, 0), revealed ? fmt(BEST.sse, 0) : "hidden"],
      ["Variance accounted for",
        e.r2 < -0.01 ? "none — worse than the mean" : pct(e.r2),
        revealed ? pct(BEST.r2) : "hidden"]
    ].forEach(function (cells) { fitTable.appendChild(row(cells)); });

    clear(readout);
    [
      ["Intercept", fmt(b0, 1)],
      ["Slope", fmt(b1)],
      ["Sum of squared errors", fmt(e.sse, 0)],
      ["Your best so far", fmt(bestSoFar, 0)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    // Goal banner.
    var within = e.sse <= BEST.sse * 1.02;
    goalText.textContent = revealed
      ? "The smallest possible sum of squared errors on this dataset is " +
        fmt(BEST.sse, 0) + ". Nothing you can do to the two sliders will go below it."
      : "Get the sum of squared errors as low as you can, then reveal the " +
        "least-squares line and see how close you came.";
    clear(goalChecks);
    [
      ["Both sliders moved from their starting values",
        Number(b0Range.value) !== DEFAULTS.b0 || Number(b1Range.value) !== DEFAULTS.b1],
      ["Sum of squared errors below 2,500", e.sse < 2500],
      ["Within 2% of the least-squares total", within]
    ].forEach(function (entry) {
      var li = make("li", null,
        entry[0] + (entry[1] ? " (met)" : " (not yet)"));
      li.setAttribute("data-met", entry[1] ? "yes" : "no");
      goalChecks.appendChild(li);
    });

    // Verdict.
    var tone;
    var text;
    if (e.r2 < -0.05) {
      tone = "warn";
      text =
        "This line is worse than no line at all: predicting the mean score of " +
        fmt(SUMMARY.my, 1) + " for everybody would produce a smaller squared " +
        "total than " + fmt(e.sse, 0) + ". That is what a negative variance " +
        "accounted for means, and it is why the figure is reported rather " +
        "than clamped at zero.";
    } else if (!revealed && within) {
      tone = "good";
      text =
        "Sum of squared errors " + fmt(e.sse, 0) + ", accounting for " +
        pct(e.r2) + " of the variance in the scores. You are within two per " +
        "cent of the best line there is. Reveal it and compare the two pairs " +
        "of numbers.";
    } else if (!revealed) {
      tone = "caution";
      text =
        "Sum of squared errors " + fmt(e.sse, 0) + ", accounting for " +
        pct(e.r2) + " of the variance. Read your line as a claim: it says " +
        "that two people whose practice differs by one minute a day differ, " +
        "on average, by " + fmt(b1) + " points. Tick the squares box to see " +
        "why one badly missed point costs so much more than several near " +
        "misses.";
    } else {
      tone = "good";
      text =
        "The least-squares line is predicted score = " + fmt(SUMMARY.b0, 1) +
        " + " + fmt(SUMMARY.b1) + " × minutes, with a squared error total of " +
        fmt(BEST.sse, 0) + " and " + pct(BEST.r2) + " of the variance " +
        "accounted for. Your best attempt reached " + fmt(bestSoFar, 0) +
        ". The slope says that two people differing by one minute of daily " +
        "practice differ on average by " + fmt(SUMMARY.b1) + " points - a " +
        "comparison between people, not a prediction about changing anybody.";
    }
    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    extrapolation.textContent =
      "The shaded region holds no data: the observed practice times run from " +
      fmt(SUMMARY.xLo, 1) + " to " + fmt(SUMMARY.xHi, 1) + " minutes. The " +
      "intercept is the line's prediction at zero minutes, which is " +
      fmt(SUMMARY.xLo, 0) + " minutes outside anything anybody was measured " +
      "at, so it is a mathematically necessary anchor rather than a statement " +
      "about a person. The disclosure below shows what centring x does to it.";

    clear(centreTable);
    [
      ["Slope b₁", fmt(SUMMARY.b1), fmt(SUMMARY.b1)],
      ["Intercept b₀", fmt(SUMMARY.b0, 1), fmt(SUMMARY.my, 1)],
      ["What the intercept predicts",
        "score at 0 minutes", "score at the mean of " + fmt(SUMMARY.mx, 1) + " minutes"],
      ["Predicted score at 30 minutes",
        fmt(SUMMARY.b0 + SUMMARY.b1 * 30, 1),
        fmt(SUMMARY.my + SUMMARY.b1 * (30 - SUMMARY.mx), 1)],
      ["Predicted score at 55 minutes",
        fmt(SUMMARY.b0 + SUMMARY.b1 * 55, 1),
        fmt(SUMMARY.my + SUMMARY.b1 * (55 - SUMMARY.mx), 1)],
      ["Sum of squared errors", fmt(BEST.sse, 0), fmt(BEST.sse, 0)]
    ].forEach(function (cells) { centreTable.appendChild(row(cells)); });

    centreNote.textContent =
      "Subtracting the mean of x from every x value moves the vertical axis " +
      "to the middle of the data and changes nothing else. The slope is " +
      "identical, every prediction is identical, every residual is identical " +
      "and the squared error total is identical - and the intercept has gone " +
      "from " + fmt(SUMMARY.b0, 1) + ", a prediction for somebody who does " +
      "not exist, to " + fmt(SUMMARY.my, 1) + ", the predicted score at an " +
      "average amount of practice. It is the same model, reported in a way " +
      "that has a meaning.";

    return e;
  }

  shell.bindRange(b0Range, {
    format: function (v) { return fmt(v, 1); },
    describe: function (v) {
      return "an intercept of " + fmt(v, 1) + " points at zero minutes";
    },
    onInput: render
  });

  shell.bindRange(b1Range, {
    format: function (v) { return fmt(v); },
    describe: function (v) {
      return "a slope of " + fmt(v) + " points per extra minute of practice";
    },
    onInput: render
  });

  showResiduals.addEventListener("change", render);
  showSquares.addEventListener("change", function () {
    render();
    shell.announce(showSquares.checked
      ? "Each residual is now drawn as a square. Their total area is the " +
        "quantity being minimised."
      : "Squares removed.", { immediate: true });
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    revealed = true;
    snapButton.disabled = false;
    challengeSection.hidden = false;
    var e = render();
    shell.announce(
      "Least-squares line revealed: intercept " + fmt(SUMMARY.b0, 1) +
      ", slope " + fmt(SUMMARY.b1) + ", squared error total " +
      fmt(BEST.sse, 0) + ". Your best attempt reached " + fmt(bestSoFar, 0) +
      ", which is " + fmt(100 * (bestSoFar / BEST.sse - 1), 1) +
      " per cent above it. The challenge has opened below.",
      { immediate: true });
    return e;
  });

  snapButton.addEventListener("click", function () {
    b0Range.value = String(Math.round(SUMMARY.b0 * 2) / 2);
    b1Range.value = String(Math.round(SUMMARY.b1 * 100) / 100);
    [b0Range, b1Range].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    render();
    shell.announce(
      "Sliders snapped to the nearest step to the least-squares values. The " +
      "small remaining gap is the slider's resolution, not a better line.",
      { immediate: true });
  });

  /* =======================================================================
     Opening predictions
     ===================================================================== */

  var CRITERION = {
    sum: "The plain sum of the residuals is zero for every least-squares line " +
      "and for a great many others, so it cannot distinguish between them. A " +
      "line that missed wildly upwards for half the points and wildly " +
      "downwards for the other half would score exactly as well as a perfect " +
      "one.",
    squares: "Correct. Squaring removes the cancellation that makes the plain " +
      "sum useless, and it has a second consequence worth noticing: one large " +
      "miss costs far more than several small ones, which is why least squares " +
      "is so sensitive to a single distant point.",
    largest: "That is a different and perfectly respectable criterion, called " +
      "minimax, and it gives a different line. It is far more influenced by " +
      "the single worst point than least squares is, which is usually a " +
      "reason not to use it.",
    count: "A line can be moved to put any number of points above it without " +
      "fitting any of them well, so this criterion says nothing about how " +
      "close the line comes to the data. It is also satisfied by infinitely " +
      "many quite different lines."
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLab() {
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce(
      "Laboratory unlocked, with a flat line to start from.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var criterion = $('input[name="criterion"]:checked', openingForm);
    var beat = $('input[name="beat"]:checked', openingForm);
    if (!criterion || !beat) {
      openingError.textContent = "Answer both questions before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var right = criterion.value === "squares";
    var tone = right && beat.value === "no" ? "good" : "caution";
    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict",
      right ? "The criterion is right." : "Not the criterion the method uses."));
    p.appendChild(document.createTextNode(" " + CRITERION[criterion.value]));
    openingFeedback.appendChild(p);
    var second = make("p");
    second.appendChild(make("strong", null,
      beat.value === "no"
        ? "And you are right that you cannot beat it. "
        : "On the second question: you will not manage it. "));
    second.appendChild(document.createTextNode(
      "There is exactly one pair of values that minimises the squared total, " +
      "and it can be written down directly from the data rather than searched " +
      "for. Try anyway - getting within a per cent or two by hand is a much " +
      "better way to believe that than being shown the algebra."));
    openingFeedback.appendChild(second);
    openingFeedback.hidden = false;

    lockForm(openingForm);
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Predictions skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var inside = $("#pred-inside").value;
    var outside = $("#pred-outside").value;
    var report = $('input[name="report"]:checked', challengeForm);
    if (inside === "" || outside === "" || !report) {
      challengeError.textContent =
        "Fill in both predictions and choose an answer to the third question.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var trueInside = SUMMARY.b0 + SUMMARY.b1 * 55;
    var trueOutside = SUMMARY.b0;
    var insideOk = Math.abs(Number(inside) - trueInside) <= 1.5;
    var outsideOk = Math.abs(Number(outside) - trueOutside) <= 1.5;
    var reportOk = report.value === "inside";
    var score = (insideOk ? 1 : 0) + (outsideOk ? 1 : 0) + (reportOk ? 1 : 0);

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone",
      score === 3 ? "good" : score >= 1 ? "caution" : "warn");
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", score + " of the three."));
    p.appendChild(document.createTextNode(
      " The arithmetic is the easy part; the third question is the one that " +
      "separates using a model from trusting it."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    var li1 = make("li");
    li1.appendChild(make("strong", null,
      "At 55 minutes — " + (insideOk ? "correct. " : "not quite. ")));
    li1.appendChild(document.createTextNode(
      "The line gives " + fmt(SUMMARY.b0, 1) + " + " + fmt(SUMMARY.b1) +
      " × 55 = " + fmt(trueInside, 1) + " points. Fifty-five minutes sits " +
      "comfortably inside the observed range, so this is interpolation: the " +
      "line has been fitted to people like this."));
    list.appendChild(li1);

    var li2 = make("li");
    li2.appendChild(make("strong", null,
      "At 0 minutes — " + (outsideOk ? "correct. " : "not quite. ")));
    li2.appendChild(document.createTextNode(
      "The line gives " + fmt(trueOutside, 1) + " points, which is simply the " +
      "intercept. The arithmetic is straightforward and the number describes " +
      "nobody: the least practice anybody in this dataset did was " +
      fmt(SUMMARY.xLo, 1) + " minutes."));
    list.appendChild(li2);

    var li3 = make("li");
    li3.appendChild(make("strong", null,
      "Which to report — " + (reportOk ? "correct. " : "not quite. ")));
    li3.appendChild(document.createTextNode(
      "The 55-minute prediction only. Extrapolating to zero assumes the " +
      "straight line continues into a region where nothing was observed, and " +
      "nothing in the data supports that: the relationship could flatten, " +
      "steepen or reverse there and the fit would look identical. \"Both\" " +
      "treats arithmetic as evidence. \"Neither, because R squared is not " +
      "high enough\" confuses fit with applicability - a model with a modest " +
      "R squared can still predict usefully inside its range, and one with a " +
      "high R squared is no safer outside it."));
    list.appendChild(li3);
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(score + " of the three correct.", { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    revealed = false;
    bestSoFar = Infinity;
    snapButton.disabled = true;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    b0Range.value = String(DEFAULTS.b0);
    b1Range.value = String(DEFAULTS.b1);
    showResiduals.checked = true;
    showSquares.checked = false;
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the two predictions above to open the laboratory.",
    { immediate: true });
})();
