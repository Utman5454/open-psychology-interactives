/**
 * Where the Line Goes  (Simplified Edition)
 *
 * Teaching job: when a continuum is cut into a category, the cut is a
 * decision. Two decisions are visible here: where the line falls, which sets
 * how many people are above it, and which rule draws it, which decides who.
 *
 * The model is the one from the full Personality Disorder Continuum, cut from
 * six dimensions to two. Each profile is a pair of numbers on a 0 to 100
 * scale:
 *
 *     extremity     how far the traits sit from a population average
 *     interference  how inflexible and persistent the pattern is, and how
 *                   much it gets in the way of living
 *
 * NEITHER IS COMPUTED FROM THE OTHER, and that is the point of the whole
 * design. A tool that derived interference from extremity would build in the
 * assumption it exists to examine, which is that unusual traits and difficulty
 * are the same thing.
 *
 * The four profiles occupy the four corners of that space, so that switching
 * the rule moves exactly two of them across the line while none of them moves:
 * the profile with unusual traits and little interference, and the profile
 * with ordinary traits and a great deal of it. Those two are the argument.
 *
 * The population figure uses a fictional normal distribution on whichever
 * dimension the current rule uses, and exists to show the second decision: the
 * share above the line changes by more than twentyfold across the range of the
 * control while nobody in that population changes. It is labelled as fictional
 * wherever it appears.
 *
 * DISTRESS IS DELIBERATELY NOT HERE. In the full version it is a dimension of
 * its own and is deliberately excluded from the functioning composite, because
 * it is a reason for help in its own right and can be present without
 * interference or absent with it. Folding it into either of these two axes
 * would have hidden that, so this edition leaves it out and the caution says
 * why.
 *
 * ON LANGUAGE, which is not decoration. The page contains no diagnostic
 * instrument and returns no diagnosis, names no diagnosis, reproduces no
 * criteria, and asks the reader nothing about themselves or anybody else. A
 * profile "falls above the line", which is a statement about the line. Nothing
 * here calls a profile a person, a case or a disorder.
 *
 * Deliberate simplifications, stated in the caution: real assessment is not
 * two numbers and a threshold; a boundary being a decision does not make what
 * falls either side of it unreal or make categories useless; and none of this
 * is a position on any particular classification system.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var PROFILES = [
    /* `short` is what the figure uses. The full name runs past the viewBox
       and was silently cut off at "above: Unusual traits, a"; the table keeps
       the full wording, where there is room for it. */
    { key: "unusual-working", name: "Unusual traits, managing well",
      short: "Unusual, managing", extremity: 82, interference: 28, colour: "#9E7318" },
    { key: "unusual-struggling", name: "Unusual traits, a great deal of difficulty",
      short: "Unusual, struggling", extremity: 84, interference: 79, colour: "#C0434F" },
    { key: "ordinary-struggling", name: "Ordinary traits, a great deal of difficulty",
      short: "Ordinary, struggling", extremity: 48, interference: 76, colour: "#25634F" },
    { key: "ordinary-working", name: "Ordinary traits, managing well",
      short: "Ordinary, managing", extremity: 45, interference: 30, colour: "#1C7293" }
  ];

  var RULES = {
    interference: {
      key: "interference",
      label: "how much it interferes",
      dimension: "interference",
      /* A fictional population, used only to show that the count follows the
         cut. Not an estimate of anything. */
      population: { mean: 45, sd: 16 }
    },
    extremity: {
      key: "extremity",
      label: "counting unusual traits",
      dimension: "extremity",
      population: { mean: 50, sd: 15 }
    }
  };

  var START_CUT = 70;

  function cut() { return Number(cutInput.value); }

  function rule() { return RULES[ruleKey]; }

  function valueOn(profile) { return profile[rule().dimension]; }

  function isAbove(profile) { return valueOn(profile) >= cut(); }

  function aboveCount() {
    return PROFILES.filter(isAbove).length;
  }

  /** Share of a fictional population above the line on the current rule. */
  function populationShare() {
    var p = rule().population;
    return 1 - global.Stats.phi((cut() - p.mean) / p.sd);
  }

  /** The profiles whose side depends on which rule is in force. */
  function swappers() {
    return PROFILES.filter(function (profile) {
      var byInterference = profile.interference >= cut();
      var byExtremity = profile.extremity >= cut();
      return byInterference !== byExtremity;
    });
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardLine;
  var cutInput, ruleBtn, ruleValue, readout, chart, chartDesc;
  var profilesBody, profilesCaption, sentence;
  var swapBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var moves = 0;
  var ruleKey = "interference";

  var VERDICTS = {
    interferes: { state: "correct", text:
      "This is the answer current thinking gives, and the two dimensions " +
      "below are built to show why it is not the same as the alternative. " +
      "Inflexibility, persistence and interference are about difficulty in " +
      "living. How unusual a pattern is, is about a distribution. They come " +
      "apart, and two of the four profiles below come apart with them." },
    unusual: { state: "incorrect", text:
      "Unusualness is a fact about a distribution rather than about anybody's " +
      "life, and a great many unusual patterns cause nobody any difficulty at " +
      "all. Below you will find a profile whose traits sit a long way from the " +
      "average and who is managing perfectly well, and one with unremarkable " +
      "traits and a great deal of difficulty." },
    distress: { state: "partial", text:
      "Distress is a serious matter and a reason for help in its own right, " +
      "which is exactly why it is not one of the two dimensions below. It can " +
      "be present without much interference and, importantly, absent with a " +
      "great deal of it, so folding it into either axis would have hidden " +
      "something rather than shown it. It is a reason to offer help, and it is " +
      "not on its own what makes a pattern a clinical question." },
    line: { state: "partial", text:
      "Half of this is exactly right and it is the half the controls below " +
      "demonstrate: where the line falls is a decision, and it decides how " +
      "many people are above it. The other half goes too far. That a boundary " +
      "is chosen does not make what lies either side of it arbitrary, and " +
      "there is a substantive question about WHICH rule the line should follow, " +
      "which is the one worth arguing about." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "interferes") {
      wb.choices.mark(options.querySelector('[data-choice="interferes"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardLine);
    render();
    wb.scrollTo(cardLine);
    wb.focus(cutInput);
    wb.announce("The continuum is open.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 150, RIGHT = 660, TOP = 62, BOTTOM = 352;

  function render() {
    var c = cut();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var xOf = function (v) { return LEFT + (v / 100) * (RIGHT - LEFT); };
    var yOf = function (v) { return BOTTOM - (v / 100) * (BOTTOM - TOP); };

    /* The counted region, shaded, and the line itself. Under one rule the cut
       is vertical and under the other horizontal, so switching rules visibly
       turns the line through a right angle. */
    if (ruleKey === "extremity") {
      chart.appendChild(svg("rect", {
        x: xOf(c).toFixed(1), y: TOP,
        width: (xOf(100) - xOf(c)).toFixed(1), height: (BOTTOM - TOP).toFixed(1),
        fill: "#1A2744", opacity: 0.08
      }));
      chart.appendChild(svg("line", {
        x1: xOf(c).toFixed(1), y1: TOP, x2: xOf(c).toFixed(1), y2: BOTTOM,
        stroke: "#1A2744", "stroke-width": 3
      }));
    } else {
      chart.appendChild(svg("rect", {
        x: LEFT, y: TOP, width: (RIGHT - LEFT).toFixed(1),
        height: (yOf(c) - TOP).toFixed(1), fill: "#1A2744", opacity: 0.08
      }));
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(c).toFixed(1), x2: RIGHT, y2: yOf(c).toFixed(1),
        stroke: "#1A2744", "stroke-width": 3
      }));
    }

    [0, 50, 100].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
        class: "plot__axis", opacity: 0.4
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = String(v);
      chart.appendChild(tick);
      var xtick = svg("text", {
        x: xOf(v).toFixed(1), y: BOTTOM + 22, "text-anchor": "middle", class: "plot__tick"
      });
      xtick.textContent = String(v);
      chart.appendChild(xtick);
    });

    var yTitle = svg("text", { x: 4, y: TOP - 30, class: "plot__label" });
    yTitle.textContent = "Upwards: how much the pattern interferes";
    chart.appendChild(yTitle);
    var xTitle = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 46,
      "text-anchor": "middle", class: "plot__label"
    });
    xTitle.textContent = "Rightwards: how unusual the traits are";
    chart.appendChild(xTitle);

    /* Markers, with their labels in a column clear of the plot so that a label
       never lands on the cut line or on the axis. */
    var ends = PROFILES.map(function (profile) {
      return { profile: profile, y: yOf(profile.interference), x: xOf(profile.extremity) };
    });
    var spread = wb.spreadLabels(ends.map(function (e) { return e.y; }), 21, TOP, BOTTOM);
    ends.forEach(function (e, i) {
      chart.appendChild(svg("circle", {
        cx: e.x.toFixed(1), cy: e.y.toFixed(1), r: 8,
        fill: isAbove(e.profile) ? e.profile.colour : "none",
        stroke: e.profile.colour, "stroke-width": 3
      }));
      chart.appendChild(svg("line", {
        x1: (RIGHT + 8).toFixed(1), y1: spread[i].toFixed(1),
        x2: (e.x + 10).toFixed(1), y2: e.y.toFixed(1),
        stroke: e.profile.colour, "stroke-width": 1, opacity: 0.55
      }));
      var label = svg("text", {
        x: (RIGHT + 12).toFixed(1), y: (spread[i] + 4).toFixed(1),
        class: "plot__sub", fill: e.profile.colour
      });
      label.textContent = (isAbove(e.profile) ? "above: " : "below: ") + e.profile.short;
      chart.appendChild(label);
    });

    describe(c);
    readouts(c);
    table(c);
  }

  function describe(c) {
    chartDesc.textContent =
      "Four markers on axes running from 0 to 100, placed by how unusual a " +
      "profile's traits are and by how much the pattern interferes. The line " +
      "is at " + c + " and is drawn by " + rule().label + ", so it runs " +
      (ruleKey === "extremity" ? "vertically" : "horizontally") + " and the " +
      "counted region is " + (ruleKey === "extremity" ? "to its right" : "above it") +
      ". " + aboveCount() + " of the four profiles fall above it: " +
      (aboveCount()
        ? PROFILES.filter(isAbove).map(function (p) { return p.name.toLowerCase(); }).join("; ") + "."
        : "none of them.") +
      " The markers do not move when either control changes.";
  }

  function tile(label, value, noteText, state) {
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
    n.textContent = noteText;
    li.appendChild(l); li.appendChild(v); li.appendChild(n);
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  function readouts(c) {
    readout.textContent = "";
    readout.appendChild(tile("Profiles above the line", aboveCount() + " of 4",
      "on the rule currently in force"));
    readout.appendChild(tile("Share of a fictional population above it",
      (populationShare() * 100).toFixed(1) + "%",
      "an invented distribution, not an estimate of anything"));
    var swap = swappers();
    readout.appendChild(tile("Profiles that change sides with the rule",
      String(swap.length),
      swap.length
        ? "at this line, without moving"
        : "at this line, both rules agree about all four"));
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function table(c) {
    profilesBody.textContent = "";
    PROFILES.forEach(function (profile) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", profile.name, "row"));
      tr.appendChild(cell("td", String(profile.extremity)));
      tr.appendChild(cell("td", String(profile.interference)));
      tr.appendChild(cell("td", isAbove(profile) ? "above the line" : "below the line"));
      tr.setAttribute("data-state", isAbove(profile) ? "chosen" : null);
      profilesBody.appendChild(tr);
    });

    profilesCaption.textContent =
      "The first two columns never change. The third is produced by the line " +
      "at " + c + " drawn by " + rule().label + ", and it is the only column " +
      "either control can affect.";

    var swap = swappers();
    sentence.textContent = swap.length
      ? "At a line of " + c + ", " + swap.length +
        (swap.length === 1 ? " profile falls" : " profiles fall") +
        " on different sides depending on which rule is used: " +
        swap.map(function (p) { return p.name.toLowerCase(); }).join(" and ") +
        ". Neither of them has changed in any way."
      : "At a line of " + c + " the two rules happen to agree about all four " +
        "profiles. Move the line and they will not.";
  }

  /* ------------------------------------------------------------- guidance */

  function setRule(next, announce) {
    ruleKey = next;
    ruleBtn.setAttribute("aria-pressed", ruleKey === "extremity" ? "true" : "false");
    ruleBtn.textContent = ruleKey === "extremity"
      ? "Switch back to how much it interferes" : "Switch to counting unusual traits";
    ruleValue.textContent = rule().label;
    render();
    if (announce) {
      wb.announce("Rule changed to " + rule().label + ". " + aboveCount() +
        " of the four profiles are now above the line.");
    }
  }

  function toggleRule() {
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    setRule(ruleKey === "extremity" ? "interference" : "extremity", true);
  }

  function showSwap() {
    cutInput.value = String(START_CUT);
    moves = 2;
    explainBtn.disabled = false;
    setRule("interference", false);
    var before = PROFILES.filter(isAbove).map(function (p) { return p.name.toLowerCase(); });
    setRule("extremity", false);
    var after = PROFILES.filter(isAbove).map(function (p) { return p.name.toLowerCase(); });
    noteText.textContent =
      "With the line at " + START_CUT + " and the rule about interference, " +
      "the profiles counted are " + before.join(" and ") + ". Change nothing " +
      "except the rule, so that the line counts unusual traits instead, and " +
      "the profiles counted are " + after.join(" and ") + ". Two of the four " +
      "have changed sides. One of them has traits a long way from the average " +
      "and is managing perfectly well; the other has unremarkable traits and a " +
      "great deal of difficulty. Which of those two gets counted is not a " +
      "fact about either of them.";
    wb.show(note);
    wb.announce("The rule now counts unusual traits. Two profiles have changed sides.");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="cut"]');
    if (output) { output.textContent = cutInput.value; }
    moves += 1;
    if (moves >= 2) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var here = populationShare();
    var lowest = null, highest = null;
    [55, 90].forEach(function (value) {
      var p = rule().population;
      var share = 1 - global.Stats.phi((value - p.mean) / p.sd);
      if (lowest === null || share < lowest) { lowest = share; }
      if (highest === null || share > highest) { highest = share; }
    });
    resultLead.textContent =
      "At a line of " + cut() + ", drawn by " + rule().label + ", " +
      aboveCount() + " of the four profiles are above it and " +
      (here * 100).toFixed(1) + " per cent of a fictional population would be. " +
      "Across the range of the control that share runs from " +
      (highest * 100).toFixed(1) + " per cent down to " +
      (lowest * 100).toFixed(1) + ", which is a factor of " +
      Math.round(highest / lowest) + ", with nobody in that population changing.";
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
    cardLine = wb.root.querySelector("#card-line");
    cutInput = wb.root.querySelector("#cut");
    ruleBtn = wb.root.querySelector("#rule");
    ruleValue = wb.root.querySelector("#rule-value");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    profilesBody = wb.root.querySelector("#profiles-body");
    profilesCaption = wb.root.querySelector("#profiles-caption");
    sentence = wb.root.querySelector("#sentence");
    swapBtn = wb.root.querySelector("#swap");
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
    cutInput.addEventListener("input", onSlide);
    cutInput.addEventListener("change", onSlide);
    ruleBtn.addEventListener("click", toggleRule);
    swapBtn.addEventListener("click", showSwap);
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      moves = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLine);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      cutInput.value = String(START_CUT);
      var output = wb.root.querySelector('output[for="cut"]');
      if (output) { output.textContent = String(START_CUT); }
      setRule("interference", false);
    });

    setRule("interference", false);
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
