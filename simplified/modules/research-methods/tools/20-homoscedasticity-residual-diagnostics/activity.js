/* =========================================================================
   Does the Spread Stay the Same? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/20-homoscedasticity-residual-diagnostics/

   TEACHING JOB
   ------------
   One question: does the spread around the fitted line stay about the same
   across the range of X? The scatter plot makes that hard to judge. Taking
   the line out makes it easy.

   THE SHAPE OF THE ACTIVITY
   -------------------------
   1. The scatter plot and its fitted line, on their own.
   2. The learner is asked to judge the spread by eye, across three groups.
      Deliberately hard, and deliberately unlabelled: the three groups are
      named A, B and C rather than "even", "fanning" and "widest at both
      ends", because a learner who can read the answer off a radio button has
      not been asked the question.
   3. The residual plot is revealed underneath, on a shared axis.
   4. Only then does the vocabulary arrive: residual, homoscedasticity,
      heteroscedasticity.
   5. The standard-error comparison is in the synthesis, not on the first
      screen, because it is the subtlest part and nothing else depends on it.

   THE ARITHMETIC
   --------------
       b1  = SUM (x - xbar)(y - ybar) / SUM (x - xbar)^2
       e_i = y_i - (b0 + b1 x_i)
       ordinary SE(b1) = sqrt( (SUM e^2 / (n - 2)) / SUM (x - xbar)^2 )
       robust   SE(b1) = sqrt( SUM (x - xbar)^2 e^2 ) / SUM (x - xbar)^2

   The robust standard error is HC0, the Eicker-White estimator.

   A CORRECTION MADE DURING BUILDING, RECORDED BECAUSE IT MATTERS
   --------------------------------------------------------------
   This activity was first written around the usual claim that fanning out
   wrecks the standard error of the slope. Measured over many seeds it does
   not, and the theory agrees. Writing E for expectation over the design, with
   sigma(x) the local noise and u the centred predictor:

       ratio of HC0 to ordinary variance = E[(x-xbar)^2 sigma^2(x)]
                                         / ( E[sigma^2(x)] E[(x-xbar)^2] )

   which is 1 plus a term in cov((x-xbar)^2, sigma^2(x)). A LINEAR fan makes
   sigma^2 quadratic in x, whose only component correlated with the symmetric
   (x-xbar)^2 is small, so the covariance is small and the two standard errors
   very nearly agree. Widest-at-both-ends makes sigma^2 large exactly where
   (x-xbar)^2 is large, the covariance is substantial, and the ordinary
   standard error understates the truth.

   For the settings used here the predicted ratios of robust to ordinary
   standard error are 1.000 for group A, 1.046 for group B and 1.259 for
   group C, and the simulation reproduces them. This nuance now lives in the
   synthesis rather than in the opening, because it is the last thing a
   learner needs rather than the first. Do not "fix" group B to look worse.

   WHAT WAS REDUCED
   ----------------
   The sample-size control, the repeated-sampling check on interval coverage,
   and the diagnose-four-plots challenge.

   Randomness is seeded so a figure can be reproduced. Nothing is stored and
   nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var N = 60;
  var TRUE_INTERCEPT = 22;
  var TRUE_SLOPE = 0.58;
  var BASE_NOISE = 5;
  /* At full severity the widest region is this many times the base noise. */
  var MAX_EXTRA = 4.5;
  /* HC0 is a noisy estimator at sixty people: on one sample the robust and
     ordinary figures can differ by ten per cent with the spread perfectly
     even, purely by chance. Reporting a single sample's comparison as though
     it characterised the design would therefore teach the wrong thing. The
     going-further note reports the average over this many repeats of the same
     design as well, which is stable, and says plainly how much one sample
     wobbles around it. */
  var REPEATS = 200;

  /* Learner-facing names. The internal keys describe the shape; the labels
     deliberately do not, so the visual question is a real one. */
  var GROUP_NAME = { even: "Group A", fan: "Group B", bow: "Group C" };

  var severityInput = document.getElementById("severity");
  var seedInput = document.getElementById("seed");
  var shapeRadios = {
    even: document.getElementById("shape-even"),
    fan: document.getElementById("shape-fan"),
    bow: document.getElementById("shape-bow")
  };
  var shapeLabels = {
    even: document.getElementById("shape-even-label"),
    fan: document.getElementById("shape-fan-label"),
    bow: document.getElementById("shape-bow-label")
  };
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var legend = document.getElementById("legend");
  var readout = document.getElementById("readout");
  var advanced = document.getElementById("advanced");
  var advancedNote = document.getElementById("advanced-note");
  var question = document.getElementById("question");
  var sentence = document.getElementById("sentence");
  var strip = document.getElementById("strip");
  var explain = document.getElementById("explain");
  var task = document.getElementById("task");
  var taskText = document.getElementById("task-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* Whether the residual panel has been revealed. Everything about what the
     learner is being asked hangs off this. */
  var stripped = false;
  var study = null;

  function severity() { return Number(severityInput.value) / 100; }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }
  function shape() {
    if (shapeRadios.fan.checked) { return "fan"; }
    if (shapeRadios.bow.checked) { return "bow"; }
    return "even";
  }
  function groupName() { return GROUP_NAME[shape()]; }

  function markShape() {
    var current = shape();
    Object.keys(shapeLabels).forEach(function (key) {
      shapeLabels[key].setAttribute("data-checked", key === current ? "true" : "false");
    });
  }

  /* --- Generate and fit -------------------------------------------------- */

  /* How noisy this part of the range is, as a multiplier on BASE_NOISE. */
  function noiseAt(x) {
    var kind = shape();
    var s = severity();
    if (kind === "even" || s === 0) { return 1; }
    if (kind === "fan") {
      return 1 + s * (MAX_EXTRA - 1) * ((x - 10) / 80);
    }
    return 1 + s * (MAX_EXTRA - 1) * (Math.abs(x - 50) / 40);
  }

  /* One draw of the current design at a given seed. */
  function draw(withSeed) {
    var random = S.mulberry32(withSeed);
    var rows = [];
    var i = 0;
    while (i < N) {
      var x = 10 + (i / (N - 1)) * 80;
      var y = TRUE_INTERCEPT + TRUE_SLOPE * x +
        S.normalDraw(random) * BASE_NOISE * noiseAt(x);
      rows.push({ x: x, y: y });
      i += 1;
    }
    return fit(rows);
  }

  /* The average of robust over ordinary across many repeats of this design.
     A property of the design rather than of one sample. */
  function designRatio() {
    var total = 0;
    var k = 0;
    while (k < REPEATS) {
      total += draw(90001 + k * 7919).ratioOfSes;
      k += 1;
    }
    return total / REPEATS;
  }

  function build() {
    var random = S.mulberry32(seed());
    var rows = [];
    var i = 0;
    while (i < N) {
      var x = 10 + (i / (N - 1)) * 80;
      var y = TRUE_INTERCEPT + TRUE_SLOPE * x +
        S.normalDraw(random) * BASE_NOISE * noiseAt(x);
      rows.push({ x: x, y: y });
      i += 1;
    }
    study = fit(rows);
  }

  function fit(rows) {
    var mx = S.mean(rows.map(function (p) { return p.x; }));
    var my = S.mean(rows.map(function (p) { return p.y; }));
    var sxy = 0, sxx = 0, syy = 0;
    rows.forEach(function (p) {
      sxy += (p.x - mx) * (p.y - my);
      sxx += (p.x - mx) * (p.x - mx);
      syy += (p.y - my) * (p.y - my);
    });
    var slope = sxy / sxx;
    var intercept = my - slope * mx;

    var sse = 0, meat = 0;
    rows.forEach(function (p) {
      p.fitted = intercept + slope * p.x;
      p.residual = p.y - p.fitted;
      sse += p.residual * p.residual;
      meat += (p.x - mx) * (p.x - mx) * p.residual * p.residual;
    });

    var ordinary = Math.sqrt((sse / (rows.length - 2)) / sxx);
    var robust = Math.sqrt(meat) / sxx;

    /* Spread at each end of the range, which is the whole question in two
       numbers a learner can read straight off the lower plot. */
    var sorted = rows.slice().sort(function (a, b) { return a.x - b.x; });
    var third = Math.floor(rows.length / 3);
    var low = sorted.slice(0, third).map(function (p) { return p.residual; });
    var high = sorted.slice(rows.length - third).map(function (p) { return p.residual; });
    var mid = sorted.slice(third, rows.length - third).map(function (p) { return p.residual; });
    var sdLow = Math.sqrt(S.variance(low));
    var sdHigh = Math.sqrt(S.variance(high));
    var sdMid = Math.sqrt(S.variance(mid));

    return {
      rows: rows, slope: slope, intercept: intercept,
      ordinary: ordinary, robust: robust,
      r2: syy > 0 ? 1 - sse / syy : 0,
      sdLow: sdLow, sdMid: sdMid, sdHigh: sdHigh,
      ends: (sdLow + sdHigh) / 2,
      ratio: sdLow > 0 ? sdHigh / sdLow : 1,
      ratioOfSes: ordinary > 0 ? robust / ordinary : 1
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var LEFT = 96;
    var RIGHT = 856;
    var TOP1 = 62;
    var BOT1 = 292;
    var TOP2 = 352;
    var BOT2 = 512;

    /* Before the reveal the figure is the upper panel only, so the axis and
       its caption sit directly beneath it. */
    var axisBottom = stripped ? BOT2 : BOT1;
    var TICK_Y = axisBottom + 22;
    var CAP_Y = axisBottom + 44;

    var xLo = 5, xHi = 95;
    var ys = study.rows.map(function (p) { return p.y; });
    var yLo = Math.floor(Math.min.apply(null, ys) / 10) * 10 - 5;
    var yHi = Math.ceil(Math.max.apply(null, ys) / 10) * 10 + 5;
    var rMax = Math.max.apply(null, study.rows.map(function (p) { return Math.abs(p.residual); }));
    rMax = Math.ceil(rMax / 5) * 5;

    var X = function (v) { return LEFT + ((v - xLo) / (xHi - xLo)) * (RIGHT - LEFT); };
    var Y1 = function (v) { return BOT1 - ((v - yLo) / (yHi - yLo)) * (BOT1 - TOP1); };
    var Y2 = function (v) { return (TOP2 + BOT2) / 2 - (v / rMax) * ((BOT2 - TOP2) / 2); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (CAP_Y + 18));

    var titleA = svg("text", { x: LEFT, y: 26, class: "plot__label" });
    titleA.textContent = stripped
      ? "1. The relationship: " + groupName() + " and the line through them"
      : groupName() + ", with the best-fitting line through them";
    chart.appendChild(titleA);

    /* Upper panel: the scatter and its line. */
    chart.appendChild(svg("line", { x1: LEFT, y1: BOT1, x2: RIGHT, y2: BOT1, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP1, x2: LEFT, y2: BOT1, class: "plot__axis" }));
    study.rows.forEach(function (p) {
      chart.appendChild(svg("circle", {
        cx: X(p.x).toFixed(1), cy: Y1(p.y).toFixed(1), r: 3.4,
        fill: "#3D5A80", "fill-opacity": "0.65"
      }));
    });
    chart.appendChild(svg("line", {
      x1: X(xLo).toFixed(1), y1: Y1(study.intercept + study.slope * xLo).toFixed(1),
      x2: X(xHi).toFixed(1), y2: Y1(study.intercept + study.slope * xHi).toFixed(1),
      stroke: "#1C7293", "stroke-width": "2.6"
    }));
    [yLo, (yLo + yHi) / 2, yHi].forEach(function (v) {
      var tick = svg("text", {
        x: LEFT - 10, y: (Y1(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = v.toFixed(0);
      chart.appendChild(tick);
    });
    var yCapA = svg("text", {
      x: 42, y: ((TOP1 + BOT1) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
      transform: "rotate(-90 42 " + ((TOP1 + BOT1) / 2).toFixed(1) + ")"
    });
    yCapA.textContent = "Outcome";
    chart.appendChild(yCapA);

    /* Lower panel: the same people with the line taken out. */
    if (stripped) {
      var titleB = svg("text", { x: LEFT, y: TOP2 - 20, class: "plot__label" });
      titleB.textContent = "2. What is left over: the same people with the line taken out";
      chart.appendChild(titleB);

      chart.appendChild(svg("line", {
        x1: LEFT, y1: Y2(0).toFixed(1), x2: RIGHT, y2: Y2(0).toFixed(1),
        stroke: "#1C7293", "stroke-width": "2", "stroke-dasharray": "6 5"
      }));
      chart.appendChild(svg("line", { x1: LEFT, y1: TOP2, x2: LEFT, y2: BOT2, class: "plot__axis" }));
      study.rows.forEach(function (p) {
        chart.appendChild(svg("circle", {
          cx: X(p.x).toFixed(1), cy: Y2(p.residual).toFixed(1), r: 3.4,
          fill: "#C0434F", "fill-opacity": "0.6"
        }));
      });
      [rMax, 0, -rMax].forEach(function (v) {
        var tick = svg("text", {
          x: LEFT - 10, y: (Y2(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
        });
        tick.textContent = v > 0 ? "+" + v : String(v);
        chart.appendChild(tick);
      });
      var zeroTag = svg("text", {
        x: RIGHT - 4, y: (Y2(0) - 8).toFixed(1), "text-anchor": "end",
        class: "plot__sub plot__over", fill: "#1C7293"
      });
      zeroTag.textContent = "the line, now flat";
      chart.appendChild(zeroTag);
      var yCapB = svg("text", {
        x: 42, y: ((TOP2 + BOT2) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
        transform: "rotate(-90 42 " + ((TOP2 + BOT2) / 2).toFixed(1) + ")"
      });
      yCapB.textContent = "Distance from the line";
      chart.appendChild(yCapB);
    }

    chart.appendChild(svg("line", {
      x1: LEFT, y1: axisBottom, x2: RIGHT, y2: axisBottom, class: "plot__axis"
    }));
    [10, 30, 50, 70, 90].forEach(function (t) {
      var tick = svg("text", { x: X(t).toFixed(1), y: TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(t);
      chart.appendChild(tick);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = stripped ? "Predictor, shared by both plots" : "Predictor";
    chart.appendChild(cap);

    legend.textContent = stripped
      ? "Both plots show the same sixty people on the same horizontal axis, so " +
        "a person sits at the same place across in each. In the lower plot the " +
        "line has been pulled flat, so every dot is simply that person's " +
        "distance above or below it."
      : "Each dot is one person. The line is the best summary of the average " +
        "relationship between the two variables.";

    renderReadout();
    renderAdvanced();
    renderSentence();
    describe();
  }

  /* --- The readout ------------------------------------------------------ */

  function renderReadout() {
    readout.textContent = "";
    tile(readout, "Fitted slope", study.slope.toFixed(3),
      "one number for the whole range: the average relationship");
    if (!stripped) { return; }
    tile(readout, "Spread at the low end", study.sdLow.toFixed(1),
      "how far the line misses, on the left third");
    tile(readout, "Spread at the high end", study.sdHigh.toFixed(1),
      "how far the line misses, on the right third");
  }

  function renderAdvanced() {
    advanced.textContent = "";
    tile(advanced, "Ordinary standard error", study.ordinary.toFixed(4),
      "assumes the spread is even");
    tile(advanced, "Robust standard error", study.robust.toFixed(4),
      "assumes nothing about the spread");

    var design = designRatio();
    var designPct = Math.abs(100 * (design - 1)).toFixed(0);
    var samplePct = Math.abs(100 * (study.ratioOfSes - 1)).toFixed(0);
    var tail = " On this particular sample of sixty they happen to differ by " +
      samplePct + " per cent, which is a fair measure of how much a single " +
      "comparison at this size wobbles. Change the seed and watch it move.";

    if (design < 1.08) {
      advancedNote.textContent =
        "Across two hundred repeats of " + groupName() +
        ", the robust figure averages " + design.toFixed(2) +
        " times the ordinary one, so assuming an even spread costs almost " +
        "nothing for this group whatever the lower plot looks like." + tail;
    } else {
      advancedNote.textContent =
        "Across two hundred repeats of " + groupName() +
        ", the robust figure averages " + design.toFixed(2) +
        " times the ordinary one, so the ordinary calculation understates the " +
        "uncertainty in the slope by about " + designPct +
        " per cent for this group. The ordinary figure is the one your " +
        "software prints by default, and every p-value and confidence " +
        "interval for the slope is built on it." + tail;
    }
  }

  function tile(list, caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    list.appendChild(item);
  }

  /* --- The running interpretation, only after the reveal ---------------- */

  function renderSentence() {
    if (!stripped) { sentence.textContent = ""; return; }
    var kind = shape();
    var head = "The slope is " + study.slope.toFixed(3) +
      " for every one of these groups, give or take sampling noise. ";
    if (kind === "even" || severity() === 0) {
      sentence.textContent = head + groupName() +
        " has a spread of " + study.sdLow.toFixed(1) + " on the left and " +
        study.sdHigh.toFixed(1) + " on the right, so the band is about the " +
        "same width all the way across. That is homoscedasticity, and it is " +
        "the situation the usual regression formulas assume.";
      return;
    }
    if (kind === "fan") {
      sentence.textContent = head + groupName() +
        " has a spread of " + study.sdLow.toFixed(1) + " on the left and " +
        study.sdHigh.toFixed(1) + " on the right, so the band widens as it " +
        "goes. That is heteroscedasticity: the line fits the people on the " +
        "left much more closely than the people on the right, and the single " +
        "slope above says nothing about it.";
      return;
    }
    sentence.textContent = head + groupName() +
      " has a spread of " + study.ends.toFixed(1) +
      " at the two ends against " + study.sdMid.toFixed(1) +
      " in the middle, so the band is pinched in the centre and loose at " +
      "both edges. That is heteroscedasticity too, in a different shape, and " +
      "notice that comparing the left end with the right end alone would " +
      "have missed it completely.";
  }

  function describe() {
    var kind = shape();
    var shapeWords = (kind === "even" || severity() === 0)
      ? "an even band of roughly constant width all the way along"
      : kind === "fan"
        ? "a wedge, narrow at the left and widening towards the right"
        : "an hourglass, wide at both ends and pinched in the middle";
    chartDesc.textContent = stripped
      ? "Two plots stacked on a shared horizontal axis. Above, sixty " +
        "observations from " + groupName() + " with a fitted line of slope " +
        study.slope.toFixed(3) + " through them. Below, the same people with " +
        "the line taken out, so each dot is that person's distance above or " +
        "below it, scattered about a dashed zero line. Those distances form " +
        shapeWords + ". Their spread is " + study.sdLow.toFixed(1) +
        " across the left third of the range, " + study.sdMid.toFixed(1) +
        " across the middle and " + study.sdHigh.toFixed(1) +
        " across the right third. The ordinary standard error of the slope is " +
        study.ordinary.toFixed(4) + " and the robust one is " +
        study.robust.toFixed(4) + "."
      : "A scatter plot of sixty observations from " + groupName() +
        " with a fitted line of slope " + study.slope.toFixed(3) +
        " through them. Whether the scatter around that line stays equally " +
        "wide across the range is the question the activity asks, and it is " +
        "not settled by this plot alone.";
  }

  /* --- Controls -------------------------------------------------------- */

  var ranges = [wb.bindRange("#severity", { format: function (v) { return v; } })];
  function syncRanges() { ranges.forEach(function (r) { if (r) { r.sync(); } }); }

  function refresh(announce) {
    syncRanges();
    build();
    render();
    if (announce) {
      wb.announce(stripped
        ? groupName() + ". Spread " + study.sdLow.toFixed(1) +
          " on the left and " + study.sdHigh.toFixed(1) + " on the right. Slope " +
          study.slope.toFixed(3) + "."
        : groupName() + " drawn. Slope " + study.slope.toFixed(3) + ".");
    }
  }

  [severityInput, seedInput].forEach(function (input) {
    input.addEventListener("change", function () { refresh(true); });
  });

  Object.keys(shapeRadios).forEach(function (key) {
    shapeRadios[key].addEventListener("change", function () {
      markShape();
      refresh(true);
    });
  });

  strip.addEventListener("click", function () {
    if (stripped) { return; }
    stripped = true;
    strip.setAttribute("aria-disabled", "true");
    strip.disabled = true;
    explain.disabled = false;
    wb.hide("#question");
    wb.show("#sentence");
    render();
    taskText.textContent =
      "Every dot in the lower plot is one person's residual: the vertical " +
      "distance from their dot in the upper plot to the line, positive above " +
      "it and negative below. Taking the line out pulls the trend flat, so " +
      "the dots sit around zero and nothing is left except how far the line " +
      "missed. Now click between the three groups and watch the lower plot. " +
      "The upper plot barely changes and the slope hardly moves, and the " +
      "lower one tells three completely different stories.";
    wb.show("#task");
    wb.scrollTo("#card");
    wb.announce("The residual plot is now below the scatter plot. Compare the " +
      "three groups.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    stripped = false;
    shapeRadios.even.checked = true;
    shapeRadios.fan.checked = false;
    shapeRadios.bow.checked = false;
    markShape();
    severityInput.value = "70";
    seedInput.value = "5150";
    strip.disabled = false;
    strip.removeAttribute("aria-disabled");
    explain.disabled = true;
    wb.show("#question");
    wb.hide("#sentence");
    wb.hide("#task");
    wb.hide("#synthesis");
    refresh(false);
  });

  markShape();
  refresh(false);
})();
