/* =========================================================================
   Attitude-Behaviour Gap Laboratory
   -------------------------------------------------------------------------
   One fictional behaviour - speaking up when you disagree in a team meeting -
   and two staged experiments on what stands between a measured evaluation and
   an act.

       1. Four colleagues, identical attitude scores, four working lives
       2. Marek, and one condition

   THE SHAPE OF THE ACTIVITY
   -------------------------
   The whole teaching point is reached with one slider. Four colleagues answer
   the same item - "I speak up when I disagree in a team meeting" - identically,
   and behave differently. The learner predicts, is shown the estimates, then
   takes Marek, whose attitude is as strong as Rowan's and whose behaviour is
   rare, and moves OPPORTUNITY. His behaviour changes; his attitude does not.
   That is the gap, and it needs no understanding of the model beneath it.

   Everything else is optional depth and is collapsed so that it cannot compete:
   the other five conditions and the correspondence control sit behind "More of
   the situation", and the population-level argument - where a correlation
   between attitude and behaviour comes from, and how restricting the range of
   conditions inflates it - sits behind "Go deeper", with its own controls.

   THE EDUCATIONAL MODEL
   ---------------------
   A small logistic model in the reasoned-action family, with every coefficient
   printed on screen:

       logit = B0 + Battitude x c x A + Bnorm x N + Bpbc x P + Bhabit x H
                  - Bconstraint x C
       p     = logistic(logit) x O

   A, N, P, H, C and O all run from 0 to 1. `c` is the correspondence weight of
   the questionnaire: a general values scale carries less of the person's
   disposition into a specific act than a matched intention does.

   The one structural point worth more than all the coefficients: OPPORTUNITY
   MULTIPLIES. Norms, confidence and habit shift the odds; if the occasion does
   not arise, nothing else matters. Marek is written to make that visible - his
   internal conditions match Rowan's and his behaviour does not.

   Experiment 3 draws 300 simulated colleagues from a seeded generator
   (mulberry32, seed 20260419). Attitude comes from the same distribution in
   every condition. Only the VARIANCE OF THE CONDITIONS changes: under "uniform
   conditions" everyone gets the same chaired meeting, the same standing and the
   same opportunity, so attitude is the only thing left varying and the
   correlation is high; under "real teams" the conditions vary as much as the
   attitudes and the correlation falls. Nothing about anybody's attitude has
   changed.

   WHAT THIS IS NOT
   ----------------
   A simulation cannot test a theory. The coefficients are invented, the
   correlations that follow from them are not findings, and no number here
   estimates anything. Six conditions is a deliberate simplification. The tool
   takes no position on whether voicing disagreement is a good idea - it
   estimates a frequency, not a virtue, and the costs of speaking up fall very
   unevenly across a workforce.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     Coefficients - printed in the interface and in the teaching notes
     ===================================================================== */

  var B = {
    intercept: -1.30,
    attitude: 2.60,
    norm: 1.30,
    control: 1.50,
    habit: 1.40,
    constraint: 1.80
  };

  var CORRESPONDENCE = {
    general: { weight: 0.35, label: "a general values questionnaire" },
    middle: { weight: 0.70, label: "a behaviour-level attitude scale" },
    specific: { weight: 1.00, label: "a specific intention matched to the action" }
  };

  var CONDITIONS = [
    {
      id: "attitude", label: "Attitude towards the behaviour", coefficient: "attitude",
      hint: "How positively the person evaluates speaking up. This is what the questionnaire measured.",
      low: "strongly negative", high: "strongly positive", gate: false
    },
    {
      id: "norm", label: "Perceived norm in this team", coefficient: "norm",
      hint: "Whether people who matter here appear to expect or approve of it.",
      low: "nobody does it", high: "everybody does it", gate: false
    },
    {
      id: "control", label: "Perceived behavioural control", coefficient: "control",
      hint: "Whether the person believes they could do it if they chose to - standing, confidence, the words to hand.",
      low: "not up to me", high: "entirely up to me", gate: false
    },
    {
      id: "habit", label: "Habit strength", coefficient: "habit",
      hint: "How automatic the response has become through repetition in this setting.",
      low: "never done it here", high: "does it without deciding to", gate: false
    },
    {
      id: "constraint", label: "Situational constraint", coefficient: "constraint",
      hint: "Features of the meeting that make it harder: a chair who closes discussion, a short agenda, a senior person present.",
      low: "none", high: "severe", gate: false
    },
    {
      id: "opportunity", label: "Opportunity", coefficient: null,
      hint: "How often an occasion to disagree actually arises. This one multiplies rather than adds: no occasion, no behaviour, whatever else is true.",
      low: "almost never arises", high: "arises constantly", gate: true
    }
  ];

  var PEOPLE = [
    {
      id: "rowan",
      name: "Rowan",
      blurb:
        "Six years in the team, chairs half the meetings herself, works with " +
        "people who argue openly and expect her to.",
      attitude: 0.86, norm: 0.85, control: 0.85, habit: 0.80,
      constraint: 0.15, opportunity: 0.85,
      teaching:
        "Everything lines up. Rowan is the case the questionnaire predicts " +
        "well, and she is the reason attitude measures look good in some " +
        "workplaces and not others."
    },
    {
      id: "devi",
      name: "Devi",
      blurb:
        "Four months in post, on a fixed-term contract. The chair keeps to " +
        "time and closes items briskly; nobody else has interrupted an item " +
        "since she arrived.",
      attitude: 0.86, norm: 0.15, control: 0.20, habit: 0.10,
      constraint: 0.80, opportunity: 0.75,
      teaching:
        "Same score, opposite behaviour. Nothing about Devi's evaluation is " +
        "different from Rowan's. What differs is a contract, a chair and a " +
        "room in which nobody has yet gone first."
    },
    {
      id: "marek",
      name: "Marek",
      blurb:
        "Fifteen years in, confident, well regarded, and in a team whose " +
        "meetings are almost entirely announcements. Disagreements are settled " +
        "elsewhere, by people who are not him.",
      attitude: 0.86, norm: 0.60, control: 0.85, habit: 0.70,
      constraint: 0.25, opportunity: 0.15,
      teaching:
        "The important case. Every internal condition is as strong as " +
        "Rowan's, and the behaviour is rare, because the occasion does not " +
        "arise. A course aimed at Marek's attitude would change nothing at all."
    },
    {
      id: "priya",
      name: "Priya",
      blurb:
        "Two years in, well established, in a team that argues sometimes and " +
        "not always comfortably. The chair is fair but the agenda is long.",
      attitude: 0.86, norm: 0.50, control: 0.55, habit: 0.40,
      constraint: 0.50, opportunity: 0.60,
      teaching:
        "The ordinary case, and the one most people are. Middling conditions " +
        "produce a middling frequency, which no single number about Priya " +
        "would have told you."
    }
  ];

  var BANDS = [
    { max: 0.20, id: "rarely", label: "Rarely" },
    { max: 0.55, id: "sometimes", label: "Sometimes" },
    { max: 1.01, id: "usually", label: "Usually" }
  ];

  /* =======================================================================
     Model
     ===================================================================== */

  function logistic(x) { return 1 / (1 + Math.exp(-x)); }

  function contributions(values, correspondence) {
    var weight = CORRESPONDENCE[correspondence].weight;
    return [
      { id: "intercept", label: "Baseline", value: B.intercept },
      { id: "attitude", label: "Attitude", value: B.attitude * weight * values.attitude },
      { id: "norm", label: "Perceived norm", value: B.norm * values.norm },
      { id: "control", label: "Perceived control", value: B.control * values.control },
      { id: "habit", label: "Habit", value: B.habit * values.habit },
      { id: "constraint", label: "Situational constraint", value: -B.constraint * values.constraint }
    ];
  }

  function likelihood(values, correspondence) {
    var logit = contributions(values, correspondence).reduce(function (total, item) {
      return total + item.value;
    }, 0);
    return logistic(logit) * values.opportunity;
  }

  function bandFor(p) {
    var found = BANDS[BANDS.length - 1];
    for (var i = 0; i < BANDS.length; i += 1) {
      if (p < BANDS[i].max) { found = BANDS[i]; break; }
    }
    return found;
  }

  /* =======================================================================
     The simulated sample for experiment 3
     ===================================================================== */

  var SEED = 20260419;
  var SAMPLE = 300;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Attitudes are drawn once and reused in every cell, so that switching the
     setting or the measure cannot be explained by a different sample. */
  var DRAWS = (function () {
    var rand = mulberry32(SEED);
    var rows = [];
    for (var i = 0; i < SAMPLE; i += 1) {
      rows.push({
        attitude: 0.15 + 0.75 * rand(),
        norm: rand(), control: rand(), habit: rand(),
        constraint: rand(), opportunity: rand(),
        noise: rand()
      });
    }
    return rows;
  })();

  var UNIFORM = { norm: 0.5, control: 0.55, habit: 0.4, constraint: 0.4, opportunity: 0.75 };

  function sampleFor(setting, measure) {
    return DRAWS.map(function (draw) {
      var values = setting === "lab"
        ? {
            attitude: draw.attitude,
            norm: UNIFORM.norm, control: UNIFORM.control, habit: UNIFORM.habit,
            constraint: UNIFORM.constraint, opportunity: UNIFORM.opportunity
          }
        : {
            /* Real teams vary, but not from floor to ceiling: the ranges below
               keep the field correlations in the region reported for
               well-matched measures rather than driving them to zero. */
            attitude: draw.attitude,
            norm: 0.2 + 0.6 * draw.norm,
            control: 0.2 + 0.6 * draw.control,
            habit: 0.15 + 0.6 * draw.habit,
            constraint: 0.15 + 0.6 * draw.constraint,
            opportunity: 0.45 + 0.55 * draw.opportunity
          };
      var p = likelihood(values, measure);
      /* Observed behaviour is the model probability plus a little measurement
         noise, clipped to the unit interval. The noise is the same draw in
         every cell. */
      var observed = Math.min(1, Math.max(0, p + (draw.noise - 0.5) * 0.12));
      return { attitude: draw.attitude, behaviour: observed };
    });
  }

  function correlation(rows) {
    var n = rows.length;
    var mx = 0, my = 0;
    rows.forEach(function (row) { mx += row.attitude; my += row.behaviour; });
    mx /= n; my /= n;
    var sxy = 0, sxx = 0, syy = 0;
    rows.forEach(function (row) {
      var dx = row.attitude - mx;
      var dy = row.behaviour - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    });
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(p) { return Math.round(p * 100) + "%"; }

  function fmt(value) {
    var rounded = Math.round(Math.abs(value) * 100) / 100;
    return (value < 0 ? "-" : "") + rounded.toFixed(2);
  }

  function personById(id) {
    return PEOPLE.filter(function (p) { return p.id === id; })[0];
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#ab-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var predictionBox = $("[data-person-predictions]");
  var sliderBox = $("[data-sliders]");
  var sliderBoxMore = $("[data-sliders-more]");
  var personSelect = $("#person-select");
  var correspondenceSelect = $("#correspondence-select");
  var peopleTable = $("[data-people-table]");
  var peopleNote = $("[data-people-note]");
  var likelihoodLine = $("[data-likelihood]");
  var driverLine = $("[data-driver]");
  var contributionSvg = $("[data-contributions]");
  var contributionTable = $("[data-contribution-table]");
  var interpretation = $("[data-interpretation]");
  var correlationLine = $("[data-correlation]");
  var scatterSvg = $("[data-scatter]");
  var scatterText = $("[data-scatter-text]");
  var matrixTable = $("[data-matrix-table]");
  var matrixNote = $("[data-matrix-note]");
  var gateNote = $("[data-gate-note]");
  var stageTrack = $("[data-stage-track]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var STAGE_COUNT = 2;

  /* Experiment 2 opens with one slider: OPPORTUNITY, the condition that
     multiplies rather than adds. The attitude stays where the questionnaire
     put it, which is the point - behaviour moves while the attitude does not.
     The other five conditions are one disclosure away and the model is
     unchanged. */
  var CONDITION_CORE = ["opportunity"];

  var INITIAL = {
    stage: 1,
    unlocked: false,
    predictions: {},
    revealed: false,
    person: "marek",
    values: null,
    correspondence: "middle",
    setting: "lab",
    measure: "middle"
  };
  var state = null;

  function valuesFor(person) {
    return {
      attitude: person.attitude, norm: person.norm, control: person.control,
      habit: person.habit, constraint: person.constraint,
      opportunity: person.opportunity
    };
  }

  /* --- Experiment 1 ------------------------------------------------------- */

  function buildPredictions() {
    clear(predictionBox);
    PEOPLE.forEach(function (person) {
      var group = make("fieldset", "person");
      var legend = make("legend", "person__legend", person.name);
      group.appendChild(legend);
      group.appendChild(make("p", "person__blurb", person.blurb));
      BANDS.forEach(function (band) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "predict-" + person.id;
        input.value = band.id;
        input.addEventListener("change", function () {
          state.predictions[person.id] = band.id;
          renderPeople();
        });
        label.appendChild(input);
        label.appendChild(make("span", null, band.label));
        group.appendChild(label);
      });
      predictionBox.appendChild(group);
    });
  }

  function renderPeople() {
    clear(peopleTable);
    PEOPLE.forEach(function (person) {
      var row = make("tr");
      var th = make("th", null, person.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, "6.2 of 7"));
      var said = state.predictions[person.id];
      row.appendChild(make("td", null,
        said ? BANDS.filter(function (b) { return b.id === said; })[0].label : "-"));
      if (state.revealed) {
        var p = likelihood(valuesFor(person), "middle");
        var band = bandFor(p);
        var td = make("td", null, pct(p) + " of occasions - " + band.label.toLowerCase());
        td.setAttribute("data-match",
          said ? (said === band.id ? "yes" : "no") : "none");
        row.appendChild(td);
      } else {
        row.appendChild(make("td", null, "hidden"));
      }
      peopleTable.appendChild(row);
    });

    if (!state.revealed) {
      var made = Object.keys(state.predictions).length;
      peopleNote.textContent =
        "Predict all four, then press the button. " + made + " of 4 predicted.";
      peopleNote.setAttribute("data-state", "none");
      return;
    }

    var right = PEOPLE.filter(function (person) {
      var p = likelihood(valuesFor(person), "middle");
      return state.predictions[person.id] === bandFor(p).id;
    }).length;

    peopleNote.textContent =
      right + " of your 4 predictions match the model. " +
      "Every one of these people scores 6.2, and the questionnaire that " +
      "produced the 6.2 is a perfectly good questionnaire. " +
      PEOPLE.map(function (person) {
        return person.name + ": " + person.teaching;
      }).join(" ");
    peopleNote.setAttribute("data-state", right >= 3 ? "ok" : "tension");
  }

  /* --- Experiment 2 ------------------------------------------------------- */

  function buildSliders() {
    clear(sliderBox);
    clear(sliderBoxMore);
    CONDITIONS.forEach(function (condition) {
      var host = CONDITION_CORE.indexOf(condition.id) === -1 ? sliderBoxMore : sliderBox;
      var wrap = make("div", "control");
      var header = make("div", "control__header");
      var label = make("label", "control__label", condition.label);
      label.setAttribute("for", "slider-" + condition.id);
      header.appendChild(label);
      var output = document.createElement("output");
      output.className = "control__value";
      output.setAttribute("for", "slider-" + condition.id);
      output.setAttribute("data-output", condition.id);
      header.appendChild(output);
      wrap.appendChild(header);

      var input = document.createElement("input");
      input.type = "range";
      input.id = "slider-" + condition.id;
      input.min = "0"; input.max = "100"; input.step = "1"; input.value = "50";
      input.addEventListener("input", function () {
        state.values[condition.id] = Number(input.value) / 100;
        renderExperiment2();
        shell.announce(condition.label + " set to " + input.value + " per cent. " +
          "Estimated behaviour " + pct(likelihood(state.values, state.correspondence)) +
          " of occasions.");
      });
      wrap.appendChild(input);
      wrap.appendChild(make("p", "control__hint",
        condition.hint +
        (condition.coefficient
          ? " Coefficient " + fmt(condition.id === "constraint"
              ? -B[condition.coefficient] : B[condition.coefficient]) + "."
          : " Multiplies the result.")));
      host.appendChild(wrap);
    });
  }

  function syncSliders() {
    CONDITIONS.forEach(function (condition) {
      var input = $("#slider-" + condition.id);
      var output = $('[data-output="' + condition.id + '"]');
      var value = Math.round(state.values[condition.id] * 100);
      input.value = String(value);
      output.textContent = value + "%";
      input.setAttribute("aria-valuetext",
        value + " per cent, between " + condition.low + " and " + condition.high);
    });
    personSelect.value = state.person;
    correspondenceSelect.value = state.correspondence;
  }

  function renderExperiment2() {
    syncSliders();
    var p = likelihood(state.values, state.correspondence);
    var band = bandFor(p);
    likelihoodLine.textContent =
      pct(p) + " of occasions - " + band.label.toLowerCase() + ".";

    var items = contributions(state.values, state.correspondence);

    /* One sentence naming the largest positive term, the largest negative term
       and the multiplier: the pinned result has to answer "what is driving
       this?" without the learner scrolling to the chart. */
    var positives = items.filter(function (i) {
      return i.id !== "intercept" && i.value > 0;
    }).sort(function (a, b) { return b.value - a.value; });
    var negative = items.filter(function (i) {
      return i.id !== "intercept" && i.value < 0;
    }).sort(function (a, b) { return a.value - b.value; })[0];
    driverLine.textContent =
      "Largest positive term: " +
      (positives.length ? positives[0].label.toLowerCase() + " (" + fmt(positives[0].value) + ")"
        : "none") +
      ". Largest drag: " +
      (negative ? negative.label.toLowerCase() + " (" + fmt(negative.value) + ")"
        : "none") +
      ". Opportunity multiplies the result by " +
      (Math.round(state.values.opportunity * 100) / 100).toFixed(2) + ".";

    drawContributions(items, p);

    clear(contributionTable);
    items.forEach(function (item) {
      var row = make("tr");
      var th = make("th", null, item.label);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null,
        item.id === "intercept" ? "fixed"
          : Math.round(state.values[item.id] * 100) + "%"));
      row.appendChild(make("td", null, fmt(item.value) + " log-odds"));
      contributionTable.appendChild(row);
    });
    var gateRow = make("tr");
    var gateTh = make("th", null, "Opportunity (multiplies)");
    gateTh.setAttribute("scope", "row");
    gateRow.appendChild(gateTh);
    gateRow.appendChild(make("td", null,
      Math.round(state.values.opportunity * 100) + "%"));
    gateRow.appendChild(make("td", null,
      "x" + (Math.round(state.values.opportunity * 100) / 100).toFixed(2)));
    contributionTable.appendChild(gateRow);

    clear(interpretation);
    interpretation.setAttribute("data-tone",
      state.values.opportunity < 0.3 ? "warn" : "neutral");
    interpretation.appendChild(make("h5", "verdict__title",
      "What the questionnaire would have told you"));
    var weight = CORRESPONDENCE[state.correspondence];
    interpretation.appendChild(make("p", "verdict__body",
      "The measure in use is " + weight.label + ", which carries " +
      Math.round(weight.weight * 100) + " per cent of the person's disposition " +
      "into this particular act. Change the measure and the estimate moves " +
      "without the person changing at all - that is a property of the " +
      "instrument, not of them."));
    if (state.values.opportunity < 0.3) {
      interpretation.appendChild(make("p", "verdict__body",
        "Opportunity is low. Notice what happens when you push attitude, norm, " +
        "control and habit all the way up: the estimate barely moves, because " +
        "the multiplier caps it. Anything aimed at the person is being aimed at " +
        "the wrong term."));
    } else if (state.values.constraint > 0.65) {
      interpretation.appendChild(make("p", "verdict__body",
        "Constraint is high, and it is subtracting more from the log-odds than " +
        "norm and control together are adding. The cheapest available " +
        "intervention here is not a person at all: it is the way the meeting is " +
        "run."));
    } else {
      interpretation.appendChild(make("p", "verdict__body",
        "Nothing is dominating. This is the regime in which individual-level " +
        "models predict best and explain least: every term contributes, and no " +
        "single one tells you where to intervene."));
    }
  }

  function drawContributions(items, p) {
    var NS = "http://www.w3.org/2000/svg";
    clear(contributionSvg);
    var rows = items.concat([
      { id: "gate", label: "Opportunity x", value: null }
    ]);
    var mid = 190;
    var scale = 26;
    var y = 8;
    rows.forEach(function (item) {
      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", String(y + 12));
      text.setAttribute("class", "chart__label");
      text.textContent = item.label;
      contributionSvg.appendChild(text);

      if (item.value === null) {
        var mult = document.createElementNS(NS, "text");
        mult.setAttribute("x", String(mid));
        mult.setAttribute("y", String(y + 12));
        mult.setAttribute("text-anchor", "middle");
        mult.setAttribute("class", "chart__count");
        mult.textContent = "x" + (Math.round(state.values.opportunity * 100) / 100).toFixed(2) +
          "  =  " + pct(p);
        contributionSvg.appendChild(mult);
        y += 22;
        return;
      }

      var width = Math.min(110, Math.abs(item.value) * scale);
      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(item.value >= 0 ? mid : mid - width));
      bar.setAttribute("y", String(y + 2));
      bar.setAttribute("width", String(Math.max(1, width)));
      bar.setAttribute("height", "14");
      bar.setAttribute("class", item.value >= 0 ? "bar--adds" : "bar--subtracts");
      contributionSvg.appendChild(bar);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(item.value >= 0 ? mid + width + 4 : mid - width - 4));
      value.setAttribute("y", String(y + 13));
      value.setAttribute("text-anchor", item.value >= 0 ? "start" : "end");
      value.setAttribute("class", "chart__count");
      value.textContent = fmt(item.value);
      contributionSvg.appendChild(value);

      y += 22;
    });

    var axis = document.createElementNS(NS, "line");
    axis.setAttribute("x1", String(mid)); axis.setAttribute("x2", String(mid));
    axis.setAttribute("y1", "4"); axis.setAttribute("y2", String(y - 20));
    axis.setAttribute("class", "chart__baseline");
    contributionSvg.appendChild(axis);
  }

  /* --- Experiment 3 ------------------------------------------------------- */

  function renderExperiment3() {
    var rows = sampleFor(state.setting, state.measure);
    var r = correlation(rows);
    correlationLine.textContent =
      "r = " + fmt(r) + " between measured attitude and behaviour (" +
      Math.round(r * r * 100) + "% of the variance).";

    drawScatter(rows);

    /* Text equivalent for the scatterplot: the same information in words. */
    var high = rows.filter(function (row) { return row.attitude > 0.7; });
    var meanHigh = high.length
      ? high.reduce(function (t, r) { return t + r.behaviour; }, 0) / high.length : 0;
    var low = rows.filter(function (row) { return row.attitude < 0.4; });
    var meanLow = low.length
      ? low.reduce(function (t, r) { return t + r.behaviour; }, 0) / low.length : 0;
    scatterText.textContent =
      "300 simulated colleagues, " + CORRESPONDENCE[state.measure].label + ", " +
      (state.setting === "lab" ? "uniform conditions" : "real teams") +
      ". r = " + fmt(r) + ". The " + high.length + " people scoring above 0.7 on " +
      "the measure average " + pct(meanHigh) + " of occasions; the " + low.length +
      " scoring below 0.4 average " + pct(meanLow) + ". The spread within each " +
      "group is what the correlation leaves unexplained.";

    clear(matrixTable);
    ["general", "middle", "specific"].forEach(function (measure) {
      var row = make("tr");
      var th = make("th", null, CORRESPONDENCE[measure].label);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      ["lab", "field"].forEach(function (setting) {
        var value = correlation(sampleFor(setting, measure));
        var td = make("td", null, fmt(value));
        if (setting === state.setting && measure === state.measure) {
          td.setAttribute("data-emphasis", "yes");
        }
        row.appendChild(td);
      });
      matrixTable.appendChild(row);
    });

    clear(matrixNote);
    matrixNote.setAttribute("data-tone", "neutral");
    matrixNote.appendChild(make("h5", "verdict__title",
      "Two different reasons the correlation moves"));
    matrixNote.appendChild(make("p", "verdict__body",
      "Down a column: the measure changes, the people do not. A general values " +
      "scale asks about something broader than the act, so less of what it " +
      "measures is relevant to whether this person speaks up on Thursday."));
    matrixNote.appendChild(make("p", "verdict__body",
      "Across a row: the setting changes, the people and the measure do not. " +
      "Under uniform conditions attitude is nearly the only thing left " +
      "varying, so it accounts for most of the differences. In real teams the " +
      "conditions vary too, and they are not in the questionnaire."));
    matrixNote.appendChild(make("p", "verdict__note",
      "Every cell uses the same 300 simulated people and the same attitude " +
      "draws, so nothing here can be explained by a different sample."));
  }

  function drawScatter(rows) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 260, H = 210;
    var left = 34, right = 8, top = 8, bottom = 30;
    clear(scatterSvg);

    var frame = document.createElementNS(NS, "rect");
    frame.setAttribute("x", String(left)); frame.setAttribute("y", String(top));
    frame.setAttribute("width", String(W - left - right));
    frame.setAttribute("height", String(H - top - bottom));
    frame.setAttribute("class", "chart__track");
    scatterSvg.appendChild(frame);

    rows.forEach(function (row) {
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(left + row.attitude * (W - left - right)));
      dot.setAttribute("cy", String(H - bottom - row.behaviour * (H - top - bottom)));
      dot.setAttribute("r", "2");
      dot.setAttribute("class", "chart__point");
      scatterSvg.appendChild(dot);
    });

    var x = document.createElementNS(NS, "text");
    x.setAttribute("x", String(W / 2)); x.setAttribute("y", String(H - 8));
    x.setAttribute("text-anchor", "middle");
    x.setAttribute("class", "chart__axis");
    x.textContent = "measured attitude";
    scatterSvg.appendChild(x);

    var y = document.createElementNS(NS, "text");
    y.setAttribute("x", "0"); y.setAttribute("y", String(top + 10));
    y.setAttribute("class", "chart__axis");
    y.textContent = "behaviour";
    scatterSvg.appendChild(y);
  }

  /* --- Stage plumbing ----------------------------------------------------- */

  var GATES = [
    null,
    function () {
      if (Object.keys(state.predictions).length < PEOPLE.length) {
        return "Predict all four colleagues before continuing.";
      }
      return state.revealed
        ? null : "Press \"Show the model's answers\" before continuing.";
    },
    function () { return null; }
  ];

  function setStage(next) {
    state.stage = Math.max(1, Math.min(STAGE_COUNT, next));
    render();
    var heading = $('.stage__primary[data-stage="' + state.stage + '"] .stage__heading');
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    shell.announce("Experiment " + state.stage + " of " + STAGE_COUNT + ".",
      { immediate: true });
  }

  $('[data-action="next"]').addEventListener("click", function () {
    var blocked = GATES[state.stage] ? GATES[state.stage]() : null;
    if (blocked) {
      gateNote.textContent = blocked;
      shell.announce(blocked, { immediate: true });
      return;
    }
    gateNote.textContent = "";
    setStage(state.stage + 1);
  });

  $('[data-action="prev"]').addEventListener("click", function () {
    gateNote.textContent = "";
    setStage(state.stage - 1);
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    if (Object.keys(state.predictions).length < PEOPLE.length) {
      gateNote.textContent = "Predict all four colleagues first.";
      shell.announce(gateNote.textContent, { immediate: true });
      return;
    }
    state.revealed = true;
    gateNote.textContent = "";
    renderPeople();
    shell.announce(
      "Revealed. Four identical attitude scores, four different frequencies.",
      { immediate: true });
  });

  function render() {
    $$("[data-stage]", shell.root).forEach(function (node) {
      if (node.parentNode === stageTrack) { return; }
      node.hidden = node.getAttribute("data-stage") !== String(state.stage);
    });
    $$("[data-secondary]", shell.root).forEach(function (node) {
      node.hidden = node.getAttribute("data-secondary") !== String(state.stage);
    });
    $$("li", stageTrack).forEach(function (node) {
      var index = Number(node.getAttribute("data-stage"));
      node.removeAttribute("aria-current");
      node.removeAttribute("data-state");
      if (index === state.stage) {
        node.setAttribute("aria-current", "step");
      } else if (index < state.stage) {
        node.setAttribute("data-state", "done");
      }
    });
    $('[data-action="prev"]').disabled = state.stage === 1;
    var next = $('[data-action="next"]');
    next.disabled = state.stage === STAGE_COUNT;
    /* Name the destination rather than the direction, so a learner on
       experiment 2 can see that a third one exists and what it costs to
       reach it. */
    next.textContent = state.stage === STAGE_COUNT
      ? "Next experiment"
      : "Go to Experiment " + (state.stage + 1);

    renderPeople();
    renderExperiment2();
    renderExperiment3();
  }

  /* --- Stage 2 and 3 controls ---------------------------------------------- */

  function buildPersonSelect() {
    clear(personSelect);
    PEOPLE.forEach(function (person) {
      var option = document.createElement("option");
      option.value = person.id;
      option.textContent = person.name + " - " + person.blurb.split(".")[0];
      personSelect.appendChild(option);
    });
  }

  personSelect.addEventListener("change", function () {
    state.person = personSelect.value;
    state.values = valuesFor(personById(state.person));
    renderExperiment2();
    shell.announce(
      personById(state.person).name + "'s circumstances loaded. Estimated " +
      "behaviour " + pct(likelihood(state.values, state.correspondence)) +
      " of occasions.", { immediate: true });
  });

  correspondenceSelect.addEventListener("change", function () {
    state.correspondence = correspondenceSelect.value;
    renderExperiment2();
    shell.announce("Measure changed. Estimated behaviour " +
      pct(likelihood(state.values, state.correspondence)) + " of occasions.",
      { immediate: true });
  });

  $$('input[name="setting"]').forEach(function (input) {
    input.addEventListener("change", function () {
      state.setting = input.value;
      renderExperiment3();
      shell.announce("Setting changed. " + correlationLine.textContent,
        { immediate: true });
    });
  });

  $$('input[name="measure"]').forEach(function (input) {
    input.addEventListener("change", function () {
      state.measure = input.value;
      renderExperiment3();
      shell.announce("Measure changed. " + correlationLine.textContent,
        { immediate: true });
    });
  });

  /* --- Challenge ------------------------------------------------------------ */

  var CLAIM_OPTIONS = [
    { value: "yes", label: "Supported as it stands" },
    { value: "partly", label: "Partly - it needs a qualification" },
    { value: "no", label: "Not supported" }
  ];

  var CLAIMS = [
    {
      id: "training",
      text:
        "\"Staff who score highly on the attitude scale speak up more, so " +
        "attitude training will raise the rate of speaking up.\"",
      judge: function () {
        return {
          answer: "no",
          verdict: "Not supported.",
          evidence: "Rowan, Devi, Marek and Priya all score 6.2 and behave differently.",
          why:
            "Two separate leaps. The first turns a between-person association " +
            "into a within-person cause. The second assumes the attitude term " +
            "is the one with room to move - and for Marek and Devi it is " +
            "already near the top. A training course changes the term that is " +
            "not limiting the behaviour."
        };
      }
    },
    {
      id: "marek",
      text:
        "\"Marek's low rate of speaking up shows that his stated commitment to " +
        "open debate is not sincere.\"",
      judge: function () {
        return {
          answer: "no",
          verdict: "Not supported.",
          evidence: "Marek's opportunity is 15%; every other condition matches Rowan's.",
          why:
            "The inference from \"does not do it\" to \"did not really mean " +
            "it\" requires that the occasion arose and he declined. In Marek's " +
            "team the disagreements are settled elsewhere. The absence of a " +
            "behaviour is not the absence of a disposition."
        };
      }
    },
  ];

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        "Claim " + (index + 1) + ". " + claim.text));
      CLAIM_OPTIONS.forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "claim-" + claim.id;
        input.value = option.value;
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      claimsList.appendChild(group);
    });
  }

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!state.unlocked) {
      showFeedback(claimsFeedback, "caution", "Open the laboratory first.",
        "Two of these are judged against the settings you choose in " +
        "experiments 2 and 3.");
      return;
    }
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One judgement per claim, please.",
        "A blank is not a verdict.");
      return;
    }
    var judged = CLAIMS.map(function (claim) { return claim.judge(); });
    var right = 0;
    judged.forEach(function (result, index) {
      if (result.answer === answers[index]) { right += 1; }
    });

    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 3 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 4 judgements match the model as you have it set."));
    lead.appendChild(document.createTextNode(
      " Claims 3 and 4 are worked out from your current settings rather than " +
      "from a stored key."));
    claimsFeedback.appendChild(lead);

    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === judged[index].answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        "Claim " + (index + 1) + ": " + judged[index].verdict));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + CLAIM_LABELS[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", "claims__evidence", judged[index].evidence));
      li.appendChild(make("p", null, judged[index].why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Four claims judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    most: {
      tone: "caution",
      verdict: "That is the inference the laboratory is built to test.",
      text:
        "A high score is a strong evaluation. Four people with exactly this " +
        "score are about to behave in four quite different ways, and the " +
        "questionnaire is not at fault in any of them."
    },
    often: {
      tone: "caution",
      verdict: "More cautious, and still an answer the score cannot give.",
      text:
        "\"Often\" is a claim about a frequency. Nothing in a questionnaire " +
        "about how somebody evaluates an action tells you how often the " +
        "occasion arises, who chairs the meeting, or whether anyone has ever " +
        "gone first."
    },
    some: {
      tone: "caution",
      verdict: "Right about the literature, wrong about the individual.",
      text:
        "Modest attitude-behaviour correlations are a real and " +
          "well-replicated finding. But a correlation across a sample " +
          "does not license a frequency for one person. Experiment 3 " +
          "shows that the size of the correlation is partly a fact about " +
          "the setting the study ran in."
    },
    cannot: {
      tone: "good",
      verdict: "Yes - and for a specific reason.",
      text:
        "The score is a valid measurement of an evaluation. Behaviour is an " +
        "event in a room with other people in it. Experiment 1 puts four " +
        "people with this exact score into four working lives; experiment 2 " +
        "shows which of the intervening conditions add and which one gates."
    }
  };

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function unlockLab() {
    state.unlocked = true;
    labSection.hidden = false;
    render();
    shell.announce("Laboratory open at experiment 1.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    unlockLab();
    $("#lab-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    unlockLab();
  });

  /* --- Worked example --------------------------------------------------------- */

  $('[data-action="worked"]').addEventListener("click", function () {
    state.predictions = { rowan: "usually", devi: "sometimes", marek: "usually", priya: "sometimes" };
    state.revealed = true;
    state.person = "marek";
    state.values = valuesFor(personById("marek"));
    state.correspondence = "middle";
    state.setting = "field";
    state.measure = "middle";
    state.stage = 2;
    syncForms();
    render();
    shell.announce(
      "Worked example: the four predictions most people make, then Marek " +
      "loaded into experiment 2. His attitude, control and habit are near " +
      "Rowan's; his estimated behaviour is " +
      pct(likelihood(state.values, state.correspondence)) +
      " of occasions, because opportunity multiplies.",
      { immediate: true });
  });

  function syncForms() {
    $$("input[type=radio]", predictionBox).forEach(function (input) {
      var id = input.name.replace("predict-", "");
      input.checked = state.predictions[id] === input.value;
    });
    $$('input[name="setting"]').forEach(function (input) {
      input.checked = input.value === state.setting;
    });
    $$('input[name="measure"]').forEach(function (input) {
      input.checked = input.value === state.measure;
    });
  }

  /* --- Reset and start-up ------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    state.values = valuesFor(personById(state.person));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    gateNote.textContent = "";
    claimsForm.reset();
    claimsFeedback.hidden = true;
    syncForms();
    render();
  });

  buildPredictions();
  buildSliders();
  buildPersonSelect();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the laboratory.",
    { immediate: true });
})();
