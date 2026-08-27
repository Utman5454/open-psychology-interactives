/**
 * Turn the Axes, Change Every Number  (Simplified Edition)
 *
 * Teaching job: rotation changes every loading and changes nothing about how
 * well the model fits, so the choice of rotation, and the name put on a
 * factor, are interpretive acts rather than results.
 *
 * The mechanism is the one from the full Factor Rotation Playground. Twelve
 * markers have fixed coordinates in the plane spanned by the two extracted
 * factors. Rotating the axes by theta re-expresses each marker in the new
 * basis:
 *
 *     loading1 = r * cos(phi - theta)
 *     loading2 = r * sin(phi - theta)
 *
 * where (r, phi) are the marker's polar coordinates. Everything the learner is
 * asked to notice follows from the fact that this is a rotation:
 *
 *   - every loading changes;
 *   - r does not, so each communality (r squared) is fixed;
 *   - the sum of communalities does not, so the total variance accounted for
 *     is fixed, which is the same statement as "the fit does not change";
 *   - the variance carried by each factor separately DOES change, because
 *     rotation redistributes it between the two axes. This is the one moving
 *     number that is easy to mistake for a change in fit, so it is displayed
 *     next to the total rather than left out.
 *
 * The marker set was constructed, not sampled. The two clusters sit 90 degrees
 * apart so that an orthogonal rotation can reach a clean simple structure; one
 * marker sits between them and stays a genuine cross-loading at every angle;
 * one marker sits close to the origin and has a low communality at every
 * angle. At theta = 0 the first factor contrasts one cluster against the
 * other, which is what an unrotated extraction typically looks like and why
 * anyone rotates.
 *
 * Deliberate simplification: the axes are held at 90 degrees. Oblique rotation
 * is a second teaching job and the caution says what it would add.
 */
(function (global) {
  "use strict";

  var wb = null;
  var DEG = Math.PI / 180;

  /* ---------------------------------------------------------------- model */

  /* angle is the marker's direction in the unrotated solution, in degrees;
     radius is the square root of its communality. */
  var MARKERS = [
    { name: "talkative", angle: 30, radius: 0.68 },
    { name: "outgoing", angle: 38, radius: 0.82 },
    { name: "energetic", angle: 46, radius: 0.60 },
    { name: "cheerful", angle: 52, radius: 0.78 },
    { name: "bold", angle: 60, radius: 0.66 },
    { name: "enthusiastic", angle: 90, radius: 0.70 },
    { name: "organised", angle: 120, radius: 0.66 },
    { name: "careful", angle: 128, radius: 0.80 },
    { name: "thorough", angle: 136, radius: 0.62 },
    { name: "punctual", angle: 144, radius: 0.78 },
    { name: "tidy", angle: 152, radius: 0.70 },
    { name: "unusual", angle: 75, radius: 0.34 }
  ];

  /* A loading at or above this counts as salient. 0.40 is a common working
     threshold and, like every such threshold, a convention rather than a
     finding. The page says so. */
  var SALIENT = 0.40;

  function loadings(marker, theta) {
    var phi = (marker.angle - theta) * DEG;
    return [marker.radius * Math.cos(phi), marker.radius * Math.sin(phi)];
  }

  function communality(marker) { return marker.radius * marker.radius; }

  /** Sum of squared loadings on one factor: the variance that factor carries.
      This one moves when you rotate. */
  function factorVariance(theta, which) {
    var total = 0;
    MARKERS.forEach(function (m) {
      var l = loadings(m, theta)[which];
      total += l * l;
    });
    return total;
  }

  function totalVariance() {
    var total = 0;
    MARKERS.forEach(function (m) { total += communality(m); });
    return total;
  }

  /**
   * Normalised varimax criterion at one angle. Maximising it is what "find the
   * simplest structure" means, and it is worth being explicit that this is a
   * criterion being maximised rather than a truth being located.
   */
  function varimax(theta) {
    var n = MARKERS.length;
    var total = 0;
    [0, 1].forEach(function (which) {
      var sum = 0;
      var sumSq = 0;
      MARKERS.forEach(function (m) {
        var scaled = loadings(m, theta)[which] / m.radius;
        var q = scaled * scaled;
        sum += q;
        sumSq += q * q;
      });
      total += sumSq - (sum * sum) / n;
    });
    return total;
  }

  /* Searched once at load over the whole range at whole degrees, because the
     slider only offers whole degrees: reporting an optimum the control cannot
     reach would be an odd thing to do. */
  var SIMPLEST = (function () {
    var best = -Infinity;
    var bestTheta = 0;
    for (var t = 0; t <= 90; t += 1) {
      var v = varimax(t);
      if (v > best) { best = v; bestTheta = t; }
    }
    return bestTheta;
  }());

  function salienceOf(theta, marker) {
    var l = loadings(marker, theta);
    var a = Math.abs(l[0]);
    var b = Math.abs(l[1]);
    if (a < SALIENT && b < SALIENT) { return "neither factor"; }
    if (a >= SALIENT && b >= SALIENT) { return "both, a cross-loading"; }
    return a > b ? "factor 1" : "factor 2";
  }

  /**
   * How a factor reads at this angle: the marker at its high end, and the
   * marker at its low end when the low end is substantial.
   *
   * Reporting only the single highest-loading marker is not enough here. An
   * unrotated factor is typically bipolar, contrasting one group of markers
   * against another, and the marker at the top of it can be the same one that
   * is at the top after rotation. What changes is whether there is anything at
   * the other end, and that is precisely the difference between a factor you
   * would name for a contrast and one you would name for a cluster.
   */
  function reading(theta, which) {
    var high = null;
    var low = null;
    MARKERS.forEach(function (m) {
      var v = loadings(m, theta)[which];
      if (high === null || v > high.value) { high = { name: m.name, value: v }; }
      if (low === null || v < low.value) { low = { name: m.name, value: v }; }
    });
    return {
      high: high,
      low: low,
      bipolar: Math.abs(low.value) >= SALIENT && high.value >= SALIENT
    };
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardPlay;
  var angleInput, chart, chartDesc, readout, labelLine, body;
  var simpleBtn, explainBtn, note, noteText, synthesis, resultLead;

  var REVEAL_AFTER = 2;
  var answered = false;
  var movesMade = 0;

  function theta() { return Number(angleInput.value); }

  var VERDICTS = {
    nothing: { state: "correct", text:
      "Correct, and it is the whole point. A rotation re-expresses the same " +
      "configuration of points against a different pair of axes. The model " +
      "reproduces the correlations exactly as well afterwards as before, so " +
      "nothing in the data can tell you which rotation to prefer. Turn the " +
      "dial and watch the two things that never move." },
    better: { state: "incorrect", text:
      "This is the common answer and it is the wrong way round. People rotate " +
      "because the result is easier to read, not because it fits better. " +
      "Nothing about the fit changes, which is exactly why rotation is " +
      "allowed: if it did change the fit, choosing a rotation would be " +
      "choosing a different model." },
    worse: { state: "incorrect", text:
      "There is no trade here. You are imagining that readability has to be " +
      "bought with some loss of accuracy, which is a sound instinct in " +
      "general and simply does not apply to a rotation. The fit is identical, " +
      "to the last decimal place, at every angle you can set." },
    depends: { state: "incorrect", text:
      "Rotation methods differ in what they aim at, and varimax, quartimax " +
      "and oblimin will hand you different loadings. None of them changes the " +
      "fit. Even letting the axes come off 90 degrees, which is a bigger " +
      "change than anything this page does, leaves the fit alone." }
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
    wb.announce("Answer recorded. You can now open the playground.");
  }

  function reveal() {
    wb.show(cardPlay);
    render();
    wb.scrollTo(cardPlay);
    wb.focus(angleInput);
    wb.announce("The playground is open. Use the slider to rotate the axes.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var CX = 310, CY = 316, SCALE = 150, ARM = 178, BACK = 0.55;
  var CLUSTER = "#1C7293";
  var SPECIAL = "#9E7318";

  function render() {
    var t = theta();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 620 470");

    /* Unit circle: a marker cannot sit outside it, because a communality
       cannot exceed one. It also makes it visible that the points stay put. */
    chart.appendChild(svg("circle", {
      cx: CX, cy: CY, r: SCALE, fill: "none", class: "plot__axis", opacity: 0.5
    }));

    /* The two axes, drawn through the centre in both directions so that the
       rotation is visible as a rotation rather than as two sliding lines. The
       negative arms are shorter: every marker in this solution has a positive
       communality and none sits below the origin, so a full-length lower half
       would be an empty third of the figure. The arms still cross, which is
       what makes it read as a pair of axes. */
    [0, 1].forEach(function (which) {
      var a = (t + which * 90) * DEG;
      var dx = Math.cos(a) * ARM;
      var dy = -Math.sin(a) * ARM;
      chart.appendChild(svg("line", {
        x1: (CX - dx * BACK).toFixed(1), y1: (CY - dy * BACK).toFixed(1),
        x2: (CX + dx).toFixed(1), y2: (CY + dy).toFixed(1),
        stroke: "#1A2744", "stroke-width": 2
      }));
      var label = svg("text", {
        x: (CX + dx * 1.09).toFixed(1), y: (CY + dy * 1.09 + 4).toFixed(1),
        "text-anchor": dx > 6 ? "start" : (dx < -6 ? "end" : "middle"),
        class: "plot__label"
      });
      label.textContent = "Factor " + (which + 1);
      chart.appendChild(label);
    });

    /* Markers last so a point is never drawn under an axis line. */
    MARKERS.forEach(function (m, i) {
      var x = CX + Math.cos(m.angle * DEG) * m.radius * SCALE;
      var y = CY - Math.sin(m.angle * DEG) * m.radius * SCALE;
      var colour = (m.name === "enthusiastic" || m.name === "unusual") ? SPECIAL : CLUSTER;
      chart.appendChild(svg("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: 5.5, fill: colour }));
      var label = svg("text", {
        x: (CX + Math.cos(m.angle * DEG) * (m.radius * SCALE + 15)).toFixed(1),
        y: (CY - Math.sin(m.angle * DEG) * (m.radius * SCALE + 15) + 4).toFixed(1),
        "text-anchor": "middle", class: "plot__sub", fill: colour
      });
      label.textContent = String(i + 1);
      chart.appendChild(label);
    });

    describe(t);
    readouts(t);
    table(t);
  }

  function describe(t) {
    var one = reading(t, 0).high;
    var two = reading(t, 1).high;
    chartDesc.textContent =
      "Twelve numbered points on a circle, fixed in place, with two axes " +
      "through the centre at right angles to each other. The axes are turned " +
      t + " degrees from the extracted solution. The marker loading highest " +
      "on factor 1 is number " + (indexOf(one.name) + 1) + ", " + one.name +
      ", at " + one.value.toFixed(2) + ". The marker loading highest on " +
      "factor 2 is number " + (indexOf(two.name) + 1) + ", " + two.name +
      ", at " + two.value.toFixed(2) + ". Factor 1 carries " +
      factorVariance(t, 0).toFixed(2) + " units of variance and factor 2 " +
      "carries " + factorVariance(t, 1).toFixed(2) + ", together " +
      totalVariance().toFixed(2) + ", which is the same total at every angle. " +
      "Every loading is listed in the table below the chart.";
  }

  function indexOf(name) {
    var found = -1;
    MARKERS.forEach(function (m, i) { if (m.name === name) { found = i; } });
    return found;
  }

  function tile(label, value, note) {
    var li = global.document.createElement("li");
    li.className = "result";
    var l = global.document.createElement("p");
    l.className = "result__label";
    l.textContent = label;
    var v = global.document.createElement("p");
    v.className = "result__value big";
    v.textContent = value;
    var n = global.document.createElement("span");
    n.className = "result__note";
    n.textContent = note;
    li.appendChild(l); li.appendChild(v); li.appendChild(n);
    return li;
  }

  function readouts(t) {
    readout.textContent = "";
    var total = totalVariance();
    readout.appendChild(tile(
      "Variance accounted for, in total",
      (total / MARKERS.length * 100).toFixed(1) + "%",
      "identical at every angle, which is what it means to say the fit does not change"
    ));
    readout.appendChild(tile(
      "Carried by factor 1", factorVariance(t, 0).toFixed(2),
      "this one does move: rotation shifts variance between the two factors"
    ));
    readout.appendChild(tile(
      "Carried by factor 2", factorVariance(t, 1).toFixed(2),
      "and the two always add to " + total.toFixed(2)
    ));

    labelLine.textContent =
      "If you had to name these factors now: factor 1 " + phrase(reading(t, 0)) +
      ", and factor 2 " + phrase(reading(t, 1)) + ". Those are the " +
      "highest-loading markers at this angle and nothing more.";
  }

  /** One factor put into words, as a researcher naming it would have to. */
  function phrase(r) {
    if (r.bipolar) {
      return "sets " + r.high.name + " at " + r.high.value.toFixed(2) +
        " against " + r.low.name + " at " + r.low.value.toFixed(2) +
        ", so it would have to be named for a contrast";
    }
    return "is anchored by " + r.high.name + " at " + r.high.value.toFixed(2) +
      ", with nothing much at the other end";
  }

  function table(t) {
    body.textContent = "";
    MARKERS.forEach(function (m, i) {
      var l = loadings(m, t);
      var tr = global.document.createElement("tr");
      [String(i + 1), m.name, l[0].toFixed(2), l[1].toFixed(2),
       communality(m).toFixed(2), salienceOf(t, m)].forEach(function (text, col) {
        var cell = global.document.createElement(col === 0 ? "th" : "td");
        if (col === 0) { cell.setAttribute("scope", "row"); }
        cell.textContent = text;
        tr.appendChild(cell);
      });
      body.appendChild(tr);
    });
  }

  /* ------------------------------------------------------------- guidance */

  function simplest() {
    angleInput.value = String(SIMPLEST);
    movesMade = REVEAL_AFTER;
    onSlide();
    var crossings = MARKERS.filter(function (m) {
      return salienceOf(SIMPLEST, m) === "both, a cross-loading";
    }).map(function (m) { return m.name; });
    var quiet = MARKERS.filter(function (m) {
      return salienceOf(SIMPLEST, m) === "neither factor";
    }).map(function (m) { return m.name; });
    noteText.textContent =
      "At " + SIMPLEST + " degrees the varimax criterion is at its highest, " +
      "which is what most software means by a rotated solution. Ten of the " +
      "twelve markers now sit clearly on one factor. " +
      (crossings.length ? "One does not: " + crossings.join(" and ") +
        " loads on both, and no rotation will fix that, because the point " +
        "genuinely lies between the two clusters. " : "") +
      (quiet.length ? "And " + quiet.join(" and ") + " loads on neither, " +
        "because it sits close to the centre: the two factors between them " +
        "account for very little of it. " : "") +
      "Compare the readouts with 0 degrees. The variance on each factor has " +
      "moved. The total has not, and neither has any communality.";
    wb.show(note);
    wb.announce("Rotated to " + SIMPLEST + " degrees, the simplest structure available.");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="angle"]');
    if (output) { output.textContent = angleInput.value + "°"; }
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var t = theta();
    resultLead.textContent =
      "At " + t + " degrees the twelve loadings read quite differently from " +
      "the way they read at 0, and the two factors carry " +
      factorVariance(t, 0).toFixed(2) + " and " + factorVariance(t, 1).toFixed(2) +
      " units of variance against " + factorVariance(0, 0).toFixed(2) + " and " +
      factorVariance(0, 1).toFixed(2) + " before. The total is " +
      totalVariance().toFixed(2) + ", exactly as it was.";
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
    cardPlay = wb.root.querySelector("#card-play");
    angleInput = wb.root.querySelector("#angle");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    readout = wb.root.querySelector("#readout");
    labelLine = wb.root.querySelector("#labels");
    body = wb.root.querySelector("#loadings-body");
    simpleBtn = wb.root.querySelector("#simple");
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
    angleInput.addEventListener("input", onSlide);
    angleInput.addEventListener("change", onSlide);
    simpleBtn.addEventListener("click", simplest);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      movesMade = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardPlay);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      angleInput.value = "0";
      var output = wb.root.querySelector('output[for="angle"]');
      if (output) { output.textContent = "0°"; }
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
