/* =========================================================================
   Thematic Analysis Coding Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/05-thematic-analysis-coding-lab/

   TEACHING JOB
   ------------
   Coding is an analytic act, not an extraction. Two competent analysts
   produce different codes for the same words, and that is the expected case.

   WHY THERE IS NO ANSWER KEY, carried over in full
   ------------------------------------------------
   The activity:

     * never marks a code right or wrong;
     * never computes agreement between codings, and says on the page why
       inter-rater agreement is not the criterion for this method;
     * presents THREE defensible passes rather than one correct one, each with
       a written account of what it brings forward and what it pushes out of
       view;
     * echoes the learner's own code back without evaluating it.

   The three passes are semantic (staying close to what is said), latent
   (reading for what the speaker is doing) and critical (reading for the
   setting that makes this sayable). They are three positions on a continuum,
   chosen to make the range visible.

   WHAT WAS REDUCED
   ----------------
   Six extracts to one. The code bank is dropped: it is a second teaching job
   about what each candidate code commits you to, and offering a list to pick
   from before the learner has written their own would undercut the point. The
   reflexive prompt is reduced to one line inside the feedback rather than a
   separate stage with its own options. The select-all challenge is gone.

   Anything typed stays in the tab. There is no storage, no network request,
   and nothing is scored or inferred about the person using the activity.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) { return; }

  var EXTRACT = {
    speaker: "Ama, second year. Invented extract.",
    text: "I did think about emailing the tutor, but then you sort of think, " +
      "everyone else seems to have got it, so you'd be the one putting your " +
      "hand up saying I'm the one who hasn't. So I left it. And then it was " +
      "too late to ask, because by then you should have asked three weeks ago."
  };

  var PASSES = [
    {
      name: "Staying close to what is said",
      level: "Semantic",
      codes: [
        "Thinking about emailing the tutor",
        "Everyone else appears to understand",
        "Deciding not to ask",
        "Missing the window to ask"
      ],
      fore: "The sequence of events, in Ama's own terms. Anyone could check these against the extract in seconds.",
      back: "Why any of it happened. A semantic pass gives you a reliable inventory and no argument."
    },
    {
      name: "Reading for what the speaker is doing",
      level: "Latent",
      codes: [
        "Asking as self-exposure",
        "Managing how one appears to the group",
        "Retrospectively justifying not asking",
        "Moving into “you” where the discomfort is"
      ],
      fore: "The social risk in a request for information, and the work Ama does to make the decision sound reasonable afterwards.",
      back: "The possibility that this is simply about a busy week. Latent coding finds meaning, and the price is that it rarely fails to find any."
    },
    {
      name: "Reading for the setting that makes this sayable",
      level: "Critical",
      codes: [
        "An unwritten expiry date on being confused",
        "Comprehension as a public performance",
        "Help routed through an act of self-identification",
        "Silence as the low-cost option the system rewards"
      ],
      fore: "The course, not the student. On this reading the interesting object is a teaching arrangement in which asking costs something and not asking costs nothing until it is too late.",
      back: "Ama as a person with a particular history. The critical pass can explain the pattern and lose the individual account it came from."
    }
  ];

  var REFLEXIVE = "Look back at what you wrote. Did your code name something " +
    "about Ama, or something about the course? Both are defensible readings " +
    "and they send an analysis in different directions. Whichever you chose, " +
    "you supplied it: the extract does not say which one it is about.";

  var speaker = document.getElementById("speaker");
  var extract = document.getElementById("extract");
  var codeInput = document.getElementById("code");
  var entry = document.getElementById("entry");
  var reveal = document.getElementById("reveal");
  var passes = document.getElementById("passes");
  var passGrid = document.getElementById("pass-grid");
  var submit = document.getElementById("submit");
  var stepLabel = document.getElementById("step-label");

  speaker.textContent = EXTRACT.speaker;
  extract.textContent = EXTRACT.text;

  submit.addEventListener("click", function () {
    var written = codeInput.value.trim();

    /* The learner's code is echoed, never evaluated. An empty box is not an
       error either: someone who wants to read the three passes first is
       allowed to. */
    reveal.textContent = "";
    var line = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = written ? "Your code" : "You did not write one";
    line.appendChild(strong);
    reveal.appendChild(line);

    if (written) {
      var quoted = document.createElement("p");
      quoted.className = "casebox";
      quoted.textContent = written;
      reveal.appendChild(quoted);
    }

    var note = document.createElement("p");
    note.className = "small";
    note.textContent = written
      ? "That is your code. It is not compared with anything, and nothing " +
        "here can tell you whether it is a good one: that is a judgement you " +
        "make with a supervisor, against a research question."
      : "The three passes are below. It is worth writing something first, " +
        "even a few words, because reading three readings before making one " +
        "is a different exercise.";
    reveal.appendChild(note);

    var reflexive = document.createElement("p");
    reflexive.className = "small";
    reflexive.textContent = REFLEXIVE;
    reveal.appendChild(reflexive);

    wb.show(reveal);
    renderPasses();
    wb.show(passes);
    wb.hide(entry);
    wb.hide(submit);
    stepLabel.textContent = "Three readings";
    wb.show("#synthesis");
    wb.scrollTo("#reveal", { focus: true });
    wb.announce("Your code is recorded on the page. Three other readings are below.");
  });

  function renderPasses() {
    passGrid.textContent = "";
    PASSES.forEach(function (pass) {
      var block = document.createElement("div");
      block.className = "block";

      var heading = document.createElement("h3");
      heading.textContent = pass.level;
      block.appendChild(heading);

      var sub = document.createElement("p");
      sub.className = "small";
      sub.textContent = pass.name;
      block.appendChild(sub);

      var list = document.createElement("ul");
      pass.codes.forEach(function (code) {
        var li = document.createElement("li");
        li.textContent = code;
        list.appendChild(li);
      });
      block.appendChild(list);

      block.appendChild(mini("Brings forward", pass.fore));
      block.appendChild(mini("Pushes out of view", pass.back));
      passGrid.appendChild(block);
    });
  }

  function mini(title, body) {
    var box = document.createElement("div");
    box.className = title === "Brings forward" ? "mini" : "mini mini--limit";
    box.style.setProperty("margin-top", "0.75rem");
    var strong = document.createElement("strong");
    strong.textContent = title;
    var p = document.createElement("p");
    p.textContent = body;
    box.appendChild(strong);
    box.appendChild(p);
    return box;
  }

  wb.onReset(function () {
    codeInput.value = "";
    wb.show(entry);
    wb.show(submit);
    wb.hide(reveal);
    wb.hide(passes);
    wb.hide("#synthesis");
    stepLabel.textContent = "Your code";
  });
})();
