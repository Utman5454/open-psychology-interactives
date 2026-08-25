/* =========================================================================
   Open Psychology Interactives — Simplified Edition
   workbook.js — shared activity mechanics
   -------------------------------------------------------------------------
   A small vanilla helper for the Simplified Edition. Like the original
   edition's `interactive-shell.js`, it deliberately knows nothing about
   psychology, statistics or scoring. Its job is the repetitive,
   easy-to-get-wrong plumbing that the golden references hand-roll in every
   file and that is easy to get subtly wrong each time:

     * announcing a change through a polite live region;
     * keeping the progress strip's visual state, `aria-current` and its
       text equivalent in step with one another;
     * marking a chosen option without letting colour carry the meaning,
       and locking answered options without dropping them out of the
       tab order;
     * showing and hiding sections;
     * scrolling somewhere without ignoring a reduced-motion preference;
     * wiring a Reset button;
     * keeping a range input and its <output> in agreement.

   What it deliberately does NOT do
   --------------------------------
   It does not impose a structure. There is no notion of a "round", a
   "question", a "correct answer" or a score anywhere in this file, and
   nothing here assumes an activity is multiple choice. Three of the seven
   golden references present no choices at all — one is a timed estimation
   task, one is a cumulative reveal with a single button, one is a recap —
   and the edition is weaker if every activity is pushed into the same shape.
   Every part of the controller is optional: an activity that has no progress
   strip, no choices and no ranges still gets a working controller.

   Exposed as a global rather than an ES module, for the same reason
   `interactive-shell.js` is: ES modules are blocked by CORS over `file://`,
   plain scripts are not, and a downloaded folder has to keep working.

   Written in the same conservative syntax as the rest of the collection —
   `var`, no arrow functions, no template literals — so that no build step or
   transpiler is ever needed.

   Usage:

       <script src="../../../../assets/js/workbook.js" defer></script>
       <script src="activity.js" defer></script>

       var wb = Workbook.attach('[data-workbook]');
       wb.progress.set(0);
       wb.choices.mark(button, 'correct');
       wb.choices.lock(grid);
       wb.announce('Recorded. Two more to go.');
       wb.show('#synthesis');
       wb.scrollTo('#synthesis', { focus: true });
   ========================================================================= */

(function (global) {
  "use strict";

  var VERSION = "1.0.0";

  /* The sentence added, invisibly, beside an option whose state has been
     set. The glyph and the border style in patterns.css are the visual half
     of the same signal; this is the half a screen reader gets. Override per
     call where an activity has better wording for its own material. */
  var CHOICE_NOTES = {
    chosen: "Selected.",
    correct: "This is the best-supported answer.",
    partial: "This is a defensible answer, but another reading fits better.",
    incorrect: "This is the answer you gave."
  };

  var DEFAULT_DONE_NOTE = "completed";
  var DEFAULT_RESET_MESSAGE = "Back to the start.";

  /* -----------------------------------------------------------------------
     Internal helpers
     --------------------------------------------------------------------- */

  function warn(message, detail) {
    if (global.console && global.console.warn) {
      global.console.warn("Workbook: " + message, detail);
    }
  }

  /**
   * Accept a CSS selector or an element and return an element.
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

  function toArray(collection) {
    return Array.prototype.slice.call(collection || []);
  }

  /**
   * True when the reader has asked the operating system to reduce motion.
   * Checked before every programmatic scroll. The golden references call
   * scrollIntoView({behavior:'smooth'}) unconditionally, which is exactly
   * the animation this preference exists to switch off.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return (
      typeof global.matchMedia === "function" &&
      global.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /**
   * Nearest ancestor-or-self matching a selector. Written out rather than
   * calling Element.closest directly so that a browser without it degrades
   * to "no match" instead of throwing.
   */
  function closestMatch(element, selector) {
    var node = element;
    while (node && node.nodeType === 1) {
      if (typeof node.matches === "function" && node.matches(selector)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  /**
   * Set, replace or remove the visually hidden note attached to an element.
   * One note per element, always the last child, so it reads after the
   * element's own text rather than interrupting it.
   */
  function setHiddenNote(element, text) {
    // A direct-child scan rather than `:scope >`, so a note belonging to a
    // nested element is never mistaken for this element's own.
    var note = null;
    var child = element.firstElementChild;

    while (child) {
      if (child.hasAttribute("data-workbook-note")) {
        note = child;
        break;
      }
      child = child.nextElementSibling;
    }

    if (!text) {
      if (note && note.parentNode) {
        note.parentNode.removeChild(note);
      }
      return;
    }

    if (!note) {
      note = document.createElement("span");
      note.className = "visually-hidden";
      note.setAttribute("data-workbook-note", "");
      element.appendChild(note);
    }

    note.textContent = " " + text;
  }

  /**
   * Move keyboard focus to an element that is not normally focusable, so
   * that revealing a new section takes the reader there rather than leaving
   * them at the button they just pressed.
   */
  function focusElement(element) {
    if (!element) {
      return null;
    }
    if (!element.hasAttribute("tabindex")) {
      // -1 makes it programmatically focusable without adding a tab stop.
      element.setAttribute("tabindex", "-1");
    }
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
    return element;
  }

  /* -----------------------------------------------------------------------
     Controller
     --------------------------------------------------------------------- */

  /**
   * Attach the shared mechanics to one activity root.
   *
   * @param {string|Element} target  Selector or element, conventionally the
   *   element carrying `data-workbook`.
   * @returns {object|null}  Controller, or null if the root was not found.
   */
  function attach(target) {
    var root = resolve(target);

    if (!root) {
      warn("root element not found.", target);
      return null;
    }

    var statusRegion = root.querySelector("[data-workbook-status]");
    var progressList = root.querySelector("[data-workbook-progress]");
    var resetHandlers = [];
    var rangeSyncs = [];
    var announceTimer = null;

    /* --- aria-disabled guard -------------------------------------------
       Answered options are marked `aria-disabled="true"` rather than
       `disabled`, so a keyboard reader can still tab back through them and
       re-read why one option was the better fit. The attribute carries no
       behaviour of its own, so activation has to be swallowed here. One
       delegated capture-phase listener covers every such control in the
       activity, including any added later. */

    function isInert(node) {
      return closestMatch(node, '[aria-disabled="true"]');
    }

    root.addEventListener(
      "click",
      function (event) {
        if (isInert(event.target)) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    root.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
          return;
        }
        if (isInert(event.target)) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );

    /* --- Announcements -------------------------------------------------- */

    /**
     * Write one short sentence to the activity's live region.
     *
     * Clearing the region and writing on a later tick is what makes the
     * same message announce twice — assistive technology ignores a write
     * that leaves the text unchanged, which matters when the learner
     * repeats an action and gets the same result.
     *
     * @param {string} message
     * @param {{assertive?: boolean}} [options]
     */
    function announce(message, options) {
      if (!statusRegion) {
        return;
      }

      var settings = options || {};

      statusRegion.setAttribute(
        "aria-live",
        settings.assertive ? "assertive" : "polite"
      );

      global.clearTimeout(announceTimer);
      statusRegion.textContent = "";
      announceTimer = global.setTimeout(function () {
        statusRegion.textContent = message;
      }, 60);
    }

    /* --- Progress -------------------------------------------------------
       The strip is an ordered list, so its length and position are already
       available without sight of the tint. This keeps three things in
       agreement that the references keep in only one: the visual state, the
       `aria-current` flag, and a text note on each completed step. */

    var steps = progressList ? toArray(progressList.children) : [];
    var doneNote = progressList
      ? progressList.getAttribute("data-workbook-done-label") || DEFAULT_DONE_NOTE
      : DEFAULT_DONE_NOTE;
    var currentStep = -1;

    function paintProgress(current) {
      currentStep = current;

      steps.forEach(function (step, index) {
        var state = index < current ? "done" : index === current ? "current" : "todo";

        step.setAttribute("data-state", state);

        if (state === "current") {
          step.setAttribute("aria-current", "step");
        } else {
          step.removeAttribute("aria-current");
        }

        setHiddenNote(step, state === "done" ? doneNote : "");
      });
    }

    var progress = {
      /** The step elements, in order. Empty when the activity has no strip. */
      steps: steps,

      /** @returns {number} zero-based index of the current step, or -1. */
      current: function () {
        return currentStep;
      },

      /**
       * Mark step `index` as current; everything before it is completed,
       * everything after it is still to come.
       * @param {number} index
       */
      set: function (index) {
        paintProgress(index);
        return progress;
      },

      /** Mark every step completed. Use when the activity finishes. */
      markAllDone: function () {
        paintProgress(steps.length);
        return progress;
      },

      /** Back to the first step, nothing completed. */
      reset: function () {
        paintProgress(0);
        return progress;
      }
    };

    /* --- Choices --------------------------------------------------------
       Generic enough for any activity that has things to pick between, and
       required by none. `state` is one of "chosen", "correct", "incorrect",
       or null to clear. */

    var choices = {
      /**
       * @param {string|Element} target
       * @param {string|null} state
       * @param {{note?: string}} [options]
       */
      mark: function (target, state, options) {
        var element = resolve(target, root);
        if (!element) {
          warn("choice element not found.", target);
          return null;
        }

        var settings = options || {};

        if (!state) {
          element.removeAttribute("data-state");
          setHiddenNote(element, "");
          return element;
        }

        element.setAttribute("data-state", state);
        setHiddenNote(
          element,
          settings.note !== undefined ? settings.note : CHOICE_NOTES[state] || ""
        );

        return element;
      },

      /**
       * Lock every `[data-choice]` in `container`, keeping it focusable.
       * @param {string|Element} [container]  Defaults to the activity root.
       */
      lock: function (container) {
        var scope = resolve(container, root) || root;
        toArray(scope.querySelectorAll("[data-choice]")).forEach(function (element) {
          element.setAttribute("aria-disabled", "true");
        });
        return scope;
      },

      /** Undo `lock`. */
      unlock: function (container) {
        var scope = resolve(container, root) || root;
        toArray(scope.querySelectorAll("[data-choice]")).forEach(function (element) {
          element.removeAttribute("aria-disabled");
        });
        return scope;
      },

      /** Unlock and clear every state and note. */
      clear: function (container) {
        var scope = resolve(container, root) || root;
        toArray(scope.querySelectorAll("[data-choice]")).forEach(function (element) {
          element.removeAttribute("aria-disabled");
          element.removeAttribute("data-state");
          setHiddenNote(element, "");
        });
        return scope;
      }
    };

    /* --- Visibility ----------------------------------------------------
       The `hidden` attribute rather than a class, so the visual state and
       what assistive technology is told can never disagree. */

    function toggle(target, on) {
      var element = resolve(target, root);
      if (!element) {
        warn("element to show or hide not found.", target);
        return null;
      }
      element.hidden = !on;
      return element;
    }

    function show(target) {
      return toggle(target, true);
    }

    function hide(target) {
      return toggle(target, false);
    }

    /* --- Scrolling ------------------------------------------------------ */

    /**
     * Scroll an element into view, smoothly unless the reader has asked for
     * reduced motion.
     * @param {string|Element} target
     * @param {{block?: string, focus?: boolean}} [options]
     */
    function scrollTo(target, options) {
      var element = resolve(target, root) || resolve(target);
      if (!element) {
        warn("scroll target not found.", target);
        return null;
      }

      var settings = options || {};

      if (typeof element.scrollIntoView === "function") {
        try {
          element.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: settings.block || "start"
          });
        } catch (error) {
          // Older engines accept only the boolean form.
          element.scrollIntoView(true);
        }
      }

      if (settings.focus) {
        focusElement(element);
      }

      return element;
    }

    /* --- Ranges ---------------------------------------------------------
       Lifted from the original edition's shell, because the problem is the
       same: a slider whose printed value drifts out of step with it is worse
       than no printed value at all. */

    /**
     * Keep a range input and its `<output for="...">` in agreement.
     * @param {string|Element} target
     * @param {{format?: function, output?: string|Element}} [options]
     */
    function bindRange(target, options) {
      var input = resolve(target, root);
      if (!input) {
        warn("range input not found.", target);
        return null;
      }

      var settings = options || {};
      var output = null;

      if (input.id) {
        output = root.querySelector('output[for="' + input.id + '"]');
      }
      if (!output && settings.output) {
        output = resolve(settings.output, root);
      }

      var format =
        typeof settings.format === "function"
          ? settings.format
          : function (value) {
              return value;
            };

      function sync() {
        if (output) {
          output.textContent = format(input.value, input);
        }
      }

      input.addEventListener("input", sync);
      rangeSyncs.push(sync);
      sync();

      return { input: input, output: output, sync: sync };
    }

    /* --- Reset ----------------------------------------------------------
       Every `[data-workbook-reset]` inside the activity is wired. The
       message comes from `data-reset-message` on the root, so it can say
       something specific without any JavaScript. */

    function onReset(handler) {
      if (typeof handler === "function") {
        resetHandlers.push(handler);
      }
    }

    function reset(options) {
      var settings = options || {};

      resetHandlers.forEach(function (handler) {
        try {
          handler();
        } catch (error) {
          warn("a reset handler threw.", error);
        }
      });

      rangeSyncs.forEach(function (sync) {
        sync();
      });

      if (settings.announce !== false) {
        announce(
          root.getAttribute("data-reset-message") || DEFAULT_RESET_MESSAGE
        );
      }
    }

    toArray(root.querySelectorAll("[data-workbook-reset]")).forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        reset();
      });
    });

    /* --- Scrollable figures ---------------------------------------------
       A region that scrolls has to be reachable from the keyboard, or the
       content past its right edge cannot be read without a mouse. The tab
       stop is added only while the region actually overflows, so a figure
       that fits adds nothing to the tab order. Re-checked on resize because
       whether it overflows depends on the viewport. */

    /**
     * Empty a figure of everything it has drawn, keeping its `<title>` and
     * `<desc>`.
     *
     * Counting childNodes and trimming to a fixed number is the obvious way
     * to do this and it is wrong. A browser creates a text node for the
     * whitespace between `<title>` and `<desc>` in the markup, so the count
     * is larger than the number of elements and the trim silently deletes the
     * `<desc>`. The figure then keeps working, because the caller still holds
     * a reference to the now-detached element and can still set its text, but
     * `aria-labelledby` points at an id that is no longer in the document and
     * the description is gone for exactly the readers it was written for.
     *
     * @param {string|Element} target
     */
    function clearFigure(target) {
      var figure = resolve(target, root);
      if (!figure) {
        warn("figure not found.", target);
        return null;
      }
      toArray(figure.childNodes).forEach(function (node) {
        if (node.nodeType !== 1) { return; }
        var tag = String(node.tagName || "").toLowerCase();
        if (tag === "title" || tag === "desc") { return; }
        figure.removeChild(node);
      });
      return figure;
    }

    function updateScrollableFigures() {
      toArray(root.querySelectorAll(".plot")).forEach(function (figure) {
        var scrolls = figure.scrollWidth > figure.clientWidth + 1;
        if (scrolls) {
          figure.setAttribute("tabindex", "0");
          figure.setAttribute("role", "group");
          if (!figure.getAttribute("aria-label")) {
            figure.setAttribute("aria-label", "Figure, scrolls sideways");
          }
        } else {
          figure.removeAttribute("tabindex");
          figure.removeAttribute("role");
          figure.removeAttribute("aria-label");
        }
      });
    }

    global.addEventListener("resize", updateScrollableFigures);

    /* --- Starting state ------------------------------------------------- */

    if (steps.length) {
      paintProgress(0);
    }

    updateScrollableFigures();

    return {
      version: VERSION,
      root: root,
      announce: announce,
      progress: progress,
      choices: choices,
      show: show,
      hide: hide,
      toggle: toggle,
      scrollTo: scrollTo,
      focus: focusElement,
      bindRange: bindRange,
      refreshFigures: updateScrollableFigures,
      clearFigure: clearFigure,
      onReset: onReset,
      reset: reset,
      prefersReducedMotion: prefersReducedMotion
    };
  }

  global.Workbook = {
    version: VERSION,
    attach: attach,
    prefersReducedMotion: prefersReducedMotion
  };
})(window);
