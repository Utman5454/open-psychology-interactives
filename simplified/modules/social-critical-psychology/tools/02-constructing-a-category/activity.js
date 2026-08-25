/**
 * Where the Prevalence Comes From  (Simplified Edition)
 *
 * Teaching job: a classification acquires the appearance of a natural object
 * when it acquires a line and an instrument, and neither of those was
 * discovered. Socially constructed does not mean made up.
 *
 * Two mechanisms are kept from the full Constructing a Category, and they are
 * the two that do the work:
 *
 *   THE THRESHOLD, applied to four hundred simulated people. Each has a latent
 *   load drawn from a standard normal; feature f is present when a uniform
 *   draw falls under the logistic of intercept_f + slope_f * latent. Nothing
 *   about the four hundred changes when the control moves. Only the line does,
 *   and the prevalence follows the line: 82.3 per cent of them are cases at
 *   two features and 6.3 per cent at six.
 *
 *   THE INSTRUMENT, three items chosen from the six features, with somebody
 *   counted when they would endorse at least two of the three. The five
 *   original accounts are authored, not simulated, and two of them are written
 *   so that an instrument built from the features that sound most like the
 *   condition misses them: both describe difficulty arising from hours and
 *   obligations rather than from anything inside the person.
 *
 * THE FACT THE ACTIVITY TURNS ON, verified exhaustively over all twenty
 * three-item instruments rather than asserted: NO instrument finds all five
 * people. The best available finds four, only two of the twenty manage it, and
 * the obvious one finds three and misses exactly the two structural accounts.
 *
 * WHAT WAS CUT. The naming stage, the comparison set that shows which features
 * fail to distinguish anything, the separate duration and interference rules,
 * and the fifth stage in which institutional decisions harden the category.
 * The line and the instrument are the two places where a description acquires
 * object status most visibly, and the synthesis names the rest.
 *
 * WHAT THIS IS NOT, and the page says all of it: not an argument that
 * categories are bogus, since classification is how any science starts and a
 * name for something previously unnameable is a real gain; not an argument
 * about any real diagnosis or construct, since the category, its features, its
 * instrument and its prevalence are all invented and no published criteria or
 * estimate is reproduced; and nobody is assessed, since the questionnaire is
 * never administered to the reader.
 *
 * One simplification worth naming in the code as well as on the page: the four
 * hundred are generated from a single latent dimension, which is what makes
 * the line look so plainly arbitrary. A category with genuine natural joints
 * would not behave this way, and whether a given category has them is an
 * empirical question this cannot settle.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var POPULATION = 400;
  var SEED = 20260807;
  var ITEMS_ALLOWED = 3;
  var ENDORSE_TO_COUNT = 2;

  /* intercept and slope on the latent load. The first two are common and
     weakly related to it, which is why they sound like the condition and
     distinguish least. */
  var FEATURES = [
    { key: "sleep", text: "Sleeping badly", intercept: 0.85, slope: 0.35 },
    { key: "focus", text: "Finding it hard to concentrate", intercept: 0.80, slope: 0.40 },
    { key: "messages", text: "Dreading opening your messages", intercept: -0.20, slope: 1.15 },
    { key: "late", text: "Staying up late for an hour of quiet", intercept: -0.35, slope: 1.05 },
    { key: "hours", text: "Having no hours that belong to you", intercept: -0.45, slope: 1.20 },
    { key: "ending", text: "Never being able to say when work has ended", intercept: -0.30, slope: 1.10 }
  ];

  /* The three that sound most like the condition, which is what the guided
     button loads. They are the two commonest features plus the one that names
     a feeling, and between them they miss both structural accounts. */
  var OBVIOUS = ["sleep", "focus", "messages"];

  /* Authored, not simulated. Accounts 3 and 5 describe difficulty that comes
     from hours and obligations rather than from anything inside the person. */
  var ACCOUNTS = [
    { name: "Person 1",
      said: "I cannot switch off. I lie there going over it, and by the morning I have not rested and cannot hold a thought.",
      features: ["sleep", "focus", "messages"] },
    { name: "Person 2",
      said: "I sleep badly and I lose the thread halfway through things. The only hour that is mine is after midnight.",
      features: ["sleep", "focus", "late"] },
    { name: "Person 3",
      said: "There is no point in the week that is mine. It never finishes, it just pauses, so I take the quiet at one in the morning.",
      features: ["hours", "ending", "late"] },
    { name: "Person 4",
      said: "I dread the messages. I stay up late so that nobody can add anything, and then I sleep badly.",
      features: ["sleep", "messages", "late"] },
    { name: "Person 5",
      said: "I am on call in every direction and nobody has ever said when it stops. I sleep badly because of it, not the other way round.",
      features: ["hours", "ending", "sleep"] }
  ];

  function mulberry32(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normals(random, n) {
    var out = [];
    while (out.length < n) {
      var u = Math.max(random(), 1e-12);
      var v = random();
      var mag = Math.sqrt(-2 * Math.log(u));
      out.push(mag * Math.cos(2 * Math.PI * v));
      out.push(mag * Math.sin(2 * Math.PI * v));
    }
    return out.slice(0, n);
  }

  /* Generated once. The control never regenerates anybody. */
  var PEOPLE = (function () {
    var random = mulberry32(SEED);
    var latent = normals(random, POPULATION);
    var out = [];
    for (var i = 0; i < POPULATION; i += 1) {
      var has = [];
      for (var f = 0; f < FEATURES.length; f += 1) {
        var z = FEATURES[f].intercept + FEATURES[f].slope * latent[i];
        has.push(random() < 1 / (1 + Math.exp(-z)));
      }
      out.push(has);
    }
    return out;
  }());

  var COUNTS = PEOPLE.map(function (has) {
    return has.filter(Boolean).length;
  });

  function atLeast(n) {
    return COUNTS.filter(function (c) { return c >= n; }).length;
  }

  function prevalence(n) { return atLeast(n) / POPULATION; }

  function threshold() { return Number(thresholdInput.value); }

  function endorsedBy(account, items) {
    return items.filter(function (key) {
      return account.features.indexOf(key) >= 0;
    });
  }

  function isFound(account, items) {
    return endorsedBy(account, items).length >= ENDORSE_TO_COUNT;
  }

  function foundCount(items) {
    return ACCOUNTS.filter(function (a) { return isFound(a, items); }).length;
  }

  /** The best any three-item instrument can do, computed rather than written
      down, so the claim on the page cannot drift from the data. */
  var BEST_POSSIBLE = (function () {
    var best = 0;
    var keys = FEATURES.map(function (f) { return f.key; });
    for (var a = 0; a < keys.length; a += 1) {
      for (var b = a + 1; b < keys.length; b += 1) {
        for (var c = b + 1; c < keys.length; c += 1) {
          var n = foundCount([keys[a], keys[b], keys[c]]);
          if (n > best) { best = n; }
        }
      }
    }
    return best;
  }());

  function featureByKey(key) {
    var found = null;
    FEATURES.forEach(function (f) { if (f.key === key) { found = f; } });
    return found;
  }

  /* ------------------------------------------------------------------ dom */

  var accountsBody, options, verdict, verdictText, revealBtn;
  var cardLine, thresholdInput, readout, chart, chartDesc, lineSentence, toBuildBtn;
  var cardInstrument, itemBox, foundBox, detectBody, detectCaption, instrumentSentence;
  var obviousBtn, explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var selected = [];
  var moves = 0;

  var VERDICTS = {
    line: { state: "correct", text:
      "Correct, and the size of the effect is the surprising part. The same " +
      "four hundred people below give a prevalence of anything between six " +
      "and eighty-two per cent depending only on how many features are " +
      "declared to be enough, and no fact about any of them changes as the " +
      "line moves." },
    common: { state: "incorrect", text:
      "This treats the figure as a measurement of something already there. " +
      "It is a count of the people above a line, and the line is a decision " +
      "somebody took. Move it below and watch the same population produce a " +
      "figure ten times larger." },
    sample: { state: "partial", text:
      "Sampling genuinely matters and it is not the largest source of " +
      "movement here. Below, one population held completely constant produces " +
      "prevalences from six to eighty-two per cent as the line moves. A " +
      "difference between samples would have to be enormous to do that." },
    wording: { state: "partial", text:
      "Item wording moves endorsement rates and it is a real problem, which " +
      "is why the third step of this activity is about the instrument. It is " +
      "the second decision though, not the first: before anybody words an " +
      "item, somebody has decided how many features are enough." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "line") {
      wb.choices.mark(options.querySelector('[data-choice="line"]'), "correct");
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
    renderLine();
    wb.scrollTo(cardLine);
    wb.focus(thresholdInput);
    wb.announce("Four hundred people. Move the line.");
  }

  function toBuild() {
    wb.show(cardInstrument);
    renderInstrument();
    wb.scrollTo(cardInstrument);
    wb.announce("Choose three of the six features.");
  }

  /* -------------------------------------------------------------- accounts */

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function buildAccounts() {
    accountsBody.textContent = "";
    ACCOUNTS.forEach(function (account) {
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", account.name, "row"));
      tr.appendChild(cell("td", account.said));
      tr.appendChild(cell("td", account.features.map(function (k) {
        return featureByKey(k).text.toLowerCase();
      }).join("; ")));
      accountsBody.appendChild(tr);
    });
  }

  /* ----------------------------------------------------------------- line */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 110, RIGHT = 740, TOP = 60, BOTTOM = 320;

  function renderLine() {
    var t = threshold();
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 92));

    var bars = [];
    for (var n = 0; n <= FEATURES.length; n += 1) {
      bars.push(COUNTS.filter(function (c) { return c === n; }).length);
    }
    var tallest = Math.max.apply(null, bars);
    var slot = (RIGHT - LEFT) / bars.length;
    var yOf = function (v) { return BOTTOM - (v / tallest) * (BOTTOM - TOP); };

    chart.appendChild(svg("line", {
      x1: LEFT, y1: BOTTOM, x2: RIGHT, y2: BOTTOM, class: "plot__axis"
    }));

    bars.forEach(function (count, n) {
      var counted = n >= t;
      var x = LEFT + n * slot + slot * 0.16;
      var w = slot * 0.68;
      chart.appendChild(svg("rect", {
        x: x.toFixed(1), y: yOf(count).toFixed(1),
        width: w.toFixed(1), height: (BOTTOM - yOf(count)).toFixed(1),
        fill: counted ? "#C0434F" : "#1C7293", opacity: counted ? 1 : 0.42
      }));
      var value = svg("text", {
        x: (x + w / 2).toFixed(1), y: (yOf(count) - 8).toFixed(1),
        "text-anchor": "middle", class: "plot__sub",
        fill: counted ? "#C0434F" : "#1C7293"
      });
      value.textContent = String(count);
      chart.appendChild(value);
      var label = svg("text", {
        x: (x + w / 2).toFixed(1), y: BOTTOM + 22, "text-anchor": "middle", class: "plot__tick"
      });
      label.textContent = String(n);
      chart.appendChild(label);
    });

    /* The line itself, drawn between the last uncounted bar and the first
       counted one so that it reads as a cut rather than as another bar. */
    var cutX = LEFT + t * slot;
    chart.appendChild(svg("line", {
      x1: cutX.toFixed(1), y1: TOP - 26, x2: cutX.toFixed(1), y2: (BOTTOM + 6).toFixed(1),
      stroke: "#1A2744", "stroke-width": 3
    }));
    var cutLabel = svg("text", {
      x: cutX.toFixed(1), y: TOP - 32, "text-anchor": "middle", class: "plot__label"
    });
    cutLabel.textContent = "the line";
    chart.appendChild(cutLabel);

    var axis = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: BOTTOM + 48, "text-anchor": "middle", class: "plot__tick"
    });
    axis.textContent = "How many of the six features this person has";
    chart.appendChild(axis);

    chartDesc.textContent =
      "Seven bars, one for each possible number of features from none to six, " +
      "showing how many of the four hundred people have that many: " +
      bars.map(function (c, n) { return n + " features, " + c + " people"; }).join("; ") +
      ". The line is set at " + t + ", so the " + (FEATURES.length - t + 1) +
      " bars at or above it are counted as cases, which is " + atLeast(t) +
      " people or " + (prevalence(t) * 100).toFixed(1) + " per cent. The bars " +
      "do not change height when the line moves.";

    readout.textContent = "";
    readout.appendChild(tile("Prevalence", (prevalence(t) * 100).toFixed(1) + "%",
      atLeast(t) + " of the " + POPULATION + " people"));
    readout.appendChild(tile("At the lowest line here",
      (prevalence(2) * 100).toFixed(1) + "%", "if two features were enough"));
    readout.appendChild(tile("At the highest",
      (prevalence(6) * 100).toFixed(1) + "%", "if all six were required"));

    lineSentence.textContent =
      "Not one of the four hundred people has changed. The same population " +
      "supports a prevalence of " + (prevalence(6) * 100).toFixed(1) +
      " per cent and one of " + (prevalence(2) * 100).toFixed(1) +
      " per cent, and the only thing that decides which figure gets published " +
      "is a number somebody chose.";
  }

  function tile(label, value, noteText, state) {
    var li = el("li", "result");
    li.appendChild(el("p", "result__label", label));
    li.appendChild(el("p", "result__value big", value));
    li.appendChild(el("span", "result__note", noteText));
    if (state) { li.setAttribute("data-state", state); }
    return li;
  }

  /* ----------------------------------------------------------- instrument */

  function buildItems() {
    FEATURES.forEach(function (feature) {
      var label = el("label", "toggle");
      label.setAttribute("data-checked", "false");
      var input = global.document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("value", feature.key);
      input.value = feature.key;
      var wrap = el("span");
      wrap.appendChild(el("strong", null, feature.text));
      var detail = el("span", null, "");
      detail.setAttribute("data-detail", feature.key);
      wrap.appendChild(detail);
      label.appendChild(input);
      label.appendChild(wrap);
      input.addEventListener("change", function () { toggleItem(feature.key); });
      itemBox.appendChild(label);
    });
  }

  function toggleItem(key) {
    var at = selected.indexOf(key);
    if (at >= 0) {
      selected.splice(at, 1);
    } else {
      if (selected.length >= ITEMS_ALLOWED) {
        renderInstrument();
        wb.announce("Not added. The questionnaire holds " + ITEMS_ALLOWED +
          " items and already has three. Remove one first.");
        return;
      }
      selected.push(key);
    }
    moves += 1;
    if (selected.length === ITEMS_ALLOWED) { explainBtn.disabled = false; }
    renderInstrument();
    if (selected.length === ITEMS_ALLOWED) {
      wb.announce("Questionnaire complete. It finds " + foundCount(selected) +
        " of the five people.");
    }
  }

  function renderInstrument() {
    Array.prototype.forEach.call(itemBox.querySelectorAll("label.toggle"), function (label) {
      var input = label.querySelector("input");
      var on = selected.indexOf(input.value) >= 0;
      input.checked = on;
      label.setAttribute("data-checked", on ? "true" : "false");
      var full = !on && selected.length >= ITEMS_ALLOWED;
      label.setAttribute("data-full", full ? "true" : "false");
      var detail = label.querySelector("[data-detail]");
      if (detail) {
        detail.textContent = full
          ? "The questionnaire is full. Remove an item to add this one."
          : (on ? "In the questionnaire." : "Not in the questionnaire.");
      }
    });

    var complete = selected.length === ITEMS_ALLOWED;
    foundBox.textContent = "";
    foundBox.appendChild(tile("Items chosen", selected.length + " of " + ITEMS_ALLOWED,
      complete ? "the questionnaire is built" : "choose " +
        (ITEMS_ALLOWED - selected.length) + " more"));
    foundBox.appendChild(tile("People it finds",
      complete ? foundCount(selected) + " of " + ACCOUNTS.length : "not yet",
      complete
        ? (foundCount(selected) === BEST_POSSIBLE
          ? "which is the most any three items can find"
          : "the best any three items can do is " + BEST_POSSIBLE + " of " + ACCOUNTS.length)
        : "build the questionnaire first",
      complete ? (foundCount(selected) === BEST_POSSIBLE ? "partial" : "incorrect") : null));

    detectBody.textContent = "";
    ACCOUNTS.forEach(function (account) {
      var endorsed = complete ? endorsedBy(account, selected) : [];
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", account.name, "row"));
      tr.appendChild(cell("td", complete
        ? (endorsed.length
          ? endorsed.map(function (k) { return featureByKey(k).text.toLowerCase(); }).join("; ")
          : "none of your three")
        : "waiting for three items"));
      tr.appendChild(cell("td", complete
        ? (isFound(account, selected) ? "found" : "not found")
        : "waiting for three items"));
      if (complete) {
        tr.setAttribute("data-state", isFound(account, selected) ? "chosen" : "incorrect");
      }
      detectBody.appendChild(tr);
    });

    detectCaption.textContent = complete
      ? "Somebody is found when they would endorse at least " + ENDORSE_TO_COUNT +
        " of your " + ITEMS_ALLOWED + " items. The first two columns are facts " +
        "about the five people and have not changed since the top of the page."
      : "Choose three items above and this fills in.";

    instrumentSentence.textContent = complete
      ? (function () {
          var missed = ACCOUNTS.filter(function (a) { return !isFound(a, selected); });
          return missed.length
            ? "Your questionnaire does not find " +
              missed.map(function (a) { return a.name.toLowerCase(); }).join(" or ") +
              ". No set of three items finds all five, and the most any set " +
              "manages is " + BEST_POSSIBLE + "."
            : "Your questionnaire finds all five, which should not be " +
              "possible and means something in this page is wrong.";
        }())
      : "Nothing has been decided about the five people yet.";
  }

  function useObvious() {
    selected = OBVIOUS.slice();
    moves = 2;
    explainBtn.disabled = false;
    renderInstrument();
    var missed = ACCOUNTS.filter(function (a) { return !isFound(a, selected); });
    noteText.textContent =
      "These are the three features that sound most like the condition: the " +
      "two commonest, and the one that names a feeling. The questionnaire " +
      "finds " + foundCount(selected) + " of the five people and does not find " +
      missed.map(function (a) { return a.name.toLowerCase(); }).join(" or ") +
      ". Read what those two said at the top of the page. Both of them are " +
      "describing something that comes from their hours and their obligations " +
      "rather than from anything inside them, and the instrument has just " +
      "decided that whatever they have, it is not this. That is not a wording " +
      "problem. It is what choosing three items out of six does.";
    wb.show(note);
    wb.announce("Loaded the three obvious items. They find " +
      foundCount(selected) + " of the five people.");
  }

  function onSlide() {
    var output = wb.root.querySelector('output[for="threshold"]');
    if (output) { output.textContent = thresholdInput.value; }
    moves += 1;
    renderLine();
  }

  function explain() {
    var t = threshold();
    resultLead.textContent =
      "At a line of " + t + " features the condition has a prevalence of " +
      (prevalence(t) * 100).toFixed(1) + " per cent, and the same four hundred " +
      "people would support anything from " + (prevalence(6) * 100).toFixed(1) +
      " to " + (prevalence(2) * 100).toFixed(1) + " per cent. Your three-item " +
      "questionnaire finds " + foundCount(selected) + " of the five people it " +
      "was built from, and no three items find all five.";
    wb.show(synthesis);
    wb.scrollTo(synthesis);
  }

  /* ---------------------------------------------------------------- setup */

  function start() {
    wb = global.Workbook.attach("[data-workbook]");
    if (!wb) { return; }

    accountsBody = wb.root.querySelector("#accounts-body");
    options = wb.root.querySelector("#options");
    verdict = wb.root.querySelector("#verdict");
    verdictText = wb.root.querySelector("#verdict-text");
    revealBtn = wb.root.querySelector("#reveal");
    cardLine = wb.root.querySelector("#card-line");
    thresholdInput = wb.root.querySelector("#threshold");
    readout = wb.root.querySelector("#readout");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    lineSentence = wb.root.querySelector("#line-sentence");
    toBuildBtn = wb.root.querySelector("#tobuild");
    cardInstrument = wb.root.querySelector("#card-instrument");
    itemBox = wb.root.querySelector("#items");
    foundBox = wb.root.querySelector("#found");
    detectBody = wb.root.querySelector("#detect-body");
    detectCaption = wb.root.querySelector("#detect-caption");
    instrumentSentence = wb.root.querySelector("#instrument-sentence");
    obviousBtn = wb.root.querySelector("#obvious");
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
    thresholdInput.addEventListener("input", onSlide);
    thresholdInput.addEventListener("change", onSlide);
    toBuildBtn.addEventListener("click", toBuild);
    obviousBtn.addEventListener("click", useObvious);
    explainBtn.addEventListener("click", explain);

    buildAccounts();
    buildItems();

    wb.onReset(function () {
      answered = false;
      selected = [];
      moves = 0;
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardLine);
      wb.hide(cardInstrument);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      thresholdInput.value = "5";
      var output = wb.root.querySelector('output[for="threshold"]');
      if (output) { output.textContent = "5"; }
      renderLine();
      renderInstrument();
    });

    renderLine();
    renderInstrument();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
