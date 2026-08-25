/* =========================================================================
   Why It Is Called Least Squares — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/19-regression-slope-intercept-lab/

   TEACHING JOB
   ------------
   Least squares means literally minimising the total area of the squares
   drawn on the residuals, and exactly one line does it.

   WHAT IS PRESERVED
   -----------------
   The original's hand-fitting interaction: the learner sets an intercept and
   a slope and sees the consequence, before being shown the answer.

   WHAT IS ADDED
   -------------
   The squares themselves. The original reports the sum of squared residuals
   as a number; here every residual gets a real square whose side is the
   residual and whose area is therefore the residual squared, so the quantity
   being minimised is on the screen rather than described. This is the one
   place in the batch where the simplified version does MORE than its parent,
   and it is justified because the drawing is the concept.

       residual_i = y_i - (b0 + b1 * x_i)
       SSE        = SUM residual_i^2            the total area drawn
       SST        = SUM (y_i - ybar)^2
       R^2        = 1 - SSE / SST               negative when worse than ybar

   The least-squares solution is computed in closed form, not searched for:
       b1 = SUM (x - xbar)(y - ybar) / SUM (x - xbar)^2
       b0 = ybar - b1 * xbar

   THE PLOT MUST BE SQUARE AND BOTH AXES MUST MATCH
   ------------------------------------------------
   A square of side e in data units is only drawn as a square on screen if one
   unit of X and one unit of Y are the same number of pixels. Both axes run 0
   to 100 over the same 400 units of the viewBox for exactly this reason. If
   this is ever changed, the squares become rectangles and the activity loses
   its point.

   WHAT WAS REDUCED
   ----------------
   The prediction exercise, the numeric target challenge and the standard
   error of the estimate.

   The twelve observations are seeded from a constant, so every learner sees
   the same data and a lecturer can quote the same answer.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var N = 12;
  var DATA_SEED = 7714;
  var AXIS_MIN = 0;
  var AXIS_MAX = 100;
  var CHANGES_BEFORE_EXPLAINING = 3;

  var b0Input = document.getElementById("b0");
  var b1Input = document.getElementById("b1");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var reveal = document.getElementById("reveal");
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
  var revealed = false;

  function b0() { return Number(b0Input.value); }
  function b1() { return Number(b1Input.value); }

  /* --- The twelve observations, identical for everyone ------------------ */

  var DATA = (function () {
    var random = S.mulberry32(DATA_SEED);
    var points = [];
    var i = 0;
    while (i < N) {
      var x = 8 + (i / (N - 1)) * 80 + S.normalDraw(random) * 3;
      var y = 24 + 0.58 * x + S.normalDraw(random) * 9;
      points.push({
        x: Math.max(4, Math.min(96, x)),
        y: Math.max(6, Math.min(94, y))
      });
      i += 1;
    }
    return points;
  }());

  var BEST = (function () {
    var mx = S.mean(DATA.map(function (p) { return p.x; }));
    var my = S.mean(DATA.map(function (p) { return p.y; }));
    var sxy = 0, sxx = 0, sst = 0;
    DATA.forEach(function (p) {
      sxy += (p.x - mx) * (p.y - my);
      sxx += (p.x - mx) * (p.x - mx);
      sst += (p.y - my) * (p.y - my);
    });
    var slope = sxy / sxx;
    var intercept = my - slope * mx;
    var sse = 0;
    DATA.forEach(function (p) {
      var e = p.y - (intercept + slope * p.x);
      sse += e * e;
    });
    return { slope: slope, intercept: intercept, sse: sse, sst: sst, meanY: my };
  }());

  /* The slider steps are coarse enough that the exact least-squares pair is
     not reachable by hand, so the reveal has to aim at the best pair the
     controls can actually produce. Rounding each coefficient independently
     does NOT give that pair, because the two are correlated: rounding the
     intercept up is partly compensated by a smaller slope. The reachable
     optimum is therefore found by evaluating every setting the two sliders
     admit, which is 61 times 41 lines and costs nothing. Doing it this way
     also means "you have matched it" is true rather than nearly true. */
  var REACHABLE = (function () {
    /* getAttribute rather than the reflected .min/.max/.step properties, so
       the bounds are read from the markup that actually declares them. */
    function attr(el, name) { return Number(el.getAttribute(name)); }
    var lo = attr(b0Input, "min"), hi = attr(b0Input, "max"), step = attr(b0Input, "step");
    var slo = attr(b1Input, "min"), shi = attr(b1Input, "max"), sstep = attr(b1Input, "step");
    var bestPair = null;
    var intercept = lo;
    while (intercept <= hi + 1e-9) {
      var slope = slo;
      while (slope <= shi + 1e-9) {
        var sse = 0;
        DATA.forEach(function (p) {
          var e = p.y - (intercept + slope * p.x);
          sse += e * e;
        });
        if (!bestPair || sse < bestPair.sse) {
          bestPair = { intercept: intercept, slope: slope, sse: sse };
        }
        slope = Math.round((slope + sstep) * 1e6) / 1e6;
      }
      intercept += step;
    }
    return bestPair;
  }());

  function evaluate(intercept, slope) {
    var sse = 0;
    var residuals = DATA.map(function (p) {
      var e = p.y - (intercept + slope * p.x);
      sse += e * e;
      return e;
    });
    return {
      intercept: intercept, slope: slope, residuals: residuals, sse: sse,
      r2: BEST.sst > 0 ? 1 - sse / BEST.sst : 0
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var current = evaluate(b0(), b1());

    /* Square plot area, both axes 0 to 100 over the same span, so that a
       square in data units is a square on screen. */
    var LEFT = 250;
    var RIGHT = 650;
    var TOP = 46;
    var BOTTOM = 446;
    var TICK_Y = BOTTOM + 22;
    var CAP_Y = BOTTOM + 44;
    var SCALE = (RIGHT - LEFT) / (AXIS_MAX - AXIS_MIN);

    var X = function (v) { return LEFT + (v - AXIS_MIN) * SCALE; };
    var Y = function (v) { return BOTTOM - (v - AXIS_MIN) * SCALE; };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (CAP_Y + 20));

    var title = svg("text", { x: LEFT, y: 26, class: "plot__label" });
    title.textContent = "Twelve observations, your line, and the squares it leaves";
    chart.appendChild(title);

    chart.appendChild(svg("rect", {
      x: LEFT, y: TOP, width: RIGHT - LEFT, height: BOTTOM - TOP,
      fill: "none", stroke: "#D8D2C7", "stroke-width": "1"
    }));

    /* The residual squares, drawn before the points and the line so neither
       is hidden behind them. */
    DATA.forEach(function (p, i) {
      var e = current.residuals[i];
      var side = Math.abs(e);
      if (side < 0.01) { return; }
      var fitted = p.y - e;
      /* The square hangs off the residual segment, on whichever side keeps it
         inside the frame. */
      var toRight = p.x + side <= AXIS_MAX;
      var x0 = toRight ? p.x : p.x - side;
      var yTop = Math.max(p.y, fitted);
      chart.appendChild(svg("rect", {
        x: X(x0).toFixed(1), y: Y(yTop).toFixed(1),
        width: (side * SCALE).toFixed(1), height: (side * SCALE).toFixed(1),
        fill: "#C0434F", "fill-opacity": "0.18",
        stroke: "#C0434F", "stroke-opacity": "0.55", "stroke-width": "1"
      }));
      /* The residual itself, so the side of the square is unmistakably the
         miss rather than an arbitrary box. */
      chart.appendChild(svg("line", {
        x1: X(p.x).toFixed(1), y1: Y(p.y).toFixed(1),
        x2: X(p.x).toFixed(1), y2: Y(fitted).toFixed(1),
        stroke: "#C0434F", "stroke-width": "1.6"
      }));
    });

    /* Your line. */
    var yLeft = current.intercept + current.slope * AXIS_MIN;
    var yRight = current.intercept + current.slope * AXIS_MAX;
    chart.appendChild(svg("line", {
      x1: X(AXIS_MIN).toFixed(1), y1: Y(Math.max(-40, Math.min(140, yLeft))).toFixed(1),
      x2: X(AXIS_MAX).toFixed(1), y2: Y(Math.max(-40, Math.min(140, yRight))).toFixed(1),
      stroke: "#1C7293", "stroke-width": "2.8", "stroke-linecap": "round"
    }));

    DATA.forEach(function (p) {
      chart.appendChild(svg("circle", {
        cx: X(p.x).toFixed(1), cy: Y(p.y).toFixed(1), r: 4.5,
        fill: "#1A2744"
      }));
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    [0, 25, 50, 75, 100].forEach(function (t) {
      var tick = svg("text", { x: X(t).toFixed(1), y: TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(t);
      chart.appendChild(tick);
      var ytick = svg("text", {
        x: LEFT - 10, y: (Y(t) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      ytick.textContent = String(t);
      chart.appendChild(ytick);
    });
    var xcap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    xcap.textContent = "Variable X";
    chart.appendChild(xcap);
    var ycap = svg("text", {
      x: 200, y: ((TOP + BOTTOM) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
      transform: "rotate(-90 200 " + ((TOP + BOTTOM) / 2).toFixed(1) + ")"
    });
    ycap.textContent = "Variable Y";
    chart.appendChild(ycap);

    /* A note in the space beside the square plot, so the target is always
       visible without hunting for it in the tiles. */
    var noteX = RIGHT + 34;
    var head = svg("text", { x: noteX, y: TOP + 26, class: "plot__label" });
    head.textContent = "Total area";
    chart.appendChild(head);
    var yours = svg("text", { x: noteX, y: TOP + 52, class: "plot__sub", fill: "#C0434F" });
    yours.textContent = "yours: " + Math.round(current.sse);
    chart.appendChild(yours);
    var best = svg("text", { x: noteX, y: TOP + 76, class: "plot__sub" });
    best.textContent = "smallest possible: " + Math.round(BEST.sse);
    chart.appendChild(best);

    renderReadout(current);
    renderSentence(current);
    describe(current);
  }

  function renderReadout(current) {
    readout.textContent = "";
    tile("Total area of the squares", String(Math.round(current.sse)),
      "the sum of the squared residuals");
    tile("Smallest possible", String(Math.round(BEST.sse)),
      "no line can do better than this");
    tile("R squared", (current.r2 >= 0 ? "" : "−") +
      Math.abs(100 * current.r2).toFixed(1) + "%",
      current.r2 < 0
        ? "worse than predicting the average of Y for everyone"
        : "better than predicting the average of Y for everyone");
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

  function renderSentence(current) {
    var excess = current.sse - BEST.sse;
    /* Judged against the best the CONTROLS can do, not against the exact
       least-squares total, which no slider setting can reach. */
    if (current.sse <= REACHABLE.sse + 0.5) {
      sentence.textContent =
        "That is the best line these controls can produce. It leaves a total " +
        "area of " + Math.round(current.sse) + ", and the exact best-fitting " +
        "line, whose intercept and slope fall between the slider steps, gets " +
        "it down to " + Math.round(BEST.sse) + ". Nothing can do better than " +
        "that.";
    } else if (current.r2 < 0) {
      sentence.textContent =
        "Your line is currently worse than useless: predicting the average of " +
        "Y, " + BEST.meanY.toFixed(1) + ", for every single observation would " +
        "leave less total area than this. That is what a negative R squared " +
        "means. There is " + Math.round(excess) + " more area here than the " +
        "best line leaves.";
    } else {
      sentence.textContent =
        "There is " + Math.round(excess) + " more area on screen than the " +
        "best-fitting line would leave, which is " +
        (BEST.sse > 0 ? (current.sse / BEST.sse).toFixed(2) : "?") +
        " times the smallest possible total. Keep going.";
    }
  }

  function describe(current) {
    chartDesc.textContent =
      "A square scatter plot of twelve observations on axes running from 0 to " +
      "100, with a straight line of intercept " + current.intercept.toFixed(0) +
      " and slope " + current.slope.toFixed(2) + " drawn through them. Each " +
      "observation is joined to the line by a vertical segment, and a square " +
      "of that side is drawn on each. The twelve areas total " +
      Math.round(current.sse) + ", against a smallest possible total of " +
      Math.round(BEST.sse) + ", giving an R squared of " +
      (100 * current.r2).toFixed(1) + " per cent. The best-fitting line has " +
      "an intercept of " + BEST.intercept.toFixed(1) + " and a slope of " +
      BEST.slope.toFixed(2) + ".";
  }

  /* --- Controls -------------------------------------------------------- */

  var ranges = [
    wb.bindRange("#b0", { format: function (v) { return v; } }),
    wb.bindRange("#b1", { format: function (v) { return Number(v).toFixed(2); } })
  ];
  function syncRanges() { ranges.forEach(function (r) { if (r) { r.sync(); } }); }

  function refresh(announce) {
    syncRanges();
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      var current = evaluate(b0(), b1());
      wb.announce("Total area " + Math.round(current.sse) +
        ", against a smallest possible " + Math.round(BEST.sse) +
        ". R squared " + (100 * current.r2).toFixed(1) + " per cent.");
    }
  }

  [b0Input, b1Input].forEach(function (input) {
    input.addEventListener("input", function () { render(); });
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  reveal.addEventListener("click", function () {
    var before = evaluate(b0(), b1());
    b0Input.value = String(REACHABLE.intercept);
    b1Input.value = String(REACHABLE.slope);
    revealed = true;
    changes += 1;
    refresh(false);
    var after = evaluate(b0(), b1());
    taskText.textContent =
      "The best-fitting line has an intercept of " + BEST.intercept.toFixed(1) +
      " and a slope of " + BEST.slope.toFixed(2) + ", which the controls have " +
      "been set as close to as their steps allow. Your line left a total area " +
      "of " + Math.round(before.sse) + "; this one leaves " +
      Math.round(after.sse) + ". Nothing was searched for: those two numbers " +
      "come straight out of the data in one step, which is why every " +
      "statistics package agrees on them and why there is nothing to argue " +
      "about once you have accepted that squares are the thing to minimise.";
    wb.show("#task");
    wb.announce("The best-fitting line has an intercept of " +
      BEST.intercept.toFixed(1) + " and a slope of " + BEST.slope.toFixed(2) + ".");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    revealed = false;
    b0Input.value = "15";
    b1Input.value = "0.2";
    syncRanges();
    explain.disabled = true;
    wb.hide("#task");
    wb.hide("#synthesis");
    render();
  });

  render();
})();
