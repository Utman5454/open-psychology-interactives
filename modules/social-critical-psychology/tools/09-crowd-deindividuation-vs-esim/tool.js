/* =========================================================================
   Crowd Behaviour Laboratory: deindividuation and the elaborated social
   identity model
   -------------------------------------------------------------------------
   One fictional crowd event (Marlow Bridge) can be set up five ways. The
   model reports two quantities, and the whole teaching point lives in the
   difference between them:

     PARTICIPATION  how many of six sections of the crowd took part
     SELECTIVITY    how concentrated the action was across four targets

   A generic deindividuation account predicts the first and is indifferent to
   the second: restraint that has been lost has no particular direction. The
   elaborated social identity model predicts the second: action is governed by
   a norm, and a norm sets limits as well as licence.

   THE EDUCATIONAL MODEL (all numbers invented for teaching)
   ---------------------------------------------------------
   Six sections of the crowd each carry a baseline readiness to confront:

       Bridge Road residents               0.20
       Campaign committee regulars         0.40
       Weekend market stallholders         0.12
       Sixth-form students                 0.28
       Families at the fun day             0.04
       A handful expecting a confrontation 0.88

   A section takes part when

       baseline + unity x legitimacy + (norm shift, if inside the category)

   reaches 0.60, where

       unity        differentiated policing               0.10
                    indiscriminate, no common category    0.55
                    indiscriminate, common category       1.00
       legitimacy   read as reasonable                    0.12
                    read as unfair                        0.50
       norm shift   police line only                     +0.18
                    no shared understanding                0.00
                    confrontation out of bounds          -0.45

   A section is inside the category when unity reaches 0.55; the handful who
   came for a confrontation are inside it only at unity 1.00, because a
   differentiated or fragmented crowd never absorbs them.

   Target weights are set by the norm and then reshaped by identifiability.
   Where a norm is in play, anonymity SHARPENS it (each weight raised to the
   power 1.35 and renormalised) rather than broadening the targets - which is
   the direction the social identity model of deindividuation effects
   predicts, and the point at which the classic account and its successor part
   company. Where there is no shared norm, anonymity moves the weights 40 per
   cent of the way towards an even spread instead.

   Selectivity is the mean absolute deviation of the four shares from 0.25,
   divided by 1.5 so that 0 is a perfectly even spread and 1 is everything on
   one target. It is a teaching device invented for this page, not a published
   measure of anything.

   The "disinhibition index" reported beside it is what a deindividuation
   account tracks - identifiability plus how many sections joined in - and is
   printed precisely so that a learner can see two runs score almost the same
   on it while producing completely different patterns.

   WHAT THIS IS NOT
   ----------------
   Not evidence for either account: the model produces the patterns it was
   built to produce. Marlow Bridge and Calder Green are inventions and no real
   event, operation, organisation or person is described. Deindividuation is
   not refuted here; preset 3 is deliberately a case its description fits
   better than the identity account's usual prediction does.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* --- The crowd ---------------------------------------------------------- */

  var SECTIONS = [
    { id: "residents", name: "Bridge Road residents", base: 0.20 },
    { id: "campaign", name: "Campaign committee regulars", base: 0.40 },
    { id: "traders", name: "Weekend market stallholders", base: 0.12 },
    { id: "students", name: "Sixth-form students", base: 0.28 },
    { id: "families", name: "Families at the fun day", base: 0.04 },
    {
      id: "ready",
      name: "A handful who arrived expecting a confrontation",
      base: 0.88,
      outsider: true
    }
  ];

  var THRESHOLD = 0.60;

  var UNITY = { differentiated: 0.10, fragmented: 0.55, full: 1.00 };
  var LEGITIMACY = { legitimate: 0.12, illegitimate: 0.50 };
  var NORM_SHIFT = { police: 0.18, none: 0, off: -0.45 };

  /* `short` is what fits inside the chart; `label` is what the caption and the
     announcement say. The caption carries the full names, so nothing is lost
     by abbreviating the drawing. */
  var TARGETS = [
    { id: "police", short: "Police line", label: "the police line" },
    { id: "shops", short: "Shop fronts", label: "shop fronts on Bridge Road" },
    { id: "centre", short: "Community centre", label: "the community centre" },
    { id: "crowd", short: "Other crowd members", label: "other people in the crowd" }
  ];

  var BASE_WEIGHTS = {
    police: { police: 0.88, shops: 0.05, centre: 0.02, crowd: 0.05 },
    none: { police: 0.33, shops: 0.27, centre: 0.18, crowd: 0.22 },
    off: { police: 0.45, shops: 0.22, centre: 0.13, crowd: 0.20 }
  };

  var SHARPEN = 1.35;
  var FLATTEN = 0.4;
  var EVEN = 0.25;

  var PRESETS = [
    {
      id: "differentiated",
      label: "1. Differentiated policing",
      hint: "Individuals dealt with, the crowd left alone",
      state: {
        police: "differentiated", norm: "police", legitimacy: "legitimate",
        category: "yes", anonymity: "identifiable"
      }
    },
    {
      id: "indiscriminate",
      label: "2. Indiscriminate policing, common category",
      hint: "Same crowd, same norm, handled as one mass",
      state: {
        police: "indiscriminate", norm: "police", legitimacy: "illegitimate",
        category: "yes", anonymity: "identifiable"
      }
    },
    {
      id: "fragmented",
      label: "3. No common category, anonymous",
      hint: "The run a deindividuation account describes best",
      state: {
        police: "indiscriminate", norm: "none", legitimacy: "illegitimate",
        category: "no", anonymity: "anonymous"
      }
    },
    {
      id: "restrained",
      label: "4. United, and the norm forbids it",
      hint: "A crowd that unites completely and does almost nothing",
      state: {
        police: "indiscriminate", norm: "off", legitimacy: "illegitimate",
        category: "yes", anonymity: "anonymous"
      }
    }
  ];

  /* --- The challenge ------------------------------------------------------ */

  var CLAIMS = [
    {
      id: "stalls",
      text:
        "\"Bottles were thrown at the police line for twenty minutes. Fifty " +
        "metres away the row of food stalls was untouched, and two people who " +
        "went for one of them were pulled away by others in the crowd.\"",
      answer: "esim",
      why:
        "Restraint that has been lost cannot explain restraint that is being " +
        "enforced. Somebody in that crowd was doing boundary work - deciding " +
        "what the action was for and what it was not - and that is a norm, " +
        "which is exactly what an identity account expects a shared category " +
        "to supply."
    },
    {
      id: "heat",
      text:
        "\"People who had been on the field for six hours in the heat, with no " +
        "water and no information, were considerably more likely to join in.\"",
      answer: "both",
      why:
        "A deindividuation account reads this as arousal and depleted " +
        "self-regulation, and that is a coherent reading. An identity account " +
        "reads the same fact as a crowd being treated with contempt for six " +
        "hours, which is what makes the treatment illegitimate and the " +
        "category available. The observation does not choose between them."
    },
    {
      id: "onemass",
      text:
        "\"When the power was cut, everyone in the north field - who had come " +
        "separately, in small groups, and did not know each other - was moved " +
        "off as a single block by officers in identical uniform.\"",
      answer: "esim",
      why:
        "A deindividuation account has nothing to say about this. Being " +
        "handled as one mass is itself an argument that you are one, and it " +
        "can create the shared category that was not there before - where " +
        "deindividuation treats the crowd as the thing to be explained and " +
        "the policing as a response to it."
    },
    {
      id: "selfreport",
      text:
        "\"A survey afterwards found that people who had covered their faces " +
        "reported feeling less individually identifiable.\"",
      answer: "neither",
      why:
        "This is a self-report about a feeling, collected after the event, " +
        "from people who know what happened. It tells you nothing about what " +
        "anybody did, to whom, or why - and both accounts would predict the " +
        "correlation anyway. Treating it as evidence for deindividuation " +
        "measures the proposed mediator and calls it the outcome, which is a " +
        "measurement error rather than a theoretical result."
    },
    {
      id: "carpark",
      text:
        "\"In the car park, unconnected small groups smashed windscreens, a " +
        "bus shelter, a ticket machine and each other's wing mirrors, with no " +
        "discernible pattern to what was hit.\"",
      answer: "deind",
      why:
        "This is the case a deindividuation account describes well and an " +
        "identity account has to work hardest at. There is no target " +
        "selection to explain, no boundary being enforced, and no obvious " +
        "shared category. An identity theorist would have to argue for " +
        "several small categories with different norms - which is possible, " +
        "and is more work than the alternative. Preset 3 in the laboratory " +
        "produces this shape deliberately."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "deind", label: "A deindividuation account handles this better" },
    { value: "esim", label: "The elaborated social identity model handles this better" },
    { value: "both", label: "Both handle it - the observation does not choose between them" },
    { value: "neither", label: "Neither - this observation supports no conclusion about crowd action" }
  ];

  var CLAIM_SHORT = {
    deind: "A deindividuation account handles this better",
    esim: "The elaborated social identity model handles this better",
    both: "Both handle it",
    neither: "Neither - it supports no conclusion about crowd action"
  };

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

  function pct(value) {
    return Math.round(value * 100);
  }

  function fixed(value, places) {
    return Number(value).toFixed(places === undefined ? 2 : places);
  }

  /* =======================================================================
     The model
     ===================================================================== */

  /**
   * Run one afternoon. Everything the display needs comes out of here so the
   * arithmetic lives in one place and can be checked against the notes.
   */
  function runModel(setup) {
    var unity = setup.police === "differentiated"
      ? UNITY.differentiated
      : (setup.category === "yes" ? UNITY.full : UNITY.fragmented);
    var legitimacy = LEGITIMACY[setup.legitimacy];
    var normShift = NORM_SHIFT[setup.norm];
    var treatmentBonus = unity * legitimacy;

    var rows = SECTIONS.map(function (section) {
      /* A section sits inside the shared category once the crowd is being
         handled as one. The handful who came for a confrontation are absorbed
         only when the category is fully available - a fragmented crowd never
         takes them in. */
      var inside = unity >= UNITY.fragmented && (!section.outsider || unity === UNITY.full);
      var shift = inside ? normShift : 0;
      var total = section.base + treatmentBonus + shift;
      return {
        name: section.name,
        base: section.base,
        situational: treatmentBonus + shift,
        total: total,
        inside: inside,
        acted: total >= THRESHOLD
      };
    });

    var acting = rows.filter(function (row) { return row.acted; }).length;

    /* Target weights: the norm sets the shape, identifiability reshapes it. */
    var base = BASE_WEIGHTS[setup.norm];
    var weights = {};
    if (setup.anonymity === "anonymous" && setup.norm === "none") {
      /* No norm to sharpen, so anonymity moves the spread towards even. */
      TARGETS.forEach(function (target) {
        weights[target.id] = (1 - FLATTEN) * base[target.id] + FLATTEN * EVEN;
      });
    } else if (setup.anonymity === "anonymous") {
      var sum = 0;
      TARGETS.forEach(function (target) {
        weights[target.id] = Math.pow(base[target.id], SHARPEN);
        sum += weights[target.id];
      });
      TARGETS.forEach(function (target) { weights[target.id] /= sum; });
    } else {
      TARGETS.forEach(function (target) { weights[target.id] = base[target.id]; });
    }

    var deviation = 0;
    TARGETS.forEach(function (target) {
      deviation += Math.abs(weights[target.id] - EVEN);
    });
    var selectivity = deviation / 1.5;

    /* What a deindividuation account tracks: identifiability and how many
       people were swept in. Deliberately reported so that two runs can score
       almost the same on it and look nothing alike. */
    var disinhibition = (setup.anonymity === "anonymous" ? 0.5 : 0.2) + acting / 12;

    return {
      unity: unity,
      legitimacy: legitimacy,
      normShift: normShift,
      treatmentBonus: treatmentBonus,
      rows: rows,
      acting: acting,
      weights: weights,
      selectivity: selectivity,
      disinhibition: disinhibition
    };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#crowd-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var legitimacySelect = $("#legitimacy-select");
  var categorySelect = $("#category-select");
  var anonymitySelect = $("#anonymity-select");
  var presetsBox = $("[data-presets]");

  var headline = $("[data-headline]");
  var targetsSvg = $("[data-targets]");
  var targetsText = $("[data-targets-text]");
  var readings = $("[data-readings]");
  var sectionsBody = $("[data-sections-body]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var INITIAL = {
    police: "differentiated",
    norm: "police",
    legitimacy: "legitimate",
    category: "yes",
    anonymity: "identifiable"
  };
  var state = null;

  /* --- Reading the controls ------------------------------------------------ */

  function readControls() {
    var police = $('input[name="police"]:checked');
    var norm = $('input[name="norm"]:checked');
    state.police = police ? police.value : INITIAL.police;
    state.norm = norm ? norm.value : INITIAL.norm;
    state.legitimacy = legitimacySelect.value;
    state.category = categorySelect.value;
    state.anonymity = anonymitySelect.value;
  }

  function writeControls() {
    $$('input[name="police"]').forEach(function (input) {
      input.checked = input.value === state.police;
    });
    $$('input[name="norm"]').forEach(function (input) {
      input.checked = input.value === state.norm;
    });
    legitimacySelect.value = state.legitimacy;
    categorySelect.value = state.category;
    anonymitySelect.value = state.anonymity;
  }

  /* --- Drawing -------------------------------------------------------------- */

  var NS = "http://www.w3.org/2000/svg";
  var BAR_X = 138;
  var BAR_W = 152;
  var ROW_H = 32;
  var BAR_H = 18;

  function drawTargets(result) {
    clear(targetsSvg);
    var any = result.acting > 0;

    /* The even-spread reference, marked with a dashed line AND labelled, so
       the comparison never depends on seeing the line. */
    var markX = BAR_X + EVEN * BAR_W;
    var marker = document.createElementNS(NS, "line");
    marker.setAttribute("x1", String(markX));
    marker.setAttribute("x2", String(markX));
    marker.setAttribute("y1", "16");
    marker.setAttribute("y2", String(14 + TARGETS.length * ROW_H));
    marker.setAttribute("class", "target__marker");
    targetsSvg.appendChild(marker);

    var markLabel = document.createElementNS(NS, "text");
    markLabel.setAttribute("x", String(markX));
    markLabel.setAttribute("y", "11");
    markLabel.setAttribute("text-anchor", "middle");
    markLabel.setAttribute("class", "chart__axis");
    markLabel.textContent = "even spread 25%";
    targetsSvg.appendChild(markLabel);

    TARGETS.forEach(function (target, index) {
      var y = 18 + index * ROW_H;
      var share = any ? result.weights[target.id] : 0;

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(BAR_X));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(BAR_W));
      track.setAttribute("height", String(BAR_H));
      track.setAttribute("class", "chart__track");
      targetsSvg.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(BAR_X));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(share > 0 ? 1 : 0, share * BAR_W)));
      bar.setAttribute("height", String(BAR_H));
      bar.setAttribute("class", target.id === "police" ? "chart__bar bar--police" : "chart__bar");
      targetsSvg.appendChild(bar);

      var name = document.createElementNS(NS, "text");
      name.setAttribute("x", String(BAR_X - 6));
      name.setAttribute("y", String(y + 13));
      name.setAttribute("text-anchor", "end");
      name.setAttribute("class", "chart__label");
      name.textContent = target.short;
      targetsSvg.appendChild(name);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(BAR_X + Math.max(2, share * BAR_W) + 5));
      value.setAttribute("y", String(y + 13));
      value.setAttribute("class", "chart__count");
      value.textContent = any ? pct(share) + "%" : "-";
      targetsSvg.appendChild(value);
    });
  }

  /* --- The readings --------------------------------------------------------- */

  function selectivityWord(value) {
    if (value >= 0.60) { return "concentrated on one target"; }
    if (value >= 0.30) { return "only partly concentrated"; }
    return "close to an even spread";
  }

  function buildReadings(result) {
    clear(readings);

    /* --- What a deindividuation account tracks --- */
    var one = make("div", "verdict");
    one.setAttribute("data-tone", "neutral");
    one.appendChild(make("h5", "verdict__title",
      "Read as a deindividuation account would"));
    var predicts = result.disinhibition >= 0.60
      ? "plenty of action"
      : result.disinhibition >= 0.35 ? "some action" : "little action";
    one.appendChild(make("p", "verdict__body",
      "Deindividuation predicts " + predicts + " here: " +
      fixed(result.disinhibition) + " on a 0 to 1 scale, from anonymity and " +
      "how much of the crowd was swept in. " +
      (state.anonymity === "anonymous"
        ? "People were anonymous in the mass: on this account, the condition " +
          "under which personal standards stop governing behaviour."
        : "People were recognisable to each other: on this account, the " +
          "condition under which personal standards still govern behaviour.")));
    one.appendChild(make("p", "verdict__body",
      "What it does not predict is the row of numbers above. Lost restraint " +
      "has no direction, so the four targets should be roughly " +
      "interchangeable. Here they were " + selectivityWord(result.selectivity) +
      "."));

    /* --- What the elaborated model says --- */
    var two = make("div", "verdict");
    two.setAttribute("data-tone", "neutral");
    two.appendChild(make("h5", "verdict__title",
      "Read as the elaborated social identity model would"));

    var unityText;
    if (result.unity === UNITY.differentiated) {
      unityText =
        "Policing was differentiated, so no common category formed. The " +
        "sections stayed separate and the handful who came for a confrontation " +
        "stayed a handful with nobody behind them.";
    } else if (result.unity === UNITY.full) {
      unityText =
        "The crowd was handled as one mass and a description everyone could " +
        "recognise themselves in was available, so one category formed across " +
        "all six sections - including the ones who came for a fun day. The " +
        "policing did not respond to that category; it helped make it.";
    } else {
      unityText =
        "The crowd was handled as one mass, but no description was available " +
        "that everyone could recognise themselves in, so only part of it was " +
        "drawn together. Indiscriminate treatment is not by itself sufficient: " +
        "there has to be a category for it to create.";
    }
    two.appendChild(make("p", "verdict__body", unityText));

    var normText;
    if (state.norm === "police") {
      normText =
        "The norm licensed one thing and forbade the rest, and the shares " +
        "follow it: " + pct(result.weights.police) + " per cent to the police " +
        "line, " + pct(result.weights.shops + result.weights.centre) +
        " per cent to the shops and the community centre combined.";
    } else if (state.norm === "off") {
      normText =
        "The norm put confrontation out of bounds, which is a norm like any " +
        "other and produces restraint rather than licence. " +
        (result.acting <= 1
          ? "Almost nobody took part - a result the account predicts rather " +
            "than an absence of one."
          : "The action that did occur was held down accordingly.");
    } else {
      normText =
        "There was no shared understanding of what was acceptable, so nothing " +
        "to set limits with. This is where the identity account has least to " +
        "say, and the shares show it.";
    }
    two.appendChild(make("p", "verdict__body", normText));

    two.appendChild(make("p", "verdict__body",
      state.legitimacy === "illegitimate"
        ? "The response was read as unfair and aimed at people who had done " +
          "nothing - what turns being handled as a group into having a reason " +
          "to act as one."
        : "The response was read as reasonable, which leaves the crowd little " +
          "to unite around even when handled as a group. Legitimacy is doing " +
          "as much work here as unity."));

    /* --- Where they diverge --- */
    var three = make("div", "verdict");
    var verdictText;
    var tone;
    if (result.acting === 0) {
      tone = "neutral";
      verdictText =
        "Nothing happened, so neither account is being tested - which is a " +
        "possible outcome, and the commonest one. Change the policing or the " +
        "legitimacy and run it again.";
    } else if (result.selectivity >= 0.60) {
      tone = "warn";
      verdictText =
        "This run separates the two accounts cleanly. " + result.acting +
        " of 6 sections took part, and what they did stayed aimed at one " +
        "target while three others within reach were left alone. A general " +
        "loss of restraint does not predict selective action, and selective " +
        "action is what a shared norm looks like from outside.";
    } else if (result.selectivity < 0.30) {
      tone = "caution";
      verdictText =
        "This run goes the other way. Action was spread almost evenly across " +
        "every available target, which is the shape a deindividuation account " +
        "describes well and an identity account has to work hardest to " +
        "explain - it would have to argue for several small categories with " +
        "different norms, which is possible but is more work. Cases like this " +
        "are why the argument is still live.";
    } else {
      tone = "neutral";
      verdictText =
        "This run does not separate the accounts. Action was partly " +
        "concentrated and partly not, which both accounts can absorb - one by " +
        "calling it a weakly shared norm, the other by calling it partial " +
        "disinhibition. Runs like this are the majority of real events, and " +
        "they are why single events rarely settle anything.";
    }
    three.setAttribute("data-tone", tone);
    three.appendChild(make("h5", "verdict__title", "Where the two accounts diverge"));
    three.appendChild(make("p", "verdict__body", verdictText));
    three.appendChild(make("p", "verdict__note",
      "Participation and selectivity move independently. Run preset 2 and " +
      "preset 3 one after the other: the deindividuation index barely changes " +
      "between them, and the pattern of what was done changes completely."));

    readings.appendChild(one);
    readings.appendChild(two);
    readings.appendChild(three);
  }

  /* --- The section table ------------------------------------------------------ */

  function buildSections(result) {
    clear(sectionsBody);
    result.rows.forEach(function (row) {
      var tr = make("tr");
      tr.setAttribute("data-acted", row.acted ? "yes" : "no");
      var th = make("th", null, row.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, fixed(row.base)));
      tr.appendChild(make("td", null,
        (row.situational >= 0 ? "+" : "") + fixed(row.situational)));
      tr.appendChild(make("td", null, fixed(row.total)));
      tr.appendChild(make("td", null, row.acted ? "Yes" : "No"));
      sectionsBody.appendChild(tr);
    });
  }

  /* --- Render ------------------------------------------------------------------ */

  function render(options) {
    var result = runModel(state);

    if (result.acting === 0) {
      headline.textContent =
        "No section of the crowd took part. There is no distribution of " +
        "action to report.";
    } else {
      headline.textContent =
        result.acting + " of 6 sections took part, and the action was " +
        selectivityWord(result.selectivity) + " (selectivity " +
        fixed(result.selectivity) + " on a 0 to 1 scale).";
    }

    drawTargets(result);

    targetsText.textContent = result.acting === 0
      ? "No action occurred in this run, so no share can be reported for any " +
        "of the four targets. Selectivity is not defined."
      : "Share of the crowd's action by target: the police line " +
        pct(result.weights.police) + " per cent, shop fronts on Bridge Road " +
        pct(result.weights.shops) + " per cent, the community centre " +
        pct(result.weights.centre) + " per cent, other people in the crowd " +
        pct(result.weights.crowd) + " per cent. An even spread would be 25 " +
        "per cent each; selectivity " + fixed(result.selectivity) + ".";

    buildReadings(result);
    buildSections(result);

    if (!options || !options.silent) {
      shell.announce(
        result.acting === 0
          ? "No section of the crowd took part in this run."
          : result.acting + " of 6 sections took part. Action was " +
            selectivityWord(result.selectivity) + ", selectivity " +
            fixed(result.selectivity) + ". The police line took " +
            pct(result.weights.police) + " per cent of it.",
        { immediate: true });
    }
    return result;
  }

  /* --- Controls -------------------------------------------------------------- */

  $$('input[name="police"], input[name="norm"]').forEach(function (input) {
    input.addEventListener("change", function () { readControls(); render(); });
  });
  [legitimacySelect, categorySelect, anonymitySelect].forEach(function (select) {
    select.addEventListener("change", function () { readControls(); render(); });
  });

  function buildPresets() {
    clear(presetsBox);
    PRESETS.forEach(function (preset) {
      var button = make("button", "button button--secondary preset");
      button.type = "button";
      button.appendChild(make("span", "preset__label", preset.label));
      button.appendChild(make("span", "preset__hint", preset.hint));
      button.addEventListener("click", function () {
        Object.keys(preset.state).forEach(function (key) {
          state[key] = preset.state[key];
        });
        writeControls();
        var result = render({ silent: true });
        shell.announce(
          preset.label + " loaded. " + (result.acting === 0
            ? "No section took part."
            : result.acting + " of 6 sections took part, selectivity " +
              fixed(result.selectivity) + "."),
          { immediate: true });
      });
      presetsBox.appendChild(button);
    });
  }

  /* --- Challenge --------------------------------------------------------------- */

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
      CLAIM_OPTIONS.forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "claim-" + claim.id;
        input.value = option.value;
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      claimsList.appendChild(group);
    });
  }

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution",
        "One judgement per observation, please.",
        "A blank is not a verdict.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", right + " of 5 match."));
    lead.appendChild(document.createTextNode(
      " Two of these are meant to resist an easy answer: one that both " +
      "accounts explain equally well, and one that supports no conclusion " +
      "about crowd action at all."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        (index + 1) + ": " + CLAIM_SHORT[claim.answer] + "."));
      head.appendChild(document.createTextNode(
        agreed
          ? " That is what you said."
          : " You said: " + CLAIM_SHORT[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Five observations judged. " + right + " match.",
      { immediate: true });
  });

  /* --- Opening prediction -------------------------------------------------------- */

  var OPENING = {
    calm: {
      tone: "caution",
      verdict: "Sometimes, and it is the outcome nobody studies.",
      text:
        "Most demonstrations on most afternoons end with everyone going home, " +
        "and a literature built only on the ones that did not is a biased " +
        "sample. But the specific thing being asked about here - being pushed " +
        "back as a mass, regardless of what you were doing - is the condition " +
        "under which both accounts expect something rather than nothing."
    },
    minority: {
      tone: "caution",
      verdict: "That is what differentiated policing produces, not this.",
      text:
        "Try preset 1 and then preset 2 in the laboratory. Under differentiated " +
        "policing the handful who came for a confrontation stay a handful. It " +
        "is being handled as one mass that puts everyone else in the same " +
        "category as them."
    },
    spread: {
      tone: "good",
      verdict: "That is the elaborated model's prediction, and it has two parts.",
      text:
        "Participation generalises - sections of the crowd who wanted nothing " +
        "to do with a confrontation are now inside a category that has a " +
        "reason to have one - while the targets stay narrow, because a shared " +
        "identity brings limits as well as licence. Preset 2 in the laboratory " +
        "is exactly this."
    },
    chaos: {
      tone: "caution",
      verdict: "That is the deindividuation prediction, and it is testable.",
      text:
        "Lost restraint has no direction, so this account expects action to " +
        "spread across whatever is to hand. The laboratory can produce that " +
        "shape - preset 3 does - but it takes the absence of a shared category " +
        "and of a shared norm to get there. Whether real events look like " +
        "preset 2 or preset 3 is the empirical question."
    }
  };

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
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function unlockLab() {
    labSection.hidden = false;
    render({ silent: true });
    shell.announce(
      "Laboratory open, loaded with differentiated policing seen as legitimate.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    unlockLab();
    $("#lab-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    unlockLab();
  });

  /* --- Reset and start-up --------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    writeControls();
    render({ silent: true });
  });

  buildPresets();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Read the two accounts above, then answer the question to open the " +
    "laboratory.",
    { immediate: true });
})();
