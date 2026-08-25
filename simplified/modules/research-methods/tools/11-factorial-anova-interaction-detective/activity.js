/* =========================================================================
   Factorial Interaction Detective — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/11-factorial-anova-interaction-detective/

   TEACHING JOB
   ------------
   An interaction is a difference of differences, and how large it looks
   depends on things that are not the data.

   THE ARITHMETIC, unchanged from the original
   -------------------------------------------
       row means      immediate = (IS + IC)/2      delayed = (DS + DC)/2
       column means   simple    = (IS + DS)/2      complex = (IC + DC)/2
       main effect of feedback = delayed row - immediate row
       main effect of task     = complex col - simple col
       interaction             = (DC - DS) - (IC - IS)
                               = (DC - IC) - (DS - IS)

   The second line is why the axis choice is a presentation decision: the
   difference of differences is symmetric.

   WHAT THIS DELIBERATELY DOES NOT COMPUTE
   ---------------------------------------
   No F, no p, no effect size, because there is no dataset, only four means.
   Putting a test result on screen would invite students to read one off
   numbers that contain no information about within-cell variation or sample
   size. Instead the two things that actually decide whether an interaction
   plot means anything are offered: the SCALE it is drawn on, and the
   UNCERTAINTY in each cell mean.

   Where a standard error is shown, the interaction is reported in units of
   its own standard error: for four independent cell means each with standard
   error s, the difference of differences has standard error 2s.

   WHAT WAS REDUCED
   ----------------
   The pattern presets, the additive-fit control, the read-it-the-other-way
   disclosure, the three-part prediction and the fill-in-the-sentence
   challenge. The symmetry is stated in the synthesis rather than given a
   control of its own.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var CELLS = ["is", "ic", "ds", "dc"];
  var START = { is: 70, ic: 50, ds: 50, dc: 70 };

  var inputs = {};
  CELLS.forEach(function (id) { inputs[id] = document.getElementById(id); });
  var scaleSelect = document.getElementById("scale");
  var seSelect = document.getElementById("se");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var changes = 0;

  function v(id) { return Number(inputs[id].value); }
  function se() { return Number(seSelect.value); }

  function terms() {
    var IS = v("is"), IC = v("ic"), DS = v("ds"), DC = v("dc");
    return {
      IS: IS, IC: IC, DS: DS, DC: DC,
      immediate: (IS + IC) / 2,
      delayed: (DS + DC) / 2,
      simple: (IS + DS) / 2,
      complex: (IC + DC) / 2,
      feedback: (DS + DC) / 2 - (IS + IC) / 2,
      task: (IC + DC) / 2 - (IS + DS) / 2,
      interaction: (DC - DS) - (IC - IS),
      /* the same number read the other way round */
      alternate: (DC - IC) - (DS - IS)
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var t = terms();
    var LEFT = 150;
    var RIGHT = 760;
    var TITLE_Y = 24;
    var TOP = 56;
    var BOTTOM = 330;
    var s = se();

    var lo, hi;
    if (scaleSelect.value === "zoom") {
      var values = [t.IS, t.IC, t.DS, t.DC];
      var min = Math.min.apply(null, values) - s * 1.4 - 2;
      var max = Math.max.apply(null, values) + s * 1.4 + 2;
      var pad = Math.max((max - min) * 0.15, 2);
      lo = min - pad; hi = max + pad;
    } else {
      lo = 20; hi = 90;
    }
    var Y = function (val) {
      return BOTTOM - ((Math.max(lo, Math.min(hi, val)) - lo) / (hi - lo)) * (BOTTOM - TOP);
    };

    wb.clearFigure(chart);

    var title = svg("text", { x: 10, y: TITLE_Y, class: "plot__label" });
    title.textContent = scaleSelect.value === "zoom"
      ? "Vertical axis zoomed to the four means"
      : "Vertical axis showing the full range";
    chart.appendChild(title);

    /* axis */
    chart.appendChild(svg("line", { x1: LEFT - 40, y1: BOTTOM, x2: RIGHT + 60, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT - 40, y1: TOP - 10, x2: LEFT - 40, y2: BOTTOM, class: "plot__axis" }));
    [0, 0.25, 0.5, 0.75, 1].forEach(function (f) {
      var val = lo + f * (hi - lo);
      var mark = svg("text", { x: LEFT - 50, y: Y(val) + 5, "text-anchor": "end", class: "plot__tick" });
      mark.textContent = val.toFixed(hi - lo < 20 ? 1 : 0);
      chart.appendChild(mark);
    });

    [["Simple task", LEFT], ["Complex task", RIGHT]].forEach(function (pair) {
      var mark = svg("text", { x: pair[1], y: BOTTOM + 26, "text-anchor": "middle", class: "plot__label" });
      mark.textContent = pair[0];
      chart.appendChild(mark);
    });

    [["is", "ic", "Immediate feedback", "#1C7293"],
     ["ds", "dc", "Delayed feedback", "#C0434F"]].forEach(function (line) {
      var a = v(line[0]), b = v(line[1]);
      chart.appendChild(svg("line", {
        x1: LEFT, y1: Y(a).toFixed(1), x2: RIGHT, y2: Y(b).toFixed(1),
        stroke: line[3], "stroke-width": 3,
        "stroke-dasharray": line[0] === "ds" ? "7 4" : "none"
      }));
      [[LEFT, a], [RIGHT, b]].forEach(function (pt) {
        if (s > 0) {
          chart.appendChild(svg("line", {
            x1: pt[0], y1: Y(pt[1] - 1.96 * s).toFixed(1),
            x2: pt[0], y2: Y(pt[1] + 1.96 * s).toFixed(1),
            stroke: line[3], "stroke-width": 2
          }));
          [-1.96, 1.96].forEach(function (k) {
            chart.appendChild(svg("line", {
              x1: pt[0] - 7, y1: Y(pt[1] + k * s).toFixed(1),
              x2: pt[0] + 7, y2: Y(pt[1] + k * s).toFixed(1),
              stroke: line[3], "stroke-width": 2
            }));
          });
        }
        chart.appendChild(svg("circle", {
          cx: pt[0], cy: Y(pt[1]).toFixed(1), r: 6, fill: line[3]
        }));
      });
      /* Series label at the right end, clear of the plot. */
      var name = svg("text", {
        x: RIGHT + 16, y: Y(b) + 5, class: "plot__sub"
      });
      name.textContent = line[2];
      chart.appendChild(name);
    });

    var caption = svg("text", { x: (LEFT + RIGHT) / 2, y: BOTTOM + 52, "text-anchor": "middle", class: "plot__tick" });
    caption.textContent = "Mean score";
    chart.appendChild(caption);

    renderReadout(t);
    describe(t);
  }

  function renderReadout(t) {
    var s = se();
    readout.textContent = "";
    tile("Main effect of feedback", signed(t.feedback),
      "Delayed minus immediate, averaged over tasks");
    tile("Main effect of task", signed(t.task),
      "Complex minus simple, averaged over timings");
    tile("Interaction", signed(t.interaction),
      s > 0
        ? Math.abs(t.interaction / (2 * s)).toFixed(1) + " times its own standard error of " + (2 * s)
        : "Difference of differences. No uncertainty shown");
  }

  function signed(x) {
    return (x > 0 ? "+" : "") + x.toFixed(1);
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

  function describe(t) {
    var s = se();
    chartDesc.textContent =
      "Two lines across two tasks. Immediate feedback runs from " + t.IS +
      " on the simple task to " + t.IC + " on the complex one. Delayed feedback " +
      "runs from " + t.DS + " to " + t.DC + ". The main effect of feedback is " +
      signed(t.feedback) + ", the main effect of task is " + signed(t.task) +
      ", and the interaction is " + signed(t.interaction) + "." +
      (s > 0 ? " Each mean is drawn with an interval of plus or minus " +
        (1.96 * s).toFixed(1) + ", and the interaction is " +
        Math.abs(t.interaction / (2 * s)).toFixed(1) +
        " times its own standard error." : "") +
      " The vertical axis is " +
      (scaleSelect.value === "zoom" ? "zoomed to the four means." : "showing the full range.");
  }

  /* --- Controls -------------------------------------------------------- */

  CELLS.forEach(function (id) {
    wb.bindRange("#" + id, { format: function (val) { return val; } });
    inputs[id].addEventListener("input", function () { changed(); });
  });
  scaleSelect.addEventListener("change", function () { changed(true); });
  seSelect.addEventListener("change", function () { changed(true); });

  function changed(announce) {
    changes += 1;
    render();
    if (changes >= 3) { explain.disabled = false; }
    if (announce) {
      var t = terms();
      wb.announce("Interaction " + signed(t.interaction) +
        (se() > 0 ? ", " + Math.abs(t.interaction / (2 * se())).toFixed(1) +
          " times its standard error." : "."));
    }
  }

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    CELLS.forEach(function (id) { inputs[id].value = String(START[id]); });
    scaleSelect.value = "full";
    seSelect.value = "0";
    explain.disabled = true;
    wb.hide("#synthesis");
    render();
  });

  render();
})();
