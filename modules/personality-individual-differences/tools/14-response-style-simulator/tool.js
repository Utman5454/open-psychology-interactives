/* =========================================================================
   Response-Style Simulator
   -------------------------------------------------------------------------
   Seven fictional respondents answer the same twenty-item questionnaire in
   seven different ways. Students see the raw grids, the distributions, the
   totals and the correlations, then try to name a style from its evidence —
   and are told, every time, what that evidence cannot establish.

   THE EDUCATIONAL MODEL
   ---------------------
   Each respondent has a true standing on the trait. Their answer to item i on
   a 1-5 scale is generated as

       raw   = 3 + trueStanding · keying(i) · discrimination + noise
       shown = style(raw)

   where `keying(i)` is +1 for a positively keyed item and -1 for a reverse
   keyed item, and `style` is one of seven transformations:

     attentive       shown = raw                       (the comparison case)
     acquiescent     pulled towards agreement regardless of keying
     extreme         pushed away from the midpoint towards 1 or 5
     midpoint        pulled towards 3
     impression      pulled towards the socially desirable end of each item
     random          independent of the trait entirely
     straight-lining one value repeated with occasional drift

   SCORING AND WHY KEYING MATTERS
   ------------------------------
   Reverse-keyed items are recoded before summing. That recoding is what makes
   acquiescence visible: an acquiescent respondent agrees with an item and
   with its opposite, so on a BALANCED scale the two cancel and the total lands
   near the middle whatever the person actually thinks. On an UNBALANCED scale
   (all items keyed the same way) nothing cancels, and acquiescence is
   indistinguishable from a high score. The balance control demonstrates this
   directly, and it is the most practically useful thing here.

   WHAT NO PATTERN CAN ESTABLISH
   -----------------------------
   Every diagnosis in this tool returns the same caution, because it is true:
   a response pattern is evidence about a pattern, not about a motive. The
   same grid can be produced by carelessness, by a genuine trait, by a
   culturally normal response style, by a person using a screen reader on a
   badly built form, by fatigue, or by someone answering honestly about a
   life in which the items genuinely do not apply. The tool never asserts a
   motive and marks any answer that does as overreaching.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var ITEMS = 20;
  var SCALE_MIN = 1;
  var SCALE_MAX = 5;
  var MID = 3;

  /* How strongly an item discriminates on the trait. Raised from a smaller
     value so that a moderate true standing survives rounding to whole scale
     points — otherwise every respondent answers 3 and the styles cannot be
     told apart. */
  var DISCRIMINATION = 1.2;

  /* Size of the acquiescent shift, in scale points. One point leaves headroom
     at a moderate true standing, so the effect is not swallowed by the
     ceiling at 5. */
  var ACQUIESCENCE_BIAS = 1.0;

  var STYLES = [
    {
      id: "attentive",
      name: "Attentive responding",
      short: "Attentive",
      note:
        "Answers track the trait, use the whole scale, and respond to keying. " +
        "This is the comparison case, not the moral standard."
    },
    {
      id: "acquiescent",
      name: "Acquiescence",
      short: "Acquiescent",
      note:
        "Agreement regardless of what the item says. Common, culturally " +
        "patterned, and largely invisible on an unbalanced scale."
    },
    {
      id: "extreme",
      name: "Extreme responding",
      short: "Extreme",
      note:
        "Only the endpoints get used. Varies systematically between cultures " +
        "and with education, and is not in itself an error."
    },
    {
      id: "midpoint",
      name: "Midpoint responding",
      short: "Midpoint",
      note:
        "Everything near the middle. May be caution, may be ambivalence, may " +
        "be that the items genuinely do not apply."
    },
    {
      id: "impression",
      name: "Impression management",
      short: "Impression",
      note:
        "Answers shifted towards whichever end looks better. Rises when the " +
        "questionnaire has consequences — which is a fact about the setting."
    },
    {
      id: "random",
      name: "Random responding",
      short: "Random",
      note:
        "No relationship to the trait at all. The hardest to detect and the " +
        "most damaging to a dataset."
    },
    {
      id: "straight",
      name: "Straight-lining",
      short: "Straight-line",
      note:
        "The same option repeated down the page. Also what a perfectly " +
        "consistent respondent to a short unbalanced scale looks like."
    }
  ];

  /* Social desirability direction for each item, used only by the impression
     management style. +1 means agreeing looks better. */
  function desirability(index) {
    return index % 3 === 0 ? -1 : 1;
  }

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
     Generation
     ===================================================================== */

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function round(value) {
    return clamp(Math.round(value), SCALE_MIN, SCALE_MAX);
  }

  /** Keying: +1 positive, -1 reverse. Balanced alternates; unbalanced is all +1. */
  function keying(index, balanced) {
    if (!balanced) { return 1; }
    return index % 2 === 0 ? 1 : -1;
  }

  function applyStyle(styleId, raw, index, random, trueStanding) {
    switch (styleId) {
      case "attentive":
        return raw;
      case "acquiescent":
        /* An ADDITIVE shift towards agreement, independent of what the item
           says. This matters: recoding a reverse item turns (raw + bias) into
           (6 - raw) - bias, so on a balanced scale the +bias on positive items
           and the -bias on reverse items cancel exactly in the total. A
           multiplicative pull towards agreement does not cancel, and would
           make balanced keying look useless — which is the opposite of the
           point this tool exists to make. */
        return raw + ACQUIESCENCE_BIAS;
      case "extreme":
        // Pushed away from the midpoint.
        return MID + (raw - MID) * 2.4;
      case "midpoint":
        return MID + (raw - MID) * 0.45;
      case "impression":
        return raw * 0.55 + (MID + desirability(index) * 1.8) * 0.45;
      case "random":
        return SCALE_MIN + random() * (SCALE_MAX - SCALE_MIN);
      case "straight":
        // One value, with occasional drift so it is not a perfect giveaway.
        return random() < 0.12 ? 4 + (random() < 0.5 ? -1 : 0) : 4;
      default:
        return raw;
    }
  }

  /**
   * Generate one respondent's answers.
   * @returns {number[]} answers as shown, 1-5
   */
  function generateAnswers(styleId, trueStanding, balanced, seed) {
    var random = mulberry32(seed);
    var answers = [];
    for (var i = 0; i < ITEMS; i += 1) {
      var raw = MID + trueStanding * keying(i, balanced) * DISCRIMINATION +
        normal(random) * 0.45;
      answers.push(round(applyStyle(styleId, raw, i, random, trueStanding)));
    }
    return answers;
  }

  /** Recode reverse-keyed items, then sum. */
  function scaleScore(answers, balanced) {
    return answers.reduce(function (total, value, index) {
      var recoded = keying(index, balanced) === 1
        ? value
        : SCALE_MIN + SCALE_MAX - value;
      return total + recoded;
    }, 0);
  }

  function distribution(answers) {
    var counts = [0, 0, 0, 0, 0];
    answers.forEach(function (value) { counts[value - 1] += 1; });
    return counts;
  }

  function mean(values) {
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function sd(values) {
    var m = mean(values);
    return Math.sqrt(values.reduce(function (t, v) {
      return t + (v - m) * (v - m);
    }, 0) / values.length);
  }

  /** Correlation between the two halves of the recoded scale. */
  function splitHalf(answers, balanced) {
    var odd = [];
    var even = [];
    answers.forEach(function (value, index) {
      var recoded = keying(index, balanced) === 1
        ? value : SCALE_MIN + SCALE_MAX - value;
      (index % 2 === 0 ? odd : even).push(recoded);
    });
    return correlation(odd, even);
  }

  function correlation(x, y) {
    var n = Math.min(x.length, y.length);
    var mx = mean(x.slice(0, n));
    var my = mean(y.slice(0, n));
    var sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < n; i += 1) {
      var dx = x[i] - mx, dy = y[i] - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    }
    return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0;
  }

  /** Longest run of identical consecutive answers. */
  function longestRun(answers) {
    var best = 1, run = 1;
    for (var i = 1; i < answers.length; i += 1) {
      run = answers[i] === answers[i - 1] ? run + 1 : 1;
      if (run > best) { best = run; }
    }
    return best;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(v, p) {
    return v === null || v === undefined || isNaN(v) ? "—" : v.toFixed(p === undefined ? 2 : p);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  function byId(list, id) {
    return list.filter(function (e) { return e.id === id; })[0];
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#styles");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var gridWrap = $("[data-grids]");
  var statsTable = $("[data-stats-table]");
  var distChart = $("[data-dist-chart]");
  var distTable = $("[data-dist-table]");
  var balanceNote = $("[data-balance-note]");
  var balancedToggle = $("#balanced-toggle");
  var standingRange = $("#standing-range");
  var seedInput = $("#seed-input");
  var styleToggles = $("[data-style-toggles]");

  var challengeSection = $("#challenge");
  var mysteryGrid = $("[data-mystery-grid]");
  var mysteryStats = $("[data-mystery-stats]");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");
  var newMysteryButton = $('[data-action="new-mystery"]');

  var INITIAL = {
    balanced: true,
    /* A moderate standing, not a high one. If the respondent already agrees
       with everything on the merits, an acquiescent shift adds nothing and the
       keying demonstration has no contrast to show. */
    standing: 0.5,
    seed: 3310,
    visible: {},
    mysteryStyle: null,
    mysterySeed: 991
  };
  STYLES.forEach(function (s) { INITIAL.visible[s.id] = true; });

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

  bindRange(standingRange, {
    format: function (v) { return (v / 100).toFixed(2); },
    describe: function (v) {
      var s = v / 100;
      return "true standing on the trait " + s.toFixed(2) +
        (s > 0.5 ? ", well above average" : s < -0.5 ? ", well below average" : ", near average");
    },
    onInput: function (v) { state.standing = v / 100; render(); }
  });

  balancedToggle.addEventListener("change", function () {
    state.balanced = balancedToggle.checked;
    render();
    shell.announce(
      state.balanced
        ? "Balanced keying: half the items are reverse worded."
        : "Unbalanced keying: every item is worded the same way.",
      { immediate: true });
  });

  seedInput.addEventListener("change", function () {
    var v = parseInt(seedInput.value, 10);
    if (isNaN(v)) { seedInput.value = String(state.seed); return; }
    state.seed = v;
    render();
  });

  function buildStyleToggles() {
    clear(styleToggles);
    STYLES.forEach(function (style) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.visible[style.id];
      input.addEventListener("change", function () {
        state.visible[style.id] = input.checked;
        render();
      });
      label.appendChild(input);
      label.appendChild(make("span", null, style.short));
      styleToggles.appendChild(label);
    });
  }

  function visibleStyles() {
    return STYLES.filter(function (s) { return state.visible[s.id]; });
  }

  /* --- Rendering ------------------------------------------------------------ */

  function render() {
    renderGrids();
    renderStats();
    renderDistributions();
    renderBalanceNote();
  }

  function answersFor(style) {
    return generateAnswers(style.id, state.standing, state.balanced, state.seed + style.id.length * 17);
  }

  function renderGrids() {
    clear(gridWrap);
    visibleStyles().forEach(function (style) {
      var answers = answersFor(style);
      var card = make("div", "grid-card");
      card.appendChild(make("h3", "grid-card__name", style.name));
      card.appendChild(make("p", "grid-card__note", style.note));

      var row = make("ol", "grid-row");
      answers.forEach(function (value, index) {
        var cell = make("li", "grid-cell");
        cell.setAttribute("data-value", String(value));
        cell.setAttribute(
          "data-keyed", keying(index, state.balanced) === 1 ? "positive" : "reverse");
        cell.textContent = String(value);
        row.appendChild(cell);
      });
      card.appendChild(row);
      gridWrap.appendChild(card);
    });

    if (!visibleStyles().length) {
      gridWrap.appendChild(
        make("p", "verdict__body", "Select at least one response style."));
    }
  }

  function renderStats() {
    clear(statsTable);
    visibleStyles().forEach(function (style) {
      var answers = answersFor(style);
      var row = make("tr");
      var th = make("th", null, style.short);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, String(scaleScore(answers, state.balanced))));
      row.appendChild(make("td", null, fmt(mean(answers), 2)));
      row.appendChild(make("td", null, fmt(sd(answers), 2)));
      row.appendChild(make("td", null, fmt(splitHalf(answers, state.balanced))));
      row.appendChild(make("td", null, String(longestRun(answers))));
      statsTable.appendChild(row);
    });
  }

  function renderDistributions() {
    var NS = "http://www.w3.org/2000/svg";
    var styles = visibleStyles();
    var ROW = 40;
    var LEFT = 108;
    var CELL = 56;

    clear(distChart);
    distChart.setAttribute("viewBox", "0 0 460 " + (styles.length * ROW + 30));

    // Column headers 1..5
    for (var v = 1; v <= 5; v += 1) {
      var head = document.createElementNS(NS, "text");
      head.setAttribute("x", String(LEFT + (v - 1) * CELL + CELL / 2));
      head.setAttribute("y", "14");
      head.setAttribute("text-anchor", "middle");
      head.setAttribute("class", "chart__axis");
      head.textContent = String(v);
      distChart.appendChild(head);
    }

    styles.forEach(function (style, index) {
      var counts = distribution(answersFor(style));
      var y = 22 + index * ROW;

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + 18));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = style.short;
      distChart.appendChild(label);

      counts.forEach(function (count, i) {
        var height = (count / ITEMS) * 26;
        var rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", String(LEFT + i * CELL + 6));
        rect.setAttribute("y", String(y + 26 - height));
        rect.setAttribute("width", String(CELL - 12));
        rect.setAttribute("height", String(Math.max(height, 1)));
        rect.setAttribute("class", "chart__bar");
        distChart.appendChild(rect);

        var text = document.createElementNS(NS, "text");
        text.setAttribute("x", String(LEFT + i * CELL + CELL / 2));
        text.setAttribute("y", String(y + 38));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("class", "chart__count");
        text.textContent = String(count);
        distChart.appendChild(text);
      });
    });

    /* Same counts as the chart, in a table, so the shape of each style's
       answering is readable without seeing the bars. */
    clear(distTable);
    styles.forEach(function (style) {
      var row = make("tr");
      var th = make("th", null, style.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      distribution(answersFor(style)).forEach(function (count) {
        row.appendChild(make("td", null, String(count)));
      });
      distTable.appendChild(row);
    });
  }

  function renderBalanceNote() {
    var acq = byId(STYLES, "acquiescent");
    var att = byId(STYLES, "attentive");
    var acqScore = scaleScore(answersFor(acq), state.balanced);
    var attScore = scaleScore(answersFor(att), state.balanced);
    var gap = Math.abs(acqScore - attScore);

    balanceNote.textContent = state.balanced
      ? "With balanced keying, the acquiescent respondent scores " + acqScore +
        " and the attentive one " + attScore + " — a gap of " + gap +
        " points. Agreeing with an item and with its opposite largely cancels " +
        "in the recoded total, so acquiescence mostly washes out of the score " +
        "while remaining plainly visible in the raw grid. It does not cancel " +
        "completely: the scale stops at 5, so the shift towards agreement is " +
        "truncated at the top and cannot be fully undone by recoding. Real " +
        "balanced scales have the same residual, for the same reason. Now " +
        "switch balanced keying off."
      : "With every item worded the same way, the acquiescent respondent " +
        "scores " + acqScore + " and the attentive one " + attScore +
        " — a gap of " + gap + " points. Nothing cancels, so agreeing with " +
        "everything is indistinguishable from a high standing on the trait. " +
        "This is the strongest practical argument for balanced keying, and it " +
        "is why unbalanced scales are hard to defend.";
    balanceNote.setAttribute("data-tone", state.balanced ? "good" : "warn");
  }

  /* --- Challenge: identify the style ------------------------------------------ */

  function newMystery() {
    // Chosen from the seed so a class can reproduce it.
    var random = mulberry32(state.mysterySeed);
    var pool = STYLES.filter(function (s) { return s.id !== "attentive"; });
    state.mysteryStyle = pool[Math.floor(random() * pool.length)].id;
    renderMystery();
    challengeForm.reset();
    challengeFeedback.hidden = true;
  }

  function renderMystery() {
    var style = byId(STYLES, state.mysteryStyle);
    var answers = generateAnswers(
      style.id, state.standing, state.balanced, state.mysterySeed + 7);

    clear(mysteryGrid);
    var row = make("ol", "grid-row");
    answers.forEach(function (value, index) {
      var cell = make("li", "grid-cell");
      cell.setAttribute("data-value", String(value));
      cell.setAttribute(
        "data-keyed", keying(index, state.balanced) === 1 ? "positive" : "reverse");
      cell.textContent = String(value);
      row.appendChild(cell);
    });
    mysteryGrid.appendChild(row);

    clear(mysteryStats);
    [
      ["Recoded total", String(scaleScore(answers, state.balanced))],
      ["Mean answer", fmt(mean(answers), 2)],
      ["Spread of answers", fmt(sd(answers), 2)],
      ["Split-half correlation", fmt(splitHalf(answers, state.balanced))],
      ["Longest identical run", String(longestRun(answers))]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      mysteryStats.appendChild(cell);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="style-guess"]:checked', challengeForm);
    var motive = $('input[name="motive"]:checked', challengeForm);
    if (!answer || !motive) {
      showFeedback(challengeFeedback, "caution",
        "Answer both parts.",
        "The second question is the one that matters.");
      return;
    }

    var actual = byId(STYLES, state.mysteryStyle);
    var right = answer.value === state.mysteryStyle;
    var overreached = motive.value !== "cannot";

    clear(challengeFeedback);
    challengeFeedback.hidden = false;
    challengeFeedback.setAttribute(
      "data-tone", right && !overreached ? "good" : overreached ? "warn" : "caution");

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      (right ? "Correct — it was " : "Not quite — it was actually ") + actual.name + "."));
    challengeFeedback.appendChild(lead);

    challengeFeedback.appendChild(make("p", null, actual.note));

    challengeFeedback.appendChild(
      make("p", null,
        overreached
          ? "On the second question you went further than the evidence allows. " +
            "A response pattern is evidence about a pattern. It cannot tell you " +
            "why: the same grid is produced by carelessness, by a genuine trait, " +
            "by a culturally normal way of using rating scales, by someone " +
            "fatigued or in pain, by a person navigating a badly built form with " +
            "a screen reader, and by someone answering honestly about a life in " +
            "which these items do not apply. Flagging a pattern is legitimate; " +
            "attributing a motive to it is not."
          : "And you were right to refuse the second question. The pattern is " +
            "detectable; the reason for it is not. Screening on response " +
            "patterns is defensible as a data-quality decision, stated as such. " +
            "It becomes indefensible the moment it is reported as a judgement " +
            "about the people whose data were removed."));

    shell.announce(
      "Answered. It was " + actual.name + ".", { immediate: true });
  });

  newMysteryButton.addEventListener("click", function () {
    state.mysterySeed = (state.mysterySeed * 1103515245 + 12345) % 2147483647;
    if (state.mysterySeed < 0) { state.mysterySeed += 2147483647; }
    newMystery();
    shell.announce("New pattern to identify.", { immediate: true });
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

  /* --- Build the challenge options ---------------------------------------------- */

  (function buildGuessOptions() {
    var container = $("[data-guess-options]");
    STYLES.forEach(function (style) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "style-guess";
      input.value = style.id;
      label.appendChild(input);
      label.appendChild(make("span", null, style.name));
      container.appendChild(label);
    });
  })();

  /* --- Reset ---------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    balancedToggle.checked = state.balanced;
    standingRange.value = String(Math.round(state.standing * 100));
    seedInput.value = String(state.seed);
    buildStyleToggles();
    newMystery();
    syncRanges();
    render();
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Seven respondents, the same twenty items.", { immediate: true });
})();
