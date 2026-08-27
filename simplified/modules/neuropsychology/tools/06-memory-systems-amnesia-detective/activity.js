/* =========================================================================
   What Each Profile Can Decide — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/06-memory-systems-amnesia-detective/

   TEACHING JOB
   ------------
   A case speaks to a claim only when it shows one thing preserved and another
   lost. A case in which everything is impaired decides nothing, however
   severe.

   WHAT IS PRESERVED
   -----------------
   The judgement grid, which is the inferential mechanism rather than a quiz:
   for each claim and each profile the learner says whether the profile
   supports it, counts against it, or cannot decide it. The third option is
   the one the activity exists for, and it is not a hedge.

   THE PROFILES AND WHY EACH ONE IS HERE
   -------------------------------------
       A  new facts lost, skill learning preserved   a dissociation
       B  new facts preserved, skill learning lost   the opposite one
       C  both lost                                   decides nothing

   A and B together are a double dissociation. C is included precisely because
   it is uninformative, and a learner who marks it as supporting the claim has
   made the mistake the activity is for.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var PROFILES = [
    {
      key: "A", name: "Profile A",
      body: "Cannot learn new facts at all: after a week of daily sessions " +
        "she cannot say what any of them were about. On a mirror-drawing task " +
        "her tracing improves steadily across the same week, and each day she " +
        "says she has never seen the task before.",
      facts: "lost", skill: "preserved"
    },
    {
      key: "B", name: "Profile B",
      body: "Learns and recalls new facts normally, and can describe every " +
        "session in detail. On the same mirror-drawing task there is no " +
        "improvement at all across the week.",
      facts: "preserved", skill: "lost"
    },
    {
      key: "C", name: "Profile C",
      body: "Cannot learn new facts, and shows no improvement on " +
        "mirror-drawing either. Both are severely impaired.",
      facts: "lost", skill: "lost"
    }
  ];

  var CLAIMS = [
    {
      key: "same",
      text: "Learning new facts and learning new skills are done by one and " +
        "the same system.",
      /* A claim of one shared system is contradicted by any preserved-and-lost
         pattern, and is untouched by a profile in which both are lost. */
      answer: { A: "against", B: "against", C: "cannot" },
      why: {
        A: "One thing is preserved while the other is lost. A single shared " +
          "system cannot produce that, so this profile counts against the claim.",
        B: "The same argument running the other way. Taken with Profile A this " +
          "is a double dissociation, which also rules out the reply that the " +
          "lost task was simply the harder one.",
        C: "Both are lost, which is exactly what one shared system predicts " +
          "and also exactly what two separate systems predict if both are " +
          "damaged. It fits either way, so it cannot decide between them."
      }
    },
    {
      key: "conscious",
      text: "Improving at a skill requires being able to remember having " +
        "practised it.",
      answer: { A: "against", B: "cannot", C: "cannot" },
      why: {
        A: "She improves across the week and denies ever having seen the task. " +
          "Improvement without any memory of practising is precisely what this " +
          "claim says cannot happen.",
        B: "He remembers practising and does not improve. That is consistent " +
          "with the claim being false and also with its being true but " +
          "something else being wrong, so it cannot decide it.",
        C: "Neither ability is present, so there is nothing here to test the " +
          "relationship between them."
      }
    }
  ];

  var OPTIONS = [
    { key: "supports", label: "Supports it" },
    { key: "against", label: "Counts against it" },
    { key: "cannot", label: "Cannot decide it" }
  ];

  var profilesBox = document.getElementById("profiles");
  var claimsBox = document.getElementById("claims");
  var progressLine = document.getElementById("progress-line");
  var resultLead = document.getElementById("result-lead");

  var answers = {};
  var TOTAL = CLAIMS.length * PROFILES.length;

  function cellId(claim, profile) { return claim + "-" + profile; }

  function buildProfiles() {
    profilesBox.textContent = "";
    var grid = document.createElement("div");
    grid.className = "reveal-grid";
    grid.setAttribute("style", "--reveal-columns: 3");
    PROFILES.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "mini";
      var head = document.createElement("strong");
      head.textContent = p.name;
      card.appendChild(head);
      var body = document.createElement("p");
      body.className = "small";
      body.textContent = p.body;
      card.appendChild(body);
      var summary = document.createElement("p");
      summary.className = "small";
      summary.textContent = "New facts: " + p.facts + ". New skill: " + p.skill + ".";
      card.appendChild(summary);
      grid.appendChild(card);
    });
    profilesBox.appendChild(grid);
  }

  function buildClaims() {
    claimsBox.textContent = "";
    answers = {};
    CLAIMS.forEach(function (claim, ci) {
      var block = document.createElement("section");
      block.className = "block";
      block.setAttribute("data-claim", claim.key);

      var head = document.createElement("p");
      head.className = "lead";
      head.textContent = "Claim " + (ci + 1) + ": " + claim.text;
      block.appendChild(head);

      PROFILES.forEach(function (p) {
        var row = document.createElement("div");
        row.setAttribute("data-row", cellId(claim.key, p.key));

        var label = document.createElement("p");
        label.className = "small";
        label.textContent = p.name + " (new facts " + p.facts +
          ", new skill " + p.skill + "):";
        row.appendChild(label);

        var box = document.createElement("fieldset");
        box.className = "option-grid";
        box.setAttribute("style", "--option-columns: 3");
        box.setAttribute("data-options", cellId(claim.key, p.key));
        var legend = document.createElement("legend");
        legend.className = "visually-hidden";
        legend.textContent = p.name + " and claim " + (ci + 1);
        box.appendChild(legend);

        OPTIONS.forEach(function (opt) {
          var button = document.createElement("button");
          button.type = "button";
          button.className = "option";
          button.setAttribute("data-choice", "");
          button.setAttribute("data-key", opt.key);
          button.textContent = opt.label;
          button.addEventListener("click", function () {
            if (button.getAttribute("aria-disabled") === "true") { return; }
            judge(claim, p, opt.key, box, why);
          });
          box.appendChild(button);
        });
        row.appendChild(box);

        var why = document.createElement("p");
        why.className = "small";
        why.setAttribute("data-why", cellId(claim.key, p.key));
        why.hidden = true;
        row.appendChild(why);

        block.appendChild(row);
      });

      claimsBox.appendChild(block);
    });
    updateProgress();
  }

  function judge(claim, profile, key, box, why) {
    var id = cellId(claim.key, profile.key);
    var correct = claim.answer[profile.key];
    answers[id] = key;
    Array.prototype.forEach.call(box.querySelectorAll("[data-choice]"), function (node) {
      var k = node.getAttribute("data-key");
      wb.choices.mark(node, k === correct ? "correct" : (k === key ? "incorrect" : null));
    });
    wb.choices.lock(box);
    why.textContent = (key === correct ? "Yes. " :
      "The answer is " + OPTIONS.filter(function (o) { return o.key === correct; })[0]
        .label.toLowerCase() + ". ") + claim.why[profile.key];
    why.hidden = false;
    updateProgress();
    if (Object.keys(answers).length === TOTAL) { report(); }
  }

  function updateProgress() {
    var done = Object.keys(answers).length;
    progressLine.textContent = done + " of " + TOTAL + " judgements made.";
  }

  function report() {
    var right = 0, cannotRight = 0, cannotTotal = 0;
    CLAIMS.forEach(function (claim) {
      PROFILES.forEach(function (p) {
        var id = cellId(claim.key, p.key);
        var correct = claim.answer[p.key];
        if (answers[id] === correct) { right += 1; }
        if (correct === "cannot") {
          cannotTotal += 1;
          if (answers[id] === "cannot") { cannotRight += 1; }
        }
      });
    });

    resultLead.textContent =
      "You matched " + right + " of the " + TOTAL + " judgements. " +
      (cannotRight === cannotTotal
        ? "You got all " + cannotTotal + " of the cannot-decide cells, which " +
          "are the ones that matter: recognising that a case cannot settle a " +
          "question is itself a finding."
        : "You got " + cannotRight + " of the " + cannotTotal +
          " cannot-decide cells. Those are the ones to look at again: a " +
          "profile in which everything is impaired is compatible with both " +
          "sides of the argument, so it settles nothing.");

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All " + TOTAL + " judgements made. The summary is below.");
  }

  function doReset() {
    buildProfiles();
    buildClaims();
    wb.hide("#synthesis");
  }

  wb.onReset(doReset);
  doReset();
})();
