/* =========================================================================
   What Gets Published From a Small Study — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/17-statistical-power-type-m-lab/

   TEACHING JOB
   ------------
   Filtering on significance exaggerates effects, and at low power it can get
   the sign wrong, without any individual study being biased or dishonest.

   WHAT IS PRESERVED
   -----------------
   The original's second experiment, which is the one that cannot be replaced
   by a diagram: STUDY_COUNT complete simulated studies of a real effect, each
   drawing its own sample and running a correct pooled t-test, with every
   estimate kept and the significant subset marked.

   For each simulated team:
       two samples of n drawn from Normal(0, 1) and Normal(trueD, 1)
       pooled sd, observed d = (mean2 - mean1) / pooled sd
       t on 2n - 2 df, two-tailed p from Stats.tTwoTailedP
       significant if p < ALPHA

   Then, across studies:
       power             = share significant
       exaggeration      = mean(|observed d| among significant) / trueD
       type S            = share of significant studies with the wrong sign

   WHY A REAL SIMULATION RATHER THAN THE NONCENTRAL t
   --------------------------------------------------
   The closed form would be faster and would give the same numbers, but the
   whole argument is that nothing dishonest happens in any single study. That
   is only convincing if every study is actually run. The histogram of ALL
   estimates centring on the truth, with the published subset sitting to the
   right of it, is the demonstration.

   The exaggeration ratio uses the mean of the ABSOLUTE observed d among
   significant studies, which is the quantity Gelman and Carlin define. At low
   power a handful of significant studies point the wrong way; averaging the
   signed values would let those cancel against the correct ones and would
   understate how badly the literature is distorted.

   WHAT WAS REDUCED
   ----------------
   Alpha, beta and power as three moving areas on two sampling distributions,
   the sample-size calculator for a target power, and the worked treatment of
   observed power. The last is kept as a paragraph in the caution because it
   is a genuine error this activity could otherwise encourage.

   Randomness is seeded so a figure can be reproduced. Nothing is stored and
   nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var STUDY_COUNT = 2000;
  var ALPHA = 0.05;
  var BINS = 44;
  var CHANGES_BEFORE_EXPLAINING = 3;

  var trueInput = document.getElementById("trued");
  var nInput = document.getElementById("n");
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var fix = document.getElementById("fix");
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
  var bigger = false;
  var run = null;

  function trueD() { return Number(trueInput.value); }
  function n() { return Math.max(3, Math.round(Number(nInput.value))); }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }

  /* --- Run the studies -------------------------------------------------- */

  function simulate() {
    var random = S.mulberry32(seed());
    var delta = trueD();
    var size = n();
    var df = 2 * size - 2;
    var estimates = [];
    var significant = [];
    var wrongSign = 0;
    var study = 0;

    while (study < STUDY_COUNT) {
      var a = [], b = [];
      var i = 0;
      while (i < size) {
        a.push(S.normalDraw(random));
        b.push(delta + S.normalDraw(random));
        i += 1;
      }
      var ma = S.mean(a), mb = S.mean(b);
      var va = S.variance(a), vb = S.variance(b);
      var pooled = Math.sqrt((va + vb) / 2);
      var observed = pooled > 0 ? (mb - ma) / pooled : 0;
      var se = pooled * Math.sqrt(2 / size);
      var t = se > 0 ? (mb - ma) / se : 0;
      var p = S.tTwoTailedP(t, df);

      estimates.push(observed);
      if (p < ALPHA) {
        significant.push(observed);
        if (observed < 0) { wrongSign += 1; }
      }
      study += 1;
    }

    var meanAll = S.mean(estimates);
    var meanSigAbs = significant.length
      ? S.mean(significant.map(Math.abs)) : 0;

    run = {
      trueD: delta, n: size, df: df,
      estimates: estimates,
      significant: significant,
      power: significant.length / STUDY_COUNT,
      meanAll: meanAll,
      meanSigAbs: meanSigAbs,
      exaggeration: delta > 0 && significant.length ? meanSigAbs / delta : 0,
      typeS: significant.length ? wrongSign / significant.length : 0,
      wrongSign: wrongSign
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var LEFT = 74;
    var RIGHT = 856;
    var TITLE_Y = 22;
    var TOP = 74;
    var BASE = 296;
    var TICK_Y = BASE + 22;
    var CAP_Y = BASE + 44;

    var lo = Math.min.apply(null, run.estimates);
    var hi = Math.max.apply(null, run.estimates);
    lo = Math.floor(lo * 4) / 4;
    hi = Math.ceil(hi * 4) / 4;
    var width = (hi - lo) / BINS;

    var all = new Array(BINS), sig = new Array(BINS);
    var k = 0;
    while (k < BINS) { all[k] = 0; sig[k] = 0; k += 1; }
    function binOf(v) {
      return Math.max(0, Math.min(BINS - 1, Math.floor((v - lo) / width)));
    }
    run.estimates.forEach(function (v) { all[binOf(v)] += 1; });
    run.significant.forEach(function (v) { sig[binOf(v)] += 1; });
    var tallest = Math.max.apply(null, all) || 1;

    var X = function (v) { return LEFT + ((v - lo) / (hi - lo)) * (RIGHT - LEFT); };
    var H = function (count) { return (count / tallest) * (BASE - TOP); };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (CAP_Y + 18));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "The effect each of " + STUDY_COUNT +
      " honest studies estimated, at " + run.n + " people per group";
    chart.appendChild(title);

    var barW = (RIGHT - LEFT) / BINS;
    k = 0;
    while (k < BINS) {
      var x = LEFT + k * barW;
      if (all[k] > 0) {
        /* The whole bar, outlined only: every study that landed here. */
        chart.appendChild(svg("rect", {
          x: (x + 0.6).toFixed(1), y: (BASE - H(all[k])).toFixed(1),
          width: (barW - 1.2).toFixed(1), height: H(all[k]).toFixed(1),
          fill: "none", stroke: "#5F6878", "stroke-width": "1"
        }));
      }
      if (sig[k] > 0) {
        /* The published part, solid: fill against outline carries the
           distinction, so it survives without colour. */
        chart.appendChild(svg("rect", {
          x: (x + 0.6).toFixed(1), y: (BASE - H(sig[k])).toFixed(1),
          width: (barW - 1.2).toFixed(1), height: H(sig[k]).toFixed(1),
          fill: "#1C7293", "fill-opacity": "0.75", stroke: "none"
        }));
      }
      k += 1;
    }

    /* The truth, dashed. */
    chart.appendChild(svg("line", {
      x1: X(run.trueD).toFixed(1), y1: TOP - 30, x2: X(run.trueD).toFixed(1), y2: BASE,
      stroke: "#1A2744", "stroke-width": "2", "stroke-dasharray": "6 5"
    }));
    var tTag = svg("text", {
      x: X(run.trueD).toFixed(1), y: TOP - 36, "text-anchor": "middle",
      class: "plot__sub plot__over"
    });
    tTag.textContent = "the truth: d = " + run.trueD.toFixed(2);
    chart.appendChild(tTag);

    /* What the significant studies say, solid. */
    if (run.significant.length) {
      chart.appendChild(svg("line", {
        x1: X(run.meanSigAbs).toFixed(1), y1: TOP - 12, x2: X(run.meanSigAbs).toFixed(1), y2: BASE,
        stroke: "#C0434F", "stroke-width": "2.6"
      }));
      var sTag = svg("text", {
        x: X(run.meanSigAbs).toFixed(1), y: TOP - 18, "text-anchor": "middle",
        class: "plot__sub plot__over", fill: "#C0434F"
      });
      sTag.textContent = "what gets published: " + run.meanSigAbs.toFixed(2);
      chart.appendChild(sTag);
    }

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    var step = (hi - lo) / 6;
    var j = 0;
    while (j <= 6) {
      var v = lo + j * step;
      var tick = svg("text", { x: X(v).toFixed(1), y: TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = v.toFixed(2);
      chart.appendChild(tick);
      j += 1;
    }
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "The effect the study estimated (observed Cohen's d)";
    chart.appendChild(cap);

    renderReadout();
    renderSentence();
    describe();
  }

  function pcOf(x) { return (100 * x).toFixed(1) + "%"; }

  /* "1 significant studies" is the kind of thing that makes a page look
     generated rather than written. */
  function studies(count) {
    return count + (count === 1 ? " significant study" : " significant studies");
  }

  function renderReadout() {
    readout.textContent = "";
    tile("Power", pcOf(run.power),
      run.power < 0.5 ? "most teams miss a real effect" : "the share that reach significance");
    tile("Average of all studies", run.meanAll.toFixed(2),
      "unbiased: it lands on the truth");
    tile("Average when significant", run.meanSigAbs.toFixed(2),
      "the ones that get written up");
    tile("Exaggeration ratio", run.exaggeration.toFixed(2) + "x",
      run.typeS > 0
        ? "and " + pcOf(run.typeS) + " point the wrong way"
        : "no significant study points the wrong way");
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

  function renderSentence() {
    var base = "Of " + STUDY_COUNT + " studies of a real effect of " +
      run.trueD.toFixed(2) + " with " + run.n + " people per group, " +
      run.significant.length + " reached significance. Averaged over all two " +
      "thousand, the estimate is " + run.meanAll.toFixed(2) +
      ", which is the truth: no single study is biased. Averaged over only the " +
      "significant ones it is " + run.meanSigAbs.toFixed(2) + ", which is " +
      run.exaggeration.toFixed(2) + " times too big. ";
    sentence.textContent = base + (run.wrongSign > 0
      ? "And " + run.wrongSign + " of those " +
        (run.wrongSign === 1 ? "reports" : "report") + " an effect in the " +
        "opposite direction to the truth, with a p-value below 0.05 to " +
        "support it."
      : "At this power, none of the significant studies points the wrong way.");
  }

  function describe() {
    chartDesc.textContent =
      "A histogram of the effect estimated by each of " + STUDY_COUNT +
      " simulated studies, ranging from " +
      Math.min.apply(null, run.estimates).toFixed(2) + " to " +
      Math.max.apply(null, run.estimates).toFixed(2) +
      ". The outlined bars are all studies and the solid portion within each " +
      "is those that reached significance. The whole distribution is centred " +
      "on " + run.meanAll.toFixed(2) + ", which is the true effect of " +
      run.trueD.toFixed(2) + ", but the significant studies alone average " +
      run.meanSigAbs.toFixed(2) + ", an exaggeration of " +
      run.exaggeration.toFixed(2) + " times. Power is " + pcOf(run.power) +
      " and " + (run.wrongSign > 0
        ? studies(run.wrongSign) + (run.wrongSign === 1 ? " points" : " point") +
          " the wrong way."
        : "no significant study points the wrong way.");
  }

  /* --- Controls -------------------------------------------------------- */

  var ranges = [
    wb.bindRange("#trued", { format: function (v) { return Number(v).toFixed(2); } }),
    wb.bindRange("#n", { format: function (v) { return v; } })
  ];
  function syncRanges() { ranges.forEach(function (r) { if (r) { r.sync(); } }); }

  function refresh(announce) {
    simulate();
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      wb.announce("Power is " + pcOf(run.power) + ". The significant studies " +
        "average " + run.meanSigAbs.toFixed(2) + " against a truth of " +
        run.trueD.toFixed(2) + ", an exaggeration of " +
        run.exaggeration.toFixed(2) + " times.");
    }
  }

  /* Only on change, not on input: two thousand studies is real work and
     dragging a slider would re-run it on every pixel. */
  [trueInput, nInput, seedInput].forEach(function (input) {
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  fix.addEventListener("click", function () {
    var before = run;
    bigger = !bigger;
    nInput.value = bigger ? "120" : "20";
    syncRanges();
    changes += 1;
    refresh(false);
    taskText.textContent =
      "Same effect, same teams, same analysis. People per group went from " +
      before.n + " to " + run.n + ", so power went from " + pcOf(before.power) +
      " to " + pcOf(run.power) + " and the exaggeration ratio fell from " +
      before.exaggeration.toFixed(2) + " times to " + run.exaggeration.toFixed(2) +
      " times. Nobody became more honest. The published estimate got closer to " +
      "the truth because a study this size no longer needs a fluke to clear " +
      "the threshold. Press again to go back.";
    wb.show("#task");
    wb.announce("Now " + run.n + " people per group. Power " + pcOf(run.power) +
      ", exaggeration " + run.exaggeration.toFixed(2) + " times.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    bigger = false;
    trueInput.value = "0.4";
    nInput.value = "20";
    seedInput.value = "8317";
    syncRanges();
    explain.disabled = true;
    wb.hide("#task");
    wb.hide("#synthesis");
    refresh(false);
  });

  refresh(false);
})();
