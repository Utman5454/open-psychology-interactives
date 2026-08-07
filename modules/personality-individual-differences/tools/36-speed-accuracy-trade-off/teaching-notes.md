# Teaching notes — Speed–Accuracy Trade-Off

`modules/personality-individual-differences/tools/36-speed-accuracy-trade-off/`

One dial moves two outcomes. Reporting either alone lets a strategy difference
masquerade as an ability difference.

---

## Before you run this

This is the only tool in the module that asks a student to *perform* anything,
so the design gives it three exits:

1. **Nothing is ever timed out.** Every trial waits indefinitely. Nothing
   flashes. The keys are stated before any block begins.
2. **Untimed practice with feedback runs first**, so nobody meets the scored
   block cold.
3. **Nobody has to do the task at all.** The fictional-strategy simulator and
   the caution slider produce the entire argument, and the debrief does not
   depend on anyone's own data.

Say the third point aloud before you start. A speeded task is not neutral for
everyone in a room — motor impairment, tremor, visual difficulty, anxiety,
pain, medication and simple unfamiliarity all affect it — and the tool is built
so that opting out costs nothing pedagogically.

## Running it from the front

Nobody needs to do the task. The strategy simulator below produces the whole argument from a slider, and the debrief does not depend on anyone's own data. If you are running this with a group, that is worth saying before you start rather than after.

The most useful single move is the caution slider: one dial moves accuracy and reaction time together while the drift rate — the ability term — never changes.

## Intended level

First- or second-year undergraduate. Useful in research methods as much as in
individual differences, because the data-cleaning section applies to any
reaction-time study.

## Learning objectives

After the activity a student should be able to:

1. explain why a single outcome measure cannot separate ability from caution;
2. read a joint speed–accuracy plot;
3. distinguish a drift-rate difference from a threshold difference;
4. explain why RT means and medians disagree;
5. recognise exclusion cut-offs as researcher choices that move results.

## Estimated duration

- **Demonstration from the front:** 8 minutes using the slider alone.
- **Students doing the task and the simulator:** 20 minutes.
- **With the challenge and debrief:** 30 minutes.

## The prediction question

> Two people do the same discrimination task. One is consistently faster, and
> they are equally accurate. **What can you conclude about the faster one?**

"They are better at the task" is the common answer. It is exactly the inference
the tool dismantles: equal accuracy with different speed is what you get from
two people of *equal ability* sitting at different points on the trade-off
curve.

## The demonstration worth doing from the front

Skip the task. Go to **Move the caution dial yourself** and drag it from 0.30
to 2.20.

- Expected accuracy climbs from about 60% to about 99%.
- Expected reaction time climbs by several hundred milliseconds.
- The drift rate — the ability term — never changes.

Say while dragging: *nothing about this person's ability moved. Both of their
scores did.*

Then point at the table: Impulsive, Balanced and Cautious share a drift rate of
1.5. They are the same person, three times, with three different thresholds.

## Activity sequence

1. **Predict** from equal accuracy and different speed.
2. **Practice** — four untimed trials with feedback. (Optional.)
3. **The scored block** — sixteen trials. (Optional.)
4. **Your point on the plot.** Where the student's own accuracy and median RT
   fall relative to the curve.
5. **The mean/median gap** in the results panel, and the cleaning rule.
6. **The four respondents.** Three equal in ability, one not.
7. **The caution slider.**
8. **The challenge.**

## Debrief questions

1. You and the person next to you have different accuracies. Does that mean one
   of you is better at the task?
2. Which respondent in the table would win a study that scored accuracy only?
   Which would win one that scored speed only?
3. Why does "go as fast as you can while staying accurate" not solve the
   problem?
4. Your mean and median RT differed. Which would you report, and why?
5. The cleaning rule removes trials under 200 ms and over 4000 ms. Who chose
   those numbers, and what would happen if they were 250 and 3000?
6. What would you need in order to say that two people genuinely differ in
   ability rather than in caution?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Faster is better." | The curve. Faster is cheaper, and it is paid for in accuracy. |
| "Then just score accuracy." | The most cautious respondent wins regardless of ability. Same problem, other end. |
| "Tell everyone to respond at the same speed." | You cannot enforce it, and forcing a common deadline changes what the task measures for people at different points on the curve. |
| "This measures impulsivity." | It estimates response caution on this task at this moment. Impulsivity is a broad trait with a contested structure; a threshold parameter is not it, and this tool says so explicitly. |
| "My score was bad." | Sixteen trials in a browser. It is not a measurement of anything about anyone. |
| "Removing outliers is objective." | Show the results panel: the cut-off changed the median. Someone chose the cut-off. |

## Anticipations

Responses arriving in under **150 ms** are treated as anticipations rather than
reactions: nobody perceives nine arrows, decides and moves a finger that fast.
They are counted, reported to the student, and kept out of the median and mean
rather than silently averaged in.

This is worth pointing out, because it is the first cleaning decision every
reaction-time analysis makes and it is usually invisible. If a student presses
a key before looking, the tool says so rather than treating the keypress as a
datum. If *every* response was an anticipation, the results panel says that
too and declines to compute anything.

## Limitations and cautions

- **The task measures nothing about the user** — not intelligence, impulsivity,
  attention or inhibition, and nothing clinical.
- **Browser timing is imprecise** by tens of milliseconds; laboratory equipment
  exists to remove exactly that noise.
- **Sixteen trials is far too few** for any estimate. Model fitting typically
  needs hundreds per condition.
- **The closed form is a simplification** — expected accuracy and mean decision
  time for an unbiased accumulator. Real fitting uses the whole distribution,
  allows starting-point bias and estimates parameter variability.
- **The four respondents are fictional**, with parameters chosen for legibility.

## Accessibility considerations

- **No trial is timed out.** The stimulus persists until answered.
- **Nothing flashes**, at any rate.
- **Untimed practice with feedback** precedes the scored block.
- **Key mapping stated on screen** before any block begins.
- Responses accept Left/Right arrow keys *or* two buttons at least 3.5rem tall,
  so keyboard, pointer and touch are all first-class.
- The arrow display is `aria-hidden` and paired with a sentence giving the
  counts, so a trial can be answered without perceiving nine small glyphs.
- **A complete non-timed route exists** and is signposted before the task: the
  simulator and slider reach every conclusion without performing it.
- Charts are hidden from assistive technology and paired with a table stating
  drift rate and threshold outright; the ability-different respondent is drawn
  hollow as well as in a different colour.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Find the crossover.** Set the caution slider so that expected accuracy
   matches the "Lower drift rate" respondent. Compare reaction times. What
   would a study reporting accuracy only conclude about these two?
2. **Write the method section.** Specify your exclusion rule, whether you
   analyse correct trials only, and which central tendency you report — before
   seeing any data.
3. **Design the discriminating analysis.** You have choices and RTs from 200
   people. How would you tell an ability difference from a caution difference?
4. **The instruction problem.** Draft task instructions that would push
   everybody towards the same point on the curve, then say why they will not
   work.

## The model

Also documented at the top of `tool.js`. For an unbiased diffusion process with
drift rate *v*, threshold *a* and non-decision time *t₀*:

```
expected accuracy      = 1 / (1 + exp(−2·v·a))
expected decision time = (a / v) · tanh(v · a)
expected RT            = t₀ + decision time
```

### The four fictional respondents

| Respondent | Drift rate | Threshold | Accuracy | RT |
| --- | --- | --- | --- | --- |
| Impulsive | 1.50 | 0.55 | ≈ 84% | ≈ 600 ms |
| Balanced | 1.50 | 1.05 | ≈ 96% | ≈ 890 ms |
| Cautious | 1.50 | 1.75 | ≈ 99% | ≈ 1420 ms |
| Lower drift rate | 0.85 | 1.05 | ≈ 86% | ≈ 990 ms |

The first three share a drift rate: they are the same ability, three times
over. The fourth is placed so that its accuracy sits between Impulsive and
Balanced — which is what makes the challenge work, since an accuracy-only study
would rank it above a genuinely equal-ability respondent who happened to be
less cautious.

## Citation and evidence notes

- **Ratcliff (1978)** and **Ratcliff and McKoon (2008)** for the diffusion
  model and the closed forms used here.
- **Wickelgren (1977)** on the speed–accuracy trade-off as a function rather
  than a nuisance.
- **Heitz (2014)**, *The speed–accuracy tradeoff: history, physiology,
  methodology*, is the best single review to set alongside this tool.
- **Ratcliff, Thapar and McKoon** on ageing and decision making, for the
  classic case where a raw RT difference turns out to be threshold rather than
  drift.
- **Whelan (2008)** on effective analysis of reaction-time data, for the
  cleaning decisions.
- **Ulrich and Miller (1994)** on how outlier-exclusion rules bias RT estimates.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its parameters from any of them.
