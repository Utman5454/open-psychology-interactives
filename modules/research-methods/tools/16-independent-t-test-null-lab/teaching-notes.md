# Teaching notes - Independent-Samples t-Test: The Null Distribution

`modules/research-methods/tools/16-independent-t-test-null-lab/`

**What it teaches.** The plotted curve is always the theoretical
distribution t would follow if the two population means were equal,
the same reference distribution no matter what the learner sets the
actual means to. The observed t is placed on that curve, and the same
population gap gives a small, unremarkable t at a small sample and a
large, significant one at a large sample, while Cohen's d stays the
same either way.

**Before students start.** Group A's mean is fixed at 50 throughout,
so every comparison is against that one anchor.

**What students do.**
1. Predict what will happen to the standard error, the size of t, and
   the direction of p as sample size rises from 15 to 100 with the
   same effect held fixed.
2. Set group B's mean, both groups' standard deviations, the sample
   size and a significance level.
3. Try the two study presets, the same effect at 15 per group and at
   100 per group, and compare.
4. Try the "no difference at all" preset and read what t and p become
   when the true difference is zero.
5. Open the disclosure comparing the critical t-value to the normal
   distribution's.
6. Sort the closing challenge by picking the one correctly written
   result summary among four.

**What to look for.** The same five-point gap gives t of 1.37 and p of
.182 at 15 per group, but t of 3.54 and p below .001 at 100 per group.
Cohen's d stays at 0.50 in both, since only the amount of evidence for
the gap changed, not the gap itself.

**Debrief.** Two studies, the same five-point finding, gave p of .182
and p below .001; what differed? The significance level moved and the
p-value did not; which of the two is evidence?

**Common misconception / caution.** "We accept the null" is never
printed by the tool; every decision reads "reject" or "fail to
reject," and the challenge checks whether a student can write that
distinction correctly. This is the classic equal-variances test; the
tool warns when the two group spreads differ by more than about 1.8
times, since a real analysis would switch to a version that does not
assume equal variances.

**Use in class / timing.** Showing the two study presets takes about
10 minutes. With the write-up challenge and debrief, a full session
takes about 40 minutes.
