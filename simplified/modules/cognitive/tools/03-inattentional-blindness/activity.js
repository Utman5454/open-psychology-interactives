/* =========================================================================
   Inattentional Blindness — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/cognitive/tools/03-inattentional-blindness/

   WHAT IS PRESERVED
   -----------------
   The demonstration, intact and in order: a demanding conjunction count on a
   dense STATIC display that also contains an object the learner was never
   asked about, then a recognition question, then the same display again with
   everything marked.

   WHY STATIC, as in the original
   ------------------------------
   The famous versions use video. A video cannot be made accessible to a
   reader who cannot use it, cannot honour a reduced-motion preference, and
   carries a flicker risk this collection will not take. A dense static array
   with a demanding count produces the same phenomenon, is self-paced, and can
   be described in words afterwards.

   THE ONE-SHOT PROBLEM
   --------------------
   A surprise works once, and this file is built around that.

     * Nothing a learner can read before the count mentions a second object.
       Not the hero, not the instructions, not the accessibility note. The
       section that does is hidden until the recognition question is answered,
       so there is nothing to scroll ahead to.
     * Two deterministic variants, each with a fixed seed, so a display is
       identical every time it is drawn and a room can be given the same one.
       They are handed out in order; when both are spent the tool says so.
     * A demonstrator route reveals the whole design for whoever is running
       the session, states plainly that it spoils this screen, and marks the
       session spent.
     * Afterwards the tool says that the reader is no longer a naive observer
       and that a second run demonstrates the design rather than testing them.

   WHAT IS DELIBERATELY ABSENT
   ---------------------------
   Noticing rates. There are no data here on how often people miss these
   objects, and a plausible-looking invented percentage would be worse than no
   percentage at all. Nothing scores the reader, and the feedback after the
   recognition question never says what most people do.

   WHAT WAS REDUCED
   ----------------
   Four variants to two, and with them the table of what each design change
   alters, which is a second teaching job about determinants of noticing. Also
   gone: the optional time limit, the opening prediction and the closing
   challenge. The counting task, the recognition question and the labelled
   replay are the whole activity.

   Displays are generated on a 12 by 7 grid with per-item jitter from a seeded
   generator, so a given variant is byte-identical on every machine.
   Everything is drawn in one colour: shape and fill carry the task, never
   colour. No data leave the browser, and which variants have been used is a
   JavaScript variable that a reload forgets.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var VIEW_W = 640;
  var VIEW_H = 400;
  var GRID_COLS = 12;
  var GRID_ROWS = 7;
  var CELL_W = VIEW_W / GRID_COLS;
  var CELL_H = VIEW_H / GRID_ROWS;
  var JITTER = 6;
  var SHAPE_R = 14;
  var STAR_R = 22;

  /* The counted type is forced to this many, so the count is never trivially
     small and the range the page promises is always true. */
  var TARGET_MIN = 6;
  var TARGET_MAX = 10;

  var SHAPES = ["triangle-down", "triangle-up", "square", "circle"];

  var VARIANTS = [
    { key: "A", seed: 20260901, items: 48 },
    { key: "B", seed: 20260902, items: 72 }
  ];

  var SVG_NS = "http://www.w3.org/2000/svg";

  /* --- Elements -------------------------------------------------------- */

  var stepLabel = document.getElementById("step-label");
  var taskLead = document.getElementById("task-lead");
  var stageMessage = document.getElementById("stage-message");
  var display = document.getElementById("display");
  var displayDesc = document.getElementById("display-desc");
  var entry = document.getElementById("entry");
  var countInput = document.getElementById("count");
  var countError = document.getElementById("count-error");
  var submit = document.getElementById("submit");
  var recognition = document.getElementById("recognition");
  var recognitionOptions = document.getElementById("recognition-options");
  var reveal = document.getElementById("reveal");
  var startButton = document.getElementById("start");
  var demonstrator = document.getElementById("demonstrator");
  var replay = document.getElementById("replay");
  var replayDesc = document.getElementById("replay-desc");
  var resultLead = document.getElementById("result-lead");

  var used = [];
  var current = null;
  var reported = null;

  /* --- Seeded generation ----------------------------------------------- */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Lay out one display. Cells are chosen from a shuffled grid, the counted
   * type is forced to a known number, and the unasked-for object takes a free
   * cell away from the middle: an object at the point of fixation would be a
   * different demonstration.
   */
  function buildDisplay(variant) {
    var random = mulberry32(variant.seed);

    var cells = [];
    var col = 0;
    while (col < GRID_COLS) {
      var row = 0;
      while (row < GRID_ROWS) {
        cells.push({ col: col, row: row });
        row += 1;
      }
      col += 1;
    }

    /* Fisher-Yates on the seeded stream. */
    var i = cells.length - 1;
    while (i > 0) {
      var j = Math.floor(random() * (i + 1));
      var swap = cells[i];
      cells[i] = cells[j];
      cells[j] = swap;
      i += 1 - 2;
    }

    var targetCount = TARGET_MIN + Math.floor(random() * (TARGET_MAX - TARGET_MIN + 1));
    var chosen = cells.slice(0, variant.items);
    var items = [];

    chosen.forEach(function (cell, index) {
      var isTarget = index < targetCount;
      var shape;
      var solid;

      if (isTarget) {
        shape = "triangle-down";
        solid = true;
      } else {
        /* Anything except another solid down-pointing triangle, or the count
           stops being the number the page reports. */
        do {
          shape = SHAPES[Math.floor(random() * SHAPES.length)];
          solid = random() < 0.5;
        } while (shape === "triangle-down" && solid);
      }

      items.push({
        shape: shape,
        solid: solid,
        x: cell.col * CELL_W + CELL_W / 2 + (random() - 0.5) * 2 * JITTER,
        y: cell.row * CELL_H + CELL_H / 2 + (random() - 0.5) * 2 * JITTER,
        target: isTarget
      });
    });

    /* A free cell, not in the middle two columns or the middle row. */
    var free = cells.slice(variant.items).filter(function (cell) {
      return (cell.col < 3 || cell.col > GRID_COLS - 4) &&
             (cell.row < 2 || cell.row > GRID_ROWS - 3);
    });
    var starCell = free.length ? free[Math.floor(random() * free.length)] : cells[cells.length - 1];

    return {
      variant: variant,
      items: items,
      targetCount: targetCount,
      star: {
        x: starCell.col * CELL_W + CELL_W / 2,
        y: starCell.row * CELL_H + CELL_H / 2
      }
    };
  }

  /* --- Rendering ------------------------------------------------------- */

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function shapeNode(item) {
    var fill = item.solid ? "#1A2744" : "none";
    var common = { fill: fill, stroke: "#1A2744", "stroke-width": 2 };

    if (item.shape === "circle") {
      return svg("circle", merge(common, { cx: item.x.toFixed(1), cy: item.y.toFixed(1), r: SHAPE_R }));
    }
    if (item.shape === "square") {
      return svg("rect", merge(common, {
        x: (item.x - SHAPE_R).toFixed(1), y: (item.y - SHAPE_R).toFixed(1),
        width: SHAPE_R * 2, height: SHAPE_R * 2, rx: 2
      }));
    }
    var up = item.shape === "triangle-up";
    var points = up
      ? [[item.x, item.y - SHAPE_R], [item.x + SHAPE_R, item.y + SHAPE_R], [item.x - SHAPE_R, item.y + SHAPE_R]]
      : [[item.x, item.y + SHAPE_R], [item.x + SHAPE_R, item.y - SHAPE_R], [item.x - SHAPE_R, item.y - SHAPE_R]];
    return svg("polygon", merge(common, {
      points: points.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ")
    }));
  }

  function starNode(star) {
    var points = [];
    var k = 0;
    while (k < 10) {
      var radius = k % 2 === 0 ? STAR_R : STAR_R * 0.42;
      var angle = (Math.PI / 5) * k - Math.PI / 2;
      points.push(
        (star.x + radius * Math.cos(angle)).toFixed(1) + "," +
        (star.y + radius * Math.sin(angle)).toFixed(1)
      );
      k += 1;
    }
    return svg("polygon", {
      points: points.join(" "), fill: "none", stroke: "#1A2744", "stroke-width": 2
    });
  }

  function merge(a, b) {
    var out = {};
    Object.keys(a).forEach(function (key) { out[key] = a[key]; });
    Object.keys(b).forEach(function (key) { out[key] = b[key]; });
    return out;
  }

  function paint(target, data, marked) {
    wb.clearFigure(target);
    target.setAttribute("viewBox", "0 0 " + VIEW_W + " " + VIEW_H);

    data.items.forEach(function (item) {
      target.appendChild(shapeNode(item));
      if (marked && item.target) {
        target.appendChild(svg("circle", {
          cx: item.x.toFixed(1), cy: item.y.toFixed(1), r: SHAPE_R + 7,
          fill: "none", stroke: "#2F7D69", "stroke-width": 2.5
        }));
      }
    });

    target.appendChild(starNode(data.star));

    /* Markings only. No text is drawn inside the display, in either phase:
       a caption placed near the object landed on the shapes around it, and
       the explanation belongs outside the stimulus anyway. Solid rings for
       the counted shapes, a larger dashed ring for the other object, so the
       two are told apart by line style rather than by colour. */
    if (marked) {
      target.appendChild(svg("circle", {
        cx: data.star.x.toFixed(1), cy: data.star.y.toFixed(1), r: STAR_R + 10,
        fill: "none", stroke: "#C0434F", "stroke-width": 3, "stroke-dasharray": "6 4"
      }));
    }
  }

  /* --- Steps ----------------------------------------------------------- */

  function nextVariant() {
    var free = VARIANTS.filter(function (variant) {
      return used.indexOf(variant.key) === -1;
    });
    return free.length ? free[0] : null;
  }

  function showDisplay() {
    var variant = nextVariant();

    if (!variant) {
      stageMessage.textContent =
        "Both displays in this session have been used. Reload the page for a fresh start.";
      wb.show(stageMessage);
      wb.announce("No unused display left in this session. Reload the page for a fresh start.");
      return;
    }

    used.push(variant.key);
    current = buildDisplay(variant);
    reported = null;

    displayDesc.textContent =
      "A static array of " + current.items.length + " outlined and filled shapes: " +
      "circles, squares and triangles pointing up or down, scattered on a grid. " +
      "Count the triangles that point downwards and are filled in.";

    document.getElementById("instruction-line").textContent =
      "Count the solid down-pointing triangles";
    document.getElementById("instruction-detail").textContent =
      "Both things have to be true: pointing downwards, and filled in. " +
      "Ignore every other shape. Take as long as you like.";

    paint(display, current, false);
    wb.hide(stageMessage);
    wb.show(display);
    wb.show(entry);
    wb.hide(startButton);
    countInput.value = "";
    wb.hide(countError);
    wb.progress.set(0);
    countInput.focus();
    wb.announce("Display shown. Count the solid down-pointing triangles. There is no time limit.");
  }

  submit.addEventListener("click", function () {
    var value = Number(countInput.value);

    if (countInput.value === "" || isNaN(value) || value < 0 || value > 99 ||
        Math.floor(value) !== value) {
      wb.show(countError);
      countInput.focus();
      return;
    }

    wb.hide(countError);
    reported = value;

    wb.hide(display);
    wb.hide(entry);
    stageMessage.textContent = "Display hidden.";
    wb.show(stageMessage);

    wb.hide(document.getElementById("instruction"));
    stepLabel.textContent = "One question";
    taskLead.textContent =
      "Your count is recorded. Before the display comes back, one question " +
      "about what was on it.";
    renderRecognition();
    wb.show(recognition);
    wb.progress.set(1);
    wb.announce("Count recorded. One question about the display.");
  });

  function renderRecognition() {
    recognitionOptions.textContent = "";

    [
      ["yes", "Yes", "There was something else on the display."],
      ["no", "No", "Only the shapes I was counting and the other shapes."]
    ].forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", option[0]);

      var strong = document.createElement("strong");
      strong.textContent = option[1];
      var span = document.createElement("span");
      span.textContent = option[2];

      button.appendChild(strong);
      button.appendChild(span);
      button.addEventListener("click", function () {
        answer(option[0]);
      });
      recognitionOptions.appendChild(button);
    });

    var prompt = document.getElementById("recognition-prompt");
    prompt.textContent =
      "Apart from the shapes, was there anything else on that display?";
  }

  /**
   * There is no correct answer here. It is a report, not a test, and nothing
   * is marked. The feedback also never says what most people do, because this
   * collection has no data on that and an invented figure would be worse than
   * none.
   */
  function answer(choice) {
    wb.choices.lock(recognitionOptions);
    Array.prototype.forEach.call(recognitionOptions.children, function (button) {
      if (button.getAttribute("data-choice") === choice) {
        wb.choices.mark(button, "chosen", { note: "This is the answer you gave." });
      }
    });

    reveal.textContent = "";
    var line = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = choice === "yes"
      ? "You reported something else."
      : "You reported nothing else.";
    line.appendChild(strong);
    var body = document.createElement("p");
    body.className = "small";
    body.textContent = choice === "yes"
      ? "There was. It is ringed in the display below, which is the same one you were just looking at."
      : "There was. It is ringed in the display below, which is the same one you were just looking at. It was there the whole time, it did not move, and there was no time limit.";
    reveal.appendChild(line);
    reveal.appendChild(body);
    wb.show(reveal);

    finish();
  }

  function finish() {
    stepLabel.textContent = "The display again";
    wb.progress.markAllDone();

    paint(replay, current, true);
    replayDesc.textContent =
      "The same array of " + current.items.length + " shapes, with no text on " +
      "it. The " + current.targetCount + " solid down-pointing triangles are " +
      "each ringed with a solid line. A five-pointed outlined star, which was " +
      "on the display throughout and was never mentioned, is ringed with a " +
      "larger dashed line.";

    var accuracy = reported === null
      ? ""
      : reported === current.targetCount
        ? "Your count was " + reported + ", which is right."
        : "Your count was " + reported + ". There were " + current.targetCount + ".";

    resultLead.textContent =
      accuracy + " The display also contained a five-pointed star, outlined " +
      "like several of the other shapes, sitting away from the middle. It was " +
      "there from the moment the display appeared.";

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The display is shown again below, with everything marked.");
  }

  /* --- The demonstrator route ------------------------------------------ */

  demonstrator.addEventListener("click", function () {
    var variant = nextVariant();
    if (!variant) {
      wb.announce("Both displays in this session have been used. Reload the page for a fresh start.");
      return;
    }

    used.push(variant.key);
    current = buildDisplay(variant);
    reported = null;

    wb.hide(entry);
    wb.hide(recognition);
    wb.hide(reveal);
    wb.hide(display);
    wb.hide(document.getElementById("instruction"));
    stageMessage.textContent = "Design shown below. This screen is now spent.";
    wb.show(stageMessage);
    wb.progress.markAllDone();

    paint(replay, current, true);
    replayDesc.textContent =
      "The design, revealed without the counting task having been performed.";
    resultLead.textContent =
      "This is the design, shown without the task. The counting task is " +
      "demanding and the star is never mentioned until afterwards. Reload the " +
      "page before handing this screen to anyone who has not seen it.";

    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Design revealed. This screen is spent; reload before a naive observer uses it.");
  });

  /* --- Controls -------------------------------------------------------- */

  startButton.addEventListener("click", showDisplay);

  countInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submit.click();
    }
  });

  wb.onReset(function () {
    current = null;
    reported = null;

    wb.hide(display);
    wb.hide(entry);
    wb.hide(recognition);
    wb.hide(reveal);
    wb.hide("#synthesis");
    wb.choices.clear(recognitionOptions);
    wb.show(document.getElementById("instruction"));
    wb.show(startButton);

    stepLabel.textContent = "The counting task";
    taskLead.textContent =
      "The display holds a mix of shapes, some solid and some outlined. Count " +
      "only the triangles that point downwards and are filled in. There is no " +
      "time limit, and nothing on the display moves or changes.";
    stageMessage.textContent = nextVariant()
      ? "Press the button below when you are ready to look."
      : "Both displays in this session have been used. Reload the page for a fresh start.";
    wb.show(stageMessage);
    countInput.value = "";
    wb.hide(countError);
    wb.progress.reset();
  });
})();
