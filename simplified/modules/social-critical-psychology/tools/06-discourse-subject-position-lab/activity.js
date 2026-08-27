/**
 * Five Ways to Write It Up  (Simplified Edition)
 *
 * Teaching job: an account produces a subject position, that position makes
 * some next steps obvious and others unavailable, and it entitles somebody in
 * particular to say what is really happening.
 *
 * Two design decisions from the full Discourse and Subject Position Laboratory
 * carry the critical content and both are preserved exactly:
 *
 *   THE LEDGER STAYS ON SCREEN. Discourse analysis here is not a claim that
 *   the events are made of language, and a fixed, undisputed ledger that every
 *   account is compatible with is the guard against that reading.
 *
 *   THE HALVING OF THE HOURS APPEARS IN ONE ACCOUNT OF FIVE. It happened in
 *   April, before anything R did, and an account written about a person has
 *   nowhere to put a decision that was not hers. What a discourse cannot say
 *   about anything other than the person is usually more consequential than
 *   what it says about the person.
 *
 * WHAT WAS CUT. The original asks four questions of every account, twenty
 * judgements in all. This asks one, the authority question, because it is the
 * sharpest of the four and because the other three are more useful read
 * together in the comparison than answered one at a time. The full four-way
 * analysis of the opened account is then shown rather than tested.
 *
 * DISTRACTORS ARE NEVER STRAW MEN. Each of the five authority options is the
 * correct answer for exactly one account, so a wrong answer is a right answer
 * about a different account and the feedback says which.
 *
 * WHAT THIS IS NOT. Not word-counting: no result depends on word frequency.
 * Not a ranking: the case note and the risk register exist for reasons, and
 * the recovery vocabulary was fought for by service users against exactly the
 * case-note position, which is why it is the sharpest case rather than the
 * silliest. The advocacy bulletin is not neutral either. R and the service are
 * invented and no real person, record or organisation is described.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var LEDGER = [
    "R, 34, attended a community day programme three mornings a week for two years.",
    "In April the service's budget was reduced and the programme's hours were halved. R's group moved from three mornings to one.",
    "In May R was reassessed. The assessment recorded that her needs had reduced.",
    "R told two members of staff that she disagreed with the assessment. She asked for a copy and was given one six weeks later.",
    "From June R attended two of the eight remaining sessions.",
    "In July R wrote to the service manager setting out what she thought the assessment had got wrong.",
    "In August R booked a room in the public library and began running a weekly group for four other people who had used the programme.",
    "In September the service closed R's case, recording that she had disengaged."
  ];

  /* The entry that four of the five accounts have no place for. */
  var HOURS_ENTRY = 2;

  var AUTHORITY_OPTIONS = [
    { key: "practitioner", text: "The practitioner who writes the record" },
    { key: "process", text: "The safeguarding process, and nobody in particular" },
    { key: "r", text: "R, and the people who used the programme with her" },
    { key: "template", text: "The template, which supplies the words before anyone speaks" },
    { key: "commissioner", text: "The commissioner, to whom the figures are addressed" }
  ];

  var ACCOUNTS = [
    {
      id: "casenote", title: "The case note",
      source: "Electronic record, entered by the programme's lead practitioner, September.",
      text: "Engagement has declined markedly over the reporting period. R attended 2 of 8 sessions following reassessment and has expressed dissatisfaction with the outcome to several staff members. Limited insight into the rationale for the revised plan. Has written to management. Now reported to be organising informal activity in the community, unsupervised. Case closed, disengaged.",
      authority: "practitioner",
      position: "A patient whose engagement has declined and whose disagreement is a symptom",
      action: "Close the case",
      responsibility: "R's, by default, because nothing else in the record can hold any",
      mentionsHours: false,
      note: "Notice how much of the ledger survives and how little of it stays the same kind of event. Expressed dissatisfaction and has written to management are both true. Limited insight turns a disagreement into a symptom, and once it is a symptom the letter cannot be answered on its merits without a category error.",
      hidden: "That the hours were halved in April. The record has a field for R's attendance and no field for the programme's."
    },
    {
      id: "risk", title: "The risk register entry",
      source: "Quarterly risk review, safeguarding lead, September.",
      text: "Service user with two-year history of supported attendance now out of contact. Last seen June. Unmonitored group activity in a public setting with four other former attendees. No risk assessment held for this activity and no responsible person identified. Contact attempts unsuccessful. Recommend flag pending review.",
      authority: "process",
      position: "An unmonitored risk with no responsible person attached",
      action: "Flag it pending review",
      responsibility: "Nobody's. It is recorded as a gap in oversight rather than as anyone's doing",
      mentionsHours: false,
      note: "The same library group that the advocacy bulletin calls peer support is here an unassessed setting. Neither description is inaccurate. What differs is that this one is written in a genre whose whole purpose is to notice what has not been signed off, and that genre has no way of recording a thing going well.",
      hidden: "That R is in a library, on a weekday, with four people she knows. The register records the absence of oversight, not the presence of anyone."
    },
    {
      id: "advocacy", title: "The advocacy bulletin",
      source: "Newsletter of a local user-led group, October.",
      text: "After the council halved the hours at the day programme, members were reassessed and several were told their needs had reduced. One member, R, requested her assessment, waited six weeks for it, and wrote to the manager setting out the errors in it. Having had no reply, she has started a weekly peer group at the library, now attended by five people. Her case has since been closed as disengaged.",
      authority: "r",
      position: "A member wronged by a decision, who is acting on it",
      action: "Answer her letter",
      responsibility: "The council's, and the service's for not replying",
      mentionsHours: true,
      note: "The only account of the five that includes the budget decision, and it includes it in the first clause. Notice what that does to the last sentence: closed as disengaged becomes something done to R rather than something she did.",
      hidden: "Whatever the reassessment might have got right. This account is not neutral either, and its confidence that the assessment was in error is asserted rather than shown."
    },
    {
      id: "recovery", title: "The recovery-oriented summary",
      source: "Discharge summary, written to the service's recovery template, September.",
      text: "R has moved into a more independent phase of her recovery journey. She has exercised choice about how she uses her time, taken ownership of her support needs and built her own network in the community, convening a peer group of her own. She has been able to voice her views about her assessment. R now feels ready to manage without formal input and we wish her well.",
      authority: "template",
      position: "Someone progressing, under her own steam, towards independence",
      action: "Discharge her and wish her well",
      responsibility: "Nobody's, because on this account nothing went wrong",
      mentionsHours: false,
      note: "The humane one, and the one that most completely turns a service cut into a personal achievement. Every verb is R's: she has moved, chosen, taken ownership, built. Nothing was done to her, and ready to manage without formal input does the work that case closed does in the case note, with none of the friction.",
      hidden: "That she asked for something and did not get it. In this vocabulary there is no grammatical position for an unanswered request, and a disagreement can only appear as a view that has been voiced."
    },
    {
      id: "market", title: "The commissioning report",
      source: "Provider performance summary to the commissioner, October.",
      text: "Reduced-hours model implemented on schedule and within budget. Reassessment identified reduced need in a proportion of the cohort, consistent with expected step-down. One service user submitted written feedback. Satisfaction data for the quarter remain within tolerance and no service-level exception is reported.",
      authority: "commissioner",
      position: "A unit of expected step-down within a cohort",
      action: "Report delivery on schedule and move on",
      responsibility: "No one's. The model performed as designed",
      mentionsHours: false,
      note: "The hours appear here, and only as a model implemented on schedule, which is not the same entry. R's letter appears as written feedback, counted rather than read, and the account that comes closest to naming the April decision is the one in which it cannot be a cause of anything.",
      hidden: "R, as a person at all. She appears once, as one service user, and the sentence she appears in is about the data being within tolerance."
    }
  ];

  function accountById(id) {
    var found = null;
    ACCOUNTS.forEach(function (a) { if (a.id === id) { found = a; } });
    return found;
  }

  function optionText(key) {
    var found = "";
    AUTHORITY_OPTIONS.forEach(function (o) { if (o.key === key) { found = o.text; } });
    return found;
  }

  function accountFor(authorityKey) {
    var found = null;
    ACCOUNTS.forEach(function (a) { if (a.authority === authorityKey) { found = a; } });
    return found;
  }

  var MENTIONING = ACCOUNTS.filter(function (a) { return a.mentionsHours; });

  /* ------------------------------------------------------------------ dom */

  var ledgerList, options, verdict, verdictText, revealBtn, cardAccounts;
  var accountBox, reading, questionBlock, questionLabel, authorityBox, analysis;
  var sentence, allBtn, cardSummary, summaryBody, summarySentence;
  var explainBtn, synthesis, resultLead;

  var answered = false;
  var open = null;
  var settled = {};

  var VERDICTS = {
    service: { state: "correct", text:
      "Correct, and the reasoning is the useful part. Four of the five " +
      "accounts are written about R, and an account written about a person " +
      "has nowhere to put a decision that was not hers. The entry that " +
      "appears in only one is the halving of the hours in April, which " +
      "happened before anything R did." },
    behaviour: { state: "incorrect", text:
      "R's behaviour is the one thing every account contains. All five " +
      "mention the sessions, the letter or the library group, and they " +
      "disagree about what those things are rather than about whether they " +
      "happened. What drops out is something that was not hers." },
    date: { state: "incorrect", text:
      "The missing entry is not a detail. It is the decision that started the " +
      "six months, it is in the ledger with a month attached, and four of the " +
      "five accounts have no place for it at all." },
    disputed: { state: "partial", text:
      "A reasonable rule of thumb, and it points at the wrong entry here. " +
      "Nothing in the ledger is disputed, and the entry that goes missing is " +
      "one nobody contests. It goes missing because of who it is about rather " +
      "than because anyone disagrees with it." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "service") {
      wb.choices.mark(options.querySelector('[data-choice="service"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardAccounts);
    render();
    wb.scrollTo(cardAccounts);
    wb.announce("Five accounts. Open one.");
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

  function buildLedger() {
    ledgerList.textContent = "";
    LEDGER.forEach(function (entry) { ledgerList.appendChild(el("li", null, entry)); });
  }

  function buildAccounts() {
    ACCOUNTS.forEach(function (account) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("name", "account");
      input.setAttribute("value", account.id);
      input.value = account.id;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, account.title));
      wrap.appendChild(el("span", null, account.source));
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { openAccount(account.id); });
      accountBox.appendChild(label);
    });
  }

  function openAccount(id) {
    open = id;
    render();
    wb.announce(accountById(id).title + " opened. One question before the rest.");
  }

  function judge(key) {
    if (settled[open]) { return; }
    var account = accountById(open);
    settled[open] = key;
    render();
    if (Object.keys(settled).length >= 3) { allBtn.disabled = false; }
    wb.announce(key === account.authority
      ? "Correct."
      : "That is the answer for " + accountFor(key).title.toLowerCase() + ".");
  }

  function render() {
    Array.prototype.forEach.call(accountBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = input.value === open;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
    });

    reading.textContent = "";
    analysis.textContent = "";
    authorityBox.textContent = "";

    if (!open) {
      wb.hide(questionBlock);
      sentence.textContent = "Nothing is open yet. The eight entries above are " +
        "the same eight whichever account you read.";
      allBtn.disabled = Object.keys(settled).length < 3;
      return;
    }

    var account = accountById(open);

    var box = el("div", "block");
    box.appendChild(el("p", "step-label", account.title));
    box.appendChild(el("p", "small", account.source));
    box.appendChild(el("p", null, account.text));
    reading.appendChild(box);

    var done = !!settled[open];
    questionLabel.textContent = done
      ? "Who does this account entitle to say what is really happening?"
      : "Before the rest is shown: who does this account entitle to say what " +
        "is really happening?";
    AUTHORITY_OPTIONS.forEach(function (option) {
      var button = el("button", "option");
      button.type = "button";
      button.setAttribute("data-choice", option.key);
      button.appendChild(el("strong", null, option.text));
      if (done) {
        var chosen = settled[open];
        if (option.key === account.authority) {
          button.setAttribute("data-state", "correct");
          button.appendChild(el("span", null, "This account's answer."));
        } else if (option.key === chosen) {
          button.setAttribute("data-state", "incorrect");
          button.appendChild(el("span", null,
            "This is the answer for " + accountFor(option.key).title.toLowerCase() +
            ", which is a real account and not a made-up wrong one."));
        } else {
          button.appendChild(el("span", null,
            "The answer for " + accountFor(option.key).title.toLowerCase() + "."));
        }
        button.setAttribute("aria-disabled", "true");
      } else {
        button.appendChild(el("span", null, ""));
        button.addEventListener("click", function () { judge(option.key); });
      }
      authorityBox.appendChild(button);
    });
    wb.show(questionBlock);

    if (done) {
      var out = el("div", "block");
      out.appendChild(el("p", "step-label", "What this account does"));
      [
        ["Kind of person it produces", account.position],
        ["Next step it makes obvious", account.action],
        ["Where responsibility lands", account.responsibility],
        ["What it has no place for", account.hidden]
      ].forEach(function (pair) {
        out.appendChild(el("p", "small", pair[0] + ": " + pair[1]));
      });
      out.appendChild(el("p", "small", account.note));
      analysis.appendChild(out);
    }

    var n = Object.keys(settled).length;
    sentence.textContent = "Accounts settled: " + n + " of " + ACCOUNTS.length +
      (n >= 3 ? ". The comparison is available." : ". Settle three to open the comparison.");
    allBtn.disabled = n < 3;
  }

  function showAll() {
    wb.show(cardSummary);
    summaryBody.textContent = "";
    ACCOUNTS.forEach(function (account) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", account.title, "row"));
      tr.appendChild(cell("td", account.position));
      tr.appendChild(cell("td", account.action));
      tr.appendChild(cell("td", optionText(account.authority)));
      tr.appendChild(cell("td", account.mentionsHours ? "yes" : "no"));
      tr.setAttribute("data-state", account.mentionsHours ? "chosen" : "incorrect");
      summaryBody.appendChild(tr);
    });

    summarySentence.textContent =
      "Entry " + HOURS_ENTRY + " of the ledger, the halving of the hours, " +
      "appears in " + MENTIONING.length + " of the " + ACCOUNTS.length +
      " accounts: " + MENTIONING.map(function (a) { return a.title.toLowerCase(); }).join(", ") +
      ". It happened in April, before anything R did, and it is the only entry " +
      "in the ledger that is about a decision rather than about a person. The " +
      "commissioning report comes closest of the other four, and it has the " +
      "hours as a model implemented on schedule, which is not the same entry.";
    wb.scrollTo(cardSummary);
    wb.announce("All five accounts side by side.");
  }

  function explain() {
    var correct = ACCOUNTS.filter(function (a) {
      return settled[a.id] === a.authority;
    }).length;
    resultLead.textContent =
      "You settled " + Object.keys(settled).length + " of the five accounts " +
      "and named the right authority for " + correct + " of them. Across all " +
      "five, the same eight events produce five different kinds of person, " +
      "five different obvious next steps, and " + MENTIONING.length +
      " account of five that has anywhere to put the decision that started it.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    ledgerList = wb.root.querySelector("#ledger");
    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardAccounts = wb.root.querySelector("#card-accounts");
    accountBox = wb.root.querySelector("#accounts");
    reading = wb.root.querySelector("#reading");
    questionBlock = wb.root.querySelector("#question-block");
    questionLabel = wb.root.querySelector("#question-label");
    authorityBox = wb.root.querySelector("#authority");
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

    buildLedger();
    buildAccounts();

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
      wb.hide(cardAccounts);
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
