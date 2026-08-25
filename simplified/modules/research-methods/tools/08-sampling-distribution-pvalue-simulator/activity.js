/* =========================================================================
   Sampling Distribution and p-Value Simulator — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/

   TEACHING JOB
   ------------
   A p-value is a tail area under an assumed model, and the area is a
   proportion of something you can count.

   THE MODEL, unchanged from the original
   --------------------------------------
       group A ~ Normal(0, sigma),  group B ~ Normal(0, sigma),  n per group
       statistic  = mean(A) - mean(B)
       SE         = sigma * sqrt(2/n)
       reference  = Normal(0, SE)

   The population standard deviation is treated as KNOWN, because the null
   model states it. That is why the reference distribution is normal rather
   than t: nothing is being estimated from the sample. A real t-test estimates
   sigma and pays for that with heavier tails, and the page says so.

       theoretical p = 2 * (1 - Phi(|observed| / SE))
       simulated  p  = share of simulated null studies with
                       |difference| >= |observed|

   Both are shown, because the agreement between them is the demonstration
   that the tail area is not a convention but a count.

   NO THRESHOLD IS NAMED, as in the original. Whether a tail area of a
   particular size should change anybody's behaviour is a decision rather than
   a statistical fact, and 0.05 appears nowhere.

   WHAT WAS REDUCED
   ----------------
   The opening three-part prediction, the progressive disclosure of the
   reference curve, and the select-all challenge on interpretation. The four
   controls are all kept: each changes a different thing about what the
   picture means, and removing any of them would remove a distinction rather
   than a decoration.

   Randomness is seeded (mulberry32 with Box-Muller normals) so a whole run is
   reproducible. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var BIN_COUNT = 48;
  var STUDIES_BEFORE_EXPLAINING = 200;

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

  function normal(random) {
    var u = Math.max(random(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  }

  /** Normal CDF by Abramowitz and Stegun 7.1.26. */
  function phi(z) {
    var s = z < 0 ? -1 : 1;
    var x = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + s * y);
  }

  var nInput = document.getElementById("n");
  var sdInput = document.getElementById("sd");
  var obsInput = document.getElementById("obs");
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var run20 = document.getElementById("run20");
  var run1000 = document.getElementById("run1000");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var differences = [];

  function n() { return Math.max(5, Math.round(Number(nInput.value) || 5)); }
  function sd() { return Math.max(1, Number(sdInput.value) || 1); }
  function observed() { return Math.abs(Number(obsInput.value) || 0); }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }
  function se() { return sd() * Math.sqrt(2 / n()); }

  function theoreticalP() {
    return 2 * (1 - phi(observed() / se()));
  }

  function simulatedP() {
    if (!differences.length) { return null; }
    var hits = differences.filter(function (d) {
      return Math.abs(d) >= observed();
    }).length;
    return hits / differences.length;
  }

  function run(count) {
    var size = n();
    var sigma = sd();
    var drawn = 0;
    while (drawn < count) {
      var random = mulberry32(seed() + differences.length * 7919);
      var a = 0;
      var b = 0;
      var i = 0;
      while (i < size) {
        a += normal(random) * sigma;
        b += normal(random) * sigma;
        i += 1;
      }
      differences.push(a / size - b / size);
      drawn += 1;
    }
    if (differences.length >= STUDIES_BEFORE_EXPLAINING) { explain.disabled = false; }
    render();
  }

  function invalidate(reason) {
    if (!differences.length) { render(); return; }
    differences = [];
    explain.disabled = true;
    render();
    wb.announce(reason + " The simulated studies have been cleared.");
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    /* Bands, not offsets. The study count and the zero-line label were both
       landing on the same line of the figure; each now owns a strip that
       nothing else is drawn in. */
    var LEFT = 60;
    var RIGHT = 850;
    var TITLE_Y = 22;        /* glyphs about 9 to 26   */
    var ZERO_Y = 50;         /* glyphs about 37 to 54  */
    var TOP = 70;            /* the zero line starts at TOP - 8 = 62 */
    var HEIGHT = 156;
    var AXIS_Y = TOP + HEIGHT;
    var LABEL_Y = AXIS_Y + 22;
    var CAPTION_Y = AXIS_Y + 44;

    var limit = Math.max(4 * se(), observed() * 1.25, 1);
    var X = function (v) {
      return LEFT + ((Math.max(-limit, Math.min(limit, v)) + limit) / (2 * limit)) *
        (RIGHT - LEFT);
    };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (AXIS_Y + 58));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = differences.length
      ? "One mark per study in a world with no difference, " + differences.length + " so far"
      : "One mark per study in a world with no difference, none run yet";
    chart.appendChild(title);

    /* Everything at least as far from zero as the observed difference. */
    if (observed() > 0) {
      chart.appendChild(svg("rect", {
        x: LEFT, y: TOP, width: Math.max(0, X(-observed()) - LEFT), height: HEIGHT,
        class: "plot__band plot__band--alert"
      }));
      chart.appendChild(svg("rect", {
        x: X(observed()), y: TOP, width: Math.max(0, RIGHT - X(observed())), height: HEIGHT,
        class: "plot__band plot__band--alert"
      }));
    }

    if (differences.length) {
      var counts = new Array(BIN_COUNT);
      var b = 0;
      while (b < BIN_COUNT) { counts[b] = 0; b += 1; }
      var width = (2 * limit) / BIN_COUNT;
      differences.forEach(function (d) {
        var index = Math.floor((d + limit) / width);
        if (index < 0) { index = 0; }
        if (index >= BIN_COUNT) { index = BIN_COUNT - 1; }
        counts[index] += 1;
      });
      var tallest = Math.max.apply(null, counts) || 1;
      counts.forEach(function (count, index) {
        if (!count) { return; }
        var x0 = X(-limit + index * width);
        var x1 = X(-limit + (index + 1) * width);
        var h = (count / tallest) * HEIGHT;
        chart.appendChild(svg("rect", {
          x: x0.toFixed(1), y: (AXIS_Y - h).toFixed(1),
          width: Math.max(1, x1 - x0 - 1).toFixed(1), height: h.toFixed(1),
          class: "plot__hist"
        }));
      });
    }

    chart.appendChild(svg("line", {
      x1: X(0), y1: TOP - 8, x2: X(0), y2: AXIS_Y, class: "plot__zero"
    }));
    var zeroLabel = svg("text", { x: X(0), y: ZERO_Y, "text-anchor": "middle", class: "plot__tick" });
    zeroLabel.textContent = "True difference: zero";
    chart.appendChild(zeroLabel);

    chart.appendChild(svg("line", { x1: LEFT, y1: AXIS_Y, x2: RIGHT, y2: AXIS_Y, class: "plot__axis" }));
    [-limit, -limit / 2, 0, limit / 2, limit].forEach(function (tick) {
      var mark = svg("text", { x: X(tick), y: LABEL_Y, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = tick.toFixed(1);
      chart.appendChild(mark);
    });
    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Difference between the two group means";
    chart.appendChild(caption);

    renderReadout();
    describe();
  }

  function renderReadout() {
    var sim = simulatedP();
    readout.textContent = "";
    tile("Studies run", String(differences.length),
      differences.length ? "All with a true difference of zero" : "None yet");
    tile("p as an area", fmtP(theoreticalP()),
      "Under a normal with standard error " + se().toFixed(2));
    tile("p as a count", sim === null ? "not yet" : fmtP(sim),
      sim === null ? "Run some studies"
        : differences.filter(function (d) { return Math.abs(d) >= observed(); }).length +
          " of " + differences.length + " landed this far out or further");
  }

  function fmtP(p) {
    return p < 0.001 ? "< 0.001" : p.toFixed(3);
  }

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
    var sim = simulatedP();
    chartDesc.textContent =
      "A histogram of the difference between two group means, one mark per " +
      "simulated study, from two groups of " + n() +
      " drawn from the same population with a standard deviation of " + sd() +
      ". Zero is marked. Everything at least " + observed().toFixed(1) +
      " from zero in either direction is shaded. " +
      (sim === null
        ? "No studies have been run yet. The area under the reference normal in those regions is " +
          fmtP(theoreticalP()) + "."
        : differences.length + " studies run, of which " +
          differences.filter(function (d) { return Math.abs(d) >= observed(); }).length +
          " landed in the shaded regions, a share of " + fmtP(sim) +
          ", against an area of " + fmtP(theoreticalP()) + ".");
  }

  /* --- Controls -------------------------------------------------------- */

  wb.bindRange("#n", { format: function (v) { return v; } });
  wb.bindRange("#sd", { format: function (v) { return v; } });
  wb.bindRange("#obs", { format: function (v) { return v; } });

  nInput.addEventListener("change", function () { invalidate("Group size changed."); });
  sdInput.addEventListener("change", function () { invalidate("Population standard deviation changed."); });
  /* The observed difference does not invalidate the pile: the same simulated
     studies answer the question for any observed value, which is worth
     letting the learner see. */
  obsInput.addEventListener("input", function () { render(); });
  seedInput.addEventListener("change", function () { invalidate("Seed changed."); });

  run20.addEventListener("click", function () { run(20); announce(20); });
  run1000.addEventListener("click", function () { run(1000); announce(1000); });

  function announce(count) {
    var sim = simulatedP();
    wb.announce(
      count + " more studies run. " + differences.length + " in total. " +
      "p as a count is " + fmtP(sim) + ", against an area of " + fmtP(theoreticalP()) + "."
    );
  }

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    differences = [];
    nInput.value = "40";
    sdInput.value = "15";
    obsInput.value = "5";
    seedInput.value = "5140";
    explain.disabled = true;
    wb.hide("#synthesis");
    render();
  });

  render();
})();
