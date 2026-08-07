# Teaching notes — ANOVA F-Ratio Visualiser

`modules/research-methods/tools/10-anova-f-ratio-visualiser/`

Start with the separation slider at zero and press **Draw a new sample** five
times, reading *F* aloud each time. Every one of those five came from three
identical populations. That is the anchor for everything else.

---

## Running it from the front

Start at separation 0. Draw four or five new samples and read F aloud each time: 0.3, 1.8, 0.6, 2.4. Every one of those came from three identical populations. F hovers around 1 when nothing is going on, because both halves of the fraction are then estimating the same quantity.

Then take the separation to 8 and watch F climb into the fifties; then take the within-group SD from 6 to 12 with the separation untouched, and watch it fall to about a quarter of that. The population means never move. That is the whole argument for a ratio rather than a difference.

"Tiny difference, large sample" is the preset worth ending on: a difference nobody would act on, with a p below .01.

Ask for a show of hands on each pattern before anyone commits. In most rooms pattern A wins comfortably, because evenly spaced means look like the tidiest version of "a difference".

The three patterns were constructed to have identical between-groups sums of squares, so with the same n and the same within-group spread they give identical F values to the last decimal place. That is not a trick; it is what a single summary of three deviations can and cannot carry.

Follow it with the obvious question: if you wanted to know whether method C beats method A, what would you have had to plan before collecting the data?

## Intended level

Second-year undergraduate meeting ANOVA, and again with anyone about to run one.
It assumes the mean, the standard deviation, the idea of a sampling distribution
and a working sense of what a *p*-value is, so it follows tools 08 and 09 in this
module. It sets up the factorial and ANCOVA tools that come next.

## Learning objectives

After the activity a student should be able to:

1. describe *F* as the between-groups mean square divided by the within-groups
   mean square;
2. predict what happens to *F* when the means separate, when the within-group
   spread grows and when n grows;
3. explain why a large *F* is not a measure of how large a difference is;
4. state what a significant omnibus test licenses about particular groups;
5. explain why post-hoc comparisons answer a different question.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Write `F = MS between / MS within` on the board and leave it there.

## The demonstration worth doing from the front

1. Choose the **No real difference at all** preset. Press **Draw a new sample**
   five times and read *F* each time. The three populations are identical, and
   *F* is bouncing around 1 rather than sitting at 0. Ask why 1 rather than 0.
2. Choose **The first study you predicted about**. *F* jumps into the sixties.
   Point at the vertical reach lines: that is the numerator being built.
3. Choose **The same means, twice the spread**. Nothing has moved except the
   scatter of the dots, and *F* has fallen to roughly a quarter. Say the exact
   rule out loud: what quarters is the amount by which *F* exceeds 1.
4. Choose **Tiny difference, large sample**. Read the *p*-value, then read the
   percentage of variance beside it, then ask which of the two you would put in
   an abstract.
5. In Experiment 2, take a show of hands on patterns A, B and C before anyone
   commits. Then reveal.

## Prediction question

*Three groups of 30, population means 44, 52 and 60, within-group SD 6. A second
study has the same means with twice the within-group spread. What happens to F?*
— unchanged; about half; **about a quarter**; twice as large.

"Unchanged" is the instructive wrong answer: it treats *F* as a statement about
the means alone, which is exactly the habit the tool is built to break.

## Activity sequence

1. **Commit to a prediction.**
2. **Separation at zero**, five resamples, read *F* aloud.
3. **Raise the separation** to 8 and watch *F* climb.
4. **Raise the within-group SD** from 6 to 12 with the separation untouched.
5. **Raise n** with everything else fixed, and note that *F* rises without the
   populations changing at all.
6. **Open the source table** and check the two divisions by hand.
7. **Experiment 2**: browse all three patterns, then commit.
8. **The challenge**, which is seven statements about one *F*.

## Debrief questions

1. Three identical populations. Why is *F* about 1 and not about 0?
2. Doubling the within-group spread quartered *F*. Where in the formula did the
   square come from?
3. n changed and the populations did not, and *F* moved. What does that tell you
   about *F* as a measure of size?
4. Patterns A, B and C look nothing alike and give the same *F*. What
   information did the statistic discard, and when?
5. You want to know whether method C beats method A. What would you have had to
   decide before collecting the data?
6. A colleague says ANOVA is just three t-tests done properly. What is right and
   what is wrong about that?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "F should be 0 if there is no effect." | Both mean squares estimate the same variance under the null, so their ratio is around 1. Run the null preset. |
| "F only depends on the means." | Same means, twice the spread. Two presets, one point. |
| "A big F means a big effect." | The large-sample preset: p = .004 and 6.2% of variance. |
| "Significant F means all groups differ." | Pattern B has two identical means and the same F. |
| "Significant F means C beat A." | Pattern C, where the odd group is the low one, gives the identical F. |
| "ANOVA is three t-tests." | Right for two groups, where F = t². Wrong for three, in both the question asked and the error rate. |
| "Non-significant F means the groups are the same." | Set separation 1.5 with n = 5 and look at what is being hidden. |
| "The simulation proves the formula." | It agrees with it. Both rest on the same model. |

## Limitations and cautions

- **No real data and no real methods.** The groups are A, B and C on purpose.
- **The model is unusually well behaved** — normal populations, exactly equal
  within-group variances, independence, equal group sizes, no missing data.
- **The *p*-value carries every caveat it carried in tool 08.** It is a tail area
  under an assumed model.
- **A non-significant *F* is not equivalence.** That needs an equivalence test
  against a threshold set in advance.
- **Post-hoc comparisons are not free.** Every extra comparison has its own error
  rate — the subject of tool 21 in this module.

## Accessibility considerations

- Native ranges, selects, a number input, radios, checkboxes and buttons; every
  control labelled, every group in a fieldset with a legend.
- Sliders announce meaningful text ("population means 44.0, 52.0 and 60.0").
- Both charts are hidden from assistive technology and paired inside their
  figures with **visible tables**; the full source table sits in a disclosure.
- Group means are drawn as heavy bars **and printed as numbers** under each
  column; the grand mean is a labelled dashed line. Nothing depends on colour.
- Pinned primaries measured at 510px and 392px tall at 1366×768.
- Focus moves to each experiment's heading as it opens; every preset and
  resample announces a full sentence; forced-colours rules provided; usable at
  320px.

## Optional extension tasks

1. **Find the n that makes a 1.5-point separation significant.** Then write the
   sentence you would put in an abstract.
2. **Predict before each preset.** Write down the expected *F* before selecting
   it; compare, and explain the gap as sampling variation.
3. **Build a fourth pattern.** Using the rule that the sum of squared deviations
   from the grand mean must be 18, invent another set of three means that gives
   *F* = 7.50.
4. **Write the contrast.** For the study in Experiment 2, state the one planned
   comparison you would preregister, and say why.

## The model

```
group j ~ Normal(mu_j, sigma),   mu = (52 - s, 52, 52 + s),   n per group
SS_between = sum_j  n * (mean_j - grand mean)^2
SS_within  = sum over all cases of (x - mean of its group)^2
df_between = k - 1 = 2           df_within = N - k
F          = (SS_between / 2) / (SS_within / (N - 3))
p          = P(F(2, N-3) >= observed F)
```

The ANOVA is computed on the **generated sample**, not on the population values,
so every figure on screen moves when the sample is redrawn. Tail areas come from
the regularised incomplete beta function (continued fraction, Lanczos
log-gamma). Randomness is seeded with `mulberry32` plus Box–Muller.

Why doubling the noise quarters *F*, exactly:

```
E[MS between] = sigma^2 + n * sum(delta^2) / (k - 1)
E[MS within]  = sigma^2
so  E[F] - 1  is proportional to  1 / sigma^2
```

*F* itself falls to roughly a quarter only when *F* is comfortably above 1, which
is why the tool says "the amount by which *F* exceeds 1" rather than "*F*".

### Reference values a lecturer can check

At **seed 4021**, the presets give:

| Preset | s | Within SD | n | F | p | Variance between |
| --- | --- | --- | --- | --- | --- | --- |
| The first study you predicted about | 8 | 6 | 30 | 64.73 | < .0001 | 59.8% |
| The same means, twice the spread | 8 | 12 | 30 | 17.65 | < .0001 | 28.9% |
| No real difference at all | 0 | 8 | 30 | 0.51 | .600 | 1.2% |
| Tiny difference, large sample | 1.5 | 8 | 60 | 5.80 | .004 | 6.2% |

The first two preset rows are the prediction question: 64.7 falls to 17.7, a
factor of 3.7 in this particular sample. Averaged over eight seeds the factor
comes out at about 4.2, and the expected values are 54.3 and 14.3.

At the defaults the three sample group means are **42.3 (SD 6.3), 51.8 (4.7) and
58.9 (5.9)**, against population means of 44, 52 and 60.

Experiment 2, in model terms (30 per group, within-group SD 6):

| Pattern | Means | SS between | F(2, 87) | p |
| --- | --- | --- | --- | --- |
| A, evenly spaced | 49.0, 52.0, 55.0 | 540.0 | 7.50 | .001 |
| B, one group high | 50.0, 50.0, 55.2 | 540.0 | 7.50 | .001 |
| C, one group low | 46.8, 52.0, 52.0 | 540.0 | 7.50 | .001 |

The construction rule: each set of means has a sum of squared deviations from
its own grand mean of exactly 18.

## Citation and evidence notes

- **Fisher (1925)**, *Statistical Methods for Research Workers*, for the origin
  of the variance-ratio logic the first experiment draws.
- **Rosenthal and Rosnow (1985)** on planned contrasts, for why the omnibus test
  is rarely the question anyone actually had.
- **Wilkinson and the APA Task Force on Statistical Inference (1999)** on
  reporting effect sizes alongside test statistics, which is why the tool prints
  the share of variance beside *F*.
- **Levine and Hullett (2002)** on eta squared as an overestimate of the
  population value in small samples — a useful caution on the last readout.
- **Wasserstein and Lazar (2016)** for the *p*-value caveats the tool inherits
  from tool 08.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated scores from any of them.
