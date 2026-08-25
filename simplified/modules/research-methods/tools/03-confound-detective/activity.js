/* =========================================================================
   Confound Detective — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/03-confound-detective/

   TEACHING JOB
   ------------
   A variable biases a comparison only if it differs systematically between
   the conditions AND touches the outcome. Things that fail the first test add
   noise, not bias, and no amount of extra sample fixes bias.

   WHAT IS PRESERVED
   -----------------
   Both phases, and the live estimate that is the point of the second.

       estimate = trueEffect + SUM over confounds of ( bias x remaining )

   A repair removes a stated fraction of a named confound's bias, and
   fractions combine multiplicatively across repairs. The true effect is drawn
   on the same axis, so the learner watches the reported number walk toward it
   as bias is removed and stay put when it is not.

   One repair removes nothing: recruiting more participants. It is kept
   precisely so it can be seen doing nothing, because "increase the sample
   size" is the commonest student answer to a bias problem and it is the wrong
   tool. Sample size moves the interval width, which is reported separately,
   so noise and bias are on screen at the same time and visibly different.

   The four-way classification is preserved in full: confound, nuisance, part
   of the treatment, constant. Cutting it to confound-or-not would lose the
   two categories students actually get wrong.

   WHAT WAS REDUCED
   ----------------
   Three studies to one, the opening prediction, and the select-all challenge.

   THE BIAS FIGURES ARE INVENTED, as in the original, and were chosen to make
   the argument legible rather than to estimate confounding anywhere. Real
   confounds interact and sometimes cancel; additive here is deliberate so the
   arithmetic can be followed.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var TRUE_EFFECT = 3;          /* marks; known only to the activity */
  var BASE_SE = 2.6;            /* standard error at the reported n of 60 */
  var BIG_N_SE = 1.0;           /* and at 400 */

  var KINDS = [
    ["confound", "Confound", "Differs with the conditions and touches the outcome"],
    ["nuisance", "Nuisance variable", "Varies between people, but not with the condition"],
    ["treatment", "Part of the treatment", "It is what the manipulation is"],
    ["constant", "Constant", "Identical in every condition"]
  ];

  var VARIABLES = [
    {
      label: "Which tutor teaches the seminar group",
      answer: "confound",
      note: "Perfectly aligned with the conditions: every app student has the module leader, every control student has the postgraduate tutor. Teaching plainly touches exam performance. Both conditions met, so it is a confound, and a large one."
    },
    {
      label: "Whether a student had breakfast on the morning of the exam",
      answer: "nuisance",
      note: "The one students most often call a confound. It varies between people and may well affect performance, but there is no reason it differs systematically between the two seminar groups. It adds scatter to both groups equally, which widens the interval and leaves the estimate exactly where it was."
    },
    {
      label: "The app's spaced-repetition schedule",
      answer: "treatment",
      note: "Not a confound: it is what the app is. Controlling it away would delete the manipulation rather than clean up the comparison. If you want to know whether spacing is the active ingredient, that needs a second app condition without it, which is a different study."
    },
    {
      label: "The exam paper, which is identical for both groups",
      answer: "constant",
      note: "Identical across conditions, so it cannot produce a difference between them. It still matters for other reasons, since a paper that is too easy would compress both groups against the ceiling, but it cannot bias this comparison."
    }
  ];

  var CONFOUNDS = [
    { id: "tutor", label: "Tutor", bias: 6.5 },
    { id: "time", label: "Seminar time", bias: 2 },
    { id: "selection", label: "Self-selected groups", bias: 4 },
    { id: "marking", label: "Unblinded marking", bias: 1.5 }
  ];

  var REPAIRS = [
    {
      id: "withingroup",
      label: "Deliver the app to half of each seminar group",
      blocks: { tutor: 1, time: 1 },
      note: "The most powerful single repair here. Once both conditions exist inside both seminars, the tutor and the timetable no longer line up with the manipulation at all."
    },
    {
      id: "randomise",
      label: "Randomly allocate students to app or no app",
      blocks: { selection: 1 },
      note: "Removes the selection problem completely: whatever made students pick Tuesday no longer travels with the condition. It does nothing about the tutor or the time, because those are attached to the seminar group and not to the student."
    },
    {
      id: "blindmark",
      label: "Mark the exams blind to condition",
      blocks: { marking: 1 },
      note: "The module leader currently knows which students used the app they recommended. Blind marking removes that, and removes nothing else."
    },
    {
      id: "bign",
      label: "Recruit 400 students instead of 60",
      blocks: {},
      precision: true,
      note: "Moves the estimate not at all. A larger sample shrinks the standard error, so the biased estimate is reported with more confidence and a narrower interval."
    }
  ];

  var applied = {};
  var phase = "sorting";
  var at = 0;
  var answered = false;

  /* --- The model ------------------------------------------------------- */

  function remaining(confoundId) {
    var left = 1;
    REPAIRS.forEach(function (repair) {
      if (applied[repair.id] && repair.blocks[confoundId]) {
        left *= 1 - repair.blocks[confoundId];
      }
    });
    return left;
  }

  function estimate() {
    var total = TRUE_EFFECT;
    CONFOUNDS.forEach(function (confound) {
      total += confound.bias * remaining(confound.id);
    });
    return total;
  }

  function standardError() {
    return applied.bign ? BIG_N_SE : BASE_SE;
  }

  function openBias() {
    var n = 0;
    CONFOUNDS.forEach(function (c) { if (remaining(c.id) > 0) { n += 1; } });
    return n;
  }

  /* --- Elements -------------------------------------------------------- */

  var stepLabel = document.getElementById("step-label");
  var sorting = document.getElementById("sorting");
  var repairing = document.getElementById("repairing");
  var variableLabel = document.getElementById("variable-label");
  var optionGrid = document.getElementById("options");
  var repairsBox = document.getElementById("repairs");
  var readout = document.getElementById("readout");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* --- Phase 1: sorting ------------------------------------------------ */

  function renderVariable() {
    var variable = VARIABLES[at];
    answered = false;
    stepLabel.textContent = "Variable " + (at + 1) + " of " + VARIABLES.length;
    variableLabel.textContent = variable.label;

    optionGrid.textContent = "";
    KINDS.forEach(function (kind) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", kind[0]);
      var strong = document.createElement("strong");
      strong.textContent = kind[1];
      var span = document.createElement("span");
      span.textContent = kind[2];
      button.appendChild(strong);
      button.appendChild(span);
      button.addEventListener("click", function () { sort(kind[0]); });
      optionGrid.appendChild(button);
    });

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = at === VARIABLES.length - 1
      ? "Repair the design" : "Next variable";
    wb.progress.set(0);
  }

  function sort(choice) {
    if (answered) { return; }
    answered = true;
    var variable = VARIABLES[at];

    wb.choices.lock(optionGrid);
    Array.prototype.forEach.call(optionGrid.children, function (button) {
      var key = button.getAttribute("data-choice");
      if (key === variable.answer) {
        wb.choices.mark(button, "correct", {
          note: "This is what it is." + (key === choice ? " This is the one you chose." : "")
        });
      } else if (key === choice) {
        wb.choices.mark(button, "incorrect", { note: "This is the one you chose." });
      }
    });

    reveal.textContent = "";
    var line = document.createElement("p");
    var strong = document.createElement("strong");
    var kindName = "";
    KINDS.forEach(function (k) { if (k[0] === variable.answer) { kindName = k[1].toLowerCase(); } });
    strong.textContent = choice === variable.answer
      ? "Yes: " + kindName + "."
      : "This one is a " + kindName + ".";
    line.appendChild(strong);
    var why = document.createElement("p");
    why.className = "small";
    why.textContent = variable.note;
    reveal.appendChild(line);
    reveal.appendChild(why);
    wb.show(reveal);

    nextButton.disabled = false;
    wb.announce(strong.textContent + " Feedback below.");
  }

  /* --- Phase 2: repairing ---------------------------------------------- */

  function startRepairs() {
    phase = "repairing";
    stepLabel.textContent = "Repair the design";
    wb.hide(sorting);
    wb.hide(reveal);
    wb.show(repairing);
    nextButton.textContent = "What moved and what did not";
    nextButton.disabled = true;
    wb.progress.set(1);
    renderRepairs();
    update();
    wb.announce(
      "The study as reported claims " + estimate().toFixed(1) +
      " marks. Apply repairs and watch the number."
    );
  }

  function renderRepairs() {
    repairsBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Repairs to the design";
    repairsBox.appendChild(legend);

    REPAIRS.forEach(function (repair) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", "false");
      label.setAttribute("data-repair", repair.id);

      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = repair.id;

      var body = document.createElement("span");
      var name = document.createElement("strong");
      name.textContent = repair.label;
      var detail = document.createElement("span");
      detail.textContent = repair.precision
        ? "Changes how precisely the study reports its number"
        : "Removes: " + Object.keys(repair.blocks).map(labelOf).join(", ");
      body.appendChild(name);
      body.appendChild(detail);

      label.appendChild(input);
      label.appendChild(body);
      input.addEventListener("change", function () {
        var before = estimate();
        applied[repair.id] = input.checked;
        label.setAttribute("data-checked", String(input.checked));
        if (Object.keys(applied).some(function (k) { return applied[k]; })) {
          nextButton.disabled = false;
        }
        update(repair, estimate() - before);
      });
      repairsBox.appendChild(label);
    });
  }

  function labelOf(id) {
    var found = id;
    CONFOUNDS.forEach(function (c) { if (c.id === id) { found = c.label.toLowerCase(); } });
    return found;
  }

  function update(repair, delta) {
    var value = estimate();
    var se = standardError();

    readout.textContent = "";
    tile("Reported effect", value.toFixed(1) + " marks",
      Math.abs(value - TRUE_EFFECT) < 0.05
        ? "This is the true effect"
        : (value - TRUE_EFFECT).toFixed(1) + " marks above the truth");
    tile("Bias still in the design", openBias() + " of " + CONFOUNDS.length,
      openBias() === 0 ? "Nothing left travelling with the conditions"
                       : "Confounds not yet removed");
    tile("Interval width", "plus or minus " + (1.96 * se).toFixed(1),
      applied.bign ? "400 students" : "60 students");

    renderChart(value, se);

    if (repair) {
      reveal.textContent = "";
      var line = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = Math.abs(delta) < 0.05
        ? "The estimate did not move."
        : "The estimate moved " + Math.abs(delta).toFixed(1) + " marks.";
      line.appendChild(strong);
      var why = document.createElement("p");
      why.className = "small";
      why.textContent = repair.note;
      reveal.appendChild(line);
      reveal.appendChild(why);
      wb.show(reveal);

      wb.announce(
        (repair.precision
          ? "Estimate unchanged at " + value.toFixed(1) + " marks. Interval now plus or minus " + (1.96 * se).toFixed(1) + "."
          : "Estimate now " + value.toFixed(1) + " marks, against a true effect of " + TRUE_EFFECT + ".")
      );
    }
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    readout.appendChild(item);
  }

  /* --- The figure: one axis, the truth, and what the study would say --- */

  function renderChart(value, se) {
    var LEFT = 90;
    var RIGHT = 850;
    var TOP = 40;
    var AXIS = 116;
    var LO = -2;
    var HI = 22;
    var X = function (v) { return LEFT + ((v - LO) / (HI - LO)) * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (AXIS + 60));

    var truth = svg("text", { x: X(TRUE_EFFECT), y: 22, "text-anchor": "middle", class: "plot__tick" });
    truth.textContent = "True effect";
    chart.appendChild(truth);
    chart.appendChild(svg("line", {
      x1: X(TRUE_EFFECT), y1: TOP - 8, x2: X(TRUE_EFFECT), y2: AXIS, class: "plot__zero"
    }));

    chart.appendChild(svg("line", {
      x1: X(value - 1.96 * se).toFixed(1), y1: TOP + 24,
      x2: X(value + 1.96 * se).toFixed(1), y2: TOP + 24, class: "plot__interval"
    }));
    chart.appendChild(svg("circle", {
      cx: X(value).toFixed(1), cy: TOP + 24, r: 7, class: "plot__point plot__point--filled"
    }));

    var label = svg("text", {
      x: X(value).toFixed(1), y: TOP + 52, "text-anchor": "middle", class: "plot__sub"
    });
    label.textContent = "What this design reports: " + value.toFixed(1);
    chart.appendChild(label);

    chart.appendChild(svg("line", { x1: LEFT, y1: AXIS, x2: RIGHT, y2: AXIS, class: "plot__axis" }));
    [0, 5, 10, 15, 20].forEach(function (tick) {
      var mark = svg("text", { x: X(tick), y: AXIS + 20, "text-anchor": "middle", class: "plot__tick" });
      mark.textContent = String(tick);
      chart.appendChild(mark);
    });
    var caption = svg("text", {
      x: (LEFT + RIGHT) / 2, y: AXIS + 42, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Effect of the app, in exam marks";
    chart.appendChild(caption);

    chartDesc.textContent =
      "A single axis in exam marks. The true effect of " + TRUE_EFFECT +
      " marks is marked with a line. This design would report " +
      value.toFixed(1) + " marks, plus or minus " + (1.96 * se).toFixed(1) +
      ", which is " + (value - TRUE_EFFECT).toFixed(1) + " above the truth.";
  }

  /* --- Controls -------------------------------------------------------- */

  nextButton.addEventListener("click", function () {
    if (phase === "sorting") {
      if (at < VARIABLES.length - 1) {
        at += 1;
        renderVariable();
        wb.scrollTo("#card");
        return;
      }
      startRepairs();
      wb.scrollTo("#card");
      return;
    }

    var value = estimate();
    resultLead.textContent =
      "The study as reported claimed 17.0 marks. The true effect is " +
      TRUE_EFFECT + ". With the repairs you applied it reports " +
      value.toFixed(1) + " marks, plus or minus " +
      (1.96 * standardError()).toFixed(1) + ". " +
      (applied.bign
        ? "Recruiting 400 students narrowed that interval and moved the estimate by nothing at all."
        : "Recruiting more students would have narrowed the interval and moved the estimate by nothing at all.");
    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Reported effect " + value.toFixed(1) + " against a true effect of " + TRUE_EFFECT + ".");
  });

  wb.onReset(function () {
    applied = {};
    phase = "sorting";
    at = 0;
    wb.hide(repairing);
    wb.show(sorting);
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    wb.progress.reset();
    renderVariable();
  });

  renderVariable();
})();
