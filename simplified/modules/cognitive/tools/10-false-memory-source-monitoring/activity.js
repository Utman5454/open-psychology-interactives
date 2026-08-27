/* =========================================================================
   Remembering a Word Nobody Said — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/10-false-memory-source-monitoring/

   TEACHING JOB
   ------------
   A word that was never presented can be recognised confidently and even
   attributed to a source, because the three judgements are separate and a
   false memory can score highly on all of them.

   WHAT IS PRESERVED
   -----------------
   The studied lists with labelled sources, and the three judgements at test:
   seen or not, how sure, and who said it. All three are needed, because the
   point is that they come apart. Dropping the source question would leave an
   ordinary false-recognition demonstration; dropping confidence would leave
   the false memory looking like a guess.

   THE MATERIALS ARE ORIGINAL
   --------------------------
   The two lists were written for this activity rather than taken from a
   published set, so no published test material is reproduced. Each list is
   ten words chosen to converge on one word that never appears. That also
   means they are not calibrated, and the caution says so rather than implying
   a rate anyone should expect.

   THE TEST SET
   ------------
       4 studied words, two from each list
       4 unrelated words, never shown and fitting neither theme
       2 critical lures, one per list, never shown and fitting perfectly

   The unrelated words matter: without them a high yes rate to the lures could
   just be a bias towards saying yes.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var WORD_MS = 950;
  var LEAD_IN_MS = 800;
  var SOURCES = ["Ravi", "Nina"];

  /* Written for this activity. Each list converges on a word never in it. */
  var LISTS = [
    {
      lure: "SLEEP", source: "Ravi",
      words: ["bed", "tired", "night", "pillow", "dream",
              "yawn", "blanket", "snore", "nap", "duvet"]
    },
    {
      lure: "COLD", source: "Nina",
      words: ["ice", "frost", "winter", "shiver", "snow",
              "chilly", "freezer", "arctic", "wind", "scarf"]
    }
  ];
  var UNRELATED = ["ladder", "guitar", "harbour", "pepper"];
  var STUDIED_PROBES = ["pillow", "yawn", "frost", "arctic"];

  var CONFIDENCE = [
    { key: "sure", label: "Sure", weight: 3 },
    { key: "fairly", label: "Fairly sure", weight: 2 },
    { key: "guessing", label: "Guessing", weight: 1 }
  ];

  var field = document.getElementById("field");
  var fieldDesc = document.getElementById("field-desc");
  var testPanel = document.getElementById("test-panel");
  var probeWord = document.getElementById("probe-word");
  var qSeen = document.getElementById("q-seen");
  var qConfidence = document.getElementById("q-confidence");
  var qSource = document.getElementById("q-source");
  var optSeen = document.getElementById("options-seen");
  var optConfidence = document.getElementById("options-confidence");
  var optSource = document.getElementById("options-source");
  var counter = document.getElementById("counter");
  var start = document.getElementById("start");
  var stepLabel = document.getElementById("step-label");
  var taskHeading = document.getElementById("task-heading");
  var taskLead = document.getElementById("task-lead");
  var setupNote = document.getElementById("setup-note");
  var resultLead = document.getElementById("result-lead");
  var readout = document.getElementById("readout");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, random) {
    var k = list.length - 1;
    while (k > 0) {
      var j = Math.floor(random() * (k + 1));
      var s = list[k]; list[k] = list[j]; list[j] = s;
      k -= 1;
    }
    return list;
  }

  /* --- Sequences --------------------------------------------------------- */

  var studySequence = [];
  LISTS.forEach(function (list) {
    list.words.forEach(function (word) {
      studySequence.push({ word: word, source: list.source });
    });
  });

  function buildTestSet() {
    var random = mulberry32(5309);
    var items = [];
    STUDIED_PROBES.forEach(function (word) {
      var owner = LISTS.filter(function (l) { return l.words.indexOf(word) >= 0; })[0];
      items.push({ word: word, kind: "studied", trueSource: owner.source });
    });
    UNRELATED.forEach(function (word) {
      items.push({ word: word, kind: "unrelated", trueSource: null });
    });
    LISTS.forEach(function (list) {
      items.push({ word: list.lure, kind: "lure", trueSource: null });
    });
    return shuffle(items, random);
  }

  /* --- Drawing ---------------------------------------------------------- */

  function drawWord(entry) {
    wb.clearFigure(field);
    if (!entry) {
      var msg = svg("text", {
        x: 300, y: 118, "text-anchor": "middle", fill: "#9AA6B4",
        "font-size": "20", "font-weight": "700"
      });
      msg.textContent = "Ready when you are.";
      field.appendChild(msg);
      fieldDesc.textContent = "Nothing is showing yet.";
      return;
    }
    var who = svg("text", {
      x: 300, y: 58, "text-anchor": "middle", fill: "#9AA6B4",
      "font-size": "20", "font-weight": "700"
    });
    who.textContent = entry.source + " reads:";
    field.appendChild(who);
    var text = svg("text", {
      x: 300, y: 148, "text-anchor": "middle", fill: "#FFFFFF",
      "font-size": "54", "font-weight": "800"
    });
    text.textContent = entry.word;
    field.appendChild(text);
    fieldDesc.textContent = entry.source + " reads the word " + entry.word + ".";
  }

  /* --- Options ----------------------------------------------------------- */

  function buildOptions(box, entries, handler, legendText) {
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = legendText;
    box.appendChild(legend);
    entries.forEach(function (entry) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-key", entry.key);
      button.textContent = entry.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        handler(entry.key);
      });
      box.appendChild(button);
    });
  }

  function markOnly(box, key) {
    Array.prototype.forEach.call(box.querySelectorAll("[data-choice]"), function (node) {
      wb.choices.mark(node, node.getAttribute("data-key") === key ? "chosen" : null);
    });
    wb.choices.lock(box);
  }

  /* --- Running ----------------------------------------------------------- */

  var phase = "idle";
  var studyIndex = 0;
  var timer = null;
  var testSet = [];
  var testIndex = 0;
  var answers = [];
  var pending = null;

  function clearTimer() {
    if (timer !== null) { window.clearTimeout(timer); timer = null; }
  }

  function studyTick() {
    if (studyIndex >= studySequence.length) { startTest(); return; }
    drawWord(studySequence[studyIndex]);
    counter.textContent = "Word " + (studyIndex + 1) + " of " + studySequence.length + ".";
    studyIndex += 1;
    timer = window.setTimeout(studyTick, WORD_MS);
  }

  function beginStudy() {
    phase = "study";
    studyIndex = 0;
    testSet = buildTestSet();
    testIndex = 0;
    answers = [];
    wb.progress.set(0);
    start.hidden = true;
    setupNote.hidden = true;
    wb.announce("The lists are starting. Just watch.");
    timer = window.setTimeout(studyTick, LEAD_IN_MS);
  }

  function startTest() {
    phase = "test";
    clearTimer();
    drawWord(null);
    wb.clearFigure(field);
    fieldDesc.textContent = "The lists have finished.";
    wb.progress.set(1);
    stepLabel.textContent = "Test";
    taskHeading.textContent = "Ten words, three questions each";
    taskLead.textContent = "For each word: was it in either list, how sure are " +
      "you, and who read it out. Answer the first before you see the second. " +
      "If you say a word was not in the lists you will not be asked the other " +
      "two.";
    wb.show("#test-panel");
    nextProbe();
    wb.announce("The lists have finished. Ten words to judge.");
  }

  function nextProbe() {
    if (testIndex >= testSet.length) { report(); return; }
    pending = { item: testSet[testIndex], seen: null, confidence: null, source: null };
    probeWord.textContent = testSet[testIndex].word;
    counter.textContent = "Word " + (testIndex + 1) + " of " + testSet.length + ".";
    wb.hide("#q-confidence");
    wb.hide("#q-source");
    buildOptions(optSeen, [
      { key: "yes", label: "Yes, it was in a list" },
      { key: "no", label: "No, it was not" }
    ], answerSeen, "Was this word in either list?");
    wb.show("#q-seen");
  }

  function answerSeen(key) {
    pending.seen = key === "yes";
    markOnly(optSeen, key);
    if (!pending.seen) { finishProbe(); return; }
    buildOptions(optConfidence, CONFIDENCE, answerConfidence, "How sure are you?");
    wb.show("#q-confidence");
  }

  function answerConfidence(key) {
    pending.confidence = key;
    markOnly(optConfidence, key);
    buildOptions(optSource, SOURCES.map(function (s) {
      return { key: s, label: s };
    }).concat([{ key: "unsure", label: "Cannot tell" }]), answerSource, "Who read it out?");
    wb.show("#q-source");
  }

  function answerSource(key) {
    pending.source = key;
    markOnly(optSource, key);
    finishProbe();
  }

  function finishProbe() {
    answers.push(pending);
    pending = null;
    testIndex += 1;
    nextProbe();
  }

  /* --- Result ------------------------------------------------------------ */

  function rateFor(kind) {
    var rows = answers.filter(function (a) { return a.item.kind === kind; });
    if (!rows.length) { return null; }
    return rows.filter(function (a) { return a.seen; }).length / rows.length;
  }

  function report() {
    phase = "done";
    wb.hide("#test-panel");
    wb.progress.markAllDone();
    stepLabel.textContent = "What happened";
    taskHeading.textContent = "All ten judged";
    taskLead.textContent = "Your result is below.";
    counter.textContent = "";

    var studied = rateFor("studied");
    var unrelated = rateFor("unrelated");
    var lure = rateFor("lure");
    var lureRows = answers.filter(function (a) { return a.item.kind === "lure"; });
    var lureYes = lureRows.filter(function (a) { return a.seen; });
    var confidentLures = lureYes.filter(function (a) { return a.confidence !== "guessing"; });
    var sourcedLures = lureYes.filter(function (a) {
      return a.source === "Ravi" || a.source === "Nina";
    });

    readout.textContent = "";
    tile("Words really in the lists", pc(studied), "you said yes to these");
    tile("Words with nothing to do with them", pc(unrelated), "you said yes to these");
    tile("Words that fit but were never shown", pc(lure),
      lureYes.length ? "and were never on the screen at all" : "you were not caught by these");

    if (!lureYes.length) {
      resultLead.textContent =
        "You were not caught this time: you said no to both " + LISTS[0].lure +
        " and " + LISTS[1].lure + ", neither of which was ever on the screen, " +
        "while saying yes to " + pc(studied) + " of the words that really were " +
        "in the lists. That happens, particularly with only two lists and " +
        "someone who suspects a trick. The comparison to make is still the one " +
        "on the chart: the two words you were not caught by fit the lists " +
        "perfectly, and the unrelated words did not.";
    } else {
      var names = lureYes.map(function (a) { return a.item.word; }).join(" and ");
      resultLead.textContent =
        "You said you had seen " + names + ". " +
        (lureYes.length === 1 ? "That word was " : "Those words were ") +
        "never on the screen. Every word in " +
        (lureYes.length === 1 ? "one of the lists pointed at it" : "the lists pointed at them") +
        " and none of them was it." +
        (confidentLures.length
          ? " You were not guessing either: you marked " +
            (confidentLures.length === 1 ? "it" : "them") + " as " +
            confidentLures.map(function (a) {
              return CONFIDENCE.filter(function (c) { return c.key === a.confidence; })[0].label.toLowerCase();
            }).join(" and ") + "."
          : " You did mark that as a guess, which is the honest signal that a " +
            "confidence judgement is supposed to give.") +
        (sourcedLures.length
          ? " And you named " +
            (sourcedLures.length === 1 ? "a person who read it out" : "people who read them out") +
            ": " + sourcedLures.map(function (a) { return a.source; }).join(" and ") +
            ". Nobody read " + (sourcedLures.length === 1 ? "it" : "them") + " out."
          : "");
    }

    renderChart(studied, unrelated, lure);
    renderTable();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All ten judged. The result is below.");
  }

  function pc(x) { return x === null ? "no data" : Math.round(100 * x) + "%"; }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);
  }

  var BARS = [
    { key: "studied", label: "Really in the lists", fill: "#1C7293" },
    { key: "unrelated", label: "Nothing to do with them", fill: "#5F6878" },
    { key: "lure", label: "Fitted perfectly, never shown", fill: "#C0434F" }
  ];

  function renderChart(studied, unrelated, lure) {
    var values = { studied: studied, unrelated: unrelated, lure: lure };
    var LEFT = 300, RIGHT = 830, TOP = 54, ROW = 66;
    var BASE = TOP + BARS.length * ROW;
    var X = function (r) { return LEFT + r * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 66));

    var title = svg("text", { x: 30, y: 26, class: "plot__label" });
    title.textContent = "How often you said the word had been in a list";
    chart.appendChild(title);

    BARS.forEach(function (bar, i) {
      var y = TOP + i * ROW;
      var label = svg("text", { x: LEFT - 16, y: y + 26, "text-anchor": "end", class: "plot__label" });
      label.textContent = bar.label;
      chart.appendChild(label);
      var v = values[bar.key] === null ? 0 : values[bar.key];
      chart.appendChild(svg("rect", {
        x: LEFT, y: y + 6, width: Math.max(2, X(v) - LEFT).toFixed(1),
        height: 30, rx: 4, fill: bar.fill, "fill-opacity": "0.8"
      }));
      var value = svg("text", { x: (X(v) + 12).toFixed(1), y: y + 27, class: "plot__sub" });
      value.textContent = pc(values[bar.key]);
      chart.appendChild(value);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    [0, 0.5, 1].forEach(function (r) {
      var tick = svg("text", { x: X(r).toFixed(1), y: BASE + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = pc(r);
      chart.appendChild(tick);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BASE + 48, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Share of that kind of word you said yes to";
    chart.appendChild(cap);

    chartDesc.textContent =
      "Three bars. You said yes to " + pc(studied) +
      " of the words that really were in the lists, " + pc(unrelated) +
      " of the words with nothing to do with them, and " + pc(lure) +
      " of the two words that fitted the lists perfectly and were never shown.";
  }

  var KIND_LABEL = {
    studied: "Yes", unrelated: "No", lure: "No, never shown"
  };

  function renderTable() {
    tableBody.textContent = "";
    answers.forEach(function (a) {
      var row = document.createElement("tr");
      var conf = a.confidence
        ? CONFIDENCE.filter(function (c) { return c.key === a.confidence; })[0].label : "-";
      [
        a.item.word,
        KIND_LABEL[a.item.kind],
        a.seen ? "Yes" : "No",
        conf,
        a.source || "-"
      ].forEach(function (text, i) {
        var cell = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });
    tableCaption.textContent =
      "Every test word, what it really was, and what you said. The two lists " +
      "pointed at " + LISTS[0].lure + " and " + LISTS[1].lure +
      ", neither of which was ever shown.";
  }

  /* --- Wiring ------------------------------------------------------------ */

  start.addEventListener("click", beginStudy);

  function doReset() {
    clearTimer();
    phase = "idle";
    studyIndex = 0; testIndex = 0; answers = []; pending = null;
    wb.choices.clear(optSeen);
    wb.choices.clear(optConfidence);
    wb.choices.clear(optSource);
    optSeen.textContent = ""; optConfidence.textContent = ""; optSource.textContent = "";
    wb.hide("#test-panel");
    wb.hide("#q-confidence");
    wb.hide("#q-source");
    wb.hide("#synthesis");
    setupNote.hidden = false;
    stepLabel.textContent = "Study";
    taskHeading.textContent = "Two lists, read by two people";
    taskLead.textContent = "Twenty words appear one at a time, about one a " +
      "second. Each one is labelled with who read it out, Ravi or Nina. Just " +
      "watch and take them in. There is nothing to press.";
    counter.textContent = "";
    start.hidden = false;
    wb.progress.reset();
    drawWord(null);
  }

  wb.onReset(doReset);
  drawWord(null);
})();
