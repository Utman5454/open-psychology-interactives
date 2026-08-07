# Teaching notes — Confidence Interval Laboratory

`modules/research-methods/tools/09-confidence-interval-laboratory/`

Draw six studies one at a time before you run the hundred, and after each one
ask the room how a real research team would know whether that interval caught
the truth. The answer — they would not — is the whole session.

---

## Running it from the front

Draw six or seven studies one at a time before running the hundred. Ask after each one whether it caught the truth, and ask how anybody would know that in a real study. The honest answer &mdash; you would not &mdash; is the whole lesson.

Then run the hundred, note the coverage, and drag the sample size from 25 to 200. The bars become far shorter and the coverage stays where it was. Width and coverage are two different properties, and students routinely fuse them.

The best moment here is the second trial: 2,400 participants, an interval that excludes zero comfortably, and a result that is still worthless if three extra minutes of walking a day is not worth an app. Ask the room what the abstract would say.

Then take the third trial &mdash; interval from &minus;6 to &plus;34 &mdash; and ask whether the app "did not work". It is compatible with no change and with a change three times larger than anyone hoped for. Nothing has been shown either way.

Finally, drag the threshold to 3 and re-judge all four. The data have not changed and three of the four verdicts have.

## Intended level

First- or second-year undergraduate meeting estimation, and again with anyone
writing a results section. It assumes the mean, the standard deviation and the
idea of a sampling distribution, so it follows naturally from tool 08 in this
module. It sets up the effect-size, t-test and power tools that come after it.

## Learning objectives

After the activity a student should be able to:

1. say what the 95% in a 95% confidence interval is a property of;
2. distinguish an interval's **width** from the **coverage** of the procedure
   that produced it;
3. explain why sample size changes precision but not long-run coverage, and why
   the confidence level changes both;
4. judge a reported interval against a stated threshold of practical importance
   rather than against zero alone;
5. explain why a wide interval containing zero is an inconclusive study rather
   than a negative one.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Write "the true mean is 12.0" on the board before you start and leave it
there — students forget within two minutes that the simulation knows something
the studies do not.

## The demonstration worth doing from the front

1. Press **Draw one study** six times. Read each interval aloud and ask, each
   time, "did that one catch it?" Then ask how you would answer that question
   without the board.
2. Press **Run 100 studies**. Point at the crosses. Read the coverage figure.
   That percentage — not the interval — is what "95% confidence" describes.
3. Drag **Participants per study** from 25 to 200 and run another hundred. The
   bars collapse to about a third of their length; the coverage does not move.
   Width and coverage are two different properties and students fuse them.
4. Set the **confidence level** to 99% and run again. Coverage rises, and so
   does width. That is the trade, and it is the only control that makes it.
5. In Experiment 2, judge the **PaceMate** trial: 2,400 people, an interval
   nowhere near zero, and three extra minutes of walking a day. Ask what the
   press release would say.
6. Finally drag the threshold from 10 to 3 and re-judge all four. No datum has
   changed and three of the four verdicts have.

## Prediction question

*One hundred teams each run the same study on the same population and each
reports a 95% confidence interval. How many contain the true mean?* — all 100;
**about 95, whatever the sample size is**; it depends on the sample size; about
68.

"It depends on the sample size" is the instructive wrong answer and gets its own
response: larger samples really do give better studies, but what they buy is
narrower intervals, not more frequent hits.

## Activity sequence

1. **Commit to a prediction.**
2. **Six single studies**, naming the hit or miss each time.
3. **A hundred studies**, and read the coverage off the table.
4. **Change n**, run again, and compare width against coverage.
5. **Change the confidence level** to 80% and to 99% and do the same.
6. **Experiment 2**: set a threshold, then judge all four trials.
7. **Move the threshold** and re-judge.
8. **The challenge**, which is seven statements about one interval.

## Debrief questions

1. Every interval in the plot came from the same population. Why are they not
   all in the same place?
2. Complete honestly: "95% of the time, this procedure ..."
3. You have one interval and no board. What can you say about whether it
   contains the truth?
4. Sample size changed the picture dramatically and left the coverage alone.
   What exactly did it buy?
5. PaceMate reports a highly significant result. Write the one sentence its
   abstract should contain and does not.
6. WalkWell reports "no significant effect". What is wrong with that summary,
   and what would you write instead?
7. Who should set the smallest change worth having, and when?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "There's a 95% chance the true value is in this interval." | Once the sample is in, the limits and the parameter are all fixed numbers. Ask what is left to be random. |
| "A bigger sample means the interval is more likely to be right." | Run 100 at n = 25 and at n = 200 and compare the coverage figures. |
| "95% of people fall in the interval." | It is an interval for the mean. Individual variation here is five times wider. |
| "The interval excludes zero, so the effect is important." | PaceMate. Ask them to justify installing the app. |
| "The interval includes zero, so there is no effect." | WalkWell. Its interval reaches 34 minutes. |
| "Values outside the interval are ruled out." | A value just outside is barely less compatible than one just inside. The boundary is a convention. |
| "99% intervals are better." | They are more often right and less often useful. Show both widths. |
| "The threshold should come from the data." | Then it would move whenever the data did. Ask what that would mean. |

## Limitations and cautions

- **No real data.** The population, the samples and all four trials are
  invented. Nothing here estimates anything about real walking or real apps.
- **The simulation knows σ; a real study does not.** Intervals here are
  mean ± z·σ/√n. Real intervals estimate the standard deviation from the sample
  and use *t*, which widens them at small n.
- **Nominal coverage is a promise from the model.** It holds because the
  simulated samples really are independent draws from the stated distribution.
  Non-response, clustering, measurement error or a post-hoc analysis break it,
  and the interval will not say so.
- **The threshold is a placeholder.** Setting a smallest difference that matters
  in a real field is substantive, contested and usually collaborative.
- **This is one school of thought.** A probability statement about where the
  parameter lies is a credible interval and needs a prior. Sometimes numerically
  similar; never the same claim.

## Accessibility considerations

- Native ranges, a select, a number input, radios, checkboxes and buttons; every
  control labelled, every group in a fieldset with a legend.
- Sliders announce meaningful text ("25 participants in each study").
- Both charts are hidden from assistive technology and paired inside their
  figures with **visible tables**; a disclosure lists the ten most recent
  studies row by row with their limits and their verdict.
- A missed interval is **dashed and marked with a cross** drawn at the true
  value, so a miss never depends on colour. The "worth having" band carries a
  **diagonal hatch** and a printed label as well as a tint.
- Each experiment has one pinned primary result, measured at 461px and 391px
  tall at 1366×768, so the controls beside it stay usable above the fold.
- Focus moves to the Experiment 1 heading when it opens; every action announces
  a full sentence; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the sample size that halves the width.** Then say what it did to the
   coverage.
2. **Write four abstracts.** One per trial, each honest about both precision and
   importance. Compare them with the write-ups described in the tool.
3. **Set the threshold first.** Before looking at Experiment 2, agree a
   threshold as a group and write it down. Then judge. Discuss what changed
   about the discussion.
4. **Break the model.** Describe a design in which the simulated independence
   fails, and say what would happen to the real coverage of a nominal 95%
   interval.

## The model

```
population    ~ Normal(12.0, sigma)          sigma set by the slider
study         : n draws, sample mean m
interval      : m +/- z(level) * sigma / sqrt(n)
z             : 80% -> 1.2816   90% -> 1.6449   95% -> 1.9600   99% -> 2.5758
hit           : lower <= 12.0 <= upper
```

Sigma is known to the model, so the multiplier is a normal quantile and nominal
coverage is exact. Randomness is seeded (`mulberry32` plus Box–Muller), and
changing n, σ or the level clears the pile because those studies came from a
different procedure.

Experiment 2 classifies a fixed interval against the learner's threshold *t*:

```
lower >= t                       -> beats the threshold
upper >= t (but lower < t)       -> too wide to decide
upper <  t and lower > 0         -> real but too small to matter
upper <  t and lower <= 0        -> compatible with nothing worth having
```

### Reference values a lecturer can check

At the defaults — **n = 25, σ = 20, 95%, seed 2109**:

- every interval is **15.7 minutes** wide (2 × 1.96 × 20/√25 = 15.68);
- the first single study drawn has sample mean **8.7**, interval
  **0.8 to 16.5**, and contains the true mean;
- a fresh run of 100 studies gives **93.0% coverage**.

Holding σ = 20 and seed 2109, running 100 studies each time:

| Setting | Interval width | Coverage in this run |
| --- | --- | --- |
| n = 25, 95% | 15.7 min | 93.0% |
| n = 200, 95% | 5.5 min | 93.0% |
| n = 25, 99% | 20.6 min | 99.0% |
| n = 25, 80% | 10.3 min | 77.0% |

The widths are exact properties of the procedure and will reproduce. The
coverage figures move with the seed and with the run; the nominal level is what
they orbit.

The four fictional trials, and their verdicts at the default threshold of 10:

| Trial | n | Reported change | 95% interval | Verdict at t = 10 |
| --- | --- | --- | --- | --- |
| StepUp | 300 | 22.0 | [18.0, 26.0] | beats the threshold |
| PaceMate | 2400 | 3.0 | [1.2, 4.8] | real but too small to matter |
| WalkWell | 18 | 14.0 | [−6.0, 34.0] | too wide to decide |
| StrideAlong | 1900 | 0.5 | [−1.5, 2.5] | compatible with nothing worth having |

At t = 25, StepUp becomes "too wide to decide" — a useful shock.

## Citation and evidence notes

- **Cumming (2014)**, "The new statistics: why and how", for estimation in place
  of dichotomous testing and for the dance-of-the-intervals demonstration this
  tool's first experiment is a version of.
- **Greenland et al. (2016)**, "Statistical tests, P values, confidence
  intervals, and power: a guide to misinterpretations" — the source for the
  taxonomy used in the challenge.
- **Morey, Hoekstra, Rouder, Lee and Wagenmakers (2016)**, "The fallacy of
  placing confidence in confidence intervals", for why the probability reading
  is not a slip of the tongue but a different inferential system.
- **Lakens, Scheel and Isager (2018)** on specifying a smallest effect size of
  interest before the data arrive, which is what Experiment 2 dramatises.
- **Amrhein, Greenland and McShane (2019)**, "Retire statistical significance",
  for the WalkWell case: an inconclusive study reported as a negative one.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated numbers from any of them.
