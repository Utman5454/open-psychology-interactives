# Concise teaching-guide rollout: Social and Critical Psychology

Date: 2026-09-08. Status: **awaiting independent review before merge; one
learner-facing defect and one self-contradictory metadata file found during
research, both left unfixed on this branch and flagged below for a separate
follow-up PR.** Fourth module-sized pass, after Cognitive Psychology
(`docs/product/concise-teaching-guide-cognitive-rollout-review.md`), Research
Methods (`docs/product/concise-teaching-guide-research-methods-rollout-review.md`)
and Neuropsychology
(`docs/product/concise-teaching-guide-neuropsychology-rollout-review.md`). It
rewrites every remaining Social and Critical Psychology teaching guide, Full
and Simplified, into the approved seven-section format. No other module was
touched. No activity code or metadata was changed on this branch; the defects
found below were reported, not fixed.

## Files changed

23 `teaching-notes.md` files, all under
`modules/social-critical-psychology/tools/` or
`simplified/modules/social-critical-psychology/tools/`, plus this document.

**Full edition (11 of 12; `08-minimal-group-positive-distinctiveness`
already approved in the five-guide pilot and left untouched):**
`01-epistemology-lens-switch`, `02-constructing-a-category`,
`03-attitude-behaviour-gap`, `04-conformity-under-context`,
`05-self-through-different-lenses`, `06-discourse-subject-position-lab`,
`07-sherif-norm-formation-lab`, `09-crowd-deindividuation-vs-esim`,
`10-power-lens-lukes-foucault-fricker`,
`11-measuring-prejudice-instrument-lab`,
`12-person-or-setting-workplace-lab`.

**Simplified edition (all 12, including
`08-minimal-group-positive-distinctiveness`'s Simplified twin, which had not
yet been rewritten):** the same 11 slugs as the Full list above, plus
`08-minimal-group-positive-distinctiveness`.

`git diff origin/main -- modules/social-critical-psychology/tools/08-minimal-group-positive-distinctiveness/teaching-notes.md`
is empty, confirming the approved Full Minimal Group guide was not touched.

## Word counts

### Full edition (11 rewritten; `08` excluded, unchanged)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Epistemology Lens Switch | 2,422 | 335 | 86% |
| Constructing a Category | 2,395 | 345 | 86% |
| Attitude-Behaviour Gap | 2,123 | 347 | 84% |
| Conformity Under Context | 1,801 | 313 | 83% |
| Self Through Different Lenses | 1,806 | 348 | 81% |
| Discourse and Subject Position Lab | 1,715 | 328 | 81% |
| Sherif Norm-Formation Laboratory | 1,628 | 308 | 81% |
| Crowd Behaviour Laboratory (Deindividuation vs ESIM) | 2,326 | 312 | 87% |
| Power Lens Laboratory | 2,296 | 361 | 84% |
| Measuring Prejudice: Instrument Lab | 2,526 | 319 | 87% |
| Person or Setting: Workplace Lab | 2,325 | 351 | 85% |
| **Full total (11 files)** | **23,363** | **3,667** | **84%** |

### Simplified edition (12)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Epistemology Lens Switch | 924 | 309 | 67% |
| Constructing a Category | 1,005 | 261 | 74% |
| Attitude-Behaviour Gap | 943 | 267 | 72% |
| Conformity Under Context | 900 | 242 | 73% |
| Self Through Different Lenses | 903 | 242 | 73% |
| Discourse and Subject Position Lab | 952 | 234 | 75% |
| Sherif Norm-Formation Laboratory | 1,524 | 259 | 83% |
| Minimal Group / Positive Distinctiveness | 926 | 295 | 68% |
| Crowd Behaviour Laboratory (Deindividuation vs ESIM) | 890 | 265 | 70% |
| Power Lens Laboratory | 1,247 | 264 | 79% |
| Measuring Prejudice: Instrument Lab | 910 | 225 | 75% |
| Person or Setting: Workplace Lab | 846 | 256 | 70% |
| **Simplified total (12 files)** | **11,970** | **3,119** | **74%** |

**Grand total (23 files): 35,333 to 6,786 words, an 81% reduction.**
New guides range from 225 to 361 words. Every one of the 23 sits well under
the 450-word check-in point named in the brief, so nothing required
justification for length; the longest, Power Lens Laboratory (Full) at 361,
walks three named-only-at-debrief lenses plus a transfer case and stayed at
that length because each lens needs its own "brings into focus / leaves less
visible / remedy" triad stated once, not because anything padded it.

## Source-of-truth workflow

Six background research agents covered the 12 Full/Simplified pairs (one
agent took three pairs: Person or Setting Full and Simplified, plus a
supplementary look at Minimal Group Simplified). Each agent inspected the
tool's actual `index.html`, its executing `tool.js` (independently
re-executing seeded-random models where present: Constructing a Category,
Attitude-Behaviour Gap, Person or Setting, both editions of each), its
`metadata.json`, and its existing `teaching-notes.md`, and classified every
disagreement it found by the five-way taxonomy in the brief before any guide
was drafted. Every number quoted in a final guide, percentages, condition
counts, correlation values, sample sizes, was checked this way rather than
carried over from an old note or a code comment.

## Theoretical distinctions deliberately preserved

One example per accuracy area named in the brief:

- **Mainstream vs critical / epistemology.** Epistemology Lens Switch states
  that the three lenses commit a researcher to different research objects,
  methods and defensible claims from the identical case file, not that one
  lens is correct and the others mistaken; the coherence score is stated
  explicitly as a floor a design has to clear, not a quality mark.
- **Constructionism without the "unreal" slide.** Both editions of
  Epistemology Lens Switch and Constructing a Category state the
  constructionist caution as the tool itself states it: analysing how a
  category is assembled is not a claim that what it names is fictional, and
  the realist/positivist lens gets the matching caution that a measurement
  schedule still encodes somebody's definition before the first observation.
- **Categories and thresholds.** Constructing a Category (both editions)
  keeps feature selection, naming, threshold, instrument and institutional
  uptake as five separate, individually defensible decisions, and states the
  headline finding, prevalence swinging with zero people changing, as a fact
  about where the threshold sits, not as evidence the condition has no
  reality.
- **Attitudes and behaviour.** Attitude-Behaviour Gap keeps the claim
  narrow: opportunity multiplies the whole estimate rather than adding to
  it, and the correlation's range (0.20 to 0.87 in the Full edition) is
  explained by measurement correspondence and behavioural uniformity, not
  stated as "attitudes do not predict behaviour."
- **Conformity vs norm formation.** Conformity Under Context and Sherif
  Norm-Formation Laboratory are drafted as two different mechanisms
  throughout: the former splits into normative and informational routes
  measurable by a privacy manipulation; the latter has no correct answer to
  abandon, so a later private judgement landing near an earlier group value
  is convergence under ambiguity, not caving in. Neither guide's caution
  section borrows the other's vocabulary.
- **Self and identity.** Self Through Different Lenses states that no
  framework applied in the activity ever treats itself as having found the
  real Nadia, and that declining "which is the real me" as the wrong
  question is not the same as denying any continuity or stable
  characteristics.
- **Discourse and subject positions.** Discourse and Subject Position Lab
  frames each account as an authored reading grounded in an undisputed
  ledger, not a claim about what any author privately believes, and both
  editions add the caution that a well-argued alternative reading of the
  same ledger deserves credit rather than being wrong by default.
- **Minimal groups.** Minimal Group / Positive Distinctiveness (Simplified)
  keeps the Full guide's "sufficient in this stripped-down setting, not
  necessary and not an explanation of real prejudice or racism" framing
  rather than strengthening it.
- **Crowds and deindividuation vs ESIM.** Crowd Behaviour Laboratory states
  what each account predicts and names the one manipulation that separates
  them (indiscriminate policing that creates a shared category, not
  anonymity alone), and states directly that one built-in scenario
  deliberately favours the classic account, so neither theory is treated as
  disproved by a single result.
- **Power.** Power Lens Laboratory keeps Lukes, Foucault and Fricker's three
  lenses (withheld by name until debrief) as distinct mechanisms with
  distinct remedies and distinct blind spots, and states directly that
  treating every interaction as evidence of domination erases the
  distinctions the case is built to show.
- **Prejudice and measurement.** Measuring Prejudice: Instrument Lab keeps
  five instruments at three separate levels (individual, dyadic,
  institutional) as non-interchangeable readings of one hidden trait, and
  states the "real attitude, underneath" framing of the latency task as a
  rhetorical promotion, not a measurement claim.
- **Normative vs empirical.** Person or Setting: Workplace Lab keeps a
  real, orderly correlation distinct from a claim about what it counts for
  or against regarding a rota, queue or budget applied to everyone on a
  team, and its debrief asks directly why a real pattern and a causal claim
  are not the same thing.

## Internal-consistency audit

Every one of the 23 drafts was read a second time as an argument, checking
for the specific failure patterns named in the brief: "constructed" drifting
into "unreal"; a hedged claim drifting into a settled one; "can/may/in this
setting" drifting into "does/always/proves"; group-level findings drifting
into individual claims; simulated values drifting into claims about real
historical data; association drifting into a causal claim; an interpretive
reading drifting into a claim about someone's private mental state; a
critical perspective presented as automatically superior to a mainstream
one; and percentages or condition counts disagreeing across a guide's own
sections.

No instance of any of these patterns survived into the final drafts. Two
things were caught and corrected during drafting itself, before the guides
were considered finished, both logged here for candour rather than left
unmentioned:

- The first draft of Self Through Different Lenses (Full) stated the
  fee-rise/hours-cut synthesis figure as "six of seven frameworks," copying
  the tool's own stale figure (see the discrepancy entry below) before the
  research brief's independently recomputed figure, five directly and two
  indirectly, was substituted.
- The first draft of Discourse and Subject Position Lab (Full) stated
  "none of the five accounts mentions" the halved hours, again copying the
  tool's own stale claim, before being corrected to "only the advocacy
  bulletin mentions it; the other four genres have no field for it."

Both corrections are additionally recorded under "Cross-source accuracy
audit" below, since they originate in a tool-side inaccuracy rather than a
drafting slip. Beyond those two, no case was found of a guide's own sections
disagreeing with each other on a number, a condition count, or the strength
of a claim.

## Cross-source accuracy audit and content discrepancies found

None required a code fix in this branch; all are documentation-only
observations, flagged here rather than silently fixed, and classified per
the brief's five-way taxonomy.

- **Stale tool-side claim, `05-self-through-different-lenses` (Full),
  `tool.js` comment, `index.html` debrief text, `metadata.json`, and the
  CLAIMS challenge feedback.** All four state that six of the seven
  frameworks can reach the fee-rise/hours-cut statement. The tool's own
  `LENSES[*].coding[8]` data gives five frameworks a direct "yes" and two
  ("possible selves," "relational") only an indirect route. Not fixed in
  code on this branch; the new teaching guide states "five of the seven...
  two can reach it indirectly" instead of repeating the stale figure.
- **Stale tool-side claim, `06-discourse-subject-position-lab` (Full),
  `index.html` (two places) and the old `teaching-notes.md` (which already
  self-contradicted).** All state "none of the five accounts mentions" the
  halved hours. `ACCOUNTS.advocacy.text` and the code's own `mentionsCut`
  logic confirm the advocacy bulletin does mention it. Not fixed in code on
  this branch; the new guide states "only the advocacy bulletin mentions
  it... the other four genres have no field for it." The new guide also
  adds an epistemic caveat, that these are authored readings of an invented
  case and a well-argued alternative reading deserves credit, which the
  Simplified edition's existing materials already carry but the Full
  edition currently lacks anywhere in its learner-facing text.
- **Stale walkthrough claim, `09-crowd-deindividuation-vs-esim`
  (Simplified), old `teaching-notes.md`.** The old guide's walkthrough
  implied the "Show two afternoons with the same index" comparison feature
  would display the specific "common" and "fragmented" scenarios the
  student had just run. The code's `compare()`/`MATCHED` logic always shows
  a fixed pair, "differentiated" against "restraint," both anonymous, whose
  index values happen to match. Not fixed in code on this branch; the new
  guide describes the comparison generically ("two runs that share an
  identical disinhibition index but very different concentration") rather
  than repeating the implication that it replays whichever scenarios were
  just run.
- **Live learner-facing defect, `12-person-or-setting-workplace-lab`
  (Full), `tool.js` and the exported `standalone.html`. NOT RESOLVED ON
  THIS BRANCH.** An off-by-one round-counter check (`exp1.round === 2`
  against `ROUND_TITLES`/`ROUND_FEEDBACK` arrays that are only two entries
  long) causes an "undefined" round heading followed by an uncaught
  TypeError once a learner reaches what should be a documented two-round
  design's end state, which then prevents the closing pedagogical summary
  from ever rendering. This reproduces in the live `index.html`/`tool.js`
  and in the exported `standalone.html` alike. Per the task's instructions,
  this was not fixed on this teaching-notes branch; the new guide describes
  only the documented, working two-round design, matching the parts of the
  old teaching notes that were already accurate, and this item is flagged
  here for a separate, tightly scoped follow-up PR in the same pattern as
  the Neuropsychology rollout's `fix-neuropsychology-live-qa` follow-up.
- **Metadata inconsistency, `12-person-or-setting-workplace-lab` (Full),
  `metadata.json`.** `simulationNotes` describes an old pair-bonus/leaver
  formula model with figures of 50 and 35, alongside text stating that same
  mechanic is "gone." The actual, current figures are 53 and 40, with no
  bonuses, which is what the new guide uses and what the old
  `teaching-notes.md` already correctly stated. Not fixed on this branch.
- **Minor imprecision, `12-person-or-setting-workplace-lab` (Simplified),
  `tool.js`/`index.html`.** The comparison team is described as scoring
  "less than half" of the reference team; the actual figures (38 against a
  true half of 37) make this imprecise rather than wrong. Not fixed on this
  branch; the new guide avoids citing the specific fraction, describing the
  comparison team generically as scoring "much lower."

No discrepancies were found for `01-epistemology-lens-switch` (either
edition), `02-constructing-a-category` (either edition),
`03-attitude-behaviour-gap` (either edition),
`04-conformity-under-context` (either edition),
`07-sherif-norm-formation-lab` (either edition),
`09-crowd-deindividuation-vs-esim` (Full),
`10-power-lens-lukes-foucault-fricker` (either edition), or
`11-measuring-prejudice-instrument-lab` (either edition): every number and
claim checked against the executing code matched.

## Cross-file AI-tell patterns found and rewritten

A first pass drafted each guide for accuracy against its own research brief.
A second, side-by-side read across all 23, plus targeted greps for the
Social/Critical-specific stock phrases named in the brief ("context
matters," "nothing is neutral," "this reveals how," "this highlights the
role of," "foregrounds," "problematizes," "invites us to question," "a more
nuanced picture," "a useful reminder that," "the lens changes what we see"),
found none of those phrases present in any of the 23 drafts. One genuine
cross-file template was found and fixed:

- **"[X] alone makes/make the point in about N minutes. [Y] run(s) to about
  M" closed 9 of the 11 Full guides' "Use in class / timing" sections**
  (the remaining two used a close variant of the same construction), the
  same family the Neuropsychology review documents fixing once already.
  All 11 were rewritten into distinct constructions, alternating whether
  the minute figure or the activity description opens the sentence and how
  the second sentence is connected ("Add X, and the session grows/runs/
  extends/pushes to about M"), while every minute figure was left
  unchanged. The Simplified guides' timing sentences already varied their
  opening noun phrase from file to file and did not need the same fix.

"Power is everywhere" appears in three files (Power Lens Laboratory, Full
and Simplified, and once in each guide's caution section), but in every
instance it is the phrase being warned against, not a description offered
in the guide's own voice; this is the accuracy rule in the brief being
enforced, not a stock filler phrase, so it was left as written. "None
needed" opens 9 of the 12 Simplified "Before students start" sections; each
instance is followed by a different, concrete second sentence naming what
is already visible on load, and it states a genuine shared fact (these
particular tools require no pre-briefing), so it was left as an accurate
description rather than treated as a template requiring diversification.

Zero em dashes were found across all 23 final guides. After the fix above,
all 23 guides were re-read against "does this sound like an experienced
lecturer briefing another lecturer in about a minute, while remaining
careful about the mainstream/critical and epistemology distinctions the
module turns on, rather than an LLM summarising a critical psychology
textbook?" No module-generic hedging sentences ("the picture is more
complicated than it first appears," "this reminds us that context shapes
everything") were found in any draft; every caution in the batch names the
specific distinction it protects (a coherence floor, a level of measurement,
a withheld theorist's name, a rota applied to everyone regardless of an
individual's score) rather than gesturing at complexity in general.

## Politically and normatively sensitive wording

Two areas received deliberate narrowing, per the brief's instruction to keep
descriptive findings and normative claims separate and to avoid unwarranted
political conclusions:

- **Crowd Behaviour Laboratory** describes the modelled relationship
  between a shared category, anonymity and where action concentrates
  without any claim about real policing operations or current events; the
  "before students start" line states plainly that the fictional bridge
  location, incident and policing operation are entirely invented.
- **Minimal Group / Positive Distinctiveness (Simplified)** keeps the Full
  guide's explicit limit on what the paradigm shows: differential
  allocation without any prior hostility, competition or group history is
  sufficient in this stripped-down setting to produce favouritism, which is
  a narrower claim than saying the paradigm explains real prejudice,
  racism, discrimination or conflict, and the guide states that limit
  directly rather than leaving it implied.

## What this rollout does not do

No Cognitive, Research Methods, Neuropsychology, or Personality and
Individual Differences file was touched. No `metadata.json` schema changed.
No activity code changed on this branch: the discrepancies above, including
the `12-person-or-setting-workplace-lab` (Full) round-counter crash, are
reported here, not fixed. That defect, being genuinely learner-facing, is
the leading candidate for a separate, tightly scoped follow-up PR in the
same pattern as the Neuropsychology rollout's `fix-neuropsychology-live-qa`
follow-up; the `metadata.json` inconsistency in the same tool and the minor
"less than half" imprecision in its Simplified twin are lower-priority
candidates for the same follow-up. This document does not authorise scaling
to Personality and Individual Differences; that decision follows review of
this batch.
