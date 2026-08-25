/**
 * Same Score, Different People  (Simplified Edition)
 *
 * Teaching job: a broad domain score is an average over narrower facets, so it
 * can be identical for two people who are systematically different, and the
 * fact that it came out identical is partly a property of the questionnaire
 * rather than of the people.
 *
 * The model is the one from the full Facet-Level Detective, cut to a single
 * domain:
 *
 *     domain(person)      = mix * industriousness + (1 - mix) * orderliness
 *     tendency(person, o) = o.weight * industriousness
 *                           + (1 - o.weight) * orderliness
 *
 * Sam and Priya are near mirror images across the two facets, so at mix = 0.5
 * their domain scores are equal by construction. That is the situation being
 * examined, not a coincidence, and the page says so.
 *
 * Two consequences carry the lesson, and both are computed rather than
 * asserted:
 *
 *   - Each observation weights the two facets differently, so the facet-level
 *     prediction separates the two people on all four. The domain-level
 *     prediction replaces both facet scores with the single domain score, so
 *     it necessarily returns the same number for both people on every
 *     observation. That identity is the failure being demonstrated.
 *   - Because the two trade one facet against the other, moving `mix` moves
 *     their domain scores in opposite directions. They cross at 0.5 and swap
 *     places either side of it, without either person changing.
 *
 * Deliberate simplifications, stated in the caution:
 *   - Two facets per domain, not the five or six a real inventory reports. The
 *     domain/facet distinction survives the cut; the arithmetic gets easier.
 *   - The two facets trade off exactly. Real aspects of a domain correlate
 *     positively, so a real pair would rarely be such clean mirror images.
 *   - Behaviour is a linear function of facet scores with no error term, so
 *     the tendencies are what the model implies rather than what anyone did.
 *   - The facet names come from a real two-aspect account of the Big Five
 *     rather than being invented, because inventing facet names would teach a
 *     vocabulary that does not exist.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var FACETS = {
    a: { key: "industriousness", label: "Getting things done", short: "industriousness" },
    b: { key: "orderliness", label: "Keeping things in order", short: "orderliness" }
  };

  var PEOPLE = [
    { key: "sam", name: "Sam", a: 84, b: 48 },
    { key: "priya", name: "Priya", a: 50, b: 82 }
  ];

  /* weight is the share of the behaviour driven by getting things done. */
  var OBSERVATIONS = [
    { weight: 0.87, text: "Works through a hard, unrewarding task for six hours without being asked to." },
    { weight: 0.12, text: "Keeps a labelled filing system that anyone else could navigate." },
    { weight: 0.82, text: "Their desk is chaos, and the work leaves it finished and on time." },
    { weight: 0.15, text: "Is visibly unsettled when a plan changes at short notice." }
  ];

  var DEFAULT_MIX = 50;

  function domain(person, mixPercent) {
    var m = mixPercent / 100;
    return person.a * m + person.b * (1 - m);
  }

  function facetTendency(person, observation) {
    return person.a * observation.weight + person.b * (1 - observation.weight);
  }

  /** The domain-level prediction knows only one number about a person, so it
      returns that number whatever the behaviour is. That is the point. */
  function domainTendency(person, mixPercent) {
    return domain(person, mixPercent);
  }

  function leader(mixPercent) {
    var d = domain(PEOPLE[0], mixPercent) - domain(PEOPLE[1], mixPercent);
    if (Math.abs(d) < 0.5) { return null; }
    return d > 0 ? PEOPLE[0] : PEOPLE[1];
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn;
  var cardFacets, profileBody, obsBody, obsNote, toMixBtn;
  var cardMix, mixInput, chart, chartDesc, readout, sentence;
  var tidyBtn, explainBtn, note, noteText, synthesis, resultLead;

  var REVEAL_AFTER = 2;
  var answered = false;
  var movesMade = 0;

  function mix() { return Number(mixInput.value); }

  var VERDICTS = {
    facets: { state: "correct", text:
      "Yes. Conscientiousness is a domain made of narrower facets, and the " +
      "score people quote is an average across them. Two people who are high " +
      "on different facets can average to the same number. The tables below " +
      "show what that average covered up." },
    unreliable: { state: "partial", text:
      "Reasonable, and it is the right question to ask of any near-tie. It " +
      "is not what is happening here. These two scores are equal by " +
      "construction, not by accident, and a perfectly reliable measure of " +
      "this domain would return the same tie. Unreliability would make two " +
      "different people look equal by chance; here they are equal because of " +
      "what the score is an average of." },
    situations: { state: "partial", text:
      "A good explanation for a different observation. It would fit if the " +
      "two behaved alike in the same setting and differently across " +
      "settings. What is described here is a stable difference that people " +
      "who know them recognise across weeks, so the explanation has to be " +
      "something about the two of them that the score did not capture." },
    dishonest: { state: "incorrect", text:
      "This is the explanation to reach for last, and it is reached for " +
      "first surprisingly often. It requires an extra assumption about " +
      "somebody's honesty to explain something the structure of the measure " +
      "already explains on its own." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "facets") {
      wb.choices.mark(options.querySelector('[data-choice="facets"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  /* --------------------------------------------------------------- tables */

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function buildProfile() {
    profileBody.textContent = "";
    [
      { label: FACETS.a.label, get: function (p) { return p.a; } },
      { label: FACETS.b.label, get: function (p) { return p.b; } },
      { label: "Broad conscientiousness score", get: function (p) { return domain(p, DEFAULT_MIX); } }
    ].forEach(function (row) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", row.label, "row"));
      var one = row.get(PEOPLE[0]);
      var two = row.get(PEOPLE[1]);
      tr.appendChild(cell("td", one.toFixed(0)));
      tr.appendChild(cell("td", two.toFixed(0)));
      var diff = one - two;
      tr.appendChild(cell("td", Math.abs(diff) < 0.5 ? "none" :
        (diff > 0 ? "Sam by " : "Priya by ") + Math.abs(diff).toFixed(0)));
      profileBody.appendChild(tr);
    });
  }

  function buildObservations() {
    obsBody.textContent = "";
    OBSERVATIONS.forEach(function (o) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", o.text, "row"));
      tr.appendChild(cell("td", facetTendency(PEOPLE[0], o).toFixed(0)));
      tr.appendChild(cell("td", facetTendency(PEOPLE[1], o).toFixed(0)));
      tr.appendChild(cell("td", domainTendency(PEOPLE[0], DEFAULT_MIX).toFixed(0)));
      obsBody.appendChild(tr);
    });
    /* Computed from the rounded values the table actually shows, so the
       sentence can never quote a separation the reader cannot find by
       subtracting two numbers in front of them. */
    var gaps = OBSERVATIONS.map(function (o) {
      return Math.abs(Math.round(facetTendency(PEOPLE[0], o)) -
        Math.round(facetTendency(PEOPLE[1], o)));
    });
    var smallest = Math.min.apply(null, gaps);
    obsNote.textContent =
      "Read the last column downwards. It is the same number four times, and " +
      "the same number for both people, because a broad score is the only " +
      "thing it knows about either of them. The facet columns separate the " +
      "two on all four observations, by at least " + smallest.toFixed(0) +
      " points, and they change places twice.";
  }

  function toMix() {
    wb.show(cardMix);
    render();
    wb.scrollTo(cardMix);
    wb.focus(mixInput);
    wb.announce("Use the slider to change what the questionnaire asks about.");
  }

  function reveal() {
    buildProfile();
    buildObservations();
    wb.show(cardFacets);
    wb.scrollTo(cardFacets);
    wb.announce("The facet scores are shown.");
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 96, RIGHT = 700, TOP = 54, BOTTOM = 300;
  var COLOURS = { sam: "#1C7293", priya: "#9E7318" };

  function render() {
    var m = mix();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var xOf = function (pc) { return LEFT + (pc / 100) * (RIGHT - LEFT); };
    var yOf = function (v) { return BOTTOM - (v / 100) * (BOTTOM - TOP); };

    [0, 50, 100].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
        class: "plot__axis", opacity: 0.55
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    var yTitle = svg("text", { x: 8, y: TOP - 26, class: "plot__label" });
    yTitle.textContent = "Broad conscientiousness score";
    chart.appendChild(yTitle);

    /* The crossing point, marked because it is the only mix at which the
       opening claim of this activity is true. */
    var crossX = xOf(50);
    chart.appendChild(svg("line", {
      x1: crossX, y1: TOP, x2: crossX, y2: BOTTOM,
      class: "plot__axis", "stroke-dasharray": "4 4", opacity: 0.8
    }));
    var crossLabel = svg("text", {
      x: crossX, y: TOP - 8, "text-anchor": "middle", class: "plot__tick"
    });
    crossLabel.textContent = "equal here";
    chart.appendChild(crossLabel);

    /* One straight line per person: the domain score is linear in the mix. */
    var ends = [];
    PEOPLE.forEach(function (person) {
      var y0 = yOf(domain(person, 0));
      var y1 = yOf(domain(person, 100));
      chart.appendChild(svg("line", {
        x1: LEFT, y1: y0.toFixed(1), x2: RIGHT, y2: y1.toFixed(1),
        stroke: COLOURS[person.key], "stroke-width": 3, "stroke-linecap": "round"
      }));
      ends.push({ person: person, y: y1 });
    });

    /* Labels at the right-hand ends, nudged apart if the two lines finish
       close together. They do not here, but the figure should not depend on
       the numbers staying as they are. */
    var spread = wb.spreadLabels(ends.map(function (e) { return e.y; }), 20, TOP, BOTTOM);
    ends.forEach(function (e, i) {
      var label = svg("text", {
        x: RIGHT + 12, y: (spread[i] + 4).toFixed(1), class: "plot__sub", fill: COLOURS[e.person.key]
      });
      label.textContent = e.person.name;
      chart.appendChild(label);
    });

    /* The questionnaire actually built. */
    var markX = xOf(m);
    chart.appendChild(svg("line", {
      x1: markX.toFixed(1), y1: TOP, x2: markX.toFixed(1), y2: BOTTOM,
      stroke: "#1A2744", "stroke-width": 2
    }));
    PEOPLE.forEach(function (person) {
      var y = yOf(domain(person, m));
      chart.appendChild(svg("circle", {
        cx: markX.toFixed(1), cy: y.toFixed(1), r: 6, fill: COLOURS[person.key]
      }));
    });

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 34, "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "Share of items about getting things done, from none on the left to all on the right";
    chart.appendChild(axis);

    describe(m);
    readouts(m);
  }

  function describe(m) {
    var top = leader(m);
    chartDesc.textContent =
      "Two straight lines on a grid, one per person, showing the broad score " +
      "each would receive from every possible questionnaire. Sam runs from " +
      domain(PEOPLE[0], 0).toFixed(0) + " when no items are about getting " +
      "things done to " + domain(PEOPLE[0], 100).toFixed(0) + " when all of " +
      "them are. Priya runs the other way, from " +
      domain(PEOPLE[1], 0).toFixed(0) + " down to " +
      domain(PEOPLE[1], 100).toFixed(0) + ". The lines cross at the halfway " +
      "mix, which is the questionnaire that gave them equal scores. At the " +
      "mix currently set, " + m + " per cent, Sam scores " +
      domain(PEOPLE[0], m).toFixed(0) + " and Priya scores " +
      domain(PEOPLE[1], m).toFixed(0) + ", so " +
      (top === null ? "neither is ahead." : top.name + " is ahead by " +
        Math.abs(domain(PEOPLE[0], m) - domain(PEOPLE[1], m)).toFixed(0) + " points.");
  }

  function tile(label, value, noteText) {
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
    return li;
  }

  function readouts(m) {
    readout.textContent = "";
    readout.appendChild(tile("Sam's broad score", domain(PEOPLE[0], m).toFixed(0),
      "facet scores unchanged at 84 and 48"));
    readout.appendChild(tile("Priya's broad score", domain(PEOPLE[1], m).toFixed(0),
      "facet scores unchanged at 50 and 82"));
    var top = leader(m);
    readout.appendChild(tile("Scores higher", top === null ? "neither" : top.name,
      top === null ? "the two scores are equal at this mix" :
        "by " + Math.abs(domain(PEOPLE[0], m) - domain(PEOPLE[1], m)).toFixed(0) + " points"));

    var top0 = leader(0);
    var top100 = leader(100);
    sentence.textContent =
      "A questionnaire with no items about getting things done would report " +
      top0.name + " as the more conscientious of the two. One made entirely " +
      "of them would report " + top100.name + ". Neither person has changed.";
  }

  /* ------------------------------------------------------------- guidance */

  function allTidy() {
    mixInput.value = "0";
    movesMade = REVEAL_AFTER;
    onSlide();
    noteText.textContent =
      "Every item is now about keeping things in order, and this is still a " +
      "published measure of conscientiousness. Priya scores " +
      domain(PEOPLE[1], 0).toFixed(0) + " and Sam scores " +
      domain(PEOPLE[0], 0).toFixed(0) + ", a gap of " +
      Math.abs(domain(PEOPLE[0], 0) - domain(PEOPLE[1], 0)).toFixed(0) +
      " points in Priya's favour. Take the slider to the far right and the " +
      "same gap appears in Sam's favour. Nothing about either person moved. " +
      "The only thing that moved was which questions were asked.";
    wb.show(note);
    wb.announce("All items about keeping things in order. Priya now scores " +
      domain(PEOPLE[1], 0).toFixed(0) + " and Sam " + domain(PEOPLE[0], 0).toFixed(0) + ".");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="mix"]');
    if (output) { output.textContent = mixInput.value + "%"; }
    movesMade += 1;
    if (movesMade >= REVEAL_AFTER) { explainBtn.disabled = false; }
    render();
  }

  function explain() {
    var m = mix();
    var top = leader(m);
    resultLead.textContent =
      "With " + m + " per cent of the items about getting things done, Sam " +
      "scores " + domain(PEOPLE[0], m).toFixed(0) + " and Priya scores " +
      domain(PEOPLE[1], m).toFixed(0) + ", " +
      (top === null ? "which is the tie the activity opened with." :
        "so " + top.name + " is now the more conscientious of the two by " +
        Math.abs(domain(PEOPLE[0], m) - domain(PEOPLE[1], m)).toFixed(0) +
        " points, on exactly the same two people.");
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
    cardFacets = wb.root.querySelector("#card-facets");
    profileBody = wb.root.querySelector("#profile-body");
    obsBody = wb.root.querySelector("#obs-body");
    obsNote = wb.root.querySelector("#obs-note");
    toMixBtn = wb.root.querySelector("#tomix");
    cardMix = wb.root.querySelector("#card-mix");
    mixInput = wb.root.querySelector("#mix");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    readout = wb.root.querySelector("#readout");
    sentence = wb.root.querySelector("#sentence");
    tidyBtn = wb.root.querySelector("#tidy");
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
    toMixBtn.addEventListener("click", toMix);
    mixInput.addEventListener("input", onSlide);
    mixInput.addEventListener("change", onSlide);
    tidyBtn.addEventListener("click", allTidy);
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
      wb.hide(cardFacets);
      wb.hide(cardMix);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      mixInput.value = String(DEFAULT_MIX);
      var output = wb.root.querySelector('output[for="mix"]');
      if (output) { output.textContent = DEFAULT_MIX + "%"; }
      render();
    });

    buildProfile();
    buildObservations();
    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
