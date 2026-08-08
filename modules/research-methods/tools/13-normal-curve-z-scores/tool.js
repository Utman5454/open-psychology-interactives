/* =========================================================================
   The Normal Curve and z-Scores
   -------------------------------------------------------------------------
   Two staged experiments.

   EXPERIMENT 1 — one distribution, one score
   ------------------------------------------
   A normal density is drawn on a FIXED score axis (0 to 100) and a FIXED
   density axis (0 to 0.21, which is a little above the tallest peak the
   sliders allow, at sigma = 2). Fixing both axes is the whole point: it is
   what lets the learner watch the peak fall as sigma rises, and it makes
   "the area is always 1" visually credible instead of merely asserted.

       density(x) = exp(-z^2 / 2) / (sigma * sqrt(2*pi)),   z = (x - mu)/sigma
       area below x = Phi(z)

   Phi is the standard normal cumulative function, computed with the
   Abramowitz and Stegun 26.2.17 rational approximation (absolute error below
   1.5e-7), which is ample for a percentile printed to one decimal place.

   The standard-deviation band highlights mu +/- k*sigma. Its area is
   2*Phi(k) - 1 and therefore does not move when mu or sigma move, which is
   exactly why 68-95-99.7 is a rule about the shape rather than about a
   particular test.

   EXPERIMENT 2 — one score, two distributions
   -------------------------------------------
   The same raw score is placed on two curves. The z-scores are WITHHELD until
   the learner commits to a judgement: that withholding is deliberate and is
   the documented viewport-local exception on this page - the primary picture
   is on screen throughout, and only the two numbers that answer the question
   are hidden.

   WHAT IS AND IS NOT BEING CLAIMED
   --------------------------------
   Every area here is exact for the mathematical normal distribution and
   approximate for anything real. The 68-95-99.7 figures are properties of the
   model, not of data; standardising is a linear change of units and does not
   normalise anything; and mu and sigma are treated as population values,
   which real work almost never has.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var X_MIN = 0;
  var X_MAX = 100;
  /* A little above the tallest peak the sliders allow (sigma = 2 gives
     0.1995), so the vertical axis can stay fixed while sigma moves. */
  var DENSITY_MAX = 0.21;
  var A_MU = 50;
  var A_SIGMA = 6;   // Test A in Experiment 2 is fixed
  var DEFAULTS = { mu: 50, sigma: 10, x: 70, band: "0" };
  var C_DEFAULTS = { muB: 55, sigmaB: 15, x: 62 };

  /* =======================================================================
     The normal distribution
     ===================================================================== */

  /** Standard normal cumulative distribution, Abramowitz and Stegun 26.2.17. */
  function phi(z) {
    var sign = z < 0 ? -1 : 1;
    var x = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t -
      0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + sign * y);
  }

  function density(x, mu, sigma) {
    var z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }

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

  /** Percentages are printed to one decimal place, except very small ones,
      where a rounded "0.0%" would be misleading. */
  function pct(p) {
    var v = 100 * p;
    if (v > 0 && v < 0.05) { return "under 0.05%"; }
    if (v < 100 && v > 99.95) { return "over 99.95%"; }
    return v.toFixed(1) + "%";
  }

  function ordinal(p) {
    var v = 100 * p;
    if (v < 0.5) { return "below the 1st"; }
    if (v > 99.5) { return "above the 99th"; }
    var n = Math.round(v);
    var suffix = "th";
    if (n % 10 === 1 && n % 100 !== 11) { suffix = "st"; }
    else if (n % 10 === 2 && n % 100 !== 12) { suffix = "nd"; }
    else if (n % 10 === 3 && n % 100 !== 13) { suffix = "rd"; }
    return n + suffix;
  }

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

  var curveShell = InteractiveShell.attach("#curve");
  var compShell = InteractiveShell.attach("#compare");
  if (!curveShell || !compShell) { return; }

  var muRange = $("#mu-range");
  var sigmaRange = $("#sigma-range");
  var xRange = $("#x-range");
  var bandSelect = $("#band-select");
  var chartHeading = $("[data-chart-heading]");
  var curveSvg = $("[data-curve]");
  var curveTable = $("[data-curve-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var bandNote = $("[data-band-note]");
  var standardNote = $("[data-standard-note]");
  var landmarkTable = $("[data-landmark-table]");

  var muBRange = $("#mu-b-range");
  var sigmaBRange = $("#sigma-b-range");
  var xBothRange = $("#x-both-range");
  var compareHeading = $("[data-compare-heading]");
  var twoCurves = $("[data-two-curves]");
  var compareTable = $("[data-compare-table]");
  var compareFeedback = $("[data-compare-feedback]");
  var compareError = $("[data-compare-error]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var curveSection = $("#curve-section");
  var compareSection = $("#compare-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var revealed = false;
  var pairSeed = 9021;

  /* =======================================================================
     Drawing helpers shared by both experiments
     ===================================================================== */

  var PLOT = { left: 40, right: 448, top: 12, base: 150 };

  function xAt(value) {
    return PLOT.left +
      ((value - X_MIN) / (X_MAX - X_MIN)) * (PLOT.right - PLOT.left);
  }

  function yAt(d) {
    return PLOT.base - (d / DENSITY_MAX) * (PLOT.base - PLOT.top);
  }

  function curvePoints(mu, sigma, from, to) {
    var points = [];
    var steps = 180;
    for (var i = 0; i <= steps; i += 1) {
      var value = from + (to - from) * (i / steps);
      points.push([xAt(value), yAt(density(value, mu, sigma))]);
    }
    return points;
  }

  function pathFrom(points, close) {
    var d = points.map(function (p, i) {
      return (i === 0 ? "M" : "L") + fmt(p[0], 1) + " " + fmt(p[1], 1);
    }).join(" ");
    return close ? d + " Z" : d;
  }

  function drawAxis(svg, label) {
    svg.appendChild(svgNode("line", {
      x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base,
      class: "nc__axis"
    }));
    for (var v = 0; v <= 100; v += 10) {
      svg.appendChild(svgNode("line", {
        x1: xAt(v), y1: PLOT.base, x2: xAt(v), y2: PLOT.base + 4,
        class: "nc__axis"
      }));
      if (v % 20 === 0) {
        svg.appendChild(svgText(
          { x: xAt(v), y: PLOT.base + 17, "text-anchor": "middle" },
          String(v), "chart__axis"));
      }
    }
    svg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 33,
        "text-anchor": "middle" }, label, "chart__axis"));
    svg.appendChild(svgText(
      { x: PLOT.left - 4, y: PLOT.top + 4, "text-anchor": "end" },
      "density", "chart__axis"));
  }

  /* =======================================================================
     Experiment 1
     ===================================================================== */

  function settings() {
    return {
      mu: Number(muRange.value),
      sigma: Number(sigmaRange.value),
      x: Number(xRange.value),
      band: Number(bandSelect.value)
    };
  }

  function renderCurve() {
    var s = settings();
    clear(curveSvg);

    // The standard-deviation band sits behind everything else.
    if (s.band) {
      var lo = Math.max(X_MIN, s.mu - s.band * s.sigma);
      var hi = Math.min(X_MAX, s.mu + s.band * s.sigma);
      curveSvg.appendChild(svgNode("rect", {
        x: xAt(lo), y: PLOT.top, width: Math.max(0, xAt(hi) - xAt(lo)),
        height: PLOT.base - PLOT.top, class: "nc__band"
      }));
    }

    // Area below the chosen score, filled and hatched.
    var fill = curvePoints(s.mu, s.sigma, X_MIN, s.x);
    fill.unshift([xAt(X_MIN), PLOT.base]);
    fill.push([xAt(s.x), PLOT.base]);
    curveSvg.appendChild(svgNode("path",
      { d: pathFrom(fill, true), class: "nc__fill" }));
    for (var hx = PLOT.left + 5; hx < xAt(s.x); hx += 9) {
      var atX = X_MIN + ((hx - PLOT.left) / (PLOT.right - PLOT.left)) * (X_MAX - X_MIN);
      var topY = yAt(density(atX, s.mu, s.sigma));
      if (PLOT.base - topY < 2) { continue; }
      curveSvg.appendChild(svgNode("line", {
        x1: hx, y1: PLOT.base, x2: hx, y2: topY, class: "nc__hatch"
      }));
    }

    // The curve itself.
    curveSvg.appendChild(svgNode("path",
      { d: pathFrom(curvePoints(s.mu, s.sigma, X_MIN, X_MAX), false),
        class: "nc__curve" }));

    // The mean and the score.
    curveSvg.appendChild(svgNode("line", {
      x1: xAt(s.mu), y1: yAt(density(s.mu, s.mu, s.sigma)), x2: xAt(s.mu),
      y2: PLOT.base, class: "nc__mean"
    }));
    curveSvg.appendChild(svgNode("line", {
      x1: xAt(s.x), y1: PLOT.top, x2: xAt(s.x), y2: PLOT.base + 5,
      class: "nc__score"
    }));
    curveSvg.appendChild(svgText(
      { x: Math.min(xAt(s.x) + 5, PLOT.right - 2), y: PLOT.top + 10,
        "text-anchor": xAt(s.x) > PLOT.right - 90 ? "end" : "start" },
      "score " + s.x, "chart__label"));

    drawAxis(curveSvg, "raw score");
  }

  function renderCurveTables() {
    var s = settings();
    var z = (s.x - s.mu) / s.sigma;
    var below = phi(z);

    clear(curveTable);
    [
      ["Raw score", String(s.x)],
      ["z-score", fmt(z)],
      ["Area below (percentile)", pct(below)],
      ["Area above (upper tail)", pct(1 - below)]
    ].forEach(function (pair) { curveTable.appendChild(row(pair)); });

    clear(landmarkTable);
    [-2, -1, 0, 1, 2].forEach(function (zv) {
      landmarkTable.appendChild(row([
        (zv > 0 ? "+" : "") + zv.toFixed(1),
        fmt(s.mu + zv * s.sigma, 1),
        pct(phi(zv))
      ]));
    });
    standardNote.textContent =
      "Standardising does not change the distribution; it relabels the axis. " +
      "A z of +1 is a raw score of " + fmt(s.mu + s.sigma, 1) + " here and " +
      "would be something else on another test, and the area below it is " +
      "84.1% in both cases. That is what a z-score buys: comparable areas " +
      "across unrelated raw scales.";
  }

  function renderCurveReadout() {
    var s = settings();
    var z = (s.x - s.mu) / s.sigma;
    clear(readout);
    [
      ["z-score", fmt(z)],
      ["Percentile", ordinal(phi(z))],
      ["Area above", pct(1 - phi(z))],
      ["Peak height", fmt(density(s.mu, s.mu, s.sigma), 3)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderCurveVerdict() {
    var s = settings();
    var z = (s.x - s.mu) / s.sigma;
    var below = phi(z);
    var tone;
    var text;

    if (Math.abs(z) < 0.5) {
      tone = "neutral";
      text =
        "z = " + fmt(z) + ": thoroughly ordinary, at the " + ordinal(below) +
        " percentile. The raw score has not moved. Whether it counts as " +
        "ordinary is a statement about the distribution around it.";
    } else if (Math.abs(z) < 2) {
      tone = "caution";
      text =
        "z = " + fmt(z) + ": " + fmt(Math.abs(z)) + " standard deviations " +
        (z > 0 ? "above" : "below") + " the mean, at the " + ordinal(below) +
        " percentile, with " + pct(1 - below) + " above it. Three different " +
        "sentences about one score - say which one you mean.";
    } else {
      tone = "good";
      text =
        "z = " + fmt(z) + ". Only " + pct(z > 0 ? 1 - below : below) +
        " of this distribution lies further out in that direction, and " +
        pct(2 * (1 - phi(Math.abs(z)))) + " lies at least this far from the " +
        "mean in either direction. A one-tailed area is not a two-tailed one.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    if (s.band) {
      var area = 2 * phi(s.band) - 1;
      bandNote.textContent =
        "The highlighted region runs from " + fmt(s.mu - s.band * s.sigma, 1) +
        " to " + fmt(s.mu + s.band * s.sigma, 1) + " and contains " +
        pct(area) + " of the distribution. Now drag " + "μ" + " or " +
        "σ" + ". Those raw-score limits travel a long way; the percentage " +
        "does not. It belongs to the shape, not to this test.";
    } else {
      bandNote.textContent =
        "Choose a standard-deviation region in the last control to see the " +
        "68-95-99.7 figures as areas rather than as something to memorise.";
    }
  }

  function renderCurveAll() {
    var s = settings();
    chartHeading.textContent =
      "Normal curve, μ = " + s.mu + ", σ = " + s.sigma;
    renderCurve();
    renderCurveTables();
    renderCurveReadout();
    renderCurveVerdict();
  }

  curveShell.bindRange(muRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "mean of " + v; },
    onInput: renderCurveAll
  });

  curveShell.bindRange(sigmaRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "standard deviation of " + v; },
    onInput: renderCurveAll
  });

  curveShell.bindRange(xRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      var s = settings();
      return "raw score " + v + ", which is z equals " +
        fmt((v - s.mu) / s.sigma);
    },
    onInput: renderCurveAll
  });

  bandSelect.addEventListener("change", function () {
    renderCurveAll();
    var s = settings();
    curveShell.announce(s.band
      ? "Highlighting the mean plus or minus " + s.band + " standard " +
        "deviations, which contains " + pct(2 * phi(s.band) - 1) +
        " of the distribution."
      : "Highlight removed.", { immediate: true });
  });

  /* =======================================================================
     Experiment 2
     ===================================================================== */

  function compSettings() {
    return {
      muB: Number(muBRange.value),
      sigmaB: Number(sigmaBRange.value),
      x: Number(xBothRange.value)
    };
  }

  function renderTwoCurves() {
    var c = compSettings();
    clear(twoCurves);

    [[A_MU, A_SIGMA, "nc__curve", "Test A"],
     [c.muB, c.sigmaB, "nc__curve nc__curve--two", "Test B"]]
      .forEach(function (entry) {
        twoCurves.appendChild(svgNode("path", {
          d: pathFrom(curvePoints(entry[0], entry[1], X_MIN, X_MAX), false),
          class: entry[2]
        }));
        var peak = density(entry[0], entry[0], entry[1]);
        twoCurves.appendChild(svgText(
          { x: xAt(entry[0]), y: Math.max(PLOT.top + 10, yAt(peak) - 6),
            "text-anchor": "middle" }, entry[3], "chart__label"));
      });

    twoCurves.appendChild(svgNode("line", {
      x1: xAt(c.x), y1: PLOT.top, x2: xAt(c.x), y2: PLOT.base + 5,
      class: "nc__score"
    }));
    twoCurves.appendChild(svgText(
      { x: Math.min(xAt(c.x) + 5, PLOT.right - 2), y: PLOT.base - 6,
        "text-anchor": xAt(c.x) > PLOT.right - 90 ? "end" : "start" },
      "mark " + c.x, "chart__label"));

    drawAxis(twoCurves, "raw score on both tests");
  }

  function renderCompare() {
    var c = compSettings();
    var zA = (c.x - A_MU) / A_SIGMA;
    var zB = (c.x - c.muB) / c.sigmaB;

    compareHeading.textContent = revealed
      ? "Test A: z = " + fmt(zA) + "  |  Test B: z = " + fmt(zB)
      : "Two curves, one vertical line — z-scores hidden";
    renderTwoCurves();

    clear(compareTable);
    compareTable.appendChild(row([
      "Test A", String(A_MU), String(A_SIGMA),
      revealed ? fmt(zA) : "hidden",
      revealed ? ordinal(phi(zA)) : "hidden"
    ]));
    compareTable.appendChild(row([
      "Test B", String(c.muB), String(c.sigmaB),
      revealed ? fmt(zB) : "hidden",
      revealed ? ordinal(phi(zB)) : "hidden"
    ]));
  }

  function onCompareChange() {
    if (revealed) {
      // Changing the setup after a reveal invalidates the judgement, so the
      // answer is hidden again and the radios cleared.
      revealed = false;
      compareFeedback.hidden = true;
      $$('input[name="which"]', compShell.controls).forEach(function (input) {
        input.checked = false;
      });
    }
    renderCompare();
  }

  compShell.bindRange(muBRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "Test B has a mean of " + v; },
    onInput: onCompareChange
  });

  compShell.bindRange(sigmaBRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "Test B has a standard deviation of " + v; },
    onInput: onCompareChange
  });

  compShell.bindRange(xBothRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "a raw mark of " + v + " on both tests"; },
    onInput: onCompareChange
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    var picked = $('input[name="which"]:checked', compShell.controls);
    if (!picked) {
      compareError.textContent =
        "Choose which score is more unusual before revealing.";
      compareError.hidden = false;
      return;
    }
    compareError.hidden = true;
    revealed = true;
    renderCompare();

    var c = compSettings();
    var zA = (c.x - A_MU) / A_SIGMA;
    var zB = (c.x - c.muB) / c.sigmaB;
    var truth = Math.abs(Math.abs(zA) - Math.abs(zB)) < 0.15 ? "same"
      : Math.abs(zA) > Math.abs(zB) ? "a" : "b";
    var right = picked.value === truth;

    var lead = right ? "Yes." : "Not quite.";
    var body =
      "The same mark of " + c.x + " is z = " + fmt(zA) + " on Test A (mean " +
      A_MU + ", SD " + A_SIGMA + "), putting it at the " + ordinal(phi(zA)) +
      " percentile, and z = " + fmt(zB) + " on Test B (mean " + c.muB + ", SD " +
      c.sigmaB + "), putting it at the " + ordinal(phi(zB)) + ". " +
      (truth === "same"
        ? "The two are close enough to call level - which is worth noticing, " +
          "because the two tests look nothing alike."
        : "It is more unusual on Test " + truth.toUpperCase() + ".");
    showFeedback(compareFeedback, right ? "good" : "caution", lead, body);

    var note = make("p");
    note.appendChild(make("strong", null, "Both numbers are doing work. "));
    note.appendChild(document.createTextNode(
      "A lower mean pushes the same mark further out; a larger standard " +
      "deviation pulls it back in. Here the means differ by " +
      fmt(Math.abs(c.muB - A_MU), 0) + " points and the standard deviations by " +
      fmt(Math.abs(c.sigmaB - A_SIGMA), 0) + ", and it is the combination, not " +
      "either one, that decides. Press \"Set me a new pair\" and try again."));
    compareFeedback.appendChild(note);

    compShell.announce(lead + " " + body, { immediate: true });
  });

  $('[data-action="new-pair"]').addEventListener("click", function () {
    var random = mulberry32(pairSeed);
    pairSeed = Math.max(1, (pairSeed * 7 + 13) % 999983);
    var muB = 36 + Math.round(random() * 28);
    var sigmaB = 3 + Math.round(random() * 15);
    var x = Math.round(A_MU + (0.8 + random() * 1.8) * A_SIGMA);
    muBRange.value = String(muB);
    sigmaBRange.value = String(sigmaB);
    xBothRange.value = String(Math.min(100, Math.max(0, x)));
    [muBRange, sigmaBRange, xBothRange].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    revealed = false;
    compareFeedback.hidden = true;
    compareError.hidden = true;
    $$('input[name="which"]', compShell.controls).forEach(function (input) {
      input.checked = false;
    });
    renderCompare();
    compShell.announce(
      "New pair set. Test A still has a mean of " + A_MU + " and a standard " +
      "deviation of " + A_SIGMA + "; Test B now has a mean of " + muB +
      " and a standard deviation of " + sigmaB + ", and the shared mark is " +
      xBothRange.value + ". Commit before revealing.", { immediate: true });
  });

  function openCompare() {
    var wasHidden = compareSection.hidden;
    compareSection.hidden = false;
    renderCompare();
    if (wasHidden) {
      $("#compare-heading").focus();
      compShell.announce(
        "Experiment 2 opened. The z-scores stay hidden until you commit.",
        { immediate: true });
    }
  }

  $('[data-action="open-compare"]').addEventListener("click", openCompare);

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    sixteen: {
      tone: "caution",
      verdict: "That is the area beyond one standard deviation.",
      text:
        "70 is two standard deviations above 50, not one. About 15.9% lies " +
        "above 60; above 70 it is 2.3%. Set the score to 60 and then to 70 in " +
        "the experiment and watch the upper-tail figure change."
    },
    five: {
      tone: "caution",
      verdict: "The most instructive wrong answer on this page.",
      text:
        "5% is the area outside plus or minus two standard deviations - both " +
        "tails together. The question asked only about scores above 70, which " +
        "is one of those tails: 2.3%. Highlight mu plus or minus 2 sigma in " +
        "the experiment."
    },
    twohalf: {
      tone: "good",
      verdict: "Yes — 2.3%, to be exact.",
      text:
        "70 is z = 2.00, and the area above z = 2 is 2.28%. The familiar 5% " +
        "is the two-tailed version, covering scores below 30 as well. Keeping " +
        "those two apart is most of the arithmetic in this topic."
    },
    tiny: {
      tone: "caution",
      verdict: "That is the three-standard-deviation figure.",
      text:
        "About 0.13% lies above z = 3, which here would be a score of 80. " +
        "Above 70, which is z = 2, it is 2.3% - roughly seventeen times as " +
        "many people. Try both scores in the experiment."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openCurve() {
    curveSection.hidden = false;
    renderCurveAll();
    $("#curve-heading").focus();
    curveShell.announce(
      "Experiment 1 unlocked, showing the distribution from the prediction.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose a prediction before opening the experiment.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openCurve();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openCurve();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_NOTES = {
    median: {
      correct: true,
      text:
        "Correct. The normal curve is symmetric about its mean, so half the " +
        "area lies either side of z = 0. Note the qualifier: in a skewed " +
        "distribution the mean is not the median and this fails."
    },
    anydist: {
      correct: false,
      text:
        "Wrong, and it is the most common over-generalisation in this topic. " +
        "68.3% is a property of the normal curve. In a strongly skewed " +
        "distribution the figure can sit well above or below it."
    },
    seventy: {
      correct: false,
      text:
        "Wrong, because the statement is incomplete. 70 is z = 2.00 when the " +
        "mean is 50 and the SD is 10, and z = 0.00 when the mean is 70. Leave " +
        "the score at 70 in Experiment 1 and drag the mean: the percentile " +
        "travels the whole range."
    },
    shape: {
      correct: false,
      text:
        "Wrong. Subtracting a constant and dividing by a constant is a linear " +
        "change of units, and it leaves the shape exactly as it was. A skewed " +
        "variable standardises into an equally skewed variable. Standardising " +
        "is not normalising."
    },
    areaone: {
      correct: true,
      text:
        "Correct, and it is the reason the peak has to fall as sigma rises. " +
        "The curve cannot get wider without getting shorter, because the area " +
        "it encloses is fixed. Watch the peak-height figure while you drag " +
        "sigma."
    },
    twice: {
      correct: false,
      text:
        "Wrong. z counts standard deviations, not multiples of the mean. With " +
        "a mean of 50 and an SD of 10, z = 2 is a score of 70, not 100. The " +
        "confusion is worth naming because it survives into effect sizes, " +
        "where d is also counted in standard deviations."
    },
    peak: {
      correct: true,
      text:
        "Correct, and it follows directly from the total area being 1. The " +
        "peak height is exactly one over sigma times the square root of two " +
        "pi, so doubling sigma halves it."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one statement.",
        "Three of the seven are correct.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) {
      return !CHALLENGE_NOTES[v].correct;
    });
    var missed = ["median", "areaone", "peak"].filter(function (v) {
      return chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : missed.length ? "caution" : "good";
    var verdictText;
    if (wrongPicked.length) {
      verdictText = "At least one of these applies a property of the model to " +
        "everything, or reads a z-score as a multiple.";
    } else if (missed.length) {
      verdictText = "Everything you picked is right, and " + missed.length +
        " of the three correct statements is still unselected.";
    } else {
      verdictText = "Yes — all three correct statements and none of the four " +
        "traps.";
    }

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " The four incorrect statements are the four ways this topic usually " +
      "goes wrong in a results section."));
    challengeFeedback.appendChild(lead);

    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(CHALLENGE_NOTES[value].text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    curveShell.announce(verdictText, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  compShell.onReset(function () {
    revealed = false;
    muBRange.value = String(C_DEFAULTS.muB);
    sigmaBRange.value = String(C_DEFAULTS.sigmaB);
    xBothRange.value = String(C_DEFAULTS.x);
    $$('input[name="which"]', compShell.controls).forEach(function (input) {
      input.checked = false;
    });
    compareFeedback.hidden = true;
    compareError.hidden = true;
    pairSeed = 9021;
    renderCompare();
  });

  curveShell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    curveSection.hidden = true;
    compareSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    muRange.value = String(DEFAULTS.mu);
    sigmaRange.value = String(DEFAULTS.sigma);
    xRange.value = String(DEFAULTS.x);
    bandSelect.value = DEFAULTS.band;
    compShell.reset({ silent: true });
    renderCurveAll();
  });

  curveShell.reset({ silent: true });
  curveShell.announce(
    "Ready. Answer the prediction above to open Experiment 1.",
    { immediate: true });
})();
