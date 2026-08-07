# Teaching notes — Correlation: Linearity, Outliers and Shared Variance

`modules/research-methods/tools/18-correlation-outlier-nonlinearity-lab/`

Take the curve first. The picture shows an almost perfect relationship and *r*
is −0.01. Ask what a results table containing only that number would tell a
reader, and what it would hide.

---

## Running it from the front

Take the curve first. The picture shows an almost perfect relationship and r is essentially zero. Ask what a results table containing only that number would tell a reader, and what it would hide.

Then the two odd-point datasets. Set the pull to 0% and to 100% in each, and put the four values of r on the board. In the twelve-person sample one observation swings r across most of its range; in the hundred-and-twenty-person sample the same observation barely registers.

Finish with the units menu on the strong positive dataset. The slope moves by a factor of ten and r does not move at all. That is the difference between a standardised measure and one that carries units.

## Intended level

First-year undergraduate meeting correlation, and again with anyone reading a
correlational literature. It assumes the mean, the standard deviation and
z-scores (tool 13). It leads directly into the regression tools that follow.

## Learning objectives

After the activity a student should be able to:

1. say what *r* does and does not measure;
2. interpret *r*² carefully, and say what the remainder is;
3. explain why a near-zero *r* is not evidence of no relationship;
4. describe how one observation can dominate *r* in a small sample;
5. distinguish *r* from a regression slope.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. If the group has met z-scores, it helps to say once that *r* is the
average product of the two variables' z-scores; everything else follows.

## The demonstration worth doing from the front

1. Take the prediction as a vote. "Somewhere around 0.5" is common and is the
   most instructive wrong answer.
2. Load **A clean curve**: *r* = −0.01 with a near-perfect relationship.
3. Load **One odd point, n = 12** and set the pull to **0%**: *r* = 0.02. Now
   set it to **100%**: *r* = 0.75. One observation.
4. Open the disclosure: without that point, *r* is back to 0.08.
5. Load **The same odd point, n = 120** and repeat: 0.00 to 0.04.
6. Load **Strong positive** and change the **units of y**. The slope goes 0.87
   → 8.69 → 0.17 and *r* stays at 0.85 throughout.
7. Finish with the eyeball test and take the three estimates as a straw poll
   before checking.

## Prediction question

*A clean U-shaped relationship, where every x predicts its y almost exactly.
What is Pearson's r?* — close to +1; close to −1; around 0.5; **close to 0**.

"Around 0.5" is the instructive answer: it treats *r* as a measure of strength
rather than of straightness, which is precisely the habit to break.

## Activity sequence

1. **Commit to the prediction.**
2. **All six datasets**, reading the number against the picture each time.
3. **Pull the ringed point** at n = 12 and at n = 120.
4. **Open the leave-one-out disclosure** in both.
5. **Change the units** and watch which number reacts.
6. **The eyeball test**, estimated before checking.

## Debrief questions

1. The curve shows a near-perfect relationship. Why is *r* zero?
2. *r* = 0.5. What share of the variance in y does the linear relationship
   account for, and what share does it not?
3. One point took *r* from 0.02 to 0.75. What made it so influential — its y
   value, or its x value?
4. The same point in a sample of 120 did almost nothing. Why?
5. The slope changed by a factor of ten and *r* did not move. What does that
   tell you about comparing slopes across studies?
6. Which way did your eyeball estimates err, and why might that be?
7. What would a Spearman correlation do to the curve, and to the odd point?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "r measures how strong the relationship is." | The curve. Perfect, and r = 0. |
| "r = 0 means no relationship." | Same picture. |
| "r = 0.5 means half the variation is explained." | 25%. Squares fall away fast. |
| "Outliers are extreme y values." | Leverage comes from extreme x. |
| "Deleting the outlier fixes it." | It is a diagnostic, not a licence. Argue, do not test. |
| "A big slope means a strong relationship." | Units menu. |
| "r and the slope are the same thing." | slope = r × (SD y / SD x). |
| "r = 0.9 looks almost like a line." | It does not. The eyeball test. |

## Limitations and cautions

- **No real variables.** All six datasets are generated, and x and y are
  unnamed on purpose.
- **Correlation does not establish causation**, and nothing here could.
- **Restricted range is not simulated.** Sampling only part of x shrinks *r*
  without changing the relationship.
- **Pearson is not the only correlation.** Spearman would find the monotonic
  part of a curve and is far less disturbed by one extreme point.
- **Removing an outlier is a decision, not a fix.**

## Accessibility considerations

- Native ranges, selects, radios and buttons; every control labelled, every
  group in a fieldset with a legend.
- The pull slider announces how far the ringed point has been dragged; each
  estimate slider announces the correlation it reads.
- The scatterplot is hidden from assistive technology and paired inside its
  figure with a **visible five-row table**; a disclosure holds the leave-one-out
  comparison.
- The moveable observation is marked with a **ring** rather than a colour, and
  each challenge plot carries a **written alternative** describing the cloud.
- The pinned primary result measures 563px tall at 1366×768.
- Every change announces a full sentence; focus moves to the laboratory and
  challenge headings; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the pull that halves *r*.** In the twelve-point set, find the
   percentage at which *r* passes 0.4, and say what fraction of the dataset is
   doing the work.
2. **Predict the slope.** Before changing the units, write down what the new
   slope will be, then check.
3. **Report a curve honestly.** Write the two sentences you would put in a
   results section for the curved dataset.
4. **Design a restricted-range study.** Describe a sampling scheme that would
   shrink a real correlation to nothing, and say why it is common.

## The model

```
r      = sum((x - mx)(y - my)) / sqrt(sum((x-mx)^2) * sum((y-my)^2))
r^2    = the share of the variance in y accounted for by the straight-line
         relationship with x;  1 - r^2 is what it does not account for
slope  = sum((x - mx)(y - my)) / sum((x - mx)^2)  =  r * (SD y / SD x)
```

The pull slider moves the ringed observation in a straight line from where it
was generated to (92, 92). The units menu multiplies every y by a constant.
Randomness is seeded with `mulberry32` plus Box–Muller.

### Reference values a lecturer can check

| Dataset | n | r | Variance accounted for | Slope |
| --- | --- | --- | --- | --- |
| Strong positive | 40 | 0.85 | 71.9% | 0.87 |
| Strong negative | 40 | −0.86 | 73.8% | −0.88 |
| No linear association | 40 | −0.08 | 0.6% | −0.07 |
| A clean curve | 40 | −0.01 | 0.0% | −0.01 |

The two odd-point sets, with the pull at 0% and at 100%:

| Dataset | Pull 0% | Pull 100% | Without the ringed point |
| --- | --- | --- | --- |
| n = 12 | r = 0.02 | r = 0.75 | r = 0.08 |
| n = 120 | r = 0.00 | r = 0.04 | r = 0.00 |

The units menu on the strong positive dataset:

| Units of y | r | Slope |
| --- | --- | --- |
| original | 0.85 | 0.87 |
| ten times smaller | 0.85 | 8.69 |
| five times larger | 0.85 | 0.17 |

The eyeball test's three plots have correlations of **0.29, 0.86 and −0.63**.

## Citation and evidence notes

- **Anscombe (1973)**, "Graphs in statistical analysis", the origin of the
  argument that a summary statistic cannot be trusted without its picture.
- **Matejka and Fitzmaurice (2017)**, "Same stats, different graphs", for the
  modern version of the same demonstration.
- **Bobko and Karren (1979)** and **Cleveland, Diaconis and McGill (1982)** on
  the perception of correlation from scatterplots, which is what the eyeball
  test is a version of.
- **Rousseeuw and Leroy (1987)** on leverage and influence, for why extremity
  in x rather than in y is what matters.
- **Ozer (1985)** on the interpretation of *r*² and the caution needed with the
  phrase "variance explained".

References are deliberately not embedded in the page, so the tool does not
appear to derive its generated datasets from any of them.
