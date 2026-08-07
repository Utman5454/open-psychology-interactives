# Teaching notes — Inattentional Blindness

`modules/cognitive/tools/03-inattentional-blindness/`

A surprise works once. Everything in this tool is built around that fact,
including the parts that refuse to pretend otherwise.

---

## Before you run this — read this section first

**Take the demonstrator route before the session.** The control panel has a
button marked *Demonstrator route — show me the design*. It reveals the
display, the unexpected object and the correct count, and it does **not** mark
the variant as used. Do that first so you know exactly what your room is about
to be asked.

**Do not let students scroll.** The debrief and the reveal section spoil the
demonstration permanently, not just for today. The hero panel says so, but a
spoken warning at the start is worth more.

**There are four variants and they are not interchangeable tests.** Give a
room one variant. Debrief it. Use a second variant only to show what changing
the design does — never to re-test the same people, who are no longer naive.
The tool marks used variants in the select and in the variant table, and it
keeps that record across a reset, deliberately.

**Do not score it.** Resist collecting a noticing rate. Twenty self-selected
people in a lecture theatre, with whatever expectations the previous slide
supplied, is not a sample of anything, and an individual answer is not a fact
about that individual. The tool reports no percentages anywhere, for the same
reason.

## Why this version is static

The famous demonstrations use video. This one uses a dense static array and a
demanding conjunction count, because a video cannot honour a reduced-motion
preference, cannot be made available to a reader who cannot use it, and carries
a flicker risk this collection will not take. The static version is the design
used in the medical-imaging variant of the finding, where expert readers
fixated an obviously out-of-place object and did not report it.

It also has a teaching advantage: because nothing was ever fleeting, "you did
not have time" is not available as an explanation.

## Running it from the front

Press the demonstrator route first. It shows you the display, the unexpected object and the correct count without using up a variant, so you know what the room is about to be asked.

Four variants exist, and the tool marks each one used in this browser session. Give a room one variant, debrief it, and use a second one only to illustrate a design change — never to re-test the same people, who are no longer naive.

Whatever happens, resist scoring it. A noticing rate from one room of twenty is not an estimate of anything, and an individual result is not a fact about that individual.

## Intended level

First-year undergraduate, in the first week of an attention topic. It also
works in a research-methods session as a case study in what a demonstration
can and cannot license.

## Learning objectives

After the activity a student should be able to:

1. distinguish attention from awareness, and report from experience;
2. explain why failure to report is not evidence of invisibility;
3. name the factors that move noticing rates;
4. explain why one trial cannot measure a person;
5. see that a retrospective recognition question is partly a memory test.

## Estimated duration

- **The demonstration itself:** 5 minutes.
- **With the reveal and the variant table:** 12 minutes.
- **With the challenge and full debrief:** 20 minutes.

## Preparation

Take the demonstrator route once, on the variant you intend to use. Decide in
advance whether you want the 25-second display limit on. Leaving it off makes
the run fully self-paced and raises noticing, which is a legitimate thing to
show but a weaker demonstration.

## The opening question

> How accurate do you expect your count to be?

This is deliberately **about the counting task only**. Any opening question
that mentions unexpected objects, attention or noticing destroys the
demonstration before it starts, which is why the prediction here is the
mildest one in the collection. Its real job is to get the learner to commit to
the primary task before the critical display appears.

## Activity sequence

1. **Commit** to an expected accuracy for the count.
2. **The display.** The counting instruction appears with it.
3. **"I have finished counting"**, or the 25-second limit, hides the display.
4. **Enter the count.**
5. **The recognition question** — six options, of which one is correct.
6. **The reveal** — the same display, with the object ringed and everything
   described in words.
7. **The variant table** — what each of the four variants changes.
8. **The challenge** — four design changes to classify.
9. **Debrief.**

## Debrief questions

1. If you missed it: do you think you *saw* it? What would settle that?
2. If you noticed it: what would the experimenter have had to change to make
   you miss it?
3. Somebody chose "I think something was there but I could not say what."
   What might that mean, and which accounts of the phenomenon does it fit?
4. The tool offered "a star" as one of six options. How does that differ from
   being asked an open question, and which way does it bias the result?
5. The word is "blindness". Is that the right word for what was measured?
6. Why does this tool report no noticing percentages at all?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "I'm bad at attention." | One trial, one binary answer, no reliability, no norms. Nothing here measures anybody. Say it before someone leaves believing it. |
| "It was literally invisible to me." | What was measured is a report. Whether there was an experience that failed to be reported, an experience that was forgotten, or no experience at all is exactly the disagreement in this literature. |
| "It only works because it was quick." | Nothing here was quick. The display was static and, if the limit was off, available for as long as the student wanted. |
| "So people don't see most of what's in front of them." | An overreach. What the demonstration shows is that a demanding attentional set changes what gets reported, in a display built to produce that. It is not a general claim about the visual world. |
| "I noticed, so the demonstration failed." | Noticing is a perfectly good outcome, and the interesting question is which design factor let it through. Point at the variant table. |
| "Let's do it again with the other variant." | Fine as a demonstration of design. Not fine as a test — after one run the room knows something might appear, which is the single strongest thing that raises noticing. |

## The four variants — reference values

Verified against the running tool. Each is deterministic: the same display
appears every time.

| Variant | Seed | Items | Count | Correct count | Unexpected object | Object position |
| --- | --- | --- | --- | --- | --- | --- |
| A — Standard | 20260901 | 48 | solid downward triangles | 9 | outlined star, 2.4× shape width | row 7 of 7, column 10 of 12 |
| B — Heavier load, less salient | 20260902 | 72 | solid downward triangles | 9 | outlined star, 1.6× shape width | row 1 of 7, column 3 of 12 |
| C — Object shares counted fill | 20260903 | 48 | outlined squares | 6 | outlined star, 2.4× shape width | row 7 of 7, column 3 of 12 |
| D — Light load, solid object | 20260904 | 30 | solid downward triangles | 6 | solid star, 2.4× shape width | row 2 of 7, column 3 of 12 |

Design details that matter if you are adapting it:

- The object is placed **first**, never in the middle columns or the middle
  row, and the cells it would overlap are then left empty — so a solid star
  can never sit on top of a countable shape and make the stated count wrong.
- The counted type is **forced** to between 6 and 10 instances. Left to chance,
  a 30-item display would often contain two or three, which makes the count
  trivial and the promise on the page false.
- Everything is drawn in `currentColor`. Shape and fill do all the work.

## What the tool deliberately does not report

Noticing rates. Not for the variants, not for the challenge, not anywhere. The
tool has no data, and a percentage invented to look plausible would be worse
than none — students remember numbers. Any figure you quote from the
literature belongs to the study that produced it, with its own display, its own
task and its own participants, and it does not transfer to this display.

## The challenge

| Change | Expected effect | Why |
| --- | --- | --- |
| Make the counting task much harder | Fewer notice | Task demand is the most reliable lever in this literature. |
| Make the object the same shape as the counted items, only larger | More notice | Similarity to the attended set helps it through; similarity to the ignored set does not. |
| Warn people that something may appear | More notice | It is no longer unexpected — which is precisely what a second run supplies. |
| Move the object to the centre, where people are already looking | More notice | Position helps, but fixation is not sufficient for report, which is the imaging finding. Expect more, not all. |

Partial answers are marked per row, and every row gets its explanation whether
or not it was attempted.

## Limitations and cautions

- **Not a test of anybody.** One trial, one binary answer.
- **Failure to report is not invisibility.** The step from report to experience
  is the contested one.
- **The recognition question prompts.** Offering "a star" by name makes a yes
  easier than an open question would. Real studies ask open first.
- **It is partly a memory test.** Whatever happened had to survive until the
  question was asked.
- **Whether individual differences in noticing exist at all is contested**, and
  one display cannot bear on it.
- **A classroom result is not a finding.**

## Accessibility considerations

- Entirely static. No animation, no flashing, no flicker at any rate.
- The only timed element is an optional 25-second display limit, off-switchable
  before the run starts, and clearly labelled as such.
- Shape and fill carry the task; no colour carries meaning.
- The live display is `aria-hidden` — a spoken inventory would answer the
  question being asked. The reveal restates the whole display in words: every
  shape type and count, the object's grid position, and its size relative to
  the small shapes.
- The count is a labelled number input; the recognition question is a radio
  group with a visible legend; every control has an accessible name.
- Focus moves to the reveal heading when the reveal appears.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Design the fifth variant.** Specify the primary task, the object, and
   which factor you are moving. Predict the direction and say why.
2. **Write the open question.** Draft the wording you would use instead of the
   six-option recognition list, and say what you would lose and gain.
3. **Argue for the memory account.** Take the result the room produced and
   build the strongest case that it is about memory rather than perception.
   Then build the case against.
4. **Find the applied claim.** Locate a news article or safety campaign that
   cites inattentional blindness, and identify which step of the inference it
   skips.
5. **The ethics of the reveal.** Some people find being caught out
   uncomfortable. Write the two sentences you would say immediately after the
   reveal to prevent that.

## Citation and evidence notes

- **Mack and Rock (1998)**, *Inattentional Blindness*, for the original static
  paradigm this tool's design follows.
- **Simons and Chabris (1999)** for the video version, and for the role of
  similarity between the unexpected object and the attended set.
- **Drew, Võ and Wolfe (2013)** on expert radiologists and an out-of-place
  object in a lung scan — the finding that fixation is not sufficient for
  report, and the reason a static display works here.
- **Most, Scholl, Clifford and Simons (2005)** on attentional set as the
  organising variable.
- **Simons (2010)** and **Wolfe (1999)**, *Inattentional amnesia*, for the
  perception-versus-memory disagreement the debrief refuses to settle.
- **Kreitz, Furley, Memmert and Simons (2015)** on whether individual
  differences in noticing exist, for the caution against scoring anybody.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
