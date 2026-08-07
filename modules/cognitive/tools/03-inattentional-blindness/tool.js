/* =========================================================================
   Inattentional Blindness
   -------------------------------------------------------------------------
   A demanding counting task on a STATIC display that also contains an object
   the learner was not asked about. After the count is submitted, a
   recognition question, then the same display again with everything labelled.

   WHY STATIC
   ----------
   The famous versions of this demonstration use video. A video cannot be
   made accessible to a reader who cannot use it, cannot honour a
   reduced-motion preference, and carries a flicker risk this collection will
   not take. A dense static array with a demanding conjunction count produces
   the same phenomenon — it is the design used in the medical-imaging version
   of the finding, where expert readers fixated an obvious out-of-place object
   and did not report it — and it is fully static, self-paced by default, and
   describable in words afterwards.

   THE ONE-SHOT PROBLEM
   --------------------
   A surprise works once. Everything in this tool is built around that:

     * the hero panel warns the reader not to scroll ahead, and says why;
     * FOUR deterministic variants exist, each with a fixed seed, so a display
       is identical every time it is drawn and a room can all be given the
       same one;
     * the tool marks which variants have been used in this browser session
       and says so in the variant table and in the select;
     * a DEMONSTRATOR ROUTE reveals the entire design without spending a
       variant, so whoever is running the session can see what is coming;
     * after any run the tool states plainly that the reader is no longer a
       naive observer and that a second variant demonstrates the design rather
       than testing the person.

   WHAT IS DELIBERATELY ABSENT
   ---------------------------
   Noticing rates. The tool has no data on how often people miss these
   objects, and a plausible-looking invented percentage would be worse than
   no percentage at all. The variant table therefore reports what each variant
   CHANGES, not what it produces. Nothing here scores the reader.

   THE VARIANTS
   ------------
       A  Standard        48 items, count solid down-pointing triangles,
                          large hollow star
       B  High load       72 items, same count, smaller hollow star
       C  Similar fill    48 items, count hollow squares, large hollow star
                          (the star now shares its fill with the counted set)
       D  Low load        24 items, count solid down-pointing triangles,
                          large solid star

   Seeds are 20260901 to 20260904. Displays are generated on an 12 x 7 grid
   with per-item jitter; the star is placed in a free cell away from the
   centre. Everything is drawn in currentColor: shape and fill carry the task,
   never colour.

   No data leave the browser. No storage, no network request. "Used" variants
   are remembered in a JavaScript variable only, and are forgotten when the
   page is reloaded.
   ========================================================================= */

(function () {
  "use strict";

  var VIEW_W = 640;
  var VIEW_H = 400;
  var GRID_COLS = 12;
  var GRID_ROWS = 7;
  var CELL_W = VIEW_W / GRID_COLS;
  var CELL_H = VIEW_H / GRID_ROWS;
  var JITTER = 7;
  var SHAPE_R = 15;
  var LIMIT_MS = 25000;
  /* The counted type is forced to this many instances, so the count is never
     trivially small and the range promised on the page is always true. */
  var TARGET_MIN = 6;
  var TARGET_MAX = 10;

  var SHAPES = ["triangle-down", "triangle-up", "square", "circle"];
  var SHAPE_NAME = {
    "triangle-down": "downward triangle",
    "triangle-up": "upward triangle",
    "square": "square",
    "circle": "circle"
  };

  var VARIANTS = [
    {
      id: "A",
      name: "A — Standard",
      seed: 20260901,
      items: 48,
      target: { shape: "triangle-down", solid: true },
      starSolid: false,
      starR: 36,
      designPoint: "The baseline. A moderately crowded display and a large " +
        "outlined object that shares nothing with the counted set."
    },
    {
      id: "B",
      name: "B — Heavier load, less salient object",
      seed: 20260902,
      items: 72,
      target: { shape: "triangle-down", solid: true },
      starSolid: false,
      starR: 24,
      designPoint: "Half again as many items and a smaller object. Two of the " +
        "factors that push noticing down, changed at once."
    },
    {
      id: "C",
      name: "C — Object shares the counted fill",
      seed: 20260903,
      items: 48,
      target: { shape: "square", solid: false },
      starSolid: false,
      starR: 36,
      designPoint: "The counted items are now outlined, and so is the " +
        "unexpected object. Similarity to the attended set usually raises " +
        "noticing."
    },
    {
      id: "D",
      name: "D — Light load, solid object",
      seed: 20260904,
      items: 30,
      target: { shape: "triangle-down", solid: true },
      starSolid: true,
      starR: 36,
      designPoint: "Half the items and a filled object. The easiest version, " +
        "and the one to use if you want to show that the phenomenon is not " +
        "inevitable."
    }
  ];

  /* =======================================================================
     Seeded randomness
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

  function shuffle(items, rand) {
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(rand() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  /* =======================================================================
     Helpers
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

  function targetLabel(target) {
    return (target.solid ? "solid " : "outlined ") + SHAPE_NAME[target.shape] +
      "s";
  }

  /* =======================================================================
     Display generation — deterministic per variant
     ===================================================================== */

  function buildDisplay(variant) {
    var rand = mulberry32(variant.seed);

    var cells = [];
    for (var c = 0; c < GRID_COLS; c += 1) {
      for (var r = 0; r < GRID_ROWS; r += 1) { cells.push({ col: c, row: r }); }
    }

    // The star is placed FIRST, never in the middle columns or the middle row
    // — an unexpected object sitting at the point of fixation is a different
    // experiment. Placing it first also lets the cells it would overlap be
    // kept empty, which matters because a solid star drawn over a countable
    // shape would make the correct count wrong.
    var candidates = cells.filter(function (cell) {
      return (cell.col < 4 || cell.col > 7) && (cell.row < 2 || cell.row > 4);
    });
    var starCell = candidates[Math.floor(rand() * candidates.length)];
    var star = {
      col: starCell.col,
      row: starCell.row,
      x: starCell.col * CELL_W + CELL_W / 2,
      y: starCell.row * CELL_H + CELL_H / 2,
      solid: variant.starSolid,
      r: variant.starR
    };
    // Keep the star fully inside the frame.
    star.x = Math.min(Math.max(star.x, star.r + 6), VIEW_W - star.r - 6);
    star.y = Math.min(Math.max(star.y, star.r + 6), VIEW_H - star.r - 6);

    var keepClear = star.r + SHAPE_R + JITTER + 4;
    var available = cells.filter(function (cell) {
      var cx = cell.col * CELL_W + CELL_W / 2;
      var cy = cell.row * CELL_H + CELL_H / 2;
      return Math.sqrt((cx - star.x) * (cx - star.x) +
        (cy - star.y) * (cy - star.y)) > keepClear;
    });
    shuffle(available, rand);

    // Every item starts as something that is NOT the counted type, and then a
    // fixed number are converted. Left to chance, a 30-item display would
    // often contain only two or three of the counted type, which makes the
    // count trivial and breaks the promise made on the page that there are
    // between five and ten of them.
    var nonTarget = [];
    SHAPES.forEach(function (shape) {
      [true, false].forEach(function (solid) {
        if (!(shape === variant.target.shape && solid === variant.target.solid)) {
          nonTarget.push({ shape: shape, solid: solid });
        }
      });
    });

    var chosen = available.slice(0, variant.items);
    var items = chosen.map(function (cell) {
      var kind = nonTarget[Math.floor(rand() * nonTarget.length)];
      return {
        col: cell.col,
        row: cell.row,
        x: cell.col * CELL_W + CELL_W / 2 + (rand() * 2 - 1) * JITTER,
        y: cell.row * CELL_H + CELL_H / 2 + (rand() * 2 - 1) * JITTER,
        shape: kind.shape,
        solid: kind.solid
      };
    });

    var wanted = TARGET_MIN + Math.floor(rand() * (TARGET_MAX - TARGET_MIN + 1));
    var order = items.map(function (item, index) { return index; });
    shuffle(order, rand);
    order.slice(0, wanted).forEach(function (index) {
      items[index].shape = variant.target.shape;
      items[index].solid = variant.target.solid;
    });

    var count = items.filter(function (item) {
      return item.shape === variant.target.shape &&
        item.solid === variant.target.solid;
    }).length;

    var inventory = {};
    items.forEach(function (item) {
      var key = (item.solid ? "solid " : "outlined ") + SHAPE_NAME[item.shape];
      inventory[key] = (inventory[key] || 0) + 1;
    });

    return {
      variant: variant,
      items: items,
      star: star,
      count: count,
      inventory: inventory
    };
  }

  function shapePath(item) {
    var r = SHAPE_R;
    if (item.shape === "circle") {
      return { tag: "circle", attrs: { cx: item.x.toFixed(1), cy: item.y.toFixed(1), r: r * 0.85 } };
    }
    if (item.shape === "square") {
      return {
        tag: "rect",
        attrs: {
          x: (item.x - r * 0.78).toFixed(1), y: (item.y - r * 0.78).toFixed(1),
          width: (r * 1.56).toFixed(1), height: (r * 1.56).toFixed(1), rx: 2
        }
      };
    }
    var sign = item.shape === "triangle-down" ? 1 : -1;
    var points = [
      [item.x - r, item.y - sign * r * 0.8],
      [item.x + r, item.y - sign * r * 0.8],
      [item.x, item.y + sign * r * 0.95]
    ];
    return {
      tag: "polygon",
      attrs: {
        points: points.map(function (p) {
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        }).join(" ")
      }
    };
  }

  function starPoints(star) {
    var pts = [];
    for (var i = 0; i < 10; i += 1) {
      var radius = i % 2 === 0 ? star.r : star.r * 0.42;
      var angle = (Math.PI / 5) * i - Math.PI / 2;
      pts.push((star.x + radius * Math.cos(angle)).toFixed(1) + "," +
        (star.y + radius * Math.sin(angle)).toFixed(1));
    }
    return pts.join(" ");
  }

  function drawDisplay(node, display, options) {
    clear(node);
    display.items.forEach(function (item) {
      var spec = shapePath(item);
      spec.attrs.class = "ib-shape" + (item.solid ? "" : " ib-shape--hollow");
      svgNode(spec.tag, spec.attrs, node);
    });
    svgNode("polygon", {
      points: starPoints(display.star),
      class: "ib-shape" + (display.star.solid ? "" : " ib-shape--hollow")
    }, node);
    if (options && options.markStar) {
      svgNode("circle", {
        cx: display.star.x.toFixed(1),
        cy: display.star.y.toFixed(1),
        r: (display.star.r + 12).toFixed(1),
        class: "ib-marker"
      }, node);
    }
  }

  function describeDisplay(display) {
    var parts = Object.keys(display.inventory).sort().map(function (key) {
      return display.inventory[key] + " " + key + (display.inventory[key] === 1 ? "" : "s");
    });
    var where = "row " + (display.star.row + 1) + " of " + GRID_ROWS +
      ", column " + (display.star.col + 1) + " of " + GRID_COLS +
      " (counting from the top left)";
    return "The display held " + display.items.length + " small shapes — " +
      parts.join(", ") + " — plus one " +
      (display.star.solid ? "solid" : "outlined") + " five-pointed star at " +
      where + ", drawn about " + Math.round(display.star.r / SHAPE_R * 10) / 10 +
      " times the width of the small shapes. The correct count of " +
      targetLabel(display.variant.target) + " was " + display.count + ".";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#ib");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var variantSelect = $("#variant-select");
  var variantHint = $("[data-variant-hint]");
  var limitCheck = $("#limit-check");
  var startButton = $('[data-action="start"]');
  var demonstratorButton = $('[data-action="demonstrator"]');
  var finishedButton = $('[data-action="finished"]');

  var goalText = $("[data-goal-text]");
  var instruction = $("[data-instruction]");
  var displaySvg = $("[data-display]");
  var caption = $("[data-caption]");
  var runControls = $("[data-run-controls]");
  var countForm = $("[data-count-form]");
  var countInput = $("#count-input");
  var countLabel = $("[data-count-label]");
  var countError = $("[data-count-error]");
  var noticeForm = $("[data-notice-form]");
  var noticeError = $("[data-notice-error]");

  var revealSection = $("#reveal");
  var revealSvg = $("[data-reveal-svg]");
  var revealCaption = $("[data-reveal-caption]");
  var revealText = $("[data-reveal-text]");
  var revealBody = $("[data-reveal-body]");
  var variantTable = $("[data-variant-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var limitTimer = null;

  function currentVariant() {
    return VARIANTS.filter(function (v) {
      return v.id === variantSelect.value;
    })[0] || VARIANTS[0];
  }

  function fillVariantSelect() {
    // The option labels change as variants are used, so the list is rebuilt —
    // but the current selection must survive that, or finishing a run
    // silently switches the demonstrator to a different variant.
    var previous = variantSelect.value;
    clear(variantSelect);
    VARIANTS.forEach(function (variant) {
      var option = make("option", null,
        variant.name + (state.used.indexOf(variant.id) === -1 ? "" : " (already used)"));
      option.value = variant.id;
      variantSelect.appendChild(option);
    });
    if (previous) { variantSelect.value = previous; }
  }

  function renderVariantTable() {
    clear(variantTable);
    VARIANTS.forEach(function (variant) {
      var row = make("tr");
      var head = make("th", null, variant.name);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, targetLabel(variant.target)));
      row.appendChild(make("td", null, String(variant.items)));
      row.appendChild(make("td", null,
        (variant.starSolid ? "solid" : "outlined") + " star, " +
        (variant.starR >= 30 ? "large" : "medium")));
      row.appendChild(make("td", null, variant.designPoint));
      var used = make("td", null,
        state.used.indexOf(variant.id) === -1 ? "Not yet" : "Used this session");
      if (state.used.indexOf(variant.id) !== -1) {
        used.className = "variant-used";
      }
      row.appendChild(used);
      variantTable.appendChild(row);
    });
  }

  function updateVariantHint() {
    var variant = currentVariant();
    variantHint.textContent = variant.designPoint +
      (state.used.indexOf(variant.id) === -1
        ? " Not used yet in this browser session."
        : " Already used in this browser session — anybody who has seen it is no longer a naive observer.");
  }

  function clearRunUi() {
    if (limitTimer !== null) { window.clearTimeout(limitTimer); limitTimer = null; }
    runControls.hidden = true;
    countForm.hidden = true;
    noticeForm.hidden = true;
    countError.hidden = true;
    noticeError.hidden = true;
    caption.textContent = "";
    displaySvg.hidden = true;
    clear(displaySvg);
  }

  /* --- Running a variant ---------------------------------------------- */

  function startRun() {
    var variant = currentVariant();
    state.display = buildDisplay(variant);
    state.startedAt = Date.now();
    state.limited = limitCheck.checked;

    clearRunUi();
    variantSelect.disabled = true;
    limitCheck.disabled = true;
    startButton.disabled = true;

    instruction.textContent = "Count the " + targetLabel(variant.target) +
      ". There are between " + TARGET_MIN + " and " + TARGET_MAX + " of them.";
    goalText.textContent = "Count the " + targetLabel(variant.target) + ".";
    countLabel.textContent = "How many " + targetLabel(variant.target) +
      " did you count?";

    displaySvg.hidden = false;
    drawDisplay(displaySvg, state.display, { markStar: false });
    caption.textContent = state.limited
      ? "The display will hide itself after 25 seconds."
      : "The display stays until you say you have finished.";
    runControls.hidden = false;
    finishedButton.focus();

    shell.announce("Display showing. Count the " +
      targetLabel(variant.target) + ".", { immediate: true });

    if (state.limited) {
      limitTimer = window.setTimeout(function () {
        limitTimer = null;
        if (state.phase === "viewing") { finishViewing(true); }
      }, LIMIT_MS);
    }
    state.phase = "viewing";
  }

  function finishViewing(byTimer) {
    if (state.phase !== "viewing") { return; }
    if (limitTimer !== null) { window.clearTimeout(limitTimer); limitTimer = null; }
    state.phase = "counting";
    state.viewedMs = Date.now() - state.startedAt;
    displaySvg.hidden = true;
    clear(displaySvg);
    runControls.hidden = true;
    caption.textContent = byTimer
      ? "Twenty-five seconds up — the display has gone."
      : "Display hidden.";
    countForm.hidden = false;
    countInput.focus();
    shell.announce("Display hidden. Enter your count.", { immediate: true });
  }

  finishedButton.addEventListener("click", function () { finishViewing(false); });

  countForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (countInput.value === "" || isNaN(Number(countInput.value))) {
      countError.textContent = "Enter a number, even if you are unsure of it.";
      countError.hidden = false;
      countInput.focus();
      return;
    }
    countError.hidden = true;
    state.reportedCount = Number(countInput.value);
    state.phase = "noticing";
    countForm.hidden = true;
    noticeForm.hidden = false;
    noticeForm.querySelector("input").focus();
    shell.announce("Count recorded. One more question.", { immediate: true });
  });

  noticeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="notice"]:checked', noticeForm);
    if (!answer) {
      noticeError.textContent =
        "Choose one. \"No\" is a perfectly good answer and is what a great " +
        "many people say.";
      noticeError.hidden = false;
      return;
    }
    noticeError.hidden = true;
    state.noticed = answer.value;
    noticeForm.hidden = true;
    if (state.used.indexOf(state.display.variant.id) === -1) {
      state.used.push(state.display.variant.id);
    }
    showReveal("run");
  });

  /* --- The reveal ------------------------------------------------------ */

  function showReveal(source) {
    var display = state.display;
    drawDisplay(revealSvg, display, { markStar: true });
    revealCaption.textContent = display.variant.name +
      " — the display in full, with the unexpected object ringed";
    revealText.textContent = describeDisplay(display);

    clear(revealBody);

    if (source === "demonstrator") {
      revealBody.appendChild(make("p", "reveal__lead",
        "Demonstrator route: " + display.variant.name + "."));
      revealBody.appendChild(make("p", null,
        "Nothing has been spent — this variant is still marked unused, so you " +
        "can give it to a room. What a naive observer sees is the same display " +
        "without the ring, with the instruction to count the " +
        targetLabel(display.variant.target) + ", and nothing else."));
      revealBody.appendChild(make("p", null,
        "The question afterwards offers six answers: no, a vague yes, and four " +
        "named objects of which only one is correct. Offering the correct " +
        "object by name makes a yes answer easier than an open question would, " +
        "which is a real limitation and is stated in the debrief."));
    } else {
      var correct = display.count;
      var reported = state.reportedCount;
      var off = Math.abs(reported - correct);
      var noticed = state.noticed === "star";
      var partial = state.noticed === "vague";

      revealBody.appendChild(make("p", "reveal__lead",
        noticed
          ? "You reported the star."
          : partial
            ? "You reported something, without being able to name it."
            : "You did not report the star."));

      revealBody.appendChild(make("p", null,
        noticed
          ? "That happens often, and it is the finding rather than a " +
            "failure. Noticing rates move with task load, similarity, size " +
            "and expectation. The variant table shows what each one changes."
          : partial
            ? "The most interesting of the six answers. Something survived " +
              "far enough to leave a trace and not far enough to be named — " +
              "which is exactly where perception and memory accounts differ."
            : "The star was drawn about " +
              Math.round(display.star.r / SHAPE_R * 10) / 10 + " times the " +
              "width of the shapes you were counting, and it was on screen the " +
              "whole time. It is very likely that your eyes landed on it. What " +
              "did not happen is that it entered a report."));

      revealBody.appendChild(make("p", null,
        "Your count was " + reported + "; there were " + correct + ". " +
        (off === 0
          ? "Exactly right — which is worth knowing, because it shows the " +
            "count was not going badly enough to explain anything else."
          : off <= 2
            ? "Close, so the counting task was working as intended: absorbing, " +
              "but not so hard that you gave up on it."
            : "Some way out, which is fair enough — the count is there to " +
              "occupy attention rather than to be scored.") +
        " You looked at the display for about " +
        Math.round(state.viewedMs / 1000) + " second" +
        (Math.round(state.viewedMs / 1000) === 1 ? "" : "s") +
        (state.limited ? ", with the 25-second limit on." : ", self-paced.")));

      revealBody.appendChild(make("p", "verdict__note",
        "One trial, one binary answer — not a measurement of your " +
        "attention. You are also no longer naive: further variants show you " +
        "the design, they cannot test you."));
    }

    renderVariantTable();
    fillVariantSelect();
    updateVariantHint();
    revealSection.hidden = false;
    $("#reveal-heading").focus();
    shell.announce("The display is shown again below, with everything labelled.",
      { immediate: true });
  }

  demonstratorButton.addEventListener("click", function () {
    clearRunUi();
    state.phase = "idle";
    state.display = buildDisplay(currentVariant());
    instruction.textContent =
      "Demonstrator route taken. The full design is below.";
    goalText.textContent = "Demonstrator route — nothing is being tested.";
    showReveal("demonstrator");
  });

  startButton.addEventListener("click", startRun);

  variantSelect.addEventListener("change", updateVariantHint);

  /* =======================================================================
     Opening judgement
     ===================================================================== */

  var OPENING = {
    exact: {
      tone: "neutral", verdict: "Ambitious.",
      text: "Counting a particular kind of shape among several dozen others " +
        "is harder than it sounds, which is exactly why the task was chosen."
    },
    one: {
      tone: "neutral", verdict: "Reasonable.",
      text: "Most people land within one or two. The count is there to occupy " +
        "your attention rather than to be scored, so do take it seriously."
    },
    three: {
      tone: "neutral", verdict: "Also reasonable.",
      text: "Do try to be accurate anyway. The demonstration depends on the " +
        "counting task actually being attended to."
    },
    unsure: {
      tone: "neutral", verdict: "Sensible.",
      text: "Crowding matters a great deal, and the variants differ in exactly " +
        "that. Take the count seriously and see."
    }
  };

  function unlockTask(message) {
    variantSelect.disabled = false;
    limitCheck.disabled = false;
    startButton.disabled = false;
    instruction.textContent =
      "Press Start when you are ready. The counting instruction appears with " +
      "the display.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockTask("Display unlocked. Press Start when you are ready.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Skipped.",
      "The display is unlocked. If you are running this for a group, take the " +
      "demonstrator route first so you know what they are about to be asked.");
    lockForm(openingForm);
    unlockTask("Skipped. Display unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_CHANGES = [
    {
      id: "load",
      text: "Make the counting task much harder — count a conjunction of three properties instead of two.",
      answer: "fewer",
      why: "Task demand is the most reliable lever in this literature. The " +
        "harder the primary task, the lower the noticing rate."
    },
    {
      id: "similar",
      text: "Make the unexpected object the same shape as the items being counted, only much larger.",
      answer: "more",
      why: "Similarity to the attended set raises noticing. An object that " +
        "matches what you are set for is more likely to get through; an " +
        "object that matches what you are ignoring is less likely."
    },
    {
      id: "warn",
      text: "Tell people beforehand that something unexpected may appear.",
      answer: "more",
      why: "It is no longer unexpected, so the phenomenon largely disappears. " +
        "This is why the demonstration works once: the warning is exactly " +
        "what having done it before supplies."
    },
    {
      id: "position",
      text: "Move the unexpected object to the exact centre of the display, where people are already looking.",
      answer: "more",
      why: "Position helps, though less than you might think - fixating an " +
        "object is not sufficient for reporting it, which is the finding from " +
        "the medical-imaging version where expert readers looked directly at " +
        "the object and did not report it. Expect more noticing, but not a " +
        "guarantee."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["more", "More people would notice"],
    ["fewer", "Fewer people would notice"],
    ["same", "Roughly the same"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_CHANGES.forEach(function (change) {
      var row = make("tr");
      var head = make("th", null, change.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);

      var cell = make("td");
      var select = make("select");
      select.id = "change-" + change.id;
      var label = make("label", "visually-hidden",
        "Expected effect on noticing of this change: " + change.text);
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
    var answered = 0;
    var right = 0;
    CHALLENGE_CHANGES.forEach(function (change) {
      var select = $("#change-" + change.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === change.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. Ask yourself each time whether the change makes " +
        "the primary task harder, or makes the object more like what is being " +
        "attended to.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_CHANGES.length ? "good" : "caution",
      right + " of " + CHALLENGE_CHANGES.length + " correct" +
      (answered < CHALLENGE_CHANGES.length
        ? " (" + (CHALLENGE_CHANGES.length - answered) + " left blank)." : "."),
      "Two levers do most of the work: how demanding the primary task is, and " +
      "how similar the unexpected object is to what you are set for.");

    var list = make("ul");
    CHALLENGE_CHANGES.forEach(function (change) {
      var item = make("li");
      item.appendChild(make("strong", null, "“" + change.text + "” "));
      item.appendChild(document.createTextNode(change.why));
      list.appendChild(item);
    });
    challengeFeedback.appendChild(list);

    challengeFeedback.appendChild(make("p", null,
      "The tool gives no percentages for any of these, deliberately. The " +
      "direction of each effect is well replicated; the size of it belongs to " +
      "whichever study measured it, and would not transfer to this display."));

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_CHANGES.length + " correct.", { immediate: true });
  });

  /* =======================================================================
     Feedback helpers
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
     -----------------------------------------------------------------------
     Reset restores the whole page — but NOT the record of which variants have
     been used. Forgetting that would let the tool pretend a spent surprise is
     fresh, which is the one thing this design must not do.
     ===================================================================== */

  shell.onReset(function () {
    var used = state ? state.used : [];
    state = {
      phase: "idle",
      display: null,
      startedAt: 0,
      viewedMs: 0,
      limited: true,
      reportedCount: null,
      noticed: null,
      used: used
    };

    clearRunUi();
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    challengeFeedback.hidden = true;
    revealSection.hidden = true;
    countInput.value = "";
    noticeForm.reset();

    fillVariantSelect();
    variantSelect.value = VARIANTS[0].id;
    variantSelect.disabled = true;
    limitCheck.checked = true;
    limitCheck.disabled = true;
    startButton.disabled = true;

    instruction.textContent = "Answer the question above to unlock the display.";
    goalText.textContent = used.length
      ? "You have already used " + used.length + " variant" +
        (used.length === 1 ? "" : "s") + " in this session."
      : "Choose a variant and press Start.";

    updateVariantHint();
    renderVariantTable();
    renderChallenge();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. The display is static: nothing moves and nothing flashes. Please " +
      "do not read the debrief before doing the task.",
    { immediate: true });
})();
