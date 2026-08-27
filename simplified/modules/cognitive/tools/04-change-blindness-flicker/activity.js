/* =========================================================================
   Change Blindness — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/04-change-blindness-flicker/

   TEACHING JOB
   ------------
   A blank moment between two pictures destroys the local signal that a change
   normally produces, and without that signal a large obvious change becomes
   very hard to find.

   WHAT IS PRESERVED
   -----------------
   The flicker paradigm itself, performed, and the with-blank against
   no-blank comparison that is the whole argument.

       with the blank      A, blank, A-prime, blank, ...
       without the blank   A, A-prime, A, A-prime, ...

   TWO SCENES, NOT ONE: A DELIBERATE DEPARTURE
   -------------------------------------------
   The original runs the SAME scene both ways, and says in its own notes that
   this is the one comparison the design supports. It is a fine classroom
   demonstration, because most people fail with the blank and the reveal lands
   anyway. But anyone who does find the change with the blank on then searches
   the second run already knowing the answer, and the no-blank time is fast
   for the wrong reason. Using a second scene costs nothing pedagogically, the
   shock is identical, and the comparison becomes honest. The caution says
   this is what was done and why.

   PACING AND SAFETY
   -----------------
   600 ms per picture and 250 ms of blank is about 1.2 alternations a second,
   well below the 3 Hz associated with photosensitive seizures, and nothing is
   bright or high contrast. A manual route is always available and is the
   route for anyone who has asked for reduced motion: it is offered to
   everybody rather than hidden behind a media query, because it is also the
   better way to inspect the scene once you have given up.

   VERIFYING THE FIND
   ------------------
   Pressing "I can see the change" stops the clock, and then the learner has
   to say which object it was. Without that step the recorded time measures
   confidence rather than detection. The options are the object names, so this
   is verification of a search that has already happened, not a quiz.

   WHAT WAS REDUCED
   ----------------
   The bank of scenes, the controls over what changes and where, and the
   comparison table across every run.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var VIEW_MS = 600;
  var BLANK_MS = 250;
  var GIVE_UP_AFTER_MS = 40000;

  var INK = {
    sky: "#DCEAF4", road: "#5F6878", kerb: "#B9C2CC",
    brick: "#9E7318", stone: "#8A94A6", roof: "#1A2744",
    litWindow: "#FFD166", darkWindow: "#3D5A80",
    leaf: "#2E7D5B", trunk: "#6B4A2F",
    carA: "#C0434F", carB: "#1C7293", cloud: "#FFFFFF", sign: "#2E7D5B"
  };

  /* --- The two scenes ---------------------------------------------------
     Each part carries a name, because the name is what the learner picks
     from and what a screen reader is given. Exactly one part differs between
     variant a and variant b. */

  function building(x, w, h, colour, windows) {
    var parts = [{ tag: "rect", attrs: { x: x, y: 300 - h, width: w, height: h, fill: colour } }];
    parts.push({ tag: "rect", attrs: { x: x - 6, y: 300 - h - 12, width: w + 12, height: 12, fill: INK.roof } });
    windows.forEach(function (win) {
      parts.push({ tag: "rect", attrs: {
        x: x + win.dx, y: 300 - h + win.dy, width: 22, height: 26, rx: 2,
        fill: win.lit ? INK.litWindow : INK.darkWindow
      } });
    });
    return parts;
  }

  function tree(x, scale) {
    return [
      { tag: "rect", attrs: { x: x - 5, y: 260, width: 10, height: 40, fill: INK.trunk } },
      { tag: "circle", attrs: { cx: x, cy: 248, r: 30 * scale, fill: INK.leaf } }
    ];
  }

  function car(x, colour) {
    return [
      { tag: "rect", attrs: { x: x, y: 306, width: 78, height: 24, rx: 6, fill: colour } },
      { tag: "rect", attrs: { x: x + 16, y: 292, width: 44, height: 18, rx: 5, fill: colour } },
      { tag: "circle", attrs: { cx: x + 18, cy: 332, r: 8, fill: "#1A2744" } },
      { tag: "circle", attrs: { cx: x + 60, cy: 332, r: 8, fill: "#1A2744" } }
    ];
  }

  function backdrop() {
    return [
      { tag: "rect", attrs: { x: 0, y: 0, width: 600, height: 300, fill: INK.sky } },
      { tag: "rect", attrs: { x: 0, y: 300, width: 600, height: 40, fill: INK.road } },
      { tag: "rect", attrs: { x: 0, y: 296, width: 600, height: 6, fill: INK.kerb } }
    ];
  }

  var SCENES = {
    street: {
      title: "A street with three buildings, two trees, a car and a cloud",
      parts: function (variant) {
        var list = backdrop();
        list = list.concat([{ tag: "ellipse", attrs: { cx: 470, cy: 62, rx: 54, ry: 24, fill: INK.cloud } }]);
        list = list.concat(building(40, 120, 200, INK.brick, [
          { dx: 20, dy: 30, lit: true }, { dx: 74, dy: 30, lit: false },
          { dx: 20, dy: 90, lit: false }, { dx: 74, dy: 90, lit: true }
        ]));
        /* THE CHANGE: the middle building is two storeys taller in variant b. */
        list = list.concat(building(200, 130, variant === "b" ? 250 : 170, INK.stone, [
          { dx: 24, dy: 30, lit: false }, { dx: 80, dy: 30, lit: true },
          { dx: 24, dy: 92, lit: true }, { dx: 80, dy: 92, lit: false }
        ]));
        list = list.concat(building(390, 110, 150, INK.brick, [
          { dx: 18, dy: 26, lit: true }, { dx: 66, dy: 26, lit: true }
        ]));
        list = list.concat(tree(150, 1));
        list = list.concat(tree(360, 0.9));
        /* Parked clear of the middle building, so the ring drawn over that
           building at the reveal cannot be read as ringing the car. */
        list = list.concat(car(95, INK.carA));
        return list;
      },
      answer: "middle",
      options: [
        { key: "left", label: "The left building" },
        { key: "middle", label: "The middle building" },
        { key: "right", label: "The right building" },
        { key: "tree", label: "One of the trees" },
        { key: "car", label: "The car" },
        { key: "cloud", label: "The cloud" }
      ],
      reveal: { x: 194, y: 38, w: 142, h: 268 },
      answerText: "The middle building changed height, by about a third of its own size."
    },
    yard: {
      title: "A yard with two buildings, three trees and two cars",
      parts: function (variant) {
        var list = backdrop();
        list = list.concat([{ tag: "ellipse", attrs: { cx: 130, cy: 56, rx: 46, ry: 22, fill: INK.cloud } }]);
        list = list.concat(building(60, 150, 180, INK.stone, [
          { dx: 26, dy: 30, lit: true }, { dx: 92, dy: 30, lit: false },
          { dx: 26, dy: 96, lit: false }, { dx: 92, dy: 96, lit: true }
        ]));
        list = list.concat(building(330, 160, 210, INK.brick, [
          { dx: 28, dy: 32, lit: false }, { dx: 96, dy: 32, lit: true },
          { dx: 28, dy: 100, lit: true }, { dx: 96, dy: 100, lit: false }
        ]));
        list = list.concat(tree(250, 1));
        list = list.concat(tree(290, 0.8));
        list = list.concat(tree(540, 1.1));
        /* THE CHANGE: the left-hand car is a different colour in variant b. */
        list = list.concat(car(90, variant === "b" ? INK.carB : INK.carA));
        list = list.concat(car(400, INK.carB));
        return list;
      },
      answer: "carleft",
      options: [
        { key: "building", label: "One of the buildings" },
        { key: "carleft", label: "The left-hand car" },
        { key: "carright", label: "The right-hand car" },
        { key: "tree", label: "One of the trees" },
        { key: "cloud", label: "The cloud" },
        { key: "road", label: "The road" }
      ],
      reveal: { x: 82, y: 284, w: 96, h: 60 },
      answerText: "The left-hand car changed colour, from red to blue."
    }
  };

  var ROUNDS = [
    { scene: "street", blank: true, label: "With the blank" },
    { scene: "yard", blank: false, label: "Without the blank" }
  ];

  var scene = document.getElementById("scene");
  var sceneDesc = document.getElementById("scene-desc");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var found = document.getElementById("found");
  var manual = document.getElementById("manual");
  var giveup = document.getElementById("giveup");
  var identify = document.getElementById("identify");
  var identifyLead = document.getElementById("identify-lead");
  var options = document.getElementById("options");
  var verdict = document.getElementById("verdict");
  var verdictText = document.getElementById("verdict-text");
  var nextActions = document.getElementById("next-actions");
  var next = document.getElementById("next");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var resultLead = document.getElementById("result-lead");
  var readout = document.getElementById("readout");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* --- State ------------------------------------------------------------ */

  var roundIndex = 0;
  var frame = 0;
  var running = false;
  var startedAt = 0;
  var timer = null;
  var chosen = null;
  var times = [null, null];
  var solved = [false, false];

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now() : Date.now();
  }
  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }
  function round() { return ROUNDS[roundIndex]; }
  function spec() { return SCENES[round().scene]; }

  /* --- Drawing ---------------------------------------------------------- */

  function drawVariant(variant) {
    wb.clearFigure(scene);
    if (variant === "blank") {
      scene.appendChild(svg("rect", { x: 0, y: 0, width: 600, height: 340, fill: "#FBFAF7" }));
      sceneDesc.textContent = "A blank field between the two versions of the scene.";
      return;
    }
    spec().parts(variant).forEach(function (part) {
      scene.appendChild(svg(part.tag, part.attrs));
    });
    sceneDesc.textContent = spec().title + ". Version " +
      (variant === "a" ? "one" : "two") + " of two. " +
      "Exactly one thing differs between the two versions.";
  }

  function drawReveal() {
    drawVariant("b");
    var r = spec().reveal;
    scene.appendChild(svg("rect", {
      x: r.x, y: r.y, width: r.w, height: r.h, rx: 8,
      fill: "none", stroke: "#C0434F", "stroke-width": 5
    }));
    sceneDesc.textContent = spec().title + ". " + spec().answerText +
      " It is ringed on the picture.";
  }

  /* --- The flicker ------------------------------------------------------ */

  var WITH_BLANK = ["a", "blank", "b", "blank"];
  var NO_BLANK = ["a", "b"];

  function sequence() { return round().blank ? WITH_BLANK : NO_BLANK; }

  function tick() {
    var seq = sequence();
    var which = seq[frame % seq.length];
    drawVariant(which);
    frame += 1;
    timer = window.setTimeout(tick, which === "blank" ? BLANK_MS : VIEW_MS);
  }

  function beginRun() {
    running = true;
    frame = 0;
    startedAt = now();
    start.hidden = true;
    found.hidden = false;
    giveup.hidden = false;
    counter.textContent = "Running. Press the button the moment you can see it.";
    wb.announce(round().blank
      ? "The scene is alternating with a blank in between."
      : "The scene is alternating with no blank in between.");
    tick();
  }

  function stopRun() {
    running = false;
    clearTimer();
  }

  /* --- Identification --------------------------------------------------- */

  function askIdentify(elapsed) {
    stopRun();
    drawVariant("a");
    found.hidden = true;
    giveup.hidden = true;
    manual.hidden = true;
    times[roundIndex] = elapsed;
    counter.textContent = elapsed === null
      ? ""
      : "You pressed after " + (elapsed / 1000).toFixed(1) + " seconds.";
    identifyLead.textContent = elapsed === null
      ? "Before it is shown to you, which one did you think it was?"
      : "Which one was it?";
    buildOptions();
    wb.show("#identify");
    wb.scrollTo("#identify");
    wb.announce("Now say which part of the scene changed.");
  }

  function buildOptions() {
    options.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which part of the scene changed?";
    options.appendChild(legend);
    spec().options.forEach(function (opt) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-key", opt.key);
      button.textContent = opt.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        judge(opt.key);
      });
      options.appendChild(button);
    });
  }

  function judge(key) {
    chosen = key;
    var right = key === spec().answer;
    solved[roundIndex] = right;
    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (node) {
      var k = node.getAttribute("data-key");
      wb.choices.mark(node, k === spec().answer ? "correct" : (k === key ? "incorrect" : null));
    });
    wb.choices.lock(options);
    drawReveal();

    var secs = times[roundIndex] === null ? null : (times[roundIndex] / 1000).toFixed(1);
    if (right) {
      verdictText.textContent = spec().answerText + " You found it" +
        (secs ? " in " + secs + " seconds" : "") + ". " +
        (round().blank
          ? "Notice how long that took for something that large."
          : "Without the blank it announces itself: you did not have to search at all.");
    } else {
      verdictText.textContent = spec().answerText +
        " It is ringed on the picture now. Look at it, then look at what you " +
        "chose instead. Neither was hidden and neither was small.";
    }
    verdict.setAttribute("data-state", right ? "correct" : "incorrect");
    wb.show("#verdict");
    wb.show("#next-actions");
    next.textContent = roundIndex === 0 ? "Now try it without the blank" : "See the comparison";
    wb.announce(spec().answerText);
  }

  /* --- Rounds ----------------------------------------------------------- */

  function setUpRound() {
    stopRun();
    chosen = null;
    frame = 0;
    manual.hidden = false;
    start.hidden = false;
    found.hidden = true;
    giveup.hidden = true;
    wb.hide("#identify");
    wb.hide("#verdict");
    wb.hide("#next-actions");
    wb.progress.set(roundIndex);
    stepLabel.textContent = round().label;
    if (roundIndex === 0) {
      taskHeading.textContent = "Find the one thing that changes";
      taskLead.textContent = "The scene below alternates between two versions " +
        "of itself, with a blank moment in between. Exactly one thing is " +
        "different. Press the button as soon as you can see what it is.";
      counter.textContent = "";
    } else {
      taskHeading.textContent = "The same task, with the blank switched off";
      taskLead.textContent = "A different scene, so that knowing the last " +
        "answer cannot help you, and this time the two versions follow each " +
        "other with no blank in between. Everything else is the same.";
      counter.textContent = "";
    }
    drawVariant("a");
  }

  /* --- Result ----------------------------------------------------------- */

  function report() {
    wb.progress.markAllDone();
    stepLabel.textContent = "The comparison";
    taskHeading.textContent = "Both runs finished";
    taskLead.textContent = "The comparison is below.";
    counter.textContent = "";
    stopRun();

    var withBlank = times[0], without = times[1];
    readout.textContent = "";
    tile("With the blank",
      withBlank === null ? "not found" : (withBlank / 1000).toFixed(1) + " s",
      solved[0] ? "and you identified it correctly" : "and it was not identified correctly");
    tile("Without the blank",
      without === null ? "not found" : (without / 1000).toFixed(1) + " s",
      solved[1] ? "and you identified it correctly" : "and it was not identified correctly");

    resultLead.textContent = comparisonText(withBlank, without);

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Both runs complete. The comparison is below.");
  }

  /* What the pair of times means. Split out so that report() stays "fill the
     tiles and reveal the panel" while this stays "say what the comparison
     shows". Each reading is written once and chosen, never assembled. */
  function comparisonText(withBlank, without) {
    if (withBlank !== null && without !== null && solved[0] && solved[1]) {
      return "You found the change in " + (withBlank / 1000).toFixed(1) +
        " seconds with a blank between the two pictures and " +
        (without / 1000).toFixed(1) + " seconds without one" +
        (without < withBlank
          ? ", which is " + (withBlank / Math.max(0.1, without)).toFixed(1) +
            " times faster."
          : ".") +
        " The changes were of similar size in both scenes. The only thing that " +
        "differed was the quarter of a second of blank.";
    }
    if (!solved[0] && solved[1]) {
      return "You did not find the change with the blank in place, and you found it " +
        "without one" +
        (without !== null ? " in " + (without / 1000).toFixed(1) + " seconds" : "") +
        ". That is the demonstration in its strongest form: the same kind of " +
        "change, the same kind of scene, and the only difference is the blank.";
    }
    return "Compare the two times above. The changes were of similar size in both " +
      "scenes, and the only thing that differed between the runs was the " +
      "quarter of a second of blank between the two pictures.";
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

  start.addEventListener("click", beginRun);

  found.addEventListener("click", function () {
    if (!running && frame === 0) { return; }
    askIdentify(now() - startedAt);
  });

  giveup.addEventListener("click", function () {
    askIdentify(null);
  });

  manual.addEventListener("click", function () {
    stopRun();
    if (startedAt === 0) { startedAt = now(); }
    start.hidden = true;
    found.hidden = false;
    giveup.hidden = false;
    var seq = sequence();
    drawVariant(seq[frame % seq.length]);
    frame += 1;
    counter.textContent = "Stepping by hand. Press again for the next picture. " +
      "Press the other button the moment you can see the change.";
  });

  next.addEventListener("click", function () {
    if (roundIndex === 0) {
      roundIndex = 1;
      setUpRound();
      wb.scrollTo("#task-card");
      wb.announce("Second run. A different scene, and no blank this time.");
      return;
    }
    report();
  });

  /* The give-up button is offered from the start, but after a while the page
     says so out loud rather than leaving someone hunting indefinitely. */
  var nudge = window.setTimeout(function () {
    if (running) {
      counter.textContent = "Still looking? There is no time limit, but " +
        "Show me where it is will end the search whenever you want.";
    }
  }, GIVE_UP_AFTER_MS);

  function doReset() {
    stopRun();
    window.clearTimeout(nudge);
    roundIndex = 0;
    times = [null, null];
    solved = [false, false];
    chosen = null;
    startedAt = 0;
    wb.progress.reset();
    wb.hide("#synthesis");
    setUpRound();
  }

  wb.onReset(doReset);
  setUpRound();
})();
