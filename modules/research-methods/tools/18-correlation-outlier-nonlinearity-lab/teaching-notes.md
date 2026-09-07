# Teaching notes - Correlation: Linearity, Outliers and Shared Variance

`modules/research-methods/tools/18-correlation-outlier-nonlinearity-lab/`

**What it teaches.** Pearson's r measures how well a straight line
fits, not whether a relationship exists or how strong it is in
general. A perfect curved relationship can give an r close to zero,
and in a small sample a single point's pull on r depends on its
leverage, how unusual its x-value is, together with where it falls
relative to the rest of the pattern; a point unusual only in y, near
the centre of x, has little leverage at all.

**Before students start.** r only ever measures linear fit. Make this
clear before showing the curved dataset.

**What students do.**
1. Predict what r will be for a clean U-shaped relationship.
2. Look through six datasets and their scatterplots.
3. Drag a marked point toward a corner in a small and a large dataset,
   and watch r move.
4. Remove the marked point and compare r with and without it.
5. Change the units y is measured in and watch the slope change while
   r does not.
6. Try the eyeball-test challenge, estimating r from a scatterplot.

**What to look for.** In the twelve-point dataset, dragging one point
toward the corner takes r from close to zero up to about 0.75. The
same drag in the hundred-and-twenty-point dataset barely moves r at
all, since one point among many has far less leverage.

**Debrief.** The curve shows a near-perfect relationship, and r comes
out close to zero; why? One point took r from near zero to about 0.75
in the small dataset. What made it so influential, its x-value or its
y-value?

**Common misconception / caution.** "r of 0.5 means half the variance
is explained" confuses r with r squared: it is r squared that gives
the proportion of shared variance, so r of 0.5 explains about a
quarter. Correlation does not establish causation, and nothing in this
activity, which only ever generates or reshapes points on a
scatterplot, could.

**Use in class / timing.** Looking through the six datasets takes
about 10 minutes on its own. With the point-dragging exercises, the
eyeball challenge and debrief, a full session takes about 35 minutes.
