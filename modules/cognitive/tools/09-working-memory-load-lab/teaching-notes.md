# Teaching notes — Working-Memory Load Laboratory

`modules/cognitive/tools/09-working-memory-load-lab/`

Not all interference is equal. The whole argument for more than one store sits
in that sentence, and this laboratory is built to make it something students
have felt rather than read.

---

## Before you run this

- **This operationalises a demand. It does not measure capacity.** Say that
  first, or the conversation afterwards will be about whose memory is biggest.
- **Only the concurrent judgements are paced**, at 1.8 seconds each, and they
  are paced on purpose: the retention interval is then the same length in every
  condition, including the do-nothing baseline, so decay time is held constant.
  Nothing else is timed and nothing animates.
- **The worked example is the complete non-performing route** and contains all
  four material × task combinations, which no student has time to run.
- **Run the do-nothing baseline at least once.** The residual cost of *any*
  concurrent task is one of the challenge answers, and it is only visible
  against that baseline.

## Intended level

First- or second-year undergraduate, alongside a lecture on the multi-component
model. It follows the dual-task laboratory naturally: that one asks *how much
does a second task cost*, this one asks *why does it depend so much on what the
second task is made of*.

## Learning objectives

After the activity a student should be able to:

1. read a load function and describe it as a curve, not a container;
2. explain selective interference and why it needs a crossed design;
3. keep storage load, attentional control and similarity apart;
4. recognise findings a design like this cannot address;
5. state the difference between varying a demand and estimating a capacity.

## Estimated duration

- **Demonstration from the front:** 6 minutes — the worked example's four rows.
- **Students running two runs (baseline plus one concurrent task):** 12 minutes.
- **With a third run in the other domain, the challenge and the debrief:**
  30 minutes.

## Preparation

Run one trial at six letters with the syllable task yourself. It is genuinely
difficult, and knowing that changes how you introduce it.

## The prediction question

> Which combination do you expect to damage memory most?

Four options. The intended answer is *the matching pairs*. The most instructive
wrong answer is *whichever second task is harder in itself* — a perfectly
sensible hypothesis, and the feedback names the crossed design as the way to
tell the two apart, which is exactly the methodological point.

## The demonstration worth doing from the front

1. Load the **worked example**. Four rows appear in the "every run" table.
2. Read the "2 items" column aloud: 95, 95, 95, 97. Ask why they are the same.
   (There is almost nothing to interfere with.)
3. Read the "6 items" column: 69, 77, 66, 82. Ask which two are the odd ones
   out, and what those two have in common.
4. Point at the "Same domain?" column. That is the answer.
5. Then the hard question: *the syllable task and the symmetry task might just
   differ in difficulty. What in this table rules that out?* (Each concurrent
   task appears with both materials. Difficulty is constant within a task;
   only the pairing changes.)

## Activity sequence

1. **Predict** which combination will hurt most.
2. **Practice** — two trials with feedback.
3. **Run 1: the do-nothing baseline** with either material.
4. **Run 2: a matching concurrent task.**
5. **Run 3: a mismatched concurrent task**, if time allows.
6. **Compare the rows** in the "every run" table.
7. **The challenge** — five findings, three factors and an out-of-scope option.
8. **Debrief.**

## Debrief questions

1. Why are the four conditions almost identical at two items?
2. The two concurrent tasks might simply differ in difficulty. What feature of
   the design lets you rule that out — and does your own set of runs have it?
3. Even a mismatched concurrent task costs something. What is that residual
   cost usually attributed to?
4. "Capacity is about four items." What is that a summary of, and what does it
   leave out?
5. What would you have to add to this laboratory to say anything about
   attentional control?
6. Recognition is easier than recall. How would the load function change if the
   probe asked you to reproduce the set in order?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "This measures my working-memory capacity." | It varies a demand and watches performance move. Capacity estimates come from long standardised procedures reported with error, and even those predict outcomes only modestly. |
| "There's a limit of about four items." | That number is a summary of a declining curve under particular conditions, not a count of slots. The load function here is gradual. |
| "The symmetry task is just harder." | Possibly — which is precisely why each concurrent task is crossed with both materials. Difficulty is constant within a task; only the pairing changes. |
| "Different-domain tasks don't interfere." | They do, just less. The residual cost against the do-nothing baseline is a real finding and is usually attributed to a domain-general component. |
| "So there are two separate memories." | Selective interference supports separable codes or resources. Whether that means two stores, two codes, or one system with format-specific representations is a live question, and the debrief does not settle it. |
| "My run showed no load effect, so I have a big capacity." | Four trials per load. One trial moves a point by 25 percentage points. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Loads | 2, 4, 6 items, four trials each (twelve trials per run) |
| Material | consonants, or cells in a 4×4 grid |
| Concurrent task | nothing / two-syllable judgement / left–right symmetry |
| Encoding | 2500 ms |
| Retention interval | three judgements × 1800 ms = 5400 ms, identical in every condition |
| Do-nothing baseline | an equal 5400 ms wait |
| Probe | one item, 50% in the set, untimed |
| Missed judgements | recorded as misses, not dropped |
| Practice | two trials, loads 2 and 4, feedback after each |

Symmetric patterns are built by mirroring two columns; asymmetric ones are
built the same way and then have exactly one cell flipped, so the two kinds
have the same density on average.

## The worked example — reference values

Four simulated classes of **100 fictional participants** contributing four
trials per load each — 400 observations per cell — with seeds 20260991 to
20260994. Verified against the running tool.

| Run | Held | Alongside | Same domain? | 2 items | 4 items | 6 items |
| --- | --- | --- | --- | --- | --- | --- |
| A | Letters | Syllable judgement | Yes | 95% | 82% | 69% |
| B | Letters | Symmetry judgement | No | 95% | 86% | 77% |
| C | Positions | Symmetry judgement | Yes | 95% | 78% | 66% |
| D | Positions | Syllable judgement | No | 97% | 89% | 82% |

Run A's load table, as printed:

| Items held | Trials | Memory correct | Concurrent task correct | Concurrent task time |
| --- | --- | --- | --- | --- |
| 2 | 400 | 95% | 85% | 1140 ms |
| 4 | 400 | 82% | 86% | 1201 ms |
| 6 | 400 | 69% | 84% | 1262 ms |

Generator settings: memory accuracy 0.95 / 0.80 / 0.66 (A), 0.96 / 0.90 / 0.82
(B), 0.94 / 0.79 / 0.64 (C), 0.96 / 0.89 / 0.81 (D); concurrent-task accuracy
0.86 same-domain and 0.93 different-domain; concurrent-task time 1080 ms or
940 ms plus 30 ms per item held.

The values at two items are **deliberately equal** across runs — with two items
there is little to interfere with — and the gap opens at four and six. All of
this is **built into the generator**: it illustrates the classic finding, it is
not evidence for it, and it is not anybody's data.

## What the tool refuses to do

**It will not report a capacity.** No span, no estimate, no comparison with
anybody.

**It will not claim anything about attentional control.** Nothing here
manipulates task set, conflict or coordination, and the challenge includes two
findings that are out of the design's reach for exactly this reason.

**It will not treat one learner's runs as a crossed design.** Two runs differ in
order and practice as well as in condition; the runs table says so.

## The challenge

| Finding | Answer |
| --- | --- |
| Accuracy falls as the set grows, concurrent task held constant | Storage load |
| Syllables cost more with letters than with positions, judgements identical | Task similarity |
| Worse when judgements arrive unpredictably and must be monitored for | Attentional control (not manipulated here) |
| Even a different-domain task costs something against doing nothing | Attentional control (the domain-general residue) |
| "She was accurate at six letters, so she has the larger working memory" | None of them — the design cannot show it |

Two of the five are outside this laboratory's reach. Recognising that is the
skill worth taking away.

## Limitations and cautions

- **Not a capacity measure**, and not a measure of anybody.
- **Four trials per load** in a learner's own run.
- **The two concurrent tasks are not matched for difficulty**, only for pacing
  and number of judgements. The crossing is what handles this — and a single
  learner rarely completes it.
- **Attentional control is not manipulated.**
- **Recognition is not recall**, and is the easier question.
- **Syllable counting has genuinely contested cases**; the words used here are
  chosen to avoid them, which is itself a simplification.
- **The worked example is simulated**, with the similarity effect built in.

## Accessibility considerations

- Display changes at most once per 1.8 s; only the contents change; nothing
  animates or transitions.
- Pacing exists to hold the retention interval constant, not to pressure the
  learner; the probe is never timed out; the worked example is a complete
  non-timed route.
- Nothing depends on colour: filled cells differ in fill, the probed cell also
  carries a thick dashed ring, the symmetry pattern is drawn in the text colour
  with a dashed mirror line, and chart points print their own percentages.
- The trial display is `aria-hidden` — reading it aloud would be the answer.
- Response buttons are rebuilt each phase with their answer in words, are at
  least 3.25rem tall, and receive focus when they appear.
- The chart is paired with a five-column table; headings do not skip; focus
  moves to the results heading; forced-colours rules are supplied.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Complete the crossing.** As a class, allocate the four combinations across
   groups and pool. What does the pooled table let you say that one person's
   two runs cannot?
2. **Design the control manipulation.** Add a condition that varies attentional
   control while holding storage load and similarity constant. What would you
   change?
3. **Predict the recall version.** If the probe asked for the whole set in
   order, which load would suffer most, and why?
4. **Articulatory suppression.** Predict what saying "the, the, the" aloud
   throughout would do to each of the four combinations.
5. **Write the correction.** In three sentences, correct "working memory holds
   about seven items", keeping whatever is true in it.

## Citation and evidence notes

- **Baddeley and Hitch (1974)** and **Baddeley (2000, 2012)** for the
  multi-component model and the episodic buffer.
- **Brooks (1967)** for the classic demonstration that the *format* of the
  concurrent task matters, not just its difficulty.
- **Logie (1995)** for the visuospatial component and its subdivisions.
- **Cowan (2001)** for the four-item argument, and for how carefully it is
  stated.
- **Engle (2002)** and **Kane, Conway, Hambrick and Engle (2007)** for the
  attentional-control view of working-memory capacity, which is the reading
  under which "capacity" is not mostly about storage at all.
- **Ma, Husain and Bays (2014)** for resource models in which there are no
  slots to count.
- **Oberauer et al. (2018)** for a benchmarks paper that makes plain how many
  live models the same findings support.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
