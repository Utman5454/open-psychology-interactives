/* =========================================================================
   Person–Situation Interaction Theatre
   -------------------------------------------------------------------------
   Four recurring fictional characters are put into five situations. Students
   rank their behaviour before seeing it, twice — once in a weak situation
   where the ranking follows the traits, and once in a situation that releases
   a different trait entirely and reorders them. Then they get the controls:
   situation strength and assigned role.

   THE EDUCATIONAL MODEL
   ---------------------
   Each situation names one observable behaviour and specifies which traits it
   affords expression to. A person's behaviour is

       behaviour = k · norm  +  (1 - k) · disposition  +  role

   where

     k           situation strength, 0 (the situation constrains nothing) to
                 1 (everyone does the same thing regardless of who they are);
     norm        what the situation prescribes — the behaviour a strong
                 situation pulls everybody towards;
     disposition 50 + GAIN · Σ wₜ (traitₜ - 50), the person's own tendency,
                 built only from the traits this situation affords;
     role        an offset from an assigned role, which also RAISES k, because
                 a prescribed role is itself a constraint.

   Three things follow, and they are the three things the tool teaches:

     * In weak situations, between-person spread is large and the rank order
       tracks the traits the situation affords.
     * In strong situations the spread collapses. The people have not changed;
       the situation has stopped letting them differ. Low observed variance is
       not evidence of low trait variance.
     * Rank order is stable across situations that afford the SAME traits and
       reorders across situations that afford different ones. The anonymous
       discussion carries a NEGATIVE weight on politeness, so it releases what
       the party suppresses and reverses part of the ranking.

   Neither person nor situation is given priority anywhere in the model: the
   behaviour is a function of both, and which term dominates is set by k, which
   is a property of the situation rather than a fact about psychology.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   * One observable behaviour per situation, on an arbitrary 0-100 scale.
   * The person term is linear in the traits, with no trait × trait
     interaction and no learning across situations.
   * There is no measurement error and no occasion-to-occasion variability;
     the State versus Trait Tracker in this module is the tool that adds them.
   * Situation strength is a single number set by the author. In reality it is
     an inference from observed behaviour, which makes the reasoning here
     pleasingly circular in a way worth raising with a class.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     1. Cast and situations
     ===================================================================== */

  var GAIN = 1.35;

  /* Four fictional people. Trait scores are illustrative values on an
     arbitrary 0-100 scale; nobody was measured. */
  var CAST = [
    {
      id: "mara",
      name: "Mara",
      sketch: "Direct, quick to take the floor, not much troubled by whether people agree with her.",
      traits: { extraversion: 84, conscientiousness: 58, politeness: 28, stability: 70 }
    },
    {
      id: "jonah",
      name: "Jonah",
      sketch: "Quiet, extremely dependable, would rather finish the work than discuss it.",
      traits: { extraversion: 30, conscientiousness: 88, politeness: 62, stability: 66 }
    },
    {
      id: "elif",
      name: "Elif",
      sketch: "Warm and accommodating, reads a room quickly, dislikes friction.",
      traits: { extraversion: 62, conscientiousness: 60, politeness: 86, stability: 58 }
    },
    {
      id: "theo",
      name: "Theo",
      sketch: "Sociable but easily rattled; how he comes across depends a lot on how safe he feels.",
      traits: { extraversion: 66, conscientiousness: 44, politeness: 60, stability: 26 }
    }
  ];

  var TRAIT_LABELS = {
    extraversion: "Extraversion",
    conscientiousness: "Conscientiousness",
    politeness: "Politeness",
    stability: "Emotional stability"
  };

  /* Each situation affords some traits and not others. Weights sum to 1 in
     absolute value. A negative weight means the situation rewards the LOW end
     of that trait. */
  var SITUATIONS = [
    {
      id: "party",
      name: "A party where they know few people",
      behaviour: "How much they approach and start conversations",
      weights: { extraversion: 0.8, politeness: 0.2 },
      norm: 55,
      strength: 0.20,
      note:
        "A weak situation: almost nothing is prescribed, so what people do is mostly a matter of who they are."
    },
    {
      id: "interview",
      name: "A formal job interview",
      behaviour: "How strongly they present their own case",
      weights: { extraversion: 0.45, stability: 0.35, conscientiousness: 0.2 },
      norm: 72,
      strength: 0.72,
      note:
        "A strong situation: everybody knows the script, and almost everybody performs it."
    },
    {
      id: "project",
      name: "A six-week collaborative project",
      behaviour: "Share of the initiative they take",
      weights: { conscientiousness: 0.5, extraversion: 0.3, politeness: 0.2 },
      norm: 50,
      strength: 0.28,
      note:
        "Long, loosely structured, and repeated — the conditions under which traits show up most clearly."
    },
    {
      id: "emergency",
      name: "A sudden emergency in a public place",
      behaviour: "How much they take charge",
      weights: { stability: 0.5, extraversion: 0.3, conscientiousness: 0.2 },
      norm: 62,
      strength: 0.78,
      note:
        "Strong and unambiguous. It also affords a different trait: composure matters here far more than sociability."
    },
    {
      id: "anonymous",
      name: "An anonymous online discussion",
      behaviour: "How outspoken and blunt they are",
      /* Politeness carries a NEGATIVE weight: anonymity removes the social
         cost of bluntness, so the people held back by politeness elsewhere
         are the ones released here. This is what reorders the cast. */
      weights: { politeness: -0.45, extraversion: 0.35, stability: 0.2 },
      norm: 50,
      strength: 0.15,
      note:
        "Weak in constraint but different in what it affords: with no reputational cost, politeness stops holding anyone back."
    }
  ];

  var ROLES = [
    { id: "none", name: "No assigned role", offset: 0, strengthDelta: 0 },
    {
      id: "leader",
      name: "Assigned to lead",
      offset: 14,
      strengthDelta: 0.18,
      note: "A prescribed role raises everyone's behaviour and constrains it."
    },
    {
      id: "observer",
      name: "Assigned to observe and take notes",
      offset: -14,
      strengthDelta: 0.18,
      note: "The same constraint working in the other direction."
    }
  ];

  /* =======================================================================
     2. Model
     ===================================================================== */

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  /** The person term: what this person tends to do, given what the situation
      affords. Situations that afford nothing of a trait ignore it entirely. */
  function disposition(person, situation) {
    var total = 50;
    Object.keys(situation.weights).forEach(function (trait) {
      total += GAIN * situation.weights[trait] * (person.traits[trait] - 50);
    });
    return total;
  }

  /**
   * The strength actually in force: the situation's own strength (or the
   * slider's override) plus whatever an assigned role adds, because a
   * prescribed role is itself a constraint. Everything that displays a
   * strength must use this, or the page shows one number while the model
   * uses another.
   */
  function effectiveStrength(situation, strengthOverride, role) {
    var base =
      strengthOverride === null || strengthOverride === undefined
        ? situation.strength
        : strengthOverride;
    return clamp(base + (role ? role.strengthDelta : 0), 0, 1);
  }

  /** Observable behaviour, given a strength multiplier and an assigned role. */
  function behaviour(person, situation, strengthOverride, role) {
    var k = effectiveStrength(situation, strengthOverride, role);
    var value =
      k * situation.norm + (1 - k) * disposition(person, situation) +
      (role ? role.offset : 0);
    return clamp(value, 0, 100);
  }

  /** Ranks, 1 = highest behaviour. Ties share the lower rank number. */
  function ranksFor(situation, strengthOverride, role) {
    var scored = CAST.map(function (person) {
      return { id: person.id, value: behaviour(person, situation, strengthOverride, role) };
    });
    scored.sort(function (a, b) {
      return b.value - a.value;
    });
    var ranks = {};
    scored.forEach(function (entry, index) {
      ranks[entry.id] = index + 1;
    });
    return ranks;
  }

  /** Spearman's rho between two rankings of the same four people. */
  function spearman(one, two) {
    var n = CAST.length;
    var sum = CAST.reduce(function (total, person) {
      var d = one[person.id] - two[person.id];
      return total + d * d;
    }, 0);
    return 1 - (6 * sum) / (n * (n * n - 1));
  }

  /** Between-person standard deviation of behaviour in a situation. */
  function spread(situation, strengthOverride, role) {
    var values = CAST.map(function (person) {
      return behaviour(person, situation, strengthOverride, role);
    });
    var mean = values.reduce(function (a, b) {
      return a + b;
    }, 0) / values.length;
    var variance = values.reduce(function (total, value) {
      return total + (value - mean) * (value - mean);
    }, 0) / values.length;
    return Math.sqrt(variance);
  }

  /** Mean pairwise rank correlation across all five situations. */
  function consistency(strengthOverride, role) {
    var rankings = SITUATIONS.map(function (situation) {
      return ranksFor(situation, strengthOverride, role);
    });
    var total = 0;
    var pairs = 0;
    for (var i = 0; i < rankings.length; i += 1) {
      for (var j = i + 1; j < rankings.length; j += 1) {
        total += spearman(rankings[i], rankings[j]);
        pairs += 1;
      }
    }
    return pairs ? total / pairs : 0;
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

  function byId(list, id) {
    return list.filter(function (entry) {
      return entry.id === id;
    })[0];
  }

  function personById(id) {
    return byId(CAST, id);
  }

  /* =======================================================================
     4. Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#theatre");
  if (!shell) {
    return;
  }

  var page = document;
  var $ = function (selector, scope) {
    return (scope || page).querySelector(selector);
  };

  var castList = $("[data-cast]");
  var situationSelect = $("#situation-select");
  var roleSelect = $("#role-select");
  var strengthRange = $("#strength-range");
  var situationNote = $("[data-situation-note]");
  var behaviourLabel = $("[data-behaviour-label]");
  var stageChart = $("[data-stage-chart]");
  var stageTable = $("[data-stage-table]");
  var readout = $("[data-readout]");
  var graphSvg = $("[data-graph]");
  var graphTable = $("[data-graph-table]");

  var matrixTable = $("[data-matrix-table]");
  var matrixNote = $("[data-matrix-note]");

  var rounds = [
    {
      key: "party",
      form: $("#round1-form"),
      error: $("[data-round1-error]"),
      feedback: $("[data-round1-feedback]"),
      section: $("#round1")
    },
    {
      key: "anonymous",
      form: $("#round2-form"),
      error: $("[data-round2-error]"),
      feedback: $("[data-round2-feedback]"),
      section: $("#round2")
    }
  ];

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");
  var challengeStatus = $("[data-challenge-status]");

  var INITIAL = {
    situationId: "party",
    roleId: "none",
    strength: null, // null = use the situation's own strength
    roundsDone: {},
    exploreUnlocked: false
  };
  var state = null;
  var rangeSyncs = [];

  /* --- Cast ------------------------------------------------------------- */

  function renderCast() {
    clear(castList);
    CAST.forEach(function (person) {
      var item = make("li", "cast__card");
      // h3: the cast section's own heading is an h2, so h4 would skip a level.
      item.appendChild(make("h3", "cast__name", person.name));
      item.appendChild(make("p", "cast__sketch", person.sketch));

      var traits = make("dl", "cast__traits");
      Object.keys(TRAIT_LABELS).forEach(function (trait) {
        var row = make("div");
        row.appendChild(make("dt", null, TRAIT_LABELS[trait]));
        row.appendChild(make("dd", null, String(person.traits[trait])));
        traits.appendChild(row);
      });
      item.appendChild(traits);
      castList.appendChild(item);
    });
  }

  /* --- Ranking forms ----------------------------------------------------- */

  function buildRankingForm(round) {
    var container = $("[data-ranking]", round.form);
    clear(container);

    CAST.forEach(function (person) {
      var row = make("div", "ranking__row");
      var id = "rank-" + round.key + "-" + person.id;

      var label = make("label", "ranking__name");
      label.setAttribute("for", id);
      label.textContent = person.name;

      var select = document.createElement("select");
      select.id = id;
      select.name = "rank-" + round.key;
      select.setAttribute("data-person", person.id);
      var blank = make("option", null, "—");
      blank.value = "";
      select.appendChild(blank);
      CAST.forEach(function (_, index) {
        var option = make("option", null, String(index + 1));
        option.value = String(index + 1);
        select.appendChild(option);
      });

      row.appendChild(label);
      row.appendChild(select);
      container.appendChild(row);
    });
  }

  function readRanking(round) {
    var selects = round.form.querySelectorAll("select[data-person]");
    var ranking = {};
    var used = {};
    var complete = true;
    var duplicate = false;

    Array.prototype.forEach.call(selects, function (select) {
      var value = select.value;
      if (!value) {
        complete = false;
        return;
      }
      if (used[value]) {
        duplicate = true;
      }
      used[value] = true;
      ranking[select.getAttribute("data-person")] = Number(value);
    });

    return { ranking: ranking, complete: complete, duplicate: duplicate };
  }

  rounds.forEach(function (round) {
    round.form.addEventListener("submit", function (event) {
      event.preventDefault();
      var read = readRanking(round);

      if (!read.complete) {
        round.error.textContent =
          "Give every character a rank from 1 to 4 before revealing.";
        round.error.hidden = false;
        return;
      }
      if (read.duplicate) {
        round.error.textContent =
          "Each rank from 1 to 4 can only be used once. Two characters " +
          "currently share a rank.";
        round.error.hidden = false;
        return;
      }
      round.error.hidden = true;

      var situation = byId(SITUATIONS, round.key);
      var actual = ranksFor(situation, null, byId(ROLES, "none"));
      var rho = spearman(read.ranking, actual);
      var exact = CAST.filter(function (person) {
        return read.ranking[person.id] === actual[person.id];
      }).length;

      state.roundsDone[round.key] = { rho: rho, exact: exact };
      showRoundFeedback(round, situation, read.ranking, actual, rho, exact);
      lockForm(round.form);

      if (round.key === "party") {
        rounds[1].section.hidden = false;
        $("#round2-heading").focus();
      } else {
        state.exploreUnlocked = true;
        $("#explore").hidden = false;
        renderAll();
        $("#explore-heading").focus();
      }

      shell.announce(
        "Ranking revealed. " + exact + " of 4 exactly right, rank correlation " +
          fmt(rho, 2) + ".",
        { immediate: true }
      );
    });
  });

  function showRoundFeedback(round, situation, predicted, actual, rho, exact) {
    var container = round.feedback;
    clear(container);
    container.hidden = false;
    container.setAttribute(
      "data-tone", exact === 4 ? "good" : exact >= 2 ? "caution" : "warn");

    var lead =
      exact === 4
        ? "All four in the right order."
        : exact + " of 4 in exactly the right place (rank correlation " +
          fmt(rho, 2) + ").";
    var paragraph = make("p");
    paragraph.appendChild(make("strong", "feedback__verdict", lead));
    container.appendChild(paragraph);

    var table = make("table", "data-table");
    var head = make("thead");
    var headRow = make("tr");
    ["Character", "You said", "Model says", "Behaviour"].forEach(function (heading) {
      var th = make("th", null, heading);
      th.setAttribute("scope", "col");
      headRow.appendChild(th);
    });
    head.appendChild(headRow);
    table.appendChild(head);

    var body = make("tbody");
    CAST.slice()
      .sort(function (a, b) {
        return actual[a.id] - actual[b.id];
      })
      .forEach(function (person) {
        var row = make("tr");
        var th = make("th", null, person.name);
        th.setAttribute("scope", "row");
        row.appendChild(th);
        row.appendChild(make("td", null, String(predicted[person.id])));
        row.appendChild(make("td", null, String(actual[person.id])));
        row.appendChild(
          make("td", null,
            fmt(behaviour(person, situation, null, byId(ROLES, "none")))));
        body.appendChild(row);
      });
    table.appendChild(body);

    var wrap = make("div", "table-scroll");
    wrap.appendChild(table);
    container.appendChild(wrap);

    container.appendChild(make("p", null, explainRound(round.key)));
  }

  function explainRound(key) {
    if (key === "party") {
      return (
        "The party affords extraversion and very little else, and it prescribes " +
        "almost nothing — situation strength 0.20. In a weak situation like " +
        "this, behaviour is mostly the person, so the ranking follows the " +
        "trait the situation happens to afford."
      );
    }
    return (
      "The anonymous discussion is also a weak situation, but it affords a " +
      "different trait, and in the opposite direction. With no reputational " +
      "cost, politeness stops holding anyone back: the most polite character " +
      "drops and the least polite rises. Nobody's personality changed. What " +
      "changed is which part of it the situation let out."
    );
  }

  /* --- Explorer ---------------------------------------------------------- */

  SITUATIONS.forEach(function (situation) {
    var option = make("option", null, situation.name);
    option.value = situation.id;
    situationSelect.appendChild(option);
  });

  ROLES.forEach(function (role) {
    var option = make("option", null, role.name);
    option.value = role.id;
    roleSelect.appendChild(option);
  });

  situationSelect.addEventListener("change", function () {
    state.situationId = situationSelect.value;
    // Selecting a situation adopts its own strength until the slider moves.
    state.strength = null;
    strengthRange.value = String(
      Math.round(byId(SITUATIONS, state.situationId).strength * 100));
    syncRanges();
    renderAll();
    shell.announce(
      "Situation: " + byId(SITUATIONS, state.situationId).name +
        ". Strength reset to its own value.",
      { immediate: true }
    );
  });

  roleSelect.addEventListener("change", function () {
    state.roleId = roleSelect.value;
    renderAll();
    shell.announce("Role: " + byId(ROLES, state.roleId).name + ".", {
      immediate: true
    });
  });

  bindRange(strengthRange, {
    format: function (value) {
      return (value / 100).toFixed(2);
    },
    describe: function (value) {
      return value < 30
        ? "weak situation, " + (value / 100).toFixed(2)
        : value < 65
        ? "moderate situation, " + (value / 100).toFixed(2)
        : "strong situation, " + (value / 100).toFixed(2);
    },
    onInput: function (value) {
      state.strength = value / 100;
      renderAll();
    }
  });

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
      if (settings.onInput) {
        settings.onInput(value);
      }
    }
    input.addEventListener("input", sync);
    rangeSyncs.push(sync);
    return sync;
  }

  function syncRanges() {
    rangeSyncs.forEach(function (sync) {
      sync();
    });
  }

  function currentStrength() {
    return state.strength === null
      ? byId(SITUATIONS, state.situationId).strength
      : state.strength;
  }

  function renderAll() {
    if (!state.exploreUnlocked) {
      return;
    }
    var situation = byId(SITUATIONS, state.situationId);
    var role = byId(ROLES, state.roleId);
    var k = currentStrength();

    situationNote.textContent = situation.note;
    behaviourLabel.textContent = situation.behaviour;

    renderStage(situation, k, role);
    renderReadout(situation, k, role);
    renderGraph(situation, k, role);
    renderMatrix(k, role);
    renderChallengeStatus(situation, k, role);
  }

  function renderStage(situation, k, role) {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 34;
    var BAR = 20;
    var LEFT = 96;
    var SCALE = 3.0;

    clear(stageChart);
    stageChart.setAttribute("viewBox", "0 0 460 " + (CAST.length * ROW + 30));

    var values = CAST.map(function (person) {
      return behaviour(person, situation, k, role);
    });

    // The situation's norm, drawn as a reference line.
    var normX = LEFT + situation.norm * SCALE;
    var normLine = document.createElementNS(NS, "line");
    normLine.setAttribute("x1", String(normX));
    normLine.setAttribute("y1", "6");
    normLine.setAttribute("x2", String(normX));
    normLine.setAttribute("y2", String(CAST.length * ROW + 6));
    normLine.setAttribute("class", "chart__grid");
    stageChart.appendChild(normLine);

    var normLabel = document.createElementNS(NS, "text");
    normLabel.setAttribute("x", String(normX));
    normLabel.setAttribute("y", String(CAST.length * ROW + 22));
    normLabel.setAttribute("text-anchor", "middle");
    normLabel.setAttribute("class", "chart__axis");
    normLabel.textContent = "what the situation prescribes";
    stageChart.appendChild(normLabel);

    CAST.forEach(function (person, index) {
      var y = 8 + index * ROW;

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR - 5));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = person.name;
      stageChart.appendChild(label);

      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", String(LEFT));
      track.setAttribute("y", String(y));
      track.setAttribute("width", String(100 * SCALE));
      track.setAttribute("height", String(BAR));
      track.setAttribute("class", "chart__track");
      stageChart.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", String(LEFT));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(0, values[index]) * SCALE));
      bar.setAttribute("height", String(BAR));
      bar.setAttribute("class", "chart__bar");
      stageChart.appendChild(bar);

      var value = document.createElementNS(NS, "text");
      value.setAttribute("x", String(LEFT + values[index] * SCALE + 6));
      value.setAttribute("y", String(y + BAR - 5));
      value.setAttribute("class", "chart__count");
      value.textContent = fmt(values[index]);
      stageChart.appendChild(value);
    });

    // Table equivalent
    clear(stageTable);
    var ranks = ranksFor(situation, k, role);
    CAST.slice()
      .sort(function (a, b) {
        return ranks[a.id] - ranks[b.id];
      })
      .forEach(function (person) {
        var row = make("tr");
        var th = make("th", null, person.name);
        th.setAttribute("scope", "row");
        row.appendChild(th);
        row.appendChild(make("td", null, String(ranks[person.id])));
        row.appendChild(
          make("td", null, fmt(behaviour(person, situation, k, role))));
        row.appendChild(
          make("td", null, fmt(disposition(person, situation))));
        stageTable.appendChild(row);
      });
  }

  function renderReadout(situation, k, role) {
    clear(readout);
    [
      ["Situation strength in force", fmt(effectiveStrength(situation, k, role), 2)],
      ["Between-person spread", fmt(spread(situation, k, role), 1)],
      ["Rank consistency across situations", fmt(consistency(k, role), 2)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  /* --- The interaction graph ---------------------------------------------
     Person characteristics on the left, situational affordances in the
     middle, behaviour on the right. Edge thickness is the weight the
     situation currently gives that trait, scaled by (1 - k): as the situation
     gets stronger, every person-to-behaviour path thins and the situation's
     own path thickens. The table beneath carries the same numbers. */

  function renderGraph(situation, kRaw, role) {
    var NS = "http://www.w3.org/2000/svg";
    // Edge thickness must reflect the strength actually in force, role
    // included, or the diagram contradicts the numbers beside it.
    var k = effectiveStrength(situation, kRaw, role);
    clear(graphSvg);

    var traits = Object.keys(TRAIT_LABELS);
    var rowGap = 46;
    var height = traits.length * rowGap + 60;
    graphSvg.setAttribute("viewBox", "0 0 460 " + height);

    var leftX = 12;
    var midX = 250;
    var rightX = 392;
    var behaviourY = height / 2 - 10;

    // The situation node
    var sitBox = document.createElementNS(NS, "rect");
    sitBox.setAttribute("x", String(midX - 52));
    sitBox.setAttribute("y", String(height - 44));
    sitBox.setAttribute("width", "104");
    sitBox.setAttribute("height", "30");
    sitBox.setAttribute("rx", "6");
    sitBox.setAttribute("class", "graph__node graph__node--situation");
    graphSvg.appendChild(sitBox);

    var sitText = document.createElementNS(NS, "text");
    sitText.setAttribute("x", String(midX));
    sitText.setAttribute("y", String(height - 24));
    sitText.setAttribute("text-anchor", "middle");
    sitText.setAttribute("class", "chart__label");
    sitText.textContent = "situation";
    graphSvg.appendChild(sitText);

    // Situation -> behaviour edge, thickness = k
    var sitEdge = document.createElementNS(NS, "path");
    sitEdge.setAttribute(
      "d",
      "M " + (midX + 52) + " " + (height - 29) +
        " Q " + rightX + " " + (height - 29) + " " + rightX + " " + (behaviourY + 16)
    );
    sitEdge.setAttribute("class", "graph__edge graph__edge--situation");
    sitEdge.setAttribute("stroke-width", String(1 + k * 9));
    graphSvg.appendChild(sitEdge);

    traits.forEach(function (trait, index) {
      var y = 22 + index * rowGap;
      var weight = situation.weights[trait] || 0;
      var afforded = Math.abs(weight) > 0.001;

      var box = document.createElementNS(NS, "rect");
      box.setAttribute("x", String(leftX));
      box.setAttribute("y", String(y - 14));
      box.setAttribute("width", "150");
      box.setAttribute("height", "28");
      box.setAttribute("rx", "6");
      box.setAttribute(
        "class", "graph__node" + (afforded ? "" : " graph__node--muted"));
      graphSvg.appendChild(box);

      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(leftX + 8));
      text.setAttribute("y", String(y + 4));
      text.setAttribute("class", "chart__label");
      text.textContent = TRAIT_LABELS[trait];
      graphSvg.appendChild(text);

      if (!afforded) {
        var blocked = document.createElementNS(NS, "text");
        blocked.setAttribute("x", String(leftX + 160));
        blocked.setAttribute("y", String(y + 4));
        blocked.setAttribute("class", "chart__axis");
        blocked.textContent = "not afforded here";
        graphSvg.appendChild(blocked);
        return;
      }

      var edge = document.createElementNS(NS, "path");
      edge.setAttribute(
        "d",
        "M " + (leftX + 150) + " " + y + " Q " + midX + " " + y + " " +
          rightX + " " + behaviourY
      );
      edge.setAttribute(
        "class",
        "graph__edge" + (weight < 0 ? " graph__edge--negative" : ""));
      edge.setAttribute("stroke-width", String(1 + Math.abs(weight) * (1 - k) * 14));
      graphSvg.appendChild(edge);

      var weightText = document.createElementNS(NS, "text");
      weightText.setAttribute("x", String(midX - 20));
      weightText.setAttribute("y", String(y - 6));
      weightText.setAttribute("class", "chart__axis");
      weightText.textContent =
        (weight < 0 ? "−" : "+") + Math.abs(weight).toFixed(2);
      graphSvg.appendChild(weightText);
    });

    var behaviourBox = document.createElementNS(NS, "rect");
    behaviourBox.setAttribute("x", String(rightX - 6));
    behaviourBox.setAttribute("y", String(behaviourY - 14));
    behaviourBox.setAttribute("width", "62");
    behaviourBox.setAttribute("height", "28");
    behaviourBox.setAttribute("rx", "6");
    behaviourBox.setAttribute("class", "graph__node graph__node--outcome");
    graphSvg.appendChild(behaviourBox);

    var behaviourText = document.createElementNS(NS, "text");
    behaviourText.setAttribute("x", String(rightX + 25));
    behaviourText.setAttribute("y", String(behaviourY + 4));
    behaviourText.setAttribute("text-anchor", "middle");
    behaviourText.setAttribute("class", "chart__label");
    behaviourText.textContent = "behaviour";
    graphSvg.appendChild(behaviourText);

    // Table equivalent for the graph.
    clear(graphTable);
    traits.forEach(function (trait) {
      var weight = situation.weights[trait] || 0;
      var row = make("tr");
      var th = make("th", null, TRAIT_LABELS[trait]);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(
        make("td", null,
          Math.abs(weight) < 0.001
            ? "not afforded"
            : (weight < 0 ? "−" : "+") + Math.abs(weight).toFixed(2)));
      row.appendChild(
        make("td", null,
          Math.abs(weight) < 0.001
            ? "0.00"
            : (Math.abs(weight) * (1 - k)).toFixed(2)));
      graphTable.appendChild(row);
    });
    var sitRow = make("tr", "data-table__total");
    var sitTh = make("th", null, "The situation itself");
    sitTh.setAttribute("scope", "row");
    sitRow.appendChild(sitTh);
    sitRow.appendChild(make("td", null, "strength " + fmt(k, 2)));
    sitRow.appendChild(make("td", null, fmt(k, 2)));
    graphTable.appendChild(sitRow);
  }

  /* --- The matrix --------------------------------------------------------- */

  function renderMatrix(k, role) {
    clear(matrixTable);

    SITUATIONS.forEach(function (situation) {
      var ranks = ranksFor(situation, k, role);
      var row = make("tr");
      var th = make("th", null, situation.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      CAST.forEach(function (person) {
        var cell = make("td", null,
          fmt(behaviour(person, situation, k, role)) +
            " (" + ranks[person.id] + ")");
        row.appendChild(cell);
      });
      matrixTable.appendChild(row);
    });

    var rho = consistency(k, role);
    matrixNote.textContent =
      "Mean rank correlation between every pair of situations: " + fmt(rho, 2) +
      ". " +
      (rho > 0.75
        ? "High — the same people come out near the top almost everywhere, " +
          "which is what trait consistency looks like."
        : rho > 0.35
        ? "Moderate — there is a recognisable person here, and the situations " +
          "still reorder them substantially. This is the ordinary case."
        : "Low — the ranking is being driven by what each situation affords " +
          "rather than by a single dimension of personality.");
  }

  /* --- Challenge ---------------------------------------------------------- */

  function renderChallengeStatus(situation, k, role) {
    var currentSpread = spread(situation, k, role);
    challengeStatus.textContent =
      "Current between-person spread in this situation: " + fmt(currentSpread, 1) +
      " points. Under 2.0 counts as behaviourally indistinguishable.";
    challengeStatus.setAttribute(
      "data-tone", currentSpread < 2 ? "good" : "neutral");
  }

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="challenge"]:checked', challengeForm);
    if (!answer) {
      showFeedback(challengeFeedback, "caution", "Choose an answer first.", "");
      return;
    }

    var situation = byId(SITUATIONS, state.situationId);
    var currentSpread = spread(situation, currentStrength(), byId(ROLES, state.roleId));

    var correct = answer.value === "nothing";
    showFeedback(
      challengeFeedback,
      correct ? "good" : "caution",
      correct ? "Yes." : "Not quite.",
      "You have the spread down to " + fmt(currentSpread, 1) + " points. " +
        "When a situation is strong enough, everyone does roughly the same " +
        "thing, so the behaviour tells you almost nothing about who they are. " +
        "The trait scores in the cast list are unchanged. Low observed " +
        "variance is not evidence of low trait variance."
    );
    shell.announce("Challenge answered.", { immediate: true });
  });

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

  /* The reset button sits inside Round 1's form so it is reachable before the
     explorer exists; locking the form must not take it with it, or a student
     who has answered Round 1 has no way back until Round 2 is done too. */
  function lockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button, select"),
      function (control) {
        if (control.getAttribute("data-action") !== "reset-early") {
          control.disabled = true;
        }
      }
    );
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll("input, button, select"),
      function (control) {
        control.disabled = false;
      }
    );
    form.reset();
  }

  /* The shell's own reset button lives inside the explorer, which stays
     hidden until both rounds are done — so the rounds need their own way back
     to the start. Same handler, different button. */
  var earlyReset = $('[data-action="reset-early"]');
  if (earlyReset) {
    earlyReset.addEventListener("click", function () {
      shell.reset();
    });
  }

  /* --- Reset --------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));

    rounds.forEach(function (round) {
      unlockForm(round.form);
      round.feedback.hidden = true;
      round.error.hidden = true;
    });
    rounds[1].section.hidden = true;
    $("#explore").hidden = true;

    challengeForm.reset();
    challengeFeedback.hidden = true;

    situationSelect.value = state.situationId;
    roleSelect.value = state.roleId;
    strengthRange.value = String(
      Math.round(byId(SITUATIONS, state.situationId).strength * 100));

    renderCast();
    rounds.forEach(buildRankingForm);
    syncRanges();
  });

  /* --- Start-up ------------------------------------------------------------ */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Rank the four characters for the party before revealing.",
    { immediate: true }
  );
})();
