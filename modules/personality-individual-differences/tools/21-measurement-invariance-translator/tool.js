/* =========================================================================
   Measurement-Invariance Translator
   -------------------------------------------------------------------------
   Two fictional groups, four original items, and every parameter students
   need in order to break invariance one level at a time. The graphics come
   first and the technical vocabulary arrives only once the picture has been
   understood.

   THE EDUCATIONAL MODEL
   ---------------------
   For group g and item i, the observed item mean is

       mean(i, g) = intercept(i, g)  +  loading(i, g) · latentMean(g)

   and the item's relationship to the latent trait is the loading. Residual
   variability adds noise around that mean without changing it.

   The three levels are then exactly three claims about those parameters:

     configural   the same items load on the same single factor in both
                  groups. Nothing is required to be equal.
     metric       loadings are equal across groups. Licences comparison of
                  RELATIONSHIPS — correlations, regressions — because a unit
                  of the latent trait now means the same amount of item in
                  both groups.
     scalar       loadings AND intercepts are equal. Licences comparison of
                  MEANS, because an observed difference can now be attributed
                  to the latent trait rather than to the items behaving
                  differently.

   THE ITEM THAT CARRIES THE POINT
   -------------------------------
   "I speak up when I disagree in a group" is given a movable intercept. Two
   people with identical assertiveness can endorse it at different rates if
   speaking up carries different costs in their setting — a workplace where
   dissent is invited versus one where it is not. That is intercept
   non-invariance: the item is systematically easier or harder to endorse at
   the same level of the trait. It is not a difference in the trait, and it is
   exactly what comparing raw means would misread as one.

   HOW THE TOOL DECIDES WHICH LEVEL HOLDS
   --------------------------------------
   Directly from the parameters, with a tolerance:

     metric holds  when every loading differs by less than TOL across groups
     scalar holds  when metric holds AND every intercept does too

   No model is fitted, no fit index is invented, and no p-value is produced —
   because inventing one would teach students to expect a number where real
   invariance testing gives a judgement built from nested model comparison.

   WHAT IS DELIBERATELY ABSENT
   ---------------------------
   The two groups are labelled Group A and Group B and are given no
   nationality, ethnicity, language, region or culture. The item-difficulty
   example is framed in terms of a SETTING — whether dissent is invited — not
   a people. Every value on the page is a parameter a student set, and the
   page says so.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var TOL = 0.04;

  var ITEMS = [
    {
      id: "speak",
      text: "I speak up when I disagree with the group",
      note: "The item whose intercept you can move. Speaking up costs more in some settings than others."
    },
    { id: "lead", text: "I take charge when a group has no direction", note: "" },
    { id: "opinion", text: "I give my opinion without being asked", note: "" },
    { id: "stand", text: "I hold my position when others push back", note: "" }
  ];

  /* =======================================================================
     Model
     ===================================================================== */

  function itemMean(loading, intercept, latentMean) {
    return intercept + loading * latentMean;
  }

  function levels(state) {
    var metric = ITEMS.every(function (item, i) {
      return Math.abs(state.loadingsA[i] - state.loadingsB[i]) < TOL;
    });
    var scalar = metric && ITEMS.every(function (item, i) {
      return Math.abs(state.interceptsA[i] - state.interceptsB[i]) < TOL;
    });
    return { configural: true, metric: metric, scalar: scalar };
  }

  /** Observed scale mean for a group: the average of its item means. */
  function observedMean(loadings, intercepts, latentMean) {
    return ITEMS.reduce(function (total, item, i) {
      return total + itemMean(loadings[i], intercepts[i], latentMean);
    }, 0) / ITEMS.length;
  }

  /**
   * The observed difference expressed in latent-trait units.
   *
   * Observed means are in item-score units and latent means are in
   * trait units, so the two are never numerically equal even when everything
   * is perfectly invariant — an observed gap of 0.45 with a mean loading of
   * 0.74 IS a latent gap of 0.60. Dividing by the mean loading puts them on
   * one scale, which is what makes "the difference you would report is not the
   * difference that exists" a fair comparison rather than a unit confusion.
   */
  function impliedLatentDifference(state) {
    var meanLoading = ITEMS.reduce(function (total, item, i) {
      return total + (state.loadingsA[i] + state.loadingsB[i]) / 2;
    }, 0) / ITEMS.length;
    if (meanLoading < 0.05) { return null; }
    var observed =
      observedMean(state.loadingsB, state.interceptsB, state.latentB) -
      observedMean(state.loadingsA, state.interceptsA, state.latentA);
    return observed / meanLoading;
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function fmt(v, p) {
    return v === null || v === undefined || isNaN(v) ? "—" : v.toFixed(p === undefined ? 2 : p);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#invariance");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var controlsHost = $("[data-parameter-controls]");
  var lineChart = $("[data-line-chart]");
  var lineTable = $("[data-line-table]");
  var ladder = $("[data-ladder]");
  var verdictBox = $("[data-verdict]");
  var meansNote = $("[data-means-note]");
  var readout = $("[data-readout]");
  var presetNote = $("[data-preset-note]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#translator-section");

  var challengeForm = $("#challenge-form");
  var challengeFeedback = $("[data-challenge-feedback]");

  var PRESETS = {
    full: {
      name: "Everything equal",
      note: "Same loadings, same intercepts. Both groups also have the same latent mean, so nothing differs anywhere.",
      loadingsA: [0.80, 0.75, 0.70, 0.72], loadingsB: [0.80, 0.75, 0.70, 0.72],
      interceptsA: [3.0, 3.0, 3.0, 3.0], interceptsB: [3.0, 3.0, 3.0, 3.0],
      latentA: 0, latentB: 0
    },
    truemean: {
      name: "A real difference in the trait",
      note: "Loadings and intercepts identical; group B genuinely sits higher on the latent trait. This is the case where comparing means is defensible.",
      loadingsA: [0.80, 0.75, 0.70, 0.72], loadingsB: [0.80, 0.75, 0.70, 0.72],
      interceptsA: [3.0, 3.0, 3.0, 3.0], interceptsB: [3.0, 3.0, 3.0, 3.0],
      latentA: 0, latentB: 0.6
    },
    intercept: {
      name: "The speaking-up item behaves differently",
      note: "Loadings equal, but the first item is harder to endorse in group A at the same level of the trait. Latent means are identical — and the observed means are not.",
      loadingsA: [0.80, 0.75, 0.70, 0.72], loadingsB: [0.80, 0.75, 0.70, 0.72],
      interceptsA: [2.3, 3.0, 3.0, 3.0], interceptsB: [3.0, 3.0, 3.0, 3.0],
      latentA: 0, latentB: 0
    },
    loading: {
      name: "The item measures differently",
      note: "The first item relates much more weakly to the trait in group A. Even relationships are now not comparable, so metric invariance fails.",
      loadingsA: [0.30, 0.75, 0.70, 0.72], loadingsB: [0.80, 0.75, 0.70, 0.72],
      interceptsA: [3.0, 3.0, 3.0, 3.0], interceptsB: [3.0, 3.0, 3.0, 3.0],
      latentA: 0, latentB: 0
    }
  };

  var INITIAL = {
    loadingsA: [0.80, 0.75, 0.70, 0.72],
    loadingsB: [0.80, 0.75, 0.70, 0.72],
    interceptsA: [3.0, 3.0, 3.0, 3.0],
    interceptsB: [3.0, 3.0, 3.0, 3.0],
    latentA: 0,
    latentB: 0,
    activeItem: 0,
    stage: "predict"
  };
  var state = null;

  /* Two registries, because the two kinds of slider have different lifetimes.
     The latent-mean sliders exist in the markup and are bound once. The item
     parameter sliders are generated, and are rebuilt every time the translator
     is unlocked — so their syncs have to be discarded and re-registered, or
     each rebuild would leave stale handlers pointing at removed elements. */
  var baseSyncs = [];
  var itemSyncs = [];

  function bindRange(input, options, registry) {
    var settings = options || {};
    var output = page.querySelector('output[for="' + input.id + '"]');
    function sync() {
      var value = Number(input.value);
      if (output) {
        output.textContent = settings.format ? settings.format(value) : String(value);
      }
      input.setAttribute("aria-valuetext",
        (settings.describe || settings.format || String)(value));
      if (settings.onInput) { settings.onInput(value); }
    }
    input.addEventListener("input", sync);
    (registry || baseSyncs).push(sync);
    return sync;
  }

  function syncRanges() {
    baseSyncs.concat(itemSyncs).forEach(function (s) { s(); });
  }

  /* --- Build the parameter controls -------------------------------------- */

  /* One item's four sliders at a time.
     Sixteen sliders in one column runs to well over two screens: the learner
     scrolls down to reach item 4's intercept and the picture it changes has
     gone off the top. The parameters are all still here and all still live —
     the selector decides which set is on screen, and the chart always shows
     every item, so the comparison the tool is about is never hidden. */
  function buildControls() {
    clear(controlsHost);
    // Discard the previous generation's syncs along with their elements.
    itemSyncs = [];

    var groups = [];

    var chooser = make("fieldset", "param-chooser");
    var chooserLegend = make("legend", "param-chooser__legend", "Item to adjust");
    chooser.appendChild(chooserLegend);
    controlsHost.appendChild(chooser);

    function showItem(index) {
      state.activeItem = index;
      groups.forEach(function (group, i) { group.hidden = i !== index; });
    }

    ITEMS.forEach(function (item, index) {
      var group = make("fieldset", "param-group");
      var legend = make("legend", "param-group__name");
      legend.textContent = "Item " + (index + 1) + ": " + item.text;
      group.appendChild(legend);
      if (item.note) {
        group.appendChild(make("p", "param-group__note", item.note));
      }

      [
        ["loadingsA", "Loading, group A", 0, 100, 1],
        ["loadingsB", "Loading, group B", 0, 100, 1],
        ["interceptsA", "Intercept, group A", 100, 500, 5],
        ["interceptsB", "Intercept, group B", 100, 500, 5]
      ].forEach(function (spec) {
        var key = spec[0];
        var id = key + "-" + index;
        var isLoading = key.indexOf("loading") === 0;

        var control = make("div", "control");
        var header = make("div", "control__header");
        var label = make("label", "control__label", spec[1]);
        label.setAttribute("for", id);
        var output = document.createElement("output");
        output.className = "control__value";
        output.setAttribute("for", id);
        header.appendChild(label);
        header.appendChild(output);

        var input = document.createElement("input");
        input.type = "range";
        input.id = id;
        input.min = String(spec[2]);
        input.max = String(spec[3]);
        input.step = String(spec[4]);
        input.value = String(Math.round(state[key][index] * 100));

        control.appendChild(header);
        control.appendChild(input);
        group.appendChild(control);

        bindRange(input, {
          format: function (v) { return (v / 100).toFixed(2); },
          describe: function (v) {
            return spec[1] + " " + (v / 100).toFixed(2) +
              (isLoading
                ? ", how strongly this item relates to the trait"
                : ", how readily this item is endorsed at an average level of the trait");
          },
          onInput: function (v) { state[key][index] = v / 100; render(); }
        }, itemSyncs);
      });

      controlsHost.appendChild(group);
      groups.push(group);

      var choice = make("label", "control--choice");
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "active-item";
      radio.value = String(index);
      radio.checked = index === state.activeItem;
      radio.addEventListener("change", function () {
        if (!radio.checked) { return; }
        showItem(index);
        shell.announce("Now adjusting item " + (index + 1) + ": " + item.text + ".");
      });
      choice.appendChild(radio);
      choice.appendChild(document.createTextNode(
        "Item " + (index + 1) + ": " + item.text));
      chooser.appendChild(choice);
    });

    showItem(state.activeItem);
  }

  bindRange($("#latent-a"), {
    format: function (v) { return (v / 100).toFixed(2); },
    describe: function (v) { return "group A latent mean " + (v / 100).toFixed(2); },
    onInput: function (v) { state.latentA = v / 100; render(); }
  });

  bindRange($("#latent-b"), {
    format: function (v) { return (v / 100).toFixed(2); },
    describe: function (v) { return "group B latent mean " + (v / 100).toFixed(2); },
    onInput: function (v) { state.latentB = v / 100; render(); }
  });

  Array.prototype.forEach.call(page.querySelectorAll("[data-preset]"), function (button) {
    button.addEventListener("click", function () {
      var preset = PRESETS[button.getAttribute("data-preset")];
      state.loadingsA = preset.loadingsA.slice();
      state.loadingsB = preset.loadingsB.slice();
      state.interceptsA = preset.interceptsA.slice();
      state.interceptsB = preset.interceptsB.slice();
      state.latentA = preset.latentA;
      state.latentB = preset.latentB;
      applyState();
      render();
      presetNote.textContent = preset.note;
      shell.announce(preset.name + " loaded. " + preset.note, { immediate: true });
    });
  });

  function applyState() {
    ITEMS.forEach(function (_, index) {
      $("#loadingsA-" + index).value = String(Math.round(state.loadingsA[index] * 100));
      $("#loadingsB-" + index).value = String(Math.round(state.loadingsB[index] * 100));
      $("#interceptsA-" + index).value = String(Math.round(state.interceptsA[index] * 100));
      $("#interceptsB-" + index).value = String(Math.round(state.interceptsB[index] * 100));
    });
    $("#latent-a").value = String(Math.round(state.latentA * 100));
    $("#latent-b").value = String(Math.round(state.latentB * 100));
    syncRanges();
  }

  /* --- Rendering ------------------------------------------------------------ */

  function render() {
    if (mainSection.hidden) { return; }
    renderLines();
    renderLadder();
    renderReadout();
    renderVerdict();
  }

  /* The central graphic: for each item, a line per group showing how the
     expected answer rises with the latent trait. Two lines that lie on top of
     each other mean the item behaves identically. A vertical gap is an
     intercept difference; a difference in slope is a loading difference. */
  function renderLines() {
    var NS = "http://www.w3.org/2000/svg";
    var COLS = 2;
    var W = 460;
    var PANEL = 206;
    var H = Math.ceil(ITEMS.length / COLS) * (PANEL + 30) + 10;
    var PAD = 34;

    clear(lineChart);
    lineChart.setAttribute("viewBox", "0 0 " + W + " " + H);

    ITEMS.forEach(function (item, index) {
      var col = index % COLS;
      var row = Math.floor(index / COLS);
      var left = col * (W / COLS) + PAD;
      var top = row * (PANEL + 30) + 22;
      var size = W / COLS - PAD - 16;
      var plot = PANEL - 40;

      var xAt = function (trait) { return left + ((trait + 1.5) / 3) * size; };
      var yAt = function (value) { return top + (1 - (value - 1) / 4) * plot; };

      var title = document.createElementNS(NS, "text");
      title.setAttribute("x", String(left));
      title.setAttribute("y", String(top - 8));
      title.setAttribute("class", "chart__label");
      title.textContent = "Item " + (index + 1);
      lineChart.appendChild(title);

      var frame = document.createElementNS(NS, "rect");
      frame.setAttribute("x", String(left));
      frame.setAttribute("y", String(top));
      frame.setAttribute("width", String(size));
      frame.setAttribute("height", String(plot));
      frame.setAttribute("class", "chart__track");
      lineChart.appendChild(frame);

      [["A", state.loadingsA[index], state.interceptsA[index]],
       ["B", state.loadingsB[index], state.interceptsB[index]]].forEach(function (g) {
        var line = document.createElementNS(NS, "line");
        line.setAttribute("x1", String(xAt(-1.5)));
        line.setAttribute("y1", String(yAt(itemMean(g[1], g[2], -1.5))));
        line.setAttribute("x2", String(xAt(1.5)));
        line.setAttribute("y2", String(yAt(itemMean(g[1], g[2], 1.5))));
        line.setAttribute("class", "inv__line inv__line--" + g[0].toLowerCase());
        lineChart.appendChild(line);

        var tag = document.createElementNS(NS, "text");
        tag.setAttribute("x", String(xAt(1.5) - 2));
        tag.setAttribute("y", String(yAt(itemMean(g[1], g[2], 1.5)) - 4));
        tag.setAttribute("text-anchor", "end");
        tag.setAttribute("class", "chart__axis");
        tag.textContent = g[0];
        lineChart.appendChild(tag);
      });

      var axis = document.createElementNS(NS, "text");
      axis.setAttribute("x", String(left + size / 2));
      axis.setAttribute("y", String(top + plot + 16));
      axis.setAttribute("text-anchor", "middle");
      axis.setAttribute("class", "chart__axis");
      axis.textContent = "latent trait →";
      lineChart.appendChild(axis);
    });

    clear(lineTable);
    ITEMS.forEach(function (item, index) {
      var row = make("tr");
      var th = make("th", null, "Item " + (index + 1));
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, fmt(state.loadingsA[index])));
      row.appendChild(make("td", null, fmt(state.loadingsB[index])));
      row.appendChild(make("td", null, fmt(state.interceptsA[index])));
      row.appendChild(make("td", null, fmt(state.interceptsB[index])));
      var loadingDiff = Math.abs(state.loadingsA[index] - state.loadingsB[index]);
      var interceptDiff = Math.abs(state.interceptsA[index] - state.interceptsB[index]);
      row.appendChild(
        make("td", null,
          loadingDiff >= TOL && interceptDiff >= TOL ? "slope and level differ"
            : loadingDiff >= TOL ? "slope differs"
            : interceptDiff >= TOL ? "level differs"
            : "identical"));
      lineTable.appendChild(row);
    });
  }

  /* The ladder, shown as three plain statements before any jargon. */
  function renderLadder() {
    var held = levels(state);
    clear(ladder);

    [
      {
        plain: "The same four items measure one thing in both groups.",
        technical: "Configural invariance",
        holds: held.configural,
        licences: "You may say the construct has the same shape in both groups."
      },
      {
        plain: "Each item relates to the trait by the same amount in both groups.",
        technical: "Metric invariance",
        holds: held.metric,
        licences: "You may compare relationships — correlations and regression coefficients."
      },
      {
        plain: "Each item is endorsed to the same degree at the same level of the trait.",
        technical: "Scalar invariance",
        holds: held.scalar,
        licences: "You may compare means."
      }
    ].forEach(function (rung) {
      var item = make("li", "ladder__rung");
      item.setAttribute("data-holds", rung.holds ? "yes" : "no");
      item.appendChild(make("p", "ladder__plain", rung.plain));
      var meta = make("p", "ladder__meta");
      meta.appendChild(make("span", "ladder__status",
        rung.holds ? "Holds" : "Does not hold"));
      meta.appendChild(make("span", "ladder__technical", rung.technical));
      item.appendChild(meta);
      item.appendChild(make("p", "ladder__licence", rung.licences));
      ladder.appendChild(item);
    });
  }

  function renderReadout() {
    clear(readout);
    var meanA = observedMean(state.loadingsA, state.interceptsA, state.latentA);
    var meanB = observedMean(state.loadingsB, state.interceptsB, state.latentB);
    [
      ["Group A observed mean", fmt(meanA)],
      ["Group B observed mean", fmt(meanB)],
      ["Observed difference", fmt(meanB - meanA) + " points"],
      ["Difference you would report", fmt(impliedLatentDifference(state))],
      ["True latent difference", fmt(state.latentB - state.latentA)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  function renderVerdict() {
    var held = levels(state);
    // Compared in latent units throughout, so the two figures are on one
    // scale and a discrepancy means non-invariance rather than unit mismatch.
    var observed = impliedLatentDifference(state);
    var latent = state.latentB - state.latentA;

    var text;
    var tone;

    if (!held.metric) {
      tone = "warn";
      text =
        "At least one item relates to the trait differently in the two groups, " +
        "so a unit of the trait does not correspond to the same amount of item " +
        "on both sides. Nothing may be compared yet — not means, and not " +
        "correlations either. The first job is to find out which item, and why.";
    } else if (!held.scalar) {
      tone = "warn";
      text =
        "Loadings match, so relationships are comparable: a correlation " +
        "between this scale and something else means the same thing in both " +
        "groups. Intercepts do not match, so means are not comparable. The " +
        "observed difference is " + fmt(observed) + " while the true latent " +
        "difference is " + fmt(latent) + " — " +
        (Math.abs(latent) < 0.01 && Math.abs(observed) > 0.05
          ? "an entirely manufactured gap between groups that do not differ on the trait at all."
          : "the gap you would report is not the gap that exists.");
    } else {
      tone = "good";
      text =
        "Loadings and intercepts both match, so the items behave identically " +
        "in the two groups. The observed difference of " + fmt(observed) +
        " can be attributed to the latent trait, where the true difference is " +
        fmt(latent) + ". This is the only configuration in which comparing " +
        "means is defensible.";
    }

    verdictBox.textContent = text;
    verdictBox.setAttribute("data-tone", tone);

    meansNote.textContent =
      observed === null
        ? "The loadings are too close to zero for the observed scores to say " +
          "anything about the latent trait."
        : Math.abs(observed - latent) < 0.03
        ? "Put on the same scale, the difference you would report (" +
          fmt(observed) + ") matches the difference that exists (" +
          fmt(latent) + "). Nothing is being distorted by the items."
        : "Put on the same scale, the difference you would report (" +
          fmt(observed) + ") and the difference that exists (" + fmt(latent) +
          ") disagree by " + fmt(Math.abs(observed - latent)) + ". That gap is " +
          "produced entirely by the item parameters, not by the groups.";
  }

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    real: {
      tone: "caution",
      verdict: "Not yet.",
      text:
        "A difference in observed scores has at least two possible sources: " +
        "the groups really differ on the trait, or the items behave " +
        "differently in the two groups. Comparing means assumes the second has " +
        "been ruled out, and ruling it out is a separate piece of work."
    },
    items: {
      tone: "good",
      verdict: "Yes — that is the question invariance testing answers.",
      text:
        "Before a mean difference can be interpreted, someone has to show that " +
        "the items mean the same thing in both groups. Otherwise you cannot " +
        "tell a difference in the trait from a difference in how the questions " +
        "land. The tool below is where that gets tested."
    },
    bias: {
      tone: "caution",
      verdict: "The word is doing too much work.",
      text:
        "\"Bias\" in this context has a technical meaning — that the measure " +
        "functions differently across groups — and it is established by " +
        "evidence rather than asserted from content. It is also not an " +
        "accusation about anybody's intentions. The levels below are how the " +
        "claim gets tested."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the translator.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    buildControls();
    applyState();
    render();
    $("#translator-heading").focus();
    shell.announce("Translator unlocked.", { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    state.stage = "explore";
    mainSection.hidden = false;
    buildControls();
    applyState();
    render();
    shell.announce("Translator unlocked.", { immediate: true });
  });

  /* --- Challenge ----------------------------------------------------------------
     Which comparisons survive at each level. */

  var CHALLENGE = {
    structure: { level: "configural", text: "Whether the same items hang together as one construct." },
    correlations: { level: "metric", text: "Correlations and regression coefficients involving the scale." },
    means: { level: "scalar", text: "Group averages on the scale." },
    individuals: { level: "never", text: "Which individual in group A is higher than which individual in group B." }
  };

  challengeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var checked = Array.prototype.slice.call(
      challengeForm.querySelectorAll('input[name="challenge"]:checked'));
    if (!checked.length) {
      showFeedback(challengeFeedback, "caution", "Select at least one.", "");
      return;
    }

    var held = levels(state);
    var chosen = checked.map(function (c) { return c.value; });

    var defensible = chosen.filter(function (id) {
      var need = CHALLENGE[id].level;
      if (need === "configural") { return held.configural; }
      if (need === "metric") { return held.metric; }
      if (need === "scalar") { return held.scalar; }
      return false;
    });

    clear(challengeFeedback);
    challengeFeedback.hidden = false;
    challengeFeedback.setAttribute(
      "data-tone",
      defensible.length === chosen.length ? "good" : "caution");

    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      defensible.length + " of your " + chosen.length +
      " selections are defensible at the invariance level currently holding."));
    challengeFeedback.appendChild(lead);

    chosen.forEach(function (id) {
      var entry = CHALLENGE[id];
      var need = entry.level;
      var ok = defensible.indexOf(id) !== -1;

      var explanation;
      if (need === "never") {
        explanation =
          "This one is never licensed by invariance testing at all: invariance " +
          "is about group-level parameters, and it says nothing about ranking " +
          "two individuals from different groups against each other.";
      } else {
        explanation =
          "Requires " + need + " invariance, which currently " +
          (held[need] ? "holds." : "does not hold.");
      }

      var p = make("p", "evidence__item");
      p.appendChild(make("strong", null, ok ? "Defensible. " : "Not defensible. "));
      p.appendChild(page.createTextNode(entry.text + " " + explanation));
      challengeFeedback.appendChild(p);
    });

    challengeFeedback.appendChild(
      make("p", null,
        "The ladder is cumulative and it is not all-or-nothing. Failing scalar " +
        "invariance does not make a dataset useless — it means means are off " +
        "the table while relationships remain available. Reporting which level " +
        "was reached, and which comparisons were therefore made, is the honest " +
        "form."));

    shell.announce("Challenge answered.", { immediate: true });
  });

  function showFeedback(container, tone, verdict, text) {
    clear(container);
    container.setAttribute("data-tone", tone);
    var p = make("p");
    p.appendChild(make("strong", "feedback__verdict", verdict));
    if (text) { p.appendChild(page.createTextNode(" " + text)); }
    container.appendChild(p);
    container.hidden = false;
  }

  function lockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = true; });
  }

  function unlockForm(form) {
    Array.prototype.forEach.call(form.querySelectorAll("input, button"),
      function (c) { c.disabled = false; });
    form.reset();
  }

  /* --- Reset ---------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mainSection.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    presetNote.textContent =
      "Four configurations. Each one is a different answer to \"can these two " +
      "groups be compared?\"";
    // The generated controls are discarded; buildControls() re-creates them,
    // and itemSyncs with them, when the translator is next unlocked.
    clear(controlsHost);
    itemSyncs = [];
    $("#latent-a").value = "0";
    $("#latent-b").value = "0";
    syncRanges();
  });

  /* --- Start-up ------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the translator.", { immediate: true });
})();
