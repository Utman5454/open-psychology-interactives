# Teaching notes — Homoscedasticity and Residual Diagnostics

`modules/research-methods/tools/20-homoscedasticity-residual-diagnostics/`

Run the pattern menu from top to bottom at full severity and read the coverage
row each time: about 95%, 93%, 86%, 99%. That last figure is why this tool has
five patterns rather than three — non-constant variance does not always make the
interval too narrow.

---

## Running it from the front

Start at severity 0 and take the room through both panels, so that everybody knows what "nothing wrong" looks like. Then drag the severity up slowly. The upper panel changes in a way that is easy to argue about; the lower panel changes in a way that is not.

Keep an eye on the estimated slope while you do it. It stays within a few hundredths of 0.50 the whole way, and the average across repeated samples in the disclosure stays on 0.50 exactly as it should. The cost is entirely in the standard error, and it is invisible on the coefficient.

Then run the pattern menu from top to bottom at full severity and read the coverage row each time. Constant gives about 95%, the megaphone about 93%, widest-at-both-extremes about 86%, and widest-in-the-middle about 99%. That last one is the reason this tool has five patterns rather than three: non-constant variance does not always make the interval too narrow, and the direction depends on where the spread sits relative to the extremes of the predictor rather than on how obvious the fan looks.

Finally set the sample size to 20 with the severity still high. The pattern is still there and the picture is no longer convincing. Ask what anybody could honestly conclude.

## Intended level

Final-year undergraduate or taught postgraduate, and anybody about to report a
regression. It assumes least squares and residuals (tool 19) and confidence
intervals (tool 09). It is the assumption-checking companion to tool 19.

## Learning objectives

After the activity a student should be able to:

1. define homoscedasticity as approximately constant conditional residual
   variance;
2. read a residuals-against-fitted plot, and say why the axis must be fitted
   values rather than the outcome;
3. explain why non-constant variance leaves the slope unbiased and the standard
   error untrustworthy;
4. explain why the size and direction of that error depend on where the extra
   spread sits;
5. treat a residual plot as a fallible diagnostic rather than a verdict.

## Estimated duration

- **Demonstration from the front:** 12 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. It helps to have tool 19 fresh, so that "residual" needs no explanation.

## The demonstration worth doing from the front

1. Take both predictions as a vote. The second one — what it does to the slope
   — is the one that decides what anybody does about a fan shape.
2. Open at severity **0** and take the room through both panels, so everybody
   knows what "nothing wrong" looks like.
3. Drag the severity up slowly. The upper panel changes in a way that is easy to
   argue about; the lower panel changes in a way that is not.
4. Keep an eye on the estimated slope: it stays within a few hundredths of 0.50
   throughout, and the repeated-sampling average in the disclosure sits on 0.50.
5. Now the sequence that carries the session. At full severity, step through the
   five patterns and read the **coverage** and the **model-implied standard
   error** rows each time.
6. Finally set n to **20** with the severity still high. The pattern is still in
   the generating model and the picture is no longer convincing. Ask what
   anybody could honestly conclude.

## Prediction questions

*Which picture makes a megaphone easier to see?* — the raw scatterplot;
**the residuals against fitted values**; equally easy; neither.

*What does strong heteroscedasticity do to the fitted slope?* — biases it up;
biases it down; **leaves it unbiased but makes its standard error wrong**;
makes the regression invalid.

"Makes the whole regression invalid" is the instructive wrong answer, because it
is the belief that leads people to discard perfectly usable analyses.

## Activity sequence

1. **Commit to both predictions.**
2. **Severity 0**, both panels, so the baseline is known.
3. **Drag the severity** and watch which panel reacts usefully.
4. **Read the three regions** in the paired table.
5. **Step through all five patterns** at full severity, recording coverage.
6. **Drop n to 20** and try to diagnose the same pattern.
7. **The challenge**: four residual plots to read.

## Debrief questions

1. Why is the pattern easier to see once the line has been subtracted out?
2. Why must the horizontal axis be fitted values rather than the observed
   outcome?
3. The slope did not move. What did?
4. Widest-at-both-extremes gave 86% coverage and widest-in-the-middle gave 99%.
   Both are heteroscedastic. What distinguishes them?
5. What is the practical consequence of a conservative interval, as against a
   liberal one?
6. At n = 20 the picture is unreadable. What would you write in a results
   section?
7. Why does this tool not report a Breusch–Pagan test?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A fan means the slope is wrong." | Watch the slope. Then the repeated-sampling average. |
| "A fan invalidates the study." | It calls the standard errors into question, and there are ordinary remedies. |
| "Heteroscedasticity always inflates false positives." | Widest-in-the-middle: 99% coverage, conservative. |
| "You can see it in the scatterplot." | Sometimes. Compare the two panels at severity 40%. |
| "Plot residuals against y." | That plot slopes even for a perfect model. |
| "A formal test settles it." | Its sensitivity depends on n. Set n to 300 with severity 15%. |
| "If I can see a fan, it matters." | The megaphone's exact cost here is about 5%. |
| "Robust standard errors fix everything." | They address variance and nothing else — see plot 3 in the challenge. |

## Limitations and cautions

- **No real study.** Generated from a stated model with a documented seed, and
  the variance pattern is imposed rather than discovered.
- **A fan shape does not invalidate a study.** Robust standard errors, a
  transformation, weighted least squares or a different error structure are all
  ordinary responses.
- **No formal test is computed**, deliberately, and the page says why.
- **Constant variance is one assumption of several.** One challenge plot is a
  curvature problem, which no robust standard error repairs.
- **Robust standard errors behave poorly in very small samples** and do not
  repair a model whose shape is wrong.

## Accessibility considerations

- Native ranges, selects, radios, a number input and buttons; every control
  labelled, every group in a fieldset with a legend.
- The severity slider announces its meaning in words.
- The two-panel chart is hidden from assistive technology and paired inside its
  figure with a **visible four-row table** of residual SD by third; a disclosure
  holds intervals, tests, coverage and the exact model-implied standard error.
- Each panel is **labelled in words inside the picture**, the panels are divided
  by a rule, the zero line is dashed and labelled, and the three regions are
  marked by tick rules and named in the table.
- Each challenge plot carries a **written alternative** giving its sample size,
  its residual SD by third and its average residual by third, so the reading
  task is answerable without the picture.
- The pinned primary result measures 564px tall at 1366×768.
- Every control announces a full sentence; focus moves to the laboratory and
  challenge headings; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the severity at which you can first see it** in the residual panel,
   then check what the model says it costs at that point. Most people can see it
   long before it matters.
2. **Write the methods sentence.** Two sentences reporting what you saw and what
   you did about it, neither of them claiming a test was run.
3. **Predict the direction.** Before switching pattern, predict whether the
   classical interval will be too narrow or too wide, and justify it from where
   the spread sits.
4. **Small-sample honesty.** At n = 20, draw five new samples of the same
   generating model and describe how much the picture moves.

## The model

```
x ~ Uniform(10, 90)
y = 20 + 0.5x + Normal(0, 5 * f(x))
f(x) = 1 + severity * 5 * ramp(u),  u = (x - 10) / 80
ramp:  constant 0 | increasing u | decreasing 1-u
       both extremes |2u-1| | middle 1-|2u-1|

classical SE(b1) = sqrt( (sum e^2 / (n-2)) / Sxx )
robust   SE(b1) = sqrt( sum (x-mx)^2 e^2 / (1-h)^2 ) / Sxx      [HC3]
         h = 1/n + (x-mx)^2 / Sxx

exact, from the known sigma at each x:
  true SE(b1)      = sqrt( sum (x-mx)^2 sigma^2 ) / Sxx
  formula aims at  = sqrt( (mean sigma^2) / Sxx )
```

The wording on screen is generated from the ratio of those last two, which is
deterministic; the simulated coverage is reported alongside as confirmation,
with its Monte Carlo error stated.

### Reference values a lecturer can check

At **n = 120, severity 100%, seed 6142**, the exact model-implied standard
errors and the simulated coverage of the nominal 95% intervals:

| Pattern | Formula aims at | True SE | Ratio | Classical coverage | Robust |
| --- | --- | --- | --- | --- | --- |
| Constant | 0.021 | 0.021 | 1.00 | 93.8% | 93.3% |
| Grows with the fitted value | 0.079 | 0.083 | 1.05 | 94.5% | 96.3% |
| Shrinks as it rises | 0.079 | 0.083 | 1.05 | 90.5% | 92.5% |
| Widest at both extremes | 0.076 | 0.097 | 1.28 | 85.8% | 93.8% |
| Widest in the middle | 0.082 | 0.056 | 0.68 | 99.8% | 94.0% |

The two 1.05 rows are identical by symmetry, which the exact figures show and
the 400-sample coverage estimates do not — a useful live illustration of why the
tool leans on the exact quantity. Over **3,000** samples the classical coverages
settle at **94.7%, 92.5%, 92.5%, 86.0% and 99.5%**, with the robust figure
between 93.8% and 94.8% throughout and the mean estimated slope within 0.005 of
0.500 in every case.

At the **defaults** — increasing, severity 70%, n = 120, seed 6142 — the
residual standard deviations by third are **9.0, 14.4 and 16.5** (a ratio of
1.84), the estimated slope is **0.41**, the classical standard error **0.057**
and the robust **0.056**.

The four challenge plots are, in order: constant variance at n = 120; a
megaphone at n = 120; **a curved mean function with constant variance** at
n = 120, whose correct reading is not about variance at all; and a megaphone at
**n = 16**, whose correct reading is that it cannot be diagnosed.

## Citation and evidence notes

- **Anscombe and Tukey (1963)** and **Tukey (1977)** on residual analysis as the
  routine examination of what a model has not accounted for.
- **White (1980)** for the heteroscedasticity-consistent covariance estimator,
  and **MacKinnon and White (1985)** for HC3, which is the version used here.
- **Long and Ervin (2000)** on why HC3 is the sensible default in samples of the
  size psychologists usually have.
- **Hayes and Cai (2007)** for a psychology-facing account of when robust
  standard errors matter and how much.
- **Breusch and Pagan (1979)** and **White (1980)** for the formal tests the
  page names and deliberately does not compute.
- **Loy, Follett and Hofmann (2016)** on the reliability of visual inference
  from residual plots, which is the evidence behind the caution that competent
  readers disagree.

References are deliberately not embedded in the page, so the tool does not
appear to derive its generated data from any of them.
