/**
 * Five Explanations, All of Them Fit  (Simplified Edition)
 *
 * Teaching job: an explanation that fits what already happened is not the same
 * as one that predicts what has not, and an account that predicts nothing
 * cannot be refuted and is not supported when it survives.
 *
 * The model is the one from the full Courtroom, cut to five explanations and
 * four pieces of evidence. Each explanation records what it predicts about
 * each piece: +1 that the evidence should come out one way, -1 the other, 0
 * that it makes no prediction at all. Each piece of evidence has a direction
 * it actually came out. An explanation is then
 *
 *     contradicted  if it predicted the opposite of what was found
 *     supported     if it predicted what was found
 *     untouched     if it predicted nothing about that piece
 *
 * and its RISK is the number of requested pieces it committed itself on. That
 * count is the point of the activity. Two explanations are eliminated, three
 * survive, and the three do not survive alike: the achievement and efficacy
 * accounts staked themselves on every available piece, and the trait account
 * survives having staked itself on one, because a broad disposition is
 * compatible with almost anything somebody does on a single occasion.
 *
 * THE FOURTH PIECE OF EVIDENCE CANNOT BE REQUESTED. It is what she does in a
 * different setting over the following months, and it is the only thing that
 * separates the three survivors: the trait and achievement accounts predict
 * the behaviour generalises, and the self-efficacy account, which is
 * domain-specific by definition, predicts it does not. Having the deciding
 * observation be one that does not exist yet is not a contrivance. It is the
 * ordinary situation, and the page says so rather than manufacturing a verdict.
 *
 * Deliberate simplifications, stated in the caution:
 *   - Each account's predictions are written down in advance. Working out what
 *     an account commits itself to is most of the real difficulty, and many
 *     accounts are stated loosely enough to commit themselves to nothing.
 *   - Evidence is treated as pointing cleanly one way. Real evidence is mixed.
 *   - Some of these accounts are compatible rather than competing, so ruling
 *     one in does not rule another out. The page says this; the full version
 *     marks the pairs explicitly.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var EVIDENCE = [
    {
      id: "history",
      name: "Her record over the past two years",
      question: "Has she taken on difficult things before?",
      finding: "She has taken on two other difficult assignments, neither of " +
        "them visible to senior staff, and turned down one easy high-profile one.",
      direction: 1
    },
    {
      id: "private",
      name: "What she said privately afterwards",
      question: "Would she have volunteered if nobody had been watching?",
      finding: "She told a colleague she had been considering it since the " +
        "previous week, and would have offered in writing if the meeting had " +
        "not happened.",
      direction: 1
    },
    {
      id: "reward",
      name: "The promotion timetable",
      question: "Is there anything to be gained by doing this?",
      finding: "There is a promotion round in three months. Her manager " +
        "confirms that leading this project is not among the criteria being used.",
      direction: -1
    },
    {
      id: "elsewhere",
      name: "What she does in a different setting over the next six months",
      question: "Does this generalise beyond work of this kind?",
      finding: "Not available. This has not happened yet.",
      direction: 0,
      unavailable: true
    }
  ];

  var EXPLANATIONS = [
    {
      id: "trait",
      name: "She is an outgoing, unanxious person",
      family: "Dispositional",
      predicts: { history: 1, private: 0, reward: 0, elsewhere: 1 },
      note: "A broad disposition. It says she does this sort of thing generally, " +
        "and commits itself to very little about any one occasion."
    },
    {
      id: "achievement",
      name: "She is drawn to difficult tasks for their own sake",
      family: "Motivational",
      predicts: { history: 1, private: 1, reward: -1, elsewhere: 1 },
      note: "Commits itself on all three: a record of difficulty, a decision " +
        "made before the room was watching, and no need for a reward."
    },
    {
      id: "efficacy",
      name: "She believes she can do this particular kind of work",
      family: "Motivational",
      predicts: { history: 1, private: 1, reward: 0, elsewhere: -1 },
      note: "Domain-specific by definition, which is what makes it separable " +
        "from the first two, and only by evidence from another setting."
    },
    {
      id: "reputation",
      name: "She wanted it noticed",
      family: "Social",
      predicts: { history: -1, private: -1, reward: 1, elsewhere: 0 },
      note: "Predicts she would not have offered privately, and that there was " +
        "something to be gained."
    },
    {
      id: "pressure",
      name: "The silence became unbearable",
      family: "Situational",
      predicts: { history: -1, private: -1, reward: 0, elsewhere: -1 },
      note: "Predicts the timing exactly, and predicts she had not been " +
        "thinking about it beforehand."
    }
  ];

  var AVAILABLE = EVIDENCE.filter(function (e) { return !e.unavailable; });

  /** How one explanation stands against one piece of requested evidence. */
  function bearing(explanation, evidence) {
    var predicted = explanation.predicts[evidence.id];
    if (!predicted) { return "untouched"; }
    return predicted === evidence.direction ? "supported" : "contradicted";
  }

  function tally(explanation, requested) {
    var out = { supported: 0, contradicted: 0, committed: 0 };
    requested.forEach(function (id) {
      var evidence = byId(id);
      var result = bearing(explanation, evidence);
      if (result === "untouched") { return; }
      out.committed += 1;
      out[result] += 1;
    });
    return out;
  }

  function byId(id) {
    var found = null;
    EVIDENCE.forEach(function (e) { if (e.id === id) { found = e; } });
    return found;
  }

  function standing(explanation, requested) {
    var t = tally(explanation, requested);
    if (t.contradicted > 0) { return "ruled out"; }
    return "still standing";
  }

  function survivors(requested) {
    return EXPLANATIONS.filter(function (e) {
      return standing(e, requested) === "still standing";
    });
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardJury;
  var buttonBox, findingsBox, readout, standingBody, standingCaption, sentence;
  var allBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var requested = [];

  var VERDICTS = {
    predicts: { state: "correct", text:
      "Yes. An account that fits what already happened has not yet said " +
      "anything that could turn out to be wrong. An account that predicts " +
      "something the others do not has named an observation that would " +
      "separate them, and that is the only thing evidence can act on." },
    fits: { state: "incorrect", text:
      "Fitting more of the details sounds like a virtue and is closer to a " +
      "warning. An account flexible enough to accommodate every detail is " +
      "usually one that would have accommodated the opposite details just as " +
      "comfortably, which means no observation could have counted against it." },
    simple: { state: "partial", text:
      "Simplicity is a real consideration and it is not the one being asked " +
      "about here. It helps choose between accounts that make the same " +
      "predictions. These five make different ones, so there is something " +
      "better available: find the observation they disagree about." },
    inside: { state: "incorrect", text:
      "This is a preference rather than a criterion, and a widely shared one. " +
      "An explanation in terms of the situation is neither better nor worse " +
      "than one in terms of the person; what matters is whether it commits " +
      "itself to something you could go and check." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "predicts") {
      wb.choices.mark(options.querySelector('[data-choice="predicts"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardJury);
    render();
    wb.scrollTo(cardJury);
    wb.announce("The jury room is open. Three pieces of evidence can be requested.");
  }

  /* ------------------------------------------------------------- requests */

  function request(id) {
    if (requested.indexOf(id) >= 0) { return; }
    requested.push(id);
    render();
    var evidence = byId(id);
    var out = survivors(requested);
    wb.announce(evidence.name + " requested. " + out.length + " of " +
      EXPLANATIONS.length + " explanations still standing.");
    if (requested.length >= 2) { explainBtn.disabled = false; }
  }

  function requestAll() {
    AVAILABLE.forEach(function (e) {
      if (requested.indexOf(e.id) < 0) { requested.push(e.id); }
    });
    explainBtn.disabled = false;
    render();
    var out = survivors(requested);
    var riskiest = out.slice().sort(function (a, b) {
      return tally(b, requested).committed - tally(a, requested).committed;
    })[0];
    var safest = out.slice().sort(function (a, b) {
      return tally(a, requested).committed - tally(b, requested).committed;
    })[0];
    noteText.textContent =
      "All three requested. " + (EXPLANATIONS.length - out.length) +
      " of the five are ruled out, which is the evidence doing its work: an " +
      "account that commits itself can be shown to be wrong. " + out.length +
      " are still standing, and they are not standing on the same ground. " +
      "\"" + riskiest.name + "\" committed itself on " +
      tally(riskiest, requested).committed + " of the three and was right " +
      "each time. \"" + safest.name + "\" committed itself on " +
      tally(safest, requested).committed + " of the three, so there was " +
      "almost nothing that could have gone against it. Both are still " +
      "standing. Only one of them earned it. The fourth row of evidence is " +
      "the one that would separate the survivors, and it does not exist yet.";
    wb.show(note);
    wb.announce("All three pieces requested. " + out.length + " explanations still standing.");
  }

  /* --------------------------------------------------------------- render */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function renderButtons() {
    buttonBox.textContent = "";
    AVAILABLE.forEach(function (evidence) {
      var done = requested.indexOf(evidence.id) >= 0;
      var button = el("button", "btn " + (done ? "btn-secondary" : "btn-primary"),
        done ? "Requested: " + evidence.name : evidence.question);
      button.type = "button";
      if (done) {
        button.setAttribute("aria-disabled", "true");
      } else {
        button.addEventListener("click", function () { request(evidence.id); });
      }
      buttonBox.appendChild(button);
    });
  }

  function renderFindings() {
    findingsBox.textContent = "";
    requested.forEach(function (id) {
      var evidence = byId(id);
      var box = el("div", "notice");
      box.setAttribute("data-state", "chosen");
      box.appendChild(el("p", null, evidence.name + ". " + evidence.finding));
      findingsBox.appendChild(box);
    });

    /* The unavailable piece is shown from the start, not held back: the fact
       that the deciding observation is missing is the lesson, and hiding it
       until the end would make it feel like a twist rather than a condition. */
    var missing = EVIDENCE.filter(function (e) { return e.unavailable; })[0];
    var box = el("div", "notice notice--caution");
    box.appendChild(el("p", null,
      missing.name + ". " + missing.question + " " + missing.finding +
      " This is the observation that would separate the accounts that survive, " +
      "and it is the one you cannot have."));
    findingsBox.appendChild(box);
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function renderReadout() {
    var out = survivors(requested);
    var gone = EXPLANATIONS.length - out.length;
    readout.textContent = "";
    readout.appendChild(tile("Still standing", String(out.length),
      requested.length === 0 ? "nothing has been asked yet, so nothing can have fallen"
        : "compatible with everything you have asked for"));
    readout.appendChild(tile("Ruled out", String(gone),
      gone === 0 ? "no account has yet predicted something that turned out false"
        : "each predicted something that turned out to be false",
      gone > 0 ? "correct" : null));

    var least = null;
    out.forEach(function (e) {
      var c = tally(e, requested).committed;
      if (least === null || c < tally(least, requested).committed) { least = e; }
    });
    readout.appendChild(tile("Least at risk among them",
      least ? tally(least, requested).committed + " of " + requested.length : "n/a",
      least ? "\"" + least.name + "\" committed itself on this many"
        : "request some evidence first"));
  }

  var LABELS = {
    "still standing": "still standing",
    "ruled out": "ruled out"
  };

  function renderTable() {
    standingBody.textContent = "";
    EXPLANATIONS.forEach(function (explanation) {
      var t = tally(explanation, requested);
      var place = standing(explanation, requested);
      var tr = global.document.createElement("tr");
      [
        explanation.name + ". " + explanation.note,
        LABELS[place] + (place === "ruled out"
          ? ", it predicted the opposite of what was found"
          : (t.committed === 0 && requested.length > 0
            ? ", but it has said nothing that could have been wrong"
            : "")),
        requested.length === 0 ? "nothing requested yet"
          : t.committed + " of " + requested.length,
        requested.length === 0 ? "nothing requested yet" : String(t.supported)
      ].forEach(function (text, col) {
        var cell = global.document.createElement(col === 0 ? "th" : "td");
        if (col === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        tr.appendChild(cell);
      });
      tr.setAttribute("data-state", place === "ruled out" ? "incorrect" : "chosen");
      standingBody.appendChild(tr);
    });

    standingCaption.textContent = requested.length === 0
      ? "Where each explanation stands. Nothing has been requested yet, so " +
        "every one of them fits and none of them has been tested."
      : "Where each explanation stands after " + requested.length +
        (requested.length === 1 ? " piece" : " pieces") + " of evidence. The " +
        "third column is the one to read: an account that committed itself on " +
        "nothing cannot have been contradicted by anything.";
  }

  function renderSentence() {
    if (requested.length === 0) {
      sentence.textContent = "Every one of the five accounts fits what Priya " +
        "did. That is how they were written, and it is why fitting is not " +
        "worth much on its own.";
      return;
    }
    var out = survivors(requested);
    var names = out.map(function (e) { return "\"" + e.name + "\""; });
    sentence.textContent =
      (out.length === 1 ? "One account is" : String(out.length) + " accounts are") +
      " still standing: " + names.join("; ") + ". " +
      (requested.length < AVAILABLE.length
        ? "There " + (AVAILABLE.length - requested.length === 1 ? "is one piece" :
          "are " + (AVAILABLE.length - requested.length) + " pieces") +
          " of evidence you have not asked for."
        : "There is no further evidence available.");
  }

  function render() {
    renderButtons();
    renderFindings();
    renderReadout();
    renderTable();
    renderSentence();
  }

  function explain() {
    var out = survivors(requested);
    var riskiest = out.slice().sort(function (a, b) {
      return tally(b, requested).committed - tally(a, requested).committed;
    })[0];
    resultLead.textContent =
      "After " + requested.length + (requested.length === 1 ? " piece" : " pieces") +
      " of evidence, " + out.length + " of the five accounts are still " +
      "standing and " + (EXPLANATIONS.length - out.length) + " are ruled out. " +
      (riskiest
        ? "The one that staked the most on the evidence and survived is \"" +
          riskiest.name + "\", which committed itself on " +
          tally(riskiest, requested).committed + " of the " + requested.length +
          " and was right every time."
        : "");
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
    cardJury = wb.root.querySelector("#card-jury");
    buttonBox = wb.root.querySelector("#evidence-buttons");
    findingsBox = wb.root.querySelector("#findings");
    readout = wb.root.querySelector("#readout");
    standingBody = wb.root.querySelector("#standing-body");
    standingCaption = wb.root.querySelector("#standing-caption");
    sentence = wb.root.querySelector("#sentence");
    allBtn = wb.root.querySelector("#all");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    allBtn.addEventListener("click", requestAll);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      requested = [];
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardJury);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
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
