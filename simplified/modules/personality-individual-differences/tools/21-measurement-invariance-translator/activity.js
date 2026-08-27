/**
 * The Same Difference, Twice Over  (Simplified Edition)
 *
 * Teaching job: an observed mean difference between two groups is compatible
 * with a real difference in the trait and with no difference at all, and the
 * total score cannot distinguish them. Testing measurement invariance is how
 * you tell, which is why it comes before the comparison.
 *
 * The model is the one from the full Measurement-Invariance Translator. For
 * group g and item i the expected answer is
 *
 *     mean(i, g) = intercept(i, g) + loading(i) * latentMean(g)
 *
 * Loadings are equal across the groups throughout, so metric invariance always
 * holds here and a unit of the trait is worth the same in both groups. Group A
 * is the reference, with a latent mean of zero. Everything the learner moves
 * lives in two places: the intercept of item 3 in group B, and group B's
 * latent mean.
 *
 * THE ONE CONTROL. The activity holds the OBSERVED scale-mean difference fixed
 * at 0.20 and moves it between two sources. Writing D for that difference, and
 * with four items,
 *
 *     D = delta / 4 + (sum of loadings / 4) * latentMean(B)
 *
 * where delta is the extra intercept on item 3 in group B. A blend b in [0, 1]
 * then sets
 *
 *     latentMean(B) = b * D / (sum of loadings / 4)
 *     delta         = 4 * (1 - b) * D
 *
 * so that D is constant by construction. At b = 0 the groups are identical on
 * the trait and one item is easier to endorse; at b = 1 every item behaves
 * identically and group B really stands higher. The two ends are
 * indistinguishable in the total and completely different in what is true.
 *
 * WHAT THE FIGURE SHOWS. Each item's observed group difference is
 *
 *     delta_i + loading(i) * latentMean(B)
 *
 * which is delta on item 3 alone at b = 0, and a spread across all four items
 * in proportion to their loadings at b = 1. The four bars always sum to 4D.
 * That shape is exactly what an invariance test inspects, and it is the only
 * thing on the page that changes.
 *
 * Deliberate simplifications, stated in the caution:
 *   - Parameters are set, not estimated, with no sampling error. A real
 *     invariance test compares nested models and returns a degree of
 *     confidence rather than a fact.
 *   - Only one item's intercept can differ, so partial invariance across
 *     several items is not represented.
 *   - Loadings never differ, so metric invariance is never at stake. The full
 *     version walks the whole ladder.
 *
 * On the groups: they are A and B, they have no nationality, ethnicity,
 * language, region or culture, and the reason an item might behave differently
 * is given as a property of a setting rather than of a people. The page opens
 * with that statement and it is not decoration.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var ITEMS = [
    { name: "I make my views known in a meeting.", loading: 1.00, intercept: 3.2 },
    { name: "I ask for what I need without apologising for it.", loading: 0.90, intercept: 3.0 },
    { name: "I speak up when I disagree in a group.", loading: 1.10, intercept: 3.4, movable: true },
    { name: "I begin a conversation with someone I have not met.", loading: 0.95, intercept: 3.1 }
  ];

  /* The observed difference in scale means, held fixed. 0.20 on a 1 to 5
     scale: small enough to be ordinary, large enough to be significant in the
     sample the opening judgement describes. */
  var OBSERVED_DIFFERENCE = 0.20;

  /* Two intercepts count as equal below this. Any such threshold is a
     convention; this one is small enough that only an exact match passes. */
  var TOLERANCE = 0.005;

  function meanLoading() {
    var sum = 0;
    ITEMS.forEach(function (item) { sum += item.loading; });
    return sum / ITEMS.length;
  }

  /** Group B's latent mean at this blend. Group A's is zero by definition. */
  function latentMeanB(blend) {
    return blend * OBSERVED_DIFFERENCE / meanLoading();
  }

  /** The extra intercept carried by the movable item in group B. */
  function delta(blend) {
    return ITEMS.length * (1 - blend) * OBSERVED_DIFFERENCE;
  }

  function interceptFor(item, group, blend) {
    if (group === "A" || !item.movable) { return item.intercept; }
    return item.intercept + delta(blend);
  }

  function itemMean(item, group, blend) {
    var latent = group === "A" ? 0 : latentMeanB(blend);
    return interceptFor(item, group, blend) + item.loading * latent;
  }

  function itemDifference(item, blend) {
    return itemMean(item, "B", blend) - itemMean(item, "A", blend);
  }

  function scaleMean(group, blend) {
    var sum = 0;
    ITEMS.forEach(function (item) { sum += itemMean(item, group, blend); });
    return sum / ITEMS.length;
  }

  function scalarHolds(blend) {
    return ITEMS.every(function (item) {
      return Math.abs(interceptFor(item, "B", blend) - interceptFor(item, "A", blend)) < TOLERANCE;
    });
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardSim;
  var blendInput, readout, chart, chartDesc, paramsBody, sentence;
  var allRealBtn, explainBtn, note, noteText, synthesis, resultLead;

  var REVEAL_AFTER = 2;
  var answered = false;
  var movesMade = 0;

  function blend() { return Number(blendInput.value) / 100; }

  var VERDICTS = {
    nothing: { state: "correct", text:
      "Correct. A difference in observed scores is a difference in what the " +
      "two groups did with the questionnaire. Turning that into a claim about " +
      "how assertive they are requires the items to mean the same thing in " +
      "both groups, and that is a separate question with its own evidence. " +
      "The translator below shows why it cannot be skipped." },
    real: { state: "incorrect", text:
      "Significance is not the missing piece. It tells you the difference in " +
      "observed scores is unlikely to be a fluke of sampling, and with " +
      "several thousand people it would be significant whatever produced it. " +
      "What it cannot tell you is whether the scores mean the same thing in " +
      "the two groups, and the translator below produces exactly this " +
      "difference twice over, once with a real difference in assertiveness " +
      "and once with none at all." },
    biased: { state: "incorrect", text:
      "This is the opposite error and it is made just as often. A group " +
      "difference on a questionnaire is not evidence that the questionnaire " +
      "is biased, any more than it is evidence that the groups differ. Both " +
      "readings jump from an observed number to a conclusion that the number " +
      "on its own cannot support." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "nothing") {
      wb.choices.mark(options.querySelector('[data-choice="nothing"]'), "correct");
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
    wb.focus(blendInput);
    wb.announce("The translator is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 150, RIGHT = 730, TOP = 58, ROW = 52;
  var BAR = "#1C7293";
  var BAR_BIAS = "#9E7318";

  /* The axis has to reach the largest bar any blend can produce, which is the
     whole difference landing on one item, or the figure would rescale as the
     slider moved and the bars would look the same at every setting. */
  var MAX_BAR = ITEMS.length * OBSERVED_DIFFERENCE;

  function render() {
    var b = blend();
    wb.clearFigure(chart);
    var height = TOP + ITEMS.length * ROW + 66;
    chart.setAttribute("viewBox", "0 0 900 " + height);

    var xOf = function (v) { return LEFT + (v / MAX_BAR) * (RIGHT - LEFT); };

    [0, 0.2, 0.4, 0.6, 0.8].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: xOf(v).toFixed(1), y1: TOP - 18, x2: xOf(v).toFixed(1),
        y2: (TOP + ITEMS.length * ROW - 18).toFixed(1),
        class: "plot__axis", opacity: v === 0 ? 0.9 : 0.5
      }));
      var tick = svg("text", {
        x: xOf(v).toFixed(1), y: TOP - 26, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = v.toFixed(1);
      chart.appendChild(tick);
    });

    ITEMS.forEach(function (item, i) {
      var y = TOP + i * ROW;
      var label = svg("text", { x: 0, y: (y + 4).toFixed(1), class: "plot__sub" });
      label.textContent = "Item " + (i + 1) + (item.movable ? ", speaking up" : "");
      chart.appendChild(label);

      var d = itemDifference(item, b);
      var biased = Math.abs(interceptFor(item, "B", b) - item.intercept) >= TOLERANCE;
      chart.appendChild(svg("rect", {
        x: LEFT, y: (y - 13).toFixed(1),
        width: Math.max(0, xOf(d) - LEFT).toFixed(1), height: 26,
        fill: biased ? BAR_BIAS : BAR
      }));
      var value = svg("text", {
        x: (RIGHT + 22).toFixed(1), y: (y + 4).toFixed(1),
        class: "plot__sub", fill: biased ? BAR_BIAS : BAR
      });
      /* The word, not only the colour, says which kind of bar this is. */
      value.textContent = d.toFixed(2) + (biased ? ", from the item" : "");
      chart.appendChild(value);
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: (height - 22).toFixed(1),
      "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "How much higher group B scores on this item";
    chart.appendChild(axis);

    describe(b);
    readouts(b);
    params(b);
  }

  function describe(b) {
    var parts = ITEMS.map(function (item, i) {
      return "item " + (i + 1) + " " + itemDifference(item, b).toFixed(2);
    });
    chartDesc.textContent =
      "Four horizontal bars, one per item, showing how much higher group B " +
      "scores on each: " + parts.join(", ") + ". They add to " +
      (ITEMS.length * OBSERVED_DIFFERENCE).toFixed(2) + ", which is the same " +
      "total at every setting of the slider, so the two groups' scale means " +
      "stay at " + scaleMean("A", b).toFixed(2) + " and " +
      scaleMean("B", b).toFixed(2) + ". At this setting " +
      (b === 0
        ? "the whole difference sits on item 3 and the groups do not differ on the trait at all."
        : (b === 1
          ? "every item carries a share in proportion to its loading, and no item behaves differently."
          : "part of the difference sits on item 3 and the rest is spread across all four."));
  }

  function tile(label, value, noteText, state) {
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
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function readouts(b) {
    readout.textContent = "";
    readout.appendChild(tile(
      "Observed difference in scale means",
      scaleMean("B", b).toFixed(2) + " against " + scaleMean("A", b).toFixed(2),
      "identical at every setting of the slider"
    ));
    readout.appendChild(tile(
      "Real difference in the trait", latentMeanB(b).toFixed(2),
      b === 0 ? "the two groups stand in exactly the same place"
        : "in units of the latent trait, where group A sits at 0"
    ));
    var holds = scalarHolds(b);
    readout.appendChild(tile(
      "Can the means be compared?", holds ? "yes" : "no",
      holds ? "every intercept matches, so scalar invariance holds"
        : "item 3's intercept differs, so scalar invariance fails",
      holds ? "correct" : "incorrect"
    ));
  }

  function params(b) {
    paramsBody.textContent = "";
    ITEMS.forEach(function (item, i) {
      var tr = global.document.createElement("tr");
      var same = Math.abs(interceptFor(item, "B", b) - item.intercept) < TOLERANCE;
      [
        "Item " + (i + 1) + ". " + item.name,
        item.loading.toFixed(2),
        interceptFor(item, "A", b).toFixed(2),
        interceptFor(item, "B", b).toFixed(2),
        same ? "yes" : "no, easier to endorse in group B"
      ].forEach(function (text, col) {
        var cell = global.document.createElement(col === 0 ? "th" : "td");
        if (col === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        tr.appendChild(cell);
      });
      paramsBody.appendChild(tr);
    });

    sentence.textContent = b === 0
      ? "As it stands, the two groups are identical on assertiveness and the " +
        "whole of the observed difference comes from one item being easier to " +
        "endorse where speaking up is invited rather than costly."
      : (b === 1
        ? "As it stands, every item behaves identically in the two groups and " +
          "the whole of the observed difference is a real difference in " +
          "assertiveness. The scale means are the same two numbers as before."
        : "As it stands, " + Math.round(b * 100) + " per cent of the observed " +
          "difference is a real difference in assertiveness and the rest comes " +
          "from item 3. The scale means are the same two numbers as before.");
  }

  /* ------------------------------------------------------------- guidance */

  function allReal() {
    blendInput.value = "100";
    movesMade = REVEAL_AFTER;
    onSlide();
    noteText.textContent =
      "Group B now genuinely stands " + latentMeanB(1).toFixed(2) +
      " higher on the trait, every item behaves identically in both groups, " +
      "and the two scale means are " + scaleMean("A", 1).toFixed(2) + " and " +
      scaleMean("B", 1).toFixed(2) + ". Those are the same two numbers you " +
      "started with, when the groups did not differ at all. A researcher " +
      "holding only the totals sees one number in both situations and has no " +
      "way to tell which one they are in. The bars are what changed, and the " +
      "bars are what an invariance test looks at.";
    wb.show(note);
    wb.announce("The whole difference is now real. The scale means are unchanged at " +
      scaleMean("A", 1).toFixed(2) + " and " + scaleMean("B", 1).toFixed(2) + ".");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="blend"]');
    if (output) { output.textContent = blendInput.value + "%"; }
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var b = blend();
    resultLead.textContent =
      "At every setting group B averages " + scaleMean("B", b).toFixed(2) +
      " and group A averages " + scaleMean("A", b).toFixed(2) + ". The real " +
      "difference in the trait behind those two numbers is anywhere between " +
      latentMeanB(0).toFixed(2) + " and " + latentMeanB(1).toFixed(2) +
      ", and it is currently " + latentMeanB(b).toFixed(2) + ".";
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
    blendInput = wb.root.querySelector("#blend");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    paramsBody = wb.root.querySelector("#params-body");
    sentence = wb.root.querySelector("#sentence");
    allRealBtn = wb.root.querySelector("#allreal");
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
    blendInput.addEventListener("input", onSlide);
    blendInput.addEventListener("change", onSlide);
    allRealBtn.addEventListener("click", allReal);
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
      blendInput.value = "0";
      var output = wb.root.querySelector('output[for="blend"]');
      if (output) { output.textContent = "0%"; }
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
