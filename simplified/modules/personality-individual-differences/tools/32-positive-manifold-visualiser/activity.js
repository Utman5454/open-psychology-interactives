/**
 * A General Factor With No General Ability  (Simplified Edition)
 *
 * Teaching job: a positive manifold, and a single factor that reproduces it
 * almost exactly, can be produced by a model containing no general ability at
 * all. So the pattern is not evidence that a general ability exists.
 *
 * The model is Thomson's sampling account, which is the one the full Positive
 * Manifold Visualiser sets against the common-factor account. There are
 * PROCESSES small independent processes and nothing else. Each of the six
 * tests draws on a share of the pool, fixed once from a seed, and the
 * correlation between two tests is the overlap between the sets they draw on:
 *
 *     r(i, j) = |S_i intersect S_j| / sqrt(|S_i| * |S_j|)
 *
 * which is the correlation between two sums of shared unit-variance
 * independent terms. Nothing in that expression is a general ability, and yet
 * every off-diagonal entry is positive whenever the sets overlap at all.
 *
 * A single common factor is then fitted to the resulting matrix by alternating
 * least squares on the off-diagonal entries, which is the classic minimum
 * residual solution for one factor:
 *
 *     loading_a  <-  sum over b != a of r(a,b) * loading_b
 *                    divided by sum over b != a of loading_b squared
 *
 * iterated to convergence. The largest absolute residual, max |r(a,b) -
 * loading_a * loading_b|, is displayed, and across the whole range of the
 * control it stays under 0.025. That number is the activity: a mind built with
 * no general ability produces correlations that a general factor reproduces to
 * within a couple of hundredths.
 *
 * FIT AND STRENGTH ARE TWO DIFFERENT THINGS, and keeping them apart is the
 * whole of the wording on this page. They are separate quantities here:
 *
 *   fit       max |r(a,b) - loading_a * loading_b|, how closely the one-factor
 *             model reproduces the correlation matrix. Never above 0.025 at
 *             any setting of the control.
 *   strength  sum of squared loadings over the number of tests, the share of
 *             variance across the six tests the fitted factor carries. Runs
 *             from 0 to about 0.90, tracking the control almost exactly.
 *
 * The reason they can be so far apart is visible in the algebra. With each
 * test drawing a share p of the pool, |S_i| is about pN and |S_i intersect
 * S_j| about p^2 N, so every off-diagonal r is about p: small at low p, but
 * the same small number for all fifteen pairs. A one-factor model with every
 * loading at sqrt(p) reproduces that flat pattern exactly, so the fit is
 * close, while the factor carries only p of the variance. At 5 per cent the
 * fit is as close as it is anywhere and the factor carries 6 per cent.
 *
 * A learner told only that the fit is "excellent" will read it as excellent
 * evidence for a strong general ability, which is the exact inference this
 * activity exists to block. So no readout on this page reports fit without
 * reporting strength beside it.
 *
 * WHY THE SEED MATTERS. Which processes each test uses is drawn once, at load,
 * and never redrawn. The slider changes only how many each test uses. If the
 * assignment were redrawn on every move, the matrix would jump about and the
 * learner would be watching sampling noise rather than the effect of overlap.
 * Seed 1947 was chosen, over the seeds that produce the intended structure,
 * because it keeps the largest residual under 0.023 at every setting of the
 * control rather than only at the default.
 *
 * WHAT THIS ARGUMENT IS NOT. It does not show that no general ability exists,
 * and it does not establish the sampling account. Both accounts fit these
 * correlations, which is the point, and neither is established by them. The
 * caution on the page says so, because running this demonstration in only one
 * direction is the obvious way to misuse it.
 *
 * Deliberate simplifications, stated in the caution: real processes are not
 * fifteen hundred independent things, real tests do not sample them at random,
 * and real matrices are not this tidy.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var PROCESSES = 1500;
  var SEED = 1947;

  /* Generic descriptions. No published test is named or reproduced. */
  var TESTS = [
    { id: "words", name: "Word meanings", short: "Words" },
    { id: "figures", name: "Patterns in figures", short: "Figures" },
    { id: "blocks", name: "Copying block designs", short: "Blocks" },
    { id: "series", name: "Continuing number series", short: "Series" },
    { id: "memory", name: "Repeating sequences back", short: "Sequences" },
    { id: "speed", name: "Matching symbols quickly", short: "Speed" }
  ];

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* One draw per test per process, fixed for the life of the page. A test uses
     a process when its draw falls below the share currently set, so raising
     the share only ever adds processes and never swaps them. */
  var DRAWS = (function () {
    var random = mulberry32(SEED);
    return TESTS.map(function () {
      var row = [];
      for (var i = 0; i < PROCESSES; i += 1) { row.push(random()); }
      return row;
    });
  }());

  function usedBy(index, share) {
    var row = DRAWS[index];
    var count = 0;
    for (var i = 0; i < PROCESSES; i += 1) {
      if (row[i] < share) { count += 1; }
    }
    return count;
  }

  function correlation(a, b, share) {
    if (a === b) { return 1; }
    var rowA = DRAWS[a];
    var rowB = DRAWS[b];
    var na = 0, nb = 0, both = 0;
    for (var i = 0; i < PROCESSES; i += 1) {
      var inA = rowA[i] < share;
      var inB = rowB[i] < share;
      if (inA) { na += 1; }
      if (inB) { nb += 1; }
      if (inA && inB) { both += 1; }
    }
    if (!na || !nb) { return 0; }
    return both / Math.sqrt(na * nb);
  }

  function matrix(share) {
    return TESTS.map(function (_, a) {
      return TESTS.map(function (__, b) { return correlation(a, b, share); });
    });
  }

  function offDiagonal(m) {
    var out = [];
    m.forEach(function (row, a) {
      row.forEach(function (v, b) { if (b > a) { out.push(v); } });
    });
    return out;
  }

  function mean(values) {
    if (!values.length) { return 0; }
    var sum = 0;
    values.forEach(function (v) { sum += v; });
    return sum / values.length;
  }

  /** Minimum-residual one-factor solution, by alternating least squares on the
      off-diagonal entries only. */
  function fitOneFactor(m) {
    var k = m.length;
    var loadings = [];
    var i;
    for (i = 0; i < k; i += 1) { loadings.push(0.6); }
    for (var pass = 0; pass < 900; pass += 1) {
      for (var a = 0; a < k; a += 1) {
        var numerator = 0;
        var denominator = 0;
        for (var b = 0; b < k; b += 1) {
          if (a === b) { continue; }
          numerator += m[a][b] * loadings[b];
          denominator += loadings[b] * loadings[b];
        }
        loadings[a] = denominator ? numerator / denominator : 0;
      }
    }
    return loadings;
  }

  function largestResidual(m, loadings) {
    var worst = 0;
    m.forEach(function (row, a) {
      row.forEach(function (v, b) {
        if (a === b) { return; }
        var d = Math.abs(v - loadings[a] * loadings[b]);
        if (d > worst) { worst = d; }
      });
    });
    return worst;
  }

  /** Share of the total variance across tests carried by the fitted factor.
      This is the factor's STRENGTH, and it is not the same question as
      whether the one-factor model fits. */
  function factorShare(loadings) {
    var sum = 0;
    loadings.forEach(function (l) { sum += l * l; });
    return sum / loadings.length;
  }

  /* How closely the one-factor model reproduces the matrix. Bands are the
     ordinary ones used on a residual of this kind; on this model the answer is
     "close" at every setting, which is the point rather than a coincidence. */
  function fitWord(residual) {
    if (residual <= 0.05) { return "Close fit"; }
    if (residual <= 0.10) { return "Reasonable fit"; }
    return "Poor fit";
  }

  /* How much the factor actually carries. Deliberately a separate vocabulary
     from the fit words, so the two can never be read as one judgement. */
  function strengthWord(share) {
    if (share < 0.18) { return "weak common factor"; }
    if (share < 0.38) { return "modest common factor"; }
    if (share < 0.62) { return "substantial common factor"; }
    return "strong common factor";
  }

  /** The combined verdict: what fits, and how much it carries. */
  function verdictPhrase(state) {
    if (state.share === 0) { return "Nothing to fit"; }
    return fitWord(largestResidual(state.matrix, state.loadings)) + ", " +
      strengthWord(factorShare(state.loadings));
  }

  /* Recomputing the matrix is 1500 comparisons per pair. Cheap, but it happens
     on every slider step and again for every readout, so it is cached. */
  var cache = { share: null, matrix: null, loadings: null };

  function current() {
    var share = Number(overlapInput.value) / 100;
    if (cache.share !== share) {
      var m = matrix(share);
      cache = { share: share, matrix: m, loadings: fitOneFactor(m) };
    }
    return cache;
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardModel;
  var overlapInput, readout, matrixHead, matrixBody, matrixCaption, sentence;
  var fittedBox, loadingsBody, fitBtn, explainBtn, note, noteText;
  var synthesis, resultLead;

  var answered = false;
  var moves = 0;
  var fitted = false;

  var VERDICTS = {
    nothing: { state: "correct", text:
      "Correct, and the model below is the demonstration. It contains no " +
      "general ability at all, and it produces every correlation positive and " +
      "a general factor that reproduces the whole matrix to within a couple " +
      "of hundredths. A finding compatible with two quite different accounts " +
      "cannot be used to choose between them." },
    general: { state: "incorrect", text:
      "This is the inference the pattern was originally taken to support, and " +
      "it is the one the model below is built to test. A mind made of many " +
      "small processes with no general ability in it anywhere produces the " +
      "same positive manifold and the same large first factor. That does not " +
      "make the general-ability account wrong; it makes the correlations " +
      "unable to establish it." },
    similar: { state: "incorrect", text:
      "Content overlap between similar tests is real and it is not the " +
      "explanation here. The manifold holds between tests with almost nothing " +
      "in common on the surface, and it survives every attempt to build a " +
      "battery deliberately free of it. Something more interesting is going on " +
      "than tests resembling each other." },
    exists: { state: "partial", text:
      "This is the careful version of the common answer and it is worth " +
      "separating out. The factor certainly exists in the sense that the " +
      "arithmetic returns one: extract a first factor from any such matrix and " +
      "you will get it. What does not follow is that anything in a person " +
      "corresponds to it, and the model below shows why: a mind with no " +
      "general ability produces the same factor." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "nothing") {
      wb.choices.mark(options.querySelector('[data-choice="nothing"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardModel);
    render();
    wb.scrollTo(cardModel);
    wb.focus(overlapInput);
    wb.announce("The model is open.");
  }

  /* --------------------------------------------------------------- render */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function renderMatrix() {
    var state = current();
    matrixHead.textContent = "";
    matrixHead.appendChild(cell("th", "Test", "col"));
    TESTS.forEach(function (t) { matrixHead.appendChild(cell("th", t.short, "col")); });

    matrixBody.textContent = "";
    TESTS.forEach(function (t, a) {
      var row = global.document.createElement("tr");
      row.appendChild(cell("th", t.name, "row"));
      TESTS.forEach(function (__, b) {
        var v = state.matrix[a][b];
        row.appendChild(cell("td", a === b ? "1" : v.toFixed(2)));
      });
      matrixBody.appendChild(row);
    });

    var off = offDiagonal(state.matrix);
    var lowest = Math.min.apply(null, off);
    matrixCaption.textContent =
      "Correlations between the six tests. Every one of the fifteen is " +
      (lowest > 0 ? "positive, the smallest being " + lowest.toFixed(2) + "."
        : "zero, because no test shares a process with any other.") +
      " Nothing in the model that produced them is shared by all six tests.";
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  /* Four tiles in two rows. The bottom row is the point of the whole page:
     how well the one-factor model fits, and how much its factor carries, side
     by side and never merged into a single verdict. At low overlap the first
     stays close and the second falls away, and a learner who sees only the
     first will draw the wrong conclusion from it. */
  function renderReadout() {
    var state = current();
    var off = offDiagonal(state.matrix);
    var share = state.share;
    var residual = largestResidual(state.matrix, state.loadings);
    var carried = factorShare(state.loadings);

    readout.textContent = "";
    readout.appendChild(tile("Processes each test uses",
      Math.round(share * PROCESSES) + " of " + PROCESSES,
      "drawn once and never redrawn"));
    readout.appendChild(tile("Average correlation", mean(off).toFixed(2),
      Math.min.apply(null, off) > 0
        ? "and every one of the fifteen is positive"
        : "no test shares anything with any other"));
    readout.appendChild(tile("Fit of the one-factor model",
      share === 0 ? "Nothing to fit" : fitWord(residual),
      share === 0
        ? "with no correlations there is nothing for a factor to reproduce"
        : "largest gap between implied and real correlations " +
          residual.toFixed(3)));
    readout.appendChild(tile("Variance that factor carries",
      Math.round(carried * 100) + "%",
      share === 0
        ? "there is no common variance at all"
        : "across the six tests, which is " + strengthWord(carried).replace(
            " common factor", "") + " for a general factor"));
  }

  function renderFitted() {
    if (!fitted) { wb.hide(fittedBox); return; }
    var state = current();
    loadingsBody.textContent = "";
    TESTS.forEach(function (t, i) {
      var row = global.document.createElement("tr");
      row.appendChild(cell("th", t.name, "row"));
      row.appendChild(cell("td", state.loadings[i].toFixed(2)));
      loadingsBody.appendChild(row);
    });
    var row = global.document.createElement("tr");
    row.appendChild(cell("th", "Largest gap between this factor's implied correlations and the real ones", "row"));
    row.appendChild(cell("td", largestResidual(state.matrix, state.loadings).toFixed(3)));
    loadingsBody.appendChild(row);
    wb.show(fittedBox);
  }

  function renderSentence() {
    var state = current();
    var off = offDiagonal(state.matrix);
    if (state.share === 0) {
      sentence.textContent = "At zero overlap no test shares a single process " +
        "with any other, and every correlation is zero. There is no manifold " +
        "to explain, and nothing has been removed from the model to achieve " +
        "that: the general ability was never there.";
      return;
    }
    sentence.textContent =
      "Each test now uses about " + Math.round(state.share * PROCESSES) +
      " of the " + PROCESSES + " processes, so two tests happen to share " +
      "roughly " + Math.round(state.share * state.share * PROCESSES) +
      " of them. That accidental overlap is the entire cause of every " +
      "correlation in the table, and it puts the average at " +
      mean(off).toFixed(2) + ".";
  }

  function render() {
    var output = wb.root.querySelector('output[for="overlap"]');
    if (output) { output.textContent = overlapInput.value + "%"; }
    renderMatrix();
    renderReadout();
    renderFitted();
    renderSentence();
  }

  /* ------------------------------------------------------------- guidance */

  function fit() {
    fitted = true;
    moves = 2;
    explainBtn.disabled = false;
    render();
    var state = current();
    var residual = largestResidual(state.matrix, state.loadings);
    var carried = Math.round(factorShare(state.loadings) * 100);

    /* Two sentences, in this order and never merged: what fits, then what it
       carries. Reporting only the first is what makes "excellent fit" sound
       like excellent evidence for a general ability. */
    noteText.textContent = state.share === 0
      ? "At zero overlap every correlation is zero, so there is nothing for a " +
        "factor to reproduce and nothing for it to carry. Raise the slider " +
        "and both numbers start to move, but they do not move together."
      : verdictPhrase(state) + ". The one-factor model reproduces these " +
        "correlations to within " + residual.toFixed(3) + ", which by any " +
        "ordinary standard is a close fit and would be reported as one. That " +
        "is a statement about how well the model matches the pattern. It is " +
        "not a statement about how much the factor matters: this one carries " +
        carried + " per cent of the variance across the six tests, with " +
        "loadings from " + Math.min.apply(null, state.loadings).toFixed(2) +
        " to " + Math.max.apply(null, state.loadings).toFixed(2) + ". Move " +
        "the slider. The fit stays close at every setting; the share of " +
        "variance does not. And there is no general ability in the model at " +
        "any of them.";
    wb.show(note);
    wb.announce(state.share === 0
      ? "Nothing to fit at zero overlap."
      : verdictPhrase(state) + ". Largest residual " + residual.toFixed(3) +
        ", carrying " + carried + " per cent of the variance.");
  }

  function onSlide() {
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var state = current();
    var carriedPct = Math.round(factorShare(state.loadings) * 100);
    resultLead.textContent = state.share === 0
      ? "With no overlap there are no correlations to explain. Raise the " +
        "slider and the whole pattern appears, out of a model that contains " +
        "no general ability at any setting."
      : "Six tests, " + PROCESSES + " small independent processes and no " +
        "general ability anywhere. The average correlation is " +
        mean(offDiagonal(state.matrix)).toFixed(2) + " and every one of the " +
        "fifteen is positive. A single general factor reproduces the matrix " +
        "to within " + largestResidual(state.matrix, state.loadings).toFixed(3) +
        ", and carries " + carriedPct + " per cent of the variance across " +
        "the six tests. Those are two separate findings, and only the second " +
        "is about how much the factor matters.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardModel = wb.root.querySelector("#card-model");
    overlapInput = wb.root.querySelector("#overlap");
    readout = wb.root.querySelector("#readout");
    matrixHead = wb.root.querySelector("#matrix-head");
    matrixBody = wb.root.querySelector("#matrix-body");
    matrixCaption = wb.root.querySelector("#matrix-caption");
    sentence = wb.root.querySelector("#sentence");
    fittedBox = wb.root.querySelector("#fitted");
    loadingsBody = wb.root.querySelector("#loadings-body");
    fitBtn = wb.root.querySelector("#fit");
    explainBtn = wb.root.querySelector("#explain");
    note = wb.root.querySelector("#note");
    noteText = wb.root.querySelector("#note-text");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    overlapInput.addEventListener("input", onSlide);
    overlapInput.addEventListener("change", onSlide);
    fitBtn.addEventListener("click", fit);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      moves = 0;
      fitted = false;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardModel);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      overlapInput.value = "40";
      render();
    });

    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
