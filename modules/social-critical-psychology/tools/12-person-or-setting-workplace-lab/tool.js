/* =========================================================================
   Person or Setting? Workplace Explanation Laboratory
   -------------------------------------------------------------------------
   One fictional team (Kelbridge Service Centre, Team B) and two sequential
   experiments.

   EXPERIMENT 1  Three rounds of evidence.
     Round 1 is individual-level only: a validated exhaustion scale
     correlating 0.61 with performance ratings, two documented training gaps,
     two self-descriptions from exit interviews, and one person who is fine.
     Round 2 adds the team and its supervision. Round 3 adds the rota, the
     queue, the target and a matched comparison team. The learner commits to
     an explanation after each round, and the tool keeps the trail - because
     the point is that nothing about Team B changed between the rounds, only
     what the learner had been shown.

   EXPERIMENT 2  Ten units, twenty units' worth of interventions.
     Six interventions across three levels. The model projects a twelve-month
     exhaustion score and a number of leavers, and then prints the thing that
     matters: which pieces of evidence the chosen combination leaves in force.
     There is no combination that leaves nothing running.

   THE POINT THAT MUST SURVIVE BOTH
   --------------------------------
   The correlation of 0.61 is real, orderly and would replicate, and it is
   entirely compatible with the whole team sitting at 74 because of a rota. A
   between-person correlation measures variation WITHIN a setting, so a
   setting that is constant for everybody cannot appear in it. Every modelled
   outcome therefore reports that the rank order of the fourteen staff barely
   moves: a real, stable difference between people is not evidence about where
   its cause lives, or about where the remedy should go.

   And the symmetric point: two staff have a documented training gap that no
   scheduling change will close, and a structural account that cannot say so
   is not a better account.

   THE MODEL (all figures invented; nothing is a forecast of anything)
   ------------------------------------------------------------------
   Team mean exhaustion starts at 74 on a 0-100 scale; twelve-month leavers
   start at a projected 3 of 14. Each intervention subtracts points:

       A  resilience workshops          cost 2   -6, HALVED if nothing
                                                 structural is also chosen
       B  coaching for the two          cost 2   -1 on the team mean
       C  weekly protected debrief      cost 3   -9
       D  supervisor feedback practice  cost 3   -8
       E  rota and recovery redesign    cost 5   -18
       F  target and discretion change  cost 5   -16

       C and D together    a further -3   (a team that can speak to a
                                           supervisor who listens)
       E and F together    a further -5   (the rota and the target are one
                                           problem seen from two sides)

   Budget 10. Leavers = round(3 x (after / 74) ^ 1.6), floored at 0.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var START_EXHAUSTION = 74;
  var START_LEAVERS = 3;
  var TEAM_SIZE = 14;
  var BUDGET = 10;
  var COMPARISON_TEAM = 38;

  /* --- The evidence, in three rounds ---------------------------------------- */

  var EVIDENCE = [
    {
      id: 1, round: 0, level: "individual",
      text:
        "Across all fourteen team members, a validated exhaustion scale " +
        "correlates 0.61 with supervisor performance ratings. The three " +
        "highest scorers are the three who resigned."
    },
    {
      id: 2, round: 0, level: "individual",
      text:
        "Two staff have documented gaps in the system training that everybody " +
        "else completed. Both are among the lower-rated."
    },
    {
      id: 3, round: 0, level: "individual",
      text:
        "In exit interviews, two of the three leavers described themselves as " +
        "\"not cut out for it\"."
    },
    {
      id: 4, round: 0, level: "individual",
      text:
        "One team member has consistently high ratings and a low exhaustion " +
        "score, and has been in post four years."
    },
    {
      id: 5, round: 1, level: "relational",
      text:
        "Nobody in Team B has booked the available peer-support session in " +
        "eighteen months. In Team A, across the corridor, it runs weekly and " +
        "is full."
    },
    {
      id: 6, round: 1, level: "relational",
      text:
        "Team B's supervisor gives feedback only through the monthly rating. " +
        "There is no other regular conversation about the work."
    },
    {
      id: 7, round: 1, level: "relational",
      text:
        "New staff are told informally that \"you don't escalate unless you " +
        "really have to\". Escalating is read as not coping."
    },
    {
      id: 8, round: 2, level: "structural",
      text:
        "Team B works split shifts and Team A does not. The rota was produced " +
        "by a scheduling system optimised for coverage, and no manager chose " +
        "it."
    },
    {
      id: 9, round: 2, level: "structural",
      text:
        "Team B's queue carries all bereavement and complaint calls for the " +
        "region. There is no scheduled recovery time after an escalated call."
    },
    {
      id: 10, round: 2, level: "structural",
      text:
        "The team target is calls per hour. Staff cannot close a case " +
        "themselves; every resolution needs a supervisor sign-off, which " +
        "averages nineteen minutes."
    },
    {
      id: 11, round: 2, level: "structural",
      text:
        "Team A, matched with Team B on staff characteristics at recruitment " +
        "and doing nominally the same job, has a mean exhaustion score of " +
        COMPARISON_TEAM + " against Team B's " + START_EXHAUSTION + "."
    }
  ];

  var ROUND_TITLES = [
    "Round 1 - what the review found first",
    "Round 2 - the team and its supervision",
    "Round 3 - the work, and the team across the corridor"
  ];

  /* --- The explanation options ---------------------------------------------- */

  var EXPLANATIONS = [
    {
      value: "individual",
      label: "Mainly the people - their coping resources, skills and fit for the work",
      short: "The people"
    },
    {
      value: "relational",
      label: "Mainly the team - its norms about asking for help, and its supervision",
      short: "The team"
    },
    {
      value: "structural",
      label: "Mainly the work - the rota, the queue, the target and the sign-off",
      short: "The work"
    },
    {
      value: "several",
      label: "Several at once, and I cannot yet say which dominates",
      short: "Several at once"
    }
  ];

  var EXPLANATION_LABELS = {};
  EXPLANATIONS.forEach(function (e) { EXPLANATION_LABELS[e.value] = e.short; });

  /* Feedback per round and per answer. Round 1's individual answer is treated
     as the best-supported reading of the evidence available, because it is -
     the trap is the scope of the file, not the learner's reasoning. */
  var ROUND_FEEDBACK = [
    {
      individual: {
        tone: "good",
        title: "The best-supported reading of what you have",
        body:
          "Everything in round 1 is a measurement of individuals, so an " +
          "individual-level explanation is what it supports. Notice what you " +
          "have just done, though: you have described a pattern and called it " +
          "a cause. Nothing in these four items compares Team B with anything."
      },
      relational: {
        tone: "caution",
        title: "Ahead of the evidence, in a useful direction",
        body:
          "There is nothing in round 1 about how this team relates - no " +
          "observation of supervision, norms or support. You may well be " +
          "right, and you are currently right for reasons that are not in the " +
          "file."
      },
      structural: {
        tone: "caution",
        title: "Ahead of the evidence, in a useful direction",
        body:
          "Round 1 contains no information about the work at all: no rota, no " +
          "queue, no target, no comparison. Holding a structural hypothesis " +
          "before the evidence arrives is reasonable, and it is a prior rather " +
          "than a finding."
      },
      several: {
        tone: "good",
        title: "The most honest answer available",
        body:
          "Four measurements of individuals cannot separate levels, because " +
          "only one level has been measured. Refusing to choose here is not " +
          "indecision; it is an accurate report of what a single-level file " +
          "supports."
      }
    },
    {
      individual: {
        tone: "caution",
        title: "Still possible, and now competing",
        body:
          "Item 7 is the awkward one. If escalating is read as not coping, " +
          "then \"not cut out for it\" in an exit interview may be somebody " +
          "repeating what their team taught them - which would make item 3 an " +
          "effect of the setting rather than evidence about the person."
      },
      relational: {
        tone: "good",
        title: "Well supported by what you now have",
        body:
          "An unused support session, feedback only through a monthly rating, " +
          "and a norm against escalating are three separate mechanisms in the " +
          "same direction. Note the contrast already doing work in item 5: " +
          "Team A has the same session and fills it."
      },
      structural: {
        tone: "caution",
        title: "Still ahead of the file",
        body:
          "Round 2 is about relationships and norms, not about how the work " +
          "is designed. That evidence has not arrived yet."
      },
      several: {
        tone: "good",
        title: "Reasonable, and now it costs you something",
        body:
          "Two levels are now in play and both have evidence. \"Several at " +
          "once\" is defensible - but it will eventually have to become a " +
          "decision about where to spend, which is what experiment 2 makes you " +
          "do."
      }
    },
    {
      individual: {
        tone: "warn",
        title: "Hard to sustain against item 11",
        body:
          "Two teams matched at recruitment, on the same floor, thirty-six " +
          "points apart. For an individual-level explanation to survive that, " +
          "the two teams would have to have diverged in composition for " +
          "reasons unrelated to the work - which is possible, and which the " +
          "file does not support."
      },
      relational: {
        tone: "caution",
        title: "Real, and probably downstream",
        body:
          "The norms in round 2 are genuine. But a rota of split shifts, a " +
          "queue of bereavement calls with no recovery time and a " +
          "calls-per-hour target are exactly the conditions under which a " +
          "team stops asking for help. The relational mechanisms may be " +
          "carrying the effect rather than causing it."
      },
      structural: {
        tone: "good",
        title: "The best-supported reading of the full file",
        body:
          "The rota, the queue, the target and the sign-off bottleneck are all " +
          "present, and item 11 supplies the comparison that makes them " +
          "candidates for the cause rather than mere context. Be precise about " +
          "its limits, though: matched at recruitment is not matched now, and " +
          "nobody randomised anyone to a rota."
      },
      several: {
        tone: "good",
        title: "Defensible, and the honest version of it is specific",
        body:
          "All three levels have evidence and all three are probably real at " +
          "once. The useful form of this answer names what each level would " +
          "leave running if you addressed only that one - which is exactly the " +
          "arithmetic in experiment 2."
      }
    }
  ];

  /* --- Interventions ---------------------------------------------------------- */

  var INTERVENTIONS = [
    {
      id: "A", level: "Individual", cost: 2, effect: 6,
      label: "Resilience and stress-management workshops for the whole team",
      addresses: [3],
      leaves:
        "Nothing in the way the work is designed. In this model its effect is " +
        "halved unless something structural changes too, because the " +
        "conditions that produced the exhaustion go on producing it."
    },
    {
      id: "B", level: "Individual", cost: 2, effect: 1,
      label: "Targeted coaching for the two staff with documented training gaps",
      addresses: [2],
      leaves:
        "Almost nothing on the team mean - it is aimed at two people, and it " +
        "is the right intervention for those two. No rota change closes a " +
        "training gap."
    },
    {
      id: "C", level: "Relational", cost: 3, effect: 9,
      label: "Weekly team debrief in protected time, with attendance expected",
      addresses: [5, 7],
      leaves:
        "The supervisor's feedback practice, unless that is addressed too."
    },
    {
      id: "D", level: "Relational", cost: 3, effect: 8,
      label: "Change the supervisor's feedback practice: training and observation",
      addresses: [6],
      leaves:
        "The norm against escalating, which lives in the team rather than in " +
        "the supervisor."
    },
    {
      id: "E", level: "Structural", cost: 5, effect: 18,
      label: "Redesign the rota: no split shifts, twenty minutes' recovery after an escalated call",
      addresses: [8, 9],
      leaves:
        "The calls-per-hour target and the sign-off bottleneck, which will " +
        "compete with the recovery time you have just protected."
    },
    {
      id: "F", level: "Structural", cost: 5, effect: 16,
      label: "Replace calls-per-hour with resolution at first contact, and let staff close a case",
      addresses: [10],
      leaves:
        "The split shifts and the bereavement queue, which do not become " +
        "easier because the target changed."
    }
  ];

  var PAIR_BONUS = [
    { pair: ["C", "D"], bonus: 3, why: "a team that can talk, and a supervisor who listens" },
    { pair: ["E", "F"], bonus: 5, why: "the rota and the target are one problem seen from two sides" }
  ];

  /* --- The challenge ------------------------------------------------------------ */

  var CLAIMS = [
    {
      id: "correlation",
      text:
        "\"Exhaustion correlates 0.61 with performance across the fourteen " +
        "staff, so the problem is in the individuals.\"",
      answer: "no",
      why:
        "A correlation between people measures how they vary within one " +
        "setting. The rota, the queue and the target are the same for all " +
        "fourteen, so they cannot appear in that correlation at all - which " +
        "means the correlation cannot be evidence against them. It is a real, " +
        "orderly finding about how these fourteen people differ from each " +
        "other, and it survives every intervention in experiment 2 unchanged."
    },
    {
      id: "dontmatter",
      text:
        "\"Team A is thirty-six points lower, so the differences between " +
        "individuals in Team B do not matter.\"",
      answer: "no",
      why:
        "Both facts are true and neither cancels the other. The setting sets " +
        "the level everybody sits at; the individual differences set who sits " +
        "where within it. Two staff have a documented training gap that a " +
        "rota change does not close, and the three most exhausted people are " +
        "still the three most exhausted after every combination you can model."
    },
    {
      id: "resilience",
      text: "\"Resilience training is the wrong intervention here.\"",
      answer: "partly",
      why:
        "It is not wrong; it is insufficient on its own, and the model halves " +
        "its effect when nothing structural changes because the conditions " +
        "reload what the training discharged. The sharper objection is not " +
        "about efficacy at all: offered instead of a rota change, it relocates " +
        "the problem into the staff and makes any subsequent failure theirs."
    },
    {
      id: "rotafix",
      text:
        "\"Redesigning the rota would deal with the two staff who have " +
        "training gaps.\"",
      answer: "no",
      why:
        "No scheduling change closes a documented skill gap. This is the " +
        "symmetric error to claim 1, and it is the one a structural enthusiasm " +
        "makes: treating every problem in a setting as a problem of the " +
        "setting. Intervention B costs two units and is the right answer for " +
        "those two people."
    },
    {
      id: "matched",
      text:
        "\"The two teams were matched at recruitment, so the difference must " +
        "be caused by the work design.\"",
      answer: "partly",
      why:
        "It is the strongest evidence in the file and it is not proof. Matched " +
        "at recruitment is not matched now - three people have left Team B, " +
        "and they were the three most exhausted, which changes the composition " +
        "in exactly the direction that complicates the comparison. Nobody " +
        "randomised anyone to a rota. This is a quasi-experimental comparison " +
        "open to the usual objections, and saying so is not hedging."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "yes", label: "Supported by this evidence" },
    { value: "partly", label: "Partly - it needs a qualification" },
    { value: "no", label: "Not supported" }
  ];

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

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

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  /* =======================================================================
     Shared page furniture
     ===================================================================== */

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var expOne = $("#experiment-one");
  var expTwo = $("#experiment-two");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  /* =======================================================================
     Experiment 1 - three rounds
     ===================================================================== */

  var roundsShell = InteractiveShell.attach("#rounds-lab");
  if (!roundsShell) { return; }

  var stageTrack = $("[data-stage-track]");
  var roundLegend = $("[data-round-legend]");
  var evidenceList = $("[data-evidence]");
  var explanationOptions = $("[data-explanation-options]");
  var roundNote = $("[data-round-note]");
  var trail = $("[data-trail]");
  var roundFeedback = $("[data-round-feedback]");
  var commitButton = $('[data-action="commit"]');

  var EXP1_INITIAL = { round: 0, choice: null, answers: [] };
  var exp1 = null;

  function visibleEvidence() {
    return EVIDENCE.filter(function (item) { return item.round <= exp1.round; });
  }

  function buildEvidence() {
    clear(evidenceList);
    visibleEvidence().forEach(function (item) {
      var li = make("li", "evidence__item");
      li.setAttribute("data-level", item.level);
      li.setAttribute("data-round", String(item.round));
      li.appendChild(make("span", "evidence__number", "Item " + item.id));
      li.appendChild(make("span", "evidence__text", item.text));
      evidenceList.appendChild(li);
    });
  }

  function buildExplanationOptions() {
    clear(explanationOptions);
    var settled = exp1.answers.length > exp1.round;
    EXPLANATIONS.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "explanation-" + exp1.round;
      input.value = option.value;
      input.checked = exp1.choice === option.value;
      input.disabled = settled;
      input.addEventListener("change", function () { exp1.choice = option.value; });
      label.appendChild(input);
      label.appendChild(make("span", null, option.label));
      explanationOptions.appendChild(label);
    });
  }

  function renderTrail() {
    clear(trail);
    if (!exp1.answers.length) {
      trail.appendChild(make("li", "trail__empty",
        "Nothing recorded yet. Read the four items beside this and commit to " +
        "an explanation - you will get more evidence afterwards, and you may " +
        "change your mind."));
      return;
    }
    exp1.answers.forEach(function (answer, index) {
      var count = EVIDENCE.filter(function (e) { return e.round <= index; }).length;
      var li = make("li", "trail__item");
      li.appendChild(make("span", "trail__round",
        "After round " + (index + 1) + ", on " + count + " items"));
      li.appendChild(make("span", "trail__answer", EXPLANATION_LABELS[answer]));
      trail.appendChild(li);
    });
    if (exp1.answers.length === 3) {
      var moved = exp1.answers[0] !== exp1.answers[2];
      var note = make("li", "trail__note");
      note.textContent = moved
        ? "Your explanation moved between round 1 and round 3. Nothing about " +
          "Team B changed in between."
        : "Your explanation held across all three rounds. Worth asking what " +
          "would have moved it, and whether the file could have supplied it.";
      trail.appendChild(note);
    }
  }

  function renderRoundFeedback() {
    clear(roundFeedback);
    exp1.answers.forEach(function (answer, index) {
      var entry = ROUND_FEEDBACK[index][answer];
      var box = make("div", "verdict");
      box.setAttribute("data-tone", entry.tone);
      box.appendChild(make("h5", "verdict__title",
        "Round " + (index + 1) + " - " + entry.title));
      box.appendChild(make("p", "verdict__body", entry.body));
      roundFeedback.appendChild(box);
    });
    if (exp1.answers.length === 3) {
      var closing = make("div", "verdict");
      closing.setAttribute("data-tone", "warn");
      closing.appendChild(make("h5", "verdict__title",
        "The thing that did not change"));
      closing.appendChild(make("p", "verdict__body",
        "Item 1 is still true. The correlation of 0.61 is real, orderly and " +
        "would replicate, and it is entirely compatible with the whole team " +
        "sitting at " + START_EXHAUSTION + " because of a rota - because a " +
        "correlation between people measures how they vary within one setting, " +
        "and a setting that is identical for all fourteen cannot appear in it."));
      closing.appendChild(make("p", "verdict__note",
        "That is why experiment 2 reports, after every combination you can " +
        "model, that the rank order of the fourteen barely moves."));
      roundFeedback.appendChild(closing);
    }
  }

  function renderTrack() {
    $$("li", stageTrack).forEach(function (li, index) {
      li.removeAttribute("aria-current");
      if (index < exp1.answers.length) {
        li.setAttribute("data-state", "done");
      } else {
        li.removeAttribute("data-state");
      }
      if (index === exp1.round) { li.setAttribute("aria-current", "step"); }
    });
  }

  function renderExp1(options) {
    roundLegend.textContent = ROUND_TITLES[exp1.round];
    buildEvidence();
    buildExplanationOptions();
    commitButton.hidden = exp1.answers.length >= 3;
    commitButton.textContent = exp1.round === 2
      ? "Record my final explanation"
      : "Record this and release the next round";
    renderTrail();
    renderRoundFeedback();
    renderTrack();
    if (options && options.announce) {
      roundsShell.announce(options.announce, { immediate: true });
    }
  }

  commitButton.addEventListener("click", function () {
    if (!exp1.choice) {
      roundNote.textContent =
        "Choose one before recording. \"Several at once\" is a real answer " +
        "and is recorded as one.";
      roundsShell.announce(roundNote.textContent, { immediate: true });
      return;
    }
    roundNote.textContent = "";
    exp1.answers.push(exp1.choice);
    var last = exp1.round === 2;
    if (!last) {
      exp1.round += 1;
      exp1.choice = null;
    }
    renderExp1({
      announce: last
        ? "Final explanation recorded. All eleven items are now visible, and " +
          "the trail of what you said after each round is beside you."
        : ROUND_TITLES[exp1.round] + " released. " +
          visibleEvidence().length + " items now visible."
    });
  });

  /* =======================================================================
     Experiment 2 - the intervention budget
     ===================================================================== */

  var interventionShell = InteractiveShell.attach("#intervention-lab");
  if (!interventionShell) { return; }

  var budgetLine = $("[data-budget]");
  var interventionBox = $("[data-interventions]");
  var modelNote = $("[data-model-note]");
  var outcomeSvg = $("[data-outcome]");
  var outcomeText = $("[data-outcome-text]");
  var untouched = $("[data-untouched]");
  var tried = $("[data-tried]");
  var triedBody = $("[data-tried-body]");

  var EXP2_INITIAL = { selected: [], modelled: null, history: [] };
  var exp2 = null;

  function costOf(ids) {
    return ids.reduce(function (sum, id) {
      return sum + INTERVENTIONS.filter(function (i) { return i.id === id; })[0].cost;
    }, 0);
  }

  function runModel(ids) {
    var hasStructural = ids.some(function (id) {
      return INTERVENTIONS.filter(function (i) { return i.id === id; })[0].level === "Structural";
    });
    var reduction = 0;
    var notes = [];
    ids.forEach(function (id) {
      var item = INTERVENTIONS.filter(function (i) { return i.id === id; })[0];
      var effect = item.effect;
      if (id === "A" && !hasStructural) {
        effect = effect / 2;
        notes.push(
          "The resilience workshops are modelled at half effect (" +
          effect.toFixed(0) + " points instead of " + item.effect +
          ") because nothing structural changed, so the conditions that " +
          "produced the exhaustion go on producing it.");
      }
      reduction += effect;
    });
    PAIR_BONUS.forEach(function (pair) {
      if (ids.indexOf(pair.pair[0]) !== -1 && ids.indexOf(pair.pair[1]) !== -1) {
        reduction += pair.bonus;
        notes.push(
          "A further " + pair.bonus + " points because " + pair.pair[0] +
          " and " + pair.pair[1] + " were taken together: " + pair.why + ".");
      }
    });
    var after = Math.max(0, START_EXHAUSTION - reduction);
    var leavers = Math.max(0, Math.round(
      START_LEAVERS * Math.pow(after / START_EXHAUSTION, 1.6)));
    var levels = {};
    ids.forEach(function (id) {
      levels[INTERVENTIONS.filter(function (i) { return i.id === id; })[0].level] = true;
    });
    return {
      ids: ids.slice(),
      cost: costOf(ids),
      after: after,
      reduction: reduction,
      leavers: leavers,
      notes: notes,
      levels: Object.keys(levels).sort()
    };
  }

  function buildInterventions() {
    clear(interventionBox);
    var spent = costOf(exp2.selected);
    ["Individual", "Relational", "Structural"].forEach(function (level) {
      var group = make("div", "level-group");
      group.appendChild(make("p", "level-group__title", level));
      INTERVENTIONS.filter(function (i) { return i.level === level; })
        .forEach(function (item) {
          var chosen = exp2.selected.indexOf(item.id) !== -1;
          var wouldExceed = !chosen && spent + item.cost > BUDGET;
          var label = make("label", "control--choice pick");
          if (wouldExceed) { label.setAttribute("data-over", "yes"); }
          var input = document.createElement("input");
          input.type = "checkbox";
          input.value = item.id;
          input.checked = chosen;
          input.disabled = wouldExceed;
          input.addEventListener("change", function () {
            var at = exp2.selected.indexOf(item.id);
            if (input.checked && at === -1) { exp2.selected.push(item.id); }
            if (!input.checked && at !== -1) { exp2.selected.splice(at, 1); }
            renderExp2();
          });
          label.appendChild(input);
          var body = make("span", "pick__body");
          body.appendChild(make("span", "pick__text", item.label));
          body.appendChild(make("span", "pick__cost",
            item.cost + " unit" + (item.cost === 1 ? "" : "s") +
            (wouldExceed ? " - more than you have left" : "")));
          label.appendChild(body);
          group.appendChild(label);
        });
      interventionBox.appendChild(group);
    });
    budgetLine.textContent =
      "Budget " + BUDGET + " units. Spent " + spent + ", " + (BUDGET - spent) +
      " left. All six together would cost " + costOf(INTERVENTIONS.map(function (i) {
        return i.id;
      })) + ".";
  }

  var NS = "http://www.w3.org/2000/svg";

  function drawOutcome() {
    clear(outcomeSvg);
    var result = exp2.modelled;
    var rows = [
      { label: "Team B now", value: START_EXHAUSTION, cls: "chart__bar" },
      {
        label: "After 12 months",
        value: result ? result.after : START_EXHAUSTION,
        cls: "bar--after"
      },
      { label: "Team A now", value: COMPARISON_TEAM, cls: "bar--comparison" }
    ];
    var barX = 118;
    var barW = 172;
    rows.forEach(function (row, index) {
      var y = 10 + index * 28;
      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(barX));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(barW));
      track.setAttribute("height", "18");
      track.setAttribute("class", "chart__track");
      outcomeSvg.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(barX));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(1, (row.value / 100) * barW)));
      bar.setAttribute("height", "18");
      bar.setAttribute("class", row.cls);
      outcomeSvg.appendChild(bar);

      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", String(barX - 6));
      name.setAttribute("y", String(y + 13));
      name.setAttribute("text-anchor", "end");
      name.setAttribute("class", "chart__label");
      name.textContent = row.label;
      outcomeSvg.appendChild(name);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(barX + Math.max(1, (row.value / 100) * barW) + 5));
      value.setAttribute("y", String(y + 13));
      value.setAttribute("class", "chart__count");
      value.textContent = String(Math.round(row.value));
      outcomeSvg.appendChild(value);
    });

    var scale = document.createElementNS(NS, "text");
    scale.setAttribute("x", String(barX));
    scale.setAttribute("y", "92");
    scale.setAttribute("class", "chart__axis");
    scale.textContent = "Exhaustion scale, 0 to 100";
    outcomeSvg.appendChild(scale);

    outcomeText.textContent = result
      ? "Team B's mean exhaustion score falls from " + START_EXHAUSTION +
        " to " + Math.round(result.after) + " on a 0 to 100 scale, against " +
        COMPARISON_TEAM + " for Team A. Projected leavers over twelve months: " +
        result.leavers + " of " + TEAM_SIZE + ", against " + START_LEAVERS +
        " with no intervention. Cost " + result.cost + " of " + BUDGET +
        " units."
      : "Nothing modelled yet. Team B's mean exhaustion score is " +
        START_EXHAUSTION + " on a 0 to 100 scale, against " + COMPARISON_TEAM +
        " for Team A, with " + START_LEAVERS + " leavers projected over twelve " +
        "months. Choose a combination and model it.";
  }

  function renderUntouched() {
    clear(untouched);
    var result = exp2.modelled;
    if (!result) { return; }

    if (result.notes.length) {
      var noteBox = make("div", "verdict");
      noteBox.setAttribute("data-tone", "caution");
      noteBox.appendChild(make("h5", "verdict__title", "How the model got there"));
      result.notes.forEach(function (note) {
        noteBox.appendChild(make("p", "verdict__body", note));
      });
      untouched.appendChild(noteBox);
    }

    /* Which pieces of evidence nobody has addressed. */
    var addressed = {};
    result.ids.forEach(function (id) {
      INTERVENTIONS.filter(function (i) { return i.id === id; })[0]
        .addresses.forEach(function (item) { addressed[item] = true; });
    });
    var missed = INTERVENTIONS.filter(function (item) {
      return result.ids.indexOf(item.id) === -1;
    });

    var box = make("div", "verdict");
    box.setAttribute("data-tone", "warn");
    box.appendChild(make("h5", "verdict__title", "What this leaves running"));
    if (!missed.length) {
      box.appendChild(make("p", "verdict__body",
        "Nothing on the menu - which is not a state you can reach inside the " +
        "budget, and is worth noticing for that reason alone."));
    } else {
      var list = make("ul", "leaves");
      missed.forEach(function (item) {
        var li = make("li");
        var names = item.addresses.map(function (id) { return "item " + id; }).join(" and ");
        li.appendChild(make("strong", null, item.level + ": "));
        li.appendChild(document.createTextNode(
          item.label + " was not taken, so " + names + " stays in force. " +
          item.leaves));
        list.appendChild(li);
      });
      box.appendChild(list);
    }
    untouched.appendChild(box);

    /* The claim the whole tool is for. */
    var rank = make("div", "verdict");
    rank.setAttribute("data-tone", "neutral");
    rank.appendChild(make("h5", "verdict__title",
      "And the thing that does not move"));
    rank.appendChild(make("p", "verdict__body",
      "Whatever you spend, the rank order of the fourteen staff is essentially " +
      "unchanged: the same people are still the most exhausted and the same " +
      "people are still the least. The setting sets the level everybody sits " +
      "at; the differences between people set who sits where within it. A " +
      "real, stable, replicable difference between people is not evidence " +
      "about where its cause lives."));
    if (result.levels.indexOf("Individual") === -1) {
      rank.appendChild(make("p", "verdict__note",
        "Your combination has nothing at the individual level. Two staff have " +
        "a documented training gap, and no scheduling or target change closes " +
        "it - a structural account that cannot say so is not a better account."));
    } else if (result.levels.length === 1) {
      rank.appendChild(make("p", "verdict__note",
        "Your combination is entirely individual-level. The split shifts, the " +
        "bereavement queue and the calls-per-hour target are unchanged, and in " +
        "this model they reload what the training discharged."));
    }
    untouched.appendChild(rank);
  }

  function renderTried() {
    tried.hidden = exp2.history.length === 0;
    clear(triedBody);
    exp2.history.forEach(function (result) {
      var tr = make("tr");
      var th = make("th", null,
        result.ids.length ? result.ids.join(" + ") : "Nothing");
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, String(result.cost)));
      tr.appendChild(make("td", null,
        result.levels.length ? result.levels.join(", ") : "none"));
      tr.appendChild(make("td", null,
        START_EXHAUSTION + " to " + Math.round(result.after)));
      tr.appendChild(make("td", null, String(result.leavers)));
      triedBody.appendChild(tr);
    });
  }

  function renderExp2(options) {
    buildInterventions();
    drawOutcome();
    renderUntouched();
    renderTried();
    if (options && options.announce) {
      interventionShell.announce(options.announce, { immediate: true });
    }
  }

  $('[data-action="model"]').addEventListener("click", function () {
    if (!exp2.selected.length) {
      modelNote.textContent =
        "Choose at least one intervention. Modelling nothing is a legitimate " +
        "comparison, but you have to say so on purpose - use the table below " +
        "for the no-intervention row.";
      interventionShell.announce(modelNote.textContent, { immediate: true });
      return;
    }
    modelNote.textContent = "";
    var order = INTERVENTIONS.map(function (i) { return i.id; });
    var ids = exp2.selected.slice().sort(function (a, b) {
      return order.indexOf(a) - order.indexOf(b);
    });
    var result = runModel(ids);
    exp2.modelled = result;
    var seen = exp2.history.some(function (h) {
      return h.ids.join("") === result.ids.join("");
    });
    if (!seen) { exp2.history.push(result); }
    renderExp2({
      announce: "Modelled " + result.ids.join(" plus ") + ". Exhaustion falls " +
        "from " + START_EXHAUSTION + " to " + Math.round(result.after) +
        ", projected leavers " + result.leavers + " of " + TEAM_SIZE +
        ". The list of what it leaves running is beside you."
    });
  });

  $('[data-action="clear"]').addEventListener("click", function () {
    exp2.selected = [];
    exp2.modelled = null;
    modelNote.textContent = "";
    renderExp2({ announce: "Selection cleared. The combinations you have " +
      "already modelled are kept in the table." });
  });

  $('[data-action="worked"]').addEventListener("click", function () {
    /* The two ten-unit extremes, modelled in order, so the table holds both
       and the learner lands on the structural one. */
    exp2.history = [];
    [["A", "B", "C", "D"], ["E", "F"]].forEach(function (ids) {
      var result = runModel(ids);
      exp2.history.push(result);
      exp2.modelled = result;
      exp2.selected = ids.slice();
    });
    renderExp2({
      announce: "Worked example: both ten-unit extremes modelled. Everything " +
        "individual and relational reaches 50; the two structural changes " +
        "alone reach 35. Read the second row's list of what it leaves running."
    });
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
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
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One judgement per claim, please.",
        "Two of the five point in each direction, and neither direction is the " +
        "safe answer.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", right + " of 5 match."));
    lead.appendChild(document.createTextNode(
      " Claims 1 and 4 are the same error made in opposite directions, and " +
      "getting one right while getting the other wrong is the most common " +
      "outcome here."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        (index + 1) + ": " + CLAIM_LABELS[claim.answer] + "."));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + CLAIM_LABELS[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    roundsShell.announce("Five claims judged. " + right + " match.",
      { immediate: true });
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    individual: {
      tone: "caution",
      verdict: "That is the inference the whole laboratory is about.",
      text:
        "A correlation between people measures how they vary within one " +
        "setting. Anything that is the same for all fourteen - a rota, a " +
        "queue, a target - cannot appear in it at all, so it cannot be ruled " +
        "out by it either."
    },
    nothing: {
      tone: "caution",
      verdict: "Too dismissive, and it costs you the interesting part.",
      text:
        "A correlation of that size in a team of fourteen is not precisely " +
        "estimated, and the ordering it describes is real and would replicate. " +
        "Throwing the finding away means missing that two staff have a genuine " +
        "training gap which no change to the work will close."
    },
    pattern: {
      tone: "good",
      verdict: "Exactly, and holding that line is the whole skill.",
      text:
        "It establishes an orderly difference between people and nothing " +
        "whatever about its source. The same finding is compatible with the " +
        "individuals being the problem and with the entire team sitting where " +
        "it sits because of a rota."
    },
    selection: {
      tone: "caution",
      verdict: "A cause, smuggled in as a description.",
      text:
        "Nothing in a within-team correlation compares this team's recruitment " +
        "with anybody else's. Round 3 supplies a comparison team that was " +
        "matched at recruitment, which is exactly the evidence this claim " +
        "would need and does not have yet."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLabs() {
    expOne.hidden = false;
    expTwo.hidden = false;
    renderExp1();
    renderExp2();
    roundsShell.announce(
      "Both experiments open. Experiment 1 starts at round 1, with four items " +
      "visible.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the experiments.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLabs();
    $("#exp1-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    openLabs();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  /* One handler, registered on BOTH shells, so either reset button restores
     the whole page. Registering a per-experiment handler on its own shell
     would leave a learner who reset experiment 2 with experiment 1 still
     part-answered and the prediction gate reopened - which is exactly the
     inconsistent state the reset is meant to prevent. */
  function resetAll() {
    exp1 = JSON.parse(JSON.stringify(EXP1_INITIAL));
    exp2 = JSON.parse(JSON.stringify(EXP2_INITIAL));
    roundNote.textContent = "";
    modelNote.textContent = "";
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    expOne.hidden = true;
    expTwo.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    renderExp1();
    renderExp2();
  }

  roundsShell.onReset(resetAll);
  interventionShell.onReset(resetAll);

  buildClaims();

  roundsShell.reset({ silent: true });
  interventionShell.reset({ silent: true });
  roundsShell.announce(
    "Ready. Answer the question above to open both experiments.",
    { immediate: true });
})();
