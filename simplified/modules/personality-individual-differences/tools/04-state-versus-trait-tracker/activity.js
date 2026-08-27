/**
 * One Moment, or the Whole Fortnight?  (Simplified Edition)
 *
 * Teaching job: a single observation measures a state, and the number you put
 * on a person's record is meant to be a trait. The distance between those two
 * things is the activity.
 *
 * The model is the one from the full State versus Trait Tracker, cut to two
 * people and a fixed seed:
 *
 *     observed(person, i) = trait(person) + z_i * withinPersonSd(person)
 *
 * Ada and Bo share a trait level of 62 and differ only in how far they move
 * about it: Ada's within-person SD is 4, Bo's is 17. Everything the learner
 * sees follows from that one difference.
 *
 *   - At one moment the two look twenty points apart. They are not.
 *   - The gap between the running averages collapses towards zero as moments
 *     are added, because it was sampling variation in a state, not a trait
 *     difference.
 *   - The spread of each person's readings does not collapse. It is a stable
 *     property of the person, and it is the one real difference between them.
 *
 * Deliberate simplifications, each stated on the page:
 *   - No measurement error term. Adding one would be more honest about real
 *     experience sampling but would give the learner two things that shrink
 *     with averaging and one that does not, which is a second lesson. The
 *     caution says the term exists and what it would do.
 *   - The trait does not drift. Over a fortnight that is defensible; over a
 *     year it is not, and the caution says so.
 *   - Readings are independent draws. Real momentary reports autocorrelate
 *     within a day, which would mean 56 readings carry less information than
 *     56 independent ones. That would make Bo converge even more slowly, so
 *     the demonstration understates its own point rather than overstating it.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var DAYS = 14;
  var PER_DAY = 4;
  var TOTAL = DAYS * PER_DAY;

  /* Fixed so the fortnight is the same in every classroom, and so the numbers
     quoted in the teaching notes stay true. Chosen, out of the seeds that
     produce the intended structure, for a first reading that is low for Bo
     without being the most extreme reading in the fortnight: a rigged-looking moment would let a
     learner dismiss the whole demonstration. */
  var SEED = 1939;

  var PEOPLE = [
    { key: "ada", name: "Ada", trait: 62, within: 4 },
    { key: "bo", name: "Bo", trait: 62, within: 17 }
  ];

  var COLOURS = { ada: "#1C7293", bo: "#9E7318" };

  /** mulberry32. Small, fast, and identical in every browser. */
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

  /** Box-Muller, in pairs, so a run of n draws is reproducible. */
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

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  /* Generated once. Nothing on the page changes the data; the slider changes
     only how much of it you are looking at. */
  var SERIES = (function () {
    var random = mulberry32(SEED);
    var out = {};
    PEOPLE.forEach(function (person) {
      /* Rounded because a self-report scale of 0 to 100 returns whole
         numbers, and because the moment shown in step 1 has to be the same
         number the running average is computed from. Displaying a rounded
         reading while averaging an unrounded one puts a gap of 20 on the card
         and 20.3 in the tile beside it. */
      out[person.key] = normals(random, TOTAL).map(function (z) {
        return Math.round(clamp(person.trait + z * person.within, 0, 100));
      });
    });
    return out;
  }());

  function mean(values) {
    var sum = 0;
    values.forEach(function (v) { sum += v; });
    return values.length ? sum / values.length : 0;
  }

  /** Sample SD, so it estimates the person's variability rather than
      describing only the readings in hand. Undefined below two readings. */
  function spreadOf(values) {
    if (values.length < 2) { return null; }
    var m = mean(values);
    var sum = 0;
    values.forEach(function (v) { sum += (v - m) * (v - m); });
    return Math.sqrt(sum / (values.length - 1));
  }

  function used(personKey, k) { return SERIES[personKey].slice(0, k); }
  function runningMean(personKey, k) { return mean(used(personKey, k)); }
  function gapAt(k) { return Math.abs(runningMean("ada", k) - runningMean("bo", k)); }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn;
  var cardFortnight, momentsInput, chart, chartDesc, readout, spreadLine;
  var allBtn, explainBtn, note, noteText, synthesis, resultLead;

  /* Two uses of the control, so the explanation follows the manipulation
     rather than replacing it. */
  var REVEAL_AFTER = 2;

  var answered = false;
  var movesMade = 0;

  function moments() { return Number(momentsInput.value); }

  var VERDICTS = {
    ada: {
      state: "incorrect",
      text: "That is what the reading says, and at 09:20 on Tuesday it was " +
        "true: Ada really was twenty points above Bo at that moment. The " +
        "question asked something else. One reading each cannot separate " +
        "what somebody is generally like from what kind of morning they are " +
        "having, and you are about to see which of those this was."
    },
    bo: {
      state: "incorrect",
      text: "You have decided the reading is unrepresentative, which is a " +
        "reasonable instinct, but you had nothing to base it on: 47 is not " +
        "an obviously odd number for a person to report. Reading a single " +
        "observation as an off moment is a guess in the opposite direction " +
        "from taking it at face value, and both need more moments."
    },
    cannot: {
      state: "correct",
      text: "Yes. One reading each tells you where two people were at 09:20, " +
        "which is a state. What goes on somebody's record as their typical " +
        "level is a trait, and a trait is a summary of many moments. The " +
        "fortnight below shows how far apart those two things were here."
    }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;

    Object.keys(VERDICTS).forEach(function (k) {
      if (k === key) {
        wb.choices.mark(options.querySelector('[data-choice="' + k + '"]'), VERDICTS[k].state);
      } else if (k === "cannot") {
        wb.choices.mark(options.querySelector('[data-choice="cannot"]'), "correct");
      }
    });
    wb.choices.lock(options);

    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded. You can now see the whole fortnight.");
  }

  function reveal() {
    wb.show(cardFortnight);
    render();
    wb.scrollTo(cardFortnight);
    wb.focus(momentsInput);
    wb.announce("The fortnight is shown. Move the slider to average more moments.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* Two stacked bands, one per person, on a shared 0 to 100 scale. Stacked
     rather than overlaid because the readings interleave constantly: overlaid,
     the two clouds of dots are one cloud, and the whole point is the shape of
     each cloud separately. */
  function render() {
    /* RIGHT stops well short of the 900 unit viewBox because each band's
       average line is labelled with its value just outside the plot, and that
       label needs room: at RIGHT = 858 it read "avera" and stopped. */
    var LEFT = 132, RIGHT = 752, TOP = 62, BAND = 152, GAP_Y = 40;
    var k = moments();

    wb.clearFigure(chart);
    var height = TOP + BAND * 2 + GAP_Y + 74;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (i) {
      return LEFT + (i / (TOTAL - 1)) * (RIGHT - LEFT);
    };

    PEOPLE.forEach(function (person, row) {
      var top = TOP + row * (BAND + GAP_Y);
      var bottom = top + BAND;
      var yOf = function (v) { return bottom - (v / 100) * BAND; };

      var name = svg("text", { x: 0, y: top - 10, class: "plot__label" });
      name.textContent = person.name;
      chart.appendChild(name);

      /* Scale ticks per band, because each band has its own vertical origin
         and a single axis down the side would be read as one scale. */
      [0, 50, 100].forEach(function (v) {
        chart.appendChild(svg("line", {
          x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
          class: "plot__axis", opacity: v === 50 ? 0.5 : 0.9
        }));
        var tick = svg("text", {
          x: LEFT - 10, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
        });
        tick.textContent = String(v);
        chart.appendChild(tick);
      });

      /* Every reading, with the included ones filled. Hollow rather than
         hidden: the readings you are not averaging still exist, and a learner
         who slides back to 1 should see what they have stopped using. */
      SERIES[person.key].forEach(function (value, i) {
        var inUse = i < k;
        chart.appendChild(svg("circle", {
          cx: xOf(i).toFixed(1), cy: yOf(value).toFixed(1), r: inUse ? 4.5 : 3.5,
          fill: inUse ? COLOURS[person.key] : "none",
          stroke: COLOURS[person.key],
          "stroke-width": inUse ? 0 : 1.4,
          opacity: inUse ? 1 : 0.45
        }));
      });

      var avg = runningMean(person.key, k);
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(avg).toFixed(1), x2: RIGHT, y2: yOf(avg).toFixed(1),
        stroke: COLOURS[person.key], "stroke-width": 3
      }));
      var label = svg("text", {
        x: RIGHT + 10, y: (yOf(avg) + 4).toFixed(1), class: "plot__sub", fill: COLOURS[person.key]
      });
      label.textContent = "average " + avg.toFixed(1);
      chart.appendChild(label);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 26).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Fourteen days, four readings a day, earliest on the left";
    chart.appendChild(axis);

    describe(k);
    readouts(k);
  }

  function describe(k) {
    var parts = PEOPLE.map(function (person) {
      var s = spreadOf(used(person.key, k));
      return person.name + " averages " + runningMean(person.key, k).toFixed(1) +
        " over the " + k + (k === 1 ? " moment" : " moments") + " included" +
        (s === null ? "" : " and the spread of those readings is " + s.toFixed(1)) +
        ". Across the whole fortnight " + person.name + " ranges from " +
        Math.round(Math.min.apply(null, SERIES[person.key])) + " to " +
        Math.round(Math.max.apply(null, SERIES[person.key])) + ".";
    });
    chartDesc.textContent =
      "Two bands on a shared scale of 0 to 100, one for each person, with one " +
      "dot per reading and a horizontal line at the average of the readings " +
      "included so far. " + parts.join(" ") +
      " The gap between the two averages is " + gapAt(k).toFixed(1) + " points.";
  }

  function readouts(k) {
    readout.textContent = "";
    var tiles = [
      { label: "Ada's average so far", value: runningMean("ada", k).toFixed(1),
        note: "over " + k + (k === 1 ? " moment" : " moments") },
      { label: "Bo's average so far", value: runningMean("bo", k).toFixed(1),
        note: "over the same " + k + (k === 1 ? " moment" : " moments") },
      { label: "Gap between them", value: gapAt(k).toFixed(1),
        note: k === 1 ? "on one moment each" : "it was " + gapAt(1).toFixed(1) + " on one moment each" }
    ];
    tiles.forEach(function (tile) {
      var li = global.document.createElement("li");
      li.className = "result";
      var l = global.document.createElement("p");
      l.className = "result__label";
      l.textContent = tile.label;
      var v = global.document.createElement("p");
      v.className = "result__value big";
      v.textContent = tile.value;
      var n = global.document.createElement("span");
      n.className = "result__note";
      n.textContent = tile.note;
      li.appendChild(l); li.appendChild(v); li.appendChild(n);
      readout.appendChild(li);
    });

    var sa = spreadOf(used("ada", k));
    var sb = spreadOf(used("bo", k));
    if (sa === null || sb === null) {
      spreadLine.textContent = "Add a second moment to see how far each of " +
        "them moves about.";
    } else {
      spreadLine.textContent = "Spread of the readings you are averaging: " +
        "Ada " + sa.toFixed(1) + ", Bo " + sb.toFixed(1) + ". The gap between " +
        "the averages shrinks as you add moments. This does not.";
    }
  }

  /* ------------------------------------------------------------- guidance */

  function allMoments() {
    momentsInput.value = String(TOTAL);
    /* Pressing this is a complete use of the mechanism, so it should unlock
       the explanation on its own rather than leaving a learner who used the
       guided route one slider nudge short of it. */
    movesMade = REVEAL_AFTER;
    onSlide();
    var sa = spreadOf(used("ada", TOTAL));
    var sb = spreadOf(used("bo", TOTAL));
    noteText.textContent =
      "On one moment each, Ada was " + gapAt(1).toFixed(1) + " points above " +
      "Bo. On all fifty-six, " +
      "the two averages are " + runningMean("ada", TOTAL).toFixed(1) + " and " +
      runningMean("bo", TOTAL).toFixed(1) + ", a gap of " +
      gapAt(TOTAL).toFixed(1) + " points. There was never a difference in " +
      "typical level to find. What is left is the difference that did not go " +
      "away: Ada's readings have a spread of " + sa.toFixed(1) + " and Bo's " +
      "of " + sb.toFixed(1) + ". Averaging is the right way to estimate a " +
      "typical level and it is also what deletes that difference from the " +
      "record.";
    wb.show(note);
    wb.announce("Averaging all fifty-six moments. The gap is now " +
      gapAt(TOTAL).toFixed(1) + " points.");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="moments"]');
    if (output) { output.textContent = momentsInput.value; }
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var k = moments();
    resultLead.textContent =
      "Averaging " + k + (k === 1 ? " moment" : " moments") + " puts Ada at " +
      runningMean("ada", k).toFixed(1) + " and Bo at " +
      runningMean("bo", k).toFixed(1) + ", a gap of " + gapAt(k).toFixed(1) +
      " points, against " + gapAt(1).toFixed(1) + " points on the single " +
      "reading you started with.";
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
    cardFortnight = wb.root.querySelector("#card-fortnight");
    momentsInput = wb.root.querySelector("#moments");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    readout = wb.root.querySelector("#readout");
    spreadLine = wb.root.querySelector("#spread");
    allBtn = wb.root.querySelector("#all");
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
    momentsInput.addEventListener("input", onSlide);
    momentsInput.addEventListener("change", onSlide);
    allBtn.addEventListener("click", allMoments);
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
      wb.hide(cardFortnight);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      momentsInput.value = "1";
      var output = wb.root.querySelector('output[for="moments"]');
      if (output) { output.textContent = "1"; }
      render();
    });

    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
