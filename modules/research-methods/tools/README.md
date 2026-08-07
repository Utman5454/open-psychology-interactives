# modules/research-methods/tools/

<!-- PUBLISHED:START -->
| Tool | Folder | Topic |
| --- | --- | --- |
| Research Question to Method Mapper | [`01-research-question-method-mapper/`](01-research-question-method-mapper/) | Reading a research question: what claim it makes, what design could support it, and what you still need to know |
| Operationalisation Laboratory | [`02-operationalisation-laboratory/`](02-operationalisation-laboratory/) | Operationalisation: what a measure reaches, what it misses, and what it quietly records instead |
| Confound Detective | [`03-confound-detective/`](03-confound-detective/) | Confounds, nuisance variables and design repair: why more data cannot fix bias |
| Sampling Bias Simulator | [`04-sampling-bias-simulator/`](04-sampling-bias-simulator/) | Sampling bias against sampling variability: why a bigger sample cannot fix the wrong people |
| Thematic Analysis Coding Laboratory | [`05-thematic-analysis-coding-lab/`](05-thematic-analysis-coding-lab/) | Coding as an analytic act: three defensible readings of the same six extracts, and no answer key |
| Theme or Topic? | [`06-theme-or-topic-challenge/`](06-theme-or-topic-challenge/) | Topic summary, staging post, developed theme, or a claim the data cannot carry |
| Reflexivity and Alternative Theme Builder | [`07-reflexivity-alternative-theme-builder/`](07-reflexivity-alternative-theme-builder/) | Reflexivity: how the question and the lens decide which themes are available, and where several defensible readings stop |
| Sampling Distribution and p-Value Simulator | [`08-sampling-distribution-pvalue-simulator/`](08-sampling-distribution-pvalue-simulator/) | What a null world looks like: the sampling distribution, the tail area, and everything a p-value is not |
| Confidence Interval Laboratory | [`09-confidence-interval-laboratory/`](09-confidence-interval-laboratory/) | Coverage is a property of the procedure: count the misses, then separate precision from importance |
| ANOVA F-Ratio Visualiser | [`10-anova-f-ratio-visualiser/`](10-anova-f-ratio-visualiser/) | F is a fraction: move the signal, move the noise, and meet three patterns of means that share one F |
| Factorial ANOVA Interaction Detective | [`11-factorial-anova-interaction-detective/`](11-factorial-anova-interaction-detective/) | An interaction is a difference of differences - and a plot will not tell you the scale or the uncertainty |
| ANCOVA / MANOVA Decision Laboratory | [`12-ancova-manova-decision-lab/`](12-ancova-manova-decision-lab/) | What a covariate is for, when adjustment misleads, and why MANOVA is not several ANOVAs at once |
| The Normal Curve and z-Scores | [`13-normal-curve-z-scores/`](13-normal-curve-z-scores/) | Two numbers make the whole curve, and a raw score means nothing without them |
| Central Limit Theorem Simulator | [`14-central-limit-theorem-simulator/`](14-central-limit-theorem-simulator/) | The population, one sample and the sampling distribution, kept visibly apart |
| Cohen's d and Distributional Overlap | [`15-cohens-d-overlap-explorer/`](15-cohens-d-overlap-explorer/) | A conventionally large effect still leaves two thirds of the two distributions overlapping |
| Independent-Samples t-Test: The Null Distribution | [`16-independent-t-test-null-lab/`](16-independent-t-test-null-lab/) | One number on one curve: where t comes from, and why p moves with n when d does not |
| Statistical Power and Type M Error | [`17-statistical-power-type-m-lab/`](17-statistical-power-type-m-lab/) | Power as four areas, the sample size a study would need, and why significant small studies exaggerate |
| Correlation: Linearity, Outliers and Shared Variance | [`18-correlation-outlier-nonlinearity-lab/`](18-correlation-outlier-nonlinearity-lab/) | r measures straightness, not relatedness: curves, single points and a change of units |
| Regression: Intercept, Slope and Least Squares | [`19-regression-slope-intercept-lab/`](19-regression-slope-intercept-lab/) | Try to beat the least-squares line, then find out what the intercept is a prediction for |
| Homoscedasticity and Residual Diagnostics | [`20-homoscedasticity-residual-diagnostics/`](20-homoscedasticity-residual-diagnostics/) | The residual plot is the instrument: what non-constant variance does to the standard error, and what it leaves alone |
| Multiple Comparisons, FWER and Forking Paths | [`21-multiple-comparisons-fwer-p-hacking/`](21-multiple-comparisons-fwer-p-hacking/) | Why flexibility inflates false positives without anyone cheating, and what a correction costs |

<!-- PUBLISHED:END -->

Tools for the **Research Methods** module live here, one folder per tool.

Twenty-one tools are published; they are listed above. The module page at
`modules/research-methods/index.html` describes the scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/research-methods/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record (see CLAUDE.md metadata standard)
└── teaching-notes.md   educator guidance (see CLAUDE.md teaching-notes standard)
```

Tool-specific CSS and JavaScript live in the same folder — `tool.css` and
`tool.js` are the usual names. Self-contained means the folder can be copied
out of this repository and still work, provided `assets/css/main.css` and the
two `components/` files travel with it. Nothing is fetched from a CDN and
nothing is bundled.

A tool page sits four levels below the repository root, so shared assets are
referenced as `../../../../assets/css/main.css`.

## Adding one

1. Read [`../../../CONTRIBUTING.md`](../../../CONTRIBUTING.md) for the full
   checklist.
2. Read [`../../../docs/adapting-a-tool.md`](../../../docs/adapting-a-tool.md)
   for the interactive-shell markup contract and a working skeleton.
3. Create the folder and build the page against the shell.
4. Write `metadata.json` and `teaching-notes.md`.
5. Add the same record to the `research-methods` module's `tools` array in
   [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Extra requirements for statistical tools

- Distinguish the sample, the population, the model, the estimate and the
  uncertainty around it — in the interface, not only in the notes.
- Where randomisation matters, support a visible or documented seed so a
  demonstration can be reproduced in front of a class.
- Label simulated data as simulated. Never present generated numbers as norms,
  published effect sizes or validated cut-offs.
- Comment the educational model and any deliberate simplification in the source,
  and state the simplification on the page where a student could be misled.
- State what the tool does *not* demonstrate as explicitly as what it does.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md) for the
accessibility requirements every tool must meet, including the text or tabular
alternative that must accompany every chart.

## Planned topics

Sampling distributions · confidence intervals · p-values and significance
testing · correlation and regression · statistical power.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
