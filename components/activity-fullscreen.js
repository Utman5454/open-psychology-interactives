/* =========================================================================
   Open Psychology Interactives — full-screen control for one activity
   -------------------------------------------------------------------------
   Puts a single activity full screen, which matters most when it has been
   embedded in a teaching page: the surrounding page furniture goes away and
   the interactive gets the whole display.

   Unlike the "Copy activity HTML" control, this one *is* part of the copied
   payload. A lecturer who pastes an activity into their own page should still
   be able to expand it, so scripts/build-standalone.py keeps this block and
   inlines this script.

   Markup contract:

       <div class="activity-utilities" data-activity-fullscreen>
         <button type="button" data-fullscreen-toggle
                 aria-pressed="false">Full screen</button>
       </div>

   The element that goes full screen is the closest `.opi-activity` wrapper if
   there is one — which is the case in an exported copy — and otherwise the
   nearest `.interactive` or the page's <main>. That is what keeps the site
   version from putting the whole page, header and footer included, full
   screen.

   Exposed as a global rather than an ES module, for the same reason as the
   rest of the collection: a tool folder opened straight from disk over file://
   cannot load modules.
   ========================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;

  var LABEL_ENTER = "Full screen";
  var LABEL_EXIT = "Exit full screen";

  /* -----------------------------------------------------------------------
     Feature detection
     -----------------------------------------------------------------------
     Two separate questions, and they have different answers:

       * does this browser have the API at all?
       * is this document *permitted* to use it?

     An <iframe> without `allow="fullscreen"` has the methods but every call
     rejects. `document.fullscreenEnabled` is the check for permission, and it
     is the one that matters in a VLE, where the activity may well be inside a
     sandboxed frame. When it says no, the control is removed rather than left
     to fail on click.
     --------------------------------------------------------------------- */

  function apiFor(element) {
    if (element.requestFullscreen) {
      return {
        request: "requestFullscreen",
        exit: "exitFullscreen",
        element: "fullscreenElement",
        enabled: "fullscreenEnabled",
        event: "fullscreenchange",
        error: "fullscreenerror"
      };
    }
    if (element.webkitRequestFullscreen) {
      return {
        request: "webkitRequestFullscreen",
        exit: "webkitExitFullscreen",
        element: "webkitFullscreenElement",
        enabled: "webkitFullscreenEnabled",
        event: "webkitfullscreenchange",
        error: "webkitfullscreenerror"
      };
    }
    return null;
  }

  /* -----------------------------------------------------------------------
     Wiring
     --------------------------------------------------------------------- */

  /**
   * The element that should fill the screen: the exported wrapper when there
   * is one, else the interactive, else <main>. Never <body>, because on the
   * site that would take the header and footer with it.
   * @param {Element} button
   * @returns {Element|null}
   */
  function targetFor(button) {
    return (
      button.closest(".opi-activity") ||
      doc.querySelector(".opi-activity") ||
      button.closest("main") ||
      doc.querySelector(".interactive") ||
      doc.querySelector("main")
    );
  }

  function initButton(button) {
    var target = targetFor(button);
    if (!target) {
      return;
    }

    var api = apiFor(target);
    var container = button.closest("[data-activity-fullscreen]") || button.parentNode;

    // No API, or the frame is not allowed to use it: remove the control
    // rather than leave something that looks pressable and is not.
    if (!api || doc[api.enabled] === false) {
      if (container && container.hasAttribute("data-activity-fullscreen")) {
        container.hidden = true;
      } else {
        button.hidden = true;
      }
      return;
    }

    /* A polite live region, because the label change on a button the reader
       has just pressed is announced inconsistently, and entering full screen
       is a large change of context. */
    var live = doc.createElement("p");
    live.className = "visually-hidden";
    live.setAttribute("role", "status");
    container.appendChild(live);

    function isActive() {
      return doc[api.element] === target;
    }

    function render() {
      var active = isActive();
      button.textContent = active ? LABEL_EXIT : LABEL_ENTER;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      target.setAttribute("data-fullscreen", active ? "on" : "off");
    }

    button.addEventListener("click", function () {
      if (isActive()) {
        if (doc[api.exit]) { doc[api.exit](); }
        return;
      }
      var result;
      try {
        result = target[api.request]();
      } catch (error) {
        result = null;
      }
      // Blocked by permissions policy, or refused because the click was not
      // treated as a user gesture. Say so once and leave the control alone.
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          live.textContent =
            "This page is not allowed to use full screen. Open the activity " +
            "in its own tab instead.";
        });
      }
    });

    /* Driven by the event, not by the click, so that leaving full screen with
       Escape — which fires no click — updates the label too. */
    doc.addEventListener(api.event, function () {
      render();
      if (doc[api.element] === target) {
        live.textContent = "Full screen. Press Escape to leave it.";
        // Keep the keyboard where it was. The button travels into full
        // screen with the activity, so it can hold focus.
        if (doc.activeElement === doc.body) { button.focus(); }
      } else if (button.getAttribute("aria-pressed") === "false") {
        live.textContent = "";
      }
    });

    doc.addEventListener(api.error, function () {
      live.textContent = "Full screen could not be started.";
      render();
    });

    render();
  }

  function init() {
    var buttons = doc.querySelectorAll("[data-fullscreen-toggle]");
    Array.prototype.forEach.call(buttons, initButton);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.ActivityFullscreen = { init: init };
})(window);
