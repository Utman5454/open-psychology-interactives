/**
 * Where the File Stops  (Simplified Edition)
 *
 * Teaching job: a real difference between people does not establish that the
 * cause lies inside them, and it establishes even less about where the remedy
 * should be aimed.
 *
 * The mechanism from the full Person or Setting laboratory is preserved: two
 * rounds of evidence, a commitment after each, and both commitments kept.
 *
 * THE DESIGN OF ROUND 1 IS THE WHOLE TRAP, and it is not a trap about the
 * learner's reasoning. Every item in round 1 is a measurement of individuals,
 * so an individual-level explanation is the best-supported reading of it, and
 * the feedback says so in as many words rather than marking it wrong. What
 * round 1 contains no way of noticing is that only one level was measured.
 * Answering "several at once" is treated as equally good, because refusing to
 * choose from a single-level file is an accurate report of what it supports.
 * The two other answers are marked as being ahead of the evidence in a useful
 * direction: right, possibly, for reasons that are not in the file.
 *
 * ROUND 2 adds relational and structural items, including the comparison team.
 * That comparison is the strongest-looking item and the page says it is also
 * the weakest: Team A was matched at recruitment and is not matched now, since
 * three people have left Team B and whoever remains is whoever remains.
 *
 * STEP 3 IS WHERE THE THEORY DOES SOMETHING. Each explanation names an
 * intervention, who would have to act, and what it would leave running. That
 * last column is the point: no remedy here is absurd and none is sufficient,
 * and knowing what a remedy leaves running is the professional judgement.
 *
 * WHAT WAS CUT. A third round of evidence, the tracking of how an explanation
 * moves across three rounds, and the closing report-writing exercise.
 *
 * WHAT THIS IS NOT. Not an argument that individual support is a con: two
 * people have a documented training gap that no rota change will close. Not an
 * argument that structural explanation wins by default, for the reason above.
 * Every figure was written for teaching.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var ROUND_ONE = [
    "Across all fourteen team members, a validated exhaustion scale correlates 0.61 with supervisor performance ratings. The three highest scorers are the three who resigned.",
    "Two staff have documented gaps in the system training that everybody else completed. Both are among the lower-rated.",
    "In exit interviews, two of the three leavers described themselves as not cut out for it.",
    "One team member has consistently high ratings and a low exhaustion score, and has been in post four years."
  ];

  var ROUND_TWO = [
    "Team B's supervisor gives feedback only through the monthly rating. There is no other regular conversation about the work.",
    "New staff are told informally that you do not escalate unless you really have to. Escalating is read as not coping.",
    "Team B works split shifts and Team A does not. The rota was produced by a scheduling system optimised for coverage, and no manager chose it.",
    "Team B's queue carries all bereavement and complaint calls for the region. There is no scheduled recovery time after an escalated call.",
    "The team target is calls per hour. Staff cannot close a case themselves; every resolution needs a supervisor sign-off, which averages nineteen minutes.",
    "Team A, matched with Team B on staff characteristics at recruitment and doing nominally the same job, has a mean exhaustion score less than half Team B's."
  ];

  var EXPLANATIONS = [
    { key: "individual", short: "The people",
      label: "Mainly the people, their coping resources, skills and fit for the work" },
    { key: "relational", short: "The team",
      label: "Mainly the team, its norms about asking for help, and its supervision" },
    { key: "structural", short: "The work",
      label: "Mainly the work, the rota, the queue, the target and the sign-off" },
    { key: "several", short: "Several at once",
      label: "Several at once, and I cannot yet say which dominates" }
  ];

  var ROUND_ONE_FEEDBACK = {
    individual: { state: "correct", title: "The best-supported reading of what you have",
      body: "Everything in the first round is a measurement of individuals, so an individual-level explanation is what it supports. Notice what has happened, though. You have described a pattern and called it a cause, and nothing in these four items compares this team with anything at all." },
    several: { state: "correct", title: "The most honest answer available",
      body: "Four measurements of individuals cannot separate levels, because only one level has been measured. Refusing to choose here is not indecision; it is an accurate report of what a single-level file supports." },
    relational: { state: "partial", title: "Ahead of the evidence, in a useful direction",
      body: "There is nothing in the first round about how this team relates: no observation of supervision, norms or support. You may well be right, and you are currently right for reasons that are not in the file." },
    structural: { state: "partial", title: "Ahead of the evidence, in a useful direction",
      body: "The first round contains no information about the work at all: no rota, no queue, no target, no comparison. Holding a structural hypothesis before the evidence arrives is reasonable, and it is a prior rather than a finding." }
  };

  var ROUND_TWO_FEEDBACK = {
    individual: { state: "partial", title: "Still available, and now one reading among three",
      body: "Nothing in the first round has been withdrawn and the training gaps are still there. What has changed is that there is now a comparison, and a team matched with this one at recruitment has less than half its exhaustion on nominally the same work with a different rota. An individual explanation now has to say why the difference between the two teams is also about individuals." },
    relational: { state: "correct", title: "Supported by the second round",
      body: "Feedback only through a monthly rating, and a norm that reads escalating as not coping, are both in the file now. This is a well-supported reading, and it shares the file with a structural one that would produce much the same symptoms." },
    structural: { state: "correct", title: "Supported by the second round",
      body: "The rota, the queue, the target and the sign-off are all in the file now, and so is a comparison team. This is a well-supported reading. Its strongest item is also its weakest: Team A was matched at recruitment and is not matched now." },
    several: { state: "correct", title: "Defensible, and now for a different reason",
      body: "In the first round this was honest about a file with one level in it. Now three levels have been measured and they point in overlapping directions, so declining to rank them is a judgement about the evidence rather than a report of its absence." }
  };

  var REMEDIES = [
    { key: "individual", explanation: "The people",
      change: "Resilience training, a coaching offer, and completing the two documented training gaps",
      who: "The team members, mostly in their own time",
      leaves: "The rota, the queue, the target, the sign-off and the norm about escalating. It also arrives as a message that the difficulty was theirs." },
    { key: "relational", explanation: "The team",
      change: "Regular supervision that is not the monthly rating, and making escalation an ordinary thing to do",
      who: "The supervisor, and whoever sets what a supervisor is measured on",
      leaves: "The split shifts, the queue composition and the nineteen-minute sign-off, all of which will keep generating the thing supervision is now discussing." },
    { key: "structural", explanation: "The work",
      change: "Rebalancing the queue, scheduled recovery after escalated calls, and letting staff close a case",
      who: "Whoever owns the scheduling system and the target, which is nobody in this building",
      leaves: "The two documented training gaps and a person who is exhausted this week, neither of which a rota change reaches." }
  ];

  function explanationByKey(key) {
    var found = null;
    EXPLANATIONS.forEach(function (e) { if (e.key === key) { found = e; } });
    return found;
  }

  /* Option order is rotated between the two rounds so that no answer sits in
     the same position twice and a learner cannot repeat a click by habit. */
  function optionsFor(round) {
    var out = [];
    for (var i = 0; i < EXPLANATIONS.length; i += 1) {
      out.push(EXPLANATIONS[(i + round) % EXPLANATIONS.length]);
    }
    return out;
  }

  /* ------------------------------------------------------------------ dom */

  var round1List, answer1Box, feedback1, feedback1Title, feedback1Text, toRound2Btn;
  var cardRound2, round2List, answer2Box, feedback2, feedback2Title, feedback2Text;
  var readout, toRemedyBtn, cardRemedy, remediesBody, remedySentence;
  var explainBtn, synthesis, resultLead;

  var first = null;
  var second = null;

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

  function fillList(list, items) {
    list.textContent = "";
    items.forEach(function (t) { list.appendChild(el("li", null, t)); });
  }

  function buildAnswers(box, round, onPick) {
    box.textContent = "";
    optionsFor(round).forEach(function (option) {
      var button = el("button", "option");
      button.type = "button";
      button.setAttribute("data-choice", option.key);
      button.appendChild(el("strong", null, option.label));
      button.appendChild(el("span", null, ""));
      button.addEventListener("click", function () { onPick(option.key); });
      box.appendChild(button);
    });
  }

  function lock(box, chosenKey, feedbackMap) {
    Array.prototype.forEach.call(box.querySelectorAll("[data-choice]"), function (button) {
      var key = button.getAttribute("data-choice");
      button.setAttribute("aria-disabled", "true");
      if (key === chosenKey) {
        button.setAttribute("data-state", feedbackMap[key].state);
        button.querySelectorAll("span")[0].textContent = "Your answer.";
      }
    });
  }

  function pickFirst(key) {
    if (first) { return; }
    first = key;
    var f = ROUND_ONE_FEEDBACK[key];
    lock(answer1Box, key, ROUND_ONE_FEEDBACK);
    feedback1.setAttribute("data-state", f.state);
    feedback1Title.querySelector("strong").textContent = f.title;
    feedback1Text.textContent = f.body;
    wb.show(feedback1);
    toRound2Btn.disabled = false;
    /* Show the first commitment straight away. Rendering it only once the
       second arrives left the panel empty through the whole of round two,
       which is exactly when the learner wants to see what they said before. */
    renderReadout();
    wb.announce("Recorded. " + f.title + ".");
  }

  function pickSecond(key) {
    if (second) { return; }
    second = key;
    var f = ROUND_TWO_FEEDBACK[key];
    lock(answer2Box, key, ROUND_TWO_FEEDBACK);
    feedback2.setAttribute("data-state", f.state);
    feedback2Title.querySelector("strong").textContent = f.title;
    feedback2Text.textContent = f.body;
    wb.show(feedback2);
    toRemedyBtn.disabled = false;
    renderReadout();
    wb.announce("Recorded. " + f.title + ".");
  }

  function toRound2() {
    wb.show(cardRound2);
    wb.scrollTo(cardRound2);
    wb.announce("The second round of evidence. Nothing from the first has been withdrawn.");
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
    readout.textContent = "";
    if (!first) { return; }
    readout.appendChild(tile("After the first round",
      explanationByKey(first).short, "on four measurements of individuals"));
    readout.appendChild(tile("After the second",
      second ? explanationByKey(second).short : "not yet",
      second
        ? (second === first
          ? "you did not change your mind, and the file did"
          : "the evidence changed, and so did the answer")
        : "answer above"));
  }

  function toRemedy() {
    wb.show(cardRemedy);
    remediesBody.textContent = "";
    REMEDIES.forEach(function (remedy) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", remedy.explanation, "row"));
      tr.appendChild(cell("td", remedy.change));
      tr.appendChild(cell("td", remedy.who));
      tr.appendChild(cell("td", remedy.leaves));
      if (second === remedy.key) { tr.setAttribute("data-state", "chosen"); }
      remediesBody.appendChild(tr);
    });

    var mine = REMEDIES.filter(function (r) { return r.key === second; })[0];
    remedySentence.textContent = mine
      ? "The explanation you settled on would " +
        mine.change.charAt(0).toLowerCase() + mine.change.slice(1) +
        ". It would leave running: " +
        mine.leaves.charAt(0).toLowerCase() + mine.leaves.slice(1) +
        " Every row of this table has a last column, and none of them is empty."
      : "You settled on more than one level at once, which is the only answer " +
        "for which the last column is short. It is also the answer that is " +
        "hardest to put in a report, because it asks three different people to " +
        "act and none of them alone can be held to it.";
    wb.scrollTo(cardRemedy);
    wb.announce("Three explanations and what each would leave running.");
  }

  function explain() {
    resultLead.textContent =
      "After four measurements of individuals you said " +
      explanationByKey(first).short.toLowerCase() + ". After the rota, the " +
      "queue, the target, the sign-off, the supervision and a comparison team " +
      "you said " + explanationByKey(second).short.toLowerCase() + ". " +
      (first === second
        ? "You did not change your mind, and the evidence you were reasoning " +
          "from changed completely."
        : "Nothing from the first round was withdrawn to make that happen.");
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    round1List = wb.root.querySelector("#round1");
    answer1Box = wb.root.querySelector("#answer1");
    feedback1 = wb.root.querySelector("#feedback1");
    feedback1Title = wb.root.querySelector("#feedback1-title");
    feedback1Text = wb.root.querySelector("#feedback1-text");
    toRound2Btn = wb.root.querySelector("#toRound2");
    cardRound2 = wb.root.querySelector("#card-round2");
    round2List = wb.root.querySelector("#round2");
    answer2Box = wb.root.querySelector("#answer2");
    feedback2 = wb.root.querySelector("#feedback2");
    feedback2Title = wb.root.querySelector("#feedback2-title");
    feedback2Text = wb.root.querySelector("#feedback2-text");
    readout = wb.root.querySelector("#readout");
    toRemedyBtn = wb.root.querySelector("#toRemedy");
    cardRemedy = wb.root.querySelector("#card-remedy");
    remediesBody = wb.root.querySelector("#remedies-body");
    remedySentence = wb.root.querySelector("#remedy-sentence");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    fillList(round1List, ROUND_ONE);
    fillList(round2List, ROUND_TWO);
    buildAnswers(answer1Box, 0, pickFirst);
    buildAnswers(answer2Box, 1, pickSecond);

    toRound2Btn.addEventListener("click", toRound2);
    toRemedyBtn.addEventListener("click", toRemedy);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      first = null;
      second = null;
      buildAnswers(answer1Box, 0, pickFirst);
      buildAnswers(answer2Box, 1, pickSecond);
      wb.hide(feedback1);
      wb.hide(feedback2);
      wb.hide(cardRound2);
      wb.hide(cardRemedy);
      wb.hide(synthesis);
      toRound2Btn.disabled = true;
      toRemedyBtn.disabled = true;
      readout.textContent = "";
    });
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
