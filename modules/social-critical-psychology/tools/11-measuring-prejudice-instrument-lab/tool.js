/* =========================================================================
   Measuring Prejudice: What Does the Instrument Capture?
   -------------------------------------------------------------------------
   Two sequential experiments in one fictional country (Vantry), whose two
   regional populations - Uplanders and Lowlanders - stand for no real group
   anywhere.

   EXPERIMENT 1  A score, and a person.
     200 simulated respondents each have a latency difference score from a
     sorting task and a shortlisting outcome (how many of the four candidates
     they chose were Uplanders, out of four Uplanders among eight). The
     learner sees the score, predicts the shortlist, and finds out. The
     association is small, real, and useless about any individual - which is
     the point, and is why the tool prints both the correlation and the
     accuracy of predicting from the score against the base rate of simply
     guessing "even" every time.

   EXPERIMENT 2  Five instruments.
     Explicit self-report, latency-based association, behavioural choice,
     informant report and institutional outcomes. For each, the learner says
     what it DIRECTLY OBSERVES, before anybody interprets it. The feedback
     then names what is inferred, what alternative explanations remain, the
     level of description the finding belongs to, and the claim it cannot
     support. A growing table sets the five against each other.

   WHY THE LEARNER NEVER TAKES THE TASK
   ------------------------------------
   A tool that produced a number about the user's own associations and then
   explained that such numbers do not predict behaviour would be teaching one
   thing and doing another. The sorting task is run only on fictional
   respondents. Nothing on this page measures, scores or labels the person
   using it.

   THE MODEL (all figures invented; nothing is a norm or a published effect)
   ------------------------------------------------------------------------
   mulberry32 seeded at 20260811, with Box-Muller normal draws. For each of
   200 respondents:

       z   ~ N(0,1)                        a latent association strength
       D   = 0.34 + 0.22 z + 0.26 e1       latency difference score, seconds
       b   = -0.30 z + e2                  a behavioural latent
       S   = round(2 + 0.85 b), 0..4       Uplanders shortlisted, of four
       W   = 13 + 2.0 z + 8 e3             self-reported warmth gap, points

   The construction gives a population correlation between D and the
   behavioural latent of about -0.19, which is deliberately of the same order
   as the correlations reported in meta-analyses of real latency-behaviour
   relationships. Rounding and clamping attenuate it slightly. Every reported
   figure is computed from the generated sample at run time rather than
   written into the page, so the numbers in the teaching notes can be checked
   against what the tool actually produces.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var SEED = 20260811;
  var N = 200;
  var SHORTLIST_MAX = 4;

  /* --- Seeded randomness --------------------------------------------------- */

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalPair(rand) {
    /* Box-Muller. Returns one standard normal draw per call, caching the
       second so no draw is wasted. */
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function buildSample() {
    var rand = mulberry32(SEED);
    var people = [];
    for (var i = 0; i < N; i += 1) {
      var z = normalPair(rand);
      var e1 = normalPair(rand);
      var e2 = normalPair(rand);
      var e3 = normalPair(rand);
      var d = 0.34 + 0.22 * z + 0.26 * e1;
      var behaviour = -0.30 * z + e2;
      var shortlist = Math.round(2 + 0.85 * behaviour);
      if (shortlist < 0) { shortlist = 0; }
      if (shortlist > SHORTLIST_MAX) { shortlist = SHORTLIST_MAX; }
      var warmth = 13 + 2.0 * z + 8 * e3;
      people.push({
        id: i + 1,
        d: d,
        shortlist: shortlist,
        warmth: warmth,
        /* A small deterministic vertical offset so 200 points on five
           discrete rows can be told apart. Documented, not decorative. */
        jitter: (rand() - 0.5) * 0.7
      });
    }
    return people;
  }

  function correlation(xs, ys) {
    var n = xs.length;
    var mx = 0;
    var my = 0;
    var i;
    for (i = 0; i < n; i += 1) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    var sxy = 0;
    var sxx = 0;
    var syy = 0;
    for (i = 0; i < n; i += 1) {
      var dx = xs[i] - mx;
      var dy = ys[i] - my;
      sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
    }
    return sxy / Math.sqrt(sxx * syy);
  }

  function median(values) {
    var sorted = values.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /* --- Bands ------------------------------------------------------------------ */

  var BANDS = [
    { id: "fewer", label: "Fewer Uplanders (0 or 1 of 4)", test: function (s) { return s <= 1; } },
    { id: "even", label: "An even shortlist (2 of 4)", test: function (s) { return s === 2; } },
    { id: "more", label: "More Uplanders (3 or 4 of 4)", test: function (s) { return s >= 3; } },
    { id: "cannot", label: "You cannot tell from this score", test: null }
  ];

  function bandOf(shortlist) {
    if (shortlist <= 1) { return "fewer"; }
    if (shortlist === 2) { return "even"; }
    return "more";
  }

  /* --- The five instruments ---------------------------------------------------- */

  var INSTRUMENTS = [
    {
      id: "selfreport",
      name: "Explicit self-report",
      level: "Individual - what a person is willing to state",
      finding:
        "A national survey of 2,400 simulated respondents asked people to rate " +
        "how warmly they felt towards each region on a 0 to 100 scale. Mean " +
        "warmth towards Uplanders was 61; towards Lowlanders, 74. The gap has " +
        "narrowed from 22 points to 13 over ten years.",
      options: [
        { value: "attitude", label: "A person's attitude towards Uplanders" },
        { value: "written", label: "What people are willing to write down, on this scale, under these conditions", correct: true },
        { value: "feeling", label: "How warmly people actually feel" },
        { value: "change", label: "That prejudice in Vantry has fallen by nine points" }
      ],
      inferred:
        "An underlying evaluative attitude, and - from the ten-year change - " +
        "that the attitude has shifted.",
      remains:
        "That what is sayable changed rather than what is felt; that the " +
        "thermometer format invites a number people can defend rather than one " +
        "they hold; that who agreed to take part changed over ten years; and " +
        "that a difference of 13 points on an invented scale has no natural " +
        "unit at all.",
      cannot:
        "That any individual respondent feels what they wrote, or that the " +
        "ten-year narrowing is a change in feeling rather than in what can be " +
        "said."
    },
    {
      id: "latency",
      name: "Latency-based association task",
      level: "Individual - a difference in processing speed",
      finding:
        "The 200 simulated respondents in experiment 1 sorted words and images " +
        "under two pairings of categories. Sorting was faster on average under " +
        "one pairing than the other, and the distribution of individual scores " +
        "overlaps heavily with zero.",
      options: [
        { value: "hidden", label: "An attitude the respondent is unwilling or unable to report" },
        { value: "speed", label: "A difference in mean sorting speed between two pairings of categories", correct: true },
        { value: "bias", label: "How biased each respondent is" },
        { value: "behaviour", label: "How each respondent will behave towards Uplanders" }
      ],
      inferred:
        "The relative accessibility of an association in memory, and from " +
        "that, an evaluative attitude the person may not report.",
      remains:
        "Familiarity and frequency of the particular stimuli; block order and " +
        "practice; the salience asymmetry between a large and a small category; " +
        "general processing speed; and the plain fact that an association " +
        "becoming available quickly is not the same as endorsing it.",
      cannot:
        "That any individual respondent will treat an Uplander differently - " +
        "which is what experiment 1 was for - or that the number is a reading " +
        "taken from behind the person's own answers."
    },
    {
      id: "behaviour",
      name: "Behavioural choice",
      level: "Individual - one act, on one occasion",
      finding:
        "Each of the 200 respondents shortlisted four of eight fictional " +
        "candidates for a fictional post. Four candidates were coded as " +
        "Uplanders, all other details were identical, and the pairings were " +
        "rotated across respondents.",
      options: [
        { value: "disposition", label: "A person's disposition to discriminate" },
        { value: "files", label: "Which files a person selected, in one task, on one occasion", correct: true },
        { value: "hiring", label: "How that person hires in real life" },
        { value: "prejudice", label: "The behavioural component of prejudice" }
      ],
      inferred:
        "A disposition to treat people differently, and often - with no " +
        "warrant - how the person would act in a real appointment.",
      remains:
        "One occasion is not a disposition; the respondent may have worked out " +
        "what the study was about; a shortlist in a study costs nobody a job; " +
        "and rotating names controls the candidate but not what the respondent " +
        "took the task to be asking of them.",
      cannot:
        "That the same person would do the same thing where it mattered, or " +
        "that a pattern across 200 people in a study describes a hiring process " +
        "anywhere."
    },
    {
      id: "informant",
      name: "Informant report",
      level: "Dyadic - how a person appears to particular others",
      finding:
        "Two colleagues of each of 60 simulated employees rated how comfortable " +
        "that person seemed working with Uplander colleagues. Agreement between " +
        "the two informants was moderate.",
      options: [
        { value: "truth", label: "The truth about the person, from people who know them" },
        { value: "appears", label: "How a person appears to two particular other people, who share their workplace", correct: true },
        { value: "attitude", label: "The employee's attitude, uncontaminated by self-presentation" },
        { value: "climate", label: "The organisation's climate" }
      ],
      inferred:
        "An attitude and its expression in ordinary interaction, on the " +
        "grounds that colleagues see what a questionnaire cannot.",
      remains:
        "The informants share the workplace's norms about what comfortable " +
        "looks like; appearing at ease is a social skill as much as an " +
        "attitude; the two informants were chosen somehow; and their own views " +
        "shape what they notice. Moderate agreement between two observers is " +
        "consistent with both seeing the person clearly and both seeing the " +
        "same workplace.",
      cannot:
        "That the employee holds the attitude ascribed to them, or that a " +
        "workplace where everybody seems comfortable is one where nothing is " +
        "happening."
    },
    {
      id: "institutional",
      name: "Institutional outcomes",
      level: "Institutional - a distribution of outcomes over time",
      finding:
        "Uplanders are 18 per cent of the Vantry workforce, 19 per cent of " +
        "applicants to senior posts and 7 per cent of appointments. The gap is " +
        "present in all six regions and has not moved in twelve years.",
      options: [
        { value: "discrimination", label: "Discrimination in the appointments process" },
        { value: "distribution", label: "A distribution of outcomes across an organisation over time", correct: true },
        { value: "attitudes", label: "The accumulated attitudes of the people who sat on panels" },
        { value: "merit", label: "That the two groups differ in what the process is measuring" }
      ],
      inferred:
        "Discrimination - which is one candidate explanation among several, and " +
        "the most important of the five inferential steps on this page to slow " +
        "down.",
      remains:
        "What is counted as relevant experience and who accumulates it; where " +
        "posts are advertised and who sees them; who sits on panels and what " +
        "they are asked to weigh; which posts people apply for and why; and " +
        "prior stages that shaped the applicant pool long before the panel met. " +
        "An outcome pattern this stable does not need anybody's attitude to " +
        "sustain it, which is exactly why it is not evidence about anybody's " +
        "attitude.",
      cannot:
        "That any individual acted on a prejudice; and, running the other way, " +
        "no study of individual attitudes - however large - can confirm or " +
        "refute it, because it is a claim about a different object."
    }
  ];

  /* --- The challenge ------------------------------------------------------------ */

  var CLAIMS = [
    {
      id: "cross",
      text:
        "\"Uplanders hold only 7 per cent of senior posts because Lowlanders " +
        "have negative implicit associations.\"",
      answer: "no",
      why:
        "Two objects, one sentence. The appointments record is a fact about an " +
        "organisation over twelve years; the association effect is an average " +
        "over a sample of individuals. Even if every Lowlander in Vantry " +
        "scored zero on the sorting task, the record could look exactly the " +
        "same - because what counts as relevant experience, where posts are " +
        "advertised and who sits on panels do not require anybody to hold " +
        "anything."
    },
    {
      id: "individual",
      text:
        "\"Respondent 118 has one of the largest latency scores in the sample, " +
        "so we should not put her on an appointment panel.\"",
      answer: "no",
      why:
        "This is the error experiment 1 exists to make visible. A small " +
        "average association across 200 people supports no statement about any " +
        "one of them, and the accuracy figure printed beside the scatter shows " +
        "how badly the score performs as an individual prediction - worse, in " +
        "this sample, than guessing \"even\" every time. Using it to select, " +
        "exclude or accuse is a category error that no significance test " +
        "repairs."
    },
    {
      id: "narrowing",
      text:
        "\"The self-reported warmth gap narrowed from 22 points to 13 over ten " +
        "years, so prejudice in Vantry has fallen.\"",
      answer: "partly",
      why:
        "Something changed, and the survey cannot say what. Attitudes may have " +
        "shifted; what is sayable may have shifted; both may have. The second " +
        "possibility is not noise to be subtracted - a change in what a country " +
        "will say out loud is itself a finding about that country, and it is " +
        "one that the appointments record suggests did not reach the " +
        "appointments record."
    },
    {
      id: "realattitude",
      text:
        "\"The sorting task and the survey disagree, so the sorting task is " +
        "measuring the real attitude and the survey is measuring what people " +
        "want us to think.\"",
      answer: "no",
      why:
        "Two instruments disagreeing tells you they are measuring different " +
        "things. It does not tell you which one is the real one, and there is " +
        "no procedure in the design that could. \"Real attitude, underneath\" " +
        "is a rhetorical promotion of one instrument, not a measurement claim - " +
        "and it is the exact moment at which a construct gets quietly replaced " +
        "by the score a task happens to produce."
    },
    {
      id: "outcome",
      text:
        "\"The appointments record shows that Uplanders face discrimination in " +
        "Vantry.\"",
      answer: "partly",
      why:
        "It shows a stable, patterned disparity that has survived twelve years " +
        "and six regions, which is a serious finding and demands explanation. " +
        "It does not by itself establish which process produced it, and the " +
        "candidates are not interchangeable: a panel weighing the wrong things, " +
        "an advertising route that reaches the wrong people and a pipeline " +
        "shaped decades earlier call for different remedies. Treating the " +
        "disparity as self-explanatory skips the question that decides what to " +
        "do about it."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "yes", label: "Supported by this evidence" },
    { value: "partly", label: "Partly - it needs a qualification" },
    { value: "no", label: "Not supported" }
  ];

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

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

  function fixed(value, places) {
    return Number(value).toFixed(places === undefined ? 2 : places);
  }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  /* =======================================================================
     Shared page furniture
     ===================================================================== */

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var expOne = $("#experiment-one");
  var expTwo = $("#experiment-two");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  /* =======================================================================
     Experiment 1
     ===================================================================== */

  var latencyShell = InteractiveShell.attach("#latency-lab");
  if (!latencyShell) { return; }

  var PEOPLE = buildSample();
  var R = correlation(
    PEOPLE.map(function (p) { return p.d; }),
    PEOPLE.map(function (p) { return p.shortlist; })
  );
  var D_MEDIAN = median(PEOPLE.map(function (p) { return p.d; }));

  /* Base rate: how often would you be right by always saying "even"? */
  var BAND_COUNTS = { fewer: 0, even: 0, more: 0 };
  PEOPLE.forEach(function (p) { BAND_COUNTS[bandOf(p.shortlist)] += 1; });
  var BASE_BAND = Object.keys(BAND_COUNTS).reduce(function (best, key) {
    return BAND_COUNTS[key] > BAND_COUNTS[best] ? key : best;
  }, "fewer");
  var BASE_RATE = BAND_COUNTS[BASE_BAND] / N;

  /* How often does "above the median score means fewer Uplanders shortlisted"
     get it right, counted over the respondents where the rule commits? */
  var RULE_HITS = 0;
  var RULE_TRIED = 0;
  PEOPLE.forEach(function (p) {
    var predicted = p.d > D_MEDIAN ? "fewer" : "more";
    var actual = bandOf(p.shortlist);
    if (actual === "even") { return; }
    RULE_TRIED += 1;
    if (predicted === actual) { RULE_HITS += 1; }
  });
  var RULE_RATE = RULE_TRIED ? RULE_HITS / RULE_TRIED : 0;

  var respondentBox = $("[data-respondent]");
  var guessOptions = $("[data-guess-options]");
  var guessNote = $("[data-guess-note]");
  var tally = $("[data-tally]");
  var scatterSvg = $("[data-scatter]");
  var scatterText = $("[data-scatter-text]");
  var revealBox = $("[data-reveal]");
  var bandsBody = $("[data-bands-body]");
  var classifyLine = $("[data-classify]");

  var EXP1_INITIAL = { index: 0, guess: null, revealed: false, made: 0, hits: 0, declined: 0 };
  var exp1 = null;

  function current() { return PEOPLE[exp1.index]; }

  function percentileOf(person) {
    var below = 0;
    PEOPLE.forEach(function (p) { if (p.d < person.d) { below += 1; } });
    return Math.round((below / N) * 100);
  }

  function renderRespondent() {
    clear(respondentBox);
    var person = current();
    respondentBox.appendChild(make("p", "respondent__id",
      "Respondent " + person.id + " of " + N));
    var row = make("p", "respondent__score");
    row.appendChild(make("span", "respondent__value", fixed(person.d) + " s"));
    row.appendChild(make("span", "respondent__unit", "latency difference score"));
    respondentBox.appendChild(row);
    respondentBox.appendChild(make("p", "control__hint",
      "Larger means faster sorting under one pairing than the other. This " +
      "respondent is at about the " + percentileOf(person) +
      "th percentile of the 200. Nothing else about them is known to you."));
  }

  function buildGuessOptions() {
    clear(guessOptions);
    BANDS.forEach(function (band) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "guess";
      input.value = band.id;
      input.checked = exp1.guess === band.id;
      input.disabled = exp1.revealed;
      input.addEventListener("change", function () { exp1.guess = band.id; });
      label.appendChild(input);
      label.appendChild(make("span", null, band.label));
      guessOptions.appendChild(label);
    });
  }

  var NS = "http://www.w3.org/2000/svg";
  var PLOT = { left: 40, right: 306, top: 16, bottom: 138 };

  function xFor(d) {
    var lo = -0.4;
    var hi = 1.2;
    var t = (d - lo) / (hi - lo);
    if (t < 0) { t = 0; }
    if (t > 1) { t = 1; }
    return PLOT.left + t * (PLOT.right - PLOT.left);
  }

  function yFor(shortlist, jitter) {
    var t = shortlist / SHORTLIST_MAX;
    var base = PLOT.bottom - t * (PLOT.bottom - PLOT.top);
    return base + (jitter || 0) * 9;
  }

  function drawScatter() {
    clear(scatterSvg);

    /* Axes, labelled in words underneath as well. */
    var axis = document.createElementNS(NS, "line");
    axis.setAttribute("x1", String(PLOT.left));
    axis.setAttribute("x2", String(PLOT.right));
    axis.setAttribute("y1", String(PLOT.bottom + 8));
    axis.setAttribute("y2", String(PLOT.bottom + 8));
    axis.setAttribute("class", "chart__baseline");
    scatterSvg.appendChild(axis);

    [0, 1, 2, 3, 4].forEach(function (level) {
      var y = yFor(level, 0);
      var grid = document.createElementNS(NS, "line");
      grid.setAttribute("x1", String(PLOT.left));
      grid.setAttribute("x2", String(PLOT.right));
      grid.setAttribute("y1", String(y));
      grid.setAttribute("y2", String(y));
      grid.setAttribute("class", "chart__grid");
      scatterSvg.appendChild(grid);

      var tick = document.createElementNS(NS, "text");
      tick.setAttribute("x", String(PLOT.left - 6));
      tick.setAttribute("y", String(y + 4));
      tick.setAttribute("text-anchor", "end");
      tick.setAttribute("class", "chart__axis");
      tick.textContent = String(level);
      scatterSvg.appendChild(tick);
    });

    [-0.4, 0, 0.4, 0.8, 1.2].forEach(function (value) {
      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(xFor(value)));
      label.setAttribute("y", String(PLOT.bottom + 22));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "chart__axis");
      label.textContent = value.toFixed(1);
      scatterSvg.appendChild(label);
    });

    var yTitle = document.createElementNS(NS, "text");
    yTitle.setAttribute("x", "4");
    yTitle.setAttribute("y", "10");
    yTitle.setAttribute("class", "chart__axis");
    yTitle.textContent = "Uplanders shortlisted";
    scatterSvg.appendChild(yTitle);

    var xTitle = document.createElementNS(NS, "text");
    xTitle.setAttribute("x", String(PLOT.right));
    xTitle.setAttribute("y", String(PLOT.bottom + 34));
    xTitle.setAttribute("text-anchor", "end");
    xTitle.setAttribute("class", "chart__axis");
    xTitle.textContent = "Latency difference score (s)";
    scatterSvg.appendChild(xTitle);

    PEOPLE.forEach(function (person) {
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(xFor(person.d)));
      dot.setAttribute("cy", String(yFor(person.shortlist, person.jitter)));
      dot.setAttribute("r", "2");
      dot.setAttribute("class", "chart__point");
      scatterSvg.appendChild(dot);
    });

    /* The selected respondent gets a ring and a cross-hair, so it is found by
       shape and position rather than by colour. */
    var person = current();
    var mark = document.createElementNS(NS, "circle");
    mark.setAttribute("cx", String(xFor(person.d)));
    mark.setAttribute("cy", String(yFor(person.shortlist, person.jitter)));
    mark.setAttribute("r", "6");
    mark.setAttribute("class", "scatter__selected");
    scatterSvg.appendChild(mark);

    var stem = document.createElementNS(NS, "line");
    stem.setAttribute("x1", String(xFor(person.d)));
    stem.setAttribute("x2", String(xFor(person.d)));
    stem.setAttribute("y1", String(PLOT.top - 6));
    stem.setAttribute("y2", String(PLOT.bottom + 8));
    stem.setAttribute("class", "scatter__stem");
    scatterSvg.appendChild(stem);

    scatterText.textContent =
      "Two hundred simulated respondents. The correlation between the latency " +
      "difference score and the number of Uplanders shortlisted is " +
      fixed(R) + ". The respondent currently selected is number " + person.id +
      ", with a score of " + fixed(person.d) + " seconds" +
      (exp1.revealed
        ? " and a shortlist of " + person.shortlist + " of 4."
        : "; their shortlist is not shown until you reveal it.") +
      " A perfectly predictive score would put every point on a single rising " +
      "or falling line.";
  }

  function renderBands() {
    clear(bandsBody);
    [0, 1, 2, 3, 4].forEach(function (level) {
      var group = PEOPLE.filter(function (p) { return p.shortlist === level; });
      if (!group.length) { return; }
      var scores = group.map(function (p) { return p.d; });
      var mean = scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
      var lo = Math.min.apply(null, scores);
      var hi = Math.max.apply(null, scores);
      var tr = make("tr");
      var th = make("th", null, String(level) + " of 4");
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, String(group.length)));
      tr.appendChild(make("td", null, fixed(mean) + " s"));
      tr.appendChild(make("td", null, fixed(lo) + " to " + fixed(hi) + " s"));
      bandsBody.appendChild(tr);
    });
    classifyLine.textContent =
      "Rule check: taking a score above the sample median (" +
      fixed(D_MEDIAN) + " s) to mean \"fewer Uplanders\" and below it to mean " +
      "\"more\" gets it right for " + Math.round(RULE_RATE * 100) +
      " per cent of the " + RULE_TRIED + " respondents whose shortlist was not " +
      "even. Meanwhile " + Math.round(BASE_RATE * 100) + " per cent of all 200 " +
      "shortlists were even, so answering \"an even shortlist\" every single " +
      "time would be right " + Math.round(BASE_RATE * 100) + " per cent of the " +
      "time without looking at any score at all.";
  }

  function renderTally() {
    if (!exp1.made && !exp1.declined) {
      tally.textContent =
        "No predictions yet. Guessing \"an even shortlist\" every time would " +
        "be right about " + Math.round(BASE_RATE * 100) + " per cent of the " +
        "time, which is the number your own accuracy has to beat.";
      return;
    }
    tally.textContent =
      "You have committed to " + exp1.made + " prediction" +
      (exp1.made === 1 ? "" : "s") + " and been right " + exp1.hits +
      (exp1.made ? " (" + Math.round((exp1.hits / exp1.made) * 100) + " per cent)" : "") +
      ". Always answering \"an even shortlist\" would be right about " +
      Math.round(BASE_RATE * 100) + " per cent of the time. You have declined " +
      "to guess " + exp1.declined + " time" + (exp1.declined === 1 ? "" : "s") + ".";
  }

  function renderReveal() {
    clear(revealBox);
    if (!exp1.revealed) { return; }
    var person = current();
    var actual = bandOf(person.shortlist);
    var declined = exp1.guess === "cannot";
    var right = !declined && exp1.guess === actual;

    var box = make("div", "verdict");
    box.setAttribute("data-tone", declined ? "good" : (right ? "neutral" : "warn"));
    box.appendChild(make("h5", "verdict__title",
      "Respondent " + person.id + " shortlisted " + person.shortlist +
      " Uplander" + (person.shortlist === 1 ? "" : "s") + " of 4"));

    if (declined) {
      box.appendChild(make("p", "verdict__body",
        "You declined to guess, and that is the answer the data support. A " +
        "score of " + fixed(person.d) + " seconds is consistent with every one " +
        "of the five possible shortlists in this sample - look at the range " +
        "column in the table below."));
    } else if (right) {
      box.appendChild(make("p", "verdict__body",
        "You were right, and the honest reading of being right is that you had " +
        "roughly a one-in-three chance and the most common shortlist is the " +
        "even one. Keep going: the accuracy figure beside the scatter is what " +
        "matters, not any single case."));
    } else {
      box.appendChild(make("p", "verdict__body",
        "Not this time. The score pointed one way and the person went another, " +
        "which will keep happening, because the correlation across all 200 is " +
        fixed(R) + " - real, small, and not enough to say anything about a " +
        "particular person."));
    }

    box.appendChild(make("p", "verdict__note",
      "This respondent also reported a warmth gap of " +
      Math.round(person.warmth) + " points on the survey scale, which is a " +
      "third number that agrees with neither of the other two in any reliable " +
      "way. Three instruments, three answers, one fictional person."));
    revealBox.appendChild(box);
  }

  function renderExp1(options) {
    renderRespondent();
    buildGuessOptions();
    drawScatter();
    renderBands();
    renderTally();
    renderReveal();
    if (options && options.announce) {
      latencyShell.announce(options.announce, { immediate: true });
    }
  }

  function goTo(index) {
    exp1.index = ((index % N) + N) % N;
    exp1.guess = null;
    exp1.revealed = false;
    guessNote.textContent = "";
    renderExp1({
      announce: "Respondent " + current().id + ", latency difference score " +
        fixed(current().d) + " seconds. Their shortlist is not shown yet."
    });
  }

  $('[data-action="prev"]').addEventListener("click", function () { goTo(exp1.index - 1); });
  $('[data-action="next"]').addEventListener("click", function () { goTo(exp1.index + 1); });
  $('[data-action="random"]').addEventListener("click", function () {
    goTo(Math.floor(Math.random() * N));
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    if (exp1.revealed) {
      guessNote.textContent = "Already revealed. Move to another respondent.";
      latencyShell.announce(guessNote.textContent, { immediate: true });
      return;
    }
    if (!exp1.guess) {
      guessNote.textContent =
        "Choose one of the four first. \"You cannot tell from this score\" is " +
        "a real answer here, not a way of opting out.";
      latencyShell.announce(guessNote.textContent, { immediate: true });
      return;
    }
    guessNote.textContent = "";
    exp1.revealed = true;
    var actual = bandOf(current().shortlist);
    if (exp1.guess === "cannot") {
      exp1.declined += 1;
    } else {
      exp1.made += 1;
      if (exp1.guess === actual) { exp1.hits += 1; }
    }
    renderExp1({
      announce: "Respondent " + current().id + " shortlisted " +
        current().shortlist + " of 4. " +
        (exp1.made
          ? "Your running accuracy is " +
            Math.round((exp1.hits / exp1.made) * 100) + " per cent against a " +
            "base rate of " + Math.round(BASE_RATE * 100) + " per cent."
          : "You have declined to guess " + exp1.declined + " times.")
    });
  });

  $('[data-action="auto"]').addEventListener("click", function () {
    /* Twenty respondents, always predicting the direction the score points.
       Deterministic: it walks forward from wherever the learner is. */
    var start = exp1.index;
    for (var step = 1; step <= 20; step += 1) {
      var person = PEOPLE[(start + step) % N];
      var predicted = person.d > D_MEDIAN ? "fewer" : "more";
      exp1.made += 1;
      if (predicted === bandOf(person.shortlist)) { exp1.hits += 1; }
    }
    exp1.index = (start + 20) % N;
    exp1.guess = null;
    exp1.revealed = false;
    renderExp1({
      announce: "Twenty predictions made from the score alone. Accuracy " +
        Math.round((exp1.hits / exp1.made) * 100) + " per cent, against " +
        Math.round(BASE_RATE * 100) + " per cent for answering \"even\" every " +
        "time without looking at anything."
    });
  });

  /* =======================================================================
     Experiment 2
     ===================================================================== */

  var instrumentShell = InteractiveShell.attach("#instrument-lab");
  if (!instrumentShell) { return; }

  var instrumentPicks = $("[data-instrument-picks]");
  var observeLegend = $("[data-observe-legend]");
  var observeOptions = $("[data-observe-options]");
  var observeNote = $("[data-observe-note]");
  var evidenceHeading = $("[data-evidence-heading]");
  var evidenceLevel = $("[data-evidence-level]");
  var evidenceText = $("[data-evidence-text]");
  var instrumentFeedback = $("[data-instrument-feedback]");
  var levels = $("[data-levels]");
  var levelsBody = $("[data-levels-body]");
  var goalText = $("[data-goal-text]");

  var EXP2_INITIAL = { index: 0, choice: null, checked: {}, answers: {} };
  var exp2 = null;

  function currentInstrument() { return INSTRUMENTS[exp2.index]; }

  function buildInstrumentPicks() {
    clear(instrumentPicks);
    INSTRUMENTS.forEach(function (instrument, index) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "instrument";
      input.value = instrument.id;
      input.checked = index === exp2.index;
      input.addEventListener("change", function () {
        exp2.index = index;
        exp2.choice = exp2.answers[instrument.id] || null;
        observeNote.textContent = "";
        renderExp2({
          announce: instrument.name + " selected. " + instrument.level + "."
        });
      });
      label.appendChild(input);
      var body = make("span", "instrument__body");
      body.appendChild(make("span", "instrument__name", instrument.name));
      body.appendChild(make("span", "instrument__state",
        exp2.checked[instrument.id] ? "checked" : "not yet checked"));
      label.appendChild(body);
      instrumentPicks.appendChild(label);
    });
  }

  function buildObserveOptions() {
    var instrument = currentInstrument();
    clear(observeOptions);
    observeLegend.textContent =
      "What does " + instrument.name.toLowerCase() + " directly observe?";
    instrument.options.forEach(function (option) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "observe-" + instrument.id;
      input.value = option.value;
      input.checked = exp2.choice === option.value;
      input.disabled = Boolean(exp2.checked[instrument.id]);
      input.addEventListener("change", function () { exp2.choice = option.value; });
      label.appendChild(input);
      label.appendChild(make("span", null, option.label));
      observeOptions.appendChild(label);
    });
  }

  function renderInstrumentFeedback() {
    clear(instrumentFeedback);
    var instrument = currentInstrument();
    if (!exp2.checked[instrument.id]) { return; }
    var given = exp2.answers[instrument.id];
    var correctOption = instrument.options.filter(function (o) { return o.correct; })[0];
    var chosenOption = instrument.options.filter(function (o) {
      return o.value === given;
    })[0];

    var first = make("div", "verdict");
    first.setAttribute("data-tone", given === correctOption.value ? "good" : "caution");
    first.appendChild(make("h5", "verdict__title",
      given === correctOption.value
        ? "What it directly observes - yes"
        : "What it directly observes - not quite"));
    first.appendChild(make("p", "verdict__body",
      "It observes: " + correctOption.label.toLowerCase() + "." +
      (given === correctOption.value ? " That is what you said."
        : " You said “" + chosenOption.label + "”, which is already " +
          "an interpretation of the trace rather than the trace itself.")));
    instrumentFeedback.appendChild(first);

    var second = make("div", "verdict");
    second.setAttribute("data-tone", "neutral");
    second.appendChild(make("h5", "verdict__title", "What is inferred from it"));
    second.appendChild(make("p", "verdict__body", instrument.inferred));
    instrumentFeedback.appendChild(second);

    var third = make("div", "verdict");
    third.setAttribute("data-tone", "warn");
    third.appendChild(make("h5", "verdict__title", "What it cannot support"));
    third.appendChild(make("p", "verdict__body", instrument.cannot));
    instrumentFeedback.appendChild(third);

    /* The confounds are the longest part of each instrument and the part a
       learner needs least at the moment of the answer, so they open on
       request rather than arriving with the verdict. */
    var more = make("details", "stage__more");
    more.appendChild(make("summary", null, "What remains unexplained"));
    more.appendChild(make("p", null, instrument.remains));
    instrumentFeedback.appendChild(more);
  }

  function renderLevels() {
    var done = Object.keys(exp2.checked).length;
    levels.hidden = done === 0;
    clear(levelsBody);
    INSTRUMENTS.forEach(function (instrument) {
      if (!exp2.checked[instrument.id]) { return; }
      var correctOption = instrument.options.filter(function (o) { return o.correct; })[0];
      var tr = make("tr");
      var th = make("th", null, instrument.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, correctOption.label));
      tr.appendChild(make("td", null, instrument.level));
      tr.appendChild(make("td", null, instrument.cannot));
      levelsBody.appendChild(tr);
    });
  }

  function renderGoal() {
    var done = Object.keys(exp2.checked).length;
    clear(goalText);
    var list = make("ul", "goal__checks");
    var levelsSeen = {};
    INSTRUMENTS.forEach(function (instrument) {
      if (exp2.checked[instrument.id]) {
        levelsSeen[instrument.level.split(" - ")[0]] = true;
      }
    });
    var levelCount = Object.keys(levelsSeen).length;
    [
      { label: "Instruments checked", detail: done + " of 5", met: done === 5 },
      { label: "Levels of description reached", detail: levelCount + " of 3", met: levelCount >= 3 }
    ].forEach(function (check) {
      var li = make("li");
      li.textContent = check.label + " - " + check.detail +
        (check.met ? " (met)" : " (not yet)");
      li.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(li);
    });
    goalText.appendChild(list);
  }

  function renderExp2(options) {
    var instrument = currentInstrument();
    buildInstrumentPicks();
    buildObserveOptions();
    evidenceHeading.textContent = instrument.name;
    evidenceLevel.textContent = instrument.level;
    evidenceText.textContent = instrument.finding;
    renderInstrumentFeedback();
    renderLevels();
    renderGoal();
    if (options && options.announce) {
      instrumentShell.announce(options.announce, { immediate: true });
    }
  }

  $('[data-action="check"]').addEventListener("click", function () {
    var instrument = currentInstrument();
    if (exp2.checked[instrument.id]) {
      observeNote.textContent =
        "This one is already checked. Choose another instrument above.";
      instrumentShell.announce(observeNote.textContent, { immediate: true });
      return;
    }
    if (!exp2.choice) {
      observeNote.textContent = "Choose one option before checking.";
      instrumentShell.announce(observeNote.textContent, { immediate: true });
      return;
    }
    observeNote.textContent = "";
    exp2.checked[instrument.id] = true;
    exp2.answers[instrument.id] = exp2.choice;
    var correctOption = instrument.options.filter(function (o) { return o.correct; })[0];
    renderExp2({
      announce: instrument.name + " checked. It directly observes " +
        correctOption.label.toLowerCase() + ". The inference, the alternatives " +
        "and what it cannot support are beside you."
    });
  });

  /* =======================================================================
     Challenge
     ===================================================================== */

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
      CLAIM_OPTIONS.forEach(function (option) {
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
      showFeedback(claimsFeedback, "caution", "One judgement per claim, please.",
        "None of the five is a trick, and two of them are genuinely partial.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", right + " of 5 match."));
    lead.appendChild(document.createTextNode(
      " None of the five is supported outright, and the two partial ones are " +
      "partial for different reasons - one because the measure is ambiguous, " +
      "one because the finding is real but does not name its own cause."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        (index + 1) + ": " + CLAIM_LABELS[claim.answer] + "."));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + CLAIM_LABELS[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    latencyShell.announce("Five claims judged. " + right + " match.",
      { immediate: true });
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    strong: {
      tone: "caution",
      verdict: "That is the popular account, and experiment 1 is an argument against it.",
      text:
        "\"Something the person cannot conceal\" is a claim about what the " +
        "score is, not a finding about what it predicts. Watch how often the " +
        "score points one way and the respondent goes the other."
    },
    moderate: {
      tone: "caution",
      verdict: "Not in this sample, and not in the real meta-analyses either.",
      text:
        "The relationship in the simulated data is deliberately of the same " +
        "order as those reported for real latency-behaviour correlations. It " +
        "is real at the level of a population and does not survive the trip " +
        "down to one person."
    },
    weak: {
      tone: "good",
      verdict: "That is exactly it, and holding both halves is the skill.",
      text:
        "A small average association is a genuine fact about how a population " +
        "is arranged. It supports no statement about which side of any line " +
        "the person in front of you falls, and experiment 1 lets you feel the " +
        "difference rather than being told it."
    },
    none: {
      tone: "caution",
      verdict: "Slightly too strong, and the overcorrection matters.",
      text:
        "They are related, just weakly. Concluding that a latency task " +
        "measures nothing is as much a misreading as concluding that it " +
        "measures a hidden self, and it throws away a real finding about a " +
        "population."
    }
  };

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openLabs() {
    expOne.hidden = false;
    expTwo.hidden = false;
    renderExp1();
    renderExp2();
    latencyShell.announce(
      "Both experiments open. Experiment 1 starts at respondent 1.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the experiments.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLabs();
    $("#exp1-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    openLabs();
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  /* One handler, registered on BOTH shells, so either reset button restores
     the whole page. Registering a per-experiment handler on its own shell
     would leave a learner who reset experiment 2 with experiment 1 still
     part-answered and the prediction gate reopened - which is exactly the
     inconsistent state the reset is meant to prevent. */
  function resetAll() {
    exp1 = JSON.parse(JSON.stringify(EXP1_INITIAL));
    exp2 = JSON.parse(JSON.stringify(EXP2_INITIAL));
    guessNote.textContent = "";
    observeNote.textContent = "";
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    expOne.hidden = true;
    expTwo.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    renderExp1();
    renderExp2();
  }

  latencyShell.onReset(resetAll);
  instrumentShell.onReset(resetAll);

  buildClaims();

  latencyShell.reset({ silent: true });
  instrumentShell.reset({ silent: true });
  latencyShell.announce(
    "Ready. Answer the question above to open both experiments.",
    { immediate: true });
})();
