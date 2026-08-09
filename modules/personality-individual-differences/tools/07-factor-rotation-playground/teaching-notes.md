# Teaching notes — Factor Rotation Playground

`modules/personality-individual-differences/tools/07-factor-rotation-playground/`

Every loading changes. Not one point moves.

---

## Running it from the front

Rotate slowly with the loading table on screen and the invariants box beneath it. Loadings pour through every value they can take; total variance explained does not move in the second decimal place. That contrast is the tool.

Then switch to the third marker set, where the clusters sit about 55° apart. No orthogonal rotation can put an axis through both. Dropping the axis angle to about 55° does it — and the factor correlation jumps to around 0.57, which is the price.

## Intended level

Second- or third-year undergraduate meeting factor analysis, or postgraduates
who use it and have never seen rotation happen. It assumes the idea of a
loading and nothing else.

## Learning objectives

After the activity a student should be able to:

1. state precisely what rotation changes and what it leaves invariant;
2. explain why rotation neither manufactures results nor finds the true
   solution;
3. distinguish orthogonal from oblique solutions and treat the choice as
   substantive;
4. recognise a genuine cross-loading as information;
5. defend simple structure as an adopted criterion.

## Estimated duration

- **Demonstration from the front:** 6 minutes, and it is one of the most
  efficient demonstrations in this module.
- **Students in pairs:** 20 minutes.
- **With all three marker sets and the debrief:** 30 minutes.

## Preparation

None. With a class, ask the prediction question aloud and take a show of
hands before unlocking the playground; the page no longer says so, so the
show of hands is yours to take.

## The prediction question

> A researcher extracts two factors, then rotates them. **What does rotation
> do to how well the model fits the data?**

Most students say it improves fit — otherwise why do it? The answer is that
fit is completely unchanged, which is simultaneously the reassuring thing
about rotation and the unsettling one.

## The demonstration worth doing from the front

Put the loading table and the invariants box on screen together, and drag the
rotation slider slowly.

- The loadings pour through every value they can take.
- The total variance explained does not move in the second decimal place.
- The largest change in any communality is reported, and it is zero to three
  decimal places.

Say out loud while dragging: *the data have not changed, the fit has not
changed, and every number in this table is different.*

## Activity sequence

1. **Predict** what rotation does to fit.
2. **Rotate** the clean structure by hand. Find the point where the loadings
   look tidiest, then press "find the simplest structure" and compare.
3. **The invariants box.** What has not changed.
4. **The tentative labels.** Rotate again and watch the labels change. Ask
   whether the factors changed, or the names for them.
5. **The cross-loading set.** One pair of markers between the clusters. No
   rotation makes them simple.
6. **The correlated set.** Clusters about 55° apart. Try to fit them
   orthogonally — it cannot be done. Drop the axis angle to about 55° and
   watch the factor correlation climb to around 0.57.
7. **The challenge.**

## Debrief questions

1. Every loading changed and the fit did not. How is that possible?
2. If the mathematics does not prefer one rotation, why do analyses report a
   rotated solution at all?
3. You rotated and the labels changed. Did the constructs change?
4. In the third set, the orthogonal solution looks poor and the oblique one
   looks good. What claim about the world are you making by choosing the
   oblique one?
5. The cross-loading markers cannot be made simple. What are the options, and
   what does each cost? *(Keep and report honestly; delete and quietly change
   what the factors mean; add items until it resolves.)*
6. Does any of this show that factor analysis is subjective? Which parts are
   determined by the data and which by the analyst?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Rotation improves fit." | The invariants box, live. |
| "Rotation is cheating — you spin until you like the answer." | Fit is invariant, so nothing is being gained illegitimately. The choice is between equally good descriptions, not between better and worse models. |
| "The rotated solution is the real structure." | The mathematics does not privilege it. Simple structure is a criterion adopted for interpretability and comparability. |
| "Oblique rotation is a fudge for when orthogonal doesn't work." | It is a different substantive assumption. Forcing 90° asserts uncorrelated constructs, which for personality is usually the less plausible claim. |
| "The cross-loading item is a bad item." | Sometimes. Sometimes it is a variable that genuinely belongs to both factors, and deleting it changes what the factors mean. |
| "So the number of factors is arbitrary too." | Different question, and a more consequential one. It is decided before rotation and this tool holds it fixed at two. |

## Limitations and cautions

- **These are not data.** Twelve fictional markers with coordinates chosen to
  make three situations legible. No correlation matrix was factored.
- **Two dimensions is the special case** — the one that can be drawn. Real
  solutions have more factors, where simple structure is much harder to reach.
- **Nothing here decides how many factors to keep**, which is the prior and
  larger question.
- **The rotation is manual.** Real analyses use analytic criteria (varimax,
  oblimin, promax). The "find the simplest structure" button is a coarse sweep
  over angles, not any of those.
- **Oblique loadings are simplified**: a real oblique solution distinguishes
  pattern from structure coefficients, and this tool shows one set of numbers
  plus the factor correlation.

## Accessibility considerations

- Rotation is driven by a **slider**, not by dragging the axes, so WCAG 2.5.7
  is satisfied by construction rather than by providing an alternative.
- The plot is hidden from assistive technology and paired with a table
  carrying every loading, communality and salience decision. Markers are
  labelled by name directly on the plot; the axes are distinguished by dash
  pattern as well as colour and labelled F1 and F2.
- The oblique slider announces "axes 55 degrees apart, oblique solution,
  factors correlate 0.57" rather than a bare number.
- The invariants box states in words what has not changed, so the central
  point does not depend on comparing two tables visually.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Name them badly.** Rotate to a solution where the factor labels are
   uninformative, and write down what a paper reporting that solution would
   claim.
2. **The deletion decision.** In the cross-loading set, decide whether to keep
   or drop the two intermediate markers, and write two sentences justifying it
   for a methods section.
3. **Argue for orthogonality.** Find a construct pair where forcing
   uncorrelated factors is genuinely defensible, and say why.
4. **Beyond two.** Explain to somebody why simple structure gets harder with
   five factors, using what you saw here.

## The model

Also documented at the top of `tool.js`.

Each marker has fixed coordinates. Orthogonal rotation by θ:

```
loading₁ =  x·cos θ + y·sin θ
loading₂ = −x·sin θ + y·cos θ
```

Oblique solutions let the second axis move independently; loadings are then
projections onto two non-perpendicular directions, and the implied factor
correlation is the cosine of the angle between them.

**Simple structure** is scored as the mean over markers of
`2 × (max(a², b²)/(a² + b²) − 0.5)`, which is 1 when every marker loads on one
factor only and 0 when every marker splits evenly. Salience threshold is 0.40.

All three sets are stored pre-rotated by a constant 45°, so that the 0°
starting view is *not* already simple — which is what an unrotated extraction
actually looks like, with a first factor running between the clusters and
everything loading on it. The same rotation is applied to every marker, so all
the designed geometry is preserved exactly; only the starting orientation
changes. Without it, "find the simplest structure" would return 0° and the
central activity would have nothing to do.

For the clean set the best orthogonal rotation is about **136°**, taking
simple structure from **0.37 to 0.91**.

### The three marker sets

| Set | What it shows |
| --- | --- |
| A clean two-cluster structure | Simple structure is reachable; everyone finds the same rotation |
| One item that will not settle | A genuine cross-loading that no rotation resolves |
| Clusters that are not at right angles | About 55° apart; orthogonal rotation cannot fit both, oblique can, factors then correlate around 0.57 |

## Citation and evidence notes

- **Thurstone (1947)** introduced simple structure and the criteria for it;
  the argument that it is a chosen criterion rather than a discovery is his,
  not a modern revisionist gloss.
- **Kaiser (1958)** on varimax, for the analytic version of what the slider
  does by hand.
- **Fabrigar, Wegener, MacCallum and Strahan (1999)** on decisions in
  exploratory factor analysis, including the orthogonal/oblique choice.
- **Preacher and MacCallum (2003)**, *Repairing Tom Swift's electric factor
  analysis machine*, on what goes wrong when the decisions are made by
  default.
- **Costello and Osborne (2005)** for practical guidance on cross-loadings and
  item retention.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its coordinates from any of them.
