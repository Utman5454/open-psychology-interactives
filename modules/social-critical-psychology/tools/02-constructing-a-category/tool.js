/* =========================================================================
   Constructing a Category / Object-Status Laboratory
   -------------------------------------------------------------------------
   Nine messy fictional accounts and five stages that turn them into a named
   condition with a boundary, an instrument, a prevalence figure and
   institutional force.

       1. Find the pattern    - which features recur, and which distinguish
       2. Name it             - what a name imports before any evidence
       3. Draw the boundary   - a threshold applied to 400 simulated people
       4. Build the instrument- five items, and who they no longer find
       5. Let it loose        - five institutional decisions, and what hardens

   THE EDUCATIONAL MODEL
   ---------------------
   Stage 1 is authored, not simulated. Each of the nine accounts carries a
   hand-written feature list; the comparison counts (how often the same
   feature appears in nine accounts from people who said nothing was hard to
   name) are authored figures chosen so that the most prevalent features -
   tiredness, poor sleep, difficulty concentrating - are the least
   distinguishing. That is the point of the stage.

   Stage 3 uses a simple simulated population. Each of 400 respondents has a
   latent "load" drawn from a standard normal (seeded mulberry32 + Box-Muller,
   seed 20260807). Feature f is present when a uniform draw falls under
   logistic(intercept_f + slope_f x latent); duration in months and an
   interference score are separate draws with the same latent in them. A
   respondent meets the criteria when the number of SELECTED features present
   reaches the threshold AND the duration and interference requirements are
   met. Nothing about the 400 people changes when the threshold moves; only
   the line does, and the prevalence figure follows the line.

   Stage 4 scores each of the nine original accounts against the chosen items:
   an account is detected when it would endorse three or more of the five.
   Accounts 7 and 9 are deliberately written so that an instrument built from
   the most obvious items misses them.

   Stage 5 keeps an "object status" index from 12 to 100. Every institutional
   decision offers an uncritical route, a route that keeps the category
   accountable, and a refusal - and one refusal moves the index down, because
   hardening is not inevitable.

   WHAT THIS IS NOT
   ----------------
   Not an argument that categories are bogus: classification is how any
   science starts, and a name for something people could not previously name
   is a real gain. Not an argument about any real diagnosis or construct - the
   category, its name, its items and its prevalence are all invented, and no
   published criteria, instrument or estimate is reproduced. Nobody is
   assessed: the questionnaire is never administered to the person using the
   tool.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     Authored material
     ===================================================================== */

  var FEATURES = [
    { id: "tired", label: "Tiredness that sleep does not fix", comparison: 5, kind: "person" },
    { id: "behind", label: "Feeling behind on things you are supposed to have seen", comparison: 1, kind: "person" },
    { id: "dread", label: "Dread before opening messages", comparison: 1, kind: "person" },
    { id: "switch", label: "Starting something new before finishing the last", comparison: 2, kind: "person" },
    { id: "late", label: "Staying up late for uninterrupted time", comparison: 2, kind: "person" },
    { id: "concentrate", label: "Difficulty concentrating for long", comparison: 5, kind: "person" },
    { id: "guilt", label: "Guilt about how the time was spent", comparison: 3, kind: "person" },
    { id: "sleep", label: "Sleeping badly", comparison: 6, kind: "person" },
    { id: "calls", label: "Avoiding phone calls", comparison: 3, kind: "person" },
    { id: "low", label: "Feeling low", comparison: 4, kind: "person" },
    { id: "money", label: "Worry about money", comparison: 5, kind: "situation" },
    { id: "hours", label: "Long or unpredictable working hours", comparison: 4, kind: "situation" }
  ];

  var ACCOUNTS = [
    {
      id: 1,
      text:
        "I am tired in a way that a weekend does not touch. There is always " +
        "something I was supposed to have read or watched or replied to, and " +
        "I start the next thing before I have finished the last one, and then " +
        "I feel bad about the evening.",
      features: ["tired", "dread", "behind", "switch", "guilt"]
    },
    {
      id: 2,
      text:
        "I get to about nine at night and realise I have not had one stretch " +
        "of quiet all day, so I stay up for it, and then I sleep badly and " +
        "cannot hold a thought together the next morning.",
      features: ["tired", "behind", "switch", "late", "concentrate", "sleep"]
    },
    {
      id: 3,
      text:
        "I do not answer the phone any more. I look at who it is and I let it " +
        "go, and then I feel a small drop when I see the notification. My " +
        "shifts move around every fortnight so I am never sure what day it is.",
      features: ["tired", "dread", "calls", "behind", "hours"]
    },
    {
      id: 4,
      text:
        "The work does not stop when I leave, it just stops being visible. I " +
        "sit down at eleven to do the bit I actually care about and then " +
        "resent the whole day for it.",
      features: ["late", "guilt", "behind", "switch", "concentrate", "hours", "tired"]
    },
    {
      id: 5,
      text:
        "It is not sadness exactly. It is that I open my messages and " +
        "something in my chest goes tight, and I am flat for an hour " +
        "afterwards, and I have not slept properly since the spring.",
      features: ["tired", "sleep", "low", "behind", "dread"]
    },
    {
      id: 6,
      text:
        "I cannot watch anything without also doing something else, and then " +
        "I have not really watched it, so I watch it again. I am always " +
        "halfway through four things.",
      features: ["switch", "concentrate", "dread", "behind", "late", "tired"]
    },
    {
      id: 7,
      text:
        "Honestly it is the hours. I do not know what I am working until the " +
        "Thursday before, so I cannot arrange anything, and the money is " +
        "never the same twice. I am shattered and I sleep in the afternoon " +
        "and then not at night.",
      features: ["hours", "money", "tired", "sleep", "calls"]
    },
    {
      id: 8,
      text:
        "There is a low hum of being behind. Not a crisis, just a hum. I open " +
        "something, do a third of it, open something else, and at the end of " +
        "the day I could not tell you what I did.",
      features: ["dread", "behind", "guilt", "switch", "concentrate", "tired"]
    },
    {
      id: 9,
      text:
        "My mother is up the road and I go every evening, and then it is ten " +
        "o'clock and that is my time, so I take it, and I am wrecked, and I " +
        "feel guilty about resenting any of it.",
      features: ["late", "hours", "tired", "guilt", "low"]
    }
  ];

  var NAMES = [
    {
      id: "none",
      label: "Do not name it yet - keep the accounts as accounts",
      frame: "None. Nine descriptions stay nine descriptions.",
      locus: "Undecided, deliberately.",
      expert: "Nobody in particular. There is no post to appoint to.",
      intervention: "None follows, because there is nothing yet to intervene on.",
      recedes:
        "Everything a name buys: funding, comparability, a way for the ninth " +
        "person to find out that the second person exists. Refusing to name " +
        "is not a neutral act either, and this option costs the most in " +
        "leverage.",
      hardening: 0
    },
    {
      id: "syndrome",
      label: "Digital Overload Syndrome",
      frame: "Medical. A syndrome is a co-occurring cluster with a course and a prognosis.",
      locus: "Inside the individual - most readers will hear \"nervous system\".",
      expert: "Clinicians, occupational health, anyone who can sign a note.",
      intervention: "Assessment, treatment, adjustment, possibly leave.",
      recedes:
        "The arrangement that produced the load. A syndrome is something a " +
        "person has; a rota is not.",
      hardening: 22
    },
    {
      id: "fatigue",
      label: "Attention Fatigue",
      frame: "Physiological metaphor. Something is being depleted and can be replenished.",
      locus: "A capacity inside the person.",
      expert: "Psychologists, wellbeing trainers, app designers.",
      intervention: "Rest, breaks, training, \"attention hygiene\".",
      recedes:
        "Whether attention is the right unit at all. The metaphor is doing " +
        "the theoretical work before any measurement has been taken.",
      hardening: 16
    },
    {
      id: "dependence",
      label: "Screen Dependence",
      frame: "Addiction, and behind it a moral vocabulary of control.",
      locus: "The person's habits and willpower.",
      expert: "Behaviour-change specialists; also, immediately, everyone with an opinion.",
      intervention: "Limits, abstinence, self-monitoring, digital detox.",
      recedes:
        "Why the demands exist and who benefits from them. Account 7 is about " +
        "a rota, and this name has no place to put it.",
      hardening: 20
    },
    {
      id: "overwhelm",
      label: "Chronic Low-grade Overwhelm",
      frame: "Experiential and descriptive. It says what it is like, not what it is.",
      locus: "Left open on purpose.",
      expert: "Whoever the person chooses to tell.",
      intervention: "None implied, which is honest and also unhelpful to a committee.",
      recedes:
        "Traction. A name that commits to nothing is hard to argue with and " +
        "hard to act on, and a funder will pass over it.",
      hardening: 8
    },
    {
      id: "poverty",
      label: "Time Poverty",
      frame: "Distributional. A resource, unequally held.",
      locus: "How hours are shared out, not what is happening in a head.",
      expert: "Economists, policy analysts, unions.",
      intervention: "Rotas, hours, entitlements, notice periods.",
      recedes:
        "What it is like from the inside. Account 5's tight chest has nowhere " +
        "to go in a distributional vocabulary.",
      hardening: 14
    }
  ];

  var ITEMS = [
    { id: "i1", text: "I put off opening my messages.", feature: "dread" },
    { id: "i2", text: "I feel behind on things I am expected to have seen.", feature: "behind" },
    { id: "i3", text: "I start something new before finishing the last thing.", feature: "switch" },
    { id: "i4", text: "I stay up late to get time to myself.", feature: "late" },
    { id: "i5", text: "I am tired even after a full night's sleep.", feature: "tired" },
    { id: "i6", text: "I find it hard to concentrate for long.", feature: "concentrate" },
    { id: "i7", text: "I feel guilty about how I spent the evening.", feature: "guilt" },
    { id: "i8", text: "I sleep badly.", feature: "sleep" },
    { id: "i9", text: "My working hours are long or unpredictable.", feature: "hours" },
    { id: "i10", text: "I feel low.", feature: "low" }
  ];

  var EVENTS = [
    {
      id: "training",
      text:
        "A training company asks to license your criteria for a one-day " +
        "awareness course, sold to employers.",
      options: [
        {
          id: "a", label: "Licence it as it stands", delta: 18,
          consequence:
            "Within a year, several hundred managers have been told that this " +
            "is a recognised thing with a checklist. The checklist travels " +
            "without the paper it came from.",
          lost: "Whether the criteria were the right ones stops being a live question."
        },
        {
          id: "b", label: "Licence it, on condition that the criteria and the threshold are printed in the materials", delta: 10,
          consequence:
            "The course still spreads the category, but every participant can " +
            "see that a line was drawn and where.",
          lost: "Less than in the first option, and the company grumbles about the slide."
        },
        {
          id: "c", label: "Decline", delta: 2,
          consequence:
            "The category stays inside the research group. So does whatever " +
            "use it might have been to the nine people.",
          lost: "Reach. Refusing is a choice with costs too."
        }
      ]
    },
    {
      id: "survey",
      text:
        "A large employer wants to add your five items to its annual staff " +
        "survey.",
      options: [
        {
          id: "a", label: "Agree", delta: 18,
          consequence:
            "The category now generates a number every year. Numbers that " +
            "arrive annually acquire trends, and trends acquire targets.",
          lost: "The possibility that the five items were the wrong five."
        },
        {
          id: "b", label: "Agree, on condition that workload and rota items go into the same survey", delta: 8,
          consequence:
            "The annual number now sits beside the conditions it might follow " +
            "from, so somebody can at least ask which moves first.",
          lost: "Simplicity. The employer wanted one figure."
        },
        {
          id: "c", label: "Decline", delta: 2,
          consequence:
            "No annual figure. Also no evidence, which is what the next " +
            "funding application will need.",
          lost: "The chance to see whether the category behaves sensibly over time."
        }
      ]
    },
    {
      id: "manager",
      text:
        "A manager asks whether an employee's score can be used to decide who " +
        "gets flexible hours.",
      options: [
        {
          id: "a", label: "Yes", delta: 22,
          consequence:
            "The instrument is now a gate. People learn what it rewards, and " +
            "answer accordingly - which quietly destroys it as a measure while " +
            "increasing its authority.",
          lost: "Any reading of the score as a description rather than an entitlement."
        },
        {
          id: "b", label: "No, but offer department-level distributions", delta: 6,
          consequence:
            "The figures now describe teams rather than sorting individuals, " +
            "which is a different object and a different politics.",
          lost: "Nothing much, except the manager's preferred use."
        },
        {
          id: "c", label: "Refuse any individual use in writing", delta: 0,
          consequence:
            "The boundary between a research construct and an administrative " +
            "criterion is held, for now, by one letter in one file.",
          lost: "Goodwill, and probably the next contract."
        }
      ]
    },
    {
      id: "press",
      text:
        "A newspaper wants to report your prevalence figure.",
      options: [
        {
          id: "a", label: "Give them the headline number", delta: 20,
          consequence:
            "\"One in five\" enters circulation. It will be quoted for a " +
            "decade, usually without the criteria and always without the " +
            "threshold.",
          lost: "That the figure was manufactured by a decision you made in stage 3."
        },
        {
          id: "b", label: "Give the number with the criteria and the range across thresholds", delta: 8,
          consequence:
            "The piece is duller and one sub-editor is annoyed. The range " +
            "makes the manufactured character of the figure visible to anyone " +
            "who reads to the end.",
          lost: "The headline."
        },
        {
          id: "c", label: "Decline to give a figure", delta: 2,
          consequence:
            "Somebody else supplies one. It is worse, and it has your name " +
            "attached to it anyway.",
          lost: "Control of the number without control of the story."
        }
      ]
    },
    {
      id: "funder",
      text:
        "A research funder opens a call for studies on your category - and, in " +
        "the same round, turns down a proposal on working-hours regulation.",
      options: [
        {
          id: "a", label: "Apply to the call", delta: 20,
          consequence:
            "The category now has a funding stream. Careers begin to depend " +
            "on it existing, and the field's evidence base becomes evidence " +
            "about the category rather than about the problem.",
          lost: "The working-hours question, which was account 7's whole account."
        },
        {
          id: "b", label: "Apply, and build in a comparison with a workload account", delta: 8,
          consequence:
            "The category is funded but made to compete. If it explains " +
            "nothing that hours and notice periods do not, the study can say so.",
          lost: "Some of the elegance, and a reviewer will call it unfocused."
        },
        {
          id: "c", label: "Write to the funder objecting to the framing", delta: -4,
          consequence:
            "The call is not withdrawn, but the objection is on record and two " +
            "other applicants cite it. The category loses a little of its air " +
            "of inevitability.",
          lost: "Your place in that funding round."
        }
      ]
    }
  ];

  var STATUS_BANDS = [
    { min: 0, label: "A description somebody wrote down" },
    { min: 25, label: "A working construct inside one research group" },
    { min: 45, label: "A term with users outside the group" },
    { min: 65, label: "A thing people are said to have" },
    { min: 85, label: "An administrative fact" }
  ];

  /* =======================================================================
     The simulated population
     -------------------------------------------------------------------
     Seeded so that every figure quoted in the teaching notes is reproducible.
     ===================================================================== */

  var SEED = 20260807;
  var N = 400;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function boxMuller(rand) {
    var u = 1 - rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function logistic(x) { return 1 / (1 + Math.exp(-x)); }

  /* Intercept sets the base rate of a feature; slope sets how strongly it
     tracks the latent load. Both are chosen so that the authored comparison
     counts in stage 1 and the simulated base rates tell the same story. */
  var FEATURE_PARAMS = {
    tired: { intercept: 0.3, slope: 1.1 },
    behind: { intercept: -0.6, slope: 1.6 },
    dread: { intercept: -1.1, slope: 1.6 },
    switch: { intercept: -0.5, slope: 1.4 },
    late: { intercept: -0.9, slope: 1.3 },
    concentrate: { intercept: -0.2, slope: 1.0 },
    guilt: { intercept: -0.7, slope: 1.2 },
    sleep: { intercept: 0.0, slope: 0.8 },
    calls: { intercept: -1.2, slope: 0.9 },
    low: { intercept: -0.8, slope: 0.9 },
    money: { intercept: -0.3, slope: 0.4 },
    hours: { intercept: -0.7, slope: 0.6 }
  };

  var POPULATION = (function build() {
    var rand = mulberry32(SEED);
    var people = [];
    for (var i = 0; i < N; i += 1) {
      var latent = boxMuller(rand);
      var person = { features: {}, months: 0, interference: 0 };
      FEATURES.forEach(function (feature) {
        var p = FEATURE_PARAMS[feature.id];
        person.features[feature.id] =
          rand() < logistic(p.intercept + p.slope * latent);
      });
      person.months = Math.max(0, Math.round(3 + 3.2 * latent + 1.5 * boxMuller(rand)));
      person.interference = 2 + 1.25 * latent + boxMuller(rand);
      people.push(person);
    }
    return people;
  })();

  var DURATION_RULE = { none: 0, short: 1, long: 6 };
  var IMPAIRMENT_RULE = { none: -99, some: 2.5, marked: 4 };

  function countFeatures(person, selected) {
    var total = 0;
    selected.forEach(function (id) {
      if (person.features[id]) { total += 1; }
    });
    return total;
  }

  /**
   * Classify the simulated population under the current criteria.
   * "Just outside" means failing by exactly one condition: one feature short,
   * or the duration alone, or the interference alone.
   */
  function classify(selected, threshold, duration, impairment) {
    var months = DURATION_RULE[duration];
    var cut = IMPAIRMENT_RULE[impairment];
    var bands = { meets: 0, near: 0, outside: 0 };
    POPULATION.forEach(function (person) {
      var count = countFeatures(person, selected);
      var okFeatures = count >= threshold;
      var okMonths = person.months >= months;
      var okInterference = person.interference >= cut;
      var failures =
        (okFeatures ? 0 : 1) + (okMonths ? 0 : 1) + (okInterference ? 0 : 1);
      if (failures === 0) {
        bands.meets += 1;
      } else if (failures === 1 && (okFeatures || count === threshold - 1)) {
        bands.near += 1;
      } else {
        bands.outside += 1;
      }
    });
    return bands;
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

  function featureById(id) {
    return FEATURES.filter(function (f) { return f.id === id; })[0];
  }

  function nameById(id) {
    return NAMES.filter(function (n) { return n.id === id; })[0];
  }

  function inSetCount(featureId) {
    return ACCOUNTS.filter(function (account) {
      return account.features.indexOf(featureId) !== -1;
    }).length;
  }

  function pct(count) {
    return Math.round((count / N) * 1000) / 10 + "%";
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#category-lab");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };
  var $$ = function (selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  };

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var labSection = $("#lab-section");

  var accountsList = $("[data-accounts]");
  var accountsCompact = $("[data-accounts-compact]");
  var featureChoices = $("[data-feature-choices]");
  var nameChoices = $("[data-name-choices]");
  var itemChoices = $("[data-item-choices]");
  var eventChoices = $("[data-event-choices]");

  var featureTable = $("[data-feature-table]");
  var featureVerdict = $("[data-feature-verdict]");
  var nameVerdict = $("[data-name-verdict]");
  var nameCompare = $("[data-name-compare]");
  var prevalenceLine = $("[data-prevalence]");
  var boundarySvg = $("[data-boundary]");
  var boundaryTable = $("[data-boundary-table]");
  var boundaryNote = $("[data-boundary-note]");
  var sensitivityTable = $("[data-sensitivity-table]");
  var detectTable = $("[data-detect-table]");
  var detectNote = $("[data-detect-note]");
  var statusLabel = $("[data-status-label]");
  var statusSvg = $("[data-status]");
  var statusText = $("[data-status-text]");
  var consequences = $("[data-consequences]");
  var gateNote = $("[data-gate-note]");
  var stageTrack = $("[data-stage-track]");

  var claimsForm = $("#claims-form");
  var claimsList = $("[data-claims-list]");
  var claimsFeedback = $("[data-claims-feedback]");

  var thresholdRange = $("#threshold-range");
  var durationSelect = $("#duration-select");
  var impairmentSelect = $("#impairment-select");

  var INITIAL = {
    stage: 1,
    unlocked: false,
    selected: [],
    name: null,
    threshold: 3,
    duration: "short",
    impairment: "some",
    items: [],
    events: {}
  };
  var state = null;

  /* --- Static material ---------------------------------------------------- */

  function buildAccounts() {
    [accountsList, accountsCompact].forEach(function (list) {
      clear(list);
      ACCOUNTS.forEach(function (account) {
        var item = make("li", "account");
        item.appendChild(make("p", "account__text", account.text));
        list.appendChild(item);
      });
    });
  }

  function buildFeatureChoices() {
    clear(featureChoices);
    FEATURES.forEach(function (feature) {
      var label = make("label", "control--choice feature-option");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = feature.id;
      input.addEventListener("change", function () {
        if (input.checked) {
          if (state.selected.indexOf(feature.id) === -1) {
            state.selected.push(feature.id);
          }
        } else {
          state.selected = state.selected.filter(function (id) {
            return id !== feature.id;
          });
        }
        render();
        shell.announce(state.selected.length + " features selected.");
      });
      label.appendChild(input);
      var body = make("span", "feature-option__body");
      body.appendChild(make("span", null, feature.label));
      body.appendChild(make("span", "feature-option__counts",
        "in " + inSetCount(feature.id) + " of the 9; in " + feature.comparison +
        " of 9 comparisons"));
      label.appendChild(body);
      featureChoices.appendChild(label);
    });
  }

  function buildNameChoices() {
    clear(nameChoices);
    NAMES.forEach(function (entry) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "category-name";
      input.value = entry.id;
      input.addEventListener("change", function () {
        state.name = entry.id;
        render();
        shell.announce("Named: " + entry.label + ".", { immediate: true });
      });
      label.appendChild(input);
      label.appendChild(make("span", null, entry.label));
      nameChoices.appendChild(label);
    });
  }

  function buildItemChoices() {
    clear(itemChoices);
    ITEMS.forEach(function (item) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = item.id;
      input.addEventListener("change", function () {
        if (input.checked) {
          if (state.items.length >= 5) {
            input.checked = false;
            shell.announce("Five items is the limit. Remove one first.",
              { immediate: true });
            return;
          }
          state.items.push(item.id);
        } else {
          state.items = state.items.filter(function (id) { return id !== item.id; });
        }
        render();
      });
      label.appendChild(input);
      label.appendChild(make("span", null, item.text));
      itemChoices.appendChild(label);
    });
  }

  function buildEventChoices() {
    clear(eventChoices);
    EVENTS.forEach(function (event) {
      var group = make("fieldset", "event");
      var legend = make("legend", "event__legend", event.text);
      group.appendChild(legend);
      event.options.forEach(function (option) {
        var label = make("label", "control--choice event__option");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "event-" + event.id;
        input.value = option.id;
        input.addEventListener("change", function () {
          state.events[event.id] = option.id;
          render();
          shell.announce(option.consequence);
        });
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      eventChoices.appendChild(group);
    });
  }

  /* --- Stage 1 ------------------------------------------------------------ */

  function distinguishing(feature) {
    return inSetCount(feature.id) - feature.comparison;
  }

  function renderStage1() {
    clear(featureTable);
    if (!state.selected.length) {
      var row = make("tr");
      var cell = make("td", null,
        "Nothing selected yet. Every feature in the list appears in these " +
        "accounts; the question is which of them appear here and not " +
        "elsewhere.");
      cell.colSpan = 4;
      row.appendChild(cell);
      featureTable.appendChild(row);
      featureVerdict.textContent =
        "Select at least three features to continue.";
      featureVerdict.setAttribute("data-state", "none");
      return;
    }

    state.selected.forEach(function (id) {
      var feature = featureById(id);
      var diff = distinguishing(feature);
      var row = make("tr");
      var th = make("th", null, feature.label);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, String(inSetCount(id)) + " of 9"));
      row.appendChild(make("td", null, String(feature.comparison) + " of 9"));
      row.appendChild(make("td", null,
        diff >= 3 ? "distinguishes"
          : diff >= 1 ? "weakly"
          : diff === 0 ? "no - equally common"
          : "no - commoner in the comparisons"));
      featureTable.appendChild(row);
    });

    var strong = state.selected.filter(function (id) {
      return distinguishing(featureById(id)) >= 3;
    }).length;
    var weakOrNone = state.selected.length - strong;
    var coverage = ACCOUNTS.filter(function (account) {
      var hits = account.features.filter(function (f) {
        return state.selected.indexOf(f) !== -1;
      }).length;
      return hits >= 2;
    }).length;
    var hasSituation = state.selected.some(function (id) {
      return featureById(id).kind === "situation";
    });

    var text =
      "Your set covers " + coverage + " of the 9 accounts (at least two " +
      "features present). " + strong + " of your " + state.selected.length +
      " features distinguish this group from the comparisons; " + weakOrNone +
      (weakOrNone === 1 ? " does not, or barely does." : " do not, or barely do.");
    if (weakOrNone > strong) {
      text += " Most of what you have chosen is common to everybody, which " +
        "will make the category easy to meet and hard to defend.";
    }
    text += hasSituation
      ? " You have included a feature of an arrangement rather than of a " +
        "person. That points the category outwards: the eventual intervention " +
        "becomes a rota rather than a course."
      : " Every feature you have chosen is a property of a person. Nothing " +
        "made you do that - two features on the list describe conditions - and " +
        "it has already decided what the intervention will be aimed at.";

    featureVerdict.textContent = text;
    featureVerdict.setAttribute("data-state",
      strong >= 2 && coverage >= 6 ? "ok" : "tension");
  }

  /* --- Stage 2 ------------------------------------------------------------ */

  function renderStage2() {
    clear(nameVerdict);
    clear(nameCompare);
    if (!state.name) {
      nameVerdict.appendChild(make("p", "verdict__body",
        "Choose a name. Nothing about the nine accounts will change; " +
        "everything about what happens next will."));
      return;
    }
    var entry = nameById(state.name);
    nameVerdict.setAttribute("data-tone", entry.id === "none" ? "neutral" : "caution");
    nameVerdict.appendChild(make("h5", "verdict__title", entry.label));
    [
      ["Frame it imports", entry.frame],
      ["Where it locates the problem", entry.locus],
      ["Who becomes the expert", entry.expert],
      ["What intervention follows", entry.intervention],
      ["What recedes", entry.recedes]
    ].forEach(function (pair) {
      var p = make("p", "verdict__body");
      p.appendChild(make("strong", null, pair[0] + ": "));
      p.appendChild(document.createTextNode(pair[1]));
      nameVerdict.appendChild(p);
    });

    nameCompare.setAttribute("data-tone", "neutral");
    nameCompare.appendChild(make("h5", "verdict__title",
      "The same nine accounts, under the other names"));
    NAMES.forEach(function (other) {
      if (other.id === entry.id) { return; }
      var p = make("p", "verdict__body");
      p.appendChild(make("strong", null, other.label + ": "));
      p.appendChild(document.createTextNode(
        other.intervention + " " + "Expert: " + other.expert));
      nameCompare.appendChild(p);
    });
    nameCompare.appendChild(make("p", "verdict__note",
      "No evidence has been collected, and the intervention has already " +
      "changed five times."));
  }

  /* --- Stage 3 ------------------------------------------------------------ */

  function renderStage3() {
    /* The threshold range is deliberately NOT clamped to the number of
       features selected. Setting a threshold higher than the number of
       features is a real thing criteria writers do by accident, it produces a
       prevalence of zero, and the note below says so. */
    var selected = state.selected;
    syncThresholdOutput();

    var bands = classify(selected, state.threshold, state.duration, state.impairment);
    var label = state.name && state.name !== "none"
      ? nameById(state.name).label : "the category";

    prevalenceLine.textContent =
      pct(bands.meets) + " of the 400 simulated respondents meet the criteria for " +
      label + " (" + bands.meets + " people).";

    clear(boundaryTable);
    [
      ["Meets the criteria", bands.meets],
      ["Just outside - fails by one condition", bands.near],
      ["Clearly outside", bands.outside]
    ].forEach(function (pair) {
      var row = make("tr");
      var th = make("th", null, pair[0]);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, String(pair[1])));
      row.appendChild(make("td", null, pct(pair[1])));
      boundaryTable.appendChild(row);
    });

    drawBoundary(bands);

    /* Sensitivity: the same population, every threshold. */
    clear(sensitivityTable);
    var values = [];
    for (var t = 1; t <= 6; t += 1) {
      var band = classify(selected, t, state.duration, state.impairment);
      values.push(band.meets);
      var row = make("tr");
      var th = make("th", null, String(t));
      th.setAttribute("scope", "row");
      row.appendChild(th);
      var td = make("td", null, pct(band.meets) + " (" + band.meets + " people)");
      if (t === state.threshold) { td.setAttribute("data-emphasis", "yes"); }
      row.appendChild(td);
      sensitivityTable.appendChild(row);
    }

    var spread = values.length
      ? pct(Math.max.apply(null, values)) + " down to " + pct(Math.min.apply(null, values))
      : "n/a";
    boundaryNote.textContent =
      (state.threshold > selected.length
        ? "Your threshold asks for more features than you selected, so nobody " +
          "can meet it. Criteria are written this way more often than you would " +
          "hope. "
        : "") +
      "Not one of the 400 answers changed when you moved that slider. Across " +
      "the six thresholds the prevalence runs from " + spread +
      ". A prevalence figure is a report of where somebody drew a line, and it " +
      "is only interpretable alongside the line.";
    boundaryNote.setAttribute("data-state", "tension");
  }

  function drawBoundary(bands) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 320;
    var H = 96;
    clear(boundarySvg);
    var rows = [
      { label: "Meets", value: bands.meets, cls: "band band--meets", pattern: "solid" },
      { label: "Just outside", value: bands.near, cls: "band band--near", pattern: "hatched" },
      { label: "Outside", value: bands.outside, cls: "band band--outside", pattern: "open" }
    ];
    var y = 6;
    rows.forEach(function (row) {
      var track = document.createElementNS(NS, "rect");
      track.setAttribute("x", "78");
      track.setAttribute("y", String(y));
      track.setAttribute("width", "228");
      track.setAttribute("height", "18");
      track.setAttribute("class", "chart__track");
      boundarySvg.appendChild(track);

      var bar = document.createElementNS(NS, "rect");
      bar.setAttribute("x", "78");
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", String(Math.max(1, (row.value / N) * 228)));
      bar.setAttribute("height", "18");
      bar.setAttribute("class", row.cls);
      boundarySvg.appendChild(bar);

      var text = document.createElementNS(NS, "text");
      text.setAttribute("x", "74");
      text.setAttribute("y", String(y + 13));
      text.setAttribute("text-anchor", "end");
      text.setAttribute("class", "chart__label");
      text.textContent = row.label;
      boundarySvg.appendChild(text);

      var count = document.createElementNS(NS, "text");
      count.setAttribute("x", String(78 + Math.max(1, (row.value / N) * 228) + 5));
      count.setAttribute("y", String(y + 13));
      count.setAttribute("class", "chart__count");
      count.textContent = String(row.value);
      boundarySvg.appendChild(count);

      y += 28;
    });
  }

  /* --- Stage 4 ------------------------------------------------------------ */

  function renderStage4() {
    clear(detectTable);
    var chosen = ITEMS.filter(function (item) {
      return state.items.indexOf(item.id) !== -1;
    });
    if (chosen.length < 5) {
      var row = make("tr");
      var cell = make("td", null,
        "Choose five items. " + chosen.length + " of 5 chosen.");
      cell.colSpan = 3;
      row.appendChild(cell);
      detectTable.appendChild(row);
      detectNote.textContent =
        "The instrument does not exist yet, so nobody is inside or outside it.";
      detectNote.setAttribute("data-state", "none");
      return;
    }

    var missed = [];
    ACCOUNTS.forEach(function (account) {
      var endorsed = chosen.filter(function (item) {
        return account.features.indexOf(item.feature) !== -1;
      });
      var detected = endorsed.length >= 3;
      if (!detected) { missed.push(account.id); }
      var row = make("tr");
      var th = make("th", null, "Account " + account.id);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, String(endorsed.length) + " of 5"));
      row.appendChild(make("td", null, detected ? "detected" : "not detected"));
      detectTable.appendChild(row);
    });

    var overlap = chosen.filter(function (item) {
      return state.selected.indexOf(item.feature) !== -1;
    }).length;

    var text = missed.length
      ? "Your instrument does not find account" + (missed.length === 1 ? " " : "s ") +
        missed.join(", ") + ". Those people described something. " +
        "Administratively they now do not have it, which is the opposite of " +
        "what the category was built to provide."
      : "Your instrument finds all nine. Check what that cost: an instrument " +
        "wide enough to catch every account will also catch a great many " +
        "people who were not describing anything in particular.";

    text += " " + overlap + " of your 5 items restate a feature you used to " +
      "define the category" +
      (overlap >= 4
        ? ", so the questionnaire cannot fail to confirm the criteria. That is " +
          "not evidence of validity; it is the criteria written twice."
        : ", which keeps at least some daylight between the definition and the " +
          "measure.");

    detectNote.textContent = text;
    detectNote.setAttribute("data-state", missed.length || overlap >= 4 ? "tension" : "ok");
  }

  /* --- Stage 5 ------------------------------------------------------------ */

  function statusIndex() {
    var base = 12;
    if (state.name) { base += nameById(state.name).hardening; }
    EVENTS.forEach(function (event) {
      var chosen = state.events[event.id];
      if (!chosen) { return; }
      event.options.forEach(function (option) {
        if (option.id === chosen) { base += option.delta; }
      });
    });
    return Math.max(0, Math.min(100, base));
  }

  function bandFor(value) {
    var current = STATUS_BANDS[0];
    STATUS_BANDS.forEach(function (band) {
      if (value >= band.min) { current = band; }
    });
    return current;
  }

  function renderStage5() {
    var value = statusIndex();
    var band = bandFor(value);
    var answered = Object.keys(state.events).length;

    statusLabel.textContent = band.label + " (" + value + " of 100).";

    var NS = "http://www.w3.org/2000/svg";
    clear(statusSvg);
    var track = document.createElementNS(NS, "rect");
    track.setAttribute("x", "8"); track.setAttribute("y", "18");
    track.setAttribute("width", "304"); track.setAttribute("height", "20");
    track.setAttribute("class", "chart__track");
    statusSvg.appendChild(track);

    var bar = document.createElementNS(NS, "rect");
    bar.setAttribute("x", "8"); bar.setAttribute("y", "18");
    bar.setAttribute("width", String(Math.max(2, value * 3.04)));
    bar.setAttribute("height", "20");
    bar.setAttribute("class", "chart__bar");
    statusSvg.appendChild(bar);

    STATUS_BANDS.forEach(function (entry) {
      if (entry.min === 0) { return; }
      var tick = document.createElementNS(NS, "line");
      tick.setAttribute("x1", String(8 + entry.min * 3.04));
      tick.setAttribute("x2", String(8 + entry.min * 3.04));
      tick.setAttribute("y1", "14"); tick.setAttribute("y2", "42");
      tick.setAttribute("class", "chart__grid");
      statusSvg.appendChild(tick);
    });

    var caption = document.createElementNS(NS, "text");
    caption.setAttribute("x", "8"); caption.setAttribute("y", "58");
    caption.setAttribute("class", "chart__axis");
    caption.textContent = "0 = a description  |  100 = an administrative fact";
    statusSvg.appendChild(caption);

    statusText.textContent =
      "Object status " + value + " of 100: " + band.label.toLowerCase() + ". " +
      answered + " of 5 decisions taken. The index is a teaching device, not a " +
      "measurement of anything.";

    clear(consequences);
    EVENTS.forEach(function (event) {
      var chosen = state.events[event.id];
      if (!chosen) { return; }
      var option = event.options.filter(function (o) { return o.id === chosen; })[0];
      var li = make("li", "consequence");
      li.appendChild(make("p", "consequence__choice", option.label));
      li.appendChild(make("p", "consequence__text", option.consequence));
      var lost = make("p", "consequence__lost");
      lost.appendChild(make("strong", null, "What stops being asked: "));
      lost.appendChild(document.createTextNode(option.lost));
      li.appendChild(lost);
      consequences.appendChild(li);
    });

    if (answered === EVENTS.length) {
      var li2 = make("li", "consequence consequence--final");
      li2.appendChild(make("p", "consequence__text",
        "Nothing new has been discovered since stage 1. The nine accounts are " +
        "unchanged. What has changed is that there is now a name, a line, an " +
        "instrument, a figure and a set of people whose work depends on the " +
        "category being the kind of thing it is taken to be. That is what " +
        "reification looks like from the inside: not an error anybody made, " +
        "but a sequence of individually reasonable decisions."));
      consequences.appendChild(li2);
    }
  }

  /* --- Stage plumbing ------------------------------------------------------ */

  var GATES = [
    null,
    function () {
      return state.selected.length >= 3
        ? null : "Select at least three features before continuing.";
    },
    function () {
      return state.name ? null : "Choose a name - including the option not to name it yet.";
    },
    function () { return null; },
    function () {
      return state.items.length === 5
        ? null : "Choose exactly five items (" + state.items.length + " chosen).";
    },
    function () { return null; }
  ];

  var STAGE_COUNT = 5;

  function setStage(next) {
    state.stage = Math.max(1, Math.min(STAGE_COUNT, next));
    render();
    var heading = $('.stage__primary[data-stage="' + state.stage + '"] .stage__heading');
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
    shell.announce("Stage " + state.stage + " of 5.", { immediate: true });
  }

  $('[data-action="next"]').addEventListener("click", function () {
    var blocked = GATES[state.stage] ? GATES[state.stage]() : null;
    if (blocked) {
      gateNote.textContent = blocked;
      shell.announce(blocked, { immediate: true });
      return;
    }
    gateNote.textContent = "";
    setStage(state.stage + 1);
  });

  $('[data-action="prev"]').addEventListener("click", function () {
    gateNote.textContent = "";
    setStage(state.stage - 1);
  });

  function render() {
    // Controls and stage blocks for the active stage only.
    $$("[data-stage]", shell.root).forEach(function (node) {
      if (node.parentNode === stageTrack) { return; }
      node.hidden = node.getAttribute("data-stage") !== String(state.stage);
    });
    $$("[data-secondary]", shell.root).forEach(function (node) {
      node.hidden = node.getAttribute("data-secondary") !== String(state.stage);
    });
    $$("li", stageTrack).forEach(function (node) {
      var index = Number(node.getAttribute("data-stage"));
      node.removeAttribute("aria-current");
      node.removeAttribute("data-state");
      if (index === state.stage) {
        node.setAttribute("aria-current", "step");
      } else if (index < state.stage) {
        node.setAttribute("data-state", "done");
      }
    });

    $('[data-action="prev"]').disabled = state.stage === 1;
    $('[data-action="next"]').disabled = state.stage === 5;

    renderStage1();
    renderStage2();
    renderStage3();
    renderStage4();
    renderStage5();
  }

  /* --- Stage 3 controls ----------------------------------------------------- */

  shell.bindRange("#threshold-range", {
    format: function (value) { return String(value); },
    describe: function (value) {
      return value + " of the selected features must be present";
    },
    onInput: function (value) {
      // bindRange syncs once at registration, before the first reset has
      // created the state object.
      if (!state) { return; }
      state.threshold = value;
      renderStage3();
    }
  });

  /* The maximum threshold depends on how many features are selected, so the
     input's value can change without an `input` event. bindRange only refreshes
     its <output> on input or on reset, so the display is synced here too. */
  var thresholdOutput = document.querySelector('output[for="threshold-range"]');

  function syncThresholdOutput() {
    if (thresholdOutput) { thresholdOutput.textContent = String(state.threshold); }
    thresholdRange.setAttribute(
      "aria-valuetext",
      state.threshold + " of the selected features must be present");
  }

  durationSelect.addEventListener("change", function () {
    state.duration = durationSelect.value;
    renderStage3();
    shell.announce("Duration requirement changed.");
  });

  impairmentSelect.addEventListener("change", function () {
    state.impairment = impairmentSelect.value;
    renderStage3();
    shell.announce("Interference requirement changed.");
  });

  /* --- Challenge ------------------------------------------------------------ */

  var CLAIM_OPTIONS = [
    { value: "finding", label: "A finding" },
    { value: "decision", label: "A decision reported as a finding" },
    { value: "unsupportable", label: "Not supportable by this work at all" }
  ];

  var CLAIMS = [
    {
      id: "prevalence",
      text: "\"Roughly one in five adults has it.\"",
      judge: function () {
        return {
          answer: "decision",
          verdict: "A decision reported as a finding.",
          why:
            "The figure follows from the threshold, the duration rule and the " +
            "interference rule you set in stage 3. Move any of the three and " +
            "the figure moves, without one simulated person changing an " +
            "answer. The sentence is not false; it is incomplete in a way that " +
            "makes it read as a discovery."
        };
      }
    },
    {
      id: "sleep",
      text: "\"People who meet the criteria sleep worse than people who do not.\"",
      judge: function () {
        var circular = state.selected.indexOf("sleep") !== -1;
        return {
          answer: circular ? "decision" : "finding",
          verdict: circular
            ? "A decision reported as a finding - because you made poor sleep one of the criteria."
            : "A finding, and a weak one.",
          why: circular
            ? "Sleeping badly is one of the features that puts somebody inside " +
              "the boundary, so the comparison is between people selected partly " +
              "for sleeping badly and people not so selected. The result was " +
              "guaranteed in stage 1. Criterion contamination of this kind is " +
              "common and rarely flagged."
            : "You did not use sleep as a criterion, so the association is not " +
              "built in. It is still only an association in one simulated " +
              "cross-section, and both could follow from the hours."
        };
      }
    },
    {
      id: "hours",
      text: "\"It is more common among people with long or unpredictable hours.\"",
      judge: function () {
        var circular = state.selected.indexOf("hours") !== -1;
        return {
          answer: circular ? "decision" : "finding",
          verdict: circular
            ? "A decision reported as a finding - hours are one of your criteria."
            : "A finding.",
          why: circular
            ? "You included working hours among the defining features, so " +
              "people with difficult hours are more likely to be inside the " +
              "boundary by construction. Note how attractive this sentence is: " +
              "it looks like the social explanation, and it is an artefact of " +
              "your own definition."
            : "Hours played no part in defining the category, so an association " +
              "with hours is informative - and it points at an arrangement " +
              "rather than at a person."
        };
      }
    },
    {
      id: "early",
      text: "\"Early identification allows earlier intervention.\"",
      judge: function () {
        return {
          answer: "unsupportable",
          verdict: "Not supportable by this work at all.",
          why:
            "Nothing here establishes that the category has a course, that " +
            "earlier is better, or that any intervention works. Three separate " +
            "claims, smuggled in by one familiar sentence."
        };
      }
    },
    {
      id: "distinct",
      text: "\"The nine accounts show that it is a distinct condition.\"",
      judge: function () {
        return {
          answer: "unsupportable",
          verdict: "Not supportable by this work at all.",
          why:
            "The nine accounts are the material the category was made from. " +
            "They cannot also be the evidence that it carves anything at a " +
            "joint. Distinctness is what the comparison column in stage 1 was " +
            "for, and most of the commonest features failed it."
        };
      }
    }
  ];

  var CLAIM_LABELS = {};
  CLAIM_OPTIONS.forEach(function (o) { CLAIM_LABELS[o.value] = o.label; });

  function buildClaims() {
    clear(claimsList);
    CLAIMS.forEach(function (claim, index) {
      var group = make("fieldset", "prediction__group");
      group.appendChild(make("legend", "prediction__legend",
        "Claim " + (index + 1) + ". " + claim.text));
      CLAIM_OPTIONS.forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "claim-" + claim.id;
        input.value = option.value;
        label.appendChild(input);
        label.appendChild(make("span", null, option.label));
        group.appendChild(label);
      });
      claimsList.appendChild(group);
    });
  }

  claimsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!state.unlocked) {
      showFeedback(claimsFeedback, "caution", "Build the category first.",
        "Two of these are judged against the decisions you made in the " +
        "laboratory, so they cannot be marked before it has been opened.");
      return;
    }
    var answers = CLAIMS.map(function (claim) {
      var picked = $('input[name="claim-' + claim.id + '"]:checked', claimsForm);
      return picked ? picked.value : null;
    });
    if (answers.indexOf(null) !== -1) {
      showFeedback(claimsFeedback, "caution", "One judgement per claim, please.",
        "A blank is not a verdict.");
      return;
    }

    var judged = CLAIMS.map(function (claim) { return claim.judge(); });
    var right = 0;
    judged.forEach(function (result, index) {
      if (result.answer === answers[index]) { right += 1; }
    });

    clear(claimsFeedback);
    claimsFeedback.setAttribute("data-tone", right >= 4 ? "good" : "caution");
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      right + " of 5 judgements match."));
    lead.appendChild(document.createTextNode(
      " Claims 2 and 3 are judged against your own stage 1 selection, not " +
      "against a stored key: a different set of features gives different " +
      "verdicts, which is the point."));
    claimsFeedback.appendChild(lead);

    var list = make("ol", "claims__results");
    CLAIMS.forEach(function (claim, index) {
      var li = make("li");
      var agreed = answers[index] === judged[index].answer;
      li.setAttribute("data-agreed", agreed ? "yes" : "no");
      var head = make("p", "claims__result-head");
      head.appendChild(make("strong", null,
        "Claim " + (index + 1) + ": " + judged[index].verdict));
      head.appendChild(document.createTextNode(
        agreed ? " That is what you said."
          : " You said: " + CLAIM_LABELS[answers[index]].toLowerCase() + "."));
      li.appendChild(head);
      li.appendChild(make("p", null, judged[index].why));
      list.appendChild(li);
    });
    claimsFeedback.appendChild(list);
    claimsFeedback.hidden = false;
    shell.announce("Five claims judged. " + right + " match.", { immediate: true });
  });

  /* --- Opening prediction ---------------------------------------------------- */

  var OPENING = {
    real: {
      tone: "caution",
      verdict: "Not while the boundary is adjustable.",
      text:
        "There is presumably something going on in the population. But the " +
        "figure the team reports is produced by the criteria they choose, and " +
        "in stage 3 you will watch it move by a factor of five without one " +
        "simulated person changing an answer."
    },
    accounts: {
      tone: "caution",
      verdict: "Representativeness matters, but not most.",
      text:
        "The nine accounts decide what the category is about. They do not " +
        "decide how many people it catches - that is settled later, by a " +
        "threshold, and the threshold is a decision rather than a discovery."
    },
    threshold: {
      tone: "good",
      verdict: "Yes, and by more than most people expect.",
      text:
        "Stage 3 holds the 400 simulated respondents completely fixed and moves " +
        "only the line. Watch the sensitivity table under the chart: the same " +
        "population, the same answers, and a prevalence that ranges across most " +
        "of the plausible reporting space."
    },
    instrument: {
      tone: "caution",
      verdict: "The instrument decides who, not how many.",
      text:
        "A questionnaire changes which people are found - and stage 4 shows two " +
        "of the original nine dropping out of their own category. The headline " +
        "figure is settled a stage earlier, by the boundary."
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
    render();
    shell.announce("Laboratory open at stage 1.", { immediate: true });
  }

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the laboratory.";
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

  /* --- Worked example -------------------------------------------------------- */

  $('[data-action="worked"]').addEventListener("click", function () {
    state.selected = ["behind", "dread", "switch", "late", "tired"];
    state.name = "fatigue";
    state.threshold = 3;
    state.duration = "short";
    state.impairment = "some";
    state.items = ["i1", "i2", "i3", "i4", "i5"];
    /* Deliberately the accountable route at every step: the point of the
       worked example is that a category hardens a long way even when nobody
       does anything careless. */
    state.events = { training: "b", survey: "b", manager: "b", press: "b", funder: "b" };
    state.stage = 5;
    syncControls();
    render();
    shell.announce(
      "Worked example loaded: a person-focused feature set, a physiological " +
      "name, a three-feature threshold and the five most obvious items. Object " +
      "status " + statusIndex() + " of 100. Go back to stage 1 and add working " +
      "hours to see how much of this changes.",
      { immediate: true });
  });

  function syncControls() {
    $$("input[type=checkbox]", featureChoices).forEach(function (input) {
      input.checked = state.selected.indexOf(input.value) !== -1;
    });
    $$("input[type=radio]", nameChoices).forEach(function (input) {
      input.checked = input.value === state.name;
    });
    $$("input[type=checkbox]", itemChoices).forEach(function (input) {
      input.checked = state.items.indexOf(input.value) !== -1;
    });
    $$("input[type=radio]", eventChoices).forEach(function (input) {
      var eventId = input.name.replace("event-", "");
      input.checked = state.events[eventId] === input.value;
    });
    thresholdRange.value = String(state.threshold);
    durationSelect.value = state.duration;
    impairmentSelect.value = state.impairment;
  }

  /* --- Reset and start-up ------------------------------------------------------ */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    labSection.hidden = true;
    gateNote.textContent = "";
    claimsForm.reset();
    claimsFeedback.hidden = true;
    syncControls();
    render();
  });

  buildAccounts();
  buildFeatureChoices();
  buildNameChoices();
  buildItemChoices();
  buildEventChoices();
  buildClaims();

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Read the nine accounts, then answer the question above.",
    { immediate: true });
})();
