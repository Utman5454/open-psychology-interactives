/* =========================================================================
   Intelligence-Test Battery Builder
   -------------------------------------------------------------------------
   Students are given a testing session with a fixed time budget and asked to
   assemble a battery from seven original task types for one of three stated
   purposes. Every choice moves five things at once, and no battery can be
   good at everything.

   THE EDUCATIONAL MODEL
   ---------------------
   Seven task types, each described by:

     minutes            administration time, which is the binding constraint;
     reliability        the task's own reliability, illustrative;
     breadth            which broad ability domains it samples, and how much;
     culturalLoading    how much performance depends on specific schooling,
                        language and prior exposure rather than on the ability
                        the task is meant to index;
     burden             demand on the person being tested — fatigue, stress,
                        motor and sensory requirements.

   From a selected set the tool computes:

     Coverage       how many of the ability domains are sampled at all, and
                    how evenly. A battery that measures one domain four ways
                    is not broad, however long it is.
     Composite      reliability of the total score, via Spearman-Brown applied
                    to the mean task reliability. More tasks help; short
                    unreliable tasks help less than they cost.
     Cultural load  weighted mean of the tasks' cultural loading. This is
                    NOT a property of a person or a group: it is a statement
                    about how much a task's score depends on opportunity to
                    learn its particular content.
     Burden         total, compared against what the scenario says the person
                    can tolerate.
     Fit to purpose a score against the scenario's own requirements, which
                    differ: a research battery wants breadth and reliability;
                    an educational-support battery wants domain coverage
                    relevant to instruction and low burden; a screening
                    battery wants short, low-burden, broad-but-shallow.

   The point is not that one battery is correct. It is that the same seven
   tasks produce different best answers under different purposes, and that the
   trade-offs are forced rather than incidental.

   WHAT THIS DELIBERATELY DOES NOT DO
   ----------------------------------
   * No real test is named, and no item, norm or scoring rule is reproduced.
     The seven task types are generic families described in general terms.
   * No IQ score is produced, for anybody, ever. The tool scores BATTERIES,
     not people.
   * No group differences of any kind are simulated. Cultural loading is a
     property of a task's dependence on prior exposure, and is never attached
     to a person or a population.
   * Nothing here can be used to assess anyone. The page says so repeatedly.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. Domains, tasks and scenarios
     ===================================================================== */

  var DOMAINS = [
    { id: "verbal", name: "Verbal / acquired knowledge" },
    { id: "fluid", name: "Fluid reasoning" },
    { id: "speed", name: "Processing speed" },
    { id: "memory", name: "Working memory" },
    { id: "spatial", name: "Spatial transformation" },
    { id: "quant", name: "Quantitative reasoning" }
  ];

  /* Seven original task families. Values are illustrative and were chosen to
     make the trade-offs legible; they are not measured properties of any
     published instrument. */
  var TASKS = [
    {
      id: "vocab",
      name: "Vocabulary and word meaning",
      description:
        "The person explains what words mean, working from common towards rare.",
      minutes: 12,
      reliability: 0.90,
      breadth: { verbal: 0.9, quant: 0.05 },
      culturalLoading: 0.85,
      burden: 2,
      note:
        "Highly reliable and highly dependent on what a person has had the chance to encounter."
    },
    {
      id: "matrices",
      name: "Matrix reasoning",
      description:
        "Abstract patterns with one element missing; the person selects the piece that completes the rule.",
      minutes: 18,
      reliability: 0.88,
      breadth: { fluid: 0.85, spatial: 0.2 },
      culturalLoading: 0.35,
      burden: 3,
      note:
        "Often called culture-fair. Lower cultural loading than vocabulary — not zero."
    },
    {
      id: "coding",
      name: "Symbol–digit coding",
      description:
        "A key pairs symbols with digits; the person copies as many as possible against the clock.",
      minutes: 6,
      reliability: 0.82,
      breadth: { speed: 0.9, memory: 0.15 },
      culturalLoading: 0.30,
      burden: 3,
      note:
        "Short and cheap. Requires sustained motor output and clear vision of small symbols."
    },
    {
      id: "span",
      name: "Sequence recall and reordering",
      description:
        "The person repeats sequences back, forwards and then rearranged.",
      minutes: 10,
      reliability: 0.83,
      breadth: { memory: 0.9, quant: 0.1 },
      culturalLoading: 0.25,
      burden: 4,
      note:
        "Demanding to sit through. Sensitive to anxiety and to the testing environment."
    },
    {
      id: "rotation",
      name: "Mental rotation of figures",
      description:
        "Two figures are shown; the person judges whether one is a rotation of the other.",
      minutes: 9,
      reliability: 0.80,
      breadth: { spatial: 0.9, fluid: 0.2 },
      culturalLoading: 0.30,
      burden: 3,
      note:
        "Performance improves noticeably with practice at this kind of puzzle."
    },
    {
      id: "arith",
      name: "Applied numerical problems",
      description:
        "Word problems requiring arithmetic reasoning, solved without a calculator.",
      minutes: 14,
      reliability: 0.86,
      breadth: { quant: 0.85, memory: 0.2, verbal: 0.2 },
      culturalLoading: 0.75,
      burden: 4,
      note:
        "Depends heavily on formal schooling in a particular curriculum."
    },
    {
      id: "general",
      name: "General knowledge questions",
      description:
        "Questions about widely-taught facts across science, history and civic life.",
      minutes: 8,
      reliability: 0.84,
      breadth: { verbal: 0.6, quant: 0.1 },
      culturalLoading: 0.95,
      burden: 2,
      note:
        "The most exposure-dependent family here. What counts as 'general' is a decision, not a fact."
    }
  ];

  var SCENARIOS = [
    {
      id: "research",
      name: "Research study of reasoning across the lifespan",
      minutes: 45,
      burdenCap: 14,
      brief:
        "You need a composite that behaves well statistically and samples the " +
        "ability space broadly, because the analysis depends on the breadth of " +
        "the construct. Participants are volunteers who have agreed to a " +
        "45-minute session.",
      wants: { coverage: 0.4, composite: 0.35, cultural: 0.15, burden: 0.1 },
      guidance:
        "Breadth and composite reliability carry most of the weight. A battery " +
        "of one domain measured three ways will look reliable and answer a " +
        "narrower question than the one you asked."
    },
    {
      id: "education",
      name: "Advising on support for a student who is struggling",
      minutes: 60,
      burdenCap: 12,
      brief:
        "The purpose is to describe a profile of strengths and " +
          "difficulties that a teacher could act on. A flat composite " +
          "score is of little use here; what matters is which domains " +
          "differ from each other.",
      wants: { coverage: 0.5, composite: 0.15, cultural: 0.2, burden: 0.15 },
      guidance:
        "Coverage matters most: you cannot describe a profile across domains " +
        "you did not measure. Heavily exposure-dependent tasks are a particular " +
        "problem here, because a low score may reflect what the student has " +
        "been taught rather than how they learn."
    },
    {
      id: "screening",
      name: "Brief screening in a busy clinic",
      minutes: 20,
      burdenCap: 8,
      brief:
        "Twenty minutes, and the person is tired. The result will decide only " +
        "whether a fuller assessment is arranged by someone qualified to do " +
        "it. Nothing here is a diagnosis.",
      wants: { coverage: 0.35, composite: 0.2, cultural: 0.2, burden: 0.25 },
      guidance:
        "Burden and time dominate. A screen is allowed to be shallow; it is " +
        "not allowed to be long, exhausting, or to be mistaken for an " +
        "assessment."
    }
  ];

  /* =======================================================================
     2. The model
     ===================================================================== */

  function totalMinutes(selected) {
    return selected.reduce(function (total, task) {
      return total + task.minutes;
    }, 0);
  }

  function totalBurden(selected) {
    return selected.reduce(function (total, task) {
      return total + task.burden;
    }, 0);
  }

  /** How much of each domain the battery samples. */
  function domainCoverage(selected) {
    var coverage = {};
    DOMAINS.forEach(function (domain) {
      coverage[domain.id] = 0;
    });
    selected.forEach(function (task) {
      Object.keys(task.breadth).forEach(function (domain) {
        coverage[domain] += task.breadth[domain];
      });
    });
    return coverage;
  }

  /**
   * Breadth score: how many domains are sampled, and how evenly. Measuring
   * one domain four times over should not count as breadth, so the evenness
   * term matters as much as the count.
   */
  function breadthScore(selected) {
    if (!selected.length) {
      return 0;
    }
    var coverage = domainCoverage(selected);
    var values = DOMAINS.map(function (domain) {
      return coverage[domain.id];
    });
    var sampled = values.filter(function (value) {
      return value >= 0.3;
    }).length;
    var total = values.reduce(function (a, b) {
      return a + b;
    }, 0);

    // Normalised Shannon evenness across domains.
    var evenness = 0;
    if (total > 0) {
      var entropy = 0;
      values.forEach(function (value) {
        if (value > 0) {
          var p = value / total;
          entropy -= p * Math.log(p);
        }
      });
      evenness = entropy / Math.log(DOMAINS.length);
    }
    return (sampled / DOMAINS.length) * 0.6 + evenness * 0.4;
  }

  /**
   * Composite reliability via Spearman–Brown on the mean task reliability.
   * Deliberately simple: the real thing needs the intercorrelations, which is
   * itself a point worth making to a class.
   */
  function compositeReliability(selected) {
    if (!selected.length) {
      return 0;
    }
    var meanReliability = selected.reduce(function (total, task) {
      return total + task.reliability;
    }, 0) / selected.length;
    var k = selected.length;
    return (k * meanReliability) / (1 + (k - 1) * meanReliability);
  }

  /** Time-weighted mean cultural loading of the selected tasks. */
  function culturalLoad(selected) {
    if (!selected.length) {
      return 0;
    }
    var weighted = selected.reduce(function (total, task) {
      return total + task.culturalLoading * task.minutes;
    }, 0);
    return weighted / totalMinutes(selected);
  }

  /** Fit to the scenario's stated purpose, 0 to 1. */
  function fitToPurpose(selected, scenario) {
    if (!selected.length) {
      return 0;
    }
    var wants = scenario.wants;
    var breadth = breadthScore(selected);
    var composite = compositeReliability(selected);
    var cultural = 1 - culturalLoad(selected); // lower loading scores better
    var burden = Math.max(
      0, 1 - totalBurden(selected) / (scenario.burdenCap * 1.5));

    return (
      wants.coverage * breadth +
      wants.composite * composite +
      wants.cultural * cultural +
      wants.burden * burden
    );
  }

  /** Constraint check for the scenario. */
  function constraints(selected, scenario) {
    var minutes = totalMinutes(selected);
    var burden = totalBurden(selected);
    return [
      {
        label: "Within the " + scenario.minutes + "-minute session",
        detail: minutes + " of " + scenario.minutes + " minutes",
        met: minutes <= scenario.minutes
      },
      {
        label: "Tolerable burden for this person",
        detail: burden + " of " + scenario.burdenCap,
        met: burden <= scenario.burdenCap
      },
      {
        label: "At least one task selected",
        detail: selected.length + " selected",
        met: selected.length > 0
      }
    ];
  }

  /* =======================================================================
     3. Helpers
     ===================================================================== */

  function fmt(value, places) {
    return value === null || value === undefined || isNaN(value)
      ? "—"
      : value.toFixed(places === undefined ? 2 : places);
  }

  function pct(value) {
    return Math.round(value * 100) + "%";
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function byId(list, id) {
    return list.filter(function (entry) {
      return entry.id === id;
    })[0];
  }

  /* =======================================================================
     4. Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#battery");
  if (!shell) {
    return;
  }

  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var taskList = $("[data-task-list]");
  var scenarioSelect = $("#scenario-select");
  var scenarioBrief = $("[data-scenario-brief]");
  var goalText = $("[data-goal-text]");
  var readout = $("[data-readout]");
  var coverageChart = $("[data-coverage-chart]");
  var coverageTable = $("[data-coverage-table]");
  var tradeoffBody = $("[data-tradeoff]");
  var submitButton = $('[data-action="submit"]');

  var predictionForm = $("#prediction-form");
  var predictionError = $("[data-prediction-error]");
  var predictionFeedback = $("[data-prediction-feedback]");
  var skipPrediction = $('[data-action="skip-prediction"]');

  var verdictSection = $("#verdict");
  var verdictBody = $("[data-verdict-body]");
  var comparisonTable = $("[data-comparison-table]");

  var INITIAL = {
    stage: "predict",
    scenarioId: "research",
    selected: [],
    submitted: null
  };
  var state = null;
  var checkboxes = {};

  /* --- Build the task list ----------------------------------------------- */

  function buildTasks() {
    clear(taskList);
    TASKS.forEach(function (task) {
      var item = make("li");
      var label = make("label", "task");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = task.id;
      input.id = "task-" + task.id;
      input.addEventListener("change", onTaskToggle);
      checkboxes[task.id] = input;

      var body = make("div", "task__body");
      body.appendChild(make("span", "task__name", task.name));
      body.appendChild(make("span", "task__desc", task.description));

      var facts = make("ul", "task__facts");
      [
        task.minutes + " min",
        "reliability " + fmt(task.reliability),
        "burden " + task.burden,
        "exposure-dependence " + pct(task.culturalLoading)
      ].forEach(function (fact) {
        facts.appendChild(make("li", null, fact));
      });
      body.appendChild(facts);
      body.appendChild(make("span", "task__note", task.note));

      label.appendChild(input);
      label.appendChild(body);
      item.appendChild(label);
      taskList.appendChild(item);
    });
  }

  function onTaskToggle(event) {
    var id = event.target.value;
    if (event.target.checked) {
      if (state.selected.indexOf(id) === -1) {
        state.selected.push(id);
      }
    } else {
      state.selected = state.selected.filter(function (existing) {
        return existing !== id;
      });
    }
    render();

    var selected = selectedTasks();
    var scenario = byId(SCENARIOS, state.scenarioId);
    shell.announce(
      (event.target.checked ? "Added " : "Removed ") + byId(TASKS, id).name +
        ". " + totalMinutes(selected) + " of " + scenario.minutes +
        " minutes used, burden " + totalBurden(selected) + " of " +
        scenario.burdenCap + ", " + countDomains(selected) + " of " +
        DOMAINS.length + " domains sampled."
    );
  }

  function selectedTasks() {
    return state.selected.map(function (id) {
      return byId(TASKS, id);
    });
  }

  function countDomains(selected) {
    var coverage = domainCoverage(selected);
    return DOMAINS.filter(function (domain) {
      return coverage[domain.id] >= 0.3;
    }).length;
  }

  function setTasksEnabled(enabled) {
    TASKS.forEach(function (task) {
      checkboxes[task.id].disabled = !enabled;
    });
  }

  /* --- Scenario ----------------------------------------------------------- */

  SCENARIOS.forEach(function (scenario) {
    var option = make("option", null, scenario.name);
    option.value = scenario.id;
    scenarioSelect.appendChild(option);
  });

  scenarioSelect.addEventListener("change", function () {
    state.scenarioId = scenarioSelect.value;
    render();
    shell.announce(
      "Purpose changed to: " + byId(SCENARIOS, state.scenarioId).name +
        ". The same battery is now being judged against different requirements.",
      { immediate: true }
    );
  });

  /* --- Rendering ----------------------------------------------------------- */

  function render() {
    var scenario = byId(SCENARIOS, state.scenarioId);
    var selected = selectedTasks();

    scenarioBrief.textContent = scenario.brief;
    renderGoal(selected, scenario);
    renderReadout(selected, scenario);
    renderCoverage(selected);
    renderTradeoff(selected, scenario);

    var checks = constraints(selected, scenario);
    var ok = checks.every(function (check) {
      return check.met;
    });
    submitButton.disabled = state.stage !== "build" || !ok;
  }

  function renderGoal(selected, scenario) {
    clear(goalText);
    if (state.stage === "predict") {
      goalText.textContent =
        "Answer the question above to unlock the task list.";
      return;
    }

    var list = make("ul", "goal__checks");
    constraints(selected, scenario).forEach(function (check) {
      var item = make("li");
      item.textContent =
        check.label + " — " + check.detail + (check.met ? " (met)" : " (not yet)");
      item.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(item);
    });
    goalText.appendChild(list);
  }

  function renderReadout(selected, scenario) {
    clear(readout);
    [
      ["Minutes used", totalMinutes(selected) + " / " + scenario.minutes],
      ["Domains sampled", countDomains(selected) + " of " + DOMAINS.length],
      ["Composite reliability", fmt(compositeReliability(selected))],
      ["Exposure-dependence", pct(culturalLoad(selected))],
      ["Burden", totalBurden(selected) + " / " + scenario.burdenCap],
      ["Fit to this purpose", pct(fitToPurpose(selected, scenario))]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderCoverage(selected) {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 30;
    var BAR = 18;
    var LEFT = 176;
    var SCALE = 110; // pixels per unit of coverage

    clear(coverageChart);
    coverageChart.setAttribute("viewBox", "0 0 460 " + (DOMAINS.length * ROW + 14));

    var coverage = domainCoverage(selected);

    DOMAINS.forEach(function (domain, index) {
      var y = 8 + index * ROW;
      var value = coverage[domain.id];

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR - 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = domain.name;
      coverageChart.appendChild(label);

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(LEFT));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(2 * SCALE));
      track.setAttribute("height", String(BAR));
      track.setAttribute("class", "chart__track");
      coverageChart.appendChild(track);

      if (value > 0) {
        var bar = document.createElementNS(NS, "rect");
        bar.setAttribute("x", String(LEFT));
        bar.setAttribute("y", String(y));
        bar.setAttribute("width", String(Math.min(value, 2) * SCALE));
        bar.setAttribute("height", String(BAR));
        bar.setAttribute(
          "class", "chart__bar" + (value < 0.3 ? " chart__bar--thin" : ""));
        coverageChart.appendChild(bar);
      }

      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(LEFT + Math.min(value, 2) * SCALE + 6));
      text.setAttribute("y", String(y + BAR - 4));
      text.setAttribute("class", "chart__count");
      text.textContent = value === 0 ? "not sampled" : fmt(value);
      coverageChart.appendChild(text);
    });

    clear(coverageTable);
    DOMAINS.forEach(function (domain) {
      var value = coverage[domain.id];
      var row = make("tr");
      var th = make("th", null, domain.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, fmt(value)));
      row.appendChild(
        make("td", null,
          value === 0 ? "not sampled" : value < 0.3 ? "barely" : "sampled"));
      coverageTable.appendChild(row);
    });
  }

  function renderTradeoff(selected, scenario) {
    clear(tradeoffBody);
    if (!selected.length) {
      tradeoffBody.textContent =
        "Select some tasks to see what the battery is trading away.";
      tradeoffBody.setAttribute("data-tone", "neutral");
      return;
    }

    var notes = [];
    var loading = culturalLoad(selected);
    var breadth = countDomains(selected);
    var composite = compositeReliability(selected);

    if (loading > 0.65) {
      notes.push(
        "Exposure-dependence is high (" + pct(loading) + "). Most of this " +
        "battery's testing time is spent on tasks whose scores depend heavily " +
        "on what the person has had the opportunity to learn. That is not a " +
        "reason never to use them — vocabulary is a genuinely useful measure — " +
        "but it changes what a low score can be taken to mean."
      );
    } else if (loading < 0.4) {
      notes.push(
        "Exposure-dependence is comparatively low (" + pct(loading) + "). " +
        "Note that low is not zero: every task here still requires " +
        "familiarity with being tested, with the response format, and with " +
        "the idea that speed matters."
      );
    }

    if (breadth <= 2) {
      notes.push(
        "Only " + breadth + " of the six domains are sampled. A total score " +
        "from this battery would be a precise measurement of a narrow slice, " +
        "and calling it general ability would be a claim the battery cannot " +
        "support."
      );
    }

    if (composite > 0.94 && breadth <= 3) {
      notes.push(
        "The composite reliability is high (" + fmt(composite) + ") and the " +
        "coverage is not. High reliability with narrow coverage is exactly " +
        "the combination that looks reassuring in a methods section and is not."
      );
    }

    var burdenRatio = totalBurden(selected) / scenario.burdenCap;
    if (burdenRatio > 0.85) {
      notes.push(
        "Burden is close to the ceiling for this scenario. Fatigue depresses " +
        "performance on later tasks, so a battery at the limit is measuring " +
        "endurance as well as ability, and the order of administration starts " +
        "to matter."
      );
    }

    if (!notes.length) {
      notes.push(
        "No single trade-off dominates at the moment. Try pushing one metric " +
        "as high as it will go and watch what the others do."
      );
    }

    tradeoffBody.textContent = notes.join(" ");
    tradeoffBody.setAttribute(
      "data-tone", loading > 0.65 || breadth <= 2 ? "warn" : "caution");
  }

  /* --- Submit and compare -------------------------------------------------- */

  submitButton.addEventListener("click", function () {
    var scenario = byId(SCENARIOS, state.scenarioId);
    var selected = selectedTasks();
    state.submitted = {
      scenarioId: scenario.id,
      ids: state.selected.slice()
    };
    buildVerdict(selected, scenario);
    verdictSection.hidden = false;
    $("#verdict-heading").focus();
    shell.announce(
      "Battery submitted. Fit to this purpose " +
        pct(fitToPurpose(selected, scenario)) +
        ". Scroll down to see it judged against the other two purposes.",
      { immediate: true }
    );
  });

  function buildVerdict(selected, scenario) {
    clear(verdictBody);

    var fit = fitToPurpose(selected, scenario);
    verdictBody.appendChild(
      make("p", "reveal__lead",
        "Your battery fits this purpose " + pct(fit) + ", using " +
        totalMinutes(selected) + " of " + scenario.minutes + " minutes."));

    verdictBody.appendChild(make("p", null, scenario.guidance));

    var figures = make("ul", "reveal__figures");
    [
      ["Domains sampled", countDomains(selected) + " of " + DOMAINS.length],
      ["Composite reliability", fmt(compositeReliability(selected))],
      ["Exposure-dependence", pct(culturalLoad(selected))],
      ["Burden", String(totalBurden(selected))]
    ].forEach(function (pair) {
      var item = make("li");
      item.appendChild(make("span", "reveal__figure-label", pair[0]));
      item.appendChild(make("span", "reveal__figure-value", pair[1]));
      figures.appendChild(item);
    });
    verdictBody.appendChild(figures);

    // The same battery, judged against all three purposes.
    clear(comparisonTable);
    SCENARIOS.forEach(function (other) {
      var otherFit = fitToPurpose(selected, other);
      var overTime = totalMinutes(selected) > other.minutes;
      var overBurden = totalBurden(selected) > other.burdenCap;
      var row = make("tr");
      var th = make("th", null, other.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, pct(otherFit)));
      row.appendChild(
        make("td", null,
          overTime ? "over by " + (totalMinutes(selected) - other.minutes) + " min" : "fits"));
      row.appendChild(
        make("td", null,
          overBurden ? "over by " + (totalBurden(selected) - other.burdenCap) : "within"));
      comparisonTable.appendChild(row);
    });

    var fits = SCENARIOS.map(function (other) {
      return { name: other.name, fit: fitToPurpose(selected, other) };
    });
    var best = fits.slice().sort(function (a, b) {
      return b.fit - a.fit;
    })[0];

    verdictBody.appendChild(
      make("p", null,
        "The table below applies the same battery to all three purposes. It " +
        (best.name === scenario.name
          ? "happens to suit the purpose you built it for best, which is what " +
            "you would hope."
          : "actually suits “" + best.name + "” better than the one " +
            "you built it for.") +
        " The point is that the numbers move without a single task changing: " +
        "a battery is not good or bad in the abstract, only good or bad for a " +
        "stated purpose. The word “validity” names exactly this, and " +
        "it is why a test cannot be validated once and then used for anything.")
    );

    verdictBody.appendChild(
      make("p", "verdict__note",
        "Every figure is model-implied from illustrative values written for " +
        "this tool. No published test, item, norm or scoring rule is " +
        "reproduced, and nothing here produces a score for any person.")
    );
  }

  /* --- Opening prediction --------------------------------------------------- */

  var OPENING = {
    longest: {
      tone: "caution",
      verdict: "Not on its own.",
      text:
        "Length buys reliability, and reliability is not the same as measuring " +
        "the right things. A 45-minute battery of three vocabulary-like tasks " +
        "is long, highly reliable, and narrow."
    },
    reliable: {
      tone: "caution",
      verdict: "Not sufficient.",
      text:
        "A composite can be extremely reliable and still sample two of six " +
        "domains. Reliability tells you the score is repeatable; it says " +
        "nothing about what is being repeated. The Alpha Trap in this module " +
        "is the tool that takes this apart in detail."
    },
    purpose: {
      tone: "good",
      verdict: "Yes.",
      text:
        "There is no best battery, only a best battery for a stated purpose. " +
        "The same seven tasks give different answers for a research study, an " +
        "educational recommendation and a brief screen — which is the whole " +
        "content of the modern idea of validity."
    },
    culturefree: {
      tone: "caution",
      verdict: "Not achievable.",
      text:
        "No task here has zero exposure-dependence, and none could. Even " +
        "abstract matrix puzzles rely on familiarity with the format, with " +
        "being tested, and with the assumption that speed is wanted. The " +
        "Culture-Fair Test Challenge in this module is about exactly this."
    }
  };

  predictionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', predictionForm);
    if (!answer) {
      predictionError.textContent =
        "Choose an answer before building. Committing first is what makes the " +
        "trade-offs worth meeting.";
      predictionError.hidden = false;
      return;
    }
    predictionError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(predictionFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(predictionForm);
    startBuilding();
  });

  skipPrediction.addEventListener("click", function () {
    predictionError.hidden = true;
    showFeedback(
      predictionFeedback, "neutral", "Prediction skipped — demonstration mode.",
      "");
    lockForm(predictionForm);
    startBuilding();
  });

  function startBuilding() {
    state.stage = "build";
    setTasksEnabled(true);
    render();
    shell.announce(
      "Task list unlocked. Build a battery for the stated purpose.",
      { immediate: true }
    );
  }

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) {
      paragraph.appendChild(document.createTextNode(" " + text));
    }
    container.appendChild(paragraph);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = true;
      }
    );
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = false;
      }
    );
    form.reset();
  }

  /* --- Reset ---------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));

    TASKS.forEach(function (task) {
      checkboxes[task.id].checked = false;
    });
    setTasksEnabled(false);

    unlockForm(predictionForm);
    predictionFeedback.hidden = true;
    predictionError.hidden = true;
    verdictSection.hidden = true;

    scenarioSelect.value = state.scenarioId;
    render();
  });

  /* --- Start-up -------------------------------------------------------------- */

  buildTasks();
  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the task list.",
    { immediate: true }
  );
})();
