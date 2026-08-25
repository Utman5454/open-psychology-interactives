/* =========================================================================
   ANOVA F-Ratio Visualiser — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/10-anova-f-ratio-visualiser/

   TEACHING JOB
   ------------
   F is one variance estimate divided by another, and three separate things
   move it, only one of which is the effect.

   WHAT IS PRESERVED
   -----------------
   The live simulation. Three groups of n are drawn from normal populations
   with means (52 - s, 52, 52 + s) and a common within-group standard
   deviation, and a one-way ANOVA is computed on the SIMULATED SAMPLE rather
   than on the population values, so the numbers move when the sample is
   redrawn.

       SS_between = sum over groups of n_j * (mean_j - grand mean)^2
       SS_within  = sum over all cases of (x - mean of its group)^2
       df_between = k - 1 = 2          df_within = N - k
       F          = (SS_between / df_between) / (SS_within / df_within)
       p          = P(F(df1, df2) >= observed F)

   All three controls are kept because each moves F for a different reason and
   removing any would remove one leg of the argument. The share of variance is
   printed beside F because it is the quantity that does not grow with n.

   WHAT WAS REDUCED
   ----------------
   The second experiment on what F cannot carry, the worked-example presets,
   the browse-then-commit identification task and the select-all challenge.

   Randomness is seeded so a figure can be reproduced. Nothing is stored and
   nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var GROUPS = ["A", "B", "C"];
  var BASE = 52;
  var DRAWS_BEFORE_EXPLAINING = 3;

  var sepInput = document.getElementById("sep");
  var withinInput = document.getElementById("within");
  var nInput = document.getElementById("n");
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var redraw = document.getElementById("redraw");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var draws = 0;
  var sample = null;

  function sep() { return Number(sepInput.value); }
  function within() { return Math.max(1, Number(withinInput.value)); }
  function n() { return Math.max(5, Math.round(Number(nInput.value))); }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }

  /* --- Generate and analyse -------------------------------------------- */

  function build() {
    var random = S.mulberry32(seed() + draws * 7919);
    var s = sep();
    var sd = within();
    var size = n();
    var means = [BASE - s, BASE, BASE + s];
    var groups = means.map(function (mu) {
      var values = [];
      var i = 0;
      while (i < size) { values.push(mu + S.normalDraw(random) * sd); i += 1; }
      return values;
    });
    sample = analyse(groups);
  }

  function analyse(groups) {
    var all = groups.reduce(function (a, g) { return a.concat(g); }, []);
    var grand = S.mean(all);
    var groupMeans = groups.map(S.mean);

    var ssBetween = 0;
    groups.forEach(function (g, i) {
      ssBetween += g.length * (groupMeans[i] - grand) * (groupMeans[i] - grand);
    });
    var ssWithin = 0;
    groups.forEach(function (g, i) {
      g.forEach(function (x) { ssWithin += (x - groupMeans[i]) * (x - groupMeans[i]); });
    });

    var df1 = groups.length - 1;
    var df2 = all.length - groups.length;
    var msBetween = ssBetween / df1;
    var msWithin = ssWithin / df2;
    var f = msWithin > 0 ? msBetween / msWithin : 0;

    return {
      groups: groups, all: all, grand: grand, means: groupMeans,
      f: f, df1: df1, df2: df2,
      p: S.fTail(f, df1, df2),
      share: (ssBetween + ssWithin) > 0 ? ssBetween / (ssBetween + ssWithin) : 0
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var LEFT = 86;
    var RIGHT = 850;
    var TITLE_Y = 22;
    var TOP = 52;
    var ROW = 54;
    var REACH_Y = TOP + GROUPS.length * ROW + 4;
    var AXIS_Y = REACH_Y + 26;
    var LABEL_Y = AXIS_Y + 22;
    var CAPTION_Y = AXIS_Y + 44;

    var lo = BASE - 3 * Math.max(within(), 6) - sep();
    var hi = BASE + 3 * Math.max(within(), 6) + sep();
    var X = function (v) {
      return LEFT + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (RIGHT - LEFT);
    };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (AXIS_Y + 58));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "One mark per person, " + n() + " in each of three groups";
    chart.appendChild(title);

    sample.groups.forEach(function (values, index) {
      var y = TOP + index * ROW;

      var name = svg("text", {
        x: LEFT - 14, y: y + 20, "text-anchor": "end", class: "plot__label"
      });
      name.textContent = "Group " + GROUPS[index];
      chart.appendChild(name);

      values.forEach(function (v, i) {
        /* A little vertical jitter so a dense row stays readable. */
        var jitter = ((i * 37) % 21) - 10;
        chart.appendChild(svg("circle", {
          cx: X(v).toFixed(1), cy: (y + 14 + jitter * 0.6).toFixed(1), r: 2.6,
          fill: "#3D5A80", "fill-opacity": "0.5"
        }));
      });

      chart.appendChild(svg("line", {
        x1: X(sample.means[index]).toFixed(1), y1: y - 2,
        x2: X(sample.means[index]).toFixed(1), y2: y + 30, class: "plot__zero"
      }));
    });

    /* The reach between the three means: what the numerator sees. */
    var loMean = Math.min.apply(null, sample.means);
    var hiMean = Math.max.apply(null, sample.means);
    chart.appendChild(svg("line", {
      x1: X(loMean).toFixed(1), y1: REACH_Y, x2: X(hiMean).toFixed(1), y2: REACH_Y,
      class: "plot__interval"
    }));
    var reach = svg("text", {
      x: ((X(loMean) + X(hiMean)) / 2).toFixed(1), y: REACH_Y - 8,
      "text-anchor": "middle", class: "plot__sub"
    });
    reach.textContent = "reach between the means";
    chart.appendChild(reach);

    chart.appendChild(svg("line", { x1: LEFT, y1: AXIS_Y, x2: RIGHT, y2: AXIS_Y, class: "plot__axis" }));
    [lo, (lo + BASE) / 2, BASE, (BASE + hi) / 2, hi].forEach(function (tick) {
      var mark = svg("text", { x: X(tick), y: LABEL_Y, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = tick.toFixed(0);
      chart.appendChild(mark);
    });
    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Score";
    chart.appendChild(caption);

    renderReadout();
    describe();
  }

  function renderReadout() {
    readout.textContent = "";
    tile("F", sample.f.toFixed(2),
      sample.f < 1.5 ? "Around 1 is what identical populations give" : "Above what identical populations usually give");
    tile("p", sample.p < 0.001 ? "< 0.001" : sample.p.toFixed(3),
      "on " + sample.df1 + " and " + sample.df2 + " degrees of freedom");
    tile("Share of variance", (100 * sample.share).toFixed(1) + "%",
      "Between groups, out of the total");
    tile("Group means",
      sample.means.map(function (m) { return m.toFixed(1); }).join("  "),
      "A, B and C in this sample");
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
      "Three horizontal rows, one per group, each showing " + n() +
      " individual scores with the group mean marked. The group means are " +
      sample.means.map(function (m) { return m.toFixed(1); }).join(", ") +
      ", and a bar beneath spans them. The populations were set " + sep() +
      " apart with a within-group spread of " + within() +
      ". F is " + sample.f.toFixed(2) + " on " + sample.df1 + " and " +
      sample.df2 + " degrees of freedom, p " +
      (sample.p < 0.001 ? "below 0.001" : "equals " + sample.p.toFixed(3)) +
      ", and the share of variance between groups is " +
      (100 * sample.share).toFixed(1) + " per cent.";
  }

  /* --- Controls -------------------------------------------------------- */

  ["#sep", "#within", "#n"].forEach(function (sel) {
    wb.bindRange(sel, { format: function (v) { return v; } });
  });

  function refresh(announce) {
    build();
    render();
    if (draws >= DRAWS_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      wb.announce("Fresh sample. F is " + sample.f.toFixed(2) + ", p " +
        (sample.p < 0.001 ? "below 0.001" : sample.p.toFixed(3)) +
        ", share of variance " + (100 * sample.share).toFixed(1) + " per cent.");
    }
  }

  [sepInput, withinInput, nInput, seedInput].forEach(function (input) {
    input.addEventListener("change", function () { draws += 1; refresh(true); });
  });

  redraw.addEventListener("click", function () { draws += 1; refresh(true); });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    draws = 0;
    sepInput.value = "8";
    withinInput.value = "6";
    nInput.value = "30";
    seedInput.value = "4021";
    explain.disabled = true;
    wb.hide("#synthesis");
    refresh(false);
  });

  refresh(false);
})();
