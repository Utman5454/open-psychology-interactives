/* =========================================================================
   Central Limit Theorem Simulator — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/14-central-limit-theorem-simulator/

   WHAT IS PRESERVED
   -----------------
   One picture, two panels, one shared value axis:

     upper panel  the POPULATION density, with the most recent SAMPLE drawn
                  as ticks along the axis beneath it;
     lower panel  the histogram of the MEANS of every sample drawn so far.

   Keeping those three objects visually distinct while sharing a scale is the
   whole design. The confusion between them is what the theorem is usually
   taught through and rarely taught past, and it is why the upper panel is on
   screen at all: it never changes shape, at any sample size.

   Repeated sampling, the sample-size slider, the seed and the shared versus
   zoomed scale are all kept. The zoom in particular earns its place: without
   it, learners watching the means narrow on a shared axis conclude that a
   bigger sample makes the data less variable, and with it they can see that
   the picture changed and the standard error did not.

   Theory sits beside simulation, as in the original:

       centre           = mu
       standard error   = sigma / sqrt(n)
       skewness         = population skewness / sqrt(n)

   Randomness is seeded (mulberry32, Box-Muller normals, inverse-CDF
   exponentials), so a lecturer can reproduce a figure exactly.

   WHAT WAS REDUCED
   ----------------
   Four populations to two. Normal was dropped because there is nothing for
   the theorem to do there, and uniform because bimodal makes the same point
   more sharply. The two that remain are non-normal in different ways and
   converge at different rates, which is what turns "thirty is enough" from a
   rule into something checkable.

   Excess kurtosis was dropped from the table. It is a fourth quantity and the
   most jargon-heavy; the shape change it describes is what the lower panel
   already shows.

   Also gone: the three-part prediction before the simulation, and the
   select-all challenge on interpretation.

   NO SYNTHESIS DIAGRAM, deliberately
   ----------------------------------
   The live figure is the visual. A second, static diagram of the same
   relationship would be an extra picture because there was room for one.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var BIN_COUNT = 40;
  var MAX_TICKS = 60;              /* sample ticks drawn under the population */
  var MEANS_BEFORE_EXPLAINING = 30;
  var DRAW_MANY = 50;

  var POPULATIONS = {
    skewed: {
      label: "Skewed",
      mu: 40, sigma: 20, skew: 2,
      axis: [15, 118],
      note: "Twenty plus an exponential wait. A long right tail and no left one.",
      density: function (x) {
        return x < 20 ? 0 : Math.exp(-(x - 20) / 20) / 20;
      },
      draw: function (random) {
        return 20 - 20 * Math.log(Math.max(random(), 1e-12));
      }
    },
    bimodal: {
      /* half Normal(30, 6), half Normal(70, 6):
         variance 20^2 + 6^2 = 436, so sigma = 20.881; symmetric, so skew 0 */
      label: "Bimodal",
      mu: 50, sigma: Math.sqrt(436), skew: 0,
      axis: [5, 95],
      note: "Two separate humps. Nothing in the middle, and no tail either way.",
      density: function (x) {
        var a = (x - 30) / 6;
        var b = (x - 70) / 6;
        return 0.5 * Math.exp(-0.5 * a * a) / (6 * Math.sqrt(2 * Math.PI)) +
               0.5 * Math.exp(-0.5 * b * b) / (6 * Math.sqrt(2 * Math.PI));
      },
      draw: function (random, normal) {
        return (random() < 0.5 ? 30 : 70) + normal(random) * 6;
      }
    }
  };

  /* --- Seeded randomness ----------------------------------------------- */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalDraw(random) {
    var u = Math.max(random(), 1e-12);
    var v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* --- Elements -------------------------------------------------------- */

  var popSelect = document.getElementById("pop");
  var popNote = document.getElementById("pop-note");
  var nInput = document.getElementById("n");
  var seedInput = document.getElementById("seed");
  var zoomInput = document.getElementById("zoom");
  var zoomLabel = document.getElementById("zoom-label");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");
  var drawOne = document.getElementById("draw-one");
  var drawMany = document.getElementById("draw-many");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";

  var means = [];
  var lastSample = [];

  function population() {
    return POPULATIONS[popSelect.value];
  }

  function sampleSize() {
    return Math.max(2, Math.round(Number(nInput.value) || 2));
  }

  function seedValue() {
    return Math.max(1, Math.round(Number(seedInput.value) || 1));
  }

  /* --- Drawing --------------------------------------------------------- */

  function drawSamples(count) {
    var pop = population();
    var n = sampleSize();
    var drawn = 0;

    while (drawn < count) {
      /* Stream position folded into the seed, so the same seed with the same
         settings reproduces the same run however it is broken into presses. */
      var random = mulberry32(seedValue() + means.length * 7919);
      var sample = [];
      var total = 0;
      var i = 0;

      while (i < n) {
        var value = pop.draw(random, normalDraw);
        sample.push(value);
        total += value;
        i += 1;
      }

      lastSample = sample;
      means.push(total / n);
      drawn += 1;
    }

    if (means.length >= MEANS_BEFORE_EXPLAINING) {
      explain.disabled = false;
    }

    render();
  }

  /** Means drawn under other settings are not comparable, so the pile goes. */
  function invalidate(reason) {
    if (!means.length) {
      render();
      return;
    }
    means = [];
    lastSample = [];
    explain.disabled = true;
    render();
    wb.announce(reason + " The means drawn under the old settings have been cleared.");
  }

  /* --- Statistics ------------------------------------------------------ */

  function stats(values) {
    var n = values.length;
    if (!n) {
      return null;
    }
    var mean = values.reduce(function (a, b) { return a + b; }, 0) / n;
    if (n < 2) {
      return { mean: mean, sd: null, skew: null };
    }
    var m2 = 0;
    var m3 = 0;
    values.forEach(function (value) {
      var d = value - mean;
      m2 += d * d;
      m3 += d * d * d;
    });
    var variance = m2 / (n - 1);
    var central2 = m2 / n;
    return {
      mean: mean,
      sd: Math.sqrt(variance),
      skew: central2 > 0 ? (m3 / n) / Math.pow(central2, 1.5) : 0
    };
  }

  function fmt(value, places) {
    if (value === null || value === undefined || isNaN(value)) {
      return "not yet";
    }
    return value.toFixed(places);
  }

  /* --- The figure ------------------------------------------------------ */

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function render() {
    var pop = population();
    var n = sampleSize();
    var summary = stats(means);

    /* Bands, not offsets. Every piece of text owns a horizontal strip that
       nothing else is drawn in, so a label can never land on a tick, an axis
       number or another label. The gaps below are all at least 8px, and the
       one between the two panels is deliberately larger. */
    var LEFT = 46;
    var RIGHT = 878;

    var UPPER_TITLE_Y = 22;      /* glyphs about 9 to 26  */
    var UPPER_TOP = 34;
    var UPPER_H = 100;           /* population panel: 34 to 134 */

    var TICKS_Y = 144;           /* sample ticks: 144 to 160 */
    var TICKS_H = 16;

    var SAMPLE_LABEL_Y = 182;    /* glyphs about 169 to 186 */

    var AXIS_Y = 194;            /* shared axis line */
    var AXIS_LABEL_Y = 214;      /* glyphs about 201 to 217 */

    var LOWER_TITLE_Y = 252;     /* glyphs about 239 to 256; 22px clear of the
                                    axis numbers above, which is the gap
                                    between the two panels */
    var LOWER_TOP = 264;
    var LOWER_H = 120;           /* means panel: 264 to 384 */
    var LOWER_AXIS = LOWER_TOP + LOWER_H;
    var LOWER_LABEL_Y = LOWER_AXIS + 20;
    var CAPTION_Y = LOWER_AXIS + 42;
    var TOTAL = LOWER_AXIS + 56;

    while (chart.childNodes.length > 2) {
      chart.removeChild(chart.lastChild);
    }
    chart.setAttribute("viewBox", "0 0 900 " + TOTAL);

    var lo = pop.axis[0];
    var hi = pop.axis[1];
    var X = function (v) {
      return LEFT + ((v - lo) / (hi - lo)) * (RIGHT - LEFT);
    };

    /* --- upper panel: the population, unchanged by anything --- */
    var peak = 0;
    var curve = [];
    var step = (hi - lo) / 160;
    var x = lo;
    while (x <= hi) {
      var d = pop.density(x);
      if (d > peak) { peak = d; }
      curve.push([x, d]);
      x += step;
    }

    var path = "M" + X(lo) + " " + (UPPER_TOP + UPPER_H);
    curve.forEach(function (point) {
      path += " L" + X(point[0]).toFixed(1) + " " +
        (UPPER_TOP + UPPER_H - (point[1] / peak) * UPPER_H).toFixed(1);
    });
    path += " L" + X(hi) + " " + (UPPER_TOP + UPPER_H) + " Z";
    chart.appendChild(svg("path", { d: path, class: "plot__density" }));

    label(LEFT, UPPER_TITLE_Y, "The population, " + pop.label.toLowerCase(), "plot__label");

    /* --- the most recent sample, as ticks --- */
    if (lastSample.length) {
      var shown = lastSample.slice(0, MAX_TICKS);
      shown.forEach(function (value) {
        chart.appendChild(svg("line", {
          x1: X(value).toFixed(1), y1: TICKS_Y,
          x2: X(value).toFixed(1), y2: TICKS_Y + TICKS_H,
          class: "plot__sample"
        }));
      });
      label(LEFT, SAMPLE_LABEL_Y,
        "One sample of " + n +
          (lastSample.length > MAX_TICKS ? ", first " + MAX_TICKS + " shown" : ""),
        "plot__sub");
    }

    chart.appendChild(svg("line", {
      x1: LEFT, y1: AXIS_Y, x2: RIGHT, y2: AXIS_Y, class: "plot__axis"
    }));
    axisTicks(X, lo, hi, AXIS_LABEL_Y);

    /* --- lower panel: the means, on the shared axis or zoomed --- */
    var zoomed = zoomInput.checked && means.length > 1;
    var llo = lo;
    var lhi = hi;

    if (zoomed) {
      var min = Math.min.apply(null, means);
      var max = Math.max.apply(null, means);
      var pad = Math.max((max - min) * 0.12, 0.5);
      llo = min - pad;
      lhi = max + pad;
    }

    var XL = function (v) {
      return LEFT + ((v - llo) / (lhi - llo)) * (RIGHT - LEFT);
    };

    label(LEFT, LOWER_TITLE_Y,
      means.length
        ? "The mean of each sample, " + means.length + " so far"
        : "The mean of each sample, none drawn yet",
      "plot__label");

    if (means.length) {
      var counts = new Array(BIN_COUNT);
      var b = 0;
      while (b < BIN_COUNT) { counts[b] = 0; b += 1; }
      var width = (lhi - llo) / BIN_COUNT;

      means.forEach(function (value) {
        var index = Math.floor((value - llo) / width);
        if (index < 0) { index = 0; }
        if (index >= BIN_COUNT) { index = BIN_COUNT - 1; }
        counts[index] += 1;
      });

      var tallest = Math.max.apply(null, counts) || 1;
      counts.forEach(function (count, index) {
        if (!count) { return; }
        var x0 = XL(llo + index * width);
        var x1 = XL(llo + (index + 1) * width);
        var h = (count / tallest) * LOWER_H;
        chart.appendChild(svg("rect", {
          x: x0.toFixed(1), y: (LOWER_AXIS - h).toFixed(1),
          width: Math.max(1, x1 - x0 - 1).toFixed(1), height: h.toFixed(1),
          class: "plot__hist"
        }));
      });
    }

    chart.appendChild(svg("line", {
      x1: LEFT, y1: LOWER_AXIS, x2: RIGHT, y2: LOWER_AXIS, class: "plot__axis"
    }));
    axisTicks(XL, llo, lhi, LOWER_LABEL_Y);

    label(LEFT + (RIGHT - LEFT) / 2, CAPTION_Y,
      zoomed
        ? "Value. The lower panel is zoomed to the means; the upper panel is not."
        : "Value. Both panels share this axis.",
      "plot__tick", "middle");

    renderTable(pop, n, summary);
    describe(pop, n, summary, zoomed);
  }

  function label(x, y, text, cls, anchor) {
    var node = svg("text", { x: x, y: y, class: cls });
    if (anchor) {
      node.setAttribute("text-anchor", anchor);
    }
    node.textContent = text;
    chart.appendChild(node);
  }

  /** `y` is the baseline the numbers sit on, not the line they belong to. */
  function axisTicks(scale, lo, hi, y) {
    var i = 0;
    while (i <= 4) {
      var value = lo + ((hi - lo) * i) / 4;
      label(scale(value), y,
        value.toFixed(lo === Math.round(lo) && hi === Math.round(hi) ? 0 : 1),
        "plot__tick", "middle");
      i += 1;
    }
  }

  /* --- Theory beside simulation ---------------------------------------- */

  function renderTable(pop, n, summary) {
    tableBody.textContent = "";

    row("Centre", pop.mu.toFixed(1), summary ? fmt(summary.mean, 1) : "not yet");
    row("Standard error", (pop.sigma / Math.sqrt(n)).toFixed(2),
        summary ? fmt(summary.sd, 2) : "not yet");
    row("Skewness", (pop.skew / Math.sqrt(n)).toFixed(2),
        summary ? fmt(summary.skew, 2) : "not yet");

    tableCaption.textContent = means.length
      ? "Across " + means.length + " samples of " + n + " from the " +
        pop.label.toLowerCase() + " population."
      : "Nothing drawn yet.";
  }

  function row(name, predicted, measured) {
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.textContent = name;
    tr.appendChild(th);
    tr.appendChild(cellOf(predicted));
    tr.appendChild(cellOf(measured));
    tableBody.appendChild(tr);
  }

  function cellOf(text) {
    var td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  function describe(pop, n, summary, zoomed) {
    chartDesc.textContent =
      "Two panels on " + (zoomed ? "different" : "one shared") + " value axis. " +
      "Above, the " + pop.label.toLowerCase() + " population, which does not " +
      "change shape at any sample size" +
      (lastSample.length ? ", with the most recent sample of " + n + " marked as ticks beneath it" : "") +
      ". Below, a histogram of " + means.length +
      (means.length === 1 ? " sample mean" : " sample means") +
      (summary && summary.sd !== null
        ? ", centred on " + summary.mean.toFixed(1) + " with a standard deviation of " +
          summary.sd.toFixed(2) + " against a predicted standard error of " +
          (pop.sigma / Math.sqrt(n)).toFixed(2)
        : "") + ".";
  }

  /* --- Controls -------------------------------------------------------- */

  wb.bindRange("#n", { format: function (value) { return value; } });

  popSelect.addEventListener("change", function () {
    popNote.textContent = population().note;
    invalidate("Population changed.");
  });

  nInput.addEventListener("change", function () {
    invalidate("Sample size changed.");
  });

  seedInput.addEventListener("change", function () {
    invalidate("Seed changed.");
  });

  zoomInput.addEventListener("change", function () {
    zoomLabel.setAttribute("data-checked", String(zoomInput.checked));
    render();
    wb.announce(
      zoomInput.checked
        ? "Lower panel zoomed to the means. The upper panel is unchanged, and so is the standard error."
        : "Both panels back on one shared axis."
    );
  });

  drawOne.addEventListener("click", function () {
    drawSamples(1);
    wb.announce("Sample " + means.length + " drawn. " + summaryLine());
  });

  drawMany.addEventListener("click", function () {
    drawSamples(DRAW_MANY);
    wb.announce(DRAW_MANY + " more samples drawn. " + summaryLine());
  });

  function summaryLine() {
    var summary = stats(means);
    if (!summary || summary.sd === null) {
      return "One mean so far.";
    }
    return means.length + " means, centred on " + summary.mean.toFixed(1) +
      " with a standard deviation of " + summary.sd.toFixed(2) + ".";
  }

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    means = [];
    lastSample = [];
    popSelect.value = "skewed";
    nInput.value = "25";
    seedInput.value = "7311";
    zoomInput.checked = false;
    zoomLabel.setAttribute("data-checked", "false");
    explain.disabled = true;
    popNote.textContent = population().note;
    wb.hide("#synthesis");
    render();
  });

  popNote.textContent = population().note;
  render();
})();
