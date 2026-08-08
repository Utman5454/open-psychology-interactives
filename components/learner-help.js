/* =========================================================================
   Open Psychology Interactives — optional learner support
   -------------------------------------------------------------------------
   Drives the "Need a hand?" disclosure: a step-at-a-time guide that points a
   learner at the part of the activity they should be looking at, and a short
   glossary. Both are optional and collapsed, so a learner who is not stuck
   sees the page they would have seen anyway.

   This is learner support, not repository furniture, so it travels into an
   exported copy. scripts/build-standalone.py inlines this file for any tool
   whose markup contains data-learner-help.

   What it deliberately does not do
   --------------------------------
     * change a control on the learner's behalf - the steps ask them to do it,
       because the point is that they act and then look;
     * say whether a prediction was right;
     * state the conclusion the activity exists to produce. Step 4 and step 5
       ask what happened; they do not answer it.

   Markup contract:

       <details class="helper" data-learner-help>
         <summary>Need a hand?</summary>
         ...
         <button data-guide-start>Show me what to do</button>
         <div data-guide hidden>
           <p data-guide-progress></p>
           <div data-guide-text tabindex="-1" aria-live="polite"></div>
           <button data-guide-prev>Back</button>
           <button data-guide-next>Next</button>
           <button data-guide-close>Close</button>
         </div>
       </details>

   Steps come from a <script type="application/json" data-guide-steps> block
   inside the disclosure, so the copy is content rather than code: each entry
   is {"text": "...", "target": "<css selector>"} and `target` is optional.

   Exposed as a global rather than an ES module, for the same reason as the
   rest of the collection: a tool folder opened from disk over file:// cannot
   load modules.
   ========================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;

  /** Marks the element a step is pointing at. Outline, not border: an outline
      is drawn outside the box and shifts nothing. */
  var HIGHLIGHT_ATTRIBUTE = "data-guide-target";

  function parseSteps(root) {
    var holder = root.querySelector("[data-guide-steps]");
    if (!holder) {
      return [];
    }
    try {
      var parsed = JSON.parse(holder.textContent);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      if (global.console && console.warn) {
        console.warn("learner-help: could not parse the guide steps.", error);
      }
      return [];
    }
  }

  function init(root) {
    var steps = parseSteps(root);
    var startButton = root.querySelector("[data-guide-start]");
    var guide = root.querySelector("[data-guide]");
    var textBox = root.querySelector("[data-guide-text]");
    var progress = root.querySelector("[data-guide-progress]");
    var prev = root.querySelector("[data-guide-prev]");
    var next = root.querySelector("[data-guide-next]");
    var close = root.querySelector("[data-guide-close]");

    if (!steps.length || !startButton || !guide || !textBox) {
      // Nothing to drive. Leave the glossary alone — it is plain markup and
      // works without any of this.
      if (startButton) {
        startButton.hidden = true;
      }
      return;
    }

    var index = 0;
    var highlighted = null;

    function clearHighlight() {
      if (highlighted) {
        highlighted.removeAttribute(HIGHLIGHT_ATTRIBUTE);
        highlighted = null;
      }
    }

    /**
     * The highlight is decoration. Every step names its target in words, so a
     * reader who never sees the outline is not missing an instruction.
     */
    function highlight(selector) {
      clearHighlight();
      if (!selector) {
        return;
      }
      var target = doc.querySelector(selector);
      if (!target) {
        return;
      }
      target.setAttribute(HIGHLIGHT_ATTRIBUTE, "");
      highlighted = target;
    }

    function render() {
      var step = steps[index];
      textBox.textContent = step.text;
      if (progress) {
        progress.textContent = "Step " + (index + 1) + " of " + steps.length;
      }
      if (prev) {
        prev.disabled = index === 0;
      }
      if (next) {
        next.disabled = index === steps.length - 1;
      }
      highlight(step.target);
    }

    function open() {
      index = 0;
      guide.hidden = false;
      startButton.hidden = true;
      render();
      // Focus the step itself: the reader hears the step, and the buttons
      // follow it in document order.
      textBox.focus();
    }

    function shut(options) {
      guide.hidden = true;
      startButton.hidden = false;
      clearHighlight();
      if (!options || options.restoreFocus !== false) {
        startButton.focus();
      }
    }

    startButton.addEventListener("click", open);

    if (next) {
      next.addEventListener("click", function () {
        if (index < steps.length - 1) {
          index += 1;
          render();
        }
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        if (index > 0) {
          index -= 1;
          render();
        }
      });
    }

    if (close) {
      close.addEventListener("click", function () {
        shut();
      });
    }

    /* Collapsing the disclosure must take the highlight with it, or an outline
       is left sitting on a control with nothing on screen explaining it. */
    root.addEventListener("toggle", function () {
      if (!root.open) {
        shut({ restoreFocus: false });
      }
    });
  }

  function initAll() {
    var roots = doc.querySelectorAll("[data-learner-help]");
    Array.prototype.forEach.call(roots, init);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  global.LearnerHelp = { init: initAll };
})(window);
