/* =========================================================================
   Correlation: Linearity, Outliers and Shared Variance
   -------------------------------------------------------------------------
   Six generated datasets on a common 0-100 by 0-100 frame. Every one is
   produced by the same seeded generator, and x and y are deliberately unnamed
   so that no story about what they might be does the explaining.

       pos     y rises with x, correlation about .85
       neg     y falls with x, correlation about -.85
       none    x and y independent
       curve   y is a clean quadratic in x with little noise: a near-perfect
               relationship whose Pearson r is essentially zero
       small   twelve independent points, one of them ringed
       large   a hundred and twenty independent points, the same ringed point

   THREE CONTROLS, THREE LESSONS
   -----------------------------
   * The dataset menu shows that r measures STRAIGHTNESS: the curve has a
     near-perfect relationship and r near zero.
   * The pull slider drags the ringed observation towards the top-right corner
     in a straight line. In the twelve-point set this swings r across most of
     its range; in the hundred-and-twenty-point set the same movement barely
     registers. Influence comes from being extreme in x where nothing else is.
   * The units menu multiplies y by a constant. The slope moves by exactly
     that factor and r does not move at all, because the slope is r times the
     ratio of the standard deviations and therefore carries units.

   r squared is reported as the share of the variance in y accounted for by
   the straight-line relationship with x, with the word "accounted for" rather
   than "caused by", and 1 - r squared is printed beside it.

   THE CHALLENGE
   -------------
   Three small plots with known correlations, estimated on sliders. People
   systematically underestimate high correlations, and the feedback names that
   pattern rather than simply scoring the answers.

   No data leave the browser: no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CORNER = { x: 92, y: 92 };   // where the pull slider drags the ringed point
  var DEFAULTS = { set: "pos", pull: 0, units: "1" };
  var GUESS_TARGETS = [0.30, 0.90, -0.65];

  /* =======================================================================
     Seeded randomness
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normal(random) {
    var u = Math.max(random(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /** n points with an approximate target correlation, on a 0-100 frame. */
  function linearSet(seed, n, targetR) {
    var random = mulberry32(seed);
    var points = [];
    for (var i = 0; i < n; i += 1) {
      var zx = normal(random);
      var zy = targetR * zx + Math.sqrt(1 - targetR * targetR) * normal(random);
      points.push({
        x: clamp(50 + zx * 16, 3, 97),
        y: clamp(50 + zy * 16, 3, 97)
      });
    }
    return points;
  }

  var DATASETS = {
    pos: { label: "Strong positive", build: function () { return linearSet(3301, 40, 0.85); } },
    neg: { label: "Strong negative", build: function () { return linearSet(4177, 40, -0.85); } },
    none: { label: "No linear association", build: function () { return linearSet(5023, 40, 0); } },
    curve: {
      label: "A clean curve",
      build: function () {
        var random = mulberry32(6199);
        var points = [];
        for (var i = 0; i < 40; i += 1) {
          var x = 6 + (88 * i) / 39;
          var centred = (x - 50) / 44;
          points.push({
            x: x,
            y: clamp(12 + 78 * centred * centred + normal(random) * 3, 3, 97)
          });
        }
        return points;
      }
    },
    /* Both seeds are chosen so that the generated cloud has a correlation of
       essentially zero WITH and WITHOUT the ringed observation, which is what
       makes the pull slider's effect entirely attributable to the one point it
       moves. */
    small: { label: "One odd point, n = 12", build: function () { return linearSet(75133, 12, 0); } },
    large: { label: "The same odd point, n = 120", build: function () { return linearSet(1021, 120, 0); } }
  };

  /* =======================================================================
     Statistics
     ===================================================================== */

  function stats(points) {
    var n = points.length;
    if (n < 3) { return null; }
    var mx = 0;
    var my = 0;
    points.forEach(function (p) { mx += p.x; my += p.y; });
    mx /= n;
    my /= n;
    var sxx = 0;
    var syy = 0;
    var sxy = 0;
    points.forEach(function (p) {
      sxx += (p.x - mx) * (p.x - mx);
      syy += (p.y - my) * (p.y - my);
      sxy += (p.x - mx) * (p.y - my);
    });
    var r = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;
    var slope = sxx > 0 ? sxy / sxx : 0;
    return {
      n: n, mx: mx, my: my, r: r, r2: r * r, slope: slope,
      intercept: my - slope * mx,
      sdx: Math.sqrt(sxx / (n - 1)),
      sdy: Math.sqrt(syy / (n - 1))
    };
  }

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
    return value.toFixed(places === undefined ? 2 : places);
  }

  function signed(value, places) {
    var pl = places === undefined ? 2 : places;
    if (Math.abs(value) < Math.pow(10, -pl) / 2) { return (0).toFixed(pl); }
    return (value > 0 ? "+" : "−") + Math.abs(value).toFixed(pl);
  }

  function pct(p) { return (100 * p).toFixed(1) + "%"; }

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

  var shell = InteractiveShell.attach("#corr");
  if (!shell) { return; }

  var setSelect = $("#set-select");
  var pullRange = $("#pull-range");
  var unitsSelect = $("#units-select");
  var chartHeading = $("[data-chart-heading]");
  var scatter = $("[data-scatter]");
  var statTable = $("[data-stat-table]");
  var readout = $("[data-readout]");
  var verdictBox = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var caution = $("[data-caution]");
  var dropNote = $("[data-drop-note]");
  var dropTable = $("[data-drop-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var challengeSection = $("#challenge");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* Built once and reused, so the pictures do not change under the learner. */
  var built = {};
  Object.keys(DATASETS).forEach(function (key) {
    built[key] = DATASETS[key].build();
  });

  function currentPoints() {
    var base = built[setSelect.value];
    var pull = Number(pullRange.value) / 100;
    var units = Number(unitsSelect.value);
    return base.map(function (p, i) {
      var last = i === base.length - 1;
      var x = last ? p.x + (CORNER.x - p.x) * pull : p.x;
      var y = last ? p.y + (CORNER.y - p.y) * pull : p.y;
      return { x: x, y: y * units, ringed: last };
    });
  }

  /* =======================================================================
     Drawing
     ===================================================================== */

  var PLOT = { left: 40, right: 448, top: 12, base: 158 };

  function renderScatter(points, s) {
    clear(scatter);
    var units = Number(unitsSelect.value);
    var yLo = 0;
    var yHi = 100 * units;

    var X = function (v) {
      return PLOT.left + (v / 100) * (PLOT.right - PLOT.left);
    };
    var Y = function (v) {
      return PLOT.base - ((v - yLo) / (yHi - yLo)) * (PLOT.base - PLOT.top);
    };

    // Axes.
    scatter.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.top, x2: PLOT.left, y2: PLOT.base, class: "sc__axis" }));
    scatter.appendChild(svgNode("line",
      { x1: PLOT.left, y1: PLOT.base, x2: PLOT.right, y2: PLOT.base, class: "sc__axis" }));
    [0, 25, 50, 75, 100].forEach(function (v) {
      scatter.appendChild(svgNode("line",
        { x1: X(v), y1: PLOT.base, x2: X(v), y2: PLOT.base + 4, class: "sc__axis" }));
      scatter.appendChild(svgText(
        { x: X(v), y: PLOT.base + 16, "text-anchor": "middle" },
        String(v), "chart__axis"));
      scatter.appendChild(svgNode("line",
        { x1: PLOT.left - 4, y1: Y(v * units), x2: PLOT.left, y2: Y(v * units),
          class: "sc__axis" }));
      scatter.appendChild(svgText(
        { x: PLOT.left - 7, y: Y(v * units) + 4, "text-anchor": "end" },
        fmt(v * units, units < 1 ? 0 : 0), "chart__axis"));
    });

    // The least-squares line, across the plotted range.
    scatter.appendChild(svgNode("line", {
      x1: X(0), y1: Y(s.intercept), x2: X(100), y2: Y(s.intercept + 100 * s.slope),
      class: "sc__fit"
    }));

    points.forEach(function (p) {
      scatter.appendChild(svgNode("circle",
        { cx: X(p.x), cy: Y(p.y), r: 3.2, class: "sc__point" }));
      if (p.ringed) {
        scatter.appendChild(svgNode("circle",
          { cx: X(p.x), cy: Y(p.y), r: 7.5, class: "sc__ring" }));
      }
    });

    scatter.appendChild(svgText(
      { x: (PLOT.left + PLOT.right) / 2, y: PLOT.base + 32, "text-anchor": "middle" },
      "x — the ringed point is the one the slider moves", "chart__axis"));
    scatter.appendChild(svgText(
      { x: PLOT.left - 7, y: PLOT.top - 1, "text-anchor": "end" },
      "y", "chart__axis"));
  }

  function render() {
    var points = currentPoints();
    var s = stats(points);
    var units = Number(unitsSelect.value);

    chartHeading.textContent =
      DATASETS[setSelect.value].label + " — r = " + fmt(s.r);
    renderScatter(points, s);

    clear(statTable);
    [
      ["Observations", String(s.n)],
      ["Pearson r", fmt(s.r)],
      ["r squared", fmt(s.r2) + " (" + pct(s.r2) + " of the variance in y)"],
      ["Slope of the fitted line", fmt(s.slope) + " units of y per unit of x"],
      ["SD of x, SD of y", fmt(s.sdx, 1) + ", " + fmt(s.sdy, 1)]
    ].forEach(function (cells) { statTable.appendChild(row(cells)); });

    clear(readout);
    [
      ["Pearson r", fmt(s.r)],
      ["Variance accounted for", pct(s.r2)],
      ["Variance left over", pct(1 - s.r2)],
      ["Slope", fmt(s.slope)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    // The same dataset with the ringed point removed.
    var without = stats(points.slice(0, points.length - 1));
    clear(dropTable);
    [
      ["Observations", String(s.n), String(without.n)],
      ["Pearson r", fmt(s.r), fmt(without.r)],
      ["Variance accounted for", pct(s.r2), pct(without.r2)],
      ["Slope", fmt(s.slope), fmt(without.slope)]
    ].forEach(function (cells) { dropTable.appendChild(row(cells)); });

    var shift = Math.abs(s.r - without.r);
    dropNote.textContent = shift < 0.05
      ? "Removing the ringed observation changes r by " + fmt(shift) +
        ", which is nothing. With " + s.n + " observations no single point has " +
        "much say."
      : "Removing the ringed observation changes r by " + fmt(shift) +
        ", from " + fmt(s.r) + " to " + fmt(without.r) + ". One observation in " +
        s.n + " is deciding a large part of the answer. A diagnostic, not a " +
        "licence: an unusual point may be a recording error or the most " +
        "informative case in the set, and which one has to be argued.";

    var tone;
    var text;
    if (setSelect.value === "curve" && Number(pullRange.value) === 0) {
      tone = "warn";
      text =
        "r = " + fmt(s.r) + ", and the picture shows an almost perfect " +
        "relationship. Every value of x predicts its y to within a few points, " +
        "and Pearson's r reports essentially nothing, because it measures how " +
        "close the points come to a STRAIGHT line and this line is not " +
        "straight. \"No correlation\" and \"no relationship\" are different " +
        "findings, and only the picture tells them apart.";
    } else if (Math.abs(s.r) < 0.15) {
      tone = "neutral";
      text =
        "r = " + fmt(s.r) + ", so the straight-line relationship accounts for " +
        pct(s.r2) + " of the variance in y and leaves " + pct(1 - s.r2) +
        " unaccounted for. Before calling this \"no relationship\", check the " +
        "picture for a curve, and remember that a restricted range of x would " +
        "shrink r without changing anything about the underlying association.";
    } else if (Math.abs(s.r) < 0.55) {
      tone = "caution";
      text =
        "r = " + fmt(s.r) + ". The straight-line relationship accounts for " +
        pct(s.r2) + " of the variance in y, which leaves " + pct(1 - s.r2) +
        " it does not. That gap is worth saying out loud, because r squared " +
        "falls away far faster than r does: a correlation that sounds " +
        "respectable often accounts for a small share of the variation.";
    } else {
      tone = "good";
      text =
        "r = " + fmt(s.r) + ", accounting for " + pct(s.r2) + " of the " +
        "variance in y and leaving " + pct(1 - s.r2) + ". The wording matters: " +
        "accounted for by the straight-line relationship, not caused by x. " +
        "Nothing in a correlation distinguishes x causing y from y causing x, " +
        "from something else causing both, or from an artefact of who was " +
        "sampled.";
    }
    interpretation.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    var notes = [];
    if (units !== 1) {
      notes.push(
        "The units of y have been changed by a factor of " + fmt(units, 1) +
        ". The slope has moved by exactly that factor, to " + fmt(s.slope) +
        ", and r has not moved at all - because the slope is r times the ratio " +
        "of the two standard deviations and therefore carries units, while r " +
        "does not. That is why r can be compared across studies of different " +
        "measures and a slope generally cannot.");
    }
    if (Number(pullRange.value) > 0) {
      notes.push(
        "The ringed observation has been dragged " + pullRange.value +
        "% of the way to the corner. Open the disclosure below to see what the " +
        "dataset looks like without it.");
    }
    if (!notes.length) {
      notes.push(
        "Try the two controls beneath the dataset menu: one moves a single " +
        "observation, the other changes the units of y. One of them can move r " +
        "a long way and the other cannot move it at all.");
    }
    caution.textContent = notes.join(" ");
    return s;
  }

  setSelect.addEventListener("change", function () {
    // The two odd-point datasets open with the point already pulled out, so
    // the contrast between them is visible immediately.
    var key = setSelect.value;
    pullRange.value = (key === "small" || key === "large") ? "100" : "0";
    pullRange.dispatchEvent(new Event("input"));
    var s = render();
    shell.announce(
      DATASETS[key].label + ": " + s.n + " observations, r = " + fmt(s.r) +
      ", accounting for " + pct(s.r2) + " of the variance in y.",
      { immediate: true });
  });

  shell.bindRange(pullRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return v === 0
        ? "the ringed observation is where it was generated"
        : "the ringed observation has been pulled " + v +
          " per cent of the way to the corner";
    },
    onInput: render
  });

  unitsSelect.addEventListener("change", function () {
    var s = render();
    shell.announce(
      "Units of y changed. The slope is now " + fmt(s.slope) +
      " and r is still " + fmt(s.r) + ".", { immediate: true });
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    high: {
      tone: "caution",
      verdict: "Not this one — and the reason is the point of the page.",
      text:
        "A high positive r would mean the points lie close to an upward " +
        "straight line. A U-shape goes down and then up, so the two halves " +
        "pull in opposite directions and cancel. Load \"A clean curve\" in the " +
        "laboratory and read the number against the picture."
    },
    low: {
      tone: "caution",
      verdict: "Not this one either, for the same reason.",
      text:
        "A large negative r would mean a downward straight line. The first " +
        "half of a U is downward and the second half is upward, and Pearson's " +
        "r averages the two into almost nothing."
    },
    mid: {
      tone: "caution",
      verdict: "The instinct is right and the arithmetic is not.",
      text:
        "The instinct - a strong relationship should give a big number - is " +
        "exactly what r refuses to honour. r does not measure how strong the " +
        "relationship is; it measures how straight it is. A symmetric U gives " +
        "essentially zero however clean it is."
    },
    zero: {
      tone: "good",
      verdict: "Yes — and this is the single most useful thing to know about r.",
      text:
        "A symmetric curve gives r close to zero however tight the " +
        "relationship is, because the downward half and the upward half " +
        "cancel. Load \"A clean curve\" and read the number against the " +
        "picture. A results table containing only that number would be badly " +
        "misleading."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLab() {
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Laboratory unlocked, showing the strong positive dataset.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose a prediction before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* =======================================================================
     Challenge — the eyeball test
     ===================================================================== */

  var guessSets = GUESS_TARGETS.map(function (target, i) {
    return linearSet(9001 + i * 271, 40, target);
  });
  var guessStats = guessSets.map(stats);

  function drawGuessChart(index) {
    var svg = $('[data-guess-chart="' + index + '"]');
    var points = guessSets[index];
    var left = 22;
    var right = 288;
    var top = 10;
    var base = 148;
    clear(svg);
    svg.appendChild(svgNode("line",
      { x1: left, y1: top, x2: left, y2: base, class: "sc__axis" }));
    svg.appendChild(svgNode("line",
      { x1: left, y1: base, x2: right, y2: base, class: "sc__axis" }));
    points.forEach(function (p) {
      svg.appendChild(svgNode("circle", {
        cx: left + (p.x / 100) * (right - left),
        cy: base - (p.y / 100) * (base - top),
        r: 3, class: "sc__point"
      }));
    });
    var s = guessStats[index];
    $('[data-guess-alt="' + index + '"]').textContent =
      "Forty observations. The cloud runs " +
      (s.r > 0.15 ? "upwards from left to right"
        : s.r < -0.15 ? "downwards from left to right"
          : "with no consistent direction") +
      ", and its width relative to its length is what the estimate is about. " +
      "The value is revealed when you check.";
  }

  GUESS_TARGETS.forEach(function (target, i) {
    var input = $("#guess-" + i);
    var output = $('output[for="guess-' + i + '"]');
    function sync() {
      output.textContent = fmt(Number(input.value));
      input.setAttribute("aria-valuetext",
        "an estimated correlation of " + fmt(Number(input.value)));
    }
    input.addEventListener("input", sync);
    sync();
  });

  function showChallenge() {
    var wasHidden = challengeSection.hidden;
    challengeSection.hidden = false;
    GUESS_TARGETS.forEach(function (target, i) { drawGuessChart(i); });
    if (wasHidden) {
      $("#challenge-heading").focus();
      shell.announce(
        "The eyeball test is open below. Estimate all three, then check.",
        { immediate: true });
    }
  }

  $('[data-action="show-challenge"]').addEventListener("click", showChallenge);

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var guesses = GUESS_TARGETS.map(function (target, i) {
      return Number($("#guess-" + i).value);
    });
    var errors = guesses.map(function (g, i) {
      return g - guessStats[i].r;
    });
    var close = errors.filter(function (e) { return Math.abs(e) <= 0.15; }).length;
    var underOnStrong = (Math.abs(guesses[1]) < Math.abs(guessStats[1].r) - 0.05)
      && (Math.abs(guesses[2]) < Math.abs(guessStats[2].r) - 0.05);

    var tone = close === 3 ? "good" : close >= 1 ? "caution" : "warn";
    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict",
      close + " of the three within 0.15."));
    p.appendChild(document.createTextNode(
      underOnStrong
        ? " And you did the standard thing: you underestimated both of the " +
          "strong ones. Most people do, because a correlation of 0.9 still " +
          "leaves a visibly fat cloud and a correlation of 0.3 looks like " +
          "almost nothing at all."
        : " Estimating r by eye is genuinely hard, and the systematic error " +
          "in most people is to underestimate the strong ones."));
    challengeFeedback.appendChild(p);

    var list = make("ul");
    ["A", "B", "C"].forEach(function (name, i) {
      var s = guessStats[i];
      var li = make("li");
      li.appendChild(make("strong", null,
        "Scatterplot " + name + " — you said " + fmt(guesses[i]) +
        ", and r is " + fmt(s.r) + ". "));
      li.appendChild(document.createTextNode(
        "That accounts for " + pct(s.r2) + " of the variance in y and leaves " +
        pct(1 - s.r2) + " unaccounted for. " +
        (Math.abs(errors[i]) <= 0.15
          ? "Your estimate was close."
          : "You were out by " + fmt(Math.abs(errors[i])) + ", " +
            (Math.abs(guesses[i]) < Math.abs(s.r) ? "downwards." : "upwards."))));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    var note = make("p");
    note.appendChild(make("strong", null, "Why this matters. "));
    note.appendChild(document.createTextNode(
      "If a trained eye cannot read r off a picture, an untrained one cannot " +
      "read a relationship off a number either. The two have to be reported " +
      "together, which is the same conclusion the six datasets above arrive at " +
      "from the other direction."));
    challengeFeedback.appendChild(note);

    challengeFeedback.hidden = false;
    shell.announce(close + " of the three estimates were within 0.15.",
      { immediate: true });
  });

  /* =======================================================================
     Reset and start-up
     ===================================================================== */

  shell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    setSelect.value = DEFAULTS.set;
    pullRange.value = String(DEFAULTS.pull);
    unitsSelect.value = DEFAULTS.units;
    GUESS_TARGETS.forEach(function (target, i) {
      var input = $("#guess-" + i);
      input.value = "0";
      input.dispatchEvent(new Event("input"));
    });
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the prediction above to open the laboratory.",
    { immediate: true });
})();
