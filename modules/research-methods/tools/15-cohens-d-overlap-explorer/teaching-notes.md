# Teaching notes — Cohen's d and Distributional Overlap

`modules/research-methods/tools/15-cohens-d-overlap-explorer/`

Take the three benchmark buttons in order and read the overlap aloud each time:
92%, 80%, 69%. A room that has just been told 0.8 is a large effect finds 69%
overlap genuinely surprising, and it is the most useful surprise available in
this topic.

---

## Intended level

Second-year undergraduate meeting effect sizes, and any student writing a
results section. It assumes the mean, the standard deviation and z-scores
(tool 13). It pairs naturally with tool 16 on the t-test and tool 17 on power.

## Learning objectives

After the activity a student should be able to:

1. compute Cohen's *d* and explain why it has no units;
2. translate an effect size into overlap, probability of superiority and U₃;
3. explain why the same raw difference gives different *d* in groups of
   different spread;
4. explain why the sample size changes a test statistic but not an effect size;
5. say what a group difference does and does not license about an individual.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. It is worth asking the room to write down their overlap estimate on paper
before the tool is opened, so the gap between guess and answer is on record.

## The demonstration worth doing from the front

1. Take the overlap estimate as a straw poll. Typical guesses are 20–35%.
2. Reveal: **69%**, with 71% probability of superiority and 79% U₃.
3. Press the three benchmark buttons in turn and read the overlap row.
4. Leave the means where they are and drag **group A's SD from 10 to 5**.
   *d* goes from 0.80 to 1.01 and neither mean has moved. Ask which number a
   reader should be given, and what else they need alongside it.
5. Drag the **sample size** from 10 to 400 and open the disclosure. *d* = 0.80
   throughout; *p* travels from .090 to below .0001.
6. Finish on the sentence test: ask someone to describe the default pair out
   loud without saying anything false about an individual.

## Prediction question

*Two groups, both SD 10, means 50 and 58 — d = 0.80, conventionally large. What
percentage of the two distributions overlaps?* — **69%**.

The estimate is entered on a slider rather than chosen from a list, so the
answer cannot be reverse-engineered from the options and the size of the error
is on record.

## Activity sequence

1. **Estimate the overlap** and lock it in.
2. **Read all four indices** for the default pair and say each as a sentence.
3. **Work the three benchmarks** and record the overlap each time.
4. **Change one group's spread** with the means fixed.
5. **Change the sample size** and open the disclosure.
6. **The matching challenge**, which includes one sentence that describes
   nothing at all.

## Debrief questions

1. Why does *d* have no units, and what does that buy?
2. Two studies report the same eight-point difference and different *d*. What
   differed?
3. *d* did not move when n went from 10 to 400. What did?
4. At *d* = 0.8, 71% of randomly drawn pairs favour group B. What is the other
   29%, and why does it matter for how you write?
5. What is the difference between U₃ and the probability of superiority?
6. When is Cohen's "medium" a useful description, and when is it not?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A large effect means the groups barely overlap." | 69%. |
| "Bigger samples give bigger effect sizes." | Drag n. *d* is stuck. |
| "d = 0.8 means group B are higher." | 21% of group B is below group A's mean. |
| "The overlap formula is 2Φ(−d/2)." | True only for equal spreads. Set SD A to 5 and see. |
| "Small, medium and large are standards." | Cohen offered them as a stopgap and said so. |
| "U₃ and the probability of superiority are the same." | 79% against 71% at d = 0.8. Different comparisons. |
| "A non-significant result means a small effect." | n = 10 gives p = .090 at d = 0.80. |
| "Effect size tells you the cause." | It describes a gap. Nothing about how it arose. |

## Limitations and cautions

- **No real groups and no real measure.** Mathematical distributions on an
  invented scale.
- **Nothing about individuals.** Every index describes two distributions.
- **Both distributions are normal**, which the overlap and U₃ rely on. For
  skewed variables the probability of superiority survives best, because it can
  be counted without assuming a shape.
- **These are population values.** A *d* from a real sample has a confidence
  interval — a wide one at small n — and is biased upwards, which is what
  Hedges' correction addresses.
- **An effect size is not a cause.**

## Accessibility considerations

- Native ranges, selects and buttons; every control labelled, every group in a
  fieldset with a legend.
- The estimate slider announces "an estimated overlap of 30 per cent"; the
  sample-size slider says in words that it changes the test and not the effect.
- The chart is hidden from assistive technology and paired inside its figure
  with a **visible three-column table** naming each index, its value and what it
  counts; a disclosure holds the moves-with-n table.
- Group A is solid and group B dashed, both **named at their own peaks**, each
  mean is a dotted rule, and the common ground carries a **vertical hatch**.
- The pinned primary result measures 514px tall at 1366×768.
- Every preset and slider announces a full sentence; focus moves to the explorer
  heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the *d* at which the overlap drops below half.** Then say how often
   effects that large are reported in your reading.
2. **Write two sentences per benchmark.** For each of 0.2, 0.5 and 0.8, write
   one sentence a journalist could not misread and one that would be
   over-claiming.
3. **Match a real finding.** Take an effect size from a paper you have read,
   set the tool to it, and describe the overlap out loud.
4. **Unequal spreads.** Set group A's SD to 5 and group B's to 20 and explain
   why the pooled figure is a compromise nobody's data actually has.

## The model

```
pooled SD              = sqrt((sA^2 + sB^2) / 2)            (equal group sizes)
Cohen's d              = (meanB - meanA) / pooled SD
overlap                = integral of min(fA, fB)   [trapezoidal, 2000 steps]
probability of superiority = Phi((meanB - meanA) / sqrt(sA^2 + sB^2))
U3                     = Phi((meanB - meanA) / sB)
t                      = (meanB - meanA) / (pooled SD * sqrt(2/n)),  df = 2n - 2
two-tailed p           = I_{df/(df + t^2)}(df/2, 1/2)
```

The overlap is **integrated**, not looked up, because the familiar closed form
2Φ(−|d|/2) is correct only when the two standard deviations are equal, and this
tool lets them differ.

### Reference values a lecturer can check

Equal spreads of 10, group A's mean at 50:

| Preset | Mean B | d | Overlap | P(B beats A) | U₃ |
| --- | --- | --- | --- | --- | --- |
| Cohen's "small" | 52 | 0.20 | 92% | 56% | 58% |
| "Medium" | 55 | 0.50 | 80% | 64% | 69% |
| "Large" | 58 | 0.80 | 69% | 71% | 79% |

With the means at 50 and 58 and **unequal spreads** (SD A = 5, SD B = 10): the
pooled SD is **7.9**, *d* = **1.01** and the integrated overlap is **52%**.

The sample-size slider at *d* = 0.80, spreads equal:

| n per group | d | Overlap | t | p |
| --- | --- | --- | --- | --- |
| 10 | 0.80 | 69% | 1.79 | .090 |
| 30 | 0.80 | 69% | 3.10 | .003 |
| 400 | 0.80 | 69% | 11.31 | < .0001 |

## Citation and evidence notes

- **Cohen (1988)**, *Statistical Power Analysis for the Behavioral Sciences*,
  for *d*, for U₃ and for the small/medium/large labels together with the
  caveat he attached to them.
- **McGraw and Wong (1992)**, "A common language effect size statistic", for
  the probability of superiority.
- **Ruscio (2008)** on the non-parametric estimation of that probability, which
  is why it survives non-normal distributions best.
- **Lakens (2013)**, "Calculating and reporting effect sizes", for practical
  reporting including Hedges' correction.
- **Funder and Ozer (2019)** on why small effect sizes can be consequential and
  why benchmark labels mislead.
- **Hyde (2005)** for a well-known worked example of how overlap changes the
  reading of a group difference.

References are deliberately not embedded in the page, so the tool does not
appear to derive its illustrative distributions from any of them.
