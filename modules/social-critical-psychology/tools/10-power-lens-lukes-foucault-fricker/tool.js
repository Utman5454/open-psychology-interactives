/* =========================================================================
   Power Lens Laboratory
   -------------------------------------------------------------------------
   One fictional institutional case (Brackwell College, Workshop 3) and nine
   pieces of evidence. The learner works through the same nine items three
   times, each time asking a different question of them:

     stage 0   who decides, and who never has to      (Lukes)
     stage 1   what counts as knowing                 (Foucault)
     stage 2   who is believed, and what can be said  (Fricker)
     stage 3   all three together

   Each stage asks for two things: which items this lens brings into focus,
   and what it leaves less visible. It then reports what the lens actually
   makes visible, what that costs, and the remedy it implies.

   WHY NO THEORIST NAMES IN THE TASK
   ---------------------------------
   The brief for this tool is explicit that matching names to definitions is
   not the exercise. Each lens is introduced by its central question. The
   names appear only in the teaching notes, so that a learner who has never
   heard them can still do the analysis and a learner who has cannot shortcut
   it.

   THE KEY, AND WHY IT HAS THREE LEVELS
   ------------------------------------
   Every item is marked `core`, `partly` or `no` for each lens. The overlaps
   are deliberate and are the most valuable part of the activity: item 4 (the
   technicians who stopped reporting) is core to the first lens, partly to the
   second and partly to the third, and a learner who selects it under all
   three is agreed with all three times. The key is one defensible reading of
   an invented case, written to make the contrasts sharp - not a fact.

   WHAT THIS IS NOT
   ----------------
   Brackwell and Ferrand are inventions; no real institution, incident,
   inquiry or person is described. Applying a lens is an interpretation, not
   evidence. These are not the only three lenses, and each is contested in its
   own literature.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* --- The case file -------------------------------------------------------- */

  var EVIDENCE = [
    {
      id: 1,
      short: "Who reported: 11 of 14 reports came from technicians and evening students",
      text:
        "Over two years, fourteen written reports were made about fumes and " +
        "headaches in Workshop 3. Eleven came from technicians and part-time " +
        "evening students; three came from full-time academic staff."
    },
    {
      id: 2,
      short: "The agenda: deferred twice, then moved to any other business and not minuted",
      text:
        "\"Workshop air quality\" appeared on the Estates Committee agenda " +
        "twice and was deferred on both occasions. On the third occasion it " +
        "was moved to any other business and does not appear in the minutes."
    },
    {
      id: 3,
      short: "The definition: a reportable concern must be \"supported by an instrument reading\"",
      text:
        "The College's Health and Safety Manual defines a reportable " +
        "environmental concern as one \"supported by an instrument reading\". " +
        "The monitoring equipment is held by Estates; technicians have no " +
        "access to it."
    },
    {
      id: 4,
      short: "Stopping: \"nothing comes of it\"; \"you learn what counts as a real problem here\"",
      text:
        "Three technicians said in interview that they had stopped reporting " +
        "because \"nothing comes of it\". One said: \"you learn what counts as " +
        "a real problem here\"."
    },
    {
      id: 5,
      short: "The survey: one fixed point, measured in a week the workshop was shut",
      text:
        "An air-quality survey commissioned by Estates measured particulates " +
        "at a single fixed point, during a week when Workshop 3 was closed for " +
        "refitting. Its conclusion, \"no exceedance recorded\", is cited in " +
        "every subsequent paper."
    },
    {
      id: 6,
      short: "The summary: themes ranked by keyword frequency; \"ventilation\" came seventh",
      text:
        "Twenty-two free-text comments in the staff wellbeing survey mentioned " +
        "the workshop. The published summary reported the top five themes by " +
        "keyword frequency; \"ventilation\" ranked seventh and was not " +
        "reported."
    },
    {
      id: 7,
      short: "The log: \"a smell that gets into your throat\" recorded as \"odour complaint - no action\"",
      text:
        "Two evening students described \"a smell that gets into your throat\". " +
        "The incident log records both reports as \"odour complaint - no " +
        "action\"."
    },
    {
      id: 8,
      short: "The vocabulary: no category for an intermittent exposure with delayed symptoms",
      text:
        "The reporting system has no category for an intermittent exposure " +
        "whose symptoms appear hours later. The nearest available category is " +
        "\"near miss\", which requires an identifiable event."
    },
    {
      id: 9,
      short: "The register: forty estates risks ranked by insurance exposure; the workshop absent",
      text:
        "When a new Principal asked what the outstanding estates risks were, " +
        "the register listed forty items ranked by insurance exposure. " +
        "Workshop 3 was not among them."
    }
  ];

  /* --- The three lenses ------------------------------------------------------ */

  var LENSES = [
    {
      key: "decisions",
      title: "Who decides, and who never has to",
      question:
        "Ask: what was decided, what never reached the point of being " +
        "decided, and how did people come to want less than they might have?",
      /* item id -> core | partly | no */
      focus: { 1: "no", 2: "core", 3: "partly", 4: "core", 5: "partly", 6: "no", 7: "no", 8: "no", 9: "core" },
      itemWhy: {
        1: "Who happened to be doing the reporting is not a question about " +
           "decisions or agendas. The third lens is built for it.",
        2: "The clearest thing in the file. Nothing was resolved; an item was " +
           "kept from becoming a question anyone had to answer.",
        3: "Defensible. A rule that keeps a class of experience out of the " +
           "record can be read as agenda-setting made permanent - though who " +
           "wrote it, and whether anyone intended it, the file does not say.",
        4: "The third dimension exactly: people who have learned what counts " +
           "stop asking, and the institution is spared the trouble of " +
           "refusing them.",
        5: "Defensible. Estates commissioned it, and a survey that answers a " +
           "question before it is asked keeps it off the agenda. The lens " +
           "would want to know who chose the week.",
        6: "The lens can call this agenda-setting, but what is doing the work " +
           "is a counting method. The second lens has more to say.",
        7: "This is a downgrading of a speaker, not a management of an " +
           "agenda. The third lens owns it.",
        8: "An absence in the vocabulary is not a decision anybody took or " +
           "avoided. The third lens names this precisely.",
        9: "What the register lists is what the institution can attend to. " +
           "An item that never appears never needs deciding."
      },
      shadow: [
        {
          value: "agenda",
          label: "That an item was repeatedly kept off the agenda",
          correct: false,
          why:
            "That is what this lens foregrounds, not what it hides. Item 2 is " +
            "its clearest exhibit."
        },
        {
          value: "protocol",
          label:
            "That a written definition and a sampling protocol go on producing " +
            "the same answer without anyone deciding anything, ever",
          correct: true,
          why:
            "This is the cost of an account built around decisions, non-decisions " +
            "and shaped preferences. All three still look for something an agent " +
            "did or refrained from doing. Items 3, 5 and 6 need no agent at all: " +
            "the definition and the protocol were written once and now run by " +
            "themselves, and would keep running if every person in the file were " +
            "replaced tomorrow."
        },
        {
          value: "stopped",
          label: "That people stopped reporting because they had learned what counted",
          correct: false,
          why:
            "This is the third dimension of the very account you are applying - " +
            "power at its most effective, preventing the grievance from forming. " +
            "Item 4 is what the lens exists for."
        },
        {
          value: "register",
          label: "That the risk register ranks by insurance exposure",
          correct: false,
          why:
            "The lens reaches this comfortably, by reading the register as a " +
            "standing agenda. What it is less good at is the fact that the " +
            "ranking does its work without anybody applying it to Workshop 3."
        }
      ],
      visible:
        "There is no decision anywhere in this file. Nothing was resolved, " +
        "nobody weighed the reports and rejected them - and something happened " +
        "anyway. An item was deferred, deferred again and unminuted; a register " +
        "never listed it; and three people stopped reporting because they had " +
        "learned what counted here.",
      shadowText:
        "Everything this lens sees needs somebody who acted or refrained from " +
        "acting. The definition in the manual and the sampling protocol in the " +
        "survey need nobody: written once, they now produce the same answer " +
        "by themselves.",
      remedy:
        "Make the agenda contestable. Publish every deferral, let staff place " +
        "items on the committee agenda directly, and require that a request is " +
        "either actioned or refused in a recorded decision.",
      remedyLeaves:
        "The survey protocol still reports no exceedance, and the manual still " +
        "says a concern needs an instrument reading. A perfectly open agenda " +
        "can be fed nothing to put on it.",
      row: {
        focus: "An item deferred and unminuted, a register that never listed it, and people who stopped reporting",
        shadow: "A definition and a protocol that keep producing the same answer with nobody deciding anything",
        remedy: "Publish deferrals, let staff set the agenda, require a recorded decision either way"
      }
    },
    {
      key: "knowledge",
      title: "What counts as knowing",
      question:
        "Ask: what is allowed to count as evidence here, which procedures " +
        "produce the institution's version of the truth, and what does the " +
        "classification make it possible to see?",
      focus: { 1: "no", 2: "no", 3: "core", 4: "partly", 5: "core", 6: "core", 7: "no", 8: "partly", 9: "partly" },
      itemWhy: {
        1: "The distribution of reporters is a fact about speakers, not about " +
           "the procedures that make knowledge. The third lens is built for it.",
        2: "A deferral is an ordinary act by identifiable people. This lens " +
           "has less purchase here than the first one does.",
        3: "The centrepiece. A definition decides in advance whose experience " +
           "can enter the record, and it decides it permanently, without any " +
           "occasion.",
        4: "Defensible and interesting. \"You learn what counts as a real " +
           "problem here\" is a description of being trained into an " +
           "institution's standard of the real - which is this lens's " +
           "territory as much as the first lens's.",
        5: "A procedure that produces the institution's official truth. One " +
           "point, in a week the room was shut, and \"no exceedance recorded\" " +
           "now travels through every later paper on its own authority.",
        6: "A counting method that constitutes what the \"themes\" are. " +
           "Twenty-two comments existed; the method decided they were not a " +
           "theme.",
        7: "The downgrading of a speaker is not primarily about procedure. " +
           "The third lens names it better.",
        8: "Defensible. An absent category is a limit on what the institution " +
           "can know - though the third lens has a sharper name for the harm " +
           "that follows.",
        9: "Defensible. A register ranked by insurance exposure is a " +
           "classification that decides what kind of thing a risk is before " +
           "anyone looks."
      },
      shadow: [
        {
          value: "definition",
          label: "That the definition of a reportable concern settles whose experience can enter the record",
          correct: false,
          why:
            "That is this lens's central exhibit, not its blind spot. Item 3."
        },
        {
          value: "survey",
          label: "That the survey's method produced its own finding",
          correct: false,
          why:
            "Also foregrounded. Item 5 is exactly what an account of power " +
            "working through knowledge is for."
        },
        {
          value: "agents",
          label:
            "That identifiable people deferred a specific item, that somebody's " +
            "interest was served by it, and that somebody could be answerable",
          correct: true,
          why:
            "This is the price of treating power as productive and dispersed " +
            "rather than held. It buys you the ability to see a definition as an " +
            "exercise of power; it costs you the vocabulary of interests, " +
            "responsibility and blame. Item 2 has names and dates attached to it, " +
            "and this lens has nothing much to do with them - which matters if " +
            "anybody is going to be held to account."
        },
        {
          value: "summary",
          label: "That the wellbeing summary's ranking method buried twenty-two comments",
          correct: false,
          why:
            "Foregrounded. Item 6 is a counting method constituting what counts " +
            "as a theme, which is this lens at its most useful."
        }
      ],
      visible:
        "The College has produced a body of knowledge in which there is no " +
        "problem, and it did so entirely by legitimate means. A definition " +
        "settles what can enter the record; a survey measured one point in a " +
        "week the room was shut and now circulates as authority; a summary " +
        "method decided that twenty-two comments were not a theme. Nobody had " +
        "to be dishonest at any point.",
      shadowText:
        "Because power is treated as dispersed and productive rather than held, " +
        "the account has trouble saying who should answer for anything. Item 2 " +
        "has people and dates attached; this lens has little use for them.",
      remedy:
        "Change what counts as knowing. Rewrite the definition of a reportable " +
        "concern so that repeated symptom reports qualify; change the sampling " +
        "protocol to cover working conditions; put monitoring equipment in the " +
        "hands of the people in the room; publish the survey's method alongside " +
        "its findings.",
      remedyLeaves:
        "The Estates Committee can still defer the item, and the reports still " +
        "come from people whose word travels less far. Better evidence does not " +
        "put itself on an agenda.",
      row: {
        focus: "The definition of a reportable concern, the survey's sampling, and the summary's ranking method",
        shadow: "Identifiable people, interests served, and anybody who could be held answerable",
        remedy: "Rewrite the definition, change the sampling protocol, hand the monitoring equipment over"
      }
    },
    {
      key: "credibility",
      title: "Who is believed, and what can be said",
      question:
        "Ask: whose word travelled, whose was downgraded because of who they " +
        "are, and was there anything here that nobody had the words for?",
      focus: { 1: "core", 2: "no", 3: "no", 4: "partly", 5: "no", 6: "partly", 7: "core", 8: "core", 9: "no" },
      itemWhy: {
        1: "The distribution is the finding. Eleven of fourteen reports came " +
           "from the two groups in the building whose word carries least, and " +
           "the three that came from full-time academics are the ones that " +
           "reached paper.",
        2: "A deferral is a matter of agendas, not of credibility. The first " +
           "lens owns it.",
        3: "This lens can note that the rule excludes people without equipment, " +
           "but the rule is a procedure. The second lens explains it better.",
        4: "Defensible and important. People who have repeatedly not been " +
           "believed stop speaking, and the silence is then read as the absence " +
           "of a problem.",
        5: "A sampling decision is not about who was believed. The second lens " +
           "owns it.",
        6: "Defensible. A method that ranks by keyword frequency can bury " +
           "testimony without anybody disbelieving a word of it - which is " +
           "close to, but not the same as, being disbelieved.",
        7: "Testimonial injustice in one line. \"A smell that gets into your " +
           "throat\" is a symptom report; it was received as an odour " +
           "complaint, and the difference is the speaker.",
        8: "The other kind of harm, and the one people miss. There is no " +
           "category for what happened, so even a completely credible speaker " +
           "has nothing to put in the box.",
        9: "The register's ranking has nothing to do with who spoke. The first " +
           "and second lenses divide this one between them."
      },
      shadow: [
        {
          value: "who",
          label: "That the reports came overwhelmingly from technicians and evening students",
          correct: false,
          why:
            "That is this lens's first exhibit, not its blind spot. Item 1."
        },
        {
          value: "category",
          label: "That there is no category for an intermittent exposure with delayed symptoms",
          correct: false,
          why:
            "Also foregrounded, and it is the half of this account that people " +
            "forget: a gap in the shared vocabulary is a harm even where every " +
            "speaker is believed. Item 8."
        },
        {
          value: "grade",
          label: "That the same words from a full-time academic would have travelled further",
          correct: false,
          why:
            "Foregrounded. This is the comparison item 1 sets up and the reason " +
            "the distribution of reporters is worth counting at all."
        },
        {
          value: "machinery",
          label:
            "That the register, the survey protocol and the manual's definition " +
            "would produce the same outcome even if every speaker were believed",
          correct: true,
          why:
            "This is the cost of locating the wrong in an epistemic relation. It " +
            "makes a real and often invisible harm nameable - and it points at " +
            "how reports are received, which slides easily into the individual " +
            "virtue of whoever receives them. Believe every technician in the " +
            "building, and item 5 still says no exceedance was recorded and item " +
            "9 still ranks by insurance value."
        }
      ],
      visible:
        "Two different things went wrong with the people who spoke. One is " +
        "about belief: eleven of fourteen reports came from the groups whose " +
        "word carries least, and \"a smell that gets into your throat\" was " +
        "received as an odour complaint. The other is not about belief at all: " +
        "the system has no category for an intermittent exposure with delayed " +
        "symptoms, so even a trusted speaker has nothing to put in the box.",
      shadowText:
        "The wrong is located in an epistemic relation, which makes it nameable " +
        "and also makes it look like a matter of how individuals receive " +
        "reports. A protocol and a register need no speaker at all, and go on " +
        "working whatever anybody believes.",
      remedy:
        "Change credibility and vocabulary. Weight a report by exposure rather " +
        "than by the grade of whoever made it; create a category for " +
        "intermittent exposure with delayed onset; train the people who receive " +
        "reports in how a symptom report differs from a complaint about a smell.",
      remedyLeaves:
        "The register still ranks by insurance exposure and the committee can " +
        "still defer. Being believed and having the words is not the same as " +
        "being on anybody's list.",
      row: {
        focus: "Who reported, whose words were downgraded, and what nobody had a category for",
        shadow: "Machinery that produces the same outcome whether or not anyone is believed",
        remedy: "Weight reports by exposure not grade, add the missing category, train those receiving reports"
      }
    }
  ];

  /* --- The synthesis judgement ----------------------------------------------- */

  var FINAL_OPTIONS = [
    {
      value: "one",
      label: "The first lens has it: an item was kept off the agenda, and that is the case",
      correct: false,
      why:
        "It is the sharpest single finding, and it is not the whole case. Open " +
        "the agenda completely and the survey still reports no exceedance, the " +
        "manual still requires an instrument reading, and the two evening " +
        "students' reports are still logged as odour complaints."
    },
    {
      value: "two",
      label: "The second lens has it: the College produced a body of knowledge in which there was no problem",
      correct: false,
      why:
        "Also true, and also not the whole case. Rewrite every definition and " +
        "change every protocol, and the Estates Committee can still defer the " +
        "item to any other business, and nobody is answerable for having done " +
        "so three times."
    },
    {
      value: "three",
      label: "The third lens has it: the wrong people were speaking and they were not believed",
      correct: false,
      why:
        "True of items 1 and 7, and it stops short. Believe every technician in " +
        "the building and item 9 still ranks estates risks by insurance " +
        "exposure, which is not a judgement about anybody's credibility and " +
        "would not change."
    },
    {
      value: "all",
      label: "Three different mechanisms were working at once, each with its own remedy, and no one remedy would have stopped the others",
      correct: true,
      why:
        "This is not a diplomatic answer, and it is not a way of avoiding a " +
        "choice. Each lens names a mechanism the other two cannot see, and each " +
        "remedy leaves the other two mechanisms running - the comparison table " +
        "says exactly which. The harder question, which this tool does not " +
        "answer, is what a college with one term and a small budget should do " +
        "first."
    }
  ];

  /* --- The transfer challenge ------------------------------------------------ */

  var CLAIMS = [
    {
      id: "measure",
      text:
        "Suppose Ferrand adds \"damp\" to the keyword list and instructs " +
        "operators to take residents at their word. Which feature of the case " +
        "would go on producing the same backlog?",
      options: [
        { value: "councillors", label: "The councillors describing it as a resourcing problem" },
        { value: "measure", label: "The contractor being paid per job closed, with a reopened job counted as a new one" },
        { value: "association", label: "The request having come from a tenants' association rather than an officer" },
        { value: "list", label: "The keyword list having only twelve entries" }
      ],
      answer: "measure",
      why:
        "This is where a credibility-and-vocabulary remedy runs out. The " +
        "measure works whoever is believed and whatever words they use - and " +
        "worse, because a reopened job counts as a new one, a repair that fails " +
        "registers as productivity. Nothing about belief or vocabulary touches " +
        "that."
    },
    {
      id: "nodecision",
      text:
        "Four years of requests to add one word, and no decision on record. " +
        "Which description fits the evidence best?",
      options: [
        { value: "against", label: "A decision was taken against the tenants' association" },
        { value: "never", label: "The request never became a question anyone had to decide" },
        { value: "concepts", label: "The tenants lacked the concepts to describe the problem" },
        { value: "disbelief", label: "The operators disbelieved the residents" }
      ],
      answer: "never",
      why:
        "An analysis that only looks at decisions finds nothing here, because " +
        "there is no decision - and that is the finding. The third option is " +
        "wrong in an instructive way: the tenants had the word and asked for it, " +
        "so the concept existed and the system lacked the slot, which is a " +
        "different problem with a different remedy. The fourth may well be true, " +
        "but none of the four findings establishes it."
    },
    {
      id: "keywords",
      text: "What does the fixed list of twelve keywords do?",
      options: [
        { value: "neutral", label: "It speeds up call handling without affecting what gets recorded" },
        { value: "constitutes", label: "It fixes the range of problems the council is subsequently able to say it has" },
        { value: "training", label: "It shows that the operators are poorly trained" },
        { value: "intent", label: "It proves that the council set out to conceal damp" }
      ],
      answer: "constitutes",
      why:
        "A classification device is never neutral. The categories available at " +
        "the moment of logging become the categories in which the council can " +
        "afterwards count, budget, report and think - so a problem with no " +
        "keyword is a problem the council cannot have. The last option " +
        "overreaches: nothing here establishes intention, and the analysis is " +
        "stronger precisely because it does not need any."
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

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#power-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var caseList = $("[data-case-list]");

  var stageTrack = $("[data-stage-track]");
  var lensBlock = $("[data-lens-block]");
  var lensLegend = $("[data-lens-legend]");
  var lensQuestion = $("[data-lens-question]");
  var evidencePicks = $("[data-evidence-picks]");
  var lensNote = $("[data-lens-note]");
  var applyButton = $('[data-action="apply"]');
  var nextButton = $('[data-action="next"]');
  var synthesisBlock = $("[data-synthesis-block]");
  var finalPicks = $("[data-final-picks]");
  var finalNote = $("[data-final-note]");

  var primaryHeading = $("[data-primary-heading]");
  var primaryBody = $("[data-primary-body]");
  var detail = $("[data-detail]");
  var comparison = $("[data-comparison]");
  var comparisonBody = $("[data-comparison-body]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var INITIAL = {
    stage: 0,
    applied: [false, false, false],
    picks: [[], [], []],
    shadow: [null, null, null],
    finalAnswer: null
  };
  var state = null;

  /* --- The case file, printed once above the laboratory --------------------- */

  function buildCase() {
    clear(caseList);
    EVIDENCE.forEach(function (item) {
      var li = make("li", "ledger__item");
      li.appendChild(make("strong", "ledger__number", "Item " + item.id + ". "));
      li.appendChild(document.createTextNode(item.text));
      caseList.appendChild(li);
    });
  }

  /* --- Controls for the current lens ---------------------------------------- */

  function buildEvidencePicks() {
    clear(evidencePicks);
    var lens = LENSES[state.stage];
    if (!lens) { return; }
    EVIDENCE.forEach(function (item) {
      var label = make("label", "control--choice pick");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "evidence-" + lens.key;
      input.value = String(item.id);
      input.checked = state.picks[state.stage].indexOf(item.id) !== -1;
      input.disabled = state.applied[state.stage];
      input.addEventListener("change", function () {
        var picks = state.picks[state.stage];
        var at = picks.indexOf(item.id);
        if (input.checked && at === -1) { picks.push(item.id); }
        if (!input.checked && at !== -1) { picks.splice(at, 1); }
      });
      label.appendChild(input);
      var body = make("span", "pick__body");
      body.appendChild(make("span", "pick__number", "Item " + item.id));
      body.appendChild(make("span", "pick__text", item.short));
      label.appendChild(body);
      evidencePicks.appendChild(label);
    });
  }

  /* What a lens leaves less visible is stated rather than asked. Each lens now
     carries one judgement - which items it brings into focus - so all three are
     reached before the comparison, which is where the argument actually is. */
  function buildShadowPicks() {
    var lens = LENSES[state.stage];
    if (!lens) { return; }
    var right = lens.shadow.filter(function (o) { return o.correct; })[0];
    state.shadow[state.stage] = right.value;
  }

  function buildFinalPicks() {
    clear(finalPicks);
    FINAL_OPTIONS.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "final";
      input.value = option.value;
      input.checked = state.finalAnswer === option.value;
      label.appendChild(input);
      label.appendChild(make("span", null, option.label));
      finalPicks.appendChild(label);
    });
  }

  /* --- The pinned primary ---------------------------------------------------- */

  function renderPrimary() {
    clear(primaryBody);

    if (state.stage >= LENSES.length) {
      primaryHeading.textContent = "All three, side by side";
      primaryBody.appendChild(make("p", "lens__question",
        "Three passes, one file, three different lists of things to change. " +
        "The table below sets them against each other; the last judgement is " +
        "in the controls."));
      if (state.finalAnswer) {
        var chosen = FINAL_OPTIONS.filter(function (o) {
          return o.value === state.finalAnswer;
        })[0];
        var box = make("div", "verdict");
        box.setAttribute("data-tone", chosen.correct ? "good" : "caution");
        box.appendChild(make("h5", "verdict__title",
          chosen.correct ? "That is the reading the case supports."
            : "Partly - and here is where it stops."));
        box.appendChild(make("p", "verdict__body", chosen.why));
        primaryBody.appendChild(box);
      }
      return;
    }

    var lens = LENSES[state.stage];
    primaryHeading.textContent = "Lens " + (state.stage + 1) + ": " + lens.title;

    if (!state.applied[state.stage]) {
      primaryBody.appendChild(make("p", "lens__question", lens.question));
      primaryBody.appendChild(make("p", "text-muted",
        "Select the items this lens brings into focus and one thing it leaves " +
        "less visible, then press Apply this lens. All nine items are printed " +
        "in full in the case file above."));
      return;
    }

    var result = score(state.stage);
    primaryBody.appendChild(make("p", "lens__lead", lens.visible));
    primaryBody.appendChild(make("p", "text-muted",
      "You selected " + result.picked + " item" + (result.picked === 1 ? "" : "s") +
      ", including " + result.core + " of the " + result.coreTotal +
      " this lens is strongest on" +
      (result.wrong ? ", and " + result.wrong + " that another lens explains better."
        : ".")));
  }

  function score(stage) {
    var lens = LENSES[stage];
    var picks = state.picks[stage];
    var coreTotal = 0;
    Object.keys(lens.focus).forEach(function (id) {
      if (lens.focus[id] === "core") { coreTotal += 1; }
    });
    var core = 0;
    var partly = 0;
    var wrong = 0;
    picks.forEach(function (id) {
      var band = lens.focus[id];
      if (band === "core") { core += 1; }
      else if (band === "partly") { partly += 1; }
      else { wrong += 1; }
    });
    return {
      picked: picks.length,
      core: core,
      partly: partly,
      wrong: wrong,
      coreTotal: coreTotal
    };
  }

  /* --- The detail block ------------------------------------------------------- */

  var BAND_WORD = {
    core: "Central to this lens",
    partly: "Defensible under this lens",
    no: "Another lens explains this better"
  };

  function renderDetail() {
    clear(detail);
    if (state.stage >= LENSES.length) { return; }
    if (!state.applied[state.stage]) { return; }

    var lens = LENSES[state.stage];
    var picks = state.picks[state.stage];

    /* Item-by-item: everything the learner picked, plus any core item they
       missed, so the feedback explains rather than scores. */
    var shown = picks.slice().sort(function (a, b) { return a - b; });
    Object.keys(lens.focus).forEach(function (id) {
      var n = Number(id);
      if (lens.focus[id] === "core" && shown.indexOf(n) === -1) { shown.push(n); }
    });
    shown.sort(function (a, b) { return a - b; });

    var itemsBox = make("div");
    itemsBox.appendChild(make("h4", "stage__heading", "Item by item"));
    var list = make("ul", "item-notes");
    shown.forEach(function (id) {
      var band = lens.focus[id];
      var chosen = picks.indexOf(id) !== -1;
      var li = make("li");
      li.setAttribute("data-band", band);
      var head = make("p", "item-notes__head");
      head.appendChild(make("strong", null, "Item " + id + " - " + BAND_WORD[band] + "."));
      head.appendChild(document.createTextNode(
        chosen ? " You selected it." : " You did not select it."));
      li.appendChild(head);
      li.appendChild(make("p", null, lens.itemWhy[id]));
      list.appendChild(li);
    });
    itemsBox.appendChild(list);
    detail.appendChild(itemsBox);

    /* The shadow judgement. Stated rather than asked, so it has to name the
       blind spot itself: the label carries what is left less visible and the
       note carries why that follows from the lens's own commitment. */
    var picked = lens.shadow.filter(function (o) {
      return o.value === state.shadow[state.stage];
    })[0];
    var shadowBox = make("div", "verdict");
    shadowBox.setAttribute("data-tone", "caution");
    shadowBox.appendChild(make("h5", "verdict__title",
      "What it leaves less visible"));
    shadowBox.appendChild(make("p", "verdict__body", picked.label + "."));
    shadowBox.appendChild(make("p", "verdict__body", picked.why));
    detail.appendChild(shadowBox);

    /* The remedy. */
    var remedyBox = make("div", "verdict");
    remedyBox.setAttribute("data-tone", "warn");
    remedyBox.appendChild(make("h5", "verdict__title", "The remedy this lens implies"));
    remedyBox.appendChild(make("p", "verdict__body", lens.remedy));
    remedyBox.appendChild(make("p", "verdict__note",
      "And what it leaves running: " + lens.remedyLeaves));
    detail.appendChild(remedyBox);
  }

  /* --- The comparison table ----------------------------------------------------- */

  function renderComparison() {
    var done = state.applied.filter(Boolean).length;
    comparison.hidden = done === 0;
    clear(comparisonBody);
    LENSES.forEach(function (lens, index) {
      if (!state.applied[index]) { return; }
      var tr = make("tr");
      var th = make("th", null, lens.title);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, lens.row.focus));
      tr.appendChild(make("td", null, lens.row.shadow));
      tr.appendChild(make("td", null, lens.row.remedy));
      comparisonBody.appendChild(tr);
    });
  }

  /* --- Stage track --------------------------------------------------------------- */

  function renderTrack() {
    $$("li", stageTrack).forEach(function (li, index) {
      li.removeAttribute("aria-current");
      if (index < 3 && state.applied[index]) {
        li.setAttribute("data-state", "done");
      } else if (index === 3 && state.finalAnswer) {
        li.setAttribute("data-state", "done");
      } else {
        li.removeAttribute("data-state");
      }
      if (index === state.stage) { li.setAttribute("aria-current", "step"); }
    });
  }

  /* --- Render ------------------------------------------------------------------- */

  function render() {
    var atSynthesis = state.stage >= LENSES.length;
    lensBlock.hidden = atSynthesis;
    synthesisBlock.hidden = !atSynthesis;

    if (!atSynthesis) {
      var lens = LENSES[state.stage];
      lensLegend.textContent = "Lens " + (state.stage + 1) + " of 3 - " + lens.title;
      lensQuestion.textContent = lens.question;
      buildEvidencePicks();
      buildShadowPicks();
      applyButton.hidden = state.applied[state.stage];
      nextButton.hidden = !state.applied[state.stage];
      nextButton.textContent = state.stage === LENSES.length - 1
        ? "Go to the synthesis"
        : "Next lens";
    } else {
      buildFinalPicks();
    }

    renderPrimary();
    renderDetail();
    renderComparison();
    renderTrack();
  }

  /* --- Actions ------------------------------------------------------------------- */

  applyButton.addEventListener("click", function () {
    if (!state.picks[state.stage].length) {
      lensNote.textContent =
        "Select at least one item before applying the lens. There is no " +
        "penalty for a selection the key disagrees with - the feedback " +
        "explains every item either way.";
      shell.announce(lensNote.textContent, { immediate: true });
      return;
    }
    lensNote.textContent = "";
    state.applied[state.stage] = true;
    render();
    var result = score(state.stage);
    shell.announce(
      "Lens applied. " + result.core + " of " + result.coreTotal +
      " central items found. The reading is beside you, with a note on every " +
      "item and the remedy this lens implies.",
      { immediate: true });
  });

  nextButton.addEventListener("click", function () {
    state.stage += 1;
    render();
    shell.announce(
      state.stage >= LENSES.length
        ? "Synthesis stage. All three lenses are now in the table."
        : "Lens " + (state.stage + 1) + " of 3: " + LENSES[state.stage].title +
          ". The same nine items, a different question.",
      { immediate: true });
  });

  $('[data-action="final"]').addEventListener("click", function () {
    var picked = $('input[name="final"]:checked');
    if (!picked) {
      finalNote.textContent = "Choose one of the four before recording it.";
      shell.announce(finalNote.textContent, { immediate: true });
      return;
    }
    finalNote.textContent = "";
    state.finalAnswer = picked.value;
    render();
    shell.announce("Judgement recorded. The response is beside you.",
      { immediate: true });
  });

  /* --- Challenge ------------------------------------------------------------------ */

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
      claim.options.forEach(function (option) {
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
      showFeedback(claimsFeedback, "caution", "One answer per question, please.",
        "All three are about the same four findings.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 2 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", right + " of 3 match."));
    lead.appendChild(document.createTextNode(
      "None of the three asks you to name a framework. They ask what a " +
        "particular feature of the case is doing."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var answerLabel = claim.options.filter(function (o) {
        return o.value === claim.answer;
      })[0].label;
      var yours = claim.options.filter(function (o) {
        return o.value === answers[index];
      })[0].label;
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null, (index + 1) + ": " + answerLabel + "."));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said." : " You said: " + yours.toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Three questions answered. " + right + " match.",
      { immediate: true });
  });

  /* --- Opening prediction ----------------------------------------------------------- */

  var OPENING = {
    nobody: {
      tone: "caution",
      verdict: "That is one reading, and the laboratory is an argument against it.",
      text:
        "\"Ordinary institutional failure\" is what a case looks like when you " +
        "have no vocabulary for power that operates without anybody deciding " +
        "anything. Each of the three passes below is an attempt to give you one."
    },
    decision: {
      tone: "caution",
      verdict: "Look for the decision. There isn't one.",
      text:
        "This is the most common answer and the most useful mistake. Nothing " +
        "in the file resolves that the workshop is safe; no manager weighs the " +
        "reports and rejects them. Something happened anyway, and that is the " +
        "discovery the first lens exists to produce."
    },
    agenda: {
      tone: "good",
      verdict: "That is one of the three mechanisms, and the first lens is built for it.",
      text:
        "Item 2 is its clearest exhibit. Keep hold of it, and then ask what " +
        "the other two lenses find that this one cannot - because a completely " +
        "open agenda would still have been fed a survey saying there was no " +
        "exceedance."
    },
    belief: {
      tone: "caution",
      verdict: "Half of one of the three, and it is the half people stop at.",
      text:
        "Being disbelieved is real here - item 7 in one line. But there is a " +
        "second harm that has nothing to do with belief: the system has no " +
        "category for what happened, so even a completely trusted speaker has " +
        "nothing to put in the box. The third lens separates them."
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
    render();
    shell.announce(
      "Laboratory open at lens 1 of 3: who decides, and who never has to.",
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

  /* --- Worked example ------------------------------------------------------------------ */

  $('[data-action="worked"]').addEventListener("click", function () {
    /* Apply all three lenses with the key's own core selections and the
       shadow answer the case supports, then land on the synthesis so the
       comparison table is complete. */
    LENSES.forEach(function (lens, index) {
      var core = [];
      Object.keys(lens.focus).forEach(function (id) {
        if (lens.focus[id] === "core") { core.push(Number(id)); }
      });
      state.picks[index] = core.sort(function (a, b) { return a - b; });
      state.shadow[index] = lens.shadow.filter(function (o) {
        return o.correct;
      })[0].value;
      state.applied[index] = true;
    });
    state.stage = LENSES.length;
    state.finalAnswer = null;
    render();
    shell.announce(
      "Worked example: all three lenses applied with the key's own selections. " +
      "The comparison table is complete - read the last column and ask what " +
      "each remedy leaves running.",
      { immediate: true });
  });

  /* --- Reset and start-up ---------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    comparison.hidden = true;
    lensNote.textContent = "";
    finalNote.textContent = "";
    claimsForm.reset();
    claimsFeedback.hidden = true;
    render();
  });

  buildCase();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Read the nine items above, then answer the question to open the " +
    "laboratory.",
    { immediate: true });
})();
