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

   The filtering and ranking themselves (OPI.tokens, OPI.filterActivities)
   live in catalogue.js, shared with the lesson builder's activity picker,
   so the two narrow and rank a search the same way; this file supplies only
   the DOM this page is built from.
   ========================================================================= */

(function (global) {
  "use strict";

  var OPI = global.OPI = global.OPI || {};
  var doc = global.document;

  var ANNOUNCE_DELAY_MS = 400;

  function checkedValues(form, name) {
    var boxes = form.querySelectorAll('[data-library-filter="' + name + '"] input:checked');
    return Array.prototype.map.call(boxes, function (box) { return box.value; });
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
      filters.query = query.value;
      var matched = OPI.filterActivities(catalogue.activities, filters);

      results.textContent = "";
      matched.forEach(function (activity) { results.appendChild(renderResult(activity, catalogue)); });
      empty.hidden = matched.length > 0;
      announce(matched.length);
    }

    // "input" alone, not also "change": every control here (search, and
    // checkboxes once the picker's compact controls made this shared code)
    // fires "input" as the user acts on it, in every evergreen browser. A
    // text input's own "change" event fires separately, on blur, which is
    // exactly the moment a click on a result link starts (mousedown moves
    // focus away from the search box before mouseup completes the click);
    // binding "change" here as well used to rebuild the results list, and
    // so the link, between those two events, and the browser drops a click
    // whose target changed between mousedown and mouseup. Live QA on the
    // lesson builder's picker (assets/product/builder.js) found this by a
    // click on "Add" doing nothing right after typing a search term.
    form.addEventListener("input", render);
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
