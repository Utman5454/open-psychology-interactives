/**
 * What the Instrument Actually Sees  (Simplified Edition)
 *
 * Teaching job: each instrument named after prejudice directly observes
 * something much narrower, and one of the four is not about individuals at all,
 * so the four are not four routes to one object.
 *
 * The mechanism from the full Measuring Prejudice laboratory is preserved: for
 * each instrument, read what was found, commit to what it DIRECTLY OBSERVES
 * before anything is inferred, and then see what is usually inferred, what else
 * could produce the finding, and what it cannot show.
 *
 * THE CORRECT OPTION IS ALWAYS THE DEFLATIONARY ONE, and the distractors are
 * not straw men: each is a description somebody publishes. The feedback names
 * what is wrong with the chosen one rather than simply marking it.
 *
 * THE PAYOFF IS THE LEVELS POINT. Three instruments are about individuals and
 * the fourth is a distribution across an organisation over time. It is not a
 * worse measure of individual attitudes; it is not one at all, and the "cannot
 * show" for it runs in both directions: it does not establish that anybody
 * acted on a prejudice, and no study of individual attitudes can confirm or
 * refute it, because the two are claims about different objects.
 *
 * WHAT WAS CUT. The informant-report instrument, which sits at a level between
 * the individual and the institutional; the prediction round in which the
 * learner guesses a fictional respondent's behaviour from their score; and the
 * closing exercise on published-style claims. The synthesis names the missing
 * level.
 *
 * ON THE SUBJECT MATTER. Nothing on this page measures the reader, and the
 * reader never takes any instrument. Vantry, the Uplands and the Lowlands are
 * invented, no group stands for any real group, and no stereotype content
 * appears anywhere: the activity is about what an instrument observes and
 * would run identically for any pair of invented categories. Every figure is
 * written for teaching and none is an estimate of anything.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var INSTRUMENTS = [
    {
      id: "selfreport",
      name: "Explicit self-report",
      level: "An individual, and what they will state",
      finding: "A national survey of 2,400 simulated respondents asked people to rate how warmly they felt towards each region on a scale of 0 to 100. Mean warmth towards Uplanders was 61 and towards Lowlanders 74. The gap has narrowed from 22 points to 13 over ten years.",
      options: [
        { key: "attitude", text: "A person's attitude towards Uplanders" },
        { key: "written", text: "What people are willing to write down, on this scale, under these conditions", correct: true },
        { key: "feeling", text: "How warmly people actually feel" },
        { key: "change", text: "That prejudice in Vantry has fallen by nine points" }
      ],
      inferred: "An underlying evaluative attitude, and from the ten-year change that the attitude has shifted.",
      remains: "That what is sayable changed rather than what is felt; that the format invites a number people can defend rather than one they hold; that who agreed to take part changed over ten years; and that a difference of 13 points on an invented scale has no natural unit at all.",
      cannot: "That any individual respondent feels what they wrote, or that the ten-year narrowing is a change in feeling rather than in what can be said.",
      short: "What people will write on a scale"
    },
    {
      id: "latency",
      name: "Latency-based association task",
      level: "An individual, and a difference in processing speed",
      finding: "Two hundred simulated respondents sorted words and images under two pairings of categories. Sorting was faster on average under one pairing than the other, and the distribution of individual scores overlaps heavily with zero.",
      options: [
        { key: "hidden", text: "An attitude the respondent is unwilling or unable to report" },
        { key: "speed", text: "A difference in mean sorting speed between two pairings of categories", correct: true },
        { key: "bias", text: "How biased each respondent is" },
        { key: "behaviour", text: "How each respondent will behave towards Uplanders" }
      ],
      inferred: "The relative accessibility of an association in memory, and from that an evaluative attitude the person may not report.",
      remains: "Familiarity and frequency of the particular stimuli; block order and practice; the salience asymmetry between a large and a small category; general processing speed; and the plain fact that an association becoming available quickly is not the same as endorsing it.",
      cannot: "That any individual respondent will treat an Uplander differently, or that the number is a reading taken from behind the person's own answers.",
      short: "A difference in sorting speed"
    },
    {
      id: "behaviour",
      name: "Behavioural choice",
      level: "An individual, and one act on one occasion",
      finding: "Each of the two hundred respondents shortlisted four of eight fictional candidates for a fictional post. Four candidates were coded as Uplanders, all other details were identical, and the pairings were rotated across respondents.",
      options: [
        { key: "disposition", text: "A person's disposition to discriminate" },
        { key: "files", text: "Which files a person selected, in one task, on one occasion", correct: true },
        { key: "hiring", text: "How that person hires in real life" },
        { key: "prejudice", text: "The behavioural component of prejudice" }
      ],
      inferred: "A disposition to treat people differently, and often, with no warrant, how the person would act in a real appointment.",
      remains: "One occasion is not a disposition; the respondent may have worked out what the study was about; a shortlist in a study costs nobody a job; and rotating the names controls the candidate but not what the respondent took the task to be asking of them.",
      cannot: "That the same person would do the same thing where it mattered, or that a pattern across two hundred people in a study describes a hiring process anywhere.",
      short: "Which files somebody picked, once"
    },
    {
      id: "institutional",
      name: "Institutional outcomes",
      level: "An organisation, and a distribution over twelve years",
      finding: "Uplanders are 18 per cent of the Vantry workforce, 19 per cent of applicants to senior posts and 7 per cent of appointments. The gap is present in all six regions and has not moved in twelve years.",
      options: [
        { key: "discrimination", text: "Discrimination in the appointments process" },
        { key: "distribution", text: "A distribution of outcomes across an organisation over time", correct: true },
        { key: "attitudes", text: "The accumulated attitudes of the people who sat on panels" },
        { key: "merit", text: "That the two groups differ in what the process is measuring" }
      ],
      inferred: "Discrimination, which is one candidate explanation among several and the step to slow down at.",
      remains: "What is counted as relevant experience and who accumulates it; where posts are advertised and who sees them; who sits on panels and what they are asked to weigh; which posts people apply for and why; and prior stages that shaped the applicant pool long before any panel met. An outcome pattern this stable does not need anybody's attitude to sustain it, which is exactly why it is not evidence about anybody's attitude.",
      cannot: "That any individual acted on a prejudice. And, running the other way, no study of individual attitudes, however large, can confirm or refute it, because it is a claim about a different object.",
      short: "A distribution of appointments over twelve years"
    }
  ];

  function instrumentById(id) {
    var found = null;
    INSTRUMENTS.forEach(function (i) { if (i.id === id) { found = i; } });
    return found;
  }

  function correctOf(instrument) {
    var found = null;
    instrument.options.forEach(function (o) { if (o.correct) { found = o; } });
    return found;
  }

  function optionOf(instrument, key) {
    var found = null;
    instrument.options.forEach(function (o) { if (o.key === key) { found = o; } });
    return found;
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardLab;
  var instrumentBox, reading, questionBlock, observesBox, analysis, sentence;
  var allBtn, cardSummary, summaryBody, summarySentence, explainBtn;
  var synthesis, resultLead;

  var answered = false;
  var open = null;
  var settled = {};

  var VERDICTS = {
    observes: { state: "correct", text:
      "Yes, and it is a stronger claim than it sounds. They are not four " +
      "routes to one object at different levels of accuracy. One of the four " +
      "below is not about individual people at all, and no amount of " +
      "individual-level evidence bears on it either way." },
    accuracy: { state: "incorrect", text:
      "This assumes there is one thing they are all more or less accurate " +
      "about. Three of the four below observe something about a person and " +
      "the fourth observes a distribution across an organisation over twelve " +
      "years, and accuracy is not the relation between them." },
    faking: { state: "partial", text:
      "This is a real difference between two of the four and it is the reason " +
      "the second one was developed, so it is not simply wrong. It describes " +
      "one axis rather than the main one, and it does not reach the " +
      "instrument that is not about individuals at all." },
    modern: { state: "incorrect", text:
      "None of the four has superseded any other, and all four are in current " +
      "use. Where they disagree it is usually because they are about different " +
      "things rather than because one is out of date." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "observes") {
      wb.choices.mark(options.querySelector('[data-choice="observes"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardLab);
    render();
    wb.scrollTo(cardLab);
    wb.announce("Four instruments. Open one.");
  }

  /* -------------------------------------------------------------- helpers */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function buildInstruments() {
    INSTRUMENTS.forEach(function (instrument) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "instrument");
      input.setAttribute("value", instrument.id);
      input.value = instrument.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, instrument.name));
      wrap.appendChild(el("span", null, instrument.level));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { openInstrument(instrument.id); });
      instrumentBox.appendChild(label);
    });
  }

  function openInstrument(id) {
    open = id;
    render();
    wb.announce(instrumentById(id).name + " opened.");
  }

  function judge(key) {
    if (settled[open]) { return; }
    settled[open] = key;
    if (Object.keys(settled).length >= 3) { allBtn.disabled = false; }
    render();
    var instrument = instrumentById(open);
    wb.announce(key === correctOf(instrument).key
      ? "Correct. It observes " + correctOf(instrument).text.toLowerCase() + "."
      : "Not quite. It observes " + correctOf(instrument).text.toLowerCase() + ".");
  }

  function render() {
    Array.prototype.forEach.call(instrumentBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === open;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });

    reading.textContent = "";
    analysis.textContent = "";
    observesBox.textContent = "";

    if (!open) {
      wb.hide(questionBlock);
      sentence.textContent = "Nothing is open yet. All four teams describe " +
        "what they measured as prejudice towards Uplanders.";
      allBtn.disabled = Object.keys(settled).length < 3;
      return;
    }

    var instrument = instrumentById(open);
    var box = el("div", "block");
    box.appendChild(el("p", "step-label", instrument.name));
    box.appendChild(el("p", "small", instrument.level));
    box.appendChild(el("p", null, instrument.finding));
    reading.appendChild(box);

    var done = !!settled[open];
    instrument.options.forEach(function (option) {
      var button = el("button", "option");
      button.type = "button";
      button.setAttribute("data-choice", option.key);
      button.appendChild(el("strong", null, option.text));
      if (done) {
        button.setAttribute("aria-disabled", "true");
        if (option.correct) {
          button.setAttribute("data-state", "correct");
          button.appendChild(el("span", null, "This is what it records, before anything is inferred."));
        } else if (option.key === settled[open]) {
          button.setAttribute("data-state", "incorrect");
          button.appendChild(el("span", null,
            "This is what the finding is usually reported as, which is the " +
            "inference rather than the observation."));
        } else {
          button.appendChild(el("span", null,
            "A description somebody publishes, and a step beyond what was recorded."));
        }
      } else {
        button.appendChild(el("span", null, ""));
        button.addEventListener("click", function () { judge(option.key); });
      }
      observesBox.appendChild(button);
    });
    wb.show(questionBlock);

    if (done) {
      var out = el("div", "block");
      out.appendChild(el("p", "step-label", "What follows, and what does not"));
      [
        ["Usually inferred from it", instrument.inferred],
        ["Also consistent with the finding", instrument.remains],
        ["What it cannot show", instrument.cannot]
      ].forEach(function (pair) {
        out.appendChild(el("p", "small", pair[0] + ": " + pair[1]));
      });
      analysis.appendChild(out);
    }

    var n = Object.keys(settled).length;
    sentence.textContent = "Instruments settled: " + n + " of " + INSTRUMENTS.length +
      (n >= 3 ? ". The comparison is available." : ". Settle three to open the comparison.");
    allBtn.disabled = n < 3;
  }

  function showAll() {
    wb.show(cardSummary);
    summaryBody.textContent = "";
    INSTRUMENTS.forEach(function (instrument) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", instrument.name, "row"));
      tr.appendChild(cell("td", instrument.level));
      tr.appendChild(cell("td", correctOf(instrument).text));
      tr.appendChild(cell("td", instrument.cannot));
      /* Only set it when there is a state. setAttribute(name, null) writes
         the literal string "null" into the markup rather than omitting the
         attribute. */
      if (instrument.id === "institutional") {
        tr.setAttribute("data-state", "chosen");
      }
      summaryBody.appendChild(tr);
    });

    var individual = INSTRUMENTS.filter(function (i) {
      return i.level.indexOf("An individual") === 0;
    }).length;
    summarySentence.textContent =
      individual + " of the " + INSTRUMENTS.length + " are about an individual " +
      "person and one is about a distribution across an organisation. That " +
      "last one is not a worse measure of individual attitudes; it is not a " +
      "measure of them at all, and its final column runs in both directions. " +
      "It does not establish that anybody acted on a prejudice, and no study " +
      "of individual attitudes can confirm or refute it either.";
    wb.scrollTo(cardSummary);
    wb.announce("The four instruments side by side.");
  }

  function explain() {
    var right = INSTRUMENTS.filter(function (i) {
      return settled[i.id] === correctOf(i).key;
    }).length;
    resultLead.textContent =
      "You settled " + Object.keys(settled).length + " of the four instruments " +
      "and identified what " + right + " of them directly observe. All four " +
      "are published as measurements of prejudice, and what they record is " +
      INSTRUMENTS.map(function (i) { return i.short.toLowerCase(); }).join(", ") + ".";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardLab = wb.root.querySelector("#card-lab");
    instrumentBox = wb.root.querySelector("#instruments");
    reading = wb.root.querySelector("#reading");
    questionBlock = wb.root.querySelector("#question-block");
    observesBox = wb.root.querySelector("#observes");
    analysis = wb.root.querySelector("#analysis");
    sentence = wb.root.querySelector("#sentence");
    allBtn = wb.root.querySelector("#all");
    cardSummary = wb.root.querySelector("#card-summary");
    summaryBody = wb.root.querySelector("#summary-body");
    summarySentence = wb.root.querySelector("#summary-sentence");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    allBtn.addEventListener("click", showAll);
    explainBtn.addEventListener("click", explain);

    buildInstruments();

    wb.onReset(function () {
      answered = false;
      open = null;
      settled = {};
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLab);
      wb.hide(cardSummary);
      wb.hide(synthesis);
      render();
    });

    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
