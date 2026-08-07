# Teaching notes — Positive Manifold Visualiser

`modules/personality-individual-differences/tools/32-positive-manifold-visualiser/`

The first factor appears whatever you put underneath it. That is the lesson.

---

## Running it from the front

Load Strong general factor, look at the loading chart, then load Broad group factors and look again. Both produce a first factor with every task loading positively. The structures underneath are quite different, and the loading chart alone does not distinguish them — which is the argument of the tool.

The first factor here is genuinely computed: the tool runs the power method on the matrix on screen and reports the leading eigenvector scaled by the square root of its eigenvalue.

## Intended level

Second- or third-year undergraduate on an intelligence, individual differences
or psychometrics strand. It assumes correlation and the idea of a factor
loading. It follows naturally from the Factor Rotation Playground in this
module, which handles what rotation does; this one handles what extraction
does and does not establish.

## Learning objectives

After the activity a student should be able to:

1. state the positive manifold as an empirical pattern rather than a theory;
2. explain why an all-positive matrix yields a first factor with positive
   loadings, arithmetically;
3. recognise that a general factor and broad group factors produce similar
   first-factor loadings;
4. distinguish shared, group, specific and error variance, and say which can
   contribute to a correlation;
5. name rival explanations of the manifold and what would distinguish them.

## Estimated duration

- **Demonstration from the front:** 8 minutes — the two-preset comparison is
  the whole argument.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. Read the "what a factor is here" panel aloud; it sets the terms and
saves a long detour later.

## The demonstration worth doing from the front

Load **Strong general factor**. Look at the loading chart: six tasks, all
loading between about 0.7 and 0.8.

Load **Broad group factors**. Look again: six tasks, all loading positively,
in a similar range.

The structures underneath are entirely different — uniform sharing in the
first, two clusters in the second — and the loading chart does not tell them
apart. The correlation matrix does, if you look at the block pattern, which is
why the matrix is on screen next to it.

Say while switching: *a researcher who extracted one factor and stopped would
report a general ability in both cases, and would be wrong in one of them.*

## Activity sequence

1. **Commit to an answer** about what the positive manifold establishes.
2. **Strong general factor.** Uniform matrix, dominant first factor.
3. **Broad group factors.** Block structure in the matrix, similar loadings.
4. **Weak task relations.** Manifold near zero, first factor explains little.
5. **The error slider.** Push it up from any configuration. Every correlation
   shrinks and the tasks have not changed — error contributes to no
   correlation at all.
6. **The variance bar.** Watch task-specific variance take up whatever the
   other three leave.
7. **The challenge.**

## Debrief questions

1. Both presets give positive loadings on everything. What in the output
   *does* distinguish them?
2. Why does raising measurement error shrink every correlation without
   changing what the tasks measure?
3. If a first factor always appears when correlations are positive, what work
   is the factor analysis doing?
4. Name two explanations of the positive manifold other than a single general
   ability. What evidence would separate them?
5. The tool calls the factor "illustrative". What would you have to add to
   call it anything more?
6. Suppose someone reports that a general factor explains 45% of the variance.
   What have they told you about the tasks they used?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A general factor proves general intelligence exists." | The two-preset comparison. Same loadings, different structures. |
| "The positive manifold is just how tests are built." | It appears with tasks chosen to be maximally different and across a century of samples. It is a finding, not an artefact. |
| "So factor analysis is useless." | Overcorrection. It describes the matrix accurately and efficiently. It just does not identify causes, and was never able to. |
| "The tasks with the highest loadings are the most 'g-loaded', so they measure intelligence best." | Circular unless you have an independent account of what g is. Load the group preset and see which tasks come out highest. |
| "Error variance lowers the correlations, so it inflates g." | The opposite: error shrinks every correlation and *reduces* the proportion the first factor explains. Push the slider and watch. |
| "Two groups is the real structure." | It is the structure *you set*. The point is that the output does not reveal it. |

## Limitations and cautions

- **The factor is not a thing.** It is the leading eigenvector of a matrix
  generated by three sliders. The tool takes no position on whether anything
  corresponding exists.
- **No real data.** Six fictional tasks; no test, subtest, item, norm or
  published matrix is reproduced.
- **Two group factors is a simplification.** Real hierarchical models have
  several broad abilities, and how many is contested.
- **Principal components, not common-factor analysis.** Chosen because it can
  be computed transparently and shown working; a common-factor model would
  partition variance differently.
- **One undifferentiated population.** Nothing here bears on differences
  between groups of people.

## Accessibility considerations

- Native ranges and buttons; no dragging.
- Sliders announce meaningful text ("55% shared by every task").
- **Every matrix cell prints its own number**, so the shading is redundant;
  same-group pairs also carry a border, so the block structure does not depend
  on tint.
- The variance bar prints each segment's name and percentage inside it.
- The first-factor chart follows the matrix directly, because it is the point
  of the tool. The three scatterplots illustrate the matrix rather than adding
  to it, so they sit behind a disclosure control and open on request.
- Scatterplots and the loading chart are hidden from assistive technology and
  paired with visible tables. The loading table has a **Group** column, so
  cluster membership is never carried by bar colour alone.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Break the manifold.** Find settings where at least one correlation is
   essentially zero. What happens to the first factor's variance explained?
2. **Two matrices, one report.** Write the sentence a paper would use for each
   preset if it reported only the first factor. Then write the sentence that
   would distinguish them.
3. **Design the discriminating study.** You suspect group factors rather than a
   general one. What analysis, and what additional data, would settle it?
4. **The sampling account.** Read up on the sampling and mutualism
   explanations of the manifold and say what each predicts that a single-factor
   account does not.

## The model

Also documented at the top of `tool.js`.

```
z(i) = g·G + s(i)·Group(i) + u(i)·Specific(i) + e(i)·Error(i)
r(i,j) = g² + s²·[same group]
```

All four sources are independent standard normal and the coefficients are
scaled so each task has unit variance. Specific variance takes whatever the
three sliders leave, which is why it is displayed rather than controlled.
Neither specific variance nor error contributes to any correlation.

The first factor is computed by the power method on the matrix on screen:
loadings are the leading eigenvector scaled by the square root of its
eigenvalue, and the proportion explained is the eigenvalue divided by the
number of tasks.

### The three presets

| Preset | Shared | Group | Error | What it shows |
| --- | --- | --- | --- | --- |
| Strong general factor | 0.55 | 0.10 | 0.15 | Near-uniform matrix, dominant first factor |
| Broad group factors | 0.12 | 0.55 | 0.15 | Block structure, first factor still positive throughout |
| Weak task relations | 0.08 | 0.10 | 0.65 | Correlations near zero, first factor explains little |

The six tasks are three verbal-ish (word meanings, verbal analogies, stored
knowledge) and three spatial-ish (pattern completion, mental rotation, paper
folding). The names are generic descriptions, chosen so that no published
subtest is identifiable.

## Citation and evidence notes

- **Spearman (1904)** for the original observation and the two-factor theory.
- **Carroll (1993)** for the three-stratum synthesis, and the reason group
  factors belong in any serious model.
- **Thomson (1916)** on the sampling account — the earliest demonstration that
  a positive manifold does not require a single general capacity.
- **van der Maas et al. (2006)** on mutualism: a dynamical model in which
  abilities reinforce one another during development and produce the manifold
  without any general factor.
- **Bartholomew, Deary and Lawn (2009)** on what Spearman's model does and does
  not entail.
- **Jensen (1998)** for the strongest statement of the general-factor position,
  worth reading alongside the alternatives rather than instead of them.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its matrices from any of them.
