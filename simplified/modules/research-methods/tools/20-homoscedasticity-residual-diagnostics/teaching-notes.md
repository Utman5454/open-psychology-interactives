# Does the Spread Stay the Same? — Simplified Edition

**Module:** Research Methods
**Duration:** 6–8 minutes
**Level:** Second year and above, once regression is secure
**Edition:** Simplified, and narrower than its parent. This keeps the paired
plots from **Homoscedasticity and Residual Diagnostics** and reveals the second
one only after the learner has tried to answer the question from the first. The
sample-size control, the repeated-sampling coverage check and the
diagnose-four-plots exercise are in the longer version at
`modules/research-methods/tools/20-homoscedasticity-residual-diagnostics/`.

## Learning objectives

By the end, a student should be able to:

1. say that the slope summarises the average relationship in one number;
2. say why the raw scatter plot makes the pattern of spread hard to judge;
3. describe a residual as the vertical distance from a point to the line;
4. define homoscedasticity as roughly even residual spread across the range,
   and heteroscedasticity as spread that changes;
5. say that an ordinary-looking slope can sit on top of a residual pattern the
   slope itself cannot show.

## Preparation

None. Seed 5150 gives every student the same sixty people in each group.

The three groups are called A, B and C rather than "even", "fanning out" and
"widest at both ends". That is deliberate: a student who can read the answer
off a radio button has not been asked the question. The vocabulary arrives
after the looking, not before.

## Suggested use

**Projected, and do not rush past the first screen.** The opening state is one
plot, one number and one question. Ask the room to click through the three
groups and vote on which has an even spread. Take the vote before pressing the
button. Classes are usually confident and usually wrong about at least one of
the three, and Group C in particular reads as even to almost everyone.

Then press *Take the line out and look again*.

**In a lecture on regression assumptions**, as the reason a residual plot is
compulsory rather than optional.

**With a student who has been told to "check for heteroscedasticity"** and does
not know what they are looking at.

## Prediction question

The activity asks it directly, before the reveal:

> Follow the line from left to right. Does the band of dots around it stay
> about the same width the whole way, or does it get wider or narrower in
> places?

Do this for all three groups and record the room's answers on the board before
revealing anything. The gap between those answers and the lower plot is the
whole lesson, and it is far more persuasive as a failed prediction than as a
statement.

## Activity sequence

1. **Look at Group A, B and C in turn, with only the scatter plot showing.**
   Note that the slope barely changes between them.
2. **Vote.** Which have an even spread?
3. **Press the button.** The lower plot appears on the same horizontal axis.
4. **Read what a residual is** from the note that appears: the vertical
   distance from each dot to the line, positive above and negative below,
   which is why the dots now sit around zero.
5. **Click between the three groups again** and watch the lower plot. Group A
   is an even band. Group B is a wedge. Group C is pinched in the middle and
   loose at both edges. The upper plot barely moves throughout.
6. **Read the two spread figures** for the left and right thirds. Note that
   for Group C they are nearly equal, and that comparing only the two ends
   would have missed it entirely: the middle is the giveaway.
7. **Open the explanation** and, if the group is ready for it, work through
   the *Going further* section on the two standard errors.

## Debrief questions

- What question does the scatter plot answer? What question does the residual
  plot answer?
- Why does taking the line out make the spread easier to judge?
- The slope is about the same for all three groups. What does that tell you
  about what a slope can and cannot detect?
- For Group C the two end figures are almost equal. What would you have
  concluded from those two numbers alone?
- You find uneven spread in your own data. What is the next question?

## Likely misconceptions

- **A residual plot is a different dataset.** It is the same people, with the
  line pulled flat. The shared horizontal axis is there to make that visible,
  and it is worth pointing at.
- **Uneven spread biases the slope.** It does not. The slope tile is there so
  students can watch it not happening.
- **You can see uneven spread perfectly well in the scatter plot.** The vote
  in step 2 settles this faster than any argument.
- **Comparing the two ends is enough.** Group C is the counterexample.
- **A dramatic residual plot means badly wrong inference.** See below.
- **One sample settles it.** At sixty people the eye is unreliable and so is
  the arithmetic; hence the seed, and hence the note about repeats.

## Limitations and cautions

Two points in the closing explanation deserve emphasis, and both are places
where the usual classroom account is too simple.

First, **how alarming a residual plot looks is not a good guide to how much it
costs you.** A slope is pinned down mostly by the people at the two ends of the
range, so what matters is whether the extra spread sits there. Group B looks
dramatic and barely moves the numbers; Group C looks no worse and moves them by
about a fifth. The page reports this as an average over two hundred repeats of
each design, not from the sample on screen.

Second, **a single sample of sixty is far too noisy to make that comparison
from.** The ordinary and robust figures on screen can differ by ten per cent
with the spread perfectly even, purely by chance, and the page says so and
invites the student to change the seed and watch. HC0 is also known to run a
little optimistic at this sample size.

Beyond that: uneven spread is not the worst thing a residual plot can show, and
a clear curve in the residuals means the straight line was the wrong model
altogether, which no adjustment to a standard error repairs. All data here are
fictional.

## Accessibility considerations

The group switch is a radio group with all three labels permanently visible.
The figure description changes with the state of the activity: before the
reveal it says the question is not settled by the plot alone, and afterwards it
names the shape of the residual band in words, an even band, a wedge or an
hourglass, and gives the spread across the left third, the middle and the right
third, along with both standard errors. Nothing therefore depends on judging a
scatter by eye. Both panels are titled, both vertical axes are labelled in
plain words and ticked, and the zero line is labelled on the figure. A written
interpretation sits beneath the tiles and differs by group. On a narrow screen
the figure scrolls sideways rather than shrinking its labels below legibility.
No timed content and no motion.

## Optional extension

Ask students to run a regression on their own data and produce a residuals
against fitted values plot, then bring it to the next session for the group to
judge. Having just discovered that their eyes are unreliable here, they tend to
be usefully cautious about their own.

## Evidence and citation notes

The robust estimator is due to Eicker (1967) and White (1980), *A
heteroskedasticity-consistent covariance matrix estimator and a direct test for
heteroskedasticity*, **Econometrica**, 48(4), 817–838. On the small-sample
behaviour of the various HC variants, and why HC0 is optimistic at these sizes,
see Long and Ervin (2000), *Using heteroscedasticity consistent standard errors
in the linear regression model*, **The American Statistician**, 54(3), 217–224.
On the general point that the consequences of a violated assumption depend on
the design rather than on the violation alone, see Gelman and Hill (2007),
*Data Analysis Using Regression and Multilevel/Hierarchical Models*, chapter 3,
which ranks the regression assumptions by how much they actually matter.
