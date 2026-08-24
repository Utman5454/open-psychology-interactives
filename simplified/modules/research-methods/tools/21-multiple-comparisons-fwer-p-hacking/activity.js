/* =========================================================================
   The Garden of Forking Paths — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/

   ONE TEACHING JOB
   ----------------
   A p-value from an analysis you arrived at by choosing does not mean what a
   p-value from an analysis you specified in advance means. That is the whole
   activity.

   The original carries four more: the family-wise error rate under k
   independent tests, the cost of a Bonferroni correction, a vignette
   classification task and a transfer exercise. Each is a real teaching job
   and each needs its own apparatus. They stay in the longer version.

   WHAT IS PRESERVED
   -----------------
   The mechanism, unchanged: one fictional dataset of 90 students generated
   with NO group difference on anything, and four defensible analysis choices
   over it, giving 4 x 3 x 3 x 2 = 72 complete, reportable analyses of the
   same empty data. The learner walks a path, gets a real p-value, and can
   walk another. Then every path not taken is revealed at once.

   Each path is a genuine computation: rows are filtered by the exclusion rule
   and the subgroup, the outcome is optionally residualised on the baseline
   score, and a pooled two-sample t-test is run with a proper t distribution.
   Nothing is drawn from a uniform.

   Because the paths share participants and outcomes they are heavily
   correlated, which is exactly the situation a real analyst is in and is why
   no simple correction applies to them.

   NOT A TECHNIQUE
   ---------------
   Every choice offered is one a careful researcher might make in good faith,
   and the page says so. The demonstration is about what searching does to the
   meaning of the number at the end, not about how to get one.

   Randomness is seeded (mulberry32 with Box-Muller normals), so every learner
   sees the same dataset and a lecturer can quote the same figures. No data
   leave the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var STUDENTS = 90;
  /* Chosen by sweeping seeds: this dataset puts 7 of the 72 paths below
     0.05, with a smallest p of 0.008. Enough to be publishable-looking,
     not so many that the demonstration looks rigged. */
  var GARDEN_SEED = 20260924;
  var ALPHA = 0.05;
  var RUNS_BEFORE_REVEAL = 3;

  var OUTCOMES = [
    "Overall revision score",
    "Recall accuracy",
    "Comprehension score",
    "Self-rated confidence"
  ];
  var EXCLUSIONS = [
    "No exclusions",
    "Slowest 10% excluded",
    "Fastest and slowest 5% excluded"
  ];
  var SUBGROUPS = [
    "Everyone",
    "First-year students only",
    "Continuing students only"
  ];
  var ADJUSTMENTS = ["Unadjusted", "Adjusted for baseline score"];

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

  function normal(random) {
    var u = Math.max(random(), 1e-12);
    var v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* --- The t distribution ---------------------------------------------- */

  function logGamma(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x;
    var tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    var ser = 1.000000000190015;
    var j = 0;
    while (j < 6) {
      y += 1;
      ser += c[j] / y;
      j += 1;
    }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function betacf(a, b, x) {
    var MAXIT = 300;
    var EPS = 3e-14;
    var FPMIN = 1e-300;
    var qab = a + b;
    var qap = a + 1;
    var qam = a - 1;
    var c = 1;
    var d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) { d = FPMIN; }
    d = 1 / d;
    var h = d;
    var m = 1;
    while (m <= MAXIT) {
      var m2 = 2 * m;
      var aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d;
      h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) { break; }
      m += 1;
    }
    return h;
  }

  function betai(a, b, x) {
    if (x <= 0) { return 0; }
    if (x >= 1) { return 1; }
    var bt = Math.exp(
      logGamma(a + b) - logGamma(a) - logGamma(b) +
      a * Math.log(x) + b * Math.log(1 - x)
    );
    return x < (a + 1) / (a + b + 2)
      ? (bt * betacf(a, b, x)) / a
      : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }

  /** Two-tailed p for Student's t. */
  function tTailProbability(t, df) {
    if (!isFinite(t) || df <= 0) { return 1; }
    return betai(df / 2, 0.5, df / (df + t * t));
  }

  /* --- The dataset: 90 students, no group difference on anything ------- */

  function buildDataset() {
    var random = mulberry32(GARDEN_SEED);
    var rows = [];
    var i = 0;

    while (i < STUDENTS) {
      /* One latent tendency drives every outcome, so the four outcomes are
         correlated with each other and with the baseline, exactly as real
         measures on the same people are. */
      var latent = normal(random);
      var baseline = 50 + 0.55 * latent * 10 + normal(random) * 8;
      var outcomes = OUTCOMES.map(function () {
        return 60 + 0.6 * latent * 12 + normal(random) * 9;
      });

      rows.push({
        /* Group is assigned independently of everything above, so there is
           no difference to find on any outcome, in any subgroup, under any
           exclusion rule, with or without adjustment. */
        group: random() < 0.5 ? 1 : 0,
        firstYear: random() < 0.5,
        speed: normal(random),
        baseline: baseline,
        outcomes: outcomes
      });
      i += 1;
    }

    return rows;
  }

  var DATA = buildDataset();

  /* --- One path ---------------------------------------------------------
     Filter, optionally residualise on baseline, then a pooled two-sample
     t-test. Every path here is a real analysis of the same real rows. */

  function analyse(path) {
    var rows = DATA.slice();

    if (path.subgroup === 1) {
      rows = rows.filter(function (r) { return r.firstYear; });
    } else if (path.subgroup === 2) {
      rows = rows.filter(function (r) { return !r.firstYear; });
    }

    if (path.exclusion > 0) {
      var speeds = rows.map(function (r) { return r.speed; }).sort(function (a, b) {
        return a - b;
      });
      if (path.exclusion === 1) {
        var cut = speeds[Math.floor(speeds.length * 0.10)];
        rows = rows.filter(function (r) { return r.speed > cut; });
      } else {
        var low = speeds[Math.floor(speeds.length * 0.05)];
        var high = speeds[Math.ceil(speeds.length * 0.95) - 1];
        rows = rows.filter(function (r) { return r.speed > low && r.speed < high; });
      }
    }

    var values = rows.map(function (r) { return r.outcomes[path.outcome]; });

    if (path.adjusted === 1) {
      /* Residualise the outcome on the baseline score: the ordinary
         "we controlled for baseline" analysis. */
      var xs = rows.map(function (r) { return r.baseline; });
      var mx = mean(xs);
      var my = mean(values);
      var sxy = 0;
      var sxx = 0;
      xs.forEach(function (x, index) {
        sxy += (x - mx) * (values[index] - my);
        sxx += (x - mx) * (x - mx);
      });
      var slope = sxx ? sxy / sxx : 0;
      values = values.map(function (y, index) {
        return y - slope * (xs[index] - mx);
      });
    }

    var a = [];
    var b = [];
    rows.forEach(function (r, index) {
      (r.group === 1 ? a : b).push(values[index]);
    });

    if (a.length < 3 || b.length < 3) {
      return null;
    }

    var na = a.length;
    var nb = b.length;
    var va = variance(a);
    var vb = variance(b);
    var df = na + nb - 2;
    var pooled = ((na - 1) * va + (nb - 1) * vb) / df;
    var se = Math.sqrt(pooled * (1 / na + 1 / nb));
    var diff = mean(a) - mean(b);
    var t = se ? diff / se : 0;

    return {
      n: rows.length,
      diff: diff,
      t: t,
      df: df,
      p: tTailProbability(t, df)
    };
  }

  function mean(values) {
    return values.reduce(function (x, y) { return x + y; }, 0) / values.length;
  }

  function variance(values) {
    var m = mean(values);
    return values.reduce(function (acc, v) {
      return acc + (v - m) * (v - m);
    }, 0) / (values.length - 1);
  }

  function allPaths() {
    var out = [];
    OUTCOMES.forEach(function (_, o) {
      EXCLUSIONS.forEach(function (__, e) {
        SUBGROUPS.forEach(function (___, s) {
          ADJUSTMENTS.forEach(function (____, a) {
            var path = { outcome: o, exclusion: e, subgroup: s, adjusted: a };
            var result = analyse(path);
            if (result) {
              out.push({ path: path, result: result });
            }
          });
        });
      });
    });
    return out;
  }

  function pathKey(path) {
    return [path.outcome, path.exclusion, path.subgroup, path.adjusted].join("-");
  }

  /* --- Elements -------------------------------------------------------- */

  var outcomeSelect = document.getElementById("outcome");
  var exclusionSelect = document.getElementById("exclusion");
  var subgroupSelect = document.getElementById("subgroup");
  var adjustedSelect = document.getElementById("adjusted");
  var runButton = document.getElementById("run");
  var revealButton = document.getElementById("reveal-paths");
  var resultTag = document.getElementById("result");
  var trail = document.getElementById("trail");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  var walked = [];

  function currentPath() {
    return {
      outcome: Number(outcomeSelect.value),
      exclusion: Number(exclusionSelect.value),
      subgroup: Number(subgroupSelect.value),
      adjusted: Number(adjustedSelect.value)
    };
  }

  function describePath(path) {
    return OUTCOMES[path.outcome] + ", " + SUBGROUPS[path.subgroup].toLowerCase() +
      ", " + EXCLUSIONS[path.exclusion].toLowerCase() + ", " +
      ADJUSTMENTS[path.adjusted].toLowerCase();
  }

  function fmtP(p) {
    return p < 0.001 ? "p < 0.001" : "p = " + p.toFixed(3);
  }

  /* --- Walking a path -------------------------------------------------- */

  runButton.addEventListener("click", function () {
    var path = currentPath();
    var result = analyse(path);

    if (!result) {
      resultTag.textContent = "That combination leaves too few students to test.";
      return;
    }

    var key = pathKey(path);
    if (walked.map(pathKey).indexOf(key) === -1) {
      walked.push(path);
    }

    resultTag.textContent =
      fmtP(result.p) + (result.p < ALPHA ? ", significant at 0.05" : ", not significant") +
      "  ·  n = " + result.n + "  ·  difference " + result.diff.toFixed(2) + " points";

    var item = document.createElement("li");
    item.textContent = describePath(path) + ": " + fmtP(result.p) +
      (result.p < ALPHA ? ", significant" : "");
    trail.appendChild(item);

    if (walked.length >= RUNS_BEFORE_REVEAL) {
      revealButton.disabled = false;
    }

    wb.announce(
      "Analysis run. " + fmtP(result.p) +
      (result.p < ALPHA ? ", significant at 0.05." : ", not significant.") +
      " " + walked.length + (walked.length === 1 ? " path" : " paths") + " walked so far."
    );
  });

  /* --- Every path not taken -------------------------------------------- */

  revealButton.addEventListener("click", function () {
    var paths = allPaths();
    var hits = paths.filter(function (entry) {
      return entry.result.p < ALPHA;
    });

    renderChart(paths, hits);

    resultLead.textContent =
      "There is no difference between the two groups in this dataset. Not on " +
      "any of the four outcomes, not in either subgroup, under any exclusion " +
      "rule, with or without adjustment for baseline. It was generated that " +
      "way. Of the " + paths.length + " complete analyses available, " +
      hits.length + " reach p below 0.05, and you walked " + walked.length +
      " of them.";

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce(
      hits.length + " of " + paths.length +
      " paths reach significance on data with no difference in them."
    );
  });

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      node.setAttribute(k, attrs[k]);
    });
    return node;
  }

  function renderChart(paths, hits) {
    var LEFT = 60;
    var RIGHT = 850;
    var TOP = 54;
    var HEIGHT = 190;
    var AXIS = TOP + HEIGHT;

    while (chart.childNodes.length > 2) {
      chart.removeChild(chart.lastChild);
    }
    chart.setAttribute("viewBox", "0 0 900 " + (AXIS + 66));

    var X = function (p) {
      return LEFT + p * (RIGHT - LEFT);
    };

    /* The region a searched analysis can be steered into. */
    chart.appendChild(svg("rect", {
      x: LEFT, y: TOP, width: X(ALPHA) - LEFT, height: HEIGHT,
      fill: "#F9ECEE", stroke: "#C0434F", "stroke-width": 1,
      "stroke-dasharray": "4 3"
    }));

    var threshold = svg("text", {
      x: X(ALPHA) + 8, y: TOP + 16, class: "plot__tick"
    });
    threshold.textContent = "p = 0.05";
    chart.appendChild(threshold);

    var walkedKeys = walked.map(pathKey);

    paths.forEach(function (entry, index) {
      var mine = walkedKeys.indexOf(pathKey(entry.path)) !== -1;
      var y = TOP + 14 + ((index * 37) % (HEIGHT - 28));
      chart.appendChild(svg("circle", {
        cx: X(entry.result.p).toFixed(1), cy: y.toFixed(1),
        r: mine ? 7 : 4.5,
        fill: mine ? "#1A2744" : (entry.result.p < ALPHA ? "#C0434F" : "#FFFFFF"),
        stroke: mine ? "#1A2744" : (entry.result.p < ALPHA ? "#C0434F" : "#8CA0AD"),
        "stroke-width": mine ? 2 : 1.5
      }));
    });

    chart.appendChild(svg("line", {
      x1: LEFT, y1: AXIS, x2: RIGHT, y2: AXIS, class: "plot__axis"
    }));

    [0, 0.25, 0.5, 0.75, 1].forEach(function (tick) {
      var mark = svg("text", {
        x: X(tick), y: AXIS + 20, "text-anchor": "middle", class: "plot__tick"
      });
      mark.textContent = tick.toFixed(2);
      chart.appendChild(mark);
    });

    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: AXIS + 44, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "p-value of each complete analysis of the same data";
    chart.appendChild(caption);

    var headingLeft = svg("text", { x: LEFT, y: 32, class: "col-head" });
    headingLeft.textContent = hits.length + " OF " + paths.length + " PATHS REACH p < 0.05";
    chart.appendChild(headingLeft);

    var key = svg("text", { x: RIGHT, y: 32, "text-anchor": "end", class: "plot__tick" });
    key.textContent = "Filled dark: the " + walked.length + " you walked";
    chart.appendChild(key);

    chartDesc.textContent =
      "One dot per complete analysis, positioned by its p-value on an axis " +
      "from zero to one. " + hits.length + " of the " + paths.length +
      " analyses fall below 0.05, inside the shaded region at the left. The " +
      walked.length + " analyses walked by hand are drawn larger and filled " +
      "dark. Every dot is a real test of the same data, which contain no " +
      "difference between the groups.";
  }

  /* --- Reset ----------------------------------------------------------- */

  wb.onReset(function () {
    walked = [];
    trail.textContent = "";
    resultTag.textContent = "No analysis run yet.";
    revealButton.disabled = true;
    outcomeSelect.value = "0";
    exclusionSelect.value = "0";
    subgroupSelect.value = "0";
    adjustedSelect.value = "0";
    wb.hide("#synthesis");
  });
})();
