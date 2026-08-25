/**
 * How Many, and At What  (Simplified Edition)
 *
 * Teaching job: the classic account of crowd action and its successor disagree
 * about the PATTERNING of what happens rather than about how much of it there
 * is, and they locate the cause in different places.
 *
 * The model is the one from the full activity, with the conditions reduced to
 * four scenarios and one live control. A section takes part when
 *
 *     baseline + unity * legitimacy + (norm shift, if inside the category)
 *
 * reaches the threshold. Target weights are set by the norm and then reshaped
 * by identifiability, and that reshaping is where the two accounts part
 * company:
 *
 *   WHERE A SHARED NORM IS IN PLAY, anonymity SHARPENS it. Each weight is
 *   raised to a power above one and renormalised, so the action becomes more
 *   concentrated, which is what the social identity model of deindividuation
 *   effects predicts and the opposite of what a story about lost restraint
 *   predicts.
 *
 *   WHERE THERE IS NO SHARED UNDERSTANDING, anonymity moves the weights part
 *   of the way towards an even spread instead, which is the classic direction.
 *
 * So neither account is a straw man here: each has scenarios in which its
 * prediction is the one that comes true, and the page says so.
 *
 * THE DISINHIBITION INDEX is identifiability together with how many sections
 * joined in, which is what an account of lost restraint tracks. It is printed
 * precisely so that a learner can see two afternoons score identically on it.
 * The guided comparison finds the matched pair: differentiated policing with
 * an anonymous crowd, and a crowd whose norm rules confrontation out of
 * bounds with an anonymous crowd. Both have one section taking part and both
 * are anonymous, so the index is the same number, and their concentration
 * figures are 0.12 and 0.76. That pair is computed from the model rather than
 * written down, and the test suite verifies that the indices really are equal.
 *
 * The concentration measure is the summed absolute deviation of the four
 * shares from an even quarter, divided so that zero is a perfectly even spread
 * and one is everything on a single target. It is a teaching device invented
 * for this page and not a published measure of anything.
 *
 * WHAT THIS IS NOT. Not a claim that either account is refuted. The older one
 * was built to explain real observations and is still defended in modified
 * forms; the successor has critics of its own. No event, police operation or
 * town here is real and every number is invented.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var THRESHOLD = 0.60;
  var CATEGORY_AT = 0.55;

  var SECTIONS = [
    { name: "Bridge Road residents", baseline: 0.20 },
    { name: "Campaign committee regulars", baseline: 0.40 },
    { name: "Weekend market stallholders", baseline: 0.12 },
    { name: "Sixth-form students", baseline: 0.28 },
    { name: "Families at the fun day", baseline: 0.04 },
    { name: "A handful expecting a confrontation", baseline: 0.88 }
  ];

  var TARGETS = ["The police line", "A shuttered shop front", "A bus shelter", "Parked cars"];

  var NORM_SHIFT = { line: 0.18, none: 0.00, bounds: -0.45 };
  var NORM_WEIGHTS = {
    line: [0.70, 0.10, 0.10, 0.10],
    none: [0.40, 0.25, 0.20, 0.15],
    bounds: [0.70, 0.10, 0.10, 0.10]
  };
  var SHARPEN = 1.35;
  var TOWARDS_EVEN = 0.40;

  var SCENARIOS = [
    { id: "differentiated", label: "Policing aimed at particular people",
      blurb: "Officers deal with individuals rather than the crowd, and most people read the day as reasonable.",
      unity: 0.10, legitimacy: 0.12, norm: "none" },
    { id: "common", label: "Indiscriminate policing, and a crowd that becomes one group",
      blurb: "Everyone present is treated the same way, most read it as unfair, and the people there come to see themselves as one group with one thing happening to them.",
      unity: 1.00, legitimacy: 0.50, norm: "line" },
    { id: "fragmented", label: "Indiscriminate policing, and a crowd that stays several crowds",
      blurb: "Everyone is treated the same way and most read it as unfair, but no shared sense of who this is happening to takes hold.",
      unity: 0.55, legitimacy: 0.50, norm: "none" },
    { id: "restraint", label: "One group, and a shared sense that confrontation is out of bounds",
      blurb: "The same indiscriminate policing and the same common category, and an understanding among those present that this is not what today is for.",
      unity: 1.00, legitimacy: 0.50, norm: "bounds" }
  ];

  var THEORIES = [
    { name: "Loss of restraint, the classic account",
      cause: "In the crowd itself, which removes the sense of being an identifiable person",
      shape: "Little shape. What restraint held back is released, so what happens goes at whatever is nearest",
      measures: "How many joined in, and whether anybody could be identified" },
    { name: "Social identity, the elaborated model",
      cause: "In the relation between the crowd and how it is policed, which can make one group out of several",
      shape: "A shape. A shared sense of what this is about carries limits as well as permissions, so some things are done and others nearby are not",
      measures: "What the action was aimed at, and what was left alone" }
  ];

  function scenarioById(id) {
    var found = SCENARIOS[0];
    SCENARIOS.forEach(function (s) { if (s.id === id) { found = s; } });
    return found;
  }

  function insideCategory(scenario, section) {
    if (scenario.unity < CATEGORY_AT) { return false; }
    /* The handful who came for a confrontation are absorbed only by a crowd
       that has fully become one group. */
    if (section.baseline >= 0.88) { return scenario.unity >= 1.00; }
    return true;
  }

  function takesPart(scenario, section) {
    var value = section.baseline + scenario.unity * scenario.legitimacy +
      (insideCategory(scenario, section) ? NORM_SHIFT[scenario.norm] : 0);
    return value >= THRESHOLD;
  }

  function sectionCount(scenario) {
    return SECTIONS.filter(function (s) { return takesPart(scenario, s); }).length;
  }

  function weightsFor(scenario, anonymous) {
    var base = NORM_WEIGHTS[scenario.norm].slice();
    if (!anonymous) { return base; }
    if (scenario.norm !== "none") {
      var raised = base.map(function (w) { return Math.pow(w, SHARPEN); });
      var total = raised.reduce(function (a, b) { return a + b; }, 0);
      return raised.map(function (w) { return w / total; });
    }
    return base.map(function (w) { return w + TOWARDS_EVEN * (0.25 - w); });
  }

  function concentration(weights) {
    var sum = 0;
    weights.forEach(function (w) { sum += Math.abs(w - 0.25); });
    return sum / 1.5;
  }

  function disinhibition(scenario, anonymous) {
    return (anonymous ? 0.5 : 0) + (sectionCount(scenario) / SECTIONS.length) * 0.5;
  }

  /** The two runs that score identically on the index and differ most on
      concentration. Computed, not written down. */
  var MATCHED = (function () {
    var runs = [];
    SCENARIOS.forEach(function (s) {
      [false, true].forEach(function (anon) {
        runs.push({
          scenario: s, anonymous: anon,
          index: disinhibition(s, anon),
          concentration: concentration(weightsFor(s, anon))
        });
      });
    });
    var best = null;
    runs.forEach(function (a) {
      runs.forEach(function (b) {
        if (a === b) { return; }
        if (Math.abs(a.index - b.index) > 1e-9) { return; }
        var gap = Math.abs(a.concentration - b.concentration);
        if (!best || gap > best.gap) { best = { a: a, b: b, gap: gap }; }
      });
    });
    return best;
  }());

  /* ------------------------------------------------------------------ dom */

  var theoriesBody, options, verdict, verdictText, revealBtn, cardLab;
  var scenarioBox, identBtn, identValue, readout, chart, chartDesc;
  var sectionsBody, sectionsCaption, sentence, compareBtn, explainBtn;
  var note, noteText, cardCompare, pairBody, pairSentence, explain2Btn;
  var synthesis, resultLead;

  var answered = false;
  var chosen = null;
  var anonymous = false;
  var seen = [];

  var VERDICTS = {
    esim: { state: "correct", text:
      "Yes, and the reason is the part worth keeping. Three things a few " +
      "metres away were left alone, which means something was distinguishing " +
      "between them. An account in which restraint has simply gone has " +
      "nothing to do the distinguishing with." },
    deind: { state: "incorrect", text:
      "If what has happened is that restraint has gone, there is nothing left " +
      "to explain why a shuttered shop three metres away was untouched. The " +
      "concentration is exactly the observation this account has the most " +
      "difficulty with." },
    both: { state: "incorrect", text:
      "One of them predicts it and the other has to accommodate it after the " +
      "event. That difference is the whole reason for setting up an afternoon " +
      "below and looking at what each account tells you to measure." },
    neither: { state: "partial", text:
      "Knowing how many joined in genuinely matters, and the model below " +
      "reports it. It is also the measure on which the two accounts agree " +
      "most, which is why the interesting comparison is elsewhere. You will " +
      "find two afternoons that score identically on it and look nothing " +
      "alike." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "esim") {
      wb.choices.mark(options.querySelector('[data-choice="esim"]'), "correct");
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
    wb.announce("Choose how the afternoon went.");
  }

  /* -------------------------------------------------------------- helpers */

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

  function buildTheories() {
    theoriesBody.textContent = "";
    THEORIES.forEach(function (t) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", t.name, "row"));
      [t.cause, t.shape, t.measures].forEach(function (v) { tr.appendChild(cell("td", v)); });
      theoriesBody.appendChild(tr);
    });
  }

  function buildScenarios() {
    SCENARIOS.forEach(function (scenario) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "scenario");
      input.setAttribute("value", scenario.id);
      input.value = scenario.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, scenario.label));
      wrap.appendChild(el("span", null, scenario.blurb));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { setScenario(scenario.id); });
      scenarioBox.appendChild(label);
    });
  }

  function noteSeen() {
    var key = chosen + (anonymous ? ":anon" : ":ident");
    if (chosen && seen.indexOf(key) < 0) { seen.push(key); }
    if (seen.length >= 2) { explainBtn.disabled = false; }
  }

  function setScenario(id) {
    chosen = id;
    noteSeen();
    render();
    var s = scenarioById(id);
    wb.announce(s.label + ". " + sectionCount(s) + " of " + SECTIONS.length +
      " sections took part.");
  }

  function toggleIdent() {
    anonymous = !anonymous;
    identBtn.setAttribute("aria-pressed", anonymous ? "true" : "false");
    identBtn.textContent = anonymous
      ? "Make the crowd identifiable again" : "Make the crowd anonymous";
    identValue.textContent = anonymous ? "anonymous" : "identifiable";
    noteSeen();
    render();
    if (chosen) {
      var s = scenarioById(chosen);
      wb.announce((anonymous ? "Anonymous. " : "Identifiable. ") +
        "The action is now " + concentration(weightsFor(s, anonymous)).toFixed(2) +
        " concentrated.");
    }
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 250, RIGHT = 700, TOP = 56, ROW = 52;

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function render() {
    Array.prototype.forEach.call(scenarioBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === chosen;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });

    wb.clearFigure(chart);
    readout.textContent = "";
    sectionsBody.textContent = "";

    if (!chosen) {
      chart.setAttribute("viewBox", "0 0 900 120");
      var empty = svg("text", { x: 6, y: 40, class: "plot__sub" });
      empty.textContent = "No afternoon has been set up yet.";
      chart.appendChild(empty);
      chartDesc.textContent = "No afternoon has been set up yet, so the figure is empty.";
      sectionsCaption.textContent = "Choose an afternoon above and this fills in.";
      sentence.textContent = "Nothing is set up. The six sections and their " +
        "readiness scores are the same whichever afternoon you choose.";
      return;
    }

    var s = scenarioById(chosen);
    var weights = weightsFor(s, anonymous);
    var n = sectionCount(s);

    chart.setAttribute("viewBox", "0 0 900 " + (TOP + TARGETS.length * ROW + 46));
    var xOf = function (w) { return LEFT + w * (RIGHT - LEFT); };
    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: xOf(v).toFixed(1), y1: TOP - 20, x2: xOf(v).toFixed(1),
        y2: (TOP + TARGETS.length * ROW - 24).toFixed(1),
        class: "plot__axis", opacity: v === 0.25 ? 0.9 : 0.45
      }));
      var tick = svg("text", {
        x: xOf(v).toFixed(1), y: TOP - 26, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = Math.round(v * 100) + "%";
      chart.appendChild(tick);
    });
    var evenMark = svg("text", {
      x: xOf(0.25).toFixed(1), y: (TOP + TARGETS.length * ROW - 6).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    evenMark.textContent = "an even quarter";
    chart.appendChild(evenMark);

    TARGETS.forEach(function (target, i) {
      var y = TOP + i * ROW;
      var name = svg("text", { x: 0, y: (y + 10).toFixed(1), class: "plot__sub" });
      name.textContent = target;
      chart.appendChild(name);
      chart.appendChild(svg("rect", {
        x: LEFT, y: (y - 4).toFixed(1),
        width: Math.max(0, xOf(weights[i]) - LEFT).toFixed(1), height: 24,
        fill: weights[i] > 0.25 ? "#C0434F" : "#1C7293"
      }));
      var value = svg("text", {
        x: (RIGHT + 14).toFixed(1), y: (y + 14).toFixed(1),
        class: "plot__sub", fill: weights[i] > 0.25 ? "#C0434F" : "#1C7293"
      });
      value.textContent = Math.round(weights[i] * 100) + "% of the action";
      chart.appendChild(value);
    });

    chartDesc.textContent =
      "Four bars, one per possible target: " +
      TARGETS.map(function (t, i) {
        return t.toLowerCase() + " " + Math.round(weights[i] * 100) + " per cent";
      }).join(", ") + ". Concentration is " +
      concentration(weights).toFixed(2) + " on a scale where zero is an even " +
      "spread across the four and one is everything on a single target.";

    readout.appendChild(tile("Sections taking part", n + " of " + SECTIONS.length,
      "out of six groups who were there"));
    readout.appendChild(tile("How concentrated", concentration(weights).toFixed(2),
      concentration(weights) > 0.4 ? "a clear shape to it" : "spread across what was nearby",
      concentration(weights) > 0.4 ? "correct" : null));
    readout.appendChild(tile("Disinhibition index", disinhibition(s, anonymous).toFixed(2),
      "what an account of lost restraint tracks"));

    SECTIONS.forEach(function (section) {
      var part = takesPart(s, section);
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", section.name, "row"));
      tr.appendChild(cell("td", section.baseline.toFixed(2)));
      tr.appendChild(cell("td", part ? "yes" : "no"));
      /* Only set it when there is a state. setAttribute(name, null) writes
         the literal string "null" into the markup rather than omitting the
         attribute. */
      if (part) { tr.setAttribute("data-state", "chosen"); }
      sectionsBody.appendChild(tr);
    });
    sectionsCaption.textContent =
      "The readiness column never changes. Whether a section takes part " +
      "depends on the afternoon, not on who they are.";

    var other = concentration(weightsFor(s, !anonymous));
    var here = concentration(weights);
    sentence.textContent =
      "With people " + (anonymous ? "anonymous" : "identifiable") +
      " the action is " + here.toFixed(2) + " concentrated. With them " +
      (anonymous ? "identifiable" : "anonymous") + " it would be " +
      other.toFixed(2) + ", so being unidentifiable makes it " +
      (here > other ? "more" : "less") + " concentrated here. " +
      (s.norm === "none"
        ? "There is no shared understanding in this afternoon, and that is the " +
          "direction the classic account predicts."
        : "There is a shared understanding in this afternoon, and sharpening " +
          "is the direction the social identity model predicts and the classic " +
          "account does not.");
  }

  /* -------------------------------------------------------------- compare */

  function compare() {
    wb.show(cardCompare);
    pairBody.textContent = "";
    [MATCHED.a, MATCHED.b].forEach(function (run) {
      var weights = weightsFor(run.scenario, run.anonymous);
      var biggest = 0;
      weights.forEach(function (w, i) { if (w > weights[biggest]) { biggest = i; } });
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", run.scenario.label +
        (run.anonymous ? ", anonymous" : ", identifiable"), "row"));
      tr.appendChild(cell("td", sectionCount(run.scenario) + " of " + SECTIONS.length));
      tr.appendChild(cell("td", run.index.toFixed(2)));
      tr.appendChild(cell("td", run.concentration.toFixed(2)));
      tr.appendChild(cell("td", TARGETS[biggest] + ", " +
        Math.round(weights[biggest] * 100) + " per cent"));
      tr.setAttribute("data-state", run.concentration > 0.4 ? "chosen" : "incorrect");
      pairBody.appendChild(tr);
    });

    pairSentence.textContent =
      "Both afternoons have " + sectionCount(MATCHED.a.scenario) + " section" +
      (sectionCount(MATCHED.a.scenario) === 1 ? "" : "s") + " taking part and " +
      "both are anonymous, so the disinhibition index is " +
      MATCHED.a.index.toFixed(2) + " for each. Their concentration figures are " +
      MATCHED.a.concentration.toFixed(2) + " and " +
      MATCHED.b.concentration.toFixed(2) + ". An account that tracks only the " +
      "first two columns has no way of telling these two afternoons apart, and " +
      "anybody who was there would.";

    noteText.textContent =
      "That pair is not hand-picked to embarrass anybody: it is the two runs " +
      "in this model with identical indices and the largest difference in " +
      "concentration, found by searching all eight. Notice also that the " +
      "classic account is right about the direction in two of the four " +
      "afternoons, the two with no shared understanding in them. Neither " +
      "account is a straw man here.";
    wb.show(note);
    explainBtn.disabled = false;
    wb.scrollTo(cardCompare);
    wb.announce("Two afternoons with the same disinhibition index and " +
      "concentration figures of " + MATCHED.a.concentration.toFixed(2) + " and " +
      MATCHED.b.concentration.toFixed(2) + ".");
  }

  function explain() {
    resultLead.textContent =
      "Across the four afternoons the number of sections taking part runs from " +
      Math.min.apply(null, SCENARIOS.map(sectionCount)) + " to " +
      Math.max.apply(null, SCENARIOS.map(sectionCount)) + ", and concentration " +
      "from " + Math.min.apply(null, SCENARIOS.map(function (s) {
        return Math.min(concentration(weightsFor(s, false)), concentration(weightsFor(s, true)));
      })).toFixed(2) + " to " + Math.max.apply(null, SCENARIOS.map(function (s) {
        return Math.max(concentration(weightsFor(s, false)), concentration(weightsFor(s, true)));
      })).toFixed(2) + ". Two of them share a disinhibition index of " +
      MATCHED.a.index.toFixed(2) + " and differ by " + MATCHED.gap.toFixed(2) +
      " on concentration.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    theoriesBody = wb.root.querySelector("#theories-body");
    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardLab = wb.root.querySelector("#card-lab");
    scenarioBox = wb.root.querySelector("#scenarios");
    identBtn = wb.root.querySelector("#ident");
    identValue = wb.root.querySelector("#ident-value");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    sectionsBody = wb.root.querySelector("#sections-body");
    sectionsCaption = wb.root.querySelector("#sections-caption");
    sentence = wb.root.querySelector("#sentence");
    compareBtn = wb.root.querySelector("#compare");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    cardCompare = wb.root.querySelector("#card-compare");
    pairBody = wb.root.querySelector("#pair-body");
    pairSentence = wb.root.querySelector("#pair-sentence");
    explain2Btn = wb.root.querySelector("#explain2");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    identBtn.addEventListener("click", toggleIdent);
    compareBtn.addEventListener("click", compare);
    explainBtn.addEventListener("click", explain);
    explain2Btn.addEventListener("click", explain);

    buildTheories();
    buildScenarios();

    wb.onReset(function () {
      answered = false;
      chosen = null;
      anonymous = false;
      seen = [];
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLab);
      wb.hide(cardCompare);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      identBtn.setAttribute("aria-pressed", "false");
      identBtn.textContent = "Make the crowd anonymous";
      identValue.textContent = "identifiable";
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
