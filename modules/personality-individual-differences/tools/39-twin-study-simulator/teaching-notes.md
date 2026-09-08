# Teaching notes - Twin-Study Simulator

`modules/personality-individual-differences/tools/39-twin-study-simulator/`

**What it teaches.** Falconer's classical twin-design formula recovers
heritability and shared-environment estimates from the gap between
identical and fraternal twin correlations, and does so reasonably well
when its assumptions hold: at the default settings, genetic variance
0.40, shared environment 0.35, non-shared environment 0.20 and
measurement error 0.05, the simulated estimates land close to those
true values, once the formula's non-shared-environment row is compared
against 0.25, since Falconer's `e² = 1 − r(MZ)` absorbs measurement
error together with non-shared environment. Breaking one assumption at
a time biases the estimate in a specific, predictable direction for
that assumption; two violations pulling in opposite directions could
still partly mask one another.

**Before students start.** Students should already have met the idea of a correlation
coefficient; none of the simulated twin pairs is real, and a fresh
sample can be drawn at any time from the seed shown.

**What students do.**
1. Predict what a twin study needs to assume for its heritability
   estimate to be trustworthy.
2. Read the baseline: the simulated twin correlations and the
   heritability and environment estimates Falconer's formula recovers
   from them.
3. Turn on unequal environments, assortative mating and a
   gene-environment correlation, one at a time, and watch which
   correlation moves and which estimate is thrown off.
4. Resample new pairs at the same settings and see how much the
   estimates move from sampling alone.

**What to look for.** At the default settings the simulated estimates
land within a few hundredths of the true values. Turning on unequal
environments lowers the fraternal correlation without moving the
identical correlation, which inflates the heritability estimate and
can drive the shared-environment estimate to zero. Assortative mating
raises the fraternal correlation instead, which understates
heritability, the opposite direction from unequal environments. A
gene-environment correlation raises the identical correlation and
lowers the fraternal one together, again inflating heritability.
Resampling at unchanged settings moves the heritability estimate by
several points on its own, a swing worth taking seriously before
trusting any single study's number.

**Debrief.** Two violations both inflate the heritability estimate,
but for different reasons. What is actually going wrong in each case,
and how would a researcher tell which one had happened?

**Common misconception / caution.** Heritability here is a property
of this particular simulated population under these particular
assumptions, not a fixed constant or a percentage of any individual's
trait caused by genes. An assumption breaking biases the estimate in a
specific direction for that reason and that population; it does not
follow that twin studies always over- or underestimate heritability in
general.

**Use in class / timing.** Working through the baseline and one
violation takes about 10 minutes. Covering all three violations and
resampling, allow 25 to 30 minutes.
