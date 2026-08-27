/* =========================================================================
   Two Things Called Attention — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/cognitive/tools/12-human-vs-ai-attention/

   TEACHING JOB
   ------------
   Human attention and the operation called attention inside a language model
   share a name and very little else, and a weight distribution over words is
   not by itself an explanation of anything.

   WHAT IS PRESERVED
   -----------------
   The three stages of the original and, above all, the hand computation. The
   learner works the weights out themselves rather than being shown them,
   because the whole point is how mechanical the operation is, and being told
   that does not land in the way that dividing five numbers by their total
   does.

   THE ARITHMETIC, DELIBERATELY SIMPLIFIED AND SAID SO
   ---------------------------------------------------
       weight_i = score_i / SUM score

   A real model exponentiates before normalising, works over far more tokens,
   and runs many such weightings in parallel at every layer. Plain division
   keeps the arithmetic doable in the head while preserving the property that
   matters here: the weights are a normalised comparison, they sum to one
   because they were divided by their total, and nothing in the operation
   knows what a trophy is. The caution states all of this rather than leaving
   a learner with the impression they have implemented a transformer.

   THE SCORES ARE INVENTED
   -----------------------
   They are chosen to make one point visible: the weight does not land
   overwhelmingly on the referent. It spreads across several words including
   ones carrying no referential content at all. That is what a similarity
   reweighting looks like, and it is why reading a referent off a weight
   distribution is a mistake.

   WHAT IS NOT CLAIMED
   -------------------
   Not that models fail on this sentence: current models usually resolve it.
   Not that attention weights never inform anything: whether they explain
   outputs is genuinely disputed and the caution says so rather than taking a
   side. The claim is about mechanism.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  /* Invented scores for a five-word illustration. */
  var TOKENS = [
    { word: "trophy", score: 9 },
    { word: "suitcase", score: 6 },
    { word: "because", score: 3 },
    { word: "was", score: 4 },
    { word: "big", score: 8 }
  ];
  var TOTAL = TOKENS.reduce(function (a, t) { return a + t.score; }, 0);

  var REFERENTS = [
    { key: "trophy", label: "The trophy was too big" },
    { key: "suitcase", label: "The suitcase was too big" }
  ];

  var TOTAL_OPTIONS = [24, 28, 30, 34];

  var CLAIMS = [
    {
      id: "numbers",
      text: "Produces a number for every word in the sentence saying how much that word counts here.",
      answer: "model",
      why: "That is exactly what you computed in stage two, and it is not " +
        "anything you did in stage one. You did not assign a value to the word " +
        "because."
    },
    {
      id: "right",
      text: "Can arrive at the right answer.",
      answer: "both",
      why: "You did, and current models usually do too. Getting the answer " +
        "right is not what separates them."
    },
    {
      id: "inspect",
      text: "Can be examined afterwards to see exactly which words were weighted and by how much.",
      answer: "model",
      why: "The weights are numbers and they can be printed out. You cannot " +
        "produce the equivalent for your own reading of the sentence, and " +
        "asking you why you chose as you did gets a report rather than a record."
    },
    {
      id: "limit",
      text: "Is limited by how much can be held in mind at one time.",
      answer: "human",
      why: "A capacity limit of that kind is a fact about people. The model " +
        "compares the word it with every word in its context at once; it has " +
        "a context length, but that is a different sort of limit and nothing " +
        "is being held."
    },
    {
      id: "samething",
      text: "Because both are called attention, both must work the same way.",
      answer: "neither",
      why: "This is the claim the activity exists to refuse. The name was " +
        "borrowed. Borrowing a word does not import the theory that came with it."
    }
  ];

  var ANSWER_OPTIONS = [
    { key: "human", label: "What you did" },
    { key: "model", label: "What the model does" },
    { key: "both", label: "Both" },
    { key: "neither", label: "Neither" }
  ];

  var referentBox = document.getElementById("referent");
  var oneVerdict = document.getElementById("one-verdict");
  var oneVerdictText = document.getElementById("one-verdict-text");
  var oneActions = document.getElementById("one-actions");
  var toTwo = document.getElementById("to-two");
  var scoreBody = document.getElementById("score-body");
  var totalOptions = document.getElementById("total-options");
  var twoPrompt = document.getElementById("two-prompt");
  var weightsStep = document.getElementById("weights-step");
  var twoVerdict = document.getElementById("two-verdict");
  var twoVerdictText = document.getElementById("two-verdict-text");
  var twoActions = document.getElementById("two-actions");
  var toThree = document.getElementById("to-three");
  var claimsBox = document.getElementById("claims");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var referentChoice = null;
  var claimAnswers = {};

  function buildOptions(box, entries, handler, legendText, columns) {
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
      button.setAttribute("data-key", String(entry.key));
      button.textContent = entry.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        handler(entry.key);
      });
      box.appendChild(button);
    });
  }

  function markOnly(box, key, correctKey) {
    Array.prototype.forEach.call(box.querySelectorAll("[data-choice]"), function (node) {
      var k = node.getAttribute("data-key");
      if (correctKey === undefined) {
        wb.choices.mark(node, k === String(key) ? "chosen" : null);
      } else {
        wb.choices.mark(node,
          k === String(correctKey) ? "correct" : (k === String(key) ? "incorrect" : null));
      }
    });
    wb.choices.lock(box);
  }

  /* --- Stage one --------------------------------------------------------- */

  function chooseReferent(key) {
    referentChoice = key;
    markOnly(referentBox, key);
    oneVerdictText.textContent = key === "trophy"
      ? "Almost everyone says the trophy, and so would most people asked in " +
        "the street. Notice what you used to get there: you know roughly how " +
        "big a trophy is, how big a suitcase is, and what fitting one inside " +
        "the other requires. None of that is in the sentence."
      : "That is the less common answer, and it is not unreasonable: nothing " +
        "in the grammar rules it out, and if the suitcase were tiny the " +
        "sentence would still work. Either way, notice what you had to use to " +
        "decide: knowledge about what these objects are like, which is not in " +
        "the sentence at all.";
    wb.show("#one-verdict");
    wb.show("#one-actions");
    wb.announce("Answer recorded. Now the model's turn.");
  }

  /* --- Stage two --------------------------------------------------------- */

  function renderScores(withWeights) {
    scoreBody.textContent = "";
    TOKENS.forEach(function (token) {
      var row = document.createElement("tr");
      var head = document.createElement("th");
      head.setAttribute("scope", "row");
      head.textContent = token.word;
      row.appendChild(head);
      var score = document.createElement("td");
      score.textContent = String(token.score);
      row.appendChild(score);
      var weight = document.createElement("td");
      weight.textContent = withWeights
        ? (token.score / TOTAL).toFixed(2)
        : "?";
      row.appendChild(weight);
      scoreBody.appendChild(row);
    });
  }

  function answerTotal(value) {
    var right = Number(value) === TOTAL;
    markOnly(totalOptions, value, TOTAL);
    renderScores(true);
    twoPrompt.textContent = right
      ? "Correct: they add up to " + TOTAL + "."
      : "They actually add up to " + TOTAL + ".";
    wb.show("#weights-step");
    renderChart();
    var top = TOKENS.slice().sort(function (a, b) { return b.score - a.score; })[0];
    twoVerdictText.textContent =
      "That is the whole operation. Every weight is a score divided by " + TOTAL +
      ", which is why they add up to one. The largest weight went to " +
      top.word + ", at " + (top.score / TOTAL).toFixed(2) +
      ", and the rest is spread over the other four words including " +
      "because and was, which refer to nothing at all. Whatever this is, it " +
      "is not the model pointing at what the pronoun means.";
    wb.show("#two-verdict");
    wb.show("#two-actions");
    wb.announce("Weights computed. The largest is on " + top.word + ".");
  }

  function renderChart() {
    var LEFT = 220, RIGHT = 830, TOP = 50, ROW = 48;
    var BASE = TOP + TOKENS.length * ROW;
    var maxWeight = Math.max.apply(null, TOKENS.map(function (t) { return t.score / TOTAL; }));
    var X = function (w) { return LEFT + (w / (maxWeight * 1.25)) * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 40));

    var title = svg("text", { x: 30, y: 26, class: "plot__label" });
    title.textContent = "The weight given to each word, adding up to 1.00";
    chart.appendChild(title);

    TOKENS.forEach(function (token, i) {
      var y = TOP + i * ROW;
      var w = token.score / TOTAL;
      var label = svg("text", { x: LEFT - 16, y: y + 22, "text-anchor": "end", class: "plot__label" });
      label.textContent = token.word;
      chart.appendChild(label);
      chart.appendChild(svg("rect", {
        x: LEFT, y: y + 4, width: Math.max(2, X(w) - LEFT).toFixed(1),
        height: 24, rx: 4, fill: "#1C7293", "fill-opacity": "0.8"
      }));
      var value = svg("text", { x: (X(w) + 12).toFixed(1), y: y + 22, class: "plot__sub" });
      value.textContent = w.toFixed(2);
      chart.appendChild(value);
    });

    chartDesc.textContent =
      "A bar for each word showing its weight: " +
      TOKENS.map(function (t) {
        return t.word + " " + (t.score / TOTAL).toFixed(2);
      }).join(", ") + ". They add up to one.";
  }

  /* --- Stage three ------------------------------------------------------- */

  function buildClaims() {
    claimsBox.textContent = "";
    CLAIMS.forEach(function (claim, i) {
      var block = document.createElement("section");
      block.className = "block";
      block.setAttribute("data-claim", claim.id);

      var head = document.createElement("p");
      head.className = "lead";
      head.textContent = (i + 1) + ". " + claim.text;
      block.appendChild(head);

      var box = document.createElement("fieldset");
      box.className = "option-grid";
      box.setAttribute("style", "--option-columns: 4");
      box.setAttribute("data-options", claim.id);
      block.appendChild(box);

      var verdict = document.createElement("p");
      verdict.className = "small";
      verdict.setAttribute("data-why", claim.id);
      verdict.hidden = true;
      block.appendChild(verdict);

      claimsBox.appendChild(block);
      buildOptions(box, ANSWER_OPTIONS, function (key) {
        answerClaim(claim, key, box, verdict);
      }, claim.text, 4);
    });
  }

  function answerClaim(claim, key, box, verdict) {
    claimAnswers[claim.id] = key;
    markOnly(box, key, claim.answer);
    verdict.textContent = (key === claim.answer ? "Yes. " : "The answer is " +
      ANSWER_OPTIONS.filter(function (o) { return o.key === claim.answer; })[0].label.toLowerCase() +
      ". ") + claim.why;
    verdict.hidden = false;
    if (Object.keys(claimAnswers).length === CLAIMS.length) { report(); }
  }

  /* --- Result ------------------------------------------------------------ */

  function report() {
    var right = CLAIMS.filter(function (c) { return claimAnswers[c.id] === c.answer; }).length;
    resultLead.textContent =
      "You matched " + right + " of the " + CLAIMS.length +
      " claims to the right one. The one that matters most is the last: " +
      "the two things share a name because the name was borrowed, not because " +
      "the mechanisms turned out to be the same." +
      (claimAnswers.samething === "neither"
        ? " You had that one."
        : " That is the one to take away.");
    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All five claims answered. The summary is below.");
  }

  /* --- Wiring ------------------------------------------------------------ */

  toTwo.addEventListener("click", function () {
    wb.show("#stage-two");
    wb.progress.set(1);
    wb.scrollTo("#stage-two", { focus: true });
    wb.announce("Stage two. Work the weights out.");
  });

  toThree.addEventListener("click", function () {
    wb.show("#stage-three");
    wb.progress.set(2);
    wb.scrollTo("#stage-three", { focus: true });
    wb.announce("Stage three. Five claims to sort.");
  });

  function doReset() {
    referentChoice = null;
    claimAnswers = {};
    wb.choices.clear(referentBox);
    wb.choices.clear(totalOptions);
    wb.hide("#one-verdict");
    wb.hide("#one-actions");
    wb.hide("#stage-two");
    wb.hide("#weights-step");
    wb.hide("#two-verdict");
    wb.hide("#two-actions");
    wb.hide("#stage-three");
    wb.hide("#synthesis");
    claimsBox.textContent = "";
    twoPrompt.textContent = "First, add the scores up. What do they come to?";
    renderScores(false);
    buildOptions(referentBox, REFERENTS, chooseReferent,
      "What does the word it refer to?", 2);
    buildOptions(totalOptions, TOTAL_OPTIONS.map(function (n) {
      return { key: n, label: String(n) };
    }), answerTotal, "What do the scores add up to?", 4);
    buildClaims();
    wb.hide("#stage-three");
    wb.progress.reset();
    wb.progress.set(0);
  }

  wb.onReset(doReset);
  doReset();
})();
