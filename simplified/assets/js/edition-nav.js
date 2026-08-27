/* =========================================================================
   Simplified Edition — activity navigation
   -------------------------------------------------------------------------
   Adds two things to an activity page and nothing else:

     a breadcrumb above the activity, back to the module and the edition;
     a strip below it with the previous and next activity in the module.

   Loaded by every activity in the edition. It is a separate file from
   workbook.js on purpose: workbook.js is the shell contract an activity is
   written against and is documented in simplified/template/README.md, and
   browsing chrome is not part of that contract. Deleting the two lines this
   file needs from an activity's <head> removes the navigation and changes
   nothing else.

   Progressive enhancement, in two layers
   -------------------------------------
   The way back to the module is the part a reader actually needs, so it never
   depends on a network request. Both its href and its label are derived from
   the page's own location: an activity always sits at

       simplified/modules/<moduleSlug>/tools/<toolSlug>/index.html

   so the module page is two levels up and the edition landing page is four,
   from any activity, always.

   Previous and next cannot be derived that way, because the order lives in
   the catalogue. Those are fetched and appended afterwards. When the fetch
   cannot happen the strip keeps the module link and simply has no previous or
   next, which is the correct outcome for a lone downloaded folder: the two
   links it could not honour are absent rather than broken.

   `fetch` on a file:// URL rejects in every current browser, so the attempt
   is skipped there entirely rather than left to fail, which keeps the console
   clean for a lecturer who opened the folder by double-clicking.
   ========================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;

  /* The edition's five modules. Held here so the breadcrumb can name the
     module without waiting for the catalogue.
     MUST MATCH data/catalogue-simplified.json: scripts/check-edition-pairing.py
     reads this object and fails if the names or slugs have drifted. */
  var MODULE_NAMES = {
    "cognitive": "Cognitive Psychology",
    "research-methods": "Research Methods",
    "neuropsychology": "Neuropsychology",
    "social-critical-psychology": "Social & Critical Psychology",
    "personality-individual-differences": "Personality & Individual Differences"
  };

  /* From simplified/modules/<module>/tools/<tool>/, counting upwards:
       ..            tools
       ../..         <module>
       ../../..      modules
       ../../../..   simplified, where the edition landing page is
       ../../../../.. the repository root, where data/ lives.
     The stylesheet links in an activity's head stop at four, because they are
     reaching into simplified/assets/. The catalogue is one further out.
     Both of these were wrong when first written and neither showed up in the
     page: a bad "../" count produces a link that looks right and a fetch that
     silently finds nothing. check-edition-pairing.py now resolves all three
     against a real activity directory. */
  var TO_MODULE = "../../index.html";
  var TO_EDITION = "../../../../index.html";
  var TO_CATALOGUE = "../../../../../data/catalogue-simplified.json";

  /**
   * Which activity is this? Read from the path rather than from any attribute
   * on the page, so no activity has to declare anything about itself.
   * @returns {{moduleSlug: string, toolSlug: string}|null}
   */
  function locate() {
    /* Nothing here can be worked out without a path, and a script that
       assumes one exists throws in every context that has no location: a test
       harness, a sandboxed worker, a server-side render. No path means no
       navigation, which is the right answer rather than an exception. */
    if (!global.location || !global.location.pathname) { return null; }

    var parts = String(global.location.pathname).split("/").filter(Boolean);

    // Drop a trailing file name, so ".../<slug>/" and ".../<slug>/index.html"
    // both reduce to the same segments.
    if (parts.length && parts[parts.length - 1].indexOf(".") !== -1) {
      parts.pop();
    }
    if (parts.length < 4) { return null; }

    var toolSlug = parts[parts.length - 1];
    var tools = parts[parts.length - 2];
    var moduleSlug = parts[parts.length - 3];
    var modules = parts[parts.length - 4];

    if (tools !== "tools" || modules !== "modules") { return null; }
    if (!Object.prototype.hasOwnProperty.call(MODULE_NAMES, moduleSlug)) {
      return null;
    }
    return { moduleSlug: moduleSlug, toolSlug: toolSlug };
  }

  function element(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (text) { node.textContent = text; }
    return node;
  }

  /** A link whose visible text is its whole accessible name. */
  function link(href, className, text) {
    var node = element("a", className, text);
    node.setAttribute("href", href);
    return node;
  }

  /* ------------------------------------------------------------ breadcrumb
     Placed before <main>, not inside it. The skip link points at #main and
     means "skip to the activity"; putting a breadcrumb inside main would
     land the reader on the breadcrumb instead. Outside it, the document
     reads nav, main, which is also the ordinary landmark order. */
  function addBreadcrumb(main, here) {
    var wrap = element("div", "edition-chrome");
    var nav = element("nav", "edition-bar edition-bar--activity");
    nav.setAttribute("aria-label", "Breadcrumb");

    nav.appendChild(link(TO_EDITION, null, "Simplified Edition"));
    var sep = element("span", "edition-bar__sep", "/");
    sep.setAttribute("aria-hidden", "true");
    nav.appendChild(sep);
    nav.appendChild(link(TO_MODULE, null, MODULE_NAMES[here.moduleSlug]));

    wrap.appendChild(nav);
    main.parentNode.insertBefore(wrap, main);
  }

  /* ------------------------------------------------------------- foot strip
     Appended inside <main>, so it picks up the workbook's width and vertical
     rhythm rather than needing its own. A <nav> at the end of the main
     content is the ordinary place for "where to go next". */
  function addFootStrip(main, here) {
    var nav = element("nav", "activity-nav-wrap");
    nav.setAttribute("aria-label", "More activities in this module");

    var row = element("div", "activity-nav");
    row.appendChild(element("div", "activity-nav__gap"));
    row.appendChild(link(TO_MODULE, "activity-nav__link activity-nav__link--up",
      "All " + MODULE_NAMES[here.moduleSlug] + " activities"));
    row.appendChild(element("div", "activity-nav__gap"));

    nav.appendChild(row);
    main.appendChild(nav);
    return row;
  }

  /**
   * Replace one of the two placeholder cells with a real link.
   * @param {Element} cell  The placeholder being replaced.
   * @param {string} direction  "Previous" or "Next".
   * @param {object} activity  Catalogue entry for the neighbouring activity.
   */
  function fillCell(cell, direction, activity) {
    var suffix = direction === "Next" ? "next" : "prev";
    var anchor = link("../" + activity.toolSlug + "/index.html",
      "activity-nav__link activity-nav__link--" + suffix);

    anchor.appendChild(element("span", "activity-nav__dir", direction));
    /* A space between the two spans. They are stacked flex children, so it
       changes nothing on screen, but without it the link's accessible name
       computes as "PreviousAttentional Blink". */
    anchor.appendChild(doc.createTextNode(" "));
    anchor.appendChild(element("span", "activity-nav__name", activity.title));
    cell.parentNode.replaceChild(anchor, cell);
  }

  /**
   * Fill in previous and next from the catalogue. Anything unexpected in the
   * response leaves the strip exactly as it was: this is an enhancement, and
   * a broken enhancement must not take the module link down with it.
   */
  /* The catalogue arrives over the network, so nothing in it can be assumed:
     a missing array, a null member or an entry without the slug must all read
     as "not found" rather than throw. One guarded search serves both levels of
     the lookup, which are otherwise the same search written twice. */
  function indexOfSlug(list, key, slug) {
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i] && list[i][key] === slug) { return i; }
    }
    return -1;
  }

  function addNeighbours(row, here, catalogue) {
    var modules = (catalogue && catalogue.modules) || [];
    var moduleAt = indexOfSlug(modules, "moduleSlug", here.moduleSlug);
    if (moduleAt === -1) { return; }

    var activities = modules[moduleAt].activities || [];
    var at = indexOfSlug(activities, "toolSlug", here.toolSlug);
    if (at === -1) { return; }

    var cells = row.querySelectorAll(".activity-nav__gap");
    if (cells.length !== 2) { return; }

    if (at > 0) { fillCell(cells[0], "Previous", activities[at - 1]); }
    if (at < activities.length - 1) { fillCell(cells[1], "Next", activities[at + 1]); }
  }

  function start() {
    var main = doc.querySelector("main[data-workbook]");
    if (!main) { return; }

    var here = locate();
    if (!here) { return; }

    addBreadcrumb(main, here);
    var row = addFootStrip(main, here);

    if (global.location.protocol === "file:" || typeof global.fetch !== "function") {
      return;
    }

    global.fetch(TO_CATALOGUE, { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Catalogue request failed: " + response.status);
        }
        return response.json();
      })
      .then(function (catalogue) {
        addNeighbours(row, here, catalogue);
      })
      .catch(function (error) {
        if (global.console && global.console.warn) {
          global.console.warn(
            "Simplified Edition catalogue unavailable; " +
            "previous and next links omitted.", error);
        }
      });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
