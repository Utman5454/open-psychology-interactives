/* =========================================================================
   Culture-Fair Test Challenge
   -------------------------------------------------------------------------
   Students design a non-verbal reasoning task by choosing six features, and
   watch what each choice does to the demands the task makes that have nothing
   to do with reasoning. Removing language turns out to remove one demand and
   leave five.

   THE EDUCATIONAL MODEL
   ---------------------
   Six sources of construct-irrelevant demand are tracked:

     literacy   reading required to understand what to do
     schooling  familiarity with formal testing conventions
     puzzle     familiarity with abstract-puzzle formats
     speed      the expectation that answering quickly is wanted
     device     the medium and motor action the response requires
     strategy   knowing when to eliminate, when to guess, when to move on

   Each design choice sets a level from 0 to 1 on some of these. The score a
   task produces is modelled as

       construct-relevant share = 1 - mean(demand levels) × LOAD

   which is a deliberately crude way of saying: the more the task demands that
   is not reasoning, the less of the score is reasoning.

   FICTIONAL PARTICIPANTS — AND WHAT THEY ARE NOT
   ---------------------------------------------
   Four fictional people are described ONLY by their prior experience with
   testing formats, devices and puzzle conventions. They have no nationality,
   ethnicity, region, language or group membership, because the point being
   taught is about opportunity to learn a FORMAT, and attaching that to real
   groups would teach something else and something false.

   For each person the tool reports a "construct-irrelevant load": how many of
   the demands this particular design places on them that have nothing to do
   with reasoning. This is EXPLICITLY NOT a predicted score and not an ability
   estimate. The tool never outputs a score for any person, real or fictional,
   and never simulates a group difference of any kind.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var LOAD = 0.8;

  var DEMANDS = [
    { id: "literacy", name: "Reading demands",
      note: "What the person must read before they can begin." },
    { id: "schooling", name: "Testing conventions",
      note: "Familiarity with how formal tests work as a genre." },
    { id: "puzzle", name: "Puzzle familiarity",
      note: "Experience with abstract pattern problems as a kind of thing." },
    { id: "speed", name: "Speed expectations",
      note: "Whether answering fast is rewarded, and whether that is known." },
    { id: "device", name: "Device and motor demands",
      note: "The medium, and the physical action a response requires." },
    { id: "strategy", name: "Test-taking strategy",
      note: "Knowing when to eliminate, guess, skip or check." }
  ];

  /* Six design decisions. Each option states what it does to the demands. */
  var FEATURES = [
    {
      id: "instructions",
      name: "Instructions",
      options: [
        { id: "written", name: "Written, in the test language",
          demands: { literacy: 0.9, schooling: 0.6 },
          note: "The fastest way to reintroduce language into a non-verbal test." },
        { id: "spoken", name: "Spoken aloud, with gestures",
          demands: { literacy: 0.2, schooling: 0.45 },
          note: "Removes reading. Still assumes shared conventions about what is being asked." },
        { id: "demonstrated", name: "Demonstrated, with worked examples",
          demands: { literacy: 0.05, schooling: 0.25 },
          note: "Shows rather than tells. The strongest option here, and slower to administer." }
      ]
    },
    {
      id: "practice",
      name: "Practice items",
      options: [
        { id: "none", name: "None — straight into scored items",
          demands: { puzzle: 0.9, strategy: 0.7, schooling: 0.5 },
          note: "Every early item doubles as a lesson in the format, and it is scored." },
        { id: "examples", name: "Two worked examples, no feedback",
          demands: { puzzle: 0.55, strategy: 0.45, schooling: 0.3 },
          note: "Better. Does not confirm the person has actually understood." },
        { id: "feedback", name: "Four practice items with corrective feedback",
          demands: { puzzle: 0.2, strategy: 0.2, schooling: 0.15 },
          note: "Brings everyone to a common starting point on the format itself." }
      ]
    },
    {
      id: "timing",
      name: "Time limit",
      options: [
        { id: "strict", name: "Strict — a fixed short limit per item",
          demands: { speed: 0.9, strategy: 0.6 },
          note: "Now partly a measure of speed and of knowing that speed is wanted." },
        { id: "generous", name: "Generous overall limit",
          demands: { speed: 0.4, strategy: 0.3 },
          note: "Most people finish; some still rush because they assume they should." },
        { id: "untimed", name: "Untimed",
          demands: { speed: 0.05, strategy: 0.15 },
          note: "Measures reasoning rather than reasoning-under-time. Costs session length." }
      ]
    },
    {
      id: "response",
      name: "Response format",
      options: [
        { id: "paper", name: "Paper, mark the chosen box",
          demands: { device: 0.2, schooling: 0.4 },
          note: "Low device demand; assumes familiarity with answer grids." },
        { id: "mouse", name: "On screen, click with a mouse",
          demands: { device: 0.6, schooling: 0.25 },
          note: "Assumes an input device many people now rarely use." },
        { id: "touch", name: "On screen, drag with a finger",
          demands: { device: 0.4, schooling: 0.2 },
          note: "Familiar to many, and a fine motor demand for some." }
      ]
    },
    {
      id: "stimuli",
      name: "Stimulus content",
      options: [
        { id: "objects", name: "Everyday objects and scenes",
          demands: { puzzle: 0.3, schooling: 0.55, literacy: 0.15 },
          note: "\"Everyday\" is a decision. Whose everyday, and how would you check?" },
        { id: "abstract", name: "Abstract geometric figures",
          demands: { puzzle: 0.6, schooling: 0.2 },
          note: "No objects to recognise — and abstract puzzles are themselves a learned genre." },
        { id: "depth", name: "Abstract figures using perspective and depth cues",
          demands: { puzzle: 0.65, schooling: 0.35, strategy: 0.2 },
          note: "Depth conventions in flat pictures are learned, not universal." }
      ]
    },
    {
      id: "scoring",
      name: "Scoring rule",
      options: [
        { id: "correct", name: "Number correct",
          demands: { strategy: 0.25 },
          note: "Guessing is free, so anyone who does not know that is disadvantaged." },
        { id: "penalty", name: "Correct minus a penalty for wrong answers",
          demands: { strategy: 0.85, schooling: 0.4 },
          note: "Rewards knowing the scoring rule. A large strategy demand for a reasoning test." },
        { id: "adaptive", name: "Stops when several are missed in a row",
          demands: { strategy: 0.4, speed: 0.2, schooling: 0.3 },
          note: "Shortens the session and makes early unfamiliarity unusually costly." }
      ]
    }
  ];

  /* Four fictional people, described ONLY by experience with formats and
     devices. No nationality, ethnicity, region, language or group membership
     is stated or implied anywhere, because the teaching point is about
     opportunity to learn a format. Values are unfamiliarity, 0 to 1. */
  var PARTICIPANTS = [
    {
      id: "p1",
      name: "Participant A",
      sketch:
        "Has sat many timed multiple-choice tests during formal schooling, and does abstract puzzle books for enjoyment.",
      unfamiliarity: { literacy: 0.05, schooling: 0.05, puzzle: 0.05, speed: 0.1, device: 0.15, strategy: 0.1 }
    },
    {
      id: "p2",
      name: "Participant B",
      sketch:
        "Was assessed at school through oral examination and long-form written work, and has never sat a timed multiple-choice test.",
      unfamiliarity: { literacy: 0.15, schooling: 0.8, puzzle: 0.6, speed: 0.75, device: 0.3, strategy: 0.85 }
    },
    {
      id: "p3",
      name: "Participant C",
      sketch:
        "Uses a smartphone daily and has rarely used a desktop computer with a mouse. Comfortable with timed tests on paper.",
      unfamiliarity: { literacy: 0.1, schooling: 0.2, puzzle: 0.35, speed: 0.15, device: 0.75, strategy: 0.25 }
    },
    {
      id: "p4",
      name: "Participant D",
      sketch:
        "Returned to education after twenty years away. Reads fluently, and has not encountered abstract-shape reasoning problems before.",
      unfamiliarity: { literacy: 0.1, schooling: 0.45, puzzle: 0.85, speed: 0.5, device: 0.4, strategy: 0.5 }
    }
  ];

  /* =======================================================================
     Model
     ===================================================================== */

  function demandLevels(choices) {
    var levels = {};
    DEMANDS.forEach(function (demand) {
      levels[demand.id] = 0;
    });
    FEATURES.forEach(function (feature) {
      var option = optionFor(feature, choices[feature.id]);
      if (!option) {
        return;
      }
      Object.keys(option.demands).forEach(function (id) {
        // Demands from different features do not simply add; the strongest
        // requirement dominates, which is why max rather than sum.
        levels[id] = Math.max(levels[id], option.demands[id]);
      });
    });
    return levels;
  }

  function optionFor(feature, optionId) {
    return feature.options.filter(function (option) {
      return option.id === optionId;
    })[0];
  }

  function meanDemand(levels) {
    var total = DEMANDS.reduce(function (sum, demand) {
      return sum + levels[demand.id];
    }, 0);
    return total / DEMANDS.length;
  }

  /** Share of the score plausibly reflecting the target reasoning ability. */
  function constructShare(levels) {
    return Math.max(0.05, 1 - meanDemand(levels) * LOAD);
  }

  /**
   * How many of this design's demands land on a person who has not had the
   * chance to become familiar with them. NOT a score, NOT an ability
   * estimate, and the page says so wherever this appears.
   */
  function irrelevantLoad(levels, participant) {
    var total = DEMANDS.reduce(function (sum, demand) {
      return sum + levels[demand.id] * participant.unfamiliarity[demand.id];
    }, 0);
    return total / DEMANDS.length;
  }

  /** Which specific demands are both high in the design and unfamiliar. */
  function hurdles(levels, participant) {
    return DEMANDS.filter(function (demand) {
      return levels[demand.id] >= 0.4 && participant.unfamiliarity[demand.id] >= 0.4;
    });
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function pct(value) {
    return Math.round(value * 100) + "%";
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#culture-fair");
  if (!shell) {
    return;
  }

  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var featureList = $("[data-features]");
  var demandChart = $("[data-demand-chart]");
  var demandTable = $("[data-demand-table]");
  var shareBar = $("[data-share-bar]");
  var shareNote = $("[data-share-note]");
  var participantList = $("[data-participants]");
  var summary = $("[data-summary]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var evidenceForm = $("#evidence-form");
  var evidenceFeedback = $("[data-evidence-feedback]");

  var INITIAL = {
    stage: "predict",
    choices: {
      instructions: "written",
      practice: "none",
      timing: "strict",
      response: "mouse",
      stimuli: "depth",
      scoring: "penalty"
    }
  };
  var state = null;
  var radios = {};

  /* --- Build the design controls ------------------------------------------ */

  function buildFeatures() {
    clear(featureList);
    FEATURES.forEach(function (feature) {
      var group = make("fieldset", "feature");
      var legend = make("legend", "feature__name", feature.name);
      group.appendChild(legend);

      feature.options.forEach(function (option) {
        var label = make("label", "control--choice feature__option");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "feature-" + feature.id;
        input.value = option.id;
        input.addEventListener("change", function () {
          state.choices[feature.id] = option.id;
          render();
          shell.announce(
            feature.name + " set to " + option.name + ". " + option.note);
        });
        radios[feature.id + ":" + option.id] = input;

        var body = make("span", "feature__body");
        body.appendChild(make("span", "feature__label", option.name));
        body.appendChild(make("span", "feature__note", option.note));

        label.appendChild(input);
        label.appendChild(body);
        group.appendChild(label);
      });

      featureList.appendChild(group);
    });
  }

  function applyChoices() {
    FEATURES.forEach(function (feature) {
      var key = feature.id + ":" + state.choices[feature.id];
      if (radios[key]) {
        radios[key].checked = true;
      }
    });
  }

  function setEnabled(enabled) {
    Object.keys(radios).forEach(function (key) {
      radios[key].disabled = !enabled;
    });
  }

  /* --- Rendering ------------------------------------------------------------ */

  function render() {
    if (state.stage !== "design") {
      return;
    }
    var levels = demandLevels(state.choices);
    renderDemands(levels);
    renderShare(levels);
    renderParticipants(levels);
    renderSummary(levels);
  }

  function renderDemands(levels) {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 30;
    var BAR = 18;
    var LEFT = 168;
    var SCALE = 240;

    clear(demandChart);
    demandChart.setAttribute("viewBox", "0 0 460 " + (DEMANDS.length * ROW + 14));

    DEMANDS.forEach(function (demand, index) {
      var y = 8 + index * ROW;
      var value = levels[demand.id];

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR - 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = demand.name;
      demandChart.appendChild(label);

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(LEFT));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(SCALE));
      track.setAttribute("height", String(BAR));
      track.setAttribute("class", "chart__track");
      demandChart.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(LEFT));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(value * SCALE));
      bar.setAttribute("height", String(BAR));
      bar.setAttribute(
        "class", "chart__bar" + (value >= 0.6 ? " chart__bar--high" : ""));
      demandChart.appendChild(bar);

      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(LEFT + value * SCALE + 6));
      text.setAttribute("y", String(y + BAR - 4));
      text.setAttribute("class", "chart__count");
      text.textContent = pct(value);
      demandChart.appendChild(text);
    });

    clear(demandTable);
    DEMANDS.forEach(function (demand) {
      var value = levels[demand.id];
      var row = make("tr");
      var th = make("th", null, demand.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, pct(value)));
      row.appendChild(
        make("td", null,
          value >= 0.6 ? "high" : value >= 0.3 ? "moderate" : "low"));
      demandTable.appendChild(row);
    });
  }

  function renderShare(levels) {
    var share = constructShare(levels);
    clear(shareBar);

    var relevant = make("div", "share__part share__part--relevant");
    relevant.style.width = (share * 100).toFixed(1) + "%";
    relevant.appendChild(
      make("span", "share__label", "reasoning " + pct(share)));

    var irrelevant = make("div", "share__part share__part--irrelevant");
    irrelevant.style.width = ((1 - share) * 100).toFixed(1) + "%";
    irrelevant.appendChild(
      make("span", "share__label", "other demands " + pct(1 - share)));

    shareBar.appendChild(relevant);
    shareBar.appendChild(irrelevant);

    shareNote.textContent =
      "Model-implied share of this task's score that plausibly reflects the " +
      "reasoning it is meant to measure: " + pct(share) + ". The rest is " +
      "demand the task makes for other reasons. This is an illustration of a " +
      "principle, not an estimate of any real test.";
    shareNote.setAttribute(
      "data-tone", share >= 0.7 ? "good" : share >= 0.5 ? "caution" : "warn");
  }

  function renderParticipants(levels) {
    clear(participantList);

    PARTICIPANTS.forEach(function (participant) {
      var load = irrelevantLoad(levels, participant);
      var blocks = hurdles(levels, participant);

      var item = make("li", "participant");
      // h3: the section's own heading is an h2, so h4 would skip a level.
      item.appendChild(make("h3", "participant__name", participant.name));
      item.appendChild(make("p", "participant__sketch", participant.sketch));

      var meter = make("div", "participant__meter");
      var fill = make("div", "participant__fill");
      fill.style.width = Math.min(100, load * 260).toFixed(1) + "%";
      meter.appendChild(fill);
      item.appendChild(meter);

      item.appendChild(
        make("p", "participant__load",
          "Construct-irrelevant load from this design: " + pct(load) + "."));

      if (blocks.length) {
        var list = make("ul", "participant__hurdles");
        blocks.forEach(function (demand) {
          list.appendChild(
            make("li", null,
              demand.name + " — high in your design, and unfamiliar to them"));
        });
        item.appendChild(list);
      } else {
        item.appendChild(
          make("p", "participant__hurdles",
            "No demand in your design is both high and unfamiliar to them."));
      }

      participantList.appendChild(item);
    });
  }

  function renderSummary(levels) {
    var share = constructShare(levels);
    var loads = PARTICIPANTS.map(function (participant) {
      return irrelevantLoad(levels, participant);
    });
    var spread = Math.max.apply(null, loads) - Math.min.apply(null, loads);

    var text =
      "Your design places quite different amounts of construct-irrelevant " +
      "demand on these four people: a range of " + pct(spread) + " between " +
      "the least and most affected. ";

    if (spread > 0.25) {
      text +=
        "That gap is the problem the phrase \"culture-fair\" is trying to " +
        "name. It has nothing to do with how well any of them reasons — it is " +
        "produced entirely by decisions you just made about instructions, " +
        "timing, format and scoring.";
    } else if (spread > 0.12) {
      text +=
        "Narrower than the default design, and not gone. Every remaining " +
        "point of difference is a demand somebody has had more opportunity to " +
        "become familiar with than somebody else.";
    } else {
      text +=
        "About as level as these six decisions can make it. Note that it is " +
        "not zero, and that you achieved this by adding practice, removing " +
        "time pressure and demonstrating rather than explaining — all of which " +
        "cost administration time. Fairness here was bought, not found.";
    }

    summary.textContent = text;
    summary.setAttribute(
      "data-tone", spread > 0.25 ? "warn" : spread > 0.12 ? "caution" : "good");
  }

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    culture: {
      tone: "caution",
      verdict: "Not quite.",
      text:
        "Removing words removes reading. It leaves the conventions of formal " +
        "testing, familiarity with abstract puzzles as a genre, the " +
        "expectation that speed is wanted, the response medium, and knowing " +
        "when to guess. Work through the six demands below."
    },
    reading: {
      tone: "good",
      verdict: "Yes — and that is the whole point.",
      text:
        "Removing language removes the reading demand and nothing else. " +
        "Everything else a test asks of a person for reasons unrelated to " +
        "reasoning stays exactly where it was."
    },
    nothing: {
      tone: "caution",
      verdict: "Too strong in the other direction.",
      text:
        "It does help. A reasoning test that requires fluent reading in a " +
        "particular language is measuring reading as well as reasoning, and " +
        "removing that is a real improvement. It is just not the whole job."
    },
    bias: {
      tone: "caution",
      verdict: "Not the same thing.",
      text:
        "Bias in the technical sense means a test measures differently in " +
        "different groups — which is checked with measurement invariance and " +
        "differential item functioning analysis, not asserted from the " +
        "content. A test can look neutral and function differently; it can " +
        "also look loaded and function equivalently. That is the last " +
        "challenge on this page."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose an answer before designing. Committing first is the point.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    startDesigning();
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(
      openingFeedback, "neutral", "Prediction skipped — demonstration mode.",
      "With a class, ask the question aloud before unlocking the designer.");
    lockForm(openingForm);
    startDesigning();
  });

  function startDesigning() {
    state.stage = "design";
    setEnabled(true);
    render();
    shell.announce(
      "Designer unlocked. The starting design is a deliberately poor one — " +
        "change it and watch the demands move.",
      { immediate: true }
    );
  }

  /* --- The evidence challenge -------------------------------------------------
     Multi-select: which evidence would actually support a claim that scores
     mean the same thing for two groups of people. */

  var EVIDENCE = {
    invariance: {
      good: true,
      text:
        "Measurement invariance testing — checking that the same items relate " +
        "to the underlying construct in the same way in each group. Without " +
        "this, comparing means is comparing things that may not be the same " +
        "quantity."
    },
    dif: {
      good: true,
      text:
        "Differential item functioning analysis — checking whether individual " +
        "items behave differently for people matched on overall ability. This " +
        "finds the specific items carrying the problem."
    },
    familiarity: {
      good: true,
      text:
        "Evidence about prior opportunity to learn the format — whether the " +
        "groups had comparable experience of this kind of task, this response " +
        "medium and this timing convention."
    },
    thinkaloud: {
      good: true,
      text:
        "Qualitative evidence about how people actually approached the items — " +
        "think-aloud protocols or cognitive interviews. This catches " +
        "differences in strategy that no statistic will reveal on its own."
    },
    means: {
      good: false,
      text:
        "Similar mean scores are not evidence of comparability. Two groups " +
        "can score identically on a test that measures different things in " +
        "each of them, and can score differently on a test that measures the " +
        "same thing perfectly well. Means are the thing you want to interpret, " +
        "not the evidence that you may."
    },
    nowords: {
      good: false,
      text:
        "The absence of words is not evidence of anything. It is the claim " +
        "under examination, not support for it."
    },
    expert: {
      good: false,
      text:
        "Expert judgement that the content looks neutral is a reasonable " +
        "starting point and is not sufficient. Reviewers looking at items have " +
        "a poor record of predicting which ones will actually function " +
        "differently; that is why the statistical checks exist."
    }
  };

  evidenceForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var checked = Array.prototype.slice.call(
      evidenceForm.querySelectorAll('input[name="evidence"]:checked'));

    if (!checked.length) {
      showFeedback(evidenceFeedback, "caution", "Choose at least one.", "");
      return;
    }

    var chosen = checked.map(function (input) {
      return input.value;
    });
    var goodChosen = chosen.filter(function (id) {
      return EVIDENCE[id].good;
    });
    var badChosen = chosen.filter(function (id) {
      return !EVIDENCE[id].good;
    });
    var totalGood = Object.keys(EVIDENCE).filter(function (id) {
      return EVIDENCE[id].good;
    }).length;

    clear(evidenceFeedback);
    evidenceFeedback.hidden = false;
    evidenceFeedback.setAttribute(
      "data-tone",
      badChosen.length === 0 && goodChosen.length >= 3 ? "good" : "caution");

    var lead = make("p");
    lead.appendChild(
      make("strong", "feedback__verdict",
        goodChosen.length + " of " + totalGood + " useful kinds of evidence" +
        (badChosen.length
          ? ", and " + badChosen.length + " that will not do the job."
          : ", and nothing that will not do the job.")));
    evidenceFeedback.appendChild(lead);

    chosen.forEach(function (id) {
      var entry = make("p", "evidence__item");
      entry.appendChild(
        make("strong", null, EVIDENCE[id].good ? "Counts. " : "Does not count. "));
      entry.appendChild(document.createTextNode(EVIDENCE[id].text));
      evidenceFeedback.appendChild(entry);
    });

    evidenceFeedback.appendChild(
      make("p", null,
        "Comparability is something you establish with evidence about how the " +
        "test behaves, not something you infer from what the test looks like. " +
        "Until that evidence exists, the honest position is that scores from " +
        "different groups may not be on the same scale — a statement about " +
        "the test, not about the people.")
    );

    shell.announce("Evidence challenge answered.", { immediate: true });
  });

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) {
      paragraph.appendChild(document.createTextNode(" " + text));
    }
    container.appendChild(paragraph);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = true;
      }
    );
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = false;
      }
    );
    form.reset();
  }

  /* --- Best-case example ------------------------------------------------------ */

  $('[data-action="example"]').addEventListener("click", function () {
    state.choices = {
      instructions: "demonstrated",
      practice: "feedback",
      timing: "untimed",
      response: "paper",
      stimuli: "abstract",
      scoring: "correct"
    };
    applyChoices();
    render();
    shell.announce(
      "Loaded the lowest-demand design these six decisions allow. Note that " +
        "the construct-relevant share is still not 100 per cent, and that " +
        "every improvement cost administration time.",
      { immediate: true }
    );
  });

  /* --- Reset ------------------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    applyChoices();
    setEnabled(false);

    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;

    evidenceForm.reset();
    evidenceFeedback.hidden = true;

    render();
  });

  /* --- Start-up --------------------------------------------------------------- */

  buildFeatures();
  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the designer.",
    { immediate: true }
  );
})();
