/* =========================================================================
   Theme or Topic?
   -------------------------------------------------------------------------
   Three clusters of coded extracts from the same invented dataset used by the
   Thematic Analysis Coding Laboratory and the Reflexivity and Alternative
   Theme Builder in this module. Each cluster carries four candidate
   statements, and the learner sorts them into four categories:

       topic      names the subject matter; a reader learns what the extracts
                  are ABOUT and nothing about what was found
       staging    a true, supported, descriptive sentence - a legitimate stage
                  in an analysis and not yet a theme, because nothing in it
                  explains why these extracts belong together
       theme      an analytic claim organised around one central concept, which
                  the extracts illustrate rather than merely fall under
       overreach  a statement the data cannot carry, for a stated reason

   The three over-reaching candidates fail in three different ways on purpose:
   one asserts a cause an interview study cannot establish, one attributes an
   intention to an institution nobody interviewed, and one imports a
   psychological construct together with a between-person comparison that
   qualitative data are not built to deliver.

   WHAT THIS DOES NOT CLAIM
   ------------------------
   Four categories is a teaching simplification: real candidate themes sit on a
   continuum, and several of these could be argued into a neighbouring category
   by a good supervisor in ten minutes. The developed theme offered for each
   cluster is defensible, not uniquely correct - other themes built around other
   organising concepts would also work.

   The extracts are invented for teaching. No participant, interview,
   institution or study is represented. No data leave the browser: there is no
   storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CATEGORY = {
    topic: "Topic summary — names the subject matter",
    staging: "A useful staging post — true and supported, not yet a theme",
    theme: "A developed theme — an analytic claim with one organising concept",
    overreach: "Beyond what these data can carry"
  };

  var CATEGORY_SHORT = {
    topic: "a topic summary",
    staging: "a useful staging post",
    theme: "a developed theme",
    overreach: "beyond what these data can carry"
  };

  /* =======================================================================
     The three clusters
     ===================================================================== */

  var CLUSTERS = [
    {
      short: "First question",
      name: "Extracts about asking, or not asking, in front of other people",
      codes:
        "Codes in this cluster: asking as self-exposure; comparing self with " +
        "others; deciding not to ask; a cost paid only by the first person to " +
        "ask; silence maintained collectively.",
      quotes: [
        "Ama: \"you'd be the one putting your hand up saying I'm the one who hasn't\"",
        "Lena: \"afterwards two people said they'd wanted to ask the same thing … it's just the first one that costs something\""
      ],
      candidates: [
        {
          text: "Asking for help",
          answer: "topic",
          note:
            "A subject heading. It tells a reader what these extracts are " +
            "about and nothing about what was found in them. Every extract in " +
            "the whole dataset would fit under it, which is the giveaway: a " +
            "label that nothing can fail to belong to is not organising " +
            "anything."
        },
        {
          text:
            "Students feel anxious about asking questions in seminars",
          answer: "staging",
          note:
            "True, supported, and the one most people call a theme. Ask what " +
            "it explains. It reports a shared feeling without saying what " +
            "produces it, or why Lena's experience of asking was fine. No " +
            "single concept is holding the extracts together - only a common " +
            "mood."
        },
        {
          text:
            "Visibility is the price: the first question turns a private gap " +
            "in understanding into a public one, and it is paid by whoever " +
            "speaks first",
          answer: "theme",
          note:
            "A developed theme. One organising concept - visibility - " +
            "explains Ama's decision not to ask, Lena's description of the " +
            "first question as the expensive one, and the two silent students. " +
            "It makes a claim you could disagree with, and it says nothing " +
            "about anxiety, so it survives the fact that Lena was not anxious."
        },
        {
          text: "Seminar silence is caused by student anxiety",
          answer: "overreach",
          note:
            "Two problems. First, it asserts a cause, and interview accounts " +
            "given afterwards cannot establish what produced a silence. " +
            "Second, the data contradict it: Lena reports two people who " +
            "wanted to ask and did not, and gives no indication that either " +
            "was anxious."
        }
      ]
    },

    {
      short: "Knowing the rules",
      name: "Extracts about finding out how the system works",
      codes:
        "Codes in this cluster: rules distributed through networks rather than " +
        "published; needing a precedent before acting; help as a ticketing " +
        "process; being returned to what you already had; an unwritten expiry " +
        "date on being confused.",
      quotes: [
        "Priya: \"It felt like knowing the trick. Nobody tells you the trick.\"",
        "Jonah: \"someone emails you back with a link to a page you already read\""
      ],
      candidates: [
        {
          text: "Institutional processes",
          answer: "topic",
          note:
            "A noun phrase naming a domain. It would serve as a folder name " +
            "and cannot appear as a finding: nothing in it could be true or " +
            "false. Results sections whose headings are all nouns are usually " +
            "reports of what was talked about."
        },
        {
          text:
            "Getting help depends on already knowing how getting help works, so " +
            "the system quietly rewards those who arrive knowing",
          answer: "theme",
          note:
            "A developed theme. The organising concept is prior knowledge as a " +
            "condition of access, and it does real work: it explains why " +
            "Priya needed a flatmate's precedent, why Jonah's technically " +
            "correct reply was useless, and why neither of them is describing " +
            "a rule that was broken. The claim is arguable, which is what " +
            "makes it a claim."
        },
        {
          text: "Students find university procedures confusing",
          answer: "staging",
          note:
            "Accurate and inert. Confusing to whom, about what, and with what " +
            "consequence? It could head a section containing almost anything, " +
            "and it makes the problem a property of the students' " +
            "understanding rather than of how the information is distributed. " +
            "A reasonable label at the stage where you are still finding out " +
            "what you have."
        },
        {
          text:
            "The university deliberately hides its procedures in order to " +
            "reduce demand on services",
          answer: "overreach",
          note:
            "This attributes an intention to an organisation, and nobody from " +
            "the organisation was interviewed. The extracts support a claim " +
            "about effects - information travels through networks, replies " +
            "discharge rather than help - and nothing whatever about anyone's " +
            "purposes. Describing how a system works and asserting that " +
            "somebody designed it that way are different claims."
        }
      ]
    },

    {
      short: "What kind of student",
      name: "Extracts about how asking is read by others",
      codes:
        "Codes in this cluster: managing an impression held by staff; " +
        "help-seeking as an admission; asking recoded as confession by the " +
        "setting; being continuously assessed as a kind of person; asking as " +
        "routine somewhere else.",
      quotes: [
        "Kwame: \"there's a version of me they've got in their heads and I'd rather it stayed the one who's fine\"",
        "Toby: \"You ask, someone tells you, that's the job. Here it's like admitting something.\""
      ],
      candidates: [
        {
          text: "Identity",
          answer: "topic",
          note:
            "One word, and a large literature's worth of ambiguity. It marks " +
            "where the extracts were filed. As a heading it obliges the reader " +
            "to work out what was found, which is the analyst's job."
        },
        {
          text:
            "Mature students find university culture different from the " +
            "workplaces they have come from",
          answer: "staging",
          note:
            "True of Toby, supported by his own words, and it does two things " +
            "a theme should not: it rests on one participant, and it makes the " +
            "finding about a category of student rather than about what the " +
            "setting does. Toby's value was that his comparison makes a norm " +
            "visible. This turns him into a demographic."
        },
        {
          text:
            "Asking for help is read as a claim about what kind of student you " +
            "are, so the cost of asking is paid in identity rather than in time",
          answer: "theme",
          note:
            "A developed theme. The organising concept is that a request for " +
            "information is received as a statement about the person making " +
            "it. It covers Kwame protecting the version of himself staff hold, " +
            "Toby noticing that the same act means something different here, " +
            "and Ama's reluctance to be the one who has not understood - and " +
            "the final clause makes it sharp enough to be wrong."
        },
        {
          text:
            "Students with lower self-esteem are less likely to seek support",
          answer: "overreach",
          note:
            "Two things at once, both outside what these data can deliver. It " +
            "imports a construct nobody measured, and it makes a " +
            "between-person comparison from six accounts collected without " +
            "any such comparison in mind."
        }
      ]
    }
  ];

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

  var shell = InteractiveShell.attach("#themeortopic");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var candidateList = $("[data-candidate-list]");
  var clusterLabel = $("[data-cluster-label]");
  var clusterName = $("[data-cluster-name]");
  var clusterCodes = $("[data-cluster-codes]");
  var clusterQuotes = $("[data-cluster-quotes]");
  var clusterFeedback = $("[data-cluster-feedback]");
  var detail = $("[data-detail]");
  var detailBody = $("[data-detail-body]");
  var stageTrack = $("[data-stage-track]");

  var checkButton = $('[data-action="check"]');
  var nextButton = $('[data-action="next"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");
  var rewriteForm = $("#rewrite-form");
  var rewriteFeedback = $("[data-rewrite-feedback]");

  var index = 0;
  var done = [];
  var LETTERS = ["A", "B", "C", "D"];

  function current() { return CLUSTERS[index]; }

  /* --- Building the candidate controls ------------------------------------ */

  function buildCandidates() {
    clear(candidateList);
    current().candidates.forEach(function (candidate, i) {
      var wrap = make("div", "candidate");
      var id = "cand-" + index + "-" + i;
      var label = make("label", "candidate__label");
      label.setAttribute("for", id);
      label.appendChild(make("span", "candidate__tag", "Candidate " + LETTERS[i]));
      label.appendChild(document.createTextNode("“" + candidate.text + "”"));
      wrap.appendChild(label);
      var select = document.createElement("select");
      select.id = id;
      select.name = "candidate";
      var blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "Choose a classification";
      select.appendChild(blank);
      Object.keys(CATEGORY).forEach(function (key) {
        var option = document.createElement("option");
        option.value = key;
        option.textContent = CATEGORY[key];
        select.appendChild(option);
      });
      wrap.appendChild(select);
      candidateList.appendChild(wrap);
    });
  }

  /* --- Stage track ---------------------------------------------------------- */

  function renderTrack() {
    clear(stageTrack);
    CLUSTERS.forEach(function (item, i) {
      var li = make("li");
      li.appendChild(make("span", null, String(i + 1) + "."));
      li.appendChild(document.createTextNode(" " + item.short));
      if (done[i]) {
        li.setAttribute("data-state", "done");
        li.appendChild(make("span", "visually-hidden", " (checked)"));
      }
      if (i === index) {
        li.setAttribute("aria-current", "step");
        li.appendChild(make("span", "visually-hidden", " (current)"));
      }
      stageTrack.appendChild(li);
    });
  }

  /* --- Showing a cluster ----------------------------------------------------- */

  function showCluster(i) {
    index = i;
    clusterLabel.textContent = "Cluster " + (i + 1) + " of " + CLUSTERS.length;
    clusterName.textContent = current().name;
    clusterCodes.textContent = current().codes;
    clear(clusterQuotes);
    current().quotes.forEach(function (quote) {
      clusterQuotes.appendChild(make("li", null, quote));
    });
    buildCandidates();
    clusterFeedback.hidden = true;
    detail.hidden = true;
    nextButton.textContent =
      i === CLUSTERS.length - 1 ? "Back to cluster 1" : "Next cluster";
    renderTrack();
  }

  /* --- Checking --------------------------------------------------------------- */

  function check() {
    var selects = $$('select[name="candidate"]', candidateList);
    var missing = selects.filter(function (s) { return !s.value; }).length;

    clear(clusterFeedback);
    clusterFeedback.hidden = false;

    if (missing) {
      clusterFeedback.setAttribute("data-tone", "caution");
      var p = make("p");
      p.appendChild(make("strong", "feedback__verdict", "Not yet. "));
      p.appendChild(document.createTextNode(
        "Classify all four candidates first — " + missing + " still to go."));
      clusterFeedback.appendChild(p);
      detail.hidden = true;
      shell.announce(missing + " candidates still unclassified.",
        { immediate: true });
      return;
    }

    var right = 0;
    clear(detailBody);
    current().candidates.forEach(function (candidate, i) {
      var chosen = selects[i].value;
      var correct = chosen === candidate.answer;
      if (correct) { right += 1; }
      var block = make("div", "part");
      block.setAttribute("data-standing", correct ? "right" : "wrong");
      var head = make("p", "part__head");
      head.appendChild(document.createTextNode(
        "Candidate " + LETTERS[i] + ": “" + candidate.text + "”"));
      head.appendChild(make("span", "part__standing",
        correct
          ? "you said " + CATEGORY_SHORT[candidate.answer] +
            " — the tool agrees"
          : "you said " + CATEGORY_SHORT[chosen] + "; the tool would call it " +
            CATEGORY_SHORT[candidate.answer]));
      block.appendChild(head);
      block.appendChild(make("p", "part__body", candidate.note));
      detailBody.appendChild(block);
    });

    clusterFeedback.setAttribute("data-tone",
      right === 4 ? "good" : right >= 2 ? "caution" : "warn");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 4 match the tool's reading. "));
    lead.appendChild(document.createTextNode(
      "Read every note. The distinction between the staging post and the " +
      "developed theme is the one worth arguing about, and a supervisor might " +
      "argue it the other way."));
    clusterFeedback.appendChild(lead);
    detail.hidden = false;
    done[index] = true;
    renderTrack();
    shell.announce(right + " of 4 match. Notes are below the cluster.",
      { immediate: true });
  }

  checkButton.addEventListener("click", check);

  nextButton.addEventListener("click", function () {
    showCluster((index + 1) % CLUSTERS.length);
    shell.announce("Cluster " + (index + 1) + " of " + CLUSTERS.length + ": " +
      current().name, { immediate: true });
  });

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    frequency: {
      tone: "caution",
      verdict: "Prevalence is not what makes a theme.",
      text:
        "A theme is not the thing most people mentioned. It is a patterned " +
        "meaning the analyst has developed, and it can rest on two extracts " +
        "that show the same concept from different angles while a topic " +
        "mentioned by everyone yields nothing. Counting mentions is a habit " +
        "imported from a different kind of analysis."
    },
    abstract: {
      tone: "caution",
      verdict: "Necessary, not sufficient, and easy to fake.",
      text:
        "Abstraction alone gives you \"identity\" and \"institutional " +
        "processes\", both of which appear below as topic summaries. Raising " +
        "the level of a noun does not produce a claim. Three candidates in " +
        "this tool are highly abstract and still say nothing."
    },
    claim: {
      tone: "good",
      verdict: "Yes.",
      text:
        "A theme is organised around one central concept, makes a claim about " +
        "what is going on, and treats the extracts as illustrations of that " +
        "claim rather than as members of a category. The practical test is " +
        "whether a reader could disagree with it. Nobody can disagree with " +
        "\"asking for help\"."
    },
    length: {
      tone: "caution",
      verdict: "Grammar is not the criterion.",
      text:
        "\"Students find university procedures confusing\" is a full sentence " +
        "and appears below as a staging post rather than a theme. A noun " +
        "phrase with a colon after it can carry an argument perfectly well. " +
        "What matters is whether one idea is doing the organising."
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
    showCluster(0);
    $("#lab-heading").focus();
    shell.announce("Challenge unlocked. Cluster 1 of " + CLUSTERS.length + ".",
      { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the challenge.";
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

  /* --- Rewrite challenge --------------------------------------------------------- */

  var REWRITE_NOTES = {
    channels: {
      works: false,
      text:
        "Still a topic, now with more words. \"Communication channels between " +
        "students and staff\" names a domain and could head a section " +
        "containing anything at all."
    },
    answered: {
      works: true,
      text:
        "Works. The organising concept is the gap between a request being " +
        "processed and a person being reached, and it explains the template " +
        "reply, the unread link and Jonah's decision not to open the second " +
        "one. It is arguable, which is the point."
    },
    poor: {
      works: false,
      text:
        "An evaluation rather than an analysis. It says the communication was " +
        "bad without saying what it was, how it failed, or for whom. It also " +
        "closes the question: once communication is simply poor there is " +
        "nothing left to analyse."
    },
    who: {
      works: true,
      text:
        "Works, and takes the section somewhere different. The organising " +
        "concept is information as a form of access, which explains the " +
        "flatmate route and makes the template reply a symptom of the same " +
        "arrangement. Note that this and the previous option are two " +
        "different themes for the same extracts - both defensible, and they " +
        "would produce different papers."
    },
    frustration: {
      works: false,
      text:
        "A topic with an emotion attached. It reports how students felt " +
        "without saying what produced the feeling or what the extracts have " +
        "in common beyond it. This is the most common shape of a weak theme " +
        "in student work, because it sounds like a finding."
    }
  };

  rewriteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="rewrite"]:checked', rewriteForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(rewriteFeedback, "caution", "Select at least one rewrite.",
        "Two of the five give the section a central organising concept.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !REWRITE_NOTES[v].works; });
    var rightMissed = Object.keys(REWRITE_NOTES).filter(function (v) {
      return REWRITE_NOTES[v].works && chosen.indexOf(v) === -1;
    });

    var tone = wrongPicked.length ? "caution" : rightMissed.length ? "caution" : "good";
    var verdictText = wrongPicked.length
      ? "At least one of these renames the topic rather than organising it."
      : rightMissed.length
        ? "What you chose does work; there is a second that does."
        : "Yes — the two that carry an organising concept, and none of the three that do not.";

    clear(rewriteFeedback);
    rewriteFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " The two that work are different themes for the same extracts, and " +
      "choosing between them is an analytic decision rather than a matter of " +
      "which is better written."));
    rewriteFeedback.appendChild(lead);
    var list = make("ul");
    Object.keys(REWRITE_NOTES).forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(REWRITE_NOTES[value].text));
      list.appendChild(li);
    });
    rewriteFeedback.appendChild(list);
    rewriteFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ---------------------------------------------------------------------- */

  shell.onReset(function () {
    done = [];
    index = 0;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    rewriteForm.reset();
    rewriteFeedback.hidden = true;
    showCluster(0);
  });

  /* --- Start-up -------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the question above to unlock the challenge.",
    { immediate: true });
})();
