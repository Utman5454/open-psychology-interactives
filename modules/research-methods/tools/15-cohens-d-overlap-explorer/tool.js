/* =========================================================================
   Cohen's d and Distributional Overlap Explorer
   -------------------------------------------------------------------------
   Two normal distributions on one axis, with the region lying under both of
   them shaded. Four indices describe the separation, and the point of having
   four is that only the first is in standard deviations and only the other
   three can be pictured:

       pooled SD  = sqrt(((nA-1)*sA^2 + (nB-1)*sB^2) / (nA + nB - 2))
       d          = (meanB - meanA) / pooled SD
       overlap    = integral of min(fA, fB)            [computed numerically]
       P(superiority) = Phi((meanB - meanA) / sqrt(sA^2 + sB^2))
       U3         = Phi((meanB - meanA) / sB)
                    the share of group B above group A's mean

   The overlap is INTEGRATED rather than looked up, because the familiar
   closed form 2*Phi(-|d|/2) is only correct when the two standard deviations
   are equal, and this tool deliberately lets them differ. A trapezoidal sum
   over a fine grid across the plotted range is exact to well beyond the
   precision printed.

   The probability of superiority uses the exact expression for two normals
   with possibly unequal variances, so it also stays correct when the spreads
   are pulled apart. U3 is defined here as the share of group B scoring above
   group A's mean, which is the reading that survives unequal spreads.

   WHAT THE SAMPLE SIZE DOES
   -------------------------
   Nothing to any of the above. n appears only in the disclosure, where it
   drives a two-sample t statistic and its p-value:

       t = (meanB - meanA) / (pooled SD * sqrt(2/n)),   df = 2n - 2
       p = I_{df/(df + t^2)}(df/2, 1/2)

   so that the effect size can be watched holding perfectly still while the
   p-value collapses. That is the whole reason n is a control at all.

   WHAT IS NOT BEING CLAIMED
   -------------------------
   Every index describes two distributions and none of them describes a
   person. Both distributions are normal, which the overlap and U3 rely on.
   The values are population quantities, not sample estimates with intervals.
   Cohen's small/medium/large labels are printed with the caveat he attached
   to them himself.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var MEAN_A = 50;
  var AXIS_LO = 10;
  var AXIS_HI = 110;
  var DENSITY_MAX = 0.105;   // a little above the tallest peak the sliders allow
  var GRID = 2000;           // steps used for the overlap integral
  var DEFAULTS = { meanB: 58, sdA: 10, sdB: 10, n: 30, guess: 30 };

  /* =======================================================================
     Distributions and tail areas
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

  /** Two-tailed p for Student's t. */
  function tTwoTail(t, df) {
    if (!isFinite(t)) { return 0; }
    if (t === 0) { return 1; }
    return betai(df / 2, 0.5, df / (df + t * t));
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

  function pct(p) { return (100 * p).toFixed(0) + "%"; }

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

  var shell = InteractiveShell.attach("#overlap");
  if (!shell) { return; }

  var meanBRange = $("#mean-b-range");
  var sdARange = $("#sd-a-range");
  var sdBRange = $("#sd-b-range");
  var nRange = $("#n-range");
  var chartHeading = $("[data-chart-heading]");
  var ovSvg = $("[data-overlap]");
  var indexTable = $("[data-index-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var benchmark = $("[data-benchmark]");
  var nNote = $("[data-n-note]");
  var nTable = $("[data-n-table]");

  var guessRange = $("#guess-range");
  var guessOutput = $('output[for="guess-range"]');
  var openingForm = $("#opening-form");
  var openingFeedback = $("[data-opening-feedback]");
  var explorerSection = $("#explorer-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* =======================================================================
     The indices
     ===================================================================== */

  function settings() {
    return {
      meanB: Number(meanBRange.value),
      sdA: Number(sdARange.value),
      sdB: Number(sdBRange.value),
      n: Number(nRange.value)
    };
  }

  function indices() {
    var s = settings();
    var diff = s.meanB - MEAN_A;
    // Equal group sizes here, so the pooled variance is the simple average.
    var pooled = Math.sqrt((s.sdA * s.sdA + s.sdB * s.sdB) / 2);
    var d = diff / pooled;

    // Overlap, integrated rather than looked up: the closed form 2*Phi(-d/2)
    // is only correct when the two standard deviations are equal.
    var step = (AXIS_HI - AXIS_LO) / GRID;
    var area = 0;
    var prev = Math.min(density(AXIS_LO, MEAN_A, s.sdA),
      density(AXIS_LO, s.meanB, s.sdB));
    for (var i = 1; i <= GRID; i += 1) {
      var x = AXIS_LO + i * step;
      var current = Math.min(density(x, MEAN_A, s.sdA),
        density(x, s.meanB, s.sdB));
      area += 0.5 * (prev + current) * step;
      prev = current;
    }

    var cles = phi(diff / Math.sqrt(s.sdA * s.sdA + s.sdB * s.sdB));
    var u3 = phi(diff / s.sdB);
    var se = pooled * Math.sqrt(2 / s.n);
    var t = se > 0 ? diff / se : 0;
    var df = 2 * s.n - 2;

    return {
      s: s, diff: diff, pooled: pooled, d: d, ovl: area,
      cles: cles, u3: u3, t: t, df: df, p: tTwoTail(t, df)
    };
  }

  /* =======================================================================
     Drawing
     ===================================================================== */

  var PLOT = { left: 38, right: 448, top: 14, base: 150 };

  function xAt(v) {
    return PLOT.left +
      ((v - AXIS_LO) / (AXIS_HI - AXIS_LO)) * (PLOT.right - PLOT.left);
  }

  function yAt(d) {
    return PLOT.base - (d / DENSITY_MAX) * (PLOT.base - PLOT.top);
  }

  function renderChart(v) {
    var s = v.s;
    clear(ovSvg);

    var steps = 220;
    var common = [];
    var curveA = [];
    var curveB = [];
    for (var i = 0; i <= steps; i += 1) {
      var x = AXIS_LO + (AXIS_HI - AXIS_LO) * (i / steps);
      var da = density(x, MEAN_A, s.sdA);
      var db = density(x, s.meanB, s.sdB);
      curveA.push([xAt(x), yAt(da)]);
      curveB.push([xAt(x), yAt(db)]);
      common.push([xAt(x), yAt(Math.min(da, db))]);
    }

    function toPath(points) {
      return points.map(function (p, idx) {
        return (idx === 0 ? "M" : "L") + fmt(p[0], 1) + " " + fmt(p[1], 1);
      }).join(" ");
    }

    // The common ground, filled and hatched.
    ovSvg.appendChild(svgNode("path", {
      d: "M" + fmt(xAt(AXIS_LO), 1) + " " + PLOT.base + " " +
        toPath(common).slice(1) + " L" + fmt(xAt(AXIS_HI), 1) + " " +
        PLOT.base + " Z",
      class: "ov__common"
    }));
    for (var hx = PLOT.left + 4; hx < PLOT.right; hx += 8) {
      var value = AXIS_LO + ((hx - PLOT.left) / (PLOT.right - PLOT.left)) *
        (AXIS_HI - AXIS_LO);
      var topY = yAt(Math.min(density(value, MEAN_A, s.sdA),
        density(value, s.meanB, s.sdB)));
      if (PLOT.base - topY < 2) { continue; }
      ovSvg.appendChild(svgNode("line",
        { x1: hx, y1: PLOT.base, x2: hx, y2: topY, class: "ov__hatch" }));
    }

    ovSvg.appendChild(svgNode("path",
      { d: toPath(curveA), class: "ov__curve-a" }));
    ovSvg.appendChild(svgNode("path",
      { d: toPath(curveB), class: "ov__curve-b" }));

    [[MEAN_A, s.sdA, "Group A"], [s.meanB, s.sdB, "Group B"]]
      .forEach(function (entry) {
        var peak = density(entry[0], entry[0], entry[1]);
        ovSvg.appendChild(svgNode("line", {
          x1: xAt(entry[0]), y1: yAt(peak), x2: xAt(entry[0]), y2: PLOT.base,
          class: "ov__mean"
        }));
        ovSvg.appendChild(svgText(
          { x: xAt(entry[0]), y: Math.max(PLOT.top + 9, yAt(peak) - 6),
            "text-anchor": "middle" }, entry[2], "chart__label"));
      });

    ovSvg.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base,
        class: "ov__axis" }));
    for (var t = 20; t <= 110; t += 10) {
      ovSvg.appendChild(svgNode("line",
        { x1: xAt(t), y1: PLOT.base, x2: xAt(t), y2: PLOT.base + 4,
          class: "ov__axis" }));
      if (t % 20 === 0) {
        ovSvg.appendChild(svgText(
          { x: xAt(t), y: PLOT.base + 17, "text-anchor": "middle" },
          String(t), "chart__axis"));
      }
    }
    ovSvg.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 33,
        "text-anchor": "middle" },
      "score on the fictional 100-point task", "chart__axis"));
  }

  function renderTables(v) {
    clear(indexTable);
    [
      ["Cohen's d", fmt(v.d),
        "the gap in pooled standard deviations"],
      ["Overlap", pct(v.ovl),
        "the share of the two distributions on common ground"],
      ["Probability of superiority", pct(v.cles),
        "the chance a random B beats a random A"],
      ["U3", pct(v.u3),
        "the share of group B above group A's mean"]
    ].forEach(function (cells) { indexTable.appendChild(row(cells)); });

    clear(nTable);
    [
      ["Cohen's d", fmt(v.d), "No"],
      ["Overlap", pct(v.ovl), "No"],
      ["t statistic", fmt(v.t), "Yes, with the square root of n"],
      ["Two-tailed p", "p " + fmtP(v.p), "Yes, without limit"]
    ].forEach(function (cells) { nTable.appendChild(row(cells)); });

    nNote.textContent =
      "At " + v.s.n + " per group the same two distributions give t = " +
      fmt(v.t) + " on " + v.df + " degrees of freedom, p " + fmtP(v.p) +
      ". Drag the sample size from one end of its range to the other and " +
      "watch the first two rows refuse to move while the last two travel " +
      "across several orders of magnitude. An effect size estimates a " +
      "property of the populations; a test statistic measures how well this " +
      "study could see it.";
  }

  function renderReadout(v) {
    clear(readout);
    [
      ["Cohen's d", fmt(v.d)],
      ["Pooled SD", fmt(v.pooled, 1)],
      ["Overlap", pct(v.ovl)],
      ["Chance B beats A", pct(v.cles)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderVerdict(v) {
    var tone;
    var text;
    var d = Math.abs(v.d);

    if (d < 0.05) {
      tone = "neutral";
      text =
        "The two distributions are effectively on top of one another: d = " +
        fmt(v.d) + ", with " + pct(v.ovl) + " overlap. Move group B's mean, " +
        "or change one of the spreads.";
    } else if (d < 0.5) {
      tone = "caution";
      text =
        "d = " + fmt(v.d) + ". The two distributions still share " + pct(v.ovl) +
        " of their area, and a randomly chosen member of group B beats a " +
        "randomly chosen member of group A only " + pct(v.cles) + " of the " +
        "time - so " + pct(1 - v.cles) + " of such pairs go the other way. " +
        "Effects of this size are common and can matter a great deal; what " +
        "they never support is a sentence of the form \"group B are higher\" " +
        "said about people.";
    } else if (d < 1.0) {
      tone = "good";
      text =
        "d = " + fmt(v.d) + ", the sort of figure that gets called large. The " +
        "two distributions still overlap by " + pct(v.ovl) + "; " + pct(v.u3) +
        " of group B sits above group A's mean, which means " + pct(1 - v.u3) +
        " does not; and the chance that a random B beats a random A is " +
        pct(v.cles) + ". A reader given only the value of d will picture " +
        "something much cleaner than this.";
    } else {
      tone = "good";
      text =
        "d = " + fmt(v.d) + ", which is beyond almost anything reported in " +
        "psychology outside a manipulation check. Even here the overlap is " +
        pct(v.ovl) + " and " + pct(1 - v.cles) + " of randomly drawn pairs go " +
        "the other way. That is worth sitting with: separations that look " +
        "decisive as a number look thoroughly mixed as two distributions.";
    }

    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var label = d < 0.2 ? "below Cohen's \"small\""
      : d < 0.5 ? "around Cohen's \"small\""
        : d < 0.8 ? "around Cohen's \"medium\"" : "at or beyond Cohen's \"large\"";
    var extra = "";
    if (v.s.sdA !== v.s.sdB) {
      extra = " The two groups have different spreads (" + v.s.sdA + " and " +
        v.s.sdB + "), so the pooled figure of " + fmt(v.pooled, 1) +
        " is what d is dividing by, and the overlap here is integrated rather " +
        "than taken from the equal-variance formula.";
    }
    benchmark.textContent =
      "This is " + label + ". Cohen offered those labels as a stopgap for " +
      "fields with no accumulated findings of their own and said as much; in " +
      "a field with a literature the useful comparison is with other effects " +
      "in the same area, and in an applied setting it is with a threshold of " +
      "practical importance fixed before the data arrived." + extra;
  }

  function render() {
    var v = indices();
    chartHeading.textContent =
      "Group A: mean " + MEAN_A + ", SD " + v.s.sdA + "  ·  Group B: mean " +
      v.s.meanB + ", SD " + v.s.sdB;
    renderChart(v);
    renderTables(v);
    renderReadout(v);
    renderVerdict(v);
    return v;
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  shell.bindRange(meanBRange, {
    format: function (v) { return String(v); },
    describe: function (v) {
      return "group B's mean is " + v + ", against group A's " + MEAN_A;
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
      return v + " participants per group, which changes the test and not the " +
        "effect size";
    },
    onInput: render
  });

  function applyPreset(meanB, label) {
    meanBRange.value = String(meanB);
    sdARange.value = "10";
    sdBRange.value = "10";
    [meanBRange, sdARange, sdBRange].forEach(function (input) {
      input.dispatchEvent(new Event("input"));
    });
    var v = render();
    shell.announce(
      label + ": d = " + fmt(v.d) + ", overlap " + pct(v.ovl) +
      ", and a randomly chosen member of group B beats a randomly chosen " +
      "member of group A " + pct(v.cles) + " of the time.", { immediate: true });
  }

  $('[data-action="preset-small"]').addEventListener("click", function () {
    applyPreset(52, "Cohen's small");
  });
  $('[data-action="preset-medium"]').addEventListener("click", function () {
    applyPreset(55, "Cohen's medium");
  });
  $('[data-action="preset-large"]').addEventListener("click", function () {
    applyPreset(58, "Cohen's large");
  });

  /* =======================================================================
     Opening estimate
     ===================================================================== */

  function syncGuess() {
    guessOutput.textContent = guessRange.value + "%";
    guessRange.setAttribute("aria-valuetext",
      "an estimated overlap of " + guessRange.value + " per cent");
  }
  guessRange.addEventListener("input", syncGuess);

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
    syncGuess();
  }

  function openExplorer() {
    explorerSection.hidden = false;
    challengeSection.hidden = false;
    render();
    $("#explorer-heading").focus();
    shell.announce(
      "Explorer unlocked, loaded with the two distributions from the estimate.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var guess = Number(guessRange.value);
    var truth = indices().ovl * 100;   // the defaults are the prediction scenario
    var gap = guess - truth;
    var tone = Math.abs(gap) <= 8 ? "good" : "caution";
    var lead = Math.abs(gap) <= 8
      ? "Close — the overlap is " + truth.toFixed(0) + "%."
      : gap < 0
        ? "The overlap is larger than that: " + truth.toFixed(0) + "%."
        : "The overlap is smaller than that: " + truth.toFixed(0) + "%.";

    showFeedback(openingFeedback, tone, lead,
      "You estimated " + guess + "%. Two distributions a full 0.8 standard " +
      "deviations apart still share more than two thirds of their area, which " +
      "is why an effect size in standard deviations is such a poor guide to " +
      "what a difference looks like. Most people estimate far too little " +
      "overlap, and the label \"large\" is doing a good deal of that work.");

    var note = make("p");
    note.appendChild(make("strong", null, "Three more numbers for the same pair. "));
    note.appendChild(document.createTextNode(
      "79% of group B sits above group A's mean, so 21% does not; and if you " +
      "drew one person at random from each group, group B's would be higher " +
      "71% of the time. None of these is a statement about any individual."));
    openingFeedback.appendChild(note);

    lockForm(openingForm);
    openExplorer();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    showFeedback(openingFeedback, "neutral",
      "Estimate skipped — demonstration mode.", "");
    lockForm(openingForm);
    openExplorer();
  });

  /* =======================================================================
     Challenge — match the sentence to the index
     ===================================================================== */

  var MATCHES = [
    {
      id: "m1", answer: "cles",
      title: "The 71% pairwise sentence",
      why:
        "This is the probability of superiority, sometimes called the " +
        "common-language effect size: the chance that a randomly drawn member " +
        "of one group scores above a randomly drawn member of the other. It " +
        "is the index that translates most directly into English, and the one " +
        "that survives best when the distributions are not normal, because it " +
        "can be counted from the data without assuming a shape."
    },
    {
      id: "m2", answer: "u3",
      title: "The 79% above-the-mean sentence",
      why:
        "This is U3: the share of one group lying above the other group's " +
        "mean. It is easy to confuse with the probability of superiority " +
        "because both are percentages of people, but they answer different " +
        "questions - one compares a person with a mean, the other compares a " +
        "person with a person, and at d = 0.8 they come out at 79% and 71%."
    },
    {
      id: "m3", answer: "d",
      title: "The 0.80 standard deviations sentence",
      why:
        "This is Cohen's d itself, and it is the only one of the four that is " +
        "not a share of anything. That is exactly why it needs translating " +
        "before a reader can picture it."
    },
    {
      id: "m4", answer: "ovl",
      title: "The 69% common-ground sentence",
      why:
        "This is the overlap coefficient: the area lying under both densities " +
        "at once. It is the most sobering of the four, because 69% common " +
        "ground is what a conventionally large effect looks like."
    },
    {
      id: "m5", answer: "none",
      title: "The 95% probability sentence",
      why:
        "None of these, and no statistic in frequentist testing means this. " +
        "It is the reversed-conditional error: a p-value or a confidence level " +
        "read as the probability that a hypothesis is true. It is included " +
        "here because it appears in results paragraphs alongside genuine " +
        "effect sizes, where it borrows their credibility."
    }
  ];

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = MATCHES.map(function (m) { return $("#" + m.id).value; });
    if (chosen.some(function (v) { return !v; })) {
      challengeError.textContent = "Match all five sentences before checking.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = MATCHES.filter(function (m, i) {
      return chosen[i] === m.answer;
    }).length;
    var tone = right === 5 ? "good" : right >= 3 ? "caution" : "warn";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", right + " of the five."));
    p.appendChild(document.createTextNode(
      " All four genuine indices describe the same pair of distributions, so " +
      "they are not alternatives to one another - they are four translations " +
      "of one fact, and a results paragraph is clearer for carrying two of " +
      "them rather than one."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    MATCHES.forEach(function (m, i) {
      var li = make("li");
      li.appendChild(make("strong", null,
        m.title + " — " + (chosen[i] === m.answer ? "correct. " : "not this one. ")));
      li.appendChild(document.createTextNode(m.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(right + " of the five matched correctly.", { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    explorerSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    meanBRange.value = String(DEFAULTS.meanB);
    sdARange.value = String(DEFAULTS.sdA);
    sdBRange.value = String(DEFAULTS.sdB);
    nRange.value = String(DEFAULTS.n);
    guessRange.value = String(DEFAULTS.guess);
    syncGuess();
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Estimate the overlap above to open the explorer.",
    { immediate: true });
})();
