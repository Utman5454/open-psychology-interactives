/* =========================================================================
   Confidence Interval Laboratory
   -------------------------------------------------------------------------
   Two staged experiments, each with its own controls and its own single
   primary picture, so that nothing on screen competes with the thing being
   manipulated.

   EXPERIMENT 1 — coverage
   -----------------------
   A simulated population has a true mean change of exactly TRUE_MEAN minutes
   of walking per day. Each "study" draws n observations from
   Normal(TRUE_MEAN, sigma) and reports

       interval = sample mean  +/-  z(level) * sigma / sqrt(n)

   Sigma is treated as KNOWN because the simulation states it, which is why
   the multiplier is a normal quantile rather than a t quantile. A real study
   estimates sigma from its own sample and uses t, which widens the interval
   at small n; that estimation is the subject of a later tool in this module,
   and the page says so in its limitations.

   Because sigma is known, every interval in a run has exactly the same width.
   That is pedagogically useful: the only thing that varies from study to
   study is where the interval sits, so the picture shows the intervals moving
   around a truth that does not.

   Nominal coverage is exact under this model, so about level% of the
   intervals contain TRUE_MEAN whatever n and sigma are. Changing n or sigma
   changes WIDTH; only the confidence level changes COVERAGE. Separating those
   two is the point of the experiment.

   EXPERIMENT 2 — precision against importance
   -------------------------------------------
   Four fictional trials, each a fixed reported mean and 95% interval. The
   learner sets a "smallest change that matters" threshold and classifies each
   interval into one of four patterns:

       lower limit >= threshold                 -> important
       upper limit >= threshold (but not above) -> inconclusive
       upper limit <  threshold, excludes zero  -> trivial but real
       upper limit <  threshold, includes zero  -> informative null

   The correct answer therefore depends on the threshold, which is exactly the
   teaching point: importance is a judgement supplied from outside the data.

   WHAT A CONFIDENCE INTERVAL IS NOT
   ---------------------------------
   The 95% is a property of the procedure across repeated samples. It is not
   the probability that this interval contains the parameter, not a range
   containing 95% of individuals, not a prediction interval for future means,
   and not a statement that values outside it have been ruled out.

   Randomness is seeded (mulberry32 with Box-Muller normals) so a run is
   reproducible. No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* The simulated population, and the multipliers for each offered level. */
  var TRUE_MEAN = 12.0;
  var Z = { 80: 1.2816, 90: 1.6449, 95: 1.9600, 99: 2.5758 };
  var MAX_ROWS = 100;    // intervals drawn in the caterpillar plot
  var RECENT_ROWS = 10;  // studies listed in the disclosure table

  var DEFAULTS = { n: 25, sd: 20, level: "95", seed: 2109, threshold: 10 };

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
    return value.toFixed(places === undefined ? 1 : places);
  }

  function row(cells, headerFirst) {
    var tr = make("tr");
    cells.forEach(function (cell, i) {
      if (i === 0 && headerFirst !== false) {
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

  var coverShell = InteractiveShell.attach("#coverage");
  var claimShell = InteractiveShell.attach("#claims");
  if (!coverShell || !claimShell) { return; }

  var nRange = $("#n-range");
  var sdRange = $("#sd-range");
  var levelSelect = $("#level-select");
  var seedInput = $("#seed-input");
  var chartHeading = $("[data-chart-heading]");
  var caterpillar = $("[data-caterpillar]");
  var outcomeTable = $("[data-outcome-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var recentTable = $("[data-recent-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var coverSection = $("#coverage-section");
  var claimsSection = $("#claims-section");

  var thresholdRange = $("#threshold-range");
  var claimHeading = $("[data-claim-heading]");
  var claimBrief = $("[data-claim-brief]");
  var claimChart = $("[data-claim-chart]");
  var claimTable = $("[data-claim-table]");
  var claimFeedback = $("[data-claim-feedback]");
  var claimError = $("[data-claim-error]");
  var allClaimsTable = $("[data-all-claims-table]");
  var checkButton = $('[data-action="check-claim"]');
  var nextButton = $('[data-action="next-claim"]');

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     Experiment 1 — repeated intervals
     ===================================================================== */

  var intervals = [];

  function settings() {
    return {
      n: Number(nRange.value),
      sd: Number(sdRange.value),
      level: Number(levelSelect.value)
    };
  }

  function halfWidth(s) {
    return Z[s.level] * s.sd / Math.sqrt(s.n);
  }

  function onDesignChange() {
    // Studies drawn under a different design belong to a different
    // procedure, so the pile is not comparable and is cleared.
    intervals = [];
    renderCoverage();
  }

  coverShell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " participants in each study"; },
    onInput: onDesignChange
  });

  coverShell.bindRange(sdRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return "population standard deviation " + v + " minutes";
    },
    onInput: onDesignChange
  });

  levelSelect.addEventListener("change", function () {
    onDesignChange();
    coverShell.announce(
      "Confidence level set to " + levelSelect.value +
      " per cent. The pile has been cleared, because those studies used a " +
      "different procedure.", { immediate: true });
  });

  function drawStudies(count) {
    var s = settings();
    var half = halfWidth(s);
    var seed = Math.max(1, Math.round(Number(seedInput.value) || 1));
    var random = mulberry32(seed + intervals.length * 7919);
    for (var i = 0; i < count; i += 1) {
      var sum = 0;
      for (var j = 0; j < s.n; j += 1) {
        sum += TRUE_MEAN + normal(random) * s.sd;
      }
      var mean = sum / s.n;
      var lo = mean - half;
      var hi = mean + half;
      intervals.push({ mean: mean, lo: lo, hi: hi, hit: lo <= TRUE_MEAN && TRUE_MEAN <= hi });
    }
  }

  function hitCount() {
    var hits = 0;
    intervals.forEach(function (iv) { if (iv.hit) { hits += 1; } });
    return hits;
  }

  function renderCaterpillar() {
    var left = 34;
    var right = 448;
    var top = 12;
    var base = 166;
    var s = settings();
    var half = halfWidth(s);
    var se = s.sd / Math.sqrt(s.n);
    // Wide enough for the most extreme sample mean plus a whole interval.
    var span = 3.4 * se + half;

    clear(caterpillar);

    var x = function (value) {
      return left + ((value - (TRUE_MEAN - span)) / (2 * span)) * (right - left);
    };

    var shown = intervals.slice(-MAX_ROWS);
    var slots = Math.max(shown.length, 8);
    var rowH = (base - top) / slots;
    var thickness = Math.max(1.2, Math.min(7, rowH * 0.55));

    shown.forEach(function (iv, i) {
      var y = top + (i + 0.5) * rowH;
      caterpillar.appendChild(svgNode("line", {
        x1: Math.max(left, x(iv.lo)), y1: y,
        x2: Math.min(right, x(iv.hi)), y2: y,
        "stroke-width": thickness,
        class: "ci__bar" + (iv.hit ? "" : " ci__bar--miss")
      }));
      // A cross drawn at the true value on the same row, so a miss is marked
      // by shape as well as by colour and dashing.
      if (!iv.hit) {
        var m = Math.max(2.4, Math.min(4, rowH * 0.5));
        caterpillar.appendChild(svgNode("line", {
          x1: x(TRUE_MEAN) - m, y1: y - m, x2: x(TRUE_MEAN) + m, y2: y + m,
          class: "ci__miss-mark"
        }));
        caterpillar.appendChild(svgNode("line", {
          x1: x(TRUE_MEAN) - m, y1: y + m, x2: x(TRUE_MEAN) + m, y2: y - m,
          class: "ci__miss-mark"
        }));
      }
    });

    // The truth, and the axis.
    caterpillar.appendChild(svgNode("line", {
      x1: x(TRUE_MEAN), y1: top - 6, x2: x(TRUE_MEAN), y2: base + 4,
      class: "ci__truth"
    }));
    caterpillar.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "ci__axis"
    }));

    var step = span > 20 ? 10 : span > 8 ? 5 : span > 4 ? 2 : 1;
    var start = Math.ceil((TRUE_MEAN - span) / step) * step;
    for (var v = start; v <= TRUE_MEAN + span; v += step) {
      caterpillar.appendChild(svgNode("line", {
        x1: x(v), y1: base, x2: x(v), y2: base + 4, class: "ci__axis"
      }));
      caterpillar.appendChild(svgText(
        { x: x(v), y: base + 17, "text-anchor": "middle" },
        String(Math.round(v * 10) / 10), "chart__axis"));
    }

    caterpillar.appendChild(svgText(
      { x: x(TRUE_MEAN), y: base + 33, "text-anchor": "middle" },
      "true mean " + fmt(TRUE_MEAN) + " minutes per day", "chart__label"));
  }

  function renderOutcomeTable() {
    var total = intervals.length;
    var hits = hitCount();
    clear(outcomeTable);
    [
      ["Contained the true mean", hits],
      ["Missed the true mean", total - hits]
    ].forEach(function (pair) {
      outcomeTable.appendChild(row([
        pair[0],
        String(pair[1]),
        total ? (100 * pair[1] / total).toFixed(1) + "%" : "—"
      ]));
    });
  }

  function renderReadout() {
    var s = settings();
    var total = intervals.length;
    var hits = hitCount();
    clear(readout);
    [
      ["Confidence level", s.level + "%"],
      ["Interval width", fmt(2 * halfWidth(s)) + " min"],
      ["Studies drawn", String(total)],
      ["Coverage so far", total ? (100 * hits / total).toFixed(1) + "%" : "—"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderRecent() {
    clear(recentTable);
    var recent = intervals.slice(-RECENT_ROWS);
    if (!recent.length) {
      var tr = make("tr");
      var td = make("td", null, "No studies drawn yet.");
      td.setAttribute("colspan", "4");
      tr.appendChild(td);
      recentTable.appendChild(tr);
      return;
    }
    recent.forEach(function (iv, i) {
      var number = intervals.length - recent.length + i + 1;
      recentTable.appendChild(row([
        "Study " + number,
        fmt(iv.mean),
        "[" + fmt(iv.lo) + ", " + fmt(iv.hi) + "]",
        iv.hit ? "Yes" : "No — missed"
      ]));
    });
  }

  function renderInterpretation() {
    var s = settings();
    var total = intervals.length;
    var hits = hitCount();
    var coverage = total ? 100 * hits / total : 0;
    var tone;
    var text;

    if (!total) {
      tone = "caution";
      text =
        "Nothing drawn yet. At " + s.n + " participants and a population " +
        "standard deviation of " + s.sd + ", every interval this procedure " +
        "produces will be " + fmt(2 * halfWidth(s)) + " minutes wide. Draw a " +
        "few studies one at a time and watch where they land.";
    } else if (total < 10) {
      tone = "neutral";
      text =
        total + (total === 1 ? " study" : " studies") + " drawn, " + hits +
        " of them containing the true mean of " + fmt(TRUE_MEAN) + ". With so " +
        "few, the running percentage is meaningless. The thing worth noticing " +
        "is that you can only tell which ones missed because the simulation " +
        "told you the truth first. A real research team sees one bar and has " +
        "no way of knowing which kind it is.";
    } else if (Math.abs(coverage - s.level) <= 6) {
      tone = "good";
      text =
        hits + " of " + total + " intervals contained the true mean: " +
        coverage.toFixed(1) + "% against a nominal " + s.level + "%. That is " +
        "what the confidence level is a statement about - the long-run " +
        "behaviour of the procedure, not the interval in front of you. Now " +
        "drag the sample size and watch: the bars change length, and this " +
        "percentage does not.";
    } else {
      tone = "caution";
      text =
        hits + " of " + total + " intervals contained the true mean: " +
        coverage.toFixed(1) + "% against a nominal " + s.level + "%. A gap " +
        "this size at " + total + " studies is ordinary sampling noise in the " +
        "coverage estimate itself - the count of hits is a random variable " +
        "too. Run more studies and it will settle towards " + s.level + "%.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);
  }

  function renderCoverage() {
    chartHeading.textContent = intervals.length
      ? intervals.length + " interval" + (intervals.length === 1 ? "" : "s") +
        " drawn" + (intervals.length > MAX_ROWS
          ? " (most recent " + MAX_ROWS + " shown)" : "")
      : "No studies drawn yet";
    renderCaterpillar();
    renderOutcomeTable();
    renderReadout();
    renderRecent();
    renderInterpretation();
  }

  $('[data-action="draw-one"]').addEventListener("click", function () {
    drawStudies(1);
    renderCoverage();
    var iv = intervals[intervals.length - 1];
    coverShell.announce(
      "Study " + intervals.length + ": sample mean " + fmt(iv.mean) +
      ", interval " + fmt(iv.lo) + " to " + fmt(iv.hi) + ". It " +
      (iv.hit ? "contains" : "misses") + " the true mean of " + fmt(TRUE_MEAN) +
      ".", { immediate: true });
  });

  $('[data-action="draw-hundred"]').addEventListener("click", function () {
    drawStudies(100);
    renderCoverage();
    var hits = hitCount();
    coverShell.announce(
      intervals.length + " intervals now drawn, " + hits + " of them " +
      "containing the true mean: " +
      (100 * hits / intervals.length).toFixed(1) + "% coverage against a " +
      "nominal " + settings().level + "%.", { immediate: true });
    openClaims();
  });

  $('[data-action="clear-pile"]').addEventListener("click", function () {
    intervals = [];
    renderCoverage();
    coverShell.announce("Pile cleared. The design is unchanged.",
      { immediate: true });
  });

  /* =======================================================================
     Experiment 2 — precision against importance
     ===================================================================== */

  /* Four invented trials. The numbers are chosen to occupy the four corners
     of the precision-by-importance space and are not estimates of anything. */
  var CLAIMS = [
    {
      name: "StepUp",
      n: 300,
      mean: 22.0, lo: 18.0, hi: 26.0,
      blurb: "A large trial of a reminder app, reporting a substantial change with narrow limits."
    },
    {
      name: "PaceMate",
      n: 2400,
      mean: 3.0, lo: 1.2, hi: 4.8,
      blurb: "A very large trial. The interval is nowhere near zero, and the write-up calls the result highly significant."
    },
    {
      name: "WalkWell",
      n: 18,
      mean: 14.0, lo: -6.0, hi: 34.0,
      blurb: "A small pilot. The interval includes zero, and the write-up concludes that the app did not work."
    },
    {
      name: "StrideAlong",
      n: 1900,
      mean: 0.5, lo: -1.5, hi: 2.5,
      blurb: "A large trial whose interval includes zero. The write-up reports a null result and stops there."
    }
  ];

  var VERDICT_LABEL = {
    important: "beats the threshold",
    trivial: "real but too small to matter",
    inconclusive: "too wide to decide",
    "null": "compatible with nothing worth having"
  };

  var claimIndex = 0;
  var claimChoice = null;   // the option checked when the verdict was last checked
  var claimChecked = false;

  function threshold() { return Number(thresholdRange.value); }

  /** The four patterns are mutually exclusive and exhaustive for lo < hi. */
  function classify(claim, t) {
    if (claim.lo >= t) { return "important"; }
    if (claim.hi >= t) { return "inconclusive"; }
    return claim.lo > 0 ? "trivial" : "null";
  }

  function renderClaimChart() {
    var left = 34;
    var right = 448;
    var top = 14;
    var mid = 54;
    var base = 92;
    var AXIS_LO = -16;
    var AXIS_HI = 40;
    var claim = CLAIMS[claimIndex];
    var t = threshold();

    clear(claimChart);

    var x = function (value) {
      return left + ((value - AXIS_LO) / (AXIS_HI - AXIS_LO)) * (right - left);
    };

    // The band of changes big enough to matter, tinted and hatched.
    var bandX = x(t);
    claimChart.appendChild(svgNode("rect", {
      x: bandX, y: top, width: Math.max(0, right - bandX), height: base - top,
      class: "claim__band"
    }));
    // 45-degree hatch, clipped analytically to the band so it never spills
    // past the edges of the region it is marking.
    var rise = base - top;
    for (var x0 = bandX - rise; x0 < right; x0 += 10) {
      var xa = Math.max(x0, bandX);
      var xb = Math.min(x0 + rise, right);
      if (xb - xa < 1) { continue; }
      claimChart.appendChild(svgNode("line", {
        x1: xa, y1: base - (xa - x0), x2: xb, y2: base - (xb - x0),
        class: "claim__hatch"
      }));
    }
    claimChart.appendChild(svgText(
      { x: Math.min(bandX + 5, right - 4), y: top + 11, "text-anchor": "start" },
      "worth having (" + t + "+)", "chart__label"));

    // Zero.
    claimChart.appendChild(svgNode("line", {
      x1: x(0), y1: top, x2: x(0), y2: base, class: "claim__zero"
    }));
    claimChart.appendChild(svgText(
      { x: x(0), y: base - 3, "text-anchor": "middle" },
      "no change", "chart__axis"));

    // The interval itself.
    claimChart.appendChild(svgNode("line", {
      x1: x(claim.lo), y1: mid, x2: x(claim.hi), y2: mid, class: "claim__interval"
    }));
    [claim.lo, claim.hi].forEach(function (v) {
      claimChart.appendChild(svgNode("line", {
        x1: x(v), y1: mid - 7, x2: x(v), y2: mid + 7, class: "claim__cap"
      }));
    });
    claimChart.appendChild(svgNode("circle", {
      cx: x(claim.mean), cy: mid, r: 5, class: "claim__point"
    }));

    claimChart.appendChild(svgText(
      { x: x(claim.lo), y: mid - 12, "text-anchor": "middle" },
      fmt(claim.lo), "chart__axis"));
    claimChart.appendChild(svgText(
      { x: x(claim.hi), y: mid - 12, "text-anchor": "middle" },
      fmt(claim.hi), "chart__axis"));

    // Axis.
    claimChart.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "ci__axis"
    }));
    for (var v2 = -10; v2 <= 40; v2 += 10) {
      claimChart.appendChild(svgNode("line", {
        x1: x(v2), y1: base, x2: x(v2), y2: base + 4, class: "ci__axis"
      }));
      claimChart.appendChild(svgText(
        { x: x(v2), y: base + 17, "text-anchor": "middle" },
        String(v2), "chart__axis"));
    }
    claimChart.appendChild(svgText(
      { x: (left + right) / 2, y: base + 33, "text-anchor": "middle" },
      "change in minutes walked per day", "chart__axis"));
  }

  function renderClaimTable() {
    var claim = CLAIMS[claimIndex];
    clear(claimTable);
    [
      ["Reported mean change", fmt(claim.mean)],
      ["Lower limit of the 95% interval", fmt(claim.lo)],
      ["Upper limit of the 95% interval", fmt(claim.hi)],
      ["Your threshold for a change worth having", fmt(threshold(), 0)]
    ].forEach(function (pair) {
      claimTable.appendChild(row(pair));
    });
  }

  function renderClaim() {
    var claim = CLAIMS[claimIndex];
    claimHeading.textContent =
      "Claim " + (claimIndex + 1) + " of " + CLAIMS.length + " — the " +
      claim.name + " trial, n = " + claim.n;
    claimBrief.textContent = claim.blurb;
    renderClaimChart();
    renderClaimTable();
  }

  function whyNot(chosen, claim, t) {
    if (chosen === "important") {
      return "The lower limit of " + fmt(claim.lo) + " is below your threshold " +
        "of " + t + ", so the interval does not sit entirely at or above it.";
    }
    if (chosen === "trivial") {
      if (claim.lo <= 0) {
        return "The interval reaches " + fmt(claim.lo) + ", so it does not rule " +
          "out no change at all.";
      }
      return "The upper limit of " + fmt(claim.hi) + " reaches your threshold " +
        "of " + t + ", so the interval is not entirely below it.";
    }
    if (chosen === "inconclusive") {
      return "Your threshold of " + t + " lies outside the interval [" +
        fmt(claim.lo) + ", " + fmt(claim.hi) + "], so the interval does not " +
        "straddle it. The study is precise enough to decide.";
    }
    if (claim.lo > 0) {
      return "The interval starts at " + fmt(claim.lo) + ", above zero, so it " +
        "is not compatible with no change.";
    }
    return "The upper limit of " + fmt(claim.hi) + " reaches your threshold of " +
      t + ", so a change worth having has not been ruled out.";
  }

  function explain(claim, t, category) {
    if (category === "important") {
      return "The whole interval, from " + fmt(claim.lo) + " to " +
        fmt(claim.hi) + ", sits at or above your threshold of " + t + ". The " +
        "data are hard to reconcile both with no change and with any change " +
        "too small to be worth having. This is the only one of the four " +
        "patterns that supports a recommendation, and note that it takes both " +
        "a decent effect and enough precision to get there.";
    }
    if (category === "trivial") {
      return "The interval excludes zero, so something is going on, and its " +
        "upper limit of " + fmt(claim.hi) + " is still below your threshold " +
        "of " + t + ". With n = " + claim.n + " the trial is precise enough to " +
        "establish both that the change is real and that it is too small to " +
        "matter. This is the case that separates statistical significance from " +
        "practical importance, and the two are separate questions in every " +
        "study, not only this one.";
    }
    if (category === "inconclusive") {
      return "The interval runs from " + fmt(claim.lo) + " to " + fmt(claim.hi) +
        ", and your threshold of " + t + " sits inside it. The data are " +
        "compatible with a change worth having and with one that is not" +
        (claim.lo <= 0 ? ", and with no change at all" : "") + ". The honest " +
        "conclusion is that this study cannot tell them apart - which is not " +
        "the same conclusion as nothing happened. A study reporting this and " +
        "concluding that the app failed has confused an absence of evidence " +
        "with evidence of absence.";
    }
    return "The interval includes zero and its upper limit of " + fmt(claim.hi) +
      " lies below your threshold of " + t + ". That is genuinely informative: " +
      "this study is precise enough to rule out anything worth having. Compare " +
      "it with the wide interval in the WalkWell trial. Both would be written " +
      "up as \"no significant effect\", and only one of them has actually " +
      "established something.";
  }

  function evaluateClaim(chosen) {
    var claim = CLAIMS[claimIndex];
    var t = threshold();
    var correct = classify(claim, t);
    var right = chosen === correct;

    var lead = right
      ? "Yes - " + VERDICT_LABEL[correct] + "."
      : "Not this one. The interval " + VERDICT_LABEL[correct] + ".";

    var p = showFeedback(claimFeedback, right ? "good" : "caution", lead,
      explain(claim, t, correct));

    if (!right) {
      var extra = make("p");
      extra.appendChild(make("strong", null, "Why your choice does not fit. "));
      extra.appendChild(document.createTextNode(whyNot(chosen, claim, t)));
      claimFeedback.appendChild(extra);
    }

    var note = make("p");
    note.appendChild(make("strong", null, "Move the threshold. "));
    note.appendChild(document.createTextNode(
      "The interval is fixed data; the threshold is a judgement you supplied. " +
      "Drag it and watch the correct verdict for this same finding change. " +
      "Nothing about the study has altered."));
    claimFeedback.appendChild(note);

    return { right: right, correct: correct, lead: lead, para: p };
  }

  claimShell.bindRange(thresholdRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return v + " minutes of extra walking per day counts as worth having";
    },
    onInput: function () {
      renderClaimChart();
      renderClaimTable();
      if (claimChecked && claimChoice) {
        // Re-mark against the new threshold: this is the demonstration, not a
        // side effect. The finding has not changed; the verdict may have.
        evaluateClaim(claimChoice);
      }
    }
  });

  checkButton.addEventListener("click", function () {
    var chosen = $('input[name="verdict"]:checked', claimShell.controls);
    if (!chosen) {
      claimError.textContent =
        "Choose one of the four verdicts before checking.";
      claimError.hidden = false;
      return;
    }
    claimError.hidden = true;
    claimChoice = chosen.value;
    claimChecked = true;
    var result = evaluateClaim(claimChoice);
    nextButton.disabled = claimIndex >= CLAIMS.length - 1;
    claimShell.announce(result.lead, { immediate: true });
    if (claimIndex >= CLAIMS.length - 1) {
      var done = make("p");
      done.appendChild(make("strong", null, "All four judged. "));
      done.appendChild(document.createTextNode(
        "Two of these trials excluded zero and two did not, and that split " +
        "does not line up with which of them said anything useful. Open " +
        "\"All four trials side by side\" and read them as a set."));
      claimFeedback.appendChild(done);
    }
  });

  nextButton.addEventListener("click", function () {
    if (claimIndex >= CLAIMS.length - 1) { return; }
    claimIndex += 1;
    claimChecked = false;
    claimChoice = null;
    claimFeedback.hidden = true;
    claimError.hidden = true;
    $$('input[name="verdict"]', claimShell.controls).forEach(function (input) {
      input.checked = false;
    });
    nextButton.disabled = true;
    renderClaim();
    claimShell.announce(
      "Claim " + (claimIndex + 1) + " of " + CLAIMS.length + ": the " +
      CLAIMS[claimIndex].name + " trial reported " + fmt(CLAIMS[claimIndex].mean) +
      " minutes, interval " + fmt(CLAIMS[claimIndex].lo) + " to " +
      fmt(CLAIMS[claimIndex].hi) + ".", { immediate: true });
  });

  function fillAllClaims() {
    clear(allClaimsTable);
    CLAIMS.forEach(function (claim) {
      allClaimsTable.appendChild(row([
        claim.name,
        String(claim.n),
        fmt(claim.mean),
        "[" + fmt(claim.lo) + ", " + fmt(claim.hi) + "]"
      ]));
    });
  }

  function resetClaims() {
    claimIndex = 0;
    claimChecked = false;
    claimChoice = null;
    thresholdRange.value = String(DEFAULTS.threshold);
    $$('input[name="verdict"]', claimShell.controls).forEach(function (input) {
      input.checked = false;
    });
    claimFeedback.hidden = true;
    claimError.hidden = true;
    nextButton.disabled = true;
    renderClaim();
  }

  claimShell.onReset(function () {
    resetClaims();
  });

  function openClaims() {
    if (!claimsSection.hidden) { return; }
    claimsSection.hidden = false;
    renderClaim();
    claimShell.announce(
      "Experiment 2 has opened below Experiment 1. Four fictional trials are " +
      "waiting to be judged.", { immediate: true });
  }

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    all: {
      tone: "caution",
      verdict: "No - and the reason matters.",
      text:
        "A procedure that caught the truth every time would have to produce " +
        "intervals wide enough to be useless. The confidence level is the " +
        "price list: 95% coverage buys a certain width, 99% buys a wider one, " +
        "and 100% would take you to minus infinity, plus infinity. Run the " +
        "hundred and count the misses."
    },
    ninetyfive: {
      tone: "good",
      verdict: "Yes, and the second half of that is the important half.",
      text:
        "About 95, whatever n is. Sample size changes how wide the intervals " +
        "are, not how often they catch the truth. Run the hundred, then drag " +
        "the sample size from 25 to 200 and watch which number moves."
    },
    depends: {
      tone: "caution",
      verdict: "The most instructive wrong answer here.",
      text:
        "Larger samples do give better studies - the intervals become much " +
        "narrower, which is a real gain in precision. But coverage is fixed by " +
        "the confidence level, not by n: a 95% procedure catches the truth " +
        "about 95% of the time whether its intervals are enormous or tiny. " +
        "Run the hundred at n = 25 and again at n = 200 and compare."
    },
    sixtyeight: {
      tone: "caution",
      verdict: "That is the one-standard-error interval, not this one.",
      text:
        "Sixty-eight per cent is roughly the coverage of mean plus or minus " +
        "one standard error. A 95% interval uses about 1.96 standard errors, " +
        "which is where the familiar factor comes from. Set the level to 80% " +
        "and then 99% and watch both the width and the coverage respond."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openCoverage() {
    coverSection.hidden = false;
    renderCoverage();
    $("#coverage-heading").focus();
    coverShell.announce(
      "Experiment 1 unlocked. No studies drawn yet.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose a prediction before opening the experiment.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openCoverage();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openCoverage();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_NOTES = {
    procedure: {
      correct: true,
      text:
        "Correct, and it is very nearly the whole of what the 95% means. The " +
        "guarantee attaches to the method across repeated samples from the " +
        "same model, which is why Experiment 1 has to run a hundred studies to " +
        "show it at all."
    },
    prob: {
      correct: false,
      text:
        "Wrong, though it is the phrasing almost everyone uses. Once the " +
        "sample is collected, the limits 1.2 and 8.4 are fixed numbers and the " +
        "population value is a fixed number: the interval either contains it " +
        "or it does not, and no probability is left to attach. A probability " +
        "statement about where the parameter lies is a credible interval, " +
        "which needs a prior that this method never supplies."
    },
    people: {
      correct: false,
      text:
        "Wrong, and this one is a change of subject rather than a subtlety. " +
        "The interval is about the population mean, not about individuals. " +
        "Individual changes here are far more variable than the mean; the " +
        "range containing 95% of people would be several times wider."
    },
    future: {
      correct: false,
      text:
        "Wrong. That describes a prediction interval for a future sample mean, " +
        "which is a different and wider quantity. Roughly 83% of future means " +
        "would land inside a 95% confidence interval, not 95%, because the " +
        "future mean carries its own sampling error on top of this one's."
    },
    important: {
      correct: false,
      text:
        "Wrong, and Experiment 2 is built around it. Excluding zero says the " +
        "data are hard to reconcile with exactly no change. Whether 4.8 extra " +
        "minutes of walking a day is worth anything is a judgement about " +
        "walking, and no interval can make it."
    },
    ruledout: {
      correct: false,
      text:
        "Wrong, though it is closer than the others. The interval collects the " +
        "values the data are reasonably compatible with under this model. A " +
        "value just outside it is only slightly less compatible than one just " +
        "inside; nothing has been ruled out, and the boundary is a convention " +
        "rather than a cliff."
    },
    width: {
      correct: true,
      text:
        "Correct. Width is proportional to one over the square root of n, so " +
        "a quarter of the sample gives roughly double the width. That is the " +
        "property Experiment 1 lets you drag - and note that it is a statement " +
        "about width alone, because coverage would still be about 95%."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution",
        "Select at least one statement.",
        "Two of the seven are correct.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) {
      return !CHALLENGE_NOTES[v].correct;
    });
    var rightMissed = ["procedure", "width"].filter(function (v) {
      return chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : rightMissed.length ? "caution" : "good";
    var verdictText;
    if (wrongPicked.length) {
      verdictText = "At least one of these attaches a probability to the " +
        "interval, changes the subject to individuals, or reads importance " +
        "off a boundary.";
    } else if (rightMissed.length) {
      verdictText = "Everything you picked is right, and you have missed one " +
        "of the two correct statements.";
    } else {
      verdictText = "Yes - both correct statements, and none of the five " +
        "misreadings.";
    }

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " Every one of the five incorrect statements appears regularly in " +
      "published papers and in textbooks, so recognising them matters more " +
      "than memorising a form of words."));
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
    coverShell.announce(verdictText, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  coverShell.onReset(function () {
    intervals = [];
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    coverSection.hidden = true;
    claimsSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    nRange.value = String(DEFAULTS.n);
    sdRange.value = String(DEFAULTS.sd);
    levelSelect.value = DEFAULTS.level;
    seedInput.value = String(DEFAULTS.seed);
    // Through the shell rather than directly, so the threshold slider's
    // <output> is re-synced along with the state behind it.
    claimShell.reset({ silent: true });
    renderCoverage();
  });

  fillAllClaims();
  coverShell.reset({ silent: true });
  coverShell.announce(
    "Ready. Answer the prediction above to open Experiment 1.",
    { immediate: true });
})();
