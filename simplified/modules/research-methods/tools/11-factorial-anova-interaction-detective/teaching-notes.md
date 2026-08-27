# Factorial Interaction Detective — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** Second year and above, once one-way ANOVA is secure
**Edition:** Simplified, and deliberately narrower than its parent. This keeps
the editable cell means and the interaction plot from **Factorial ANOVA
Interaction Detective** and adds the two questions that decide whether the
picture means anything. The pattern presets, the additive-fit control, the
read-it-the-other-way disclosure, the three-part prediction and the
fill-in-the-sentence challenge are in the longer version at
`modules/research-methods/tools/11-factorial-anova-interaction-detective/`.

## Learning objectives

By the end, a student should be able to:

1. compute an interaction as a difference of differences from four cell means;
2. explain why it is the same number whichever factor is treated as the
   moderator;
3. recognise that how large an interaction *looks* depends on the axis;
4. judge an interaction against the uncertainty in the means;
5. explain why a main effect can be worse than useless under a crossover.

## Preparation

None. The activity opens on an exact crossover: 70, 50, 50, 70. Both main
effects are zero and the interaction carries the entire pattern.

## Suggested use

**Projected, driven from the front.** Open on the crossover and ask what the
main effect of feedback timing is. Students who read the lines will say
*delayed is better for complex tasks*. Then show that the main effect is
exactly zero. The gap between what the plot shows and what the main effect
reports is the point of factorial designs.

**In a lecture on graph reading**, using the scale control alone. Set a small
interaction, switch the axis from full to zoomed, and ask the room whether the
finding got bigger.

**In a dissertation workshop**, on the standard-error control, immediately
before students plot their own cell means without error bars.

## Prediction question

Ask before anything is changed:

> Immediate feedback gives 70 on the simple task and 50 on the complex one.
> Delayed feedback gives 50 and 70. What is the main effect of feedback timing?

Almost nobody says zero on first hearing, because the lines are dramatic. Write
the predictions up, then reveal. The lesson is not that the main effect is
wrong but that averaging over a factor that reverses the direction of an effect
destroys the finding.

## Activity sequence

1. **Start on the crossover.** Both main effects are 0. The interaction is 40.
   Establish that the plot and the main effects are both telling the truth
   about different questions.
2. **Make it additive.** Set the cells to 70, 50, 60, 40. The lines become
   parallel, the interaction goes to 0, and both main effects appear. Parallel
   lines are what *no interaction* looks like.
3. **Make it small.** Set 70, 50, 62, 44: an interaction of 4 on the full axis
   is nearly invisible. Now switch the scale to zoomed. It looks substantial.
   Nothing about the study changed.
4. **Add uncertainty.** With the interaction still at 4, set the standard error
   to 5. The error bars swamp it, and the readout reports the interaction as
   less than half of its own standard error. Then set the interaction back to
   40 and watch it survive.
5. **Release the explanation.**

## Debrief questions

- Under the opening crossover, is *immediate feedback works better* true,
  false, or not the kind of statement the design supports?
- Two papers report the same interaction. One plots it on a 0 to 100 axis, the
  other on a 44 to 72 axis. Which is being dishonest?
- You are told the interaction is 4 points. What else do you need before you
  can say anything about it?
- The interaction is the same number whether you describe complexity as
  moderating feedback or feedback as moderating complexity. Does that mean the
  two descriptions are equally useful?

## Likely misconceptions

- **An interaction is when one factor matters and the other does not.** It is
  when the effect of one *changes across levels* of the other.
- **Crossing lines mean an interaction; parallel lines mean none.** The second
  half is right. The first is nearly right, and non-parallel non-crossing lines
  catch students out. Step 3 is built for this.
- **Main effects should be interpreted first.** In the presence of a crossover
  they can be exactly zero while the factor matters enormously.
- **A dramatic plot is a large effect.** The scale control is the whole answer.
- **The interaction depends on which factor is on the x-axis.** It does not;
  the difference of differences is symmetric. This is stated in the synthesis.

## Limitations and cautions

There is deliberately no F, no p and no effect size here, and that is a design
decision rather than an omission. Four cell means carry no information about
within-cell variation or sample size, so any test statistic computed from them
would be fabricated. The standard error is a value the student sets, not one
estimated from data, and the *interaction in units of its own standard error*
figure assumes four independent cell means with equal standard errors, giving
the difference of differences a standard error of 2s. Real designs have
unequal cell sizes and correlated estimates in within-subjects factors. The
numbers throughout are fictional and describe no real study.

## Accessibility considerations

Every cell mean is a labelled number input and every presentation choice is a
native select, all keyboard operable. The plot carries a description giving all
four means, both main effects, the interaction, and the interaction relative to
its standard error where one is set, so a screen-reader user has every quantity
without reading the lines. The two lines differ by dash pattern and end marker
as well as by colour, and each is labelled at its right-hand end rather than in
a separate key. On a narrow screen the figure scrolls sideways rather than
shrinking its labels below legibility, and becomes keyboard-reachable when it
does. Changes are announced politely. No timed content, no motion.

## Optional extension

Give students four cell means from a published paper in their reading and ask
them to reproduce the plot here, then to set the standard error to the one the
paper reports. A surprising number of published interaction plots do not
survive this.

## Evidence and citation notes

The crossover example is generic and invented. For why main effects should not
be interpreted in the presence of a crossover, and for the difference of
differences formulation, see Rosnow and Rosenthal (1989), *Definition and
interpretation of interaction effects*, **Psychological Bulletin**, 105(1),
143–146. On the axis-scale problem in published figures see Cleveland (1994),
*The Elements of Graphing Data*.
