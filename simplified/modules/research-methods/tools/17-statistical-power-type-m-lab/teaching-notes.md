# Teaching notes - Statistical Power and Type M Error (Simplified)

`simplified/modules/research-methods/tools/17-statistical-power-type-m-lab/`

**What it teaches.** When studies are filtered down to only the
significant ones, the surviving estimates overstate a true effect,
especially when the sample size is small, even though every study's
own estimate is unbiased before that filter.

**Before students start.** Every team here is honest; the effect is
genuinely real and fixed, and nobody is p-hacking.

**What students do.**
1. Set the true effect size, the number of people per group, and a
   seed.
2. Run the simulated studies and compare the average of all estimates
   against the average of only the significant ones.
3. Try a bigger sample size and see the exaggeration shrink.

**What to look for.** The average of all studies barely moves between
the small and large sample size, since it is unbiased either way. The
average of the significant ones only, and how far it overstates the
truth, changes a great deal.

**Debrief.** Which of the two averages would a published literature
made only of significant results actually show you?

**Common misconception / caution.** "Low power biases every study" is
worth catching here too: it biases the published, significant subset,
not the honest average of everything that was actually run.

**Use in class / timing.** Running the simulated studies at both
sample sizes takes about 6 to 8 minutes.
