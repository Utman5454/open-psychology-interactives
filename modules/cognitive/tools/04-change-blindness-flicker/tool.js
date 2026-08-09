/* =========================================================================
   Change Blindness — the flicker paradigm
   -------------------------------------------------------------------------
   Two versions of an original vector street scene alternate. With a blank
   between them the change is hard to find; without the blank it is trivial.
   The learner searches, says when they have it, and then identifies what
   changed from six options.

   THE SCENES
   ----------
   Each scene is generated deterministically from a fixed seed: a sky, a sun,
   three clouds, four buildings with grids of lit and unlit windows, three
   trees and a fence. Nothing is drawn from a photograph or any other source.

   Four trials, each varying the change on three declared dimensions:

       1  a whole tree removed          presence  central      large
       2  one window's light flipped    state     peripheral   small
       3  a building's height changed   size      peripheral   large
       4  a cloud moved sideways        position  upper centre medium

   Those three properties are DECLARED in the trial table rather than
   manipulated factorially: with one scene each they are completely confounded,
   and the results panel says so rather than inviting a comparison the design
   cannot support.

   FLICKER SAFETY AND PACING
   -------------------------
   The automatic cycle is view 600 ms, blank 250 ms, view 600 ms, blank 250 ms
   — 1.7 seconds in total, so the screen changes about 1.2 times a second. The
   threshold associated with photosensitive reactions is three per second, so
   this sits comfortably below it, and the change is far slower than the
   standard laboratory paradigm on purpose.

   Three further protections:
     * a Pause button is available throughout;
     * a MANUAL mode advances only on a button press or the space bar;
     * prefers-reduced-motion starts the tool in manual mode and says so.

   The phenomenon does not depend on speed. It depends on the blank, which is
   what the "Put a blank between the two versions" checkbox turns on and off —
   and that switch is the entire experiment.

   ONE SCENE, ONE USE
   ------------------
   Once a change has been revealed, running that scene again measures memory
   for where the change was. The tool marks used scenes, keeps the record
   across a reset, and provides a demonstrator route that reveals all four
   without spending any of them.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var VIEW_W = 640;
  var VIEW_H = 360;
  var GROUND_Y = 282;

  var VIEW_MS = 600;
  var BLANK_MS = 250;

  /* =======================================================================
     Seeded randomness
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* =======================================================================
     Scene generation
     ===================================================================== */

  function buildScene(seed) {
    var rand = mulberry32(seed);

    var buildings = [];
    var x = 24;
    while (buildings.length < 4) {
      var w = 88 + Math.floor(rand() * 52);
      var h = 96 + Math.floor(rand() * 92);
      var cols = Math.max(2, Math.floor(w / 34));
      var rows = Math.max(2, Math.floor(h / 42));
      var windows = [];
      for (var c = 0; c < cols; c += 1) {
        for (var r = 0; r < rows; r += 1) {
          windows.push({ col: c, row: r, lit: rand() < 0.45 });
        }
      }
      buildings.push({ x: x, w: w, h: h, cols: cols, rows: rows, windows: windows });
      x += w + 12 + Math.floor(rand() * 18);
    }

    var trees = [];
    for (var t = 0; t < 3; t += 1) {
      trees.push({
        x: 90 + t * 190 + Math.floor(rand() * 40),
        h: 46 + Math.floor(rand() * 34)
      });
    }

    var clouds = [];
    for (var cl = 0; cl < 3; cl += 1) {
      clouds.push({
        x: 70 + cl * 190 + Math.floor(rand() * 50),
        y: 34 + Math.floor(rand() * 30),
        scale: 0.85 + rand() * 0.5
      });
    }

    return {
      sun: { x: 578, y: 46, r: 20 },
      clouds: clouds,
      buildings: buildings,
      trees: trees,
      fencePosts: 26
    };
  }

  function cloneScene(scene) {
    return JSON.parse(JSON.stringify(scene));
  }

  /* =======================================================================
     The four trials
     ===================================================================== */

  var TRIALS = [
    {
      id: "tree",
      name: "Scene 1 — a whole object",
      seed: 20260911,
      changeKind: "Presence",
      where: "Centre",
      size: "Large",
      answer: "tree",
      apply: function (scene) {
        var removed = scene.trees.splice(1, 1)[0];
        return {
          scene: scene,
          focus: { x: removed.x, y: GROUND_Y - removed.h - 14, r: removed.h * 0.7 + 18 },
          text: "The middle tree is there in one version and gone in the other."
        };
      }
    },
    {
      id: "window",
      name: "Scene 2 — a small detail",
      seed: 20260912,
      changeKind: "State",
      where: "Right edge",
      size: "Small",
      answer: "window",
      apply: function (scene) {
        var building = scene.buildings[3];
        var target = building.windows[Math.floor(building.windows.length / 2)];
        target.lit = !target.lit;
        var geometry = windowRect(building, target);
        return {
          scene: scene,
          focus: { x: geometry.x + geometry.w / 2, y: geometry.y + geometry.h / 2, r: 34 },
          text: "One window on the rightmost building is lit in one version " +
            "and unlit in the other."
        };
      }
    },
    {
      id: "building",
      name: "Scene 3 — a large area",
      seed: 20260913,
      changeKind: "Size",
      where: "Left edge",
      size: "Large",
      answer: "building",
      apply: function (scene) {
        var building = scene.buildings[0];
        building.h += 48;
        building.rows += 1;
        for (var c = 0; c < building.cols; c += 1) {
          building.windows.push({ col: c, row: building.rows - 1, lit: c % 2 === 0 });
        }
        return {
          scene: scene,
          focus: { x: building.x + building.w / 2, y: GROUND_Y - building.h + 30, r: 62 },
          text: "The leftmost building is taller in one version, with an extra " +
            "row of windows."
        };
      }
    },
    {
      id: "cloud",
      name: "Scene 4 — something that moves",
      seed: 20260914,
      changeKind: "Position",
      where: "Upper centre",
      size: "Medium",
      answer: "cloud",
      apply: function (scene) {
        var cloud = scene.clouds[1];
        cloud.x += 96;
        return {
          scene: scene,
          focus: { x: cloud.x - 48, y: cloud.y, r: 92 },
          text: "The middle cloud sits about a hundred units further right in " +
            "one version than the other."
        };
      }
    }
  ];

  var IDENTIFY_OPTIONS = [
    ["tree", "A whole tree is there in one version and not the other"],
    ["window", "A window changed between lit and unlit"],
    ["building", "A building changed height"],
    ["cloud", "A cloud moved sideways"],
    ["sun", "The sun changed size"],
    ["fence", "Part of the fence disappeared"]
  ];

  /* =======================================================================
     Drawing
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function windowRect(building, win) {
    var padX = 8;
    var cellW = (building.w - padX * 2) / building.cols;
    var cellH = 34;
    return {
      x: building.x + padX + win.col * cellW + cellW * 0.18,
      y: GROUND_Y - building.h + 14 + win.row * cellH,
      w: cellW * 0.64,
      h: cellH * 0.55
    };
  }

  function drawScene(node, scene, options) {
    clear(node);
    var settings = options || {};

    svgNode("rect", { x: 0, y: 0, width: VIEW_W, height: GROUND_Y, class: "scene__sky" }, node);
    svgNode("circle", {
      cx: scene.sun.x, cy: scene.sun.y, r: scene.sun.r, class: "scene__sun"
    }, node);

    scene.clouds.forEach(function (cloud) {
      [[-22, 4, 15], [0, -4, 20], [22, 4, 15]].forEach(function (blob) {
        svgNode("circle", {
          cx: (cloud.x + blob[0] * cloud.scale).toFixed(1),
          cy: (cloud.y + blob[1] * cloud.scale).toFixed(1),
          r: (blob[2] * cloud.scale).toFixed(1),
          class: "scene__cloud"
        }, node);
      });
    });

    scene.buildings.forEach(function (building) {
      svgNode("rect", {
        x: building.x, y: GROUND_Y - building.h,
        width: building.w, height: building.h, class: "scene__building"
      }, node);
      building.windows.forEach(function (win) {
        var geometry = windowRect(building, win);
        if (geometry.y + geometry.h > GROUND_Y - 6) { return; }
        svgNode("rect", {
          x: geometry.x.toFixed(1), y: geometry.y.toFixed(1),
          width: geometry.w.toFixed(1), height: geometry.h.toFixed(1),
          class: win.lit ? "scene__window-lit" : "scene__window-dark"
        }, node);
      });
    });

    scene.trees.forEach(function (tree) {
      svgNode("rect", {
        x: tree.x - 5, y: GROUND_Y - tree.h, width: 10, height: tree.h,
        class: "scene__trunk"
      }, node);
      svgNode("circle", {
        cx: tree.x, cy: GROUND_Y - tree.h - 8, r: (tree.h * 0.45).toFixed(1),
        class: "scene__canopy"
      }, node);
    });

    svgNode("rect", {
      x: 0, y: GROUND_Y, width: VIEW_W, height: VIEW_H - GROUND_Y,
      class: "scene__ground"
    }, node);

    var gap = VIEW_W / scene.fencePosts;
    for (var i = 0; i < scene.fencePosts; i += 1) {
      svgNode("rect", {
        x: (i * gap + gap * 0.25).toFixed(1), y: GROUND_Y + 12,
        width: (gap * 0.32).toFixed(1), height: 30, class: "scene__fence"
      }, node);
    }

    if (settings.focus) {
      svgNode("circle", {
        cx: settings.focus.x.toFixed(1),
        cy: settings.focus.y.toFixed(1),
        r: Math.max(28, settings.focus.r).toFixed(1),
        class: "scene__marker"
      }, node);
    }
  }

  function drawBlank(node) {
    clear(node);
    svgNode("rect", {
      x: 0, y: 0, width: VIEW_W, height: VIEW_H, class: "scene__blank"
    }, node);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#flicker");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var sceneSelect = $("#scene-select");
  var sceneHint = $("[data-scene-hint]");
  var blankCheck = $("#blank-check");
  var paceSelect = $("#pace-select");
  var startButton = $('[data-action="start"]');
  var pauseButton = $('[data-action="pause"]');
  var giveUpButton = $('[data-action="give-up"]');
  var demonstratorButton = $('[data-action="demonstrator"]');
  var stepButton = $('[data-action="step"]');
  var foundButton = $('[data-action="found"]');

  var sceneSvg = $("[data-scene]");
  var sceneCaption = $("[data-scene-caption]");
  var runStatus = $("[data-run-status]");
  var runControls = $("[data-run-controls]");
  var identifyForm = $("[data-identify-form]");
  var identifyOptions = $("[data-identify-options]");
  var identifyError = $("[data-identify-error]");
  var trialFeedback = $("[data-trial-feedback]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var revealSvg = $("[data-reveal-svg]");
  var revealCaption = $("[data-reveal-caption]");
  var revealText = $("[data-reveal-text]");
  var trialTable = $("[data-trial-table]");
  var trialSummary = $("[data-trial-summary]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var cycleTimer = null;

  function currentTrial() {
    return TRIALS.filter(function (t) { return t.id === sceneSelect.value; })[0] || TRIALS[0];
  }

  function prepareTrial(trial) {
    var base = buildScene(trial.seed);
    var changed = trial.apply(cloneScene(base));
    return { base: base, changed: changed.scene, focus: changed.focus, text: changed.text };
  }

  function fillSceneSelect() {
    // The option labels change as scenes are used, so the list is rebuilt —
    // but the current selection must survive that, or finishing a trial
    // silently switches the learner to a different scene.
    var previous = sceneSelect.value;
    clear(sceneSelect);
    TRIALS.forEach(function (trial) {
      var option = make("option", null, trial.name +
        (state.used.indexOf(trial.id) === -1 ? "" : " (change already revealed)"));
      option.value = trial.id;
      sceneSelect.appendChild(option);
    });
    if (previous) { sceneSelect.value = previous; }
  }

  function updateSceneHint() {
    var trial = currentTrial();
    sceneHint.textContent = trial.changeKind + " change, " +
      trial.where.toLowerCase() + ", " + trial.size.toLowerCase() + ". " +
      (state.used.indexOf(trial.id) === -1
        ? "Not yet revealed."
        : "Already revealed — running it again measures your memory for where it was, not change blindness.");
  }

  /* --- The alternation ------------------------------------------------- */

  function stopCycle() {
    if (cycleTimer !== null) { window.clearTimeout(cycleTimer); cycleTimer = null; }
  }

  var SEQUENCE_WITH_BLANK = ["a", "blank", "b", "blank"];
  var SEQUENCE_NO_BLANK = ["a", "b"];

  function sequence() {
    return state.blank ? SEQUENCE_WITH_BLANK : SEQUENCE_NO_BLANK;
  }

  function renderFrame() {
    var frame = sequence()[state.frame % sequence().length];
    if (frame === "blank") {
      drawBlank(sceneSvg);
    } else {
      drawScene(sceneSvg, frame === "a" ? state.prepared.base : state.prepared.changed);
    }
  }

  function advance() {
    state.frame += 1;
    renderFrame();
  }

  function scheduleNext() {
    stopCycle();
    if (state.phase !== "running" || state.pace !== "auto") { return; }
    var frame = sequence()[state.frame % sequence().length];
    cycleTimer = window.setTimeout(function () {
      advance();
      scheduleNext();
    }, frame === "blank" ? BLANK_MS : VIEW_MS);
  }

  function startTrial() {
    var trial = currentTrial();
    stopCycle();
    trialFeedback.hidden = true;
    identifyForm.hidden = true;
    identifyError.hidden = true;

    state.trial = trial;
    state.prepared = prepareTrial(trial);
    state.blank = blankCheck.checked;
    state.pace = paceSelect.value;
    state.frame = 0;
    state.startedAt = (window.performance || Date).now();
    state.phase = "running";
    state.paused = false;

    sceneSelect.disabled = true;
    blankCheck.disabled = true;
    paceSelect.disabled = true;
    startButton.disabled = true;
    pauseButton.disabled = state.pace !== "auto";
    pauseButton.textContent = "Pause";
    giveUpButton.disabled = false;

    runControls.hidden = false;
    stepButton.hidden = state.pace !== "manual";
    foundButton.disabled = false;

    renderFrame();
    sceneCaption.textContent = state.blank
      ? "Two versions alternating, with a blank between them."
      : "Two versions alternating directly, with no blank.";
    runStatus.textContent = "Searching. Press \"I can see it\" the moment you have it.";
    shell.announce(state.pace === "manual"
      ? "Trial started in manual mode. Press Next view, or the space bar, to advance."
      : "Trial started. Press \"I can see it\" when you find the change.",
      { immediate: true });

    scheduleNext();
    if (state.pace === "manual") { stepButton.focus(); } else { foundButton.focus(); }
  }

  stepButton.addEventListener("click", function () {
    if (state.phase === "running" && state.pace === "manual") { advance(); }
  });

  document.addEventListener("keydown", function (event) {
    if (state && state.phase === "running" && state.pace === "manual" &&
        (event.key === " " || event.key === "Spacebar")) {
      // Only intercept the space bar when it is not being used to press a
      // control that already has focus.
      var active = document.activeElement;
      if (active && (active.tagName === "BUTTON" || active.tagName === "INPUT" ||
        active.tagName === "SELECT" || active.tagName === "TEXTAREA")) { return; }
      event.preventDefault();
      advance();
    }
  });

  pauseButton.addEventListener("click", function () {
    if (state.phase !== "running") { return; }
    state.paused = !state.paused;
    if (state.paused) {
      stopCycle();
      pauseButton.textContent = "Resume";
      shell.announce("Paused.", { immediate: true });
    } else {
      pauseButton.textContent = "Pause";
      scheduleNext();
      shell.announce("Resumed.", { immediate: true });
    }
  });

  foundButton.addEventListener("click", function () { finishSearch(false); });
  giveUpButton.addEventListener("click", function () { finishSearch(true); });

  function finishSearch(gaveUp) {
    if (state.phase !== "running") { return; }
    stopCycle();
    state.phase = "identifying";
    state.elapsedMs = (window.performance || Date).now() - state.startedAt;
    state.gaveUp = gaveUp;
    runControls.hidden = true;
    giveUpButton.disabled = true;
    pauseButton.disabled = true;
    drawScene(sceneSvg, state.prepared.base);
    sceneCaption.textContent = "Alternation stopped.";

    if (gaveUp) {
      recordTrial(null);
      return;
    }

    renderIdentifyOptions();
    identifyForm.hidden = false;
    runStatus.textContent = "Now say what changed.";
    identifyForm.querySelector("input").focus();
    shell.announce("Stopped after " + (state.elapsedMs / 1000).toFixed(1) +
      " seconds. Now say what changed.", { immediate: true });
  }

  function renderIdentifyOptions() {
    clear(identifyOptions);
    IDENTIFY_OPTIONS.forEach(function (option, index) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "identify";
      input.value = option[0];
      input.id = "identify-" + index;
      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + option[1]));
      identifyOptions.appendChild(label);
    });
  }

  identifyForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="identify"]:checked', identifyForm);
    if (!answer) {
      identifyError.textContent = "Choose one before going on.";
      identifyError.hidden = false;
      return;
    }
    identifyError.hidden = true;
    identifyForm.hidden = true;
    recordTrial(answer.value);
  });

  function recordTrial(answer) {
    var trial = state.trial;
    var correct = answer === trial.answer;

    state.records.push({
      trialId: trial.id,
      name: trial.name,
      changeKind: trial.changeKind,
      where: trial.where,
      size: trial.size,
      blank: state.blank,
      seconds: state.elapsedMs / 1000,
      gaveUp: state.gaveUp,
      correct: correct
    });

    if (state.used.indexOf(trial.id) === -1) { state.used.push(trial.id); }

    showReveal(correct, answer);
    resetControlsForNextTrial();
  }

  function resetControlsForNextTrial() {
    state.phase = "idle";
    sceneSelect.disabled = false;
    blankCheck.disabled = false;
    paceSelect.disabled = false;
    startButton.disabled = false;
    pauseButton.disabled = true;
    giveUpButton.disabled = true;
    fillSceneSelect();
    updateSceneHint();
    runStatus.textContent = "Trial finished. Choose another scene, or run this " +
      "one again with the blank switched off.";
  }

  /* --- Reveal and results ---------------------------------------------- */

  function showReveal(correct, answer) {
    var trial = state.trial;
    drawScene(revealSvg, state.prepared.changed, { focus: state.prepared.focus });
    revealCaption.textContent = trial.name + " — the changed version, with the " +
      "change ringed";
    revealText.textContent = state.prepared.text;

    clear(resultsBody);

    if (state.gaveUp) {
      resultsBody.appendChild(make("p", "reveal__lead",
        "You gave up after " + (state.elapsedMs / 1000).toFixed(1) + " seconds" +
        (state.blank ? " with the blank." : " with no blank.")));
      resultsBody.appendChild(make("p", null, state.blank
        ? "An ordinary outcome with the blank on — published versions cut " +
          "trials off at a time limit for the same reason. The change is " +
          "ringed. Now run the same scene with the blank off."
        : "Unusual with the blank off: the direct swap makes a local " +
          "flicker at the change and nowhere else, which normally pulls the " +
          "eye straight to it. Check you were watching as it swapped."));
    } else {
      resultsBody.appendChild(make("p", "reveal__lead",
        (correct ? "Correct — " : "Not that one — ") +
        (state.elapsedMs / 1000).toFixed(1) + " seconds" +
        (state.blank ? " with the blank." : " with no blank.")));
      if (!correct) {
        resultsBody.appendChild(make("p", null,
          "You answered \"" + describeAnswer(answer) + "\". " +
          state.prepared.text + " Stopping the search before you have located " +
          "the change is common: the sense that you have found something " +
          "arrives before the identification does."));
      }
    }

    var withBlank = state.records.filter(function (r) { return r.blank && !r.gaveUp; });
    var withoutBlank = state.records.filter(function (r) { return !r.blank && !r.gaveUp; });

    if (withBlank.length && withoutBlank.length) {
      var meanWith = average(withBlank.map(function (r) { return r.seconds; }));
      var meanWithout = average(withoutBlank.map(function (r) { return r.seconds; }));
      resultsBody.appendChild(make("p", null,
        "Across your trials so far: " + meanWith.toFixed(1) + " seconds on " +
        "average with the blank, " + meanWithout.toFixed(1) + " without it. " +
        "The pictures were the same in both cases. What differed was whether " +
        "the change announced its own location."));
    } else {
      resultsBody.appendChild(make("p", null,
        "Run the same scene without the blank and compare the two searches."));
    }

    resultsBody.appendChild(make("p", "verdict__note",
      "Your own times, in your own browser, at whatever size your screen " +
      "gives the scene. They measure nothing about you."));

    renderTrialTable();
    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function describeAnswer(value) {
    var match = IDENTIFY_OPTIONS.filter(function (o) { return o[0] === value; })[0];
    return match ? match[1] : value;
  }

  function average(values) {
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  function renderTrialTable() {
    clear(trialTable);
    state.records.forEach(function (record) {
      var row = make("tr");
      var head = make("th", null, record.name);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, record.changeKind));
      row.appendChild(make("td", null, record.where));
      row.appendChild(make("td", null, record.size));
      row.appendChild(make("td", null, record.blank ? "Yes" : "No"));
      row.appendChild(make("td", null, record.seconds.toFixed(1) + " s"));
      row.appendChild(make("td", null,
        record.gaveUp ? "Gave up" : record.correct ? "Yes" : "No"));
      trialTable.appendChild(row);
    });

    trialSummary.textContent =
      "Change type, position and size are confounded with each other and with " +
      "the scene. The one comparison this table supports is the same scene " +
      "with and without the blank.";
  }

  /* --- Demonstrator route ---------------------------------------------- */

  demonstratorButton.addEventListener("click", function () {
    stopCycle();
    state.phase = "idle";
    clear(resultsBody);
    resultsBody.appendChild(make("p", "reveal__lead",
      "Demonstrator route — all four changes."));
    var list = make("ul");
    TRIALS.forEach(function (trial) {
      var prepared = prepareTrial(trial);
      var item = make("li");
      item.appendChild(make("strong", null, trial.name + ": "));
      item.appendChild(document.createTextNode(prepared.text + " (" +
        trial.changeKind.toLowerCase() + ", " + trial.where.toLowerCase() +
        ", " + trial.size.toLowerCase() + ".)"));
      list.appendChild(item);
    });
    resultsBody.appendChild(list);
    resultsBody.appendChild(make("p", null,
      "No scene has been marked used. The picture beside this shows Scene 1 " +
      "with its change ringed, so you can see what the ring looks like."));
    resultsBody.appendChild(make("p", "verdict__note",
      "The move worth making in front of a room is to run one scene with the " +
      "blank on until people are frustrated, then run the same scene with the " +
      "blank off. Nothing about the picture changes; only the blank does."));

    var first = prepareTrial(TRIALS[0]);
    drawScene(revealSvg, first.changed, { focus: first.focus });
    revealCaption.textContent = TRIALS[0].name +
      " — the changed version, with the change ringed";
    revealText.textContent = first.text;

    renderTrialTable();
    resultsSection.hidden = false;
    $("#results-heading").focus();
    shell.announce("Demonstrator route: all four changes are described below.",
      { immediate: true });
  });

  startButton.addEventListener("click", startTrial);
  sceneSelect.addEventListener("change", updateSceneHint);

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    instant: {
      tone: "caution", verdict: "That is the intuition being tested.",
      text: "It is a completely reasonable expectation, and it is usually " +
        "wrong when a blank is inserted. Try it with the blank on, then with " +
        "it off."
    },
    quick: {
      tone: "caution", verdict: "Possibly.",
      text: "With no blank, well under a second. With a blank, several " +
        "seconds is common and much longer is not unusual. Run both."
    },
    slow: {
      tone: "good", verdict: "For the blank condition, yes.",
      text: "And that is what makes the comparison worth doing: switch the " +
        "blank off and the same change is found almost instantly."
    },
    depends: {
      tone: "good", verdict: "Position matters — but less than one other thing.",
      text: "Where the change is does affect the search. The blank matters far " +
        "more, and it is the one factor you can switch on and off here while " +
        "holding the picture constant."
    }
  };

  function unlockTask(message) {
    sceneSelect.disabled = false;
    blankCheck.disabled = false;
    paceSelect.disabled = false;
    startButton.disabled = false;
    sceneCaption.textContent =
      "Press Start when you are ready. Nothing changes until you do.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockTask("Scenes unlocked.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Skipped.",
      "The scenes are unlocked. Take the demonstrator route first if you want " +
      "to know what all four changes are.");
    lockForm(openingForm);
    unlockTask("Skipped. Scenes unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE = {
    swamp: {
      tone: "good", verdict: "Yes.",
      text: "The blank produces a transient across the whole picture, so the " +
        "one produced by the changing object no longer stands out from it. " +
        "Attention is no longer summoned to the right place, and the change " +
        "has to be found by deliberate comparison instead."
    },
    signal: {
      tone: "caution", verdict: "No — the change is fully visible.",
      text: "Both versions are shown in full, for six hundred milliseconds " +
        "each, as many times as you like. Nothing is hidden. What the blank " +
        "removes is the local signal that would otherwise tell you where to " +
        "look."
    },
    nothing: {
      tone: "warn", verdict: "This is the popular reading, and it does not follow.",
      text: "People retain a good deal from a scene, including about objects " +
        "whose change they failed to report. What the paradigm shows is that " +
        "comparing two views needs attention in the right place — not that " +
        "the views leave no trace. This is the inference the debrief spends " +
        "most of its space on."
    },
    memory: {
      tone: "caution", verdict: "The blank is far too short for that.",
      text: "A quarter of a second does not erase visual memory; people can " +
        "hold information across far longer gaps. And the effect survives " +
        "when the interruption is an eye movement, a cut in a film, or a " +
        "splash of mud briefly obscuring part of the scene. None of those " +
        "is a blank interval. What those have in common is disrupting the " +
        "local transient."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var response = CHALLENGE[answer.value];
    showFeedback(challengeFeedback, response.tone, response.verdict, response.text);
    shell.announce("Challenge answered.", { immediate: true });
  });

  /* =======================================================================
     Helpers
     ===================================================================== */

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* =======================================================================
     Reset
     -----------------------------------------------------------------------
     The record of which scenes have had their change revealed survives a
     reset. Forgetting it would let the tool present a spent scene as fresh.
     ===================================================================== */

  shell.onReset(function () {
    stopCycle();
    var used = state ? state.used : [];
    state = {
      phase: "idle",
      trial: null,
      prepared: null,
      blank: true,
      pace: shell.prefersReducedMotion() ? "manual" : "auto",
      frame: 0,
      startedAt: 0,
      elapsedMs: 0,
      paused: false,
      gaveUp: false,
      records: [],
      used: used
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    trialFeedback.hidden = true;
    identifyForm.hidden = true;
    identifyError.hidden = true;
    runControls.hidden = true;
    resultsSection.hidden = true;

    fillSceneSelect();
    sceneSelect.value = TRIALS[0].id;
    sceneSelect.disabled = true;
    blankCheck.checked = true;
    blankCheck.disabled = true;
    paceSelect.value = state.pace;
    paceSelect.disabled = true;
    startButton.disabled = true;
    pauseButton.disabled = true;
    giveUpButton.disabled = true;
    stepButton.hidden = true;

    clear(sceneSvg);
    sceneCaption.textContent = "Answer the question above to unlock the scenes.";
    runStatus.textContent = used.length
      ? "You have already revealed " + used.length + " scene" +
        (used.length === 1 ? "" : "s") + " in this session."
      : "Choose a scene and press Start.";
    updateSceneHint();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    shell.prefersReducedMotion()
      ? "Ready. Your system asks for reduced motion, so the tool has started " +
        "in manual mode: nothing changes until you press a button."
      : "Ready. The alternation is slow, can be paused at any time, and can be " +
        "stepped through by hand instead.",
    { immediate: true });
})();
