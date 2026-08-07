# Teaching notes — Regression: Intercept, Slope and Least Squares

`modules/research-methods/tools/19-regression-slope-intercept-lab/`

Give the room two minutes to get the error total as low as they can before
anybody reveals anything. Someone will get within a per cent or two, nobody
will beat it, and that is the argument for the phrase "least squares" made by
experience rather than by algebra.

---

## Intended level

First- or second-year undergraduate meeting regression. It assumes correlation
(tool 18) and nothing else. It leads directly into residual diagnostics
(tool 20).

## Learning objectives

After the activity a student should be able to:

1. define a residual;
2. explain what least squares minimises and why no line beats it;
3. interpret a slope and an intercept in the units of the study;
4. say when an intercept is empty, and what centring does about it;
5. distinguish interpolation from extrapolation, and say what R² covers.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Write `residual = observed − predicted` on the board.

## The demonstration worth doing from the front

1. Take both predictions as a vote. The second one — "can you beat it?" — is
   the hook.
2. Open the laboratory with the flat line at 52.5 and read the error total:
   **4907**. That is a line that ignores practice altogether.
3. Give two minutes of hand-fitting. Collect the best total in the room.
4. Tick **Draw each residual as a square** once someone's line is roughly
   right. The name of the method becomes literal.
5. **Reveal**: intercept **27.7**, slope **0.68**, error total **1399**,
   **71.5%** of the variance.
6. Point at where the fitted line crosses the vertical axis, then at the shaded
   region. Nobody practised for zero minutes.
7. Open the **centring** disclosure. Slope, predictions and error total
   identical; intercept 27.7 becomes 52.3.

## Prediction questions

*What does the least-squares line make as small as possible?* — the sum of the
residuals; **the sum of the squared residuals**; the largest residual; the
number of points below the line.

*Do you expect to beat it?* — the answer is **no**, and the tool says why: there
is exactly one minimising pair and it can be written down from the data.

"The sum of the residuals" is the instructive wrong answer: that sum is zero for
every least-squares line and for many others, so it cannot distinguish between
them at all.

## Activity sequence

1. **Commit to both predictions.**
2. **Hand-fit** for two minutes, watching the goal checklist.
3. **Squares on**, and notice what one badly missed point costs.
4. **Reveal**, and compare your best with the minimum.
5. **Snap** the sliders and note the residual gap is slider resolution.
6. **Open the centring disclosure** and check every row.
7. **The challenge**: two predictions and one decision.

## Debrief questions

1. Why would minimising the plain sum of the residuals be useless?
2. Squares on: which point is costing the most, and why?
3. You got within a per cent. What would it take to get below the minimum?
4. Read the slope aloud as a sentence about people. Now read it as a sentence
   about an intervention. Which is licensed?
5. What is the intercept a prediction for, and who is that?
6. Centring changed the intercept and nothing else. Why nothing else?
7. Both predictions in the challenge are arithmetic. Why is only one of them
   evidence?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Least squares minimises the residuals." | Their sum is zero. Squares. |
| "A better line must exist somewhere." | Two minutes of trying, then the reveal. |
| "The intercept is the starting score." | Nobody started at zero minutes. |
| "Centring changes the model." | Six rows, five of them identical. |
| "The slope says practice causes the score." | It compares people who differ. |
| "R² tells you the model is right." | It tells you the points are near the line. |
| "The line predicts at any x." | The shaded region. |
| "R² cannot be negative." | Set the slope to 1.5 and the intercept to 20. |

## Limitations and cautions

- **No real people.** Generated from a stated model with a documented seed.
- **The slope is not a causal effect.**
- **No uncertainty is shown.** A real slope has a standard error and, at
  n = 30, a wide interval.
- **The assumptions are not checked** — that is tool 20.
- **Squaring is a choice.** Minimising absolute deviations gives a different
  and more outlier-resistant line.

## Accessibility considerations

- Native ranges, checkboxes, radios, number inputs and buttons; every control
  labelled, every group in a fieldset with a legend.
- The sliders announce values in the units of the study.
- The chart is hidden from assistive technology and paired inside its figure
  with a **visible three-column table**; a disclosure holds the centring
  comparison.
- The candidate line is solid and the revealed line dashed, both **named at
  their right-hand ends**; the no-data region is hatched, tinted and labelled;
  the goal checklist writes "(met)" or "(not yet)" in words.
- Negative variance accounted for is printed as "none — worse than the mean"
  rather than clamped.
- The pinned primary result measures 517px tall at 1366×768.
- Every action announces a full sentence; focus moves to the laboratory and
  challenge headings; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Beat it with three parameters.** Explain why adding a squared term would
   always lower the error total, and why that is not automatically an
   improvement.
2. **Write the two sentences.** One interpreting the slope, one interpreting the
   intercept, neither of them causal and neither of them false.
3. **Find the worst point.** With the squares drawn, identify the observation
   contributing most to the total, and say what you would do about it.
4. **Centre y as well.** Predict what the intercept would become if both
   variables were centred, then justify the answer.

## The model

```
predicted = b0 + b1 * x
residual  = observed y - predicted y
SSE       = sum of squared residuals
SST       = sum of (y - mean y)^2
R^2       = 1 - SSE / SST                (negative for a bad candidate line)

least squares:  b1 = sum((x-mx)(y-my)) / sum((x-mx)^2),   b0 = my - b1*mx
```

Data: thirty observations, x uniform on 12 to 68 minutes, y = 30 + 0.6x + noise
with a standard deviation of 7, seeded with `mulberry32` plus Box–Muller.

### Reference values a lecturer can check

| Quantity | Value |
| --- | --- |
| Starting flat line (52.5, 0.00) | SSE 4907 |
| Least-squares intercept b₀ | 27.7 |
| Least-squares slope b₁ | 0.68 |
| Least-squares SSE | 1399 |
| Variance accounted for | 71.5% |
| Mean of x | 35.9 minutes |
| Mean of y | 52.3 points |
| Predicted score at 30 minutes | 48.2 |
| Predicted score at 55 minutes | 65.3 |
| Intercept with x centred | 52.3 |

The challenge answers: **65.3** at 55 minutes, **27.7** at 0 minutes, and only
the first is reportable.

A useful demonstration of negative R²: intercept 20, slope 1.50 gives an error
total of **20 526** against a mean-line total of 4907, and the tool prints
"none — worse than the mean".

## Citation and evidence notes

- **Legendre (1805)** and **Gauss (1809)** for the origin of the criterion; the
  historical dispute is a good aside.
- **Cohen, Cohen, West and Aiken (2003)**, chapter 2, for centring and for the
  interpretation of an intercept outside the observed range.
- **Tukey (1977)** on residuals as the part of the data the model has not
  accounted for, and on looking at them.
- **Rousseeuw and Leroy (1987)** on the outlier sensitivity of least squares
  and on alternatives to it.
- **Wilkinson and the APA Task Force on Statistical Inference (1999)** on
  reporting regression coefficients in the units of the study.

References are deliberately not embedded in the page, so the tool does not
appear to derive its generated dataset from any of them.
