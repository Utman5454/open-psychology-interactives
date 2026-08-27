/* =========================================================================
   What r Cannot See — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/18-correlation-outlier-nonlinearity-lab/

   TEACHING JOB
   ------------
   r measures straight-line association only, and one observation out of
   twenty-five can move it further than the other twenty-four combined.

   WHAT IS PRESERVED
   -----------------
   The live scatter plot with a correlation computed on the points actually
   drawn, and the movable observation. Two fitted lines are drawn rather than
   one: the least-squares fit through all twenty-five points and the fit
   through the other twenty-four, so the influence of the single point is
   visible as a gap rather than only as a change in a number.

       r  = SUM (x - xbar)(y - ybar) / sqrt(SUM (x - xbar)^2 * SUM (y - ybar)^2)
       b  = SUM (x - xbar)(y - ybar) / SUM (x - xbar)^2
       b0 = ybar - b * xbar

   WHY A SLIDER RATHER THAN A DRAGGABLE POINT
   ------------------------------------------
   Dragging is the obvious interaction and it is the wrong one here. A drag
   target is difficult to operate from a keyboard and impossible to report a
   value for. Two range inputs give the same control, are keyboard operable by
   default, and let the position be announced.

   WHY THE AXES ARE FIXED AT 0 TO 100
   ----------------------------------
   The movable point must move within a stable frame, or the learner cannot
   tell whether the picture changed because the point moved or because the
   plot rescaled underneath it. The plot area is also square, because the
   apparent strength of a correlation depends on the aspect ratio it is drawn
   at, and a wide plot flatters a weak relationship.

   WHAT WAS REDUCED
   ----------------
   The negative and zero relationship presets (the shapeless cloud covers the
   second), the change-of-units demonstration, and the guess-the-correlation
   challenge set.

   The twenty-four fixed points are seeded from a constant, so every learner
   sees the same cloud and a lecturer can quote the same numbers.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var CLOUD = 24;
  var CLOUD_SEED = 20601;      /* constant: everyone sees the same points */
  /* The shapeless cloud has its own seed and its own, tighter, spread. It was
     chosen by sweeping candidates for two properties at once: the twenty-four
     points on their own correlate -0.0007, which is genuinely nothing rather
     than a small chance trend, and they sit compactly enough that the single
     movable point has real leverage. Put it in the top corner and r becomes
     +0.52; put it in the bottom corner and r becomes -0.44. A wide cloud
     would have made the demonstration limp. */
  var NONE_SEED = 27;
  var AXIS_MIN = 0;
  var AXIS_MAX = 100;
  var CHANGES_BEFORE_EXPLAINING = 3;

  var pxInput = document.getElementById("px");
  var pyInput = document.getElementById("py");
  var patternRadios = {
    straight: document.getElementById("pattern-straight"),
    curved: document.getElementById("pattern-curved"),
    none: document.getElementById("pattern-none")
  };
  var patternLabels = {
    straight: document.getElementById("pattern-straight-label"),
    curved: document.getElementById("pattern-curved-label"),
    none: document.getElementById("pattern-none-label")
  };
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
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

  function px() { return Number(pxInput.value); }
  function py() { return Number(pyInput.value); }
  function pattern() {
    if (patternRadios.curved.checked) { return "curved"; }
    if (patternRadios.none.checked) { return "none"; }
    return "straight";
  }

  function markPattern() {
    var current = pattern();
    Object.keys(patternLabels).forEach(function (key) {
      patternLabels[key].setAttribute("data-checked", key === current ? "true" : "false");
    });
  }

  /* --- The twenty-four fixed points ------------------------------------ */

  function cloud() {
    var kind = pattern();
    var random = S.mulberry32(kind === "none" ? NONE_SEED : CLOUD_SEED);
    var points = [];
    var i = 0;
    while (i < CLOUD) {
      var x, y;
      if (kind === "straight") {
        x = 8 + random() * 84;
        y = 18 + 0.68 * x + S.normalDraw(random) * 8;
      } else if (kind === "curved") {
        /* An arch. Strong relationship, no straight line through it. */
        x = 8 + random() * 84;
        y = 88 - 0.028 * (x - 50) * (x - 50) + S.normalDraw(random) * 4;
      } else {
        x = 22 + random() * 40;
        y = 30 + random() * 40;
      }
      points.push({ x: x, y: Math.max(3, Math.min(97, y)) });
      i += 1;
    }
    return points;
  }

  /* --- Correlation and fit --------------------------------------------- */

  function fit(points) {
    var n = points.length;
    if (n < 3) { return { r: 0, slope: 0, intercept: 0, n: n }; }
    var mx = S.mean(points.map(function (p) { return p.x; }));
    var my = S.mean(points.map(function (p) { return p.y; }));
    var sxy = 0, sxx = 0, syy = 0;
    points.forEach(function (p) {
      var dx = p.x - mx, dy = p.y - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    });
    var r = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;
    var slope = sxx > 0 ? sxy / sxx : 0;
    return { r: r, slope: slope, intercept: my - slope * mx, n: n };
  }

  function state() {
    var base = cloud();
    var movable = { x: px(), y: py() };
    var all = base.concat([movable]);
    return {
      base: base, movable: movable, all: all,
      withPoint: fit(all),
      withoutPoint: fit(base)
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var st = state();

    /* A square plot area. The apparent strength of a correlation depends on
       the aspect ratio, so a stretched plot would be its own lesson. */
    var LEFT = 250;
    var RIGHT = 650;
    var TOP = 50;
    var BOTTOM = 450;
    var TICK_Y = BOTTOM + 22;
    var CAP_Y = BOTTOM + 44;

    var X = function (v) { return LEFT + ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (RIGHT - LEFT); };
    var Y = function (v) { return BOTTOM - ((v - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (CAP_Y + 20));

    var title = svg("text", { x: LEFT, y: 26, class: "plot__label" });
    title.textContent = "Twenty-five observations";
    chart.appendChild(title);

    /* Frame first, so nothing sits over a data point. */
    chart.appendChild(svg("rect", {
      x: LEFT, y: TOP, width: RIGHT - LEFT, height: BOTTOM - TOP,
      fill: "none", stroke: "#D8D2C7", "stroke-width": "1"
    }));
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

    /* Both fitted lines, clipped to the frame. */
    function drawFit(f, attrs) {
      var y0 = f.intercept + f.slope * AXIS_MIN;
      var y1 = f.intercept + f.slope * AXIS_MAX;
      var base = {
        x1: X(AXIS_MIN).toFixed(1), y1: Y(Math.max(AXIS_MIN, Math.min(AXIS_MAX, y0))).toFixed(1),
        x2: X(AXIS_MAX).toFixed(1), y2: Y(Math.max(AXIS_MIN, Math.min(AXIS_MAX, y1))).toFixed(1)
      };
      Object.keys(attrs).forEach(function (k) { base[k] = attrs[k]; });
      chart.appendChild(svg("line", base));
    }
    drawFit(st.withoutPoint, {
      stroke: "#9E7318", "stroke-width": "2", "stroke-dasharray": "7 5"
    });
    drawFit(st.withPoint, { stroke: "#1C7293", "stroke-width": "2.6" });

    /* The twenty-four fixed observations. */
    st.base.forEach(function (p) {
      chart.appendChild(svg("circle", {
        cx: X(p.x).toFixed(1), cy: Y(p.y).toFixed(1), r: 4,
        fill: "#3D5A80", "fill-opacity": "0.6"
      }));
    });

    /* The movable one, ringed so it is unmistakable. */
    chart.appendChild(svg("circle", {
      cx: X(st.movable.x).toFixed(1), cy: Y(st.movable.y).toFixed(1), r: 7.5,
      fill: "#C0434F", stroke: "#FBFAF7", "stroke-width": "2"
    }));
    chart.appendChild(svg("circle", {
      cx: X(st.movable.x).toFixed(1), cy: Y(st.movable.y).toFixed(1), r: 12,
      fill: "none", stroke: "#C0434F", "stroke-width": "1.8"
    }));

    /* A key, in the empty space beside the square plot. Labelling the two
       lines where they end put "other 24" straight on top of a y-axis tick,
       and labelling them anywhere along their length risks a collision with
       each other exactly when they are closest, which is the case the figure
       most needs to stay readable. A key cannot collide with anything, and it
       carries a sample of each line so solid against dashed is visible
       without reading a colour. */
    var KEY_X = RIGHT + 34;
    var KEY_Y = TOP + 30;
    [
      { label: "all 25 points", stroke: "#1C7293", width: "2.6", dash: null },
      { label: "the other 24", stroke: "#9E7318", width: "2", dash: "7 5" }
    ].forEach(function (item, index) {
      var y = KEY_Y + index * 28;
      var sample = {
        x1: KEY_X, y1: y, x2: KEY_X + 34, y2: y,
        stroke: item.stroke, "stroke-width": item.width, "stroke-linecap": "round"
      };
      if (item.dash) { sample["stroke-dasharray"] = item.dash; }
      chart.appendChild(svg("line", sample));
      var text = svg("text", {
        x: KEY_X + 44, y: y + 4, class: "plot__sub", fill: item.stroke
      });
      text.textContent = item.label;
      chart.appendChild(text);
    });
    var keyHead = svg("text", { x: KEY_X, y: KEY_Y - 22, class: "plot__label" });
    keyHead.textContent = "Best-fitting line";
    chart.appendChild(keyHead);

    renderReadout(st);
    renderSentence(st);
    describe(st);
  }

  function signed(v) { return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2); }

  function renderReadout(st) {
    readout.textContent = "";
    tile("r, all 25 points", signed(st.withPoint.r), strength(st.withPoint.r));
    tile("r, the other 24", signed(st.withoutPoint.r),
      "without the point you are moving");
    tile("r squared, all 25",
      (100 * st.withPoint.r * st.withPoint.r).toFixed(1) + "%",
      "of the variation the straight line accounts for");
  }

  function strength(r) {
    var a = Math.abs(r);
    if (a < 0.1) { return "essentially no straight-line association"; }
    if (a < 0.3) { return "a weak straight-line association"; }
    if (a < 0.6) { return "a moderate straight-line association"; }
    return "a strong straight-line association";
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

  function renderSentence(st) {
    var shift = st.withPoint.r - st.withoutPoint.r;
    var kind = pattern();
    var head;
    if (kind === "curved") {
      head = "The twenty-four fixed points sit on a clear arch, so the " +
        "relationship between X and Y is strong and obvious to the eye. r is " +
        signed(st.withPoint.r) + ", because no straight line fits an arch. ";
    } else if (kind === "none") {
      head = "The twenty-four fixed points are a shapeless cloud. ";
    } else {
      head = "The twenty-four fixed points rise together with ordinary scatter. ";
    }
    var tail;
    if (Math.abs(shift) < 0.02) {
      tail = "Your one point is currently doing almost nothing to r, which " +
        "changes by " + shift.toFixed(2) + " when it is removed.";
    } else {
      tail = "Moving that single point out of twenty-five has shifted r by " +
        signed(shift) + ", from " + signed(st.withoutPoint.r) + " without it " +
        "to " + signed(st.withPoint.r) + " with it.";
    }
    sentence.textContent = head + tail;
  }

  function describe(st) {
    chartDesc.textContent =
      "A square scatter plot of twenty-five observations on axes running from " +
      "0 to 100. Twenty-four of them form " +
      (pattern() === "curved" ? "a clear arch, rising to a peak near the middle and falling away"
        : pattern() === "none" ? "a shapeless cloud with no visible trend"
        : "a rising band with ordinary scatter") +
      ". The twenty-fifth, ringed, sits at " + px() + " across and " + py() +
      " up. The correlation across all twenty-five is " + signed(st.withPoint.r) +
      " and across the other twenty-four alone it is " + signed(st.withoutPoint.r) +
      ". Two fitted lines are drawn, a solid one through all twenty-five with a " +
      "slope of " + st.withPoint.slope.toFixed(2) + " and a dashed one through " +
      "the other twenty-four with a slope of " + st.withoutPoint.slope.toFixed(2) + ".";
  }

  /* --- Challenges ------------------------------------------------------- */

  var TASKS = [
    {
      pattern: "curved", px: 50, py: 55,
      text: "Look at the plot, then at r. The relationship here could hardly " +
        "be stronger or more obvious, and r is close to zero. It is not " +
        "broken: it is measuring how well a straight line fits, and no " +
        "straight line fits an arch. Any summary that reported only this " +
        "number would say there is no relationship."
    },
    {
      pattern: "none", px: 96, py: 96,
      text: "Twenty-four points with no relationship at all, and one " +
        "observation out in the top corner. r is now respectable enough to " +
        "report in a paper, and the whole of it comes from that single point. " +
        "Compare the two r values in the tiles above."
    },
    {
      pattern: "straight", px: 96, py: 8,
      text: "A genuine rising relationship, and one point in the bottom-right " +
        "corner. It pulls the fitted line down and cuts r substantially. Now " +
        "slide the point straight up to 96 without changing how far across it " +
        "is: it is just as unusual, and it barely matters. Influence is about " +
        "position, not strangeness."
    },
    {
      pattern: "straight", px: 50, py: 96,
      text: "The same unusual point, but now in the middle of the horizontal " +
        "range. It is far from the line, yet r barely moves and the two " +
        "fitted lines nearly coincide. An outlier near the centre of the " +
        "predictor has little leverage on the slope."
    }
  ];

  /* --- Controls -------------------------------------------------------- */

  var ranges = ["#px", "#py"].map(function (sel) {
    return wb.bindRange(sel, { format: function (v) { return v; } });
  });
  function syncRanges() { ranges.forEach(function (r) { if (r) { r.sync(); } }); }

  function refresh(announce) {
    /* bindRange syncs on input, which covers dragging and arrow keys. Syncing
       here as well means the displayed value can never drift from the input's
       value however it was set. */
    syncRanges();
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      var st = state();
      wb.announce("The point is at " + px() + " across, " + py() +
        " up. r across all twenty-five is " + signed(st.withPoint.r) +
        ", and without that point " + signed(st.withoutPoint.r) + ".");
    }
  }

  [pxInput, pyInput].forEach(function (input) {
    input.addEventListener("input", function () { render(); });
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  Object.keys(patternRadios).forEach(function (key) {
    patternRadios[key].addEventListener("change", function () {
      changes += 1;
      markPattern();
      refresh(true);
    });
  });

  challenge.addEventListener("click", function () {
    taskIndex = (taskIndex + 1) % TASKS.length;
    var t = TASKS[taskIndex];
    Object.keys(patternRadios).forEach(function (key) {
      patternRadios[key].checked = key === t.pattern;
    });
    markPattern();
    pxInput.value = String(t.px);
    pyInput.value = String(t.py);
    syncRanges();
    changes += 1;
    taskText.textContent = t.text;
    wb.show("#task");
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
    patternRadios.straight.checked = true;
    patternRadios.curved.checked = false;
    patternRadios.none.checked = false;
    markPattern();
    pxInput.value = "50";
    pyInput.value = "55";
    syncRanges();
    explain.disabled = true;
    wb.hide("#task");
    wb.hide("#synthesis");
    render();
  });

  markPattern();
  render();
})();
