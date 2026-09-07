# Teaching notes - Sampling Distribution and p-Value Simulator (Simplified)

`simplified/modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/`

**What it teaches.** A p-value is the tail area of a sampling
distribution built by assuming the null is exactly true. Moving the
observed difference after the studies are already run recomputes p
against that same fixed pile, showing that p depends on the comparison
being made, not on the data alone.

**Before students start.** No threshold, such as .05, is named
anywhere in this activity, deliberately.

**What students do.**
1. Set the sample size, population spread, observed difference and a
   seed.
2. Run 20 studies, then run 1,000, and read the shaded tail.
3. Move the observed-difference slider afterwards without rerunning,
   and watch both the theoretical and simulated p-values update
   against the same pile of studies.

**What to look for.** The theoretical and simulated p-values agree
closely once enough studies have been run, and both change the moment
the observed difference is moved, even though nothing about the
underlying studies changed.

**Debrief.** Why does moving the observed-difference slider change p
without a single new study being run?

**Common misconception / caution.** "p is the probability the null is
true" is wrong: the simulation assumes the null before a single study
runs, so its plausibility never enters the calculation.

**Use in class / timing.** Building up a pile of studies takes about 6
to 7 minutes.
