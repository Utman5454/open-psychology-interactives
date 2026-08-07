# Teaching notes — Stroop Interference Laboratory

`modules/cognitive/tools/06-stroop-interference-lab/`

Everyone knows the Stroop effect. Almost nobody who "knows" it can say how much
of it is a cost and how much a benefit — because the version they know has no
neutral condition in it.

---

## Before you run this

- **The task requires telling ink colours apart.** That is the phenomenon, not
  a design accident, so it cannot be removed. Three routes exist instead: a
  **two-colour set** (blue and yellow, which differ in brightness as well as
  hue), a stimulus panel with one fixed near-black background so every ink sits
  at 7:1 contrast or better in both site themes, and the **worked example**,
  which reaches every conclusion on the page without a single colour response.
- **Nothing flashes and nothing is timed out.** One word is on screen at a time
  and it waits for the answer. No CSS animation or transition is used anywhere,
  so there is nothing for a reduced-motion setting to switch off.
- **Say the difference-score warning before anybody runs a block**, not after.
  Otherwise the conversation afterwards is about whose effect was smallest.

## Running it from the front

From the front, load the worked example first. It contains two simulated blocks — balanced and mostly incongruent — which is exactly the comparison the transfer challenge asks about, and nobody has to perform anything to see it.

A 36-trial block gives twelve trials per condition. That is far too few for a stable difference score, and saying so before anybody runs it prevents the "I have a small Stroop effect" conversation afterwards.

## Intended level

First-year undergraduate. It works as the first reaction-time task a cohort
meets, because the design is easy to hold in mind and the analytic point —
what a baseline is *for* — transfers to almost everything else in the module.

## Learning objectives

After the activity a student should be able to:

1. define interference and facilitation in terms of a neutral baseline;
2. say what incongruent-minus-congruent hides, and why that matters;
3. predict the direction of the proportion-congruency effect and check it;
4. describe the naming/reading asymmetry and why an account has to produce it;
5. explain why a Stroop difference score is not a measurement of a person.

## Estimated duration

- **Demonstration from the front:** 5 minutes — the worked example, which
  contains both mixes.
- **Students running practice plus one block:** 10–12 minutes.
- **With a second block in the other mix, the challenge and the debrief:**
  25–30 minutes.

## Preparation

Load the worked example once and look at the two rows in the "every block so
far" table. That pair is the demonstration; everything else is elaboration.

## The prediction question

> Where do you expect the neutral condition to sit?

Four options. The intended answer is *between the other two*. Every wrong
answer gets substantive feedback rather than a mark, and the two interesting
wrong answers are:

- *level with congruent* — nearly right, and the feedback says so: facilitation
  is the smaller effect, but it is usually not zero;
- *fastest of the three* — the intuition that a non-colour word cannot
  interfere. True, and it misses that a matching word actively helps.

## The demonstration worth doing from the front

1. Load the **worked example**. Say out loud that it is simulated and seeded.
2. Read the three figures in the top panel: interference +78 ms, facilitation
   +24 ms, and the two collapsed at +102 ms.
3. Ask the room: *if I only told you the last number, what would you not know?*
4. Then scroll to the block table and show Worked example B — the same task
   with two-thirds incongruent trials, and an interference of +35 ms.
5. Ask: *what changed about the people between those two blocks?*

That last question is the whole tool in one sentence.

## Activity sequence

1. **Predict** where neutral will sit.
2. **Six practice trials** with feedback after each.
3. **A scored block** — 36 trials by default, no feedback until it ends.
4. **Read the two effects**, then the chart and the table.
5. **A second block with the mostly-incongruent mix**, if time allows.
6. **The transfer challenge** — four changes to the task.
7. **Debrief.**

## Debrief questions

1. What exactly does the neutral condition let you say that you could not say
   without it?
2. Interference is usually larger than facilitation. Why is that asymmetry a
   problem for a simple "the word is read automatically" story?
3. If most trials are incongruent, the effect shrinks. Whose property is the
   effect, then?
4. Reading the word is barely affected by the ink; naming the ink is heavily
   affected by the word. What does that asymmetry rule out?
5. Two students get 40 ms and 90 ms. What would you need to know before saying
   anything at all about the two of them?
6. Errors and reaction times can be traded against each other. What would you
   check before believing a difference in mean RT?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The Stroop effect is incongruent minus congruent." | That is one number made of two different things. The tool prints all three so the collapse is visible. |
| "It shows reading is automatic and can't be stopped." | The ink is named correctly on nearly every trial. The cost is in time, not in control. "Automatic" here has to mean "produced quickly and unasked", which is a narrower claim than it sounds. |
| "My effect was small, so I have good executive control." | Twelve trials a condition; difference scores subtract away the reliable variance the two conditions share; and the effect moves when the trial mix moves. Three independent reasons before you get to anything about the person. |
| "Facilitation didn't show up, so it isn't real." | It is the smaller and less reliable of the two effects. A dozen trials will often miss it. That is a statement about the measurement. |
| "The neutral words are a proper control." | Only approximately. They are matched in length, roughly, and not in frequency or orthographic neighbourhood. A real control condition is harder to build than it looks. |
| "So the mostly-incongruent block proves proportion congruency." | In the worked example the shrinkage is built into the generator. In a student's own two blocks, the mixes also differ in order, practice and fatigue. Neither is an experiment. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Conditions | congruent, neutral, incongruent |
| Colour words | RED, GREEN, BLUE, YELLOW (or BLUE, YELLOW in the two-colour set) |
| Neutral words | CUP, DESK, CHAIR, MONTH, TABLE, PLANT, HOUSE, WATER |
| Balanced mix | a third of each |
| Mostly-incongruent mix | one sixth, one sixth, two thirds |
| Block length | 24, 36 (default) or 60 trials |
| Practice | 6 trials, two per condition, feedback after each |
| Fixation | 500 ms |
| Stimulus | stays until the learner answers |
| Inter-trial interval | 400 ms |
| Response | pointer on the colour buttons, or number keys 1–4 |
| Anticipation cut-off | responses under 200 ms excluded and counted |
| Lapse cut-off | responses over 3000 ms excluded and counted |
| Errors | excluded from RT means, reported as accuracy |

Ink colours are rotated rather than sampled within each condition, so ink
identity carries no information about which condition a trial belongs to.

## The worked example — reference values

Simulated with `mulberry32` and Box–Muller:

    RT = base + condition offset + Normal(0, 70) + Exponential(mean 60)
    floored at 260 ms

**Block A — balanced mix, seed 20260923, 80 trials per condition.**
Base 620; offsets −22 / 0 / +78; accuracy .98 / .97 / .93. Verified against the
running tool:

| Condition | Trials | Correct | Mean RT | Median RT | SD | Versus neutral |
| --- | --- | --- | --- | --- | --- | --- |
| Congruent | 80 | 99% | 653 ms | 650 ms | 86 ms | −24 ms |
| Neutral | 80 | 99% | 677 ms | 664 ms | 85 ms | baseline |
| Incongruent | 80 | 90% | 755 ms | 763 ms | 77 ms | +78 ms |

Printed above it: interference **+78 ms**, facilitation **+24 ms**, the two
collapsed **+102 ms**, 240 scored trials.

**Block B — mostly-incongruent mix, seed 20260987, 30 / 30 / 120 trials.**
Base 640; offsets −6 / 0 / +38; accuracy .97 / .97 / .95.

| Condition | Trials | Correct | Mean RT | Median RT | SD |
| --- | --- | --- | --- | --- | --- |
| Congruent | 30 | 97% | 689 ms | 697 ms | 75 ms |
| Neutral | 30 | 97% | 693 ms | 699 ms | 84 ms |
| Incongruent | 120 | 95% | 728 ms | 721 ms | 91 ms |

Interference **+35 ms**, facilitation **+3 ms**, 180 scored trials.

**Both seeds were chosen** so that the sample means land near the generator's
parameters, because a worked example whose job is to show a pattern should show
it. The page says so, and it is worth saying to a class as well: with eighty
trials per condition, plenty of other seeds produce a facilitation of zero or
below from exactly the same model. That is the cleanest statement available of
how little a single sample is obliged to resemble the process behind it.

The shrunken effect in Block B is **built into the generator**, not discovered
by it. It illustrates the proportion-congruency finding; it is not evidence for
it.

## What the tool refuses to do

**It will not report a Stroop score for a person.** There is no score, no
percentile and no comparison to anybody else, and the results panel says why in
three separate places.

**It will not treat a learner's two blocks as an experiment.** Two blocks
differing in mix also differ in order, practice and fatigue. The block table
says so under it.

**It reports no published reaction times.** Display and input timing in a
browser are uncontrolled. Numbers on this page belong to this page.

## The transfer challenge

| Change to the task | Answer | The teaching point |
| --- | --- | --- |
| Read the word, ignore the ink | Smaller | The naming/reading asymmetry — usually close to nothing |
| Two-thirds of trials incongruent | Smaller | Proportion congruency; the one row checkable on this page |
| Lower case instead of capitals | About the same | Not every change to a display changes the effect |
| Say the colour aloud instead of pressing a key | Larger | A spoken response competes directly with the printed word |

Row four is worth dwelling on: it is a reason to be careful comparing effect
sizes across studies that used different response modes, which is a habit worth
forming early.

## Limitations and cautions

- **Not a measure of anybody.** Not attention, not impulsivity, not executive
  function, nothing clinical or occupational.
- **Difference scores are unreliable** by construction: subtracting two
  conditions removes the reliable variance they share.
- **Twelve trials per condition** in the default block is far too few for a
  stable estimate.
- **Neutral items are only roughly matched** to the colour words.
- **Uncontrolled timing.** Requested durations, not guaranteed ones.
- **The mechanism is not settled.** Speed-of-processing, response-competition,
  translation and statistical-learning accounts all predict a cost on
  incongruent trials.
- **The worked example is simulated**, with both effect sizes set by hand.

## Accessibility considerations

- The task needs colour discrimination; a two-colour set, a fixed high-contrast
  stimulus panel and a complete non-colour worked-example route are provided
  rather than pretending otherwise.
- Away from the stimulus, nothing depends on colour: response buttons print
  their colour name, chart bars print their values, the incongruent bar is
  hatched, and all results appear as numbers in a table.
- One word at a time, waiting indefinitely; no animation or transition
  anywhere.
- Responses by pointer or by the number keys printed on the buttons; targets
  3.25rem tall.
- The stimulus panel is `aria-hidden` during a run — any useful description
  would state the answer.
- Every control has an accessible name; headings do not skip; focus moves to
  the results heading when results appear.
- Forced-colours rules are supplied for the panel, the swatches and the chart.
- Usable at 320px and at projector widths; the wide table scrolls inside its
  own container.

## Optional extension tasks

1. **Build the better neutral condition.** What would you match, beyond length?
   What would you have to give up to match it?
2. **Design the reliability check.** How would you find out whether a person's
   Stroop effect is stable from one week to the next, and how many trials would
   you need?
3. **Predict the emotional Stroop.** Colour-naming emotionally significant
   words is slower than neutral words for some people. Is that the same effect?
   Argue both ways.
4. **The applied claim.** Find a claim that a Stroop task measures fitness for
   some real activity, and identify which step of the inference fails first.
5. **Write the correction.** In three sentences, correct "the Stroop effect
   shows that reading is automatic", keeping whatever is true in it.

## Citation and evidence notes

- **Stroop (1935)** for the original demonstration, including the naming/
  reading asymmetry which is in the original paper and is often forgotten.
- **MacLeod (1991)**, *Half a century of research on the Stroop effect*, for
  the interference/facilitation distinction and for the review that makes the
  "one mechanism" story untenable.
- **Logan and Zbrodoff (1979)** and **Lowe and Mitterer (1982)** for proportion
  congruency.
- **Cohen, Dunbar and McClelland (1990)** for the parallel-distributed-
  processing account in which "automaticity" is a matter of degree.
- **Botvinick, Braver, Barch, Carter and Cohen (2001)** for conflict monitoring
  and control adjustment.
- **MacLeod (1991)** and **Hedge, Powell and Sumner (2018)** for why difference
  scores from robust experimental effects make poor individual-difference
  measures - the reliability paradox.
- **Melara and Algom (2003)** for a treatment in terms of dimensional
  imbalance and stimulus statistics rather than automaticity.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
