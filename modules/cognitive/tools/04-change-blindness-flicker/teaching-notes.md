# Teaching notes — Change Blindness

`modules/cognitive/tools/04-change-blindness-flicker/`

The picture is the same either way. The only thing that changes is whether the
change announces its own location.

---

## Before you run this

- **The alternation is slow and stoppable.** One full cycle is 1.7 seconds, so
  the screen changes about 1.2 times a second — below the three-per-second
  threshold associated with photosensitive reactions, and much slower than the
  standard paradigm. A Pause button is available throughout, and a
  **manual-stepping** mode advances only on a press.
- **Reduced motion is honoured.** If the reader's system asks for it, the tool
  starts in manual mode and says so. Nothing is lost: it is the blank that
  produces the effect, not the speed.
- **Each scene works once.** Four are provided; the tool marks the ones whose
  change has been revealed and keeps that record across a reset. A
  demonstrator route reveals all four without spending any.
- **Do not read the debrief first.** It names the mechanism.

## Intended level

First-year undergraduate. It pairs naturally with the inattentional blindness
tool, and the contrast between the two is worth drawing out: one is about an
object nobody was looking for, the other about a comparison nobody could make.

## Learning objectives

After the activity a student should be able to:

1. say what the blank does to the local transient;
2. predict and then check the size of the with-blank / no-blank difference;
3. describe how change type, position and size bear on the search;
4. explain why change blindness does not license "people store nothing";
5. see that a forty-second search is time spent looking elsewhere.

## Estimated duration

- **Demonstration from the front:** 5 minutes — one scene with the blank, the
  same scene without.
- **Students running two or three scenes:** 15 minutes.
- **With the challenge and debrief:** 25 minutes.

## Preparation

Take the demonstrator route once so you know all four changes. Decide which
scene you will use for the class demonstration, and do not use it yourself
beforehand.

## The prediction question

> How long do you expect it to take you to find a change that large?

Four options from "instantly" to "half a minute or more". "Instantly" is the
common answer and gets explanatory feedback rather than a mark — it is exactly
right for the no-blank condition and usually wrong for the blank condition,
which is the whole point.

## The demonstration worth doing from the front

This is the single most effective five minutes in the tool.

1. Pick a scene you have not used. Leave the blank **on**. Automatic pacing.
2. Start it and say nothing. Let the room search. Wait until people are
   audibly frustrated — thirty seconds is usually enough.
3. Do **not** reveal it. Press *Give up and show me*, then immediately re-run
   **the same scene** with the blank **off**.
4. The change is found before you finish the sentence.

Then say it: *the two pictures were identical in both runs. The only thing I
changed was the grey screen between them.*

## Activity sequence

1. **Predict** how long a large change will take to find.
2. **One scene with the blank on.** Search, then identify what changed.
3. **The same scene with the blank off.** Compare the times.
4. **A second scene** with a different kind of change.
5. **The trial table**, and the warning printed under it about confounding.
6. **The challenge** — four accounts of why the blank matters.
7. **Debrief.**

## Debrief questions

1. What exactly does the blank remove? Be precise: it is not the change.
2. Somebody found it in two seconds and somebody else in forty. What does that
   difference tell you about the two of them?
3. During those forty seconds, was the person blind? What were they doing?
4. Change blindness is often reported as showing that people remember almost
   nothing from one glance to the next. Which step of that inference fails?
5. The effect also occurs across an eye movement, a film cut, and a brief
   obscuring splash. What do those have in common with a grey screen?
6. Why does the trial table refuse to compare change types?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "People don't store anything between glances." | The popular reading, and the evidence is against it. People remember a great deal about scenes, including objects whose change they missed. The paradigm is about comparison, not storage. |
| "The blank hides the change." | Both versions are shown in full, for 600 ms each, as often as you like. Nothing is hidden. |
| "It only works because it's fast." | This version is deliberately slow, and works. Switch to manual stepping and it still works. |
| "I'm bad at this." | A handful of self-paced trials in a browser. It measures nothing about anybody. |
| "So the small change was harder than the big one." | Three properties vary one scene at a time and are completely confounded. The table says so under it. |
| "It shows our perception is an illusion." | It shows that finding a difference between two views needs attention in the right place. That is a strong and interesting claim already, without the metaphysics. |

## The four scenes — reference values

Each is deterministic. Verified against the running tool.

| Scene | Seed | Change | Type | Where | Size |
| --- | --- | --- | --- | --- | --- |
| 1 — a whole object | 20260911 | the middle tree is present or absent | Presence | Centre | Large |
| 2 — a small detail | 20260912 | one window on the rightmost building is lit or unlit | State | Right edge | Small |
| 3 — a large area | 20260913 | the leftmost building is a storey taller, with an extra row of windows | Size | Left edge | Large |
| 4 — something that moves | 20260914 | the middle cloud sits 96 units further right | Position | Upper centre | Medium |

Timing, exactly as built:

| Setting | Value |
| --- | --- |
| Each view | 600 ms |
| Each blank | 250 ms |
| Full cycle with blank | 1700 ms (about 1.2 screen changes per second) |
| Full cycle without blank | 1200 ms |
| Manual mode | advances on a button press or the space bar only |
| Pause | available at any point during automatic pacing |

## What the tool refuses to do

**It will not compare change types.** Type, position and size vary one scene at
a time, so they are confounded with each other and with the scene itself. The
table under the trial record says this in as many words. If a student wants to
compare them, that is an excellent extension task — and the first step is
building the scenes that would let you.

**It reports no published times.** The alternation here is slower than the
standard paradigm, the scenes are far simpler than photographs, and screen size
is uncontrolled. Times on this page belong to this page.

## The challenge

Four candidate accounts of the blank's effect:

| Answer | Verdict |
| --- | --- |
| The blank produces a transient everywhere, so the local one no longer stands out | Correct |
| The blank hides the change | No — both views are shown in full |
| People store nothing between views | The popular reading, and it does not follow |
| The blank erases visual memory | A quarter of a second does not, and the effect survives eye movements and film cuts too |

The last two both get substantial feedback, because they are the two errors
students actually leave with.

## Limitations and cautions

- **Not a measure of anybody.** Not attention, not observational skill,
  nothing clinical.
- **Simplified scenes are easier than photographs**, so times are short.
- **Confounded design.** Three properties, four scenes, one change each.
- **A revealed scene is spent.** Re-running it measures memory for where the
  change was.
- **Failure to report is not failure to see**, here as elsewhere in this
  literature.

## Accessibility considerations

- Alternation at about 1.2 screen changes per second, well below the
  three-per-second flash threshold.
- Pause available throughout; manual stepping available at any time; reduced
  motion starts the tool in manual mode and announces it.
- No CSS animation or transition anywhere.
- Changes are geometric or lit/unlit state, never a hue, so the task survives
  greyscale and forced colours.
- The live scene is `aria-hidden` — describing it aloud would give the answer.
  The reveal names the change in words and rings it with a dashed circle.
- Every control has an accessible name; the identification question is a radio
  group with a visible legend.
- Focus moves to the results heading after each trial.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Design the unconfounded study.** You want to know whether central changes
   are found faster than peripheral ones. How many scenes do you need, and
   what has to be held constant?
2. **Predict from the mechanism.** Before running Scene 4, predict whether the
   moving cloud will be easier or harder than the missing tree, and say why in
   terms of transients rather than in terms of "how obvious" it is.
3. **Break the effect a different way.** Propose an interruption other than a
   blank that should produce change blindness, and say what it has in common
   with a blank.
4. **The applied claim.** Find a road-safety or eyewitness claim that cites
   change blindness, and identify what it assumes about storage.
5. **Write the correction.** In three sentences, correct the sentence "change
   blindness shows we see far less than we think we do", keeping whatever is
   true in it.

## Citation and evidence notes

- **Rensink, O'Regan and Clark (1997)** for the flicker paradigm itself, and
  for the transient account this tool's debrief follows.
- **Simons and Levin (1997, 1998)** for change blindness across cuts and across
  a real-world interruption.
- **O'Regan, Rensink and Clark (1999)**, "mudsplashes", for the demonstration
  that a blank is not required — only a disruption of the local transient.
- **Hollingworth and Henderson (2002)** and **Hollingworth (2006)** for the
  evidence that scene memory is substantial, which is what blocks the
  "we store nothing" inference.
- **Simons and Rensink (2005)**, *Change blindness: past, present, and future*,
  for a direct treatment of the overreaching interpretations.
- **Levin, Momen, Drivdahl and Simons (2000)** on change blindness blindness —
  people's confident belief that they would have noticed.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
