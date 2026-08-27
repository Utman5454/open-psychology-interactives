/* =========================================================================
   Activity template — wiring
   -------------------------------------------------------------------------
   Neutral scaffolding, not a psychology activity. It exists to show what a
   Simplified Edition activity script normally does, and to prove the shell
   works end to end: progress, choice states, reveal, announcement, reset and
   a synthesis that cannot be read ahead.

   Replace the `steps` array and the two reveal strings; the rest is the
   pattern. If the activity is not a set of choices — a demonstration, a
   simulation, a cumulative reveal — keep the shape of this file and swap out
   `renderStep` and `choose` entirely. Nothing in workbook.js requires
   choices, or steps, or three of anything.

   Same conservative syntax as the rest of the collection: `var`, no arrow
   functions, no template literals, no build step.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  /* Content. One entry per step. `answer` names the option key that the
     material supports; there is nothing special about which one it is, and
     it deliberately moves between steps here so that nobody copies a fixed
     position by accident. */
  var steps = [
    {
      label: "Step 1",
      heading: "[The one question this step asks]",
      stimulus: "[The material for step one.]",
      answer: "b",
      options: [
        ["a", "[Option A]", "[One line saying what this option claims.]"],
        ["b", "[Option B]", "[One line saying what this option claims.]"],
        ["c", "[Option C]", "[One line saying what this option claims.]"]
      ],
      supported: "[What the material does support, in one sentence.]",
      limit: "[What it still does not support, in one sentence.]"
    },
    {
      label: "Step 2",
      heading: "[The one question this step asks]",
      stimulus: "[The material for step two. Something has changed.]",
      answer: "c",
      options: [
        ["a", "[Option A]", "[One line saying what this option claims.]"],
        ["b", "[Option B]", "[One line saying what this option claims.]"],
        ["c", "[Option C]", "[One line saying what this option claims.]"]
      ],
      supported: "[What the material now supports.]",
      limit: "[What it still does not support.]"
    },
    {
      label: "Step 3",
      heading: "[The one question this step asks]",
      stimulus: "[The material for step three.]",
      answer: "a",
      options: [
        ["a", "[Option A]", "[One line saying what this option claims.]"],
        ["b", "[Option B]", "[One line saying what this option claims.]"],
        ["c", "[Option C]", "[One line saying what this option claims.]"]
      ],
      supported: "[What the material now supports.]",
      limit: "[What it still does not support.]"
    }
  ];

  var stepLabel = document.getElementById("step-label");
  var heading = document.getElementById("activity-heading");
  var stimulus = document.getElementById("stimulus");
  var optionGrid = document.getElementById("options");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");

  var index = 0;
  var answered = false;

  /* --- Rendering ------------------------------------------------------- */

  function renderStep() {
    var step = steps[index];
    var last = index === steps.length - 1;

    answered = false;

    stepLabel.textContent = step.label;
    heading.textContent = step.heading;
    stimulus.textContent = step.stimulus;

    optionGrid.textContent = "";

    step.options.forEach(function (option) {
      optionGrid.appendChild(buildOption(option[0], option[1], option[2]));
    });

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = last ? "See how the steps compare" : "Next step";

    wb.progress.set(index);
  }

  /**
   * One choice. `data-choice` is what workbook.js's lock() looks for; the
   * key it carries is the activity's own business.
   */
  function buildOption(key, title, detail) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.setAttribute("data-choice", key);

    var strong = document.createElement("strong");
    strong.textContent = title;

    var span = document.createElement("span");
    span.textContent = detail;

    button.appendChild(strong);
    button.appendChild(span);

    button.addEventListener("click", function () {
      choose(key);
    });

    return button;
  }

  /* --- Answering -------------------------------------------------------
     Note what happens to the options: every one is locked with
     aria-disabled rather than `disabled`, so the learner can still tab back
     through them and re-read why one fitted the material better. The
     correct one and the one that was given are both marked, so the feedback
     is legible without having to remember what was pressed. */

  function choose(key) {
    if (answered) {
      return;
    }
    answered = true;

    var step = steps[index];
    var correct = key === step.answer;

    wb.choices.lock(optionGrid);

    var buttons = optionGrid.querySelectorAll("[data-choice]");

    Array.prototype.forEach.call(buttons, function (button) {
      var thisKey = button.getAttribute("data-choice");

      if (thisKey === step.answer) {
        wb.choices.mark(button, "correct");
      } else if (thisKey === key) {
        wb.choices.mark(button, "incorrect");
      }
    });

    showReveal(correct, step);

    nextButton.disabled = false;

    /* One short sentence, not a repeat of the reveal. The reveal is on
       screen; the live region is for people who would not otherwise know
       anything had changed. */
    wb.announce(
      correct
        ? "That reading stays within the material. Feedback below."
        : "Another reading fits the material better. Feedback below."
    );
  }

  /**
   * The paired reveal: what the material supports, and what it does not.
   * This pairing is the move the golden references use more than any other,
   * and it is what stops feedback collapsing into right-or-wrong.
   */
  function showReveal(correct, step) {
    reveal.textContent = "";

    var verdict = document.createElement("p");
    var verdictText = document.createElement("strong");
    verdictText.textContent = correct
      ? "[Verdict when the reading is supported.]"
      : "[Verdict when the reading goes further than the material.]";
    verdict.appendChild(verdictText);

    var grid = document.createElement("div");
    grid.className = "reveal-grid";
    grid.appendChild(buildMini("What this supports", step.supported, false));
    grid.appendChild(buildMini("What it still does not show", step.limit, true));

    reveal.appendChild(verdict);
    reveal.appendChild(grid);

    wb.show(reveal);
  }

  function buildMini(title, body, isLimit) {
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
    if (index < steps.length - 1) {
      index += 1;
      renderStep();
      wb.scrollTo("#activity-card");
      return;
    }

    wb.progress.markAllDone();
    wb.show("#synthesis");
    /* focus: true takes a keyboard or screen-reader user into the section
       that has just appeared, rather than leaving them on a button whose
       label no longer describes anything. */
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All three steps done. The comparison is now below.");
  });

  /* --- Reset -----------------------------------------------------------
     Reset must restore the whole initial state, including anything the
     learner has already been shown. The synthesis goes back to hidden. */

  wb.onReset(function () {
    index = 0;
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    renderStep();
  });

  renderStep();
})();
