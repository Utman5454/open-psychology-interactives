# Sampling Bias Simulator — Simplified Edition

**Module:** Research Methods · **Duration:** 5–6 minutes · **Level:** First or second year
**Edition:** Simplified. The longer version has five methods including
stratified sampling, a non-response dial that applies to every method, and a
composition table. It is at
`modules/research-methods/tools/04-sampling-bias-simulator/`.

## Learning objectives

Students should be able to distinguish sampling variability from selection
bias and say which a larger sample fixes; explain why convenience sampling is
worst when ease of reach relates to the outcome; explain what a quota does and
does not correct; and predict what sample size changes.

## Preparation

None. The population is generated from a fixed seed, so the true mean is the
same on every machine and can be quoted.

## Suggested use

**Projected, in three minutes.** Run 200 convenience studies at n = 120, then
raise n to 600 and run 200 more. Ask what improved.

**Before students design a recruitment strategy.** The quota result is the one
that changes behaviour: a perfect year breakdown in a table is not evidence of
anything.

## Prediction question

> You need a better estimate of how much students study. Do you recruit more
> people, or recruit differently?

## Activity sequence

1. Convenience at n = 120, 400 studies. The estimates centre well above the
   truth.
2. Raise the sample size to 600. The scatter collapses; the centre does not
   move.
3. Switch to a quota on year of study. Barely better.
4. Switch to simple random sampling. Centred on the truth, at any n.

## Debrief questions

- Convenience at 600 was off by about 2.6 hours. What would fix that?
- Random sampling at 20 was scattered but centred. Which of those two studies
  would you rather have?
- The quota gave a perfect year composition. Why did it not help?
- What is it about the library on a Tuesday that makes it the worst option?

## The moment worth stopping on

Random with n = 20 beside convenience with n = 600. The first is off by
roughly nothing with a spread near 1.0; the second is off by 2.6 with a spread
near 0.15. The tightly clustered one is the wrong answer, confidently. That
comparison is the whole activity.

## Likely misconceptions

**"A big sample is a good sample."** Size buys precision only.

**"Random sampling means haphazard."** It means every member has a known
non-zero chance, which is what convenience does not give you.

**"A representative-looking sample is representative."** A quota makes one
variable look right and leaves the rest as they were.

**"Bias means the researcher was careless."** Selection bias is a property of
the recruitment mechanism, not of anyone's intentions.

## Limitations and cautions

The population is generated and the selection weights are invented, chosen for
legibility rather than to estimate anything. Real non-response depends on
topic, mode, incentive and season and is not one dial. Bias in a mean is not
the only bias selection produces: it distorts variances, subgroup comparisons
and associations too, not always in the same direction. The activity also does
not cover weighting or post-stratification, which are the usual partial
remedies and have their own assumptions.

## Accessibility

Keyboard operable throughout. The population mean is marked with a labelled
line and the description states the method, the sample size, where the
estimates centred and how far that is from the truth. Every plotted quantity
appears as a headline figure in text. No timed content and no motion.

## Extension

Ask what recruitment method would be *worse* than convenience here, and why.
Selecting on the outcome itself is the answer, and convenience already does a
version of it.

## Evidence and reading

Standard survey-sampling texts on probability versus non-probability methods,
and the literature on non-response bias, which is where the dial in the longer
version comes from.
