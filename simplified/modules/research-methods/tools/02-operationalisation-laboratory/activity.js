/* =========================================================================
   Operationalisation Laboratory — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/research-methods/tools/02-operationalisation-laboratory/

   WHAT IS PRESERVED
   -----------------
   The live coverage map, unchanged in kind. The learner builds a measurement
   plan and both consequences update immediately:

     * how much of the construct the plan reaches, facet by facet — construct
       under-representation, shown as the facets left at "not reached";
     * what the plan records that is not the construct — construct-irrelevant
       variance, shown as a list that grows with every measure added.

   Those two are laid out on opposite sides of the page on purpose. They pull
   in opposite directions, and that is the intellectual point of the original.

   The educational model is the original's, unchanged:

     0  does not reach this facet
     1  reaches it partly
     2  reaches it well

   Facet level for a plan is the MAXIMUM across the selected measures, never
   the sum. Two measures that each reach a facet partly give two partial views
   of the same thing, which is worth something but is not the same as reaching
   it well. Coverage is the sum of facet levels out of 2 x 5 = 10. It is
   arithmetic over a facet list somebody wrote down, and the page says so.
   It is NOT a validity coefficient.

   One property of the original is worth keeping deliberately: the agentic
   facet is reached at best partly by any measure here, so even selecting all
   four caps the plan at 9 of 10. Combining measures buys coverage; it does
   not buy the construct.

   WHAT WAS REDUCED
   ----------------
   Three constructs to one (academic engagement). Six measures to four: the
   VLE-hours and seminar-observation measures were dropped because their
   coverage rows nearly duplicate lecture attendance, so the third and fourth
   of that family taught nothing the first had not. Reactivity and feasibility
   ratings, the comparison table, the "select everything" and worked-example
   controls, the opening prediction and the reactivity challenge are all gone:
   each is a further teaching job around the same mechanism.

   The remaining four span all four measurement families in the original —
   behavioural trace, self-report, performance-based, and self-report by
   experience sampling — so the family contrast survives the cut.

   Fictional teaching material. No published instrument, item or proprietary
   assessment is reproduced; the measures are described generically. Nothing
   is stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var LEVEL_WORD = ["not reached", "partly reached", "well reached"];
  var MAX_PER_FACET = 2;

  /* The construct, modelled as five facets. A model, not a fact — the page
     says so, twice. */
  var FACETS = ["Behavioural", "Cognitive", "Emotional", "Agentic", "Persistence"];

  /* Four measures, one per family in the original. `cover` is per facet, in
     FACETS order. `records` is construct-irrelevant variance in plain terms. */
  var MEASURES = [
    {
      id: "attendance",
      name: "Lecture attendance records",
      family: "Behavioural trace",
      cover: [2, 0, 0, 0, 0],
      records: "commuting distance and cost, timetable clashes and part-time " +
               "work, illness and caring responsibilities, and whether the " +
               "lecture was recorded, which changes attendance without " +
               "changing engagement"
    },
    {
      id: "scale",
      name: "Multi-item self-report engagement scale",
      family: "Self-report",
      cover: [1, 2, 2, 1, 1],
      records: "how the student reads the word “engaged”, which differs by " +
               "background; socially desirable responding, especially if a " +
               "tutor will see it; mood on the day; and acquiescent or extreme " +
               "responding styles"
    },
    {
      id: "task",
      name: "Depth-of-processing task: summarise and elaborate a reading",
      family: "Performance-based",
      cover: [0, 2, 0, 0, 1],
      records: "prior knowledge of the topic, reading speed and writing " +
               "fluency, whether the student has met this kind of task before, " +
               "and the language of instruction"
    },
    {
      id: "esm",
      name: "Experience sampling during study sessions",
      family: "Self-report",
      cover: [0, 1, 2, 0, 2],
      records: "the prompt itself, which interrupts the state it is asking " +
               "about; who is willing to be interrupted six times a day, and " +
               "who drops out; time of day and whatever else was happening"
    }
  ];

  /* The plan the learner arrives at: the commonest real-world proxy for
     engagement, and the one whose coverage map is most lopsided. Starting
     here means the first thing on screen is already a result worth reacting
     to, without a prediction panel in front of the mechanism. */
  var STARTING_PLAN = ["attendance"];

  /* The synthesis stays shut until the learner has actually moved something.
     Explanation arriving before discovery is the failure mode this whole
     edition is written against. */
  var CHANGES_BEFORE_EXPLAINING = 2;

  var measuresBox = document.getElementById("measures");
  var contaminationList = document.getElementById("contamination");
  var contaminationLead = document.getElementById("contamination-lead");
  var readout = document.getElementById("readout");
  var coverage = document.getElementById("coverage");
  var explain = document.getElementById("explain");
  var explainHint = document.getElementById("explain-hint");

  var selected = STARTING_PLAN.slice();
  var changes = 0;

  /* --- The model ------------------------------------------------------- */

  function chosen() {
    return MEASURES.filter(function (measure) {
      return selected.indexOf(measure.id) !== -1;
    });
  }

  /**
   * Facet level for the current plan: the best any single selected measure
   * manages, never the sum. This is the whole reason the map is not simply
   * additive, and it is what makes "add another measure" stop helping.
   */
  function levels() {
    return FACETS.map(function (_, index) {
      var best = 0;
      chosen().forEach(function (measure) {
        if (measure.cover[index] > best) {
          best = measure.cover[index];
        }
      });
      return best;
    });
  }

  function totals(levelList) {
    var total = 0;
    var unreached = 0;
    levelList.forEach(function (level) {
      total += level;
      if (level === 0) {
        unreached += 1;
      }
    });
    return {
      total: total,
      maximum: FACETS.length * MAX_PER_FACET,
      unreached: unreached
    };
  }

  /* --- Rendering ------------------------------------------------------- */

  function renderMeasures() {
    measuresBox.textContent = "";

    var legend = document.createElement("legend");
    legend.className = "visually-hidden";
    legend.textContent = "Measures in the plan";
    measuresBox.appendChild(legend);

    MEASURES.forEach(function (measure) {
      var label = document.createElement("label");
      label.className = "toggle";

      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = measure.id;
      input.checked = selected.indexOf(measure.id) !== -1;

      var body = document.createElement("span");
      var name = document.createElement("strong");
      name.textContent = measure.name;
      var family = document.createElement("span");
      family.textContent = measure.family;
      body.appendChild(name);
      body.appendChild(family);

      label.setAttribute("data-checked", String(input.checked));
      label.appendChild(input);
      label.appendChild(body);

      input.addEventListener("change", function () {
        toggle(measure.id, input.checked);
        label.setAttribute("data-checked", String(input.checked));
      });

      measuresBox.appendChild(label);
    });
  }

  function renderCoverage(levelList) {
    coverage.textContent = "";

    FACETS.forEach(function (facet, index) {
      var level = levelList[index];

      var row = document.createElement("div");
      row.className = "bar-row";

      var label = document.createElement("span");
      label.textContent = facet;

      var track = document.createElement("div");
      track.className = "track";
      var fill = document.createElement("div");
      fill.className = "fill";
      fill.style.width = (level / MAX_PER_FACET) * 100 + "%";
      track.appendChild(fill);

      /* The word, not the bar, is what carries the level: a bar at zero width
         is indistinguishable from a bar that failed to render, and neither
         says anything to a screen reader. */
      var word = document.createElement("span");
      word.className = "value";
      word.textContent = LEVEL_WORD[level];

      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(word);
      coverage.appendChild(row);
    });
  }

  /**
   * The headline, on one line directly above the map it summarises. It was
   * two large figure tiles; they restated what the bars already show and cost
   * a hundred pixels of the screen the learner needs for the mechanism.
   */
  function renderReadout(stats) {
    readout.textContent =
      "Construct reached: " +
      stats.total +
      " of " +
      stats.maximum +
      "  ·  Facets not reached at all: " +
      stats.unreached +
      " of " +
      FACETS.length;
  }

  function renderContamination() {
    contaminationList.textContent = "";
    var plan = chosen();

    if (!plan.length) {
      contaminationLead.textContent =
        "Nothing selected. An empty plan records nothing and reaches nothing.";
      return;
    }

    contaminationLead.textContent =
      "Everything below is recorded by the plan without being academic engagement.";

    plan.forEach(function (measure) {
      var item = document.createElement("li");
      var name = document.createElement("strong");
      name.textContent = measure.name + " also records: ";
      item.appendChild(name);
      item.appendChild(document.createTextNode(measure.records + "."));
      contaminationList.appendChild(item);
    });
  }

  /* --- Reacting -------------------------------------------------------- */

  function toggle(id, on) {
    var at = selected.indexOf(id);

    if (on && at === -1) {
      selected.push(id);
    } else if (!on && at !== -1) {
      selected.splice(at, 1);
    } else {
      return;
    }

    changes += 1;
    update({ announce: true });
  }

  function update(options) {
    var settings = options || {};
    var levelList = levels();
    var stats = totals(levelList);

    renderCoverage(levelList);
    renderReadout(stats);
    renderContamination();

    if (changes >= CHANGES_BEFORE_EXPLAINING) {
      explain.disabled = false;
      wb.hide(explainHint);
    }

    if (settings.announce) {
      wb.announce(
        chosen().length +
          (chosen().length === 1 ? " measure" : " measures") +
          " in the plan. Construct reached " +
          stats.total +
          " of " +
          stats.maximum +
          ". " +
          (stats.unreached === 0
            ? "Every facet is reached to some degree."
            : stats.unreached +
              (stats.unreached === 1 ? " facet" : " facets") +
              " not reached at all.")
      );
    }
  }

  /* --- Moving on ------------------------------------------------------- */

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The two failure directions are now explained below.");
  });

  wb.onReset(function () {
    selected = STARTING_PLAN.slice();
    changes = 0;
    explain.disabled = true;
    wb.show(explainHint);
    wb.hide("#synthesis");
    renderMeasures();
    update({ announce: false });
  });

  renderMeasures();
  update({ announce: false });
})();
