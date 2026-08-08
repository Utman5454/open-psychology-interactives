/* =========================================================================
   Operationalisation Laboratory
   -------------------------------------------------------------------------
   Three fictional constructs, each modelled as five named facets, and six
   candidate operational definitions per construct drawn from four families:
   self-report, behavioural trace, observational and performance-based.

   THE EDUCATIONAL MODEL
   ---------------------
   Each measure carries, for each facet, a coverage level:

       0  does not reach this facet
       1  reaches it partly
       2  reaches it well

   For a selected set of measures the facet level is the MAXIMUM across the
   selection, not the sum. Two measures that both reach a facet partly do not
   add up to reaching it well: they give you two partial views of the same
   thing, which is worth something but is not the same as a good measure of it.

   Coverage is reported as the sum of facet levels over the maximum possible
   (2 x 5 = 10). It is arithmetic on a facet list somebody wrote down, and the
   tool says so on screen. It is NOT a validity coefficient and must never be
   read as one.

   Reactivity for a plan is the HIGHEST reactivity among the selected measures:
   one intrusive measure makes the whole protocol intrusive. Feasibility is the
   LOWEST among them, then reduced one further step for every measure beyond
   two, because burden accumulates.

   Every measure also carries a list of what else it picks up -
   construct-irrelevant variance - written in plain terms.

   WHAT THIS DOES NOT CLAIM
   ------------------------
   The facet lists are teaching simplifications. Which facets a construct has,
   and whether facets are the right model at all, is contested for all three
   constructs here. No published instrument, item or proprietary assessment is
   reproduced; the measures are described generically.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var LEVEL_WORD = ["not reached", "partly reached", "well reached"];
  var RATING_WORD = { 1: "low", 2: "moderate", 3: "high" };

  /* =======================================================================
     Constructs, facets and measures
     ===================================================================== */

  var CONSTRUCTS = {
    engagement: {
      name: "Academic engagement",
      note:
        "Modelled here as five facets. Other accounts use three, or four, or " +
        "argue that engagement is a property of a situation rather than of a " +
        "student.",
      facets: [
        "Behavioural — turning up, taking part, submitting",
        "Cognitive — effort, depth of processing, self-regulation",
        "Emotional — interest, belonging, enthusiasm",
        "Agentic — asking, shaping one's own learning",
        "Persistence — continuing when the work gets hard"
      ],
      measures: [
        {
          id: "attendance",
          name: "Lecture attendance records",
          family: "Behavioural trace",
          cover: [2, 0, 0, 0, 0],
          reactivity: 1,
          feasibility: 3,
          picks: [
            "timetable clashes and part-time work",
            "commuting distance and cost",
            "whether the lecture was recorded, which changes attendance without changing engagement",
            "illness and caring responsibilities"
          ]
        },
        {
          id: "vle",
          name: "Hours logged on the virtual learning environment",
          family: "Behavioural trace",
          cover: [1, 0, 0, 0, 1],
          reactivity: 1,
          feasibility: 3,
          picks: [
            "connection speed and device: slow loading inflates the hours",
            "students who download everything and work offline, who score zero",
            "a tab left open over lunch",
            "how much of the course is hosted there at all"
          ]
        },
        {
          id: "scale",
          name: "Multi-item self-report engagement scale",
          family: "Self-report",
          cover: [1, 2, 2, 1, 1],
          reactivity: 2,
          feasibility: 3,
          picks: [
            "how the student reads the word 'engaged', which differs by background",
            "socially desirable responding, especially if a tutor will see it",
            "mood on the day of completion",
            "acquiescence and extreme-responding styles"
          ]
        },
        {
          id: "observe",
          name: "Observed on-task behaviour in seminars",
          family: "Observational",
          cover: [2, 0, 0, 1, 0],
          reactivity: 3,
          feasibility: 1,
          picks: [
            "the observer's presence, which changes the seminar being observed",
            "the seminar leader's style, which may matter more than the student",
            "who else is in the group that week",
            "what 'on task' was defined as by whoever wrote the coding scheme"
          ]
        },
        {
          id: "task",
          name: "Depth-of-processing task: summarise and elaborate a reading",
          family: "Performance-based",
          cover: [0, 2, 0, 0, 1],
          reactivity: 2,
          feasibility: 2,
          picks: [
            "prior knowledge of the topic",
            "reading speed and writing fluency",
            "whether the student has met this kind of task before",
            "language of instruction"
          ]
        },
        {
          id: "esm",
          name: "Experience sampling during study sessions",
          family: "Self-report",
          cover: [0, 1, 2, 0, 2],
          reactivity: 3,
          feasibility: 1,
          picks: [
            "the prompt itself, which interrupts the state it is asking about",
            "who is willing to be interrupted six times a day - and who drops out",
            "time of day and what else was happening",
            "the phone the student happens to own"
          ]
        }
      ]
    },

    stress: {
      name: "Stress",
      note:
        "Modelled here as five facets. Whether stress is best treated as a " +
        "stimulus, a response, or a transaction between person and situation " +
        "is an old and unresolved argument.",
      facets: [
        "Appraised demand — judging what is being asked of you",
        "Physiological arousal — the body's response",
        "Emotional distress — how it feels",
        "Coping behaviour — what you do about it",
        "Chronicity — how long it has gone on"
      ],
      measures: [
        {
          id: "perceived",
          name: "Self-report perceived stress questionnaire",
          family: "Self-report",
          cover: [2, 0, 2, 1, 1],
          reactivity: 2,
          feasibility: 3,
          picks: [
            "current mood, which colours retrospective judgement",
            "willingness to describe oneself as stressed, which varies by setting and culture",
            "the recall window the questions happen to use",
            "negative affectivity as a stable disposition"
          ]
        },
        {
          id: "cortisol",
          name: "Salivary cortisol sampling",
          family: "Performance-based",
          cover: [0, 2, 0, 0, 1],
          reactivity: 2,
          feasibility: 1,
          picks: [
            "time of day, which dominates the signal",
            "caffeine, nicotine, food and exercise in the previous hour",
            "hormonal contraceptives and several common medications",
            "waking time, which shifts the whole curve"
          ]
        },
        {
          id: "hrv",
          name: "Heart-rate variability from a wearable",
          family: "Behavioural trace",
          cover: [0, 2, 0, 0, 2],
          reactivity: 1,
          feasibility: 2,
          picks: [
            "fitness, age and posture",
            "movement artefacts and poor sensor contact",
            "breathing rate, which the participant can change deliberately",
            "whether the person is asleep"
          ]
        },
        {
          id: "events",
          name: "Life-events checklist",
          family: "Self-report",
          cover: [1, 0, 0, 0, 2],
          reactivity: 1,
          feasibility: 3,
          picks: [
            "how events are remembered and dated, which drifts badly",
            "the assumption that a listed event means the same to everyone",
            "events the list happens to include, and the ones it omits",
            "a bereavement and a house move counted on the same scale"
          ]
        },
        {
          id: "diary",
          name: "Daily diary of demands and responses",
          family: "Self-report",
          cover: [2, 0, 2, 2, 2],
          reactivity: 3,
          feasibility: 1,
          picks: [
            "the act of writing daily, which is itself a coping intervention",
            "who completes 21 consecutive diaries - and who stops after four",
            "entries written in a batch on Sunday night",
            "growing practice at answering the same questions"
          ]
        },
        {
          id: "observer",
          name: "Observer rating of visible tension during a task",
          family: "Observational",
          cover: [0, 1, 1, 1, 0],
          reactivity: 3,
          feasibility: 2,
          picks: [
            "how expressive the person is, which is not how stressed they are",
            "the observer's expectations about who looks stressed",
            "the task chosen, which sets the range of behaviour available",
            "being watched, which is a stressor in its own right"
          ]
        }
      ]
    },

    connection: {
      name: "Social connection",
      note:
        "Modelled here as five facets. Structural accounts count ties; " +
        "subjective accounts ask how connected a person feels; the two " +
        "correlate far less than students expect.",
      facets: [
        "Network size — how many people there are",
        "Contact frequency — how often you are in touch",
        "Felt closeness — how much the ties matter",
        "Perceived support — believing help would be there",
        "Absence of loneliness — not feeling alone"
      ],
      measures: [
        {
          id: "generator",
          name: "Name generator: who do you discuss important matters with?",
          family: "Self-report",
          cover: [2, 0, 1, 1, 0],
          reactivity: 1,
          feasibility: 3,
          picks: [
            "how many names the form has room for",
            "who comes to mind first, which is not who matters most",
            "what counts as an 'important matter' to this person",
            "whether ties are with people the respondent would rather not list"
          ]
        },
        {
          id: "logs",
          name: "Message and call logs from a phone",
          family: "Behavioural trace",
          cover: [1, 2, 0, 0, 0],
          reactivity: 1,
          feasibility: 1,
          picks: [
            "which app the person's friends use",
            "work and delivery messages counted alongside friendships",
            "one long conversation and forty one-word replies scored the same way",
            "serious privacy costs that change who agrees to take part"
          ]
        },
        {
          id: "loneliness",
          name: "Self-report loneliness scale",
          family: "Self-report",
          cover: [0, 0, 1, 1, 2],
          reactivity: 2,
          feasibility: 3,
          picks: [
            "willingness to describe oneself as lonely, which carries stigma",
            "current mood",
            "what the respondent compares themselves with",
            "an item wording that presumes a particular kind of social life"
          ]
        },
        {
          id: "ema",
          name: "Momentary prompts: who are you with right now?",
          family: "Self-report",
          cover: [1, 2, 1, 0, 1],
          reactivity: 3,
          feasibility: 1,
          picks: [
            "the prompt, which arrives in the middle of the interaction it asks about",
            "who agrees to be interrupted, and for how many days",
            "sampling hours, which decide whose social life is visible",
            "co-presence recorded as company, whatever it felt like"
          ]
        },
        {
          id: "societies",
          name: "Number of society and club memberships",
          family: "Behavioural trace",
          cover: [1, 1, 0, 0, 0],
          reactivity: 1,
          feasibility: 3,
          picks: [
            "membership paid for and never used",
            "money and time, which decide who can join anything",
            "societies as the only kind of belonging the institution records",
            "commuting and caring students, who are systematically invisible here"
          ]
        },
        {
          id: "commonroom",
          name: "Observed interaction in a shared common room",
          family: "Observational",
          cover: [0, 1, 1, 0, 0],
          reactivity: 3,
          feasibility: 1,
          picks: [
            "who uses that room, and who never goes there",
            "the observer, who changes the room",
            "the hour and the week of term",
            "talking counted as connection, and sitting quietly with a friend not"
          ]
        }
      ]
    }
  };

  /* =======================================================================
     Small DOM helpers
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

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#operationalise");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var constructSelect = $("#construct-select");
  var constructNote = $("[data-construct-note]");
  var measureList = $("[data-measure-list]");
  var coverageHeading = $("[data-coverage-heading]");
  var coverage = $("[data-coverage]");
  var readout = $("[data-readout]");
  var interpretation = $("[data-interpretation]");
  var verdict = $("[data-verdict]");
  var contamination = $("[data-contamination]");
  var compareTable = $("[data-compare-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var DEFAULT_CONSTRUCT = "engagement";

  function current() { return CONSTRUCTS[constructSelect.value]; }

  function selectedIds() {
    return $$('input[name="measure"]:checked', measureList)
      .map(function (b) { return b.value; });
  }

  function selectedMeasures() {
    var ids = selectedIds();
    return current().measures.filter(function (m) { return ids.indexOf(m.id) !== -1; });
  }

  /* --- Building the measure list ------------------------------------------ */

  function buildMeasureList() {
    clear(measureList);
    current().measures.forEach(function (measure) {
      var wrap = make("div", "measure");
      var label = make("label", "measure__row");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "measure";
      input.value = measure.id;
      label.appendChild(input);
      var name = make("span", "measure__name");
      name.appendChild(make("span", "measure__family", measure.family));
      name.appendChild(document.createTextNode(measure.name));
      label.appendChild(name);
      wrap.appendChild(label);
      measureList.appendChild(wrap);
      input.addEventListener("change", function () {
        render();
        shell.announce(
          (input.checked ? "Added: " : "Removed: ") + measure.name + ". " +
          summarySentence());
      });
    });
  }

  /* --- Model -------------------------------------------------------------- */

  /**
   * Facet levels for a plan: the maximum across selected measures, never the
   * sum. Two partial measures of the same facet do not make a good one.
   */
  function facetLevels(measures) {
    return current().facets.map(function (_, i) {
      return measures.reduce(function (best, m) {
        return Math.max(best, m.cover[i]);
      }, 0);
    });
  }

  function planStats(measures) {
    var levels = facetLevels(measures);
    var total = levels.reduce(function (s, v) { return s + v; }, 0);
    var maximum = current().facets.length * 2;
    var missed = levels.filter(function (v) { return v === 0; }).length;
    var reactivity = measures.reduce(function (worst, m) {
      return Math.max(worst, m.reactivity);
    }, 0);
    // Feasibility is the weakest link, reduced further as burden accumulates.
    var feasibility = measures.length
      ? measures.reduce(function (worst, m) { return Math.min(worst, m.feasibility); }, 3)
      : 0;
    if (measures.length > 2) {
      feasibility = Math.max(1, feasibility - (measures.length - 2));
    }
    return {
      levels: levels,
      total: total,
      maximum: maximum,
      percent: Math.round((total / maximum) * 100),
      missed: missed,
      reactivity: reactivity,
      feasibility: feasibility
    };
  }

  /* --- Rendering ----------------------------------------------------------- */

  function renderCoverage(stats) {
    coverageHeading.textContent =
      "Facet coverage — " + current().name;
    clear(coverage);
    current().facets.forEach(function (facet, i) {
      var level = stats.levels[i];
      var row = make("div", "coverage__row");
      row.setAttribute("data-level", String(level));
      row.appendChild(make("div", "coverage__facet", facet));
      var meter = make("div", "coverage__meter");
      var track = make("span", "coverage__track");
      var fill = make("span", "coverage__fill");
      fill.style.width = (level / 2) * 100 + "%";
      track.appendChild(fill);
      meter.appendChild(track);
      meter.appendChild(make("span", "coverage__word", LEVEL_WORD[level]));
      row.appendChild(meter);
      coverage.appendChild(row);
    });
  }

  function renderReadout(stats, measures) {
    clear(readout);
    [
      ["Facets reached", stats.total + " of " + stats.maximum + " points"],
      ["Facets missed entirely", String(stats.missed)],
      ["Reactivity of the plan", measures.length ? RATING_WORD[stats.reactivity] : "—"],
      ["Feasibility of the plan", measures.length ? RATING_WORD[stats.feasibility] : "—"]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderContamination(measures) {
    clear(contamination);
    if (!measures.length) {
      contamination.appendChild(make("p", "contam__empty",
        "Nothing selected yet. Tick a measure to see what else it records."));
      return;
    }
    measures.forEach(function (measure) {
      var card = make("div", "contam");
      card.appendChild(make("h5", "contam__name",
        measure.name + " also records:"));
      var list = make("ul", "contam__list");
      measure.picks.forEach(function (item) {
        list.appendChild(make("li", null, item));
      });
      card.appendChild(list);
      contamination.appendChild(card);
    });
  }

  function renderCompare() {
    clear(compareTable);
    current().measures.forEach(function (measure) {
      var reached = current().facets.filter(function (_, i) {
        return measure.cover[i] > 0;
      }).map(function (f) { return f.split(" — ")[0]; });
      var row = make("tr");
      var th = make("th", null, measure.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, measure.family));
      row.appendChild(make("td", null, reached.length ? reached.join(", ") : "none"));
      row.appendChild(make("td", null, RATING_WORD[measure.reactivity]));
      row.appendChild(make("td", null, RATING_WORD[measure.feasibility]));
      compareTable.appendChild(row);
    });
  }

  function summarySentence() {
    var measures = selectedMeasures();
    var stats = planStats(measures);
    if (!measures.length) { return "No measure selected."; }
    return measures.length + " measure" + (measures.length === 1 ? "" : "s") +
      ", " + stats.total + " of " + stats.maximum + " coverage points, " +
      stats.missed + " facet" + (stats.missed === 1 ? "" : "s") +
      " not reached at all.";
  }

  function renderInterpretation(stats, measures) {
    var text;
    var tone;
    var families = {};
    measures.forEach(function (m) { families[m.family] = true; });
    var familyCount = Object.keys(families).length;

    if (!measures.length) {
      tone = "caution";
      text =
        "Nothing is selected, so nothing is being measured. Every facet above " +
        "reads 'not reached', which is the honest description of a study with " +
        "no operational definition.";
    } else if (measures.length === 1) {
      var missedNames = current().facets.filter(function (_, i) {
        return stats.levels[i] === 0;
      }).map(function (f) { return f.split(" — ")[0].toLowerCase(); });
      tone = stats.missed >= 3 ? "warn" : "caution";
      text =
        "One measure. It reaches " + stats.total + " of " + stats.maximum +
        " coverage points and leaves " +
        (missedNames.length
          ? missedNames.join(", ") + " untouched"
          : "no facet completely untouched") +
        ". That gap is construct under-representation: a number from this " +
        "study carries no information at all about the parts it misses. The " +
        "list beneath is the other half of the problem.";
    } else if (familyCount === 1) {
      tone = "caution";
      text =
        measures.length + " measures, all from the same family (" +
        measures[0].family.toLowerCase() + "). Coverage is up, at " +
        stats.total + " of " + stats.maximum +
        " points - but measures from one family share the same irrelevant " +
        "influences, so agreement between them is weaker evidence than it " +
        "looks.";
    } else if (stats.missed === 0) {
      tone = stats.feasibility === 1 ? "caution" : "good";
      text =
        measures.length + " measures from " + familyCount +
        " families, reaching every facet at least partly (" + stats.total +
        " of " + stats.maximum + " points). Disagreement between families is " +
        "usually informative rather than a failure. The cost is on screen: " +
        "reactivity " + RATING_WORD[stats.reactivity].toLowerCase() +
        ", feasibility " + RATING_WORD[stats.feasibility].toLowerCase() +
        ". And full coverage of a facet list is still not the construct.";
    } else {
      tone = "caution";
      text =
        measures.length + " measures from " + familyCount + " families, " +
        stats.total + " of " + stats.maximum + " points, with " + stats.missed +
        " facet" + (stats.missed === 1 ? "" : "s") +
        " still not reached at all. Mixing families is the right instinct, " +
        "but the uncovered facets are missing from any claim this study can " +
        "make.";
    }

    interpretation.textContent = text;
    verdict.setAttribute("data-tone", tone);
  }

  function render() {
    var measures = selectedMeasures();
    var stats = planStats(measures);
    renderCoverage(stats);
    renderReadout(stats, measures);
    renderInterpretation(stats, measures);
    renderContamination(measures);
    renderCompare();
  }

  /* --- Construct switching -------------------------------------------------- */

  function loadConstruct() {
    constructNote.textContent = current().note;
    buildMeasureList();
    render();
  }

  constructSelect.addEventListener("change", function () {
    loadConstruct();
    shell.announce(current().name + " loaded. No measures selected.",
      { immediate: true });
  });

  /* --- Buttons --------------------------------------------------------------- */

  /* A defensible plan per construct: measures from more than one family, every
     facet reached at least partly, and feasibility no worse than moderate.
     Deliberately NOT the maximum-coverage plan — the point is that the best
     affordable plan and the most complete plan are different objects. */
  var WORKED = {
    engagement: ["attendance", "scale"],
    stress: ["perceived", "hrv"],
    connection: ["generator", "loneliness", "societies"]
  };

  $('[data-action="worked"]').addEventListener("click", function () {
    var wanted = WORKED[constructSelect.value];
    $$('input[name="measure"]', measureList).forEach(function (b) {
      b.checked = wanted.indexOf(b.value) !== -1;
    });
    render();
    shell.announce(
      "A defensible plan loaded: measures from more than one family, so that " +
      "no single family's irrelevant influences run through the whole study, " +
      "and every facet reached at least partly. It is not the " +
      "maximum-coverage plan. " + summarySentence(), { immediate: true });
  });

  $('[data-action="everything"]').addEventListener("click", function () {
    $$('input[name="measure"]', measureList).forEach(function (b) { b.checked = true; });
    render();
    shell.announce(
      "All six measures selected. Coverage is at its maximum and so is " +
      "reactivity; feasibility is at its minimum. " + summarySentence(),
      { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    selfreport: {
      tone: "caution",
      verdict: "The broadest single measure, and still not close.",
      text:
        "A multi-item scale does reach more facets than anything else here. " +
        "What it cannot do is tell you what a student actually did, and " +
        "everything it records passes through one filter: how that person " +
        "reads the questions, on that day."
    },
    attendance: {
      tone: "warn",
      verdict: "Cheap, objective, and about one facet only.",
      text:
        "Attendance is a real behavioural signal and it is easy to collect. It " +
        "says nothing about whether anyone thought about the lecture, cared " +
        "about it, asked anything, or persisted afterwards - and it also " +
        "records commuting distance, timetable clashes and whether the session " +
        "was recorded."
    },
    observation: {
      tone: "caution",
      verdict: "The closest to the behaviour, and the most disturbed by looking.",
      text:
        "Observation gets nearest to what actually happens in the room. It is " +
        "also the most reactive measure here - the observer changes the " +
        "seminar - and the least feasible, and it still reaches only two of " +
        "the five facets."
    },
    vle: {
      tone: "warn",
      verdict: "The one most often used, and the weakest.",
      text:
        "Logged hours are convenient because the system records them anyway. " +
        "They confuse time with effort, score a student who downloads " +
        "everything and works offline at zero, and rise when a tab is left " +
        "open at lunch."
    },
    none: {
      tone: "good",
      verdict: "Yes, and that is the whole tool.",
      text:
        "No operational definition is the construct. Each reaches part of it " +
        "and brings something irrelevant along. The question is not which " +
        "measure is right, but what a measure would let you claim."
    }
  };

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
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLab() {
    labSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Laboratory unlocked. Nothing selected yet.", { immediate: true });
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
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* --- Challenge -------------------------------------------------------------- */

  var CHALLENGE_NOTES = {
    loggedin: {
      defensible: true,
      text:
        "Defensible, and it is very nearly all that has been shown. The number " +
        "went up; that is a fact about logged hours."
    },
    engaged: {
      defensible: false,
      text:
        "Not defensible. The claim substitutes the construct for the measure. " +
        "Logged hours reach one facet of engagement partly and four not at all, " +
        "so a 40% rise in hours is consistent with no change in cognitive, " +
        "emotional or agentic engagement whatsoever."
    },
    contamination: {
      defensible: true,
      text:
        "Defensible, and the sharpest point available. The intervention is " +
        "delivered through the same system that produces the outcome measure. " +
        "Adding a compulsory weekly online activity raises logged hours by " +
        "construction, whatever it does to engagement. The design cannot " +
        "distinguish the effect from the artefact."
    },
    cognitive: {
      defensible: true,
      text:
        "Defensible. Time on a system is not depth of processing. A student " +
        "who reads carefully for 20 minutes and one who leaves the page open " +
        "for two hours are scored in the wrong order."
    },
    second: {
      defensible: true,
      text:
        "Defensible - with a condition. A second measure helps only if it is " +
        "from a different family and is not itself acted on by the " +
        "intervention. Another trace from the same system would not help; a " +
        "depth-of-processing task or a self-report would."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one statement.",
        "Four of the five can be defended.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !CHALLENGE_NOTES[v].defensible; });
    var rightMissed = Object.keys(CHALLENGE_NOTES).filter(function (v) {
      return CHALLENGE_NOTES[v].defensible && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "warn" : rightMissed.length ? "caution" : "good";
    var verdictText = wrongPicked.length
      ? "One of these swaps the measure for the construct."
      : rightMissed.length
        ? "Everything you chose stands; there is more that does."
        : "Yes — all four defensible statements, and not the one that fails.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    challengeFeedback.appendChild(lead);

    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var note = CHALLENGE_NOTES[value];
      var picked = chosen.indexOf(value) !== -1;
      var li = make("li");
      li.appendChild(make("strong", null,
        picked ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(note.text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ------------------------------------------------------------------- */

  shell.onReset(function () {
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    constructSelect.value = DEFAULT_CONSTRUCT;
    loadConstruct();
  });

  /* --- Start-up ----------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the laboratory.",
    { immediate: true });
})();
