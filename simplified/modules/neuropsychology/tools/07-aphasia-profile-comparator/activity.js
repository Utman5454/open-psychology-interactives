/* =========================================================================
   Which Measure Separates Them? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/07-aphasia-profile-comparator/

   TEACHING JOB
   ------------
   A measure is informative about a contrast, not in general. The useful test
   is the one on which the two candidate profiles differ, which is often not
   the one either of them scores lowest on.

   WHAT IS PRESERVED
   -----------------
   The pairing and the prediction. The learner has to commit to a measure
   before the scores are shown, because the whole point is that the intuitive
   answer, the lowest score, is frequently the wrong one.

   THE PROFILES, ALL FICTIONAL AND ALL DELIBERATELY SHARP
   ------------------------------------------------------
   Four profiles across fluency, comprehension, repetition and naming. The
   numbers are chosen so that at least one pairing has its largest gap on a
   measure that is NOT the lowest score of either profile, which is the case
   the activity is for.

   WHAT WAS REDUCED
   ----------------
   Two further profiles, the remaining pairings, and the running record of
   which measures earned their place.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var MEASURES = [
    { key: "fluency", label: "Fluency" },
    { key: "comprehension", label: "Comprehension" },
    { key: "repetition", label: "Repetition" },
    { key: "naming", label: "Naming" }
  ];

  var PROFILES = [
    {
      key: "P", name: "Profile P", note: "Speech is effortful and short.",
      scores: { fluency: 22, comprehension: 82, repetition: 28, naming: 40 }
    },
    {
      key: "Q", name: "Profile Q", note: "Speech flows but often goes wrong.",
      scores: { fluency: 86, comprehension: 26, repetition: 30, naming: 34 }
    },
    {
      key: "R", name: "Profile R", note: "Fluent, understands, repeats badly.",
      scores: { fluency: 84, comprehension: 80, repetition: 24, naming: 66 }
    },
    {
      key: "S", name: "Profile S", note: "Fluent, understands, repeats badly too.",
      scores: { fluency: 82, comprehension: 84, repetition: 26, naming: 32 }
    }
  ];

  var pairABox = document.getElementById("pairA");
  var pairBBox = document.getElementById("pairB");
  var guessBox = document.getElementById("guess");
  var prediction = document.getElementById("prediction");
  var predictLead = document.getElementById("predict-lead");
  var chartWrap = document.getElementById("chart-wrap");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var verdict = document.getElementById("verdict");
  var verdictText = document.getElementById("verdict-text");
  var nextPair = document.getElementById("next-pair");
  var explain = document.getElementById("explain");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* A curated sequence rather than a free cycle, so the instructive pairing
     is actually reached. R against S is the one where BOTH profiles repeat
     badly, so repetition separates them by 2 points and is worthless here,
     while naming, which is neither profile's lowest score, separates them by
     34. Every other pairing has its largest gap on a measure that is one of
     the two profiles' lowest, which is the easy case. */
  var PAIR_SEQUENCE = [["P", "S"], ["Q", "R"], ["R", "S"]];
  var pairIndex = 0;
  var aKey = PAIR_SEQUENCE[0][0], bKey = PAIR_SEQUENCE[0][1];
  var answered = false;
  var pairings = 0;

  function profile(key) { return PROFILES.filter(function (p) { return p.key === key; })[0]; }

  function gaps() {
    var a = profile(aKey), b = profile(bKey);
    return MEASURES.map(function (m) {
      return { key: m.key, label: m.label, gap: Math.abs(a.scores[m.key] - b.scores[m.key]) };
    });
  }
  function bestMeasure() {
    return gaps().slice().sort(function (x, y) { return y.gap - x.gap; })[0];
  }
  function worstMeasure() {
    return gaps().slice().sort(function (x, y) { return x.gap - y.gap; })[0];
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildProfilePicker(box, current, onPick, legendText, other) {
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = legendText;
    box.appendChild(legend);
    PROFILES.forEach(function (p) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", p.key === current ? "true" : "false");
      label.setAttribute("data-key", p.key);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = box.id;
      input.id = box.id + "-" + p.key;
      input.checked = p.key === current;
      input.disabled = p.key === other;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = p.name;
      var sub = document.createElement("span");
      sub.textContent = p.key === other ? "already chosen above" : p.note;
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () { onPick(p.key); });
      box.appendChild(label);
    });
  }

  function buildGuess() {
    guessBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Which measure will separate them most?";
    guessBox.appendChild(legend);
    MEASURES.forEach(function (m) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-key", m.key);
      button.textContent = m.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        commit(m.key);
      });
      guessBox.appendChild(button);
    });
  }

  function pickA(key) {
    aKey = key;
    if (bKey === key) { bKey = PROFILES.filter(function (p) { return p.key !== key; })[0].key; }
    resetPairing();
  }
  function pickB(key) { bKey = key; resetPairing(); }

  function resetPairing() {
    answered = false;
    wb.hide("#chart-wrap");
    wb.hide("#verdict");
    nextPair.hidden = true;
    wb.show("#prediction");
    buildProfilePicker(pairABox, aKey, pickA, "First profile", bKey);
    buildProfilePicker(pairBBox, bKey, pickB, "Second profile", aKey);
    wb.choices.clear(guessBox);
    buildGuess();
    predictLead.textContent = "Which measure will separate " + profile(aKey).name +
      " and " + profile(bKey).name + " most?";
  }

  /* --- The reveal -------------------------------------------------------- */

  function commit(key) {
    if (answered) { return; }
    answered = true;
    pairings += 1;
    if (pairings >= 2) { explain.disabled = false; }
    var best = bestMeasure(), worst = worstMeasure();
    Array.prototype.forEach.call(guessBox.querySelectorAll("[data-choice]"), function (node) {
      var k = node.getAttribute("data-key");
      wb.choices.mark(node, k === best.key ? "correct" : (k === key ? "incorrect" : null));
    });
    wb.choices.lock(guessBox);
    renderChart(best, worst, key);
    wb.show("#chart-wrap");

    var a = profile(aKey), b = profile(bKey);
    var lowestA = MEASURES.slice().sort(function (x, y) {
      return a.scores[x.key] - a.scores[y.key]; })[0];
    var lowestB = MEASURES.slice().sort(function (x, y) {
      return b.scores[x.key] - b.scores[y.key]; })[0];
    var bestIsLowest = best.key === lowestA.key || best.key === lowestB.key;

    verdictText.textContent =
      (key === best.key ? "Correct. " : "The answer is " + best.label.toLowerCase() + ". ") +
      best.label + " separates them by " + best.gap + " points, and " +
      worst.label.toLowerCase() + " by only " + worst.gap + ". " +
      (bestIsLowest
        ? "Here the separating measure does happen to be one of their lowest " +
          "scores. Try the pairing where it is not: that is the case worth " +
          "seeing."
        : "Notice that the separating measure is not the lowest score of " +
          "either profile. " +
          (lowestA.key === lowestB.key
            ? "Both are poor at " + lowestA.label.toLowerCase() +
              ", which is exactly why " + lowestA.label.toLowerCase() +
              " cannot tell them apart, however striking that score looks on " +
              "either profile on its own."
            : "One is poor at " + lowestA.label.toLowerCase() + " and the " +
              "other at " + lowestB.label.toLowerCase() +
              ", and neither of those is what distinguishes them.")) +
      " A test earns its place by distinguishing the possibilities you are " +
      "actually choosing between.";
    verdict.setAttribute("data-state", key === best.key ? "correct" : "incorrect");
    wb.show("#verdict");
    nextPair.hidden = false;
    wb.scrollTo("#chart-wrap");
    wb.announce(best.label + " separates them most, by " + best.gap + " points.");
  }

  function renderChart(best, worst, guessed) {
    var LEFT = 240, RIGHT = 800, TOP = 54, ROW = 74;
    var BASE = TOP + MEASURES.length * ROW;
    var X = function (v) { return LEFT + (v / 100) * (RIGHT - LEFT); };
    var a = profile(aKey), b = profile(bKey);

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 66));

    var title = svg("text", { x: 24, y: 24, class: "plot__label" });
    title.textContent = a.name + " against " + b.name + ", out of 100";
    chart.appendChild(title);

    MEASURES.forEach(function (m, i) {
      var y = TOP + i * ROW;
      var isBest = m.key === best.key;
      var label = svg("text", { x: LEFT - 16, y: y + 26, "text-anchor": "end", class: "plot__label" });
      label.textContent = m.label;
      chart.appendChild(label);

      [[a, 0, "#1C7293", null], [b, 26, "#9E7318", "6 4"]].forEach(function (row) {
        var p = row[0], dy = row[1];
        var rect = svg("rect", {
          x: LEFT, y: y + dy, width: Math.max(2, X(p.scores[m.key]) - LEFT).toFixed(1),
          height: 22, rx: 4, fill: row[2], "fill-opacity": "0.8"
        });
        chart.appendChild(rect);
        var v = svg("text", {
          x: (X(p.scores[m.key]) + 10).toFixed(1), y: y + dy + 16, class: "plot__sub"
        });
        v.textContent = p.scores[m.key];
        chart.appendChild(v);
      });

      /* The gap, marked so the comparison is on the figure rather than left
         to be computed by eye. */
      var lo = Math.min(a.scores[m.key], b.scores[m.key]);
      var hi = Math.max(a.scores[m.key], b.scores[m.key]);
      chart.appendChild(svg("line", {
        x1: X(lo).toFixed(1), y1: y + 54, x2: X(hi).toFixed(1), y2: y + 54,
        stroke: isBest ? "#C0434F" : "#B9C2CC",
        "stroke-width": isBest ? 5 : 3, "stroke-linecap": "round"
      }));
      var gapTag = svg("text", {
        x: (X(hi) + 10).toFixed(1), y: y + 58,
        class: "plot__sub", fill: isBest ? "#C0434F" : "#5F6878"
      });
      gapTag.textContent = "gap " + (hi - lo) + (isBest ? ", the largest" : "");
      chart.appendChild(gapTag);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    [0, 50, 100].forEach(function (v) {
      var tick = svg("text", { x: X(v).toFixed(1), y: BASE + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });
    var key1 = svg("text", { x: LEFT, y: BASE + 48, class: "plot__sub", fill: "#1C7293" });
    key1.textContent = "solid bars: " + a.name;
    chart.appendChild(key1);
    var key2 = svg("text", { x: LEFT + 260, y: BASE + 48, class: "plot__sub", fill: "#9E7318" });
    key2.textContent = "lower bars: " + b.name;
    chart.appendChild(key2);

    chartDesc.textContent =
      a.name + " and " + b.name + " on four measures out of 100. " +
      MEASURES.map(function (m) {
        return m.label + ": " + a.scores[m.key] + " against " + b.scores[m.key] +
          ", a gap of " + Math.abs(a.scores[m.key] - b.scores[m.key]);
      }).join("; ") + ". The largest gap is on " + best.label.toLowerCase() +
      " and the smallest on " + worst.label.toLowerCase() + ".";
  }

  nextPair.addEventListener("click", function () {
    pairIndex = (pairIndex + 1) % PAIR_SEQUENCE.length;
    aKey = PAIR_SEQUENCE[pairIndex][0];
    bKey = PAIR_SEQUENCE[pairIndex][1];
    resetPairing();
    wb.scrollTo("#card");
    wb.announce("New pairing: " + profile(aKey).name + " and " + profile(bKey).name + ".");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    pairIndex = 0;
    aKey = PAIR_SEQUENCE[0][0]; bKey = PAIR_SEQUENCE[0][1];
    pairings = 0;
    explain.disabled = true;
    wb.hide("#synthesis");
    resetPairing();
  }

  wb.onReset(doReset);
  doReset();
})();
