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
   Pages live at different depths (`/index.html`, `/modules/<slug>/index.html`,
   `/modules/<slug>/tools/<slug>/index.html`),
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

    // The breakpoint here must match the one in main.css (64em). See the
    // "Collapsed navigation" comment there for why it is 64em and not 48em.
    var wideScreen = window.matchMedia("(min-width: 64em)");

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

    /* Activating a navigation link closes the menu.
       -----------------------------------------------------------------
       This is a WCAG 2.2 requirement, not a nicety. SC 2.4.11 (Focus Not
       Obscured, Minimum) says a focused element must not be entirely hidden
       behind other content. The site header is `position: sticky`, and while
       the collapsed menu is expanded it is several hundred pixels tall — so
       anything focused below it would be underneath the header.

       Closing the menu returns the header to a single row, which the
       `scroll-padding-top: 5rem` in main.css is sized to clear.

       A link to another page would resolve this by loading a fresh document
       anyway, but a same-page anchor (Documentation on the home page) does
       not, so the menu has to be closed explicitly.

       This also covers keyboard activation: pressing Enter on a link fires a
       click event. */
    nav.addEventListener("click", function (event) {
      var link = event.target && event.target.closest
        ? event.target.closest("a[href]")
        : null;

      if (!link || !nav.contains(link)) {
        return;
      }

      // Collapse first, so the header has already shrunk by the time the
      // browser performs its own scroll to a same-page anchor.
      if (!wideScreen.matches && isOpen) {
        isOpen = false;
        render();
      }

      moveFocusToAnchorTarget(link);
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

  /**
   * When a link points at an anchor in this same document, move keyboard focus
   * to the target after the browser has scrolled to it.
   *
   * Following an in-page anchor moves the viewport but, in most browsers, not
   * the keyboard focus — so a keyboard user is scrolled to a new section while
   * their next Tab continues from the navigation. Moving focus keeps the two
   * in step, which is also what makes SC 2.4.11 hold: focus lands in the
   * region the reader was sent to, below the collapsed header, rather than
   * remaining in a header that may still be overlapping the content.
   *
   * Links to another document are ignored — the new page load handles it.
   *
   * @param {HTMLAnchorElement} link
   */
  function moveFocusToAnchorTarget(link) {
    var href = link.getAttribute("href") || "";
    var hashIndex = href.indexOf("#");

    if (hashIndex === -1) {
      return;
    }

    var id = href.slice(hashIndex + 1);
    if (!id) {
      return;
    }

    // Present in *this* document? A link such as "../../index.html#documentation"
    // has a hash but points elsewhere, and getElementById returns null there.
    var target = document.getElementById(id);
    if (!target) {
      return;
    }

    // Deferred to the end of the task, so the browser's own scroll to the
    // anchor — which respects scroll-padding-top — has already happened.
    window.setTimeout(function () {
      // Section elements are not focusable by default. tabindex="-1" makes
      // them programmatically focusable without adding a tab stop; it is left
      // in place afterwards because it has no effect on tab order.
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      // preventScroll: the browser has already positioned the page correctly;
      // focusing again without this would scroll a second time.
      target.focus({ preventScroll: true });
    }, 0);
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
   * project. It is the file a contributor edits when a tool is added, and
   * the file any external listing should read.
   *
   * On pages that opt in with `data-catalogue-module="<moduleSlug>"`, this
   * function replaces the statically written placeholder with a list built
   * from the catalogue — but only if the catalogue actually contains
   * *published* entries for that module. If the fetch fails (which it will
   * when the page is opened straight from disk over `file://`, because
   * browsers block such requests), or if the module has no published tools,
   * the markup already on the page is left exactly as it is.
   *
   * That ordering matters: the page must never claim a tool exists before it
   * has been published. A tool whose `status` is anything other than
   * "published" — "planned", "in-progress", "draft" — is ignored here, so a
   * work in progress can be recorded in the catalogue without appearing on
   * the site as though it were finished.
   */
  function initCatalogue() {
    var regions = document.querySelectorAll("[data-catalogue-module]");
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
          renderModule(region, catalogue);
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
   * Render the published tools for one module into `region`.
   * @param {Element} region  Element carrying data-catalogue-module.
   * @param {object} catalogue  Parsed contents of data/catalogue.json.
   */
  function renderModule(region, catalogue) {
    var slug = region.getAttribute("data-catalogue-module");
    var modules = (catalogue && catalogue.modules) || [];
    var match = null;

    for (var i = 0; i < modules.length; i += 1) {
      if (modules[i].moduleSlug === slug) {
        match = modules[i];
        break;
      }
    }

    var tools = (match && match.tools) || [];

    // Only finished work is listed. See the note on initCatalogue.
    var published = tools.filter(function (tool) {
      return tool && tool.status === "published";
    });

    if (published.length === 0) {
      // Nothing published yet — leave the placeholder in place.
      return;
    }

    var list = document.createElement("ul");
    list.className = "card-grid";

    published.forEach(function (tool) {
      list.appendChild(buildToolCard(tool, slug));
    });

    region.textContent = "";
    region.appendChild(list);
  }

  /**
   * Build one tool's card from its catalogue entry. Field names follow the
   * metadata standard in CLAUDE.md, so a tool's `metadata.json` and its
   * catalogue entry can be kept identical.
   *
   * Uses textContent rather than innerHTML for every catalogue-supplied
   * string, so catalogue data can never inject markup into the page.
   *
   * @param {object} tool  Catalogue entry: title, summary, toolSlug,
   *   difficulty, estimatedMinutes, and optionally an explicit path.
   * @param {string} moduleSlug  Canonical module slug.
   * @returns {HTMLLIElement}
   */
  function buildToolCard(tool, moduleSlug) {
    var item = document.createElement("li");
    item.className = "card card--" + moduleSlug;

    var heading = document.createElement("h3");
    heading.className = "card__title";

    // Prefer an explicit path, but derive the canonical one when it is
    // absent: modules/<moduleSlug>/tools/<toolSlug>/index.html
    var path = tool.path;
    if (!path && tool.toolSlug) {
      path = "modules/" + moduleSlug + "/tools/" + tool.toolSlug + "/index.html";
    }

    var link = document.createElement("a");
    link.href = fromSiteRoot(path || "");
    link.textContent = tool.title || "Untitled tool";
    heading.appendChild(link);

    var summary = document.createElement("p");
    summary.className = "card__body";
    summary.textContent = tool.summary || "";

    item.appendChild(heading);
    item.appendChild(summary);

    // Optional difficulty / duration metadata, shown only when present.
    var minutes = tool.estimatedMinutes
      ? tool.estimatedMinutes + " minutes"
      : "";
    if (tool.difficulty || minutes) {
      var footer = document.createElement("p");
      footer.className = "card__footer";
      footer.textContent = [tool.difficulty, minutes]
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
