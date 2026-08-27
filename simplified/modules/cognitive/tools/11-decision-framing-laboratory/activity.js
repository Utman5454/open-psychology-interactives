/* =========================================================================
   Decision Framing Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/11-decision-framing-laboratory/

   TEACHING JOB
   ------------
   Two descriptions of exactly the same outcomes can produce opposite
   choices, so a description that looks neutral is not.

   WHAT IS PRESERVED
   -----------------
   The four decisions made one at a time with the equivalence withheld, and
   the side-by-side reframing afterwards. Withholding is not decoration: a
   learner told in advance what is being looked at will answer the second
   version to match the first, and the demonstration is gone.

   THE DESIGN
   ----------
   Two problems, each asked once in a gain frame and once in a loss frame,
   interleaved so that the two halves of a pair are never adjacent:

       1  problem A, gain frame
       2  problem B, loss frame
       3  problem A, loss frame
       4  problem B, gain frame

   Within a pair the numbers are identical. Saving 200 of 600 is losing 400 of
   600; a one-in-three chance of saving all is a two-in-three chance of losing
   all. The two problems use different goods so the pairing is not obvious,
   though a learner who notices has lost nothing: what is withheld is the
   equivalence, not the possibility of working it out.

   The two options are presented in a fixed order within each decision, but
   which of them is the certain one alternates across the four, so a learner
   answering by position produces a visibly inconsistent pattern rather than a
   spuriously clean one.

   WHAT WAS REDUCED
   ----------------
   The manipulation of how certain the certain option is, the shift of the
   reference point itself, and the scenarios outside the stock-loss setting.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  /* Two problems. Within a problem the two frames describe identical
     outcomes; only the starting point of the description moves. */
  var PROBLEMS = {
    crates: {
      name: "the flooded warehouse",
      total: 600, unit: "crates of vaccine",
      setup: "A river has burst its banks and is rising towards a warehouse " +
        "holding 600 crates of vaccine. There is time for one intervention " +
        "and two plans have been put to you."
    },
    trees: {
      name: "the forest fire",
      total: 900, unit: "hectares of woodland",
      setup: "A fire is moving towards 900 hectares of ancient woodland. One " +
        "firebreak can be cut before it arrives, and there are two places to " +
        "cut it."
    }
  };

  var DECISIONS = [
    {
      problem: "crates", frame: "gain",
      text: "If plan A is used, 200 crates will be saved. If plan B is used, " +
        "there is a one in three chance that all 600 crates will be saved, " +
        "and a two in three chance that none will be saved.",
      options: [
        { key: "certain", label: "Plan A: 200 crates will be saved" },
        { key: "risky", label: "Plan B: a one in three chance of saving all 600" }
      ]
    },
    {
      problem: "trees", frame: "loss",
      text: "If the break is cut at the ridge, 600 hectares will be lost. If " +
        "it is cut at the river, there is a two in three chance that all 900 " +
        "hectares will be lost, and a one in three chance that none will be.",
      options: [
        { key: "risky", label: "The river: a two in three chance of losing all 900" },
        { key: "certain", label: "The ridge: 600 hectares will be lost" }
      ]
    },
    {
      problem: "crates", frame: "loss",
      text: "A second warehouse, also holding 600 crates, is now at risk. If " +
        "plan C is used, 400 crates will be lost. If plan D is used, there is " +
        "a two in three chance that all 600 crates will be lost, and a one in " +
        "three chance that none will be lost.",
      options: [
        { key: "certain", label: "Plan C: 400 crates will be lost" },
        { key: "risky", label: "Plan D: a two in three chance of losing all 600" }
      ]
    },
    {
      problem: "trees", frame: "gain",
      text: "A second stretch of woodland, also 900 hectares, is threatened. " +
        "If the break is cut at the quarry, 300 hectares will be saved. If it " +
        "is cut at the road, there is a one in three chance that all 900 " +
        "hectares will be saved, and a two in three chance that none will be.",
      options: [
        { key: "risky", label: "The road: a one in three chance of saving all 900" },
        { key: "certain", label: "The quarry: 300 hectares will be saved" }
      ]
    }
  ];

  var scenarioText = document.getElementById("scenario-text");
  var options = document.getElementById("options");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var prompt = document.getElementById("prompt");
  var setupNote = document.getElementById("setup-note");
  var resultLead = document.getElementById("result-lead");
  var pairsBox = document.getElementById("pairs");

  var index = 0;
  var chosen = [];

  function showDecision() {
    if (index >= DECISIONS.length) { report(); return; }
    var d = DECISIONS[index];
    var p = PROBLEMS[d.problem];
    wb.progress.set(0);
    stepLabel.textContent = "Decision " + (index + 1) + " of " + DECISIONS.length;
    taskHeading.textContent = index === 0
      ? "A shipment at risk"
      : "Another decision";
    scenarioText.textContent = p.setup + " " + d.text;
    prompt.textContent = "Which do you choose?";
    options.hidden = false;
    options.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which option do you choose?";
    options.appendChild(legend);
    d.options.forEach(function (opt) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option option--row";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-key", opt.key);
      button.textContent = opt.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        choose(opt.key);
      });
      options.appendChild(button);
    });
    wb.announce("Decision " + (index + 1) + " of " + DECISIONS.length + ".");
  }

  function choose(key) {
    chosen.push(key);
    index += 1;
    showDecision();
  }

  /* --- The reveal -------------------------------------------------------- */

  function report() {
    wb.progress.markAllDone();
    stepLabel.textContent = "What you did";
    taskHeading.textContent = "All four decisions made";
    scenarioText.textContent =
      "Nothing more to decide. What you chose is set out below, paired up.";
    prompt.textContent = "";
    options.textContent = "";
    /* An emptied fieldset still draws its own border, which reads as a stray
       empty box under the scenario. */
    options.hidden = true;
    setupNote.hidden = true;

    var byProblem = {};
    DECISIONS.forEach(function (d, i) {
      byProblem[d.problem] = byProblem[d.problem] || {};
      byProblem[d.problem][d.frame] = { decision: d, choice: chosen[i], number: i + 1 };
    });

    pairsBox.textContent = "";
    var switches = 0, pairs = 0;
    Object.keys(byProblem).forEach(function (key) {
      var pair = byProblem[key];
      if (!pair.gain || !pair.loss) { return; }
      pairs += 1;
      var switched = pair.gain.choice !== pair.loss.choice;
      if (switched) { switches += 1; }
      pairsBox.appendChild(renderPair(PROBLEMS[key], pair, switched));
    });

    var gainCertain = Object.keys(byProblem).filter(function (k) {
      return byProblem[k].gain.choice === "certain";
    }).length;
    var lossRisky = Object.keys(byProblem).filter(function (k) {
      return byProblem[k].loss.choice === "risky";
    }).length;

    if (switches === 0) {
      resultLead.textContent =
        "You chose the same way in both versions of both problems, which means " +
        "the rewording did not move you. That is a perfectly reasonable place " +
        "to end up and it is not rarer than you would think: the effect is a " +
        "tendency across groups rather than a law about individuals. Look at " +
        "the pairs below anyway, because the point is not what you did but " +
        "that the two descriptions in each pair contain identical numbers.";
    } else {
      resultLead.textContent =
        "In " + (switches === pairs ? "both" : "one") + " of the two pairs you " +
        "chose differently in the two versions, and the two versions of a pair " +
        "contain identical numbers. " +
        (gainCertain > 0 && lossRisky > 0
          ? "You took the certain option when the wording was about what would " +
            "be saved and gambled when it was about what would be lost, which " +
            "is the usual direction."
          : "The direction you moved in is not the usual one, which happens, " +
            "and with two pairs it is not worth reading much into.");
    }

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All four decisions made. The pairs are below.");
  }

  function renderPair(problem, pair, switched) {
    var wrap = document.createElement("section");
    wrap.className = "block";

    var head = document.createElement("h3");
    head.textContent = "The two versions of " + problem.name;
    wrap.appendChild(head);

    var note = document.createElement("p");
    note.className = "small";
    note.textContent = "Both versions concern " + problem.total + " " +
      problem.unit + ", the same certain outcome and the same gamble. " +
      (switched
        ? "You chose differently in the two."
        : "You chose the same way in both.");
    wrap.appendChild(note);

    var grid = document.createElement("div");
    grid.className = "reveal-grid";
    grid.setAttribute("style", "--reveal-columns: 2");

    [["gain", "Described as what is saved"], ["loss", "Described as what is lost"]]
      .forEach(function (entry) {
        var side = pair[entry[0]];
        var card = document.createElement("div");
        card.className = "mini";
        card.setAttribute("data-state", switched ? "partial" : "chosen");

        var title = document.createElement("strong");
        title.textContent = entry[1];
        card.appendChild(title);

        var body = document.createElement("p");
        body.className = "small";
        body.textContent = side.decision.text;
        card.appendChild(body);

        /* Built from nodes rather than from a markup string: nothing here
           needs escaping if nothing is ever parsed as markup. */
        var picked = document.createElement("p");
        var pickedLabel = document.createElement("strong");
        pickedLabel.textContent = "You chose (decision " + side.number + "): ";
        picked.appendChild(pickedLabel);
        picked.appendChild(document.createTextNode(
          side.decision.options.filter(function (o) {
            return o.key === side.choice;
          })[0].label));
        card.appendChild(picked);

        var kind = document.createElement("p");
        kind.className = "small";
        kind.textContent = side.choice === "certain"
          ? "That is the certain option." : "That is the gamble.";
        card.appendChild(kind);

        grid.appendChild(card);
      });

    wrap.appendChild(grid);
    return wrap;
  }

  /* --- Wiring ------------------------------------------------------------ */

  function doReset() {
    index = 0;
    chosen = [];
    pairsBox.textContent = "";
    setupNote.hidden = false;
    wb.hide("#synthesis");
    wb.progress.reset();
    showDecision();
  }

  wb.onReset(doReset);
  doReset();
})();
