# What Gets Published From a Small Study — Simplified Edition

**Module:** Research Methods
**Duration:** 6–8 minutes
**Level:** Final year and postgraduate, once t-tests and effect sizes are secure
**Edition:** Simplified, and narrower than its parent. This is the two thousand
simulated studies from **Statistical Power and Type M Error**. Alpha, beta and
power as three moving areas, and the sample-size calculator, are in the longer
version at `modules/research-methods/tools/17-statistical-power-type-m-lab/`.

## Learning objectives

By the end, a student should be able to:

1. define power as a property of a design, not of a result;
2. explain how filtering on significance exaggerates effects while leaving
   every individual study unbiased;
3. recognise Type S errors;
4. explain why replications so often come out smaller than originals;
5. say why observed power adds nothing to a p-value.

## Preparation

None. Seed 8317 with the default settings gives every student the same two
thousand studies, so you can quote the same figures: power 23.4 per cent, the
published average 0.84 against a truth of 0.40, an exaggeration of 2.1 times,
and one significant study pointing the wrong way.

## Suggested use

**Projected, and the order matters.** First establish that the effect is real
in every study and every team is honest. Then read the *Average of all studies*
tile: 0.41, which is the truth. Only then read *Average when significant*: 0.84.
Ask what changed. Nothing changed except which studies you looked at.

**In a session on the replication crisis**, as the mechanism rather than the
morality. Most students arrive believing the crisis was caused by bad actors.
This shows that a literature of scrupulously honest small studies is
systematically wrong about effect sizes anyway.

**In a dissertation methods class**, immediately before students choose a
sample size.

## Prediction question

Ask before revealing the second and third tiles:

> Every one of these two thousand studies is honest, correctly analysed, and
> studying an effect that is genuinely there. What will the average of the
> significant ones be?

Almost everyone says 0.4, because they reason that unbiased studies average to
the truth. They are right about the studies and wrong about the subset, and
that gap is the entire lesson.

## Activity sequence

1. **Set the scene.** The effect is real, at d = 0.40. Twenty per group is an
   ordinary undergraduate project size.
2. **Read the histogram.** The outlined bars are all studies; the solid ones
   are the publishable ones. Note where the solid ones sit.
3. **Read the four tiles in order**, ending on the exaggeration ratio.
4. **Press "Give every team a bigger study".** Power goes to about 92 per
   cent, the exaggeration to about 1.05. Nobody became more honest.
5. **Now break it properly.** Set the true effect to 0.05 and n to 5. Power
   collapses to near the false-positive floor, the exaggeration ratio goes past
   5, and significant studies start pointing the wrong way. This is what a
   literature of tiny studies of tiny effects looks like.
6. **Release the explanation** and read the caution about observed power.

## Debrief questions

- Where exactly did the bias enter, given that no study is biased?
- A famous small study reports d = 0.9. A large replication reports d = 0.2.
  Which is more likely to be near the truth, and why?
- Why does raising the sample size reduce the exaggeration, when it does not
  change anyone's behaviour?
- A reviewer asks an author to report the power of their completed study, based
  on the effect they observed. What is wrong with that request?
- At what point does a significant result stop being informative about the
  *size* of an effect?

## Likely misconceptions

- **This is about p-hacking or fraud.** It is not, and saying so early is
  important. Every simulated team here is scrupulous.
- **Unbiased studies produce an unbiased literature.** Only if you publish all
  of them. The whole activity is a counterexample.
- **Power matters only for avoiding false negatives.** Low power also distorts
  the effects you do find, which is the less familiar and more damaging half.
- **A significant result from a small study is at least evidence the effect is
  about that big.** It is close to the opposite: it is evidence the effect was
  probably overestimated.
- **Observed power tells you something.** It is a monotone function of the
  p-value, computed from the very estimate that has been distorted.

## Limitations and cautions

This models one specific filter, significance, applied to one design. Real
publication decisions involve novelty, direction, journal and field. The
simulation assumes normal populations, equal spreads and equal group sizes, and
assumes each team analyses correctly and once. It does not model p-hacking,
which makes matters considerably worse and is the forking-paths activity's job.
The figures are simulated and represent no real literature. Note also that at
decent power the exaggeration is small and the sign errors vanish entirely,
which the activity shows directly; this is not an argument that significant
findings are generally untrustworthy.

## Accessibility considerations

Significant and non-significant studies are distinguished by solid fill against
outline rather than by colour, and the two reference lines differ by dash
pattern and are labelled on the figure. The figure description and the written
summary beneath the tiles together carry the entire argument in text, including
both averages, the exaggeration ratio, power and the wrong-sign count, so no
part of it depends on reading the histogram. Counts are singular or plural
correctly. On a narrow screen the figure scrolls sideways rather than shrinking
its labels below legibility. No timed content and no motion.

## Optional extension

Ask students to find the sample size of a well-known small study in their
reading, set n to match, and read off the exaggeration ratio for a plausible
true effect. Then look up whether a large replication exists and compare. This
is a more memorable introduction to the replication literature than a reading
list is.

## Evidence and citation notes

The Type M and Type S framing, and the exaggeration ratio as defined here, are
from Gelman and Carlin (2014), *Beyond power calculations: Assessing Type S
(sign) and Type M (magnitude) errors*, **Perspectives on Psychological
Science**, 9(6), 641–651. On low power as a structural feature of the field,
see Button and colleagues (2013), *Power failure: Why small sample size
undermines the reliability of neuroscience*, **Nature Reviews Neuroscience**,
14(5), 365–376. On why observed power is uninformative, see Hoenig and Heisey
(2001), *The abuse of power*, **The American Statistician**, 55(1), 19–24.
