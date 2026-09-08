# Concise teaching-guide rollout: Neuropsychology

Date: 2026-09-08. Status: **rollout batch complete; pre-merge correction
pass applied on independent review, still awaiting merge**.
Third module-sized pass, after Cognitive Psychology
(`docs/product/concise-teaching-guide-cognitive-rollout-review.md`) and
Research Methods
(`docs/product/concise-teaching-guide-research-methods-rollout-review.md`).
It rewrites every remaining Neuropsychology teaching guide, Full and
Simplified, into the approved seven-section format. No other module was
touched, and no activity code was touched.

## Files changed

23 `teaching-notes.md` files, all under `modules/neuropsychology/tools/`
or `simplified/modules/neuropsychology/tools/`, plus this document.

**Full edition (11 of 12; `01-double-dissociation-detective` already
approved in the five-guide pilot and left untouched):**
`02-lesion-symptom-inference-trap`, `03-network-disconnection-mapper`,
`04-visual-neglect-line-bisection`, `05-visual-field-defect-mapper`,
`06-memory-systems-amnesia-detective`, `07-aphasia-profile-comparator`,
`08-executive-function-task-laboratory`,
`09-hemispheric-lateralisation-split-brain`,
`10-face-recognition-prosopagnosia-detective`,
`11-neuropsych-assessment-battery-builder`,
`12-recovery-plasticity-simulator`.

**Simplified edition (all 12, including
`01-double-dissociation-detective`'s Simplified twin, which had not yet
been rewritten):** the same 11 slugs as the Full list above, plus
`01-double-dissociation-detective`.

`git diff origin/main -- modules/neuropsychology/tools/01-double-dissociation-detective/teaching-notes.md`
is empty, confirming the approved Full Double Dissociation Detective
guide was not touched.

## Word counts

### Full edition (11 rewritten; `01` excluded, unchanged)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Lesion-Symptom Inference Trap | 1,793 | 408 | 77% |
| Network Disconnection Mapper | 2,026 | 362 | 82% |
| Visual Neglect Laboratory | 2,021 | 386 | 81% |
| Visual Field Defect Mapper | 1,746 | 354 | 80% |
| Memory Systems Detective | 2,237 | 355 | 84% |
| Aphasia Profile Comparator | 1,819 | 353 | 81% |
| Executive Function Task Laboratory | 2,711 | 356 | 87% |
| Split-Brain Laboratory | 2,645 | 409 | 85% |
| Face Recognition Detective | 2,359 | 350 | 85% |
| Assessment Battery Builder | 2,469 | 325 | 87% |
| Recovery and Plasticity Simulator | 2,406 | 347 | 86% |
| **Full total (11 files)** | **24,232** | **4,005** | **83%** |

### Simplified edition (12)

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Double Dissociation Detective | 1,342 | 339 | 75% |
| Lesion-Symptom Inference Trap | 729 | 321 | 56% |
| Network Disconnection Mapper | 794 | 319 | 60% |
| Visual Neglect Laboratory | 810 | 268 | 67% |
| Visual Field Defect Mapper | 766 | 275 | 64% |
| Memory Systems Detective | 724 | 292 | 60% |
| Aphasia Profile Comparator | 735 | 240 | 67% |
| Executive Function Task Laboratory | 755 | 303 | 60% |
| Split-Brain Laboratory | 705 | 255 | 64% |
| Face Recognition Detective | 706 | 228 | 68% |
| Assessment Battery Builder | 747 | 240 | 68% |
| Recovery and Plasticity Simulator | 781 | 298 | 62% |
| **Simplified total (12 files)** | **9,594** | **3,378** | **65%** |

**Grand total (23 files): 33,826 to 7,383 words, a 78% reduction.**
New guides range from 228 to 409 words. Every Full guide sits under the
450-word check-in point; the longest, Split-Brain Laboratory at 409,
carries two genuinely separate experiments (a routing-based trial
builder, and a five-condition dependency check on the classic result)
and was inspected for detail that belonged elsewhere before being left
at that length. Nothing was moved out to metadata or trimmed further
without losing one of the two experiments. Simplified guides run
noticeably shorter than the Full/Simplified ratio in the two earlier
rollouts (65% reduction against 77% for Cognitive, 77% for Research
Methods): the pre-existing Neuropsychology Simplified notes were
already comparatively short (705 to 1,342 words, none of the
1,000-to-2,100-word range typical of the other two modules' Simplified
notes), so there was less structural padding to remove.

## Source-of-truth workflow

Every Full/Simplified pair was researched against its own `index.html`,
its executing `tool.js` or `activity.js`, its `metadata.json`, and its
existing `teaching-notes.md`, treating the executing code and the
learner-facing interface as the source of truth over any of the three
documentation sources. For several pairs this meant independently
re-deriving the tool's own numbers (z-scores, gap computations, ceiling
sequences, predicted field-loss patterns, gain-share percentages) from
the raw constants and formulas in the code, rather than trusting a
number already printed in the old notes or in `metadata.json`. Every
number that survived into a new guide was checked this way before being
written.

## Neuropsychological caveats deliberately retained

A sample across the batch, one per accuracy area named in the brief:

- **Lesion and localisation.** Lesion-Symptom Inference Trap keeps its
  central distinction between a lesion showing tissue was *necessary*
  for a task in one person, at one time, and a general claim about what
  a region *does*; the new guide states this as the ceiling that falls
  from 50 to 12 across six complications while the specific-necessity
  claim never moves. Network Disconnection Mapper keeps the point that
  three different single failures, two regions and the pathway between
  them, produce one indistinguishable profile, computed live by the
  tool rather than asserted by the guide.
- **Neglect versus field loss.** Visual Neglect Laboratory's guide
  states the opposite-direction bisection error and the fact that a
  page-search prompt improves neglect profiles but does nothing for
  field loss, since field loss has nothing to do with attention. The
  Simplified twin's own model has both fictional patients bisecting in
  the *same* direction, on purpose, so its guide correctly says
  bisection cannot separate them here and cancellation is what does,
  rather than reusing the Full edition's opposite-direction claim,
  which would misdescribe the Simplified activity.
- **Hemispheric lateralisation.** Split-Brain Laboratory's guide states
  plainly that only three of six sectioned field-and-response
  combinations succeed, and frames left-brained/right-brained talk as
  extending a narrow finding about a handful of surgically disconnected
  people into a false claim about connected brains. Its Simplified twin
  keeps the same standard applied to its own, different mechanic:
  lengthening exposure alone, with the callosum still cut, flips a
  failing trial to a successful one.
- **Aphasia as prototypes.** Aphasia Profile Comparator's guide states
  that classical categories are prototypes with three known problems, a
  minority of people fit none of them, the same label covers different
  profiles, and the anatomical claims attached to them are looser than
  the diagrams suggest, and that no syndrome name appears anywhere in
  the activity.
- **Memory systems.** Memory Systems Detective's guide states the
  narrower, correct claim, that a profile shows two tasks "do not
  depend on all the same things," rather than the stronger and
  unsupported "separate systems," matching exactly what the tool's own
  opening-question feedback corrects.
- **Executive function and task impurity.** Executive Function Task
  Laboratory's guide preserves the tool's own weight-matrix finding
  that no task loads on fewer than five of six capacities, and that
  reduced processing speed alone can reproduce the same lowest-scoring
  task as reduced inhibition alone.
- **Face recognition.** Face Recognition Detective's guide keeps face
  perception and general visual processing as two steps that produce
  identical face-task profiles, distinguishable only by a matched-
  difficulty control task, rather than collapsing recognition into one
  brain area or one step.
- **Assessment.** Assessment Battery Builder's guide keeps test
  performance, impairment inference and diagnosis distinct throughout,
  built around the closing challenge's point that "indicating" is the
  word doing the damage when a single score is read as a memory
  impairment.
- **Recovery and plasticity.** Recovery and Plasticity Simulator's
  guide states that recovery ceilings shrink with injury severity, so
  even a maximal rehabilitation setting cannot return a severe injury
  to its starting level, and that a rising trained-task score is not
  evidence a specific programme worked without an untreated comparison.

## Internal-consistency audit

Every one of the 23 drafts was read a second time as an argument,
checking: absolute words (never, always, only, cannot, proves, rules
out) against the surrounding evidence; localisation claims against any
network or disconnection caution stated nearby; patient or profile
descriptions against later sections; and simulated or fictional
material against wording that could imply real clinical data. Every
absolute word found was checked against its immediate context and
turned out to be either a hedged, narrowly scoped claim ("not always,"
"rules out one specific rival") or a definitionally true statement
about how the tool is built.

One redundancy was caught and fixed during this pass, not a
contradiction but a duplication: the first draft of the Simplified
Assessment Battery Builder guide made the same point twice, once in
"What it teaches" and again, in only slightly different words, in
"What to look for." "What to look for" was rewritten to describe the
concrete, observable fact (two batteries covering the same number of
questions can read very differently in the final report) rather than
restating the lesson already given above it.

This section originally went on to say that no genuine internal
contradiction was found in the batch. That was wrong, and it can no
longer say that. An independent review, done specifically to re-check
this batch before merge, caught one: the Simplified Executive Function
Task Laboratory guide's "What to look for" correctly stated that the
"find me a different person" search can sometimes report that no
usefully different profile exists, near the top or bottom of a
capacity's range, but its "Debrief" then asked a question that only
made sense on the assumption a twin had been found ("given that the
search just found a very different profile with the same score"). The
two sections described mutually exclusive outcomes of the same
control as though only one of them ever happened. The debrief was
rewritten to branch on both outcomes explicitly (what a found twin
hides, and what a failed search says about remaining room to trade
off), so it now works whichever way the search actually goes. See
"Pre-merge correction pass" below for the other five issues this same
independent review caught, none of which were internal contradictions.

Beyond that one case, no further instance was found of an activity
stated as never producing some outcome while the same guide reports it
happening, or a localisation claim contradicted by a nearby network
caution. This audit's scope is the 23 guides drafted in this batch; the
Full Double Dissociation Detective guide was not re-audited, since it
is unchanged from its already-reviewed pilot version.

## Cross-source accuracy audit and content discrepancies found

None required a code fix in this branch; all are documentation-only
observations, flagged here rather than silently fixed, and classified
per the brief.

- **Live learner-facing defect, `06-memory-systems-amnesia-detective`
  (Full), `index.html`.** A screen-reader-exposed figcaption
  (`visually-hidden`, not `aria-hidden`) reads "Seven memory measures,"
  but the tool implements exactly six, and the page's own debrief
  panel elsewhere correctly says "Six measures is very few." The old
  teaching notes repeated the wrong count ("Seven measures is very
  few"). This is genuinely learner-facing for screen-reader users and
  needs a separate `index.html` fix; the new guide does not state a
  measure count at all, so it does not repeat the error.
- **Live learner-facing conceptual overclaim,
  `06-memory-systems-amnesia-detective` (Simplified), `activity.js`.**
  Caught by the same independent review that found the internal
  contradiction above, while checking the guide's opening claim
  against the code that actually judges it. The executing activity's
  own answer-key comment reasons in deterministic terms: it states
  that a shared system "cannot produce" a crossed preserved-and-lost
  pattern, and marks a profile as counting against the one-system
  claim on that basis. That is the same overclaim the first draft of
  this guide had repeated, a crossed profile counts against a simple
  shared-resource account; it does not prove two separate biological
  memory systems and does not rule out every possible single-system
  model. The new guide states the narrower claim (see "Pre-merge
  correction pass" below); the code's own "cannot produce" reasoning is
  unchanged and needs a separate `activity.js` fix.
- **Live learner-facing defect and stale documentation (four places),
  `10-face-recognition-prosopagnosia-detective` (Simplified),
  `index.html`, `activity.js`, `metadata.json`, old
  `teaching-notes.md`.** All four claim the Full edition "adds a sixth
  component, covert recognition." The Full edition's `tool.js` has no
  component called covert recognition anywhere; its sixth component,
  absent from the Simplified edition, is voice recognition, a whole
  second input route, not an extra step in the face route. The
  Simplified edition's own extra step, reading someone's expression,
  is also not present in the Full edition, so neither tool's
  documentation correctly describes the other. This sentence sits
  directly on the learner-facing Simplified page, so it needs a
  separate `index.html`/`activity.js`/`metadata.json` fix; the new
  guide does not repeat the covert-recognition claim.
- **Live UI / default-state mismatch,
  `09-hemispheric-lateralisation-split-brain` (Full), `tool.js`.** The
  corpus callosum control defaults to "sectioned," not "intact," on
  load and on reset, even though the disclosure that reveals it is
  titled "Cut the corpus callosum, and run the same trial again,"
  which implies the intended order is an intact trial first. A learner
  who never opens that disclosure runs every trial already sectioned.
  The new guide tells instructors to set the control to intact
  themselves before a first demonstration trial, working around the
  default rather than silently changing it; a future PR could instead
  change the default state to "intact" in `tool.js`.
- **Stale source-code comment (same tool), `tool.js`.** The header
  comment states "Twelve combinations; six succeed after a section,"
  but only three of the six sectioned field-and-channel combinations
  succeed (confirmed against the code's own `succeeds()` function and
  against `metadata.json` and the old teaching notes, both of which
  correctly say three). Not learner-facing; only an internal comment
  is wrong.
- **Metadata inconsistency (duration),
  `08-executive-function-task-laboratory`.** `metadata.json` gives
  `estimatedMinutes: 20`; the page's own hero text says "About 30
  minutes, in two experiments"; the old teaching notes gave a top tier
  of 45 minutes. The same three-way mismatch (`metadata.json` at 20,
  the page at "about 30") recurs in `12-recovery-plasticity-simulator`.
  Both new guides give a short-demonstration figure and a full-session
  figure consistent with the page and the old notes' upper tier,
  without trying to resolve which of the three existing numbers is
  canonical.
- **Metadata inconsistency (minor arithmetic),
  `11-neuropsych-assessment-battery-builder` (Simplified),
  `metadata.json`.** `simulationNotes` states the best achievable
  coverage is "seven of eight questions, using seventy minutes";
  recomputing the cheapest seven-task combination from the code's own
  task list gives 72 minutes, not 70. Not learner-facing (the figure
  does not appear in the UI or in the old teaching notes), and the new
  guide does not cite either number.
- **Stale source-code comment (same tool), `activity.js`.** The
  top-of-file comment states the session budget is "ninety minutes";
  the code two lines later sets `BUDGET = 80`, correctly matching
  `metadata.json` and the old teaching notes. Not learner-facing.
- **Harmless implementation detail, `04-visual-neglect-line-bisection`
  (Full), `tool.js`.** An `alloCued` data field is set on several
  profile objects but never read by the copying-task logic; it is
  vestigial from an earlier version and has no effect on anything
  displayed.
- **Documentation gap (not a code defect),
  `04-visual-neglect-line-bisection` (Simplified).** The Full edition
  explicitly cautions that neglect is more common and more persistent
  after right-hemisphere damage, not exclusive to it; the Simplified
  edition's fictional Patient A is introduced as "right-hemisphere
  stroke, left neglect" with no equivalent caveat anywhere in its
  existing materials. The new Simplified guide adds this caution
  directly ("Patient A's right-hemisphere stroke is the typical site
  for neglect, not the only one it can follow").
- **Historical note, not a live discrepancy,
  `07-aphasia-profile-comparator` (Simplified),
  `metadata.json`.** `simulationNotes` records that an earlier draft
  of the profile scores had no pairing that produced the tool's
  intended "instructive" case, and that the current scores were
  curated specifically to fix that; the current numbers were
  independently recomputed and do produce the intended case. Recorded
  here only because it reads like a defect on first sight; it is not
  one.

No discrepancies were found for `02-lesion-symptom-inference-trap`
(either edition), `03-network-disconnection-mapper` (either edition),
`05-visual-field-defect-mapper` (either edition),
`09-hemispheric-lateralisation-split-brain` (Simplified), or
`10-face-recognition-prosopagnosia-detective` (Full): every number and
claim checked against the executing code matched exactly.
`06-memory-systems-amnesia-detective` (Simplified),
`07-aphasia-profile-comparator` (Full),
`08-executive-function-task-laboratory` (Simplified), and
`11-neuropsych-assessment-battery-builder` (Full) were originally
placed in this clean list too; the pre-merge correction pass below
found a conceptual overclaim, an accuracy issue, an internal
inconsistency, and a deterministic-causal overclaim in those four
respectively, all in the guides' own wording rather than in a number
checked against code, so this list no longer includes them.

## Cross-file AI-tell patterns found and rewritten

A first pass drafted each guide for accuracy against its own research,
avoiding the phrase families already documented in the Cognitive and
Research Methods rollout reviews. A second, side-by-side read across
all 23 still found two patterns recurring, both variants of tells the
two earlier rollouts had already caught and fixed once:

- **"[X] makes the point in about N minutes. [Y] run(s) to about M
  minutes" closed most of the 11 Full guides' "Use in class / timing"
  sections**, and a near-identical "[gerund phrase] takes about N
  minutes" construction closed 11 of the 12 Simplified guides' timing
  sections, differing only in the activity-specific words. This is the
  same family the Research Methods review documents fixing once
  already ("[X] alone makes/make a N-minute demonstration"). Every one
  of the 22 timing sentences (all but the frozen Full guide) was
  rewritten into a distinct construction, alternating which number
  comes first, which verb introduces the activity, and how the second
  sentence is connected, while keeping every minute figure unchanged.
- **"Ask what/why ..." opened 22 of the 23 "Debrief" sections.** Eleven
  of the 22 were rewritten into direct questions ("What can a deficit
  on its own rule in or out...?", "Why can the same word... be picked
  out by one hand and not spoken?") or a different framing verb ("Put
  to the group what the four checks actually evaluate..."), so the
  section now splits roughly evenly between "Ask ..." and a direct
  question, rather than one construction opening every file.
- **"None needed." opened nine of the 12 Simplified "Before students
  start" sections**, the same family the Research Methods review
  documents fixing once already ("None needed. The tool opens
  [on/straight into/with]..."). Six of the nine were diversified into
  "Nothing to prepare," "No preparation is required," and "Nothing
  needs setting up," leaving four files using "None needed" itself
  (with different continuations in each) rather than one construction
  opening three quarters of the Simplified guides.
- **One leftover scripted-emphasis phrase**, "the one to watch," in
  the first draft of `02-lesion-symptom-inference-trap` (Full),
  matches the "the one to watch"/"the one that catches" family the
  pilot review already documents fixing once. Rewritten to "students
  often misread."

Zero em dashes were found across all 23 final guides. After the fixes
above, all 23 guides were re-read against "does this sound like an
experienced neuropsychology lecturer quickly briefing another
lecturer, while remaining scientifically careful, rather than an LLM
summarising a neuropsychology textbook?" No grand, module-generic
neuroscience statements ("the brain is a network, not a collection of
boxes," "this highlights the complexity of the brain," "the brain is
remarkably plastic," "the picture is more nuanced") were found in any
draft; every caution in the batch names the specific mechanism it
qualifies (a shrinking ceiling, a route through meaning, a control task
matched for difficulty) rather than gesturing at complexity in general.

## Pre-merge correction pass

Before merge, independent review re-read all 23 final guides at head
`cbe94b4554dca992569adc2b50083b7096166e23` against their tools' actual
behaviour and against each other, and found six issues. All six are
fixed on this branch; none required a code change.

1. **`06-memory-systems-amnesia-detective` (Simplified), separability
   overclaim.** "What it teaches" said the crossed profiles show the
   two abilities "do not run on one and the same system." Rewritten to
   the weaker, correct claim: the profiles count against a simple
   account in which both abilities depend on exactly the same
   resources in the same way, which is not the same as proving two
   separate biological memory systems or ruling out every possible
   single-system model. The later references to "the two-systems
   claim" and "stronger evidence for separate systems," in "What to
   look for" and "Common misconception / caution," were reworded to
   match ("the separability claim," "evidence that the two abilities
   are separable"). The executing `activity.js` contains the same
   overclaim in its own answer-key reasoning and is not touched here;
   see the new discrepancy entry above.
2. **`08-executive-function-task-laboratory` (Simplified), internal
   inconsistency.** Covered above under "Internal-consistency audit":
   the debrief assumed the "find me a different person" search always
   finds a twin, contradicting "What to look for"'s own note that it
   can fail. The debrief now asks a question for each outcome. Also
   replaced "the search proves this live" with "demonstrates this
   within the model," since it is an authored model, not proof about
   human executive architecture.
3. **`05-visual-field-defect-mapper` (Full), tract-versus-occipital
   wording.** "The optic tract and the occipital cortex give an
   anatomically identical pattern" overstated the tie: the code's two
   sites give the same loss in quadrant terms, but the occipital model
   additionally represents central sparing, which the guide's own next
   sentence already treats as a real, if inconclusive, distinguishing
   clue. Both occurrences ("What it teaches" and "What to look for")
   now say the two sites give "the same loss/pattern in quadrant
   terms" rather than an unqualified "anatomically identical" one. The
   Simplified twin, which has no macular-sparing concept at all, still
   correctly says its own tract and V1 sites give the same shape, and
   was left unchanged.
4. **`07-aphasia-profile-comparator` (Full), repetition wording.**
   Both occurrences of "repeating a word needs neither" fluent
   production nor comprehension overstated the point: repetition still
   needs auditory and phonological processing and speech output. Both
   are now stated as the activity actually supports it, a fairly
   direct sound-to-speech route can carry repetition without needing
   comprehension, and repetition does not simply track spontaneous
   fluency.
5. **`11-neuropsych-assessment-battery-builder` (Full), deterministic
   causal wording.** "That percentile is produced by poor sleep, low
   mood, pain, medication, an unscreened hearing problem, or variable
   effort" stated a deterministic causal claim the activity does not
   make. Reworded to "can just as easily reflect" those factors, and a
   single score "cannot tell those apart" without measuring them,
   preserving the guide's existing test-performance / impairment-
   inference / diagnosis distinction rather than adding new language
   about it.
6. **`04-visual-neglect-line-bisection` (Simplified), "can see it
   perfectly well."** Overstated the neglect patient's visual
   experience as fully intact. Reworded to "the neglect patient's
   visual input from the left is available but goes unattended and
   unacted on," keeping the contrast with field loss without implying
   every aspect of visual experience is unaffected.

Corrections 1, 3, 4 and 5 changed four Full-guide word counts and two
Simplified-guide word counts (1 and 2 both gained words from the extra
precision required; 6 gained two words). The word-count tables above
already reflect the corrected figures; the grand total moved from
7,288 to 7,383 words, a change of 95 words, still a 78% reduction from
the original 33,826.

## What this rollout does not do

No Cognitive, Research Methods, Social and Critical Psychology, or
Personality and Individual Differences file was touched. No
`metadata.json` schema changed, and no `metadata.json` content was
changed (the discrepancies above are reported, not fixed). No activity
code changed, on either the original submission or this pre-merge
correction pass. Five items above are logged as candidates for
separate, tightly scoped follow-up PRs once this branch is resolved, in
the same spirit as the Multiple Comparisons FWER fix that followed the
Research Methods rollout, highest priority first since all four are
genuinely learner-facing: the `06` Full measure-count figcaption, the
`06` Simplified `activity.js` answer key's "cannot produce" overclaim
(found on independent review, see "Pre-merge correction pass" above),
the `10` Simplified covert-recognition claim (a four-file fix:
`index.html`, `activity.js`, `metadata.json`, `teaching-notes.md`), and
the `09` callosum default state; and, lowest priority since nothing
learner-facing is wrong, the two stale source-code comments and two
metadata arithmetic/duration mismatches. This document does not
authorise scaling to Social and Critical Psychology; that decision
follows review of this batch.
