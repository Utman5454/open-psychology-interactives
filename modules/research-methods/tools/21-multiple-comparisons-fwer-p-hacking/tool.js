/* =========================================================================
   Multiple Comparisons, FWER and Forking Paths
   -------------------------------------------------------------------------
   EXPERIMENT 1 — the family of tests
   ----------------------------------
   Each simulated experiment runs k independent two-sample t-tests on 40 per
   group. A chosen number of them have a real effect of d = 0.60; the rest
   have nothing to find. Every test is computed properly rather than drawn
   from a uniform, so the picture on screen is an actual analysis.

   With independent tests and every null true,

       FWER = 1 - (1 - alpha)^k
       expected false positives per experiment = k * alpha

   Bonferroni tests each hypothesis at alpha/k. It does what it promises to
   the first of those quantities, and the tool reports the price in the same
   breath: the detection rate for the tests that DO have something to find
   falls at the same time, because each of them is now judged against a
   threshold k times stricter. Both numbers sit side by side in the readout,
   which is the whole design of the experiment.

   The family-wise error rate is a property of the FAMILY. Each individual
   test is behaving exactly as advertised; what changes is the question being
   asked of the set.

   EXPERIMENT 2 — the garden of forking paths
   ------------------------------------------
   One fictional dataset of 90 students, generated with NO group difference on
   anything. Four correlated outcomes, a baseline test, a response-speed
   measure and a cohort label. The learner picks an outcome, an exclusion
   rule, a subgroup and whether to adjust for baseline: 4 x 3 x 3 x 2 = 72
   complete, reportable analyses of the same empty data.

   Each path is a real computation: rows are filtered, the outcome is
   optionally residualised on the baseline score, and a pooled two-sample
   t-test is run. Because the paths share participants and outcomes they are
   heavily correlated, which is exactly the situation a real analyst is in and
   is why no simple correction applies.

   The tool never presents this as a technique. The goal banner and the
   feedback both say plainly that it is a demonstration of what the search
   does to the meaning of the resulting p-value, and that every one of the
   choices offered is one a careful researcher might make in good faith.

   Randomness is seeded (mulberry32 with Box-Muller normals). No data leave
   the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var GROUP_N = 40;          // per group, in Experiment 1
  var REAL_D = 0.60;         // effect size of the tests that have something
  var RUN_BATCH = 1000;
  var DEFAULTS = { k: 20, real: 0, alpha: "0.05", correct: "none", seed: 4711 };

  var STUDENTS = 90;         // Experiment 2
  var OUTCOMES = 4;
  var GARDEN_SEED = 8820;

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
     Student's t
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
    if (abs === 0 || !isFinite(abs)) { return 1; }
    return betai(df / 2, 0.5, df / (df + abs * abs));
  }

  /** Pooled two-sample t-test on two arrays. */
  function tTest(a, b) {
    var na = a.length;
    var nb = b.length;
    if (na < 2 || nb < 2) { return null; }
    var ma = a.reduce(function (x, y) { return x + y; }, 0) / na;
    var mb = b.reduce(function (x, y) { return x + y; }, 0) / nb;
    var ssa = a.reduce(function (x, y) { return x + (y - ma) * (y - ma); }, 0);
    var ssb = b.reduce(function (x, y) { return x + (y - mb) * (y - mb); }, 0);
    var df = na + nb - 2;
    var pooled = (ssa + ssb) / df;
    var se = Math.sqrt(pooled * (1 / na + 1 / nb));
    if (!(se > 0)) { return null; }
    var t = (mb - ma) / se;
    return { t: t, df: df, p: tTwoTail(t, df), diff: mb - ma, na: na, nb: nb };
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

  /* =======================================================================
     Wiring
     ===================================================================== */

  var familyShell = InteractiveShell.attach("#family");
  var gardenShell = InteractiveShell.attach("#garden");
  if (!familyShell || !gardenShell) { return; }

  var kRange = $("#k-range");
  var realRange = $("#real-range");
  var alphaSelect = $("#alpha-select");
  var correctSelect = $("#correct-select");
  var seedInput = $("#seed-input");
  var chartHeading = $("[data-chart-heading]");
  var gridSvg = $("[data-grid]");
  var runTable = $("[data-run-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var costNote = $("[data-cost]");
  var theoryTable = $("[data-theory-table]");

  var outcomeSelect = $("#outcome-select");
  var excludeSelect = $("#exclude-select");
  var subgroupSelect = $("#subgroup-select");
  var covariateSelect = $("#covariate-select");
  var gardenHeading = $("[data-garden-heading]");
  var gardenChart = $("[data-garden-chart]");
  var gardenTable = $("[data-garden-table]");
  var goalChecks = $("[data-goal-checks]");
  var gardenFeedback = $("[data-garden-feedback]");
  var revealDetails = $("[data-reveal-details]");
  var revealNote = $("[data-reveal-note]");
  var revealTable = $("[data-reveal-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var familySection = $("#family-section");
  var gardenSection = $("#garden-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     Experiment 1
     ===================================================================== */

  var lastRun = null;         // the k tests of the most recent experiment
  var tally = { runs: 0, anyFalse: 0, falseTotal: 0, realTotal: 0, realHits: 0 };
  var runCounter = 0;

  function settings() {
    var k = Number(kRange.value);
    var real = Math.min(Number(realRange.value), k);
    var alpha = Number(alphaSelect.value);
    return {
      k: k, real: real, alpha: alpha,
      threshold: correctSelect.value === "bonferroni" ? alpha / k : alpha,
      corrected: correctSelect.value === "bonferroni",
      seed: Math.max(1, Math.round(Number(seedInput.value) || 1))
    };
  }

  /** One experiment: k independent two-sample t-tests, `real` of which have a
      genuine effect of REAL_D. */
  function runExperiment(s, seedOffset) {
    var random = mulberry32(s.seed + seedOffset * 7919);
    var tests = [];
    for (var i = 0; i < s.k; i += 1) {
      var isReal = i < s.real;
      var shift = isReal ? REAL_D : 0;
      var a = [];
      var b = [];
      for (var j = 0; j < GROUP_N; j += 1) {
        a.push(normal(random));
        b.push(shift + normal(random));
      }
      var res = tTest(a, b);
      tests.push({
        real: isReal, p: res ? res.p : 1,
        hit: res ? res.p < s.threshold : false
      });
    }
    return tests;
  }

  function addToTally(s, tests) {
    tally.runs += 1;
    var falseHits = 0;
    tests.forEach(function (t) {
      if (t.real) {
        tally.realTotal += 1;
        if (t.hit) { tally.realHits += 1; }
      } else if (t.hit) {
        falseHits += 1;
      }
    });
    tally.falseTotal += falseHits;
    if (falseHits > 0) { tally.anyFalse += 1; }
  }

  function resetTally() {
    tally = { runs: 0, anyFalse: 0, falseTotal: 0, realTotal: 0, realHits: 0 };
    runCounter = 0;
    lastRun = null;
  }

  function drawGrid(s) {
    clear(gridSvg);
    if (!lastRun) {
      gridSvg.appendChild(svgText(
        { x: 230, y: 68, "text-anchor": "middle" },
        "Press “Run one experiment” to begin", "chart__label"));
      return;
    }
    var left = 12;
    var right = 448;
    var top = 14;
    var perRow = Math.min(15, Math.max(6, Math.ceil(Math.sqrt(s.k * 2.2))));
    var cols = Math.min(perRow, s.k);
    var rows = Math.ceil(s.k / cols);
    var cell = Math.min(26, Math.floor((right - left) / cols) - 4);
    var gap = 4;

    lastRun.forEach(function (t, i) {
      var cx = left + (i % cols) * (cell + gap);
      var cy = top + Math.floor(i / cols) * (cell + gap);
      gridSvg.appendChild(svgNode("rect", {
        x: cx, y: cy, width: cell, height: cell, rx: 3,
        class: "mc__cell" + (t.real ? " mc__cell--real" : "") +
          (t.hit ? " mc__cell--hit" : "")
      }));
      if (t.hit) {
        var m = cell * 0.28;
        var mx = cx + cell / 2;
        var my = cy + cell / 2;
        gridSvg.appendChild(svgNode("line",
          { x1: mx - m, y1: my - m, x2: mx + m, y2: my + m, class: "mc__mark" }));
        gridSvg.appendChild(svgNode("line",
          { x1: mx - m, y1: my + m, x2: mx + m, y2: my - m, class: "mc__mark" }));
      }
    });

    var baseY = top + rows * (cell + gap) + 12;
    gridSvg.appendChild(svgText(
      { x: left, y: Math.min(baseY, 126), "text-anchor": "start" },
      "each square is one test — a cross means it came out significant" +
      (s.real > 0 ? "; heavy outlines had a real effect to find" : ""),
      "chart__axis"));
  }

  function renderFamily() {
    var s = settings();
    var fwer = 1 - Math.pow(1 - s.threshold, s.k);
    var expected = s.k * s.threshold;

    chartHeading.textContent = lastRun
      ? "Experiment " + runCounter + " of " + s.k + " tests" +
        (s.corrected ? ", Bonferroni-corrected" : "")
      : "Nothing run yet";
    drawGrid(s);

    clear(runTable);
    if (lastRun) {
      var falseHits = 0;
      var realHits = 0;
      lastRun.forEach(function (t) {
        if (t.hit) { if (t.real) { realHits += 1; } else { falseHits += 1; } }
      });
      [
        ["Tests with nothing to find", String(s.k - s.real)],
        ["...of which came out significant", String(falseHits)],
        ["Tests with a real effect", String(s.real)],
        ["...of which came out significant", String(realHits)]
      ].forEach(function (cells) { runTable.appendChild(row(cells)); });
    } else {
      runTable.appendChild(row(["No experiment run yet", "—"]));
    }

    clear(readout);
    [
      ["Threshold per test", s.threshold < 0.001
        ? s.threshold.toExponential(1) : fmt(s.threshold, 4)],
      ["Family-wise rate, predicted", pct(fwer)],
      ["Runs with a false positive", tally.runs
        ? pct(tally.anyFalse / tally.runs) + " of " + tally.runs : "—"],
      ["Real effects detected", tally.realTotal
        ? pct(tally.realHits / tally.realTotal) : "no real effects set"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    clear(theoryTable);
    [
      ["Threshold applied to each test", fmt(s.threshold, 4), "—"],
      ["Probability of at least one false positive", pct(fwer),
        tally.runs ? pct(tally.anyFalse / tally.runs) : "—"],
      ["False positives per experiment",
        fmt((s.k - s.real) * s.threshold, 2),
        tally.runs ? fmt(tally.falseTotal / tally.runs, 2) : "—"],
      ["Experiments run", "—", String(tally.runs)]
    ].forEach(function (cells) { theoryTable.appendChild(row(cells)); });

    /* --- Verdict ------------------------------------------------------- */

    var tone;
    var text;
    if (!tally.runs) {
      tone = "caution";
      text =
        "With " + s.k + " tests at a threshold of " + fmt(s.threshold, 4) +
        ", the formula says the probability of at least one false positive is " +
        pct(fwer) + " and the expected number is " +
        fmt((s.k - s.real) * s.threshold, 2) + " per experiment. Run one and " +
        "see, then run a thousand and count.";
    } else if (s.corrected) {
      tone = "good";
      text =
        "Across " + tally.runs + " experiments, " +
        pct(tally.anyFalse / tally.runs) + " produced at least one false " +
        "positive, against " + pct(fwer) + " predicted. The correction has " +
        "done exactly what it promises: the family-wise rate is back down to " +
        "roughly the per-test rate you started with. Now read the last figure " +
        "in the readout before deciding it was free.";
    } else {
      tone = "warn";
      text =
        "Across " + tally.runs + " experiments, " +
        pct(tally.anyFalse / tally.runs) + " produced at least one false " +
        "positive, against " + pct(fwer) + " predicted by " +
        "1 minus (1 minus alpha) to the power k. Every individual test was " +
        "behaving exactly as advertised at " + fmt(s.alpha, 2) + "; nothing is " +
        "broken. What changed is the question - \"did anything come out?\" - " +
        "and that question has an error rate of its own.";
    }
    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var lines = [];
    if (s.real > 0) {
      var uncorrectedPowerHint = s.corrected
        ? " Switch the correction off and watch that figure jump back up."
        : " Switch the correction on and watch that figure fall.";
      lines.push(
        "There are " + s.real + " real effects in this family, of size d = " +
        fmt(REAL_D) + ". So far " +
        (tally.realTotal
          ? pct(tally.realHits / tally.realTotal) + " of them have been detected"
          : "none have been tested yet") + "." + uncorrectedPowerHint +
        " A correction is a trade, and there is no setting of the dial that " +
        "gives you both.");
    } else {
      lines.push(
        "Every null in this family is true, so every cross on the grid is a " +
        "false positive. Set some real effects with the second slider to see " +
        "what a correction costs as well as what it buys.");
    }
    if (s.corrected) {
      lines.push(
        "Bonferroni is the simplest correction and not the best: Holm's " +
        "step-down procedure controls the same rate with more power and no " +
        "extra assumptions, and false-discovery-rate procedures control a " +
        "different and often more appropriate quantity.");
    }
    costNote.textContent = lines.join(" ");
  }

  familyShell.bindRange(kRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " tests in the family"; },
    onInput: function () {
      resetTally();
      renderFamily();
    }
  });

  familyShell.bindRange(realRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return v === 0
        ? "every null in the family is true"
        : v + " of the tests have a real effect to find";
    },
    onInput: function () {
      resetTally();
      renderFamily();
    }
  });

  [alphaSelect, correctSelect].forEach(function (select) {
    select.addEventListener("change", function () {
      resetTally();
      renderFamily();
      var s = settings();
      familyShell.announce(
        "Threshold per test is now " + fmt(s.threshold, 4) +
        ", so the predicted family-wise rate is " +
        pct(1 - Math.pow(1 - s.threshold, s.k)) +
        ". The tally has been cleared, because those experiments used a " +
        "different rule.", { immediate: true });
    });
  });

  seedInput.addEventListener("change", function () {
    resetTally();
    renderFamily();
  });

  $('[data-action="run-one"]').addEventListener("click", function () {
    var s = settings();
    runCounter += 1;
    lastRun = runExperiment(s, runCounter);
    addToTally(s, lastRun);
    renderFamily();
    var falseHits = lastRun.filter(function (t) { return t.hit && !t.real; }).length;
    familyShell.announce(
      "Experiment " + runCounter + ": " + falseHits +
      " of the " + (s.k - s.real) + " tests with nothing to find came out " +
      "significant.", { immediate: true });
  });

  $('[data-action="run-many"]').addEventListener("click", function () {
    var s = settings();
    for (var i = 0; i < RUN_BATCH; i += 1) {
      runCounter += 1;
      lastRun = runExperiment(s, runCounter);
      addToTally(s, lastRun);
    }
    renderFamily();
    familyShell.announce(
      tally.runs + " experiments run. " + pct(tally.anyFalse / tally.runs) +
      " of them produced at least one false positive, against " +
      pct(1 - Math.pow(1 - s.threshold, s.k)) + " predicted.",
      { immediate: true });
  });

  $('[data-action="clear-runs"]').addEventListener("click", function () {
    resetTally();
    renderFamily();
    familyShell.announce("Tally cleared. The settings are unchanged.",
      { immediate: true });
  });

  /* =======================================================================
     Experiment 2 — the garden
     ===================================================================== */

  var EXCLUSIONS = ["No exclusions", "Slowest 10% excluded",
    "Bottom 10% on baseline excluded"];
  var SUBGROUPS = ["Everyone", "First-year students only",
    "Returning students only"];
  var OUTCOME_NAMES = ["Overall revision score", "Recall accuracy",
    "Comprehension score", "Self-rated confidence"];

  var gardenSeed = GARDEN_SEED;
  var dataset = null;
  var pathP = [];             // p for all 72 paths, computed once per dataset
  var tried = {};             // pathIndex -> true
  var triedOrder = [];
  var revealed = false;

  /** A fictional cohort with NO group difference on anything. */
  function buildDataset(seed) {
    var random = mulberry32(seed);
    var rows = [];
    for (var i = 0; i < STUDENTS; i += 1) {
      var common = normal(random);
      var outcomes = [];
      for (var j = 0; j < OUTCOMES; j += 1) {
        // Correlated outcomes, all with the same mean in both groups.
        outcomes.push(50 + 10 * (0.6 * common + 0.8 * normal(random)));
      }
      rows.push({
        group: i % 2,                       // 45 in each, no effect anywhere
        cohort: random() < 0.5 ? 0 : 1,
        baseline: 50 + 10 * normal(random),
        speed: 500 + 90 * normal(random),
        y: outcomes
      });
    }
    return rows;
  }

  function pathIndex(outcome, exclude, subgroup, covariate) {
    return ((outcome * 3 + exclude) * 3 + subgroup) * 2 + covariate;
  }

  function analyse(outcome, exclude, subgroup, covariate) {
    var rows = dataset.slice();

    if (exclude === 1) {
      var bySpeed = rows.slice().sort(function (a, b) { return a.speed - b.speed; });
      var keepSpeed = bySpeed.slice(0, Math.floor(bySpeed.length * 0.9));
      rows = rows.filter(function (r) { return keepSpeed.indexOf(r) !== -1; });
    } else if (exclude === 2) {
      var byBase = rows.slice().sort(function (a, b) { return a.baseline - b.baseline; });
      var drop = byBase.slice(0, Math.ceil(byBase.length * 0.1));
      rows = rows.filter(function (r) { return drop.indexOf(r) === -1; });
    }

    if (subgroup === 1) {
      rows = rows.filter(function (r) { return r.cohort === 0; });
    } else if (subgroup === 2) {
      rows = rows.filter(function (r) { return r.cohort === 1; });
    }

    var values = rows.map(function (r) { return r.y[outcome]; });
    if (covariate === 1 && rows.length > 3) {
      // Residualise the outcome on the baseline score, which is what
      // "adjusting for baseline" does to a two-group comparison.
      var mx = 0;
      var my = 0;
      rows.forEach(function (r, i) { mx += r.baseline; my += values[i]; });
      mx /= rows.length;
      my /= rows.length;
      var sxx = 0;
      var sxy = 0;
      rows.forEach(function (r, i) {
        sxx += (r.baseline - mx) * (r.baseline - mx);
        sxy += (r.baseline - mx) * (values[i] - my);
      });
      var b = sxx > 0 ? sxy / sxx : 0;
      values = values.map(function (v, i) {
        return v - b * (rows[i].baseline - mx);
      });
    }

    var a = [];
    var bGroup = [];
    rows.forEach(function (r, i) {
      if (r.group === 0) { a.push(values[i]); } else { bGroup.push(values[i]); }
    });
    var res = tTest(a, bGroup);
    return res ? { p: res.p, n: rows.length, diff: res.diff, t: res.t, df: res.df }
      : { p: 1, n: rows.length, diff: 0, t: 0, df: 0 };
  }

  function buildGarden(seed) {
    dataset = buildDataset(seed);
    pathP = [];
    for (var o = 0; o < OUTCOMES; o += 1) {
      for (var e = 0; e < 3; e += 1) {
        for (var g = 0; g < 3; g += 1) {
          for (var c = 0; c < 2; c += 1) {
            pathP[pathIndex(o, e, g, c)] = analyse(o, e, g, c).p;
          }
        }
      }
    }
    tried = {};
    triedOrder = [];
    revealed = false;
  }

  function currentPath() {
    return {
      outcome: Number(outcomeSelect.value),
      exclude: Number(excludeSelect.value),
      subgroup: Number(subgroupSelect.value),
      covariate: Number(covariateSelect.value)
    };
  }

  function smallestTried() {
    var best = null;
    triedOrder.forEach(function (idx) {
      if (best === null || pathP[idx] < pathP[best]) { best = idx; }
    });
    return best;
  }

  function drawGarden() {
    var left = 40;
    var right = 444;
    var axisY = 86;
    clear(gardenChart);

    var X = function (p) { return left + p * (right - left); };

    // The alpha rule.
    gardenChart.appendChild(svgNode("line", {
      x1: X(0.05), y1: 24, x2: X(0.05), y2: axisY + 6, class: "gd__alpha"
    }));
    gardenChart.appendChild(svgText(
      { x: X(0.05) + 5, y: 22, "text-anchor": "start" },
      "p = .05", "chart__label"));

    if (revealed) {
      pathP.forEach(function (p) {
        gardenChart.appendChild(svgNode("line", {
          x1: X(p), y1: 60, x2: X(p), y2: 74, class: "gd__all"
        }));
      });
      gardenChart.appendChild(svgText(
        { x: right, y: 56, "text-anchor": "end" },
        "all 72 paths", "chart__axis"));
    }

    var cur = currentPath();
    var curIdx = pathIndex(cur.outcome, cur.exclude, cur.subgroup, cur.covariate);

    triedOrder.forEach(function (idx) {
      var p = pathP[idx];
      gardenChart.appendChild(svgNode("line", {
        x1: X(p), y1: 32, x2: X(p), y2: 54,
        class: "gd__tick" + (p < 0.05 ? " gd__tick--sig" : "")
      }));
    });
    if (tried[curIdx]) {
      gardenChart.appendChild(svgNode("circle", {
        cx: X(pathP[curIdx]), cy: 43, r: 8, class: "gd__current"
      }));
    }
    if (triedOrder.length) {
      gardenChart.appendChild(svgText(
        { x: left, y: 30, "text-anchor": "start" },
        "paths you have run", "chart__axis"));
    }

    gardenChart.appendChild(svgNode("line",
      { x1: left, y1: axisY, x2: right, y2: axisY, class: "gd__axis" }));
    [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (p) {
      gardenChart.appendChild(svgNode("line",
        { x1: X(p), y1: axisY, x2: X(p), y2: axisY + 4, class: "gd__axis" }));
      gardenChart.appendChild(svgText(
        { x: X(p), y: axisY + 17, "text-anchor": "middle" },
        p.toFixed(1), "chart__axis"));
    });
    gardenChart.appendChild(svgText(
      { x: (left + right) / 2, y: axisY + 33, "text-anchor": "middle" },
      "p-value — the data contain no effect at all", "chart__axis"));
  }

  function renderGarden() {
    var cur = currentPath();
    var idx = pathIndex(cur.outcome, cur.exclude, cur.subgroup, cur.covariate);
    var hasRun = Boolean(tried[idx]);

    gardenHeading.textContent = triedOrder.length
      ? triedOrder.length + " of 72 paths run" +
        (hasRun ? " — this one gave p " + fmtP(pathP[idx]) : " — this one not yet")
      : "No analyses run yet";
    drawGarden();

    clear(gardenTable);
    var best = smallestTried();
    [
      ["Outcome", OUTCOME_NAMES[cur.outcome]],
      ["Exclusions", EXCLUSIONS[cur.exclude]],
      ["Participants", SUBGROUPS[cur.subgroup] +
        (cur.covariate === 1 ? ", adjusted for baseline" : "")],
      ["Result of this analysis", hasRun ? "p " + fmtP(pathP[idx]) : "not run yet"],
      ["Paths run so far", String(triedOrder.length)],
      ["Smallest p found so far",
        best === null ? "—" : "p " + fmtP(pathP[best])]
    ].forEach(function (cells) { gardenTable.appendChild(row(cells)); });

    clear(goalChecks);
    [
      ["At least one analysis run", triedOrder.length > 0],
      ["A result below p = .05 found",
        best !== null && pathP[best] < 0.05],
      ["Every path revealed", revealed]
    ].forEach(function (entry) {
      var li = make("li", null, entry[0] + (entry[1] ? " (met)" : " (not yet)"));
      li.setAttribute("data-met", entry[1] ? "yes" : "no");
      goalChecks.appendChild(li);
    });
  }

  function significantCount() {
    return pathP.filter(function (p) { return p < 0.05; }).length;
  }

  outcomeSelect.addEventListener("change", renderGarden);
  excludeSelect.addEventListener("change", renderGarden);
  subgroupSelect.addEventListener("change", renderGarden);
  covariateSelect.addEventListener("change", renderGarden);

  $('[data-action="run-path"]').addEventListener("click", function () {
    var cur = currentPath();
    var idx = pathIndex(cur.outcome, cur.exclude, cur.subgroup, cur.covariate);
    var already = Boolean(tried[idx]);
    if (!already) {
      tried[idx] = true;
      triedOrder.push(idx);
    }
    renderGarden();

    var p = pathP[idx];
    var best = smallestTried();
    var count = triedOrder.length;

    if (p < 0.05) {
      showFeedback(gardenFeedback, "warn",
        "p " + fmtP(p) + " — a significant result, in data with no effect in it.",
        "It took " + count + " analys" + (count === 1 ? "is" : "es") +
        " to get here, and this is the one that would have been written up. " +
        "Nothing you did was fraudulent: choosing an outcome, deciding who to " +
        "exclude, looking at a subgroup and adjusting for a baseline are all " +
        "ordinary decisions, and each one is defensible on its own. What has " +
        "gone is the meaning of the number. A p-value of " + fmt(p, 3) +
        " means \"data at least this extreme would appear " + pct(p) +
        " of the time if nothing were going on and this were the only " +
        "analysis\" - and it was not the only analysis.");
      var next = make("p");
      next.appendChild(make("strong", null, "Now press “Show me every path”. "));
      next.appendChild(document.createTextNode(
        "The question that matters is not whether this analysis was " +
        "reasonable. It is how many other reasonable ones there were, " +
        "including the ones you considered and rejected without running."));
      gardenFeedback.appendChild(next);
    } else if (already) {
      showFeedback(gardenFeedback, "neutral",
        "p " + fmtP(p) + " — you have run this one before.",
        "It gives the same answer, because the dataset has not changed. " +
        count + " distinct path" + (count === 1 ? "" : "s") + " tried so far.");
    } else {
      showFeedback(gardenFeedback, "caution",
        "p " + fmtP(p) + " — nothing there.",
        "Which is the correct answer, since there is nothing to find. " +
        count + " of the 72 paths tried; the smallest p so far is " +
        fmtP(pathP[best]).replace("= ", "") + ". Change one of the four menus " +
        "and try again - and notice how easy it is to think of a reason for " +
        "each change.");
    }
    gardenShell.announce(
      "Analysis run: p " + fmtP(p) + ". " + count + " of 72 paths tried.",
      { immediate: true });
  });

  $('[data-action="reveal-all"]').addEventListener("click", function () {
    revealed = true;
    revealDetails.hidden = false;
    revealDetails.open = true;
    renderGarden();

    var sig = significantCount();
    var best = smallestTried();
    clear(revealTable);
    [
      ["Below .01", pathP.filter(function (p) { return p < 0.01; }).length],
      ["Between .01 and .05", pathP.filter(function (p) {
        return p >= 0.01 && p < 0.05;
      }).length],
      ["Between .05 and .10", pathP.filter(function (p) {
        return p >= 0.05 && p < 0.10;
      }).length],
      ["Above .10", pathP.filter(function (p) { return p >= 0.10; }).length]
    ].forEach(function (cells) {
      revealTable.appendChild(row([cells[0], String(cells[1])]));
    });

    revealNote.textContent =
      "Of the 72 analyses available on this dataset, " + sig +
      " reach p below .05, and the smallest of all of them is p " +
      fmtP(Math.min.apply(null, pathP)).replace("= ", "") + ". Every one of " +
      "those is a false positive, because the data were generated with no " +
      "difference between the groups on anything. You ran " +
      triedOrder.length + (best === null ? "" :
        " and found " + fmtP(pathP[best]).replace("= ", "")) + ". " +
      "Note that the paths are not independent - they share participants and " +
      "correlated outcomes - so no simple correction applies, and note too " +
      "that a real analysis has far more than 72 paths in it. The count here " +
      "is bounded only because a menu had to fit on a page.";

    gardenShell.announce(
      sig + " of the 72 available analyses reach p below .05, and every one " +
      "of them is a false positive.", { immediate: true });
  });

  $('[data-action="fresh"]').addEventListener("click", function () {
    gardenSeed = Math.max(1, (gardenSeed * 7 + 13) % 999983);
    buildGarden(gardenSeed);
    revealDetails.hidden = true;
    revealDetails.open = false;
    gardenFeedback.hidden = true;
    renderGarden();
    gardenShell.announce(
      "A fresh dataset of 90 students has been generated, again with no " +
      "difference between the groups on anything. No paths tried.",
      { immediate: true });
  });

  function openGarden() {
    var wasHidden = gardenSection.hidden;
    gardenSection.hidden = false;
    challengeSection.hidden = false;
    renderGarden();
    if (wasHidden) {
      $("#garden-heading").focus();
      gardenShell.announce(
        "Experiment 2 opened. Choose an analysis and run it.",
        { immediate: true });
    }
  }

  $('[data-action="open-garden"]').addEventListener("click", openGarden);

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    five: {
      tone: "warn",
      verdict: "That is the rate for one test, not for twenty.",
      text:
        "Each individual test has a 5% chance of a false positive, and that " +
        "part is right. The question asked about the family: the chance that " +
        "at least one of the twenty lands. That is 1 minus the chance they " +
        "all miss, which is 1 minus 0.95 to the twentieth power - about 64%."
    },
    twenty: {
      tone: "caution",
      verdict: "Too low, and the arithmetic is worth doing.",
      text:
        "The probability that all twenty miss is 0.95 to the twentieth power, " +
        "which is 0.36. So the probability that at least one lands is about " +
        "64%. Twenty per cent would be roughly the answer for four tests."
    },
    sixtyfour: {
      tone: "good",
      verdict: "Yes — 64.2%, to be exact.",
      text:
        "1 minus 0.95 to the twentieth power. Nearly two experiments in three " +
        "will produce something to write about, in data where there is " +
        "nothing whatsoever to find. And note that the rate passes a half at " +
        "only fourteen tests."
    },
    ninetyfive: {
      tone: "caution",
      verdict: "Too high, though the instinct is right.",
      text:
        "The rate climbs quickly and not that quickly: it is about 64% at " +
        "twenty tests, and would take about 59 tests to reach 95%. Drag k in " +
        "the experiment and watch the predicted figure climb."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openFamily() {
    familySection.hidden = false;
    renderFamily();
    $("#family-heading").focus();
    familyShell.announce(
      "Experiment 1 unlocked, set to the twenty tests from the prediction.",
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
    openFamily();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openFamily();
  });

  /* =======================================================================
     Challenge — four studies, four practices
     ===================================================================== */

  var VIGNETTES = [
    {
      id: "v0", answer: "planned", title: "Study A",
      why:
        "Planned multiplicity. The number of tests was fixed before the data " +
        "existed, the family was named, a correction was specified, and all " +
        "four results were reported. Several tests are not a problem; several " +
        "tests presented as one is."
    },
    {
      id: "v1", answer: "exploratory", title: "Study B",
      why:
        "Exploratory analysis, and entirely legitimate. Twelve variables with " +
        "no prior hypotheses cannot support confirmatory inference, and the " +
        "team does not claim it does: everything measured and everything tried " +
        "is reported, and the finding is labelled as needing an independent " +
        "replication. Exploration is how hypotheses are generated, and the " +
        "only requirement is that it is called by its name."
    },
    {
      id: "v2", answer: "selective", title: "Study C",
      why:
        "Undisclosed selective reporting, and the only one of the four that " +
        "is a problem. Eight analyses were available, one was reported as " +
        "though it were the plan, and the reader has no way to know. The " +
        "p-value of .04 means what it says only if that analysis was the only " +
        "one - which is precisely the claim being made implicitly and " +
        "falsely. Notice that nothing here requires anyone to have intended " +
        "to deceive: this is what Experiment 2 feels like from the inside."
    },
    {
      id: "v3", answer: "confirmatory", title: "Study D",
      why:
        "Confirmatory inference, and the reason preregistration exists. One " +
        "hypothesis, one outcome, one exclusion rule and one analysis, all " +
        "fixed before the data, and the result reported whichever way it came " +
        "out. This is the only route by which a p-value means what it says, " +
        "and publishing the non-significant result is part of what makes it " +
        "work rather than a failure of the study."
    }
  ];

  var LABELS = {
    planned: "planned multiplicity",
    exploratory: "exploratory analysis",
    selective: "undisclosed selective reporting",
    confirmatory: "confirmatory inference"
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = VIGNETTES.map(function (v) { return $("#" + v.id).value; });
    if (chosen.some(function (v) { return !v; })) {
      challengeError.textContent = "Label all four studies before checking.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = VIGNETTES.filter(function (v, i) {
      return chosen[i] === v.answer;
    }).length;

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone",
      right === 4 ? "good" : right >= 2 ? "caution" : "warn");
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", right + " of the four."));
    p.appendChild(document.createTextNode(
      " The study with twelve tests in it is fine and the study with eight is " +
      "not, which is the point: what matters is not how many analyses were " +
      "run but whether the reader knows."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    VIGNETTES.forEach(function (v, i) {
      var li = make("li");
      li.appendChild(make("strong", null,
        v.title + " — " +
        (chosen[i] === v.answer
          ? "correct. "
          : "not " + LABELS[chosen[i]] + ". ")));
      li.appendChild(document.createTextNode(v.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    familyShell.announce(right + " of the four labelled correctly.",
      { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  gardenShell.onReset(function () {
    gardenSeed = GARDEN_SEED;
    buildGarden(gardenSeed);
    outcomeSelect.value = "0";
    excludeSelect.value = "0";
    subgroupSelect.value = "0";
    covariateSelect.value = "0";
    revealDetails.hidden = true;
    revealDetails.open = false;
    gardenFeedback.hidden = true;
    renderGarden();
  });

  familyShell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    familySection.hidden = true;
    gardenSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    kRange.value = String(DEFAULTS.k);
    realRange.value = String(DEFAULTS.real);
    alphaSelect.value = DEFAULTS.alpha;
    correctSelect.value = DEFAULTS.correct;
    seedInput.value = String(DEFAULTS.seed);
    resetTally();
    gardenShell.reset({ silent: true });
    renderFamily();
  });

  familyShell.reset({ silent: true });
  familyShell.announce(
    "Ready. Answer the prediction above to open Experiment 1.",
    { immediate: true });
})();
