# The Same Finding, Twice — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** Second year and above, once means and standard deviations are secure
**Edition:** Simplified, and narrower than its parent. This keeps the single
figure and the run-it-again control from **Independent-Samples t-Test: The Null
Distribution**. The one-tailed against two-tailed comparison, the extended
treatment of t's heavier tails, and the conclusion-writing exercise are in the
longer version at
`modules/research-methods/tools/16-independent-t-test-null-lab/`.

## Learning objectives

By the end, a student should be able to:

1. build t from a mean difference and a standard error;
2. read a two-tailed p as an area rather than as a verdict;
3. say why p depends on the sample size and Cohen's d does not;
4. say what the null distribution is a distribution *of*;
5. write a conclusion that says fail to reject, and that reports an interval.

## Preparation

None, and no seed: the inputs are summary statistics, not a sample, so every
student sees the same figure at the same settings.

**Run this after the overlap activity if you can.** That one deliberately
offers a difference and a spread and no sample size, because an effect size
does not have one. This one adds n back and lets students watch what it does.

## Suggested use

**Projected, in two clicks.** Read the default result: t = 1.10, p = 0.283,
not significant. Then press *Run the same finding on more people*. Same
difference, same spread, same d of 0.40, and now p = 0.005. Ask the room what
changed about the two populations. Nothing did.

**In a session on power or on sample-size planning**, as the motivation.

**When a student asks why their result "nearly" reached significance.**

## Prediction question

Ask before pressing the button:

> We have a 4-point difference and a p of 0.28. I am going to run the identical
> study on 100 people per group instead of 15. What happens to Cohen's d?

Many students expect d to rise with the sample size, because they have
internalised "bigger study, stronger evidence" as "bigger study, bigger
effect". Watching d sit at 0.40 while p falls by a factor of fifty is the
correction.

## Activity sequence

1. **Read the figure.** Establish first what the curve *is*: not scores, not
   people, but the values t would take across repeated studies in a world
   where the two populations are identical. This is the step most often
   skipped and the one most misconceptions come from.
2. **Locate the three markers**: the observed t, the two critical values, the
   shaded tails that are the p-value.
3. **Press the run-again button.** Read the note it writes.
4. **Drag the spread instead.** This changes d as well, which distinguishes it
   from the sample size: spread is a fact about the populations, n is a fact
   about the study.
5. **Set the difference to zero.** t = 0, p = 1. The whole curve is shaded:
   under the null, every possible result is at least as extreme as no
   difference at all.
6. **Release the explanation** and read the caution on what p is not.

## Debrief questions

- The curve is a distribution of what, exactly?
- A study reports p = 0.06 and concludes there is no difference. What is wrong
  with that, in two ways?
- A study of 40,000 people reports p < 0.001 for a difference of 0.2 points on
  a 100-point scale. Should anyone act on it?
- Why does the 95 per cent interval narrow when n grows, while staying centred
  on the same difference?
- If p were the probability that the null is true, what would p = 1 mean at a
  difference of zero? Why is that absurd?

## Likely misconceptions

- **p is the probability the null hypothesis is true.** It is the probability
  of data at least this extreme *given* the null. The caution says so and
  question five above makes the confusion collapse.
- **A bigger sample makes the effect bigger.** It makes the standard error
  smaller. Step 3 is built for this.
- **Non-significant means no difference.** The written conclusion refuses this
  wording deliberately and says why, and the interval shown alongside it is
  usually wide enough to embarrass the claim.
- **The null distribution is a distribution of scores.** It is a distribution
  of a statistic across hypothetical repetitions of the study.
- **t and z are interchangeable.** They nearly are at large df, which the faint
  normal curve behind shows; drop n to 5 and the tails visibly separate.

## Limitations and cautions

Everything assumes independent observations, roughly normal populations, equal
spreads and equal group sizes. It also assumes this test was the one you
intended to run before seeing the data, which in practice is the assumption
most often broken; the forking-paths activity takes that up directly. The
p-value is not the probability that the null is true, and a non-significant
result is not evidence of no difference. Nothing here is a real result.

## Accessibility considerations

All three controls are native range inputs reporting their value in text. The
figure description gives the degrees of freedom, the critical values, the
observed t, the two-tailed p, the standard error and d, so a student using a
screen reader has every quantity. The observed statistic and the critical
values differ by line weight and dash pattern as well as colour and both are
labelled on the figure. A complete written conclusion appears as text beneath
the tiles, so the interpretation is never carried by the graphic alone. On a
narrow screen the figure scrolls sideways rather than shrinking its labels
below legibility. No timed content and no motion.

## Optional extension

Set the difference to 1 and push n to 200. The result is significant and the
effect is trivial. Ask students to write the abstract sentence a press office
would write from it, then the sentence they would write. Comparing the two is
usually more persuasive than any lecture on the difference between statistical
and practical significance.

## Evidence and citation notes

The material is the standard independent-samples t-test. On what p-values do
and do not mean, see Wasserstein and Lazar (2016), *The ASA statement on
p-values*, **The American Statistician**, 70(2), 129–133. On reporting
intervals and effect sizes alongside tests, see Cumming (2014), *The new
statistics: Why and how*, **Psychological Science**, 25(1), 7–29.
