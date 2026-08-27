/* =========================================================================
   What Is the Score Actually Made Of? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/12-recovery-plasticity-simulator/

   TEACHING JOB
   ------------
   A rising score is several different things added together, and only
   restitution means the underlying function has improved.

   WHAT IS PRESERVED
   -----------------
   The decomposition, and the comparison with a task the person never trained.
   The second is what makes the first testable rather than a taxonomy: the
   untrained task can only rise by the restitution band, so the gap between
   the two lines is everything that did not generalise.

   THE MODEL
   ---------
   Each contribution has its own time course over 24 months, all saturating:

       restitution    fast and early, largely done by about six months
       relearning     steady with practice, still climbing at two years
       compensation   slow to start, then substantial
       practice       almost immediate, small, flat thereafter

       trained(t)   = base + restitution(t) + relearning(t)
                            + compensation(t) + practice(t)
       untrained(t) = base + restitution(t)

   WHAT WAS REDUCED
   ----------------
   Five simulated people to compare, the staged experiments on each
   contribution separately, and the treatment of plateaus.

   HONESTY, ON THE PAGE
   --------------------
   The bands are drawn as separable and additive and they are not: relearning
   and restitution interact, compensation can drive neural change, and
   practice effects are not constant. The caution says so, and also says the
   untrained task is an idealisation.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var MONTHS = 24;
  var BASE = 20;

  var COMPONENTS = [
    {
      key: "restitution", label: "Restitution", colour: "#25634F",
      hint: "The damaged function itself working better.",
      /* Fast and early: most of it inside six months. */
      shape: function (t) { return 1 - Math.exp(-t / 3.2); }
    },
    {
      key: "relearning", label: "Relearning", colour: "#1C7293",
      hint: "Getting better at this particular task.",
      shape: function (t) { return 1 - Math.exp(-t / 9); }
    },
    {
      key: "compensation", label: "Compensation", colour: "#9E7318",
      hint: "Doing it a different way that works.",
      /* Slow to start, because a strategy has to be found first. */
      shape: function (t) { return 1 / (1 + Math.exp(-(t - 10) / 3.4)); }
    },
    {
      key: "practice", label: "Practice effect", colour: "#5F6878",
      hint: "Improvement from having done the test before.",
      shape: function (t) { return t > 0 ? 1 : 0; }
    }
  ];

  var componentBox = document.getElementById("components");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var worstCase = document.getElementById("worst-case");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var amounts = {};
  var ranges = [];
  var changes = 0;

  function contribution(c, t) { return amounts[c.key] * c.shape(t); }
  function trained(t) {
    return BASE + COMPONENTS.reduce(function (a, c) { return a + contribution(c, t); }, 0);
  }
  function untrained(t) {
    return BASE + contribution(COMPONENTS[0], t);
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildControls() {
    componentBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "How much each contributes";
    componentBox.appendChild(legend);
    ranges = [];
    COMPONENTS.forEach(function (c) {
      var wrap = document.createElement("div");
      wrap.className = "control";
      var head = document.createElement("div");
      head.className = "control__header";
      var label = document.createElement("label");
      label.className = "control__label";
      label.setAttribute("for", "amt-" + c.key);
      label.textContent = c.label;
      var out = document.createElement("output");
      out.className = "control__value";
      out.setAttribute("for", "amt-" + c.key);
      out.textContent = String(amounts[c.key]);
      head.appendChild(label); head.appendChild(out);
      var input = document.createElement("input");
      input.type = "range";
      input.id = "amt-" + c.key;
      input.min = "0"; input.max = "30"; input.step = "1";
      input.value = String(amounts[c.key]);
      var hint = document.createElement("p");
      hint.className = "control__hint";
      hint.textContent = c.hint;
      wrap.appendChild(head); wrap.appendChild(input); wrap.appendChild(hint);
      componentBox.appendChild(wrap);
      input.addEventListener("input", function () {
        amounts[c.key] = Number(input.value);
        out.textContent = input.value;
        render();
      });
      input.addEventListener("change", function () {
        amounts[c.key] = Number(input.value);
        out.textContent = input.value;
        changes += 1;
        if (changes >= 2) { explain.disabled = false; }
        wb.hide("#note");
        refresh(true);
      });
      ranges.push({ input: input, out: out, key: c.key });
    });
  }

  function syncControls() {
    ranges.forEach(function (r) {
      r.input.value = String(amounts[r.key]);
      r.out.textContent = r.input.value;
    });
  }

  /* --- The figure -------------------------------------------------------- */

  function render() {
    var LEFT = 96, RIGHT = 720, TOP = 54, BOTTOM = 320;
    var TOP_SCORE = 140;
    var X = function (t) { return LEFT + (t / MONTHS) * (RIGHT - LEFT); };
    var Y = function (v) { return BOTTOM - (v / TOP_SCORE) * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 92));

    var title = svg("text", { x: 24, y: 24, class: "plot__label" });
    title.textContent = "Score over twenty-four months";
    chart.appendChild(title);

    /* Stacked bands, drawn from the bottom up so each one's thickness is its
       own contribution rather than a running total. */
    var lower = [];
    var t;
    for (t = 0; t <= MONTHS; t += 1) { lower.push(BASE); }

    COMPONENTS.forEach(function (c) {
      var upper = [];
      for (t = 0; t <= MONTHS; t += 1) {
        upper.push(lower[t] + contribution(c, t));
      }
      var d = "M " + X(0).toFixed(1) + " " + Y(lower[0]).toFixed(1);
      for (t = 0; t <= MONTHS; t += 1) {
        d += " L " + X(t).toFixed(1) + " " + Y(upper[t]).toFixed(1);
      }
      for (t = MONTHS; t >= 0; t -= 1) {
        d += " L " + X(t).toFixed(1) + " " + Y(lower[t]).toFixed(1);
      }
      d += " Z";
      chart.appendChild(svg("path", {
        d: d, fill: c.colour, "fill-opacity": "0.45", stroke: "none"
      }));
      lower = upper;
    });

    /* The trained line. */
    var trainedPath = "";
    for (t = 0; t <= MONTHS; t += 1) {
      trainedPath += (t === 0 ? "M " : "L ") + X(t).toFixed(1) + " " + Y(trained(t)).toFixed(1);
    }
    chart.appendChild(svg("path", {
      d: trainedPath, fill: "none", stroke: "#1A2744", "stroke-width": "3"
    }));
    /* The untrained line. */
    var untrainedPath = "";
    for (t = 0; t <= MONTHS; t += 1) {
      untrainedPath += (t === 0 ? "M " : "L ") + X(t).toFixed(1) + " " + Y(untrained(t)).toFixed(1);
    }
    chart.appendChild(svg("path", {
      d: untrainedPath, fill: "none", stroke: "#C0434F",
      "stroke-width": "3", "stroke-dasharray": "8 5"
    }));

    /* Labels at the right. When everything that contributes is restitution the
       two lines coincide exactly, and two labels at the same height would sit
       on top of each other, so that case gets one label saying so. */
    var tEnd = MONTHS;
    var apart = Math.abs(Y(trained(tEnd)) - Y(untrained(tEnd)));
    if (apart < 22) {
      var both = svg("text", {
        x: (RIGHT + 14).toFixed(1), y: (Y(trained(tEnd)) + 4).toFixed(1),
        class: "plot__sub", fill: "#1A2744"
      });
      both.textContent = "both lines, one on the other";
      chart.appendChild(both);
    } else {
      var tag1 = svg("text", {
        x: (RIGHT + 14).toFixed(1), y: (Y(trained(tEnd)) + 4).toFixed(1),
        class: "plot__sub", fill: "#1A2744"
      });
      tag1.textContent = "the task they practise";
      chart.appendChild(tag1);
      var tag2 = svg("text", {
        x: (RIGHT + 14).toFixed(1), y: (Y(untrained(tEnd)) + 4).toFixed(1),
        class: "plot__sub", fill: "#C0434F"
      });
      tag2.textContent = "a task they never practised";
      chart.appendChild(tag2);
    }

    chart.appendChild(svg("line", { x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    [0, 6, 12, 18, 24].forEach(function (m) {
      var tick = svg("text", { x: X(m).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(m);
      chart.appendChild(tick);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Months since the injury";
    chart.appendChild(cap);
    [0, 70, 140].forEach(function (v) {
      var tick = svg("text", { x: LEFT - 10, y: (Y(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick" });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    /* The key runs along the bottom, not down the right-hand gutter. The two
       line labels live in that gutter and their vertical position follows the
       scores, so a key there collides with them at some settings. */
    var KEY_Y = BOTTOM + 70;
    var KEY_STEP = (RIGHT - LEFT) / COMPONENTS.length;
    COMPONENTS.forEach(function (c, i) {
      var x = LEFT + i * KEY_STEP;
      chart.appendChild(svg("rect", {
        x: x, y: KEY_Y - 10, width: 16, height: 12, rx: 2,
        fill: c.colour, "fill-opacity": "0.55"
      }));
      var t2 = svg("text", { x: x + 22, y: KEY_Y, class: "plot__sub" });
      t2.textContent = c.label;
      chart.appendChild(t2);
    });

    describe();
  }

  function describe() {
    var end = MONTHS;
    chartDesc.textContent =
      "Two lines over twenty-four months, starting from a score of " + BASE +
      ". The task the person practises reaches " + Math.round(trained(end)) +
      ", built from restitution " + Math.round(contribution(COMPONENTS[0], end)) +
      ", relearning " + Math.round(contribution(COMPONENTS[1], end)) +
      ", compensation " + Math.round(contribution(COMPONENTS[2], end)) +
      " and practice " + Math.round(contribution(COMPONENTS[3], end)) +
      ". A task of the same kind that they never practised reaches only " +
      Math.round(untrained(end)) + ", because only restitution can raise it. " +
      "The gap between the two at two years is " +
      Math.round(trained(end) - untrained(end)) + " points.";
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderReadout() {
    var end = MONTHS;
    var gained = trained(end) - BASE;
    var generalised = untrained(end) - BASE;
    var share = gained > 0 ? generalised / gained : 0;
    readout.textContent = "";
    tile("Gain on the trained task", "+" + Math.round(gained),
      "from " + BASE + " to " + Math.round(trained(end)) + " over two years");
    tile("Gain on the untrained task", "+" + Math.round(generalised),
      "the only part that generalised");
    tile("Share that generalised", Math.round(100 * share) + "%",
      share >= 0.6 ? "most of the improvement is the function itself"
        : share <= 0.3 ? "most of the improvement stops at this task"
        : "a mixture of both");
  }

  function tile(caption, figure, noteText) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = noteText;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);
  }

  function renderSentence() {
    var end = MONTHS;
    var gained = trained(end) - BASE;
    var generalised = untrained(end) - BASE;
    if (gained < 3) {
      sentence.textContent = "Nothing much is contributing, so neither line " +
        "moves. Raise one of the four and watch what happens to the dashed line.";
      return;
    }
    var share = generalised / gained;
    if (share >= 0.6) {
      sentence.textContent = "Most of the rise is restitution, so the untrained " +
        "task rises with the trained one. This is the case where you can say " +
        "the underlying function has improved, and expect the gain wherever " +
        "that function is needed.";
      return;
    }
    if (share <= 0.3) {
      sentence.textContent = "The trained task has climbed " + Math.round(gained) +
        " points and the untrained one only " + Math.round(generalised) +
        ". Almost all of the improvement stops at the edge of the task that was " +
        "practised. The trained score on its own could not have told you that.";
      return;
    }
    sentence.textContent = "Some of the rise generalises and some does not. " +
      "The dashed line is the part that would show up anywhere the function is " +
      "needed; the gap above it is the part that belongs to this task.";
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    if (announce) {
      wb.announce("Trained task " + Math.round(trained(MONTHS)) +
        ", untrained task " + Math.round(untrained(MONTHS)) + ".");
    }
  }

  /* --- The instructive case ---------------------------------------------- */

  worstCase.addEventListener("click", function () {
    amounts.restitution = 4;
    amounts.relearning = 26;
    amounts.compensation = 24;
    amounts.practice = 8;
    syncControls();
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "This is as good as a recovery graph ever looks: a steady climb from " +
      BASE + " to " + Math.round(trained(MONTHS)) +
      " over two years, with no plateau. It is also almost entirely relearning, " +
      "compensation and practice. The dashed line, a task of the same kind " +
      "that was never practised, has barely moved. If you were asked whether " +
      "the underlying problem was resolving, the trained line would say yes and " +
      "it would be wrong. None of this means the two years were wasted: the " +
      "person really is better at the thing they practised, and compensation " +
      "is a real solution. It means the answer to what happens next is " +
      "different.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("A large rise that barely generalises.");
  });

  explain.addEventListener("click", function () {
    var end = MONTHS;
    resultLead.textContent =
      "On your current mixture the trained task reaches " +
      Math.round(trained(end)) + " and the untrained one " +
      Math.round(untrained(end)) + ", so " +
      Math.round(100 * (untrained(end) - BASE) / Math.max(1, trained(end) - BASE)) +
      " per cent of the improvement generalised.";
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    amounts = { restitution: 14, relearning: 14, compensation: 10, practice: 5 };
    changes = 0;
    buildControls();
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
