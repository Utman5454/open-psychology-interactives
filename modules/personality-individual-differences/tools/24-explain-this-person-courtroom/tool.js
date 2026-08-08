/* =========================================================================
   "Explain This Person" Courtroom
   -------------------------------------------------------------------------
   One fictional behaviour, eight competing explanations, and a jury that has
   to notice the difference between an explanation that fits and an
   explanation that predicts.

   THE EDUCATIONAL MODEL
   ---------------------
   Every explanation is scored on two things that students routinely conflate:

     fit           how comfortably it accommodates the behaviour already
                   described. Nearly all of them score well, because they were
                   all written to fit — that is what makes the case
                   underdetermined.
     discrimination  how much its predictions DIFFER from the others'. An
                   explanation that predicts exactly what every rival predicts
                   cannot be tested against them, however true it might be.

   Six pieces of evidence can be requested. Each one bears on some
   explanations and not others: requesting it raises or lowers the standing of
   the explanations whose distinctive predictions it addresses. Evidence that
   would come out the same way whatever the truth changes nothing, and the
   tool says so.

   A verdict is scored not on picking the "right" explanation — there isn't
   one — but on:

     * whether the student requested evidence that actually discriminates;
     * whether their final confidence is proportionate to what the evidence
       can support;
     * whether they kept compatible explanations alive rather than forcing a
       single cause.

   The final causal diagram distinguishes explanations that COMPETE (they make
   opposite predictions about the same evidence) from those that are
   COMPATIBLE (both can be true at once, and often are).

   WHAT THIS IS NOT
   ----------------
   There is no correct answer, and the tool refuses to supply one. A student
   who converges confidently on a single cause is scored down, not up. That is
   the whole point: the behaviour is underdetermined by the evidence available,
   which is the ordinary condition of explaining a person.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var CASE = {
    headline:
      "Priya volunteers to lead a difficult project that three colleagues have already turned down.",
    detail:
      "The project is behind schedule, the team is demoralised, and the deadline " +
      "is immovable. Priya has been in the department for two years. In the " +
      "meeting where the project was discussed, she waited until the silence " +
      "had gone on for some time, then said she would take it on."
  };

  /* Eight explanations. `predicts` is what each one implies about each piece
     of evidence: +1 the evidence should look one way, -1 the other, 0 the
     explanation makes no prediction about it. Where an explanation predicts
     nothing about any available evidence, it cannot be tested — and several
     are written that way on purpose. */
  var EXPLANATIONS = [
    {
      id: "trait",
      name: "Trait: she is high in extraversion and low in neuroticism",
      family: "Dispositional",
      fit: 0.8,
      predicts: { history: 1, private: 0, incentive: 0, others: 1, timing: 0, followup: 0 },
      note:
        "Broad traits predict aggregates well. This one predicts that she does this sort of thing generally."
    },
    {
      id: "achievement",
      name: "Achievement motive: she is drawn to moderately difficult tasks",
      family: "Motivational",
      fit: 0.85,
      predicts: { history: 1, private: 1, incentive: -1, others: 0, timing: 0, followup: 1 },
      note:
        "Predicts something quite specific: she should prefer difficulty to easy success, and should not need an external reward."
    },
    {
      id: "efficacy",
      name: "Self-efficacy: she believes she can do this particular thing",
      family: "Motivational",
      fit: 0.85,
      predicts: { history: 1, private: 1, incentive: 0, others: 0, timing: 0, followup: 1 },
      note:
        "Domain-specific by definition. Predicts she would decline a task she felt unable to do, however attractive."
    },
    {
      id: "values",
      name: "Values: she thinks someone ought to, and no one else would",
      family: "Motivational",
      fit: 0.8,
      predicts: { history: 0, private: 1, incentive: -1, others: -1, timing: 1, followup: 0 },
      note:
        "Predicts the waiting: she acted when it became clear nobody else would."
    },
    {
      id: "reputation",
      name: "Reputation: it will be noticed, and she wants it noticed",
      family: "Social",
      fit: 0.75,
      predicts: { history: 0, private: -1, incentive: 1, others: 1, timing: -1, followup: -1 },
      note:
        "Predicts she would not have volunteered privately, and would want the volunteering known."
    },
    {
      id: "incentive",
      name: "Incentive: there is a promotion round in three months",
      family: "Situational",
      fit: 0.7,
      predicts: { history: -1, private: -1, incentive: 1, others: 0, timing: 0, followup: -1 },
      note:
        "Predicts the behaviour would not appear without the incentive, and should not persist once it is resolved."
    },
    {
      id: "role",
      name: "Role experience: she has done something like this before",
      family: "Dispositional",
      fit: 0.75,
      predicts: { history: 1, private: 0, incentive: 0, others: 0, timing: 0, followup: 1 },
      note:
        "Predicts a track record, and competence rather than enthusiasm as the mechanism."
    },
    {
      id: "pressure",
      name: "Situational pressure: the silence became unbearable",
      family: "Situational",
      fit: 0.7,
      predicts: { history: -1, private: -1, incentive: 0, others: -1, timing: 1, followup: -1 },
      note:
        "Predicts the timing precisely, and predicts she would not have volunteered in writing beforehand."
    }
  ];

  /* Six pieces of evidence. `discriminates` lists the explanations whose
     predictions it can actually separate. */
  var EVIDENCE = [
    {
      id: "history",
      name: "Her record over the past two years",
      question: "Has she volunteered for difficult things before?",
      finding:
        "She has taken on two other difficult assignments, neither of which was " +
        "visible to senior staff, and declined one high-profile easy one.",
      strength: 0.9
    },
    {
      id: "private",
      name: "What she said privately afterwards",
      question: "Would she have volunteered if nobody had known?",
      finding:
        "She told a colleague she had been thinking about offering since the " +
        "previous week, and had not decided until the silence in the meeting.",
      strength: 0.7
    },
    {
      id: "incentive",
      name: "The promotion timetable",
      question: "Is there a reward available for this?",
      finding:
        "There is a promotion round in three months. Her manager confirms that " +
        "leading this project is not among the criteria being used.",
      strength: 0.8
    },
    {
      id: "others",
      name: "How the three who declined explain themselves",
      question: "Why did the others not volunteer?",
      finding:
        "All three cite existing workload. Two say they assumed someone more " +
        "senior would be assigned.",
      strength: 0.4
    },
    {
      id: "timing",
      name: "The recording of the meeting",
      question: "Exactly when in the discussion did she speak?",
      finding:
        "She spoke after roughly forty seconds of silence, having twice looked " +
        "around the room first.",
      strength: 0.6
    },
    {
      id: "followup",
      name: "What happens over the next six months",
      question: "Does the behaviour persist once the incentive is resolved?",
      finding:
        "Not yet available. This is the evidence that would discriminate most, " +
        "and it does not exist yet — which is the ordinary situation.",
      strength: 1.0,
      unavailable: true
    }
  ];

  /* =======================================================================
     Model
     ===================================================================== */

  /** How much an explanation's predictions differ from all the others'. */
  function discrimination(explanation) {
    var total = 0;
    var count = 0;
    EXPLANATIONS.forEach(function (other) {
      if (other.id === explanation.id) { return; }
      var differences = 0;
      EVIDENCE.forEach(function (evidence) {
        var a = explanation.predicts[evidence.id];
        var b = other.predicts[evidence.id];
        if (a !== 0 && b !== 0 && a !== b) {
          differences += 1;
        }
      });
      total += differences;
      count += 1;
    });
    return count ? total / (count * EVIDENCE.length) : 0;
  }

  /**
   * How well an explanation stands up given the evidence actually requested.
   * Evidence supports an explanation when the explanation predicted it, and
   * counts against when the explanation predicted the opposite.
   */
  function standing(explanation, requested) {
    var support = 0;
    var weight = 0;
    requested.forEach(function (id) {
      var evidence = byId(EVIDENCE, id);
      if (!evidence || evidence.unavailable) { return; }
      var prediction = explanation.predicts[id];
      if (prediction === 0) { return; }
      // The findings, as written, favour the "+1" predictions on history,
      // private and timing, and disfavour reputation/incentive accounts.
      var direction = { history: 1, private: 1, incentive: -1, others: -1, timing: 1 }[id] || 0;
      support += prediction * direction * evidence.strength;
      weight += evidence.strength;
    });
    return weight ? support / weight : 0;
  }

  /** Are two explanations rivals, or can both be true? */
  function relation(a, b) {
    var opposed = 0;
    var shared = 0;
    EVIDENCE.forEach(function (evidence) {
      var pa = a.predicts[evidence.id];
      var pb = b.predicts[evidence.id];
      if (pa !== 0 && pb !== 0) {
        if (pa === pb) { shared += 1; } else { opposed += 1; }
      }
    });
    return opposed > shared ? "competing" : opposed === 0 && shared > 0 ? "compatible" : "partly";
  }

  /* =======================================================================
     Helpers
     ===================================================================== */

  function byId(list, id) {
    return list.filter(function (entry) { return entry.id === id; })[0];
  }

  function pct(value) { return Math.round(value * 100) + "%"; }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function clear(node) {
    while (node.firstChild) { node.removeChild(node.firstChild); }
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#courtroom");
  if (!shell) { return; }

  var page = document;
  var $ = function (selector, scope) { return (scope || page).querySelector(selector); };

  var ratingList = $("[data-ratings]");
  var evidenceList = $("[data-evidence]");
  var findingsList = $("[data-findings]");
  var standingTable = $("[data-standing-table]");
  var diagramSvg = $("[data-diagram]");
  var diagramTable = $("[data-diagram-table]");
  var goalText = $("[data-goal-text]");
  var verdictButton = $('[data-action="verdict"]');

  var verdictSection = $("#verdict");
  var verdictBody = $("[data-verdict-body]");
  var confidenceForm = $("#confidence-form");

  var INITIAL = { ratings: {}, requested: [], stage: "rate" };
  var state = null;

  /* --- Ratings ------------------------------------------------------------- */

  function buildRatings() {
    clear(ratingList);
    EXPLANATIONS.forEach(function (explanation) {
      var item = make("li", "explanation");
      var group = make("fieldset", "explanation__group");
      var legend = make("legend", "explanation__name");
      legend.textContent = explanation.name;
      group.appendChild(legend);

      group.appendChild(make("p", "explanation__family", explanation.family));

      var scale = make("div", "explanation__scale");
      [
        ["0", "Not plausible"],
        ["1", "Possible"],
        ["2", "Likely"],
        ["3", "Very likely"]
      ].forEach(function (option) {
        var label = make("label", "control--choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "rate-" + explanation.id;
        input.value = option[0];
        input.addEventListener("change", function () {
          state.ratings[explanation.id] = Number(option[0]);
          render();
        });
        label.appendChild(input);
        label.appendChild(make("span", null, option[1]));
        scale.appendChild(label);
      });
      group.appendChild(scale);
      item.appendChild(group);
      ratingList.appendChild(item);
    });
  }

  /* --- Evidence ------------------------------------------------------------- */

  function buildEvidence() {
    clear(evidenceList);
    EVIDENCE.forEach(function (evidence) {
      var item = make("li");
      var label = make("label", "evidence-card");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = evidence.id;
      input.addEventListener("change", function () {
        if (input.checked) {
          if (state.requested.indexOf(evidence.id) === -1) {
            state.requested.push(evidence.id);
          }
        } else {
          state.requested = state.requested.filter(function (id) {
            return id !== evidence.id;
          });
        }
        render();
        shell.announce(
          (input.checked ? "Requested: " : "Withdrawn: ") + evidence.name + ". " +
            state.requested.length + " of " + EVIDENCE.length + " requested.");
      });

      var body = make("span", "evidence-card__body");
      body.appendChild(make("span", "evidence-card__name", evidence.name));
      body.appendChild(make("span", "evidence-card__question", evidence.question));
      if (evidence.unavailable) {
        body.appendChild(
          make("span", "evidence-card__flag", "Not yet available"));
      }

      label.appendChild(input);
      label.appendChild(body);
      item.appendChild(label);
      evidenceList.appendChild(item);
    });
  }

  function renderFindings() {
    clear(findingsList);
    if (!state.requested.length) {
      findingsList.appendChild(
        make("p", "verdict__body",
          "No evidence requested yet. Every explanation currently fits the " +
          "case equally well, which is exactly the problem."));
      return;
    }
    state.requested.forEach(function (id) {
      var evidence = byId(EVIDENCE, id);
      var item = make("div", "finding");
      item.appendChild(make("h4", "finding__name", evidence.name));
      item.appendChild(make("p", "finding__text", evidence.finding));
      findingsList.appendChild(item);
    });
  }

  /* --- Standing ------------------------------------------------------------- */

  function renderStanding() {
    clear(standingTable);
    var scored = EXPLANATIONS.map(function (explanation) {
      return {
        explanation: explanation,
        standing: standing(explanation, state.requested),
        discrimination: discrimination(explanation),
        rating: state.ratings[explanation.id]
      };
    }).sort(function (a, b) { return b.standing - a.standing; });

    scored.forEach(function (entry) {
      var row = make("tr");
      var th = make("th", null, entry.explanation.name);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(
        make("td", null,
          entry.rating === undefined ? "—" :
            ["Not plausible", "Possible", "Likely", "Very likely"][entry.rating]));
      row.appendChild(
        make("td", null,
          !state.requested.length ? "no evidence yet"
            : entry.standing > 0.2 ? "supported"
            : entry.standing < -0.2 ? "undermined" : "untouched"));
      row.appendChild(make("td", null, pct(entry.discrimination)));
      standingTable.appendChild(row);
    });
  }

  /* --- The diagram ----------------------------------------------------------
     Explanations arranged in a ring, with edges between those that compete.
     Compatible pairs are not drawn as edges — the absence of a line is the
     claim that both can be true at once, which the table beneath states in
     words. */

  function renderDiagram() {
    var NS = "http://www.w3.org/2000/svg";
    var W = 480;
    var H = 340;
    var cx = W / 2;
    var cy = H / 2;
    /* Radius is set so that a node label placed outside the ring still fits
       inside the viewBox. An SVG root clips at its own edge, so a label that
       overflows is silently cut off rather than shrinking the diagram. */
    var radius = 100;

    clear(diagramSvg);
    diagramSvg.setAttribute("viewBox", "0 0 " + W + " " + H);

    var positions = EXPLANATIONS.map(function (explanation, index) {
      var angle = (index / EXPLANATIONS.length) * Math.PI * 2 - Math.PI / 2;
      return {
        explanation: explanation,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      };
    });

    // Competing edges first, so nodes sit on top.
    for (var i = 0; i < positions.length; i += 1) {
      for (var j = i + 1; j < positions.length; j += 1) {
        if (relation(positions[i].explanation, positions[j].explanation) !== "competing") {
          continue;
        }
        var line = document.createElementNS(NS, "line");
        line.setAttribute("x1", String(positions[i].x));
        line.setAttribute("y1", String(positions[i].y));
        line.setAttribute("x2", String(positions[j].x));
        line.setAttribute("y2", String(positions[j].y));
        line.setAttribute("class", "diagram__edge");
        diagramSvg.appendChild(line);
      }
    }

    positions.forEach(function (position) {
      var support = standing(position.explanation, state.requested);
      var node = document.createElementNS(NS, "circle");
      node.setAttribute("cx", String(position.x));
      node.setAttribute("cy", String(position.y));
      node.setAttribute("r", "13");
      node.setAttribute(
        "class",
        "diagram__node" +
        (state.requested.length === 0 ? ""
          : support > 0.2 ? " diagram__node--supported"
          : support < -0.2 ? " diagram__node--undermined" : ""));
      diagramSvg.appendChild(node);

      var label = document.createElementNS(NS, "text");
      var outward = position.x < cx - 10 ? "end" : position.x > cx + 10 ? "start" : "middle";
      label.setAttribute(
        "x", String(position.x + (outward === "end" ? -18 : outward === "start" ? 18 : 0)));
      label.setAttribute("y", String(position.y + (outward === "middle" ? (position.y < cy ? -20 : 26) : 4)));
      label.setAttribute("text-anchor", outward);
      label.setAttribute("class", "chart__label");
      // Short id only: the family and the full statement are in the standing
      // table, and a longer label here would be clipped by the viewBox.
      label.textContent = position.explanation.id;
      diagramSvg.appendChild(label);
    });

    var caption = document.createElementNS(NS, "text");
    caption.setAttribute("x", String(cx));
    caption.setAttribute("y", String(cy));
    caption.setAttribute("text-anchor", "middle");
    caption.setAttribute("class", "chart__axis");
    caption.textContent = "lines join explanations that compete";
    diagramSvg.appendChild(caption);

    // Table equivalent: every pair, and whether it competes.
    clear(diagramTable);
    var pairs = [];
    for (var a = 0; a < EXPLANATIONS.length; a += 1) {
      for (var b = a + 1; b < EXPLANATIONS.length; b += 1) {
        var rel = relation(EXPLANATIONS[a], EXPLANATIONS[b]);
        if (rel === "partly") { continue; }
        pairs.push([EXPLANATIONS[a], EXPLANATIONS[b], rel]);
      }
    }
    pairs.slice(0, 14).forEach(function (pair) {
      var row = make("tr");
      var th = make("th", null, pair[0].id + " / " + pair[1].id);
      th.setAttribute("scope", "row");
      row.appendChild(th);
      row.appendChild(
        make("td", null,
          pair[2] === "competing"
            ? "compete — they predict opposite things"
            : "compatible — both can be true"));
      diagramTable.appendChild(row);
    });
  }

  /* --- Goal / progress -------------------------------------------------------- */

  function render() {
    renderFindings();
    renderStanding();
    renderDiagram();

    var rated = Object.keys(state.ratings).length;
    clear(goalText);
    var list = make("ul", "goal__checks");
    [
      {
        label: "Rate every explanation",
        detail: rated + " of " + EXPLANATIONS.length,
        met: rated === EXPLANATIONS.length
      },
      {
        label: "Request at least two pieces of evidence",
        detail: state.requested.length + " requested",
        met: state.requested.length >= 2
      }
    ].forEach(function (check) {
      var item = make("li");
      item.textContent = check.label + " — " + check.detail +
        (check.met ? " (met)" : " (not yet)");
      item.setAttribute("data-met", check.met ? "yes" : "no");
      list.appendChild(item);
    });
    goalText.appendChild(list);

    verdictButton.disabled = !(rated === EXPLANATIONS.length && state.requested.length >= 2);
  }

  /* --- The verdict ------------------------------------------------------------- */

  verdictButton.addEventListener("click", function () {
    var confidence = $('input[name="confidence"]:checked', confidenceForm);
    buildVerdict(confidence ? confidence.value : null);
    verdictSection.hidden = false;
    $("#verdict-heading").focus();
    shell.announce("Verdict returned.", { immediate: true });
  });

  function buildVerdict(confidence) {
    clear(verdictBody);

    var requestedUseful = state.requested.filter(function (id) {
      return !byId(EVIDENCE, id).unavailable;
    });
    var askedForFollowup = state.requested.indexOf("followup") !== -1;

    // How many high-discrimination explanations did they rate highly?
    var highRated = EXPLANATIONS.filter(function (explanation) {
      return state.ratings[explanation.id] >= 2;
    });
    var meanDiscrimination = highRated.length
      ? highRated.reduce(function (total, explanation) {
          return total + discrimination(explanation);
        }, 0) / highRated.length
      : 0;

    var lead;
    if (highRated.length <= 1) {
      lead =
        "You settled on a single explanation. The evidence available cannot " +
        "support that, and a jury that convicts on this much has gone beyond " +
        "its brief.";
    } else if (highRated.length >= 5) {
      lead =
        "You kept most explanations alive. That is defensible — but a jury " +
        "that finds everything likely has not used the evidence it asked for.";
    } else {
      lead =
        "You narrowed to " + highRated.length + " explanations without " +
        "collapsing to one. That is about the right shape for a case like this.";
    }
    verdictBody.appendChild(make("p", "reveal__lead", lead));

    verdictBody.appendChild(
      make("p", null,
        "You requested " + requestedUseful.length + " of the " +
        (EVIDENCE.length - 1) + " available pieces of evidence" +
        (askedForFollowup
          ? ", and asked for the six-month follow-up, which is the single most " +
            "discriminating thing you could want and does not exist yet. " +
            "Noticing that is worth more than any of the available evidence."
          : ". You did not ask for the six-month follow-up — the one piece " +
            "that would separate the incentive account from the rest. It is " +
            "marked unavailable, which is exactly the position most real " +
            "explanation is in.") )
    );

    verdictBody.appendChild(
      make("p", null,
        "The explanations you rated highly have an average distinctiveness of " +
        pct(meanDiscrimination) + ". " +
        (meanDiscrimination > 0.25
          ? "You favoured explanations that stick their necks out — ones that " +
            "predict things the others do not, and so could have been shown " +
            "wrong. That is the property worth rewarding."
          : "The explanations you favoured make few predictions that differ " +
            "from their rivals'. They may well be true; the difficulty is that " +
            "no evidence in this case could have told you otherwise. An " +
            "explanation that cannot fail is not thereby a better explanation."))
    );

    if (confidence) {
      var text;
      if (confidence === "high") {
        text =
          "You reported high confidence. Look at the standing column: several " +
          "explanations remain supported at once, and the evidence that would " +
          "separate them has not been collected. High confidence here is not " +
          "warranted by anything on this page.";
      } else if (confidence === "low") {
        text =
          "You reported low confidence. That is the honest position, and it is " +
          "compatible with having learned a great deal — you now know which " +
          "explanations are still standing and what would be needed to choose " +
          "between them.";
      } else {
        text =
          "You reported moderate confidence, which is about what the evidence " +
          "sustains: some explanations have been undermined, several remain, " +
          "and the discriminating evidence is not yet available.";
      }
      verdictBody.appendChild(make("p", null, text));
    }

    verdictBody.appendChild(
      make("p", null,
        "There is no correct answer to this case. Priya is fictional and her " +
        "behaviour was written to be compatible with all eight accounts - not " +
        "as a trick, but because that is the ordinary condition of explaining " +
        "a person from the outside. What distinguishes a good explanation from " +
        "a plausible one is not how comfortably it fits what you have already " +
        "seen, but how much it tells you to expect next, and whether anyone " +
        "has looked."));

    verdictBody.appendChild(
      make("p", "verdict__note",
        "Several of these explanations are compatible rather than competing: " +
        "a person can have a strong achievement motive AND high self-efficacy " +
        "AND be responding to a silence. The diagram above joins only the " +
        "pairs that genuinely pull in opposite directions."));
  }

  /* --- Reset ---------------------------------------------------------------- */

  shell.onReset(function () {
    state = JSON.parse(JSON.stringify(INITIAL));
    buildRatings();
    buildEvidence();
    confidenceForm.reset();
    verdictSection.hidden = true;
    render();
  });

  /* --- Start-up ------------------------------------------------------------- */

  $("[data-case-headline]").textContent = CASE.headline;
  $("[data-case-detail]").textContent = CASE.detail;

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Rate all eight explanations, then request evidence.",
    { immediate: true });
})();
