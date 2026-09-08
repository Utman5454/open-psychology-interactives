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

| Tool | Full old | Full new | Simplified old | Simplified new |
|---|---:|---:|---:|---:|
| 03 Person-Situation Interaction Theatre | 1700 | 369 | 707 | 320 |
| 04 State versus Trait Tracker | 1908 | 434 | 963 | 320 |
| 07 Factor Rotation Playground | 1594 | 392 | 1029 | 331 |
| 09 Facet-Level Detective | 1971 | 391 | 949 | 318 |
| 12 The Alpha Trap | 378 | 378 (frozen) | 1027 | 383 |
| 13 Reverse-Item Disaster | 1718 | 367 | 1157 | 322 |
| 14 Response-Style Simulator | 1510 | 391 | 1059 | 315 |
| 21 Measurement-Invariance Translator | 1703 | 400 | 1008 | 349 |
| 24 "Explain This Person" Courtroom | 1482 | 404 | 878 | 323 |
| 31 Intelligence-Test Battery Builder | 1769 | 356 | 1090 | 310 |
| 32 Positive Manifold Visualiser | 1524 | 354 | 1199 | 313 |
| 34 Culture-Fair Test Challenge | 1726 | 387 | 961 | 299 |
| 36 Speed-Accuracy Trade-Off | 1672 | 377 | 919 | 340 |
| 39 Twin-Study Simulator | 1797 | 392 | 926 | 273 |
| 42 Gene × Environment Interaction Visualiser | 1372 | 369 | 969 | 269 |
| 49 Emotional-Intelligence Claims Laboratory | 2039 | 384 | 930 | 317 |
| 50 Self-Esteem Stability Tracker | 1609 | 371 | 969 | 320 |
| 55 Personality Disorder Continuum | 1968 | 360 | 1081 | 343 |

Full total: 29,440 → 6,876 words (17 rewritten Full guides plus the frozen
378-word pilot both included in the "new" figure above).
Simplified total: 17,821 → 5,765 words.
Aggregate: 47,261 → 12,641 words, a **73.3% reduction**.

New word-count range: 269 (Simplified, tool 42) to 434 (Full, tool 04). One
guide, Full 04, sits closer to the upper end of the target band; it was kept
at that length because State versus Trait Tracker's model has more moving
parts to describe accurately (four people, wobble, event decay, measurement
error, and a stability-convergence comparison) than most of the other
guides, and cutting further risked losing one of those distinctions rather
than tightening prose. No guide exceeds 450 words.

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
  extracted factor is described as compatible with one general source and
  with correlated group factors, and the caution rejects both "proves
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
- "None needed" appears in 30 of 35 "Before students start" sections. This
  is the established house phrase from the approved Alpha Trap pilot itself
  ("Before students start. None needed.") and from every prior module's
  rollout, not a drafting tic introduced here, so it was kept rather than
  varied for variety's own sake.
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

## Candour

This rewrite was not a clean, linear pass. Two figures were nearly copied
forward from the previous notes before independent recomputation caught
them (tool 14's formula constants, tool 36's response times), and one
ranking claim (tool 24) would have propagated a wrong answer if the
distinctiveness scores had not been recomputed from the raw predictions
array rather than trusted from prose. Three of the eighteen tool pairs (03,
39, 50 Full) turned out to have live UI text that actively asserts
something the executing code does not do, not merely stale documentation,
which is a more serious class of finding than most of what turned up in
earlier module rollouts in this series; all three are queued above rather
than fixed here. One tool (55, Personality Disorder Continuum) came back
from research with no discrepancies of any kind, Full or Simplified, which
is presented as encouraging rather than treated with suspicion, since it
matches the amount of scrutiny given to every other tool in this batch.
