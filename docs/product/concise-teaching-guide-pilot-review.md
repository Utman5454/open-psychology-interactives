# Concise teaching-guide pilot: review

Date: 2026-09-07 (revised after manual review of PR #3). Status: **pilot
complete, awaiting a second manual review**. This records what changed when
the format proposed in `docs/product/concise-teaching-guide-proposal.md` was
applied to five real `teaching-notes.md` files, one per module. Nothing else
in the collection was touched; the long notes for all other activities, and
every Simplified-edition note, are unchanged.

## A note on measuring "concise"

The first pass of this pilot reported an old-to-new line-count drop (for
example 281 to 21) as the headline number. That comparison is misleading:
the old files carry many of their lines from structural elements, headings,
bullet lists, table rows, duration breakdowns, while the new guides originally
placed each paragraph on a single long source line rather than wrapping it.
Line count alone therefore overstated the compression and was not comparing
like with like.

This revision reformats all five guides as normally readable Markdown with
sensible line wrapping, and reports **word count** as the primary measure of
length, with the new source line count kept only as secondary information.
The actual standard the guides are held to is unchanged: a busy lecturer
should be able to scan one in roughly a minute while it still carries the
teaching point, the procedure, the key observation and the important
caution.

## Word counts

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Cognitive: Stroop Interference Laboratory | 2,436 | 321 | 87% |
| Research Methods: Sampling Distribution and p-Value Simulator | 1,621 | 349 | 78% |
| Neuropsychology: Double Dissociation Detective | 2,023 | 353 | 83% |
| Social and Critical: Minimal Group Allocation Laboratory | 2,171 | 394 | 82% |
| Personality: The Alpha Trap | 2,773 | 378 | 86% |

Old counts are `wc -w` on the pre-pilot files (still on `main`, unmerged);
new counts are `wc -w` on the current guides in this PR. The reduction is
substantial across all five and reasonably even, 78 to 87 percent, which is
a fairer picture of the compression than the original line-count table gave.

New source line counts, for reference only, now that the guides are wrapped
at a normal prose width rather than one paragraph per line: Stroop 43,
p-value simulator 41, double dissociation 46, minimal group 50, alpha trap
45. These are not a target to hit; they are simply what sensible wrapping of
the word counts above produces.

## What was removed, and what survived, per activity

**Stroop.** Removed: the three-tier duration breakdown, the six-row
misconception table, the full parameter table (seeds, offsets, cut-offs), the
accessibility section (already in `metadata.json`), five extension tasks, and
the seven-citation list. Retained: the two load-bearing numbers (interference
+78ms, facilitation +24ms), the neutral-condition logic, the twelve-trials
caution, and the "not a Stroop score for a person" line. The old file's
worked-example reference table was checked line by line against `tool.js`
(seeds `20260923`/`20260987`, offsets, the 200ms/3000ms cut-offs) and found
accurate; none of it needed correcting, only trimming, since it is preserved
verbatim in `metadata.json`'s `simulationNotes`.

**p-value simulator.** Removed: the three-regime duration list, the
seven-row misconception table, the reference-value table for n = 10/40/200
(kept in `metadata.json`), the accessibility section, four extension tasks,
and five citations reduced to none (the proposal's own worked example for
this activity keeps two; this pilot drops citations entirely from the
lecturer-facing guide, per the "single trailing evidence line" option being
itself optional and the activity already well covered by the debrief). The
proposal's own draft of this guide predates the no-em-dash rule and used two
em dashes; this version does not reuse that text verbatim for that reason,
among others in the audit below. Retained: the SE formula's implication
(p ~= .14 at n = 40, p < .001 at n = 200, verified against `tool.js`'s
`standardError` function and default seed 5140), the "about 1 in 20" decoy
answer, and the conditional-on-a-model caution.

**Double Dissociation Detective.** Removed: the three-tier duration list,
the full reference-value table for all six cases (kept in `metadata.json`),
the model's formula block, the accessibility section, five extension tasks,
and six citations. Retained: the case 4 numbers (88%/30% raw, 0.18 SD against
2.16 needed, checked against the notes' own reference table) and the case 5
slider logic (40 to 55 items). The "What it teaches" claim was narrowed in
manual review round two, see below, so it now states the specific rival a
double dissociation defeats rather than a general claim about ruling out a
shared resource.

**Minimal Group Allocation Laboratory.** Removed: the three-tier duration
list, the seven-row misconception table, the full six-matrix table (kept in
`metadata.json`), the accessibility section, four extension tasks, and six
citations. Retained: the worked-example comparison (+0 to +25 versus +300 to
+325 for an identical strategy profile, checked against the notes' own
worked-example table) and the "largest lead costs your own side points"
logic. The caution about the already-ahead condition was softened in manual
review round two, see below, to state what the result does and does not
show about real-world prejudice.

**The Alpha Trap.** Removed: the three-tier duration list, the six-row
misconception table, the full simulation-model formula block and the
seven-row reference-value and guarantee sections (all kept in
`metadata.json`'s `simulationNotes`), the accessibility section, four
extension tasks, and five citations. Retained: the alpha sequence (.684 to
.852), the outcome-correlation peak-then-fall (.581 at the first addition,
.536 at the fifth, checked against `tool.js`'s documented reference table),
the effective-content-areas figure (5.00 to 2.50), and the "very high alpha
is a warning, not a prize" caution. The technical numerator/denominator
phrasing in "What it teaches" was replaced in manual review round two, see
below, with the plain teaching point.

## Accuracy check

Every numeric claim carried into the five new guides was checked against the
activity's own `tool.js` (constants, seeds, formulas) or its `index.html`
(control labels, button text, prediction options), not against the old notes
alone. No discrepancy was found between any of the five old `teaching-notes.md`
files, `metadata.json`, `index.html` and `tool.js`. **No content or accuracy
defect is being reported from this pass.**

## AI-tell audit

Two full read-throughs were done after the first draft: one checking against
the specific list of tells (em dashes, canned transitions, symmetrical
constructions, and the rest), one asking whether the result reads like a
lecturer telling another lecturer how to run the activity. Specific issues
found and fixed:

- **Em dashes in every title line.** The first draft copied the existing
  repository convention `# Teaching notes — Title` verbatim into all five
  files. Since the brief bars em dashes from these five files without
  exception, all five titles were changed to a plain hyphen
  (`# Teaching notes - Title`).
- **An identical "Common misconception / caution" template across all
  five guides.** The first draft used the same shape in every file: a quoted
  misconception, a sentence explaining it, then "Caution:" and a second
  sentence. Rewritten so the five guides use five different shapes: two lead
  with the caution instead of the misconception, one uses a semicolon
  construction, one poses it as "if a student says X", and only one keeps a
  quoted misconception as the opening move.
- **A repeated "Front-of-room..." opening in "Use in class / timing"
  across all five guides.** Rewritten so each one opens differently: "The
  worked example alone runs...", "Ten minutes as a straight
  demonstration...", "Cases 4 and 5 alone carry...", "Six minutes from the
  front...", "A tight demonstration runs...".
- **A symmetrical "a student who can X has the idea; one who says Y has
  not" construction**, drawn too closely from the proposal document's own
  worked example, appeared in the first drafts of the Stroop and Double
  Dissociation guides. Both were rewritten into plain sequential sentences
  that state the same content without the mirrored semicolon shape.
- **A slogan-style sentence fragment**, "Same profile, two different
  acts.", closed the "What to look for" paragraph in the first draft of the
  Minimal Group guide. Folded back into the preceding sentence as a full
  clause instead of standing alone as a punchy fragment.
- **Overuse of "not X, but Y" framing.** Three of the five first drafts used
  this construction in "What it teaches" (Stroop, the p-value simulator, and
  Minimal Group). Removed from Stroop and Minimal Group by restating the
  point as two plain sentences; kept once in the p-value guide, where it is
  the standard and necessary correction of "p is the probability of the
  null" rather than a stylistic habit.
- **Incorrect duration figure caught in the same pass.** The first draft of
  the Stroop guide gave the worked-example-only demonstration as "10
  minutes"; the old notes and the activity itself support 5 minutes for that
  route, with 10 to 12 only once a live block is added. Corrected before
  writing the file.

After these changes, all five guides were re-read against the "does this
sound like an experienced lecturer telling another lecturer how to run the
activity" test. No further rewriting was judged necessary at that time; the
second round below found more to fix once a human had actually read the
five guides against the activities.

## Manual review revision (round two)

A human reviewer read all five guides against the live activities and
requested five corrections, three of them substantive content fixes and two
of them further passes over the writing itself. All five are in this PR;
none of them touch a sixth file or scale beyond the pilot.

**Content fix: Double Dissociation Detective overstated the claim.** The
first draft's "What it teaches" said a double dissociation "rules out a
shared, gradable resource as the explanation" for the two people's patterns.
That is broader than the activity itself supports: the old notes'
Limitations section is explicit that a double dissociation "remains
compatible with overlapping networks, strategy differences, a shared
component plus two specific ones, and single-system models," and cites
connectionist work (Plaut 1995; Juola and Plaut 2000) that produces double
dissociations from a single undivided system. The guide now says a double
dissociation "defeats one specific rival: that the two tasks differ only in
difficulty, both drawing on the same shared graded resource," and states
directly that it does not prove separate modules and that several
single-system accounts survive it.

**Content fix: Minimal Group overstated what the paradigm rules out.** The
first draft's caution said the result "rules out any account that needs
prior hostility to produce differential treatment," which reads as a claim
about real-world prejudice in general. The activity supports a narrower and
still useful claim: differential allocation occurred here with no prior
hostility, no competition and no group history at all, which shows that
none of those three is *necessary* to produce the effect in this
deliberately stripped-down setting. It does not show that no account of
real prejudice can involve them. The guide's caution now states the
necessity claim directly and closes with "that is not the same as ruling
out every account of real prejudice."

**Content fix: The Alpha Trap led with a formula, not a teaching point.**
The first draft's "What it teaches" said near-duplicate items "inflate the
denominator of a validity coefficient without adding anything to its
numerator," which is the correct mechanism but is model language, not
something a lecturer reads aloud. The guide now says "repeated items add
reliable variance without adding breadth, so alpha can keep climbing while
the scale narrows and its relationship with a relevant outcome actually
gets worse," which is the same fact stated as a lecturer would say it. The
formula itself remains available in `metadata.json`'s `simulationNotes` for
anyone who wants it.

**Writing fix: source-line count was the wrong concision metric.** Covered
above under "A note on measuring 'concise'." All five guides were
reformatted with normal Markdown line wrapping instead of one long line per
paragraph, and the review now reports word counts as the primary measure.

**Writing fix: a second AI-tell pass found scripted emphasis the first pass
missed.** Reading all five aloud together surfaced a pattern the per-file
reviews in round one did not catch, because each tell recurred across
different files rather than within one: a family of "scripted emphasis"
phrases, "the one to watch" (p-value simulator), "the one that catches
people out" (Double Dissociation), "worth pointing at" and "worth putting
on screen for the room" (Minimal Group, twice), and "Worth stating
alongside it" (Stroop). None of these were flagged individually in round
one because no single guide repeated itself, but the same rhetorical tic
appeared once in four of the five files. All five instances were rewritten
into plain statements. The same pass also cut colon use roughly in half
across the five guides (from two colons in most files to at most one), and
split several long, multi-clause sentences that were carrying two or three
separate teaching claims at once, most notably in Minimal Group's "What to
look for" and "Common misconception / caution" sections.

## What this pilot does not do

No other `teaching-notes.md` file was touched. No Simplified-edition note was
touched. No `metadata.json` schema changed. No activity code changed. This
document does not authorise scaling to the remaining 145 files; that decision
is for whoever reviews the five guides against the live activities.
