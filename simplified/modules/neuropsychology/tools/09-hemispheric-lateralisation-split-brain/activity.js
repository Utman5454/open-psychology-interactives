/* =========================================================================
   Building a Split-Brain Trial — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/neuropsychology/tools/09-hemispheric-lateralisation-split-brain/

   TEACHING JOB
   ------------
   The classic split-brain result depends on four conditions holding at once,
   and changing any one of them makes it disappear.

   WHAT IS PRESERVED
   -----------------
   The trial builder. The finding is about a procedure as much as about a
   brain, so the learner has to be able to assemble the procedure and take it
   apart again.

       side       left of fixation goes to the RIGHT hemisphere
       response   speech is produced by the left hemisphere
                  the left hand is controlled by the right hemisphere
                  the right hand by the left hemisphere
       callosum   intact means either hemisphere can use what the other has
       exposure   brief means only the receiving hemisphere gets it;
                  long enough to look means both do, whatever the callosum

   A trial succeeds when the hemisphere that can produce the requested
   response has the word.

   THE EXPOSURE CONTROL IS THE POINT
   ---------------------------------
   It is the condition students never think of, and it is the one that shows
   the finding is not a fact about a divided brain in ordinary life. Take away
   the brief presentation and the person simply looks at the word.

   WHAT WAS REDUCED
   ----------------
   Cross-cueing, further response channels, chimeric stimuli, and the record
   of conditions switched off one at a time.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var CONTROLS = {
    side: {
      legend: "Which side of the cross does the word appear?",
      options: [
        { key: "left", label: "Left of the cross", note: "Goes to the right hemisphere." },
        { key: "right", label: "Right of the cross", note: "Goes to the left hemisphere." }
      ]
    },
    response: {
      legend: "How do you ask them to answer?",
      options: [
        { key: "speak", label: "Say the word", note: "Speech comes from the left hemisphere." },
        { key: "leftHand", label: "Point with the left hand", note: "Controlled by the right hemisphere." },
        { key: "rightHand", label: "Point with the right hand", note: "Controlled by the left hemisphere." }
      ]
    },
    callosum: {
      legend: "Is the corpus callosum intact?",
      options: [
        { key: "intact", label: "Intact", note: "The hemispheres can share." },
        { key: "cut", label: "Cut", note: "They cannot." }
      ]
    },
    exposure: {
      legend: "How long is the word up for?",
      options: [
        { key: "brief", label: "A fraction of a second", note: "Too brief to move the eyes." },
        { key: "long", label: "Long enough to look at it", note: "The eyes can move to it." }
      ]
    }
  };

  /* Which hemisphere can produce each response. */
  var RESPONSE_HEMISPHERE = { speak: "left", leftHand: "right", rightHand: "left" };
  var RESPONSE_NAME = {
    speak: "say the word", leftHand: "point with the left hand",
    rightHand: "point with the right hand"
  };

  var state = { side: "right", response: "speak", callosum: "intact", exposure: "brief" };
  var changes = 0;

  var diagram = document.getElementById("diagram");
  var diagramDesc = document.getElementById("diagram-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var classic = document.getElementById("classic");
  var breakIt = document.getElementById("break-it");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  /* --- The model --------------------------------------------------------- */

  /* Which hemispheres end up holding the word. */
  function hemispheresWithWord() {
    var receiving = state.side === "left" ? "right" : "left";
    if (state.exposure === "long") { return ["left", "right"]; }
    if (state.callosum === "intact") { return ["left", "right"]; }
    return [receiving];
  }

  function outcome() {
    var have = hemispheresWithWord();
    var needed = RESPONSE_HEMISPHERE[state.response];
    return {
      have: have,
      needed: needed,
      works: have.indexOf(needed) >= 0,
      receiving: state.side === "left" ? "right" : "left"
    };
  }

  /* --- The figure -------------------------------------------------------- */

  var HEMI = { left: { x: 250, y: 190 }, right: { x: 600, y: 190 } };

  function render() {
    var o = outcome();
    wb.clearFigure(diagram);
    diagram.setAttribute("viewBox", "0 0 900 340");

    var title = svg("text", { x: 24, y: 24, class: "plot__label" });
    title.textContent = "One trial";
    diagram.appendChild(title);

    /* Fixation and the word. */
    var crossX = 425;
    diagram.appendChild(svg("line", {
      x1: crossX - 10, y1: 62, x2: crossX + 10, y2: 62,
      stroke: "#1A2744", "stroke-width": 3, "stroke-linecap": "round"
    }));
    diagram.appendChild(svg("line", {
      x1: crossX, y1: 52, x2: crossX, y2: 72,
      stroke: "#1A2744", "stroke-width": 3, "stroke-linecap": "round"
    }));
    var wordX = state.side === "left" ? crossX - 150 : crossX + 150;
    var word = svg("text", {
      x: wordX, y: 68, "text-anchor": "middle", class: "plot__label", fill: "#C0434F"
    });
    word.textContent = "SPOON";
    diagram.appendChild(word);
    var wordNote = svg("text", {
      x: wordX, y: 92, "text-anchor": "middle", class: "plot__tick"
    });
    wordNote.textContent = state.exposure === "brief"
      ? "shown too briefly to look at" : "shown long enough to look at";
    diagram.appendChild(wordNote);

    /* Arrow from the word to the receiving hemisphere. */
    var target = HEMI[o.receiving];
    diagram.appendChild(svg("line", {
      x1: wordX, y1: 104, x2: target.x, y2: target.y - 46,
      stroke: "#C0434F", "stroke-width": 3, "stroke-dasharray": "6 5"
    }));

    /* The two hemispheres. */
    ["left", "right"].forEach(function (side) {
      var h = HEMI[side];
      var has = o.have.indexOf(side) >= 0;
      diagram.appendChild(svg("rect", {
        x: h.x - 110, y: h.y - 44, width: 220, height: 88, rx: 14,
        fill: has ? "#E8F1F5" : "#FFFFFF",
        stroke: "#1C7293", "stroke-width": 3
      }));
      var name = svg("text", { x: h.x, y: h.y - 12, "text-anchor": "middle", class: "plot__label" });
      name.textContent = (side === "left" ? "Left" : "Right") + " hemisphere";
      diagram.appendChild(name);
      var got = svg("text", { x: h.x, y: h.y + 14, "text-anchor": "middle", class: "plot__tick" });
      got.textContent = has ? "has the word" : "does not have the word";
      diagram.appendChild(got);
      var can = svg("text", { x: h.x, y: h.y + 34, "text-anchor": "middle", class: "plot__tick" });
      can.textContent = RESPONSE_HEMISPHERE[state.response] === side
        ? "can " + RESPONSE_NAME[state.response] : "";
      diagram.appendChild(can);
    });

    /* The callosum. */
    var bridgeY = HEMI.left.y;
    var x1 = HEMI.left.x + 110, x2 = HEMI.right.x - 110;
    if (state.callosum === "intact") {
      diagram.appendChild(svg("line", {
        x1: x1, y1: bridgeY, x2: x2, y2: bridgeY,
        stroke: "#1C7293", "stroke-width": 6, "stroke-linecap": "round"
      }));
    } else {
      var m = (x1 + x2) / 2;
      diagram.appendChild(svg("line", {
        x1: x1, y1: bridgeY, x2: m - 16, y2: bridgeY,
        stroke: "#C0434F", "stroke-width": 6, "stroke-linecap": "round"
      }));
      diagram.appendChild(svg("line", {
        x1: m + 16, y1: bridgeY, x2: x2, y2: bridgeY,
        stroke: "#C0434F", "stroke-width": 6, "stroke-linecap": "round"
      }));
      [[-1, -1, 1, 1], [1, -1, -1, 1]].forEach(function (d) {
        diagram.appendChild(svg("line", {
          x1: m + d[0] * 11, y1: bridgeY + d[1] * 11,
          x2: m + d[2] * 11, y2: bridgeY + d[3] * 11,
          stroke: "#C0434F", "stroke-width": 4, "stroke-linecap": "round"
        }));
      });
    }
    var bridgeTag = svg("text", {
      x: (x1 + x2) / 2, y: bridgeY - 20, "text-anchor": "middle", class: "plot__tick"
    });
    bridgeTag.textContent = state.callosum === "intact" ? "callosum intact" : "callosum cut";
    diagram.appendChild(bridgeTag);

    /* The response channel. */
    var from = HEMI[RESPONSE_HEMISPHERE[state.response]];
    diagram.appendChild(svg("line", {
      x1: from.x, y1: from.y + 44, x2: from.x, y2: 292,
      stroke: o.works ? "#25634F" : "#C0434F", "stroke-width": 4,
      "stroke-dasharray": o.works ? null : "7 6"
    }));
    var outBox = svg("rect", {
      x: from.x - 150, y: 292, width: 300, height: 34, rx: 8,
      fill: o.works ? "#EAF3EF" : "#FBEDEE",
      stroke: o.works ? "#25634F" : "#C0434F", "stroke-width": 2.5
    });
    diagram.appendChild(outBox);
    var outText = svg("text", { x: from.x, y: 314, "text-anchor": "middle", class: "plot__label" });
    outText.textContent = o.works
      ? "Answers: SPOON" : "Cannot answer this way";
    diagram.appendChild(outText);

    diagramDesc.textContent = describe(o);
  }

  function describe(o) {
    return "The word SPOON appears " + (state.side === "left" ? "left" : "right") +
      " of a fixation cross, " +
      (state.exposure === "brief" ? "too briefly to look at" : "long enough to look at") +
      ", so it reaches the " + o.receiving + " hemisphere first. The corpus " +
      "callosum is " + (state.callosum === "intact" ? "intact" : "cut") + ". " +
      (o.have.length === 2
        ? "Both hemispheres have the word."
        : "Only the " + o.have[0] + " hemisphere has the word.") +
      " The requested answer, to " + RESPONSE_NAME[state.response] +
      ", is produced by the " + o.needed + " hemisphere, which " +
      (o.works ? "does have it, so the person answers correctly."
        : "does not have it, so the person cannot answer this way.");
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderReadout() {
    var o = outcome();
    readout.textContent = "";
    var item = document.createElement("li");
    item.className = "result";
    item.setAttribute("data-state", o.works ? "correct" : "incorrect");
    var strong = document.createElement("strong");
    strong.textContent = "What happens";
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = o.works ? "Answers correctly" : "Cannot answer";
    var span = document.createElement("span");
    span.textContent = o.works
      ? "the " + o.needed + " hemisphere has the word and can produce this response"
      : "the " + o.needed + " hemisphere must produce this response and does not have the word";
    item.appendChild(strong); item.appendChild(big); item.appendChild(span);
    readout.appendChild(item);

    var second = document.createElement("li");
    second.className = "result";
    var s2 = document.createElement("strong");
    s2.textContent = "Who has the word";
    var b2 = document.createElement("div");
    b2.className = "big big--small";
    b2.textContent = o.have.length === 2 ? "Both" :
      (o.have[0] === "left" ? "Left only" : "Right only");
    var n2 = document.createElement("span");
    n2.textContent = o.have.length === 2
      ? (state.exposure === "long"
        ? "because the eyes could move to it"
        : "because the callosum passed it across")
      : "because the callosum is cut and the exposure was too brief";
    second.appendChild(s2); second.appendChild(b2); second.appendChild(n2);
    readout.appendChild(second);
  }

  function renderSentence() {
    var o = outcome();
    if (state.exposure === "long") {
      sentence.textContent = "The word was up long enough to look at, so both " +
        "hemispheres received it whatever the callosum is doing. Nothing " +
        "unusual can happen in this condition, which is why the brief " +
        "presentation is not a technical detail but the whole procedure.";
      return;
    }
    if (state.callosum === "intact") {
      sentence.textContent = "The callosum passed the word to the other side, " +
        "so it does not matter which hemisphere received it. This is what " +
        "happens in almost everybody.";
      return;
    }
    sentence.textContent = o.works
      ? "The hemisphere that received the word is also the one that can produce " +
        "the answer you asked for, so the trial works even with the callosum cut."
      : "The word went to the " + o.receiving + " hemisphere and the answer you " +
        "asked for has to come from the " + o.needed + " one. With the callosum " +
        "cut there is no way across, so the person cannot answer, and will often " +
        "say they saw nothing at all.";
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    if (announce) {
      wb.announce((outcome().works ? "Answers correctly. " : "Cannot answer. ") +
        sentence.textContent);
    }
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildControl(id) {
    var box = document.getElementById(id);
    var spec = CONTROLS[id];
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = spec.legend;
    box.appendChild(legend);
    spec.options.forEach(function (opt) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", state[id] === opt.key ? "true" : "false");
      label.setAttribute("data-key", opt.key);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = id;
      input.id = id + "-" + opt.key;
      input.checked = state[id] === opt.key;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = opt.label;
      var sub = document.createElement("span");
      sub.textContent = opt.note;
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () { set(id, opt.key); });
      box.appendChild(label);
    });
  }

  function set(id, key, quiet) {
    state[id] = key;
    var box = document.getElementById(id);
    CONTROLS[id].options.forEach(function (opt) {
      var input = document.getElementById(id + "-" + opt.key);
      if (input) { input.checked = opt.key === key; }
    });
    Array.prototype.forEach.call(box.querySelectorAll(".toggle"), function (l) {
      l.setAttribute("data-checked", l.getAttribute("data-key") === key ? "true" : "false");
    });
    if (!quiet) {
      changes += 1;
      if (changes >= 2) { explain.disabled = false; }
      wb.hide("#note");
      refresh(true);
    }
  }

  classic.addEventListener("click", function () {
    set("side", "left", true);
    set("response", "speak", true);
    set("callosum", "cut", true);
    set("exposure", "brief", true);
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "This is the trial everyone has heard about. The word went to the right " +
      "hemisphere, which cannot speak, and the callosum cannot pass it to the " +
      "left. The person says they saw nothing. Now change the response to " +
      "pointing with the left hand, which the right hemisphere controls, and " +
      "the same person picks the spoon out immediately. Nothing about what they " +
      "took in has changed; only which hemisphere you asked.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("The classic trial. Cannot answer.");
  });

  breakIt.addEventListener("click", function () {
    set("exposure", "long", true);
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "The only thing changed is how long the word was up. The person can now " +
      "move their eyes to it, so it lands in both halves of the visual field " +
      "and both hemispheres receive it, and the cut callosum makes no " +
      "difference at all. This is why these patients are largely unremarkable " +
      "outside a laboratory: ordinary life does not present things for a " +
      "fraction of a second while you hold your gaze still.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Exposure lengthened. The finding disappears.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    state = { side: "right", response: "speak", callosum: "intact", exposure: "brief" };
    changes = 0;
    ["side", "response", "callosum", "exposure"].forEach(buildControl);
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
