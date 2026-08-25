/**
 * Three Findings, Two Lines  (Simplified Edition)
 *
 * Teaching job: the same two straight lines support diathesis-stress,
 * differential susceptibility or vantage sensitivity depending only on which
 * part of the environmental range a study happened to sample.
 *
 * The model is the one from the full Gene by Environment Interaction
 * Visualiser, with the crossover fixed and only the observation window movable:
 *
 *     outcome(group, x) = slope(group) * (x - CROSSOVER)
 *
 * with x running from -1, most adverse, to +1, most supportive. The
 * higher-sensitivity group has the steeper slope, so it does worse than the
 * other at the adverse end and better at the supportive end, and the two lines
 * cross at CROSSOVER, which is zero.
 *
 * The pattern a study would report follows from the sign of the gap between
 * the groups at the two edges of its window, and nothing else:
 *
 *     negative at both edges          diathesis-stress
 *     changes sign inside the window  differential susceptibility
 *     positive at both edges          vantage sensitivity
 *
 * With the window width fixed at 0.8 the control reaches all three, and each
 * is a correct description of what its own window contains. That is the whole
 * activity: three accurate reports, three different theories, one pair of
 * lines.
 *
 * TWO CHOICES IN THE DRAWING THAT MATTER. The lines are drawn across the WHOLE
 * range at every setting, faint outside the window, so the learner can see
 * what the study did not measure. A real study cannot see its own faint
 * stretch, which is the point, and drawing only the window would have hidden
 * it exactly as effectively as the study does. And the scatter is drawn from
 * one fixed set of residuals, scaled in place, so moving the window slides a
 * window over a fixed dataset rather than redrawing new data each time; new
 * draws would make the picture jump and the learner would be watching noise.
 *
 * On what is absent, which is deliberate throughout: no gene is named and no
 * genotype appears, the grouping variable being a fictional sensitivity score;
 * there is no disorder, diagnosis or clinical risk estimate; the outcome axis
 * is unnamed and standardised; and a slope is an average tendency across a
 * group, never a prediction about a person.
 *
 * Deliberate simplifications, stated in the caution: both lines are perfectly
 * straight, there is no confounding and very little error, and the crossover
 * and slopes are fixed. Real data are far messier and the three accounts are
 * genuinely hard to tell apart.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var CROSSOVER = 0;
  var WINDOW = 0.8;
  var FULL_WINDOW = 2.0;
  var SEED = 8123;
  var POINTS = 56;
  var NOISE = 0.18;

  var GROUPS = [
    { key: "higher", name: "Higher sensitivity", slope: 1.20, colour: "#C0434F" },
    { key: "lower", name: "Lower sensitivity", slope: 0.35, colour: "#1C7293" }
  ];

  var PATTERNS = {
    diathesis: {
      name: "sensitivity as a vulnerability",
      blurb: "worse in poor conditions, no better in good ones"
    },
    differential: {
      name: "sensitivity working both ways",
      blurb: "worse in poor conditions and better in good ones"
    },
    vantage: {
      name: "sensitivity as an advantage",
      blurb: "no difference in poor conditions, a larger benefit in good ones"
    }
  };

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* One fixed dataset. Moving the window slides a window over these people;
     it does not recruit new ones. */
  var SAMPLE = (function () {
    var random = mulberry32(SEED);
    var out = [];
    for (var i = 0; i < POINTS; i += 1) {
      var x = -1 + 2 * ((i + 0.5) / POINTS);
      GROUPS.forEach(function (group, g) {
        var u = Math.max(random(), 1e-12);
        var v = random();
        var z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        out.push({ group: g, x: x, residual: z * NOISE });
      });
    }
    return out;
  }());

  function outcome(group, x) {
    return group.slope * (x - CROSSOVER);
  }

  function gapAt(x) {
    return outcome(GROUPS[0], x) - outcome(GROUPS[1], x);
  }

  function windowFor(centre, width) {
    var half = width / 2;
    return { from: Math.max(-1, centre - half), to: Math.min(1, centre + half) };
  }

  function patternFor(win) {
    var low = gapAt(win.from);
    var high = gapAt(win.to);
    if (low < 0 && high > 0) { return "differential"; }
    if (low >= 0 && high >= 0) { return "vantage"; }
    return "diathesis";
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardExplore;
  var centreInput, readout, chart, chartDesc, sentence;
  var widenBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;
  var width = WINDOW;

  function centre() { return Number(centreInput.value) / 100; }
  function currentWindow() { return windowFor(centre(), width); }

  var VERDICTS = {
    cannot: { state: "correct", text:
      "Correct. Within the range that was sampled the description given is " +
      "accurate, and it becomes a claim about sensitivity only by assuming " +
      "the lines carry on doing the same thing past the edge of the data. " +
      "The explorer below shows the same two lines measured over three " +
      "different windows, and each window supports a different theory." },
    diathesis: { state: "partial", text:
      "It is an accurate description of what was measured, which is why this " +
      "is the answer most studies of this kind arrive at. What it is not is a " +
      "finding about sensitivity, because the sentence \"no better in good " +
      "conditions\" is about conditions the study did not observe. Widen the " +
      "window below and watch what happens to it." },
    differential: { state: "incorrect", text:
      "As it happens this is true of the underlying lines, and the study " +
      "quoted gives you no reason to think so. It converged towards the " +
      "better end of what it measured, which is equally consistent with the " +
      "two groups meeting there and staying together. Being right for no " +
      "reason is not better than being wrong." },
    none: { state: "incorrect", text:
      "There is an interaction here: the two groups have different slopes, " +
      "and that is what an interaction is. The difficulty is not whether one " +
      "exists but what it means, and that turns on a stretch of the " +
      "environment nobody measured." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "cannot") {
      wb.choices.mark(options.querySelector('[data-choice="cannot"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardExplore);
    render();
    wb.scrollTo(cardExplore);
    wb.focus(centreInput);
    wb.announce("The explorer is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 130, RIGHT = 720, TOP = 60, BOTTOM = 330;
  var Y_MIN = -1.6, Y_MAX = 1.6;

  function render() {
    var win = currentWindow();
    var pattern = patternFor(win);
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 100));

    var xOf = function (x) { return LEFT + ((x + 1) / 2) * (RIGHT - LEFT); };
    var yOf = function (y) {
      return BOTTOM - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
    };

    /* The measured window, drawn behind everything. */
    chart.appendChild(svg("rect", {
      x: xOf(win.from).toFixed(1), y: TOP,
      width: (xOf(win.to) - xOf(win.from)).toFixed(1),
      height: (BOTTOM - TOP).toFixed(1),
      fill: "#1A2744", opacity: 0.07
    }));

    [-1, 0, 1].forEach(function (y) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(y).toFixed(1), x2: RIGHT, y2: yOf(y).toFixed(1),
        class: "plot__axis", opacity: y === 0 ? 0.9 : 0.45
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(y) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = y === 0 ? "0" : (y > 0 ? "+1" : "-1");
      chart.appendChild(tick);
    });

    var yTitle = svg("text", { x: 6, y: TOP - 26, class: "plot__label" });
    yTitle.textContent = "Outcome, in standard deviations, on an unnamed measure";
    chart.appendChild(yTitle);

    /* Each line across the WHOLE range, faint outside the window. A study
       cannot see its own faint stretch; the reader of this page can. */
    GROUPS.forEach(function (group) {
      chart.appendChild(svg("line", {
        x1: xOf(-1).toFixed(1), y1: yOf(outcome(group, -1)).toFixed(1),
        x2: xOf(1).toFixed(1), y2: yOf(outcome(group, 1)).toFixed(1),
        stroke: group.colour, "stroke-width": 2, opacity: 0.28,
        "stroke-dasharray": "6 5"
      }));
      chart.appendChild(svg("line", {
        x1: xOf(win.from).toFixed(1), y1: yOf(outcome(group, win.from)).toFixed(1),
        x2: xOf(win.to).toFixed(1), y2: yOf(outcome(group, win.to)).toFixed(1),
        stroke: group.colour, "stroke-width": 4, "stroke-linecap": "round"
      }));
    });

    SAMPLE.forEach(function (point) {
      if (point.x < win.from || point.x > win.to) { return; }
      var group = GROUPS[point.group];
      chart.appendChild(svg("circle", {
        cx: xOf(point.x).toFixed(1),
        cy: yOf(outcome(group, point.x) + point.residual).toFixed(1),
        r: 3.6, fill: group.colour, opacity: 0.75
      }));
    });

    /* Group labels at the right-hand end of each line, nudged apart. */
    var ends = GROUPS.map(function (group) {
      return { group: group, y: yOf(outcome(group, 1)) };
    });
    var spread = wb.spreadLabels(ends.map(function (e) { return e.y; }), 20, TOP, BOTTOM);
    ends.forEach(function (e, i) {
      var label = svg("text", {
        x: (xOf(1) + 12).toFixed(1), y: (spread[i] + 4).toFixed(1),
        class: "plot__sub", fill: e.group.colour
      });
      label.textContent = e.group.name;
      chart.appendChild(label);
    });

    [
      { x: -1, text: "most adverse", anchor: "start" },
      { x: 1, text: "most supportive", anchor: "end" }
    ].forEach(function (mark) {
      var tick = svg("text", {
        x: xOf(mark.x).toFixed(1), y: BOTTOM + 24,
        "text-anchor": mark.anchor, class: "plot__tick"
      });
      tick.textContent = mark.text;
      chart.appendChild(tick);
    });
    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48,
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Quality of the environment. The shaded band is what this study measured.";
    chart.appendChild(axis);

    describe(win, pattern);
    readouts(win, pattern);
  }

  function describe(win, pattern) {
    chartDesc.textContent =
      "Two straight lines against environmental quality, drawn across the " +
      "whole range and solid only where this study measured, from " +
      win.from.toFixed(2) + " to " + win.to.toFixed(2) + " on a scale of " +
      "minus one to plus one. Inside that window the higher-sensitivity group " +
      "is " + describeGap(gapAt(win.from)) + " at the adverse edge and " +
      describeGap(gapAt(win.to)) + " at the supportive edge, which is the " +
      "pattern called " + PATTERNS[pattern].name + ": " +
      PATTERNS[pattern].blurb + ". Outside the window both lines carry on, " +
      "and they meet at the middle of the range.";
  }

  function describeGap(gap) {
    if (Math.abs(gap) < 0.005) { return "level with the other group"; }
    return (gap > 0 ? "above the other group by " : "below the other group by ") +
      Math.abs(gap).toFixed(2);
  }

  function tile(label, value, noteText, state) {
    var li = global.document.createElement("li");
    li.className = "result";
    var l = global.document.createElement("p");
    l.className = "result__label";
    l.textContent = label;
    var v = global.document.createElement("p");
    v.className = "result__value big";
    v.textContent = value;
    var n = global.document.createElement("span");
    n.className = "result__note";
    n.textContent = noteText;
    li.appendChild(l); li.appendChild(v); li.appendChild(n);
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function readouts(win, pattern) {
    readout.textContent = "";
    readout.appendChild(tile("What this study would report",
      PATTERNS[pattern].name, PATTERNS[pattern].blurb));
    readout.appendChild(tile("Gap at the adverse edge", gapAt(win.from).toFixed(2),
      "higher-sensitivity group minus the other, at " + win.from.toFixed(2)));
    readout.appendChild(tile("Gap at the supportive edge", gapAt(win.to).toFixed(2),
      "higher-sensitivity group minus the other, at " + win.to.toFixed(2)));

    var output = wb.root.querySelector('output[for="centre"]');
    if (output) {
      output.textContent = width >= FULL_WINDOW ? "the whole range"
        : (centre() <= -0.3 ? "the adverse end"
          : (centre() >= 0.3 ? "the supportive end" : "the middle"));
    }

    sentence.textContent =
      "Both slopes are the same at every setting: " +
      GROUPS[0].slope.toFixed(2) + " for the higher-sensitivity group and " +
      GROUPS[1].slope.toFixed(2) + " for the other, with the lines meeting at " +
      "the middle of the range. Only the window moved, and the name of the " +
      "finding changed with it.";
  }

  /* ------------------------------------------------------------- guidance */

  function toggleWiden() {
    var widening = width < FULL_WINDOW;
    width = widening ? FULL_WINDOW : WINDOW;
    moves = 2;
    explainBtn.disabled = false;
    render();
    widenBtn.textContent = widening
      ? "Narrow it back to one slice" : "Widen the study to the whole range";
    if (widening) {
      noteText.textContent =
        "Measured across the whole range, these two lines cross, and the " +
        "finding is that sensitivity works in both directions. Nothing about " +
        "the lines changed to bring that about. Slide the window back to the " +
        "adverse end and the same lines report a vulnerability; slide it to " +
        "the supportive end and they report an advantage. Three studies, " +
        "three published conclusions, one pair of lines, and each study " +
        "correct about what it measured.";
    } else {
      noteText.textContent =
        "Back to a single slice. Move it from one end of the range to the " +
        "other and watch the first tile change its mind twice, without any " +
        "line moving.";
    }
    wb.show(note);
    wb.announce(widening
      ? "Widened to the whole range. The finding is now sensitivity working both ways."
      : "Narrowed back to one slice.");
  }

  function onSlide() {
    /* Moving the window is a statement that you are looking at one slice
       again, so it takes the study back out of whole-range mode. */
    width = WINDOW;
    widenBtn.textContent = "Widen the study to the whole range";
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var win = currentWindow();
    var pattern = patternFor(win);
    resultLead.textContent =
      "Sampling from " + win.from.toFixed(2) + " to " + win.to.toFixed(2) +
      " of the environmental range, this study would report " +
      PATTERNS[pattern].name + ". Sampling only the adverse end it would " +
      "report " + PATTERNS[patternFor(windowFor(-0.6, WINDOW))].name +
      ", and only the supportive end, " +
      PATTERNS[patternFor(windowFor(0.6, WINDOW))].name + ". The two slopes " +
      "are " + GROUPS[0].slope.toFixed(2) + " and " + GROUPS[1].slope.toFixed(2) +
      " in all three cases.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardExplore = wb.root.querySelector("#card-explore");
    centreInput = wb.root.querySelector("#centre");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    sentence = wb.root.querySelector("#sentence");
    widenBtn = wb.root.querySelector("#widen");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    centreInput.addEventListener("input", onSlide);
    centreInput.addEventListener("change", onSlide);
    widenBtn.addEventListener("click", toggleWiden);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      moves = 0;
      width = WINDOW;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardExplore);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      widenBtn.textContent = "Widen the study to the whole range";
      centreInput.value = "-60";
      render();
    });

    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
