/* =========================================================================
   Dual-Task and Limited Capacity Laboratory
   -------------------------------------------------------------------------
   Two simple choice tasks, performed alone and then together, so that a
   dual-task cost can be measured against each task's OWN single-task
   baseline. The order of the three blocks is enforced, because a cost is a
   difference and without a baseline there is no difference to report.

       block 1   letters alone       a letter: vowel or consonant
       block 2   numbers alone       a number: odd or even
       block 3   both at once        letter and number together

   TWO MANIPULATIONS, CHOSEN TO POINT IN DIFFERENT DIRECTIONS
   ----------------------------------------------------------
   difficulty   easy: one digit, odd or even
                hard: two digits, is their SUM odd or even
                (more processing, same response set)

   overlap      respond: a choice response to every number
                count:   no per-item choice - just count the odd ones and
                         report the total at the end of the block

   A general-capacity account expects the difficulty manipulation to hurt the
   letter task. A response-selection bottleneck expects the overlap
   manipulation to matter far more. Neither is settled by one learner's
   blocks; the debrief and the challenge both say so.

   In counting mode there is no choice response to the number, so block 2 is
   paced by a single non-choice "Next" press: that gives a viewing time per
   number without engaging response selection. In block 3 the number is on
   screen for exactly as long as the letter response takes, so no separate
   number time is reported there - the informative number measure in the dual
   block is the count itself.

   TIMING AND CLEANING
   -------------------
       inter-trial interval    500 ms
       displays are never timed out; each waits for its response
       anticipations           responses under 200 ms, excluded and counted
       lapses                  responses over 4000 ms, excluded and counted
       errors                  excluded from the time means, reported as accuracy

   WHY RESULTS ARE WITHHELD UNTIL A BLOCK ENDS
   -------------------------------------------
   A running score during a speeded block changes how people answer the next
   trial. Blocks report at the end only.

   A CONFOUND THIS DESIGN CANNOT REMOVE
   ------------------------------------
   Block 3 always follows blocks 1 and 2, so the dual-task cost is measured
   against baselines collected when the learner was less practised, which
   inflates it. A real experiment counterbalances. This one cannot, because
   the teaching point is precisely that the baselines come first. The limits
   panel says so in those words.

   THE WORKED EXAMPLE (the non-performing route)
   ---------------------------------------------
   One simulated participant who ran both settings. Times are drawn as

       RT = base + Normal(0, sd) + Exponential(mean tail), floored at 220 ms

   Set A - respond mode, easy, seed 20260971, 60 trials per block
       letters alone 610 (acc .97)   numbers alone 570 (acc .96)
       letters dual  780 (acc .93)   numbers dual  850 (acc .90)
   Set B - counting mode, easy, seed 20260972, 60 trials per block
       letters alone 610 (acc .97)   numbers alone 700 (viewing time)
       letters dual  690 (acc .96)   count error 0 alone, 2 in the dual block
       sd 80, tail 55 throughout

   The asymmetry in Set A and the much smaller letter cost in Set B are BUILT
   IN. They illustrate the shape of the classic findings rather than providing
   evidence for them, and the results panel says so. These numbers are not
   norms, not published effect sizes and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var BLOCK_TRIALS = 20;
  var INTER_TRIAL_MS = 500;
  var ANTICIPATION_MS = 200;
  var LAPSE_MS = 4000;

  var VOWELS = "AEIOU".split("");
  var CONSONANTS = "BCDFGHJKLMNPRSTVWYZ".split("");

  var STAGES = [
    { key: "letters", label: "Letters alone", letter: true, number: false },
    { key: "numbers", label: "Numbers alone", letter: false, number: true },
    { key: "both", label: "Both at once", letter: true, number: true }
  ];

  var SIM = {
    sd: 80, tail: 55, floor: 220,
    sets: [
      {
        label: "Worked example A", seed: 20260971, difficulty: "easy",
        mode: "respond", n: 60,
        letters: { alone: { base: 610, acc: 0.97 }, dual: { base: 780, acc: 0.93 } },
        numbers: { alone: { base: 570, acc: 0.96 }, dual: { base: 850, acc: 0.90 } },
        countError: null
      },
      {
        label: "Worked example B", seed: 20260972, difficulty: "easy",
        mode: "count", n: 60,
        letters: { alone: { base: 610, acc: 0.97 }, dual: { base: 690, acc: 0.96 } },
        numbers: { alone: { base: 700, acc: 1 }, dual: null },
        countError: { alone: 0, dual: 2 }
      }
    ]
  };

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

  function normal(rand) {
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function exponential(rand, meanValue) {
    return -meanValue * Math.log(1 - rand());
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

  function ms(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value) + " ms";
  }

  function signedMs(value) {
    if (value === null || value === undefined || isNaN(value)) { return "—"; }
    var r = Math.round(value);
    return (r > 0 ? "+" : "") + r + " ms";
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function meanOf(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }

  /* =======================================================================
     Stimuli
     ===================================================================== */

  function makeLetter() {
    var vowel = Math.random() < 0.5;
    var pool = vowel ? VOWELS : CONSONANTS;
    return {
      glyph: pool[Math.floor(Math.random() * pool.length)],
      answer: vowel ? "vowel" : "consonant"
    };
  }

  function makeNumber(difficulty) {
    if (difficulty === "easy") {
      var d = 1 + Math.floor(Math.random() * 9);
      return { glyph: String(d), answer: d % 2 ? "odd" : "even", odd: d % 2 === 1 };
    }
    // Hard: two digits, judged on the parity of their SUM. Same response set,
    // more processing.
    var n = 12 + Math.floor(Math.random() * 87);
    var sum = Math.floor(n / 10) + (n % 10);
    return { glyph: String(n), answer: sum % 2 ? "odd" : "even", odd: sum % 2 === 1 };
  }

  function buildBlock(stage, difficulty) {
    var trials = [];
    for (var i = 0; i < BLOCK_TRIALS; i += 1) {
      trials.push({
        letter: stage.letter ? makeLetter() : null,
        number: stage.number ? makeNumber(difficulty) : null
      });
    }
    return trials;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#dual");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var difficultySelect = $("#difficulty-select");
  var modeSelect = $("#mode-select");
  var startBlock = $('[data-action="start-block"]');
  var stopButton = $('[data-action="stop"]');
  var restartSet = $('[data-action="restart-set"]');
  var workedExample = $('[data-action="worked-example"]');

  var stageTrack = $("[data-stage-track]");
  var taskText = $("[data-task-text]");
  var numberDisplay = $("[data-number]");
  var letterDisplay = $("[data-letter]");
  var displayCaption = $("[data-display-caption]");
  var letterResponses = $("[data-letter-responses]");
  var numberResponses = $("[data-number-responses]");
  var countForm = $("[data-count-form]");
  var countInput = $("#count-input");
  var countLabel = $("[data-count-label]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var costReadout = $("[data-cost-readout]");
  var costText = $("[data-cost-text]");
  var costNote = $("[data-cost-note]");
  var chartCaption = $("[data-chart-caption]");
  var costChart = $("[data-cost-chart]");
  var costTable = $("[data-cost-table]");
  var setsTable = $("[data-sets-table]");
  var setsNote = $("[data-sets-note]");
  var excludedBody = $("[data-excluded-body]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var pending = [];

  function later(fn, delay) {
    var id = window.setTimeout(function () {
      pending = pending.filter(function (other) { return other !== id; });
      fn();
    }, delay);
    pending.push(id);
    return id;
  }

  function cancelPending() {
    pending.forEach(function (id) { window.clearTimeout(id); });
    pending = [];
  }

  /* =======================================================================
     Controls and stage track
     ===================================================================== */

  function stage() { return STAGES[state.stageIndex]; }

  function paintStageTrack() {
    Array.prototype.forEach.call(stageTrack.children, function (item, index) {
      item.removeAttribute("aria-current");
      if (index < state.stageIndex) {
        item.setAttribute("data-state", "done");
      } else if (index === state.stageIndex && !state.setDone) {
        item.setAttribute("data-state", "current");
        item.setAttribute("aria-current", "step");
      } else {
        item.setAttribute("data-state", "todo");
      }
    });
  }

  function describeTask() {
    if (state.setDone) {
      return "Set complete. Change a setting and start a new set of three, " +
        "or read the results below.";
    }
    var s = stage();
    var numberRule = state.difficulty === "easy"
      ? "press Odd or Even for the number"
      : "press Odd or Even for the SUM of the number's two digits";
    if (s.key === "letters") {
      return "Block 1 — press Vowel or Consonant for the letter. Nothing else " +
        "is on screen.";
    }
    if (s.key === "numbers") {
      return state.mode === "respond"
        ? "Block 2 — " + numberRule + ". Nothing else is on screen."
        : "Block 2 — count the odd numbers silently and press Next after each " +
          "one. You will be asked for the total.";
    }
    return state.mode === "respond"
      ? "Block 3 — both at once: vowel or consonant for the letter, and " +
        numberRule + ". Either order."
      : "Block 3 — press Vowel or Consonant for the letter, and keep counting " +
        "the odd numbers. You will be asked for the total.";
  }

  function updateTaskText() {
    taskText.textContent = describeTask();
    startBlock.textContent = state.setDone
      ? "Set complete"
      : "Run block " + (state.stageIndex + 1);
  }

  function idleControls() {
    startBlock.disabled = state.setDone;
    stopButton.disabled = true;
    restartSet.disabled = state.stageIndex === 0 && !state.setDone;
    difficultySelect.disabled = state.stageIndex !== 0;
    modeSelect.disabled = state.stageIndex !== 0;
  }

  function runningControls() {
    startBlock.disabled = true;
    stopButton.disabled = false;
    restartSet.disabled = true;
    difficultySelect.disabled = true;
    modeSelect.disabled = true;
  }

  /* =======================================================================
     Response rows
     ===================================================================== */

  function renderNumberResponses() {
    clear(numberResponses);
    if (state.mode === "respond") {
      [["odd", "Odd", "D"], ["even", "Even", "K"]].forEach(function (spec) {
        var button = make("button", "button button--secondary response");
        button.type = "button";
        button.disabled = true;
        button.setAttribute("data-number-response", spec[0]);
        button.setAttribute("aria-label", "The number is " + spec[1].toLowerCase() +
          ", key " + spec[2]);
        button.appendChild(make("span", null, spec[1]));
        var key = make("span", "response__key", spec[2]);
        key.setAttribute("aria-hidden", "true");
        button.appendChild(key);
        button.addEventListener("click", function () { answerNumber(spec[0]); });
        numberResponses.appendChild(button);
      });
      return;
    }
    var next = make("button", "button button--secondary response");
    next.type = "button";
    next.disabled = true;
    next.setAttribute("data-number-response", "next");
    next.setAttribute("aria-label", "Counted this number, go to the next, space bar");
    next.appendChild(make("span", null, "Counted it — next"));
    var spaceKey = make("span", "response__key", "Space");
    spaceKey.setAttribute("aria-hidden", "true");
    next.appendChild(spaceKey);
    next.addEventListener("click", function () { answerNumber("next"); });
    numberResponses.appendChild(next);
  }

  function setRowEnabled(row, enabled) {
    Array.prototype.forEach.call(row.querySelectorAll("button"), function (b) {
      b.disabled = !enabled;
      b.removeAttribute("data-answered");
    });
  }

  function markAnswered(row) {
    Array.prototype.forEach.call(row.querySelectorAll("button"), function (b) {
      b.disabled = true;
    });
  }

  /* =======================================================================
     Running a block
     ===================================================================== */

  function beginBlock() {
    var s = stage();
    state.running = true;
    state.index = 0;
    state.trials = [];
    state.queue = buildBlock(s, state.difficulty);
    state.oddSeen = 0;
    taskFeedback.hidden = true;
    countForm.hidden = true;
    runningControls();

    letterResponses.hidden = !s.letter;
    numberResponses.hidden = !s.number;
    renderNumberResponses();

    beginTrial();
    shell.announce("Block " + (state.stageIndex + 1) + " started: " +
      BLOCK_TRIALS + " trials, no feedback until it ends.", { immediate: true });
  }

  function beginTrial() {
    var s = stage();
    var trial = state.queue[state.index];
    state.current = trial;
    state.letterDone = !s.letter;
    state.numberDone = !s.number;
    state.letterRt = null;
    state.numberRt = null;

    numberDisplay.textContent = trial.number ? trial.number.glyph : "";
    letterDisplay.textContent = trial.letter ? trial.letter.glyph : "";
    if (trial.number && trial.number.odd) { state.oddSeen += 1; }

    state.shownAt = now();
    if (s.letter) { setRowEnabled(letterResponses, true); }
    if (s.number) { setRowEnabled(numberResponses, true); }

    displayCaption.textContent = "Trial " + (state.index + 1) + " of " +
      BLOCK_TRIALS + ". No time limit.";
  }

  function answerLetter(answer) {
    if (!state.running || state.letterDone) { return; }
    var trial = state.current;
    state.letterRt = now() - state.shownAt;
    state.letterCorrect = answer === trial.letter.answer;
    state.letterDone = true;
    markAnswered(letterResponses);
    maybeFinishTrial();
  }

  function answerNumber(answer) {
    if (!state.running || state.numberDone) { return; }
    var trial = state.current;
    state.numberRt = now() - state.shownAt;
    state.numberCorrect = state.mode === "count" ? null
      : answer === trial.number.answer;
    state.numberDone = true;
    markAnswered(numberResponses);
    maybeFinishTrial();
  }

  function maybeFinishTrial() {
    if (!state.letterDone || !state.numberDone) { return; }

    var s = stage();
    state.trials.push({
      letterRt: s.letter ? state.letterRt : null,
      letterCorrect: s.letter ? state.letterCorrect : null,
      // In counting mode during the dual block the number is on screen for
      // exactly as long as the letter response takes, so no separate number
      // time is meaningful there.
      numberRt: (s.number && !(state.mode === "count" && s.key === "both"))
        ? state.numberRt : null,
      numberCorrect: (s.number && state.mode === "respond")
        ? state.numberCorrect : null
    });

    numberDisplay.textContent = "";
    letterDisplay.textContent = "";
    setRowEnabled(letterResponses, false);
    setRowEnabled(numberResponses, false);

    state.index += 1;
    if (state.index >= state.queue.length) {
      later(endBlock, INTER_TRIAL_MS);
    } else {
      later(beginTrial, INTER_TRIAL_MS);
    }
  }

  function endBlock() {
    var s = stage();
    state.running = false;
    cancelPending();
    setRowEnabled(letterResponses, false);
    setRowEnabled(numberResponses, false);

    if (state.mode === "count" && s.number) {
      displayCaption.textContent = "Block finished. One question left.";
      countLabel.textContent = state.difficulty === "easy"
        ? "How many of the numbers were odd?"
        : "How many of the numbers had an odd digit sum?";
      countForm.hidden = false;
      countInput.value = "";
      countInput.focus();
      shell.announce("Block finished. How many of the numbers were odd?",
        { immediate: true });
      return;
    }
    completeBlock(null);
  }

  function completeBlock(countAnswer) {
    var s = stage();
    var summary = summariseBlock(state.trials);
    if (countAnswer !== null) {
      summary.countError = Math.abs(countAnswer - state.oddSeen);
      summary.countActual = state.oddSeen;
      summary.countGiven = countAnswer;
    }
    state.blocks[s.key] = summary;

    countForm.hidden = true;
    numberDisplay.textContent = "";
    letterDisplay.textContent = "";

    if (s.key === "both") {
      state.setDone = true;
      recordSet();
      displayCaption.textContent = "Set finished. The results are below.";
    } else {
      state.stageIndex += 1;
      displayCaption.textContent = "Block finished. The next one is ready.";
      showFeedback(taskFeedback, "neutral", "Block finished.",
        "No numbers yet — a cost only exists once there is a baseline and a " +
        "dual block to compare it with. " + describeTask());
    }

    paintStageTrack();
    updateTaskText();
    idleControls();
    if (!state.setDone) { startBlock.focus(); }
    shell.announce(state.setDone
      ? "Set finished. The results are below."
      : "Block finished. Block " + (state.stageIndex + 1) + " is ready.",
      { immediate: true });
  }

  function stopBlock() {
    cancelPending();
    state.running = false;
    setRowEnabled(letterResponses, false);
    setRowEnabled(numberResponses, false);
    countForm.hidden = true;
    numberDisplay.textContent = "";
    letterDisplay.textContent = "";
    displayCaption.textContent =
      "Block stopped. It has to be run in full to count, so it is discarded.";
    idleControls();
    updateTaskText();
    shell.announce("Block stopped and discarded. A partial block cannot be " +
      "compared with a full one.", { immediate: true });
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  function summariseBlock(trials) {
    var out = { n: trials.length, excluded: { errors: 0, fast: 0, slow: 0 } };

    ["letter", "number"].forEach(function (task) {
      var rtKey = task + "Rt";
      var okKey = task + "Correct";
      var present = trials.filter(function (t) { return t[rtKey] !== null; });
      var kept = [];
      var correct = 0;
      var scored = 0;

      present.forEach(function (t) {
        if (t[okKey] !== null) {
          scored += 1;
          if (t[okKey]) { correct += 1; } else { out.excluded.errors += 1; return; }
        }
        if (t[rtKey] < ANTICIPATION_MS) { out.excluded.fast += 1; return; }
        if (t[rtKey] > LAPSE_MS) { out.excluded.slow += 1; return; }
        kept.push(t[rtKey]);
      });

      out[task] = {
        n: present.length,
        nKept: kept.length,
        accuracy: scored ? correct / scored : null,
        mean: meanOf(kept)
      };
    });

    return out;
  }

  function costsFrom(blocks) {
    var letters = {
      alone: blocks.letters ? blocks.letters.letter : null,
      dual: blocks.both ? blocks.both.letter : null
    };
    var numbers = {
      alone: blocks.numbers ? blocks.numbers.number : null,
      dual: blocks.both ? blocks.both.number : null
    };
    return {
      letters: letters,
      numbers: numbers,
      letterCost: (letters.alone && letters.dual &&
        letters.alone.mean !== null && letters.dual.mean !== null)
        ? letters.dual.mean - letters.alone.mean : null,
      numberCost: (numbers.alone && numbers.dual &&
        numbers.alone.mean !== null && numbers.dual.mean !== null)
        ? numbers.dual.mean - numbers.alone.mean : null,
      countAlone: blocks.numbers ? blocks.numbers.countError : undefined,
      countDual: blocks.both ? blocks.both.countError : undefined
    };
  }

  /* =======================================================================
     Simulation
     ===================================================================== */

  function simulateTimes(rand, spec, n) {
    var kept = [];
    for (var i = 0; i < n; i += 1) {
      var rt = Math.max(SIM.floor,
        spec.base + normal(rand) * SIM.sd + exponential(rand, SIM.tail));
      if (rand() < spec.acc) { kept.push(rt); }
    }
    return { n: n, nKept: kept.length, accuracy: kept.length / n, mean: meanOf(kept) };
  }

  function simulateSet(setSpec) {
    var rand = mulberry32(setSpec.seed);
    var blocks = {
      letters: { letter: simulateTimes(rand, setSpec.letters.alone, setSpec.n),
        number: { n: 0, nKept: 0, accuracy: null, mean: null },
        n: setSpec.n, excluded: { errors: 0, fast: 0, slow: 0 } },
      numbers: { letter: { n: 0, nKept: 0, accuracy: null, mean: null },
        number: simulateTimes(rand, setSpec.numbers.alone, setSpec.n),
        n: setSpec.n, excluded: { errors: 0, fast: 0, slow: 0 } },
      both: { letter: simulateTimes(rand, setSpec.letters.dual, setSpec.n),
        number: setSpec.numbers.dual
          ? simulateTimes(rand, setSpec.numbers.dual, setSpec.n)
          : { n: setSpec.n, nKept: 0, accuracy: null, mean: null },
        n: setSpec.n, excluded: { errors: 0, fast: 0, slow: 0 } }
    };
    if (setSpec.countError) {
      blocks.numbers.countError = setSpec.countError.alone;
      blocks.both.countError = setSpec.countError.dual;
    }
    return blocks;
  }

  /* =======================================================================
     Recording and display
     ===================================================================== */

  function recordSet() {
    var costs = costsFrom(state.blocks);
    state.sets.push({
      label: "Set " + (state.sets.length + 1),
      source: "Your blocks",
      difficulty: state.difficulty === "easy" ? "Easy (one digit)" : "Hard (digit sum)",
      mode: state.mode === "respond" ? "Every item" : "Once at the end",
      costs: costs,
      blocks: state.blocks
    });
    showResults(costs, {
      source: "own", difficulty: state.difficulty, mode: state.mode
    });
  }

  function loadWorkedExample() {
    var first = null;
    SIM.sets.forEach(function (spec) {
      var blocks = simulateSet(spec);
      var costs = costsFrom(blocks);
      state.sets.push({
        label: spec.label,
        source: "Simulated",
        difficulty: spec.difficulty === "easy" ? "Easy (one digit)" : "Hard (digit sum)",
        mode: spec.mode === "respond" ? "Every item" : "Once at the end",
        costs: costs,
        blocks: blocks
      });
      if (!first) { first = costs; }
    });
    showResults(first, { source: "simulated", difficulty: "easy", mode: "respond" });
  }

  function showResults(costs, meta) {
    $("#results-heading").textContent = meta.source === "simulated"
      ? "Where the cost fell — worked example, simulated"
      : "Where the cost fell — your set";
    renderReadout(costs, meta);
    renderResultsProse(costs, meta);
    renderChart(costs);
    renderCostTable(costs, meta);
    renderSetsTable();
    renderExcluded(meta);
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderReadout(costs, meta) {
    clear(costReadout);
    var rows = [
      ["Cost to the letter task", signedMs(costs.letterCost)],
      ["Cost to the number task", signedMs(costs.numberCost)]
    ];
    if (costs.countAlone !== undefined && costs.countAlone !== null) {
      rows.push(["Counting error, numbers alone",
        costs.countAlone + (costs.countAlone === 1 ? " item out" : " items out")]);
      rows.push(["Counting error, both at once",
        (costs.countDual === undefined || costs.countDual === null) ? "—"
          : costs.countDual + (costs.countDual === 1 ? " item out" : " items out")]);
    } else {
      rows.push(["Letter accuracy, alone then both",
        pct(costs.letters.alone && costs.letters.alone.accuracy) + " → " +
        pct(costs.letters.dual && costs.letters.dual.accuracy)]);
      rows.push(["Number accuracy, alone then both",
        pct(costs.numbers.alone && costs.numbers.alone.accuracy) + " → " +
        pct(costs.numbers.dual && costs.numbers.dual.accuracy)]);
    }
    rows.forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      costReadout.appendChild(cell);
    });

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated data (seed " + SIM.sets[0].seed + "): "
      : "Your set: ") +
      "mean correct response time for each task, alone and in combination";

    var sentences = [];
    var lc = costs.letterCost, nc = costs.numberCost;
    if (lc !== null && nc !== null) {
      var bigger = Math.abs(lc) >= Math.abs(nc) ? "letter" : "number";
      var ratio = Math.max(Math.abs(lc), Math.abs(nc)) /
        Math.max(1, Math.min(Math.abs(lc), Math.abs(nc)));
      sentences.push("Both tasks paid: " + signedMs(lc) + " for the letters and " +
        signedMs(nc) + " for the numbers.");
      sentences.push(ratio > 1.5
        ? "The cost is clearly asymmetric — the " + bigger + " task took roughly " +
          ratio.toFixed(1) + " times as much of it. Something decided which task " +
          "to protect, and that decision is as much a finding as the cost itself."
        : "The two costs are of similar size here. A symmetric cost is the " +
          "special case, not the default; with twenty trials a block it is also " +
          "what noise looks like.");
    } else if (lc !== null) {
      sentences.push("The letter task cost " + signedMs(lc) +
        ". In counting mode there is no separate number time in the dual block, " +
        "so the number task's cost has to be read from the counting error instead.");
      if (costs.countAlone !== undefined && costs.countDual !== undefined &&
          costs.countAlone !== null && costs.countDual !== null) {
        sentences.push(costs.countDual > costs.countAlone
          ? "The count was further out when both tasks ran together, which is " +
            "where the number task's share of the cost went."
          : "The count was no worse when both tasks ran together, which — if it " +
            "holds up over more than one block — is what a response-selection " +
            "bottleneck predicts and a general-capacity account does not.");
      }
    } else {
      sentences.push("Not enough usable trials to compute a cost.");
    }
    sentences.push("A cost is a difference from your own baseline. It is not " +
      "comparable with anybody else's number, because it was never referred to " +
      "their baseline.");
    costText.textContent = sentences.join(" ");

    costNote.textContent = meta.source === "simulated"
      ? "Simulated values from a documented generator with fixed seeds, in " +
        "which the asymmetry and the effect of the counting version are both " +
        "set by hand. Not norms, not published effect sizes, not anybody's data."
      : "Your own blocks, in a browser tab, twenty trials each, with block 3 " +
        "always run last. That order inflates the cost, and nothing here " +
        "measures anything about you.";
  }

  function renderResultsProse(costs, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Two simulated sets loaded: one with a response to every number (seed " +
        SIM.sets[0].seed + "), one with the numbers only counted (seed " +
        SIM.sets[1].seed + ")."
      : "Your set: " + BLOCK_TRIALS + " trials in each of three blocks, " +
        (meta.difficulty === "easy" ? "easy" : "hard") + " number task, " +
        (meta.mode === "respond" ? "answered on every item"
          : "counted once at the end") + "."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "Look at the second set. Take away the per-item choice and the " +
        "letter cost falls sharply — which is what a response-selection " +
        "bottleneck predicts and more than a capacity account would. Both " +
        "patterns are built into the generator, so this illustrates the " +
        "argument rather than settling it."));
    } else {
      resultsBody.appendChild(make("p", null,
        "Correct responses between " + ANTICIPATION_MS + " ms and " + LAPSE_MS +
        " ms go into the means. Twenty trials a block is far too few: a cost " +
        "subtracts two noisy means and adds their noise together. Run the " +
        "other setting and compare."));
    }
  }

  function renderChart(costs) {
    var W = 460, H = 220;
    var PAD_L = 120, PAD_R = 54, PAD_T = 28, PAD_B = 38;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    clear(costChart);

    var bars = [
      { label: "Letters alone", value: costs.letters.alone && costs.letters.alone.mean, kind: "alone" },
      { label: "Letters, both", value: costs.letters.dual && costs.letters.dual.mean, kind: "dual" },
      { label: "Numbers alone", value: costs.numbers.alone && costs.numbers.alone.mean, kind: "alone" },
      { label: "Numbers, both", value: costs.numbers.dual && costs.numbers.dual.mean, kind: "dual" }
    ];
    var values = bars.map(function (b) { return b.value; })
      .filter(function (v) { return v !== null && v !== undefined; });
    if (!values.length) {
      svgNode("text", { x: W / 2, y: H / 2, "text-anchor": "middle", class: "chart__axis" },
        costChart).textContent = "No usable response times in this set.";
      return;
    }

    var top = Math.max.apply(null, values) * 1.2;
    var xAt = function (v) { return PAD_L + (v / top) * plotW; };
    var rowH = plotH / bars.length;
    var barH = Math.min(22, rowH * 0.62);

    svgNode("line", { x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH,
      class: "chart__baseline" }, costChart);
    [0, top].forEach(function (v) {
      svgNode("text", { x: xAt(v).toFixed(1), y: H - 20, "text-anchor": "middle",
        class: "chart__axis" }, costChart).textContent = Math.round(v);
    });
    svgNode("text", { x: (PAD_L + plotW / 2).toFixed(1), y: H - 4,
      "text-anchor": "middle", class: "chart__axis" }, costChart)
      .textContent = "Mean correct response time (ms)";
    svgNode("text", { x: PAD_L, y: 14, class: "chart__label" }, costChart)
      .textContent = "Solid = alone · Hatched = both at once";

    bars.forEach(function (bar, row) {
      var y = PAD_T + row * rowH + (rowH - barH) / 2;
      svgNode("text", { x: PAD_L - 8, y: (y + barH / 2 + 4).toFixed(1),
        "text-anchor": "end", class: "chart__label" }, costChart)
        .textContent = bar.label;

      if (bar.value === null || bar.value === undefined) {
        svgNode("text", { x: PAD_L + 6, y: (y + barH / 2 + 4).toFixed(1),
          class: "chart__count" }, costChart).textContent = "not measured";
        return;
      }

      var width = Math.max(1, xAt(bar.value) - PAD_L);
      svgNode("rect", { x: PAD_L, y: y.toFixed(1), width: width.toFixed(1),
        height: barH, class: "dual__bar--" + bar.kind }, costChart);
      if (bar.kind === "dual") {
        for (var x = PAD_L + 9; x < PAD_L + width - 2; x += 11) {
          svgNode("line", { x1: x.toFixed(1), y1: (y + 1).toFixed(1),
            x2: (x - 7).toFixed(1), y2: (y + barH - 1).toFixed(1),
            class: "dual__hatch" }, costChart);
        }
      }
      svgNode("text", { x: (PAD_L + width + 5).toFixed(1),
        y: (y + barH / 2 + 4).toFixed(1), class: "chart__count" }, costChart)
        .textContent = Math.round(bar.value);
    });
  }

  function renderCostTable(costs, meta) {
    clear(costTable);
    [
      ["Letters", "Alone", costs.letters.alone, null, true],
      ["Letters", "Both at once", costs.letters.dual, costs.letterCost, false],
      ["Numbers", "Alone", costs.numbers.alone, null, true],
      ["Numbers", "Both at once", costs.numbers.dual, costs.numberCost, false]
    ].forEach(function (spec) {
      var cell = spec[2];
      var row = make("tr");
      var head = make("th", null, spec[0]);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, spec[1]));
      row.appendChild(make("td", null, cell ? String(cell.n) : "—"));
      row.appendChild(make("td", null, cell ? pct(cell.accuracy) : "—"));
      row.appendChild(make("td", null, cell ? ms(cell.mean) : "—"));
      row.appendChild(make("td", null, spec[4] ? "baseline" : signedMs(spec[3])));
      costTable.appendChild(row);
    });

    if (meta.mode === "count") {
      var note = make("tr");
      var cellNote = make("td", null,
        "In counting mode the number has no per-item choice response, so its " +
        "accuracy is the counting error rather than a percentage, and in the " +
        "dual block it is on screen for exactly as long as the letter takes.");
      cellNote.setAttribute("colspan", "6");
      note.appendChild(cellNote);
      costTable.appendChild(note);
    }
  }

  function renderSetsTable() {
    clear(setsTable);
    state.sets.forEach(function (set) {
      var row = make("tr");
      var head = make("th", null, set.label);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, set.source));
      row.appendChild(make("td", null, set.difficulty));
      row.appendChild(make("td", null, set.mode));
      row.appendChild(make("td", null, signedMs(set.costs.letterCost)));
      row.appendChild(make("td", null,
        set.costs.numberCost === null
          ? (set.costs.countDual === undefined || set.costs.countDual === null
            ? "—" : "count " + set.costs.countDual + " out")
          : signedMs(set.costs.numberCost)));
      setsTable.appendChild(row);
    });

    var modes = {};
    state.sets.forEach(function (s) { modes[s.mode] = true; });
    setsNote.textContent = Object.keys(modes).length > 1
      ? "Sets from both settings. Compare the letter-cost columns — that is " +
        "the difference bearing on capacity versus bottleneck. It is a " +
        "comparison, not an experiment: order and practice differ too."
      : "Run a set with the other overlap setting to add a row here. Sets are " +
        "kept only in this tab and disappear on reload or reset.";
  }

  function renderExcluded(meta) {
    clear(excludedBody);
    if (meta.source === "simulated") {
      excludedBody.appendChild(make("p", null,
        "The worked example generates only the trials that survived cleaning, " +
        "so there is nothing to exclude. Run a set yourself to fill this in."));
      return;
    }
    var totals = { errors: 0, fast: 0, slow: 0 };
    ["letters", "numbers", "both"].forEach(function (key) {
      var block = state.blocks[key];
      if (!block) { return; }
      totals.errors += block.excluded.errors;
      totals.fast += block.excluded.fast;
      totals.slow += block.excluded.slow;
    });
    excludedBody.appendChild(make("p", null,
      "Errors: " + totals.errors + ". Responses under " + ANTICIPATION_MS +
      " ms: " + totals.fast + ". Responses over " + LAPSE_MS + " ms: " +
      totals.slow + "."));
    excludedBody.appendChild(make("p", null,
      "A response faster than " + ANTICIPATION_MS + " ms cannot be a decision " +
      "about the display, and one slower than " + LAPSE_MS + " ms is a lapse of " +
      "a different kind. Both are kept out of the means and counted here. The " +
      "cut-offs are a documented choice, not a fact about the data."));
    excludedBody.appendChild(make("p", null,
      "Errors are excluded from the time means and reported as accuracy. " +
      "Read both columns: a smaller time cost bought with more errors is not " +
      "a smaller cost."));
  }

  /* =======================================================================
     Buttons and keys
     ===================================================================== */

  Array.prototype.forEach.call(
    letterResponses.querySelectorAll("[data-letter-response]"),
    function (button) {
      button.addEventListener("click", function () {
        answerLetter(button.getAttribute("data-letter-response"));
      });
    });

  var KEYS = { f: "vowel", j: "consonant", d: "odd", k: "even" };

  document.addEventListener("keydown", function (event) {
    if (!state || !state.running) { return; }
    if (event.metaKey || event.ctrlKey || event.altKey) { return; }
    var tag = event.target && event.target.tagName;
    if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") { return; }

    if (event.key === " " || event.key === "Spacebar") {
      if (state.mode === "count" && stage().number && !state.numberDone) {
        event.preventDefault();
        answerNumber("next");
      }
      return;
    }

    var mapped = KEYS[String(event.key).toLowerCase()];
    if (!mapped) { return; }
    event.preventDefault();
    if (mapped === "vowel" || mapped === "consonant") {
      if (stage().letter) { answerLetter(mapped); }
    } else if (stage().number && state.mode === "respond") {
      answerNumber(mapped);
    }
  });

  countForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = parseInt(countInput.value, 10);
    if (isNaN(value) || value < 0) {
      showFeedback(taskFeedback, "caution", "A number is needed.",
        "Give your best count, even if you lost track — “I do not know” is not " +
        "one of the options, and a wrong count is data.");
      countInput.focus();
      return;
    }
    completeBlock(value);
  });

  startBlock.addEventListener("click", function () {
    if (state.setDone) { return; }
    cancelPending();
    beginBlock();
  });

  stopButton.addEventListener("click", stopBlock);

  restartSet.addEventListener("click", function () {
    cancelPending();
    state.stageIndex = 0;
    state.setDone = false;
    state.blocks = {};
    state.running = false;
    countForm.hidden = true;
    taskFeedback.hidden = true;
    numberDisplay.textContent = "";
    letterDisplay.textContent = "";
    displayCaption.textContent = "New set. Block 1 is letters alone.";
    letterResponses.hidden = false;
    numberResponses.hidden = true;
    paintStageTrack();
    updateTaskText();
    idleControls();
    shell.announce("New set started. Block 1 is letters alone.", { immediate: true });
  });

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.running = false;
    countForm.hidden = true;
    displayCaption.textContent =
      "Worked example loaded below. The laboratory is still available.";
    loadWorkedExample();
    shell.announce("Worked example loaded: two simulated sets with fixed seeds.",
      { immediate: true });
  });

  difficultySelect.addEventListener("change", function () {
    state.difficulty = difficultySelect.value;
    updateTaskText();
  });

  modeSelect.addEventListener("change", function () {
    state.mode = modeSelect.value;
    renderNumberResponses();
    updateTaskText();
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    both: {
      tone: "good", verdict: "Usually both, and rarely equally.",
      text: "Responses slow down and errors creep up, and the two tasks almost " +
        "never pay the same amount. Watch which one you protected — that " +
        "asymmetry is the part worth explaining."
    },
    speed: {
      tone: "caution", verdict: "Often mostly true, and worth checking.",
      text: "People frequently trade accuracy for time rather than the other " +
        "way round, so the time cost is the visible one. But look at both " +
        "columns: a time cost that came with more errors is bigger than it looks."
    },
    accuracy: {
      tone: "caution", verdict: "The less common pattern.",
      text: "It happens when a task is paced from outside and there is no room " +
        "to slow down. Here nothing is timed out, so slowing down is available — " +
        "and that is usually what people do."
    },
    neither: {
      tone: "caution", verdict: "Almost never, even for very easy tasks.",
      text: "Two tasks this simple still interfere. The cost is not about " +
        "difficulty in any everyday sense. Run the blocks and see how large it is."
    }
  };

  function unlockLab(message) {
    idleControls();
    displayCaption.textContent = "Ready. Block 1 is letters alone.";
    updateTaskText();
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
    unlockLab("Laboratory unlocked. Block 1 is letters alone.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The laboratory is unlocked. From the front, the worked example shows " +
      "both settings side by side without anybody performing anything.");
    lockForm(openingForm);
    unlockLab("Prediction skipped. Laboratory unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "slower",
      text: "When the two tasks are combined, both of them slow down.",
      answer: "both",
      why: "Both families predict this, which is why it settles nothing on its " +
        "own. It is also the finding people most often treat as decisive."
    },
    {
      id: "response",
      text: "The cost nearly disappears when the second task no longer needs a choice response to each item, even though its stimulus still has to be read and remembered.",
      answer: "bottleneck",
      why: "This is the manipulation that separates them. If the shared " +
        "resource were general, reading and holding the number would still cost " +
        "plenty. If the bottleneck is response selection specifically, removing " +
        "the choice removes most of the problem."
    },
    {
      id: "difficulty",
      text: "Making the second task harder to work out — without changing what response it needs — increases the cost to the first task.",
      answer: "capacity",
      why: "A strict response-selection bottleneck predicts little effect, " +
        "because the bottleneck stage has not changed. A shared pool predicts " +
        "exactly this. In practice both effects turn up, which is why hybrid " +
        "accounts exist."
    },
    {
      id: "practice",
      text: "After a great deal of practice on this particular pair of tasks, the cost becomes very small.",
      answer: "both",
      why: "Capacity accounts say the tasks became less demanding; bottleneck " +
        "accounts say the response mapping became direct enough to bypass the " +
        "serial stage. Both survive. What neither predicts is that the " +
        "improvement should transfer to a different pair of tasks — and it " +
        "largely does not."
    },
    {
      id: "trait",
      text: "One student's cost was 90 ms and another's was 260 ms, so the first is the better multitasker.",
      answer: "neither",
      why: "Three problems before you reach the theories. The two costs were " +
        "never referred to a common baseline; a difference between two noisy " +
        "means from twenty trials is mostly noise; and dual-task costs are " +
        "specific to the task pair, so “multitasker” names a trait the design " +
        "never measured."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["capacity", "A general-capacity account"],
    ["bottleneck", "A structural bottleneck"],
    ["both", "Both — it does not separate them"],
    ["neither", "Neither — the data cannot support it"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_ITEMS.forEach(function (item) {
      var row = make("tr");
      var head = make("th", null, item.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var cell = make("td");
      var select = make("select");
      select.id = "account-" + item.id;
      var label = make("label", "visually-hidden",
        "What does this finding favour: " + item.text);
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      cell.appendChild(label);
      cell.appendChild(select);
      cell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(cell);
      challengeRows.appendChild(row);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0, right = 0;
    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#account-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each finding, ask whether it is about how " +
        "much processing is going on, or about one stage having to wait.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "Two of these five separate the accounts and two do not. Being able to " +
      "say which is which is more useful than knowing which account is " +
      "currently favoured — and most working models now contain elements of " +
      "both.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_ITEMS.length + " correct.", { immediate: true });
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
    cancelPending();
    state = {
      stageIndex: 0,
      setDone: false,
      running: false,
      index: 0,
      queue: [],
      trials: [],
      blocks: {},
      sets: [],
      current: null,
      shownAt: 0,
      letterDone: true,
      numberDone: true,
      letterRt: null,
      numberRt: null,
      letterCorrect: null,
      numberCorrect: null,
      oddSeen: 0,
      difficulty: "easy",
      mode: "respond"
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    countForm.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "Where the cost fell";

    clear(costReadout);
    clear(costTable);
    clear(setsTable);
    clear(costChart);
    clear(resultsBody);
    clear(excludedBody);
    costText.textContent = "";
    costNote.textContent = "";
    setsNote.textContent = "";

    difficultySelect.value = "easy";
    modeSelect.value = "respond";
    difficultySelect.disabled = true;
    modeSelect.disabled = true;
    startBlock.disabled = true;
    stopButton.disabled = true;
    restartSet.disabled = true;

    numberDisplay.textContent = "";
    letterDisplay.textContent = "";
    letterResponses.hidden = false;
    numberResponses.hidden = true;
    renderNumberResponses();
    setRowEnabled(letterResponses, false);
    displayCaption.textContent =
      "Answer the question above to unlock the laboratory.";
    taskText.textContent = "Answer the question above to unlock this.";
    startBlock.textContent = "Run block 1";

    paintStageTrack();
    renderChallenge();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Nothing is timed out and nothing animates. Both single-task " +
    "blocks come first, because a dual-task cost is a difference from a " +
    "baseline.",
    { immediate: true });
})();
