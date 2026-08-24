/* =========================================================================
   Power Lens Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/social-critical-psychology/tools/10-power-lens-lukes-foucault-fricker/

   WHAT IS PRESERVED
   -----------------
   The mechanism, unchanged: one fictional case, five items that never change,
   and three passes over them in which the analytic question — not the
   evidence — is what moves. Each lens brings different items into focus,
   leaves different items in shadow, and implies a different remedy that
   leaves the other two mechanisms running. That last point is the whole
   argument, and it is what the synthesis diagram states.

   THE SAME FIVE ITEMS, IN THE SAME ORDER, EVERY ROUND
   ---------------------------------------------------
   `ITEMS` is the source order and nothing ever reorders or filters it. That
   is the mechanism made literal — the evidence is constant and only the
   question changes — and it also removes any positional tell: the strongest
   item falls at position 1, then 2, then 4 across the three lenses, and the
   option text is identical in all three rounds, so neither position nor
   length can hint at the answer.

   ONE STRONGEST ANSWER, WITH THE OVERLAP KEPT
   -------------------------------------------
   The original marks every item `core`, `partly` or `no` for each lens, and
   its notes call the overlaps the most valuable part of the activity. But
   two items marked equally correct makes the task read as ambiguous, so each
   lens here names a single strongest item and the genuine overlaps are
   explained afterwards instead of accepted as alternative answers:

     strongest  the most diagnostic single item for this lens
     also       really this lens's territory, but not the sharpest exhibit
     other      another lens owns it

   For Fricker the original marks items 4 and 5 both `core`. Item 4 is the
   strongest here because no other lens has any claim on it, while item 5 is
   shared with the second lens; the feedback says so and names item 5 as the
   second harm this lens sees. That is a defensible ranking of a reading, not
   a demotion of item 5.

   WHAT WAS REMOVED
   ----------------
   The opening four-way prediction, the per-lens sorting of all five items,
   the second per-lens question about what the lens hides, the scored
   comparison table that grew across the three stages, the four-way synthesis
   judgement, and the three-part Ferrand transfer case.

   The remedies were moved from per-lens feedback into the synthesis, where
   all three appear together. "No one remedy would have stopped the others"
   is only visible when the three are side by side.

   ON THE THEORIST NAMES
   ---------------------
   The original withholds them from the task so that matching names to
   definitions cannot substitute for the analysis. Here the name is given —
   as the golden reference does — but the analytic question is the dominant
   line in the lens header and the task is always "which item is the
   strongest evidence", never "which name goes with this description".

   Brackwell College is invented. No real institution, incident, inquiry or
   person is described. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  /* The case file. Source order, fixed. Never sorted, never filtered. */
  var ITEMS = [
    {
      key: "1",
      title: "Item 1 · The agenda",
      detail: "Deferred twice, then moved to any other business and never minuted."
    },
    {
      key: "2",
      title: "Item 2 · The definition",
      detail: "A reportable concern needs an instrument reading; Estates holds the equipment."
    },
    {
      key: "3",
      title: "Item 3 · The technicians who stopped",
      detail: "“Nothing comes of it. You learn what counts as a real problem here.”"
    },
    {
      key: "4",
      title: "Item 4 · The incident log",
      detail: "“A smell that gets into your throat” logged as “odour complaint — no action”."
    },
    {
      key: "5",
      title: "Item 5 · The missing category",
      detail: "No category for an intermittent exposure whose symptoms appear hours later."
    }
  ];

  /* One entry per lens. `weights` covers every item; `strongest` names the
     single most diagnostic one. */
  var LENSES = [
    {
      step: "Lens 1",
      name: "Lukes",
      question: "Who decides, and who never has to",
      brief: "Lukes on power: open decisions, control of the agenda, and how " +
             "people come to want less than they might have.",
      strongest: "1",
      weights: { "1": "strongest", "2": "also", "3": "also", "4": "other", "5": "other" },
      why: {
        "1": "The clearest thing in the file. Nothing was resolved and nobody " +
             "refused anything — an item was simply kept from becoming a " +
             "question anyone had to answer.",
        "2": "Defensible: a rule that keeps a class of experience out of the " +
             "record can be read as agenda-setting made permanent. But the file " +
             "does not say who wrote it or whether anyone intended this, and the " +
             "second lens explains it more directly.",
        "3": "This is the third dimension exactly — people who have learned what " +
             "counts stop asking, and the institution is spared the trouble of " +
             "refusing them. Item 1 is the sharper single exhibit only because " +
             "it is a thing that happened, on a date, that can be pointed at.",
        "4": "The downgrading of a speaker, not the management of an agenda. " +
             "The third lens owns it.",
        "5": "An absence in the vocabulary is not a decision anybody took or " +
             "avoided. The third lens names this precisely."
      },
      alsoNote: "Item 3 is squarely this lens's territory too: the third " +
             "dimension, where the grievance never forms. Item 2 can be read " +
             "this way as well, though the second lens does it better.",
      focus: "There is no decision anywhere in this file. Nobody weighed the " +
             "reports and rejected them, and something happened anyway. An item " +
             "was deferred, deferred again and unminuted, and three people " +
             "stopped reporting because they had learned what counted here.",
      backgrounds: "Everything this lens sees needs somebody who acted or " +
             "refrained from acting. The definition in the manual needs nobody: " +
             "written once, it now produces the same answer by itself, and would " +
             "keep running if every person in the file were replaced tomorrow.",
      remedy: "Make the agenda contestable."
    },
    {
      step: "Lens 2",
      name: "Foucault",
      question: "What counts as knowing",
      brief: "Foucault on power: the procedures that produce an institution's " +
             "version of the truth, and the categories that let it see.",
      strongest: "2",
      weights: { "1": "other", "2": "strongest", "3": "also", "4": "other", "5": "also" },
      why: {
        "1": "A deferral is an ordinary act by identifiable people on a " +
             "particular day. The first lens has far more purchase on it than " +
             "this one does.",
        "2": "The centrepiece. A definition settles in advance whose experience " +
             "can enter the record, and settles it permanently, without any " +
             "occasion arising. The equipment that would satisfy it sits with " +
             "the people who are not reporting. Nobody had to be dishonest at " +
             "any point.",
        "3": "Defensible and interesting. “You learn what counts as a real " +
             "problem here” describes being trained into an institution's " +
             "standard of the real, which is this lens's territory as much as " +
             "the first lens's.",
        "4": "The downgrading of a speaker is not primarily about procedure. " +
             "The third lens names it better.",
        "5": "Defensible. An absent category is a limit on what the institution " +
             "can know it has — though the third lens has a sharper name for " +
             "the harm that follows."
      },
      alsoNote: "Items 3 and 5 are within this lens's reach too: being trained " +
             "into a standard of the real, and a classification with no slot for " +
             "what happened.",
      focus: "The College has produced a body of knowledge in which there is no " +
             "problem, and it did so entirely by legitimate means. A definition " +
             "settles what can enter the record, and the equipment that would " +
             "satisfy it is held by Estates rather than by the people in the room.",
      backgrounds: "Because power is treated as dispersed and productive rather " +
             "than held, this account has trouble saying who should answer for " +
             "anything. Item 1 has names and dates attached to it, and this lens " +
             "has little use for them — which matters if anybody is to be held " +
             "to account.",
      remedy: "Change what is allowed to count as knowing."
    },
    {
      step: "Lens 3",
      name: "Fricker",
      question: "Who is believed, and what can be said",
      brief: "Fricker on epistemic injustice: whose word is downgraded because " +
             "of who they are, and what nobody has the words for at all.",
      strongest: "4",
      weights: { "1": "other", "2": "other", "3": "also", "4": "strongest", "5": "also" },
      why: {
        "1": "A deferral is a matter of agendas, not of credibility. The first " +
             "lens owns it.",
        "2": "This lens can note that the rule excludes people without " +
             "equipment, but the rule is a procedure rather than a judgement " +
             "about a speaker. The second lens explains it better.",
        "3": "Defensible and important. People who have repeatedly not been " +
             "believed stop speaking, and the silence is then read as the " +
             "absence of a problem.",
        "4": "Testimonial injustice in one line. That is a symptom report; it " +
             "was received as a complaint about a smell, and the difference is " +
             "who was speaking. It is the most diagnostic item here because no " +
             "other lens has any claim on it at all.",
        "5": "The second harm this lens names, and the one people miss: there " +
             "is no category for what happened, so even a completely credible " +
             "speaker has nothing to report. Not a failure of belief at all — " +
             "and the second lens has a partial claim on it, which is why item " +
             "4 is the sharper evidence for this lens specifically."
      },
      alsoNote: "Item 5 is the second harm this lens names — hermeneutical " +
             "rather than testimonial. Item 3 is where the two feed each other: " +
             "people who are not believed stop speaking.",
      focus: "Two different things went wrong with the people who spoke, and " +
             "only one of them is about belief. “A smell that gets into your " +
             "throat” was received as an odour complaint, and the difference " +
             "is who said it. Separately, the system has no category for an " +
             "intermittent exposure with delayed symptoms, so even a trusted " +
             "speaker has nothing to report.",
      backgrounds: "Locating the wrong in an epistemic relation makes a real and " +
             "often invisible harm nameable — and points at how individuals " +
             "receive reports. A written definition needs no speaker at all. " +
             "Believe every technician in the building, and item 2 still requires " +
             "an instrument reading none of them can obtain.",
      remedy: "Change credibility and vocabulary."
    }
  ];

  var TASK = "Which item is the strongest evidence for this lens?";

  var VERDICTS = {
    strongest: "That is the strongest evidence for this lens.",
    also: "Relevant to this lens — but one item is stronger.",
    other: "Another lens owns that one."
  };

  var ANNOUNCEMENTS = {
    strongest: "That is the strongest evidence for this lens. Feedback below.",
    also: "Relevant to this lens, but another item is stronger. Feedback below.",
    other: "Another lens owns that item. Feedback below."
  };

  /* weight -> option state, and the sentence read out with it */
  var STATES = {
    strongest: {
      state: "correct",
      note: "This is the strongest evidence for this lens."
    },
    also: {
      state: "partial",
      note: "This item is also relevant to this lens, but it is not the strongest evidence."
    },
    other: {
      state: "incorrect",
      note: "This item belongs to another lens."
    }
  };

  var lensHead = document.getElementById("lens-head");
  var stepLabel = document.getElementById("step-label");
  var optionGrid = document.getElementById("options");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");

  var index = 0;
  var answered = false;

  /* --- Rendering ------------------------------------------------------- */

  function renderLens() {
    var lens = LENSES[index];
    var last = index === LENSES.length - 1;

    answered = false;

    stepLabel.textContent = lens.step;

    lensHead.textContent = "";
    var question = document.createElement("strong");
    question.textContent = lens.question;
    var brief = document.createElement("span");
    brief.textContent = lens.brief;
    var task = document.createElement("p");
    task.className = "lens-head__task";
    task.id = "lens-task";
    task.textContent = TASK;
    lensHead.appendChild(question);
    lensHead.appendChild(brief);
    lensHead.appendChild(task);

    /* ITEMS in source order, always. Nothing here filters or sorts. */
    optionGrid.textContent = "";
    ITEMS.forEach(function (item) {
      optionGrid.appendChild(buildOption(item));
    });

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = last ? "Compare the three lenses" : "Next lens";

    wb.progress.set(index);
  }

  function buildOption(item) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "option option--row";
    button.setAttribute("data-choice", item.key);
    button.setAttribute("aria-describedby", "lens-task");

    var title = document.createElement("strong");
    title.textContent = item.title;

    var detail = document.createElement("span");
    detail.textContent = item.detail;

    button.appendChild(title);
    button.appendChild(detail);

    button.addEventListener("click", function () {
      choose(item);
    });

    return button;
  }

  /* --- Answering -------------------------------------------------------
     Every item is marked by its weight for this lens, not only the one that
     was chosen, so the whole reading is visible at once: one strongest, the
     genuinely overlapping ones flagged as also-relevant, and the rest left
     plain unless the learner took one. */

  function choose(chosen) {
    if (answered) {
      return;
    }
    answered = true;

    var lens = LENSES[index];

    wb.choices.lock(optionGrid);

    ITEMS.forEach(function (item, position) {
      var button = optionGrid.children[position];
      var weight = lens.weights[item.key];
      var mine = item.key === chosen.key;

      /* An item this lens has no claim on is only marked when it was the one
         chosen. Marking all of them would clutter the board with crosses. */
      if (weight === "other" && !mine) {
        return;
      }

      wb.choices.mark(button, STATES[weight].state, {
        note: STATES[weight].note + (mine ? " This is the item you chose." : "")
      });
    });

    showReveal(chosen, lens);

    nextButton.disabled = false;
    wb.announce(ANNOUNCEMENTS[lens.weights[chosen.key]]);
  }

  /* --- The reveal ------------------------------------------------------
     Two boxes, always the same pair: what the lens brings into focus, and
     what it leaves in shadow. Neither is optional — a lens with no blind
     spot is being presented as the correct one, which is what this activity
     exists to avoid. The overlap note sits between them and the verdict. */

  function showReveal(chosen, lens) {
    var weight = lens.weights[chosen.key];

    reveal.textContent = "";

    var verdict = document.createElement("p");
    var verdictStrong = document.createElement("strong");
    verdictStrong.textContent = VERDICTS[weight];
    verdict.appendChild(verdictStrong);

    if (weight !== "strongest") {
      verdict.appendChild(
        document.createTextNode(
          " The strongest evidence for this lens is " +
            itemTitle(lens.strongest) +
            "."
        )
      );
    }

    var why = document.createElement("p");
    why.className = "small";
    why.textContent = lens.why[chosen.key];

    var also = document.createElement("p");
    also.className = "small";
    also.textContent = lens.alsoNote;

    var grid = document.createElement("div");
    grid.className = "reveal-grid";
    grid.appendChild(mini("What this lens brings into focus", lens.focus, false));
    grid.appendChild(mini("What it leaves in shadow", lens.backgrounds, true));

    var remedy = document.createElement("p");
    remedy.className = "small";
    remedy.appendChild(document.createTextNode("Where this lens would send you: "));
    var remedyStrong = document.createElement("strong");
    remedyStrong.textContent = lens.remedy;
    remedy.appendChild(remedyStrong);
    remedy.appendChild(
      document.createTextNode(" What that leaves running comes at the end.")
    );

    reveal.appendChild(verdict);
    reveal.appendChild(why);
    reveal.appendChild(also);
    reveal.appendChild(grid);
    reveal.appendChild(remedy);

    wb.show(reveal);
  }

  function itemTitle(key) {
    var found = "";
    ITEMS.forEach(function (item) {
      if (item.key === key) {
        found = item.title;
      }
    });
    return found;
  }

  function mini(title, body, isLimit) {
    var box = document.createElement("div");
    box.className = isLimit ? "mini mini--limit" : "mini";

    var strong = document.createElement("strong");
    strong.textContent = title;

    var paragraph = document.createElement("p");
    paragraph.textContent = body;

    box.appendChild(strong);
    box.appendChild(paragraph);
    return box;
  }

  /* --- Moving on ------------------------------------------------------- */

  nextButton.addEventListener("click", function () {
    if (index < LENSES.length - 1) {
      index += 1;
      renderLens();
      wb.scrollTo("#activity-card");
      return;
    }

    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All three lenses applied. The comparison is now below.");
  });

  wb.onReset(function () {
    index = 0;
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    renderLens();
  });

  renderLens();
})();
