/* =========================================================================
   Assessment Battery Builder
   -------------------------------------------------------------------------
   A referral question, a ninety-minute session and seventeen generic task
   types. The learner ticks tasks; four checks update live; submitting the
   battery produces a verdict in two halves - what it could say and what it
   could not.

   THE EDUCATIONAL MODEL
   ---------------------
   Nothing here scores a person. The tool evaluates the DESIGN of a battery
   against the referral in front of it, on four checks:

     1. Converging evidence   at least two tasks in the referral's target
                              domains, and at least one in each of them;
     2. A comparison domain   at least one task in a domain the referral does
                              not ask about, so selectivity is visible;
     3. Context measures      the two confound measures this referral needs,
                              named per referral;
     4. Deliverable           total time within the ninety-minute budget.

   Two softer signals sit alongside them: a burden warning above seventy
   minutes, because tasks administered last measure fatigue as well as
   anything else; and a redundancy note when two selected tasks measure the
   same narrow thing outside the target domains.

   One task has a dependency: recognition of a word list cannot be
   administered without the learning task that produced the list.

   WHY THE CHECKS ARE WHAT THEY ARE
   --------------------------------
   The context measures answer no referral question at all, which is exactly
   why they are the first thing dropped and the reason a battery without them
   cannot rule out the several ordinary explanations of a low score. The
   comparison domain is the difference between "scored low on the things we
   tested" and a pattern.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Task descriptions are generic; no published test, subtest, item, stimulus
   or norm is reproduced, and the durations are round teaching numbers. Real
   selection also weighs language, literacy, education, cultural background,
   sensory and motor limitations, whether appropriate norms exist, and what
   the person wants from the assessment. Assessment is not a task list:
   history, interview, informant report, observation and formulation carry at
   least as much weight and none of them appears here. Domains are a
   convenience - every task loads on several.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var BUDGET = 90;        /* minutes available in the session */
  var BURDEN = 70;        /* beyond this, fatigue starts to matter */

  var DOMAIN_NAMES = {
    attention: "Attention",
    memory: "Memory",
    language: "Language",
    executive: "Executive",
    visuospatial: "Visuospatial",
    context: "Context"
  };

  var TASKS = [
    {
      id: "span", name: "Repeating sequences of digits", domain: "attention",
      measures: "immediate span", minutes: 8,
      note: "Short and undemanding. Sensitive to almost nothing on its own."
    },
    {
      id: "vigil", name: "Watching for a rare target for ten minutes",
      domain: "attention", measures: "sustained attention", minutes: 14,
      note: "Long, dull and the one most affected by how the person is feeling."
    },
    {
      id: "speed", name: "Simple reaction time", domain: "attention",
      measures: "processing speed", minutes: 6,
      note: "Cheap, and worth having before interpreting any timed task."
    },
    {
      id: "list", name: "Learning and recalling a word list", domain: "memory",
      measures: "verbal learning", minutes: 25,
      note: "The workhorse verbal memory task, and the most expensive item here."
    },
    {
      id: "recog", name: "Recognising those words among distractors",
      domain: "memory", measures: "verbal recognition", minutes: 8,
      requires: "list",
      note: "Cannot be administered without the learning task that produced the list."
    },
    {
      id: "design", name: "Reproducing designs after a delay", domain: "memory",
      measures: "visual learning", minutes: 18,
      note: "Depends heavily on drawing ability, which is a separate question."
    },
    {
      id: "naming", name: "Naming line drawings", domain: "language",
      measures: "word retrieval", minutes: 10,
      note: "Sensitive to word retrieval, and to vision, and to education."
    },
    {
      id: "fluency", name: "Generating words to a category", domain: "language",
      measures: "word retrieval", minutes: 6,
      note: "Quick, and loads on executive demands as much as on language."
    },
    {
      id: "comp", name: "Following spoken instructions", domain: "language",
      measures: "sentence comprehension", minutes: 9,
      note: "Depends on hearing, which is worth screening first."
    },
    {
      id: "sort", name: "Sorting to a rule that changes", domain: "executive",
      measures: "set switching", minutes: 15,
      note: "Long, and impaired by a great many things other than switching."
    },
    {
      id: "conflict", name: "Naming the ink colour of a colour word",
      domain: "executive", measures: "response inhibition", minutes: 8,
      note: "Heavily loaded on processing speed as well as on inhibition."
    },
    {
      id: "copy", name: "Copying a complex figure", domain: "visuospatial",
      measures: "constructional", minutes: 12,
      note: "Needs a hand that works and eyes that see; check both first."
    },
    {
      id: "cancel", name: "Crossing out targets across a page",
      domain: "visuospatial", measures: "spatial attention", minutes: 8,
      note: "Short, and the standard way of looking for a spatial bias."
    },
    {
      id: "mood", name: "Mood, sleep and fatigue questionnaire",
      domain: "context", measures: "mood and fatigue", minutes: 5,
      note: "Answers no referral question. Changes the meaning of every score."
    },
    {
      id: "effort", name: "A performance-validity check", domain: "context",
      measures: "effort", minutes: 10,
      note: "Answers no referral question. Without it, low scores have an extra reading."
    },
    {
      id: "premorb", name: "Estimating premorbid level from word reading",
      domain: "context", measures: "premorbid level", minutes: 8,
      note: "Answers no referral question. Without it, low means low compared with whom?"
    },
    {
      id: "senses", name: "Vision and hearing screen", domain: "context",
      measures: "sensory screen", minutes: 5,
      note: "Answers no referral question. Cheapest thing on the menu."
    }
  ];

  var REFERRALS = [
    {
      id: "language",
      label: "1. Word-finding after a left-hemisphere stroke",
      text:
        "A fictional 58-year-old, three months after a left-hemisphere " +
        "stroke. The referrer asks: are the word-finding difficulties the " +
        "family describe present on testing, and is anything else affected?",
      target: ["language"],
      comparison: ["visuospatial", "memory", "executive"],
      context: ["premorb", "senses"],
      contextWhy:
        "A word-finding score means nothing without an estimate of where this " +
        "person started, and an untested hearing or vision problem would lower " +
        "half the battery for reasons that have nothing to do with language.",
      worked: ["naming", "fluency", "comp", "copy", "premorb", "senses"],
      workedWhy:
        "Two word-retrieval tasks and a comprehension task give converging " +
        "evidence on the question; the figure copy is the domain expected to " +
        "be intact; the premorbid estimate and the sensory screen cost thirteen " +
        "minutes between them."
    },
    {
      id: "mild",
      label: "2. Concentration complaints after a mild head injury",
      text:
        "A fictional 34-year-old, eight months after a mild head injury and " +
        "still off work. The referrer asks: do the concentration and memory " +
        "complaints show up on testing?",
      target: ["memory", "attention"],
      comparison: ["language", "visuospatial"],
      context: ["mood", "effort"],
      contextWhy:
        "Eight months after a mild injury, low mood, poor sleep, pain and the " +
        "effort a person brings to a test they have a stake in all lower " +
        "scores. These are not an afterthought here - they are most of the " +
        "referral question.",
      worked: ["span", "list", "naming", "mood", "effort"],
      workedWhy:
        "One attention task and one memory task cover both halves of the " +
        "question; naming is the comparison domain; the mood questionnaire and " +
        "the validity check are what make the rest interpretable."
    },
    {
      id: "lost",
      label: "3. Getting lost on familiar routes",
      text:
        "A fictional 71-year-old who has begun getting lost on routes they " +
        "have walked for years. The referrer asks: is this a visuospatial " +
        "difficulty or a memory difficulty?",
      target: ["visuospatial", "memory"],
      comparison: ["language", "attention"],
      context: ["senses", "mood"],
      contextWhy:
        "Untested vision would produce low scores on every visuospatial task, " +
        "and low mood is among the commonest reasons an older adult's memory " +
        "scores fall. Both are cheaper to check than either of the answers on " +
        "offer.",
      worked: ["copy", "cancel", "list", "naming", "senses", "mood"],
      workedWhy:
        "Two visuospatial tasks and one memory task put the two candidate " +
        "answers side by side; naming is the comparison domain; the sensory " +
        "screen and the mood questionnaire cost ten minutes."
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

  function listWords(items) {
    if (!items.length) { return ""; }
    if (items.length === 1) { return items[0]; }
    return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#battery");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var referralSelect = $("[data-referral-select]");
  var referralText = $("[data-referral-text]");
  var goalText = $("[data-goal-text]");
  var timeSvg = $("[data-time]");
  var timeText = $("[data-time-text]");
  var checksList = $("[data-checks]");
  var submitFeedback = $("[data-submit-feedback]");
  var submitError = $("[data-submit-error]");
  var verdict = $("[data-verdict]");
  var verdictCould = $("[data-verdict-could]");
  var verdictCouldNot = $("[data-verdict-could-not]");
  var verdictNote = $("[data-verdict-note]");
  var selectedTable = $("[data-selected-table]");
  var menuTable = $("[data-menu-table]");
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  function initialState() {
    return {
      referralId: REFERRALS[0].id,
      chosen: {},
      submitted: false,
      solved: {}
    };
  }

  var state = initialState();

  function referral() { return byId(REFERRALS, state.referralId); }

  function chosenTasks() {
    return TASKS.filter(function (task) { return state.chosen[task.id]; });
  }

  /* --- Controls, built once --------------------------------------------- */

  REFERRALS.forEach(function (entry) {
    var option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    referralSelect.appendChild(option);
  });

  referralSelect.addEventListener("change", function () {
    state.referralId = referralSelect.value;
    state.submitted = false;
    submitFeedback.hidden = true;
    submitError.hidden = true;
    verdict.hidden = true;
    render();
    shell.announce(referral().label + ". " + referral().text, { immediate: true });
  });

  var taskInputs = {};
  TASKS.forEach(function (task) {
    var host = $("[data-tasks-" + task.domain + "]");
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("data-task", task.id);
    input.addEventListener("change", function () {
      state.chosen[task.id] = input.checked;
      if (!input.checked) { delete state.chosen[task.id]; }
      state.submitted = false;
      submitFeedback.hidden = true;
      submitError.hidden = true;
      verdict.hidden = true;
      render();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(
      task.name + " (" + task.minutes + " min)"));
    host.appendChild(label);
    taskInputs[task.id] = input;
  });

  function syncTaskBoxes() {
    TASKS.forEach(function (task) {
      taskInputs[task.id].checked = Boolean(state.chosen[task.id]);
    });
  }

  $('[data-action="worked"]').addEventListener("click", function () {
    state.chosen = {};
    referral().worked.forEach(function (id) { state.chosen[id] = true; });
    state.submitted = false;
    submitFeedback.hidden = true;
    verdict.hidden = true;
    syncTaskBoxes();
    render();
    shell.announce("A defensible battery loaded. " + referral().workedWhy,
      { immediate: true });
  });

  $('[data-action="clear"]').addEventListener("click", function () {
    state.chosen = {};
    state.submitted = false;
    submitFeedback.hidden = true;
    verdict.hidden = true;
    syncTaskBoxes();
    render();
    shell.announce("Selection cleared.", { immediate: true });
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBattery();
  });

  /* --- Evaluating a battery --------------------------------------------- */

  /** Everything the four checks and the two soft signals need. */
  function evaluate() {
    var current = referral();
    var chosen = chosenTasks();

    /* A task with an unmet dependency cannot be administered, so it does not
       count towards anything. */
    var usable = chosen.filter(function (task) {
      return !task.requires || Boolean(state.chosen[task.requires]);
    });
    var unusable = chosen.filter(function (task) {
      return task.requires && !state.chosen[task.requires];
    });

    var minutes = chosen.reduce(function (total, task) {
      return total + task.minutes;
    }, 0);

    var inTarget = usable.filter(function (task) {
      return current.target.indexOf(task.domain) !== -1;
    });
    var everyTargetCovered = current.target.every(function (domain) {
      return inTarget.some(function (task) { return task.domain === domain; });
    });
    var converging = inTarget.length >= 2 && everyTargetCovered;

    var comparison = usable.filter(function (task) {
      return current.comparison.indexOf(task.domain) !== -1;
    });

    var missingContext = current.context.filter(function (id) {
      return !state.chosen[id];
    });

    /* Two tasks measuring the same narrow thing, outside the domains the
       referral asks about: burden without extra evidence. */
    var seen = {};
    var redundant = [];
    usable.forEach(function (task) {
      if (task.domain === "context") { return; }
      if (current.target.indexOf(task.domain) !== -1) { return; }
      if (seen[task.measures]) { redundant.push(task.measures); }
      seen[task.measures] = true;
    });

    return {
      referral: current,
      chosen: chosen,
      usable: usable,
      unusable: unusable,
      minutes: minutes,
      inTarget: inTarget,
      converging: converging,
      everyTargetCovered: everyTargetCovered,
      comparison: comparison,
      missingContext: missingContext,
      redundant: redundant,
      deliverable: minutes <= BUDGET,
      heavy: minutes > BURDEN && minutes <= BUDGET
    };
  }

  function checkRows(result) {
    var current = result.referral;
    return [
      {
        label: "Converging evidence on the referral question",
        detail: result.inTarget.length + " task" +
          (result.inTarget.length === 1 ? "" : "s") + " in " +
          listWords(current.target.map(function (d) {
            return DOMAIN_NAMES[d].toLowerCase();
          })) +
          (result.inTarget.length >= 2 && !result.everyTargetCovered
            ? ", but not in both" : ""),
        met: result.converging
      },
      {
        label: "A domain you expect to be intact",
        detail: result.comparison.length
          ? listWords(result.comparison.map(function (t) {
              return DOMAIN_NAMES[t.domain].toLowerCase();
            }))
          : "none selected",
        met: result.comparison.length >= 1
      },
      {
        label: "The context measures this referral needs",
        detail: result.missingContext.length
          ? "missing " + listWords(result.missingContext.map(function (id) {
              return byId(TASKS, id).name.toLowerCase();
            }))
          : "both present",
        met: result.missingContext.length === 0
      },
      {
        label: "Deliverable in one session",
        detail: result.minutes + " of " + BUDGET + " minutes",
        met: result.deliverable
      }
    ];
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var result = evaluate();
    referralText.textContent = result.referral.text;

    drawTime(result);
    renderChecks(result);
    renderGoal(result);
    renderSelected(result);
    renderMenu();
  }

  function drawTime(result) {
    var LEFT = 4, RIGHT = 396, TOP = 10, HEIGHT = 20;
    var scaleMax = Math.max(BUDGET, result.minutes, 1);
    var span = RIGHT - LEFT;

    clear(timeSvg);

    timeSvg.appendChild(svgEl("rect", {
      x: LEFT, y: TOP, width: span, height: HEIGHT, class: "chart__track"
    }));

    var x = LEFT;
    result.chosen.forEach(function (task, index) {
      var w = (task.minutes / scaleMax) * span;
      timeSvg.appendChild(svgEl("rect", {
        x: x, y: TOP, width: Math.max(1, w), height: HEIGHT,
        class: "chart__bar" + (index % 2 ? " battery__segment--alt" : "")
      }));
      timeSvg.appendChild(svgEl("line", {
        x1: x, y1: TOP, x2: x, y2: TOP + HEIGHT, class: "battery__divider"
      }));
      x += w;
    });

    /* The budget line, drawn last so it sits over the bar. */
    var budgetX = LEFT + (BUDGET / scaleMax) * span;
    timeSvg.appendChild(svgEl("line", {
      x1: budgetX, y1: TOP - 6, x2: budgetX, y2: TOP + HEIGHT + 6,
      class: "battery__budget"
    }));
    timeSvg.appendChild(
      svgText(Math.min(budgetX, RIGHT - 4), TOP + HEIGHT + 20, "chart__axis",
        "end", BUDGET + " min budget"));
    timeSvg.appendChild(
      svgText(LEFT, TOP + HEIGHT + 20, "chart__axis", "start",
        result.minutes + " min chosen"));

    timeText.textContent = result.chosen.length === 0
      ? "No tasks chosen yet. The bar fills as you tick them, and the vertical "
        + "line is the end of the session."
      : result.chosen.length + " task" +
        (result.chosen.length === 1 ? "" : "s") + ", " + result.minutes +
        " minutes of a " + BUDGET + "-minute session" +
        (result.deliverable
          ? (result.heavy
            ? " - a long session, and whatever is administered last is measuring fatigue as well as anything else."
            : " - comfortable.")
          : " - " + (result.minutes - BUDGET) + " minutes over. This battery cannot be delivered.");
  }

  function renderChecks(result) {
    clear(checksList);
    checkRows(result).forEach(function (check) {
      var li = make("li");
      li.textContent = check.label + " - " + check.detail +
        (check.met ? " (met)" : " (not yet)");
      li.setAttribute("data-met", check.met ? "yes" : "no");
      checksList.appendChild(li);
    });

    if (result.unusable.length) {
      var li = make("li");
      li.textContent = "Cannot be administered: " +
        listWords(result.unusable.map(function (task) {
          return task.name.toLowerCase() + " needs " +
            byId(TASKS, task.requires).name.toLowerCase();
        })) + " (not yet)";
      li.setAttribute("data-met", "no");
      checksList.appendChild(li);
    }

    if (result.redundant.length) {
      var note = make("li");
      note.textContent = "Two tasks measuring the same thing outside the " +
        "referral's domains: " + listWords(result.redundant) +
        " - burden without extra evidence (not yet)";
      note.setAttribute("data-met", "no");
      checksList.appendChild(note);
    }
  }

  function renderGoal(result) {
    var met = checkRows(result).filter(function (c) { return c.met; }).length;
    var solved = Object.keys(state.solved).length;
    clear(goalText);
    goalText.appendChild(document.createTextNode(
      met + " of 4 checks met for this referral. " + solved +
      " of " + REFERRALS.length + " referrals answered with all four."));
  }

  function renderSelected(result) {
    clear(selectedTable);
    if (!result.chosen.length) {
      var tr = make("tr");
      var td = make("td", null, "No tasks chosen yet.");
      td.setAttribute("colspan", "4");
      tr.appendChild(td);
      selectedTable.appendChild(tr);
      return;
    }
    result.chosen.forEach(function (task) {
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, DOMAIN_NAMES[task.domain]));
      tr.appendChild(make("td", null, task.measures));
      tr.appendChild(make("td", null, String(task.minutes)));
      if (task.requires && !state.chosen[task.requires]) {
        tr.className = "battery__blocked";
      }
      selectedTable.appendChild(tr);
    });
  }

  var menuDrawn = false;
  function renderMenu() {
    if (menuDrawn) { return; }
    menuDrawn = true;
    TASKS.forEach(function (task) {
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, DOMAIN_NAMES[task.domain]));
      tr.appendChild(make("td", null, String(task.minutes)));
      tr.appendChild(make("td", null, task.note));
      menuTable.appendChild(tr);
    });
  }

  /* --- Submitting -------------------------------------------------------- */

  function submitBattery() {
    var result = evaluate();

    if (!result.chosen.length) {
      submitError.textContent =
        "Choose at least one task before submitting. An empty battery is a " +
        "defensible decision in real life, and not one this tool can score.";
      submitError.hidden = false;
      return;
    }
    submitError.hidden = true;

    var rows = checkRows(result);
    var met = rows.filter(function (c) { return c.met; });
    var failed = rows.filter(function (c) { return !c.met; });
    if (failed.length === 0) { state.solved[result.referral.id] = true; }
    state.submitted = true;
    render();

    clear(submitFeedback);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      failed.length === 0
        ? "All four checks met."
        : failed.length + (failed.length === 1 ? " check fails." : " checks fail.")));
    lead.appendChild(document.createTextNode(
      failed.length === 0
        ? " This battery is defensible for this referral: it has converging " +
          "evidence on the question, a domain expected to be intact, the two " +
          "context measures, and it fits the session."
        : " " + listWords(failed.map(function (c) {
            return c.label.toLowerCase();
          })) + ". Each one changes what the report is entitled to say."));
    submitFeedback.appendChild(lead);

    if (result.missingContext.length) {
      submitFeedback.appendChild(make("p", null, result.referral.contextWhy));
    }
    if (result.heavy) {
      submitFeedback.appendChild(make("p", null,
        "At " + result.minutes + " minutes this fits the session on paper. In " +
        "practice the tasks administered last are measuring fatigue as well " +
        "as whatever they are named after - and the context measures are " +
        "usually the ones scheduled last."));
    }
    if (result.redundant.length) {
      submitFeedback.appendChild(make("p", null,
        "Two of your tasks measure the same thing (" +
        listWords(result.redundant) + ") in a domain this referral does not " +
        "ask about. Inside the target domains that would be converging " +
        "evidence; outside them it is administration time."));
    }

    submitFeedback.setAttribute("data-tone",
      failed.length === 0 ? "good" : failed.length === 1 ? "caution" : "warn");
    submitFeedback.hidden = false;

    writeVerdict(result, met, failed);
    shell.announce(
      failed.length === 0
        ? "Battery submitted. All four checks met."
        : "Battery submitted. " + failed.length + " of four checks fail.",
      { immediate: true });
  }

  function writeVerdict(result, met, failed) {
    var could = [];
    var couldNot = [];

    if (!result.deliverable) {
      couldNot.push("anything at all, because the session runs out before " +
        "the battery does");
    }
    if (result.converging) {
      could.push("that the difficulty the referral asks about is or is not " +
        "present on more than one task");
    } else if (result.inTarget.length === 1) {
      couldNot.push("anything that does not rest on a single score in the " +
        "domain the referral asks about");
    } else {
      couldNot.push("anything about the referral question, which no selected " +
        "task addresses");
    }
    if (result.comparison.length) {
      could.push("whether the pattern is selective or general, because there " +
        "is a domain here you expected to be intact");
    } else {
      couldNot.push("whether any low score is selective, because every task " +
        "in this battery is in a domain the referral is worried about");
    }
    if (result.missingContext.length === 0) {
      could.push("that the ordinary explanations of a low score - " +
        listWords(result.referral.context.map(function (id) {
          return byId(TASKS, id).measures;
        })) + " - have at least been looked at");
    } else {
      couldNot.push("that a low score means what the referral assumes, " +
        "because " + listWords(result.missingContext.map(function (id) {
          return byId(TASKS, id).measures;
        })) + " has not been measured");
    }

    /* The clauses contain commas of their own, so they are joined with
       semicolons rather than by listWords(). */
    verdictCould.textContent = could.length
      ? "With this battery you could say: " + could.join("; ") + "."
      : "With this battery there is very little you could say.";
    verdictCouldNot.textContent = couldNot.length
      ? "You could not say: " + couldNot.join("; ") + "."
      : "There is nothing on the four checks that this battery leaves open.";
    verdictNote.textContent =
      "Both halves are about the design of the battery, not about any person. " +
      "No score is produced here, and a battery that passes all four checks " +
      "can still reach the wrong conclusion.";
    verdict.setAttribute("data-tone", failed.length === 0 ? "good" : "warn");
    verdict.hidden = false;
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    second: {
      tone: "caution",
      verdict: "Valuable, and second in line.",
      text:
        "Two memory measures do give converging evidence, and one is thin. " +
        "But two low memory scores are still compatible with low mood, poor " +
        "effort, fatigue and an untested hearing problem, and adding a second " +
        "memory test rules out none of them."
    },
    context: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Mood, fatigue and effort answer no referral question, which is " +
        "exactly why they are dropped when time is short - and why a battery " +
        "without them cannot distinguish the readings that matter. They are " +
        "also among the cheapest things on the menu."
    },
    longer: {
      tone: "caution",
      verdict: "This makes it worse, not better.",
      text:
        "A longer version of the same task measures the same thing with the " +
        "same confounds, adds nothing about why a score is low, and uses the " +
        "session time that the measures which would have answered that were " +
        "going to need."
    },
    comparison: {
      tone: "caution",
      verdict: "Genuinely valuable, for a different problem.",
      text:
        "A domain you expect to be intact is what shows whether a pattern is " +
        "selective, and a battery without one cannot do that. It does not, " +
        "though, tell you why any score is low - and low mood or poor effort " +
        "would lower the comparison task too."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the builder.";
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
    shell.announce("Builder open. " + REFERRALS[0].label + ".",
      { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    second: {
      tone: "caution",
      verdict: "True, and not the biggest problem.",
      text:
        "A conclusion resting on one score is fragile. But two low recall " +
        "scores would support exactly the same sentence and leave exactly the " +
        "same alternatives standing. The missing measures are the ones that " +
        "decide between readings, not the ones that repeat a reading."
    },
    context: {
      tone: "good",
      verdict: "Yes.",
      text:
        "A recall score at the 3rd percentile is produced by poor sleep, low " +
        "mood, pain, medication, an untested hearing problem, a premorbid " +
        "level well below the norm group, and by variable effort - as well as " +
        "by a memory difficulty. The report names one of these and has " +
        "measured none of them. The word doing the damage is “indicating”."
    },
    scan: {
      tone: "caution",
      verdict: "That would not settle it.",
      text:
        "An image would say something about tissue. It would not say why this " +
        "score was low on this afternoon, and a normal image would not make " +
        "the score interpretable either."
    },
    nothing: {
      tone: "caution",
      verdict: "The percentile is not in question.",
      text:
        "The score is what it is. What is in question is the second half of " +
        "the sentence: a percentile is a comparison with a norm group, and " +
        "turning it into a statement about memory needs everything the " +
        "battery did not measure."
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

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
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
    referralSelect.value = REFERRALS[0].id;
    syncTaskBoxes();
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    submitFeedback.hidden = true;
    submitError.hidden = true;
    verdict.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the builder.",
    { immediate: true });
})();
