/* =========================================================================
   Factorial ANOVA Interaction Detective
   -------------------------------------------------------------------------
   A 2x2 design has four cell means and nothing else. Everything the tool
   shows is arithmetic on those four numbers:

       row means      immediate = (IS + IC)/2      delayed = (DS + DC)/2
       column means   simple    = (IS + DS)/2      complex = (IC + DC)/2
       main effect of feedback = delayed row  - immediate row
       main effect of task     = complex col  - simple col
       interaction             = (DC - DS) - (IC - IS)
                               = (DC - IC) - (DS - IS)

   The second line of the interaction is the point of the "read it the other
   way round" disclosure: the difference of differences is symmetric, so which
   factor sits on the horizontal axis is a presentation decision and does not
   change the term.

   WHAT THIS TOOL DELIBERATELY DOES NOT COMPUTE
   --------------------------------------------
   There is no F, no p and no effect size, because there is no dataset - only
   four means. Putting an F on screen would invite students to read a test
   result off numbers that contain no information about within-cell variation
   or sample size. Instead the tool offers the two things that actually decide
   whether an interaction plot means anything:

     * the SCALE the picture is drawn on (a zoomed axis makes half a point
       look like a chasm);
     * the UNCERTAINTY in each cell mean, chosen from a menu and drawn as
       error bars.

   Where a standard error is shown, the tool reports the interaction in units
   of its own standard error. For four independent cell means each with
   standard error s, the difference of differences has standard error 2s,
   because it is a sum of four terms each contributing s^2. That is stated
   rather than turned into a test: overlapping error bars are a poor proxy for
   any formal comparison, and for an interaction they are the wrong comparison
   entirely.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CELL_IDS = ["cell-is", "cell-ic", "cell-ds", "cell-dc"];
  var DEFAULT_CELLS = [70, 50, 50, 70];   // IS, IC, DS, DC — the crossover
  var FLAT_THRESHOLD = 1.0;               // points below which "no interaction"

  var PRESETS = {
    crossover: {
      cells: [70, 50, 50, 70],
      note: "A crossover. Feedback helps by 20 points on one task and hurts " +
        "by 20 on the other, so both main effects are exactly zero."
    },
    fan: {
      cells: [60, 60, 62, 76],
      note: "A fan. Delayed feedback does almost nothing on the simple task " +
        "and adds 16 points on the complex one, so there are two main effects " +
        "and an interaction at the same time."
    },
    parallel: {
      cells: [55, 70, 65, 80],
      note: "Parallel lines. Delayed feedback adds exactly 10 points on both " +
        "tasks, so the two main effects tell the whole story and the " +
        "interaction is zero."
    },
    hidden: {
      cells: [50, 80, 70, 60],
      note: "A hidden effect. Feedback matters enormously and in opposite " +
        "directions, so its marginal means are identical and the main effect " +
        "is zero. Reporting only the main effect here would be false."
    },
    tiny: {
      cells: [70, 70.5, 71, 72],
      note: "Half a point of interaction on a 100-point scale. Look at it " +
        "zoomed, then switch the axis to the full scale, then add the large " +
        "error bars."
    }
  };

  /* =======================================================================
     Small DOM helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(attrs, text, className) {
    var node = svgNode("text", attrs);
    if (className) { node.setAttribute("class", className); }
    node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function fmt(value, places) {
    return value.toFixed(places === undefined ? 1 : places);
  }

  /** Signed value with an explicit sign, so direction never depends on a minus
      sign being noticed at the end of a number. */
  function signed(value) {
    if (Math.abs(value) < 0.05) { return "0.0"; }
    return (value > 0 ? "+" : "−") + Math.abs(value).toFixed(1);
  }

  function row(cells) {
    var tr = make("tr");
    cells.forEach(function (cell, i) {
      if (i === 0) {
        var th = make("th", null, cell);
        th.setAttribute("scope", "row");
        tr.appendChild(th);
      } else {
        tr.appendChild(make("td", null, cell));
      }
    });
    return tr;
  }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
    return p;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#detective");
  if (!shell) { return; }

  var cellInputs = CELL_IDS.map(function (id) { return $("#" + id); });
  var presetSelect = $("#preset-select");
  var axisSelect = $("#axis-select");
  var errorSelect = $("#error-select");

  var chartHeading = $("[data-chart-heading]");
  var plot = $("[data-plot]");
  var cellTable = $("[data-cell-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var caveat = $("[data-caveat]");
  var symmetry = $("[data-symmetry]");
  var simpleTable = $("[data-simple-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var detectiveSection = $("#detective-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");
  var swapButton = $('[data-action="swap-axes"]');

  /* Which factor sits on the horizontal axis. The interaction term is
     identical either way; only the picture changes. */
  var xFactor = "task";
  var applyingPreset = false;

  /* =======================================================================
     The arithmetic
     ===================================================================== */

  function cells() {
    return {
      is: Number(cellInputs[0].value),
      ic: Number(cellInputs[1].value),
      ds: Number(cellInputs[2].value),
      dc: Number(cellInputs[3].value)
    };
  }

  function stats() {
    var c = cells();
    var rowImmediate = (c.is + c.ic) / 2;
    var rowDelayed = (c.ds + c.dc) / 2;
    var colSimple = (c.is + c.ds) / 2;
    var colComplex = (c.ic + c.dc) / 2;
    return {
      c: c,
      rowImmediate: rowImmediate,
      rowDelayed: rowDelayed,
      colSimple: colSimple,
      colComplex: colComplex,
      grand: (c.is + c.ic + c.ds + c.dc) / 4,
      mainFeedback: rowDelayed - rowImmediate,
      mainTask: colComplex - colSimple,
      interaction: (c.dc - c.ds) - (c.ic - c.is),
      // Simple effects: the effect of one factor within one level of the other.
      feedbackInSimple: c.ds - c.is,
      feedbackInComplex: c.dc - c.ic,
      taskInImmediate: c.ic - c.is,
      taskInDelayed: c.dc - c.ds
    };
  }

  function errorSE() { return Number(errorSelect.value); }

  /* =======================================================================
     Drawing
     ===================================================================== */

  function series() {
    var c = cells();
    if (xFactor === "task") {
      return {
        xLabels: ["Simple task", "Complex task"],
        lines: [
          { name: "Immediate", values: [c.is, c.ic] },
          { name: "Delayed", values: [c.ds, c.dc] }
        ]
      };
    }
    return {
      xLabels: ["Immediate feedback", "Delayed feedback"],
      lines: [
        { name: "Simple", values: [c.is, c.ds] },
        { name: "Complex", values: [c.ic, c.dc] }
      ]
    };
  }

  function renderPlot() {
    var left = 44;
    var right = 372;   // room on the right for the two line labels
    var top = 16;
    var base = 158;
    var s = series();
    var se = errorSE();

    clear(plot);

    var values = s.lines[0].values.concat(s.lines[1].values);
    var lo;
    var hi;
    if (axisSelect.value === "full") {
      lo = 0;
      hi = 100;
    } else {
      lo = Math.min.apply(null, values) - se;
      hi = Math.max.apply(null, values) + se;
      var pad = Math.max(1.5, (hi - lo) * 0.3);
      lo -= pad;
      hi += pad;
    }
    if (hi - lo < 0.5) { lo -= 0.5; hi += 0.5; }

    var y = function (value) {
      return base - ((value - lo) / (hi - lo)) * (base - top);
    };
    var xs = [left + (right - left) * 0.22, left + (right - left) * 0.78];

    // Axis and a light grid so the scale is readable.
    var tickStep = (hi - lo) > 60 ? 20 : (hi - lo) > 25 ? 10 : (hi - lo) > 10 ? 5 :
      (hi - lo) > 4 ? 1 : 0.5;
    var first = Math.ceil(lo / tickStep) * tickStep;
    for (var v = first; v <= hi + 1e-9; v += tickStep) {
      plot.appendChild(svgNode("line", {
        x1: left, y1: y(v), x2: right, y2: y(v), class: "plot__grid"
      }));
      plot.appendChild(svgText(
        { x: left - 6, y: y(v) + 4, "text-anchor": "end" },
        tickStep < 1 ? fmt(v) : String(Math.round(v)), "chart__axis"));
    }
    plot.appendChild(svgNode("line", {
      x1: left, y1: top, x2: left, y2: base, class: "plot__axis"
    }));
    plot.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "plot__axis"
    }));

    s.lines.forEach(function (line, index) {
      var two = index === 1;
      plot.appendChild(svgNode("line", {
        x1: xs[0], y1: y(line.values[0]), x2: xs[1], y2: y(line.values[1]),
        class: "plot__line" + (two ? " plot__line--two" : "")
      }));
      line.values.forEach(function (value, i) {
        if (se > 0) {
          plot.appendChild(svgNode("line", {
            x1: xs[i], y1: y(value - se), x2: xs[i], y2: y(value + se),
            class: "plot__error"
          }));
          [value - se, value + se].forEach(function (end) {
            plot.appendChild(svgNode("line", {
              x1: xs[i] - 4, y1: y(end), x2: xs[i] + 4, y2: y(end),
              class: "plot__error"
            }));
          });
        }
        // Round markers for the first line, square for the second.
        if (two) {
          plot.appendChild(svgNode("rect", {
            x: xs[i] - 4.5, y: y(value) - 4.5, width: 9, height: 9,
            class: "plot__marker plot__marker--two"
          }));
        } else {
          plot.appendChild(svgNode("circle", {
            cx: xs[i], cy: y(value), r: 5, class: "plot__marker"
          }));
        }
        plot.appendChild(svgText(
          { x: xs[i], y: y(value) - 11, "text-anchor": "middle" },
          fmt(value), "chart__axis"));
      });
      // The line is named at its right-hand end, so the two are never told
      // apart by colour alone.
      plot.appendChild(svgText(
        { x: right + 6, y: y(line.values[1]) + 4, "text-anchor": "start" },
        line.name, "chart__label"));
    });

    s.xLabels.forEach(function (label, i) {
      plot.appendChild(svgText(
        { x: xs[i], y: base + 18, "text-anchor": "middle" },
        label, "chart__label"));
    });
    plot.appendChild(svgText(
      { x: left - 6, y: top - 4, "text-anchor": "end" },
      "score", "chart__axis"));
    plot.appendChild(svgText(
      { x: (left + right) / 2, y: base + 36, "text-anchor": "middle" },
      axisSelect.value === "full"
        ? "vertical axis: the full 0 to 100 scale"
        : "vertical axis: zoomed to a range of " + fmt(hi - lo) + " points",
      "chart__axis"));
  }

  function renderCellTable(t) {
    clear(cellTable);
    cellTable.appendChild(row([
      "Immediate", fmt(t.c.is), fmt(t.c.ic), fmt(t.rowImmediate)
    ]));
    cellTable.appendChild(row([
      "Delayed", fmt(t.c.ds), fmt(t.c.dc), fmt(t.rowDelayed)
    ]));
    var totals = row([
      "Column mean", fmt(t.colSimple), fmt(t.colComplex), fmt(t.grand)
    ]);
    totals.className = "data-table__total";
    cellTable.appendChild(totals);
  }

  function renderReadout(t) {
    clear(readout);
    [
      ["Main effect of feedback", signed(t.mainFeedback)],
      ["Main effect of task", signed(t.mainTask)],
      ["Interaction, as a difference of differences", signed(t.interaction)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderSimpleEffects(t) {
    clear(simpleTable);
    [
      ["Delayed minus immediate, within the simple task", signed(t.feedbackInSimple)],
      ["Delayed minus immediate, within the complex task", signed(t.feedbackInComplex)],
      ["Complex minus simple, within immediate feedback", signed(t.taskInImmediate)],
      ["Complex minus simple, within delayed feedback", signed(t.taskInDelayed)]
    ].forEach(function (pair) {
      simpleTable.appendChild(row(pair));
    });
    symmetry.textContent =
      "Reading down the first two rows: the effect of feedback changes by " +
      signed(t.feedbackInComplex - t.feedbackInSimple) + " points when you " +
      "move from the simple task to the complex one. Reading down the last " +
      "two: the effect of task changes by " +
      signed(t.taskInDelayed - t.taskInImmediate) + " points when you move " +
      "from immediate to delayed feedback. They are the same number, because " +
      "both are the same subtraction of the same four means in a different " +
      "order. That is why an interaction has no direction of its own and why " +
      "swapping the axes cannot change it.";
  }

  function describe(t) {
    var i = t.interaction;
    var fs = t.feedbackInSimple;
    var fc = t.feedbackInComplex;

    if (Math.abs(i) < FLAT_THRESHOLD) {
      return {
        tone: "neutral",
        text:
          "The lines are parallel to within " + fmt(Math.abs(i)) + " points. " +
          "Delaying feedback changes the score by " + signed(fs) + " on the " +
          "simple task and " + signed(fc) + " on the complex one - the same " +
          "effect in both, so the two main effects say everything there is to " +
          "say. Feedback: " + signed(t.mainFeedback) + " points overall. Task: " +
          signed(t.mainTask) + " points overall."
      };
    }

    var crossed = (fs > 0.5 && fc < -0.5) || (fs < -0.5 && fc > 0.5);
    var sentence =
      "Delaying feedback " +
      (Math.abs(fs) < 0.5 ? "made no real difference to" :
        fs > 0 ? "raised" : "lowered") + " scores on the simple task (" +
      signed(fs) + ") and " +
      (Math.abs(fc) < 0.5 ? "made no real difference to" :
        fc > 0 ? "raised" : "lowered") + " them on the complex task (" +
      signed(fc) + "), a difference of differences of " + signed(i) + " points.";

    if (crossed) {
      return {
        tone: "warn",
        text: sentence + " Because the effect reverses direction, this is a " +
          "disordinal - crossover - interaction, and the main effect of " +
          "feedback (" + signed(t.mainFeedback) + ") is a summary of two " +
          "opposite things. Describing it on its own would be misleading, " +
          "which is why the sentence above names both simple effects."
      };
    }
    return {
      tone: "caution",
      text: sentence + " The effect points the same way in both conditions " +
        "and is merely larger in one, so this is an ordinal interaction. The " +
        "main effect of feedback (" + signed(t.mainFeedback) + ") can be " +
        "described alongside it, as long as you say where it is bigger."
    };
  }

  function renderCaveat(t) {
    var se = errorSE();
    var i = Math.abs(t.interaction);
    var scale = axisSelect.value === "full" ? "full" : "zoom";
    var parts = [];

    if (se > 0) {
      // Four independent cell means, each with standard error s: the
      // difference of differences has standard error 2s.
      var seInteraction = 2 * se;
      parts.push(
        "With a standard error of " + fmt(se) + " in each cell, the difference " +
        "of differences carries a standard error of " + fmt(seInteraction) +
        " - twice the cell figure, because four means go into it. This " +
        "interaction is " + fmt(i / seInteraction) + " of those standard " +
        "errors from zero" +
        (i / seInteraction < 2
          ? ", which is not a lot to build a story on."
          : ", which is a pattern worth taking seriously.") +
        " Note that this is the right comparison, and whether the individual " +
        "error bars overlap is not.");
    } else {
      parts.push(
        "No uncertainty is being shown. Four means from any real study will " +
        "almost never line up exactly, so non-parallel lines are guaranteed " +
        "before anything interesting happens. Choose an error bar setting " +
        "before believing the shape.");
    }

    if (scale === "zoom") {
      parts.push(
        "The axis is zoomed to the data, which is the default in most " +
        "software and makes every pattern look decisive. Switch to the full " +
        "scale to see the same numbers against the outcome they were measured " +
        "on.");
    }

    caveat.textContent = parts.join(" ");
  }

  /* The menu follows the sliders rather than fighting them: whenever the four
     values happen to match a known shape, the menu says so. This is simpler
     and more robust than trying to suppress the input events a preset fires. */
  function syncPresetMenu() {
    var current = cellInputs.map(function (input) { return Number(input.value); });
    var match = "custom";
    Object.keys(PRESETS).forEach(function (key) {
      var same = PRESETS[key].cells.every(function (value, i) {
        return Math.abs(value - current[i]) < 1e-9;
      });
      if (same) { match = key; }
    });
    presetSelect.value = match;
  }

  function render() {
    var t = stats();
    syncPresetMenu();
    chartHeading.textContent =
      "Interaction plot — " +
      (xFactor === "task" ? "task on the horizontal axis"
        : "feedback on the horizontal axis");
    renderPlot();
    renderCellTable(t);
    renderReadout(t);
    renderSimpleEffects(t);
    var d = describe(t);
    interpretation.textContent = d.text;
    verdictBox.setAttribute("data-tone", d.tone);
    renderCaveat(t);
    return t;
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  var CELL_NAMES = [
    "immediate feedback on the simple task",
    "immediate feedback on the complex task",
    "delayed feedback on the simple task",
    "delayed feedback on the complex task"
  ];

  cellInputs.forEach(function (input, index) {
    shell.bindRange(input, {
      format: function (v) { return fmt(v); },
      describe: function (v) {
        return fmt(v) + " points for " + CELL_NAMES[index];
      },
      onInput: function () {
        if (applyingPreset) { return; }
        render();
      }
    });
  });

  function applyCells(values, note) {
    applyingPreset = true;
    values.forEach(function (value, i) {
      cellInputs[i].value = String(value);
      cellInputs[i].dispatchEvent(new Event("input"));
    });
    applyingPreset = false;
    var t = render();
    if (note) {
      shell.announce(
        note + " Main effect of feedback " + signed(t.mainFeedback) +
        ", main effect of task " + signed(t.mainTask) + ", interaction " +
        signed(t.interaction) + ".", { immediate: true });
    }
    return t;
  }

  presetSelect.addEventListener("change", function () {
    var preset = PRESETS[presetSelect.value];
    if (!preset) { return; }
    applyCells(preset.cells, preset.note);
  });

  axisSelect.addEventListener("change", function () {
    render();
    shell.announce(
      axisSelect.value === "full"
        ? "Vertical axis switched to the full 0 to 100 scale. The numbers have " +
          "not changed."
        : "Vertical axis zoomed to the data. The numbers have not changed.",
      { immediate: true });
  });

  errorSelect.addEventListener("change", function () {
    render();
    var se = errorSE();
    shell.announce(
      se === 0
        ? "Error bars removed."
        : "Error bars set to a standard error of " + fmt(se) +
          " in each cell mean.", { immediate: true });
  });

  $('[data-action="flatten"]').addEventListener("click", function () {
    // The additive fit: every cell replaced by row mean + column mean - grand
    // mean. Both sets of marginal means are preserved exactly, and the
    // interaction becomes zero. Rounded to the slider's half-point step.
    var t = stats();
    var target = [
      t.rowImmediate + t.colSimple - t.grand,
      t.rowImmediate + t.colComplex - t.grand,
      t.rowDelayed + t.colSimple - t.grand,
      t.rowDelayed + t.colComplex - t.grand
    ].map(function (v) {
      return Math.min(100, Math.max(0, Math.round(v * 2) / 2));
    });
    applyCells(target,
      "Interaction removed. Both sets of marginal means are exactly where they " +
      "were: only the way the total is shared between the four cells has " +
      "changed.");
  });

  swapButton.addEventListener("click", function () {
    xFactor = xFactor === "task" ? "feedback" : "task";
    swapButton.textContent = xFactor === "task"
      ? "Put feedback on the horizontal axis"
      : "Put task on the horizontal axis";
    var t = render();
    shell.announce(
      "Axes swapped. The picture is different and the interaction is still " +
      signed(t.interaction) + " points, because the difference of differences " +
      "is the same subtraction either way round.", { immediate: true });
  });

  /* =======================================================================
     Opening predictions
     ===================================================================== */

  var TRUTH = { mainA: "no", mainB: "no", inter: "yes" };

  var WHY = {
    mainA:
      "Main effect of feedback: the row means are (70 + 50)/2 = 60 and " +
      "(50 + 70)/2 = 60. They are identical, so there is no main effect - " +
      "not because feedback did nothing, but because its two effects were " +
      "equal and opposite and the averaging destroyed both.",
    mainB:
      "Main effect of task: the column means are (70 + 50)/2 = 60 and " +
      "(50 + 70)/2 = 60. Identical again, for exactly the same reason.",
    inter:
      "Interaction: delaying feedback costs 20 points on the simple task and " +
      "gains 20 on the complex one, so the difference of differences is " +
      "20 − (−20) = 40 points. This is the largest thing in the table and the " +
      "only one either main effect can see nothing of."
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openDetective() {
    detectiveSection.hidden = false;
    challengeSection.hidden = false;
    render();
    $("#detective-heading").focus();
    shell.announce(
      "The detective is open, loaded with the crossover pattern you predicted " +
      "about.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = {};
    var missing = false;
    ["mainA", "mainB", "inter"].forEach(function (name) {
      var picked = $('input[name="' + name + '"]:checked', openingForm);
      if (!picked) { missing = true; } else { answers[name] = picked.value; }
    });
    if (missing) {
      openingError.textContent =
        "Answer all three questions before opening the detective.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;

    var correct = ["mainA", "mainB", "inter"].filter(function (name) {
      return answers[name] === TRUTH[name];
    }).length;

    var lead;
    var tone;
    if (correct === 3) {
      tone = "good";
      lead = "All three right — including the two that look wrong.";
    } else if (correct === 0) {
      tone = "warn";
      lead = "None of the three, and that is the most common result.";
    } else {
      tone = "caution";
      lead = correct + " of the three.";
    }

    clear(openingFeedback);
    openingFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", lead));
    p.appendChild(document.createTextNode(
      " The pattern in the table is a crossover: two large effects that " +
      "cancel exactly when averaged."));
    openingFeedback.appendChild(p);
    var list = make("ul");
    [
      ["mainA", "Main effect of feedback", "No"],
      ["mainB", "Main effect of task", "No"],
      ["inter", "Interaction", "Yes"]
    ].forEach(function (entry) {
      var li = make("li");
      li.appendChild(make("strong", null,
        entry[1] + " — you said " + (answers[entry[0]] === "yes" ? "yes" : "no") +
        ", and the answer is " + entry[2].toLowerCase() + ". "));
      li.appendChild(document.createTextNode(WHY[entry[0]]));
      list.appendChild(li);
    });
    openingFeedback.appendChild(list);
    openingFeedback.hidden = false;

    lockForm(openingForm);
    openDetective();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Predictions skipped — demonstration mode.", "");
    lockForm(openingForm);
    openDetective();
  });

  /* =======================================================================
     Challenge — build the sentence
     ===================================================================== */

  var SLOTS = [
    {
      id: "slot-1",
      answer: "raised",
      why: "On the complex task the mean goes from 50 with immediate feedback " +
        "to 70 with delayed feedback, so delaying feedback raised scores by " +
        "20 points there."
    },
    {
      id: "slot-2",
      answer: "lowered",
      why: "On the simple task the mean goes from 70 down to 50, so delaying " +
        "feedback lowered scores by 20 points there. Two effects of the same " +
        "size pointing opposite ways is what makes the main effect zero."
    },
    {
      id: "slot-3",
      answer: "reversed",
      why: "The effect reverses direction: it is +20 in one condition and " +
        "−20 in the other. \"Bigger for complex tasks\" would describe a fan, " +
        "where both effects point the same way. \"Absent\" confuses the main " +
        "effect, which really is zero, with the effect of feedback, which is " +
        "the largest thing in the table."
    }
  ];

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = SLOTS.map(function (slot) { return $("#" + slot.id).value; });
    if (chosen.some(function (v) { return !v; })) {
      challengeError.textContent = "Fill all three gaps before checking.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = SLOTS.filter(function (slot, i) {
      return chosen[i] === slot.answer;
    }).length;

    var tone = right === 3 ? "good" : right === 0 ? "warn" : "caution";
    var lead = right === 3
      ? "Yes — and notice that the sentence never uses the word \"interaction\"."
      : right + " of the three gaps.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", lead));
    p.appendChild(document.createTextNode(
      " The correct sentence is: delaying feedback raised scores on complex " +
      "tasks and lowered scores on simple tasks, so overall the effect of " +
      "feedback reversed direction between the two task types. A reader who " +
      "gets only \"there was a significant interaction\" learns none of that."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    SLOTS.forEach(function (slot, i) {
      var li = make("li");
      li.appendChild(make("strong", null,
        "Gap " + (i + 1) + " — " +
        (chosen[i] === slot.answer ? "correct. " : "not this one. ")));
      li.appendChild(document.createTextNode(slot.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(lead, { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    detectiveSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    xFactor = "task";
    swapButton.textContent = "Put feedback on the horizontal axis";
    applyingPreset = true;
    DEFAULT_CELLS.forEach(function (value, i) {
      cellInputs[i].value = String(value);
    });
    applyingPreset = false;
    axisSelect.value = "zoom";
    errorSelect.value = "0";
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the three predictions above to open the detective.",
    { immediate: true });
})();
