# Concise teaching-guide rollout: Cognitive Psychology

Date: 2026-09-07. Status: **rollout batch complete, awaiting review**. This
is the first module-sized pass after the five-activity pilot
(`docs/product/concise-teaching-guide-pilot-review.md`, merged to `main` at
`7df169a`). It rewrites every remaining Cognitive Psychology teaching guide,
Full and Simplified, into the approved seven-section format. No other
module was touched.

## Files changed

23 `teaching-notes.md` files, all under `modules/cognitive/tools/` or
`simplified/modules/cognitive/tools/`:

**Full edition (11 of 12; `06-stroop-interference-lab` already approved and
left untouched):** `01-posner-spatial-cueing`, `02-visual-search-laboratory`,
`03-inattentional-blindness`, `04-change-blindness-flicker`,
`05-attentional-blink`, `07-dichotic-listening-selection`,
`08-dual-task-capacity-lab`, `09-working-memory-load-lab`,
`10-false-memory-source-monitoring`, `11-decision-framing-laboratory`,
`12-human-vs-ai-attention`.

**Simplified edition (all 12, including `06-stroop-interference-lab`, whose
Full twin was approved in the pilot but whose Simplified twin had not yet
been rewritten):** the same 12 slugs as the Full list above, plus
`06-stroop-interference-lab`.

`git diff origin/main -- modules/cognitive/tools/06-stroop-interference-lab/teaching-notes.md`
is empty, confirming the approved Full Stroop guide was not touched.

## Word counts

Word count, not source-line count, is the measure used throughout, per the
standard set in the pilot's review.

### Full edition

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Posner Spatial Cueing | 2,433 | 309 | 87% |
| Visual Search Laboratory | 2,367 | 341 | 86% |
| Inattentional Blindness | 2,264 | 315 | 86% |
| Change Blindness | 1,898 | 323 | 83% |
| Attentional Blink | 2,251 | 361 | 84% |
| Dichotic Listening and Selection Theories | 2,396 | 384 | 84% |
| Dual-Task and Limited Capacity Laboratory | 2,328 | 377 | 84% |
| Working-Memory Load Laboratory | 2,187 | 330 | 85% |
| False Memory and Source Monitoring | 2,141 | 362 | 83% |
| Decision Framing Laboratory | 2,100 | 366 | 83% |
| Human Attention versus AI Attention | 2,481 | 331 | 87% |
| **Full total (11 files)** | **24,846** | **3,799** | **85%** |

### Simplified edition

| Activity | Old words | New words | Reduction |
| --- | --- | --- | --- |
| Posner Spatial Cueing | 991 | 236 | 76% |
| Visual Search Laboratory | 995 | 256 | 74% |
| Inattentional Blindness | 1,138 | 239 | 79% |
| Change Blindness | 942 | 213 | 77% |
| Attentional Blink | 977 | 256 | 74% |
| Stroop Interference Laboratory | 1,285 | 273 | 79% |
| Dichotic Listening and Selection Theories | 968 | 247 | 74% |
| Dual-Task and Limited Capacity Laboratory | 882 | 214 | 76% |
| Working-Memory Load Laboratory | 909 | 251 | 72% |
| False Memory and Source Monitoring | 943 | 239 | 75% |
| Decision Framing Laboratory | 852 | 223 | 74% |
| Human Attention versus AI Attention | 964 | 245 | 75% |
| **Simplified total (12 files)** | **11,846** | **2,892** | **76%** |

**Grand total (23 files): 36,692 to 6,691 words, an 82% reduction.** New
guides range from 213 to 384 words. No guide reached 450 words, so none
needed the "inspect for creeping detail" check the brief calls for above
that line. Full guides sit close to the 300-to-400 target throughout;
Simplified guides sit lower, 213 to 273, because the Simplified activities
themselves are shorter and simpler, the same pattern the pilot's proposal
document measured across the whole collection (Simplified originals
averaging roughly half the length of their Full twins).

## Substantive facts deliberately retained

A sample across the batch, not an exhaustive list: Posner's benefit/cost
split and the eight-trial invalid cell in the default block; Visual
Search's feature-versus-conjunction slopes (2.7-3.9ms against 22-45ms);
Inattentional Blindness's refusal to ever print a noticing percentage;
Change Blindness's confounded four-scene design and the caution against
comparing across scenes; Attentional Blink's dip-and-recover lag shape and
its exact worked-example values; Dichotic Listening's marked-versus-plain
noticing rates (88%/72% against 17%/10%) and the naive-first-trial
caveat; Dual-Task's asymmetric cost and the fixed, confounded block order;
Working-Memory Load's same-domain-versus-different-domain cost and the
matched-pacing caveat; False Memory's endorsement/confidence/source
numbers (84%/61%/9% endorsed, 71% source accuracy); Decision Framing's
21-point-versus-4-point asymmetry in what the certainty manipulation buys;
and Human vs AI Attention's masking-changes-more-than-heads-do finding and
its central "weight map is not an explanation" caution. Every Simplified
guide keeps its own twin's core finding while dropping only the controls,
conditions or challenges that Simplified edition genuinely does not have,
confirmed activity by activity against each Simplified `index.html` and
`tool.js`/`activity.js`, not assumed from the Full guide.

## Content concerns discovered

None required a code fix in this branch; all are documentation-only
observations flagged here rather than silently fixed, per the brief.

- **Posner Spatial Cueing (Full), `index.html` copy.** The challenge
  section's introductory sentence says "Three fictional studies report
  mean reaction times...", but the challenge itself, in both `tool.js`'s
  `CHALLENGE_STUDIES` array and the on-page table, presents **four**
  studies (A-D). This is a stale word in the live page's copy, not
  something introduced or corrected by this rewrite. Worth a one-word fix
  to `index.html` in its own small commit.
- **False Memory and Source Monitoring (Full), `tool.js` comment.** The
  file's own top-of-file comment states confidence-given-endorsed values
  of "lure 0.48, new 0.20", but the `SIM` object that the code actually
  executes three lines later uses lure certain 0.38 (fairlySure 0.80) and
  new certain 0.08 (fairlySure 0.35). The new teaching guide's numbers
  match the executing code, not the stale comment, so the guide is
  accurate; the comment itself is a small code-hygiene issue for whoever
  next edits that file.
- **Decision Framing Laboratory (Full), `tool.js` comment.** Similarly, a
  header comment says "120 fictional participants" where the constant
  actually used is 300. The guide's numbers match the constant. Worth
  correcting the comment separately.
- **Human vs AI Attention (Full), old teaching notes.** The pre-rewrite
  notes were not internally consistent about whether the analogy between
  human and model "attention" has one genuine correspondence or two (one
  passage says "exactly one", the debrief section lists two headed
  points). The new guide avoids asserting a specific count and instead
  asks students to state each true correspondence precisely, which
  sidesteps the inconsistency rather than propagating it.

None of these are new defects introduced by this branch; all were present
in the code or old notes beforehand and are reported here rather than
fixed, since fixing product code is out of scope for a notes rewrite.

## Cross-file AI-tell patterns found and rewritten

The pilot's AI-tell pass worked file by file; this batch is large enough
that the more useful check was reading corresponding sections **across**
all 23 files side by side, since several tells only show up as repetition
between files rather than within one. Concretely:

- **"Say that ..." opened "Before students start" in 16 of the 23 first
  drafts** (10 of 11 Full guides, 6 of 12 Simplified guides). Rewritten so
  each section uses a different construction: direct statements ("The
  four scenes each vary..."), different verbs ("Remind students...",
  "Warn that...", "Flag that...", "Point out that...", "Mention that..."),
  or, where the real instruction is silence rather than speech, "Say
  nothing about..." (kept only where withholding information really is
  the instruction, in the two Inattentional Blindness guides and two
  others where a genuine surprise or unbriefed prediction is the point).
- **Near-identical "Use in class / timing" openings.** First drafts had
  "A front-of-room demonstration runs 5 minutes" verbatim in two files,
  "A demonstration runs about N minutes" verbatim in four files, "A
  demonstration with the worked example runs N minutes" in two files, and
  "The whole activity runs in about N to M minutes" in eleven of the
  twelve Simplified guides. All were rewritten to distinct constructions
  while keeping the actual minute figures unchanged, for example "Six
  minutes is enough for a demonstration", "Practice and the block
  together take 5 to 7 minutes", "This one is quick: 4 to 6 minutes".
- **An "X is the [overreach / wrong turn / objection / overclaim /
  phrase] to [catch / correct]:" template** appeared five times across
  different Full guides' misconception sections (Change Blindness,
  Dual-Task, Working-Memory Load, False Memory, Human vs AI Attention).
  Rewritten into five different shapes: a plain correction, an imperative
  ("Watch for..."), a concession before the correction ("It is a fair
  worry, which is exactly why..."), and others, so no two guides share the
  template.
- **"Overreach" or "overclaim" as the correction word** appeared six times
  across the batch. Reduced to a single remaining instance, with the
  others replaced by different phrasing ("goes further than the evidence
  supports", "claims too much", "needs correcting").
- **One leftover scripted-emphasis phrase**, "is worth pointing at",
  survived the initial draft pass in Decision Framing's "What to look
  for" section (the family of phrases the pilot's own review already
  flagged and removed once). Rewritten as a direct imperative, "Point at
  that asymmetry."
- **One wrapping artifact**, not a prose tell but caught in the same
  pass: an edit to Dual-Task's caution left a stray short line
  mid-paragraph ("confounded, the" / "combined block always follows...").
  Rejoined into a normally wrapped paragraph.

After these fixes, all 23 guides were re-read against "does this sound
like an experienced psychology lecturer quickly briefing another
lecturer?" No further rewriting was judged necessary.

## What this rollout does not do

No Research Methods, Neuropsychology, Social and Critical Psychology, or
Personality and Individual Differences file was touched. No
`metadata.json` schema changed. No activity code changed; the four items
above are reported, not fixed. This document does not authorise scaling to
the next module; that decision follows review of this batch.
