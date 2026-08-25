/* =========================================================================
   Where Recognition Breaks — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/neuropsychology/tools/10-face-recognition-prosopagnosia-detective/

   TEACHING JOB
   ------------
   Recognising a person is several steps in order, and where the break is
   determines which questions the person can still answer.

   WHAT IS PRESERVED
   -----------------
   The forward simulation: place a difficulty at one component and read the
   profile it produces. The learner has to be able to move the break and watch
   the profile change, because the signature is the point.

   THE MODEL
   ---------
       perception -> familiarity -> identity -> name
                  \
                   -> expression        (a branch, not a step in the chain)

   A question can be answered if every step it needs is intact. Steps are
   ordered, so impairing one fails everything downstream of it. Expression
   branches off after perception, which is why it survives an impairment that
   destroys identification.

   WHAT WAS REDUCED
   ----------------
   A sixth component, covert recognition, and the backwards inference from a
   profile to the component.

   HONESTY, ON THE PAGE
   --------------------
   A box-and-arrow model is a summary of which abilities come apart, not a map
   of the brain, and a neat sequence overstates how orderly the process is.
   The caution says so, and says that the model earns its place by predicting
   which profiles should exist.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var COMPONENTS = [
    { key: "none", label: "Nothing impaired", note: "The intact model." },
    { key: "perception", label: "Face perception", note: "Reading the structure of the face." },
    { key: "familiarity", label: "Familiarity", note: "Have I seen this face before?" },
    { key: "identity", label: "Identity", note: "What do I know about them?" },
    { key: "name", label: "Name", note: "What are they called?" },
    { key: "expression", label: "Expression", note: "What are they feeling?" }
  ];

  /* The ordered chain, and the branch. */
  var CHAIN = ["perception", "familiarity", "identity", "name"];

  var QUESTIONS = [
    {
      key: "match", label: "Are these two photographs the same stranger?",
      needs: ["perception"]
    },
    {
      key: "familiar", label: "Does this face look familiar?",
      needs: ["perception", "familiarity"]
    },
    {
      key: "who", label: "What do you know about them?",
      needs: ["perception", "familiarity", "identity"]
    },
    {
      key: "name", label: "What is their name?",
      needs: ["perception", "familiarity", "identity", "name"]
    },
    {
      key: "expression", label: "What are they feeling?",
      needs: ["perception", "expression"]
    }
  ];

  var model = document.getElementById("model");
  var modelDesc = document.getElementById("model-desc");
  var componentBox = document.getElementById("components");
  var answersBox = document.getElementById("answers");
  var sentence = document.getElementById("sentence");
  var showCase = document.getElementById("show-case");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var impaired = "none";
  var changes = 0;

  function broken(step) { return step === impaired; }
  function canAnswer(q) {
    return q.needs.every(function (step) { return !broken(step); });
  }
  function componentOf(key) {
    return COMPONENTS.filter(function (c) { return c.key === key; })[0];
  }

  /* --- The figure -------------------------------------------------------- */

  var BOX = { w: 168, h: 62 };
  var CHAIN_Y = 92;
  var BRANCH_Y = 218;

  function xFor(i) { return 60 + i * 200; }

  function render() {
    wb.clearFigure(model);
    model.setAttribute("viewBox", "0 0 900 300");

    var title = svg("text", { x: 24, y: 26, class: "plot__label" });
    title.textContent = "The steps, in order";
    model.appendChild(title);

    /* Arrows along the chain. */
    CHAIN.forEach(function (step, i) {
      if (i === 0) { return; }
      arrow(xFor(i - 1) + BOX.w, CHAIN_Y + BOX.h / 2, xFor(i), CHAIN_Y + BOX.h / 2);
    });
    /* The branch, from perception down to expression. */
    arrow(xFor(0) + BOX.w / 2, CHAIN_Y + BOX.h, xFor(0) + BOX.w / 2, BRANCH_Y);

    CHAIN.forEach(function (step, i) { drawBox(step, xFor(i), CHAIN_Y); });
    drawBox("expression", xFor(0), BRANCH_Y);

    var t = svg("text", { x: xFor(0) + BOX.w + 16, y: BRANCH_Y + 36, class: "plot__tick" });
    t.textContent = "a branch, not a step in the chain";
    model.appendChild(t);

    modelDesc.textContent = describe();
  }

  function arrow(x1, y1, x2, y2) {
    model.appendChild(svg("line", {
      x1: x1, y1: y1, x2: x2, y2: y2,
      stroke: "#5F6878", "stroke-width": 3, "stroke-linecap": "round"
    }));
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ux = dx / len, uy = dy / len;
    var px = -uy, py = ux;
    model.appendChild(svg("polygon", {
      points: [
        x2 + "," + y2,
        (x2 - 12 * ux + 6 * px) + "," + (y2 - 12 * uy + 6 * py),
        (x2 - 12 * ux - 6 * px) + "," + (y2 - 12 * uy - 6 * py)
      ].join(" "),
      fill: "#5F6878"
    }));
  }

  function drawBox(step, x, y) {
    var isBroken = broken(step);
    var rect = svg("rect", {
      x: x, y: y, width: BOX.w, height: BOX.h, rx: 10,
      fill: isBroken ? "#FBEDEE" : "#E8F1F5",
      stroke: isBroken ? "#C0434F" : "#1C7293",
      "stroke-width": 3
    });
    if (isBroken) { rect.setAttribute("stroke-dasharray", "9 7"); }
    model.appendChild(rect);
    var label = svg("text", {
      x: x + BOX.w / 2, y: y + BOX.h / 2 + 5, "text-anchor": "middle", class: "plot__label"
    });
    label.textContent = componentOf(step).label;
    model.appendChild(label);
    if (isBroken) {
      [[-1, -1, 1, 1], [1, -1, -1, 1]].forEach(function (d) {
        model.appendChild(svg("line", {
          x1: x + BOX.w / 2 + d[0] * 13, y1: y - 18 + d[1] * 13,
          x2: x + BOX.w / 2 + d[2] * 13, y2: y - 18 + d[3] * 13,
          stroke: "#C0434F", "stroke-width": 5, "stroke-linecap": "round"
        }));
      });
    }
  }

  function describe() {
    var parts = ["Four steps in a row, face perception then familiarity then " +
      "identity then name, with expression branching off after face perception."];
    parts.push(impaired === "none"
      ? "Nothing is impaired."
      : componentOf(impaired).label + " is impaired.");
    var fail = QUESTIONS.filter(function (q) { return !canAnswer(q); });
    parts.push(fail.length
      ? "Cannot answer: " + fail.map(function (q) {
        return q.label.toLowerCase().replace(/\?$/, ""); }).join("; ") + "."
      : "Every question can still be answered.");
    return parts.join(" ");
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderAnswers() {
    answersBox.textContent = "";
    QUESTIONS.forEach(function (q) {
      var ok = canAnswer(q);
      var item = document.createElement("li");
      item.className = "result";
      item.setAttribute("data-state", ok ? "correct" : "incorrect");
      var strong = document.createElement("strong");
      strong.textContent = q.label;
      var big = document.createElement("div");
      big.className = "big big--small";
      big.textContent = ok ? "can" : "cannot";
      var span = document.createElement("span");
      span.textContent = ok
        ? "needs " + q.needs.map(function (s) {
          return componentOf(s).label.toLowerCase(); }).join(", then ") +
          ", all intact"
        : componentOf(impaired).label.toLowerCase() + " is needed for this and is impaired";
      item.appendChild(strong); item.appendChild(big); item.appendChild(span);
      answersBox.appendChild(item);
    });
  }

  var STORY = {
    none: "Nothing is impaired, so every question can be answered. Break one " +
      "step and watch which questions go with it.",
    perception: "The break is at the very first step, so nothing downstream " +
      "works and even telling two photographs of a stranger apart fails. " +
      "Expression goes too, because it also needs the face to be perceived " +
      "first. This is the most complete version and the rarest.",
    familiarity: "Faces are seen perfectly well and none of them feels " +
      "familiar. Two photographs of a stranger can still be matched, which is " +
      "the finding that separates this from a problem with seeing faces at " +
      "all, and expression is untouched.",
    identity: "Faces feel familiar and nothing can be said about anybody. " +
      "This is the person who knows they have met you and cannot say where " +
      "or how, which is a different complaint from not recognising you.",
    name: "Everything is intact except the last step. The person knows exactly " +
      "who you are and what you do, and cannot produce your name. This is the " +
      "mildest version, and the one everybody experiences from time to time.",
    expression: "Identification is entirely intact: the person knows who you " +
      "are and can name you. What they cannot do is say what you are feeling. " +
      "That is the dissociation the branch was proposed to explain."
  };

  function renderSentence() { sentence.textContent = STORY[impaired]; }

  function refresh(announce) {
    render();
    renderAnswers();
    renderSentence();
    if (announce) { wb.announce(sentence.textContent); }
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildControls() {
    componentBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = "Which step is impaired?";
    componentBox.appendChild(legend);
    COMPONENTS.forEach(function (c) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", c.key === impaired ? "true" : "false");
      label.setAttribute("data-key", c.key);
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "component";
      input.id = "component-" + c.key;
      input.checked = c.key === impaired;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = c.label;
      var sub = document.createElement("span");
      sub.textContent = c.note;
      span.appendChild(strong); span.appendChild(sub);
      label.appendChild(input); label.appendChild(span);
      input.addEventListener("change", function () { pick(c.key); });
      componentBox.appendChild(label);
    });
  }

  function pick(key) {
    impaired = key;
    COMPONENTS.forEach(function (c) {
      var input = document.getElementById("component-" + c.key);
      if (input) { input.checked = c.key === key; }
    });
    Array.prototype.forEach.call(componentBox.querySelectorAll(".toggle"), function (l) {
      l.setAttribute("data-checked", l.getAttribute("data-key") === key ? "true" : "false");
    });
    changes += 1;
    if (changes >= 2) { explain.disabled = false; }
    wb.hide("#note");
    refresh(true);
  }

  showCase.addEventListener("click", function () {
    pick("familiarity");
    changes += 1;
    explain.disabled = false;
    noteText.textContent =
      "This is the profile the word usually refers to. Faces are seen " +
      "perfectly well, and two photographs of a stranger can still be matched, " +
      "so this is not a problem with vision or with faces as shapes. What is " +
      "missing is the sense that a face has been seen before, so nobody feels " +
      "familiar, including people the person knows well. Notice what survives: " +
      "expression is untouched, so they can tell you how you are feeling while " +
      "having no idea who you are, and voices, gait and clothing are not in " +
      "this model at all, which is how many people manage day to day.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Familiarity impaired.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    impaired = "none"; changes = 0;
    buildControls();
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
