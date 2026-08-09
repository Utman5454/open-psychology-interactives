/* =========================================================================
   Face Recognition Detective
   -------------------------------------------------------------------------
   Two staged experiments on a six-component model of recognising a person.

     Experiment 1  Forwards. Put the difficulty at one component and read the
                   seven task outcomes it produces.
     Experiment 2  Backwards. Six fictional profiles; work out which component
                   would explain each, and notice when the profile fits more
                   than one component or none.

   THE EDUCATIONAL MODEL
   ---------------------
   Six components, arranged as two routes that converge:

       a face  -> general vision -> face perception -> face familiarity ---+
                                                                           |
       a voice -> voice recognition ------------------------------------->-+
                                                                           |
                                            person identity knowledge <----+
                                                     |
                                             name retrieval

   Each task lists the components it needs. A task is impaired exactly when
   the affected component is one of the components it needs; otherwise it is
   within range. That is the whole model, and it is all-or-nothing on purpose:
   it is a device for reasoning about patterns, not a simulation of severity.

   WHAT THE TWO EXPERIMENTS MAKE VISIBLE
   -------------------------------------
     1. Face familiarity and person identity knowledge both leave face
        perception intact. One spares the voice route and one does not, which
        is the argument for a face-specific stage.
     2. General vision and face perception produce identical profiles on every
        face task. Only the non-face control task separates them - and only if
        the objects are as hard to tell apart as the faces.
     3. Profile E fits no single component; profile F fits two, because the
        control task was not administered. The tool searches all six locations
        rather than asserting either.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Six components is fewer than the literature separates, and whether
   familiarity is a stage at all is argued about. Components are all-or-nothing
   with no severity, no day-to-day variation and no compensation from hair,
   gait, voice, context or clothing. All six profiles are invented; no
   published case, clinical measure or photograph is used. No anatomy is
   mentioned anywhere, and nothing on the page assesses the reader.

   THE FACES
   ---------
   Schematic faces are generated from seven numbers by mulberry32 from a
   visible seed. They are drawn to make the stimulus question concrete and to
   show that nothing in the model depends on what a face looks like.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     The model
     ===================================================================== */

  var COMPONENTS = [
    {
      id: "vision", name: "General visual processing", short: "General vision",
      gloss: "Seeing shapes and patterns well enough to compare them at all"
    },
    {
      id: "faceperc", name: "Face perception", short: "Face perception",
      gloss: "Building a description of this face precise enough to tell it from another"
    },
    {
      id: "familiar", name: "Face familiarity", short: "Face familiarity",
      gloss: "The sense that this face is one you have seen before"
    },
    {
      id: "voice", name: "Voice recognition", short: "Voice recognition",
      gloss: "Recognising a person's voice as one you have heard before"
    },
    {
      id: "identity", name: "Person identity knowledge", short: "Person identity",
      gloss: "What you know about the person - their job, where you met, what they do"
    },
    {
      id: "name", name: "Name retrieval", short: "Name retrieval",
      gloss: "Producing the spoken or written name once you know who it is"
    }
  ];

  var NONE = "none";

  var TASKS = [
    {
      id: "objDisc", name: "Two everyday objects, same or different?",
      asks: "Decide whether two photographs of teapots show the same teapot",
      needs: ["vision"]
    },
    {
      id: "faceDisc", name: "Two faces, same or different?",
      asks: "Decide whether two unfamiliar faces are the same person",
      needs: ["vision", "faceperc"]
    },
    {
      id: "faceFam", name: "Is this face familiar?",
      asks: "Say whether a face is one you have seen before, without naming it",
      needs: ["vision", "faceperc", "familiar"]
    },
    {
      id: "idFace", name: "From the face, who is this?",
      asks: "Say what you know about the person - their job, where you know them from",
      needs: ["vision", "faceperc", "familiar", "identity"]
    },
    {
      id: "nameFace", name: "From the face, what is their name?",
      asks: "Produce the person's name having seen their face",
      needs: ["vision", "faceperc", "familiar", "identity", "name"]
    },
    {
      id: "idVoice", name: "From the voice, who is this?",
      asks: "Say what you know about the person, having heard them speak",
      needs: ["voice", "identity"]
    },
    {
      id: "nameVoice", name: "From the voice, what is their name?",
      asks: "Produce the person's name having heard them speak",
      needs: ["voice", "identity", "name"]
    }
  ];

  /** The profile a given affected component produces. */
  function profileFor(componentId) {
    var out = {};
    TASKS.forEach(function (task) {
      out[task.id] = task.needs.indexOf(componentId) === -1 ? "within" : "impaired";
    });
    return out;
  }

  /** Which components produce exactly this observed profile? Tasks recorded
      as "nottested" are ignored, which is why profile F fits two. */
  function fittingComponents(observed) {
    return COMPONENTS.filter(function (component) {
      var predicted = profileFor(component.id);
      return TASKS.every(function (task) {
        return observed[task.id] === "nottested" ||
          observed[task.id] === predicted[task.id];
      });
    });
  }

  /* Six invented profiles. Every one is fictional and none is drawn from a
     published case. "impaired" means below the fictional control range. */
  var CASES = [
    {
      id: "A", label: "Profile A",
      referral:
        "After a stroke, cannot pick a colleague out of a group by sight. " +
        "Manages perfectly well on the telephone.",
      observed: {
        objDisc: "within", faceDisc: "impaired", faceFam: "impaired",
        idFace: "impaired", nameFace: "impaired",
        idVoice: "within", nameVoice: "within"
      },
      alternatives: [
        "The object task has to be as hard as the face task. Faces are far more similar to one another than teapots are, so an easier control task can look intact for reasons that have nothing to do with faces.",
        "Acuity, contrast sensitivity and visual fields should be checked before any face-specific account.",
        "The face tasks used unfamiliar faces. Experience with the particular faces tested, and with faces of that population, changes performance."
      ]
    },
    {
      id: "B", label: "Profile B",
      referral:
        "Says every face now looks like a stranger's, including their own " +
        "family. Can describe a face in detail and match two photographs of " +
        "the same stranger without error.",
      observed: {
        objDisc: "within", faceDisc: "within", faceFam: "impaired",
        idFace: "impaired", nameFace: "impaired",
        idVoice: "within", nameVoice: "within"
      },
      alternatives: [
        "Perfect matching of two photographs presented together does not establish intact face perception for a face held in memory. The two tasks make different demands.",
        "A general memory difficulty would also affect the voice route, and here it does not.",
        "Some people in this position show physiological signs of recognition they do not report. Absence of a reported feeling is not absence of processing."
      ]
    },
    {
      id: "C", label: "Profile C",
      referral:
        "Knows a familiar face is familiar and cannot say who it belongs to. " +
        "The same happens on the telephone.",
      observed: {
        objDisc: "within", faceDisc: "within", faceFam: "within",
        idFace: "impaired", nameFace: "impaired",
        idVoice: "impaired", nameVoice: "impaired"
      },
      alternatives: [
        "Both routes fail, so this is not about faces. A difficulty with knowledge of people generally, or with semantic memory more broadly, would produce it.",
        "Test knowledge of non-person concepts - animals, objects, tools - before treating this as person-specific.",
        "Person knowledge is also unusually vulnerable to normal ageing and to fatigue, and the profile alone does not separate those from anything else."
      ]
    },
    {
      id: "D", label: "Profile D",
      referral:
        "Recognises everybody instantly and knows exactly who they are, and " +
        "the name will not come - from the face or from the voice.",
      observed: {
        objDisc: "within", faceDisc: "within", faceFam: "within",
        idFace: "within", nameFace: "impaired",
        idVoice: "within", nameVoice: "impaired"
      },
      alternatives: [
        "This is the commonest experience on the list and by far the least remarkable. Nearly everyone has it sometimes, and it becomes more frequent with age.",
        "A general word-finding difficulty would produce the same pattern for names. Check naming of objects and low-frequency words before concluding anything specific to people.",
        "Proper names are unusual words: arbitrary, low in frequency, and with no semantic support. Difficulty with them is expected rather than diagnostic."
      ]
    },
    {
      id: "E", label: "Profile E",
      referral:
        "Reports that recognising people has become harder over the past " +
        "year. Tested at the end of a long clinic afternoon.",
      observed: {
        objDisc: "impaired", faceDisc: "impaired", faceFam: "impaired",
        idFace: "impaired", nameFace: "impaired",
        idVoice: "impaired", nameVoice: "impaired"
      },
      alternatives: [
        "Effort and fatigue. This person was tested at the end of a long session, and a uniformly low profile is what a tired or disengaged session looks like.",
        "Low-level vision - acuity, contrast, visual fields - would lower everything on the face route, though not the voice route.",
        "Mood, pain, medication and general slowing lower everything without being about recognition at all.",
        "Unfamiliarity with the specific material: faces and voices of a population the person has had less exposure to are genuinely harder for everybody."
      ]
    },
    {
      id: "F", label: "Profile F",
      referral:
        "Cannot tell two unfamiliar faces apart and reports that no face " +
        "looks familiar. The object-matching task was not administered - the " +
        "session ran out of time.",
      observed: {
        objDisc: "nottested", faceDisc: "impaired", faceFam: "impaired",
        idFace: "impaired", nameFace: "impaired",
        idVoice: "within", nameVoice: "within"
      },
      alternatives: [
        "The missing task is the one that would have decided it. Without a non-face control there is no evidence that the difficulty is about faces rather than about vision.",
        "Running out of time is the commonest reason a control task is missing, and it is the task most often judged expendable.",
        "The report will still be written, and whoever reads it will not know which of the two accounts it supports unless the omission is stated."
      ]
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

  /** mulberry32 - a small, well-behaved seeded generator, so that a
      demonstrator can reproduce a set of faces from the printed seed. */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#faces");
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
  var siteControls = $("[data-site-controls]");
  var accountControls = $("[data-account-controls]");
  var caseSelect = $("[data-case-select]");
  var caseReferral = $("[data-case-referral]");
  var caseHeading = $("[data-case-heading]");
  var caseOutcomes = $("[data-case-outcomes]");
  var caseNote = $("[data-case-note]");
  var modelSvg = $("[data-model]");
  var modelText = $("[data-model-text]");
  var modelHeading = $("[data-model-heading]");
  var outcomeList = $("[data-outcomes]");
  var outcomeHead = $("[data-outcome-head]");
  var taskTable = $("[data-task-table]");
  var checkFeedback = $("[data-check-feedback]");
  var interpretation = $("[data-interpretation]");
  var interpretationBody = $("[data-interpretation-body]");
  var accountError = $("[data-account-error]");
  var gallery = $("[data-gallery]");
  var seedNote = $("[data-seed-note]");
  var toStageTwo = $('[data-action="to-stage-two"]');
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var FIRST_SEED = 20260807;

  function initialState() {
    return {
      stage: 1,
      site: NONE,          /* the affected component in experiment 1 */
      visited: {},         /* which components have been visited */
      caseId: CASES[0].id,
      account: null,       /* the learner's chosen component in experiment 2 */
      checked: {},         /* which cases have been checked */
      seed: FIRST_SEED
    };
  }

  var state = initialState();

  function currentCase() { return byId(CASES, state.caseId); }

  /* --- Controls, built once --------------------------------------------- */

  /** One radio per component, plus the "nothing selective" option. */
  function siteOptions() {
    return COMPONENTS.map(function (component) {
      return { id: component.id, label: component.name + " - " + component.gloss };
    }).concat([{
      id: NONE,
      label: "No component is selectively affected"
    }]);
  }

  siteOptions().forEach(function (option) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "site";
    input.value = option.id;
    input.checked = option.id === state.site;
    input.addEventListener("change", function () {
      state.site = option.id;
      if (option.id !== NONE) { state.visited[option.id] = true; }
      render();
      shell.announce(describeSite(option.id), { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(option.label));
    siteControls.appendChild(label);
  });

  siteOptions().forEach(function (option) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "account";
    input.value = option.id;
    input.addEventListener("change", function () {
      state.account = option.id;
      accountError.hidden = true;
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(
      option.id === NONE
        ? "No single component fits this profile"
        : byId(COMPONENTS, option.id).name));
    accountControls.appendChild(label);
  });

  CASES.forEach(function (entry) {
    var opt = document.createElement("option");
    opt.value = entry.id;
    opt.textContent = entry.label;
    caseSelect.appendChild(opt);
  });
  caseSelect.addEventListener("change", function () {
    state.caseId = caseSelect.value;
    state.account = null;
    clearAccountRadios();
    checkFeedback.hidden = true;
    accountError.hidden = true;
    render();
    shell.announce(currentCase().label + ". " + currentCase().referral,
      { immediate: true });
  });

  function clearAccountRadios() {
    Array.prototype.forEach.call(
      accountControls.querySelectorAll("input"),
      function (input) { input.checked = false; });
  }

  function describeSite(id) {
    if (id === NONE) {
      return "No component selectively affected. Every task is within range.";
    }
    var component = byId(COMPONENTS, id);
    var affected = TASKS.filter(function (task) {
      return task.needs.indexOf(id) !== -1;
    });
    return component.name + " affected. " + affected.length + " of the seven " +
      "tasks depend on it.";
  }

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (state.stage === 2) { checkAccount(); }
  });

  toStageTwo.addEventListener("click", function () { goToStage(2); });
  $('[data-action="to-stage-one"]').addEventListener("click", function () {
    goToStage(1);
  });

  $('[data-action="redraw"]').addEventListener("click", function () {
    state.seed = (state.seed + 1013) >>> 0;
    drawGallery();
    shell.announce("Four new faces drawn from seed " + state.seed + ".",
      { immediate: true });
  });

  function goToStage(stage) {
    state.stage = stage;
    checkFeedback.hidden = true;
    accountError.hidden = true;
    render();
    shell.announce(stage === 1
      ? "Experiment 1. Put the difficulty at a component and read the profile."
      : "Experiment 2. Work backwards from a profile to a component.",
      { immediate: true });
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
    renderGoal();
  }

  function renderStageOne() {
    var profile = profileFor(state.site);

    stageTitle.textContent = "Experiment 1 - forwards, from component to profile";
    stageBrief.textContent =
      "Put the difficulty at one component. Every task that needs that " +
      "component is impaired; every task that does not is within range.";
    modelHeading.textContent = state.site === NONE
      ? "The model, with nothing affected"
      : "The model, with " + byId(COMPONENTS, state.site).name.toLowerCase() +
        " affected";
    outcomeHead.textContent = "Outcome";

    drawModel(state.site);
    renderOutcomeList(outcomeList, profile, null);
    renderTaskTable(profile);

    checkFeedback.hidden = true;
    interpretation.hidden = state.site === NONE;
    if (state.site !== NONE) {
      var affected = TASKS.filter(function (task) {
        return profile[task.id] === "impaired";
      });
      var voiceHit = affected.some(function (task) {
        return task.id === "idVoice" || task.id === "nameVoice";
      });
      var objectHit = profile.objDisc === "impaired";
      interpretationBody.textContent =
        byId(COMPONENTS, state.site).name + " is needed by " + affected.length +
        " of the seven tasks. " +
        (objectHit
          ? "The non-face object task is affected too, which means this is not a face-specific account at all."
          : "The non-face object task is within range.") + " " +
        (voiceHit
          ? "The voice route is affected too, so this sits where the two routes have already joined."
          : "The voice route is untouched, so the difficulty sits on the face route, before the two routes join.");
      interpretation.setAttribute("data-tone", "caution");
    }
  }

  function renderStageTwo() {
    var entry = currentCase();

    stageTitle.textContent = "Experiment 2 - backwards, from profile to component";
    stageBrief.textContent =
      "Read the observed profile, decide which component would produce it, " +
      "and check. Not every profile has one answer.";
    caseReferral.textContent = entry.referral;
    caseHeading.textContent = entry.label + " - what was observed";
    outcomeHead.textContent = "Model's outcome";

    renderOutcomeList(caseOutcomes, entry.observed, null);
    caseNote.textContent = TASKS.some(function (task) {
      return entry.observed[task.id] === "nottested";
    })
      ? "One task was not administered. That is part of the profile, not a gap in it."
      : "All seven tasks were administered.";

    /* The table keeps showing what the learner's current account predicts, so
       the comparison is available without leaving the stage. */
    renderTaskTable(state.account && state.account !== NONE
      ? profileFor(state.account)
      : profileFor(NONE));

    interpretation.hidden = !state.checked[entry.id];
  }

  function renderOutcomeList(host, profile, compare) {
    clear(host);
    TASKS.forEach(function (task) {
      var value = profile[task.id];
      var li = make("li");
      li.setAttribute("data-outcome", value);
      li.appendChild(make("span", "face__outcome-name", task.name));
      li.appendChild(make("span", "face__outcome-value",
        value === "within" ? "within range"
          : value === "nottested" ? "not administered" : "impaired"));
      if (compare && compare[task.id] !== value) {
        li.setAttribute("data-mismatch", "yes");
      }
      host.appendChild(li);
    });
  }

  function renderTaskTable(profile) {
    clear(taskTable);
    TASKS.forEach(function (task) {
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, task.asks));
      tr.appendChild(make("td", null, task.needs.map(function (id) {
        return byId(COMPONENTS, id).short.toLowerCase();
      }).join(", ")));
      tr.appendChild(make("td", null,
        profile[task.id] === "impaired" ? "impaired" : "within range"));
      taskTable.appendChild(tr);
    });
  }

  function renderGoal() {
    var visited = Object.keys(state.visited);
    var sparesVoice = visited.some(function (id) {
      var p = profileFor(id);
      return p.idFace === "impaired" && p.idVoice === "within";
    });
    var bothRoutes = visited.some(function (id) {
      var p = profileFor(id);
      return p.idFace === "impaired" && p.idVoice === "impaired";
    });
    var objectsToo = visited.some(function (id) {
      return profileFor(id).objDisc === "impaired";
    });

    clear(goalText);
    goalText.appendChild(document.createTextNode(
      state.stage === 1
        ? "Visit components until all three are met. " + visited.length +
          " of six visited."
        : "Six profiles. " + Object.keys(state.checked).length + " checked."));

    if (state.stage === 1) {
      var list = make("ul", "goal__checks");
      [
        { label: "A component that ruins the face route and spares the voice route", met: sparesVoice },
        { label: "A component that ruins both routes", met: bothRoutes },
        { label: "A component that affects non-face objects as well", met: objectsToo }
      ].forEach(function (check) {
        var li = make("li");
        li.textContent = check.label + (check.met ? " (met)" : " (not yet)");
        li.setAttribute("data-met", check.met ? "yes" : "no");
        list.appendChild(li);
      });
      goalText.appendChild(list);
      toStageTwo.disabled = !(sparesVoice && bothRoutes && objectsToo);
    }
  }

  /* The flow diagram. Two routes converging on person identity knowledge,
     with the affected box crossed through and named underneath. The paragraph
     below the figure says the same thing in words. */
  function drawModel(siteId) {
    clear(modelSvg);

    var BOXES = [
      { id: "vision", x: 62, y: 10, w: 100, h: 28, label: "General vision" },
      { id: "faceperc", x: 172, y: 10, w: 100, h: 28, label: "Face perception" },
      { id: "familiar", x: 282, y: 10, w: 100, h: 28, label: "Face familiarity" },
      { id: "identity", x: 190, y: 62, w: 110, h: 28, label: "Person identity" },
      { id: "name", x: 310, y: 62, w: 104, h: 28, label: "Name retrieval" },
      { id: "voice", x: 62, y: 114, w: 110, h: 28, label: "Voice recognition" }
    ];

    var LINKS = [
      [162, 24, 172, 24], [272, 24, 282, 24],
      [332, 38, 260, 62],
      [300, 76, 310, 76],
      [172, 128, 240, 90]
    ];

    LINKS.forEach(function (line) {
      modelSvg.appendChild(svgEl("line", {
        x1: line[0], y1: line[1], x2: line[2], y2: line[3], class: "face__link"
      }));
    });

    /* Inputs: a schematic face on the face route, a sound mark on the voice
       route, so the two entry points are visibly different kinds of thing. */
    drawFace(modelSvg, faceParams(mulberry32(FIRST_SEED)), 8, 4, 44, 46);
    modelSvg.appendChild(svgText(30, 62, "chart__axis", "middle", "a face"));
    modelSvg.appendChild(svgEl("path", {
      d: "M 6 118 l 10 0 l 10 -10 l 0 32 l -10 -10 l -10 0 z",
      class: "face__sound"
    }));
    modelSvg.appendChild(svgEl("path", {
      d: "M 30 118 q 7 10 0 20 M 36 113 q 11 15 0 30",
      class: "face__wave"
    }));
    modelSvg.appendChild(svgText(26, 158, "chart__axis", "middle", "a voice"));
    modelSvg.appendChild(svgEl("line", {
      x1: 52, y1: 28, x2: 62, y2: 24, class: "face__link"
    }));
    modelSvg.appendChild(svgEl("line", {
      x1: 50, y1: 128, x2: 62, y2: 128, class: "face__link"
    }));

    BOXES.forEach(function (box) {
      var hit = box.id === siteId;
      modelSvg.appendChild(svgEl("rect", {
        x: box.x, y: box.y, width: box.w, height: box.h, rx: 5,
        class: "face__node" + (hit ? " face__node--hit" : "")
      }));
      modelSvg.appendChild(
        svgText(box.x + box.w / 2, box.y + 18,
          "face__nodelabel", "middle", box.label));
      if (hit) {
        modelSvg.appendChild(
          svgText(box.x + box.w / 2, box.y + box.h + 12, "chart__axis",
            "middle", "affected"));
        modelSvg.appendChild(svgEl("path", {
          d: "M " + (box.x + 4) + " " + (box.y + 4) + " l " + (box.w - 8) +
            " " + (box.h - 8) + " M " + (box.x + box.w - 4) + " " +
            (box.y + 4) + " l " + -(box.w - 8) + " " + (box.h - 8),
          class: "face__strike"
        }));
      }
    });

    modelText.textContent = siteId === NONE
      ? "Nothing is affected. A face runs through general vision, face " +
        "perception and face familiarity; a voice runs through voice " +
        "recognition; both reach person identity knowledge and then name " +
        "retrieval, and every task is within range."
      : "The affected component is " +
        byId(COMPONENTS, siteId).name.toLowerCase() + ", crossed through in " +
        "the diagram. Everything before it on its route is intact; every task " +
        "that has to pass through it is impaired.";
  }

  /* --- Schematic faces -------------------------------------------------- */

  /** Seven numbers, and nothing else, make a face here. */
  function faceParams(rand) {
    return {
      head: 0.78 + rand() * 0.22,
      chin: 0.55 + rand() * 0.4,
      eyeGap: 0.42 + rand() * 0.3,
      eyeY: 0.4 + rand() * 0.12,
      eyeSize: 0.06 + rand() * 0.05,
      nose: 0.14 + rand() * 0.14,
      mouth: 0.28 + rand() * 0.26
    };
  }

  /** Draw one schematic face into an SVG, inside the given box. */
  function drawFace(svg, p, x, y, w, h) {
    var cx = x + w / 2;
    var rx = (w / 2) * p.head;
    var ry = h / 2;
    var top = y + h / 2 - ry;

    var group = svgEl("g", {});
    group.appendChild(svgEl("path", {
      d: "M " + (cx - rx) + " " + (y + h * 0.42) +
        " C " + (cx - rx) + " " + (top - 2) + ", " + (cx + rx) + " " +
        (top - 2) + ", " + (cx + rx) + " " + (y + h * 0.42) +
        " C " + (cx + rx) + " " + (y + h * (0.62 + 0.2 * p.chin)) + ", " +
        cx + " " + (y + h) + ", " + cx + " " + (y + h) +
        " C " + cx + " " + (y + h) + ", " + (cx - rx) + " " +
        (y + h * (0.62 + 0.2 * p.chin)) + ", " + (cx - rx) + " " +
        (y + h * 0.42) + " Z",
      class: "face__outline"
    }));

    var eyeX = rx * p.eyeGap;
    var eyeY = y + h * p.eyeY;
    [-1, 1].forEach(function (side) {
      group.appendChild(svgEl("ellipse", {
        cx: cx + side * eyeX, cy: eyeY,
        rx: w * p.eyeSize, ry: w * p.eyeSize * 0.72,
        class: "face__feature"
      }));
    });

    group.appendChild(svgEl("path", {
      d: "M " + cx + " " + (eyeY + 2) + " l 0 " + (h * p.nose) +
        " l " + (w * 0.07) + " 0",
      class: "face__stroke"
    }));

    group.appendChild(svgEl("path", {
      d: "M " + (cx - w * p.mouth / 2) + " " + (y + h * 0.78) +
        " q " + (w * p.mouth / 2) + " " + (h * 0.07) + " " +
        (w * p.mouth) + " 0",
      class: "face__stroke"
    }));

    svg.appendChild(group);
    return group;
  }

  function drawGallery() {
    clear(gallery);
    var rand = mulberry32(state.seed);
    for (var i = 0; i < 4; i += 1) {
      var figure = make("figure", "face__card");
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 60 74");
      svg.setAttribute("class", "chart__svg face__portrait");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      drawFace(svg, faceParams(rand), 4, 4, 52, 66);
      figure.appendChild(svg);
      figure.appendChild(make("figcaption", null, "Face " + (i + 1)));
      gallery.appendChild(figure);
    }
    seedNote.textContent = "These four were drawn from seed " + state.seed +
      ". The same seed always gives the same four faces.";
  }

  /* --- Checking an account ---------------------------------------------- */

  function checkAccount() {
    if (!state.account) {
      accountError.textContent = "Choose an account before checking.";
      accountError.hidden = false;
      return;
    }
    accountError.hidden = true;

    var entry = currentCase();
    var fits = fittingComponents(entry.observed);
    var fitIds = fits.map(function (component) { return component.id; });
    var correct = state.account === NONE
      ? fits.length === 0
      : fitIds.indexOf(state.account) !== -1;

    state.checked[entry.id] = true;
    render();

    clear(checkFeedback);
    var lead = make("p");

    if (correct && fits.length === 1) {
      lead.appendChild(make("strong", "feedback__verdict", "Yes, and uniquely."));
      lead.appendChild(document.createTextNode(
        " " + fits[0].name + " is the only one of the six that reproduces " +
        "every observed outcome."));
    } else if (correct && fits.length > 1) {
      lead.appendChild(make("strong", "feedback__verdict",
        "Your account fits - and so does another."));
      lead.appendChild(document.createTextNode(
        " " + nameList(fits) + " both reproduce this profile exactly, so the " +
        "profile does not decide between them."));
    } else if (correct && fits.length === 0) {
      lead.appendChild(make("strong", "feedback__verdict",
        "Yes - no single component fits."));
      lead.appendChild(document.createTextNode(
        " Every one of the six leaves at least one task within range, and " +
        "this profile has none. Reaching for a component here would be " +
        "reading in a pattern that is not there."));
    } else if (fits.length === 0) {
      lead.appendChild(make("strong", "feedback__verdict",
        "No component fits this profile - including that one."));
      lead.appendChild(document.createTextNode(
        " " + mismatchSentence(state.account, entry.observed)));
    } else {
      lead.appendChild(make("strong", "feedback__verdict", "Not quite."));
      lead.appendChild(document.createTextNode(
        " " + mismatchSentence(state.account, entry.observed)));
    }
    checkFeedback.appendChild(lead);

    var altHead = make("p");
    altHead.appendChild(make("strong", null,
      "Before settling on any component, these come first:"));
    checkFeedback.appendChild(altHead);

    var list = make("ul", "face__alternatives");
    entry.alternatives.forEach(function (text) {
      list.appendChild(make("li", null, text));
    });
    checkFeedback.appendChild(list);

    checkFeedback.setAttribute("data-tone",
      correct && fits.length <= 1 ? "good" : correct ? "caution" : "warn");
    checkFeedback.hidden = false;

    interpretationBody.textContent = fits.length === 0
      ? "This profile is below range on every administered task. A single " +
        "component always leaves something intact, so the explanations to " +
        "consider are the ones that lower everything at once."
      : fits.length > 1
        ? "Two components produce this profile. The task that would separate " +
          "them is the non-face object task, and it was not administered."
        : "One component reproduces this profile exactly. That constrains " +
          "the account; it does not confirm it, because the alternatives " +
          "below have not been ruled out by anything in the profile.";
    interpretation.setAttribute("data-tone", fits.length === 1 ? "caution" : "warn");
    interpretation.hidden = false;

    shell.announce("Account checked for " + entry.label + ".", { immediate: true });
  }

  /** "Face perception and general visual processing", capitalised at the
      start of a sentence. */
  function nameList(components) {
    var names = components.map(function (c) { return c.name.toLowerCase(); });
    var joined = names.length < 2 ? names.join("")
      : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    return joined.charAt(0).toUpperCase() + joined.slice(1);
  }

  function mismatchSentence(accountId, observed) {
    var fits = fittingComponents(observed);
    if (accountId === NONE) {
      return nameList(fits) +
        (fits.length === 1 ? " does reproduce this profile exactly, so "
          : " both reproduce this profile exactly, so ") +
        "there is a single-component account here after all.";
    }
    var predicted = profileFor(accountId);
    var wrong = TASKS.filter(function (task) {
      return observed[task.id] !== "nottested" &&
        observed[task.id] !== predicted[task.id];
    });
    return "With " + byId(COMPONENTS, accountId).name.toLowerCase() +
      " affected the model predicts the wrong outcome on " + wrong.length +
      (wrong.length === 1 ? " task: " : " tasks: ") +
      wrong.map(function (task) {
        return "“" + task.name + "” (observed " +
          observed[task.id] + ", predicted " + predicted[task.id] + ")";
      }).join("; ") + "." +
      (fits.length
        ? " What does fit: " + fits.map(function (c) {
            return c.name.toLowerCase();
          }).join(" and ") + "."
        : " Every one of the six fails somewhere.");
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    perception: {
      tone: "caution",
      verdict: "Ruled out by the first finding.",
      text:
        "They can tell any two unfamiliar faces apart, so the face is being " +
        "seen precisely enough. A perceptual account would also have made " +
        "that task fail. Profile B in experiment 2 is exactly this pattern."
    },
    familiarity: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Face perception is intact and recognition by voice is intact, so " +
        "the difficulty sits on the face route after perception and before " +
        "the point where the two routes join. That is what the familiarity " +
        "component is - and the voice finding is what places it there."
    },
    identity: {
      tone: "caution",
      verdict: "Ruled out by the voice finding.",
      text:
        "Knowledge of the person is reached by both routes. If it were " +
        "affected, the voice would fail too, and it does not. Profile C in " +
        "experiment 2 is what an identity-knowledge difficulty looks like."
    },
    memory: {
      tone: "caution",
      verdict: "Too broad, and the voice route rules it out.",
      text:
        "A general memory difficulty would not stop at faces. The person " +
        "recognises the same colleagues instantly from their voices, which " +
        "is the same memory doing the same job through a different door."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the model.";
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
    drawGallery();
    $("#lab-heading").focus();
    shell.announce("Model open. Experiment 1.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    nothing: {
      tone: "caution",
      verdict: "That is the assumption the challenge is about.",
      text:
        "Faces are far more similar to one another than teapots are, so a " +
        "face task and an object task are almost never equally hard. A " +
        "general perceptual difficulty shows up first on the harder task, " +
        "which produces this exact pattern without being face-specific."
    },
    difficulty: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Without matched difficulty, impaired faces with intact objects is " +
        "the pattern you would expect from a general perceptual difficulty as " +
        "much as from a face-specific one. Control tasks have to be chosen " +
        "for difficulty, not for convenience."
    },
    scan: {
      tone: "caution",
      verdict: "That would not settle it.",
      text:
        "A region would tell you where something is different, not what the " +
        "task required. The confound is between two cognitive accounts of the " +
        "same behavioural pattern, and no image resolves it."
    },
    more: {
      tone: "caution",
      verdict: "It would help, and not with this.",
      text:
        "More participants would sharpen the estimate of the difference. It " +
        "would not remove the difficulty confound, because every one of them " +
        "would be doing the same unmatched pair of tasks."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var entry = CHALLENGE[answer.value];
    showFeedback(challengeFeedback, entry.tone, entry.verdict, entry.text);
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
    Array.prototype.forEach.call(
      siteControls.querySelectorAll("input"),
      function (input) { input.checked = input.value === NONE; });
    clearAccountRadios();
    caseSelect.value = CASES[0].id;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    checkFeedback.hidden = true;
    accountError.hidden = true;
    interpretation.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
    drawGallery();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the model.",
    { immediate: true });
})();
