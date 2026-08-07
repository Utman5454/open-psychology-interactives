/* =========================================================================
   Reverse-Item Disaster
   -------------------------------------------------------------------------
   A six-item fictional scale with two reverse-keyed items, six fictional
   respondents, and four ways of scoring it — one right, three wrong in ways
   that happen constantly and are almost invisible in the output.

   THE EDUCATIONAL MODEL
   ---------------------
   Items are answered 1-5. Two of the six are worded so that agreement means
   LESS of the trait. Correct recoding is

       recoded = (min + max) - raw = 6 - raw          for a 1-5 scale

   The tool implements four scoring methods:

     none        No recoding at all. The two reverse items pull against the
                 other four, so the total is a mixture of the trait and its
                 opposite.
     correct     6 - raw on the two reverse items. The intended scoring.
     wrongmax    7 - raw, the error of using the number of scale POINTS plus
                 one from the wrong scale, or of assuming a 1-6 scale. Every
                 reverse item shifts by exactly one point, so the totals look
                 plausible and the scale is quietly biased.
     mental      The wording is read as reversed but the number is left alone.
                 Identical arithmetic to `none`, and it is included separately
                 because it is a different MISTAKE with the same consequence,
                 and students who would never forget to recode do make it.

   WHAT IS SHOWN
   -------------
   For each method: every respondent's total, the corrected item-total
   correlation for each item, Cronbach's alpha computed from the item
   covariance matrix, and the rank order of respondents. The point is that
   `none` and `mental` do not merely lower alpha — they REORDER the people,
   which is what actually reaches a conclusion in a paper.

   THE REPAIR MODE
   ---------------
   A step-by-step walkthrough over the two reverse items for one respondent,
   with the formula shown and the arithmetic performed one item at a time, so
   the recoding is something the student does rather than reads about.

   REVERSE ITEMS ARE NOT FREE
   --------------------------
   The debrief says so: reverse wording reduces acquiescence and introduces
   comprehension difficulty, is answered inconsistently by people reading
   quickly, and routinely forms its own method factor that looks like a second
   substantive dimension. The fix has a cost.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var MIN = 1;
  var MAX = 5;

  /* A six-item fictional scale. Items are original, written for this tool.
     The construct is deliberately mundane. */
  var ITEMS = [
    { id: "i1", text: "I keep going when a task turns out to be harder than I expected.", reverse: false },
    { id: "i2", text: "I finish what I start, even when it stops being interesting.", reverse: false },
    { id: "i3", text: "I give up on things once they become difficult.", reverse: true },
    { id: "i4", text: "I stay with a long piece of work until it is done.", reverse: false },
    { id: "i5", text: "I move on to something else as soon as progress slows.", reverse: true },
    { id: "i6", text: "I keep at a problem until I have solved it.", reverse: false }
  ];

  /* Six fictional respondents, ordered A (most persistent) to F (least) under
     CORRECT scoring, with no ties.

     The answers are not perfectly consistent, and that is deliberate. A set of
     perfectly coherent respondents — 5,5,1,5,1,5 and so on — turns out NOT to
     reorder when the reverse items are left unrecoded: with only two of six
     items reversed, the four positive items still dominate the total, so
     forgetting to recode compresses the scores without changing anybody's
     rank. That would have made the tool's central claim false.

     These answers include the ordinary inconsistency real respondents show,
     which is enough for all six to change position under no recoding while
     the correct ordering stays unambiguous. Respondent E is the most mixed —
     agreeing moderately with the positive items and with the reverse ones —
     and moves furthest. */
  var RESPONDENTS = [
    { id: "A", name: "Respondent A", answers: [5, 2, 1, 5, 1, 5] },
    { id: "B", name: "Respondent B", answers: [4, 5, 4, 5, 2, 5] },
    { id: "C", name: "Respondent C", answers: [3, 3, 1, 4, 1, 3] },
    { id: "D", name: "Respondent D", answers: [4, 3, 1, 3, 2, 3] },
    { id: "E", name: "Respondent E", answers: [3, 4, 5, 2, 2, 5] },
    { id: "F", name: "Respondent F", answers: [1, 1, 5, 4, 5, 1] }
  ];

  var METHODS = [
    {
      id: "correct", name: "Correct recoding", formula: "6 − raw",
      note: "Subtract each reverse-keyed answer from one more than the sum of the scale endpoints. For a 1–5 scale that is 6 − raw."
    },
    {
      id: "none", name: "No recoding at all", formula: "raw",
      note: "The reverse items are scored as written, so they pull against the rest of the scale."
    },
    {
      id: "mental", name: "Reversed in the head, not in the data", formula: "raw",
      note: "The wording was read as reversed and the number left untouched. Arithmetically identical to no recoding, and a different mistake."
    },
    {
      id: "wrongmax", name: "Wrong scale maximum", formula: "7 − raw",
      note: "Recoded as though the scale ran 1–6. Every reverse item is one point too high, and nothing looks obviously wrong."
    }
  ];

  /* =======================================================================
     Scoring
     ===================================================================== */

  function recode(value, item, methodId) {
    if (!item.reverse) { return value; }
    switch (methodId) {
      case "correct": return (MIN + MAX) - value;
      case "wrongmax": return (MIN + MAX + 1) - value;
      case "none":
      case "mental":
      default: return value;
    }
  }

  function scoredAnswers(respondent, methodId) {
    return respondent.answers.map(function (value, index) {
      return recode(value, ITEMS[index], methodId);
    });
  }

  function total(respondent, methodId) {
    return scoredAnswers(respondent, methodId).reduce(function (a, b) { return a + b; }, 0);
  }

  function mean(v) { return v.reduce(function (a, b) { return a + b; }, 0) / v.length; }

  function variance(v) {
    var m = mean(v);
    return v.reduce(function (t, x) { return t + (x - m) * (x - m); }, 0) / v.length;
  }

  function covariance(x, y) {
    var mx = mean(x), my = mean(y);
    var total = 0;
    for (var i = 0; i < x.length; i += 1) { total += (x[i] - mx) * (y[i] - my); }
    return total / x.length;
  }

  function correlation(x, y) {
    var vx = variance(x), vy = variance(y);
    return vx > 0 && vy > 0 ? covariance(x, y) / Math.sqrt(vx * vy) : 0;
  }

  /** Column of scored answers for one item across respondents. */
  function itemColumn(index, methodId) {
    return RESPONDENTS.map(function (r) {
      return recode(r.answers[index], ITEMS[index], methodId);
    });
  }

  /** Corrected item-total correlation: item against the total of the others. */
  function correctedItemTotal(index, methodId) {
    var item = itemColumn(index, methodId);
    var rest = RESPONDENTS.map(function (r) {
      return scoredAnswers(r, methodId).reduce(function (sum, v, i) {
        return i === index ? sum : sum + v;
      }, 0);
    });
    return correlation(item, rest);
  }

  /** Cronbach's alpha from the item variances and the total variance. */
  function alpha(methodId) {
    var k = ITEMS.length;
    var itemVariances = ITEMS.map(function (_, index) {
      return variance(itemColumn(index, methodId));
    });
    var totals = RESPONDENTS.map(function (r) { return total(r, methodId); });
    var totalVariance = variance(totals);
    if (totalVariance <= 0) { return null; }
    var sumItem = itemVariances.reduce(function (a, b) { return a + b; }, 0);
    return (k / (k - 1)) * (1 - sumItem / totalVariance);
  }

  /** Respondents ordered highest total first, under a method. */
  function ranking(methodId) {
    return RESPONDENTS.slice().sort(function (a, b) {
      return total(b, methodId) - total(a, methodId);
    }).map(function (r) { return r.id; });
  }

  /** How many respondents change position relative to correct scoring. */
  function displaced(methodId) {
    var right = ranking("correct");
    var got = ranking(methodId);
    return right.filter(function (id, index) { return got[index] !== id; }).length;
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

  function byId(list, id) {
    return list.filter(function (e) { return e.id === id; })[0];
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#reverse");
  if (!shell) { return; }

  var page = document;
  var $ = function (s, scope) { return (scope || page).querySelector(s); };

  var itemList = $("[data-item-list]");
  var methodSelect = $("#method-select");
  var methodNote = $("[data-method-note]");
  var formulaBox = $("[data-formula]");
  var totalsTable = $("[data-totals-table]");
  var itemTable = $("[data-item-table]");
  var readout = $("[data-readout]");
  var rankNote = $("[data-rank-note]");
  var profileChart = $("[data-profile-chart]");

  var repairSection = $("#repair");
  var repairBody = $("[data-repair-body]");
  var repairStep = $("[data-repair-step]");
  var repairInput = $("#repair-input");
  var repairSubmit = $('[data-action="repair-submit"]');
  var repairFeedback = $("[data-repair-feedback]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mainSection = $("#scorer-section");

  var INITIAL = { method: "none", repairIndex: 0, repairDone: false, stage: "predict" };
  var state = null;

  /* --- The scale ------------------------------------------------------------ */

  function buildItems() {
    clear(itemList);
    ITEMS.forEach(function (item, index) {
      var li = make("li", "scale-item");
      li.appendChild(make("span", "scale-item__number", String(index + 1)));
      var body = make("span", "scale-item__body");
      body.appendChild(make("span", "scale-item__text", item.text));
      body.appendChild(
        make("span", "scale-item__key" + (item.reverse ? " scale-item__key--reverse" : ""),
          item.reverse ? "Reverse-keyed" : "Positively keyed"));
      li.appendChild(body);
      itemList.appendChild(li);
    });
  }

  /* --- Method --------------------------------------------------------------- */

  METHODS.forEach(function (method) {
    var option = make("option", null, method.name);
    option.value = method.id;
    methodSelect.appendChild(option);
  });

  methodSelect.addEventListener("change", function () {
    state.method = methodSelect.value;
    render();
    var method = byId(METHODS, state.method);
    shell.announce(
      "Scoring method: " + method.name + ". " + method.note, { immediate: true });
  });

  /* --- Rendering ------------------------------------------------------------- */

  function render() {
    if (mainSection.hidden) { return; }
    var method = byId(METHODS, state.method);
    methodNote.textContent = method.note;
    renderFormula(method);
    renderTotals();
    renderItems();
    renderReadout();
    renderProfiles();
    renderRankNote();
  }

  /* The formula visual: the recoding written out with the current method's
     numbers, and worked for one concrete answer. */
  function renderFormula(method) {
    clear(formulaBox);

    var line = make("p", "formula__line");
    line.appendChild(make("span", "formula__label", "Reverse items:"));
    line.appendChild(make("code", "formula__expr", "recoded = " + method.formula));
    formulaBox.appendChild(line);

    var example = make("p", "formula__example");
    if (method.id === "correct") {
      example.textContent =
        "The scale runs " + MIN + " to " + MAX + ", so a reverse item is " +
        "subtracted from " + (MIN + MAX) + ". Somebody who answered 5 scores " +
        ((MIN + MAX) - 5) + "; somebody who answered 1 scores " + ((MIN + MAX) - 1) + ".";
    } else if (method.id === "wrongmax") {
      example.textContent =
        "Subtracting from " + (MIN + MAX + 1) + " assumes the scale runs " +
        MIN + " to " + (MAX + 1) + ". It does not. Every reverse answer comes " +
        "out exactly one point too high — an answer of 5 scores " +
        ((MIN + MAX + 1) - 5) + " where it should score " + ((MIN + MAX) - 5) + ".";
    } else if (method.id === "mental") {
      example.textContent =
        "Nothing was subtracted from anything. The item was understood " +
        "correctly and the number was left as typed, which is arithmetically " +
        "the same as forgetting entirely.";
    } else {
      example.textContent =
        "No recoding, so an answer of 5 on \"I give up on things once they " +
        "become difficult\" is added to the persistence total as a 5.";
    }
    formulaBox.appendChild(example);
  }

  function renderTotals() {
    clear(totalsTable);
    RESPONDENTS.forEach(function (respondent) {
      var row = make("tr");
      var th = make("th", null, respondent.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      respondent.answers.forEach(function (value, index) {
        var scored = recode(value, ITEMS[index], state.method);
        var cell = make("td", null,
          ITEMS[index].reverse && scored !== value
            ? value + " → " + scored
            : String(value));
        if (ITEMS[index].reverse) { cell.setAttribute("data-reverse", "yes"); }
        row.appendChild(cell);
      });
      var totalCell = make("td", null, String(total(respondent, state.method)));
      totalCell.setAttribute("data-total", "yes");
      row.appendChild(totalCell);
      var correctTotal = total(respondent, "correct");
      row.appendChild(
        make("td", null,
          state.method === "correct" ? "—"
            : (total(respondent, state.method) - correctTotal > 0 ? "+" : "") +
              (total(respondent, state.method) - correctTotal)));
      totalsTable.appendChild(row);
    });
  }

  function renderItems() {
    clear(itemTable);
    ITEMS.forEach(function (item, index) {
      var r = correctedItemTotal(index, state.method);
      var row = make("tr");
      var th = make("th", null, "Item " + (index + 1));
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(make("td", null, item.reverse ? "Reverse" : "Positive"));
      row.appendChild(make("td", null, fmt(r)));
      row.appendChild(
        make("td", null,
          r < 0 ? "negative — flags a problem"
            : r < 0.3 ? "weak" : "acceptable"));
      itemTable.appendChild(row);
    });
  }

  function renderReadout() {
    clear(readout);
    var a = alpha(state.method);
    var moved = displaced(state.method);
    [
      ["Cronbach's alpha", fmt(a)],
      ["Respondents out of place", state.method === "correct" ? "0" : String(moved)],
      ["Items with negative item-total", String(ITEMS.filter(function (_, i) {
        return correctedItemTotal(i, state.method) < 0;
      }).length)]
    ].forEach(function (pair) {
      var cell = make("div");
      cell.appendChild(make("dt", null, pair[0]));
      cell.appendChild(make("dd", null, pair[1]));
      readout.appendChild(cell);
    });
  }

  /* Profile chart: each respondent's total under the current method against
     their total under correct scoring, so a reordering is visible as well as
     tabulated. */
  function renderProfiles() {
    var NS = "http://www.w3.org/2000/svg";
    var ROW = 30, BAR = 11, LEFT = 116, SCALE = 8;

    clear(profileChart);
    profileChart.setAttribute("viewBox", "0 0 460 " + (RESPONDENTS.length * ROW + 26));

    RESPONDENTS.forEach(function (respondent, index) {
      var y = 10 + index * ROW;
      var now = total(respondent, state.method);
      var right = total(respondent, "correct");

      var label = document.createElementNS(NS, "text");
      label.setAttribute("x", String(LEFT - 8));
      label.setAttribute("y", String(y + BAR + 2));
      label.setAttribute("text-anchor", "end");
      label.setAttribute("class", "chart__label");
      label.textContent = respondent.name;
      profileChart.appendChild(label);

      [[right, "correct", 0], [now, "current", BAR + 2]].forEach(function (entry) {
        var bar = document.createElementNS(NS, "rect");
        bar.setAttribute("x", String(LEFT));
        bar.setAttribute("y", String(y + entry[2]));
        bar.setAttribute("width", String(Math.max(0, entry[0]) * SCALE));
        bar.setAttribute("height", String(BAR));
        bar.setAttribute("class", "rev__bar rev__bar--" + entry[1]);
        profileChart.appendChild(bar);

        var value = document.createElementNS(NS, "text");
        value.setAttribute("x", String(LEFT + Math.max(0, entry[0]) * SCALE + 5));
        value.setAttribute("y", String(y + entry[2] + BAR - 1));
        value.setAttribute("class", "chart__count");
        value.textContent = entry[1] === "correct"
          ? "correct " + entry[0] : "as scored " + entry[0];
        profileChart.appendChild(value);
      });
    });
  }

  function renderRankNote() {
    var right = ranking("correct");
    var got = ranking(state.method);
    var moved = displaced(state.method);

    if (state.method === "correct") {
      rankNote.textContent =
        "Correct scoring. The order is " + right.join(" > ") + ", which is the " +
        "order the answers were written to produce. Everything below is " +
        "measured against this.";
      rankNote.setAttribute("data-tone", "good");
      return;
    }

    rankNote.textContent =
      "Order under this scoring: " + got.join(" > ") + ". Correct order: " +
      right.join(" > ") + ". " +
      (moved === 0
        ? "The totals are wrong but the ranking survives — which is why this " +
          "error can pass through an entire analysis unnoticed when only " +
          "correlations are reported."
        : moved + " of the six respondents are in the wrong position. A study " +
          "using these scores would be describing different people from the " +
          "ones it measured, and nothing in the output says so.");
    rankNote.setAttribute("data-tone", moved === 0 ? "caution" : "warn");
  }

  /* --- Repair mode ------------------------------------------------------------
     One reverse item at a time, for one respondent, with the arithmetic done
     by the student. */

  function reverseIndices() {
    var indices = [];
    ITEMS.forEach(function (item, index) { if (item.reverse) { indices.push(index); } });
    return indices;
  }

  function renderRepair() {
    var indices = reverseIndices();
    var respondent = RESPONDENTS[0];

    if (state.repairIndex >= indices.length) {
      clear(repairStep);
      repairStep.appendChild(
        make("p", "reveal__lead", "Both reverse items recoded."));
      repairStep.appendChild(
        make("p", null,
          "Respondent A's total is now " + total(respondent, "correct") +
          ", against " + total(respondent, "none") + " with no recoding — a " +
          "difference of " + (total(respondent, "correct") - total(respondent, "none")) +
          " points from two items. Switch the scoring method above to " +
          "\"Correct recoding\" to see the whole scale repaired."));
      repairInput.disabled = true;
      repairSubmit.disabled = true;
      state.repairDone = true;
      return;
    }

    var index = indices[state.repairIndex];
    var item = ITEMS[index];
    var raw = respondent.answers[index];

    clear(repairStep);
    repairStep.appendChild(
      make("p", "repair__item",
        "Item " + (index + 1) + ": “" + item.text + "”"));
    repairStep.appendChild(
      make("p", null,
        respondent.name + " answered " + raw + " on a " + MIN + "–" + MAX +
        " scale. This item is reverse-keyed, so agreement means less of the " +
        "trait, not more."));
    repairStep.appendChild(
      make("p", "repair__formula",
        "recoded = (" + MIN + " + " + MAX + ") − raw = " + (MIN + MAX) + " − " + raw));
    repairInput.value = "";
    repairInput.disabled = false;
    repairSubmit.disabled = false;
    repairInput.focus();
  }

  repairSubmit.addEventListener("click", function () {
    var indices = reverseIndices();
    var index = indices[state.repairIndex];
    var raw = RESPONDENTS[0].answers[index];
    var expected = (MIN + MAX) - raw;
    var given = parseInt(repairInput.value, 10);

    if (isNaN(given)) {
      showFeedback(repairFeedback, "caution", "Enter a number.", "");
      return;
    }
    if (given === expected) {
      showFeedback(repairFeedback, "good", "Correct.",
        (MIN + MAX) + " − " + raw + " = " + expected + ".");
      state.repairIndex += 1;
      renderRepair();
      shell.announce("Correct. Next item.", { immediate: true });
      return;
    }
    if (given === (MIN + MAX + 1) - raw) {
      showFeedback(repairFeedback, "caution", "That is the wrong-maximum error.",
        "You subtracted from " + (MIN + MAX + 1) + ", which would be right for " +
        "a " + MIN + "–" + (MAX + 1) + " scale. This scale runs " + MIN + "–" +
        MAX + ", so subtract from " + (MIN + MAX) + "." +
        (given > MAX
          ? " Notice also that " + given + " is not a value anybody could have " +
            "chosen on this scale — a recoded answer outside the response " +
            "range is always a scoring error, and it is the cheapest check " +
            "there is."
          : ""));
      return;
    }
    if (given < MIN || given > MAX) {
      showFeedback(repairFeedback, "caution", "That is outside the scale.",
        "Recoding rearranges the response options; it cannot invent new ones. " +
        "Any recoded value below " + MIN + " or above " + MAX + " is a scoring " +
        "error, and checking the range of a recoded variable catches most of " +
        "them in one line.");
      return;
    }
    if (given === raw) {
      showFeedback(repairFeedback, "caution", "That is the answer as typed.",
        "Reading the item as reversed is not the same as recoding it. The " +
        "number has to change too.");
      return;
    }
    showFeedback(repairFeedback, "caution", "Not quite.",
      "For a " + MIN + "–" + MAX + " scale, recoded = " + (MIN + MAX) + " − raw.");
  });

  repairInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { event.preventDefault(); repairSubmit.click(); }
  });

  /* --- Opening prediction ------------------------------------------------------ */

  var OPENING = {
    lower: {
      tone: "caution",
      verdict: "True, and not the worst of it.",
      text:
        "Alpha does drop, often dramatically, and a negative item-total " +
        "correlation on the reverse items is the classic signature. But alpha " +
        "is a property of the scale, and a low one at least prompts somebody " +
        "to look. The damage that goes unnoticed is to the individual scores."
    },
    order: {
      tone: "good",
      verdict: "Yes — that is the one that matters.",
      text:
        "Forgetting to recode does not just add noise. It systematically " +
        "reorders people, because the two reverse items are subtracted from " +
        "the total instead of added to it. Somebody persistent scores low and " +
        "somebody who gives up scores high, and every correlation with any " +
        "other variable is then computed on the wrong scores."
    },
    nothing: {
      tone: "warn",
      verdict: "No.",
      text:
        "With two of six items scored backwards, the total is a mixture of " +
        "the trait and its opposite. You are about to see the ranking change."
    },
    noticed: {
      tone: "caution",
      verdict: "Sometimes, and not reliably.",
      text:
        "A negative item-total correlation is a strong hint, if anybody looks " +
        "at the item statistics. The wrong-maximum error produces no hint at " +
        "all: every reverse item shifts by exactly one point, alpha barely " +
        "moves, and nothing in the output is anomalous."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before scoring anything.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var feedback = OPENING[answer.value];
    showFeedback(openingFeedback, feedback.tone, feedback.verdict, feedback.text);
    lockForm(openingForm);
    state.stage = "score";
    mainSection.hidden = false;
    repairSection.hidden = false;
    render();
    renderRepair();
    $("#scorer-heading").focus();
    shell.announce("Scorer unlocked.", { immediate: true });
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped — demonstration mode.", "");
    lockForm(openingForm);
    state.stage = "score";
    mainSection.hidden = false;
    repairSection.hidden = false;
    render();
    renderRepair();
    shell.announce("Scorer unlocked.", { immediate: true });
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

  /* --- Reset --------------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mainSection.hidden = true;
    repairSection.hidden = true;
    repairFeedback.hidden = true;
    repairInput.value = "";
    methodSelect.value = state.method;
    buildItems();
  });

  /* --- Start-up ------------------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to unlock the scorer.", { immediate: true });
})();
