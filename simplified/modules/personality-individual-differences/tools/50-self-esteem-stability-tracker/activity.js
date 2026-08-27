/**
 * Same Average, Six Very Different Weeks  (Simplified Edition)
 *
 * Teaching job: a single self-esteem score estimates a LEVEL, and at least
 * three further things differ between people that it cannot see: how much they
 * move day to day, what moves them, and how long it lasts. Those three are
 * independent of each other as well as of the level.
 *
 * The model is the one from the full Self-Esteem Stability Tracker:
 *
 *     state(t) = baseline + carry(t) + wobble(t)
 *
 * where carry is the accumulated effect of delivered events, each decaying by
 * half every `recovery` days, and wobble is ordinary day-to-day movement of a
 * person-specific size. Three fictional people share a baseline and differ on
 * the other three parameters, which are deliberately independent:
 *
 *   Ada   moves little, responds mildly to both domains, recovers in days
 *   Bo    moves a great deal day to day, responds mildly, recovers in a week
 *   Cleo  moves as little as Ada, is strongly contingent on ONE domain and
 *         barely responds to the other, and recovers very slowly
 *
 * That arrangement is what makes the three properties visibly separate rather
 * than three names for one thing. Cleo is steadier than Bo with nothing
 * happening AND is the only one for whom one kind of event is a catastrophe,
 * so variability and contingency cannot be the same property. Ada and Cleo
 * take comparable knocks in their respective sensitive domains and one is back
 * within days while the other is still down at the end of the six weeks, so
 * recovery is not implied by either of the others.
 *
 * THE WOBBLE DRAWS ARE CENTRED. Each person's daily fluctuations are drawn
 * once from a fixed seed and then centred to mean zero, so that with no events
 * delivered all three six-week averages are EXACTLY the baseline. The activity
 * opens by claiming the three scored identically, and a mean that came out at
 * 61.4 against 62.3 would quietly undercut the claim on the first screen.
 *
 * Deliberate simplifications, stated in the caution: events arrive when a
 * button is pressed rather than partly in consequence of how somebody is
 * already doing, which is the largest thing this cannot represent; recovery is
 * a smooth decay back to exactly the starting point; the two domains are
 * invented labels rather than a taxonomy; and nothing anybody does changes
 * their own contingencies.
 *
 * On framing, which is not decoration: no questionnaire is offered, no score is
 * produced for anybody, and low or variable values here are characteristics
 * that differ between people rather than symptoms.
 */
(function (global) {
  "use strict";

  var wb = null;

  /* ---------------------------------------------------------------- model */

  var DAYS = 42;
  var BASELINE = 62;
  var EVENT_SIZE = -22;
  var EVENT_DAY = 14;
  var BACK_WITHIN = 2;
  var SEED = 5100;

  var DOMAINS = [
    { key: "work", label: "A setback at work" },
    { key: "friend", label: "A falling-out with a friend" }
  ];

  var PEOPLE = [
    { name: "Ada", colour: "#1C7293", wobble: 2.5,
      contingency: { work: 0.25, friend: 0.25 }, recovery: 2 },
    { name: "Bo", colour: "#9E7318", wobble: 9.0,
      contingency: { work: 0.30, friend: 0.30 }, recovery: 3 },
    { name: "Cleo", colour: "#25634F", wobble: 3.0,
      contingency: { work: 1.00, friend: 0.15 }, recovery: 9 }
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

  /* Centred, so that with nothing delivered every six-week average is exactly
     the baseline and the page's opening claim is literally true. */
  var WOBBLE = PEOPLE.map(function (_, i) {
    var draw = normals(mulberry32(SEED + i * 911), DAYS);
    var sum = 0;
    draw.forEach(function (z) { sum += z; });
    var offset = sum / DAYS;
    return draw.map(function (z) { return z - offset; });
  });

  function carryFor(person, day, events) {
    var carry = 0;
    events.forEach(function (event) {
      if (day < event.day) { return; }
      carry += EVENT_SIZE * person.contingency[event.domain] *
        Math.pow(0.5, (day - event.day) / person.recovery);
    });
    return carry;
  }

  function seriesFor(index, events) {
    var person = PEOPLE[index];
    var out = [];
    for (var day = 0; day < DAYS; day += 1) {
      out.push(BASELINE + carryFor(person, day, events) + WOBBLE[index][day] * person.wobble);
    }
    return out;
  }

  function mean(values) {
    var sum = 0;
    values.forEach(function (v) { sum += v; });
    return sum / values.length;
  }

  /** Ordinary day-to-day movement, measured on the event-free series so that
      an event's effect is never counted as volatility. */
  function ordinaryMovement(index) {
    var values = seriesFor(index, []);
    var m = mean(values);
    var sum = 0;
    values.forEach(function (v) { sum += (v - m) * (v - m); });
    return Math.sqrt(sum / (values.length - 1));
  }

  /** The size of the event's own effect, before any day-to-day movement. */
  function dropFor(index, events) {
    var person = PEOPLE[index];
    var worst = 0;
    events.forEach(function (event) {
      var effect = Math.abs(EVENT_SIZE * person.contingency[event.domain]);
      if (effect > worst) { worst = effect; }
    });
    return worst;
  }

  /** Days from the last event until its effect is smaller than BACK_WITHIN,
      or null if that has not happened by the end of the six weeks. */
  function daysToReturn(index, events) {
    if (!events.length) { return null; }
    var person = PEOPLE[index];
    var last = events[events.length - 1];
    for (var day = last.day; day < DAYS; day += 1) {
      if (Math.abs(carryFor(person, day, events)) < BACK_WITHIN) {
        return day - last.day;
      }
    }
    return null;
  }

  /* ------------------------------------------------------------------ dom */

  var options, verdict, verdictText, revealBtn, cardTrack;
  var buttonBox, chart, chartDesc, summaryBody, summaryCaption, sentence;
  var explainBtn, note, noteText, synthesis, resultLead;

  var answered = false;
  var delivered = [];

  var VERDICTS = {
    little: { state: "correct", text:
      "Correct, and the six weeks below show how little. A single score " +
      "estimates where somebody typically sits, and these three sit in " +
      "exactly the same place. Everything else about how they get there is " +
      "invisible to it, and there turn out to be at least three such things." },
    same: { state: "incorrect", text:
      "This is what a single number invites you to think, and it is why one " +
      "is so often collected. Two of the three below have identical averages " +
      "and identical day-to-day movement, and one setback tells them " +
      "completely apart." },
    problem: { state: "incorrect", text:
      "Two things have gone wrong here at once. Fluctuating is a " +
      "characteristic that differs between people rather than a symptom, and " +
      "this page is not in a position to call anything a problem. The other " +
      "is factual: the person below who moves most from day to day is not the " +
      "one who is knocked furthest by an event." },
    nothing: { state: "partial", text:
      "Nearly, and it goes slightly too far. A single observation genuinely " +
      "cannot be interrogated, and it is not that nothing is knowable: what " +
      "it estimates, badly, is the level, and that is a real property. What " +
      "it cannot see are the other three, which is a narrower and more useful " +
      "complaint." }
  };

  function answer(key) {
    if (answered) { return; }
    answered = true;
    wb.choices.mark(options.querySelector('[data-choice="' + key + '"]'), VERDICTS[key].state);
    if (key !== "little") {
      wb.choices.mark(options.querySelector('[data-choice="little"]'), "correct");
    }
    wb.choices.lock(options);
    verdict.setAttribute("data-state", VERDICTS[key].state);
    verdictText.textContent = VERDICTS[key].text;
    wb.show(verdict);
    revealBtn.disabled = false;
    wb.announce("Answer recorded.");
  }

  function reveal() {
    wb.show(cardTrack);
    render();
    wb.scrollTo(cardTrack);
    wb.announce("The six weeks are shown. Nothing has been delivered yet.");
  }

  /* -------------------------------------------------------------- actions */

  function deliver(domainKey) {
    if (delivered.some(function (e) { return e.domain === domainKey; })) { return; }
    delivered.push({ domain: domainKey, day: EVENT_DAY + delivered.length * 7 });
    explainBtn.disabled = false;
    render();

    var domain = DOMAINS.filter(function (d) { return d.key === domainKey; })[0];
    var lines = PEOPLE.map(function (person, i) {
      return person.name + " drops " + dropFor(i, delivered).toFixed(1);
    });
    noteText.textContent = noteFor(domainKey);
    wb.show(note);
    wb.announce(domain.label + " delivered to all three. " + lines.join(", ") + ".");
  }

  function noteFor(domainKey) {
    var drops = PEOPLE.map(function (person, i) {
      return { name: person.name,
        drop: Math.abs(EVENT_SIZE * person.contingency[domainKey]),
        back: daysToReturn(i, delivered) };
    });
    var worst = drops.slice().sort(function (a, b) { return b.drop - a.drop; })[0];
    var least = drops.slice().sort(function (a, b) { return a.drop - b.drop; })[0];
    var text = domainKey === "work"
      ? "The same setback, delivered to all three at once. " + worst.name +
        " drops " + worst.drop.toFixed(1) + " points and " + least.name +
        " drops " + least.drop.toFixed(1) + ". Before this happened " +
        worst.name + " was the steadier of the two from day to day, which is " +
        "the whole point: how much somebody moves ordinarily tells you " +
        "nothing about what will knock them over."
      : "The same falling-out, delivered to all three at once. Compare the " +
        "drops with the ones from the setback at work. " + worst.name +
        " is the most affected this time, and the person who was devastated " +
        "by the work setback barely registers this one. Being highly " +
        "contingent is not being fragile in general; it is being fragile " +
        "about something in particular.";
    if (worst.back === null) {
      text += " And notice the last column: one of them has not returned to " +
        "within two points by the end of the six weeks.";
    }
    return text;
  }

  /* --------------------------------------------------------------- figure */

  function svg(tag, attrs) {
    var node = global.document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var LEFT = 118, RIGHT = 740, TOP = 78, BOTTOM = 340;
  var Y_MIN = 20, Y_MAX = 100;

  function el(tag, className, text) {
    var node = global.document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function renderButtons() {
    buttonBox.textContent = "";
    DOMAINS.forEach(function (domain) {
      var done = delivered.some(function (e) { return e.domain === domain.key; });
      var button = el("button", "btn " + (done ? "btn-secondary" : "btn-primary"),
        done ? "Delivered: " + domain.label.toLowerCase() : "Deliver " + domain.label.toLowerCase());
      button.type = "button";
      if (done) {
        button.setAttribute("aria-disabled", "true");
      } else {
        button.addEventListener("click", function () { deliver(domain.key); });
      }
      buttonBox.appendChild(button);
    });
  }

  function render() {
    wb.clearFigure(chart);
    chart.setAttribute("viewBox", "0 0 900 " + (BOTTOM + 96));

    var xOf = function (day) { return LEFT + (day / (DAYS - 1)) * (RIGHT - LEFT); };
    var yOf = function (v) {
      return BOTTOM - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (BOTTOM - TOP);
    };

    [20, 40, 60, 80, 100].forEach(function (v) {
      chart.appendChild(svg("line", {
        x1: LEFT, y1: yOf(v).toFixed(1), x2: RIGHT, y2: yOf(v).toFixed(1),
        class: "plot__axis", opacity: 0.5
      }));
      var tick = svg("text", {
        x: LEFT - 10, y: (yOf(v) + 4).toFixed(1), "text-anchor": "end", class: "plot__tick"
      });
      tick.textContent = String(v);
      chart.appendChild(tick);
    });

    var yTitle = svg("text", { x: 6, y: TOP - 48, class: "plot__label" });
    yTitle.textContent = "Self-esteem that day, on an arbitrary scale";
    chart.appendChild(yTitle);

    /* Event labels are staggered onto alternate rows. Two events a week apart
       put two long labels at the same height, and they collide. */
    delivered.forEach(function (event, index) {
      chart.appendChild(svg("line", {
        x1: xOf(event.day).toFixed(1), y1: TOP, x2: xOf(event.day).toFixed(1), y2: BOTTOM,
        stroke: "#1A2744", "stroke-width": 2, "stroke-dasharray": "5 4"
      }));
      var label = svg("text", {
        x: xOf(event.day).toFixed(1), y: TOP - 8 - (index % 2) * 17,
        "text-anchor": "middle", class: "plot__tick"
      });
      label.textContent = DOMAINS.filter(function (d) { return d.key === event.domain; })[0]
        .label.toLowerCase();
      chart.appendChild(label);
    });

    var ends = [];
    PEOPLE.forEach(function (person, i) {
      var values = seriesFor(i, delivered);
      var points = values.map(function (v, day) {
        return xOf(day).toFixed(1) + "," + yOf(v).toFixed(1);
      });
      chart.appendChild(svg("polyline", {
        points: points.join(" "), fill: "none",
        stroke: person.colour, "stroke-width": 2.5, "stroke-linejoin": "round"
      }));
      ends.push({ person: person, y: yOf(values[DAYS - 1]) });
    });

    var spread = wb.spreadLabels(ends.map(function (e) { return e.y; }), 20, TOP, BOTTOM);
    ends.forEach(function (e, i) {
      if (Math.abs(spread[i] - e.y) > 2) {
        chart.appendChild(svg("line", {
          x1: (RIGHT + 10).toFixed(1), y1: spread[i].toFixed(1),
          x2: (RIGHT + 3).toFixed(1), y2: e.y.toFixed(1),
          stroke: e.person.colour, "stroke-width": 1, opacity: 0.7
        }));
      }
      var label = svg("text", {
        x: (RIGHT + 14).toFixed(1), y: (spread[i] + 4).toFixed(1),
        class: "plot__sub", fill: e.person.colour
      });
      label.textContent = e.person.name;
      chart.appendChild(label);
    });

    [0, 7, 14, 21, 28, 35, 41].forEach(function (day) {
      var tick = svg("text", {
        x: xOf(day).toFixed(1), y: BOTTOM + 24, "text-anchor": "middle", class: "plot__tick"
      });
      tick.textContent = "day " + (day + 1);
      chart.appendChild(tick);
    });

    renderButtons();
    describe();
    renderSummary();
  }

  function describe() {
    var parts = PEOPLE.map(function (person, i) {
      var values = seriesFor(i, delivered);
      return person.name + " averages " + mean(values).toFixed(1) + " and moves " +
        ordinaryMovement(i).toFixed(1) + " from day to day";
    });
    chartDesc.textContent =
      "Three lines, one per person, across forty-two daily readings on a " +
      "scale from 20 to 100. " + parts.join("; ") + ". " +
      (delivered.length
        ? delivered.map(function (e) {
            return DOMAINS.filter(function (d) { return d.key === e.domain; })[0]
              .label.toLowerCase() + " was delivered on day " + (e.day + 1);
          }).join(", and ") + "."
        : "Nothing has been delivered, and all three averages are the same.");
  }

  function cell(tag, text, scope) {
    var node = global.document.createElement(tag);
    if (scope) { node.setAttribute("scope", scope); }
    node.textContent = text;
    return node;
  }

  function renderSummary() {
    summaryBody.textContent = "";
    PEOPLE.forEach(function (person, i) {
      var values = seriesFor(i, delivered);
      var back = daysToReturn(i, delivered);
      var tr = global.document.createElement("tr");
      tr.appendChild(cell("th", person.name, "row"));
      tr.appendChild(cell("td", mean(values).toFixed(1)));
      tr.appendChild(cell("td", ordinaryMovement(i).toFixed(1)));
      tr.appendChild(cell("td", delivered.length ? dropFor(i, delivered).toFixed(1) : "nothing delivered"));
      tr.appendChild(cell("td", !delivered.length ? "nothing delivered"
        : (back === null ? "still down after six weeks" : String(back))));
      summaryBody.appendChild(tr);
    });

    summaryCaption.textContent = delivered.length
      ? "The first column is what a one-off measure estimates. The other three " +
        "are what it cannot see, and they do not follow from one another."
      : "With nothing delivered, all three averages are identical and two of " +
        "the three move by almost exactly the same amount from day to day. " +
        "The one-off measure has nothing to distinguish any of them.";

    if (!delivered.length) {
      sentence.textContent = "Ada and Cleo are nearly indistinguishable so far. " +
        "Deliver the setback at work and watch what happens to that.";
    } else {
      var byDrop = PEOPLE.map(function (p, i) {
        return { name: p.name, drop: dropFor(i, delivered), move: ordinaryMovement(i) };
      });
      var mover = byDrop.slice().sort(function (a, b) { return b.move - a.move; })[0];
      var hardest = byDrop.slice().sort(function (a, b) { return b.drop - a.drop; })[0];
      sentence.textContent = mover.name + " moves most from day to day and " +
        hardest.name + " is knocked furthest by what has been delivered. " +
        (mover.name === hardest.name
          ? "Here those happen to be the same person."
          : "They are not the same person, which is the point: the two are " +
            "separate properties and neither predicts the other.");
    }
  }

  function explain() {
    var parts = PEOPLE.map(function (person, i) {
      return person.name + " " + mean(seriesFor(i, delivered)).toFixed(1);
    });
    resultLead.textContent = delivered.length
      ? "Six-week averages: " + parts.join(", ") + ". Before anything was " +
        "delivered all three were exactly " + BASELINE.toFixed(1) + ", their " +
        "ordinary day-to-day movement ranged from " +
        Math.min.apply(null, PEOPLE.map(function (_, i) { return ordinaryMovement(i); })).toFixed(1) +
        " to " + Math.max.apply(null, PEOPLE.map(function (_, i) { return ordinaryMovement(i); })).toFixed(1) +
        ", and one setback separated two people the first two numbers could not."
      : "All three average exactly " + BASELINE.toFixed(1) + " across the six " +
        "weeks, and their ordinary day-to-day movement already differs by a " +
        "factor of nearly three. Deliver something to see the other two " +
        "properties come apart.";
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
    cardTrack = wb.root.querySelector("#card-track");
    buttonBox = wb.root.querySelector("#event-buttons");
    chart = wb.root.querySelector("#chart");
    chartDesc = wb.root.querySelector("#chart-desc");
    summaryBody = wb.root.querySelector("#summary-body");
    summaryCaption = wb.root.querySelector("#summary-caption");
    sentence = wb.root.querySelector("#sentence");
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
    explainBtn.addEventListener("click", explain);

    wb.onReset(function () {
      answered = false;
      delivered = [];
      wb.choices.unlock(options);
      Array.prototype.forEach.call(options.querySelectorAll("[data-choice]"), function (button) {
        wb.choices.mark(button, null);
      });
      wb.hide(verdict);
      revealBtn.disabled = true;
      wb.hide(cardTrack);
      wb.hide(note);
      wb.hide(synthesis);
      explainBtn.disabled = true;
      render();
    });

    render();
  }

  if (global.document.readyState === "loading") {
    global.document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
}(window));
