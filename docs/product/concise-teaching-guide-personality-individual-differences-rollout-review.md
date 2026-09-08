# Review: concise teaching-guide rollout, Personality & Individual Differences

Branch: `personality-individual-differences-teaching-guide-rollout`. This is
the fifth and final module-sized rollout in the concise teaching-guide
series, following Cognitive, Research Methods, Neuropsychology and Social &
Critical Psychology. It follows the same seven-section format and the same
source-of-truth workflow as those four, with two changes specific to this
module: research ran as eighteen separate agents, one per tool pair, and
drafting proceeded in three bounded batches with a reread after each rather
than in one pass.

## Files changed

Exactly 35 `teaching-notes.md` files: 17 Full editions and 18 Simplified
editions, across the 18 published tool pairs in
`modules/personality-individual-differences/tools/README.md`:

03 Person-Situation Interaction Theatre, 04 State versus Trait Tracker,
07 Factor Rotation Playground, 09 Facet-Level Detective, 12 The Alpha Trap
(Simplified twin only, see below), 13 Reverse-Item Disaster, 14
Response-Style Simulator, 21 Measurement-Invariance Translator, 24 "Explain
This Person" Courtroom, 31 Intelligence-Test Battery Builder, 32 Positive
Manifold Visualiser, 34 Culture-Fair Test Challenge, 36 Speed-Accuracy
Trade-Off, 39 Twin-Study Simulator, 42 Gene × Environment Interaction
Visualiser, 49 Emotional-Intelligence Claims Laboratory, 50 Self-Esteem
Stability Tracker, 55 Personality Disorder Continuum.

`modules/personality-individual-differences/tools/12-alpha-trap/teaching-notes.md`
(the approved pilot) was read in full and used as the epistemic standard for
this rewrite, but was **not modified**. Confirmed byte-identical to
`origin/main`:

```
$ git diff origin/main -- modules/personality-individual-differences/tools/12-alpha-trap/teaching-notes.md
(no output)
```

No activity code, `tool.js`/`activity.js`, `metadata.json`, catalogue data,
`standalone.html`, or any other module's teaching notes were touched in this
branch.

## Word counts

These figures are post-correction, after both the independent-review
pass and the final collection-level cleanup pass described below. See
those sections for what changed and why several guides grew.

| Tool | Full old | Full new | Simplified old | Simplified new |
|---|---:|---:|---:|---:|
| 03 Person-Situation Interaction Theatre | 1700 | 426 | 707 | 338 |
| 04 State versus Trait Tracker | 1908 | 460 | 963 | 337 |
| 07 Factor Rotation Playground | 1594 | 408 | 1029 | 347 |
| 09 Facet-Level Detective | 1971 | 389 | 949 | 333 |
| 12 The Alpha Trap | 378 | 378 (frozen) | 1027 | 384 |
| 13 Reverse-Item Disaster | 1718 | 392 | 1157 | 339 |
| 14 Response-Style Simulator | 1510 | 391 | 1059 | 334 |
| 21 Measurement-Invariance Translator | 1703 | 400 | 1008 | 349 |
| 24 "Explain This Person" Courtroom | 1482 | 421 | 878 | 341 |
| 31 Intelligence-Test Battery Builder | 1769 | 376 | 1090 | 327 |
| 32 Positive Manifold Visualiser | 1524 | 390 | 1199 | 332 |
| 34 Culture-Fair Test Challenge | 1726 | 432 | 961 | 316 |
| 36 Speed-Accuracy Trade-Off | 1672 | 436 | 919 | 360 |
| 39 Twin-Study Simulator | 1797 | 453 | 926 | 283 |
| 42 Gene × Environment Interaction Visualiser | 1372 | 395 | 969 | 284 |
| 49 Emotional-Intelligence Claims Laboratory | 2039 | 419 | 930 | 378 |
| 50 Self-Esteem Stability Tracker | 1609 | 414 | 969 | 336 |
| 55 Personality Disorder Continuum | 1968 | 379 | 1081 | 356 |

Full total: 29,440 → 7,360 words (17 rewritten Full guides plus the frozen
378-word pilot both included in the "new" figure above).
Simplified total: 17,821 → 6,074 words.
Aggregate: 47,261 → 13,434 words, a **71.6% reduction**.

New word-count range: 283 (Simplified, tool 39) to 460 (Full, tool 04).
Two guides sit just above 450: Full 04 (460 words) and Full 39 (453
words). Both grew directly from the independent-review corrections
below (04's stability-curve and measurement-error fixes; 39's E/error
and gene-environment-correlation fixes) and were trimmed as far as
seemed possible without dropping the corrected content; the review
judged that acceptable rather than cutting a substantive fix to hit
the target.

## Source-of-truth method

Eighteen background research agents ran in parallel, one per tool pair,
each independently:

- reading the learner-facing `index.html` and the executing
  `tool.js`/`activity.js` for both editions, not just the existing
  `teaching-notes.md`;
- re-implementing the tool's own formulas in Node.js and re-running them
  against the tool's own default parameters, rather than trusting inline
  code comments or the existing notes;
- checking every quoted number, threshold, formula constant and ranking
  claim against that independent recomputation;
- checking the specific accuracy-trap list relevant to that tool's topic
  (rotation invariance, the reliability/alpha standard set by the approved
  Alpha Trap pilot, the configural/metric/scalar hierarchy, heritability as
  a population statistic, and so on);
- classifying every discrepancy found as a live learner-facing defect, a
  stale teaching-note claim, a stale source-code comment, a metadata
  inconsistency, or a harmless simplification.

Guides were drafted directly from these verified reports in three batches
(A: 03/04/07/09/12/13, B: 14/21/24/31/32/34, C: 36/39/42/49/50/55), each
batch committed separately after a local accuracy and internal-consistency
reread, per the task's explicit instruction not to draft all 35 files in one
uninterrupted pass. Where a report's numbers seemed surprising on first
read, they were re-derived a second time by hand or by a fresh Node script
before being used in a guide (this happened for tool 07's rotation angles,
tool 14's response-style formula constants, tool 24's distinctiveness
ranking, tool 36's response times, and tool 39's resample range, see
"First-pass conclusions corrected on reread" below).

## Numerical checks performed

Every quoted figure in all 35 new guides was independently verified against
the executing code rather than copied from the previous notes, including:
correlations and factor loadings (07, 32), Cronbach's alpha values (12
Simplified, 13), item-total correlations (13), response-style formula
constants and gap sizes (14), configural/metric/scalar parameter changes and
tolerances (21), distinctiveness scores (24), battery-builder scenario
thresholds and the guided example's minutes/burden/composite reliability
(31), positive-manifold preset loadings and variance proportions (32),
construct-relevant shares and demand levels (34), drift-diffusion accuracy
and response-time figures (36), twin correlations and Falconer heritability
estimates under three assumption violations (39), gene-environment
crossover and range-restriction outcomes (42), the correlation matrix and
incremental-validity percentages in the EI laboratory (49), domain-
contingent event sizes and recovery-day counts (50), and population shares
above a moving threshold under two counting rules (55).

## Psychometric distinctions deliberately preserved

One representative example per topic area, drawn from what the guides
actually say:

- **Traits vs. states vs. measurement error** (03, 04): a strong situation
  compresses behaviour without moving anyone's trait score; day-to-day
  wobble and measurement error are kept on separate sliders because raising
  one changes what a single reading might mean and raising the other
  changes how much a person truly moves.
- **Bandwidth-fidelity** (09): a domain score is a weighted average that
  cannot distinguish two people who reach it from opposite facet
  combinations; facets predict specific behaviour better at the cost of
  fewer items and lower reliability.
- **Rotation invariance and simple structure as criterion, not discovery**
  (07): communality and total variance are described as fixed at every
  angle, and the guide avoids asserting a "natural" separation angle for
  the correlated marker set (see live defect C below).
- **Reliability ≠ validity, alpha ≠ unidimensionality** (12 Simplified):
  alpha rising while validity falls and content coverage narrows is stated
  as two separate failures, not one.
- **Reverse-keying as a trade, not a free fix** (13): a correctly
  reverse-scored item is described as not thereby equivalent to a
  positively-worded item, with the comprehension/method-factor cost stated
  explicitly.
- **Response styles as pattern, not motive** (14): the guide states that a
  response pattern is evidence about a pattern, not a motive, and gives an
  alternative innocent explanation for the same grid.
- **Measurement-invariance hierarchy** (21): configural/metric/scalar are
  each given the specific comparison they license, and losing scalar
  invariance is described as removing mean comparisons specifically, not
  as "the scale is broken."
- **Underdetermination vs. ignorance** (24): the guide distinguishes fitting
  a case after the fact from making a distinctive, testable prediction, and
  explicitly rejects "so we can never explain anything" as an
  overcorrection.
- **Validity as a property of use** (31): the same battery is described as
  scoring well under one purpose's weighting and failing another's,
  without any task changing.
- **Statistical factor vs. causal/biological claim** (32): a single
  extracted factor is described as compatible with one dominant general
  source and with a structure dominated by two independent group sources
  plus a smaller shared source, and the caution rejects both "proves
  general ability exists" and "factor analysis is useless."
- **Construct-relevant vs. irrelevant demand, and bias as evidence-based**
  (34): bias is defined as established by evidence of differential
  function, not by inspecting what a test looks like; removing one demand
  is shown to raise another rather than eliminating the problem.
- **Ability/threshold/time/accuracy kept separate** (36): the guide states
  explicitly that neither accuracy nor response time alone separates
  ability from caution.
- **Heritability as a population statistic under specific assumptions, with
  a specific bias direction per broken assumption** (39): each of the three
  violations is described with which correlation it moves and which
  direction the resulting estimate is biased, rather than a general "twin
  studies are flawed" claim.
- **Interaction vs. range restriction, kept distinct from gene-environment
  correlation** (42): the guide states plainly that neither slope nor
  crossover moves when the sampled range is restricted, and separately
  notes that environment is sampled independently of group in this model.
- **Convergent/discriminant/incremental validity kept separate** (49): a
  measure's correlation with an outcome is treated as insufficient on its
  own; overlap with an existing measure and independent predictive
  contribution are presented as two different questions.
- **Level, volatility, domain contingency and recovery as separable** (50):
  the guide states that an identical average says nothing about any of the
  other three, and uses a single delivered event to isolate contingency
  from recovery.
- **Dimensional variation vs. categorical threshold** (55): the guide
  states that a population share swinging with a moved threshold does not
  mean the underlying difficulty is imaginary or that the categories are
  worthless.

## Live learner-facing defects found (queued for a separate follow-up branch)

None of these were fixed in this branch, per instruction. Each guide was
written to avoid repeating the defect's overclaim while still describing
what a learner actually sees.

1. **Tool 24 (Courtroom), Full, accessibility defect.** The screen-reader
   table equivalent for the competition diagram renders only 14 of the 25
   non-"partly" pairs (`pairs.slice(0, 14)` in `tool.js`), dropping 8 of 14
   genuinely competing pairs that the sighted SVG diagram does show. A
   matching stale code comment ("Table equivalent: every pair") and a
   `metadata.json` accessibility overclaim ("every pair's relationship in
   words") compound this.
2. **Tool 09 (Facet-Level Detective), Full.** The Agreeableness case's two
   profiles (83/51 and 52/80) do not actually average to the same domain
   score (67 vs. 66), despite the UI's unconditional "Equal by
   construction" framing, and `buildVerdict()` only computes and displays
   one shared score as if both profiles land on it.
3. **Tool 07 (Factor Rotation Playground), Full.** The "correlated" marker
   set's own note string in `tool.js`, its `index.html` debrief prose, and
   its `standalone.html` export all assert the two personality clusters sit
   "about 55 degrees apart" with a correlation that "climbs to 0.57" as if
   this were the natural or best-fitting alignment for the coded
   coordinates. Independently sweeping the tool's own simplicity function
   finds the actual best fit near 36–38 degrees, correlation ≈0.79–0.81.
   The trig identity itself (`cos(55°) = 0.57`) is correct; the claim that
   55 degrees is where the data naturally sit is not.
4. **Tool 39 (Twin-Study Simulator), Full.** The live "What the violations
   are doing" panel (`tool.js` line 536) and the challenge feedback (line
   717) both state that the unequal-environments violation "raises the MZ
   correlation without touching the DZ correlation." Independent
   recomputation shows the opposite mechanism: r(MZ) is unchanged and r(DZ)
   falls. The resulting bias direction on heritability is still correctly
   described; only the stated mechanism is backwards. The same inversion
   appears in the file's header docstring.
5. **Tool 42 (Gene × Environment Interaction Visualiser), Simplified.** The
   "Widen the study to the whole range" button and its accompanying note
   text unconditionally claim full-range coverage, but the resulting window
   only equals the true full range when the centre slider is exactly 0.
   From the shipped default state, or after following the suggested
   teaching sequence, roughly 30% of the range is not actually sampled by
   the "widened" window even though the copy says it is.
6. **Tool 49 (Emotional-Intelligence Claims Laboratory), Full.** The lab
   introduction states "the scatterplot shows 300 simulated people drawn
   from it," but no scatterplot, random-number generator, or per-person
   data of any kind exists anywhere in `tool.js`; the model is entirely
   deterministic closed-form arithmetic on a correlation matrix. Matching
   dead code (a "seeded randomness" comment block, unused CSS for a
   `.scatter__points` element) survives in three files from an apparently
   removed feature. Separately, the page's opening-question prose calls the
   outcome measure itself (colleague ratings) "a measure of emotional
   intelligence," in tension with the lab's own later section, which
   correctly separates the three EI-labelled predictors from the outcome
   they are sold on predicting.
7. **Tool 50 (Self-Esteem Stability Tracker), Simplified.** The synthesis
   panel states "Ada and Cleo take the same kind of knock in different
   domains," but the code delivers the identical work-domain event to all
   three fictional people; there is only one shared events array. Ada also
   has no domain-asymmetry in her contingency values (0.25/0.25), so the
   framing of "the domain that matters to them" does not apply to her
   either way.
8. **Tool 03 (Person-Situation Interaction Theatre), Full, four related
   issues.** (i) A code comment claims tied ranks "share the lower rank
   number," but `ranksFor()` assigns strictly sequential ranks with no
   tie-sharing; a genuine tie exists in the shipped data (the emergency
   situation, at its own default strength, gives Jonah and Elif
   bit-identical behaviour, both displayed as "62"/"63," yet different
   ranks). (ii) The "all five situations" / challenge section has no
   `hidden` attribute and is not gated behind completing both ranking
   rounds, so a learner who scrolls ahead sees an empty matrix table
   alongside fully live, submittable challenge controls. (iii) The
   challenge's grading checks only which multiple-choice option was
   selected, never whether the spread-below-2 manipulation was actually
   performed, so selecting the correct answer from page load with no
   interaction still returns a self-contradictory "correct, spread now
   15.2" message. (iv) At the strength slider's maximum, all four people's
   behaviour collapses to an exact tie, and a stable-sort artifact makes
   the tool report "the two settings agree about who does most." This is a
   vacuous reading, since there is no real ordering left once everyone is
   behaviourally identical.

## Live-QA follow-up: resolution status

All eight defects listed above were fixed on the follow-up branch
`fix-personality-individual-differences-live-qa`, scoped tightly to the
defects themselves — no teaching guide prose was rewritten and no new
product functionality was added. A new regression gate,
`scripts/test-personality-individual-differences-live-qa.js` (registered as
the 14th `check-all.py` gate), runs each fix's REAL production code inside a
sandboxed extraction of the shipped source, so a regression to any of these
eight points would fail the harness rather than merely a stale comment.

1. **Tool 24 (Courtroom), Full — RESOLVED.** `pairs.slice(0, 14).forEach(...)`
   in `tool.js` is now `pairs.forEach(...)`, so the accessible table renders
   every one of the 25 non-"partly" pairs the sighted diagram encodes (as
   either "compete" or "compatible"), not just the first 14. The
   `metadata.json` "every pair" accessibility claim is now true of the code
   rather than aspirational. Verified live in a headless browser: the
   `[data-diagram-table]` body now contains 25 rows, up from 14.
2. **Tool 09 (Facet-Level Detective), Full — RESOLVED.** The smallest
   truthful correction was made to the data, not the prose: Tomas's `b`
   value changed from 80 to 82, so his Agreeableness domain average is
   genuinely 67, matching the other profile's 67 exactly (previously 66 vs.
   67). `buildVerdict()` was also changed to compute both people's domain
   scores independently and only display a single shared figure when they
   are actually equal (`scoreA === scoreB ? fmt(scoreA) : ...`), so a future
   data edit that broke the equality would show two different numbers
   instead of silently asserting a false one. The two facets underneath
   still differ by more than 20 points each, preserving the behavioural
   contrast the case is built to teach.
3. **Tool 07 (Factor Rotation Playground), Full — RESOLVED.** The
   "correlated" marker set's note, the `index.html` debrief prose, the
   `metadata.json` `simulationNotes`, and the generated `standalone.html`
   no longer assert a fixed "about 55 degrees" claim. A new
   `naturalSeparation()` function computes the marker set's own best-fitting
   axis separation from its actual coordinates at load time (the same
   simplicity objective the tool's "find the simplest structure" control
   already sweeps), and the debrief prose and note now quote that live
   figure via a `[data-natural-angle]` span rather than a hard-coded number.
   Because the figure is computed from the shipped coordinates rather than
   typed in, it cannot go stale again if the coordinates ever change — the
   regression gate independently re-derives the same optimum from the
   shipped markers and asserts the shown figure matches it.
4. **Tool 39 (Twin-Study Simulator), Full — RESOLVED.** All three
   occurrences of the backwards mechanism claim — the live "What the
   violations are doing" panel, the challenge feedback string, and the file's
   header docstring — were corrected to state the actual mechanism:
   unequal environments leave r(MZ) unaffected and lower r(DZ), which is
   what inflates the Falconer heritability estimate. The bias direction
   itself was already correctly described and is unchanged. The regression
   gate numerically recomputes both correlations under the violation and
   asserts r(MZ) is unaffected while r(DZ) falls, guarding against the
   backwards phrase returning.
5. **Tool 42 (Gene × Environment Interaction Visualiser), Simplified —
   RESOLVED.** `toggleWiden()` now sets the centre control to `0` whenever
   it widens the window, so pressing "Widen the study to the whole range"
   genuinely sets the sampled window to the tool's full `[-1, 1]` range
   regardless of where the centre slider currently sits — the button's
   promise is now unconditionally true rather than true only from a centre
   of exactly 0. Verified live from both the shipped default (`centre =
   -60`) and from `centre = 0.6`: both now reach the full range after one
   click.
6. **Tool 49 (Emotional-Intelligence Claims Laboratory), Full — RESOLVED.**
   The lab introduction and opening-question prose no longer describe a
   scatterplot or "300 simulated people"; the model is described as what it
   actually is, a deterministic closed-form calculation on a correlation
   matrix. The dead "seeded randomness" comment block and the unused
   `.scatter__points` CSS rule (with its `forced-colors` variant) were
   removed after confirming by search that nothing in `tool.js` or
   `index.html` still referenced them. Separately, the opening question now
   names exactly the three EI-labelled predictors as EI measures and
   describes colleague ratings as the outcome they are being sold on
   predicting, consistent with the lab's own later section.
7. **Tool 50 (Self-Esteem Stability Tracker), Simplified — RESOLVED.** The
   synthesis panel no longer claims Ada and Cleo take the knock "in
   different domains" — there is only one shared work-domain event array, as
   the review above notes. It now explains the actually-implemented
   mechanism: Cleo's work contingency is higher than Ada's and her recovery
   is slower, so the identical work setback lands harder on her and takes
   longer to fade, while Ada — who has no work/social asymmetry in her own
   contingency values — recovers within days. No domain manipulation was
   invented; the explanation was brought in line with the code that already
   ships.
8. **Tool 03 (Person-Situation Interaction Theatre), Full, four related
   issues — RESOLVED.**
   - (i) Tie handling: `ranksFor()` now assigns the statistically
     conventional averaged mid-rank to tied behavioural values (so Jonah and
     Elif's bit-identical emergency-situation behaviour both rank 2.5,
     rather than one arbitrarily outranking the other), matching what the
     code comment already claimed. The Spearman calculation, the displayed
     ranks, and the generated `standalone.html` all use the same corrected
     function.
   - (ii) Gating: the matrix/challenge section (`#matrix-section`) now ships
     `hidden` in `index.html` and is only unhidden in the same step that
     unlocks the explorer (after both prediction rounds are complete);
     resetting the page re-hides it along with the explorer.
   - (iii) Challenge grading: the submit handler now requires both the
     actual spread-below-2 manipulation (checked against the live model
     state, not merely assumed) and the correct conceptual answer before
     accepting the challenge, with distinct feedback for "right answer,
     manipulation not done," "manipulation done, wrong answer," and "both
     done." Verified live: selecting the correct answer before touching the
     strength slider is correctly rejected, and is only accepted once the
     spread is actually driven below 2.
   - (iv) The tie-break display artifact was resolved by (i) above: with
     mid-rank averaging, the shipped emergency tie now displays and computes
     consistently end to end, so there is no longer a whole-number rank
     implying a distinction the underlying behaviour does not support.

## Live-QA follow-up: independent-review correction pass

The first live-QA follow-up pass above (the eight RESOLVED clusters) was
itself independently reviewed before merge. That review found the fixes
directionally correct but incomplete in three places, all corrected in a
second commit on the same branch:

1. **Tool 03: mid-rank tie handling had been fixed without updating
   Spearman.** `ranksFor()` was correctly changed to assign averaged
   mid-ranks to tied behavioural values, but `spearman()` still used the
   untied shortcut `1 - 6*sum(d²)/(n(n²-1))`, which is only exact without
   ties — so the rank-correlation figure the tool actually reports for the
   shipped emergency tie was mathematically wrong under the very fix meant
   to correct it (0.65 instead of the tie-correct 0.632455532...). Fixed by
   rewriting `spearman()` as the ordinary Pearson correlation of the
   (mid-)rank vectors, the standard definition when ranks are tied, with no
   ad-hoc correction bolted onto the old shortcut. This also exposed a
   genuine degenerate case: at maximum situation strength every character
   ties in every situation, giving two zero-variance rank vectors between
   which a correlation is not mathematically defined. `spearman()` now
   returns `null` in that case, `consistency()` averages only the pairwise
   correlations that are defined and returns `null` if none are, and
   `renderMatrix()`'s note explicitly says consistency is not defined
   rather than falling through to a numeric verdict — verified live in a
   headless browser that maximum strength never renders "1.00" or "High."
   The new Tool 03 regression did not exercise `spearman()`/`consistency()`
   at all (it only called `ranksFor()`), so it could not have caught either
   half of this; it now extracts and drives the real `spearman()`,
   `consistency()` and `renderMatrix()` functions directly, with a
   deterministic check on the shipped party-vs-emergency pair (asserting
   0.632455532..., not 0.65) and on the all-tied degenerate state.
2. **Tool 09: the defensive equality check was not fail-safe.** The first
   fix computed both Agreeableness scores independently and rendered
   `NaN` if they ever diverged, but the surrounding sentence still asserted
   "equal by construction" regardless, and an unconditional second
   paragraph a few lines later separately claimed the domain-score columns
   "are identical" — so a future data edit that broke the equality would
   still read as confidently, doubly wrong prose around a lone dash.
   `buildVerdict()` now branches on whether the two computed scores are
   actually equal: the shipped, genuinely-equal case renders the original
   "equal by construction" wording in both paragraphs; a deliberately
   broken case (exercised directly by the regression, not just imagined)
   renders both real, unequal numbers and neither equality claim. The
   shipped Agreeableness case is still required to be exactly equal by the
   original regression check, so this fallback is defence-in-depth rather
   than permission for the data to drift.
3. **Tool 07: the regression oracle was self-referential.** The first
   regression compared production's own `naturalSeparation()` output
   against production's own prose, which would pass even if
   `naturalSeparation()` itself found the wrong angle — it validated
   prose/code synchronisation, not correctness. Adding a genuinely
   independent oracle (fresh test-side re-implementation of the simplicity
   search, not calling any of tool.js's own functions) surfaced a real bug
   `naturalSeparation()`'s unconstrained sweep can land on either member of
   a mathematically tied, mirror-image pair of oblique angles (`x` and
   `180 − x` always score identically, since the second axis merely points
   the other way) — and the shipped display-only `preRotate()` transform
   happened to tip the shipped correlated set onto the wide (144.5°,
   correlation −0.81) member of that pair instead of the intended narrow,
   conventional one (35.5°, correlation +0.81), the one the earlier
   independent review had already established as ground truth. The
   resulting shipped sentence — "the two groups sit closer to 145° apart
   than to 90°" — was nonsensical on its own terms. Fixed by normalising
   `naturalSeparation()`'s unconstrained result to the conventional acute
   (≤ 90°) representation of the angle between two axes, which is always
   available given the proven tie. The regression now includes a
   from-scratch independent oracle that never calls production's
   `naturalSeparation()`/`bestAngle()`/`simplicity()`/`loadings()`, and
   asserts the independent result lands in the already-reviewed
   neighbourhood (≈36–38°, r ≈ 0.79–0.81), that production agrees with it
   within the sweep resolution, and that the learner-facing debrief figure
   agrees with it too.

All eight original live-QA clusters remain RESOLVED after this correction
pass. None of the three points above reopens a cluster; each completes a
fix (Tool 03, Tool 09, Tool 07) that the first pass made correctly in
substance but had not carried all the way through.

## Stale teaching-note claims found (not repeated in the new guides)

- Tool 04 Full: "the stability curve settles after about 5 observations for
  Ada and 25 for Bo." Recomputing the tool's own settle criterion at the
  shipped default seed gives n=2 and n=41.
- Tool 04 Simplified: "the spread... at every setting from about five
  moments upward." This only holds from roughly n≈15–20 upward; at n=5 the
  values are meaningfully off.
- Tool 07 Full: the "55°/0.57" figure (see live defect 3) is repeated four
  times in the previous teaching-notes.md, inherited uncritically from the
  source rather than checked against the coordinates.
- Tool 13 Full: the misconceptions-table explanation of the wrong-maximum
  error's origin ("subtract from the number of points") does not
  arithmetically connect to the tool's actual `7 − raw` formula.
- Tool 13 Simplified: the accessibility section described a data table and
  a dedicated "rank-order figure" with an accessible change-count that do
  not exist anywhere in the actual markup or code.
- Tool 21 Simplified: a numeric error ("3.18" where the live page renders
  "3.17," a `.toFixed(2)` rounding artifact) and a fabricated citation
  title attributed to Chen (2008).
- Tool 21 Full: two duplicated, near-identical sections ("Running it from
  the front" and "The demonstration worth doing from the front" said
  almost the same thing).
- Tool 24 Full: a stale distinctiveness ranking naming "values, reputation
  and situational-pressure" as the top three; independently recomputing
  `discrimination()` for all eight explanations gives pressure, reputation
  and incentive as the true top three, with values mid-pack (tied with
  self-efficacy).
- Tool 32 Full: "loadings between about 0.7 and 0.8" for the Strong-
  general-factor preset; the actual value is a single uniform 0.8114 with
  no spread at all under that preset's symmetric design.
- Tool 34 Full: "roughly half the score is something other than reasoning"
  for the default design; the tool's own model gives 37% construct-relevant
  (63% non-reasoning), which the same document's own reference table states
  two sections later.
- Tool 34 Simplified: "five of six demands are substantial" for the opening
  design; recomputation shows all six clear the substantial threshold.
- Tool 39 Full: "heritability estimate from about 0.43 to about 0.58" after
  the equalise-environment demonstration; recomputation at the documented
  default seed gives ≈0.60. The same document also claims resampling "moves
  them by a few hundredths," directly contradicted by its own earlier claim
  that resampling moves the estimate "by several points."
- Tool 49 Simplified: "at an overlap of 0.5 the measure still adds 9.5
  points"; recomputation gives 9.3.
- Tool 50 Full: "Ari and Bea differ only in volatility," contradicted by
  the parameter table three lines above it in the same document (their
  contingency and recovery values also differ).
- Tool 50 Simplified: "Ada and Cleo both took a knock in the domain that
  matters to them," a softer echo of live defect 7 above (Ada has no
  domain asymmetry to speak of).

## Stale source-code comments (internal only, not learner-facing)

- Tool 04 Full: dead `icc()`/`betweenSd()`/`withinSd()` functions, never
  called anywhere, with a docstring describing them as computing the live
  readout; the actual displayed figure is a separate inline
  reimplementation scoped to only the currently-visible people.
- Tool 31 Simplified: a comment claims "127 non-empty selections within the
  budget"; 127 is the total number of non-empty subsets before the
  60-minute budget filter, which leaves 108. The dependent counts (45/7/5,
  and "no selection satisfies all three") are correct.
- Tool 32 Simplified: two internally-contradicting residual bounds in the
  same file ("stays under 0.025" vs. "under 0.023 at every setting"); the
  true maximum is 0.02354, satisfying the first and violating the second.
- Tool 34 Simplified: a comment claims "the lowest maximum available is
  0.35"; brute-force search over all 81 designs finds 0.30, which
  `metadata.json` already states correctly.
- Tool 39 Full: the header docstring repeats the same "raises r(MZ) only"
  inversion as the live UI text (live defect 4).
- Tool 42 Full: the header comment's model formula includes an `intercept`
  term that does not exist in any preset or in the executing function.
- Tool 49 Full: a "seeded randomness" section comment and an unused
  `.scatter__points` CSS rule survive from an apparently removed
  scatterplot feature (see live defect 6).
- Tool 50 Full: the per-person seed salt `person.id.length * 31` is a
  no-op because all four person IDs ("ari", "bea", "cal", "dee") are
  exactly three characters long, so all four people's day-to-day noise
  draws are bit-for-bit identical, differing only by each person's
  volatility multiplier. Table statistics remain individually valid; only
  the chart's visual framing of "four independent people" is affected, and
  the chart is already documented as decorative with the table as the
  authoritative source.

## Metadata inconsistencies

- Tool 03 Simplified: `metadata.json` and the previous teaching notes both
  called the handover task's trait "conscientiousness"; the executing code
  and the on-screen chart label both use "care," a distinct, undefined
  construct.
- Tool 32 Simplified: `metadata.json` repeats the incorrect 0.023 residual
  bound and additionally claims it is "verified at every setting in the
  test suite." No automated test suite exists anywhere in this
  repository.
- Tool 32 Full, Tool 42 Full, Tool 49 Full: each tool's `metadata.json`
  `estimatedMinutes` (20, 15, 15 respectively) disagrees with that same
  tool's own on-page hero text and module-index card duration (25, 25, 20
  minutes respectively).

## Internal contradictions caught during drafting

- Tool 07: the previous notes' own "55°/0.57" claim for the correlated set
  contradicted the tool's own invariants panel once the actual best-fit
  angle was checked; the new guide states the trig identity as a mechanical
  fact of the slider rather than a claim about where the markers "really"
  sit.
- Tool 24: the previous notes' distinctiveness ranking was checked against
  a from-scratch recomputation of `discrimination()` rather than trusted,
  which is how the pressure/reputation/incentive correction was found.
- Tool 34: the previous notes' "roughly half" claim was checked against
  its own later reference table in the same document, which already stated
  37%; the two sections of the same file disagreed with each other before
  this rewrite.
- Tool 39: the previous notes' "a few hundredths" resampling claim
  contradicted its own earlier "several points" claim in the same
  document; the new guide uses only the "several points" framing, which is
  the one that matches independently re-run resampling.
- Tool 50: the previous notes' "Ari and Bea differ only in volatility"
  claim was checked against the parameter table it sits beside, which
  already showed three parameters differing, not one.

## Cross-file AI-tell pass

All 35 files were scanned together (plus the frozen pilot, for a 36-file
sweep) after all three batches were drafted, per the task's instruction to
defer this pass until every file existed:

- **Zero em dashes** across all 35 files, confirmed by direct grep.
- No occurrence of any of the specified general or psychometrics-specific
  stock phrases ("traits are tendencies, not destinies," "a score is not a
  person," "does not automatically mean," "cannot tell you why," "the key
  is," "worth noting," and the rest of the supplied list).
- No exact-duplicate "Use in class / timing" sentences across the batch.
- "None needed" originally appeared in 30 of 35 "Before students start"
  sections. The first pass defended keeping it as an established house
  phrase; independent review rejected that defence outright. The brief
  explicitly named repeated "None needed" as a known AI tell, and the
  Social & Critical rollout had already removed the same collection-level
  template from its own guides, so defending it here as house style was a
  direct contradiction of both. See "Independent-review correction pass"
  below for the fix and the exact before/after count.
- One genuine repeated-opening pattern was found: the Full guides for tools
  14, 36 and 50 all opened with a "[number] fictional [people/respondents]
  share exactly/the same..." construction. Tool 14's was kept as the
  first, clearest instance; tools 36 and 50 were reworded ("accumulate
  evidence at exactly the same rate..." and "start from the same baseline
  level, then diverge...") without changing any figure.
- No excessive colon use or "not X but Y" construction stacking was found
  beyond ordinary, non-repetitive usage (checked programmatically; the
  highest counts were 3 colons in a roughly 400-word file, in keeping with
  the density of the pilot itself).

## First-pass conclusions corrected on reread

- **Tool 14's model constants.** The previous teaching-notes.md's own "The
  model" section quoted a discrimination constant of 0.9 and a midpoint
  pull factor of 0.28. Reading `tool.js` directly showed the actual shipped
  constants are 1.2 and 0.45. The previous notes' *qualitative* balanced/
  unbalanced gap figures ("about 6" and "about 15" points) turned out to
  still be correct against the real code once the correct per-style seed
  offset (`state.seed + style.id.length * 17`) was accounted for. An
  initial same-seed comparison across styles gave the wrong gap entirely
  until this was found and corrected.
- **Tool 24's distinctiveness ranking.** The obvious move was to keep the
  previous notes' "values, reputation, situational-pressure" ranking, since
  it read as plausible prose. Recomputing `discrimination()` directly from
  the `EXPLANATIONS` array showed "values" is mid-pack and "incentive," not
  named at all in the old ranking, is a true top-three member.
- **Tool 36's response-time figures.** A first pass toward reusing the
  previous notes' "about 600ms" and "about 990ms" figures for two of the
  four fictional respondents was abandoned once independently
  re-implementing `expectedRt()` gave 509ms and 1140ms for the same two
  respondents at the documented parameters.
- **Tool 39's "equalise environment" demonstration.** This demonstration
  was initially considered for inclusion in the concise guide, since it is
  the tool's most striking single move. It was left out once the research
  showed the tool's own text ("no gene has changed, and the genetic slider
  has not moved") does not address the fact that the same screen's
  displayed Truth-table value for genetic variance visibly rises from 0.40
  to about 0.60 as a side effect of renormalisation. Including it in the
  concise guide without that caveat would have reproduced the tool's own
  ambiguity; the three assumption-violation demonstrations, which are
  unambiguous, were used instead.

## Verification before push

- Exactly 35 `teaching-notes.md` files changed (17 Full + 18 Simplified),
  confirmed by `git diff --stat` against `origin/main`.
- `modules/personality-individual-differences/tools/12-alpha-trap/teaching-notes.md`
  confirmed byte-identical to `origin/main`.
- No activity code, `metadata.json`, catalogue data, `standalone.html`, or
  any other module's teaching notes changed (confirmed by `git diff
  --stat`).
- Zero em dashes across all 35 changed files (confirmed by grep).
- `python3 scripts/check-all.py` run on the branch; this task does not add
  a new gate, unlike the Neuropsychology and Social & Critical rollouts,
  which each added a live-QA follow-up gate; the harness stays at 13
  gates.

## Independent-review correction pass

An independent review inspected the finished guides against the actual
executing source and found the rollout strong but not merge-ready. This
section documents what that review caught and how each point was fixed.
The corrections below do not touch activity code, metadata, catalogue
files or standalone exports, and none of the queued live-QA defects were
fixed in this branch.

**1. The "None needed" AI tell.** The original cross-file AI-tell pass
found "None needed" in 30 of 35 "Before students start" sections and
decided to keep it as an established house phrase. Independent review
rejected that decision: the brief given for this rollout explicitly named
repeated "None needed" as a known AI tell, and the Social & Critical
rollout earlier in this series had already removed the identical
collection-level template from its own guides. Defending the pattern here
as house style directly contradicted both. All 30 instances were revisited
and rewritten with a genuine, activity-specific statement, drawn from a mix
of what students need to know already, what is visible when the page
opens, whether the values are fictional, whether the task is
self-contained, and whether nobody is assessed. No two guides received the
same sentence, and nothing was padded purely to create variation. The
literal phrase "None needed" went from 30 occurrences across the guides
this rollout owns to 0; the single remaining occurrence in the repository
is inside the frozen Alpha Trap pilot, which this branch never touches.

**2. Tool 03 (Person-Situation Interaction Theatre), Full, nonexistent
aggregate ordering.** The guide claimed that looking across several
situations "recovers an ordering that no single situation can show on its
own." The executing `consistency()` function computes mean pairwise
Spearman agreement among five separate situation-specific rankings; it
never constructs any single aggregate ordering of the four people. The
"What it teaches" paragraph and the debrief question were rewritten to
describe what the tool actually shows: how much the five rankings agree
with each other and which situations reorder the same people, not a
privileged grand ordering.

**3. Tool 04 (State versus Trait Tracker), Full, impossible duration and
an unverified invariant.** The guide said the volatile person's running
mean "keeps drifting for several simulated weeks," but the whole series is
only fourteen days at four observations a day, fifty-six readings total,
so "several weeks" cannot be correct on its own terms. This was corrected
to "roughly forty of the fifty-six readings, well over half the
fortnight," matching this rollout's own earlier recomputation of the
shipped default settle criterion (Ada settles at n=2, Bo at n=41).
Independent review also asked that the claim "raising measurement error
adds noise to every reading without moving any of the four means" be
re-verified rather than assumed. Re-implementing `generate()` in Node and
sweeping `errorSd` from 0 to 20 at the default seed showed the claim was
false as an exact invariant: because the error draws are a fixed set of
values simply scaled by `errorSd` rather than redrawn, each person's
displayed six-week average drifts measurably as error rises (Ada's mean
moved from 61.696 at `errorSd=0` to 64.339 at `errorSd=20` in this
recomputation). The guide now says measurement error never changes
anyone's underlying trait value, while noting it can nudge a person's own
displayed average slightly too, at a fixed seed, since the same draws are
scaled larger rather than redrawn. This is a genuine, newly-caught
numerical error in the original guide, not merely a wording tighten.

**4. Tool 04, Simplified, first-reading direction error.** The opening
said "Bo's first reading sits twenty points above his," but Bo's own
average is about 62 and his first reading is 47, about fifteen points
below his own mean, not above it. The twenty-point figure is the gap
between Ada's first reading (67) and Bo's first reading (47), a
between-person comparison, not a statement about Bo's own reading
relative to his own mean. The opening paragraph was rewritten to state
both facts correctly and distinguish them explicitly.

**5. Tool 13 (Reverse-Item Disaster), Full, arithmetic count.** The guide
said only two of the four scoring methods are "arithmetically distinct."
There are three distinct numerical results, not two: correct scoring
(`6 − raw`), the wrong-maximum method (`7 − raw`), and the two remaining
methods (noting the reverse wording but never recoding, and simply
forgetting to recode), which land on identical numbers as each other but
are numerically distinct from both correct and wrong-maximum scoring. The
opening was rewritten to state three distinct results, with the two
identical methods named as the pair that collapses together.

**6. Tool 24 ("Explain This Person" Courtroom), Full, "equally well."**
The guide said the eight explanations "all fit the same fictional case
equally well." The executing `EXPLANATIONS` array gives fit values from
0.70 to 0.85, not a single equal number. The intended point, that every
explanation was deliberately authored to fit the case plausibly, was
preserved, and "equally well" was replaced with wording that does not
imply numerically identical fit, while keeping the distinction between
retrospective fit and distinctive, falsifiable prediction intact.

**7. Tool 32 (Positive Manifold Visualiser), Full, correlated group
factors that do not exist in the model.** The guide repeatedly described
the "Broad Group Factors" alternative as "two correlated group factors."
The executing generator's own header comment states all latent sources
are independent: `z(i) = g·G + s·Group(i) + u·Specific(i) + e·Error(i)`,
with cross-group correlation coming entirely from the shared `g`
component, not from any correlation between the two group factors, which
are independent of each other by construction. Every instance of
"correlated group factors" (and the slogan "dressed up as one") was
replaced with accurate language: two independent group sources plus a
smaller shared source. The teaching point, that a positive first factor
does not by itself adjudicate between causal interpretations, is
unchanged.

**8. Tool 34 (Culture-Fair Test Challenge), Full, teaching proxy presented
as real score attribution.** The guide said the default design leaves
"only 37% of the score attributable to reasoning itself" and that "most of
what the score reflects is something other than reasoning." The executing
code defines `construct-relevant share = 1 − mean(demand levels) × LOAD`
as an explicitly stated crude illustrative model, and no score is ever
computed for any fictional test-taker anywhere in the tool. Both sentences
were rewritten to describe the 37% figure as the tool's illustrative
construct-relevant-share readout rather than a measured decomposition of a
real score.

**9. Tool 36 (Speed-Accuracy Trade-Off), Full, identification overclaim.**
The caution said that comparing accuracy and response time together,
alongside knowing whether threshold or drift moved, "actually
distinguishes them," which could be read as claiming joint speed-accuracy
data is generally sufficient to identify the underlying parameters. The
caution now makes explicit that this activity can state which parameter
moved only because it supplies the drift rate and threshold directly; with
real data, telling the two apart needs an explicit model fitted to the
full response pattern, not simply reading two summary numbers together.

**10. Tool 39 (Twin-Study Simulator), Full, variance components and
absolute language.** Two separate issues. First, the guide called the
default truth a "0.40/0.35/0.20 split," but the default also includes
0.05 of measurement error, and Falconer's `e² = 1 − r(MZ)` absorbs
measurement error together with non-shared environment, so the correct
comparison target for the formula's non-shared-environment row is 0.25,
not 0.20. The opening was rewritten to state all four true values and the
0.25 comparison target explicitly. Second, "never producing an unbiased
number by accident" was removed as an overclaim that clashes with the
activity's own lesson that two assumption violations pulling in opposite
directions can partly mask each other; the sentence now says a broken
assumption biases the estimate in a specific direction for that
assumption, with the masking possibility noted. Independent review also
asked that the gene-environment-correlation paragraph's direction claims
be independently recomputed rather than carried over. Re-implementing
`generateGroup()` and `falconer()` in Node at the documented default seed
(4471) and truth confirmed the guide's existing claims exactly: baseline
r(MZ)=0.7179, r(DZ)=0.5007; at gxeCorr=0.60, r(MZ) rises to 0.8077 and
r(DZ) falls to 0.4584, giving h²=0.6986 (inflated); at unequalEnv=0.40,
r(MZ) is unchanged and r(DZ) falls to 0.3483, giving h²=0.7393 and c²=0
(inflated); at assortative=0.60, r(MZ) is unchanged and r(DZ) rises to
0.6301, giving h²=0.1756 (deflated, the opposite direction). No change was
needed to those specific sentences; they were independently reverified
rather than assumed correct.

**11. Tool 42 (Gene × Environment Interaction Visualiser), Full, crossover
terminology.** "Where that interaction crosses zero" was replaced with
"where the two group lines cross." An interaction is a difference in
slopes; it is not itself a scalar quantity that can cross zero, and the
corrected wording describes the actual geometric event the tool displays.

**12. Tool 49 (Emotional-Intelligence Claims Laboratory), Full, two
terminology errors.** First, the guide said the self-report measure shares
"63% of their variance" with the personality questionnaire, but the live
figure is a correlation of r = .63, not 63% shared variance (r² ≈ .397, or
about 40%, if a variance figure were wanted). This was corrected to state
the correlation directly, ".63," without converting it to a variance
percentage. Second, the caution described predicting an outcome as
producing "convergent correlations," but a correlation with a
criterion/outcome is criterion-related or predictive evidence, not
convergent validity, which specifically concerns agreement with other
indicators of the same intended construct. The caution was rewritten to
use the correct terms and to avoid implying "low overlap" is a fixed
numeric threshold, framing the real question as whether a measure has
adequate discriminant evidence against competing measures.

**13. Tool 49, Simplified, an outcome correlation wrongly treated as
fixed.** The guide implied the new questionnaire's correlation with the
outcome does not need to change for its incremental contribution to
collapse. In the executing model, `newWithOutcome(overlap)` does move,
from about 0.46 at the lowest overlap up to about 0.48 and back down to
about 0.36 at the highest overlap, confirmed by independently
re-implementing the formula. The guide was rewritten to state the real
contrast accurately: the raw outcome correlation moves only modestly
across the slider's range, while the incremental contribution collapses
far more sharply, from about ten percentage points to under one.

**14. Tool 50 (Self-Esteem Stability Tracker), Full, recovery rate versus
recovery duration.** The guide said how long an effect lasts "has nothing
to do with how large the initial drop was." The model is
`carry(t+1) = carry(t) × recovery`, so while the recovery-rate parameter
is set independently of a person's reactivity, the actual number of days
until a profile returns near baseline depends on both the size of the
initial displacement and the decay rate together, not on the rate alone.
The sentence was rewritten to say the two parameters are independently
set without claiming duration is unrelated to drop size.

**15. Tool 55 (Personality Disorder Continuum), Full, diagnostic
wording.** "Diagnostic threshold" was replaced with "the activity's
classification threshold." The activity deliberately does not diagnose
anybody or reproduce any real diagnostic rule, so calling its threshold
"diagnostic" risked exactly the overclaim the tool itself is built to
guard against.

**16. Live-defect count and Candour wording corrected.** The original
Candour section understated the live-defect queue as "three of the
eighteen tool pairs (03, 39, 50 Full)." The queue documented in "Live
learner-facing defects found" above actually covers eight tool pairs (03,
07, 09, 24, 39, 42, 49, 50), and tool 03 alone contributes four related
problems within its own entry, so the queue holds eleven individual
issues clustered into eight entries. The Candour section was rewritten to
state this accurately; see that section below.

## Final cleanup pass

A second, tightly bounded pass followed the independent-review correction
pass above, prompted by a fresh reread of the finished guides rather than
a new full audit.

**Tool 32, remaining overstatement.** "What to look for" still described
the Broad Group Factors condition as "a structure that is really two
groups, not one general source," which the independent-review pass above
had missed even while rewriting the surrounding sentences. The executing
model has two independent group sources plus a smaller shared source, not
zero shared source, so calling it a structure with no general source at
all overstated the case. Replaced with "a structure dominated by two
group sources rather than by one dominant general source," which is
accurate to the model's actual composition rather than an all-or-nothing
claim.

**Review artifact, stale Tool 32 wording.** The "Psychometric distinctions
deliberately preserved" section still described the Broad Group Factors
condition as "correlated group factors," the exact phrasing the
independent-review correction pass had already flagged as wrong and
removed from the guide itself. That sentence was rewritten to match the
corrected model description. The historical description of the same
mistake inside "Independent-review correction pass" item 7 was left
alone, since it is clearly framed in the past tense as the mistake being
fixed, not a current claim.

**Collection-level "Students should already" template.** Removing "None
needed" from 30 guides had, without being noticed at the time, introduced
a new repeated opening across 13 of the guides this rollout owns: 12 Full
guides (03, 04, 07, 13, 31, 32, 34, 36, 39, 42, 49, 50) plus the
Simplified Alpha Trap twin, all beginning "Students should already...".
This is the same batch-level problem "None needed" was, in a different
form: one phrase copied across many files regardless of what each guide
actually needed to say. All 13 instances were reworded with genuinely
varied sentence structures (for example "A basic familiarity with factor
loadings is enough," "Correlation is the only statistical idea needed
here," "This works best once the group has met the state-trait
distinction," "The four characters and five situations are fictional,"
"Students only need the basic idea of a speed-accuracy trade-off"),
while keeping every genuine prerequisite and activity-specific fact the
original sentences stated. The literal phrase "Students should already"
went from 13 occurrences to 0. "None needed" remains at 0 in every guide
this rollout owns; the frozen Alpha Trap pilot still carries its own
single, untouched occurrence.

## Candour

This rewrite was not a clean, linear pass, and the first version of this
document was not candid enough about that. Two figures were nearly copied
forward from the previous notes before independent recomputation caught
them (tool 14's formula constants, tool 36's response times), and one
ranking claim (tool 24) would have propagated a wrong answer if the
distinctiveness scores had not been recomputed from the raw predictions
array rather than trusted from prose.

Eight of the eighteen tool pairs, not three, turned out to have live UI
text that actively asserts something the executing code does not do, a
more serious class of finding than most of what turned up in earlier
module rollouts in this series: tools 03, 07, 09, 24, 39, 42, 49 and 50.
Tool 03 alone contributes four separate related problems within its own
Full edition (a stale tie-handling comment, an ungated section, challenge
grading that never checks the manipulation it claims to grade, and a
tie-break display artifact), so the live-defect queue holds eleven
individual issues clustered into eight entries, not eight bugs. All are
queued in "Live learner-facing defects found" above and none were fixed
in this branch. One tool (55, Personality Disorder Continuum) came back
from research with no discrepancies of any kind, Full or Simplified, which
is presented as encouraging rather than treated with suspicion, since it
matches the amount of scrutiny given to every other tool in this batch.

See "Independent-review correction pass" below for what an independent
read of the finished guides against the executing source caught that the
original drafting and AI-tell passes missed, including the "None needed"
reversal, three numeric/directional errors that survived the original
numerical-audit claims (tool 03's aggregate-ordering claim, tool 04's
"several simulated weeks" and measurement-error invariance claim, and
tool 39's variance-component and gene-environment-correlation claims),
and several terminology and overclaim corrections across tools 13, 24,
32, 34, 36, 42, 49 and 50.
