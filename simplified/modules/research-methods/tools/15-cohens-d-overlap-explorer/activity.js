/* =========================================================================
   How Much Do Two Groups Overlap? — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/15-cohens-d-overlap-explorer/

   TEACHING JOB
   ------------
   An effect size is a statement about how much two distributions overlap. It
   is not a statement about whether an effect exists.

   WHAT IS PRESERVED
   -----------------
   The original's hook, which is a prediction before a reveal: guess how much
   of the lower group still beats the average of the higher group at a "large"
   effect, then see it. And the live two-curve figure with all four indices
   describing the same picture.

   THE ARITHMETIC (both groups normal, common standard deviation)
   --------------------------------------------------------------
       d       = (mean_high - mean_low) / sd
       overlap = 2 * Phi(-d / 2)
       superiority = Phi(d / sqrt(2))
       U3      = Phi(d)

   These closed forms are exact ONLY under the equal-spread assumption, which
   is why the activity offers one spread control rather than two and why the
   caution says what changes when the spreads differ. Offering two spreads
   would make d ambiguous, which is a real point but a different lesson.

   WHY THE AXIS IS AUTOSCALED AND UNLABELLED
   -----------------------------------------
   The opposite decision from the z-score activity next door, and for the
   opposite reason. There, a fixed axis was the point: a mark had to stand
   still. Here the point is that d has no units, so the figure rescales with
   the settings and every pair with the same d renders identically. The
   "Show me the same d twice" control exists to make that visible, and there
   are no tick values because none of the four numbers depends on them.

   WHAT WAS REDUCED
   ----------------
   The sample-size control with its t and p (that separation is activity 16's
   job), the four-index matching challenge, and the published-effect presets.

   No randomness, nothing to seed. Nothing is stored and nothing leaves the
   browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var CHANGES_BEFORE_EXPLAINING = 3;
  var SPAN_SD = 3.4;   /* how far past each mean the axis reaches */

  /* The prediction. The answer sits third of four, the options are evenly
     spaced and of equal length, so neither position nor wording gives it
     away. */
  var GUESS_OPTIONS = [
    { value: 2, label: "About 2 in 100" },
    { value: 8, label: "About 8 in 100" },
    { value: 21, label: "About 21 in 100" },
    { value: 38, label: "About 38 in 100" }
  ];
  var CORRECT_GUESS = 21;

  /* Three studies with nothing in common that draw the identical figure. */
  var SAME_D = [
    { diff: 8, sd: 10, gloss: "a difference of 8 points where people vary by 10" },
    { diff: 16, sd: 20, gloss: "a difference of 16 points where people vary by 20" },
    { diff: 4, sd: 5, gloss: "a difference of 4 points where people vary by 5" }
  ];

  var guessBox = document.getElementById("guess");
  var commit = document.getElementById("commit");
  var explorer = document.getElementById("explorer");
  var verdict = document.getElementById("verdict");
  var diffInput = document.getElementById("diff");
  var sdInput = document.getElementById("sd");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var scalefree = document.getElementById("scalefree");
  var explain = document.getElementById("explain");
  var task = document.getElementById("task");
  var taskText = document.getElementById("task-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var chosen = null;
  var changes = 0;
  var sameIndex = 0;

  function diff() { return Number(diffInput.value); }
  function sd() { return Math.max(1, Number(sdInput.value)); }
  function d() { return diff() / sd(); }

  /* --- The four indices ------------------------------------------------ */

  function indices() {
    var dd = d();
    return {
      d: dd,
      overlap: 2 * S.phi(-Math.abs(dd) / 2),
      superiority: S.phi(dd / Math.SQRT2),
      u3: S.phi(dd)
    };
  }

  /* --- The prediction --------------------------------------------------- */

  function buildGuess() {
    guessBox.textContent = "";
    GUESS_OPTIONS.forEach(function (opt) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.setAttribute("data-choice", "");
      button.setAttribute("data-value", String(opt.value));
      button.textContent = opt.label;
      button.addEventListener("click", function () {
        if (button.getAttribute("aria-disabled") === "true") { return; }
        pick(opt.value);
      });
      guessBox.appendChild(button);
    });
  }

  function optionNodes() {
    return Array.prototype.slice.call(guessBox.querySelectorAll("[data-choice]"));
  }

  function pick(value) {
    if (commit.getAttribute("aria-disabled") === "true" && chosen !== null) { return; }
    chosen = value;
    optionNodes().forEach(function (node) {
      wb.choices.mark(node,
        Number(node.getAttribute("data-value")) === value ? "chosen" : null);
    });
    commit.setAttribute("aria-disabled", "false");
    wb.announce("Estimate of about " + value + " in 100 selected. Lock it in when ready.");
  }

  commit.addEventListener("click", function () {
    if (chosen === null) {
      wb.announce("Choose an estimate first.");
      return;
    }
    optionNodes().forEach(function (node) {
      var v = Number(node.getAttribute("data-value"));
      wb.choices.mark(node,
        v === CORRECT_GUESS ? "correct" : (v === chosen ? "incorrect" : null));
    });
    wb.choices.lock(guessBox);
    commit.setAttribute("aria-disabled", "true");
    verdict.textContent = feedback(chosen);
    wb.show("#explorer");
    wb.scrollTo("#explorer", { focus: true });
    refresh(false);
    wb.announce("The answer is about 21 in 100. The two distributions are now below.");
  });

  function feedback(value) {
    var shared = "At a d of 0.8, about 21 people in every 100 of the lower " +
      "group still score above the average of the higher group, and the two " +
      "distributions have about 69 per cent of their area in common. ";
    if (value === CORRECT_GUESS) {
      return shared + "Your estimate was right, which puts you in a small " +
        "minority: the usual reaction to a large effect is to picture two " +
        "distributions that barely touch.";
    }
    if (value < CORRECT_GUESS) {
      return shared + "You guessed lower than that, which is the common " +
        "answer. A large effect sounds like separation, and it is not: the " +
        "word large is doing a lot of work it was never meant to do.";
    }
    return shared + "You guessed higher than that, so you were already " +
      "sceptical about how much a large effect separates two groups. It " +
      "separates them a little more than you thought, but not much.";
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var LEFT = 74;
    var RIGHT = 856;
    var TITLE_Y = 22;
    var TOP = 64;
    var BASE = 300;
    var CAPTION_Y = BASE + 30;

    var s = sd();
    var muLow = 0;
    var muHigh = diff();
    var lo = muLow - SPAN_SD * s;
    var hi = muHigh + SPAN_SD * s;
    var peak = S.density(0, 0, s);

    var X = function (v) { return LEFT + ((v - lo) / (hi - lo)) * (RIGHT - LEFT); };
    var Y = function (den) { return BASE - (den / (peak * 1.14)) * (BASE - TOP); };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (CAPTION_Y + 16));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "Two groups, and the region they have in common";
    chart.appendChild(title);

    var steps = 260;
    var pts = [];
    var i = 0;
    while (i <= steps) {
      var v = lo + (i / steps) * (hi - lo);
      pts.push([v, S.density(v, muLow, s), S.density(v, muHigh, s)]);
      i += 1;
    }

    /* The overlap: the area under whichever curve is lower at each point. */
    var overlapPath = "M " + X(lo).toFixed(1) + " " + BASE;
    pts.forEach(function (p) {
      overlapPath += " L " + X(p[0]).toFixed(1) + " " + Y(Math.min(p[1], p[2])).toFixed(1);
    });
    overlapPath += " L " + X(hi).toFixed(1) + " " + BASE + " Z";
    chart.appendChild(svg("path", {
      d: overlapPath, fill: "#5F6878", "fill-opacity": "0.30", stroke: "none"
    }));

    /* The two curves. Dash pattern distinguishes them as well as colour. */
    [
      { key: 1, mu: muLow, side: -1, stroke: "#9E7318", dash: "8 5", label: "Lower group" },
      { key: 2, mu: muHigh, side: 1, stroke: "#1C7293", dash: null, label: "Higher group" }
    ].forEach(function (curve) {
      var path = pts.map(function (p, n) {
        return (n === 0 ? "M " : "L ") + X(p[0]).toFixed(1) + " " + Y(p[curve.key]).toFixed(1);
      }).join(" ");
      var attrs = {
        d: path, fill: "none", stroke: curve.stroke, "stroke-width": "2.6",
        "stroke-linejoin": "round"
      };
      if (curve.dash) { attrs["stroke-dasharray"] = curve.dash; }
      chart.appendChild(svg("path", attrs));

      /* Each label sits on the OUTER flank of its own curve, not over its
         peak. At a small d the two peaks are almost on top of each other and
         two labels there would collide; out here they are always at least
         2.8 standard deviations apart, which is 41 per cent of the drawn
         width even when the means are identical. */
      var tag = svg("text", {
        x: X(curve.mu + curve.side * 1.4 * s).toFixed(1), y: (TOP + 6).toFixed(1),
        "text-anchor": "middle", class: "plot__sub plot__over", fill: curve.stroke
      });
      tag.textContent = curve.label;
      chart.appendChild(tag);
    });

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAPTION_Y, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "Score, in whatever units the study used";
    chart.appendChild(cap);

    renderReadout();
    describe();
  }

  function pc(p) { return (100 * p).toFixed(1) + "%"; }

  function renderReadout() {
    var ix = indices();
    readout.textContent = "";
    tile("Cohen's d", ix.d.toFixed(2), band(ix.d));
    tile("Overlap", pc(ix.overlap), "of the two distributions is shared");
    tile("Probability of superiority", pc(ix.superiority),
      "chance the higher group's person scores higher");
    tile("U3", pc(ix.u3),
      "of the higher group beats the lower group's average");
  }

  /* Cohen's own rough labels, flagged as rough rather than presented as
     thresholds. The synthesis says why they should not be trusted. */
  function band(dd) {
    var a = Math.abs(dd);
    if (a < 0.2) { return "smaller than Cohen's rough small"; }
    if (a < 0.5) { return "around Cohen's rough small"; }
    if (a < 0.8) { return "around Cohen's rough medium"; }
    return "at or above Cohen's rough large";
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    readout.appendChild(item);
  }

  function describe() {
    var ix = indices();
    chartDesc.textContent =
      "Two overlapping normal curves of equal spread, the lower group drawn " +
      "dashed and the higher group solid, with the region they share shaded. " +
      "The means differ by " + diff() + " points where the spread within each " +
      "group is " + sd() + ", giving a Cohen's d of " + ix.d.toFixed(2) + ". " +
      "The two distributions share " + pc(ix.overlap) + " of their area. " +
      "Picking one person at random from each group, the higher group's " +
      "person scores higher " + pc(ix.superiority) + " of the time, and " +
      pc(ix.u3) + " of the higher group scores above the lower group's mean.";
  }

  /* --- Controls -------------------------------------------------------- */

  var ranges = ["#diff", "#sd"].map(function (sel) {
    return wb.bindRange(sel, { format: function (v) { return v; } });
  });
  function syncRanges() { ranges.forEach(function (r) { if (r) { r.sync(); } }); }

  function refresh(announce) {
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      var ix = indices();
      wb.announce("Cohen's d is now " + ix.d.toFixed(2) + ", with " +
        pc(ix.overlap) + " overlap.");
    }
  }

  [diffInput, sdInput].forEach(function (input) {
    input.addEventListener("input", function () { render(); });
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  scalefree.addEventListener("click", function () {
    sameIndex = (sameIndex + 1) % SAME_D.length;
    var pair = SAME_D[sameIndex];
    diffInput.value = String(pair.diff);
    sdInput.value = String(pair.sd);
    syncRanges();
    changes += 1;
    refresh(false);
    taskText.textContent =
      "This is now " + pair.gloss + ". Every number below is the same as it " +
      "was, and the figure is not merely similar to the last one, it is " +
      "identical, because the axis has no units on it and d is a ratio. Press " +
      "the button again for a third study with nothing in common with either " +
      "of the first two.";
    wb.show("#task");
    wb.announce("Settings changed to " + pair.gloss +
      ". Cohen's d and the figure are unchanged.");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    chosen = null;
    changes = 0;
    sameIndex = 0;
    wb.choices.clear(guessBox);
    buildGuess();
    commit.setAttribute("aria-disabled", "true");
    verdict.textContent = "";
    diffInput.value = "8";
    sdInput.value = "10";
    syncRanges();
    explain.disabled = true;
    wb.hide("#explorer");
    wb.hide("#task");
    wb.hide("#synthesis");
    render();
  });

  buildGuess();
  render();
})();
