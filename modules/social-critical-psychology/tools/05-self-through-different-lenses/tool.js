/* =========================================================================
   The Self Through Different Lenses
   -------------------------------------------------------------------------
   Nine fictional statements by one person, and seven frameworks for the self.
   Choosing a framework re-weights the nine statements on a shared evidence
   board; the learner then has to work out which of four accounts belongs to
   the framework they chose. All four accounts are real accounts - three of them
   simply belong to other lenses on the list, which is what makes the task
   application rather than recognition.

   THE EDUCATIONAL MODEL
   ---------------------
   Every framework carries, for each of the nine statements, one of three
   codings:

       central   the framework's concepts apply directly and it is the kind of
                 thing the framework was built to explain
       usable    the framework can do something with it, indirectly
       none      the framework has no concept that represents it

   The codings are authored judgements made for teaching, and the tool says so.
   The point they are arranged to make is structural rather than particular:

     * statement 8 (the fees went up and the hours were cut) is coded `none` by
       six of the seven frameworks and only `usable` by the seventh;
     * statement 9 (the tutor's remark about "people from your background") is
       coded differently by frameworks that treat it as information about Nadia
       and frameworks that treat it as information about the course.

   There is no correct lens and no hidden fact about Nadia. What the tool marks
   is whether the learner matched an account to the framework that generated it.

   WHAT THIS IS NOT
   ----------------
   Not an assessment: nothing is asked about the person using the tool and no
   score is produced for anyone. Not a complete map of the literature: narrative,
   dialogical, psychodynamic, cultural and neurocognitive accounts are all
   absent. "Backgrounds it" never means "denies it" - the claim is about what a
   framework's concepts can represent, not about what its users believe.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var STATEMENTS = [
    { id: 1, text: "\"I've always been the practical one at home. It's just what I am.\"" },
    { id: 2, text: "\"Everyone on the course seems to find the maths obvious. I'm the slowest in the room.\"" },
    { id: 3, text: "\"I should be further on than this by now.\"" },
    { id: 4, text: "\"If it works out I'll be designing bridges. If it doesn't I'll be exactly where I am, and that frightens me.\"" },
    { id: 5, text: "\"I can fix anything mechanical. Put a spreadsheet in front of me and I freeze.\"" },
    { id: 6, text: "\"At the shop I'm one of the regulars. On the course I'm the one who came from a trade.\"" },
    { id: 7, text: "\"I'm different with my sister than with anyone else. Calmer. I don't know which one is the real me.\"" },
    { id: 8, text: "\"The fees went up in September and my hours got cut the same month.\"" },
    { id: 9, text: "\"My tutor said people from my background often struggle with the theory.\"" }
  ];

  /* c = central, u = usable, n = no concept for it. Indexed by statement id. */
  var LENSES = [
    {
      id: "schema",
      name: "Self-schema",
      question: "How is her self-knowledge organised, and in which domains is it well developed?",
      central: "What she takes herself to be like, and where that is settled",
      backgrounds: "Everything that is about other people or about circumstances",
      coding: { 1: "c", 2: "n", 3: "u", 4: "u", 5: "c", 6: "u", 7: "u", 8: "n", 9: "u" },
      account:
        "Nadia has a well-developed and long-standing schema for practical " +
        "competence, organised around mechanical work, and no comparable " +
        "structure for formal or numerical work - which is why the spreadsheet " +
        "produces not difficulty but a kind of blankness. Information that fits " +
        "the practical schema is processed quickly and remembered; information " +
        "about the theory has nowhere to attach.",
      note:
        "Precise about two of the nine statements and silent about the other " +
        "seven. Nothing in the framework represents who else is in the room."
    },
    {
      id: "comparison",
      name: "Social comparison",
      question: "Against whom is she comparing herself, and in which direction?",
      central: "Her standing relative to a chosen set of other people",
      backgrounds: "Anything about her that does not involve a comparison target",
      coding: { 1: "n", 2: "c", 3: "u", 4: "n", 5: "u", 6: "c", 7: "n", 8: "n", 9: "u" },
      account:
        "Nadia is making upward comparisons on a dimension she has recently " +
        "started to care about, against a group she has just joined and did not " +
        "choose. In the shop she is a comparison target for other people; on the " +
        "course she is at the bottom of a distribution whose top she can see. " +
        "The comparison set changed in September and her judgement of herself " +
        "changed with it.",
      note:
        "Requires other people to be specified before anything can be said, " +
        "which is a real strength. It has no way of representing why this " +
        "particular comparison set became the relevant one."
    },
    {
      id: "discrepancy",
      name: "Self-discrepancy",
      question: "What is the gap between who she is, who she wants to be and who she thinks she ought to be?",
      central: "The distance between an actual self and a standard",
      backgrounds: "Where the standard came from, and who set it",
      coding: { 1: "u", 2: "u", 3: "c", 4: "c", 5: "u", 6: "n", 7: "n", 8: "n", 9: "n" },
      account:
        "There is a live discrepancy between Nadia's actual self and an ought " +
        "self - \"further on by now\" - and a second one between her actual self " +
        "and an ideal she can describe in some detail. The framework predicts " +
        "that the two gaps will not feel the same: the ought discrepancy " +
        "should produce agitation, the ideal discrepancy something closer to " +
        "flatness.",
      note:
        "Sharp about the structure of a gap. Completely silent about where the " +
        "standard came from, which is arguably the more interesting question."
    },
    {
      id: "possible",
      name: "Possible selves",
      question: "What does she expect to become, hope to become, and fear becoming?",
      central: "Imagined future selves and how vivid each one is",
      backgrounds: "The present, except as a starting point",
      coding: { 1: "u", 2: "n", 3: "u", 4: "c", 5: "u", 6: "n", 7: "n", 8: "u", 9: "u" },
      account:
        "Nadia holds a detailed hoped-for self and an unusually vivid feared " +
        "self, and the feared one is not a fantasy of disaster but a precise " +
        "picture of staying exactly where she is. On this account the feared " +
        "self is doing most of the motivational work, and it will keep doing it " +
        "only while the hoped-for self stays specific enough to act on.",
      note:
        "The one framework on the board with anywhere at all to put the fees, " +
        "because a change in circumstances can make a possible self more or " +
        "less believable. It reaches it only through her expectations."
    },
    {
      id: "efficacy",
      name: "Self-efficacy",
      question: "What does she believe she can do, in which specific situations?",
      central: "Domain-specific beliefs about capability",
      backgrounds: "Global self-evaluation, and everything social except as a source of information",
      coding: { 1: "u", 2: "u", 3: "n", 4: "u", 5: "c", 6: "n", 7: "n", 8: "n", 9: "c" },
      account:
        "Nadia's efficacy beliefs are strongly domain-specific: high and " +
        "well-founded for mechanical work, low for anything formal or numerical. " +
        "The framework predicts that the mastery experience of getting one " +
        "piece of theory right would move the second belief more than any amount " +
        "of encouragement, and that her tutor's remark is a verbal persuasion " +
        "effect pointing the wrong way.",
      note:
        "Deliberately not a theory of global self-worth, which is its main " +
        "advantage over the constructs it replaced. It has no term for the " +
        "structure that made her hours available to be cut."
    },
    {
      id: "identity",
      name: "Social identity",
      question: "Which groups is she placing herself in, and which is she being placed in?",
      central: "Group memberships and their relative standing",
      backgrounds: "Anything about her that is not shared with a group",
      coding: { 1: "u", 2: "u", 3: "n", 4: "n", 5: "n", 6: "c", 7: "u", 8: "n", 9: "c" },
      account:
        "Nadia moves between two settings in which entirely different group " +
        "memberships are salient, and in one of them her category is assigned " +
        "rather than chosen - \"the one who came from a trade\" is not a " +
        "self-description. The tutor's remark makes that category relevant to " +
        "performance - a change in the situation, not in Nadia - and her sense " +
        "of herself should shift with whichever membership is salient.",
      note:
        "The framework that comes closest to putting something outside her into " +
        "the account - and it does so by representing it as a perceived group " +
        "membership rather than as a course fee."
    },
    {
      id: "relational",
      name: "Relational and contextual",
      question: "Who is she with, and is there a self that is not with anybody?",
      central: "Variation across relationships, and what that variation means",
      backgrounds: "Any single summary of what she is like",
      coding: { 1: "u", 2: "u", 3: "n", 4: "n", 5: "u", 6: "c", 7: "c", 8: "u", 9: "u" },
      account:
        "The question Nadia is asking - which one is the real me - is on this " +
        "account the wrong question rather than an unanswered one. She is not " +
        "one self appearing in different lighting; she is differently " +
        "constituted with her sister, at the shop and on the course. What " +
        "varies is not a mask but the relation.",
      note:
        "The only framework here that disagrees about what a self is rather " +
        "than about which part of it to study. It buys that at the cost of " +
        "being hard to measure and harder to fund."
    }
  ];

  var CODING_LABEL = {
    c: "central to this framework",
    u: "usable, indirectly",
    n: "no concept for it"
  };

  /* =======================================================================
     Challenge
     ===================================================================== */

  var CLAIMS = [
    {
      id: "mastery",
      text:
        "\"Getting one piece of theory right on her own would change her " +
        "expectations more than a term of encouragement would.\"",
      answer: "efficacy",
      why:
        "Mastery experience as the strongest source of efficacy belief, and " +
        "verbal persuasion as the weakest. It is a specific, testable ordering " +
        "that belongs to this framework and to no other on the board."
    },
    {
      id: "salience",
      text:
        "\"Her sense of herself on Tuesday evening depends on which of her " +
        "group memberships the room has made relevant.\"",
      answer: "identity",
      why:
        "Salience of a group membership as the thing that varies, with the " +
        "person held constant. Note that this is a claim about the room, " +
        "expressed as a claim about her - which is exactly the move the " +
        "framework is built on."
    },
    {
      id: "ought",
      text:
        "\"The agitation she describes comes from a gap between where she is " +
        "and where she believes she is obliged to be.\"",
      answer: "discrepancy",
      why:
        "Actual-ought discrepancy, and the specific prediction that it produces " +
        "agitation rather than dejection. The framework does not ask who " +
        "imposed the obligation, which is where a critical reader would start."
    },
    {
      id: "fees",
      text:
        "\"Her difficulties this term follow from a fee increase and a cut in " +
        "her hours, and would be resolved by reversing either.\"",
      answer: "none",
      why:
        "No framework on this board can support it. Six of the seven mark that " +
        "statement as something they have no concept for, and the seventh can " +
        "only reach it as a change in how believable a future self is. The " +
        "claim may well be true. The vocabulary in use cannot express it, so " +
        "instruments built from it will not collect the evidence that would " +
        "test it."
    },
    {
      id: "realself",
      text:
        "\"The calmer version she describes with her sister is her real self, " +
        "and the other versions are performances.\"",
      answer: "none",
      why:
        "It is not the relational account, which treats the question as badly " +
        "formed rather than answering it in this direction. It is not the " +
        "schema or identity account either, both of which would describe " +
        "variation without ranking one version as authentic. The sentence is a " +
        "piece of everyday folk psychology, and its authority comes from being " +
        "familiar rather than from any framework here."
    }
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

  function lensById(id) {
    return LENSES.filter(function (lens) { return lens.id === id; })[0] || null;
  }

  function statementById(id) {
    return STATEMENTS.filter(function (s) { return s.id === id; })[0];
  }

  /* Deterministic shuffle so the four candidate accounts appear in a stable
     order for a given lens, and the correct one is not always first. */
  function candidatesFor(lensId) {
    var others = LENSES.filter(function (lens) { return lens.id !== lensId; });
    var index = LENSES.map(function (l) { return l.id; }).indexOf(lensId);
    var picks = [others[index % others.length],
      others[(index + 2) % others.length],
      others[(index + 4) % others.length]];
    var unique = [];
    picks.forEach(function (lens) {
      if (unique.indexOf(lens) === -1) { unique.push(lens); }
    });
    var i = 0;
    while (unique.length < 3) {
      if (unique.indexOf(others[i]) === -1) { unique.push(others[i]); }
      i += 1;
    }
    var all = unique.concat([lensById(lensId)]);
    // Rotate so the correct account is not always last.
    var offset = index % 4;
    return all.slice(offset).concat(all.slice(0, offset));
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#lens-board");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var statementList = $("[data-statements]");
  var lensChoices = $("[data-lens-choices]");
  var accountBlock = $("[data-account-block]");
  var accountPrompt = $("[data-account-prompt]");
  var accountChoices = $("[data-account-choices]");
  var board = $("[data-board]");
  var lensFeedback = $("[data-lens-feedback]");
  var accountResult = $("[data-account-result]");
  var accountBody = $("[data-account-body]");
  var comparison = $("[data-comparison]");
  var comparisonBody = $("[data-comparison-body]");
  var synthesis = $("[data-synthesis]");
  var goalText = $("[data-goal-text]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var INITIAL = { unlocked: false, lens: null, pick: null, applied: {} };
  var state = null;

  /* --- Static material ------------------------------------------------------ */

  function buildStatements() {
    clear(statementList);
    STATEMENTS.forEach(function (statement) {
      var item = make("li", "statement");
      item.appendChild(make("p", "statement__text", statement.text));
      statementList.appendChild(item);
    });
  }

  function buildLensChoices() {
    clear(lensChoices);
    LENSES.forEach(function (lens) {
      var label = make("label", "lens-option");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "lens";
      input.value = lens.id;
      input.addEventListener("change", function () {
        state.lens = lens.id;
        state.pick = null;
        buildAccountChoices();
        render();
        shell.announce(lens.name + " selected. It asks: " + lens.question,
          { immediate: true });
      });
      label.appendChild(input);
      var body = make("span", "lens-option__body");
      body.appendChild(make("span", "lens-option__name", lens.name));
      body.appendChild(make("span", "lens-option__question", lens.question));
      label.appendChild(body);
      lensChoices.appendChild(label);
    });
  }

  function buildAccountChoices() {
    clear(accountChoices);
    if (!state.lens) { return; }
    var lens = lensById(state.lens);
    accountPrompt.textContent =
      "All four are genuine accounts of Nadia. Three of them belong to other " +
      "frameworks on the list. Which one was written from " +
      lens.name.toLowerCase() + " premises?";
    candidatesFor(state.lens).forEach(function (candidate) {
      var label = make("label", "control--choice account-option");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "account";
      input.value = candidate.id;
      input.addEventListener("change", function () {
        state.pick = candidate.id;
      });
      label.appendChild(input);
      label.appendChild(make("span", null, candidate.account));
      accountChoices.appendChild(label);
    });
  }

  /* --- The board ------------------------------------------------------------- */

  function renderBoard() {
    clear(board);
    var lens = state.lens ? lensById(state.lens) : null;
    STATEMENTS.forEach(function (statement) {
      var item = make("li", "board__item");
      var code = lens ? lens.coding[statement.id] : null;
      item.setAttribute("data-code", code || "none-selected");
      var mark = make("span", "board__mark",
        code === "c" ? "CENTRAL" : code === "u" ? "usable" : code === "n" ? "no concept" : "-");
      item.appendChild(mark);
      item.appendChild(make("span", "board__text",
        statement.id + ". " + statement.text));
      board.appendChild(item);
    });
  }

  function renderLensFeedback() {
    clear(lensFeedback);
    if (!state.lens) {
      var box = make("div", "verdict");
      box.setAttribute("data-tone", "neutral");
      box.appendChild(make("p", "verdict__body",
        "Choose a framework on the left. The nine statements stay exactly as " +
        "they are; what changes is which of them the framework has anything to " +
        "say about."));
      lensFeedback.appendChild(box);
      return;
    }
    var lens = lensById(state.lens);
    var counts = { c: 0, u: 0, n: 0 };
    STATEMENTS.forEach(function (statement) {
      counts[lens.coding[statement.id]] += 1;
    });
    var box2 = make("div", "verdict");
    box2.setAttribute("data-tone", counts.n >= 4 ? "caution" : "neutral");
    box2.appendChild(make("h5", "verdict__title", lens.name));
    box2.appendChild(make("p", "verdict__body", "It asks: " + lens.question));
    box2.appendChild(make("p", "verdict__body",
      counts.c + " of the nine statements are central to it, " + counts.u +
      " are usable indirectly, and " + counts.n +
      " are things it has no concept for."));
    lensFeedback.appendChild(box2);
  }

  /* --- Applying a lens -------------------------------------------------------- */

  function applyLens(revealed) {
    var lens = lensById(state.lens);
    state.applied[lens.id] = true;
    accountResult.hidden = false;
    clear(accountBody);
    accountBody.setAttribute("data-tone", revealed ? "neutral" : "good");
    accountBody.appendChild(make("h5", "verdict__title",
      "The " + lens.name.toLowerCase() + " account"));
    accountBody.appendChild(make("p", "verdict__body", lens.account));
    accountBody.appendChild(make("p", "verdict__body",
      "Makes central: " + lens.central + ". Backgrounds: " + lens.backgrounds + "."));
    accountBody.appendChild(make("p", "verdict__note", lens.note));
    render();
  }

  $('[data-action="check"]').addEventListener("click", function () {
    if (!state.lens) { return; }
    if (!state.pick) {
      shell.announce("Choose one of the four accounts first.", { immediate: true });
      return;
    }
    if (state.pick === state.lens) {
      applyLens(false);
      shell.announce("Correct. That is the " + lensById(state.lens).name.toLowerCase() +
        " account.", { immediate: true });
      return;
    }
    var picked = lensById(state.pick);
    var lens = lensById(state.lens);
    accountResult.hidden = false;
    clear(accountBody);
    accountBody.setAttribute("data-tone", "caution");
    accountBody.appendChild(make("h5", "verdict__title",
      "That is the " + picked.name.toLowerCase() + " account"));
    accountBody.appendChild(make("p", "verdict__body",
      "It is not a wrong account of Nadia - it is a good one, written from " +
      "different premises. It asks: " + picked.question + " Notice which " +
      "statements it leans on: " + centralList(picked) + "."));
    accountBody.appendChild(make("p", "verdict__body",
      lens.name + " asks something else: " + lens.question +
      " Look at the board for the statements it marks as central - " +
      centralList(lens) + " - and try again."));
    shell.announce("Not that one. It is the " + picked.name.toLowerCase() +
      " account. Try again.", { immediate: true });
  });

  $('[data-action="reveal"]').addEventListener("click", function () {
    if (!state.lens) { return; }
    applyLens(true);
    shell.announce("Account revealed for " + lensById(state.lens).name.toLowerCase() + ".",
      { immediate: true });
  });

  function centralList(lens) {
    var ids = STATEMENTS.filter(function (statement) {
      return lens.coding[statement.id] === "c";
    }).map(function (statement) { return statement.id; });
    return "statement" + (ids.length === 1 ? " " : "s ") + ids.join(" and ");
  }

  /* --- Comparison and synthesis ------------------------------------------------ */

  function renderComparison() {
    var applied = LENSES.filter(function (lens) { return state.applied[lens.id]; });
    if (!applied.length) {
      comparison.hidden = true;
      return;
    }
    comparison.hidden = false;
    clear(comparisonBody);
    applied.forEach(function (lens) {
      var row = make("tr");
      var th = make("th", null, lens.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, lens.question));
      row.appendChild(make("td", null, lens.central));
      row.appendChild(make("td", null, lens.backgrounds));
      comparisonBody.appendChild(row);
    });

    clear(synthesis);
    synthesis.setAttribute("data-tone", applied.length >= 4 ? "warn" : "neutral");
    if (applied.length < 4) {
      synthesis.appendChild(make("p", "verdict__body",
        applied.length + " of 7 frameworks applied. Run at least four before " +
        "reading the synthesis - the interesting pattern is in what they have " +
        "in common, and three is not enough to see it."));
      return;
    }

    /* Which statements has every applied lens marked as central at least once,
       and which has none of them been able to use? */
    var neverCentral = STATEMENTS.filter(function (statement) {
      return applied.every(function (lens) {
        return lens.coding[statement.id] !== "c";
      });
    });
    var noneAtAll = STATEMENTS.filter(function (statement) {
      return applied.every(function (lens) {
        return lens.coding[statement.id] === "n";
      });
    });

    synthesis.appendChild(make("h5", "verdict__title",
      "After " + applied.length + " frameworks"));
    synthesis.appendChild(make("p", "verdict__body",
      neverCentral.length
        ? "No framework you have applied treats " +
          neverCentral.map(function (s) { return "statement " + s.id; }).join(", ") +
          " as central."
        : "Between them, the frameworks you have applied make every statement " +
          "central to at least one of them - which is what a full toolkit looks " +
          "like, and is not the same as an account of Nadia."));
    if (noneAtAll.length) {
      synthesis.appendChild(make("p", "verdict__body",
        "Stronger than that: " +
        noneAtAll.map(function (s) { return "statement " + s.id; }).join(" and ") +
        " " + (noneAtAll.length === 1 ? "is" : "are") + " marked \"no concept " +
        "for it\" by every framework you have applied."));
    }

    /* Statement 8 is reported explicitly whatever else happens: it is the
       structural point the whole board is arranged around. */
    var blindToFees = applied.filter(function (lens) {
      return lens.coding[8] === "n";
    }).length;
    var centralToFees = applied.filter(function (lens) {
      return lens.coding[8] === "c";
    }).length;
    synthesis.appendChild(make("p", "verdict__body",
      "Statement 8 - the fees rising and the hours being cut - is marked \"no " +
      "concept for it\" by " + blindToFees + " of your " + applied.length +
      " frameworks" +
      (centralToFees
        ? " and central to " + centralToFees + "."
        : ", and central to none of them. The rest can reach it only " +
          "indirectly, as a change in how believable a future self is or as " +
          "context. It is not that these researchers think money is " +
          "irrelevant; it is that a framework whose object of study sits " +
          "inside a person has no term in which to write a rota down - and " +
          "the instruments built from such frameworks will not collect it.")));
    synthesis.appendChild(make("p", "verdict__note",
      "Nothing here identifies a best framework, and no fact about Nadia was " +
      "written down for one of them to be right about. What the comparison " +
      "shows is that choosing a question is also choosing what will not be " +
      "asked."));
  }

  function renderGoal() {
    var applied = Object.keys(state.applied).length;
    clear(goalText);
    var list = make("ul", "goal__checks");
    [
      { label: "Choose a framework", detail: state.lens ? lensById(state.lens).name : "not yet", met: Boolean(state.lens) },
      { label: "Apply at least four", detail: applied + " of 7", met: applied >= 4 }
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
    accountBlock.hidden = !state.lens;
    if (state.lens && state.applied[state.lens]) {
      accountResult.hidden = false;
    }
    renderBoard();
    renderLensFeedback();
    renderComparison();
    renderGoal();
  }

  /* --- Challenge ---------------------------------------------------------------- */

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        (index + 1) + ". " + claim.text));
      LENSES.forEach(function (lens) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "claim-" + claim.id;
        input.value = lens.id;
        label.appendChild(input);
        label.appendChild(make("span", null, lens.name));
        group.appendChild(label);
      });
      var none = make("label", "control--choice");
      var noneInput = document.createElement("input");
      noneInput.type = "radio";
      noneInput.name = "claim-" + claim.id;
      noneInput.value = "none";
      none.appendChild(noneInput);
      none.appendChild(make("span", null, "No framework on the board"));
      group.appendChild(none);
      claimsList.appendChild(group);
    });
  }

  function labelFor(value) {
    return value === "none" ? "no framework on the board" : lensById(value).name.toLowerCase();
  }

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One answer per item, please.",
        "A blank is not a judgement.");
      return;
    }
    var right = 0;
    CLAIMS.forEach(function (claim, index) {
      if (answers[index] === claim.answer) { right += 1; }
    });
    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 5 match."));
    lead.appendChild(document.createTextNode(
      " The two \"no framework\" items are the ones worth arguing about."));
    claimsFeedback.appendChild(lead);
    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === claim.answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        (index + 1) + ": " + labelFor(claim.answer) + "."));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + labelFor(answers[index]) + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, claim.why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Five items judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------------- */

  var OPENING = {
    agree: {
      tone: "caution",
      verdict: "They are not translations of one another.",
      text:
        "Two of the seven do not agree that the self is the kind of thing that " +
        "sits inside one person, and one of them treats Nadia's own question - " +
        "which is the real me - as badly formed rather than unanswered."
    },
    compete: {
      tone: "caution",
      verdict: "That is the framing the board is built to unsettle.",
      text:
        "\"Fits better\" needs a criterion, and the criterion would have to " +
        "come from one of the frameworks. What you will see instead is each of " +
        "them making two or three statements central and most of the rest " +
        "unusable, which is not a contest anybody can win."
    },
    question: {
      tone: "good",
      verdict: "That is the argument of the board.",
      text:
        "Watch the coding beside each statement change as you switch " +
        "framework. Nothing about Nadia moves. What moves is which of her " +
        "sentences the framework has a concept for."
    },
    level: {
      tone: "good",
      verdict: "True of two of the seven, and worth watching for.",
      text:
        "Social identity and the relational account both require other people " +
        "before anything can be said, and the relational one goes further. But " +
        "notice how far even those two are from being able to use the sentence " +
        "about the fees."
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
    shell.announce("Lens board open. Choose a framework to begin.",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the lens board.";
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

  /* --- Worked example ------------------------------------------------------------- */

  $('[data-action="worked"]').addEventListener("click", function () {
    ["schema", "comparison", "efficacy", "identity", "relational"].forEach(function (id) {
      state.applied[id] = true;
    });
    state.lens = "relational";
    state.pick = "relational";
    var input = $$('input[name="lens"]').filter(function (node) {
      return node.value === "relational";
    })[0];
    if (input) { input.checked = true; }
    buildAccountChoices();
    applyLens(true);
    shell.announce(
      "Worked example: five frameworks applied, ending on the relational " +
      "account. Read the synthesis under the comparison table.",
      { immediate: true });
  });

  /* --- Reset and start-up ---------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    accountResult.hidden = true;
    accountBlock.hidden = true;
    claimsForm.reset();
    claimsFeedback.hidden = true;
    $$('input[name="lens"]').forEach(function (input) { input.checked = false; });
    clear(accountChoices);
    render();
  });

  buildStatements();
  buildLensChoices();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Read the nine statements, then answer the question above.",
    { immediate: true });
})();
