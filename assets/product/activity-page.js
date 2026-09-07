/* =========================================================================
   Open Psychology Interactives — product layer: activity page
   -------------------------------------------------------------------------
   library/activity.html?edition=<edition>&module=<slug>&tool=<slug>

   One page per activity, rendered from the catalogue entry and the
   activity's teaching-notes.md: what it is, how long, for whom, the
   objectives, the launch button, the twin in the other edition, and the
   notes a lecturer needs to run it. This is the page that gives the
   teaching notes a URL, which the site did not have before.

   Markup contract: elements carrying data-activity-<field>. Everything is
   written with textContent except the rendered notes, which come through
   OPI.renderMarkdown (escaped source, no raw HTML).
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};
  var doc = global.document;

  function slot(name) {
    return doc.querySelector("[data-activity-" + name + "]");
  }

  function setText(name, text) {
    var node = slot(name);
    if (node) { node.textContent = text || ""; }
  }

  function fillList(name, items) {
    var node = slot(name);
    if (!node) { return; }
    node.textContent = "";
    (items || []).forEach(function (text) {
      var li = doc.createElement("li");
      li.textContent = text;
      node.appendChild(li);
    });
    var wrapper = node.closest("[data-activity-section]");
    if (wrapper) { wrapper.hidden = !(items && items.length); }
  }

  function activityPageHref(activity) {
    return "activity.html?edition=" + encodeURIComponent(activity.edition) +
      "&module=" + encodeURIComponent(activity.moduleSlug) +
      "&tool=" + encodeURIComponent(activity.toolSlug);
  }

  function showError(text) {
    var message = slot("message");
    if (message) { message.hidden = false; message.textContent = text; }
    // Everything after the message is a template with nothing in it.
    Array.prototype.forEach.call(doc.querySelectorAll("[data-activity-template]"), function (node) {
      node.hidden = true;
    });
    doc.title = "Activity not found — Open Psychology Interactives";
  }

  function renderNotes(activity) {
    var target = slot("notes");
    var status = slot("notes-status");
    if (!target) { return; }
    OPI.fetchText(activity.notesPath).then(function (text) {
      target.innerHTML = OPI.renderMarkdown(text, { shift: 1, dropTitle: true });
      if (status) { status.hidden = true; }
    }).catch(function () {
      if (status) {
        status.hidden = false;
        status.textContent = "The teaching notes could not be loaded from " + activity.notesPath + ".";
      }
    });
  }

  function render(activity, catalogue) {
    var edition = OPI.EDITIONS[activity.edition];
    doc.title = activity.title + " — " + edition.label + " — Open Psychology Interactives";

    setText("title", activity.title);
    setText("module", activity.module);
    setText("edition", edition.label);
    setText("summary", activity.summary);
    setText("minutes", activity.minutes + " minutes");
    setText("difficulty", activity.difficulty);
    setText("teaching-job", activity.teachingJob);
    setText("privacy", activity.privacy);
    setText("accessibility", activity.accessibilityNotes);
    setText("simulation", activity.simulationNotes);
    fillList("objectives", activity.learningObjectives);
    fillList("topics", activity.topics);
    fillList("interactions", activity.interactionTypes);

    var open = slot("open");
    if (open) { open.href = OPI.fromSiteRoot(activity.path); }

    var moduleLink = slot("module-link");
    if (moduleLink) {
      moduleLink.href = OPI.fromSiteRoot((activity.edition === "simplified" ? "simplified/" : "") +
        "modules/" + activity.moduleSlug + "/index.html");
      moduleLink.textContent = activity.module + (activity.edition === "simplified" ? " (Simplified Edition)" : "");
    }

    var crumb = slot("crumb");
    if (crumb) { crumb.textContent = activity.title; }

    var twinWrap = slot("twin");
    var twin = activity.twinKey && catalogue.byKey[activity.twinKey];
    if (twinWrap) {
      twinWrap.hidden = !twin;
      if (twin) {
        var link = slot("twin-link");
        link.href = activityPageHref(twin);
        link.textContent = (twin.edition === "simplified" ? "Simplified twin: " : "Full-length twin: ") + twin.title;
        setText("twin-minutes", twin.minutes + " minutes");
      }
    }

    var lessonLink = slot("lesson-link");
    if (lessonLink) {
      lessonLink.href = OPI.fromSiteRoot("lessons/build.html?add=" + encodeURIComponent(activity.key));
    }

    renderNotes(activity);
  }

  function start() {
    var params = new global.URLSearchParams(global.location.search);
    var edition = params.get("edition") || "original";
    var moduleSlug = params.get("module") || "";
    var toolSlug = params.get("tool") || "";

    OPI.loadCatalogues().then(function (catalogue) {
      var activity = catalogue.byKey[OPI.activityKey(edition, moduleSlug, toolSlug)];
      if (!activity) {
        showError("No activity matches this address. Use the library to find the one you want.");
        return;
      }
      render(activity, catalogue);
    }).catch(function (error) {
      showError("This page could not load the catalogue. " + error.message);
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
