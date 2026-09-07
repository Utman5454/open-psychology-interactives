# Concise teaching-guide pilot: review

Date: 2026-09-07. Status: **pilot complete, awaiting manual review**. This
records what changed when the format proposed in
`docs/product/concise-teaching-guide-proposal.md` was applied to five real
`teaching-notes.md` files, one per module. Nothing else in the collection was
touched; the long notes for all other activities, and every Simplified-edition
note, are unchanged.

## Line counts

| Activity | Old lines | New lines |
| --- | --- | --- |
| Cognitive: Stroop Interference Laboratory | 281 | 21 |
| Research Methods: Sampling Distribution and p-Value Simulator | 199 | 21 |
| Neuropsychology: Double Dissociation Detective | 246 | 21 |
| Social and Critical: Minimal Group Allocation Laboratory | 234 | 22 |
| Personality: The Alpha Trap | 315 | 21 |

All five land under the 20-to-25 target, including the two front-matter lines
(title and file path) that the old files also carried. None needed the "up to
30" allowance the proposal makes for an unusually rich activity.

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
2.16 needed, checked against the notes' own reference table), the case 5
slider logic (40 to 55 items), and the "not a localisation, not proof of
modularity" caution.

**Minimal Group Allocation Laboratory.** Removed: the three-tier duration
list, the seven-row misconception table, the full six-matrix table (kept in
`metadata.json`), the accessibility section, four extension tasks, and six
citations. Retained: the worked-example comparison (+0 to +25 versus +300 to
+325 for an identical strategy profile, checked against the notes' own
worked-example table), the "largest lead costs your own side points" logic,
and the caution that the three starting positions are this tool's addition
rather than part of the classic paradigm.

**The Alpha Trap.** Removed: the three-tier duration list, the six-row
misconception table, the full simulation-model formula block and the
seven-row reference-value and guarantee sections (all kept in
`metadata.json`'s `simulationNotes`), the accessibility section, four
extension tasks, and five citations. Retained: the alpha sequence (.684 to
.852), the outcome-correlation peak-then-fall (.581 at the first addition,
.536 at the fifth, checked against `tool.js`'s documented reference table),
the effective-content-areas figure (5.00 to 2.50), and the "very high alpha
is a warning, not a prize" caution.

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

After these changes, both files were re-read against the "does this sound
like an experienced lecturer telling another lecturer how to run the
activity" test. No further rewriting was judged necessary.

## What this pilot does not do

No other `teaching-notes.md` file was touched. No Simplified-edition note was
touched. No `metadata.json` schema changed. No activity code changed. This
document does not authorise scaling to the remaining 145 files; that decision
is for whoever reviews the five guides against the live activities.
