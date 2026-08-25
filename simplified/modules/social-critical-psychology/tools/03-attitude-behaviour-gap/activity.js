/**
 * Four People, One Score  (Simplified Edition)
 *
 * Teaching job: a strong attitude towards a behaviour does not, on its own,
 * predict the behaviour, and the size of the attitude-behaviour correlation is
 * partly a measurement of how much the conditions vary.
 *
 * The model is the one from the full Attitude-Behaviour Gap, with every
 * coefficient printed on screen:
 *
 *     logit = B0 + Batt * c * A + Bnorm * N + Bctrl * P + Bhabit * H
 *                - Bconstraint * C
 *     p     = logistic(logit) * O
 *
 * A, N, P, H, C and O run from 0 to 1, and `c` is the correspondence weight of
 * the questionnaire. OPPORTUNITY MULTIPLIES. Norms, confidence and habit shift
 * the odds; if the occasion does not arise, nothing else matters. Marek exists
 * to make that visible, and the guided button gives him Rowan's opportunity
 * and nothing else, which takes him from 13 per cent to 76.
 *
 * WHAT IS PLOTTED IN STEP 3, and this is a correction to the obvious design.
 * Plotting the model's probability against attitude under uniform conditions
 * gives a correlation of 0.999, because with the conditions fixed the
 * probability is a deterministic monotone function of the attitude. That is
 * true of the model and reads as an artefact. What a study would actually
 * observe is a behaviour, so each of the three hundred is observed over thirty
 * meetings and the plotted value is the share in which they spoke up. Binomial
 * variation then does what it does in real data, and the correlation comes out
 * at 0.62 under uniform conditions against 0.31 in varying ones. Both are
 * plausible-looking figures, which is the point: the difference between them
 * is entirely a fact about the rooms.
 *
 * The three hundred attitude scores and the thirty per-person occasion draws
 * are generated once and reused by both regimes. Regenerating them would mean
 * the two correlations differed partly through sampling, and the whole claim
 * is that nothing about the people changed.
 *
 * WHAT WAS CUT. The correspondence control, the per-person factor sliders, and
 * the guided prediction round in which the learner guesses each colleague's
 * behaviour before seeing it. The scale here is fixed at the behaviour-level
 * weight, which is the favourable case, so the gap cannot be dismissed as an
 * artefact of asking the wrong question.
 *
 * WHAT THIS IS NOT. A simulation cannot test a theory: the coefficients are
 * invented, the correlations are not findings, and no number estimates
 * anything. The model has no feedback in it, which is its largest omission.
 * And it estimates a frequency, not a virtue; the costs of speaking up fall
 * very unevenly and the page says so.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var B = {
    intercept: -1.30,
    attitude: 2.60,
    norm: 1.30,
    control: 1.50,
    habit: 1.40,
    constraint: 1.80
  };

  /* A behaviour-level attitude scale: the favourable case for the measure. */
  var CORRESPONDENCE = 0.70;

  var OCCASIONS = 30;
  var SAMPLE = 300;
  var SEED = 20260419;

  var PEOPLE = [
    { id: "rowan", name: "Rowan",
      blurb: "Six years in the team, chairs half the meetings herself, works with people who argue openly and expect her to.",
      attitude: 0.86, norm: 0.85, control: 0.85, habit: 0.80, constraint: 0.15, opportunity: 0.85,
      teaching: "Everything lines up. Rowan is the case the questionnaire predicts well, and she is the reason attitude measures look good in some workplaces and not others." },
    { id: "devi", name: "Devi",
      blurb: "Four months in post, on a fixed-term contract. The chair keeps to time and closes items briskly, and nobody else has interrupted an item since she arrived.",
      attitude: 0.86, norm: 0.15, control: 0.20, habit: 0.10, constraint: 0.80, opportunity: 0.75,
      teaching: "The same score and the opposite behaviour. Nothing about Devi's evaluation differs from Rowan's. What differs is a contract, a chair and a room in which nobody has yet gone first." },
    { id: "marek", name: "Marek",
      blurb: "Fifteen years in, confident and well regarded, in a team whose meetings are almost entirely announcements. Disagreements are settled elsewhere, by people who are not him.",
      attitude: 0.86, norm: 0.60, control: 0.85, habit: 0.70, constraint: 0.25, opportunity: 0.15,
      teaching: "The important case. Every internal condition is as strong as Rowan's and the behaviour is rare, because the occasion does not arise. A course aimed at Marek's attitude would change nothing at all." },
    { id: "priya", name: "Priya",
      blurb: "Two years in and well established, in a team that argues sometimes and not always comfortably. The chair is fair but the agenda is long.",
      attitude: 0.86, norm: 0.50, control: 0.55, habit: 0.40, constraint: 0.50, opportunity: 0.60,
      teaching: "The ordinary case, and the one most people are. Middling conditions produce a middling frequency, which no single number about Priya would have told you." }
  ];

  function logistic(x) { return 1 / (1 + Math.exp(-x)); }

  function likelihood(v) {
    var logit = B.intercept +
      B.attitude * CORRESPONDENCE * v.attitude +
      B.norm * v.norm +
      B.control * v.control +
      B.habit * v.habit -
      B.constraint * v.constraint;
    return logistic(logit) * v.opportunity;
  }

  function meetings(v) { return Math.round(likelihood(v) * OCCASIONS); }

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

  /* Attitudes, condition draws and occasion draws, generated once. Both
     regimes reuse them, so nothing about any of the three hundred people
     differs between the two pictures. */
  var COHORT = (function () {
    var random = mulberry32(SEED);
    var out = [];
    for (var i = 0; i < SAMPLE; i += 1) {
      var conditions = [random(), random(), random(), random(), random()];
      var draws = [];
      for (var k = 0; k < OCCASIONS; k += 1) { draws.push(random()); }
      out.push({ attitude: 0, conditions: conditions, draws: draws });
    }
    /* Attitude is drawn first for every person so that the array is identical
       whatever else changes; it is filled in afterwards from its own stream. */
    var attitudeStream = mulberry32(SEED + 1);
    out.forEach(function (person) { person.attitude = attitudeStream(); });
    return out;
  }());

  /* Conditions when everybody is in the same kind of room. */
  var UNIFORM = { norm: 0.60, control: 0.60, habit: 0.50, constraint: 0.35, opportunity: 0.80 };

  function conditionsFor(person, uniform) {
    if (uniform) {
      return {
        attitude: person.attitude, norm: UNIFORM.norm, control: UNIFORM.control,
        habit: UNIFORM.habit, constraint: UNIFORM.constraint, opportunity: UNIFORM.opportunity
      };
    }
    var c = person.conditions;
    return {
      attitude: person.attitude, norm: c[0], control: c[1], habit: c[2],
      constraint: c[3], opportunity: 0.25 + 0.70 * c[4]
    };
  }

  function observed(person, uniform) {
    var p = likelihood(conditionsFor(person, uniform));
    var n = 0;
    person.draws.forEach(function (d) { if (d < p) { n += 1; } });
    return n / OCCASIONS;
  }

  function correlation(xs, ys) {
    var n = xs.length, mx = 0, my = 0;
    xs.forEach(function (v) { mx += v; });
    ys.forEach(function (v) { my += v; });
    mx /= n; my /= n;
    var sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i += 1) {
      sxy += (xs[i] - mx) * (ys[i] - my);
      sxx += (xs[i] - mx) * (xs[i] - mx);
      syy += (ys[i] - my) * (ys[i] - my);
    }
    return sxy / Math.sqrt(sxx * syy);
  }

  function correlationFor(uniform) {
    return correlation(
      COHORT.map(function (p) { return p.attitude; }),
      COHORT.map(function (p) { return observed(p, uniform); })
    );
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardFour;
  var peopleBody, blurbs, readout, fourSentence, marekBtn, toCorrBtn, note, noteText;
  var cardCorr, regimeBtn, regimeValue, corrReadout, chart, chartDesc, corrSentence;
  var explainBtn, synthesis, resultLead;

  var answered = false;
  var marekMoved = false;
  var uniform = false;
  var seenBoth = false;

  /* Every figure quoted in the feedback is computed from the model, so a
     change to a coefficient can never leave the prose asserting numbers the
     table contradicts. */
  var COUNTS = PEOPLE.map(function (p) { return meetings(p); });
  var HIGHEST = Math.max.apply(null, COUNTS);
  var LIST = COUNTS.slice(0, COUNTS.length - 1).join(", ") + " and " +
    COUNTS[COUNTS.length - 1];
  var AVERAGE = Math.round(COUNTS.reduce(function (a, b) { return a + b; }, 0) / COUNTS.length);

  var VERDICTS = {
    cannot: { state: "correct", text:
      "Correct. The score is a fact about Aisha and the meetings are not. " +
      "Below are four colleagues with exactly her score, whose answers to " +
      "that question are " + LIST + " meetings out of " + OCCASIONS + "." },
    most: { state: "incorrect", text:
      "This is what a strong score on a well-matched scale invites, and one " +
      "of the four people below does speak up in " + HIGHEST + " of the " +
      OCCASIONS + ". So do none of the other three, and nothing about their " +
      "attitude is different from hers." },
    some: { state: "partial", text:
      "As an average this is the closest of the four answers, and it is close " +
      "for the wrong reason. The four below average " + AVERAGE + " meetings " +
      "out of " + OCCASIONS + ", and not one of them is near that: they are " +
      "at " + LIST + ". An average across people whose conditions differ is " +
      "not a prediction about any of them." },
    few: { state: "incorrect", text:
      "This is the cynical reading and it is as wrong as the confident one. " +
      "People do act on what they believe, when the room lets them. One of " +
      "the four below speaks up in " + HIGHEST + " meetings out of " +
      OCCASIONS + " with exactly the score you have just dismissed." }
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
    wb.show(cardFour);
    renderFour();
    wb.scrollTo(cardFour);
    wb.announce("Four colleagues with the same attitude score.");
  }

  function toCorr() {
    wb.show(cardCorr);
    renderCorr();
    wb.scrollTo(cardCorr);
    wb.announce("Three hundred colleagues.");
  }

  /* ----------------------------------------------------------------- four */

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

  function currentOf(person) {
    if (marekMoved && person.id === "marek") {
      var moved = {};
      Object.keys(person).forEach(function (k) { moved[k] = person[k]; });
      moved.opportunity = 0.85;
      return moved;
    }
    return person;
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function renderFour() {
    peopleBody.textContent = "";
    PEOPLE.forEach(function (person) {
      var v = currentOf(person);
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", person.name, "row"));
      [v.attitude, v.norm, v.control, v.habit, v.constraint, v.opportunity]
        .forEach(function (n) { tr.appendChild(cell("td", n.toFixed(2))); });
      tr.appendChild(cell("td", meetings(v) + " of " + OCCASIONS));
      if (marekMoved && person.id === "marek") { tr.setAttribute("data-state", "chosen"); }
      peopleBody.appendChild(tr);
    });

    blurbs.textContent = "";
    PEOPLE.forEach(function (person) {
      var box = el("div", "block");
      box.appendChild(el("p", "step-label", person.name + ", " +
        meetings(currentOf(person)) + " of " + OCCASIONS + " meetings"));
      box.appendChild(el("p", "small", person.blurb));
      box.appendChild(el("p", "small", person.teaching));
      blurbs.appendChild(box);
    });

    var counts = PEOPLE.map(function (p) { return meetings(currentOf(p)); });
    readout.textContent = "";
    readout.appendChild(tile("Attitude scores in the table", "1",
      "the same 0.86 for all four of them", "correct"));
    readout.appendChild(tile("Different answers to the question",
      String(new Set(counts).size),
      "out of the four people"));
    readout.appendChild(tile("Widest gap between two of them",
      (Math.max.apply(null, counts) - Math.min.apply(null, counts)) + " meetings",
      "between people who scored identically"));

    fourSentence.textContent =
      "Coefficients, printed so they can be argued with: intercept " +
      B.intercept.toFixed(2) + ", attitude " + B.attitude.toFixed(2) +
      " weighted by a correspondence of " + CORRESPONDENCE.toFixed(2) +
      ", norm " + B.norm.toFixed(2) + ", control " + B.control.toFixed(2) +
      ", habit " + B.habit.toFixed(2) + ", constraint " + B.constraint.toFixed(2) +
      " subtracted, and opportunity multiplying the result rather than adding " +
      "to it.";
  }

  function moveMarek() {
    if (marekMoved) { return; }
    var before = meetings(PEOPLE[2]);
    marekMoved = true;
    renderFour();
    var after = meetings(currentOf(PEOPLE[2]));
    marekBtn.setAttribute("aria-disabled", "true");
    marekBtn.textContent = "Marek is now in Rowan's room";
    noteText.textContent =
      "One number changed: Marek's opportunity, from 0.15 to 0.85. His " +
      "attitude, his sense of the norm, his confidence, his habit and the " +
      "constraint on him are all exactly what they were. He goes from " +
      before + " meetings out of " + OCCASIONS + " to " + after + ". That is " +
      "what it means for opportunity to multiply rather than add: no amount " +
      "of anything else compensates for an occasion that does not arise, and " +
      "any intervention aimed at Marek rather than at his meetings was " +
      "always going to fail.";
    wb.show(note);
    wb.announce("Marek's opportunity raised to Rowan's. He now speaks up in " +
      after + " of " + OCCASIONS + " meetings.");
  }

  /* ----------------------------------------------------------------- corr */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 120, RIGHT = 700, TOP = 58, BOTTOM = 330;

  function renderCorr() {
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var xOf = function (v) { return LEFT + v * (RIGHT - LEFT); };
    var yOf = function (v) { return BOTTOM - v * (BOTTOM - TOP); };

    [0, 0.25, 0.5, 0.75, 1].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
        class: "plot__axis", opacity: 0.45
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = Math.round(v * OCCASIONS) + "";
      chart.appendChild(tick);
      var xtick = svg("text", {
        x: xOf(v).toFixed(1), y: BOTTOM + 22, "text-anchor": "middle", class: "plot__tick"
      });
      xtick.textContent = v.toFixed(2);
      chart.appendChild(xtick);
    });

    var yTitle = svg("text", { x: 4, y: TOP - 26, class: "plot__label" });
    yTitle.textContent = "Meetings out of thirty in which they spoke up";
    chart.appendChild(yTitle);
    var xTitle = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 46,
      "text-anchor": "middle", class: "plot__label"
    });
    xTitle.textContent = "Attitude score, identical in both versions";
    chart.appendChild(xTitle);

    COHORT.forEach(function (person) {
      chart.appendChild(svg("circle", {
        cx: xOf(person.attitude).toFixed(1),
        cy: yOf(observed(person, uniform)).toFixed(1),
        r: 3, fill: uniform ? "#25634F" : "#1C7293", opacity: 0.5
      }));
    });

    var r = correlationFor(uniform);
    chartDesc.textContent =
      "Three hundred markers, one per person, with attitude score across and " +
      "the share of thirty meetings in which they spoke up going up. In the " +
      (uniform ? "version where everybody is in the same kind of room"
        : "version with the conditions that real teams have") +
      " the correlation between the two is " + r.toFixed(2) + ". In the other " +
      "version, with exactly the same attitude scores, it is " +
      correlationFor(!uniform).toFixed(2) + ".";

    corrReadout.textContent = "";
    corrReadout.appendChild(tile("Correlation now", r.toFixed(2),
      uniform ? "everybody in the same kind of room" : "conditions as real teams have them"));
    corrReadout.appendChild(tile("In the other version",
      correlationFor(!uniform).toFixed(2), "the same three hundred attitude scores"));
    corrReadout.appendChild(tile("Variance accounted for",
      Math.round(r * r * 100) + "%",
      "against " + Math.round(correlationFor(!uniform) * correlationFor(!uniform) * 100) +
      " per cent in the other"));

    corrSentence.textContent = seenBoth
      ? "Both versions use the same three hundred attitude scores and the same " +
        "thirty occasions for each person. Every marker sits at exactly the " +
        "same place across the page in both, and only their heights change. " +
        "The difference between a correlation of " + correlationFor(false).toFixed(2) +
        " and one of " + correlationFor(true).toFixed(2) + " is a fact about " +
        "the rooms."
      : "Press the button above and watch the markers move up and down but " +
        "never left or right.";
  }

  function toggleRegime() {
    uniform = !uniform;
    seenBoth = true;
    explainBtn.disabled = false;
    regimeBtn.setAttribute("aria-pressed", uniform ? "true" : "false");
    regimeBtn.textContent = uniform
      ? "Put them back in the teams they were in"
      : "Put everybody in the same kind of room";
    regimeValue.textContent = uniform ? "everybody in the same room" : "real teams";
    renderCorr();
    wb.announce((uniform ? "Everybody in the same kind of room. " : "Back to real teams. ") +
      "The correlation is now " + correlationFor(uniform).toFixed(2) + ".");
  }

  function explain() {
    resultLead.textContent =
      "Four colleagues with a score of 0.86 speak up in " +
      PEOPLE.map(function (p) { return meetings(currentOf(p)); }).join(", ") +
      " of thirty meetings. Across three hundred people the attitude score " +
      "correlates " + correlationFor(false).toFixed(2) + " with behaviour in " +
      "ordinary teams and " + correlationFor(true).toFixed(2) + " when " +
      "everybody is in the same kind of room, on identical attitude scores.";
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
    cardFour = wb.root.querySelector("#card-four");
    peopleBody = wb.root.querySelector("#people-body");
    blurbs = wb.root.querySelector("#blurbs");
    readout = wb.root.querySelector("#readout");
    fourSentence = wb.root.querySelector("#four-sentence");
    marekBtn = wb.root.querySelector("#marek");
    toCorrBtn = wb.root.querySelector("#tocorr");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    cardCorr = wb.root.querySelector("#card-corr");
    regimeBtn = wb.root.querySelector("#regime");
    regimeValue = wb.root.querySelector("#regime-value");
    corrReadout = wb.root.querySelector("#corr-readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    corrSentence = wb.root.querySelector("#corr-sentence");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    marekBtn.addEventListener("click", moveMarek);
    toCorrBtn.addEventListener("click", toCorr);
    regimeBtn.addEventListener("click", toggleRegime);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      marekMoved = false;
      uniform = false;
      seenBoth = false;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardFour);
      wb.hide(cardCorr);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      marekBtn.removeAttribute("aria-disabled");
      marekBtn.textContent = "Give Marek the room Rowan is in";
      regimeBtn.setAttribute("aria-pressed", "false");
      regimeBtn.textContent = "Put everybody in the same kind of room";
      regimeValue.textContent = "real teams";
      renderFour();
      renderCorr();
    });

    renderFour();
    renderCorr();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
