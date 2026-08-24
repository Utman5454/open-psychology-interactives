/* =========================================================================
   Double Dissociation Detective — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from
   modules/neuropsychology/tools/01-double-dissociation-detective/

   WHAT IS PRESERVED
   -----------------
   The mechanism is the progressive accumulation of evidence, and it runs
   unchanged across four files:

     1  one person, worse on one task          single dissociation
     2  a second person, worse on the same task general severity difference
     3  a second person, worse on the other     double dissociation
     4  the same shape, at four test lengths    precision decides the verdict

   File 2 is the one that does the real work. It is not repetition: it is the
   file that shows a second person adding severity rather than logic, which is
   what leaves the rival explanation standing until file 3 kills it.

   The control-referenced interval plot is preserved as the original built it:
   every score read against its own control group, the usual control range
   shaded, and a marker filled only when the whole interval clears that range.
   Raw percentages on two different tasks are not comparable, and the plot is
   what makes that visible rather than merely stated.

   The precision slider is preserved because it changes the verdict, not
   because the original had one. On file 4 the same four percentages classify
   as "not enough evidence" at 40 items and as a double dissociation at about
   55, and the classification is computed rather than written down.

   THE EDUCATIONAL MODEL, unchanged from the original
   --------------------------------------------------
       z = (score - controlMean) / controlSd
       SE(p) = sqrt(p(1 - p) / n),  in control units SE(p) / controlSd
       SE(dz) = sqrt(SEz(a)^2 + SEz(b)^2)
       resolvable when |dz| > 1.96 * SE(dz)

       no resolvable difference in anybody  ->  not enough evidence
       exactly one resolvable difference    ->  single dissociation
       two, same direction                  ->  general severity difference
       two, opposite directions             ->  double dissociation

   DELIBERATE SIMPLIFICATIONS, carried over
   ----------------------------------------
   The observed proportion is held fixed while test length varies, so the
   slider isolates precision; a longer test would move the estimate too.
   Control mean and standard deviation are treated as known exactly, where a
   single-case comparison properly uses a modified t test and wider intervals.
   The binomial standard error assumes items are independent and equally
   difficult, which no real task satisfies.

   WHAT WAS REMOVED
   ----------------
   Two of the six case files: the large raw gap that is not a dissociation,
   and the clean crossover on tasks that differ in too much. Each is a
   separate teaching job. The second is stated as a limitation in the
   synthesis instead, which is where a caveat belongs once the argument is
   finished. Also gone: the opening prediction, the case selector, and the
   closing challenge on what a crossover buys. The staged evidence has already
   taught that.

   Every person, task, score and control group is invented. Nothing is stored
   and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb) {
    return;
  }

  var CRIT = 1.96;          /* 95% two-tailed normal critical value */
  var TYPICAL_LIMIT = 1.65; /* edge of the shaded control range */
  var DEFAULT_ITEMS = 40;

  /* The four verdicts, in a fixed order that never changes between files.
     They are a classification scheme, not a set of options written per
     question, so the position of the supported verdict moves on its own:
     third, then second, then fourth. */
  var VERDICTS = [
    {
      id: "insufficient",
      name: "Not enough evidence",
      gloss: "The differences are inside measurement error."
    },
    {
      id: "severity",
      name: "A general severity difference",
      gloss: "Both people are further below controls on the same task."
    },
    {
      id: "single",
      name: "A single dissociation",
      gloss: "One person is further below controls on one task."
    },
    {
      id: "double",
      name: "A double dissociation",
      gloss: "Each person is further below controls on a different task."
    }
  ];

  var CASES = [
    {
      step: "Case 1",
      title: "One person, two tasks",
      brief: "Person A, tested on two tasks that use the same everyday " +
             "objects. Read each score against its own control group.",
      items: DEFAULT_ITEMS,
      precision: false,
      tasks: [
        { key: "a", short: "Naming pictures", mean: 0.94, sd: 0.08 },
        { key: "b", short: "Word to picture", mean: 0.96, sd: 0.05 }
      ],
      people: [{ label: "Person A", scores: { a: 0.48, b: 0.91 } }],
      commentary:
        "A single dissociation, and worth having: the two tasks come apart, " +
        "so naming a picture is not simply understanding it plus speaking. " +
        "What it cannot rule out is that naming is the more demanding task. " +
        "One person never settles that, however large the gap.",
      rival: "Still standing: naming may simply be harder."
    },
    {
      step: "Case 2",
      title: "Two people, the same shape",
      brief: "Person A and Person B, the same two memory tasks, the same " +
             "items. Person B is more impaired overall.",
      items: DEFAULT_ITEMS,
      precision: false,
      tasks: [
        { key: "a", short: "Immediate recall", mean: 0.86, sd: 0.11 },
        { key: "b", short: "Delayed recall", mean: 0.82, sd: 0.12 }
      ],
      people: [
        { label: "Person A", scores: { a: 0.70, b: 0.36 } },
        { label: "Person B", scores: { a: 0.58, b: 0.20 } }
      ],
      commentary:
        "Two resolvable differences, both the same way round: further below " +
        "controls on delayed recall than on immediate recall. One graded " +
        "impairment produces that, and so would two separate deficits. The " +
        "second person adds severity, not logic. Only a reversal adds logic.",
      rival: "Still standing: delayed recall may simply be harder."
    },
    {
      step: "Case 3",
      title: "Two people, opposite shapes",
      brief: "Person A and Person B, the same two tasks, the same items, the " +
             "same session length.",
      items: DEFAULT_ITEMS,
      precision: false,
      tasks: [
        { key: "a", short: "Naming objects", mean: 0.93, sd: 0.07 },
        { key: "b", short: "Block design", mean: 0.84, sd: 0.12 }
      ],
      people: [
        { label: "Person A", scores: { a: 0.45, b: 0.80 } },
        { label: "Person B", scores: { a: 0.90, b: 0.30 } }
      ],
      commentary:
        "This is the crossover. Neither task can be the harder one, because " +
        "a task cannot be more demanding for one person and less demanding " +
        "for another simply by being more demanding. That single piece of " +
        "logic is the whole contribution of a double dissociation, and this " +
        "is a real one: these two tasks draw on at least partly separable " +
        "processing.",
      rival: "Ruled out. This is what a reversal buys."
    },
    {
      step: "Case 4",
      title: "The same scores, a longer test",
      brief: "Two people, two rhyme-judgement tasks, and a control for how " +
             "many items each task contained. The percentages never move.",
      items: DEFAULT_ITEMS,
      precision: true,
      tasks: [
        { key: "a", short: "Spoken rhyme", mean: 0.90, sd: 0.10 },
        { key: "b", short: "Written rhyme", mean: 0.89, sd: 0.10 }
      ],
      people: [
        { label: "Person A", scores: { a: 0.79, b: 0.61 } },
        { label: "Person B", scores: { a: 0.63, b: 0.80 } }
      ],
      commentary:
        "Nothing about these two people changes as you move the slider. Only " +
        "the precision of the estimates does. At 40 items the crossover is in " +
        "the point estimates and not in the evidence. Around 50 items one " +
        "difference becomes resolvable, and from about 55 both do: the same " +
        "four scores, now a double dissociation. Test length decides what you " +
        "are entitled to claim.",
      rival: ""
    }
  ];

  /* --- The model ------------------------------------------------------- */

  function zOf(score, task) {
    return (score - task.mean) / task.sd;
  }

  function seZ(score, items, task) {
    return Math.sqrt((score * (1 - score)) / items) / task.sd;
  }

  /**
   * Everything the chart, the table and the verdict need, from one pass.
   * The verdict is computed from the same numbers the plot draws, so the
   * picture and the classification can never disagree.
   */
  function analyse(caseDef, items) {
    var taskA = caseDef.tasks[0];
    var taskB = caseDef.tasks[1];

    var people = caseDef.people.map(function (person) {
      var rows = caseDef.tasks.map(function (task) {
        var score = person.scores[task.key];
        var z = zOf(score, task);
        var se = seZ(score, items, task);
        return {
          task: task,
          score: score,
          correct: Math.round(score * items),
          z: z,
          low: z - CRIT * se,
          high: z + CRIT * se,
          clearlyBelow: z + CRIT * se < -TYPICAL_LIMIT
        };
      });

      var dz = zOf(person.scores[taskA.key], taskA) - zOf(person.scores[taskB.key], taskB);
      var seDiff = Math.sqrt(
        Math.pow(seZ(person.scores[taskA.key], items, taskA), 2) +
          Math.pow(seZ(person.scores[taskB.key], items, taskB), 2)
      );

      return {
        label: person.label,
        rows: rows,
        dz: dz,
        resolvable: Math.abs(dz) > CRIT * seDiff,
        worseOn: dz < 0 ? taskA : taskB
      };
    });

    var resolved = people.filter(function (person) {
      return person.resolvable;
    });

    var verdict;
    if (resolved.length === 0) {
      verdict = "insufficient";
    } else if (resolved.length === 1) {
      verdict = "single";
    } else if (resolved[0].dz * resolved[1].dz > 0) {
      verdict = "severity";
    } else {
      verdict = "double";
    }

    return { people: people, verdict: verdict, items: items };
  }

  function verdictName(id) {
    var found = "";
    VERDICTS.forEach(function (verdict) {
      if (verdict.id === id) {
        found = verdict.name;
      }
    });
    return found;
  }

  /* --- Elements -------------------------------------------------------- */

  var stepLabel = document.getElementById("step-label");
  var heading = document.getElementById("case-heading");
  var brief = document.getElementById("brief");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var tableBody = document.getElementById("table-body");
  var tableCaption = document.getElementById("table-caption");
  var precisionBox = document.getElementById("precision");
  var itemsInput = document.getElementById("items");
  var liveVerdict = document.getElementById("live-verdict");
  var taskPrompt = document.getElementById("task-prompt");
  var optionGrid = document.getElementById("options");
  var reveal = document.getElementById("reveal");
  var nextButton = document.getElementById("next");

  var index = 0;
  var answered = false;
  var sliderMoved = false;
  var items = DEFAULT_ITEMS;

  var SVG_NS = "http://www.w3.org/2000/svg";

  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function fmt(value, places) {
    return (Math.round(value * Math.pow(10, places)) / Math.pow(10, places)).toFixed(places);
  }

  /* --- The plot -------------------------------------------------------- */

  function renderChart(result) {
    /* The viewBox width matches the width the plot is rendered at, so a
       13px label is a 13px label. At 720 units it was being magnified by a
       fifth, which cost about seventy pixels of height for nothing. */
    var LEFT = 190;
    var AXIS_START = 200;
    var AXIS_END = 870;
    var Z_MIN = -10;
    var Z_MAX = 2;
    var ROW = 26;
    var HEAD = 20;
    var KEY = 24;        /* the key row above the plot */
    var TOP = 12 + KEY;

    function xOf(z) {
      var clamped = Math.max(Z_MIN, Math.min(Z_MAX, z));
      return AXIS_START + ((clamped - Z_MIN) / (Z_MAX - Z_MIN)) * (AXIS_END - AXIS_START);
    }

    var height = TOP;
    result.people.forEach(function (person) {
      height += HEAD + person.rows.length * ROW + 8;
    });
    var axisY = height + 6;
    var total = axisY + 34;

    while (chart.childNodes.length > 2) {
      chart.removeChild(chart.lastChild);
    }
    chart.setAttribute("viewBox", "0 0 900 " + total);

    /* Key. The case marker is drawn as it appears in the plot, and the
       control label sits directly above the shaded band, so neither has to
       be matched up with a swatch somewhere else. */
    chart.appendChild(svg("line", {
      x1: 2, y1: 12, x2: 30, y2: 12, class: "plot__interval plot__key"
    }));
    chart.appendChild(svg("circle", {
      cx: 16, cy: 12, r: 5,
      class: "plot__point plot__point--filled plot__key"
    }));
    var keyCase = svg("text", { x: 38, y: 16, class: "plot__tick" });
    keyCase.textContent = "Case participant, with its 95% interval";
    chart.appendChild(keyCase);

    var keyControl = svg("text", {
      x: xOf(0), y: 16, "text-anchor": "middle", class: "plot__tick"
    });
    keyControl.textContent = "Control group range";
    chart.appendChild(keyControl);

    chart.appendChild(svg("rect", {
      x: xOf(-TYPICAL_LIMIT), y: TOP - 6,
      width: xOf(TYPICAL_LIMIT) - xOf(-TYPICAL_LIMIT),
      height: axisY - TOP + 6,
      class: "plot__band"
    }));

    chart.appendChild(svg("line", {
      x1: xOf(0), y1: TOP - 6, x2: xOf(0), y2: axisY, class: "plot__zero"
    }));

    var y = TOP;
    result.people.forEach(function (person) {
      var name = svg("text", { x: 0, y: y + 13, class: "plot__label" });
      name.textContent = person.label + " (case)";
      chart.appendChild(name);
      y += HEAD;

      person.rows.forEach(function (row) {
        var label = svg("text", {
          x: LEFT, y: y + 14, "text-anchor": "end", class: "plot__sub"
        });
        label.textContent = row.task.short;
        chart.appendChild(label);

        chart.appendChild(svg("line", {
          x1: xOf(row.low), y1: y + 10, x2: xOf(row.high), y2: y + 10,
          class: "plot__interval"
        }));

        chart.appendChild(svg("circle", {
          cx: xOf(row.z), cy: y + 10, r: 6,
          class: row.clearlyBelow ? "plot__point plot__point--filled" : "plot__point"
        }));

        y += ROW;
      });
      y += 8;
    });

    chart.appendChild(svg("line", {
      x1: AXIS_START, y1: axisY, x2: AXIS_END, y2: axisY, class: "plot__axis"
    }));

    [-10, -8, -6, -4, -2, 0, 2].forEach(function (tick) {
      var mark = svg("text", {
        x: xOf(tick), y: axisY + 20, "text-anchor": "middle", class: "plot__tick"
      });
      mark.textContent = String(tick);
      chart.appendChild(mark);
    });

    var caption = svg("text", {
      x: (AXIS_START + AXIS_END) / 2, y: axisY + 32,
      "text-anchor": "middle", class: "plot__tick"
    });
    caption.textContent = "Control standard deviations from that task's control average";
    chart.appendChild(caption);
  }

  /* --- The table: the plot's text equivalent, and its numbers ---------- */

  function renderTable(result) {
    tableBody.textContent = "";

    result.people.forEach(function (person) {
      person.rows.forEach(function (row) {
        var tr = document.createElement("tr");

        var th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = person.label + ", " + row.task.short;

        tr.appendChild(th);
        tr.appendChild(cell(
          Math.round(row.score * 100) + "% (" + row.correct + " of " + result.items + ")"
        ));
        tr.appendChild(cell(
          fmt(row.z, 2) + " SD (" + fmt(row.low, 2) + " to " + fmt(row.high, 2) + ")"
        ));
        tr.appendChild(cell(row.clearlyBelow ? "Yes" : "No"));

        tableBody.appendChild(tr);
      });
    });

    tableCaption.textContent =
      "Every value in the plot above, at " + result.items + " items per task.";
  }

  function cell(text) {
    var td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  function describeChart(result) {
    var lead = "Each marker is a case participant's score on one task, plotted " +
      "against that task's own control group. The shaded band is the control " +
      "group range, the scores a control group would usually produce. ";
    var parts = result.people.map(function (person) {
      return person.label + " is " +
        person.rows.map(function (row) {
          return fmt(row.z, 1) + " control standard deviations from the average on " +
            row.task.short.toLowerCase();
        }).join(", and ") +
        ". The difference is " +
        (person.resolvable ? "larger" : "not larger") +
        " than measurement error.";
    });
    chartDesc.textContent = lead + parts.join(" ");
  }

  /* --- Verdict options ------------------------------------------------- */

  function renderOptions() {
    optionGrid.textContent = "";

    VERDICTS.forEach(function (verdict) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option option--row";
      button.setAttribute("data-choice", verdict.id);
      button.setAttribute("aria-describedby", "task-prompt");

      var name = document.createElement("strong");
      name.textContent = verdict.name;

      var gloss = document.createElement("span");
      gloss.textContent = verdict.gloss;

      button.appendChild(name);
      button.appendChild(gloss);
      button.addEventListener("click", function () {
        choose(verdict.id);
      });

      optionGrid.appendChild(button);
    });
  }

  /* --- Rendering a case ------------------------------------------------ */

  function renderCase() {
    var caseDef = CASES[index];
    var last = index === CASES.length - 1;

    answered = false;
    sliderMoved = false;
    items = caseDef.items;

    stepLabel.textContent = caseDef.step;
    heading.textContent = caseDef.title;
    brief.textContent = caseDef.brief;

    if (caseDef.precision) {
      itemsInput.value = String(DEFAULT_ITEMS);
      items = DEFAULT_ITEMS;
      wb.show(precisionBox);
      wb.hide(optionGrid);
      wb.hide(taskPrompt);
    } else {
      wb.hide(precisionBox);
      wb.show(taskPrompt);
      wb.show(optionGrid);
      renderOptions();
    }

    wb.hide(reveal);
    nextButton.disabled = true;
    nextButton.textContent = last ? "What the evidence bought" : "Next case";

    update();
    wb.progress.set(index);
  }

  function update() {
    var result = analyse(CASES[index], items);

    renderChart(result);
    renderTable(result);
    describeChart(result);

    if (CASES[index].precision) {
      liveVerdict.textContent =
        "At " + items + " items per task: " + verdictName(result.verdict).toLowerCase();
    }

    return result;
  }

  /* --- Answering ------------------------------------------------------- */

  function choose(id) {
    if (answered) {
      return;
    }
    answered = true;

    var caseDef = CASES[index];
    var result = analyse(caseDef, items);
    var right = id === result.verdict;

    wb.choices.lock(optionGrid);
    Array.prototype.forEach.call(optionGrid.children, function (button) {
      var key = button.getAttribute("data-choice");
      if (key === result.verdict) {
        wb.choices.mark(button, "correct", {
          note: "This is what the evidence supports." + (right ? " This is the one you chose." : "")
        });
      } else if (key === id) {
        wb.choices.mark(button, "incorrect", {
          note: "This is the one you chose."
        });
      }
    });

    showReveal(right, caseDef, result);
    nextButton.disabled = false;
    wb.announce(
      (right ? "That is what the evidence supports: " : "The evidence supports ") +
        verdictName(result.verdict).toLowerCase() +
        ". Feedback below."
    );
  }

  function showReveal(right, caseDef, result) {
    reveal.textContent = "";

    var verdict = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = right
      ? "Yes: " + verdictName(result.verdict).toLowerCase() + "."
      : "The evidence supports " + verdictName(result.verdict).toLowerCase() + ".";
    verdict.appendChild(strong);

    var why = document.createElement("p");
    why.className = "small";
    why.textContent = caseDef.commentary;

    reveal.appendChild(verdict);
    reveal.appendChild(why);

    if (caseDef.rival) {
      var rival = document.createElement("div");
      rival.className = "reveal-grid";
      rival.style.setProperty("--reveal-columns", "1");
      rival.appendChild(rivalBox(caseDef.rival));
      reveal.appendChild(rival);
    }

    wb.show(reveal);
  }

  function rivalBox(text) {
    var box = document.createElement("div");
    box.className = text.indexOf("Ruled out") === 0 ? "mini" : "mini mini--limit";

    var title = document.createElement("strong");
    title.textContent = "The rival explanation: one task is simply harder";

    var body = document.createElement("p");
    body.textContent = text;

    box.appendChild(title);
    box.appendChild(body);
    return box;
  }

  /* --- The precision case ---------------------------------------------- */

  wb.bindRange("#items", {
    format: function (value) {
      return value + " items";
    }
  });

  itemsInput.addEventListener("input", function () {
    if (!CASES[index].precision) {
      return;
    }

    items = Number(itemsInput.value);
    var result = update();

    if (!sliderMoved) {
      sliderMoved = true;
      nextButton.disabled = false;
      showPrecisionReveal();
    }

    wb.announce(
      "At " + items + " items per task, the evidence supports " +
        verdictName(result.verdict).toLowerCase() + "."
    );
  });

  function showPrecisionReveal() {
    reveal.textContent = "";

    var lead = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = "The four percentages never changed.";
    lead.appendChild(strong);

    var why = document.createElement("p");
    why.className = "small";
    why.textContent = CASES[index].commentary;

    reveal.appendChild(lead);
    reveal.appendChild(why);
    wb.show(reveal);
  }

  /* --- Moving on ------------------------------------------------------- */

  nextButton.addEventListener("click", function () {
    if (index < CASES.length - 1) {
      index += 1;
      renderCase();
      wb.scrollTo("#case-card");
      return;
    }

    wb.progress.markAllDone();
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("All four files read. The comparison is now below.");
  });

  wb.onReset(function () {
    index = 0;
    wb.hide("#synthesis");
    wb.choices.clear(optionGrid);
    renderCase();
  });

  renderCase();
})();
