/* =========================================================================
   How Sure Can One Case Make You? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/02-lesion-symptom-inference-trap/

   TEACHING JOB
   ------------
   A single lesion case licenses far less localisation inference than it
   feels like, and every complication removes support rather than adding any.

   WHAT IS PRESERVED
   -----------------
   The mechanism, which is the sequential reveal set against a running record
   of the learner's own stated confidence. Being told that one case is weak
   evidence does nothing. Watching your own number sit above a line that keeps
   falling is the argument, and it only works if the rating is made before the
   complication is seen.

   Three of the original's six complications are kept, chosen because they
   fail in three different ways:

       extent      the label names the centre of a lesion, not its edges
       territory   the shape follows a blood vessel, not a function
       oedema      some affected tissue is intact but swollen or quiet

   THE CEILING IS A TEACHING DEVICE AND THE PAGE SAYS SO
   -----------------------------------------------------
   The original attaches a numeric ceiling to each complication. Kept, because
   without a line to sit above the learner's number means nothing, but the
   caution states plainly that no formula turns complications into a number
   and that a different neuropsychologist would draw it elsewhere. What is not
   arbitrary is the direction: it only ever falls.

   WHAT WAS REDUCED
   ----------------
   Three further complications, the claim-sorting exercise separating
   single-case from population claims, and the full rating trace.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  /* Ceilings are illustrative. See the note above and the caution on the page. */
  var STAGES = [
    {
      key: "start", ceiling: 55,
      prompt: "How confident are you in that claim, on the evidence so far?"
    },
    {
      key: "extent", ceiling: 40,
      heading: "The lesion is larger than its label",
      body: "The damage is not confined to the inferior frontal region. On " +
        "the scan it extends backwards into the insula and downwards into the " +
        "white matter beneath, about 24 cubic centimetres in total. A " +
        "one-region label names the centre of a lesion, not its extent.",
      effect: "Any of that tissue could be responsible, including the white " +
        "matter, which carries connections to regions that are themselves " +
        "undamaged. Two cases carrying the same label can have very different " +
        "lesions.",
      prompt: "Now how confident are you?"
    },
    {
      key: "territory", ceiling: 32,
      heading: "The lesion follows a blood supply, not a function",
      body: "The shape of the damage matches the territory of the superior " +
        "division of the left middle cerebral artery. Strokes take the shape " +
        "of the vessel that failed, and one vessel supplies several " +
        "functionally distinct regions together.",
      effect: "Those regions are damaged together in case after case, so the " +
        "co-occurrence is systematic rather than random. It does not average " +
        "away as the sample grows.",
      prompt: "And now?"
    },
    {
      key: "oedema", ceiling: 24,
      heading: "Some of the affected tissue is not damaged at all",
      body: "At two weeks there is still swelling around the lesion, pressing " +
        "on tissue that is structurally intact. Activity is also reduced in " +
        "undamaged left temporal cortex connected to the damaged area, which " +
        "is called diaschisis.",
      effect: "Part of what she cannot do reflects tissue that is intact but " +
        "temporarily not working. A deficit measured now overstates what the " +
        "damage itself accounts for, and some of it will recover without any " +
        "tissue being repaired.",
      prompt: "Last one. How confident are you now?"
    }
  ];

  var confidence = document.getElementById("confidence");
  var confidenceLabel = document.getElementById("confidence-label");
  var lock = document.getElementById("lock");
  var rating = document.getElementById("rating");
  var complication = document.getElementById("complication");
  var complicationHeading = document.getElementById("complication-heading");
  var complicationBody = document.getElementById("complication-body");
  var complicationEffect = document.getElementById("complication-effect");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var stage = 0;
  var given = [];

  var range = wb.bindRange("#confidence", { format: function (v) { return v; } });

  function lockIn() {
    given.push(Number(confidence.value));
    renderChart();
    wb.show("#chart-wrap");

    if (stage === STAGES.length - 1) { report(); return; }

    stage += 1;
    var s = STAGES[stage];
    wb.progress.set(1);
    stepLabel.textContent = "Complication " + stage + " of 3";
    taskHeading.textContent = "A complication";
    complicationHeading.textContent = "";
    var strong = document.createElement("strong");
    strong.textContent = s.heading;
    complicationHeading.appendChild(strong);
    complicationBody.textContent = s.body;
    complicationEffect.textContent = s.effect;
    wb.show("#complication");
    confidenceLabel.textContent = s.prompt;
    wb.scrollTo("#complication");
    wb.announce("Complication " + stage + ". " + s.heading + ". Rate your confidence again.");
  }

  /* --- The trace --------------------------------------------------------- */

  function renderChart() {
    /* RIGHT stops well short of the 900-unit viewBox: the two series labels
       sit to the right of the last point and "the most it can carry" needs
       about 130 units of its own. */
    var LEFT = 150, RIGHT = 700, TOP = 56, BOTTOM = 300;
    /* Inset half a step at each end: a first point at exactly LEFT puts its
       value label astride the y-axis line. */
    var X = function (i) {
      return LEFT + ((i + 0.5) / STAGES.length) * (RIGHT - LEFT);
    };
    var Y = function (v) { return BOTTOM - (v / 100) * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var title = svg("text", { x: 30, y: 24, class: "plot__label" });
    title.textContent = "Your confidence, and the most the evidence can carry";
    chart.appendChild(title);

    /* The unsupported band, drawn first so nothing sits under a label. */
    var band = "M " + X(0).toFixed(1) + " " + Y(100).toFixed(1);
    STAGES.forEach(function (s, i) { band += " L " + X(i).toFixed(1) + " " + Y(100).toFixed(1); });
    for (var i = STAGES.length - 1; i >= 0; i -= 1) {
      band += " L " + X(i).toFixed(1) + " " + Y(STAGES[i].ceiling).toFixed(1);
    }
    band += " Z";
    chart.appendChild(svg("path", {
      d: band, fill: "#C0434F", "fill-opacity": "0.12", stroke: "none"
    }));

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    [0, 25, 50, 75, 100].forEach(function (v) {
      var tick = svg("text", { x: LEFT - 10, y: (Y(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick" });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    /* The ceiling. */
    chart.appendChild(svg("path", {
      d: STAGES.map(function (s, i) {
        return (i === 0 ? "M " : "L ") + X(i).toFixed(1) + " " + Y(s.ceiling).toFixed(1);
      }).join(" "),
      fill: "none", stroke: "#C0434F", "stroke-width": "2.4", "stroke-dasharray": "7 5"
    }));
    var ceilTag = svg("text", {
      x: (X(STAGES.length - 1) + 12).toFixed(1),
      y: (Y(STAGES[STAGES.length - 1].ceiling) + 4).toFixed(1),
      class: "plot__sub", fill: "#C0434F"
    });
    ceilTag.textContent = "the most it can carry";
    chart.appendChild(ceilTag);

    /* What the learner said, as far as they have gone. */
    if (given.length) {
      chart.appendChild(svg("path", {
        d: given.map(function (v, i) {
          return (i === 0 ? "M " : "L ") + X(i).toFixed(1) + " " + Y(v).toFixed(1);
        }).join(" "),
        fill: "none", stroke: "#1C7293", "stroke-width": "2.8", "stroke-linejoin": "round"
      }));
      given.forEach(function (v, i) {
        chart.appendChild(svg("circle", {
          cx: X(i).toFixed(1), cy: Y(v).toFixed(1), r: 6, fill: "#1C7293"
        }));
        var value = svg("text", {
          x: X(i).toFixed(1), y: (Y(v) - 14).toFixed(1), "text-anchor": "middle",
          class: "plot__sub plot__over", fill: "#1C7293"
        });
        value.textContent = String(v);
        chart.appendChild(value);
      });
      var youTag = svg("text", {
        x: (X(given.length - 1) + 12).toFixed(1), y: (Y(given[given.length - 1]) + 22).toFixed(1),
        class: "plot__sub", fill: "#1C7293"
      });
      youTag.textContent = "you";
      chart.appendChild(youTag);
    }

    var LABELS = ["the case\nalone", "plus\nextent", "plus\nterritory", "plus\nswelling"];
    STAGES.forEach(function (s, i) {
      LABELS[i].split("\n").forEach(function (part, line) {
        var tick = svg("text", {
          x: X(i).toFixed(1), y: BOTTOM + 26 + line * 18, "text-anchor": "middle", class: "plot__tick"
        });
        tick.textContent = part;
        chart.appendChild(tick);
      });
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 78, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "What you knew when you rated";
    chart.appendChild(cap);

    chartDesc.textContent =
      "A line of your confidence ratings against a falling dashed ceiling. " +
      "The ceiling runs " + STAGES.map(function (s) { return s.ceiling; }).join(", then ") +
      " out of 100 as each complication arrives. You rated " +
      (given.length ? given.join(", then ") : "nothing yet") +
      ". The shaded region above the dashed line is confidence the evidence " +
      "does not support.";
  }

  /* --- Result ------------------------------------------------------------ */

  function report() {
    wb.progress.markAllDone();
    stepLabel.textContent = "What it can carry";
    taskHeading.textContent = "All three complications in";
    rating.hidden = true;
    wb.hide("#complication");

    var over = given.filter(function (v, i) { return v > STAGES[i].ceiling; }).length;
    var finalGap = given[given.length - 1] - STAGES[STAGES.length - 1].ceiling;
    var dropped = given[0] - given[given.length - 1];

    resultLead.textContent =
      "You started at " + given[0] + " and finished at " + given[given.length - 1] +
      (dropped > 0 ? ", coming down " + dropped + " points" : dropped < 0
        ? ", going up " + (-dropped) + " points" : ", not moving") +
      ". " +
      (over === 0
        ? "You stayed at or below the line the whole way, which is unusual and " +
          "means you were already treating a single case as weak evidence."
        : over === given.length
          ? "You were above the line at every stage. That is the common " +
            "pattern and it is the point of the exercise: the inference feels " +
            "stronger than it is, and it keeps feeling that way even as the " +
            "reasons against it arrive."
          : "You were above the line at " + over + " of the " + given.length +
            " stages.") +
      (finalGap > 0
        ? " At the end you were " + finalGap + " points above what this " +
          "evidence can support."
        : " By the end you had come below the line.");

    renderChart();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All three complications in. The summary is below.");
  }

  /* --- Wiring ------------------------------------------------------------ */

  lock.addEventListener("click", lockIn);

  function doReset() {
    stage = 0;
    given = [];
    confidence.value = "60";
    if (range) { range.sync(); }
    confidenceLabel.textContent = STAGES[0].prompt;
    rating.hidden = false;
    wb.hide("#complication");
    wb.hide("#chart-wrap");
    wb.hide("#synthesis");
    stepLabel.textContent = "The case";
    taskHeading.textContent = "One patient, one lesion, one deficit";
    wb.progress.reset();
    wb.progress.set(0);
  }

  wb.onReset(doReset);
  doReset();
})();
