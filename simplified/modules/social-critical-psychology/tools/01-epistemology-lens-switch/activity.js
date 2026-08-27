/**
 * The Method Comes Last  (Simplified Edition)
 *
 * Teaching job: the method follows from what you take the research object to
 * be, not the other way round, and a study can only say the kind of thing its
 * declared object is the kind of thing to be a question about.
 *
 * The mechanism from the full Epistemology Lens Switch is preserved: declare a
 * starting point, then make decisions whose options are never labelled with
 * the position they belong to, and watch what each choice commits you to and
 * where it sits in tension with what you declared.
 *
 * WHAT WAS CUT. Three of the five decisions, and the second pass in which the
 * same case is rebuilt from another starting point. The cascade from object to
 * method is the whole argument, and once a learner has run it the comparison
 * can be shown rather than performed: step 3 lays the three completed studies
 * side by side, which is what running it three times was for.
 *
 * OPTION ORDER IS ROTATED, AND THAT MATTERS. The original always lists options
 * in the order measure, mechanism, construct, individual, so the position that
 * matches a declared starting point is always at the same index. Over two
 * decisions that is a positional tell a learner can follow without reading.
 * Here each decision applies a fixed rotation to the option list, so a given
 * position appears at a different index in each decision, and the test suite
 * checks that no position occupies the same index throughout.
 *
 * COHERENCE IS DELIBERATELY A WEAK MODEL and the page says so: it is the count
 * of decisions whose home matches the declared position, it is the minimum a
 * design has to clear rather than a measure of quality, and being in tension
 * is never described as forbidden. The teaching is done by the prose attached
 * to each option, which is why every option carries both what it commits you
 * to and what tension it creates when taken under another position.
 *
 * THE FOURTH POSITION belongs to none of the three. It relocates the problem
 * inside a minority of pupils, and it is here because it is the design a
 * school is most likely to fund. Students should be able to name it rather
 * than merely avoid it, so it is named in step 3 rather than scored against.
 *
 * Meadowbank is invented. No real school, policy, dataset or document is
 * described, and no figure is an estimate of anything.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var LENSES = [
    {
      id: "measure",
      name: "A real pattern of behaviour",
      creed: "It is really there, it exists whether or not anyone writes it " +
        "down, and the job is to measure it as accurately as possible.",
      object: "a real, countable pattern of behaviour",
      canSay: "How often, in which lessons, and what covaries with what, each " +
        "with a stated degree of uncertainty.",
      cannotSay: "Whether the January rise reflects a change in pupils or a " +
        "change in referring. Observation starting now cannot reach back into " +
        "a record collected under a different rule.",
      wouldChange: "The conditions that predict the count: class size, " +
        "timetable position, how staff are deployed."
    },
    {
      id: "mechanism",
      name: "A real tendency behind what is recorded",
      creed: "Something real is going on that is not identical with what " +
        "anyone can observe. The events recorded are only part of what " +
        "happened, and our concepts of it are fallible.",
      object: "a real tendency produced by mechanisms that are not directly observable",
      canSay: "That a specific mechanism, under specified conditions, would " +
        "generate this pattern, with the evidence for it and the cases where " +
        "it failed to appear.",
      cannotSay: "How much of the rise each mechanism accounts for. " +
        "Retroduction shortlists candidates and rules some out; it does not " +
        "partition variance.",
      wouldChange: "The mechanism: revise the referral rule, stabilise the " +
        "rooms, support the new staff."
    },
    {
      id: "construct",
      name: "A category that gets assembled",
      creed: "Disruption is not found in the room, it is assembled in the " +
        "policy text, the referral form and the staffroom account. The job is " +
        "to study that assembling.",
      object: "a category actively assembled in talk, records and institutional practice",
      canSay: "How the category is produced here, what work it does, and what " +
        "follows institutionally from being placed in it.",
      cannotSay: "Whether behaviour is worse than last year. Not because the " +
        "question is uninteresting, but because this design has taken the " +
        "measure apart and cannot then lean on it.",
      wouldChange: "What the category does: rewrite the referral form, open up " +
        "who may contest a referral."
    }
  ];

  var FOURTH = {
    id: "individual",
    name: "A fourth position, belonging to none of the three",
    text: "One option in every decision above locates the problem inside a " +
      "minority of pupils who have not yet been identified. It is a coherent " +
      "research programme, it is the design a school is most likely to fund, " +
      "and it is entailed by none of the three starting points. Nothing in " +
      "the file points to it: the rise began with a policy revision. It is " +
      "here to be recognised and named, not to be scored badly on."
  };

  /* Two decisions. Options are authored in the order measure, mechanism,
     construct, individual, and `rotate` moves that order so the matching
     option is at a different index in each decision. */
  var DECISIONS = [
    {
      id: "question",
      label: "What question can legitimately be asked?",
      hint: "A question is legitimate here if the object you declared is the " +
        "kind of thing it could be a question about.",
      rotate: 1,
      options: [
        { home: "measure",
          text: "How much disruption is there, is it rising, and what predicts variation between lessons?",
          commits: "You have committed to a quantity that exists to be estimated, and to lessons as comparable units.",
          tension: "How much presupposes a settled unit of counting. If the object of study is how that unit gets made, this question asks you to assume your answer." },
        { home: "mechanism",
          text: "What would have to be the case for disruption to become likely here, and when does that tendency show itself?",
          commits: "You are after an explanation rather than an estimate, and you have accepted that the answer may not be visible in any single dataset.",
          tension: "It asks about something that could be true even where the records show nothing, which a design equating the real with the recorded cannot accommodate." },
        { home: "construct",
          text: "How does something come to be counted as disruption here, by whom, and what does that counting make possible?",
          commits: "The referral is now the phenomenon rather than the measurement, and by whom makes authority part of the question.",
          tension: "It brackets the question of whether behaviour changed, which is what a design aimed at a real pattern was set up to answer." },
        { home: "individual",
          text: "Which pupils are responsible, and what distinguishes them from the rest?",
          commits: "Responsibility has been made a property of persons before anything has been established about the lesson, the policy or the record.",
          tension: "It locates the problem inside pupils in advance, when the one documented change in the file is a change to the referral rule." }
      ]
    },
    {
      id: "method",
      label: "Which method follows?",
      hint: "The method is downstream. Check that it is a way of getting at " +
        "the object you declared, not simply a technique you are comfortable with.",
      rotate: 3,
      options: [
        { home: "measure",
          text: "Structured observation of a stratified sample of lessons with inter-observer agreement, then regression on lesson-level predictors.",
          commits: "You will get defensible numbers about the period you observe, and nothing at all about the period already logged.",
          tension: "Counting under a fixed schedule settles in advance the very thing your declared object treats as unsettled." },
        { home: "mechanism",
          text: "A comparative case design: the incident series alongside paired high- and low-referring departments, reasoning back to candidate mechanisms and testing each against the cases where the pattern is absent.",
          commits: "You will end with a shortlist of mechanisms and an account of what would have counted against each, rather than an effect size.",
          tension: "Retroduction infers to unobservables, which a design admitting only measured quantities cannot warrant." },
        { home: "construct",
          text: "Discourse and documentary analysis: what the policy authorises, how the referral form converts an interaction into an act by a named pupil, and how staff and pupils account for it.",
          commits: "The analysis is of how accounts are built and what they do. How often a word appears is not the finding.",
          tension: "It produces no rate, no comparison group and no estimate, so it cannot support a design whose question was quantitative." },
        { home: "individual",
          text: "Administer a screening instrument to all 900 pupils and correlate scores with logged incidents.",
          commits: "Every pupil in the school is now assessed in order to explain a change that began with a policy revision.",
          tension: "The correlation is partly built in: pupils who are referred more are, by construction, the ones the score is compared against." }
      ]
    }
  ];

  /** Options in presentation order for one decision. */
  function optionsFor(decision) {
    var out = [];
    var n = decision.options.length;
    for (var i = 0; i < n; i += 1) {
      out.push(decision.options[(i + decision.rotate) % n]);
    }
    return out;
  }

  function lensById(id) {
    var found = null;
    LENSES.forEach(function (l) { if (l.id === id) { found = l; } });
    return found;
  }

  function coherence() {
    var n = 0;
    DECISIONS.forEach(function (d) {
      if (chosen[d.id] && chosen[d.id].home === declared) { n += 1; }
    });
    return n;
  }

  function allDecided() {
    return DECISIONS.every(function (d) { return !!chosen[d.id]; });
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardBuild;
  var lensBox, decisionBox, readout, sentence, finishBtn, note, noteText;
  var cardCompare, compareBody, fourthText, explainBtn, synthesis, resultLead;

  var answered = false;
  var declared = null;
  var chosen = {};

  var VERDICTS = {
    object: { state: "correct", text:
      "Yes, and it is the decision least likely to be written down. Every " +
      "method is a way of getting at some kind of thing, so settling what " +
      "kind of thing you are dealing with has already narrowed the methods " +
      "before anyone opens a methods textbook. Build a study below and watch " +
      "the narrowing happen." },
    question: { state: "partial", text:
      "The client's question matters and it is not what decides this. The " +
      "governors asked whether behaviour is getting worse, and you will find " +
      "below that only one of the three starting points can take that " +
      "question at face value. The other two do not refuse it out of " +
      "awkwardness; they cannot ask it, because they do not take disruption " +
      "to be the kind of thing that has an amount." },
    practical: { state: "incorrect", text:
      "Feasibility rules designs out and does not choose between the ones " +
      "left. All three studies below are affordable for a school of this " +
      "size, take a term, and need the same access. What separates them is " +
      "upstream of any of that." },
    training: { state: "partial", text:
      "This is honest about how research actually gets done and it describes " +
      "a failure rather than a principle. A method chosen because it is " +
      "familiar still commits you to an object, and the commitment is made " +
      "whether or not anyone notices. The point of building a study below is " +
      "to make that commitment visible before it is made for you." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "object") {
      wb.choices.mark(options.querySelector('[data-choice="object"]'), "correct");
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
    wb.announce("Declare a starting point to begin.");
  }

  /* --------------------------------------------------------------- inputs */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function buildLenses() {
    LENSES.forEach(function (lens) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "lens");
      input.setAttribute("value", lens.id);
      input.value = lens.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, lens.name));
      wrap.appendChild(el("span", null, lens.creed));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { declare(lens.id); });
      lensBox.appendChild(label);
    });
  }

  function buildDecisions() {
    decisionBox.textContent = "";
    if (!declared) { return; }
    DECISIONS.forEach(function (decision) {
      var block = el("div", "block");
      block.appendChild(el("p", "step-label", decision.label));
      block.appendChild(el("p", "small", decision.hint));
      var grid = el("div", "option-grid");
      grid.setAttribute("style", "--option-columns: 2");
      grid.setAttribute("data-workbook-choices", "");
      optionsFor(decision).forEach(function (option) {
        var button = el("button", "option");
        button.type = "button";
        button.setAttribute("data-choice", decision.id + ":" + option.home);
        button.appendChild(el("strong", null, option.text));
        var picked = chosen[decision.id];
        if (picked === option) {
          button.setAttribute("data-state", option.home === declared ? "correct" : "partial");
          button.appendChild(el("span", null,
            (option.home === declared
              ? "Follows from what you declared. " : "In tension with what you declared. ") +
            (option.home === declared ? option.commits : option.tension)));
        } else if (picked) {
          button.appendChild(el("span", null, ""));
        } else {
          button.appendChild(el("span", null, ""));
        }
        button.addEventListener("click", function () { choose(decision.id, option); });
        grid.appendChild(button);
      });
      block.appendChild(grid);
      decisionBox.appendChild(block);
    });
  }

  function declare(id) {
    declared = id;
    chosen = {};
    Array.prototype.forEach.call(lensBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === declared;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });
    render();
    wb.announce("Starting point declared: " + lensById(declared).name +
      ". Two decisions to make.");
  }

  function choose(decisionId, option) {
    chosen[decisionId] = option;
    render();
    finishBtn.disabled = !allDecided();
    wb.announce(option.home === declared
      ? "That choice follows from what you declared."
      : "That choice is in tension with what you declared.");
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

  function render() {
    buildDecisions();
    readout.textContent = "";
    if (!declared) {
      sentence.textContent = "Nothing is declared yet, so there are no " +
        "decisions to make. That is the point: until you say what the thing " +
        "is, no method is more appropriate than any other.";
      finishBtn.disabled = true;
      return;
    }
    var lens = lensById(declared);
    var made = DECISIONS.filter(function (d) { return !!chosen[d.id]; }).length;
    /* The declared object goes in the sentence below, not in a tile. It is a
       phrase rather than a figure, and the tile's value style is large type
       sized for a number: set in it, "a category actively assembled in talk,
       records and institutional practice" ran to seven lines. */
    readout.appendChild(tile("Decisions made", made + " of " + DECISIONS.length,
      made === DECISIONS.length ? "the study is specified" : "keep going"));
    readout.appendChild(tile("Following from your starting point",
      coherence() + " of " + DECISIONS.length,
      "coherence is the minimum to clear, not a measure of quality",
      made === DECISIONS.length ? (coherence() === DECISIONS.length ? "correct" : "partial") : null));

    var preamble = "You are taking disruption to be " + lens.object +
      ", which is a decision rather than a discovery. ";
    sentence.textContent = preamble + (made === DECISIONS.length
      ? (coherence() === DECISIONS.length
        ? "Both decisions follow from what you declared. That does not make " +
          "it a good study; it makes it a study that knows what it is."
        : "At least one decision is in tension with what you declared. That " +
          "is not forbidden, and a mixed design that says how it holds the " +
          "two together can be stronger than a tidy one that never noticed.")
      : "Read what each option commits you to before choosing. None of them " +
        "is labelled with the position it belongs to.");
    finishBtn.disabled = !allDecided();
  }

  function finish() {
    wb.show(cardCompare);
    compareBody.textContent = "";
    LENSES.forEach(function (lens) {
      var tr = global.document.createElement("tr");
      [lens.name, lens.object, lens.canSay, lens.cannotSay, lens.wouldChange]
        .forEach(function (text, col) {
          var cellNode = global.document.createElement(col === 0 ? "th" : "td");
          if (col === 0) { cellNode.setAttribute("scope", "row"); }
          cellNode.textContent = text;
          tr.appendChild(cellNode);
        });
      if (lens.id === declared) { tr.setAttribute("data-state", "chosen"); }
      compareBody.appendChild(tr);
    });
    fourthText.textContent = FOURTH.text;

    var lens = lensById(declared);
    noteText.textContent =
      "Your study takes disruption to be " + lens.object + ". It could say: " +
      lens.canSay + " It could not say: " + lens.cannotSay + " And the change " +
      "it points at is not a change to pupils but to " +
      lens.wouldChange.toLowerCase();
    wb.show(note);
    wb.scrollTo(cardCompare);
    wb.announce("Study finished. The three studies are now side by side.");
  }

  function explain() {
    var lens = lensById(declared);
    resultLead.textContent =
      "You declared disruption to be " + lens.object + ", and two decisions " +
      "later you had a study that can say " +
      lens.canSay.charAt(0).toLowerCase() + lens.canSay.slice(1, -1) +
      ", and cannot answer the question the governors actually asked unless " +
      "you started from the first row of the table.";
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
    lensBox = wb.root.querySelector("#lenses");
    decisionBox = wb.root.querySelector("#decisions");
    readout = wb.root.querySelector("#readout");
    sentence = wb.root.querySelector("#sentence");
    finishBtn = wb.root.querySelector("#finish");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    cardCompare = wb.root.querySelector("#card-compare");
    compareBody = wb.root.querySelector("#compare-body");
    fourthText = wb.root.querySelector("#fourth-text");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    finishBtn.addEventListener("click", finish);
    explainBtn.addEventListener("click", explain);

    buildLenses();

    wb.onReset(function () {
      answered = false;
      declared = null;
      chosen = {};
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      Array.prototype.forEach.call(lensBox.querySelectorAll("label.toggle"), function (label) {
        label.querySelector("input").checked = false;
        label.setAttribute("data-checked", "false");
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardBuild);
      wb.hide(cardCompare);
      wb.hide(note);
      wb.hide(synthesis);
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
