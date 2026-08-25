/* =========================================================================
   What a Covariate Can and Cannot Buy — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/12-ancova-manova-decision-lab/

   TEACHING JOB
   ------------
   Adjustment changes the number. Only the design decides what the number is
   allowed to mean.

   WHAT IS PRESERVED
   -----------------
   Experiment 1 of the original: the live covariate-adjustment model, with a
   real ANCOVA computed on a generated cohort rather than a formula displayed
   from the population values.

       within-group slope   b = SUM_g SUM_i (x - xbar_g)(y - ybar_g)
                              / SUM_g SUM_i (x - xbar_g)^2
       unadjusted           d = ybar_1 - ybar_2
       adjusted            d' = d - b * (xbar_1 - xbar_2)
       SE(d)  = sqrt( MSE_1way * (1/n1 + 1/n2) )                 df N-2
       SE(d') = sqrt( MSE_ancova * (1/n1 + 1/n2 + (xbar_1 - xbar_2)^2 / SSwx) )
                                                                 df N-3

   The DESIGN control is the point of the activity and touches no arithmetic
   whatsoever. It is not passed to the generator or the analysis; it selects
   the warrant paragraph and nothing else. If a future edit makes any figure
   depend on it, the activity has been broken.

   HONEST SIMULATION NOTE
   ----------------------
   Data are generated as
       june = BASE + b_true * (sept - SEPT_MEAN) + EFFECT * inProgramme + noise
   so September really is the only systematic difference between the groups.
   That is the BEST case for the intact-classes reading, and the synthesis
   says so explicitly. Simulating a hidden confounder would let the learner
   watch the bias, which is a different and larger teaching job belonging to
   the confounding activity.

   The true effect is fixed at EFFECT rather than exposed as a slider: the
   activity is not about effect size, and holding it fixed is what makes the
   demonstration crisp. The adjusted difference lands near EFFECT whatever the
   September gap is, while the unadjusted difference is dragged away from it.

   WHAT WAS REDUCED
   ----------------
   The variable-role assignment stage, the whole MANOVA experiment, the
   slope-difference violation, and the described designs to classify.

   Randomness is seeded so a figure can be reproduced. Nothing is stored and
   nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var N_PER_GROUP = 40;
  var SEPT_MEAN = 50;          /* comparison group's September mean */
  var SEPT_SD = 9;
  var JUNE_BASE = 52;          /* comparison group's June mean at SEPT_MEAN */
  var JUNE_SD = 12;            /* total within-group June spread */
  var EFFECT = 6;              /* the true programme effect, in June points */
  var CHANGES_BEFORE_EXPLAINING = 3;
  /* A September gap beyond this many standard errors is not something random
     allocation plausibly produces, and the warrant paragraph says so. */
  var IMPLAUSIBLE_SE = 2.5;

  var rInput = document.getElementById("r");
  var gapInput = document.getElementById("gap");
  var designRandom = document.getElementById("design-random");
  var designIntact = document.getElementById("design-intact");
  var designLabels = {
    random: document.getElementById("design-random-label"),
    intact: document.getElementById("design-intact-label")
  };
  var seedInput = document.getElementById("seed");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var warrantText = document.getElementById("warrant-text");
  var warrant = document.getElementById("warrant");
  var redraw = document.getElementById("redraw");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var changes = 0;
  var study = null;

  function r() { return Number(rInput.value); }
  function gap() { return Number(gapInput.value); }
  function design() { return designIntact.checked ? "intact" : "random"; }

  /* The label carries the checked state visually, because a native radio dot
     is small and the whole row is the target. */
  function markDesign() {
    var current = design();
    Object.keys(designLabels).forEach(function (key) {
      designLabels[key].setAttribute("data-checked", key === current ? "true" : "false");
    });
  }
  function seed() { return Math.max(1, Math.round(Number(seedInput.value) || 1)); }

  /* --- Generate and analyse -------------------------------------------- */

  function build() {
    var random = S.mulberry32(seed() + changes * 6151);
    var rho = r();
    /* Within a group, corr(sept, june) = rho when the slope is rho * sd_y/sd_x
       and the residual spread is sd_y * sqrt(1 - rho^2). */
    var slope = rho * JUNE_SD / SEPT_SD;
    var residualSd = JUNE_SD * Math.sqrt(1 - rho * rho);
    var offset = gap();

    var groups = [[], []];
    var g = 0;
    while (g < 2) {
      var inProgramme = g === 0;
      var septMean = SEPT_MEAN + (inProgramme ? offset : 0);
      var i = 0;
      while (i < N_PER_GROUP) {
        var sept = septMean + S.normalDraw(random) * SEPT_SD;
        var june = JUNE_BASE + slope * (sept - SEPT_MEAN) +
          (inProgramme ? EFFECT : 0) + S.normalDraw(random) * residualSd;
        groups[g].push({ x: sept, y: june });
        i += 1;
      }
      g += 1;
    }
    study = analyse(groups);
  }

  function analyse(groups) {
    var xbar = groups.map(function (rows) {
      return S.mean(rows.map(function (p) { return p.x; }));
    });
    var ybar = groups.map(function (rows) {
      return S.mean(rows.map(function (p) { return p.y; }));
    });

    /* Pooled within-group slope: the covariate's effect estimated inside each
       group and combined, which is what keeps the group difference out of it. */
    var sxy = 0, sxx = 0, syy = 0;
    groups.forEach(function (rows, g) {
      rows.forEach(function (p) {
        var dx = p.x - xbar[g];
        var dy = p.y - ybar[g];
        sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
      });
    });
    var slope = sxx > 0 ? sxy / sxx : 0;
    var withinR = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;

    var unadjusted = ybar[0] - ybar[1];
    var xDiff = xbar[0] - xbar[1];
    var adjusted = unadjusted - slope * xDiff;

    var n = N_PER_GROUP;
    var total = 2 * n;
    /* One-way residual variance: the yardstick when the covariate is ignored. */
    var mseOneWay = syy / (total - 2);
    /* ANCOVA residual variance: what is left once the covariate is used. */
    var ssResid = syy - slope * sxy;
    var mseAncova = ssResid / (total - 3);

    var seUnadjusted = Math.sqrt(mseOneWay * (2 / n));
    var seAdjusted = Math.sqrt(mseAncova * (2 / n + (xDiff * xDiff) / sxx));

    return {
      groups: groups, xbar: xbar, ybar: ybar,
      slope: slope, withinR: withinR,
      unadjusted: unadjusted, adjusted: adjusted, xDiff: xDiff,
      seUnadjusted: seUnadjusted, seAdjusted: seAdjusted,
      /* How many standard errors of a chance imbalance the set gap amounts to. */
      gapInSe: gap() / (SEPT_SD * Math.sqrt(2 / n))
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function niceBounds(values, pad) {
    var lo = Math.min.apply(null, values) - pad;
    var hi = Math.max.apply(null, values) + pad;
    return [Math.floor(lo / 10) * 10, Math.ceil(hi / 10) * 10];
  }

  function render() {
    var LEFT = 92;
    var RIGHT = 690;          /* room on the right for the two line labels */
    var TITLE_Y = 22;
    var TOP = 48;
    var BOTTOM = 372;
    var TICK_Y = BOTTOM + 22;
    var CAPTION_Y = BOTTOM + 44;

    var allX = [], allY = [];
    study.groups.forEach(function (rows) {
      rows.forEach(function (p) { allX.push(p.x); allY.push(p.y); });
    });
    var xb = niceBounds(allX, 2);
    var yb = niceBounds(allY, 2);
    var X = function (v) { return LEFT + ((v - xb[0]) / (xb[1] - xb[0])) * (RIGHT - LEFT); };
    var Y = function (v) { return BOTTOM - ((v - yb[0]) / (yb[1] - yb[0])) * (BOTTOM - TOP); };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (CAPTION_Y + 24));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "Each child's September score against their June score";
    chart.appendChild(title);

    /* Axes first, so nothing sits on top of a data mark. */
    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));

    [0, 0.25, 0.5, 0.75, 1].forEach(function (t) {
      var v = xb[0] + t * (xb[1] - xb[0]);
      var mark = svg("text", { x: X(v).toFixed(1), y: TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = v.toFixed(0);
      chart.appendChild(mark);
      var vy = yb[0] + t * (yb[1] - yb[0]);
      var ymark = svg("text", {
        x: LEFT - 10, y: (Y(vy) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      ymark.textContent = vy.toFixed(0);
      chart.appendChild(ymark);
    });

    var xcap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    xcap.textContent = "September score";
    chart.appendChild(xcap);

    var ycap = svg("text", {
      x: 26, y: ((TOP + BOTTOM) / 2).toFixed(1), "text-anchor": "middle", class: "plot__tick",
      transform: "rotate(-90 26 " + ((TOP + BOTTOM) / 2).toFixed(1) + ")"
    });
    ycap.textContent = "June score";
    chart.appendChild(ycap);

    /* Individual children. Shape carries the group, not colour alone. */
    study.groups.forEach(function (rows, g) {
      rows.forEach(function (p) {
        if (g === 0) {
          chart.appendChild(svg("circle", {
            cx: X(p.x).toFixed(1), cy: Y(p.y).toFixed(1), r: 3.2,
            fill: "#1C7293", "fill-opacity": "0.55"
          }));
        } else {
          chart.appendChild(svg("rect", {
            x: (X(p.x) - 2.9).toFixed(1), y: (Y(p.y) - 2.9).toFixed(1),
            width: 5.8, height: 5.8, fill: "none",
            stroke: "#9E7318", "stroke-width": "1.4"
          }));
        }
      });
    });

    /* Two fitted lines of the same slope: that shared slope is the assumption. */
    var intercepts = [
      study.ybar[0] - study.slope * study.xbar[0],
      study.ybar[1] - study.slope * study.xbar[1]
    ];
    var lineStyle = [
      { stroke: "#1C7293", dash: null, label: "Programme" },
      { stroke: "#9E7318", dash: "7 5", label: "Comparison" }
    ];
    intercepts.forEach(function (b0, g) {
      var yAt = function (x) { return b0 + study.slope * x; };
      var attrs = {
        x1: X(xb[0]).toFixed(1), y1: Y(yAt(xb[0])).toFixed(1),
        x2: X(xb[1]).toFixed(1), y2: Y(yAt(xb[1])).toFixed(1),
        stroke: lineStyle[g].stroke, "stroke-width": "2.4", "stroke-linecap": "round"
      };
      if (lineStyle[g].dash) { attrs["stroke-dasharray"] = lineStyle[g].dash; }
      chart.appendChild(svg("line", attrs));

      var tag = svg("text", {
        x: RIGHT + 12, y: (Y(yAt(xb[1])) + 4).toFixed(1), class: "plot__sub", fill: lineStyle[g].stroke
      });
      tag.textContent = lineStyle[g].label;
      chart.appendChild(tag);
    });

    /* Group centres, ringed so they read as summaries rather than as children. */
    [0, 1].forEach(function (g) {
      chart.appendChild(svg("circle", {
        cx: X(study.xbar[g]).toFixed(1), cy: Y(study.ybar[g]).toFixed(1), r: 6.5,
        fill: g === 0 ? "#1C7293" : "#FFFFFF",
        stroke: g === 0 ? "#0F3A4A" : "#9E7318", "stroke-width": "2.4"
      }));
    });

    /* The adjusted difference: the vertical gap between the parallel lines.
       It is identical everywhere along the range, so it is drawn a fifth of
       the way in, where the scores are sparse, rather than in the middle
       where the two clouds and both group centres are. */
    var xMid = xb[0] + 0.22 * (xb[1] - xb[0]);
    var yTop = intercepts[0] + study.slope * xMid;
    var yLow = intercepts[1] + study.slope * xMid;
    var bx = X(xMid);
    chart.appendChild(svg("line", {
      x1: bx.toFixed(1), y1: Y(yTop).toFixed(1), x2: bx.toFixed(1), y2: Y(yLow).toFixed(1),
      class: "plot__interval"
    }));
    [yTop, yLow].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: (bx - 7).toFixed(1), y1: Y(v).toFixed(1), x2: (bx + 7).toFixed(1), y2: Y(v).toFixed(1),
        class: "plot__interval"
      }));
    });
    var bracket = svg("text", {
      x: (bx + 14).toFixed(1), y: ((Y(yTop) + Y(yLow)) / 2 + 4).toFixed(1),
      class: "plot__sub plot__over"
    });
    bracket.textContent = "adjusted " + signed(study.adjusted);
    chart.appendChild(bracket);

    renderReadout();
    renderWarrant();
    describe();
  }

  function signed(v) {
    return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1);
  }

  function renderReadout() {
    readout.textContent = "";
    tile("Unadjusted difference", signed(study.unadjusted),
      "June means, nothing taken into account");
    tile("Adjusted difference", signed(study.adjusted),
      "compared at the same September score");
    tile("Precision", "±" + study.seAdjusted.toFixed(2),
      "standard error, against ±" + study.seUnadjusted.toFixed(2) + " unadjusted");
    tile("Covariate correlation", study.withinR.toFixed(2),
      "September with June, within groups, in this cohort");
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

  /* --- The warrant: the only thing the design control touches ----------- */

  function renderWarrant() {
    var moved = Math.abs(study.unadjusted - study.adjusted);
    var movedText = moved < 0.5
      ? "Adjustment barely moves the estimate, because the groups started " +
        "at almost the same September score."
      : "Adjustment moves the estimate by " + moved.toFixed(1) + " points.";

    if (design() === "random") {
      warrant.setAttribute("data-state", "correct");
      warrantText.textContent =
        "Random allocation. " + movedText + " The groups differ in September " +
        "only by chance, so adjustment is not correcting a real head start. " +
        "What it does is take out the part of June that September already " +
        "explains, which shrinks the leftover variation: the standard error " +
        "falls from ±" + study.seUnadjusted.toFixed(2) + " to ±" +
        study.seAdjusted.toFixed(2) + ". The adjusted difference is an " +
        "estimate of the programme's effect." +
        (study.gapInSe > IMPLAUSIBLE_SE
          ? " A September gap this large would be very unusual under random " +
            "allocation with forty per group, so treat this setting as a what-if."
          : "");
    } else {
      warrant.setAttribute("data-state", "incorrect");
      warrantText.textContent =
        "Two intact classes. " + movedText + " The arithmetic is identical to " +
        "the random-allocation case: not one figure above has changed. What " +
        "has changed is what the number is allowed to mean. Adjustment can " +
        "remove the part of the June difference that September accounts for, " +
        "and nothing else. Whatever else differs between two classes that " +
        "were not randomly formed, and something always does, is still inside " +
        "the adjusted figure. It is the difference remaining after matching " +
        "on September, not the programme's effect.";
    }
  }

  function describe() {
    chartDesc.textContent =
      "A scatter plot of September score against June score for eighty " +
      "children, forty in the programme group and forty in the comparison " +
      "group, with a fitted line of common slope " + study.slope.toFixed(2) +
      " for each. The programme group's September mean is " +
      study.xbar[0].toFixed(1) + " and its June mean " + study.ybar[0].toFixed(1) +
      "; the comparison group's are " + study.xbar[1].toFixed(1) + " and " +
      study.ybar[1].toFixed(1) + ". The unadjusted difference in June is " +
      signed(study.unadjusted) + " points and the adjusted difference, the " +
      "vertical distance between the two lines, is " + signed(study.adjusted) +
      " points with a standard error of " + study.seAdjusted.toFixed(2) +
      " against " + study.seUnadjusted.toFixed(2) + " unadjusted. Within " +
      "groups September and June correlate " + study.withinR.toFixed(2) + ".";
  }

  /* --- Controls -------------------------------------------------------- */

  wb.bindRange("#r", { format: function (v) { return Number(v).toFixed(2); } });
  wb.bindRange("#gap", { format: function (v) { return v; } });

  function refresh(announce) {
    build();
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      wb.announce("Unadjusted difference " + signed(study.unadjusted) +
        ", adjusted difference " + signed(study.adjusted) +
        ", standard error " + study.seAdjusted.toFixed(2) + ".");
    }
  }

  [rInput, gapInput, seedInput].forEach(function (input) {
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  /* The design control re-renders the warrant only. It deliberately does not
     rebuild the cohort, because the demonstration is that nothing moves. */
  [designRandom, designIntact].forEach(function (radio) {
    radio.addEventListener("change", onDesignChange);
  });

  function onDesignChange() {
    changes += 1;
    markDesign();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    renderWarrant();
    wb.announce(design() === "random"
      ? "Design switched to random allocation. Every figure is unchanged."
      : "Design switched to two intact classes. Every figure is unchanged, but the adjusted difference is no longer an estimate of the programme's effect.");
  }

  redraw.addEventListener("click", function () { changes += 1; refresh(true); });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    rInput.value = "0.7";
    gapInput.value = "3";
    designRandom.checked = true;
    designIntact.checked = false;
    markDesign();
    seedInput.value = "3140";
    explain.disabled = true;
    wb.hide("#synthesis");
    refresh(false);
  });

  markDesign();
  refresh(false);
})();
