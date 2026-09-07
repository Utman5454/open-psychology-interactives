/* =========================================================================
   Open Psychology Interactives — product layer: lesson builder
   -------------------------------------------------------------------------
   lessons/build.html. A lecturer composes a lesson (title, introduction,
   ordered steps: activities with instructions, notes, questions), previews
   it in the player, and takes away one student link. The lesson is held in
   memory, autosaved as a draft in this browser's localStorage, and encoded
   into the link by lesson.js. Nothing is sent anywhere.

   Everything is native controls: text fields, buttons for reorder (no
   dragging), a search box for adding activities. The step list is
   re-rendered on structural change only, so typing never loses focus, and
   focus is placed deliberately after a move or a removal.

   Markup contract: see lessons/build.html; hooks are data-builder-* and
   data-action attributes.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};
  var doc = global.document;

  var SAVE_DELAY_MS = 400;
  var LINK_WARN_LENGTH = 2000;
  var PICKER_MAX_RESULTS = 30;
  var STEP_LABELS = { activity: "Activity", note: "Note", question: "Question" };

  function el(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function button(label, className, action) {
    var node = el("button", className, label);
    node.type = "button";
    node.setAttribute("data-action", action);
    return node;
  }

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "lesson";
  }

  function tokens(text) {
    return String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1; });
  }

  /** 0 when a token is missing; otherwise higher for a match in the title. */
  function matchScore(activity, queryTokens) {
    var title = activity.title.toLowerCase();
    var rest = (activity.teachingJob + " " + activity.topics.join(" ") + " " +
      activity.summary + " " + activity.module).toLowerCase();
    var total = 1;
    for (var i = 0; i < queryTokens.length; i += 1) {
      if (title.indexOf(queryTokens[i]) !== -1) { total += 2; }
      else if (rest.indexOf(queryTokens[i]) !== -1) { total += 1; }
      else { return 0; }
    }
    return total;
  }

  /* --------------------------------------------------------------- state */

  function Builder(root, catalogue) {
    this.root = root;
    this.catalogue = catalogue;
    this.lesson = OPI.draft.load() || OPI.newLesson();
    this.saveTimer = null;
    this.q = function (selector) { return root.querySelector(selector); };
    this.status = this.q("[data-builder-status]");
    this.stepsList = this.q("[data-builder-steps]");
  }

  Builder.prototype.announce = function (text) {
    this.status.textContent = text;
  };

  Builder.prototype.changed = function (structural) {
    var self = this;
    global.clearTimeout(this.saveTimer);
    this.saveTimer = global.setTimeout(function () { self.persist(); }, SAVE_DELAY_MS);
    if (structural) { this.renderSteps(); }
  };

  Builder.prototype.persist = function () {
    var saved = OPI.draft.save(this.lesson);
    var when = new Date();
    var time = when.getHours() + ":" + String(when.getMinutes()).padStart(2, "0");
    this.q("[data-builder-draft]").textContent = saved
      ? "Draft saved in this browser at " + time + ". Nothing is sent anywhere."
      : "This browser is not allowing the draft to be saved; keep the lesson file or the link.";
    this.updateLink();
  };

  /* ---------------------------------------------------------- top fields */

  var TOP_FIELDS = { title: "#lesson-title", intro: "#lesson-intro", author: "#lesson-author" };

  /** Install the listeners for the three top fields. Called once, from
      start(); the handlers read this.lesson at event time, so replacing the
      lesson (open a file, clear the draft) needs only fillFields(). */
  Builder.prototype.bindFields = function () {
    var self = this;
    Object.keys(TOP_FIELDS).forEach(function (name) {
      var input = self.q(TOP_FIELDS[name]);
      input.maxLength = OPI.LESSON_LIMITS[name];
      input.addEventListener("input", function () {
        self.lesson[name] = input.value;
        self.changed(false);
      });
    });
  };

  /** Write the current lesson's top fields into the inputs. */
  Builder.prototype.fillFields = function () {
    var self = this;
    Object.keys(TOP_FIELDS).forEach(function (name) {
      self.q(TOP_FIELDS[name]).value = self.lesson[name] || "";
    });
  };

  /* --------------------------------------------------------------- steps */

  Builder.prototype.activityFor = function (step) {
    return this.catalogue.byKey[OPI.activityKey(step.edition, step.module, step.tool)] || null;
  };

  Builder.prototype.renderSteps = function () {
    var self = this;
    this.stepsList.textContent = "";
    this.lesson.steps.forEach(function (step, index) {
      self.stepsList.appendChild(self.renderStep(step, index));
    });
    this.q("[data-builder-empty]").hidden = this.lesson.steps.length > 0;
    this.updateLink();
  };

  Builder.prototype.renderStep = function (step, index) {
    var self = this;
    var item = el("li", "step step--" + step.type);
    item.setAttribute("data-index", String(index));

    var head = el("div", "step__head");
    head.appendChild(el("p", "step__label", "Step " + (index + 1) + " · " + STEP_LABELS[step.type]));
    if (step.type === "activity") {
      var activity = this.activityFor(step);
      var title = el("p", "step__title");
      if (activity) {
        var link = el("a", null, activity.title);
        link.href = OPI.fromSiteRoot("library/activity.html?edition=" + step.edition + "&module=" + step.module + "&tool=" + step.tool);
        title.appendChild(link);
        title.appendChild(doc.createTextNode(" · " + activity.module + " · " + OPI.EDITIONS[activity.edition].label + " · " + activity.minutes + " min"));
      } else {
        title.textContent = "Activity not found in the catalogue: " + step.edition + "/" + step.module + "/" + step.tool;
      }
      head.appendChild(title);
    }
    item.appendChild(head);

    item.appendChild(this.renderStepField(step, index));

    var tools = el("div", "step__tools");
    var up = button("Move up", "button button--secondary button--small", "up");
    var down = button("Move down", "button button--secondary button--small", "down");
    up.disabled = index === 0;
    down.disabled = index === this.lesson.steps.length - 1;
    tools.appendChild(up);
    tools.appendChild(down);
    tools.appendChild(button("Remove", "button button--secondary button--small", "remove"));
    item.appendChild(tools);
    return item;
  };

  Builder.prototype.renderStepField = function (step, index) {
    var self = this;
    var wrap = el("div", "builder__field");
    var id = "step-" + index + "-text";
    var label = el("label");
    label.htmlFor = id;
    var input;

    if (step.type === "activity") {
      label.textContent = "Instructions for the student (optional)";
      input = el("textarea", "field");
      input.value = step.instructions || "";
      input.maxLength = OPI.LESSON_LIMITS.instructions;
      input.addEventListener("input", function () { step.instructions = input.value; self.changed(false); });
    } else if (step.type === "note") {
      label.textContent = "Note text";
      input = el("textarea", "field");
      input.value = step.text || "";
      input.maxLength = OPI.LESSON_LIMITS.note;
      input.addEventListener("input", function () { step.text = input.value; self.changed(false); });
    } else {
      label.textContent = "Question";
      input = el("textarea", "field");
      input.value = step.prompt || "";
      input.maxLength = OPI.LESSON_LIMITS.prompt;
      input.addEventListener("input", function () { step.prompt = input.value; self.changed(false); });
    }
    input.id = id;
    input.rows = step.type === "question" ? 2 : 3;
    wrap.appendChild(label);
    wrap.appendChild(input);

    if (step.type === "question") {
      var kindWrap = el("div", "builder__field");
      var kindLabel = el("label", null, "Answer length");
      kindLabel.htmlFor = "step-" + index + "-kind";
      var select = el("select", "field");
      select.id = kindLabel.htmlFor;
      [["short", "Short (one line)"], ["long", "Long (a paragraph)"]].forEach(function (pair) {
        var option = el("option", null, pair[1]);
        option.value = pair[0];
        option.selected = step.kind === pair[0];
        select.appendChild(option);
      });
      select.addEventListener("change", function () { step.kind = select.value; self.changed(false); });
      kindWrap.appendChild(kindLabel);
      kindWrap.appendChild(select);
      wrap.appendChild(kindWrap);
    } else {
      wrap.appendChild(el("p", "builder__hint", "Plain text or simple Markdown (bold, lists, links)."));
    }
    return wrap;
  };

  Builder.prototype.onStepAction = function (action, index) {
    var steps = this.lesson.steps;
    var focusIndex = index;
    if (action === "up" && index > 0) {
      steps.splice(index - 1, 0, steps.splice(index, 1)[0]);
      focusIndex = index - 1;
      this.announce("Moved to step " + (focusIndex + 1) + ".");
    } else if (action === "down" && index < steps.length - 1) {
      steps.splice(index + 1, 0, steps.splice(index, 1)[0]);
      focusIndex = index + 1;
      this.announce("Moved to step " + (focusIndex + 1) + ".");
    } else if (action === "remove") {
      steps.splice(index, 1);
      focusIndex = Math.min(index, steps.length - 1);
      this.announce("Step removed. " + steps.length + " step" + (steps.length === 1 ? "" : "s") + " remain.");
    } else {
      return;
    }
    this.changed(true);
    var target = focusIndex >= 0
      ? this.stepsList.querySelector('[data-index="' + focusIndex + '"] [data-action="' + (action === "remove" ? "remove" : action) + '"]')
      : this.q('[data-action="add-note"]');
    if (target && target.disabled) { target = target.parentNode.querySelector("button:not([disabled])"); }
    if (target) { target.focus(); }
  };

  Builder.prototype.addStep = function (step) {
    this.lesson.steps.push(step);
    this.changed(true);
    var last = this.stepsList.lastElementChild;
    var field = last && last.querySelector("textarea, input, select");
    this.announce("Added step " + this.lesson.steps.length + ": " + STEP_LABELS[step.type] + ".");
    if (field) { field.focus(); }
  };

  /* -------------------------------------------------------------- picker */

  Builder.prototype.bindPicker = function () {
    var self = this;
    var picker = this.q("[data-builder-picker]");
    var query = this.q("#picker-query");
    var results = this.q("[data-builder-picker-results]");
    var count = this.q("[data-builder-picker-count]");

    function render() {
      var queryTokens = tokens(query.value);
      var found = self.catalogue.activities
        .map(function (a, index) { return { a: a, score: matchScore(a, queryTokens), index: index }; })
        .filter(function (m) { return m.score > 0; })
        .sort(function (x, y) { return (y.score - x.score) || (x.index - y.index); })
        .map(function (m) { return m.a; });
      results.textContent = "";
      found.slice(0, PICKER_MAX_RESULTS).forEach(function (activity) {
        var item = el("li", "picker__item");
        var text = el("span");
        text.appendChild(el("strong", null, activity.title));
        text.appendChild(el("span", "picker__meta", activity.module + " · " + OPI.EDITIONS[activity.edition].label + " · " + activity.minutes + " min"));
        item.appendChild(text);
        var add = button("Add", "button button--primary button--small", "pick");
        add.setAttribute("aria-label", "Add " + activity.title + ", " + OPI.EDITIONS[activity.edition].label);
        add.addEventListener("click", function () {
          self.addStep(OPI.newStep("activity", { edition: activity.edition, module: activity.moduleSlug, tool: activity.toolSlug }));
        });
        item.appendChild(add);
        results.appendChild(item);
      });
      count.textContent = found.length > PICKER_MAX_RESULTS
        ? "Showing the first " + PICKER_MAX_RESULTS + " of " + found.length + " matches; add a word to narrow it."
        : found.length + " match" + (found.length === 1 ? "" : "es");
    }

    query.addEventListener("input", render);
    this.q('[data-action="add-activity"]').addEventListener("click", function () {
      picker.hidden = false;
      query.focus();
      render();
    });
    this.q('[data-action="close-picker"]').addEventListener("click", function () {
      picker.hidden = true;
      self.q('[data-action="add-activity"]').focus();
    });
    render();
  };

  /* ---------------------------------------------------------------- link */

  /**
   * Validate the current lesson and, when valid, encode it and refresh the
   * displayed link. Resolves with the URL, or null when the lesson is not
   * yet shareable.
   *
   * Encoding is asynchronous, so two things are guarded. Each call takes a
   * sequence number and an older encode that finishes after a newer one is
   * discarded, so the display can never regress to a stale link. And Copy
   * and Preview call this directly rather than reading the display, so a
   * click that lands inside the autosave debounce still uses the lesson as
   * it is at that moment.
   */
  Builder.prototype.updateLink = function () {
    var self = this;
    var problems = OPI.validateLesson(this.lesson);
    var list = this.q("[data-builder-problems]");
    var box = this.q("[data-builder-link]");
    list.textContent = "";
    problems.forEach(function (text) { list.appendChild(el("li", null, text)); });
    this.q("[data-builder-problems-wrap]").hidden = problems.length === 0;
    box.hidden = problems.length > 0;
    if (problems.length) { return Promise.resolve(null); }

    this.linkSequence = (this.linkSequence || 0) + 1;
    var sequence = this.linkSequence;
    return OPI.encodeLesson(this.lesson).then(function (encoded) {
      var url = OPI.lessonUrl(encoded);
      if (sequence !== self.linkSequence) { return url; }  // superseded; leave the newer one
      self.q("#student-link").value = url;
      self.q("[data-builder-link-length]").textContent = url.length + " characters";
      self.q("[data-builder-link-warning]").hidden = url.length <= LINK_WARN_LENGTH;
      self.q('[data-action="preview"]').href = url;
      return url;
    });
  };

  Builder.prototype.bindActions = function () {
    var self = this;

    this.root.addEventListener("click", function (event) {
      var target = event.target.closest("[data-action]");
      if (!target) { return; }
      var action = target.getAttribute("data-action");
      var item = target.closest("[data-index]");
      if (item && (action === "up" || action === "down" || action === "remove")) {
        self.onStepAction(action, Number(item.getAttribute("data-index")));
      } else if (action === "add-note") {
        self.addStep(OPI.newStep("note", {}));
      } else if (action === "add-question") {
        self.addStep(OPI.newStep("question", { kind: "long" }));
      } else if (action === "copy") {
        self.copyLink();
      } else if (action === "preview") {
        event.preventDefault();
        self.preview();
      } else if (action === "download") {
        self.download();
      } else if (action === "clear") {
        self.clearDraft();
      }
    });

    this.q("#open-file").addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (file) { self.openFile(file); }
      event.target.value = "";
    });
  };

  Builder.prototype.copyLink = function () {
    var self = this;
    var field = this.q("#student-link");
    var done = function () { self.announce("Student link copied."); };
    var fallback = function () {
      field.focus();
      field.select();
      self.announce("Select the link and copy it with your keyboard.");
    };
    // Encode the lesson as it is now; the displayed link may be a debounce behind.
    this.updateLink().then(function (url) {
      if (!url) { self.announce("The lesson is not ready to share yet."); return; }
      if (global.navigator.clipboard && global.navigator.clipboard.writeText) {
        global.navigator.clipboard.writeText(url).then(done, fallback);
      } else {
        fallback();
      }
    });
  };

  /** Open the player on the lesson as it is now, in a new tab. The tab is
      opened synchronously inside the click so browsers treat it as
      user-initiated; it is pointed at the lesson once the link exists. */
  Builder.prototype.preview = function () {
    var self = this;
    var tab = global.open("", "_blank");
    this.updateLink().then(function (url) {
      if (!url) {
        if (tab) { tab.close(); }
        self.announce("The lesson is not ready to preview yet.");
        return;
      }
      if (tab) { tab.location.href = url; } else { global.location.href = url; }
    });
  };

  Builder.prototype.download = function () {
    var json = JSON.stringify(OPI.normaliseLesson(this.lesson), null, 2);
    var blob = new global.Blob([json], { type: "application/json" });
    var anchor = el("a");
    anchor.href = global.URL.createObjectURL(blob);
    anchor.download = slugify(this.lesson.title) + ".lesson.json";
    doc.body.appendChild(anchor);
    anchor.click();
    doc.body.removeChild(anchor);
    global.setTimeout(function () { global.URL.revokeObjectURL(anchor.href); }, 1000);
    this.announce("Lesson file downloaded.");
  };

  Builder.prototype.openFile = function (file) {
    var self = this;
    var reader = new global.FileReader();
    reader.onload = function () {
      try {
        var lesson = OPI.normaliseLesson(JSON.parse(String(reader.result)));
        self.lesson = lesson;
        self.fillFields();
        self.changed(true);
        self.announce("Lesson file opened: " + (lesson.title || "untitled") + ", " + lesson.steps.length + " steps.");
      } catch (error) {
        self.announce("That file is not a lesson file.");
      }
    };
    reader.readAsText(file);
  };

  Builder.prototype.clearDraft = function () {
    if (!global.confirm("Clear the draft from this browser? A downloaded lesson file or a copied link is unaffected.")) { return; }
    OPI.draft.clear();
    this.lesson = OPI.newLesson();
    this.fillFields();
    this.renderSteps();
    this.q("[data-builder-draft]").textContent = "Draft cleared.";
    this.announce("Draft cleared.");
    this.q("#lesson-title").focus();
  };

  /* --------------------------------------------------------------- start */

  Builder.prototype.start = function () {
    this.bindFields();
    this.fillFields();
    this.bindPicker();
    this.bindActions();

    var params = new global.URLSearchParams(global.location.search);
    var add = params.get("add");
    if (add && this.catalogue.byKey[add]) {
      var parts = add.split("/");
      this.lesson.steps.push(OPI.newStep("activity", { edition: parts[0], module: parts[1], tool: parts[2] }));
      this.announce("Added " + this.catalogue.byKey[add].title + " as step " + this.lesson.steps.length + ".");
      global.history.replaceState(null, "", global.location.pathname);
      this.persist();
    }
    this.renderSteps();
    this.q("[data-builder-form]").hidden = false;
  };

  function start() {
    var root = doc.querySelector("[data-builder]");
    if (!root) { return; }
    OPI.loadCatalogues().then(function (catalogue) {
      new Builder(root, catalogue).start();
    }).catch(function (error) {
      var message = root.querySelector("[data-builder-message]");
      message.hidden = false;
      message.textContent = "The builder could not load the catalogue. " + error.message;
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
