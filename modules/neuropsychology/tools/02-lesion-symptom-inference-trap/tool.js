/* =========================================================================
   Lesion–Symptom Inference Trap
   -------------------------------------------------------------------------
   One fictional case. The learner states how confident they are in a general
   localisation claim, then reveals six complications one at a time, re-rating
   after each. A schematic map redraws as the complications arrive, and a
   gauge compares the learner's confidence with a ceiling representing how
   much the evidence on the table can carry.

   THE EDUCATIONAL MODEL
   ---------------------
   The ceiling is a TEACHING DEVICE, not a calculation. It encodes the
   judgement that a single case with a large, multi-region lesion inside a
   systematic vascular territory, measured early, in a person whose premorbid
   level and language organisation are unknown, cannot carry a general claim
   about what a region does. It starts at 50 and falls to 12:

       0  referral only                                    50
       1  the lesion is larger than the label              40
       2  the lesion follows a vascular territory          32
       3  oedema and diaschisis                            26
       4  premorbid level and individual variation         21
       5  a second, older lesion                           17
       6  the dissociation depended on how it was probed   12

   The specific claim - that tissue in the damaged area was necessary for
   fluent speech output in THIS person, at THIS time, on THESE tasks - is
   treated as remaining well supported throughout. Making that contrast
   visible is the point of the exercise: the complications bear far harder on
   the general claim than on the specific one.

   Nothing here is a probability, a prevalence or a published value. The case,
   the scan and the testing are invented, and the map is a schematic rather
   than an atlas.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     The case, step by step - all fictional
     ===================================================================== */

  var REFERRAL = {
    title: "Step 0 - the referral",
    heading: "The referral, as written",
    body:
      "Person M, 68, admitted after a sudden onset of difficulty producing " +
      "speech. Two weeks on, her speech is effortful and short. She appears to " +
      "understand ward conversation without difficulty. The scan report " +
      "describes damage centred on the left inferior frontal region.",
    effect:
      "This is the version of the case that invites the inference. Everything " +
      "that follows was in the notes; none of it was in the summary.",
    ceiling: 50,
    /* Which map features are visible once this step has been reached. */
    marks: ["core"]
  };

  var COMPLICATIONS = [
    {
      short: "The lesion is larger than its label",
      title: "Complication 1 - lesion extent",
      heading: "The lesion is larger than its label",
      body:
        "The damage is not confined to the inferior frontal region. On the " +
        "scan it extends backwards into the insula and downwards into the " +
        "white matter beneath, with a total volume of roughly 24 cubic " +
        "centimetres. A one-region label names the centre of a lesion, not " +
        "its extent.",
      effect:
        "Any of the damaged tissue could be responsible, including the white " +
        "matter, which carries connections to regions that are themselves " +
        "undamaged. Two cases carrying the same label can have very different " +
        "lesions.",
      ceiling: 40,
      marks: ["core", "extent"]
    },
    {
      short: "It follows a vascular territory",
      title: "Complication 2 - vascular territory",
      heading: "The lesion follows a blood supply, not a function",
      body:
        "The shape of the damage matches the territory of the superior " +
        "division of the left middle cerebral artery. Strokes take the shape " +
        "of the vessel that failed, and one vessel supplies several " +
        "functionally distinct regions together.",
      effect:
        "Those regions are therefore damaged together in case after case. The " +
        "co-occurrence is systematic rather than random, so it does not " +
        "average away as the sample grows - which is why lesion-symptom " +
        "mapping has to model vascular structure explicitly, and why maps are " +
        "biased towards the middle of common territories.",
      ceiling: 32,
      marks: ["core", "extent", "territory"]
    },
    {
      short: "Some affected tissue is not damaged",
      title: "Complication 3 - oedema and diaschisis",
      heading: "Some of the affected tissue is not damaged at all",
      body:
        "At two weeks there is still swelling around the lesion, compressing " +
        "tissue that is structurally intact. Metabolic activity is also " +
        "reduced in undamaged left temporal cortex connected to the damaged " +
        "area - remote functional depression, or diaschisis.",
      effect:
        "Part of what she cannot do reflects tissue that is intact but " +
        "temporarily not working. A deficit measured now overstates what the " +
        "lesion itself accounts for, and some of the improvement over the next " +
        "months will be these effects resolving rather than anything " +
        "reorganising.",
      ceiling: 26,
      marks: ["core", "extent", "territory", "diaschisis"]
    },
    {
      short: "She was not an average brain, or an average baseline",
      title: "Complication 4 - premorbid level and individual variation",
      heading: "She was not an average brain, or an average baseline",
      body:
        "She is left-handed, with left-handedness in her family. She taught " +
        "English for 38 years and read constantly. Language organisation " +
        "varies between people and varies more in left-handers, and premorbid " +
        "level does not appear on any scan.",
      effect:
        "\"Comprehension appears good\" means good against a general standard, " +
        "not against hers. A score at the population average may be a large " +
        "loss for this person. And if her language organisation is atypical, " +
        "the region-to-function mapping assumed by the inference may not be " +
        "the one she has.",
      ceiling: 21,
      marks: ["core", "extent", "territory", "diaschisis", "atypical"]
    },
    {
      short: "There is a second, older lesion",
      title: "Complication 5 - co-occurring damage",
      heading: "There is a second lesion, and nobody mentioned it",
      body:
        "The same scan shows a small, old right-hemisphere lesion in the " +
        "posterior parietal region, with no matching entry in her history. It " +
        "may be decades old and it may never have produced a noticed " +
        "difficulty.",
      effect:
        "Silent damage is common in this age group. It means the current " +
        "picture is a new lesion on top of a brain that had already changed, " +
        "and it removes the assumption that everything except the labelled " +
        "region was intact.",
      ceiling: 17,
      marks: ["core", "extent", "territory", "diaschisis", "atypical", "old"]
    },
    {
      short: "The dissociation depended on the questions",
      title: "Complication 6 - task demands",
      heading: "The dissociation was partly a property of the questions",
      body:
        "\"Understands conversation\" came from the ward, where context, " +
        "gesture and expectation carry much of the meaning. Tested formally " +
        "with sentences whose meaning depends on word order - the sort where " +
        "who did what to whom cannot be guessed - she is well below the " +
        "control range.",
      effect:
        "The production-versus-comprehension dissociation that motivated the " +
        "whole inference is much smaller than the summary suggested. Two tasks " +
        "with the same name are not interchangeable evidence, and the direction " +
        "of a dissociation can depend on which version of a task was used.",
      ceiling: 12,
      marks: ["core", "extent", "territory", "diaschisis", "atypical", "old"]
    }
  ];

  var MAP_MARKS = {
    core: {
      letter: "L",
      name: "Lesion core",
      meaning: "The area named in the scan report - left inferior frontal region"
    },
    extent: {
      letter: "E",
      name: "Full lesion extent",
      meaning: "Damage reaching the insula and the white matter underneath"
    },
    territory: {
      letter: "T",
      name: "Vascular territory",
      meaning: "Superior division of the left middle cerebral artery, drawn with a dashed outline"
    },
    diaschisis: {
      letter: "D",
      name: "Remote functional depression",
      meaning: "Undamaged left temporal cortex working below par, drawn with hatching"
    },
    atypical: {
      letter: "?",
      name: "Language organisation unknown",
      meaning: "Left-handed; the usual left-hemisphere assumption may not hold"
    },
    old: {
      letter: "O",
      name: "Older right-hemisphere lesion",
      meaning: "Small, posterior parietal, no matching history"
    }
  };

  var SYNTHESIS = [
    {
      tone: "good",
      claim: "Tissue in the damaged area was necessary for fluent speech output in this person.",
      standing: "Well supported."
    },
    {
      tone: "good",
      claim: "Her effortful speech is not explained by weakness of the mouth or tongue alone.",
      standing: "Supported, given the rest of the examination."
    },
    {
      tone: "caution",
      claim: "The lesion is a reasonable place to start looking for what fluent speech output needs.",
      standing: "Supported as a starting point, not as a conclusion."
    },
    {
      tone: "warn",
      claim: "Fluent speech output is localised to the left inferior frontal region.",
      standing: "Not supported by this case, and not the kind of claim one case can settle."
    }
  ];

  /* =======================================================================
     The challenge
     ===================================================================== */

  var CLAIMS = [
    {
      id: "necessary",
      text:
        "Tissue somewhere in the damaged volume was necessary for fluent " +
        "speech output in Person M, at two weeks, on the tasks she was given.",
      answer: "well",
      why:
        "This is the claim lesion evidence is built to support. It is about " +
        "one person, one time and the tasks actually used, and every " +
        "complication above leaves it standing - the lesion is still the " +
        "reason she cannot do what she could do before."
    },
    {
      id: "region",
      text:
        "The left inferior frontal region is where fluent speech output is " +
        "produced.",
      answer: "not",
      why:
        "The lesion is bigger than the label, sits in a territory that damages " +
        "several regions together, and includes white matter connecting to " +
        "undamaged tissue. Even with a hundred such cases the vascular " +
        "co-occurrence would not resolve on its own. And \"is where X is " +
        "produced\" is a claim about function, which necessity evidence does " +
        "not deliver."
    },
    {
      id: "predict",
      text:
        "A lesion in this territory predicts effortful speech in most people.",
      answer: "partly",
      why:
        "A population claim, and a reasonable hypothesis - lesions in this " +
        "territory are associated with effortful speech often enough for the " +
        "association to be worth studying. One case cannot establish how " +
        "often, and this case has an unusually uncertain baseline. Testable, " +
        "not tested."
    },
    {
      id: "comprehension",
      text:
        "Her comprehension is intact.",
      answer: "not",
      why:
        "This was true of ward conversation and false of formal testing with " +
        "reversible sentences. The claim is not so much unsupported as " +
        "under-specified: comprehension of what, measured how? The original " +
        "dissociation shrank once the question was asked properly."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "well", label: "Well supported by this case" },
    { value: "partly", label: "Partly supported - a reasonable hypothesis" },
    { value: "not", label: "Not supported by this case" }
  ];

  /* =======================================================================
     Small helpers
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

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#lesion-trap");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var confidenceRange = $("#confidence-range");
  var revealButton = $('[data-action="reveal"]');
  var remaining = $("[data-remaining]");
  var revealedList = $("[data-revealed-list]");
  var stepTitle = $("[data-step-title]");
  var cardHeading = $("[data-card-heading]");
  var cardBody = $("[data-card-body]");
  var cardEffect = $("[data-card-effect]");
  var mapSvg = $("[data-map]");
  var mapTable = $("[data-map-table]");
  var mapLegend = $("[data-map-legend]");
  var gaugeSvg = $("[data-gauge]");
  var gaugeVerdict = $("[data-gauge-verdict]");
  var traceSvg = $("[data-trace]");
  var traceTable = $("[data-trace-table]");
  var synthesis = $("[data-synthesis]");
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var evidenceSection = $("#evidence-section");

  var challengeForm = $("#challenge-form");
  var claimsHost = $("[data-claims]");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* step 0 = referral; step k = COMPLICATIONS[k - 1]. `locked` holds the
     confidence the learner committed to at each step already passed. */
  var state = { step: 0, confidence: 70, locked: [] };

  function currentCard() {
    return state.step === 0 ? REFERRAL : COMPLICATIONS[state.step - 1];
  }

  /* --- Controls --------------------------------------------------------- */

  shell.bindRange(confidenceRange, {
    format: function (v) { return v + "%"; },
    describe: function (v) {
      return v + " per cent confident in the general localisation claim";
    },
    onInput: function (v) {
      state.confidence = v;
      renderGauge();
    }
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    reveal();
  });

  function reveal() {
    if (state.step >= COMPLICATIONS.length) { return; }
    state.locked[state.step] = state.confidence;
    state.step += 1;
    render();
    var card = currentCard();
    shell.announce(card.title + ". " + card.heading + ".", { immediate: true });
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var card = currentCard();
    var done = state.step >= COMPLICATIONS.length;

    stepTitle.textContent = card.title;
    cardHeading.textContent = card.heading;
    cardBody.textContent = card.body;
    cardEffect.textContent = card.effect;

    revealButton.disabled = done;
    revealButton.textContent = done
      ? "All six complications revealed"
      : "Lock this rating and reveal the next complication";
    remaining.textContent = done
      ? "Nothing further. Your last rating still counts - the summary below uses it."
      : (COMPLICATIONS.length - state.step) + " of " + COMPLICATIONS.length +
        " complications still unrevealed.";

    renderRevealedList();
    renderMap(card.marks);
    renderGauge();
    renderTrace();
    renderSynthesis(done);
  }

  function renderRevealedList() {
    clear(revealedList);
    if (state.step === 0) {
      revealedList.appendChild(
        make("li", "trap__list-empty", "Nothing yet - only the referral."));
      return;
    }
    COMPLICATIONS.slice(0, state.step).forEach(function (item) {
      revealedList.appendChild(make("li", null, item.short));
    });
  }

  /* The schematic. Two rounded hemisphere outlines with labelled blobs. It is
     drawn afresh on every step so that the marks and the table can never
     disagree. Every mark carries a letter, decoded in the table beneath, so
     nothing depends on fill colour. */
  function renderMap(marks) {
    var shown = {};
    marks.forEach(function (key) { shown[key] = true; });

    clear(mapSvg);

    var OUTLINE =
      "M 22 104 C 22 58, 58 30, 100 30 C 146 30, 176 58, 178 100 " +
      "C 180 142, 148 168, 100 170 C 58 171, 22 150, 22 104 Z";

    function hemisphere(transform, label) {
      var group = svgEl("g", transform ? { transform: transform } : {});
      group.appendChild(svgEl("path", { d: OUTLINE, class: "trap__outline" }));
      /* A single fissure line, purely to orient the reader. */
      group.appendChild(svgEl("path", {
        d: "M 42 116 C 70 106, 108 102, 150 108",
        class: "trap__fissure"
      }));
      return group;
    }

    var left = hemisphere(null);
    mapSvg.appendChild(left);

    if (shown.territory) {
      left.appendChild(svgEl("ellipse", {
        cx: 88, cy: 92, rx: 54, ry: 44, class: "trap__territory"
      }));
    }
    if (shown.diaschisis) {
      left.appendChild(svgEl("ellipse", {
        cx: 122, cy: 132, rx: 27, ry: 16, class: "trap__diaschisis"
      }));
    }
    if (shown.extent) {
      left.appendChild(svgEl("ellipse", {
        cx: 76, cy: 102, rx: 32, ry: 26, class: "trap__extent"
      }));
    }
    left.appendChild(svgEl("ellipse", {
      cx: 66, cy: 99, rx: 20, ry: 17, class: "trap__core"
    }));

    /* Letters, placed after the shapes so they sit on top. */
    left.appendChild(svgText(66, 104, "trap__mark", "middle", "L"));
    if (shown.extent) { left.appendChild(svgText(100, 116, "trap__mark", "middle", "E")); }
    if (shown.territory) { left.appendChild(svgText(124, 58, "trap__mark", "middle", "T")); }
    if (shown.diaschisis) { left.appendChild(svgText(132, 137, "trap__mark", "middle", "D")); }

    /* Right hemisphere: the same outline mirrored, so the front of each brain
       faces outwards, as in a standard pair of lateral views. */
    var right = hemisphere("translate(380,0) scale(-1,1)");
    mapSvg.appendChild(right);

    if (shown.old) {
      right.appendChild(svgEl("ellipse", {
        cx: 140, cy: 74, rx: 14, ry: 12, class: "trap__old"
      }));
    }
    if (shown.atypical) {
      right.appendChild(svgEl("path", { d: OUTLINE, class: "trap__uncertain" }));
    }

    /* Mirrored text would read backwards, so the letters for the right-hand
       outline are drawn in page coordinates instead. */
    if (shown.old) { mapSvg.appendChild(svgText(240, 79, "trap__mark", "middle", "O")); }
    if (shown.atypical) { mapSvg.appendChild(svgText(292, 152, "trap__mark", "middle", "?")); }

    mapSvg.appendChild(svgText(100, 190, "chart__axis", "middle", "left hemisphere"));
    mapSvg.appendChild(svgText(280, 190, "chart__axis", "middle", "right hemisphere"));
    mapSvg.appendChild(
      svgText(190, 208, "chart__axis", "middle", "schematic - not an atlas, not to scale"));

    /* The visible text equivalent of the drawing: every letter currently on
       the map, named, so the figure never depends on the shapes alone. The
       fuller meanings are in the table below the stage. */
    mapLegend.textContent = "On the map now: " + marks.map(function (key) {
      return MAP_MARKS[key].letter + " - " + MAP_MARKS[key].name.toLowerCase();
    }).join("; ") + ".";

    clear(mapTable);
    marks.forEach(function (key) {
      var mark = MAP_MARKS[key];
      var tr = make("tr");
      var th = make("th", null, mark.letter);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, mark.name));
      tr.appendChild(make("td", null, mark.meaning));
      mapTable.appendChild(tr);
    });
  }

  /* Two bars: what the learner claims, and the most the evidence can carry.
     The overshoot is drawn as a separate hatched segment and named in the
     sentence underneath, so the comparison never depends on colour. */
  function renderGauge() {
    var ceiling = currentCard().ceiling;
    var yours = state.confidence;
    var SCALE = 200;
    var LEFT = 92;

    clear(gaugeSvg);

    [
      { label: "Your claim", value: yours, y: 14, cls: "trap__bar--yours" },
      { label: "Evidence", value: ceiling, y: 50, cls: "trap__bar--ceiling" }
    ].forEach(function (row) {
      gaugeSvg.appendChild(
        svgText(LEFT - 8, row.y + 15, "chart__count", "end", row.label));
      gaugeSvg.appendChild(svgEl("rect", {
        x: LEFT, y: row.y, width: SCALE, height: 21, class: "chart__track"
      }));
      gaugeSvg.appendChild(svgEl("rect", {
        x: LEFT, y: row.y, width: (row.value / 100) * SCALE, height: 21,
        class: "chart__bar " + row.cls
      }));
      gaugeSvg.appendChild(
        svgText(LEFT + SCALE + 6, row.y + 15, "chart__count", "start", row.value + "%"));
    });

    /* The overshoot, marked on the upper bar. */
    if (yours > ceiling) {
      gaugeSvg.appendChild(svgEl("rect", {
        x: LEFT + (ceiling / 100) * SCALE, y: 14,
        width: ((yours - ceiling) / 100) * SCALE, height: 21,
        class: "trap__overshoot"
      }));
    }

    gaugeSvg.appendChild(
      svgText(LEFT, 86, "chart__axis", "start", "0%"));
    gaugeSvg.appendChild(
      svgText(LEFT + SCALE, 86, "chart__axis", "end", "100%"));

    var gap = yours - ceiling;
    if (gap > 20) {
      gaugeVerdict.textContent =
        "You are " + gap + " points beyond what this evidence can carry. " +
        "That is the size of the claim you would be making on your own account " +
        "rather than on the case's.";
      gaugeVerdict.setAttribute("data-tone", "warn");
    } else if (gap > 5) {
      gaugeVerdict.textContent =
        "You are " + gap + " points beyond the ceiling - a stretch rather than " +
        "a leap, but a stretch you would have to defend.";
      gaugeVerdict.setAttribute("data-tone", "caution");
    } else if (gap >= -10) {
      gaugeVerdict.textContent =
        "Your confidence is roughly what the evidence on the table supports " +
        "for the general claim.";
      gaugeVerdict.setAttribute("data-tone", "good");
    } else {
      gaugeVerdict.textContent =
        "You are " + Math.abs(gap) + " points below the ceiling. Nothing wrong " +
        "with caution, but note that the case still supports something: the " +
        "specific claim about this person's tissue is not in doubt.";
      gaugeVerdict.setAttribute("data-tone", "neutral");
    }
  }

  /* The trajectory: locked ratings against the ceiling at each step. */
  function renderTrace() {
    var LEFT = 46, RIGHT = 424, TOP = 14, BOTTOM = 150;
    var steps = COMPLICATIONS.length;

    function xOf(step) { return LEFT + (step / steps) * (RIGHT - LEFT); }
    function yOf(value) { return BOTTOM - (value / 100) * (BOTTOM - TOP); }

    clear(traceSvg);

    [0, 25, 50, 75, 100].forEach(function (value) {
      traceSvg.appendChild(svgEl("line", {
        x1: LEFT, y1: yOf(value), x2: RIGHT, y2: yOf(value), class: "chart__grid"
      }));
      traceSvg.appendChild(
        svgText(LEFT - 6, yOf(value) + 4, "chart__axis", "end", value + "%"));
    });

    var ceilingPoints = [];
    var yourPoints = [];
    for (var step = 0; step <= state.step; step += 1) {
      var card = step === 0 ? REFERRAL : COMPLICATIONS[step - 1];
      ceilingPoints.push([xOf(step), yOf(card.ceiling)]);
      var value = step < state.locked.length && state.locked[step] !== undefined
        ? state.locked[step]
        : state.confidence;
      yourPoints.push([xOf(step), yOf(value)]);
    }

    function polyline(points, className) {
      return svgEl("polyline", {
        points: points.map(function (p) {
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        }).join(" "),
        class: className
      });
    }

    traceSvg.appendChild(polyline(ceilingPoints, "chart__line chart__line--two"));
    traceSvg.appendChild(polyline(yourPoints, "chart__line"));

    yourPoints.forEach(function (point) {
      traceSvg.appendChild(svgEl("circle", {
        cx: point[0], cy: point[1], r: 4, class: "chart__point"
      }));
    });
    ceilingPoints.forEach(function (point) {
      traceSvg.appendChild(svgEl("rect", {
        x: point[0] - 3.5, y: point[1] - 3.5, width: 7, height: 7,
        class: "trap__ceiling-point"
      }));
    });

    for (var tick = 0; tick <= steps; tick += 1) {
      traceSvg.appendChild(
        svgText(xOf(tick), BOTTOM + 16, "chart__axis", "middle", String(tick)));
    }
    traceSvg.appendChild(
      svgText((LEFT + RIGHT) / 2, BOTTOM + 34, "chart__axis", "middle",
        "complications revealed"));
    traceSvg.appendChild(
      svgText(LEFT, BOTTOM + 52, "chart__axis", "start",
        "round markers: your confidence   square markers: what the evidence carries"));

    clear(traceTable);
    for (var row = 0; row <= state.step; row += 1) {
      var entry = row === 0 ? REFERRAL : COMPLICATIONS[row - 1];
      var tr = make("tr");
      var th = make("th", null, String(row));
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row === 0 ? "The referral only" : entry.short));
      var locked = state.locked[row];
      tr.appendChild(make("td", null,
        (locked === undefined ? state.confidence : locked) + "%" +
        (locked === undefined ? " (not yet locked)" : "")));
      tr.appendChild(make("td", null, entry.ceiling + "%"));
      traceTable.appendChild(tr);
    }
  }

  function renderSynthesis(done) {
    if (!done) {
      synthesis.hidden = true;
      return;
    }
    clear(synthesis);
    synthesis.appendChild(make("h4", "stage__heading", "What the case still supports"));
    synthesis.appendChild(make("p", null,
      "The complications bear far harder on the general claim than on the " +
      "specific one. That asymmetry is the point: lesion evidence is strong " +
      "about necessity in a person and weak about what a region does."));
    var list = make("ul", "trap__synthesis");
    SYNTHESIS.forEach(function (item) {
      var li = make("li");
      li.setAttribute("data-tone", item.tone);
      li.appendChild(make("strong", null, item.standing + " "));
      li.appendChild(document.createTextNode(item.claim));
      list.appendChild(li);
    });
    synthesis.appendChild(list);
    synthesis.hidden = false;
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    produces: {
      tone: "caution",
      verdict: "That is the sentence the tool is about.",
      text:
        "It is the natural reading of the notes and it is a claim about what " +
        "tissue does, which damage cannot deliver. Necessity - the task could " +
        "not be done without this tissue - is what a lesion speaks to. What " +
        "the tissue contributes is a further question. Six complications " +
        "follow; watch how many of them bear on this claim."
    },
    necessary: {
      tone: "good",
      verdict: "Yes - and hold onto the wording.",
      text:
        "\"Necessary, in this person\" is the claim lesion evidence supports, " +
        "and it survives everything you are about to read. The exercise is " +
        "about how much distance there is between that claim and the one it " +
        "gets reported as."
    },
    general: {
      tone: "caution",
      verdict: "A step beyond the case.",
      text:
        "This is a population claim - it says something about people in " +
        "general - and one case cannot establish how often anything happens. " +
        "It is a good hypothesis and a reasonable thing to go and test. The " +
        "complications below explain why testing it is harder than collecting " +
        "more patients."
    },
    nothing: {
      tone: "caution",
      verdict: "Too strong the other way.",
      text:
        "Lesion evidence is one of very few sources of evidence about " +
        "necessity, which is exactly what functional imaging cannot supply: " +
        "activation shows involvement, not indispensability. The case does " +
        "support something. The exercise is about establishing what."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the evidence room.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockEvidence();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockEvidence();
  });

  function unlockEvidence() {
    lockForm(openingForm);
    evidenceSection.hidden = false;
    render();
    $("#evidence-heading").focus();
    shell.announce(
      "Evidence room open. Six complications to reveal.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  CLAIMS.forEach(function (claim) {
    var fieldset = make("fieldset", "prediction__group trap__claim");
    var legend = make("legend", "prediction__legend", claim.text);
    fieldset.appendChild(legend);
    CLAIM_OPTIONS.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "claim-" + claim.id;
      input.value = option.value;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option.label));
      fieldset.appendChild(label);
    });
    claimsHost.appendChild(fieldset);
  });

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var answers = CLAIMS.map(function (claim) {
      var chosen = $('input[name="claim-' + claim.id + '"]:checked', challengeForm);
      return chosen ? chosen.value : null;
    });

    if (answers.some(function (value) { return value === null; })) {
      challengeError.textContent =
        "Sort all four claims before checking - the comparison between them is " +
        "the whole exercise.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var right = 0;
    clear(challengeFeedback);

    var lead = make("p");
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    lead.appendChild(make("strong", "feedback__verdict",
      right === CLAIMS.length
        ? "All four."
        : right + " of " + CLAIMS.length + " as intended."));
    lead.appendChild(document.createTextNode(
      " The sorting matters less than the reasons, so here they are."));
    challengeFeedback.appendChild(lead);

    var list = make("ul");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var chosenLabel = CLAIM_OPTIONS.filter(function (option) {
        return option.value === answers[index];
      })[0].label;
      var intendedLabel = CLAIM_OPTIONS.filter(function (option) {
        return option.value === claim.answer;
      })[0].label;
      li.appendChild(make("strong", null,
        answers[index] === claim.answer
          ? intendedLabel + ". "
          : "You said " + chosenLabel.toLowerCase() + "; intended: " +
            intendedLabel.toLowerCase() + ". "));
      li.appendChild(document.createTextNode(claim.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    challengeFeedback.setAttribute("data-tone",
      right === CLAIMS.length ? "good" : "caution");
    challengeFeedback.hidden = false;
    shell.announce("Sorting checked: " + right + " of " + CLAIMS.length +
      " as intended.", { immediate: true });
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
    state = { step: 0, confidence: 70, locked: [] };
    confidenceRange.value = "70";
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    evidenceSection.hidden = true;
    synthesis.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the evidence room.",
    { immediate: true });
})();
