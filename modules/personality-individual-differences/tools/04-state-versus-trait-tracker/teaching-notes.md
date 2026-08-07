# Teaching notes — State versus Trait Tracker

`modules/personality-individual-differences/tools/04-state-versus-trait-tracker/`

Fifty-six simulated moments from each of four fictional lives, met one moment
at a time.

---

## Running it from the front

Ada and Bo are built to share a typical level and differ sharply in how much they move around it. That pair is the centre of the tool: a trait questionnaire would describe them identically.

The measurement-error slider is the other one worth using from the front. Turn it up: the series gets visibly noisier, and every person's mean stays put. Error averages away; the person does not.

## Intended level

First- or second-year undergraduate meeting the state/trait distinction, or
any group about to design or interpret a study using repeated measures. It is
also the right tool immediately before teaching multilevel models, because it
makes the reason for them obvious before any equation appears.

## Learning objectives

After the activity a student should be able to:

1. separate a person's typical level from where they happen to be at one
   moment;
2. explain why within-person variability is a stable characteristic rather
   than noise;
3. explain why measurement error and genuine fluctuation are indistinguishable
   in one observation and separable across many;
4. say how many observations are needed to estimate a typical level, and why
   the answer depends on the person;
5. distinguish between-person from within-person variance.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students working in pairs:** 25 minutes.
- **With both challenges and full debrief:** 35 minutes.

## Preparation

None. If you want the class to see the same numbers you saw when preparing,
note the **seed** — it is shown in the controls and can be typed back in. The
default is `20260813`.

**Why that seed matters.** Ada and Bo are built to share a typical level of 62.
But Bo's within-person SD is 17, so even the mean of 56 observations has a
standard error of about 2.3 points — and on a randomly chosen seed their
*observed* means often differ by four or five points, which makes the central
comparison read as a difference rather than a match. The default seed was
chosen so the observed means come out at 62.1 and 62.0, with within-person SDs
of 4.5 and 18.6.

This is worth being open with a class about rather than hiding. Press **Draw a
new fortnight** a few times and watch the two means separate and re-converge:
that is a live demonstration that even a fortnight of intensive sampling
leaves real uncertainty about a variable person's typical level, and it is a
better lesson than the tidy default. Just do the designed comparison first.

## The prediction question

> Four people were asked how they were feeling, on a 0–100 scale, at one
> moment. **Rank them by what you think their typical level is.**

Most students rank straight down the four numbers in front of them, which is
the only thing available and is exactly the mistake the tool is about. Scores
of 2 out of 4 are common. Ada and Bo — who share a typical level — usually end
up ranked several places apart.

The deliberate design point: the question asks about *typical* level and the
evidence offered is a *momentary* one. Students rarely notice the mismatch
until it is shown to them.

## Activity sequence

1. **One moment.** Rank the four people. Reveal.
2. **The fortnight.** The full series appears, with each person's mean drawn
   through their line and the sampled moment marked.
3. **Ada and Bo.** Hide the other two. Same mean, wildly different lines. Ask
   what a trait questionnaire would say about them.
4. **The measurement-error slider.** Turn it up. The series gets noisier;
   every mean stays put. Turn within-person variability down to zero for
   contrast: the lines flatten onto their means and the people become their
   traits.
5. **The stability curve.** How many observations before the running average
   settles. Ada settles quickly, Bo slowly.
6. **Events on and off.** What a dated event does to several consecutive
   observations, and what it does to the fortnight mean.
7. **Challenges.**

## Debrief questions

1. Your ranking from one moment was about half right. What would have made it
   better — a better questionnaire, or more occasions?
2. Ada and Bo have the same mean. Are they the same on this characteristic?
   What would you need to report to describe them honestly?
3. Turn measurement error up to 20 and watch the means. Why do they barely
   move?
4. If error averages out and real fluctuation does not, how would you tell
   them apart in data you had not generated yourself?
5. A study takes one measurement from each of 200 people. What is it able to
   estimate well, and what is it unable to estimate at all?
   *(Between-person differences, badly; within-person variability, not at
   all.)*
6. The stability curve settles after about 5 observations for Ada and 25 for
   Bo. What does that imply for a study that gives everybody the same number
   of prompts?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The fluctuation is measurement error." | Set the error slider to 0. The fluctuation is still there — it is in the person, not the instrument. |
| "Traits are just averages of states." | Close, and it loses the width of the distribution. Ada and Bo have the same average and are not the same. |
| "High variability means unstable or unwell." | The variable here is deliberately unnamed and the events are ordinary. Variability is a dimension people differ on, not a symptom. Head this off early — students reach for it quickly. |
| "More observations always give a better estimate." | Of the *mean*, yes, with diminishing returns. But no number of observations rescues a badly-defined construct, and the curve flattens. |
| "The mean is the person, the rest is context." | The tool's whole argument is that the rest is also the person. |
| "You could work out the split from one score if you knew the reliability." | Reliability tells you about a population of scores, not about the composition of one score. This is Challenge 2. |

## Limitations and cautions

- **These are not data.** Four invented people and a seeded pseudo-random
  generator. The 0–100 scale is arbitrary; no norms, no reference sample.
- **Real experience sampling is far messier**: prompts are missed, and
  non-response usually correlates with the thing being measured.
- **No autocorrelation and no drift.** Consecutive observations are
  independent apart from event decay, and typical level does not move over the
  fortnight. Real series have both; inertia is itself an individual
  difference.
- **The decomposition is given, not estimated.** The tool knows each person's
  true level because it generated it. In real data this must be estimated with
  uncertainty, normally with a multilevel model.
- **Nothing here is clinical.** The variable is unnamed on purpose. Do not let
  the session drift into "which of these people is unwell" — none of them is
  anything, they are four arrays of numbers.
- **Nobody is assessed.** Students read simulated observations of fictional
  people and answer nothing about themselves.

## Accessibility considerations

- Ranking uses one native `select` per person; no dragging, so WCAG 2.5.7 is
  satisfied by construction. Duplicate ranks produce a written, announced
  error.
- The four series are distinguished three ways at once — colour, dash pattern,
  and the person's name printed at the end of their line — so no series
  depends on hue. Both charts are hidden from assistive technology and paired
  with visible tables carrying every summary figure.
- Sliders announce meaningful text: "measurement error standard deviation 3
  points", not "3".
- The seed is a plain number input, so a screen-reader user can record and
  restore a dataset exactly as anyone else can.
- Reset is reachable from the opening round, not only once the tracker
  appears.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Design the study.** You can afford 400 observations in total. Do you
   sample 100 people four times, or 20 people twenty times? What can each
   design estimate that the other cannot?
2. **Two hypotheses, one dataset.** Set within-person variability to 0 and
   error to 15; then variability to 1.5 and error to 0. The series look
   similar. What analysis would distinguish them, and what would you need?
3. **Write the case note.** Describe Bo's fortnight in three sentences without
   using the words "unstable", "moody" or any other evaluative term. Harder
   than it sounds, and the difficulty is the point.
4. **Find the seed.** Ask students to find a seed where the single-moment
   ranking happens to be completely correct, and then say what that proves.
   (Nothing. That is the answer.)

## The simulation model

Also documented at the top of `tool.js`.

```
observed(p,t) = trait(p) + event(p,t) + wobble(p,t) + error(p,t)
```

- `trait(p)` — the person's stable level.
- `wobble(p,t)` — normal, SD = that person's own within-person variability
  (scaled by the slider). A property of the person.
- `error(p,t)` — normal, SD set by the measurement-error slider. Not a
  property of the person; averages towards zero.
- `event(p,t)` — a dated effect decaying by a factor of 0.55 per observation,
  so one event moves several consecutive readings.

Fourteen days × four observations = 56 points per person. Random numbers come
from a seeded mulberry32 generator with Box–Muller for normality, so a given
seed always reproduces the same fortnight exactly.

### The cast

| Person | Typical level | Within-person SD | Built to show |
| --- | --- | --- | --- |
| Ada | 62 | 4 | Same mean as Bo, very steady |
| Bo | 62 | 17 | Same mean as Ada, highly variable |
| Cleo | 40 | 11 | Lower level, moderate variability |
| Dev | 74 | 9 | Higher level, moderate variability |

Ada and Bo are the pair the tool is built around. Cleo and Dev exist so that
the single-moment ranking is not a two-way guess, and so that a moment exists
where Cleo is above Dev.

### Events

| Person | Day | Effect | Label |
| --- | --- | --- | --- |
| Bo | 4 | −22 | a difficult conversation |
| Bo | 9 | +20 | an unexpected success |
| Cleo | 6 | +18 | good news |
| Dev | 11 | −16 | a setback |

## Citation and evidence notes

- **Fleeson (2001)**, *Toward a structure- and process-integrated view of
  personality*, is the paper this tool is closest to: people's momentary states
  cover most of the trait range within a fortnight, and the density
  distribution of those states is what is stable.
- **Epstein (1979)** on aggregation covers why averaging rescues prediction.
- **Csikszentmihalyi and Larson (1987)** on the experience-sampling method
  itself.
- **Kuppens, Oravecz and Tuerlinckx (2010)** on individual differences in
  emotional variability and inertia — the "width" of the distribution as a
  characteristic in its own right.
- Any introduction to multilevel modelling for the estimation problem the tool
  sidesteps by knowing the answer.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
