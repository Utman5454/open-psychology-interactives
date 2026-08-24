/* =========================================================================
   Sampling Bias Simulator — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/04-sampling-bias-simulator/

   TEACHING JOB
   ------------
   The difference between an estimate that scatters and an estimate that is
   systematically off. One of those is fixed by a larger sample.

   THE POPULATION
   --------------
   Built once from a fixed seed, so the true mean below is the same in every
   browser and can be quoted in teaching notes. Each of 4,000 students has

       year        1, 2 or 3, in equal thirds
       commuter    35%
       job         40%

   and weekly independent study hours

       hours = 12.6 + 0.6*(year 2) + 1.4*(year 3) - 2.2*commuter - 3.0*job
               + Normal(0, 4)

   clamped at zero. THE POPULATION MEAN IS COMPUTED FROM THE GENERATED
   POPULATION, not asserted, so it is exactly what a perfect census would
   return.

   THE RECRUITMENT MODEL
   ---------------------
   Weighted sampling without replacement by the exponential-race method: give
   person i the key -log(U)/w(i) and take the n smallest. With w = 1 for
   everybody this is a simple random sample.

   WHAT WAS REDUCED
   ----------------
   Five methods to three. Convenience is kept because it fails in the worst
   way, selecting on the outcome itself. Quota is kept because it is the one
   that looks fixed and is not. Simple random is kept as the comparison.
   Stratified and volunteer are dropped: stratified teaches a second thing,
   that an unbiased method can still differ in precision, and volunteer is
   convenience again in a milder form.

   The non-response dial is dropped. It is a genuinely important second
   lesson, that randomly selecting names protects the selection step and does
   nothing about the step where people decide whether to answer, and it needs
   its own explanation. It stays in the longer version.

   Also gone: the composition table, the opening prediction and the select-all
   challenge.

   The population is generated and the selection weights are invented, chosen
   to make the effect legible rather than to estimate anything. Nothing is
   stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var POPULATION_SEED = 90210;
  var POPULATION_N = 4000;
  var BIN_COUNT = 34;
  var AXIS = [8, 18];
  var DRAW_MANY = 200;
  var STUDIES_BEFORE_EXPLAINING = 50;

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

  /* --- The population, built once ------------------------------------- */

  var POPULATION = (function () {
    var random = mulberry32(POPULATION_SEED);
    var people = [];
    var i = 0;
    while (i < POPULATION_N) {
      var year = 1 + (i % 3);
      var commuter = random() < 0.35;
      var job = random() < 0.40;
      var hours = 12.6 + (year === 2 ? 0.6 : year === 3 ? 1.4 : 0) -
        (commuter ? 2.2 : 0) - (job ? 3.0 : 0) + normal(random) * 4;
      people.push({ year: year, commuter: commuter, job: job, hours: Math.max(0, hours) });
      i += 1;
    }
    return people;
  })();

  var TRUE_MEAN = POPULATION.reduce(function (a, p) { return a + p.hours; }, 0) / POPULATION.length;

  var METHODS = {
    convenience: {
      name: "Convenience",
      strata: null,
      note: "Whoever is in the library on a Tuesday afternoon.",
      weight: function (p) {
        return (p.commuter ? 0.3 : 1) * (p.job ? 0.4 : 1) *
          Math.exp(0.10 * (p.hours - TRUE_MEAN));
      },
      why: "Three problems at once. Commuters and students with jobs are much less likely to be in the building, and the chance of being there rises with how much a person studies, which is selection on the outcome itself. Nothing about this improves as the sample grows."
    },
    quota: {
      name: "Quota on year of study",
      strata: "year",
      note: "Equal numbers from each year, filled by convenience.",
      weight: function (p) {
        return (p.commuter ? 0.3 : 1) * (p.job ? 0.4 : 1) *
          Math.exp(0.10 * (p.hours - TRUE_MEAN));
      },
      why: "The year composition comes out exactly right, which looks reassuring in a table. Within each year the recruitment is still convenience, so commuting, part-time work and study hours are as badly selected as before. A quota corrects the variable you set a quota on and nothing else."
    },
    random: {
      name: "Simple random sample",
      strata: null,
      note: "Names drawn at random from the full student register.",
      weight: function () { return 1; },
      why: "Unbiased. The estimates centre on the population mean, and the only thing a larger sample changes is how tightly they cluster around it."
    }
  };

  /* --- Drawing one study ----------------------------------------------- */

  function drawSample(method, n, random) {
    if (!method.strata) {
      return race(POPULATION, n, method.weight, random);
    }
    /* Equal numbers per year, each filled by the method's own weights. */
    var years = [1, 2, 3];
    var per = Math.floor(n / years.length);
    var out = [];
    years.forEach(function (year, index) {
      var pool = POPULATION.filter(function (p) { return p.year === year; });
      var want = index === years.length - 1 ? n - per * (years.length - 1) : per;
      out = out.concat(race(pool, want, method.weight, random));
    });
    return out;
  }

  /** Exponential race: key = -log(U)/w, take the n smallest. */
  function race(pool, n, weight, random) {
    var keyed = pool.map(function (p) {
      var w = weight(p);
      return { p: p, key: -Math.log(Math.max(random(), 1e-12)) / (w > 0 ? w : 1e-9) };
    });
    keyed.sort(function (a, b) { return a.key - b.key; });
    return keyed.slice(0, Math.min(n, keyed.length)).map(function (k) { return k.p; });
  }

  /* --- Elements -------------------------------------------------------- */

  var methodSelect = document.getElementById("method");
  var methodNote = document.getElementById("method-note");
  var sizeInput = document.getElementById("size");
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var drawOne = document.getElementById("draw-one");
  var drawMany = document.getElementById("draw-many");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var estimates = [];

  function method() { return METHODS[methodSelect.value]; }
  function size() { return Math.max(20, Math.round(Number(sizeInput.value) || 20)); }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }

  function run(count) {
    var m = method();
    var n = size();
    var drawn = 0;
    while (drawn < count) {
      var random = mulberry32(seed() + estimates.length * 7919);
      var sample = drawSample(m, n, random);
      estimates.push(sample.reduce(function (a, p) { return a + p.hours; }, 0) / sample.length);
      drawn += 1;
    }
    if (estimates.length >= STUDIES_BEFORE_EXPLAINING) { explain.disabled = false; }
    render();
  }

  function invalidate(reason) {
    if (!estimates.length) { render(); return; }
    estimates = [];
    explain.disabled = true;
    render();
    wb.announce(reason + " Estimates from the old settings have been cleared.");
  }

  /* --- Rendering ------------------------------------------------------- */

  function stats() {
    if (!estimates.length) { return null; }
    var mean = estimates.reduce(function (a, b) { return a + b; }, 0) / estimates.length;
    if (estimates.length < 2) { return { mean: mean, sd: null }; }
    var v = estimates.reduce(function (acc, x) {
      return acc + (x - mean) * (x - mean);
    }, 0) / (estimates.length - 1);
    return { mean: mean, sd: Math.sqrt(v) };
  }

  function render() {
    /* Bands, not offsets. The study count and the population-mean label were
       both landing on the same line of the figure; each now owns a strip that
       nothing else is drawn in. */
    var LEFT = 60;
    var RIGHT = 850;
    var TITLE_Y = 22;        /* glyphs about 9 to 26   */
    var TRUTH_Y = 50;        /* glyphs about 37 to 54  */
    var TOP = 70;            /* the reference line starts at TOP - 8 = 62 */
    var HEIGHT = 150;
    var AXIS_Y = TOP + HEIGHT;
    var LABEL_Y = AXIS_Y + 22;
    var CAPTION_Y = AXIS_Y + 44;

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (AXIS_Y + 58));

    var X = function (v) {
      return LEFT + ((Math.max(AXIS[0], Math.min(AXIS[1], v)) - AXIS[0]) / (AXIS[1] - AXIS[0])) *
        (RIGHT - LEFT);
    };

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = estimates.length
      ? "One mark per study, " + estimates.length + " so far"
      : "One mark per study, none run yet";
    chart.appendChild(title);

    if (estimates.length) {
      var counts = new Array(BIN_COUNT);
      var b = 0;
      while (b < BIN_COUNT) { counts[b] = 0; b += 1; }
      var width = (AXIS[1] - AXIS[0]) / BIN_COUNT;
      estimates.forEach(function (value) {
        var index = Math.floor((value - AXIS[0]) / width);
        if (index < 0) { index = 0; }
        if (index >= BIN_COUNT) { index = BIN_COUNT - 1; }
        counts[index] += 1;
      });
      var tallest = Math.max.apply(null, counts) || 1;
      counts.forEach(function (count, index) {
        if (!count) { return; }
        var x0 = X(AXIS[0] + index * width);
        var x1 = X(AXIS[0] + (index + 1) * width);
        var h = (count / tallest) * HEIGHT;
        chart.appendChild(svg("rect", {
          x: x0.toFixed(1), y: (AXIS_Y - h).toFixed(1),
          width: Math.max(1, x1 - x0 - 1).toFixed(1), height: h.toFixed(1),
          class: "plot__hist"
        }));
      });
    }

    chart.appendChild(svg("line", {
      x1: X(TRUE_MEAN), y1: TOP - 8, x2: X(TRUE_MEAN), y2: AXIS_Y, class: "plot__zero"
    }));
    var truth = svg("text", {
      x: X(TRUE_MEAN), y: TRUTH_Y, "text-anchor": "middle", class: "plot__tick"
    });
    truth.textContent = "Population mean " + TRUE_MEAN.toFixed(2);
    chart.appendChild(truth);

    chart.appendChild(svg("line", { x1: LEFT, y1: AXIS_Y, x2: RIGHT, y2: AXIS_Y, class: "plot__axis" }));
    [8, 10, 12, 14, 16, 18].forEach(function (tick) {
      var mark = svg("text", { x: X(tick), y: LABEL_Y, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = String(tick);
      chart.appendChild(mark);
    });
    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Estimated mean weekly study hours";
    chart.appendChild(caption);

    renderReadout();
    describe();
  }

  function renderReadout() {
    var s = stats();
    readout.textContent = "";
    tile("Studies run", String(estimates.length), estimates.length ? "Each one a fresh sample" : "None yet");
    tile("Average estimate", s ? s.mean.toFixed(2) + " hours" : "not yet",
      s ? (Math.abs(s.mean - TRUE_MEAN) < 0.1
            ? "On the population mean"
            : (s.mean - TRUE_MEAN).toFixed(2) + " hours from the truth")
        : "Run some studies");
    tile("Spread of estimates", s && s.sd !== null ? s.sd.toFixed(2) : "not yet",
      "Standard deviation across studies");
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
    var s = stats();
    chartDesc.textContent =
      "A histogram of estimated mean study hours, one mark per study, on an " +
      "axis from 8 to 18 hours. The population mean of " + TRUE_MEAN.toFixed(2) +
      " is marked with a line. " +
      (s
        ? estimates.length + " studies recruited by " + method().name.toLowerCase() +
          " with " + size() + " students each. The estimates average " +
          s.mean.toFixed(2) + ", which is " +
          (s.mean - TRUE_MEAN).toFixed(2) + " from the population mean" +
          (s.sd !== null ? ", and their standard deviation is " + s.sd.toFixed(2) : "") + "."
        : "No studies have been run yet.");
  }

  /* --- Controls -------------------------------------------------------- */

  wb.bindRange("#size", { format: function (v) { return v; } });
  methodSelect.addEventListener("change", function () {
    methodNote.textContent = method().note;
    invalidate("Recruitment method changed.");
  });
  sizeInput.addEventListener("change", function () { invalidate("Sample size changed."); });
  seedInput.addEventListener("change", function () { invalidate("Seed changed."); });

  drawOne.addEventListener("click", function () {
    run(1);
    wb.announce("Study " + estimates.length + " run. " + line());
  });
  drawMany.addEventListener("click", function () {
    run(DRAW_MANY);
    wb.announce(DRAW_MANY + " more studies run. " + line());
  });

  function line() {
    var s = stats();
    if (!s) { return ""; }
    return "Estimates average " + s.mean.toFixed(2) + " against a population mean of " +
      TRUE_MEAN.toFixed(2) + ".";
  }

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    estimates = [];
    methodSelect.value = "convenience";
    sizeInput.value = "120";
    seedInput.value = "3181";
    explain.disabled = true;
    methodNote.textContent = method().note;
    wb.hide("#synthesis");
    render();
  });

  methodNote.textContent = method().note;
  render();
})();
