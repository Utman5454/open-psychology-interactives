# Teaching notes — False Memory and Source Monitoring

`modules/cognitive/tools/10-false-memory-source-monitoring/`

The lesson is not that memory is unreliable. It is that "did you see it", "how
sure are you" and "where did it come from" are three questions, and the answers
do not have to agree.

---

## Before you run this

- **Say nothing about related words before the study phase.** The whole effect
  depends on nobody looking for it. If you announce it, you have run the
  warning condition from the challenge instead.
- **It works fresh twice.** Six themes; each run spends three. The tool prints
  how many are left, and that record survives a reset on purpose.
- **The tone matters.** This is not a "your memory is unreliable" reveal, and
  the tool refuses to frame it as one. Every intrusion is to a word that
  genuinely captures the theme of what was studied.
- **The worked example needs no study phase**, which makes it the right route
  for a room that has already done it once.

## Intended level

First- or second-year undergraduate. It works well immediately before any
teaching on eyewitness memory, because it gives students a concrete case of
gist-based intrusion before they meet the applied claims.

## Learning objectives

After the activity a student should be able to:

1. describe recognition, confidence and source as three separable measures;
2. explain a thematic intrusion in terms of gist encoding;
3. say what source monitoring is and why it is an inference;
4. use an unrelated-new baseline to interpret an endorsement rate;
5. predict the differential effects of source distinctiveness, delay, warning
   and list length.

## Estimated duration

- **Demonstration from the front:** 6 minutes — the worked example's three
  rows.
- **Students running one study–test cycle:** 8–10 minutes.
- **With the challenge and the debrief:** 25 minutes.

## Preparation

Run it once yourself, with a set of themes you will then not use with the
class. Knowing what the intrusion feels like from the inside is worth more than
any description of it.

## The prediction question

> Which do you expect to be hardest?

Four options. The intended answer is *remembering which source an item came
from*, and the feedback explains why: source is inferred at retrieval rather
than retrieved as a tag. The most useful wrong answer is *knowing how confident
to be* — the feedback agrees it is worth watching, because confidence tracks
familiarity rather than accuracy.

## The demonstration worth doing from the front

1. Let the room complete the task **before you say anything at all**.
2. Ask for a show of hands: *who said "seen" to the word HARBOUR?* (Substitute
   whichever lures came up.) Then: *who was certain?*
3. Now say that HARBOUR was never presented. Do not make a spectacle of it.
4. Immediately ask the useful question: *what was on the list that made
   HARBOUR feel familiar?* Students will list the items themselves, and that
   is the gist account arrived at from the inside.
5. Then load the **worked example** and point at the third row: unrelated words
   were endorsed 11 per cent of the time. That row is what makes the second row
   interpretable.

## Activity sequence

1. **Predict** which of the three questions will be hardest.
2. **Study** 24 items with their sources.
3. **Test** twelve words: seen or not, how sure, and from where.
4. **Read the three rows** — endorsement, confidence, source, separately.
5. **Open the item-by-item table** and find the intrusions.
6. **The challenge** — five changes, three of which move different measures.
7. **Debrief**, which is where the interpretation is done carefully.

## Debrief questions

1. What did the words on the list have in common with the word you falsely
   recognised? Is that a coincidence?
2. Why does the unrelated-new row have to be there before the related-word rate
   means anything?
3. Source accuracy was lower than recognition accuracy. Why would that be, if
   source were simply stored alongside the item?
4. A word felt familiar and you were confident. What is confidence a report
   about?
5. What would a memory system that never made this error be unable to do?
6. How far is it from a themed word list to an eyewitness account? Name three
   things that differ.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "This proves memory is unreliable." | It shows that a system storing gist accepts good fits to the gist. The intrusions are highly constrained — nobody falsely recognises TROMBONE. |
| "So eyewitness testimony is worthless." | An enormous leap from a word list to an event. The applied literature exists, is more careful than this, and is worth reading rather than inferring. |
| "I was confident, so I must have seen it." | Confidence tracks familiarity. Familiarity does not distinguish an item that was presented from an item that fits everything that was. |
| "Source memory just faded." | Source is not usually a stored tag that fades. It is inferred at retrieval from the qualities of what comes to mind, which is why making the sources more distinctive helps so much. |
| "The related words are basically the same as the studied ones." | They were never presented, and every argument about what "basically the same" means is the gist account being restated. |
| "My rate was high, so my memory is bad." | Twelve items, three or four per kind, and no correction for how freely you were willing to say "seen". |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Themes | six original themes, eight items each, one never-presented lure each |
| Themes per run | three (so the demonstration runs fresh exactly twice) |
| Study list | 24 items, blocked by theme, four per source within each theme |
| Sources | "the handout" and "the whiteboard", named in full above each item |
| Study pace | 1.5 s (default), 2.2 s or 3 s per item |
| Test set | 6 studied, 3 related lures, 3 unrelated new — shuffled |
| Recognition | not seen / seen–guessing / seen–fairly sure / seen–certain |
| Source | handout / whiteboard / I cannot tell, asked only of endorsed items |
| Time limit at test | none |

The lists are original to this tool. No published word list is reproduced, and
none is needed — the effect depends on semantic coherence, not on any
particular set of words.

## The worked example — reference values

A simulated class of **60 fictional participants**, seed **20261001**, twelve
test items each. Verified against the running tool.

| Kind of word | Tested | Called "seen" | Average confidence | Source |
| --- | --- | --- | --- | --- |
| Studied | 360 | 85% | 2.5 of 3 | 70% correct |
| Related, never shown | 180 | 61% | 2.2 of 3 | 78% were given a source they never had |
| Unrelated, never shown | 180 | 11% | 1.4 of 3 | 65% were given a source they never had |

Generator settings: endorsement .84 / .61 / .09; confidence given endorsement
with "certain" at .62 / .38 / .08 and cumulative "fairly sure" thresholds at
.92 / .80 / .35; source correct on .71 of placed studied items; and 72 per cent
of endorsed lures and unrelated items given a source they never had.

Three features are worth drawing out, and all three are **built into the
generator**:

1. related-but-absent words are endorsed far more often than unrelated ones;
2. those endorsements carry real confidence, only slightly below the studied
   items, whereas endorsements of unrelated words are mostly guesses;
3. source accuracy for genuinely studied items (70%) sits well below
   recognition accuracy (85%).

It illustrates the shape of the classic finding. It is not evidence for it, not
a norm and not anybody's data.

## What the tool refuses to do

**It will not produce a single memory score.** Combining the three measures
would hide exactly the dissociations the task exists to show.

**It will not moralise.** No congratulation, no "look how easily you were
fooled". The results prose describes and the debrief interprets.

**It will not correct for response bias**, and says so. The unrelated-new row
is provided so that a class can see why a correction would be needed.

## The challenge

| Change, and the outcome asked about | Answer |
| --- | --- |
| Far more distinctive sources → source errors | Falls |
| Far more distinctive sources → related-word endorsement | Little change |
| A week's delay → related-word endorsement | Rises |
| Forewarning → related-word endorsement | Falls (reduced, not abolished) |
| Longer theme lists → related-word endorsement | Rises |

The first two rows are the **same manipulation** asked about two different
measures, with different answers. That pair is the clearest statement available
that source monitoring and gist-based recognition are separate problems, and it
is worth stopping on.

## Limitations and cautions

- **Not a memory test** and not a measure of anybody.
- **Word lists are not events**; nothing here licenses applied conclusions.
- **Twelve test items**, three or four per kind.
- **Raw rates, uncorrected for bias.**
- **It works fresh twice.** After that it measures familiarity with this page.
- **A slower study pace makes everything easier, including the intrusions** —
  the pace setting is an accessibility measure, not a factor.
- **The worked example is simulated**, with the pattern set by hand.

## Accessibility considerations

- Study card changes at the learner's chosen pace and only its contents change;
  the test phase is not timed; nothing animates or transitions.
- Sources are distinguished by their full printed name and by a solid or dashed
  rule — never by hue.
- Response buttons state the answer in words including confidence, name the
  word being judged in their accessible name, and are at least 3rem tall.
- The stage track marks the phase by border, background, `aria-current="step"`
  and a number.
- The chart is paired with a five-column table; bars print their own percentage
  and mean confidence; the related-word bar is hatched.
- The study card is `aria-hidden` while presenting.
- Headings do not skip; focus moves to the results heading and to the first
  option of each question; forced-colours rules are supplied.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Correct for bias.** Using the unrelated-new row as a false-alarm rate,
   propose a correction for the related-word rate. What does it assume?
2. **Design the distinctiveness manipulation.** How would you make two sources
   genuinely more distinguishable without also making the items easier to
   remember?
3. **Predict the remember/know split.** If people were asked whether they
   *recollect* the item or merely *know* it was there, what would you expect for
   each of the three kinds of test word?
4. **The applied claim.** Find a media claim about "implanted memories" that
   cites work of this kind, and identify the first step of the inference that
   goes beyond the evidence.
5. **Write the careful sentence.** In one sentence, state what this
   demonstration shows, with no exaggeration in either direction.

## Citation and evidence notes

- **Deese (1959)** and **Roediger and McDermott (1995)** for the list-learning
  paradigm this task is modelled on. The word lists here are original; the
  design is the borrowed part.
- **Johnson, Hashtroudi and Lindsay (1993)** for the source-monitoring
  framework, and for source as an attribution rather than a retrieval.
- **Brainerd and Reyna (2002)** for fuzzy-trace theory and the gist/verbatim
  distinction.
- **Gallo (2010)** for a review of false recognition, including how much
  warnings reduce it and how much they do not.
- **Yonelinas (2002)** for familiarity and recollection as separable
  contributions to recognition.
- **Wixted and Wells (2017)** for how carefully confidence and accuracy should
  be related in the applied case — a useful corrective to the classroom
  version of "confidence means nothing".
- **Loftus (2005)** for the misinformation literature, and for its author's own
  statements about the limits of the inference.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
