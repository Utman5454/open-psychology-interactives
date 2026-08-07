# Teaching notes — ANCOVA / MANOVA Decision Laboratory

`modules/research-methods/tools/12-ancova-manova-decision-lab/`

The moment that carries the session: set the covariate gap to −10 with the design
menu on **random allocation**, read the two numbers, then switch the menu to
**two intact classes**. Nothing on screen changes. Ask which number is the effect
of the programme.

---

## Running it from the front

Start with the gap at zero and the correlation at 0.7. The unadjusted and adjusted differences are almost identical, and the point of the covariate is not the estimate at all &mdash; it is the residual variance, and therefore the precision.

Then drag the covariate gap to &minus;10 with the design still set to random allocation. The two numbers separate. Ask which of them is the effect of the programme. Then switch the design to two intact classes and ask again. The arithmetic has not changed by a decimal place.

Finally drag the slope difference to 0.6 and open the disclosure. The "adjusted difference" is now three different numbers depending on where you stand, which is what a violated homogeneity assumption actually costs.

Run the presets in order. "Same direction, positively correlated" is the case most people imagine when they picture MANOVA, and it is the case where the multivariate test adds almost nothing: the two outcomes are largely the same information twice.

"Two small effects, one clear separation" is the case worth the lesson. Two differences of 0.3 standard deviations, either of which most studies would miss, become a joint separation of well over 1 because the outcomes are strongly correlated within groups and the difference runs across that correlation.

Then ask the obvious follow-up: the multivariate test has told you the clouds are apart. It has not told you which outcome, or in which direction. Following it with two univariate tests is the usual practice, and it does not protect them from multiplicity.

## Intended level

Final-year undergraduate or taught postgraduate, or anyone about to add a
covariate to an analysis because a reviewer asked. It assumes one-way and
factorial ANOVA (tools 10 and 11) and simple regression. No computation is
required.

## Learning objectives

After the activity a student should be able to:

1. assign the roles of outcome, grouping factor and covariate in a described
   design;
2. explain that under randomisation a covariate buys precision rather than
   correction;
3. state what an adjusted difference estimates, and when it cannot be read
   causally;
4. state the homogeneity-of-regression-slopes assumption and what its failure
   costs;
5. explain why a multivariate test is a different question rather than a cheaper
   way of asking several.

## Estimated duration

- **Demonstration from the front:** 15 minutes.
- **Students in pairs:** 30 minutes.
- **With the four scenarios and debrief:** 50 minutes.

## Preparation

None. It helps to have already met the idea that randomisation is what licenses
a causal reading, because this tool is largely an argument about that.

## The demonstration worth doing from the front

1. Take the opening decision as a group. Assign the roles out loud before
   anybody names an analysis; the point is that the analysis follows.
2. Open Experiment 1 with the gap at zero. Unadjusted +6.9, adjusted +6.2. Ask
   what the covariate has bought. The answer is precision, not correction.
3. Drag the gap to **−10**, design still on random allocation. Unadjusted −0.1,
   adjusted +5.4. The unadjusted comparison has lost the whole effect.
4. Switch the design menu to **two intact classes**. Read the numbers again.
   They have not moved. Read the verdict box, which now says something quite
   different about the same numbers.
5. Drag the slope difference to **0.6** and open the disclosure: −3.2, +5.6,
   +14.4. Ask which of those three is "the adjusted difference".
6. In Experiment 2, run the four presets in order. Finish on **Two small
   effects, one clear separation**: 0.30 and 0.30 become 1.10.

## Prediction question

The opening decision is the prediction: *what role does each variable play, and
which analysis fits?* — June score is the **outcome**, programme against usual
timetable is the **grouping factor**, September score is the **covariate**, and
the best analysis is **ANCOVA**.

The instructive wrong answer is MANOVA with September and June as two outcomes.
September was measured before anyone was allocated, so no group difference on it
could have been caused by the programme; treating it as a dependent variable
asks a question the design cannot pose.

## Activity sequence

1. **Assign the roles**, then choose the analysis.
2. **Gap at zero**: note how little adjustment moves the estimate.
3. **Gap at −10 under randomisation**: note how much it moves it, and why the
   adjusted figure is the better estimate.
4. **Same numbers, intact classes**: note that nothing computational changed.
5. **Slope difference at 0.6**: read the three gaps.
6. **Covariate correlation down to 0.1**: note that a useless covariate costs a
   degree of freedom and buys nothing.
7. **Experiment 2**, four presets in order.
8. **The four scenarios.**

## Debrief questions

1. Under random allocation, why does adjustment barely move the estimate — and
   what is the covariate doing instead?
2. Write the adjusted difference as a sentence beginning "Among students who
   started at the same September score …". Now say why that is not the same
   sentence as "the programme raised scores by …".
3. What in the data told you the groups were intact rather than randomised?
4. With unequal slopes, what should be reported instead of an adjusted mean
   difference?
5. Two outcomes each show a difference of 0.3 SD and jointly show 1.10. Where
   did the extra separation come from?
6. A colleague says MANOVA means they do not have to correct for multiple
   comparisons. What has gone wrong?
7. Two of the four scenarios have the answer "neither". Which methodological
   habit does that reflect?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "ANCOVA controls for pre-existing differences." | It adjusts for one measured variable. Switch the design menu and watch nothing change. |
| "A covariate makes non-equivalent groups equivalent." | Only on that variable, and only if the slope model is right. |
| "The point of a covariate is to fix baseline imbalance." | Gap at zero: the estimate barely moves and the covariate is still worth having. |
| "Any correlated variable makes a good covariate." | Study 4: attendance is downstream of the allocation. |
| "You can always report one adjusted difference." | Slope difference 0.6, then open the disclosure. |
| "MANOVA saves you from multiple comparisons." | Study 3, and the caveat under Experiment 2. |
| "MANOVA is more powerful than several ANOVAs." | Preset one: 0.80 and 0.80 become 0.84. |
| "Change scores and ANCOVA are the same." | A change score is ANCOVA with the slope forced to 1. Look at the pooled slope. |

## Limitations and cautions

- **No real study.** Every scenario, programme and number is invented.
- **No test statistics.** The tool reports adjusted differences and separations
  in SD units rather than *F* or Wilks' Λ, deliberately.
- **Two outcomes, not many.** Experiment 2 uses two so that the plane can be
  drawn; real multivariate analyses behave the same way and are far harder to
  see, which is a reason for caution rather than confidence.
- **The design menu is interpretive only.** Neither the software nor the data
  can tell how the groups were formed. That is the honest state of affairs and
  the reason the menu exists.
- **Causal inference is bigger than this.** Propensity methods, instrumental
  variables, difference-in-differences and regression discontinuity all address
  non-equivalent groups more carefully, each with assumptions of its own.

## Accessibility considerations

- Native ranges, selects, radios and buttons; every control labelled, every
  group in a fieldset with a legend.
- Sliders announce meaningful text ("the programme group starts −10 points from
  the other group in September").
- Both plots are hidden from assistive technology and paired inside their
  figures with **visible tables**; the three-point gap table turns a slopes
  violation into numbers rather than a shape.
- The two groups are told apart by **marker shape** (filled circles against
  hollow triangles) as well as colour; both fitted lines are **named at their
  right-hand ends** and differ in dash pattern.
- Signed quantities print an explicit **+** or **−**.
- Pinned primaries measure 475px and 417px tall at 1366×768.
- Every control announces a full sentence; focus moves to each experiment's
  heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the correlation at which the covariate stops earning its place.** Drag
   *r* down and say where you would stop including it, and why.
2. **Write the two abstracts.** One for the randomised version and one for the
   intact-classes version of the same numbers. Compare the verbs.
3. **Design a covariate-by-treatment interaction study.** Take the slope
   difference of 0.6 as a finding and write the research question it answers.
4. **Pick the outcomes.** For a fictional intervention of your choosing, propose
   three outcomes that would justify a multivariate test and three that would
   not, and say what distinguishes the lists.

## The model

```
Experiment 1, per group of 40:
  september ~ Normal(50 +/- gap/2, 10)
  slope_g    = r  +/-  slopeDifference / 2
  june       = 50 + slope_g * (september - 50) +/- effect/2 + Normal(0, 10*sqrt(1-r^2))

Computed from the generated sample:
  unadjusted = mean(june | programme) - mean(june | usual)
  pooled b   = within-group pooled regression slope of june on september
  adjusted   = unadjusted - b * (mean(sept | programme) - mean(sept | usual))
  gap at x   = the vertical distance between the two group regression lines at x

Experiment 2:
  two standardised outcomes, within-group correlation rho, centres +/- d/2
  D^2 = (d1^2 - 2*rho*d1*d2 + d2^2) / (1 - rho^2)
```

Randomness is seeded with `mulberry32` plus Box–Muller.

### Reference values a lecturer can check

Experiment 1 at the opening seed, with *r* = 0.70, effect = 6:

| Setting | Unadjusted | Adjusted | Covariate gap | Pooled slope |
| --- | --- | --- | --- | --- |
| Gap slider 0 | +6.9 | +6.2 | +1.2 | 0.62 |
| Gap slider −10 | −0.1 | +5.4 | −8.8 | 0.62 |

With the gap at −10 and the slope difference at **0.6**, the gap between the
fitted lines is **−3.2** at a September score of 38.2, **+5.6** at 50.2 and
**+14.4** at 62.2. There is no single adjusted difference to report.

Experiment 2, the four presets:

| Preset | d₁ | d₂ | ρ | Outcome 1 | Outcome 2 | Together |
| --- | --- | --- | --- | --- | --- | --- |
| Same direction, positively correlated | 0.80 | 0.80 | 0.80 | 0.80 | 0.80 | 0.84 |
| Same direction, negatively correlated | 0.80 | 0.80 | −0.70 | 0.80 | 0.80 | 2.07 |
| Two small effects, one clear separation | 0.30 | −0.30 | 0.85 | 0.30 | 0.30 | 1.10 |
| Opposite directions, uncorrelated | 0.60 | −0.60 | 0.00 | 0.60 | 0.60 | 0.85 |

The first and last rows are the honest headline: with the correlation working
against you, two 0.80 effects buy you 0.84, and two uncorrelated 0.60 effects
combine to the Pythagorean 0.85.

## Citation and evidence notes

- **Lord (1967)**, "A paradox in the interpretation of group comparisons", for
  why the same data support two defensible and contradictory adjusted answers
  when groups are not equivalent.
- **Miller and Chapman (2001)**, "Misunderstanding analysis of covariance", the
  standard reference for the misuse Experiment 1 dramatises.
- **Huitema (2011)**, *The Analysis of Covariance and Alternatives*, for the
  homogeneity-of-regression-slopes assumption and what to report when it fails.
- **Rosenbaum (1984)** on the hazard of adjusting for variables measured after
  the treatment, which is Study 4.
- **Huberty and Morris (1989)**, "Multivariate analysis versus multiple
  univariate analyses", for the distinction Experiment 2 is built on.
- **Vickers and Altman (2001)** on baseline adjustment against change scores in
  randomised trials.

References are deliberately not embedded in the page, so the tool does not
appear to derive its fictional studies from any of them.
