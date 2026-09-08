# Concise teaching-guide rollout: Social and Critical Psychology

Date: 2026-09-08. Status: **awaiting independent review before merge; four
learner-facing defects and one self-contradictory metadata file found
during research, all left unfixed on this branch and flagged below for a
separate follow-up PR; two pre-merge correction passes applied seven
wording and classification fixes to this batch's own guides and review
document (see "Pre-merge correction pass" below).** Fourth module-sized
pass, after
Cognitive Psychology
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
| Attitude-Behaviour Gap | 2,123 | 384 | 82% |
| Conformity Under Context | 1,801 | 313 | 83% |
| Self Through Different Lenses | 1,806 | 347 | 81% |
| Discourse and Subject Position Lab | 1,715 | 328 | 81% |
| Sherif Norm-Formation Laboratory | 1,628 | 308 | 81% |
| Crowd Behaviour Laboratory (Deindividuation vs ESIM) | 2,326 | 312 | 87% |
| Power Lens Laboratory | 2,296 | 361 | 84% |
| Measuring Prejudice: Instrument Lab | 2,526 | 319 | 87% |
| Person or Setting: Workplace Lab | 2,325 | 351 | 85% |
| **Full total (11 files)** | **23,363** | **3,703** | **84%** |

### Simplified edition (12)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Epistemology Lens Switch | 924 | 309 | 67% |
| Constructing a Category | 1,005 | 263 | 74% |
| Attitude-Behaviour Gap | 943 | 280 | 70% |
| Conformity Under Context | 900 | 249 | 72% |
| Self Through Different Lenses | 903 | 244 | 73% |
| Discourse and Subject Position Lab | 952 | 245 | 74% |
| Sherif Norm-Formation Laboratory | 1,524 | 259 | 83% |
| Minimal Group / Positive Distinctiveness | 926 | 329 | 64% |
| Crowd Behaviour Laboratory (Deindividuation vs ESIM) | 890 | 272 | 69% |
| Power Lens Laboratory | 1,247 | 264 | 79% |
| Measuring Prejudice: Instrument Lab | 910 | 229 | 75% |
| Person or Setting: Workplace Lab | 846 | 257 | 70% |
| **Simplified total (12 files)** | **11,970** | **3,200** | **73%** |

**Grand total (23 files): 35,333 to 6,903 words, an 80% reduction.** These
figures already include both correction passes below: five files' counts
moved when a false or contradictory claim was corrected (Attitude-
Behaviour Gap, Full and Simplified; Minimal Group, Simplified, whose
caution grew most, from 295 to 329 words, in exchange for stating the
approved necessity-not-sufficiency standard precisely rather than the
shorter, overclaiming version), eight further Simplified files' counts
moved by a handful of words each when their "Before students start"
sentence was rewritten out of the "None needed" template, and
Attitude-Behaviour Gap (Simplified) gained ten words in a second pass when
its "nearly triples his rate" wording was replaced with the same 4-to-24
figure the rest of the guide already used. New guides range from 229 to
384 words. Every one of the 23 still sits well under the 450-word
check-in point named in the brief, so nothing required justification for
length; the longest, Attitude-Behaviour Gap (Full) at
384, grew past the previous longest (Power Lens Laboratory at 361) only
because of the correction pass's added precision about opportunity acting
as a multiplicative gate rather than because anything was padded.

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
  research brief's independently recomputed figure, no framework treating
  it as central, five with no concept for it at all, and two reaching it
  only indirectly, was substituted.
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

An independent pre-merge review re-examined these entries and found that
two of them were originally under-classified: both are visible in the
tool's own learner-facing text, not only in a code comment or metadata
field, and both are corrected here.

- **Live learner-facing defect, `05-self-through-different-lenses` (Full),
  `tool.js`'s CLAIMS-challenge feedback text and `index.html`'s "What is
  left over" section (both shown to the learner), plus a matching stale
  comment in `tool.js` and a matching stale sentence in `metadata.json`'s
  `simulationNotes`. NOT RESOLVED ON THIS BRANCH.** All state that the
  fee-rise/hours-cut statement is "no concept for it" in six of the seven
  frameworks and reachable, indirectly, by only the seventh. The tool's
  own `LENSES[*].coding[8]` data instead gives: no framework treats it as
  central; five ("self-schema," "social comparison," "self-discrepancy,"
  "self-efficacy," "social identity") have no concept for it at all; two
  ("possible selves," "relational and contextual") can reach it only
  indirectly. The CLAIMS-challenge "why" text compounds this by naming only
  one framework ("a change in how believable a future self is") when two
  actually qualify. Not fixed in code on this branch; the new teaching
  guide states the correct figure, "five of the seven... have no concept
  for it at all... the other two can reach it indirectly," instead of
  repeating the stale six-and-one figure. Flagged below for the Social and
  Critical Psychology live-QA follow-up.
- **Live learner-facing defect, `06-discourse-subject-position-lab` (Full),
  `index.html` (two places, both in learner-facing body text) and the old
  `teaching-notes.md` (which already self-contradicted). NOT RESOLVED ON
  THIS BRANCH.** All state "none of the five accounts mentions" the halved
  hours. `ACCOUNTS.advocacy.text` and the code's own `mentionsCut` logic
  confirm the advocacy bulletin's own text opens by stating the council
  halved the programme hours. Not fixed in code on this branch; the new
  guide states "only the advocacy bulletin mentions it... the other four
  genres have no field for it." The new guide also adds an epistemic
  caveat, that these are authored readings of an invented case and a
  well-argued alternative reading deserves credit, which the Simplified
  edition's existing materials already carry but the Full edition
  currently lacks anywhere in its learner-facing text. Flagged below for
  the live-QA follow-up.
- **Stale walkthrough claim, `09-crowd-deindividuation-vs-esim`
  (Simplified), old `teaching-notes.md` only (not the tool's own
  learner-facing text).** The old guide's walkthrough implied the "Show two
  afternoons with the same index" comparison feature would display the
  specific "common" and "fragmented" scenarios the student had just run.
  The code's `compare()`/`MATCHED` logic always shows a fixed pair,
  "differentiated" against "restraint," both anonymous, whose index values
  happen to match. Not fixed on this branch; the new guide describes the
  comparison generically ("two runs that share an identical disinhibition
  index but very different concentration") rather than repeating the
  implication that it replays whichever scenarios were just run. Left out
  of the live-QA follow-up queue since the defect is confined to the
  superseded teaching notes, not to anything the tool itself displays.
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
  old teaching notes that were already accurate. Flagged below for the
  live-QA follow-up.
- **Metadata inconsistency, `12-person-or-setting-workplace-lab` (Full),
  `metadata.json`.** `simulationNotes` describes an old pair-bonus/leaver
  formula model with figures of 50 and 35, alongside text stating that same
  mechanic is "gone." The actual, current figures are 53 and 40, with no
  bonuses (confirmed against `tool.js`'s own constants), which is what the
  new guide uses and what the old `teaching-notes.md` already correctly
  stated. Not learner-facing (the field is not rendered in the UI). Not
  fixed on this branch; kept in the follow-up queue as a metadata cleanup
  alongside the same tool's crash fix, but not counted among the
  learner-facing defects below.
- **Live learner-facing defect, `12-person-or-setting-workplace-lab`
  (Simplified), `index.html` and `activity.js` (both places the sentence
  appears, in the challenge statement and again in the round-2 feedback).
  NOT RESOLVED ON THIS BRANCH.** Both state the comparison team's mean
  exhaustion score is "less than half" the reference team's. The Full
  edition's own constants for the same fictional scenario are
  `COMPARISON_TEAM = 38` against `START_EXHAUSTION = 74`; half of 74 is 37,
  so 38 is slightly more than half, not less. The Simplified edition
  carries no numeric constants of its own, only this narrative sentence, so
  the wording itself is the defect. Originally logged in this review as a
  "minor imprecision" and left uncorrected in the new guide's prose; an
  independent pre-merge review judged this too generous, since the
  sentence is wrong in the direction it claims (the true relationship is
  "close to half," not "less than half"), and it sits directly on the
  learner-facing page and in the round-2 feedback text, not only in
  metadata. The new guide avoids the false comparison, describing the
  comparison team generically as scoring "much lower," but the tool's own
  text is unchanged. Flagged below for the live-QA follow-up.

### Social and Critical Psychology live-QA follow-up queue

Following the same pattern as the Neuropsychology rollout's
`fix-neuropsychology-live-qa` follow-up, four learner-facing defects found
during this rollout's research are queued for a separate, tightly scoped
follow-up PR rather than fixed here:

1. `05-self-through-different-lenses` (Full): the wrong statement-8
   framework count, in `tool.js`'s CLAIMS-challenge feedback,
   `index.html`'s "What is left over" section, a `tool.js` header comment,
   and `metadata.json`'s `simulationNotes`.
2. `06-discourse-subject-position-lab` (Full): the false "none of the five
   accounts mentions" the hours cut, in `index.html` (two places).
3. `12-person-or-setting-workplace-lab` (Full): the off-by-one
   round-counter crash in `tool.js` and `standalone.html`.
4. `12-person-or-setting-workplace-lab` (Simplified): the "38 is less than
   half of 74" wording in `index.html` and `activity.js`.

The same tool's stale 50/35 `metadata.json` figures (item 3's tool) are
carried in the same follow-up as an additional, non-learner-facing metadata
cleanup, not as a fifth defect.

No discrepancies were found for `01-epistemology-lens-switch` (either
edition), `02-constructing-a-category` (either edition),
`03-attitude-behaviour-gap` (Full),
`04-conformity-under-context` (either edition),
`07-sherif-norm-formation-lab` (either edition),
`09-crowd-deindividuation-vs-esim` (Full),
`10-power-lens-lukes-foucault-fricker` (either edition), or
`11-measuring-prejudice-instrument-lab` (either edition): every number and
claim checked against the executing code matched. `03-attitude-behaviour-gap`
(Simplified) was originally placed in this clean list too; a later pass
found the guide's own "nearly triples his rate" did not match the 4-to-24
figure the same guide, and the code, both give for that same manipulation
(see item 7 under "Pre-merge correction pass" below), so it no longer
belongs here.

## Cross-file AI-tell patterns found and rewritten

A first pass drafted each guide for accuracy against its own research brief.
A second, side-by-side read across all 23, plus targeted greps for the
Social/Critical-specific stock phrases named in the brief ("context
matters," "nothing is neutral," "this reveals how," "this highlights the
role of," "foregrounds," "problematizes," "invites us to question," "a more
nuanced picture," "a useful reminder that," "the lens changes what we see"),
found none of those phrases present in any of the 23 drafts. This section
originally reported one genuine cross-file template found and fixed at that
stage, and judged a second candidate pattern acceptable as written. A
pre-merge independent review re-checked that judgement and found it wrong:
the second pattern was a real batch-level tell that the first pass missed.
Both are recorded here, candidly, as two separate findings rather than one:

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
- **"None needed." opened 9 of the 12 Simplified "Before students start"
  sections**, an identical three-word sentence repeated across three
  quarters of the Simplified batch. The first AI-tell pass judged this
  acceptable because each instance was followed by a different, concrete
  second sentence and the underlying fact (no pre-briefing required) is
  genuinely true for all nine tools; independent pre-merge review judged
  that reasoning too generous, since a literal, identical three-word
  opening repeated nine times is exactly the kind of collection-level tell
  the brief asks this pass to catch, regardless of what follows it. All
  nine were rewritten so the section states the concrete orientation fact
  directly (what is visible on load, what stays the same across editions,
  what doubles as the prediction) rather than opening with a boilerplate
  verdict before the fact; two rewrites explicitly cross-reference the Full
  edition's own withheld-name and timing differences, since that is
  genuinely useful orientation for a lecturer running both editions, not
  filler added to manufacture variety. `01-epistemology-lens-switch`,
  `07-sherif-norm-formation-lab` and `08-minimal-group-positive-distinctiveness`
  already opened their Simplified "Before students start" sections with a
  substantive, tool-specific sentence and needed no change.

"Power is everywhere" appears in three files (Power Lens Laboratory, Full
and Simplified, and once in each guide's caution section), but in every
instance it is the phrase being warned against, not a description offered
in the guide's own voice; this is the accuracy rule in the brief being
enforced, not a stock filler phrase, and this judgement was rechecked at
the same time as the "None needed" one above and left standing.

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
  allocation appeared here with no prior hostility, no competition and no
  group history at all, so none of those three is necessary to produce the
  effect in this stripped-down setting. That is narrower than, and not the
  same claim as, saying categorising people is a sufficient cause of real
  prejudice, racism, discrimination or conflict. An earlier draft of the
  Simplified caution stated the stronger, unsupported sufficiency version
  ("categorising people is enough to produce differential allocation");
  independent pre-merge review caught this exceeding the approved Full
  guide's own standard, and it was corrected in this pass (see "Pre-merge
  correction pass" below).

## Pre-merge correction pass

Before merge, independent review re-read all 23 final guides and this
review document against the tools' actual behaviour and against the
brief's accuracy rules. The pre-merge review found seven guide/batch
issues in total (numbered below), alongside the separate Tool 05
arithmetic correction folded into the sections above. All seven are fixed
on this branch, across two commits; none required a code change. This
section says plainly what earlier passes missed, rather than presenting
the original submission as though it had already caught everything.

1. **`05-self-through-different-lenses` (Full), timing wording implying
   four is the complete set.** "Bring in all four lenses" in "Use in
   class / timing" read as though the activity has only four frameworks,
   when it has seven and the synthesis merely unlocks after four are
   applied. Reworded to "Apply four contrasting lenses with the synthesis
   and challenge."
2. **`03-attitude-behaviour-gap` (Full), false "necessary" claim.** The
   caution stated attitude "is necessary without being sufficient." The
   model is `p = logistic(B0 + attitude + norm + control + habit -
   constraint) * opportunity`; with attitude at zero, norm, control and
   habit can still produce a nonzero estimate, so attitude is not
   necessary. Opportunity is the genuine gate, since it multiplies the
   whole probability rather than adding to it. Reworded to keep the true,
   useful point (attitude carries the model's largest single coefficient)
   without the false necessity claim.
3. **`03-attitude-behaviour-gap` (Simplified), wrong "lowest-scoring"
   wording.** All four colleagues share the identical attitude score,
   0.86; "the lowest-scoring colleague" in "What to look for" misdescribed
   which quantity varies between them. Reworded to "the lowest-frequency
   colleague," which is what actually differs.
4. **`10-power-lens-lukes-foucault-fricker` (Simplified), debrief
   contradicting the activity's own Fricker lens.** The debrief asked what
   a hypothetical fourth lens "covering how colleagues judge each other's
   credibility day to day" would add, but the activity's third lens,
   Fricker ("Who is believed, and what can be said"), already covers
   exactly that, and the guide's own "What to look for" names a colleague
   not being believed as that lens's strongest item. Replaced with a
   question grounded in an actual feature of the activity: item 5, the
   missing category, is coded "also relevant" for both Foucault and
   Fricker in the tool's own data, without being either lens's strongest
   evidence, so the new debrief asks why that overlap does not make the
   two lenses interchangeable.
5. **`08-minimal-group-positive-distinctiveness` (Simplified), sufficiency
   overclaim.** The caution stated "categorising people is enough to
   produce differential allocation in this stripped-down setting," a
   sufficiency claim stronger than the approved Full guide's own standard
   and stronger than the interactive establishes. Reworded to the Full
   guide's own framing: differential allocation appeared here with no
   prior hostility, no competition and no group history at all, so none
   of those three is necessary to produce the effect in this stripped-down
   setting, which is not the same as showing categorisation is a
   sufficient cause of real-world intergroup behaviour.
6. **Second cross-file AI-tell pattern, "None needed."** opening 9 of the
   12 Simplified "Before students start" sections. Covered in full under
   "Cross-file AI-tell patterns found and rewritten" above; all nine were
   rewritten to state the concrete orientation fact directly.
7. **`03-attitude-behaviour-gap` (Simplified), wrong ratio wording,
   caught in a second, later pass over this same branch.** "What it
   teaches" stated that giving Marek another colleague's opportunity
   "nearly triples his rate." The guide's own later sections already
   correctly report the change as about 4 to about 24 meetings out of
   30, roughly a sixfold increase, not a near-tripling. Reworded to state
   the same 4-to-24 figure directly ("takes his predicted count from
   about 4 to about 24 meetings out of 30") instead of a ratio, removing
   the inconsistency rather than replacing one ratio with another. This
   guide had previously been listed below as one with no discrepancies
   found; that listing was wrong and is corrected in the same section.

Also reclassified during this pass, with no wording change to the guides
themselves: Tool 05 Full's stale framework count and Tool 06 Full's stale
"none of five" claim were promoted from a generic "stale tool-side claim"
to an explicit "live learner-facing defect," and Tool 12 Simplified's
"less than half" wording was promoted from "minor imprecision" to the same
live-QA follow-up queue, since all three sit in text the tool itself shows
to the learner, not only in a code comment or a metadata field. See
"Cross-source accuracy audit and content discrepancies found" above for
the corrected entries and the resulting four-item follow-up queue.

Corrections 2 through 5 changed four word counts by a handful of words
each; correction 6 changed all nine affected Simplified word counts by
small, mostly negative amounts. The word-count tables above already
reflect the corrected, current text.

## What this rollout does not do

No Cognitive, Research Methods, Neuropsychology, or Personality and
Individual Differences file was touched. No `metadata.json` schema changed.
No activity code changed on this branch, including in this correction
pass: every discrepancy above, including the `12-person-or-setting-
workplace-lab` (Full) round-counter crash, is reported here, not fixed.
Four learner-facing defects are queued for a separate, tightly scoped
follow-up PR in the same pattern as the Neuropsychology rollout's
`fix-neuropsychology-live-qa` follow-up: `05-self-through-different-lenses`
(Full)'s wrong statement-8 framework count, `06-discourse-subject-
position-lab` (Full)'s false "none of the five accounts mentions" copy,
`12-person-or-setting-workplace-lab` (Full)'s round-counter crash, and
`12-person-or-setting-workplace-lab` (Simplified)'s "38 is less than half
of 74" wording. The same Tool 12 (Full)'s stale 50/35 `metadata.json`
figures are carried in the same follow-up as a non-learner-facing metadata
cleanup, not as a fifth defect. This document does not authorise scaling
to Personality and Individual Differences; that decision follows review of
this batch.
