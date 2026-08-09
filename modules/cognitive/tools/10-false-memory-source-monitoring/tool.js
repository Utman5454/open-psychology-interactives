/* =========================================================================
   False Memory and Source Monitoring
   -------------------------------------------------------------------------
   A study-then-test task with ORIGINAL themed word lists. Three lists of
   eight items are studied, blocked by theme, each item labelled with one of
   two sources. At test, twelve single words are judged on three separate
   dimensions:

       recognition   seen or not seen
       confidence    guessing / fairly sure / certain   (asked in the same click)
       source        which of the two sources, or not sure

   Keeping those three apart is the point. A word can be strongly familiar
   and carry no source information; a word can be correctly recognised and
   confidently placed in the wrong source; and a word that was never
   presented can be endorsed with as much confidence as one that was.

   THE MATERIALS ARE ORIGINAL
   --------------------------
   Six themes were written for this tool. Each has eight studied items and
   one CRITICAL LURE that is never presented but sits squarely in the theme.
   No published word list is reproduced, and none is needed: the effect
   depends on semantic coherence, not on any particular set of words.

   THE TEST SET (twelve items)
   ---------------------------
       6  studied items    two from each theme, three from each source
       3  critical lures   one per theme, never presented
       3  unrelated new    from no theme at all

   The unrelated-new row is the bias check. Somebody who says "seen" freely
   will endorse more of everything, and without that row the other two rates
   cannot be interpreted. The limits panel says so.

   WHY THE THREE MEASURES ARE NEVER COMBINED
   -----------------------------------------
   A single "memory score" would hide exactly the dissociations the task
   exists to show. The results table therefore reports endorsement,
   confidence and source separately for each kind of item, and the readout
   names the comparison worth making rather than scoring the learner.

   THIS WORKS ONCE
   ---------------
   Forewarned people endorse fewer related items. Two independent sets of
   three themes are provided so a demonstration can be run fresh a second
   time; the tool tracks which set has been used and says so. The worked
   example needs no study phase at all.

   TONE
   ----
   This is deliberately NOT a "your memory is unreliable" reveal. The
   intrusions are to items that genuinely capture the gist of what was
   studied, which is a consequence of a useful design rather than a fault.
   The debrief says so at length, and the results prose does not congratulate
   or scold anybody.

   THE WORKED EXAMPLE (the non-performing route)
   ---------------------------------------------
   A simulated class of 60 fictional participants, seed 20261001, drawn as
   Bernoulli trials with

       endorsed        studied 0.84   lure 0.61   unrelated new 0.09
       confident       (given endorsed) studied 0.62   lure 0.48   new 0.20
       source correct  (given endorsed) studied 0.71   lure has no true source

   Lure endorsement below studied endorsement, but far above the unrelated
   new rate and carrying real confidence, is the shape of the classic
   finding. It is BUILT IN here. It illustrates the pattern; it is not
   evidence for it, not a norm, and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var ITEMS_PER_THEME = 8;
  var THEMES_PER_RUN = 3;
  var STUDIED_TESTED_PER_THEME = 2;
  var GAP_MS = 350;

  var SOURCES = {
    handout: { key: "handout", label: "From the handout" },
    whiteboard: { key: "whiteboard", label: "From the whiteboard" }
  };

  /* Six original themes. Each critical lure is never presented. */
  var THEMES = [
    { lure: "HARBOUR", items: ["PIER", "ANCHOR", "TRAWLER", "QUAYSIDE",
      "MOORING", "LIGHTHOUSE", "FERRY", "DOCKS"] },
    { lure: "WINTER", items: ["FROST", "SLEDGE", "MITTENS", "ICICLE",
      "SNOWFALL", "SCARF", "BLIZZARD", "THAW"] },
    { lure: "KITCHEN", items: ["SAUCEPAN", "WHISK", "COLANDER", "SPATULA",
      "LADLE", "TEAPOT", "SIEVE", "KETTLE"] },
    { lure: "ORCHESTRA", items: ["VIOLIN", "CONDUCTOR", "OBOE", "TIMPANI",
      "CELLO", "ROSTRUM", "TRUMPET", "SCORE"] },
    { lure: "HOSPITAL", items: ["WARD", "SURGEON", "TROLLEY", "BANDAGE",
      "STETHOSCOPE", "MATRON", "SCALPEL", "CRUTCHES"] },
    { lure: "GARDEN", items: ["TROWEL", "COMPOST", "HEDGE", "WATERING",
      "SEEDLING", "BORDER", "SHED", "GREENHOUSE"] }
  ];

  /* Words belonging to no theme in this tool, used as unrelated new items. */
  var UNRELATED = ["GRAVEL", "TROMBONE", "MARBLE", "SATCHEL", "CANVAS",
    "PEBBLE", "RIBBON", "LANTERN"];

  var CONFIDENCE = {
    3: "Certain", 2: "Fairly sure", 1: "Guessing", 0: "—"
  };

  var TYPES = [
    { key: "studied", label: "Studied", chart: "studied" },
    { key: "lure", label: "Related, never shown", chart: "lure" },
    { key: "new", label: "Unrelated, never shown", chart: "new" }
  ];

  var SIM = {
    seed: 20261001,
    participants: 60,
    counts: { studied: 6, lure: 3, new: 3 },
    endorsed: { studied: 0.84, lure: 0.61, new: 0.09 },
    /* Confidence, given the item was endorsed, as cumulative thresholds for
       "certain" and then "fairly sure". Endorsements of unrelated words are
       mostly guesses; endorsements of related words are not. */
    confidence: {
      studied: { certain: 0.62, fairlySure: 0.92 },
      lure: { certain: 0.38, fairlySure: 0.80 },
      "new": { certain: 0.08, fairlySure: 0.35 }
    },
    sourceCorrect: 0.71
  };

  /* =======================================================================
     Seeded randomness (copied rather than imported, so a downloaded folder
     keeps working on its own)
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(items) {
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function sample(items, count) {
    return shuffle(items.slice()).slice(0, count);
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  function meanOf(values) {
    if (!values.length) { return null; }
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  /* =======================================================================
     Building a run
     ===================================================================== */

  function buildRun(usedThemes) {
    var available = [];
    THEMES.forEach(function (theme, index) {
      if (usedThemes.indexOf(index) === -1) { available.push(index); }
    });
    // If both sets have been spent, fall back to reusing themes and say so.
    var chosen = available.length >= THEMES_PER_RUN
      ? sample(available, THEMES_PER_RUN)
      : sample([0, 1, 2, 3, 4, 5], THEMES_PER_RUN);

    var studyList = [];
    var testItems = [];

    chosen.forEach(function (index) {
      var theme = THEMES[index];
      var items = shuffle(theme.items.slice());
      // Four items from each source within every theme, so source is not
      // confounded with theme.
      var withSource = items.map(function (word, i) {
        return {
          word: word,
          source: i < ITEMS_PER_THEME / 2 ? "handout" : "whiteboard",
          theme: index
        };
      });
      shuffle(withSource);
      studyList = studyList.concat(withSource);

      sample(withSource, STUDIED_TESTED_PER_THEME).forEach(function (item) {
        testItems.push({
          word: item.word, type: "studied", source: item.source, theme: index
        });
      });
      testItems.push({
        word: theme.lure, type: "lure", source: null, theme: index
      });
    });

    sample(UNRELATED, 3).forEach(function (word) {
      testItems.push({ word: word, type: "new", source: null, theme: null });
    });

    return {
      themes: chosen,
      reused: available.length < THEMES_PER_RUN,
      study: studyList,
      test: shuffle(testItems)
    };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#memory");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var paceSelect = $("#pace-select");
  var setNote = $("[data-set-note]");
  var startStudy = $('[data-action="start-study"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');

  var stageTrack = $("[data-stage-track]");
  var studyCard = $("[data-study-card]");
  var studySource = $("[data-study-source]");
  var studyWord = $("[data-study-word]");
  var displayCaption = $("[data-display-caption]");
  var phaseText = $("[data-phase-text]");
  var testForm = $("[data-test-form]");
  var testWord = $("[data-test-word]");
  var recogniseGroup = $("[data-recognise-group]");
  var recogniseOptions = $("[data-recognise-options]");
  var sourceGroup = $("[data-source-group]");
  var sourceOptions = $("[data-source-options]");
  var taskFeedback = $("[data-task-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var memoryReadout = $("[data-memory-readout]");
  var memoryText = $("[data-memory-text]");
  var memoryNote = $("[data-memory-note]");
  var chartCaption = $("[data-chart-caption]");
  var typeChart = $("[data-type-chart]");
  var typeTable = $("[data-type-table]");
  var itemTable = $("[data-item-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var pending = [];

  function later(fn, delay) {
    var id = window.setTimeout(function () {
      pending = pending.filter(function (other) { return other !== id; });
      fn();
    }, delay);
    pending.push(id);
    return id;
  }

  function cancelPending() {
    pending.forEach(function (id) { window.clearTimeout(id); });
    pending = [];
  }

  /* =======================================================================
     Stage track and controls
     ===================================================================== */

  function paintStageTrack(current) {
    var order = ["study", "test", "results"];
    Array.prototype.forEach.call(stageTrack.children, function (item) {
      var key = item.getAttribute("data-stage");
      item.removeAttribute("aria-current");
      if (order.indexOf(key) < order.indexOf(current)) {
        item.setAttribute("data-state", "done");
      } else if (key === current) {
        item.setAttribute("data-state", "current");
        item.setAttribute("aria-current", "step");
      } else {
        item.setAttribute("data-state", "todo");
      }
    });
  }

  function idleControls() {
    startStudy.disabled = false;
    stopButton.disabled = true;
    paceSelect.disabled = false;
  }

  function runningControls() {
    startStudy.disabled = true;
    stopButton.disabled = false;
    paceSelect.disabled = true;
  }

  function updateSetNote() {
    var left = THEMES.length - state.usedThemes.length;
    setNote.textContent = left >= THEMES_PER_RUN
      ? "Fresh themes remaining: " + left + " of " + THEMES.length +
        ". Each set works once."
      : "All themes have now been used. A further run will reuse them, and " +
        "will measure familiarity with this page rather than anything else.";
  }

  /* =======================================================================
     Study phase
     ===================================================================== */

  function startRun() {
    cancelPending();
    state.run = buildRun(state.usedThemes);
    state.run.themes.forEach(function (index) {
      if (state.usedThemes.indexOf(index) === -1) {
        state.usedThemes.push(index);
      }
    });
    state.phase = "study";
    state.index = 0;
    state.answers = [];
    taskFeedback.hidden = true;
    testForm.hidden = true;
    resultsSection.hidden = true;
    runningControls();
    paintStageTrack("study");
    phaseText.textContent = "Studying. Just read each item and its source.";
    updateSetNote();
    showStudyItem();
    shell.announce("Study phase started: " +
      (THEMES_PER_RUN * ITEMS_PER_THEME) + " items, each with its source.",
      { immediate: true });
  }

  function showStudyItem() {
    var list = state.run.study;
    if (state.index >= list.length) {
      studyCard.removeAttribute("data-source");
      studySource.textContent = "";
      studyWord.textContent = "";
      displayCaption.textContent = "Study phase finished.";
      later(startTest, 700);
      return;
    }
    var item = list[state.index];
    studyCard.setAttribute("data-source", item.source);
    studySource.textContent = SOURCES[item.source].label;
    studyWord.textContent = item.word;
    displayCaption.textContent = "Item " + (state.index + 1) + " of " +
      list.length + ".";
    state.index += 1;
    later(showStudyItem, state.pace);
  }

  /* =======================================================================
     Test phase
     ===================================================================== */

  function startTest() {
    state.phase = "test";
    state.index = 0;
    paintStageTrack("test");
    phaseText.textContent = "Testing. Nothing here is timed.";
    displayCaption.textContent =
      "Twelve words, one at a time. Answer honestly, including “not seen”.";
    showTestItem();
  }

  function showTestItem() {
    if (state.index >= state.run.test.length) {
      finishTest();
      return;
    }
    var item = state.run.test[state.index];
    testWord.textContent = item.word;
    testForm.hidden = false;
    recogniseGroup.hidden = false;
    sourceGroup.hidden = true;

    clear(recogniseOptions);
    [
      [0, "Not seen"],
      [1, "Seen — guessing"],
      [2, "Seen — fairly sure"],
      [3, "Seen — certain"]
    ].forEach(function (spec) {
      var button = make("button", "button button--secondary", spec[1]);
      button.type = "button";
      button.setAttribute("aria-label", spec[1] + ", for the word " + item.word);
      button.addEventListener("click", function () { answerRecognition(spec[0]); });
      recogniseOptions.appendChild(button);
    });

    var first = recogniseOptions.querySelector("button");
    if (first) { first.focus(); }
  }

  function answerRecognition(confidence) {
    var item = state.run.test[state.index];
    state.pendingAnswer = {
      word: item.word, type: item.type, trueSource: item.source,
      endorsed: confidence > 0, confidence: confidence, sourceGiven: null
    };

    if (confidence === 0) {
      recordAnswer();
      return;
    }

    recogniseGroup.hidden = true;
    sourceGroup.hidden = false;
    clear(sourceOptions);
    [
      ["handout", "The handout"],
      ["whiteboard", "The whiteboard"],
      ["unsure", "I cannot tell"]
    ].forEach(function (spec) {
      var button = make("button", "button button--secondary", spec[1]);
      button.type = "button";
      button.setAttribute("aria-label", spec[1] + ", for the word " + item.word);
      button.addEventListener("click", function () {
        state.pendingAnswer.sourceGiven = spec[0];
        recordAnswer();
      });
      sourceOptions.appendChild(button);
    });
    var first = sourceOptions.querySelector("button");
    if (first) { first.focus(); }
  }

  function recordAnswer() {
    state.answers.push(state.pendingAnswer);
    state.pendingAnswer = null;
    testForm.hidden = true;
    state.index += 1;
    displayCaption.textContent = state.index >= state.run.test.length
      ? "Test finished." : "Word " + (state.index + 1) + " of " +
        state.run.test.length + ".";
    later(showTestItem, GAP_MS);
  }

  function finishTest() {
    state.phase = "idle";
    cancelPending();
    testForm.hidden = true;
    idleControls();
    paintStageTrack("results");
    phaseText.textContent = "Finished. The three measures are below.";
    displayCaption.textContent = "Test finished. The results are below.";
    showResults({ source: "own" });
    shell.announce("Test finished. The results are below.", { immediate: true });
  }

  function stopRun() {
    cancelPending();
    state.phase = "idle";
    testForm.hidden = true;
    studyCard.removeAttribute("data-source");
    studySource.textContent = "";
    studyWord.textContent = "";
    idleControls();
    paintStageTrack("study");
    phaseText.textContent = "Stopped. The themes used are spent either way.";
    displayCaption.textContent =
      "Stopped. A partial run cannot be summarised, and the themes it used are spent.";
    shell.announce("Stopped. A partial run is discarded.", { immediate: true });
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  function summarise(answers) {
    var byType = {};
    TYPES.forEach(function (type) {
      var subset = answers.filter(function (a) { return a.type === type.key; });
      var endorsed = subset.filter(function (a) { return a.endorsed; });
      var sourced = endorsed.filter(function (a) {
        return a.sourceGiven && a.sourceGiven !== "unsure";
      });
      byType[type.key] = {
        n: subset.length,
        endorsed: subset.length ? endorsed.length / subset.length : null,
        confidence: endorsed.length
          ? meanOf(endorsed.map(function (a) { return a.confidence; })) : null,
        sourceCorrect: (type.key === "studied" && sourced.length)
          ? sourced.filter(function (a) {
            return a.sourceGiven === a.trueSource;
          }).length / sourced.length : null,
        sourceGiven: endorsed.length ? sourced.length / endorsed.length : null,
        endorsedCount: endorsed.length
      };
    });
    return { total: answers.length, byType: byType };
  }

  function simulatedAnswers() {
    var rand = mulberry32(SIM.seed);
    var answers = [];
    for (var p = 0; p < SIM.participants; p += 1) {
      TYPES.forEach(function (type) {
        for (var i = 0; i < SIM.counts[type.key]; i += 1) {
          var endorsed = rand() < SIM.endorsed[type.key];
          var confidence = 0;
          if (endorsed) {
            var draw = rand();
            var bands = SIM.confidence[type.key];
            confidence = draw < bands.certain ? 3
              : draw < bands.fairlySure ? 2 : 1;
          }
          var sourceGiven = null;
          if (endorsed) {
            if (type.key === "studied") {
              sourceGiven = rand() < SIM.sourceCorrect ? "correct" : "wrong";
            } else {
              // A lure or a new item has no true source, so any source given
              // at all is a source-monitoring error. Some participants decline.
              sourceGiven = rand() < 0.72 ? "wrong" : "unsure";
            }
          }
          answers.push({
            word: "", type: type.key,
            trueSource: type.key === "studied" ? "correct" : null,
            endorsed: endorsed,
            confidence: confidence,
            sourceGiven: sourceGiven
          });
        }
      });
    }
    return answers;
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function showResults(meta) {
    var answers = meta.source === "simulated" ? simulatedAnswers() : state.answers;
    var stats = summarise(answers);

    $("#results-heading").textContent = meta.source === "simulated"
      ? "Three measures, three answers — worked example, simulated"
      : "Three measures, three answers — your test";

    renderReadout(stats, meta);
    renderChart(stats);
    renderTypeTable(stats, meta);
    renderResultsProse(stats, meta);
    renderItemTable(meta);
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderReadout(stats, meta) {
    var studied = stats.byType.studied;
    var lure = stats.byType.lure;
    var fresh = stats.byType["new"];

    clear(memoryReadout);
    [
      ["Studied words called “seen”", pct(studied.endorsed)],
      ["Related words never shown, called “seen”", pct(lure.endorsed)],
      ["Unrelated words never shown, called “seen”", pct(fresh.endorsed)],
      ["Source correct, of studied words placed", pct(studied.sourceCorrect)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      memoryReadout.appendChild(cell);
    });

    chartCaption.textContent = (meta.source === "simulated"
      ? "Simulated class data (seed " + SIM.seed + "): "
      : "Your test: ") +
      "how often each kind of word was called “seen”, with average " +
      "confidence printed beside each bar";

    var sentences = [];
    if (lure.endorsed !== null && fresh.endorsed !== null) {
      sentences.push(lure.endorsed > fresh.endorsed
        ? "Words that were never shown but fitted a studied theme were " +
          "endorsed more often (" + pct(lure.endorsed) + ") than words that " +
          "fitted nothing (" + pct(fresh.endorsed) + "). The difference between " +
          "those two rates is the part that needs explaining: both kinds were " +
          "equally absent from the study phase."
        : "Here the related and unrelated words were endorsed at similar rates. " +
          "With three items of each kind that happens easily; the worked " +
          "example shows the pattern the design can produce.");
    }
    if (lure.confidence !== null && studied.confidence !== null) {
      sentences.push(lure.confidence >= studied.confidence - 0.4
        ? "The confidence attached to those intrusions was close to the " +
          "confidence attached to genuinely studied words. Confidence is " +
          "tracking familiarity, and familiarity does not distinguish an item " +
          "that was presented from an item that fits what was presented."
        : "The intrusions were held with less confidence than the studied " +
          "words, which is the more comfortable pattern and by no means the " +
          "only one that occurs.");
    }
    if (studied.sourceCorrect !== null) {
      sentences.push("Of the studied words you placed in a source, " +
        pct(studied.sourceCorrect) + " went to the right one. Source is the " +
        "measure that usually falls first, because it is inferred from the " +
        "qualities of what comes to mind rather than retrieved as a label.");
    }
    sentences.push("None of these three numbers should be averaged into the " +
      "others. They come apart, and where they come apart is the finding.");
    memoryText.textContent = sentences.join(" ");

    memoryNote.textContent = meta.source === "simulated"
      ? "Simulated class data from a documented generator with a fixed seed, " +
        "in which the pattern is set by hand. Not a norm, not a published rate " +
        "and not anybody's data."
      : "Twelve test items from one person on one occasion, so a single " +
        "item moves a percentage by a quarter. Not a measure of you, and not " +
        "evidence that memory is unreliable — a system that stores themes " +
        "will sometimes accept a good fit to one.";
  }

  function renderChart(stats) {
    var W = 460, H = 210;
    var PAD_L = 168, PAD_R = 78, PAD_T = 20, PAD_B = 40;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var rowH = plotH / TYPES.length;
    var barH = Math.min(26, rowH * 0.6);
    clear(typeChart);

    var xAt = function (p) { return PAD_L + p * plotW; };

    svgNode("line", { x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH,
      class: "chart__baseline" }, typeChart);
    [0, 0.5, 1].forEach(function (p) {
      svgNode("text", { x: xAt(p).toFixed(1), y: H - 22, "text-anchor": "middle",
        class: "chart__axis" }, typeChart)
        .textContent = Math.round(p * 100) + "%";
    });
    svgNode("text", { x: (PAD_L + plotW / 2).toFixed(1), y: H - 6,
      "text-anchor": "middle", class: "chart__axis" }, typeChart)
      .textContent = "Called “seen”";

    TYPES.forEach(function (type, row) {
      var cell = stats.byType[type.key];
      var y = PAD_T + row * rowH + (rowH - barH) / 2;
      svgNode("text", { x: PAD_L - 8, y: (y + barH / 2 + 4).toFixed(1),
        "text-anchor": "end", class: "chart__label" }, typeChart)
        .textContent = type.label;

      if (cell.endorsed === null) { return; }
      var width = Math.max(1, xAt(cell.endorsed) - PAD_L);
      svgNode("rect", { x: PAD_L, y: y.toFixed(1), width: width.toFixed(1),
        height: barH, class: "fm__bar--" + type.chart }, typeChart);
      if (type.key === "lure") {
        for (var x = PAD_L + 9; x < PAD_L + width - 2; x += 11) {
          svgNode("line", { x1: x.toFixed(1), y1: (y + 1).toFixed(1),
            x2: (x - 7).toFixed(1), y2: (y + barH - 1).toFixed(1),
            class: "fm__hatch" }, typeChart);
        }
      }
      svgNode("text", { x: (PAD_L + width + 5).toFixed(1),
        y: (y + barH / 2 + 4).toFixed(1), class: "chart__count" }, typeChart)
        .textContent = pct(cell.endorsed) +
          (cell.confidence === null ? "" :
            " (conf " + cell.confidence.toFixed(1) + ")");
    });
  }

  function renderTypeTable(stats, meta) {
    clear(typeTable);
    TYPES.forEach(function (type) {
      var cell = stats.byType[type.key];
      var row = make("tr");
      var head = make("th", null, type.label);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, pct(cell.endorsed)));
      row.appendChild(make("td", null,
        cell.confidence === null ? "—"
          : cell.confidence.toFixed(1) + " of 3"));
      row.appendChild(make("td", null,
        type.key === "studied"
          ? (cell.sourceCorrect === null ? "—"
            : pct(cell.sourceCorrect) + " correct")
          : (cell.endorsedCount
            ? pct(cell.sourceGiven) + " were given a source they never had"
            : "—")));
      typeTable.appendChild(row);
    });
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Simulated class data, seed " + SIM.seed + ": " + SIM.participants +
        " fictional participants, twelve test items each."
      : "Your test: twelve items — six studied, three related words that were " +
        "never shown, and three unrelated words that were never shown."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "The three rows come from the generator: related lures endorsed far " +
        "more often than unrelated ones and with real confidence, and source " +
        "accuracy well below recognition. That shape illustrates the classic " +
        "finding rather than evidencing it."));
    } else {
      resultsBody.appendChild(make("p", null,
        "Three or four items of each kind is very few. Read the ordering of " +
        "the three rows rather than the individual percentages, and compare " +
        "the ordering with the worked example."));
    }

    resultsBody.appendChild(make("p", null,
      "The unrelated row is the control that makes the other two readable: " +
      "a high related-lure rate only means something if the unrelated rate " +
      "is low. A full analysis would use it to correct the others rather " +
      "than reporting raw rates."));

    resultsBody.appendChild(make("p", null,
      "Notice what this is not. Every intrusion here is to a word that " +
        "fits the theme of what was studied. A memory system that keeps " +
        "the gist will occasionally accept a good fit to it. That trade " +
        "is what makes the system useful for anything beyond reciting " +
        "lists."));
  }

  function renderItemTable(meta) {
    clear(itemTable);
    if (meta.source === "simulated") {
      var row = make("tr");
      var cell = make("td", null,
        "The worked example is a simulated class rather than a single test, " +
        "so there is no item-by-item record. Run the task yourself to fill " +
        "this in.");
      cell.setAttribute("colspan", "6");
      row.appendChild(cell);
      itemTable.appendChild(row);
      return;
    }
    state.answers.forEach(function (answer) {
      var row = make("tr");
      var head = make("th", null, answer.word);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null,
        answer.type === "studied" ? "Studied"
          : answer.type === "lure" ? "Related, never shown"
            : "Unrelated, never shown"));
      row.appendChild(make("td", null,
        answer.trueSource ? SOURCES[answer.trueSource].label : "none"));
      row.appendChild(make("td", null, answer.endorsed ? "Seen" : "Not seen"));
      row.appendChild(make("td", null, CONFIDENCE[answer.confidence]));
      row.appendChild(make("td", null,
        !answer.sourceGiven ? "—"
          : answer.sourceGiven === "unsure" ? "Could not tell"
            : SOURCES[answer.sourceGiven].label));
      itemTable.appendChild(row);
    });
  }

  /* =======================================================================
     Buttons
     ===================================================================== */

  startStudy.addEventListener("click", startRun);
  stopButton.addEventListener("click", stopRun);

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.phase = "idle";
    testForm.hidden = true;
    idleControls();
    displayCaption.textContent =
      "Worked example loaded below. The task is still available.";
    showResults({ source: "simulated" });
    shell.announce("Worked example loaded: a simulated class dataset with a fixed seed.",
      { immediate: true });
  });

  paceSelect.addEventListener("change", function () {
    state.pace = Number(paceSelect.value);
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    source: {
      tone: "good", verdict: "Usually, yes.",
      text: "Source is normally the first thing to go. It is not stored as a " +
        "label attached to the memory; it is worked out at the moment of " +
        "remembering, from how the memory feels. Watch how far below " +
        "recognition it sits."
    },
    recognition: {
      tone: "caution", verdict: "Recognition holds up rather well.",
      text: "For studied items, at least. The interesting cases are the items " +
        "you did not study — and whether recognition can tell those apart from " +
        "the ones you did."
    },
    confidence: {
      tone: "caution", verdict: "Worth watching closely.",
      text: "Confidence is not a report on accuracy. It tracks how familiar " +
        "something feels, and familiarity does not distinguish an item that " +
        "was presented from one that fits everything that was."
    },
    none: {
      tone: "caution", verdict: "Some of it will be easy.",
      text: "Recognising the words you studied usually is. Keep an eye on the " +
        "two harder questions: where each one came from, and what happens with " +
        "words that fit the theme without having been there."
    }
  };

  function unlockTask(message) {
    idleControls();
    displayCaption.textContent =
      "Ready. The study phase runs straight through; the test is not timed.";
    phaseText.textContent = "Ready to study.";
    paintStageTrack("study");
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four answers before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockTask("Study phase unlocked.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The task is unlocked.");
    lockForm(openingForm);
    unlockTask("Prediction skipped. Study phase unlocked.");
  });

  /* =======================================================================
     Transfer challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "distinct-source",
      text: "The two sources are made far more distinctive — one spoken by a different voice in a different room. What happens to SOURCE ERRORS on studied words?",
      answer: "falls",
      why: "They fall, and substantially. Source is inferred from the qualities " +
        "of what comes to mind, so the more the two sources differ in those " +
        "qualities the easier the inference is. This is the single most " +
        "reliable way to improve source memory."
    },
    {
      id: "distinct-lure",
      text: "The same change — far more distinctive sources. What happens to ENDORSEMENT OF THE RELATED WORDS that were never shown?",
      answer: "little",
      why: "Little change. The intrusion does not come from confusing two " +
        "sources; it comes from a theme having been encoded and a new word " +
        "fitting it. Distinctive sources give you nothing to work with for an " +
        "item that has no source at all. This row and the one above are the " +
        "same manipulation with different outcomes, which is the point of the " +
        "exercise."
    },
    {
      id: "delay",
      text: "The test happens a week later instead of immediately. What happens to ENDORSEMENT OF THE RELATED WORDS?",
      answer: "rises",
      why: "It rises relative to studied items. Specific item detail fades " +
        "faster than the theme does, so the basis for saying no to a good " +
        "thematic fit is exactly what is lost first."
    },
    {
      id: "warning",
      text: "Learners are told in advance that related words which were never shown will appear at test. What happens to ENDORSEMENT OF THE RELATED WORDS?",
      answer: "falls",
      why: "It falls — and typically it is reduced rather than abolished, which " +
        "is why this demonstration works properly only once. A warning gives " +
        "people a stricter criterion; it does not stop the theme from having " +
        "been encoded."
    },
    {
      id: "longer",
      text: "Each theme's list is made longer, with more items pointing at the same theme. What happens to ENDORSEMENT OF THE RELATED WORDS?",
      answer: "rises",
      why: "It rises. The more items converge on a theme, the stronger the " +
        "theme's representation and the better a new item fitting it will feel. " +
        "This is one of the clearest predictions a gist account makes, and it " +
        "is the reason the lists here are eight items rather than three."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["rises", "It rises"],
    ["falls", "It falls"],
    ["little", "Little change"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_ITEMS.forEach(function (item) {
      var row = make("tr");
      var head = make("th", null, item.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var cell = make("td");
      var select = make("select");
      select.id = "transfer-" + item.id;
      var label = make("label", "visually-hidden", item.text);
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      cell.appendChild(label);
      cell.appendChild(select);
      cell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(cell);
      challengeRows.appendChild(row);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0, right = 0;
    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#transfer-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each row, check which outcome is being asked " +
        "about before deciding — two rows change the same thing and ask about " +
        "different measures.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "The first two rows are the same manipulation asked about two different " +
      "measures, and they have different answers. That is the clearest " +
      "possible statement that source monitoring and gist-based recognition " +
      "are separate problems.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_ITEMS.length + " correct.", { immediate: true });
  });

  /* =======================================================================
     Helpers
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
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* =======================================================================
     Reset
     -------------------------------------------------------------------------
     Which themes have been spent is deliberately NOT reset: a theme a learner
     has already studied is no longer fresh material, and pretending otherwise
     would quietly turn the demonstration into a practice test.
     ===================================================================== */

  var usedThemes = [];

  shell.onReset(function () {
    cancelPending();
    state = {
      phase: "idle",
      index: 0,
      run: null,
      answers: [],
      pendingAnswer: null,
      pace: 1500,
      usedThemes: usedThemes
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    testForm.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "Three measures, three answers";

    clear(typeTable);
    clear(itemTable);
    clear(typeChart);
    clear(resultsBody);
    clear(memoryReadout);
    memoryText.textContent = "";
    memoryNote.textContent = "";

    paceSelect.value = "1500";
    paceSelect.disabled = true;
    startStudy.disabled = true;
    stopButton.disabled = true;

    studyCard.removeAttribute("data-source");
    studySource.textContent = "";
    studyWord.textContent = "";
    displayCaption.textContent =
      "Answer the question above to unlock the study phase.";
    phaseText.textContent = "Answer the question above to unlock this.";

    paintStageTrack("study");
    updateSetNote();
    renderChallenge();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. The study phase runs straight through at your chosen pace and the " +
    "test is not timed. The worked example needs no study phase at all.",
    { immediate: true });
})();
