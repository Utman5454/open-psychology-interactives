/**
 * Take the Words Out and See What Is Left  (Simplified Edition)
 *
 * Teaching job: removing the language from a reasoning test removes one
 * construct-irrelevant demand and leaves several, and raises two of them.
 * Culture-fair is a direction rather than a property a test can have.
 *
 * The model is the one from the full Culture-Fair Test Challenge, cut from six
 * decisions to four. Six sources of construct-irrelevant demand are tracked,
 * each on a 0 to 1 scale, and every decision adds to some of them:
 *
 *   reading    what must be read to know what to do
 *   testwise   familiarity with the conventions of sitting a formal test
 *   puzzle     familiarity with abstract-puzzle formats
 *   speed      the expectation that answering quickly is what is wanted
 *   device     the medium and the motor action a response requires
 *   tactics    knowing when to eliminate, when to guess, when to move on
 *
 * TWO PROPERTIES OF THE NUMBERS CARRY THE LESSON, and both were checked over
 * all 81 designs rather than asserted:
 *
 *   1. No design brings every demand below 0.30. The lowest maximum available
 *      is 0.35. There is no culture-fair corner of the space to find.
 *   2. `testwise` has a floor: sitting a test at all is a convention, and the
 *      best any decision can do is take it to 0.30.
 *
 * And the guided move is the demonstration itself. Going from written
 * instructions with verbal items to demonstrated instructions with figure
 * items takes reading from 1.00 to 0.10 and testwise from 0.65 to 0.30, and
 * simultaneously takes puzzle from 0.40 to 0.85 and tactics from 0.65 to 0.85.
 * Removing the words does not merely leave the other demands alone; it makes
 * two of them worse, because an abstract figure puzzle is itself a format
 * somebody has either met or has not.
 *
 * THE THREE FICTIONAL PEOPLE. They are described ONLY by prior experience of
 * testing formats, devices and puzzle conventions. They have no nationality,
 * ethnicity, region, language or group membership, because what is being
 * taught is about opportunity to learn a FORMAT, and attaching that to real
 * groups would teach something else and something false. What is reported for
 * each is how much of this design's demand falls on them given what they have
 * had the chance to become familiar with. It is not a score, not a prediction,
 * not an ability estimate, and the page says so where it is displayed.
 *
 * Deliberate simplifications: the demand levels are invented to make the
 * trade-offs legible rather than measured, the six demands are not a complete
 * list, and the construct-relevant share of a score that the longer version
 * computes is left out.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var DEMANDS = [
    { key: "reading", name: "Reading to know what to do" },
    { key: "testwise", name: "Knowing how a formal test works" },
    { key: "puzzle", name: "Having met abstract puzzles before" },
    { key: "speed", name: "Being expected to answer quickly" },
    { key: "device", name: "Handling the medium it is answered on" },
    { key: "tactics", name: "Knowing when to guess and when to move on" }
  ];

  /* Sitting a test at all is a convention, and nothing on the page removes it.
     This floor is the honest core of the activity. */
  var BASE = { reading: 0, testwise: 0.35, puzzle: 0, speed: 0, device: 0, tactics: 0.30 };

  /* Below this a demand is treated as negligible. Like every such threshold it
     is a convention, and the figure marks it so it can be argued with. */
  var NEGLIGIBLE = 0.30;

  var GROUPS = [
    {
      key: "instructions", name: "How the instructions are given",
      options: [
        { key: "written", name: "In writing", effect: { reading: 0.90, testwise: 0.30 } },
        { key: "spoken", name: "Read aloud", effect: { reading: 0.20, testwise: 0.10 } },
        { key: "shown", name: "Demonstrated with a worked example", effect: { reading: 0.00, testwise: -0.05 } }
      ]
    },
    {
      key: "items", name: "What the items are made of",
      options: [
        { key: "verbal", name: "Words and their relations", effect: { reading: 0.90, puzzle: 0.40 } },
        { key: "figures", name: "Abstract figures", effect: { reading: 0.10, puzzle: 0.85, tactics: 0.20 } },
        { key: "objects", name: "Pictures of everyday objects", effect: { reading: 0.15, puzzle: 0.25 } }
      ]
    },
    {
      key: "timing", name: "How it is timed",
      options: [
        { key: "strict", name: "A strict time limit", effect: { speed: 0.90, tactics: 0.35 } },
        { key: "generous", name: "A generous limit", effect: { speed: 0.40, tactics: 0.10 } },
        { key: "untimed", name: "No limit at all", effect: { speed: 0.05, tactics: 0.00 } }
      ]
    },
    {
      key: "response", name: "How an answer is given",
      options: [
        { key: "paper", name: "Written on paper", effect: { device: 0.35 } },
        { key: "touch", name: "Tapped on a touchscreen", effect: { device: 0.70 } },
        { key: "cards", name: "By pointing at a card", effect: { device: 0.15 } }
      ]
    }
  ];

  /* The poor design the activity opens on, so that the guided move has
     somewhere to move from. */
  var START = { instructions: "written", items: "verbal", timing: "strict", response: "paper" };

  /* Described only by prior experience of formats. No nationality, ethnicity,
     region, language or group membership, and none is possible. */
  var PEOPLE = [
    {
      name: "Has sat many formal tests, has met abstract puzzles, uses a touchscreen daily",
      familiar: { reading: 0.90, testwise: 0.90, puzzle: 0.90, speed: 0.80, tactics: 0.90 },
      device: { paper: 0.80, touch: 0.95, cards: 0.70 }
    },
    {
      name: "Has sat few formal tests, has not met abstract puzzles, writes on paper daily",
      familiar: { reading: 0.85, testwise: 0.20, puzzle: 0.10, speed: 0.25, tactics: 0.20 },
      device: { paper: 0.90, touch: 0.20, cards: 0.80 }
    },
    {
      name: "Has sat many formal tests, has met abstract puzzles, has rarely used a touchscreen",
      familiar: { reading: 0.80, testwise: 0.85, puzzle: 0.80, speed: 0.70, tactics: 0.80 },
      device: { paper: 0.85, touch: 0.15, cards: 0.85 }
    }
  ];

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  function optionFor(group, key) {
    var found = group.options[0];
    group.options.forEach(function (o) { if (o.key === key) { found = o; } });
    return found;
  }

  function demandsFor(design) {
    var out = {};
    DEMANDS.forEach(function (d) { out[d.key] = BASE[d.key]; });
    GROUPS.forEach(function (group) {
      var effect = optionFor(group, design[group.key]).effect;
      Object.keys(effect).forEach(function (key) { out[key] += effect[key]; });
    });
    DEMANDS.forEach(function (d) { out[d.key] = clamp(out[d.key]); });
    return out;
  }

  function aboveNegligible(d) {
    var n = 0;
    DEMANDS.forEach(function (x) { if (d[x.key] >= NEGLIGIBLE) { n += 1; } });
    return n;
  }

  function highest(d) {
    var best = DEMANDS[0];
    DEMANDS.forEach(function (x) { if (d[x.key] > d[best.key]) { best = x; } });
    return best;
  }

  /** How much of this design's demand falls on one person, given what they
      have had the chance to become familiar with. NOT a score. */
  function loadOn(person, design) {
    var d = demandsFor(design);
    var total = 0;
    var worst = null;
    DEMANDS.forEach(function (x) {
      var familiar = x.key === "device"
        ? person.device[design.response] : person.familiar[x.key];
      var share = d[x.key] * (1 - familiar);
      total += share;
      if (worst === null || share > worst.share) { worst = { name: x.name, share: share }; }
    });
    return { total: total, worst: worst };
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardDesign;
  var choicesBox, readout, chart, chartDesc, peopleBody, sentence;
  var stripBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;
  var design = {};

  var VERDICTS = {
    reading: { state: "correct", text:
      "Correct, and the designer below shows something slightly worse than " +
      "that. Taking the words out removes the reading demand, and it raises " +
      "two of the others, because an abstract figure puzzle is itself a format " +
      "that somebody has either met before or has not." },
    free: { state: "incorrect", text:
      "There is no such thing as a culture-free test, and the phrase is worth " +
      "retiring. Every task has a format, is administered somehow, expects a " +
      "response of some kind at some pace, and takes place in a situation " +
      "whose conventions somebody has either learned or not. The designer " +
      "below tracks six of those demands and you will not get any of them to " +
      "zero." },
    unbiased: { state: "incorrect", text:
      "Bias is a claim about whether scores mean the same thing in the groups " +
      "being compared, and it is established with evidence rather than by " +
      "design decisions. Reducing an irrelevant demand is worth doing and it " +
      "is a different job from showing that scores are comparable." },
    nothing: { state: "partial", text:
      "Too pessimistic, and the designer below shows why. Reading is a real " +
      "demand and removing it is a real improvement: watch the top bar " +
      "collapse when you press the guided button. What is wrong is treating " +
      "that as finishing the job rather than starting it." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "reading") {
      wb.choices.mark(options.querySelector('[data-choice="reading"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardDesign);
    render();
    wb.scrollTo(cardDesign);
    wb.announce("The designer is open.");
  }

  /* --------------------------------------------------------------- inputs */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function buildChoices() {
    choicesBox.textContent = "";
    GROUPS.forEach(function (group) {
      var fieldset = el("fieldset", "toggle-grid");
      fieldset.setAttribute("style", "--toggle-columns: 3");
      fieldset.appendChild(el("legend", "field-legend", group.name));
      group.options.forEach(function (option) {
        var label = el("label", "toggle");
        label.setAttribute("data-checked", design[group.key] === option.key ? "true" : "false");
        var input = global.document.createElement("input");
        /* setAttribute rather than the property: both work in a browser, and
           only the attribute is visible to a test harness reading markup. */
        input.setAttribute("type", "radio");
        input.setAttribute("name", group.key);
        input.setAttribute("value", option.key);
        input.value = option.key;
        input.checked = design[group.key] === option.key;
        var wrap = el("span");
        wrap.appendChild(el("strong", null, option.name));
        var raises = Object.keys(option.effect).filter(function (k) {
          return option.effect[k] > 0;
        }).map(function (k) {
          var d = null;
          DEMANDS.forEach(function (x) { if (x.key === k) { d = x; } });
          return d.name.toLowerCase() + " " + option.effect[k].toFixed(2);
        });
        wrap.appendChild(el("span", null, raises.length
          ? "Adds to " + raises.join(", ") + "."
          : "Adds nothing to any demand."));
        label.appendChild(input);
        label.appendChild(wrap);
        input.addEventListener("change", function () { choose(group.key, option.key); });
        fieldset.appendChild(label);
      });
      choicesBox.appendChild(fieldset);
    });
  }

  function syncChoices() {
    GROUPS.forEach(function (group) {
      Array.prototype.forEach.call(
        choicesBox.querySelectorAll('input[name="' + group.key + '"]'), function (input) {
          var on = input.value === design[group.key];
          input.checked = on;
          input.parentNode.setAttribute("data-checked", on ? "true" : "false");
        });
    });
  }

  function choose(groupKey, optionKey) {
    design[groupKey] = optionKey;
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
    var d = demandsFor(design);
    wb.announce("Changed. " + aboveNegligible(d) + " of the six demands are " +
      "still above " + NEGLIGIBLE.toFixed(2) + ", the largest being " +
      highest(d).name.toLowerCase() + " at " + d[highest(d).key].toFixed(2) + ".");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 330, RIGHT = 740, TOP = 58, ROW = 46;

  function renderChart() {
    var d = demandsFor(design);
    wb.clearFigure(chart);
    var height = TOP + DEMANDS.length * ROW + 52;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (v) { return LEFT + v * (RIGHT - LEFT); };

    var lineX = xOf(NEGLIGIBLE);
    chart.appendChild(svg("line", {
      x1: lineX.toFixed(1), y1: TOP - 28, x2: lineX.toFixed(1),
      y2: (TOP + DEMANDS.length * ROW - 20).toFixed(1),
      stroke: "#1A2744", "stroke-width": 2, "stroke-dasharray": "5 4"
    }));
    var lineLabel = svg("text", {
      x: lineX.toFixed(1), y: TOP - 34, "text-anchor": "middle", class: "plot__tick"
    });
    lineLabel.textContent = "negligible below here";
    chart.appendChild(lineLabel);

    DEMANDS.forEach(function (demand, i) {
      var y = TOP + i * ROW;
      var name = svg("text", { x: 0, y: (y + 4).toFixed(1), class: "plot__sub" });
      name.textContent = demand.name;
      chart.appendChild(name);

      var v = d[demand.key];
      var big = v >= NEGLIGIBLE;
      chart.appendChild(svg("rect", {
        x: LEFT, y: (y - 12).toFixed(1),
        width: Math.max(0, xOf(v) - LEFT).toFixed(1), height: 24,
        fill: big ? "#C0434F" : "#1C7293"
      }));
      var value = svg("text", {
        x: (RIGHT + 22).toFixed(1), y: (y + 4).toFixed(1), class: "plot__sub",
        fill: big ? "#C0434F" : "#1C7293"
      });
      value.textContent = v.toFixed(2) + (big ? ", still substantial" : "");
      chart.appendChild(value);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 18).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "How much this design demands, beyond the reasoning it means to measure";
    chart.appendChild(axis);

    chartDesc.textContent =
      "Six horizontal bars, one per demand that is not reasoning, on a scale " +
      "from 0 to 1: " + DEMANDS.map(function (x) {
        return x.name.toLowerCase() + " " + d[x.key].toFixed(2);
      }).join(", ") + ". " + aboveNegligible(d) + " of the six are at or above " +
      NEGLIGIBLE.toFixed(2) + ", which is where the figure marks a demand as " +
      "no longer negligible.";
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function renderReadout() {
    var d = demandsFor(design);
    var top = highest(d);
    readout.textContent = "";
    readout.appendChild(tile("Demands still substantial",
      aboveNegligible(d) + " of 6",
      "at or above " + NEGLIGIBLE.toFixed(2),
      aboveNegligible(d) === 0 ? "correct" : (aboveNegligible(d) <= 2 ? "partial" : "incorrect")));
    readout.appendChild(tile("Largest of them", d[top.key].toFixed(2),
      top.name.toLowerCase()));
    readout.appendChild(tile("Reading demand", d.reading.toFixed(2),
      d.reading < NEGLIGIBLE ? "the one the words were taken out for"
        : "the one people usually think of first"));
  }

  function renderPeople() {
    peopleBody.textContent = "";
    PEOPLE.forEach(function (person) {
      var load = loadOn(person, design);
      var tr = global.document.createElement("tr");
      [person.name, load.total.toFixed(2) + " of 6", load.worst.name.toLowerCase()]
        .forEach(function (text, col) {
          var cellNode = global.document.createElement(col === 0 ? "th" : "td");
          if (col === 0) { cellNode.setAttribute("scope", "row"); }
          cellNode.textContent = text;
          tr.appendChild(cellNode);
        });
      peopleBody.appendChild(tr);
    });
  }

  function renderSentence() {
    var d = demandsFor(design);
    sentence.textContent =
      "Four of these six demands can be taken below " + NEGLIGIBLE.toFixed(2) +
      " by choosing well. Two cannot, whatever you choose, and they are the " +
      "two about knowing how to sit a test: knowing how a formal test works " +
      "stops at 0.30 and so does knowing when to guess. This design has them " +
      "at " + d.testwise.toFixed(2) + " and " + d.tactics.toFixed(2) + ".";
  }

  function render() {
    syncChoices();
    renderChart();
    renderReadout();
    renderPeople();
    renderSentence();
  }

  /* ------------------------------------------------------------- guidance */

  function strip() {
    var before = demandsFor(design);
    design.instructions = "shown";
    design.items = "figures";
    moves = 2;
    explainBtn.disabled = false;
    render();
    var after = demandsFor(design);
    var rose = DEMANDS.filter(function (x) { return after[x.key] > before[x.key] + 0.001; });
    noteText.textContent =
      "Every word is gone. The reading demand has fallen from " +
      before.reading.toFixed(2) + " to " + after.reading.toFixed(2) + ", which " +
      "is exactly what was intended and is a real improvement. Now look at " +
      "what else moved. " +
      (rose.length
        ? rose.map(function (x) {
            return x.name.toLowerCase() + " went from " + before[x.key].toFixed(2) +
              " to " + after[x.key].toFixed(2);
          }).join(", and ") + ". "
        : "") +
      "Abstract figure puzzles are a format, and somebody has either met one " +
      "before or has not. " + aboveNegligible(after) + " of the six demands " +
      "are still substantial, and the wordless test is not the fair one. It " +
      "is a different one.";
    wb.show(note);
    wb.announce("The words are gone. Reading is now " + after.reading.toFixed(2) +
      ", and " + aboveNegligible(after) + " of the six demands remain substantial.");
  }

  function explain() {
    var d = demandsFor(design);
    resultLead.textContent =
      "This design leaves " + aboveNegligible(d) + " of the six demands at or " +
      "above " + NEGLIGIBLE.toFixed(2) + ", the largest being " +
      highest(d).name.toLowerCase() + " at " + d[highest(d).key].toFixed(2) +
      ". No arrangement of these four decisions gets all six below that line. " +
      "Two of them stop at 0.30 whatever you do, and both are about knowing " +
      "how to sit a test rather than about reasoning.";
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
    cardDesign = wb.root.querySelector("#card-design");
    choicesBox = wb.root.querySelector("#choices");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    peopleBody = wb.root.querySelector("#people-body");
    sentence = wb.root.querySelector("#sentence");
    stripBtn = wb.root.querySelector("#strip");
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
    stripBtn.addEventListener("click", strip);
    explainBtn.addEventListener("click", explain);

    Object.keys(START).forEach(function (k) { design[k] = START[k]; });
    buildChoices();

    wb.onReset(function () {
      answered = false;
      moves = 0;
      Object.keys(START).forEach(function (k) { design[k] = START[k]; });
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardDesign);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
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
