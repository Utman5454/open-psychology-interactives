/* =========================================================================
   Conformity Under Context
   -------------------------------------------------------------------------
   A fictional group judgement task, six things about the situation that can be
   changed, and a model that splits the resulting conformity into two routes.

       1. Build a condition   - and keep every condition you run for comparison
       2. The people behind it- the distribution hiding inside the percentage

   THE EDUCATIONAL MODEL
   ---------------------
   Conformity on a critical round is treated as two independent routes that can
   each produce agreement:

       normative     = Bn x unanimityN x audience x identification x normClarity
       informational = Bi x ambiguity x (0.4 + 0.6 x majorityStatus) x unanimityI
       p             = 1 - (1 - normative) x (1 - informational)

   Two features do the teaching:

     * AUDIENCE only appears in the normative term. Making the response private
       collapses the normative route and leaves the informational route almost
       untouched, which is exactly the manipulation that distinguishes them.
     * UNANIMITY is a step function, not a headcount. Going from five to four
       confederates changes almost nothing; going from a unanimous majority to
       one with a single dissenter changes a great deal, and the model encodes
       that as 1.00 -> 0.30 for the normative route rather than as a proportion.

   IDENTIFICATION is the social-identity amendment the classic two-route account
   does not contain: a unanimous majority of people you do not regard as
   comparable to yourself exerts much less normative pull than the number
   suggests.

   Experiment 2 draws 100 simulated participants from a seeded generator
   (mulberry32, seed 20260311). Each has a susceptibility multiplier drawn from
   a skewed distribution; their per-round probability is p x susceptibility,
   clipped to the unit interval, and their rounds are Bernoulli draws. The group
   mean returns the headline figure; the distribution shows that the same figure
   is compatible with a substantial group who never conform at all.

   WHAT THIS IS NOT
   ----------------
   No historical study is reproduced: not its stimuli, not its procedure, not
   its data. The presets are named after recognisable set-ups so the comparison
   is legible, and their outputs are not those results. The parameters are chosen
   to put the classic conditions in roughly the right order of magnitude - a
   teaching decision, not a replication. Classic rates are not constants of the
   species, and the tool says so.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var B_NORMATIVE = 0.68;
  var B_INFORMATIONAL = 0.75;

  /* Unanimity is a step, not a proportion. Index = number of confederates who
     break with the majority answer. */
  var UNANIMITY_NORMATIVE = [1.00, 0.30, 0.22, 0.18];
  var UNANIMITY_INFORMATIONAL = [1.00, 0.60, 0.50, 0.45];

  var AUDIENCE = {
    aloud: { factor: 1.00, label: "aloud, in front of the group" },
    written: { factor: 0.35, label: "written, seen by the experimenter only" },
    anonymous: { factor: 0.15, label: "anonymous, seen by nobody" }
  };

  var CONTROLS = [
    {
      id: "dissenters", type: "range", min: 0, max: 3, step: 1, value: 0,
      label: "Confederates who break with the majority",
      hint: "Of the five others. The majority is still large at one dissenter - watch what happens anyway.",
      describe: function (v) {
        return v === 0 ? "none - the majority is unanimous"
          : v + " of the five gives a different answer first";
      }
    },
    {
      id: "identification", type: "range", min: 0, max: 100, step: 1, value: 55,
      label: "Identification with the group",
      hint: "How far the participant regards these five as people like themselves whose opinion is relevant to them.",
      describe: function (v) {
        return v + " per cent, between strangers with nothing in common and a group the participant belongs to"; }
    },
    {
      id: "audience", type: "select", value: "aloud",
      label: "How the participant answers",
      hint: "The manipulation that separates the two routes. Private responding removes the audience and leaves the evidence.",
      options: [
        ["aloud", "Aloud, after the others, in the room"],
        ["written", "Written down, seen by the experimenter only"],
        ["anonymous", "Anonymously, seen by nobody"]
      ]
    },
    {
      id: "ambiguity", type: "range", min: 0, max: 100, step: 1, value: 5,
      label: "Ambiguity of the judgement",
      hint: "How hard the display is to judge. At the bottom the right answer is obvious; at the top nobody could be sure.",
      describe: function (v) {
        return v + " per cent, between an obvious answer and one nobody could be sure of"; }
    },
    {
      id: "status", type: "range", min: 0, max: 100, step: 1, value: 50,
      label: "Standing of the majority",
      hint: "Whether the others appear to know what they are doing. Feeds the informational route only.",
      describe: function (v) {
        return v + " per cent, between visibly no better placed than the participant and clearly expert"; }
    },
    {
      id: "clarity", type: "range", min: 0, max: 100, step: 1, value: 90,
      label: "Clarity of what the group expects",
      hint: "How obvious it is what agreeing and disagreeing would mean here. Feeds the normative route only.",
      describe: function (v) {
        return v + " per cent, between no discernible expectation and an unmistakable one"; }
    }
  ];

  var PRESETS = [
    {
      id: "classic", label: "Classic public unanimous",
      values: { dissenters: 0, identification: 55, audience: "aloud", ambiguity: 5, status: 50, clarity: 90 },
      note:
        "An unambiguous judgement, five unanimous others, answers given aloud. " +
        "The set-up everybody remembers - and, in this model as in the " +
        "original, most rounds are still answered correctly."
    },
    {
      id: "ally", label: "One person disagrees first",
      values: { dissenters: 1, identification: 55, audience: "aloud", ambiguity: 5, status: 50, clarity: 90 },
      note:
        "The majority is still four to one. The rate collapses anyway, because " +
        "what has changed is not the arithmetic but whether another answer is " +
        "sayable."
    },
    {
      id: "private", label: "Private written response",
      values: { dissenters: 0, identification: 55, audience: "written", ambiguity: 5, status: 50, clarity: 90 },
      note:
        "Everything else identical. Compare the two bars with the classic " +
        "condition: the normative one falls away and the informational one, " +
        "which was small to begin with, does not move."
    },
    {
      id: "ambiguous", label: "Genuinely ambiguous display",
      values: { dissenters: 0, identification: 55, audience: "aloud", ambiguity: 92, status: 50, clarity: 90 },
      note:
        "Now the others are evidence rather than an audience. Try switching " +
        "this condition to a private written response: it barely helps, which " +
        "is the clearest sign that a different route is doing the work."
    },
    {
      id: "outgroup", label: "A group the participant is not part of",
      values: { dissenters: 0, identification: 8, audience: "aloud", ambiguity: 5, status: 50, clarity: 90 },
      note:
        "Five unanimous people, answering aloud, and the rate falls a long way. " +
        "The classic two-route account has no term for this; social identity " +
        "theory is the amendment that supplies one."
    },
    {
      id: "expert", label: "A visibly expert majority",
      values: { dissenters: 0, identification: 55, audience: "aloud", ambiguity: 70, status: 95, clarity: 90 },
      note:
        "A hard judgement made by people who look as though they know. Almost " +
        "all of the resulting agreement is informational - and in this case, " +
        "quite possibly correct."
    }
  ];

  /* =======================================================================
     Model
     ===================================================================== */

  function routes(values) {
    var normative =
      B_NORMATIVE *
      UNANIMITY_NORMATIVE[values.dissenters] *
      AUDIENCE[values.audience].factor *
      (values.identification / 100) *
      (values.clarity / 100);
    var informational =
      B_INFORMATIONAL *
      (values.ambiguity / 100) *
      (0.4 + 0.6 * (values.status / 100)) *
      UNANIMITY_INFORMATIONAL[values.dissenters];
    var total = 1 - (1 - normative) * (1 - informational);
    return { normative: normative, informational: informational, total: total };
  }

  /* =======================================================================
     Simulated participants
     ===================================================================== */

  var SEED = 20260311;
  var PEOPLE = 100;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Susceptibility is drawn once and reused, so switching conditions cannot be
     confounded with a different set of people. The distribution is skewed:
     most people are near the middle, a minority are markedly more and
     markedly less susceptible than average. */
  var SUSCEPTIBILITY = (function () {
    var rand = mulberry32(SEED);
    var values = [];
    for (var i = 0; i < PEOPLE; i += 1) {
      var u = rand();
      values.push(0.15 + 1.85 * u * u);
    }
    /* Normalised to a mean of exactly one, so that the average of the 100
       simulated people reproduces the headline rate from experiment 1 rather
       than sitting systematically below it. */
    var mean = values.reduce(function (t, v) { return t + v; }, 0) / values.length;
    return values.map(function (v) { return v / mean; });
  })();

  var ROUND_DRAWS = (function () {
    var rand = mulberry32(SEED + 7);
    var rows = [];
    for (var i = 0; i < PEOPLE; i += 1) {
      var person = [];
      for (var t = 0; t < 24; t += 1) { person.push(rand()); }
      rows.push(person);
    }
    return rows;
  })();

  function simulate(p, trials) {
    var counts = [];
    for (var i = 0; i < PEOPLE; i += 1) {
      var personP = Math.min(1, Math.max(0, p * SUSCEPTIBILITY[i]));
      var conformed = 0;
      for (var t = 0; t < trials; t += 1) {
        if (ROUND_DRAWS[i][t] < personP) { conformed += 1; }
      }
      counts.push(conformed);
    }
    return counts;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(p) { return Math.round(p * 100) + "%"; }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#conformity-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var presetBox = $("[data-presets]");
  var presetBoxMore = $("[data-presets-more]");
  var controlBox = $("[data-controls]");
  var controlBoxMore = $("[data-controls-more]");

  /* The two the activity opens with: how many others break with the majority,
     and whether the participant answers aloud. Everything else about the
     situation is one disclosure away and scores identically. */
  var CONTROL_CORE = ["dissenters", "audience"];

  /* The three conditions that exercise the two controls on show. The other
     three move the parameters behind the disclosure and sit beside them. */
  var PRESET_CORE = ["classic", "ally", "private"];
  var rateLine = $("[data-rate]");
  var routeSvg = $("[data-routes]");
  var routeText = $("[data-routes-text]");
  var historyBody = $("[data-history]");
  var historyNote = $("[data-history-note]");
  var trialsRange = $("#trials-range");
  var distributionLead = $("[data-distribution-lead]");
  var distributionNote = $("[data-distribution-note]");
  var histogramSvg = $("[data-histogram]");
  var histogramTable = $("[data-histogram-table]");
  var distributionVerdict = $("[data-distribution-verdict]");
  var stageTrack = $("[data-stage-track]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var STAGE_COUNT = 2;

  var INITIAL = {
    stage: 1,
    unlocked: false,
    values: {
      dissenters: 0, identification: 55, audience: "aloud",
      ambiguity: 5, status: 50, clarity: 90
    },
    label: "Your own settings",
    trials: 12,
    history: []
  };
  var state = null;

  /* --- Controls ------------------------------------------------------------ */

  function buildPresets() {
    clear(presetBox);
    clear(presetBoxMore);
    PRESETS.forEach(function (preset) {
      var button = make("button", "button button--secondary", preset.label);
      button.type = "button";
      button.addEventListener("click", function () {
        Object.keys(preset.values).forEach(function (key) {
          state.values[key] = preset.values[key];
        });
        state.label = preset.label;
        record(preset.label);
        syncControls();
        renderStage1();
        renderStage2();
        shell.announce(preset.label + " loaded. " + rateLine.textContent + " " +
          preset.note, { immediate: true });
        historyNote.textContent = preset.note;
      });
      (PRESET_CORE.indexOf(preset.id) === -1 ? presetBoxMore : presetBox)
        .appendChild(button);
    });
  }

  function buildControls() {
    clear(controlBox);
    clear(controlBoxMore);
    CONTROLS.forEach(function (control) {
      var wrap = make("div", "control");
      var header = make("div", "control__header");
      var label = make("label", "control__label", control.label);
      label.setAttribute("for", "c-" + control.id);
      header.appendChild(label);
      if (control.type === "range") {
        var output = document.createElement("output");
        output.className = "control__value";
        output.setAttribute("for", "c-" + control.id);
        output.setAttribute("data-output", control.id);
        header.appendChild(output);
      }
      wrap.appendChild(header);

      var input;
      if (control.type === "range") {
        input = document.createElement("input");
        input.type = "range";
        input.min = String(control.min); input.max = String(control.max);
        input.step = String(control.step);
      } else {
        input = document.createElement("select");
        control.options.forEach(function (option) {
          var node = document.createElement("option");
          node.value = option[0];
          node.textContent = option[1];
          input.appendChild(node);
        });
      }
      input.id = "c-" + control.id;
      input.addEventListener("input", function () { onControl(control, input); });
      input.addEventListener("change", function () { onControl(control, input); });
      wrap.appendChild(input);
      wrap.appendChild(make("p", "control__hint", control.hint));
      (CONTROL_CORE.indexOf(control.id) === -1 ? controlBoxMore : controlBox)
        .appendChild(wrap);
    });
  }

  function onControl(control, input) {
    state.values[control.id] =
      control.type === "range" ? Number(input.value) : input.value;
    state.label = "Your own settings";
    syncControls();
    renderStage1();
    renderStage2();
    shell.announce(control.label + " changed. " + rateLine.textContent);
  }

  function syncControls() {
    CONTROLS.forEach(function (control) {
      var input = $("#c-" + control.id);
      var value = state.values[control.id];
      input.value = String(value);
      if (control.type === "range") {
        var output = $('[data-output="' + control.id + '"]');
        output.textContent = control.id === "dissenters"
          ? String(value) : value + "%";
        input.setAttribute("aria-valuetext", control.describe(value));
      }
    });
    trialsRange.value = String(state.trials);
  }

  /* --- Experiment 1 --------------------------------------------------------- */

  function record(label) {
    var r = routes(state.values);
    state.history = state.history.filter(function (row) {
      return row.label !== label;
    });
    state.history.push({
      label: label,
      total: r.total, normative: r.normative, informational: r.informational
    });
    renderHistory();
  }

  function renderHistory() {
    clear(historyBody);
    if (!state.history.length) {
      var row = make("tr");
      var cell = make("td", null,
        "Nothing recorded yet. Load a classic condition to start the " +
        "comparison, or press \"Record this condition\" under the sliders.");
      cell.colSpan = 4;
      row.appendChild(cell);
      historyBody.appendChild(row);
      return;
    }
    state.history.forEach(function (entry) {
      var row = make("tr");
      var th = make("th", null, entry.label);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, pct(entry.total)));
      row.appendChild(make("td", null, pct(entry.normative)));
      row.appendChild(make("td", null, pct(entry.informational)));
      historyBody.appendChild(row);
    });
  }

  function renderStage1() {
    var r = routes(state.values);
    rateLine.textContent =
      pct(r.total) + " of critical rounds - the average simulated participant.";

    var NS = "http://www.w3.org/2000/svg";
    clear(routeSvg);
    [
      { label: "Normative", value: r.normative, cls: "bar--normative" },
      { label: "Informational", value: r.informational, cls: "bar--informational" }
    ].forEach(function (route, index) {
      var y = 8 + index * 32;
      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", "104"); track.setAttribute("y", String(y));
      track.setAttribute("width", "170"); track.setAttribute("height", "18");
      track.setAttribute("class", "chart__track");
      routeSvg.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", "104"); bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(1, route.value * 170)));
      bar.setAttribute("height", "18");
      bar.setAttribute("class", route.cls);
      routeSvg.appendChild(bar);

      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", "100"); name.setAttribute("y", String(y + 13));
      name.setAttribute("text-anchor", "end");
      name.setAttribute("class", "chart__label");
      name.textContent = route.label;
      routeSvg.appendChild(name);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(104 + Math.max(1, route.value * 170) + 5));
      value.setAttribute("y", String(y + 13));
      value.setAttribute("class", "chart__count");
      value.textContent = pct(route.value);
      routeSvg.appendChild(value);
    });

    var dominant = r.normative > r.informational * 1.5 ? "normative"
      : r.informational > r.normative * 1.5 ? "informational" : "neither";
    routeText.textContent =
      "Normative route " + pct(r.normative) + ", informational route " +
      pct(r.informational) + ", combined " + pct(r.total) + ". " +
      (dominant === "normative"
        ? "Agreement here is mostly about the audience. Switch the response to " +
          "written and watch this fall while the other bar stays put."
        : dominant === "informational"
        ? "Agreement here is mostly about uncertainty. Making the response " +
          "private will barely help, because there is no audience effect to " +
          "remove - these people are being persuaded rather than pressed."
        : "Both routes are contributing. This is the condition in which the " +
          "usual classroom argument about \"did they really believe it\" cannot " +
          "be settled from the rate alone.");
  }

  /* --- Experiment 2 --------------------------------------------------------- */

  function renderStage2() {
    var r = routes(state.values);
    var counts = simulate(r.total, state.trials);
    var mean = counts.reduce(function (t, c) { return t + c; }, 0) /
      (PEOPLE * state.trials);
    var never = counts.filter(function (c) { return c === 0; }).length;
    var most = counts.filter(function (c) { return c > state.trials / 2; }).length;

    distributionLead.textContent =
      pct(mean) + " of rounds overall - and " + never + " of the 100 never " +
      "conformed once.";
    distributionNote.textContent =
      most + " of the 100 conformed on more than half their rounds. Condition: " +
      state.label.toLowerCase() + ", " + state.trials + " critical rounds each.";

    /* Histogram over proportion-of-rounds bands. */
    var bands = [0, 0, 0, 0, 0];
    counts.forEach(function (count) {
      var share = count / state.trials;
      var index = share === 0 ? 0
        : share <= 0.25 ? 1
        : share <= 0.5 ? 2
        : share <= 0.75 ? 3 : 4;
      bands[index] += 1;
    });
    var labels = ["none", "1-25%", "26-50%", "51-75%", "76-100%"];

    var NS = "http://www.w3.org/2000/svg";
    clear(histogramSvg);
    var maxBand = Math.max.apply(null, bands) || 1;
    bands.forEach(function (value, index) {
      var x = 26 + index * 58;
      var height = (value / maxBand) * 92;
      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(x)); bar.setAttribute("y", String(110 - height));
      bar.setAttribute("width", "42"); bar.setAttribute("height", String(Math.max(1, height)));
      bar.setAttribute("class", index === 0 ? "bar--never" : "chart__bar");
      histogramSvg.appendChild(bar);

      var count = document.createElementNS(NS, "text");
      count.setAttribute("x", String(x + 21)); count.setAttribute("y", String(104 - height));
      count.setAttribute("text-anchor", "middle");
      count.setAttribute("class", "chart__count");
      count.textContent = String(value);
      histogramSvg.appendChild(count);

      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", String(x + 21)); name.setAttribute("y", "126");
      name.setAttribute("text-anchor", "middle");
      name.setAttribute("class", "chart__label");
      name.textContent = labels[index];
      histogramSvg.appendChild(name);
    });
    var axis = document.createElementNS(NS, "text");
    axis.setAttribute("x", "160"); axis.setAttribute("y", "144");
    axis.setAttribute("text-anchor", "middle");
    axis.setAttribute("class", "chart__axis");
    axis.textContent = "share of critical rounds on which the person conformed";
    histogramSvg.appendChild(axis);

    clear(histogramTable);
    bands.forEach(function (value, index) {
      var row = make("tr");
      var th = make("th", null, labels[index] + " of rounds");
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, String(value)));
      histogramTable.appendChild(row);
    });

    clear(distributionVerdict);
    distributionVerdict.setAttribute("data-tone", "neutral");
    distributionVerdict.appendChild(make("h5", "verdict__title",
      "Two true sentences about the same result"));
    distributionVerdict.appendChild(make("p", "verdict__body",
      "\"Participants conformed on " + pct(mean) + " of critical rounds.\""));
    distributionVerdict.appendChild(make("p", "verdict__body",
      "\"" + never + " per cent of participants never conformed at all, and " +
      (100 - most) + " per cent conformed on half their rounds or fewer.\""));
    distributionVerdict.appendChild(make("p", "verdict__note",
      "Both are accurate summaries of the same 100 simulated people. They " +
      "leave very different impressions, and only the first one is usually " +
      "quoted."));
  }

  /* --- Stage plumbing -------------------------------------------------------- */

  function setStage(next) {
    state.stage = Math.max(1, Math.min(STAGE_COUNT, next));
    render();
    var heading = $('.stage__primary[data-stage="' + state.stage + '"] .stage__heading');
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    shell.announce("Experiment " + state.stage + " of 2.", { immediate: true });
  }

  $('[data-action="next"]').addEventListener("click", function () {
    setStage(state.stage + 1);
  });
  $('[data-action="prev"]').addEventListener("click", function () {
    setStage(state.stage - 1);
  });

  function render() {
    $$("[data-stage]", shell.root).forEach(function (node) {
      if (node.parentNode === stageTrack) { return; }
      node.hidden = node.getAttribute("data-stage") !== String(state.stage);
    });
    $$("li", stageTrack).forEach(function (node) {
      var index = Number(node.getAttribute("data-stage"));
      node.removeAttribute("aria-current");
      node.removeAttribute("data-state");
      if (index === state.stage) {
        node.setAttribute("aria-current", "step");
      } else if (index < state.stage) {
        node.setAttribute("data-state", "done");
      }
    });
    $('[data-action="prev"]').disabled = state.stage === 1;
    $('[data-action="next"]').disabled = state.stage === STAGE_COUNT;

    syncControls();
    renderStage1();
    renderStage2();
    renderHistory();
  }

  shell.bindRange("#trials-range", {
    format: function (value) { return String(value); },
    describe: function (value) { return value + " critical rounds per participant"; },
    onInput: function (value) {
      if (!state) { return; }
      state.trials = value;
      renderStage2();
    }
  });

  /* --- Record button --------------------------------------------------------- */

  var recordButton = make("button", "button button--secondary", "Record this condition");
  recordButton.type = "button";
  recordButton.addEventListener("click", function () {
    var name = state.label === "Your own settings"
      ? "Custom " + (state.history.filter(function (row) {
          return row.label.indexOf("Custom") === 0;
        }).length + 1)
      : state.label;
    record(name);
    historyNote.textContent =
      "Recorded as \"" + name + "\". Change one thing and record again - the " +
      "comparison is more use than any single row.";
    shell.announce("Condition recorded: " + name + ". " + rateLine.textContent,
      { immediate: true });
  });

  /* --- Challenge -------------------------------------------------------------- */

  var CLAIM_OPTIONS = [
    { value: "normative", label: "Mainly the normative route" },
    { value: "informational", label: "Mainly the informational route" },
    { value: "both", label: "Both, substantially" }
  ];

  var CLAIMS = [
    {
      id: "written",
      text: "The participant writes the answer down instead of saying it aloud.",
      answer: "normative",
      why:
        "Private responding removes the audience and leaves the evidence " +
        "untouched. In the model the audience factor enters only the normative " +
        "term - which is what makes the two routes different claims rather " +
        "than two words."
    },
    {
      id: "harder",
      text: "The display is made genuinely hard to judge.",
      answer: "informational",
      why:
        "Uncertainty is what makes other people worth attending to as evidence. " +
        "Ambiguity does not change what disagreeing would cost, so the " +
        "normative term is unmoved. Run the ambiguous preset and then switch to " +
        "a private response: the rate barely falls."
    },
    {
      id: "ally",
      text: "One of the five gives a different answer before the participant replies.",
      answer: "both",
      why:
        "A dissenter does two things at once. Socially, another answer becomes " +
        "sayable, so the cost of departing from the majority drops sharply. " +
        "Evidentially, the majority stops being a united body of testimony. The " +
        "model reduces both terms, and the normative one much more."
    },
    {
      id: "outgroup",
      text:
        "The five others turn out to be from a group the participant regards as " +
        "having nothing to do with them.",
      answer: "normative",
      why:
        "Identification enters the normative term only - the amendment the " +
        "classic two-route account lacks. Conformity stops looking like a " +
        "property of people in groups and starts looking like a property of a " +
        "relationship between particular groups."
    },
    {
      id: "expert",
      text: "The five others are visibly better placed to judge than the participant.",
      answer: "informational",
      why:
        "Standing feeds the informational term: better-placed people are " +
        "better evidence. Note that when the judgement is easy this changes " +
        "almost nothing, because there is no uncertainty for the evidence to " +
        "act on - status and ambiguity multiply rather than add."
    }
  ];

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
      CLAIM_OPTIONS.forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "claim-" + claim.id;
        input.value = option.value;
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      claimsList.appendChild(group);
    });
  }

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One answer per item, please.",
        "A blank is not a judgement.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 5 match the model."));
    lead.appendChild(document.createTextNode(
      " Every one of these can be checked by moving the relevant control and " +
      "watching which bar changes."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        (index + 1) + ": " + CLAIM_LABELS[claim.answer] + "."));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + CLAIM_LABELS[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Five items judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    low: {
      tone: "caution",
      verdict: "Higher than that, in this set-up.",
      text:
        "People can see what is in front of them, and a substantial minority " +
        "of rounds is nevertheless answered with the group. But note what your " +
        "answer gets right: most rounds are still answered correctly, which is " +
        "the half of the classic result that rarely gets quoted."
    },
    third: {
      tone: "good",
      verdict: "That is the order of magnitude for this particular set-up.",
      text:
        "And it is worth being precise about what \"a third\" describes: a " +
        "third of rounds, averaged over people, in a public, unanimous, " +
        "unambiguous condition. Change any one of those words and the figure " +
        "moves a long way. Experiment 2 shows what the average is hiding."
    },
    most: {
      tone: "caution",
      verdict: "Too high, and the overestimate is itself interesting.",
      text:
        "The situation feels overwhelming when it is described, which is " +
        "probably why the classic study is remembered as showing that people " +
        "cave in. Most rounds, in this model as in the original, are answered " +
        "correctly."
    },
    depends: {
      tone: "good",
      verdict: "Strictly right, and the laboratory is built on that answer.",
      text:
        "The description does fix quite a lot: unambiguous judgement, unanimous " +
        "majority, public response. Those three settings put the figure in the " +
        "region of a third in this model. Every other feature of the situation " +
        "is unspecified, and the six controls show how much each one is worth."
    }
  };

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

  function unlockLab() {
    state.unlocked = true;
    labSection.hidden = false;
    render();
    shell.announce("Laboratory open. Load a classic condition to begin.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    unlockLab();
    $("#lab-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    unlockLab();
  });

  /* --- Actions ------------------------------------------------------------------ */

  $('[data-action="worked"]').addEventListener("click", function () {
    state.history = [];
    ["classic", "ally", "private", "ambiguous", "outgroup"].forEach(function (id) {
      var preset = PRESETS.filter(function (p) { return p.id === id; })[0];
      Object.keys(preset.values).forEach(function (key) {
        state.values[key] = preset.values[key];
      });
      state.label = preset.label;
      record(preset.label);
    });
    state.stage = 1;
    render();
    historyNote.textContent =
      "Five conditions recorded. Read the two right-hand columns rather than " +
      "the totals: the classic condition is almost entirely normative, the " +
      "ambiguous one is mostly informational, and the private and the " +
      "one-dissenter conditions arrive at nearly the same total by cutting the " +
      "normative route in two quite different ways.";
    shell.announce(
      "Worked example: five classic conditions recorded, ending on the " +
      "low-identification one at " + rateLine.textContent,
      { immediate: true });
  });

  $('[data-action="clear-history"]').addEventListener("click", function () {
    state.history = [];
    renderHistory();
    historyNote.textContent = "Comparison table cleared.";
    shell.announce("Comparison table cleared.", { immediate: true });
  });

  /* --- Reset and start-up -------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    historyNote.textContent =
      "Load a condition, or set the six controls yourself and press \"Record " +
      "this condition\".";
    render();
  });

  buildPresets();
  buildControls();
  buildClaims();
  controlBox.appendChild(recordButton);

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the laboratory.",
    { immediate: true });
})();
