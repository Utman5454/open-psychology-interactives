/* =========================================================================
   Reflexivity and Alternative Theme Builder
   -------------------------------------------------------------------------
   The same six invented extracts used by the Thematic Analysis Coding
   Laboratory and the Theme or Topic challenge in this module. The learner
   pairs one of three research questions with one of three theoretical
   sensitivities, and the tool shows the thematic account that pairing
   supports.

   WHAT THE TOOL IS DOING
   ----------------------
   It is NOT analysing anything. Nine accounts were written in advance, one
   per pairing, each with its themes, a map of which extracts sit at the centre
   and which recede, what the reading illuminates, and what it leaves less
   visible. Selecting a pairing selects a prepared account. No software
   analyses qualitative data, and pretending otherwise would teach the opposite
   of this module's argument.

   COHERENCE IS THE STANDARD ON DISPLAY
   ------------------------------------
   Each pairing carries a coherence rating:

       strong     the question asks about the kind of object the lens is built
                  to see
       workable   the pairing holds, with a stated cost
       strained   the question asks about one kind of object and the lens is
                  built to see another, so the account answers a question
                  nobody asked

   Two of the nine are strained on purpose. This is what refutes "anything
   goes" without appealing to the analyst's skill: the mismatch is visible from
   outside.

   SEVERAL READINGS, NOT ANY READING
   ---------------------------------
   The accountability check offers five claims. Two fail under every reading
   available here - one imports a disposition nobody reported, one attributes
   an intention to an organisation nobody interviewed. One is supported by a
   single participant and stated as though it were about a group. One holds
   under every reading. One is genuinely reading-dependent, and its verdict is
   computed from the lens currently selected.

   The extracts are invented for teaching. No participant, interview,
   institution or study is represented. No data leave the browser: there is no
   storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var PEOPLE = ["Ama", "Jonah", "Priya", "Kwame", "Lena", "Toby"];

  var EXTRACTS = [
    {
      who: "Ama, second year",
      text:
        "I did think about emailing the tutor, but then you sort of think, " +
        "everyone else seems to have got it, so you'd be the one putting your " +
        "hand up saying I'm the one who hasn't. So I left it. And then it was " +
        "too late to ask, because by then you should have asked three weeks ago."
    },
    {
      who: "Jonah, first year",
      text:
        "There's a form. You fill in the form and then someone emails you back " +
        "with a link to a page you already read. I filled it in twice. The " +
        "second time I didn't bother reading the reply."
    },
    {
      who: "Priya, third year",
      text:
        "My flatmate asked for an extension and got one, so I asked. It felt " +
        "like knowing the trick. Nobody tells you the trick. You find out from " +
        "someone who found out from someone."
    },
    {
      who: "Kwame, second year",
      text:
        "I don't want to be the student who's always struggling. There's a " +
        "version of me they've got in their heads and I'd rather it stayed the " +
        "one who's fine."
    },
    {
      who: "Lena, first year",
      text:
        "I asked in the seminar and she just answered it, no fuss, and " +
        "afterwards two people said they'd wanted to ask the same thing. So it " +
        "was fine. It's just the first one that costs something."
    },
    {
      who: "Toby, mature student, second year",
      text:
        "I've worked in an office for eleven years. You ask, someone tells you, " +
        "that's the job. Here it's like admitting something. I still ask, but I " +
        "notice that I notice."
    }
  ];

  var QUESTIONS = [
    {
      id: "moment",
      tag: "Question 1",
      text:
        "How do students experience the moment of deciding whether to ask for " +
        "help?"
    },
    {
      id: "costly",
      tag: "Question 2",
      text: "What makes asking for help costly in this setting?"
    },
    {
      id: "category",
      tag: "Question 3",
      text:
        "How is “the student who needs help” produced as a category, " +
        "and by whom?"
    }
  ];

  var LENSES = [
    {
      id: "experiential",
      tag: "Lens A",
      text:
        "Experiential — the accounts are treated as reports of what it was like " +
        "for these people, and the analysis stays with their terms."
    },
    {
      id: "social",
      tag: "Lens B",
      text:
        "Social-psychological — the accounts are treated as evidence about how " +
        "people manage identity in front of others, and read against norms and " +
        "self-presentation."
    },
    {
      id: "critical",
      tag: "Lens C",
      text:
        "Critical and institutional — the accounts are treated as traces of " +
        "arrangements and categories that were in place before anyone spoke."
    }
  ];

  var STANDING_WORD = ["at the margins", "supporting", "central"];

  /* =======================================================================
     The nine prepared accounts
     -------------------------------------------------------------------
     foreground: one standing per person, in PEOPLE order, 0-2.
     ===================================================================== */

  var ACCOUNTS = {
    "moment/experiential": {
      coherence: "strong",
      coherenceNote:
        "The question asks what the moment was like; the lens is built to stay " +
        "with what things were like. Question and position are asking after the " +
        "same kind of object.",
      themes: [
        "The pause before asking: a decision made privately and quickly, and " +
        "revisited afterwards",
        "Learning after the fact that the cost was anticipated rather than " +
        "incurred"
      ],
      foreground: [2, 1, 1, 2, 2, 1],
      illuminates:
        "The texture of the decision itself — Ama's swift calculation, Kwame's " +
        "preference for the version of himself that is fine, Lena's discovery " +
        "afterwards that the feared thing did not happen. This reading takes " +
        "the participants' own terms seriously and produces an account they " +
        "would recognise.",
      obscures:
        "Everything that was in place before the moment. Jonah's form and " +
        "Priya's flatmate become background detail rather than the subject, and " +
        "the analysis has nothing to say about why the moment felt like that " +
        "for so many different people."
    },
    "moment/social": {
      coherence: "workable",
      coherenceNote:
        "The pairing holds: the moment of deciding is partly a moment of " +
        "anticipating an audience. The cost is that the account will describe " +
        "the audience the participants imagine rather than the one they " +
        "actually had.",
      themes: [
        "Asking as a claim about oneself, made in front of people who will " +
        "remember it",
        "The first question as a shared cost that somebody has to volunteer to " +
        "pay"
      ],
      foreground: [2, 0, 1, 2, 2, 1],
      illuminates:
        "The audience in the room and in the head. Kwame's account of a version " +
        "of himself held by staff, Ama's comparison with everyone else, and " +
        "Lena's two silent classmates all become instances of one thing: a " +
        "request for information read as a statement about the person making " +
        "it.",
      obscures:
        "Jonah, almost entirely — nobody is watching him fill in a form. The " +
        "reading also leaves the norms themselves unexamined, treating them as " +
        "the conditions people respond to rather than as something produced."
    },
    "moment/critical": {
      coherence: "strained",
      coherenceNote:
        "This is one of the two pairings that pull against themselves. The " +
        "question asks how the moment is experienced; the lens is built to look " +
        "past the person at the arrangements. The account below is not " +
        "incompetent — it is answering a question nobody asked, and a reader " +
        "would notice within a paragraph.",
      themes: [
        "Individual hesitation as the visible end of an institutional " +
        "arrangement",
        "The moment of deciding as a place where a policy is enforced without " +
        "anyone enforcing it"
      ],
      foreground: [1, 2, 2, 1, 0, 2],
      illuminates:
        "Some real things: that the moment has conditions, that those " +
        "conditions were designed, and that the same moment is easier for Toby " +
        "because he has been somewhere else. None of this is untrue.",
      obscures:
        "The moment itself, which was the question. Every participant becomes " +
        "an illustration of an arrangement, and the felt quality the question " +
        "asked after is the first thing the lens looks past. Either rewrite the " +
        "question or change the lens; do not publish this pairing and call it " +
        "an experiential study."
    },

    "costly/experiential": {
      coherence: "workable",
      coherenceNote:
        "The pairing holds and pulls slightly. The question is about the " +
        "setting; the lens keeps returning answers about people. Expect an " +
        "account of how the cost feels rather than of what produces it, and say " +
        "so in the write-up.",
      themes: [
        "A cost paid in how one is seen rather than in time or effort",
        "The expense of being first, and the relief of finding it was survivable"
      ],
      foreground: [2, 1, 1, 2, 2, 1],
      illuminates:
        "What the cost consists of, in the participants' own currency: not " +
        "difficulty, not time, but exposure. That is a genuine answer to the " +
        "question and it comes straight from the extracts.",
      obscures:
        "What makes it cost that. The reading can say the price is paid in " +
        "visibility and cannot say why visibility is expensive here and not in " +
        "Toby's office, because it is not looking at either setting."
    },
    "costly/social": {
      coherence: "strong",
      coherenceNote:
        "The question asks what makes asking costly; the lens is built to see " +
        "the norms and audiences that put a price on things. Well matched.",
      themes: [
        "Comprehension as a public performance, so that not understanding " +
        "becomes something to be seen doing",
        "Silence produced collectively and paid for individually"
      ],
      foreground: [2, 0, 1, 2, 2, 2],
      illuminates:
        "The mechanism. Lena's two classmates make it possible to say that the " +
        "silence was shared and the cost was not, and Toby's comparison shows " +
        "the norm is local rather than inherent. Together they support a claim " +
        "about how the price is set.",
      obscures:
        "Jonah's encounter with the form, which involves no audience at all and " +
        "is a cost of a different kind. A reading that cannot accommodate one " +
        "of six participants should say so rather than quietly drop him."
    },
    "costly/critical": {
      coherence: "strong",
      coherenceNote:
        "The question asks what the setting does; the lens is built to see " +
        "settings. This pairing produces the most confident account in the tool " +
        "and should be read alongside the most sceptical one.",
      themes: [
        "Help routed through an act of self-identification, so that receiving " +
        "it requires declaring what you are",
        "Rules that are published and not communicated, so access depends on " +
        "who you already know"
      ],
      foreground: [1, 2, 2, 2, 0, 2],
      illuminates:
        "The arrangements. Jonah's ticketing process, Priya's flatmate and " +
        "Kwame's awareness of a durable institutional impression become three " +
        "faces of one design, and Toby's comparison with a workplace supplies " +
        "the contrast that shows it is a design rather than a fact of life.",
      obscures:
        "Lena, whose experience was straightforwardly fine, and any sense that " +
        "students act rather than being acted upon. The account is strongest " +
        "exactly where it is least able to accommodate a case that went well."
    },

    "category/experiential": {
      coherence: "strained",
      coherenceNote:
        "The second pairing that pulls against itself. The question asks how a " +
        "category is produced — which is a question about discourse and " +
        "institutions — and the lens answers with how individuals felt. The " +
        "account below quietly changes the question into 'how does it feel to " +
        "be in that category', which is a fine question and not this one.",
      themes: [
        "Not wanting to be that kind of student",
        "The relief of not having been seen as one"
      ],
      foreground: [1, 0, 0, 2, 2, 1],
      illuminates:
        "How the category is inhabited: Kwame's careful management of an " +
        "impression, Ama's reluctance to be the one who has not understood. " +
        "Both are real and both are about the experience of a category rather " +
        "than about its production.",
      obscures:
        "Everything the question asked for. Who maintains the category, what " +
        "administrative machinery gives it consequences, and how it comes to be " +
        "available to be avoided are all outside what this lens looks at. The " +
        "word 'produced' in the question is doing work the analysis never " +
        "picks up."
    },
    "category/social": {
      coherence: "workable",
      coherenceNote:
        "The pairing holds by treating the category as something maintained " +
        "between people rather than by an institution. That is a real position " +
        "and it narrows the question: 'by whom' will be answered as 'by " +
        "everyone in the room', which some readers will find too generous to " +
        "the institution.",
      themes: [
        "The struggling student as a role nobody volunteers for",
        "Peers as the audience who keep the category in circulation"
      ],
      foreground: [2, 0, 1, 2, 2, 1],
      illuminates:
        "That the category is sustained in ordinary interaction — in Ama's " +
        "sense that everyone else has understood, in the two classmates who " +
        "said nothing, in Kwame's confidence that staff hold a version of him. " +
        "Nobody has to enforce it for it to work.",
      obscures:
        "The parts of the category that are administered rather than " +
        "interactional: forms, extension procedures, records, and the fact that " +
        "support is dispensed to people who declare themselves eligible."
    },
    "category/critical": {
      coherence: "strong",
      coherenceNote:
        "The question asks how a category is produced and by whom; the lens is " +
        "built to trace exactly that. The strongest match in the tool, and the " +
        "one most obliged to show its working.",
      themes: [
        "A category constituted by the machinery that offers to help: to " +
        "receive support you must first become the kind of person who needs it",
        "Deficit as an available identity, avoided by those who can afford to " +
        "avoid it"
      ],
      foreground: [1, 2, 2, 2, 0, 2],
      illuminates:
        "How the category gets made and kept: through forms that require " +
        "self-identification, procedures learnt informally, and staff " +
        "impressions that persist. Toby's comparison is decisive here, because " +
        "it shows the category is not a property of asking but of asking in " +
        "this place.",
      obscures:
        "Lena entirely, and the participants' own agency generally. It also " +
        "rests heavily on one atypical participant, which the write-up would " +
        "have to declare rather than bury."
    }
  };

  /* =======================================================================
     The accountability check
     ===================================================================== */

  var CLAIMS = [
    {
      text: "Students avoid asking for help because they lack confidence.",
      verdict: function () { return "no"; },
      note: function () {
        return "Fails under every reading available here. Nobody in the " +
          "dataset reports lacking confidence; the claim imports a " +
          "disposition and then uses it as a cause. Notice that it is not the " +
          "critical readings that rule this out - the experiential reading " +
          "rules it out too, because the participants did not say it.";
      }
    },
    {
      text:
        "In this setting, asking for help is experienced as making oneself " +
        "visible.",
      verdict: function () { return "yes"; },
      note: function () {
        return "Holds under every reading here. Ama, Kwame and Lena all " +
          "support it in their own words, and it is stated as being about " +
          "this setting rather than about students in general. What the " +
          "readings differ on is what to say next.";
      }
    },
    {
      text:
        "The university's support processes are designed to discourage " +
        "students from using them.",
      verdict: function () { return "no"; },
      note: function () {
        return "Fails under every reading, including the critical one. The " +
          "extracts support a claim about what the processes do; they contain " +
          "nothing at all about anyone's intentions, because nobody who " +
          "designed the processes was interviewed. A critical reading is " +
          "entitled to describe an arrangement and is not entitled to assert " +
          "a purpose behind it.";
      }
    },
    {
      text:
        "Students who have worked elsewhere find the norm easier to resist.",
      verdict: function () { return "partly"; },
      note: function () {
        return "Supported by exactly one participant and stated as though it " +
          "were about a group. Toby is the only person in the dataset with " +
          "that comparison, and he is also the reason several readings can see " +
          "the norm at all. The honest version keeps him singular: 'one " +
          "participant, who arrived with a different working life, described " +
          "the norm as visible and resistible'. Whether that generalises is a " +
          "question these data cannot answer.";
      }
    },
    {
      text:
        "Whether asking is costly depends on the setting rather than on the " +
        "person.",
      verdict: function (state) {
        return state.lens === "experiential" ? "no" : "yes";
      },
      note: function (state) {
        return state.lens === "experiential"
          ? "This is the reading-dependent one, and under the experiential " +
            "lens it does not hold. That lens stays with what things were " +
            "like for these people; it has no vantage point from which to " +
            "compare settings, so a claim about settings rather than persons " +
            "is not something it can pay for. Toby's comparison is available " +
            "in the data and this reading treats it as his experience, not as " +
            "evidence about a place."
          : "Under the lens you have selected this holds, with care. Both the " +
            "social-psychological and the critical readings have a route to " +
            "it: Toby's comparison with eleven years of office work makes the " +
            "norm local, and Lena's two silent classmates make it collective. " +
            "It still rests on one participant's contrast, and a write-up " +
            "should say so.";
      }
    }
  ];

  var VERDICT_LABEL = {
    yes: "Traceable to the data under this reading",
    partly: "Partly — supported, but stated more widely than the data allow",
    no: "Not traceable — this reading cannot pay for it"
  };

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

  var shell = InteractiveShell.attach("#reflexivity");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var questionList = $("[data-question-list]");
  var lensList = $("[data-lens-list]");
  var coherence = $("[data-coherence]");
  var themes = $("[data-themes]");
  var foreground = $("[data-foreground]");
  var verdict = $("[data-verdict]");
  var illuminates = $("[data-illuminates]");
  var obscures = $("[data-obscures]");
  var coherenceNote = $("[data-coherence-note]");
  var compareBlock = $("[data-compare]");
  var compareTable = $("[data-compare-table]");
  var compareNote = $("[data-compare-note]");
  var extractsBlock = $("[data-extracts]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var accountSection = $("#accountability");
  var accountForm = $("#account-form");
  var claimList = $("[data-claim-list]");
  var accountFeedback = $("[data-account-feedback]");

  var DEFAULTS = { question: "moment", lens: "experiential" };
  var saved = null;

  function state() {
    var q = $('input[name="question"]:checked', questionList);
    var l = $('input[name="lens"]:checked', lensList);
    return {
      question: q ? q.value : DEFAULTS.question,
      lens: l ? l.value : DEFAULTS.lens
    };
  }

  function accountFor(s) { return ACCOUNTS[s.question + "/" + s.lens]; }

  function questionText(id) {
    return QUESTIONS.filter(function (q) { return q.id === id; })[0].text;
  }

  function lensText(id) {
    return LENSES.filter(function (l) { return l.id === id; })[0].text.split(" — ")[0];
  }

  /* --- Building the controls ---------------------------------------------- */

  function buildChoices(container, items, name, defaultId) {
    clear(container);
    items.forEach(function (item) {
      var wrap = make("div", "choice");
      var label = make("label", "choice__row");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = item.id;
      if (item.id === defaultId) { input.checked = true; }
      label.appendChild(input);
      var text = make("span", "choice__text");
      text.appendChild(make("span", "choice__tag", item.tag));
      text.appendChild(document.createTextNode(item.text));
      label.appendChild(text);
      wrap.appendChild(label);
      container.appendChild(wrap);
      input.addEventListener("change", function () {
        render();
        var account = accountFor(state());
        shell.announce(
          item.tag + " selected. This pairing is " + account.coherence +
          ". " + account.coherenceNote, { immediate: true });
      });
    });
  }

  function buildExtracts() {
    clear(extractsBlock);
    EXTRACTS.forEach(function (extract) {
      var block = make("div", "extract");
      block.appendChild(make("span", "extract__who", extract.who));
      block.appendChild(document.createTextNode("“" + extract.text + "”"));
      extractsBlock.appendChild(block);
    });
  }

  function buildClaims() {
    clear(claimList);
    CLAIMS.forEach(function (claim, i) {
      var wrap = make("div", "claim");
      var id = "claim-" + i;
      var label = make("label", "claim__label", "“" + claim.text + "”");
      label.setAttribute("for", id);
      wrap.appendChild(label);
      var select = document.createElement("select");
      select.id = id;
      select.name = "claim";
      var blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "Choose a judgement";
      select.appendChild(blank);
      Object.keys(VERDICT_LABEL).forEach(function (key) {
        var option = document.createElement("option");
        option.value = key;
        option.textContent = VERDICT_LABEL[key];
        select.appendChild(option);
      });
      wrap.appendChild(select);
      claimList.appendChild(wrap);
    });
  }

  /* --- Rendering ------------------------------------------------------------ */

  function renderAccount() {
    var s = state();
    var account = accountFor(s);

    coherence.setAttribute("data-level", account.coherence);
    coherence.textContent =
      "Question and lens: " + account.coherence +
      (account.coherence === "strong" ? " match."
        : account.coherence === "workable" ? " together, with a cost."
        : " — they pull against each other.");

    clear(themes);
    account.themes.forEach(function (theme) {
      themes.appendChild(make("li", null, theme));
    });

    clear(foreground);
    PEOPLE.forEach(function (person, i) {
      var level = account.foreground[i];
      var row = make("div", "foreground__row");
      row.appendChild(make("div", "foreground__who", person));
      var meter = make("div", "foreground__meter");
      var track = make("span", "foreground__track");
      var fill = make("span", "foreground__fill");
      fill.style.width = (level / 2) * 100 + "%";
      track.appendChild(fill);
      meter.appendChild(track);
      meter.appendChild(make("span", "foreground__word", STANDING_WORD[level]));
      row.appendChild(meter);
      foreground.appendChild(row);
    });

    illuminates.textContent = "Illuminates: " + account.illuminates;
    obscures.textContent = "Leaves less visible: " + account.obscures;
    coherenceNote.textContent = account.coherenceNote;
    verdict.setAttribute("data-tone",
      account.coherence === "strong" ? "good"
        : account.coherence === "workable" ? "caution" : "warn");
  }

  function renderCompare() {
    if (!saved) {
      compareBlock.hidden = true;
      return;
    }
    var s = state();
    var current = accountFor(s);
    var savedAccount = accountFor(saved);

    clear(compareTable);
    [
      ["Research question", questionText(saved.question), questionText(s.question)],
      ["Theoretical sensitivity", lensText(saved.lens), lensText(s.lens)],
      ["Coherence", savedAccount.coherence, current.coherence],
      ["First theme", savedAccount.themes[0], current.themes[0]],
      ["Second theme", savedAccount.themes[1], current.themes[1]],
      ["Illuminates", savedAccount.illuminates, current.illuminates],
      ["Leaves less visible", savedAccount.obscures, current.obscures]
    ].forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row[0]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row[1]));
      tr.appendChild(make("td", null, row[2]));
      compareTable.appendChild(tr);
    });

    // Which participants change standing between the two accounts?
    var moved = [];
    PEOPLE.forEach(function (person, i) {
      var a = savedAccount.foreground[i];
      var b = current.foreground[i];
      if (a !== b) {
        moved.push(person + " moves from " + STANDING_WORD[a] + " to " +
          STANDING_WORD[b]);
      }
    });

    compareNote.textContent = moved.length
      ? "Nothing was added to or taken from the dataset. " + moved.join("; ") +
        ". Same six people, two studies."
      : "These two accounts draw on the six extracts in the same proportions, " +
        "which is worth noticing: the difference between them is in what they " +
        "claim rather than in what they read.";

    compareBlock.hidden = false;
  }

  function render() {
    renderAccount();
    renderCompare();
  }

  /* --- Buttons ---------------------------------------------------------------- */

  $('[data-action="save"]').addEventListener("click", function () {
    saved = state();
    render();
    shell.announce(
      "Account saved: " + questionText(saved.question) + " read through the " +
      lensText(saved.lens).toLowerCase() + " lens. Change the controls and " +
      "press Compare.", { immediate: true });
  });

  $('[data-action="compare"]').addEventListener("click", function () {
    if (!saved) {
      shell.announce(
        "Nothing saved yet. Press Save this account first, then change the " +
        "question or the lens and press Compare.", { immediate: true });
      return;
    }
    render();
    compareBlock.scrollIntoView({ block: "nearest" });
    shell.announce("The two accounts are now side by side beneath the account " +
      "card.", { immediate: true });
  });

  /* --- Accountability check ----------------------------------------------------- */

  accountForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var s = state();
    var selects = $$('select[name="claim"]', claimList);
    var missing = selects.filter(function (sel) { return !sel.value; }).length;

    clear(accountFeedback);
    accountFeedback.hidden = false;

    if (missing) {
      accountFeedback.setAttribute("data-tone", "caution");
      var p = make("p");
      p.appendChild(make("strong", "feedback__verdict", "Not yet. "));
      p.appendChild(document.createTextNode(
        "Judge all five claims first — " + missing + " still to go."));
      accountFeedback.appendChild(p);
      return;
    }

    var right = 0;
    var lead = make("p");
    var list = make("ul");
    CLAIMS.forEach(function (claim, i) {
      var truth = claim.verdict(s);
      var chosen = selects[i].value;
      if (chosen === truth) { right += 1; }
      var li = make("li");
      li.appendChild(make("strong", null,
        "“" + claim.text + "” — " +
        (chosen === truth
          ? "you said " + VERDICT_LABEL[truth].toLowerCase() + ", and so does the tool. "
          : "you said " + VERDICT_LABEL[chosen].toLowerCase() +
            "; the tool would say " + VERDICT_LABEL[truth].toLowerCase() + ". ")));
      li.appendChild(document.createTextNode(claim.note(s)));
      list.appendChild(li);
    });

    accountFeedback.setAttribute("data-tone",
      right === CLAIMS.length ? "good" : right >= 3 ? "caution" : "warn");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of " + CLAIMS.length + " match, judged under the " +
      lensText(s.lens).toLowerCase() + " lens. "));
    lead.appendChild(document.createTextNode(
      "Two of these fail under every reading in this tool, one holds under " +
      "every reading, one is over-stated whatever lens you use, and one " +
      "genuinely depends on the lens. Switch to a different lens and check " +
      "again to see which."));
    accountFeedback.appendChild(lead);
    accountFeedback.appendChild(list);
    shell.announce(right + " of " + CLAIMS.length + " match under the current lens.",
      { immediate: true });
  });

  /* --- Opening prediction --------------------------------------------------------- */

  var OPENING = {
    one: {
      tone: "caution",
      verdict: "Possible, and not what different themes by themselves show.",
      text:
        "An analysis can certainly be bad: unsupported by the extracts, " +
        "incoherent with its own question, or silently importing claims the " +
        "data cannot pay for. You will see all three below. But two accounts " +
        "can be answerable to the same six extracts, in different ways, " +
        "because they were built to answer different questions."
    },
    questions: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Each account is answerable to its own question and its own stated " +
        "position, and both are answerable to the data. That is a demanding " +
        "standard rather than a permissive one, which is what the " +
        "accountability check at the foot of this page is for."
    },
    anything: {
      tone: "warn",
      verdict: "The misreading this tool exists to correct.",
      text:
        "Two of the nine pairings below do not hold together, and the tool " +
        "says which and why. Two of the five claims in the accountability " +
        "check fail under every reading available. Rejecting a single correct " +
        "analysis is not the same as accepting all of them."
    },
    combine: {
      tone: "caution",
      verdict: "Tempting, and it usually produces a worse paper.",
      text:
        "Merging two accounts built on different assumptions gives you a set " +
        "of themes with no organising position behind them, which is how a " +
        "results section ends up as a list. Accounts of this kind are not " +
        "estimates of the same quantity to be averaged; they answer different " +
        "questions and are better read against each other than blended."
    }
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
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

  function openLab() {
    labSection.hidden = false;
    accountSection.hidden = false;
    render();
    $("#lab-heading").focus();
    shell.announce("Builder unlocked. " + accountFor(state()).coherenceNote,
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the builder.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openLab();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openLab();
  });

  /* --- Reset ------------------------------------------------------------------------ */

  shell.onReset(function () {
    saved = null;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    accountSection.hidden = true;
    accountFeedback.hidden = true;
    compareBlock.hidden = true;
    buildChoices(questionList, QUESTIONS, "question", DEFAULTS.question);
    buildChoices(lensList, LENSES, "lens", DEFAULTS.lens);
    buildClaims();
    buildExtracts();
    render();
  });

  /* --- Start-up --------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the builder.",
    { immediate: true });
})();
