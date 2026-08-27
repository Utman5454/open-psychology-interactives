# Sampling Distribution and p-Value Simulator — Simplified Edition

**Module:** Research Methods · **Duration:** 6–7 minutes · **Level:** Second year
**Edition:** Simplified. The longer version adds a three-part prediction,
progressive disclosure of the reference curve and a select-all challenge. It
is at
`modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/`.

## Learning objectives

Students should be able to describe a sampling distribution; read a p-value as
a tail area and as a count; explain why the two agree; predict what sample
size and spread do to the standard error; and state what a p-value is not.

## Preparation

None. **No threshold is named anywhere in the activity**, deliberately. If you
want to discuss 0.05, bring it yourself and say why it is a convention.

## Suggested use

**Projected, running 1000 studies at the defaults.** Then ask how many of
those thousand studies found a difference of 5 or more when there was nothing
there. The answer is on screen.

**Before any session on power or on multiple comparisons**, both of which
assume this.

## Prediction question

> Two groups of 40 are drawn from exactly the same population. How big a
> difference between their means would surprise you?

## Activity sequence

1. Run 1000 studies. The area and the count agree.
2. Raise the sample size. The distribution narrows and the same observed
   difference becomes less likely under the null.
3. Move the observed difference. The studies stay; only the shaded region and
   the p-value change.

## Debrief questions

- The true difference is zero. Why did any study find a difference at all?
- The two p figures agree. What does that tell you about the tail area?
- Moving the observed difference changed the p-value without running a single
  new study. What is the p-value a property of?
- Set the observed difference to zero. Why is p exactly 1?

## The moment worth stopping on

Moving the observed slider with the studies still in place. Nothing new is
simulated and the p-value moves, which makes clear that a p-value is a
statement about a procedure and an assumed model rather than a property of the
data alone.

## Likely misconceptions

**"p is the probability the null is true."** It is computed *assuming* the
null.

**"p is the probability the result was chance."** Everything here is chance;
the question is how far out.

**"A big p means no effect."** It means this study could not distinguish one
from zero.

**"p measures effect size."** Raise the sample size and watch p fall with the
observed difference unchanged.

## Limitations and cautions

The population standard deviation is treated as known because the null model
states it, which is why the reference is normal. A real t-test estimates it
and pays with heavier tails and a larger p at small samples. Everything
assumes independent sampling, a pre-specified analysis and a single
comparison; the last of those is exactly what the forking-paths activity
attacks. No threshold is named, because whether a tail area should change
behaviour is a decision, not a statistical fact.

## Accessibility

Keyboard operable throughout. The figure marks zero with a labelled line and
shades both tails, and its description states the settings, the counts and
both p figures. All three headline figures are text. No timed content and no
motion.

## Extension

Ask what would have to change for the simulated p and the theoretical p to
disagree. Estimating sigma from the sample is the answer, and it is the next
tool.

## Evidence and reading

Any inference text on the logic of a sampling distribution, plus the ASA
statement on p-values for the list of what they are not.
