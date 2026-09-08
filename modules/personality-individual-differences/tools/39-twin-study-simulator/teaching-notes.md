# Teaching notes - Twin-Study Simulator

`modules/personality-individual-differences/tools/39-twin-study-simulator/`

**What it teaches.** Falconer's classical twin-design formula recovers
heritability, shared-environment and non-shared-environment estimates
from the gap between identical and fraternal twin correlations, and
does so reasonably well when its assumptions hold: at the default
settings the simulated estimates land close to the true 0.40/0.35/0.20
split. Breaking one assumption at a time shows each one biasing the
estimate in a specific, predictable direction, never producing an
unbiased number by accident.

**Before students start.** None needed.

**What students do.**
1. Predict what a twin study needs to assume for its heritability
   estimate to be trustworthy.
2. Read the baseline: simulated identical- and fraternal-twin
   correlations, and the heritability, shared- and
   non-shared-environment estimates Falconer's formula recovers from
   them.
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
trait that is caused by genes. When an assumption breaks, the estimate
is biased in a specific direction for that reason and that population;
it does not follow that twin studies always overestimate or always
underestimate heritability in general.

**Use in class / timing.** Working through the baseline and one
violation takes about 10 minutes. Covering all three violations and
resampling, allow 25 to 30 minutes.
