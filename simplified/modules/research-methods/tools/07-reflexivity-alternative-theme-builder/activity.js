/* =========================================================================
   Reflexivity and Alternative Themes — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/07-reflexivity-alternative-theme-builder/

   TEACHING JOB
   ------------
   The account follows from the question and the position it was read from,
   and a mismatch between the two is visible from outside.

   WHAT THE ACTIVITY IS DOING
   --------------------------
   It is NOT analysing anything. Four accounts were written in advance, one
   per pairing, each with its themes, a map of which extracts sit at the
   centre and which recede, what the reading illuminates and what it leaves
   less visible. Selecting a pairing selects a prepared account. No software
   analyses qualitative data, and pretending otherwise would teach the
   opposite of this module's argument. The page says so.

   COHERENCE IS THE STANDARD ON DISPLAY
   ------------------------------------
       strong     the question asks about the kind of object the lens is built
                  to see
       strained   the question asks about one kind of object and the lens is
                  built to see another, so the account answers a question
                  nobody asked

   The 2 by 2 is chosen so that the two strong pairings sit on one diagonal
   and the two strained ones on the other. That is what refutes "anything
   goes" without appealing to the analyst's skill: the mismatch is visible
   from outside, and both strained accounts are competent.

   WHAT WAS REDUCED
   ----------------
   Three questions by three lenses to two by two, dropping the
   social-psychological lens and the "what makes asking costly" question. The
   accountability check, five claims tested against the current reading, is a
   second teaching job about what a reading entitles you to say, and stays in
   the longer version along with the save-and-compare feature.

   The extracts are invented. Nothing is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var PEOPLE = ["Ama", "Jonah", "Priya", "Kwame", "Lena", "Toby"];

  /* The source material, shown before the controls. It is there to be read,
     not worked on: without it the prepared accounts are assertions about
     evidence the learner cannot see. Trimmed to one or two sentences each. */
  var EXTRACTS = [
    ["Ama, second year",
     "“Everyone else seems to have got it, so you'd be the one putting your hand up saying I'm the one who hasn't. And then it was too late to ask.”"],
    ["Jonah, first year",
     "“There's a form. You fill in the form and someone emails you back with a link to a page you already read. I filled it in twice.”"],
    ["Priya, third year",
     "“My flatmate asked for an extension and got one, so I asked. It felt like knowing the trick. Nobody tells you the trick.”"],
    ["Kwame, second year",
     "“There's a version of me they've got in their heads and I'd rather it stayed the one who's fine.”"],
    ["Lena, first year",
     "“I asked in the seminar and she just answered it, no fuss. It's just the first one that costs something.”"],
    ["Toby, mature student",
     "“I've worked in an office for eleven years. You ask, someone tells you, that's the job. Here it's like admitting something.”"]
  ];

  var QUESTION_FULL = {
    moment: "How do students experience the moment of deciding whether to ask for help?",
    category: "How is “the student who needs help” produced as a category, and by whom?"
  };

  var LENS_FULL = {
    experiential: "The accounts are treated as reports of what it was like for these people, and the analysis stays with their terms.",
    critical: "The accounts are treated as traces of arrangements and categories that were in place before anyone spoke."
  };
  var STANDING = ["at the margins", "supporting", "central"];

  var ACCOUNTS = {
    "moment/experiential": {
      coherence: "strong",
      coherenceNote: "The question asks what the moment was like; the lens is built to stay with what things were like. Question and position are asking after the same kind of object.",
      themes: [
        "The pause before asking: a decision made privately and quickly, and revisited afterwards",
        "Learning after the fact that the cost was anticipated rather than incurred"
      ],
      foreground: [2, 1, 1, 2, 2, 1],
      illuminates: "The texture of the decision itself: Ama's swift calculation, Kwame's preference for the version of himself that is fine, Lena's discovery afterwards that the feared thing did not happen. This reading takes the participants' own terms seriously and produces an account they would recognise.",
      obscures: "Everything that was in place before the moment. Jonah's form and Priya's flatmate become background detail rather than the subject, and the analysis has nothing to say about why the moment felt like that for so many different people."
    },
    "moment/critical": {
      coherence: "strained",
      coherenceNote: "This pairing pulls against itself. The question asks how the moment is experienced; the lens is built to look past the person at the arrangements. The account below is not incompetent. It is answering a question nobody asked, and a reader would notice within a paragraph.",
      themes: [
        "Individual hesitation as the visible end of an institutional arrangement",
        "The moment of deciding as a place where a policy is enforced without anyone enforcing it"
      ],
      foreground: [1, 2, 2, 1, 0, 2],
      illuminates: "Some real things: that the moment has conditions, that those conditions were designed, and that the same moment is easier for Toby because he has been somewhere else.",
      obscures: "The moment itself, which is what was asked about. The account keeps arriving at the arrangements and passing through the experience on the way, and a reader looking for what deciding felt like will not find it here."
    },
    "category/critical": {
      coherence: "strong",
      coherenceNote: "The question asks how a category is produced and by whom; the lens is built to trace exactly that. The strongest match here, and the one most obliged to show its working.",
      themes: [
        "A category constituted by the machinery that offers to help: to receive support you must first become the kind of person who needs it",
        "Deficit as an available identity, avoided by those who can afford to avoid it"
      ],
      foreground: [1, 2, 2, 2, 0, 2],
      illuminates: "How the category gets made and kept: through forms that require self-identification, procedures learnt informally, and staff impressions that persist. Toby's comparison is decisive here, because it shows the category is not a property of asking but of asking in this place.",
      obscures: "Lena entirely, and the participants' own agency generally. It also rests heavily on one atypical participant, which the write-up would have to declare rather than bury."
    },
    "category/experiential": {
      coherence: "strained",
      coherenceNote: "The second pairing that pulls against itself. The question asks how a category is produced, which is a question about discourse and institutions, and the lens answers with how individuals felt. The account below quietly changes the question into how it feels to be in that category, which is a fine question and not this one.",
      themes: [
        "Not wanting to be that kind of student",
        "The relief of not having been seen as one"
      ],
      foreground: [1, 0, 0, 2, 2, 1],
      illuminates: "How the category is inhabited: Kwame's careful management of an impression, Ama's reluctance to be the one who has not understood. Both are real and both are about the experience of a category rather than about its production.",
      obscures: "Everything the question asked for. Who maintains the category, what administrative machinery gives it consequences, and how it comes to be available to be avoided are all outside what this lens looks at. The word “produced” in the question is doing work the analysis never picks up."
    }
  };

  var COHERENCE_WORD = {
    strong: "Coherent pairing",
    strained: "This pairing pulls against itself"
  };

  var questionSelect = document.getElementById("question");
  var lensSelect = document.getElementById("lens");
  var coherenceTag = document.getElementById("coherence");
  var coherenceNote = document.getElementById("coherence-note");
  var themesList = document.getElementById("themes");
  var standingList = document.getElementById("standing");
  var tradeoff = document.getElementById("tradeoff");
  var explain = document.getElementById("explain");

  var extractsList = document.getElementById("extracts");
  var questionFull = document.getElementById("question-full");
  var lensFull = document.getElementById("lens-full");

  var seen = {};

  EXTRACTS.forEach(function (pair) {
    var li = document.createElement("li");
    li.className = "evidence";
    var who = document.createElement("strong");
    who.textContent = pair[0];
    var said = document.createElement("span");
    said.textContent = pair[1];
    li.appendChild(who);
    li.appendChild(said);
    extractsList.appendChild(li);
  });

  function key() {
    return questionSelect.value + "/" + lensSelect.value;
  }

  function render(announce) {
    var account = ACCOUNTS[key()];
    seen[key()] = true;

    questionFull.textContent = QUESTION_FULL[questionSelect.value];
    lensFull.textContent = LENS_FULL[lensSelect.value];

    coherenceTag.textContent = COHERENCE_WORD[account.coherence];
    coherenceNote.textContent = account.coherenceNote;

    themesList.textContent = "";
    account.themes.forEach(function (theme) {
      var li = document.createElement("li");
      li.textContent = theme;
      themesList.appendChild(li);
    });

    /* The standing word is written out, so nothing depends on reading a
       colour or a bar length. */
    standingList.textContent = "";
    PEOPLE.forEach(function (person, index) {
      var li = document.createElement("li");
      li.className = "chip";
      li.textContent = person + ": " + STANDING[account.foreground[index]];
      standingList.appendChild(li);
    });

    tradeoff.textContent = "";
    tradeoff.appendChild(mini("What this reading illuminates", account.illuminates, false));
    tradeoff.appendChild(mini("What it leaves less visible", account.obscures, true));

    /* Unlocked once both diagonals have been seen: the point is the contrast
       between a coherent pairing and a strained one, not any single account. */
    var strongSeen = Object.keys(seen).some(function (k) { return ACCOUNTS[k].coherence === "strong"; });
    var strainedSeen = Object.keys(seen).some(function (k) { return ACCOUNTS[k].coherence === "strained"; });
    if (strongSeen && strainedSeen) { explain.disabled = false; }

    if (announce) {
      wb.announce(
        COHERENCE_WORD[account.coherence] + ". " +
        account.themes.length + " themes, and " +
        PEOPLE.filter(function (_, i) { return account.foreground[i] === 2; }).length +
        " of the six extracts central to this reading."
      );
    }
  }

  function mini(title, body, isLimit) {
    var box = document.createElement("div");
    box.className = isLimit ? "mini mini--limit" : "mini";
    var strong = document.createElement("strong");
    strong.textContent = title;
    var p = document.createElement("p");
    p.textContent = body;
    box.appendChild(strong);
    box.appendChild(p);
    return box;
  }

  questionSelect.addEventListener("change", function () { render(true); });
  lensSelect.addEventListener("change", function () { render(true); });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    seen = {};
    questionSelect.value = "moment";
    lensSelect.value = "experiential";
    explain.disabled = true;
    wb.hide("#synthesis");
    render(false);
  });

  render(false);
})();
