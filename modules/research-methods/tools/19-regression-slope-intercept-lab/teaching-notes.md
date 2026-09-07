# Teaching notes - Regression: Intercept, Slope and Least Squares

`modules/research-methods/tools/19-regression-slope-intercept-lab/`

**What it teaches.** Least squares picks the one line that minimises
the sum of squared residuals, found in closed form rather than
searched for by hand, and no other line can beat it on that criterion.
The intercept is a prediction at x equals zero, which can sit far
outside the data actually collected, and centring x on its mean
changes the intercept without changing the slope, the predictions, or
the fit.

**Before students start.** A prediction inside the range of x actually
observed is a different kind of claim from one outside it. Raise this
before the extrapolation question comes up.

**What students do.**
1. Predict what least squares actually minimises, and whether a
   learner can beat it by hand.
2. Adjust the intercept and slope sliders against thirty fixed points,
   watching the sum of squared residuals.
3. Reveal the least-squares line and compare it with your own best
   attempt.
4. Look at the same fit with x centred on its mean.
5. Predict a score at 55 minutes and at 0 minutes, then judge which
   prediction is reportable.

**What to look for.** No combination of slider settings beats the
revealed least-squares line's sum of squared residuals. A deliberately
bad line can produce a negative R-squared, meaning it fits worse than
simply predicting the mean for everyone.

**Debrief.** Read the slope aloud as a sentence about people, then
read it as a sentence about an intervention. Which is licensed by this
design? What is the intercept a prediction for, and who does that
describe?

**Common misconception / caution.** "Least squares minimises the
residuals" is the correction to make directly: the plain sum of
residuals is zero for any least-squares line, since positive and
negative errors cancel; it is the sum of squared residuals that is
minimised. The slope compares people who differ in x; it does not say
what would happen if one person's x changed, so it is not a causal
effect.

**Use in class / timing.** The hand-fitting exercise on its own takes
about 10 minutes. With the extrapolation challenge and debrief, a full
session takes about 40 minutes.
