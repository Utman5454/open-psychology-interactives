# Teaching notes — Sampling Bias Simulator

`modules/research-methods/tools/04-sampling-bias-simulator/`

Twenty draws at n = 120, then twenty draws at n = 1,000. The cloud tightens and
does not move. That is the lesson, and it takes ninety seconds.

---

## Running it from the front

The sequence that makes the point: choose convenience, press Recruit 20 samples, and note where the cloud of dots sits. Then drag the sample size to 1,000 and press it again. The cloud gets much tighter and does not move towards the line. That is the whole distinction, and no amount of talking lands it as well.

Then choose simple random sample, which sits on the line, and raise the non-response tilt to 90%. The dots march away again. A probability sample is only unbiased while the people it selects actually take part.

## Intended level

First-year undergraduate research methods. It assumes only the idea of an
average. It also works well with final-year students planning recruitment for
a project, who tend to arrive believing that a bigger sample is always the fix.

## Learning objectives

After the activity a student should be able to:

1. separate sampling variability from systematic selection bias;
2. explain why a larger sample narrows the interval and cannot move a biased
   estimate;
3. describe what a quota corrects and what it leaves untouched;
4. state what a probability sample still needs in order to stay unbiased;
5. identify which practical changes to a survey reduce bias rather than scatter.

## Estimated duration

- **Demonstration from the front:** 8 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. Say once, before starting, that the population mean printed on screen is
something no real researcher ever gets to see.

## The demonstration worth doing from the front

1. Leave the method on **Convenience**, size at 120. Press **Recruit 20
   samples**. Note the cloud of hollow circles, all to the right of the line.
   The running difference is about **+2.8 hours** on a truth of **11.29**.
2. Drag the sample size to **1,000** and press **Recruit 20 samples** again. The
   cloud is visibly tighter. The running difference is still about **+2.3
   hours**. Ask what a paper would report in each case.
3. Now switch to **Simple random sample**. The dots straddle the line.
4. Raise the **non-response tilt** to 90% and draw twenty more. The dots march
   right again, to about **+0.8**. Randomly selecting names protects the
   selection step; it does nothing about the step where people decide whether to
   answer.

## Prediction question

*A researcher posts a survey link on the university's social-media accounts and
gets 900 responses. What will 900 responses buy them?* — an estimate close to
the truth; **a precise estimate of something that is not quite the population
average**; an estimate that could land anywhere; nothing without the response
rate.

"Could land anywhere" is the productive near-miss and gets its own response:
self-selection does not scatter estimates, it pulls them consistently one way,
which is worse because it looks like replication.

## Activity sequence

1. **Commit to a prediction.**
2. **Convenience, 20 draws.** Look at the composition table: commuters and
   students with jobs are badly under-represented, and both study less.
3. **Raise n to 1,000, 20 more draws.** The core demonstration.
4. **Quota on year of study.** Look at the composition table again — the year
   split is now exactly 33 / 33 / 33 and the estimate is barely better. A quota
   corrects the variable you set a quota on.
5. **Stratified random**, then **simple random**. Both centre on the line;
   stratified scatters a little less.
6. **Non-response tilt to 90%** with simple random selected.
7. **The challenge.**

## Debrief questions

1. Convenience sampling at n = 1,000 gives a narrower interval than at n = 120.
   What exactly has been bought?
2. The quota sample has perfect year composition and is still 2.6 hours out.
   Why?
3. Stratified and simple random sampling are both unbiased here. What does
   stratification buy, then?
4. Non-response turned an unbiased procedure into a biased one. What would have
   to be true of the non-responders for that not to happen?
5. Every method over-estimates in this simulation. Invent a recruitment method
   that would under-estimate.
6. You are given only the survey report. What could you look at to suspect a
   selection problem, given that you cannot see the truth?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A big sample is a good sample." | The n = 120 against n = 1,000 comparison, on convenience. |
| "Random sampling guarantees representativeness." | It guarantees unbiasedness of the procedure over repetitions. Draw a single simple random sample of 20 and see how far out it can be. |
| "The response rate tells you whether there is bias." | Non-response only biases if it is related to the thing being measured. A 30% response rate from indifferent non-responders is harmless; a 90% rate can be biased. |
| "We matched the sample to the population, so it is representative." | The quota method. Matched on year, wrong on everything else. |
| "Weighting fixes it." | Partly, and only for the variables you have. The challenge says so explicitly. |
| "A wider confidence interval is more honest." | The challenge's 99% option. A wider interval around a biased estimate is a wider interval around a biased estimate. |
| "Bias means the researcher was biased." | Nobody in this simulation has an opinion. Bias here is a property of a procedure. |

## Limitations and cautions

- **The population is generated, not observed.** Four thousand fictional
  students from a seeded generator with a stated model. No real institution,
  register or survey is involved.
- **The selection weights are invented.** How much less likely a commuter is to
  be in a library on a Tuesday is a number chosen to make the effect visible.
- **Real non-response is not one dial.** It depends on topic, mode, incentive,
  season and sender, and varies across fieldwork.
- **Bias in a mean is not the only bias.** Selection distorts variances,
  correlations and subgroup comparisons too, sometimes in opposite directions.
- **Unbiased is not accurate.** A simple random sample of 20 from this
  population is unbiased and frequently more than an hour out.

## Accessibility considerations

- Native radios, ranges, number input and buttons; every control labelled, every
  group in a fieldset with a legend.
- Both sliders announce meaningful text, e.g. "90 per cent tilt: commuters and
  students with jobs are that much more likely to decline".
- The estimate line is hidden from assistive technology; every figure it carries
  is repeated in the readout beneath it, and a full table of every draw sits
  behind a disclosure control.
- On the line, the truth is a solid rule with its value printed, previous
  estimates are hollow circles, and the current estimate is a filled diamond
  with an interval bar — **shape**, not colour, carries the distinction.
- The composition table names each group and prints both population and sample
  percentages.
- Every draw announces a full sentence, including the direction of the error in
  words ("plus" / "minus") rather than a sign character.
- Focus moves to the simulator heading on unlock; forced-colours rules provided;
  usable at 320px and at projector widths.

## Optional extension tasks

1. **Find the least-bad cheap method.** Non-response tilt at 50%, and you may
   not use the register. Which method gets closest, and why?
2. **Write the methods paragraph** for the convenience sample at n = 1,000, as
   an honest researcher would have to write it.
3. **Predict the direction.** Before drawing, say whether a method will
   over- or under-estimate, and justify it from the composition table alone.
4. **Design the recruitment** for a survey of loneliness among postgraduate
   researchers. Which groups would your method miss, and would they be lonelier
   or less lonely than average?

## The model

Also documented at the top of `tool.js`.

Population, seed `20260807`, N = 4,000:

```
year      1, 2 or 3 in equal thirds
commuter  35%
job       40%
hours     12.6 + 0.6*(year 2) + 1.4*(year 3) - 2.2*commuter - 3.0*job
          + Normal(0, 4), floored at zero
```

**The population mean is 11.29 hours** and is computed from the generated
population, not asserted. It is the same in every browser.

Recruitment is weighted sampling without replacement by the exponential-race
method (`key = -log(U)/w`, take the n smallest), which reduces exactly to simple
random sampling when all weights are equal.

| Method | Weight |
| --- | --- |
| Convenience | `0.3^commuter x 0.4^job x exp(0.10 x (hours - mean))` |
| Self-selected volunteers | `year factor (1.6 / 1.0 / 0.6) x exp(0.06 x (hours - mean))` |
| Quota on year | equal quota per year, convenience weights inside each |
| Stratified random | proportional allocation over year x commuting, weight 1 |
| Simple random | weight 1 |

Non-response multiplies every weight by
`1 - tilt x (0.5*commuter + 0.5*job)`, floored at 0.02, and applies to the
probability methods too.

### Reference values a lecturer can check

Twenty draws at n = 120, tilt 0 — running difference from the truth:

| Method | Running difference |
| --- | --- |
| Convenience | about **+2.8 hours** |
| Quota on year | about **+2.6 hours** |
| Self-selected volunteers | about **+0.8 hours** |
| Stratified random | about **0.0 hours** |
| Simple random | about **0.0 hours** |

Convenience at n = 1,000: about **+2.3 hours** — the offset survives, the
scatter does not. Simple random at n = 400 with the tilt at 90%: about
**+0.8 hours**.

Quota composition at n = 120: years 33 / 33 / 33 against a population of 33 / 33
/ 34, and commuters **11%** against a population **35%**. That contrast is the
best single screenshot in the tool.

Exact values move a little with the seed, since each press of *Recruit* advances
it; the pattern does not.

## Citation and evidence notes

- **The 1936 *Literary Digest* poll** — 2.4 million responses, wrong winner. The
  canonical demonstration that size does not buy accuracy.
- **Meng (2018), "Statistical paradises and paradoxes in big data"**, for the
  formal version: the error of a sample mean depends on a data-defect
  correlation that sample size does not touch, which is why very large
  self-selected datasets can be less trustworthy than small random ones.
- **Groves and Peytcheva (2008)** on non-response bias: the response rate is a
  poor predictor of bias, because what matters is whether non-response relates
  to the variable being measured.
- **Bethlehem (2010)** on selection bias in web surveys.
- **Kish (1965)** for the classical treatment of stratification and quota
  sampling.

References are deliberately not embedded in the page, so the tool does not
appear to derive its generated population or its weights from any of them.
