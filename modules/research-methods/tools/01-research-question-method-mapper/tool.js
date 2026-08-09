/* =========================================================================
   Research Question to Method Mapper
   -------------------------------------------------------------------------
   Six fictional research questions, presented one at a time. For each, the
   learner decides four things — the aim of the question, whether it is
   qualitative, quantitative or mixed, what design it implies, and what they
   would still need to know — and receives explanatory feedback on each part
   separately.

   THE EDUCATIONAL MODEL
   ---------------------
   There is no scoring and no single answer key. Each option, for each
   question, carries a standing:

       strong  — well supported by the wording as written
       ok      — defensible, and the note says what it would commit you to
       weak    — hard to defend from this wording, and the note says why

   For part 4 ("what do you still need to know") the standings are different
   in kind, because the question is about what is missing rather than what is
   right:

       key     — genuinely unknown and would change the analysis
       fair    — reasonable to want, for a stated reason
       given   — already stated in the vignette; selecting it is a reading slip
       none    — would not bear on this question

   Question 6 is deliberately ambiguous: explanation and interpretation are
   both marked strong, and so are all three of qualitative, quantitative and
   mixed. The tool says so rather than picking a winner, because the choice
   follows from what the researcher thinks an answer would look like — a
   commitment the wording does not contain.

   No test is ever named. The mapper stops at the point where a test could
   sensibly be chosen, because the reasoning up to that point is what students
   most often skip.

   All six questions, samples and settings are invented for teaching. No data
   leave the browser: there is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     Option labels
     ===================================================================== */

  var AIM_LABEL = {
    description: "Description",
    difference: "Difference",
    association: "Association",
    prediction: "Prediction",
    explanation: "Explanation",
    interpretation: "Interpretation"
  };

  var KIND_LABEL = {
    qualitative: "Qualitative",
    quantitative: "Quantitative",
    mixed: "Mixed"
  };

  var DESIGN_LABEL = {
    survey: "Cross-sectional survey",
    between: "Between-groups experiment",
    within: "Within-participants experiment",
    repeated: "Repeated observations within people",
    cohort: "Existing records or a cohort dataset",
    interview: "Interview or focus-group study"
  };

  var NEED_LABEL = {
    measurement: "Level of measurement of the outcome",
    independence: "Independent or nested observations",
    epistemology: "The researcher's epistemological position",
    sampling: "How the sample was recruited, and who is missing",
    predictors: "How many predictors, and how they overlap",
    allocation: "Whether conditions were allocated by the researcher"
  };

  var STANDING_WORD = {
    strong: "Well supported",
    ok: "Defensible",
    weak: "Hard to defend from this wording"
  };

  /* =======================================================================
     The six questions
     ===================================================================== */

  var CASES = [
    {
      short: "Belonging",
      question:
        "How do first-year students describe their sense of belonging during " +
        "their first semester?",
      context:
        "Fictional study. The researcher plans to interview 15 students twice, " +
        "in week 3 and again in week 11.",
      aim: {
        strong: ["interpretation"],
        ok: ["description"],
        notes: {
          interpretation:
            "The verb is \"describe\" and the describing is being done by the " +
            "students. An answer would be an account of how belonging is " +
            "talked about and made sense of, not a quantity.",
          description:
            "Defensible if you read \"describe\" as the researcher describing " +
            "a distribution. But nothing in the wording points to a quantity, " +
            "and \"how do students describe\" puts the describing in the " +
            "participants' hands.",
          difference:
            "There is no comparison in the wording. Week 3 against week 11 is " +
            "a comparison you could build, but the question as written does " +
            "not ask for it.",
          association:
            "Nothing is being related to anything else. Association needs two " +
            "things that can vary; only one is named.",
          prediction:
            "No outcome is being forecast, and no forecasting variables are " +
            "named.",
          explanation:
            "Explanation would ask what produces a sense of belonging. This " +
            "question asks what it is like from the inside, which is a " +
            "different job."
        }
      },
      kind: {
        strong: ["qualitative"],
        ok: [],
        notes: {
          qualitative:
            "Yes. The material would be talk, and the analysis would work on " +
            "meaning rather than on a variable.",
          quantitative:
            "You could build a belonging scale and report means. That would " +
            "answer a different question — how much belonging, rather than " +
            "how it is described — and it would not be this study.",
          mixed:
            "Possible in principle, but a design only earns the name mixed " +
            "when each strand answers a stated part of one question. Nothing " +
            "here requires a numeric strand."
        }
      },
      design: {
        strong: ["interview"],
        ok: ["repeated"],
        notes: {
          interview:
            "Two interviews with each of 15 students. The data are accounts.",
          repeated:
            "Not wrong: each student is met twice, so there is a longitudinal " +
            "element. But \"repeated observations\" usually implies repeated " +
            "measurement of a variable, and nothing is being measured here.",
          survey:
            "A survey would give you fixed responses to fixed questions. That " +
            "removes exactly what this question is after.",
          between: "Nothing is allocated and there are no groups to compare.",
          within: "Nothing is manipulated.",
          cohort:
            "There are no existing records; the material has to be generated " +
            "by talking to people."
        }
      },
      needs: {
        epistemology: {
          standing: "key",
          note:
            "The decision everything else waits on. An experiential reading " +
            "treats the accounts as reports of inner states; a critical or " +
            "discursive reading treats them as talk doing something in a " +
            "particular setting. The same transcripts support both, and the " +
            "analytic approach follows from which one is taken."
        },
        sampling: {
          standing: "fair",
          note:
            "Worth knowing, though not for the reason it matters in a survey. " +
            "Here it bears on whose accounts are present and whose are absent, " +
            "not on estimating a population value."
        },
        measurement: {
          standing: "none",
          note: "There is no outcome variable to have a level of measurement."
        },
        independence: {
          standing: "none",
          note:
            "This matters when observations are pooled into an estimate. " +
            "Nothing here is being pooled."
        },
        predictors: { standing: "none", note: "No predictors are named." },
        allocation: { standing: "none", note: "Nothing is being allocated." }
      }
    },

    {
      short: "Mindfulness",
      question:
        "Does a 20-minute recorded mindfulness exercise reduce self-reported " +
        "exam anxiety more than a 20-minute audiobook does?",
      context:
        "Fictional study. Ninety volunteers are randomly assigned to one of " +
        "the two recordings and complete an anxiety measure immediately " +
        "afterwards.",
      aim: {
        strong: ["difference"],
        ok: [],
        notes: {
          difference:
            "Two conditions, one outcome, and the question is whether the " +
            "outcome differs between them. Because allocation was random, a " +
            "difference here can support a causal claim about the effect of " +
            "the recording.",
          explanation:
            "Close, and worth pulling apart. Random allocation licenses a " +
            "causal claim about the effect, but the question does not ask what " +
            "produces the effect or how it works. Asking whether something " +
            "works and asking how it works are separate studies.",
          description:
            "Description would report the anxiety scores. The question asks " +
            "for a comparison between two conditions.",
          association:
            "You could code condition as a variable and correlate it with " +
            "anxiety. The arithmetic would be near identical; the claim would " +
            "be weaker, because it would stop describing the allocation that " +
            "makes this study worth doing.",
          prediction:
            "Nothing is being forecast for a new case. The question is about " +
            "the effect of a manipulation on the people studied.",
          interpretation:
            "There is no meaning-making being investigated. What the recording " +
            "meant to participants would be an interesting second study."
        }
      },
      kind: {
        strong: ["quantitative"],
        ok: [],
        notes: {
          quantitative:
            "An outcome measured on a scale, compared across two allocated " +
            "conditions.",
          qualitative:
            "A qualitative study could ask what participants made of the " +
            "recordings, but it could not answer \"does it reduce anxiety " +
            "more\", because that question is about an amount.",
          mixed:
            "Adding a qualitative strand would enrich the study. It would not " +
            "be needed to answer the question as written, and calling a design " +
            "mixed only for the extra material is what gives mixed methods a " +
            "bad name."
        }
      },
      design: {
        strong: ["between"],
        ok: [],
        notes: {
          between:
            "Each person receives one of the two recordings, allocated by the " +
            "researcher.",
          within:
            "The wording says one recording per person. A within-participants " +
            "version is possible but is a different study, with an order " +
            "problem and carry-over to solve.",
          survey:
            "A survey observes; it does not allocate. That would remove the " +
            "basis for the causal claim.",
          repeated: "Anxiety is measured once, immediately afterwards.",
          cohort: "The data are generated by the study, not found in records.",
          interview: "The outcome is a measured amount, not an account."
        }
      },
      needs: {
        measurement: {
          standing: "key",
          note:
            "\"Self-reported exam anxiety\" could be one 0-10 rating or a " +
            "summed multi-item scale, and could be badly skewed. That changes " +
            "what a mean difference means and how comfortable you should be " +
            "reporting one."
        },
        sampling: {
          standing: "fair",
          note:
            "Ninety volunteers. Who volunteers for a mindfulness study is a " +
            "real limit on who the finding travels to. It does not threaten " +
            "the comparison inside the study, which is protected by the random " +
            "allocation."
        },
        allocation: {
          standing: "given",
          note:
            "Already answered: the vignette says participants were randomly " +
            "assigned."
        },
        independence: {
          standing: "none",
          note: "One observation per person, so independence is not in doubt."
        },
        predictors: {
          standing: "none",
          note: "There is one manipulated factor with two levels."
        },
        epistemology: {
          standing: "none",
          note:
            "Always worth stating, but this question is already framed as a " +
            "measurable quantity that can be raised or lowered. The commitment " +
            "is doing far less hidden work here than in question 1."
        }
      }
    },

    {
      short: "Sleep",
      question:
        "Is sleep duration on one night related to working-memory performance " +
        "the next day in shift workers?",
      context:
        "Fictional study. Forty shift workers keep a sleep diary and complete " +
        "a working-memory task each day for 14 days.",
      aim: {
        strong: ["association"],
        ok: ["prediction"],
        notes: {
          association:
            "Two things that vary, and the question is whether they vary " +
            "together. Nothing is allocated, so no causal claim is available " +
            "however strong the association turns out to be.",
          prediction:
            "Defensible if you frame it as forecasting tomorrow's performance " +
            "from last night's sleep. The model would look similar; the claim " +
            "would be about forecasting accuracy rather than about a " +
            "relationship.",
          difference:
            "You could split sleep into short and long nights and compare, but " +
            "that throws away information the question is asking about and " +
            "invents a cut-point that is not in the data.",
          explanation:
            "The question does not ask what sleep does to memory or how. " +
            "Answering it would need a manipulation, which shift patterns do " +
            "not permit and this study does not attempt.",
          description:
            "Description would report how much people sleep and how they " +
            "perform. The question is about the link between the two.",
          interpretation:
            "There is no meaning-making under investigation; both variables " +
            "are recorded quantities."
        }
      },
      kind: {
        strong: ["quantitative"],
        ok: [],
        notes: {
          quantitative: "Two recorded quantities, related to each other.",
          qualitative:
            "Workers' accounts of sleep and concentration would be valuable " +
            "and would not answer this question, which is about covariation.",
          mixed:
            "A diary-plus-interview design would be a good study. As written, " +
            "the question needs only the numeric strand."
        }
      },
      design: {
        strong: ["repeated"],
        ok: [],
        notes: {
          repeated:
            "Fourteen days per worker: the same people measured many times. " +
            "That structure is both the strength and the complication.",
          survey:
            "A survey gives one observation per person. Here each person gives " +
            "fourteen, which is what allows a within-person question at all.",
          cohort:
            "The data are being generated prospectively by the study, not " +
            "drawn from existing records.",
          between: "There are no allocated groups.",
          within:
            "Close in spirit, but \"within-participants experiment\" implies " +
            "the researcher sets the conditions. Nobody is assigning these " +
            "workers their sleep.",
          interview: "The measures are a diary entry and a task score."
        }
      },
      needs: {
        independence: {
          standing: "key",
          note:
            "This is the one. Each worker supplies 14 pairs, so 560 rows are " +
            "nested within 40 people, and treating them as 560 independent " +
            "observations badly overstates the precision. It also merges two " +
            "questions - whether people who sleep more perform better, and " +
            "whether a person performs better after their own longer nights - " +
            "which can point in opposite directions."
        },
        measurement: {
          standing: "fair",
          note:
            "Sleep duration from a diary is self-reported and rounded; a " +
            "working-memory score has a ceiling. Both matter for what the " +
            "relationship can look like."
        },
        sampling: {
          standing: "fair",
          note:
            "Forty shift workers from where, doing what shifts? Shift patterns " +
            "differ enormously and the answer may not survive the move."
        },
        allocation: {
          standing: "none",
          note:
            "Nothing is allocated, and the vignette makes that plain. It is " +
            "the reason no causal reading is available."
        },
        predictors: {
          standing: "none",
          note: "One predictor is named, so overlap between predictors is not the issue."
        },
        epistemology: {
          standing: "none",
          note:
            "Worth stating in general, but nothing in this question turns on " +
            "it in the way question 1 does."
        }
      }
    },

    {
      short: "Forecasting",
      question:
        "Which combination of prior attainment, attendance and self-efficacy " +
        "best forecasts end-of-year marks?",
      context:
        "Fictional study. A records office supplies anonymised data on 1,200 " +
        "students from a previous cohort.",
      aim: {
        strong: ["prediction"],
        ok: ["association"],
        notes: {
          prediction:
            "The word is \"forecasts\", and the criterion is how well the " +
            "combination does it. That is a question about accuracy, and it " +
            "should be judged on data the model has not seen.",
          association:
            "Defensible: a forecasting model is built out of associations. The " +
            "difference is what you report — which variables relate to marks, " +
            "or how close the predicted marks come.",
          explanation:
            "The trap. A model can forecast well using variables that produce " +
            "nothing. Attendance may simply be a symptom of the same thing " +
            "that produces marks. Forecasting well and explaining are " +
            "different achievements, and a regression coefficient does not " +
            "tell you which one you have.",
          difference:
            "No groups are being compared. You could split students into " +
            "bands, but that is an answer to a different question.",
          description:
            "Description would report attendance and marks. The question asks " +
            "how well one set forecasts the other.",
          interpretation:
            "No accounts, no meaning-making — the material is administrative " +
            "records."
        }
      },
      kind: {
        strong: ["quantitative"],
        ok: [],
        notes: {
          quantitative: "Records, variables and a forecast.",
          qualitative:
            "Qualitative work could ask what attendance means to students, " +
            "which would be a fine study and a different question.",
          mixed:
            "Only if a qualitative strand were given a stated job. Bolting one " +
            "on to explain the coefficients afterwards is a common and weak " +
            "move."
        }
      },
      design: {
        strong: ["cohort"],
        ok: ["survey"],
        notes: {
          cohort:
            "Existing records for a past cohort. The researcher had no hand in " +
            "what happened.",
          survey:
            "Defensible if self-efficacy was collected by questionnaire during " +
            "the year. The important part is that the data already exist.",
          repeated:
            "Each student appears once with an end-of-year mark, so this is " +
            "not repeated measurement even though the year has a time course.",
          between: "Nothing was allocated.",
          within: "Nothing was manipulated within a person.",
          interview: "The material is numeric records."
        }
      },
      needs: {
        predictors: {
          standing: "key",
          note:
            "Three predictors that certainly overlap: students with higher " +
            "prior attainment tend to attend more and to report more " +
            "confidence. How strongly they overlap decides which coefficients " +
            "look important, how unstable they are, and whether \"best " +
            "combination\" has a stable answer at all."
        },
        measurement: {
          standing: "fair",
          note:
            "Marks may be bounded and bunched near the top; attendance may be " +
            "a proportion; self-efficacy is a scale score. Each affects what " +
            "the model can do."
        },
        sampling: {
          standing: "fair",
          note:
            "A previous cohort at one institution. Whether the forecast " +
            "survives a new cohort is exactly the question a forecasting claim " +
            "should be tested on."
        },
        allocation: {
          standing: "given",
          note:
            "The vignette answers this: these are existing records, so nothing " +
            "was allocated. Noticing that is what stops you writing a causal " +
            "sentence about attendance."
        },
        independence: {
          standing: "none",
          note:
            "One row per student. Nesting would matter if students were " +
            "grouped in classes and that were part of the question."
        },
        epistemology: {
          standing: "none",
          note:
            "Self-efficacy as a measurable individual quantity is already a " +
            "commitment, but it is not one that changes the analysis of this " +
            "question."
        }
      }
    },

    {
      short: "Prevalence",
      question:
        "How common is loneliness among postgraduate researchers at one " +
        "university?",
      context:
        "Fictional study. An online questionnaire is circulated through " +
        "departmental mailing lists.",
      aim: {
        strong: ["description"],
        ok: [],
        notes: {
          description:
            "A quantity for a defined population: what proportion. Nothing is " +
            "compared, related or forecast.",
          association:
            "Association would ask what loneliness goes with. This question " +
            "asks only how much of it there is.",
          difference:
            "No comparison is named. Comparing departments would be a natural " +
            "follow-up and a different question.",
          prediction: "Nothing is being forecast.",
          explanation: "Nothing is being explained; a prevalence is not a cause.",
          interpretation:
            "What loneliness means to postgraduate researchers is an important " +
            "question and is not this one. \"How common\" presupposes that it " +
            "is already a countable state."
        }
      },
      kind: {
        strong: ["quantitative"],
        ok: [],
        notes: {
          quantitative: "A proportion is a number.",
          qualitative:
            "Qualitative work cannot answer \"how common\", and should not be " +
            "asked to. It can answer what the experience is like.",
          mixed:
            "A defensible pairing — a prevalence estimate plus accounts — but " +
            "only if the qualitative strand has its own stated question."
        }
      },
      design: {
        strong: ["survey"],
        ok: [],
        notes: {
          survey: "One questionnaire, one sample, one time point.",
          cohort:
            "There are no existing records here; the data are generated by the " +
            "questionnaire.",
          repeated: "One time point.",
          between: "No allocated groups.",
          within: "No manipulation.",
          interview: "The answer required is a proportion."
        }
      },
      needs: {
        sampling: {
          standing: "key",
          note:
            "The whole answer is a prevalence for a defined population. Who " +
            "receives the email, who opens it, and who feels moved to answer a " +
            "loneliness survey will move the number far more than any analytic " +
            "choice. A large sample recruited this way does not fix it."
        },
        measurement: {
          standing: "key",
          note:
            "\"Common\" needs a threshold. Loneliness has to become a cut-point " +
            "on some scale before a proportion exists, and where that cut-point " +
            "sits partly determines the prevalence you report."
        },
        epistemology: {
          standing: "fair",
          note:
            "Less obviously than in question 1, but treating loneliness as a " +
            "state a person either has or does not have is a commitment, and " +
            "the threshold above is where it becomes visible."
        },
        independence: {
          standing: "none",
          note: "One response per person."
        },
        predictors: { standing: "none", note: "Nothing is being predicted." },
        allocation: { standing: "none", note: "Nothing is being allocated." }
      }
    },

    {
      short: "Group work",
      question: "Why do some students disengage from group work?",
      context:
        "Fictional study. The researcher has access to a whole cohort and has " +
        "not yet decided what an answer would look like.",
      ambiguous:
        "This question is unsettled. \"Why\" belongs to no single " +
        "tradition, and the wording does not tell you what would count as an " +
        "answer. Two competent researchers can read it in incompatible ways " +
        "without either being wrong - and the tool will not pick between them.",
      aim: {
        strong: ["explanation", "interpretation"],
        ok: ["association"],
        notes: {
          explanation:
            "Defensible. On this reading an answer is a set of conditions that " +
            "raise or lower the chance of disengagement - group composition, " +
            "workload, assessment design, prior experience - and the study " +
            "measures them and models the outcome.",
          interpretation:
            "Equally defensible. On this reading an answer is an account of " +
            "what disengaging means and does for the students who do it, and " +
            "the study collects and analyses their accounts. This reading " +
            "usually recovers reasons the first one could not have listed in " +
            "advance.",
          association:
            "A weaker version of the explanation reading: what goes with " +
            "disengagement rather than what produces it. Honest, and often all " +
            "an observational design can actually deliver.",
          difference:
            "You would first have to define engaged and disengaged groups, " +
            "which assumes an answer to part of the question.",
          prediction:
            "Forecasting who will disengage is a different and more modest " +
            "aim than saying why. Useful for an institution; not an answer to " +
            "\"why\".",
          description:
            "Description would tell you how much disengagement there is, not " +
            "why."
        }
      },
      kind: {
        strong: ["qualitative", "quantitative", "mixed"],
        ok: [],
        notes: {
          qualitative:
            "Defensible: students' accounts of what happens in their groups, " +
            "analysed for patterned meaning.",
          quantitative:
            "Defensible: measure candidate conditions across the cohort and " +
            "model the outcome. Note what this cannot do - it can only test " +
            "reasons somebody thought of first.",
          mixed:
            "Defensible, and here more than a compromise: a qualitative " +
            "strand can generate candidate reasons and a quantitative strand " +
            "can ask how far they extend. It counts as mixed methods only if " +
            "each strand has its own stated question."
        }
      },
      design: {
        strong: ["interview", "survey", "cohort"],
        ok: ["repeated"],
        notes: {
          interview: "Fits the interpretative reading.",
          survey: "Fits the explanation reading, with the usual caution that a survey observes.",
          cohort:
            "Defensible if the institution already records participation and " +
            "outcomes. Cheap, and limited to what was already recorded.",
          repeated:
            "Defensible and often better: disengagement is a process, and " +
            "measuring or revisiting people across a project would show it " +
            "developing rather than only its end state.",
          between:
            "Hard to defend. You cannot allocate students to disengage. You " +
            "could allocate them to different group-work formats, which turns " +
            "this into a question about what reduces disengagement - related, " +
            "and not the same.",
          within: "Same problem: the thing of interest cannot be manipulated."
        }
      },
      needs: {
        epistemology: {
          standing: "key",
          note:
            "The decision the whole study waits on. Until the researcher says " +
            "what would count as an answer - a set of conditions, or an " +
            "account of how students make sense of what happens - no design " +
            "can be chosen."
        },
        allocation: {
          standing: "key",
          note:
            "Because you cannot allocate disengagement, no design here will " +
            "support a plain causal claim. Noticing that early stops a study " +
            "being written up as though it had."
        },
        measurement: {
          standing: "fair",
          note:
            "Only if the reading is quantitative. \"Disengagement\" would have " +
            "to become something recordable, and choosing what is already an " +
            "answer to part of the question."
        },
        predictors: {
          standing: "fair",
          note:
            "Again only on the quantitative reading, where the candidate " +
            "reasons have to be listed in advance and will overlap."
        },
        sampling: {
          standing: "fair",
          note:
            "Whose accounts, or whose records. The students who disengage most " +
            "are the hardest to recruit, on either reading."
        },
        independence: {
          standing: "fair",
          note:
            "Students sit inside groups, and groups are exactly the thing " +
            "under study. If it goes quantitative, that nesting is not a " +
            "nuisance to be corrected but part of the phenomenon."
        }
      }
    }
  ];

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

  var shell = InteractiveShell.attach("#mapper");
  if (!shell) { return; }

  var page = document;
  var $ = function (selector, scope) { return (scope || page).querySelector(selector); };
  var $$ = function (selector, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(selector));
  };

  var aimSelect = $("#aim-select");
  var designSelect = $("#design-select");
  var kindRadios = $$('input[name="kind"]');
  var needBoxes = $$('input[name="needs"]');

  var caseLabel = $("[data-case-label]");
  var caseText = $("[data-case-text]");
  var caseContext = $("[data-case-context]");
  var readingList = $("[data-reading]");
  var caseFeedback = $("[data-case-feedback]");
  var caseDetail = $("[data-case-detail]");
  var caseDetailBody = $("[data-case-detail-body]");
  var stageTrack = $("[data-stage-track]");

  var checkButton = $('[data-action="check"]');
  var nextButton = $('[data-action="next"]');
  var workedButton = $('[data-action="worked"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mapperSection = $("#mapper-section");

  var challengeSection = $("#challenge");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var index = 0;
  var checked = [];

  /* --- The pinned reading ------------------------------------------------ */

  function selectedKind() {
    var chosen = kindRadios.filter(function (r) { return r.checked; })[0];
    return chosen ? chosen.value : "";
  }

  function selectedNeeds() {
    return needBoxes.filter(function (b) { return b.checked; })
      .map(function (b) { return b.value; });
  }

  function renderReading() {
    var needs = selectedNeeds();
    var rows = [
      ["Aim", aimSelect.value ? AIM_LABEL[aimSelect.value] : "not yet chosen"],
      ["Kind", selectedKind() ? KIND_LABEL[selectedKind()] : "not yet chosen"],
      ["Design", designSelect.value ? DESIGN_LABEL[designSelect.value] : "not yet chosen"],
      [
        "Still needed",
        needs.length
          ? needs.map(function (n) { return NEED_LABEL[n]; }).join("; ")
          : "nothing selected yet"
      ]
    ];

    clear(readingList);
    rows.forEach(function (row) {
      var wrap = make("div");
      wrap.appendChild(make("dt", null, row[0]));
      var dd = make("dd", null, row[1]);
      var unset = row[1] === "not yet chosen" || row[1] === "nothing selected yet";
      dd.setAttribute("data-set", unset ? "no" : "yes");
      wrap.appendChild(dd);
      readingList.appendChild(wrap);
    });
  }

  /* --- Stage track -------------------------------------------------------- */

  function renderTrack() {
    clear(stageTrack);
    CASES.forEach(function (item, i) {
      var li = make("li");
      li.appendChild(make("span", null, String(i + 1) + "."));
      li.appendChild(document.createTextNode(" " + item.short));
      if (checked[i]) {
        li.setAttribute("data-state", "done");
        li.appendChild(make("span", "visually-hidden", " (checked)"));
      }
      if (i === index) {
        li.setAttribute("aria-current", "step");
        li.appendChild(make("span", "visually-hidden", " (current)"));
      }
      stageTrack.appendChild(li);
    });
  }

  /* --- Showing a question -------------------------------------------------- */

  function showCase(i) {
    index = i;
    var item = CASES[i];
    caseLabel.textContent = "Question " + (i + 1) + " of " + CASES.length;
    caseText.textContent = item.question;
    caseContext.textContent = item.context;

    aimSelect.value = "";
    designSelect.value = "";
    kindRadios.forEach(function (r) { r.checked = false; });
    needBoxes.forEach(function (b) { b.checked = false; });

    caseFeedback.hidden = true;
    caseDetail.hidden = true;
    nextButton.textContent =
      i === CASES.length - 1 ? "Go to the challenge" : "Next question";
    renderReading();
    renderTrack();
  }

  /* --- Feedback ------------------------------------------------------------ */

  function standingOf(part, value) {
    if (part.strong.indexOf(value) !== -1) { return "strong"; }
    if (part.ok.indexOf(value) !== -1) { return "ok"; }
    return "weak";
  }

  function partBlock(title, standing, bodies) {
    var block = make("div", "part");
    block.setAttribute("data-standing", standing);
    var head = make("p", "part__head");
    head.appendChild(document.createTextNode(title + " — "));
    head.appendChild(make("span", "part__standing", STANDING_WORD[standing]));
    block.appendChild(head);
    bodies.forEach(function (text) {
      block.appendChild(make("p", "part__body", text));
    });
    return block;
  }

  function bestOf(part, labels) {
    return part.strong.map(function (v) { return labels[v]; }).join(" or ");
  }

  function buildDetail(item) {
    clear(caseDetailBody);

    if (item.ambiguous) {
      var flag = make("div", "part");
      flag.setAttribute("data-standing", "ok");
      flag.appendChild(make("p", "part__head", "Before anything else"));
      flag.appendChild(make("p", "part__body", item.ambiguous));
      caseDetailBody.appendChild(flag);
    }

    /* Part 1 — aim */
    var aim = aimSelect.value;
    var aimStanding = standingOf(item.aim, aim);
    var aimBodies = [item.aim.notes[aim]];
    if (aimStanding === "weak") {
      aimBodies.push(
        "Read as " + bestOf(item.aim, AIM_LABEL).toLowerCase() +
        ", the question makes better sense of its own wording."
      );
    }
    caseDetailBody.appendChild(
      partBlock("1. Aim: " + AIM_LABEL[aim], aimStanding, aimBodies));

    /* Part 2 — kind */
    var kind = selectedKind();
    var kindStanding = standingOf(item.kind, kind);
    caseDetailBody.appendChild(
      partBlock("2. Kind: " + KIND_LABEL[kind], kindStanding,
        [item.kind.notes[kind]]));

    /* Part 3 — design */
    var design = designSelect.value;
    var designStanding = standingOf(item.design, design);
    caseDetailBody.appendChild(
      partBlock("3. Design: " + DESIGN_LABEL[design], designStanding,
        [item.design.notes[design]]));

    /* Part 4 — what you still need to know. Different in kind: the feedback
       runs through what was selected and then through the key items that
       were not. */
    var needs = selectedNeeds();
    var keys = Object.keys(item.needs).filter(function (k) {
      return item.needs[k].standing === "key";
    });
    var missedKeys = keys.filter(function (k) { return needs.indexOf(k) === -1; });
    var needStanding = missedKeys.length === 0 ? "strong"
      : missedKeys.length < keys.length ? "ok" : "weak";

    var needBlock = make("div", "part");
    needBlock.setAttribute("data-standing", needStanding);
    var head = make("p", "part__head");
    head.appendChild(document.createTextNode("4. What you still need to know — "));
    head.appendChild(make("span", "part__standing",
      missedKeys.length === 0
        ? "you have the decisive ones"
        : missedKeys.length + " decisive item" +
          (missedKeys.length === 1 ? "" : "s") + " missing"));
    needBlock.appendChild(head);

    var list = make("ul");
    needs.forEach(function (value) {
      var entry = item.needs[value];
      var li = make("li");
      li.appendChild(make("strong", null, NEED_LABEL[value] + " — "));
      li.appendChild(document.createTextNode(
        (entry.standing === "key" ? "decisive here. "
          : entry.standing === "fair" ? "reasonable. "
          : entry.standing === "given" ? "already answered in the description. "
          : "does not bear on this question. ") + entry.note));
      list.appendChild(li);
    });
    missedKeys.forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        "Not selected: " + NEED_LABEL[value] + " — "));
      li.appendChild(document.createTextNode(item.needs[value].note));
      list.appendChild(li);
    });
    if (!needs.length && !missedKeys.length) {
      list.appendChild(make("li",
        null, "Nothing selected, and nothing decisive was missing."));
    }
    needBlock.appendChild(list);
    caseDetailBody.appendChild(needBlock);
  }

  function checkReading() {
    var item = CASES[index];
    var missing = [];
    if (!aimSelect.value) { missing.push("an aim"); }
    if (!selectedKind()) { missing.push("a kind"); }
    if (!designSelect.value) { missing.push("a design"); }

    if (missing.length) {
      caseFeedback.hidden = false;
      caseFeedback.setAttribute("data-tone", "caution");
      clear(caseFeedback);
      var p = make("p");
      p.appendChild(make("strong", "feedback__verdict", "Not yet. "));
      p.appendChild(document.createTextNode(
        "Choose " + missing.join(", ") + " before checking. Part 4 may be " +
        "left empty if you think nothing further is needed."));
      caseFeedback.appendChild(p);
      caseDetail.hidden = true;
      shell.announce("Choose " + missing.join(", ") + " first.", { immediate: true });
      return;
    }

    var aimStanding = standingOf(item.aim, aimSelect.value);
    var kindStanding = standingOf(item.kind, selectedKind());
    var designStanding = standingOf(item.design, designSelect.value);
    var strongCount = [aimStanding, kindStanding, designStanding]
      .filter(function (s) { return s === "strong"; }).length;
    var weakCount = [aimStanding, kindStanding, designStanding]
      .filter(function (s) { return s === "weak"; }).length;

    var verdict;
    var tone;
    if (weakCount === 0 && strongCount === 3) {
      tone = "good";
      verdict = "A reading the wording supports throughout.";
    } else if (weakCount === 0) {
      tone = "good";
      verdict = "Defensible throughout, with choices worth defending out loud.";
    } else if (weakCount === 1) {
      tone = "caution";
      verdict = "Mostly holds, with one part that is hard to get from this wording.";
    } else {
      tone = "warn";
      verdict = "This reading pulls against the wording in more than one place.";
    }

    caseFeedback.hidden = false;
    caseFeedback.setAttribute("data-tone", tone);
    clear(caseFeedback);
    var summary = make("p");
    summary.appendChild(make("strong", "feedback__verdict", verdict));
    summary.appendChild(document.createTextNode(
      " Nothing here is scored. Read the part-by-part notes below and decide " +
      "whether you would still defend your reading."));
    caseFeedback.appendChild(summary);

    buildDetail(item);
    caseDetail.hidden = false;
    checked[index] = true;
    renderTrack();
    shell.announce(verdict + " Part-by-part notes are below the question.",
      { immediate: true });
  }

  /* --- Worked reading ------------------------------------------------------ */

  function showWorked() {
    var item = CASES[index];
    aimSelect.value = item.aim.strong[0];
    designSelect.value = item.design.strong[0];
    kindRadios.forEach(function (r) { r.checked = r.value === item.kind.strong[0]; });
    var keys = Object.keys(item.needs).filter(function (k) {
      return item.needs[k].standing === "key";
    });
    needBoxes.forEach(function (b) { b.checked = keys.indexOf(b.value) !== -1; });
    renderReading();
    checkReading();
    shell.announce("Worked reading loaded for question " + (index + 1) + ".",
      { immediate: true });
  }

  /* --- Events -------------------------------------------------------------- */

  aimSelect.addEventListener("change", renderReading);
  designSelect.addEventListener("change", renderReading);
  kindRadios.forEach(function (r) { r.addEventListener("change", renderReading); });
  needBoxes.forEach(function (b) { b.addEventListener("change", renderReading); });

  checkButton.addEventListener("click", checkReading);
  workedButton.addEventListener("click", showWorked);

  nextButton.addEventListener("click", function () {
    if (index === CASES.length - 1) {
      challengeSection.hidden = false;
      $("#challenge-heading").focus();
      shell.announce("Challenge opened below.", { immediate: true });
      return;
    }
    showCase(index + 1);
    caseText.scrollIntoView({ block: "nearest" });
    shell.announce("Question " + (index + 1) + " of " + CASES.length + ". " +
      CASES[index].question, { immediate: true });
  });

  /* --- Opening prediction --------------------------------------------------- */

  var OPENING = {
    data: {
      tone: "caution",
      verdict: "That is the flowchart answer.",
      text:
        "The data constrain what you can do, and they are downstream of " +
        "everything that matters: someone decided what to collect, from whom, " +
        "and under what conditions. Starting there means inheriting those " +
        "decisions without examining them."
    },
    measurement: {
      tone: "caution",
      verdict: "Necessary, and nowhere near sufficient.",
      text:
        "Level of measurement rules some analyses in and out, and you will " +
        "need it. But two studies with an identical continuous outcome can " +
        "need entirely different treatment - one allocated its conditions and " +
        "the other did not."
    },
    claim: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The claim decides what design could support it; the design decides " +
        "what data structure you end up with; only then is the analysis a " +
        "technical question. Work the other way round and you get studies " +
        "that compute something correct and answer nothing."
    },
    groups: {
      tone: "caution",
      verdict: "That is a late question, not a first one.",
      text:
        "Counting groups is genuinely part of choosing a test, and it is the " +
        "part textbooks teach best. It cannot tell you whether comparing " +
        "groups was the right move, whether the groups were allocated or " +
        "merely found, or whether the comparison answers the question that was " +
        "asked."
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

  function openMapper() {
    mapperSection.hidden = false;
    showCase(0);
    $("#mapper-heading").focus();
    shell.announce("Mapper unlocked. Question 1 of " + CASES.length + ".",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the mapper.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openMapper();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openMapper();
  });

  /* --- Challenge ------------------------------------------------------------ */

  var CHALLENGE_NOTES = {
    themes: {
      defensible: true,
      text:
        "Defensible. Eighteen transcripts can support an interpretative " +
        "account of how unequal contribution is made sense of, provided the " +
        "analytic approach and the position it is written from are stated."
    },
    predict: {
      defensible: true,
      text:
        "Defensible, with care. The spreadsheet supports a forecasting model. " +
        "It cannot support a sentence about what produces engagement, and with " +
        "18 students the model will be far too unstable to report as though it " +
        "generalised."
    },
    cause: {
      defensible: false,
      text:
        "Not defensible. Nothing was allocated and nothing was manipulated. " +
        "Both variables were observed at the same time in the same students, " +
        "so the arrow could point either way or come from somewhere else " +
        "entirely."
    },
    integrate: {
      defensible: true,
      text:
        "Defensible, and the strongest option — but only if each strand is " +
        "given its own stated sub-question and the two are actually brought " +
        "together. A qualitative section appended to a quantitative paper is " +
        "not mixed methods; it is two papers sharing a title."
    },
    count: {
      defensible: false,
      text:
        "Not defensible as a prevalence. Counting theme mentions in 18 " +
        "purposively recruited transcripts produces a number that looks like " +
        "a rate and is not one - what people mention depends on what they " +
        "were asked. \"Several participants\" is fine; a percentage of a " +
        "population is not."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one option.",
        "There is more than one defensible answer here.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) {
      return !CHALLENGE_NOTES[v].defensible;
    });
    var rightMissed = Object.keys(CHALLENGE_NOTES).filter(function (v) {
      return CHALLENGE_NOTES[v].defensible && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "caution" : rightMissed.length ? "caution" : "good";
    var verdict = wrongPicked.length
      ? "One or more of these will not stand up."
      : rightMissed.length
        ? "Everything you chose is defensible; there is more on the table."
        : "Yes — all three defensible options and neither of the two that fail.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdict));
    challengeFeedback.appendChild(lead);

    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var note = CHALLENGE_NOTES[value];
      var picked = chosen.indexOf(value) !== -1;
      var li = make("li");
      li.appendChild(make("strong", null,
        (picked ? "You selected this. " : "You did not select this. ")));
      li.appendChild(document.createTextNode(note.text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdict, { immediate: true });
  });

  /* --- Reset ---------------------------------------------------------------- */

  shell.onReset(function () {
    checked = [];
    index = 0;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mapperSection.hidden = true;
    challengeSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    showCase(0);
  });

  /* --- Start-up ------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the mapper.",
    { immediate: true });
})();
