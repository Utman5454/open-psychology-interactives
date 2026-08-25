/* =========================================================================
   Network Disconnection Mapper — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/neuropsychology/tools/03-network-disconnection-mapper/

   TEACHING JOB
   ------------
   Two intact regions cannot work together if the pathway between them is cut,
   and the pattern of which tasks fail says whether the break is in a region
   or in a connection.

   WHAT IS PRESERVED
   -----------------
   The live network model. Breaking something and watching the consequence is
   the whole activity, and it cannot be replaced by a diagram of the finished
   answer.

   THE MODEL
   ---------
       regions    S  sound analysis
                  M  word meanings
                  P  speech planning
       pathways   S-M, M-P, S-P
       tasks      repeat a heard word        needs S, P and S-P
                  say what a heard word means needs S, M and S-M
                  name a pictured object      needs M, P and M-P

   Each task uses two regions and exactly one pathway, which is what makes the
   two kinds of break distinguishable:

       damage P    kills repetition AND naming, the two tasks sharing P
       cut  S-P    kills repetition ONLY, with S and P both intact

   That contrast is the entire teaching point and the geometry was chosen for
   it. Three regions is the smallest network in which it can be shown.

   WHAT WAS REDUCED
   ----------------
   A fourth region and task, pathways serving more than one pairing, and the
   backwards exercise inferring the break from the pattern.

   HONESTY ABOUT THE CARTOON
   -------------------------
   Real networks have more regions, bidirectional pathways serving several
   pairings, and enough redundancy that a single cut rarely produces a clean
   single-task failure. The caution says so first rather than last. What is
   defensible is the inference, not the anatomy.

   Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var REGIONS = [
    { key: "S", name: "Sound analysis", short: "Sound", x: 150, y: 90 },
    { key: "M", name: "Word meanings", short: "Meaning", x: 450, y: 250 },
    { key: "P", name: "Speech planning", short: "Planning", x: 750, y: 90 }
  ];
  var PATHS = [
    { key: "SM", from: "S", to: "M", name: "Sound to meaning" },
    { key: "MP", from: "M", to: "P", name: "Meaning to planning" },
    { key: "SP", from: "S", to: "P", name: "Sound to planning" }
  ];
  var TASKS = [
    { key: "repeat", name: "Repeat a heard word", regions: ["S", "P"], path: "SP" },
    { key: "comprehend", name: "Say what a heard word means", regions: ["S", "M"], path: "SM" },
    { key: "name", name: "Name a pictured object", regions: ["M", "P"], path: "MP" }
  ];

  var INK = {
    ok: "#1C7293", okFill: "#E8F1F5",
    broken: "#C0434F", brokenFill: "#FBEDEE",
    label: "#1A2744", muted: "#5F6878"
  };

  var network = document.getElementById("network");
  var networkDesc = document.getElementById("network-desc");
  var regionBox = document.getElementById("regions");
  var pathBox = document.getElementById("paths");
  var tasksBox = document.getElementById("tasks");
  var sentence = document.getElementById("sentence");
  var showMe = document.getElementById("show-me");
  var explain = document.getElementById("explain");
  var taskNote = document.getElementById("task-note");
  var taskNoteText = document.getElementById("task-note-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var damaged = {};
  var cut = {};
  var changes = 0;

  function regionAt(key) {
    return REGIONS.filter(function (r) { return r.key === key; })[0];
  }
  function taskWorks(task) {
    return task.regions.every(function (r) { return !damaged[r]; }) && !cut[task.path];
  }

  /* --- Controls ---------------------------------------------------------- */

  function buildToggles(box, items, state, kind) {
    box.textContent = "";
    var legend = document.createElement("legend");
    legend.className = "field-legend";
    legend.textContent = kind === "region" ? "Damage a region" : "Cut a pathway";
    box.appendChild(legend);
    items.forEach(function (item) {
      var label = document.createElement("label");
      label.className = "toggle";
      label.setAttribute("data-checked", "false");
      label.setAttribute("data-for", item.key);
      var input = document.createElement("input");
      input.type = "checkbox";
      input.id = kind + "-" + item.key;
      var span = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = item.name;
      var note = document.createElement("span");
      note.textContent = kind === "region" ? "Damage this region" : "Cut this pathway";
      span.appendChild(strong);
      span.appendChild(note);
      label.appendChild(input);
      label.appendChild(span);
      input.addEventListener("change", function () {
        state[item.key] = input.checked;
        label.setAttribute("data-checked", input.checked ? "true" : "false");
        changes += 1;
        if (changes >= 2) { explain.disabled = false; }
        wb.hide("#task-note");
        refresh(true);
      });
      box.appendChild(label);
    });
  }

  /* --- The figure -------------------------------------------------------- */

  function render() {
    wb.clearFigure(network);
    network.setAttribute("viewBox", "0 0 900 360");

    var title = svg("text", { x: 30, y: 26, class: "plot__label" });
    title.textContent = "The network as it stands";
    network.appendChild(title);

    /* Pathways first, so a node always sits on top of its own lines. */
    PATHS.forEach(function (path) {
      var a = regionAt(path.from), b = regionAt(path.to);
      var isCut = !!cut[path.key];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (isCut) {
        /* Drawn as two stubs with a gap, so the break is visible in shape
           and not only in colour. */
        network.appendChild(svg("line", {
          x1: a.x, y1: a.y, x2: (a.x + (mx - a.x) * 0.68).toFixed(1),
          y2: (a.y + (my - a.y) * 0.68).toFixed(1),
          stroke: INK.broken, "stroke-width": 5, "stroke-linecap": "round"
        }));
        network.appendChild(svg("line", {
          x1: (b.x + (mx - b.x) * 0.68).toFixed(1), y1: (b.y + (my - b.y) * 0.68).toFixed(1),
          x2: b.x, y2: b.y,
          stroke: INK.broken, "stroke-width": 5, "stroke-linecap": "round"
        }));
        cross(mx, my, 13, INK.broken);
      } else {
        network.appendChild(svg("line", {
          x1: a.x, y1: a.y, x2: b.x, y2: b.y,
          stroke: INK.ok, "stroke-width": 5, "stroke-linecap": "round"
        }));
      }
    });

    REGIONS.forEach(function (region) {
      var isDamaged = !!damaged[region.key];
      var circle = svg("circle", {
        cx: region.x, cy: region.y, r: 54,
        fill: isDamaged ? INK.brokenFill : INK.okFill,
        stroke: isDamaged ? INK.broken : INK.ok,
        "stroke-width": 4
      });
      if (isDamaged) { circle.setAttribute("stroke-dasharray", "9 7"); }
      network.appendChild(circle);
      var text = svg("text", {
        x: region.x, y: region.y + 6, "text-anchor": "middle",
        class: "plot__label", fill: INK.label
      });
      text.textContent = region.short;
      network.appendChild(text);
      if (isDamaged) { cross(region.x, region.y - 74, 13, INK.broken); }
    });

    networkDesc.textContent = describe();
  }

  function cross(x, y, size, colour) {
    network.appendChild(svg("line", {
      x1: x - size, y1: y - size, x2: x + size, y2: y + size,
      stroke: colour, "stroke-width": 5, "stroke-linecap": "round"
    }));
    network.appendChild(svg("line", {
      x1: x + size, y1: y - size, x2: x - size, y2: y + size,
      stroke: colour, "stroke-width": 5, "stroke-linecap": "round"
    }));
  }

  function describe() {
    var brokenRegions = REGIONS.filter(function (r) { return damaged[r.key]; });
    var cutPaths = PATHS.filter(function (p) { return cut[p.key]; });
    var parts = [];
    parts.push("Three regions, " +
      REGIONS.map(function (r) { return r.name; }).join(", ") +
      ", joined by three pathways.");
    parts.push(brokenRegions.length
      ? "Damaged " + (brokenRegions.length === 1 ? "region: " : "regions: ") +
        brokenRegions.map(function (r) { return r.name; }).join(" and ") + "."
      : "No region is damaged.");
    parts.push(cutPaths.length
      ? "Cut " + (cutPaths.length === 1 ? "pathway: " : "pathways: ") +
        cutPaths.map(function (p) { return p.name; }).join(" and ") + "."
      : "No pathway is cut.");
    var failing = TASKS.filter(function (t) { return !taskWorks(t); });
    parts.push(failing.length
      ? "Failing: " + failing.map(function (t) { return t.name.toLowerCase(); }).join("; ") + "."
      : "All three tasks work.");
    return parts.join(" ");
  }

  /* --- The readout ------------------------------------------------------- */

  function renderTasks() {
    tasksBox.textContent = "";
    TASKS.forEach(function (task) {
      var works = taskWorks(task);
      var item = document.createElement("li");
      item.className = "result";
      item.setAttribute("data-state", works ? "correct" : "incorrect");
      var strong = document.createElement("strong");
      strong.textContent = task.name;
      var big = document.createElement("div");
      big.className = "big big--small";
      big.textContent = works ? "works" : "fails";
      var span = document.createElement("span");
      span.textContent = works
        ? "needs " + task.regions.map(function (r) { return regionAt(r).short.toLowerCase(); }).join(" and ") +
          ", and the pathway between them"
        : reasonFor(task);
      item.appendChild(strong); item.appendChild(big); item.appendChild(span);
      tasksBox.appendChild(item);
    });
  }

  function reasonFor(task) {
    var brokenRegions = task.regions.filter(function (r) { return damaged[r]; });
    if (brokenRegions.length && cut[task.path]) {
      return "both the region and the pathway it needs are broken";
    }
    if (brokenRegions.length) {
      return brokenRegions.map(function (r) { return regionAt(r).name.toLowerCase(); }).join(" and ") +
        " is damaged";
    }
    return "both regions are intact, but the pathway between them is cut";
  }

  function renderSentence() {
    var failing = TASKS.filter(function (t) { return !taskWorks(t); });
    var pureDisconnection = failing.length && failing.every(function (t) {
      return !t.regions.some(function (r) { return damaged[r]; });
    });
    if (!failing.length) {
      sentence.textContent = "Everything is intact, so all three tasks work. " +
        "Break something and watch which ones notice.";
      return;
    }
    if (pureDisconnection) {
      sentence.textContent =
        "Every region on this diagram is undamaged, and " +
        (failing.length === 1 ? "one task" : failing.length + " tasks") +
        " has stopped working anyway. A scan looking only at the regions would " +
        "find nothing to explain it.";
      return;
    }
    var damagedNames = REGIONS.filter(function (r) { return damaged[r.key]; })
      .map(function (r) { return r.name.toLowerCase(); });
    sentence.textContent =
      "With " + damagedNames.join(" and ") + " damaged, " +
      (failing.length === 1 ? "one task fails" : failing.length + " tasks fail") +
      ": the ones that need " +
      (damagedNames.length === 1 ? "it" : "them") + ".";
  }

  function refresh(announce) {
    render();
    renderTasks();
    renderSentence();
    if (announce) { wb.announce(sentence.textContent); }
  }

  /* --- The case that matters --------------------------------------------- */

  showMe.addEventListener("click", function () {
    REGIONS.forEach(function (r) {
      damaged[r.key] = false;
      var input = document.getElementById("region-" + r.key);
      input.checked = false;
      input.parentNode.setAttribute("data-checked", "false");
    });
    PATHS.forEach(function (p) {
      var on = p.key === "SP";
      cut[p.key] = on;
      var input = document.getElementById("path-" + p.key);
      input.checked = on;
      input.parentNode.setAttribute("data-checked", on ? "true" : "false");
    });
    changes += 1;
    explain.disabled = false;
    refresh(false);
    taskNoteText.textContent =
      "The pathway from sound analysis to speech planning is cut and nothing " +
      "else is. Repeating a heard word has stopped, while understanding what " +
      "a word means and naming a picture both still work. Both of the regions " +
      "repetition needs are undamaged, so a scan of the grey matter would show " +
      "nothing wrong with either of them. Now compare it with damaging speech " +
      "planning instead: that takes out repeating and naming together, because " +
      "those are the two tasks that share it. The pattern of what fails is " +
      "what tells the two apart.";
    wb.show("#task-note");
    wb.scrollTo("#task-note");
    wb.announce("The sound to planning pathway is cut. Repetition has failed " +
      "with both its regions intact.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  /* --- Wiring ------------------------------------------------------------ */

  function doReset() {
    damaged = {}; cut = {}; changes = 0;
    buildToggles(regionBox, REGIONS, damaged, "region");
    buildToggles(pathBox, PATHS, cut, "path");
    explain.disabled = true;
    wb.hide("#task-note");
    wb.hide("#synthesis");
    refresh(false);
  }

  wb.onReset(doReset);
  doReset();
})();
