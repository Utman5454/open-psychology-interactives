# Proposal: a concise teaching-guide format

Date: 2026-09-07. Status: **proposal only**. Nothing in the collection is
rewritten by this document or by the branch it belongs to. It exists so the
format can be agreed before the 150-note pass it would justify begins.

## The problem, measured

| | Files | Average length | Range |
| --- | --- | --- | --- |
| Original edition `teaching-notes.md` | 75 | 233 lines | 184–315 |
| Simplified Edition `teaching-notes.md` | 75 | 126 lines | 93–175 |

Every one of the 150 files is already longer than the shortest original
(184 lines). Live QA on the merged M0 called this "much too long for the
lecturer-facing product" now that the notes are readable on the site
(`library/activity.html`) rather than only in the repository. The content is
not wrong — it is dense, accurate, and clearly written by someone who has
taught the material — but it is written at the length and pace of a method
paper's appendix, not something a lecturer can scan in the ninety seconds
before a seminar starts.

**The redundancy is the biggest single cost.** The sampling-distribution
notes (used as the worked example below) say "run twenty studies slowly
before the thousand" in the opening paragraph, then say it again almost
verbatim under "Running it from the front", then a third time under "The
demonstration worth doing from the front". That pattern — the same
instruction restated under two or three section headings because each was
added at a different time for a different reader — recurs across the
sample read for this proposal (`08-sampling-distribution-pvalue-simulator`,
`06-stroop-interference-lab`, `12-alpha-trap`, `01-double-dissociation-detective`,
`08-minimal-group-positive-distinctiveness`). Cutting it is not a loss of
content; it is removing three drafts of the same sentence.

## The target format

Seven sections, each doing one job, no section repeating another's:

| Section | Job | Typical length |
| --- | --- | --- |
| **What it teaches** | The one idea, in a sentence a lecturer can decide from. | 1–2 lines |
| **Before students start** | The one thing to say or put on the board, if anything. "None" is a valid answer. | 0–2 lines |
| **What students do** | The activity sequence, as a short numbered list of the moves that matter — not a restatement of the on-screen instructions. | 4–6 lines |
| **What to look for** | What a lecturer watching over a shoulder, or reading a submitted answer, should notice — the one moment or number that shows the idea landed (or didn't). | 3–4 lines |
| **Debrief** | Two or three questions worth asking out loud, not the full set an exam might use. | 3–4 lines |
| **Common misconception / caution** | The single most useful wrong answer to expect, and the one limitation a lecturer must not overstate past. Not a table of seven. | 3–5 lines |
| **Use in class / timing** | Format (demonstration, pairs, independent) and realistic minutes. | 1–2 lines |

Target: **20 to 25 lines total**, including headings. A guide that reaches
30 for an unusually rich activity is not a failure of the format; a guide
that needs 60 is a sign the activity teaches two things and the *activity*,
not just its notes, may be worth a second look — but that is out of scope
for a notes rewrite and would be flagged rather than acted on.

### What is cut, and where it goes

- **Learning objectives as a formal numbered list** — folded into "What it
  teaches" as prose; the objectives are still true, just not itemised
  separately from the one-sentence summary that already implies them.
- **Optional extension tasks** — cut. An extension task duplicates the
  activity's own challenge mode where one exists, and where it does not the
  lecturer is better placed than a static file to invent one for their
  specific class.
- **The full misconceptions table** — reduced to the single most common
  wrong answer. The rest were true but marginal; a lecturer who wants the
  full taxonomy has Greenland et al. (2016), which several of these tables
  already cite as their source.
- **Accessibility considerations** — dropped from the prose entirely. This
  is exactly what `metadata.json`'s `accessibilityNotes` field already
  holds for every activity, verbatim; repeating it in the notes is the
  clearest case of the "two drafts of the same fact" problem, and
  `library/activity.html` already renders that field in its own
  disclosure. Nothing is lost, only de-duplicated.
- **Citation and evidence notes** — dropped from the lecturer-facing guide,
  kept in a single trailing line ("Evidence: Wasserstein & Lazar 2016;
  Greenland et al. 2016") for the lecturer who wants to chase a source,
  without the annotated bibliography.
- **The worked model / formula block** — kept only where the activity is
  itself a statistical model a methods lecturer would want to check by
  hand (the p-value and effect-size tools are the clear cases); dropped
  everywhere else.
- **Estimated duration broken into three regimes** — collapsed into one
  line in "Use in class / timing"; a range (`10–25 minutes`) says the same
  thing a three-row breakdown did.

## Worked example

The current file, 138 lines of body text (199 with front matter and
headings), condensed to the proposed format. Nothing below is a change to
the shipped file — it is a demonstration of what the format produces from
real content, so the format can be judged before anyone commits to it.

> ### Sampling Distribution and p-Value Simulator
> **What it teaches.** A p-value is the tail area of a sampling
> distribution built by assumption, not a probability about the
> hypothesis. Changing the sample size changes the p-value with the
> finding held exactly fixed, which nothing else in the tool changes.
> **Before students start.** Write "the true difference here is exactly
> zero" on the board and leave it there.
> **What students do.** (1) Predict how often two samples of 40 differ by
> 5+ points — "about 1 in 20" is the instructive wrong answer, since
> that is where the .05 threshold sits, not a property of the study.
> (2) Run 20 studies slowly, then 1,000; read the shaded tails against
> the model's own p. (3) Hold the observed difference at 5.0 and drag n
> from 40 to 200. (4) Take the six-statement challenge on what p means.
> **What to look for.** Step 3 is the moment that matters: the same
> finding (a difference of 5.0) gives p ≈ .14 at n = 40 and p < .001 at
> n = 200. A student who can say what changed and what didn't has the
> idea; "the effect got bigger" has not.
> **Debrief.** If every study has a true effect of zero, why isn't the
> pile a single spike at zero? Why can the calculation not say how
> likely the null hypothesis is? Name one thing the p-value is
> conditional on that nobody checked.
> **Common misconception.** "p is the probability the null is true" —
> the simulation assumes the null before a single study runs, so nothing
> about its plausibility ever enters. Caution: the null model here is
> unusually clean (known variance, no dropout, no dependence); a small p
> in real data does not identify what broke.
> **Use in class.** Front-of-room demonstration, 10 minutes; with the
> challenge and debrief, 30–40. Evidence: Wasserstein & Lazar (2016);
> Greenland et al. (2016).

29 lines (`wc -l` on this block as written, the same measure the 233-line
average above uses), against the current file's 199 — close to, if slightly
over, the 20-to-25 target for an activity with an unusually rich model
behind it; a simpler activity's guide should sit inside the target
directly. The prediction
question, the central demonstration, the strongest misconception, and the
two most load-bearing citations all survive; the three restatements of
"run twenty slowly first", the seven-row misconception table, the four
extension tasks, the accessibility paragraph and the reference-value
table do not. ("Lines" here means source lines including the wrapping
shown, matching how the collection's existing notes are hand-wrapped and
how the summary table's counts were produced — not a count of sentences
or ideas, which would be lower.)

## Rollout: sampled, not all at once

Do not rewrite 150 files against a format nobody has used yet. Recommended
sequence for the pass this proposal would authorise:

1. **Pilot on five activities, one per module**, chosen for being
   representative rather than easiest:
   - Cognitive: `06-stroop-interference-lab`
   - Research Methods: `08-sampling-distribution-pvalue-simulator` (drafted above)
   - Neuropsychology: `01-double-dissociation-detective`
   - Social and Critical Psychology: `08-minimal-group-positive-distinctiveness`
   - Personality and Individual Differences: `12-alpha-trap`

   Each is an early, frequently-referenced tool in its module (three
   already anchor the curated lessons under `data/lessons/`), so getting
   these five right and checking them against real teaching use tests the
   format against real variety: a timed reaction-time task, a comparison
   of two lesion cases, an intergroup allocation task, and a live
   statistic with a table.
2. **Review the five against the activity itself**, not only against the
   old note: does the condensed guide still let someone who has never
   opened the tool run it competently from the front? A second person
   (ideally someone who has taught with the collection) should be able to
   answer yes without opening the old file.
3. **Only then scale to the remaining 145**, in module-sized batches so
   each batch's `check-answer-balance` / `check-edition-pairing` gates and
   a spot-read of a few files can catch drift before the next batch
   starts. Twin pairs (original + simplified) for the same topic should be
   rewritten together, since the simplified note already omits most of
   what the concise format also cuts and the two can share a debrief and
   a misconception rather than independently reinventing one each.
4. **Keep the source facts, drop the drafts.** Every fact that survives
   condensing should still be traceable to the current file; this is a
   compression pass, not a rewrite of the psychology or the statistics.
   Where a current note's "what to look for" or misconception is itself
   unclear or arguably wrong, flag it rather than silently improve it —
   that is a content fix, not a format change, and belongs in its own
   reviewable commit.

## What this proposal does not decide

- Whether `library/activity.html` should show the full teaching-notes.md
  or something generated from structured fields (a `teachingGuide` object
  in `metadata.json` mirroring these seven keys) instead of Markdown prose.
  A structured field would make the 20–25 line budget mechanically
  enforceable and easier to keep in sync between twins, at the cost of a
  metadata-schema change and a script to migrate 150 files at once instead
  of by hand. Worth deciding before the pilot, not after.
- Whether the full-length original notes should stay this long for the
  lab/seminar setting they already serve well, with the concise format
  applying only to a new, shorter field — versus replacing the original
  notes outright. The worked example above assumes replacement; keeping
  both would mean writing two guides per activity, doubling the
  maintenance the M0.1 audit exists to reduce.
