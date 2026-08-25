/* =========================================================================
   Where the Cut Is — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/05-visual-field-defect-mapper/

   TEACHING JOB
   ------------
   Where the visual pathway is damaged determines the shape of the field
   defect, and the shape therefore locates the damage.

   WHAT IS PRESERVED
   -----------------
   The schematic pathway that updates, and the two field diagrams beside it.
   Both halves are needed: a defect drawn without the pathway is a picture to
   memorise, and a pathway drawn without the defect is anatomy without a
   consequence.

   THE FIVE SITES AND WHAT EACH PRODUCES
   -------------------------------------
       left optic nerve   everything the left eye sees, and nothing else
       optic chiasm       the crossing fibres from both eyes, which carry the
                          OUTER half of each eye's view: bitemporal
       left optic tract   the right half of the world in both eyes
       left Meyer's loop  the upper right quarter in both eyes
       left V1            the right half of the world in both eyes again

   The tract and V1 produce the same shape on purpose. A learner who notices
   that the mapping is many-to-one has understood something the forward
   exercise alone does not teach, and the readout says so.

   FIELD CONVENTION, WHICH IS THE EASY THING TO GET WRONG
   ------------------------------------------------------
   Each circle is drawn as the PERSON sees the world, so the left of the
   circle is the left of their view. For the left eye, the left of the view is
   its temporal half; for the right eye, the left of the view is its nasal
   half. Fibres from the nasal retina cross; nasal retina sees the temporal
   field. So the crossing fibres carry the OUTER side of each eye's view, and
   cutting the chiasm removes the outer side of both, not the same side of
   both.

   WHAT WAS REDUCED
   ----------------
   The backwards inference from a defect to the possible sites, macular
   sparing, and further sites along the pathway.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  /* Quadrants are named as the person sees them: UL is up and to their left. */
  var SITES = [
    {
      key: "none", label: "Nothing damaged", note: "The intact pathway.",
      left: [], right: [],
      name: "No field loss", verdict: "Both fields complete."
    },
    {
      key: "nerve", label: "Left optic nerve", note: "Before the crossing.",
      left: ["UL", "UR", "LL", "LR"], right: [],
      name: "Blindness of the left eye",
      verdict: "One eye only, because the nerve carries only that eye."
    },
    {
      key: "chiasm", label: "Optic chiasm", note: "At the crossing, in the middle.",
      left: ["UL", "LL"], right: ["UR", "LR"],
      name: "Bitemporal hemianopia",
      verdict: "The outer half of each eye's view. The only pattern that is not the same side in both."
    },
    {
      key: "tract", label: "Left optic tract", note: "Just after the crossing.",
      left: ["UR", "LR"], right: ["UR", "LR"],
      name: "Right homonymous hemianopia",
      verdict: "The same side missing in both eyes."
    },
    {
      key: "meyer", label: "Left temporal radiation", note: "Meyer's loop, further back.",
      left: ["UR"], right: ["UR"],
      name: "Right upper quadrantanopia",
      verdict: "A quarter, not a half, because upper and lower fibres have separated by here."
    },
    {
      key: "v1", label: "Left primary visual cortex", note: "The end of the pathway.",
      left: ["UR", "LR"], right: ["UR", "LR"],
      name: "Right homonymous hemianopia",
      verdict: "The same shape as an optic tract cut. The pattern narrows the site; it does not pin it down."
    }
  ];

  var INK = {
    line: "#1C7293", broken: "#C0434F", dark: "#1A2744",
    seen: "#E8F1F5", edge: "#5F6878", label: "#1A2744"
  };

  var diagram = document.getElementById("diagram");
  var diagramDesc = document.getElementById("diagram-desc");
  var siteBox = document.getElementById("sites");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var showChiasm = document.getElementById("show-chiasm");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var siteKey = "none";
  var changes = 0;

  function site() { return SITES.filter(function (s) { return s.key === siteKey; })[0]; }

  /* --- Geometry ---------------------------------------------------------- */

  var EYE = { left: { x: 150, y: 70 }, right: { x: 480, y: 70 } };
  var CHIASM = { x: 315, y: 150 };
  var LGN = { left: { x: 150, y: 216 }, right: { x: 480, y: 216 } };
  var CORTEX = { left: { x: 150, y: 286 }, right: { x: 480, y: 286 } };
  var FIELD = { left: { x: 700, y: 110 }, right: { x: 700, y: 268 }, r: 58 };

  function render() {
    wb.clearFigure(diagram);
    diagram.setAttribute("viewBox", "0 0 900 380");
    var s = site();

    var head = svg("text", { x: 24, y: 22, class: "plot__label" });
    head.textContent = "The pathway";
    diagram.appendChild(head);
    var head2 = svg("text", { x: 620, y: 22, class: "plot__label" });
    head2.textContent = "What each eye sees";
    diagram.appendChild(head2);

    drawPathway(s);
    drawField("left", s.left, "Left eye");
    drawField("right", s.right, "Right eye");

    diagramDesc.textContent = describe(s);
  }

  function segment(a, b, broken) {
    diagram.appendChild(svg("line", {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: broken ? INK.broken : INK.line,
      "stroke-width": broken ? 4 : 5,
      "stroke-dasharray": broken ? "8 7" : null,
      "stroke-linecap": "round"
    }));
  }

  function drawPathway(s) {
    /* Eyes to chiasm. */
    segment(EYE.left, CHIASM, s.key === "nerve");
    segment(EYE.right, CHIASM, false);
    /* Chiasm to each side. The left tract carries the right of the world. */
    segment(CHIASM, LGN.left, s.key === "tract");
    segment(CHIASM, LGN.right, false);
    segment(LGN.left, CORTEX.left, s.key === "meyer" || s.key === "v1");
    segment(LGN.right, CORTEX.right, false);

    [["left", EYE.left, "Left eye"], ["right", EYE.right, "Right eye"]].forEach(function (e) {
      diagram.appendChild(svg("circle", {
        cx: e[1].x, cy: e[1].y, r: 22, fill: INK.seen, stroke: INK.line, "stroke-width": 3
      }));
      var t = svg("text", { x: e[1].x, y: e[1].y - 32, "text-anchor": "middle", class: "plot__tick" });
      t.textContent = e[2];
      diagram.appendChild(t);
    });

    diagram.appendChild(svg("circle", {
      cx: CHIASM.x, cy: CHIASM.y, r: 16, fill: "#FFFFFF", stroke: INK.line, "stroke-width": 3
    }));
    var ct = svg("text", { x: CHIASM.x, y: CHIASM.y + 34, "text-anchor": "middle", class: "plot__tick" });
    ct.textContent = "chiasm";
    diagram.appendChild(ct);

    [["left", CORTEX.left, "Left hemisphere"], ["right", CORTEX.right, "Right hemisphere"]]
      .forEach(function (c) {
        diagram.appendChild(svg("rect", {
          x: c[1].x - 68, y: c[1].y - 18, width: 136, height: 36, rx: 8,
          fill: INK.seen, stroke: INK.line, "stroke-width": 3
        }));
        var t = svg("text", { x: c[1].x, y: c[1].y + 5, "text-anchor": "middle", class: "plot__tick" });
        t.textContent = c[2];
        diagram.appendChild(t);
      });

    if (s.key !== "none") { markBreak(s); }
  }

  function markBreak(s) {
    var at = {
      nerve: mid(EYE.left, CHIASM),
      chiasm: CHIASM,
      tract: mid(CHIASM, LGN.left),
      meyer: mid(LGN.left, CORTEX.left),
      v1: CORTEX.left
    }[s.key];
    var size = 15;
    [[-1, -1, 1, 1], [1, -1, -1, 1]].forEach(function (d) {
      diagram.appendChild(svg("line", {
        x1: at.x + d[0] * size, y1: at.y + d[1] * size,
        x2: at.x + d[2] * size, y2: at.y + d[3] * size,
        stroke: INK.broken, "stroke-width": 5, "stroke-linecap": "round"
      }));
    });
    var tag = svg("text", {
      x: at.x, y: at.y - 24, "text-anchor": "middle",
      class: "plot__sub plot__over", fill: INK.broken
    });
    tag.textContent = "damage here";
    diagram.appendChild(tag);
  }

  function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }

  /* --- Field circles, drawn as the person sees the world ------------------ */

  var QUADRANTS = {
    UL: { dx: -1, dy: -1, name: "upper left" },
    UR: { dx: 1, dy: -1, name: "upper right" },
    LL: { dx: -1, dy: 1, name: "lower left" },
    LR: { dx: 1, dy: 1, name: "lower right" }
  };

  function drawField(which, lost, label) {
    var c = FIELD[which], r = FIELD.r;
    Object.keys(QUADRANTS).forEach(function (key) {
      var q = QUADRANTS[key];
      var gone = lost.indexOf(key) >= 0;
      var startAngle = q.dx > 0 ? (q.dy > 0 ? 0 : -90) : (q.dy > 0 ? 90 : 180);
      var a0 = startAngle * Math.PI / 180;
      var a1 = (startAngle + 90) * Math.PI / 180;
      var p = "M " + c.x + " " + c.y +
        " L " + (c.x + r * Math.cos(a0)).toFixed(1) + " " + (c.y + r * Math.sin(a0)).toFixed(1) +
        " A " + r + " " + r + " 0 0 1 " +
        (c.x + r * Math.cos(a1)).toFixed(1) + " " + (c.y + r * Math.sin(a1)).toFixed(1) + " Z";
      diagram.appendChild(svg("path", {
        d: p, fill: gone ? INK.dark : INK.seen,
        stroke: INK.edge, "stroke-width": 1.5
      }));
    });
    diagram.appendChild(svg("circle", {
      cx: c.x, cy: c.y, r: r, fill: "none", stroke: INK.edge, "stroke-width": 2
    }));
    var t = svg("text", { x: c.x, y: c.y - r - 12, "text-anchor": "middle", class: "plot__label" });
    t.textContent = label;
    diagram.appendChild(t);
    var l = svg("text", { x: c.x - r - 8, y: c.y + 4, "text-anchor": "end", class: "plot__tick" });
    l.textContent = "left";
    diagram.appendChild(l);
    var rr = svg("text", { x: c.x + r + 8, y: c.y + 4, class: "plot__tick" });
    rr.textContent = "right";
    diagram.appendChild(rr);
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderReadout() {
    var s = site();
    readout.textContent = "";
    tile("The defect", s.name, s.verdict);
    var lostCount = s.left.length + s.right.length;
    tile("How much is gone",
      lostCount === 0 ? "nothing" : lostCount + " of 8 quarters",
      lostCount === 0 ? "the pathway is intact"
        : "counting both eyes, four quarters each");
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
    var s = site();
    if (s.key === "none") {
      sentence.textContent = "Nothing is damaged, so both fields are complete. " +
        "Pick a site and watch which parts go dark.";
      return;
    }
    if (s.key === "nerve") {
      sentence.textContent = "The break is before the crossing, so only one eye " +
        "is affected. Any defect confined to one eye is in front of the chiasm.";
      return;
    }
    if (s.key === "chiasm") {
      sentence.textContent = "The break catches the crossing fibres from both " +
        "eyes. Those fibres carry the outer edge of each eye's view, so the " +
        "person loses the outside of both fields and keeps the middle. This is " +
        "the only pattern here that is not the same side in both eyes.";
      return;
    }
    sentence.textContent = "The break is after the crossing, so every fibre in " +
      "that bundle carries the right half of the world from both eyes. The same " +
      "side goes in both, which is what homonymous means." +
      (s.key === "meyer"
        ? " Here only the upper quarter goes, because upper and lower fibres " +
          "have separated by this point."
        : "");
  }

  function describe(s) {
    var parts = ["A schematic of the visual pathway from two eyes through the " +
      "chiasm to the two hemispheres, beside a circle for each eye's field."];
    parts.push(s.key === "none"
      ? "Nothing is damaged."
      : "The break is at the " + s.label.toLowerCase() + ".");
    parts.push(lostText("left", s.left));
    parts.push(lostText("right", s.right));
    parts.push("This pattern is called " + s.name.toLowerCase() + ".");
    return parts.join(" ");
  }

  function lostText(which, lost) {
    var eye = which === "left" ? "The left eye" : "The right eye";
    if (!lost.length) { return eye + " has a complete field."; }
    if (lost.length === 4) { return eye + " sees nothing at all."; }
    return eye + " has lost the " +
      lost.map(function (k) { return QUADRANTS[k].name; }).join(" and ") +
      " of its view.";
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildSites() {
    siteBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = "Where is the damage?";
    siteBox.appendChild(legend);
    SITES.forEach(function (s) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", s.key === siteKey ? "true" : "false");
      label.setAttribute("data-key", s.key);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "site";
      input.id = "site-" + s.key;
      input.checked = s.key === siteKey;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = s.label;
      var sub = document.createElement("span");
      sub.textContent = s.note;
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () { pick(s.key); });
      siteBox.appendChild(label);
    });
  }

  function pick(key) {
    siteKey = key;
    /* Move the radio itself as well as the label's mark. Calling pick() from
       a button rather than from a change event would otherwise leave the
       control showing one site while the diagram showed another. */
    SITES.forEach(function (s) {
      var input = document.getElementById("site-" + s.key);
      if (input) { input.checked = s.key === key; }
    });
    Array.prototype.forEach.call(siteBox.querySelectorAll(".toggle"), function (l) {
      l.setAttribute("data-checked", l.getAttribute("data-key") === key ? "true" : "false");
    });
    changes += 1;
    if (changes >= 2) { explain.disabled = false; }
    wb.hide("#note");
    refresh(true);
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    if (announce) { wb.announce(site().name + ". " + sentence.textContent); }
  }

  showChiasm.addEventListener("click", function () {
    pick("chiasm");
    changes += 1;
    explain.disabled = false;
    noteText.textContent =
      "Every other site here takes the same side out of both eyes, or one eye " +
      "entirely. The chiasm is the only one that takes a different side from " +
      "each: the left of the left eye's view and the right of the right eye's. " +
      "That is because the fibres crossing at that point are the ones carrying " +
      "the outer edge of each eye's view, and they are the only fibres from " +
      "both eyes that ever travel together before the crossing is complete. A " +
      "person with this pattern has lost their peripheral vision on both sides " +
      "and kept the middle, which is why it is often noticed late and often " +
      "first as bumping into things.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Chiasm selected. Bitemporal hemianopia.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    siteKey = "none"; changes = 0;
    buildSites();
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
