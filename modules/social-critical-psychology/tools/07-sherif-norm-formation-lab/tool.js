/* =========================================================================
   Norm-Formation Laboratory
   -------------------------------------------------------------------------
   Fifteen rounds of an unanchored judgement: five alone, five with three
   simulated others visible, five alone again, then a comparison with three
   other simulated groups.

   THE EDUCATIONAL MODEL
   ---------------------
   The other three participants are generated AFTER the learner's first five
   estimates, from anchors drawn around the learner's own opening mean:

       anchor(i) = ownMean x spread(i),  spread = 0.45, 0.85, 1.75

   which keeps the emerging norm from being imposed from outside. On each group
   round every simulated participant moves a fraction of the way towards the
   running group mean:

       estimate(i, r) = (1 - w) x previous(i) + w x groupMean(r - 1) + noise
       w = 0.42

   Nothing about the learner is modelled or forced: whatever they type is what
   the group mean uses. The chart therefore shows their own convergence or lack
   of it, and the tool says explicitly that both are legitimate outcomes.

   The three comparison groups are four simulated participants each, drawn from
   the same distribution of opening estimates and run through the same rule with
   the same seed sequence. They converge on different values, which is the
   between-group point.

   ACCESSIBILITY OF THE STIMULUS
   -----------------------------
   The display is a drawing with no scale and no reference object, and the text
   beneath it carries everything the picture does: "the marker moved; there is
   no ruler and no reference object". The ambiguity is stipulated rather than
   perceptual, so a learner who cannot see the drawing is not at any
   disadvantage - which is a real difference from the historical work and is
   stated on the page.

   WHAT THIS IS NOT
   ----------------
   Not a replication and not a study. No autokinetic effect is involved, no
   materials from any historical experiment are reproduced, and no number here
   corresponds to anything anybody reported. Nothing measures the learner:
   estimates draw a chart and are discarded when the page is left. No data leave
   the browser - no storage, no network request.
   ========================================================================= */

(function () {
  "use strict";

  var ROUNDS = 15;
  var GROUP_START = 6;
  var GROUP_END = 10;
  var CONVERGENCE = 0.42;
  var SPREADS = [0.45, 0.85, 1.75];
  var OTHER_NAMES = ["Participant B", "Participant C", "Participant D"];

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var rand = mulberry32(20260214);

  function mean(values) {
    if (!values.length) { return 0; }
    return values.reduce(function (t, v) { return t + v; }, 0) / values.length;
  }

  function round1(value) { return Math.round(value * 10) / 10; }

  /* =======================================================================
     Helpers
     ===================================================================== */

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

  var shell = InteractiveShell.attach("#norm-lab");
  if (!shell) { return; }

  var $ = function (s, scope) { return (scope || document).querySelector(s); };
  var $$ = function (s, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(s));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var roundBlock = $("[data-round-block]");
  var roundLegend = $("[data-round-legend]");
  var stimulusSvg = $("[data-stimulus]");
  var stimulusText = $("[data-stimulus-text]");
  var estimateInput = $("#estimate-input");
  var othersBlock = $("[data-others]");
  var othersList = $("[data-others-list]");
  var roundNote = $("[data-round-note]");
  var betweenBlock = $("[data-between-block]");
  var traceSvg = $("[data-trace]");
  var traceText = $("[data-trace-text]");
  var phaseSummary = $("[data-phase-summary]");
  var groupsBlock = $("[data-groups]");
  var groupsBody = $("[data-groups-body]");
  var groupsNote = $("[data-groups-note]");
  var stageTrack = $("[data-stage-track]");

  var INITIAL = {
    unlocked: false,
    round: 1,
    own: [],
    others: null,
    otherTrace: [[], [], []],
    finished: false,
    showedGroups: false
  };
  var state = null;

  /* --- The stimulus ---------------------------------------------------------- */

  function drawStimulus(roundNumber) {
    var NS = "http://www.w3.org/2000/svg";
    clear(stimulusSvg);
    var field = document.createElementNS(NS, "rect");
    field.setAttribute("x", "0"); field.setAttribute("y", "0");
    field.setAttribute("width", "260"); field.setAttribute("height", "120");
    field.setAttribute("class", "stimulus__field");
    stimulusSvg.appendChild(field);

    /* The two positions are drawn from the seeded generator, but nothing about
       them is informative: without a scale the separation on screen carries no
       quantity. */
    var x1 = 70 + rand() * 40;
    var y1 = 40 + rand() * 40;
    var x2 = x1 + (rand() - 0.5) * 90;
    var y2 = y1 + (rand() - 0.5) * 40;

    [[x1, y1, "stimulus__mark stimulus__mark--first"],
     [x2, y2, "stimulus__mark stimulus__mark--second"]].forEach(function (spot) {
      var dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(spot[0]));
      dot.setAttribute("cy", String(spot[1]));
      dot.setAttribute("r", "3.5");
      dot.setAttribute("class", spot[2]);
      stimulusSvg.appendChild(dot);
    });

    stimulusText.textContent =
      "Round " + roundNumber + ". The marker was in one place and then in " +
      "another. There is no ruler, no reference object and no scale, and none " +
      "is available - the drawing carries no more information than this " +
      "sentence does. Any number is as defensible as any other.";
  }

  /* --- The other participants -------------------------------------------------- */

  function createOthers() {
    var ownMean = mean(state.own);
    if (!ownMean) { ownMean = 8; }
    state.others = SPREADS.map(function (spread, index) {
      return {
        name: OTHER_NAMES[index],
        current: Math.max(0.5, round1(ownMean * spread * (0.9 + rand() * 0.2)))
      };
    });
    state.otherTrace = [[], [], []];
  }

  function advanceOthers() {
    var previous = state.others.map(function (other) { return other.current; });
    var running = mean(previous.concat([state.own[state.own.length - 1] || mean(previous)]));
    state.others.forEach(function (other, index) {
      var moved = (1 - CONVERGENCE) * other.current + CONVERGENCE * running;
      other.current = Math.max(0.5, round1(moved + (rand() - 0.5) * Math.max(0.6, running * 0.08)));
      state.otherTrace[index].push(other.current);
    });
  }

  function renderOthers() {
    var inGroup = state.round >= GROUP_START && state.round <= GROUP_END;
    othersBlock.hidden = !inGroup;
    if (!inGroup) { return; }
    clear(othersList);
    state.others.forEach(function (other) {
      var item = make("li", "others__item");
      item.appendChild(make("span", "others__name", other.name));
      item.appendChild(make("span", "others__value", other.current + " cm"));
      othersList.appendChild(item);
    });
  }

  /* --- The chart --------------------------------------------------------------- */

  function renderTrace() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 320, H = 168;
    var left = 34, right = 8, top = 10, bottom = 30;
    clear(traceSvg);

    var all = state.own.slice();
    state.otherTrace.forEach(function (series) { all = all.concat(series); });
    var maxValue = Math.max(1, Math.max.apply(null, all.concat([1])));
    var scaleY = function (v) {
      return H - bottom - (v / (maxValue * 1.1)) * (H - top - bottom);
    };
    var scaleX = function (r) {
      return left + ((r - 1) / (ROUNDS - 1)) * (W - left - right);
    };

    /* Group phase band. */
    var band = document.createElementNS(NS, "rect");
    band.setAttribute("x", String(scaleX(GROUP_START)));
    band.setAttribute("y", String(top));
    band.setAttribute("width", String(scaleX(GROUP_END) - scaleX(GROUP_START)));
    band.setAttribute("height", String(H - top - bottom));
    band.setAttribute("class", "trace__band");
    traceSvg.appendChild(band);

    var baseline = document.createElementNS(NS, "line");
    baseline.setAttribute("x1", String(left)); baseline.setAttribute("x2", String(W - right));
    baseline.setAttribute("y1", String(H - bottom)); baseline.setAttribute("y2", String(H - bottom));
    baseline.setAttribute("class", "chart__baseline");
    traceSvg.appendChild(baseline);

    state.otherTrace.forEach(function (series) {
      if (series.length < 2) { return; }
      var points = series.map(function (value, index) {
        return scaleX(GROUP_START + index) + "," + scaleY(value);
      }).join(" ");
      var line = document.createElementNS(NS, "polyline");
      line.setAttribute("points", points);
      line.setAttribute("class", "chart__line chart__line--two");
      traceSvg.appendChild(line);
    });

    if (state.own.length) {
      var ownPoints = state.own.map(function (value, index) {
        return scaleX(index + 1) + "," + scaleY(value);
      }).join(" ");
      var ownLine = document.createElementNS(NS, "polyline");
      ownLine.setAttribute("points", ownPoints);
      ownLine.setAttribute("class", "chart__line");
      traceSvg.appendChild(ownLine);
      state.own.forEach(function (value, index) {
        var dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", String(scaleX(index + 1)));
        dot.setAttribute("cy", String(scaleY(value)));
        dot.setAttribute("r", "2.5");
        dot.setAttribute("class", "chart__point");
        traceSvg.appendChild(dot);
      });
    }

    var label = document.createElementNS(NS, "text");
    label.setAttribute("x", String(scaleX(GROUP_START) + 2));
    label.setAttribute("y", String(top + 10));
    label.setAttribute("class", "chart__axis");
    label.textContent = "rounds 6-10: others visible";
    traceSvg.appendChild(label);

    var axis = document.createElementNS(NS, "text");
    axis.setAttribute("x", String(W / 2)); axis.setAttribute("y", String(H - 8));
    axis.setAttribute("text-anchor", "middle");
    axis.setAttribute("class", "chart__axis");
    axis.textContent = "round 1 to 15";
    traceSvg.appendChild(axis);

    var yLabel = document.createElementNS(NS, "text");
    yLabel.setAttribute("x", "0"); yLabel.setAttribute("y", String(top + 8));
    yLabel.setAttribute("class", "chart__axis");
    yLabel.textContent = "cm";
    traceSvg.appendChild(yLabel);

    /* Text equivalent. */
    var phase1 = state.own.slice(0, 5);
    var phase2 = state.own.slice(5, 10);
    var phase3 = state.own.slice(10, 15);
    var parts = [];
    if (phase1.length) {
      parts.push("alone, rounds 1-" + phase1.length + ": " +
        phase1.join(", ") + " cm (mean " + round1(mean(phase1)) + ")");
    }
    if (phase2.length) {
      parts.push("with the group, rounds 6-" + (5 + phase2.length) + ": " +
        phase2.join(", ") + " cm (mean " + round1(mean(phase2)) + ")");
    }
    if (phase3.length) {
      parts.push("alone again, rounds 11-" + (10 + phase3.length) + ": " +
        phase3.join(", ") + " cm (mean " + round1(mean(phase3)) + ")");
    }
    traceText.textContent = parts.length
      ? "Your estimates - " + parts.join("; ") + "."
      : "No estimates yet. The chart fills in as you record each round.";
  }

  /* --- Phase summary ------------------------------------------------------------ */

  function renderPhaseSummary() {
    clear(phaseSummary);
    var phase1 = state.own.slice(0, 5);
    var phase2 = state.own.slice(5, 10);
    var phase3 = state.own.slice(10, 15);

    if (phase1.length === 5 && !phase2.length) {
      var box = make("div", "verdict");
      box.setAttribute("data-tone", "neutral");
      box.appendChild(make("h5", "verdict__title", "Alone: your own range"));
      box.appendChild(make("p", "verdict__body",
        "Mean " + round1(mean(phase1)) + " cm, from " + Math.min.apply(null, phase1) +
        " to " + Math.max.apply(null, phase1) + ". Most people settle quite " +
        "quickly into a range of their own, even with nothing to settle on - " +
        "which is itself worth noticing before anybody else appears."));
      phaseSummary.appendChild(box);
      return;
    }

    if (phase2.length === 5 && !phase3.length) {
      var groupMean = mean(state.others.map(function (o) { return o.current; })
        .concat([phase2[phase2.length - 1]]));
      var box2 = make("div", "verdict");
      box2.setAttribute("data-tone", "neutral");
      box2.appendChild(make("h5", "verdict__title", "With the group"));
      box2.appendChild(make("p", "verdict__body",
        "Your mean moved from " + round1(mean(phase1)) + " cm alone to " +
        round1(mean(phase2)) + " cm with the group. The three others ended at " +
        state.others.map(function (o) { return o.current + " cm"; }).join(", ") +
        ", against opening values that were far apart. The group's converging " +
        "is built into the model; yours is not."));
      phaseSummary.appendChild(box2);
      return;
    }

    if (phase3.length === 5) {
      var ownStart = mean(phase1);
      var norm = mean(state.others.map(function (o) { return o.current; }));
      var after = mean(phase3);
      var toStart = Math.abs(after - ownStart);
      var toNorm = Math.abs(after - norm);
      var box3 = make("div", "verdict");
      box3.setAttribute("data-tone", toNorm < toStart ? "warn" : "neutral");
      box3.appendChild(make("h5", "verdict__title", "Alone again - round 11 onwards"));
      box3.appendChild(make("p", "verdict__body",
        "Your opening mean was " + round1(ownStart) + " cm. The group's norm by " +
        "round 10 was " + round1(norm) + " cm. Your mean over the last five " +
        "rounds, with nobody watching, was " + round1(after) + " cm - " +
        (toNorm < toStart
          ? "nearer the group's range than your own. Nobody asked you to agree " +
            "and nobody could see your answer, which is what makes this a change " +
            "in what a plausible answer looks like rather than a decision to go " +
            "along with anybody."
          : "nearer your own opening range than the group's. That is a perfectly " +
            "ordinary outcome and not a sign of anything about you: with a " +
            "judgement this unanchored, individual differences in how much " +
            "weight people give to other estimates are large.")));
      box3.appendChild(make("p", "verdict__note",
        "Nothing here measures you, and your estimates are discarded when you " +
        "leave the page."));
      phaseSummary.appendChild(box3);
    }
  }

  /* --- The other groups ----------------------------------------------------------- */

  function simulateGroup(openingMean) {
    var members = SPREADS.concat([1.15]).map(function (spread) {
      return Math.max(0.5, round1(openingMean * spread * (0.9 + rand() * 0.2)));
    });
    var opening = mean(members);
    for (var r = 0; r < 5; r += 1) {
      var running = mean(members);
      members = members.map(function (value) {
        return Math.max(0.5, round1((1 - CONVERGENCE) * value + CONVERGENCE * running +
          (rand() - 0.5) * Math.max(0.6, running * 0.08)));
      });
    }
    var spreadFinal = Math.max.apply(null, members) - Math.min.apply(null, members);
    return {
      opening: round1(opening),
      norm: round1(mean(members)),
      spread: round1(spreadFinal)
    };
  }

  function showGroups() {
    state.showedGroups = true;
    groupsBlock.hidden = false;
    clear(groupsBody);

    var ownNorm = state.others
      ? mean(state.others.map(function (o) { return o.current; })
          .concat([state.own[9] || mean(state.own)]))
      : mean(state.own);
    var ownOpening = mean(state.own.slice(0, 5));

    var rows = [{
      label: "Your group",
      opening: round1(ownOpening),
      norm: round1(ownNorm),
      spread: state.others
        ? round1(Math.max.apply(null, state.others.map(function (o) { return o.current; })) -
            Math.min.apply(null, state.others.map(function (o) { return o.current; })))
        : 0
    }];
    [ownOpening * 0.35, ownOpening * 1.1, ownOpening * 2.6].forEach(function (opening, index) {
      var simulated = simulateGroup(Math.max(1, opening));
      rows.push({
        label: "Group " + (index + 2),
        opening: simulated.opening,
        norm: simulated.norm,
        spread: simulated.spread
      });
    });

    rows.forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row.label);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, row.opening + " cm"));
      tr.appendChild(make("td", null, row.norm + " cm"));
      tr.appendChild(make("td", null, row.spread + " cm"));
      groupsBody.appendChild(tr);
    });

    var norms = rows.map(function (row) { return row.norm; });
    clear(groupsNote);
    groupsNote.setAttribute("data-tone", "warn");
    groupsNote.appendChild(make("h5", "verdict__title", "Same display, four answers"));
    groupsNote.appendChild(make("p", "verdict__body",
      "The four norms are " + norms.join(", ") + " cm - a range of " +
      round1(Math.max.apply(null, norms) - Math.min.apply(null, norms)) +
      " cm. Nothing about the display differed. What differed is who happened " +
      "to be in the room and what they happened to say first."));
    groupsNote.appendChild(make("p", "verdict__body",
      "Notice the last column. Within each group the members end close " +
      "together, so from inside any one group the norm looks like a fact about " +
      "the display rather than a residue of a particular conversation. That is " +
      "the condition under which shared frames are most convincing and least " +
      "examinable."));
    groupsNote.appendChild(make("p", "verdict__note",
      "All four groups are generated by the same documented rule. This shows " +
      "what the model does; the evidence that people do it is in the " +
      "literature, not on this page."));
    shell.announce("Four group norms shown, ranging over " +
      round1(Math.max.apply(null, norms) - Math.min.apply(null, norms)) + " centimetres.",
      { immediate: true });
  }

  /* --- Round handling --------------------------------------------------------------- */

  function phaseOf(roundNumber) {
    if (roundNumber < GROUP_START) { return "alone1"; }
    if (roundNumber <= GROUP_END) { return "group"; }
    if (roundNumber <= ROUNDS) { return "alone2"; }
    return "between";
  }

  function render() {
    var phase = phaseOf(state.round);
    $$("li", stageTrack).forEach(function (node) {
      node.removeAttribute("aria-current");
      node.removeAttribute("data-state");
      var id = node.getAttribute("data-phase");
      var order = ["alone1", "group", "alone2", "between"];
      if (id === phase) {
        node.setAttribute("aria-current", "step");
      } else if (order.indexOf(id) < order.indexOf(phase)) {
        node.setAttribute("data-state", "done");
      }
    });

    roundBlock.hidden = state.finished;
    betweenBlock.hidden = !state.finished;

    if (!state.finished) {
      roundLegend.textContent = "Round " + state.round + " of " + ROUNDS + " - " +
        (phase === "group" ? "with three others" : "alone");
      renderOthers();
    }

    renderTrace();
    renderPhaseSummary();
  }

  function submitEstimate(value) {
    state.own.push(round1(value));
    if (state.round === 5) { createOthers(); }
    if (state.round >= GROUP_START && state.round <= GROUP_END) { advanceOthers(); }
    state.round += 1;
    if (state.round > ROUNDS) {
      state.finished = true;
      roundNote.textContent = "";
    } else {
      drawStimulus(state.round);
      estimateInput.value = "";
      roundNote.textContent = "";
    }
    render();
    shell.announce(
      state.finished
        ? "All fifteen rounds recorded. The summary is beside you; press \"Show " +
          "the other groups\" for the comparison."
        : "Recorded. Round " + state.round + " of " + ROUNDS +
          (phaseOf(state.round) === "group" ? ", with three others." : ", alone."),
      { immediate: true });
  }

  $('[data-action="submit-estimate"]').addEventListener("click", function () {
    var value = Number(estimateInput.value);
    if (estimateInput.value === "" || !isFinite(value) || value < 0 || value > 200) {
      roundNote.textContent =
        "Enter a number between 0 and 200. Any number is as defensible as any " +
        "other - that is the condition, not a hint.";
      shell.announce(roundNote.textContent, { immediate: true });
      return;
    }
    submitEstimate(value);
  });

  estimateInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $('[data-action="submit-estimate"]').click();
    }
  });

  $('[data-action="simulate"]').addEventListener("click", function () {
    /* A simulated learner for demonstrating from the front, or for anyone who
       would rather not answer. It is not a model of a person; it uses the same
       convergence rule as the others so that the chart shows the effect. */
    while (!state.finished) {
      var value;
      if (state.round <= 5) {
        value = 6 + rand() * 6;
      } else if (state.round <= GROUP_END) {
        var groupMean = mean(state.others.map(function (o) { return o.current; }));
        value = (1 - CONVERGENCE) * state.own[state.own.length - 1] +
          CONVERGENCE * groupMean + (rand() - 0.5) * 1.2;
      } else {
        value = state.own[state.own.length - 1] + (rand() - 0.5) * 1.4;
      }
      submitEstimate(Math.max(0.5, value));
    }
    showGroups();
    shell.announce(
      "Simulated participant run through all fifteen rounds and the four-group " +
      "comparison shown.", { immediate: true });
  });

  $('[data-action="show-groups"]').addEventListener("click", showGroups);

  /* --- Opening prediction --------------------------------------------------------- */

  var OPENING = {
    none: {
      tone: "caution",
      verdict: "Sometimes true of an individual, rarely true of a group.",
      text:
        "Individual differences in how much weight people give to other " +
        "estimates are large, and holding your own is a perfectly ordinary " +
        "outcome. What is much rarer is a group of four staying apart when " +
        "nothing anchors any of them."
    },
    during: {
      tone: "caution",
      verdict: "The first half is right; watch round 11.",
      text:
        "Convergence while the others are visible is unsurprising and would be " +
        "consistent with simply going along. The interesting question is what " +
        "happens when nobody is watching and there is nothing to go along with."
    },
    persist: {
      tone: "good",
      verdict: "That is what happens.",
      text:
        "And the reason it matters is that persistence rules out the simplest " +
        "explanation. Nobody sees round 11. If the group's range comes with " +
        "you, what changed was not your willingness to agree but what counts " +
        "as a plausible answer."
    },
    truth: {
      tone: "caution",
      verdict: "There is no true answer here.",
      text:
        "The display has no scale and no reference object. That absence " +
          "is the condition that makes it work, and the boundary on how " +
          "far the result generalises to judgements that can be checked."
    }
  };

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
    $$("input, button, select", form).forEach(function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    $$("input, button, select", form).forEach(function (c) { c.disabled = false; });
    form.reset();
  }

  function unlockLab() {
    state.unlocked = true;
    labSection.hidden = false;
    drawStimulus(1);
    render();
    shell.announce("Round 1 of 15, alone.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before starting.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    unlockLab();
    $("#lab-heading").focus();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    lockForm(openingForm);
    unlockLab();
  });

  /* --- Reset and start-up ------------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    rand = mulberry32(20260214);
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    groupsBlock.hidden = true;
    othersBlock.hidden = true;
    estimateInput.value = "";
    roundNote.textContent = "";
    drawStimulus(1);
    render();
  });

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to start the fifteen rounds.",
    { immediate: true });
})();
