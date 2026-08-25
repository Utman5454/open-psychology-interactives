/* =========================================================================
   The Same Finding, Twice — Simplified Edition
   -------------------------------------------------------------------------
   Simplified from modules/research-methods/tools/16-independent-t-test-null-lab/

   TEACHING JOB
   ------------
   The sample size enters a t-test in exactly one place, the denominator. It
   changes the test statistic and the p-value without changing the finding.

   WHAT IS PRESERVED
   -----------------
   The original's single picture: the null distribution of t with the observed
   statistic marked and the two-tailed area shaded, plus the run-it-again
   control that repeats the identical finding at a larger sample size.

   THE ARITHMETIC (equal spreads, equal group sizes)
   -------------------------------------------------
       se = sd * sqrt(2 / n)          standard error of the difference
       t  = diff / se
       df = 2n - 2
       p  = P(|T_df| >= |t|)          two-tailed, from Stats.tTwoTailedP
       d  = diff / sd                 unchanged by n, which is the point
       95% CI = diff -/+ t_crit(0.05, df) * se

   The figure draws the t density on df, the standard normal faintly behind it
   so the heavier tails are visible, the two critical values as dashed lines,
   and the observed statistic as a solid marked line with both tails shaded.

   DELIBERATELY THE PARTNER OF ACTIVITY 15
   ---------------------------------------
   Activity 15 offers a difference and a spread and NO sample size, because an
   effect size does not have one. This activity offers the same two controls
   plus n. Cohen's d is shown here as a fourth tile precisely so the learner
   can watch it sit still while t and p move, which is the distinction the two
   activities exist to draw between them.

   WHAT WAS REDUCED
   ----------------
   The one-tailed against two-tailed comparison, the extended treatment of why
   t has heavier tails than the normal, and the conclusion-writing exercise.
   A written conclusion is still generated, because "fail to reject" rather
   than "accept" is a distinction that must not be lost, but the learner reads
   it rather than composing it.

   No randomness: the inputs are summary statistics, not a sample. Nothing is
   stored and nothing leaves the browser.
   ========================================================================= */

(function () {
  "use strict";

  var wb = Workbook.attach("[data-workbook]");
  if (!wb || !window.Stats) { return; }
  var S = window.Stats;

  var ALPHA = 0.05;
  var T_SPAN = 5.2;          /* the drawn range of t, in either direction */
  var CHANGES_BEFORE_EXPLAINING = 3;

  var diffInput = document.getElementById("diff");
  var sdInput = document.getElementById("sd");
  var nInput = document.getElementById("n");
  var chart = document.getElementById("chart");
  var chartDesc = document.getElementById("chart-desc");
  var readout = document.getElementById("readout");
  var sentence = document.getElementById("sentence");
  var again = document.getElementById("again");
  var explain = document.getElementById("explain");
  var task = document.getElementById("task");
  var taskText = document.getElementById("task-text");

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  var changes = 0;
  var bigger = false;

  function diff() { return Number(diffInput.value); }
  function sd() { return Math.max(1, Number(sdInput.value)); }
  function n() { return Math.max(2, Math.round(Number(nInput.value))); }

  function test() {
    var difference = diff();
    var spread = sd();
    var size = n();
    var se = spread * Math.sqrt(2 / size);
    var t = se > 0 ? difference / se : 0;
    var df = 2 * size - 2;
    var crit = S.tCritical(ALPHA, df);
    return {
      diff: difference, sd: spread, n: size, se: se, t: t, df: df,
      p: S.tTwoTailedP(t, df),
      d: difference / spread,
      crit: crit,
      lo: difference - crit * se,
      hi: difference + crit * se
    };
  }

  /* --- The figure ------------------------------------------------------ */

  function render() {
    var r = test();
    var LEFT = 74;
    var RIGHT = 856;
    var TITLE_Y = 22;
    var TOP = 74;
    var BASE = 292;
    var TICK_Y = BASE + 22;
    var CAP_Y = BASE + 44;

    var X = function (t) {
      return LEFT + ((Math.max(-T_SPAN, Math.min(T_SPAN, t)) + T_SPAN) / (2 * T_SPAN)) * (RIGHT - LEFT);
    };
    var peak = S.tDensity(0, r.df);
    var Y = function (den) { return BASE - (den / (peak * 1.16)) * (BASE - TOP); };

    while (chart.childNodes.length > 2) { chart.removeChild(chart.lastChild); }
    chart.setAttribute("viewBox", "0 0 900 " + (CAP_Y + 18));

    var title = svg("text", { x: LEFT, y: TITLE_Y, class: "plot__label" });
    title.textContent = "What t looks like when the two populations are identical, on " +
      r.df + " degrees of freedom";
    chart.appendChild(title);

    var steps = 300;
    var pts = [];
    var i = 0;
    while (i <= steps) {
      var t = -T_SPAN + (i / steps) * (2 * T_SPAN);
      pts.push([t, S.tDensity(t, r.df), S.density(t)]);
      i += 1;
    }

    /* Both shaded tails: the two-tailed p, as an area rather than a number. */
    var obs = Math.min(Math.abs(r.t), T_SPAN);
    [-1, 1].forEach(function (side) {
      var tail = pts.filter(function (p) {
        return side > 0 ? p[0] >= obs : p[0] <= -obs;
      });
      if (tail.length < 2) { return; }
      var d = "M " + X(tail[0][0]).toFixed(1) + " " + BASE;
      tail.forEach(function (p) { d += " L " + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); });
      d += " L " + X(tail[tail.length - 1][0]).toFixed(1) + " " + BASE + " Z";
      chart.appendChild(svg("path", {
        d: d, fill: "#C0434F", "fill-opacity": "0.28", stroke: "none"
      }));
    });

    /* The standard normal, faint, behind: t has the heavier tails. */
    chart.appendChild(svg("path", {
      d: pts.map(function (p, k) {
        return (k === 0 ? "M " : "L ") + X(p[0]).toFixed(1) + " " + Y(p[2]).toFixed(1);
      }).join(" "),
      fill: "none", stroke: "#5F6878", "stroke-width": "1.4",
      "stroke-dasharray": "3 4", "stroke-opacity": "0.65"
    }));

    /* The null distribution of t. */
    chart.appendChild(svg("path", {
      d: pts.map(function (p, k) {
        return (k === 0 ? "M " : "L ") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1);
      }).join(" "),
      fill: "none", stroke: "#1C7293", "stroke-width": "2.6", "stroke-linejoin": "round"
    }));

    /* The two critical values. */
    [-r.crit, r.crit].forEach(function (c) {
      if (Math.abs(c) > T_SPAN) { return; }
      chart.appendChild(svg("line", {
        x1: X(c).toFixed(1), y1: TOP - 4, x2: X(c).toFixed(1), y2: BASE,
        stroke: "#9E7318", "stroke-width": "1.8", "stroke-dasharray": "6 5"
      }));
    });
    if (r.crit <= T_SPAN) {
      var critTag = svg("text", {
        x: X(r.crit).toFixed(1), y: TOP - 10, "text-anchor": "middle",
        class: "plot__sub plot__over", fill: "#9E7318"
      });
      critTag.textContent = "5% cut-off, t = " + r.crit.toFixed(2);
      chart.appendChild(critTag);
    }

    /* The observed statistic. */
    var clamped = Math.abs(r.t) > T_SPAN;
    chart.appendChild(svg("line", {
      x1: X(r.t).toFixed(1), y1: TOP - 30, x2: X(r.t).toFixed(1), y2: BASE,
      stroke: "#C0434F", "stroke-width": "2.8"
    }));
    var obsTag = svg("text", {
      x: X(r.t).toFixed(1), y: TOP - 36, "text-anchor": r.t > 3 ? "end" : "middle",
      class: "plot__sub plot__over", fill: "#C0434F"
    });
    obsTag.textContent = "observed t = " + r.t.toFixed(2) + (clamped ? " (off the scale)" : "");
    chart.appendChild(obsTag);

    chart.appendChild(svg("line", { x1: LEFT, y1: BASE, x2: RIGHT, y2: BASE, class: "plot__axis" }));
    [-4, -2, 0, 2, 4].forEach(function (t) {
      var tick = svg("text", { x: X(t).toFixed(1), y: TICK_Y, "text-anchor": "middle", class: "plot__tick" });
      tick.textContent = String(t);
      chart.appendChild(tick);
    });
    var cap = svg("text", {
      x: ((LEFT + RIGHT) / 2).toFixed(1), y: CAP_Y, "text-anchor": "middle", class: "plot__tick"
    });
    cap.textContent = "t";
    chart.appendChild(cap);

    renderReadout(r);
    renderSentence(r);
    describe(r);
  }

  function pstr(p) { return p < 0.001 ? "< 0.001" : p.toFixed(3); }

  function renderReadout(r) {
    readout.textContent = "";
    tile("t", r.t.toFixed(2), "on " + r.df + " degrees of freedom");
    tile("p", pstr(r.p), "two-tailed, the shaded area");
    tile("Cohen's d", r.d.toFixed(2), "unchanged by the sample size");
    tile("95% interval", r.lo.toFixed(1) + " to " + r.hi.toFixed(1),
      "for the difference, in score points");
  }

  function tile(caption, figure, note) {
    var item = document.createElement("li");
    item.className = "result";
    var strong = document.createElement("strong");
    strong.textContent = caption;
    var big = document.createElement("div");
    big.className = "big big--small";
    big.textContent = figure;
    var span = document.createElement("span");
    span.textContent = note;
    item.appendChild(strong);
    item.appendChild(big);
    item.appendChild(span);
    readout.appendChild(item);
  }

  /* The written conclusion. "Fail to reject" rather than "accept" is the one
     piece of wording the simplification is not allowed to lose. */
  function renderSentence(r) {
    if (r.p < ALPHA) {
      sentence.textContent =
        "With " + r.n + " people per group, t(" + r.df + ") = " + r.t.toFixed(2) +
        ", p " + pstr(r.p) + ". The difference of " + r.diff +
        " points is larger than this study would often produce if the two " +
        "populations were identical, so the null hypothesis is rejected. The " +
        "difference is plausibly anywhere between " + r.lo.toFixed(1) + " and " +
        r.hi.toFixed(1) + " points, and Cohen's d is " + r.d.toFixed(2) + ".";
    } else {
      sentence.textContent =
        "With " + r.n + " people per group, t(" + r.df + ") = " + r.t.toFixed(2) +
        ", p " + pstr(r.p) + ". This study cannot distinguish the two " +
        "populations, so we fail to reject the null hypothesis. Note the " +
        "wording: that is not the same as showing they are the same. The " +
        "difference is plausibly anywhere between " + r.lo.toFixed(1) + " and " +
        r.hi.toFixed(1) + " points, an interval wide enough to include values " +
        "worth caring about.";
    }
  }

  function describe(r) {
    chartDesc.textContent =
      "A symmetric bell curve centred on zero, the distribution of t on " +
      r.df + " degrees of freedom, with the standard normal drawn faintly " +
      "behind it and slightly narrower in the tails. Vertical dashed lines " +
      "mark the 5 per cent critical values at plus and minus " +
      r.crit.toFixed(2) + ". The observed t of " + r.t.toFixed(2) +
      " is marked by a solid line, and the area beyond it in both tails, " +
      "which is the two-tailed p of " + pstr(r.p) + ", is shaded. The study " +
      "compared " + r.n + " people per group with a difference of " + r.diff +
      " points and a within-group spread of " + r.sd +
      ", giving a standard error of " + r.se.toFixed(2) + " and a Cohen's d of " +
      r.d.toFixed(2) + ".";
  }

  /* --- Controls -------------------------------------------------------- */

  var ranges = ["#diff", "#sd", "#n"].map(function (sel) {
    return wb.bindRange(sel, { format: function (v) { return v; } });
  });
  function syncRanges() { ranges.forEach(function (x) { if (x) { x.sync(); } }); }

  function refresh(announce) {
    render();
    if (changes >= CHANGES_BEFORE_EXPLAINING) { explain.disabled = false; }
    if (announce) {
      var r = test();
      wb.announce("t is now " + r.t.toFixed(2) + " on " + r.df +
        " degrees of freedom, p " + pstr(r.p) + ". Cohen's d is " + r.d.toFixed(2) + ".");
    }
  }

  [diffInput, sdInput, nInput].forEach(function (input) {
    input.addEventListener("input", function () { render(); });
    input.addEventListener("change", function () { changes += 1; refresh(true); });
  });

  again.addEventListener("click", function () {
    var before = test();
    bigger = !bigger;
    nInput.value = bigger ? "100" : "15";
    syncRanges();
    changes += 1;
    var after = test();
    refresh(false);
    taskText.textContent =
      "Same difference, same spread, same people-per-group changed from " +
      before.n + " to " + after.n + ". Cohen's d was " + before.d.toFixed(2) +
      " and is still " + after.d.toFixed(2) + ". The standard error fell from " +
      before.se.toFixed(2) + " to " + after.se.toFixed(2) + ", so t went from " +
      before.t.toFixed(2) + " to " + after.t.toFixed(2) + " and p went from " +
      pstr(before.p) + " to " + pstr(after.p) +
      ". Nothing about the two populations changed. Press the button again to " +
      "go back.";
    wb.show("#task");
    wb.announce("Now " + after.n + " people per group. t is " + after.t.toFixed(2) +
      ", p " + pstr(after.p) + ", and Cohen's d is unchanged at " + after.d.toFixed(2) + ".");
  });

  explain.addEventListener("click", function () {
    wb.show("#synthesis");
    wb.scrollTo("#synthesis", { focus: true });
    wb.announce("The explanation is now below.");
  });

  wb.onReset(function () {
    changes = 0;
    bigger = false;
    diffInput.value = "4";
    sdInput.value = "10";
    nInput.value = "15";
    syncRanges();
    explain.disabled = true;
    wb.hide("#task");
    wb.hide("#synthesis");
    render();
  });

  render();
})();
