# Teaching notes - ANOVA F-Ratio Visualiser

`modules/research-methods/tools/10-anova-f-ratio-visualiser/`

**What it teaches.** F is the ratio of between-groups to within-groups
variance. Under equal population means it hovers near 1, and
separating the means, shrinking the within-group spread, or adding
participants can each raise it on its own. A significant F only says
the data sit awkwardly with "all group means equal," not which groups
differ or by how much.

**Before students start.** A big F is not a big effect. Make that
clear before running the trivial-gap, larger-sample preset.

**What students do.**
1. Predict what happens to F if the same mean gap is set against
   double the within-group spread.
2. Draw a fresh sample and manipulate the group-mean separation, the
   within-group spread and the sample size.
3. Try named presets, including a trivial 1.5-point gap at a larger
   sample size.
4. In Experiment 2, inspect three very different-looking mean patterns
   before finding out they share the same F.
5. Sort the closing challenge on what an omnibus F licenses.

**What to look for.** The trivial-gap, larger-sample preset still
returns a significant F, showing that significance tracks sample size
as well as the size of any real difference. The three Experiment 2
patterns look nothing alike yet share exactly the same F, because they
were built to hold the sum of squares between groups fixed.

**Debrief.** Three identical populations were sampled and F came out
near 1, not 0; why? Patterns A, B and C look nothing alike and give
the same F. What information did the statistic discard? A colleague
says ANOVA is just three t-tests done properly. What is right and what
is wrong about that?

**Common misconception / caution.** "A big F means a big effect" is
the one to correct: the trivial-gap, larger-sample preset returns a
significant, sizeable F for a genuinely tiny difference. A
non-significant F is not evidence of no difference, only of not
enough evidence against equal means in this sample.

**Use in class / timing.** Ten minutes covers Experiment 1 as a
demonstration. With Experiment 2, the challenge and debrief, a full
session takes about 40 minutes.
