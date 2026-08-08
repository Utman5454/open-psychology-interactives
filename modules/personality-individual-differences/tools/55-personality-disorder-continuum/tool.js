/* =========================================================================
   Personality Disorder Continuum
   -------------------------------------------------------------------------
   Six dimensions, an entirely fictional profile, and two ways of drawing a
   category line across it. The tool never returns a diagnosis, contains no
   diagnostic instrument, asks nothing about the person using it, and names
   nobody.

   WHAT THE SIX DIMENSIONS ARE
   ---------------------------
   Trait extremity, rigidity, cross-situational persistence, subjective
   distress, interpersonal impact and functional impairment. All six are set
   by the student; none is computed from the others. That matters: a tool
   that derived impairment from trait extremity would build in the very
   assumption it is meant to examine, which is that unusual traits and
   difficulty are the same thing.

   WHAT IS COMPUTED
   ----------------
   One composite, used only for the categorical view:

       functioning difficulty = 0.30·rigidity + 0.25·persistence
                              + 0.25·impairment + 0.20·interpersonal impact

   Subjective distress is deliberately NOT in it, and the interpretation says
   so. Distress is a reason for help in its own right and can be present
   without impairment or absent with it; folding it in would hide that.

   THE TWO CATEGORY RULES
   ----------------------
     Count unusual traits    the profile falls above the line if trait
                             extremity does. This is the rule the tool is
                             arguing against, and it is not a straw man:
                             counting unusual features is how a great deal of
                             informal judgement actually works.
     Traits and difficulty   the profile falls above the line only if trait
                             extremity AND functioning difficulty both do —
                             the shape of modern hybrid models, in which
                             elevated traits without impaired functioning is
                             not a disorder-level pattern.

   The threshold is a slider because where the line goes is a decision, taken
   by people, revisable, and consequential. Moving it changes who is inside.

   THE FICTIONAL POPULATION
   ------------------------
   800 fictional profiles, generated once from a documented seed, with trait
   extremity ~ N(50, 18) and functioning difficulty ~ N(28, 16) correlated at
   about .55, both clipped to the 0-100 scale. The percentages above the line
   are counted from these 800 draws.

   These are invented numbers chosen to make the arithmetic of cut-offs
   visible. They are NOT prevalence estimates, they describe no real
   population, and they must not be quoted as though they did.

   WHAT THIS TOOL WILL NOT DO
   --------------------------
   It will not say that a profile has a disorder, produce a diagnostic label,
   score anybody, ask anything about the person using it, or reproduce any
   part of any diagnostic interview or criterion set. The interpretation
   describes what a configuration does and does not support and what remains
   unknown, which is the honest output of six numbers.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var DIMENSIONS = [
    {
      id: "extremity",
      name: "Trait extremity",
      short: "Extremity",
      question: "How far from the middle of the range this pattern of traits sits",
      low: "unremarkable",
      high: "very unusual"
    },
    {
      id: "rigidity",
      name: "Rigidity",
      short: "Rigidity",
      question: "How far the pattern can flex when a situation calls for something else",
      low: "flexible",
      high: "the same response whatever the situation"
    },
    {
      id: "persistence",
      name: "Cross-situational persistence",
      short: "Persistence",
      question: "How consistently the pattern appears across settings and over years",
      low: "one setting, recently",
      high: "everywhere, for as long as anyone remembers"
    },
    {
      id: "distress",
      name: "Subjective distress",
      short: "Distress",
      question: "How much difficulty the person experiences from the inside",
      low: "none reported",
      high: "considerable"
    },
    {
      id: "impact",
      name: "Interpersonal impact",
      short: "Impact",
      question: "How much difficulty other people experience around the pattern",
      low: "little",
      high: "substantial"
    },
    {
      id: "impairment",
      name: "Functional impairment",
      short: "Impairment",
      question: "How much the pattern interferes with work, study, relationships and self-direction",
      low: "no interference",
      high: "major interference"
    }
  ];

  /* Weights for the functioning composite. Documented in the notes; distress
     is absent on purpose. */
  var FUNCTIONING_WEIGHTS = {
    rigidity: 0.30,
    persistence: 0.25,
    impairment: 0.25,
    impact: 0.20
  };

  /* The fixed comparison profile: the same trait extremity as whatever the
     student has set, used flexibly, in settings that fit. Absolute rather
     than relative, so the contrast is the same every time it is shown. */
  var COMPARISON = {
    rigidity: 18,
    persistence: 22,
    distress: 14,
    impact: 20,
    impairment: 8
  };

  var PRESETS = {
    working: {
      name: "Unusual, and working",
      values: { extremity: 85, rigidity: 20, persistence: 35, distress: 15, impact: 20, impairment: 10 },
      note:
        "A distinctly unusual pattern of traits that flexes when it needs to, " +
        "in a life it suits. Try both category rules on this one."
    },
    difficulty: {
      name: "The same traits, much more difficulty",
      values: { extremity: 85, rigidity: 80, persistence: 85, distress: 70, impact: 75, impairment: 70 },
      note:
        "Trait extremity is identical to the previous setting. Everything " +
        "else is different, and so is what the profile would support."
    },
    distress: {
      name: "Distress without impairment",
      values: { extremity: 45, rigidity: 40, persistence: 50, distress: 85, impact: 30, impairment: 20 },
      note:
        "Considerable distress, little interference with functioning. Worth " +
        "help; not evidence of a disorder-level personality pattern."
    },
    setting: {
      name: "Difficulty in one setting only",
      values: { extremity: 70, rigidity: 70, persistence: 20, distress: 45, impact: 55, impairment: 35 },
      note:
        "Inflexible, but only in one place and only recently. Ask what is " +
        "happening in that place before you ask what is happening in the person."
    }
  };

  var POPULATION_SIZE = 800;
  var POPULATION_SEED = 51284;

  /* =======================================================================
     Seeded randomness — one fictional population, generated once, identical
     for every student and every projector.
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

  var POPULATION = (function () {
    var random = mulberry32(POPULATION_SEED);
    var people = [];
    for (var i = 0; i < POPULATION_SIZE; i += 1) {
      var shared = normal(random);
      var own = normal(random);
      people.push({
        extremity: clamp(50 + 18 * shared, 0, 100),
        functioning: clamp(28 + 16 * (0.55 * shared + 0.835 * own), 0, 100)
      });
    }
    return people;
  }());

  /* =======================================================================
     Model
     ===================================================================== */

  function functioning(values) {
    var total = 0;
    Object.keys(FUNCTIONING_WEIGHTS).forEach(function (key) {
      total += FUNCTIONING_WEIGHTS[key] * values[key];
    });
    return total;
  }

  /** Does a profile fall above the line under the given rule? */
  function aboveLine(extremity, functioningScore, rule, threshold) {
    if (rule === "traits") { return extremity >= threshold; }
    return extremity >= threshold && functioningScore >= threshold;
  }

  function populationAbove(rule, threshold) {
    var count = 0;
    POPULATION.forEach(function (person) {
      if (aboveLine(person.extremity, person.functioning, rule, threshold)) { count += 1; }
    });
    return count / POPULATION.length;
  }

  function comparisonValues(values) {
    var out = { extremity: values.extremity };
    Object.keys(COMPARISON).forEach(function (key) { out[key] = COMPARISON[key]; });
    return out;
  }

  function band(value) {
    if (value < 20) { return "very low"; }
    if (value < 40) { return "low"; }
    if (value < 60) { return "moderate"; }
    if (value < 80) { return "high"; }
    return "very high";
  }

  function round(v) { return Math.round(v); }
  function pct(v) { return (v * 100).toFixed(1).replace(/\.0$/, "") + "%"; }

  function make(tag, className, text) {
    var el = document.createElement(tag);
    if (className) { el.className = className; }
    if (text !== undefined && text !== null) { el.textContent = text; }
    return el;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#continuum");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var profileChart = $("[data-profile-chart]");
  var profileTable = $("[data-profile-table]");
  var populationChart = $("[data-population-chart]");
  var categoryTable = $("[data-category-table]");
  var categoryVerdict = $("[data-category-verdict]");
  var readout = $("[data-readout]");
  var interpretation = $("[data-interpretation]");
  var presetNote = $("[data-preset-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#continuum-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var DEFAULT_NOTE =
    "Four configurations worth comparing. The first two have identical trait " +
    "extremity, which is the point of them.";

  /* Two views, one at a time.
     Six sliders, a rule, a threshold, two charts and two tables on one screen
     meant the learner could not tell which output answered which control. The
     dimensional view and the categorical view are separate questions, so they
     are separate steps; the profile itself is shared, and step 2 draws its
     line across whatever step 1 was left set to. */
  var STEPS = {
    "1": {
      hint: "Set a profile and read what it does and does not support. Nothing " +
            "here is a category yet.",
      announce: "Step 1. The dimensional view."
    },
    "2": {
      hint: "The profile is as you left it. This step asks what changes when a " +
            "line is drawn across it, and what does not.",
      announce: "Step 2. Drawing a category line."
    }
  };

  var INITIAL = {
    step: "1",
    values: { extremity: 85, rigidity: 20, persistence: 35, distress: 15, impact: 20, impairment: 10 },
    rule: "traits",
    threshold: 60,
    compare: false,
    stage: "predict"
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
      input.setAttribute("aria-valuetext",
        (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() { rangeSyncs.forEach(function (s) { s(); }); }

  DIMENSIONS.forEach(function (dimension) {
    bindRange($("#" + dimension.id + "-range"), {
      format: function (v) { return band(v); },
      describe: function (v) {
        return dimension.name + " " + band(v) + " — " + dimension.question +
          ", from " + dimension.low + " to " + dimension.high + ".";
      },
      onInput: function (v) { state.values[dimension.id] = v; render(); }
    });
  });

  bindRange($("#threshold-range"), {
    format: function (v) { return String(v); },
    describe: function (v) {
      return "The category line is drawn at " + v +
        " on the 0 to 100 scale. Where it goes is a decision, not a discovery.";
    },
    onInput: function (v) { state.threshold = v; render(); }
  });

  $$('input[name="rule"]').forEach(function (input) {
    input.addEventListener("change", function () {
      if (!input.checked) { return; }
      state.rule = input.value;
      render();
      shell.announce(input.value === "traits"
        ? "Rule changed to counting unusual traits alone."
        : "Rule changed to requiring unusual traits and difficulty in functioning together.");
    });
  });

  $("#compare-toggle").addEventListener("change", function () {
    state.compare = this.checked;
    render();
    shell.announce(this.checked
      ? "Second profile shown: the same trait extremity, used flexibly."
      : "Second profile hidden.");
  });

  $$('input[name="continuum-step"]').forEach(function (input) {
    input.addEventListener("change", function () {
      if (!input.checked) { return; }
      state.step = input.value;
      applyStep();
      shell.announce(STEPS[state.step].announce + " " + STEPS[state.step].hint,
        { immediate: true });
    });
  });

  function applyStep() {
    $$("[data-step]").forEach(function (el) {
      el.hidden = el.getAttribute("data-step") !== state.step;
    });
    $("[data-step-hint]").textContent = STEPS[state.step].hint;
  }

  $$("[data-preset]").forEach(function (button) {
    button.addEventListener("click", function () {
      var preset = PRESETS[button.getAttribute("data-preset")];
      DIMENSIONS.forEach(function (dimension) {
        state.values[dimension.id] = preset.values[dimension.id];
      });
      presetNote.textContent = preset.note;
      applyState();
      render();
      shell.announce(preset.name + " loaded. " + preset.note, { immediate: true });
    });
  });

  function applyState() {
    $('input[name="continuum-step"][value="' + state.step + '"]').checked = true;
    applyStep();
    DIMENSIONS.forEach(function (dimension) {
      $("#" + dimension.id + "-range").value = String(state.values[dimension.id]);
    });
    $("#threshold-range").value = String(state.threshold);
    $('input[name="rule"][value="' + state.rule + '"]').checked = true;
    $("#compare-toggle").checked = state.compare;
    syncRanges();
  }

  /* =======================================================================
     Rendering
     ===================================================================== */

  function render() {
    if (mainSection.hidden) { return; }
    renderProfile();
    renderReadout();
    renderCategory();
    renderInterpretation();
  }

  function renderProfile() {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 34, BAR = 12, LEFT = 168, SCALE = 250;
    var other = state.compare ? comparisonValues(state.values) : null;

    clear(profileChart);
    profileChart.setAttribute("viewBox", "0 0 " + (LEFT + SCALE + 42) + " " +
      (DIMENSIONS.length * ROW + 12));

    DIMENSIONS.forEach(function (dimension, index) {
      var y = 8 + index * ROW;
      var value = state.values[dimension.id];

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = dimension.name;
      profileChart.appendChild(label);

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(LEFT));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(SCALE));
      track.setAttribute("height", String(BAR));
      track.setAttribute("class", "chart__track");
      profileChart.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(LEFT));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String((value / 100) * SCALE));
      bar.setAttribute("height", String(BAR));
      bar.setAttribute("class", "chart__bar");
      profileChart.appendChild(bar);

      var readbackValue = document.createElementNS(NS, "text");
      readbackValue.setAttribute("x", String(LEFT + SCALE + 6));
      readbackValue.setAttribute("y", String(y + BAR));
      readbackValue.setAttribute("class", "chart__count");
      readbackValue.textContent = String(round(value));
      profileChart.appendChild(readbackValue);

      if (other) {
        var second = document.createElementNS(NS, "rect");
        second.setAttribute("x", String(LEFT));
        second.setAttribute("y", String(y + BAR + 3));
        second.setAttribute("width", String((other[dimension.id] / 100) * SCALE));
        second.setAttribute("height", String(BAR - 4));
        second.setAttribute("class", "chart__bar continuum__bar--second");
        profileChart.appendChild(second);
      }
    });

    clear(profileTable);
    DIMENSIONS.forEach(function (dimension) {
      var value = state.values[dimension.id];
      var row = make("tr");
      var th = make("th", null, dimension.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, round(value) + " (" + band(value) + ")"));
      if (other) {
        row.appendChild(make("td", null,
          round(other[dimension.id]) + " (" + band(other[dimension.id]) + ")"));
      }
      profileTable.appendChild(row);
    });

    var head = $("[data-profile-head]");
    clear(head);
    var headRow = make("tr");
    ["Dimension", "This profile"].concat(other ? ["Second profile"] : []).forEach(function (text) {
      var th = make("th", null, text);
      th.setAttribute("scope", "col");
      headRow.appendChild(th);
    });
    head.appendChild(headRow);
  }

  function renderReadout() {
    clear(readout);
    var f = functioning(state.values);
    [
      ["Trait extremity", round(state.values.extremity) + " (" + band(state.values.extremity) + ")"],
      ["Functioning difficulty", round(f) + " (" + band(f) + ")"],
      ["Subjective distress", round(state.values.distress) + " (" + band(state.values.distress) + ")"],
      ["Category line at", String(state.threshold)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderCategory() {
    var NS = "http://www.w3.org/2000/svg";
    var SIZE = 210, LEFT = 40, TOP = 12;
    var f = functioning(state.values);
    var t = state.threshold;

    var x = function (v) { return LEFT + (v / 100) * SIZE; };
    var y = function (v) { return TOP + (1 - v / 100) * SIZE; };

    clear(populationChart);
    populationChart.setAttribute("viewBox", "0 0 " + (LEFT + SIZE + 16) + " " + (TOP + SIZE + 36));

    var frame = document.createElementNS(NS, "rect");
    frame.setAttribute("x", String(LEFT));
    frame.setAttribute("y", String(TOP));
    frame.setAttribute("width", String(SIZE));
    frame.setAttribute("height", String(SIZE));
    frame.setAttribute("class", "chart__track");
    populationChart.appendChild(frame);

    var dots = document.createElementNS(NS, "path");
    dots.setAttribute("d", POPULATION.map(function (person) {
      return "M " + x(person.extremity).toFixed(1) + " " + y(person.functioning).toFixed(1) + " l 0.01 0";
    }).join(" "));
    dots.setAttribute("class", "scatter__points");
    populationChart.appendChild(dots);

    var vertical = document.createElementNS(NS, "line");
    vertical.setAttribute("x1", String(x(t)));
    vertical.setAttribute("x2", String(x(t)));
    vertical.setAttribute("y1", String(TOP));
    vertical.setAttribute("y2", String(TOP + SIZE));
    vertical.setAttribute("class", "continuum__line");
    populationChart.appendChild(vertical);

    if (state.rule === "both") {
      var horizontal = document.createElementNS(NS, "line");
      horizontal.setAttribute("x1", String(x(t)));
      horizontal.setAttribute("x2", String(LEFT + SIZE));
      horizontal.setAttribute("y1", String(y(t)));
      horizontal.setAttribute("y2", String(y(t)));
      horizontal.setAttribute("class", "continuum__line");
      populationChart.appendChild(horizontal);
    }

    var marker = document.createElementNS(NS, "path");
    var mx = x(state.values.extremity), my = y(f);
    marker.setAttribute("d",
      "M " + (mx - 6) + " " + my + " h 12 M " + mx + " " + (my - 6) + " v 12");
    marker.setAttribute("class", "continuum__marker");
    populationChart.appendChild(marker);

    var xLabel = document.createElementNS(NS, "text");
    xLabel.setAttribute("x", String(LEFT + SIZE / 2));
    xLabel.setAttribute("y", String(TOP + SIZE + 20));
    xLabel.setAttribute("text-anchor", "middle");
    xLabel.setAttribute("class", "chart__axis");
    xLabel.textContent = "Trait extremity";
    populationChart.appendChild(xLabel);

    var yLabel = document.createElementNS(NS, "text");
    yLabel.setAttribute("transform", "rotate(-90 12 " + (TOP + SIZE / 2) + ")");
    yLabel.setAttribute("x", "12");
    yLabel.setAttribute("y", String(TOP + SIZE / 2));
    yLabel.setAttribute("text-anchor", "middle");
    yLabel.setAttribute("class", "chart__axis");
    yLabel.textContent = "Functioning difficulty";
    populationChart.appendChild(yLabel);

    var inside = aboveLine(state.values.extremity, f, state.rule, t);
    var traitsShare = populationAbove("traits", t);
    var bothShare = populationAbove("both", t);
    var otherRuleInside = aboveLine(state.values.extremity, f,
      state.rule === "traits" ? "both" : "traits", t);

    clear(categoryTable);
    [
      ["This profile, under the rule you have chosen",
        inside ? "above the line" : "below the line"],
      ["The same profile, under the other rule",
        otherRuleInside ? "above the line" : "below the line"],
      ["Fictional profiles above the line — counting unusual traits", pct(traitsShare)],
      ["Fictional profiles above the line — traits and difficulty together", pct(bothShare)],
      ["Distance from the line",
        state.rule === "traits"
          ? Math.abs(round(state.values.extremity - t)) + " points on trait extremity"
          : Math.min(Math.abs(state.values.extremity - t), Math.abs(f - t)).toFixed(0) +
            " points on whichever of the two is closer"]
    ].forEach(function (pair) {
      var row = make("tr");
      var th = make("th", null, pair[0]);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, pair[1]));
      categoryTable.appendChild(row);
    });

    var verdict;
    if (state.rule === "traits" && inside && f < t) {
      verdict =
        "Counting unusual traits alone puts this profile above the line, and " +
        "the difficulty in functioning is below it. Switch rules and the " +
        "profile moves. Nothing about the profile changed — only the " +
        "definition did.";
    } else if (state.rule === "both" && !inside && state.values.extremity >= t) {
      verdict =
        "The traits are above the line and the functioning difficulty is not, " +
        "so under this rule the profile is not a disorder-level pattern. That " +
        "is the whole difference between an unusual personality and a " +
        "personality disorder.";
    } else if (inside) {
      verdict =
        "This profile falls above the line as you have drawn it. Read that " +
        "as what it is: a fictional configuration on one side of a cut-off " +
        "you set, not a conclusion about anybody.";
    } else {
      verdict =
        "This profile falls below the line as you have drawn it. Note how " +
        "little has to move for that to change, and that nothing about the " +
        "profile itself is different on either side.";
    }
    categoryVerdict.textContent = verdict;
  }

  function renderInterpretation() {
    var v = state.values;
    var f = functioning(v);
    var text, tone;

    if (v.extremity >= 60 && f < 35) {
      tone = "good";
      text =
        "Unusual, and working. The traits are distinctive, they flex when a " +
        "situation asks them to, and they are not interfering with the life " +
        "being lived. Nothing here supports a disorder-level interpretation, " +
        "however unusual the profile looks.";
    } else if (v.persistence < 40 && f >= 45) {
      tone = "caution";
      text =
        "Inflexible, and confined. The difficulty is real but it does not " +
        "persist across settings or across time, and personality-disorder " +
        "concepts require exactly that persistence. The more parsimonious " +
        "explanations come first: what is happening in that setting, and " +
        "whether it is an environment that would produce this response in most " +
        "people. A pattern that appears in one place is a fact about a person " +
        "and a place together.";
    } else if (v.distress >= 70 && f < 40) {
      tone = "caution";
      text =
        "Distress without impairment. A reason for support in its own " +
        "right — help does not require a category. It is not evidence of a " +
        "disorder-level pattern: functioning is largely intact.";
    } else if (v.extremity >= 60 && f >= 60 && v.persistence >= 60) {
      tone = "warn";
      text =
        "Extreme, inflexible, persistent, and interfering. This is the " +
        "configuration that would lead a professional to look carefully — a " +
        "reason for an assessment, not the result of one.";
    } else if (f >= 45) {
      tone = "caution";
      text =
        "A mixed picture with real difficulty in it. These same six numbers " +
        "fit a personality pattern, a response to circumstances, something " +
        "episodic, or several at once — which is where careful assessment " +
        "earns its keep.";
    } else {
      tone = "good";
      text =
        "A profile within the ordinary range of human variation. People " +
        "differ, and differing is not a disorder. If you want to see the " +
        "point of the tool, raise trait extremity on its own and watch what " +
        "the two category rules do with it.";
    }

    interpretation.textContent = text;
    interpretation.setAttribute("data-tone", tone);
  }

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    unusual: {
      tone: "caution",
      verdict: "This is the answer the tool is built to complicate.",
      text:
        "Unusualness is a statistical fact about a distribution, not a " +
        "clinical one about a person. Plenty of people are unusual in ways " +
        "that cost them nothing, and a definition resting on unusualness " +
        "alone would sweep them in — as you can demonstrate in one click " +
        "below."
    },
    distress: {
      tone: "caution",
      verdict: "Part of it, and an important part.",
      text:
        "Distress matters enormously and is a reason for help by itself. But " +
        "it is neither necessary nor sufficient here: some patterns cause " +
        "little distress to the person and considerable difficulty in their " +
        "life, and a great deal of distress has causes that have nothing to " +
        "do with personality."
    },
    inflexible: {
      tone: "good",
      verdict: "This is where the weight sits.",
      text:
        "Inflexibility, persistence across situations and over time, and " +
        "interference with functioning are what current definitions rest on — " +
        "not the unusualness of the traits themselves. Below, you can hold the " +
        "traits constant and move everything else."
    },
    judgement: {
      tone: "good",
      verdict: "A serious answer, and not a cynical one.",
      text:
        "Where the line goes is a decision taken by people, it has moved " +
        "several times in living memory, and it does different work in " +
        "different cultural settings. That is not an argument that the " +
        "difficulties are imaginary — they are not — but it is a reason to " +
        "hold the category more lightly than the suffering it is meant to " +
        "describe. Try the threshold slider below."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the tool.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    unlockTool();
    $("#continuum-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    unlockTool();
  });

  function unlockTool() {
    state.stage = "explore";
    mainSection.hidden = false;
    applyState();
    render();
    shell.announce("Tool unlocked.", { immediate: true });
  }

  /* =======================================================================
     Challenge — a multi-select about what would justify what
     ===================================================================== */

  var CHALLENGE = {
    unusual: {
      defensible: false,
      text:
        "More unusual traits. Unusualness is a position in a distribution. " +
        "It carries no information about flexibility, persistence or " +
        "interference, and a definition built on it alone misclassifies " +
        "everybody who is merely distinctive."
    },
    inflexible: {
      defensible: true,
      text:
        "Inflexibility across situations. This is doing real work: a pattern " +
        "that cannot adapt when the situation calls for something else is the " +
        "core of what current definitions are pointing at."
    },
    duration: {
      defensible: true,
      text:
        "Persistence over years and across settings. Also central, and the " +
        "thing most often missed when a judgement is made from one setting on " +
        "one bad month."
    },
    impairment: {
      defensible: true,
      text:
        "Interference with work, study, relationships and self-direction. " +
        "Impairment is what turns a description of someone into a clinical " +
        "question, and it is the requirement that a trait-counting rule " +
        "leaves out."
    },
    distress: {
      defensible: false,
      text:
        "Distress alone. Distress is a reason to offer help and it belongs in " +
        "any assessment, but by itself it does not distinguish a personality " +
        "pattern from grief, exhaustion, a hostile environment, or an " +
        "ordinary bad year. It is neither necessary nor sufficient."
    },
    norms: {
      defensible: false,
      text:
        "Being unlike the people around them. Judgements of what is normal are " +
        "made from somewhere, and a pattern " +
        "that looks disordered from one cultural position may be an " +
        "intelligible response from another. Deviation from local norms is a " +
        "prompt to ask questions, never a criterion."
    },
    colleague: {
      defensible: false,
      text:
        "Someone finding them difficult. Interpersonal impact matters and it " +
        "is one of the six dimensions here, but a single person's irritation " +
        "is not evidence about a personality, and the relationship it comes " +
        "from has two people in it."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var picked = $$('input[name="challenge"]:checked', challengeForm).map(function (el) {
      return el.value;
    });

    if (!picked.length) {
      showFeedback(challengeFeedback, "caution", "Choose at least one.",
        "Some of these do real work and some do not, and saying which is the " +
        "exercise.");
      return;
    }

    var defensible = picked.filter(function (id) { return CHALLENGE[id].defensible; });
    var total = Object.keys(CHALLENGE).filter(function (id) {
      return CHALLENGE[id].defensible;
    }).length;

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone",
      defensible.length === picked.length && picked.length === total ? "good" : "caution");

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      defensible.length + " of your " + picked.length +
      " selections belong in the answer, and there are " + total + " that do."));
    lead.appendChild(document.createTextNode(
      " None of these three, on its own, is enough either: what matters is " +
      "that a pattern is inflexible, persistent and interfering together, " +
      "and that better explanations have been ruled out first."));
    challengeFeedback.appendChild(lead);

    var list = make("ul", "challenge__results");
    picked.forEach(function (id) {
      var li = make("li");
      li.setAttribute("data-defensible", CHALLENGE[id].defensible ? "yes" : "no");
      var p = make("p");
      p.appendChild(make("strong", null,
        CHALLENGE[id].defensible ? "Belongs in the answer. " : "Does not belong. "));
      p.appendChild(document.createTextNode(CHALLENGE[id].text));
      li.appendChild(p);
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;

    shell.announce("Challenge answered. " + defensible.length + " of " + picked.length +
      " selections belong in the answer.", { immediate: true });
  });

  /* =======================================================================
     Feedback plumbing, reset, start-up
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
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mainSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    presetNote.textContent = DEFAULT_NOTE;
    applyState();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the tool.",
    { immediate: true });
})();
