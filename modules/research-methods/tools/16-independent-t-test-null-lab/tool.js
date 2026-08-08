/* =========================================================================
   Independent-Samples t-Test: The Null Distribution
   -------------------------------------------------------------------------
   The tool works from summary statistics, because that is all a t-test needs:
   two means, two standard deviations and a sample size.

       pooled SD = sqrt((sA^2 + sB^2) / 2)          [equal group sizes]
       SE        = pooled SD * sqrt(2 / n)
       t         = (meanB - meanA) / SE
       df        = 2n - 2
       d         = (meanB - meanA) / pooled SD
       p         = I_{df/(df + t^2)}(df/2, 1/2)      [two-tailed]

   The picture is the distribution of t when the two POPULATION means are
   equal. The tails beyond the observed statistic are shaded - that area is p -
   the critical values are dashed rules, and the standard normal is drawn
   faintly behind so the heavier tails of t at small df can be seen rather
   than asserted.

   THE SAMPLE SIZE LIVES IN THE DENOMINATOR ONLY
   ---------------------------------------------
   Moving n changes SE, t, df and p. It cannot change the mean difference or
   Cohen's d, because d divides by the spread of individual people rather than
   by the spread of sample means. That is the entire distinction between an
   effect size and a test statistic, and the two preset buttons put the same
   two groups at 15 and at 100 per group so it can be read off twice.

   CRITICAL VALUES
   ---------------
   Found by bisection on the two-tailed tail area, which is exact to the
   precision printed and avoids needing a separate inverse-t routine. The same
   value gives the confidence interval for the mean difference.

   WORDING
   -------
   The decision is always written as "reject" or "fail to reject", never
   "accept the null". p is never described as the probability that the null is
   true; the calculation begins by assuming it.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var MEAN_A = 50;
  var T_AXIS = 4.6;      // half-width of the plotted t axis
  var DEFAULTS = { meanB: 55, sdA: 10, sdB: 10, n: 15, alpha: "0.05" };

  /* =======================================================================
     Distributions
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

  /** Two-tailed tail area of Student's t. */
  function tTwoTail(t, df) {
    var abs = Math.abs(t);
    if (abs === 0) { return 1; }
    return betai(df / 2, 0.5, df / (df + abs * abs));
  }

  /** Critical |t| for a two-tailed test, by bisection on the tail area. */
  function tCritical(alpha, df) {
    var lo = 0;
    var hi = 200;
    for (var i = 0; i < 80; i += 1) {
      var mid = (lo + hi) / 2;
      if (tTwoTail(mid, df) > alpha) { lo = mid; } else { hi = mid; }
    }
    return (lo + hi) / 2;
  }

  function tDensity(t, df) {
    return Math.exp(
      logGamma((df + 1) / 2) - logGamma(df / 2) -
      0.5 * Math.log(df * Math.PI) -
      ((df + 1) / 2) * Math.log(1 + t * t / df));
  }

  function normalDensity(t) {
    return Math.exp(-0.5 * t * t) / Math.sqrt(2 * Math.PI);
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
    if (p > 0.9995) { return "= 1.000"; }
    return "= " + p.toFixed(3).replace(/^0/, "");
  }

  function signed(value, places) {
    var pl = places === undefined ? 2 : places;
    if (Math.abs(value) < Math.pow(10, -pl) / 2) { return (0).toFixed(pl); }
    return (value > 0 ? "+" : "−") + Math.abs(value).toFixed(pl);
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

  var shell = InteractiveShell.attach("#ttest");
  if (!shell) { return; }

  var meanBRange = $("#mean-b-range");
  var sdARange = $("#sd-a-range");
  var sdBRange = $("#sd-b-range");
  var nRange = $("#n-range");
  var alphaSelect = $("#alpha-select");
  var chartHeading = $("[data-chart-heading]");
  var nullSvg = $("[data-null]");
  var nullTable = $("[data-null-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var assumption = $("[data-assumption]");
  var dfNote = $("[data-df-note]");
  var extraTable = $("[data-extra-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     The test
     ===================================================================== */

  function settings() {
    return {
      meanB: Number(meanBRange.value),
      sdA: Number(sdARange.value),
      sdB: Number(sdBRange.value),
      n: Number(nRange.value),
      alpha: Number(alphaSelect.value)
    };
  }

  function results() {
    var s = settings();
    var diff = s.meanB - MEAN_A;
    var pooled = Math.sqrt((s.sdA * s.sdA + s.sdB * s.sdB) / 2);
    var se = pooled * Math.sqrt(2 / s.n);
    var t = se > 0 ? diff / se : 0;
    var df = 2 * s.n - 2;
    var crit = tCritical(s.alpha, df);
    return {
      s: s, diff: diff, pooled: pooled, se: se, t: t, df: df,
      d: pooled > 0 ? diff / pooled : 0,
      p: tTwoTail(t, df),
      crit: crit,
      ciLo: diff - crit * se,
      ciHi: diff + crit * se,
      reject: Math.abs(t) >= crit
    };
  }

  /* =======================================================================
     Drawing
     ===================================================================== */

  var PLOT = { left: 30, right: 448, top: 14, base: 150 };

  function xAt(t) {
    return PLOT.left + ((t + T_AXIS) / (2 * T_AXIS)) * (PLOT.right - PLOT.left);
  }

  function renderChart(r) {
    var peak = tDensity(0, r.df);
    var scale = Math.max(peak, normalDensity(0));
    var yAt = function (d) {
      return PLOT.base - (d / (scale * 1.08)) * (PLOT.base - PLOT.top);
    };

    clear(nullSvg);

    var steps = 240;
    var tPoints = [];
    var zPoints = [];
    for (var i = 0; i <= steps; i += 1) {
      var t = -T_AXIS + (2 * T_AXIS) * (i / steps);
      tPoints.push([xAt(t), yAt(tDensity(t, r.df))]);
      zPoints.push([xAt(t), yAt(normalDensity(t))]);
    }
    function toPath(points) {
      return points.map(function (p, idx) {
        return (idx === 0 ? "M" : "L") + fmt(p[0], 1) + " " + fmt(p[1], 1);
      }).join(" ");
    }

    // The shaded tails: everything at least as far from zero as the observed
    // statistic. That area is the two-tailed p.
    var absT = Math.min(Math.abs(r.t), T_AXIS);
    [[-T_AXIS, -absT], [absT, T_AXIS]].forEach(function (span) {
      if (span[1] - span[0] <= 0.001) { return; }
      var pts = [];
      var n = 60;
      for (var j = 0; j <= n; j += 1) {
        var v = span[0] + (span[1] - span[0]) * (j / n);
        pts.push([xAt(v), yAt(tDensity(v, r.df))]);
      }
      nullSvg.appendChild(svgNode("path", {
        d: "M" + fmt(xAt(span[0]), 1) + " " + PLOT.base + " " +
          toPath(pts).slice(1) + " L" + fmt(xAt(span[1]), 1) + " " +
          PLOT.base + " Z",
        class: "nd__tail"
      }));
      for (var hx = xAt(span[0]) + 3; hx < xAt(span[1]); hx += 7) {
        var value = -T_AXIS + ((hx - PLOT.left) / (PLOT.right - PLOT.left)) *
          (2 * T_AXIS);
        var topY = yAt(tDensity(value, r.df));
        if (PLOT.base - topY < 2) { continue; }
        nullSvg.appendChild(svgNode("line",
          { x1: hx, y1: PLOT.base, x2: hx, y2: topY, class: "nd__hatch" }));
      }
    });

    nullSvg.appendChild(svgNode("path", { d: toPath(zPoints), class: "nd__normal" }));
    nullSvg.appendChild(svgNode("path", { d: toPath(tPoints), class: "nd__curve" }));

    // Critical values.
    [-r.crit, r.crit].forEach(function (c) {
      if (Math.abs(c) > T_AXIS) { return; }
      nullSvg.appendChild(svgNode("line", {
        x1: xAt(c), y1: PLOT.top, x2: xAt(c), y2: PLOT.base + 4,
        class: "nd__critical"
      }));
    });
    if (r.crit <= T_AXIS) {
      nullSvg.appendChild(svgText(
        { x: xAt(r.crit) + 4, y: PLOT.top + 10, "text-anchor": "start" },
        "critical ±" + fmt(r.crit), "chart__label"));
    }

    // The observed statistic.
    var shown = Math.max(-T_AXIS, Math.min(T_AXIS, r.t));
    nullSvg.appendChild(svgNode("line", {
      x1: xAt(shown), y1: PLOT.top - 2, x2: xAt(shown), y2: PLOT.base + 6,
      class: "nd__observed"
    }));
    nullSvg.appendChild(svgText(
      { x: xAt(shown) + (shown > 0 ? -5 : 5), y: PLOT.top + 26,
        "text-anchor": shown > 0 ? "end" : "start" },
      "observed t = " + fmt(r.t) +
        (Math.abs(r.t) > T_AXIS ? " (off the axis)" : ""), "chart__label"));

    nullSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base,
        class: "nd__axis" }));
    for (var v2 = -4; v2 <= 4; v2 += 1) {
      nullSvg.appendChild(svgNode("line",
        { x1: xAt(v2), y1: PLOT.base, x2: xAt(v2), y2: PLOT.base + 4,
          class: "nd__axis" }));
      nullSvg.appendChild(svgText(
        { x: xAt(v2), y: PLOT.base + 17, "text-anchor": "middle" },
        String(v2), "chart__axis"));
    }
    nullSvg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 33,
        "text-anchor": "middle" },
      "t, if the two population means were equal — dashed curve is the normal",
      "chart__axis"));
  }

  function renderTables(r) {
    clear(nullTable);
    [
      ["Observed t", fmt(r.t) + " on " + r.df + " df"],
      ["Critical value at α = " + r.s.alpha, "±" + fmt(r.crit)],
      ["Two-tailed p", "p " + fmtP(r.p)],
      ["Decision", r.reject
        ? "reject H₀ at α = " + r.s.alpha
        : "fail to reject H₀ at α = " + r.s.alpha]
    ].forEach(function (cells) { nullTable.appendChild(row(cells)); });

    clear(extraTable);
    var level = Math.round((1 - r.s.alpha) * 1000) / 10;
    [
      ["Mean difference", signed(r.diff, 1) + " points"],
      [level + "% interval for the difference",
        "[" + fmt(r.ciLo, 1) + ", " + fmt(r.ciHi, 1) + "]"],
      ["Critical value from t", "±" + fmt(r.crit)],
      ["Critical value from the normal", "±" + fmt(tCritical(r.s.alpha, 100000))]
    ].forEach(function (cells) { extraTable.appendChild(row(cells)); });

    dfNote.textContent =
      "With " + r.df + " degrees of freedom the critical value is " +
      fmt(r.crit) + ", against " + fmt(tCritical(r.s.alpha, 100000)) +
      " for the normal distribution the t curve is approaching. The gap is " +
      "what it costs to estimate the standard deviation from the same small " +
      "sample that produced the means, and it closes as the study grows. " +
      "Note also that the interval above excludes zero exactly when the test " +
      "rejects: they are the same statement made twice, and the interval is " +
      "the more informative of the two because it names the values the data " +
      "are compatible with.";
  }

  function renderReadout(r) {
    clear(readout);
    [
      ["Mean difference", signed(r.diff, 1)],
      ["Standard error", fmt(r.se)],
      ["t (" + r.df + " df)", fmt(r.t)],
      ["Cohen's d", fmt(r.d)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderVerdict(r) {
    var tone;
    var text;
    var stat = "t(" + r.df + ") = " + fmt(r.t) + ", p " + fmtP(r.p) +
      ", d = " + fmt(r.d);

    if (r.reject) {
      tone = "good";
      text =
        "The groups differed significantly, " + stat + ", " +
        Math.round((1 - r.s.alpha) * 100) + "% CI for the difference [" +
        fmt(r.ciLo, 1) + ", " + fmt(r.ciHi, 1) + "]. That sentence is the " +
        "whole of what the test licenses. It does not say the difference is " +
        "important - d = " + fmt(r.d) + " and the interval are what speak to " +
        "that - and p is not the probability that the null is false.";
    } else if (r.p > 0.5) {
      tone = "neutral";
      text =
        "The groups did not differ significantly, " + stat + ", " +
        Math.round((1 - r.s.alpha) * 100) + "% CI [" + fmt(r.ciLo, 1) + ", " +
        fmt(r.ciHi, 1) + "]. The observed t sits close to the middle of the " +
        "null distribution, so these data are entirely ordinary under equal " +
        "population means. Note the wording: fail to reject, not accept. The " +
        "interval shows how much the study still leaves open.";
    } else {
      tone = "caution";
      text =
        "The groups did not differ significantly, " + stat + ", " +
        Math.round((1 - r.s.alpha) * 100) + "% CI [" + fmt(r.ciLo, 1) + ", " +
        fmt(r.ciHi, 1) + "]. The observed t is out towards the tail without " +
        "reaching the critical value - the case usually written up as a " +
        "\"trend\". That describes a result that failed the rule the authors " +
        "chose. Report the estimate and its interval instead.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var lines = [];
    var ratio = Math.max(r.s.sdA, r.s.sdB) / Math.min(r.s.sdA, r.s.sdB);
    if (ratio > 1.8) {
      lines.push(
        "The two standard deviations differ by a factor of " + fmt(ratio, 1) +
        ". This is the classic pooled-variance test, which assumes they are " +
        "equal, and with a ratio this large the pooled figure of " +
        fmt(r.pooled, 1) + " describes neither group.");
    }
    if (r.df < 10) {
      lines.push(
        "With only " + r.df + " degrees of freedom the null distribution has " +
        "visibly heavier tails than the normal drawn behind it, and the " +
        "critical value is " + fmt(r.crit) + " rather than 1.96. Small " +
        "studies pay for estimating the spread.");
    }
    if (!lines.length) {
      lines.push(
        "Every figure here assumes independent observations, roughly normal " +
        "populations, equal variances, and that this comparison was decided " +
        "before the data were seen. The tool can check none of those.");
    }
    assumption.textContent = lines.join(" ");
  }

  function render() {
    var r = results();
    chartHeading.textContent =
      "Null distribution of t on " + r.df + " degrees of freedom";
    renderChart(r);
    renderTables(r);
    renderReadout(r);
    renderVerdict(r);
    return r;
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  shell.bindRange(meanBRange, {
    format: function (v) { return fmt(v, 1); },
    describe: function (v) {
      return "group B's mean is " + fmt(v, 1) + ", against group A's " + MEAN_A;
    },
    onInput: render
  });

  shell.bindRange(sdARange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "group A has a standard deviation of " + v; },
    onInput: render
  });

  shell.bindRange(sdBRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "group B has a standard deviation of " + v; },
    onInput: render
  });

  shell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return v + " participants per group, which is " + (2 * v - 2) +
        " degrees of freedom";
    },
    onInput: render
  });

  alphaSelect.addEventListener("change", function () {
    var r = render();
    shell.announce(
      "Alpha set to " + alphaSelect.value + ". The critical value is now ±" +
      fmt(r.crit) + ". Nothing about the data has changed, and neither has p.",
      { immediate: true });
  });

  function applyStudy(meanB, n, label) {
    meanBRange.value = String(meanB);
    sdARange.value = "10";
    sdBRange.value = "10";
    nRange.value = String(n);
    [meanBRange, sdARange, sdBRange, nRange].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    var r = render();
    shell.announce(
      label + ": mean difference " + signed(r.diff, 1) + " points, d = " +
      fmt(r.d) + ", standard error " + fmt(r.se) + ", t(" + r.df + ") = " +
      fmt(r.t) + ", p " + fmtP(r.p) + ".", { immediate: true });
  }

  $('[data-action="small-study"]').addEventListener("click", function () {
    applyStudy(55, 15, "The 15-per-group study");
  });
  $('[data-action="big-study"]').addEventListener("click", function () {
    applyStudy(55, 100, "The same effect at 100 per group");
  });
  $('[data-action="null-study"]').addEventListener("click", function () {
    applyStudy(50, 15, "No difference at all");
  });

  /* =======================================================================
     Opening predictions
     ===================================================================== */

  var TRUTH = { se: "smaller", t: "larger", p: "smaller" };

  var WHY = {
    se:
      "The standard error is the pooled standard deviation times the square " +
      "root of two over n, so it falls from 3.65 at fifteen per group to 1.41 " +
      "at a hundred. This is the only place the sample size enters the test.",
    t:
      "t is the same mean difference of 5.0 points divided by a smaller " +
      "standard error, so it rises from 1.37 to 3.54. Nothing about the two " +
      "groups changed; the study simply became better at seeing them apart.",
    p:
      "p is the area beyond the observed t, so a larger t means a smaller " +
      "area: about .18 becomes about .0005. And Cohen's d is 0.50 in both " +
      "studies, because d divides by the spread of individual people rather " +
      "than by the spread of sample means. One finding, two very different " +
      "p-values."
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
    challengeSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce(
      "Laboratory unlocked, loaded with the fifteen-per-group study from the " +
      "predictions.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = {};
    var missing = false;
    ["se", "t", "p"].forEach(function (name) {
      var picked = $('input[name="' + name + '"]:checked', openingForm);
      if (!picked) { missing = true; } else { answers[name] = picked.value; }
    });
    if (missing) {
      openingError.textContent =
        "Answer all three questions before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var correct = ["se", "t", "p"].filter(function (name) {
      return answers[name] === TRUTH[name];
    }).length;
    var tone = correct === 3 ? "good" : correct >= 2 ? "caution" : "warn";

    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict",
      correct === 3 ? "All three." : correct + " of the three."));
    p.appendChild(document.createTextNode(
      " The two study buttons in the laboratory put both versions on screen, " +
      "so you can read every figure twice."));
    openingFeedback.appendChild(p);
    var list = make("ul");
    ["se", "t", "p"].forEach(function (name) {
      var li = make("li");
      li.appendChild(make("strong", null,
        (answers[name] === TRUTH[name] ? "Correct. " : "Not quite. ")));
      li.appendChild(document.createTextNode(WHY[name]));
      list.appendChild(li);
    });
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
     Challenge — choose the write-up
     ===================================================================== */

  var CONCLUSIONS = {
    nodiff: {
      correct: false,
      label: "\"There was no difference between the two groups.\"",
      text:
        "This states as a finding something the study did not establish. The " +
        "interval runs from −0.7 to 9.7 points: the data are compatible " +
        "with no difference and with a difference of nearly ten points. " +
        "Absence of evidence has been converted into evidence of absence."
    },
    good: {
      correct: true,
      label: "The full sentence with the statistic, the effect size, the " +
        "interval and a statement of what the study could not settle.",
      text:
        "This is the best of the four. It reports the decision in the correct " +
        "form - did not differ significantly - gives the test statistic with " +
        "its degrees of freedom, gives an effect size so the reader can judge " +
        "the size of what was found, gives an interval so the reader can see " +
        "the range the data are compatible with, and says plainly that the " +
        "study was underpowered rather than that nothing is there."
    },
    trend: {
      correct: false,
      label: "\"A marginally significant trend towards a difference.\"",
      text:
        "The authors chose α = .05 in advance and the result did not reach " +
        "it. \"Marginally significant\" and \"approaching significance\" " +
        "describe a failed test in language borrowed from a passed one, and " +
        "there is no threshold at which a result becomes marginal - .087 is " +
        "not closer to .05 in any sense that matters. If the threshold was " +
        "worth setting, it is worth respecting; if it was not, it should not " +
        "have been set."
    },
    probably: {
      correct: false,
      label: "\"So the null hypothesis is probably true.\"",
      text:
        "This reverses the conditional. The whole calculation begins by " +
        "assuming the null hypothesis and asks what data it would produce; " +
        "nothing about how likely that assumption was ever entered it, so " +
        "nothing about it can come out. A probability for a hypothesis " +
        "requires a prior, which this framework does not use."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var picked = $('input[name="conclusion"]:checked', challengeForm);
    if (!picked) {
      challengeError.textContent = "Choose one of the four write-ups.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = picked.value === "good";
    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", right ? "good" : "caution");
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict",
      right ? "Yes — and notice how much of it is not the p-value."
        : "Not this one."));
    p.appendChild(document.createTextNode(
      " Three of the four are in wide circulation, which is why the exercise " +
      "is worth doing on paper as well as here."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    Object.keys(CONCLUSIONS).forEach(function (key) {
      var li = make("li");
      li.appendChild(make("strong", null,
        (key === picked.value ? "You chose this. " : "") + CONCLUSIONS[key].label + " "));
      li.appendChild(document.createTextNode(CONCLUSIONS[key].text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(right
      ? "Correct: the full sentence with the interval is the best write-up."
      : "Not the best of the four; explanations are below.", { immediate: true });
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
    meanBRange.value = String(DEFAULTS.meanB);
    sdARange.value = String(DEFAULTS.sdA);
    sdBRange.value = String(DEFAULTS.sdB);
    nRange.value = String(DEFAULTS.n);
    alphaSelect.value = DEFAULTS.alpha;
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the three predictions above to open the laboratory.",
    { immediate: true });
})();
