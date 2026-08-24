# Double Dissociation Detective — Simplified Edition

**Module:** Neuropsychology
**Duration:** 6–7 minutes
**Level:** Second year and above, or first year alongside an introduction to
single-case methods
**Edition:** Simplified. The longer version, with six case files including a
large raw gap that is not a dissociation and a clean crossover on tasks that
differ in too much, plus a closing challenge, is at
`modules/neuropsychology/tools/01-double-dissociation-detective/`.

## Learning objectives

By the end, a student should be able to:

1. explain why raw percentages on two different tasks are not comparable, and
   read each score against its own control group instead;
2. state the rival explanation a single dissociation cannot rule out, and say
   why a second person with the same pattern does not rule it out either;
3. explain why a crossover does rule it out;
4. judge whether a difference is larger than measurement error before
   classifying it;
5. say what a double dissociation establishes, and what it does not.

## Preparation

None. It runs in a browser with no account, no network and no setup, and
works from a downloaded folder. Students do not need to have met the term
"double dissociation" beforehand; the four case files build it.

## Suggested use

**Projected, as a demonstration.** Take the verdict from the room on each of
the first three files. File 2 is where the useful disagreement happens: a
good proportion of any group will call it a double dissociation because there
are two people and two tasks. Let that happen before revealing it.

**As preparation** for a session on single-case logic or on assessment
design. Ask students to arrive able to say, in one sentence, what a second
person adds and what only a reversal adds.

**As a five-minute opener** before a lecture on modularity, so that the
inference is in place before the anatomy is.

## Prediction question

Before students open it, ask:

> One person scores 48% on naming pictures and 91% on matching a spoken word
> to a picture. What does that tell you?

Most rooms will say the two abilities are separate. The activity's first file
is exactly this, and its answer is more careful: the tasks come apart, but
naming may simply be the harder task.

## Activity sequence

1. **One person, two tasks.** A single dissociation. The feedback names the
   rival explanation and leaves it standing.
2. **Two people, the same shape.** Both further below controls on delayed
   recall. A general severity difference. The rival is *still* standing, and
   this is the point of the file: a second person adds severity, not logic.
3. **Two people, opposite shapes.** The crossover. The rival dies, because a
   task cannot be more demanding for one person and less demanding for
   another simply by being more demanding.
4. **The same scores, a longer test.** No verdict to choose. A slider for how
   many items each task contained, and a verdict that changes as it moves.

Files 1 to 3 ask for a verdict from the same fixed four-way scheme, so
students are classifying evidence rather than picking from options written
for each question.

## Debrief questions

- In file 1, what would you need to add to rule out "naming is just harder"?
- In file 2, Person B is worse than Person A on both tasks. Why does that add
  nothing to the logic?
- What exactly does the crossover in file 3 rule out, and what does it leave
  open?
- In file 4, the four percentages never change. What is changing, and why
  does it change the verdict?
- A colleague reports a crossover from a 25-item task. What do you ask?

## The moment worth stopping on

File 4, moved slowly. At 40 items the two point estimates cross, and the
verdict is *not enough evidence*. At 50 items one difference resolves and it
becomes a single dissociation. At 55 and above both resolve and the same four
percentages are a double dissociation.

Nothing about the two people changed. A crossover in the point estimates is
not a crossover in the evidence, and test length is what decides which one
you have. If you only have time for one thing from this activity, this is it.

## Likely misconceptions

**"Two people and two tasks means a double dissociation."** File 2 exists to
break this. Watch for it in file 3 as well, where students sometimes get the
right answer for the wrong reason.

**"A bigger gap is stronger evidence."** It is not, and the control groups are
why: a 34-point gap on tasks whose controls differ can be a smaller departure
than a 20-point gap on tasks whose controls do not. This is why every score
is plotted against its own control group rather than as a raw percentage.

**"A crossover proves two brain regions."** It establishes at least partly
separable processing. Where that processing sits is a different question, and
none of these files touches it. Say this explicitly; it is the most common
overreach in student writing on this topic.

**"The statistics are a formality."** File 4 makes them the whole verdict.

**Reading a hollow marker as a normal score.** A hollow marker means the
interval overlaps the control range, not that performance is fine. Point at
one and ask what it licenses.

## Limitations and cautions

- These are not patients. Every person, task, score, control mean and control
  standard deviation is invented. No figure is a norm, a prevalence or a
  published value.
- Three simplifications are carried over from the original and are worth
  naming if your group is doing single-case work for real. The observed
  proportion is held fixed as test length varies, so the slider isolates
  precision; a longer test would move the estimate too. Control mean and
  standard deviation are treated as known exactly, where a proper single-case
  comparison uses a modified *t* test and gives wider intervals than these.
  The binomial standard error assumes items are independent and equally
  difficult, which no real task satisfies.
- Two tasks always differ in more than the process of interest. A clean
  reversal on tasks that differ in several ways does not tell you which
  difference produced it. The synthesis states this; the longer version has a
  case file that demonstrates it.
- The activity says nothing about lesion location, imaging, or how a
  dissociation would be established across a group rather than in single
  cases.

## Accessibility

Keyboard operable throughout, with a visible focus indicator at every step.
Answered verdicts are marked `aria-disabled` rather than `disabled`, so
students can tab back and re-read the feedback. In the plot, a score whose
whole interval clears the control range gets a filled marker rather than a
hollow one, so the distinction survives greyscale and does not depend on
colour; the shaded control band is dashed so its edge stays visible against a
pale ground. Every plotted value also appears in the data table beneath the
plot, and the plot's description is rewritten for each file. The slider is a
native range input paired with an output, and verdict changes are announced
through a polite live region. There is no timed content and no motion.

## Extension

Give students file 3's scores and ask them to design the follow-up that would
tell you *which* difference between naming and block design produced the
reversal. Most proposals turn out to require a third task that shares one
demand and not the other, which is the real work of a dissociation study and
is exactly what a single crossover does not do for you.

## Evidence and reading

The logic of single and double dissociation in cognitive neuropsychology, and
the standard cautions about task impurity and about resource artefacts, are
the background here. Crawford and Howell's work on comparing a single case
with a small control sample is the right next step for students who ask how
the intervals should really be computed. Direct students to those rather than
to this activity: it is a way of practising the inference, not a summary of
the literature.
