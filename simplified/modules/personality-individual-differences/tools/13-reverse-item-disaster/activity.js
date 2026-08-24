/* =========================================================================
   Reverse-Item Disaster — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/personality-individual-differences/tools/13-reverse-item-disaster/

   WHAT THIS IS ABOUT
   ------------------
   The scale, not the people. An unrecoded reverse item correlates negatively
   with everything else on the scale, drags Cronbach's alpha to nothing, and
   makes an instrument that measures one thing look as though it does not.

   The live mechanism is the scale statistics. Every corrected item-total
   correlation and alpha itself are recomputed from the response matrix on
   every change, and the learner watches them move as each reverse item is
   repaired by hand.

   THE EDUCATIONAL MODEL, unchanged from the original
   --------------------------------------------------
   Items are answered 1 to 5. Two of the six are worded so that agreement
   means LESS of the trait. Correct recoding is

       recoded = (min + max) - raw = 6 - raw          for a 1-5 scale

   Alpha comes from the item variances and the total variance. The corrected
   item-total correlation is each item against the total of the other five.

   THE ARC, AND WHY IT IS WORTH TWO STEPS
   --------------------------------------
       as scored          alpha -0.04     items 3 and 5 both pulling against
       item 3 recoded     alpha +0.03     alpha has barely moved
       item 5 recoded     alpha +0.78     the scale finally behaves

   Repairing the first reverse item is almost invisible in alpha, because the
   second is still fighting it. What does move, dramatically, is the
   item-total correlation of the item still to be fixed: item 5 goes from
   -0.42 to -0.89 and becomes impossible to miss. That is the point of doing
   this in two steps rather than one, and it is why the item-total
   correlations rather than alpha are the main figure: alpha says something is
   wrong, the item statistics say which column to fix.

   WHY THESE SIX RESPONDENTS
   -------------------------
   Carried over from the original. The answers include the ordinary
   inconsistency real respondents show; a set of perfectly coherent
   respondents produces a less interesting pattern.

   WHAT WAS REDUCED
   ----------------
   Four scoring methods to two states. The respondent-level consequence, which
   is real and which the original develops at length, appears once in the
   feedback for the second repair and is not the main visual or the main
   teaching job. Also gone: the opening prediction and the formula visual.

   This activity deliberately says nothing about item selection, construct
   breadth or how choosing different items would change alpha. That is a
   different lesson.

   Every item, respondent and answer is invented. Nothing is stored and
   nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var MIN = 1;
  var MAX = 5;

  var ITEMS = [
    { id: "i1", short: "Item 1", text: "I keep going when a task turns out to be harder than I expected.", reverse: false },
    { id: "i2", short: "Item 2", text: "I finish what I start, even when it stops being interesting.", reverse: false },
    { id: "i3", short: "Item 3", text: "I give up on things once they become difficult.", reverse: true },
    { id: "i4", short: "Item 4", text: "I stay with a long piece of work until it is done.", reverse: false },
    { id: "i5", short: "Item 5", text: "I move on to something else as soon as progress slows.", reverse: true },
    { id: "i6", short: "Item 6", text: "I keep at a problem until I have solved it.", reverse: false }
  ];

  var RESPONDENTS = [
    { id: "A", answers: [5, 2, 1, 5, 1, 5] },
    { id: "B", answers: [4, 5, 4, 5, 2, 5] },
    { id: "C", answers: [3, 3, 1, 4, 1, 3] },
    { id: "D", answers: [4, 3, 1, 3, 2, 3] },
    { id: "E", answers: [3, 4, 5, 2, 2, 5] },
    { id: "F", answers: [1, 1, 5, 4, 5, 1] }
  ];

  /* The two repairs, in order, each with the one answer the learner recodes
     by hand before the rule is applied to that whole column. */
  var REPAIRS = [
    { item: 2, example: "F" },
    { item: 4, example: "B" }
  ];

  /* Which item columns have been recoded, for every respondent at once. */
  var fixed = {};
  var step = 0;               /* 0 as scored, 1 and 2 after each repair */
  var journey = [];           /* alpha after each stage, for the summary */
  var startingAlpha = null;   /* alpha before anything was touched */

  /* --- Scoring --------------------------------------------------------- */

  function value(respondent, index) {
    var raw = respondent.answers[index];
    return fixed[index] ? (MIN + MAX) - raw : raw;
  }

  function column(index) {
    return RESPONDENTS.map(function (r) { return value(r, index); });
  }

  function total(respondent) {
    var sum = 0;
    ITEMS.forEach(function (_, index) { sum += value(respondent, index); });
    return sum;
  }

  function mean(values) {
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function variance(values) {
    var m = mean(values);
    return values.reduce(function (acc, v) {
      return acc + (v - m) * (v - m);
    }, 0) / (values.length - 1);
  }

  function correlation(xs, ys) {
    var mx = mean(xs);
    var my = mean(ys);
    var num = 0;
    var sx = 0;
    var sy = 0;
    xs.forEach(function (x, i) {
      num += (x - mx) * (ys[i] - my);
      sx += (x - mx) * (x - mx);
      sy += (ys[i] - my) * (ys[i] - my);
    });
    var den = Math.sqrt(sx * sy);
    return den ? num / den : 0;
  }

  /** Each item against the total of the other five. */
  function itemTotal(index) {
    return correlation(column(index), RESPONDENTS.map(function (r) {
      return total(r) - value(r, index);
    }));
  }

  /** Cronbach's alpha from the item variances and the total variance. */
  function alpha() {
    var k = ITEMS.length;
    var itemVariance = 0;
    ITEMS.forEach(function (_, index) { itemVariance += variance(column(index)); });
    var totalVariance = variance(RESPONDENTS.map(total));
    if (!totalVariance) { return null; }
    return (k / (k - 1)) * (1 - itemVariance / totalVariance);
  }

  function ranking() {
    return RESPONDENTS.slice().sort(function (a, b) {
      return total(b) - total(a);
    }).map(function (r) { return r.id; });
  }

  function fmtR(value) {
    return (value < 0 ? "" : "+") + value.toFixed(2);
  }

  /* --- Elements -------------------------------------------------------- */

  var stepLabel = document.getElementById("step-label");
  var labLead = document.getElementById("lab-lead");
  var readout = document.getElementById("readout");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var repairBox = document.getElementById("repair");
  var repairPrompt = document.getElementById("repair-prompt");
  var recodedLabel = document.getElementById("recoded-label");
  var recodedInput = document.getElementById("recoded");
  var repairError = document.getElementById("repair-error");
  var checkButton = document.getElementById("check");
  var reveal = document.getElementById("reveal");
  var advance = document.getElementById("advance");
  var journeyList = document.getElementById("journey");

  var SVG_NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* --- The two scale statistics, live --------------------------------- */

  function renderReadout() {
    readout.textContent = "";
    var a = alpha();
    var against = 0;
    ITEMS.forEach(function (_, index) {
      if (itemTotal(index) < 0) { against += 1; }
    });

    tile("Cronbach's alpha", a === null ? "undefined" : fmtR(a),
      a === null ? "" : a <= 0
        ? "At or below zero: the items are not measuring one thing"
        : a < 0.5
          ? "Still far too low for a usable scale"
          : "A scale that behaves");

    tile("Items pulling against the rest", String(against),
      against === 0
        ? "Every item agrees with the total of the others"
        : against > 2
          ? "Only two are reverse-keyed. The others look broken because the total they are measured against is broken"
          : "Its item-total correlation is negative");
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    readout.appendChild(item);
  }

  /* --- The main figure: item-total correlations ------------------------
     Bands again: the label column, the bars and the axis numbers each own a
     strip, and the value for each bar is printed on the far side of zero
     from the bar itself so it can never sit on top of it. */

  function renderChart() {
    var LABEL_RIGHT = 210;
    var AXIS_LEFT = 230;
    var AXIS_RIGHT = 860;
    var TOP = 26;
    var ROW = 38;
    var BAR = 22;

    var zero = (AXIS_LEFT + AXIS_RIGHT) / 2;
    var half = (AXIS_RIGHT - AXIS_LEFT) / 2;
    var X = function (r) { return zero + r * half; };

    var axisY = TOP + ITEMS.length * ROW + 8;
    var total = axisY + 46;

    while (chart.childNodes.length > 2) {
      chart.removeChild(chart.lastChild);
    }
    chart.setAttribute("viewBox", "0 0 900 " + total);

    ITEMS.forEach(function (item, index) {
      var r = itemTotal(index);
      var y = TOP + index * ROW;

      var name = svg("text", {
        x: LABEL_RIGHT, y: y + BAR / 2 + 5, "text-anchor": "end", class: "plot__label"
      });
      name.textContent = item.short + (item.reverse ? (fixed[index] ? " (recoded)" : " (reverse)") : "");
      chart.appendChild(name);

      var x0 = Math.min(zero, X(r));
      var width = Math.abs(X(r) - zero);
      chart.appendChild(svg("rect", {
        x: x0.toFixed(1), y: y, width: Math.max(1, width).toFixed(1), height: BAR,
        rx: 3, class: r < 0 ? "plot__bar plot__bar--negative" : "plot__bar"
      }));

      /* Printed on the empty side of zero, so it never lands on its bar. */
      var label = svg("text", {
        x: (r < 0 ? zero + 10 : zero - 10).toFixed(1), y: y + BAR / 2 + 5,
        "text-anchor": r < 0 ? "start" : "end", class: "plot__sub"
      });
      label.textContent = fmtR(r);
      chart.appendChild(label);
    });

    chart.appendChild(svg("line", {
      x1: zero, y1: TOP - 8, x2: zero, y2: axisY, class: "plot__zero"
    }));
    chart.appendChild(svg("line", {
      x1: AXIS_LEFT, y1: axisY, x2: AXIS_RIGHT, y2: axisY, class: "plot__axis"
    }));

    [-1, -0.5, 0, 0.5, 1].forEach(function (tick) {
      var mark = svg("text", {
        x: X(tick), y: axisY + 20, "text-anchor": "middle", class: "plot__tick"
      });
      mark.textContent = tick.toFixed(1);
      chart.appendChild(mark);
    });

    var caption = svg("text", {
      x: zero, y: axisY + 40, "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Corrected item-total correlation";
    chart.appendChild(caption);

    chartDesc.textContent =
      "One horizontal bar per item, showing how strongly it correlates with " +
      "the total of the other five, on a scale from minus one to plus one. " +
      ITEMS.map(function (item, index) {
        return item.short.toLowerCase() + " " + fmtR(itemTotal(index));
      }).join(", ") + ". Cronbach's alpha is " + fmtR(alpha()) + ".";
  }

  function refresh() {
    renderReadout();
    renderChart();
  }

  /* --- Repairing one item --------------------------------------------- */

  function openRepair() {
    var repair = REPAIRS[step];
    var item = ITEMS[repair.item];
    var respondent = byId(repair.example);
    var raw = respondent.answers[repair.item];

    stepLabel.textContent = step === 0 ? "Repair the first" : "Repair the second";
    labLead.textContent =
      "Recoding turns an answer round: subtract it from one more than the sum " +
      "of the scale endpoints. On a 1 to 5 scale that is 6 minus the answer.";

    repairPrompt.textContent =
      item.short + " reads “" + item.text + "”, so agreeing with it means less " +
      "persistence, not more. Respondent " + respondent.id + " answered " + raw +
      ". Recode that answer, and the same rule will be applied to " +
      item.short + " for all six respondents.";

    recodedLabel.textContent = "6 minus " + raw + " is";
    recodedInput.value = "";
    wb.hide(repairError);
    wb.show(repairBox);
    wb.hide(reveal);
    wb.hide(advance);
    wb.progress.set(step + 1);
    recodedInput.focus();
    wb.announce("Recode " + item.short + ": 6 minus " + raw + ".");
  }

  checkButton.addEventListener("click", function () {
    var repair = REPAIRS[step];
    var respondent = byId(repair.example);
    var raw = respondent.answers[repair.item];
    var want = (MIN + MAX) - raw;
    var given = Number(recodedInput.value);

    if (recodedInput.value === "" || isNaN(given)) {
      repairError.textContent = "Enter the recoded value.";
      wb.show(repairError);
      return;
    }
    if (given !== want) {
      repairError.textContent =
        "Not quite. 6 minus " + raw + " is " + want + ".";
      wb.show(repairError);
      return;
    }

    wb.hide(repairError);
    var alphaBefore = alpha();
    var thisBefore = itemTotal(repair.item);
    var otherIndex = REPAIRS[1 - step].item;
    var otherBefore = itemTotal(otherIndex);

    fixed[repair.item] = true;
    step += 1;
    refresh();
    journey.push(alpha());

    showRepairFeedback(repair, alphaBefore, thisBefore, otherIndex, otherBefore);
  });

  function showRepairFeedback(repair, alphaBefore, thisBefore, otherIndex, otherBefore) {
    var item = ITEMS[repair.item];
    var alphaAfter = alpha();

    reveal.textContent = "";
    var headline = document.createElement("p");
    var strong = document.createElement("strong");

    var grid = document.createElement("div");
    grid.className = "reveal-grid";

    if (step === 1) {
      strong.textContent = "Alpha barely moved.";
      headline.appendChild(strong);
      grid.appendChild(mini(
        item.short + " is fixed",
        "Its bar has crossed the line: " + fmtR(itemTotal(repair.item)) +
        ", up from " + fmtR(thisBefore) + ". The item now agrees with the rest.",
        false
      ));
      grid.appendChild(mini(
        "But alpha went from " + fmtR(alphaBefore) + " to " + fmtR(alphaAfter),
        "One reverse item is still unrecoded, and it is pulling hard enough " +
        "to hold the whole scale down. Look at " + ITEMS[otherIndex].short +
        ": it has gone from " + fmtR(otherBefore) + " to " +
        fmtR(itemTotal(otherIndex)) + ". Repairing one column made the other " +
        "one obvious.",
        true
      ));
      advance.textContent = "Repair " + ITEMS[otherIndex].short;
    } else {
      strong.textContent = "Now the scale behaves.";
      headline.appendChild(strong);
      grid.appendChild(mini(
        "Alpha went from " + fmtR(alphaBefore) + " to " + fmtR(alphaAfter),
        "Every item now correlates positively with the total of the others, " +
        "and the six items look like six measures of one thing, which is what " +
        "they were written to be.",
        false
      ));
      grid.appendChild(mini(
        "And the people moved too",
        "Under the broken scoring the six respondents came out in the order " +
        brokenOrder().join(", ") + ". Correctly scored they come out " +
        ranking().join(", ") + ". That is the consequence that would have " +
        "reached a conclusion, and alpha was the only thing warning you.",
        true
      ));
      advance.textContent = "What changed";
    }

    reveal.appendChild(headline);
    reveal.appendChild(grid);
    wb.hide(repairBox);
    wb.show(reveal);
    wb.show(advance);

    wb.announce(
      item.short + " recoded. Alpha is now " + fmtR(alphaAfter) + "."
    );
  }

  function brokenOrder() {
    var saved = fixed;
    fixed = {};
    var order = ranking();
    fixed = saved;
    return order;
  }

  function mini(title, body, isLimit) {
    var box = document.createElement("div");
    box.className = isLimit ? "mini mini--limit" : "mini";
    var strong = document.createElement("strong");
    strong.textContent = title;
    var p = document.createElement("p");
    p.textContent = body;
    box.appendChild(strong);
    box.appendChild(p);
    return box;
  }

  /* --- The summary ----------------------------------------------------- */

  function finish() {
    journeyList.textContent = "";
    var labels = [
      ["As scored", "Neither reverse item recoded"],
      ["One repaired", "The second still pulling against the rest"],
      ["Both repaired", "The scoring the scale was written for"]
    ];
    var values = [startingAlpha].concat(journey);

    values.forEach(function (a, index) {
      var item = document.createElement("li");
      item.className = "result";
      var strong = document.createElement("strong");
      strong.textContent = labels[index][0];
      var big = document.createElement("div");
      big.className = "big";
      big.textContent = fmtR(a);
      var span = document.createElement("span");
      span.textContent = labels[index][1];
      item.appendChild(strong);
      item.appendChild(big);
      item.appendChild(span);
      journeyList.appendChild(item);
    });

    wb.progress.markAllDone();
    wb.hide(advance);
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("Alpha went from -0.04, to +0.03, to +0.78.");
  }

  /* --- Controls -------------------------------------------------------- */

  function byId(id) {
    var found = null;
    RESPONDENTS.forEach(function (r) { if (r.id === id) { found = r; } });
    return found;
  }

  advance.addEventListener("click", function () {
    if (step >= REPAIRS.length) {
      finish();
      return;
    }
    openRepair();
  });

  recodedInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkButton.click();
    }
  });

  wb.onReset(function () {
    fixed = {};
    step = 0;
    journey = [];
    startingAlpha = alpha();
    stepLabel.textContent = "As scored";
    labLead.textContent =
      "A fictional persistence scale, six items answered from 1 to 5 by six " +
      "respondents. Two items are worded so that agreeing means less " +
      "persistence, and every answer has been added up at face value.";
    wb.hide(repairBox);
    wb.hide(reveal);
    wb.hide("#synthesis");
    wb.show(advance);
    advance.textContent = "Find the problem items";
    recodedInput.value = "";
    wb.hide(repairError);
    wb.progress.reset();
    refresh();
  });

  startingAlpha = alpha();
  refresh();
})();
