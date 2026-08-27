/**
 * Nine Things She Said  (Simplified Edition)
 *
 * Teaching job: each framework for the self asks a different question, and
 * what it makes central is inseparable from what it has no concept for.
 *
 * The mechanism from the full Self Through Different Lenses is preserved: nine
 * fixed statements, and a framework switch that re-codes every one of them as
 * central, usable, or something the framework has no concept for.
 *
 * WHAT THIS ACTIVITY OUTPUTS, AND WHY IT IS NOT THE POWER LENS ACTIVITY. The
 * paired activity on power asks which item is the strongest evidence for each
 * lens and ends with three remedies. This one asks nothing of the sort. Its
 * output is coverage: how many of the nine each framework claims, how many it
 * cannot see at all, and, across all five, which statements are central to
 * somebody and which to nobody. The reveal is a coverage table rather than a
 * ranking.
 *
 * THE STRUCTURAL POINT, which is arranged rather than incidental and is
 * verified in the test suite:
 *
 *   - every framework treats exactly two of the nine as central, so none is
 *     presented as covering more ground than another;
 *   - every framework has no concept at all for at least two;
 *   - eight of the nine statements are central to at least one framework;
 *   - statement 8, where the fees went up and the hours were cut, is central
 *     to NONE of them, and exactly one framework can reach it at all, by
 *     turning it into a belief about her own future.
 *
 * FIVE FRAMEWORKS, NOT SEVEN. Possible selves and self-efficacy are cut. That
 * choice matters for the structural point: possible selves is one of the two
 * frameworks in the original that codes statement 8 as usable, and keeping
 * both would have blunted the claim. One is kept, so the September statement
 * is reachable rather than untouchable, which is the more honest version.
 *
 * A NOTE ON THE ORIGINAL. Its header comment states that statement 8 is coded
 * `none` by six of the seven frameworks and `usable` by the seventh. Its own
 * data has two frameworks coding it `usable`. The original's data is not
 * changed by anything here; the discrepancy is in its comment.
 *
 * WHAT THIS IS NOT. Not an assessment: nothing is asked about the reader and
 * no score is produced for anybody. Not a map of the literature. And
 * backgrounding is never denial: the claim is about what a framework's
 * concepts can represent, not about what its users believe.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var STATEMENTS = [
    { id: 1, text: "I've always been the practical one at home. It's just what I am." },
    { id: 2, text: "Everyone on the course seems to find the maths obvious. I'm the slowest in the room." },
    { id: 3, text: "I should be further on than this by now." },
    { id: 4, text: "If it works out I'll be designing bridges. If it doesn't I'll be exactly where I am, and that frightens me." },
    { id: 5, text: "I can fix anything mechanical. Put a spreadsheet in front of me and I freeze." },
    { id: 6, text: "At the shop I'm one of the regulars. On the course I'm the one who came from a trade." },
    { id: 7, text: "I'm different with my sister than with anyone else. Calmer. I don't know which one is the real me." },
    { id: 8, text: "The fees went up in September and my hours got cut the same month." },
    { id: 9, text: "My tutor said people from my background often struggle with the theory." }
  ];

  /* c = central, u = usable, n = no concept for it. Authored judgements. */
  var LENSES = [
    {
      id: "schema", name: "Self-schema",
      question: "How is her self-knowledge organised, and in which domains is it well developed?",
      central: "What she takes herself to be like, and where that is settled",
      backgrounds: "Everything that is about other people or about circumstances",
      coding: { 1: "c", 2: "n", 3: "u", 4: "u", 5: "c", 6: "u", 7: "u", 8: "n", 9: "u" },
      account: "Nadia has a well-developed and long-standing schema for practical competence, organised around mechanical work, and no comparable structure for formal or numerical work, which is why the spreadsheet produces not difficulty but a kind of blankness. Information that fits the practical schema is processed quickly and remembered; information about the theory has nowhere to attach.",
      note: "Precise about two of the nine and silent about several others. Nothing in the framework represents who else is in the room."
    },
    {
      id: "comparison", name: "Social comparison",
      question: "Against whom is she comparing herself, and in which direction?",
      central: "Her standing relative to a chosen set of other people",
      backgrounds: "Anything about her that does not involve a comparison target",
      coding: { 1: "n", 2: "c", 3: "u", 4: "n", 5: "u", 6: "c", 7: "n", 8: "n", 9: "u" },
      account: "Nadia is making upward comparisons on a dimension she has recently started to care about, against a group she has just joined and did not choose. In the shop she is a comparison target for other people; on the course she is at the bottom of a distribution whose top she can see. The comparison set changed in September and her judgement of herself changed with it.",
      note: "Requires other people to be specified before anything can be said, which is a real strength. It has no way of representing why this particular comparison set became the relevant one."
    },
    {
      id: "discrepancy", name: "Self-discrepancy",
      question: "What is the gap between who she is, who she wants to be and who she thinks she ought to be?",
      central: "The distance between an actual self and a standard",
      backgrounds: "Where the standard came from, and who set it",
      coding: { 1: "u", 2: "u", 3: "c", 4: "c", 5: "u", 6: "n", 7: "n", 8: "n", 9: "n" },
      account: "There is a live discrepancy between Nadia's actual self and an ought self, further on by now, and a second between her actual self and an ideal she can describe in some detail. The framework predicts that the two gaps will not feel the same: the ought discrepancy should produce agitation, the ideal discrepancy something closer to flatness.",
      note: "Sharp about the structure of a gap. Completely silent about where the standard came from, which is arguably the more interesting question."
    },
    {
      id: "identity", name: "Social identity",
      question: "Which groups is she placing herself in, and which is she being placed in?",
      central: "Group memberships and their relative standing",
      backgrounds: "Anything about her that is not shared with a group",
      coding: { 1: "u", 2: "u", 3: "n", 4: "n", 5: "n", 6: "c", 7: "u", 8: "n", 9: "c" },
      account: "Nadia moves between two settings in which entirely different group memberships are salient, and in one of them her category is assigned rather than chosen: the one who came from a trade is not a self-description. The tutor's remark makes that category relevant to performance, which is a change in the situation rather than in Nadia, and her sense of herself should shift with whichever membership is salient.",
      note: "The framework here that comes closest to putting something outside her into the account, and it does so by representing it as a perceived group membership rather than as a course fee."
    },
    {
      id: "relational", name: "Relational and contextual",
      question: "Who is she with, and is there a self that is not with anybody?",
      central: "Variation across relationships, and what that variation means",
      backgrounds: "Any single summary of what she is like",
      coding: { 1: "u", 2: "u", 3: "n", 4: "n", 5: "u", 6: "c", 7: "c", 8: "u", 9: "u" },
      account: "The question Nadia is asking, which one is the real me, is on this account the wrong question rather than an unanswered one. She is not one self appearing in different lighting; she is differently constituted with her sister, at the shop and on the course. What varies is not a mask but the relation.",
      note: "The only framework here that disagrees about what a self is rather than about which part of it to study. It buys that at the cost of being hard to measure and harder to fund."
    }
  ];

  var LABELS = {
    c: "central to it",
    u: "usable, indirectly",
    n: "no concept for it"
  };

  var STATES = { c: "correct", u: "partial", n: "incorrect" };

  function lensById(id) {
    var found = null;
    LENSES.forEach(function (l) { if (l.id === id) { found = l; } });
    return found;
  }

  function countFor(lens, code) {
    var n = 0;
    STATEMENTS.forEach(function (s) { if (lens.coding[s.id] === code) { n += 1; } });
    return n;
  }

  /** How many of the five frameworks give this statement this coding. */
  function acrossLenses(statementId, code) {
    return LENSES.filter(function (l) { return l.coding[statementId] === code; }).length;
  }

  /* The statements no framework here treats as its own business, computed
     rather than written down. */
  var ORPHANS = STATEMENTS.filter(function (s) {
    return acrossLenses(s.id, "c") === 0;
  });

  /* ------------------------------------------------------------------ dom */

  var statementList, options, verdict, verdictText, revealBtn, cardLens;
  var lensBox, questionBox, questionText, readout, codingBody, codingCaption;
  var accountBox, sentence, allBtn, cardSummary, summaryHead, summaryBody;
  var summarySentence, explainBtn, synthesis, resultLead;

  var answered = false;
  var chosen = null;
  var visited = [];

  var VERDICTS = {
    concepts: { state: "correct", text:
      "Yes, and it is the more interesting half of what a framework is. Each " +
      "of the five below treats exactly two of the nine statements as its own " +
      "business and has no concept at all for at least two others. Watch " +
      "which two each one drops." },
    correct: { state: "incorrect", text:
      "There is no correct framework here and no hidden fact about Nadia to " +
      "find. They are not competing answers to one question; they are five " +
      "different questions, and a question can only be answered with evidence " +
      "that counts as evidence for it." },
    detail: { state: "incorrect", text:
      "They do not cover the same ground at different resolutions. Each one " +
      "has statements it can say nothing whatever about, and they are not the " +
      "same statements, so the differences are about extent rather than depth." },
    little: { state: "partial", text:
      "Two of the five below really are close to being different vocabularies " +
      "for related questions, so this is not simply wrong. One of them " +
      "disagrees about what a self is rather than about which part to study, " +
      "and you will find it changes what counts as a question rather than what " +
      "counts as an answer." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "concepts") {
      wb.choices.mark(options.querySelector('[data-choice="concepts"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardLens);
    render();
    wb.scrollTo(cardLens);
    wb.announce("Five frameworks. Choose one.");
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

  function buildStatements() {
    statementList.textContent = "";
    STATEMENTS.forEach(function (s) {
      statementList.appendChild(el("li", null, s.text));
    });
  }

  function buildLenses() {
    LENSES.forEach(function (lens) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "lens");
      input.setAttribute("value", lens.id);
      input.value = lens.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, lens.name));
      wrap.appendChild(el("span", null, lens.question));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { choose(lens.id); });
      lensBox.appendChild(label);
    });
  }

  function choose(id) {
    chosen = id;
    if (visited.indexOf(id) < 0) { visited.push(id); }
    render();
    var lens = lensById(id);
    wb.announce(lens.name + ". Central to " + countFor(lens, "c") +
      " of the nine, no concept for " + countFor(lens, "n") + ".");
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function render() {
    Array.prototype.forEach.call(lensBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === chosen;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });

    if (!chosen) {
      wb.hide(questionBox);
      readout.textContent = "";
      codingBody.textContent = "";
      accountBox.textContent = "";
      codingCaption.textContent = "Choose a framework above and this fills in.";
      sentence.textContent = "Nothing has been chosen yet. The nine statements " +
        "above are the same nine whichever framework you pick.";
      allBtn.disabled = visited.length < LENSES.length;
      return;
    }

    var lens = lensById(chosen);

    questionText.textContent = "This framework asks: " + lens.question;
    wb.show(questionBox);

    readout.textContent = "";
    readout.appendChild(tile("Central to it", countFor(lens, "c") + " of 9",
      lens.central.toLowerCase()));
    readout.appendChild(tile("Usable, indirectly", countFor(lens, "u") + " of 9",
      "it can do something with these"));
    readout.appendChild(tile("No concept for", countFor(lens, "n") + " of 9",
      lens.backgrounds.toLowerCase(), "incorrect"));

    codingBody.textContent = "";
    STATEMENTS.forEach(function (s) {
      var code = lens.coding[s.id];
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", s.id + ". " + s.text, "row"));
      tr.appendChild(cell("td", LABELS[code]));
      tr.setAttribute("data-state", STATES[code]);
      codingBody.appendChild(tr);
    });
    codingCaption.textContent =
      "The nine statements under " + lens.name + ". They are in the same order " +
      "as above and none of them has changed.";

    accountBox.textContent = "";
    var box = el("div", "block");
    box.appendChild(el("p", "step-label", "What " + lens.name + " says about Nadia"));
    box.appendChild(el("p", "small", lens.account));
    box.appendChild(el("p", "small", lens.note));
    accountBox.appendChild(box);

    var claimed = [];
    STATEMENTS.forEach(function (s) {
      if (visited.some(function (id) { return lensById(id).coding[s.id] === "c"; })) {
        claimed.push(s.id);
      }
    });
    sentence.textContent =
      "Frameworks tried so far: " + visited.length + " of " + LENSES.length +
      ". Between them they have claimed " + claimed.length + " of the nine " +
      "statements as central to something" +
      (visited.length < LENSES.length
        ? ". Keep going and see which are left."
        : ". The rest are the ones no framework here treats as its own business.");

    allBtn.disabled = visited.length < LENSES.length;
  }

  function showAll() {
    wb.show(cardSummary);

    summaryHead.textContent = "";
    summaryHead.appendChild(cell("th", "Statement", "col"));
    LENSES.forEach(function (l) { summaryHead.appendChild(cell("th", l.name, "col")); });
    summaryHead.appendChild(cell("th", "Central to any of them?", "col"));

    summaryBody.textContent = "";
    STATEMENTS.forEach(function (s) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", s.id + ". " + s.text, "row"));
      LENSES.forEach(function (l) { tr.appendChild(cell("td", LABELS[l.coding[s.id]])); });
      var claimed = acrossLenses(s.id, "c");
      tr.appendChild(cell("td", claimed
        ? "yes, to " + claimed + (claimed === 1 ? " of them" : " of them")
        : "no, to none of them"));
      tr.setAttribute("data-state", claimed ? "chosen" : "incorrect");
      summaryBody.appendChild(tr);
    });

    var names = ORPHANS.map(function (s) { return "statement " + s.id; }).join(" and ");
    var reachable = ORPHANS.map(function (s) {
      return LENSES.filter(function (l) { return l.coding[s.id] === "u"; });
    })[0] || [];
    summarySentence.textContent =
      (ORPHANS.length === 1
        ? "One statement, " + names + ", is central to none of the five."
        : ORPHANS.length + " statements are central to none of the five.") +
      " " + (reachable.length
        ? reachable.length + " of the five " +
          (reachable.length === 1 ? "framework can" : "frameworks can") +
          " reach it at all, and only indirectly: " +
          reachable.map(function (l) { return l.name.toLowerCase(); }).join(" and ") +
          "."
        : "No framework here can reach it at all.");
    wb.scrollTo(cardSummary);
    wb.announce("All five frameworks shown together.");
  }

  function explain() {
    resultLead.textContent =
      "Each of the five frameworks treats " + countFor(LENSES[0], "c") +
      " of the nine statements as central and has no concept at all for " +
      "between " + Math.min.apply(null, LENSES.map(function (l) { return countFor(l, "n"); })) +
      " and " + Math.max.apply(null, LENSES.map(function (l) { return countFor(l, "n"); })) +
      " others. Across all five, " +
      (STATEMENTS.length - ORPHANS.length) + " of the nine statements are " +
      "central to at least one of them, and " + ORPHANS.length + " is central " +
      "to none.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    statementList = wb.root.querySelector("#statements");
    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardLens = wb.root.querySelector("#card-lens");
    lensBox = wb.root.querySelector("#lenses");
    questionBox = wb.root.querySelector("#question-box");
    questionText = wb.root.querySelector("#question-text");
    readout = wb.root.querySelector("#readout");
    codingBody = wb.root.querySelector("#coding-body");
    codingCaption = wb.root.querySelector("#coding-caption");
    accountBox = wb.root.querySelector("#account");
    sentence = wb.root.querySelector("#sentence");
    allBtn = wb.root.querySelector("#all");
    cardSummary = wb.root.querySelector("#card-summary");
    summaryHead = wb.root.querySelector("#summary-head");
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

    buildStatements();
    buildLenses();

    wb.onReset(function () {
      answered = false;
      chosen = null;
      visited = [];
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLens);
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
