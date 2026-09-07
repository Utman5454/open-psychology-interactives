# Teaching notes - Confidence Interval Laboratory

`modules/research-methods/tools/09-confidence-interval-laboratory/`

**What it teaches.** A 95% confidence interval describes how often the
procedure catches the true value across repeated samples, not a
probability that this one interval contains it. Sample size and
population spread change interval width but not coverage; only the
confidence level itself trades width for coverage.

**Before students start.** The true mean here is known only because
the tool built the population that way. Nobody would know it in a real
study.

**What students do.**
1. Predict what one interval that excludes zero can and cannot tell
   you.
2. Draw one study at a time, then run 100, and watch how many
   intervals catch the true mean.
3. Change sample size and population spread and see width change
   while coverage does not.
4. Change the confidence level itself and see both width and coverage
   move together.
5. In Experiment 2, drag a meaningful-difference threshold across four
   fixed trials and reclassify each one as it crosses.
6. Sort the closing challenge on one fixed interval.

**What to look for.** At the default settings, close to 95 of 100
intervals catch the true mean. Changing sample size or population
spread changes how wide the intervals are without changing that hit
rate, while changing the confidence level changes both together.

**Debrief.** Complete honestly: "95% of the time, this procedure...".
You have one interval and no record of repeated studies behind it.
What can you say about whether it contains the truth?

**Common misconception / caution.** "There's a 95% chance the true
value is in this interval" is the claim to correct every time: once a
sample is drawn, the limits are fixed numbers, and the true value
either is or is not between them, with no probability left to attach.
The simulation treats the population spread as known, which a real
study never does, and a real analysis would use a wider,
heavier-tailed reference distribution instead.

**Use in class / timing.** A single-study demonstration runs about 10
minutes. With Experiment 2 and the challenge, a full session takes
about 40 minutes.
