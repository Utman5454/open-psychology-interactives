/* =========================================================================
   Open Psychology Interactives — product layer: lesson player
   -------------------------------------------------------------------------
   lessons/index.html#l=<encoded lesson>      a lesson carried in the link
   lessons/index.html?lesson=<id>             a curated lesson from data/lessons/

   What a student sees: the lesson title and introduction, then the steps
   one at a time, with a list of steps to move between them. An activity
   step embeds the activity's own page in a frame (with ?embed=1 so the
   site chrome is hidden) and shows the lecturer's instructions beside it.
   A question step takes an answer. The last step lists every answer with
   controls to download or copy them.

   Answers live in memory only. Nothing is sent anywhere, and the page says
   so. Every step's panel is created once and kept in the document, so an
   activity a student has started keeps its state when they move on and
   come back; the frame's page is loaded only when its step is first shown.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};
  var doc = global.document;

  var FRAME_PADDING_PX = 24;
  var ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

  function el(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function markdown(text) {
    var node = el("div", "notes");
    node.innerHTML = OPI.renderMarkdown(text, { shift: 2 });
    return node;
  }

  /* --------------------------------------------------------------- load */

  function loadLesson() {
    var hash = global.location.hash || "";
    var match = hash.match(/^#l=(.+)$/);
    if (match) { return OPI.decodeLesson(decodeURIComponent(match[1])); }

    var id = new global.URLSearchParams(global.location.search).get("lesson") || "";
    if (!ID_RE.test(id)) { return Promise.reject(new Error("no-lesson")); }
    return OPI.fetchText("data/lessons/" + id + ".json").then(function (text) {
      var lesson = OPI.normaliseLesson(JSON.parse(text));
      var problems = OPI.validateLesson(lesson);
      if (problems.length) { throw new Error(problems.join(" ")); }
      return lesson;
    });
  }

  /* -------------------------------------------------------------- player */

  function Player(root, lesson, catalogue) {
    this.root = root;
    this.lesson = lesson;
    this.catalogue = catalogue;
    this.answers = {};
    this.current = 0;
    this.panels = [];
    this.q = function (selector) { return root.querySelector(selector); };
    this.frames = [];
  }

  Player.prototype.stepTitle = function (step, index) {
    if (step.type === "activity") {
      var activity = this.activityFor(step);
      return activity ? activity.title : "Activity";
    }
    if (step.type === "note") { return "Read this"; }
    return "Question " + this.questionNumber(index);
  };

  Player.prototype.questionNumber = function (index) {
    var n = 0;
    for (var i = 0; i <= index; i += 1) {
      if (this.lesson.steps[i].type === "question") { n += 1; }
    }
    return n;
  };

  Player.prototype.activityFor = function (step) {
    return this.catalogue.byKey[OPI.activityKey(step.edition, step.module, step.tool)] || null;
  };

  /* Panels: intro, one per step, answers. */

  Player.prototype.buildPanels = function () {
    var self = this;
    var stage = this.q("[data-player-stage]");
    var names = [];

    this.panels.push(this.introPanel());
    names.push("Introduction");
    this.lesson.steps.forEach(function (step, index) {
      self.panels.push(self.stepPanel(step, index));
      names.push(self.stepTitle(step, index));
    });
    this.panels.push(this.answersPanel());
    names.push("Your answers");

    this.panels.forEach(function (panel, index) {
      panel.hidden = index !== 0;
      panel.setAttribute("data-panel", String(index));
      stage.appendChild(panel);
    });
    this.names = names;
  };

  Player.prototype.panel = function (heading) {
    var section = el("section", "player__panel");
    var h2 = el("h2", null, heading);
    h2.tabIndex = -1;
    section.appendChild(h2);
    return section;
  };

  Player.prototype.introPanel = function () {
    var section = this.panel(this.lesson.title);
    if (this.lesson.author) { section.appendChild(el("p", "text-muted", "From " + this.lesson.author)); }
    if (this.lesson.intro) { section.appendChild(markdown(this.lesson.intro)); }
    var count = this.lesson.steps.length;
    section.appendChild(el("p", "text-muted", count + " step" + (count === 1 ? "" : "s") +
      ". Your answers stay in this browser and are not sent anywhere; you can download or copy them at the end."));
    return section;
  };

  Player.prototype.stepPanel = function (step, index) {
    if (step.type === "activity") { return this.activityPanel(step, index); }
    if (step.type === "note") {
      var note = this.panel("Read this");
      note.appendChild(markdown(step.text));
      return note;
    }
    return this.questionPanel(step, index);
  };

  Player.prototype.activityPanel = function (step, index) {
    var self = this;
    var activity = this.activityFor(step);
    var section = this.panel(activity ? activity.title : "Activity");
    if (!activity) {
      section.appendChild(el("p", "status-message",
        "This step points at an activity that is not in the catalogue (" + step.edition + " / " +
        step.module + " / " + step.tool + "). Move on to the next step."));
      return section;
    }
    section.appendChild(el("p", "text-muted", activity.module + " · " + OPI.EDITIONS[activity.edition].label +
      " · about " + activity.minutes + " minutes"));
    if (step.instructions) {
      var box = el("div", "player__instructions");
      box.appendChild(el("p", "step__label", "What to do"));
      box.appendChild(markdown(step.instructions));
      section.appendChild(box);
    }
    var wrap = el("div", "player__frame-wrap");
    var frame = el("iframe", "player__frame");
    frame.title = activity.title + " (activity)";
    frame.setAttribute("data-src", OPI.fromSiteRoot(activity.path) + "?embed=1");
    frame.setAttribute("allow", "fullscreen");
    wrap.appendChild(frame);
    section.appendChild(wrap);
    var note = el("p", "player__frame-note");
    var open = el("a", null, "Open this activity in its own tab");
    open.href = OPI.fromSiteRoot(activity.path);
    open.target = "_blank";
    open.rel = "noopener";
    note.appendChild(open);
    note.appendChild(doc.createTextNode(" if the frame is awkward on your screen."));
    section.appendChild(note);
    this.frames.push({ frame: frame, index: index + 1 });
    global.setTimeout(function () { self.sizeFrameFromMessages(); }, 0);
    return section;
  };

  Player.prototype.questionPanel = function (step, index) {
    var self = this;
    var n = this.questionNumber(index);
    var section = this.panel("Question " + n);
    var field = el("div", "builder__field");
    var label = el("label");
    label.htmlFor = "answer-" + index;
    label.appendChild(markdown(step.prompt));
    var input = el(step.kind === "short" ? "input" : "textarea", "field");
    input.id = label.htmlFor;
    if (step.kind === "short") { input.type = "text"; input.autocomplete = "off"; } else { input.rows = 6; }
    input.addEventListener("input", function () {
      self.answers[index] = input.value;
      self.updateNavMarks();
    });
    field.appendChild(label);
    field.appendChild(input);
    section.appendChild(field);
    section.appendChild(el("p", "builder__hint", "Your answer stays on this page until you download or copy it at the end."));
    return section;
  };

  Player.prototype.answersPanel = function () {
    var self = this;
    var section = this.panel("Your answers");
    section.appendChild(el("p", null, "Everything you wrote, in order. Nothing has been sent anywhere: download or copy it to keep it or hand it in."));
    var list = el("ul", "answers");
    list.setAttribute("data-player-answers", "");
    section.appendChild(list);
    var actions = el("div", "activity-actions");
    var download = el("button", "button button--primary", "Download my answers");
    download.type = "button";
    download.addEventListener("click", function () { self.downloadAnswers(); });
    var copy = el("button", "button button--secondary", "Copy my answers");
    copy.type = "button";
    copy.addEventListener("click", function () { self.copyAnswers(); });
    actions.appendChild(download);
    actions.appendChild(copy);
    section.appendChild(actions);
    return section;
  };

  Player.prototype.answersText = function () {
    var self = this;
    var lines = ["Lesson: " + this.lesson.title, "Date: " + new Date().toISOString().slice(0, 10), ""];
    this.lesson.steps.forEach(function (step, index) {
      if (step.type !== "question") { return; }
      lines.push("Question " + self.questionNumber(index) + ": " + step.prompt);
      lines.push("Answer: " + (self.answers[index] || "(no answer)"));
      lines.push("");
    });
    return lines.join("\n");
  };

  Player.prototype.renderAnswers = function () {
    var self = this;
    var list = this.q("[data-player-answers]");
    list.textContent = "";
    var any = false;
    this.lesson.steps.forEach(function (step, index) {
      if (step.type !== "question") { return; }
      any = true;
      var item = el("li");
      item.appendChild(el("p", "answers__prompt", "Question " + self.questionNumber(index) + ": " + step.prompt));
      item.appendChild(el("p", "answers__text", self.answers[index] || "(no answer yet)"));
      list.appendChild(item);
    });
    if (!any) { list.appendChild(el("li", null, "This lesson has no written questions.")); }
  };

  Player.prototype.downloadAnswers = function () {
    var blob = new global.Blob([this.answersText()], { type: "text/plain" });
    var anchor = el("a");
    anchor.href = global.URL.createObjectURL(blob);
    anchor.download = "my-answers.txt";
    doc.body.appendChild(anchor);
    anchor.click();
    doc.body.removeChild(anchor);
    global.setTimeout(function () { global.URL.revokeObjectURL(anchor.href); }, 1000);
    this.announce("Answers downloaded.");
  };

  Player.prototype.copyAnswers = function () {
    var self = this;
    var text = this.answersText();
    var done = function () { self.announce("Answers copied."); };
    var fallback = function () {
      var area = el("textarea", "field");
      area.value = text;
      area.rows = 8;
      area.readOnly = true;
      self.q("[data-player-answers]").parentNode.appendChild(area);
      area.focus();
      area.select();
      self.announce("Select the text and copy it with your keyboard.");
    };
    if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
      global.navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
  };

  /* ---------------------------------------------------------- navigation */

  Player.prototype.buildNav = function () {
    var self = this;
    var list = this.q("[data-player-nav]");
    list.textContent = "";
    this.names.forEach(function (name, index) {
      var item = el("li");
      var b = el("button", "player__step-button");
      b.type = "button";
      b.appendChild(el("span", null, (index + 1) + ". " + name));
      b.appendChild(el("span", "done"));
      b.addEventListener("click", function () { self.show(index); });
      item.appendChild(b);
      list.appendChild(item);
    });
    this.q("[data-player-prev]").addEventListener("click", function () { self.show(self.current - 1); });
    this.q("[data-player-next]").addEventListener("click", function () { self.show(self.current + 1); });
  };

  Player.prototype.updateNavMarks = function () {
    var self = this;
    var buttons = this.q("[data-player-nav]").querySelectorAll("button");
    this.lesson.steps.forEach(function (step, index) {
      if (step.type !== "question") { return; }
      var mark = buttons[index + 1].querySelector(".done");
      mark.textContent = self.answers[index] ? "answered" : "";
    });
  };

  Player.prototype.show = function (index) {
    var self = this;
    if (index < 0 || index >= this.panels.length) { return; }
    this.current = index;
    this.panels.forEach(function (panel, i) { panel.hidden = i !== index; });
    var buttons = this.q("[data-player-nav]").querySelectorAll("button");
    Array.prototype.forEach.call(buttons, function (b, i) {
      if (i === index) { b.setAttribute("aria-current", "step"); } else { b.removeAttribute("aria-current"); }
    });
    this.q("[data-player-prev]").disabled = index === 0;
    this.q("[data-player-next]").disabled = index === this.panels.length - 1;
    this.q("[data-player-progress]").textContent = "Step " + (index + 1) + " of " + this.panels.length;

    // Load an activity's frame the first time its step is shown.
    var frame = this.panels[index].querySelector("iframe[data-src]");
    if (frame) { frame.src = frame.getAttribute("data-src"); frame.removeAttribute("data-src"); }
    if (index === this.panels.length - 1) { this.renderAnswers(); }

    this.announce("Step " + (index + 1) + " of " + this.panels.length + ": " + this.names[index]);
    var heading = this.panels[index].querySelector("h2");
    global.setTimeout(function () { heading.focus(); }, 0);
    self.updateNavMarks();
  };

  Player.prototype.announce = function (text) {
    this.q("[data-player-live]").textContent = text;
  };

  Player.prototype.sizeFrameFromMessages = function () {
    if (this.listening) { return; }
    this.listening = true;
    var self = this;
    global.addEventListener("message", function (event) {
      var data = event.data;
      if (!data || data.type !== "opi:height" || typeof data.height !== "number") { return; }
      self.frames.forEach(function (entry) {
        if (entry.frame.contentWindow === event.source) {
          entry.frame.style.height = Math.max(320, Math.round(data.height) + FRAME_PADDING_PX) + "px";
        }
      });
    });
  };

  Player.prototype.start = function () {
    doc.title = this.lesson.title + " — Open Psychology Interactives";
    this.q("[data-player-title]").textContent = this.lesson.title;
    this.buildPanels();
    this.buildNav();
    this.q("[data-player]").hidden = false;
    this.show(0);
  };

  /* --------------------------------------------------------------- start */

  function showMessage(root, text) {
    var message = root.querySelector("[data-player-message]");
    message.hidden = false;
    message.textContent = text;
  }

  function start() {
    var root = doc.querySelector("[data-player-root]");
    if (!root) { return; }
    Promise.all([loadLesson(), OPI.loadCatalogues()]).then(function (results) {
      new Player(root, results[0], results[1]).start();
    }).catch(function (error) {
      if (error && error.message === "no-lesson") {
        showMessage(root, "No lesson is open. A lesson link looks like this page's address followed by #l=… ; ask whoever set the work for the link, or build your own from the library.");
        return;
      }
      showMessage(root, "This lesson could not be opened. " + (error && error.message ? error.message : ""));
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
