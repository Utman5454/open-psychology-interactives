/* =========================================================================
   Visual Neglect Laboratory
   -------------------------------------------------------------------------
   Three tasks - line bisection, cancellation, copying a scene - run on five
   fictional profiles, with and without an examiner prompt to search the whole
   page. All graphics are original and every result is generated.

   THE EDUCATIONAL MODEL
   ---------------------
   Five profiles, each a rule rather than a person:

     control    no systematic error anywhere
     ego        left neglect organised around the viewer: the left of the PAGE
                is under-attended, so bisection error grows for lines further
                left, cancellation omissions follow page position, and the
                copy loses whatever sits on the left of the page
     allo       left neglect organised around each object: bisection error is a
                constant fraction of every line wherever it sits, and the copy
                loses the left half of every object - including objects on the
                right-hand side of the page
     field      left visual field loss without neglect: cancellation misses a
                narrow strip until the person searches, bisection errs slightly
                TOWARDS the blind side, and the copy is complete
     both       left field loss together with viewer-centred neglect

   BISECTION.   Deviation is expressed as a fraction of line length, positive
                to the right.
                  control  small fixed jitter
                  ego      0.06 + 0.16 x (1 - page position of the line)
                  allo     0.13, constant
                  field    -0.05, constant (towards the blind side)
                  both     ego x 0.85, then -0.03
                The prompt multiplies the neglect component by 0.55 and leaves
                the field-loss component alone.

   CANCELLATION. Each target is found with probability given by a logistic in
                its horizontal position, drawn against a fixed seed so the
                picture is reproducible. Field loss uses a steep function at
                the edge of the page (a strip, not a gradient) and the prompt
                removes it entirely.

   COPYING.     Each part of the scene carries a page position and a side
                within its own object. Viewer-centred neglect drops parts left
                of a page cut-off; object-centred neglect drops parts whose
                side within their object is "left". The prompt moves the
                viewer-centred cut-off leftwards and does NOTHING for the
                object-centred profile, because "check the whole page" is an
                instruction about the page.

   All of this is a caricature. Real presentations vary in severity, across
   tasks, across the day and across the space around, near and far from the
   person. No clinical instrument is reproduced, no scoring is clinical, and
   nothing here can assess anybody.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var SEED = 20260807;

  /* =======================================================================
     Seeded randomness (mulberry32), so every drawing is reproducible
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* =======================================================================
     Profiles
     ===================================================================== */

  var PROFILES = [
    {
      id: "control",
      name: "No difficulty",
      short: "No difficulty",
      blurb: "A fictional person with neither neglect nor field loss.",
      bisect: function () { return 0; },
      cancel: { cut: -1, slope: 0.08, strip: null, cuePrompt: -1 },
      copy: { ego: null, allo: false }
    },
    {
      id: "ego",
      name: "Left neglect, organised around the viewer",
      short: "Neglect (viewer-centred)",
      blurb:
        "Left neglect in which what is under-attended is the left of the space " +
        "in front of the person.",
      bisect: function (pagePos) { return 0.06 + 0.16 * (1 - pagePos); },
      cancel: { cut: 0.42, slope: 0.10, strip: null, cuePrompt: 0.28 },
      copy: { ego: 0.45, egoCued: 0.32, allo: false }
    },
    {
      id: "allo",
      name: "Left neglect, organised around each object",
      short: "Neglect (object-centred)",
      blurb:
        "Left neglect in which what is under-attended is the left of each " +
        "thing, wherever that thing happens to be.",
      bisect: function () { return 0.13; },
      cancel: { cut: 0.22, slope: 0.10, strip: null, cuePrompt: 0.14 },
      copy: { ego: null, allo: true, alloCued: true }
    },
    {
      id: "field",
      name: "Left visual field loss, no neglect",
      short: "Field loss",
      blurb:
        "A hole in the left of the visual input, with attention working " +
        "normally. The person knows something is missing and searches for it.",
      bisect: function () { return -0.05; },
      cancel: { cut: 0.11, slope: 0.025, strip: null, cuePrompt: -1 },
      copy: { ego: null, allo: false }
    },
    {
      id: "both",
      name: "Left field loss together with neglect",
      short: "Field loss and neglect",
      blurb:
        "Both at once, which is common after damage large enough to produce " +
        "either.",
      bisect: function (pagePos) { return 0.85 * (0.06 + 0.16 * (1 - pagePos)) - 0.03; },
      cancel: { cut: 0.46, slope: 0.10, strip: 0.11, cuePrompt: 0.31 },
      copy: { ego: 0.45, egoCued: 0.34, allo: false }
    }
  ];

  var CUE_NEGLECT_FACTOR = 0.55;

  function profileById(id) {
    return PROFILES.filter(function (p) { return p.id === id; })[0];
  }

  /* =======================================================================
     Task definitions
     ===================================================================== */

  var TASKS = [
    {
      id: "bisect",
      name: "Line bisection",
      brief:
        "Three horizontal lines of the same length, printed at different places " +
        "across the page. The person marks the middle of each. The true middle " +
        "of each line is shown as a small notch underneath.",
      caption:
        "Three horizontal lines with the mark this fictional person placed on " +
        "each, and the true middle of each line notched beneath it",
      heads: ["Line", "Mark relative to the true middle", "Reading"]
    },
    {
      id: "cancel",
      name: "Cancellation",
      brief:
        "Twenty-six small stars scattered among distractor shapes. The person " +
        "crosses out every star they find. Crossed-out stars carry a stroke; " +
        "the ones that were missed do not.",
      caption:
        "A field of star targets and distractor shapes, with a stroke through " +
        "each star this fictional person found",
      heads: ["Region of the page", "Stars found", "Reading"]
    },
    {
      id: "copy",
      name: "Copying a scene",
      brief:
        "A simple original drawing - two trees, a house and two lengths of " +
        "fence - shown on the left, and this person's copy on the right. Parts " +
        "that did not make it into the copy are simply absent.",
      caption:
        "The model drawing beside this fictional person's copy of it, with " +
        "omitted parts absent from the copy",
      heads: ["Part of the scene", "In the copy?", "Reading"]
    }
  ];

  /* =======================================================================
     Line bisection
     ===================================================================== */

  var LINES = [
    { id: "left", label: "Left of the page", cx: 90, y: 42, length: 160 },
    { id: "middle", label: "Middle of the page", cx: 200, y: 92, length: 160 },
    { id: "right", label: "Right of the page", cx: 310, y: 142, length: 160 }
  ];

  var JITTER = { left: 0.012, middle: -0.008, right: 0.005 };

  function bisectionResult(profile, cued) {
    return LINES.map(function (line) {
      var pagePos = line.cx / 400;
      var raw = profile.id === "control"
        ? JITTER[line.id]
        : profile.bisect(pagePos);
      var deviation = raw;
      if (cued && profile.id !== "control") {
        if (profile.id === "field") {
          deviation = raw;                     /* the prompt does not move it */
        } else if (profile.id === "both") {
          deviation = CUE_NEGLECT_FACTOR * (raw + 0.03) - 0.03;
        } else {
          deviation = CUE_NEGLECT_FACTOR * raw;
        }
      }
      return { line: line, deviation: deviation };
    });
  }

  /* =======================================================================
     Cancellation
     ===================================================================== */

  var CANCEL_FIELD = { w: 400, h: 200, top: 14 };

  /* Fixed layout: 26 targets and 18 distractors, drawn once from the seed so
     that every profile is shown the same page. */
  var CANCEL_ITEMS = (function () {
    var random = mulberry32(SEED);
    var items = [];
    var index;
    for (index = 0; index < 26; index += 1) {
      items.push({
        target: true,
        key: index,
        x: 18 + random() * (CANCEL_FIELD.w - 36),
        y: CANCEL_FIELD.top + 10 + random() * (CANCEL_FIELD.h - 34)
      });
    }
    for (index = 0; index < 18; index += 1) {
      items.push({
        target: false,
        key: -1 - index,
        x: 18 + random() * (CANCEL_FIELD.w - 36),
        y: CANCEL_FIELD.top + 10 + random() * (CANCEL_FIELD.h - 34)
      });
    }
    return items;
  }());

  function cancellationResult(profile, cued) {
    var random = mulberry32(SEED + 991);
    var settings = profile.cancel;
    var cut = cued ? settings.cuePrompt : settings.cut;
    var strip = cued ? null : settings.strip;

    return CANCEL_ITEMS.filter(function (item) { return item.target; })
      .map(function (item) {
        var position = item.x / CANCEL_FIELD.w;
        var draw = random();
        var found;
        if (strip !== null && strip !== undefined && position < strip) {
          found = false;
        } else if (cut < 0) {
          found = true;
        } else {
          var p = 1 / (1 + Math.exp(-(position - cut) / settings.slope));
          found = draw < p;
        }
        return { item: item, found: found, position: position };
      });
  }

  /* =======================================================================
     Copying
     ===================================================================== */

  /* An original scene: two trees, a house, two lengths of fence. Every part
     carries its centre on the page and which side of its own object it is. */
  var SCENE = [
    { id: "fence-l-a", object: "fence-left", side: "left", x: 14,
      draw: { type: "rect", x: 11, y: 92, w: 5, h: 16 } },
    { id: "fence-l-rail", object: "fence-left", side: "centre", x: 31,
      draw: { type: "rect", x: 10, y: 96, w: 42, h: 4 } },
    { id: "fence-l-b", object: "fence-left", side: "right", x: 48,
      draw: { type: "rect", x: 46, y: 92, w: 5, h: 16 } },

    { id: "tree-l-canopy-left", object: "tree-left", side: "left", x: 21,
      draw: { type: "path", d: "M 30 46 A 17 17 0 0 0 30 80 Z" } },
    { id: "tree-l-canopy-right", object: "tree-left", side: "right", x: 39,
      draw: { type: "path", d: "M 30 46 A 17 17 0 0 1 30 80 Z" } },
    { id: "tree-l-trunk", object: "tree-left", side: "centre", x: 30,
      draw: { type: "rect", x: 27, y: 78, w: 6, h: 30 } },

    { id: "house-roof-left", object: "house", side: "left", x: 85,
      draw: { type: "path", d: "M 70 66 L 100 46 L 100 66 Z" } },
    { id: "house-roof-right", object: "house", side: "right", x: 115,
      draw: { type: "path", d: "M 100 46 L 130 66 L 100 66 Z" } },
    { id: "house-wall-left", object: "house", side: "left", x: 86,
      draw: { type: "rect", x: 72, y: 66, w: 28, h: 42 } },
    { id: "house-wall-right", object: "house", side: "right", x: 114,
      draw: { type: "rect", x: 100, y: 66, w: 28, h: 42 } },
    { id: "house-window-left", object: "house", side: "left", x: 83,
      draw: { type: "rect", x: 78, y: 73, w: 11, h: 11, detail: true } },
    { id: "house-window-right", object: "house", side: "right", x: 117,
      draw: { type: "rect", x: 111, y: 73, w: 11, h: 11, detail: true } },
    { id: "house-door", object: "house", side: "centre", x: 100,
      draw: { type: "rect", x: 94, y: 88, w: 12, h: 20, detail: true } },

    { id: "tree-r-canopy-left", object: "tree-right", side: "left", x: 161,
      draw: { type: "path", d: "M 170 46 A 17 17 0 0 0 170 80 Z" } },
    { id: "tree-r-canopy-right", object: "tree-right", side: "right", x: 179,
      draw: { type: "path", d: "M 170 46 A 17 17 0 0 1 170 80 Z" } },
    { id: "tree-r-trunk", object: "tree-right", side: "centre", x: 170,
      draw: { type: "rect", x: 167, y: 78, w: 6, h: 30 } },

    { id: "fence-r-a", object: "fence-right", side: "left", x: 154,
      draw: { type: "rect", x: 151, y: 92, w: 5, h: 16 } },
    { id: "fence-r-rail", object: "fence-right", side: "centre", x: 171,
      draw: { type: "rect", x: 150, y: 96, w: 42, h: 4 } },
    { id: "fence-r-b", object: "fence-right", side: "right", x: 188,
      draw: { type: "rect", x: 186, y: 92, w: 5, h: 16 } }
  ];

  var SCENE_WIDTH = 200;

  var OBJECT_NAMES = {
    "fence-left": "Fence, left length",
    "tree-left": "Tree on the left",
    house: "House",
    "tree-right": "Tree on the right",
    "fence-right": "Fence, right length"
  };

  function copyResult(profile, cued) {
    var settings = profile.copy;
    var egoCut = settings.ego === null || settings.ego === undefined
      ? null
      : (cued && settings.egoCued !== undefined ? settings.egoCued : settings.ego);
    /* The prompt is an instruction about the page, so it does not touch the
       object-centred profile's copying at all. */
    var alloOn = Boolean(settings.allo);

    return SCENE.map(function (part) {
      var dropped = false;
      if (egoCut !== null && part.x / SCENE_WIDTH < egoCut) { dropped = true; }
      if (alloOn && part.side === "left") { dropped = true; }
      return { part: part, kept: !dropped };
    });
  }

  /* =======================================================================
     The challenge - one blinded case, generated from the "field" profile
     ===================================================================== */

  var CHALLENGE_ANSWER = "field";

  /* =======================================================================
     Helpers
     ===================================================================== */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  var NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(x, y, className, anchor, text) {
    var node = svgEl("text", { x: x, y: y, class: className, "text-anchor": anchor });
    node.textContent = text;
    return node;
  }

  function pct(v) { return (v * 100).toFixed(1) + "%"; }

  function signedPct(v) {
    return (v >= 0 ? "+" : "−") + Math.abs(v * 100).toFixed(1) + "%";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#neglect-lab");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var taskControls = $("[data-task-controls]");
  var profileControls = $("[data-profile-controls]");
  var cueToggle = $("#cue-toggle");
  var canvas = $("[data-canvas]");
  var figureCaption = $("[data-figure-caption]");
  var stageHeading = $("[data-stage-heading]");
  var taskTitle = $("[data-task-title]");
  var taskBrief = $("[data-task-brief]");
  var readout = $("[data-readout]");
  var interpretation = $("[data-interpretation]");
  var interpretationBody = $("[data-interpretation-body]");
  var interpretationNote = $("[data-interpretation-note]");
  var detailTable = $("[data-detail-table]");
  var detailHeads = [$("[data-detail-head-a]"), $("[data-detail-head-b]"), $("[data-detail-head-c]")];
  var compareTable = $("[data-compare-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeEvidence = $("[data-challenge-evidence]");
  var challengeOptions = $("[data-challenge-options]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = { task: "bisect", profile: "control", cued: false };

  /* --- Controls, built once --------------------------------------------- */

  TASKS.forEach(function (task, index) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "task";
    input.value = task.id;
    input.checked = index === 0;
    input.addEventListener("change", function () {
      state.task = task.id;
      render();
      shell.announce(task.name + " selected. " + summarise(), { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(task.name));
    taskControls.appendChild(label);
  });

  PROFILES.forEach(function (profile, index) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "profile";
    input.value = profile.id;
    input.checked = index === 0;
    input.addEventListener("change", function () {
      state.profile = profile.id;
      render();
      shell.announce(profile.name + ". " + summarise(), { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(profile.name));
    profileControls.appendChild(label);
  });

  cueToggle.addEventListener("change", function () {
    state.cued = cueToggle.checked;
    render();
    shell.announce(
      (state.cued ? "Prompt given. " : "Prompt withdrawn. ") + summarise(),
      { immediate: true });
  });

  /* --- Summaries, shared by the readout and the live region -------------- */

  function summaryFor(profileId, task, cued) {
    var profile = profileById(profileId);
    if (task === "bisect") {
      var results = bisectionResult(profile, cued);
      var mean = results.reduce(function (sum, r) { return sum + r.deviation; }, 0) / results.length;
      return {
        headline: signedPct(mean),
        label: "Mean deviation from the middle",
        words: mean > 0.02
          ? "marks placed to the right of centre"
          : mean < -0.02
            ? "marks placed to the left of centre"
            : "marks essentially at the centre"
      };
    }
    if (task === "cancel") {
      var found = cancellationResult(profile, cued).filter(function (r) { return r.found; }).length;
      return {
        headline: found + " of 26",
        label: "Stars found",
        words: found === 26
          ? "every star found"
          : (26 - found) + " star" + (26 - found === 1 ? "" : "s") + " missed"
      };
    }
    var kept = copyResult(profile, cued).filter(function (r) { return r.kept; }).length;
    return {
      headline: kept + " of " + SCENE.length,
      label: "Parts copied",
      words: kept === SCENE.length
        ? "the copy is complete"
        : (SCENE.length - kept) + " parts missing from the copy"
    };
  }

  function summarise() {
    var summary = summaryFor(state.profile, state.task, state.cued);
    return summary.label + ": " + summary.headline + " - " + summary.words + ".";
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var task = TASKS.filter(function (t) { return t.id === state.task; })[0];
    var profile = profileById(state.profile);

    taskTitle.textContent = task.name;
    taskBrief.textContent = task.brief;
    figureCaption.textContent = task.caption;
    stageHeading.textContent =
      "What this person produced - " + profile.short.toLowerCase() +
      (state.cued ? ", prompted" : ", unprompted");
    detailHeads.forEach(function (cell, index) {
      cell.textContent = task.heads[index];
    });

    if (state.task === "bisect") { drawBisection(profile); }
    else if (state.task === "cancel") { drawCancellation(profile); }
    else { drawCopy(profile); }

    renderReadout(profile);
    renderInterpretation(profile);
    renderCompare();
  }

  function drawBisection(profile) {
    var results = bisectionResult(profile, state.cued);
    clear(canvas);
    canvas.setAttribute("viewBox", "0 0 400 172");

    results.forEach(function (result) {
      var line = result.line;
      var half = line.length / 2;
      var markX = line.cx + result.deviation * line.length;

      canvas.appendChild(svgEl("line", {
        x1: line.cx - half, y1: line.y, x2: line.cx + half, y2: line.y,
        class: "neg__line"
      }));

      /* The true middle, as a small notch beneath the line. */
      canvas.appendChild(svgEl("line", {
        x1: line.cx, y1: line.y + 6, x2: line.cx, y2: line.y + 12,
        class: "neg__truth"
      }));

      canvas.appendChild(svgEl("line", {
        x1: markX, y1: line.y - 13, x2: markX, y2: line.y + 13,
        class: "neg__mark"
      }));

      canvas.appendChild(svgText(line.cx + half + 6, line.y + 4,
        "chart__count", "start", signedPct(result.deviation)));
    });

    canvas.appendChild(svgText(0, 166, "chart__axis", "start",
      "tall stroke: the mark placed   short notch: the true middle"));
  }

  function drawCancellation(profile) {
    var results = cancellationResult(profile, state.cued);
    var foundByKey = {};
    results.forEach(function (result) { foundByKey[result.item.key] = result.found; });

    clear(canvas);
    canvas.setAttribute("viewBox", "0 0 400 236");

    canvas.appendChild(svgEl("rect", {
      x: 1, y: CANCEL_FIELD.top - 4, width: 398, height: CANCEL_FIELD.h + 8,
      class: "neg__page"
    }));

    CANCEL_ITEMS.forEach(function (item) {
      if (!item.target) {
        canvas.appendChild(svgEl("circle", {
          cx: item.x, cy: item.y, r: 4, class: "neg__distractor"
        }));
        return;
      }
      canvas.appendChild(svgEl("path", {
        d: starPath(item.x, item.y, 7.5, 3.4),
        class: "neg__target"
      }));
      if (foundByKey[item.key]) {
        canvas.appendChild(svgEl("line", {
          x1: item.x - 9, y1: item.y + 8, x2: item.x + 9, y2: item.y - 8,
          class: "neg__cancel"
        }));
      }
    });

    canvas.appendChild(svgText(0, 230, "chart__axis", "start",
      "stars with a stroke through them were found; plain stars were missed; small circles are distractors"));
  }

  function starPath(cx, cy, outer, inner) {
    var points = [];
    for (var i = 0; i < 10; i += 1) {
      var radius = i % 2 === 0 ? outer : inner;
      var angle = (Math.PI / 5) * i - Math.PI / 2;
      points.push(
        (cx + radius * Math.cos(angle)).toFixed(1) + "," +
        (cy + radius * Math.sin(angle)).toFixed(1));
    }
    return "M " + points.join(" L ") + " Z";
  }

  function drawCopy(profile) {
    var results = copyResult(profile, state.cued);

    clear(canvas);
    canvas.setAttribute("viewBox", "0 0 420 168");

    function panel(offsetX, title, keepAll) {
      var group = svgEl("g", { transform: "translate(" + offsetX + ",18)" });
      group.appendChild(svgEl("rect", {
        x: 0, y: 0, width: 200, height: 120, class: "neg__page"
      }));
      group.appendChild(svgEl("line", {
        x1: 6, y1: 108, x2: 194, y2: 108, class: "neg__ground"
      }));

      results.forEach(function (result) {
        if (!keepAll && !result.kept) { return; }
        var shape = result.part.draw;
        if (shape.type === "rect") {
          group.appendChild(svgEl("rect", {
            x: shape.x, y: shape.y, width: shape.w, height: shape.h,
            class: "neg__part" + (shape.detail ? " neg__part--detail" : "")
          }));
        } else {
          group.appendChild(svgEl("path", { d: shape.d, class: "neg__part" }));
        }
      });

      canvas.appendChild(group);
      canvas.appendChild(svgText(offsetX + 100, 12, "chart__axis", "middle", title));
    }

    panel(4, "the model", true);
    panel(216, "the copy", false);
    canvas.appendChild(svgText(210, 162, "chart__axis", "middle",
      "parts left out of the copy are simply absent"));
  }

  function renderReadout(profile) {
    var summary = summaryFor(profile.id, state.task, state.cued);
    var unprompted = summaryFor(profile.id, state.task, false);
    var prompted = summaryFor(profile.id, state.task, true);

    clear(readout);
    [
      [summary.label, summary.headline],
      ["Prompt", state.cued ? "given" : "not given"],
      ["Without and with the prompt", unprompted.headline + " → " + prompted.headline]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });

    renderDetail(profile);
  }

  function renderDetail(profile) {
    clear(detailTable);

    if (state.task === "bisect") {
      bisectionResult(profile, state.cued).forEach(function (result) {
        var tr = make("tr");
        var th = make("th", null, result.line.label);
        th.setAttribute("scope", "row");
        tr.appendChild(th);
        tr.appendChild(make("td", null, signedPct(result.deviation)));
        tr.appendChild(make("td", null,
          result.deviation > 0.02 ? "right of the true middle"
            : result.deviation < -0.02 ? "left of the true middle"
              : "within a fiftieth of the middle"));
        detailTable.appendChild(tr);
      });
      return;
    }

    if (state.task === "cancel") {
      var results = cancellationResult(profile, state.cued);
      [["Left third", 0, 1 / 3], ["Middle third", 1 / 3, 2 / 3], ["Right third", 2 / 3, 1.01]]
        .forEach(function (band) {
          var inBand = results.filter(function (r) {
            return r.position >= band[1] && r.position < band[2];
          });
          var found = inBand.filter(function (r) { return r.found; }).length;
          var tr = make("tr");
          var th = make("th", null, band[0]);
          th.setAttribute("scope", "row");
          tr.appendChild(th);
          tr.appendChild(make("td", null, found + " of " + inBand.length));
          tr.appendChild(make("td", null,
            found === inBand.length ? "all found"
              : found === 0 ? "none found"
                : (inBand.length - found) + " missed"));
          detailTable.appendChild(tr);
        });
      return;
    }

    var copy = copyResult(profile, state.cued);
    Object.keys(OBJECT_NAMES).forEach(function (objectId) {
      var parts = copy.filter(function (r) { return r.part.object === objectId; });
      var kept = parts.filter(function (r) { return r.kept; });
      var missing = parts.filter(function (r) { return !r.kept; });
      var tr = make("tr");
      var th = make("th", null, OBJECT_NAMES[objectId]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, kept.length + " of " + parts.length + " parts"));
      tr.appendChild(make("td", null,
        missing.length === 0 ? "complete"
          : missing.length === parts.length ? "absent altogether"
            : "missing its " + missing.map(function (r) { return r.part.side; })
              .filter(function (side, index, all) { return all.indexOf(side) === index; })
              .join(" and ") + " side"));
      detailTable.appendChild(tr);
    });
  }

  /* Every profile's headline on the current task, prompted and not. This is
     where the comparison that teaches the tool actually lives. */
  function renderCompare() {
    clear(compareTable);
    PROFILES.forEach(function (profile) {
      var tr = make("tr");
      var th = make("th", null, profile.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, summaryFor(profile.id, state.task, false).headline));
      tr.appendChild(make("td", null, summaryFor(profile.id, state.task, true).headline));
      if (profile.id === state.profile) { tr.className = "neg__current"; }
      compareTable.appendChild(tr);
    });
  }

  var READINGS = {
    bisect: {
      control:
        "Marks within about one per cent of the middle on all three lines, in " +
        "both directions. This is what the task looks like when nothing is " +
        "wrong with it.",
      ego:
        "Every mark is to the right of the true middle, and the error is " +
        "largest for the line printed furthest left. That gradient across the " +
        "page is the signature of neglect organised around the viewer: what " +
        "is under-weighted is the left of the space, so a line sitting further " +
        "into that space loses more of itself.",
      allo:
        "Every mark is to the right of the true middle by about the same " +
        "fraction of each line, wherever on the page the line sits. The error " +
        "is tied to the object rather than to the page - which is why the " +
        "left-hand and right-hand lines come out the same.",
      field:
        "The marks are slightly to the LEFT of the true middle - the opposite " +
        "direction from neglect. People with a field loss and intact attention " +
        "tend to err towards the blind side on this task. Two people who both " +
        "\"miss things on the left\" therefore point in opposite directions " +
        "here, which is the cleanest single-task separation available.",
      both:
        "Rightward, like neglect, but a little smaller: the leftward pull of " +
        "the field loss partly cancels the rightward pull of the neglect. " +
        "Mixed presentations are common and produce intermediate numbers that " +
        "are hard to read on their own."
    },
    cancel: {
      control:
        "All twenty-six stars found. Scanning a page for targets is easy when " +
        "attention reaches the whole page.",
      ego:
        "Omissions concentrated on the left, thinning out towards the middle " +
        "rather than stopping at a line. Neglect is graded, not a border: the " +
        "further left a target sits, the less likely it is to be attended.",
      allo:
        "A milder leftward gradient. Cancellation is not the task that shows " +
        "object-centred neglect at its clearest, because each star is small " +
        "and roughly symmetrical - it is the copying task that separates this " +
        "profile from the one above.",
      field:
        "A narrow strip missed at the very edge of the page, and everything " +
        "else found. That is a hole in the input rather than a gradient of " +
        "attention - and it disappears entirely once the person is given time " +
        "to search.",
      both:
        "The gradient of neglect plus the strip of field loss. The two are " +
        "hard to tell apart on this task alone, which is why cancellation is " +
        "rarely used by itself."
    },
    copy: {
      control: "The copy is complete.",
      ego:
        "Everything on the left of the page is absent: the left-hand tree, the " +
        "left length of fence, and the left half of the house. Note that what " +
        "decides whether a part survives is where it sits on the page, not " +
        "which object it belongs to.",
      allo:
        "Every object appears, and every one of them is missing its own left " +
        "half - including the tree on the RIGHT-hand side of the page. That " +
        "omission is not on the left of anything except the tree it belongs " +
        "to, which is very hard to explain as a failure to look far enough " +
        "left, and is the main reason object-centred neglect is treated as a " +
        "separate phenomenon.",
      field:
        "The copy is complete. A hole in the visual input does not stop " +
        "anybody copying a picture: the eyes move, the information gets in, " +
        "and the person knows to check. This is the observation that most " +
        "cleanly separates field loss from neglect.",
      both:
        "The viewer-centred pattern: the left of the page is gone. The field " +
        "loss adds nothing visible here, because copying survives it."
    }
  };

  var CUE_NOTES = {
    control: "The prompt changes nothing, because nothing was being missed.",
    ego:
      "The prompt helps and does not fix it. Attention can be pushed leftwards " +
      "by an instruction, and it drifts back; improvement under cueing is " +
      "informative about mechanism rather than a measure of severity.",
    allo:
      "On bisection and cancellation the prompt helps a little. On the copying " +
      "task it does nothing at all, because \"check the whole page\" is an " +
      "instruction about the page, and the page is not the frame that is " +
      "failing.",
    field:
      "The prompt rescues cancellation completely. The strategy was already " +
      "available and only needed time - which is exactly what does not happen " +
      "in neglect.",
    both:
      "Partial improvement, as for neglect alone. The field-loss component " +
      "responds to searching; the neglect component only partly does."
  };

  function renderInterpretation(profile) {
    interpretationBody.textContent = READINGS[state.task][profile.id];
    interpretationNote.textContent = CUE_NOTES[profile.id];
    interpretation.setAttribute("data-tone",
      profile.id === "control" ? "good" : profile.id === "field" ? "caution" : "warn");
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    bisection: {
      tone: "caution",
      verdict: "Close, and it is the best single task.",
      text:
        "Bisection does separate them, and it does so in the most striking " +
        "way: neglect marks to the right of the true middle, field loss " +
        "slightly to the left. But bisection error is variable, it depends on " +
        "line length and position, and a mild case can land inside the normal " +
        "range. Run it, then run copying, and see which one you would rather " +
        "rely on."
    },
    cancellation: {
      tone: "caution",
      verdict: "Not on its own.",
      text:
        "Both profiles miss targets on the left in the cancellation task - " +
        "that is the surface similarity the whole exercise is about. What " +
        "differs is the shape of the omissions and what happens when the " +
        "person is given time: field loss misses a narrow strip and finds " +
        "everything once prompted; neglect shows a gradient and improves only " +
        "partly."
    },
    copy: {
      tone: "good",
      verdict: "Yes - this is the cleanest one.",
      text:
        "Left field loss with intact attention produces a complete copy. The " +
        "eyes move, the information gets in, and the person knows to check. " +
        "Neglect leaves parts out. Run the copying task on both profiles and " +
        "the difference is not a matter of degree."
    },
    none: {
      tone: "good",
      verdict: "The safest answer, and worth defending.",
      text:
        "In practice, yes: the two can occur together, severity varies, and " +
        "any single task can mislead. That said, the copying task comes closest " +
        "to a clean separation, and bisection has the useful property of " +
        "erring in opposite directions. Run all three and see which you would " +
        "want first."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockLab();
  });

  function unlockLab() {
    lockForm(openingForm);
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Laboratory open. Line bisection, no difficulty profile.",
      { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  (function buildChallenge() {
    [
      ["Line bisection",
        summaryFor(CHALLENGE_ANSWER, "bisect", false).headline +
        " mean deviation from the true middle, in the same direction on all three lines"],
      ["Cancellation",
        summaryFor(CHALLENGE_ANSWER, "cancel", false).headline +
        " stars found, all of the misses within the leftmost tenth of the page"],
      ["Copying a scene",
        summaryFor(CHALLENGE_ANSWER, "copy", false).headline +
        " parts copied - nothing left out"]
    ].forEach(function (row) {
      var li = make("li");
      li.appendChild(make("strong", null, row[0] + ": "));
      li.appendChild(document.createTextNode(row[1]));
      challengeEvidence.appendChild(li);
    });

    PROFILES.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "challenge";
      input.value = option.id;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option.name));
      challengeOptions.appendChild(label);
    });
  }());

  var CHALLENGE_FEEDBACK = {
    control:
      "The copy being complete does point that way, and the other two results " +
      "do not fit: a mean deviation to the left of the true middle on every " +
      "line is a systematic error, and a control profile finds all 26 stars.",
    ego:
      "Viewer-centred neglect would leave the left of the page out of the copy, " +
      "and it marks to the RIGHT of the true middle. This person's copy is " +
      "complete and the bisection error runs the other way.",
    allo:
      "Object-centred neglect would leave the left half of each object out of " +
      "the copy - including the tree on the right - and would mark to the right " +
      "of the middle on every line. Neither is what happened here.",
    field:
      "Yes. A complete copy rules out neglect fairly firmly; the misses " +
      "confined to a narrow strip at the very edge of the page look like a " +
      "hole in the input rather than a gradient of attention; and the leftward " +
      "bisection error is the direction associated with field loss rather than " +
      "with neglect. All three point the same way.",
    both:
      "If neglect were present the copy would not be complete, and the " +
      "bisection error would be rightward or close to zero rather than " +
      "leftward. The field-loss half of this answer is right; the neglect half " +
      "has no support in these three results."
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose a profile first.", "");
      return;
    }
    var right = answer.value === CHALLENGE_ANSWER;
    clear(challengeFeedback);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", right ? "Yes." : "Not quite."));
    p.appendChild(document.createTextNode(" " + CHALLENGE_FEEDBACK[answer.value]));
    challengeFeedback.appendChild(p);
    if (!right) {
      challengeFeedback.appendChild(make("p", null,
        "The profile these three results were generated from is: left visual " +
        "field loss without neglect. Load it in the laboratory above and " +
        "compare all three tasks."));
    }
    challengeFeedback.appendChild(make("p", "text-muted",
      "One fictional case is not how anybody decides this. Real assessment " +
      "uses a battery of tasks, observation of everyday behaviour, and a " +
      "clinician - and the two conditions frequently occur together."));
    challengeFeedback.setAttribute("data-tone", right ? "good" : "caution");
    challengeFeedback.hidden = false;
    shell.announce("Challenge answered.", { immediate: true });
  });

  /* --- Feedback plumbing ------------------------------------------------ */

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

  /* --- Reset ------------------------------------------------------------ */

  shell.onReset(function () {
    state = { task: "bisect", profile: "control", cued: false };
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-task-controls] input, [data-profile-controls] input'),
      function (input) { input.checked = false; });
    $('[data-task-controls] input[value="bisect"]').checked = true;
    $('[data-profile-controls] input[value="control"]').checked = true;
    cueToggle.checked = false;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the laboratory.",
    { immediate: true });
})();
