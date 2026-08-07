# Teaching notes — Central Limit Theorem Simulator

`modules/research-methods/tools/14-central-limit-theorem-simulator/`

Press **Draw one sample** six times before doing anything else. The ticks along
the population axis are the data somebody would actually collect; the single bar
that appears below is all the lower panel ever gets from a real study. Students
who see that once stop confusing the two panels.

---

## Intended level

First- or second-year undergraduate meeting sampling distributions, and again
before any discussion of the standard error. It assumes the mean, the standard
deviation and the shape vocabulary from tool 13. It underpins tools 09, 15, 16
and 17 in this module.

## Learning objectives

After the activity a student should be able to:

1. distinguish a population, a sample and a sampling distribution;
2. describe the sample mean as a random variable with its own distribution;
3. state where the sampling distribution sits and why its spread is σ/√n;
4. explain why the data do not become more normal as n grows;
5. judge how fast convergence happens from the population's own shape rather
   than from a rule of thumb.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Write the three words — population, sample, sampling distribution — on the
board before you start and point at them each time you use one.

## The demonstration worth doing from the front

1. Take all three predictions as a vote. The **centre** question is the one
   worth arguing about: most rooms expect the skew to drag the means.
2. **Draw one sample** six times. Read the sample mean each time. Point at the
   ticks; point at the single new bar.
3. **Draw 1,000 samples**. Read the table across: predicted 4.00, observed 3.93.
4. Set n to **2**, then 10, 30, 100, drawing a thousand each time, and read the
   skewness row. 1.41, 0.63, 0.37, 0.20. Ask when "thirty is enough" became true.
5. Switch to the **bimodal** population at n = 10. The population looks nothing
   like a bell and the means already do. Convergence depends on the shape, not
   on a number.
6. Finish on the **shared/zoomed** menu, so the room sees both the narrowness
   (shared) and the shape (zoomed).

## Prediction question

*Samples of 25 from a strongly right-skewed population with mean 40 and SD 20.
The distribution of the sample means will be:* less skewed / just as skewed /
more skewed; narrower / the same / wider; centred on 40 / below 40 / above 40.

The answers are **less skewed, narrower, centred on 40**. The centre question is
the instructive one: sampling is unbiased whatever the shape, so the skew does
not drag the means anywhere.

## Activity sequence

1. **Commit to all three predictions.**
2. **Six single samples**, reading each mean aloud.
3. **A thousand samples**, then read the table row by row.
4. **Sweep n** through 2, 10, 30, 100, recording the standard error and the
   skewness each time.
5. **Change the population** and repeat at a fixed n.
6. **Switch the lower panel** between the shared and the zoomed scale.
7. **The challenge**, which is seven statements about the theorem.

## Debrief questions

1. Which of the two panels would you ever see in a real study, and how much of
   it?
2. The population is heavily skewed and the means are centred exactly on 40.
   Why does the skew not drag them?
3. Why is the standard error σ/√n and not σ/n?
4. You want to halve your standard error. What does that cost?
5. At n = 30 the predicted skewness of the mean is still 0.37. What does that do
   to the advice you have been given about sample size?
6. A methods section says "the sample was large enough for the data to be
   normally distributed". Rewrite it so that it is true.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "With a big sample the data become normal." | The upper panel never changes. Only the lower one does. |
| "n = 30 is enough for anything." | Skewness row at n = 30 for the skewed population: 0.37. |
| "The sampling distribution is the population." | Shared scale: one is five times narrower at n = 25. |
| "The standard error is the SD of my sample." | It is the SD of the sampling distribution. Point at the lower panel. |
| "Skew in the population biases the mean." | Centre row, every population, every n. |
| "Doubling n halves the standard error." | It divides it by √2. Compare n = 25 and n = 100. |
| "The theorem covers any statistic." | It is about the mean. The maximum's sampling distribution never becomes normal. |
| "The simulation proves the theorem." | It agrees with it. Both rest on the same assumptions. |

## Limitations and cautions

- **No real data.** All four populations are mathematical objects; every sample
  comes from a seeded generator.
- **Independent, identically distributed draws.** Clustered, time-ordered or
  self-selected data break the conditions, and no sample size repairs that.
- **The theorem is about the mean.** Medians, variances and maxima behave
  differently.
- **σ is known here.** Real work estimates it, which is the subject of the
  t-test tool later in this module.
- **The simulated skewness and kurtosis are biased downwards** by the ordinary
  sample formulae, so expect them to sit slightly below the predicted values
  even with a thousand means. The tool says so on screen.

## Accessibility considerations

- Native ranges, selects, a number input, radios, checkboxes and buttons; every
  control labelled, every group in a fieldset with a legend.
- The sample-size slider announces "samples of 25 observations each".
- The chart is hidden from assistive technology and paired inside its figure
  with a **visible four-row table** of predicted against simulated centre,
  spread, skewness and excess kurtosis; a disclosure holds the exact population
  properties.
- Each panel is **labelled in words inside the picture**, the two are divided by
  a rule, the population mean is a dashed labelled line, and the axis note
  states whether the panels share a scale.
- The pinned primary result measures 571px tall at 1366×768.
- Every draw and change announces a full sentence; focus moves to the simulator
  heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the n that makes the skewness of the mean fall below 0.2** for the
   right-skewed population, and say what that implies about the rule of thumb.
2. **Predict the standard error first.** Before each draw, write down σ/√n and
   then check it against the observed spread.
3. **Rank the four populations** by how quickly their sample means become
   normal, and explain the ranking from the population's own skewness and
   kurtosis rather than from its picture.
4. **Break the theorem.** Describe a sampling scheme in which the draws are not
   independent, and say what would go wrong with the lower panel.

## The model

```
populations (exact moments):
  normal    Normal(50, 12)                     skew 0     ex. kurtosis  0
  skewed    20 + Exponential(mean 20)          skew 2     ex. kurtosis  6
  uniform   Uniform(20, 80)                    skew 0     ex. kurtosis -1.2
  bimodal   1/2 Normal(30, 6) + 1/2 Normal(70, 6)
                                               skew 0     ex. kurtosis -1.683

for the mean of n independent draws:
  centre          = mu
  standard error  = sigma / sqrt(n)
  skewness        = population skewness / sqrt(n)
  excess kurtosis = population excess kurtosis / n
```

The bimodal figures come from its central moments: variance 20² + 6² = 436,
fourth central moment 20⁴ + 6·20²·6² + 3·6⁴ = 250 288, so the excess kurtosis is
250 288/436² − 3 = −1.683.

Randomness is seeded with `mulberry32`, Box–Muller normals and inverse-CDF
exponentials.

### Reference values a lecturer can check

Right-skewed population, **seed 7311, 1,000 samples at each n**:

| n | SE predicted | SE observed | Skew predicted | Skew observed |
| --- | --- | --- | --- | --- |
| 2 | 14.14 | 13.65 | 1.41 | 1.15 |
| 10 | 6.32 | 6.23 | 0.63 | 0.67 |
| 25 | 4.00 | 3.93 | 0.40 | 0.32 |
| 30 | 3.65 | 3.58 | 0.37 | 0.45 |
| 100 | 2.00 | 2.02 | 0.20 | 0.14 |

At **n = 10**, one thousand samples from each population:

| Population | SE predicted | SE observed |
| --- | --- | --- |
| Normal | 3.79 | 3.62 |
| Uniform | 5.48 | 5.43 |
| Bimodal | 6.60 | 6.78 |

The first single sample at the defaults (skewed population, n = 25, seed 7311)
has a mean of **44.29** against a population mean of 40.0 — a useful reminder
that one study's mean is one draw from the lower panel.

## Citation and evidence notes

- **Rice (2007)**, *Mathematical Statistics and Data Analysis*, for the exact
  moment relations used in the predicted column.
- **Chance, delMas and Garfield (2004)** on students' persistent conflation of
  the population, the sample and the sampling distribution — the reason this
  tool draws all three in one picture.
- **Wilcox (2012)** for the argument that the classic n = 30 rule of thumb
  fails badly for heavy-tailed and skewed distributions.
- **Micceri (1989)** on how rarely real psychological variables are normal in
  the first place.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated populations from any of them.
