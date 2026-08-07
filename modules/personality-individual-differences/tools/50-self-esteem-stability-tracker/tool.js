/* =========================================================================
   Self-Esteem Stability Tracker
   -------------------------------------------------------------------------
   Four fictional people with the same average self-esteem and four different
   ways of getting there. Students predict from an average, discover it tells
   them almost nothing, then deliver events and watch level, volatility,
   contingency and recovery come apart.

   THE EDUCATIONAL MODEL
   ---------------------
   Self-esteem is tracked daily over six weeks as

       state(t) = baseline + carry(t) + wobble(t)

   where `carry` is the accumulated effect of events, decaying towards zero at
   a person-specific rate, and `wobble` is day-to-day fluctuation with a
   person-specific size.

   Four parameters distinguish the four fictional people, and they are
   deliberately independent of each other:

     baseline      the level everything returns to. All four share it.
     volatility    the size of ordinary day-to-day movement, with no event
                   required. A person characteristic, not noise.
     contingency   how strongly events in a given domain move the state at
                   all. A person whose self-esteem is highly contingent on
                   one domain reacts sharply to events in it and barely at
                   all to events elsewhere.
     recovery      how fast the effect of an event decays. Slow recovery
                   means a single event colours a fortnight.

   The point is that these four things are separable and a mean hides all of
   them. Two people with identical averages can differ completely on every one.

   DOMAINS
   -------
   Events belong to one of three neutral domains — work, friendship,
   appearance-and-fitness — and each fictional person has a contingency
   profile across them. This is how domain contingency is made visible: the
   same event produces a large reaction in one person and almost none in
   another, because of what their self-esteem is staked on.

   WHAT THIS IS NOT
   ----------------
   This tool asks the user nothing about themselves, offers no questionnaire,
   produces no score for anybody, and makes no clinical statement of any kind.
   The four people are invented, the scale is arbitrary, and low or unstable
   values are presented as characteristics that differ between people rather
   than as symptoms. The page says so, and nothing in the interface invites a
   user to locate themselves among the four.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var DAYS = 42;
  var BASELINE = 58;

  /* Four fictional people. All share a baseline; everything else differs. */
  var PEOPLE = [
    {
      id: "ari",
      name: "Ari",
      volatility: 2.5,
      recovery: 0.72,
      contingency: { work: 0.35, friendship: 0.35, appearance: 0.3 },
      sketch:
        "Moves very little from day to day, and events of any kind produce a modest, short-lived dip or lift."
    },
    {
      id: "bea",
      name: "Bea",
      volatility: 9,
      recovery: 0.7,
      contingency: { work: 0.5, friendship: 0.5, appearance: 0.45 },
      sketch:
        "Same typical level as Ari, and a completely different week. Large ordinary fluctuation with no event needed."
    },
    {
      id: "cal",
      name: "Cal",
      volatility: 3.5,
      recovery: 0.68,
      contingency: { work: 1.5, friendship: 0.2, appearance: 0.15 },
      sketch:
        "Steady most of the time, and strongly affected by anything to do with work. Barely moved by the rest."
    },
    {
      id: "dee",
      name: "Dee",
      volatility: 3.5,
      recovery: 0.94,
      contingency: { work: 0.6, friendship: 0.6, appearance: 0.55 },
      sketch:
        "Reacts moderately, and takes a long time to come back. One event can colour a fortnight."
    }
  ];

  var DOMAINS = [
    { id: "work", name: "Work or study" },
    { id: "friendship", name: "Friendship" },
    { id: "appearance", name: "Appearance and fitness" }
  ];

  var EVENT_TYPES = [
    { id: "praise", name: "Praise", size: 12 },
    { id: "criticism", name: "Criticism", size: -13 },
    { id: "success", name: "Success", size: 16 },
    { id: "rejection", name: "Rejection", size: -17 },
    { id: "neutral", name: "A neutral week", size: 0 }
  ];

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

  /* =======================================================================
     Generation
     ===================================================================== */

  /**
   * @param {object} person
   * @param {Array} events  [{day, typeId, domainId}]
   * @param {number} seed
   * @returns {number[]} daily states
   */
  function series(person, events, seed) {
    var random = mulberry32(seed + person.id.length * 31);
    var values = [];
    var carry = 0;

    for (var day = 0; day < DAYS; day += 1) {
      events.forEach(function (event) {
        if (event.day !== day) { return; }
        var type = byId(EVENT_TYPES, event.typeId);
        carry += type.size * person.contingency[event.domainId];
      });
      values.push(clamp(BASELINE + carry + normal(random) * person.volatility, 0, 100));
      carry *= person.recovery;
    }
    return values;
  }

  function mean(v) { return v.reduce(function (a, b) { return a + b; }, 0) / v.length; }

  function sd(v) {
    var m = mean(v);
    return Math.sqrt(v.reduce(function (t, x) { return t + (x - m) * (x - m); }, 0) / v.length);
  }

  /**
   * Days to return within 3 points of baseline after the last event.
   * Reported as the recovery measure, separately from level and volatility.
   */
  function recoveryDays(values, events) {
    if (!events.length) { return null; }
    var last = Math.max.apply(null, events.map(function (e) { return e.day; }));
    for (var day = last; day < DAYS; day += 1) {
      if (Math.abs(values[day] - BASELINE) <= 3) { return day - last; }
    }
    return null;
  }

  function byId(list, id) {
    return list.filter(function (e) { return e.id === id; })[0];
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(v, p) {
    return v === null || v === undefined || isNaN(v) ? "—" : v.toFixed(p === undefined ? 1 : p);
  }

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

  var shell = InteractiveShell.attach("#tracker");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var chart = $("[data-chart]");
  var statsTable = $("[data-stats-table]");
  var eventList = $("[data-event-list]");
  var typeSelect = $("#type-select");
  var domainSelect = $("#domain-select");
  var daySelect = $("#day-select");
  var contingencyTable = $("[data-contingency-table]");
  var summary = $("[data-summary]");
  var peopleToggles = $("[data-people-toggles]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#tracker-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var INITIAL = {
    events: [],
    seed: 5150,
    visible: {},
    stage: "predict"
  };
  PEOPLE.forEach(function (p) { INITIAL.visible[p.id] = true; });

  var state = null;

  /* --- Controls -------------------------------------------------------------- */

  EVENT_TYPES.forEach(function (type) {
    var o = make("option", null, type.name);
    o.value = type.id;
    typeSelect.appendChild(o);
  });
  DOMAINS.forEach(function (domain) {
    var o = make("option", null, domain.name);
    o.value = domain.id;
    domainSelect.appendChild(o);
  });
  for (var d = 3; d < DAYS - 6; d += 1) {
    var o = make("option", null, "Day " + (d + 1));
    o.value = String(d);
    daySelect.appendChild(o);
  }
  daySelect.value = "10";

  $('[data-action="add-event"]').addEventListener("click", function () {
    if (typeSelect.value === "neutral") {
      shell.announce(
        "A neutral week adds no event. Use it to see what each person does " +
          "with nothing happening.",
        { immediate: true });
      return;
    }
    state.events.push({
      day: Number(daySelect.value),
      typeId: typeSelect.value,
      domainId: domainSelect.value
    });
    state.events.sort(function (a, b) { return a.day - b.day; });
    render();
    shell.announce(
      byId(EVENT_TYPES, typeSelect.value).name + " in " +
        byId(DOMAINS, domainSelect.value).name.toLowerCase() +
        " added on day " + (Number(daySelect.value) + 1) + ".",
      { immediate: true });
  });

  $('[data-action="clear-events"]').addEventListener("click", function () {
    state.events = [];
    render();
    shell.announce("All events cleared.", { immediate: true });
  });

  function buildPeopleToggles() {
    clear(peopleToggles);
    PEOPLE.forEach(function (person) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.visible[person.id];
      input.addEventListener("change", function () {
        state.visible[person.id] = input.checked;
        render();
      });
      label.appendChild(input);
      label.appendChild(make("span", null, person.name));
      peopleToggles.appendChild(label);
    });
  }

  function visiblePeople() {
    return PEOPLE.filter(function (p) { return state.visible[p.id]; });
  }

  /* --- Rendering -------------------------------------------------------------- */

  function render() {
    if (mainSection.hidden) { return; }
    renderChart();
    renderStats();
    renderEvents();
    renderContingency();
    renderSummary();
  }

  var COLOURS = ["one", "two", "three", "four"];

  function renderChart() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 620, H = 260, PAD_L = 34, PAD_R = 12, PAD_T = 12, PAD_B = 30;
    clear(chart);
    chart.setAttribute("viewBox", "0 0 " + W + " " + H);

    var plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;
    var xAt = function (i) { return PAD_L + (i / (DAYS - 1)) * plotW; };
    var yAt = function (v) { return PAD_T + (1 - v / 100) * plotH; };

    [0, 25, 50, 75, 100].forEach(function (v) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(PAD_L)); line.setAttribute("y1", String(yAt(v)));
      line.setAttribute("x2", String(W - PAD_R)); line.setAttribute("y2", String(yAt(v)));
      line.setAttribute("class", "chart__grid");
      chart.appendChild(line);
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(PAD_L - 6)); label.setAttribute("y", String(yAt(v) + 4));
      label.setAttribute("text-anchor", "end"); label.setAttribute("class", "chart__axis");
      label.textContent = String(v);
      chart.appendChild(label);
    });

    // Shared baseline
    var base = document.createElementNS(NS, "line");
    base.setAttribute("x1", String(PAD_L)); base.setAttribute("y1", String(yAt(BASELINE)));
    base.setAttribute("x2", String(W - PAD_R)); base.setAttribute("y2", String(yAt(BASELINE)));
    base.setAttribute("class", "tracker__baseline");
    chart.appendChild(base);

    // Event markers
    state.events.forEach(function (event) {
      var line = document.createElementNS(NS, "line");
      line.setAttribute("x1", String(xAt(event.day))); line.setAttribute("y1", String(PAD_T));
      line.setAttribute("x2", String(xAt(event.day))); line.setAttribute("y2", String(PAD_T + plotH));
      line.setAttribute("class", "tracker__event");
      chart.appendChild(line);
    });

    visiblePeople().forEach(function (person) {
      var order = PEOPLE.indexOf(person);
      var values = series(person, state.events, state.seed);
      var path = document.createElementNS(NS, "path");
      path.setAttribute("d", values.map(function (v, i) {
        return (i === 0 ? "M " : "L ") + xAt(i).toFixed(1) + " " + yAt(v).toFixed(1);
      }).join(" "));
      path.setAttribute("class", "series__line series__line--" + COLOURS[order]);
      chart.appendChild(path);

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(W - PAD_R - 2));
      label.setAttribute("y", String(yAt(values[DAYS - 1]) - 5));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = person.name;
      chart.appendChild(label);
    });

    var axis = document.createElementNS(NS, "text");
    axis.setAttribute("x", String(PAD_L + plotW / 2)); axis.setAttribute("y", String(H - 6));
    axis.setAttribute("text-anchor", "middle"); axis.setAttribute("class", "chart__axis");
    axis.textContent = "six weeks, one observation a day →";
    chart.appendChild(axis);
  }

  /**
   * The largest single departure from baseline, signed. This is where
   * contingency shows up: a single event moves the mean over six weeks by
   * barely a point, because its effect decays, but it can move one day by
   * fifteen. Without this column, reactivity is visible only in the chart —
   * which is hidden from assistive technology, so it would not be perceivable
   * at all.
   */
  function biggestMove(values) {
    var extreme = 0;
    values.forEach(function (v) {
      if (Math.abs(v - BASELINE) > Math.abs(extreme)) {
        extreme = v - BASELINE;
      }
    });
    return extreme;
  }

  function renderStats() {
    clear(statsTable);
    visiblePeople().forEach(function (person) {
      var values = series(person, state.events, state.seed);
      var rec = recoveryDays(values, state.events);
      var move = biggestMove(values);
      var row = make("tr");
      var th = make("th", null, person.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, fmt(mean(values))));
      row.appendChild(make("td", null, fmt(sd(values))));
      row.appendChild(
        make("td", null, (move > 0 ? "+" : "") + fmt(move) + " points"));
      row.appendChild(make("td", null, fmt(Math.min.apply(null, values), 0) + "–" +
        fmt(Math.max.apply(null, values), 0)));
      row.appendChild(make("td", null,
        rec === null
          ? (state.events.length ? "not yet" : "no events")
          : rec + " days"));
      statsTable.appendChild(row);
    });
  }

  function renderEvents() {
    clear(eventList);
    if (!state.events.length) {
      eventList.appendChild(
        make("p", "verdict__body",
          "No events yet. With nothing happening, the differences you can see " +
          "are level and volatility only — contingency and recovery need " +
          "something to react to."));
      return;
    }
    var list = make("ul", "event-log");
    state.events.forEach(function (event) {
      var type = byId(EVENT_TYPES, event.typeId);
      var domain = byId(DOMAINS, event.domainId);
      list.appendChild(
        make("li", null,
          "Day " + (event.day + 1) + " — " + type.name + " in " +
          domain.name.toLowerCase()));
    });
    eventList.appendChild(list);
  }

  function renderContingency() {
    clear(contingencyTable);
    PEOPLE.forEach(function (person) {
      var row = make("tr");
      var th = make("th", null, person.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      DOMAINS.forEach(function (domain) {
        row.appendChild(make("td", null, fmt(person.contingency[domain.id], 2)));
      });
      row.appendChild(make("td", null, fmt(person.volatility, 1)));
      row.appendChild(make("td", null, fmt(person.recovery, 2)));
      contingencyTable.appendChild(row);
    });
  }

  function renderSummary() {
    var visible = visiblePeople();
    if (visible.length < 2) {
      summary.textContent = "Select at least two people to compare.";
      summary.setAttribute("data-tone", "neutral");
      return;
    }
    var means = visible.map(function (p) { return mean(series(p, state.events, state.seed)); });
    var sds = visible.map(function (p) { return sd(series(p, state.events, state.seed)); });
    var meanGap = Math.max.apply(null, means) - Math.min.apply(null, means);
    var sdGap = Math.max.apply(null, sds) - Math.min.apply(null, sds);

    summary.textContent =
      "Across the people shown, the averages differ by " + fmt(meanGap) +
      " points and the day-to-day variability differs by " + fmt(sdGap) +
      " points. " +
      (sdGap > meanGap * 1.5
        ? "The averages are nearly the same and the experience of the six " +
          "weeks is not. A single self-esteem score would report these people " +
          "as alike."
        : state.events.length
        ? "Events have pulled the averages apart. Note that this is a fact " +
          "about what happened to them during these six weeks, not about " +
          "their typical level — they all return to the same baseline."
        : "Add some events to separate contingency and recovery from level " +
          "and volatility.");
    summary.setAttribute("data-tone", sdGap > meanGap * 1.5 ? "good" : "neutral");
  }

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    same: {
      tone: "caution",
      verdict: "Not quite.",
      text:
        "An average is one number and these four differ on at least three " +
        "others: how much they move from day to day with nothing happening, " +
        "what kinds of event move them at all, and how long it takes them to " +
        "come back. Two of the four have almost identical averages and " +
        "entirely different six weeks."
    },
    varies: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The average is the least informative thing about a series like this. " +
        "Level, volatility, domain contingency and recovery speed are four " +
        "separable characteristics, and a mean collapses all four into one " +
        "number."
    },
    unstable: {
      tone: "caution",
      verdict: "Careful.",
      text:
        "Variability is a characteristic, not a verdict. People differ " +
        "reliably in how much their self-evaluation moves day to day, and " +
        "that difference is measurable and reasonably stable — which makes it " +
        "an individual difference rather than a problem. This tool describes " +
        "differences; it does not evaluate them."
    },
    cannot: {
      tone: "good",
      verdict: "Also right.",
      text:
        "From an average alone you genuinely cannot tell. That is the position " +
        "the rest of this page is designed to make concrete."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before the series appear.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    render();
    $("#tracker-heading").focus();
    shell.announce("Tracker unlocked.", { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    render();
    shell.announce("Tracker unlocked.", { immediate: true });
  });

  /* --- Challenge ---------------------------------------------------------------- */

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "cal";
    showFeedback(
      challengeFeedback,
      correct ? "good" : "caution",
      correct ? "Yes — Cal." : "Not quite — it is Cal.",
      "Cal's self-esteem is strongly contingent on one domain and barely " +
        "responsive to the others. Deliver a criticism in work or study and " +
        "Cal drops further than anyone; deliver the same criticism in " +
        "friendship and Cal hardly moves. Bea, by contrast, moves a great " +
        "deal all the time without any event at all — that is volatility, not " +
        "contingency, and the two are separate. Dee reacts moderately to " +
        "everything and takes far longer to return, which is recovery, a third " +
        "separate thing. Try it: add the same criticism in each domain and " +
        "compare who moves."
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
    typeSelect.value = "criticism";
    domainSelect.value = "work";
    daySelect.value = "10";
    buildPeopleToggles();
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to see the four series.",
    { immediate: true });
})();
