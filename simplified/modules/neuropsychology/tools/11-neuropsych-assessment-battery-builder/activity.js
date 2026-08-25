/* =========================================================================
   What Your Battery Cannot Say — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/neuropsychology/tools/11-neuropsych-assessment-battery-builder/

   TEACHING JOB
   ------------
   A battery is a set of choices about what not to find out, and the useful
   skill is knowing which questions your selection has left open.

   WHAT IS PRESERVED
   -----------------
   The constrained selection and the two-part verdict. The constraint is the
   mechanism: without a budget every question gets answered and there is
   nothing to learn. The second half of the verdict is the point of the whole
   activity and is given equal visual weight to the first.

   THE DESIGN
   ----------
   Eight questions the referral raises, ten tasks, and ninety minutes. The
   durations are set so that no selection fitting the budget covers every
   question: the total time needed for full coverage is well over ninety
   minutes. That is checked in the tests rather than asserted here.

   Mood, sleep and recent illness are deliberately on the question list and
   deliberately cheap to cover, because they are what gets left out and they
   are the things that could account for the referral without any progressive
   condition.

   WHAT WAS REDUCED
   ----------------
   Two further referrals with different questions, seven more task types, and
   the battery-against-battery comparison.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  /* Eighty minutes, and the durations below are set so that FULL coverage
     needs ninety. The constraint has to bite or there is nothing to learn:
     an earlier draft allowed every question to be covered in 59 of 90
     minutes, which made the whole premise false and left the "cannot" panel
     empty. This is checked exhaustively in the tests. */
  var BUDGET = 80;

  var QUESTIONS = [
    { key: "memory", label: "Is new learning impaired?" },
    { key: "executive", label: "Is planning and organisation impaired?" },
    { key: "language", label: "Is language impaired?" },
    { key: "visuospatial", label: "Is visuospatial ability impaired?" },
    { key: "premorbid", label: "How does this compare with how he used to be?" },
    { key: "mood", label: "Is depression or anxiety contributing?" },
    { key: "effort", label: "Was he engaged and trying throughout?" },
    { key: "reversible", label: "Could sleep or the recent illness explain it?" }
  ];

  var TASKS = [
    { key: "wordList", label: "Word list learning and delayed recall", minutes: 30,
      covers: ["memory"] },
    { key: "storyRecall", label: "Story recall, immediate and delayed", minutes: 28,
      covers: ["memory", "language"] },
    { key: "towers", label: "Planning task", minutes: 20, covers: ["executive"] },
    { key: "fluency", label: "Verbal fluency", minutes: 10, covers: ["executive", "language"] },
    { key: "naming", label: "Naming test", minutes: 12, covers: ["language"] },
    { key: "copy", label: "Complex figure copy", minutes: 18, covers: ["visuospatial", "executive"] },
    { key: "reading", label: "Word reading estimate of prior ability", minutes: 8,
      covers: ["premorbid"] },
    { key: "moodScale", label: "Mood and anxiety questionnaire", minutes: 10, covers: ["mood"] },
    { key: "effortCheck", label: "Embedded performance validity check", minutes: 6,
      covers: ["effort"] },
    { key: "interview", label: "Interview on sleep, illness and medication", minutes: 20,
      covers: ["reversible"] }
  ];

  var taskBox = document.getElementById("tasks");
  var budgetBox = document.getElementById("budget");
  var reportButton = document.getElementById("report");
  var resultLead = document.getElementById("result-lead");
  var canList = document.getElementById("can-list");
  var cannotList = document.getElementById("cannot-list");

  var chosen = {};

  function chosenTasks() {
    return TASKS.filter(function (t) { return chosen[t.key]; });
  }
  function minutesUsed() {
    return chosenTasks().reduce(function (a, t) { return a + t.minutes; }, 0);
  }
  function covered() {
    var set = {};
    chosenTasks().forEach(function (t) {
      t.covers.forEach(function (q) { set[q] = true; });
    });
    return set;
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildTasks() {
    taskBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = "Available tasks";
    taskBox.appendChild(legend);
    TASKS.forEach(function (t) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", chosen[t.key] ? "true" : "false");
      label.setAttribute("data-key", t.key);
      var input = document.createElement("input");
      input.type = "checkbox";
      input.id = "task-" + t.key;
      input.checked = !!chosen[t.key];
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = t.label;
      var sub = document.createElement("span");
      sub.textContent = t.minutes + " minutes. Speaks to: " +
        t.covers.map(function (q) { return shortName(q); }).join(", ") + ".";
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () {
        if (input.checked && minutesUsed() + t.minutes > BUDGET) {
          input.checked = false;
          wb.announce("That would take you over " + BUDGET + " minutes. Remove " +
            "something else first.");
          refresh(false);
          return;
        }
        chosen[t.key] = input.checked;
        label.setAttribute("data-checked", input.checked ? "true" : "false");
        refresh(true);
      });
      taskBox.appendChild(label);
    });
  }

  function shortName(key) {
    return {
      memory: "new learning", executive: "planning", language: "language",
      visuospatial: "visuospatial", premorbid: "prior ability",
      mood: "mood", effort: "engagement", reversible: "sleep and illness"
    }[key];
  }

  function refresh(announce) {
    var used = minutesUsed();
    var cov = covered();
    var count = QUESTIONS.filter(function (q) { return cov[q.key]; }).length;
    budgetBox.textContent = "";
    tile(budgetBox, "Time used", used + " of " + BUDGET + " minutes",
      used === 0 ? "nothing chosen yet"
        : (BUDGET - used) + " minutes left",
      used > BUDGET ? "incorrect" : null);
    tile(budgetBox, "Questions covered", count + " of " + QUESTIONS.length,
      count === QUESTIONS.length ? "all of them"
        : (QUESTIONS.length - count) + " left open",
      count === QUESTIONS.length ? "correct" : null);
    reportButton.disabled = chosenTasks().length === 0;
    if (announce) {
      wb.announce(used + " minutes used, " + count + " of " +
        QUESTIONS.length + " questions covered.");
    }
  }

  function tile(target, caption, figure, note, state) {
    var item = document.createElement("li");
    item.className = "result";
    if (state) { item.setAttribute("data-state", state); }
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    target.appendChild(item);
  }

  /* --- The report -------------------------------------------------------- */

  reportButton.addEventListener("click", function () {
    var cov = covered();
    var can = QUESTIONS.filter(function (q) { return cov[q.key]; });
    var cannot = QUESTIONS.filter(function (q) { return !cov[q.key]; });

    canList.textContent = "";
    can.forEach(function (q) {
      var li = document.createElement("li");
      li.textContent = q.label;
      canList.appendChild(li);
    });
    if (!can.length) {
      var none = document.createElement("li");
      none.textContent = "Nothing. No task was selected that speaks to any of them.";
      canList.appendChild(none);
    }

    cannotList.textContent = "";
    cannot.forEach(function (q) {
      var li = document.createElement("li");
      li.textContent = q.label;
      cannotList.appendChild(li);
    });
    if (!cannot.length) {
      /* Unreachable inside the budget by construction, but a battery builder
         that silently printed an empty panel would be worse than one that
         says so. */
      var all = document.createElement("li");
      all.textContent = "Nothing was left open.";
      cannotList.appendChild(all);
    }

    var missedReversible = cannot.some(function (q) {
      return q.key === "reversible" || q.key === "mood";
    });
    var missedEffort = cannot.some(function (q) { return q.key === "effort"; });

    resultLead.textContent =
      "You used " + minutesUsed() + " of the " + BUDGET + " minutes on " +
      chosenTasks().length + (chosenTasks().length === 1 ? " task" : " tasks") +
      ", covering " + can.length + " of the " + QUESTIONS.length +
      " questions the referral raises. " +
      (missedReversible
        ? "You did not cover sleep, illness or mood. Those are the things that " +
          "could account for this whole picture without any progressive " +
          "condition being present, so leaving them out does not leave a small " +
          "gap: it leaves the alternative explanation untested."
        : "You covered mood and the reversible causes, which is the part most " +
          "often squeezed out when the clock is tight.") +
      (missedEffort
        ? " You also have no check on whether he was engaged, and he came " +
          "because his daughter insisted."
        : "");

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Report written. " + can.length + " questions covered, " +
      cannot.length + " left open.");
  });

  function doReset() {
    chosen = {};
    buildTasks();
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
