/* =========================================================================
   Decision Framing Laboratory
   -------------------------------------------------------------------------
   Four fictional, ethically neutral decisions. Each has a stock at risk, a
   SAFE option and a GAMBLE with exactly the same expected outcome. Two of
   the four are written as gains and two as losses, assigned at random, and
   the equivalence is withheld until all four decisions have been made.

   WHY SEEDLINGS AND SERVERS
   -------------------------
   The famous version of this problem is about people dying. That makes it
   memorable and it also makes it impossible to separate the framing effect
   from how a reader feels about the stakes. Everything here is stock in a
   store: seedlings, servers, sacks of grain and hire bicycles. Nothing turns
   on the reader's values, which is the point - and which also limits what
   the demonstration generalises to, as the limits panel says.

   THE ARITHMETIC
   --------------
   Every stock is divisible by 27, so all three quantities are whole numbers:

       stock N
       safe (certain)        save exactly N/3
       safe (very likely)    a 90 per cent chance of saving N/3 / 0.9
       gamble                a 1 in 3 chance of saving all N, else none

   All three have an expected outcome of N/3. The "very likely" version is
   the certainty manipulation: same expectation, one less guarantee.

   THE THREE MANIPULATIONS
   -----------------------
       frame        gain or loss wording of identical outcomes (random,
                    two of each across the four scenarios)
       certainty    the safe option certain, or very likely (learner's choice)
       reference    the stock described as long established, or as having only
                    just arrived and not yet been logged (learner's choice)

   The reference-point setting changes no number. It is included because it
   changes what counts as the status quo, and the reveal asks the learner
   which reference point they actually used. It is deliberately NOT modelled
   in the worked example: inventing a small effect would be worse than
   reporting none, and the results prose says so.

   WHAT ONE PERSON'S FOUR DECISIONS CAN SHOW
   -----------------------------------------
   Nothing, on their own. Each scenario is seen in one frame only, so there
   is no within-person comparison available. The reveal therefore prints the
   other framing of the same arithmetic beside each decision, and the
   aggregate pattern comes from a simulated class.

   THE WORKED EXAMPLE
   ------------------
   A simulated class of 120 fictional participants, seed 20261011, four
   decisions each, drawn as Bernoulli choices of the SAFE option with

                          safe option certain    safe option very likely
       gain frame              0.74                     0.52
       loss frame              0.33                     0.27

   The framing effect (the gap between rows) and the certainty effect (the
   gap between columns, much larger in the gain frame) are both BUILT IN.
   They illustrate the shape of the classic findings; they are not evidence
   for them, not norms, and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var NEAR_CERTAIN_P = 0.9;

  /* Four scenarios. Every stock is divisible by 27 so that N/3 and
     N/3/0.9 are both whole numbers. */
  var SCENARIOS = [
    {
      id: "seedlings",
      title: "The frost warning",
      unit: "seedlings",
      stock: 810,
      owned: "Your nursery has 810 seedlings that have been growing here all season.",
      fresh: "A delivery of 810 seedlings arrived this morning and has not yet been logged into your stock.",
      threat: "A hard frost is forecast for tonight, and without intervention none of them will survive."
    },
    {
      id: "servers",
      title: "The firmware fault",
      unit: "servers",
      stock: 540,
      owned: "Your data centre runs 540 servers that have been in service for years.",
      fresh: "A batch of 540 servers was delivered this week and has not yet been added to the asset register.",
      threat: "A firmware fault has been found that will disable every one of them within the day."
    },
    {
      id: "grain",
      title: "The flooded store",
      unit: "sacks of grain",
      stock: 1080,
      owned: "The cooperative store holds 1,080 sacks of grain from your own harvests.",
      fresh: "A consignment of 1,080 sacks of grain arrived overnight and is not yet recorded as yours.",
      threat: "Water is rising in the store and, left alone, all of it will spoil."
    },
    {
      id: "bicycles",
      title: "The depot fire",
      unit: "hire bicycles",
      stock: 1620,
      owned: "The hire scheme owns 1,620 bicycles, kept in a depot it has used for a decade.",
      fresh: "A new fleet of 1,620 bicycles was unloaded yesterday and has not yet been transferred to the scheme.",
      threat: "A fire has started in the depot and, if nothing is done, none of them will be recoverable."
    }
  ];

  /* 300 fictional participants in EACH certainty condition, four decisions
     each - two gain-framed and two loss-framed - so 600 decisions per cell.
     At 120 the sampling error alone moved a cell by seven points, which is
     large enough to obscure the certainty effect the example exists to show. */
  var SIM = {
    seed: 20261011,
    participants: 300,
    safeRate: {
      gain: { certain: 0.74, near: 0.52 },
      loss: { certain: 0.33, near: 0.27 }
    }
  };

  /* Challenge edits. "reduces" says whether the edit should shrink the
     framing asymmetry; "apply" is the sentence it adds to the rewritten
     scenario. */
  var EDITS = [
    {
      id: "both-complements",
      label: "State both numbers in every option — how many are saved AND how many are lost.",
      reduces: true,
      apply: "Option A: 270 seedlings are saved and 540 are lost. " +
        "Option B: a 1 in 3 chance that 810 are saved and none lost, and a 2 in 3 " +
        "chance that none are saved and 810 are lost.",
      why: "The most effective single edit. A large part of the effect comes from " +
        "each frame leaving one complement unstated, and readers filling in the " +
        "gap differently. Say both and there is much less room for the wording to " +
        "do work."
    },
    {
      id: "expected-value",
      label: "Print the expected outcome of each option next to it.",
      reduces: true,
      apply: "Expected outcome of Option A: 270 seedlings saved. " +
        "Expected outcome of Option B: 270 seedlings saved.",
      why: "Reduces the asymmetry, because it makes the equivalence a stated fact " +
        "rather than something the reader has to compute. Note what it does not " +
        "do: it does not make the two options identical in every respect, since " +
        "they still differ in variance, and preferring one variance to another is " +
        "not an error."
    },
    {
      id: "table",
      label: "Lay the options out in a table with matched columns rather than in prose.",
      reduces: true,
      apply: "The two options are set out in a table with one row per option and " +
        "matched columns for saved, lost and expected outcome.",
      why: "Reduces it. A matched layout makes the missing complement conspicuous " +
        "and discourages the reader from treating the two options as answers to " +
        "different questions."
    },
    {
      id: "justify",
      label: "Ask the reader to write one sentence justifying their choice before choosing.",
      reduces: true,
      apply: "Before choosing, write one sentence explaining why.",
      why: "Reduces it, in most studies. Being asked for a reason tends to shift " +
        "people towards the stated numbers and away from the framing. It is also " +
        "the edit most likely to change who takes part at all, which is worth " +
        "noticing."
    },
    {
      id: "vivid",
      label: "Describe the gamble more vividly, so the reader can picture the good outcome.",
      reduces: false,
      apply: "Option B: picture the whole nursery coming through untouched, every " +
        "seedling upright in the morning sun.",
      why: "Increases the asymmetry rather than reducing it. Vividness makes an " +
        "outcome easier to bring to mind, which changes how likely and how " +
        "significant it feels — which is precisely the kind of influence the " +
        "rewrite is trying to remove."
    },
    {
      id: "bigger",
      label: "Multiply every quantity by ten, so 810 becomes 8,100.",
      reduces: false,
      apply: "All quantities are multiplied by ten.",
      why: "Little effect on the asymmetry. The framing effect is about the " +
        "direction outcomes are evaluated from, not about the size of the " +
        "numbers. Changing the scale changes how impressive the problem sounds " +
        "and leaves the reference point exactly where it was."
    }
  ];

  /* =======================================================================
     Seeded randomness (copied rather than imported, so a downloaded folder
     keeps working on its own)
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(items) {
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function num(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* =======================================================================
     Wording
     ===================================================================== */

  function safeAmount(scenario) { return scenario.stock / 3; }
  function nearAmount(scenario) { return Math.round(scenario.stock / 3 / NEAR_CERTAIN_P); }

  function safeText(scenario, frame, certainty) {
    var saved = safeAmount(scenario);
    var lost = scenario.stock - saved;
    if (certainty === "certain") {
      return frame === "gain"
        ? num(saved) + " " + scenario.unit + " will be saved."
        : num(lost) + " " + scenario.unit + " will be lost.";
    }
    var nearSaved = nearAmount(scenario);
    var nearLost = scenario.stock - nearSaved;
    return frame === "gain"
      ? "There is a 90 per cent chance that " + num(nearSaved) + " " +
        scenario.unit + " will be saved, and a 10 per cent chance that none will be."
      : "There is a 90 per cent chance that " + num(nearLost) + " " +
        scenario.unit + " will be lost, and a 10 per cent chance that all " +
        num(scenario.stock) + " will be.";
  }

  function riskyText(scenario, frame) {
    return frame === "gain"
      ? "There is a 1 in 3 chance that all " + num(scenario.stock) + " " +
        scenario.unit + " will be saved, and a 2 in 3 chance that none will be saved."
      : "There is a 1 in 3 chance that none of the " + num(scenario.stock) + " " +
        scenario.unit + " will be lost, and a 2 in 3 chance that all " +
        num(scenario.stock) + " will be lost.";
  }

  function setupText(scenario, reference) {
    return (reference === "owned" ? scenario.owned : scenario.fresh) + " " +
      scenario.threat + " Two courses of action are available, and you must " +
      "choose one.";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#framing");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var certaintySelect = $("#certainty-select");
  var referenceSelect = $("#reference-select");
  var startButton = $('[data-action="start"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');

  var scenarioCard = $("[data-scenario]");
  var scenarioTitle = $("[data-scenario-title]");
  var scenarioSetup = $("[data-scenario-setup]");
  var optionSafe = $("[data-option-safe]");
  var optionRisky = $("[data-option-risky]");
  var progressText = $("[data-progress-text]");
  var displayCaption = $("[data-display-caption]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var decisionTable = $("[data-decision-table]");
  var reframeList = $("[data-reframe-list]");
  var chartCaption = $("[data-chart-caption]");
  var frameChart = $("[data-frame-chart]");
  var frameTable = $("[data-frame-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var originalScenario = $("[data-original-scenario]");
  var editOptions = $("[data-edit-options]");
  var challengeFeedback = $("[data-challenge-feedback]");
  var rewrittenWrap = $("[data-rewritten-wrap]");
  var rewrittenScenario = $("[data-rewritten-scenario]");

  var state = null;

  /* =======================================================================
     Running the decisions
     ===================================================================== */

  function idleControls() {
    startButton.disabled = false;
    stopButton.disabled = true;
    certaintySelect.disabled = false;
    referenceSelect.disabled = false;
  }

  function runningControls() {
    startButton.disabled = true;
    stopButton.disabled = false;
    certaintySelect.disabled = true;
    referenceSelect.disabled = true;
  }

  function startRun() {
    // Two gain frames and two loss frames, shuffled across the four
    // scenarios, so nobody sees the same scenario twice.
    var frames = shuffle(["gain", "gain", "loss", "loss"]);
    state.queue = shuffle(SCENARIOS.slice()).map(function (scenario, i) {
      return { scenario: scenario, frame: frames[i] };
    });
    state.index = 0;
    state.decisions = [];
    resultsSection.hidden = true;
    taskFeedback.hidden = true;
    runningControls();
    showScenario();
    shell.announce("Four decisions, one at a time. Nothing is timed.",
      { immediate: true });
  }

  function showScenario() {
    if (state.index >= state.queue.length) {
      finishRun();
      return;
    }
    var trial = state.queue[state.index];
    scenarioCard.hidden = false;
    scenarioTitle.textContent = trial.scenario.title;
    scenarioSetup.textContent = setupText(trial.scenario, state.reference);
    optionSafe.textContent = safeText(trial.scenario, trial.frame, state.certainty);
    optionRisky.textContent = riskyText(trial.scenario, trial.frame);
    progressText.textContent = "Decision " + (state.index + 1) + " of " +
      state.queue.length + ". Nothing is timed.";
    displayCaption.textContent =
      "Choose one. You will not be told anything until all four are done.";
    var first = scenarioCard.querySelector("button");
    if (first) { first.focus(); }
  }

  function choose(choice) {
    if (state.index >= state.queue.length) { return; }
    var trial = state.queue[state.index];
    state.decisions.push({
      scenario: trial.scenario,
      frame: trial.frame,
      choice: choice
    });
    state.index += 1;
    showScenario();
  }

  function finishRun() {
    scenarioCard.hidden = true;
    idleControls();
    progressText.textContent = "All four decisions made.";
    displayCaption.textContent = "Finished. The equivalence is below.";
    showResults({ source: "own" });
    shell.announce("All four decisions made. The equivalence is below.",
      { immediate: true });
  }

  function stopRun() {
    scenarioCard.hidden = true;
    state.queue = [];
    state.index = 0;
    state.decisions = [];
    idleControls();
    progressText.textContent = "Stopped. Nothing recorded.";
    displayCaption.textContent =
      "Stopped. A partial set cannot be summarised, so nothing was kept.";
    shell.announce("Stopped. Nothing was recorded.", { immediate: true });
  }

  /* =======================================================================
     Simulation
     ===================================================================== */

  function simulate() {
    var rand = mulberry32(SIM.seed);
    var cells = {};
    ["gain", "loss"].forEach(function (frame) {
      ["certain", "near"].forEach(function (certainty) {
        var n = SIM.participants * 2;   // two decisions per person per frame
        var safe = 0;
        for (var i = 0; i < n; i += 1) {
          if (rand() < SIM.safeRate[frame][certainty]) { safe += 1; }
        }
        cells[frame + "-" + certainty] = { n: n, safe: safe / n };
      });
    });
    return cells;
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function showResults(meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "The same arithmetic, twice — worked example, simulated"
      : "The same arithmetic, twice";
    renderResultsProse(meta);
    renderDecisionTable(meta);
    renderReframes(meta);
    renderFrameChart();
    renderFrameTable();
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderResultsProse(meta) {
    clear(resultsBody);

    if (meta.source === "simulated") {
      resultsBody.appendChild(make("p", "reveal__lead",
        "Simulated class data, seed " + SIM.seed + ": " + SIM.participants +
        " fictional participants in each certainty condition, four decisions " +
        "each — two gain-framed and two loss-framed — so 600 decisions per cell."));
      resultsBody.appendChild(make("p", null,
        "Read the chart in two directions. Down the pairs is the framing " +
        "effect: the same arithmetic described as things saved rather than " +
        "things lost sharply increases the proportion choosing the safe option. " +
        "Across a row is the certainty effect: taking the guarantee away from " +
        "the safe option, without changing its expected outcome at all, costs " +
        "it a great deal of its appeal — and costs it far more in the gain " +
        "frame than in the loss frame."));
      resultsBody.appendChild(make("p", null,
        "Both effects are built into the generator documented at the top of " +
        "tool.js. This illustrates the shape of two well-replicated findings; " +
        "it is not evidence for either of them."));
      return;
    }

    var gainSafe = state.decisions.filter(function (d) {
      return d.frame === "gain" && d.choice === "safe";
    }).length;
    var lossSafe = state.decisions.filter(function (d) {
      return d.frame === "loss" && d.choice === "safe";
    }).length;

    resultsBody.appendChild(make("p", "reveal__lead",
      "You chose the safe option on " + gainSafe + " of your 2 gain-framed " +
      "decisions and " + lossSafe + " of your 2 loss-framed decisions."));
    resultsBody.appendChild(make("p", null,
      "Those two numbers cannot show a framing effect and are not meant to. " +
      "You saw each scenario in one frame only, so there is no comparison " +
      "available within your own answers, and four decisions could not " +
      "establish anything even if there were. What your decisions are for is " +
      "the next paragraph."));
    resultsBody.appendChild(make("p", null,
      "In every scenario, the safe option and the gamble had exactly the same " +
      "expected outcome: a third of the stock. Below, each of your decisions " +
      "is printed with the wording you saw and the wording you did not. Read " +
      "the pair and ask whether you would have chosen the same way."));
    resultsBody.appendChild(make("p", null,
      state.reference === "owned"
        ? "One more thing to notice. The stock was described as long " +
          "established and unambiguously yours, so the natural reference point " +
          "was the full amount, and every outcome was a loss from it. Try the " +
          "other setting and see whether the wording reads differently."
        : "One more thing to notice. The stock was described as having only " +
          "just arrived and not yet been logged as yours. If your reference " +
          "point was “nothing yet”, then the loss-framed version was not " +
          "describing a loss at all. Which reference point did you actually " +
          "use? The tool cannot tell, and neither can any study that does not " +
          "ask."));
  }

  function renderDecisionTable(meta) {
    clear(decisionTable);
    if (meta.source === "simulated") {
      var row = make("tr");
      var cell = make("td", null,
        "The worked example is a simulated class rather than a set of " +
        "decisions made here, so there is no per-decision record. Make the " +
        "four decisions yourself to fill this in.");
      cell.setAttribute("colspan", "6");
      row.appendChild(cell);
      decisionTable.appendChild(row);
      return;
    }
    state.decisions.forEach(function (decision) {
      var scenario = decision.scenario;
      var row = make("tr");
      var head = make("th", null, scenario.title);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null,
        decision.frame === "gain" ? "Gain — things saved" : "Loss — things lost"));
      row.appendChild(make("td", null,
        decision.choice === "safe" ? "Option A, the safe one" : "Option B, the gamble"));
      row.appendChild(make("td", null,
        state.certainty === "certain"
          ? num(safeAmount(scenario)) + " for sure"
          : "90% chance of " + num(nearAmount(scenario))));
      row.appendChild(make("td", null,
        "1 in 3 chance of " + num(scenario.stock)));
      row.appendChild(make("td", null,
        num(safeAmount(scenario)) + " " + scenario.unit + " either way"));
      decisionTable.appendChild(row);
    });
  }

  function renderReframes(meta) {
    clear(reframeList);
    if (meta.source === "simulated") { return; }

    var list = make("ul", "reframe");
    state.decisions.forEach(function (decision) {
      var scenario = decision.scenario;
      var other = decision.frame === "gain" ? "loss" : "gain";
      var item = make("li");
      item.appendChild(make("strong", null, scenario.title + " — "));
      item.appendChild(document.createTextNode(
        "you chose " + (decision.choice === "safe" ? "the safe option"
          : "the gamble") + " when it was written like this:"));

      var pair = make("div", "reframe__pair");
      [[decision.frame, "What you saw"], [other, "The same arithmetic, the other way"]]
        .forEach(function (spec) {
          var side = make("div", "reframe__side");
          side.appendChild(make("strong", null, spec[1]));
          side.appendChild(make("p", null,
            "A: " + safeText(scenario, spec[0], state.certainty)));
          side.appendChild(make("p", null,
            "B: " + riskyText(scenario, spec[0])));
          pair.appendChild(side);
        });
      item.appendChild(pair);
      list.appendChild(item);
    });
    reframeList.appendChild(list);
  }

  function renderFrameChart() {
    var cells = simulate();
    var W = 460, H = 200;
    var PAD_L = 150, PAD_R = 62, PAD_T = 24, PAD_B = 38;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    clear(frameChart);

    var bars = [
      { label: "Gain, certain", key: "gain-certain", kind: "gain" },
      { label: "Gain, very likely", key: "gain-near", kind: "gain" },
      { label: "Loss, certain", key: "loss-certain", kind: "loss" },
      { label: "Loss, very likely", key: "loss-near", kind: "loss" }
    ];
    var rowH = plotH / bars.length;
    var barH = Math.min(22, rowH * 0.62);
    var xAt = function (p) { return PAD_L + p * plotW; };

    svgNode("line", { x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH,
      class: "chart__baseline" }, frameChart);
    [0, 0.5, 1].forEach(function (p) {
      svgNode("text", { x: xAt(p).toFixed(1), y: H - 20, "text-anchor": "middle",
        class: "chart__axis" }, frameChart)
        .textContent = Math.round(p * 100) + "%";
    });
    svgNode("text", { x: (PAD_L + plotW / 2).toFixed(1), y: H - 4,
      "text-anchor": "middle", class: "chart__axis" }, frameChart)
      .textContent = "Chose the safe option";
    svgNode("text", { x: PAD_L, y: 14, class: "chart__label" }, frameChart)
      .textContent = "Solid = gain frame · Hatched = loss frame";

    bars.forEach(function (bar, row) {
      var cell = cells[bar.key];
      var y = PAD_T + row * rowH + (rowH - barH) / 2;
      svgNode("text", { x: PAD_L - 8, y: (y + barH / 2 + 4).toFixed(1),
        "text-anchor": "end", class: "chart__label" }, frameChart)
        .textContent = bar.label;
      var width = Math.max(1, xAt(cell.safe) - PAD_L);
      svgNode("rect", { x: PAD_L, y: y.toFixed(1), width: width.toFixed(1),
        height: barH, class: "framing__bar--" + bar.kind }, frameChart);
      if (bar.kind === "loss") {
        for (var x = PAD_L + 9; x < PAD_L + width - 2; x += 11) {
          svgNode("line", { x1: x.toFixed(1), y1: (y + 1).toFixed(1),
            x2: (x - 7).toFixed(1), y2: (y + barH - 1).toFixed(1),
            class: "framing__hatch" }, frameChart);
        }
      }
      svgNode("text", { x: (PAD_L + width + 5).toFixed(1),
        y: (y + barH / 2 + 4).toFixed(1), class: "chart__count" }, frameChart)
        .textContent = pct(cell.safe);
    });

    chartCaption.textContent = "Simulated class data (seed " + SIM.seed +
      "): how often the safe option was chosen, by frame and by how certain " +
      "the safe option was";
  }

  function renderFrameTable() {
    var cells = simulate();
    clear(frameTable);
    [
      ["Gain — things saved", "Completely certain", "gain-certain"],
      ["Gain — things saved", "Very likely", "gain-near"],
      ["Loss — things lost", "Completely certain", "loss-certain"],
      ["Loss — things lost", "Very likely", "loss-near"]
    ].forEach(function (spec) {
      var cell = cells[spec[2]];
      var row = make("tr");
      var head = make("th", null, spec[0]);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, spec[1]));
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, pct(cell.safe)));
      frameTable.appendChild(row);
    });
  }

  /* =======================================================================
     Buttons
     ===================================================================== */

  Array.prototype.forEach.call(scenarioCard.querySelectorAll("[data-choice]"),
    function (button) {
      button.addEventListener("click", function () {
        choose(button.getAttribute("data-choice"));
      });
    });

  startButton.addEventListener("click", startRun);
  stopButton.addEventListener("click", stopRun);

  workedExample.addEventListener("click", function () {
    scenarioCard.hidden = true;
    state.queue = [];
    state.index = 0;
    idleControls();
    displayCaption.textContent =
      "Worked example loaded below. The four decisions are still available.";
    showResults({ source: "simulated" });
    shell.announce("Worked example loaded: a simulated class dataset with a fixed seed.",
      { immediate: true });
  });

  certaintySelect.addEventListener("change", function () {
    state.certainty = certaintySelect.value;
  });

  referenceSelect.addEventListener("change", function () {
    state.reference = referenceSelect.value;
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    loss: {
      tone: "good", verdict: "That is the usual direction.",
      text: "Described as losses, more people take the gamble; described as " +
        "gains, more people take the sure thing. The mechanism people usually " +
        "reach for is that outcomes are judged as changes from a reference " +
        "point, and losses weigh more heavily than gains of the same size."
    },
    gain: {
      tone: "caution", verdict: "The other way round.",
      text: "The gain wording tends to pull people towards the certain option, " +
        "not the gamble. Watch the simulated class data and see which way the " +
        "two rows go."
    },
    none: {
      tone: "caution", verdict: "A perfectly reasonable position, and it does not hold.",
      text: "It is what a purely arithmetic account predicts, and the finding " +
        "that it fails is why this literature exists. Notice, though, that " +
        "failing it is not the same as being irrational: the wording carries " +
        "information about what the reference point is, and reference points " +
        "are how most evaluation works."
    },
    depends: {
      tone: "caution", verdict: "Both are true at once.",
      text: "People do differ, a great deal. But the frame shifts the whole " +
        "distribution: change the wording and the proportion choosing the " +
        "gamble changes substantially, often enough to reverse which option is " +
        "in the majority."
    }
  };

  function unlockLab(message) {
    idleControls();
    displayCaption.textContent = "Ready. Nothing is timed at any point.";
    progressText.textContent = "Ready. Four decisions, in a random order.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four answers before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockLab("Laboratory unlocked. Four decisions, nothing timed.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The laboratory is unlocked. If you are demonstrating, split the room " +
      "between the two certainty settings before anybody starts.");
    lockForm(openingForm);
    unlockLab("Prediction skipped. Laboratory unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  function renderChallenge() {
    var scenario = SCENARIOS[0];
    originalScenario.textContent = setupText(scenario, "owned") + " " +
      "Option A: " + safeText(scenario, "gain", "certain") + " " +
      "Option B: " + riskyText(scenario, "gain");

    clear(editOptions);
    EDITS.forEach(function (edit) {
      var wrap = make("div");
      var label = make("label", "edit-option");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.id = "edit-" + edit.id;
      input.value = edit.id;
      label.appendChild(input);
      label.appendChild(make("span", null, edit.label));
      wrap.appendChild(label);
      wrap.appendChild(make("span", "edit-option__mark", ""));
      editOptions.appendChild(wrap);
    });
    rewrittenWrap.hidden = true;
    clear(rewrittenScenario);
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = [];
    var right = 0;

    EDITS.forEach(function (edit) {
      var input = $("#edit-" + edit.id, challengeForm);
      var mark = input.parentNode.parentNode.querySelector(".edit-option__mark");
      var selected = input.checked;
      if (selected) { chosen.push(edit); }
      var correct = selected === edit.reduces;
      if (correct) { right += 1; }
      mark.textContent = correct
        ? (selected ? "Yes — this reduces it." : "Right to leave this out.")
        : (selected ? "This one does not reduce it." :
          "This one would have helped.");
    });

    showFeedback(challengeFeedback,
      right === EDITS.length ? "good" : "caution",
      right + " of " + EDITS.length + " judged correctly.",
      "Four of the six reduce the asymmetry and two do not. The two that do " +
      "not are worth dwelling on: making an outcome vivid and making the " +
      "numbers larger both make the problem feel more consequential without " +
      "touching the thing that produces the effect.");

    var list = make("ul");
    EDITS.forEach(function (edit) {
      var li = make("li");
      li.appendChild(make("strong", null, edit.label + " "));
      li.appendChild(document.createTextNode(edit.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    clear(rewrittenScenario);
    var scenario = SCENARIOS[0];
    rewrittenScenario.appendChild(make("p", "scenario__body",
      setupText(scenario, "owned")));
    if (!chosen.length) {
      rewrittenScenario.appendChild(make("p", "scenario__body",
        "Option A: " + safeText(scenario, "gain", "certain") +
        " Option B: " + riskyText(scenario, "gain") +
        " (No edits selected, so this is the original.)"));
    } else {
      chosen.forEach(function (edit) {
        rewrittenScenario.appendChild(make("p", "scenario__body", edit.apply));
      });
    }
    rewrittenWrap.hidden = false;

    shell.announce("Edits applied. " + right + " of " + EDITS.length +
      " judged correctly.", { immediate: true });
  });

  /* =======================================================================
     Helpers
     ===================================================================== */

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
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* =======================================================================
     Reset
     ===================================================================== */

  shell.onReset(function () {
    state = {
      queue: [],
      index: 0,
      decisions: [],
      certainty: "certain",
      reference: "owned"
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "The same arithmetic, twice";

    clear(decisionTable);
    clear(reframeList);
    clear(frameTable);
    clear(frameChart);
    clear(resultsBody);

    certaintySelect.value = "certain";
    referenceSelect.value = "owned";
    certaintySelect.disabled = true;
    referenceSelect.disabled = true;
    startButton.disabled = true;
    stopButton.disabled = true;

    scenarioCard.hidden = true;
    displayCaption.textContent =
      "Answer the question above to unlock the laboratory.";
    progressText.textContent = "Answer the question above to unlock this.";

    renderChallenge();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Nothing on this page is timed and nothing moves. The equivalence " +
    "of the two options is withheld until all four decisions have been made.",
    { immediate: true });
})();
