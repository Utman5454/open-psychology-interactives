/* =========================================================================
   Facet-Level Detective
   -------------------------------------------------------------------------
   Two fictional people share a broad domain score almost exactly, and behave
   quite differently. Students work out why before the facet scores are shown,
   then build a pair of profiles themselves, then discover that the domain
   score they have been treating as fixed moves when the questionnaire's item
   mix changes.

   THE EDUCATIONAL MODEL
   ---------------------
   Each domain here has two narrower facets. A person is defined by their two
   facet scores on a 0-100 scale, and the broad domain score is the weighted
   mean of them:

       domain = mix * facetA  +  (1 - mix) * facetB

   with mix = 0.5 for the "balanced" questionnaire the cases assume.

   Each behavioural observation carries weights on the two facets. The
   model-implied tendency to show that behaviour is

       tendency = wA * facetA  +  wB * facetB          (wA + wB = 1)

   Two predictions are therefore available for every behaviour:

     * the FACET prediction, using the person's two facet scores;
     * the DOMAIN prediction, which replaces both facet scores with the single
       domain score. Because the pairs are constructed to share a domain
       score, the domain prediction is necessarily identical for both people —
       so it cannot distinguish behaviour that plainly differs. That identity
       is the demonstration, not a coincidence of the numbers.

   The final stage varies `mix`. Because the two people trade one facet off
   against the other, changing the proportion of items drawn from each facet
   moves their domain scores in opposite directions, and past a crossover
   point their rank order reverses. Nothing about either person has changed;
   only the questionnaire has.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   * Two facets per domain, not six. The domain/facet distinction survives the
     simplification; the arithmetic stays legible in a seminar.
   * Behaviour is modelled as a linear function of facet scores with no error
     term, no situational input and no interaction. Real behaviour is none of
     these things; tool 03 in this module is the one that adds situations.
   * Scores are on an arbitrary 0-100 scale with no norms, no standard error
     and no reference sample. They are illustrative values, not measurements.
   * The facet pairs are named after a real two-aspect account of the Big Five,
     because inventing fake facet names would teach a vocabulary that does not
     exist. The PEOPLE and their SCORES are entirely fictional.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. Cases
     ===================================================================== */

  var BALANCED_MIX = 0.5;

  /* Each case: one domain, two facets, two fictional people whose facet
     scores average to the same domain score, and four observations whose
     facet weights differ. */
  var CASES = [
    {
      id: "extraversion",
      domain: "Extraversion",
      facetA: { key: "assertiveness", name: "Assertiveness" },
      facetB: { key: "enthusiasm", name: "Enthusiasm" },
      people: [
        { id: "A", name: "Rowan", a: 82, b: 54 },
        { id: "B", name: "Devi", a: 55, b: 81 }
      ],
      observations: [
        {
          id: "e1",
          text: "In a meeting where nobody wants to go first, they start the discussion and set the agenda.",
          wA: 0.85
        },
        {
          id: "e2",
          text: "Greets a friend's good news with delight, and talks about it for the rest of the afternoon.",
          wA: 0.12
        },
        {
          id: "e3",
          text: "Pushes back, repeatedly and comfortably, when a supervisor proposes an unfair deadline.",
          wA: 0.88
        },
        {
          id: "e4",
          text: "Is the person a party warms up around — laughing easily, drawing others in.",
          wA: 0.15
        }
      ],
      note:
        "Both are described as sociable, and a broad Extraversion score says so. It does not say which kind."
    },
    {
      id: "conscientiousness",
      domain: "Conscientiousness",
      facetA: { key: "industriousness", name: "Industriousness" },
      facetB: { key: "orderliness", name: "Orderliness" },
      people: [
        { id: "A", name: "Sam", a: 84, b: 48 },
        { id: "B", name: "Priya", a: 50, b: 82 }
      ],
      observations: [
        {
          id: "c1",
          text: "Works through a hard, unrewarding task for six hours without being asked to.",
          wA: 0.87
        },
        {
          id: "c2",
          text: "Keeps a labelled filing system that anyone else could navigate.",
          wA: 0.12
        },
        {
          id: "c3",
          text: "Their desk is chaos, and the work leaves it finished and on time.",
          wA: 0.82
        },
        {
          id: "c4",
          text: "Is visibly unsettled when a plan changes at short notice.",
          wA: 0.15
        }
      ],
      note:
        "A single Conscientiousness score is often read as \"reliable\". Two quite different people can produce it."
    },
    {
      id: "agreeableness",
      domain: "Agreeableness",
      facetA: { key: "compassion", name: "Compassion" },
      facetB: { key: "politeness", name: "Politeness" },
      people: [
        { id: "A", name: "Iris", a: 83, b: 51 },
        { id: "B", name: "Tomas", a: 52, b: 80 }
      ],
      observations: [
        {
          id: "a1",
          text: "Notices a colleague is struggling and asks about it before anyone else has seen anything.",
          wA: 0.86
        },
        {
          id: "a2",
          text: "Will not interrupt, even when the meeting is going badly wrong.",
          wA: 0.12
        },
        {
          id: "a3",
          text: "Confronts a manager directly because a junior member of staff was treated badly.",
          wA: 0.80
        },
        {
          id: "a4",
          text: "Defers to seniority in a disagreement, and says afterwards that it was not their place.",
          wA: 0.10
        }
      ],
      note:
        "Compassion is care for others; politeness is reluctance to impose. They usually correlate, and they are not the same thing."
    },
    {
      id: "openness",
      domain: "Openness to experience",
      facetA: { key: "intellect", name: "Intellect" },
      facetB: { key: "aesthetic", name: "Aesthetic openness" },
      people: [
        { id: "A", name: "Nadia", a: 85, b: 53 },
        { id: "B", name: "Callum", a: 54, b: 84 }
      ],
      observations: [
        {
          id: "o1",
          text: "Reads an argument they disagree with twice, to be sure they have understood it.",
          wA: 0.85
        },
        {
          id: "o2",
          text: "Is moved, visibly, by a piece of music they have heard a hundred times.",
          wA: 0.10
        },
        {
          id: "o3",
          text: "Enjoys an abstract problem for its own sake, with no application in view.",
          wA: 0.86
        },
        {
          id: "o4",
          text: "Rearranges a room repeatedly until the proportions feel right.",
          wA: 0.14
        }
      ],
      note:
        "Openness is the least unified of the five, and the aspect that gets measured varies more between questionnaires than most people assume."
    }
  ];

  /* =======================================================================
     2. Model
     ===================================================================== */

  /** Broad domain score for a person under a given item mix. */
  function domainScore(person, mix) {
    return mix * person.a + (1 - mix) * person.b;
  }

  /** Model-implied tendency to show an observation, from the facet scores. */
  function facetTendency(person, observation) {
    return observation.wA * person.a + (1 - observation.wA) * person.b;
  }

  /**
   * Model-implied tendency computed from the broad score alone — the score
   * replaces both facets, which is exactly what using a domain score does.
   */
  function domainTendency(person, observation, mix) {
    var d = domainScore(person, mix);
    return observation.wA * d + (1 - observation.wA) * d; // === d
  }

  /** Which person the model says is more likely to show this behaviour. */
  function likelierPerson(theCase, observation) {
    var one = facetTendency(theCase.people[0], observation);
    var two = facetTendency(theCase.people[1], observation);
    return one >= two ? theCase.people[0].id : theCase.people[1].id;
  }

  /** The item mix at which the two people's domain scores are equal. */
  function crossoverMix(people) {
    // mix*a1 + (1-mix)*b1 = mix*a2 + (1-mix)*b2
    var one = people[0];
    var two = people[1];
    var denominator = one.a - one.b - (two.a - two.b);
    if (Math.abs(denominator) < 1e-9) {
      return null;
    }
    return (two.b - one.b) / denominator;
  }

  /* =======================================================================
     3. Helpers
     ===================================================================== */

  function fmt(value, places) {
    return value === null || value === undefined || isNaN(value)
      ? "—"
      : value.toFixed(places === undefined ? 0 : places);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function caseById(id) {
    return CASES.filter(function (c) {
      return c.id === id;
    })[0];
  }

  /* Local equivalent of shell.bindRange for the sliders that live outside the
     .interactive root. The shell's version resolves an <output for="..."> by
     searching inside the shell only, so it cannot reach the studio and
     item-mix panels, which are page sections in their own right. Behaviour is
     otherwise identical: keep the <output> in step, set aria-valuetext, and
     re-sync after a reset. */
  var rangeSyncs = [];

  function bindRange(input, options) {
    var settings = options || {};
    var output = document.querySelector('output[for="' + input.id + '"]');

    function sync() {
      var value = Number(input.value);
      if (output) {
        output.textContent = settings.format
          ? settings.format(value)
          : String(value);
      }
      input.setAttribute(
        "aria-valuetext",
        (settings.describe || settings.format || String)(value)
      );
      if (settings.onInput) {
        settings.onInput(value);
      }
    }

    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncAllRanges() {
    rangeSyncs.forEach(function (sync) {
      sync();
    });
  }

  /* =======================================================================
     4. Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#facet-detective");
  if (!shell) {
    return;
  }

  var root = shell.root;
  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var caseSelect = $("[data-case-select]");
  var caseNote = $("[data-case-note]");
  var domainReadout = $("[data-domain-readout]");
  var evidenceList = $("[data-evidence-list]");
  var profileChart = $("[data-profile-chart]");
  var profileTable = $("[data-profile-table]");
  var profileWrap = $("[data-profile-wrap]");
  var advanceButton = $('[data-action="advance"]');
  var exampleButton = $('[data-action="example"]');

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var skipOpening = $('[data-action="skip-opening"]');

  var verdictSection = $("#verdict");
  var verdictBody = $("[data-verdict-body]");
  var predictionTable = $("[data-prediction-table]");

  var studioSection = $("#studio");
  var studioChart = $("[data-studio-chart]");
  var studioTable = $("[data-studio-table]");
  var studioVerdict = $("[data-studio-verdict]");

  var mixSection = $("#mix");
  var mixChart = $("[data-mix-chart]");
  var mixReadout = $("[data-mix-readout]");
  var mixVerdictBox = $("[data-mix-verdict]");
  var mixForm = $("#mix-form");
  var mixError = $("[data-mix-error]");
  var mixFeedback = $("[data-mix-feedback]");

  var INITIAL = {
    stage: "opening",
    caseId: CASES[0].id,
    assignments: {},
    openingAnswer: null,
    revealed: false,
    studio: { a1: 80, b1: 50, a2: 50, b2: 80 },
    mix: BALANCED_MIX,
    mixPredicted: false
  };

  var state = null;

  /* --- Case selector ---------------------------------------------------- */

  CASES.forEach(function (theCase) {
    var option = make("option", null, theCase.domain);
    option.value = theCase.id;
    caseSelect.appendChild(option);
  });

  caseSelect.addEventListener("change", function () {
    state.caseId = caseSelect.value;
    state.assignments = {};
    state.revealed = false;
    verdictSection.hidden = true;
    mixSection.hidden = true;
    renderCase();
    shell.announce(
      "Case changed to " + caseById(state.caseId).domain +
        ". Assignments cleared.",
      { immediate: true }
    );
  });

  /* --- Evidence assignment ---------------------------------------------- */

  function renderCase() {
    var theCase = caseById(state.caseId);
    var people = theCase.people;

    caseNote.textContent = theCase.note;

    // Broad scores, which are equal by construction at the balanced mix.
    clear(domainReadout);
    people.forEach(function (person) {
      var cell = make("div");
      cell.appendChild(make("dt", null, person.name + " — " + theCase.domain));
      cell.appendChild(
        make("dd", null, fmt(domainScore(person, BALANCED_MIX)))
      );
      domainReadout.appendChild(cell);
    });

    renderEvidence(theCase);
    renderProfile(theCase);
    renderActions();
  }

  function renderEvidence(theCase) {
    clear(evidenceList);

    theCase.observations.forEach(function (observation, index) {
      var item = make("li", "evidence");
      var group = make("fieldset", "evidence__group");
      var legend = make("legend", "evidence__text");
      legend.textContent = "Observation " + (index + 1) + ". " + observation.text;
      group.appendChild(legend);

      var choices = make("div", "evidence__choices");
      theCase.people.forEach(function (person) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "evidence-" + observation.id;
        input.value = person.id;
        input.checked = state.assignments[observation.id] === person.id;
        input.disabled = state.revealed;
        input.addEventListener("change", function () {
          state.assignments[observation.id] = person.id;
          renderActions();
          shell.announce(
            "Observation " + (index + 1) + " assigned to " + person.name + ". " +
              countAssigned() + " of " + theCase.observations.length + " assigned."
          );
        });
        label.appendChild(input);
        label.appendChild(make("span", null, person.name));
        choices.appendChild(label);
      });
      group.appendChild(choices);

      // After the reveal each observation carries its own verdict in text.
      if (state.revealed) {
        var correct = likelierPerson(theCase, observation);
        var chosen = state.assignments[observation.id];
        var person = theCase.people.filter(function (p) {
          return p.id === correct;
        })[0];
        var mark = make("p", "evidence__verdict");
        mark.setAttribute("data-tone", chosen === correct ? "good" : "caution");
        mark.textContent =
          (chosen === correct ? "Correct. " : "Not this one. ") +
          "The model makes " + person.name + " more likely to do this, because " +
          "it loads mostly on " +
          (observation.wA >= 0.5 ? theCase.facetA.name : theCase.facetB.name) +
          " (" + Math.round((observation.wA >= 0.5 ? observation.wA : 1 - observation.wA) * 100) +
          "% of the behaviour's weight).";
        group.appendChild(mark);
      }

      item.appendChild(group);
      evidenceList.appendChild(item);
    });
  }

  function countAssigned() {
    return Object.keys(state.assignments).length;
  }

  /* --- Profile chart ----------------------------------------------------
     Hidden until the reveal: showing the facets is the answer. */

  function renderProfile(theCase) {
    profileWrap.hidden = !state.revealed;
    if (!state.revealed) {
      return;
    }

    var facets = [theCase.facetA, theCase.facetB];
    drawGroupedBars(profileChart, facets.map(function (facet, i) {
      return {
        label: facet.name,
        values: theCase.people.map(function (person) {
          return { name: person.name, value: i === 0 ? person.a : person.b };
        })
      };
    }));

    clear(profileTable);
    facets.forEach(function (facet, i) {
      var row = make("tr");
      var th = make("th", null, facet.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      theCase.people.forEach(function (person) {
        row.appendChild(make("td", null, fmt(i === 0 ? person.a : person.b)));
      });
      row.appendChild(
        make("td", null,
          fmt(Math.abs(
            (i === 0 ? theCase.people[0].a : theCase.people[0].b) -
            (i === 0 ? theCase.people[1].a : theCase.people[1].b)
          )))
      );
      profileTable.appendChild(row);
    });

    var domainRow = make("tr", "data-table__total");
    var domainTh = make("th", null, theCase.domain + " (broad score)");
    domainTh.setAttribute("scope", "row");
    domainRow.appendChild(domainTh);
    theCase.people.forEach(function (person) {
      domainRow.appendChild(
        make("td", null, fmt(domainScore(person, BALANCED_MIX)))
      );
    });
    domainRow.appendChild(make("td", null, "0"));
    profileTable.appendChild(domainRow);
  }

  /* --- Grouped bar chart -------------------------------------------------
     Two series. The SVG is hidden from assistive technology and paired with
     a table; each bar also carries its value as text, so the chart does not
     depend on the colour difference between the two people. */

  function drawGroupedBars(svg, groups) {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 62;
    var BAR = 20;
    var LEFT = 150;
    var SCALE = 2.4; // pixels per point, 100 points -> 240px

    clear(svg);
    svg.setAttribute("viewBox", "0 0 460 " + (groups.length * ROW + 16));

    groups.forEach(function (group, gi) {
      var top = 10 + gi * ROW;

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 10));
      label.setAttribute("y", String(top + BAR + 4));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = group.label;
      svg.appendChild(label);

      group.values.forEach(function (entry, vi) {
        var y = top + vi * (BAR + 4);

        var track = document.createElementNS(NS, "rect");
        track.setAttribute("x", String(LEFT));
        track.setAttribute("y", String(y));
        track.setAttribute("width", String(100 * SCALE));
        track.setAttribute("height", String(BAR));
        track.setAttribute("class", "chart__track");
        svg.appendChild(track);

        var bar = document.createElementNS(NS, "rect");
        bar.setAttribute("x", String(LEFT));
        bar.setAttribute("y", String(y));
        bar.setAttribute("width", String(Math.max(0, entry.value) * SCALE));
        bar.setAttribute("height", String(BAR));
        bar.setAttribute("class", "chart__bar chart__bar--" + (vi === 0 ? "one" : "two"));
        svg.appendChild(bar);

        var value = document.createElementNS(NS, "text");
        value.setAttribute("x", String(LEFT + 6));
        value.setAttribute("y", String(y + BAR - 5));
        value.setAttribute("class", "chart__inline");
        value.textContent = entry.name + " " + fmt(entry.value);
        svg.appendChild(value);
      });
    });
  }

  /* --- Reveal ------------------------------------------------------------ */

  function reveal() {
    var theCase = caseById(state.caseId);
    state.revealed = true;

    renderEvidence(theCase);
    renderProfile(theCase);
    buildVerdict(theCase);
    verdictSection.hidden = false;
    mixSection.hidden = false;
    renderMix();
    renderActions();

    $("#verdict-heading").focus();

    var right = theCase.observations.filter(function (observation) {
      return state.assignments[observation.id] === likelierPerson(theCase, observation);
    }).length;
    shell.announce(
      "Facets revealed. " + right + " of " + theCase.observations.length +
        " observations matched the model.",
      { immediate: true }
    );
  }

  function buildVerdict(theCase) {
    clear(verdictBody);

    var right = theCase.observations.filter(function (observation) {
      return state.assignments[observation.id] === likelierPerson(theCase, observation);
    }).length;
    var total = theCase.observations.length;

    var lead =
      right === total
        ? "All " + total + " correct. You separated two people whose broad " +
          theCase.domain + " scores are identical."
        : right === 0
        ? "None matched — which is worth sitting with, because the broad score " +
          "gave you nothing to go on."
        : right + " of " + total + " matched the model.";
    verdictBody.appendChild(make("p", "reveal__lead", lead));

    verdictBody.appendChild(
      make("p", null,
        theCase.people[0].name + " is higher on " + theCase.facetA.name +
        "; " + theCase.people[1].name + " is higher on " + theCase.facetB.name +
        ". Both average out to a " + theCase.domain + " score of " +
        fmt(domainScore(theCase.people[0], BALANCED_MIX)) +
        ", so the broad score is blind to the difference by construction — " +
        "it is the average of the two things that differ.")
    );

    // The two predictions, side by side, per observation.
    clear(predictionTable);
    theCase.observations.forEach(function (observation, index) {
      var row = make("tr");
      var th = make("th", null, "Observation " + (index + 1));
      th.setAttribute("scope", "row");
      row.appendChild(th);
      theCase.people.forEach(function (person) {
        row.appendChild(
          make("td", null, fmt(domainTendency(person, observation, BALANCED_MIX)))
        );
      });
      theCase.people.forEach(function (person) {
        row.appendChild(make("td", null, fmt(facetTendency(person, observation))));
      });
      var winner = theCase.people.filter(function (p) {
        return p.id === likelierPerson(theCase, observation);
      })[0];
      row.appendChild(make("td", null, winner.name));
      predictionTable.appendChild(row);
    });

    verdictBody.appendChild(
      make("p", null,
        "The two domain-score columns are identical: both people have the same " +
        "domain score, and a domain score is one number. The facet columns " +
        "separate them. A prediction from the broad score alone cannot beat " +
        "guessing here, however reliable that score is.")
    );

    verdictBody.appendChild(
      make("p", "verdict__note",
        "All scores are illustrative values on an arbitrary 0–100 scale. They " +
        "are not norms, not standardised, and carry no standard error, because " +
        "no one was measured.")
    );
  }

  /* --- Studio: build your own pair --------------------------------------- */

  var studioInputs = {};

  ["a1", "b1", "a2", "b2"].forEach(function (key) {
    var input = $("#studio-" + key);
    studioInputs[key] = input;
    bindRange(input, {
      format: function (value) {
        return String(value);
      },
      describe: function (value) {
        return value + " out of 100";
      },
      onInput: function (value) {
        state.studio[key] = value;
        renderStudio();
      }
    });
  });

  function renderStudio() {
    var theCase = caseById(state.caseId);
    var one = { name: "Profile 1", a: state.studio.a1, b: state.studio.b1 };
    var two = { name: "Profile 2", a: state.studio.a2, b: state.studio.b2 };

    var d1 = domainScore(one, BALANCED_MIX);
    var d2 = domainScore(two, BALANCED_MIX);
    var gap = Math.abs(d1 - d2);

    // How different are they where it matters?
    var facetGap = (Math.abs(one.a - two.a) + Math.abs(one.b - two.b)) / 2;

    drawGroupedBars(studioChart, [
      {
        label: theCase.facetA.name,
        values: [
          { name: "Profile 1", value: one.a },
          { name: "Profile 2", value: two.a }
        ]
      },
      {
        label: theCase.facetB.name,
        values: [
          { name: "Profile 1", value: one.b },
          { name: "Profile 2", value: two.b }
        ]
      },
      {
        label: "Broad score",
        values: [
          { name: "Profile 1", value: d1 },
          { name: "Profile 2", value: d2 }
        ]
      }
    ]);

    clear(studioTable);
    [
      [theCase.facetA.name, one.a, two.a],
      [theCase.facetB.name, one.b, two.b],
      [theCase.domain + " (broad)", d1, d2]
    ].forEach(function (row) {
      var tr = make("tr");
      var th = make("th", null, row[0]);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, fmt(row[1], 1)));
      tr.appendChild(make("td", null, fmt(row[2], 1)));
      tr.appendChild(make("td", null, fmt(Math.abs(row[1] - row[2]), 1)));
      studioTable.appendChild(tr);
    });

    var tone;
    var text;
    if (gap <= 1 && facetGap >= 20) {
      tone = "good";
      text =
        "That is the effect. The broad scores differ by " + fmt(gap, 1) +
        " point" + (Math.round(gap) === 1 ? "" : "s") +
        " — indistinguishable in practice — while the facets differ by " +
        fmt(facetGap, 1) + " on average. Any report quoting only the broad " +
        "score would describe these two people identically.";
    } else if (gap <= 1) {
      tone = "caution";
      text =
        "The broad scores now match (within " + fmt(gap, 1) + "), but the " +
        "profiles are still close together, so there is little for the broad " +
        "score to conceal. Push one facet up and the other down to open a gap.";
    } else {
      tone = "neutral";
      text =
        "The broad scores differ by " + fmt(gap, 1) + " points. To make the " +
        "point, get them within a point of each other while keeping the facets " +
        "far apart: raise one profile's " + theCase.facetA.name + " and lower " +
        "its " + theCase.facetB.name + " by the same amount.";
    }
    studioVerdict.setAttribute("data-tone", tone);
    studioVerdict.textContent = text;
  }

  /* --- The item-mix stage -------------------------------------------------
     The stage that makes the instability concrete: the "same" broad score
     moves when the questionnaire's item mix changes. */

  var mixRange = $("#mix-range");
  bindRange(mixRange, {
    format: function (value) {
      return value + "%";
    },
    describe: function (value) {
      var theCase = caseById(state.caseId);
      return value + " per cent " + theCase.facetA.name + " items, " +
        (100 - value) + " per cent " + theCase.facetB.name + " items";
    },
    onInput: function (value) {
      state.mix = value / 100;
      renderMix();
    }
  });

  function renderMix() {
    if (mixSection.hidden) {
      return;
    }
    var theCase = caseById(state.caseId);
    var people = theCase.people;
    var mix = state.mix;

    var scores = people.map(function (person) {
      return domainScore(person, mix);
    });

    drawGroupedBars(mixChart, [
      {
        label: "Broad score at this mix",
        values: people.map(function (person, i) {
          return { name: person.name, value: scores[i] };
        })
      }
    ]);

    clear(mixReadout);
    people.forEach(function (person, i) {
      var cell = make("div");
      cell.appendChild(make("dt", null, person.name));
      cell.appendChild(make("dd", null, fmt(scores[i], 1)));
      mixReadout.appendChild(cell);
    });
    var gapCell = make("div");
    gapCell.appendChild(make("dt", null, "Difference"));
    gapCell.appendChild(make("dd", null, fmt(Math.abs(scores[0] - scores[1]), 1)));
    mixReadout.appendChild(gapCell);

    var leader =
      Math.abs(scores[0] - scores[1]) < 0.5
        ? "level"
        : scores[0] > scores[1]
        ? people[0].name
        : people[1].name;

    var crossover = crossoverMix(people);
    var text =
      leader === "level"
        ? "At this mix the two score the same. This is the crossover — the " +
          "only item mix at which the questionnaire cannot tell them apart."
        : leader + " now scores higher on " + theCase.domain + ", by " +
          fmt(Math.abs(scores[0] - scores[1]), 1) + " points. Neither person " +
          "has changed. Only the proportion of items drawn from each facet has.";

    mixVerdictBox.textContent = text;
    mixVerdictBox.setAttribute(
      "data-tone", leader === "level" ? "caution" : "warn");

    if (crossover !== null) {
      mixVerdictBox.textContent +=
        " The rank order flips at about " + fmt(crossover * 100) +
        "% " + theCase.facetA.name + " items.";
    }
  }

  mixForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="mix-prediction"]:checked', mixForm);
    if (!answer) {
      mixError.textContent = "Choose an answer first — the prediction is the point.";
      mixError.hidden = false;
      return;
    }
    mixError.hidden = true;
    state.mixPredicted = true;

    var tone = answer.value === "flips" ? "good" : "caution";
    var verdict = answer.value === "flips" ? "Yes." : "Not quite.";
    var text =
      "Drag the slider and watch. The two people trade one facet against the " +
      "other, so moving the item mix moves their scores in opposite " +
      "directions. A broad score is not a property of a person alone: it " +
      "belongs to the questionnaire that produced it as well.";
    showFeedback(mixFeedback, tone, verdict, text);
    mixRange.disabled = false;
    shell.announce("Prediction recorded. The item-mix slider is now active.", {
      immediate: true
    });
  });

  /* --- Opening prediction ------------------------------------------------ */

  var OPENING = {
    unreliable: {
      tone: "caution",
      verdict: "Not the best account.",
      text:
        "Unreliability would make the scores noisy, but it would not produce " +
        "two people who differ consistently and in a patterned way. Both " +
        "scores here could be perfectly reliable and the problem would remain."
    },
    situations: {
      tone: "caution",
      verdict: "Reasonable, but not what is happening here.",
      text:
        "Situations matter enormously — that is the subject of the " +
        "Person–Situation Interaction Theatre in this module. But these " +
        "observations come from the same range of situations for both people. " +
        "Something about the people differs, and the broad score is hiding it."
    },
    facets: {
      tone: "good",
      verdict: "Yes.",
      text:
        "A broad score is an average of narrower ones. Two people can reach " +
        "the same average from opposite directions, and the average is exactly " +
        "the operation that throws away the difference between them."
    },
    faking: {
      tone: "caution",
      verdict: "Not needed here.",
      text:
        "Impression management is a real problem in self-report — the " +
        "Response-Style Simulator in this module is about it. But you do not " +
        "need anyone to be misreporting for this to happen. Honest, accurate " +
        "scores produce it."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent =
        "Choose an explanation before going on. Committing to an answer first " +
        "is what makes the reveal worth seeing.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    state.openingAnswer = answer.value;
    state.stage = "investigate";

    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    renderActions();
    root.scrollIntoView({ block: "start" });
    shell.announce("Investigation unlocked. Assign each observation to a person.", {
      immediate: true
    });
  });

  skipOpening.addEventListener("click", function () {
    openingError.hidden = true;
    state.openingAnswer = null;
    state.stage = "investigate";
    showFeedback(
      openingFeedback, "neutral", "Prediction skipped — demonstration mode.",
      "With a class, ask the question aloud and take a show of hands before " +
        "unlocking the investigation."
    );
    lockForm(openingForm);
    renderActions();
    shell.announce("Investigation unlocked.", { immediate: true });
  });

  function lockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = true;
      }
    );
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button"),
      function (control) {
        control.disabled = false;
      }
    );
    form.reset();
  }

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) {
      paragraph.appendChild(document.createTextNode(" " + text));
    }
    container.appendChild(paragraph);
    container.hidden = false;
  }

  /* --- Actions ----------------------------------------------------------- */

  function renderActions() {
    var theCase = caseById(state.caseId);
    var investigating = state.stage === "investigate";
    var complete = countAssigned() === theCase.observations.length;

    advanceButton.disabled = !investigating || !complete || state.revealed;
    advanceButton.textContent = state.revealed
      ? "Facets revealed"
      : "Reveal the facet profiles";

    exampleButton.disabled = !investigating || state.revealed;
    caseSelect.disabled = !investigating || state.revealed;

    var hint = $("[data-assign-hint]");
    hint.textContent = state.revealed
      ? "Facets revealed. Change case, or reset, to run another."
      : !investigating
      ? "Answer the question above to unlock the evidence."
      : complete
      ? "All observations assigned. Reveal when ready."
      : countAssigned() + " of " + theCase.observations.length +
        " observations assigned.";
  }

  advanceButton.addEventListener("click", function () {
    if (!state.revealed) {
      reveal();
    }
  });

  exampleButton.addEventListener("click", function () {
    var theCase = caseById(state.caseId);
    // The worked example assigns each observation as the model would.
    theCase.observations.forEach(function (observation) {
      state.assignments[observation.id] = likelierPerson(theCase, observation);
    });
    renderEvidence(theCase);
    renderActions();
    shell.announce(
      "Worked example: every observation assigned to the person the model " +
        "makes more likely. Reveal to see why.",
      { immediate: true }
    );
  });

  /* --- Reset -------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));

    caseSelect.value = state.caseId;
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;

    verdictSection.hidden = true;
    mixSection.hidden = true;
    mixFeedback.hidden = true;
    mixError.hidden = true;
    mixForm.reset();
    mixRange.value = String(Math.round(BALANCED_MIX * 100));
    mixRange.disabled = true;

    ["a1", "b1", "a2", "b2"].forEach(function (key) {
      studioInputs[key].value = String(INITIAL.studio[key]);
    });

    renderCase();
    // Assigning to .value does not fire an input event, so the <output>s and
    // aria-valuetext have to be refreshed explicitly after a reset.
    syncAllRanges();
  });

  /* --- Start-up ----------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the evidence.",
    { immediate: true }
  );
})();
