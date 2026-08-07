/* =========================================================================
   Discourse and Subject Position Laboratory
   -------------------------------------------------------------------------
   One fixed ledger of events and five accounts of them. For each account the
   learner answers four questions:

       1. what kind of person does this account produce?
       2. what does it make legitimate to do next?
       3. who is authorised to say what is happening?
       4. where does responsibility land?

   THE EDUCATIONAL MODEL
   ---------------------
   Every account carries an authored answer to each of the four questions, and
   every option carries an explanation - including the wrong ones, which are
   right answers to the same question about a different account. The tool never
   marks an account as true or false: the ledger is undisputed and every account
   is compatible with all of it.

   Two design decisions carry the critical content:

     * The ledger stays on screen. Discourse analysis here is not a claim that
       the events are made of language, and the fixed ledger is the guard
       against that reading.
     * Ledger entry 2 - the decision to halve the programme's hours - appears in
       none of the five accounts. What a discourse cannot say about anything
       other than the person is usually more consequential than what it says
       about the person.

   WHAT THIS IS NOT
   ----------------
   Not word-counting: no result depends on word frequency. Not a ranking: the
   case note and the risk register exist for reasons, and the recovery
   vocabulary was fought for by service users against exactly the case-note
   position. Five accounts is a simplification of a file that would contain
   dozens, contradicting one another and shifting within a paragraph.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var LEDGER = [
    "R, 34, attended a community day programme three mornings a week for two years.",
    "In April the service's budget was reduced and the programme's hours were halved; R's group moved from three mornings to one.",
    "In May R was reassessed. The assessment recorded that her needs had reduced.",
    "R told two members of staff that she disagreed with the assessment. She asked for a copy and was given one six weeks later.",
    "From June R attended two of the eight remaining sessions.",
    "In July R wrote to the service manager setting out what she thought the assessment had got wrong.",
    "In August R booked a room in the public library and began running a weekly group for four other people who had used the programme.",
    "In September the service closed R's case, recording that she had disengaged."
  ];

  var DIMENSIONS = [
    {
      id: "position",
      question: "What kind of person does this account produce?",
      column: "Kind of person"
    },
    {
      id: "legitimate",
      question: "Given that position, what becomes the obviously reasonable next step?",
      column: "Legitimate next action"
    },
    {
      id: "authority",
      question: "Who does this account entitle to say what is really happening?",
      column: "Who may say what is happening"
    },
    {
      id: "responsibility",
      question: "Where does responsibility for the six months land?",
      column: "Responsibility"
    }
  ];

  /* Every option is the correct answer for exactly one account, so the
     distractors are never straw men. */
  var OPTIONS = {
    position: [
      { id: "casenote", label: "A patient whose condition is deteriorating and whose judgement is part of what is impaired" },
      { id: "risk", label: "A source of risk to be monitored, currently outside supervision" },
      { id: "advocacy", label: "A citizen with a grievance, acting on it competently" },
      { id: "recovery", label: "An individual on a journey, exercising choice and taking ownership" },
      { id: "market", label: "A customer whose satisfaction has fallen and who has taken her custom elsewhere" }
    ],
    legitimate: [
      { id: "casenote", label: "Review the care plan and consider whether engagement can be re-established clinically" },
      { id: "risk", label: "Escalate to safeguarding and record the loss of contact" },
      { id: "advocacy", label: "Answer the letter on its merits and correct the assessment if it is wrong" },
      { id: "recovery", label: "Affirm her choices and support the goals she has set for herself" },
      { id: "market", label: "Survey her about the experience and use it to improve the offer" }
    ],
    authority: [
      { id: "casenote", label: "The clinician, whose training is what makes the observations observations" },
      { id: "risk", label: "The safeguarding lead, on the basis of a threshold rather than a conversation" },
      { id: "advocacy", label: "R and the four people in the library, as those to whom it is happening" },
      { id: "recovery", label: "R, within limits the service sets - she narrates the journey, the service defines what a journey is" },
      { id: "market", label: "The aggregate of respondents, through an instrument the provider designed" }
    ],
    responsibility: [
      { id: "casenote", label: "With R's condition, which is not her fault and is also not anybody else's" },
      { id: "risk", label: "With R, for placing herself outside the arrangements made for her" },
      { id: "advocacy", label: "With the service, for an assessment it has not defended and a letter it has not answered" },
      { id: "recovery", label: "With R, as the author of her own choices - reframed as empowerment rather than blame" },
      { id: "market", label: "Nowhere in particular - a transaction ended, which is what transactions do" }
    ]
  };

  var ACCOUNTS = [
    {
      id: "casenote",
      title: "The case note",
      source: "Electronic record, entered by the programme's lead practitioner, September.",
      text:
        "Engagement has declined markedly over the reporting period. R attended " +
        "2/8 sessions following reassessment and has expressed dissatisfaction " +
        "with the outcome to several staff members. Limited insight into the " +
        "rationale for the revised plan. Has written to management. Now " +
        "reported to be organising informal activity in the community, " +
        "unsupervised. Case closed - disengaged.",
      note:
        "Notice how much of the ledger survives and how little of it stays " +
        "the same kind of event. \"Expressed dissatisfaction\" and \"has " +
        "written to management\" are true; \"limited insight\" turns a " +
        "disagreement into a symptom, and once it is a symptom the letter " +
        "cannot be answered on its merits without a category error.",
      hidden:
        "That the hours were halved in April. The record has a field for R's " +
        "attendance and no field for the programme's."
    },
    {
      id: "risk",
      title: "The risk register entry",
      source: "Quarterly risk review, safeguarding lead, September.",
      text:
        "Service user with two-year history of supported attendance now out of " +
        "contact. Last seen June. Unmonitored group activity in a public " +
        "setting with four other former attendees; no risk assessment held for " +
        "this activity and no responsible person identified. Contact attempts " +
        "unsuccessful. Recommend flag pending review.",
      note:
        "The same library group that the advocacy bulletin calls peer support " +
        "here becomes an unassessed setting. Neither description is inaccurate. " +
        "What differs is that this one is written in a genre whose whole " +
        "purpose is to notice what has not been signed off, and that genre has " +
        "no way of recording a thing going well.",
      hidden:
        "That R is in a library, on a weekday, with four people she knows. The " +
        "register records the absence of oversight, not the presence of anyone."
    },
    {
      id: "advocacy",
      title: "The advocacy bulletin",
      source: "Newsletter of a local user-led group, October.",
      text:
        "After the council halved the hours at the day programme, members were " +
        "reassessed and several were told their needs had reduced. One member, " +
        "R, requested her assessment, waited six weeks for it, and wrote to the " +
        "manager setting out the errors in it. Having had no reply, she has " +
        "started a weekly peer group at the library, now attended by five " +
        "people. Her case has since been closed as \"disengaged\".",
      note:
        "The only account that includes the budget decision, and it includes it " +
        "in the first clause. Note what that does to the last sentence: " +
        "\"closed as disengaged\" is presented as something done to R rather " +
        "than something she did, and the quotation marks carry the whole " +
        "argument.",
      hidden:
        "Whatever the reassessment might have got right. This account is not " +
        "neutral either, and its confidence that the assessment was in error is " +
        "asserted rather than shown."
    },
    {
      id: "recovery",
      title: "The recovery-oriented summary",
      source: "Discharge summary, written to the service's recovery template, September.",
      text:
        "R has moved into a more independent phase of her recovery journey. She " +
        "has exercised choice about how she uses her time, taken ownership of " +
        "her support needs and built her own network in the community, " +
        "convening a peer group of her own. She has been able to voice her " +
        "views about her assessment. R now feels ready to manage without " +
        "formal input and we wish her well.",
      note:
        "The humane one, and the one that most completely makes a service cut " +
        "into a personal achievement. Every verb is R's: she has moved, chosen, " +
        "taken ownership, built. Nothing was done to her, and \"ready to manage " +
        "without formal input\" is doing the work that \"case closed\" does in " +
        "the case note, with none of the friction.",
      hidden:
        "That she asked for something and did not get it. In this vocabulary " +
        "there is no grammatical position for an unanswered request - a " +
        "disagreement can only appear as a view that has been voiced."
    },
    {
      id: "market",
      title: "The commissioning report",
      source: "Provider performance summary to the commissioner, October.",
      text:
        "Reduced-hours model implemented on schedule and within budget. " +
        "Reassessment identified reduced need in a proportion of the cohort, " +
        "consistent with expected step-down. One service user submitted written " +
        "feedback; satisfaction data for the quarter remain within tolerance. " +
        "Attrition at 12%, in line with comparable services. Independent " +
        "community-based activity has emerged among former attendees, " +
        "indicating good progression.",
      note:
        "R appears once, as \"one service user submitted written feedback\". The " +
        "peer group in the library appears as evidence that the cut worked. " +
        "This is the account with the most power attached to it and the least " +
        "to say about anybody, and both of those facts follow from the same " +
        "feature: its unit of analysis is a cohort.",
      hidden:
        "R entirely, in any sense in which she is a person. Nothing in this " +
        "genre is false; the person has simply been aggregated out of it."
    }
  ];

  var CLAIMS = [
    {
      id: "insight",
      text: "\"R shows limited insight into the rationale for the revised plan.\"",
      answer: "symptom",
      why:
        "It converts a disagreement into a symptom. Once disagreeing is " +
        "evidence of the condition, there is no move R can make that counts as " +
        "argument: agreeing confirms the plan and disagreeing confirms the " +
        "diagnosis. This is not a claim that clinicians write it in bad faith - " +
        "insight is a real clinical concept - but the sentence has this " +
        "structure whoever writes it."
    },
    {
      id: "ownership",
      text: "\"R has taken ownership of her support needs.\"",
      answer: "responsibility",
      why:
        "It relocates responsibility without appearing to. The service's hours " +
        "were halved; the sentence records R acquiring something rather than " +
        "losing something, and makes her the agent of the change. This is the " +
        "reason recovery language is worth analysing rather than simply " +
        "welcoming: the vocabulary was won by service users and can be operated " +
        "in a direction they did not intend."
    },
    {
      id: "unsupervised",
      text: "\"Organising informal activity in the community, unsupervised.\"",
      answer: "legitimacy",
      why:
        "It makes an ordinary activity into an exception. Five adults meeting " +
        "in a library are not normally described as unsupervised; the word only " +
        "makes sense against a background in which supervision was the default " +
        "for these particular five. What the sentence does is withdraw the " +
        "legitimacy that the same activity would have if anyone else did it."
    },
    {
      id: "attrition",
      text: "\"Attrition at 12%, in line with comparable services.\"",
      answer: "erasure",
      why:
        "R is not positioned at all here; she is aggregated. That is a position " +
        "too, and it is the one with the most institutional force, because a " +
        "figure in line with comparators requires no explanation and generates " +
        "no action. Ask who would have to notice R for this sentence to become " +
        "difficult to write."
    }
  ];

  var CLAIM_OPTIONS = [
    { value: "symptom", label: "Turns a disagreement into a symptom" },
    { value: "responsibility", label: "Moves responsibility onto R while appearing to praise her" },
    { value: "legitimacy", label: "Withdraws the legitimacy an ordinary activity would otherwise have" },
    { value: "erasure", label: "Removes R as a person by aggregating her" }
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

  function accountById(id) {
    return ACCOUNTS.filter(function (a) { return a.id === id; })[0] || null;
  }

  function optionLabel(dimension, id) {
    return OPTIONS[dimension].filter(function (o) { return o.id === id; })[0].label;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#discourse-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var ledgerList = $("[data-ledger]");
  var accountChoices = $("[data-account-choices]");
  var questionsBlock = $("[data-questions-block]");
  var questionsBox = $("[data-questions]");
  var accountTitle = $("[data-account-title]");
  var accountSource = $("[data-account-source]");
  var accountText = $("[data-account-text]");
  var analysis = $("[data-analysis]");
  var analysisBody = $("[data-analysis-body]");
  var comparison = $("[data-comparison]");
  var comparisonBody = $("[data-comparison-body]");
  var synthesis = $("[data-synthesis]");
  var goalText = $("[data-goal-text]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var INITIAL = { unlocked: false, account: null, picks: {}, analysed: {} };
  var state = null;

  /* --- Static material -------------------------------------------------------- */

  function buildLedger() {
    clear(ledgerList);
    LEDGER.forEach(function (entry, index) {
      var item = make("li", "ledger__item");
      if (index === 1) { item.setAttribute("data-key", "yes"); }
      item.appendChild(make("span", "ledger__text", entry));
      ledgerList.appendChild(item);
    });
  }

  function buildAccountChoices() {
    clear(accountChoices);
    ACCOUNTS.forEach(function (account) {
      var label = make("label", "lens-option");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "account";
      input.value = account.id;
      input.addEventListener("change", function () {
        state.account = account.id;
        state.picks = {};
        buildQuestions();
        analysis.hidden = !state.analysed[account.id];
        if (state.analysed[account.id]) { showAnalysis(account, true); }
        render();
        shell.announce(account.title + " loaded. Read it, then answer the four " +
          "questions.", { immediate: true });
      });
      label.appendChild(input);
      var body = make("span", "lens-option__body");
      body.appendChild(make("span", "lens-option__name", account.title));
      body.appendChild(make("span", "lens-option__question", account.source));
      label.appendChild(body);
      accountChoices.appendChild(label);
    });
  }

  function buildQuestions() {
    clear(questionsBox);
    if (!state.account) { return; }
    DIMENSIONS.forEach(function (dimension) {
      var group = make("fieldset", "question");
      group.appendChild(make("legend", "question__legend", dimension.question));
      OPTIONS[dimension.id].forEach(function (option) {
        var label = make("label", "control--choice question__option");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q-" + dimension.id;
        input.value = option.id;
        input.addEventListener("change", function () {
          state.picks[dimension.id] = option.id;
        });
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      questionsBox.appendChild(group);
    });
  }

  /* --- The pinned account ------------------------------------------------------ */

  function renderAccount() {
    if (!state.account) {
      accountTitle.textContent = "No account selected";
      accountSource.textContent = "";
      accountText.textContent =
        "Choose one of the five accounts on the left. Every one of them is " +
        "compatible with every line of the ledger; none of them contains a " +
        "false statement.";
      return;
    }
    var account = accountById(state.account);
    accountTitle.textContent = account.title;
    accountSource.textContent = account.source;
    accountText.textContent = account.text;
  }

  /* --- Analysis ---------------------------------------------------------------- */

  function showAnalysis(account, revealed) {
    state.analysed[account.id] = true;
    analysis.hidden = false;
    clear(analysisBody);

    DIMENSIONS.forEach(function (dimension) {
      var picked = state.picks[dimension.id];
      var correct = account.id;
      var box = make("div", "verdict");
      var agreed = picked === correct;
      box.setAttribute("data-tone", revealed ? "neutral" : agreed ? "good" : "caution");
      box.appendChild(make("h5", "verdict__title", dimension.question));
      box.appendChild(make("p", "verdict__body",
        optionLabel(dimension.id, correct)));
      if (picked && !agreed) {
        box.appendChild(make("p", "verdict__note",
          "You chose: \"" + optionLabel(dimension.id, picked) + "\" - which is " +
          "the answer for the " + accountById(picked).title.toLowerCase() +
          ". It is not a wrong reading of a text; it is a right reading of a " +
          "different one."));
      }
      analysisBody.appendChild(box);
    });

    var summary = make("div", "verdict");
    summary.setAttribute("data-tone", "warn");
    summary.appendChild(make("h5", "verdict__title", "What it does, and what it cannot say"));
    summary.appendChild(make("p", "verdict__body", account.note));
    summary.appendChild(make("p", "verdict__body",
      "What this account has no place for: " + account.hidden));
    analysisBody.appendChild(summary);

    render();
  }

  $('[data-action="check"]').addEventListener("click", function () {
    if (!state.account) { return; }
    var missing = DIMENSIONS.filter(function (d) { return !state.picks[d.id]; });
    if (missing.length) {
      shell.announce("Answer all four questions before checking.", { immediate: true });
      return;
    }
    var account = accountById(state.account);
    var right = DIMENSIONS.filter(function (d) {
      return state.picks[d.id] === account.id;
    }).length;
    showAnalysis(account, false);
    shell.announce(right + " of 4 match this account.", { immediate: true });
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    if (!state.account) { return; }
    showAnalysis(accountById(state.account), true);
    shell.announce("Analysis revealed.", { immediate: true });
  });

  /* --- Comparison and synthesis -------------------------------------------------- */

  function renderComparison() {
    var done = ACCOUNTS.filter(function (a) { return state.analysed[a.id]; });
    if (!done.length) {
      comparison.hidden = true;
      return;
    }
    comparison.hidden = false;
    clear(comparisonBody);
    done.forEach(function (account) {
      var row = make("tr");
      var th = make("th", null, account.title);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      DIMENSIONS.forEach(function (dimension) {
        row.appendChild(make("td", null, optionLabel(dimension.id, account.id)));
      });
      comparisonBody.appendChild(row);
    });

    clear(synthesis);
    synthesis.setAttribute("data-tone", done.length >= 3 ? "warn" : "neutral");
    if (done.length < 3) {
      synthesis.appendChild(make("p", "verdict__body",
        done.length + " of 5 accounts analysed. Analyse at least three before " +
        "reading the synthesis: with one account there is nothing to compare, " +
        "and with two the difference looks like a difference of opinion."));
      return;
    }
    var mentionsCut = done.filter(function (a) { return a.id === "advocacy"; }).length;
    synthesis.appendChild(make("h5", "verdict__title",
      "After " + done.length + " accounts"));
    synthesis.appendChild(make("p", "verdict__body",
      "Every line of the ledger is compatible with every one of these accounts, " +
      "and no account contains a false statement. What differs is the kind of " +
      "person R is made into, and with it what she may reasonably do, who may " +
      "say what is happening, and where responsibility comes to rest."));
    synthesis.appendChild(make("p", "verdict__body",
      mentionsCut
        ? "Of the accounts you have analysed, only the advocacy bulletin " +
          "mentions ledger entry 2 - the decision to halve the programme's " +
          "hours - and it puts it in the first clause. The others are not " +
          "concealing it. Their genres have no field for it: a case note " +
          "records a patient, a risk register records an exposure, a discharge " +
          "summary records a journey and a commissioning report records a " +
          "cohort."
        : "None of the accounts you have analysed mentions ledger entry 2 - " +
          "the decision to halve the programme's hours. They are not " +
          "concealing it. Their genres have no field for it: a case note " +
          "records a patient, a risk register records an exposure, a discharge " +
          "summary records a journey and a commissioning report records a " +
          "cohort. Try the advocacy bulletin and see where it puts that entry."));
    synthesis.appendChild(make("p", "verdict__note",
      "None of this makes the events unreal, and none of it makes one account " +
      "the honest one. The ledger is on screen for the first reason and the " +
      "comparison table for the second."));
  }

  function renderGoal() {
    var done = Object.keys(state.analysed).length;
    clear(goalText);
    var list = make("ul", "goal__checks");
    [
      {
        label: "Choose an account",
        detail: state.account ? accountById(state.account).title : "not yet",
        met: Boolean(state.account)
      },
      { label: "Analyse at least three", detail: done + " of 5", met: done >= 3 }
    ].forEach(function (check) {
      var item = make("li");
      item.textContent = check.label + " - " + check.detail +
        (check.met ? " (met)" : " (not yet)");
      item.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(item);
    });
    goalText.appendChild(list);
  }

  function render() {
    questionsBlock.hidden = !state.account;
    renderAccount();
    renderComparison();
    renderGoal();
  }

  /* --- Challenge ------------------------------------------------------------------ */

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

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One answer per extract, please.",
        "A blank is not a reading.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 3 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", right + " of 4 match."));
    lead.appendChild(document.createTextNode(
      " Each extract does more than one thing; the answer marked is the one " +
      "that most changes what can happen next."));
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
    shell.announce("Four extracts judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------------- */

  var OPENING = {
    tone: {
      tone: "caution",
      verdict: "Tone is the least of it.",
      text:
        "The warmest of the five accounts is also the one that most completely " +
        "makes a budget cut into a personal achievement. Sympathy and effect " +
        "come apart, and that is worth watching for."
    },
    facts: {
      tone: "caution",
      verdict: "Closer, and still not the main thing.",
      text:
        "One fact is indeed missing from four of the five, and it is worth " +
        "finding. But every account is compatible with every line of the " +
        "ledger; what separates them is not which facts they contain but what " +
        "kind of thing R becomes in them."
    },
    position: {
      tone: "good",
      verdict: "That is the argument of the laboratory.",
      text:
        "A position comes with a specification of what somebody in it can " +
        "reasonably do. The same letter to the same manager is an escalation, " +
        "a piece of self-advocacy or a customer complaint depending on nothing " +
        "but the position the writing has already put her in."
    },
    accuracy: {
      tone: "caution",
      verdict: "None of them contains a false statement.",
      text:
        "That is the uncomfortable part. Every account is consistent with the " +
        "whole ledger, so accuracy cannot be what separates them - which is " +
        "exactly why the question of what an account does has to be asked " +
        "separately from the question of whether it is true."
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
    state.unlocked = true;
    labSection.hidden = false;
    render();
    shell.announce("Laboratory open. Choose an account to begin.", { immediate: true });
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

  /* --- Worked example --------------------------------------------------------------- */

  $('[data-action="worked"]').addEventListener("click", function () {
    ["casenote", "recovery", "market"].forEach(function (id) {
      state.analysed[id] = true;
    });
    state.account = "recovery";
    state.picks = {};
    var input = $$('input[name="account"]').filter(function (node) {
      return node.value === "recovery";
    })[0];
    if (input) { input.checked = true; }
    buildQuestions();
    showAnalysis(accountById("recovery"), true);
    shell.announce(
      "Worked example: the case note, the recovery summary and the " +
      "commissioning report analysed, ending on the recovery summary. Compare " +
      "the responsibility column across the three.",
      { immediate: true });
  });

  /* --- Reset and start-up ------------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    analysis.hidden = true;
    questionsBlock.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    $$('input[name="account"]').forEach(function (input) { input.checked = false; });
    clear(questionsBox);
    render();
  });

  buildLedger();
  buildAccountChoices();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Read the ledger, then answer the question above.",
    { immediate: true });
})();
