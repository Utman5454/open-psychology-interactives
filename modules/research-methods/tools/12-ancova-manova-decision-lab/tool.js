/* =========================================================================
   ANCOVA / MANOVA Decision Laboratory
   -------------------------------------------------------------------------
   Three parts: a role-assignment decision, a covariate-adjustment experiment
   and a two-outcome experiment, followed by four scenarios with the answer
   "neither" available.

   EXPERIMENT 1 — the covariate adjustment
   ---------------------------------------
   Two groups of 40 fictional students. The covariate (a September test) has
   standard deviation 10 and mean 50, shifted apart between the groups by the
   "group gap" slider. The outcome (a June test) is generated as

       june = 50 + b_g * (september - 50) + effect * (group ? 0.5 : -0.5) + e
       b_g  = r  +/-  slopeDifference / 2
       e    ~ Normal(0, 10 * sqrt(1 - r^2))

   so that with equal slopes the within-group correlation between covariate
   and outcome is r and both variables have standard deviation about 10.

   The tool then computes, from the generated sample:

       unadjusted difference = mean(june | B) - mean(june | A)
       pooled within-group slope b
       adjusted difference    = unadjusted - b * (mean(sept|B) - mean(sept|A))

   which is exactly the ANCOVA adjusted mean difference for a common-slope
   model. It also fits each group's own slope, so the
   homogeneity-of-regression-slopes assumption can be violated on purpose: the
   disclosure then reports the vertical gap between the two lines at a low,
   average and high covariate value, and those three numbers stop agreeing.

   The "how groups were formed" menu changes NOTHING in the arithmetic. It
   changes only what the adjusted number is allowed to mean, which is the
   honest state of affairs: neither the software nor the data can tell how the
   groups came about.

   EXPERIMENT 2 — two outcomes together
   -------------------------------------
   Two groups, two outcomes, standardised. With standardised group differences
   d1 and d2 and a within-group correlation rho, the multivariate separation
   between the group centres is the Mahalanobis distance

       D^2 = (d1^2 - 2*rho*d1*d2 + d2^2) / (1 - rho^2)

   which reduces to sqrt(d1^2 + d2^2) when rho = 0. Two facts follow, and both
   are drawn:

     * when the differences point the same way and rho is strongly positive,
       D is barely larger than the larger single d - the outcomes are one
       thing measured twice;
     * when the difference runs ACROSS the within-group correlation, D can be
       far larger than either d, so a multivariate test can find a separation
       that neither univariate test would.

   Neither fact makes a multivariate test a way of running several analyses
   without paying for them, and the page says so repeatedly.

   Randomness is seeded (mulberry32 with Box-Muller normals). No data leave
   the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var N_PER_GROUP = 40;
  var COV_MEAN = 50;
  var COV_SD = 10;
  var DEFAULTS = { r: 0.7, gap: 0, slope: 0, effect: 6, design: "random", seed: 8317 };
  var M_DEFAULTS = { d1: 0.4, d2: 0.4, rho: 0, seed: 4409 };

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

  function signed(value, places) {
    var p = places === undefined ? 1 : places;
    if (Math.abs(value) < Math.pow(10, -p) / 2) { return (0).toFixed(p); }
    return (value > 0 ? "+" : "−") + Math.abs(value).toFixed(p);
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

  function mean(values) {
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  /** Least-squares slope of y on x. */
  function slopeOf(x, y) {
    var mx = mean(x);
    var my = mean(y);
    var num = 0;
    var den = 0;
    for (var i = 0; i < x.length; i += 1) {
      num += (x[i] - mx) * (y[i] - my);
      den += (x[i] - mx) * (x[i] - mx);
    }
    return den === 0 ? 0 : num / den;
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

  var covShell = InteractiveShell.attach("#ancova");
  var manShell = InteractiveShell.attach("#manova");
  if (!covShell || !manShell) { return; }

  var rRange = $("#r-range");
  var gapRange = $("#gap-range");
  var slopeRange = $("#slope-range");
  var effectRange = $("#effect-range");
  var designSelect = $("#design-select");
  var chartHeading = $("[data-chart-heading]");
  var scatter = $("[data-scatter]");
  var groupTable = $("[data-group-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var assumption = $("[data-assumption]");
  var slopeNote = $("[data-slope-note]");
  var gapTable = $("[data-gap-table]");

  var d1Range = $("#d1-range");
  var d2Range = $("#d2-range");
  var rhoRange = $("#rho-range");
  var mpresetSelect = $("#mpreset-select");
  var mchartHeading = $("[data-mchart-heading]");
  var cloud = $("[data-cloud]");
  var sepTable = $("[data-sep-table]");
  var mverdictBox = $("[data-mverdict]");
  var minterpretation = $("[data-minterpretation]");
  var mcaveat = $("[data-mcaveat]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var ancovaSection = $("#ancova-section");
  var manovaSection = $("#manova-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var covSeed = DEFAULTS.seed;
  var manSeed = M_DEFAULTS.seed;
  var covData = null;
  var manData = null;
  var applyingPreset = false;

  /* =======================================================================
     Experiment 1 — data and analysis
     ===================================================================== */

  function covSettings() {
    return {
      r: Number(rRange.value),
      gap: Number(gapRange.value),
      slopeDiff: Number(slopeRange.value),
      effect: Number(effectRange.value)
    };
  }

  function buildCovData() {
    var s = covSettings();
    var random = mulberry32(covSeed);
    var residualSd = COV_SD * Math.sqrt(Math.max(0, 1 - s.r * s.r));
    var groups = [0, 1].map(function (g) {
      var sign = g === 1 ? 0.5 : -0.5;
      // Group A gets r - slopeDiff/2, group B gets r + slopeDiff/2, so the
      // average slope stays at r however far the two are pulled apart.
      var slope = s.r + (g === 1 ? 1 : -1) * s.slopeDiff / 2;
      var x = [];
      var y = [];
      for (var i = 0; i < N_PER_GROUP; i += 1) {
        var cov = COV_MEAN + sign * s.gap + normal(random) * COV_SD;
        x.push(cov);
        y.push(COV_MEAN + slope * (cov - COV_MEAN) + sign * s.effect +
          normal(random) * residualSd);
      }
      return { x: x, y: y, mx: mean(x), my: mean(y), slope: slopeOf(x, y) };
    });
    covData = { groups: groups };
  }

  function covStats() {
    var a = covData.groups[0];
    var b = covData.groups[1];
    var allX = a.x.concat(b.x);
    var grandX = mean(allX);
    var unadjusted = b.my - a.my;
    // Pooled within-group slope: the ANCOVA common-slope estimate.
    var num = 0;
    var den = 0;
    covData.groups.forEach(function (g) {
      for (var i = 0; i < g.x.length; i += 1) {
        num += (g.x[i] - g.mx) * (g.y[i] - g.my);
        den += (g.x[i] - g.mx) * (g.x[i] - g.mx);
      }
    });
    var pooled = den === 0 ? 0 : num / den;
    return {
      a: a, b: b, grandX: grandX,
      covGap: b.mx - a.mx,
      unadjusted: unadjusted,
      pooled: pooled,
      adjusted: unadjusted - pooled * (b.mx - a.mx),
      slopeDiff: b.slope - a.slope
    };
  }

  /** Vertical gap between the two fitted group lines at covariate value x. */
  function gapAt(t, x) {
    var lineA = t.a.my + t.a.slope * (x - t.a.mx);
    var lineB = t.b.my + t.b.slope * (x - t.b.mx);
    return lineB - lineA;
  }

  function renderScatter(t) {
    var left = 42;
    var right = 448;
    var top = 12;
    var base = 162;

    clear(scatter);

    var allX = t.a.x.concat(t.b.x);
    var allY = t.a.y.concat(t.b.y);
    var xLo = Math.min.apply(null, allX) - 2;
    var xHi = Math.max.apply(null, allX) + 2;
    var yLo = Math.min.apply(null, allY) - 2;
    var yHi = Math.max.apply(null, allY) + 2;

    var X = function (v) { return left + ((v - xLo) / (xHi - xLo)) * (right - left); };
    var Y = function (v) { return base - ((v - yLo) / (yHi - yLo)) * (base - top); };

    // Axes and ticks.
    scatter.appendChild(svgNode("line",
      { x1: left, y1: top, x2: left, y2: base, class: "sc__axis" }));
    scatter.appendChild(svgNode("line",
      { x1: left, y1: base, x2: right, y2: base, class: "sc__axis" }));
    [20, 40, 60, 80].forEach(function (v) {
      if (v < xLo || v > xHi) { return; }
      scatter.appendChild(svgNode("line",
        { x1: X(v), y1: base, x2: X(v), y2: base + 4, class: "sc__axis" }));
      scatter.appendChild(svgText(
        { x: X(v), y: base + 17, "text-anchor": "middle" },
        String(v), "chart__axis"));
      scatter.appendChild(svgNode("line",
        { x1: left - 4, y1: Y(v), x2: left, y2: Y(v), class: "sc__axis" }));
      scatter.appendChild(svgText(
        { x: left - 7, y: Y(v) + 4, "text-anchor": "end" },
        String(v), "chart__axis"));
    });

    // Points: filled circles for group A, hollow triangles for group B.
    t.a.x.forEach(function (v, i) {
      scatter.appendChild(svgNode("circle",
        { cx: X(v), cy: Y(t.a.y[i]), r: 2.6, class: "sc__dot-a" }));
    });
    t.b.x.forEach(function (v, i) {
      var cx = X(v);
      var cy = Y(t.b.y[i]);
      scatter.appendChild(svgNode("polygon", {
        points: (cx) + "," + (cy - 3.2) + " " + (cx - 3) + "," + (cy + 2.4) +
          " " + (cx + 3) + "," + (cy + 2.4),
        class: "sc__dot-b"
      }));
    });

    // Each group's own regression line, drawn across the plotted range.
    [["a", "sc__line-a", "Usual"], ["b", "sc__line-b", "Programme"]]
      .forEach(function (entry) {
        var g = t[entry[0]];
        var y1 = g.my + g.slope * (xLo - g.mx);
        var y2 = g.my + g.slope * (xHi - g.mx);
        scatter.appendChild(svgNode("line", {
          x1: X(xLo), y1: Y(y1), x2: X(xHi), y2: Y(y2), class: entry[1]
        }));
        scatter.appendChild(svgText(
          { x: right - 3, y: Math.max(top + 10, Math.min(base - 3, Y(y2) - 6)),
            "text-anchor": "end" },
          entry[2], "chart__label"));
      });

    // The vertical at the overall covariate mean, where the adjustment is read.
    var gx = X(t.grandX);
    scatter.appendChild(svgNode("line",
      { x1: gx, y1: top, x2: gx, y2: base, class: "sc__at" }));
    var ya = t.a.my + t.a.slope * (t.grandX - t.a.mx);
    var yb = t.b.my + t.b.slope * (t.grandX - t.b.mx);
    scatter.appendChild(svgNode("line",
      { x1: gx, y1: Y(ya), x2: gx, y2: Y(yb), class: "sc__gap" }));
    scatter.appendChild(svgText(
      { x: gx + 5, y: (Y(ya) + Y(yb)) / 2 + 4, "text-anchor": "start" },
      "adjusted " + signed(yb - ya), "chart__label"));

    scatter.appendChild(svgText(
      { x: (left + right) / 2, y: base + 34, "text-anchor": "middle" },
      "September score (the covariate)", "chart__axis"));
    scatter.appendChild(svgText(
      { x: left - 7, y: top - 2, "text-anchor": "end" },
      "June", "chart__axis"));
  }

  function renderCovTables(t) {
    clear(groupTable);
    groupTable.appendChild(row([
      "Usual timetable", fmt(t.a.mx), fmt(t.a.my), fmt(t.a.slope, 2)
    ]));
    groupTable.appendChild(row([
      "Programme", fmt(t.b.mx), fmt(t.b.my), fmt(t.b.slope, 2)
    ]));

    clear(gapTable);
    [
      ["A low starter", t.grandX - 12],
      ["The overall mean", t.grandX],
      ["A high starter", t.grandX + 12]
    ].forEach(function (entry) {
      gapTable.appendChild(row([
        entry[0], fmt(entry[1]), signed(gapAt(t, entry[1]))
      ]));
    });

    var spread = Math.abs(gapAt(t, t.grandX + 12) - gapAt(t, t.grandX - 12));
    slopeNote.textContent = spread < 1.5
      ? "The two fitted lines are close to parallel, so the gap between them " +
        "is about the same wherever you measure it. That is what the " +
        "homogeneity-of-regression-slopes assumption buys: one adjusted " +
        "difference, reportable as a single number."
      : "The two fitted lines are not parallel, so the gap between them is " +
        "a different number depending on where you stand - it moves by about " +
        fmt(spread) + " points across the range below. There is no single " +
        "adjusted difference to report here. The honest description is that " +
        "the effect of the programme depends on where a student started, " +
        "which is a covariate-by-treatment interaction and is a finding in " +
        "its own right.";
  }

  function renderCovReadout(t) {
    clear(readout);
    [
      ["Unadjusted difference", signed(t.unadjusted) + " pts"],
      ["Adjusted difference", signed(t.adjusted) + " pts"],
      ["Group gap on the covariate", signed(t.covGap) + " pts"],
      ["Pooled within-group slope", fmt(t.pooled, 2)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderCovVerdict(t) {
    var s = covSettings();
    var moved = Math.abs(t.adjusted - t.unadjusted);
    var intact = designSelect.value === "intact";
    var tone;
    var text;

    if (Math.abs(t.covGap) < 2.5) {
      tone = "good";
      text =
        "The two groups started in almost the same place - " + signed(t.covGap) +
        " points apart in September - so adjustment barely moves the estimate: " +
        signed(t.unadjusted) + " becomes " + signed(t.adjusted) + ". This is " +
        "the ordinary case under random allocation, and it is worth being " +
        "clear that the covariate is not earning its place by correcting " +
        "anything. It is earning it by explaining part of the variation in " +
        "June scores, which shrinks the residual variance and makes the " +
        "comparison more precise.";
    } else if (!intact) {
      tone = "caution";
      text =
        "The groups differ by " + signed(t.covGap) + " points on the covariate " +
        "even though allocation was random - which happens, and is exactly " +
        "the situation adjustment handles well. Adjusting moves the estimate " +
        "by " + fmt(moved) + " points, from " + signed(t.unadjusted) + " to " +
        signed(t.adjusted) + ", and because the groups were formed by chance " +
        "the adjusted figure is the better estimate of the programme's effect.";
    } else {
      tone = "warn";
      text =
        "The groups differ by " + signed(t.covGap) + " points on the covariate " +
        "and were not randomly formed. Adjustment moves the estimate by " +
        fmt(moved) + " points, from " + signed(t.unadjusted) + " to " +
        signed(t.adjusted) + ", and here that number is not the causal effect " +
        "of the programme. It is what the June difference looks like among " +
        "students who started at the same September score - a real quantity, " +
        "and one that equals the causal effect only if nothing else about " +
        "the two classes differs. Note that the arithmetic gave you no " +
        "warning: the same numbers appeared when allocation was random.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var spread = Math.abs(gapAt(t, t.grandX + 12) - gapAt(t, t.grandX - 12));
    var lines = [];
    if (Math.abs(s.slopeDiff) >= 0.15) {
      lines.push(
        "The two fitted slopes differ by " + fmt(t.slopeDiff, 2) +
        ", so the homogeneity-of-regression-slopes assumption fails and the " +
        "single adjusted figure above is an average of gaps that range over " +
        "about " + fmt(spread) + " points. Open the disclosure below.");
    }
    if (s.r < 0.2) {
      lines.push(
        "With a covariate-outcome correlation of only " + fmt(s.r, 2) +
        ", the covariate explains almost nothing and buys almost no " +
        "precision. Including a useless covariate costs a degree of freedom " +
        "and adds a paragraph nobody needs.");
    }
    if (!lines.length) {
      lines.push(
        "The slopes are close enough to parallel for a single adjusted " +
        "difference to be meaningful, and the covariate is correlated " +
        "strongly enough with the outcome to be worth including.");
    }
    assumption.textContent = lines.join(" ");
  }

  function renderCov() {
    var t = covStats();
    chartHeading.textContent =
      "September against June — " + (2 * N_PER_GROUP) + " fictional students";
    renderScatter(t);
    renderCovTables(t);
    renderCovReadout(t);
    renderCovVerdict(t);
    return t;
  }

  function refreshCov() {
    buildCovData();
    return renderCov();
  }

  covShell.bindRange(rRange, {
    format: function (v) { return v.toFixed(2); },
    describe: function (v) {
      return "covariate and outcome correlate " + v.toFixed(2) + " within groups";
    },
    onInput: refreshCov
  });

  covShell.bindRange(gapRange, {
    format: function (v) { return signed(v, 0); },
    describe: function (v) {
      return Math.abs(v) < 0.5
        ? "the two groups start level in September"
        : "the programme group starts " + signed(v, 0) +
          " points from the other group in September";
    },
    onInput: refreshCov
  });

  covShell.bindRange(slopeRange, {
    format: function (v) { return v.toFixed(2); },
    describe: function (v) {
      return Math.abs(v) < 0.03
        ? "the two groups have the same regression slope"
        : "the two regression slopes differ by " + v.toFixed(2);
    },
    onInput: refreshCov
  });

  covShell.bindRange(effectRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "true programme effect of " + v + " points"; },
    onInput: refreshCov
  });

  designSelect.addEventListener("change", function () {
    renderCov();
    covShell.announce(
      designSelect.value === "intact"
        ? "Design switched to two intact classes. Not one number on screen has " +
          "changed; what the adjusted difference is allowed to mean has."
        : "Design switched to random allocation. The arithmetic is identical " +
          "and the adjusted difference can now be read as the programme's " +
          "effect.", { immediate: true });
  });

  $('[data-action="resample"]').addEventListener("click", function () {
    covSeed = Math.max(1, (covSeed * 7 + 13) % 999983);
    var t = refreshCov();
    covShell.announce(
      "New sample drawn. Unadjusted difference " + signed(t.unadjusted) +
      " points, adjusted difference " + signed(t.adjusted) + " points.",
      { immediate: true });
  });

  /* =======================================================================
     Experiment 2 — two outcomes together
     ===================================================================== */

  var M_PRESETS = {
    nogain: { d1: 0.8, d2: 0.8, rho: 0.8,
      note: "Two clear effects in the same direction on two strongly related " +
        "outcomes. The joint separation is barely bigger than either one, " +
        "because the outcomes are largely the same information twice." },
    bigwin: { d1: 0.8, d2: 0.8, rho: -0.7,
      note: "The same two effects, with the outcomes negatively related within " +
        "groups. The difference now runs across the correlation, and the " +
        "joint separation is far larger than either." },
    hidden: { d1: 0.3, d2: -0.3, rho: 0.85,
      note: "Two small effects in opposite directions on outcomes that " +
        "normally move together. Neither would be found on its own; jointly " +
        "the two clouds barely overlap." },
    opposed: { d1: 0.6, d2: -0.6, rho: 0.0,
      note: "Effects in opposite directions with uncorrelated outcomes. The " +
        "joint separation is the ordinary Pythagorean combination: no bonus " +
        "and no penalty." }
  };

  function manSettings() {
    return {
      d1: Number(d1Range.value),
      d2: Number(d2Range.value),
      rho: Number(rhoRange.value)
    };
  }

  /** Mahalanobis distance between the two group centres. */
  function mahalanobis(s) {
    var denom = 1 - s.rho * s.rho;
    if (denom < 1e-6) { denom = 1e-6; }
    var d2 = (s.d1 * s.d1 - 2 * s.rho * s.d1 * s.d2 + s.d2 * s.d2) / denom;
    return Math.sqrt(Math.max(0, d2));
  }

  function buildManData() {
    var s = manSettings();
    var random = mulberry32(manSeed);
    var groups = [0, 1].map(function (g) {
      var sign = g === 1 ? 0.5 : -0.5;
      var pts = [];
      for (var i = 0; i < N_PER_GROUP; i += 1) {
        var z1 = normal(random);
        var z2 = normal(random);
        // Cholesky factor of [[1, rho], [rho, 1]].
        var y1 = z1;
        var y2 = s.rho * z1 + Math.sqrt(Math.max(0, 1 - s.rho * s.rho)) * z2;
        pts.push([y1 + sign * s.d1, y2 + sign * s.d2]);
      }
      return pts;
    });
    manData = groups;
  }

  function renderCloud() {
    var left = 42;
    var right = 448;
    var top = 12;
    var base = 156;
    var LIMIT = 3.6;

    clear(cloud);

    var X = function (v) { return left + ((v + LIMIT) / (2 * LIMIT)) * (right - left); };
    var Y = function (v) { return base - ((v + LIMIT) / (2 * LIMIT)) * (base - top); };

    cloud.appendChild(svgNode("line",
      { x1: left, y1: top, x2: left, y2: base, class: "sc__axis" }));
    cloud.appendChild(svgNode("line",
      { x1: left, y1: base, x2: right, y2: base, class: "sc__axis" }));
    [-3, -2, -1, 0, 1, 2, 3].forEach(function (v) {
      cloud.appendChild(svgNode("line",
        { x1: X(v), y1: base, x2: X(v), y2: base + 4, class: "sc__axis" }));
      cloud.appendChild(svgText(
        { x: X(v), y: base + 16, "text-anchor": "middle" },
        String(v), "chart__axis"));
      cloud.appendChild(svgNode("line",
        { x1: left - 4, y1: Y(v), x2: left, y2: Y(v), class: "sc__axis" }));
      cloud.appendChild(svgText(
        { x: left - 7, y: Y(v) + 4, "text-anchor": "end" },
        String(v), "chart__axis"));
    });

    manData[0].forEach(function (p) {
      cloud.appendChild(svgNode("circle",
        { cx: X(p[0]), cy: Y(p[1]), r: 2.6, class: "sc__dot-a" }));
    });
    manData[1].forEach(function (p) {
      var cx = X(p[0]);
      var cy = Y(p[1]);
      cloud.appendChild(svgNode("polygon", {
        points: cx + "," + (cy - 3.2) + " " + (cx - 3) + "," + (cy + 2.4) +
          " " + (cx + 3) + "," + (cy + 2.4),
        class: "sc__dot-b"
      }));
    });

    var s = manSettings();
    var ax = -s.d1 / 2;
    var ay = -s.d2 / 2;
    var bx = s.d1 / 2;
    var by = s.d2 / 2;
    cloud.appendChild(svgNode("line",
      { x1: X(ax), y1: Y(ay), x2: X(bx), y2: Y(by), class: "sc__gap" }));
    cloud.appendChild(svgText(
      { x: X(ax) - 5, y: Y(ay) - 6, "text-anchor": "end" },
      "Usual", "chart__label"));
    cloud.appendChild(svgText(
      { x: X(bx) + 5, y: Y(by) - 6, "text-anchor": "start" },
      "Programme", "chart__label"));

    cloud.appendChild(svgText(
      { x: (left + right) / 2, y: base + 32, "text-anchor": "middle" },
      "outcome 1, in standard deviations", "chart__axis"));
    cloud.appendChild(svgText(
      { x: left - 7, y: top - 2, "text-anchor": "end" },
      "outcome 2", "chart__axis"));
  }

  function renderMan() {
    var s = manSettings();
    var D = mahalanobis(s);
    var best = Math.max(Math.abs(s.d1), Math.abs(s.d2));

    mchartHeading.textContent =
      "The two groups in the plane — within-group correlation " + s.rho.toFixed(2);
    renderCloud();

    clear(sepTable);
    [
      ["Outcome 1 alone", fmt(Math.abs(s.d1), 2)],
      ["Outcome 2 alone", fmt(Math.abs(s.d2), 2)],
      ["Both together (Mahalanobis)", fmt(D, 2)]
    ].forEach(function (pair) {
      sepTable.appendChild(row(pair));
    });

    var ratio = best > 0.01 ? D / best : 0;
    var tone;
    var text;
    if (best < 0.05 && D < 0.1) {
      tone = "neutral";
      text =
        "Both differences are effectively zero, so there is nothing for any " +
        "test to find. Move one of the sliders.";
    } else if (ratio < 1.15) {
      tone = "caution";
      text =
        "Each outcome on its own separates the groups by about " + fmt(best, 2) +
        " standard deviations, and taking both together gives " + fmt(D, 2) +
        ". The multivariate test has added essentially nothing, and the reason " +
        "is on screen: with a within-group correlation of " + s.rho.toFixed(2) +
        " and differences pointing the same way, the second outcome is largely " +
        "the first one measured again. This is the case most people picture " +
        "when they reach for MANOVA, and it is the case where it helps least.";
    } else {
      tone = "good";
      text =
        "The better single outcome separates the groups by " + fmt(best, 2) +
        " standard deviations, and the two together separate them by " +
        fmt(D, 2) + " - " + fmt(ratio, 2) + " times as much. The difference " +
        "between the groups runs across the within-group correlation of " +
        s.rho.toFixed(2) + ", so the combination carries information neither " +
        "axis has on its own. Look at the plot: the two clouds are stretched " +
        "along one diagonal and separated along the other.";
    }
    minterpretation.textContent = text;
    mverdictBox.setAttribute("data-tone", tone);

    mcaveat.textContent =
      "Whatever the separation, note what a multivariate result does not say. " +
      "It says the group centres are apart in the plane. It does not say which " +
      "outcome differs, or in which direction, and the univariate tests that " +
      "follow it are ordinary tests carrying the ordinary multiplicity " +
      "problem - a significant multivariate test is not a licence that " +
      "protects them.";
  }

  function refreshMan() {
    buildManData();
    renderMan();
  }

  function onManChange() {
    if (applyingPreset) { return; }
    mpresetSelect.value = "custom";
    refreshMan();
  }

  manShell.bindRange(d1Range, {
    format: function (v) { return v.toFixed(2); },
    describe: function (v) {
      return "outcome 1 differs by " + v.toFixed(2) + " standard deviations";
    },
    onInput: onManChange
  });

  manShell.bindRange(d2Range, {
    format: function (v) { return v.toFixed(2); },
    describe: function (v) {
      return "outcome 2 differs by " + v.toFixed(2) + " standard deviations";
    },
    onInput: onManChange
  });

  manShell.bindRange(rhoRange, {
    format: function (v) { return v.toFixed(2); },
    describe: function (v) {
      return "the two outcomes correlate " + v.toFixed(2) + " within groups";
    },
    onInput: onManChange
  });

  mpresetSelect.addEventListener("change", function () {
    var preset = M_PRESETS[mpresetSelect.value];
    if (!preset) { return; }
    applyingPreset = true;
    d1Range.value = String(preset.d1);
    d2Range.value = String(preset.d2);
    rhoRange.value = String(preset.rho);
    [d1Range, d2Range, rhoRange].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    applyingPreset = false;
    refreshMan();
    manShell.announce(
      preset.note + " Joint separation " +
      fmt(mahalanobis(manSettings()), 2) + " standard deviations.",
      { immediate: true });
  });

  $('[data-action="mresample"]').addEventListener("click", function () {
    manSeed = Math.max(1, (manSeed * 7 + 13) % 999983);
    refreshMan();
    manShell.announce(
      "New sample drawn. The underlying differences and correlation are " +
      "unchanged; only which people were sampled has.", { immediate: true });
  });

  function openManova() {
    var wasHidden = manovaSection.hidden;
    manovaSection.hidden = false;
    refreshMan();
    if (wasHidden) {
      $("#manova-heading").focus();
      manShell.announce(
        "Experiment 2 opened. Try the worked examples in order.",
        { immediate: true });
    }
  }

  $('[data-action="open-manova"]').addEventListener("click", openManova);

  /* =======================================================================
     Opening decision
     ===================================================================== */

  var ROLE_TRUTH = { "role-june": "outcome", "role-group": "factor", "role-sept": "covariate" };

  var ROLE_WHY = {
    "role-june":
      "The June score is the outcome: it is measured after the manipulation " +
      "and it is what the question is about.",
    "role-group":
      "Programme against usual timetable is the grouping factor: it is what " +
      "was manipulated and what defines the comparison.",
    "role-sept":
      "The September score is a covariate: measured before allocation, so it " +
      "cannot have been affected by the programme, and correlated with the " +
      "outcome, so it can absorb variation that would otherwise be noise. " +
      "Both of those conditions matter, and the second scenario in the " +
      "challenge is about what happens when the first one fails."
  };

  var ANALYSIS_NOTES = {
    anova:
      "Defensible but wasteful. It answers the right question and throws away " +
      "the September data, so the comparison is less precise than it needs to " +
      "be. With a covariate-outcome correlation of 0.7 that is a substantial " +
      "loss.",
    ancova:
      "The best answer. Allocation was random, so the groups start level and " +
      "adjustment is not correcting anything; what it does is remove the part " +
      "of the June variation that September already explains, which makes the " +
      "estimate of the programme effect more precise. Experiment 1 shows both " +
      "halves of that.",
    manova:
      "Wrong, and instructively so. The September score is not an outcome: it " +
      "was measured before anybody was allocated to anything, so no group " +
      "difference on it could have been caused by the programme. Treating it " +
      "as a second dependent variable asks a question that makes no sense in " +
      "this design.",
    change:
      "Defensible, and usually second best. A t-test on June minus September " +
      "is exactly ANCOVA with the slope forced to 1. When the true " +
      "within-group slope is below 1 - which it usually is - forcing it costs " +
      "precision, and when the groups differ at baseline the change score and " +
      "the adjusted difference can disagree sharply. Set the covariate " +
      "correlation to 0.4 in Experiment 1 and look at the pooled slope."
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openAncova() {
    ancovaSection.hidden = false;
    challengeSection.hidden = false;
    refreshCov();
    $("#ancova-heading").focus();
    covShell.announce(
      "Experiment 1 unlocked, with the groups starting level and a covariate " +
      "correlation of 0.70.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var roles = {};
    var missing = false;
    Object.keys(ROLE_TRUTH).forEach(function (id) {
      var value = $("#" + id).value;
      if (!value) { missing = true; }
      roles[id] = value;
    });
    var analysis = $('input[name="analysis"]:checked', openingForm);
    if (missing || !analysis) {
      openingError.textContent =
        "Assign all three roles and choose an analysis before continuing.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var rolesRight = Object.keys(ROLE_TRUTH).filter(function (id) {
      return roles[id] === ROLE_TRUTH[id];
    }).length;
    var analysisRight = analysis.value === "ancova";

    var tone = analysisRight && rolesRight === 3 ? "good"
      : rolesRight >= 2 ? "caution" : "warn";
    var lead = analysisRight && rolesRight === 3
      ? "All three roles and the analysis."
      : rolesRight + " of the three roles, and the analysis you chose was " +
        (analysisRight ? "right." : "not the best fit.");

    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", lead));
    p.appendChild(document.createTextNode(
      " Roles first, because the analysis follows from them and not the other " +
      "way round."));
    openingFeedback.appendChild(p);

    var list = make("ul");
    Object.keys(ROLE_TRUTH).forEach(function (id) {
      var li = make("li");
      li.appendChild(make("strong", null,
        (roles[id] === ROLE_TRUTH[id] ? "Correct. " : "Not quite. ")));
      li.appendChild(document.createTextNode(ROLE_WHY[id]));
      list.appendChild(li);
    });
    var li2 = make("li");
    li2.appendChild(make("strong", null, "Your analysis. "));
    li2.appendChild(document.createTextNode(ANALYSIS_NOTES[analysis.value]));
    list.appendChild(li2);
    if (!analysisRight) {
      var li3 = make("li");
      li3.appendChild(make("strong", null, "The best answer, ANCOVA. "));
      li3.appendChild(document.createTextNode(ANALYSIS_NOTES.ancova));
      list.appendChild(li3);
    }
    openingFeedback.appendChild(list);
    openingFeedback.hidden = false;

    lockForm(openingForm);
    openAncova();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Decision skipped — demonstration mode.", "");
    lockForm(openingForm);
    openAncova();
  });

  /* =======================================================================
     Challenge — four scenarios
     ===================================================================== */

  var SCENARIOS = [
    {
      id: "q1", answer: "ancova-hedged",
      title: "Study 1, two intact classes",
      why:
        "ANCOVA can be computed and its output is perfectly valid arithmetic. " +
        "What it estimates is the June difference among students matched on " +
        "September, and that equals the causal effect of the programme only " +
        "if the two classes are alike in every other relevant way - which " +
        "nothing here establishes and the nine-point baseline gap actively " +
        "argues against. Report it as an adjusted association, name the " +
        "assumption, and say that the design cannot settle the causal " +
        "question. Experiment 1 makes the point by giving identical numbers " +
        "under both designs.",
      wrong: {
        ancova: "This is the common answer, and it is the misuse the whole " +
          "experiment is built around: the adjustment is real arithmetic and " +
          "the causal reading is an assumption smuggled in with it.",
        manova: "September is not an outcome - it was measured before anyone " +
          "was allocated - so it cannot be a dependent variable.",
        anova: "Ignoring a nine-point baseline gap does not make it go away; " +
          "the unadjusted difference confounds the programme with whatever " +
          "made the classes different in the first place."
      }
    },
    {
      id: "q2", answer: "manova",
      title: "Study 2, four reading measures",
      why:
        "This is what a multivariate test is for. The four outcomes are " +
        "argued in advance to be facets of one construct, the design is " +
        "randomised, and there is a single substantive question about reading " +
        "performance as a whole. The omnibus multivariate test answers it. " +
        "The word 'declared' matters: whatever follow-up univariate tests are " +
        "run must be stated in advance and reported whether or not they came " +
        "out well, because a significant multivariate result does not protect " +
        "them from multiplicity.",
      wrong: {
        four: "Four unadjusted tests answer four questions rather than the " +
          "one that was asked, and raise the chance of at least one false " +
          "positive well above the nominal level.",
        ancova: "Enjoyment is one of the outcomes. Adjusting one outcome for " +
          "another changes the question into something nobody asked.",
        neither: "The design is randomised and the outcomes are argued to " +
          "belong together in advance. That is exactly the case a " +
          "multivariate test was designed for."
      }
    },
    {
      id: "q3", answer: "neither",
      title: "Study 3, three unrelated outcomes",
      why:
        "The stated reason gives the game away. A multivariate test is not a " +
        "multiplicity correction, and a joint test of sleep, exam marks and " +
        "height answers a question with no substantive content - there is no " +
        "construct of which those three are facets. Run the analyses that " +
        "were planned, state how many there are, and handle the multiplicity " +
        "openly. That is the subject of the last tool in this module.",
      wrong: {
        manova: "It would run, and the result would mean nothing, because the " +
          "linear combination of the three outcomes that the test maximises " +
          "corresponds to no quantity anyone cares about.",
        ancova: "Height is an outcome here, not a covariate, and adjusting " +
          "one outcome for another is not what a covariate is.",
        combine: "A composite of unrelated measurements is not a measure of " +
          "anything. Combining is a substantive claim about what the items " +
          "share, and there is no such claim available here."
      }
    },
    {
      id: "q4", answer: "neither",
      title: "Study 4, the covariate measured afterwards",
      why:
        "Attendance was measured after allocation and is plausibly a " +
        "consequence of the programme - possibly part of how it works. " +
        "Adjusting for it removes part of the effect being estimated and can " +
        "introduce bias even in a randomised trial, because conditioning on a " +
        "variable that sits between cause and outcome opens paths that " +
        "randomisation had closed. A covariate has to be measured before the " +
        "manipulation, or be demonstrably unaffected by it.",
      wrong: {
        ancova: "This is the mistake. The phrase 'control for engagement' " +
          "describes controlling for part of the treatment.",
        manova: "Attendance is not a second outcome of interest; treating it " +
          "as one does not repair the underlying problem.",
        both: "Reporting both is better than hiding one, and it still leaves " +
          "a reader with two numbers and no principled basis for choosing. " +
          "The adjusted analysis should not have been run."
      }
    }
  ];

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = SCENARIOS.map(function (s) { return $("#" + s.id).value; });
    if (chosen.some(function (v) { return !v; })) {
      challengeError.textContent = "Choose an analysis for all four studies.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = SCENARIOS.filter(function (s, i) {
      return chosen[i] === s.answer;
    }).length;
    var tone = right === 4 ? "good" : right >= 2 ? "caution" : "warn";
    var lead = right + " of the four.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", lead));
    p.appendChild(document.createTextNode(
      " Two of these four have the answer \"neither\", which is the honest " +
      "answer more often than the published literature suggests."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    SCENARIOS.forEach(function (s, i) {
      var li = make("li");
      li.appendChild(make("strong", null,
        s.title + " — " + (chosen[i] === s.answer ? "correct. " : "not this one. ")));
      if (chosen[i] !== s.answer && s.wrong[chosen[i]]) {
        li.appendChild(document.createTextNode(s.wrong[chosen[i]] + " "));
      }
      li.appendChild(document.createTextNode(s.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    covShell.announce(lead + " Explanations are below each study.",
      { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  manShell.onReset(function () {
    applyingPreset = true;
    d1Range.value = String(M_DEFAULTS.d1);
    d2Range.value = String(M_DEFAULTS.d2);
    rhoRange.value = String(M_DEFAULTS.rho);
    applyingPreset = false;
    mpresetSelect.value = "custom";
    manSeed = M_DEFAULTS.seed;
    refreshMan();
  });

  covShell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    ancovaSection.hidden = true;
    manovaSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    rRange.value = String(DEFAULTS.r);
    gapRange.value = String(DEFAULTS.gap);
    slopeRange.value = String(DEFAULTS.slope);
    effectRange.value = String(DEFAULTS.effect);
    designSelect.value = DEFAULTS.design;
    covSeed = DEFAULTS.seed;
    manShell.reset({ silent: true });
    refreshCov();
  });

  covShell.reset({ silent: true });
  covShell.announce(
    "Ready. Assign the three roles above and choose an analysis.",
    { immediate: true });
})();
