# Teaching notes - Sampling Bias Simulator

`modules/research-methods/tools/04-sampling-bias-simulator/`

**What it teaches.** Sampling variability, scatter that shrinks as n
grows, and selection bias, a systematic offset that does not, are
different problems needing different remedies. Probability sampling
protects the selection step, but nonresponse related to the outcome
can still reintroduce bias; incomplete response on its own does not
automatically make an estimate biased. A quota only ever corrects the
one variable it targets.

**Before students start.** This is a generated population of fictional
students, not real survey data. The true average is known only because
the tool built the population that way.

**What students do.**
1. Predict what 900 self-selected social-media responses would buy.
2. Choose a recruitment method, a sample size and a non-response tilt.
3. Recruit one sample, then recruit twenty more, watching where the
   estimates land relative to the true mean.
4. Compare convenience and quota sampling against stratified and
   simple random sampling at the same sample size.
5. Sort the closing challenge on which fixes reduce bias and which
   only reduce scatter.

**What to look for.** Convenience and self-selected sampling drift off
the true mean by roughly two to three hours even over twenty draws,
while stratified and simple random sampling centre close to zero
drift. Quota sampling on year of study gets the year composition
exactly right and still drifts, since it does nothing about who
volunteers within each year.

**Debrief.** A convenience sample at n = 1,000 gives a narrower
interval than one at n = 120. What exactly has been bought? The quota
sample has perfect year composition and is still off by a couple of
hours; why?

**Common misconception / caution.** "Random sampling guarantees
representativeness" overstates what the procedure buys: it guarantees
an unbiased procedure over repetitions, not that any one draw lands
close. A high response rate does not by itself rule out bias, and a
low one does not guarantee it; the deciding question is whether
non-response is related to the thing being measured.

**Use in class / timing.** Showing one method takes about 8 minutes.
Comparing methods with the challenge and debrief takes about 35
minutes.
