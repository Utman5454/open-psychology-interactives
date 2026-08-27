/* =========================================================================
   What Got Through — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/07-dichotic-listening-selection/

   TEACHING JOB
   ------------
   Whether something from an ignored channel gets through depends on what is
   being asked of it: a physical change is usually caught, and the meaning
   usually is not. That single contrast is what the selection theories were
   built to explain.

   WHAT IS PRESERVED
   -----------------
   The performed two-stream task, and the two probes that come after it. The
   probes must stay in this order and must both be asked before either is
   answered against, because the whole point is that the same ignored words
   yield two different answers.

   THE TASK
   --------
       24 pairs, one pair every PAIR_MS
       left  (attended)  common nouns, five of which are colour words
       right (ignored)   all from one category, and from pair SWITCH_AT
                         onwards they are in capitals

   The attended task is a target-detection load rather than a decorative
   instruction: without something to do, "ignore the right column" is not a
   task and nothing is being divided. The hit rate is reported so a learner
   can see whether they were in fact attending, and a poor hit rate makes
   their probe answers uninterpretable rather than wrong.

   WHY THE PHYSICAL CHANGE IS A CASE CHANGE
   ----------------------------------------
   It has to be something with no meaning attached, detectable without any
   word having been recognised. Case does that. A change of colour would do
   it too but would put the whole demonstration behind colour vision.

   HONEST LIMITATION, STATED ON THE PAGE
   -------------------------------------
   This is a visual analogue. Dichotic listening works because two speech
   streams into two ears genuinely cannot both be followed; two columns of
   text can be sampled, however hard someone tries not to. The visual version
   therefore understates the effect, and the caution says so first rather than
   last.

   A SKIP ROUTE
   ------------
   Reading two columns at once is not available to everyone, and a screen
   reader necessarily serialises them, which destroys the manipulation. Skip
   the task goes straight to the finding and the explanation, neither of which
   depends on having performed it.

   WHAT WAS REDUCED
   ----------------
   The harder attended task used to shift the pattern, the naive first trial,
   the simulated class data and the theory-by-theory prediction table.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var PAIR_MS = 950;
  var SWITCH_AT = 14;          /* the ignored column goes to capitals here */
  var LEAD_IN_MS = 900;

  /* Left column: the attended stream. Five colour words are the targets. */
  var LEFT_WORDS = [
    "table", "GREEN", "river", "pencil", "window", "BROWN", "ladder",
    "garden", "PURPLE", "bottle", "corner", "market", "YELLOW", "island",
    "silver", "candle", "ORANGE", "picture", "meadow", "kitchen",
    "harbour", "monkey", "tunnel", "blanket"
  ];
  /* Right column: the ignored stream. Every word is a kitchen thing. */
  var RIGHT_WORDS = [
    "kettle", "saucer", "spatula", "colander", "teapot", "ladle", "whisk",
    "grater", "skillet", "tureen", "sieve", "trivet", "cleaver", "ramekin",
    "peeler", "corkscrew", "steamer", "mandoline", "decanter", "griddle",
    "casserole", "chopstick", "tongs", "funnel"
  ];
  /* Nine characters is the ceiling. At 34 units in a 600-unit viewBox, a
     longer word set in capitals runs off the right-hand edge of the field,
     which shows up as content outside the panel at middling widths. */
  var TARGET_INDEXES = LEFT_WORDS.map(function (w, i) {
    return w === w.toUpperCase() ? i : -1;
  }).filter(function (i) { return i >= 0; });

  var PROBE_ONE = [
    { key: "same", label: "No, it stayed the same throughout" },
    { key: "caps", label: "Yes, it changed to capital letters" },
    { key: "colour", label: "Yes, it changed colour" },
    { key: "speed", label: "Yes, it started arriving faster" }
  ];
  var PROBE_TWO = [
    { key: "kitchen", label: "Things you find in a kitchen" },
    { key: "animals", label: "Animals" },
    { key: "body", label: "Parts of the body" },
    { key: "weather", label: "Weather" }
  ];

  var streams = document.getElementById("streams");
  var streamsDesc = document.getElementById("streams-desc");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var hit = document.getElementById("hit");
  var skip = document.getElementById("skip");
  var runActions = document.getElementById("run-actions");
  var probes = document.getElementById("probes");
  var probeTwo = document.getElementById("probe-two");
  var optionsOne = document.getElementById("options-one");
  var optionsTwo = document.getElementById("options-two");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var setupNote = document.getElementById("setup-note");
  var resultLead = document.getElementById("result-lead");
  var readout = document.getElementById("readout");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var pair = -1;
  var timer = null;
  var running = false;
  var hits = 0, falseHits = 0, respondedThisPair = false;
  var answerOne = null, answerTwo = null;
  var skipped = false;

  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }

  /* --- Drawing ---------------------------------------------------------- */

  function drawPair(i) {
    wb.clearFigure(streams);
    if (i < 0 || i >= LEFT_WORDS.length) {
      var msg = svg("text", {
        x: 300, y: 108, "text-anchor": "middle", fill: "#E9EDF3",
        "font-size": "22", "font-weight": "700"
      });
      msg.textContent = i < 0 ? "Ready when you are." : "Finished.";
      streams.appendChild(msg);
      streamsDesc.textContent = i < 0
        ? "Nothing is showing yet."
        : "The streams have finished.";
      return;
    }
    streams.appendChild(svg("line", {
      x1: 300, y1: 30, x2: 300, y2: 170,
      stroke: "#3D4650", "stroke-width": 2
    }));
    var left = svg("text", {
      x: 250, y: 112, "text-anchor": "end", fill: "#FFFFFF",
      "font-size": "34", "font-weight": "800"
    });
    left.textContent = LEFT_WORDS[i];
    streams.appendChild(left);
    var word = RIGHT_WORDS[i];
    var right = svg("text", {
      x: 350, y: 112, "text-anchor": "start", fill: "#9AA6B4",
      "font-size": "34", "font-weight": "600"
    });
    right.textContent = i >= SWITCH_AT ? word.toUpperCase() : word;
    streams.appendChild(right);
    /* The description gives the attended word only. Reading out the ignored
       one would hand a screen-reader user the answer to the second probe. */
    streamsDesc.textContent = "Left word: " + LEFT_WORDS[i] +
      ". A word is also showing on the right, which you are ignoring.";
  }

  /* --- Running ---------------------------------------------------------- */

  function tick() {
    pair += 1;
    if (pair >= LEFT_WORDS.length) { finish(); return; }
    respondedThisPair = false;
    drawPair(pair);
    counter.textContent = "Pair " + (pair + 1) + " of " + LEFT_WORDS.length + ".";
    timer = window.setTimeout(tick, PAIR_MS);
  }

  function begin() {
    running = true;
    pair = -1;
    hits = 0; falseHits = 0;
    start.hidden = true;
    skip.hidden = true;
    hit.hidden = false;
    wb.progress.set(0);
    counter.textContent = "Starting.";
    wb.announce("Starting. Press the button whenever the left word is a colour.");
    timer = window.setTimeout(tick, LEAD_IN_MS);
  }

  function press() {
    if (!running || respondedThisPair || pair < 0 || pair >= LEFT_WORDS.length) { return; }
    respondedThisPair = true;
    if (TARGET_INDEXES.indexOf(pair) >= 0) { hits += 1; } else { falseHits += 1; }
  }

  function finish() {
    running = false;
    clearTimer();
    drawPair(LEFT_WORDS.length);
    hit.hidden = true;
    counter.textContent = "";
    wb.progress.set(1);
    stepLabel.textContent = "Two questions";
    taskHeading.textContent = "Now, about the column you were ignoring";
    taskLead.textContent = "You caught " + hits + " of the " +
      TARGET_INDEXES.length + " colour words on the left" +
      (falseHits > 0 ? ", with " + falseHits + " presses on other words" : "") +
      ". Two questions follow, and it matters that you answer the first before " +
      "you see the second.";
    setupNote.hidden = true;
    buildOptions(optionsOne, PROBE_ONE, chooseOne);
    wb.show("#probes");
    wb.scrollTo("#probes");
    wb.announce("Streams finished. Two questions about the ignored column.");
  }

  function buildOptions(box, list, handler) {
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = box === optionsOne
      ? "Did the right-hand column change?"
      : "What were the right-hand words about?";
    box.appendChild(legend);
    list.forEach(function (opt) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-key", opt.key);
      button.textContent = opt.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        handler(opt.key);
      });
      box.appendChild(button);
    });
  }

  function chooseOne(key) {
    answerOne = key;
    Array.prototype.forEach.call(optionsOne.querySelectorAll("[data-choice]"), function (node) {
      wb.choices.mark(node, node.getAttribute("data-key") === key ? "chosen" : null);
    });
    wb.choices.lock(optionsOne);
    buildOptions(optionsTwo, PROBE_TWO, chooseTwo);
    wb.show("#probe-two");
    wb.scrollTo("#probe-two");
    wb.announce("Answer recorded. Second question.");
  }

  function chooseTwo(key) {
    answerTwo = key;
    Array.prototype.forEach.call(optionsTwo.querySelectorAll("[data-choice]"), function (node) {
      wb.choices.mark(node, node.getAttribute("data-key") === key ? "chosen" : null);
    });
    wb.choices.lock(optionsTwo);
    report();
  }

  /* --- Result ----------------------------------------------------------- */

  function report() {
    wb.progress.markAllDone();
    stepLabel.textContent = "What got through";
    taskHeading.textContent = "Both questions answered";
    taskLead.textContent = "The answers are below.";

    var caughtChange = answerOne === "caps";
    var caughtMeaning = answerTwo === "kitchen";

    readout.textContent = "";
    tile("The physical change",
      caughtChange ? "caught" : "missed",
      caughtChange
        ? "you noticed the right column switch to capitals"
        : "the right column switched to capitals at pair " + (SWITCH_AT + 1));
    tile("The meaning",
      caughtMeaning ? "caught" : "missed",
      caughtMeaning
        ? "every ignored word was a kitchen thing, and you had it"
        : "every ignored word was a kitchen thing");
    tile("Your attended task",
      skipped ? "not run" : hits + " of " + TARGET_INDEXES.length,
      skipped ? "you skipped the task" : "colour words caught on the left");

    resultLead.textContent = verdict(caughtChange, caughtMeaning);

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Both questions answered. The result is below.");
  }

  /* Which of the five readings the two answers add up to. Split out so that
     report() stays "show the tiles and reveal the panel" while this stays
     "decide what the result means". The wording is the teaching here, so each
     reading is written once and chosen, never assembled from fragments. */
  function verdict(caughtChange, caughtMeaning) {
    if (skipped) {
      return "You did not run the task, which is fine: nothing below depends on " +
        "having done it. The right-hand column contained nothing but kitchen " +
        "things, and from pair " + (SWITCH_AT + 1) + " onwards every one of " +
        "them was in capitals. In a room of people who have just done this, " +
        "most notice the change in capitals and most cannot say what the words " +
        "were about.";
    }
    if (caughtChange && !caughtMeaning) {
      return "This is the usual pattern, and it is the one the whole argument was " +
        "built on. You caught the change in how the ignored words looked and " +
        "you could not say what they were about, even though every one of them " +
        "was a kitchen thing and you looked straight at all twenty-four.";
    }
    if (!caughtChange && !caughtMeaning) {
      return "Neither got through this time. The ignored column switched to capitals " +
        "at pair " + (SWITCH_AT + 1) + " and every word in it was a kitchen " +
        "thing. That is a stronger result than the usual one, not a worse one: " +
        "with only one trial it may simply mean you were attending very " +
        "closely to the left.";
    }
    if (caughtMeaning && !caughtChange) {
      return "The unusual way round: you have the category and not the change in " +
        "capitals. Worth being sceptical of your own answer here, since with " +
        "four options a guess is right one time in four, and kitchen things " +
        "are a natural guess.";
    }
    return "You have both. That happens, and it usually means the left-hand task " +
      "was not occupying you fully" +
      (hits < TARGET_INDEXES.length
        ? ", although you did miss " + (TARGET_INDEXES.length - hits) +
          " of the colour words, so it was occupying you somewhat."
        : ".") +
      " The interesting question is not whether an ignored channel can ever " +
      "be reported, but what it takes to stop it being reported.";
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);
  }

  /* --- Wiring ----------------------------------------------------------- */

  start.addEventListener("click", begin);
  hit.addEventListener("click", press);

  document.addEventListener("keydown", function (event) {
    if (!running) { return; }
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      press();
    }
  });

  skip.addEventListener("click", function () {
    clearTimer();
    skipped = true;
    running = false;
    answerOne = null; answerTwo = null;
    start.hidden = true; hit.hidden = true; skip.hidden = true;
    setupNote.hidden = true;
    drawPair(LEFT_WORDS.length);
    report();
  });

  function doReset() {
    clearTimer();
    running = false; skipped = false;
    pair = -1; hits = 0; falseHits = 0;
    answerOne = null; answerTwo = null;
    wb.choices.clear(optionsOne);
    wb.choices.clear(optionsTwo);
    optionsOne.textContent = "";
    optionsTwo.textContent = "";
    wb.hide("#probes");
    wb.hide("#probe-two");
    wb.hide("#synthesis");
    setupNote.hidden = false;
    start.hidden = false; hit.hidden = true; skip.hidden = false;
    stepLabel.textContent = "The task";
    taskHeading.textContent = "Watch the left column. Ignore the right one.";
    taskLead.innerHTML = "Two words will appear at a time, one on each side, " +
      "about one pair a second. Your job concerns the <strong>left</strong> " +
      "column only: press the button, or the space bar, every time the left " +
      "word is a <strong>colour</strong>. Ignore the right column entirely. " +
      "There is nothing you need to do with it.";
    counter.textContent = "";
    wb.progress.reset();
    drawPair(-1);
  }

  wb.onReset(doReset);
  drawPair(-1);
})();
