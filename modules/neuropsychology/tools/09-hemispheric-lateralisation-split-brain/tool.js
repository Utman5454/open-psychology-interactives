/* =========================================================================
   Split-Brain Laboratory
   -------------------------------------------------------------------------
   Two staged experiments about the LOGIC of a lateralised trial.

     Experiment 1  The learner builds a trial - item, visual field, response
                   channel, corpus callosum - predicts the outcome, and runs
                   it. The routing diagram shows where the information can and
                   cannot go.
     Experiment 2  The one trial that classically fails is fixed, and the five
                   conditions it depends on can be switched off one at a time.

   THE EDUCATIONAL MODEL
   ---------------------
   Deliberately a caricature, and said so on the page:

     * each visual field projects to the OPPOSITE hemisphere;
     * each hand is controlled by the OPPOSITE hemisphere;
     * speech is produced by the LEFT hemisphere (the textbook simplifying
       assumption, which experiment 2 lets the learner switch off);
     * with the callosum intact, whatever one hemisphere receives is available
       to the other;
     * after a complete section, a response succeeds only when the hemisphere
       that received the item also controls the channel that was asked with.

   That is the whole of experiment 1. Twelve combinations; six succeed after a
   section and all twelve succeed with the callosum intact.

   WHY EXPERIMENT 2 EXISTS
   -----------------------
   The classic failure (left visual field, spoken report, complete section)
   depends on four methodological conditions and one fact about the
   individual. Break any of them and the person reports the word. A
   methodological failure and a theory-breaking result produce the same
   observation, which is the point.

   Losing fixation monitoring is treated differently from the rest: it does
   not turn a failure into a success, it turns the trial into something that
   cannot be interpreted in either direction.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Nothing is presented to a visual field - a browser cannot control fixation
   or duration. Real split-brain performance varies with material, task,
   interval, practice and individual. Speech is not left-lateralised in
   everyone. Many disconnected right hemispheres read simple words. The four
   items are ordinary words invented for this page; no published stimulus,
   image or procedure is reproduced, and no real participant appears.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     The model
     ===================================================================== */

  var ITEMS = [
    { id: "spoon", word: "SPOON", object: "a spoon" },
    { id: "key", word: "KEY", object: "a key" },
    { id: "ring", word: "RING", object: "a ring" },
    { id: "comb", word: "COMB", object: "a comb" }
  ];

  var FIELDS = [
    {
      id: "left", label: "Left visual field", short: "Left field",
      hemisphere: "right"
    },
    {
      id: "right", label: "Right visual field", short: "Right field",
      hemisphere: "left"
    }
  ];

  var CHANNELS = [
    {
      id: "speak", label: "Say what it was", short: "Speech",
      hemisphere: "left",
      succeed: function (item) { return "says “" + item.word.toLowerCase() + "”"; },
      fail: "says they saw nothing at all"
    },
    {
      id: "lefthand", label: "Pick it out with the left hand, out of sight",
      short: "Left hand", hemisphere: "right",
      succeed: function (item) { return "picks out " + item.object + " with the left hand"; },
      fail: "gropes about with the left hand and picks at random"
    },
    {
      id: "righthand", label: "Pick it out with the right hand, out of sight",
      short: "Right hand", hemisphere: "left",
      succeed: function (item) { return "picks out " + item.object + " with the right hand"; },
      fail: "gropes about with the right hand and picks at random"
    }
  ];

  var CALLOSUM = [
    { id: "intact", label: "Intact", short: "Intact" },
    { id: "sectioned", label: "Completely sectioned", short: "Sectioned" }
  ];

  var HEMI_NAME = { left: "left hemisphere", right: "right hemisphere" };

  /** True when the model says the response channel can answer. */
  function succeeds(field, channel, callosum) {
    return callosum === "intact" || field.hemisphere === channel.hemisphere;
  }

  /* The five things the classic failure depends on. Unticking one breaks it.
     "fixation" is the odd one out: it makes the trial uninterpretable rather
     than turning the failure into a success. */
  var CONDITIONS = [
    {
      id: "brief",
      label: "Presentation was brief - too brief for the eyes to move",
      broken:
        "The presentation lasted long enough for the eyes to move, so the " +
        "word also landed in the right visual field and the left hemisphere " +
        "read it there. Nothing about the brain has changed."
    },
    {
      id: "fixation",
      label: "Fixation was monitored and held",
      broken:
        "Nobody checked where the eyes were pointing, so which hemisphere " +
        "received the word is unknown. Neither a success nor a failure on " +
        "this trial can be interpreted."
    },
    {
      id: "complete",
      label: "The section was complete, including the splenium",
      broken:
        "Part of the callosum is intact. The splenium is the part that " +
        "carries visual information, so it still crosses. “Split-brain” " +
        "describes several different operations, not one."
    },
    {
      id: "crosscue",
      label: "Cross-cueing routes were controlled",
      broken:
        "The person can cue their own left hemisphere - tracing the shape " +
        "with the left hand where the right eye can see it, or making a " +
        "small sound both hemispheres hear. The answer is correct by a route " +
        "the design was meant to exclude."
    },
    {
      id: "leftlang",
      label: "This person's speech is produced by the left hemisphere only",
      broken:
        "Speech is not left-lateralised in everyone, and many disconnected " +
        "right hemispheres understand more language than they can produce. " +
        "If this right hemisphere contributes to speech, the word is " +
        "reported without anything crossing."
    }
  ];

  var PRESETS = [
    {
      id: "all", label: "All five hold - the classic result", off: [],
      note: "Every safeguard in place. This is the trial the textbooks describe."
    },
    {
      id: "hurried", label: "A session that ran too fast to control",
      off: ["brief", "fixation"],
      note: "Presentation too long and no fixation monitoring. The trial now says nothing."
    },
    {
      id: "everything", label: "Everything that could go wrong",
      off: ["brief", "fixation", "complete", "crosscue", "leftlang"],
      note: "Five separate reasons the word could be reported, and no way to tell them apart."
    }
  ];

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

  function byId(list, id) {
    return list.filter(function (entry) { return entry.id === id; })[0];
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#split");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var track = $("[data-track]");
  var stageTitle = $("[data-stage-title]");
  var stageBrief = $("[data-stage-brief]");
  var goalText = $("[data-goal-text]");
  var oneControls = $("[data-stage-one-controls]");
  var twoControls = $("[data-stage-two-controls]");
  var onePrimary = $("[data-stage-one-primary]");
  var twoPrimary = $("[data-stage-two-primary]");
  var itemSelect = $("[data-item-select]");
  var fieldControls = $("[data-field-controls]");
  var channelControls = $("[data-channel-controls]");
  var callosumControls = $("[data-callosum-controls]");
  var predictControls = $("[data-predict-controls]");
  var conditionControls = $("[data-condition-controls]");
  var presetHost = $("[data-presets]");
  var routeSvg = $("[data-route]");
  var routeText = $("[data-route-text]");
  var routeHeading = $("[data-route-heading]");
  var outcomeBox = $("[data-outcome]");
  var outcomeTitle = $("[data-outcome-title]");
  var outcomeBody = $("[data-outcome-body]");
  var conditionsOutcome = $("[data-conditions-outcome]");
  var conditionsTitle = $("[data-conditions-title]");
  var conditionsBody = $("[data-conditions-body]");
  var conditionsReasons = $("[data-conditions-reasons]");
  var reasonsBlock = $("[data-reasons-block]");
  var trialFeedback = $("[data-trial-feedback]");
  var tableHeading = $("[data-table-heading]");
  var tableHead = $("[data-table-head]");
  var mainTable = $("[data-main-table]");
  var tableNote = $("[data-table-note]");
  var gridTable = $("[data-grid-table]");
  var trialError = $("[data-trial-error]");
  var toStageTwo = $('[data-action="to-stage-two"]');
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  function initialState() {
    return {
      stage: 1,
      item: ITEMS[0].id,
      field: FIELDS[0].id,
      channel: CHANNELS[0].id,
      callosum: CALLOSUM[1].id,
      predicted: null,      /* "yes" | "no" | null */
      lastTrial: null,      /* the trial just run, or null */
      log: [],              /* every trial run, newest last */
      conditions: {}        /* conditions[id] = true when the condition holds */
    };
  }

  var state = initialState();
  CONDITIONS.forEach(function (c) { state.conditions[c.id] = true; });

  function currentItem() { return byId(ITEMS, state.item); }
  function currentField() { return byId(FIELDS, state.field); }
  function currentChannel() { return byId(CHANNELS, state.channel); }

  /* --- Controls, built once --------------------------------------------- */

  ITEMS.forEach(function (item) {
    var option = document.createElement("option");
    option.value = item.id;
    option.textContent = "The word " + item.word;
    itemSelect.appendChild(option);
  });
  itemSelect.addEventListener("change", function () {
    state.item = itemSelect.value;
    clearResult();
    render();
  });

  /** Build a group of radios into a host element. */
  function radioGroup(host, name, entries, getValue, setValue) {
    entries.forEach(function (entry, index) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = entry.id;
      input.checked = entry.id === getValue();
      input.setAttribute("data-group", name);
      input.addEventListener("change", function () {
        setValue(entry.id);
        clearResult();
        render();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(entry.label));
      host.appendChild(label);
      return index;
    });
  }

  radioGroup(fieldControls, "field", FIELDS,
    function () { return state.field; },
    function (id) { state.field = id; });

  radioGroup(channelControls, "channel", CHANNELS,
    function () { return state.channel; },
    function (id) { state.channel = id; });

  radioGroup(callosumControls, "callosum", CALLOSUM,
    function () { return state.callosum; },
    function (id) { state.callosum = id; });

  radioGroup(predictControls, "predict",
    [
      { id: "yes", label: "The response will be correct" },
      { id: "no", label: "The response will not be correct" }
    ],
    function () { return state.predicted; },
    function (id) { state.predicted = id; });

  CONDITIONS.forEach(function (condition) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    input.setAttribute("data-condition", condition.id);
    input.addEventListener("change", function () {
      state.conditions[condition.id] = input.checked;
      render();
      shell.announce(condition.label + ": " +
        (input.checked ? "holds." : "does not hold."), { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(condition.label));
    conditionControls.appendChild(label);
  });

  PRESETS.forEach(function (preset) {
    var button = make("button", "button button--secondary", preset.label);
    button.type = "button";
    button.addEventListener("click", function () {
      CONDITIONS.forEach(function (condition) {
        state.conditions[condition.id] = preset.off.indexOf(condition.id) === -1;
      });
      syncConditionBoxes();
      render();
      shell.announce(preset.label + ". " + preset.note, { immediate: true });
    });
    presetHost.appendChild(button);
  });

  function syncConditionBoxes() {
    Array.prototype.forEach.call(
      conditionControls.querySelectorAll("[data-condition]"),
      function (input) {
        input.checked = Boolean(state.conditions[input.getAttribute("data-condition")]);
      });
  }

  function syncTrialControls() {
    itemSelect.value = state.item;
    Array.prototype.forEach.call(
      controlsForm.querySelectorAll('[data-group]'),
      function (input) {
        var group = input.getAttribute("data-group");
        var wanted = group === "field" ? state.field
          : group === "channel" ? state.channel
            : group === "callosum" ? state.callosum
              : state.predicted;
        input.checked = input.value === wanted;
      });
  }

  /** A changed setting invalidates the result of the previous run. */
  function clearResult() {
    state.lastTrial = null;
    trialFeedback.hidden = true;
    trialError.hidden = true;
  }

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (state.stage === 1) { runTrial(); }
  });

  $('[data-action="worked"]').addEventListener("click", function () {
    state.item = ITEMS[0].id;
    state.field = "left";
    state.channel = "speak";
    state.callosum = "sectioned";
    state.predicted = null;
    clearResult();
    syncTrialControls();
    render();
    shell.announce(
      "Classic trial set up: the word spoon in the left visual field, a " +
      "spoken report, a complete section. Make a prediction, then run it.",
      { immediate: true });
  });

  toStageTwo.addEventListener("click", function () { goToStage(2); });
  $('[data-action="to-stage-one"]').addEventListener("click", function () {
    goToStage(1);
  });

  function goToStage(stage) {
    state.stage = stage;
    trialFeedback.hidden = true;
    trialError.hidden = true;
    render();
    shell.announce(stage === 1
      ? "Experiment 1. Build a trial, predict the outcome, then run it."
      : "Experiment 2. Switch off the conditions the classic result depends on.",
      { immediate: true });
  }

  /* --- Running a trial --------------------------------------------------- */

  function runTrial() {
    if (!state.predicted) {
      trialError.textContent = "Predict the outcome before running the trial.";
      trialError.hidden = false;
      return;
    }
    trialError.hidden = true;

    var field = currentField();
    var channel = currentChannel();
    var item = currentItem();
    var ok = succeeds(field, channel, state.callosum);

    state.lastTrial = {
      item: item, field: field, channel: channel,
      callosum: state.callosum, success: ok, predicted: state.predicted
    };
    state.log.push(state.lastTrial);

    render();
    showTrialFeedback(state.lastTrial);
    shell.announce(
      (ok ? "Correct response. " : "No correct response. ") +
      "The " + HEMI_NAME[field.hemisphere] + " received it and the " +
      HEMI_NAME[channel.hemisphere] + " controls " +
      channel.short.toLowerCase() + ".", { immediate: true });
  }

  function showTrialFeedback(trial) {
    var right = (trial.predicted === "yes") === trial.success;
    clear(trialFeedback);

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right ? "Your prediction was right." : "Not what you predicted."));
    lead.appendChild(document.createTextNode(" " + routeSentence(trial)));
    trialFeedback.appendChild(lead);

    /* The teaching point sits in the comparison, so the feedback names the
       one change that would flip this particular trial. */
    trialFeedback.appendChild(make("p", null, flipSentence(trial)));

    trialFeedback.setAttribute("data-tone", right ? "good" : "caution");
    trialFeedback.hidden = false;
  }

  function routeSentence(trial) {
    return "The word " + trial.item.word + " in the " +
      trial.field.label.toLowerCase() + " reaches the " +
      HEMI_NAME[trial.field.hemisphere] + ". You asked with " +
      trial.channel.short.toLowerCase() + ", which the " +
      HEMI_NAME[trial.channel.hemisphere] + " controls. The callosum is " +
      (trial.callosum === "intact" ? "intact, so both hemispheres have it"
        : "sectioned, so nothing crosses") + ". The person " +
      (trial.success ? trial.channel.succeed(trial.item) : trial.channel.fail) + ".";
  }

  function flipSentence(trial) {
    if (trial.callosum === "intact") {
      return "With the callosum intact every combination works, so this trial " +
        "carries no information about lateralisation. Section it and run the " +
        "same trial again.";
    }
    if (trial.success) {
      return "This one succeeds because the hemisphere that received the item " +
        "also controls the channel. Keep everything else and switch to the " +
        "other hand.";
    }
    var partner = CHANNELS.filter(function (c) {
      return c.hemisphere === trial.field.hemisphere;
    })[0];
    return "The information is in the " + HEMI_NAME[trial.field.hemisphere] +
      " and has nowhere to go. It is not lost: ask with " +
      partner.short.toLowerCase() + " instead and the same person answers " +
      "correctly. What the person “knows” depends on which channel you " +
      "ask through.";
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    oneControls.hidden = state.stage !== 1;
    twoControls.hidden = state.stage !== 2;
    onePrimary.hidden = state.stage !== 1;
    twoPrimary.hidden = state.stage !== 2;

    Array.prototype.forEach.call(track.children, function (item, index) {
      item.removeAttribute("aria-current");
      item.removeAttribute("data-state");
      if (index + 1 < state.stage) { item.setAttribute("data-state", "done"); }
      if (index + 1 === state.stage) { item.setAttribute("aria-current", "step"); }
    });

    if (state.stage === 1) { renderStageOne(); } else { renderStageTwo(); }
    renderLog();
    renderGrid();
    renderGoal();
  }

  function renderStageOne() {
    reasonsBlock.hidden = true;
    stageTitle.textContent = "Experiment 1 - building a trial";
    stageBrief.textContent =
      "Nothing is flashed anywhere. Set the trial up, commit to a prediction, " +
      "and the model reports what its routing rules give.";
    tableHeading.textContent = "Trials you have run";
    tableNote.textContent = state.log.length
      ? "Rows where your prediction and the outcome disagree are the ones " +
        "worth reading twice."
      : "No trials yet. Set one up on the left and run it.";

    var field = currentField();
    var channel = currentChannel();
    routeHeading.textContent = state.lastTrial
      ? "The route this trial took"
      : "The route this trial would take";
    drawRoute(field, channel, state.callosum, state.lastTrial);

    if (state.lastTrial) {
      outcomeBox.hidden = false;
      outcomeTitle.textContent = state.lastTrial.success
        ? "A correct response"
        : "No correct response";
      outcomeBody.textContent = "The person " +
        (state.lastTrial.success
          ? state.lastTrial.channel.succeed(state.lastTrial.item)
          : state.lastTrial.channel.fail) + ".";
      outcomeBox.setAttribute("data-tone",
        state.lastTrial.success ? "good" : "warn");
    } else {
      outcomeBox.hidden = true;
    }
  }

  function renderStageTwo() {
    stageTitle.textContent = "Experiment 2 - what the result depends on";
    stageBrief.textContent =
      "The trial is fixed at the one that classically fails. Switch a " +
      "condition off and watch a famous finding turn into an ordinary one.";
    tableHeading.textContent = "Trials you ran in experiment 1";
    tableNote.textContent =
      "Kept here for comparison. Nothing in experiment 2 adds to this table.";

    var broken = CONDITIONS.filter(function (c) {
      return !state.conditions[c.id];
    });
    var fixationLost = !state.conditions.fixation;
    var others = broken.filter(function (c) { return c.id !== "fixation"; });

    clear(conditionsReasons);
    reasonsBlock.hidden = broken.length === 0;
    broken.forEach(function (condition) {
      var li = make("li");
      li.appendChild(make("strong", null, condition.label + ". "));
      li.appendChild(document.createTextNode(condition.broken));
      conditionsReasons.appendChild(li);
    });

    if (fixationLost) {
      conditionsTitle.textContent = "Uninterpretable";
      conditionsBody.textContent =
        "Without fixation monitoring you do not know which hemisphere " +
        "received the word, so neither a report nor a silence tells you " +
        "anything. Easy to lose, and hard to notice afterwards, because the " +
        "data still look like data.";
      conditionsOutcome.setAttribute("data-tone", "warn");
    } else if (others.length) {
      conditionsTitle.textContent = "The word is reported - and the account is untouched";
      conditionsBody.textContent =
        "The person says “spoon”. That is not evidence against " +
        "contralateral routing: " + others.length +
        (others.length === 1
          ? " of the conditions the demonstration depends on no longer holds, and it is"
          : " of the conditions the demonstration depends on no longer hold, and each is") +
        " enough on its own to put the word into the left hemisphere.";
      conditionsOutcome.setAttribute("data-tone", "caution");
    } else {
      conditionsTitle.textContent = "Nothing is reported - the classic result";
      conditionsBody.textContent =
        "All five conditions hold. The right hemisphere has the word, the " +
        "left hemisphere speaks, and nothing crosses. The person says they " +
        "saw nothing - and the left hand can still pick the object out of " +
        "the bag.";
      conditionsOutcome.setAttribute("data-tone", "good");
    }
  }

  function renderGoal() {
    var sectioned = state.log.filter(function (t) {
      return t.callosum === "sectioned";
    });
    var changed = sectioned.some(function (t) { return !t.success; });
    var unchanged = sectioned.some(function (t) { return t.success; });
    var bothHands = FIELDS.some(function (field) {
      return ["lefthand", "righthand"].every(function (channelId) {
        return sectioned.some(function (t) {
          return t.field.id === field.id && t.channel.id === channelId;
        });
      });
    });

    clear(goalText);
    goalText.appendChild(document.createTextNode(
      "Run trials until all three are met. " + state.log.length +
      " trial" + (state.log.length === 1 ? "" : "s") + " so far."));

    var list = make("ul", "goal__checks");
    [
      {
        label: "A sectioned trial where the section changes the outcome",
        met: changed
      },
      {
        label: "A sectioned trial where the section changes nothing",
        met: unchanged
      },
      {
        label: "One visual field asked with each hand in turn, sectioned",
        met: bothHands
      }
    ].forEach(function (check) {
      var li = make("li");
      li.textContent = check.label + (check.met ? " (met)" : " (not yet)");
      li.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(li);
    });
    goalText.appendChild(list);

    toStageTwo.disabled = !(changed && unchanged && bothHands);
  }

  /* The routing diagram. Three rows: visual fields, hemispheres, response
     channels. The two lines between the first and second row cross, which is
     the whole of contralateral projection. The active route is drawn thick
     and solid, everything else thin and dashed, and the paragraph underneath
     says the same thing in words. */
  function drawRoute(field, channel, callosum, trial) {
    clear(routeSvg);

    var BOX = { left: 14, right: 196, width: 150 };
    var FIELD_Y = 8, HEMI_Y = 88, CHAN_Y = 168, H = 32;
    var chanBoxes = {
      speak: { x: 6, w: 100, label: "Speech" },
      righthand: { x: 114, w: 100, label: "Right hand" },
      lefthand: { x: 246, w: 100, label: "Left hand" }
    };

    function box(x, y, w, h, label, active, sub) {
      routeSvg.appendChild(svgEl("rect", {
        x: x, y: y, width: w, height: h, rx: 5,
        class: "lat__box" + (active ? " lat__box--active" : "")
      }));
      routeSvg.appendChild(
        svgText(x + w / 2, y + (sub ? 15 : 21), "chart__count", "middle", label));
      if (sub) {
        routeSvg.appendChild(
          svgText(x + w / 2, y + 28, "chart__axis", "middle", sub));
      }
    }

    function link(x1, y1, x2, y2, active) {
      routeSvg.appendChild(svgEl("line", {
        x1: x1, y1: y1, x2: x2, y2: y2,
        class: "lat__link" + (active ? " lat__link--active" : "")
      }));
    }

    var fieldActive = { left: field.id === "left", right: field.id === "right" };
    var hemiActive = {
      left: field.hemisphere === "left" ||
        (callosum === "intact" && channel.hemisphere === "left"),
      right: field.hemisphere === "right" ||
        (callosum === "intact" && channel.hemisphere === "right")
    };

    /* Row 1: the two visual fields. The item is named inside the active one. */
    box(BOX.left, FIELD_Y, BOX.width, H, "Left visual field",
      fieldActive.left, fieldActive.left ? currentItem().word + " shown here" : "");
    box(BOX.right, FIELD_Y, BOX.width, H, "Right visual field",
      fieldActive.right, fieldActive.right ? currentItem().word + " shown here" : "");

    /* The crossing. Left field to right hemisphere, right field to left. */
    link(BOX.left + BOX.width / 2, FIELD_Y + H,
      BOX.right + BOX.width / 2, HEMI_Y, fieldActive.left);
    link(BOX.right + BOX.width / 2, FIELD_Y + H,
      BOX.left + BOX.width / 2, HEMI_Y, fieldActive.right);

    /* Row 2: the hemispheres, joined by the callosum. */
    box(BOX.left, HEMI_Y, BOX.width, H, "Left hemisphere", hemiActive.left);
    box(BOX.right, HEMI_Y, BOX.width, H, "Right hemisphere", hemiActive.right);

    /* The callosum sits in the gap between the two hemisphere boxes. Its
       label goes BELOW the row, where nothing else is drawn, so it never
       overlaps a box or a link. */
    var midY = HEMI_Y + H / 2;
    var labelY = HEMI_Y + H + 14;
    if (callosum === "intact") {
      routeSvg.appendChild(svgEl("line", {
        x1: BOX.left + BOX.width, y1: midY, x2: BOX.right, y2: midY,
        class: "lat__callosum"
      }));
      routeSvg.appendChild(
        svgText(180, labelY, "chart__axis", "middle", "callosum"));
    } else {
      routeSvg.appendChild(svgEl("line", {
        x1: BOX.left + BOX.width, y1: midY, x2: 172, y2: midY,
        class: "lat__callosum"
      }));
      routeSvg.appendChild(svgEl("line", {
        x1: 188, y1: midY, x2: BOX.right, y2: midY, class: "lat__callosum"
      }));
      routeSvg.appendChild(svgEl("path", {
        d: "M 172 " + (midY - 7) + " l 16 14 M 188 " + (midY - 7) + " l -16 14",
        class: "lat__cut"
      }));
      routeSvg.appendChild(
        svgText(180, labelY, "chart__axis", "middle", "callosum cut"));
    }

    /* Row 3: the three response channels. */
    CHANNELS.forEach(function (entry) {
      var spec = chanBoxes[entry.id];
      var active = entry.id === channel.id;
      var mark = "";
      if (active && trial) { mark = trial.success ? "answers" : "no answer"; }
      else if (active) { mark = "asked with this"; }
      box(spec.x, CHAN_Y, spec.w, H, spec.label, active, mark);

      var hemiX = entry.hemisphere === "left"
        ? BOX.left + BOX.width / 2 : BOX.right + BOX.width / 2;
      link(hemiX, HEMI_Y + H, spec.x + spec.w / 2, CHAN_Y, active);
    });

    routeSvg.appendChild(
      svgText(0, 216, "chart__axis", "start",
        "thick solid line marks this trial's route - schematic, not anatomy"));

    /* The figure's visible text equivalent. The diagram is pinned and the
       tables scroll away beneath it, so the pin has to read on its own. */
    routeText.textContent =
      "The " + currentItem().word + " appears in the " +
      field.label.toLowerCase() + ", which reaches the " +
      HEMI_NAME[field.hemisphere] + ". You are asking with " +
      channel.short.toLowerCase() + ", which the " +
      HEMI_NAME[channel.hemisphere] + " controls. The corpus callosum is " +
      (callosum === "intact" ? "intact." : "completely sectioned.") +
      (trial ? " Outcome: " + (trial.success ? "a correct response."
        : "no correct response.") : " Not run yet.");
  }

  function renderLog() {
    clear(tableHead);
    ["Item", "Appears in", "Asked with", "Callosum", "You predicted", "Outcome"]
      .forEach(function (text) {
        var th = make("th", null, text);
        th.setAttribute("scope", "col");
        tableHead.appendChild(th);
      });

    clear(mainTable);
    if (!state.log.length) {
      var empty = make("tr");
      var cell = make("td", null, "No trials run yet.");
      cell.setAttribute("colspan", "6");
      empty.appendChild(cell);
      mainTable.appendChild(empty);
      return;
    }

    state.log.slice().reverse().forEach(function (trial) {
      var tr = make("tr");
      var th = make("th", null, trial.item.word);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, trial.field.short));
      tr.appendChild(make("td", null, trial.channel.short));
      tr.appendChild(make("td", null,
        byId(CALLOSUM, trial.callosum).short));
      tr.appendChild(make("td", null,
        trial.predicted === "yes" ? "correct response" : "no correct response"));
      tr.appendChild(make("td", null,
        trial.success ? "correct response" : "no correct response"));
      if ((trial.predicted === "yes") !== trial.success) {
        tr.className = "lat__miss";
      }
      mainTable.appendChild(tr);
    });
  }

  function renderGrid() {
    clear(gridTable);
    FIELDS.forEach(function (field) {
      CHANNELS.forEach(function (channel) {
        var tr = make("tr");
        var th = make("th", null, field.short);
        th.setAttribute("scope", "row");
        tr.appendChild(th);
        tr.appendChild(make("td", null, channel.short));
        tr.appendChild(make("td", null,
          succeeds(field, channel, "intact") ? "correct response" : "no response"));
        var cut = succeeds(field, channel, "sectioned");
        var cell = make("td", null, cut ? "correct response" : "no response");
        if (!cut) { cell.setAttribute("data-mark", "blocked"); }
        tr.appendChild(cell);
        gridTable.appendChild(tr);
      });
    });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    unconscious: {
      tone: "caution",
      verdict: "Closer to a description than an explanation.",
      text:
        "“Not conscious of it” restates the fact that they could not say " +
        "so. The question is why saying so is unavailable while picking it up " +
        "is not. Whether the right hemisphere's experience counts as " +
        "conscious is a separate argument, and not one these data settle."
    },
    routing: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The left visual field reaches the right hemisphere; speech is " +
        "produced by the left; the left hand is controlled by the right. " +
        "After a complete section the information cannot get from where it " +
        "arrived to where speech is produced, but it is exactly where the " +
        "left hand needs it. Experiment 1 lets you build every combination."
    },
    dominant: {
      tone: "caution",
      verdict: "Dominance is the wrong idea here.",
      text:
        "Nothing is overriding anything. The left hemisphere does not have " +
        "the information to override, which is why it says nothing rather " +
        "than something wrong. Swap the response channel and the answer " +
        "appears, with no change in dominance of any kind."
    },
    visual: {
      tone: "caution",
      verdict: "That turns a routing fact into a job description.",
      text:
        "Both hemispheres process vision, and both do a great deal of the " +
        "same work. What differs here is which one received this particular " +
        "item and which one controls the channel you asked with. Once the " +
        "hemispheres are connected again, as in almost everybody, the " +
        "distinction stops producing any observable effect."
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
    shell.announce("Laboratory open. Experiment 1.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE_ONE = {
    few: {
      tone: "caution",
      verdict: "True, and not the strongest.",
      text:
        "The samples are tiny, but small samples are a reason for caution " +
        "about the findings, not a reason the findings cannot be generalised " +
        "to connected brains. That second step fails for a different reason."
    },
    disconnection: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The effects exist because the hemispheres cannot exchange " +
        "information. Restore the callosum and they disappear, because both " +
        "hemispheres have almost everything within a few tens of " +
        "milliseconds. A finding that depends on the cut cannot describe " +
        "people who do not have one."
    },
    equal: {
      tone: "caution",
      verdict: "An over-correction.",
      text:
        "There are real asymmetries - speech production is left-lateralised " +
        "in most people, and there are reliable differences in how the two " +
        "hemispheres handle several kinds of material. What does not follow " +
        "is that a person runs on one of them."
    },
    surgery: {
      tone: "caution",
      verdict: "True but beside the point.",
      text:
        "Whether the operation is still performed says nothing about what " +
        "the findings mean. The objection has to be about what a " +
        "disconnection experiment can and cannot show."
    }
  };

  var CHALLENGE_TWO = {
    "right-language": {
      tone: "caution",
      verdict: "One possibility among several.",
      text:
        "It could be that. It could equally be a presentation long enough " +
        "for a saccade, an incomplete section, or cross-cueing. Choosing one " +
        "of four explanations without the method is not an inference."
    },
    "wrong-theory": {
      tone: "caution",
      verdict: "Far too fast.",
      text:
        "A single procedural failure produces exactly this observation. " +
        "Experiment 2 shows four separate ways to get it without disturbing " +
        "the routing account at all."
    },
    "check-method": {
      tone: "good",
      verdict: "Yes.",
      text:
        "Presentation duration, fixation monitoring, the extent of the " +
        "section and cross-cueing control all have to be checked first. Only " +
        "when they are all documented does the result start to say anything " +
        "about this person's hemispheres - and even then it says something " +
        "about this person, not about hemispheres in general."
    },
    incomplete: {
      tone: "caution",
      verdict: "One possibility among several.",
      text:
        "Plausible - the splenium may have been spared - but so are three " +
        "other explanations. “Must” is doing work the evidence cannot " +
        "support."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var one = $('input[name="brained"]:checked', challengeForm);
    var two = $('input[name="trials"]:checked', challengeForm);
    if (!one || !two) {
      showFeedback(challengeFeedback, "caution",
        "Answer both questions first.",
        "Each one is asking about a different failure of inference.");
      return;
    }

    var a = CHALLENGE_ONE[one.value];
    var b = CHALLENGE_TWO[two.value];
    clear(challengeFeedback);

    [["Question 1. ", a], ["Question 2. ", b]].forEach(function (pair) {
      var p = make("p");
      p.appendChild(make("strong", "feedback__verdict", pair[0] + pair[1].verdict));
      p.appendChild(document.createTextNode(" " + pair[1].text));
      challengeFeedback.appendChild(p);
    });

    challengeFeedback.setAttribute("data-tone",
      a.tone === "good" && b.tone === "good" ? "good" : "caution");
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
    state = initialState();
    CONDITIONS.forEach(function (c) { state.conditions[c.id] = true; });
    syncTrialControls();
    syncConditionBoxes();
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    trialFeedback.hidden = true;
    trialError.hidden = true;
    outcomeBox.hidden = true;
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
