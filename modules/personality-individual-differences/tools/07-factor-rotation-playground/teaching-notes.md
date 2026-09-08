# Teaching notes - Factor Rotation Playground

`modules/personality-individual-differences/tools/07-factor-rotation-playground/`

**What it teaches.** Rotating two factor axes changes which markers
look "simple" against which axis, and changes nothing else: every
marker's communality and the total variance captured stay fixed at
every angle. Simple structure is a criterion for choosing among
equally good rotations, not a fact the rotation uncovers, and letting
the axes go oblique buys a cleaner-looking pattern only by allowing
the two factors to correlate.

**Before students start.** None needed.

**What students do.**
1. Predict whether rotating the axes changes how well the two factors
   reproduce the twelve markers.
2. Rotate the orthogonal axes freely across the clean, cross-loading
   and correlated marker sets, watching the invariants panel.
3. Search for the angle that maximises the simplicity score on the
   clean set.
4. Let the axes go oblique and watch the factor correlation move as
   the cosine of the angle between them.

**What to look for.** On the clean set, the simplicity score rises
from about 0.37 at the starting angle to about 0.91 near 136 degrees,
while total variance and every marker's communality never move at
all. On the cross-loading set, no angle makes every marker simple at
once: two markers sit between the clusters at every rotation,
orthogonal or oblique. Setting the oblique angle to 55 degrees on any
set reads a factor correlation of 0.57, exactly the cosine of 55
degrees, regardless of where the markers themselves sit.

**Debrief.** Two students each rotate the same clean set to a
different angle and get different simplicity scores. Whose rotation
is correct? What did rotating actually change, and what stayed
exactly the same underneath it?

**Common misconception / caution.** A rotation reproducing the data
equally well at every angle is not a quirk of this activity; it holds
whenever the number of factors is held fixed, which is exactly why
choosing a "better" rotation is a matter of interpretation rather than
discovery. The simplicity score used here is a stand-in built for this
activity, not varimax, oblimin or promax, and the tool says so
directly; a real rotation criterion works on the same underlying
principle but not this exact formula.

**Use in class / timing.** A pass through one marker set and the
invariants panel takes about 10 minutes. Covering all three sets with
the oblique control takes 25 to 30 minutes.
