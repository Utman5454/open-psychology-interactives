/* =========================================================================
   ANOVA F-Ratio Visualiser
   -------------------------------------------------------------------------
   Two staged experiments, each with its own controls and one primary picture.

   EXPERIMENT 1 — the ratio
   ------------------------
   Three groups of n fictional participants are drawn from normal populations
   with means (52 - s, 52, 52 + s) and a common within-group standard
   deviation. A one-way ANOVA is then computed on the SIMULATED SAMPLE, not on
   the population values, so the numbers on screen are a real analysis of real
   (generated) data and move about when the sample is redrawn.

       SS_between = sum over groups of  n_j * (mean_j - grand mean)^2
       SS_within  = sum over all cases of (x - mean of its group)^2
       df_between = k - 1 = 2          df_within = N - k
       F          = (SS_between / df_between) / (SS_within / df_within)
       p          = P(F(df1, df2) >= observed F)

   When the population means are equal, both mean squares estimate the same
   population variance, so F wanders around 1. When they are not, the
   numerator picks up something the denominator never sees.

   Three separate things move F, and only one of them is the effect: the
   separation of the means, the within-group spread and n. The spread enters
   as its square, and the exact statement is that the amount by which F
   EXCEEDS 1 is divided by four when the within-group standard deviation
   doubles - because E[MS_between] = sigma^2 + n * sum(delta^2)/(k-1) while
   E[MS_within] = sigma^2, so E[F] - 1 is proportional to 1/sigma^2. F itself
   therefore falls to roughly a quarter only when F is comfortably above 1.
   None of this is a measure of how large the difference between the groups
   is, which is why the tool prints the share of variance beside F.

   EXPERIMENT 2 — what F cannot carry
   ----------------------------------
   Three patterns of three group means, constructed to have IDENTICAL
   between-groups sums of squares:

       A  49.0, 52.0, 55.0            evenly spaced,     sum of squared
       B  50.0, 50.0, 55.196          one group high,    deviations = 18
       C  46.804, 52.0, 52.0          one group low,     in every case

   With the same n and the same within-group spread they therefore give
   exactly the same F. A significant omnibus test says the data sit awkwardly
   with "all population means are equal"; it does not say which means differ,
   in which direction, or by how much. Those questions need planned contrasts
   or post-hoc comparisons, which carry their own multiplicity cost.

   The p-values here are tail areas under an assumed model. Everything the
   earlier p-value tool said still applies: p is not the probability the null
   is true, and a large p is not evidence of equivalence.

   Randomness is seeded (mulberry32 with Box-Muller normals). No data leave
   the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var GROUPS = ["A", "B", "C"];
  var GRAND = 52;          // centre of the simulated populations
  var DEFAULTS = { sep: 8, within: 6, n: 30, seed: 4021 };

  /* Experiment 2 is stated in model terms, so its constants are fixed. */
  var P2_N = 30;
  var P2_SD = 6;
  /* The three sets of means are constructed to have identical sums of squared
     deviations from their own grand mean (18 in every case), so that with the
     same n and the same within-group spread they give the same F. */
  var P2_PATTERNS = {
    a: { description: "evenly spaced", means: [49, 52, 55] },
    b: { description: "one group high", means: [50, 50, 55.196152] },
    c: { description: "one group low", means: [46.803848, 52, 52] }
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
     The F distribution
     -------------------------------------------------------------------
     P(F >= f) = I_x(df2/2, df1/2) with x = df2 / (df2 + df1 * f), where I is
     the regularised incomplete beta function. Continued-fraction evaluation
     after Numerical Recipes; log-gamma by the Lanczos approximation.
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

  function fTail(f, df1, df2) {
    if (!(f > 0)) { return 1; }
    return betai(df2 / 2, df1 / 2, df2 / (df2 + df1 * f));
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

  var ratioShell = InteractiveShell.attach("#ratio");
  var patternShell = InteractiveShell.attach("#pattern");
  if (!ratioShell || !patternShell) { return; }

  var sepRange = $("#sep-range");
  var withinRange = $("#within-range");
  var nRange = $("#n-range");
  var presetSelect = $("#preset-select");
  var seedInput = $("#seed-input");
  var chartHeading = $("[data-chart-heading]");
  var strip = $("[data-strip]");
  var groupTable = $("[data-group-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var sourceTable = $("[data-source-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var ratioSection = $("#ratio-section");
  var patternSection = $("#pattern-section");

  var patternHeading = $("[data-pattern-heading]");
  var patternChart = $("[data-pattern-chart]");
  var patternTable = $("[data-pattern-table]");
  var patternFeedback = $("[data-pattern-feedback]");
  var patternError = $("[data-pattern-error]");
  var revealTable = $("[data-reveal-table]");
  var allPatternsTable = $("[data-all-patterns-table]");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     Experiment 1 — simulate and analyse
     ===================================================================== */

  var sample = null;   // { groups: [{values, jitter, mean, sd}], ... }

  function settings() {
    return {
      sep: Number(sepRange.value),
      within: Number(withinRange.value),
      n: Number(nRange.value)
    };
  }

  function drawSample() {
    var s = settings();
    var seed = Math.max(1, Math.round(Number(seedInput.value) || 1));
    var random = mulberry32(seed);
    var trueMeans = [GRAND - s.sep, GRAND, GRAND + s.sep];
    var groups = trueMeans.map(function (mu) {
      var values = [];
      var jitter = [];
      for (var i = 0; i < s.n; i += 1) {
        values.push(mu + normal(random) * s.within);
        jitter.push(random() * 2 - 1);
      }
      var mean = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
      var ss = values.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0);
      return {
        values: values, jitter: jitter, mean: mean,
        sd: Math.sqrt(ss / (values.length - 1)), ss: ss
      };
    });
    sample = { groups: groups, trueMeans: trueMeans, n: s.n };
  }

  function anova() {
    var groups = sample.groups;
    var k = groups.length;
    var total = 0;
    var count = 0;
    groups.forEach(function (g) {
      total += g.mean * g.values.length;
      count += g.values.length;
    });
    var grand = total / count;
    var ssBetween = 0;
    var ssWithin = 0;
    groups.forEach(function (g) {
      ssBetween += g.values.length * (g.mean - grand) * (g.mean - grand);
      ssWithin += g.ss;
    });
    var dfB = k - 1;
    var dfW = count - k;
    var msB = ssBetween / dfB;
    var msW = ssWithin / dfW;
    var f = msW > 0 ? msB / msW : 0;
    return {
      grand: grand, ssBetween: ssBetween, ssWithin: ssWithin,
      dfB: dfB, dfW: dfW, msB: msB, msW: msW, f: f,
      p: fTail(f, dfB, dfW),
      eta: ssBetween / (ssBetween + ssWithin)
    };
  }

  function renderStrip(a) {
    var left = 40;
    var right = 450;
    var top = 12;
    var base = 176;

    clear(strip);

    var all = [];
    sample.groups.forEach(function (g) {
      all = all.concat(g.values);
    });
    var lo = Math.min.apply(null, all);
    var hi = Math.max.apply(null, all);
    var pad = Math.max(2, (hi - lo) * 0.06);
    lo -= pad;
    hi += pad;

    var y = function (value) {
      return base - ((value - lo) / (hi - lo)) * (base - top);
    };
    var colW = (right - left) / 3;

    // Y axis with ticks.
    strip.appendChild(svgNode("line", {
      x1: left, y1: top, x2: left, y2: base, class: "strip__axis"
    }));
    var tickStep = (hi - lo) > 60 ? 20 : (hi - lo) > 30 ? 10 : 5;
    var first = Math.ceil(lo / tickStep) * tickStep;
    for (var v = first; v <= hi; v += tickStep) {
      strip.appendChild(svgNode("line", {
        x1: left - 4, y1: y(v), x2: left, y2: y(v), class: "strip__axis"
      }));
      strip.appendChild(svgText(
        { x: left - 7, y: y(v) + 4, "text-anchor": "end" },
        String(Math.round(v)), "chart__axis"));
    }

    // Grand mean across the whole plot.
    strip.appendChild(svgNode("line", {
      x1: left, y1: y(a.grand), x2: right, y2: y(a.grand), class: "strip__grand"
    }));
    strip.appendChild(svgText(
      { x: right, y: y(a.grand) - 5, "text-anchor": "end" },
      "grand mean " + fmt(a.grand, 1), "chart__axis"));

    sample.groups.forEach(function (g, i) {
      var cx = left + (i + 0.5) * colW;
      g.values.forEach(function (value, j) {
        strip.appendChild(svgNode("circle", {
          cx: cx + g.jitter[j] * colW * 0.3, cy: y(value), r: 2.4,
          class: "strip__dot"
        }));
      });
      // The between-groups reach: this mean's distance from the grand mean.
      strip.appendChild(svgNode("line", {
        x1: cx, y1: y(a.grand), x2: cx, y2: y(g.mean), class: "strip__reach"
      }));
      strip.appendChild(svgNode("line", {
        x1: cx - colW * 0.36, y1: y(g.mean), x2: cx + colW * 0.36, y2: y(g.mean),
        class: "strip__mean"
      }));
      strip.appendChild(svgText(
        { x: cx, y: base + 17, "text-anchor": "middle" },
        "Group " + GROUPS[i], "chart__label"));
      strip.appendChild(svgText(
        { x: cx, y: base + 32, "text-anchor": "middle" },
        "mean " + fmt(g.mean, 1), "chart__axis"));
    });

    strip.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "strip__axis"
    }));
    strip.appendChild(svgText(
      { x: left - 7, y: top + 4, "text-anchor": "end" },
      "score", "chart__axis"));
  }

  function renderGroupTable() {
    clear(groupTable);
    sample.groups.forEach(function (g, i) {
      groupTable.appendChild(row([
        "Group " + GROUPS[i],
        String(g.values.length),
        fmt(g.mean, 1),
        fmt(g.sd, 1)
      ]));
    });
  }

  function renderReadout(a) {
    clear(readout);
    [
      ["F ratio", fmt(a.f)],
      ["Degrees of freedom", a.dfB + ", " + a.dfW],
      ["Tail area", "p " + fmtP(a.p)],
      ["Variance accounted for", (100 * a.eta).toFixed(1) + "%"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderSourceTable(a) {
    clear(sourceTable);
    [
      ["Between groups", fmt(a.ssBetween, 1), String(a.dfB), fmt(a.msB, 1)],
      ["Within groups", fmt(a.ssWithin, 1), String(a.dfW), fmt(a.msW, 1)],
      ["Total", fmt(a.ssBetween + a.ssWithin, 1),
        String(a.dfB + a.dfW), "—"]
    ].forEach(function (cells) {
      sourceTable.appendChild(row(cells));
    });
  }

  function renderInterpretation(a) {
    var s = settings();
    var tone;
    var text;

    if (s.sep === 0) {
      tone = "neutral";
      text =
        "The three populations are identical: every difference between the " +
        "bars is sampling noise. F came out at " + fmt(a.f) + ", p " +
        fmtP(a.p) + ". Draw a new sample four or five times and watch it " +
        "bounce around 1. That is what F does when nothing is going on, " +
        "because both halves of the fraction are then estimating the same " +
        "population variance.";
    } else if (a.f < 1.5) {
      tone = "caution";
      text =
        "F = " + fmt(a.f) + ", p " + fmtP(a.p) + ". The population means " +
        "really do differ - the separation slider is at " + fmt(s.sep, 1) +
        " - and this sample cannot see it, because the within-group spread " +
        "of " + s.within + " swamps a gap of that size at n = " + s.n + " per " +
        "group. Note carefully what has not happened: nothing has shown the " +
        "groups to be the same.";
    } else if (a.p > 0.05) {
      tone = "caution";
      text =
        "F = " + fmt(a.f) + ", p " + fmtP(a.p) + ", with " +
        (100 * a.eta).toFixed(1) + "% of the total variation lying between " +
        "the groups. A real difference is present in the populations and this " +
        "sample has not established it. Raise n and watch F climb with the " +
        "separation untouched - which is the clearest evidence you will get " +
        "that F is not a measure of how big the difference is.";
    } else {
      tone = "good";
      text =
        "F = " + fmt(a.f) + ", p " + fmtP(a.p) + ". The between-groups mean " +
        "square is " + fmt(a.f) + " times the within-groups mean square, and " +
        (100 * a.eta).toFixed(1) + "% of the total variation lies between the " +
        "groups. Say the modest thing: these data sit awkwardly with all " +
        "three population means being equal. They do not say which groups " +
        "differ - Experiment 2 is about exactly that - and they do not say " +
        "the difference is large.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);
  }

  function renderRatio() {
    var a = anova();
    var s = settings();
    chartHeading.textContent =
      "Three simulated groups of " + s.n + ", within-group SD " + s.within;
    renderStrip(a);
    renderGroupTable();
    renderReadout(a);
    renderSourceTable(a);
    renderInterpretation(a);
    return a;
  }

  function refresh(redraw) {
    if (redraw !== false) { drawSample(); }
    return renderRatio();
  }

  /* Set while a preset is writing to the sliders, so that the input events it
     fires do not knock the preset menu back to "Current settings". */
  var applyingPreset = false;

  function onControlChange() {
    if (applyingPreset) { return; }
    presetSelect.value = "custom";
    refresh();
  }

  ratioShell.bindRange(sepRange, {
    format: function (v) { return fmt(v, 1); },
    describe: function (v) {
      return v === 0
        ? "no separation: all three population means are 52"
        : "population means " + fmt(GRAND - v, 1) + ", 52.0 and " +
          fmt(GRAND + v, 1);
    },
    onInput: onControlChange
  });

  ratioShell.bindRange(withinRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "within-group standard deviation " + v + " points"; },
    onInput: onControlChange
  });

  ratioShell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " participants in each group"; },
    onInput: onControlChange
  });

  var PRESETS = {
    study1: { sep: 8, within: 6, n: 30,
      note: "The first study from the prediction: population means 44, 52 and " +
        "60, within-group SD 6." },
    study2: { sep: 8, within: 12, n: 30,
      note: "The same three population means with the within-group spread " +
        "doubled. The amount by which F exceeds 1 is divided by four, because " +
        "the denominator is a variance and variances scale with the square." },
    "null": { sep: 0, within: 8, n: 30,
      note: "Three identical populations. Draw new samples and watch F " +
        "bounce around 1 - and occasionally, by chance, well above it." },
    bign: { sep: 1.5, within: 8, n: 60,
      note: "A difference of one and a half points either side of 52, which " +
        "nobody would act on, at sixty per group. Read the p-value, then read " +
        "the percentage of variance beside it." }
  };

  presetSelect.addEventListener("change", function () {
    var preset = PRESETS[presetSelect.value];
    if (!preset) { return; }
    applyingPreset = true;
    sepRange.value = String(preset.sep);
    withinRange.value = String(preset.within);
    nRange.value = String(preset.n);
    // Re-sync the <output> elements: assigning to value fires no input event.
    [sepRange, withinRange, nRange].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    applyingPreset = false;
    var a = refresh();
    ratioShell.announce(preset.note + " F = " + fmt(a.f) + ", p " + fmtP(a.p) + ".",
      { immediate: true });
  });

  seedInput.addEventListener("change", function () { refresh(); });

  $('[data-action="resample"]').addEventListener("click", function () {
    // A new sample means a new seed, kept visible so the run is reproducible.
    var next = (Math.round(Number(seedInput.value) || 1) * 7 + 13) % 999983;
    seedInput.value = String(Math.max(1, next));
    var a = refresh();
    ratioShell.announce(
      "New sample drawn with seed " + seedInput.value + ". F = " + fmt(a.f) +
      ", p " + fmtP(a.p) + ", with group means " +
      sample.groups.map(function (g) { return fmt(g.mean, 1); }).join(", ") + ".",
      { immediate: true });
  });

  /* =======================================================================
     Experiment 2 — three patterns, one F
     ===================================================================== */

  var patternAnswered = false;

  function patternStats(key) {
    var means = P2_PATTERNS[key].means;
    var grand = (means[0] + means[1] + means[2]) / 3;
    var ssBetween = 0;
    means.forEach(function (m) { ssBetween += P2_N * (m - grand) * (m - grand); });
    var msB = ssBetween / 2;
    var msW = P2_SD * P2_SD;          // the model states the within-group variance
    var f = msB / msW;
    return {
      means: means, grand: grand, ssBetween: ssBetween, f: f,
      p: fTail(f, 2, 3 * P2_N - 3)
    };
  }

  function currentPatternKey() {
    var checked = $('input[name="pattern"]:checked', patternShell.controls);
    return checked ? checked.value : "a";
  }

  function renderPatternChart(key) {
    var left = 46;
    var right = 450;
    var top = 18;
    var base = 118;
    var AXIS_LO = 42;
    var AXIS_HI = 60;
    var stats = patternStats(key);

    clear(patternChart);

    var x = function (value) {
      return left + ((value - AXIS_LO) / (AXIS_HI - AXIS_LO)) * (right - left);
    };
    var rowY = [34, 62, 90];

    // Grand mean for this pattern.
    patternChart.appendChild(svgNode("line", {
      x1: x(stats.grand), y1: top, x2: x(stats.grand), y2: base,
      class: "pattern__grand"
    }));
    patternChart.appendChild(svgText(
      { x: x(stats.grand), y: top - 4, "text-anchor": "middle" },
      "grand mean " + fmt(stats.grand, 1), "chart__axis"));

    stats.means.forEach(function (m, i) {
      var y = rowY[i];
      patternChart.appendChild(svgNode("line", {
        x1: x(Math.max(AXIS_LO, m - P2_SD)), y1: y,
        x2: x(Math.min(AXIS_HI, m + P2_SD)), y2: y,
        class: "pattern__spread"
      }));
      [m - P2_SD, m + P2_SD].forEach(function (v) {
        if (v < AXIS_LO || v > AXIS_HI) { return; }
        patternChart.appendChild(svgNode("line", {
          x1: x(v), y1: y - 6, x2: x(v), y2: y + 6, class: "pattern__cap"
        }));
      });
      patternChart.appendChild(svgNode("circle", {
        cx: x(m), cy: y, r: 5.5, class: "pattern__mean"
      }));
      patternChart.appendChild(svgText(
        { x: left - 8, y: y + 4, "text-anchor": "end" },
        "Group " + GROUPS[i], "chart__label"));
      patternChart.appendChild(svgText(
        { x: x(m), y: y - 11, "text-anchor": "middle" },
        fmt(m, 1), "chart__axis"));
    });

    patternChart.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "strip__axis"
    }));
    for (var v2 = 44; v2 <= 60; v2 += 4) {
      patternChart.appendChild(svgNode("line", {
        x1: x(v2), y1: base, x2: x(v2), y2: base + 4, class: "strip__axis"
      }));
      patternChart.appendChild(svgText(
        { x: x(v2), y: base + 17, "text-anchor": "middle" },
        String(v2), "chart__axis"));
    }
    patternChart.appendChild(svgText(
      { x: (left + right) / 2, y: base + 33, "text-anchor": "middle" },
      "test score, with one within-group SD either side of each mean",
      "chart__axis"));
  }

  function renderPatternTable(key) {
    var stats = patternStats(key);
    clear(patternTable);
    stats.means.forEach(function (m, i) {
      var d = m - stats.grand;
      patternTable.appendChild(row([
        "Group " + GROUPS[i],
        fmt(m, 1),
        (d >= 0 ? "+" : "−") + fmt(Math.abs(d), 2)
      ]));
    });
  }

  function renderPattern() {
    var key = currentPatternKey();
    var stats = patternStats(key);
    patternHeading.textContent =
      "Pattern " + key.toUpperCase() + ", " + P2_PATTERNS[key].description +
      (patternAnswered ? " — F = " + fmt(stats.f) : " — F still hidden");
    renderPatternChart(key);
    renderPatternTable(key);
  }

  $$('input[name="pattern"]', patternShell.controls).forEach(function (input) {
    input.addEventListener("change", function () {
      renderPattern();
      var key = currentPatternKey();
      patternShell.announce(
        "Showing pattern " + key.toUpperCase() + ": group means " +
        P2_PATTERNS[key].means.map(function (m) { return fmt(m, 1); }).join(", ") +
        ".", { immediate: true });
    });
  });

  function fillAllPatterns() {
    clear(allPatternsTable);
    ["a", "b", "c"].forEach(function (key) {
      var stats = patternStats(key);
      allPatternsTable.appendChild(row([
        "Pattern " + key.toUpperCase(),
        stats.means.map(function (m) { return fmt(m, 1); }).join(", "),
        fmt(stats.ssBetween, 1),
        fmt(stats.f)
      ]));
    });
  }

  $('[data-action="check-pattern"]').addEventListener("click", function () {
    var chosen = $('input[name="answer"]:checked', patternShell.controls);
    if (!chosen) {
      patternError.textContent = "Choose one of the four answers before committing.";
      patternError.hidden = false;
      return;
    }
    patternError.hidden = true;
    patternAnswered = true;
    revealTable.hidden = false;
    renderPattern();

    var right = chosen.value === "any";
    var lead = right
      ? "Yes — there is no way to tell."
      : "Not pattern " + chosen.value.toUpperCase() + ", or rather: not only " +
        "pattern " + chosen.value.toUpperCase() + ".";
    var body =
      "All three patterns have a between-groups sum of squares of exactly " +
      "540.0, so with 30 people per group and a within-group standard " +
      "deviation of 6 they all give F(2, 87) = 7.50. Open the table below and " +
      "check. The three shapes are quite different - evenly spaced, one group " +
      "above, one group below - and F cannot separate them, because it is " +
      "built from the squared distances of the means from the grand mean and " +
      "squaring discards both the direction and the arrangement.";
    showFeedback(patternFeedback, right ? "good" : "caution", lead, body);

    var next = make("p");
    next.appendChild(make("strong", null, "So what would tell you? "));
    next.appendChild(document.createTextNode(
      "A planned contrast, if you knew before collecting the data which " +
      "comparison you cared about, or a post-hoc comparison with an " +
      "adjustment if you did not. Both answer a different question from the " +
      "omnibus test, and both are separate decisions that have to be " +
      "declared, because every extra comparison has its own error rate."));
    patternFeedback.appendChild(next);

    patternShell.announce(lead + " All three patterns give F = 7.50.",
      { immediate: true });
  });

  patternShell.onReset(function () {
    patternAnswered = false;
    revealTable.hidden = true;
    revealTable.open = false;
    patternFeedback.hidden = true;
    patternError.hidden = true;
    $$('input[name="answer"]', patternShell.controls).forEach(function (input) {
      input.checked = false;
    });
    $$('input[name="pattern"]', patternShell.controls).forEach(function (input, i) {
      input.checked = i === 0;
    });
    renderPattern();
  });

  function openPatterns() {
    var wasHidden = patternSection.hidden;
    patternSection.hidden = false;
    renderPattern();
    if (wasHidden) {
      $("#pattern-heading").focus();
      patternShell.announce(
        "Experiment 2 opened. Browse the three patterns, then commit to an " +
        "answer.", { immediate: true });
    }
  }

  $('[data-action="open-two"]').addEventListener("click", openPatterns);

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    same: {
      tone: "caution",
      verdict: "No — and this is the half of F that gets forgotten.",
      text:
        "F is a ratio, so it responds to the denominator as well as the " +
        "numerator. Identical group means with noisier groups mean the same " +
        "signal against more noise, and F falls. Set the separation to 4 and " +
        "then drag the within-group SD from 4 to 8 to watch it happen."
    },
    half: {
      tone: "caution",
      verdict: "The right direction, and not far enough.",
      text:
        "F falls by more than half. The denominator is a mean SQUARE - a " +
        "variance - so doubling the standard deviation multiplies it by four. " +
        "Precisely, the amount by which F exceeds 1 is divided by four: for " +
        "this study F drops from about 54 on average to about 14. Compare the " +
        "first two presets in the worked-examples menu."
    },
    quarter: {
      tone: "good",
      verdict: "Yes — because the denominator is a variance.",
      text:
        "Doubling the within-group standard deviation quadruples the " +
        "within-groups mean square. Stated exactly, it is the amount by " +
        "which F exceeds 1 that divides by four, so for the study described " +
        "above F falls from about 54 on average to about 14 - close to a " +
        "quarter, and closer the larger F was to begin with. Sample-to-sample " +
        "wobble means no single run lands on the expected value, which is " +
        "worth watching too."
    },
    double: {
      tone: "warn",
      verdict: "The opposite, and the reason is worth stating precisely.",
      text:
        "Extra within-group variation is not extra signal - it is the noise " +
        "the signal has to be judged against, and it sits in the denominator. " +
        "More of it makes the same separation of means less impressive, not " +
        "more. Drag the within-group SD and watch F fall."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openRatio() {
    ratioSection.hidden = false;
    refresh();
    $("#ratio-heading").focus();
    ratioShell.announce(
      "Experiment 1 unlocked. A first sample has been drawn.", { immediate: true });
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
    openRatio();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openRatio();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_NOTES = {
    notall: {
      correct: true,
      text:
        "Correct, and it is almost the whole of what the omnibus test says. " +
        "Note how modest it is: not all equal, under a model assuming normal " +
        "populations, equal variances and independent observations."
    },
    allthree: {
      correct: false,
      text:
        "Wrong. Pattern B in Experiment 2 has two identical group means and " +
        "produces the same F = 7.50. The test cannot distinguish 'one group " +
        "differs' from 'all three differ'."
    },
    direction: {
      correct: false,
      text:
        "Wrong. F is built from squared deviations, so direction has already " +
        "been discarded by the time the number exists. Pattern C - where the " +
        "lowest group is the odd one out - gives the identical F."
    },
    ratio: {
      correct: true,
      text:
        "Correct, and it is worth saying out loud, because it is literally " +
        "the definition: F is the between-groups mean square divided by the " +
        "within-groups mean square. Open the source table in Experiment 1 and " +
        "check the division for yourself."
    },
    large: {
      correct: false,
      text:
        "Wrong. F rises with the sample size at a fixed separation, so it " +
        "confounds size with precision exactly as a p-value does. The 'Tiny " +
        "difference, large sample' preset produces a small p and a trivial " +
        "difference. Size is what eta squared, omega squared or a plain mean " +
        "difference in points is for."
    },
    ttests: {
      correct: false,
      text:
        "Wrong in both directions. Three pairwise t-tests ask three separate " +
        "questions rather than the one the omnibus test asks, and running " +
        "them raises the chance of at least one false positive above the " +
        "nominal level. The connection is real but narrower: with only TWO " +
        "groups, F is exactly t squared."
    },
    equivalent: {
      correct: false,
      text:
        "Wrong. A non-significant F means the data are compatible with equal " +
        "population means; they are usually also compatible with differences " +
        "worth caring about. Set the separation to 1.5 with 5 per group and " +
        "look at what a non-significant result is hiding. Showing that groups " +
        "are similar enough needs an equivalence test against a threshold set " +
        "in advance."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one statement.",
        "Two of the seven are correct.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) {
      return !CHALLENGE_NOTES[v].correct;
    });
    var missed = ["notall", "ratio"].filter(function (v) {
      return chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : missed.length ? "caution" : "good";
    var verdictText;
    if (wrongPicked.length) {
      verdictText = "At least one of these reads a direction, a pattern or a " +
        "size off a single squared ratio.";
    } else if (missed.length) {
      verdictText = "Everything you picked is right, and one of the two " +
        "correct statements is still unselected.";
    } else {
      verdictText = "Yes — both correct statements, and none of the five " +
        "over-readings.";
    }

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " The five incorrect statements are the five things a significant F is " +
      "most often taken to mean in write-ups."));
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
    ratioShell.announce(verdictText, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  ratioShell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    ratioSection.hidden = true;
    patternSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    sepRange.value = String(DEFAULTS.sep);
    withinRange.value = String(DEFAULTS.within);
    nRange.value = String(DEFAULTS.n);
    seedInput.value = String(DEFAULTS.seed);
    presetSelect.value = "custom";
    patternShell.reset({ silent: true });
    drawSample();
    renderRatio();
  });

  fillAllPatterns();
  ratioShell.reset({ silent: true });
  ratioShell.announce(
    "Ready. Answer the prediction above to open Experiment 1.",
    { immediate: true });
})();
