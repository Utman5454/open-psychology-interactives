/**
 * The Same Genes, A Different Heritability  (Simplified Edition)
 *
 * Teaching job: heritability is a ratio whose denominator is the total
 * variation in a population. Change the denominator and heritability changes,
 * with no gene changing anywhere, which rules out the three readings of the
 * number that people most often reach for.
 *
 * The model is the ACE decomposition the full Twin-Study Simulator uses. The
 * variance in a trait is split into additive genetic (A), the environment
 * shared by members of a family (C), and the environment not shared (E), and
 * the expected twin correlations follow from how much of A and C a pair shares:
 *
 *     r(identical) = (varA + varC) / total
 *     r(fraternal) = (0.5 * varA + varC) / total
 *
 * Falconer's formulae run the other way:
 *
 *     h2 = 2 * (r_identical - r_fraternal)
 *     c2 = 2 * r_fraternal - r_identical
 *     e2 = 1 - r_identical
 *
 * and, in this model, recover the truth exactly. That is worth showing before
 * anything else: the arithmetic is not the problem, and the formulae are
 * correct under their assumptions.
 *
 * WHY EXPECTED CORRELATIONS RATHER THAN A SIMULATED SAMPLE. The full version
 * generates 250 fictional pairs per group, which is the right thing for a tool
 * that goes on to teach assumption violations. Here it actively obscured the
 * lesson: with a single fixed draw the realised genetic sharing among the
 * fraternal pairs is 0.5 plus sampling error, and a deviation of a few
 * hundredths biases the estimate in one direction at every setting of the
 * control, so the estimate missed the truth systematically and looked like a
 * defect rather than like noise. This edition therefore computes what the
 * model implies exactly, and the caution says in as many words that there is
 * no sampling error here and that real estimates are far less precise than two
 * decimal places suggest.
 *
 * THE ONE CONTROL moves varE only. varA is fixed at 1.00 and varC at 0.30 for
 * the whole life of the page, so every change in heritability the learner sees
 * is a change in the denominator. Across the range of the control heritability
 * runs from about 0.19 to about 0.67.
 *
 * Deliberate simplifications, all stated in the caution: no sampling error; no
 * gene-environment interaction and no gene-environment correlation, both of
 * which are real and which this decomposition assigns elsewhere; and the
 * assumption violations that the longer version makes movable are simply true
 * here.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  /* Fixed for the life of the page. The point of the activity is that
     heritability moves anyway. */
  var VAR_GENETIC = 1.00;
  var VAR_SHARED = 0.30;

  var MIN_ENV = 0.20, MAX_ENV = 4.00;
  var START_ENV = 1.00;

  function components(varEnv) {
    var total = VAR_GENETIC + VAR_SHARED + varEnv;
    return {
      genetic: VAR_GENETIC,
      shared: VAR_SHARED,
      nonShared: varEnv,
      total: total,
      h2: VAR_GENETIC / total,
      c2: VAR_SHARED / total,
      e2: varEnv / total
    };
  }

  /** Expected correlation between members of a pair sharing `shareA` of the
      additive genetic variance and all of the shared environment. */
  function expectedCorrelation(varEnv, shareA) {
    var c = components(varEnv);
    return (shareA * c.genetic + c.shared) / c.total;
  }

  function falconer(varEnv) {
    var rIdentical = expectedCorrelation(varEnv, 1);
    var rFraternal = expectedCorrelation(varEnv, 0.5);
    return {
      rIdentical: rIdentical,
      rFraternal: rFraternal,
      h2: 2 * (rIdentical - rFraternal),
      c2: 2 * rFraternal - rIdentical,
      e2: 1 - rIdentical
    };
  }

  function varEnv() { return Number(envInput.value); }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardSim;
  var envInput, readout, chart, chartDesc, studyBody, sentence;
  var narrowBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;

  var VERDICTS = {
    variance: { state: "correct", text:
      "Correct, and every qualification in that sentence is doing work. It is " +
      "about variation between people rather than about any person; it is " +
      "about one population rather than about the trait; and it holds only " +
      "across the range of environments that population happens to contain. " +
      "The simulator below changes the last of those and watches the number " +
      "move." },
    individual: { state: "incorrect", text:
      "This is the commonest reading and there is no such quantity. Asking " +
      "what proportion of one person's height was caused by their genes is " +
      "like asking what proportion of a rectangle's area was caused by its " +
      "width. Heritability is about the spread of a trait across people, and " +
      "an individual has no spread." },
    fixed: { state: "incorrect", text:
      "Heritability says nothing about whether a trait can be changed. The " +
      "simulator below makes the point in the sharpest available way: the " +
      "whole demonstration consists of changing the environment, and doing so " +
      "RAISES heritability rather than lowering it. A trait can be highly " +
      "heritable and thoroughly changeable at the same time." },
    genes: { state: "incorrect", text:
      "Heritability is estimated without identifying any gene at all. The " +
      "twin-study arithmetic below uses two correlations and nothing else, " +
      "and it would give the same answer in 1930 as today." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "variance") {
      wb.choices.mark(options.querySelector('[data-choice="variance"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardSim);
    render();
    wb.scrollTo(cardSim);
    wb.focus(envInput);
    wb.announce("The simulator is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 120, RIGHT = 760, TOP = 96, BAR = 54;
  /* The axis is fixed at the largest total the control can produce, so the bar
     genuinely gets longer rather than being rescaled to look the same. */
  var MAX_TOTAL = VAR_GENETIC + VAR_SHARED + MAX_ENV;

  var SEGMENTS = [
    { key: "genetic", name: "Genetic variation", colour: "#1C7293" },
    { key: "shared", name: "Shared environment", colour: "#9E7318" },
    { key: "nonShared", name: "Non-shared environment", colour: "#25634F" }
  ];

  function render() {
    var c = components(varEnv());
    wb.clearFigure(chart);
    var height = TOP + BAR + 132;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (v) { return LEFT + (v / MAX_TOTAL) * (RIGHT - LEFT); };

    [0, 1, 2, 3, 4, 5].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: xOf(v).toFixed(1), y1: TOP - 14, x2: xOf(v).toFixed(1),
        y2: (TOP + BAR + 14).toFixed(1), class: "plot__axis", opacity: 0.55
      }));
      var tick = svg("text", {
        x: xOf(v).toFixed(1), y: TOP - 22, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = v.toFixed(0);
      chart.appendChild(tick);
    });

    var title = svg("text", { x: 6, y: TOP - 52, class: "plot__label" });
    title.textContent = "All the variation between people, in units of variance";
    chart.appendChild(title);

    var at = 0;
    var keyY = TOP + BAR + 52;
    SEGMENTS.forEach(function (segment, i) {
      var value = c[segment.key];
      chart.appendChild(svg("rect", {
        x: xOf(at).toFixed(1), y: TOP, width: (xOf(at + value) - xOf(at)).toFixed(1),
        height: BAR, fill: segment.colour
      }));
      at += value;

      /* A key below the plot rather than labels inside the segments, which
         become too narrow to hold text at one end of the control's range. */
      var swatchX = 6 + i * 300;
      chart.appendChild(svg("rect", {
        x: swatchX, y: keyY - 11, width: 14, height: 14, fill: segment.colour
      }));
      var label = svg("text", { x: swatchX + 22, y: keyY, class: "plot__sub" });
      label.textContent = segment.name + " " + value.toFixed(2);
      chart.appendChild(label);
    });

    chart.appendChild(svg("line", {
      x1: xOf(c.total).toFixed(1), y1: TOP - 14, x2: xOf(c.total).toFixed(1),
      y2: (TOP + BAR + 14).toFixed(1), stroke: "#1A2744", "stroke-width": 2
    }));
    var totalLabel = svg("text", {
      x: (xOf(c.total) + 10).toFixed(1), y: (TOP + BAR / 2 + 4).toFixed(1),
      class: "plot__sub plot__over"
    });
    totalLabel.textContent = "total " + c.total.toFixed(2);
    chart.appendChild(totalLabel);

    var caption = svg("text", { x: 6, y: keyY + 34, class: "plot__tick" });
    caption.textContent = "Heritability is the first segment divided by the whole bar: " +
      c.genetic.toFixed(2) + " out of " + c.total.toFixed(2) + ", which is " + c.h2.toFixed(2) + ".";
    chart.appendChild(caption);

    describe(c);
    readouts(c);
    study(c);
  }

  function describe(c) {
    chartDesc.textContent =
      "A single horizontal bar showing all the variation between people in " +
      "this population, divided into three segments: genetic variation " +
      c.genetic.toFixed(2) + ", shared environment " + c.shared.toFixed(2) +
      " and non-shared environment " + c.nonShared.toFixed(2) + ", totalling " +
      c.total.toFixed(2) + ". The genetic segment is the same length at every " +
      "setting of the control. Heritability is that segment as a share of the " +
      "whole, which is " + c.h2.toFixed(2) + " here, against " +
      components(START_ENV).h2.toFixed(2) + " at the setting the page opened on.";
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

  function readouts(c) {
    readout.textContent = "";
    readout.appendChild(tile("Heritability", c.h2.toFixed(2),
      "the genetic segment as a share of the whole bar"));
    readout.appendChild(tile("Genetic variation", c.genetic.toFixed(2),
      "unchanged at every setting of the control", "correct"));
    readout.appendChild(tile("All the variation there is", c.total.toFixed(2),
      "this is the number the slider moves"));
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function study(c) {
    var f = falconer(varEnv());
    studyBody.textContent = "";
    [
      ["Correlation between identical pairs", f.rIdentical.toFixed(3), "", ""],
      ["Correlation between fraternal pairs", f.rFraternal.toFixed(3), "", ""],
      ["Genetic share of the variation", "", f.h2.toFixed(3), c.h2.toFixed(3)],
      ["Shared environment share", "", f.c2.toFixed(3), c.c2.toFixed(3)],
      ["Non-shared environment share", "", f.e2.toFixed(3), c.e2.toFixed(3)]
    ].forEach(function (row) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", row[0], "row"));
      tr.appendChild(cell("td", row[1] || "not applicable"));
      tr.appendChild(cell("td", row[2] || "not applicable"));
      tr.appendChild(cell("td", row[3] || "not applicable"));
      studyBody.appendChild(tr);
    });

    sentence.textContent =
      "At this setting a twin study of this population would report a " +
      "heritability of " + f.h2.toFixed(2) + ". The same study run on the " +
      "same genes with circumstances as alike as this page allows would " +
      "report " + components(MIN_ENV).h2.toFixed(2) + ", and with " +
      "circumstances as varied as it allows, " +
      components(MAX_ENV).h2.toFixed(2) + ". All three are correct.";
  }

  /* ------------------------------------------------------------- guidance */

  function narrow() {
    var before = components(varEnv());
    envInput.value = MIN_ENV.toFixed(2);
    moves = 2;
    explainBtn.disabled = false;
    onSlide();
    var after = components(MIN_ENV);
    noteText.textContent =
      "Everybody's circumstances are now nearly the same as everybody else's, " +
      "and the heritability of the trait has gone from " + before.h2.toFixed(2) +
      " to " + after.h2.toFixed(2) + ". Nothing genetic changed: the first " +
      "segment of the bar is still " + after.genetic.toFixed(2) + ", exactly " +
      "as it was. What changed is that there is less of everything else to " +
      "divide by. Notice which way it went. Making the environment more equal " +
      "made the trait MORE heritable, which is the opposite of what the word " +
      "usually suggests, and it is what you should expect: if everyone's " +
      "circumstances were identical, every difference left between them would " +
      "have to come from somewhere else.";
    wb.show(note);
    wb.announce("Circumstances made much more alike. Heritability is now " +
      after.h2.toFixed(2) + ", with the genetic variation unchanged at " +
      after.genetic.toFixed(2) + ".");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="env"]');
    if (output) { output.textContent = Number(envInput.value).toFixed(2); }
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var c = components(varEnv());
    resultLead.textContent =
      "Heritability here is " + c.h2.toFixed(2) + ". Across the whole range of " +
      "the control it runs from " + components(MAX_ENV).h2.toFixed(2) + " to " +
      components(MIN_ENV).h2.toFixed(2) + ", and the amount of genetic " +
      "variation is " + VAR_GENETIC.toFixed(2) + " at every one of those " +
      "settings, including this one.";
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
    cardSim = wb.root.querySelector("#card-sim");
    envInput = wb.root.querySelector("#env");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    studyBody = wb.root.querySelector("#study-body");
    sentence = wb.root.querySelector("#sentence");
    narrowBtn = wb.root.querySelector("#narrow");
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
    envInput.addEventListener("input", onSlide);
    envInput.addEventListener("change", onSlide);
    narrowBtn.addEventListener("click", narrow);
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
      wb.hide(cardSim);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      envInput.value = START_ENV.toFixed(2);
      var output = wb.root.querySelector('output[for="env"]');
      if (output) { output.textContent = START_ENV.toFixed(2); }
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
