/* =========================================================================
   Sampling Bias Simulator
   -------------------------------------------------------------------------
   A generated population of 4,000 fictional students, five recruitment
   methods, and a non-response dial. The teaching target is the difference
   between an estimate that scatters and an estimate that is systematically
   off.

   THE POPULATION
   --------------
   Built once from a fixed seed (POPULATION_SEED), so the true mean below is
   the same in every browser and can be quoted in teaching notes. Each student
   has:

       year        1, 2 or 3, in equal thirds
       commuter    35% of students
       job         40% of students

   and weekly independent study hours

       hours = 12.6 + 0.6*(year 2) + 1.4*(year 3) - 2.2*commuter - 3.0*job
               + Normal(0, 4)

   clamped at zero. The POPULATION MEAN IS COMPUTED FROM THE GENERATED
   POPULATION, not asserted, so it is exactly the quantity a perfect census
   would return.

   THE RECRUITMENT MODEL
   ---------------------
   Every method is weighted sampling without replacement, done by the
   exponential-race method: give person i the key -log(U)/w(i) and take the n
   smallest keys. With w = 1 for everybody this is a simple random sample.

   The weights encode who is easy to reach:

       convenience   in the library on a Tuesday afternoon: commuters and
                     students with jobs are much less likely to be there, and
                     the chance rises with the person's own study hours -
                     selection on the outcome itself, which is the worst kind
       volunteer     an online advert: first years and heavier studiers are
                     more likely to answer
       quota         year-of-study quotas filled by convenience: the year
                     composition comes out exactly right and everything else
                     stays wrong
       stratified    random within year-by-commuting strata, proportionally
                     allocated: unbiased, and slightly more precise than
                     simple random because part of the variation is removed
                     by the strata
       random        simple random sample from the register: unbiased

   NON-RESPONSE
   ------------
   The tilt dial multiplies each person's weight by their probability of
   agreeing to take part:

       p(respond) = 1 - tilt * (0.5*commuter + 0.5*job)

   This applies to every method, including the two probability methods, which
   is the point: randomly selecting names protects the selection step and does
   nothing about the step where people decide whether to answer.

   Because the response probability enters the weight, the achieved sample
   size stays at the requested n - the equivalent of recruiting until the
   target is met, which is what real fieldwork does.

   WHAT THIS DOES NOT CLAIM
   ------------------------
   The population is generated and the selection weights are invented, chosen
   to make the effect legible rather than to estimate how much more likely a
   commuter is to be in a library. Real non-response depends on the topic, the
   mode, the incentive and the season, and is not one dial. Bias in a mean is
   also not the only bias selection produces.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var POPULATION_SEED = 20260807;
  var POPULATION_N = 4000;
  var MAX_DOTS = 40;

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
     The population
     ===================================================================== */

  function buildPopulation() {
    var random = mulberry32(POPULATION_SEED);
    var people = [];
    for (var i = 0; i < POPULATION_N; i += 1) {
      var year = 1 + Math.floor(random() * 3);
      var commuter = random() < 0.35;
      var job = random() < 0.40;
      var hours = 12.6 +
        (year === 2 ? 0.6 : 0) + (year === 3 ? 1.4 : 0) +
        (commuter ? -2.2 : 0) + (job ? -3.0 : 0) +
        normal(random) * 4;
      people.push({
        year: year,
        commuter: commuter,
        job: job,
        hours: Math.max(0, hours)
      });
    }
    return people;
  }

  var POPULATION = buildPopulation();

  function mean(values) {
    if (!values.length) { return 0; }
    return values.reduce(function (s, v) { return s + v; }, 0) / values.length;
  }

  function sd(values) {
    if (values.length < 2) { return 0; }
    var m = mean(values);
    var ss = values.reduce(function (s, v) { return s + (v - m) * (v - m); }, 0);
    return Math.sqrt(ss / (values.length - 1));
  }

  var TRUE_MEAN = mean(POPULATION.map(function (p) { return p.hours; }));

  /* =======================================================================
     Recruitment methods
     ===================================================================== */

  var METHODS = [
    {
      id: "convenience",
      name: "Convenience",
      where: "whoever is in the library on a Tuesday afternoon",
      strata: null,
      weight: function (person) {
        return (person.commuter ? 0.3 : 1) *
          (person.job ? 0.4 : 1) *
          Math.exp(0.10 * (person.hours - TRUE_MEAN));
      },
      note:
        "Three problems at once. Commuters and students with jobs are much " +
        "less likely to be in the building, and the chance of being there " +
        "rises with how much a person studies - which is selection on the " +
        "outcome itself. Nothing about this improves as the sample grows."
    },
    {
      id: "volunteer",
      name: "Self-selected volunteers",
      where: "an advert posted online, answered by whoever wants to",
      strata: null,
      weight: function (person) {
        return (person.year === 1 ? 1.6 : person.year === 2 ? 1 : 0.6) *
          Math.exp(0.06 * (person.hours - TRUE_MEAN));
      },
      note:
        "Milder than convenience and the same shape. People who answer " +
        "research adverts are not a random subset of people: here they skew " +
        "towards first years and towards heavier studiers, and both of those " +
        "are related to the answer."
    },
    {
      id: "quota",
      name: "Quota sampling on year of study",
      where: "equal numbers from each year, filled by convenience",
      strata: "year",
      weight: function (person) {
        return (person.commuter ? 0.3 : 1) *
          (person.job ? 0.4 : 1) *
          Math.exp(0.10 * (person.hours - TRUE_MEAN));
      },
      note:
        "The year composition comes out exactly right, which looks " +
        "reassuring in a table. Within each year the recruitment is still " +
        "convenience, so commuting, part-time work and study hours are as " +
        "badly selected as before. A quota corrects the variable you set a " +
        "quota on and nothing else."
    },
    {
      id: "stratified",
      name: "Stratified random sampling",
      where: "random names within year-by-commuting strata",
      strata: "yearcommute",
      weight: function () { return 1; },
      note:
        "Unbiased, and a little more precise than a simple random sample of " +
        "the same size: fixing the composition on two variables that relate " +
        "to the outcome removes part of the variation between samples. Note " +
        "what it does NOT do - it is no more unbiased than simple random " +
        "sampling, because simple random sampling was already unbiased."
    },
    {
      id: "random",
      name: "Simple random sample",
      where: "names drawn at random from the full student register",
      strata: null,
      weight: function () { return 1; },
      note:
        "Unbiased: over many repetitions these estimates centre on the " +
        "population mean. Any one of them can still be well out, which is " +
        "sampling variability and is cured by a larger sample. Raise the " +
        "non-response tilt and watch this guarantee disappear."
    }
  ];

  function methodById(id) {
    return METHODS.filter(function (m) { return m.id === id; })[0] || METHODS[0];
  }

  /**
   * Weighted sampling without replacement by the exponential-race method:
   * key(i) = -log(U)/w(i), take the n smallest keys. With every w equal this
   * is exactly a simple random sample.
   */
  function sampleWeighted(pool, n, weightOf, random) {
    var take = Math.min(n, pool.length);
    var keyed = pool.map(function (person) {
      var w = Math.max(weightOf(person), 1e-9);
      return { person: person, key: -Math.log(Math.max(random(), 1e-12)) / w };
    });
    keyed.sort(function (a, b) { return a.key - b.key; });
    return keyed.slice(0, take).map(function (entry) { return entry.person; });
  }

  function responseProbability(person, tilt) {
    return Math.max(0.02,
      1 - tilt * (0.5 * (person.commuter ? 1 : 0) + 0.5 * (person.job ? 1 : 0)));
  }

  function drawSample(methodId, n, tilt, seed) {
    var method = methodById(methodId);
    var random = mulberry32(seed);
    var weightOf = function (person) {
      return method.weight(person) * responseProbability(person, tilt);
    };

    if (!method.strata) {
      return sampleWeighted(POPULATION, n, weightOf, random);
    }

    // Stratified or quota: split the population, then allocate.
    var keyOf = method.strata === "year"
      ? function (p) { return String(p.year); }
      : function (p) { return p.year + "-" + (p.commuter ? "c" : "r"); };

    var strata = {};
    POPULATION.forEach(function (person) {
      var key = keyOf(person);
      (strata[key] = strata[key] || []).push(person);
    });
    var keys = Object.keys(strata).sort();

    var quotas;
    if (method.strata === "year") {
      // Equal quotas per year: the composition is imposed, not proportional.
      quotas = keys.map(function () { return Math.round(n / keys.length); });
    } else {
      // Proportional allocation.
      quotas = keys.map(function (key) {
        return Math.round(n * strata[key].length / POPULATION.length);
      });
    }

    var out = [];
    keys.forEach(function (key, i) {
      out = out.concat(sampleWeighted(strata[key], quotas[i], weightOf, random));
    });
    return out;
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

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function fmt(value, places) {
    var p = places === undefined ? 2 : places;
    return value.toFixed(p);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#sampling");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var methodList = $("[data-method-list]");
  var sizeRange = $("#size-range");
  var tiltRange = $("#nonresponse-range");
  var seedInput = $("#seed-input");
  var lineChart = $("[data-line]");
  var readout = $("[data-readout]");
  var verdict = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var composition = $("[data-composition]");
  var historyTable = $("[data-history-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var simSection = $("#sim-section");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var DEFAULTS = { method: "convenience", size: 120, tilt: 0, seed: 3181 };
  var history = [];
  var latest = null;

  /* --- Method radios ------------------------------------------------------- */

  METHODS.forEach(function (method, i) {
    var wrap = make("div", "method");
    var label = make("label", "method__row");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "method";
    input.value = method.id;
    if (i === 0) { input.checked = true; }
    label.appendChild(input);
    var name = make("span", "method__name");
    name.appendChild(document.createTextNode(method.name));
    name.appendChild(make("span", "method__where", method.where));
    label.appendChild(name);
    wrap.appendChild(label);
    methodList.appendChild(wrap);
    input.addEventListener("change", function () {
      history = [];
      latest = null;
      render();
      shell.announce(method.name + " selected. Previous estimates cleared. " +
        method.note, { immediate: true });
    });
  });

  function chosenMethod() {
    var checked = $('input[name="method"]:checked', methodList);
    return methodById(checked ? checked.value : DEFAULTS.method);
  }

  /* --- Ranges --------------------------------------------------------------- */

  shell.bindRange(sizeRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " people recruited"; },
    onInput: function () { history = []; latest = null; render(); }
  });

  shell.bindRange(tiltRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return v === 0
        ? "no non-response - everyone approached takes part"
        : v + " per cent tilt: commuters and students with jobs are that much " +
          "more likely to decline";
    },
    onInput: function () { history = []; latest = null; render(); }
  });

  /* --- Drawing --------------------------------------------------------------- */

  function drawOnce() {
    var method = chosenMethod();
    var n = Number(sizeRange.value);
    var tilt = Number(tiltRange.value) / 100;
    var seed = Math.max(1, Math.round(Number(seedInput.value) || 1));
    var people = drawSample(method.id, n, tilt, seed);
    var hours = people.map(function (p) { return p.hours; });
    var estimate = mean(hours);
    var spread = sd(hours);
    var se = spread / Math.sqrt(Math.max(people.length, 1));

    latest = {
      method: method,
      people: people,
      estimate: estimate,
      se: se,
      low: estimate - 1.96 * se,
      high: estimate + 1.96 * se,
      n: people.length
    };
    history.push(estimate);
    if (history.length > MAX_DOTS) { history.shift(); }
    seedInput.value = String(seed + 1);
  }

  /* --- Rendering ------------------------------------------------------------- */

  function axisBounds() {
    var values = history.concat([TRUE_MEAN]);
    if (latest) { values = values.concat([latest.low, latest.high]); }
    var lo = Math.min.apply(null, values) - 0.6;
    var hi = Math.max.apply(null, values) + 0.6;
    // Always show at least a four-hour window, centred on the truth if narrow.
    if (hi - lo < 4) {
      var mid = (hi + lo) / 2;
      lo = mid - 2;
      hi = mid + 2;
    }
    return { lo: lo, hi: hi };
  }

  function renderLine() {
    var W = 460;
    var left = 34;
    var right = W - 20;
    var axisY = 78;
    var bounds = axisBounds();
    var x = function (value) {
      return left + ((value - bounds.lo) / (bounds.hi - bounds.lo)) * (right - left);
    };

    clear(lineChart);

    lineChart.appendChild(svgNode("line", {
      x1: left, y1: axisY, x2: right, y2: axisY, class: "line__axis"
    }));

    // Axis ticks every hour.
    for (var v = Math.ceil(bounds.lo); v <= Math.floor(bounds.hi); v += 1) {
      lineChart.appendChild(svgNode("line", {
        x1: x(v), y1: axisY, x2: x(v), y2: axisY + 5, class: "line__axis"
      }));
      var tick = svgNode("text", {
        x: x(v), y: axisY + 18, "text-anchor": "middle", class: "chart__axis"
      });
      tick.textContent = String(v);
      lineChart.appendChild(tick);
    }
    var axisLabel = svgNode("text", {
      x: (left + right) / 2, y: axisY + 36, "text-anchor": "middle",
      class: "chart__axis"
    });
    axisLabel.textContent = "estimated average independent study hours per week";
    lineChart.appendChild(axisLabel);

    // The truth.
    lineChart.appendChild(svgNode("line", {
      x1: x(TRUE_MEAN), y1: 16, x2: x(TRUE_MEAN), y2: axisY + 6,
      class: "line__truth"
    }));
    var truthLabel = svgNode("text", {
      x: Math.min(x(TRUE_MEAN) + 6, right - 4), y: 12,
      "text-anchor": x(TRUE_MEAN) > (left + right) / 2 ? "end" : "start",
      class: "chart__label"
    });
    truthLabel.textContent = "population mean " + fmt(TRUE_MEAN);
    lineChart.appendChild(truthLabel);

    // Previous estimates as hollow circles, stacked so they do not overlap.
    history.slice(0, Math.max(history.length - 1, 0)).forEach(function (value, i) {
      lineChart.appendChild(svgNode("circle", {
        cx: x(value), cy: 34 + (i % 5) * 6, r: 3.2, class: "line__past"
      }));
    });

    // The most recent estimate: a filled diamond with its interval.
    if (latest) {
      lineChart.appendChild(svgNode("line", {
        x1: x(latest.low), y1: 66, x2: x(latest.high), y2: 66,
        class: "line__interval"
      }));
      var cx = x(latest.estimate);
      lineChart.appendChild(svgNode("polygon", {
        points: [
          cx + ",58", (cx + 7) + ",66", cx + ",74", (cx - 7) + ",66"
        ].join(" "),
        class: "line__current"
      }));
    }
  }

  function renderReadout() {
    clear(readout);
    var rows;
    if (!latest) {
      rows = [
        ["Population mean (the truth)", fmt(TRUE_MEAN) + " hours"],
        ["Your estimate", "not drawn yet"],
        ["Difference", "—"],
        ["Estimates so far", "0"]
      ];
    } else {
      var runningBias = mean(history) - TRUE_MEAN;
      rows = [
        ["Population mean (the truth)", fmt(TRUE_MEAN) + " hours"],
        ["Your estimate", fmt(latest.estimate) + " hours"],
        ["Difference from truth",
          (latest.estimate >= TRUE_MEAN ? "+" : "") +
          fmt(latest.estimate - TRUE_MEAN) + " hours"],
        ["Average of " + history.length + " draw" + (history.length === 1 ? "" : "s"),
          fmt(mean(history)) + " hours (" +
          (runningBias >= 0 ? "+" : "") + fmt(runningBias) + ")"]
      ];
    }
    rows.forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function share(people, test) {
    if (!people.length) { return null; }
    return people.filter(test).length / people.length;
  }

  function renderComposition() {
    var groups = [
      ["First years", function (p) { return p.year === 1; }],
      ["Second years", function (p) { return p.year === 2; }],
      ["Third years", function (p) { return p.year === 3; }],
      ["Commuters", function (p) { return p.commuter; }],
      ["Holding a part-time job", function (p) { return p.job; }]
    ];
    clear(composition);
    groups.forEach(function (group) {
      var popShare = share(POPULATION, group[1]);
      var sampleShare = latest ? share(latest.people, group[1]) : null;
      var groupHours = mean(POPULATION.filter(group[1])
        .map(function (p) { return p.hours; }));
      var row = make("tr");
      var th = make("th", null, group[0]);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, Math.round(popShare * 100) + "%"));
      var cell = make("td", null,
        sampleShare === null ? "—" : Math.round(sampleShare * 100) + "%");
      if (sampleShare !== null && Math.abs(sampleShare - popShare) > 0.08) {
        cell.setAttribute("data-drift", "high");
      }
      row.appendChild(cell);
      row.appendChild(make("td", null, fmt(groupHours) + " hours"));
      composition.appendChild(row);
    });
  }

  function renderHistoryTable() {
    clear(historyTable);
    if (!history.length) {
      var row = make("tr");
      var cell = make("td", null, "No samples drawn yet.");
      cell.setAttribute("colspan", "3");
      row.appendChild(cell);
      historyTable.appendChild(row);
      return;
    }
    history.forEach(function (value, i) {
      var tr = make("tr");
      var th = make("th", null, String(i + 1));
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, fmt(value)));
      tr.appendChild(make("td", null,
        (value >= TRUE_MEAN ? "+" : "") + fmt(value - TRUE_MEAN)));
      historyTable.appendChild(tr);
    });
  }

  function renderInterpretation() {
    var method = chosenMethod();
    var tilt = Number(tiltRange.value);
    var text;
    var tone;

    if (!history.length) {
      tone = "caution";
      text = method.note + " Press Recruit a sample to see where it lands.";
    } else {
      var runningBias = mean(history) - TRUE_MEAN;
      var spread = history.length > 1 ? sd(history) : null;
      var unbiasedMethod = method.id === "random" || method.id === "stratified";
      var settled = history.length >= 8;

      text = method.note + " ";
      if (settled && Math.abs(runningBias) < 0.25) {
        tone = "good";
        text += "Across " + history.length + " draws the estimates average " +
          fmt(mean(history)) + " against a truth of " + fmt(TRUE_MEAN) +
          " - a running difference of " + fmt(runningBias) +
          " hours, about what chance alone gives. The dots scatter; they do " +
          "not sit to one side. " +
          (spread !== null
            ? "Their spread is " + fmt(spread) + " hours, and that is the part " +
              "a bigger sample shrinks."
            : "");
      } else if (settled) {
        tone = "warn";
        text += "Across " + history.length + " draws the estimates average " +
          fmt(mean(history)) + " against a truth of " + fmt(TRUE_MEAN) +
          " - a running difference of " + (runningBias > 0 ? "+" : "") +
          fmt(runningBias) + " hours. The cloud is not centred on the line. " +
          (spread !== null
            ? "The spread between draws is " + fmt(spread) + " hours: raise the " +
              "sample size and the spread shrinks while the offset stays " +
              "exactly where it is."
            : "") +
          (unbiasedMethod && tilt > 0
            ? " The selection here is random. The non-response tilt has put " +
              "back exactly the problem randomisation removed."
            : "");
      } else {
        tone = "caution";
        text += "One or two draws tell you very little: a badly selected " +
          "sample can land on the truth by accident, and a perfect one can " +
          "miss by an hour. Draw at least eight.";
      }
    }

    interpretation.textContent = text;
    verdict.setAttribute("data-tone", tone);
  }

  function render() {
    renderLine();
    renderReadout();
    renderComposition();
    renderHistoryTable();
    renderInterpretation();
  }

  /* --- Buttons ---------------------------------------------------------------- */

  $('[data-action="draw"]').addEventListener("click", function () {
    drawOnce();
    render();
    shell.announce(
      "Sample of " + latest.n + " recruited. Estimate " +
      fmt(latest.estimate) + " hours against a population mean of " +
      fmt(TRUE_MEAN) + ", a difference of " +
      (latest.estimate >= TRUE_MEAN ? "plus " : "minus ") +
      fmt(Math.abs(latest.estimate - TRUE_MEAN)) + ".", { immediate: true });
  });

  $('[data-action="draw20"]').addEventListener("click", function () {
    for (var i = 0; i < 20; i += 1) { drawOnce(); }
    render();
    var runningBias = mean(history) - TRUE_MEAN;
    shell.announce(
      "Twenty samples recruited. Those estimates average " +
      fmt(mean(history)) + " hours against a population mean of " +
      fmt(TRUE_MEAN) + ", a running difference of " +
      (runningBias >= 0 ? "plus " : "minus ") + fmt(Math.abs(runningBias)) + ".",
      { immediate: true });
  });

  $('[data-action="clear"]').addEventListener("click", function () {
    history = [];
    latest = null;
    render();
    shell.announce("Estimates cleared. The population is unchanged.",
      { immediate: true });
  });

  /* --- Opening prediction ------------------------------------------------------- */

  var OPENING = {
    accurate: {
      tone: "warn",
      verdict: "That is the belief to give up.",
      text:
        "Nine hundred responses make the estimate precise, not correct. If " +
        "the people who answer a social-media link differ from the people who " +
        "do not, the average of those 900 is a very good estimate of the " +
        "wrong quantity. Choose the volunteer method below and draw twenty " +
        "samples."
    },
    precise: {
      tone: "good",
      verdict: "Yes, and that is the uncomfortable part.",
      text:
        "A large self-selected sample estimates the average among people who " +
        "answer adverts, tightly. The interval narrows, the p-value falls, and " +
        "the answer stays wrong. Precision and accuracy are separate " +
        "properties, and only one of them is bought with sample size."
    },
    noisy: {
      tone: "caution",
      verdict: "Not unpredictable — that is the surprise.",
      text:
        "Self-selection does not scatter estimates randomly; it pulls them " +
        "consistently in one direction. Draw twenty volunteer samples below " +
        "and watch the cloud sit to one side of the line rather than " +
        "wandering across it. Consistent is worse than unpredictable here, " +
        "because it looks like replication."
    },
    unknowable: {
      tone: "caution",
      verdict: "A response rate would help, and it would not settle it.",
      text:
        "A high response rate from a self-selected pool is still a " +
        "self-selected pool, and a low response rate from a random sample can " +
        "be harmless if the non-responders are no different. What matters is " +
        "whether non-response is related to the thing being measured, which " +
        "the rate alone cannot tell you."
    }
  };

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
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openSimulator() {
    simSection.hidden = false;
    render();
    $("#sim-heading").focus();
    shell.announce("Simulator unlocked. The population mean is " +
      fmt(TRUE_MEAN) + " hours.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose a prediction before opening the simulator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openSimulator();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openSimulator();
  });

  /* --- Challenge ------------------------------------------------------------------ */

  var CHALLENGE_NOTES = {
    more: {
      helps: false,
      text:
        "Reduces the scatter and not the bias. Six times the responses give a " +
        "much narrower interval around the same 2.6-hour error. This is the " +
        "change most teams make, because it is the one they know how to cost."
    },
    frame: {
      helps: true,
      text:
        "Attacks the bias directly. Once names are drawn from the register, " +
        "being in the library on a Tuesday no longer decides who is asked. " +
        "This is the only change here that fixes the selection step itself."
    },
    chase: {
      helps: true,
      text:
        "Helps, and helps most when it reaches the people who are hardest to " +
        "reach. Chasing non-responders reduces bias only to the extent that " +
        "the ones you eventually get resemble the ones you never get, so the " +
        "effort belongs with the least reachable rather than the easiest."
    },
    weight: {
      helps: true,
      text:
        "Partly. Weighting to the register's year and commuting mix removes " +
        "the bias that runs through those two variables and leaves everything " +
        "else - part-time work, and the fact that heavier studiers were in " +
        "the library at all. Weighting corrects the variables you have."
    },
    ci: {
      helps: false,
      text:
        "Changes nothing about either problem. A wider interval around a " +
        "biased estimate is a wider interval around a biased estimate. " +
        "Confidence intervals describe sampling variability under the model, " +
        "and the model assumes the sample was drawn the way it says it was."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one change.",
        "Three of the five reduce the bias, though one only partly.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !CHALLENGE_NOTES[v].helps; });
    var rightMissed = Object.keys(CHALLENGE_NOTES).filter(function (v) {
      return CHALLENGE_NOTES[v].helps && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : rightMissed.length ? "caution" : "good";
    var verdictText = wrongPicked.length
      ? "At least one of these treats precision as though it were accuracy."
      : rightMissed.length
        ? "Everything you chose does reduce bias; there is more that does."
        : "Yes — the three that touch the selection, and neither of the two that only narrow or widen the interval.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    challengeFeedback.appendChild(lead);
    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(CHALLENGE_NOTES[value].text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ----------------------------------------------------------------------- */

  shell.onReset(function () {
    history = [];
    latest = null;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    simSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    $$('input[name="method"]', methodList).forEach(function (input) {
      input.checked = input.value === DEFAULTS.method;
    });
    sizeRange.value = String(DEFAULTS.size);
    tiltRange.value = String(DEFAULTS.tilt);
    seedInput.value = String(DEFAULTS.seed);
    render();
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the simulator.",
    { immediate: true });
})();
