/* =========================================================================
   Visual Field Defect Mapper
   -------------------------------------------------------------------------
   Six points on a schematic visual pathway. The learner ticks which quadrants
   of which eye's field they expect to go dark, then reveals the textbook
   mapping and is marked cell by cell. The challenge runs the inference the
   other way: given a field pattern, which points are compatible?

   THE EDUCATIONAL MODEL
   ---------------------
   Everything follows from one fact. Fibres from the NASAL half of each retina
   cross at the chiasm, and the nasal retina sees the OUTER (temporal) half of
   that eye's field. So behind the chiasm each side carries the opposite half
   of the world from BOTH eyes, rather than one whole eye.

   Field quadrants are coded per eye as LU, LL, RU, RL - left-upper,
   left-lower, right-upper, right-lower of that eye's own field.

       left optic nerve      left eye: all four.  right eye: none.
       chiasm, centre        left eye: LU, LL.    right eye: RU, RL.
                             (the outer half of each eye - bitemporal)
       right optic tract     both eyes: LU, LL.
       right temporal        both eyes: LU.
         radiation
       right parietal        both eyes: LL.
         radiation
       right occipital       both eyes: LU, LL, with the centre spared.
         cortex

   The last row is identical to the optic tract row in quadrant terms, which
   is exactly the point: a field pattern locates the failure to one side and
   to somewhere behind the chiasm, and stops.

   DELIBERATE SIMPLIFICATIONS
   --------------------------
   Quadrants are a teaching fiction. Real defects have soft edges, vary in
   depth rather than being present or absent, and rarely respect a quadrant
   boundary. The mappings here are idealised textbook correspondences; real
   lesions are partial and produce incomplete, asymmetric defects far more
   often than tidy ones. The diagram is schematic and not an atlas. Nothing on
   this page examines anybody's vision or identifies a cause.

   No data leave the browser. There is no storage and no network request.
   ========================================================================= */

(function () {
  "use strict";

  var QUADRANTS = [
    { id: "LU", name: "upper-left", short: "Upper left" },
    { id: "LL", name: "lower-left", short: "Lower left" },
    { id: "RU", name: "upper-right", short: "Upper right" },
    { id: "RL", name: "lower-right", short: "Lower right" }
  ];

  var EYES = [
    { id: "left", name: "Left eye", cx: 78 },
    { id: "right", name: "Right eye", cx: 222 }
  ];

  /* =======================================================================
     The six points on the pathway
     ===================================================================== */

  var SITES = [
    {
      id: "nerve",
      label: "Left optic nerve, in front of the chiasm",
      title: "Left optic nerve",
      mark: { x: 70, y: 50 },
      lost: { left: ["LU", "LL", "RU", "RL"], right: [] },
      description: "Loss of vision in the left eye only",
      sparing: false,
      why:
        "In front of the chiasm nothing has crossed yet, so a nerve carries " +
        "one eye and only one eye. Damage anywhere along it removes that eye's " +
        "whole field and leaves the other untouched. A defect confined to one " +
        "eye is therefore in front of the chiasm - which is the single most " +
        "useful thing a field examination tells you."
    },
    {
      id: "chiasm",
      label: "Centre of the chiasm, where the fibres cross",
      title: "Centre of the chiasm",
      mark: { x: 113, y: 71 },
      lost: { left: ["LU", "LL"], right: ["RU", "RL"] },
      description: "Loss of the outer half of each eye's field",
      sparing: false,
      why:
        "The crossing fibres come from the nasal half of each retina, and the " +
        "nasal retina sees the OUTER half of that eye's field. Damage in the " +
        "middle of the chiasm therefore takes the outer half of both fields - " +
        "the left of the left eye and the right of the right eye. Note that " +
        "the two missing halves are on opposite sides of the world, which is " +
        "why this pattern is unmistakable and why nothing behind the chiasm " +
        "can produce it."
    },
    {
      id: "tract",
      label: "Right optic tract, just behind the chiasm",
      title: "Right optic tract",
      mark: { x: 170, y: 93 },
      lost: { left: ["LU", "LL"], right: ["LU", "LL"] },
      description: "Loss of the left half of the world in both eyes",
      sparing: false,
      why:
        "Behind the chiasm each side carries the opposite half of the world " +
        "from both eyes. The right tract carries the left half of the world, " +
        "so damage to it removes the left half of both fields with a border " +
        "down the vertical midline. The two eyes' defects are often slightly " +
        "different in extent here - the fibres from the two eyes are not yet " +
        "fully intermingled - which is the traditional clue that a defect is " +
        "this far forward."
    },
    {
      id: "temporal",
      label: "Right optic radiation, the loop through the temporal lobe",
      title: "Right temporal radiation",
      mark: { x: 274, y: 116 },
      lost: { left: ["LU"], right: ["LU"] },
      description: "Loss of the upper-left quadrant in both eyes",
      sparing: false,
      why:
        "The radiation splits. Fibres carrying the UPPER part of the opposite " +
        "field sweep forward and down into the temporal lobe before turning " +
        "back, so damage there removes the upper quadrant on the opposite " +
        "side in both eyes. A quadrant defect is one of the few field findings " +
        "that narrows the location usefully - it says the damage is in the " +
        "radiation rather than the tract, and which part of it."
    },
    {
      id: "parietal",
      label: "Right optic radiation, the part running through the parietal lobe",
      title: "Right parietal radiation",
      mark: { x: 274, y: 90 },
      lost: { left: ["LL"], right: ["LL"] },
      description: "Loss of the lower-left quadrant in both eyes",
      sparing: false,
      why:
        "The other half of the radiation runs more directly back through the " +
        "parietal lobe and carries the LOWER part of the opposite field. " +
        "Damage there removes the lower quadrant on the opposite side in both " +
        "eyes. Take the two radiation cases together and you have the tract " +
        "case - which is the first hint that adding up quadrants does not tell " +
        "you where the damage was."
    },
    {
      id: "occipital",
      label: "Right occipital cortex",
      title: "Right occipital cortex",
      mark: { x: 329, y: 100 },
      lost: { left: ["LU", "LL"], right: ["LU", "LL"] },
      description: "Loss of the left half of the world in both eyes, centre often spared",
      sparing: true,
      why:
        "In quadrant terms this is identical to the optic tract case, and that " +
        "is the honest answer to whether a field pattern localises damage: it " +
        "says which side and that the damage is behind the chiasm, and it " +
        "stops. The traditional additional clues are congruity - the two eyes' " +
        "defects match closely this far back - and sparing of the very centre " +
        "of the field, drawn here as an unaffected disc. Both are clues rather " +
        "than proof; why macular sparing happens is still argued about, and " +
        "imaging is what settles the question in practice."
    }
  ];

  /* =======================================================================
     The challenge - which sites produce a complete left homonymous defect?
     ===================================================================== */

  var CHALLENGE_OPTIONS = [
    { id: "nerve", label: "Left optic nerve", correct: false,
      why: "would affect one eye only, and this defect is in both" },
    { id: "chiasm", label: "Centre of the chiasm", correct: false,
      why: "would take the outer half of each eye - opposite halves of the world, not the same half" },
    { id: "tract", label: "Right optic tract", correct: true,
      why: "carries the left half of the world from both eyes" },
    { id: "lgn", label: "Right lateral geniculate nucleus", correct: true,
      why: "sits between the tract and the radiation and carries the same thing; it is not a separate point in the mapper above, and it produces the same pattern" },
    { id: "bothrad", label: "Both halves of the right optic radiation together", correct: true,
      why: "upper quadrant plus lower quadrant is the whole half" },
    { id: "temporal", label: "Right temporal radiation alone", correct: false,
      why: "would leave the lower quadrant intact" },
    { id: "occipital", label: "Right occipital cortex", correct: true,
      why: "carries the left half of the world; usually with the centre spared, which was not mentioned in the case" },
    { id: "leftocc", label: "Left occipital cortex", correct: false,
      why: "carries the RIGHT half of the world, so it would produce the mirror image" }
  ];

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

  function siteById(id) {
    return SITES.filter(function (s) { return s.id === id; })[0];
  }

  function describeLoss(list) {
    if (list.length === 0) { return "nothing lost"; }
    if (list.length === 4) { return "the whole field"; }
    return list.map(function (id) {
      return QUADRANTS.filter(function (q) { return q.id === id; })[0].name;
    }).join(" and ");
  }

  /* =======================================================================
     Wiring
     ===================================================================== */

  var shell = InteractiveShell.attach("#fields");
  if (!shell) { return; }

  var $ = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  var siteControls = $("[data-site-controls]");
  var predictHosts = { left: $("[data-predict-left]"), right: $("[data-predict-right]") };
  var pathwaySvg = $("[data-pathway]");
  var pathwayLegend = $("[data-pathway-legend]");
  var fieldSvg = $("[data-fieldchart]");
  var fieldsCaption = $("[data-fields-caption]");
  var siteTitle = $("[data-site-title]");
  var siteBrief = $("[data-site-brief]");
  var revealFeedback = $("[data-reveal-feedback]");
  var quadrantTable = $("[data-quadrant-table]");
  var summaryTable = $("[data-summary-table]");
  var controlsForm = $("[data-interactive-controls]");

  var openingForm = $("#opening-form");
  var openingError = $("[data-opening-error]");
  var openingFeedback = $("[data-opening-feedback]");
  var mapperSection = $("#mapper-section");

  var challengeForm = $("#challenge-form");
  var challengeOptions = $("[data-challenge-options]");
  var challengeError = $("[data-challenge-error]");
  var challengeFeedback = $("[data-challenge-feedback]");

  var state = { site: "nerve", predicted: { left: {}, right: {} }, revealed: false };

  /* --- Controls, built once --------------------------------------------- */

  SITES.forEach(function (site, index) {
    var label = make("label", "control--choice");
    var input = document.createElement("input");
    input.type = "radio";
    input.name = "site";
    input.value = site.id;
    input.checked = index === 0;
    input.addEventListener("change", function () {
      state.site = site.id;
      state.revealed = false;
      state.predicted = { left: {}, right: {} };
      syncPredictions();
      revealFeedback.hidden = true;
      render();
      shell.announce(
        site.title + " selected. Prediction cleared - tick the quadrants you " +
        "expect to go dark.", { immediate: true });
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(site.label));
    siteControls.appendChild(label);
  });

  EYES.forEach(function (eye) {
    QUADRANTS.forEach(function (quadrant) {
      var label = make("label", "control--choice");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("data-eye", eye.id);
      input.setAttribute("data-quadrant", quadrant.id);
      input.addEventListener("change", function () {
        state.predicted[eye.id][quadrant.id] = input.checked;
        if (!input.checked) { delete state.predicted[eye.id][quadrant.id]; }
        if (state.revealed) {
          /* Changing a prediction after the reveal would make the marking
             meaningless, so the reveal is withdrawn and has to be redone. */
          state.revealed = false;
          revealFeedback.hidden = true;
        }
        render();
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(quadrant.short));
      predictHosts[eye.id].appendChild(label);
    });
  });

  function syncPredictions() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-quadrant]"),
      function (input) {
        var eye = input.getAttribute("data-eye");
        var quadrant = input.getAttribute("data-quadrant");
        input.checked = Boolean(state.predicted[eye][quadrant]);
      });
  }

  controlsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    reveal();
  });

  /* --- Rendering -------------------------------------------------------- */

  function render() {
    var site = siteById(state.site);
    siteTitle.textContent = state.revealed
      ? site.title + " - revealed"
      : site.title + " - predict first";
    siteBrief.textContent = state.revealed
      ? site.description + ". Read the explanation, then try another point."
      : "Tick the quadrants you expect to go dark before you reveal anything - " +
        "the reveal is worth much less if you have already seen it.";
    fieldsCaption.textContent = state.revealed
      ? "The field pattern, with your prediction marked by a dot"
      : "Your prediction so far - dots mark the quadrants you have ticked";

    drawPathway(site);
    drawFields(site);
    renderQuadrantTable(site);
    renderSummaryTable();
  }

  /* The schematic pathway, left to right: eyes, optic nerves, the chiasm drawn
     as a visible crossing, the tracts, a relay box on each side, two routes of
     the radiation on each side, and the occipital cortex. The two sides are
     marked L and R inside the relay boxes; the six damage points sit on the
     structure they name. Nothing is to scale and the layout carries no
     spatial meaning. */
  function drawPathway(site) {
    clear(pathwaySvg);

    [[28, 40, 20, "left eye"], [28, 102, 128, "right eye"]].forEach(function (eye) {
      pathwaySvg.appendChild(svgEl("circle", {
        cx: eye[0], cy: eye[1], r: 13, class: "fields__eye"
      }));
      pathwaySvg.appendChild(svgText(28, eye[2], "chart__axis", "middle", eye[3]));
    });

    /* Optic nerves into the chiasm */
    pathwaySvg.appendChild(svgEl("line", { x1: 41, y1: 40, x2: 100, y2: 60, class: "fields__tract" }));
    pathwaySvg.appendChild(svgEl("line", { x1: 41, y1: 102, x2: 100, y2: 82, class: "fields__tract" }));

    /* The chiasm, drawn as an X so that the crossing is visible */
    pathwaySvg.appendChild(svgEl("line", { x1: 100, y1: 60, x2: 126, y2: 82, class: "fields__cross-fibre" }));
    pathwaySvg.appendChild(svgEl("line", { x1: 100, y1: 82, x2: 126, y2: 60, class: "fields__cross-fibre" }));
    pathwaySvg.appendChild(svgText(113, 48, "chart__axis", "middle", "chiasm"));

    /* Tracts */
    pathwaySvg.appendChild(svgEl("line", { x1: 126, y1: 60, x2: 200, y2: 42, class: "fields__tract" }));
    pathwaySvg.appendChild(svgEl("line", { x1: 126, y1: 82, x2: 200, y2: 100, class: "fields__tract" }));

    /* Radiations: an upper (parietal) and a lower (temporal, forward-looping)
       route on each side. */
    [
      "M 236 42 Q 274 22 314 42",
      "M 236 42 Q 274 62 314 42",
      "M 236 100 Q 274 80 314 100",
      "M 236 100 Q 274 132 314 100"
    ].forEach(function (d) {
      pathwaySvg.appendChild(svgEl("path", { d: d, class: "fields__tract" }));
    });

    /* Relay boxes, labelled with the side of the brain they belong to */
    [[31, "L"], [89, "R"]].forEach(function (box) {
      pathwaySvg.appendChild(svgEl("rect", {
        x: 210, y: box[0], width: 26, height: 22, rx: 4, class: "fields__relay"
      }));
      pathwaySvg.appendChild(
        svgText(223, box[0] + 16, "fields__side", "middle", box[1]));
    });

    /* Occipital cortex */
    [29, 87].forEach(function (y) {
      pathwaySvg.appendChild(svgEl("rect", {
        x: 314, y: y, width: 30, height: 26, rx: 4, class: "fields__cortex"
      }));
    });
    pathwaySvg.appendChild(svgText(329, 20, "chart__axis", "middle", "occipital"));
    pathwaySvg.appendChild(svgText(274, 74, "chart__axis", "middle", "parietal route"));
    pathwaySvg.appendChild(svgText(274, 152, "chart__axis", "middle", "temporal loop"));
    pathwaySvg.appendChild(
      svgText(6, 160, "chart__axis", "start", "L and R mark the two sides of the brain"));

    /* The damage marker */
    pathwaySvg.appendChild(svgEl("circle", {
      cx: site.mark.x, cy: site.mark.y, r: 10, class: "fields__damage"
    }));
    pathwaySvg.appendChild(
      svgText(site.mark.x, site.mark.y + 5, "fields__damage-mark", "middle", "×"));

    /* The drawing's visible text equivalent. The cross is the only thing on
       the diagram that moves, so naming where it sits says everything the
       picture says. */
    pathwayLegend.textContent =
      "Eyes, nerves, chiasm, tracts, relays, radiation, occipital cortex, " +
      "left to right, not to scale. The cross is on the " +
      site.label.toLowerCase() + ".";
  }

  function drawFields(site) {
    var R = 52;
    var CY = 74;

    clear(fieldSvg);

    EYES.forEach(function (eye) {
      var lost = state.revealed ? site.lost[eye.id] : [];

      QUADRANTS.forEach(function (quadrant) {
        var isLost = lost.indexOf(quadrant.id) !== -1;
        fieldSvg.appendChild(svgEl("path", {
          d: wedge(eye.cx, CY, R, quadrant.id),
          class: "fields__quadrant" + (isLost ? " fields__quadrant--lost" : "")
        }));
      });

      /* Dividing lines and outline on top of the wedges. */
      fieldSvg.appendChild(svgEl("circle", {
        cx: eye.cx, cy: CY, r: R, class: "fields__outline"
      }));
      fieldSvg.appendChild(svgEl("line", {
        x1: eye.cx - R, y1: CY, x2: eye.cx + R, y2: CY, class: "fields__divider"
      }));
      fieldSvg.appendChild(svgEl("line", {
        x1: eye.cx, y1: CY - R, x2: eye.cx, y2: CY + R, class: "fields__divider"
      }));

      /* Macular sparing, drawn as an unaffected disc at the centre. */
      if (state.revealed && site.sparing) {
        fieldSvg.appendChild(svgEl("circle", {
          cx: eye.cx, cy: CY, r: 13, class: "fields__spared"
        }));
      }

      /* The learner's prediction, as a dot in each ticked quadrant. */
      QUADRANTS.forEach(function (quadrant) {
        if (!state.predicted[eye.id][quadrant.id]) { return; }
        var offset = quadrantOffset(quadrant.id, R * 0.55);
        fieldSvg.appendChild(svgEl("circle", {
          cx: eye.cx + offset[0], cy: CY + offset[1], r: 5, class: "fields__predicted"
        }));
      });

      /* Lost quadrants also carry a cross, so the fill is never the only cue. */
      lost.forEach(function (id) {
        var offset = quadrantOffset(id, R * 0.78);
        fieldSvg.appendChild(
          svgText(eye.cx + offset[0], CY + offset[1] + 5, "fields__lost-mark", "middle", "×"));
      });

      fieldSvg.appendChild(
        svgText(eye.cx, CY + R + 20, "chart__axis", "middle", eye.name + "'s field"));
    });

    fieldSvg.appendChild(svgText(6, CY + 4, "chart__axis", "start", "L"));
    fieldSvg.appendChild(svgText(294, CY + 4, "chart__axis", "end", "R"));
    fieldSvg.appendChild(svgText(150, 164, "chart__axis", "middle",
      "× marks a part of the field that is lost; a dot marks a part you predicted"));
  }

  function wedge(cx, cy, r, id) {
    var map = {
      LU: [[-r, 0], [0, -r], 1],
      RU: [[0, -r], [r, 0], 1],
      RL: [[r, 0], [0, r], 1],
      LL: [[0, r], [-r, 0], 1]
    };
    var entry = map[id];
    return "M " + cx + " " + cy +
      " L " + (cx + entry[0][0]) + " " + (cy + entry[0][1]) +
      " A " + r + " " + r + " 0 0 " + entry[2] + " " +
      (cx + entry[1][0]) + " " + (cy + entry[1][1]) + " Z";
  }

  function quadrantOffset(id, distance) {
    var d = distance / Math.SQRT2;
    if (id === "LU") { return [-d, -d]; }
    if (id === "RU") { return [d, -d]; }
    if (id === "RL") { return [d, d]; }
    return [-d, d];
  }

  function renderQuadrantTable(site) {
    clear(quadrantTable);
    EYES.forEach(function (eye) {
      QUADRANTS.forEach(function (quadrant, index) {
        var predicted = Boolean(state.predicted[eye.id][quadrant.id]);
        var actual = site.lost[eye.id].indexOf(quadrant.id) !== -1;
        var tr = make("tr");

        if (index === 0) {
          var th = make("th", null, eye.name);
          th.setAttribute("scope", "row");
          th.setAttribute("rowspan", String(QUADRANTS.length));
          tr.appendChild(th);
        }
        tr.appendChild(make("td", null, quadrant.short));
        tr.appendChild(make("td", null, predicted ? "lost" : "intact"));
        tr.appendChild(make("td", null,
          state.revealed ? (actual ? "lost" : "intact") : "not revealed yet"));
        if (state.revealed && predicted !== actual) { tr.className = "fields__miss"; }
        quadrantTable.appendChild(tr);
      });
    });
  }

  function renderSummaryTable() {
    clear(summaryTable);
    SITES.forEach(function (site) {
      var tr = make("tr");
      var th = make("th", null, site.title);
      th.setAttribute("scope", "row");
      tr.appendChild(th);
      tr.appendChild(make("td", null, describeLoss(site.lost.left)));
      tr.appendChild(make("td", null, describeLoss(site.lost.right)));
      tr.appendChild(make("td", null, site.description));
      if (site.id === state.site) { tr.className = "fields__current"; }
      summaryTable.appendChild(tr);
    });
  }

  /* --- The reveal -------------------------------------------------------- */

  function reveal() {
    var site = siteById(state.site);
    state.revealed = true;

    var misses = [];
    var hits = 0;
    EYES.forEach(function (eye) {
      QUADRANTS.forEach(function (quadrant) {
        var predicted = Boolean(state.predicted[eye.id][quadrant.id]);
        var actual = site.lost[eye.id].indexOf(quadrant.id) !== -1;
        if (predicted === actual) { hits += 1; }
        else {
          misses.push({
            eye: eye, quadrant: quadrant, predicted: predicted, actual: actual
          });
        }
      });
    });

    render();

    clear(revealFeedback);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      hits === 8 ? "All eight quadrants right." : hits + " of the 8 quadrants right."));
    lead.appendChild(document.createTextNode(
      " The mapping gives: " + site.description.toLowerCase() + "."));
    revealFeedback.appendChild(lead);

    if (misses.length) {
      var missed = make("p");
      missed.appendChild(make("strong", null, "Where you and the mapping differ: "));
      missed.appendChild(document.createTextNode(
        misses.map(function (miss) {
          return miss.eye.name.toLowerCase() + ", " + miss.quadrant.name + " - " +
            (miss.actual ? "lost, and you had it intact" : "intact, and you had it lost");
        }).join("; ") + "."));
      revealFeedback.appendChild(missed);
    }

    revealFeedback.appendChild(make("p", null, site.why));

    if (site.sparing) {
      revealFeedback.appendChild(make("p", "text-muted",
        "The unaffected disc at the centre of each field is macular sparing. " +
        "It is drawn because every textbook draws it; why it happens is still " +
        "argued about, and it is a clue rather than proof."));
    }

    revealFeedback.setAttribute("data-tone", hits === 8 ? "good" : "caution");
    revealFeedback.hidden = false;

    shell.announce(
      hits + " of 8 quadrants correct. " + site.title + " gives " +
      site.description.toLowerCase() + ".", { immediate: true });
  }

  /* --- Opening prediction ----------------------------------------------- */

  var OPENING = {
    nasal: {
      tone: "good",
      verdict: "Yes.",
      text:
        "Nasal retina, temporal field. The nasal half of each retina looks " +
        "outwards, so the fibres that cross carry the outer half of each eye's " +
        "view of the world. That is why damage in the middle of the chiasm " +
        "takes the outer half of both fields, and why everything behind the " +
        "chiasm carries the opposite half of the world rather than one whole " +
        "eye."
    },
    temporal: {
      tone: "caution",
      verdict: "The two halves are the other way round.",
      text:
        "The temporal half of each retina sees the INNER (nasal) half of that " +
        "eye's field, and those fibres stay on their own side. It is the nasal " +
        "retina that crosses, and it sees the outer field. Work the first case " +
        "in the mapper and the second, and the logic falls into place quickly."
    },
    all: {
      tone: "caution",
      verdict: "That would make the pattern useless.",
      text:
        "If every fibre crossed, each hemisphere would carry one whole eye and " +
        "a defect behind the chiasm would look like a defect in front of it. " +
        "The reason a field examination can tell you which side of the chiasm " +
        "the damage is on is precisely that only half the fibres cross."
    },
    unsure: {
      tone: "good",
      verdict: "Fair enough - it is worth deriving rather than memorising.",
      text:
        "Two facts generate everything: the nasal half of each retina crosses, " +
        "and the nasal retina sees the outer half of that eye's field. Start " +
        "with the first case in the mapper, where nothing has crossed yet, and " +
        "build from there."
    }
  };

  openingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var answer = $('input[name="opening"]:checked', openingForm);
    if (!answer) {
      openingError.textContent = "Choose an answer before opening the mapper.";
      openingError.hidden = false;
      return;
    }
    openingError.hidden = true;
    var entry = OPENING[answer.value];
    showFeedback(openingFeedback, entry.tone, entry.verdict, entry.text);
    unlockMapper();
  });

  $('[data-action="skip-opening"]').addEventListener("click", function () {
    openingError.hidden = true;
    showFeedback(openingFeedback, "neutral",
      "Prediction skipped - demonstration mode.", "");
    unlockMapper();
  });

  function unlockMapper() {
    lockForm(openingForm);
    mapperSection.hidden = false;
    render();
    $("#mapper-heading").focus();
    shell.announce("Mapper open. Left optic nerve selected.", { immediate: true });
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

    var correct = CHALLENGE_OPTIONS.filter(function (o) { return o.correct; });
    var missed = correct.filter(function (o) { return chosen.indexOf(o.id) === -1; });
    var wrong = CHALLENGE_OPTIONS.filter(function (o) {
      return !o.correct && chosen.indexOf(o.id) !== -1;
    });

    clear(challengeFeedback);
    var lead = make("p");
    lead.appendChild(make("strong", "feedback__verdict",
      missed.length === 0 && wrong.length === 0
        ? "All four, and nothing else."
        : "Not the full set."));
    lead.appendChild(document.createTextNode(
      " Four of the eight points are compatible: the right optic tract, the " +
      "right lateral geniculate nucleus, both halves of the right optic " +
      "radiation together, and the right occipital cortex. A complete " +
      "homonymous defect says which side and that the damage is behind the " +
      "chiasm. It does not say which structure."));
    challengeFeedback.appendChild(lead);

    if (missed.length) {
      challengeFeedback.appendChild(make("p", null,
        "You left out: " + missed.map(function (o) {
          return o.label.toLowerCase() + " (" + o.why + ")";
        }).join("; ") + "."));
    }
    if (wrong.length) {
      challengeFeedback.appendChild(make("p", null,
        "Not these: " + wrong.map(function (o) {
          return o.label.toLowerCase() + " - " + o.why;
        }).join("; ") + "."));
    }

    challengeFeedback.appendChild(make("p", "text-muted",
      "What narrows it further is not the field pattern. Congruity - how " +
      "closely the two eyes' defects match - and sparing of the very centre of " +
      "the field are the traditional clues, and both are unreliable enough " +
      "that imaging is what decides it. The rest of the examination usually " +
      "contributes more than the field chart does."));

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
    state = { site: "nerve", predicted: { left: {}, right: {} }, revealed: false };
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-site-controls] input'),
      function (input) { input.checked = input.value === "nerve"; });
    syncPredictions();
    unlockForm(openingForm);
    openingFeedback.hidden = true;
    openingError.hidden = true;
    mapperSection.hidden = true;
    revealFeedback.hidden = true;
    challengeForm.reset();
    challengeFeedback.hidden = true;
    challengeError.hidden = true;
    render();
  });

  /* --- Start-up --------------------------------------------------------- */

  shell.reset({ silent: true });
  shell.announce(
    "Ready. Answer the question above to open the mapper.",
    { immediate: true });
})();
