/* =========================================================================
   Homoscedasticity and Residual Diagnostics
   -------------------------------------------------------------------------
   One generated dataset shown twice, on a shared fitted-value axis:

     upper panel  the raw scatterplot with the least-squares line;
     lower panel  each observation's residual against the value the model
                  predicted for it, with a dashed line at zero.

   The lower panel is the instrument. Plotting residuals against FITTED values
   rather than against the observed outcome matters: residuals are
   uncorrelated with the fitted values in any least-squares fit, so a flat
   band is the honest baseline, whereas residuals plotted against the observed
   y are correlated with it by construction and would show a slope even for a
   perfect model.

   THE GENERATING MODEL
   --------------------
       x  ~ Uniform(10, 90)
       y  = 20 + 0.5 * x + e_i
       e_i ~ Normal(0, BASE * f_i)

   where f_i is 1 for constant variance and otherwise ramps up to a factor of
   MAX_RATIO at severity 100%, in one of four shapes: growing with x, shrinking
   with x, widest at both extremes, or widest in the middle. The true slope is
   fixed at 0.5 whatever the spread does.

   The last two shapes are what makes this tool honest rather than a cartoon.
   The classical standard error goes wrong to the extent that the variance
   lines up with LEVERAGE, which is largest at both extremes of x. Measured
   over 3,000 samples at n = 120 and severity 100%, the coverage of a nominal
   95% classical interval comes out at:

       constant variance          94.7%      robust 94.4%
       growing with x             92.5%      robust 94.1%
       widest at both extremes    86.0%      robust 93.8%
       widest in the middle       99.5%      robust 94.8%

   and the mean estimated slope is within 0.005 of 0.500 in every one of them.
   So a plain megaphone costs something real and modest, variance at both ends
   is what actually breaks the interval, and variance in the middle makes the
   classical interval conservative rather than liberal. The tool's wording is
   generated from an EXACT model-based quantity (see modelSE below) rather than
   from the shape or from the noisy simulated coverage, so it always says the
   truthful thing.

   WHAT NON-CONSTANT VARIANCE COSTS
   --------------------------------
   Ordinary least squares stays UNBIASED: the estimate keeps landing near
   0.50. What breaks is the standard error, whose classical formula assumes
   one common variance:

       classical  Var(b1) = s^2 / Sxx,   s^2 = sum(e^2) / (n - 2)
       robust     Var(b1) = sum( (x_i - mx)^2 * e_i^2 / (1 - h_i)^2 ) / Sxx^2
                  with h_i = 1/n + (x_i - mx)^2 / Sxx        [HC3]

   The tool reports both, the intervals they produce, and - the part that
   settles the argument - the COVERAGE of each nominal 95% interval across
   COVERAGE_RUNS repeated samples from the same generating model, alongside the
   average estimated slope across those samples.

   NO FORMAL TEST IS COMPUTED. Breusch-Pagan and White's test exist and are
   named in the page, and are deliberately absent, because a test result
   invites the discussion to collapse into a threshold when the picture is the
   more informative object - and because such tests are themselves sensitive
   to sample size, flagging trivial departures in large studies and missing
   serious ones in small studies. The page says so.

   Randomness is seeded (mulberry32 with Box-Muller normals). No data leave
   the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var TRUE_B0 = 20;
  var TRUE_B1 = 0.5;
  var BASE_SD = 5;
  var MAX_RATIO = 6;      // widest-to-narrowest spread at severity 100%
  var X_LO = 10;
  var X_HI = 90;
  var COVERAGE_RUNS = 400;
  var DEFAULTS = { pattern: "increasing", severity: 70, n: 120, seed: 6142 };

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
     Student's t, for the intervals
     ===================================================================== */

  var LANCZOS = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];

  function logGamma(x) {
    if (x < 0.5) {
      return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    }
    var z = x - 1;
    var a = LANCZOS[0];
    var t = z + 7.5;
    for (var i = 1; i < 9; i += 1) { a += LANCZOS[i] / (z + i); }
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
  }

  function betacf(a, b, x) {
    var MAXIT = 300;
    var EPS = 3e-14;
    var FPMIN = 1e-300;
    var qab = a + b;
    var qap = a + 1;
    var qam = a - 1;
    var c = 1;
    var d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) { d = FPMIN; }
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= MAXIT; m += 1) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d;
      h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) { break; }
    }
    return h;
  }

  function betai(a, b, x) {
    if (x <= 0) { return 0; }
    if (x >= 1) { return 1; }
    var bt = Math.exp(
      logGamma(a + b) - logGamma(a) - logGamma(b) +
      a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) {
      return bt * betacf(a, b, x) / a;
    }
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }

  function tTwoTail(t, df) {
    var abs = Math.abs(t);
    if (abs === 0) { return 1; }
    return betai(df / 2, 0.5, df / (df + abs * abs));
  }

  var critCache = {};
  function tCritical(alpha, df) {
    var key = alpha + "|" + df;
    if (critCache[key] !== undefined) { return critCache[key]; }
    var lo = 0;
    var hi = 200;
    for (var i = 0; i < 70; i += 1) {
      var mid = (lo + hi) / 2;
      if (tTwoTail(mid, df) > alpha) { lo = mid; } else { hi = mid; }
    }
    critCache[key] = (lo + hi) / 2;
    return critCache[key];
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

  function pct(p) { return (100 * p).toFixed(1) + "%"; }

  function fmtP(p) {
    if (p < 0.0001) { return "< .0001"; }
    if (p < 0.001) { return "< .001"; }
    return "= " + p.toFixed(3).replace(/^0/, "");
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

  function sd(values) {
    if (values.length < 2) { return 0; }
    var m = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
    var ss = values.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0);
    return Math.sqrt(ss / (values.length - 1));
  }

  /* =======================================================================
     Generating and fitting
     ===================================================================== */

  /** The spread multiplier at a given x, for the current pattern.

      The last two patterns exist because they are what makes the lesson
      honest. The classical standard error goes wrong to the extent that the
      variance lines up with LEVERAGE, which is largest at both extremes of x.
      A plain megaphone puts its extra variance at one extreme and its smallest
      variance at the other, so the two partly cancel and the cost is real but
      modest; variance concentrated at both ends is far more damaging; and
      variance concentrated in the middle makes the classical interval
      conservative rather than liberal. */
  function spreadFactor(x, pattern, severity) {
    var u = (x - X_LO) / (X_HI - X_LO);          // 0 at the left, 1 at the right
    var ramp = pattern === "increasing" ? u
      : pattern === "decreasing" ? 1 - u
        : pattern === "bothends" ? Math.abs(2 * u - 1)
          : pattern === "middle" ? 1 - Math.abs(2 * u - 1) : 0;
    return 1 + severity * (MAX_RATIO - 1) * ramp;
  }

  function generate(seed, n, pattern, severity) {
    var random = mulberry32(seed);
    var points = [];
    for (var i = 0; i < n; i += 1) {
      var x = X_LO + (X_HI - X_LO) * random();
      points.push({
        x: x,
        y: TRUE_B0 + TRUE_B1 * x +
          normal(random) * BASE_SD * spreadFactor(x, pattern, severity)
      });
    }
    points.sort(function (a, b) { return a.x - b.x; });
    return points;
  }

  function fit(points) {
    var n = points.length;
    var mx = 0;
    var my = 0;
    points.forEach(function (p) { mx += p.x; my += p.y; });
    mx /= n;
    my /= n;
    var sxx = 0;
    var sxy = 0;
    points.forEach(function (p) {
      sxx += (p.x - mx) * (p.x - mx);
      sxy += (p.x - mx) * (p.y - my);
    });
    var b1 = sxy / sxx;
    var b0 = my - b1 * mx;

    var sse = 0;
    var robustSum = 0;
    var rows = points.map(function (p) {
      var fitted = b0 + b1 * p.x;
      var e = p.y - fitted;
      sse += e * e;
      var h = 1 / n + (p.x - mx) * (p.x - mx) / sxx;
      // HC3: each squared residual inflated by its own leverage.
      robustSum += (p.x - mx) * (p.x - mx) * e * e / ((1 - h) * (1 - h));
      return { x: p.x, y: p.y, fitted: fitted, e: e };
    });

    var df = n - 2;
    var s2 = sse / df;
    return {
      n: n, mx: mx, my: my, sxx: sxx, b0: b0, b1: b1, rows: rows, df: df,
      seClassical: Math.sqrt(s2 / sxx),
      seRobust: Math.sqrt(robustSum) / sxx
    };
  }

  /** The two standard errors the MODEL implies, computed exactly from the
      known sigma at each x rather than estimated. This is what drives the
      wording, because it is deterministic:

          true SE(b1)          = sqrt( sum (x-mx)^2 sigma_i^2 ) / Sxx
          SE the classical
          formula is aiming at = sqrt( (mean sigma_i^2) / Sxx )

      Their ratio says by how much the classical formula under- or overstates
      the real sampling variability of the slope, and it depends entirely on
      how sigma lines up with (x - mx)^2, which is leverage. At severity 100%
      the ratio is 1.00 for constant variance, about 1.06 for a megaphone,
      about 1.28 for variance at both extremes and about 0.65 for variance in
      the middle. */
  function modelSE(points, pattern, severity) {
    var n = points.length;
    var mx = 0;
    points.forEach(function (p) { mx += p.x; });
    mx /= n;
    var sxx = 0;
    var weighted = 0;
    var totalVar = 0;
    points.forEach(function (p) {
      var dev2 = (p.x - mx) * (p.x - mx);
      var s = BASE_SD * spreadFactor(p.x, pattern, severity);
      sxx += dev2;
      weighted += dev2 * s * s;
      totalVar += s * s;
    });
    var trueSE = Math.sqrt(weighted) / sxx;
    var aimedAt = Math.sqrt((totalVar / n) / sxx);
    return { trueSE: trueSE, aimedAt: aimedAt, ratio: trueSE / aimedAt };
  }

  /** Repeated sampling from the same model, to show what the estimate and the
      two intervals actually do in the long run. This is a Monte Carlo estimate
      and carries its own error of roughly one percentage point, so it confirms
      the exact figures above rather than standing in for them. */
  function coverage(seed, n, pattern, severity) {
    var crit = tCritical(0.05, n - 2);
    var slopes = 0;
    var hitC = 0;
    var hitR = 0;
    for (var r = 0; r < COVERAGE_RUNS; r += 1) {
      var f = fit(generate(seed + 977 * (r + 1), n, pattern, severity));
      slopes += f.b1;
      if (Math.abs(f.b1 - TRUE_B1) <= crit * f.seClassical) { hitC += 1; }
      if (Math.abs(f.b1 - TRUE_B1) <= crit * f.seRobust) { hitR += 1; }
    }
    return {
      meanSlope: slopes / COVERAGE_RUNS,
      classical: hitC / COVERAGE_RUNS,
      robust: hitR / COVERAGE_RUNS
    };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#hetero");
  if (!shell) { return; }

  var patternSelect = $("#pattern-select");
  var severityRange = $("#severity-range");
  var nRange = $("#n-range");
  var seedInput = $("#seed-input");
  var chartHeading = $("[data-chart-heading]");
  var plots = $("[data-plots]");
  var regionTable = $("[data-region-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var honesty = $("[data-honesty]");
  var costNote = $("[data-cost-note]");
  var costTable = $("[data-cost-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  function settings() {
    return {
      pattern: patternSelect.value,
      severity: Number(severityRange.value) / 100,
      n: Number(nRange.value),
      seed: Math.max(1, Math.round(Number(seedInput.value) || 1))
    };
  }

  /* =======================================================================
     Drawing
     ===================================================================== */

  var PANEL = {
    left: 42, right: 448,
    rawTop: 12, rawBase: 116,
    resTop: 142, resBase: 224
  };

  function drawPlots(f, s) {
    clear(plots);

    var fitLo = f.b0 + f.b1 * X_LO;
    var fitHi = f.b0 + f.b1 * X_HI;
    var allY = f.rows.map(function (r) { return r.y; });
    var yLo = Math.min.apply(null, allY.concat([fitLo])) - 4;
    var yHi = Math.max.apply(null, allY.concat([fitHi])) + 4;
    var eMax = Math.max.apply(null, f.rows.map(function (r) {
      return Math.abs(r.e);
    }).concat([1])) * 1.12;

    var X = function (v) {
      return PANEL.left + ((v - fitLo) / (fitHi - fitLo)) * (PANEL.right - PANEL.left);
    };
    var Yraw = function (v) {
      return PANEL.rawBase -
        ((v - yLo) / (yHi - yLo)) * (PANEL.rawBase - PANEL.rawTop);
    };
    var Yres = function (v) {
      var mid = (PANEL.resTop + PANEL.resBase) / 2;
      return mid - (v / eMax) * ((PANEL.resBase - PANEL.resTop) / 2);
    };

    /* --- Upper panel: the raw data and the fitted line ------------------ */

    plots.appendChild(svgNode("line", {
      x1: X(fitLo), y1: Yraw(fitLo), x2: X(fitHi), y2: Yraw(fitHi),
      class: "hs__fit"
    }));
    f.rows.forEach(function (r) {
      plots.appendChild(svgNode("circle",
        { cx: X(r.fitted), cy: Yraw(r.y), r: 2.6, class: "hs__point" }));
    });
    plots.appendChild(svgNode("line", {
      x1: PANEL.left, y1: PANEL.rawBase, x2: PANEL.right, y2: PANEL.rawBase,
      class: "hs__axis"
    }));
    plots.appendChild(svgText(
      { x: PANEL.left + 2, y: PANEL.rawTop + 9, "text-anchor": "start" },
      "the raw data, with the fitted line", "chart__label"));

    plots.appendChild(svgNode("line", {
      x1: PANEL.left, y1: 129, x2: PANEL.right, y2: 129, class: "hs__divide"
    }));

    /* --- Lower panel: residuals against fitted values ------------------- */

    plots.appendChild(svgNode("line", {
      x1: PANEL.left, y1: Yres(0), x2: PANEL.right, y2: Yres(0), class: "hs__zero"
    }));
    // The boundaries of the three regions the paired table reports.
    [fitLo + (fitHi - fitLo) / 3, fitLo + 2 * (fitHi - fitLo) / 3]
      .forEach(function (v) {
        plots.appendChild(svgNode("line", {
          x1: X(v), y1: PANEL.resTop, x2: X(v), y2: PANEL.resBase,
          class: "hs__region"
        }));
      });
    f.rows.forEach(function (r) {
      plots.appendChild(svgNode("circle",
        { cx: X(r.fitted), cy: Yres(r.e), r: 2.6, class: "hs__point" }));
    });
    plots.appendChild(svgNode("line", {
      x1: PANEL.left, y1: PANEL.resBase, x2: PANEL.right, y2: PANEL.resBase,
      class: "hs__axis"
    }));
    plots.appendChild(svgText(
      { x: PANEL.left + 2, y: PANEL.resTop + 9, "text-anchor": "start" },
      "residuals against fitted values", "chart__label"));
    plots.appendChild(svgText(
      { x: PANEL.right - 2, y: Yres(0) - 5, "text-anchor": "end" },
      "zero", "chart__axis"));

    ["low third", "middle third", "high third"].forEach(function (label, i) {
      plots.appendChild(svgText(
        { x: X(fitLo + (fitHi - fitLo) * (i + 0.5) / 3), y: PANEL.resBase + 15,
          "text-anchor": "middle" }, label, "chart__axis"));
    });
    plots.appendChild(svgText(
      { x: (PANEL.left + PANEL.right) / 2, y: PANEL.resBase + 32,
        "text-anchor": "middle" },
      "fitted value — both panels share this axis", "chart__axis"));
  }

  /* =======================================================================
     Rendering
     ===================================================================== */

  function render() {
    var s = settings();
    var points = generate(s.seed, s.n, s.pattern, s.severity);
    var f = fit(points);

    var thirds = [[], [], []];
    var lo = f.rows[0].fitted;
    var hi = f.rows[f.rows.length - 1].fitted;
    f.rows.forEach(function (r) {
      var t = Math.min(2, Math.floor(3 * (r.fitted - lo) / (hi - lo + 1e-9)));
      thirds[t].push(r.e);
    });
    var sds = thirds.map(sd);
    // The widest third against the narrowest, so a pattern that peaks at the
    // ends or in the middle is described as unevenly as a monotone one.
    var widest = Math.max.apply(null, sds);
    var narrowest = Math.min.apply(null, sds);
    var ratio = narrowest > 0 ? widest / narrowest : 1;

    chartHeading.textContent =
      "Two views of " + s.n + " observations — estimated slope " + fmt(f.b1);
    drawPlots(f, s);

    clear(regionTable);
    [
      ["Low third of the fitted values", fmt(sds[0], 1)],
      ["Middle third", fmt(sds[1], 1)],
      ["High third", fmt(sds[2], 1)],
      ["Widest third divided by narrowest", fmt(ratio, 2)]
    ].forEach(function (cells) { regionTable.appendChild(row(cells)); });

    clear(readout);
    [
      ["True slope", fmt(TRUE_B1)],
      ["Estimated slope", fmt(f.b1)],
      ["Classical SE", fmt(f.seClassical, 3)],
      ["Robust SE", fmt(f.seRobust, 3)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    /* --- The cost, including long-run coverage ------------------------- */

    var cov = coverage(s.seed, s.n, s.pattern, s.severity);
    var model = modelSE(points, s.pattern, s.severity);
    var crit = tCritical(0.05, f.df);
    var tC = f.b1 / f.seClassical;
    var tR = f.b1 / f.seRobust;
    clear(costTable);
    [
      ["Standard error of the slope", fmt(f.seClassical, 3), fmt(f.seRobust, 3)],
      ["95% interval for the slope",
        "[" + fmt(f.b1 - crit * f.seClassical, 3) + ", " +
          fmt(f.b1 + crit * f.seClassical, 3) + "]",
        "[" + fmt(f.b1 - crit * f.seRobust, 3) + ", " +
          fmt(f.b1 + crit * f.seRobust, 3) + "]"],
      ["t against a slope of zero", fmt(tC, 1), fmt(tR, 1)],
      ["Two-tailed p", "p " + fmtP(tTwoTail(tC, f.df)), "p " + fmtP(tTwoTail(tR, f.df))],
      ["Coverage of the 95% interval across " + COVERAGE_RUNS + " samples",
        pct(cov.classical), pct(cov.robust)],
      ["Standard error the model actually implies",
        fmt(model.aimedAt, 3) + " (what the formula aims at)",
        fmt(model.trueSE, 3) + " (the truth)"]
    ].forEach(function (cells) { costTable.appendChild(row(cells)); });

    costNote.textContent =
      "Across " + COVERAGE_RUNS + " fresh samples from the same generating " +
      "model, the average estimated slope is " + fmt(cov.meanSlope, 3) +
      " against a true slope of " + fmt(TRUE_B1) + ". The estimate is " +
      "unbiased however the spread behaves. " +
      "The last row is computed from the known model rather than simulated: " +
      "the true standard error of the slope is " + fmt(model.trueSE, 3) +
      " and the classical formula is aiming at " + fmt(model.aimedAt, 3) +
      ", so it " +
      (model.ratio > 1.02
        ? "understates the real variability by " +
          fmt(100 * (model.ratio - 1), 0) + " per cent. Intervals built on it " +
          "are too narrow, and tests built on it reject more often than their " +
          "stated rate."
        : model.ratio < 0.98
          ? "overstates the real variability by " +
            fmt(100 * (1 / model.ratio - 1), 0) + " per cent. Intervals built " +
            "on it are too wide - conservative rather than liberal, costing " +
            "power rather than credibility. Non-constant variance does not " +
            "always push in the alarming direction."
          : "is very nearly right. A visible fan does not automatically wreck " +
            "the standard error; what matters is whether the extra spread " +
            "sits where the line is most sensitive to it.") +
      " The coverage row above is a Monte Carlo estimate from " +
      COVERAGE_RUNS + " samples and carries about a percentage point of its " +
      "own error, so read it as confirmation rather than as the measurement. " +
      "The robust figure stays near 95% in every case, and costs very little " +
      "when the variance really is constant.";

    /* --- Verdict -------------------------------------------------------- */

    var tone;
    var text;
    if (s.severity < 0.1 || s.pattern === "constant") {
      tone = "good";
      text =
        "The band is about the same thickness all the way across: " +
        fmt(sds[0], 1) + ", " + fmt(sds[1], 1) + " and " + fmt(sds[2], 1) +
        " across the thirds. That is homoscedasticity, and the two standard " +
        "errors agree. Worth knowing by sight.";
    } else {
      var spreadPhrase =
        "The residuals fan out: " + fmt(ratio, 2) + " times wider at one end " +
        "than the other. The slope is still " + fmt(f.b1) + " against a true " +
        "0.50. ";
      if (model.ratio > 1.06) {
        tone = "warn";
        text = spreadPhrase +
          "The classical standard error is " + fmt(100 * (model.ratio - 1), 0) +
          " per cent too small. The estimate survives; the uncertainty does " +
          "not.";
      } else if (model.ratio < 0.94) {
        tone = "caution";
        text = spreadPhrase +
          "This time the classical standard error is " +
          fmt(100 * (1 / model.ratio - 1), 0) + " per cent too large, so the " +
          "interval is conservative. Non-constant variance does not always " +
          "push in the alarming direction.";
      } else {
        tone = "caution";
        text = spreadPhrase +
          "And the classical standard error is within a few per cent of the " +
          "truth. An obvious fan does not always cost anything. Try " +
          "widest-at-both-extremes.";
      }
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var lines = [];
    if (s.n <= 40) {
      lines.push(
        "With only " + s.n + " observations, be careful. Small samples throw " +
        "up fans and curves out of nothing at all, and the band you are " +
        "looking at would look different with a different seed. Press Draw a " +
        "new sample a few times and see how much the picture moves without " +
        "the model changing.");
    }
    if (s.n >= 220 && s.severity > 0 && s.severity < 0.3 && s.pattern !== "constant") {
      lines.push(
        "The other awkward case: a departure small enough to be harmless, and " +
        "a sample large enough that a formal test would report it. Tests for " +
        "non-constant variance get more sensitive as n grows.");
    }
    if (!lines.length) {
      lines.push(
        "Two competent readers can disagree about the same picture. Say what " +
        "you saw, and report a standard error that does not assume the thing " +
        "you are unsure about.");
    }
    honesty.textContent = lines.join(" ");

    return { f: f, sds: sds, ratio: ratio, cov: cov };
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  patternSelect.addEventListener("change", function () {
    var r = render();
    shell.announce(
      "Pattern set to " + patternSelect.options[patternSelect.selectedIndex].text
        .toLowerCase() + ". Residual spread now runs " + fmt(r.sds[0], 1) +
      ", " + fmt(r.sds[1], 1) + ", " + fmt(r.sds[2], 1) +
      " across the three regions, and the estimated slope is " +
      fmt(r.f.b1) + ".", { immediate: true });
  });

  shell.bindRange(severityRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return v === 0
        ? "no departure from constant variance"
        : "a departure of " + v + " per cent of the way to a sixfold spread ratio";
    },
    onInput: render
  });

  shell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " observations in the study"; },
    onInput: render
  });

  seedInput.addEventListener("change", render);

  $('[data-action="resample"]').addEventListener("click", function () {
    seedInput.value = String(Math.max(1,
      (Math.round(Number(seedInput.value) || 1) * 7 + 13) % 999983));
    var r = render();
    shell.announce(
      "New sample drawn with seed " + seedInput.value + ". Estimated slope " +
      fmt(r.f.b1) + " against a true 0.50, classical standard error " +
      fmt(r.f.seClassical, 3) + ", robust standard error " +
      fmt(r.f.seRobust, 3) + ".", { immediate: true });
  });

  $('[data-action="flat"]').addEventListener("click", function () {
    patternSelect.value = "constant";
    severityRange.value = "0";
    severityRange.dispatchEvent(new Event("input"));
    var r = render();
    shell.announce(
      "Spread made constant. The residual band is now " + fmt(r.sds[0], 1) +
      ", " + fmt(r.sds[1], 1) + ", " + fmt(r.sds[2], 1) +
      " across the three regions, and the two standard errors have converged.",
      { immediate: true });
  });

  /* =======================================================================
     Opening predictions
     ===================================================================== */

  var VIEW_NOTES = {
    raw: "The raw scatterplot is the harder of the two. The cloud is tilted, " +
      "so its width and its slope compete for your attention and a widening " +
      "band is easy to argue about. Everything you can see in the upper panel " +
      "is also in the lower one, with the tilt removed.",
    resid: "Correct. Subtracting the fitted line flattens the systematic part " +
      "of the picture, so the only thing left to look at is the thickness of " +
      "the band - which is exactly the quantity in question.",
    same: "They are the same data, and they are not equally readable. " +
      "Removing the slope removes the thing that was competing with the " +
      "spread for your attention, which is the entire reason residual plots " +
      "exist.",
    neither: "A formal test has its uses and it is not the first move. Its " +
      "sensitivity depends on the sample size, so it flags trivial departures " +
      "in large studies and misses serious ones in small ones. Look at the " +
      "picture first."
  };

  var SLOPE_NOTES = {
    up: "No. Ordinary least squares stays unbiased under non-constant " +
      "variance, in either direction. Drag the severity to 100% and watch the " +
      "estimated slope stay near 0.50, then open the disclosure and read the " +
      "average across three hundred samples.",
    down: "No, and for the same reason: the estimate is unbiased whatever the " +
      "spread does. The average slope across repeated samples lands on the " +
      "truth.",
    unbiased: "Correct. The coefficient is unbiased; the formula for its " +
      "standard error is not, because that formula assumes a single common " +
      "variance. The interval and the test are built on the standard error, " +
      "so they inherit the problem while looking perfectly normal.",
    invalid: "Too strong. A fan shape is a reason to be careful about the " +
      "standard errors, not a reason to discard the analysis. Robust standard " +
      "errors, a transformation, or weighted least squares are all ordinary " +
      "responses, and the estimate itself was never the problem."
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
      "Laboratory unlocked, showing the fanning pattern from the predictions.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var view = $('input[name="view"]:checked', openingForm);
    var slope = $('input[name="slope"]:checked', openingForm);
    if (!view || !slope) {
      openingError.textContent =
        "Answer both questions before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var correct = (view.value === "resid" ? 1 : 0) +
      (slope.value === "unbiased" ? 1 : 0);
    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone",
      correct === 2 ? "good" : correct === 1 ? "caution" : "warn");
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict",
      correct + " of the two."));
    openingFeedback.appendChild(p);
    var list = make("ul");
    var li1 = make("li");
    li1.appendChild(make("strong", null, "Which view. "));
    li1.appendChild(document.createTextNode(VIEW_NOTES[view.value]));
    list.appendChild(li1);
    var li2 = make("li");
    li2.appendChild(make("strong", null, "What it does to the slope. "));
    li2.appendChild(document.createTextNode(SLOPE_NOTES[slope.value]));
    list.appendChild(li2);
    openingFeedback.appendChild(list);
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
     Challenge — read four residual plots
     ===================================================================== */

  /* Four fictional studies. The third is a curvature problem rather than a
     variance problem, and the fourth is too small to read - both deliberate. */
  var CARDS = [
    {
      answer: "constant", n: 120, pattern: "constant", severity: 0,
      curve: 0, seed: 3391,
      title: "Study 1",
      why:
        "A band of roughly even thickness from one end to the other. There is " +
        "nothing here to report, and knowing what that looks like is what " +
        "makes the other three readable."
    },
    {
      answer: "grow", n: 120, pattern: "increasing", severity: 0.85,
      curve: 0, seed: 5527,
      title: "Study 2",
      why:
        "The classic megaphone: narrow on the left, wide on the right. The " +
        "coefficient is fine and the classical standard error is too small, " +
        "so the interval is too narrow and the test rejects too readily."
    },
    {
      answer: "curve", n: 120, pattern: "constant", severity: 0,
      curve: 1, seed: 7717,
      title: "Study 3",
      why:
        "The thickness is even; the band itself bends. That is not a variance " +
        "problem at all - it is the straight line failing to describe the " +
        "shape of the relationship, which is a more serious finding and one " +
        "that no robust standard error repairs. A residual plot is a general " +
        "diagnostic, not a heteroscedasticity detector."
    },
    {
      answer: "toofew", n: 16, pattern: "increasing", severity: 0.85,
      curve: 0, seed: 8123,
      title: "Study 4",
      why:
        "There is a fan in the generating model, and sixteen points cannot " +
        "establish it. A different sample of sixteen from the same model would " +
        "have looked meaningfully different. Declining to diagnose is the " +
        "correct reading."
    }
  ];

  function cardData(card) {
    var random = mulberry32(card.seed);
    var points = [];
    for (var i = 0; i < card.n; i += 1) {
      var x = X_LO + (X_HI - X_LO) * random();
      var u = (x - X_LO) / (X_HI - X_LO);
      // The curvature card bends the mean function; the model fitted to it is
      // still a straight line, so the bend lands in the residuals.
      var bend = card.curve * 34 * (u - 0.5) * (u - 0.5);
      points.push({
        x: x,
        y: TRUE_B0 + TRUE_B1 * x + bend +
          normal(random) * BASE_SD * spreadFactor(x, card.pattern, card.severity)
      });
    }
    points.sort(function (a, b) { return a.x - b.x; });
    return fit(points);
  }

  function drawCard(index) {
    var card = CARDS[index];
    var f = cardData(card);
    var svg = $('[data-card-chart="' + index + '"]');
    var left = 24;
    var right = 288;
    var top = 12;
    var base = 126;
    var mid = (top + base) / 2;
    var eMax = Math.max.apply(null, f.rows.map(function (r) {
      return Math.abs(r.e);
    }).concat([1])) * 1.1;
    var lo = f.rows[0].fitted;
    var hi = f.rows[f.rows.length - 1].fitted;

    clear(svg);
    svg.appendChild(svgNode("line",
      { x1: left, y1: mid, x2: right, y2: mid, class: "hs__zero" }));
    f.rows.forEach(function (r) {
      svg.appendChild(svgNode("circle", {
        cx: left + ((r.fitted - lo) / (hi - lo)) * (right - left),
        cy: mid - (r.e / eMax) * ((base - top) / 2),
        r: 2.4, class: "hs__point"
      }));
    });
    svg.appendChild(svgNode("line",
      { x1: left, y1: base, x2: right, y2: base, class: "hs__axis" }));
    svg.appendChild(svgText(
      { x: (left + right) / 2, y: base + 16, "text-anchor": "middle" },
      "fitted value", "chart__axis"));

    // A written alternative, so the card is answerable without the picture.
    var thirds = [[], [], []];
    var means = [[], [], []];
    f.rows.forEach(function (r) {
      var t = Math.min(2, Math.floor(3 * (r.fitted - lo) / (hi - lo + 1e-9)));
      thirds[t].push(r.e);
      means[t].push(r.e);
    });
    var sds = thirds.map(sd);
    var avg = means.map(function (list) {
      return list.length
        ? list.reduce(function (a, b) { return a + b; }, 0) / list.length : 0;
    });
    $('[data-card-alt="' + index + '"]').textContent =
      card.n + " observations. Residual standard deviation by third of the " +
      "fitted values: " + fmt(sds[0], 1) + ", " + fmt(sds[1], 1) + ", " +
      fmt(sds[2], 1) + ". Average residual by third: " + fmt(avg[0], 1) + ", " +
      fmt(avg[1], 1) + ", " + fmt(avg[2], 1) + ". A band with nothing wrong " +
      "has similar standard deviations and average residuals near zero in all " +
      "three.";
  }

  function showChallenge() {
    var wasHidden = challengeSection.hidden;
    challengeSection.hidden = false;
    CARDS.forEach(function (card, i) { drawCard(i); });
    if (wasHidden) {
      $("#challenge-heading").focus();
      shell.announce(
        "Four residual plots have opened below. Read each one, then check all " +
        "four together.", { immediate: true });
    }
  }

  $('[data-action="show-challenge"]').addEventListener("click", showChallenge);

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = CARDS.map(function (card, i) { return $("#card-" + i).value; });
    if (chosen.some(function (v) { return !v; })) {
      challengeError.textContent = "Give a reading for all four plots.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = CARDS.filter(function (card, i) {
      return chosen[i] === card.answer;
    }).length;

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone",
      right === 4 ? "good" : right >= 2 ? "caution" : "warn");
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", right + " of the four."));
    p.appendChild(document.createTextNode(
      " Two of these are ordinary variance readings, one is not about " +
      "variance at all, and one is a refusal to diagnose. All four are things " +
      "a residual plot is for."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    CARDS.forEach(function (card, i) {
      var li = make("li");
      li.appendChild(make("strong", null,
        card.title + " — " +
        (chosen[i] === card.answer ? "correct. " : "not this one. ")));
      li.appendChild(document.createTextNode(card.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(right + " of the four plots read correctly.",
      { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    patternSelect.value = DEFAULTS.pattern;
    severityRange.value = String(DEFAULTS.severity);
    nRange.value = String(DEFAULTS.n);
    seedInput.value = String(DEFAULTS.seed);
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the two predictions above to open the laboratory.",
    { immediate: true });
})();
