/* =========================================================================
   Human Attention versus AI Attention
   -------------------------------------------------------------------------
   Three stages on one sentence.

       stage 1   the learner resolves an ambiguous pronoun in two sentences
                 that differ in three words, and reports what they did
       stage 2   the learner computes scaled dot-product attention weights
                 over the same sentence, choosing the query position, the
                 head, the softmax temperature and whether later positions
                 are masked
       stage 3   a sorting challenge over eight statements

   LANGUAGE DISCIPLINE
   -------------------
   Everything on the computational side is described in arithmetic terms.
   A weight is a number produced by a dot product and a softmax. Nowhere on
   this page does the machine "notice", "focus on", "look at", "care about",
   "ignore", "decide" or "understand" anything, and nowhere is a weight map
   offered as an explanation of an output. This is not a stylistic
   preference; it is the teaching content.

   THE ARITHMETIC, IN FULL
   -----------------------
   Every token i has a hand-written key vector k_i in three dimensions. A
   head h is three multipliers. For a chosen query position q:

       query vector      Q      = k_q  *elementwise*  h
       raw score         s_i    = (Q . k_i) / sqrt(3)
       masked score      s_i    = -Infinity  if masking and i > q
       weight            w_i    = softmax(s / temperature)_i

   The weights are non-negative and sum to one. That is the whole operation
   as implemented here. A real attention layer then uses those weights as
   coefficients in a weighted sum of VALUE vectors, of which this page has
   none, and does so in many heads across many layers - all stated in the
   limits panel.

   THE NUMBERS ARE MANUFACTURED, AND THE PAGE SAYS SO REPEATEDLY
   -------------------------------------------------------------
   The ten key vectors and the three heads were written by hand so that the
   three presets produce three legible pictures: one that looks like referent
   resolution, one that is pure recency, and one that is nearly uniform. In a
   real model these numbers are learned, nobody chooses what they mean, and
   most heads produce patterns that resist description. The "where these
   numbers came from" panel, the interactive brief, the badge in the hero and
   the limits panel all say this.

   The three key dimensions have deliberately BLAND names in the interface -
   they are printed as three numbers, not as "nounness" or "recency". Naming
   a learned coordinate after the thing it appears to track is exactly the
   interpretive error this tool exists to make visible.

   No data leave the browser. No storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var DIMS = 3;

  /* The sentence, cut into ten tokens, with a hand-written key vector each.
     The three coordinates have no assigned meaning; they are numbers chosen
     so that the presets below produce three distinguishable pictures. */
  var TOKENS = [
    { text: "the", key: [0.10, 0.10, 0.10] },
    { text: "cyclist", key: [0.70, 0.15, 0.15] },
    { text: "passed", key: [0.20, 0.85, 0.20] },
    { text: "the", key: [0.10, 0.10, 0.25] },
    { text: "lorry", key: [0.95, 0.20, 0.30] },
    { text: "because", key: [0.15, 0.45, 0.35] },
    { text: "it", key: [0.55, 0.15, 0.40] },
    { text: "was", key: [0.10, 0.40, 0.45] },
    { text: "moving", key: [0.25, 0.80, 0.50] },
    { text: "slowly", key: [0.15, 0.35, 0.55] }
  ];

  var HEADS = [
    { label: "Head A", weights: [8.0, 0.4, 0.4] },
    { label: "Head B", weights: [0.4, 0.4, 9.0] },
    { label: "Head C", weights: [1.0, 1.0, 1.0] }
  ];

  var DEFAULTS = { query: 6, head: 0, temperature: 1, mask: false };

  /* Stage 1. Two sentences differing in three words. Each has one referent
     that essentially everyone reports, which is the point: the resolution is
     fast, effortless and reportable. */
  var SENTENCES = [
    {
      id: "slow",
      before: "The cyclist passed the lorry because ",
      pronoun: "it",
      after: " was moving slowly.",
      options: ["the cyclist", "the lorry"],
      common: "the lorry",
      why: "Almost everyone reports the lorry: a vehicle you overtake is the " +
        "one that is moving slowly. Nothing in the grammar settles it - both " +
        "nouns are singular and inanimate enough to take “it”."
    },
    {
      id: "hurry",
      before: "The cyclist passed the lorry because ",
      pronoun: "it",
      after: " was in a hurry.",
      options: ["the cyclist", "the lorry"],
      common: "the cyclist",
      why: "Almost everyone reports the cyclist, and the only thing that " +
        "changed was three words at the end. The referent of the pronoun was " +
        "settled by what makes sense of the sentence as a whole, not by " +
        "anything local to the pronoun."
    }
  ];

  /* =======================================================================
     Small helpers
     ===================================================================== */

  var NS = "http://www.w3.org/2000/svg";

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgNode(tag, attributes, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, String(attributes[key]));
    });
    if (parent) { parent.appendChild(node); }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) { node.removeChild(node.firstChild); }
  }

  function pct(value) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : (value * 100).toFixed(1) + "%";
  }

  /* =======================================================================
     The attention computation
     ===================================================================== */

  /**
   * Scaled dot-product attention weights over the token list.
   * @param {number} queryIndex  position whose weights are being computed
   * @param {number} headIndex   which set of three multipliers to apply
   * @param {number} temperature divides every score before the softmax
   * @param {boolean} mask       set scores for positions after the query to
   *                             minus infinity
   * @returns {{query:number[], scores:number[], weights:number[]}}
   */
  function attention(queryIndex, headIndex, temperature, mask) {
    var head = HEADS[headIndex].weights;
    var kq = TOKENS[queryIndex].key;
    var query = kq.map(function (value, d) { return value * head[d]; });
    var root = Math.sqrt(DIMS);

    var scores = TOKENS.map(function (token, i) {
      if (mask && i > queryIndex) { return -Infinity; }
      var dot = 0;
      for (var d = 0; d < DIMS; d += 1) { dot += query[d] * token.key[d]; }
      return dot / root;
    });

    var scaled = scores.map(function (s) {
      return s === -Infinity ? -Infinity : s / temperature;
    });
    var finite = scaled.filter(function (s) { return s !== -Infinity; });
    var top = Math.max.apply(null, finite);
    var exps = scaled.map(function (s) {
      return s === -Infinity ? 0 : Math.exp(s - top);
    });
    var total = exps.reduce(function (a, b) { return a + b; }, 0);
    var weights = exps.map(function (e) { return e / total; });

    return { query: query, scores: scores, weights: weights };
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#attn");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var querySelect = $("#query-select");
  var headSelect = $("#head-select");
  var maskCheck = $("#mask-check");
  var temperatureRange = $("#temperature-range");

  var tokenStrip = $("[data-tokens]");
  var weightChart = $("[data-weight-chart]");
  var weightTable = $("[data-weight-table]");
  var chartCaption = $("[data-chart-caption]");
  var weightSummary = $("[data-weight-summary]");
  var weightText = $("[data-weight-text]");
  var weightNote = $("[data-weight-note]");
  var formulaText = $("[data-formula-text]");
  var provenance = $("[data-provenance]");

  var humanSection = $("#human");
  var machineSection = $("#machine");
  var humanForm = $("#human-form");
  var humanItems = $("[data-human-items]");
  var humanError = $("[data-human-error]");
  var humanFeedback = $("[data-human-feedback]");
  var humanReflection = $("[data-human-reflection]");
  var humanReadout = $("[data-human-readout]");
  var humanText = $("[data-human-text]");
  var humanNote = $("[data-human-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var challengeForm = $("#challenge-form");
  var challengeRows = $("[data-challenge-rows]");
  var challengeFeedback = $("[data-challenge-feedback]");
  var challengeLock = $("[data-challenge-lock]");
  var challengeButton = $('[data-action="check-challenge"]');

  var state = null;

  /* =======================================================================
     Stage 2 rendering
     ===================================================================== */

  function renderQueryOptions() {
    clear(querySelect);
    TOKENS.forEach(function (token, i) {
      var option = make("option", null,
        (i + 1) + " — “" + token.text + "”");
      option.value = String(i);
      querySelect.appendChild(option);
    });
    querySelect.value = String(state.query);
  }

  function renderTokens(result) {
    clear(tokenStrip);
    TOKENS.forEach(function (token, i) {
      var item = make("li");
      var box = make("div", "token");
      box.setAttribute("data-query", i === state.query ? "yes" : "no");
      box.setAttribute("data-masked",
        (state.mask && i > state.query) ? "yes" : "no");
      box.appendChild(make("span", "token__index", String(i + 1)));
      box.appendChild(make("span", null, token.text));
      box.appendChild(make("span", "token__role",
        i === state.query ? "query"
          : (state.mask && i > state.query) ? "masked"
            : pct(result.weights[i])));
      item.appendChild(box);
      tokenStrip.appendChild(item);
    });
  }

  function renderChart(result) {
    var W = 460, H = 250;
    var PAD_L = 104, PAD_R = 62, PAD_T = 12, PAD_B = 30;
    var plotW = W - PAD_L - PAD_R;
    var plotH = H - PAD_T - PAD_B;
    var rowH = plotH / TOKENS.length;
    var barH = Math.min(15, rowH * 0.72);
    clear(weightChart);

    var xAt = function (p) { return PAD_L + p * plotW; };

    svgNode("line", { x1: PAD_L, y1: PAD_T, x2: PAD_L, y2: PAD_T + plotH,
      class: "chart__baseline" }, weightChart);
    [0, 0.5, 1].forEach(function (p) {
      svgNode("text", { x: xAt(p).toFixed(1), y: H - 14, "text-anchor": "middle",
        class: "chart__axis" }, weightChart)
        .textContent = Math.round(p * 100) + "%";
    });
    svgNode("text", { x: (PAD_L + plotW / 2).toFixed(1), y: H - 1,
      "text-anchor": "middle", class: "chart__axis" }, weightChart)
      .textContent = "Weight (all ten sum to 100%)";

    TOKENS.forEach(function (token, i) {
      var y = PAD_T + i * rowH + (rowH - barH) / 2;
      svgNode("text", { x: PAD_L - 8, y: (y + barH / 2 + 4).toFixed(1),
        "text-anchor": "end", class: "chart__label" }, weightChart)
        .textContent = (i + 1) + " " + token.text;

      if (state.mask && i > state.query) {
        svgNode("text", { x: PAD_L + 6, y: (y + barH / 2 + 4).toFixed(1),
          class: "chart__count" }, weightChart).textContent = "masked — weight 0";
        return;
      }

      var width = Math.max(1, xAt(result.weights[i]) - PAD_L);
      svgNode("rect", { x: PAD_L, y: y.toFixed(1), width: width.toFixed(1),
        height: barH, class: i === state.query ? "attn__bar--query" : "attn__bar"
      }, weightChart);
      if (i === state.query) {
        svgNode("rect", { x: PAD_L - 2, y: (y - 2).toFixed(1),
          width: (width + 4).toFixed(1), height: barH + 4, rx: 2,
          class: "attn__outline" }, weightChart);
      }
      svgNode("text", { x: (PAD_L + width + 5).toFixed(1),
        y: (y + barH / 2 + 4).toFixed(1), class: "chart__count" }, weightChart)
        .textContent = pct(result.weights[i]) + (i === state.query ? " (query)" : "");
    });
  }

  function renderTable(result) {
    clear(weightTable);
    TOKENS.forEach(function (token, i) {
      var row = make("tr");
      var head = make("th", null, String(i + 1));
      head.setAttribute("scope", "row");
      row.appendChild(head);
      row.appendChild(make("td", null, token.text +
        (i === state.query ? " (query)" : "")));
      row.appendChild(make("td", null, "[" + token.key.map(function (v) {
        return v.toFixed(2);
      }).join(", ") + "]"));
      row.appendChild(make("td", null,
        result.scores[i] === -Infinity ? "masked" : result.scores[i].toFixed(3)));
      row.appendChild(make("td", null, pct(result.weights[i])));
      weightTable.appendChild(row);
    });
  }

  function renderReadout(result) {
    var head = HEADS[state.head];
    formulaText.textContent =
      "Q = k" + (state.query + 1) + " × [" + head.weights.join(", ") +
      "];  score_i = (Q · k_i) ÷ √3;  weight = softmax(score ÷ " +
      state.temperature.toFixed(2) + ")" +
      (state.mask ? ", with positions after " + (state.query + 1) +
        " set to minus infinity." : ".");

    // Largest weight, and how concentrated the distribution is.
    var top = 0, topIndex = 0;
    result.weights.forEach(function (w, i) {
      if (w > top) { top = w; topIndex = i; }
    });
    var entropy = 0;
    result.weights.forEach(function (w) {
      if (w > 0) { entropy -= w * Math.log(w); }
    });
    var maxEntropy = Math.log(TOKENS.length);
    var spread = entropy / maxEntropy;

    chartCaption.textContent = "Attention weights for position " +
      (state.query + 1) + " (“" + TOKENS[state.query].text + "”), " +
      HEADS[state.head].label.toLowerCase() + ", temperature " +
      state.temperature.toFixed(2) + (state.mask ? ", later positions masked" : "");

    // The chart's always-visible text equivalent: the same numbers in words,
    // so nothing has to be opened to read the result. The full ten-row table
    // sits one click away inside the same <figure>.
    var ranked = result.weights.map(function (w, i) { return { w: w, i: i }; })
      .sort(function (a, b) { return b.w - a.w; });
    var maskedCount = state.mask ? TOKENS.length - 1 - state.query : 0;
    weightSummary.textContent =
      "In words: the three largest weights are " +
      ranked.slice(0, 3).map(function (entry) {
        return "position " + (entry.i + 1) + " (“" + TOKENS[entry.i].text +
          "”) at " + pct(entry.w);
      }).join(", ") + ". The smallest is position " +
      (ranked[ranked.length - 1].i + 1) + " (“" +
      TOKENS[ranked[ranked.length - 1].i].text + "”) at " +
      pct(ranked[ranked.length - 1].w) + ". " +
      (maskedCount
        ? maskedCount + " later position" + (maskedCount === 1 ? " is" : "s are") +
          " masked and carry zero weight. "
        : "") +
      "All ten weights sum to 100%.";

    weightText.textContent =
      "Ten non-negative numbers that sum to one. The largest is " + pct(top) +
      ", on position " + (topIndex + 1) + " (“" + TOKENS[topIndex].text +
      "”). The distribution is " +
      (spread > 0.92 ? "almost perfectly flat: every position is being weighted "
        + "at close to a tenth, which is what a softmax does when the scores "
        + "barely differ."
        : spread > 0.75 ? "fairly spread out: several positions carry "
          + "substantial weight."
          : "concentrated: most of the mass is on one or two positions.") +
      " Nothing in that sentence describes an act. It describes a dot product " +
      "and a normalisation.";

    weightNote.textContent =
      "This is the whole operation as implemented here. A real attention layer " +
      "would now use these ten numbers as coefficients in a weighted sum of " +
      "ten value vectors, which this page does not have, and would do so in " +
      "many heads across many layers. The weights are not the output, and they " +
      "are not the reason for the output.";
  }

  function renderProvenance() {
    clear(provenance);
    provenance.appendChild(make("p", null,
      "Every number on this page was written by hand. The ten key vectors and " +
      "the three heads were chosen so that the three presets would produce " +
      "three clearly different pictures — one that looks like a model working " +
      "out a referent, one that is nothing but recency, and one that is almost " +
      "uniform."));
    provenance.appendChild(make("p", null,
      "That matters in two ways. First, the apparent meaningfulness of the " +
      "first preset is manufactured: the author decided which token would win, " +
      "then chose numbers that made it win. Second, the three coordinates are " +
      "printed as three numbers and are never given names, because naming a " +
      "coordinate after the thing it appears to track is exactly the " +
      "interpretive error to avoid."));
    provenance.appendChild(make("p", null,
      "In a real model these numbers are learned from data by gradient descent. " +
      "Nobody chooses what a coordinate means, many heads produce patterns that " +
      "resist description altogether, and the same head can produce quite " +
      "different patterns on sentences that differ in ways nobody has a name " +
      "for."));

    var list = make("ul");
    HEADS.forEach(function (head) {
      list.appendChild(make("li", null,
        head.label + ": multipliers [" + head.weights.join(", ") +
        "] applied elementwise to the query token's key vector."));
    });
    provenance.appendChild(list);
  }

  function recompute(announce) {
    var result = attention(state.query, state.head, state.temperature, state.mask);
    renderTokens(result);
    renderChart(result);
    renderTable(result);
    renderReadout(result);
    if (announce) {
      var top = 0, topIndex = 0;
      result.weights.forEach(function (w, i) {
        if (w > top) { top = w; topIndex = i; }
      });
      shell.announce("Recomputed. Largest weight " + pct(top) +
        " on position " + (topIndex + 1) + ", “" + TOKENS[topIndex].text + "”.");
    }
  }

  /* =======================================================================
     Controls
     ===================================================================== */

  querySelect.addEventListener("change", function () {
    state.query = Number(querySelect.value);
    recompute(true);
  });

  headSelect.addEventListener("change", function () {
    state.head = Number(headSelect.value);
    recompute(true);
  });

  maskCheck.addEventListener("change", function () {
    state.mask = maskCheck.checked;
    recompute(true);
  });

  shell.bindRange("#temperature-range", {
    format: function (value) { return value.toFixed(2); },
    describe: function (value) {
      return value < 0.8 ? value.toFixed(2) + ", concentrating the weights"
        : value > 1.4 ? value.toFixed(2) + ", flattening the weights"
          : value.toFixed(2) + ", the standard softmax";
    },
    onInput: function (value) {
      if (!state) { return; }
      state.temperature = value;
      recompute(false);
    }
  });

  function applyPreset(query, head, temperature, mask, message) {
    state.query = query;
    state.head = head;
    state.temperature = temperature;
    state.mask = mask;
    querySelect.value = String(query);
    headSelect.value = String(head);
    maskCheck.checked = mask;
    temperatureRange.value = String(temperature);
    $("[data-temperature-output]").textContent = temperature.toFixed(2);
    recompute(false);
    shell.announce(message, { immediate: true });
  }

  $('[data-action="preset-referent"]').addEventListener("click", function () {
    applyPreset(6, 0, 0.6, false,
      "Preset loaded: position 7, head A, temperature 0.60. The largest " +
      "weight lands on “lorry”. The numbers that make it do so were written " +
      "by hand.");
  });

  $('[data-action="preset-recency"]').addEventListener("click", function () {
    applyPreset(6, 1, 0.6, true,
      "Preset loaded: position 7, head B, masked. The weights fall on the " +
      "immediately preceding positions, which is a property of the " +
      "coordinates and the mask rather than of the sentence.");
  });

  $('[data-action="preset-flat"]').addEventListener("click", function () {
    applyPreset(6, 2, 2.5, false,
      "Preset loaded: position 7, head C, temperature 2.50. Every position " +
      "is weighted at close to a tenth, and there is nothing to interpret.");
  });

  /* =======================================================================
     Opening prediction
     ===================================================================== */

  var OPENING = {
    "nothing-much": {
      tone: "good", verdict: "That is the position this page will end at.",
      text: "Two processes producing the same output is not evidence that they " +
        "are the same process, and it is not evidence that either explains the " +
        "other. Hold onto that while you do the next two stages."
    },
    "same-mechanism": {
      tone: "caution", verdict: "That is the inference to watch for.",
      text: "It is the most natural reading and it does not follow. You will " +
        "compute the weights yourself in stage 2; when you have, ask what in " +
        "the arithmetic could correspond to the thing you did in stage 1."
    },
    explains: {
      tone: "caution", verdict: "This is the specific error the debrief is about.",
      text: "Attention weights are one factor in one operation in one layer. " +
        "They can be altered substantially without altering the output, and " +
        "identical outputs can arise from very different weights. A heatmap is " +
        "easy to look at, which is exactly why it is over-read."
    },
    attention: {
      tone: "caution", verdict: "The word is doing the work here, not the evidence.",
      text: "“Paying attention in the ordinary sense” implies an agent, a focus " +
        "and something it is like to have one. The operation is a dot product " +
        "followed by a normalisation. Watch the arithmetic in stage 2 and see " +
        "where the agent would have to be."
    }
  };

  function unlockHuman(message) {
    humanSection.hidden = false;
    shell.announce(message, { immediate: true });
    $("#human-heading").focus();
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose one of the four answers before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var response = OPENING[answer.value];
    showFeedback(openingFeedback, response.tone, response.verdict, response.text);
    lockForm(openingForm);
    unlockHuman("Stage 1 unlocked: two sentences, nothing timed.");
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral", "Prediction skipped.",
      "Stage 1 is unlocked. From the front, run stage 1 with the room first " +
      "and only then open stage 2 — the order matters, because it is much " +
      "harder to over-read the weights when you have just done the human task.");
    lockForm(openingForm);
    unlockHuman("Prediction skipped. Stage 1 unlocked.");
  });

  /* =======================================================================
     Stage 1
     ===================================================================== */

  function renderHumanItems() {
    clear(humanItems);
    SENTENCES.forEach(function (sentence, index) {
      var wrap = make("div", "sentence-item");

      var text = make("p", "sentence-item__text");
      text.appendChild(document.createTextNode(sentence.before));
      text.appendChild(make("strong", "sentence-item__pronoun",
        "“" + sentence.pronoun + "”"));
      text.appendChild(document.createTextNode(sentence.after));
      wrap.appendChild(text);

      var group = make("fieldset", "prediction__group");
      var legend = make("legend", "prediction__legend",
        "Sentence " + (index + 1) + ": what does “" + sentence.pronoun +
        "” refer to?");
      group.appendChild(legend);
      sentence.options.concat(["I genuinely cannot tell"]).forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "referent-" + sentence.id;
        input.value = option;
        label.appendChild(input);
        label.appendChild(make("span", null, option));
        group.appendChild(label);
      });
      wrap.appendChild(group);
      humanItems.appendChild(wrap);
    });
  }

  humanForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answers = SENTENCES.map(function (sentence) {
      var checked = $('input[name="referent-' + sentence.id + '"]:checked', humanForm);
      return checked ? checked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      humanError.textContent = "Answer both sentences before continuing.";
      humanError.hidden = false;
      return;
    }
    humanError.hidden = true;
    state.humanAnswers = answers;

    var switched = answers[0] !== answers[1];
    showFeedback(humanFeedback, switched ? "good" : "caution",
      switched ? "Your two answers differ." : "Your two answers are the same.",
      switched
        ? "The last three words changed your answer. Nothing around “it” " +
          "changed."
        : "Most people answer differently, because the last three words are " +
          "what make one reading sensible.");

    clear(humanReadout);
    SENTENCES.forEach(function (sentence, i) {
      var cell = make("div");
      cell.appendChild(make("dt", null, "Sentence " + (i + 1) +
        " (“…" + sentence.after.trim() + "”)"));
      cell.appendChild(make("dd", null, answers[i]));
      humanReadout.appendChild(cell);
    });

    humanText.textContent =
      "You used the sentence as a whole to resolve the pronoun, in about a " +
      "second, and you can say what you decided. Hold on to those two " +
      "properties — fast, and reportable. Now compute the machine-side " +
      "operation on the same sentence.";

    humanNote.textContent =
      SENTENCES[0].why + " " + SENTENCES[1].why +
      " This stage shows that you did it and could report it, not how.";

    humanReflection.hidden = false;
    machineSection.hidden = false;
    state.humanDone = true;
    maybeUnlockChallenge();
    lockForm(humanForm);
    recompute(false);
    shell.announce("Stage 2 unlocked: the same sentence, as ten token positions.",
      { immediate: true });
    $("#machine-heading").focus();
  });

  /* =======================================================================
     Stage 3 — the sorting challenge
     ===================================================================== */

  var CHALLENGE_ITEMS = [
    {
      id: "capacity",
      text: "Selecting one thing comes at a measurable cost to processing something else at the same time.",
      answer: "human",
      why: "Human only. Dual-task costs are among the most reliable findings in " +
        "the field. Spreading a softmax evenly across ten positions costs " +
        "exactly the same arithmetic as concentrating it on one — there is no " +
        "quantity that gets used up."
    },
    {
      id: "report",
      text: "The system can produce a report of what it selected, and that report is evidence about an experience.",
      answer: "human",
      why: "Human only, and even there the relationship between report and " +
        "experience is argued about. A language model can emit a sentence about " +
        "its own weights, but that sentence is generated text, not a report of " +
        "anything the system underwent."
    },
    {
      id: "simplex",
      text: "It is a set of non-negative numbers over a fixed set of positions that sum to exactly one.",
      answer: "machine",
      why: "The transformer operation, by definition — that is what the softmax " +
        "guarantees. Human attention has no such normalisation; there is no " +
        "sense in which a person's selection over a scene sums to one."
    },
    {
      id: "inspectable",
      text: "Where it went can be read off the system's internal state completely and exactly.",
      answer: "machine",
      why: "The transformer operation only. You have just read all ten weights " +
        "to one decimal place. Human selection is inferred from responses, " +
        "errors, eye position and electrophysiology, and every one of those " +
        "inferences is contested. Note that being fully inspectable does not " +
        "make the weights an explanation — see the next row."
    },
    {
      id: "context",
      text: "What gets weighted depends on what came earlier in the sequence, not only on the current input.",
      answer: "both",
      why: "Both, and this is one of the two places the analogy genuinely holds. " +
        "Human selection is shaped by expectation, recent experience and the " +
        "current task; a transformer's weights are a function of the preceding " +
        "tokens, and under a causal mask of nothing else."
    },
    {
      id: "constraint",
      text: "It is a way of allocating something limited, so that not everything can count equally.",
      answer: "both",
      why: "Both, and this is the other genuine rhyme — but state it carefully. " +
        "The constraints are different in kind: one is a limit on a biological " +
        "system operating in real time, the other is the shape of a matrix that " +
        "must produce one output vector per position. What is shared is only " +
        "the formal structure of an allocation problem."
    },
    {
      id: "explanation",
      text: "A picture of it constitutes a complete explanation of why the system produced the output it did.",
      answer: "neither",
      why: "Neither. On the machine side, weights can be altered substantially " +
        "without altering the output, and identical outputs arise from very " +
        "different weight patterns. On the human side, an eye-movement record " +
        "is not a reason for a decision either. The error is the same error in " +
        "both literatures."
    },
    {
      id: "eyes",
      text: "It can be measured by tracking where the eyes are pointing.",
      answer: "neither",
      why: "Neither, which surprises people. A transformer has no eyes. And in " +
        "the human case, eye position is a measure of OVERT orienting only: " +
        "covert attention moves without the eyes, which is the entire point of " +
        "the spatial-cueing paradigm elsewhere in this module."
    }
  ];

  var CHALLENGE_OPTIONS = [
    ["", "Choose…"],
    ["human", "Human experimental attention"],
    ["machine", "Transformer attention weights"],
    ["both", "Both"],
    ["neither", "Neither"]
  ];

  function renderChallenge() {
    clear(challengeRows);
    CHALLENGE_ITEMS.forEach(function (item) {
      var row = make("tr");
      var head = make("th", null, item.text);
      head.setAttribute("scope", "row");
      row.appendChild(head);
      var cell = make("td");
      var select = make("select");
      select.id = "sort-" + item.id;
      var label = make("label", "visually-hidden",
        "This statement is true of: " + item.text);
      label.setAttribute("for", select.id);
      CHALLENGE_OPTIONS.forEach(function (option) {
        var node = make("option", null, option[1]);
        node.value = option[0];
        select.appendChild(node);
      });
      cell.appendChild(label);
      cell.appendChild(select);
      cell.appendChild(make("span", "challenge__mark", ""));
      row.appendChild(cell);
      challengeRows.appendChild(row);
    });
  }

  function maybeUnlockChallenge() {
    if (!state.humanDone) { return; }
    challengeLock.hidden = true;
    challengeButton.disabled = false;
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answered = 0, right = 0;
    CHALLENGE_ITEMS.forEach(function (item) {
      var select = $("#sort-" + item.id, challengeForm);
      var mark = select.parentNode.querySelector(".challenge__mark");
      if (!select.value) { mark.textContent = "Not answered yet."; return; }
      answered += 1;
      var correct = select.value === item.answer;
      if (correct) { right += 1; }
      mark.textContent = correct ? "Correct." : "Not this one.";
    });

    if (!answered) {
      showFeedback(challengeFeedback, "caution", "Nothing chosen yet.",
        "Answer at least one. For each statement, ask what would have to exist " +
        "for it to be true — an experience, a cost, a normalisation, an eye.");
      return;
    }

    showFeedback(challengeFeedback,
      right === CHALLENGE_ITEMS.length ? "good" : "caution",
      right + " of " + CHALLENGE_ITEMS.length + " correct" +
      (answered < CHALLENGE_ITEMS.length
        ? " (" + (CHALLENGE_ITEMS.length - answered) + " left blank)." : "."),
      "Two statements are true of both and two of neither. Those four are the " +
      "useful ones: the “both” pair marks where the analogy actually holds, and " +
      "the “neither” pair marks two errors that are made in both literatures at " +
      "once.");

    var list = make("ul");
    CHALLENGE_ITEMS.forEach(function (item) {
      var li = make("li");
      li.appendChild(make("strong", null, "“" + item.text + "” "));
      li.appendChild(document.createTextNode(item.why));
      list.appendChild(li);
    });
    challengeFeedback.appendChild(list);

    shell.announce("Sorting challenge marked: " + right + " of " +
      CHALLENGE_ITEMS.length + " correct.", { immediate: true });
  });

  /* =======================================================================
     Helpers
     ===================================================================== */

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* =======================================================================
     Reset
     ===================================================================== */

  shell.onReset(function () {
    state = {
      query: DEFAULTS.query,
      head: DEFAULTS.head,
      temperature: DEFAULTS.temperature,
      mask: DEFAULTS.mask,
      humanAnswers: [],
      humanDone: false
    };

    unlockForm(openingForm);
    unlockForm(humanForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    humanFeedback.hidden = true;
    humanError.hidden = true;
    humanReflection.hidden = true;
    challengeFeedback.hidden = true;

    humanSection.hidden = true;
    machineSection.hidden = true;
    challengeLock.hidden = false;
    challengeButton.disabled = true;

    headSelect.value = String(DEFAULTS.head);
    maskCheck.checked = DEFAULTS.mask;
    temperatureRange.value = String(DEFAULTS.temperature);

    renderQueryOptions();
    renderHumanItems();
    renderChallenge();
    renderProvenance();
    recompute(false);
  });

  /* =======================================================================
     Start-up
     ===================================================================== */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Nothing on this page is timed and nothing moves. Stage 2 computes " +
    "ten numbers that sum to one; it does not run a model.",
    { immediate: true });
})();
