# Teaching notes — Attentional Blink

`modules/cognitive/tools/05-attentional-blink/`

The finding is not that two targets are harder than one. It is the shape of the
cost over time — and that shape is compatible with every serious account of it.

---

## Before you run this

- **The presentation is rapid, but the changing region is one character.** The
  box, its background, its size and its position are constant. There is no
  large-area luminance change of the kind associated with photosensitive
  reactions, and nothing fades, moves or animates.
- **Nothing is compulsory and nothing is timed at the response end.** Every
  trial waits indefinitely for both answers, and the block can be stopped
  between trials.
- **There is a complete non-timed route.** The worked example reaches every
  conclusion on the page without running a single stream. If a student's system
  asks for reduced motion, the tool says so on load and points them there.
- **Load the worked example from the front before anybody runs anything.** It
  takes a minute and it means the room knows what shape they are looking for.

## Intended level

First- or second-year undergraduate. It follows naturally from the Posner and
visual-search tools: those are about *where* attention goes, this one is about
*when* it is available. It also pairs well with the inattentional-blindness
tool, because both separate selection from awareness.

## Learning objectives

After the activity a student should be able to:

1. describe the two-target RSVP design and say what lag varies;
2. read a lag function — find the trough, find the recovery;
3. explain why second-target accuracy is conditioned on the first target, and
   what happens to the numbers if it is not;
4. state what lag-1 sparing is and why it is awkward for accounts in which the
   first target simply blocks a channel;
5. name at least two accounts of the blink that this lag function cannot
   distinguish.

## Estimated duration

- **Demonstration from the front:** 5 minutes — the worked example and the
  table under it.
- **Students running practice plus one block:** 12–15 minutes.
- **With the challenge and debrief:** 25 minutes.

## Preparation

Run one block yourself so you know how it feels at 100 ms; then look at your
own lag table and notice how noisy four trials per lag is. That noise is the
teaching point when a student's curve comes out flat.

## The prediction question

> How will your accuracy at spotting the X depend on the lag?

Four options. The intended answer is *good at lag 1, worst around lags 2 to 3,
recovered by lag 8*. The most common wrong answer is *worst at the shortest
lag, improving steadily* — it gets explanatory feedback rather than a mark,
because it is right about the direction and wrong about exactly the case that
matters. "About the same at every lag" and "worst at the longest lag" both get
substantive feedback too.

## The demonstration worth doing from the front

1. Load the **worked example**. Say plainly that it is simulated and seeded.
2. Put the lag table on screen and ask the room to read the last two columns
   aloud. Ask what the difference between them is a difference *about*.
3. Point at lag 1 sitting level with lag 8 and ask: *if reporting the digit
   blocks the system for 400 ms, why is lag 1 fine?*
4. Only then let people run their own blocks — with the expectation already
   set that four trials per lag will not reproduce the curve cleanly.

## Activity sequence

1. **Predict** the shape of the lag function.
2. **Four practice trials** at 220 ms with immediate feedback, including at
   least one catch trial with no X in it.
3. **A scored block** — 25 trials, no feedback until the end.
4. **Read the lag function**, both the chart and the table.
5. **Compare with the worked example** — the same shape with twelve times the
   trials per lag.
6. **The challenge** — four claims, sorted into supported and beyond.
7. **Debrief.**

## Debrief questions

1. What is the *shape* of the cost, and why does the shape matter more than the
   existence of a cost?
2. Two students report second-target accuracy at lag 3. One conditions on the
   first target, one does not. Which trials are they disagreeing about, and why
   might those trials be different in kind?
3. Lag 1 is often as good as lag 8. What does that rule out?
4. Five catch trials had no X at all. What would a high false-alarm rate do to
   the interpretation of the whole curve?
5. Name two accounts of the blink. What experiment would separate them? (It is
   not this one.)
6. Slowing the stream to 180 ms shrinks the effect. Is that a nuisance or a
   finding?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "It shows doing two things at once is hard." | Then why does lag 1 escape, and why does lag 8 recover? A general dual-task account predicts no particular time course. The time course is the finding. |
| "My curve was flat, so I don't get the blink." | Four trials per lag. One trial moves a point by 25 percentage points. Individual blocks are for feeling the task, not for estimating anything. |
| "The X wasn't there on the trials I missed." | Five catch trials really do have no X. That is what the false-alarm row is for — check it before trusting the rest. |
| "So the first target uses up a resource." | One live account, and a reasonable one. But attentional-control, loss-of-control and task-switching accounts all predict the same dip. The lag function does not choose. |
| "A smaller blink means more attentional capacity." | Two problems at once: no established reliability at this number of trials, and "capacity" is a construct the design never measured. |
| "Lag-1 sparing showed up in the worked example, so it's real here." | It was built into the generator. The published finding is the evidence; the worked example only illustrates it. The tool says this in three separate places. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Stream length | 18 items |
| Distractors | consonants, excluding X, I, O and Q |
| First target | a digit 2–7, at stream position 5, 6 or 7 |
| Second target | the letter X, at lag 1, 2, 3, 5 or 8 |
| Catch trials | 5 per block, with no X at all |
| Block | 25 trials — 4 per lag plus 5 catch |
| Item duration | 100 ms (default), 140 ms or 180 ms |
| Practice | 4 trials at 220 ms with feedback |
| Blank before the stream | 700 ms (a fixation cross) |
| Blank after the stream | 250 ms |

## The worked example — reference values

Simulated with `mulberry32` seeded at **20260935**. Generator parameters:
first-target accuracy 0.88 at every lag; second-target detection given a
correct first target of 0.86, 0.48, 0.41, 0.72 and 0.88 at lags 1, 2, 3, 5 and
8; detection 0.15 higher (capped at 0.95) on trials where the first target was
missed; false-alarm rate 0.08 on catch trials; 48 trials per lag and 40 catch
trials.

Because the seed is fixed, the tool prints exactly this every time. Verified
against the running tool:

| Lag | Gap | Trials | Digit correct | X seen, all trials | X seen, digit correct only |
| --- | --- | --- | --- | --- | --- |
| 1 | about 100 ms | 48 | 85% | 90% | 88% (41 trials) |
| 2 | about 200 ms | 48 | 94% | 46% | 47% (45 trials) |
| 3 | about 300 ms | 48 | 83% | 44% | 45% (40 trials) |
| 5 | about 500 ms | 48 | 83% | 71% | 68% (40 trials) |
| 8 | about 800 ms | 48 | 90% | 88% | 88% (43 trials) |

Summary figures printed under it:

| Readout | Value |
| --- | --- |
| Blink depth (lag 8 − lag 3) | 43 points |
| Lag 1 minus lag 2 | 41 points |
| Digit reported correctly | 88% |
| False alarms on catch trials | 8% |

These are **illustrative simulated values**. They are not norms, not published
effect sizes and not anybody's data. The lag-1 value is set above lags 2 and 3
by hand, so lag-1 sparing in this example is assumed rather than demonstrated.

## What the tool refuses to do

**It will not pick a mechanism.** Two-stage consolidation accounts,
attentional-control accounts, temporary-loss-of-control accounts and
task-switching accounts all predict a dip that recovers. The challenge marks
"the dip happens because the first target occupies a limited consolidation
process" as *going beyond what these data can show*, and the debrief says the
same thing in prose.

**It will not compare the three presentation rates.** They are offered as an
accessibility measure, not as a factor. A learner who runs one block at 100 ms
and one at 180 ms has two blocks of four trials per lag, differing in rate,
order, practice and fatigue at once.

**It reports no published accuracies.** Browser timing is a request, not a
guarantee: the page paints on the display's refresh schedule and background
load adds more. Numbers on this page belong to this page.

## Limitations and cautions

- **Not a measure of anybody.** Not attention, not processing speed, nothing
  clinical or diagnostic.
- **Four trials per lag** is far too few for a stable estimate — deliberately
  so, and stated in the results panel.
- **Uncontrolled timing.** A "100 ms" item is a requested duration.
- **The rates are not interchangeable.** Slowing the stream shrinks the effect,
  which is real and means the three settings are not a within-subject factor.
- **The worked example is simulated**, with lag-1 sparing built in.
- **Failure to report is not failure to see.** As everywhere in this
  literature, an unreported X may have been registered and lost rather than
  never selected.

## Accessibility considerations

- Only one glyph changes; the box, background, size and position are fixed. No
  CSS animation or transition anywhere.
- Every trial waits indefinitely for both responses; the block can be stopped
  between trials; the worked example is a complete non-timed route.
- `prefers-reduced-motion` is detected on load and announced, with the worked
  example named as the alternative.
- The stream box is `aria-hidden` while running — a character changing every
  100 ms cannot be usefully spoken.
- The lag chart is `aria-hidden` and paired inside the same figure with a
  six-column table. The two series differ by line style, marker shape and an
  inline label, so nothing rests on colour alone.
- Digit and yes/no buttons are at least 3.25rem tall.
- Every control has an accessible name; headings do not skip; focus moves to
  the results heading when results appear.
- Forced-colours rules are supplied for the stream and both chart series.
- Usable at 320px and at projector widths; the wide table scrolls inside its
  own container rather than the page.

## Optional extension tasks

1. **Design the study that separates two accounts.** Pick consolidation and
   task-switching. What would you manipulate, and what would each predict?
2. **Work out the sample size.** If a single lag point moves 25 points on one
   trial with four trials, how many trials per lag would you want to detect a
   15-point dip? State your assumptions.
3. **Predict the catch-trial rate.** Before a block, write down what false-alarm
   rate would make you throw the block away, and why.
4. **Argue for the other condition.** Write three sentences defending reporting
   second-target accuracy over *all* trials rather than conditioning. Then
   write the reply.
5. **The applied claim.** Find a claim that the attentional blink explains a
   real-world failure of noticing, and identify which step of the inference
   assumes the laboratory task generalises.

## Citation and evidence notes

- **Raymond, Shapiro and Arnell (1992)** for the original two-target RSVP
  demonstration and the term itself.
- **Chun and Potter (1995)** for the two-stage consolidation account.
- **Visser, Bischof and Di Lollo (1999)** for lag-1 sparing and the conditions
  under which it appears and disappears.
- **Di Lollo, Kawahara, Ghorashi and Enns (2005)** for the temporary
  loss-of-control account, which is the clearest alternative to a bottleneck.
- **Olivers and Meeter (2008)** for the boost-and-bounce account.
- **Dux and Marois (2009)** for a review that treats the competing accounts as
  competing rather than settled.
- **Willems and Martens (2016)** on individual differences in the blink and on
  how cautiously they should be interpreted.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
