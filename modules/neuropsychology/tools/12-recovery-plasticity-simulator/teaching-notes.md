# Teaching notes — Recovery and Plasticity Simulator

`modules/neuropsychology/tools/12-recovery-plasticity-simulator/`

Two routes reach a trained score of 86. One of them reaches 80 on a task the
person has never practised and the other reaches 71. The trained score cannot
tell them apart, and nothing else on the page can either.

---

## Intended level

Second- or third-year undergraduate neuropsychology, or a rehabilitation
strand. It assumes the idea of a standard deviation and of an untreated
comparison group. It is the last tool in this module and it reuses the habit
built by the others: ask what else would produce this observation.

## Learning objectives

After the activity a student should be able to:

1. name four processes that all raise a score after an injury and say how they
   differ in mechanism, time course and what they predict;
2. explain why a single trained-task score cannot separate them;
3. state what an untrained task, an alternate test form and an untreated
   comparison group each rule out;
4. read a fan of trajectories rather than a curve, and judge whether a
   month-to-month change means anything;
5. explain why compensation is a real gain and still not restored function.

## Estimated duration

- **Demonstration from the front:** 10 minutes - the fan, then Route A against
  Route B.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Read the "numbers from a model, not from people" panel aloud, and say
explicitly that nothing here forecasts anybody's outcome. Students who or
whose relatives have had an injury will otherwise read the curves as a
prediction, which they are not.

## The demonstration worth doing from the front

**Do not change anything.** Ask which of the five simulated people is
recovering. Then press **Draw five different people** two or three times. The
model is identical every time; the fan is individual variation and measurement
noise. A single person's curve is one draw from that fan.

**Turn measurement noise to high.** Now ask what a change from month 8 to
month 9 in one person would mean. Nothing: the standard deviation is 9 points
and the underlying change over a month is a fraction of that. This is why two
time points are not a trend.

**Set rehabilitation intensity to zero.** The curves still climb, and at mild
severity they climb a long way. Attributing a rise to a programme needs a
group who did not receive it.

**Then experiment 2, which is the argument.** Load **Route A** - intensive
training, no compensation - and note the readout: trained 86, untrained 80,
gap 5. Load **Route B** - no training at all, heavy compensation and support -
and note it again: trained 86, untrained 71, gap 15. The same trained score.
Ask which person has recovered. Then ask which measurement told you.

**Finally, the severe preset**: severity 10 with every slider at maximum. At
24 months the trained task reaches 76 and the untrained task 48. The ceilings
in the model shrink with severity on purpose, because a tool in which enough
training returns any injury to baseline would be teaching something false.

## Prediction question

> A fictional person's score on a training task rises from 40 to 68 over nine
> months of rehabilitation, measured on the same task every month.
> What does that establish?

Intended: *that the score rose - and at least four different things produce
that*. "The rehabilitation worked" is treated as a separate error worth its
own feedback: most of the early rise happens whatever anybody does.

## Activity sequence

1. **Commit to the opening judgement.** The simulator stays hidden until an
   answer is recorded; there is a skip button for demonstrators.
2. **Experiment 1**, redrawing the five people several times at each noise
   level. Ask each pair to write down the largest month-to-month change they
   can find that means nothing.
3. **Rehabilitation to zero**, and the question of what a rise would show.
4. **Experiment 2, Route A and Route B**, and the readout.
5. **Ask each pair to construct a third route** to the same trained score
   using the sliders, and to say what its untrained score would be before
   looking.
6. **The severe preset**, and a discussion of what a realistic goal is when
   restitution and relearning are both capped.
7. **The challenge** on what evidence would settle it.

## Debrief questions

1. Which of the four processes is the one most people mean by "recovery", and
   why do the other three look identical on the trained task?
2. Why does compensation not reach the untrained task? What would have to be
   true for it to?
3. What does an alternate form of the same test remove that an untrained task
   does not?
4. Most of the early rise happens without any training. What does that do to
   a before-and-after evaluation of a rehabilitation programme?
5. The five simulated people have the same injury and the same programme.
   What would you have to report about a group of them, and what would you
   not be entitled to say about any one of them?
6. A scan shows changed activity after training. Which of the four processes
   does that rule out?
7. Compensation is described here as a real gain. What does calling it
   "restored function" get wrong, in practical terms?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The score went up, so function came back." | Load Route B: no training at all, the same trained score, and 15 of those points are compensation and practice. |
| "The rehabilitation caused the improvement." | Set rehabilitation to zero. The curves still climb. |
| "Neuroplasticity means the brain can rewire around anything." | Load the severe preset with everything at maximum. Trained 76, untrained 48, at two years. |
| "Compensation means it did not work." | It is often the most useful thing available and it is a genuine gain. The error is in the description, not the outcome. |
| "This person improved between months 8 and 9." | Put noise on high and look at the size of a one-month change against a 9-point standard deviation. |
| "A smooth rising curve is what recovery looks like." | Redraw the five people. Some plateau, some drift down, and none of them is smooth. |
| "A scan would prove it." | Learning anything changes activity. Reorganisation is compatible with a person having learned a new way of doing the task. |
| "Practice effects are small enough to ignore." | Six points here, on a task administered monthly. That is larger than many reported treatment effects. |

## Limitations and cautions

- **None of this is data.** Every number comes from an invented equation with
  a visible seed. No published trajectory, effect size or recovery rate is
  reproduced.
- **No prognosis and no prediction.** The model must not be used to set
  expectations for anybody. Say so before and after.
- **Four processes is a simplification.** Diaschisis resolving, oedema,
  reperfusion, denervation supersensitivity, axonal sprouting, map
  reorganisation, strategy substitution and behavioural compensation are not
  four things and they overlap in time.
- **Smooth curves are wrong.** Real trajectories include illness, medication
  changes, mood, seizures, surgery and changes of circumstance.
- **Rehabilitation is one slider** standing for intensity, timing, content,
  specificity and how much the person wants to do it.
- **No anatomy.** The tool names no region and makes no claim at the level of
  tissue.
- **Be careful with the room.** Some students will have direct experience.
  The tool is about inference, not about anybody's outcome.

## Accessibility considerations

- Native range, radio and button controls; every control has an accessible
  name (verified programmatically) and every slider carries a meaningful
  `aria-valuetext` in words, for example "Injury severity 5 of 10, moderate,
  starting capacity 55 points" and "9 months after the injury".
- All three charts are `aria-hidden` and each carries a visible sentence
  inside its figure giving the same information in numbers, plus a table.
- Nothing depends on colour: the five trajectories have five different dash
  patterns **and** each prints its own label at the right-hand end; the
  trained and untrained lines are solid and dashed and both are labelled; the
  month marker is a dotted rule labelled with its month number; and the five
  segments of the decomposition bar are named in left-to-right order with
  their values in the sentence underneath.
- Each experiment has its own pinned primary and the inactive one is hidden.
  Measured at 1366×768 the pins are 355px and 264px; with the last control of
  experiment 1 scrolled to the bottom of the window the fan is still at the
  top of the stage.
- Nothing animates, so there is no motion to reduce.
- Every slider, preset and redraw announces through the polite live region;
  focus moves to the simulator heading when the prediction unlocks it.
- No horizontal page scroll at 320px, 375px, 1366px, 1440px or 1920px.

## Optional extension tasks

1. **Design the evaluation.** Write a two-paragraph design for evaluating a
   rehabilitation programme that would separate all four processes, and say
   what each element of it removes.
2. **Find a third route.** Using the sliders, reach a trained score of 86 by a
   route different from both presets, and predict its untrained score before
   you look.
3. **Add a fifth process.** Where would "the task itself got easier because
   the environment changed" sit, and what would identify it?
4. **Break the model.** Name three features of real trajectories the model
   does not have, and say what each would do to the argument.
5. **Write the letter.** Draft the paragraph you would send to a referrer
   after Route B, describing honestly what has and has not changed.

## The model

Severity *s* runs 1 to 10.

    C0   = max(5, 100 - 9s)                     lost = 100 - C0

    Restitution    Rmax = lost x (0.55 - 0.035s)
                   R(t) = Rmax x (1 - e^(-t/3))

    Relearning     Lmax = (lost - Rmax) x r x max(0.15, 0.75 - 0.045s)
                   L(t) = Lmax x (1 - e^(-t/9))

    Compensation   Kmax = min(22, (0.25k + 0.12e) x lost)
                   K(t) = Kmax x (1 - e^(-t/6))

    Practice       P(t) = 6 x (1 - e^(-t/4))

where *r* is rehabilitation intensity, *k* is strategy use and *e* is
environmental support, all 0 to 1.

    trained task   = clamp(C0 + R + L + K + P)
    untrained task = clamp(C0 + R + L)

so **the gap between the two curves is exactly K + P**. The tool computes it
rather than asserting it.

### Individual variation and noise (experiment 1 only)

Each of the five simulated people gets a restitution multiplier from
U(0.7, 1.3), a relearning multiplier from U(0.6, 1.4) and a late drift of
about N(0, 0.12) points per month applied after month 6. Measurement noise is
added independently at every month with SD 2, 5 or 9. Random numbers come from
`mulberry32` seeded at **20260812**, advancing by 7919 on each *Draw five
different people*, with Box–Muller for the normal deviates. Experiment 2 uses
no noise and no individual variation, so it shows the model rather than an
observation.

### Reference values a lecturer can check

Experiment 2, severity 5, read at **9 months**:

| Preset | Rehab | Strategy | Support | Trained | Untrained | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| Route A - restitution and relearning | 100% | 0% | 0% | 86 | 80 | 5 |
| Route B - compensation and practice | 0% | 80% | 60% | 86 | 71 | 15 |
| Mild injury, no rehabilitation (s = 2) | 0% | 0% | 0% | 96 | 90 | 5 |
| Severe injury, everything at maximum (s = 10) | 100% | 100% | 100% | 63 | 41 | 22 |

Route A at 9 months decomposes as start 55, restitution 16, relearning 9,
compensation 0, practice 5. Route B decomposes as start 55, restitution 16,
relearning 0, compensation 10, practice 5. Same total; different account.

The severe preset read at **24 months** gives trained 76 and untrained 48.
That is the ceiling this model allows with every slider at its maximum, and it
is deliberately well short of 100.

## Citation and evidence notes

- **Kolb and Gibb**, and the wider plasticity literature, for restitution and
  reorganisation, and for the fact that both are bounded.
- **Wilson (2008)** and the neuropsychological rehabilitation literature on
  compensation as a legitimate and often primary goal.
- **Kwakkel, Kollen and Twisk (2006)**, and **Prabhakaran et al. (2008)** on
  proportional recovery after stroke and on how much of the early change is
  spontaneous.
- **Robertson and Murre (1999)** on distinguishing restitution from
  compensation in rehabilitation outcomes.
- **Duff et al. (2007)** and the practice-effects literature, on how large
  repeated-administration gains can be on cognitive measures.
- **Calamia, Markon and Tranel (2012)** for a meta-analysis of practice
  effects across measures.
- **Cicerone et al. (2019)** for evidence-based reviews of cognitive
  rehabilitation, and for how carefully transfer has to be measured.
- **Poldrack (2000)** on why changed activity on imaging after training does
  not identify the mechanism.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its invented equations from any of them.
