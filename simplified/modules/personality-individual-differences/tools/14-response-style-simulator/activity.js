/**
 * Four Ways to Answer the Same Questionnaire  (Simplified Edition)
 *
 * Teaching job: reverse-worded items rescue the score of somebody who agrees
 * with everything, and do nothing at all for somebody who prefers the ends of
 * the scale or the middle of it.
 *
 * The model is the one from the full Response-Style Simulator, cut to four
 * respondents. Item i is answered as
 *
 *     raw   = 3 + standing * keying(i) * DISCRIMINATION + noise(i)
 *     shown = clamp(round(style(raw)), 1, 5)
 *
 * with keying(i) = +1 for a positively worded item and -1 for a reverse-worded
 * one, and the recoded answer being `shown` for a positive item and 6 - shown
 * for a reverse-worded one.
 *
 * ONE CHOICE THAT MATTERS. All four respondents share a single noise draw, so
 * the four rows of the grid come from one underlying set of reactions
 * expressed four ways. Giving each respondent an independent draw would be a
 * better model of four different people and a much worse demonstration,
 * because the differences between the rows would then be part style and part
 * sampling noise, and the exact cancellation that the activity turns on would
 * be buried under it. The page says the rows share an origin.
 *
 * WHY THE CANCELLATION WORKS, which is the thing to be got right:
 * acquiescence adds a constant to every answer. On a positively worded item
 * that constant raises the recoded answer. On a reverse-worded item it raises
 * `shown`, and recoding to 6 - shown turns the same constant into a
 * subtraction of equal size. Over a balanced scale the two halves cancel. On
 * an unbalanced scale nothing cancels and the whole constant lands on the
 * total. Extreme and midpoint responding multiply the distance from the
 * midpoint rather than adding a constant, and a multiplication survives the
 * flip unchanged, which is why balancing does nothing for either.
 *
 * The one place the cancellation is imperfect is the top and bottom of the
 * scale, where answers clamp at 5 and 1 and there is no room left for the
 * constant to be added. That is a real property of bounded rating scales
 * rather than a defect of the model, and the page reports it rather than
 * hiding it.
 *
 * Deliberate simplifications:
 *   - Four styles, not seven. Random and straight-line responding raise a
 *     different question, about detecting inattention, and are in the longer
 *     version.
 *   - Every item has the same discrimination.
 *   - A style is a fixed transformation rather than something that varies
 *     across items or drifts through a questionnaire.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var ITEMS = 20;
  var DISCRIMINATION = 1.5;
  var NOISE = 0.42;
  var SEED = 7717;
  var LOW = 1, HIGH = 5, MID = 3;

  var STYLES = [
    { key: "attentive", name: "Answers straightforwardly",
      short: "Straightforward", apply: function (raw) { return raw; },
      blurb: "the comparison case" },
    { key: "acquiescent", name: "Agrees with everything",
      short: "Agrees", apply: function (raw) { return raw + 1.2; },
      blurb: "adds the same amount to every answer" },
    { key: "extreme", name: "Uses the ends of the scale",
      short: "Uses the ends", apply: function (raw) { return MID + (raw - MID) * 2.2; },
      blurb: "multiplies the distance from the middle" },
    { key: "midpoint", name: "Stays near the middle",
      short: "Stays central", apply: function (raw) { return MID + (raw - MID) * 0.55; },
      blurb: "shrinks the distance from the middle" }
  ];

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normals(random, n) {
    var out = [];
    while (out.length < n) {
      var u = Math.max(random(), 1e-12);
      var v = random();
      var mag = Math.sqrt(-2 * Math.log(u));
      out.push(mag * Math.cos(2 * Math.PI * v));
      out.push(mag * Math.sin(2 * Math.PI * v));
    }
    return out.slice(0, n);
  }

  /**
   * One draw, shared by all four respondents. See the header comment.
   *
   * The draw is centred within each half of the questionnaire, odd items and
   * even items separately, so that both halves have mean zero. Without this
   * the straightforward respondent, who is the benchmark the whole figure is
   * read against, lands up to a quarter of a point away from the score their
   * standing implies, purely because twenty draws from a normal distribution
   * do not average to zero and the two halves do not average to each other.
   * That would put a visible error on the one row that is supposed to be
   * error-free, and invite the reader to explain it as a response style.
   */
  var NOISE_DRAW = (function () {
    var draw = normals(mulberry32(SEED), ITEMS);
    [0, 1].forEach(function (parity) {
      var indices = [];
      for (var i = 0; i < ITEMS; i += 1) {
        if (i % 2 === parity) { indices.push(i); }
      }
      var sum = 0;
      indices.forEach(function (i) { sum += draw[i]; });
      var offset = sum / indices.length;
      indices.forEach(function (i) { draw[i] -= offset; });
    });
    return draw;
  }());

  function keyOf(index, balanced) {
    if (!balanced) { return 1; }
    return index % 2 === 0 ? 1 : -1;
  }

  function answersFor(style, standing, balanced) {
    var shown = [];
    var recoded = [];
    for (var i = 0; i < ITEMS; i += 1) {
      var key = keyOf(i, balanced);
      var raw = MID + standing * key * DISCRIMINATION + NOISE_DRAW[i] * NOISE;
      var value = Math.max(LOW, Math.min(HIGH, Math.round(style.apply(raw))));
      shown.push(value);
      recoded.push(key === 1 ? value : (LOW + HIGH) - value);
    }
    return { shown: shown, recoded: recoded };
  }

  function meanOf(values) {
    var sum = 0;
    values.forEach(function (v) { sum += v; });
    return sum / values.length;
  }

  function scoreFor(style, standing, balanced) {
    return meanOf(answersFor(style, standing, balanced).recoded);
  }

  /** What the shared true standing should have produced, on the same scale. */
  function accurate(standing) {
    return Math.max(LOW, Math.min(HIGH, MID + standing * DISCRIMINATION));
  }

  function standingOf(percent) { return percent / 100; }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardSim;
  var standingInput, keyingBtn, keyingValue, gridHead, gridBody, gridCaption;
  var readout, chart, chartDesc, sentence;
  var unbalanceBtn, explainBtn, note, noteText, synthesis, resultLead;

  var REVEAL_AFTER = 2;
  var answered = false;
  var movesMade = 0;
  var balanced = true;

  function standing() { return standingOf(Number(standingInput.value)); }

  var VERDICTS = {
    agree: { state: "correct", text:
      "Correct, and the second half of that sentence is the part most people " +
      "miss. Agreeing with everything adds a constant to every answer, and " +
      "recoding turns that constant into a subtraction on the reverse-worded " +
      "half, so it cancels. Preferring the ends or the middle multiplies the " +
      "distance from the midpoint instead, and a multiplication survives the " +
      "flip untouched." },
    all: { state: "incorrect", text:
      "This is the standard belief and it is too generous. Balanced keying is " +
      "genuinely effective against one style and does nothing for the other " +
      "two. The reason is worth holding onto: agreeing adds a constant, which " +
      "recoding can cancel, while the other two multiply the distance from " +
      "the middle, which recoding cannot." },
    ends: { state: "incorrect", text:
      "Preferring the ends is the style balancing helps least. Somebody who " +
      "answers 5 to an item and 1 to its opposite is stretched away from the " +
      "middle in both directions at once, and recoding the second answer to " +
      "5 leaves the stretch exactly where it was." },
    none: { state: "incorrect", text:
      "Reverse wording is often defended in terms of item quality and keeping " +
      "people reading, and both are real. It also does something arithmetical " +
      "and specific to the score, which is what the grids below show." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "agree") {
      wb.choices.mark(options.querySelector('[data-choice="agree"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardSim);
    render();
    wb.scrollTo(cardSim);
    wb.focus(standingInput);
    wb.announce("The four grids are shown.");
  }

  /* ---------------------------------------------------------------- grids */

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function buildGrid() {
    var s = standing();
    gridHead.textContent = "";
    gridHead.appendChild(cell("th", "How they answer", "col"));
    for (var i = 0; i < ITEMS; i += 1) {
      var head = cell("th", String(i + 1) + (keyOf(i, balanced) === -1 ? "R" : ""), "col");
      gridHead.appendChild(head);
    }

    gridBody.textContent = "";
    STYLES.forEach(function (style) {
      var row = global.document.createElement("tr");
      row.appendChild(cell("th", style.name, "row"));
      answersFor(style, s, balanced).shown.forEach(function (v) {
        row.appendChild(cell("td", String(v)));
      });
      gridBody.appendChild(row);
    });

    gridCaption.textContent = balanced
      ? "Every answer given, on a 1 to 5 scale. Column headings marked R are " +
        "reverse worded, so agreeing with them means less of the trait, and " +
        "they are flipped before the score is worked out."
      : "Every answer given, on a 1 to 5 scale. No item is reverse worded on " +
        "this version of the questionnaire, so nothing is flipped and " +
        "agreeing with an item always raises the score.";
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 150, RIGHT = 700, TOP = 66, ROW = 44;
  var COLOURS = ["#1C7293", "#9E7318", "#C0434F", "#25634F"];

  function render() {
    var s = standing();
    wb.clearFigure(chart);
    var height = TOP + STYLES.length * ROW + 62;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (v) {
      return LEFT + ((v - LOW) / (HIGH - LOW)) * (RIGHT - LEFT);
    };

    [1, 2, 3, 4, 5].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: xOf(v).toFixed(1), y1: TOP - 16, x2: xOf(v).toFixed(1),
        y2: (TOP + STYLES.length * ROW - ROW / 2).toFixed(1),
        class: "plot__axis", opacity: 0.55
      }));
      var tick = svg("text", {
        x: xOf(v).toFixed(1), y: TOP - 24, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    /* Where the score should have landed, given what all four actually are. */
    var trueX = xOf(accurate(s));
    chart.appendChild(svg("line", {
      x1: trueX.toFixed(1), y1: TOP - 44, x2: trueX.toFixed(1),
      y2: (TOP + STYLES.length * ROW - ROW / 2).toFixed(1),
      stroke: "#1A2744", "stroke-width": 2
    }));
    var trueLabel = svg("text", {
      x: trueX.toFixed(1), y: TOP - 50, "text-anchor": "middle", class: "plot__label"
    });
    trueLabel.textContent = "should be " + accurate(s).toFixed(2);
    chart.appendChild(trueLabel);

    STYLES.forEach(function (style, i) {
      var y = TOP + i * ROW;
      var name = svg("text", { x: 0, y: (y + 4).toFixed(1), class: "plot__sub" });
      name.textContent = style.short;
      chart.appendChild(name);

      var score = scoreFor(style, s, balanced);
      chart.appendChild(svg("circle", {
        cx: xOf(score).toFixed(1), cy: y.toFixed(1), r: 7, fill: COLOURS[i]
      }));
      /* Values sit in a fixed column clear of the plot rather than floating
         beside their marker: a marker that lands near a whole number puts its
         label straight on top of a gridline, and the column also lets the four
         scores be compared by reading straight down. */
      var value = svg("text", {
        x: (RIGHT + 24).toFixed(1), y: (y + 4).toFixed(1),
        class: "plot__sub", fill: COLOURS[i]
      });
      value.textContent = score.toFixed(2);
      chart.appendChild(value);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 22).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Recoded score, the number that would go on the record";
    chart.appendChild(axis);

    buildGrid();
    describe(s);
    readouts(s);
  }

  function describe(s) {
    var parts = STYLES.map(function (style) {
      return style.short + " " + scoreFor(style, s, balanced).toFixed(2);
    });
    chartDesc.textContent =
      "Four markers on a 1 to 5 scale, one for each respondent, against an " +
      "upright line at " + accurate(s).toFixed(2) + ", which is the score " +
      "their shared true standing should have produced. On the " +
      (balanced ? "balanced" : "unbalanced") + " questionnaire the recoded " +
      "scores are " + parts.join(", ") + ". The person who agrees with " +
      "everything is " + Math.abs(scoreFor(STYLES[1], s, balanced) -
        scoreFor(STYLES[0], s, balanced)).toFixed(2) + " away from the " +
      "straightforward respondent.";
  }

  function tile(label, value, noteText, colour) {
    var li = global.document.createElement("li");
    li.className = "result";
    var l = global.document.createElement("p");
    l.className = "result__label";
    l.textContent = label;
    var v = global.document.createElement("p");
    v.className = "result__value big";
    v.textContent = value;
    var n = global.document.createElement("span");
    n.className = "result__note";
    n.textContent = noteText;
    li.appendChild(l); li.appendChild(v); li.appendChild(n);
    if (colour) { li.setAttribute("data-state", colour); }
    return li;
  }

  function readouts(s) {
    var target = accurate(s);
    readout.textContent = "";
    STYLES.forEach(function (style) {
      var score = scoreFor(style, s, balanced);
      var off = score - target;
      readout.appendChild(tile(style.name, score.toFixed(2),
        Math.abs(off) < 0.2 ? "as close to right as a five-point scale allows" :
          (off > 0 ? "too high by " : "too low by ") + Math.abs(off).toFixed(2),
        Math.abs(off) < 0.2 ? "correct" : (Math.abs(off) < 0.5 ? "partial" : "incorrect")));
    });

    var agreeGap = scoreFor(STYLES[1], s, balanced) - scoreFor(STYLES[0], s, balanced);
    var other = balanced
      ? scoreFor(STYLES[1], s, false) - scoreFor(STYLES[0], s, false)
      : scoreFor(STYLES[1], s, true) - scoreFor(STYLES[0], s, true);
    sentence.textContent =
      "On this questionnaire the person who agrees with everything scores " +
      Math.abs(agreeGap).toFixed(2) + " " +
      (agreeGap >= 0 ? "above" : "below") + " the straightforward one. On the " +
      (balanced ? "unbalanced" : "balanced") + " version it would be " +
      Math.abs(other).toFixed(2) + " " + (other >= 0 ? "above" : "below") +
      ". The two people are identical in both.";
  }

  /* ------------------------------------------------------------- guidance */

  function setKeying(next, announce) {
    balanced = next;
    keyingBtn.setAttribute("aria-pressed", balanced ? "true" : "false");
    keyingBtn.textContent = balanced
      ? "Half the items reverse worded" : "Every item worded the same way";
    keyingValue.textContent = balanced ? "balanced" : "unbalanced";
    render();
    if (announce) {
      wb.announce(balanced
        ? "Balanced questionnaire. Half the items are reverse worded."
        : "Unbalanced questionnaire. No item is reverse worded.");
    }
  }

  function toggleKeying() {
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    setKeying(!balanced, true);
  }

  function showUnbalanced() {
    movesMade = REVEAL_AFTER;
    explainBtn.disabled = false;
    setKeying(false, false);
    var s = standing();
    var withBalance = scoreFor(STYLES[1], s, true);
    var without = scoreFor(STYLES[1], s, false);
    noteText.textContent =
      "Nobody has changed. The questionnaire has. With half the items " +
      "reverse worded, the person who agrees with everything scored " +
      withBalance.toFixed(2) + " against a true value of " +
      accurate(s).toFixed(2) + ". With every item worded the same way round " +
      "they score " + without.toFixed(2) + ", which is " +
      Math.abs(without - withBalance).toFixed(2) + " higher, and there is " +
      "nothing in the answers to say whether that is a person who holds the " +
      "trait strongly or a person who agrees readily. Look at the other two " +
      "rows while you are here: their scores barely moved, because reverse " +
      "wording was never doing anything for them.";
    wb.show(note);
    wb.announce("Unbalanced questionnaire. The agreeing respondent now scores " +
      without.toFixed(2) + ".");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="standing"]');
    if (output) {
      var v = Number(standingInput.value);
      output.textContent = (v > 0 ? "+" : "") + v;
    }
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var s = standing();
    resultLead.textContent =
      "All four stand in the same place, which should give a score of " +
      accurate(s).toFixed(2) + ". On the balanced questionnaire the person " +
      "who agrees with everything scores " + scoreFor(STYLES[1], s, true).toFixed(2) +
      "; on the unbalanced one, " + scoreFor(STYLES[1], s, false).toFixed(2) +
      ". The person who uses the ends scores " +
      scoreFor(STYLES[2], s, true).toFixed(2) + " and " +
      scoreFor(STYLES[2], s, false).toFixed(2) + " on the two versions, which " +
      "is barely any difference at all.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardSim = wb.root.querySelector("#card-sim");
    standingInput = wb.root.querySelector("#standing");
    keyingBtn = wb.root.querySelector("#keying");
    keyingValue = wb.root.querySelector("#keying-value");
    gridHead = wb.root.querySelector("#grid-head");
    gridBody = wb.root.querySelector("#grid-body");
    gridCaption = wb.root.querySelector("#grid-caption");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    sentence = wb.root.querySelector("#sentence");
    unbalanceBtn = wb.root.querySelector("#unbalance");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    standingInput.addEventListener("input", onSlide);
    standingInput.addEventListener("change", onSlide);
    keyingBtn.addEventListener("click", toggleKeying);
    unbalanceBtn.addEventListener("click", showUnbalanced);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      movesMade = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardSim);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      standingInput.value = "50";
      var output = wb.root.querySelector('output[for="standing"]');
      if (output) { output.textContent = "+50"; }
      setKeying(true, false);
    });

    setKeying(true, false);
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
