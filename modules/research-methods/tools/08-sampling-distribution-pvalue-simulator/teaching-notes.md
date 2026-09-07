# Teaching notes - Sampling Distribution and p-Value Simulator

`modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/`

**What it teaches.** A p-value is the tail area of a sampling distribution
built by assuming the null is exactly true. It is not a probability about
the hypothesis itself. Changing the sample size changes the p-value while
the observed difference stays exactly fixed, which is the whole point of
the n slider.

**Before students start.** Write "the true difference here is exactly
zero" on the board and leave it up for the session.

**What students do.**
1. Predict how often two samples of 40 will differ by 5 or more points
   when the true difference is zero. "About 1 in 20" is the tempting
   wrong answer, tied to the .05 threshold rather than to anything about
   this study.
2. Run 20 studies slowly, then 1,000, and read the shaded tails against
   the model's own p.
3. Hold the observed difference at 5.0 and drag n from 40 to 200.
4. Take the six-statement challenge on what a p-value actually means.

**What to look for.** At step 3, the same finding, a difference of 5.0,
gives p around .14 at n = 40 and p below .001 at n = 200. Ask students
what changed between the two runs and what stayed fixed. Anyone who
answers "the effect got bigger" has not been looking at the slider.

**Debrief.** If every study here has a true effect of zero, why isn't the
pile of results a single spike at zero? Name one thing this p-value is
conditional on that nobody actually checked.

**Common misconception / caution.** Expect someone to say p is the
probability the null is true. It is not: the simulation assumes the null
before a single study runs, so its plausibility never enters the
calculation. The null model itself is also unusually clean, with known
variance, no dropout and no dependence between observations, so a small p
in real data never by itself identifies what went wrong.

**Use in class / timing.** Ten minutes as a straight demonstration. With
the challenge and debrief, 30 to 40 minutes.
