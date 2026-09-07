# Teaching notes - Central Limit Theorem Simulator

`modules/research-methods/tools/14-central-limit-theorem-simulator/`

**What it teaches.** The sample mean is itself a random variable with
its own sampling distribution, and that distribution, not the raw
data, is what becomes more normal and narrower as n grows, at a rate
set by the population's own skew and kurtosis rather than by a fixed
rule of thumb like n = 30.

**Before students start.** The upper, population panel never changes
shape; only the lower panel, the distribution of means, does. That is
the point most often missed.

**What students do.**
1. Predict what will happen to the shape, width and centre of the
   distribution of means as sample size grows.
2. Draw one sample repeatedly, then draw a thousand, and watch the
   pile of means build up.
3. Change the sample size and reread the predicted versus simulated
   standard error.
4. Switch to a different shaped population and repeat.
5. Sort the closing challenge on seven statements about the theorem.

**What to look for.** Even from a strongly skewed population, the
predicted skewness of the mean at n = 30 is still about 0.37, not
zero, so "normal by 30" understates how slowly skewness fades. The
means always centre on the population mean regardless of how skewed
the population itself is.

**Debrief.** Which of the two panels would you ever see in a real
study, and how much of it? The population is heavily skewed and the
means centre exactly on its true mean; why does the skew not drag them
off centre? At n = 30 the predicted skewness of the mean is still
0.37; what does that do to the sample-size advice you have been given?

**Common misconception / caution.** A big sample does not make the
data become normal: the raw data panel never changes shape at all,
only the distribution of means does. The
simulation does not prove the theorem, it agrees with it, and both
rest on the same assumption of independent, identically distributed
draws.

**Use in class / timing.** Ten minutes covers one population as a
demonstration. Comparing populations with the challenge and debrief
takes about 40 minutes.
