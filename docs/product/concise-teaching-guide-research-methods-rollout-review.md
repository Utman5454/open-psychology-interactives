# Concise teaching-guide rollout: Research Methods

Date: 2026-09-07. Status: **rollout batch complete; pre-merge correction
pass applied on independent review, still awaiting merge**.
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
| Research Question to Method Mapper | 1,869 | 309 | 83% |
| Operationalisation Laboratory | 1,813 | 302 | 83% |
| Confound Detective | 1,807 | 356 | 80% |
| Sampling Bias Simulator | 1,835 | 356 | 81% |
| Thematic Analysis Coding Laboratory | 1,809 | 315 | 83% |
| Theme or Topic? | 1,691 | 303 | 82% |
| Reflexivity and Alternative Theme Builder | 1,866 | 327 | 82% |
| Confidence Interval Laboratory | 2,126 | 348 | 84% |
| ANOVA F-Ratio Visualiser | 2,041 | 354 | 83% |
| Factorial ANOVA Interaction Detective | 1,726 | 364 | 79% |
| ANCOVA / MANOVA Decision Laboratory | 2,043 | 427 | 79% |
| The Normal Curve and z-Scores | 1,689 | 384 | 77% |
| Central Limit Theorem Simulator | 1,767 | 358 | 80% |
| Cohen's d and Distributional Overlap | 1,641 | 344 | 79% |
| Independent-Samples t-Test: The Null Distribution | 1,609 | 404 | 75% |
| Statistical Power and Type M Error | 1,826 | 440 | 76% |
| Correlation: Linearity, Outliers and Shared Variance | 1,568 | 366 | 77% |
| Regression: Intercept, Slope and Least Squares | 1,526 | 363 | 76% |
| Homoscedasticity and Residual Diagnostics | 2,054 | 374 | 82% |
| Multiple Comparisons, FWER and Forking Paths | 1,982 | 446 | 78% |
| **Full total (20 files)** | **36,288** | **7,240** | **80%** |

### Simplified edition (21)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Research Question to Method Mapper | 644 | 190 | 70% |
| Operationalisation Laboratory | 1,147 | 195 | 83% |
| Confound Detective | 659 | 202 | 69% |
| Sampling Bias Simulator | 636 | 189 | 70% |
| Thematic Analysis Coding Laboratory | 621 | 174 | 72% |
| Theme or Topic? | 570 | 162 | 72% |
| Reflexivity and Alternative Theme Builder | 607 | 191 | 69% |
| Sampling Distribution and p-Value Simulator | 603 | 227 | 62% |
| Confidence Interval Laboratory | 639 | 188 | 71% |
| ANOVA F-Ratio Visualiser | 1,011 | 190 | 81% |
| Factorial ANOVA Interaction Detective | 1,096 | 207 | 81% |
| ANCOVA / MANOVA Decision Laboratory | 1,102 | 230 | 79% |
| The Normal Curve and z-Scores | 1,037 | 209 | 80% |
| Central Limit Theorem Simulator | 1,044 | 195 | 81% |
| Cohen's d and Distributional Overlap | 1,031 | 210 | 80% |
| Independent-Samples t-Test: The Null Distribution | 1,065 | 213 | 80% |
| Statistical Power and Type M Error | 1,086 | 230 | 79% |
| Correlation: Linearity, Outliers and Shared Variance | 991 | 268 | 73% |
| Regression: Intercept, Slope and Least Squares | 1,015 | 194 | 81% |
| Homoscedasticity and Residual Diagnostics | 1,361 | 235 | 83% |
| Multiple Comparisons, FWER and Forking Paths | 1,102 | 225 | 80% |
| **Simplified total (21 files)** | **19,067** | **4,324** | **77%** |

**Grand total (41 files): 55,355 to 11,564 words, a 79% reduction.**
New guides range from 162 to 446 words. Two Full guides sit close to
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

This audit's original pass found no instance of the specific
never-versus-nonzero failure pattern described above, but it did **not**
catch a subtler internal contradiction: `04-sampling-bias-simulator`
(Full) opened by saying a probability sample "stays unbiased only as
long as everyone selected actually responds," which directly
contradicts the same guide's own later, correct point that low
response rate does not by itself imply bias. This claim is false as a
general statement (a probability sample's *selection* step is
unbiased regardless of response rate; it is specifically
outcome-related nonresponse, not incompleteness itself, that can
reintroduce bias), and it was missed on first read because the two
sentences sit in different sections of a short guide. An independent
review, done specifically to re-check this batch before merge, caught
it. So this section can no longer say no contradiction was found: one
was found and fixed, after the batch was first submitted, and the fix
is recorded in "Pre-merge correction pass" below.

## Content discrepancies discovered

None required a code fix in this branch; all are documentation-only
observations, flagged here rather than silently fixed, and classified
per the brief.

- **Live learner-facing defect, `21-multiple-comparisons-fwer-p-hacking`
  (Full), `tool.js`. RESOLVED.** The on-screen "Family-wise rate,
  predicted" figure was computed from the full test count `k`, not `k`
  minus the number of real effects, so whenever real effects were
  present and no correction was applied, the displayed "predicted" rate
  visibly disagreed with the displayed simulated rate (64.2% shown
  against roughly 53% simulated, an 11-point gap that undermined the
  tool's own predicted-versus-simulated pedagogy). The old teaching
  notes' reference table compounded this by using the statistically
  correct formula for one row and the code's flawed figure for the very
  next row. The new guide did not cite the tool's "predicted" figure for
  this case at all, reporting only the independently verified simulated
  rates. This is how the defect was first found and logged, deliberately
  as a documentation-only observation rather than a silent code edit, in
  the original submission of this branch.

  It was fixed by a separate, tightly scoped follow-up
  (`fix-multiple-comparisons-fwer-prediction`), immediately after this
  branch merged, as flagged above: the predicted family-wise rate and
  expected false-positive count now use `m0 = k - real`, the count of
  true-null tests, since a test with a genuine effect can only be a
  correct detection or a miss, never a false positive (`FWER = 1 - (1 -
  threshold)^m0`, zero when `m0` is zero). The Bonferroni threshold
  itself is unaffected: it is still defined across the full family of
  `k` hypotheses. A regression test
  (`scripts/test-multiple-comparisons-fwer.js`, run via
  `scripts/check-all.py`) locks in the corrected figures and fails
  against the old `k`-based formula.
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
judged necessary at that time.

A second, independent review before merge found a family this pass had
missed: **"is the misconception to correct[, directly]"**, **"is the
one to correct[, directly]"**, and **"worth [catching / heading off /
correcting] here too"** / **"needs correcting here too"**, closing 19
"Common misconception / caution" sections across the batch (5 of 20
Full guides, 14 of 21 Simplified guides). Confirmed by grep across all
41 files before any edit, and again after: 19 instances, then zero.
Each was rewritten into ordinary direct prose specific to its own
guide rather than into one new shared template; see "Pre-merge
correction pass" below for how that diversity was checked.

## Pre-merge correction pass

Before merge, independent review re-read all 41 final guides against
their tools' actual behaviour and against each other, and found eight
issues, six of them statistical or methodological overclaims that this
rollout's own internal-consistency and cross-source audits had missed
the first time. All eight are now fixed on this branch; none required
a code change.

1. **`04-sampling-bias-simulator` (Full), internal contradiction.**
   Covered above under "Internal-consistency audit": the opening claim
   that a probability sample "stays unbiased only as long as everyone
   selected actually responds" contradicted the guide's own later
   point. "What it teaches" now says probability sampling protects the
   selection step, that nonresponse related to the outcome can still
   reintroduce bias, and that incomplete response on its own does not
   automatically make an estimate biased.
2. **`18-correlation-outlier-nonlinearity-lab` (Full and Simplified),
   x-versus-y overclaim.** Both guides implied a point's pull on r
   depends on how unusual its x-value is and not its y-value, which is
   too absolute; the Simplified activity's own challenge (x fixed at
   96, y moved between a bottom-right and top-right position) changes
   the effect on r substantially, disproving the flat version of the
   claim. Both guides now separate leverage (how unusual the
   x-position is) from actual influence on the fit, which depends on
   leverage together with where the point falls relative to the
   existing pattern; a point unusual only in y, near the centre of x,
   is now described as having little leverage rather than none.
3. **`13-normal-curve-z-scores` (Full), "exact" wording.** Both
   occurrences of calling the 68/95/99.7 figures "exact" properties of
   the normal model were changed to "familiar," since they are rounded
   proportions from an exact underlying model, not exact figures
   themselves.
4. **`15-cohens-d-overlap-explorer` (Full), "two population
   parameters."** "Set entirely by the two population parameters" was
   ambiguous given that the activity lets the learner vary the second
   mean and both groups' spreads, not two primitive numbers; reworded
   to "the mean gap between two groups expressed relative to their
   pooled standard deviation." "Biased upward in small samples" was
   tightened to "biased away from zero in small samples," which is
   what small-sample d bias actually is (magnitude, not direction).
5. **`20-homoscedasticity-residual-diagnostics` (Full), unscoped
   unbiased-slope claim.** "Heteroscedasticity leaves the slope
   unbiased" read as an unrestricted general law; it is only true
   under this activity's own correctly specified linear model with
   mean-zero errors. "What it teaches" and the caution now say so
   explicitly.
6. **`03-confound-detective` (Full and Simplified), sample-size
   overreach.** The activity implements "recruit more participants" as
   a repair that leaves its fixed biased estimate unchanged, but the
   guides generalised this into more sample size "cannot move the
   estimate," which is not true in general. Both now state the actual
   lesson, that a bigger sample improves precision but does not remove
   systematic bias, while keeping the concrete detail that this
   activity's sample-size repair leaves the displayed estimate at
   17.0.
7. **Cross-file AI-tell family, 19 instances.** Covered above under
   "Cross-file AI-tell patterns found and rewritten."
8. **`21-multiple-comparisons-fwer-p-hacking` (Full), live defect.**
   Re-confirmed, not re-fixed, on this teaching-notes branch: the FWER
   defect already logged under "Content discrepancies discovered" is
   real, is learner-facing, and stayed out of scope here on purpose. It
   was fixed immediately afterwards by the separate, tightly scoped
   follow-up branch `fix-multiple-comparisons-fwer-prediction`; see the
   updated entry under "Content discrepancies discovered" above for what
   changed.

Corrections 1 to 6 changed nine Full-guide word counts and two
Simplified-guide word counts (`03-confound-detective` and
`18-correlation-outlier-nonlinearity-lab` gained words under both
editions from the extra precision items 2 and 6 required; the other
seven Full guides and thirteen further Simplified guides changed only
through the phrase-family rewrite in item 7). The word-count tables
above already reflect the corrected figures; the grand total moved
from 11,477 to 11,564 words, a change of 87 words, still a 79%
reduction from the original 55,355.

## What this rollout does not do

No Cognitive, Neuropsychology, Social and Critical Psychology, or
Personality and Individual Differences file was touched. No
`metadata.json` schema changed. No activity code changed; the
discrepancies above are reported, not fixed. This document does not
authorise scaling to the next module; that decision follows review of
this batch.
