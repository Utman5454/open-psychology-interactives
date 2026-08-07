/* =========================================================================
   Minimal Group Allocation Laboratory
   -------------------------------------------------------------------------
   The learner is sorted into an arbitrary fictional category, told the basis
   was arbitrary, and then allocates symbolic points between one anonymous
   member of each category, six times. The same six allocations can then be run
   in a world where the learner's category already holds four times as much, and
   in one where it holds a quarter.

   THE EDUCATIONAL MODEL
   ---------------------
   Every allocation offers four options, written out in full:

       fair      equal points to both
       joint     the largest total, with slightly more to the other category
       ingroup   the most points this option set can give to the learner's own
                 category
       gap       the largest difference in favour of the learner's own category,
                 which always gives that category FEWER points than `ingroup`

   The last of those is the whole point of the paradigm. Choosing it is not a
   way of getting more; it is a way of being further ahead, and no self-interest
   account reaches it because the allocator cannot allocate to themselves and
   the points buy nothing.

   The three starting positions are the tool's own addition. The point-scoring
   of a `gap` choice is identical in all three; the act is not. Where both
   categories start level it creates an inequality; where the learner's category
   already holds 400 against 100 it widens one. The comparison table reports the
   gap between the categories after allocation so that the difference is
   visible.

   WHAT THIS IS NOT
   ----------------
   Not an explanation of prejudice or of structural inequality; not a
   measurement of the person using it - nothing is stored and no score is
   produced for anybody. The allocation matrices here are original, not
   reproductions of any published set. The paradigm's own criticisms are on the
   page: the options constrain what can be expressed, participants may read the
   task as being about what the experimenter wants, and allocating may be the
   only available way of doing anything at all.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var STRATEGIES = [
    { id: "fair", label: "Equal to both", column: "Fair" },
    { id: "joint", label: "Largest total between them", column: "Joint total" },
    { id: "ingroup", label: "Most for your own category", column: "Own group most" },
    { id: "gap", label: "Largest lead over the other category", column: "Largest gap" }
  ];

  /* Six original allocation sets. In every one, `gap` gives the learner's own
     category fewer points than `ingroup` does - which is what makes the choice
     between them diagnostic. */
  var ITEMS = [
    { fair: [18, 18], joint: [23, 26], ingroup: [25, 22], gap: [19, 7] },
    { fair: [14, 14], joint: [17, 21], ingroup: [20, 18], gap: [15, 5] },
    { fair: [21, 21], joint: [26, 30], ingroup: [29, 26], gap: [22, 9] },
    { fair: [12, 12], joint: [16, 19], ingroup: [18, 15], gap: [13, 3] },
    { fair: [17, 17], joint: [22, 25], ingroup: [24, 21], gap: [18, 6] },
    { fair: [15, 15], joint: [19, 23], ingroup: [22, 19], gap: [16, 4] }
  ];

  var CONTEXTS = {
    equal: { label: "Equal start", own: 100, other: 100 },
    ahead: { label: "Your category ahead", own: 400, other: 100 },
    behind: { label: "Your category behind", own: 100, other: 400 }
  };

  var SORTING = [
    { id: "left", label: "The pattern on the left" },
    { id: "right", label: "The pattern on the right" }
  ];

  var CLAIMS = [
    {
      id: "sufficient",
      text:
        "\"Being put into a category, with nothing else, is enough to produce " +
        "differential allocation.\"",
      answer: "yes",
      why:
        "This is what the paradigm was built to test and what it supports. " +
        "There is no contact, no competition, no history and no self-interest " +
        "in the situation, so anything systematic that appears cannot require " +
        "them. Note how narrow the supported claim is: sufficient for an " +
        "allocation difference, in this task, under these options."
    },
    {
      id: "prejudice",
      text: "\"This explains prejudice.\"",
      answer: "no",
      why:
        "Prejudice involves beliefs about a group, feelings towards it, and a " +
        "history of what has been said and done. None of that exists between " +
        "Kestrels and Wrens. The paradigm rules out some accounts of " +
        "discrimination - those requiring prior hostility or competition - " +
        "which is a contribution to an explanation rather than an explanation."
    },
    {
      id: "structural",
      text:
        "\"Pay gaps and unequal access to housing follow from the same process " +
        "as these allocations.\"",
      answer: "no",
      why:
        "Structural inequalities persist through arrangements - contracts, " +
        "planning rules, hiring practices, inherited assets - that carry on " +
        "producing outcomes whatever any individual allocates. A model in which " +
        "such inequalities are the sum of individual allocations gets the " +
        "direction of explanation the wrong way round, and the third condition " +
        "in this laboratory is a hint at why: the same choice does something " +
        "quite different depending on where the categories already stand."
    },
    {
      id: "hostility",
      text: "\"People who favour their own category are hostile to the other one.\"",
      answer: "partly",
      why:
        "An allocation task cannot separate the two. Ingroup favouring and " +
        "outgroup hostility come apart much more often than the textbook " +
        "treatment suggests: most of what looks like discrimination in these " +
        "studies is withholding from the other group rather than harming it, " +
        "and the difference matters for what you would predict next."
    },
    {
      id: "me",
      text: "\"Your own six choices show how you treat people in real life.\"",
      answer: "no",
      why:
        "Six allocations between two invented categories, made by somebody who " +
        "knows the categories are invented, in a browser, with nothing at " +
        "stake. Nothing is stored and no score is produced for anybody. If a " +
        "tool like this ever told you something about your character, that " +
        "would be a reason to distrust the tool."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "yes", label: "Supported by this kind of evidence" },
    { value: "partly", label: "Partly - it needs a qualification" },
    { value: "no", label: "Not supported" }
  ];

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

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#minimal-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var sortBlock = $("[data-sort-block]");
  var sortChoices = $("[data-sort-choices]");
  var contextBlock = $("[data-context-block]");
  var contextSelect = $("#context-select");
  var itemBlock = $("[data-item-block]");
  var itemLegend = $("[data-item-legend]");
  var optionsBox = $("[data-options]");
  var itemNote = $("[data-item-note]");
  var profileLead = $("[data-profile-lead]");
  var strategySvg = $("[data-strategy]");
  var strategyText = $("[data-strategy-text]");
  var outcome = $("[data-outcome]");
  var comparison = $("[data-comparison]");
  var comparisonBody = $("[data-comparison-body]");
  var comparisonNote = $("[data-comparison-note]");
  var goalText = $("[data-goal-text]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var OWN = "Kestrels";
  var OTHER = "Wrens";

  var INITIAL = {
    unlocked: false,
    sorted: false,
    context: "equal",
    item: 0,
    pick: null,
    choices: [],
    completed: {}
  };
  var state = null;

  /* --- Sorting ------------------------------------------------------------- */

  function buildSort() {
    clear(sortChoices);
    SORTING.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "sorting";
      input.value = option.id;
      input.addEventListener("change", function () {
        state.sorted = true;
        render();
        shell.announce(
          "You have been assigned to the " + OWN + ". The basis was the " +
          "pattern you chose, which was decided by nothing and means nothing. " +
          "You will now allocate points between one " + OWN.slice(0, -1) +
          " and one " + OTHER.slice(0, -1) + ".",
          { immediate: true });
      });
      label.appendChild(input);
      label.appendChild(make("span", null, option.label));
      sortChoices.appendChild(label);
    });
  }

  /* --- Allocation items ----------------------------------------------------- */

  function buildOptions() {
    clear(optionsBox);
    var item = ITEMS[state.item];
    if (!item) { return; }
    STRATEGIES.forEach(function (strategy) {
      var pair = item[strategy.id];
      var label = make("label", "control--choice allocation");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "allocation-" + state.item;
      input.value = strategy.id;
      input.addEventListener("change", function () { state.pick = strategy.id; });
      label.appendChild(input);
      var body = make("span", "allocation__body");
      body.appendChild(make("span", "allocation__points",
        pair[0] + " points to the " + OWN.slice(0, -1) + ", " +
        pair[1] + " to the " + OTHER.slice(0, -1)));
      var difference = pair[0] - pair[1];
      body.appendChild(make("span", "allocation__detail",
        "total " + (pair[0] + pair[1]) + ", " +
        (difference === 0
          ? "no difference between them"
          : "difference " + (difference > 0 ? "+" : "") + difference +
            " in favour of the " + (difference > 0 ? OWN : OTHER))));
      label.appendChild(body);
      optionsBox.appendChild(label);
    });
  }

  function tally() {
    var counts = { fair: 0, joint: 0, ingroup: 0, gap: 0 };
    state.choices.forEach(function (id) { counts[id] += 1; });
    return counts;
  }

  function totals() {
    var context = CONTEXTS[state.context];
    var own = context.own;
    var other = context.other;
    state.choices.forEach(function (id, index) {
      var pair = ITEMS[index][id];
      own += pair[0];
      other += pair[1];
    });
    return { own: own, other: other, gap: own - other };
  }

  /* --- Rendering ------------------------------------------------------------ */

  function renderProfile() {
    var counts = tally();
    var done = state.choices.length;
    profileLead.textContent = done
      ? done + " of 6 allocations made in the " +
        CONTEXTS[state.context].label.toLowerCase() + " condition."
      : "No allocations yet in the " + CONTEXTS[state.context].label.toLowerCase() +
        " condition.";

    var NS = "http://www.w3.org/2000/svg";
    clear(strategySvg);
    STRATEGIES.forEach(function (strategy, index) {
      var y = 6 + index * 27;
      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", "128"); track.setAttribute("y", String(y));
      track.setAttribute("width", "150"); track.setAttribute("height", "16");
      track.setAttribute("class", "chart__track");
      strategySvg.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", "128"); bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(1, (counts[strategy.id] / 6) * 150)));
      bar.setAttribute("height", "16");
      bar.setAttribute("class", strategy.id === "gap" ? "bar--gap" : "chart__bar");
      strategySvg.appendChild(bar);

      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", "124"); name.setAttribute("y", String(y + 12));
      name.setAttribute("text-anchor", "end");
      name.setAttribute("class", "chart__label");
      name.textContent = strategy.column;
      strategySvg.appendChild(name);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(128 + Math.max(1, (counts[strategy.id] / 6) * 150) + 5));
      value.setAttribute("y", String(y + 12));
      value.setAttribute("class", "chart__count");
      value.textContent = String(counts[strategy.id]);
      strategySvg.appendChild(value);
    });

    var sums = totals();
    strategyText.textContent =
      "Equal to both " + counts.fair + ", largest total " + counts.joint +
      ", most for your own category " + counts.ingroup + ", largest lead " +
      counts.gap + ". Running totals: " + OWN + " " + sums.own + ", " + OTHER +
      " " + sums.other + " - a gap of " + (sums.gap >= 0 ? "+" : "") + sums.gap +
      " (it started at " +
      (CONTEXTS[state.context].own - CONTEXTS[state.context].other >= 0 ? "+" : "") +
      (CONTEXTS[state.context].own - CONTEXTS[state.context].other) + ").";
  }

  function renderOutcome() {
    clear(outcome);
    if (state.choices.length < ITEMS.length) { return; }
    var counts = tally();
    var sums = totals();
    var context = CONTEXTS[state.context];
    var startGap = context.own - context.other;

    var box = make("div", "verdict");
    box.setAttribute("data-tone", counts.gap > 0 ? "warn" : "neutral");
    box.appendChild(make("h5", "verdict__title",
      "Six allocations, " + CONTEXTS[state.context].label.toLowerCase()));

    if (counts.gap > 0) {
      box.appendChild(make("p", "verdict__body",
        "You chose the largest-lead option " + counts.gap + " time" +
        (counts.gap === 1 ? "" : "s") + ". In each of those the " +
        OWN.slice(0, -1) + " received fewer points than the \"most for your own " +
        "category\" option would have given - so whatever was being pursued, it " +
        "was not gain. That is the observation the paradigm exists to make."));
    } else if (counts.ingroup > 0) {
      box.appendChild(make("p", "verdict__body",
        "You favoured your own category " + counts.ingroup + " time" +
        (counts.ingroup === 1 ? "" : "s") + " but never at a cost to it. That " +
        "is consistent with wanting your side to do well and not with wanting " +
        "it to be further ahead - which are the two things the largest-lead " +
        "option is designed to separate."));
    } else {
      box.appendChild(make("p", "verdict__body",
        "You never favoured your own category. That is a perfectly ordinary " +
        "outcome and, in the real literature, fairness is the single most-used " +
        "strategy too. The finding was never that people are unfair; it was " +
        "that a pull away from fairness appears reliably when categorisation is " +
        "the only thing in the situation."));
    }

    box.appendChild(make("p", "verdict__body",
      "The gap between the categories moved from " +
      (startGap >= 0 ? "+" : "") + startGap + " to " +
      (sums.gap >= 0 ? "+" : "") + sums.gap + "."));

    if (state.context === "ahead") {
      box.appendChild(make("p", "verdict__note",
        "In this condition your category already held four times as much. Any " +
        "allocation other than the largest-total or the other category's " +
        "favour leaves that intact. No measure of allocation strategy " +
        "distinguishes creating an inequality from maintaining one."));
    } else if (state.context === "behind") {
      box.appendChild(make("p", "verdict__note",
        "In this condition your category held a quarter of what the other did. " +
        "Favouring your own category here narrows a gap rather than opening " +
        "one - the same point-scoring, a different act. Ask whether your " +
        "reasoning changed, and whether it should have."));
    } else {
      box.appendChild(make("p", "verdict__note",
        "Both categories started level, so any lead here is one you created. " +
        "Run the other two conditions and see whether you do the same thing " +
        "when the starting positions are not level."));
    }
    outcome.appendChild(box);
  }

  function recordCompleted() {
    var counts = tally();
    var sums = totals();
    state.completed[state.context] = {
      counts: counts,
      gap: sums.gap,
      startGap: CONTEXTS[state.context].own - CONTEXTS[state.context].other
    };
  }

  function renderComparison() {
    var ids = Object.keys(state.completed);
    if (!ids.length) { comparison.hidden = true; return; }
    comparison.hidden = false;
    clear(comparisonBody);
    ["equal", "ahead", "behind"].forEach(function (id) {
      var record = state.completed[id];
      if (!record) { return; }
      var row = make("tr");
      var th = make("th", null, CONTEXTS[id].label);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      STRATEGIES.forEach(function (strategy) {
        row.appendChild(make("td", null, String(record.counts[strategy.id])));
      });
      row.appendChild(make("td", null,
        (record.startGap >= 0 ? "+" : "") + record.startGap + " to " +
        (record.gap >= 0 ? "+" : "") + record.gap));
      comparisonBody.appendChild(row);
    });

    clear(comparisonNote);
    comparisonNote.setAttribute("data-tone", ids.length >= 2 ? "warn" : "neutral");
    if (ids.length < 2) {
      comparisonNote.appendChild(make("p", "verdict__body",
        "One condition completed. Change the starting position above and make " +
        "the same six allocations again - the comparison is the part of this " +
        "laboratory that the classic paradigm does not contain."));
      return;
    }
    comparisonNote.appendChild(make("h5", "verdict__title",
      "The same choice, three different acts"));
    comparisonNote.appendChild(make("p", "verdict__body",
      "The point-scoring of each option is identical in all three conditions. " +
      "What changes is what a given choice does: where both categories start " +
      "level, a lead is created; where your category already holds four times " +
      "as much, the same choice widens an existing gap; where it holds a " +
      "quarter, favouring your own side narrows one."));
    comparisonNote.appendChild(make("p", "verdict__body",
      "Notice that the strategy profile cannot tell those apart. A study " +
      "reporting only the allocation strategies of its participants would " +
      "report the same thing in all three worlds - which is a reason to be " +
      "careful about lifting the finding out of the laboratory, and not a " +
      "reason to doubt it inside one."));
    comparisonNote.appendChild(make("p", "verdict__note",
      "The starting positions here are stipulated. Being told your category " +
      "holds 400 points is not the same as belonging to an advantaged group, " +
      "which involves knowing why, for how long, and at whose expense."));
  }

  function renderGoal() {
    var done = Object.keys(state.completed).length;
    clear(goalText);
    var list = make("ul", "goal__checks");
    [
      { label: "Be sorted", detail: state.sorted ? "you are a " + OWN.slice(0, -1) : "not yet", met: state.sorted },
      { label: "Complete six allocations", detail: state.choices.length + " of 6", met: state.choices.length === 6 },
      { label: "Run a second starting position", detail: done + " of 3 conditions", met: done >= 2 }
    ].forEach(function (check) {
      var item = make("li");
      item.textContent = check.label + " - " + check.detail +
        (check.met ? " (met)" : " (not yet)");
      item.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(item);
    });
    goalText.appendChild(list);
  }

  function render() {
    sortBlock.hidden = state.sorted;
    contextBlock.hidden = !state.sorted;
    itemBlock.hidden = !state.sorted || state.choices.length >= ITEMS.length;
    if (!itemBlock.hidden) {
      itemLegend.textContent = "Allocation " + (state.item + 1) + " of " + ITEMS.length;
      buildOptions();
    }
    contextSelect.value = state.context;
    renderProfile();
    renderOutcome();
    renderComparison();
    renderGoal();
  }

  $('[data-action="submit-choice"]').addEventListener("click", function () {
    if (!state.pick) {
      itemNote.textContent = "Choose one of the four allocations first.";
      shell.announce(itemNote.textContent, { immediate: true });
      return;
    }
    state.choices.push(state.pick);
    state.pick = null;
    state.item += 1;
    itemNote.textContent = "";
    if (state.choices.length >= ITEMS.length) { recordCompleted(); }
    render();
    shell.announce(
      state.choices.length >= ITEMS.length
        ? "Six allocations complete. The summary is beside you."
        : "Recorded. Allocation " + (state.item + 1) + " of " + ITEMS.length + ".",
      { immediate: true });
  });

  contextSelect.addEventListener("change", function () {
    state.context = contextSelect.value;
    state.choices = [];
    state.item = 0;
    state.pick = null;
    itemNote.textContent = "";
    render();
    shell.announce(
      CONTEXTS[state.context].label + " loaded. " + OWN + " start with " +
      CONTEXTS[state.context].own + " points and " + OTHER + " with " +
      CONTEXTS[state.context].other + ". The six allocations are the same ones.",
      { immediate: true });
  });

  /* --- Challenge ------------------------------------------------------------ */

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

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
        "A blank is not a verdict.");
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
      " The first claim is the one the paradigm supports, and it is much " +
      "narrower than the other four."));
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
    shell.announce("Five claims judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    fair: {
      tone: "good",
      verdict: "The most common single strategy, in the literature and probably here.",
      text:
        "Fairness is not defeated by these studies and never was. What they " +
        "report is a reliable pull away from it, appearing when categorisation " +
        "is the only thing in the situation."
    },
    joint: {
      tone: "caution",
      verdict: "Less often than you would expect.",
      text:
        "The points cost the allocator nothing, so maximising the total ought " +
        "to be the obvious move. It is used, and it is used less than fairness " +
        "and less than the options that create a difference."
    },
    ingroup: {
      tone: "caution",
      verdict: "Close, and it misses the finding.",
      text:
        "If people simply wanted their own category to do well, this would be " +
        "the answer and the paradigm would be unremarkable. Watch for the " +
        "option that gives your own category fewer points than this one does."
    },
    difference: {
      tone: "good",
      verdict: "That is the finding, and it is the strange one.",
      text:
        "A reliable minority takes less for their own side in order to be " +
        "further ahead of the other. Nobody gains: the allocator cannot " +
        "allocate to themselves, the points buy nothing, and nobody will ever " +
        "know who chose what."
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
    shell.announce("Laboratory open. Answer the sorting question to begin.",
      { immediate: true });
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

  /* --- Worked example ---------------------------------------------------------- */

  $('[data-action="worked"]').addEventListener("click", function () {
    /* A plausible profile: mostly fair, twice the largest lead. Run in the
       equal and the already-ahead conditions so the comparison table opens. */
    state.sorted = true;
    var pattern = ["fair", "gap", "fair", "ingroup", "gap", "fair"];
    ["equal", "ahead"].forEach(function (context) {
      state.context = context;
      state.choices = pattern.slice();
      state.item = ITEMS.length;
      recordCompleted();
    });
    state.context = "ahead";
    render();
    shell.announce(
      "Worked example: the same profile - four fair or own-group allocations " +
      "and two largest-lead ones - run in the equal condition and in the " +
      "already-ahead condition. Compare the last column.",
      { immediate: true });
  });

  /* --- Reset and start-up -------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    comparison.hidden = true;
    itemNote.textContent = "";
    claimsForm.reset();
    claimsFeedback.hidden = true;
    $$('input[name="sorting"]').forEach(function (input) { input.checked = false; });
    render();
  });

  buildSort();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the laboratory.",
    { immediate: true });
})();
