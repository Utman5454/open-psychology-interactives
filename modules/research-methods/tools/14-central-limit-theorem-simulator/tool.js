/* =========================================================================
   Central Limit Theorem Simulator
   -------------------------------------------------------------------------
   One picture, two panels, one shared value axis:

     upper panel  the POPULATION density, with the most recent SAMPLE drawn
                  as ticks along the axis beneath it;
     lower panel  the histogram of the MEANS of every sample drawn so far.

   Keeping those three objects visually distinct while sharing a scale is the
   whole design: it is the confusion between them that the theorem is usually
   taught through and rarely taught past.

   THE FOUR POPULATIONS
   --------------------
   Each is a mathematical distribution with exactly known moments, so the
   "predicted" column of the table is not an estimate:

     normal    Normal(50, 12)                      skew 0      ex. kurtosis 0
     skewed    20 + Exponential(mean 20)           skew 2      ex. kurtosis 6
     uniform   Uniform(20, 80)                     skew 0      ex. kurtosis -1.2
     bimodal   half Normal(30, 6), half Normal(70, 6)
                                                   skew 0      ex. kurtosis -1.683

   The bimodal figures come from its central moments: variance 20^2 + 6^2 =
   436, fourth central moment 20^4 + 6*20^2*36 + 3*6^4 = 250288, so the excess
   kurtosis is 250288/436^2 - 3.

   WHAT THE THEORY PREDICTS FOR THE MEAN OF n DRAWS
   ------------------------------------------------
       centre           = mu
       standard error   = sigma / sqrt(n)
       skewness         = population skewness / sqrt(n)
       excess kurtosis  = population excess kurtosis / n

   All four are shown beside the values measured in the simulation. The last
   two are what turns "n = 30 is enough" from a rule to memorise into
   something checkable: for the skewed population, thirty leaves a skewness of
   0.37, and for the bimodal population ten is already plenty.

   WHAT DOES NOT HAPPEN
   --------------------
   The data do not become normal. The upper panel never changes shape however
   large n gets; only the lower panel does. That distinction is the reason the
   page exists.

   Randomness is seeded (mulberry32, with Box-Muller normals and inverse-CDF
   exponentials). No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var BIN_COUNT = 45;
  var MAX_TICKS = 100;      // the sample size slider's maximum
  var DEFAULTS = { pop: "skewed", n: 25, seed: 7311, zoom: "shared" };

  var POPULATIONS = {
    normal: {
      label: "Normal", mu: 50, sigma: 12, skew: 0, exKurt: 0,
      axis: [8, 92],
      density: function (x) {
        var z = (x - 50) / 12;
        return Math.exp(-0.5 * z * z) / (12 * Math.sqrt(2 * Math.PI));
      },
      draw: function (random, normalDraw) { return 50 + normalDraw(random) * 12; },
      note: "A normal population. The sample mean is exactly normal at every n, " +
        "so there is nothing for the theorem to do."
    },
    skewed: {
      label: "Strongly right-skewed", mu: 40, sigma: 20, skew: 2, exKurt: 6,
      axis: [15, 145],
      density: function (x) {
        return x < 20 ? 0 : Math.exp(-(x - 20) / 20) / 20;
      },
      draw: function (random) { return 20 - 20 * Math.log(Math.max(random(), 1e-12)); },
      note: "A shifted exponential: most values small, a long right tail, " +
        "skewness exactly 2."
    },
    uniform: {
      label: "Uniform", mu: 50, sigma: 17.3205, skew: 0, exKurt: -1.2,
      axis: [8, 92],
      density: function (x) { return x >= 20 && x <= 80 ? 1 / 60 : 0; },
      draw: function (random) { return 20 + random() * 60; },
      note: "Every value between 20 and 80 equally likely. Nothing like a bell, " +
        "and the means are close to normal by n = 5."
    },
    bimodal: {
      label: "Bimodal", mu: 50, sigma: 20.8806, skew: 0, exKurt: -1.6832,
      axis: [8, 92],
      density: function (x) {
        var a = (x - 30) / 6;
        var b = (x - 70) / 6;
        return 0.5 * (Math.exp(-0.5 * a * a) + Math.exp(-0.5 * b * b)) /
          (6 * Math.sqrt(2 * Math.PI));
      },
      draw: function (random, normalDraw) {
        return (random() < 0.5 ? 30 : 70) + normalDraw(random) * 6;
      },
      note: "Two tight humps and nothing in the middle. At n = 2 the means are " +
        "trimodal; by n = 10 they are already close to normal."
    }
  };

  /* =======================================================================
     Seeded randomness
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

  var shell = InteractiveShell.attach("#clt");
  if (!shell) { return; }

  var popSelect = $("#pop-select");
  var nRange = $("#n-range");
  var seedInput = $("#seed-input");
  var zoomSelect = $("#zoom-select");
  var chartHeading = $("[data-chart-heading]");
  var cltSvg = $("[data-clt]");
  var theoryTable = $("[data-theory-table]");
  var popTable = $("[data-pop-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var convergence = $("[data-convergence]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var simSection = $("#sim-section");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var means = [];
  var lastSample = [];

  function population() { return POPULATIONS[popSelect.value]; }
  function sampleSize() { return Number(nRange.value); }

  /* =======================================================================
     Drawing samples
     ===================================================================== */

  function drawSamples(count) {
    var pop = population();
    var n = sampleSize();
    var seed = Math.max(1, Math.round(Number(seedInput.value) || 1));
    var random = mulberry32(seed + means.length * 7919);
    for (var s = 0; s < count; s += 1) {
      var values = [];
      var total = 0;
      for (var i = 0; i < n; i += 1) {
        var value = pop.draw(random, normal);
        values.push(value);
        total += value;
      }
      means.push(total / n);
      if (s === count - 1) { lastSample = values; }
    }
  }

  function moments(values) {
    if (values.length < 2) { return null; }
    var m = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
    var s2 = 0;
    var s3 = 0;
    var s4 = 0;
    values.forEach(function (v) {
      var d = v - m;
      s2 += d * d;
      s3 += d * d * d;
      s4 += d * d * d * d;
    });
    var variance = s2 / values.length;
    var sd = Math.sqrt(variance);
    return {
      mean: m,
      sd: Math.sqrt(s2 / (values.length - 1)),
      skew: sd > 0 ? (s3 / values.length) / Math.pow(sd, 3) : 0,
      exKurt: sd > 0 ? (s4 / values.length) / (variance * variance) - 3 : 0
    };
  }

  /* =======================================================================
     Drawing the picture
     ===================================================================== */

  function renderChart() {
    var pop = population();
    var n = sampleSize();
    var left = 38;
    var right = 448;
    var topBase = 96;     // baseline of the population panel
    var lowTop = 132;
    var lowBase = 210;    // baseline of the sample-means panel

    clear(cltSvg);

    var axisLo = pop.axis[0];
    var axisHi = pop.axis[1];
    var X = function (v) {
      return left + ((v - axisLo) / (axisHi - axisLo)) * (right - left);
    };

    /* --- Upper panel: the population ---------------------------------- */

    var peak = 0;
    var steps = 200;
    var points = [];
    for (var i = 0; i <= steps; i += 1) {
      var x = axisLo + (axisHi - axisLo) * (i / steps);
      var d = pop.density(x);
      if (d > peak) { peak = d; }
      points.push([x, d]);
    }
    var path = points.map(function (p, idx) {
      return (idx === 0 ? "M" : "L") + fmt(X(p[0]), 1) + " " +
        fmt(topBase - (p[1] / peak) * (topBase - 16), 1);
    }).join(" ");
    cltSvg.appendChild(svgNode("path", {
      d: "M" + fmt(X(axisLo), 1) + " " + topBase + " " + path.slice(1) +
        " L" + fmt(X(axisHi), 1) + " " + topBase + " Z",
      class: "clt__pop"
    }));
    cltSvg.appendChild(svgNode("line",
      { x1: left, y1: topBase, x2: right, y2: topBase, class: "clt__axis" }));
    cltSvg.appendChild(svgText(
      { x: left + 2, y: 24, "text-anchor": "start" },
      "population (" + pop.label.toLowerCase() + ")", "chart__label"));

    // The most recent sample, as ticks under the population axis.
    lastSample.slice(0, MAX_TICKS).forEach(function (v) {
      if (v < axisLo || v > axisHi) { return; }
      cltSvg.appendChild(svgNode("line", {
        x1: X(v), y1: topBase + 2, x2: X(v), y2: topBase + 12, class: "clt__tick"
      }));
    });
    if (lastSample.length) {
      cltSvg.appendChild(svgText(
        { x: right, y: topBase + 24, "text-anchor": "end" },
        "the most recent sample of " + lastSample.length, "chart__axis"));
    }

    cltSvg.appendChild(svgNode("line",
      { x1: left, y1: 116, x2: right, y2: 116, class: "clt__divide" }));

    /* --- Lower panel: the sample means -------------------------------- */

    var se = pop.sigma / Math.sqrt(n);
    var lo = axisLo;
    var hi = axisHi;
    if (zoomSelect.value === "zoom") {
      lo = pop.mu - 4.2 * se;
      hi = pop.mu + 4.2 * se;
    }
    var XL = function (v) {
      return left + ((v - lo) / (hi - lo)) * (right - left);
    };

    if (means.length) {
      var width = (hi - lo) / BIN_COUNT;
      var bins = [];
      for (var b = 0; b < BIN_COUNT; b += 1) { bins.push(0); }
      means.forEach(function (m) {
        var index = Math.floor((m - lo) / width);
        if (index >= 0 && index < BIN_COUNT) { bins[index] += 1; }
      });
      var tallest = Math.max.apply(null, bins.concat([1]));
      bins.forEach(function (count, index) {
        if (!count) { return; }
        var x0 = XL(lo + index * width);
        var x1 = XL(lo + (index + 1) * width);
        var h = (count / tallest) * (lowBase - lowTop);
        cltSvg.appendChild(svgNode("rect", {
          x: x0, y: lowBase - h, width: Math.max(1, x1 - x0 - 0.5), height: h,
          class: "clt__bar"
        }));
      });
    }

    cltSvg.appendChild(svgNode("line",
      { x1: XL(pop.mu), y1: lowTop - 6, x2: XL(pop.mu), y2: lowBase,
        class: "clt__mu" }));
    cltSvg.appendChild(svgText(
      { x: left + 2, y: lowTop - 6, "text-anchor": "start" },
      means.length
        ? "means of " + means.length + " samples of " + n
        : "means of samples of " + n + " — none drawn yet", "chart__label"));

    cltSvg.appendChild(svgNode("line",
      { x1: left, y1: lowBase, x2: right, y2: lowBase, class: "clt__axis" }));

    var step = (hi - lo) > 80 ? 20 : (hi - lo) > 30 ? 10 : (hi - lo) > 12 ? 5 :
      (hi - lo) > 5 ? 2 : 1;
    var first = Math.ceil(lo / step) * step;
    for (var v2 = first; v2 <= hi; v2 += step) {
      cltSvg.appendChild(svgNode("line",
        { x1: XL(v2), y1: lowBase, x2: XL(v2), y2: lowBase + 4, class: "clt__axis" }));
      cltSvg.appendChild(svgText(
        { x: XL(v2), y: lowBase + 16, "text-anchor": "middle" },
        String(Math.round(v2 * 10) / 10), "chart__axis"));
    }
    cltSvg.appendChild(svgText(
      { x: (left + right) / 2, y: lowBase + 32, "text-anchor": "middle" },
      zoomSelect.value === "zoom"
        ? "value — lower panel zoomed to the means, upper panel is not"
        : "value — both panels on the same scale", "chart__axis"));
  }

  function renderTables() {
    var pop = population();
    var n = sampleSize();
    var se = pop.sigma / Math.sqrt(n);
    var observed = moments(means);

    clear(theoryTable);
    [
      ["Centre", fmt(pop.mu, 1), observed ? fmt(observed.mean, 2) : "—"],
      ["Standard deviation (the standard error)", fmt(se, 2),
        observed ? fmt(observed.sd, 2) : "—"],
      ["Skewness", fmt(pop.skew / Math.sqrt(n)),
        observed ? fmt(observed.skew) : "—"],
      ["Excess kurtosis", fmt(pop.exKurt / n),
        observed ? fmt(observed.exKurt) : "—"]
    ].forEach(function (cells) { theoryTable.appendChild(row(cells)); });

    clear(popTable);
    [
      ["Shape", pop.label],
      ["Mean", fmt(pop.mu, 1)],
      ["Standard deviation", fmt(pop.sigma, 2)],
      ["Skewness", fmt(pop.skew)],
      ["Excess kurtosis", fmt(pop.exKurt)]
    ].forEach(function (cells) { popTable.appendChild(row(cells)); });
  }

  function renderReadout() {
    var pop = population();
    var n = sampleSize();
    var observed = moments(means);
    clear(readout);
    [
      ["Population mean", fmt(pop.mu, 1)],
      ["Mean of the means", observed ? fmt(observed.mean, 2) : "—"],
      ["Standard error, predicted", fmt(pop.sigma / Math.sqrt(n))],
      ["Spread of the means, observed", observed ? fmt(observed.sd) : "—"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderVerdict() {
    var pop = population();
    var n = sampleSize();
    var se = pop.sigma / Math.sqrt(n);
    var predictedSkew = pop.skew / Math.sqrt(n);
    var observed = moments(means);
    var tone;
    var text;

    if (!means.length) {
      tone = "caution";
      text =
        pop.note + " The theory says means of samples of " + n +
        " should sit around " + fmt(pop.mu, 1) + " with a standard deviation " +
        "of " + fmt(se) + " - " + fmt(pop.sigma / se, 1) + " times narrower " +
        "than the population above. Draw a few and watch.";
    } else if (means.length < 12) {
      tone = "neutral";
      text =
        means.length + (means.length === 1 ? " sample" : " samples") +
        " drawn so far. The ticks along the upper axis are what a real study " +
        "would collect; the whole of the lower panel is what a real study " +
        "never sees, because it contributes one mean and stops. The most " +
        "recent mean was " + fmt(means[means.length - 1], 2) + ".";
    } else {
      tone = "good";
      text =
        means.length + " sample means, each from a fresh sample of " + n +
        ". They are centred on " + fmt(observed.mean, 2) + " against a " +
        "population mean of " + fmt(pop.mu, 1) + ", and their spread is " +
        fmt(observed.sd) + " against a predicted standard error of " +
        fmt(se) + ". The centre is right whatever the population looks like, " +
        "and the spread is the population standard deviation divided by the " +
        "square root of " + n + ".";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var lines = [];
    if (Math.abs(predictedSkew) > 0.35) {
      lines.push(
        "Shape: the predicted skewness of the mean is " + fmt(predictedSkew) +
        " - the population's " + fmt(pop.skew) + " divided by the square root " +
        "of " + n + " - so this sampling distribution is still visibly " +
        "lopsided. Raising n is the only thing that fixes it, and it fixes it " +
        "slowly, at one over the square root of n.");
    } else if (Math.abs(pop.exKurt / n) > 0.3) {
      lines.push(
        "Shape: the predicted skewness is already " + fmt(predictedSkew) +
        ", but the excess kurtosis of the mean is still " + fmt(pop.exKurt / n) +
        ", so the sampling distribution is symmetric without yet being normal. " +
        "Symmetry arrives before normality.");
    } else {
      lines.push(
        "Shape: the predicted skewness of the mean is " + fmt(predictedSkew) +
        " and its excess kurtosis " + fmt(pop.exKurt / n) + ", both close " +
        "enough to zero that the sampling distribution is effectively normal " +
        "at this sample size - however little the population above resembles " +
        "one.");
    }
    lines.push(
      "Nothing about the upper panel has changed and nothing about it will. " +
      "The data are not becoming normal; the distribution of their mean is.");
    if (means.length >= 100) {
      lines.push(
        "One caveat on the last two rows of the table: the simulated skewness " +
        "and kurtosis use the ordinary sample formulae, which are biased " +
        "downwards, so expect the measured figures to sit a little below the " +
        "predicted ones even with a thousand means. The centre and the spread " +
        "have no such problem.");
    }
    convergence.textContent = lines.join(" ");
  }

  function render() {
    var pop = population();
    chartHeading.textContent = means.length
      ? means.length + " sample means from a " + pop.label.toLowerCase() +
        " population"
      : "No samples drawn yet";
    renderChart();
    renderTables();
    renderReadout();
    renderVerdict();
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  function invalidatePile() {
    // Means drawn under a different population or sample size belong to a
    // different sampling distribution, so the pile is cleared.
    means = [];
    lastSample = [];
    render();
  }

  shell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "samples of " + v + " observations each"; },
    onInput: invalidatePile
  });

  popSelect.addEventListener("change", function () {
    invalidatePile();
    shell.announce(
      "Population changed to " + population().label.toLowerCase() +
      ". The pile has been cleared, because those means came from a different " +
      "population.", { immediate: true });
  });

  zoomSelect.addEventListener("change", function () {
    render();
    shell.announce(
      zoomSelect.value === "zoom"
        ? "Lower panel zoomed to the means. The upper panel is unchanged, so " +
          "the two panels are no longer on the same scale."
        : "Both panels back on the same scale.", { immediate: true });
  });

  seedInput.addEventListener("change", invalidatePile);

  $('[data-action="draw-one"]').addEventListener("click", function () {
    drawSamples(1);
    render();
    var m = means[means.length - 1];
    shell.announce(
      "Sample " + means.length + " drawn: " + sampleSize() +
      " values with a mean of " + fmt(m, 2) + ". The population mean is " +
      fmt(population().mu, 1) + ".", { immediate: true });
  });

  $('[data-action="draw-many"]').addEventListener("click", function () {
    drawSamples(1000);
    render();
    var observed = moments(means);
    shell.announce(
      means.length + " sample means now in the pile, centred on " +
      fmt(observed.mean, 2) + " with a spread of " + fmt(observed.sd) +
      " against a predicted standard error of " +
      fmt(population().sigma / Math.sqrt(sampleSize())) + ".",
      { immediate: true });
  });

  $('[data-action="clear-pile"]').addEventListener("click", function () {
    means = [];
    lastSample = [];
    render();
    shell.announce("Pile cleared. The population and sample size are unchanged.",
      { immediate: true });
  });

  /* =======================================================================
     Opening predictions
     ===================================================================== */

  var TRUTH = { shape: "less", width: "narrower", centre: "mu" };

  var WHY = {
    shape:
      "Shape: less skewed. The skewness of the sample mean is the " +
      "population's skewness divided by the square root of n, so 2.00 becomes " +
      "2 over the square root of 25, which is 0.40. Less skewed, and not yet " +
      "symmetric - the familiar advice that thirty is enough is doing rather " +
      "less than people think here.",
    width:
      "Width: narrower, and by a lot. The standard error is 20 divided by the " +
      "square root of 25, which is 4.00 - one fifth of the population's " +
      "standard deviation. Averaging is what does this: extreme values in a " +
      "sample are diluted by the ordinary ones beside them.",
    centre:
      "Centre: on 40.0, the population mean. Sampling is unbiased, and the " +
      "skew of the population does not drag the means either way. This is the " +
      "part of the theorem that holds at every sample size, including n = 1."
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openSimulator() {
    simSection.hidden = false;
    render();
    $("#sim-heading").focus();
    shell.announce(
      "Simulator unlocked, showing the population from the predictions. No " +
      "samples drawn yet.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = {};
    var missing = false;
    ["shape", "width", "centre"].forEach(function (name) {
      var picked = $('input[name="' + name + '"]:checked', openingForm);
      if (!picked) { missing = true; } else { answers[name] = picked.value; }
    });
    if (missing) {
      openingError.textContent =
        "Answer all three questions before opening the simulator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var correct = ["shape", "width", "centre"].filter(function (name) {
      return answers[name] === TRUTH[name];
    }).length;
    var tone = correct === 3 ? "good" : correct >= 2 ? "caution" : "warn";
    var lead = correct === 3
      ? "All three."
      : correct + " of the three.";

    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", lead));
    p.appendChild(document.createTextNode(
      " Centre, spread and shape behave quite differently, and the theorem is " +
      "only really about the third."));
    openingFeedback.appendChild(p);
    var list = make("ul");
    ["centre", "width", "shape"].forEach(function (name) {
      var li = make("li");
      li.appendChild(make("strong", null,
        (answers[name] === TRUTH[name] ? "Correct. " : "Not quite. ")));
      li.appendChild(document.createTextNode(WHY[name]));
      list.appendChild(li);
    });
    openingFeedback.appendChild(list);
    openingFeedback.hidden = false;

    lockForm(openingForm);
    openSimulator();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Predictions skipped — demonstration mode.", "");
    lockForm(openingForm);
    openSimulator();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_NOTES = {
    means: {
      correct: true,
      text:
        "Correct, and it is the whole theorem. Note that it is a statement " +
        "about a distribution nobody observes: the spread of the mean across " +
        "repeated samples, which is what the lower panel simulates."
    },
    data: {
      correct: false,
      text:
        "Wrong, and it is the commonest version of this error. The upper panel " +
        "never changes shape however large n gets. If an analysis needs the " +
        "data to be roughly normal, a large sample does not supply that."
    },
    samesd: {
      correct: false,
      text:
        "Wrong. The sampling distribution is narrower by a factor of the " +
        "square root of n. With the skewed population at n = 25 the population " +
        "SD is 20.00 and the standard error is 4.00; look at the two panels on " +
        "the shared scale."
    },
    centred: {
      correct: true,
      text:
        "Correct, and this part holds at every sample size, including n = 1. " +
        "The skew of the population does not drag the means, because the " +
        "sample mean is an unbiased estimator whatever the shape."
    },
    thirty: {
      correct: false,
      text:
        "Wrong. Thirty is a rule of thumb, not a theorem, and the tool prints " +
        "the number that decides it: with the skewed population at n = 30 the " +
        "predicted skewness of the mean is still 0.37. For the bimodal " +
        "population, n = 10 is already ample. The right question is always " +
        "how far from normal the population is, not whether n has passed a " +
        "line."
    },
    onesample: {
      correct: false,
      text:
        "Wrong. The standard error is the standard deviation of the sampling " +
        "distribution - a property of the procedure across repeated samples. " +
        "It is estimated from one sample, which is a different thing from " +
        "being a property of it, and confusing the two is what makes the " +
        "standard error so hard to describe out loud."
    },
    quadruple: {
      correct: true,
      text:
        "Correct, and it is the most practically important line in the " +
        "theorem. Precision improves with the square root of n, so halving " +
        "the standard error costs four times the participants. Set n to 25 " +
        "and read the standard error, then set it to 100."
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
    var missed = ["means", "centred", "quadruple"].filter(function (v) {
      return chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : missed.length ? "caution" : "good";
    var verdictText;
    if (wrongPicked.length) {
      verdictText = "At least one of these attaches the theorem to the data " +
        "rather than to the mean.";
    } else if (missed.length) {
      verdictText = "Everything you picked is right, and " + missed.length +
        " of the three correct statements is still unselected.";
    } else {
      verdictText = "Yes — all three, and none of the four misreadings.";
    }

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " The four incorrect statements are the four ways the theorem is " +
      "usually misquoted in methods sections."));
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
    shell.announce(verdictText, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    means = [];
    lastSample = [];
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    simSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    popSelect.value = DEFAULTS.pop;
    nRange.value = String(DEFAULTS.n);
    seedInput.value = String(DEFAULTS.seed);
    zoomSelect.value = DEFAULTS.zoom;
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the three predictions above to open the simulator.",
    { immediate: true });
})();
