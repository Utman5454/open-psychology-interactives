/**
 * It Correlates. So What?  (Simplified Edition)
 *
 * Teaching job: "it correlates with the outcome" is a far weaker claim than
 * "it adds something we did not already have", and the first number can stay
 * put while the second collapses.
 *
 * The model is the one from the full Emotional-Intelligence Claims Laboratory,
 * cut to four measures. Each is a weighted sum of independent standard normal
 * sources, scaled to unit variance, so the model-implied correlation between
 * two measures is the sum of the products of their shared coefficients:
 *
 *     r(x, y) = Px*Py + Ax*Ay + Gx*Gy
 *
 * with P a dispositional source, A a source specific to handling feelings and
 * G a general cognitive one. The outcome loads on all three. The personality
 * questionnaire loads on P alone and the reasoning test on G alone, so the two
 * comparison measures are uncorrelated with each other, which keeps the
 * arithmetic of the base model transparent.
 *
 * THE ONE CONTROL sets the new questionnaire's loading on P, and its loading
 * on A follows from holding P squared plus A squared fixed. The measure
 * therefore keeps the same total amount of outcome-relevant content at every
 * setting, and only its COMPOSITION changes: more ordinary personality, less
 * anything else.
 *
 * WHAT THAT PRODUCES, and it is the whole activity:
 *
 *     the correlation with the outcome stays between 0.36 and 0.48
 *     what it adds beyond the two existing measures falls from about
 *     10.5 percentage points of explained variance to about 0.3
 *
 * The incremental figure is the multiple R squared of the outcome on all three
 * predictors minus the R squared on the two existing ones. Because the
 * reasoning test is orthogonal to both of the others, the three-predictor R
 * squared is its own squared correlation plus the two-predictor formula for
 * the remaining pair:
 *
 *     R2(1,3) = (r1y^2 + r3y^2 - 2*r1y*r3y*r13) / (1 - r13^2)
 *
 * THE CONTROL'S RANGE IS DELIBERATE. Incremental validity is robust to modest
 * overlap and collapses only when the overlap is large, which is a real
 * property of the arithmetic rather than something to engineer away. Over the
 * full space of the model most of the collapse happens in the last quarter,
 * and a slider spanning all of it would spend most of its travel doing
 * nothing. The range offered here starts where the effect begins to bite, and
 * the synthesis says in as many words that substantial overlap is not by
 * itself an objection.
 *
 * Deliberate simplifications, stated in the caution: every figure is a
 * population value with no sampling error, where real incremental validity is
 * estimated poorly at the sample sizes usually available; the comparison set is
 * chosen for the learner, and incremental validity is always relative to it;
 * and prediction is not the only reason to prefer a measure.
 *
 * On what is absent: all four measures are fictional descriptions of method
 * types, no published instrument is reproduced or paraphrased, and the page
 * takes no position on whether emotional intelligence exists. The argument is
 * about what a correlation licenses and would run identically for any
 * construct.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  /* Outcome loadings on the three sources. */
  var OUT = { P: 0.45, A: 0.40, G: 0.25 };

  var PERSONALITY_P = 0.95;
  var REASONING_G = 0.88;

  /* The new questionnaire's P squared plus A squared, held fixed so that only
     its composition changes and not how much signal it carries. */
  var CONTENT = 0.64;

  var MIN_OVERLAP = 0.38, MAX_OVERLAP = 0.76;

  function loadingP(overlap) { return overlap / PERSONALITY_P; }

  function loadingA(overlap) {
    var p = loadingP(overlap);
    return Math.sqrt(Math.max(0, CONTENT - p * p));
  }

  function newWithOutcome(overlap) {
    return loadingP(overlap) * OUT.P + loadingA(overlap) * OUT.A;
  }

  var PERSONALITY_WITH_OUTCOME = PERSONALITY_P * OUT.P;
  var REASONING_WITH_OUTCOME = REASONING_G * OUT.G;

  /* The reasoning test shares no source with either of the other predictors,
     so its contribution is separable and the rest is the two-predictor case. */
  function baseVarianceExplained() {
    return PERSONALITY_WITH_OUTCOME * PERSONALITY_WITH_OUTCOME +
      REASONING_WITH_OUTCOME * REASONING_WITH_OUTCOME;
  }

  function fullVarianceExplained(overlap) {
    var r1y = PERSONALITY_WITH_OUTCOME;
    var r3y = newWithOutcome(overlap);
    var r13 = overlap;
    var pair = (r1y * r1y + r3y * r3y - 2 * r1y * r3y * r13) / (1 - r13 * r13);
    return pair + REASONING_WITH_OUTCOME * REASONING_WITH_OUTCOME;
  }

  function increment(overlap) {
    return fullVarianceExplained(overlap) - baseVarianceExplained();
  }

  function overlap() { return Number(overlapInput.value); }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardLab;
  var overlapInput, readout, chart, chartDesc, matrixBody, matrixCaption, sentence;
  var maxBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;

  var VERDICTS = {
    depends: { state: "correct", text:
      "Correct. A correlation with an outcome tells you the measure carries " +
      "some information about it. Whether that information is NEW is a " +
      "different question, and it is answered by comparing what you can " +
      "predict with the measure against what you could already predict " +
      "without it. The laboratory below holds the advertised correlation " +
      "almost still while the answer to that second question collapses." },
    predicts: { state: "partial", text:
      "True, and it is the whole of what the finding shows. The difficulty is " +
      "that a great many things predict most outcomes worth predicting, " +
      "several of them already measured, and a new instrument competes with " +
      "those rather than with nothing. Watch what happens to this measure's " +
      "contribution while its correlation with the outcome barely moves." },
    valid: { state: "incorrect", text:
      "Relating to the right things is one strand of evidence for validity and " +
      "it is not sufficient on its own, because a measure of something else " +
      "entirely will relate to the right things if that something else does. " +
      "The demonstration below builds exactly such a measure." },
    useful: { state: "incorrect", text:
      "Usefulness is a comparison, not a property. A measure earns its place " +
      "by improving a decision that somebody would otherwise make with the " +
      "information they already have, and a correlation with an outcome says " +
      "nothing about that comparison because it was computed without " +
      "reference to it." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "depends") {
      wb.choices.mark(options.querySelector('[data-choice="depends"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardLab);
    render();
    wb.scrollTo(cardLab);
    wb.focus(overlapInput);
    wb.announce("The laboratory is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 120, RIGHT = 700, TOP = 58, BOTTOM = 310;
  var Y_MAX = 0.55;
  var ADVERTISED = "#C0434F";
  var ADDED = "#1C7293";

  function render() {
    var v = overlap();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 100));

    var xOf = function (o) {
      return LEFT + ((o - MIN_OVERLAP) / (MAX_OVERLAP - MIN_OVERLAP)) * (RIGHT - LEFT);
    };
    var yOf = function (y) { return BOTTOM - (y / Y_MAX) * (BOTTOM - TOP); };

    [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach(function (y) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(y).toFixed(1), x2: RIGHT, y2: yOf(y).toFixed(1),
        class: "plot__axis", opacity: y === 0 ? 0.9 : 0.45
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(y) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = y.toFixed(1);
      chart.appendChild(tick);
    });

    var yTitle = svg("text", { x: 6, y: TOP - 26, class: "plot__label" });
    yTitle.textContent = "A correlation, and a share of variance, on one scale";
    chart.appendChild(yTitle);

    [
      { colour: ADVERTISED, name: "Correlates with the outcome", fn: newWithOutcome },
      { colour: ADDED, name: "Adds beyond what we had", fn: increment }
    ].forEach(function (series) {
      var points = [];
      for (var o = MIN_OVERLAP; o <= MAX_OVERLAP + 1e-9; o += 0.01) {
        points.push(xOf(o).toFixed(1) + "," + yOf(series.fn(o)).toFixed(1));
      }
      chart.appendChild(svg("polyline", {
        points: points.join(" "), fill: "none",
        stroke: series.colour, "stroke-width": 3, "stroke-linejoin": "round"
      }));
      var label = svg("text", {
        x: (RIGHT + 12).toFixed(1),
        y: (yOf(series.fn(MAX_OVERLAP)) + 4).toFixed(1),
        class: "plot__sub", fill: series.colour
      });
      label.textContent = series.name;
      chart.appendChild(label);
    });

    var markX = xOf(v);
    chart.appendChild(svg("line", {
      x1: markX.toFixed(1), y1: TOP, x2: markX.toFixed(1), y2: BOTTOM,
      stroke: "#1A2744", "stroke-width": 2
    }));
    [
      { colour: ADVERTISED, value: newWithOutcome(v) },
      { colour: ADDED, value: increment(v) }
    ].forEach(function (point) {
      chart.appendChild(svg("circle", {
        cx: markX.toFixed(1), cy: yOf(point.value).toFixed(1), r: 6, fill: point.colour
      }));
    });

    [MIN_OVERLAP, 0.5, 0.62, MAX_OVERLAP].forEach(function (o) {
      var tick = svg("text", {
        x: xOf(o).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = o.toFixed(2);
      chart.appendChild(tick);
    });
    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "How strongly the new questionnaire correlates with the personality questionnaire";
    chart.appendChild(axis);

    describe(v);
    readouts(v);
    matrix(v);
  }

  function describe(v) {
    chartDesc.textContent =
      "Two lines across every version of the new measure. The correlation with " +
      "the outcome runs from " + newWithOutcome(MIN_OVERLAP).toFixed(2) +
      " to " + newWithOutcome(MAX_OVERLAP).toFixed(2) + " and stays within " +
      "that narrow band throughout. What the measure adds beyond the two " +
      "already available falls from " +
      (increment(MIN_OVERLAP) * 100).toFixed(1) + " percentage points of " +
      "explained variance to " + (increment(MAX_OVERLAP) * 100).toFixed(1) +
      ". At the version currently built the two are " +
      newWithOutcome(v).toFixed(2) + " and " +
      (increment(v) * 100).toFixed(1) + " percentage points.";
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

  function readouts(v) {
    var inc = increment(v);
    readout.textContent = "";
    readout.appendChild(tile("Correlates with the outcome",
      newWithOutcome(v).toFixed(2),
      "this is the number that gets advertised"));
    readout.appendChild(tile("Overlaps the personality questionnaire",
      v.toFixed(2), "which is the thing being varied"));
    readout.appendChild(tile("Adds beyond what we had",
      (inc * 100).toFixed(1) + " points",
      "of explained variance, over personality and reasoning together",
      inc >= 0.05 ? "correct" : (inc >= 0.02 ? "partial" : "incorrect")));
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function matrix(v) {
    matrixBody.textContent = "";
    [
      ["Personality questionnaire", PERSONALITY_WITH_OUTCOME, 1],
      ["Reasoning test", REASONING_WITH_OUTCOME, 0],
      ["The new questionnaire", newWithOutcome(v), v]
    ].forEach(function (row) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", row[0], "row"));
      tr.appendChild(cell("td", row[1].toFixed(2)));
      tr.appendChild(cell("td", row[2] === 1 ? "it is that questionnaire" : row[2].toFixed(2)));
      matrixBody.appendChild(tr);
    });

    matrixCaption.textContent =
      "All three measures correlate with the outcome, and the new one does so " +
      "at " + newWithOutcome(v).toFixed(2) + ". Read across the second row of " +
      "figures rather than down the first: the question is not whether the " +
      "new measure relates to the outcome but whether it relates to anything " +
      "the personality questionnaire does not already cover.";

    sentence.textContent =
      "Together, the personality questionnaire and the reasoning test explain " +
      (baseVarianceExplained() * 100).toFixed(1) + " per cent of the " +
      "differences between people in the outcome. Adding this version of the " +
      "new questionnaire takes that to " +
      (fullVarianceExplained(v) * 100).toFixed(1) + " per cent.";
  }

  /* ------------------------------------------------------------- guidance */

  function toMax() {
    var before = overlap();
    overlapInput.value = MAX_OVERLAP.toFixed(2);
    moves = 2;
    explainBtn.disabled = false;
    onSlide();
    noteText.textContent =
      "The new questionnaire now correlates " + MAX_OVERLAP.toFixed(2) +
      " with the personality questionnaire, which is to say it is largely the " +
      "same instrument under another name. Its correlation with the outcome " +
      "is " + newWithOutcome(MAX_OVERLAP).toFixed(2) + ", against " +
      newWithOutcome(before).toFixed(2) + " where you started, so the " +
      "advertised figure has barely moved. What it adds has gone from " +
      (increment(before) * 100).toFixed(1) + " percentage points to " +
      (increment(MAX_OVERLAP) * 100).toFixed(1) + ". Both versions of this " +
      "measure would be described in the same sentence in a press release, " +
      "and only one of them was worth building.";
    wb.show(note);
    wb.announce("Overlap raised to " + MAX_OVERLAP.toFixed(2) +
      ". The measure now adds " + (increment(MAX_OVERLAP) * 100).toFixed(1) +
      " percentage points.");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="overlap"]');
    if (output) { output.textContent = Number(overlapInput.value).toFixed(2); }
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var v = overlap();
    resultLead.textContent =
      "This version of the measure correlates " + newWithOutcome(v).toFixed(2) +
      " with the outcome and adds " + (increment(v) * 100).toFixed(1) +
      " percentage points beyond the two measures already available. Across " +
      "every version the slider offers, the first number stays between " +
      Math.min(newWithOutcome(MIN_OVERLAP), newWithOutcome(MAX_OVERLAP)).toFixed(2) +
      " and 0.48, and the second runs from " +
      (increment(MIN_OVERLAP) * 100).toFixed(1) + " points to " +
      (increment(MAX_OVERLAP) * 100).toFixed(1) + ".";
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
    cardLab = wb.root.querySelector("#card-lab");
    overlapInput = wb.root.querySelector("#overlap");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    matrixBody = wb.root.querySelector("#matrix-body");
    matrixCaption = wb.root.querySelector("#matrix-caption");
    sentence = wb.root.querySelector("#sentence");
    maxBtn = wb.root.querySelector("#overlapmax");
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
    overlapInput.addEventListener("input", onSlide);
    overlapInput.addEventListener("change", onSlide);
    maxBtn.addEventListener("click", toMax);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      moves = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLab);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      overlapInput.value = MIN_OVERLAP.toFixed(2);
      var output = wb.root.querySelector('output[for="overlap"]');
      if (output) { output.textContent = MIN_OVERLAP.toFixed(2); }
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
