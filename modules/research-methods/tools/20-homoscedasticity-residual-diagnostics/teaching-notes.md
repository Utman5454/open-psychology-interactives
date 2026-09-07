# Teaching notes - Homoscedasticity and Residual Diagnostics

`modules/research-methods/tools/20-homoscedasticity-residual-diagnostics/`

**What it teaches.** Unequal spread of residuals across the range of
predicted values, heteroscedasticity, leaves the regression slope
itself unbiased, but corrupts the standard error used for tests and
intervals. Whether that makes an interval too narrow or too wide
depends on whether the extra variance sits at the extremes of x or in
the middle, not just on the presence of a fan shape.

**Before students start.** A fan shape in a residual plot does not
mean the slope is wrong. Say so before anyone concludes the fit itself
is bad.

**What students do.**
1. Predict which view of the data, the raw scatterplot or the
   residuals-versus-fitted plot, would show a fan shape more easily,
   and what heteroscedasticity does to the slope.
2. Choose a residual-variance pattern and a severity level, and draw a
   sample.
3. Compare the raw scatter with the residuals-versus-fitted plot and
   the standard deviations across three regions.
4. Open the disclosure comparing classical and robust standard errors,
   confidence intervals and coverage.
5. Try reading four unlabelled residual plots in the closing
   challenge.

**What to look for.** The estimated slope stays close to its true
value across every pattern and severity level tested. What changes is
how badly the classical interval's coverage misses 95%, running as low
as about 86% when the extra variance sits at both extremes, and as
high as about 99% when it sits in the middle.

**Debrief.** The widest-at-both-extremes pattern gave about 86%
coverage and the widest-in-the-middle pattern gave about 99%. Both are
heteroscedastic; what distinguishes them?

**Common misconception / caution.** "A fan means the slope is wrong"
is the one to correct: the slope stays close to its true value
throughout, only the standard error and the interval built from it are
affected. Robust standard errors are not a cure-all; they behave
poorly in very small samples and cannot repair a model whose shape is
wrong to begin with.

**Use in class / timing.** Twelve minutes covers one pattern as a
demonstration. Comparing several patterns with the challenge and
debrief takes about 40 minutes.
