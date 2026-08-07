# Teaching notes — Independent-Samples t-Test: The Null Distribution

`modules/research-methods/tools/16-independent-t-test-null-lab/`

Press **The 15-per-group study**, read all four figures aloud, then press
**The same effect at 100 per group** and read them again. The two groups are
identical in both. *d* = 0.50 in both. *p* goes from .182 to below .001.

---

## Intended level

Second-year undergraduate meeting the t-test properly, and again with anyone
writing up a non-significant result. It assumes the sampling distribution
(tool 14), effect sizes (tool 15) and the *p*-value caveats from tool 08.

## Learning objectives

After the activity a student should be able to:

1. build *t* from a mean difference and a standard error and place it on the
   null distribution;
2. read a two-tailed *p* as the area beyond the observed statistic;
3. explain why *p* depends strongly on n while Cohen's *d* does not;
4. explain why the t distribution has heavier tails than the normal, and why
   the gap closes;
5. write a conclusion that says *fail to reject* and reports an interval.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Put `t = difference / standard error` on the board and leave it.

## The demonstration worth doing from the front

1. Take all three predictions as a vote. The *|t|* question is the one that
   splits a room.
2. Press **The 15-per-group study**: difference +5.0, SE 3.65, *t*(28) = 1.37,
   *d* = 0.50, *p* = .182, critical ±2.05, fail to reject.
3. Press **The same effect at 100 per group**: SE 1.41, *t*(198) = 3.54,
   *d* = 0.50, *p* < .001, critical ±1.97, reject. Ask what the study found.
4. Take **n down to 3**. The curve visibly fattens, the critical value is 2.78
   against the normal's 1.96, and the 95% interval runs from −18.2 to 27.2.
5. Change **α to .01** with everything else fixed. The dashed rules move; the
   shaded area does not. Ask which of those is the evidence.
6. Press **No difference at all**. *t* = 0.00, *p* = 1.000. Ask the room to
   write the conclusion, and refuse "the groups are the same".

## Prediction question

*Fifteen per group, difference 5 points, SD 10, so d = 0.50. Repeat at 100 per
group with the same means and SD. What happens to the standard error, to |t|,
and to p?* — **smaller, larger, smaller**.

The point is what is missing from the list: *d* is 0.50 in both, because it
divides by the spread of individual people rather than by the spread of sample
means.

## Activity sequence

1. **Commit to all three predictions.**
2. **The two study presets**, reading every figure twice.
3. **Sweep n** and watch the critical value approach 1.96.
4. **Change α** and note what does and does not move.
5. **Pull the two SDs apart** and read the warning about the equal-variance
   assumption.
6. **The null study**, and the sentence it deserves.
7. **The challenge**, which is four write-ups of one result.

## Debrief questions

1. Where in the formula does the sample size appear, and where does it not?
2. Two studies, one finding, *p* = .182 and *p* < .001. What differed?
3. Why is the critical value 2.78 at four degrees of freedom and 1.96 at
   infinity?
4. α moved and *p* did not. Which of the two is evidence?
5. *t* = 0.00 and *p* = 1.000. Write the conclusion in one sentence.
6. What is wrong with "approaching significance"?
7. The interval excludes zero exactly when the test rejects. Why prefer the
   interval?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A bigger sample gives a bigger effect." | *d* is stuck at 0.50 across both presets. |
| "p is the probability the null is true." | The calculation starts by assuming it. |
| "Non-significant means no difference." | Interval −0.7 to 9.7 in the challenge scenario. |
| "We accept the null." | Fail to reject. The tool never prints "accept". |
| "p = .06 is a trend." | The threshold was chosen in advance. .087 is not nearer .05 in any sense that matters. |
| "t and z are interchangeable." | df = 4: 2.78 against 1.96. |
| "α is part of the evidence." | Change it and watch nothing else move. |
| "Unequal SDs do not matter." | Set the ratio above 1.8 and read the warning. |

## Limitations and cautions

- **No raw data.** The tool cannot show outliers, skew or floor and ceiling
  effects, which should be looked at before any test.
- **The classic pooled-variance test**, which assumes equal population
  variances. Welch's version is not computed here and is a reasonable default.
- **Equal group sizes** throughout.
- **Independence is assumed and cannot be checked.**
- **A single test in isolation**, decided in advance. Neither assumption is
  common; tool 21 is about what happens when they fail.

## Accessibility considerations

- Native ranges, a select, radios and buttons; every control labelled, every
  group in a fieldset with a legend.
- The sample-size slider announces both the size and the degrees of freedom.
- The chart is hidden from assistive technology and paired inside its figure
  with a **visible four-row table** including the decision in words; a
  disclosure holds the interval and the two critical values.
- The shaded tails carry a **vertical hatch**, the observed statistic is a
  labelled rule, the critical values are labelled dashed rules, and the normal
  curve is dashed.
- The pinned primary result measures 514px tall at 1366×768.
- Every preset and control announces a full sentence; focus moves to the
  laboratory heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the n at which the same finding becomes significant** at α = .05, and
   then say what that n means about the original study rather than about the
   effect.
2. **Rewrite three abstracts.** Take the three rejected write-ups from the
   challenge and repair each one.
3. **Report the interval only.** Describe the default study without using the
   word significant.
4. **Break the assumption.** Set the two SDs to 4 and 25 and say, in words,
   what the pooled figure is now describing.

## The model

```
pooled SD = sqrt((sA^2 + sB^2) / 2)              [equal group sizes]
SE        = pooled SD * sqrt(2 / n)
t         = (meanB - meanA) / SE
df        = 2n - 2
d         = (meanB - meanA) / pooled SD
p         = I_{df/(df + t^2)}(df/2, 1/2)          [two-tailed]
critical  = the |t| whose two-tailed area equals alpha (found by bisection)
interval  = difference +/- critical * SE
```

### Reference values a lecturer can check

Means 50 and 55, both SDs 10, α = .05:

| n per group | SE | t | df | p | Critical | d | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 15 | 3.65 | 1.37 | 28 | .182 | ±2.05 | 0.50 | fail to reject |
| 100 | 1.41 | 3.54 | 198 | < .001 | ±1.97 | 0.50 | reject |

Other checkable figures:

- **No difference at all** (means both 50, n = 15): *t* = 0.00, *p* = 1.000.
- **α = .01 at 28 df**: critical value ±2.76, and *p* is still .182.
- **n = 3** (4 df): critical value ±2.78 against the normal's ±1.96, and the
  95% interval for a 5-point difference runs from −18.2 to 27.2.
- **The challenge scenario** — 30 per group, means 50 and 54.5, SDs 10 — gives
  *t*(58) = 1.74, *p* = .087, *d* = 0.45 and a 95% interval of [−0.7, 9.7]. It
  is reproducible on the sliders.
- **SDs of 10 and 22** trigger the equal-variance warning at a ratio of 2.2.

## Citation and evidence notes

- **Student (1908)**, "The probable error of a mean", for the distribution the
  page is built on and for why estimating σ costs something.
- **Delacre, Lakens and Leys (2017)** on Welch's t-test as a default, which is
  the reason the equal-variance warning is worded as it is.
- **Wasserstein and Lazar (2016)** for the *p*-value principles the page
  inherits.
- **Greenland et al. (2016)** for the taxonomy behind the four write-ups in the
  challenge.
- **Hoekstra, Finch, Kiers and Johnson (2006)** on how often non-significant
  results are written up as evidence of no effect.
- **Wilkinson and the APA Task Force on Statistical Inference (1999)** on
  reporting intervals and effect sizes alongside test statistics.

References are deliberately not embedded in the page, so the tool does not
appear to derive its illustrative statistics from any of them.
