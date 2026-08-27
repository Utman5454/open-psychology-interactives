/* =========================================================================
   Theme or Topic? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/06-theme-or-topic-challenge/

   TEACHING JOB
   ------------
   A theme is an analytic claim organised around one central concept. It is
   not a subject heading and it is not a true descriptive sentence.

   WHAT IS PRESERVED
   -----------------
   The four-way sort with a written note on every candidate, and the specific
   failure each one demonstrates:

       topic      names the subject matter; a reader learns what the extracts
                  are ABOUT and nothing about what was found
       staging    a true, supported, descriptive sentence, and a legitimate
                  stage in an analysis rather than a theme
       theme      an analytic claim organised around one central concept
       overreach  a statement the data cannot carry, for a stated reason

   The candidates are presented ONE AT A TIME with the four categories in a
   fixed order, so the position of the answer varies across the four rounds
   rather than being learnable, and no candidate can be solved by elimination
   against the others.

   WHAT WAS REDUCED
   ----------------
   Three clusters to one, and the rewrite challenge is gone: turning a staging
   post into a theme is a second and harder teaching job that deserves its own
   space rather than a box at the end of this one.

   Four categories is a teaching simplification, as in the original: real
   candidates sit on a continuum and several could be argued into a
   neighbouring category. The page says so.

   The extracts are invented. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var CATEGORIES = [
    ["topic", "Topic summary", "Names the subject matter and nothing more"],
    ["staging", "A staging post", "True and supported, and it explains nothing"],
    ["theme", "A developed theme", "One organising concept the extracts illustrate"],
    ["overreach", "Beyond what these data carry", "Asserts something the design cannot deliver"]
  ];

  var CLUSTER = {
    codes: "Codes in this cluster: asking as self-exposure; comparing self " +
      "with others; deciding not to ask; a cost paid only by the first person " +
      "to ask; silence maintained collectively.",
    quotes: [
      "Ama: “you'd be the one putting your hand up saying I'm the one who hasn't”",
      "Lena: “afterwards two people said they'd wanted to ask the same thing. It's just the first one that costs something”"
    ]
  };

  /* Presented in this order: the sort is not solvable by elimination, because
     each candidate is judged before the next is seen. */
  var CANDIDATES = [
    {
      text: "Students feel anxious about asking questions in seminars",
      answer: "staging",
      note: "True, supported, and the one most people call a theme. Ask what it explains. It reports a shared feeling without saying what produces it, or why Lena's experience of asking was fine. No single concept is holding the extracts together, only a common mood."
    },
    {
      text: "Asking for help",
      answer: "topic",
      note: "A subject heading. It tells a reader what these extracts are about and nothing about what was found in them. Every extract in the whole dataset would fit under it, which is the giveaway: a label that nothing can fail to belong to is not organising anything."
    },
    {
      text: "Seminar silence is caused by student anxiety",
      answer: "overreach",
      note: "Two problems. First, it asserts a cause, and interview accounts given afterwards cannot establish what produced a silence. Second, the data contradict it: Lena reports two people who wanted to ask and did not, and gives no indication that either was anxious."
    },
    {
      text: "Visibility is the price: the first question turns a private gap in understanding into a public one, and it is paid by whoever speaks first",
      answer: "theme",
      note: "A developed theme. One organising concept, visibility, explains Ama's decision not to ask, Lena's description of the first question as the expensive one, and the two silent students. It makes a claim you could disagree with, and it says nothing about anxiety, so it survives the fact that Lena was not anxious."
    }
  ];

  var stepLabel = document.getElementById("step-label");
  var candidateEl = document.getElementById("candidate");
  var optionGrid = document.getElementById("options");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");
  var resultLead = document.getElementById("result-lead");

  document.getElementById("codes").textContent = CLUSTER.codes;
  document.getElementById("quote-a").textContent = CLUSTER.quotes[0];
  document.getElementById("quote-b").textContent = CLUSTER.quotes[1];

  var at = 0;
  var answered = false;
  var right = 0;

  function render() {
    var candidate = CANDIDATES[at];
    answered = false;
    stepLabel.textContent = "Candidate " + (at + 1) + " of " + CANDIDATES.length;
    candidateEl.textContent = candidate.text;

    optionGrid.textContent = "";
    CATEGORIES.forEach(function (category) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", category[0]);
      var strong = document.createElement("strong");
      strong.textContent = category[1];
      var span = document.createElement("span");
      span.textContent = category[2];
      button.appendChild(strong);
      button.appendChild(span);
      button.addEventListener("click", function () { choose(category[0]); });
      optionGrid.appendChild(button);
    });

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = at === CANDIDATES.length - 1
      ? "See the four together" : "Next candidate";
    wb.progress.set(at);
  }

  function choose(key) {
    if (answered) { return; }
    answered = true;
    var candidate = CANDIDATES[at];
    var correct = key === candidate.answer;
    if (correct) { right += 1; }

    wb.choices.lock(optionGrid);
    Array.prototype.forEach.call(optionGrid.children, function (button) {
      var k = button.getAttribute("data-choice");
      if (k === candidate.answer) {
        wb.choices.mark(button, "correct", {
          note: "This is what it is." + (correct ? " This is the one you chose." : "")
        });
      } else if (k === key) {
        wb.choices.mark(button, "incorrect", { note: "This is the one you chose." });
      }
    });

    var name = "";
    CATEGORIES.forEach(function (c) { if (c[0] === candidate.answer) { name = c[1].toLowerCase(); } });

    reveal.textContent = "";
    var line = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = correct ? "Yes: " + name + "." : "This one is " + name + ".";
    line.appendChild(strong);
    var why = document.createElement("p");
    why.className = "small";
    why.textContent = candidate.note;
    reveal.appendChild(line);
    reveal.appendChild(why);
    wb.show(reveal);

    nextButton.disabled = false;
    wb.announce(strong.textContent + " Feedback below.");
  }

  nextButton.addEventListener("click", function () {
    if (at < CANDIDATES.length - 1) {
      at += 1;
      render();
      wb.scrollTo("#card");
      return;
    }
    resultLead.textContent =
      "You placed " + right + " of the four. The one that reads most like a " +
      "finding, that students feel anxious about asking questions, is the one " +
      "that explains least: it reports a mood and leaves you with no account " +
      "of why these extracts belong together. The theme names a concept, " +
      "visibility, that does the explaining and can be argued with.";
    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All four placed. The comparison is now below.");
  });

  wb.onReset(function () {
    at = 0;
    right = 0;
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    render();
  });

  render();
})();
