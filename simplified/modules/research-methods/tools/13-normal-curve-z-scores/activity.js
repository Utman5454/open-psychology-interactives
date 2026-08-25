/* =========================================================================
   The Same Mark, Two Different Distributions — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/13-normal-curve-z-scores/

   TEACHING JOB
   ------------
   A raw score is not interpretable on its own. What it is worth depends on
   the distribution it sits in, and standardising is how that is expressed.

   WHAT IS PRESERVED
   -----------------
   Experiment 1 of the original: the live normal curve with mean, spread and
   raw score under the learner's control, reporting z, percentile and tail
   areas computed from the normal cumulative distribution.

       z          = (x - mu) / sigma
       percentile = Phi(z)
       above      = 1 - Phi(z)
       either way = 2 * (1 - Phi(|z|))

   TWO DELIBERATE DESIGN DECISIONS
   -------------------------------
   1. BOTH AXES ARE FIXED. The score axis is always 0 to 100 and the density
      axis is always 0 to DENSITY_MAX. If the axes rescaled to fit the curve,
      every curve would look the same and the activity would demonstrate
      nothing. Fixed axes are what let a mark stay still while the
      distribution slides underneath it, and they are also what makes the
      falling peak visible when the spread is widened, which is the
      conservation of area made concrete.

   2. THE FIGURE CARRIES TWO AXES, not one. The lower axis is the identical
      axis relabelled in standard deviations. The original's own sentence,
      "standardising does not change the distribution, it relabels the axis",
      is the whole activity, so the figure states it rather than the prose.

   WHAT WAS REDUCED
   ----------------
   The second experiment placing one mark on two distributions at once, the
   extended one-tailed against two-tailed treatment, and the read-the-curve
   challenge set. A single "as extreme either way" figure is kept, because it
   is the answer to "how unusual is this mark" rather than a hypothesis-testing
   concept, and dropping it would leave the readout unable to answer the
   question the activity asks.

   There is no randomness here and nothing to seed: the curve is a function,
   not a sample. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var SCORE_MIN = 0;
  var SCORE_MAX = 100;
  /* Chosen so the tightest allowed curve, sd = 4, just fits: its peak density
     is 1 / (4 * sqrt(2 pi)) = 0.0997. */
  var DENSITY_MAX = 0.105;
  var CHANGES_BEFORE_EXPLAINING = 3;

  var muInput = document.getElementById("mu");
  var sdInput = document.getElementById("sd");
  var scoreInput = document.getElementById("score");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var challenge = document.getElementById("challenge");
  var explain = document.getElementById("explain");
  var task = document.getElementById("task");
  var taskText = document.getElementById("task-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var changes = 0;
  var taskIndex = -1;

  function mu() { return Number(muInput.value); }
  function sd() { return Math.max(1, Number(sdInput.value)); }
  function score() { return Number(scoreInput.value); }
  function z() { return (score() - mu()) / sd(); }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var LEFT = 78;
    var RIGHT = 856;
    var TITLE_Y = 22;
    var TOP = 52;
    var BASE = 300;              /* the curve sits on this line */
    var RAW_TICK_Y = BASE + 22;
    var RAW_CAP_Y = BASE + 44;
    var Z_AXIS_Y = BASE + 78;    /* the same axis, relabelled */
    var Z_TICK_Y = Z_AXIS_Y + 22;
    var Z_CAP_Y = Z_AXIS_Y + 44;

    var X = function (v) {
      return LEFT + ((v - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * (RIGHT - LEFT);
    };
    var Y = function (d) { return BASE - (d / DENSITY_MAX) * (BASE - TOP); };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (Z_CAP_Y + 22));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "The distribution of marks, on an axis that never moves";
    chart.appendChild(title);

    /* Points along the curve, at one score unit, which is fine at this width. */
    var m = mu(), s = sd(), step = 0.5;
    var points = [];
    var v = SCORE_MIN;
    while (v <= SCORE_MAX + 1e-9) {
      points.push([v, S.density(v, m, s)]);
      v += step;
    }

    /* Shaded area below the mark: everyone who scored less. */
    var cut = score();
    var below = points.filter(function (p) { return p[0] <= cut; });
    if (below.length > 1) {
      var d = "M " + X(below[0][0]).toFixed(1) + " " + BASE;
      below.forEach(function (p) {
        d += " L " + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1);
      });
      d += " L " + X(below[below.length - 1][0]).toFixed(1) + " " + BASE + " Z";
      chart.appendChild(svg("path", {
        d: d, fill: "#1C7293", "fill-opacity": "0.22", stroke: "none"
      }));
    }

    /* The curve itself. */
    var curve = points.map(function (p, i) {
      return (i === 0 ? "M " : "L ") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1);
    }).join(" ");
    chart.appendChild(svg("path", {
      d: curve, fill: "none", stroke: "#1C7293", "stroke-width": "2.6",
      "stroke-linejoin": "round"
    }));

    /* The mean, so the learner can see the curve slide. */
    chart.appendChild(svg("line", {
      x1: X(m).toFixed(1), y1: Y(S.density(m, m, s)).toFixed(1),
      x2: X(m).toFixed(1), y2: BASE, class: "plot__zero"
    }));
    var meanTag = svg("text", {
      x: X(m).toFixed(1), y: (Y(S.density(m, m, s)) - 8).toFixed(1),
      "text-anchor": "middle", class: "plot__sub plot__over"
    });
    meanTag.textContent = "mean " + m;
    chart.appendChild(meanTag);

    /* The mark, drawn full height so it is obviously the thing standing still. */
    chart.appendChild(svg("line", {
      x1: X(cut).toFixed(1), y1: TOP - 8, x2: X(cut).toFixed(1), y2: BASE,
      stroke: "#C0434F", "stroke-width": "2.6"
    }));
    var markTag = svg("text", {
      x: X(cut).toFixed(1), y: TOP - 16, "text-anchor": "middle",
      class: "plot__sub plot__over", fill: "#C0434F"
    });
    markTag.textContent = "the mark: " + cut;
    chart.appendChild(markTag);

    /* Upper axis: raw scores. */
    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    [0, 20, 40, 60, 80, 100].forEach(function (t) {
      var tick = svg("text", { x: X(t).toFixed(1), y: RAW_TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(t);
      chart.appendChild(tick);
    });
    var rawCap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: RAW_CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    rawCap.textContent = "Raw score";
    chart.appendChild(rawCap);

    /* Lower axis: the identical axis in standard deviations. Only the whole
       z values that actually fall inside 0 to 100 are drawn, which is itself
       informative: a tight distribution runs off the end of the scale. */
    var zLo = Math.ceil((SCORE_MIN - m) / s);
    var zHi = Math.floor((SCORE_MAX - m) / s);
    chart.appendChild(svg("line", {
      x1: X(Math.max(SCORE_MIN, m + zLo * s)).toFixed(1), y1: Z_AXIS_Y,
      x2: X(Math.min(SCORE_MAX, m + zHi * s)).toFixed(1), y2: Z_AXIS_Y,
      class: "plot__axis"
    }));
    var zv = zLo;
    while (zv <= zHi) {
      var zx = X(m + zv * s);
      chart.appendChild(svg("line", {
        x1: zx.toFixed(1), y1: Z_AXIS_Y - 5, x2: zx.toFixed(1), y2: Z_AXIS_Y + 5,
        class: "plot__axis"
      }));
      var zt = svg("text", { x: zx.toFixed(1), y: Z_TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      zt.textContent = zv > 0 ? "+" + zv : String(zv);
      chart.appendChild(zt);
      zv += 1;
    }
    var zCap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: Z_CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    zCap.textContent = "The same axis, in standard deviations from the mean (z)";
    chart.appendChild(zCap);

    renderReadout();
    describe();
  }

  function pct(p) {
    if (p >= 0.9995) { return "> 99.9%"; }
    if (p <= 0.0005) { return "< 0.1%"; }
    return (100 * p).toFixed(1) + "%";
  }

  function renderReadout() {
    var zed = z();
    var belowP = S.phi(zed);
    tileReset();
    tile("z-score", (zed >= 0 ? "+" : "−") + Math.abs(zed).toFixed(2),
      "standard deviations from the mean");
    tile("Percentile", pct(belowP), "of the distribution scores below the mark");
    tile("Above the mark", pct(1 - belowP), "of the distribution scores higher");
    tile("As extreme either way", pct(2 * (1 - S.phi(Math.abs(zed)))),
      "this far from the mean in either direction");
  }

  function tileReset() { readout.textContent = ""; }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    readout.appendChild(item);
  }

  function describe() {
    var zed = z();
    chartDesc.textContent =
      "A normal curve with mean " + mu() + " and standard deviation " + sd() +
      ", drawn on a fixed score axis running from 0 to 100. A vertical mark " +
      "stands at " + score() + ", which is " +
      (Math.abs(zed) < 0.005 ? "exactly at the mean"
        : Math.abs(zed).toFixed(2) + " standard deviations " +
          (zed > 0 ? "above" : "below") + " the mean") +
      ". The area below the mark is " + pct(S.phi(zed)) +
      " of the distribution and the area above it is " + pct(1 - S.phi(zed)) +
      ". Beneath, the same axis is relabelled in standard deviations.";
  }

  /* --- The challenge --------------------------------------------------- */
  /* Three settings that each make the same point in a different direction.
     They set the controls and say what to look at; nothing is marked, because
     the figure is the answer. */

  var TASKS = [
    {
      mu: 50, sd: 10, score: 62,
      text: "Start here. A mark of 62 on a cohort averaging 50, with a " +
        "standard deviation of 10. Note the percentile, then leave the mark " +
        "alone and drag the standard deviation down to 4. The cohort has not " +
        "got worse and the mark has not got better, yet the same 62 has gone " +
        "from respectable to near the very top. Ask yourself which of those " +
        "two facts a marker should be told about."
    },
    {
      mu: 62, sd: 10, score: 62,
      text: "Now the mark sits exactly on the mean, so z is 0 and half the " +
        "cohort is below it. Drag the mean down towards 40 without touching " +
        "the mark. Watch the z-score and the percentile climb while the raw " +
        "number on the axis stays exactly where it was."
    },
    {
      mu: 50, sd: 20, score: 90,
      text: "A very high raw mark on a very spread-out distribution. It is " +
        "still only two standard deviations out, and about one person in " +
        "forty beats it. Now drag the standard deviation to 8 and watch the " +
        "same 90 become something almost nobody achieves. Spread is what " +
        "decides whether a high number is remarkable."
    }
  ];

  /* --- Controls -------------------------------------------------------- */

  /* Handles are kept so the value outputs can be resynchronised after the
     controls are set programmatically. Calling bindRange again would attach a
     second listener each time. */
  var ranges = ["#mu", "#sd", "#score"].map(function (sel) {
    return wb.bindRange(sel, { format: function (v) { return v; } });
  });
  function syncRanges() {
    ranges.forEach(function (r) { if (r) { r.sync(); } });
  }

  function refresh(announce) {
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      var zed = z();
      wb.announce("The mark of " + score() + " is now z " +
        (zed >= 0 ? "plus " : "minus ") + Math.abs(zed).toFixed(2) +
        ", at the " + pct(S.phi(zed)) + " point of the distribution.");
    }
  }

  [muInput, sdInput, scoreInput].forEach(function (input) {
    input.addEventListener("input", function () { render(); });
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  challenge.addEventListener("click", function () {
    taskIndex = (taskIndex + 1) % TASKS.length;
    var t = TASKS[taskIndex];
    muInput.value = String(t.mu);
    sdInput.value = String(t.sd);
    scoreInput.value = String(t.score);
    syncRanges();
    taskText.textContent = t.text;
    wb.show("#task");
    changes += 1;
    refresh(false);
    wb.announce("Challenge " + (taskIndex + 1) + " of " + TASKS.length +
      " is set. The instructions are below the figure.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    taskIndex = -1;
    muInput.value = "50";
    sdInput.value = "10";
    scoreInput.value = "62";
    syncRanges();
    explain.disabled = true;
    wb.hide("#task");
    wb.hide("#synthesis");
    refresh(false);
  });

  refresh(false);
})();
