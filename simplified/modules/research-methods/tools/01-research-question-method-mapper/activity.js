/* =========================================================================
   Research Question to Method Mapper — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/01-research-question-method-mapper/

   TEACHING JOB
   ------------
   A research question is a claim about what would count as an answer. Read it
   for that, and the kind of study follows.

   WHAT IS PRESERVED
   -----------------
   The three-level standing, which is the whole reason this is not a quiz:

       strong   well supported by the wording as written
       ok       defensible, and the note says what it would commit you to
       weak     hard to defend from this wording, and the note says why

   Every option carries a note whether it is chosen or not, so the feedback is
   an account of the wording rather than a verdict on the learner.

   The third question is deliberately ambiguous and is kept for that reason.
   Explanation and interpretation are both strong, and so are all three of
   qualitative, quantitative and mixed. The activity says so rather than
   picking a winner, because the choice follows from what the researcher
   thinks an answer would look like, which is a commitment the wording does
   not contain.

   No test is ever named, as in the original. The mapper stops where a test
   could sensibly be chosen.

   WHAT WAS REDUCED
   ----------------
   Six questions to three, and four parts to two. The design decision and the
   "what would you still need to know" part are each a further teaching job
   and stay in the longer version, along with the opening prediction and the
   select-all challenge.

   All questions, samples and settings are invented for teaching. Nothing is
   stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var AIMS = [
    ["description", "Description"],
    ["difference", "Difference"],
    ["association", "Association"],
    ["explanation", "Explanation"],
    ["interpretation", "Interpretation"],
    ["prediction", "Prediction"]
  ];

  var KINDS = [
    ["qualitative", "Qualitative"],
    ["quantitative", "Quantitative"],
    ["mixed", "Mixed"]
  ];

  var CASES = [
    {
      step: "Question 1",
      question: "How do first-year students describe their sense of belonging " +
        "during their first semester?",
      context: "Fictional study. The researcher plans to interview 15 students " +
        "twice, in week 3 and again in week 11.",
      aim: {
        strong: ["interpretation"], ok: ["description"],
        notes: {
          interpretation: "The verb is “describe” and the describing is being done by the students. An answer would be an account of how belonging is talked about and made sense of, not a quantity.",
          description: "Defensible if you read “describe” as the researcher describing a distribution. But nothing in the wording points to a quantity, and “how do students describe” puts the describing in the participants' hands.",
          difference: "There is no comparison in the wording. Week 3 against week 11 is a comparison you could build, but the question as written does not ask for it.",
          association: "Nothing is being related to anything else. Association needs two things that can vary, and only one is named.",
          explanation: "Explanation would ask what produces a sense of belonging. This question asks what it is like from the inside, which is a different job.",
          prediction: "No outcome is being forecast, and no forecasting variables are named."
        }
      },
      kind: {
        strong: ["qualitative"], ok: [],
        notes: {
          qualitative: "Yes. The material would be talk, and the analysis would work on meaning rather than on a variable.",
          quantitative: "You could build a belonging scale and report means. That would answer a different question, how much belonging rather than how it is described, and it would not be this study.",
          mixed: "Possible in principle, but a design only earns the name mixed when each strand answers a stated part of one question. Nothing here requires a numeric strand."
        }
      }
    },
    {
      step: "Question 2",
      question: "Does a 20-minute recorded mindfulness exercise reduce " +
        "self-reported exam anxiety more than a 20-minute audiobook does?",
      context: "Fictional study. Students would be allocated to one recording " +
        "or the other and complete an anxiety measure afterwards.",
      aim: {
        strong: ["difference"], ok: ["explanation"],
        notes: {
          difference: "Two conditions, one outcome, and the word “more than”. The question asks whether one group ends up lower than the other.",
          explanation: "Defensible in the loose sense that a difference between allocated conditions is evidence about what produced it. But the question asks whether there is a difference, not what mechanism carries it.",
          description: "Description would report how anxious students are. This question is about a comparison, not a level.",
          association: "Association would ask whether more mindfulness practice goes with less anxiety. Allocating people to conditions asks a stronger question than that.",
          interpretation: "Interpretation would ask what the exercise means to the students doing it. Worth asking, and not what this wording asks.",
          prediction: "Nothing is being forecast for a new individual."
        }
      },
      kind: {
        strong: ["quantitative"], ok: ["mixed"],
        notes: {
          quantitative: "Yes. An answer is a comparison of measured anxiety between two allocated groups.",
          mixed: "Defensible if you added a stated qualitative strand, for instance what students noticed while listening. It would have to answer a stated part of the question rather than be added for richness.",
          qualitative: "A qualitative study could say a great deal about the experience of both recordings. It could not answer whether one reduces a measured outcome more than the other."
        }
      }
    },
    {
      step: "Question 3",
      question: "Why do some students disengage from group work?",
      context: "Fictional study. The researcher has access to a whole cohort " +
        "and has not yet decided what an answer would look like.",
      ambiguous: true,
      aim: {
        strong: ["explanation", "interpretation"], ok: ["association"],
        notes: {
          explanation: "Defensible. On this reading an answer is a set of conditions that raise or lower the chance of disengagement, and the study measures them and models the outcome.",
          interpretation: "Equally defensible. On this reading an answer is an account of what disengaging means and does for the students who do it. This reading usually recovers reasons the first one could not have listed in advance.",
          association: "A weaker version of the explanation reading: what goes with disengagement rather than what produces it. Honest, and often all an observational design can actually deliver.",
          difference: "You would first have to define engaged and disengaged groups, which assumes an answer to part of the question.",
          prediction: "Forecasting who will disengage is a different and more modest aim than saying why.",
          description: "Description would tell you how much disengagement there is, not why."
        }
      },
      kind: {
        strong: ["qualitative", "quantitative", "mixed"], ok: [],
        notes: {
          qualitative: "Defensible: students' accounts of what happens in their groups, analysed for patterned meaning.",
          quantitative: "Defensible: measure candidate conditions across the cohort and model the outcome. It can only test reasons somebody thought of in advance.",
          mixed: "Defensible, and the only one of the three that can both test named conditions and recover unnamed ones, at the cost of doing two studies properly rather than one."
        }
      }
    }
  ];

  var PARTS = [
    {
      key: "aim",
      title: "What kind of answer does it want?",
      detail: "Read the wording, not the topic. What would an answer to this " +
        "question actually look like?",
      options: AIMS,
      columns: 3
    },
    {
      key: "kind",
      title: "What kind of study could produce that answer?",
      detail: "Given the answer you have just settled on, what sort of " +
        "material would the study have to work with?",
      options: KINDS,
      columns: 3
    }
  ];

  var VERDICT = {
    strong: "Well supported by the wording.",
    ok: "Defensible. Here is what it would commit you to.",
    weak: "Hard to defend from this wording as written."
  };

  var STATE = { strong: "correct", ok: "partial", weak: "incorrect" };

  var NOTE = {
    strong: "This reading is well supported by the wording.",
    ok: "This reading is defensible.",
    weak: "This reading is hard to defend from this wording."
  };

  var stepLabel = document.getElementById("step-label");
  var questionEl = document.getElementById("question");
  var contextEl = document.getElementById("context");
  var partTitle = document.getElementById("part-title");
  var partDetail = document.getElementById("part-detail");
  var optionGrid = document.getElementById("options");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");

  var caseIndex = 0;
  var partIndex = 0;
  var answered = false;

  function standing(part, key) {
    if (part.strong.indexOf(key) !== -1) { return "strong"; }
    if (part.ok.indexOf(key) !== -1) { return "ok"; }
    return "weak";
  }

  function render() {
    var current = CASES[caseIndex];
    var part = PARTS[partIndex];

    answered = false;
    stepLabel.textContent = current.step;
    questionEl.textContent = current.question;
    contextEl.textContent = current.context;
    partTitle.textContent = part.title;
    partDetail.textContent = part.detail;

    optionGrid.style.setProperty("--option-columns", String(part.columns));
    optionGrid.textContent = "";

    part.options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option option--row";
      button.setAttribute("data-choice", option[0]);
      var strong = document.createElement("strong");
      strong.textContent = option[1];
      button.appendChild(strong);
      button.addEventListener("click", function () { choose(option[0]); });
      optionGrid.appendChild(button);
    });

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = last() ? "What the readings did" : "Next";
    wb.progress.set(caseIndex);
  }

  function last() {
    return caseIndex === CASES.length - 1 && partIndex === PARTS.length - 1;
  }

  function choose(key) {
    if (answered) { return; }
    answered = true;

    var current = CASES[caseIndex];
    var part = current[PARTS[partIndex].key];
    var mine = standing(part, key);

    wb.choices.lock(optionGrid);
    Array.prototype.forEach.call(optionGrid.children, function (button) {
      var k = button.getAttribute("data-choice");
      var s = standing(part, k);
      /* A weak option is only marked when it was the one taken: marking every
         defensible-but-not-best reading as an error would be exactly the
         wrong lesson. */
      if (s === "weak" && k !== key) { return; }
      wb.choices.mark(button, STATE[s], {
        note: NOTE[s] + (k === key ? " This is the one you chose." : "")
      });
    });

    showReveal(current, part, key, mine);
    nextButton.disabled = false;
    wb.announce(VERDICT[mine] + " Feedback below.");
  }

  function showReveal(current, part, key, mine) {
    reveal.textContent = "";

    var verdict = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = VERDICT[mine];
    verdict.appendChild(strong);
    reveal.appendChild(verdict);

    var why = document.createElement("p");
    why.className = "small";
    why.textContent = part.notes[key];
    reveal.appendChild(why);

    /* The other strong readings, named. On the ambiguous question this is the
       whole point: there is more than one, and the activity says so. */
    var others = part.strong.filter(function (k) { return k !== key; });
    if (others.length) {
      var also = document.createElement("p");
      also.className = "small";
      also.textContent = current.ambiguous
        ? "This question is unsettled. " +
          labelsFor(others) +
          (others.length === 1 ? " is" : " are") +
          " just as well supported, and the wording does not tell you which " +
          "reading is right. Two competent researchers can read it in " +
          "incompatible ways without either being wrong."
        : labelsFor(others) +
          (others.length === 1 ? " is" : " are") + " also well supported here.";
      reveal.appendChild(also);
    }
  }

  function labelsFor(keys) {
    var all = AIMS.concat(KINDS);
    return keys.map(function (key) {
      var found = key;
      all.forEach(function (pair) { if (pair[0] === key) { found = pair[1]; } });
      return found;
    }).join(" and ");
  }

  nextButton.addEventListener("click", function () {
    if (partIndex < PARTS.length - 1) {
      partIndex += 1;
      render();
      wb.scrollTo("#card");
      return;
    }
    if (caseIndex < CASES.length - 1) {
      caseIndex += 1;
      partIndex = 0;
      render();
      wb.scrollTo("#card");
      return;
    }
    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All three questions read. The comparison is now below.");
  });

  wb.onReset(function () {
    caseIndex = 0;
    partIndex = 0;
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    render();
  });

  render();
})();
