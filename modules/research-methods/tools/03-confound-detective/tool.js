/* =========================================================================
   Confound Detective
   -------------------------------------------------------------------------
   Three fictional studies with confident causal claims. Each runs in two
   phases: classify the variables, then repair the design.

   THE EDUCATIONAL MODEL
   ---------------------
   A variable can bias a comparison only if it meets BOTH conditions:

       1. it differs systematically between the conditions, and
       2. it plausibly touches the outcome.

   Four classifications follow from that:

       confound     both conditions met - produces bias
       nuisance     varies between people but not with condition - produces
                    noise, which widens the interval and leaves the estimate
                    where it was
       treatment    it is part of what the manipulation IS; removing it deletes
                    the effect rather than cleaning up the comparison
       constant     identical in every condition, so it cannot produce a
                    difference

   Each study has a true effect known only to the tool, and each open confound
   adds a fixed amount of bias:

       estimate = trueEffect + SUM over confounds of ( bias x remaining )

   A repair removes a stated fraction of a named confound's bias. Fractions
   from several repairs combine multiplicatively, so remaining is the product
   of (1 - fraction) across the applied repairs. Two repairs that each remove
   most of a confound leave a little more than either alone would.

   One repair in every study removes NOTHING: recruiting more participants.
   It is there to be seen doing nothing, because "increase the sample size" is
   the most common student answer to a bias problem and it is the wrong tool.
   Sample size is reported separately as a precision figure so the distinction
   between noise and bias is on screen at the same time.

   THE BIAS FIGURES ARE INVENTED. They were chosen to make the argument
   legible, not to estimate confounding in any real study. Real confounds
   interact, point in opposite directions and sometimes cancel; keeping them
   additive here is a deliberate simplification so the arithmetic can be
   followed.

   No real module, ward, trial, patient or dataset is described. No data leave
   the browser: there is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var KIND_LABEL = {
    confound: "Confound — travels with the conditions and touches the outcome",
    nuisance: "Nuisance — varies between people, but not with the conditions",
    treatment: "Part of the manipulation — it is what the treatment is",
    constant: "Held constant — the same in every condition"
  };

  var KIND_SHORT = {
    confound: "Confound",
    nuisance: "Nuisance variable",
    treatment: "Part of the manipulation",
    constant: "Held constant"
  };

  /* =======================================================================
     The three studies
     ===================================================================== */

  var CASES = [
    {
      short: "Revision app",
      claim: "Using the revision app improves exam performance.",
      design:
        "Fictional study. Sixty students. The Tuesday 09:00 seminar group is " +
        "given the app; the Thursday 14:00 group is not. Students chose their " +
        "seminar group at enrolment. The Tuesday group is taught by the module " +
        "leader, the Thursday group by a postgraduate tutor. Both sit the same " +
        "exam, marked by the module leader.",
      unit: "marks",
      trueEffect: 3,
      variables: [
        {
          label: "Which tutor teaches the seminar group",
          answer: "confound",
          note:
            "Perfectly aligned with the conditions - every app student has the " +
            "module leader, every control student has the postgraduate tutor - " +
            "and teaching plainly touches exam performance. Both conditions " +
            "met, so it is a confound, and a large one."
        },
        {
          label: "Time of the seminar (09:00 against 14:00)",
          answer: "confound",
          note:
            "Also perfectly aligned with condition, and time of day is related " +
            "to attendance, alertness and who can make the session at all. " +
            "Smaller than the tutor, and still bias rather than noise."
        },
        {
          label: "Whether a student had breakfast on the morning of the exam",
          answer: "nuisance",
          note:
            "The one students most often call a confound. It varies between " +
            "people and may well affect performance, but there is no reason it " +
            "differs systematically between the two seminar groups. It adds " +
            "scatter to both groups equally, which widens the interval and " +
            "leaves the estimate exactly where it was."
        },
        {
          label: "The app's spaced-repetition schedule",
          answer: "treatment",
          note:
            "Not a confound - it is what the app is. Controlling it away would " +
            "delete the manipulation rather than clean up the comparison. If " +
            "you want to know whether spacing is the active ingredient, that " +
            "needs a second app condition without it, which is a different " +
            "study."
        },
        {
          label: "The exam paper, which is identical for both groups",
          answer: "constant",
          note:
            "Identical across conditions, so it cannot produce a difference " +
            "between them. It still matters for other reasons - a paper that " +
            "is too easy would compress both groups against the ceiling - but " +
            "it cannot bias this comparison."
        }
      ],
      confounds: [
        { id: "tutor", label: "Tutor", bias: 6.5 },
        { id: "time", label: "Seminar time", bias: 2 },
        { id: "selection", label: "Self-selected groups", bias: 4 },
        { id: "marking", label: "Unblinded marking", bias: 1.5 }
      ],
      repairs: [
        {
          id: "randomise",
          label: "Randomly allocate students to app or no app",
          blocks: { selection: 1 },
          note:
            "Removes the selection problem completely: whatever made students " +
            "pick Tuesday no longer travels with the condition. It does " +
            "nothing about the tutor or the time, because those are attached " +
            "to the seminar group and not to the student."
        },
        {
          id: "withingroup",
          label: "Deliver the app to half of each seminar group",
          blocks: { tutor: 1, time: 1 },
          note:
            "The most powerful single repair here. Once both conditions exist " +
            "inside both seminars, the tutor and the timetable no longer line " +
            "up with the manipulation at all."
        },
        {
          id: "sametutor",
          label: "Have the same tutor teach both seminar groups",
          blocks: { tutor: 1 },
          note:
            "Removes the tutor confound and leaves the timetable and the " +
            "self-selection untouched. Cheap, partial, and better than nothing."
        },
        {
          id: "blindmark",
          label: "Mark the exams blind to condition",
          blocks: { marking: 1 },
          note:
            "The module leader currently knows which students used the app " +
            "they recommended. Blind marking removes that, and removes " +
            "nothing else."
        },
        {
          id: "bign",
          label: "Recruit 400 students instead of 60",
          blocks: {},
          precision: 2.6,
          note:
            "Moves the estimate not at all. A larger sample shrinks the " +
            "standard error, so the biased estimate is reported with more " +
            "confidence and a narrower interval. This is the repair that is " +
            "here to be seen doing nothing."
        }
      ]
    },

    {
      short: "Quiet ward",
      claim: "Quieter wards speed up recovery.",
      design:
        "Fictional audit. Patients on the quiet ward went home 1.8 days sooner " +
        "than those on the monitored ward. Which ward a patient goes to is " +
        "decided by the admitting team on clinical grounds. Two consultants " +
        "cover the quiet ward and four cover the monitored ward. Discharge " +
        "criteria are written into a trust protocol and are the same on both.",
      unit: "days",
      trueEffect: 0.3,
      variables: [
        {
          label: "How ill each patient is on admission",
          answer: "confound",
          note:
            "The decisive one, and the reason this comparison cannot be read " +
            "as it stands. Sicker patients are sent to the monitored ward " +
            "precisely because they are sicker, and being sicker lengthens the " +
            "stay. The ward is standing in for severity. This pattern - the " +
            "reason for the exposure also predicts the outcome - is called " +
            "confounding by indication."
        },
        {
          label: "Which consultant is responsible for the patient",
          answer: "confound",
          note:
            "Consultants differ in discharge thresholds, and they are not " +
            "spread evenly across the two wards. That is systematic difference " +
            "plus a route to the outcome, so it is bias rather than noise."
        },
        {
          label: "The month of the year in which a patient is admitted",
          answer: "nuisance",
          note:
            "Season affects admissions and probably affects length of stay, " +
            "but both wards are running in the same months, so it does not " +
            "line up with the comparison. It adds variability, not bias. If " +
            "one ward closed over the summer, this answer would change."
        },
        {
          label: "The noise level on the ward",
          answer: "treatment",
          note:
            "This is the exposure itself - the thing whose effect is being " +
            "claimed. Note the wording: nothing was manipulated, so 'exposure' " +
            "is the honest term. It cannot be a confound for its own effect."
        },
        {
          label: "The trust's written discharge criteria",
          answer: "constant",
          note:
            "The same document governs both wards, so it cannot generate a " +
            "difference between them. It does affect how consistently the " +
            "criteria are applied, which is a separate question."
        }
      ],
      confounds: [
        { id: "severity", label: "Illness severity", bias: 1.4 },
        { id: "consultant", label: "Consultant", bias: 0.5 },
        { id: "discharge", label: "Unblinded discharge decision", bias: 0.25 }
      ],
      repairs: [
        {
          id: "randomiseward",
          label: "Randomly allocate patients to a ward where it is clinically safe",
          blocks: { severity: 1, consultant: 1 },
          note:
            "Breaks the link between ward and everything a patient brings with " +
            "them, measured or not. It is also the repair with an ethical " +
            "limit written into it: allocation can only be random among " +
            "patients for whom both wards are genuinely appropriate, which " +
            "changes who the answer applies to."
        },
        {
          id: "adjust",
          label: "Measure severity at admission and adjust for it statistically",
          blocks: { severity: 0.75 },
          note:
            "Removes most of the severity bias and none of the rest. Read the " +
            "conditions: the adjustment works only if severity was measured, " +
            "measured well, and entered into the model in roughly the right " +
            "form. A severity score that captures three quarters of what " +
            "matters removes three quarters of the bias and leaves the " +
            "remainder looking like a result."
        },
        {
          id: "matchsev",
          label: "Match each quiet-ward patient to a monitored-ward patient of similar severity",
          blocks: { severity: 0.6 },
          note:
            "The same idea with the same limitation, applied by design rather " +
            "than by model. Matching on a measured variable does nothing about " +
            "the unmeasured differences that came with it."
        },
        {
          id: "rotate",
          label: "Rotate consultants across both wards",
          blocks: { consultant: 1 },
          note:
            "Consultant no longer travels with ward. This is a genuine " +
            "improvement and it leaves the severity problem entirely intact."
        },
        {
          id: "blinddischarge",
          label: "Have discharge readiness assessed by a clinician blind to ward",
          blocks: { discharge: 1 },
          note:
            "Removes the smallest of the three biases. Worth doing, and no " +
            "substitute for the first two."
        },
        {
          id: "bignward",
          label: "Extend the audit to 5,000 patients",
          blocks: {},
          precision: 3.2,
          note:
            "Five thousand patients estimate the same confounded quantity " +
            "very precisely. This is how a thoroughly biased finding acquires " +
            "a small p-value and a place in a guideline."
        }
      ]
    },

    {
      short: "Typeface",
      claim: "The new typeface is read faster than the old one.",
      design:
        "Fictional experiment. Thirty participants read passage A in the old " +
        "typeface, then passage B in the new one, and reading time is " +
        "recorded. Passage A is a legal notice; passage B is a short news " +
        "item. Screen brightness is fixed by the laboratory.",
      unit: "seconds saved",
      trueEffect: 1.5,
      variables: [
        {
          label: "The order in which the two typefaces are read",
          answer: "confound",
          note:
            "Everyone reads the old typeface first and the new one second, so " +
            "practice, warm-up and boredom all line up perfectly with the " +
            "manipulation. In a within-participants design order is the " +
            "default confound, and it is invisible unless you look for it."
        },
        {
          label: "Which passage is used in each condition",
          answer: "confound",
          note:
            "A legal notice against a news item, and each is tied to one " +
            "typeface. The material and the manipulation cannot be separated: " +
            "any difference could be the typeface or could be that legal " +
            "notices are harder to read."
        },
        {
          label: "How fast each participant reads in general",
          answer: "nuisance",
          note:
            "Reading speed varies hugely between people and it is not tied to " +
            "condition, because every participant is in both. That is what a " +
            "within-participants design buys: individual differences are " +
            "subtracted out rather than left in the error term, which is why " +
            "this design needs fewer participants than a between-groups one."
        },
        {
          label: "The new typeface's larger x-height and wider letter spacing",
          answer: "treatment",
          note:
            "This is what makes the new typeface new. Equalising it would " +
            "remove the manipulation. Whether x-height or spacing is the " +
            "active ingredient is a good question and needs conditions built " +
            "to separate them."
        },
        {
          label: "Screen brightness, fixed by the laboratory",
          answer: "constant",
          note:
            "Identical in both conditions, so it cannot produce a difference. " +
            "Holding it constant also has a cost worth noticing: the finding " +
            "now applies at that brightness, and nothing has been learned " +
            "about any other."
        }
      ],
      confounds: [
        { id: "order", label: "Practice from fixed order", bias: 2.6 },
        { id: "passage", label: "Passage difficulty", bias: 3.4 },
        { id: "expect", label: "Participants told which typeface is new", bias: 0.6 }
      ],
      repairs: [
        {
          id: "counterbalance",
          label: "Counterbalance: half read the new typeface first",
          blocks: { order: 1 },
          note:
            "Order still happens to every participant, but it no longer lines " +
            "up with typeface, so the practice effect falls on both conditions " +
            "equally. It becomes noise instead of bias - which is the whole " +
            "trick of counterbalancing."
        },
        {
          id: "rotatepassage",
          label: "Rotate the passages so each appears in each typeface",
          blocks: { passage: 1 },
          note:
            "The material is no longer tied to the manipulation. Note that " +
            "this and counterbalancing are two different rotations, and doing " +
            "one does not do the other."
        },
        {
          id: "matchpassage",
          label: "Replace passage A with a second news item of similar length",
          blocks: { passage: 0.7 },
          note:
            "Better, and not a fix. Two news items of similar length still " +
            "differ in vocabulary, familiarity and interest, and one of them " +
            "is still permanently attached to one typeface."
        },
        {
          id: "blindpurpose",
          label: "Do not tell participants which typeface is the new one",
          blocks: { expect: 1 },
          note:
            "Removes the smallest bias here. Participants who know which " +
            "condition is meant to win tend, unhelpfully, to let it."
        },
        {
          id: "between",
          label: "Switch to a between-groups design instead",
          blocks: { order: 1 },
          precision: 0.45,
          note:
            "Removes order effects by removing order - nobody sees both " +
            "typefaces. It also throws away the design's main advantage: " +
            "individual differences in reading speed go back into the error " +
            "term, so precision gets markedly worse for the same number of " +
            "participants. It does nothing about the passages."
        },
        {
          id: "bigntype",
          label: "Run 300 participants instead of 30",
          blocks: {},
          precision: 3.2,
          note:
            "Ten times the participants, exactly the same bias, a tenth of " +
            "the standard error. The wrong answer, stated more confidently."
        }
      ]
    }
  ];

  /* =======================================================================
     Small DOM helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svg(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function fmt(value, places) {
    var p = places === undefined ? 1 : places;
    return (Math.round(value * Math.pow(10, p)) / Math.pow(10, p)).toFixed(p);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#confound");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var variableList = $("[data-variable-list]");
  var repairList = $("[data-repair-list]");
  var classifyFieldset = $('[data-phase="classify"]');
  var repairFieldset = $('[data-phase="repair"]');
  var caseLabel = $("[data-case-label]");
  var caseClaim = $("[data-case-claim]");
  var caseDesign = $("[data-case-design]");
  var effectBlock = $("[data-effect-block]");
  var effect = $("[data-effect]");
  var phaseFeedback = $("[data-phase-feedback]");
  var classifyDetail = $("[data-classify-detail]");
  var classifyBody = $("[data-classify-body]");
  var repairDetail = $("[data-repair-detail]");
  var dag = $("[data-dag]");
  var dagTable = $("[data-dag-table]");
  var verdict = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var repairNotes = $("[data-repair-notes]");
  var stageTrack = $("[data-stage-track]");

  var checkButton = $('[data-action="check"]');
  var repairButton = $('[data-action="repair"]');
  var nextButton = $('[data-action="next"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var index = 0;
  var phase = "classify";
  var done = [];

  function current() { return CASES[index]; }

  /* --- Building the controls ---------------------------------------------- */

  function buildVariableList() {
    clear(variableList);
    current().variables.forEach(function (variable, i) {
      var wrap = make("div", "variable");
      var id = "var-" + index + "-" + i;
      var label = make("label", "variable__label", variable.label);
      label.setAttribute("for", id);
      wrap.appendChild(label);
      var select = document.createElement("select");
      select.id = id;
      select.name = "variable";
      select.setAttribute("data-variable", String(i));
      var blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "Choose a classification";
      select.appendChild(blank);
      Object.keys(KIND_LABEL).forEach(function (kind) {
        var option = document.createElement("option");
        option.value = kind;
        option.textContent = KIND_LABEL[kind];
        select.appendChild(option);
      });
      wrap.appendChild(select);
      variableList.appendChild(wrap);
    });
  }

  function buildRepairList() {
    clear(repairList);
    current().repairs.forEach(function (repair) {
      var label = make("label", "repair");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "repair";
      input.value = repair.id;
      label.appendChild(input);
      label.appendChild(make("span", null, repair.label));
      repairList.appendChild(label);
      input.addEventListener("change", function () {
        renderRepair();
        var state = estimateState();
        shell.announce(
          (input.checked ? "Applied: " : "Removed: ") + repair.label +
          ". Estimated effect now " + fmt(state.estimate) + " " +
          current().unit + " against a true effect of " +
          fmt(current().trueEffect) + ".");
      });
    });
  }

  /* --- Model --------------------------------------------------------------- */

  function appliedRepairs() {
    var ids = $$('input[name="repair"]:checked', repairList)
      .map(function (b) { return b.value; });
    return current().repairs.filter(function (r) { return ids.indexOf(r.id) !== -1; });
  }

  /**
   * Remaining fraction of each confound's bias, after every applied repair.
   * Fractions combine multiplicatively rather than adding, so two partial
   * repairs of the same confound leave a little more than either alone.
   */
  function estimateState() {
    var repairs = appliedRepairs();
    var rows = current().confounds.map(function (confound) {
      var remaining = 1;
      repairs.forEach(function (repair) {
        var share = repair.blocks[confound.id];
        if (share) { remaining *= (1 - share); }
      });
      return {
        confound: confound,
        remaining: remaining,
        bias: confound.bias * remaining
      };
    });
    var totalBias = rows.reduce(function (sum, row) { return sum + row.bias; }, 0);
    // Precision multipliers: >1 narrows the interval, <1 widens it.
    var precision = repairs.reduce(function (product, repair) {
      return product * (repair.precision || 1);
    }, 1);
    return {
      rows: rows,
      totalBias: totalBias,
      estimate: current().trueEffect + totalBias,
      precision: precision
    };
  }

  /* --- Rendering the effect bars -------------------------------------------- */

  function renderEffect(state) {
    var scale = Math.max(
      current().trueEffect,
      current().trueEffect + current().confounds.reduce(
        function (s, c) { return s + c.bias; }, 0)
    );
    clear(effect);
    [
      ["true", "True effect", current().trueEffect],
      ["estimate", "This study would estimate", state.estimate]
    ].forEach(function (row) {
      var node = make("div", "effect__row");
      node.setAttribute("data-kind", row[0]);
      node.appendChild(make("div", "effect__name", row[1]));
      var meter = make("div", "effect__meter");
      var track = make("span", "effect__track");
      var fill = make("span", "effect__fill");
      fill.style.width = Math.max(0, Math.min(1, row[2] / scale)) * 100 + "%";
      track.appendChild(fill);
      meter.appendChild(track);
      meter.appendChild(make("span", "effect__value",
        fmt(row[2]) + " " + current().unit));
      node.appendChild(meter);
      effect.appendChild(node);
    });

    var note = make("p", "case__design");
    var factor = state.precision;
    note.textContent =
      "Remaining bias: " + fmt(state.totalBias) + " " + current().unit +
      ". Precision relative to the original design: " +
      (Math.abs(factor - 1) < 0.01
        ? "unchanged"
        : factor > 1
          ? "about " + fmt(factor) + " times narrower an interval"
          : "about " + fmt(1 / factor) + " times wider an interval") + ".";
    effect.appendChild(note);
  }

  /* --- Rendering the diagram ------------------------------------------------ */

  function renderDag(state) {
    var W = 460;
    var nodeW = 104;
    var nodeH = 34;
    var topY = 12;
    var bottomY = 150;
    var open = state.rows;

    clear(dag);
    dag.setAttribute("viewBox", "0 0 " + W + " 210");

    var slots = open.length;
    var positions = open.map(function (_, i) {
      var spread = W - nodeW - 20;
      return 10 + (slots === 1 ? spread / 2 : (spread / (slots - 1)) * i);
    });

    var condX = 34;
    var outX = W - nodeW - 34;

    function box(x, y, label, cls, sub) {
      var g = svg("g", {});
      g.appendChild(svg("rect", {
        x: x, y: y, width: nodeW, height: nodeH, rx: 6, class: cls
      }));
      var text = svg("text", {
        x: x + nodeW / 2, y: y + (sub ? 15 : 21),
        "text-anchor": "middle", class: "chart__label"
      });
      text.textContent = label;
      g.appendChild(text);
      if (sub) {
        var s = svg("text", {
          x: x + nodeW / 2, y: y + 27,
          "text-anchor": "middle", class: "chart__count"
        });
        s.textContent = sub;
        g.appendChild(s);
      }
      dag.appendChild(g);
    }

    function arrow(x1, y1, x2, y2, cls, headCls) {
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / len, uy = dy / len;
      var tipX = x2 - ux * 2, tipY = y2 - uy * 2;
      var baseX = tipX - ux * 8, baseY = tipY - uy * 8;
      dag.appendChild(svg("line", {
        x1: x1, y1: y1, x2: baseX, y2: baseY, class: cls
      }));
      dag.appendChild(svg("polygon", {
        points: [
          tipX + "," + tipY,
          (baseX - uy * 4) + "," + (baseY + ux * 4),
          (baseX + uy * 4) + "," + (baseY - ux * 4)
        ].join(" "),
        class: headCls
      }));
    }

    // Confound boxes and their two arrows.
    open.forEach(function (row, i) {
      var blocked = row.remaining < 0.005;
      var x = positions[i];
      box(x, topY, row.confound.label,
        "dag__node" + (blocked ? " dag__node--blocked" : ""),
        blocked ? "blocked" : "open");
      var fromX = x + nodeW / 2;
      var fromY = topY + nodeH;
      var cls = "dag__edge" + (blocked ? " dag__edge--blocked" : "");
      var head = "dag__head" + (blocked ? " dag__head--blocked" : "");
      arrow(fromX, fromY, condX + nodeW / 2, bottomY, cls, head);
      arrow(fromX, fromY, outX + nodeW / 2, bottomY, cls, head);
    });

    box(condX, bottomY, "Condition", "dag__node dag__node--core");
    box(outX, bottomY, "Outcome", "dag__node dag__node--core");
    arrow(condX + nodeW, bottomY + nodeH / 2, outX, bottomY + nodeH / 2,
      "dag__edge dag__edge--core", "dag__head dag__head--core");

    var caption = svg("text", {
      x: W / 2, y: bottomY + nodeH + 26, "text-anchor": "middle",
      class: "chart__count"
    });
    caption.textContent = "the effect the study is trying to estimate";
    dag.appendChild(caption);

    clear(dagTable);
    state.rows.forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row.confound.label);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null,
        row.remaining < 0.005 ? "blocked"
          : row.remaining > 0.995 ? "open"
          : "partly blocked (" + Math.round((1 - row.remaining) * 100) + "% removed)"));
      tr.appendChild(make("td", null, fmt(row.bias) + " " + current().unit));
      dagTable.appendChild(tr);
    });
  }

  function renderRepairNotes() {
    clear(repairNotes);
    var repairs = appliedRepairs();
    if (!repairs.length) {
      repairNotes.appendChild(make("p", "case__design",
        "No repairs applied yet."));
      return;
    }
    repairs.forEach(function (repair) {
      var block = make("div", "part");
      block.appendChild(make("p", "part__head", repair.label));
      block.appendChild(make("p", "part__body", repair.note));
      repairNotes.appendChild(block);
    });
  }

  function renderInterpretation(state) {
    var totalPossible = current().confounds.reduce(
      function (s, c) { return s + c.bias; }, 0);
    var removed = totalPossible - state.totalBias;
    var text;
    var tone;

    if (state.totalBias < 0.005) {
      tone = "good";
      text =
        "Every confound in the diagram is blocked, and the estimate has " +
        "landed on the true effect of " + fmt(current().trueEffect) + " " +
        current().unit + ". Two cautions before anyone celebrates. The tool " +
        "knows the true effect because it invented it; a real study never " +
        "gets to check. And the list of confounds is the list somebody thought " +
        "of - blocking all of them says nothing about the ones nobody named.";
    } else if (removed < 0.005) {
      tone = "warn";
      text =
        "Nothing has been blocked. The study would report " +
        fmt(state.estimate) + " " + current().unit + " where the truth is " +
        fmt(current().trueEffect) + " - an estimate " +
        fmt(state.estimate / Math.max(current().trueEffect, 0.01), 1) +
        " times too large. All of that gap is bias, so no amount of extra data " +
        "will close it.";
    } else if (state.totalBias > totalPossible * 0.4) {
      tone = "warn";
      text =
        "Some progress: " + fmt(removed) + " of " + fmt(totalPossible) + " " +
        current().unit + " of bias removed, with " + fmt(state.totalBias) +
        " still in the estimate. Look at the table to see which confound is " +
        "carrying most of what is left; repairing the small ones first is a " +
        "common and comfortable mistake.";
    } else {
      tone = "caution";
      text =
        "Most of the bias is gone - " + fmt(removed) + " of " +
        fmt(totalPossible) + " " + current().unit + " - and " +
        fmt(state.totalBias) + " remains, so the study would still report " +
        fmt(state.estimate) + " against a truth of " +
        fmt(current().trueEffect) + ". A residual bias smaller than the " +
        "effect is the hardest kind to argue about, because the finding now " +
        "looks approximately right.";
    }

    interpretation.textContent = text;
    verdict.setAttribute("data-tone", tone);
  }

  function renderRepair() {
    var state = estimateState();
    renderEffect(state);
    renderDag(state);
    renderRepairNotes();
    renderInterpretation(state);
  }

  /* --- Stage track ---------------------------------------------------------- */

  function renderTrack() {
    clear(stageTrack);
    CASES.forEach(function (item, i) {
      var li = make("li");
      li.appendChild(make("span", null, String(i + 1) + "."));
      li.appendChild(document.createTextNode(" " + item.short));
      if (done[i]) {
        li.setAttribute("data-state", "done");
        li.appendChild(make("span", "visually-hidden", " (completed)"));
      }
      if (i === index) {
        li.setAttribute("aria-current", "step");
        li.appendChild(make("span", "visually-hidden", " (current)"));
      }
      stageTrack.appendChild(li);
    });
  }

  /* --- Phases ---------------------------------------------------------------- */

  function setPhase(next) {
    phase = next;
    var classifying = phase === "classify";
    classifyFieldset.hidden = !classifying;
    repairFieldset.hidden = classifying;
    checkButton.hidden = !classifying;
    repairButton.hidden = !classifying;
    effectBlock.hidden = classifying;
    classifyDetail.hidden = classifying ? classifyDetail.hidden : true;
    repairDetail.hidden = classifying;
    nextButton.hidden = classifying;
    if (!classifying) { renderRepair(); }
  }

  function showCase(i) {
    index = i;
    caseLabel.textContent = "Study " + (i + 1) + " of " + CASES.length;
    caseClaim.textContent = "“" + current().claim + "”";
    caseDesign.textContent = current().design;
    buildVariableList();
    buildRepairList();
    phaseFeedback.hidden = true;
    classifyDetail.hidden = true;
    nextButton.textContent =
      i === CASES.length - 1 ? "Back to study 1" : "Next study";
    setPhase("classify");
    renderTrack();
  }

  /* --- Checking the classification ------------------------------------------- */

  function checkClassification() {
    var selects = $$('select[name="variable"]', variableList);
    var missing = selects.filter(function (s) { return !s.value; }).length;

    clear(phaseFeedback);
    phaseFeedback.hidden = false;

    if (missing) {
      phaseFeedback.setAttribute("data-tone", "caution");
      var p = make("p");
      p.appendChild(make("strong", "feedback__verdict", "Not yet. "));
      p.appendChild(document.createTextNode(
        "Classify all five variables first — " + missing + " still to go."));
      phaseFeedback.appendChild(p);
      classifyDetail.hidden = true;
      shell.announce(missing + " variables still unclassified.", { immediate: true });
      return;
    }

    var right = 0;
    clear(classifyBody);
    current().variables.forEach(function (variable, i) {
      var chosen = selects[i].value;
      var correct = chosen === variable.answer;
      if (correct) { right += 1; }
      var block = make("div", "part");
      block.setAttribute("data-standing", correct ? "right" : "wrong");
      var head = make("p", "part__head");
      head.appendChild(document.createTextNode(variable.label + " — "));
      head.appendChild(make("span", "part__standing",
        correct
          ? "yes, " + KIND_SHORT[variable.answer].toLowerCase()
          : "you said " + KIND_SHORT[chosen].toLowerCase() + "; it is a " +
            KIND_SHORT[variable.answer].toLowerCase()));
      block.appendChild(head);
      block.appendChild(make("p", "part__body", variable.note));
      classifyBody.appendChild(block);
    });

    phaseFeedback.setAttribute("data-tone",
      right === 5 ? "good" : right >= 3 ? "caution" : "warn");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 5 classified as the tool has them. "));
    lead.appendChild(document.createTextNode(
      "Read every note, including the ones you got right — the reasoning " +
      "matters more than the label. Then open the repair bench."));
    phaseFeedback.appendChild(lead);
    classifyDetail.hidden = false;
    done[index] = true;
    renderTrack();
    shell.announce(right + " of 5 match. Notes are below the study card.",
      { immediate: true });
  }

  /* --- Events ----------------------------------------------------------------- */

  checkButton.addEventListener("click", checkClassification);

  repairButton.addEventListener("click", function () {
    setPhase("repair");
    shell.announce(
      "Repair bench open. Nothing repaired yet, so the estimate is " +
      fmt(estimateState().estimate) + " " + current().unit +
      " against a true effect of " + fmt(current().trueEffect) + ".",
      { immediate: true });
  });

  nextButton.addEventListener("click", function () {
    showCase((index + 1) % CASES.length);
    shell.announce("Study " + (index + 1) + " of " + CASES.length + ". " +
      current().claim, { immediate: true });
  });

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    varies: {
      tone: "caution",
      verdict: "Necessary, and it does almost no work.",
      text:
        "Almost everything varies between students. If varying were enough, " +
        "every variable ever measured would be a confound and the word would " +
        "mean nothing. The objection needs the variation to line up with " +
        "library use specifically."
    },
    outcome: {
      tone: "caution",
      verdict: "Half of it.",
      text:
        "Motivation certainly relates to marks. But a variable related to the " +
        "outcome and unrelated to the comparison just adds scatter: it widens " +
        "the interval and leaves the estimate where it was. Bias needs the " +
        "other half."
    },
    both: {
      tone: "good",
      verdict: "Yes — both conditions, and both are needed.",
      text:
        "More motivated students must use the library more, and motivation " +
        "must affect marks. With only the first, motivation is picked up by " +
        "library use and goes nowhere. With only the second, it is noise. Only " +
        "with both does part of the library-use difference actually belong to " +
        "motivation. That pair of conditions is what the whole tool is built " +
        "on."
    },
    uncontrolled: {
      tone: "caution",
      verdict: "Close, but it describes the fix rather than the fault.",
      text:
        "Being uncontrolled is what leaves a confound free to act, but plenty " +
        "of uncontrolled variables are harmless. Whether control was needed " +
        "depends on the two conditions above; without them there is nothing to " +
        "control for."
    }
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
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

  function openLab() {
    labSection.hidden = false;
    showCase(0);
    $("#lab-heading").focus();
    shell.announce("Detective unlocked. Study 1 of " + CASES.length + ".",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the detective.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* --- Challenge ---------------------------------------------------------------- */

  var CHALLENGE_NOTES = {
    age: {
      bites: false,
      text:
        "Does not bite on its own. Randomisation does not make groups " +
        "identical; it makes any difference between them a matter of chance " +
        "rather than of anything systematic. A small age difference in a " +
        "randomised trial is noise that happened to land unevenly, and it is " +
        "already accounted for by the analysis."
    },
    expect: {
      bites: true,
      text:
        "Bites. Everyone in the exercise group knows they are receiving " +
        "something and everyone on the waiting list knows they are not, so " +
        "expectancy travels perfectly with condition and plainly touches a " +
        "self-reported symptom score. An active control - stretching classes, " +
        "a social group - would separate the exercise from the being-given-" +
        "something."
    },
    dropout: {
      bites: true,
      text:
        "Bites, hard. Differential attrition undoes randomisation after the " +
        "fact: the groups being compared at the end are no longer the groups " +
        "that were allocated at the start. Losing the people doing worst from " +
        "one arm only will flatter that arm whatever the treatment did."
    },
    volunteers: {
      bites: false,
      text:
        "A real limitation, and not a bias in this comparison. Being " +
        "volunteers affects who the finding applies to - external validity - " +
        "but volunteering happened before allocation and is therefore spread " +
        "across both arms by the randomisation."
    },
    rater: {
      bites: true,
      text:
        "Bites. An unblinded assessor knows which score they are hoping for, " +
        "and that knowledge is perfectly aligned with condition. This is the " +
        "cheapest of the three real problems to fix and among the most " +
        "frequently left unfixed."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one objection.",
        "Three of the five identify something that could bias the comparison.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !CHALLENGE_NOTES[v].bites; });
    var rightMissed = Object.keys(CHALLENGE_NOTES).filter(function (v) {
      return CHALLENGE_NOTES[v].bites && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "caution" : rightMissed.length ? "caution" : "good";
    var verdictText = wrongPicked.length
      ? "One or more of these is a limitation rather than a bias."
      : rightMissed.length
        ? "Everything you chose does bite; there is more that does."
        : "Yes — the three that bite, and neither of the two that do not.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    challengeFeedback.appendChild(lead);
    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var note = CHALLENGE_NOTES[value];
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(note.text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ---------------------------------------------------------------------- */

  shell.onReset(function () {
    done = [];
    index = 0;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    showCase(0);
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the detective.",
    { immediate: true });
})();
