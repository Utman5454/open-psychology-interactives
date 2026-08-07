/* =========================================================================
   Recovery and Plasticity Simulator
   -------------------------------------------------------------------------
   Two staged experiments on what a rising score after an injury can and
   cannot establish.

     Experiment 1  Five simulated people over twenty-four months, with
                   individual variation and measurement noise. There is no
                   single recovery curve.
     Experiment 2  One person, no noise. The trained score is taken apart into
                   its four components and compared with a task the person has
                   never practised.

   THE EDUCATIONAL MODEL
   ---------------------
   Severity s runs 1 to 10. Capacity immediately after the injury is

       C0   = max(5, 100 - 9s)          lost = 100 - C0

   and each process adds to it over months t:

     Restitution   spontaneous, early, time constant 3 months. Its ceiling is
                   a shrinking fraction of what was lost:
                       Rmax = lost x (0.55 - 0.035s)
                       R(t) = Rmax x (1 - e^(-t/3))

     Relearning    driven by rehabilitation intensity r, time constant 9
                   months, working on what restitution leaves, with its own
                   severity discount:
                       Lmax = (lost - Rmax) x r x max(0.15, 0.75 - 0.045s)
                       L(t) = Lmax x (1 - e^(-t/9))

     Compensation  strategy use k and environmental support e, time constant 6
                   months, capped in absolute points so that a severe injury
                   cannot be compensated indefinitely:
                       Kmax = min(22, (0.25k + 0.12e) x lost)
                       K(t) = Kmax x (1 - e^(-t/6))

     Practice      the same test administered again and again, time constant 4
                   months, a fixed 6-point maximum:
                       P(t) = 6 x (1 - e^(-t/4))

   The TRAINED task is C0 + R + L + K + P, capped at 100.
   The UNTRAINED task - the same underlying ability, never practised, tested
   once - is C0 + R + L, capped at 100.

   So the gap between the two curves is exactly K + P: compensation plus
   practice. That is the whole argument of experiment 2, and it is computed
   rather than asserted.

   WHY THE CEILINGS SHRINK WITH SEVERITY
   -------------------------------------
   Because plasticity is not unlimited, and a tool that let a maximal
   rehabilitation setting return a severe injury to its starting level would
   be teaching something false. At s = 10 with every slider at maximum the
   trained task still falls well short of 100 and the untrained task falls
   much further short.

   INDIVIDUAL VARIATION AND NOISE (experiment 1 only)
   --------------------------------------------------
   Each of the five simulated people gets a restitution multiplier drawn
   uniformly from 0.7 to 1.3, a relearning multiplier from 0.6 to 1.4, and a
   late drift of about N(0, 0.12) points per month applied after month 6, so
   that some trajectories plateau and some fall. Measurement noise is added
   independently at every month from a normal distribution with SD 2, 5 or 9.
   Random numbers come from mulberry32 with a visible seed and Box-Muller for
   the normal deviates, so any figure can be reproduced.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   None of this is data. Four processes is a caricature - diaschisis, oedema,
   reperfusion, sprouting, map reorganisation, strategy substitution and
   behavioural compensation are not four things and overlap in time. Real
   trajectories include illness, medication, mood, surgery and life events.
   Rehabilitation is one slider standing for intensity, timing, content,
   specificity and motivation. No published trajectory, effect size or
   recovery rate is reproduced, no anatomy is named, and nothing here is a
   prognosis for anybody.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var MONTHS = 24;
  var PEOPLE = 5;
  var PRACTICE_MAX = 6;
  var COMP_CAP = 22;
  var FIRST_SEED = 20260812;

  /* The months printed in the table. Declared here rather than beside the
     table code because the first render happens while the ranges are being
     bound, which is earlier than it looks. */
  var SAMPLE_MONTHS = [0, 3, 6, 12, 24];

  var NOISE_LEVELS = [
    { id: "low", label: "Low - a very reliable measure", sd: 2 },
    { id: "typical", label: "Typical for a cognitive test", sd: 5 },
    { id: "high", label: "High - a short or unstable measure", sd: 9 }
  ];

  var DASHES = ["none", "6 3", "2 3", "9 3 2 3", "1 4"];

  var PROCESSES = [
    {
      id: "base", name: "Capacity just after the injury",
      changes: "Nothing - this is the starting point",
      course: "Fixed",
      evidence: "The first assessment, ideally before rehabilitation begins"
    },
    {
      id: "restitution", name: "Restitution",
      changes: "The underlying ability, as swelling and remote depression of undamaged tissue resolve",
      course: "Fast, mostly done by three to six months",
      evidence: "Improvement in people who received no training, and its early timing"
    },
    {
      id: "relearning", name: "Relearning",
      changes: "The underlying ability, through practice",
      course: "Slow, continues while training continues",
      evidence: "Transfer to an untrained task of the same ability, and a comparison group who did not train"
    },
    {
      id: "compensation", name: "Compensation",
      changes: "How the task is done, not what the person can do",
      course: "Grows over about six months, tied to the task and the setting",
      evidence: "A large trained-untrained gap, and watching how the task is now performed"
    },
    {
      id: "practice", name: "Practice effects",
      changes: "The score on this particular test only",
      course: "Rises over the first few administrations, then flattens",
      evidence: "An alternate form of the test, or a first administration in a fresh group"
    }
  ];

  var PRESETS = [
    {
      id: "routeA", label: "Route A - restitution and relearning",
      set: { severity: 5, rehab: 100, comp: 0, support: 0 },
      note: "Intensive training, no compensation. Note the trained score, then load Route B."
    },
    {
      id: "routeB", label: "Route B - compensation and practice",
      set: { severity: 5, rehab: 0, comp: 80, support: 60 },
      note: "No training at all, heavy compensation. Nearly the same trained score - and look at the untrained task."
    },
    {
      id: "severe", label: "Severe injury, everything at maximum",
      set: { severity: 10, rehab: 100, comp: 100, support: 100 },
      note: "Every slider at its highest. The trained task still falls well short, and the untrained task further still."
    },
    {
      id: "mild", label: "Mild injury, no rehabilitation",
      set: { severity: 2, rehab: 0, comp: 0, support: 0 },
      note: "Nothing but spontaneous restitution and practice, and the curve still rises."
    }
  ];

  /* =======================================================================
     The model
     ===================================================================== */

  function capacities(severity) {
    var c0 = Math.max(5, 100 - 9 * severity);
    var lost = 100 - c0;
    var factor = 0.55 - 0.035 * severity;          /* restitution discount */
    var learnFactor = Math.max(0.15, 0.75 - 0.045 * severity);
    var restMax = lost * factor;
    return {
      c0: c0, lost: lost, factor: factor,
      learnFactor: learnFactor, restMax: restMax
    };
  }

  /** The four components at month t, before any noise or variation. */
  function components(settings, t, person) {
    var base = capacities(settings.severity);
    var restMult = person ? person.restMult : 1;
    var learnMult = person ? person.learnMult : 1;

    var restMax = base.restMax * restMult;
    var restitution = restMax * (1 - Math.exp(-t / 3));

    var learnMax = Math.max(0, base.lost - restMax) *
      (settings.rehab / 100) * base.learnFactor * learnMult;
    var relearning = learnMax * (1 - Math.exp(-t / 9));

    var compMax = Math.min(COMP_CAP,
      (0.25 * (settings.comp / 100) + 0.12 * (settings.support / 100)) * base.lost);
    var compensation = compMax * (1 - Math.exp(-t / 6));

    var practice = PRACTICE_MAX * (1 - Math.exp(-t / 4));

    var drift = person && t > 6 ? person.drift * (t - 6) : 0;

    return {
      base: base.c0,
      restitution: restitution,
      relearning: relearning,
      compensation: compensation,
      practice: practice,
      drift: drift
    };
  }

  function trainedScore(parts) {
    return clamp(parts.base + parts.restitution + parts.relearning +
      parts.compensation + parts.practice + parts.drift);
  }

  /** The same ability, never practised, tested once: no compensation, no
      practice effect. */
  function untrainedScore(parts) {
    return clamp(parts.base + parts.restitution + parts.relearning +
      parts.drift);
  }

  function clamp(value) {
    return Math.max(0, Math.min(100, value));
  }

  /* mulberry32 and Box-Muller, copied in rather than imported so that the
     folder works on its own. */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normal(rand) {
    var u = Math.max(1e-9, rand());
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function makePeople(seed) {
    var rand = mulberry32(seed);
    var people = [];
    for (var i = 0; i < PEOPLE; i += 1) {
      people.push({
        label: "P" + (i + 1),
        restMult: 0.7 + rand() * 0.6,
        learnMult: 0.6 + rand() * 0.8,
        drift: normal(rand) * 0.12,
        noiseSeed: Math.floor(rand() * 1e9)
      });
    }
    return people;
  }

  /** One person's observed trained-task series, with measurement noise. */
  function observedSeries(settings, person, sd) {
    var rand = mulberry32(person.noiseSeed);
    var series = [];
    for (var t = 0; t <= MONTHS; t += 1) {
      var parts = components(settings, t, person);
      series.push(clamp(trainedScore(parts) + normal(rand) * sd));
    }
    return series;
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

  var NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(x, y, className, anchor, text) {
    var node = svgEl("text", { x: x, y: y, class: className, "text-anchor": anchor });
    node.textContent = text;
    return node;
  }

  function byId(list, id) {
    return list.filter(function (entry) { return entry.id === id; })[0];
  }

  function severityWord(value) {
    return value <= 3 ? "mild" : value <= 7 ? "moderate" : "severe";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#recovery");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var track = $("[data-track]");
  var stageTitle = $("[data-stage-title]");
  var stageBrief = $("[data-stage-brief]");
  var oneControls = $("[data-stage-one-controls]");
  var twoControls = $("[data-stage-two-controls]");
  var onePrimary = $("[data-stage-one-primary]");
  var twoPrimary = $("[data-stage-two-primary]");
  var noiseControls = $("[data-noise-controls]");
  var presetHost = $("[data-presets]");
  var fanSvg = $("[data-fan]");
  var fanText = $("[data-fan-text]");
  var decompSvg = $("[data-decomp]");
  var decompText = $("[data-decomp-text]");
  var decompHeading = $("[data-decomp-heading]");
  var readout = $("[data-readout]");
  var transferBlock = $("[data-two-chart]");
  var transferSvg = $("[data-transfer]");
  var transferText = $("[data-transfer-text]");
  var interpretation = $("[data-interpretation]");
  var interpretationBody = $("[data-interpretation-body]");
  var tableHeading = $("[data-table-heading]");
  var tableHead = $("[data-table-head]");
  var mainTable = $("[data-main-table]");
  var tableNote = $("[data-table-note]");
  var processTable = $("[data-process-table]");
  var seedNote = $("[data-seed-note]");
  var severityRange = $("#severity-range");
  var rehabRange = $("#rehab-range");
  var monthRange = $("#month-range");
  var compRange = $("#comp-range");
  var supportRange = $("#support-range");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  function initialState() {
    return {
      stage: 1,
      severity: 5,
      rehab: 60,
      comp: 0,
      support: 0,
      month: 9,
      noise: "typical",
      seed: FIRST_SEED
    };
  }

  var state = initialState();
  var people = makePeople(state.seed);
  var suspend = false;

  function settings() {
    return {
      severity: state.severity, rehab: state.rehab,
      comp: state.comp, support: state.support
    };
  }

  /* --- Controls, built once --------------------------------------------- */

  NOISE_LEVELS.forEach(function (level) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "noise";
    input.value = level.id;
    input.checked = level.id === state.noise;
    input.addEventListener("change", function () {
      state.noise = level.id;
      render();
      shell.announce("Measurement noise: " + level.label.toLowerCase() +
        ", standard deviation " + level.sd + " points.", { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(level.label));
    noiseControls.appendChild(label);
  });

  PRESETS.forEach(function (preset) {
    var button = make("button", "button button--secondary", preset.label);
    button.type = "button";
    button.addEventListener("click", function () {
      Object.keys(preset.set).forEach(function (key) {
        state[key] = preset.set[key];
      });
      syncRanges();
      render();
      shell.announce(preset.label + ". " + preset.note, { immediate: true });
    });
    presetHost.appendChild(button);
  });

  shell.bindRange(severityRange, {
    format: function (v) { return v + " of 10, " + severityWord(v); },
    describe: function (v) {
      return "Injury severity " + v + " of 10, " + severityWord(v) +
        ", starting capacity " + capacities(v).c0 + " points";
    },
    onInput: function (v) { state.severity = v; if (!suspend) { render(); } }
  });

  shell.bindRange(rehabRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return "Rehabilitation intensity " + v + " per cent of the maximum in " +
        "this model" + (v === 0 ? ", that is none at all" : "");
    },
    onInput: function (v) { state.rehab = v; if (!suspend) { render(); } }
  });

  shell.bindRange(monthRange, {
    format: function (v) { return v === 1 ? "1 month" : v + " months"; },
    describe: function (v) {
      return v === 0 ? "at the injury" : v + " months after the injury";
    },
    onInput: function (v) { state.month = v; if (!suspend) { render(); } }
  });

  shell.bindRange(compRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return "Compensatory strategy use " + v + " per cent of the maximum in " +
        "this model";
    },
    onInput: function (v) { state.comp = v; if (!suspend) { render(); } }
  });

  shell.bindRange(supportRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return "Environmental support " + v + " per cent of the maximum in " +
        "this model";
    },
    onInput: function (v) { state.support = v; if (!suspend) { render(); } }
  });

  /* Assigning to input.value does not fire an input event, so the bound
     <output> would keep showing the old number; dispatching one fixes it, and
     the suspend flag stops five dispatches causing five redraws. */
  function syncRanges() {
    suspend = true;
    [[severityRange, state.severity], [rehabRange, state.rehab],
      [monthRange, state.month], [compRange, state.comp],
      [supportRange, state.support]].forEach(function (pair) {
      pair[0].value = String(pair[1]);
      pair[0].dispatchEvent(new Event("input"));
    });
    suspend = false;
  }

  $('[data-action="redraw"]').addEventListener("click", function () {
    state.seed = (state.seed + 7919) >>> 0;
    people = makePeople(state.seed);
    render();
    shell.announce("Five different simulated people, from seed " + state.seed +
      ". The model has not changed.", { immediate: true });
  });

  $('[data-action="to-stage-two"]').addEventListener("click", function () {
    goToStage(2);
  });
  $('[data-action="to-stage-one"]').addEventListener("click", function () {
    goToStage(1);
  });

  function goToStage(stage) {
    state.stage = stage;
    render();
    shell.announce(stage === 1
      ? "Experiment 1. Five simulated people with measurement noise."
      : "Experiment 2. One person, no noise, and the score taken apart.",
      { immediate: true });
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    oneControls.hidden = state.stage !== 1;
    twoControls.hidden = state.stage !== 2;
    onePrimary.hidden = state.stage !== 1;
    twoPrimary.hidden = state.stage !== 2;
    transferBlock.hidden = state.stage !== 2;

    Array.prototype.forEach.call(track.children, function (item, index) {
      item.removeAttribute("aria-current");
      item.removeAttribute("data-state");
      if (index + 1 < state.stage) { item.setAttribute("data-state", "done"); }
      if (index + 1 === state.stage) { item.setAttribute("aria-current", "step"); }
    });

    if (state.stage === 1) { renderStageOne(); } else { renderStageTwo(); }
    renderProcessTable();
  }

  function renderStageOne() {
    var sd = byId(NOISE_LEVELS, state.noise).sd;
    var series = people.map(function (person) {
      return observedSeries(settings(), person, sd);
    });

    stageTitle.textContent = "Experiment 1 - five people, not one curve";
    stageBrief.textContent =
      "Five simulated people with the same injury and the same rehabilitation, " +
      "differing only in how much they recover spontaneously, how much they " +
      "gain from training, and what the measurement does on the day.";
    seedNote.textContent = "These five were drawn from seed " + state.seed +
      ". The same seed always gives the same five.";
    tableHeading.textContent = "The five people at five time points";
    tableNote.textContent =
      "Every value is a simulated observation, not data. Compare any two " +
      "adjacent months in one row and ask whether the difference means " +
      "anything.";

    drawFan(series, sd);
    renderFanTable(series);

    var atMonth = series.map(function (s) { return s[state.month]; });
    var spread = Math.max.apply(null, atMonth) - Math.min.apply(null, atMonth);
    interpretation.hidden = false;
    interpretationBody.textContent =
      "At " + state.month + " month" + (state.month === 1 ? "" : "s") +
      " the five simulated people span " + spread.toFixed(0) + " points, from " +
      Math.min.apply(null, atMonth).toFixed(0) + " to " +
      Math.max.apply(null, atMonth).toFixed(0) + ". They have the same injury, " +
      "the same rehabilitation and the same underlying model. A single " +
      "person's curve is one draw from this fan, and a difference between two " +
      "adjacent months is smaller than the measurement noise alone (standard " +
      "deviation " + sd + " points) for most of the range.";
    interpretation.setAttribute("data-tone", "caution");
  }

  function renderStageTwo() {
    var parts = components(settings(), state.month, null);
    var trained = trainedScore(parts);
    var untrained = untrainedScore(parts);
    var gap = trained - untrained;

    stageTitle.textContent = "Experiment 2 - what is doing the work";
    stageBrief.textContent =
      "One person, no measurement noise and no individual variation: what the " +
      "model says is happening underneath. The trained task is measured every " +
      "month; the untrained task is a first attempt at the same ability.";
    decompHeading.textContent = "The trained score at " + state.month +
      " month" + (state.month === 1 ? "" : "s") + ", taken apart";
    tableHeading.textContent = "The two tasks at five time points";
    tableNote.textContent =
      "Model values with no noise. The difference between the two columns is " +
      "compensation plus practice, exactly.";

    drawDecomposition(parts, trained);
    drawTransfer();
    renderTransferTable();

    clear(readout);
    [
      ["Trained task", trained.toFixed(0)],
      ["Untrained task", untrained.toFixed(0)],
      ["The gap", gap.toFixed(0) + " points"]
    ].forEach(function (pair) {
      var wrap = make("div");
      wrap.appendChild(make("dt", null, pair[0]));
      wrap.appendChild(make("dd", null, pair[1]));
      readout.appendChild(wrap);
    });

    interpretation.hidden = false;
    interpretationBody.textContent =
      "Of the " + trained.toFixed(0) + " points on the trained task, " +
      parts.base.toFixed(0) + " were there immediately after the injury, " +
      parts.restitution.toFixed(0) + " came from restitution, " +
      parts.relearning.toFixed(0) + " from relearning, " +
      parts.compensation.toFixed(0) + " from compensation and " +
      parts.practice.toFixed(0) + " from having taken the same test " +
      "repeatedly. The untrained task scores " + untrained.toFixed(0) +
      " because compensation and practice do not reach it: the " +
      gap.toFixed(0) + "-point gap is those two and nothing else. No amount " +
      "of measuring the trained task would have separated them.";
    interpretation.setAttribute("data-tone", gap >= 12 ? "warn" : "caution");
  }

  /* Five trajectories. Each line has its own dash pattern and its own label
     at the right-hand end, so no line depends on colour. */
  function drawFan(series, sd) {
    var LEFT = 34, RIGHT = 380, TOP = 10, BOTTOM = 176;

    clear(fanSvg);
    drawAxes(fanSvg, LEFT, RIGHT, TOP, BOTTOM, "simulated score on the trained task");

    series.forEach(function (values, index) {
      var points = values.map(function (value, t) {
        return xAt(t, LEFT, RIGHT) + "," + yAt(value, TOP, BOTTOM);
      }).join(" ");
      var line = svgEl("polyline", { points: points, class: "chart__line rec__line" });
      if (DASHES[index] !== "none") {
        line.setAttribute("stroke-dasharray", DASHES[index]);
      }
      fanSvg.appendChild(line);
      fanSvg.appendChild(svgText(RIGHT + 5,
        yAt(values[MONTHS], TOP, BOTTOM) + 4, "chart__count", "start",
        people[index].label));
    });

    drawMarker(fanSvg, LEFT, RIGHT, TOP, BOTTOM);

    var atMonth = series.map(function (s) { return s[state.month]; });
    fanText.textContent = "At " + state.month + " month" +
      (state.month === 1 ? "" : "s") + " the five simulated people score " +
      atMonth.map(function (v, i) {
        return people[i].label + " " + v.toFixed(0);
      }).join(", ") + ". Measurement noise has a standard deviation of " +
      sd + " points, and the vertical marker is the month you have chosen.";
  }

  /* One stacked bar: where the trained score comes from. */
  function drawDecomposition(parts, trained) {
    var LEFT = 4, RIGHT = 396, TOP = 8, HEIGHT = 26;
    var span = RIGHT - LEFT;

    clear(decompSvg);
    decompSvg.appendChild(svgEl("rect", {
      x: LEFT, y: TOP, width: span, height: HEIGHT, class: "chart__track"
    }));

    var segments = [
      { key: "base", label: "start", value: parts.base },
      { key: "restitution", label: "restitution", value: parts.restitution },
      { key: "relearning", label: "relearning", value: parts.relearning },
      { key: "compensation", label: "compensation", value: parts.compensation },
      { key: "practice", label: "practice", value: parts.practice }
    ];

    var x = LEFT;
    segments.forEach(function (segment) {
      var w = (Math.max(0, segment.value) / 100) * span;
      if (w <= 0) { return; }
      decompSvg.appendChild(svgEl("rect", {
        x: x, y: TOP, width: w, height: HEIGHT,
        class: "rec__seg rec__seg--" + segment.key
      }));
      x += w;
    });

    /* A tick every 25 points, so the bar can be read as a score. */
    [0, 25, 50, 75, 100].forEach(function (tick) {
      var tx = LEFT + (tick / 100) * span;
      decompSvg.appendChild(svgEl("line", {
        x1: tx, y1: TOP + HEIGHT, x2: tx, y2: TOP + HEIGHT + 4,
        class: "chart__baseline"
      }));
      decompSvg.appendChild(
        svgText(tx, TOP + HEIGHT + 18, "chart__axis",
          tick === 0 ? "start" : tick === 100 ? "end" : "middle", String(tick)));
    });

    decompText.textContent = "Trained score " + trained.toFixed(0) +
      " out of 100: " + segments.map(function (segment) {
        return segment.label + " " + segment.value.toFixed(0);
      }).join(", ") +
      (parts.drift ? ", plus a late drift of " + parts.drift.toFixed(0) : "") +
      ". The segments run along the bar in that order, left to right.";
  }

  /* Trained against untrained, over the whole twenty-four months. */
  function drawTransfer() {
    var LEFT = 34, RIGHT = 372, TOP = 10, BOTTOM = 160;

    clear(transferSvg);
    drawAxes(transferSvg, LEFT, RIGHT, TOP, BOTTOM, "simulated score");

    var trainedValues = [];
    var untrainedValues = [];
    for (var t = 0; t <= MONTHS; t += 1) {
      var parts = components(settings(), t, null);
      trainedValues.push(trainedScore(parts));
      untrainedValues.push(untrainedScore(parts));
    }

    [[trainedValues, "trained", "none"],
      [untrainedValues, "untrained", "5 4"]].forEach(function (entry) {
      var points = entry[0].map(function (value, t) {
        return xAt(t, LEFT, RIGHT) + "," + yAt(value, TOP, BOTTOM);
      }).join(" ");
      var line = svgEl("polyline", {
        points: points, class: "chart__line rec__line rec__line--" + entry[1]
      });
      if (entry[2] !== "none") { line.setAttribute("stroke-dasharray", entry[2]); }
      transferSvg.appendChild(line);
      transferSvg.appendChild(svgText(RIGHT + 5,
        yAt(entry[0][MONTHS], TOP, BOTTOM) + 4, "chart__count", "start",
        entry[1] === "trained" ? "trained" : "untrained"));
    });

    drawMarker(transferSvg, LEFT, RIGHT, TOP, BOTTOM);

    transferText.textContent = "The solid line is the task that is practised " +
      "and measured every month; the dashed line is the same ability tested " +
      "once, without practice and without the strategies that were built " +
      "around the trained task. At 24 months they read " +
      trainedValues[MONTHS].toFixed(0) + " and " +
      untrainedValues[MONTHS].toFixed(0) + ".";
  }

  function xAt(t, left, right) {
    return left + (t / MONTHS) * (right - left);
  }

  function yAt(value, top, bottom) {
    return bottom - (value / 100) * (bottom - top);
  }

  function drawAxes(svg, left, right, top, bottom, caption) {
    [0, 25, 50, 75, 100].forEach(function (value) {
      var y = yAt(value, top, bottom);
      svg.appendChild(svgEl("line", {
        x1: left, y1: y, x2: right, y2: y, class: "chart__grid"
      }));
      svg.appendChild(svgText(left - 6, y + 4, "chart__axis", "end",
        String(value)));
    });
    svg.appendChild(svgEl("line", {
      x1: left, y1: bottom, x2: right, y2: bottom, class: "chart__baseline"
    }));
    [0, 6, 12, 18, 24].forEach(function (t) {
      svg.appendChild(svgText(xAt(t, left, right), bottom + 16, "chart__axis",
        "middle", String(t)));
    });
    svg.appendChild(svgText((left + right) / 2, bottom + 32, "chart__axis",
      "middle", "months since the injury"));
    svg.appendChild(svgText(0, top - 2, "chart__axis", "start", caption));
  }

  function drawMarker(svg, left, right, top, bottom) {
    var x = xAt(state.month, left, right);
    svg.appendChild(svgEl("line", {
      x1: x, y1: top, x2: x, y2: bottom, class: "rec__marker"
    }));
    svg.appendChild(svgText(x, top + 10, "chart__axis",
      state.month > MONTHS / 2 ? "end" : "start",
      state.month > MONTHS / 2 ? "month " + state.month + " " : " month " + state.month));
  }

  function renderFanTable(series) {
    clear(tableHead);
    var head = ["Person"].concat(SAMPLE_MONTHS.map(function (t) {
      return t + " mo";
    }));
    head.forEach(function (text) {
      var th = make("th", null, text);
      th.setAttribute("scope", "col");
      tableHead.appendChild(th);
    });

    clear(mainTable);
    series.forEach(function (values, index) {
      var tr = make("tr");
      var th = make("th", null, people[index].label);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      SAMPLE_MONTHS.forEach(function (t) {
        tr.appendChild(make("td", null, values[t].toFixed(0)));
      });
      mainTable.appendChild(tr);
    });
  }

  function renderTransferTable() {
    clear(tableHead);
    ["Months since the injury", "Trained task", "Untrained task",
      "Gap (compensation + practice)"].forEach(function (text) {
      var th = make("th", null, text);
      th.setAttribute("scope", "col");
      tableHead.appendChild(th);
    });

    clear(mainTable);
    SAMPLE_MONTHS.forEach(function (t) {
      var parts = components(settings(), t, null);
      var trained = trainedScore(parts);
      var untrained = untrainedScore(parts);
      var tr = make("tr");
      var th = make("th", null, String(t));
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, trained.toFixed(0)));
      tr.appendChild(make("td", null, untrained.toFixed(0)));
      tr.appendChild(make("td", null, (trained - untrained).toFixed(0)));
      mainTable.appendChild(tr);
    });
  }

  var processDrawn = false;
  function renderProcessTable() {
    if (processDrawn) { return; }
    processDrawn = true;
    PROCESSES.forEach(function (entry) {
      var tr = make("tr");
      var th = make("th", null, entry.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, entry.changes));
      tr.appendChild(make("td", null, entry.course));
      tr.appendChild(make("td", null, entry.evidence));
      processTable.appendChild(tr);
    });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    regained: {
      tone: "caution",
      verdict: "One of at least four readings.",
      text:
        "Lost function returning is what restitution and relearning look " +
        "like. Compensation - doing the task another way - and the practice " +
        "effect of eleven administrations of the same test produce the same " +
        "rise without any capacity having changed. Experiment 2 separates " +
        "them; the trained score cannot."
    },
    rehab: {
      tone: "caution",
      verdict: "Not without something to compare it with.",
      text:
        "Most of the early rise in this model happens whatever anybody does. " +
        "Set rehabilitation intensity to zero in experiment 1 and the curves " +
        "still climb. Attributing the rise to the programme needs a group who " +
        "did not receive it."
    },
    several: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Restitution, relearning, compensation and practice all raise the " +
        "trained score, and the trained score is downstream of all four. " +
        "Experiment 2 takes it apart and shows what an untrained task would " +
        "reveal."
    },
    reorg: {
      tone: "caution",
      verdict: "Two steps beyond the evidence, and one of them is bigger than it looks.",
      text:
        "Nothing in a behavioural score speaks to tissue. And even a scan " +
        "showing changed activity would not settle it: reorganisation is " +
        "entirely compatible with a person having learned a different way of " +
        "doing the task."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the simulator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockLab();
  });

  function unlockLab() {
    lockForm(openingForm);
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Simulator open. Experiment 1.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    bigger: {
      tone: "caution",
      verdict: "A bigger version of the same problem.",
      text:
        "A larger rise on the trained task is still downstream of all four " +
        "processes. Load Route B in experiment 2 and push compensation and " +
        "support to the maximum: the trained score goes up and the untrained " +
        "score does not move at all."
    },
    transfer: {
      tone: "good",
      verdict: "Yes, and each part does a different job.",
      text:
        "The untrained task removes compensation, because strategies attach " +
        "to the task they were built for. The alternate form removes the " +
        "practice effect. The untreated group removes spontaneous " +
        "restitution, which happens anyway. And watching how the task is done " +
        "often settles it in a minute, because compensation is usually " +
        "visible if anybody looks."
    },
    scan: {
      tone: "caution",
      verdict: "Compatible with either.",
      text:
        "Changed activity is what you would expect whether the person has " +
        "regained an ability or learned a different way of doing the task - " +
        "learning anything changes activity. Reorganisation on an image is " +
        "not a measure of recovered function."
    },
    report: {
      tone: "caution",
      verdict: "Important, and it answers a different question.",
      text:
        "Whether things feel easier is worth knowing in its own right and is " +
        "often the outcome that matters most to the person. It does not " +
        "distinguish a regained ability from a good workaround, and a good " +
        "workaround is exactly what would make things feel easier."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var entry = CHALLENGE[answer.value];
    showFeedback(challengeFeedback, entry.tone, entry.verdict, entry.text);
    shell.announce("Challenge answered.", { immediate: true });
  });

  /* --- Feedback plumbing ------------------------------------------------ */

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
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

  /* --- Reset ------------------------------------------------------------ */

  shell.onReset(function () {
    state = initialState();
    people = makePeople(state.seed);
    Array.prototype.forEach.call(
      noiseControls.querySelectorAll("input"),
      function (input) { input.checked = input.value === state.noise; });
    severityRange.value = String(state.severity);
    rehabRange.value = String(state.rehab);
    monthRange.value = String(state.month);
    compRange.value = String(state.comp);
    supportRange.value = String(state.support);
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    interpretation.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the simulator.",
    { immediate: true });
})();
