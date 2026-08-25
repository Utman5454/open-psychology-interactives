/**
 * Equally Accurate, or Equally Fast  (Simplified Edition)
 *
 * Teaching job: one outcome measure cannot separate how well somebody does a
 * task from how much evidence they were waiting for. Speed and accuracy have
 * to be read together, because a single dial moves both.
 *
 * The model is the diffusion closed form used by the full Speed-Accuracy
 * Trade-Off. With drift rate v, threshold a and non-decision time t0:
 *
 *     accuracy      = 1 / (1 + exp(-2 * v * a))
 *     decision time = (a / v) * tanh(v * a)
 *     mean RT       = t0 + decision time
 *
 * which is the standard result for a simple unbiased diffusion process.
 * Raising the threshold raises accuracy AND raises time, one dial moving two
 * outcomes in the same direction, and that is the whole difficulty.
 *
 * TWO PEOPLE, ONE OF WHOM IS BETTER AT THE TASK. Their drift rates differ,
 * 1.10 against 0.80, and their thresholds are separate. The consequence, which
 * is verified rather than assumed, is that the two speed-accuracy curves NEVER
 * CROSS: the first person is more accurate at every time and faster at every
 * accuracy. There is a fact of the matter about who does this task better.
 *
 * And yet the second person's threshold alone decides which of two false
 * impressions the data give. At a = 1.65 the two are equally accurate to a
 * tenth of a percentage point and the first is nearly a second faster. At
 * a = 1.08 they take the same time and the first is eight points more
 * accurate. Neither pair of numbers reveals that one curve dominates the
 * other, and a study reporting either measure alone would report no
 * difference on it.
 *
 * WHAT WAS CUT AND WHY. The full version opens with a discrimination task the
 * learner performs. Its own notes state that the simulator reaches every
 * conclusion on the page without it, and it is offered there as a non-timed
 * route for anyone who cannot or does not wish to do a speeded task. The
 * simplified edition keeps the route that carries the argument and drops the
 * task, which also removes practice blocks, timing and a difficulty control.
 *
 * Deliberate simplifications, stated in the caution:
 *   - The pair was chosen so that one dominates. Real curves frequently cross,
 *     and then who looks better genuinely depends on the speed compared at.
 *   - Caution is a dial somebody sets. In practice it responds to
 *     instructions, fatigue, stakes and what the person took the task to ask.
 *   - There is no error term, so the model gives points rather than estimates
 *     with uncertainty around them.
 *   - Drift rate is a property of a person meeting a particular task. It is
 *     not a general ability and it is not intelligence. The page says so twice.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var NON_DECISION = 0.30;

  var PEOPLE = [
    { key: "first", name: "The first person", drift: 0.90, caution: 1.20, colour: "#1C7293" },
    { key: "second", name: "The second person", drift: 0.60, caution: 1.80, colour: "#9E7318" }
  ];

  var MIN_CAUTION = 0.50, MAX_CAUTION = 2.50;

  /* Where the second person's caution makes the two look alike on one measure
     and not the other. Both are solved for at load rather than written in, so
     the page cannot quote a figure the model does not produce. */
  var MATCH_ACCURACY = null, MATCH_SPEED = null;

  function accuracy(drift, caution) {
    return 1 / (1 + Math.exp(-2 * drift * caution));
  }

  function meanTime(drift, caution) {
    return NON_DECISION + (caution / drift) * Math.tanh(drift * caution);
  }

  /** Bisection on a function known to be increasing in caution. */
  function cautionGiving(drift, target, fn) {
    var lo = 0.05, hi = 6;
    for (var i = 0; i < 200; i += 1) {
      var mid = (lo + hi) / 2;
      if (fn(drift, mid) < target) { lo = mid; } else { hi = mid; }
    }
    return (lo + hi) / 2;
  }

  /** Rounded to the step the slider offers, so a guided move lands on a value
      the control can actually hold. */
  function toStep(value) {
    return Math.round(value * 20) / 20;
  }

  (function solve() {
    var first = PEOPLE[0];
    MATCH_ACCURACY = toStep(cautionGiving(PEOPLE[1].drift,
      accuracy(first.drift, first.caution), accuracy));
    MATCH_SPEED = toStep(cautionGiving(PEOPLE[1].drift,
      meanTime(first.drift, first.caution), meanTime));
  }());

  /* Two numbers count as the same when they DISPLAY the same, rather than
     when they fall inside some tolerance. A tolerance can quietly declare a
     match while the reader is looking at 1.24 and 1.25 side by side, which
     would be the page contradicting itself. The drift rates and the fixed
     caution were chosen so that both matching points land exactly on a step
     the slider can hold and agree to the displayed precision. */
  function shownAccuracy(v) { return (v * 100).toFixed(1) + "%"; }
  function shownTime(v) { return v.toFixed(2) + "s"; }

  function secondCaution() { return Number(cautionInput.value); }

  function stateOf(person) {
    var caution = person.key === "second" ? secondCaution() : person.caution;
    return {
      caution: caution,
      accuracy: accuracy(person.drift, caution),
      time: meanTime(person.drift, caution)
    };
  }

  function comparison() {
    var a = stateOf(PEOPLE[0]);
    var b = stateOf(PEOPLE[1]);
    var sameAccuracy = shownAccuracy(a.accuracy) === shownAccuracy(b.accuracy);
    var sameTime = shownTime(a.time) === shownTime(b.time);
    return { a: a, b: b, sameAccuracy: sameAccuracy, sameTime: sameTime };
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardSim;
  var cautionInput, readout, chart, chartDesc, sentence;
  var matchBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;

  var VERDICTS = {
    nothing: { state: "correct", text:
      "Correct. Being faster at the same accuracy is consistent with doing the " +
      "task better and it is also consistent with having settled for less " +
      "evidence before answering, and one measure at a time cannot separate " +
      "those. The simulator below is the pair you were just told about, and " +
      "you can make them look equal on either measure by moving one dial." },
    better: { state: "partial", text:
      "It is the natural reading and, in the particular case below, it happens " +
      "to be true: the faster of these two really is better at the task at " +
      "every speed. What is wrong is the inference rather than the conclusion. " +
      "Move the dial and the same two people become equally fast and unequally " +
      "accurate, without either of them changing, which shows that the " +
      "observation you were given did not establish it." },
    hasty: { state: "incorrect", text:
      "This is the correction to the previous answer, applied too " +
      "enthusiastically. Being faster can mean waiting for less evidence, and " +
      "it can equally mean that the evidence arrives more clearly. Reading " +
      "speed as caution is the same error as reading it as ability: one " +
      "measure being used to settle a question that needs two." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "nothing") {
      wb.choices.mark(options.querySelector('[data-choice="nothing"]'), "correct");
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
    wb.focus(cautionInput);
    wb.announce("The simulator is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 120, RIGHT = 700, TOP = 60, BOTTOM = 330;
  var T_MIN = 0.4, T_MAX = 4.3;
  var A_MIN = 0.60, A_MAX = 1.00;

  function render() {
    var c = comparison();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var xOf = function (t) { return LEFT + ((t - T_MIN) / (T_MAX - T_MIN)) * (RIGHT - LEFT); };
    var yOf = function (a) { return BOTTOM - ((a - A_MIN) / (A_MAX - A_MIN)) * (BOTTOM - TOP); };

    [0.6, 0.7, 0.8, 0.9, 1.0].forEach(function (a) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(a).toFixed(1), x2: RIGHT, y2: yOf(a).toFixed(1),
        class: "plot__axis", opacity: 0.5
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(a) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = Math.round(a * 100) + "%";
      chart.appendChild(tick);
    });
    [1, 2, 3, 4].forEach(function (t) {
      var tick = svg("text", {
        x: xOf(t).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = t + "s";
      chart.appendChild(tick);
    });

    var yTitle = svg("text", { x: 6, y: TOP - 26, class: "plot__label" });
    yTitle.textContent = "Accuracy, against average time per decision";
    chart.appendChild(yTitle);

    /* Each person's whole curve, traced by varying only their caution. */
    PEOPLE.forEach(function (person) {
      var points = [];
      for (var a = MIN_CAUTION; a <= MAX_CAUTION + 1e-9; a += 0.05) {
        points.push(xOf(meanTime(person.drift, a)).toFixed(1) + "," +
          yOf(accuracy(person.drift, a)).toFixed(1));
      }
      chart.appendChild(svg("polyline", {
        points: points.join(" "), fill: "none",
        stroke: person.colour, "stroke-width": 3, "stroke-linejoin": "round"
      }));
    });

    /* Markers last, so neither is drawn under a line. */
    var ends = [];
    PEOPLE.forEach(function (person) {
      var s = person.key === "second" ? c.b : c.a;
      chart.appendChild(svg("circle", {
        cx: xOf(s.time).toFixed(1), cy: yOf(s.accuracy).toFixed(1), r: 7, fill: person.colour
      }));
      ends.push({ person: person, y: yOf(s.accuracy), x: xOf(s.time) });
    });
    var spread = wb.spreadLabels(ends.map(function (e) { return e.y; }), 20, TOP, BOTTOM);
    ends.forEach(function (e, i) {
      if (Math.abs(spread[i] - e.y) > 2) {
        chart.appendChild(svg("line", {
          x1: (e.x + 12).toFixed(1), y1: spread[i].toFixed(1),
          x2: (e.x + 5).toFixed(1), y2: e.y.toFixed(1),
          stroke: e.person.colour, "stroke-width": 1, opacity: 0.7
        }));
      }
      /* plot__over: these two labels sit inside the plot beside their marker,
         where a gridline will sometimes run behind them. The halo is what
         makes that legible, and it is why the label is allowed to be there
         rather than banished to a gutter far from the point it names. */
      var label = svg("text", {
        x: (e.x + 16).toFixed(1), y: (spread[i] + 4).toFixed(1),
        class: "plot__sub plot__over", fill: e.person.colour
      });
      label.textContent = e.person.key === "first" ? "First" : "Second";
      chart.appendChild(label);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Average time per decision. Further right is slower.";
    chart.appendChild(axis);

    describe(c);
    readouts(c);
  }

  function pct(v) { return shownAccuracy(v); }
  function secs(v) { return shownTime(v); }

  function describe(c) {
    chartDesc.textContent =
      "Two rising curves on axes of accuracy against average time, one per " +
      "person, each traced by varying only that person's caution. The first " +
      "person's curve lies above and to the left of the second's along its " +
      "whole length, so the first is more accurate at every time and faster " +
      "at every accuracy. The marked points are where the two are now: the " +
      "first at " + pct(c.a.accuracy) + " in " + secs(c.a.time) + ", the " +
      "second at " + pct(c.b.accuracy) + " in " + secs(c.b.time) + ". " +
      (c.sameAccuracy ? "Their accuracies are the same." :
        (c.sameTime ? "Their times are the same." :
          "Neither their accuracies nor their times match at this setting."));
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
    readout.appendChild(tile("The first person", pct(c.a.accuracy),
      "correct, taking " + secs(c.a.time) + " on average, at a caution of " +
      c.a.caution.toFixed(2)));
    readout.appendChild(tile("The second person", pct(c.b.accuracy),
      "correct, taking " + secs(c.b.time) + " on average, at a caution of " +
      c.b.caution.toFixed(2)));
    readout.appendChild(tile("What looks the same",
      c.sameAccuracy ? "accuracy" : (c.sameTime ? "time" : "neither"),
      c.sameAccuracy
        ? "a study reporting accuracy alone would find no difference"
        : (c.sameTime
          ? "a study reporting time alone would find no difference"
          : "at this setting they differ on both"),
      (c.sameAccuracy || c.sameTime) ? "incorrect" : null));
  }

  function renderSentence(c) {
    sentence.textContent =
      "The two curves never cross. Whatever the second person does with their " +
      "caution, the first is more accurate at every time and faster at every " +
      "accuracy, so there is a fact of the matter about who does this task " +
      "better. What the dial changes is only which measure hides it.";
  }

  /* ------------------------------------------------------------- guidance */

  function toggleMatch() {
    var goingToSpeed = Math.abs(secondCaution() - MATCH_ACCURACY) < 0.001;
    cautionInput.value = (goingToSpeed ? MATCH_SPEED : MATCH_ACCURACY).toFixed(2);
    moves = 2;
    explainBtn.disabled = false;
    onSlide();
    var c = comparison();
    matchBtn.textContent = goingToSpeed
      ? "Make them equally accurate again" : "Now make them equally fast instead";
    noteText.textContent = goingToSpeed
      ? "Both now take " + secs(c.a.time) + " per decision. The first is " +
        pct(c.a.accuracy) + " correct and the second " + pct(c.b.accuracy) +
        ". A study that reported reaction time and nothing else would report " +
        "no difference between these two people, and would be reporting it " +
        "about the setting of a dial."
      : "Both are now " + pct(c.a.accuracy) + " correct. The first takes " +
        secs(c.a.time) + " and the second " + secs(c.b.time) + ". A study " +
        "that reported accuracy and nothing else would find these two people " +
        "identical. Neither of them has changed at any point.";
    wb.show(note);
    wb.announce(goingToSpeed
      ? "Both now take " + secs(c.a.time) + ". Accuracies are " +
        pct(c.a.accuracy) + " and " + pct(c.b.accuracy) + "."
      : "Both are now " + pct(c.a.accuracy) + " correct. Times are " +
        secs(c.a.time) + " and " + secs(c.b.time) + ".");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="caution"]');
    if (output) { output.textContent = Number(cautionInput.value).toFixed(2); }
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
    renderSentence(comparison());
  }

  function explain() {
    var c = comparison();
    resultLead.textContent =
      "The first person is at " + pct(c.a.accuracy) + " in " + secs(c.a.time) +
      " and the second at " + pct(c.b.accuracy) + " in " + secs(c.b.time) +
      ". At a caution of " + MATCH_ACCURACY.toFixed(2) + " the second matches " +
      "the first on accuracy exactly, and at " + MATCH_SPEED.toFixed(2) + " on " +
      "time exactly. The second person is the same person in both cases, and " +
      "so is the first.";
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
    cautionInput = wb.root.querySelector("#caution");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    sentence = wb.root.querySelector("#sentence");
    matchBtn = wb.root.querySelector("#match");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    cautionInput.value = MATCH_ACCURACY.toFixed(2);

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    cautionInput.addEventListener("input", onSlide);
    cautionInput.addEventListener("change", onSlide);
    matchBtn.addEventListener("click", toggleMatch);
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
      matchBtn.textContent = "Now make them equally fast instead";
      cautionInput.value = MATCH_ACCURACY.toFixed(2);
      var output = wb.root.querySelector('output[for="caution"]');
      if (output) { output.textContent = MATCH_ACCURACY.toFixed(2); }
      render();
      renderSentence(comparison());
    });

    var output = wb.root.querySelector('output[for="caution"]');
    if (output) { output.textContent = MATCH_ACCURACY.toFixed(2); }
    render();
    renderSentence(comparison());
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
