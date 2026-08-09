/* =========================================================================
   Positive Manifold Visualiser
   -------------------------------------------------------------------------
   Six fictional cognitive tasks, a correlation matrix students control, and
   three sliders that decide how much of each task's performance is shared,
   how much belongs to a group of related tasks, and how much is specific or
   error. The scatterplots, the loading diagram and the illustrative first
   factor all follow.

   THE EDUCATIONAL MODEL
   ---------------------
   Each simulated person's score on task i is

       z(i) = g·G  +  s(i)·Group(i)  +  u(i)·Specific(i)  +  e(i)·Error(i)

   with all four sources independent and standard normal, and the four
   coefficients scaled so the task score has unit variance. Tasks belong to
   one of two groups — verbal-ish and spatial-ish — which is what makes broad
   group factors possible at all.

   The model-implied correlation between two tasks is therefore

       r(i,j) = g² + s²·[same group]

   Neither specific variance nor error contributes to any correlation, which
   is exactly why raising the error slider shrinks every correlation towards
   zero without changing what the tasks measure.

   THE FIRST FACTOR
   ----------------
   The "illustrative first factor" is computed properly rather than asserted:
   the tool runs the power method on the model-implied correlation matrix to
   get its leading eigenvector and eigenvalue, and reports loadings as
   eigenvector · sqrt(eigenvalue). The proportion of variance it accounts for
   is eigenvalue / number of tasks.

   This matters pedagogically. The first factor is a summary of the matrix, so
   it always exists and always has positive loadings when the correlations are
   positive. Its existence is arithmetic. What it MEANS is not.

   THREE CONDITIONS
   ----------------
     Strong general factor   high shared variance, low group variance. Every
                             correlation similar, one dominant factor.
     Broad group factors     low shared, high group. Tasks correlate strongly
                             within their group and weakly across, and a first
                             factor still appears — which is the trap.
     Weak task relations     both low, error high. Correlations near zero and
                             the first factor explains little.

   WHAT THIS DOES NOT CLAIM
   ------------------------
   The positive manifold is an empirical regularity: cognitive tasks tend to
   correlate positively. That regularity is not in dispute. What a general
   factor extracted from it corresponds to IS in dispute, and the tool refuses
   to settle it: a factor here is a property of a correlation matrix, not a
   thing in a head. No real intelligence-test data, item or battery is
   reproduced.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var TASKS = [
    { id: "vocab", name: "Word meanings", group: "verbal", short: "Words" },
    { id: "analogy", name: "Verbal analogies", group: "verbal", short: "Analogies" },
    { id: "general", name: "Stored knowledge", group: "verbal", short: "Knowledge" },
    { id: "matrix", name: "Pattern completion", group: "spatial", short: "Patterns" },
    { id: "rotate", name: "Mental rotation", group: "spatial", short: "Rotation" },
    { id: "fold", name: "Paper folding", group: "spatial", short: "Folding" }
  ];

  var PRESETS = {
    general: {
      name: "Strong general factor",
      shared: 0.55, group: 0.10, error: 0.15,
      note:
        "Most of what the tasks have in common is common to all of them. " +
        "Every correlation is similar and one factor dominates."
    },
    groups: {
      name: "Broad group factors",
      shared: 0.12, group: 0.55, error: 0.15,
      note:
        "Tasks correlate strongly within their group and weakly across it. " +
        "A first factor still appears — watch what it does to the loadings."
    },
    weak: {
      name: "Weak task relations",
      shared: 0.08, group: 0.10, error: 0.65,
      note:
        "Almost everything is error or task-specific. The correlations are " +
        "near zero and the first factor explains very little."
    }
  };

  var SAMPLE = 220;

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

  /* =======================================================================
     Model
     ===================================================================== */

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /**
   * Turn the three sliders into per-source coefficients that leave each task
   * with unit variance. Specific variance takes whatever is left over, which
   * is why it is displayed rather than controlled.
   */
  function coefficients(settings) {
    var shared = clamp(settings.shared, 0, 0.95);
    var group = clamp(settings.group, 0, 0.95);
    var error = clamp(settings.error, 0, 0.95);
    var specific = Math.max(0, 1 - shared - group - error);
    var total = shared + group + error + specific;
    return {
      shared: shared / total,
      group: group / total,
      error: error / total,
      specific: specific / total
    };
  }

  /** Model-implied correlation between two tasks. */
  function modelCorrelation(a, b, parts) {
    if (a.id === b.id) { return 1; }
    return parts.shared + (a.group === b.group ? parts.group : 0);
  }

  function matrix(parts) {
    return TASKS.map(function (a) {
      return TASKS.map(function (b) { return modelCorrelation(a, b, parts); });
    });
  }

  /**
   * Leading eigenvector and eigenvalue by the power method. Used for the
   * illustrative first factor, so that the loadings shown are genuinely the
   * first principal component of the matrix on screen rather than a stand-in.
   */
  function firstFactor(m) {
    var n = m.length;
    var v = m.map(function () { return 1 / Math.sqrt(n); });
    var value = 0;

    for (var iteration = 0; iteration < 200; iteration += 1) {
      var next = m.map(function (row) {
        return row.reduce(function (sum, cell, j) { return sum + cell * v[j]; }, 0);
      });
      var norm = Math.sqrt(next.reduce(function (s, x) { return s + x * x; }, 0));
      if (norm < 1e-12) { break; }
      next = next.map(function (x) { return x / norm; });
      value = norm;
      var delta = next.reduce(function (s, x, i) { return s + Math.abs(x - v[i]); }, 0);
      v = next;
      if (delta < 1e-12) { break; }
    }

    // Sign convention: make loadings positive when the manifold is positive.
    if (v.reduce(function (s, x) { return s + x; }, 0) < 0) {
      v = v.map(function (x) { return -x; });
    }

    return {
      eigenvalue: value,
      loadings: v.map(function (x) { return x * Math.sqrt(Math.max(value, 0)); }),
      proportion: value / n
    };
  }

  /** Simulated people, for the scatterplots. */
  function sample(parts, seed) {
    var random = mulberry32(seed);
    var rows = [];
    for (var p = 0; p < SAMPLE; p += 1) {
      var g = normal(random);
      var groupScores = { verbal: normal(random), spatial: normal(random) };
      var person = {};
      TASKS.forEach(function (task) {
        person[task.id] =
          Math.sqrt(parts.shared) * g +
          Math.sqrt(parts.group) * groupScores[task.group] +
          Math.sqrt(parts.specific) * normal(random) +
          Math.sqrt(parts.error) * normal(random);
      });
      rows.push(person);
    }
    return rows;
  }

  function observedCorrelation(rows, a, b) {
    var x = rows.map(function (r) { return r[a]; });
    var y = rows.map(function (r) { return r[b]; });
    var n = x.length;
    var mx = x.reduce(function (s, v) { return s + v; }, 0) / n;
    var my = y.reduce(function (s, v) { return s + v; }, 0) / n;
    var sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i += 1) {
      var dx = x[i] - mx, dy = y[i] - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    }
    return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
  }

  /** Are all off-diagonal correlations positive? The manifold itself. */
  function manifoldHolds(m) {
    for (var i = 0; i < m.length; i += 1) {
      for (var j = i + 1; j < m.length; j += 1) {
        if (m[i][j] <= 0.001) { return false; }
      }
    }
    return true;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(v, p) {
    return v === null || v === undefined || isNaN(v) ? "—" : v.toFixed(p === undefined ? 2 : p);
  }

  function pct(v) { return Math.round(v * 100) + "%"; }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#manifold");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var matrixTable = $("[data-matrix]");
  var scatterChart = $("[data-scatter]");
  var scatterTable = $("[data-scatter-table]");
  var loadingChart = $("[data-loading-chart]");
  var loadingTable = $("[data-loading-table]");
  var readout = $("[data-readout]");
  var varianceBar = $("[data-variance-bar]");
  var interpretation = $("[data-interpretation]");
  var presetNote = $("[data-preset-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#visualiser-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var INITIAL = { shared: 0.55, group: 0.10, error: 0.15, seed: 7702, stage: "predict" };
  var state = null;
  var rangeSyncs = [];

  function bindRange(input, options) {
    var settings = options || {};
    var output = page.querySelector('output[for="' + input.id + '"]');
    function sync() {
      var value = Number(input.value);
      if (output) {
        output.textContent = settings.format ? settings.format(value) : String(value);
      }
      input.setAttribute("aria-valuetext",
        (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() { rangeSyncs.forEach(function (s) { s(); }); }

  [
    ["shared", "#shared-range", "shared by every task"],
    ["group", "#group-range", "shared only within a task group"],
    ["error", "#error-range", "measurement error"]
  ].forEach(function (entry) {
    bindRange($(entry[1]), {
      format: function (v) { return pct(v / 100); },
      describe: function (v) { return pct(v / 100) + " " + entry[2]; },
      onInput: function (v) { state[entry[0]] = v / 100; render(); }
    });
  });

  Array.prototype.forEach.call(page.querySelectorAll("[data-preset]"), function (button) {
    button.addEventListener("click", function () {
      var preset = PRESETS[button.getAttribute("data-preset")];
      state.shared = preset.shared;
      state.group = preset.group;
      state.error = preset.error;
      applyState();
      render();
      shell.announce(preset.name + " loaded. " + preset.note, { immediate: true });
    });
  });

  function applyState() {
    $("#shared-range").value = String(Math.round(state.shared * 100));
    $("#group-range").value = String(Math.round(state.group * 100));
    $("#error-range").value = String(Math.round(state.error * 100));
    syncRanges();
  }

  /* --- Rendering ------------------------------------------------------------ */

  function render() {
    if (mainSection.hidden) { return; }
    var parts = coefficients(state);
    var m = matrix(parts);
    var factor = firstFactor(m);
    var rows = sample(parts, state.seed);

    renderMatrix(m);
    renderScatter(rows, parts);
    renderLoadings(factor);
    renderReadout(parts, m, factor);
    renderVariance(parts);
    renderInterpretation(parts, m, factor);
  }

  function renderMatrix(m) {
    clear(matrixTable);

    var head = make("tr");
    var corner = make("th", null, "Task");
    corner.setAttribute("scope", "col");
    head.appendChild(corner);
    TASKS.forEach(function (task) {
      var th = make("th", null, task.short);
      th.setAttribute("scope", "col");
      head.appendChild(th);
    });
    matrixTable.appendChild(head);

    TASKS.forEach(function (a, i) {
      var row = make("tr");
      var th = make("th", null, a.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      TASKS.forEach(function (b, j) {
        var cell = make("td", null, i === j ? "—" : fmt(m[i][j]));
        if (i !== j) {
          cell.setAttribute("data-strength",
            m[i][j] >= 0.5 ? "high" : m[i][j] >= 0.25 ? "mid" : "low");
          cell.setAttribute("data-samegroup", a.group === b.group ? "yes" : "no");
        }
        row.appendChild(cell);
      });
      matrixTable.appendChild(row);
    });
  }

  /* Three scatterplots: within-group, across-group, and the pair the sliders
     move most. Points are drawn as one path of zero-length round-capped
     segments, which is far cheaper than 220 circles per panel. */
  function renderScatter(rows, parts) {
    var NS = "http://www.w3.org/2000/svg";
    var SIZE = 132, GAP = 18, TOP = 20;
    var pairs = [
      [TASKS[0], TASKS[1], "same group"],
      [TASKS[0], TASKS[3], "different groups"],
      [TASKS[3], TASKS[4], "same group"]
    ];

    clear(scatterChart);
    scatterChart.setAttribute("viewBox",
      "0 0 " + (pairs.length * (SIZE + GAP)) + " " + (SIZE + TOP + 26));

    pairs.forEach(function (pair, index) {
      var left = index * (SIZE + GAP);

      var title = document.createElementNS(NS, "text");
      title.setAttribute("x", String(left + SIZE / 2));
      title.setAttribute("y", "12");
      title.setAttribute("text-anchor", "middle");
      title.setAttribute("class", "chart__axis");
      title.textContent = pair[2];
      scatterChart.appendChild(title);

      var frame = document.createElementNS(NS, "rect");
      frame.setAttribute("x", String(left));
      frame.setAttribute("y", String(TOP));
      frame.setAttribute("width", String(SIZE));
      frame.setAttribute("height", String(SIZE));
      frame.setAttribute("class", "chart__track");
      scatterChart.appendChild(frame);

      var d = rows.map(function (person) {
        var x = clamp(person[pair[0].id], -3, 3);
        var y = clamp(person[pair[1].id], -3, 3);
        return "M " + (left + ((x + 3) / 6) * SIZE).toFixed(1) + " " +
          (TOP + (1 - (y + 3) / 6) * SIZE).toFixed(1) + " l 0.01 0";
      }).join(" ");
      var dots = document.createElementNS(NS, "path");
      dots.setAttribute("d", d);
      dots.setAttribute("class", "scatter__points");
      scatterChart.appendChild(dots);

      var r = observedCorrelation(rows, pair[0].id, pair[1].id);
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(left + SIZE / 2));
      label.setAttribute("y", String(TOP + SIZE + 16));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "chart__count");
      label.textContent = pair[0].short + " × " + pair[1].short + ": r = " + fmt(r);
      scatterChart.appendChild(label);
    });

    clear(scatterTable);
    pairs.forEach(function (pair) {
      var row = make("tr");
      var th = make("th", null, pair[0].name + " × " + pair[1].name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, pair[2]));
      row.appendChild(make("td", null,
        fmt(modelCorrelation(pair[0], pair[1], coefficients(state)))));
      row.appendChild(make("td", null, fmt(observedCorrelation(rows, pair[0].id, pair[1].id))));
      scatterTable.appendChild(row);
    });
  }

  function renderLoadings(factor) {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 30, BAR = 18, LEFT = 150, SCALE = 260;

    clear(loadingChart);
    loadingChart.setAttribute("viewBox", "0 0 460 " + (TASKS.length * ROW + 14));

    TASKS.forEach(function (task, index) {
      var y = 8 + index * ROW;
      var loading = factor.loadings[index];

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR - 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = task.name;
      loadingChart.appendChild(label);

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(LEFT));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(SCALE));
      track.setAttribute("height", String(BAR));
      track.setAttribute("class", "chart__track");
      loadingChart.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(LEFT));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(0, Math.min(loading, 1)) * SCALE));
      bar.setAttribute("height", String(BAR));
      bar.setAttribute("class", "chart__bar manifold__bar--" + task.group);
      loadingChart.appendChild(bar);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(LEFT + Math.max(0, Math.min(loading, 1)) * SCALE + 6));
      value.setAttribute("y", String(y + BAR - 4));
      value.setAttribute("class", "chart__count");
      value.textContent = fmt(loading);
      loadingChart.appendChild(value);
    });

    clear(loadingTable);
    TASKS.forEach(function (task, index) {
      var row = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, task.group === "verbal" ? "Verbal group" : "Spatial group"));
      row.appendChild(make("td", null, fmt(factor.loadings[index])));
      loadingTable.appendChild(row);
    });
  }

  function renderReadout(parts, m, factor) {
    clear(readout);
    var offDiagonal = [];
    for (var i = 0; i < TASKS.length; i += 1) {
      for (var j = i + 1; j < TASKS.length; j += 1) { offDiagonal.push(m[i][j]); }
    }
    var meanR = offDiagonal.reduce(function (s, v) { return s + v; }, 0) / offDiagonal.length;

    [
      ["Mean correlation", fmt(meanR)],
      ["Positive manifold", manifoldHolds(m) ? "holds" : "broken"],
      ["First factor explains", pct(factor.proportion)],
      ["Task-specific variance", pct(parts.specific)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderVariance(parts) {
    clear(varianceBar);
    [
      ["shared", "Shared by all", parts.shared],
      ["group", "Group only", parts.group],
      ["specific", "Task-specific", parts.specific],
      ["error", "Error", parts.error]
    ].forEach(function (entry) {
      if (entry[2] < 0.005) { return; }
      var part = make("div", "variance__part variance__part--" + entry[0]);
      part.style.width = (entry[2] * 100).toFixed(1) + "%";
      part.appendChild(make("span", "variance__label", entry[1] + " " + pct(entry[2])));
      varianceBar.appendChild(part);
    });
  }

  function renderInterpretation(parts, m, factor) {
    var offDiagonal = [];
    var within = [];
    var across = [];
    TASKS.forEach(function (a, i) {
      TASKS.forEach(function (b, j) {
        if (j <= i) { return; }
        offDiagonal.push(m[i][j]);
        (a.group === b.group ? within : across).push(m[i][j]);
      });
    });
    var meanWithin = within.reduce(function (s, v) { return s + v; }, 0) / within.length;
    var meanAcross = across.reduce(function (s, v) { return s + v; }, 0) / across.length;
    var gap = meanWithin - meanAcross;

    var text;
    var tone;

    if (!manifoldHolds(m)) {
      tone = "warn";
      text =
        "There is no positive manifold here: at least one pair of tasks is " +
        "essentially unrelated. A first factor can still be extracted — the " +
        "arithmetic does not refuse — but it now explains " +
        pct(factor.proportion) + " of the variance and summarises very little.";
    } else if (gap > 0.2) {
      tone = "caution";
      text =
        "The manifold holds — every correlation is positive — and it is not " +
        "uniform: tasks in the same group correlate " + fmt(meanWithin) +
        " on average against " + fmt(meanAcross) + " across groups. The " +
        "positive loadings are not evidence of a single general ability; they " +
        "follow from every correlation being positive, and the structure " +
        "underneath is plainly two groups.";
    } else if (factor.proportion > 0.5) {
      tone = "good";
      text =
        "The manifold holds and it is close to uniform: correlations within " +
        "and across groups are similar (" + fmt(meanWithin) + " against " +
        fmt(meanAcross) + "). The first factor explains " +
        pct(factor.proportion) + " of the variance, which is the pattern " +
        "usually described as a strong general factor. Note what has been " +
        "shown and what has not: this is a description of a correlation " +
        "matrix produced by sliders you set.";
    } else {
      tone = "neutral";
      text =
        "The manifold holds, weakly. Mean correlation within groups is " +
        fmt(meanWithin) + " and across groups " + fmt(meanAcross) + ", and " +
        "the first factor accounts for " + pct(factor.proportion) + ". " +
        "Correlations this size are compatible with several structures, which " +
        "is why factor solutions from weak matrices are unstable.";
    }

    interpretation.textContent = text;
    interpretation.setAttribute("data-tone", tone);
  }

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    entity: {
      tone: "caution",
      verdict: "That is the step to be careful about.",
      text:
        "A first factor is a summary of a correlation matrix. It exists " +
        "whenever the correlations do, and its loadings are positive whenever " +
        "the correlations are positive. Whether it corresponds to anything in " +
        "a head is a separate question, and the factor analysis cannot answer " +
        "it."
    },
    summary: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The positive manifold is an empirical regularity — cognitive tasks do " +
        "correlate positively, reliably, across samples and centuries. What " +
        "produces it is contested: a single capacity, several overlapping " +
        "ones, mutual reinforcement between abilities during development, or " +
        "sampling of overlapping processes. The pattern is the finding; the " +
        "explanation is a theory."
    },
    artefact: {
      tone: "caution",
      verdict: "Too strong the other way.",
      text:
        "The positive manifold is not an artefact of test construction. It " +
        "turns up with tasks chosen to be as different as possible, in samples " +
        "selected in different ways, and it has been replicated for over a " +
        "century. It is a real pattern that needs explaining, not a mistake to " +
        "be explained away."
    },
    unknown: {
      tone: "good",
      verdict: "Reasonable.",
      text:
        "The honest position for someone meeting this for the first " +
          "time. The pattern is solid; the interpretation is not settled; " +
          "and the two are worth keeping apart."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before building any matrices.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    applyState();
    render();
    $("#visualiser-heading").focus();
    shell.announce("Visualiser unlocked.", { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    applyState();
    render();
    shell.announce("Visualiser unlocked.", { immediate: true });
  });

  /* --- Challenge ---------------------------------------------------------------- */

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "both";
    showFeedback(
      challengeFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "Load \"Broad group factors\" and look at the first-factor loadings: all " +
        "six tasks load positively while the structure underneath is two " +
        "groups. Then load \"Strong general factor\" and look again — the " +
        "loadings look much the same. A positive first factor is compatible " +
        "with both, which is why extracting one settles nothing."
    );
    shell.announce("Challenge answered.", { immediate: true });
  });

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
      function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = false; });
    form.reset();
  }

  /* --- Reset ---------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mainSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    presetNote.textContent =
      "Three configurations worth comparing. Each one is a different answer to " +
      "\"what do these tasks have in common?\"";
    applyState();
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the visualiser.",
    { immediate: true });
})();
