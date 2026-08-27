/**
 * Two Reasons to Agree  (Simplified Edition)
 *
 * Teaching job: normative and informational influence are told apart by what
 * moves each, and a conformity rate is not a finding without a context.
 *
 * The model is the two-route one from the full Conformity Under Context:
 *
 *     normative     = Bn * unanimityN * audience * identification * clarity
 *     informational = Bi * ambiguity * (0.4 + 0.6 * status) * unanimityI
 *     p             = 1 - (1 - normative) * (1 - informational)
 *
 * Two features do the teaching and both survive the cut:
 *
 *   AUDIENCE APPEARS ONLY IN THE NORMATIVE TERM. Making the response private
 *   collapses the normative route and leaves the informational one exactly
 *   where it was, which is the manipulation that distinguishes them.
 *
 *   UNANIMITY IS A STEP, NOT A HEADCOUNT. One confederate breaking ranks takes
 *   the normative multiplier from 1.00 to 0.30, because what has changed is
 *   not the arithmetic but whether another answer is sayable.
 *
 * IDENTIFICATION is the social-identity amendment the classic account does not
 * contain, and it is kept because a unanimous majority of people you do not
 * regard as comparable to yourself exerts much less pull than the number
 * suggests.
 *
 * THE DIAGNOSTIC COMPARISON, which the guided button runs, is the point of the
 * whole activity. Going private removes about twenty-one points of agreement
 * on the easy display and about eleven on the ambiguous one. Same manipulation,
 * half the effect, because in the second room most of the agreement is people
 * using each other as evidence and evidence does not care who is watching.
 *
 * WHAT WAS CUT. The continuous parameter sliders, the participant task, and the
 * simulation of a hundred individuals behind the group rate. Conditions are
 * offered as presets instead, so the learner compares rooms rather than tuning
 * coefficients, and every condition run stays in the table.
 *
 * WHAT THIS IS NOT. A replication. The parameters are printed so they can be
 * argued with, and no figure estimates anything. The classic findings are of
 * their time and place, conformity is not a defect being measured, and a group
 * average conceals a distribution; the page says all three.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var B_NORMATIVE = 0.68;
  var B_INFORMATIONAL = 0.75;

  /* Indexed by how many of the five others break with the majority. */
  var UNANIMITY_NORMATIVE = [1.00, 0.30, 0.22, 0.18];
  var UNANIMITY_INFORMATIONAL = [1.00, 0.60, 0.50, 0.45];

  var AUDIENCE = {
    aloud: { factor: 1.00, label: "aloud, in front of the group" },
    written: { factor: 0.35, label: "written, seen by the experimenter only" }
  };

  var BASE = {
    dissenters: 0, identification: 55, audience: "aloud",
    ambiguity: 5, status: 50, clarity: 90
  };

  var CONDITIONS = [
    { id: "classic", label: "Classic public unanimous", change: {},
      note: "An easy judgement, five unanimous others, answers given aloud. The set-up everybody remembers, and most rounds are still answered correctly." },
    { id: "ally", label: "One person disagrees first", change: { dissenters: 1 },
      note: "The majority is still four to one. The rate collapses anyway, because what has changed is not the arithmetic but whether another answer is sayable." },
    { id: "private", label: "Private written response", change: { audience: "written" },
      note: "Everything else identical to the classic condition. The normative route falls away and the informational one, which was small to begin with, does not move at all." },
    { id: "ambiguous", label: "Genuinely ambiguous display", change: { ambiguity: 92 },
      note: "Now the others are evidence rather than an audience, and the rate is higher than in any other condition here." },
    { id: "ambiguousPrivate", label: "Ambiguous display, answered privately",
      change: { ambiguity: 92, audience: "written" },
      note: "The same privacy that halved the classic condition barely dents this one, which is the clearest sign that a different route is doing the work." },
    { id: "outgroup", label: "A group they are not part of", change: { identification: 8 },
      note: "Five unanimous people answering aloud, and the rate falls a long way. The classic two-route account has no term for this; social identity theory is the amendment that supplies one." }
  ];

  function valuesFor(condition) {
    var v = {};
    Object.keys(BASE).forEach(function (k) { v[k] = BASE[k]; });
    Object.keys(condition.change).forEach(function (k) { v[k] = condition.change[k]; });
    return v;
  }

  function routes(v) {
    var normative = B_NORMATIVE *
      UNANIMITY_NORMATIVE[v.dissenters] *
      AUDIENCE[v.audience].factor *
      (v.identification / 100) *
      (v.clarity / 100);
    var informational = B_INFORMATIONAL *
      (v.ambiguity / 100) *
      (0.4 + 0.6 * (v.status / 100)) *
      UNANIMITY_INFORMATIONAL[v.dissenters];
    return {
      normative: normative,
      informational: informational,
      total: 1 - (1 - normative) * (1 - informational)
    };
  }

  function resultFor(condition) { return routes(valuesFor(condition)); }

  function conditionById(id) {
    var found = null;
    CONDITIONS.forEach(function (c) { if (c.id === id) { found = c; } });
    return found;
  }

  /* The two comparisons that make the argument, computed rather than written
     down so the prose cannot drift from the parameters. */
  function privacyDrop(easyId, privateId) {
    return resultFor(conditionById(easyId)).total -
      resultFor(conditionById(privateId)).total;
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardLab;
  var buttonBox, readout, chart, chartDesc, runsBody, runsCaption, sentence;
  var diagnoseBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var run = [];

  var CLASSIC_RATE = Math.round(resultFor(CONDITIONS[0]).total * 100);

  var VERDICTS = {
    third: { state: "correct", text:
      "About right for that particular room, and the model below puts it at " +
      CLASSIC_RATE + " per cent. Notice what it also means: on roughly two " +
      "rounds in three the participant says what they see, in front of five " +
      "people who have just said something else. Then run any other condition " +
      "and watch how little the figure survives a change of room." },
    most: { state: "incorrect", text:
      "This is how the classic studies are usually remembered and it " +
      "overstates them considerably. Most rounds are answered correctly even " +
      "in the strongest condition here. The interesting question is not how " +
      "large the rate is but what makes it move." },
    few: { state: "incorrect", text:
      "The answer is obvious and a substantial minority of rounds go the " +
      "other way regardless. What is worth explaining is why, and there turn " +
      "out to be two quite different answers depending on the room." },
    depends: { state: "partial", text:
      "This is the conclusion the activity ends at, and arriving before " +
      "running anything makes it a slogan rather than a finding. It matters " +
      "which conditions, by how much and through which of two routes, and " +
      "those are answerable. Run some rooms below and the claim becomes a " +
      "specific one." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "third") {
      wb.choices.mark(options.querySelector('[data-choice="third"]'), "correct");
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
    wb.announce("Six conditions. Run whichever you like.");
  }

  /* -------------------------------------------------------------- running */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function runCondition(id) {
    if (run.indexOf(id) >= 0) { return; }
    run.push(id);
    if (run.length >= 3) { explainBtn.disabled = false; }
    render();
    var c = conditionById(id);
    var r = resultFor(c);
    noteText.textContent = c.note;
    wb.show(note);
    wb.announce(c.label + ". Normative route " + Math.round(r.normative * 100) +
      " per cent, informational route " + Math.round(r.informational * 100) +
      " per cent, agreement on " + Math.round(r.total * 100) + " per cent of rounds.");
  }

  function diagnose() {
    ["classic", "private", "ambiguous", "ambiguousPrivate"].forEach(function (id) {
      if (run.indexOf(id) < 0) { run.push(id); }
    });
    explainBtn.disabled = false;
    render();
    var easyDrop = privacyDrop("classic", "private");
    var hardDrop = privacyDrop("ambiguous", "ambiguousPrivate");
    noteText.textContent =
      "Four conditions, and one manipulation applied twice. On the easy " +
      "display, taking the audience away removes " +
      (easyDrop * 100).toFixed(1) + " points of agreement. On the ambiguous " +
      "display the same manipulation removes " + (hardDrop * 100).toFixed(1) +
      ". Look at the informational column: it is identical in the two public " +
      "conditions and identical again in the two private ones, because " +
      "privacy has no term in it. What privacy removes is the part of " +
      "agreement that needed somebody to be watching, and in the ambiguous " +
      "room most of the agreement was never that. Same intervention, half the " +
      "effect, and nothing in the overall rate would have told you which room " +
      "you were in.";
    wb.show(note);
    wb.announce("Ran the diagnostic comparison. Privacy removes " +
      (easyDrop * 100).toFixed(1) + " points on the easy display and " +
      (hardDrop * 100).toFixed(1) + " on the ambiguous one.");
  }

  function renderButtons() {
    buttonBox.textContent = "";
    CONDITIONS.forEach(function (condition) {
      var done = run.indexOf(condition.id) >= 0;
      var button = el("button", "btn " + (done ? "btn-secondary" : "btn-primary"),
        (done ? "Run: " : "") + condition.label);
      button.type = "button";
      if (done) {
        button.setAttribute("aria-disabled", "true");
      } else {
        button.addEventListener("click", function () { runCondition(condition.id); });
      }
      buttonBox.appendChild(button);
    });
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 330, RIGHT = 700, TOP = 56, GROUP = 62, BAR = 20;
  var NORMATIVE_COLOUR = "#C0434F";
  var INFORMATIONAL_COLOUR = "#1C7293";

  function renderChart() {
    wb.clearFigure(chart);
    var height = TOP + Math.max(1, run.length) * GROUP + 54;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    if (!run.length) {
      var empty = svg("text", { x: 8, y: TOP + 10, class: "plot__sub" });
      empty.textContent = "No conditions have been run yet.";
      chart.appendChild(empty);
      chartDesc.textContent = "No conditions have been run yet, so the figure " +
        "is empty.";
      return;
    }

    var xOf = function (v) { return LEFT + v * (RIGHT - LEFT); };

    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: xOf(v).toFixed(1), y1: TOP - 22, x2: xOf(v).toFixed(1),
        y2: (TOP + run.length * GROUP - 26).toFixed(1),
        class: "plot__axis", opacity: v === 0 ? 0.9 : 0.45
      }));
      var tick = svg("text", {
        x: xOf(v).toFixed(1), y: TOP - 28, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = Math.round(v * 100) + "%";
      chart.appendChild(tick);
    });

    run.forEach(function (id, i) {
      var condition = conditionById(id);
      var r = resultFor(condition);
      var top = TOP + i * GROUP;

      var name = svg("text", { x: 0, y: (top + 10).toFixed(1), class: "plot__sub" });
      name.textContent = condition.label;
      chart.appendChild(name);

      [
        { value: r.normative, colour: NORMATIVE_COLOUR, y: top - 4, word: "normative" },
        { value: r.informational, colour: INFORMATIONAL_COLOUR, y: top + 18, word: "informational" }
      ].forEach(function (bar) {
        chart.appendChild(svg("rect", {
          x: LEFT, y: bar.y.toFixed(1),
          width: Math.max(0, xOf(bar.value) - LEFT).toFixed(1), height: BAR,
          fill: bar.colour
        }));
        var value = svg("text", {
          x: (RIGHT + 14).toFixed(1), y: (bar.y + 14).toFixed(1),
          class: "plot__sub", fill: bar.colour
        });
        value.textContent = Math.round(bar.value * 100) + "% " + bar.word;
        chart.appendChild(value);
      });
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 18).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Share of rounds each route on its own would produce agreement on";
    chart.appendChild(axis);

    chartDesc.textContent =
      "Two bars for each condition run. " + run.map(function (id) {
        var c = conditionById(id);
        var r = resultFor(c);
        return c.label + ": normative " + Math.round(r.normative * 100) +
          " per cent, informational " + Math.round(r.informational * 100) +
          " per cent, agreement overall " + Math.round(r.total * 100) + " per cent";
      }).join("; ") + ".";
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function render() {
    renderButtons();
    renderChart();

    readout.textContent = "";
    readout.appendChild(tile("Conditions run", run.length + " of " + CONDITIONS.length,
      run.length ? "each one stays in the table" : "run one to begin"));
    if (run.length) {
      var totals = run.map(function (id) { return resultFor(conditionById(id)).total; });
      readout.appendChild(tile("Highest rate so far",
        Math.round(Math.max.apply(null, totals) * 100) + "%", "of rounds"));
      readout.appendChild(tile("Lowest",
        Math.round(Math.min.apply(null, totals) * 100) + "%",
        "on the same task, with the same five others"));
    } else {
      readout.appendChild(tile("Highest rate so far", "none", "nothing run yet"));
      readout.appendChild(tile("Lowest", "none", "nothing run yet"));
    }

    runsBody.textContent = "";
    run.forEach(function (id) {
      var condition = conditionById(id);
      var r = resultFor(condition);
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", condition.label, "row"));
      tr.appendChild(cell("td", Math.round(r.normative * 100) + "%"));
      tr.appendChild(cell("td", Math.round(r.informational * 100) + "%"));
      tr.appendChild(cell("td", Math.round(r.total * 100) + "% of rounds"));
      runsBody.appendChild(tr);
    });

    runsCaption.textContent = run.length
      ? "Every condition uses the same task and the same five other people. " +
        "The two route columns are what the model says each route on its own " +
        "would produce."
      : "Nothing has been run yet.";

    sentence.textContent =
      "Parameters, printed so they can be argued with: the normative route " +
      "starts at " + B_NORMATIVE.toFixed(2) + " and is multiplied by " +
      "unanimity, by whether anybody is watching, by identification with the " +
      "group and by how clear the norm is. The informational route starts at " +
      B_INFORMATIONAL.toFixed(2) + " and is multiplied by how ambiguous the " +
      "task is, by the standing of the majority and by unanimity. Whether " +
      "anybody is watching does not appear in the second one at all.";
  }

  function explain() {
    var easyDrop = privacyDrop("classic", "private");
    var hardDrop = privacyDrop("ambiguous", "ambiguousPrivate");
    resultLead.textContent =
      "You have run " + run.length + " of the six conditions. Across all six " +
      "the same task with the same five other people produces agreement on " +
      "between " + Math.round(Math.min.apply(null, CONDITIONS.map(function (c) {
        return resultFor(c).total; })) * 100) + " and " +
      Math.round(Math.max.apply(null, CONDITIONS.map(function (c) {
        return resultFor(c).total; })) * 100) + " per cent of rounds, and " +
      "taking the audience away removes " + (easyDrop * 100).toFixed(1) +
      " points on the easy display against " + (hardDrop * 100).toFixed(1) +
      " on the ambiguous one.";
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
    buttonBox = wb.root.querySelector("#condition-buttons");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    runsBody = wb.root.querySelector("#runs-body");
    runsCaption = wb.root.querySelector("#runs-caption");
    sentence = wb.root.querySelector("#sentence");
    diagnoseBtn = wb.root.querySelector("#diagnose");
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
    diagnoseBtn.addEventListener("click", diagnose);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      run = [];
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
