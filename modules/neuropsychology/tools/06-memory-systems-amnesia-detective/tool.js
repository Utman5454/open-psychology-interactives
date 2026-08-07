/* =========================================================================
   Memory Systems Detective
   -------------------------------------------------------------------------
   Five fictional profiles across seven memory measures, and five claims about
   separable memory systems. For each claim on each profile the learner decides
   whether the profile supports it, counts against it, or cannot decide it.

   THE EDUCATIONAL MODEL
   ---------------------
   Scores are control-referenced: each number is how far this fictional person
   sits from the average of that measure's own fictional control group, in
   control standard deviations. A measure is treated as clearly below its
   controls at -2 or lower and as within range above about -1.

   A claim is supported by a profile only when one measure is clearly below its
   controls while a COMPARABLE measure clearly is not. It is counted against
   when the profile shows the opposite of what the claim predicts. Otherwise
   the profile cannot decide it - which is true of twelve of the twenty-five
   cells, and is the point of the exercise.

   The intended grid (rows are claims, columns profiles A to E):

                                  A         B         C         D         E
     1 short-term vs episodic   support   support   support   cannot    cannot
     2 episodic vs semantic     support   cannot    support   cannot    cannot
     3 episodic vs skill        support   cannot    support   cannot    cannot
     4 retrieval vs storage     cannot    cannot    cannot    cannot    cannot
     5 one general reduction    against   against   against   against   support

   Row 4 is never supported anywhere, deliberately. The pattern always cited
   for a retrieval account - recall at floor with normal recognition - does not
   establish one, because recognition is the easier task and a trace too weak
   to be recalled can still be strong enough to be recognised.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Seven measures is very few; real batteries separate several things merged
   here. The intended answers are judgements, and reasonable people would argue
   about several cells - which the tool says out loud. No anatomy appears
   anywhere, because these distinctions are between what tasks require. No real
   person, published case, clinical instrument or syndrome name is used.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CLEARLY_BELOW = -2.0;   /* at or below this counts as clearly impaired */
  var WITHIN_RANGE = -1.2;    /* above this counts as within the control range */

  /* =======================================================================
     The seven measures
     ===================================================================== */

  var MEASURES = [
    { id: "span", name: "Immediate span",
      asks: "Repeat a list of digits back straight away" },
    { id: "working", name: "Span with manipulation",
      asks: "Repeat the same list back in reverse order" },
    { id: "learning", name: "Learning across trials",
      asks: "How many of sixteen words are recalled by the fifth learning trial" },
    { id: "recall", name: "Free recall after 30 minutes",
      asks: "Say back as many of those words as possible, with no cues" },
    { id: "recognition", name: "Recognition after 30 minutes",
      asks: "Pick each of those words out from a word that was not on the list" },
    { id: "semantic", name: "Word knowledge",
      asks: "Name pictured objects and say what unusual words mean" },
    { id: "skill", name: "Skill learning across sessions",
      asks: "Keep a moving target under a stylus, over five sessions on five days" }
  ];

  /* =======================================================================
     The five fictional profiles
     ===================================================================== */

  var CASES = [
    {
      id: "A", title: "Profile A",
      brief:
        "Severely impaired on everything after the moment, and unimpaired " +
        "before it.",
      scores: { span: 0.2, working: -0.3, learning: -3.8, recall: -4.5,
        recognition: -3.6, semantic: 0.1, skill: -0.2 },
      notes:
        "A fictional person of 54, tested eighteen months after an illness " +
        "affecting the brain. Education to degree level. No difficulty with " +
        "hearing or vision, engaged and cooperative throughout, and no reported " +
        "low mood. Knows their own history up to about two years ago and " +
        "reports remembering nothing of the testing session an hour later."
    },
    {
      id: "B", title: "Profile B",
      brief:
        "The reverse shape: very poor at holding material for seconds, and " +
        "nearly normal thirty minutes later.",
      scores: { span: -3.4, working: -3.0, learning: -1.1, recall: -0.9,
        recognition: -0.2, semantic: 0.3, skill: 0.1 },
      notes:
        "A fictional person of 47, tested a year after a stroke. Left school " +
        "at 18. Repeating even three digits is effortful and error-prone. " +
        "Reports no difficulty following conversation or remembering the day's " +
        "events. Tested in their first language, with hearing checked."
    },
    {
      id: "C", title: "Profile C",
      brief:
        "Nothing recalled after thirty minutes, and recognition entirely " +
        "normal.",
      scores: { span: -0.1, working: -0.4, learning: -2.9, recall: -4.1,
        recognition: -0.3, semantic: 0.2, skill: -0.1 },
      notes:
        "A fictional person of 61, tested two years after an injury. Recall " +
        "produces almost nothing; shown a word beside one that was not on the " +
        "list, they pick correctly nearly every time and say they are guessing. " +
        "Good effort throughout, no reported low mood, no medication affecting " +
        "alertness."
    },
    {
      id: "D", title: "Profile D",
      brief:
        "Word knowledge itself has gone, and every measure that uses words has " +
        "gone with it.",
      scores: { span: -0.3, working: -0.6, learning: -2.4, recall: -2.8,
        recognition: -2.2, semantic: -4.2, skill: -0.2 },
      notes:
        "A fictional person of 66, tested during a slowly progressive illness. " +
        "Struggles to name common objects and cannot define words they used " +
        "routinely two years ago. Day-to-day events are recounted accurately " +
        "and in order. Everything except the skill task in this battery is " +
        "made of words."
    },
    {
      id: "E", title: "Profile E",
      brief:
        "A little below the control average on all seven measures, and " +
        "selectively below on none.",
      scores: { span: -1.1, working: -1.3, learning: -1.2, recall: -1.4,
        recognition: -1.0, semantic: -0.9, skill: -1.2 },
      notes:
        "A fictional person of 39, referred after reporting that their memory " +
        "is not what it was. Working long shifts, sleeping about five hours, " +
        "in pain from an unrelated injury and taking medication for it, and " +
        "describing themselves as low in mood since the injury. Left school at " +
        "16; the control group for this battery was recruited from a " +
        "university. Tested late in the afternoon after a two-hour session."
    }
  ];

  /* =======================================================================
     The five claims, and the intended verdict on each profile
     ===================================================================== */

  var VERDICTS = [
    { id: "support", label: "This profile supports it" },
    { id: "against", label: "This profile counts against it" },
    { id: "cannot", label: "This profile cannot decide it" }
  ];

  var CLAIMS = [
    {
      id: "stm",
      text:
        "Holding material for seconds and remembering it for half an hour do " +
        "not depend on all the same things.",
      answers: {
        A: "support", B: "support", C: "support", D: "cannot", E: "cannot"
      },
      why: {
        A:
          "Span is at the control average and delayed recall is four and a half " +
          "SDs below it. One measure clearly intact, a comparable one clearly " +
          "not - which is what supporting a distinction takes. Note it is a " +
          "single dissociation, so it is compatible with delayed recall simply " +
          "being the more demanding task.",
        B:
          "This is the reverse shape, and it is worth more than profile A. Span " +
          "is three and a half SDs below and delayed recall is within the " +
          "control range. Put A and B together and you have a crossover, which " +
          "rules out either task being simply the harder one.",
        C:
          "Span at the control average, delayed recall four SDs below. Same " +
          "structure of evidence as profile A.",
        D:
          "Span is normal and delayed recall is nearly three SDs below, which " +
          "looks like support - until you notice that word knowledge is more " +
          "impaired than either. The delayed recall task is made of words this " +
          "person no longer knows well, so its score is not a reading of " +
          "delayed memory alone.",
        E:
          "Everything is about one SD below and nothing is clearly below. There " +
          "is no contrast here to support anything."
      }
    },
    {
      id: "semantic",
      text:
        "Remembering an episode and knowing what a word means do not depend on " +
        "all the same things.",
      answers: {
        A: "support", B: "cannot", C: "support", D: "cannot", E: "cannot"
      },
      why: {
        A:
          "Word knowledge sits at the control average while learning and recall " +
          "are around four SDs below. A person who cannot retain anything new " +
          "and can still define words shows that the two do not require all the " +
          "same things.",
        B:
          "Word knowledge is normal, and so is delayed recall. With neither " +
          "clearly impaired there is no contrast to read.",
        C:
          "Same structure as profile A: word knowledge intact, learning and " +
          "recall at floor.",
        D:
          "Both are impaired, which supports nothing either way. Worse, the " +
          "episodic measures here use words, so their impairment may be a " +
          "consequence of the word-knowledge loss rather than independent of " +
          "it. This is the profile that most needs measures made of something " +
          "other than words.",
        E:
          "Nothing is clearly impaired, so nothing is contrasted."
      }
    },
    {
      id: "skill",
      text:
        "Learning a new fact and getting better at a physical skill do not " +
        "depend on all the same things.",
      answers: {
        A: "support", B: "cannot", C: "support", D: "cannot", E: "cannot"
      },
      why: {
        A:
          "Skill learning improves normally across five sessions while the same " +
          "person retains nothing of the word list - and often nothing of " +
          "having done the skill task before. That contrast is one of the " +
          "strongest pieces of evidence in the whole memory literature.",
        B:
          "Skill learning is normal, and so is delayed recall. No contrast, so " +
          "nothing supported.",
        C:
          "Skill learning normal, learning and recall at floor. Same structure " +
          "as profile A.",
        D:
          "Skill learning is intact and the verbal measures are not - but the " +
          "skill task differs from them in the memory system it is supposed to " +
          "tap AND in its material and its response. A contrast that varies two " +
          "things at once cannot be pinned on either. This is task impurity in " +
          "its purest form.",
        E:
          "Nothing is clearly impaired, so nothing is contrasted."
      }
    },
    {
      id: "retrieval",
      text:
        "Where a profile shows poor recall, the difficulty is at retrieval " +
        "rather than at storage.",
      answers: {
        A: "cannot", B: "cannot", C: "cannot", D: "cannot", E: "cannot"
      },
      why: {
        A:
          "Recognition is nearly as impaired as recall, so there is no evidence " +
          "here of a difficulty specific to producing the material. That is " +
          "compatible with a storage problem and also with a retrieval problem " +
          "severe enough to defeat both tasks.",
        B:
          "Neither recall nor recognition is clearly impaired, so the question " +
          "does not arise for this profile.",
        C:
          "This is the pattern the retrieval account is always argued from, and " +
          "it does not establish it. Recognition is the easier task: a trace too " +
          "weak to be produced from nothing can still be strong enough to be " +
          "picked out of two options. Until the two tasks are matched so that " +
          "healthy controls find them equally hard, the difference between them " +
          "is a difference in difficulty as much as a difference in process. " +
          "The pattern is suggestive and it is not decisive.",
        D:
          "Recall and recognition are impaired to a similar degree, and both " +
          "use words this person no longer knows well. Nothing here separates " +
          "retrieval from storage.",
        E:
          "Nothing is clearly impaired, so there is no poor recall to explain."
      }
    },
    {
      id: "general",
      text:
        "This profile is better explained by one general reduction in capacity " +
        "than by any selective loss.",
      answers: {
        A: "against", B: "against", C: "against", D: "against", E: "support"
      },
      why: {
        A:
          "Span, word knowledge and skill learning all sit at the control " +
          "average while three measures are around four SDs below. A general " +
          "reduction cannot leave four measures untouched.",
        B:
          "Span is three and a half SDs below and four other measures are at or " +
          "above the control average. The impairment is confined to one end of " +
          "the battery.",
        C:
          "Recognition, span, word knowledge and skill learning are all normal. " +
          "Whatever is wrong is not general.",
        D:
          "The one thing this profile is not is uniform: word knowledge is four " +
          "SDs below and span and skill learning are at the control average. " +
          "The impairment is broad and it is still selective.",
        E:
          "Every measure sits between 0.9 and 1.4 SDs below its controls and " +
          "none is clearly below. That shape is what a general reduction looks " +
          "like - and \"general reduction\" is not the same as \"brain damage\". " +
          "Reduced effort, five hours of sleep, pain, medication, low mood, " +
          "being tested at the end of a long afternoon, and a control group " +
          "recruited from a university when this person left school at 16 all " +
          "produce it too. Nothing in the profile chooses between them, and " +
          "several are worth ruling out before any memory system is mentioned."
      }
    }
  ];

  var VERDICT_SHORT = { support: "supports", against: "against", cannot: "cannot decide" };

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

  function signed(v) {
    return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1);
  }

  function standing(z) {
    if (z <= CLEARLY_BELOW) { return "clearly below the control range"; }
    if (z <= WITHIN_RANGE) { return "below average, not clearly outside the range"; }
    return "within the control range";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#memory");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var caseControls = $("[data-case-controls]");
  var verdictControls = $("[data-verdict-controls]");
  var caseTitle = $("[data-case-title]");
  var caseBrief = $("[data-case-brief]");
  var claimLabel = $("[data-claim-label]");
  var claimText = $("[data-claim-text]");
  var profileSvg = $("[data-profile]");
  var measureTable = $("[data-measure-table]");
  var notesBody = $("[data-notes-body]");
  var claimFeedback = $("[data-claim-feedback]");
  var gridTable = $("[data-grid-table]");
  var gridNote = $("[data-grid-note]");
  var progress = $("[data-progress]");
  var controlsForm = $("[data-interactive-controls]");
  var gridDetails = $("[data-grid-details]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var profilesSection = $("#profiles-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  /* answers["A"]["stm"] = "support" | "against" | "cannot" */
  var state = { caseIndex: 0, claimIndex: 0, answers: {} };

  function currentCase() { return CASES[state.caseIndex]; }
  function currentClaim() { return CLAIMS[state.claimIndex]; }

  /* --- Controls, built once --------------------------------------------- */

  CASES.forEach(function (item, index) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "profile";
    input.value = item.id;
    input.checked = index === 0;
    input.addEventListener("change", function () {
      state.caseIndex = index;
      claimFeedback.hidden = true;
      syncVerdictRadios();
      render();
      shell.announce(item.title + ". " + item.brief, { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(item.title + " - " + shortLabel(item)));
    caseControls.appendChild(label);
  });

  function shortLabel(item) {
    return item.brief.split(/[,.]/)[0].toLowerCase();
  }

  VERDICTS.forEach(function (verdict) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "verdict";
    input.value = verdict.id;
    label.appendChild(input);
    label.appendChild(document.createTextNode(verdict.label));
    verdictControls.appendChild(label);
  });

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    judge();
  });

  $('[data-action="next-claim"]').addEventListener("click", function () {
    step(1);
  });
  $('[data-action="prev-claim"]').addEventListener("click", function () {
    step(-1);
  });

  function step(direction) {
    state.claimIndex = (state.claimIndex + direction + CLAIMS.length) % CLAIMS.length;
    claimFeedback.hidden = true;
    syncVerdictRadios();
    render();
    shell.announce(
      "Claim " + (state.claimIndex + 1) + " of " + CLAIMS.length + ": " +
      currentClaim().text, { immediate: true });
  }

  function syncVerdictRadios() {
    var stored = (state.answers[currentCase().id] || {})[currentClaim().id];
    Array.prototype.forEach.call(
      verdictControls.querySelectorAll("input"),
      function (input) { input.checked = input.value === stored; });
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var item = currentCase();
    var claim = currentClaim();

    caseTitle.textContent = item.title;
    caseBrief.textContent = item.brief;
    claimLabel.textContent = "Claim " + (state.claimIndex + 1) + " of " + CLAIMS.length;
    claimText.textContent = claim.text;
    notesBody.textContent = item.notes;

    drawProfile(item);
    renderMeasureTable(item);
    renderGrid();

    var answered = countAnswered();
    progress.textContent = answered + " of " + (CASES.length * CLAIMS.length) +
      " cells in the grid judged.";
  }

  function countAnswered() {
    return CASES.reduce(function (total, item) {
      var row = state.answers[item.id] || {};
      return total + Object.keys(row).length;
    }, 0);
  }

  /* Horizontal bars from the control average, drawn leftwards. Every bar
     prints its own value and the table repeats it, so the fill is redundant;
     a bar that reaches past the shaded control band also carries a marker. */
  function drawProfile(item) {
    var LEFT = 168, AXIS_START = 176, AXIS_END = 400;
    var Z_MIN = -5, Z_MAX = 1;
    var ROW = 25, TOP = 8;

    function xOf(z) {
      var clamped = Math.max(Z_MIN, Math.min(Z_MAX, z));
      return AXIS_START + ((clamped - Z_MIN) / (Z_MAX - Z_MIN)) * (AXIS_END - AXIS_START);
    }

    var axisY = TOP + MEASURES.length * ROW + 6;
    clear(profileSvg);
    profileSvg.setAttribute("viewBox", "0 0 460 " + (axisY + 30));

    profileSvg.appendChild(svgEl("rect", {
      x: xOf(-1.65), y: TOP - 4,
      width: xOf(Z_MAX) - xOf(-1.65), height: axisY - TOP + 4,
      class: "mem__band"
    }));
    profileSvg.appendChild(svgEl("line", {
      x1: xOf(0), y1: TOP - 4, x2: xOf(0), y2: axisY, class: "mem__zero"
    }));

    MEASURES.forEach(function (measure, index) {
      var z = item.scores[measure.id];
      var y = TOP + index * ROW;
      var mid = y + ROW / 2;

      profileSvg.appendChild(
        svgText(LEFT, mid + 4, "chart__count", "end", measure.name));

      var from = Math.min(xOf(0), xOf(z));
      var to = Math.max(xOf(0), xOf(z));
      profileSvg.appendChild(svgEl("rect", {
        x: from, y: mid - 7, width: Math.max(1.5, to - from), height: 14,
        class: "mem__bar" + (z <= CLEARLY_BELOW ? " mem__bar--below" : "")
      }));

      profileSvg.appendChild(
        svgText(xOf(z) - 6, mid + 4, "chart__count",
          z < 0 ? "end" : "start", signed(z)));
    });

    profileSvg.appendChild(svgEl("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "chart__baseline"
    }));
    [-4, -3, -2, -1, 0].forEach(function (tick) {
      profileSvg.appendChild(
        svgText(xOf(tick), axisY + 15, "chart__axis", "middle", String(tick)));
    });
    profileSvg.appendChild(
      svgText(xOf(0), axisY + 28, "chart__axis", "middle", "control average"));
    profileSvg.appendChild(
      svgText(0, axisY + 15, "chart__axis", "start", "control SDs"));
  }

  function renderMeasureTable(item) {
    clear(measureTable);
    MEASURES.forEach(function (measure) {
      var z = item.scores[measure.id];
      var tr = make("tr");
      var th = make("th", null, measure.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, measure.asks));
      tr.appendChild(make("td", null, signed(z) + " SD"));
      var cell = make("td", null, standing(z));
      if (z <= CLEARLY_BELOW) { cell.setAttribute("data-mark", "below"); }
      tr.appendChild(cell);
      measureTable.appendChild(tr);
    });
  }

  function renderGrid() {
    clear(gridTable);
    CLAIMS.forEach(function (claim, claimIndex) {
      var tr = make("tr");
      var th = make("th", null, (claimIndex + 1) + ". " + claim.text);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      CASES.forEach(function (item) {
        var given = (state.answers[item.id] || {})[claim.id];
        var intended = claim.answers[item.id];
        var cell = make("td", null,
          given
            ? VERDICT_SHORT[given] + (given === intended ? "" : " (intended: " + VERDICT_SHORT[intended] + ")")
            : "-");
        if (given) { cell.setAttribute("data-mark", given === intended ? "hit" : "miss"); }
        tr.appendChild(cell);
      });
      gridTable.appendChild(tr);
    });

    var answered = countAnswered();
    gridNote.textContent = answered < CASES.length * CLAIMS.length
      ? "Cells you have not judged yet show a dash. Of the twenty-five, eight " +
        "support a claim, five count against one, and twelve cannot decide."
      : "All twenty-five judged. Eight cells support a claim, five count " +
        "against one, and twelve cannot decide - and row 4 is never supported " +
        "anywhere, which is the argument of the tool.";
  }

  /* --- Judging ---------------------------------------------------------- */

  function judge() {
    var chosen = $('input[name="verdict"]:checked', verdictControls);
    if (!chosen) {
      showFeedback(claimFeedback, "caution", "Choose one of the three first.",
        "All three are used somewhere in the grid, and one of them is used " +
        "twelve times.");
      return;
    }

    var item = currentCase();
    var claim = currentClaim();
    var intended = claim.answers[item.id];
    var right = chosen.value === intended;

    if (!state.answers[item.id]) { state.answers[item.id] = {}; }
    state.answers[item.id][claim.id] = chosen.value;

    clear(claimFeedback);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right ? "Agreed." : "The intended answer is: " +
        VERDICTS.filter(function (v) { return v.id === intended; })[0].label + "."));
    lead.appendChild(document.createTextNode(" " + claim.why[item.id]));
    claimFeedback.appendChild(lead);

    if (!right) {
      claimFeedback.appendChild(make("p", "text-muted",
        "The grid is a position to argue with rather than a key. If you can " +
        "make the case for your answer from the numbers on screen, make it - " +
        "several of these cells are genuinely arguable, and the retrieval row " +
        "most of all."));
    }

    claimFeedback.setAttribute("data-tone", right ? "good" : "caution");
    claimFeedback.hidden = false;

    renderGrid();
    progress.textContent = countAnswered() + " of " +
      (CASES.length * CLAIMS.length) + " cells in the grid judged.";

    if (countAnswered() === CASES.length * CLAIMS.length) { gridDetails.open = true; }

    shell.announce(
      (right ? "Agreed. " : "Intended answer: " + VERDICT_SHORT[intended] + ". ") +
      countAnswered() + " of 25 cells judged.", { immediate: true });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    systems: {
      tone: "caution",
      verdict: "One word too strong.",
      text:
        "The evidence shows that the two tasks do not depend on all the same " +
        "things. \"Separate systems\" adds a claim about how memory is " +
        "organised that a pair of scores cannot deliver. The multiple-systems " +
        "account is a good theory with a great deal of converging support - " +
        "and no single profile establishes it, which is why the wording is " +
        "worth keeping honest."
    },
    separable: {
      tone: "good",
      verdict: "Yes - and the wording is the lesson.",
      text:
        "Separable is what dissociation evidence gives you: these two tasks do " +
        "not require all the same things. Whether that means two systems, two " +
        "processes within one system, or one process used differently is a " +
        "further question that needs evidence from outside the profile."
    },
    harder: {
      tone: "caution",
      verdict: "A live rival, and not the answer.",
      text:
        "Delayed recall probably is the harder task, and that is exactly why " +
        "one profile cannot settle it. What settles it is a second person with " +
        "the opposite shape - poor span, near-normal delayed recall. Profile B " +
        "in the tool below is that person."
    },
    nothing: {
      tone: "good",
      verdict: "The right instinct, slightly overstated.",
      text:
        "Every score in this tool is referenced to its own control group for " +
        "exactly that reason - raw scores on two different tasks are readings " +
        "from different rulers. Once they are referenced, the profile does " +
        "establish something; it just establishes less than it looks like."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the profiles.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockProfiles();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockProfiles();
  });

  function unlockProfiles() {
    lockForm(openingForm);
    profilesSection.hidden = false;
    render();
    $("#profiles-heading").focus();
    shell.announce("Profiles open. Profile A, claim 1 of 5.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  var CHALLENGE = {
    longer: {
      tone: "caution",
      verdict: "It would tell you about forgetting, not about the mechanism.",
      text:
        "A longer delay makes both tasks harder and leaves the comparison " +
        "between them exactly where it was. If recognition is easier than " +
        "recall at thirty minutes it will still be easier at a day."
    },
    matched: {
      tone: "good",
      verdict: "Yes - this is the one that changes the argument.",
      text:
        "The whole problem is that recognition is the easier task, so a trace " +
        "too weak to be recalled can still be recognised. Make the recognition " +
        "test hard enough that healthy controls score no better on it than on " +
        "recall - more similar foils, more items, longer lists - and the " +
        "comparison becomes a comparison between processes rather than between " +
        "difficulties. If recognition is still spared once the difficulty is " +
        "equated, the retrieval account has evidence. It is hard to do well, " +
        "and it is the right thing to attempt."
    },
    more: {
      tone: "caution",
      verdict: "More of the same evidence.",
      text:
        "Extra words would give a more precise estimate of a recall score that " +
        "is already clearly at floor. Precision is not the problem here; the " +
        "comparison is."
    },
    imaging: {
      tone: "caution",
      verdict: "Useful, and not for this question.",
      text:
        "Imaging tells you what is damaged. It does not tell you whether a " +
        "behavioural difference between two tasks reflects two processes or " +
        "two levels of difficulty, because that is a question about the tasks. " +
        "You would still have to match them."
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
    state = { caseIndex: 0, claimIndex: 0, answers: {} };
    Array.prototype.forEach.call(
      caseControls.querySelectorAll("input"),
      function (input) { input.checked = input.value === "A"; });
    syncVerdictRadios();
    gridDetails.open = false;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    profilesSection.hidden = true;
    claimFeedback.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the profiles.",
    { immediate: true });
})();
