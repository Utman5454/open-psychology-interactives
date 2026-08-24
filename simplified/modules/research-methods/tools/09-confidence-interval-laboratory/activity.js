/* =========================================================================
   Confidence Interval Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/09-confidence-interval-laboratory/

   TEACHING JOB
   ------------
   Coverage. What the ninety-five per cent refers to, and what it does not.

   THE MODEL, unchanged from the original
   --------------------------------------
   A simulated population has a true mean change of exactly TRUE_MEAN minutes
   of walking per day. Each study draws n observations from
   Normal(TRUE_MEAN, sigma) and reports

       interval = sample mean  +/-  z(level) * sigma / sqrt(n)

   Sigma is treated as KNOWN because the simulation states it, which is why
   the multiplier is a normal quantile rather than a t quantile.

   Because sigma is known, every interval in a run has exactly the same width.
   That is pedagogically useful: the only thing that varies from study to
   study is where the interval sits, so the picture shows the intervals moving
   around a truth that does not.

   Nominal coverage is exact under this model, so about level% of intervals
   contain TRUE_MEAN whatever n and sigma are. Changing n or sigma changes
   WIDTH; only the confidence level changes COVERAGE. Separating those two is
   the point, and all three controls are kept because removing any of them
   would remove one half of that comparison.

   WHAT WAS REDUCED
   ----------------
   Experiment 2 entirely: four fictional trials judged against a
   smallest-change-that-matters threshold. Precision against importance is a
   genuinely important second teaching job with its own apparatus, and it
   stays in the longer version. Also gone: the opening prediction and the
   select-all challenge.

   Randomness is seeded (mulberry32 with Box-Muller normals). Nothing is
   stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var TRUE_MEAN = 12;
  var Z = { 80: 1.2816, 90: 1.6449, 95: 1.9600, 99: 2.5758 };
  var SHOWN = 26;               /* rows drawn; the count covers every study */
  var STUDIES_BEFORE_EXPLAINING = 100;

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

  var levelSelect = document.getElementById("level");
  var nInput = document.getElementById("n");
  var sdInput = document.getElementById("sd");
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var run1 = document.getElementById("run1");
  var run100 = document.getElementById("run100");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var studies = [];

  function level() { return Number(levelSelect.value); }
  function n() { return Math.max(5, Math.round(Number(nInput.value) || 5)); }
  function sd() { return Math.max(1, Number(sdInput.value) || 1); }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }
  function halfWidth() { return Z[level()] * sd() / Math.sqrt(n()); }

  function run(count) {
    var size = n();
    var sigma = sd();
    var half = halfWidth();
    var drawn = 0;
    while (drawn < count) {
      var random = mulberry32(seed() + studies.length * 7919);
      var total = 0;
      var i = 0;
      while (i < size) { total += TRUE_MEAN + normal(random) * sigma; i += 1; }
      var mean = total / size;
      studies.push({ mean: mean, low: mean - half, high: mean + half,
                     covers: mean - half <= TRUE_MEAN && TRUE_MEAN <= mean + half });
      drawn += 1;
    }
    if (studies.length >= STUDIES_BEFORE_EXPLAINING) { explain.disabled = false; }
    render();
  }

  function invalidate(reason) {
    if (!studies.length) { render(); return; }
    studies = [];
    explain.disabled = true;
    render();
    wb.announce(reason + " The studies run under the old settings have been cleared.");
  }

  function covered() {
    return studies.filter(function (s) { return s.covers; }).length;
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    /* Bands, not offsets: the study count and the true-value label were both
       landing on the same line of the figure. */
    var LEFT = 60;
    var RIGHT = 850;
    var TITLE_Y = 22;        /* glyphs about 9 to 26  */
    var TRUTH_Y = 50;        /* glyphs about 37 to 54 */
    var TOP = 70;            /* the reference line starts at TOP - 8 = 62 */
    var ROW = 9;
    var BOTTOM = TOP + SHOWN * ROW;
    var LABEL_Y = BOTTOM + 24;
    var CAPTION_Y = BOTTOM + 46;

    var span = Math.max(halfWidth() * 1.6, sd() / Math.sqrt(n()) * 4, 6);
    var LO = TRUE_MEAN - span;
    var HI = TRUE_MEAN + span;
    var X = function (v) {
      return LEFT + ((Math.max(LO, Math.min(HI, v)) - LO) / (HI - LO)) * (RIGHT - LEFT);
    };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 60));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = studies.length
      ? "One interval per study, " + Math.min(studies.length, SHOWN) + " most recent shown of " + studies.length
      : "One interval per study, none run yet";
    chart.appendChild(title);

    var recent = studies.slice(-SHOWN).reverse();
    recent.forEach(function (study, index) {
      var y = TOP + index * ROW;
      chart.appendChild(svg("line", {
        x1: X(study.low).toFixed(1), y1: y, x2: X(study.high).toFixed(1), y2: y,
        class: study.covers ? "plot__interval" : "plot__interval plot__interval--miss"
      }));
    });

    chart.appendChild(svg("line", {
      x1: X(TRUE_MEAN), y1: TOP - 8, x2: X(TRUE_MEAN), y2: BOTTOM, class: "plot__zero"
    }));
    var truth = svg("text", { x: X(TRUE_MEAN), y: TRUTH_Y, "text-anchor": "middle", class: "plot__tick" });
    truth.textContent = "True value " + TRUE_MEAN;
    chart.appendChild(truth);

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    [LO, (LO + TRUE_MEAN) / 2, TRUE_MEAN, (TRUE_MEAN + HI) / 2, HI].forEach(function (tick) {
      var mark = svg("text", { x: X(tick), y: LABEL_Y, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = tick.toFixed(1);
      chart.appendChild(mark);
    });
    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Mean change in walking, minutes per day";
    chart.appendChild(caption);

    renderReadout();
    describe();
  }

  function renderReadout() {
    readout.textContent = "";
    tile("Studies run", String(studies.length), studies.length ? "One interval each" : "None yet");
    tile("Intervals containing the truth",
      studies.length ? covered() + " of " + studies.length : "not yet",
      studies.length ? (100 * covered() / studies.length).toFixed(0) + " per cent, against " +
        level() + " per cent asked for" : "Run some studies");
    tile("Interval width", "plus or minus " + halfWidth().toFixed(2),
      "The same for every study, because the spread is known");
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
    chartDesc.textContent =
      "One horizontal interval per study, stacked with the most recent at the " +
      "top, against a true value of " + TRUE_MEAN +
      " marked by a vertical line. Every interval is plus or minus " +
      halfWidth().toFixed(2) + " wide, because the population spread is known. " +
      (studies.length
        ? studies.length + " studies run at a confidence level of " + level() +
          " per cent, of which " + covered() + " contain the true value, a " +
          "coverage of " + (100 * covered() / studies.length).toFixed(0) + " per cent. " +
          "Intervals that miss are drawn dashed."
        : "No studies have been run yet.");
  }

  /* --- Controls -------------------------------------------------------- */

  wb.bindRange("#n", { format: function (v) { return v; } });
  wb.bindRange("#sd", { format: function (v) { return v; } });

  levelSelect.addEventListener("change", function () { invalidate("Confidence level changed."); });
  nInput.addEventListener("change", function () { invalidate("Sample size changed."); });
  sdInput.addEventListener("change", function () { invalidate("Population spread changed."); });
  seedInput.addEventListener("change", function () { invalidate("Seed changed."); });

  run1.addEventListener("click", function () { run(1); announce(); });
  run100.addEventListener("click", function () { run(100); announce(); });

  function announce() {
    wb.announce(
      studies.length + " studies run. " + covered() + " intervals contain the true value, " +
      (100 * covered() / studies.length).toFixed(0) + " per cent, against " +
      level() + " per cent asked for. Width is plus or minus " + halfWidth().toFixed(2) + "."
    );
  }

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    studies = [];
    levelSelect.value = "95";
    nInput.value = "25";
    sdInput.value = "20";
    seedInput.value = "2109";
    explain.disabled = true;
    wb.hide("#synthesis");
    render();
  });

  render();
})();
