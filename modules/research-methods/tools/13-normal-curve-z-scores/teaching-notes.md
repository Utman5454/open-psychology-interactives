# Teaching notes — The Normal Curve and z-Scores

`modules/research-methods/tools/13-normal-curve-z-scores/`

Set the highlight to μ ± 1σ and drag σ from 2 to 20. The band becomes enormously
wider in raw-score points and its area never moves off 68.3%. That single
observation is what standardisation is for.

---

## Intended level

First-year undergraduate meeting descriptive statistics, and useful again as
five minutes of revision before effect sizes. It assumes the mean and the
standard deviation and nothing else. It sets up the central limit theorem,
Cohen's *d* and the t-test tools that follow it in this module.

## Learning objectives

After the activity a student should be able to:

1. say what μ and σ each do to the curve;
2. compute a z-score and read the percentile and both tail areas from it;
3. distinguish a z-score, a percentile, a one-tailed area and a two-tailed area;
4. explain why the same raw score can be ordinary in one distribution and
   remarkable in another;
5. explain why 68–95–99.7 is a property of the model, not of data.

## Estimated duration

- **Demonstration from the front:** 8 minutes.
- **Students in pairs:** 20 minutes.
- **With the challenge and debrief:** 30 minutes.

## Preparation

None. If the group has met the standard deviation only as a formula, spend two
minutes on "roughly how far a typical score is from the mean" first.

## The demonstration worth doing from the front

1. Take the prediction as a vote. "About 5%" usually wins, and it is the
   two-tailed answer to a one-tailed question.
2. Open Experiment 1 with the score at 70. Read all three: z = 2.00, 97.7%
   below, 2.3% above.
3. Highlight **μ ± 1σ** and drag σ from 2 to 20. Watch the raw-score limits fly
   apart and the percentage sit still at 68.3%.
4. Watch the **peak-height** figure while you do it: 0.040 at σ = 10, 0.020 at
   σ = 20. Ask why it must halve.
5. Leave the score at 70 and drag **μ**. The mark has not changed and its
   percentile travels the whole range.
6. Experiment 2, default pair. Vote before revealing: 62 is z = 2.00 on Test A
   and z = 0.47 on Test B.

## Prediction question

*A test has μ = 50 and σ = 10. What proportion of scores lie above 70?* — about
16%; about 5%; **about 2.5%**; about 0.15%.

"About 5%" is the instructive wrong answer: it is the area outside ±2σ, both
tails together, and the question asked for one of them.

## Activity sequence

1. **Commit to the prediction.**
2. **Read the three numbers** for a score of 70 and say each one aloud as a
   sentence.
3. **Highlight each band in turn** and note the three constants.
4. **Drag σ with a band highlighted** — the point of the session.
5. **Drag μ with the score fixed** — the argument for standardising.
6. **Experiment 2**: commit, reveal, then press *Set me a new pair* three times.
7. **The challenge**, which is seven statements about standardising.

## Debrief questions

1. Why must the peak fall when σ rises?
2. The height of the curve at a score is not the probability of that score. What
   is it, and where is the probability?
3. Give the three different sentences you can say about a score of z = 2.
4. The band's area never changed while σ moved. Why not?
5. 62 was the 98th percentile on one test and the 68th on another. What does a
   raw mark tell you on its own?
6. A colleague says the data are "roughly normal, so about 68% are within one
   SD". What would you want to see before agreeing?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "About 5% are above z = 2." | That is both tails. Halve it. |
| "The height of the curve is a probability." | Probabilities are areas. Point at the shaded region. |
| "68% are within one SD in any dataset." | Only for the normal model. Ask about reaction times. |
| "Standardising makes data normal." | It is a linear change of units. A skewed variable stays skewed. |
| "z = 2 means twice the mean." | With μ = 50 and σ = 10, z = 2 is 70, not 100. |
| "A score of 70 is high." | Drag μ. Same mark, every percentile. |
| "Bigger σ means a taller curve, there is more spread." | Peak height 0.040 to 0.020. Area is fixed. |
| "The harder test makes the mark more impressive." | Harder means a lower mean, which helps; a bigger spread pulls the other way. Both matter. |

## Limitations and cautions

- **No real test and no real people.** Test A and Test B are inventions.
- **Every area is exact for the model** and approximate for anything real. Real
  distributions have finite range, lumps at round numbers, floors, ceilings and
  outliers.
- **Standardising is not normalising.**
- **μ and σ here are population values.** Real work uses sample estimates, which
  carry their own error — the reason the *t* distribution exists.
- **A percentile is not a judgement about a person.** Nothing here should be used
  to describe anybody.

## Accessibility considerations

- Native ranges, a select, radios, checkboxes and buttons; every control
  labelled, every group in a fieldset with a legend.
- The score slider announces both the raw score and the z it produces.
- Both charts are hidden from assistive technology and paired inside their
  figures with **visible tables**; a disclosure lists landmark z-scores against
  the raw scores they correspond to on the current distribution.
- The shaded region carries a **vertical hatch** as well as a fill; the score is
  a labelled rule; the mean is a dashed rule; the second curve is **dashed and
  named at its own peak**.
- Percentages below 0.05% print as "under 0.05%" rather than rounding to zero.
- Pinned primaries measure 517px and 375px tall at 1366×768.
- Every control announces a full sentence; focus moves to each experiment's
  heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the score at the 90th percentile** for three different distributions
   and write down what the three raw scores have in common.
2. **Set up an equal pair.** In Experiment 2, find a Test B on which 62 is
   exactly as unusual as it is on Test A, and explain the trade you made between
   the mean and the standard deviation.
3. **Name three non-normal variables** from your own reading and say, for each,
   which direction the 68% figure would be wrong in.
4. **Write the three sentences.** For one score, write the z sentence, the
   percentile sentence and the tail-area sentence, and mark which two are
   probabilities.

## The model

```
density(x) = exp(-z^2 / 2) / (sigma * sqrt(2*pi)),   z = (x - mu) / sigma
area below x      = Phi(z)
area above x      = 1 - Phi(z)
area beyond +/-|z| = 2 * (1 - Phi(|z|))
band mu +/- k*sigma contains 2*Phi(k) - 1
peak height        = 1 / (sigma * sqrt(2*pi))
```

Φ is computed with the Abramowitz and Stegun 26.2.17 approximation. Both axes
are fixed — scores 0 to 100, density 0 to 0.21 — which is what makes the falling
peak visible.

### Reference values a lecturer can check

At **μ = 50, σ = 10, score 70**:

- z = **2.00**;
- area below = **97.7%** (98th percentile);
- area above = **2.3%**;
- peak height = **0.040**, falling to **0.020** at σ = 20.

The three highlighted bands, at any μ and any σ:

| Band | Area |
| --- | --- |
| μ ± 1σ | 68.3% |
| μ ± 2σ | 95.4% |
| μ ± 3σ | 99.7% |

At σ = 10 the ±1σ band runs from 40.0 to 60.0; at σ = 3 it runs from 47.0 to
53.0. The area is 68.3% in both.

Experiment 2's default pair — a mark of **62** on both tests:

| Test | μ | σ | z | Percentile |
| --- | --- | --- | --- | --- |
| A | 50 | 6 | 2.00 | 98th |
| B | 55 | 15 | 0.47 | 68th |

## Citation and evidence notes

- **Abramowitz and Stegun (1964)**, formula 26.2.17, for the cumulative normal
  approximation used throughout.
- **Micceri (1989)**, "The unicorn, the normal curve, and other improbable
  creatures", for the empirical claim that real psychological distributions are
  routinely not normal — the evidence behind the caution panel.
- **Wilkinson and the APA Task Force on Statistical Inference (1999)** on
  inspecting distributions before applying distributional rules.
- **Cohen (1988)** for the convention of expressing differences in
  standard-deviation units, which the next tools in this module build on.

References are deliberately not embedded in the page, so the tool does not
appear to derive its illustrative distributions from any of them.
