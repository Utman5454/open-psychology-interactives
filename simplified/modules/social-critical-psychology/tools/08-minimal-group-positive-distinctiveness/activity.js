/**
 * Ahead, or Better Off  (Simplified Edition)
 *
 * Teaching job: choosing the option that puts your own category furthest ahead,
 * over the option that gives it the most points, is the finding the minimal
 * group paradigm exists to produce, and no self-interest account reaches it.
 *
 * The mechanism is preserved by being performed. Four allocations, each with
 * four options written out in full:
 *
 *     fair     equal points to both
 *     joint    the largest total, with slightly more to the other category
 *     ingroup  the most points this option set can give to your own category
 *     gap      the largest difference in your category's favour, which ALWAYS
 *              gives your category FEWER points than `ingroup` does
 *
 * That last line is the whole paradigm and it is checked exhaustively in the
 * test suite over every allocation: on all four, choosing maximum difference
 * costs your own category real points. It is not a way of getting more. It is
 * a way of being further ahead.
 *
 * THE THREE STARTING POSITIONS are the original tool's own addition and they
 * are kept because they carry the critical content. The points a `gap` choice
 * hands out are identical in all three; the act is not. From a level start it
 * creates an inequality, and from a start where your category already holds
 * 400 against 100 it widens one. The final table reports the gap between the
 * categories before and after so that the difference is visible.
 *
 * WHAT WAS CUT. Two of the six allocations, the sorting task, and the exercise
 * in judging published claims. The four remaining allocations preserve the
 * structure of the option set exactly.
 *
 * WHAT THIS IS NOT. Not a replication: nothing reproduces the matrices,
 * procedure or data of any published study. Not a demonstration that
 * categorisation explains intergroup behaviour outside the laboratory, and not
 * an adjudication between the explanations offered for the effect, which four
 * options cannot distinguish. The page says all of this.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var OWN = "Kestrels";
  var OTHER = "Wrens";

  /* [own, other] for each option. `gap` always gives own fewer than `ingroup`. */
  var ALLOCATIONS = [
    { fair: [18, 18], joint: [23, 26], ingroup: [25, 22], gap: [19, 7] },
    { fair: [14, 14], joint: [17, 21], ingroup: [20, 18], gap: [15, 5] },
    { fair: [21, 21], joint: [26, 30], ingroup: [29, 26], gap: [22, 9] },
    { fair: [12, 12], joint: [16, 19], ingroup: [18, 15], gap: [13, 3] }
  ];

  var KINDS = ["fair", "joint", "ingroup", "gap"];

  var KIND_LABELS = {
    fair: "the same to each",
    joint: "the largest total between them",
    ingroup: "the most this set can give a Kestrel",
    gap: "the largest lead for the Kestrel"
  };

  var CONTEXTS = [
    { id: "equal", label: "Level start", own: 100, other: 100 },
    { id: "ahead", label: "Kestrels already ahead", own: 400, other: 100 },
    { id: "behind", label: "Kestrels already behind", own: 100, other: 400 }
  ];

  /* Option order is rotated per allocation, so the maximum-difference option
     is not in the same position every time and cannot be found by habit. */
  function optionsFor(index) {
    var out = [];
    for (var i = 0; i < KINDS.length; i += 1) {
      out.push(KINDS[(i + index) % KINDS.length]);
    }
    return out;
  }

  function chosenTotals() {
    var own = 0, other = 0;
    ALLOCATIONS.forEach(function (allocation, i) {
      var kind = chosen[i];
      if (!kind) { return; }
      own += allocation[kind][0];
      other += allocation[kind][1];
    });
    return { own: own, other: other };
  }

  /** What the maximum-difference choice costs your own category, per
      allocation, against the option that gives it most. */
  function gapCost(index) {
    var a = ALLOCATIONS[index];
    return a.ingroup[0] - a.gap[0];
  }

  function totalGapCost() {
    var total = 0;
    ALLOCATIONS.forEach(function (a, i) {
      if (chosen[i] === "gap") { total += gapCost(i); }
    });
    return total;
  }

  function counts() {
    var out = { fair: 0, joint: 0, ingroup: 0, gap: 0 };
    ALLOCATIONS.forEach(function (a, i) { if (chosen[i]) { out[chosen[i]] += 1; } });
    return out;
  }

  function madeAll() {
    return ALLOCATIONS.every(function (a, i) { return !!chosen[i]; });
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardTask;
  var assignLine, allocationBox, readout, sentence, scoreBtn;
  var cardResult, contextsBody, contextSentence, explainBtn, synthesis, resultLead;

  var answered = false;
  var chosen = {};

  var VERDICTS = {
    gap: { state: "correct", text:
      "That is the finding, and the reason it matters is in the arithmetic. " +
      "In every allocation below there is an option that gives a Kestrel more " +
      "points than the maximum-difference option does. Choosing maximum " +
      "difference costs your own category points in order to be further " +
      "ahead, which no account in terms of getting more can reach." },
    fair: { state: "partial", text:
      "A substantial minority of people do exactly this, and fairness is one " +
      "of the strategies the paradigm reliably finds. It is not the modal " +
      "response, and the interesting comparison is not between fairness and " +
      "favouritism but between two kinds of favouritism that point in " +
      "different directions." },
    joint: { state: "incorrect", text:
      "This is what a person with no stake and no way to benefit ought to do, " +
      "which is why the result is worth explaining. Maximising the total is " +
      "available in every allocation below and is not what most people pick." },
    ingroup: { state: "partial", text:
      "Close, and it is the wrong kind of favouritism. Giving your own " +
      "category the most it can get is available in every allocation below, " +
      "and it is not the option most people take: they take the one that puts " +
      "their category furthest ahead, which gives it fewer points." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "gap") {
      wb.choices.mark(options.querySelector('[data-choice="gap"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardTask);
    assignLine.textContent = "You have been assigned to the " + OWN + ". The " +
      "assignment was made on the basis of nothing that matters, and there is " +
      "nothing else to know about either category.";
    render();
    wb.scrollTo(cardTask);
    wb.announce("Four allocations to make.");
  }

  /* -------------------------------------------------------------- helpers */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function pick(index, kind) {
    if (chosen[index]) { return; }
    chosen[index] = kind;
    render();
    scoreBtn.disabled = !madeAll();
    var a = ALLOCATIONS[index][kind];
    wb.announce("Allocation " + (index + 1) + ": " + a[0] + " to the Kestrel, " +
      a[1] + " to the Wren." + (madeAll() ? " All four made." : ""));
  }

  function render() {
    allocationBox.textContent = "";
    ALLOCATIONS.forEach(function (allocation, index) {
      var block = el("div", "block");
      block.appendChild(el("p", "step-label", "Allocation " + (index + 1) + " of " +
        ALLOCATIONS.length));
      var grid = el("div", "option-grid");
      grid.setAttribute("style", "--option-columns: 2");
      grid.setAttribute("data-workbook-choices", "");
      optionsFor(index).forEach(function (kind) {
        var pair = allocation[kind];
        var button = el("button", "option");
        button.type = "button";
        button.setAttribute("data-choice", index + ":" + kind);
        button.appendChild(el("strong", null,
          pair[0] + " to the Kestrel, " + pair[1] + " to the Wren"));
        if (chosen[index]) {
          button.setAttribute("aria-disabled", "true");
          if (chosen[index] === kind) {
            button.setAttribute("data-state", kind === "gap" ? "partial" : "chosen");
          }
          button.appendChild(el("span", null,
            (chosen[index] === kind ? "Your choice. " : "") +
            "This is " + KIND_LABELS[kind] + "." +
            (kind === "gap"
              ? " It gives the Kestrel " + gapCost(index) +
                " fewer points than the option that gives a Kestrel most."
              : "")));
        } else {
          button.appendChild(el("span", null, ""));
          button.addEventListener("click", function () { pick(index, kind); });
        }
        grid.appendChild(button);
      });
      block.appendChild(grid);
      allocationBox.appendChild(block);
    });

    var c = counts();
    var made = ALLOCATIONS.filter(function (a, i) { return !!chosen[i]; }).length;
    var totals = chosenTotals();

    readout.textContent = "";
    readout.appendChild(tile("Allocations made", made + " of " + ALLOCATIONS.length,
      made === ALLOCATIONS.length ? "all four" : "keep going"));
    readout.appendChild(tile("Points to Kestrels", String(totals.own),
      "handed to people who are not you"));
    readout.appendChild(tile("Points to Wrens", String(totals.other),
      "handed to people who are not you"));

    sentence.textContent = made
      ? "So far: " + KINDS.filter(function (k) { return c[k]; }).map(function (k) {
          return c[k] + " " + KIND_LABELS[k];
        }).join(", ") + "." +
        (c.gap
          ? " Choosing the largest lead has cost Kestrels " + totalGapCost() +
            " points so far, against what the most-to-a-Kestrel option would " +
            "have given them."
          : "")
      : "Nothing is allocated to you in any of these, and the points buy " +
        "nothing. There is no reason of self-interest to prefer any option " +
        "over any other.";
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  /* --------------------------------------------------------------- result */

  function score() {
    wb.show(cardResult);
    var totals = chosenTotals();
    contextsBody.textContent = "";
    CONTEXTS.forEach(function (context) {
      var ownAfter = context.own + totals.own;
      var otherAfter = context.other + totals.other;
      var before = context.own - context.other;
      var after = ownAfter - otherAfter;
      var did;
      if (before === 0 && after !== 0) {
        did = "created a gap of " + Math.abs(after) + " where there was none";
      } else if (Math.abs(after) > Math.abs(before) && (after > 0) === (before > 0)) {
        did = "widened an existing gap from " + Math.abs(before) + " to " + Math.abs(after);
      } else if (Math.abs(after) < Math.abs(before) && (after > 0) === (before > 0)) {
        did = "narrowed an existing gap from " + Math.abs(before) + " to " + Math.abs(after);
      } else if (before !== 0 && (after > 0) !== (before > 0)) {
        did = "reversed a gap of " + Math.abs(before) + " into one of " + Math.abs(after);
      } else {
        did = "left the two categories level";
      }
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", context.label, "row"));
      [context.own, context.other, ownAfter, otherAfter, did].forEach(function (v, col) {
        tr.appendChild(cell("td", String(v)));
      });
      contextsBody.appendChild(tr);
    });

    contextSentence.textContent =
      "You handed out " + totals.own + " points to Kestrels and " +
      totals.other + " to Wrens, and that is the same in all three rows. " +
      (counts().gap
        ? "On the " + counts().gap + " allocation" + (counts().gap === 1 ? "" : "s") +
          " where you chose the largest lead, Kestrels received " + totalGapCost() +
          " points fewer than the most-to-a-Kestrel option would have given them. " +
          "That is what the choice cost, and it bought a larger lead."
        : "You did not choose the largest lead on any allocation, which is a " +
          "perfectly ordinary result and one a substantial minority of people " +
          "produce.");
    wb.scrollTo(cardResult);
    wb.announce("Scored. The same allocations, three starting positions.");
  }

  function explain() {
    var c = counts();
    resultLead.textContent =
      "Across the four allocations you chose " + c.fair + " even splits, " +
      c.joint + " largest totals, " + c.ingroup + " most-to-a-Kestrel and " +
      c.gap + " largest-lead. In every one of the four, the largest-lead " +
      "option gives Kestrels fewer points than the most-to-a-Kestrel option " +
      "does, by between " + Math.min.apply(null, ALLOCATIONS.map(function (a, i) {
        return gapCost(i); })) + " and " +
      Math.max.apply(null, ALLOCATIONS.map(function (a, i) { return gapCost(i); })) +
      " points.";
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
    cardTask = wb.root.querySelector("#card-task");
    assignLine = wb.root.querySelector("#assign-line");
    allocationBox = wb.root.querySelector("#allocations");
    readout = wb.root.querySelector("#readout");
    sentence = wb.root.querySelector("#sentence");
    scoreBtn = wb.root.querySelector("#score");
    cardResult = wb.root.querySelector("#card-result");
    contextsBody = wb.root.querySelector("#contexts-body");
    contextSentence = wb.root.querySelector("#context-sentence");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    scoreBtn.addEventListener("click", score);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      chosen = {};
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardTask);
      wb.hide(cardResult);
      wb.hide(synthesis);
      scoreBtn.disabled = true;
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
