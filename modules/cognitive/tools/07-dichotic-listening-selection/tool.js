/* =========================================================================
   Dichotic Listening and Selection Theories
   -------------------------------------------------------------------------
   A VISUAL ANALOGUE of the competing-message paradigm, with an optional
   stereo tone layer. Two word streams run side by side, one item per side
   every 800 ms. The learner monitors one side and presses a key for targets;
   the other side is to be ignored. One item in the ignored stream is a
   planted probe, and the two questions after each trial separate

       "did anything LOOK different?"      - a physical judgement
       "which WORD was it?"                - identification of meaning

   Keeping those two apart is the whole point. Almost every summary of this
   literature runs them together.

   WHY AN ANALOGUE, AND WHAT IT COSTS
   ----------------------------------
   True dichotic listening needs two spoken messages at two ears, which a
   browser cannot deliver reliably or accessibly: it would need recorded
   speech (an external asset), or speech synthesis (whose voices are not
   guaranteed to be local, i.e. not guaranteed to stay in the tab). So the
   words are written and the optional audio is synthesised from oscillators:
   a tone under each item, panned to that item's side. The tones give genuine
   left-right separation and carry the physical-salience manipulation, and
   they carry no words at all. The page says so in the hero, in the limits
   panel and in the teaching notes, and every trial is followed by a full
   transcript of both streams, which is the text alternative for the audio.

   THE DESIGN
   ----------
       trial length        16 item pairs at 800 ms  (about 1.25 changes/second)
       probe position      pair 9, 10 or 11, chosen at random
       probe factors       marked / plain   x   relevant / unrelated
       a run               4 trials, one per probe type, shuffled
       attended rule       ONE  - press for every animal
                           TWO  - press for every animal EXCEPT birds
       load                the rule is the load manipulation; the timing,
                           the streams and the probe are otherwise identical

   "Relevant" means the probe is an animal - a member of the very category
   being monitored on the attended side. "Marked" means it is printed larger,
   bolder and underlined (three carriers, none of them a hue) and, with the
   audio on, given an audibly different tone.

   The attended item at the probe position is always a non-target, so the
   attended load at that moment is the same on every trial.

   ONLY THE FIRST TRIAL IS NAIVE
   -----------------------------
   After trial one the learner knows a word is planted, so later trials
   measure divided attention rather than a failure of selection. The tool
   flags the first trial, reports it separately, and says this in the results
   panel, the debrief and the notes. Practice contains no probe and no
   post-trial questions, so nothing is given away before it.

   THE WORKED EXAMPLE (the non-performing route)
   --------------------------------------------
   A simulated class of 40 fictional participants, one trial per cell, seed
   20260955, drawn as Bernoulli trials with:

       looked different    marked  .88 (one rule)  .72 (two rules)
                           plain   .17             .10
       word recognised     marked+relevant   .62 / .38
                           marked+unrelated  .55 / .30
                           plain+relevant    .34 / .14
                           plain+unrelated   .13 / .06

   That pattern - physical change noticed far more than meaning identified,
   relevance helping only the unmarked items, and everything falling under
   load - is BUILT IN. It illustrates the shape of the classic findings; it
   is not evidence for them, not a norm, and not anybody's data.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var ITEM_MS = 800;
  var TRIAL_LENGTH = 16;
  var PRACTICE_LENGTH = 10;
  var READY_MS = 900;
  var BETWEEN_TRIALS_MS = 600;
  var PROBE_POSITIONS = [9, 10, 11];
  var TARGETS_PER_TRIAL = 4;
  var BIRDS_PER_TRIAL = 2;

  /* Word pools. All original, ordinary, neutral vocabulary; the four pools
     are disjoint so a recognition foil can never have been on screen. */
  var ATTENDED_ANIMALS = ["HORSE", "RABBIT", "OTTER", "BADGER", "MONKEY",
    "WHALE", "SQUIRREL", "DONKEY"];
  var ATTENDED_BIRDS = ["ROBIN", "SPARROW", "HERON", "MAGPIE", "FALCON", "SWAN"];
  var ATTENDED_FILLERS = ["LADDER", "KETTLE", "CURTAIN", "PARCEL", "ENGINE",
    "HARBOUR", "MEADOW", "LANTERN", "PILLOW", "BRIDGE", "ANCHOR", "MARKET"];
  var IGNORED_FILLERS = ["CANVAS", "PEBBLE", "MANTEL", "TIMBER", "VELVET",
    "SANDAL", "GRAVEL", "RIBBON", "TROLLEY", "SATCHEL", "CISTERN", "TRELLIS"];
  var RELEVANT_PROBES = ["TIGER", "PANDA", "WALRUS", "LEOPARD"];
  var UNRELATED_PROBES = ["TROMBONE", "RADIATOR", "POSTCARD", "UMBRELLA"];
  var FOIL_ANIMALS = ["BISON", "LLAMA", "BEAVER", "LOBSTER"];
  var FOIL_OTHER = ["SAUCER", "PLINTH", "BOLSTER", "TANKARD", "CORNICE", "GAITER"];

  var PROBE_TYPES = [
    { key: "marked-relevant", marked: true, relevant: true, label: "Marked and relevant" },
    { key: "marked-unrelated", marked: true, relevant: false, label: "Marked, unrelated" },
    { key: "plain-relevant", marked: false, relevant: true, label: "Plain but relevant" },
    { key: "plain-unrelated", marked: false, relevant: false, label: "Plain and unrelated" }
  ];

  var RULES = {
    one: { key: "one", label: "One rule", text: "Press for every animal." },
    two: {
      key: "two", label: "Two rules",
      text: "Press for every animal EXCEPT birds. Birds are not targets."
    }
  };

  /* Worked-example generator. Probabilities are illustrative, not published
     estimates - see the header note. */
  var SIM = {
    seed: 20260955,
    participants: 40,
    noticed: {
      marked: { one: 0.88, two: 0.72 },
      plain: { one: 0.17, two: 0.10 }
    },
    recognised: {
      "marked-relevant": { one: 0.62, two: 0.38 },
      "marked-unrelated": { one: 0.55, two: 0.30 },
      "plain-relevant": { one: 0.34, two: 0.14 },
      "plain-unrelated": { one: 0.13, two: 0.06 }
    }
  };

  /* Audio constants. Gains are deliberately low; the tones are a physical
     cue, not a soundtrack. */
  var AUDIO = {
    attended: { freq: 300, gain: 0.09, type: "sine" },
    ignored: { freq: 420, gain: 0.05, type: "sine" },
    markedProbe: { freq: 640, gain: 0.07, type: "square" },
    duration: 0.15
  };

  /* =======================================================================
     Seeded randomness (copied rather than imported, so a downloaded folder
     keeps working on its own)
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

  function shuffle(items, rand) {
    var draw = rand || Math.random;
    for (var i = items.length - 1; i > 0; i -= 1) {
      var j = Math.floor(draw() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function sample(items, count) {
    return shuffle(items.slice()).slice(0, count);
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : Math.round(value * 100) + "%";
  }

  /* =======================================================================
     Trial construction
     ===================================================================== */

  function buildTrial(ruleKey, probeType, length) {
    var probeIndex = probeType
      ? PROBE_POSITIONS[Math.floor(Math.random() * PROBE_POSITIONS.length)]
      : -1;

    // --- attended stream -------------------------------------------------
    var attended = new Array(length);
    var targetCount = Math.min(TARGETS_PER_TRIAL, Math.floor(length / 3));
    var slots = [];
    for (var i = 0; i < length; i += 1) {
      if (i !== probeIndex) { slots.push(i); }
    }
    shuffle(slots);

    var animals = sample(ATTENDED_ANIMALS, targetCount);
    animals.forEach(function (word, n) {
      attended[slots[n]] = { word: word, kind: "animal" };
    });
    var used = targetCount;

    if (ruleKey === "two") {
      var birds = sample(ATTENDED_BIRDS, BIRDS_PER_TRIAL);
      birds.forEach(function (word, n) {
        attended[slots[used + n]] = { word: word, kind: "bird" };
      });
      used += BIRDS_PER_TRIAL;
    }

    var fillers = sample(ATTENDED_FILLERS, length);
    for (var j = 0; j < length; j += 1) {
      if (!attended[j]) {
        attended[j] = { word: fillers[j % fillers.length], kind: "filler" };
      }
    }

    // --- ignored stream --------------------------------------------------
    var ignoredWords = sample(IGNORED_FILLERS, length);
    var ignored = [];
    for (var k = 0; k < length; k += 1) {
      ignored.push({ word: ignoredWords[k % ignoredWords.length], probe: false });
    }

    var probeWord = null;
    if (probeType) {
      probeWord = pick(probeType.relevant ? RELEVANT_PROBES : UNRELATED_PROBES);
      ignored[probeIndex] = {
        word: probeWord, probe: true, marked: probeType.marked
      };
    }

    return {
      rule: ruleKey,
      probeType: probeType,
      probeIndex: probeIndex,
      probeWord: probeWord,
      attended: attended,
      ignored: ignored,
      length: length
    };
  }

  /**
   * Six recognition options: the probe plus five foils, always two animals
   * and four non-animals, so the shape of the option set never gives the
   * answer away. No foil has appeared in either stream.
   */
  function recognitionOptions(trial) {
    var options = [trial.probeWord];
    if (trial.probeType.relevant) {
      options = options.concat(sample(FOIL_ANIMALS, 1), sample(FOIL_OTHER, 4));
    } else {
      options = options.concat(sample(FOIL_ANIMALS, 2), sample(FOIL_OTHER, 3));
    }
    return shuffle(options);
  }

  /* =======================================================================
     Audio - synthesised in the tab, no assets, no network
     ===================================================================== */

  var audioContext = null;

  function ensureAudio() {
    if (audioContext) { return audioContext; }
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) { return null; }
    try {
      audioContext = new Ctor();
    } catch (error) {
      audioContext = null;
    }
    return audioContext;
  }

  /* Called from the Start click, which is a user gesture: a context created
     or resumed here is running by the time the first tone is scheduled. */
  function startAudio() {
    var ctx = ensureAudio();
    if (ctx && ctx.state === "suspended" && ctx.resume) { ctx.resume(); }
    return ctx;
  }

  function blip(spec, pan) {
    var ctx = ensureAudio();
    if (!ctx) { return; }

    // A suspended context reports a currentTime that does not advance, so a
    // tone scheduled against it can be dropped rather than delayed. Resume
    // first and read the clock afterwards; resume() resolves immediately when
    // the context is already running.
    if (ctx.state === "suspended" && ctx.resume) {
      var resumed = ctx.resume();
      if (resumed && resumed.then) {
        resumed.then(function () { schedule(ctx, spec, pan); });
        return;
      }
    }
    schedule(ctx, spec, pan);
  }

  function schedule(ctx, spec, pan) {
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = spec.type;
    osc.frequency.value = spec.freq;

    // A short ramp at each end: an abrupt start or stop on an oscillator
    // makes an audible click.
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(spec.gain, t + 0.02);
    gain.gain.setValueAtTime(spec.gain, t + AUDIO.duration - 0.03);
    gain.gain.linearRampToValueAtTime(0, t + AUDIO.duration);

    var node = gain;
    if (ctx.createStereoPanner) {
      var panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      gain.connect(panner);
      node = panner;
    }
    osc.connect(gain);
    node.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + AUDIO.duration + 0.02);
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#dichotic");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var sideSelect = $("#side-select");
  var ruleSelect = $("#rule-select");
  var audioSelect = $("#audio-select");
  var testAudio = $('[data-action="test-audio"]');
  var startPractice = $('[data-action="start-practice"]');
  var startRun = $('[data-action="start-run"]');
  var stopButton = $('[data-action="stop"]');
  var workedExample = $('[data-action="worked-example"]');
  var targetButton = $('[data-action="target"]');

  var streams = $("[data-streams]");
  var sides = {
    left: $('.streams__side[data-side="left"]'),
    right: $('.streams__side[data-side="right"]')
  };
  var words = {
    left: $('[data-word="left"]'),
    right: $('[data-word="right"]')
  };
  var labels = {
    left: $('[data-label="left"]'),
    right: $('[data-label="right"]')
  };
  var streamCaption = $("[data-stream-caption]");
  var ruleText = $("[data-rule-text]");
  var trialStatus = $("[data-trial-status]");
  var answerForm = $("[data-answer-form]");
  var noticedGroup = $("[data-noticed-group]");
  var recogniseGroup = $("[data-recognise-group]");
  var recogniseOptions = $("[data-recognise-options]");
  var taskFeedback = $("[data-task-feedback]");
  var transcriptWrap = $("[data-transcript-wrap]");
  var transcript = $("[data-transcript]");

  var resultsSection = $("#results");
  var resultsBody = $("[data-results-body]");
  var naiveText = $("[data-naive-text]");
  var naiveNote = $("[data-naive-note]");
  var chartCaption = $("[data-chart-caption]");
  var probeChart = $("[data-probe-chart]");
  var probeTable = $("[data-probe-table]");
  var loadTable = $("[data-load-table]");
  var loadNote = $("[data-load-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = null;
  var pending = [];

  function later(fn, delay) {
    var id = window.setTimeout(function () {
      pending = pending.filter(function (other) { return other !== id; });
      fn();
    }, delay);
    pending.push(id);
    return id;
  }

  function cancelPending() {
    pending.forEach(function (id) { window.clearTimeout(id); });
    pending = [];
  }

  /* =======================================================================
     Display
     ===================================================================== */

  function attendedSide() { return state.side; }
  function ignoredSide() { return state.side === "left" ? "right" : "left"; }

  function paintSides() {
    ["left", "right"].forEach(function (side) {
      var attended = side === state.side;
      sides[side].setAttribute("data-attended", attended ? "yes" : "no");
      labels[side].textContent = attended
        ? "▶ Attend to this — " + (side === "left" ? "left" : "right")
        : (side === "left" ? "Left" : "Right") + " — ignore";
    });
  }

  function clearWords() {
    ["left", "right"].forEach(function (side) {
      words[side].textContent = "";
      words[side].removeAttribute("data-marked");
    });
  }

  function setRuleText() {
    ruleText.textContent = RULES[state.rule].text;
  }

  /* =======================================================================
     Running a trial
     ===================================================================== */

  function updateTrialStatus() {
    if (state.mode === "idle") {
      trialStatus.textContent = state.runsDone
        ? "Idle. Change the rule and run another set, or read the results below."
        : state.practiceDone
          ? "Practice done. Start a run when you are ready."
          : "Not started. Practice first — it is shorter and gives feedback.";
      return;
    }
    trialStatus.textContent =
      (state.mode === "practice" ? "Practice trial" : "Trial " +
        (state.index + 1) + " of " + state.queue.length) +
      ". Watch your side; ignore the other.";
  }

  function beginTrial() {
    var probeType = state.mode === "practice" ? null : state.queue[state.index];
    state.trial = buildTrial(state.rule, probeType,
      state.mode === "practice" ? PRACTICE_LENGTH : TRIAL_LENGTH);
    state.frame = 0;
    state.presses = [];
    answerForm.hidden = true;
    recogniseGroup.hidden = true;
    taskFeedback.hidden = true;
    transcriptWrap.hidden = true;
    clearWords();
    streamCaption.textContent = "Get ready.";
    targetButton.disabled = true;
    updateTrialStatus();
    later(showFrame, READY_MS);
  }

  function showFrame() {
    var trial = state.trial;
    if (state.frame >= trial.length) {
      clearWords();
      targetButton.disabled = true;
      later(askQuestions, 300);
      return;
    }

    var index = state.frame;
    var attended = trial.attended[index];
    var ignored = trial.ignored[index];
    var aSide = attendedSide();
    var iSide = ignoredSide();

    words[aSide].textContent = attended.word;
    words[aSide].removeAttribute("data-marked");
    words[iSide].textContent = ignored.word;
    if (ignored.probe && ignored.marked) {
      words[iSide].setAttribute("data-marked", "yes");
    } else {
      words[iSide].removeAttribute("data-marked");
    }

    if (state.audio === "on") {
      blip(AUDIO.attended, aSide === "left" ? -1 : 1);
      blip(ignored.probe && ignored.marked ? AUDIO.markedProbe : AUDIO.ignored,
        iSide === "left" ? -1 : 1);
    }

    targetButton.disabled = false;
    streamCaption.textContent = "Press Target when your side shows an animal.";
    state.currentIndex = index;
    state.pressedThisItem = false;
    state.frame += 1;
    later(showFrame, ITEM_MS);
  }

  function isTarget(item) {
    if (state.rule === "one") {
      return item.kind === "animal" || item.kind === "bird";
    }
    return item.kind === "animal";
  }

  var flashTimer = null;
  var FLASH_MS = 150;

  /* A response is otherwise invisible when it comes from the space bar: the
     button never takes focus and nothing on screen moves. This acknowledges
     that the press was recorded. It says nothing about whether the item was
     a target - correctness belongs at the end of the trial. */
  function flashTarget() {
    if (flashTimer) { window.clearTimeout(flashTimer); }
    targetButton.setAttribute("data-registered", "yes");
    flashTimer = window.setTimeout(function () {
      targetButton.removeAttribute("data-registered");
      flashTimer = null;
    }, FLASH_MS);
  }

  function clearFlash() {
    if (flashTimer) { window.clearTimeout(flashTimer); flashTimer = null; }
    targetButton.removeAttribute("data-registered");
  }

  function pressTarget() {
    if (targetButton.disabled || state.pressedThisItem) { return; }
    state.pressedThisItem = true;
    state.presses.push(state.currentIndex);
    flashTarget();
  }

  function scoreAttended() {
    var trial = state.trial;
    var hits = 0, misses = 0, falsePresses = 0;
    trial.attended.forEach(function (item, index) {
      var pressed = state.presses.indexOf(index) !== -1;
      if (isTarget(item)) {
        if (pressed) { hits += 1; } else { misses += 1; }
      } else if (pressed) {
        falsePresses += 1;
      }
    });
    return { hits: hits, misses: misses, falsePresses: falsePresses };
  }

  function askQuestions() {
    var attendedScore = scoreAttended();
    state.attendedScore = attendedScore;

    if (state.mode === "practice") {
      finishPractice(attendedScore);
      return;
    }

    streamCaption.textContent = "Trial finished. Two questions — there is no time limit.";
    answerForm.hidden = false;
    noticedGroup.hidden = false;
    recogniseGroup.hidden = true;
    var first = noticedGroup.querySelector("button");
    if (first) { first.focus(); }
    shell.announce("Trial finished. Did anything on the ignored side look different?",
      { immediate: true });
  }

  function answerNoticed(noticed) {
    state.noticed = noticed;
    noticedGroup.hidden = true;
    recogniseGroup.hidden = false;
    renderRecognition();
    var first = recogniseOptions.querySelector("button");
    if (first) { first.focus(); }
    shell.announce("Now: which of these words was on the ignored side?",
      { immediate: true });
  }

  function renderRecognition() {
    clear(recogniseOptions);
    recognitionOptions(state.trial).forEach(function (word) {
      var button = make("button", "button button--secondary", word);
      button.type = "button";
      button.addEventListener("click", function () { answerRecognition(word); });
      recogniseOptions.appendChild(button);
    });
    var unsure = make("button", "button button--secondary", "I am not sure");
    unsure.type = "button";
    unsure.addEventListener("click", function () { answerRecognition(null); });
    recogniseOptions.appendChild(unsure);
  }

  function answerRecognition(word) {
    var trial = state.trial;
    var correct = word !== null && word === trial.probeWord;

    state.trials.push({
      naive: state.trials.length === 0,
      rule: state.rule,
      probeKey: trial.probeType.key,
      marked: trial.probeType.marked,
      relevant: trial.probeType.relevant,
      probeWord: trial.probeWord,
      noticed: state.noticed,
      recognised: correct,
      chose: word,
      attended: state.attendedScore
    });

    answerForm.hidden = true;
    renderTranscript(trial);
    transcriptWrap.hidden = false;

    state.index += 1;
    if (state.index >= state.queue.length) {
      finishRun();
    } else {
      streamCaption.textContent = "Next trial starting.";
      later(beginTrial, BETWEEN_TRIALS_MS);
      updateTrialStatus();
    }
  }

  function renderTranscript(trial) {
    clear(transcript);
    var aSide = attendedSide();
    for (var i = 0; i < trial.length; i += 1) {
      var row = make("tr");
      var head = make("th", null, String(i + 1));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var leftItem = aSide === "left" ? trial.attended[i] : trial.ignored[i];
      var rightItem = aSide === "left" ? trial.ignored[i] : trial.attended[i];
      row.appendChild(make("td", null, leftItem.word));
      row.appendChild(make("td", null, rightItem.word));
      row.appendChild(make("td", null,
        trial.ignored[i].probe && trial.ignored[i].marked
          ? "different tone on the ignored side"
          : "the usual two tones"));
      transcript.appendChild(row);
    }
  }

  function finishPractice(score) {
    state.mode = "idle";
    state.practiceDone = true;
    cancelPending();
    clearWords();
    idleControls();
    streamCaption.textContent = "Practice finished.";
    showFeedback(taskFeedback,
      score.misses === 0 && score.falsePresses === 0 ? "good" : "caution",
      score.misses === 0 && score.falsePresses === 0
        ? "All targets caught." : "Not quite clean.",
      "You pressed for " + score.hits + " of the " + (score.hits + score.misses) +
      " targets on your side" +
      (score.falsePresses
        ? ", and pressed " + score.falsePresses + " time" +
          (score.falsePresses === 1 ? "" : "s") + " for something that was not one."
        : ".") +
      " The scored run is four trials, each a little longer, with two short " +
      "questions after each one and no feedback until the end.");
    startRun.focus();
    updateTrialStatus();
    shell.announce("Practice finished. A run of four trials is available.",
      { immediate: true });
  }

  function idleControls() {
    startPractice.disabled = false;
    startRun.disabled = false;
    stopButton.disabled = true;
    targetButton.disabled = true;
    sideSelect.disabled = false;
    ruleSelect.disabled = false;
    audioSelect.disabled = false;
  }

  function runningControls() {
    startPractice.disabled = true;
    startRun.disabled = true;
    stopButton.disabled = false;
    sideSelect.disabled = true;
    ruleSelect.disabled = true;
    audioSelect.disabled = true;
  }

  function finishRun() {
    state.mode = "idle";
    state.runsDone += 1;
    cancelPending();
    clearWords();
    idleControls();
    streamCaption.textContent = "Run finished. The results are below.";
    updateTrialStatus();
    showResults({ source: "own" });
    shell.announce("Run finished. The results are below.", { immediate: true });
  }

  function stopRun() {
    var hadTrials = state.trials.length > 0;
    cancelPending();
    state.mode = "idle";
    clearWords();
    answerForm.hidden = true;
    idleControls();
    streamCaption.textContent = "Stopped.";
    updateTrialStatus();
    if (hadTrials) {
      showResults({ source: "own", partial: true });
    }
    shell.announce("Stopped." + (hadTrials
      ? " The trials you completed are summarised below." : ""),
      { immediate: true });
  }

  /* =======================================================================
     Summaries
     ===================================================================== */

  function summarise(trials) {
    var cells = {};
    PROBE_TYPES.forEach(function (type) {
      cells[type.key] = {};
      ["one", "two"].forEach(function (rule) {
        var subset = trials.filter(function (t) {
          return t.probeKey === type.key && t.rule === rule;
        });
        cells[type.key][rule] = {
          n: subset.length,
          noticed: subset.length
            ? subset.filter(function (t) { return t.noticed; }).length / subset.length
            : null,
          recognised: subset.length
            ? subset.filter(function (t) { return t.recognised; }).length / subset.length
            : null
        };
      });
    });

    var load = {};
    ["one", "two"].forEach(function (rule) {
      var subset = trials.filter(function (t) { return t.rule === rule; });
      var hits = 0, misses = 0, falsePresses = 0;
      subset.forEach(function (t) {
        hits += t.attended.hits;
        misses += t.attended.misses;
        falsePresses += t.attended.falsePresses;
      });
      load[rule] = {
        n: subset.length, hits: hits, misses: misses, falsePresses: falsePresses
      };
    });

    return { total: trials.length, cells: cells, load: load };
  }

  function simulatedTrials() {
    var rand = mulberry32(SIM.seed);
    var trials = [];
    for (var p = 0; p < SIM.participants; p += 1) {
      PROBE_TYPES.forEach(function (type) {
        ["one", "two"].forEach(function (rule) {
          var noticedP = SIM.noticed[type.marked ? "marked" : "plain"][rule];
          var recognisedP = SIM.recognised[type.key][rule];
          trials.push({
            naive: false,
            rule: rule,
            probeKey: type.key,
            marked: type.marked,
            relevant: type.relevant,
            noticed: rand() < noticedP,
            recognised: rand() < recognisedP,
            // The simulated class contributes no attended-task scores; the
            // load table is about the learner's own performance.
            attended: { hits: 0, misses: 0, falsePresses: 0 }
          });
        });
      });
    }
    return trials;
  }

  /* =======================================================================
     Results
     ===================================================================== */

  function showResults(meta) {
    var trials = meta.source === "simulated" ? simulatedTrials() : state.trials;
    var stats = summarise(trials);

    $("#results-heading").textContent = meta.source === "simulated"
      ? "What got through — worked example, simulated"
      : "What got through — your trials";

    renderNaive(meta);
    renderResultsProse(stats, meta);
    renderChart(stats);
    renderProbeTable(stats);
    renderLoadTable(stats, meta);

    resultsSection.hidden = false;
    $("#results-heading").focus();
  }

  function renderNaive(meta) {
    if (meta.source === "simulated") {
      naiveText.textContent =
        "The worked example has no naive trial in it: every simulated " +
        "participant is treated as already knowing that a word is planted. " +
        "The one genuinely naive observation on this page is your own first " +
        "trial, which is why it is worth running one before reading anything.";
      naiveNote.textContent =
        "Simulated class data. Not a norm, not a published rate, not " +
        "anybody's data.";
      return;
    }

    var first = state.trials[0];
    if (!first) {
      naiveText.textContent = "No trials completed yet.";
      naiveNote.textContent = "";
      return;
    }

    var kind = (first.marked ? "physically marked" : "printed exactly like the rest") +
      " and " + (first.relevant
        ? "an animal — a member of the category you were monitoring"
        : "an ordinary word with no connection to your task");

    naiveText.textContent =
      "On your first trial the planted word was “" + first.probeWord + "”, " +
      kind + ". You reported that something " +
      (first.noticed ? "did" : "did not") + " look different, and you " +
      (first.recognised ? "identified the word correctly" :
        (first.chose ? "chose “" + first.chose + "”, which was not it" :
          "were not sure which word it was")) + ". " +
      (first.noticed && !first.recognised
        ? "That combination — a change registered, a word not identified — is " +
          "the pattern the whole argument was built around."
        : first.recognised
          ? "Getting the word as well as the change is what an early filter " +
            "has the most trouble with."
          : "Reporting nothing is the classic result, and it is also the " +
            "weakest kind of evidence: not reporting is not the same as not " +
            "processing.");

    naiveNote.textContent =
      "One trial, from one person, in a browser, in a visual analogue of a " +
      "listening task. It is an experience, not a measurement — and every " +
      "trial after it was run knowing that something is planted.";
  }

  function renderResultsProse(stats, meta) {
    clear(resultsBody);
    var simulated = meta.source === "simulated";

    resultsBody.appendChild(make("p", "reveal__lead", simulated
      ? "Simulated class data, seed " + SIM.seed + ": " + SIM.participants +
        " fictional participants, one trial in each of the eight cells."
      : (meta.partial ? "A partial run. " : "") + "Your trials: " +
        stats.total + " in total, one observation per cell per run."));

    if (simulated) {
      resultsBody.appendChild(make("p", null,
        "The pattern is built into the generator: physical changes get " +
        "through more often than word identities, and everything falls when " +
        "the attended rule gets harder. It illustrates the classic findings " +
        "rather than evidencing them."));
    } else {
      resultsBody.appendChild(make("p", null,
        "One trial per cell, so every rate is 0% or 100%. Compare the shape " +
        "of your rows with the worked example, not with another person."));
    }

    resultsBody.appendChild(make("p", null,
      "The two right-hand columns answer different questions. “Looked " +
      "different” is physical; “word recognised” needs the identity to have " +
      "survived. The gap between them is what selection accounts must " +
      "explain."));
  }

  function renderChart(stats) {
    var W = 470, H = 250;
    var PAD_L = 132, PAD_R = 46, PAD_T = 30, PAD_B = 40;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var groupH = plotH / PROBE_TYPES.length;
    var barH = 15;
    clear(probeChart);

    var xAt = function (p) { return PAD_L + p * plotW; };

    svgNode("line", {
      x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH, class: "chart__baseline"
    }, probeChart);
    [0, 0.5, 1].forEach(function (p) {
      svgNode("text", {
        x: xAt(p).toFixed(1), y: H - 22, "text-anchor": "middle", class: "chart__axis"
      }, probeChart).textContent = Math.round(p * 100) + "%";
    });
    svgNode("text", {
      x: (PAD_L + plotW / 2).toFixed(1), y: H - 6, "text-anchor": "middle",
      class: "chart__axis"
    }, probeChart).textContent = "Planted word recognised";
    svgNode("text", {
      x: PAD_L, y: 16, class: "chart__label"
    }, probeChart).textContent = "Solid = one rule · Hatched = two rules";

    PROBE_TYPES.forEach(function (type, row) {
      var top = PAD_T + row * groupH;
      svgNode("text", {
        x: PAD_L - 8, y: (top + groupH / 2 + 4).toFixed(1), "text-anchor": "end",
        class: "chart__label"
      }, probeChart).textContent = type.label;

      ["one", "two"].forEach(function (rule, n) {
        var cell = stats.cells[type.key][rule];
        var y = top + groupH / 2 - barH - 2 + n * (barH + 4);
        if (cell.recognised === null) {
          svgNode("text", {
            x: PAD_L + 6, y: (y + barH - 2).toFixed(1), class: "chart__count"
          }, probeChart).textContent = "no trials";
          return;
        }
        var width = Math.max(1, xAt(cell.recognised) - PAD_L);
        svgNode("rect", {
          x: PAD_L, y: y.toFixed(1), width: width.toFixed(1), height: barH,
          class: "dichotic__bar--" + (rule === "one" ? "one" : "two")
        }, probeChart);
        if (rule === "two") {
          for (var x = PAD_L + 8; x < PAD_L + width - 2; x += 10) {
            svgNode("line", {
              x1: x.toFixed(1), y1: (y + 1).toFixed(1),
              x2: (x - 6).toFixed(1), y2: (y + barH - 1).toFixed(1),
              class: "dichotic__hatch"
            }, probeChart);
          }
        }
        svgNode("text", {
          x: (PAD_L + width + 5).toFixed(1), y: (y + barH - 3).toFixed(1),
          class: "chart__count"
        }, probeChart).textContent = pct(cell.recognised);
      });
    });
  }

  function renderProbeTable(stats) {
    clear(probeTable);
    PROBE_TYPES.forEach(function (type) {
      ["one", "two"].forEach(function (rule, n) {
        var cell = stats.cells[type.key][rule];
        var row = make("tr");
        if (n === 0) {
          var head = make("th", null, type.label);
          head.setAttribute("scope", "rowgroup");
          head.setAttribute("rowspan", "2");
          row.appendChild(head);
        }
        row.appendChild(make("td", null, RULES[rule].label));
        row.appendChild(make("td", null, String(cell.n)));
        row.appendChild(make("td", null, pct(cell.noticed)));
        row.appendChild(make("td", null, pct(cell.recognised)));
        probeTable.appendChild(row);
      });
    });
  }

  function renderLoadTable(stats, meta) {
    clear(loadTable);
    ["one", "two"].forEach(function (rule) {
      var cell = stats.load[rule];
      var row = make("tr");
      var head = make("th", null, RULES[rule].label);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, String(cell.n)));
      row.appendChild(make("td", null, String(cell.hits)));
      row.appendChild(make("td", null, String(cell.misses)));
      row.appendChild(make("td", null, String(cell.falsePresses)));
      loadTable.appendChild(row);
    });

    loadNote.textContent = meta.source === "simulated"
      ? "The simulated class contributes no attended-task scores, so this " +
        "table stays empty for the worked example. Run a set yourself to fill it."
      : "A load manipulation only counts if it loaded you. Same misses and " +
        "false presses under both rules means the harder rule was not " +
        "harder, and any difference on the ignored side needs another " +
        "explanation.";
  }

  /* =======================================================================
     Buttons and keys
     ===================================================================== */

  Array.prototype.forEach.call(noticedGroup.querySelectorAll("[data-noticed]"),
    function (button) {
      button.addEventListener("click", function () {
        answerNoticed(button.getAttribute("data-noticed") === "yes");
      });
    });

  targetButton.addEventListener("click", pressTarget);

  /* The space bar is the response key for the whole page while a trial runs,
     not a shortcut for a focused button. An earlier version skipped whenever
     any button other than Target had focus, so clicking Start with the mouse
     left focus on Start and swallowed every subsequent press - the key only
     appeared to work once the learner had clicked Target and given it focus.

     Two exceptions survive, because Space has a legitimate meaning there:
     an editable control, and the Stop button, which a keyboard user needs to
     be able to press. Everything else during a trial belongs to the task.

     preventDefault also suppresses the browser's own activation of a focused
     Target button, so a press registers exactly once however focus sits. */
  document.addEventListener("keydown", function (event) {
    if (event.key !== " " && event.key !== "Spacebar") { return; }
    if (!state || (state.mode !== "practice" && state.mode !== "run")) { return; }

    var el = event.target;
    var tag = el && el.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") { return; }
    if (el && el.isContentEditable) { return; }
    if (el === stopButton) { return; }

    event.preventDefault();
    if (event.repeat) { return; }
    pressTarget();
  });

  startPractice.addEventListener("click", function () {
    cancelPending();
    if (state.audio === "on") { startAudio(); }
    state.mode = "practice";
    state.index = 0;
    state.queue = [null];
    runningControls();
    beginTrial();
    shell.announce("Practice started. Press Target when your side shows an animal.",
      { immediate: true });
  });

  startRun.addEventListener("click", function () {
    cancelPending();
    if (state.audio === "on") { startAudio(); }
    state.mode = "run";
    state.index = 0;
    state.queue = shuffle(PROBE_TYPES.slice());
    runningControls();
    beginTrial();
    shell.announce("Run started: four trials, two questions after each.",
      { immediate: true });
  });

  stopButton.addEventListener("click", stopRun);

  workedExample.addEventListener("click", function () {
    cancelPending();
    state.mode = "idle";
    clearWords();
    answerForm.hidden = true;
    idleControls();
    streamCaption.textContent =
      "Worked example loaded below. The experiment is still available.";
    showResults({ source: "simulated" });
    updateTrialStatus();
    shell.announce("Worked example loaded: a simulated class dataset with a fixed seed.",
      { immediate: true });
  });

  testAudio.addEventListener("click", function () {
    var ctx = ensureAudio();
    if (!ctx) {
      shell.announce("This browser did not provide the Web Audio API, so the " +
        "tones are unavailable. Everything else works without them.",
        { immediate: true });
      return;
    }
    blip(AUDIO.attended, -1);
    later(function () { blip(AUDIO.ignored, 1); }, 400);
    later(function () { blip(AUDIO.markedProbe, 1); }, 900);
    shell.announce("Three tones: the attended side on the left, the ignored " +
      "side on the right, then the different tone a marked item gets.",
      { immediate: true });
  });

  sideSelect.addEventListener("change", function () {
    state.side = sideSelect.value;
    paintSides();
    shell.announce("You will attend to the " + state.side + " stream.",
      { immediate: true });
  });

  ruleSelect.addEventListener("change", function () {
    state.rule = ruleSelect.value;
    setRuleText();
  });

  audioSelect.addEventListener("change", function () {
    state.audio = audioSelect.value;
    if (state.audio === "on") { ensureAudio(); }
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    physical: {
      tone: "good", verdict: "That is the classic result.",
      text: "A change in the physical properties of the ignored channel is " +
        "usually detected; its content usually is not. Keeping those two " +
        "apart is what the two questions after each trial are for."
    },
    everything: {
      tone: "caution", verdict: "It rarely works out that way.",
      text: "People shadowing one message can report remarkably little about " +
        "the other — not the language it was in, often not even whether it was " +
        "speech. Written streams make this easier than listening does, so " +
        "expect more than nothing here, but far less than everything."
    },
    nothing: {
      tone: "caution", verdict: "Too strong.",
      text: "Something always gets through, and which things get through is " +
        "the interesting part. Physical changes get through most easily; a few " +
        "meaningful items get through as well, which is precisely what a filter " +
        "placed before meaning cannot allow."
    },
    meaningful: {
      tone: "caution", verdict: "That is the attenuation prediction.",
      text: "It is a real effect and a good guess. But a physical change is " +
        "detected even when it means nothing at all, so relevance cannot be " +
        "the only route in. Watch both columns of the results table."
    }
  };

  function unlockExperiment(message) {
    idleControls();
    streamCaption.textContent = "Ready. Practice first if this is new to you.";
    shell.announce(message, { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four answers before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockExperiment("Experiment unlocked. Practice is shorter and gives feedback.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "The experiment is unlocked.");
    lockForm(openingForm);
    unlockExperiment("Prediction skipped. Experiment unlocked.");
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "content",
      text: "Someone shadowing one spoken message can report almost nothing about the content of the other, even after several minutes.",
      answer: "late",
      why: "This is the finding early selection was built for, and the one " +
        "late selection has to work hardest on: if everything is identified, " +
        "why is so little of it available? The usual late-selection reply is " +
        "that identification is not the same as remembering, which is a real " +
        "answer but a costly one."
    },
    {
      id: "name",
      text: "About a third of people report hearing their own name when it appears in the message they were told to ignore.",
      answer: "early",
      why: "A filter placed before meaning cannot let a name through, because " +
        "a name is only a name once it has been identified. This is the " +
        "finding attenuation was invented to absorb: the channel is turned " +
        "down rather than off, and a name has a low threshold."
    },
    {
      id: "voice",
      text: "People notice at once when the ignored voice changes from a man's to a woman's.",
      answer: "none",
      why: "Every account handles this comfortably, because pitch is a physical " +
        "property and all three agree that physical properties of the ignored " +
        "channel are registered. It is in the challenge because it is the " +
        "finding students most often offer as evidence for something."
    },
    {
      id: "priming",
      text: "An unattended word makes a related word easier to process in a later test, even when the person cannot report having seen or heard it.",
      answer: "early",
      why: "Meaning must have been extracted for a related word to be " +
        "primed, so a filter before meaning is in trouble. What it does " +
        "not settle: attenuation predicts exactly this, and so does late " +
        "selection. The finding rules one account out rather than " +
        "choosing between the other two."
    },
    {
      id: "load",
      text: "When the attended task is made very demanding, meaningful material stops getting through from the ignored channel.",
      answer: "late",
      why: "If everything is identified regardless, difficulty on the attended " +
        "task should not close the door. This is the finding that reframed the " +
        "question: selection may be early or late depending on load, in which " +
        "case both camps were describing different ends of the same continuum."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["early", "Early selection — the filter blocks meaning"],
    ["late", "Late selection — everything is identified"],
    ["none", "Neither — all three handle it comfortably"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_ITEMS.forEach(function (item) {
      var row = make("tr");
      var head = make("th", null, item.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var cell = make("td");
      var select = make("select");
      select.id = "finding-" + item.id;
      var label = make("label", "visually-hidden",
        "Which account does this finding most trouble: " + item.text);
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      cell.appendChild(label);
      cell.appendChild(select);
      cell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(cell);
      challengeRows.appendChild(row);
    });
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0, right = 0;

    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#finding-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each finding, ask what would have to be " +
        "true of the ignored channel for the result to happen at all.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "Attenuation is not an option anywhere on this list. It absorbs every " +
      "finding, which is its strength and, as a theory, its problem: a model " +
      "that cannot be embarrassed by any result is not being tested by any of " +
      "them.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Challenge marked: " + right + " of " +
      CHALLENGE_ITEMS.length + " correct.", { immediate: true });
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
     ===================================================================== */

  shell.onReset(function () {
    cancelPending();
    clearFlash();
    state = {
      mode: "idle",
      index: 0,
      queue: [],
      trials: [],
      trial: null,
      frame: 0,
      presses: [],
      currentIndex: -1,
      pressedThisItem: false,
      attendedScore: null,
      noticed: false,
      side: "left",
      rule: "one",
      audio: "on",
      practiceDone: false,
      runsDone: 0
    };

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    taskFeedback.hidden = true;
    challengeFeedback.hidden = true;
    answerForm.hidden = true;
    recogniseGroup.hidden = true;
    transcriptWrap.hidden = true;
    resultsSection.hidden = true;
    $("#results-heading").textContent = "What got through";

    clear(transcript);
    clear(probeTable);
    clear(loadTable);
    clear(probeChart);
    clear(resultsBody);
    naiveText.textContent = "";
    naiveNote.textContent = "";
    loadNote.textContent = "";

    sideSelect.value = "left";
    ruleSelect.value = "one";
    audioSelect.value = "on";
    sideSelect.disabled = true;
    ruleSelect.disabled = true;
    audioSelect.disabled = true;
    startPractice.disabled = true;
    startRun.disabled = true;
    stopButton.disabled = true;
    targetButton.disabled = true;

    clearWords();
    paintSides();
    setRuleText();
    streamCaption.textContent =
      "Answer the question above to unlock the experiment.";

    renderChallenge();
    updateTrialStatus();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. The streams change about once a second and nothing flashes. The " +
    "tones are optional and synthesised in this tab; the worked example needs " +
    "neither sound nor a run.",
    { immediate: true });
})();
