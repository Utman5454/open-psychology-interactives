/* =========================================================================
   Factor Rotation Playground
   -------------------------------------------------------------------------
   Twelve fictional adjective markers plotted in a two-dimensional factor
   space. Students rotate the axes and watch every loading change while the
   configuration of the points does not move at all.

   THE EDUCATIONAL MODEL
   ---------------------
   Each marker has a fixed position in the plane — a pair of coordinates that
   came out of the (fictional) extraction and never changes. Rotation changes
   only the axes against which those positions are read.

   Orthogonal rotation by angle θ:

       loading₁ =  x·cos θ + y·sin θ
       loading₂ = -x·sin θ + y·cos θ

   Oblique rotation lets the second axis move independently, so the angle
   between the axes is no longer 90°. Loadings are then read as coordinates in
   a non-orthogonal basis, and the factors themselves correlate:

       r(F₁,F₂) = cos(angle between the axes)

   THE TWO THINGS THAT MUST STAY SEPARATE
   --------------------------------------
   What changes under rotation:
     * every loading;
     * which items count as "salient" on which factor;
     * the labels anybody would give the factors;
     * how simple the structure looks.

   What does NOT change:
     * the position of every marker relative to every other;
     * each marker's communality (how much of it the two factors explain);
     * the total variance the two factors account for;
     * the fit of the model to the data.

   That is the whole lesson, and it cuts both ways. Rotation is not a trick
   that manufactures results: nothing about the data or the fit changes. Nor
   is any single rotated solution uniquely true: the mathematics does not
   privilege one, and simple structure is a criterion people adopted because
   it makes solutions interpretable and comparable — not a fact discovered in
   the data.

   SIMPLE STRUCTURE
   ----------------
   Scored here with a normalised complexity measure. A marker loading highly
   on one factor and near zero on the other is simple; a marker loading
   moderately on both is not. The tool reports the mean across markers and
   marks the target as reachable, because in this fictional set it is.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var DEG = Math.PI / 180;

  /* Three fictional marker sets. Coordinates are unrotated positions in the
     plane; they are the fixed thing the whole tool is about. */
  var SETS = {
    clean: {
      name: "A clean two-cluster structure",
      note:
        "Two tight groups roughly at right angles. Simple structure is " +
        "reachable, and almost everybody finds the same rotation.",
      markers: [
        { id: "talkative", name: "talkative", x: 0.78, y: 0.22 },
        { id: "outgoing", name: "outgoing", x: 0.82, y: 0.16 },
        { id: "bold", name: "bold", x: 0.71, y: 0.28 },
        { id: "lively", name: "lively", x: 0.75, y: 0.10 },
        { id: "reserved", name: "reserved", x: -0.74, y: -0.12 },
        { id: "quiet", name: "quiet", x: -0.79, y: -0.06 },
        { id: "organised", name: "organised", x: 0.18, y: 0.80 },
        { id: "thorough", name: "thorough", x: 0.12, y: 0.76 },
        { id: "punctual", name: "punctual", x: 0.24, y: 0.71 },
        { id: "careful", name: "careful", x: 0.09, y: 0.83 },
        { id: "careless", name: "careless", x: -0.14, y: -0.77 },
        { id: "untidy", name: "untidy", x: -0.08, y: -0.72 }
      ]
    },
    crossloading: {
      name: "One item that will not settle",
      note:
        "The same structure with one marker sitting between the two clusters. " +
        "No rotation makes it simple, which is what a genuine cross-loading " +
        "looks like.",
      markers: [
        { id: "talkative", name: "talkative", x: 0.78, y: 0.22 },
        { id: "outgoing", name: "outgoing", x: 0.82, y: 0.16 },
        { id: "bold", name: "bold", x: 0.71, y: 0.28 },
        { id: "lively", name: "lively", x: 0.75, y: 0.10 },
        { id: "reserved", name: "reserved", x: -0.74, y: -0.12 },
        { id: "organised", name: "organised", x: 0.18, y: 0.80 },
        { id: "thorough", name: "thorough", x: 0.12, y: 0.76 },
        { id: "punctual", name: "punctual", x: 0.24, y: 0.71 },
        { id: "careful", name: "careful", x: 0.09, y: 0.83 },
        { id: "careless", name: "careless", x: -0.14, y: -0.77 },
        { id: "energetic", name: "energetic", x: 0.58, y: 0.55 },
        { id: "driven", name: "driven", x: 0.52, y: 0.60 }
      ]
    },
    correlated: {
      name: "Clusters that are not at right angles",
      note:
        "The two groups sit about 55° apart. An orthogonal rotation cannot " +
        "put an axis through both; an oblique one can, at the price of " +
        "factors that correlate.",
      markers: [
        { id: "talkative", name: "talkative", x: 0.80, y: 0.14 },
        { id: "outgoing", name: "outgoing", x: 0.84, y: 0.08 },
        { id: "bold", name: "bold", x: 0.74, y: 0.22 },
        { id: "lively", name: "lively", x: 0.78, y: 0.04 },
        { id: "reserved", name: "reserved", x: -0.76, y: -0.10 },
        { id: "warm", name: "warm", x: 0.62, y: 0.56 },
        { id: "kind", name: "kind", x: 0.55, y: 0.62 },
        { id: "trusting", name: "trusting", x: 0.60, y: 0.58 },
        { id: "considerate", name: "considerate", x: 0.51, y: 0.66 },
        { id: "harsh", name: "harsh", x: -0.56, y: -0.60 },
        { id: "blunt", name: "blunt", x: -0.48, y: -0.55 },
        { id: "aloof", name: "aloof", x: -0.70, y: -0.30 }
      ]
    }
  };

  var SALIENT = 0.4;

  /* The coordinates above were written cluster-by-cluster, which happens to
     put them almost in simple structure already — so at 0° there would be
     nothing for rotation to do, and "find the simplest structure" would
     return 0°. That is not what an unrotated extraction looks like: a
     first unrotated factor typically runs between the clusters with
     everything loading on it.

     Pre-rotating every set by a constant reproduces that starting point.
     Because the same rotation is applied to every marker, all the relative
     geometry the sets were designed around — cluster separation, the
     cross-loading, the 55° case — is exactly preserved. Only the starting
     orientation changes, and rotation now has real work to do. */
  var UNROTATED_OFFSET = 45;

  (function preRotate() {
    var a = UNROTATED_OFFSET * DEG;
    Object.keys(SETS).forEach(function (id) {
      SETS[id].markers.forEach(function (marker) {
        var x = marker.x;
        var y = marker.y;
        marker.x = x * Math.cos(a) - y * Math.sin(a);
        marker.y = x * Math.sin(a) + y * Math.cos(a);
      });
    });
  })();

  /* =======================================================================
     Model
     ===================================================================== */

  /**
   * Loadings on the two axes.
   * @param {object} marker
   * @param {number} angle   rotation of the first axis, degrees
   * @param {number} obliqueAngle  angle BETWEEN the axes, degrees (90 = orthogonal)
   */
  function loadings(marker, angle, obliqueAngle) {
    var a = angle * DEG;
    var b = (angle + obliqueAngle) * DEG;
    // Project onto each axis direction. With a non-right angle between them
    // these are direction cosines rather than a coordinate transform, which
    // is exactly why oblique loadings are read as pattern coefficients.
    return {
      one: marker.x * Math.cos(a) + marker.y * Math.sin(a),
      two: marker.x * Math.cos(b) + marker.y * Math.sin(b)
    };
  }

  /** Correlation between the factors implied by the angle between the axes. */
  function factorCorrelation(obliqueAngle) {
    return Math.cos(obliqueAngle * DEG);
  }

  /** Communality: how much of the marker the two factors account for. */
  function communality(marker) {
    return marker.x * marker.x + marker.y * marker.y;
  }

  /**
   * Simple structure, 0 to 1. For each marker, how concentrated its two
   * loadings are on one factor. Uses the normalised squared-loading
   * proportion, which is 1 when a marker loads on one factor only.
   */
  function simplicity(markers, angle, obliqueAngle) {
    var total = 0;
    markers.forEach(function (marker) {
      var l = loadings(marker, angle, obliqueAngle);
      var a = l.one * l.one;
      var b = l.two * l.two;
      var sum = a + b;
      if (sum < 1e-9) { total += 0; return; }
      var p = Math.max(a, b) / sum;
      // Rescale from [0.5, 1] to [0, 1]: 0.5 means equally split.
      total += (p - 0.5) * 2;
    });
    return total / markers.length;
  }

  /** Markers that load saliently on each factor, and on both. */
  function salience(markers, angle, obliqueAngle) {
    var one = [];
    var two = [];
    var both = [];
    markers.forEach(function (marker) {
      var l = loadings(marker, angle, obliqueAngle);
      var inOne = Math.abs(l.one) >= SALIENT;
      var inTwo = Math.abs(l.two) >= SALIENT;
      if (inOne && inTwo) { both.push(marker); }
      else if (inOne) { one.push(marker); }
      else if (inTwo) { two.push(marker); }
    });
    return { one: one, two: two, both: both };
  }

  /**
   * A tentative label, built from the highest-loading markers. Deliberately
   * hedged: naming a factor is an interpretive act, not a result.
   */
  function tentativeLabel(markers, angle, obliqueAngle, which) {
    var scored = markers.map(function (marker) {
      var l = loadings(marker, angle, obliqueAngle);
      return { marker: marker, value: which === "one" ? l.one : l.two };
    }).sort(function (a, b) {
      return Math.abs(b.value) - Math.abs(a.value);
    });

    var top = scored.slice(0, 3).filter(function (entry) {
      return Math.abs(entry.value) >= SALIENT;
    });
    if (!top.length) {
      return "nothing loads saliently on this axis";
    }
    return top.map(function (entry) {
      return (entry.value < 0 ? "not " : "") + entry.marker.name;
    }).join(", ");
  }

  /** The rotation that maximises simple structure, found by a coarse sweep. */
  function bestAngle(markers, obliqueAngle) {
    var best = 0;
    var bestScore = -Infinity;
    for (var angle = 0; angle < 180; angle += 0.5) {
      var score = simplicity(markers, angle, obliqueAngle);
      if (score > bestScore) {
        bestScore = score;
        best = angle;
      }
    }
    return { angle: best, score: bestScore };
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(value, places) {
    return value === null || value === undefined || isNaN(value)
      ? "—" : value.toFixed(places === undefined ? 2 : places);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#rotation");
  if (!shell) { return; }

  var page = document;
  var $ = function (selector, scope) { return (scope || page).querySelector(selector); };

  var plot = $("[data-plot]");
  var loadingTable = $("[data-loading-table]");
  var readout = $("[data-readout]");
  var labelOne = $("[data-label-one]");
  var labelTwo = $("[data-label-two]");
  var invariantNote = $("[data-invariant]");
  var setSelect = $("#set-select");
  var setNote = $("[data-set-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");
  var challengeStatus = $("[data-challenge-status]");

  var INITIAL = { setId: "clean", angle: 0, oblique: 90, stage: "predict" };
  var state = null;
  var rangeSyncs = [];
  var baseline = null; // invariants captured at angle 0, to prove they hold

  function bindRange(input, options) {
    var settings = options || {};
    var output = page.querySelector('output[for="' + input.id + '"]');
    function sync() {
      var value = Number(input.value);
      if (output) {
        output.textContent = settings.format ? settings.format(value) : String(value);
      }
      input.setAttribute(
        "aria-valuetext", (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() { rangeSyncs.forEach(function (s) { s(); }); }

  function currentSet() { return SETS[state.setId]; }

  Object.keys(SETS).forEach(function (id) {
    var option = make("option", null, SETS[id].name);
    option.value = id;
    setSelect.appendChild(option);
  });

  setSelect.addEventListener("change", function () {
    state.setId = setSelect.value;
    state.angle = 0;
    $("#angle-range").value = "0";
    captureBaseline();
    syncRanges();
    render();
    shell.announce(
      "Marker set changed to: " + currentSet().name + ". " + currentSet().note,
      { immediate: true });
  });

  bindRange($("#angle-range"), {
    format: function (v) { return v + "°"; },
    describe: function (v) { return "first axis rotated " + v + " degrees"; },
    onInput: function (v) { state.angle = v; render(); }
  });

  bindRange($("#oblique-range"), {
    format: function (v) { return v + "°"; },
    describe: function (v) {
      return v === 90
        ? "axes at right angles, orthogonal solution"
        : "axes " + v + " degrees apart, oblique solution, factors correlate " +
          fmt(factorCorrelation(v));
    },
    onInput: function (v) { state.oblique = v; render(); }
  });

  $('[data-action="best"]').addEventListener("click", function () {
    var best = bestAngle(currentSet().markers, state.oblique);
    state.angle = Math.round(best.angle);
    $("#angle-range").value = String(state.angle);
    syncRanges();
    render();
    shell.announce(
      "Rotated to " + state.angle + " degrees, the simplest structure " +
        "available at this axis angle. Simplicity " + fmt(best.score) + ".",
      { immediate: true });
  });

  function captureBaseline() {
    var markers = currentSet().markers;
    baseline = {
      communalities: markers.map(communality),
      totalVariance: markers.reduce(function (t, m) { return t + communality(m); }, 0)
    };
  }

  /* --- Rendering ------------------------------------------------------------ */

  function render() {
    if (state.stage !== "explore") { return; }
    setNote.textContent = currentSet().note;
    drawPlot();
    renderTable();
    renderReadout();
    renderLabels();
    renderInvariants();
    renderChallengeStatus();
  }

  function drawPlot() {
    var NS = "http://www.w3.org/2000/svg";
    var SIZE = 320;
    var PAD = 30;
    var cx = PAD + SIZE / 2;
    var cy = PAD + SIZE / 2;
    var scale = SIZE / 2;

    clear(plot);
    plot.setAttribute("viewBox", "0 0 " + (SIZE + PAD * 2) + " " + (SIZE + PAD * 2));

    // Unit circle
    var circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", String(cx));
    circle.setAttribute("cy", String(cy));
    circle.setAttribute("r", String(scale));
    circle.setAttribute("class", "plot__circle");
    plot.appendChild(circle);

    // The two axes, drawn at their current angles.
    [[state.angle, "one", "F1"], [state.angle + state.oblique, "two", "F2"]]
      .forEach(function (entry) {
        var a = entry[0] * DEG;
        var dx = Math.cos(a) * scale;
        var dy = Math.sin(a) * scale;
        var axis = document.createElementNS(NS, "line");
        axis.setAttribute("x1", String(cx - dx));
        axis.setAttribute("y1", String(cy + dy));
        axis.setAttribute("x2", String(cx + dx));
        axis.setAttribute("y2", String(cy - dy));
        axis.setAttribute("class", "plot__axis plot__axis--" + entry[1]);
        plot.appendChild(axis);

        var label = document.createElementNS(NS, "text");
        label.setAttribute("x", String(cx + dx * 1.06));
        label.setAttribute("y", String(cy - dy * 1.06 + 4));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "chart__label");
        label.textContent = entry[2];
        plot.appendChild(label);
      });

    // Markers — their positions never change.
    currentSet().markers.forEach(function (marker) {
      var px = cx + marker.x * scale;
      var py = cy - marker.y * scale;

      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(px));
      dot.setAttribute("cy", String(py));
      dot.setAttribute("r", "4");
      dot.setAttribute("class", "plot__marker");
      plot.appendChild(dot);

      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(px + (marker.x >= 0 ? 7 : -7)));
      text.setAttribute("y", String(py + 4));
      text.setAttribute("text-anchor", marker.x >= 0 ? "start" : "end");
      text.setAttribute("class", "plot__label");
      text.textContent = marker.name;
      plot.appendChild(text);
    });
  }

  function renderTable() {
    clear(loadingTable);
    currentSet().markers.forEach(function (marker, index) {
      var l = loadings(marker, state.angle, state.oblique);
      var row = make("tr");
      var th = make("th", null, marker.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, fmt(l.one)));
      row.appendChild(make("td", null, fmt(l.two)));
      row.appendChild(make("td", null, fmt(communality(marker))));
      var salientOn =
        Math.abs(l.one) >= SALIENT && Math.abs(l.two) >= SALIENT ? "both"
          : Math.abs(l.one) >= SALIENT ? "F1"
          : Math.abs(l.two) >= SALIENT ? "F2" : "neither";
      row.appendChild(make("td", null, salientOn));
      loadingTable.appendChild(row);
    });
  }

  function renderReadout() {
    clear(readout);
    var markers = currentSet().markers;
    var s = salience(markers, state.angle, state.oblique);
    [
      ["Simple structure", fmt(simplicity(markers, state.angle, state.oblique))],
      ["Salient on F1 only", String(s.one.length)],
      ["Salient on F2 only", String(s.two.length)],
      ["Salient on both", String(s.both.length)],
      ["Factor correlation", fmt(factorCorrelation(state.oblique))]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderLabels() {
    labelOne.textContent =
      tentativeLabel(currentSet().markers, state.angle, state.oblique, "one");
    labelTwo.textContent =
      tentativeLabel(currentSet().markers, state.angle, state.oblique, "two");
  }

  function renderInvariants() {
    var markers = currentSet().markers;
    var nowTotal = markers.reduce(function (t, m) { return t + communality(m); }, 0);
    var maxDrift = Math.max.apply(null, markers.map(function (m, i) {
      return Math.abs(communality(m) - baseline.communalities[i]);
    }));

    invariantNote.textContent =
      "Rotated " + state.angle + "°, axes " + state.oblique + "° apart. Every " +
      "loading in the table has changed. Meanwhile: total variance explained " +
      "is " + fmt(nowTotal) + " (it was " + fmt(baseline.totalVariance) +
      "), and the largest change in any marker's communality is " +
      fmt(maxDrift, 3) + ". The points on the plot have not moved at all — " +
      "only the axes you are reading them against.";
  }

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    nothing: {
      tone: "good",
      verdict: "Yes — and that is the surprising part.",
      text:
        "Rotation changes every loading and changes nothing about the fit. " +
        "The model explains exactly as much variance after rotation as before, " +
        "and each variable's communality is untouched. What changes is which " +
        "description of the same configuration you are looking at."
    },
    better: {
      tone: "caution",
      verdict: "Not quite.",
      text:
        "Fit is unchanged by rotation — that is what makes rotation legitimate " +
        "and also what makes it non-arbitrary in a way people find " +
        "uncomfortable. Rotation improves interpretability, not fit, and those " +
        "are different virtues."
    },
    worse: {
      tone: "caution",
      verdict: "No.",
      text:
        "Nothing is lost. The rotated solution reproduces the correlations " +
        "exactly as well as the unrotated one. If it did not, rotation would " +
        "be a form of cheating rather than a change of description."
    },
    depends: {
      tone: "caution",
      verdict: "Not in the way you might expect.",
      text:
        "It does not depend on the rotation method: orthogonal and oblique " +
        "rotations both leave fit unchanged. What differs between them is " +
        "whether the factors are allowed to correlate, which is a substantive " +
        "choice about the constructs, not a statistical one about fit."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before rotating anything.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    state.stage = "explore";
    setControlsEnabled(true);
    render();
    shell.announce("Playground unlocked.", { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.",
      "With a class, ask what rotation does to model fit before unlocking the " +
        "playground.");
    lockForm(openingForm);
    state.stage = "explore";
    setControlsEnabled(true);
    render();
    shell.announce("Playground unlocked.", { immediate: true });
  });

  function setControlsEnabled(enabled) {
    $("#angle-range").disabled = !enabled;
    $("#oblique-range").disabled = !enabled;
    setSelect.disabled = !enabled;
    $('[data-action="best"]').disabled = !enabled;
  }

  /* --- Challenge -------------------------------------------------------------- */

  function renderChallengeStatus() {
    var markers = currentSet().markers;
    var score = simplicity(markers, state.angle, state.oblique);
    var best = bestAngle(markers, state.oblique);
    challengeStatus.textContent =
      "Current simple structure: " + fmt(score) + ". The best available at " +
      "this axis angle is " + fmt(best.score) + ", at " +
      Math.round(best.angle) + "°.";
    challengeStatus.setAttribute(
      "data-tone", score >= best.score - 0.02 ? "good" : "neutral");
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }
    var correct = answer.value === "interpretive";
    showFeedback(
      challengeFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "Mathematically, nothing changed: the same configuration of points, the " +
        "same communalities, the same fit, the same reproduced correlation " +
        "matrix. What changed is interpretive — which items count as salient " +
        "on which factor, and therefore what anybody would call the factors."
    );
    shell.announce("Challenge answered.", { immediate: true });
  });

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { paragraph.appendChild(document.createTextNode(" " + text)); }
    container.appendChild(paragraph);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = false; });
    form.reset();
  }

  /* --- Reset -------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    setSelect.value = state.setId;
    $("#angle-range").value = "0";
    $("#oblique-range").value = "90";
    setControlsEnabled(false);
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    captureBaseline();
    syncRanges();
  });

  /* --- Start-up ------------------------------------------------------------------ */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the playground.",
    { immediate: true });
})();
