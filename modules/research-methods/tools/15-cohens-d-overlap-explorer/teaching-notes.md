# Teaching notes - Cohen's d and Distributional Overlap

`modules/research-methods/tools/15-cohens-d-overlap-explorer/`

**What it teaches.** Cohen's d is a ratio, the gap between two means
divided by their pooled standard deviation, set entirely by the two
population parameters and unaffected by sample size. A "large" d of
0.8 still leaves 69% of the two distributions overlapping, so a
benchmark label undersells how much two groups overlap and says
nothing about any individual.

**Before students start.** These are population values set directly by
the learner, not estimates from noisy data. A real sample's d carries
its own uncertainty that this tool does not model.

**What students do.**
1. Estimate what percentage of two distributions with d = 0.8 actually
   overlap.
2. Try the three named benchmark buttons, small, medium and large, and
   read the overlap percentage for each.
3. Drag one group's standard deviation while holding both means fixed,
   and watch overlap and d move together.
4. Drag the sample-size slider and watch a t-value and p-value appear,
   while d itself does not move.
5. Sort the closing challenge, matching five sentences to the right
   statistic, including one that matches none of them.

**What to look for.** d stays at exactly 0.8 as the sample-size slider
moves from 10 to 400; only the t-value and p-value change, since those
depend on how much evidence there is for the same population gap, not
on the size of the gap itself.

**Debrief.** Two studies report the same eight-point difference and
different d values; what differed between them? d did not move when
the sample size went from 10 to 400; what did?

**Common misconception / caution.** "A large effect means the groups
barely overlap" is refuted directly by the large-benchmark preset
itself, which still leaves 69% overlap. These are exact population
values the learner sets, not estimates from real data; a genuine
sample d carries its own uncertainty and is biased upward in small
samples.

**Use in class / timing.** Running through the three benchmarks takes
about 10 minutes. With the sample-size slider, the matching challenge
and debrief, a full session takes about 40 minutes.
