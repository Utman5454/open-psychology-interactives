/* =========================================================================
   Neglect or Blindness? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/04-visual-neglect-line-bisection/

   TEACHING JOB
   ------------
   Left neglect and left field loss both leave things out on the left, and the
   task that tells them apart is cancellation rather than line bisection.

   WHAT IS PRESERVED
   -----------------
   The generated performance drawings. A learner has to see the sheet the
   patient produced, because the diagnostic signal is a spatial pattern and
   describing it in words gives the answer away.

   THE THREE PROFILES, ALL FICTIONAL
   ---------------------------------
       control    a comparison, always available, always labelled as such
       neglect    left neglect: bisection deviates right, cancellation misses
                  the left side and head movement does not rescue it
       field      left homonymous hemianopia: bisection deviates only slightly,
                  cancellation is near complete because the person turns and
                  looks

   That last line is the whole activity. Field loss is an input problem a
   person can compensate for by moving; neglect is an attention problem that
   moves with them.

   WHAT WAS REDUCED
   ----------------
   Two further profiles, scene copying, and the viewer-centred against
   object-centred distinction.

   HONESTY, ON THE PAGE
   --------------------
   These profiles are drawn clean. Real neglect and field loss co-occur after
   the same stroke very often, bisection varies with line length and page
   position, and some people with field loss compensate poorly and look like
   neglect on one sheet. No single task diagnoses either. The caution says so.

   Randomness is seeded so the same sheet is produced every time.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var PROFILES = [
    {
      key: "control", label: "Comparison", role: "Control",
      blurb: "No brain injury. Included so the patients have something to be compared with.",
      bisectBias: 0.01, findLeft: 1.0, findRight: 1.0
    },
    {
      key: "neglect", label: "Patient A", role: "Case",
      blurb: "Right-hemisphere stroke. Left neglect.",
      bisectBias: 0.17, findLeft: 0.25, findRight: 1.0
    },
    {
      key: "field", label: "Patient B", role: "Case",
      blurb: "Left homonymous hemianopia. Attention unaffected.",
      bisectBias: 0.04, findLeft: 0.88, findRight: 1.0
    }
  ];

  var TASKS = [
    { key: "bisect", label: "Line bisection", note: "Mark the middle of the line." },
    { key: "cancel", label: "Star cancellation", note: "Cross out every star on the sheet." }
  ];

  var STAR_COUNT = 30;
  var LINE_LENGTH_MM = 200;

  var sheet = document.getElementById("sheet");
  var sheetDesc = document.getElementById("sheet-desc");
  var sheetLegend = document.getElementById("sheet-legend");
  var profileBox = document.getElementById("profiles");
  var taskBox = document.getElementById("tasks");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var compare = document.getElementById("compare");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");

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

  var profileKey = "control";
  var taskKey = "bisect";
  var changes = 0;
  var comparing = false;

  function profile() {
    return PROFILES.filter(function (p) { return p.key === profileKey; })[0];
  }

  /* --- Stars: one fixed layout for everybody -----------------------------*/

  /* Each half gets exactly half the stars. A sheet that happened to carry
     more targets on one side would make the left-against-right comparison
     unfair before any patient had touched it. */
  var STARS = (function () {
    var random = mulberry32(4711);
    var list = [];
    var half = STAR_COUNT / 2;
    var i = 0;
    while (i < STAR_COUNT) {
      var onLeft = i < half;
      list.push({
        x: onLeft ? 70 + random() * 340 : 470 + random() * 360,
        y: 70 + random() * 200,
        i: i
      });
      i += 1;
    }
    return list;
  }());

  /* Which stars a profile finds. Deterministic: a star is found if its rank
     within its own half is inside that profile's find rate for that half. */
  function foundStars(p) {
    var left = STARS.filter(function (s) { return s.x < 450; })
      .sort(function (a, b) { return b.x - a.x; });   /* rightmost first */
    var right = STARS.filter(function (s) { return s.x >= 450; });
    var found = {};
    left.forEach(function (s, rank) {
      if (rank < Math.round(left.length * p.findLeft)) { found[s.i] = true; }
    });
    right.forEach(function (s, rank) {
      if (rank < Math.round(right.length * p.findRight)) { found[s.i] = true; }
    });
    return { found: found, leftTotal: left.length, rightTotal: right.length };
  }

  /* --- Drawing ----------------------------------------------------------- */

  function render() {
    wb.clearFigure(sheet);
    if (comparing) { renderComparison(); return; }
    sheet.setAttribute("viewBox", "0 0 900 340");
    var p = profile();
    var head = svg("text", { x: 30, y: 26, class: "plot__label" });
    head.textContent = p.label + " (" + p.role + "), " +
      TASKS.filter(function (t) { return t.key === taskKey; })[0].label;
    sheet.appendChild(head);
    if (taskKey === "bisect") { drawBisection(sheet, p, 60, 900); }
    else { drawCancellation(sheet, p, 40); }
    describe();
  }

  function drawBisection(target, p, top, width) {
    var LEFT = 90, RIGHT = width - 70;
    var y = top + 110;
    target.appendChild(svg("line", {
      x1: LEFT, y1: y, x2: RIGHT, y2: y,
      stroke: "#1A2744", "stroke-width": 4, "stroke-linecap": "round"
    }));
    var trueMid = (LEFT + RIGHT) / 2;
    target.appendChild(svg("line", {
      x1: trueMid, y1: y - 34, x2: trueMid, y2: y + 34,
      stroke: "#5F6878", "stroke-width": 2, "stroke-dasharray": "5 5"
    }));
    var trueTag = svg("text", {
      x: trueMid, y: y - 42, "text-anchor": "middle", class: "plot__tick"
    });
    trueTag.textContent = "true middle";
    target.appendChild(trueTag);
    var markX = trueMid + p.bisectBias * (RIGHT - LEFT);
    target.appendChild(svg("line", {
      x1: markX.toFixed(1), y1: y - 26, x2: markX.toFixed(1), y2: y + 26,
      stroke: "#C0434F", "stroke-width": 5, "stroke-linecap": "round"
    }));
    var markTag = svg("text", {
      x: markX.toFixed(1), y: y + 50, "text-anchor": "middle",
      class: "plot__sub plot__over", fill: "#C0434F"
    });
    markTag.textContent = "their mark";
    target.appendChild(markTag);
    var leftTag = svg("text", { x: LEFT, y: y + 78, class: "plot__tick" });
    leftTag.textContent = "left of the page";
    target.appendChild(leftTag);
    var rightTag = svg("text", { x: RIGHT, y: y + 78, "text-anchor": "end", class: "plot__tick" });
    rightTag.textContent = "right of the page";
    target.appendChild(rightTag);
  }

  function drawCancellation(target, p, top) {
    var result = foundStars(p);
    /* The midline, so left and right are unambiguous. */
    target.appendChild(svg("line", {
      x1: 450, y1: top + 10, x2: 450, y2: top + 260,
      stroke: "#D8D2C7", "stroke-width": 2, "stroke-dasharray": "6 6"
    }));
    var leftTag = svg("text", { x: 70, y: top + 8, class: "plot__tick" });
    leftTag.textContent = "left half";
    target.appendChild(leftTag);
    var rightTag = svg("text", { x: 830, y: top + 8, "text-anchor": "end", class: "plot__tick" });
    rightTag.textContent = "right half";
    target.appendChild(rightTag);

    STARS.forEach(function (star) {
      var y = top + (star.y - 70) + 30;
      target.appendChild(star4(star.x, y, result.found[star.i]));
      if (result.found[star.i]) {
        target.appendChild(svg("line", {
          x1: star.x - 13, y1: y - 13, x2: star.x + 13, y2: y + 13,
          stroke: "#C0434F", "stroke-width": 3, "stroke-linecap": "round"
        }));
        target.appendChild(svg("line", {
          x1: star.x + 13, y1: y - 13, x2: star.x - 13, y2: y + 13,
          stroke: "#C0434F", "stroke-width": 3, "stroke-linecap": "round"
        }));
      }
    });
  }

  function star4(cx, cy, found) {
    var r = 9;
    var pts = [];
    var k = 0;
    while (k < 8) {
      var a = (Math.PI / 4) * k - Math.PI / 2;
      var rad = k % 2 === 0 ? r : r * 0.42;
      pts.push((cx + rad * Math.cos(a)).toFixed(1) + "," + (cy + rad * Math.sin(a)).toFixed(1));
      k += 1;
    }
    return svg("polygon", {
      points: pts.join(" "),
      fill: found ? "#B9C2CC" : "#1A2744"
    });
  }

  /* --- Comparison -------------------------------------------------------- */

  function renderComparison() {
    sheet.setAttribute("viewBox", "0 0 900 700");
    var pair = [PROFILES[1], PROFILES[2]];
    pair.forEach(function (p, i) {
      var top = i * 340;
      var head = svg("text", { x: 30, y: top + 26, class: "plot__label" });
      head.textContent = p.label + " (" + p.role + "): " + p.blurb;
      sheet.appendChild(head);
      /* Both draw helpers append to whatever node they are given, so a
         group per patient is all the comparison needs. */
      var g = svg("g", {});
      sheet.appendChild(g);
      if (taskKey === "bisect") { drawBisection(g, p, top - 20, 900); }
      else { drawCancellation(g, p, top + 44); }
    });
    describe();
  }

  /* --- Readout ----------------------------------------------------------- */

  function leftFoundFor(p) {
    var r = foundStars(p);
    return STARS.filter(function (s) { return s.x < 450 && r.found[s.i]; }).length;
  }

  function renderReadout() {
    readout.textContent = "";
    if (comparing) {
      /* The tiles must describe what is actually on screen. Leaving the
         previously selected profile's numbers here while two patients are
         drawn is worse than showing nothing. */
      var half = STAR_COUNT / 2;
      tile("Patient A, left half", leftFoundFor(PROFILES[1]) + " of " + half,
        "stars crossed out. Left neglect.");
      tile("Patient B, left half", leftFoundFor(PROFILES[2]) + " of " + half,
        "stars crossed out. Left field loss.");
      tile("Right half", half + " of " + half,
        "both patients, unaffected either way");
      return;
    }
    var p = profile();
    if (taskKey === "bisect") {
      var mm = Math.round(p.bisectBias * LINE_LENGTH_MM);
      tile("Who", p.label, p.role + ". " + p.blurb);
      tile("Deviation", (mm >= 0 ? "+" : "−") + Math.abs(mm) + " mm",
        mm > 6 ? "to the right of true centre, which is a clear deviation"
          : "to the right of true centre, which is within normal limits");
      tile("What it tells you",
        mm > 6 ? "something is wrong" : "nothing much",
        "on its own, bisection cannot say which condition this is");
    } else {
      var r = foundStars(p);
      var leftFound = STARS.filter(function (s) {
        return s.x < 450 && r.found[s.i];
      }).length;
      var rightFound = STARS.filter(function (s) {
        return s.x >= 450 && r.found[s.i];
      }).length;
      tile("Who", p.label, p.role + ". " + p.blurb);
      tile("Left half", leftFound + " of " + r.leftTotal, "stars crossed out");
      tile("Right half", rightFound + " of " + r.rightTotal, "stars crossed out");
    }
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
    var p = profile();
    if (comparing) {
      sentence.textContent = taskKey === "cancel"
        ? "Patient A leaves most of the left half untouched. Patient B finds " +
          "nearly all of it, because Patient B can turn and look and knows to " +
          "do so. Both of them have a problem on the left; only one of them " +
          "has a problem with attending to it."
        : "Both deviate to the right of true centre, and Patient A more than " +
          "Patient B. On this task alone you could not say which is which, " +
          "which is why cancellation is the more useful of the two.";
      return;
    }
    if (taskKey === "bisect") {
      sentence.textContent = p.key === "control"
        ? "A comparison mark, close to true centre. Everything below is judged " +
          "against this."
        : "The mark sits to the right of true centre. That is consistent with " +
          "neglect and it is also consistent with field loss, so on its own it " +
          "does not tell you which.";
      return;
    }
    sentence.textContent = p.key === "control"
      ? "Every star found, on both sides. Everything below is judged against this."
      : p.key === "neglect"
        ? "Most of the left half is untouched, and the head and eyes were free " +
          "to move the whole time."
        : "Nearly every star found, including on the left, although it took " +
          "longer: this person turned and looked.";
  }

  function describe() {
    var p = profile();
    if (comparing) {
      sheetDesc.textContent = "Two sheets one above the other, Patient A above " +
        "Patient B, both on the " +
        TASKS.filter(function (t) { return t.key === taskKey; })[0].label.toLowerCase() +
        " task. " + comparisonNumbers();
      return;
    }
    if (taskKey === "bisect") {
      var mm = Math.round(p.bisectBias * LINE_LENGTH_MM);
      sheetDesc.textContent = "A horizontal line with the true middle marked by " +
        "a dashed line, and this person's mark " + Math.abs(mm) +
        " millimetres to the " + (mm >= 0 ? "right" : "left") + " of it. " +
        p.label + " is the " + p.role.toLowerCase() + ".";
      return;
    }
    var r = foundStars(p);
    var leftFound = STARS.filter(function (s) { return s.x < 450 && r.found[s.i]; }).length;
    var rightFound = STARS.filter(function (s) { return s.x >= 450 && r.found[s.i]; }).length;
    sheetDesc.textContent = "A sheet of " + STAR_COUNT + " scattered stars with a " +
      "dashed midline. " + p.label + ", the " + p.role.toLowerCase() + ", crossed out " +
      leftFound + " of the " + r.leftTotal + " stars in the left half and " +
      rightFound + " of the " + r.rightTotal + " in the right half.";
  }

  function comparisonNumbers() {
    return [PROFILES[1], PROFILES[2]].map(function (p) {
      if (taskKey === "bisect") {
        return p.label + " deviated " + Math.round(p.bisectBias * LINE_LENGTH_MM) +
          " millimetres to the right";
      }
      var r = foundStars(p);
      var leftFound = STARS.filter(function (s) { return s.x < 450 && r.found[s.i]; }).length;
      return p.label + " crossed out " + leftFound + " of " + r.leftTotal +
        " stars on the left";
    }).join(", and ") + ".";
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    sheetLegend.textContent = taskKey === "bisect"
      ? "The dashed line is the true middle of the line. The solid mark is " +
        "where this person put theirs."
      : "A star crossed out was found. A solid dark star was left untouched. " +
        "The dashed line divides the sheet into left and right halves.";
    if (announce) { wb.announce(sentence.textContent); }
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildToggles(box, items, current, onPick, legendText) {
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = legendText;
    box.appendChild(legend);
    items.forEach(function (item) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", item.key === current ? "true" : "false");
      label.setAttribute("data-key", item.key);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = box.id;
      input.id = box.id + "-" + item.key;
      input.checked = item.key === current;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = item.label;
      var sub = document.createElement("span");
      sub.textContent = item.blurb || item.note;
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () {
        Array.prototype.forEach.call(box.querySelectorAll(".toggle"), function (l) {
          l.setAttribute("data-checked", l.getAttribute("data-key") === item.key ? "true" : "false");
        });
        onPick(item.key);
      });
      box.appendChild(label);
    });
  }

  function pickProfile(key) {
    profileKey = key;
    comparing = false;
    wb.hide("#note");
    changes += 1;
    if (changes >= 2) { explain.disabled = false; }
    refresh(true);
  }

  function pickTask(key) {
    taskKey = key;
    changes += 1;
    if (changes >= 2) { explain.disabled = false; }
    refresh(true);
  }

  compare.addEventListener("click", function () {
    comparing = true;
    taskKey = "cancel";
    buildToggles(taskBox, TASKS, taskKey, pickTask, "Which task?");
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "Both patients are on the cancellation sheet. Patient A, with neglect, " +
      "has left most of the left half untouched. Patient B, who has lost the " +
      "left half of the visual field in both eyes, has found nearly all of it. " +
      "Patient B cannot see the left without moving, and moves; Patient A can " +
      "see it perfectly well and does not attend to it. Switch the task to " +
      "line bisection and the two look much more alike, which is why " +
      "bisection alone will not separate them.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Both patients shown on the cancellation task.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    profileKey = "control"; taskKey = "bisect";
    comparing = false; changes = 0;
    buildToggles(profileBox, PROFILES, profileKey, pickProfile, "Who is doing the task?");
    buildToggles(taskBox, TASKS, taskKey, pickTask, "Which task?");
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
