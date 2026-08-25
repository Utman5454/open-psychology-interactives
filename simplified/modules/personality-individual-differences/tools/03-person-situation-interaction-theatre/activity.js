/* =========================================================================
   How Much Room Does the Situation Leave? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/personality-individual-differences/tools/03-person-situation-interaction-theatre/

   TEACHING JOB
   ------------
   Situation strength compresses the differences between people without
   changing the people, and two weak situations can still rank the same people
   differently.

   WHAT IS PRESERVED
   -----------------
   The live strength control and the two contrasting settings. Both are
   needed: one setting shows compression, and only a second setting shows that
   the ordering itself depends on what is being afforded.

       behaviour = demand * s + trait * (1 - s) * GAIN + centre * (1 - s)

   where s is situation strength in 0..1 and the trait used is the one that
   setting affords. At s = 1 everyone converges on the setting's demand; at
   s = 0 the setting contributes nothing and only the person shows.

   WHY A SLOPEGRAPH
   ----------------
   The interaction is a change of ORDER between the two settings, and a
   slopegraph makes a change of order literally visible as crossing lines. A
   pair of bar charts would show the same numbers and hide the thing the
   activity is about.

   WHAT WAS REDUCED
   ----------------
   The ranking prediction before the reveal, the additional settings, the
   explicit aggregation demonstration and the transfer exercise.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var GAIN = 1.35;
  var CENTRE = 50;

  /* Two traits, on 0..100 scales centred near 50. The cast is arranged so
     that the two settings do NOT rank them the same way. */
  var CAST = [
    { key: "amara", name: "Amara", sociability: 82, care: 38 },
    { key: "ben", name: "Ben", sociability: 64, care: 71 },
    { key: "carla", name: "Carla", sociability: 31, care: 86 },
    { key: "dev", name: "Dev", sociability: 44, care: 55 }
  ];

  var SITUATIONS = [
    {
      key: "party", label: "At a friend's party",
      affords: "sociability", demand: 62,
      note: "Nothing in particular is required of anyone."
    },
    {
      key: "handover", label: "Handing over a shift at work",
      affords: "care", demand: 62,
      note: "There is a checklist and a person waiting."
    }
  ];

  var strengthInput = document.getElementById("strength");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var strongButton = document.getElementById("strong");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");
  var resultLead = document.getElementById("result-lead");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var changes = 0;
  var range = wb.bindRange("#strength", { format: function (v) { return v; } });

  function strength() { return Number(strengthInput.value) / 100; }

  function behaviour(person, situation) {
    var s = strength();
    var trait = person[situation.affords];
    return situation.demand * s + (CENTRE + (trait - CENTRE) * GAIN) * (1 - s);
  }

  function spread(situation) {
    var values = CAST.map(function (p) { return behaviour(p, situation); });
    var mean = values.reduce(function (a, b) { return a + b; }, 0) / values.length;
    var v = values.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / values.length;
    return Math.sqrt(v);
  }

  function orderIn(situation) {
    return CAST.slice().sort(function (a, b) {
      return behaviour(b, situation) - behaviour(a, situation);
    }).map(function (p) { return p.key; });
  }

  function sameOrder() {
    return orderIn(SITUATIONS[0]).join(",") === orderIn(SITUATIONS[1]).join(",");
  }

  function crossings() {
    var n = 0;
    var i = 0;
    while (i < CAST.length) {
      var j = i + 1;
      while (j < CAST.length) {
        var a = CAST[i], b = CAST[j];
        var left = behaviour(a, SITUATIONS[0]) - behaviour(b, SITUATIONS[0]);
        var right = behaviour(a, SITUATIONS[1]) - behaviour(b, SITUATIONS[1]);
        if (left * right < 0) { n += 1; }
        j += 1;
      }
      i += 1;
    }
    return n;
  }

  /* --- The figure -------------------------------------------------------- */

  var COLOURS = ["#1C7293", "#9E7318", "#25634F", "#C0434F"];

  function render() {
    /* TOP leaves a clear row for the figure title above the column headings:
       the title is long and the left heading is start-anchored at LEFT, so the
       two share a row unless the headings are pushed down. The scale numbers
       sit at SCALE_X, well left of the value labels that end at LEFT - 16,
       because when the people compress towards the middle a value label lands
       exactly on the 50 tick otherwise. */
    var LEFT = 250, RIGHT = 620, TOP = 96, BOTTOM = 360, SCALE_X = 108;
    var Y = function (v) { return BOTTOM - (v / 100) * (BOTTOM - TOP); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var title = svg("text", { x: 24, y: 30, class: "plot__label" });
    title.textContent = "How much each person does the thing, out of 100";
    chart.appendChild(title);

    /* Gridlines carry the scale across, so the spread can be read against a
       fixed reference rather than against the other people only. They stop at
       the two axes: the strips outside are where the value labels live, and a
       line running under a label is the one thing that makes a small label
       hard to read. */
    [0, 50, 100].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: Y(v).toFixed(1), x2: RIGHT, y2: Y(v).toFixed(1),
        class: "plot__axis", opacity: 0.45
      }));
      var tick = svg("text", { x: SCALE_X, y: (Y(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick" });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: TOP, x2: LEFT, y2: BOTTOM, class: "plot__axis" }));
    chart.appendChild(svg("line", { x1: RIGHT, y1: TOP, x2: RIGHT, y2: BOTTOM, class: "plot__axis" }));

    SITUATIONS.forEach(function (sit, i) {
      var x = i === 0 ? LEFT : RIGHT;
      var head = svg("text", {
        x: x, y: TOP - 30, "text-anchor": i === 0 ? "start" : "end", class: "plot__label"
      });
      head.textContent = sit.label;
      chart.appendChild(head);
      var sub = svg("text", {
        x: x, y: TOP - 12, "text-anchor": i === 0 ? "start" : "end", class: "plot__tick"
      });
      sub.textContent = "affords " + sit.affords;
      chart.appendChild(sub);
    });

    /* One line per person, plus a labelled end point at each side. */
    var leftY = CAST.map(function (p) { return Y(behaviour(p, SITUATIONS[0])); });
    var rightY = CAST.map(function (p) { return Y(behaviour(p, SITUATIONS[1])); });
    var leftLabelY = wb.spreadLabels(leftY, 19, TOP - 4, BOTTOM + 4);
    var rightLabelY = wb.spreadLabels(rightY, 19, TOP - 4, BOTTOM + 4);

    CAST.forEach(function (p, i) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: leftY[i].toFixed(1), x2: RIGHT, y2: rightY[i].toFixed(1),
        stroke: COLOURS[i], "stroke-width": 3, "stroke-linecap": "round"
      }));
      chart.appendChild(svg("circle", { cx: LEFT, cy: leftY[i].toFixed(1), r: 6, fill: COLOURS[i] }));
      chart.appendChild(svg("circle", { cx: RIGHT, cy: rightY[i].toFixed(1), r: 6, fill: COLOURS[i] }));
    });

    /* Labels last, so a leader line never crosses over a name. */
    CAST.forEach(function (p, i) {
      [
        { x: LEFT, dir: -1, y: leftY[i], ly: leftLabelY[i], anchor: "end", sit: SITUATIONS[0] },
        { x: RIGHT, dir: 1, y: rightY[i], ly: rightLabelY[i], anchor: "start", sit: SITUATIONS[1] }
      ].forEach(function (side) {
        if (Math.abs(side.ly - side.y) > 2) {
          chart.appendChild(svg("line", {
            x1: side.x + side.dir * 14, y1: side.ly.toFixed(1),
            x2: side.x + side.dir * 5, y2: side.y.toFixed(1),
            stroke: COLOURS[i], "stroke-width": 1, opacity: 0.7
          }));
        }
        var label = svg("text", {
          x: side.x + side.dir * 16, y: (side.ly + 4).toFixed(1),
          "text-anchor": side.anchor, class: "plot__sub", fill: COLOURS[i]
        });
        label.textContent = p.name + " " + Math.round(behaviour(p, side.sit));
        chart.appendChild(label);
      });
    });

    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 34, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Each line is one person, in both settings";
    chart.appendChild(cap);

    describe();
  }

  function describe() {
    chartDesc.textContent =
      "Two vertical scales side by side, one for each setting, with a line " +
      "joining each person's value in the first to their value in the second. " +
      "With the setting strength at " + Math.round(strength() * 100) + " out of 100, " +
      CAST.map(function (p) {
        return p.name + " goes from " + Math.round(behaviour(p, SITUATIONS[0])) +
          " to " + Math.round(behaviour(p, SITUATIONS[1]));
      }).join(", ") + ". The spread between people is " +
      spread(SITUATIONS[0]).toFixed(1) + " in the first setting and " +
      spread(SITUATIONS[1]).toFixed(1) + " in the second. " +
      (sameOrder()
        ? "Both settings put the four people in the same order."
        : "The two settings put them in different orders, so some lines cross.");
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderReadout() {
    readout.textContent = "";
    tile("Spread at the party", spread(SITUATIONS[0]).toFixed(1),
      "how far apart the four people are here");
    tile("Spread at the handover", spread(SITUATIONS[1]).toFixed(1),
      "how far apart they are here");
    /* At very high strength the ordering is still technically different but
       the gaps are within a point or two, and saying "no" without saying that
       would overstate what is left of the interaction. */
    var tiny = Math.max(spread(SITUATIONS[0]), spread(SITUATIONS[1])) < 3;
    tile("Same order in both?", sameOrder() ? "yes" : "no",
      sameOrder()
        ? "the two settings agree about who does most"
        : tiny
          ? "still different, but everyone is now within a point or two, so " +
            "the ordering barely means anything"
          : crossings() + (crossings() === 1 ? " pair" : " pairs") +
            " swap over between the settings");
  }

  function tile(caption, figure, noteText) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = noteText;
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);
  }

  function renderSentence() {
    var s = Math.round(strength() * 100);
    if (s >= 85) {
      sentence.textContent = "The settings are now almost entirely dictating " +
        "what happens, so the four people look nearly identical in both. None " +
        "of them has changed. Move the slider back down and they reappear.";
      return;
    }
    if (s <= 20) {
      sentence.textContent = "The settings are asking very little, so what each " +
        "person brings is most of what you see. Notice that the two settings " +
        "still do not agree about who does most, because they give different " +
        "things a chance to show.";
      return;
    }
    sentence.textContent = "Partway. The people are still distinguishable and " +
      "the settings have started to pull them together. Both things are " +
      "happening at once, which is the normal case.";
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    if (announce) {
      wb.announce("Strength " + Math.round(strength() * 100) + ". Spread " +
        spread(SITUATIONS[0]).toFixed(1) + " and " +
        spread(SITUATIONS[1]).toFixed(1) + ".");
    }
  }

  /* --- Wiring ------------------------------------------------------------ */

  strengthInput.addEventListener("input", function () { render(); renderReadout(); renderSentence(); });
  strengthInput.addEventListener("change", function () {
    changes += 1;
    if (changes >= 2) { explain.disabled = false; }
    wb.hide("#note");
    refresh(true);
  });

  strongButton.addEventListener("click", function () {
    var weakSpread = spread(SITUATIONS[0]);
    strengthInput.value = "95";
    if (range) { range.sync(); }
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "The spread between the four people at the party has gone from " +
      weakSpread.toFixed(1) + " to " + spread(SITUATIONS[0]).toFixed(1) +
      ". Nothing about any of them has changed: the same four people, with the " +
      "same standing on both traits, are simply in a setting that leaves them " +
      "no room. If you had only ever observed these people here, you would " +
      "conclude that people barely differ, and you would be looking at a fact " +
      "about the setting.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Both settings at 95. The people look nearly identical.");
  });

  explain.addEventListener("click", function () {
    resultLead.textContent =
      "At the strength you have set, the spread between people is " +
      spread(SITUATIONS[0]).toFixed(1) + " at the party and " +
      spread(SITUATIONS[1]).toFixed(1) + " at the handover, and the two " +
      "settings " + (sameOrder() ? "agree" : "disagree") + " about who does most.";
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    strengthInput.value = "10";
    if (range) { range.sync(); }
    changes = 0;
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
