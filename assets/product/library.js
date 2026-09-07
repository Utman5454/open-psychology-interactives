/* =========================================================================
   Open Psychology Interactives — product layer: the library
   -------------------------------------------------------------------------
   One searchable, filterable list of all 150 activities across both
   editions, built client-side from the two catalogues via catalogue.js.

   Markup contract (library/index.html):

       <div data-library>
         <form data-library-form>
           <input type="search" data-library-query>
           <fieldset data-library-filter="module">   checkboxes value=<slug>
           <fieldset data-library-filter="edition">  checkboxes value=original|simplified
           <fieldset data-library-filter="band">     checkboxes value=short|medium|long
           <fieldset data-library-filter="difficulty">
           <button type="reset">
         </form>
         <p data-library-count aria-live="polite">
         <ul data-library-results>
         <div data-library-message hidden>
       </div>

   Behaviour: filtering is AND across fieldsets and OR within one; a fieldset
   with nothing ticked does not filter. Search tokens must all match
   somewhere in title, summary, teaching job, topics or objectives; results
   are ranked by where they matched (title first) and otherwise stay in
   catalogue order. The count is announced after each change, debounced so
   typing does not flood a screen reader. Nothing is stored.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};
  var doc = global.document;

  var ANNOUNCE_DELAY_MS = 400;

  function tokens(text) {
    return String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1; });
  }

  function haystacks(activity) {
    return {
      title: activity.title.toLowerCase(),
      strong: (activity.teachingJob + " " + activity.topics.join(" ")).toLowerCase(),
      weak: (activity.summary + " " + activity.learningObjectives.join(" ")).toLowerCase()
    };
  }

  /** Score > 0 when every token matches somewhere; higher for better places. */
  function score(activity, queryTokens) {
    if (!queryTokens.length) { return 1; }
    var fields = haystacks(activity);
    var total = 0;
    for (var i = 0; i < queryTokens.length; i += 1) {
      var t = queryTokens[i];
      if (fields.title.indexOf(t) !== -1) { total += 3; }
      else if (fields.strong.indexOf(t) !== -1) { total += 2; }
      else if (fields.weak.indexOf(t) !== -1) { total += 1; }
      else { return 0; }
    }
    return total;
  }

  function checkedValues(form, name) {
    var boxes = form.querySelectorAll('[data-library-filter="' + name + '"] input:checked');
    return Array.prototype.map.call(boxes, function (box) { return box.value; });
  }

  function passesFilters(activity, filters) {
    return (!filters.module.length || filters.module.indexOf(activity.moduleSlug) !== -1) &&
      (!filters.edition.length || filters.edition.indexOf(activity.edition) !== -1) &&
      (!filters.band.length || filters.band.indexOf(activity.band) !== -1) &&
      (!filters.difficulty.length || filters.difficulty.indexOf(activity.difficulty) !== -1);
  }

  function element(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  function activityPageHref(activity) {
    return "activity.html?edition=" + encodeURIComponent(activity.edition) +
      "&module=" + encodeURIComponent(activity.moduleSlug) +
      "&tool=" + encodeURIComponent(activity.toolSlug);
  }

  function renderResult(activity, catalogue) {
    var item = element("li", "result result--" + activity.moduleSlug);

    var eyebrow = element("p", "result__eyebrow");
    eyebrow.appendChild(element("span", "result__module", activity.module));
    eyebrow.appendChild(doc.createTextNode(" · " + OPI.EDITIONS[activity.edition].label +
      " · " + activity.minutes + " min" + (activity.difficulty ? " · " + activity.difficulty : "")));
    item.appendChild(eyebrow);

    var title = element("h3", "result__title");
    var link = element("a", null, activity.title);
    link.href = activityPageHref(activity);
    title.appendChild(link);
    item.appendChild(title);

    item.appendChild(element("p", "result__summary", activity.teachingJob || activity.summary));

    var actions = element("p", "result__actions");
    var open = element("a", "button button--primary button--small", "Open activity");
    open.href = OPI.fromSiteRoot(activity.path);
    actions.appendChild(open);
    var twin = activity.twinKey && catalogue.byKey[activity.twinKey];
    if (twin) {
      var twinLink = element("a", "button button--secondary button--small",
        twin.edition === "simplified" ? "Simplified twin" : "Full-length twin");
      twinLink.href = activityPageHref(twin);
      actions.appendChild(twinLink);
    }
    item.appendChild(actions);
    return item;
  }

  function attach(root, catalogue) {
    var form = root.querySelector("[data-library-form]");
    var query = root.querySelector("[data-library-query]");
    var count = root.querySelector("[data-library-count]");
    var results = root.querySelector("[data-library-results]");
    var empty = root.querySelector("[data-library-empty]");
    var announceTimer = null;

    function currentFilters() {
      return {
        module: checkedValues(form, "module"),
        edition: checkedValues(form, "edition"),
        band: checkedValues(form, "band"),
        difficulty: checkedValues(form, "difficulty")
      };
    }

    function announce(n) {
      global.clearTimeout(announceTimer);
      announceTimer = global.setTimeout(function () {
        count.textContent = n === 1 ? "1 activity" : n + " activities";
      }, ANNOUNCE_DELAY_MS);
    }

    function render() {
      var filters = currentFilters();
      var queryTokens = tokens(query.value);
      var matched = [];
      catalogue.activities.forEach(function (activity, index) {
        if (!passesFilters(activity, filters)) { return; }
        var s = score(activity, queryTokens);
        if (s > 0) { matched.push({ activity: activity, score: s, index: index }); }
      });
      matched.sort(function (a, b) { return (b.score - a.score) || (a.index - b.index); });

      results.textContent = "";
      matched.forEach(function (m) { results.appendChild(renderResult(m.activity, catalogue)); });
      empty.hidden = matched.length > 0;
      announce(matched.length);
    }

    form.addEventListener("input", render);
    form.addEventListener("change", render);
    form.addEventListener("submit", function (event) { event.preventDefault(); render(); });
    form.addEventListener("reset", function () { global.setTimeout(render, 0); });

    // Per-module counts beside the module filters.
    var perModule = {};
    catalogue.activities.forEach(function (a) { perModule[a.moduleSlug] = (perModule[a.moduleSlug] || 0) + 1; });
    Array.prototype.forEach.call(form.querySelectorAll('[data-library-filter="module"] input'), function (box) {
      var label = box.closest("label");
      if (label && perModule[box.value]) {
        label.appendChild(element("span", "choice__count", String(perModule[box.value])));
      }
    });

    // Honour ?q= so a search can be linked to.
    var params = new global.URLSearchParams(global.location.search);
    if (params.get("q")) { query.value = params.get("q"); }
    if (params.get("module")) {
      var box = form.querySelector('[data-library-filter="module"] input[value="' + params.get("module") + '"]');
      if (box) { box.checked = true; }
    }

    render();
  }

  function start() {
    var root = doc.querySelector("[data-library]");
    if (!root) { return; }
    var message = root.querySelector("[data-library-message]");
    var form = root.querySelector("[data-library-form]");

    OPI.loadCatalogues().then(function (catalogue) {
      form.hidden = false;
      attach(root, catalogue);
    }).catch(function (error) {
      message.hidden = false;
      message.textContent = "The library could not load the catalogue. " + error.message +
        " The module pages list every activity and work from any address.";
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
