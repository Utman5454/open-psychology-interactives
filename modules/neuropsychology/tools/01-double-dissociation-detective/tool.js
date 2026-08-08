/* =========================================================================
   Double Dissociation Detective
   -------------------------------------------------------------------------
   Six fictional case files. Each file gives one or two people, two tasks, a
   fictional control group for each task, and a verdict to reach: not enough
   evidence, a general severity difference, a single dissociation, a double
   dissociation, or a crossover confounded by the tasks themselves.

   THE EDUCATIONAL MODEL
   ---------------------
   Raw percentages on two different tasks are not comparable, so every score
   is referenced to its own control group:

       z = (score - controlMean) / controlSd

   Test length decides precision. A score of p correct out of n items has a
   binomial standard error

       SE(p) = sqrt(p(1 - p) / n)

   which in control-referenced units is SE(p) / controlSd. The difference
   between a person's two control-referenced scores therefore has

       SE(dz) = sqrt(SEz(a)^2 + SEz(b)^2)

   and the difference counts as resolvable when |dz| > 1.96 * SE(dz).

   Classification then follows the logic of the inference rather than the size
   of the gap:

       no resolvable difference in anybody     -> not enough evidence
       exactly one resolvable difference       -> single dissociation
       two, same direction                     -> general severity difference
       two, opposite directions                -> double dissociation
       two, opposite, case flagged as impure   -> confounded crossover

   The last line is the one the numbers cannot reach on their own. Whether two
   tasks differ in more than the process of interest is a judgement about the
   case notes and the task-demands table, which is why case 6 carries a flag
   the arithmetic knows nothing about.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   * The observed proportion is held fixed while test length varies, so the
     slider isolates precision. In reality a longer test changes the estimate
     as well as its interval.
   * Control mean and standard deviation are treated as known exactly.
     Single-case comparison properly uses a modified t test that allows for a
     finite control sample and gives wider intervals than these.
   * A binomial standard error assumes items are independent and equally
     difficult, which no real task satisfies.
   * Every number, task, control group and case note is invented for teaching.
     None is a norm, a prevalence or a published value.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CRIT = 1.96;          /* 95% two-tailed normal critical value */
  var TYPICAL_LIMIT = 1.65; /* edge of the shaded "control range" band */

  /* =======================================================================
     The case files - all fictional
     ===================================================================== */

  var CASES = [
    {
      title: "One person, two tasks",
      brief:
        "Person A, tested on two tasks that use the same everyday objects. " +
        "Read each score against its own control group before you decide.",
      items: 40,
      precision: false,
      impure: false,
      tasks: [
        {
          key: "a",
          name: "Naming pictures of everyday objects",
          short: "Naming pictures",
          mean: 0.94, sd: 0.08,
          input: "Line drawings, one at a time",
          response: "Says the object's name aloud",
          also: "Recognising the drawing, retrieving the word, producing the word"
        },
        {
          key: "b",
          name: "Matching a spoken word to one of four pictures",
          short: "Word to picture",
          mean: 0.96, sd: 0.05,
          input: "One spoken word with four drawings on the page",
          response: "Points to one drawing",
          also: "Hearing the word, recognising four drawings, comparing options"
        }
      ],
      people: [{ label: "Person A", scores: { a: 0.48, b: 0.91 } }],
      notes:
        "Person A is 67 and was tested five months after a stroke. Both tasks " +
        "were completed in one 40-minute session with a break in the middle. " +
        "She reported no difficulty hearing the spoken words, and her failures " +
        "on the naming task were mostly of the form \"I know what it is, I " +
        "just cannot get the word\".",
      commentary:
        "A single dissociation, and worth having: the two tasks come apart, " +
        "so naming a picture is not simply comprehending it plus speaking. " +
        "What it cannot rule out is that naming is the more demanding task. " +
        "One person never settles that, however large the gap."
    },

    {
      title: "Two people, same shape",
      brief:
        "Person A and Person B, tested on the same two memory tasks with the " +
        "same items. Person B is more impaired overall.",
      items: 40,
      precision: false,
      impure: false,
      tasks: [
        {
          key: "a",
          name: "Recalling a short list of words straight away",
          short: "Immediate recall",
          mean: 0.86, sd: 0.11,
          input: "Twelve spoken words",
          response: "Says back as many as possible at once",
          also: "Hearing, holding a short list, speaking"
        },
        {
          key: "b",
          name: "Recalling the same list after twenty minutes",
          short: "Delayed recall",
          mean: 0.82, sd: 0.12,
          input: "No new material; the list from earlier",
          response: "Says back as many as possible",
          also: "Everything the immediate task needs, plus retention over a delay"
        }
      ],
      people: [
        { label: "Person A", scores: { a: 0.70, b: 0.36 } },
        { label: "Person B", scores: { a: 0.58, b: 0.20 } }
      ],
      notes:
        "Both were tested about six months after a first stroke. Person B was " +
        "in hospital for considerably longer and was described by the ward " +
        "team as tiring quickly. Both completed 40 items on each task in a " +
        "single session.",
      commentary:
        "Two resolvable differences, both the same way round: further below " +
        "controls on delayed recall than on immediate recall. One graded " +
        "impairment produces that, and so would two separate deficits. The " +
        "second person adds severity, not logic. Only a reversal adds logic."
    },

    {
      title: "Two people, opposite shapes",
      brief:
        "Person A and Person B, the same two tasks, the same 40 items, the " +
        "same testing session length.",
      items: 40,
      precision: false,
      impure: false,
      tasks: [
        {
          key: "a",
          name: "Naming familiar objects from pictures",
          short: "Naming objects",
          mean: 0.93, sd: 0.07,
          input: "Line drawings, one at a time",
          response: "Says the object's name aloud",
          also: "Recognising the drawing, retrieving and producing the word"
        },
        {
          key: "b",
          name: "Copying a shown design with coloured blocks",
          short: "Block design",
          mean: 0.84, sd: 0.12,
          input: "A printed design and a set of blocks",
          response: "Arranges the blocks by hand",
          also: "Seeing the design, breaking it into parts, planning, hand movement"
        }
      ],
      people: [
        { label: "Person A", scores: { a: 0.45, b: 0.80 } },
        { label: "Person B", scores: { a: 0.90, b: 0.30 } }
      ],
      notes:
        "Person A is 58 and Person B is 62. Both were tested seven to nine " +
        "months after a first stroke, both in the morning, both with the same " +
        "examiner. Neither reported difficulty seeing the material or moving " +
        "the hand they used.",
      commentary:
        "This is the crossover. Neither task can be \"the harder one\", " +
        "because a task cannot be more demanding for one person and less " +
        "demanding for another simply by being more demanding. That single " +
        "piece of logic is the whole contribution of a double dissociation, " +
        "and it is a real one: these two tasks draw on at least partly " +
        "separable processing. Where that processing sits is a different " +
        "question, and this file does not touch it."
    },

    {
      title: "A 58-point gap",
      brief:
        "Person A scores 88% on one task and 30% on the other. Before you " +
        "decide, look at what the control groups scored.",
      items: 40,
      precision: false,
      impure: false,
      tasks: [
        {
          key: "a",
          name: "Recognising which of two faces was seen before",
          short: "Face recognition",
          mean: 0.95, sd: 0.05,
          input: "Two photographs of unfamiliar faces",
          response: "Points to the one seen earlier",
          also: "Seeing detail, holding a face in mind, choosing between two"
        },
        {
          key: "b",
          name: "Recalling which words were paired with which",
          short: "Word pairs",
          mean: 0.52, sd: 0.18,
          input: "Twenty pairs of unrelated words, then one word of each pair",
          response: "Says the word that went with it",
          also: "Hearing, forming a new association, retrieving it to a cue"
        }
      ],
      people: [{ label: "Person A", scores: { a: 0.88, b: 0.30 } }],
      notes:
        "Person A is 44 and was tested four months after a head injury. The " +
        "word-pair task was administered at the end of a two-hour session; the " +
        "face task was the second thing she did that morning. She described " +
        "the word pairs as \"impossible - nobody could do that\".",
      commentary:
        "The largest raw gap on this page, and not a dissociation at all. " +
        "Controls average 52% on the word pairs and 95% on the faces, so the " +
        "two percentages are readings from different rulers. Against their own " +
        "controls the two scores sit within a fifth of a control SD of each " +
        "other, and this person's remark about the task being impossible was, " +
        "for once, close to accurate."
    },

    {
      title: "The same scores, a longer test",
      brief:
        "Two people, two rhyme-judgement tasks, and a slider for how many " +
        "items each task contained. The percentages do not move.",
      items: 40,
      precision: true,
      impure: false,
      tasks: [
        {
          key: "a",
          name: "Deciding whether two spoken words rhyme",
          short: "Spoken rhyme",
          mean: 0.90, sd: 0.10,
          input: "Two words read aloud by the examiner",
          response: "Says yes or no",
          also: "Hearing, holding two words, comparing their sounds"
        },
        {
          key: "b",
          name: "Deciding whether two written words rhyme",
          short: "Written rhyme",
          mean: 0.89, sd: 0.10,
          input: "Two words printed on a card",
          response: "Says yes or no",
          also: "Seeing, converting letters to sounds, comparing their sounds"
        }
      ],
      people: [
        { label: "Person A", scores: { a: 0.79, b: 0.61 } },
        { label: "Person B", scores: { a: 0.63, b: 0.80 } }
      ],
      notes:
        "Both were tested about a year after a stroke, both were fluent " +
        "readers before it, and both wear their usual glasses. The published " +
        "version of this fictional study used 40 items per task. The slider " +
        "asks what would have been claimable if it had used more.",
      commentary:
        "Nothing about these two people changes as you move the slider; only " +
        "the precision of the estimates does. At 40 items the crossover is in " +
        "the point estimates and not in the evidence. Around 50 items one " +
        "difference becomes resolvable, and from about 55 both do - the same " +
        "four scores, now a double dissociation. Test length decides what you " +
        "are entitled to claim."
    },

    {
      title: "A crossover with a problem",
      brief:
        "A clean reversal, well outside measurement error. Read the case notes " +
        "and the task demands before you commit.",
      items: 40,
      precision: false,
      impure: true,
      tasks: [
        {
          key: "a",
          name: "Identifying objects shown as photographs",
          short: "Objects by sight",
          mean: 0.95, sd: 0.06,
          input: "Colour photographs; small objects, fine detail matters",
          response: "Says the object's name aloud",
          also: "Sharp vision, recognising the object, retrieving the word"
        },
        {
          key: "b",
          name: "Identifying objects held in the hands, out of sight",
          short: "Objects by touch",
          mean: 0.88, sd: 0.10,
          input: "Real objects handled behind a screen; touch only",
          response: "Says the object's name aloud",
          also: "Sensation in the fingertips, exploratory hand movement, recognising the object, retrieving the word"
        }
      ],
      people: [
        { label: "Person A", scores: { a: 0.90, b: 0.35 } },
        { label: "Person B", scores: { a: 0.55, b: 0.82 } }
      ],
      notes:
        "Person A is 61 and was tested nine months after a stroke; she has had " +
        "reduced sensation in both hands since a neck injury in her forties. " +
        "Person B is 58 and was tested seven months after a stroke; he has a " +
        "long-standing eye condition, reads only large print, and his acuity " +
        "with glasses is well below the range of the control group. Both " +
        "completed 40 items on each task with the same examiner.",
      commentary:
        "The crossover is real and well outside measurement error, and it " +
        "still does not separate visual from tactile object recognition. One " +
        "person cannot feel the objects properly; the other cannot see the " +
        "photographs properly. A crossover isolates the process you had in " +
        "mind only when nothing else that differs between the tasks could " +
        "produce the same reversal, and here something obviously could."
    }
  ];

  /* =======================================================================
     The inference
     ===================================================================== */

  function zOf(score, task) {
    return (score - task.mean) / task.sd;
  }

  /** Binomial standard error of the proportion, in control-SD units. */
  function seZ(score, items, task) {
    return Math.sqrt((score * (1 - score)) / items) / task.sd;
  }

  /**
   * Everything the display and the classifier need for one case at one test
   * length. Kept in one place so the chart, the table and the verdict can
   * never disagree with each other.
   */
  function analyse(caseDef, items) {
    var taskA = caseDef.tasks[0];
    var taskB = caseDef.tasks[1];

    var people = caseDef.people.map(function (person) {
      var rows = caseDef.tasks.map(function (task) {
        var score = person.scores[task.key];
        var z = zOf(score, task);
        var se = seZ(score, items, task);
        return {
          task: task,
          score: score,
          correct: Math.round(score * items),
          z: z,
          se: se,
          low: z - CRIT * se,
          high: z + CRIT * se,
          clearlyBelow: z + CRIT * se < -TYPICAL_LIMIT
        };
      });

      var dz = zOf(person.scores[taskA.key], taskA) - zOf(person.scores[taskB.key], taskB);
      var seDiff = Math.sqrt(
        Math.pow(seZ(person.scores[taskA.key], items, taskA), 2) +
        Math.pow(seZ(person.scores[taskB.key], items, taskB), 2)
      );

      return {
        label: person.label,
        rows: rows,
        dz: dz,
        seDiff: seDiff,
        resolvable: Math.abs(dz) > CRIT * seDiff,
        /* Negative dz means the person stands further below controls on the
           first task; positive means further below on the second. */
        worseOn: dz < 0 ? taskA : taskB
      };
    });

    var resolved = people.filter(function (p) { return p.resolvable; });
    var verdict;

    if (resolved.length === 0) {
      verdict = "insufficient";
    } else if (resolved.length === 1) {
      verdict = "single";
    } else {
      var signs = resolved.map(function (p) { return p.dz > 0 ? 1 : -1; });
      var mixed = signs.some(function (s) { return s !== signs[0]; });
      verdict = mixed ? (caseDef.impure ? "confounded" : "double") : "severity";
    }

    return {
      caseDef: caseDef,
      items: items,
      people: people,
      resolved: resolved,
      verdict: verdict,
      /* The smallest control-referenced difference this test length could
         resolve, averaged across the people in the file. Used as a readout. */
      resolvableAt: people.reduce(function (sum, p) {
        return sum + CRIT * p.seDiff;
      }, 0) / people.length
    };
  }

  /* =======================================================================
     Wording
     ===================================================================== */

  var VERDICT_NAME = {
    insufficient: "Not enough evidence to say",
    severity: "A general severity difference",
    single: "A single dissociation",
    double: "A double dissociation",
    confounded: "A crossover the tasks cannot support"
  };

  /** One sentence stating what the arithmetic found, built from the numbers. */
  function statement(result) {
    var items = result.items;
    var parts = result.people.map(function (p) {
      if (!p.resolvable) {
        return p.label + "'s two scores differ by " + fmt(Math.abs(p.dz), 2) +
          " control SDs, inside the " + fmt(CRIT * p.seDiff, 2) +
          " that " + items + " items can resolve";
      }
      return p.label + " is " + fmt(Math.abs(p.dz), 2) +
        " control SDs further below on " + p.worseOn.short.toLowerCase() +
        ", against " + fmt(CRIT * p.seDiff, 2) + " needed to resolve";
    });
    return parts.join("; ") + ".";
  }

  /** Why the answer the learner gave does not fit what the numbers show. */
  function whyNot(chosen, result) {
    var n = result.people.length;
    var resolvedCount = result.resolved.length;

    if (chosen === "insufficient") {
      return "You called it unresolvable, but " + resolvedCount + " of the " + n +
        " within-person differences here is larger than what " + result.items +
        " items can resolve, so at least that much is claimable.";
    }
    if (chosen === "severity") {
      if (result.verdict === "double" || result.verdict === "confounded") {
        return "A severity difference means both people are further below " +
          "controls on the same task. Here they are worse on different tasks, " +
          "which is the one pattern a shared graded impairment cannot produce.";
      }
      if (n === 1) {
        return "A severity difference is a comparison between two people, and " +
          "this file contains one.";
      }
      return "A severity difference needs two resolvable differences in the " +
        "same direction. That is not what these numbers give.";
    }
    if (chosen === "single") {
      if (result.verdict === "insufficient") {
        return "A single dissociation needs one difference that is bigger than " +
          "its own interval. At " + result.items + " items, none here is.";
      }
      if (result.verdict === "double" || result.verdict === "confounded") {
        return "There are two resolvable differences here, in opposite " +
          "directions - which is more than a single dissociation, and buys " +
          "more than one.";
      }
      return "Both people show a resolvable difference, so this is not a " +
        "single case standing on its own.";
    }
    if (chosen === "double") {
      if (result.verdict === "insufficient") {
        return "A crossover in the point estimates is not a crossover in the " +
          "evidence. At " + result.items + " items neither difference is larger " +
          "than its own interval.";
      }
      if (result.verdict === "severity") {
        return "Both people are further below controls on the same task. " +
          "Without a reversal, \"that task is simply more demanding\" survives " +
          "as an explanation, which is precisely what a double dissociation is " +
          "for ruling out.";
      }
      if (result.verdict === "single") {
        return n === 1
          ? "A double dissociation needs two people going opposite ways. This " +
            "file has one person, so it cannot deliver one however large the gap is."
          : "Only one of the two differences is resolvable at this test length, " +
            "so only one half of the crossover is actually evidence.";
      }
      if (result.verdict === "confounded") {
        return "The crossover itself is not in doubt - the numbers are as you " +
          "read them. The problem is what the two tasks differ in besides the " +
          "process you wanted to isolate.";
      }
    }
    if (chosen === "confounded") {
      if (result.verdict === "double") {
        return "Worth being suspicious, and here it does not land: the tasks " +
          "were matched on items and session length, and the case notes record " +
          "no sensory or motor difference that could produce the reversal. " +
          "Impurity has to be argued from the case, not assumed.";
      }
      return "There is no resolvable crossover here to be confounded in the " +
        "first place.";
    }
    return "";
  }

  /* =======================================================================
     Small helpers
     ===================================================================== */

  function fmt(v, places) {
    return (v === null || v === undefined || isNaN(v))
      ? "-" : v.toFixed(places === undefined ? 2 : places);
  }

  function signed(v, places) {
    return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(places === undefined ? 1 : places);
  }

  function pct(v) { return Math.round(v * 100) + "%"; }

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

  var shell = InteractiveShell.attach("#detective");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var caseSelect = $("[data-case-select]");
  var itemsRange = $("#items-range");
  var precisionBlock = $("[data-precision-block]");
  var profileChart = $("[data-profile]");
  var scoreTable = $("[data-score-table]");
  var demandsTable = $("[data-demands-table]");
  var demandsDetails = $("[data-demands-details]");
  var notesBody = $("[data-notes-body]");
  var caseTitle = $("[data-case-title]");
  var caseBrief = $("[data-case-brief]");
  var verdictFeedback = $("[data-verdict-feedback]");
  var track = $("[data-track]");
  var nextButton = $('[data-action="next-case"]');
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var casesSection = $("#cases-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = { index: 0, items: 40, answered: [] };

  /* --- The case selector, built once ------------------------------------ */

  CASES.forEach(function (caseDef, index) {
    var option = make("option", null, "Case " + (index + 1) + " - " + caseDef.title);
    option.value = String(index);
    caseSelect.appendChild(option);

    var item = make("li");
    item.appendChild(make("span", null, String(index + 1)));
    item.appendChild(document.createTextNode(" " + caseDef.title));
    track.appendChild(item);
  });

  caseSelect.addEventListener("change", function () {
    goToCase(Number(caseSelect.value));
  });

  nextButton.addEventListener("click", function () {
    if (state.index < CASES.length - 1) {
      goToCase(state.index + 1);
      caseSelect.focus();
    }
  });

  shell.bindRange(itemsRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " items per task"; },
    onInput: function (v) {
      state.items = v;
      verdictFeedback.hidden = true;
      render();
      shell.announce(
        "Test length now " + v + " items per task. The intervals have " +
        "changed - return a verdict again."
      );
    }
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitVerdict();
  });

  /* --- Navigation ------------------------------------------------------- */

  function goToCase(index) {
    state.index = index;
    caseSelect.value = String(index);
    state.items = CASES[index].items;
    itemsRange.value = String(state.items);
    verdictFeedback.hidden = true;
    controlsForm.querySelectorAll('input[name="verdict"]').forEach(function (input) {
      input.checked = false;
    });
    render();
    shell.announce(
      "Case " + (index + 1) + " of " + CASES.length + ": " + CASES[index].title + ".",
      { immediate: true }
    );
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var caseDef = CASES[state.index];
    var result = analyse(caseDef, state.items);

    caseTitle.textContent = "Case " + (state.index + 1) + " - " + caseDef.title;
    caseBrief.textContent = caseDef.brief;
    notesBody.textContent = caseDef.notes;

    precisionBlock.hidden = !caseDef.precision;
    demandsDetails.open = false;

    renderTrack();
    renderChart(result);
    renderScoreTable(result);
    renderDemands(caseDef);

    nextButton.disabled = state.index >= CASES.length - 1;
    nextButton.textContent = nextButton.disabled ? "Last case" : "Next case";
  }

  function renderTrack() {
    Array.prototype.forEach.call(track.children, function (item, index) {
      item.removeAttribute("aria-current");
      item.removeAttribute("data-state");
      if (state.answered[index]) { item.setAttribute("data-state", "done"); }
      if (index === state.index) { item.setAttribute("aria-current", "step"); }
    });
  }

  /* Horizontal interval plot: one row per person-task, the control average at
     zero, and a shaded band for the usual control range. Point markers are
     filled when the whole interval sits below the band and hollow otherwise,
     so the distinction survives greyscale; every value is also printed. */
  function renderChart(result) {
    var LEFT = 140;          /* right edge of the row labels */
    var AXIS_START = 148;
    var AXIS_END = 396;
    var Z_MIN = -10;
    var Z_MAX = 2;
    var ROW = 30;
    var HEAD = 20;
    var TOP = 10;

    function xOf(z) {
      var clamped = Math.max(Z_MIN, Math.min(Z_MAX, z));
      return AXIS_START + ((clamped - Z_MIN) / (Z_MAX - Z_MIN)) * (AXIS_END - AXIS_START);
    }

    var height = TOP;
    result.people.forEach(function (person) {
      height += HEAD + person.rows.length * ROW + 6;
    });
    var axisY = height + 6;
    var total = axisY + 30;

    clear(profileChart);
    profileChart.setAttribute("viewBox", "0 0 470 " + total);

    /* The band of scores a control group would usually produce. */
    profileChart.appendChild(svgEl("rect", {
      x: xOf(-TYPICAL_LIMIT), y: TOP - 4,
      width: xOf(TYPICAL_LIMIT) - xOf(-TYPICAL_LIMIT),
      height: axisY - TOP + 4,
      class: "dd__band"
    }));

    profileChart.appendChild(svgEl("line", {
      x1: xOf(0), y1: TOP - 4, x2: xOf(0), y2: axisY, class: "dd__zero"
    }));

    var y = TOP;
    result.people.forEach(function (person) {
      profileChart.appendChild(
        svgText(0, y + 12, "chart__label dd__person", "start", person.label));
      y += HEAD;

      person.rows.forEach(function (row) {
        var mid = y + ROW / 2;

        profileChart.appendChild(
          svgText(LEFT, mid + 4, "chart__count", "end", row.task.short));

        profileChart.appendChild(svgEl("line", {
          x1: xOf(row.low), y1: mid, x2: xOf(row.high), y2: mid, class: "dd__interval"
        }));
        [row.low, row.high].forEach(function (end) {
          profileChart.appendChild(svgEl("line", {
            x1: xOf(end), y1: mid - 5, x2: xOf(end), y2: mid + 5, class: "dd__interval"
          }));
        });

        profileChart.appendChild(svgEl("circle", {
          cx: xOf(row.z), cy: mid, r: 5.5,
          class: "dd__point" + (row.clearlyBelow ? " dd__point--below" : "")
        }));

        profileChart.appendChild(
          svgText(AXIS_END + 8, mid + 4, "chart__count", "start", signed(row.z, 1)));

        y += ROW;
      });
      y += 6;
    });

    profileChart.appendChild(svgEl("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "chart__baseline"
    }));

    [-9, -6, -3, 0].forEach(function (tick) {
      profileChart.appendChild(svgEl("line", {
        x1: xOf(tick), y1: axisY, x2: xOf(tick), y2: axisY + 4, class: "chart__baseline"
      }));
      profileChart.appendChild(
        svgText(xOf(tick), axisY + 16, "chart__axis", "middle",
          tick === 0 ? "0" : String(tick)));
    });

    profileChart.appendChild(
      svgText(xOf(0), axisY + 28, "chart__axis", "middle", "control average"));
    profileChart.appendChild(
      svgText(0, axisY + 16, "chart__axis", "start", "control SDs"));
  }

  function renderScoreTable(result) {
    clear(scoreTable);
    result.people.forEach(function (person) {
      person.rows.forEach(function (row, rowIndex) {
        var tr = make("tr");

        var th = make("th", null, rowIndex === 0 ? person.label : "");
        th.setAttribute("scope", "row");
        if (rowIndex === 0) {
          th.setAttribute("rowspan", String(person.rows.length));
          tr.appendChild(th);
        }

        tr.appendChild(make("td", null, row.task.name));
        tr.appendChild(make("td", null,
          row.correct + " of " + result.items + " (" + pct(row.score) + ")"));
        tr.appendChild(make("td", null,
          pct(row.task.mean) + " (SD " + Math.round(row.task.sd * 100) + ")"));
        tr.appendChild(make("td", null,
          signed(row.z, 1) + " SD" +
          (row.clearlyBelow ? " - clearly below the control range" : " - within reach of the control range")));
        tr.appendChild(make("td", null, signed(row.low, 1) + " to " + signed(row.high, 1)));

        scoreTable.appendChild(tr);
      });

      var summary = make("tr", "dd__summary");
      var label = make("th", null, person.label + ": difference between the two tasks");
      label.setAttribute("scope", "row");
      label.setAttribute("colspan", "4");
      summary.appendChild(label);
      summary.appendChild(make("td", null, fmt(Math.abs(person.dz), 2) + " SD"));
      summary.appendChild(make("td", null,
        person.resolvable
          ? "resolvable (needs " + fmt(CRIT * person.seDiff, 2) + ")"
          : "not resolvable (needs " + fmt(CRIT * person.seDiff, 2) + ")"));
      scoreTable.appendChild(summary);
    });
  }

  function renderDemands(caseDef) {
    clear(demandsTable);
    caseDef.tasks.forEach(function (task) {
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, task.input));
      tr.appendChild(make("td", null, task.response));
      tr.appendChild(make("td", null, task.also));
      demandsTable.appendChild(tr);
    });
  }

  /* --- Verdicts --------------------------------------------------------- */

  function submitVerdict() {
    var chosen = $('input[name="verdict"]:checked', controlsForm);
    if (!chosen) {
      showFeedback(verdictFeedback, "caution", "Choose a verdict first.", "");
      shell.announce("No verdict chosen yet.", { immediate: true });
      return;
    }

    var caseDef = CASES[state.index];
    var result = analyse(caseDef, state.items);
    var right = chosen.value === result.verdict;

    var body = document.createDocumentFragment();

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right ? "Yes - " + VERDICT_NAME[result.verdict] + "." : "Not quite."));
    lead.appendChild(document.createTextNode(" " + statement(result)));
    body.appendChild(lead);

    if (!right) {
      var correction = make("p");
      correction.appendChild(make("strong", null,
        "On these numbers this is: " + VERDICT_NAME[result.verdict] + ". "));
      correction.appendChild(document.createTextNode(whyNot(chosen.value, result)));
      body.appendChild(correction);
    }

    body.appendChild(make("p", null, caseDef.commentary));

    if (result.verdict === "confounded" || caseDef.impure) {
      var pointer = make("p", "text-muted",
        "The arithmetic cannot see this. Only the case notes and the " +
        "task-demands table can.");
      body.appendChild(pointer);
      demandsDetails.open = true;
    }

    clear(verdictFeedback);
    verdictFeedback.setAttribute("data-tone", right ? "good" : "caution");
    verdictFeedback.appendChild(body);
    verdictFeedback.hidden = false;

    state.answered[state.index] = true;
    renderTrack();

    shell.announce(
      (right ? "Correct. " : "Not quite. ") +
      "On these numbers, case " + (state.index + 1) + " is " +
      VERDICT_NAME[result.verdict].toLowerCase() + ".",
      { immediate: true });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    separable: {
      tone: "caution",
      verdict: "That is the step to be careful about.",
      text:
        "The natural reading, and one step further than the evidence goes. " +
        "The failed task may simply be the more demanding one. Case 3 below " +
        "is what it takes to rule that out."
    },
    harder: {
      tone: "caution",
      verdict: "Possible, and not established either.",
      text:
        "Task difficulty is the rival a single case cannot exclude - but it " +
        "is a rival, not the answer. Both readings survive. What decides " +
        "between them is a second person showing the reverse pattern."
    },
    open: {
      tone: "good",
      verdict: "Yes.",
      text:
        "It puts a difference on the table and leaves at least two " +
        "explanations alive: separable processes, or one task making more of " +
        "the same demand. The six files below take the alternatives apart one " +
        "at a time."
    },
    nothing: {
      tone: "caution",
      verdict: "Too strong the other way.",
      text:
        "A person who can do A but not B shows that A does not require " +
        "everything B requires, which rules some models out. The limit is " +
        "narrower than \"nothing\": one person cannot separate a functional " +
        "difference from a difficulty difference."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the case files.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockCases();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockCases();
  });

  function unlockCases() {
    lockForm(openingForm);
    casesSection.hidden = false;
    goToCase(0);
    $("#cases-heading").focus();
    shell.announce("Case files open. Case 1 of " + CASES.length + ".",
      { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    regions: {
      tone: "caution",
      verdict: "That is the sentence to push back on.",
      text:
        "The crossover is evidence about tasks, not about tissue. It supports " +
        "at least partly separable processing; it says nothing about whether " +
        "that processing sits in one region, spreads over a network, or uses " +
        "the same tissue in two ways. Damage to a single undivided system " +
        "produces crossovers too."
    },
    separable: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Separable processing, anatomy open. The crossover rules out the one " +
        "rival a single case cannot - that one task is simply more demanding - " +
        "and stops there. Anatomy needs lesion information, imaging and many " +
        "more cases, and even then it constrains models rather than proving one."
    },
    difficulty: {
      tone: "caution",
      verdict: "Not what it shows.",
      text:
        "It establishes that a difficulty difference cannot be the whole " +
        "story, which is a different claim. The two tasks may well differ in " +
        "difficulty; what they cannot do is make each of them the harder one " +
        "for a different person."
    },
    nothing: {
      tone: "caution",
      verdict: "Too strong.",
      text:
        "Two cases are thin evidence for anything general. But the crossover " +
        "removes an explanation that no number of extra single cases could " +
        "remove. A constraint on models, then - neither nothing nor proof."
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
    state = { index: 0, items: CASES[0].items, answered: [] };
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    casesSection.hidden = true;
    verdictFeedback.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    caseSelect.value = "0";
    itemsRange.value = String(CASES[0].items);
    controlsForm.querySelectorAll('input[name="verdict"]').forEach(function (input) {
      input.checked = false;
    });
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the case files.",
    { immediate: true });
})();
