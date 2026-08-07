/* =========================================================================
   State versus Trait Tracker
   -------------------------------------------------------------------------
   Fictional experience-sampling data: several people, several observations a
   day, across two weeks. Students meet a single moment first and try to rank
   people from it, discover how badly that works, and then get the controls
   that generated the data.

   THE EDUCATIONAL MODEL
   ---------------------
   Every momentary observation for person p at time t is

       observed(p,t) = trait(p)                     stable person mean
                     + event(p,t)                   a reaction that decays
                     + wobble(p,t)                  within-person fluctuation
                     + error(p,t)                   measurement error

   `wobble` is drawn from a normal distribution whose SD is that person's own
   within-person variability — a property of the PERSON, not of the
   measurement. Two people can share a trait level and differ enormously here,
   and that difference is itself psychologically meaningful rather than noise
   to be averaged away.

   `event` is a reaction to a dated event that decays geometrically, so an
   event moves several consecutive observations rather than one.

   `error` is measurement error: it is NOT part of the person, it shrinks with
   averaging, and separating it from `wobble` is the whole reason the two are
   modelled apart.

   What the tool is built to make visible:

     * one observation is a terrible estimate of a person's typical level;
     * the person mean stabilises quickly as observations accumulate, and how
       quickly depends on within-person SD, not on the trait level;
     * two people with the same mean can be quite different people;
     * two people showing the same value right now can have different means;
     * measurement error and real within-person variability look identical in
       a single observation and come apart across repeated ones.

   RANDOMNESS
   ----------
   A seeded generator (mulberry32) is used throughout, and the seed is shown
   on screen and settable. The same seed always reproduces the same dataset,
   so a demonstration can be repeated exactly in a later class and a student
   can be told which seed to use.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   * Observations are equally spaced and never missing. Real experience
     sampling has both problems badly.
   * The trait level does not drift over the fortnight. Over months it would.
   * Wobble is independent between occasions apart from event decay; real
     within-person series are autocorrelated.
   * Everything is on an arbitrary 0-100 scale with no norms.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. Constants and people
     ===================================================================== */

  var DAYS = 14;
  var PER_DAY = 4;
  var TOTAL = DAYS * PER_DAY;

  /* Four fictional people, chosen so that the two comparisons the brief asks
     for are both available:
       Ada  vs Bo   — same trait level, very different within-person spread
       Bo   vs Cleo — different trait level, and they can share a moment  */
  var PEOPLE = [
    {
      id: "ada",
      name: "Ada",
      trait: 62,
      wobble: 4,
      note: "Steady. What you see on one day is close to what you get on any day."
    },
    {
      id: "bo",
      name: "Bo",
      trait: 62,
      wobble: 17,
      note: "Same typical level as Ada, and a completely different experience of it."
    },
    {
      id: "cleo",
      name: "Cleo",
      trait: 40,
      wobble: 11,
      note: "A lower typical level, with a moderate amount of day-to-day movement."
    },
    {
      id: "dev",
      name: "Dev",
      trait: 74,
      wobble: 9,
      note: "A higher typical level, moderately variable."
    }
  ];

  /* Dated events. `size` is the immediate effect; it decays by `decay` at
     each subsequent observation. */
  var EVENTS = [
    { personId: "bo", day: 4, size: -22, label: "a difficult conversation" },
    { personId: "bo", day: 9, size: 20, label: "an unexpected success" },
    { personId: "cleo", day: 6, size: 18, label: "good news" },
    { personId: "dev", day: 11, size: -16, label: "a setback" }
  ];
  var EVENT_DECAY = 0.55;

  /* =======================================================================
     2. Seeded random numbers
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

  /** Box–Muller, so the wobble is normal rather than uniform. */
  function normalPair(random) {
    var u = Math.max(random(), 1e-9);
    var v = random();
    var r = Math.sqrt(-2 * Math.log(u));
    return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
  }

  function makeNormals(random, count) {
    var values = [];
    while (values.length < count) {
      var pair = normalPair(random);
      values.push(pair[0]);
      values.push(pair[1]);
    }
    return values.slice(0, count);
  }

  /* =======================================================================
     3. Generating the dataset
     ===================================================================== */

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  /**
   * Build the full series for everyone.
   * @param {object} settings  { seed, wobbleScale, errorSd, eventsOn }
   * @returns {object} { series: {id: [values]}, truth: {id: {...}} }
   */
  function generate(settings) {
    var random = mulberry32(settings.seed);
    var series = {};
    var truth = {};

    PEOPLE.forEach(function (person) {
      var wobbleSd = person.wobble * settings.wobbleScale;
      var wobbles = makeNormals(random, TOTAL);
      var errors = makeNormals(random, TOTAL);
      var values = [];
      var eventCarry = 0;

      for (var i = 0; i < TOTAL; i += 1) {
        var day = Math.floor(i / PER_DAY) + 1;
        var slot = i % PER_DAY;

        if (settings.eventsOn && slot === 0) {
          EVENTS.forEach(function (event) {
            if (event.personId === person.id && event.day === day) {
              eventCarry += event.size;
            }
          });
        }

        var value =
          person.trait +
          eventCarry +
          wobbles[i] * wobbleSd +
          errors[i] * settings.errorSd;

        values.push(clamp(value, 0, 100));
        eventCarry *= EVENT_DECAY;
      }

      series[person.id] = values;
      truth[person.id] = {
        trait: person.trait,
        wobbleSd: wobbleSd,
        mean: mean(values),
        sd: sd(values)
      };
    });

    return { series: series, truth: truth };
  }

  function mean(values) {
    return values.reduce(function (a, b) {
      return a + b;
    }, 0) / values.length;
  }

  function sd(values) {
    var m = mean(values);
    return Math.sqrt(
      values.reduce(function (total, value) {
        return total + (value - m) * (value - m);
      }, 0) / values.length
    );
  }

  /** Between-person SD of the person means. */
  function betweenSd(truth) {
    return sd(PEOPLE.map(function (person) {
      return truth[person.id].mean;
    }));
  }

  /** Mean of the within-person SDs. */
  function withinSd(truth) {
    return mean(PEOPLE.map(function (person) {
      return truth[person.id].sd;
    }));
  }

  /**
   * How much of the total variance sits between people rather than within
   * them — the intraclass correlation, which is what a reliability figure
   * from a single occasion is really estimating.
   */
  function icc(truth) {
    var between = betweenSd(truth);
    var within = withinSd(truth);
    var b2 = between * between;
    var w2 = within * within;
    return b2 + w2 === 0 ? 0 : b2 / (b2 + w2);
  }

  /* =======================================================================
     4. Helpers
     ===================================================================== */

  function fmt(value, places) {
    return value === null || value === undefined || isNaN(value)
      ? "—"
      : value.toFixed(places === undefined ? 1 : places);
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

  function personById(id) {
    return PEOPLE.filter(function (person) {
      return person.id === id;
    })[0];
  }

  /* =======================================================================
     5. Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#tracker");
  if (!shell) {
    return;
  }

  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var snapshotList = $("[data-snapshot]");
  var snapshotForm = $("#snapshot-form");
  var snapshotError = $("[data-snapshot-error]");
  var snapshotFeedback = $("[data-snapshot-feedback]");
  var snapshotSection = $("#snapshot");

  var trackerSection = $("#tracker-section");
  var seriesChart = $("[data-series-chart]");
  var seriesTable = $("[data-series-table]");
  var readout = $("[data-readout]");
  var stabilityChart = $("[data-stability-chart]");
  var stabilityNote = $("[data-stability-note]");
  var seedInput = $("#seed-input");
  var newSeedButton = $('[data-action="new-seed"]');
  var eventsToggle = $("#events-toggle");
  var personToggles = $("[data-person-toggles]");

  var challengeAForm = $("#challenge-a-form");
  var challengeAFeedback = $("[data-challenge-a-feedback]");
  var challengeBForm = $("#challenge-b-form");
  var challengeBFeedback = $("[data-challenge-b-feedback]");

  /* The default seed is not arbitrary. Ada and Bo are designed to share a
     typical level, but with a within-person SD of 17 the mean of 56
     observations still has a standard error of about 2.3 — so on many seeds
     their OBSERVED means differ by several points and the comparison the tool
     is built around reads as a difference rather than a match. This seed
     produces observed means of 62.1 and 62.0 with SDs of 4.5 and 18.6, which
     is the intended contrast. Pressing "Draw a new fortnight" shows the
     sampling variability honestly, and the teaching notes say so. */
  var INITIAL = {
    seed: 20260813,
    wobbleScale: 1,
    errorSd: 3,
    eventsOn: true,
    visible: { ada: true, bo: true, cleo: true, dev: true },
    snapshotIndex: 21,
    snapshotDone: false
  };

  var state = null;
  var data = null;
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
      if (settings.onInput) {
        settings.onInput(value);
      }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() {
    rangeSyncs.forEach(function (sync) {
      sync();
    });
  }

  function regenerate() {
    data = generate({
      seed: state.seed,
      wobbleScale: state.wobbleScale,
      errorSd: state.errorSd,
      eventsOn: state.eventsOn
    });
  }

  /* --- The snapshot round -------------------------------------------------
     One moment, four people, ranked. This is the round that has to come
     first: seeing the full series makes the question trivial. */

  function renderSnapshot() {
    clear(snapshotList);
    var index = state.snapshotIndex;
    var day = Math.floor(index / PER_DAY) + 1;

    $("[data-snapshot-when]").textContent =
      "Day " + day + ", observation " + ((index % PER_DAY) + 1) + " of the day.";

    PEOPLE.forEach(function (person) {
      var value = data.series[person.id][index];
      var row = make("div", "snapshot__row");

      var name = make("span", "snapshot__name", person.name);
      var score = make("span", "snapshot__value", fmt(value, 0));
      row.appendChild(name);
      row.appendChild(score);

      var id = "snap-" + person.id;
      var label = make("label", "snapshot__label");
      label.setAttribute("for", id);
      label.textContent = "Typical level rank";

      var select = document.createElement("select");
      select.id = id;
      select.setAttribute("data-person", person.id);
      var blank = make("option", null, "—");
      blank.value = "";
      select.appendChild(blank);
      PEOPLE.forEach(function (_, i) {
        var option = make("option", null, String(i + 1));
        option.value = String(i + 1);
        select.appendChild(option);
      });

      row.appendChild(label);
      row.appendChild(select);
      snapshotList.appendChild(row);
    });
  }

  snapshotForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var selects = snapshotForm.querySelectorAll("select[data-person]");
    var ranking = {};
    var used = {};
    var complete = true;
    var duplicate = false;

    Array.prototype.forEach.call(selects, function (select) {
      if (!select.value) {
        complete = false;
        return;
      }
      if (used[select.value]) {
        duplicate = true;
      }
      used[select.value] = true;
      ranking[select.getAttribute("data-person")] = Number(select.value);
    });

    if (!complete) {
      snapshotError.textContent =
        "Give every person a rank from 1 to 4 before revealing.";
      snapshotError.hidden = false;
      return;
    }
    if (duplicate) {
      snapshotError.textContent =
        "Each rank from 1 to 4 can only be used once.";
      snapshotError.hidden = false;
      return;
    }
    snapshotError.hidden = true;

    // The truth: rank by person mean across the whole fortnight.
    var byMean = PEOPLE.slice().sort(function (a, b) {
      return data.truth[b.id].mean - data.truth[a.id].mean;
    });
    var actual = {};
    byMean.forEach(function (person, index) {
      actual[person.id] = index + 1;
    });

    var right = PEOPLE.filter(function (person) {
      return ranking[person.id] === actual[person.id];
    }).length;

    state.snapshotDone = true;
    showSnapshotFeedback(ranking, actual, right);
    lockForm(snapshotForm);
    trackerSection.hidden = false;
    renderAll();
    $("#tracker-heading").focus();

    shell.announce(
      "Revealed. " + right + " of 4 correct from a single observation.",
      { immediate: true }
    );
  });

  function showSnapshotFeedback(ranking, actual, right) {
    clear(snapshotFeedback);
    snapshotFeedback.hidden = false;
    snapshotFeedback.setAttribute(
      "data-tone", right === 4 ? "good" : right >= 2 ? "caution" : "warn");

    var paragraph = make("p");
    paragraph.appendChild(
      make("strong", "feedback__verdict",
        right + " of 4 in the right place."));
    snapshotFeedback.appendChild(paragraph);

    var table = make("table", "data-table");
    var head = make("thead");
    var headRow = make("tr");
    ["Person", "That moment", "You said", "Their actual mean", "True rank"]
      .forEach(function (heading) {
        var th = make("th", null, heading);
        th.setAttribute("scope", "col");
        headRow.appendChild(th);
      });
    head.appendChild(headRow);
    table.appendChild(head);

    var body = make("tbody");
    PEOPLE.slice()
      .sort(function (a, b) {
        return actual[a.id] - actual[b.id];
      })
      .forEach(function (person) {
        var row = make("tr");
        var th = make("th", null, person.name);
        th.setAttribute("scope", "row");
        row.appendChild(th);
        row.appendChild(
          make("td", null, fmt(data.series[person.id][state.snapshotIndex], 0)));
        row.appendChild(make("td", null, String(ranking[person.id])));
        row.appendChild(make("td", null, fmt(data.truth[person.id].mean)));
        row.appendChild(make("td", null, String(actual[person.id])));
        body.appendChild(row);
      });
    table.appendChild(body);

    var wrap = make("div", "table-scroll");
    wrap.appendChild(table);
    snapshotFeedback.appendChild(wrap);

    snapshotFeedback.appendChild(
      make("p", null,
        "One observation is a poor estimate of anybody's typical level, and " +
        "it is worst for the people who vary most. Two of these four have the " +
        "same underlying level as each other; from a single moment there is " +
        "no way to know that, and no way to know which of the four you are " +
        "seeing at an unrepresentative time.")
    );
  }

  /* --- Controls ------------------------------------------------------------ */

  bindRange($("#wobble-range"), {
    format: function (value) {
      return (value / 100).toFixed(2) + "×";
    },
    describe: function (value) {
      return value === 0
        ? "no within-person variability"
        : (value / 100).toFixed(2) + " times each person's own variability";
    },
    onInput: function (value) {
      state.wobbleScale = value / 100;
      regenerate();
      renderAll();
    }
  });

  bindRange($("#error-range"), {
    format: function (value) {
      return String(value);
    },
    describe: function (value) {
      return value === 0
        ? "no measurement error"
        : "measurement error standard deviation " + value + " points";
    },
    onInput: function (value) {
      state.errorSd = value;
      regenerate();
      renderAll();
    }
  });

  eventsToggle.addEventListener("change", function () {
    state.eventsOn = eventsToggle.checked;
    regenerate();
    renderAll();
    shell.announce(
      state.eventsOn ? "Events switched on." : "Events switched off.",
      { immediate: true }
    );
  });

  seedInput.addEventListener("change", function () {
    var value = parseInt(seedInput.value, 10);
    if (isNaN(value)) {
      seedInput.value = String(state.seed);
      return;
    }
    state.seed = value;
    regenerate();
    renderAll();
    shell.announce("Seed " + value + ". New dataset generated.", {
      immediate: true
    });
  });

  newSeedButton.addEventListener("click", function () {
    // Derived from the current seed rather than the clock, so the sequence a
    // class sees is reproducible from the starting seed alone.
    state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
    if (state.seed < 0) {
      state.seed += 2147483647;
    }
    seedInput.value = String(state.seed);
    regenerate();
    renderAll();
    shell.announce("New dataset, seed " + state.seed + ".", { immediate: true });
  });

  function buildPersonToggles() {
    clear(personToggles);
    PEOPLE.forEach(function (person) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.visible[person.id];
      input.addEventListener("change", function () {
        state.visible[person.id] = input.checked;
        renderAll();
      });
      label.appendChild(input);
      label.appendChild(make("span", null, person.name));
      personToggles.appendChild(label);
    });
  }

  function visiblePeople() {
    return PEOPLE.filter(function (person) {
      return state.visible[person.id];
    });
  }

  /* --- Rendering ------------------------------------------------------------ */

  function renderAll() {
    if (trackerSection.hidden) {
      return;
    }
    renderSeries();
    renderReadout();
    renderStability();
    renderChallengeStatus();
  }

  var SERIES_COLOURS = ["one", "two", "three", "four"];

  function renderSeries() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 620;
    var H = 260;
    var PAD_L = 34;
    var PAD_R = 10;
    var PAD_T = 10;
    var PAD_B = 26;

    clear(seriesChart);
    seriesChart.setAttribute("viewBox", "0 0 " + W + " " + H);

    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var x = function (i) {
      return PAD_L + (i / (TOTAL - 1)) * plotW;
    };
    var y = function (value) {
      return PAD_T + (1 - value / 100) * plotH;
    };

    // Gridlines and axis labels
    [0, 25, 50, 75, 100].forEach(function (value) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(PAD_L));
      line.setAttribute("y1", String(y(value)));
      line.setAttribute("x2", String(W - PAD_R));
      line.setAttribute("y2", String(y(value)));
      line.setAttribute("class", "chart__grid");
      seriesChart.appendChild(line);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(PAD_L - 6));
      label.setAttribute("y", String(y(value) + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__axis");
      label.textContent = String(value);
      seriesChart.appendChild(label);
    });

    // Day markers. The first and last are anchored to the plot edges rather
    // than centred on them, or their outer characters fall outside the
    // viewBox and are clipped.
    for (var day = 0; day <= DAYS; day += 7) {
      var index = Math.min(day * PER_DAY, TOTAL - 1);
      var marker = document.createElementNS(NS, "text");
      marker.setAttribute("x", String(x(index)));
      marker.setAttribute("y", String(H - 8));
      marker.setAttribute(
        "text-anchor", day === 0 ? "start" : day >= DAYS ? "end" : "middle");
      marker.setAttribute("class", "chart__axis");
      marker.textContent = "day " + (day === 0 ? 1 : day);
      seriesChart.appendChild(marker);
    }

    visiblePeople().forEach(function (person) {
      var order = PEOPLE.indexOf(person);
      var values = data.series[person.id];

      // The person's mean, as a horizontal reference line.
      var meanLine = document.createElementNS(NS, "line");
      meanLine.setAttribute("x1", String(PAD_L));
      meanLine.setAttribute("y1", String(y(data.truth[person.id].mean)));
      meanLine.setAttribute("x2", String(W - PAD_R));
      meanLine.setAttribute("y2", String(y(data.truth[person.id].mean)));
      meanLine.setAttribute("class", "series__mean series__mean--" + SERIES_COLOURS[order]);
      seriesChart.appendChild(meanLine);

      var d = values.map(function (value, i) {
        return (i === 0 ? "M " : "L ") + x(i).toFixed(1) + " " + y(value).toFixed(1);
      }).join(" ");

      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", "series__line series__line--" + SERIES_COLOURS[order]);
      seriesChart.appendChild(path);

      // Name printed at the right-hand end, so a line is identified without
      // reference to its colour.
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(W - PAD_R - 2));
      label.setAttribute("y", String(y(values[TOTAL - 1]) - 5));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = person.name;
      seriesChart.appendChild(label);
    });

    // The snapshot moment, marked.
    var snapLine = document.createElementNS(NS, "line");
    snapLine.setAttribute("x1", String(x(state.snapshotIndex)));
    snapLine.setAttribute("y1", String(PAD_T));
    snapLine.setAttribute("x2", String(x(state.snapshotIndex)));
    snapLine.setAttribute("y2", String(PAD_T + plotH));
    snapLine.setAttribute("class", "series__snapshot");
    seriesChart.appendChild(snapLine);

    renderSeriesTable();
  }

  function renderSeriesTable() {
    clear(seriesTable);
    visiblePeople().forEach(function (person) {
      var truth = data.truth[person.id];
      var values = data.series[person.id];
      var row = make("tr");
      var th = make("th", null, person.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, fmt(truth.mean)));
      row.appendChild(make("td", null, fmt(truth.sd)));
      row.appendChild(make("td", null, fmt(Math.min.apply(null, values), 0)));
      row.appendChild(make("td", null, fmt(Math.max.apply(null, values), 0)));
      row.appendChild(
        make("td", null, fmt(values[state.snapshotIndex], 0)));
      seriesTable.appendChild(row);
    });
  }

  function renderReadout() {
    clear(readout);
    var visible = visiblePeople();
    var truth = {};
    visible.forEach(function (person) {
      truth[person.id] = data.truth[person.id];
    });

    var between = visible.length > 1
      ? sd(visible.map(function (p) {
          return data.truth[p.id].mean;
        }))
      : 0;
    var within = mean(visible.map(function (p) {
      return data.truth[p.id].sd;
    }));
    var b2 = between * between;
    var w2 = within * within;
    var share = b2 + w2 === 0 ? 0 : b2 / (b2 + w2);

    [
      ["Between-person SD", fmt(between)],
      ["Mean within-person SD", fmt(within)],
      ["Share of variance between people", fmt(share, 2)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  /* --- Stability curve -----------------------------------------------------
     How close a running mean gets to the person's true mean as observations
     accumulate. This is the answer to "how many observations do I need?" and
     it depends on within-person SD, not on the trait level. */

  function renderStability() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 620;
    var H = 180;
    var PAD_L = 34;
    var PAD_R = 10;
    var PAD_T = 10;
    var PAD_B = 26;

    clear(stabilityChart);
    stabilityChart.setAttribute("viewBox", "0 0 " + W + " " + H);

    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var maxError = 25;
    var x = function (n) {
      return PAD_L + ((n - 1) / (TOTAL - 1)) * plotW;
    };
    var y = function (value) {
      return PAD_T + (1 - Math.min(value, maxError) / maxError) * plotH;
    };

    [0, 5, 10, 15, 20, 25].forEach(function (value) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(PAD_L));
      line.setAttribute("y1", String(y(value)));
      line.setAttribute("x2", String(W - PAD_R));
      line.setAttribute("y2", String(y(value)));
      line.setAttribute("class", "chart__grid");
      stabilityChart.appendChild(line);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(PAD_L - 6));
      label.setAttribute("y", String(y(value) + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__axis");
      label.textContent = String(value);
      stabilityChart.appendChild(label);
    });

    var axisLabel = document.createElementNS(NS, "text");
    axisLabel.setAttribute("x", String(PAD_L + plotW / 2));
    axisLabel.setAttribute("y", String(H - 6));
    axisLabel.setAttribute("text-anchor", "middle");
    axisLabel.setAttribute("class", "chart__axis");
    axisLabel.textContent = "observations averaged →";
    stabilityChart.appendChild(axisLabel);

    var summaries = [];

    visiblePeople().forEach(function (person) {
      var order = PEOPLE.indexOf(person);
      var values = data.series[person.id];
      var finalMean = data.truth[person.id].mean;
      var running = 0;
      var points = [];
      var reached = null;

      for (var n = 1; n <= TOTAL; n += 1) {
        running += values[n - 1];
        var error = Math.abs(running / n - finalMean);
        points.push([n, error]);
        if (reached === null && error <= 2) {
          // First point from which it stays within 2 points to the end.
          var staysClose = true;
          var check = running;
          for (var m = n + 1; m <= TOTAL; m += 1) {
            check += values[m - 1];
            if (Math.abs(check / m - finalMean) > 2) {
              staysClose = false;
              break;
            }
          }
          if (staysClose) {
            reached = n;
          }
        }
      }

      var d = points.map(function (point, i) {
        return (i === 0 ? "M " : "L ") + x(point[0]).toFixed(1) + " " +
          y(point[1]).toFixed(1);
      }).join(" ");

      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", d);
      path.setAttribute("class", "series__line series__line--" + SERIES_COLOURS[order]);
      stabilityChart.appendChild(path);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(x(points[TOTAL - 1][0]) - 2));
      label.setAttribute("y", String(y(points[TOTAL - 1][1]) - 6));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = person.name;
      stabilityChart.appendChild(label);

      summaries.push(
        person.name + " " +
        (reached === null ? "never settles within 2 points"
          : "settles after " + reached + " observation" + (reached === 1 ? "" : "s")));
    });

    stabilityNote.textContent = summaries.length
      ? "Distance of the running average from each person's own fortnight " +
        "mean. " + summaries.join("; ") + "."
      : "Select at least one person.";
  }

  /* --- Challenges ----------------------------------------------------------- */

  function renderChallengeStatus() {
    var adaMean = data.truth.ada.mean;
    var boMean = data.truth.bo.mean;
    var status = $("[data-challenge-a-status]");
    status.textContent =
      "Ada's mean is " + fmt(adaMean) + " and Bo's is " + fmt(boMean) +
      " — a difference of " + fmt(Math.abs(adaMean - boMean)) + " points. " +
      "Their within-person SDs are " + fmt(data.truth.ada.sd) + " and " +
      fmt(data.truth.bo.sd) + ".";
  }

  challengeAForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge-a"]:checked', challengeAForm);
    if (!answer) {
      showFeedback(challengeAFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "different";
    showFeedback(
      challengeAFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "Ada and Bo have almost the same mean (" + fmt(data.truth.ada.mean) +
        " and " + fmt(data.truth.bo.mean) + ") and quite different " +
        "within-person spreads (" + fmt(data.truth.ada.sd) + " and " +
        fmt(data.truth.bo.sd) + "). A questionnaire asking 'in general, how " +
        "do you feel?' would give them the same score and describe them as " +
        "the same person. They are not living the same fortnight. " +
        "Within-person variability is a stable, measurable characteristic in " +
        "its own right — people differ reliably in how much they fluctuate — " +
        "and a single trait score throws it away entirely."
    );
    shell.announce("Challenge 1 answered.", { immediate: true });
  });

  challengeBForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge-b"]:checked', challengeBForm);
    if (!answer) {
      showFeedback(challengeBFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "cannot";
    showFeedback(
      challengeBFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "From one observation you cannot separate them, and that is the point. " +
        "A momentary score is a person's typical level plus wherever they " +
        "happen to be today plus measurement error, and a single reading " +
        "gives you the sum of the three with no way to divide it. Turn the " +
        "measurement-error slider up and down and watch the series get " +
        "noisier while every person's mean stays where it was: error and real " +
        "fluctuation look identical in one observation and come apart across " +
        "many. That is the whole argument for repeated measurement, and it is " +
        "why 'how are you today?' and 'what are you like?' are different " +
        "questions."
    );
    shell.announce("Challenge 2 answered.", { immediate: true });
  });

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
      form.querySelectorAll("input, button, select"),
      function (control) {
        if (control.getAttribute("data-action") !== "reset-early") {
          control.disabled = true;
        }
      }
    );
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button, select"),
      function (control) {
        control.disabled = false;
      }
    );
    form.reset();
  }

  var earlyReset = $('[data-action="reset-early"]');
  if (earlyReset) {
    earlyReset.addEventListener("click", function () {
      shell.reset();
    });
  }

  /* --- Reset ---------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));

    unlockForm(snapshotForm);
    snapshotFeedback.hidden = true;
    snapshotError.hidden = true;
    trackerSection.hidden = true;

    challengeAForm.reset();
    challengeAFeedback.hidden = true;
    challengeBForm.reset();
    challengeBFeedback.hidden = true;

    seedInput.value = String(state.seed);
    eventsToggle.checked = state.eventsOn;
    $("#wobble-range").value = String(Math.round(state.wobbleScale * 100));
    $("#error-range").value = String(state.errorSd);

    regenerate();
    buildPersonToggles();
    renderSnapshot();
    syncRanges();
  });

  /* --- Start-up -------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Rank the four people by their typical level, from one moment.",
    { immediate: true }
  );
})();
