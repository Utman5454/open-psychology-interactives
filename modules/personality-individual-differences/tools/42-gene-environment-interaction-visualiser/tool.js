/* =========================================================================
   Gene × Environment Interaction Visualiser
   -------------------------------------------------------------------------
   Two fictional sensitivity groups, one environmental dimension, and three
   theories that predict three different pictures. Students see a restricted
   slice of the environment first, name the pattern, and then watch the range
   widen until the pattern turns into a different one.

   THE EDUCATIONAL MODEL
   ---------------------
   Outcome for a person in group g at environmental quality x (from -1, most
   adverse, to +1, most supportive):

       outcome(g, x) = intercept + slope(g) · (x - crossover) + noise

   Two groups: HIGHER and LOWER sensitivity. Both lines are straight; the
   whole of the difference between the three theories is where the lines are
   allowed to cross and over what range of x anybody looked.

     Diathesis-stress          the sensitive group does worse as the
                               environment worsens, and is no better than
                               anyone else when it improves. The lines
                               converge at the supportive end: crossover sits
                               at or beyond x = +1.
     Differential susceptibility  the sensitive group does worse in adverse
                               environments AND better in supportive ones.
                               The crossover sits inside the observed range.
     Vantage sensitivity       no group difference in adverse environments;
                               the sensitive group benefits more as things
                               improve. The lines converge at the adverse end:
                               crossover at or below x = -1.

   THE POINT OF THE TOOL
   ---------------------
   All three are the same two straight lines. Which theory a dataset appears
   to support depends on (a) where the crossover is and (b) HOW MUCH OF THE
   ENVIRONMENTAL RANGE WAS SAMPLED. Restrict a genuine differential-
   susceptibility pattern to its adverse half and it is indistinguishable from
   diathesis-stress. That is not a subtlety; it is the main reason the two
   literatures disagreed for years, and it is a fact about study design rather
   than about biology.

   WHAT IS DELIBERATELY ABSENT
   ---------------------------
   * No gene is named, and no genotype appears. The grouping variable is a
     fictional continuous "sensitivity score", split for display only.
   * No clinical outcome, disorder, diagnosis or risk estimate is used. The
     outcome axis is deliberately an unnamed, standardised outcome.
   * No deterministic language anywhere: a slope is an average tendency
     across a group, not a prediction about a person.
   * No effect size here corresponds to any published finding.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var POINTS = 90;

  var PRESETS = {
    diathesis: {
      name: "Diathesis–stress",
      slopeHigh: 0.95,
      slopeLow: 0.28,
      crossover: 1.0,
      summary:
        "The more sensitive group does worse as the environment worsens, and " +
        "is no better than anyone else once it improves. Sensitivity is a " +
        "vulnerability and nothing else."
    },
    differential: {
      name: "Differential susceptibility",
      slopeHigh: 0.95,
      slopeLow: 0.28,
      crossover: 0.0,
      summary:
        "The more sensitive group does worse in adverse environments and " +
        "better in supportive ones. Sensitivity is responsiveness in both " +
        "directions — for better and for worse."
    },
    vantage: {
      name: "Vantage sensitivity",
      slopeHigh: 0.95,
      slopeLow: 0.28,
      crossover: -1.0,
      summary:
        "No group difference when things are bad; the more sensitive group " +
        "gains more as things improve. Sensitivity is an advantage that only " +
        "shows when there is something to benefit from."
    }
  };

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

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function outcomeAt(params, group, x) {
    var slope = group === "high" ? params.slopeHigh : params.slopeLow;
    return slope * (x - params.crossover);
  }

  /** Scatter of fictional individuals within the observed range. */
  function generatePoints(params) {
    var random = mulberry32(params.seed);
    var points = { high: [], low: [] };
    ["high", "low"].forEach(function (group) {
      for (var i = 0; i < POINTS; i += 1) {
        var x = params.rangeLow +
          random() * (params.rangeHigh - params.rangeLow);
        points[group].push({
          x: x,
          y: outcomeAt(params, group, x) + normal(random) * params.noise
        });
      }
    });
    return points;
  }

  /**
   * Which theory does the pattern LOOK like, given only what was observed?
   * This deliberately reasons from the visible window, not from the true
   * crossover — because that is all a study ever has.
   */
  function classify(params) {
    var lo = params.rangeLow;
    var hi = params.rangeHigh;
    var gapLow = Math.abs(outcomeAt(params, "high", lo) - outcomeAt(params, "low", lo));
    var gapHigh = Math.abs(outcomeAt(params, "high", hi) - outcomeAt(params, "low", hi));
    var crossesInside = params.crossover > lo + 0.05 && params.crossover < hi - 0.05;
    var slopeGap = Math.abs(params.slopeHigh - params.slopeLow);

    if (slopeGap < 0.12) {
      return {
        id: "none",
        name: "No interaction visible",
        detail:
          "The two slopes are almost the same, so the environment is related " +
          "to the outcome in the same way in both groups. Whatever else is " +
          "true, there is no interaction to interpret here."
      };
    }
    if (crossesInside && gapLow > 0.15 && gapHigh > 0.15) {
      return {
        id: "differential",
        name: "Differential susceptibility",
        detail:
          "The lines cross inside the range you sampled, and the more " +
          "sensitive group is worse at one end and better at the other. This " +
          "is the pattern that supports sensitivity as responsiveness in both " +
          "directions — and it is only visible because your window includes " +
          "the crossover."
      };
    }
    if (gapLow > gapHigh * 1.6) {
      return {
        id: "diathesis",
        name: "Diathesis–stress",
        detail:
          "Within the range you sampled, the groups differ at the adverse end " +
          "and converge at the supportive end. That is the diathesis–stress " +
          "picture: sensitivity looks purely like vulnerability. Whether it " +
          "would still look like that in a wider window is a question your " +
          "data cannot answer."
      };
    }
    if (gapHigh > gapLow * 1.6) {
      return {
        id: "vantage",
        name: "Vantage sensitivity",
        detail:
          "Within the range you sampled, the groups are alike at the adverse " +
          "end and separate as the environment improves. That is vantage " +
          "sensitivity: the sensitive group gains more from good conditions, " +
          "and shows no extra cost in bad ones."
      };
    }
    return {
      id: "ambiguous",
      name: "Ambiguous",
      detail:
        "The slopes differ but the pattern does not clearly match any of the " +
        "three. Widen the range, or move the crossover, and it will resolve. " +
        "Real data frequently look like this, which is why the theoretical " +
        "claim is often less secure than the paper suggests."
    };
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(value, places) {
    return value === null || value === undefined || isNaN(value)
      ? "—"
      : value.toFixed(places === undefined ? 2 : places);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#gxe");
  if (!shell) { return; }

  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var chart = $("[data-chart]");
  var chartTable = $("[data-chart-table]");
  var patternName = $("[data-pattern-name]");
  var patternDetail = $("[data-pattern-detail]");
  var readout = $("[data-readout]");
  var presetButtons = page.querySelectorAll("[data-preset]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#explorer-section");
  var revealSection = $("#reveal");
  var revealBody = $("[data-reveal-body]");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* The opening round shows a deliberately restricted window onto a
     differential-susceptibility truth. */
  var OPENING_TRUTH = {
    slopeHigh: 0.95,
    slopeLow: 0.28,
    crossover: 0.0,
    rangeLow: -1.0,
    rangeHigh: 0.0,
    noise: 0.28,
    seed: 8812
  };

  var INITIAL = {
    stage: "predict",
    params: {
      slopeHigh: 0.95,
      slopeLow: 0.28,
      crossover: 0.0,
      rangeLow: -1.0,
      rangeHigh: 1.0,
      noise: 0.28,
      seed: 8812
    }
  };
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
      input.setAttribute(
        "aria-valuetext", (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() {
    rangeSyncs.forEach(function (sync) { sync(); });
  }

  [
    ["slopeHigh", "#slope-high-range", 100],
    ["slopeLow", "#slope-low-range", 100],
    ["crossover", "#crossover-range", 100],
    ["rangeLow", "#range-low-range", 100],
    ["rangeHigh", "#range-high-range", 100],
    ["noise", "#noise-range", 100]
  ].forEach(function (entry) {
    bindRange($(entry[1]), {
      format: function (value) { return (value / entry[2]).toFixed(2); },
      describe: function (value) {
        var v = value / entry[2];
        if (entry[0] === "crossover") {
          return v <= -0.9 ? "crossover at the adverse extreme, " + fmt(v)
            : v >= 0.9 ? "crossover at the supportive extreme, " + fmt(v)
            : "crossover inside the range, " + fmt(v);
        }
        if (entry[0] === "noise") {
          return v === 0 ? "no measurement noise" : "noise " + fmt(v);
        }
        return fmt(v);
      },
      onInput: function (value) {
        state.params[entry[0]] = value / entry[2];
        // Keep the observed window coherent.
        if (state.params.rangeLow > state.params.rangeHigh - 0.2) {
          if (entry[0] === "rangeLow") {
            state.params.rangeLow = state.params.rangeHigh - 0.2;
            $("#range-low-range").value = String(Math.round(state.params.rangeLow * 100));
          } else {
            state.params.rangeHigh = state.params.rangeLow + 0.2;
            $("#range-high-range").value = String(Math.round(state.params.rangeHigh * 100));
          }
        }
        render();
      }
    });
  });

  Array.prototype.forEach.call(presetButtons, function (button) {
    button.addEventListener("click", function () {
      var preset = PRESETS[button.getAttribute("data-preset")];
      state.params.slopeHigh = preset.slopeHigh;
      state.params.slopeLow = preset.slopeLow;
      state.params.crossover = preset.crossover;
      state.params.rangeLow = -1;
      state.params.rangeHigh = 1;
      applyParams();
      render();
      shell.announce(
        preset.name + " loaded. " + preset.summary, { immediate: true });
    });
  });

  function applyParams() {
    $("#slope-high-range").value = String(Math.round(state.params.slopeHigh * 100));
    $("#slope-low-range").value = String(Math.round(state.params.slopeLow * 100));
    $("#crossover-range").value = String(Math.round(state.params.crossover * 100));
    $("#range-low-range").value = String(Math.round(state.params.rangeLow * 100));
    $("#range-high-range").value = String(Math.round(state.params.rangeHigh * 100));
    $("#noise-range").value = String(Math.round(state.params.noise * 100));
    syncRanges();
  }

  /* --- Chart ---------------------------------------------------------------- */

  function drawChart(target, params, showPoints) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 460;
    var H = 260;
    var PAD_L = 44;
    var PAD_R = 14;
    var PAD_T = 12;
    var PAD_B = 40;

    clear(target);
    target.setAttribute("viewBox", "0 0 " + W + " " + H);

    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var xAt = function (x) { return PAD_L + ((x + 1) / 2) * plotW; };
    var yAt = function (y) { return PAD_T + (1 - (clamp(y, -2, 2) + 2) / 4) * plotH; };

    // Grid
    [-2, -1, 0, 1, 2].forEach(function (y) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(PAD_L));
      line.setAttribute("y1", String(yAt(y)));
      line.setAttribute("x2", String(W - PAD_R));
      line.setAttribute("y2", String(yAt(y)));
      line.setAttribute("class", "chart__grid");
      target.appendChild(line);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(PAD_L - 6));
      label.setAttribute("y", String(yAt(y) + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__axis");
      label.textContent = String(y);
      target.appendChild(label);
    });

    // Region outside the observed window, shaded and labelled.
    [[-1, params.rangeLow], [params.rangeHigh, 1]].forEach(function (span) {
      if (span[1] - span[0] <= 0.01) { return; }
      var rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", String(xAt(span[0])));
      rect.setAttribute("y", String(PAD_T));
      rect.setAttribute("width", String(xAt(span[1]) - xAt(span[0])));
      rect.setAttribute("height", String(plotH));
      rect.setAttribute("class", "gxe__unobserved");
      target.appendChild(rect);
    });

    // Axis labels
    [["most adverse", -1], ["neutral", 0], ["most supportive", 1]]
      .forEach(function (entry) {
        var label = document.createElementNS(NS, "text");
        label.setAttribute("x", String(xAt(entry[1])));
        label.setAttribute("y", String(H - 20));
        label.setAttribute(
          "text-anchor", entry[1] < 0 ? "start" : entry[1] > 0 ? "end" : "middle");
        label.setAttribute("class", "chart__axis");
        label.textContent = entry[0];
        target.appendChild(label);
      });

    var axisTitle = document.createElementNS(NS, "text");
    axisTitle.setAttribute("x", String(PAD_L + plotW / 2));
    axisTitle.setAttribute("y", String(H - 5));
    axisTitle.setAttribute("text-anchor", "middle");
    axisTitle.setAttribute("class", "chart__axis");
    axisTitle.textContent = "environmental quality →";
    target.appendChild(axisTitle);

    if (showPoints) {
      var points = generatePoints(params);
      ["low", "high"].forEach(function (group) {
        var d = points[group].map(function (p) {
          return "M " + xAt(p.x).toFixed(1) + " " + yAt(p.y).toFixed(1) + " l 0.01 0";
        }).join(" ");
        var path = document.createElementNS(NS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "gxe__points gxe__points--" + group);
        target.appendChild(path);
      });
    }

    // The two lines, drawn only across the observed window.
    ["low", "high"].forEach(function (group) {
      var x1 = params.rangeLow;
      var x2 = params.rangeHigh;
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(xAt(x1)));
      line.setAttribute("y1", String(yAt(outcomeAt(params, group, x1))));
      line.setAttribute("x2", String(xAt(x2)));
      line.setAttribute("y2", String(yAt(outcomeAt(params, group, x2))));
      line.setAttribute("class", "gxe__line gxe__line--" + group);
      target.appendChild(line);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(xAt(x2) - 4));
      label.setAttribute(
        "y", String(yAt(outcomeAt(params, group, x2)) + (group === "high" ? -6 : 14)));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = group === "high" ? "higher sensitivity" : "lower sensitivity";
      target.appendChild(label);
    });
  }

  function render() {
    if (mainSection.hidden) { return; }
    drawChart(chart, state.params, true);
    renderTable();
    renderReadout();
    var verdict = classify(state.params);
    patternName.textContent = verdict.name;
    patternDetail.textContent = verdict.detail;
    patternDetail.parentNode.setAttribute(
      "data-tone",
      verdict.id === "differential" ? "good"
        : verdict.id === "none" || verdict.id === "ambiguous" ? "caution" : "warn");
  }

  function renderTable() {
    clear(chartTable);
    var p = state.params;
    [
      ["At the adverse end of your window (" + fmt(p.rangeLow) + ")",
        outcomeAt(p, "high", p.rangeLow), outcomeAt(p, "low", p.rangeLow)],
      ["At the midpoint",
        outcomeAt(p, "high", (p.rangeLow + p.rangeHigh) / 2),
        outcomeAt(p, "low", (p.rangeLow + p.rangeHigh) / 2)],
      ["At the supportive end (" + fmt(p.rangeHigh) + ")",
        outcomeAt(p, "high", p.rangeHigh), outcomeAt(p, "low", p.rangeHigh)]
    ].forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row[0]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, fmt(row[1])));
      tr.appendChild(make("td", null, fmt(row[2])));
      tr.appendChild(make("td", null, fmt(row[1] - row[2])));
      chartTable.appendChild(tr);
    });
  }

  function renderReadout() {
    clear(readout);
    var p = state.params;
    var inside = p.crossover > p.rangeLow && p.crossover < p.rangeHigh;
    [
      ["Observed range", fmt(p.rangeLow) + " to " + fmt(p.rangeHigh)],
      ["Proportion of the full range sampled",
        Math.round(((p.rangeHigh - p.rangeLow) / 2) * 100) + "%"],
      ["Crossover", fmt(p.crossover) + (inside ? " (inside)" : " (outside)")]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  /* --- Opening round --------------------------------------------------------- */

  drawChart($("[data-opening-chart]"), OPENING_TRUTH, true);

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Name the pattern before the range is widened. That is the whole " +
        "exercise.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    lockForm(openingForm);

    var said = answer.value;
    clear(revealBody);
    revealBody.appendChild(
      make("p", "reveal__lead",
        said === "diathesis"
          ? "You said diathesis–stress — and from that window, that is exactly " +
            "what it looks like."
          : said === "differential"
          ? "You said differential susceptibility. From that window you could " +
            "not have known — but you were right about the underlying truth."
          : "You said " + (said === "vantage" ? "vantage sensitivity" : "no interaction") +
            ". Look again at where the lines were heading."));

    revealBody.appendChild(
      make("p", null,
        "The data you were shown covered only the adverse half of the " +
        "environmental range: from −1.00 to 0.00. Within that window the more " +
        "sensitive group does worse and the gap narrows as things improve, " +
        "which is the diathesis–stress signature and would be reported as such."));

    var wide = document.createElement("div");
    wide.className = "chart";
    var wideCaption = make("figcaption", "chart__caption",
      "The same two groups, with the full range sampled");
    var wideSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    wideSvg.setAttribute("class", "chart__svg");
    wideSvg.setAttribute("aria-hidden", "true");
    wideSvg.setAttribute("focusable", "false");
    wide.appendChild(wideCaption);
    wide.appendChild(wideSvg);
    revealBody.appendChild(wide);
    drawChart(
      wideSvg,
      {
        slopeHigh: OPENING_TRUTH.slopeHigh,
        slopeLow: OPENING_TRUTH.slopeLow,
        crossover: OPENING_TRUTH.crossover,
        rangeLow: -1,
        rangeHigh: 1,
        noise: OPENING_TRUTH.noise,
        seed: OPENING_TRUTH.seed
      },
      true);

    revealBody.appendChild(
      make("p", null,
        "Nothing about the two groups changed. The lines were always going to " +
        "cross; the first study simply did not sample the half of the range " +
        "where the crossing happens. The same people, the same slopes, and a " +
        "different theory — because of a decision about who to recruit."));

    revealBody.appendChild(
      make("p", null,
        "This is why the differential-susceptibility and diathesis–stress " +
        "literatures disagreed for so long. A finding of pure vulnerability is " +
        "only interpretable if the study included environments good enough for " +
        "an advantage to show up in. Most did not."));

    revealSection.hidden = false;
    mainSection.hidden = false;
    applyParams();
    render();
    $("#reveal-heading").focus();
    shell.announce(
      "Range widened. The same two groups now show differential " +
        "susceptibility rather than diathesis–stress.",
      { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    lockForm(openingForm);
    clear(revealBody);
    revealBody.appendChild(
      make("p", "reveal__lead", "Prediction skipped — demonstration mode."));
    revealBody.appendChild(
      make("p", null,
        "The opening data covered only the adverse half of the range. Widen it " +
        "in the explorer below and the same two groups produce a different " +
        "theory."));
    revealSection.hidden = false;
    mainSection.hidden = false;
    applyParams();
    render();
    shell.announce("Explorer unlocked.", { immediate: true });
  });

  /* --- Challenge -------------------------------------------------------------- */

  var EVIDENCE = {
    range: { good: true,
      text: "Environments good enough for an advantage to appear. Without the " +
            "supportive half of the range, differential susceptibility cannot " +
            "be distinguished from vulnerability, however large the sample." },
    crossover: { good: true,
      text: "A formal test of where the crossover point falls, with a " +
            "confidence interval — not just a visual impression that the lines " +
            "meet somewhere." },
    both: { good: true,
      text: "Evidence that the sensitive group is significantly better off at " +
            "the supportive end, not merely no worse. \"For better\" has to be " +
            "shown, not assumed from symmetry." },
    preregistered: { good: true,
      text: "A prediction registered in advance. Interaction terms are easy to " +
            "find after the fact and notoriously hard to replicate." },
    significant: { good: false,
      text: "A significant interaction term tells you the slopes differ. It " +
            "does not tell you where they cross, and all three theories predict " +
            "differing slopes." },
    larger: { good: false,
      text: "A larger sample makes the estimate more precise. It does not add " +
            "environments you did not sample, and precision about a restricted " +
            "range is still restricted." },
    plausible: { good: false,
      text: "Biological plausibility is a reason to take a hypothesis " +
            "seriously, not evidence that this pattern rather than that one is " +
            "present in these data." }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var checked = Array.prototype.slice.call(
      challengeForm.querySelectorAll('input[name="evidence"]:checked'));
    if (!checked.length) {
      showFeedback(challengeFeedback, "caution", "Choose at least one.", "");
      return;
    }
    var chosen = checked.map(function (input) { return input.value; });
    var good = chosen.filter(function (id) { return EVIDENCE[id].good; });
    var bad = chosen.filter(function (id) { return !EVIDENCE[id].good; });
    var totalGood = Object.keys(EVIDENCE).filter(function (id) {
      return EVIDENCE[id].good;
    }).length;

    clear(challengeFeedback);
    challengeFeedback.hidden = false;
    challengeFeedback.setAttribute(
      "data-tone", bad.length === 0 && good.length >= 3 ? "good" : "caution");

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      good.length + " of " + totalGood + " that would help" +
      (bad.length ? ", and " + bad.length + " that would not." : ", and nothing that would not.")));
    challengeFeedback.appendChild(lead);

    chosen.forEach(function (id) {
      var entry = make("p", "evidence__item");
      entry.appendChild(make("strong", null,
        EVIDENCE[id].good ? "Helps. " : "Does not help. "));
      entry.appendChild(document.createTextNode(EVIDENCE[id].text));
      challengeFeedback.appendChild(entry);
    });

    shell.announce("Challenge answered.", { immediate: true });
  });

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { paragraph.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(paragraph);
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

  /* --- Reset ------------------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    revealSection.hidden = true;
    mainSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    applyParams();
    drawChart($("[data-opening-chart]"), OPENING_TRUTH, true);
  });

  /* --- Start-up ---------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Name the pattern in the graph above before widening the range.",
    { immediate: true });
})();
