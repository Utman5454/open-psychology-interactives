# Teaching notes - Statistical Power and Type M Error

`modules/research-methods/tools/17-statistical-power-type-m-lab/`

**What it teaches.** Power is a probability computed before a study,
for an assumed effect size; it is a plan, not a diagnosis of a
finished result. Separately, when studies are filtered down to only
the ones that reach significance, the surviving estimates
systematically overstate the true effect, and at very low power some
significant results even point the wrong way, even though every
individual study's own estimate remains unbiased on average before
that filter is applied.

**Before students start.** Power needs an assumed effect size the
researcher does not actually have yet. In practice it is an
assumption, often borrowed from published estimates this same tool
shows are inflated.

**What students do.**
1. Predict the probability of a significant result at a moderate
   effect size, twenty per group and the usual significance level.
2. In Experiment 1, drag the true effect size, the sample size and the
   significance level, and read the required sample size for a target
   power.
3. Move to Experiment 2, where the true effect is fixed and only
   sample size varies.
4. Predict what the average of only the significant estimates will
   look like compared with the true effect.
5. Run 2,000 simulated studies, or load a low-power or high-power
   preset, and compare the average of all estimates against the
   average of the significant ones.
6. Sort the closing challenge on seven statements about power and the
   error types it produces.

**What to look for.** At low power the average of all 2,000 estimates
sits right on the true effect, but the average of only the significant
ones is more than twice as large, and a handful of significant results
even point the wrong way. At high power that exaggeration mostly
disappears.

**Debrief.** The mean of all 2,000 estimates was close to the true
effect and the mean of the significant ones was much larger; which of
those is biased, and what is doing the biasing? A paper reports
"observed power was 21%, so the study was underpowered"; what is
wrong with that sentence?

**Common misconception / caution.** "Low power biases every study" is
refuted directly: the mean of all 2,000 estimates stays close to the
true effect at both low and high power, and only the significance
filter distorts the published subset. Power calculations need an
assumed effect size that is not yet known, often drawn from previous
published results this very demonstration suggests are inflated.

**Use in class / timing.** Experiment 1 on its own takes about 15
minutes to show. Both experiments with the challenge and debrief take
about 50 minutes.
