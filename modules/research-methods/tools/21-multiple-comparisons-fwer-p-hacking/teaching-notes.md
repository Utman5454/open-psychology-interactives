# Teaching notes - Multiple Comparisons, FWER and Forking Paths

`modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/`

**What it teaches.** Running twenty independent tests at the .05
level on data with no real effect anywhere gives a much higher than 5%
chance that at least one comes out significant, even though each
individual test still behaves exactly as advertised on its own. A
family-wise error rate is a property of the whole family of tests, not
of any one comparison in it.

**Before students start.** Every test in Experiment 1 is genuinely run
at its stated significance level. Nothing about an individual test is
broken here, only what happens when many are pooled.

**What students do.**
1. Predict the chance that at least one of twenty independent
   true-null tests comes out significant at the .05 level.
2. Set the number of tests, and, behind a disclosure, how many carry a
   real effect, then run one experiment, then a thousand.
3. Apply a Bonferroni correction and compare the false-positive and
   detection rates.
4. Move to Experiment 2, and choose an outcome, an exclusion rule, a
   subgroup and a covariate over a fixed dataset built with no real
   effect in it anywhere.
5. Try several different analytic choices on the same null dataset,
   then reveal every path at once.
6. Sort four fictional studies into planned, exploratory, selectively
   reported or confirmatory in the closing challenge.

**What to look for.** With twenty true-null tests and no correction,
roughly six in ten runs of the whole experiment produce at least one
false positive. Applying the Bonferroni correction brings that down
sharply, at the cost of also missing more of the real effects that are
present. In Experiment 2, several of the 72 analytic paths through a
dataset built with zero true effect still reach p below .05 by chance
alone.

**Debrief.** Every test used alpha of .05, and most experiments
produced at least one false positive anyway; which of those two facts
is wrong? Neither, they are answers to different questions. In
Experiment 2 you ran one test and reported one p-value; what is there
to correct for?

**Common misconception / caution.** "Each test is fine, so the study
is fine" is the misconception the family-wise rate is built to
puncture: every test can behave exactly as advertised and the whole
family still carries a much higher error rate. Experiment 2 is a
demonstration of harm, not a technique; nothing in it is a defensible
way to analyse real data, since the dataset was built with no true
effect anywhere in it.

**Use in class / timing.** Experiment 1 by itself takes about 15
minutes. Both experiments with the challenge and debrief take about 50
minutes.
