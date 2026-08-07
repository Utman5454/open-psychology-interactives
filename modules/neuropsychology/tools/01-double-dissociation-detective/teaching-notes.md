# Teaching notes — Double Dissociation Detective

`modules/neuropsychology/tools/01-double-dissociation-detective/`

A lesion is evidence about what a task needs, not a label saying what tissue
does. This tool is about the narrower question underneath that: when is a
pattern of scores entitled to the word *dissociation*?

---

## Intended level

First- or second-year undergraduate neuropsychology, or a research-methods
strand that wants a worked example of single-case inference. It assumes the
idea of a standard deviation and of a confidence interval; it does not assume
any neuroanatomy, and deliberately mentions none.

## Learning objectives

After the activity a student should be able to:

1. state what a single dissociation establishes and what rival explanation it
   leaves standing;
2. explain the logical work a crossover does, in one sentence, without
   mentioning brain regions;
3. reference a score to its own control group and say why raw percentages on
   two tasks are not comparable;
4. decide whether a difference is larger than the measurement precision of the
   test that produced it;
5. spot a crossover that is real but does not isolate the process of interest.

## Estimated duration

- **Demonstration from the front:** 10 minutes — cases 4 and 5 alone carry the
  argument.
- **Students in pairs:** 30 minutes for all six files.
- **With the challenge and debrief:** 45 minutes.

## Preparation

None. Read the "these are not patients" panel aloud before starting; it sets
the ethical frame and saves a detour later.

## The demonstration worth doing from the front

**Case 4.** Put it on screen and read only the raw scores: 88% on one task,
30% on the other. Ask for a show of hands on "dissociation or not". Most rooms
say yes.

Then point at the **Controls** column. Healthy controls average 95% on the face
task and 52% on the word-pair task. Referenced to their own controls the two
scores are −1.4 and −1.2 — a difference of 0.18 control SDs, against 2.16 that
40 items can resolve.

Say while switching: *the 58-point gap was a gap between two rulers, not
between two abilities.*

**Case 5** is the second demonstration and takes two minutes. At 40 items,
neither difference is resolvable. Drag the slider to 50: one becomes
resolvable and the file is a single dissociation. Drag to 55: both are, and the
same three scores are now a double dissociation. Nothing about the two people
changed.

## Prediction question

Before the case files open, students commit to an answer:

> One fictional person scores 91% on a word-picture matching task and 48% on a
> picture-naming task. Both tasks use everyday objects. What does that pattern,
> on its own, establish?

The intended answer is *a difference worth explaining, with several
explanations still open*. Students who choose "separable processes" get the
naming step; students who choose "naming is simply harder" get the rival; the
point of the panel is that both survive.

## Activity sequence

1. **Commit to the opening judgement.**
2. **Case 1 — one person, two tasks.** A single dissociation. Ask what a second
   person would have to show to strengthen it.
3. **Case 2 — two people, same shape.** Two resolvable differences, no
   crossover. Ask whether the second person added anything logically.
4. **Case 3 — two people, opposite shapes.** The crossover. Ask them to state,
   in one sentence, what it rules out.
5. **Case 4 — the 58-point gap.** The control-referencing lesson.
6. **Case 5 — the slider.** The precision lesson.
7. **Case 6 — a crossover with a problem.** Insist the task-demands table and
   the case notes are read before a verdict is returned.
8. **The challenge.**

## Debrief questions

1. In one sentence and without mentioning any brain region, what does a double
   dissociation rule out?
2. Case 2 has two people and two resolvable differences. Why is it not worth
   more than case 1?
3. Why is comparing 88% with 30% not a comparison at all?
4. In case 5, nothing about the two people changed and the verdict did. What
   exactly changed?
5. Case 6 is a genuine crossover. Name the two things that differ between the
   people and the two things that differ between the tasks, and say why the
   pairing matters.
6. A colleague says "we found a double dissociation, so these two functions are
   in different parts of the brain". What would you add, remove or qualify?
7. What could you do next, in case 6, to decide whether visual and tactile
   object recognition really do come apart?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A big gap is a dissociation." | Case 4. The biggest raw gap on the page is not a dissociation at all. |
| "A double dissociation proves two separate brain modules." | Nothing on the page mentions anatomy. A crossover is evidence about tasks. Connectionist models produce crossovers from damage to a single undivided system. |
| "Two patients are better than one, so case 2 beats case 1." | Only reversal adds logic. A second person in the same direction adds severity. |
| "The intervals are a technicality." | Case 5. Same scores, three different verdicts. Precision decides what is claimable. |
| "Case 6 is a trick." | It is what most real cases look like before follow-up testing. The confound is stated in the case notes; it just has to be read. |
| "Task impurity means dissociations are useless." | Overcorrection. It means a crossover isolates a process only when nothing else differing between the tasks could produce the same crossover — which is a design requirement, not a defeat. |
| "The control group tells you whether the person is impaired." | It tells you where the score sits in a distribution. Effort, fatigue, education, language, sensory impairment, mood and premorbid level all sit between a low score and "damage to X". |

## Limitations and cautions

- **No anatomy, deliberately.** The tool never says where any damage is,
  because a dissociation between tasks is evidence about functional
  separability. Separable processes can be distributed across the same tissue.
- **Constrains, does not prove.** A double dissociation excludes a single
  graded resource shared by the two tasks in the same proportions. It remains
  compatible with overlapping networks, strategy differences, a shared
  component plus two specific ones, and single-system models.
- **The statistics are simplified.** Binomial standard errors, control mean and
  SD treated as known exactly. Proper single-case comparison uses Crawford and
  Howell's modified *t* test, which allows for a finite control sample and
  gives wider intervals than these.
- **Fixed proportions.** The slider changes precision only. A genuinely longer
  test would change the estimate as well.
- **Two people are not a syndrome.** Real dissociation evidence accumulates
  across many cases and converging methods.
- **Nobody is assessed.** No test, no score for the user, no clinical judgement
  of any kind, and every case is invented.

## Accessibility considerations

- Native `select`, `range`, radio and button controls; no dragging of anything
  except the slider, which is keyboard operable.
- The slider announces "55 items per task", not "55".
- The interval plot is `aria-hidden` and paired with a visible table giving
  raw score, control mean and SD, control-referenced score, its 95% interval
  and whether each difference is resolvable.
- Point markers are **filled or hollow**, a shape difference, and the table
  states "clearly below the control range" in words, so nothing depends on
  colour.
- The chart is pinned as `.stage__primary`, so it stays on screen while the
  verdict radios at the bottom of the control column are reached. Verified at
  1366×768 and 1440×900.
- Case changes, slider changes and verdicts announce through the polite live
  region.
- Wide tables scroll inside their own containers; the page never scrolls
  sideways at 320px.

## Optional extension tasks

1. **Rewrite case 6.** What two changes to the tasks would make the crossover
   interpretable? What extra testing would you do on the two people?
2. **Find the threshold.** In case 5, find the shortest test at which the file
   is a double dissociation, and write the methods sentence you would need to
   defend it.
3. **Design case 7.** Invent a pair of scores and a pair of control groups that
   look like a severity difference and are actually a double dissociation.
4. **The reverse question.** What pattern of scores would count as evidence
   *against* two tasks being separable? Is there one?
5. **Read a real report.** Take any single-case paper and check whether the
   difference between the two critical tasks would survive being treated as an
   estimate with an interval.

## The model

Also documented at the top of `tool.js`.

```
z      = (score − controlMean) / controlSd
SEz    = sqrt(p(1 − p) / n) / controlSd
SE(dz) = sqrt(SEz(a)² + SEz(b)²)
resolvable when |dz| > 1.96 × SE(dz)
```

Classification:

| Resolvable differences | Directions | Verdict |
| --- | --- | --- |
| none | — | not enough evidence |
| one | — | single dissociation |
| two | same | general severity difference |
| two | opposite | double dissociation |
| two | opposite, case flagged impure | crossover the tasks cannot support |

The last row is the only one the arithmetic cannot reach. Whether two tasks
differ in more than the process of interest is a judgement about the case notes
and the task-demands table, and case 6 carries a flag the numbers know nothing
about. That asymmetry is intentional and worth naming in the debrief.

### Reference values a lecturer can check

At the default 40 items per task:

| Case | Person A difference (needs) | Person B difference (needs) | Verdict |
| --- | --- | --- | --- |
| 1 | 4.75 SD (2.63) | — | single dissociation |
| 2 | 2.38 SD (1.79) | 2.62 SD (1.73) | general severity difference |
| 3 | 6.52 SD (2.43) | 4.07 SD (1.78) | double dissociation |
| 4 | 0.18 SD (2.16) | — | not enough evidence |
| 5 | 1.70 SD (1.97) | 1.80 SD (1.94) | not enough evidence |
| 6 | 4.47 SD (2.14) | 6.07 SD (2.83) | crossover the tasks cannot support |

Case 5 across test lengths: 15–45 items, not enough evidence; 50 items, single
dissociation (only Person B's difference resolves); 55 items and above, double
dissociation.

## Citation and evidence notes

- **Teuber (1955)** for the introduction of double dissociation as the logic
  for separating deficits.
- **Shallice (1988)**, *From Neuropsychology to Mental Structure*, for the
  fullest treatment of what single and double dissociations license and of task
  resource-artefact accounts.
- **Dunn and Kirsner (1988, 2003)** for the argument that even double
  dissociations do not establish modularity, and for reversed association as
  the stronger criterion.
- **Plaut (1995)** and **Juola and Plaut (2000)** for connectionist
  demonstrations that a single undivided system can produce double
  dissociations under damage.
- **Crawford and Howell (1998)** and **Crawford and Garthwaite (2005)** for the
  modified *t* test used when comparing a single case with a small control
  sample, which is what the simplified intervals here stand in for.
- **Caramazza (1986)** on the logic of single-case studies in cognitive
  neuropsychology.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional cases from any of them.
