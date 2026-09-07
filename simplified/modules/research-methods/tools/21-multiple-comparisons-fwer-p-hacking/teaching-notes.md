# Teaching notes - Multiple Comparisons, FWER and Forking Paths (Simplified)

`simplified/modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/`

**What it teaches.** Trying several different, individually
reasonable analytic choices on the same dataset can turn up a
significant result by chance alone, even when the true effect is
exactly zero.

**Before students start.** The dataset here was built with no real
effect anywhere in it. Mention this before anyone starts choosing an
analysis.

**What students do.**
1. Choose an outcome, an exclusion rule, a subgroup and whether to
   adjust for a baseline score.
2. Run the analysis and add the resulting p-value to a visible trail.
3. After a few tries, reveal every one of the 72 possible paths at
   once.

**What to look for.** Seven of the seventy-two possible paths through
this null dataset reach p below .05, including one as small as 0.008,
despite there being no true effect anywhere in the data.

**Debrief.** If you had only ever run the one path you happened to try
first, would you know how many other paths existed?

**Common misconception / caution.** This is a demonstration of harm,
not a technique to copy; nothing in it is a defensible way to analyse
real data, since the underlying dataset has no true effect in it at
all.

**Use in class / timing.** Trying a few analytic paths takes about 5
to 7 minutes.
