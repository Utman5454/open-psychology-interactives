/* =========================================================================
   Open Psychology Interactives — interactive shell helper
   -------------------------------------------------------------------------
   A very small vanilla-JS helper that every interactive in this collection
   uses. It deliberately does *not* draw anything or know anything about
   statistics, personality or neuropsychology. Its job is the repetitive,
   easy-to-get-wrong accessibility plumbing:

     * announcing changes through a polite live region;
     * keeping a range slider and its <output> in step;
     * wiring the standard Reset button;
     * reporting the reader's reduced-motion preference.

   Usage (see docs/adapting-a-tool.md for the full markup contract):

       <script src="../../components/interactive-shell.js" defer></script>
       <script src="tool.js" defer></script>

       // in tool.js
       const shell = InteractiveShell.attach('#sampling-demo');
       shell.onReset(() => { ...restore defaults...; draw(); });
       shell.bindRange('#sample-size', { format: n => n + ' cases' });
       shell.announce('Sample of 25 drawn. Mean 4.8.');

   No interactive has been built yet; this module is the foundation the
   first one will be written against.

   Exposed as a global (window.InteractiveShell) rather than an ES module so
   that a single interactive folder can be opened directly from disk over
   file:// — ES modules are blocked by CORS in that situation, plain scripts
   are not. That constraint is the whole reason for the older syntax here.
   ========================================================================= */

(function (global) {
  "use strict";

  /* -----------------------------------------------------------------------
     Internal helpers
     --------------------------------------------------------------------- */

  /**
   * Accept either a CSS selector or an element and return an element.
   * @param {string|Element} target
   * @param {ParentNode} [scope]
   * @returns {Element|null}
   */
  function resolve(target, scope) {
    if (!target) {
      return null;
    }
    if (typeof target === "string") {
      return (scope || document).querySelector(target);
    }
    return target;
  }

  /**
   * True when the reader has asked the operating system to reduce motion.
   * Interactives should check this before animating anything — for example
   * by drawing a sampling distribution in one step instead of animating
   * each draw.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return (
      typeof global.matchMedia === "function" &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /* -----------------------------------------------------------------------
     Shell controller
     --------------------------------------------------------------------- */

  /**
   * Attach the shell behaviour to one `.interactive` element.
   *
   * @param {string|Element} target  Selector or element for the shell root.
   * @returns {object|null}  Controller, or null if the root was not found.
   */
  function attach(target) {
    var root = resolve(target);

    if (!root) {
      if (global.console && console.warn) {
        console.warn("InteractiveShell: root element not found.", target);
      }
      return null;
    }

    var controls = root.querySelector("[data-interactive-controls]");
    var stage = root.querySelector("[data-interactive-stage]");
    var status = root.querySelector("[data-interactive-status]");
    var resetButton = root.querySelector("[data-interactive-reset]");
    var resetHandlers = [];
    // Every range bound with bindRange() registers its sync function here, so
    // that reset() can refresh the visible values after the tool's own reset
    // handlers have restored the inputs. See reset() for why this is needed.
    var rangeSyncs = [];

    /* --- Live region ----------------------------------------------------
       The status element is marked up as role="status" (implicitly
       aria-live="polite"). Two details matter:

         1. Assistive technology only announces *changes* to a live region,
            so writing the same string twice is silently dropped. We add a
            trailing zero-width space on repeat messages to force an
            announcement when a student re-runs the same action.
         2. Announcements are debounced. A slider dragged across its range
            fires dozens of input events; without a delay a screen reader
            would queue every intermediate value and fall far behind.
       ------------------------------------------------------------------ */

    var announceTimer = null;
    var lastMessage = "";

    /**
     * Announce a short sentence describing what just changed.
     * @param {string} message
     * @param {object} [options]
     * @param {boolean} [options.immediate]  Skip the debounce delay. Use for
     *   discrete actions (button presses); leave off for continuous input.
     */
    function announce(message, options) {
      if (!status) {
        return;
      }

      var text = String(message == null ? "" : message);
      var immediate = Boolean(options && options.immediate);

      if (announceTimer !== null) {
        global.clearTimeout(announceTimer);
        announceTimer = null;
      }

      function write() {
        // Force a change when the text is identical to last time.
        status.textContent = text === lastMessage ? text + "​" : text;
        lastMessage = text;
      }

      if (immediate) {
        write();
      } else {
        announceTimer = global.setTimeout(write, 350);
      }
    }

    /* --- Reset ---------------------------------------------------------- */

    /**
     * Register a callback to run when the Reset button is pressed.
     * Several may be registered; they run in the order added.
     * @param {Function} handler
     */
    function onReset(handler) {
      if (typeof handler === "function") {
        resetHandlers.push(handler);
      }
    }

    /**
     * Run the reset handlers. Called by the button and available directly so
     * an interactive can reset itself on first load.
     *
     * Bound ranges are re-synced afterwards. A reset handler restores an
     * input by assigning to `input.value`, and assigning to a value in script
     * does not fire an `input` event — so without this step the slider would
     * jump back to its default while its <output> went on showing the old
     * number. Syncing here, after the handlers have run, also means the sync
     * sees the restored values regardless of the order things were
     * registered in.
     *
     * @param {object} [options]
     * @param {boolean} [options.silent]  Suppress the status announcement.
     */
    function reset(options) {
      resetHandlers.forEach(function (handler) {
        handler();
      });
      rangeSyncs.forEach(function (sync) {
        sync();
      });
      if (!options || !options.silent) {
        announce(
          root.getAttribute("data-reset-message") ||
            "Reset to the starting values.",
          { immediate: true }
        );
      }
    }

    if (resetButton) {
      resetButton.addEventListener("click", function (event) {
        // Reset buttons commonly sit inside the controls <form>; stop the
        // browser's own form reset from fighting with ours.
        event.preventDefault();
        reset();
      });
    }

    /* --- Range binding --------------------------------------------------
       Keeps a slider's <output> in step with its value. The <output> must
       carry `for="<input id>"`, which is what associates the two for
       assistive technology; this only handles the visible text.

       Optionally sets aria-valuetext, which is how you make a screen reader
       say "25 cases" or "medium correlation" instead of a bare "25".
       ------------------------------------------------------------------ */

    /**
     * @param {string|Element} inputTarget  The range (or number) input.
     * @param {object} [options]
     * @param {Function} [options.format]  value:number -> string shown in the
     *   <output>. Defaults to the raw value.
     * @param {Function} [options.describe]  value:number -> string used for
     *   aria-valuetext. Defaults to options.format.
     * @param {Function} [options.onInput]  value:number -> void, called after
     *   the display has been updated. Use it to redraw.
     * @returns {HTMLInputElement|null}
     */
    function bindRange(inputTarget, options) {
      var input = resolve(inputTarget, root);
      if (!input) {
        return null;
      }

      var settings = options || {};
      var format =
        typeof settings.format === "function"
          ? settings.format
          : function (value) {
              return String(value);
            };
      var describe =
        typeof settings.describe === "function" ? settings.describe : format;

      // <output for="the-input-id"> is the conventional pairing.
      var output = input.id
        ? root.querySelector('output[for="' + input.id + '"]')
        : null;

      function sync() {
        var value = Number(input.value);
        if (output) {
          output.textContent = format(value);
        }
        // Only meaningful for widgets with an implicit or explicit slider
        // role; harmless elsewhere.
        input.setAttribute("aria-valuetext", describe(value));
        if (typeof settings.onInput === "function") {
          settings.onInput(value);
        }
      }

      input.addEventListener("input", sync);
      // Registered so reset() can refresh the display after the tool's own
      // reset handlers have put the input back to its default.
      rangeSyncs.push(sync);
      sync();

      return input;
    }

    /* --- Public surface -------------------------------------------------- */

    return {
      /** The `.interactive` root element. */
      root: root,
      /** The controls panel, or null if the shell has none. */
      controls: controls,
      /** The stage element where the visualisation is drawn. */
      stage: stage,
      /** The live-region element. */
      status: status,
      announce: announce,
      onReset: onReset,
      reset: reset,
      bindRange: bindRange,
      prefersReducedMotion: prefersReducedMotion
    };
  }

  /* -----------------------------------------------------------------------
     Export
     --------------------------------------------------------------------- */

  global.InteractiveShell = {
    attach: attach,
    prefersReducedMotion: prefersReducedMotion
  };
})(window);
