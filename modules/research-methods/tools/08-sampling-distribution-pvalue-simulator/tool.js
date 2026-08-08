/* =========================================================================
   Sampling Distribution and p-Value Simulator
   -------------------------------------------------------------------------
   Two groups of n fictional participants are drawn from the SAME normal
   population, so the true difference is exactly zero. Repeating that gives the
   sampling distribution of the mean difference under the null model. One
   observed difference is marked on it, and the p-value is read off as the
   combined area at least that far from zero.

   THE MODEL
   ---------
       group A ~ Normal(0, sigma),  group B ~ Normal(0, sigma),  n per group
       statistic  = mean(A) - mean(B)
       SE         = sigma * sqrt(2/n)
       reference  = Normal(0, SE)

   The population standard deviation is treated as KNOWN, because the null
   model states it. That is why the reference distribution is normal rather
   than t: nothing is being estimated from the sample. A real t-test estimates
   sigma and pays for that with heavier tails, which is a later tool.

       theoretical p = 2 * (1 - Phi(|observed| / SE))
       simulated  p  = share of simulated null studies with |difference| >= |observed|

   Both are shown, because the agreement between them is the demonstration
   that the tail area is not a convention but a count.

   WHAT A P-VALUE IS NOT
   ---------------------
   Everything here is computed ASSUMING the null model, independent sampling,
   a pre-specified analysis and a single comparison. The p-value is therefore:

     * NOT the probability that the null hypothesis is true;
     * NOT the probability that the result happened by chance;
     * NOT a measure of the size or importance of an effect;
     * NOT evidence of no effect when it is large.

   The tool never mentions 0.05 as a threshold, because whether a tail area of
   a particular size should change anybody's behaviour is a decision rather
   than a statistical fact.

   Randomness is seeded (mulberry32 with Box-Muller normals) so a whole run is
   reproducible. No data leave the browser: there is no storage and no network
   request.
   ========================================================================= */

(function () {
  "use strict";

  var BIN_COUNT = 41;
  var AXIS_SE = 4.2; // half-width of the plotted axis, in standard errors

  /* =======================================================================
     Seeded randomness
     ===================================================================== */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6d2b79f5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normal(random) {
    var u = Math.max(random(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  }

  /** Standard normal cumulative distribution, Abramowitz and Stegun 26.2.17. */
  function phi(z) {
    var sign = z < 0 ? -1 : 1;
    var x = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t -
      0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + sign * y);
  }

  /* =======================================================================
     Small DOM helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attrs) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  function fmt(value, places) {
    return value.toFixed(places === undefined ? 2 : places);
  }

  /** p-values below .001 are reported as such rather than as a spurious digit. */
  function fmtP(p) {
    if (p < 0.0001) { return "< .0001"; }
    if (p < 0.001) { return "< .001"; }
    return "= " + p.toFixed(3).replace(/^0/, "");
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#pvalue");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || page).querySelectorAll(s));
  };

  var nRange = $("#n-range");
  var sdRange = $("#sd-range");
  var obsRange = $("#obs-range");
  var seedInput = $("#seed-input");
  var chartHeading = $("[data-chart-heading]");
  var hist = $("[data-hist]");
  var regionTable = $("[data-region-table]");
  var readout = $("[data-readout]");
  var verdict = $("[data-verdict]");
  var interpretation = $("[data-interpretation]");
  var theoryTable = $("[data-theory-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var simSection = $("#sim-section");
  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var DEFAULTS = { n: 40, sd: 15, obs: 5, seed: 5140 };
  var draws = [];

  function settings() {
    return {
      n: Number(nRange.value),
      sd: Number(sdRange.value),
      obs: Number(obsRange.value)
    };
  }

  function standardError(s) { return s.sd * Math.sqrt(2 / s.n); }

  /* --- Ranges --------------------------------------------------------------- */

  function onModelChange() {
    // Changing the model invalidates the pile: those studies came from a
    // different null world.
    draws = [];
    render();
  }

  shell.bindRange(nRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return v + " participants in each group"; },
    onInput: onModelChange
  });

  shell.bindRange(sdRange, {
    format: function (v) { return String(v); },
    describe: function (v) { return "population standard deviation " + v + " points"; },
    onInput: onModelChange
  });

  shell.bindRange(obsRange, {
    format: function (v) { return fmt(v, 1); },
    describe: function (v) {
      return "the study reported a difference of " + fmt(v, 1) + " points";
    },
    onInput: function () { render(); }
  });

  /* --- Running studies -------------------------------------------------------- */

  function runStudies(count) {
    var s = settings();
    var seed = Math.max(1, Math.round(Number(seedInput.value) || 1));
    var random = mulberry32(seed + draws.length * 7919);
    for (var i = 0; i < count; i += 1) {
      var sumA = 0;
      var sumB = 0;
      for (var j = 0; j < s.n; j += 1) {
        sumA += normal(random) * s.sd;
        sumB += normal(random) * s.sd;
      }
      draws.push(sumA / s.n - sumB / s.n);
    }
  }

  /* --- Rendering --------------------------------------------------------------- */

  function counts() {
    var s = settings();
    var se = standardError(s);
    var limit = AXIS_SE * se;
    var width = (2 * limit) / BIN_COUNT;
    var bins = [];
    var i;
    for (i = 0; i < BIN_COUNT; i += 1) { bins.push(0); }
    var below = 0;
    var above = 0;
    var between = 0;
    draws.forEach(function (value) {
      var index = Math.floor((value + limit) / width);
      if (index >= 0 && index < BIN_COUNT) { bins[index] += 1; }
      if (value <= -s.obs) { below += 1; }
      else if (value >= s.obs) { above += 1; }
      else { between += 1; }
    });
    return {
      bins: bins, width: width, limit: limit, se: se,
      below: below, above: above, between: between
    };
  }

  function renderHistogram(data) {
    var W = 460;
    var H = 190;
    var left = 30;
    var right = W - 12;
    var top = 14;
    var base = H - 40;
    var s = settings();

    clear(hist);

    var x = function (value) {
      return left + ((value + data.limit) / (2 * data.limit)) * (right - left);
    };
    var peak = Math.max.apply(null, data.bins.concat([1]));
    var y = function (count) { return base - (count / peak) * (base - top); };

    // Bars.
    data.bins.forEach(function (count, i) {
      if (!count) { return; }
      var lo = -data.limit + i * data.width;
      var hi = lo + data.width;
      var centre = (lo + hi) / 2;
      var isTail = Math.abs(centre) >= s.obs;
      var barX = x(lo);
      var barW = Math.max(1, x(hi) - x(lo) - 0.6);
      hist.appendChild(svgNode("rect", {
        x: barX, y: y(count), width: barW, height: base - y(count),
        class: "hist__bar" + (isTail ? " hist__bar--tail" : "")
      }));
      // Diagonal hatch on tail bars, so the shading is not carried by fill
      // alone in greyscale.
      if (isTail && base - y(count) > 4) {
        hist.appendChild(svgNode("line", {
          x1: barX, y1: base, x2: barX + barW, y2: y(count),
          class: "hist__hatch"
        }));
      }
    });

    // Axis, zero line, observed markers.
    hist.appendChild(svgNode("line", {
      x1: left, y1: base, x2: right, y2: base, class: "hist__axis"
    }));
    hist.appendChild(svgNode("line", {
      x1: x(0), y1: top - 4, x2: x(0), y2: base, class: "hist__zero"
    }));

    [-s.obs, s.obs].forEach(function (value) {
      if (Math.abs(value) > data.limit) { return; }
      hist.appendChild(svgNode("line", {
        x1: x(value), y1: top - 6, x2: x(value), y2: base + 5,
        class: "hist__observed"
      }));
    });

    var obsLabel = svgNode("text", {
      x: Math.min(x(s.obs) + 5, right - 2), y: top,
      "text-anchor": x(s.obs) > (left + right) * 0.6 ? "end" : "start",
      class: "chart__label"
    });
    obsLabel.textContent = "observed " + fmt(s.obs, 1);
    hist.appendChild(obsLabel);

    // Tick marks in whole points.
    var step = data.limit > 12 ? 5 : data.limit > 6 ? 2 : 1;
    for (var v = -Math.floor(data.limit / step) * step;
         v <= data.limit; v += step) {
      hist.appendChild(svgNode("line", {
        x1: x(v), y1: base, x2: x(v), y2: base + 4, class: "hist__axis"
      }));
      var tick = svgNode("text", {
        x: x(v), y: base + 17, "text-anchor": "middle", class: "chart__axis"
      });
      tick.textContent = String(v);
      hist.appendChild(tick);
    }
    var axisLabel = svgNode("text", {
      x: (left + right) / 2, y: base + 33, "text-anchor": "middle",
      class: "chart__axis"
    });
    axisLabel.textContent =
      "difference between group means, when the true difference is zero";
    hist.appendChild(axisLabel);
  }

  function renderRegions(data) {
    var s = settings();
    var total = draws.length;
    clear(regionTable);
    [
      ["At or below −" + fmt(s.obs, 1), data.below],
      ["Between −" + fmt(s.obs, 1) + " and " + fmt(s.obs, 1), data.between],
      ["At or above " + fmt(s.obs, 1), data.above]
    ].forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row[0]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, String(row[1])));
      tr.appendChild(make("td", null,
        total ? (100 * row[1] / total).toFixed(1) + "%" : "—"));
      regionTable.appendChild(tr);
    });
  }

  function renderReadout(data) {
    var s = settings();
    var se = standardError(s);
    var z = s.obs / se;
    var theoretical = 2 * (1 - phi(z));
    var simulated = draws.length
      ? (data.below + data.above) / draws.length
      : null;

    clear(readout);
    [
      ["Standard error", fmt(se) + " points"],
      ["Observed, in SE", fmt(z) + " SE"],
      ["Tail area: model", "p " + fmtP(theoretical)],
      ["Tail area: counted",
        simulated === null ? "none run" : "p " + fmtP(simulated)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderTheory(data) {
    var s = settings();
    var se = standardError(s);
    var observedSd = 0;
    var observedMean = 0;
    if (draws.length > 1) {
      observedMean = draws.reduce(function (a, b) { return a + b; }, 0) / draws.length;
      var ss = draws.reduce(function (a, b) {
        return a + (b - observedMean) * (b - observedMean);
      }, 0);
      observedSd = Math.sqrt(ss / (draws.length - 1));
    }
    clear(theoryTable);
    [
      ["Centre of the distribution", "0.00 points",
        draws.length > 1 ? fmt(observedMean) + " points" : "—"],
      ["Spread of the distribution", fmt(se) + " points",
        draws.length > 1 ? fmt(observedSd) + " points" : "—"],
      ["Share beyond ±" + fmt(s.obs, 1),
        fmtP(2 * (1 - phi(s.obs / se))).replace("= ", "").replace("< ", "under "),
        draws.length
          ? ((data.below + data.above) / draws.length).toFixed(3).replace(/^0/, "")
          : "—"]
    ].forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row[0]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row[1]));
      tr.appendChild(make("td", null, row[2]));
      theoryTable.appendChild(tr);
    });
  }

  function renderInterpretation(data) {
    var s = settings();
    var se = standardError(s);
    var theoretical = 2 * (1 - phi(s.obs / se));
    var tone;
    var text;

    if (!draws.length) {
      tone = "caution";
      text =
        "Nothing run yet. The model puts the difference around zero with a " +
        "standard error of " + fmt(se) + " points, so a reported difference " +
        "of " + fmt(s.obs, 1) + " is " + fmt(s.obs / se) + " standard errors " +
        "out. Run twenty and watch where they land.";
    } else if (s.obs === 0) {
      tone = "caution";
      text =
        "With the observed difference set to zero, every simulated study is at " +
        "least as far from zero as yours, so the tail area is the whole " +
        "distribution and p is 1. That is not evidence for the null model; it " +
        "is what a tail area does when nothing is in the tail.";
    } else if (theoretical > 0.2) {
      tone = "neutral";
      text =
        "Of " + draws.length + " studies in which the true difference was " +
        "exactly zero, " + (data.below + data.above) + " produced a difference " +
        "at least as far from zero as " + fmt(s.obs, 1) + " points. That is p " +
        fmtP((data.below + data.above) / draws.length) +
        ". A result this size is unremarkable in a world where nothing is " +
        "going on. That is not the same as nothing going on - this design " +
        "could not tell the two apart.";
    } else if (theoretical > 0.02) {
      tone = "caution";
      text =
        (data.below + data.above) + " of " + draws.length +
        " null studies reached " + fmt(s.obs, 1) + " points or further from " +
        "zero, giving p " + fmtP((data.below + data.above) / draws.length) +
        ". The honest sentence: data like these would be somewhat unusual if " +
        "the null model held. Not \"there is a " +
        Math.round(theoretical * 100) + "% chance the null is true\" - that " +
        "reverses the conditional.";
    } else {
      tone = "good";
      text =
        "Only " + (data.below + data.above) + " of " + draws.length +
        " null studies reached " + fmt(s.obs, 1) + " points or further from " +
        "zero: p " + fmtP((data.below + data.above) / draws.length) +
        ". Rare under the null model. An effect is one explanation; " +
        "dependence between observations, a skewed population and a " +
        "comparison chosen after looking are others, and a tail area cannot " +
        "separate them. Drag the sample size: p moves and the " +
        fmt(s.obs, 1) + "-point difference does not.";
    }

    interpretation.textContent = text;
    verdict.setAttribute("data-tone", tone);
  }

  function render() {
    var data = counts();
    chartHeading.textContent =
      "Differences from " + draws.length + " null stud" +
      (draws.length === 1 ? "y" : "ies");
    renderHistogram(data);
    renderRegions(data);
    renderReadout(data);
    renderTheory(data);
    renderInterpretation(data);
  }

  /* --- Buttons ---------------------------------------------------------------- */

  function announceRun() {
    var s = settings();
    var data = counts();
    var p = draws.length ? (data.below + data.above) / draws.length : 1;
    shell.announce(
      draws.length + " null studies now in the pile. " +
      (data.below + data.above) + " of them reached " + fmt(s.obs, 1) +
      " points or further from zero, giving a simulated p " + fmtP(p) + ".",
      { immediate: true });
  }

  $('[data-action="run1000"]').addEventListener("click", function () {
    runStudies(1000);
    render();
    announceRun();
  });

  $('[data-action="run20"]').addEventListener("click", function () {
    runStudies(20);
    render();
    var last = draws.slice(-5).map(function (v) { return fmt(v, 1); }).join(", ");
    shell.announce(
      "Twenty more null studies run. The last five differences were " + last +
      ", every one of them from a world where the true difference is zero.",
      { immediate: true });
  });

  $('[data-action="clear"]').addEventListener("click", function () {
    draws = [];
    render();
    shell.announce("Pile cleared. The model is unchanged.", { immediate: true });
  });

  /* --- Opening prediction ------------------------------------------------------- */

  var OPENING = {
    never: {
      tone: "caution",
      verdict: "Far too rare.",
      text:
        "With 40 per group and a standard deviation of 15, the standard error " +
        "of the difference is about 3.35 points, so 5 points is only about 1.5 " +
        "standard errors from zero. Differences of that size are ordinary. " +
        "Run the simulator and count them."
    },
    twenty: {
      tone: "caution",
      verdict: "The reflex answer, and it is the wrong one.",
      text:
        "One in twenty is where the conventional threshold sits, which is " +
        "probably why it came to mind - but the threshold is a decision, not a " +
        "property of this study. Here the answer is about one in seven, and " +
        "you are about to count them."
    },
    seven: {
      tone: "good",
      verdict: "Yes, close to it.",
      text:
        "The standard error of the difference is 15 x sqrt(2/40) = 3.35 " +
        "points, so 5 points is 1.49 standard errors out and the two-tailed " +
        "area is about .136 - roughly one study in seven. Sampling alone " +
        "produces differences of this size routinely, which is exactly why a " +
        "reference distribution is needed at all."
    },
    three: {
      tone: "caution",
      verdict: "Too common, though the instinct is right.",
      text:
        "You have the direction correct: differences of 5 points are not rare. " +
        "One in three would require the standard error to be nearer 5 points " +
        "than 3.35. Run the simulator, and try dragging the sample size down " +
        "to 20 to see what would make one in three the right answer."
    }
  };

  function showFeedback(container, tone, verdictText, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdictText));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function openSimulator() {
    simSection.hidden = false;
    render();
    $("#sim-heading").focus();
    shell.announce("Simulator unlocked. No studies run yet.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose a prediction before opening the simulator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    openSimulator();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    openSimulator();
  });

  /* --- Challenge ------------------------------------------------------------------ */

  var CHALLENGE_NOTES = {
    tail: {
      correct: true,
      text:
        "Correct, and it is very nearly the whole of what a p-value says. Note " +
        "every condition packed into \"studies like this one\": the same null " +
        "model, the same design, the same analysis fixed in advance, and this " +
        "as the only comparison."
    },
    "prob-null": {
      correct: false,
      text:
        "Wrong, and the most common error in the literature. The calculation " +
        "starts by assuming the null model and asks what data it would " +
        "produce. It cannot end by telling you how likely that assumption " +
        "was: a probability for a hypothesis needs a prior, and none entered."
    },
    chance: {
      correct: false,
      text:
        "Wrong, and it is the same error in friendlier clothing. Every result " +
        "in the histogram was produced by chance - that is what the simulation " +
        "does. The p-value does not partition your result into a chance part " +
        "and a real part; it says how often chance alone would go this far."
    },
    noeffect: {
      correct: false,
      text:
        "Wrong. A large p-value says the data are compatible with the null " +
        "model. They are also compatible with a small effect, and often with a " +
        "moderate one. Set the observed difference to 5 with 20 per group and " +
        "then with 200: the same difference is unremarkable in one design and " +
        "extremely rare in the other. Absence of evidence is not evidence of " +
        "absence."
    },
    small: {
      correct: false,
      text:
        "Wrong. The p-value confounds the size of the difference, the " +
        "variability and the sample size into one number. A 5-point difference " +
        "with p = .14 at n = 40 becomes p < .001 at n = 400, and the difference " +
        "has not changed by a hundredth of a point. Size is what an effect-size " +
        "measure is for."
    },
    replicate: {
      correct: false,
      text:
        "Wrong. 1 - p is not the probability of replication. What a repeat " +
        "study would do depends on the true effect, which is unknown, and on " +
        "the new study's sample size. That is a power calculation, and it " +
        "needs an assumed effect the p-value does not supply."
    }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = $$('input[name="challenge"]:checked', challengeForm)
      .map(function (b) { return b.value; });

    if (!chosen.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one statement.",
        "Exactly one of the six is correct.");
      return;
    }

    var wrongPicked = chosen.filter(function (v) { return !CHALLENGE_NOTES[v].correct; });
    var gotRight = chosen.indexOf("tail") !== -1;

    var tone = wrongPicked.length ? "warn" : gotRight ? "good" : "caution";
    var verdictText = wrongPicked.length
      ? "At least one of these reverses the conditional or reads size off a tail area."
      : "Yes — exactly one of the six is correct, and you have it.";

    clear(challengeFeedback);
    challengeFeedback.setAttribute("data-tone", tone);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict", verdictText));
    lead.appendChild(document.createTextNode(
      " Every one of the five wrong statements appears regularly in published " +
      "papers, so recognising them is more useful than memorising the correct " +
      "phrasing."));
    challengeFeedback.appendChild(lead);
    var list = make("ul");
    Object.keys(CHALLENGE_NOTES).forEach(function (value) {
      var li = make("li");
      li.appendChild(make("strong", null,
        chosen.indexOf(value) !== -1
          ? "You selected this. " : "You did not select this. "));
      li.appendChild(document.createTextNode(CHALLENGE_NOTES[value].text));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);
    challengeFeedback.hidden = false;
    shell.announce(verdictText, { immediate: true });
  });

  /* --- Reset ------------------------------------------------------------------------ */

  shell.onReset(function () {
    draws = [];
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    simSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    nRange.value = String(DEFAULTS.n);
    sdRange.value = String(DEFAULTS.sd);
    obsRange.value = String(DEFAULTS.obs);
    seedInput.value = String(DEFAULTS.seed);
    render();
  });

  /* --- Start-up --------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce("Ready. Answer the prediction above to unlock the simulator.",
    { immediate: true });
})();
