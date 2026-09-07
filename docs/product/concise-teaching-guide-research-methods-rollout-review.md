# Concise teaching-guide rollout: Research Methods

Date: 2026-09-07. Status: **rollout batch complete, awaiting review**.
Second module-sized pass, after Cognitive Psychology
(`docs/product/concise-teaching-guide-cognitive-rollout-review.md`,
merged to `main` at `6623815`). It rewrites every remaining Research
Methods teaching guide, Full and Simplified, into the approved
seven-section format. No other module was touched.

## Files changed

41 `teaching-notes.md` files, all under `modules/research-methods/tools/`
or `simplified/modules/research-methods/tools/`.

**Full edition (20 of 21; `08-sampling-distribution-pvalue-simulator`
already approved in the five-guide pilot and left untouched):**
`01-research-question-method-mapper`, `02-operationalisation-laboratory`,
`03-confound-detective`, `04-sampling-bias-simulator`,
`05-thematic-analysis-coding-lab`, `06-theme-or-topic-challenge`,
`07-reflexivity-alternative-theme-builder`,
`09-confidence-interval-laboratory`, `10-anova-f-ratio-visualiser`,
`11-factorial-anova-interaction-detective`,
`12-ancova-manova-decision-lab`, `13-normal-curve-z-scores`,
`14-central-limit-theorem-simulator`, `15-cohens-d-overlap-explorer`,
`16-independent-t-test-null-lab`, `17-statistical-power-type-m-lab`,
`18-correlation-outlier-nonlinearity-lab`,
`19-regression-slope-intercept-lab`,
`20-homoscedasticity-residual-diagnostics`,
`21-multiple-comparisons-fwer-p-hacking`.

**Simplified edition (all 21, including
`08-sampling-distribution-pvalue-simulator`'s Simplified twin, which had
not yet been rewritten):** the same 20 slugs as the Full list above,
plus `08-sampling-distribution-pvalue-simulator`.

`git diff origin/main -- modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/teaching-notes.md`
is empty, confirming the approved Full p-value simulator guide was not
touched.

## Word counts

### Full edition (20 rewritten; `08` excluded, unchanged)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Research Question to Method Mapper | 1,869 | 307 | 84% |
| Operationalisation Laboratory | 1,813 | 302 | 83% |
| Confound Detective | 1,807 | 354 | 80% |
| Sampling Bias Simulator | 1,835 | 340 | 81% |
| Thematic Analysis Coding Laboratory | 1,809 | 316 | 83% |
| Theme or Topic? | 1,691 | 303 | 82% |
| Reflexivity and Alternative Theme Builder | 1,866 | 327 | 82% |
| Confidence Interval Laboratory | 2,126 | 348 | 84% |
| ANOVA F-Ratio Visualiser | 2,041 | 354 | 83% |
| Factorial ANOVA Interaction Detective | 1,726 | 364 | 79% |
| ANCOVA / MANOVA Decision Laboratory | 2,043 | 427 | 79% |
| The Normal Curve and z-Scores | 1,689 | 384 | 77% |
| Central Limit Theorem Simulator | 1,767 | 362 | 80% |
| Cohen's d and Distributional Overlap | 1,641 | 350 | 79% |
| Independent-Samples t-Test: The Null Distribution | 1,609 | 404 | 75% |
| Statistical Power and Type M Error | 1,826 | 440 | 76% |
| Correlation: Linearity, Outliers and Shared Variance | 1,568 | 339 | 78% |
| Regression: Intercept, Slope and Least Squares | 1,526 | 363 | 76% |
| Homoscedasticity and Residual Diagnostics | 2,054 | 352 | 83% |
| Multiple Comparisons, FWER and Forking Paths | 1,982 | 446 | 78% |
| **Full total (20 files)** | **36,288** | **7,182** | **80%** |

### Simplified edition (21)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Research Question to Method Mapper | 644 | 193 | 70% |
| Operationalisation Laboratory | 1,147 | 197 | 83% |
| Confound Detective | 659 | 203 | 69% |
| Sampling Bias Simulator | 636 | 189 | 70% |
| Thematic Analysis Coding Laboratory | 621 | 174 | 72% |
| Theme or Topic? | 570 | 164 | 71% |
| Reflexivity and Alternative Theme Builder | 607 | 193 | 68% |
| Sampling Distribution and p-Value Simulator | 603 | 229 | 62% |
| Confidence Interval Laboratory | 639 | 187 | 71% |
| ANOVA F-Ratio Visualiser | 1,011 | 192 | 81% |
| Factorial ANOVA Interaction Detective | 1,096 | 207 | 81% |
| ANCOVA / MANOVA Decision Laboratory | 1,102 | 225 | 80% |
| The Normal Curve and z-Scores | 1,037 | 209 | 80% |
| Central Limit Theorem Simulator | 1,044 | 198 | 81% |
| Cohen's d and Distributional Overlap | 1,031 | 211 | 80% |
| Independent-Samples t-Test: The Null Distribution | 1,065 | 213 | 80% |
| Statistical Power and Type M Error | 1,086 | 227 | 79% |
| Correlation: Linearity, Outliers and Shared Variance | 991 | 228 | 77% |
| Regression: Intercept, Slope and Least Squares | 1,015 | 194 | 81% |
| Homoscedasticity and Residual Diagnostics | 1,361 | 237 | 83% |
| Multiple Comparisons, FWER and Forking Paths | 1,102 | 225 | 80% |
| **Simplified total (21 files)** | **19,067** | **4,295** | **77%** |

**Grand total (41 files): 55,355 to 11,477 words, a 79% reduction.**
New guides range from 164 to 446 words. Two Full guides sit close to
the 450-word check-in point: `21-multiple-comparisons-fwer-p-hacking`
(446) and `17-statistical-power-type-m-lab` (440). Both were inspected
for detail that belonged elsewhere before being left at that length:
both genuinely run two distinct experiments with different logic
(a family-of-tests simulation plus a separate forking-paths
demonstration; a power calculator plus a separate Type M/S
simulation), and the extra length reflects two "What students do"
sequences worth naming rather than padding. Nothing in either was
moved out to metadata or trimmed further without losing one of the two
experiments.

## Statistical and methodological detail deliberately retained

A sample across the batch: the exact asymmetry between a benefit and a
cost in Confound Detective's repair sequence (17.0 to 8.5 to 4.5 to
3.0, contrasted with a sample-size repair that only narrows the
interval around 17.0); the distinction throughout Confidence Interval
Laboratory between coverage (a property of the procedure) and the
probability statement a single interval cannot support; ANOVA
F-Ratio Visualiser's trivial-gap-large-sample preset, kept specifically
because it is the one demonstration that a significant F is not a
large one; ANCOVA / MANOVA Decision Laboratory's insistence that an
adjusted estimate under intact groups be read as an association, not a
causal effect, kept as the guide's central caution; Cohen's d and
Independent-Samples t-Test both keeping d fixed while t and p move
with sample size, the clearest available illustration that effect
size and significance answer different questions; Statistical Power
and Type M Error's unbiased-on-average-but-inflated-once-filtered
distinction, with the actual seeded-simulation ratios (about 2.76 fold
at low power, 1.17 fold at high power); and Multiple Comparisons' care
in keeping "every test behaves correctly on its own" and "the family
still has a much higher error rate" as two facts that do not
contradict each other.

Every Simplified guide keeps its own twin's core statistical point
while dropping only the controls, presets, disclosures or challenges
that the Simplified activity genuinely does not have, confirmed
activity by activity against each Simplified `index.html` and
`tool.js`/`activity.js`, not assumed from the Full guide.

## Internal-consistency audit

Every one of the 41 drafts was read a second time as an argument,
specifically checking: numbers in "What to look for" against numbers
used in the caution and debrief; absolute words (never, always, none,
everyone, nobody, proves, rules out, cannot, guarantees) against any
numeric example nearby; claims in "What it teaches" against
limitations stated later; language describing simulated data against
any wording that could imply real participants; sample-size statements
against the activity's actual trial or case counts; and claims about
what a control or manipulation establishes against what the activity
genuinely varies.

Every absolute word found (`never`, `always`, `cannot`, `nobody`,
`everyone`, `guarantees`, and similar) was checked against its
immediate context. All of them turned out to be definitionally or
structurally true statements about how the tool is built (for example,
"the plotted curve is always the theoretical null distribution" in the
t-test guide is true because the code never draws anything else,
regardless of what the learner sets the means to; "the raw data panel
never changes shape" in the CLT guide is true because that panel is a
static rendering of the fixed population), not overgeneralisations
contradicted by a nearby number. No instance was found of the specific
failure pattern the Cognitive batch caught (an activity described as
never producing some outcome while the same guide reports it happening
a nonzero fraction of the time). Two tools whose badges or metadata
label them "simulated" (`15-cohens-d-overlap-explorer` and
`16-independent-t-test-null-lab`) are in fact exact, deterministic
calculations from learner-set parameters with no randomness anywhere
in the code; both new guides describe them as calculations the learner
sets directly, not as simulations, and never use the word "simulated"
for either.

## Content discrepancies discovered

None required a code fix in this branch; all are documentation-only
observations, flagged here rather than silently fixed, and classified
per the brief.

- **Live learner-facing defect, `21-multiple-comparisons-fwer-p-hacking`
  (Full), `tool.js`.** The on-screen "Family-wise rate, predicted"
  figure is computed from the full test count `k`, not `k` minus the
  number of real effects, so whenever real effects are present and no
  correction is applied, the displayed "predicted" rate visibly
  disagrees with the displayed simulated rate (64.2% shown against
  roughly 53% simulated, an 11-point gap that undermines the tool's
  own predicted-versus-simulated pedagogy). The old teaching notes'
  reference table compounds this by using the statistically correct
  formula for one row and the code's flawed figure for the very next
  row. The new guide does not cite the tool's "predicted" figure for
  this case at all, reporting only the independently verified
  simulated rates.
- **Stale teaching-note claim (numeric error), `03-confound-detective`
  (Full).** The old notes gave Study 2's unrepaired estimate as "2.4
  days"; the executing code computes and displays 2.5 (0.3 + 1.4 + 0.5
  + 0.25 = 2.45, rounded by the tool's own display function). The new
  guide uses 2.5.
- **Stale teaching-note claim, `06-theme-or-topic-challenge` (Full).**
  The old notes claimed the "staging" candidate, the one most often
  mislabelled as a theme, sits "in third place" in each cluster. It is
  second in two of the three clusters and third in only one. The new
  guide says its position varies across clusters instead of naming a
  slot.
- **Stale teaching-note claim,
  `09-confidence-interval-laboratory` (Simplified).** The old notes
  instructed "Run 1000 studies" as a single action; the interface only
  has "Run one study" and "Run 100 studies" buttons. Studies do
  accumulate across repeated clicks, so the outcome is reachable, but
  not in one click. The new guide describes running studies repeatedly
  onto the same pile rather than naming a single-click total.
- **Numeric error, `11-factorial-anova-interaction-detective`
  (Simplified).** The old notes stated that cell means 70, 50, 62 and
  44 give an interaction of 4; the activity's own formula gives 2. The
  new guide does not repeat this specific worked example.
- **Metadata inconsistency, `11-factorial-anova-interaction-detective`
  (Simplified).** Both `metadata.json` and the old teaching notes
  describe the cell-mean controls as "labelled number inputs"; the
  live page implements them as range sliders.
- **Harmless simplification, `10-anova-f-ratio-visualiser` (Full),**
  `index.html`. A static placeholder value in the markup for one
  slider's readout does not match that slider's actual starting value;
  JavaScript overwrites it on load, so no real user ever sees the
  mismatch.
- **Stale teaching-note claim, `18-correlation-outlier-nonlinearity-lab`
  (Full).** The old notes gave r = 0.00 for the large dataset with its
  marked point removed; the code computes r of about −0.01. The new
  guide does not cite this specific borderline figure.
- **Metadata inconsistency and stale source-code comment,
  `20-homoscedasticity-residual-diagnostics` (Simplified).** A code
  comment and `metadata.json` both assert specific "predicted"
  standard-error ratios (1.000, 1.046, 1.259) that do not match what
  the code actually computes (approximately 0.97, 1.00, and 1.19 to
  1.21). The page's own live, on-screen figure is computed correctly;
  only the stale comment and metadata text are wrong. The new guide
  does not cite the specific stale ratios.
- **Metadata inconsistency, `21-multiple-comparisons-fwer-p-hacking`
  (Full).** `metadata.json`'s `estimatedMinutes` is 20; the page's own
  hero text says "About 30 minutes," matching the old notes' 30-minute
  tier and the convention followed by the other tools in this
  cluster.
- **Metadata inconsistency, `17-statistical-power-type-m-lab`.** A
  learning objective names "Type S errors," but the term "Type S"
  never appears on the page; the concept (a significant result
  pointing the wrong way) is taught throughout using plain language
  ("wrong way," "wrong sign") rather than that label.
- **Labelling inconsistency (cross-cutting), `15-cohens-d-overlap-explorer`
  and `16-independent-t-test-null-lab`.** Both carry a page badge and
  `dataStatus: "simulated"` in metadata, but neither tool contains any
  randomness; both are exact calculations from parameters the learner
  sets directly. Addressed in the new guides by describing both as
  calculations, never as simulations.

## Cross-file AI-tell patterns found and rewritten

A first pass drafted each guide for accuracy against its own research.
A second, side-by-side read across all 41 found that two of the exact
patterns the Cognitive batch had already caught and fixed once had
reappeared in this batch's first drafts, evidently because the same
default phrasing gets reached for when drafting quickly:

- **"Say that..." opened 28 of the 41 first-draft "Before students
  start" sections** (19 of 20 Full guides, 9 of 21 Simplified guides).
  Rewritten so most sections state the fact directly with no framing
  verb at all ("The upper, population panel never changes shape..."),
  with the remainder using a varied verb ("Flag this...", "Make that
  clear...", "Mention this...", "Raise this...") chosen so no two
  guides share a construction.
- **"[X] alone makes/make a N-minute demonstration" opened most of the
  20 Full guides' "Use in class / timing" sections**, including three
  that were verbatim identical except for context ("Experiment 1 alone
  makes a 15-minute demonstration" in `12-ancova-manova-decision-lab`,
  `17-statistical-power-type-m-lab` and
  `21-multiple-comparisons-fwer-p-hacking`). Rewritten into distinct
  constructions per guide while keeping the actual minute figures
  unchanged, for example "Fifteen minutes covers Experiment 1 on its
  own," "Experiment 1 on its own takes about 15 minutes to show," and
  "Experiment 1 by itself takes about 15 minutes."
- **"The whole activity runs in about X to Y minutes" opened 19 of the
  21 Simplified guides' timing sections**, the identical tell the
  Cognitive rollout's review already documents fixing once. Rewritten
  into gerund-led constructions naming the actual action taken, for
  example "Toggling through the four measures takes about 5 to 7
  minutes" and "Building up a pile of studies takes about 6 to 7
  minutes."
- **"None needed. The tool opens [on / straight on / straight into /
  with]..." repeated across six Simplified "Before students start"
  openers.** Diversified with different verbs and phrasing ("Nothing to
  prepare. The plot already shows...", "None needed. The simulation is
  already running...").
- **One instance each of "what matters is"**
  (`04-sampling-bias-simulator`, Full) **and an "X is the overreach Y
  is built to catch" template** (`07-reflexivity-alternative-theme-builder`,
  Full), both families the Cognitive rollout's review had already
  flagged once, survived the first draft. Rewritten to "the deciding
  question is..." and "does not survive the accountability check,"
  respectively.
- **Not a tell:** `06-theme-or-topic-challenge` uses the word
  "overreach" three times as the literal name of one of the activity's
  four candidate categories (topic, staging, theme, overreach), which
  is the tool's own terminology, not rhetorical filler, and was left
  as is.

Zero em dashes were found across all 41 final guides. After the fixes
above, all 41 guides were re-read against "does this sound like an
experienced psychology lecturer quickly briefing another lecturer,
while remaining statistically careful?" No further rewriting was
judged necessary.

## What this rollout does not do

No Cognitive, Neuropsychology, Social and Critical Psychology, or
Personality and Individual Differences file was touched. No
`metadata.json` schema changed. No activity code changed; the
discrepancies above are reported, not fixed. This document does not
authorise scaling to the next module; that decision follows review of
this batch.
