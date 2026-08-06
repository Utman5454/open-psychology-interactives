/* =========================================================================
   Open Psychology Interactives — site script
   -------------------------------------------------------------------------
   Vanilla JavaScript, no build step, no dependencies. Loaded with `defer`
   so it runs after the document has been parsed.

   Everything here is progressive enhancement: with JavaScript disabled the
   pages remain fully readable and navigable. Specifically —
     * the mobile navigation stays open rather than collapsing;
     * the copyright year falls back to the value written in the markup;
     * collection pages keep their statically written "in preparation"
       message instead of a catalogue-driven listing.

   Path handling
   -------------
   Pages live at different depths (`/index.html`, `/collections/x/index.html`),
   and the site is published under the project sub-path
   `/open-psychology-interactives/`. Rather than hard-coding either, every
   page declares its own way back to the site root:

       <body data-site-root="../../">

   All URLs built here are resolved against that value, so the same script
   works from the repository root, from a sub-directory, from GitHub Pages
   and from a local `file://` open.
   ========================================================================= */

(function () {
  "use strict";

  /**
   * Resolve a site-relative path (e.g. "data/catalogue.json") into a URL that
   * works from the current page's depth.
   * @param {string} path
   * @returns {string}
   */
  function fromSiteRoot(path) {
    var root = document.body.getAttribute("data-site-root") || "./";
    // Guarantee exactly one separator between the root and the path.
    return root.replace(/\/*$/, "/") + path.replace(/^\/+/, "");
  }

  /* -----------------------------------------------------------------------
     1. Collapsible navigation (small screens)
     --------------------------------------------------------------------- */

  /**
   * Wires the header's menu button to the navigation list.
   *
   * The button is written into the markup with `hidden` so that it never
   * appears for users without JavaScript (for whom it would do nothing).
   * We remove `hidden` here and take over control of the nav's visibility.
   *
   * Accessibility notes:
   *   * `aria-expanded` mirrors the open/closed state on the button itself.
   *   * The `hidden` attribute — not a CSS class — hides the nav, so screen
   *     readers and the visual state can never disagree.
   *   * Escape closes the menu and returns focus to the button.
   *
   * The `hidden` attribute is applied ONLY below the breakpoint, and only
   * while the menu is closed. Above the breakpoint, and whenever the menu is
   * open, it is removed. That invariant lives in one function — render() —
   * so the navigation can never end up displayed and marked hidden at the
   * same time.
   */
  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("site-nav");

    if (!toggle || !nav) {
      return;
    }

    // The breakpoint here must match the one in main.css (48em).
    var wideScreen = window.matchMedia("(min-width: 48em)");

    // Whether the reader has opened the menu. Only meaningful below the
    // breakpoint; above it the navigation is always shown.
    var isOpen = false;

    /**
     * Write the current state to the DOM.
     *
     * Everything is derived from `wideScreen.matches` at the moment this
     * runs, and nothing is read back out of the DOM, so calling it again
     * after any layout change always produces the correct result. It is
     * idempotent — repeat calls are free.
     */
    function render() {
      if (wideScreen.matches) {
        // Wide viewport: the toggle is hidden by CSS and the navigation is
        // always available, so the attribute must not be set. Reset the open
        // state too, otherwise a menu opened while narrow would spring back
        // open on returning to a narrow viewport.
        isOpen = false;
        nav.hidden = false;
        toggle.setAttribute("aria-expanded", "false");
        return;
      }

      toggle.setAttribute("aria-expanded", String(isOpen));
      nav.hidden = !isOpen;
    }

    toggle.hidden = false;
    render();

    toggle.addEventListener("click", function () {
      isOpen = !isOpen;
      render();
    });

    // Escape closes the menu from anywhere inside the header.
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }
      if (!wideScreen.matches && isOpen) {
        isOpen = false;
        render();
        toggle.focus();
      }
    });

    /* Re-render whenever the viewport may have crossed the breakpoint.
       Four triggers rather than one, because no single one is dependable in
       every context. When the page is embedded in an iframe whose size the
       parent controls — a VLE, a preview pane — the media query can already
       report a wide viewport by the time the document loads without a change
       event ever having fired, and resizing that iframe afterwards may
       deliver neither a `resize` nor a MediaQueryList `change` event to the
       embedded document. The ResizeObserver watches the document element's
       box directly, so it does not depend on either event being delivered.
       render() is idempotent, so the overlap between triggers costs
       nothing. */

    // addEventListener on MediaQueryList is not available in older Safari,
    // which still supports the deprecated addListener.
    if (typeof wideScreen.addEventListener === "function") {
      wideScreen.addEventListener("change", render);
    } else if (typeof wideScreen.addListener === "function") {
      wideScreen.addListener(render);
    }

    window.addEventListener("resize", render);
    window.addEventListener("load", render);

    // Feature-detected: unsupported in a few older browsers, which still get
    // the three listeners above.
    if (typeof window.ResizeObserver === "function") {
      new window.ResizeObserver(render).observe(document.documentElement);
    }
  }

  /* -----------------------------------------------------------------------
     2. Footer year
     --------------------------------------------------------------------- */

  /**
   * Replaces the year written in the markup with the current one. The markup
   * always carries a sensible value, so this is cosmetic only.
   */
  function initFooterYear() {
    var target = document.querySelector("[data-current-year]");
    if (target) {
      target.textContent = String(new Date().getFullYear());
    }
  }

  /* -----------------------------------------------------------------------
     3. Catalogue
     --------------------------------------------------------------------- */

  /**
   * `data/catalogue.json` is the single machine-readable index of the
   * project. It is the file a contributor edits when an interactive is
   * added, and the file any external listing should read.
   *
   * On pages that opt in with `data-catalogue-collection="<id>"`, this
   * function replaces the statically written placeholder with a list built
   * from the catalogue — but only if the catalogue actually contains
   * published entries for that collection. If the fetch fails (which it
   * will when the page is opened straight from disk over `file://`, because
   * browsers block such requests), or if the collection is still empty, the
   * markup that is already on the page is left exactly as it is.
   *
   * That ordering matters: the page must never claim an interactive exists
   * before one has been published.
   */
  function initCatalogue() {
    var regions = document.querySelectorAll("[data-catalogue-collection]");
    if (regions.length === 0) {
      return;
    }

    // `fetch` on a file:// URL rejects in every current browser. Skip the
    // attempt entirely so the console stays clean when a teacher opens the
    // downloaded folder by double-clicking index.html.
    if (window.location.protocol === "file:") {
      return;
    }

    fetch(fromSiteRoot("data/catalogue.json"), { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Catalogue request failed: " + response.status);
        }
        return response.json();
      })
      .then(function (catalogue) {
        Array.prototype.forEach.call(regions, function (region) {
          renderCollection(region, catalogue);
        });
      })
      .catch(function (error) {
        // A missing or malformed catalogue must never break the page; the
        // static placeholder is already correct.
        if (window.console && console.warn) {
          console.warn("Catalogue unavailable; showing static content.", error);
        }
      });
  }

  /**
   * Render the published interactives for one collection into `region`.
   * @param {Element} region  Element carrying data-catalogue-collection.
   * @param {object} catalogue  Parsed contents of data/catalogue.json.
   */
  function renderCollection(region, catalogue) {
    var id = region.getAttribute("data-catalogue-collection");
    var collections = (catalogue && catalogue.collections) || [];
    var match = null;

    for (var i = 0; i < collections.length; i += 1) {
      if (collections[i].id === id) {
        match = collections[i];
        break;
      }
    }

    var tools = (match && match.interactives) || [];
    if (tools.length === 0) {
      // Nothing published yet — leave the placeholder in place.
      return;
    }

    var list = document.createElement("ul");
    list.className = "card-grid";

    tools.forEach(function (tool) {
      list.appendChild(buildToolCard(tool, id));
    });

    region.textContent = "";
    region.appendChild(list);
  }

  /**
   * Build one interactive's card. Uses textContent rather than innerHTML for
   * all catalogue-supplied strings so that catalogue data can never inject
   * markup into the page.
   * @param {object} tool
   * @param {string} collectionId
   * @returns {HTMLLIElement}
   */
  function buildToolCard(tool, collectionId) {
    var item = document.createElement("li");
    item.className = "card card--" + collectionId;

    var heading = document.createElement("h3");
    heading.className = "card__title";

    var link = document.createElement("a");
    link.href = fromSiteRoot(tool.path || "");
    link.textContent = tool.title || "Untitled interactive";
    heading.appendChild(link);

    var summary = document.createElement("p");
    summary.className = "card__body";
    summary.textContent = tool.summary || "";

    item.appendChild(heading);
    item.appendChild(summary);

    // Optional teaching level / duration metadata, shown only when present.
    if (tool.level || tool.duration) {
      var footer = document.createElement("p");
      footer.className = "card__footer";
      footer.textContent = [tool.level, tool.duration]
        .filter(Boolean)
        .join(" · ");
      item.appendChild(footer);
    }

    return item;
  }

  /* -----------------------------------------------------------------------
     4. Start-up
     --------------------------------------------------------------------- */

  initNavigation();
  initFooterYear();
  initCatalogue();
})();
