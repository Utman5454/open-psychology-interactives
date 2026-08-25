/**
 * No Best Battery  (Simplified Edition)
 *
 * Teaching job: the properties of a test battery are the same numbers whatever
 * it is for, and they become good or bad only once somebody says what the
 * assessment is being used to decide. Validity belongs to a use.
 *
 * The model is the one from the full Intelligence-Test Battery Builder, cut to
 * seven generic task families and one time budget. From a selected set it
 * computes:
 *
 *   coverage    accumulated weight in each broad area, capped, with an area
 *               counted as reached at REACH. Measuring one area four ways does
 *               not make a battery broad, and the cap is what encodes that.
 *   composite   Spearman-Brown applied to the mean task reliability, so more
 *               tasks help and short unreliable ones help less than they cost.
 *   opportunity time-weighted mean of the tasks' dependence on prior
 *               opportunity. This is a property of a TASK. It is never a
 *               property of a person or a group and the page says so twice.
 *   burden      total across the tasks.
 *
 * WHAT MAKES IT A DEMONSTRATION RATHER THAN A SANDBOX. Three purposes each
 * state three requirements as explicit thresholds, so the verdict is a
 * checklist a learner can read rather than a weighted score they have to
 * trust. The task numbers were then chosen so that, over all 127 non-empty
 * selections within the budget:
 *
 *   - each purpose is satisfiable, by 45, 7 and 5 selections respectively;
 *   - NO selection satisfies all three at once.
 *
 * That second fact is the whole activity, it is checked exhaustively in the
 * test suite rather than asserted, and it is stated on the page.
 *
 * Deliberate simplifications, stated in the caution:
 *   - The numbers are invented, so the specific trade-offs are not any real
 *     battery's trade-offs. The shape of the argument is what transfers.
 *   - Norms are not modelled at all, although the choice of reference sample
 *     is at least as substantive as anything here.
 *   - Fit is a three-way checklist rather than the graded score the longer
 *     version computes, and burden tolerance does not vary by scenario.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var BUDGET = 60;
  var REACH = 0.4;

  var AREAS = [
    { key: "V", name: "Verbal" },
    { key: "S", name: "Spatial and figural" },
    { key: "M", name: "Working memory" },
    { key: "P", name: "Speed" }
  ];

  /* Generic task families. No published test is described or reproduced, and
     every number was written for teaching. */
  var TASKS = [
    { id: "verbal", name: "Reasoning with words and their meanings",
      minutes: 15, reliability: 0.90, weights: { V: 1.0 }, opportunity: 0.85, burden: 2 },
    { id: "matrix", name: "Reasoning about patterns in figures",
      minutes: 20, reliability: 0.88, weights: { S: 0.7, M: 0.3 }, opportunity: 0.25, burden: 3 },
    { id: "blocks", name: "Building a design from blocks",
      minutes: 18, reliability: 0.82, weights: { S: 1.0 }, opportunity: 0.35, burden: 4 },
    { id: "span", name: "Holding and reordering a sequence",
      minutes: 7, reliability: 0.78, weights: { M: 1.0 }, opportunity: 0.20, burden: 2 },
    { id: "speed", name: "Matching symbols against the clock",
      minutes: 6, reliability: 0.85, weights: { P: 1.0 }, opportunity: 0.30, burden: 3 },
    { id: "story", name: "Recalling a short story after a delay",
      minutes: 12, reliability: 0.75, weights: { V: 0.5, M: 0.5 }, opportunity: 0.60, burden: 3 },
    { id: "screen", name: "A short mixed-format screening task",
      minutes: 7, reliability: 0.70, weights: { V: 0.4, S: 0.4, M: 0.2 }, opportunity: 0.45, burden: 2 }
  ];

  var PURPOSES = [
    {
      id: "research",
      name: "Research into how abilities relate to one another",
      blurb: "A study of the structure of abilities across many participants.",
      requirements: [
        { text: "reaches at least three of the four areas",
          test: function (p) { return p.reached >= 3; },
          value: function (p) { return p.reached + " of 4"; } },
        { text: "composite reliability of at least 0.90",
          test: function (p) { return p.composite >= 0.90; },
          value: function (p) { return p.composite.toFixed(2); } },
        { text: "at least four tasks, so no conclusion rests on one",
          test: function (p) { return p.count >= 4; },
          value: function (p) { return String(p.count); } }
      ]
    },
    {
      id: "school",
      name: "Advising a school on how to support one pupil",
      blurb: "A profile meant to inform what is done in a classroom.",
      requirements: [
        { text: "reaches verbal and working memory in depth, not in passing",
          test: function (p) { return p.weight.V >= 0.8 && p.weight.M >= 0.8; },
          value: function (p) { return "verbal " + p.weight.V.toFixed(1) +
            ", memory " + p.weight.M.toFixed(1); } },
        { text: "burden of 9 or less on the pupil",
          test: function (p) { return p.burden <= 9; },
          value: function (p) { return String(p.burden); } },
        { text: "dependence on prior opportunity of 0.55 or less",
          test: function (p) { return p.opportunity <= 0.55; },
          value: function (p) { return p.opportunity.toFixed(2); } }
      ]
    },
    {
      id: "screening",
      name: "A brief screen to decide who needs a fuller assessment",
      blurb: "A first pass, where the cost of taking too long is that fewer people are seen.",
      requirements: [
        { text: "20 minutes or less in total",
          test: function (p) { return p.minutes <= 20; },
          value: function (p) { return p.minutes + " minutes"; } },
        { text: "reaches at least three of the four areas",
          test: function (p) { return p.reached >= 3; },
          value: function (p) { return p.reached + " of 4"; } },
        { text: "burden of 8 or less",
          test: function (p) { return p.burden <= 8; },
          value: function (p) { return String(p.burden); } }
      ]
    }
  ];

  /* The selection the guided button builds: within budget, and the only one of
     the three worked examples that reaches all four areas. */
  var RESEARCH_PICK = ["verbal", "matrix", "span", "speed"];

  function taskById(id) {
    var found = null;
    TASKS.forEach(function (t) { if (t.id === id) { found = t; } });
    return found;
  }

  function properties(selected) {
    var chosen = selected.map(taskById);
    var minutes = 0, burden = 0, reliabilitySum = 0, opportunitySum = 0;
    var weight = {};
    AREAS.forEach(function (a) { weight[a.key] = 0; });

    chosen.forEach(function (task) {
      minutes += task.minutes;
      burden += task.burden;
      reliabilitySum += task.reliability;
      opportunitySum += task.opportunity * task.minutes;
      Object.keys(task.weights).forEach(function (key) {
        weight[key] += task.weights[key];
      });
    });

    var count = chosen.length;
    var meanReliability = count ? reliabilitySum / count : 0;
    /* Spearman-Brown: what the total score's reliability would be for a test
       of this many parts each of that reliability. */
    var composite = count
      ? (count * meanReliability) / (1 + (count - 1) * meanReliability) : 0;

    var reached = 0;
    AREAS.forEach(function (a) { if (weight[a.key] >= REACH) { reached += 1; } });

    return {
      minutes: minutes,
      burden: burden,
      count: count,
      composite: composite,
      opportunity: minutes ? opportunitySum / minutes : 0,
      weight: weight,
      reached: reached
    };
  }

  function metCount(purpose, props) {
    var met = 0;
    purpose.requirements.forEach(function (r) { if (r.test(props)) { met += 1; } });
    return met;
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardBuild;
  var taskBox, purposeBox, readout, chart, chartDesc, requirementsBox, sentence;
  var bestBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var selected = [];
  var purposeId = "research";
  var moves = 0;

  function purpose() {
    var found = PURPOSES[0];
    PURPOSES.forEach(function (p) { if (p.id === purposeId) { found = p; } });
    return found;
  }

  var VERDICTS = {
    purpose: { state: "correct", text:
      "Correct, and it is a stronger claim than it sounds. It is not that " +
      "reasonable people disagree about which battery is best. It is that the " +
      "question has no answer until somebody says what the assessment is for, " +
      "because every property a battery has is neutral until then." },
    reliable: { state: "incorrect", text:
      "Reliability is a precondition rather than an achievement. A battery " +
      "can be beautifully consistent and measure a narrow slice of what you " +
      "needed, or take so long that half the people who needed screening were " +
      "never seen. Both of those show up on the builder below." },
    longest: { state: "incorrect", text:
      "Time is the binding constraint here, not a resource to maximise. Every " +
      "extra minute is a minute the person is sitting there, and for a " +
      "screening purpose a long battery fails on its own terms however good " +
      "its measurement is." },
    culture: { state: "partial", text:
      "How far a task depends on prior opportunity genuinely matters, and it " +
      "matters more for some purposes than others: it is decisive when the " +
      "result will shape what a school does for a child, and close to " +
      "irrelevant to a study of how abilities correlate within one sample. " +
      "So it is a real consideration whose weight is set by the purpose, " +
      "which is the answer the activity is after." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "purpose") {
      wb.choices.mark(options.querySelector('[data-choice="purpose"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardBuild);
    render();
    wb.scrollTo(cardBuild);
    wb.announce("The builder is open. Sixty minutes of testing time to spend.");
  }

  /* --------------------------------------------------------------- inputs */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function buildTaskToggles() {
    /* Built once. Re-rendering these on every change would move focus off the
       control the learner has just used. */
    TASKS.forEach(function (task) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("value", task.id);
      input.value = task.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, task.name));
      var detail = el("span", null, "");
      detail.setAttribute("data-detail", task.id);
      wrap.appendChild(detail);
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { toggleTask(task.id); });
      taskBox.appendChild(label);
    });
  }

  function buildPurposeToggles() {
    PURPOSES.forEach(function (p) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", p.id === purposeId ? "true" : "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "purpose");
      input.setAttribute("value", p.id);
      input.value = p.id;
      input.checked = p.id === purposeId;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, p.name));
      wrap.appendChild(el("span", null, p.blurb));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { setPurpose(p.id); });
      purposeBox.appendChild(label);
    });
  }

  function syncToggles() {
    Array.prototype.forEach.call(taskBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = selected.indexOf(input.value) >= 0;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
      /* A task that will not fit is NOT disabled. The `disabled` attribute
         removes a control from the tab order, and a keyboard reader working
         down the list would silently lose the rows that no longer fit, which
         are exactly the ones they need to know about. It stays reachable, its
         description says it will not fit, and an attempt to add it is refused
         with a spoken reason. */
      var task = taskById(input.value);
      var wouldExceed = !on && properties(selected).minutes + task.minutes > BUDGET;
      label.setAttribute("data-full", wouldExceed ? "true" : "false");
      var detail = label.querySelector("[data-detail]");
      if (detail) {
        detail.textContent = task.minutes + " minutes, reliability " +
          task.reliability.toFixed(2) + ", burden " + task.burden +
          ", dependence on prior opportunity " + task.opportunity.toFixed(2) +
          (wouldExceed ? ". Will not fit in the time remaining." : "");
      }
    });
    Array.prototype.forEach.call(purposeBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === purposeId;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });
  }

  function toggleTask(id) {
    var at = selected.indexOf(id);
    if (at >= 0) {
      selected.splice(at, 1);
    } else {
      var task = taskById(id);
      var used = properties(selected).minutes;
      if (used + task.minutes > BUDGET) {
        render();
        wb.announce("Not added. " + task.name + " takes " + task.minutes +
          " minutes and only " + (BUDGET - used) + " of the " + BUDGET +
          " are left. Remove something first.");
        return;
      }
      selected.push(id);
    }
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
    var props = properties(selected);
    wb.announce(props.count + (props.count === 1 ? " task, " : " tasks, ") +
      props.minutes + " of " + BUDGET + " minutes used, " +
      metCount(purpose(), props) + " of 3 requirements met.");
  }

  function setPurpose(id) {
    purposeId = id;
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
    var props = properties(selected);
    wb.announce("Purpose changed to " + purpose().name + ". The same battery " +
      "now meets " + metCount(purpose(), props) + " of 3 requirements.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 230, RIGHT = 720, TOP = 56, ROW = 50, MAX_WEIGHT = 2.0;

  function renderChart() {
    var props = properties(selected);
    wb.clearFigure(chart);
    var height = TOP + AREAS.length * ROW + 58;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (w) { return LEFT + (Math.min(w, MAX_WEIGHT) / MAX_WEIGHT) * (RIGHT - LEFT); };

    var reachX = xOf(REACH);
    chart.appendChild(svg("line", {
      x1: reachX.toFixed(1), y1: TOP - 30, x2: reachX.toFixed(1),
      y2: (TOP + AREAS.length * ROW - 20).toFixed(1),
      stroke: "#1A2744", "stroke-width": 2, "stroke-dasharray": "5 4"
    }));
    var reachLabel = svg("text", {
      x: reachX.toFixed(1), y: TOP - 36, "text-anchor": "middle", class: "plot__tick"
    });
    reachLabel.textContent = "reached";
    chart.appendChild(reachLabel);

    AREAS.forEach(function (area, i) {
      var y = TOP + i * ROW;
      var name = svg("text", { x: 0, y: (y + 4).toFixed(1), class: "plot__sub" });
      name.textContent = area.name;
      chart.appendChild(name);

      var w = props.weight[area.key];
      var reached = w >= REACH;
      chart.appendChild(svg("rect", {
        x: LEFT, y: (y - 12).toFixed(1),
        width: Math.max(0, xOf(w) - LEFT).toFixed(1), height: 24,
        fill: reached ? "#1C7293" : "#C0434F"
      }));
      var value = svg("text", {
        x: (RIGHT + 24).toFixed(1), y: (y + 4).toFixed(1), class: "plot__sub",
        fill: reached ? "#1C7293" : "#C0434F"
      });
      value.textContent = w.toFixed(1) + (reached ? "" : ", not reached");
      chart.appendChild(value);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 20).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "How much of this area the chosen tasks sample between them";
    chart.appendChild(axis);

    var parts = AREAS.map(function (a) {
      return a.name.toLowerCase() + " " + props.weight[a.key].toFixed(1);
    });
    chartDesc.textContent =
      "Four horizontal bars, one per broad ability area, showing how much the " +
      "chosen tasks sample each: " + parts.join(", ") + ". An area counts as " +
      "reached at " + REACH.toFixed(1) + ". This battery reaches " +
      props.reached + " of the four.";
  }

  /* ------------------------------------------------------------- readouts */

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function renderReadout() {
    var props = properties(selected);
    readout.textContent = "";
    readout.appendChild(tile("Time used", props.minutes + " of " + BUDGET,
      BUDGET - props.minutes === 0 ? "the session is full"
        : (BUDGET - props.minutes) + " minutes left"));
    readout.appendChild(tile("Composite reliability",
      props.count ? props.composite.toFixed(2) : "n/a",
      props.count ? "of the total score, across " + props.count +
        (props.count === 1 ? " task" : " tasks") : "nothing selected yet"));
    readout.appendChild(tile("Depends on prior opportunity",
      props.count ? props.opportunity.toFixed(2) : "n/a",
      "a property of the tasks, never of a person"));
    readout.appendChild(tile("Burden", String(props.burden),
      "what the session costs the person sitting it"));
  }

  function renderRequirements() {
    var props = properties(selected);
    var p = purpose();
    requirementsBox.textContent = "";

    var met = metCount(p, props);
    var box = el("div", "notice");
    box.setAttribute("data-state", met === 3 ? "correct" : (met === 0 ? "incorrect" : "partial"));
    box.appendChild(el("p", null,
      "For " + p.name.toLowerCase() + ", this battery meets " + met +
      " of the 3 requirements."));
    var list = el("ul", "checklist");
    p.requirements.forEach(function (r) {
      var ok = r.test(props);
      var item = el("li", null,
        (ok ? "Met: " : "Not met: ") + r.text + ". This battery: " + r.value(props) + ".");
      item.setAttribute("data-state", ok ? "correct" : "incorrect");
      list.appendChild(item);
    });
    box.appendChild(list);
    requirementsBox.appendChild(box);
  }

  function renderSentence() {
    var props = properties(selected);
    if (!props.count) {
      sentence.textContent = "Nothing is selected yet. Choose some tasks, then " +
        "change what the session is for without changing them.";
      return;
    }
    var scores = PURPOSES.map(function (p) {
      return p.name.toLowerCase() + ", " + metCount(p, props) + " of 3";
    });
    sentence.textContent =
      "This same battery, unchanged, against each of the three purposes: " +
      scores.join("; ") + ". Nothing about the tasks differs between those " +
      "three verdicts.";
  }

  function render() {
    syncToggles();
    renderChart();
    renderReadout();
    renderRequirements();
    renderSentence();
  }

  /* ------------------------------------------------------------- guidance */

  function buildBest() {
    selected = RESEARCH_PICK.slice();
    purposeId = "research";
    moves = 2;
    explainBtn.disabled = false;
    render();
    var props = properties(selected);
    var screening = PURPOSES[2];
    noteText.textContent =
      "Four tasks, " + props.minutes + " minutes, all four areas reached and a " +
      "composite reliability of " + props.composite.toFixed(2) + ". For research " +
      "into how abilities relate, that is three requirements out of three. Now " +
      "change nothing about the battery and switch the purpose to the brief " +
      "screen: it meets " + metCount(screening, props) + " of 3, because it " +
      "takes " + props.minutes + " minutes when the screen allows 20 and " +
      "costs " + props.burden + " when the screen allows 8. The battery did " +
      "not get worse. It was never good or bad in the first place; it was " +
      "good for something.";
    wb.show(note);
    wb.announce("Research battery built. Four tasks, " + props.minutes + " minutes.");
  }

  function explain() {
    var props = properties(selected);
    var scores = PURPOSES.map(function (p) { return metCount(p, props); });
    resultLead.textContent = props.count
      ? "The battery you have built meets " + scores[0] + " of 3 requirements " +
        "for research, " + scores[1] + " of 3 for advising a school, and " +
        scores[2] + " of 3 for a brief screen. It is the same " + props.count +
        " tasks and the same " + props.minutes + " minutes in all three cases."
      : "Nothing is selected, so there is nothing to judge. That is itself the " +
        "point in miniature: the properties come from the tasks, and the " +
        "verdict comes from the purpose.";
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
    cardBuild = wb.root.querySelector("#card-build");
    taskBox = wb.root.querySelector("#tasks");
    purposeBox = wb.root.querySelector("#purposes");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    requirementsBox = wb.root.querySelector("#requirements");
    sentence = wb.root.querySelector("#sentence");
    bestBtn = wb.root.querySelector("#best");
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
    bestBtn.addEventListener("click", buildBest);
    explainBtn.addEventListener("click", explain);

    buildTaskToggles();
    buildPurposeToggles();

    wb.onReset(function () {
      answered = false;
      selected = [];
      purposeId = "research";
      moves = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardBuild);
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
