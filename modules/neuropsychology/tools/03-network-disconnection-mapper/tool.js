/* =========================================================================
   Network Disconnection Mapper
   -------------------------------------------------------------------------
   A deliberately simplified fictional network: five regions, six pathways,
   four tasks. The learner damages regions and cuts pathways; the diagram
   redraws and each task reports whether its route is still available.

   THE EDUCATIONAL MODEL
   ---------------------
   Each task is defined as a ROUTE: an ordered list of regions and pathways
   that must all be intact for the task to run normally. Two tasks also have a
   second, weaker route. The outcome is then:

       main route intact                       -> normal
       main route broken, second route intact  -> impaired (possible, but
                                                  wrong in a characteristic way)
       both broken, or no second route         -> fails

   That third outcome state is the whole reason the tool is not a set of light
   switches. Networks degrade before they stop, and the pattern of errors says
   which route is being used.

   WHAT THE MODEL IS FOR
   ---------------------
   Two claims, both of which fall out of the arithmetic rather than being
   asserted:

     1. A task can fail while every region is intact, because what joins two
        regions has been cut.
     2. Several different single failures - two regions and the pathway
        between them - produce identical behaviour, so a symptom constrains
        where the failure is without identifying it.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Real connections are partially damaged rather than cut; real regions
   participate in many networks at once; real routes are not lists. Five boxes
   and six lines is a cartoon of an argument. No real region, tract,
   connectome or published model is reproduced, the positions carry no
   anatomical meaning, and no syndrome is named anywhere in the tool.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     The network - entirely fictional
     ===================================================================== */

  var NODES = [
    {
      id: "see", label: ["Seeing", "objects"], x: 55, y: 100,
      name: "Seeing objects",
      meaning: "Working out what a picture shows"
    },
    {
      id: "mean", label: ["Meaning"], x: 170, y: 45,
      name: "Meaning",
      meaning: "What things are, and what they are for"
    },
    {
      id: "word", label: ["Word", "sounds"], x: 170, y: 155,
      name: "Word sounds",
      meaning: "The stored sound patterns of known words"
    },
    {
      id: "speak", label: ["Speech", "output"], x: 170, y: 225,
      name: "Speech output",
      meaning: "Planning and producing the movements of speech"
    },
    {
      id: "hear", label: ["Hearing", "speech"], x: 290, y: 100,
      name: "Hearing speech",
      meaning: "Analysing the speech sounds coming in"
    }
  ];

  var EDGES = [
    {
      id: "see-mean", from: "see", to: "mean",
      name: "Seeing objects to meaning",
      meaning: "Carries what was seen to what it means"
    },
    {
      id: "see-word", from: "see", to: "word",
      name: "Seeing objects to word sounds (direct)",
      meaning: "A weaker route straight from a picture to a word, bypassing meaning"
    },
    {
      id: "mean-word", from: "mean", to: "word",
      name: "Meaning to word sounds",
      meaning: "Carries a meaning to the word that expresses it"
    },
    {
      id: "word-speak", from: "word", to: "speak",
      name: "Word sounds to speech output",
      meaning: "Carries a word's sound pattern to the machinery that says it"
    },
    {
      id: "hear-word", from: "hear", to: "word",
      name: "Hearing speech to word sounds",
      meaning: "The route that lets a heard word be repeated without understanding it"
    },
    {
      id: "hear-mean", from: "hear", to: "mean",
      name: "Hearing speech to meaning",
      meaning: "Carries a heard word to what it means"
    }
  ];

  var TASKS = [
    {
      id: "name",
      short: "Naming a picture",
      name: "Name the object in a picture",
      main: ["see", "see-mean", "mean", "mean-word", "word", "word-speak", "speak"],
      second: ["see", "see-word", "word", "word-speak", "speak"],
      impairedNote:
        "possible on the direct route, but the names that come out are " +
        "related rather than right - a hammer called a nail"
    },
    {
      id: "repeat",
      short: "Repeating a word",
      name: "Repeat a spoken word",
      main: ["hear", "hear-word", "word", "word-speak", "speak"],
      second: ["hear", "hear-mean", "mean", "mean-word", "word", "word-speak", "speak"],
      impairedNote:
        "possible for familiar words by going round through meaning, but " +
        "unfamiliar words and non-words cannot be repeated at all"
    },
    {
      id: "point",
      short: "Pointing to a named picture",
      name: "Point to the picture the examiner names",
      main: ["hear", "hear-mean", "mean", "see-mean", "see"],
      second: null,
      impairedNote: null
    },
    {
      id: "define",
      short: "Naming from a description",
      name: "Say what the examiner is describing",
      main: ["hear", "hear-mean", "mean", "mean-word", "word", "word-speak", "speak"],
      second: null,
      impairedNote: null
    }
  ];

  var PRESETS = [
    {
      id: "clear",
      label: "Everything intact",
      damaged: [],
      note: "The starting state. All four tasks run normally."
    },
    {
      id: "disconnect",
      label: "A pathway cut between two intact regions",
      damaged: ["hear-word"],
      note:
        "Every region on the diagram is undamaged. Repetition is impaired all " +
        "the same, because the direct route from heard speech to word sounds " +
        "is gone and only the slower route through meaning remains."
    },
    {
      id: "meaning-cut",
      label: "Meaning disconnected from words",
      damaged: ["mean-word"],
      note:
        "Comprehension and repetition are untouched. Naming survives on the " +
        "direct route and produces the wrong words; saying what is being " +
        "described fails outright."
    },
    {
      id: "store",
      label: "Word-sound store damaged",
      damaged: ["word"],
      note:
        "A region, not a pathway. Compare the four outcomes with the next " +
        "preset - they are identical."
    },
    {
      id: "output",
      label: "Speech output damaged",
      damaged: ["speak"],
      note:
        "A different region, two steps away, and exactly the same four " +
        "outcomes. Cutting the pathway between them gives the same profile " +
        "again. Behaviour cannot tell these three apart."
    }
  ];

  /* The challenge: which single failures give "fails, fails, normal, fails"? */
  var CHALLENGE_OPTIONS = [
    { id: "word", label: "Damage the word-sound store", correct: true },
    { id: "speak", label: "Damage the speech-output region", correct: true },
    { id: "word-speak", label: "Cut the pathway from word sounds to speech output", correct: true },
    { id: "mean-word", label: "Cut the pathway from meaning to word sounds", correct: false },
    { id: "hear", label: "Damage the region that analyses heard speech", correct: false },
    { id: "see-mean", label: "Cut the pathway from seeing objects to meaning", correct: false }
  ];

  var OUTCOME = {
    normal: { word: "Normal", tone: "good", mark: "ok" },
    impaired: { word: "Impaired", tone: "caution", mark: "part" },
    fails: { word: "Fails", tone: "warn", mark: "no" }
  };

  /* =======================================================================
     The model
     ===================================================================== */

  function routeIntact(route, damaged) {
    if (!route) { return false; }
    return route.every(function (element) { return !damaged[element]; });
  }

  function outcomeFor(task, damaged) {
    if (routeIntact(task.main, damaged)) { return "normal"; }
    if (task.second && routeIntact(task.second, damaged)) { return "impaired"; }
    return "fails";
  }

  function profileOf(damaged) {
    return TASKS.map(function (task) { return outcomeFor(task, damaged); }).join("/");
  }

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

  var NS = "http://www.w3.org/2000/svg";

  function svgEl(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, String(attrs[key]));
    });
    return node;
  }

  function svgText(x, y, className, anchor, text) {
    var node = svgEl("text", { x: x, y: y, class: className, "text-anchor": anchor });
    node.textContent = text;
    return node;
  }

  function nodeById(id) {
    return NODES.filter(function (n) { return n.id === id; })[0];
  }

  function elementName(id) {
    var node = nodeById(id);
    if (node) { return node.name; }
    return EDGES.filter(function (e) { return e.id === id; })[0].name;
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#mapper");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var presetHost = $("[data-presets]");
  var presetNote = $("[data-preset-note]");
  var nodeControls = $("[data-node-controls]");
  var edgeControls = $("[data-edge-controls]");
  var diagram = $("[data-diagram]");
  var chips = $("[data-chips]");
  var interpretation = $("[data-interpretation]");
  var interpretationBody = $("[data-interpretation-body]");
  var taskTable = $("[data-task-table]");
  var elementTable = $("[data-element-table]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var networkSection = $("#network-section");

  var challengeForm = $("#challenge-form");
  var challengeOptions = $("[data-challenge-options]");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var damaged = {};

  /* --- Controls, built once --------------------------------------------- */

  PRESETS.forEach(function (preset) {
    var button = make("button", "button button--secondary", preset.label);
    button.type = "button";
    button.addEventListener("click", function () {
      damaged = {};
      preset.damaged.forEach(function (id) { damaged[id] = true; });
      syncCheckboxes();
      presetNote.textContent = preset.note;
      render();
      shell.announce(preset.label + ". " + preset.note, { immediate: true });
    });
    presetHost.appendChild(button);
  });

  function addToggle(host, id, labelText) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.value = id;
    input.setAttribute("data-toggle", id);
    input.addEventListener("change", function () {
      damaged[id] = input.checked;
      if (!input.checked) { delete damaged[id]; }
      presetNote.textContent =
        "Custom state - " + describeDamage() + ".";
      render();
      shell.announce(
        elementName(id) + (input.checked ? " damaged. " : " repaired. ") +
        summarise(), { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(labelText));
    host.appendChild(label);
  }

  NODES.forEach(function (node) { addToggle(nodeControls, node.id, node.name); });
  EDGES.forEach(function (edge) { addToggle(edgeControls, edge.id, edge.name); });

  function syncCheckboxes() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-toggle]"),
      function (input) {
        input.checked = Boolean(damaged[input.getAttribute("data-toggle")]);
      });
  }

  function damagedIds() {
    return Object.keys(damaged).filter(function (id) { return damaged[id]; });
  }

  function describeDamage() {
    var ids = damagedIds();
    if (ids.length === 0) { return "nothing damaged"; }
    return ids.map(elementName).join("; ") + " out of action";
  }

  function summarise() {
    return TASKS.map(function (task) {
      return task.short + ": " + OUTCOME[outcomeFor(task, damaged)].word.toLowerCase();
    }).join(". ") + ".";
  }

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    renderDiagram();
    renderChips();
    renderTaskTable();
    renderElementTable();
    renderInterpretation();
  }

  /* The diagram is planar by construction - no two pathways cross - so the
     lines can be read without following them. Damage is carried by a broken
     outline AND a cross, never by fill alone. */
  function renderDiagram() {
    var W = 96, H = 44;

    clear(diagram);

    EDGES.forEach(function (edge) {
      var a = nodeById(edge.from);
      var b = nodeById(edge.to);
      var isCut = Boolean(damaged[edge.id]);

      diagram.appendChild(svgEl("line", {
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        class: "net__edge" + (isCut ? " net__edge--cut" : "")
      }));

      if (isCut) {
        var mx = (a.x + b.x) / 2;
        var my = (a.y + b.y) / 2;
        diagram.appendChild(svgEl("circle", {
          cx: mx, cy: my, r: 9, class: "net__break"
        }));
        diagram.appendChild(
          svgText(mx, my + 4.5, "net__break-mark", "middle", "×"));
      }
    });

    NODES.forEach(function (node) {
      var isHurt = Boolean(damaged[node.id]);
      diagram.appendChild(svgEl("rect", {
        x: node.x - W / 2, y: node.y - H / 2, width: W, height: H, rx: 8,
        class: "net__node" + (isHurt ? " net__node--damaged" : "")
      }));

      var lines = node.label;
      lines.forEach(function (line, index) {
        var offset = (index - (lines.length - 1) / 2) * 14 + 4.5;
        diagram.appendChild(
          svgText(node.x, node.y + offset, "net__node-label", "middle", line));
      });

      if (isHurt) {
        diagram.appendChild(
          svgText(node.x + W / 2 - 11, node.y - H / 2 + 15,
            "net__break-mark", "middle", "×"));
      }
    });
  }

  function renderChips() {
    clear(chips);
    TASKS.forEach(function (task) {
      var outcome = OUTCOME[outcomeFor(task, damaged)];
      var li = make("li", "net__chip");
      li.setAttribute("data-mark", outcome.mark);
      li.appendChild(make("span", "net__chip-task", task.short));
      li.appendChild(make("span", "net__chip-state", outcome.word));
      chips.appendChild(li);
    });
  }

  function routeState(route) {
    if (!route) { return "no second route"; }
    var broken = route.filter(function (id) { return damaged[id]; });
    return broken.length === 0
      ? "complete"
      : "broken at " + broken.map(elementName).join(" and ");
  }

  function renderTaskTable() {
    clear(taskTable);
    TASKS.forEach(function (task) {
      var key = outcomeFor(task, damaged);
      var tr = make("tr");
      var th = make("th", null, task.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, routeState(task.main)));
      tr.appendChild(make("td", null, routeState(task.second)));
      var outcomeCell = make("td", null,
        OUTCOME[key].word +
        (key === "impaired" && task.impairedNote ? " - " + task.impairedNote : ""));
      outcomeCell.setAttribute("data-mark", OUTCOME[key].mark);
      tr.appendChild(outcomeCell);
      taskTable.appendChild(tr);
    });
  }

  function renderElementTable() {
    clear(elementTable);
    NODES.concat(EDGES).forEach(function (element) {
      var tr = make("tr");
      var th = make("th", null, element.name);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, element.label ? "Region" : "Pathway"));
      tr.appendChild(make("td", null, element.meaning));
      tr.appendChild(make("td", null,
        damaged[element.id]
          ? (element.label ? "Damaged" : "Cut")
          : "Intact"));
      elementTable.appendChild(tr);
    });
  }

  function renderInterpretation() {
    var ids = damagedIds();
    var nodesHurt = ids.filter(function (id) { return nodeById(id); });
    var edgesCut = ids.filter(function (id) { return !nodeById(id); });
    var failing = TASKS.filter(function (task) {
      return outcomeFor(task, damaged) !== "normal";
    });

    var text;
    var tone;
    var affected = (failing.length === 1 ? "One" : String(failing.length)) +
      " of the four tasks " + (failing.length === 1 ? "is" : "are");

    if (ids.length === 0) {
      tone = "good";
      text =
        "Everything intact, all four tasks normal. Damage one thing and watch " +
        "which tasks notice.";
    } else if (failing.length === 0) {
      tone = "good";
      text =
        describeDamage().charAt(0).toUpperCase() + describeDamage().slice(1) +
        ", and no task on the list notices. Damage is not the same as " +
        "deficit: it shows only if something you measure needs that part of " +
        "the network.";
    } else if (nodesHurt.length === 0) {
      tone = "warn";
      text =
        "Every region is intact. " + affected + " still not normal, because " +
        edgesCut.map(elementName).join(" and ") +
        (edgesCut.length === 1 ? " has" : " have") + " been cut. Nothing to " +
        "point at on a map of regions, and the deficit is real.";
    } else {
      tone = "caution";
      var alternatives = otherCausesOf(profileOf(damaged));
      text =
        describeDamage().charAt(0).toUpperCase() + describeDamage().slice(1) +
        ". " + affected + " affected." +
        (alternatives.length
          ? " Note that " + alternatives.length + " other single failure" +
            (alternatives.length === 1 ? "" : "s") + " would produce exactly " +
            "this profile: " + alternatives.map(elementName).join("; ") +
            ". Behaviour alone cannot choose between them."
          : " No other single failure in this network produces the same four " +
            "outcomes, which makes this profile unusually informative.");
    }

    interpretationBody.textContent = text;
    interpretation.setAttribute("data-tone", tone);
  }

  /** Every OTHER single element whose failure alone gives the same profile. */
  function otherCausesOf(profile) {
    var current = damagedIds();
    if (current.length !== 1) { return []; }
    return NODES.concat(EDGES)
      .map(function (element) { return element.id; })
      .filter(function (id) {
        if (id === current[0]) { return false; }
        var trial = {};
        trial[id] = true;
        return profileOf(trial) === profile;
      });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    output: {
      tone: "caution",
      verdict: "That would break more than this.",
      text:
        "Damage the speech-output region and naming fails too - anything that " +
        "has to come out of the mouth. This person names pictures normally. " +
        "Load the \"speech output damaged\" preset and compare."
    },
    store: {
      tone: "caution",
      verdict: "Same problem.",
      text:
        "The word-sound store is used by naming as well as by repetition, so " +
        "damaging it takes naming too. The failure has to be somewhere " +
        "repetition uses and naming does not. Look for it in the network."
    },
    pathway: {
      tone: "good",
      verdict: "Yes.",
      text:
        "The direct route from heard speech to word sounds is used by " +
        "repetition and nothing else. Cut it and repetition goes the long way " +
        "round through meaning, which works for familiar words and not for " +
        "unfamiliar ones. Every region is intact. Load the second preset."
    },
    hearing: {
      tone: "caution",
      verdict: "That would take comprehension with it.",
      text:
        "Damage that region and this person could not follow what you said " +
        "either. They can, so the incoming analysis is working and the failure " +
        "is further along. Find it in the network."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the network.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockNetwork();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockNetwork();
  });

  function unlockNetwork() {
    lockForm(openingForm);
    networkSection.hidden = false;
    render();
    $("#network-heading").focus();
    shell.announce("Network open. Everything intact.", { immediate: true });
  }

  /* --- Challenge -------------------------------------------------------- */

  CHALLENGE_OPTIONS.forEach(function (option) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = "challenge";
    input.value = option.id;
    label.appendChild(input);
    label.appendChild(document.createTextNode(option.label));
    challengeOptions.appendChild(label);
  });

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var chosen = Array.prototype.filter.call(
      challengeForm.querySelectorAll('input[name="challenge"]'),
      function (input) { return input.checked; })
      .map(function (input) { return input.value; });

    if (chosen.length === 0) {
      challengeError.textContent = "Tick at least one option before checking.";
      challengeError.hidden = false;
      return;
    }
    challengeError.hidden = true;

    var missed = CHALLENGE_OPTIONS.filter(function (option) {
      return option.correct && chosen.indexOf(option.id) === -1;
    });
    var wrong = CHALLENGE_OPTIONS.filter(function (option) {
      return !option.correct && chosen.indexOf(option.id) !== -1;
    });

    clear(challengeFeedback);

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      missed.length === 0 && wrong.length === 0
        ? "All three, and nothing else."
        : "Not the full set."));
    lead.appendChild(document.createTextNode(
      " Three single failures give this profile: damaging the word-sound " +
      "store, damaging the speech-output region, and cutting the pathway " +
      "between them. Two of the three are regions and one is not a region at " +
      "all, and the four tasks cannot tell them apart."));
    challengeFeedback.appendChild(lead);

    if (missed.length) {
      challengeFeedback.appendChild(make("p", null,
        "You left out: " + missed.map(function (o) { return o.label.toLowerCase(); })
          .join("; ") + ". Everything downstream of the word-sound store is " +
        "needed by naming, repetition and naming-from-description alike, and " +
        "by pointing not at all - so breaking any of it gives the same four " +
        "outcomes."));
    }

    if (wrong.length) {
      var why = {
        "mean-word":
          "cutting meaning off from word sounds leaves naming possible on the " +
          "direct picture-to-word route, so naming is impaired rather than " +
          "failing outright",
        hear:
          "damaging the region that analyses heard speech would take pointing " +
          "with it, and pointing is normal in this profile",
        "see-mean":
          "cutting the pathway from seeing objects to meaning would break " +
          "pointing and leave repetition alone - almost the mirror image of " +
          "this profile"
      };
      challengeFeedback.appendChild(make("p", null,
        "Not these: " + wrong.map(function (o) {
          return o.label.toLowerCase() + " - " + why[o.id];
        }).join("; ") + "."));
    }

    challengeFeedback.appendChild(make("p", "text-muted",
      "Load each of the three in the network above and compare the chips."));

    challengeFeedback.setAttribute("data-tone",
      missed.length === 0 && wrong.length === 0 ? "good" : "caution");
    challengeFeedback.hidden = false;
    shell.announce("Answer checked.", { immediate: true });
  });

  /* --- Feedback plumbing ------------------------------------------------ */

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
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (control) { control.disabled = false; });
    form.reset();
  }

  /* --- Reset ------------------------------------------------------------ */

  shell.onReset(function () {
    damaged = {};
    syncCheckboxes();
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    networkSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    presetNote.textContent = "Five states worth comparing.";
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the network.",
    { immediate: true });
})();
