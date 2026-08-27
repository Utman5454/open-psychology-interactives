# Why It Is Called Least Squares — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** First or second year, as regression is introduced
**Edition:** Simplified, and narrower than its parent in scope but richer in
one respect. This keeps the hand-fitting interaction from **Regression: Slope
and Intercept** and adds the residual squares themselves. The prediction
exercise, the numeric target challenge and the standard error of the estimate
are in the longer version at
`modules/research-methods/tools/19-regression-slope-intercept-lab/`.

## Learning objectives

By the end, a student should be able to:

1. say what the intercept and slope each do;
2. say what least squares minimises, and why the name is literal;
3. say that exactly one line minimises it and that it is computed, not
   searched for;
4. interpret R squared as a comparison against predicting the mean;
5. say what a good fit does not establish.

## Preparation

None. The twelve observations come from a constant seed, so every student sees
the same data and you can quote the same answer: intercept 20.6, slope 0.49,
total area 1209.

## Suggested use

**Projected, with the room calling out adjustments.** Start on the deliberately
bad default. Ask for a direction: "up a bit", "steeper". Move the slider, watch
the squares shrink, read the running total. Students are usually surprised how
hard it is to beat about 1400 by eye.

**As a five-minute opener** to the lecture that derives the normal equations,
so the algebra arrives as the answer to a question they have already failed to
answer by hand.

**In a lab**, before students run their first regression.

## Prediction question

Before touching anything, with the bad default line on screen:

> R squared for this line is going to be a percentage. Roughly what?

Nobody predicts minus 100 per cent. Once they have seen it, ask what a negative
R squared could possibly mean, and let them work out that the line must be
doing worse than a flat line at the average. That is the correct definition
arrived at by inference rather than by decree.

## Activity sequence

1. **Look at the squares before touching anything.** Establish that the side of
   each square is the vertical miss and its area is that miss squared.
2. **Try to minimise the total by hand.** Give it a genuine minute. Note where
   the class gets stuck, usually somewhere around 1300 to 1500.
3. **Ask what happens to a point twice as far away.** Its square is four times
   the area. This is why squaring is a consequential choice, not a neutral one,
   and why distant points pull the line so hard.
4. **Press "Show me the best line".** Read the note: nothing was searched for.
5. **Nudge either slider one step in any direction** and confirm the total goes
   up. There is exactly one answer and no room for argument about it.
6. **Release the explanation** and read the caution about what a good fit is
   not evidence of.

## Debrief questions

- Why squares rather than the absolute distances? What would change?
- An observation is twice as far from the line as another. How much more does
  it contribute to the total?
- What does a negative R squared tell you about a line?
- The best-fitting line here has R squared of about 62 per cent. Is that good?
  Good for what?
- If I gave you a set of points on a perfect circle, would least squares return
  a line? Should you report it?

## Likely misconceptions

- **The squares are a metaphor or a computational convenience.** They are
  literally the areas being minimised, which is why they are drawn.
- **The computer searches for the best line.** It solves for it in one step.
  The reveal note says this explicitly, and the hand-fitting beforehand is
  what makes the contrast land.
- **R squared is the percentage of variance explained, full stop.** It is the
  improvement over predicting the mean, which is why it can go negative.
- **A high R squared means the model is right.** A line can be fitted to
  anything. The caution says so.
- **The intercept is always meaningful.** Only when X of zero can occur.
- **Residuals are errors in the data.** They are the model's misses, not the
  measurements' mistakes.

## Limitations and cautions

The best-fitting line is not evidence that a straight line is the right model,
is not a causal claim, and does not indicate how the line would perform on new
cases, since it was chosen to suit these twelve observations specifically. The
intercept is interpretable only where X of zero is a possible value. Squaring
the residuals makes the fit sensitive to distant observations, which is a
property worth knowing before trusting any regression output; the correlation
activity next door shows the same thing from the other direction. All data here
are fictional and the variables are deliberately unnamed.

## Accessibility considerations

Both coefficients are labelled range inputs reporting their value in text. The
figure description gives the current line, both totals, R squared and the exact
best-fitting coefficients, so a student using a screen reader can reach the
answer without judging any areas by eye. The running total is printed beside
the plot, repeated in the tiles and stated again in a full sentence beneath
them. On a narrow screen the figure scrolls sideways rather than shrinking its
labels below legibility. No timed content and no motion.

## Optional extension

Ask students what line would be best if you minimised the total of the
*absolute* distances instead of the squares. There is no closed form, the
answer is less sensitive to distant points, and the discussion is a good
introduction to why robust regression exists.

## Evidence and citation notes

Least squares is due to Legendre (1805) and Gauss (1809), and the priority
dispute between them is a good five minutes of lecture in its own right. On the
sensitivity of least squares to influential observations, and on robust
alternatives, see Fox (2016), *Applied Regression Analysis and Generalized
Linear Models*, 3rd edition, chapter 19.
