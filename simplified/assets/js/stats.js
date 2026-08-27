/* =========================================================================
   Open Psychology Interactives — Simplified Edition
   stats.js — the distribution functions the statistical activities share
   -------------------------------------------------------------------------
   Optional, like patterns.css. Load it before an activity that needs it:

       <script src="../../../../assets/js/stats.js" defer></script>

   It exists because four activities in Research Methods alone need the same
   incomplete beta function, and a copy in each is a copy to get wrong in
   each. Nothing here knows anything about psychology; it is arithmetic.

   Same conservative syntax as the rest of the collection, and a global
   rather than a module so a downloaded folder still works over file://.

   ACCURACY
   --------
   phi          Abramowitz and Stegun 26.2.17, absolute error below 1.5e-7
   logGamma     Lanczos, g = 5, n = 6
   betacf       continued fraction, 300 iterations, tolerance 3e-14
   Every one is ample for figures printed to three decimal places.
   ========================================================================= */

(function (global) {
  "use strict";

  /** Seeded uniform in [0, 1). */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** One standard normal draw, Box-Muller. */
  function normalDraw(random) {
    var u = Math.max(random(), 1e-12);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  }

  /** Standard normal cumulative distribution. */
  function phi(z) {
    var s = z < 0 ? -1 : 1;
    var x = Math.abs(z) / Math.SQRT2;
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return 0.5 * (1 + s * y);
  }

  /**
   * Normal density. Called with one argument it is the standard normal
   * density of a z. Given a mean and a standard deviation it is the density
   * of the raw value x, scaled by 1/sigma so the area under the curve is
   * still one: that scaling is why widening a distribution lowers its peak.
   */
  function density(x, mu, sigma) {
    var m = mu === undefined ? 0 : mu;
    var s = sigma === undefined ? 1 : sigma;
    var z = (x - m) / s;
    return Math.exp(-0.5 * z * z) / (s * Math.sqrt(2 * Math.PI));
  }

  function logGamma(x) {
    var c = [76.18009172947146, -86.50532032941677, 24.01409824083091,
             -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x;
    var tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    var ser = 1.000000000190015;
    var j = 0;
    while (j < 6) { y += 1; ser += c[j] / y; j += 1; }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function betacf(a, b, x) {
    var MAXIT = 300, EPS = 3e-14, FPMIN = 1e-300;
    var qab = a + b, qap = a + 1, qam = a - 1;
    var c = 1, d = 1 - (qab * x) / qap;
    if (Math.abs(d) < FPMIN) { d = FPMIN; }
    d = 1 / d;
    var h = d, m = 1;
    while (m <= MAXIT) {
      var m2 = 2 * m;
      var aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d; h *= d * c;
      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) { d = FPMIN; }
      c = 1 + aa / c; if (Math.abs(c) < FPMIN) { c = FPMIN; }
      d = 1 / d;
      var del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) { break; }
      m += 1;
    }
    return h;
  }

  /** Regularised incomplete beta. */
  function betai(a, b, x) {
    if (x <= 0) { return 0; }
    if (x >= 1) { return 1; }
    var bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) +
      a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2)
      ? (bt * betacf(a, b, x)) / a
      : 1 - (bt * betacf(b, a, 1 - x)) / b;
  }

  /**
   * TWO-TAILED p for Student's t: P(|T_df| >= |t|). Named in full because
   * "tail" alone reads as one tail and inviting a caller to double it is how
   * every p-value on a page silently comes out twice its true size.
   */
  function tTwoTailedP(t, df) {
    if (!isFinite(t) || df <= 0) { return 1; }
    return betai(df / 2, 0.5, df / (df + t * t));
  }

  /** Upper-tail p for F. */
  function fTail(f, df1, df2) {
    if (!isFinite(f) || f <= 0 || df1 <= 0 || df2 <= 0) { return 1; }
    return betai(df2 / 2, df1 / 2, df2 / (df2 + df1 * f));
  }

  /** Two-tailed critical t, by bisection on the tail area. */
  function tCritical(alpha, df) {
    var lo = 0, hi = 100, i = 0;
    while (i < 200) {
      var mid = (lo + hi) / 2;
      if (tTwoTailedP(mid, df) > alpha) { lo = mid; } else { hi = mid; }
      i += 1;
    }
    return (lo + hi) / 2;
  }

  /** Student's t density, for drawing a reference curve. */
  function tDensity(t, df) {
    return Math.exp(
      logGamma((df + 1) / 2) - logGamma(df / 2) -
      0.5 * Math.log(df * Math.PI) -
      ((df + 1) / 2) * Math.log(1 + (t * t) / df)
    );
  }

  function mean(values) {
    return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
  }

  /** Sample variance, n minus 1. */
  function variance(values) {
    var m = mean(values);
    return values.reduce(function (acc, v) {
      return acc + (v - m) * (v - m);
    }, 0) / (values.length - 1);
  }

  global.Stats = {
    mulberry32: mulberry32,
    normalDraw: normalDraw,
    phi: phi,
    density: density,
    logGamma: logGamma,
    betai: betai,
    tTwoTailedP: tTwoTailedP,
    fTail: fTail,
    tCritical: tCritical,
    tDensity: tDensity,
    mean: mean,
    variance: variance
  };
})(window);
