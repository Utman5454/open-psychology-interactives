# Teaching notes — Visual Search Laboratory

`modules/cognitive/tools/02-visual-search-laboratory/`

The same target, the same eyes, the same instruction. Change what the
distractors are and the number of items goes from almost free to very
expensive indeed.

---

## Before you run this

- **Nothing is timed out.** Every display persists until answered. Nothing
  animates and nothing flashes.
- **There is an untimed panel first.** *Look before you time anything* lets a
  student build a display at any set size in either condition and reveal the
  target on request. The contrast is obvious there, with no reaction time
  involved at all.
- **Nobody has to perform a block.** The **worked example** fills the results
  panel for both conditions from a seeded generator, and the debrief does not
  depend on anyone's own data.
- **The stimuli use no colour.** Orientation (upright or tilted) and fill
  (solid or hollow) are the two properties. The paradigm therefore works
  unchanged for a student with any colour vision deficiency, on a greyscale
  projector, and in Windows high-contrast mode — which is the reason the
  familiar red-and-green version was not used.

## Running it from the front

Project a 32-item feature display and a 32-item conjunction display side by side and count aloud. The room finds the first target before you finish saying the sentence and is still hunting for the second one. That contrast is worth more than the slopes, and it costs nothing in reaction time.

Eighteen trials means three per cell, which is far too few for a stable slope and is meant to be. Run the worked example afterwards and compare: the same design with more trials gives a far tidier line, and the gap between the two is the honest lesson about single-participant data.

Nobody has to perform either block. The worked example fills the results panel on its own.

## Intended level

First- or second-year undergraduate. It is the standard companion to a lecture
on feature integration theory, and it doubles as a worked example of fitting
and interpreting a slope.

## Learning objectives

After the activity a student should be able to:

1. define feature and conjunction search in terms of how the target is
   specified relative to the distractors;
2. read a search function and state its slope in ms per item;
3. explain why target-absent slopes are usually steeper;
4. separate a description of a search function from a mechanistic claim;
5. say what three trials per cell does to a slope estimate.

## Estimated duration

- **Demonstration from the front:** 6 minutes — two displays in the untimed
  panel, then the worked example.
- **Students running both blocks:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. If you are projecting, open the untimed panel and set it to 32 items,
conjunction, target present, before the session begins.

## The prediction question

> As the number of items on screen goes from 8 to 32, what happens to search
> time in each condition?

Four options: feature flat and conjunction steep; both steepen equally;
the reverse; neither changes. "Both get slower by about the same amount" is
the common answer and gets feedback rather than a mark — it is half right, and
the surprising half is that adding twenty-four items to a feature display is
almost free.

A **skip** button unlocks everything for demonstrators.

## The demonstration worth doing from the front

Do not start with reaction times. Use the untimed panel.

1. Feature, 32 items, target present. Ask the room to raise a hand when they
   have found it. Every hand goes up at once.
2. Conjunction, 32 items, target present. Ask again. The hands go up raggedly
   over several seconds, and some do not go up at all.
3. Press **Where is the target?** and let the groans happen.

Then say the sentence the tool is built around: *the target did not change.
The distractors did.*

Only after that, load the worked example and show the two search functions.

## Activity sequence

1. **Predict** the two search functions.
2. **Inspect displays**, untimed, in both conditions at 8 and at 32 items.
3. **Practice** — four untimed trials with feedback. (Optional.)
4. **The feature block** — 18 trials. (Optional.)
5. **The conjunction block** — 18 trials, same controls. (Optional.)
6. **Read the slopes**, present and absent separately.
7. **Load the worked example** and compare its tidiness with your own.
8. **The challenge** — five claims to classify.
9. **Debrief.**

## Debrief questions

1. What exactly changed between the two conditions? Name it precisely.
2. Your feature slope may have come out negative. What does that mean?
3. Why is the target-absent slope steeper? Give the account, then give a
   reason the account might be wrong.
4. If a target had a slope of 12 ms per item, would you call that feature
   search or conjunction search? What does the difficulty of answering tell
   you about the two categories?
5. What would you have to add to this experiment to test whether attention is
   moving item by item?
6. The worked example has the two-to-one absent/present ratio built into its
   generator. Why does the tool tell you that, and what would be wrong with
   not telling you?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Feature search is parallel and conjunction search is serial." | Both are theories. The data are two slopes. Point at the hero panel: a steep slope is equally consistent with a limited-capacity process that handles everything at once but less well as competition grows. |
| "A flat slope means the display is processed all at once." | It means the cost per item is too small to detect with this many trials. Those are different claims. |
| "My feature slope was negative, so the effect is backwards." | Three trials per point. Show them the worked example's 14 per point and ask which they would rather publish. |
| "The conjunction target is just harder to see." | It is the same bar, drawn identically, in both conditions. What changed is what surrounds it. |
| "So there are two kinds of search." | Search efficiency varies continuously with target-distractor and distractor-distractor similarity. This tool shows two points on that continuum, chosen because they are far apart. |
| "The absent slope being twice the present slope proves a serial self-terminating scan." | It is consistent with one. It is also consistent with quitting rules, guessing and graded processing. And in the worked example it was built in. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Target | a bar that is tilted (40 degrees) and solid |
| Feature distractors | upright solid only |
| Conjunction distractors | half upright solid, half tilted hollow |
| Set sizes | 8, 16, 32 |
| Target present | half the trials |
| Trials per cell | 3, giving 18 per condition |
| Practice | 4 trials (8 and 32 items, present and absent), feedback after each |
| Positions | 8 by 5 grid, per-item jitter, reshuffled every trial |
| Display duration | until answered; never timed out |
| Inter-trial interval | 450 ms |
| Response keys | J for present, F for absent, or two buttons |

## Cleaning

| Rule | Value |
| --- | --- |
| Anticipation | RT < 200 ms — counted, reported, excluded |
| Lapse | RT > 10000 ms — counted, reported, excluded |
| Errors | excluded from RT means; accuracy reported separately |
| Slopes | ordinary least squares on trial-level correct data |

**Note for anyone testing this in a background browser tab:** browsers throttle
timers in hidden tabs, which stalls the inter-trial interval and inflates every
reaction time. Run it in a visible tab.

## The worked example — reference values

```
RT       = intercept + slope * setSize + Normal(0, sd) + Exponential(tail)
feature      intercept 430, slope 1.5 present / 2.5 absent, sd 70, tail 60
conjunction  intercept 470, slope 24  present / 46  absent, sd 90, tail 70
accuracy     feature .98 / .98      conjunction .94 / .96
n            14 per cell per condition (84 per condition)
seed         20260825 (mulberry32)
```

Fitted slopes produced, verified against the running tool:

| Condition | Target | Intercept | Slope | Trials used |
| --- | --- | --- | --- | --- |
| Feature | Present | 485 ms | 2.7 ms/item | 40 |
| Feature | Absent | 467 ms | 3.9 ms/item | 42 |
| Conjunction | Present | 575 ms | 22.4 ms/item | 40 |
| Conjunction | Absent | 552 ms | 45.2 ms/item | 41 |

Cell means produced:

| Items | Target | Feature | Conjunction |
| --- | --- | --- | --- |
| 8 | Present | 503 ms | 756 ms |
| 8 | Absent | 494 ms | 925 ms |
| 16 | Present | 531 ms | 930 ms |
| 16 | Absent | 535 ms | 1259 ms |
| 32 | Present | 568 ms | 1293 ms |
| 32 | Absent | 589 ms | 2005 ms |

The absent/present slope ratio in the conjunction condition comes out at 2.0.
**That ratio is built into the generator**, not discovered by it, and both the
results panel and the challenge feedback say so. Use the worked example to
show what the pattern looks like; use a student's own block, or a pooled class
dataset, if you want the ratio to be evidence of anything.

These numbers are illustrative. They are not norms, not published estimates,
and not anybody's data.

## The challenge

Five claims, each classified as supported, going beyond the data, or
contradicted:

| Claim | Answer |
| --- | --- |
| Adding items slowed conjunction search far more than feature search | Supported |
| Feature search is completely unaffected by the number of items | Goes beyond |
| Conjunction search must proceed one item at a time | Goes beyond |
| Target-absent trials produced a steeper slope than target-present trials | Supported |
| Adding items made feature search faster | Contradicted |

The dividing line every time is between describing a search function and
explaining it. Partial answers are marked per row and every row gets its
explanation, whether or not it was attempted.

## Limitations and cautions

- **Slopes do not choose between accounts.** Feature integration theory,
  guided search, limited-capacity parallel models and signal detection
  accounts all survive this pattern.
- **Three trials per cell** is not an estimate. It is a demonstration of what
  the design does, and the tool says so in the results panel.
- **Uncontrolled display.** Item size, spacing and visual angle depend on the
  screen. All three change search efficiency, so slopes are not comparable
  across devices.
- **Browser timing** carries tens of milliseconds of noise.
- **Nothing is measured about the user** — not attention, not visual ability,
  not processing speed, and nothing clinical.
- **Two conditions is not a taxonomy.** Efficiency is a continuum.

## Accessibility considerations

- Orientation and fill, not colour, define every stimulus.
- No trial is timed out; displays persist until answered.
- Nothing animates or flashes, at any rate.
- An untimed inspection panel precedes the experiment; the target can be
  revealed there, ringed *and* described in words ("row 1 of 5, column 5 of 8").
- Untimed practice with feedback before the scored block.
- J and F keys or two buttons at least 3.5rem tall.
- The scored display is `aria-hidden`: a spoken description would give the
  answer away and arrive too late to be a search. The untimed panel and the
  worked example are the routes that do not require it.
- Charts are hidden from assistive technology and paired with visible tables;
  the two series differ by line style, marker shape and an inline word.
- Focus moves to the results heading when a block finishes.
- Usable at 320px and at projector widths, with no horizontal page scroll.

## Optional extension tasks

1. **Pool the class.** Collect everybody's four slopes. The mean of twenty
   noisy slopes is a far better estimate than any one of them, and the spread
   is the honest picture of single-participant data.
2. **Design an intermediate condition.** Make the distractors more similar to
   each other, or the target more similar to the distractors, and predict
   where the slope will land. Then argue about whether it is "feature" or
   "conjunction" search — the difficulty is the point.
3. **Write the method section** for a proper version of this study: how many
   trials per cell, what exclusion rules, what you will do about display size.
4. **Argue the other side.** Take the worked example's numbers and write the
   strongest case that they do *not* show item-by-item scanning.
5. **Predict the absent slope.** Before running the conjunction block, write
   down what you expect the absent/present ratio to be and why. Then compare.

## Citation and evidence notes

- **Treisman and Gelade (1980)** for feature integration theory and the
  original feature/conjunction contrast.
- **Wolfe (1994, 2021)** on guided search, for the successive revisions and the
  argument that efficiency is continuous rather than dichotomous.
- **Duncan and Humphreys (1989)** on target-distractor and distractor-distractor
  similarity, which is the best antidote to a two-category reading.
- **Townsend (1990)**, *Serial vs parallel processing*, for why a slope cannot
  by itself distinguish the two.
- **Palmer, Verghese and Pavel (2000)** for the signal detection treatment of
  set size effects.
- **Chun and Wolfe (1996)** on quitting thresholds, for target-absent
  performance without a complete exhaustive scan.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its simulated parameters from any of them.
