/**
 * The Frame You Take With You  (Simplified Edition)
 *
 * Teaching job: a frame worked out with other people persists once they are
 * gone, and that is a different thing from agreeing with a demand.
 *
 * The mechanism from the full Sherif Norm Formation Laboratory is preserved
 * whole, because it is a performed task and there is no way to preserve it
 * except by performing it: three trials alone, three with other people, two
 * alone again.
 *
 * THE DISPLAY IS A BROWSER ANALOGUE, NOT THE AUTOKINETIC EFFECT. Sherif used
 * a stationary pinpoint of light in a fully darkened room, which appears to
 * drift because the eye cannot hold still and has nothing to anchor against.
 * That illusion needs darkness, a controlled viewing distance and a dark-
 * adapted observer, and it will not appear reliably on a lit screen at an
 * unknown distance. Relying on it would leave a learner judging movement they
 * never experienced. So the point of light here genuinely moves: a small,
 * slow, band-limited drift, different on every trial and never disclosed.
 * What is reproduced is the STRUCTURE of the task, an unquantifiable judgement
 * made alone, then with others, then alone again, and the page says so.
 *
 * WHY THE DRIFT IS SHAPED THE WAY IT IS. Three sine components per axis, with
 * seeded phases and frequencies in roughly 0.5 to 3 rad/s. One component would
 * read as a regular oscillation a learner could count; noise per frame would
 * read as jitter rather than movement. The sum wanders. The point of light is
 * about 10 pixels across and wanders 4 to 8 of its own widths over five
 * seconds, which is plainly perceptible and still impossible to quantify: the
 * field carries no ruler, grid, axis or reference object of any kind, and the
 * trial ends with the field empty, so there is nothing left to measure against
 * afterwards either.
 *
 * THE RESPONSE IS BOUNDED BY CONSTRUCTION. A range input with min 1, max 10,
 * step 1, and readEstimate() rounds and clamps whatever it is handed, so no
 * value outside the stated scale can reach the model however the input is
 * driven. The task is presented as a 1 to 10 judgement, so it must be one.
 *
 * THE OTHERS ARE GENERATED FROM THE LEARNER'S OWN OPENING JUDGEMENTS. Their
 * centre sits GAP points from the learner's opening mean, on whichever side
 * keeps it inside the scale, and the three of them spread around it. Then on
 * each group trial each of them moves WEIGHT of the way towards the previous
 * trial's four-person mean, with a little noise. The learner's own answers
 * feed that mean, so influence runs both ways. NOTHING ABOUT THE LEARNER IS
 * MODELLED: whatever they choose is what the mean uses.
 *
 * The gap is deliberate. Seeding the others directly on the learner's own mean
 * puts the group's figure where the learner already was, which leaves nothing
 * to converge towards and no way to read the result. The rule is printed on
 * the page, gap included, so it can be argued with.
 *
 * WHAT WAS CUT. Longer phases, the round-by-round comparison against three
 * full simulated groups, and the explicit compliance contrast as a separate
 * exercise. The three other groups survive as a single static reveal of where
 * each settled, because the between-group point, that the value is arbitrary,
 * needs only their endpoints.
 *
 * ACCESSIBILITY. The moving point is described in the figure's <desc> and the
 * caption reports every state change in text. A learner who cannot see the
 * field cannot perform the perceptual part, and the page does not pretend
 * otherwise; the judgement is genuinely unconstrained for everyone, so the
 * social mechanism still runs. Reduced-motion preference softens the drift
 * rather than removing it, because a still point would recreate exactly the
 * defect this design exists to fix.
 *
 * WHAT THIS IS NOT. Not a study and not a measurement of the reader. The
 * historical work it borrows its logic from involved deception and conditions
 * that would not be approved today, which the page says.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ------------------------------------------------------------ the shape */

  var SOLO_FIRST = 3;
  var GROUP_TRIALS = 3;
  var SOLO_LAST = 2;
  var TOTAL = SOLO_FIRST + GROUP_TRIALS + SOLO_LAST;   /* 8 */

  var SCALE_MIN = 1;
  var SCALE_MAX = 10;

  /* ---------------------------------------------------------- the display */

  /* The viewBox is deliberately wider than any container the field will get.
     preserveAspectRatio="slice" scales to cover, so scale is
     max(boxWidth / 1200, boxHeight / 240); keeping 1200 above the widest
     rendered box leaves the height in charge, which holds the rendered size of
     the point and of its displacement inside a narrow band across every
     viewport. A 600-unit viewBox let the width take over on a wide screen and
     zoomed the field to about 1.5 times, turning a point of light into a blob
     and making the same drift look half again as far as it did on a phone. */
  var FIELD_W = 1200;
  var FIELD_H = 240;
  var CENTRE_X = FIELD_W / 2;
  var CENTRE_Y = FIELD_H / 2;
  var DOT_R = 5;
  var TRIAL_MS = 5000;

  /* Peak displacement from centre, in viewBox units. The field renders at
     roughly 0.83 to 1.0 pixels per unit, so these are close to pixel values on
     screen, against a point of light 10 pixels across.

     The floor matters more than the ceiling. An excursion of about two dot
     widths is real movement and measures as such, but it is still close enough
     to nothing that a learner can come away saying the dot never moved, which
     is the exact failure this display exists to avoid. So the quietest trial
     wanders about four dot widths and the liveliest about eight. The nearest
     field edge is more than 380 units away even on the narrowest viewport, so
     nothing in this range brings the crop into play as a scale. */
  var AMP_MIN = 38;
  var AMP_MAX = 78;
  var CALM_AMP = 0.5;     /* multiplier under prefers-reduced-motion */
  var CALM_RATE = 0.65;   /* and its slowdown */

  var BAR_Y = FIELD_H - 7;
  var BAR_H = 3;

  /* ------------------------------------------------------------ the model */

  var GAP = 2.6;                    /* group centre, in scale points, from the
                                       learner's opening mean */
  var SPREAD = [-1.3, 0, 1.4];      /* the three others around that centre */
  var WEIGHT = 0.45;                /* convergence per group trial */
  var NOISE = 0.55;                 /* scale points, before rounding */
  var SEED = 20260714;

  /* The gap earns its keep as an invariant, not just as a nicety. Sweeping the
     shipped model over every non-decreasing opening triple and four group
     strategies, 880 runs, the learner's opening average and the figure the
     other three finish on are never closer than 1.0 scale points. So there is
     always something to converge towards and the ending always has something
     to report. The test suite asserts this, because a change to GAP, SPREAD or
     WEIGHT could quietly close it and leave the ending comparing two figures
     that were never apart. */

  var OTHER_NAMES = ["Participant B", "Participant C", "Participant D"];
  var OTHER_SHORT = ["B", "C", "D"];

  /* ------------------------------------------------------------ utilities */

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function mean(list) {
    if (!list.length) { return 0; }
    return list.reduce(function (a, b) { return a + b; }, 0) / list.length;
  }

  function clampScale(value) {
    if (value < SCALE_MIN) { return SCALE_MIN; }
    if (value > SCALE_MAX) { return SCALE_MAX; }
    return value;
  }

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function now() {
    if (global.performance && typeof global.performance.now === "function") {
      return global.performance.now();
    }
    return Date.now();
  }

  function frameRequest(fn) {
    if (typeof global.requestAnimationFrame === "function") {
      return global.requestAnimationFrame(fn);
    }
    return global.setTimeout(fn, 16);
  }

  /* ------------------------------------------------------------ the drift

     Three sine components per axis. The value at t = 0 is subtracted, so every
     trial starts at the exact centre of the field and the displacement a
     learner sees is displacement from a common starting point. */

  var TAU = Math.PI * 2;
  var MIX = [0.62, 0.28, 0.10];

  function makeAxis(rand, rate, scale) {
    return {
      scale: scale,
      w: [
        (0.55 + rand() * 0.30) * rate,
        (1.40 + rand() * 0.50) * rate,
        (2.80 + rand() * 0.60) * rate
      ],
      p: [rand() * TAU, rand() * TAU, rand() * TAU]
    };
  }

  function axisAt(axis, amp, t) {
    var sum = 0;
    for (var i = 0; i < MIX.length; i += 1) {
      sum += MIX[i] * Math.sin(axis.w[i] * t + axis.p[i]);
    }
    return amp * axis.scale * sum;
  }

  function makeDrift(rand, reduced) {
    var amp = AMP_MIN + rand() * (AMP_MAX - AMP_MIN);
    var rate = reduced ? CALM_RATE : 1;
    if (reduced) { amp *= CALM_AMP; }
    var drift = { amp: amp, x: makeAxis(rand, rate, 1), y: makeAxis(rand, rate, 0.66) };
    drift.x0 = axisAt(drift.x, amp, 0);
    drift.y0 = axisAt(drift.y, amp, 0);
    return drift;
  }

  function driftPoint(drift, t) {
    return {
      x: CENTRE_X + axisAt(drift.x, drift.amp, t) - drift.x0,
      y: CENTRE_Y + axisAt(drift.y, drift.amp, t) - drift.y0
    };
  }

  /* --------------------------------------------------------------- state */

  var mine = [];
  var others = [[], [], []];
  var socialRandom = null;
  var driftRandom = null;
  var trialActive = false;
  var awaitingAnswer = false;
  var answered = false;

  function phaseOf(index) {
    if (index < SOLO_FIRST) { return "alone"; }
    if (index < SOLO_FIRST + GROUP_TRIALS) { return "group"; }
    return "again";
  }

  function openingMean() { return mean(mine.slice(0, SOLO_FIRST)); }

  function valuesAt(index) {
    var out = [mine[index]];
    others.forEach(function (series) {
      if (typeof series[index] === "number") { out.push(series[index]); }
    });
    return out;
  }

  /* The others' own figure on the last trial they were present for. It
     excludes the learner deliberately: "did you move towards them" is not a
     question you can ask against a number your own answers are inside. */
  function groupFigure() {
    var last = SOLO_FIRST + GROUP_TRIALS - 1;
    return mean(others.map(function (series) { return series[last]; }));
  }

  /* Called once the learner's opening judgements are in. */
  function seedOthers() {
    var m = openingMean();
    var centre = m <= (SCALE_MIN + SCALE_MAX) / 2 ? m + GAP : m - GAP;
    SPREAD.forEach(function (offset, i) {
      others[i][SOLO_FIRST] = clampScale(Math.round(centre + offset));
    });
  }

  /* Called to prepare the others for a group trial after the first one. */
  function advanceOthers(index) {
    var pull = mean(valuesAt(index - 1));
    others.forEach(function (series) {
      var before = series[index - 1];
      var jitter = (socialRandom() - 0.5) * 2 * NOISE;
      series[index] = clampScale(
        Math.round((1 - WEIGHT) * before + WEIGHT * pull + jitter)
      );
    });
  }

  /* Three other groups, run through the same rule from different openings,
     each with a simulated fourth member who converges partway. Endpoints only:
     the between-group point needs nothing else. */
  var OTHER_GROUPS = (function () {
    var out = [];
    [2, 5, 8].forEach(function (opening, g) {
      var r = mulberry32(SEED + 101 * (g + 1));
      var centre = opening <= (SCALE_MIN + SCALE_MAX) / 2 ? opening + GAP : opening - GAP;
      var line = SPREAD.map(function (o) { return clampScale(Math.round(centre + o)); });
      var member = opening;
      for (var t = 1; t < GROUP_TRIALS; t += 1) {
        var m = mean(line.concat([member]));
        line = line.map(function (v) {
          return clampScale(Math.round((1 - WEIGHT) * v + WEIGHT * m + (r() - 0.5) * 2 * NOISE));
        });
        member = clampScale(Math.round((1 - 0.35) * member + 0.35 * m));
      }
      out.push({ label: "Group " + (g + 1), opening: opening, settled: mean(line) });
    });
    return out;
  }());

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardTask;
  var stimulus, caption, phaseLine, startBtn;
  var answerBlock, answerActions, estimateInput, estimateValue, submitBtn;
  var othersBox, othersText;
  var recordHead, recordBody, recordCaption;
  var cardResult, findingText, chart, chartDesc, groupsBody, ruleLine, explainBtn;
  var synthesis, resultLead;

  var dot = null;
  var glow = null;
  var bar = null;

  /* ------------------------------------------------------------ prediction */

  var VERDICTS = {
    kept: { state: "correct", text:
      "That is what was found, and the interesting part is why it is not the " +
      "same as going along with people. There was nobody left to be awkward " +
      "in front of. What came back with them was not an agreement but a way " +
      "of reading a display that had nothing else to read it against." },
    reverted: { state: "incorrect", text:
      "This is what happens when people have gone along with something they " +
      "could see was wrong: the moment the audience leaves, so does the " +
      "answer. On an ambiguous task it is not what happens, and the " +
      "difference between the two cases is the whole point of this one." },
    midway: { state: "partial", text:
      "Closer than it sounds, and it describes the shape rather than the " +
      "mechanism. What returns is not half of each, as though two answers had " +
      "been averaged. It is the frame the group arrived at, which by then is " +
      "the only way the display is being read." },
    random: { state: "incorrect", text:
      "Ambiguity is exactly what makes the group's figure stick. With nothing " +
      "to judge against, the other people become the thing you judge against, " +
      "and once a figure exists it is what the display means." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "kept") {
      wb.choices.mark(options.querySelector('[data-choice="kept"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.setAttribute("aria-disabled", "false");
    wb.announce("Answer recorded. You can start the task.");
  }

  function reveal() {
    /* The shell already swallows a click on an aria-disabled control, so this
       branch is a second line of defence rather than the one a learner meets:
       it only matters if the attribute is ever wrong. */
    if (!answered) {
      wb.announce("Choose a prediction first.");
      return;
    }
    wb.show(cardTask);
    driftRandom = mulberry32(SEED + 7);
    socialRandom = mulberry32(SEED);
    drawField(false);
    render();
    wb.scrollTo(cardTask);
    wb.focus(startBtn);
  }

  /* -------------------------------------------------------------- the field

     drawField(running) rebuilds the field from scratch. There is nothing in it
     but the dark ground and, while a trial runs, the point of light and a
     progress bar: no ruler, grid, axis, tick, border mark or reference object,
     because any of those would turn a judgement into a measurement. */

  function drawField(running) {
    wb.clearFigure(stimulus);
    dot = null;
    glow = null;
    bar = null;

    stimulus.appendChild(svg("rect", {
      x: 0, y: 0, width: FIELD_W, height: FIELD_H, fill: "#080D18"
    }));
    /* A very faint radial wash, so the ground does not read as a flat panel
       and the eye has no crisp edge near the centre to gauge against. */
    stimulus.appendChild(svg("rect", {
      x: 0, y: 0, width: FIELD_W, height: FIELD_H, fill: "#101B33", opacity: 0.55
    }));

    if (!running) { return; }

    stimulus.appendChild(svg("rect", {
      x: 0, y: BAR_Y, width: FIELD_W, height: BAR_H, fill: "#FFFFFF", opacity: 0.14
    }));
    bar = svg("rect", { x: 0, y: BAR_Y, width: 0, height: BAR_H, fill: "#4FB3D9" });
    stimulus.appendChild(bar);

    /* The halo has to fall off smoothly. A flat-opacity circle behind the dot
       draws a disc with a hard edge, and a hard edge is a reference object: the
       eye measures the dot against its own halo and the field stops being
       low-reference. A radial gradient gives the point of light a glow with no
       boundary to hold on to. */
    var defs = svg("defs", {});
    var grad = svg("radialGradient", { id: "stimulus-glow" });
    grad.appendChild(svg("stop", {
      offset: "0%", "stop-color": "#CDEBF9", "stop-opacity": 0.42
    }));
    grad.appendChild(svg("stop", {
      offset: "55%", "stop-color": "#7FC4E4", "stop-opacity": 0.11
    }));
    grad.appendChild(svg("stop", {
      offset: "100%", "stop-color": "#7FC4E4", "stop-opacity": 0
    }));
    defs.appendChild(grad);
    stimulus.appendChild(defs);

    glow = svg("circle", {
      cx: CENTRE_X, cy: CENTRE_Y, r: DOT_R * 4.4, fill: "url(#stimulus-glow)"
    });
    stimulus.appendChild(glow);
    dot = svg("circle", { cx: CENTRE_X, cy: CENTRE_Y, r: DOT_R, fill: "#FFFFFF" });
    stimulus.appendChild(dot);
  }

  function trialNumber() { return mine.length + 1; }

  function setCaption(text) { caption.textContent = text; }

  function startTrial() {
    if (trialActive || awaitingAnswer || mine.length >= TOTAL) { return; }

    trialActive = true;
    hideOthers();
    wb.hide(answerBlock);
    wb.hide(answerActions);
    setButton(startBtn, false, "Trial " + trialNumber() + " running");
    drawField(true);

    var drift = makeDrift(driftRandom, wb.prefersReducedMotion());
    var began = now();
    var label = trialNumber();

    setCaption("Trial " + label + " of " + TOTAL + " is running. Watch the " +
      "point of light. The field will empty when the trial ends.");
    wb.announce("Trial " + label + " of " + TOTAL + " running.");

    function frame() {
      if (!trialActive) { return; }
      var elapsed = now() - began;
      if (elapsed >= TRIAL_MS) { endTrial(label); return; }
      var point = driftPoint(drift, elapsed / 1000);
      dot.setAttribute("cx", point.x.toFixed(2));
      dot.setAttribute("cy", point.y.toFixed(2));
      glow.setAttribute("cx", point.x.toFixed(2));
      glow.setAttribute("cy", point.y.toFixed(2));
      bar.setAttribute("width", (FIELD_W * (elapsed / TRIAL_MS)).toFixed(1));
      frameRequest(frame);
    }
    frameRequest(frame);
  }

  function endTrial(label) {
    trialActive = false;
    awaitingAnswer = true;
    drawField(false);
    setCaption("Trial " + label + " of " + TOTAL + " has finished and the " +
      "field is empty. How far did the point of light appear to move?");

    var index = mine.length;
    if (phaseOf(index) === "group") { showOthers(index); }

    wb.show(answerBlock);
    wb.show(answerActions);
    setButton(startBtn, false, "Trial " + label + " finished");
    wb.announce("Trial " + label + " finished. Give your judgement from 1 to 10.");
    wb.focus(estimateInput);
  }

  /* ------------------------------------------------------------ the others */

  /* Hiding the panel is not the same as removing what it said. `hidden` keeps
     the sentence in the document, and the requirement for the final trials is
     that the group's figures are gone, not that they are covered up. */
  function hideOthers() {
    wb.hide(othersBox);
    othersText.textContent = "";
  }

  function showOthers(index) {
    if (index === SOLO_FIRST) { seedOthers(); } else { advanceOthers(index); }
    var said = others.map(function (series, i) {
      return OTHER_NAMES[i] + " said " + series[index];
    }).join(". ");
    var lastGroup = index === SOLO_FIRST + GROUP_TRIALS - 1;
    othersText.textContent = said + ". Their average is " +
      mean(others.map(function (series) { return series[index]; })).toFixed(1) +
      "." + (lastGroup
        ? " That was the last trial with anybody else in it. The final " +
          SOLO_LAST + " are on your own, and nobody will see them."
        : "");
    wb.show(othersBox);
  }

  /* -------------------------------------------------------------- response

     Whatever the input is carrying, this returns a whole number inside the
     stated scale or nothing at all, so a value outside 1 to 10 cannot reach
     the model however the control is driven. */

  function readEstimate() {
    var raw = Number(estimateInput.value);
    if (!isFinite(raw)) { return null; }
    return clampScale(Math.round(raw));
  }

  function syncEstimate() {
    var value = readEstimate();
    if (value === null) { return; }
    if (String(value) !== String(estimateInput.value)) {
      estimateInput.value = String(value);
      estimateInput.setAttribute("value", String(value));
    }
  }

  function submit() {
    if (!awaitingAnswer || mine.length >= TOTAL) { return; }
    var value = readEstimate();
    if (value === null) {
      wb.announce("Choose a whole number from 1 to 10.");
      wb.focus(estimateInput);
      return;
    }

    var index = mine.length;
    mine.push(value);
    awaitingAnswer = false;

    wb.hide(answerBlock);
    wb.hide(answerActions);
    hideOthers();
    render();

    if (mine.length >= TOTAL) {
      finish();
      return;
    }

    setCaption("Judgement of " + value + " recorded for trial " + (index + 1) +
      " of " + TOTAL + ". " + phaseSentence(mine.length));
    wb.announce("Judgement of " + value + " recorded for trial " + (index + 1) +
      " of " + TOTAL + ".");
    wb.focus(startBtn);
  }

  /* ---------------------------------------------------------------- render */

  function setButton(button, enabled, text) {
    button.setAttribute("aria-disabled", enabled ? "false" : "true");
    if (text) { button.textContent = text; }
  }

  function phaseSentence(index) {
    var phase = phaseOf(index);
    if (phase === "alone") {
      return "Trials 1 to " + SOLO_FIRST + " are on your own. Nobody else's " +
        "judgement is shown.";
    }
    if (phase === "group") {
      return "Trials " + (SOLO_FIRST + 1) + " to " + (SOLO_FIRST + GROUP_TRIALS) +
        " have three other participants in them. Each of them gives a " +
        "judgement after the trial, before you give yours.";
    }
    return "Trials " + (SOLO_FIRST + GROUP_TRIALS + 1) + " and " + TOTAL +
      " are on your own again. The other three have gone and their " +
      "judgements are no longer shown.";
  }

  function render() {
    var index = mine.length;
    var done = index >= TOTAL;

    phaseLine.textContent = done
      ? "That is all " + TOTAL + " trials."
      : phaseSentence(index);

    if (!done && !trialActive && !awaitingAnswer) {
      setButton(startBtn, true, "Start trial " + (index + 1));
      if (index === 0) {
        setCaption("Trial 1 of " + TOTAL + ". Press start, then watch the " +
          "point of light. It moves by a small amount that changes from trial " +
          "to trial, and you will not be told what that amount was.");
      }
    }
    if (done) { setButton(startBtn, false, "All " + TOTAL + " trials done"); }

    renderRecord(done);
  }

  /* The record is what carries the learner's own judgements across the phases.
     During the final solo trials it drops the others' columns entirely, so
     the group's figure is genuinely off the screen and not merely unmentioned.
     It comes back once the task is over, in the chart on the results card. */
  function renderRecord(done) {
    /* The columns arrive with the others' first judgement, not with the phase:
       entering the group phase happens one moment before anybody has said
       anything, and three empty columns at that point would put the others on
       screen while the solo phase is still what the learner has experienced. */
    var inGroup = phaseOf(mine.length) === "group" &&
      typeof others[0][SOLO_FIRST] === "number";
    var showOthersColumns = inGroup || done;
    recordHead.textContent = "";
    recordBody.textContent = "";

    var headRow = global.document.createElement("tr");
    ["Trial", "Phase", "Your judgement"].forEach(function (text) {
      var th = global.document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = text;
      headRow.appendChild(th);
    });
    if (showOthersColumns) {
      OTHER_SHORT.forEach(function (name) {
        var th = global.document.createElement("th");
        th.setAttribute("scope", "col");
        th.textContent = name;
        headRow.appendChild(th);
      });
    }
    recordHead.appendChild(headRow);

    var PHASE_WORD = { alone: "alone", group: "with others", again: "alone again" };
    mine.forEach(function (value, i) {
      var tr = global.document.createElement("tr");
      var th = global.document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = String(i + 1);
      tr.appendChild(th);
      [PHASE_WORD[phaseOf(i)], String(value)].forEach(function (text) {
        var td = global.document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      });
      if (showOthersColumns) {
        others.forEach(function (series) {
          var td = global.document.createElement("td");
          td.textContent = typeof series[i] === "number" ? String(series[i]) : "not present";
          tr.appendChild(td);
        });
      }
      recordBody.appendChild(tr);
    });

    if (!mine.length) {
      recordCaption.textContent = "Your judgements will be listed here as you make them.";
    } else if (done) {
      recordCaption.textContent = "All " + TOTAL + " of your judgements, and " +
        "what the other three said on the trials they were present for.";
    } else if (inGroup) {
      recordCaption.textContent = "Your judgements, and what the other three " +
        "said on each of these trials.";
    } else if (phaseOf(mine.length) === "again") {
      recordCaption.textContent = "Your judgements. The other three have gone, " +
        "and their figures are no longer shown.";
    } else {
      recordCaption.textContent = "Your judgements so far.";
    }
  }

  /* ---------------------------------------------------------------- figure */

  var LEFT = 96, RIGHT = 700, TOP = 56, BOTTOM = 300;

  function drawChart() {
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 84));

    var xOf = function (i) { return LEFT + (i / (TOTAL - 1)) * (RIGHT - LEFT); };
    var yOf = function (v) {
      return BOTTOM - ((v - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * (BOTTOM - TOP);
    };

    chart.appendChild(svg("rect", {
      x: xOf(SOLO_FIRST - 0.5).toFixed(1), y: TOP,
      width: (xOf(SOLO_FIRST + GROUP_TRIALS - 0.5) - xOf(SOLO_FIRST - 0.5)).toFixed(1),
      height: (BOTTOM - TOP).toFixed(1), fill: "#1A2744", opacity: 0.07
    }));
    var band = svg("text", {
      x: ((xOf(SOLO_FIRST - 0.5) + xOf(SOLO_FIRST + GROUP_TRIALS - 0.5)) / 2).toFixed(1),
      y: TOP - 10, "text-anchor": "middle", class: "plot__tick"
    });
    band.textContent = "with three other people";
    chart.appendChild(band);

    [SCALE_MIN, 5, SCALE_MAX].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
        class: "plot__axis"
      }));
      /* Numbers only. Spelling the anchors out here ("10  a great deal") runs
         the label off the left edge of the viewBox, where it is silently cut
         in half; the anchors are in the legend under the figure instead. */
      var mark = svg("text", {
        x: LEFT - 12, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      mark.textContent = String(v);
      chart.appendChild(mark);
    });

    others.forEach(function (line, i) {
      var points = [];
      line.forEach(function (v, r) {
        if (typeof v === "number") { points.push(xOf(r).toFixed(1) + "," + yOf(v).toFixed(1)); }
      });
      if (points.length > 1) {
        chart.appendChild(svg("polyline", {
          points: points.join(" "), fill: "none", stroke: "#5F6878",
          "stroke-width": 2, "stroke-dasharray": "5 4"
        }));
      }
      /* Labelled at the end of their own line. Parked at the right-hand edge
         with the learner's label they float two trials clear of the line they
         name, which reads as three unexplained words in empty space. Short
         labels, because the ends of three nearly flat lines are close together
         and the legend and the table already carry the full names. */
      var last = SOLO_FIRST + GROUP_TRIALS - 1;
      var mark = svg("text", {
        x: (xOf(last) + 10).toFixed(1), y: (yOf(line[last]) + 4).toFixed(1),
        class: "plot__sub plot__over", fill: "#5F6878"
      });
      mark.textContent = OTHER_SHORT[i];
      chart.appendChild(mark);
    });

    var minePoints = mine.map(function (v, r) {
      return xOf(r).toFixed(1) + "," + yOf(v).toFixed(1);
    });
    chart.appendChild(svg("polyline", {
      points: minePoints.join(" "), fill: "none", stroke: "#1C7293",
      "stroke-width": 4, "stroke-linejoin": "round"
    }));
    mine.forEach(function (v, r) {
      chart.appendChild(svg("circle", {
        cx: xOf(r).toFixed(1), cy: yOf(v).toFixed(1), r: 5, fill: "#1C7293"
      }));
    });
    var you = svg("text", {
      x: (RIGHT + 14).toFixed(1), y: (yOf(mine[TOTAL - 1]) + 4).toFixed(1),
      class: "plot__sub", fill: "#1C7293"
    });
    you.textContent = "You";
    chart.appendChild(you);

    for (var r = 0; r < TOTAL; r += 1) {
      var tick = svg("text", {
        x: xOf(r).toFixed(1), y: BOTTOM + 22, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = String(r + 1);
      chart.appendChild(tick);
    }
    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 46, "text-anchor": "middle",
      class: "plot__tick"
    });
    axis.textContent = "Trial number";
    chart.appendChild(axis);

    var scale = svg("text", {
      x: LEFT - 12, y: TOP - 26, "text-anchor": "end", class: "plot__tick"
    });
    scale.textContent = "judgement";
    chart.appendChild(scale);

    chartDesc.textContent =
      "Your judgements, in order: " + mine.join(", ") + ". The three other " +
      "participants, over the trials they were present for: " +
      others.map(function (line, i) {
        return OTHER_NAMES[i] + " " +
          line.filter(function (v) { return typeof v === "number"; }).join(", ");
      }).join("; ") + ".";
  }

  /* --------------------------------------------------------------- ending */

  function finish() {
    var opening = openingMean();
    var settled = groupFigure();
    var after = mean(mine.slice(SOLO_FIRST + GROUP_TRIALS));
    var openingGap = Math.abs(opening - settled);
    var afterGap = Math.abs(after - settled);
    var toOpening = Math.abs(after - opening);

    var head = "Your opening " + SOLO_FIRST + " trials averaged " +
      opening.toFixed(1) + ". The other three finished on " + settled.toFixed(1) +
      ". Your final " + SOLO_LAST + " trials, made with nothing of theirs on " +
      "the screen, averaged " + after.toFixed(1) + ". ";

    if (afterGap < openingGap) {
      findingText.textContent = head + "That is " + afterGap.toFixed(1) +
        " from the group's figure and " + toOpening.toFixed(1) + " from your " +
        "own opening one, and it started " + openingGap.toFixed(1) + " away " +
        "from the group, so it has moved towards them. That is the pattern the " +
        "original studies found. Notice what it is not. There was nothing left " +
        "to copy: their figures had gone from the screen, nobody was going to " +
        "see your last two answers, and there was no cost to answering exactly " +
        "as you had at the start. What moved was the judgement itself, not a " +
        "decision about what to say.";
    } else {
      findingText.textContent = head + "That is " + afterGap.toFixed(1) +
        " from the group's figure and " + toOpening.toFixed(1) + " from your " +
        "own opening one, so it has not moved towards them. That is not the " +
        "pattern the original studies found, and it is not a failure or a sign " +
        "of anything about you. It is one of the outcomes this task can " +
        "produce, and a single run of " + TOTAL + " trials cannot separate a " +
        "person who held their own frame from a person who was reading the " +
        "display consistently all along. Both are worth thinking about.";
    }

    drawChart();

    groupsBody.textContent = "";
    OTHER_GROUPS.forEach(function (g) {
      var tr = global.document.createElement("tr");
      var th = global.document.createElement("th");
      th.setAttribute("scope", "row");
      th.textContent = g.label;
      tr.appendChild(th);
      [g.opening.toFixed(1), g.settled.toFixed(1)].forEach(function (text) {
        var td = global.document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      });
      groupsBody.appendChild(tr);
    });

    ruleLine.textContent =
      "The rule, printed so it can be argued with. The three others start " +
      "centred " + GAP.toFixed(1) + " points from your own opening average, on " +
      "whichever side keeps them inside the 1 to 10 scale, spread " +
      SPREAD.map(function (s) { return s.toFixed(1); }).join(", ") + " around " +
      "that centre. On each later group trial each of them moves " +
      Math.round(WEIGHT * 100) + " per cent of the way towards the previous " +
      "trial's four-person average, with a little noise, and rounds to a whole " +
      "number. The gap is there so that there is something to converge " +
      "towards: start them on your own average and the group's figure is " +
      "already yours. Nothing about you is modelled, and whatever you chose is " +
      "what the average used.";

    wb.show(cardResult);
    wb.scrollTo(cardResult);
    wb.announce("All " + TOTAL + " trials done. Your final " + SOLO_LAST +
      " averaged " + after.toFixed(1) + ".");
  }

  function explain() {
    resultLead.textContent =
      "You opened at " + openingMean().toFixed(1) + ", the other three finished " +
      "on " + groupFigure().toFixed(1) + ", and once they had gone you averaged " +
      mean(mine.slice(SOLO_FIRST + GROUP_TRIALS)).toFixed(1) + ". The three " +
      "other groups in the table went through the same rule and settled at " +
      OTHER_GROUPS.map(function (g) { return g.settled.toFixed(1); }).join(", ") +
      ", which is the part worth keeping: the figure a group arrives at is not " +
      "the right answer to anything.";
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
    cardTask = wb.root.querySelector("#card-task");
    stimulus = wb.root.querySelector("#stimulus");
    caption = wb.root.querySelector("#stimulus-caption");
    phaseLine = wb.root.querySelector("#phase-line");
    startBtn = wb.root.querySelector("#start-trial");
    answerBlock = wb.root.querySelector("#answer-block");
    answerActions = wb.root.querySelector("#answer-actions");
    estimateInput = wb.root.querySelector("#estimate");
    estimateValue = wb.root.querySelector("#estimate-value");
    submitBtn = wb.root.querySelector("#submit");
    othersBox = wb.root.querySelector("#others");
    othersText = wb.root.querySelector("#others-text");
    recordHead = wb.root.querySelector("#record-head");
    recordBody = wb.root.querySelector("#record-body");
    recordCaption = wb.root.querySelector("#record-caption");
    cardResult = wb.root.querySelector("#card-result");
    findingText = wb.root.querySelector("#finding-text");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    groupsBody = wb.root.querySelector("#groups-body");
    ruleLine = wb.root.querySelector("#rule-line");
    explainBtn = wb.root.querySelector("#explain");
    synthesis = wb.root.querySelector("#synthesis");
    resultLead = wb.root.querySelector("#result-lead");

    Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
      button.addEventListener("click", function () {
        answer(button.getAttribute("data-choice"));
      });
    });
    revealBtn.addEventListener("click", reveal);
    startBtn.addEventListener("click", startTrial);
    submitBtn.addEventListener("click", submit);

    wb.bindRange(estimateInput, {
      format: function (value) {
        var n = clampScale(Math.round(Number(value)));
        return n + " of 10";
      }
    });
    estimateInput.addEventListener("input", syncEstimate);
    estimateInput.addEventListener("change", syncEstimate);

    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      trialActive = false;
      awaitingAnswer = false;
      mine = [];
      others = [[], [], []];
      socialRandom = null;
      driftRandom = null;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.setAttribute("aria-disabled", "true");
      wb.hide(cardTask);
      wb.hide(cardResult);
      hideOthers();
      wb.hide(answerBlock);
      wb.hide(answerActions);
      wb.hide(synthesis);
      estimateInput.value = "5";
      estimateInput.setAttribute("value", "5");
      if (estimateValue) { estimateValue.textContent = "5 of 10"; }
      drawField(false);
      render();
    });

    drawField(false);
    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
