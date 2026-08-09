/* =========================================================================
   Statistical Power and Type M Error Laboratory
   -------------------------------------------------------------------------
   EXPERIMENT 1 — the four areas
   -----------------------------
   The horizontal axis is the effect size a study would OBSERVE. Under the
   null the observed d is approximately Normal(0, SE); under the assumed
   alternative it is approximately Normal(d, SE), with

       SE = sqrt(2 / n)                     for two groups of n

   The rejection threshold is the exact critical value of t on 2n-2 degrees of
   freedom, converted to the d scale:

       threshold = tCritical(alpha, 2n-2) * SE
       power     = 1 - Phi((threshold - d)/SE) + Phi((-threshold - d)/SE)
       beta      = 1 - power

   The threshold is exact; the area beyond it is computed from a normal rather
   than a non-central t. At these sample sizes the difference is a fraction of
   a percentage point and is invisible on the picture, and the page says so in
   its limitations. Required sample sizes are found by scanning n upwards
   until power reaches the target, which is how a textbook table is built.

   EXPERIMENT 2 — Type M
   ---------------------
   Two thousand genuinely simulated studies at a fixed true effect of d = 0.35
   and alpha = .05. Each one generates two groups of n from Normal(0,1) and
   Normal(0.35,1), computes the pooled standard deviation, the observed d and
   the t statistic, and is declared significant when |t| reaches the critical
   value. The tool then reports three things side by side:

     * the mean of ALL the estimates, which lands on the truth - every study
       is unbiased;
     * the mean of the SIGNIFICANT estimates, which does not;
     * the exaggeration ratio between them (the Type M error), and the share
       of significant results whose sign is wrong (the Type S error).

   The point being made is precise: low power does not bias any study. The
   exaggeration is a property of conditioning on significance, because a small
   study can only clear the threshold by overshooting. The tool shows both
   halves of that at once, which is why the mean of all estimates is drawn on
   the picture and not merely mentioned.

   Randomness is seeded (mulberry32 with Box-Muller normals). No data leave
   the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var STUDIES = 2000;
  var TM_TRUE_D = 0.35;
  var TM_ALPHA = 0.05;
  var TM_SEED = 5477;
  var DEFAULTS = { d: 0.5, n: 20, alpha: "0.05", target: "0.8" };
  var TM_DEFAULT_N = 15;

  /* =======================================================================
     Distributions
     ===================================================================== */

  function phi(z) {
    var sign = z < 0 ? -1 : 1;
    var x = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t -
      0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + sign * y);
  }

  function normalDensity(x, mu, sigma) {
    var z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }

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

  /** Critical |t| for a two-tailed test, by bisection on the tail area. */
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
     Power
     ===================================================================== */

  function powerFor(d, n, alpha) {
    var se = Math.sqrt(2 / n);
    var threshold = tCritical(alpha, 2 * n - 2) * se;
    var power = 1 - phi((threshold - d) / se) + phi((-threshold - d) / se);
    return { se: se, threshold: threshold, power: power, beta: 1 - power };
  }

  /** Smallest n per group reaching the target power, or null beyond 5000. */
  function requiredN(d, alpha, target) {
    for (var n = 3; n <= 5000; n += 1) {
      if (powerFor(d, n, alpha).power >= target) { return n; }
    }
    return null;
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

  var powerShell = InteractiveShell.attach("#power");
  var tmShell = InteractiveShell.attach("#typem");
  if (!powerShell || !tmShell) { return; }

  var dRange = $("#d-range");
  var nRange = $("#n-range");
  var alphaSelect = $("#alpha-select");
  var targetSelect = $("#target-select");
  var chartHeading = $("[data-chart-heading]");
  var powerSvg = $("[data-power]");
  var powerTable = $("[data-power-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var planning = $("[data-planning]");
  var planTable = $("[data-plan-table]");

  var tmNRange = $("#tm-n-range");
  var tmHeading = $("[data-tm-heading]");
  var tmSvg = $("[data-typem]");
  var tmTable = $("[data-tm-table]");
  var tmFeedback = $("[data-typem-feedback]");
  var tmError = $("[data-typem-error]");
  var tmVerdict = $("[data-tm-verdict]");
  var tmInterpretation = $("[data-tm-interpretation]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var powerSection = $("#power-section");
  var typemSection = $("#typem-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     Experiment 1 — drawing the four areas
     ===================================================================== */

  var PLOT = { left: 34, right: 448, top: 14, base: 148 };

  function settings() {
    return {
      d: Number(dRange.value),
      n: Number(nRange.value),
      alpha: Number(alphaSelect.value),
      target: Number(targetSelect.value)
    };
  }

  function renderPowerChart(s, p, axisLo, axisHi) {
    var X = function (v) {
      return PLOT.left + ((v - axisLo) / (axisHi - axisLo)) * (PLOT.right - PLOT.left);
    };
    var peak = normalDensity(0, 0, p.se);
    var Y = function (den) {
      return PLOT.base - (den / (peak * 1.1)) * (PLOT.base - PLOT.top);
    };

    clear(powerSvg);

    function pathOf(mu, from, to, close) {
      var pts = [];
      var steps = 120;
      for (var i = 0; i <= steps; i += 1) {
        var v = from + (to - from) * (i / steps);
        pts.push([X(v), Y(normalDensity(v, mu, p.se))]);
      }
      var body = pts.map(function (q, i) {
        return (i === 0 ? "M" : "L") + fmt(q[0], 1) + " " + fmt(q[1], 1);
      }).join(" ");
      if (!close) { return body; }
      return "M" + fmt(X(from), 1) + " " + PLOT.base + " " + body.slice(1) +
        " L" + fmt(X(to), 1) + " " + PLOT.base + " Z";
    }

    // Alpha: the tails of the null curve beyond the threshold.
    [[axisLo, -p.threshold], [p.threshold, axisHi]].forEach(function (span) {
      if (span[1] <= span[0]) { return; }
      powerSvg.appendChild(svgNode("path",
        { d: pathOf(0, span[0], span[1], true), class: "pw__alpha-fill" }));
      for (var hx = X(span[0]) + 3; hx < X(span[1]); hx += 7) {
        var v = axisLo + ((hx - PLOT.left) / (PLOT.right - PLOT.left)) *
          (axisHi - axisLo);
        var top = Y(normalDensity(v, 0, p.se));
        if (PLOT.base - top < 2) { continue; }
        powerSvg.appendChild(svgNode("line",
          { x1: hx, y1: PLOT.base, x2: hx + 5, y2: top, class: "pw__alpha-hatch" }));
      }
    });

    // Beta: the body of the alternative curve inside the threshold.
    powerSvg.appendChild(svgNode("path", {
      d: pathOf(s.d, Math.max(axisLo, -p.threshold), Math.min(axisHi, p.threshold), true),
      class: "pw__beta-fill"
    }));
    for (var bx = X(Math.max(axisLo, -p.threshold)) + 3;
         bx < X(Math.min(axisHi, p.threshold)); bx += 7) {
      var bv = axisLo + ((bx - PLOT.left) / (PLOT.right - PLOT.left)) *
        (axisHi - axisLo);
      var btop = Y(normalDensity(bv, s.d, p.se));
      if (PLOT.base - btop < 2) { continue; }
      powerSvg.appendChild(svgNode("line",
        { x1: bx, y1: PLOT.base, x2: bx - 5, y2: btop, class: "pw__beta-hatch" }));
    }

    powerSvg.appendChild(svgNode("path",
      { d: pathOf(0, axisLo, axisHi, false), class: "pw__null" }));
    powerSvg.appendChild(svgNode("path",
      { d: pathOf(s.d, axisLo, axisHi, false), class: "pw__alt" }));

    powerSvg.appendChild(svgText(
      { x: X(0), y: PLOT.top + 8, "text-anchor": "middle" },
      "if the effect is 0", "chart__axis"));
    powerSvg.appendChild(svgText(
      { x: Math.min(X(s.d), PLOT.right - 40), y: PLOT.top - 1,
        "text-anchor": "middle" },
      "if the effect is " + fmt(s.d), "chart__label"));

    [-p.threshold, p.threshold].forEach(function (v) {
      if (v < axisLo || v > axisHi) { return; }
      powerSvg.appendChild(svgNode("line",
        { x1: X(v), y1: PLOT.top, x2: X(v), y2: PLOT.base + 5,
          class: "pw__threshold" }));
    });
    powerSvg.appendChild(svgText(
      { x: Math.min(X(p.threshold) + 4, PLOT.right - 2), y: PLOT.base - 6,
        "text-anchor": X(p.threshold) > PLOT.right - 90 ? "end" : "start" },
      "reject beyond ±" + fmt(p.threshold), "chart__label"));

    powerSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base,
        class: "pw__axis" }));
    var step = (axisHi - axisLo) > 4 ? 1 : (axisHi - axisLo) > 2 ? 0.5 : 0.25;
    for (var v2 = Math.ceil(axisLo / step) * step; v2 <= axisHi; v2 += step) {
      powerSvg.appendChild(svgNode("line",
        { x1: X(v2), y1: PLOT.base, x2: X(v2), y2: PLOT.base + 4,
          class: "pw__axis" }));
      powerSvg.appendChild(svgText(
        { x: X(v2), y: PLOT.base + 17, "text-anchor": "middle" },
        fmt(v2, step < 1 ? 2 : 0), "chart__axis"));
    }
    powerSvg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 33,
        "text-anchor": "middle" },
      "effect size this study would observe", "chart__axis"));
  }

  function renderPower() {
    var s = settings();
    var p = powerFor(s.d, s.n, s.alpha);
    var span = Math.max(4 * p.se, s.d + 3.6 * p.se);
    var axisLo = -span;
    var axisHi = Math.max(span, s.d + 3.6 * p.se);

    chartHeading.textContent =
      "d = " + fmt(s.d) + ", " + s.n + " per group, α = " + s.alpha;
    renderPowerChart(s, p, axisLo, axisHi);

    clear(powerTable);
    [
      ["Power (1 − β)", pct(p.power)],
      ["Type II error rate β", pct(p.beta)],
      ["Type I error rate α", pct(s.alpha)],
      ["Smallest observed d that would reject", fmt(p.threshold)]
    ].forEach(function (cells) { powerTable.appendChild(row(cells)); });

    var need = requiredN(s.d, s.alpha, s.target);
    clear(readout);
    [
      ["Power", pct(p.power)],
      ["Standard error of d", fmt(p.se)],
      ["Rejection threshold", "±" + fmt(p.threshold)],
      ["n for " + Math.round(s.target * 100) + "% power",
        need === null ? "over 5,000" : String(need)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    clear(planTable);
    [0.5, 0.8, 0.9, 0.95].forEach(function (target) {
      var required = requiredN(s.d, s.alpha, target);
      planTable.appendChild(row([
        Math.round(target * 100) + "%",
        required === null ? "over 5,000" : String(required),
        required === null ? "—" : String(2 * required)
      ]));
    });

    var tone;
    var text;
    if (p.power < 0.35) {
      tone = "warn";
      text =
        "Power is " + pct(p.power) + ". If the effect really is " + fmt(s.d) +
        ", this study misses it " + pct(p.beta) + " of the time. To reach " +
        "significance at all it would have to observe at least " +
        fmt(p.threshold) + " - " + fmt(p.threshold / s.d, 1) + " times the " +
        "truth. That inflation is Experiment 2.";
    } else if (p.power < 0.8) {
      tone = "caution";
      text =
        "Power is " + pct(p.power) + ", so this study misses a real effect of " +
        fmt(s.d) + " about " + pct(p.beta) + " of the time. The threshold sits " +
        "at " + fmt(p.threshold) + " on the same scale: a significant result " +
        "here still means observing something larger than the truth.";
    } else {
      tone = "good";
      text =
        "Power is " + pct(p.power) + ". A study this size detects an effect of " +
        fmt(s.d) + " most of the time, and its rejection threshold of " +
        fmt(p.threshold) + " is close enough to the true value that a " +
        "significant result is not badly inflated. A non-significant result " +
        "from a study like this is genuinely informative.";
    }
    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    planning.textContent = need === null
      ? "Reaching " + Math.round(s.target * 100) + "% power for an effect this " +
        "small at α = " + s.alpha + " would take more than 5,000 people per " +
        "group. That is worth saying out loud before a study is run rather " +
        "than after."
      : "To reach " + Math.round(s.target * 100) + "% power for d = " + fmt(s.d) +
        " at α = " + s.alpha + " you would need " + need + " per group, " +
        (2 * need) + " in total. Halve the effect you want to detect and that " +
        "figure roughly quadruples.";
  }

  powerShell.bindRange(dRange, {
    format: function (v) { return fmt(v); },
    describe: function (v) { return "an assumed true effect of d equals " + fmt(v); },
    onInput: renderPower
  });

  powerShell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " participants per group"; },
    onInput: renderPower
  });

  alphaSelect.addEventListener("change", function () {
    renderPower();
    var s = settings();
    var p = powerFor(s.d, s.n, s.alpha);
    powerShell.announce(
      "Alpha set to " + s.alpha + ". Power is now " + pct(p.power) +
      ", with no change to the sample size: every threshold trades one error " +
      "rate against the other.", { immediate: true });
  });

  targetSelect.addEventListener("change", function () {
    renderPower();
    var s = settings();
    var need = requiredN(s.d, s.alpha, s.target);
    powerShell.announce(
      "Target power " + Math.round(s.target * 100) + " per cent. That needs " +
      (need === null ? "more than 5,000" : need) + " participants per group " +
      "for an effect of " + fmt(s.d) + ".", { immediate: true });
  });

  /* =======================================================================
     Experiment 2 — Type M
     ===================================================================== */

  var tmRun = null;

  function runStudies(n) {
    var random = mulberry32(TM_SEED + n * 101);
    var df = 2 * n - 2;
    var crit = tCritical(TM_ALPHA, df);
    var estimates = [];
    var significant = [];
    var wrongSign = 0;
    for (var s = 0; s < STUDIES; s += 1) {
      var sumA = 0;
      var sumB = 0;
      var ssA = 0;
      var ssB = 0;
      var a = [];
      var b = [];
      var i;
      for (i = 0; i < n; i += 1) {
        var va = normal(random);
        var vb = TM_TRUE_D + normal(random);
        a.push(va);
        b.push(vb);
        sumA += va;
        sumB += vb;
      }
      var mA = sumA / n;
      var mB = sumB / n;
      for (i = 0; i < n; i += 1) {
        ssA += (a[i] - mA) * (a[i] - mA);
        ssB += (b[i] - mB) * (b[i] - mB);
      }
      var pooled = Math.sqrt((ssA + ssB) / df);
      var dHat = pooled > 0 ? (mB - mA) / pooled : 0;
      var t = dHat / Math.sqrt(2 / n);
      estimates.push(dHat);
      if (Math.abs(t) >= crit) {
        significant.push(dHat);
        if (dHat < 0) { wrongSign += 1; }
      }
    }
    var meanAll = estimates.reduce(function (x, y) { return x + y; }, 0) /
      estimates.length;
    var meanSig = significant.length
      ? significant.reduce(function (x, y) { return x + Math.abs(y); }, 0) /
        significant.length
      : 0;
    return {
      n: n, crit: crit, estimates: estimates,
      significant: significant, wrongSign: wrongSign,
      meanAll: meanAll, meanSig: meanSig,
      observedPower: significant.length / STUDIES,
      typeM: meanSig / TM_TRUE_D,
      threshold: crit * Math.sqrt(2 / n)
    };
  }

  function renderTypeM() {
    var n = Number(tmNRange.value);
    clear(tmSvg);
    clear(tmTable);

    if (!tmRun || tmRun.n !== n) {
      tmHeading.textContent =
        "Nothing run yet at " + n + " per group — expected power " +
        pct(powerFor(TM_TRUE_D, n, TM_ALPHA).power);
      tmTable.appendChild(row(["Studies run", "0"]));
      tmTable.appendChild(row(["True effect", fmt(TM_TRUE_D)]));
      tmVerdict.hidden = true;
      return;
    }

    var r = tmRun;
    var axisLo = -1.4;
    var axisHi = 1.8;
    var X = function (v) {
      return PLOT.left + ((v - axisLo) / (axisHi - axisLo)) * (PLOT.right - PLOT.left);
    };

    var BINS = 44;
    var width = (axisHi - axisLo) / BINS;
    var all = [];
    var sig = [];
    var i;
    for (i = 0; i < BINS; i += 1) { all.push(0); sig.push(0); }
    r.estimates.forEach(function (value) {
      var index = Math.floor((value - axisLo) / width);
      if (index < 0 || index >= BINS) { return; }
      all[index] += 1;
      if (Math.abs(value) >= r.threshold) { sig[index] += 1; }
    });
    var tallest = Math.max.apply(null, all.concat([1]));
    var Y = function (count) {
      return PLOT.base - (count / tallest) * (PLOT.base - PLOT.top - 6);
    };

    all.forEach(function (count, index) {
      if (!count) { return; }
      var x0 = X(axisLo + index * width);
      var x1 = X(axisLo + (index + 1) * width);
      var isSig = sig[index] > count / 2;
      tmSvg.appendChild(svgNode("rect", {
        x: x0, y: Y(count), width: Math.max(1, x1 - x0 - 0.6),
        height: PLOT.base - Y(count),
        class: "tm__bar" + (isSig ? " tm__bar--sig" : "")
      }));
      if (isSig && PLOT.base - Y(count) > 4) {
        tmSvg.appendChild(svgNode("line", {
          x1: x0, y1: PLOT.base, x2: x1, y2: Y(count), class: "tm__hatch"
        }));
      }
    });

    [[TM_TRUE_D, "tm__truth", "true effect " + fmt(TM_TRUE_D), PLOT.top + 10],
     [r.meanAll, "tm__all", "mean of all " + fmt(r.meanAll), PLOT.top + 26],
     [r.meanSig, "tm__sig", "mean of the significant " + fmt(r.meanSig),
       PLOT.top + 42]]
      .forEach(function (entry) {
        tmSvg.appendChild(svgNode("line", {
          x1: X(entry[0]), y1: PLOT.top - 2, x2: X(entry[0]), y2: PLOT.base + 5,
          class: entry[1]
        }));
        tmSvg.appendChild(svgText(
          { x: Math.min(X(entry[0]) + 4, PLOT.right - 2), y: entry[3],
            "text-anchor": X(entry[0]) > PLOT.right - 130 ? "end" : "start" },
          entry[2], "chart__label"));
      });

    tmSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base,
        class: "pw__axis" }));
    for (var v = -1; v <= 1.5; v += 0.5) {
      tmSvg.appendChild(svgNode("line",
        { x1: X(v), y1: PLOT.base, x2: X(v), y2: PLOT.base + 4,
          class: "pw__axis" }));
      tmSvg.appendChild(svgText(
        { x: X(v), y: PLOT.base + 17, "text-anchor": "middle" },
        fmt(v, 1), "chart__axis"));
    }
    tmSvg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 33,
        "text-anchor": "middle" },
      "effect size each study estimated — hatched bars reached significance",
      "chart__axis"));

    tmHeading.textContent =
      STUDIES + " studies at " + r.n + " per group — " +
      r.significant.length + " significant";

    [
      ["Studies run", String(STUDIES)],
      ["True effect", fmt(TM_TRUE_D)],
      ["Mean of every estimate", fmt(r.meanAll)],
      ["Significant results", r.significant.length + " (" +
        pct(r.observedPower) + ")"],
      ["Mean of the significant estimates", fmt(r.meanSig)],
      ["Exaggeration ratio", fmt(r.typeM, 2) + " times the truth"],
      ["Significant but the wrong sign",
        r.wrongSign + (r.significant.length
          ? " (" + pct(r.wrongSign / r.significant.length) + " of them)" : "")]
    ].forEach(function (cells) { tmTable.appendChild(row(cells)); });
  }

  tmShell.bindRange(tmNRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return v + " participants per group, giving about " +
        pct(powerFor(TM_TRUE_D, v, TM_ALPHA).power) + " power";
    },
    onInput: function () {
      // A different sample size is a different set of studies, so the run is
      // cleared rather than shown against the wrong settings.
      if (tmRun && tmRun.n !== Number(tmNRange.value)) {
        tmRun = null;
        tmFeedback.hidden = true;
        tmVerdict.hidden = true;
      }
      renderTypeM();
    }
  });

  function describeRun(r, chosen) {
    var truth = r.typeM < 1.2 ? "same" : r.typeM < 2.0 ? "half" : "double";
    var right = chosen === truth;
    var lead = right ? "Yes." : "Not quite.";
    var body =
      "Across all " + STUDIES + " studies the average estimate was " +
      fmt(r.meanAll) + " against a true effect of " + fmt(TM_TRUE_D) +
      " - every study is unbiased, and the whole set says so. Among the " +
      r.significant.length + " that reached significance the average was " +
      fmt(r.meanSig) + ", which is " + fmt(r.typeM, 2) + " times the truth. " +
      "Nothing was done wrongly in any individual study; the exaggeration is " +
      "entirely a property of the filter.";
    showFeedback(tmFeedback, right ? "good" : "caution", lead, body);

    var extra = make("p");
    extra.appendChild(make("strong", null, "Why the filter does this. "));
    extra.appendChild(document.createTextNode(
      "At " + r.n + " per group a study only reaches significance if it " +
      "observes an effect of at least " + fmt(r.threshold) + ". The true " +
      "effect is " + fmt(TM_TRUE_D) + ", so every significant result is, by " +
      "construction, an overshoot. Raise the sample size until the threshold " +
      "falls below the truth and the exaggeration disappears."));
    tmFeedback.appendChild(extra);

    if (r.wrongSign > 0) {
      var sign = make("p");
      sign.appendChild(make("strong", null, "And the sign errors. "));
      sign.appendChild(document.createTextNode(
        r.wrongSign + " of the " + r.significant.length + " significant " +
        "results - " + pct(r.wrongSign / r.significant.length) + " of them - " +
        "pointed in the wrong direction entirely, and every one would have " +
        "been written up as a finding."));
      tmFeedback.appendChild(sign);
    }

    tmVerdict.hidden = false;
    tmInterpretation.textContent =
      "Hold both halves of this at once. Any single underpowered study gives " +
      "an unbiased estimate: it is as likely to undershoot as to overshoot, " +
      "and the mean of all " + STUDIES + " estimates lands on " + fmt(r.meanAll) +
      ". A literature assembled from the significant ones is a different " +
      "object, and it reports " + fmt(r.meanSig) + ". Nothing separates the " +
      "two except which results anybody heard about - which is why the " +
      "remedy is larger studies and complete reporting rather than better " +
      "analysis of what got through.";
    return { right: right, lead: lead };
  }

  $('[data-action="run-typem"]').addEventListener("click", function () {
    var chosen = $('input[name="typem"]:checked', tmShell.controls);
    if (!chosen) {
      tmError.textContent = "Commit to a prediction before running the studies.";
      tmError.hidden = false;
      return;
    }
    tmError.hidden = true;
    tmRun = runStudies(Number(tmNRange.value));
    renderTypeM();
    var result = describeRun(tmRun, chosen.value);
    tmShell.announce(
      result.lead + " " + tmRun.significant.length + " of " + STUDIES +
      " studies were significant, and their average estimate was " +
      fmt(tmRun.meanSig) + " against a true effect of " + fmt(TM_TRUE_D) + ".",
      { immediate: true });
  });

  function applyTmPreset(n, label) {
    tmNRange.value = String(n);
    tmNRange.dispatchEvent(new Event("input"));
    tmRun = null;
    tmFeedback.hidden = true;
    tmVerdict.hidden = true;
    renderTypeM();
    tmShell.announce(
      label + ": " + n + " per group, expected power " +
      pct(powerFor(TM_TRUE_D, n, TM_ALPHA).power) +
      ". Commit to a prediction and run the studies.", { immediate: true });
  }

  $('[data-action="tm-low"]').addEventListener("click", function () {
    applyTmPreset(15, "Low-power setting");
  });
  $('[data-action="tm-high"]').addEventListener("click", function () {
    applyTmPreset(120, "High-power setting");
  });

  function openTypeM() {
    var wasHidden = typemSection.hidden;
    typemSection.hidden = false;
    renderTypeM();
    if (wasHidden) {
      $("#typem-heading").focus();
      tmShell.announce(
        "Experiment 2 opened. Commit to a prediction before running anything.",
        { immediate: true });
    }
  }

  $('[data-action="open-typem"]').addEventListener("click", openTypeM);

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    eighty: {
      tone: "caution",
      verdict: "That is the target, not the achievement.",
      text:
        "Eighty per cent power for d = 0.50 at α = .05 takes 64 people per " +
        "group, not 20. With 20 the figure is about 34%, so two studies in " +
        "three would miss a real medium-sized effect. Set the target-power " +
        "control to 80% and read the required sample size."
    },
    fifty: {
      tone: "caution",
      verdict: "Closer, and still optimistic.",
      text:
        "Fifty per cent - a coin toss - would take about 33 per group. With " +
        "20 the power is about 34%. The general shape of the answer is right: " +
        "small studies of medium effects are usually worse than a coin toss."
    },
    thirty: {
      tone: "good",
      verdict: "Yes — 32.9%.",
      text:
        "Two studies in three would fail to detect a real medium-sized " +
        "effect. Now look at what the third study - the one that succeeded - " +
        "would have had to observe to get there."
    },
    five: {
      tone: "warn",
      verdict: "That is the false-positive rate, not the power.",
      text:
        "α = .05 is the probability of a significant result when there is no " +
        "effect at all. Power is the probability of one when there IS an " +
        "effect, and here it is about 34%. The two are the two shaded regions " +
        "in the experiment, on two different curves."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openPower() {
    powerSection.hidden = false;
    renderPower();
    $("#power-heading").focus();
    powerShell.announce(
      "Experiment 1 unlocked, showing the study from the prediction.",
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
    openPower();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openPower();
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_NOTES = {
    before: {
      correct: true,
      text:
        "Correct, and the second half of the sentence is the hard part. Power " +
        "is always power to detect a stated effect, so a power calculation is " +
        "only as good as the effect size assumed - which in practice often " +
        "comes from earlier literature that Experiment 2 suggests is inflated."
    },
    observed: {
      correct: false,
      text:
        "Wrong, and it is the most common misuse of the concept. Observed " +
        "power computed from the study's own result is a one-to-one function " +
        "of the p-value: a high p always gives low observed power, by " +
        "construction. It carries no information the p-value did not already " +
        "have."
    },
    informative: {
      correct: true,
      text:
        "Correct. A well-powered study that fails to reject has largely ruled " +
        "out effects of the assumed size; an underpowered one has ruled out " +
        "almost nothing. This is why a confidence interval is more useful " +
        "than a decision: it shows what has actually been excluded."
    },
    doubling: {
      correct: false,
      text:
        "Wrong. Power is not linear in n; it is bounded above by 1. In " +
        "Experiment 1, 20 to 40 per group at d = 0.50 takes power from 32.9% " +
        "to 59.7% - a large gain, not a doubling. From 100 to 200 it goes 94% " +
        "to 99.9%, already near the ceiling."
    },
    eighty: {
      correct: true,
      text:
        "Correct, and note the conditional. It is 80% of studies IF the " +
        "assumed effect is the true one. If the real effect is half what you " +
        "assumed, the same design has far less power, which is why " +
        "optimistic assumptions are so costly."
    },
    exaggerate: {
      correct: true,
      text:
        "Correct, and Experiment 2 is a demonstration of it. A small study " +
        "can only clear the threshold by overshooting, so the significant " +
        "subset has a much larger average than the truth."
    },
    biased: {
      correct: false,
      text:
        "Wrong, and it is the mirror-image error. Every individual " +
        "underpowered study estimates the effect without bias - the mean of " +
        "all two thousand estimates in Experiment 2 lands on the truth. The " +
        "exaggeration belongs to the filter, not to the studies - which points " +
        "at publication practice rather than at anybody's arithmetic."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one statement.",
        "Four of the seven are correct.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) {
      return !CHALLENGE_NOTES[v].correct;
    });
    var missed = ["before", "informative", "eighty", "exaggerate"]
      .filter(function (v) { return chosen.indexOf(v) === -1; });

    var tone = wrongPicked.length ? "warn" : missed.length ? "caution" : "good";
    var verdictText;
    if (wrongPicked.length) {
      verdictText = "At least one of these treats power as something a " +
        "finished study reveals, or blames low power for a bias it does not " +
        "cause.";
    } else if (missed.length) {
      verdictText = "Everything you picked is right, and " + missed.length +
        " of the four correct statements is still unselected.";
    } else {
      verdictText = "Yes — all four, and none of the three traps.";
    }

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " The three incorrect statements are the three ways power is usually " +
      "misused in discussion sections."));
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
    powerShell.announce(verdictText, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  tmShell.onReset(function () {
    tmRun = null;
    tmNRange.value = String(TM_DEFAULT_N);
    $$('input[name="typem"]', tmShell.controls).forEach(function (input) {
      input.checked = false;
    });
    tmFeedback.hidden = true;
    tmError.hidden = true;
    tmVerdict.hidden = true;
    renderTypeM();
  });

  powerShell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    powerSection.hidden = true;
    typemSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    dRange.value = String(DEFAULTS.d);
    nRange.value = String(DEFAULTS.n);
    alphaSelect.value = DEFAULTS.alpha;
    targetSelect.value = DEFAULTS.target;
    tmShell.reset({ silent: true });
    renderPower();
  });

  powerShell.reset({ silent: true });
  powerShell.announce(
    "Ready. Answer the prediction above to open Experiment 1.",
    { immediate: true });
})();
