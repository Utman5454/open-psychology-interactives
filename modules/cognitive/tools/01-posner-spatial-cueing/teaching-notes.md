# Teaching notes — Posner Spatial Cueing

`modules/cognitive/tools/01-posner-spatial-cueing/`

A cue you are told to ignore, at a place your eyes never visit, changes how fast
you respond to what appears there. The neutral condition is what turns that one
fact into two separate effects.

---

## Before you run this

Three things are worth saying aloud before anybody starts.

1. **Nothing is timed out.** Every target waits indefinitely. Nothing flashes,
   nothing animates, and the display changes at most twice per trial.
2. **Nobody has to perform the task.** The **worked example** button fills the
   same results panel from a documented, seeded generator and reaches every
   conclusion on the page. The debrief does not depend on anyone's own data.
3. **This does not measure covert attention.** The browser has no access to a
   camera or an eye tracker. Asking students to hold fixation is an
   instruction, not a control, and a student who glanced at the cue produces
   exactly the same pattern as one who did not. Saying this at the start rather
   than at the end is what keeps the demonstration honest.

## Running it from the front

From the front, load the worked example first and talk through the three bars: it takes about a minute and nobody has to perform anything. Then let the room run their own blocks and compare how much the invalid mean moves — with only eight invalid trials in a 48-trial block, it moves a lot.

The point that usually needs saying aloud: nothing here checks where anyone was looking. A student who glanced at the cue produces the same pattern as a student who did not.

## Intended level

First-year undergraduate. It works as the first practical in an attention
sequence, and it doubles as an introduction to reaction-time methodology —
cell sizes, cleaning bounds, and what a mean of eight trials is worth.

## Learning objectives

After the activity a student should be able to:

1. describe the spatial-cueing paradigm and what each of the three trial types
   is for;
2. compute a benefit and a cost against a neutral baseline;
3. explain why valid-minus-invalid is one number carrying two effects;
4. distinguish covert orienting from overt eye movements, and say what evidence
   would separate them;
5. name at least three reasons why one browser block settles nothing.

## Estimated duration

- **Demonstration from the front:** 6 minutes using the worked example alone.
- **Students running one 48-trial block:** 20 minutes.
- **With the challenge and full debrief:** 30 minutes.

## Preparation

None. The tool is a plain web page and needs no setup, no login and no
network. If you are projecting, load the worked example before the session so
the chart is on screen when you start talking.

## The prediction question

> On valid trials the target appears in the cued box; on invalid trials it
> appears in the other one; on neutral trials both boxes are cued. The cue is
> correct on three out of four cued trials.
> **How will the three conditions order themselves, and where will neutral
> sit?**

The four options separate "both a benefit and a cost", "benefit only", "cost
only" and "no effect". Every one of them gets explanatory feedback rather than
a mark; the "no effect" answer is treated as the reasonable intuition the
paradigm was designed to test, not as a wrong answer.

There is a **skip** button for demonstrators, which unlocks the experiment and
says so.

## The demonstration worth doing from the front

Press **Load the worked example instead**. Do not run a block first.

Point at the three bars in order and say the two sentences the tool is built
around:

- neutral minus valid is **26 ms** — that is the benefit;
- invalid minus neutral is **66 ms** — that is the cost.

Then cover the neutral column with your hand. What is left is a single 92 ms
difference between valid and invalid, and it is impossible to say from it
whether attention helped when it was in the right place or hurt when it was in
the wrong one. Uncover the column. That is the whole argument.

## Activity sequence

1. **Predict** the ordering of the three conditions.
2. **Practice** — six untimed trials covering all three trial types, with
   feedback naming the trial type each time. (Optional.)
3. **A scored block** — 48 trials by default. (Optional.)
4. **Read the three means**, then the benefit and the cost.
5. **Compare with the worked example**, which runs 96 trials. The difference in
   how ragged the two look is the point of having both.
6. **The challenge** — four fictional studies to classify.
7. **Debrief.**

## Debrief questions

1. Your invalid mean came from eight trials. How much would you trust it? What
   would you want instead?
2. Somebody in the room got a negative benefit — valid slower than neutral. Is
   that evidence against the effect?
3. What exactly would you have to add to this experiment before you could say
   the word *covert*?
4. A study reports "a 40 ms cueing effect" and gives valid and invalid means
   only. What can you not tell from that?
5. Why is a peripheral flash a different kind of cue from an arrow at fixation?
6. The tool discards responses under 150 ms. Who chose 150? What would change
   at 100 or at 200?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "This proves attention moved without my eyes moving." | Nothing here recorded your eyes. The result is equally consistent with a glance you did not notice. This is stated in the hero panel, and it is the single most important line on the page. |
| "My cueing effect was bigger, so my attention is better." | Eight invalid trials in a browser tab. The tool reports the noise on each difference precisely so this comparison can be refused. |
| "The cue makes the target easier to see." | Possibly — but the same result follows if the cue changes where responses are prepared rather than what is perceived. Three means cannot separate those. |
| "Valid minus invalid is the cueing effect." | It is *a* cueing effect, made of two parts. Cover the neutral column and show that the parts are no longer recoverable. |
| "Neutral is a control condition, so it must be neutral." | Cueing both boxes is one choice; a central cue, or no cue at all, are others, and they give different baselines. What counts as neutral is a design decision. |
| "Longer cue-target intervals must give bigger effects." | Not reliably. At long intervals with uninformative peripheral cues responses to the cued side can become slower instead. The tool does not attempt to produce that, and says so. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Trials per block | 24, 48 (default) or 72 |
| Neutral proportion | one third |
| Valid proportion of cued trials | three quarters |
| 48-trial block | 16 neutral, 24 valid, 8 invalid |
| Target side | balanced within every condition |
| Fixation-only period | 500 ms |
| Cue-to-target interval | 100, 400 (default) or 700 ms |
| Target duration | until answered; never timed out |
| Inter-trial interval | 350 ms |
| Practice | 6 trials, all three types, feedback after each |

The cue stays on once it appears, and the target stays until answered, so the
display changes at most twice per trial. Nothing animates.

## Cleaning bounds

| Rule | Value | What happens |
| --- | --- | --- |
| Anticipation | RT < 150 ms | Counted, reported, excluded from means |
| Lapse | RT > 2000 ms | Counted, reported, excluded from means |
| Errors | wrong side | Excluded from RT means; accuracy reported separately |

Both bounds are researcher choices, not measurements, and the results panel
says so in those words. If every trial in a condition falls outside the bounds
the tool declines to compute a mean and explains why rather than printing a
number.

**Note for anyone testing this in a background browser tab:** browsers throttle
timers in tabs that are not visible, which stretches the fixation and cue
periods and inflates every reaction time. Run it in a visible tab.

## The worked example — reference values

Generated deterministically, so a lecturer can check these against a live
screen. Model:

```
RT       = 340 + offset + Normal(0, 45) + Exponential(mean 35), floored at 180
offset   = valid −28, neutral 0, invalid +52
accuracy = valid .98, neutral .97, invalid .94
n        = 96 (48 valid, 32 neutral, 16 invalid)
seed     = 20260823 (mulberry32)
```

Produced values, verified against the running tool:

| Cue type | Trials | Correct | Mean RT | Median RT | SD |
| --- | --- | --- | --- | --- | --- |
| Valid | 48 | 47 of 48 (98%) | 348 ms | 340 ms | 54 ms |
| Neutral | 32 | 32 of 32 (100%) | 374 ms | 372 ms | 52 ms |
| Invalid | 16 | 15 of 16 (94%) | 440 ms | 441 ms | 66 ms |

| Quantity | Value |
| --- | --- |
| Benefit (neutral − valid) | +26 ms |
| Cost (invalid − neutral) | +66 ms |
| Total cueing effect (invalid − valid) | +92 ms |
| Accuracy overall | 98% |

The example deliberately runs twice the default block length. It shows the
pattern the design is capable of producing when there are enough trials; a
student's own 48-trial block shows how much noise sits on top of it. Comparing
the two is more useful than either alone.

These numbers are illustrative. They are not a norm, not a published effect
size, and not anybody's data.

## The challenge

Four fictional studies, each classified as benefit only, cost only, both, or
neither:

| Study | Valid | Neutral | Invalid | Answer |
| --- | --- | --- | --- | --- |
| A | 402 | 404 | 461 | Cost only |
| B | 371 | 405 | 409 | Benefit only |
| C | 378 | 404 | 448 | Both (cost larger) |
| D | 401 | 403 | 405 | Neither |

Study D is the one worth dwelling on: invalid is still 4 ms slower than valid,
so a paper reporting only that comparison could describe a "cueing effect"
where there is nothing. Partial answers are marked per row and every row gets
its explanation, whether or not it was attempted.

## Limitations and cautions

- **No eye tracking.** The tool cannot demonstrate covert orienting. It
  demonstrates a cueing effect, which is compatible with covert orienting and
  with unnoticed eye movements alike.
- **Not a measure of the user.** Not attentional ability, not concentration,
  not distractibility, nothing clinical or diagnostic.
- **Browser timing is imprecise** by tens of milliseconds, and the stated
  intervals are targets rather than achieved durations.
- **The invalid cell is small** by design — eight trials in the default block.
  This is a teaching point, but it also means individual results will vary
  wildly, and it is worth saying so before students compare with each other.
- **A mixed cue.** The peripheral cue here is also predictive, which mixes
  exogenous capture with endogenous orienting. Real designs separate them.
- **One block cannot settle a mechanism.** Facilitation, disengagement, and
  criterion-shift accounts all predict faster valid trials.

## Accessibility considerations

- No trial is timed out; the target persists until answered.
- Nothing animates or flashes, at any rate.
- Untimed practice with per-trial explanatory feedback runs first.
- Key mapping stated on screen before any block begins.
- Left/Right arrow keys **or** two buttons at least 3.5rem tall.
- The cue is carried by border weight, colour **and** a caret glyph, so it
  survives greyscale and forced-colours mode.
- The trial display is `aria-hidden` during a run: a spoken description of a
  400 ms cue would arrive after the trial had ended. The worked example is the
  route that does not require seeing the display, and it is signposted in the
  "How to use this" list at the top of the page.
- The chart is hidden from assistive technology and paired with a visible table
  carrying the same numbers.
- Focus moves to the results heading when a block finishes.
- Usable at 320px and at projector widths, with no horizontal page scroll.

## Optional extension tasks

1. **Pool the room.** Collect valid, neutral and invalid means from everybody
   present, along with the interval each used, and recompute the benefit and
   the cost on the pooled data. Compare the spread of individual benefits with
   the pooled one.
2. **Design the eye-movement control.** Write the method section that would let
   you use the word *covert*. What would you record, and what would you discard?
3. **Choose a different neutral.** Argue for cueing both boxes, cueing neither,
   or a cue at fixation. What does each baseline assume?
4. **Break the effect.** Propose a change to the design that should make the
   cueing effect disappear, and say what that would show if it worked.
5. **Write the cleaning rule first.** Before running a block, commit in writing
   to your anticipation bound, your lapse bound and whether you will analyse
   correct trials only. Then run it and see whether you want to change them.

## Citation and evidence notes

- **Posner (1980)**, *Orienting of attention*, for the paradigm and the
  covert/overt distinction.
- **Posner, Snyder and Davidson (1980)** for benefits and costs measured
  against a neutral baseline, which is the structure this tool is built on.
- **Jonides (1981)** and **Müller and Rabbitt (1989)** for the contrast between
  peripheral (exogenous) and central symbolic (endogenous) cues.
- **Posner, Walker, Friedrich and Rafal (1984)** for disengagement as a
  separable component, and for why the cost half attracted attention of its own.
- **Klein (2000)** on inhibition of return, for the long-interval case this
  tool deliberately does not attempt to produce.
- **Wright and Ward (2008)**, *Orienting of Attention*, is the most useful
  single book to set alongside this tool.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its simulated parameters from any of them.
