/* =========================================================================
   Aphasia Profile Comparator
   -------------------------------------------------------------------------
   Six fictional language profiles on six original measures. The learner picks
   any two, decides which single measure does most to separate them, and is
   marked against the arithmetic.

   THE EDUCATIONAL MODEL
   ---------------------
   Every score runs from 0 to 10, where 10 is performance indistinguishable
   from a fictional control group. The separation between two profiles on a
   measure is the absolute difference between their scores, and the "most
   informative" measure for a pair is the one with the largest separation.

   Two consequences are the teaching:

     1. A measure is informative about a CONTRAST, not in general. Repetition
        separates A and D almost perfectly and does nothing for A against B.
     2. When two measures are within one point of each other, "the largest
        gap" stops being a useful answer, and the tool says so rather than
        pretending the winner is meaningful.

   Repetition is the measure the tool keeps returning to, because it can be
   done by a short route from the sounds coming in to the sounds going out
   without meaning being involved. A disproportionate difficulty with it, or a
   disproportionate sparing of it, is evidence about a connection rather than
   about a region - which is the link to the Network Disconnection Mapper.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Six measures is a caricature: real assessment separates single-word from
   sentence comprehension, word from non-word repetition, regular from
   irregular reading, and much more. Fluency in particular bundles rate, phrase
   length, effort, articulation, grammatical structure and information content
   into one number. No standardised battery, subtest or item is reproduced; no
   syndrome is named anywhere; no real person or published case appears; and
   nothing on the page assesses anybody.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var NEAR_TIE = 1.0;   /* separations within this of the maximum are a tie */

  var MEASURES = [
    {
      id: "fluency", name: "Fluency of spontaneous speech", short: "Fluency",
      asks: "Talking about a familiar topic for two minutes, rated for rate, phrase length and effort",
      note:
        "A compound rather than a measure: rate, phrase length, effort, " +
        "articulation, grammatical structure and how much the words carry are " +
        "all inside this one number."
    },
    {
      id: "comprehension", name: "Understanding what is said", short: "Understanding",
      asks: "Following spoken instructions of increasing length, and answering yes-or-no questions",
      note:
        "Understanding conversation is much easier than understanding a " +
        "sentence whose meaning depends on word order, and a single score " +
        "hides which was tested."
    },
    {
      id: "repetition", name: "Repeating what was said", short: "Repetition",
      asks: "Saying back single words and then short sentences, immediately after hearing them",
      note:
        "The most informative measure in the set, because it can be done by a " +
        "short route from the sounds coming in to the sounds going out, " +
        "without meaning being involved. Disproportionate difficulty here, or " +
        "disproportionate sparing, is evidence about a connection."
    },
    {
      id: "naming", name: "Naming things", short: "Naming",
      asks: "Naming pictured objects, and saying as many animals as possible in a minute",
      note:
        "Almost every profile is impaired here to some degree, which makes it " +
        "a poor discriminator despite being the difficulty people notice most."
    },
    {
      id: "reading", name: "Reading aloud", short: "Reading",
      asks: "Reading printed words and short sentences out loud",
      note:
        "Depends on speech output as well as on reading, so a low score here " +
        "is ambiguous whenever speech output is also low."
    },
    {
      id: "writing", name: "Writing", short: "Writing",
      asks: "Writing the names of pictured objects, and one sentence about a scene",
      note:
        "Depends on hand movement as well as on language, and is the measure " +
        "most often left out of an assessment - which is a reason to be careful " +
        "reading a profile that has it and one that does not."
    }
  ];

  /* Six fictional profiles. Scores 0 to 10; 10 is like the control group. */
  var PROFILES = [
    {
      id: "A", name: "Profile A",
      summary: "Effortful, short output; understands well; repetition also poor",
      scores: { fluency: 2, comprehension: 8, repetition: 3, naming: 4, reading: 4, writing: 3 },
      notes:
        "Speaks in single words and short phrases with visible effort, and " +
        "follows conversation and multi-step instructions without difficulty. " +
        "Aware of the errors and frustrated by them."
    },
    {
      id: "B", name: "Profile B",
      summary: "Fluent, well-formed output that carries little; understands poorly",
      scores: { fluency: 9, comprehension: 2, repetition: 3, naming: 3, reading: 3, writing: 3 },
      notes:
        "Speaks at a normal rate in long, well-shaped sentences that convey " +
        "very little, and misunderstands even short instructions. Does not " +
        "appear to notice the errors."
    },
    {
      id: "C", name: "Profile C",
      summary: "Fluent, understands well, repetition much worse than either",
      scores: { fluency: 8, comprehension: 8, repetition: 2, naming: 5, reading: 6, writing: 5 },
      notes:
        "Converses easily and follows what is said, and cannot say a sentence " +
        "back accurately even immediately after hearing it. Makes sound-based " +
        "errors and notices them, often trying several times."
    },
    {
      id: "D", name: "Profile D",
      summary: "Effortful, short output; understands well; repetition preserved",
      scores: { fluency: 3, comprehension: 8, repetition: 8, naming: 4, reading: 4, writing: 3 },
      notes:
        "Produces very little spontaneously and repeats long sentences back " +
        "accurately, sometimes repeating things nobody asked to be repeated. " +
        "Understanding is good."
    },
    {
      id: "E", name: "Profile E",
      summary: "Everything reduced, with nothing standing out",
      scores: { fluency: 2, comprehension: 2, repetition: 2, naming: 1, reading: 2, writing: 1 },
      notes:
        "Very limited output, very limited understanding, and no measure " +
        "clearly better than the others. Communicates through gesture and " +
        "facial expression, which no measure in this set records."
    },
    {
      id: "F", name: "Profile F",
      summary: "Moderate on most things, good at reading aloud, very poor at writing",
      scores: { fluency: 6, comprehension: 5, repetition: 5, naming: 3, reading: 7, writing: 2 },
      notes:
        "Fits no textbook pattern. Moderately fluent, moderately impaired at " +
        "understanding and repetition, poor at naming, reads aloud better than " +
        "anything else and writes worse than anything else. This is not a rare " +
        "kind of profile."
    }
  ];

  /* Commentary for the pairs that carry the teaching. Keyed by the two profile
     ids joined in either order. */
  var PAIR_NOTES = {
    "A|D":
      "A clean separation: repetition differs by five points while the rest of " +
      "the profile barely moves. That makes repetition the informative measure " +
      "for this comparison.",
    "A|B":
      "Two measures separate these almost equally - fluency by seven, " +
      "understanding by six. \"The largest gap\" is a weak answer here, and " +
      "understanding is the better one: fluency bundles six things together.",
    "C|D":
      "Mirror images on repetition: one repeats far worse than they speak or " +
      "understand, the other far better. Two profiles erring in opposite " +
      "directions on the same measure are worth more than either alone.",
    "B|C":
      "Both fluent, six points apart on understanding. This is the contrast " +
      "fluency alone cannot make.",
    "A|C":
      "Fluency separates them most and repetition barely at all - both are " +
      "poor at it, quite possibly for different reasons. Agreement on a " +
      "measure is not evidence that the same thing is wrong.",
    "E|F":
      "One profile uniformly low, one uneven. The separations are large " +
      "everywhere, which makes the comparison easy and uninformative: when " +
      "everything differs, no single measure carries the contrast."
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

  function profileById(id) {
    return PROFILES.filter(function (p) { return p.id === id; })[0];
  }

  function measureById(id) {
    return MEASURES.filter(function (m) { return m.id === id; })[0];
  }

  /* =======================================================================
     The comparison
     ===================================================================== */

  function separations(left, right) {
    return MEASURES.map(function (measure) {
      return {
        measure: measure,
        left: left.scores[measure.id],
        right: right.scores[measure.id],
        gap: Math.abs(left.scores[measure.id] - right.scores[measure.id])
      };
    });
  }

  function best(rows) {
    return rows.reduce(function (top, row) {
      return row.gap > top.gap ? row : top;
    }, rows[0]);
  }

  function contenders(rows) {
    var top = best(rows).gap;
    return rows.filter(function (row) {
      return row.gap >= top - NEAR_TIE && row.gap > 0;
    });
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#aphasia");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var leftSelect = $("[data-left-select]");
  var rightSelect = $("[data-right-select]");
  var measureControls = $("[data-measure-controls]");
  var pairTitle = $("[data-pair-title]");
  var pairBrief = $("[data-pair-brief]");
  var compareSvg = $("[data-compare]");
  var compareTable = $("[data-compare-table]");
  var headLeft = $("[data-head-left]");
  var headRight = $("[data-head-right]");
  var leftNotesTitle = $("[data-left-notes-title]");
  var leftNotesBody = $("[data-left-notes-body]");
  var rightNotesTitle = $("[data-right-notes-title]");
  var rightNotesBody = $("[data-right-notes-body]");
  var choiceFeedback = $("[data-choice-feedback]");
  var allHead = $("[data-all-head]");
  var allTable = $("[data-all-table]");
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var comparatorSection = $("#comparator-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = { left: "A", right: "D" };

  /* --- Controls, built once --------------------------------------------- */

  PROFILES.forEach(function (profile) {
    [leftSelect, rightSelect].forEach(function (select) {
      var option = make("option", null, profile.name + " - " + profile.summary);
      option.value = profile.id;
      select.appendChild(option);
    });
  });
  leftSelect.value = "A";
  rightSelect.value = "D";

  [["left", leftSelect], ["right", rightSelect]].forEach(function (entry) {
    entry[1].addEventListener("change", function () {
      state[entry[0]] = entry[1].value;
      choiceFeedback.hidden = true;
      render();
      shell.announce(
        profileById(state.left).name + " against " +
        profileById(state.right).name + ".", { immediate: true });
    });
  });

  MEASURES.forEach(function (measure) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "measure";
    input.value = measure.id;
    label.appendChild(input);
    label.appendChild(document.createTextNode(measure.name));
    measureControls.appendChild(label);
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    checkChoice();
  });

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var left = profileById(state.left);
    var right = profileById(state.right);
    var rows = separations(left, right);

    pairTitle.textContent = left.name + " against " + right.name;
    pairBrief.textContent = state.left === state.right
      ? "The same profile twice. Every separation is zero, which is a way of " +
        "checking that the comparison does what it says."
      : left.summary + ", against " + right.summary.toLowerCase() + ".";

    headLeft.textContent = left.name;
    headRight.textContent = right.name;
    leftNotesTitle.textContent = left.name;
    leftNotesBody.textContent = left.notes;
    rightNotesTitle.textContent = right.name;
    rightNotesBody.textContent = right.notes;

    drawCompare(left, right, rows);
    renderTable(rows);
    renderAll();
  }

  /* Two bars per measure. The two profiles are distinguished by fill AND by
     the profile letter printed at the start of each bar, and each bar prints
     its own score, so nothing depends on hue. */
  function drawCompare(left, right, rows) {
    var LABEL = 128, AXIS_START = 136, AXIS_END = 384;
    var ROW = 40, BAR = 14, TOP = 10;

    function xOf(score) {
      return AXIS_START + (score / 10) * (AXIS_END - AXIS_START);
    }

    var axisY = TOP + rows.length * ROW + 4;
    clear(compareSvg);
    compareSvg.setAttribute("viewBox", "0 0 470 " + (axisY + 28));

    rows.forEach(function (row, index) {
      var y = TOP + index * ROW;

      compareSvg.appendChild(
        svgText(LABEL, y + 18, "chart__count", "end", row.measure.short));

      [[left, row.left, 0, "one"], [right, row.right, BAR + 3, "two"]]
        .forEach(function (entry) {
          var top = y + 2 + entry[2];
          compareSvg.appendChild(svgEl("rect", {
            x: AXIS_START, y: top, width: AXIS_END - AXIS_START, height: BAR,
            class: "chart__track"
          }));
          compareSvg.appendChild(svgEl("rect", {
            x: AXIS_START, y: top, width: Math.max(2, xOf(entry[1]) - AXIS_START),
            height: BAR, class: "chart__bar chart__bar--" + entry[3]
          }));
          compareSvg.appendChild(
            svgText(AXIS_START + 5, top + BAR - 3, "chart__inline", "start", entry[0].id));
          compareSvg.appendChild(
            svgText(xOf(entry[1]) + 5, top + BAR - 3, "chart__count", "start",
              String(entry[1])));
        });

      compareSvg.appendChild(
        svgText(462, y + 18, "aph__gap", "end", "gap " + row.gap));
    });

    compareSvg.appendChild(svgEl("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "chart__baseline"
    }));
    [0, 5, 10].forEach(function (tick) {
      compareSvg.appendChild(
        svgText(xOf(tick), axisY + 14, "chart__axis", "middle", String(tick)));
    });
    compareSvg.appendChild(
      svgText(0, axisY + 14, "chart__axis", "start", "0 = very impaired, 10 = like controls"));
  }

  function renderTable(rows) {
    clear(compareTable);
    var top = best(rows).gap;
    rows.forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row.measure.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row.measure.asks));
      tr.appendChild(make("td", null, String(row.left)));
      tr.appendChild(make("td", null, String(row.right)));
      var gapCell = make("td", null,
        row.gap + (row.gap === top && top > 0 ? " - the largest" : ""));
      if (row.gap === top && top > 0) { gapCell.setAttribute("data-mark", "top"); }
      tr.appendChild(gapCell);
      compareTable.appendChild(tr);
    });
  }

  function renderAll() {
    clear(allHead);
    var corner = make("th", null, "Measure");
    corner.setAttribute("scope", "col");
    allHead.appendChild(corner);
    PROFILES.forEach(function (profile) {
      var th = make("th", null, profile.id);
      th.setAttribute("scope", "col");
      allHead.appendChild(th);
    });

    clear(allTable);
    MEASURES.forEach(function (measure) {
      var tr = make("tr");
      var th = make("th", null, measure.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      PROFILES.forEach(function (profile) {
        var cell = make("td", null, String(profile.scores[measure.id]));
        if (profile.id === state.left || profile.id === state.right) {
          cell.setAttribute("data-mark", "picked");
        }
        tr.appendChild(cell);
      });
      allTable.appendChild(tr);
    });
  }

  /* --- Checking the choice ---------------------------------------------- */

  function checkChoice() {
    var chosen = $('input[name="measure"]:checked', measureControls);
    if (!chosen) {
      showFeedback(choiceFeedback, "caution", "Choose a measure first.",
        "Decide before you look at the separation column - the exercise is " +
        "the prediction, not the arithmetic.");
      return;
    }

    var left = profileById(state.left);
    var right = profileById(state.right);
    var rows = separations(left, right);
    var winner = best(rows);
    var close = contenders(rows);
    var picked = rows.filter(function (row) {
      return row.measure.id === chosen.value;
    })[0];

    clear(choiceFeedback);

    if (winner.gap === 0) {
      showFeedback(choiceFeedback, "neutral",
        "Nothing separates these two.",
        "Every measure gives the same score for both, so no measure is " +
        "informative about the contrast. Choose two different profiles.");
      shell.announce("No separation between these two profiles.", { immediate: true });
      return;
    }

    var right_answer = picked.gap === winner.gap;
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right_answer
        ? "Yes - " + winner.measure.short.toLowerCase() + ", by " + winner.gap + " points."
        : "The largest separation is " + winner.measure.short.toLowerCase() +
          ", by " + winner.gap + " points."));
    lead.appendChild(document.createTextNode(
      " You chose " + picked.measure.short.toLowerCase() + ", which separates " +
      "them by " + picked.gap + "."));
    choiceFeedback.appendChild(lead);

    if (close.length > 1) {
      choiceFeedback.appendChild(make("p", null,
        "Note that " + close.length + " measures are within a point of each " +
        "other here (" + close.map(function (row) {
          return row.measure.short.toLowerCase() + " " + row.gap;
        }).join(", ") + "). When separations are that close, \"the largest " +
        "gap\" stops being a useful answer."));
    }

    var key = [state.left, state.right].sort().join("|");
    if (PAIR_NOTES[key]) {
      choiceFeedback.appendChild(make("p", null, PAIR_NOTES[key]));
    }

    choiceFeedback.appendChild(make("p", "text-muted", winner.measure.note));

    choiceFeedback.setAttribute("data-tone", right_answer ? "good" : "caution");
    choiceFeedback.hidden = false;

    shell.announce(
      "Largest separation: " + winner.measure.short.toLowerCase() + ", " +
      winner.gap + " points.", { immediate: true });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    severity: {
      tone: "caution",
      verdict: "Not on this evidence.",
      text:
        "Severity moves everything together. A difference confined to one " +
        "measure while the rest match is the opposite of that. Compare " +
        "profiles A and D below."
    },
    route: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Repetition can take a short route from the sounds coming in to the " +
        "sounds going out, with meaning left out. Two people matched on " +
        "understanding and on speech who differ on repetition differ in " +
        "whether that route is available."
    },
    category: {
      tone: "caution",
      verdict: "That is a label, not an explanation.",
      text:
        "The classical categories were defined by which symptoms tended to " +
        "occur together, so saying two profiles are in different categories " +
        "restates the difference rather than explaining it. It is also less " +
        "informative than it sounds: a substantial minority of people fit no " +
        "category, and the same label covers very different profiles."
    },
    nothing: {
      tone: "caution",
      verdict: "Artificial, and unusually informative for that reason.",
      text:
        "Nobody repeats sentences in daily life, and that is close to why the " +
        "task is useful: it can be done without meaning being involved, so it " +
        "isolates something the natural tasks confound. Ecological validity " +
        "and diagnostic value are different virtues and often pull in " +
        "different directions."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the comparator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockComparator();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockComparator();
  });

  function unlockComparator() {
    lockForm(openingForm);
    comparatorSection.hidden = false;
    render();
    $("#comparator-heading").focus();
    shell.announce("Comparator open. Profile A against profile D.",
      { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    error: {
      tone: "caution",
      verdict: "Possible, and the least likely of the four.",
      text:
        "Testing does go wrong, and a profile this uneven is worth repeating. " +
        "But uneven profiles are common enough that assuming an error every " +
        "time one appears would mean discarding a substantial minority of all " +
        "assessments."
    },
    stage: {
      tone: "caution",
      verdict: "Often true, and it does not rescue the categories.",
      text:
        "Profiles do change with time since onset, and a profile between two " +
        "categories may well be moving from one towards another. That is a " +
        "reason to doubt that the categories are kinds rather than a reason to " +
        "keep them: if a person passes through the space between two boxes, " +
        "the space between the boxes is real."
    },
    prototype: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The classical categories were built from which symptoms tended to " +
        "occur together in the cases available a century ago: useful " +
        "shorthand, and prototypes drawn through a continuous space. A " +
        "substantial minority of people fit none of them, and the same label " +
        "covers very different profiles."
    },
    nolocal: {
      tone: "caution",
      verdict: "Too strong.",
      text:
        "Language depends heavily on a left-hemisphere network in most people, " +
        "and damage to it produces language difficulty reliably enough that " +
        "the association is not in doubt. What the messy profiles argue " +
        "against is the tidy region-to-syndrome mapping, not the involvement " +
        "of the regions."
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
    state = { left: "A", right: "D" };
    leftSelect.value = "A";
    rightSelect.value = "D";
    Array.prototype.forEach.call(
      measureControls.querySelectorAll("input"),
      function (input) { input.checked = false; });
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    comparatorSection.hidden = true;
    choiceFeedback.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the comparator.",
    { immediate: true });
})();
