# What r Cannot See — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** First or second year, as correlation is introduced
**Edition:** Simplified, and narrower than its parent. This keeps the live
scatter and the movable observation from **Correlation: Outliers and
Non-Linearity**. The negative and zero relationship presets, the
change-of-units demonstration and the guess-the-correlation challenge set are
in the longer version at
`modules/research-methods/tools/18-correlation-outlier-nonlinearity-lab/`.

## Learning objectives

By the end, a student should be able to:

1. say what r measures, with the emphasis on *straight*;
2. recognise that a strong curved relationship gives an r near zero;
3. recognise that one point in twenty-five can create a correlation;
4. distinguish an unusual observation from an influential one;
5. say why the scatter plot has to be looked at first.

## Preparation

None. The twenty-four fixed points are generated from constant seeds, so every
student sees the same cloud and you can quote the same numbers: on the
shapeless cloud, r is −0.00, and moving the ringed point to the top-right
corner takes it to +0.52.

## Suggested use

**Projected, using the built-in challenges.** They walk the four cases in the
right order: the arch, the manufactured correlation, high leverage, low
leverage. Press the button, read the note, discuss, press again.

**In a lecture on descriptive statistics**, as the reason scatter plots are
compulsory rather than decorative.

**Before students correlate anything of their own.**

## Prediction question

Switch to *An arch* before saying anything, and ask:

> Look at this plot. On a scale from minus one to plus one, what is r?

Students who read the plot as "a very strong relationship" will say 0.8 or 0.9.
It is near zero. That gap between what the eye sees and what the coefficient
reports is the point, and it is much better discovered than announced.

## Activity sequence

1. **Start on the straight line.** Establish that r is strong and that moving
   the ringed point around the middle barely changes it.
2. **Switch to the arch.** r collapses towards zero while the relationship is
   as obvious as it could be. Ask what the number is actually answering.
3. **Switch to the shapeless cloud.** r is −0.00 and the dashed line is flat.
   Now drag the ringed point to the top-right corner: r is +0.52 and the solid
   line swings up. Point out that the dashed line has not moved at all.
4. **Back to the straight line, and the leverage contrast.** Put the point at
   96 across and 8 up: r drops a long way. Now move it straight up to 96 up,
   leaving it at 96 across: r recovers. Then put it at 50 across and 96 up: it
   is just as strange, and it barely matters. Leverage is about position on
   the horizontal axis, not about being odd.
5. **Release the explanation.**

## Debrief questions

- What question is r actually answering, in one sentence?
- On the arch, would you say the two variables are related? Would r?
- A paper reports r = 0.5 from 25 participants. What do you want to see?
- If one point is doing all the work, should it be deleted?
- Why does an outlier in the middle of the x range matter so much less?

## Likely misconceptions

- **r measures how strongly two variables are related.** It measures how well
  a straight line fits. The arch is the counterexample.
- **r near zero means no relationship.** It means no *linear* relationship.
- **An r of 0.5 means half the variation is explained.** It means a quarter;
  the r-squared tile is there for this.
- **Outliers are always influential.** Step 4 separates the two ideas directly,
  and this is the distinction students most often lack.
- **The right response to an influential point is to remove it.** It is to find
  out what it is. The caution says so explicitly and recommends reporting the
  analysis both ways.

## Limitations and cautions

Both variables are deliberately unnamed, because the activity is about the
arithmetic rather than about any substantive claim, and nothing here is real
data. The activity does not address whether a correlation implies causation,
which is a separate and larger matter, nor restriction of range, nor
measurement error attenuating r, all of which the longer version and the
regression activity take up. A single influential point should never be
deleted on the strength of the arithmetic alone: whether it is a recording
error, a genuine rare case or a sign that the model is wrong is a question
about the study.

## Accessibility considerations

The movable point is controlled by two labelled range inputs rather than by
dragging. That is a deliberate choice: a drag target is hard to operate from a
keyboard and cannot report its position, whereas a slider announces both. The
pattern switch is a radio group with all three labels permanently visible. The
two fitted lines differ by dash pattern and are named in a key carrying a
sample of each, placed clear of the plot. The description gives the shape of
the cloud, the point's position, both correlations and both slopes. On a narrow
screen the figure scrolls sideways rather than shrinking its labels below
legibility. No timed content and no motion.

## Optional extension

Show Anscombe's quartet afterwards, or the Datasaurus Dozen. Students who have
just spent five minutes manufacturing a correlation out of one point find those
much less surprising and much more convincing than students who have not.

## Evidence and citation notes

Anscombe (1973), *Graphs in statistical analysis*, **The American
Statistician**, 27(1), 17–21, is the original demonstration that identical
summary statistics can describe utterly different data. For the modern version
see Matejka and Fitzmaurice (2017), *Same stats, different graphs*,
**Proceedings of CHI 2017**. On leverage and influence, any regression text
covers hat values and Cook's distance; the qualitative point made here is that
leverage depends on position on the predictor.
