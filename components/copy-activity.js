/* =========================================================================
   Open Psychology Interactives — copy one activity as standalone HTML
   -------------------------------------------------------------------------
   Puts a self-contained copy of a single activity on the clipboard, so that a
   lecturer can paste it into their own teaching page and run it there without
   this repository.

   The copy is not assembled here. `scripts/build-standalone.py` generates a
   `standalone.html` beside each tool and that file is committed; this script
   only fetches it and writes it to the clipboard. Generating the artefact
   offline means it can be reviewed in a diff, opened directly and tested like
   any other page, and it means the copy never depends on what the learner has
   already clicked — a DOM snapshot taken at press time would carry whatever
   state the page happened to be in.

   Markup contract:

       <div class="activity-export" data-activity-export>
         <button type="button" data-copy-activity="standalone.html">
           Copy activity HTML
         </button>
         <p class="activity-export__note" data-copy-activity-note>…</p>
       </div>

   `scripts/build-standalone.py` strips the whole `[data-activity-export]` block
   out of the export, so a copied activity never carries its own copy button.

   Exposed as a global rather than an ES module, for the same reason as the
   shell: a tool folder opened straight from disk over file:// cannot load
   modules, and the collection promises those folders keep working.
   ========================================================================= */

(function (global) {
  "use strict";

  var doc = global.document;

  /** How long the confirmation stays before the label reverts. */
  var FEEDBACK_MS = 2400;

  /* -----------------------------------------------------------------------
     Clipboard
     -----------------------------------------------------------------------
     Two routes, because the modern one is not always available:

       * navigator.clipboard needs a secure context. https and localhost
         qualify; a page served over plain http from a LAN address does not,
         and neither does file://.
       * document.execCommand("copy") is deprecated but still works in every
         current browser and has no secure-context requirement. It needs the
         text to be inside a selected, focused element in the document, hence
         the temporary textarea.

     The textarea is positioned off-screen rather than hidden, because a
     display:none or hidden element cannot hold a selection.
     --------------------------------------------------------------------- */

  /**
   * @param {string} text
   * @returns {Promise<void>}  Rejects when both routes fail.
   */
  function writeToClipboard(text) {
    if (global.navigator && global.navigator.clipboard &&
        global.isSecureContext !== false) {
      return global.navigator.clipboard.writeText(text)
        .catch(function () {
          return legacyCopy(text);
        });
    }
    return legacyCopy(text);
  }

  /**
   * @param {string} text
   * @returns {Promise<void>}
   */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.setAttribute("aria-hidden", "true");
      area.setAttribute("tabindex", "-1");
      area.style.cssText =
        "position:fixed;top:0;left:-9999px;width:1px;height:1px;opacity:0;";
      doc.body.appendChild(area);

      // Restore whatever had focus, so the keyboard user is not dropped back
      // at the top of the document.
      var previous = doc.activeElement;
      var ok = false;
      try {
        area.select();
        area.setSelectionRange(0, area.value.length);
        ok = doc.execCommand("copy");
      } catch (error) {
        ok = false;
      }
      area.remove();
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
      if (ok) {
        resolve();
      } else {
        reject(new Error("Clipboard unavailable"));
      }
    });
  }

  /* -----------------------------------------------------------------------
     Wiring
     --------------------------------------------------------------------- */

  /**
   * @param {HTMLButtonElement} button
   */
  function initButton(button) {
    var source = button.getAttribute("data-copy-activity");
    if (!source) {
      return;
    }

    var container = button.closest("[data-activity-export]") || button.parentNode;
    var note = container
      ? container.querySelector("[data-copy-activity-note]")
      : null;
    var defaultLabel = button.textContent.trim();
    var defaultNote = note ? note.innerHTML : "";
    var revertTimer = null;
    /* Re-entry is guarded with a flag rather than by disabling the button.
       Disabling a focused control moves focus to <body>, and a disabled
       button cannot be given it back — a keyboard user would press the button
       and be silently dumped at the top of the document. */
    var busy = false;

    /* The confirmation is written both to the button and to a polite live
       region. Changing a focused button's own label is announced
       inconsistently across screen readers, and the copy is a discrete action
       a keyboard user has just triggered, so it deserves a reliable one. */
    var live = doc.createElement("p");
    live.className = "visually-hidden";
    live.setAttribute("role", "status");
    container.appendChild(live);

    /**
     * @param {string} label   Text for the button.
     * @param {string} message Sentence for the live region and the note.
     * @param {string} tone    "ok" | "error" | ""
     */
    function feedback(label, message, tone) {
      button.textContent = label;
      if (tone) {
        button.setAttribute("data-copy-state", tone);
      } else {
        button.removeAttribute("data-copy-state");
      }
      live.textContent = message;
      if (note && message) {
        note.textContent = message;
      }
    }

    function revert() {
      button.textContent = defaultLabel;
      button.removeAttribute("data-copy-state");
      button.removeAttribute("aria-busy");
      if (note) {
        note.innerHTML = defaultNote;
      }
      live.textContent = "";
    }

    function schedule() {
      if (revertTimer !== null) {
        global.clearTimeout(revertTimer);
      }
      revertTimer = global.setTimeout(revert, FEEDBACK_MS);
    }

    /**
     * When neither the fetch nor the clipboard can be used, stop pretending
     * and hand the reader the file. This is the file:// case: a tool folder
     * opened by double-clicking cannot fetch its own sibling.
     */
    function offerDirectLink() {
      if (revertTimer !== null) {
        global.clearTimeout(revertTimer);
        revertTimer = null;
      }
      button.textContent = defaultLabel;
      button.removeAttribute("data-copy-state");
      button.removeAttribute("aria-busy");
      if (!note) {
        return;
      }
      note.textContent = "";
      var link = doc.createElement("a");
      link.href = source;
      link.textContent = "Open the standalone file";
      note.appendChild(doc.createTextNode(
        "This browser would not let the page copy for you. "
      ));
      note.appendChild(link);
      note.appendChild(doc.createTextNode(
        " and copy all of it, or save it as a .html file."
      ));
      live.textContent =
        "Copying is not available here. A link to the standalone file has " +
        "been shown instead.";
    }

    button.addEventListener("click", function () {
      if (busy) {
        return;
      }
      busy = true;
      button.setAttribute("aria-busy", "true");
      feedback("Copying…", "", "");

      global.fetch(source, { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          return response.text();
        })
        .then(function (text) {
          return writeToClipboard(text).then(function () {
            var kb = Math.round(text.length / 1024);
            feedback(
              "Copied ✓",
              "Activity HTML copied to the clipboard, about " + kb +
                " kilobytes. Paste it into a blank HTML file or a page that " +
                "accepts HTML.",
              "ok"
            );
            button.removeAttribute("aria-busy");
            busy = false;
            schedule();
          });
        })
        .catch(function () {
          busy = false;
          offerDirectLink();
        });
    });
  }

  function init() {
    var buttons = doc.querySelectorAll("[data-copy-activity]");
    if (!buttons.length) {
      return;
    }
    // Without fetch there is nothing to copy; show the link route instead of
    // a button that cannot work.
    Array.prototype.forEach.call(buttons, function (button) {
      if (typeof global.fetch !== "function") {
        button.disabled = true;
        return;
      }
      initButton(button);
    });
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.CopyActivity = { init: init };
})(window);
