# Teaching notes — Confound Detective

`modules/research-methods/tools/03-confound-detective/`

There is a button in every study that does nothing. Use it.

---

## Intended level

First- or second-year undergraduate research methods. It assumes the idea of an
independent and dependent variable and nothing else. Study 2 works well again
later with students meeting observational epidemiology or health psychology.

## Learning objectives

After the activity a student should be able to:

1. state the two conditions a variable must meet before it can bias a
   comparison;
2. distinguish a confound from a nuisance variable, from part of the
   manipulation, and from a constant;
3. explain why increasing sample size fixes noise and cannot fix bias;
4. compare what randomisation and statistical adjustment each require in order
   to work;
5. choose a repair that removes a named bias rather than one that only tidies
   the estimate.

## Estimated duration

- **Demonstration from the front:** 10 minutes — study 1 alone.
- **Students in pairs:** 30 minutes for all three.
- **With the challenge and debrief:** 45 minutes.

## Preparation

None. It helps to have the two conditions on the board before you start:
*systematic difference between conditions* and *a route to the outcome*.

## The demonstration worth doing from the front

Study 1. Open the repair bench with nothing ticked. The study would report
**17.0 marks** where the true effect is **3.0**.

Now tick **Recruit 400 students instead of 60** and nothing else. Read the two
bars aloud. The estimate does not move by a hundredth of a mark. What changes is
one line of text: the interval is about 2.6 times narrower.

That is the whole distinction between noise and bias in one click, and it is the
single most useful thirty seconds in the tool. Ask what the paper would look
like: same wrong number, smaller p-value, more confident abstract.

Then tick **Deliver the app to half of each seminar group** and watch two
confound nodes go dashed at once.

## Prediction question

*A study reports that students who use the library more get higher marks. A
critic objects that motivation is a confound. For that objection to work, what
must be true of motivation?* — it varies between students; it is related to
marks; **both** of those *and* it differs systematically with library use; it is
uncontrolled.

Each option gets a written response. "It is related to marks" is the productive
near-miss: a variable related to the outcome but not to the comparison is noise,
which widens the interval and leaves the estimate where it was.

## Activity sequence

1. **Commit to an answer** on the opening question.
2. **Study 1 — the revision app.** Classify the five variables. Breakfast is the
   one nearly everybody calls a confound; the note explains why it is not.
3. **Open the repair bench.** Try the sample-size button first, on its own.
4. **Repair properly.** Note that randomising students to condition does *not*
   fix the tutor or the timetable, because those belong to the seminar group.
5. **Study 2 — the quiet ward.** Confounding by indication, and the one study
   where a statistical adjustment is on offer. Compare **adjust for severity**
   (removes 75%) with **randomise** (removes it and the consultant entirely).
6. **Study 3 — the typeface.** Order and material are two separate rotations.
   Ticking one leaves the other wide open, which surprises people.
7. **The challenge.**

## Debrief questions

1. Breakfast affects exam performance. Why is it not a confound in study 1?
2. Randomising students to app or no app leaves two large biases untouched. Why?
3. In study 2, the adjustment removes 75% of the severity bias. What would have
   to be true for it to remove 100%? Why does randomisation not need that list?
4. Study 3's between-groups repair removes a bias and makes the estimate less
   precise. When would you take that trade?
5. The tool always knows the true effect. What does a real researcher have
   instead?
6. You block every confound in the diagram. Name three things that are still
   wrong with the study.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Get a bigger sample." | The sample-size button. Estimate unchanged, interval narrower, wrong answer stated more confidently. |
| "Any variable you did not control is a confound." | Breakfast in study 1, month of admission in study 2, reading speed in study 3. All vary, none biases. |
| "Randomisation makes the groups the same." | It makes any difference between them a matter of chance rather than of anything systematic. The challenge's age option turns on exactly this. |
| "You can just control for it statistically." | Study 2. Adjustment needs the confounder measured, measured well, and modelled correctly; randomisation needs none of that. |
| "The app's spaced repetition is a confound." | It is the treatment. Removing it deletes the manipulation rather than cleaning the comparison. |
| "Counterbalancing fixes order effects." | It converts them from bias into noise. The practice effect still happens; it just no longer lines up with the conditions. |
| "It is a randomised trial, so it is fine." | The challenge. Differential attrition and unblinded assessment both undo randomisation after allocation. |

## Limitations and cautions

- **The bias figures are invented.** True effects and confound contributions
  were chosen to make the argument legible, not to estimate real confounding.
- **Bias adds up neatly here and does not in life.** Real confounds interact,
  point in opposite directions and sometimes cancel; additivity is a deliberate
  simplification so the arithmetic can be followed.
- **A repaired design is not a good study.** The measures, the sample, the power
  and the question are untouched by any of these repairs.
- **Directed diagrams encode assumptions.** The arrows shown are the ones the
  tool asserts. A different diagram is a substantive claim about the world.
- **The confound list is the list somebody thought of.** Blocking all of it says
  nothing about the confounds nobody named — a point the tool makes on screen
  when the estimate reaches the truth.
- **No real studies.** The module, the ward and the typography experiment are
  invented, as are the numbers.

## Accessibility considerations

- Native selects, checkboxes and buttons; every control labelled, every group in
  a fieldset with a legend.
- The causal diagram is hidden from assistive technology and paired with a
  visible table giving each confound, its status **in words** (open / partly
  blocked with a percentage / blocked) and the bias it contributes.
- Blocked nodes in the diagram carry a dashed outline **and** the word "blocked"
  printed inside the node, so the status never depends on the stroke colour.
- The two effect bars print their own name and their own number, and are
  distinguished by a stripe pattern as well as by fill.
- The study card, and once the repair bench opens the estimate, are pinned to
  the top of the stage so both stay visible while the controls are worked
  through.
- Every repair announces a full sentence including the new estimate.
- Reduced motion honoured for the bar transitions; forced-colours rules provided
  for every diagram and bar class; usable at 320px and at projector widths.

## Optional extension tasks

1. **Order the repairs by value for money.** For study 2, rank the five real
   repairs by bias removed per unit of practical difficulty, and defend the
   ranking.
2. **Write the limitations paragraph.** Take study 1 with only *blind marking*
   applied and write the three sentences the paper would owe its readers.
3. **Add a confound.** Propose a sixth variable for study 3 that meets both
   conditions, and the repair that would block it.
4. **The cancelling case.** Invent a study with two confounds that push in
   opposite directions and roughly cancel. What does that do to the argument
   that a study is "confounded"?

## The model

Also documented at the top of `tool.js`.

```
estimate = trueEffect + SUM over confounds of ( bias x remaining )
remaining = PRODUCT over applied repairs of ( 1 - fraction blocked )
```

Precision is tracked separately as a multiplier on interval width, so noise and
bias move independently on screen.

### Reference values a lecturer can check

| Study | True effect | Unrepaired estimate | Total bias |
| --- | --- | --- | --- |
| 1. Revision app | 3.0 marks | **17.0 marks** | 14.0 |
| 2. Quiet ward | 0.3 days | **2.4 days** | 2.2 |
| 3. Typeface | 1.5 seconds saved | **8.1 seconds saved** | 6.6 |

With every repair applied, all three estimates land exactly on the true effect
and the tool says on screen why that should not be reassuring.

Sample-size buttons and their precision multipliers: study 1, 2.6 times narrower;
study 2, 3.2 times narrower; study 3, 3.2 times narrower. None of them moves the
estimate by any amount. Study 3's *switch to a between-groups design* is the only
repair that makes precision **worse** (0.45, so about 2.2 times wider), because
it throws away the within-participants control of individual differences.

Note that the repair bench addresses every confound in the study, including two
in study 1 — self-selected groups and unblinded marking — that are described in
the study card but are not among the five variables classified in phase 1. The
control panel says so.

## Citation and evidence notes

- **Campbell and Stanley (1963)**, and **Shadish, Cook and Campbell (2002)** for
  the threats-to-validity framework these studies are built from, including
  attrition and instrumentation.
- **Hernán and Robins**, *Causal Inference: What If*, for confounding by
  indication and for why adjustment and randomisation are not interchangeable.
- **Pearl (2009)** for the directed-graph language the diagram borrows, and for
  the point that a diagram is a set of assumptions rather than a picture of the
  data.
- **Poulton and Freeman (1966)** on asymmetric transfer, which is why
  counterbalancing converts order effects into noise rather than deleting them.
- **Rosenthal (1966)** on experimenter expectancy, which is what the blinding
  repairs address.

References are deliberately not embedded in the page, so the tool does not
appear to derive its fictional studies or bias figures from any of them.
