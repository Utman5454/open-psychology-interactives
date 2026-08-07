# Teaching notes — Factorial ANOVA Interaction Detective

`modules/research-methods/tools/11-factorial-anova-interaction-detective/`

The best ninety seconds on this page: load **Dramatic-looking and trivial**, ask
the room what they see on the zoomed axis, then switch to the full scale, then
add the large error bars. Nothing about the data changes.

---

## Intended level

Second-year undergraduate meeting factorial designs, and any student writing up
a 2×2. It assumes one-way ANOVA (tool 10 in this module) and the idea that a
statistic carries uncertainty. It does not require any computation.

## Learning objectives

After the activity a student should be able to:

1. read main effects off marginal means, and explain why averaging can destroy
   two large opposite effects;
2. define an interaction as a difference of differences, and show that swapping
   the axes cannot change it;
3. distinguish crossover, fan and parallel patterns;
4. judge an interaction plot against its vertical scale and the uncertainty in
   each cell;
5. describe an interaction in a sentence rather than announcing that one exists.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 20 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. Put the four crossover cell means on the board before the session and
leave them there.

## The demonstration worth doing from the front

1. Show the prediction table (70, 50 / 50, 70) and take a vote on all three
   questions before anyone opens the tool. Most rooms vote yes, yes, yes.
2. Reveal. Both main effects are exactly zero and the interaction is 40 points.
   Ask what "no main effect of feedback" would mean to a reader who saw only
   that line of the results section.
3. Press **Remove the interaction**. Every cell becomes 60. Both sets of
   marginal means are untouched — which is the point.
4. Load **Fan** and press **Put feedback on the horizontal axis**. Quite a
   different-looking plot; identical interaction term.
5. Load **Dramatic-looking and trivial**. Zoomed axis, then full scale, then
   large error bars.
6. Finish with the sentence-building challenge, and read the finished sentence
   aloud beside "there was a significant interaction".

## Prediction question

*Cell means 70 and 50 for immediate feedback, 50 and 70 for delayed. Is there a
main effect of feedback? Of task? An interaction?* — **no, no, yes**.

Both "no" answers are counter-intuitive, which is what makes the question worth
asking. The feedback rows average to 60 and 60; the task columns average to 60
and 60; and the difference of differences is 20 − (−20) = 40.

## Activity sequence

1. **Commit to all three predictions.**
2. **Read the marginal means** in the paired table and confirm the two zeros.
3. **Press Remove the interaction** and watch the marginal means hold still.
4. **Work through the five presets**, naming the shape each time.
5. **Swap the axes** on the fan and confirm the interaction does not move.
6. **Take the trivial pattern** through zoom → full scale → error bars.
7. **Open the "read it the other way round" disclosure** and check that both
   subtractions give the same number.
8. **Build the sentence** in the challenge.

## Debrief questions

1. Feedback changed scores by 20 points in both conditions, and its main effect
   was zero. How is that possible, and what does it tell you about main effects?
2. Write the interaction as a subtraction twice, once each way round. Why are
   they equal?
3. Which factor should go on the horizontal axis, and what decides it?
4. Two plots show the same four means, one zoomed and one full scale. Which is
   the honest one?
5. Your interaction is 0.5 points and the error bars are large. What sentence
   would you write?
6. When is it safe to describe a main effect on its own, and when is it not?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "No main effect means the factor did nothing." | Crossover preset. Twenty points in each direction. |
| "The lines are far apart, so there is an interaction." | Parallel preset: far apart, interaction exactly zero. |
| "The lines cross, so there are no main effects." | Load Hidden: they cross and there is still a 10-point main effect of task. |
| "An interaction belongs to one factor." | Open the disclosure. Same number both ways round. |
| "Swapping the axes changes the interaction." | Press the swap button and read the readout. |
| "Non-parallel lines prove an interaction." | Four means will never line up exactly. Add error bars. |
| "You must always interpret the interaction first." | True for disordinal patterns; for the fan, both can be described, as long as you say where the effect is bigger. |
| "Bigger interaction means a more important finding." | The trivial preset: half a point on a 100-point outcome. |

## Limitations and cautions

- **There is no dataset.** Four cell means and nothing else. The tool computes
  no *F*, no *p* and no effect size, because there is nothing to compute them
  from — no within-cell variation and no sample sizes.
- **The error bars are stated, not estimated.** In a real analysis they come
  from the data.
- **Non-overlapping error bars are not a test**, and for an interaction they are
  the wrong comparison: the quantity of interest is the difference of
  differences, which has its own standard error (2s for four independent cells
  each with standard error s).
- **2×2 is the easy case.** With more levels, "the interaction" stops being one
  number; three-way interactions rarely survive being described in a sentence.
- **Nothing here is about causation.** The same pattern arises whether the
  factors were manipulated or measured.

## Accessibility considerations

- Native ranges, selects, radios and buttons; every control labelled, every
  group in a fieldset with a legend.
- Cell sliders announce meaningful text ("70.0 points for immediate feedback on
  the simple task").
- The plot is hidden from assistive technology and paired inside its figure with
  a **visible table** of the four cell means and both sets of marginal means.
- The two lines are told apart by **dash pattern, marker shape (circles against
  squares) and a name printed at the right-hand end**; every point carries its
  value as text.
- Signed quantities print an explicit **+** or **−**.
- The pinned primary result measures 514px tall at 1366×768.
- Every preset, axis change, uncertainty change and axis swap announces a full
  sentence; focus moves to the detective heading when it opens; forced-colours
  rules provided; usable at 320px.

## Optional extension tasks

1. **Invent a fan that hides a main effect.** Find four means with a large
   interaction, a large main effect of task and none of feedback.
2. **Rewrite four abstracts.** One sentence per preset, saying what happened
   without using the word "interaction".
3. **Set the uncertainty first.** Choose the large error bars, then find the
   smallest interaction you would be willing to describe as real, and justify
   the threshold.
4. **Find the trap.** Construct a pair of cell means that would look like a
   strong crossover on a zoomed axis and like nothing at all on the full scale.

## The model

```
row means      immediate = (IS + IC)/2      delayed = (DS + DC)/2
column means   simple    = (IS + DS)/2      complex = (IC + DC)/2
main effect of feedback = delayed row - immediate row
main effect of task     = complex col - simple col
interaction             = (DC - DS) - (IC - IS) = (DC - IC) - (DS - IS)

Remove the interaction:  cell(i,j) := row mean i + column mean j - grand mean
Standard error of the interaction, for cells each with standard error s:  2s
```

### Reference values a lecturer can check

| Preset | Cell means (IS, IC, DS, DC) | Feedback | Task | Interaction |
| --- | --- | --- | --- | --- |
| Crossover | 70, 50, 50, 70 | 0.0 | 0.0 | +40.0 |
| Fan | 60, 60, 62, 76 | +9.0 | +7.0 | +14.0 |
| Parallel | 55, 70, 65, 80 | +10.0 | +15.0 | 0.0 |
| Hidden | 50, 80, 70, 60 | 0.0 | +10.0 | −40.0 |
| Dramatic-looking and trivial | 70, 70.5, 71, 72 | +1.3 | +0.8 | +0.5 |

With the crossover loaded, **Remove the interaction** sets all four cells to
**60.0**, and every marginal mean stays at 60.0.

With the trivial preset and the large error bars (standard error 5 per cell),
the interaction's own standard error is **10.0**, so the interaction sits
**0.1** standard errors from zero — and on the zoomed axis it looks like a fan.

## Citation and evidence notes

- **Rosnow and Rosenthal (1989)**, "Definition and interpretation of interaction
  effects", for the difference-of-differences definition and for the warning
  against reading interactions off residual-free cell means.
- **Loftus (1978)**, on why the scale of the dependent variable determines what
  an interaction plot can be taken to show.
- **Wagenmakers et al. (2012)** and **Nieuwenhuis, Forstmann and Wagenmakers
  (2011)** on the error of inferring an interaction from two separate tests
  rather than testing the difference of differences.
- **Cumming (2009)**, "Inference by eye", for the poor performance of error-bar
  overlap as a substitute for a comparison.
- **Cohen, Cohen, West and Aiken (2003)**, chapter 9, for ordinal against
  disordinal interactions and what each permits about main effects.

References are deliberately not embedded in the page, so the tool does not
appear to derive its invented cell means from any of them.
