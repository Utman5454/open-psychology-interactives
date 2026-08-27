/* =========================================================================
   What One Score Hides — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/08-executive-function-task-laboratory/

   TEACHING JOB
   ------------
   Executive tasks are impure, so a single composite score can stay put while
   what is actually wrong underneath changes completely.

   WHAT IS PRESERVED
   -----------------
   The live model: capacities in, task scores out, with weights that differ
   across tasks. The learner has to be able to move a capacity and watch which
   tasks notice, because that is what impurity means.

       task score = sum over capacities of (weight * capacity) / sum of weights
       composite  = mean of the three task scores

   THE WEIGHTS ARE INVENTED AND THE PAGE SAYS SO
   ---------------------------------------------
   Real tasks do not decompose into four capacities with fixed weights, and
   how separable the capacities are is an argument rather than a fact. The
   caution says this rather than implying the model is a finding.

   THE TWIN
   --------
   The button finds a different capacity profile with the same composite to
   within a point. It is the demonstration: two people, one number, nothing in
   common. It searches rather than using a stored answer, so it works from
   wherever the learner has left the sliders.

   WHAT WAS REDUCED
   ----------------
   Two more capacities, a fourth task, and the prediction stage on which
   processes each task requires.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var CAPACITIES = [
    { key: "inhibition", label: "Inhibition" },
    { key: "switching", label: "Switching" },
    { key: "updating", label: "Updating" },
    { key: "planning", label: "Planning" }
  ];

  /* Deliberately different profiles of demand. A task that loaded on
     everything equally could not distinguish anything. */
  var TASKS = [
    {
      key: "stopSignal", label: "Stop-signal task",
      weights: { inhibition: 6, switching: 1, updating: 1, planning: 0 }
    },
    {
      key: "cardSort", label: "Card sorting",
      weights: { inhibition: 2, switching: 6, updating: 2, planning: 1 }
    },
    {
      key: "towerTask", label: "Tower task",
      weights: { inhibition: 1, switching: 1, updating: 3, planning: 6 }
    }
  ];

  var capacityBox = document.getElementById("capacities");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var twin = document.getElementById("twin");
  var explain = document.getElementById("explain");
  var note = document.getElementById("note");
  var noteText = document.getElementById("note-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var values = {};
  var ranges = [];
  var changes = 0;

  function taskScore(task, vals) {
    var total = 0, weight = 0;
    CAPACITIES.forEach(function (c) {
      var w = task.weights[c.key];
      total += w * vals[c.key];
      weight += w;
    });
    return weight ? total / weight : 0;
  }
  function scores(vals) {
    return TASKS.map(function (t) { return { task: t, score: taskScore(t, vals) }; });
  }
  function composite(vals) {
    var s = scores(vals);
    return s.reduce(function (a, x) { return a + x.score; }, 0) / s.length;
  }
  function snapshot() {
    var out = {};
    CAPACITIES.forEach(function (c) { out[c.key] = values[c.key]; });
    return out;
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildControls() {
    capacityBox.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "The four capacities";
    capacityBox.appendChild(legend);
    ranges = [];
    CAPACITIES.forEach(function (c) {
      var wrap = document.createElement("div");
      wrap.className = "control";
      var head = document.createElement("div");
      head.className = "control__header";
      var label = document.createElement("label");
      label.className = "control__label";
      label.setAttribute("for", "cap-" + c.key);
      label.textContent = c.label;
      var out = document.createElement("output");
      out.className = "control__value";
      out.setAttribute("for", "cap-" + c.key);
      out.textContent = String(values[c.key]);
      head.appendChild(label); head.appendChild(out);
      var input = document.createElement("input");
      input.type = "range";
      input.id = "cap-" + c.key;
      input.min = "0"; input.max = "100"; input.step = "5";
      input.value = String(values[c.key]);
      var hint = document.createElement("p");
      hint.className = "control__hint";
      hint.textContent = "100 is typical, 0 is severely impaired.";
      wrap.appendChild(head); wrap.appendChild(input); wrap.appendChild(hint);
      capacityBox.appendChild(wrap);
      input.addEventListener("input", function () {
        values[c.key] = Number(input.value);
        out.textContent = input.value;
        render();
      });
      input.addEventListener("change", function () {
        values[c.key] = Number(input.value);
        out.textContent = input.value;
        changes += 1;
        if (changes >= 2) { explain.disabled = false; }
        wb.hide("#note");
        refresh(true);
      });
      ranges.push({ input: input, out: out });
    });
  }

  function syncControls() {
    ranges.forEach(function (r, i) {
      r.input.value = String(values[CAPACITIES[i].key]);
      r.out.textContent = r.input.value;
    });
  }

  /* --- The figure -------------------------------------------------------- */

  function render() {
    var LEFT = 220, RIGHT = 780, TOP = 54, ROW = 44;
    var s = scores(values);
    var comp = composite(values);
    var gap = 34;
    var capTop = TOP + TASKS.length * ROW + gap + 26;
    var BASE = capTop + CAPACITIES.length * ROW;
    var X = function (v) { return LEFT + (v / 100) * (RIGHT - LEFT); };

    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BASE + 54));

    var h1 = svg("text", { x: 24, y: 26, class: "plot__label" });
    h1.textContent = "Task scores, out of 100";
    chart.appendChild(h1);

    s.forEach(function (row, i) {
      var y = TOP + i * ROW;
      bar(chart, LEFT, X, y, row.task.label, row.score, "#1C7293");
    });

    var h2 = svg("text", { x: 24, y: capTop - 22, class: "plot__label" });
    h2.textContent = "The capacities you set";
    chart.appendChild(h2);

    CAPACITIES.forEach(function (c, i) {
      var y = capTop + i * ROW;
      bar(chart, LEFT, X, y, c.label, values[c.key], "#9E7318");
    });

    /* The composite, drawn as a line across the task bars so it is visibly an
       average of them rather than a fourth measurement. */
    chart.appendChild(svg("line", {
      x1: X(comp).toFixed(1), y1: TOP - 10,
      x2: X(comp).toFixed(1), y2: TOP + TASKS.length * ROW - 8,
      stroke: "#C0434F", "stroke-width": 3, "stroke-dasharray": "6 5"
    }));
    var compTag = svg("text", {
      x: X(comp).toFixed(1), y: TOP - 16, "text-anchor": "middle",
      class: "plot__sub plot__over", fill: "#C0434F"
    });
    compTag.textContent = "composite " + Math.round(comp);
    chart.appendChild(compTag);

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    [0, 50, 100].forEach(function (v) {
      var tick = svg("text", { x: X(v).toFixed(1), y: BASE + 24, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    chartDesc.textContent =
      "Three task scores above four capacity settings, all out of 100. " +
      s.map(function (r) { return r.task.label + " " + Math.round(r.score); }).join(", ") +
      ". The composite, their mean, is " + Math.round(comp) + ". The capacities are set to " +
      CAPACITIES.map(function (c) { return c.label.toLowerCase() + " " + values[c.key]; }).join(", ") + ".";
  }

  function bar(target, LEFT, X, y, label, value, colour) {
    var t = svg("text", { x: LEFT - 14, y: y + 20, "text-anchor": "end", class: "plot__label" });
    t.textContent = label;
    target.appendChild(t);
    target.appendChild(svg("rect", {
      x: LEFT, y: y + 2, width: Math.max(2, X(value) - LEFT).toFixed(1),
      height: 24, rx: 4, fill: colour, "fill-opacity": "0.8"
    }));
    var v = svg("text", { x: (X(value) + 10).toFixed(1), y: y + 20, class: "plot__sub" });
    v.textContent = Math.round(value);
    target.appendChild(v);
  }

  /* --- Readout ----------------------------------------------------------- */

  function renderReadout() {
    var s = scores(values);
    var comp = composite(values);
    var lowest = s.slice().sort(function (a, b) { return a.score - b.score; })[0];
    var spread = Math.round(
      Math.max.apply(null, s.map(function (r) { return r.score; })) -
      Math.min.apply(null, s.map(function (r) { return r.score; })));
    readout.textContent = "";
    tile("Composite score", String(Math.round(comp)),
      "the mean of the three tasks, and the number most often reported");
    tile("Spread across tasks", String(spread) + " points",
      spread < 8
        ? "the three tasks agree, so the composite is not hiding much"
        : "the three tasks disagree, and the lowest is " + lowest.task.label.toLowerCase());
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
    var low = CAPACITIES.slice().sort(function (a, b) {
      return values[a.key] - values[b.key]; })[0];
    var s = scores(values);
    var worst = s.slice().sort(function (a, b) { return a.score - b.score; })[0];
    if (values[low.key] >= 85) {
      sentence.textContent = "All four capacities are near typical, so all " +
        "three tasks are too. Pull one capacity down and watch which tasks " +
        "notice and which do not.";
      return;
    }
    sentence.textContent = low.label + " is the weakest capacity, at " +
      values[low.key] + ". The task that suffers most is " +
      worst.task.label.toLowerCase() + ", because it leans on " +
      low.label.toLowerCase() + " more heavily than the others do. Notice that " +
      "the other two tasks have not fallen nearly as far, which is what makes " +
      "the pattern across tasks informative and the average of them not.";
  }

  function refresh(announce) {
    render();
    renderReadout();
    renderSentence();
    if (announce) {
      wb.announce("Composite " + Math.round(composite(values)) + ". " +
        scores(values).map(function (r) {
          return r.task.label + " " + Math.round(r.score); }).join(", ") + ".");
    }
  }

  /* --- The twin ---------------------------------------------------------- */

  /* Search the grid of settings for a profile with the same composite and a
     genuinely different shape. Searched rather than stored so it works from
     wherever the learner has left the sliders. */
  /* One grid point, judged. Kept out of the four loops so that findTwin()
     reads as "walk the grid" and this reads as "is this the profile we are
     after": the shape furthest from where the sliders are now whose composite
     still rounds to the same reported number. */
  function considerCandidate(best, target, here, cand) {
    if (Math.round(composite(cand)) !== target) { return best; }
    var distance = CAPACITIES.reduce(function (sum, cap) {
      return sum + Math.abs(cand[cap.key] - here[cap.key]);
    }, 0);
    if (best && distance <= best.distance) { return best; }
    return { values: cand, distance: distance };
  }

  function findTwin() {
    /* Match the composite as REPORTED, not as computed. A tolerance here lets
       the displayed number move by a point while the note claims it is the
       same, which is exactly the kind of small dishonesty the activity is
       arguing against. */
    var target = Math.round(composite(values));
    var here = snapshot();
    var best = null;
    var step = 10;
    for (var a = 0; a <= 100; a += step) {
      for (var b = 0; b <= 100; b += step) {
        for (var c = 0; c <= 100; c += step) {
          for (var d = 0; d <= 100; d += step) {
            best = considerCandidate(best, target, here,
              { inhibition: a, switching: b, updating: c, planning: d });
          }
        }
      }
    }
    return best;
  }

  twin.addEventListener("click", function () {
    var before = snapshot();
    var beforeComposite = Math.round(composite(before));
    var found = findTwin();
    if (!found || found.distance < 40) {
      noteText.textContent =
        "No usefully different profile has this composite, which happens when " +
        "every capacity is already near the top or the bottom. Pull one or two " +
        "of them into the middle and try again.";
      wb.show("#note");
      wb.announce("No different profile with this composite.");
      return;
    }
    CAPACITIES.forEach(function (c) { values[c.key] = found.values[c.key]; });
    syncControls();
    changes += 1;
    explain.disabled = false;
    refresh(false);
    noteText.textContent =
      "Same composite, " + beforeComposite + ", and a different person. Before: " +
      CAPACITIES.map(function (c) {
        return c.label.toLowerCase() + " " + before[c.key]; }).join(", ") +
      ". Now: " + CAPACITIES.map(function (c) {
        return c.label.toLowerCase() + " " + values[c.key]; }).join(", ") +
      ". The one number reported in a letter would be identical for these two " +
      "people, and what would help them is not the same thing.";
    wb.show("#note");
    wb.scrollTo("#note");
    wb.announce("Found a different profile with the same composite of " +
      beforeComposite + ".");
  });

  explain.addEventListener("click", function () {
    var s = scores(values);
    document.getElementById("result-lead").textContent =
      "On the settings you have now, the three tasks score " +
      s.map(function (r) { return Math.round(r.score); }).join(", ") +
      ", and the composite is " + Math.round(composite(values)) +
      ". Those three numbers contain information the one number does not.";
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  function doReset() {
    CAPACITIES.forEach(function (c) { values[c.key] = 100; });
    changes = 0;
    buildControls();
    explain.disabled = true;
    wb.hide("#note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
