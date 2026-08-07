# Teaching notes — Aphasia Profile Comparator

`modules/neuropsychology/tools/07-aphasia-profile-comparator/`

There is no most informative language measure. There is only the most
informative measure for the contrast you are trying to make.

---

## Running it from the front

The pair worth starting with is A against D. They differ by five points on repetition and by one point or less on everything else. That is as clean a demonstration as this material offers that repetition needs something the rest of the profile does not, and it maps directly onto the disconnection argument in the Network Disconnection Mapper.

Then A against B, where two measures separate them almost equally. Ask which one you would want if you could only have one, and why "the largest gap" is not automatically "the most informative".

Profile F fits none of the textbook patterns. It is not a trick, and it is not rare: a substantial minority of people assessed for language difficulty after a stroke do not fit any classical category.

## Intended level

Second-year undergraduate neuropsychology, or a language-and-the-brain strand.
No clinical experience is assumed and no clinical materials are used. It
follows well from the Network Disconnection Mapper, whose repetition route this
tool turns into evidence.

## Learning objectives

After the activity a student should be able to:

1. say which measure carries the most information about a given contrast, and
   why that is not a property of the measure alone;
2. explain why repetition is disproportionately informative;
3. recognise a near tie and say why "the largest gap" stops helping;
4. explain why the classical categories fit a substantial minority badly;
5. state why a profile constrains processing more tightly than anatomy.

## Estimated duration

- **Demonstration from the front:** 8 minutes — profiles A against D, then A
  against B.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Read the "no categories, no clinical materials" panel aloud. Students
who know the textbook labels will try to apply them, and the tool is built to
make that difficult on purpose.

## The demonstration worth doing from the front

**Profiles A and D.** Both speak in short effortful phrases; both understand
well. Five points apart on repetition, one point or less on everything else.
Ask: *what does one of these people have that the other does not?* Whatever it
is, it is needed for repeating a sentence and not for understanding one or for
producing effortful speech.

Then **profiles C and D**, which err in opposite directions on repetition — one
repeats far worse than they speak or understand, the other far better. Two
profiles going opposite ways on the same measure is the crossover argument
applied to a language profile.

Then **profiles A and B**, where fluency separates by seven and understanding
by six. Ask which one you would keep if you could have only one. Fluency
bundles six things; understanding is closer to a single question. The largest
gap is not automatically the most informative.

Finally, put **A against A**. Every separation is zero. It is worth doing once,
because it makes explicit that separation is a property of a pair.

## Prediction question

> Two fictional people both speak in short effortful phrases and both
> understand what is said to them. One can repeat a spoken sentence back
> accurately and the other cannot. What does the repetition difference tell
> you?

Intended: *that something needed for repetition, and not for effortful speech
or for understanding, differs between them*. "Different categories" is a label
rather than an explanation, and the feedback says so.

## Activity sequence

1. **Commit to the opening judgement.**
2. **A against D.** Repetition, by five.
3. **C against D.** Repetition again, in the opposite direction.
4. **A against B.** The near tie, and the argument about compounds.
5. **B against C.** Understanding, by six — the contrast fluency cannot make.
6. **Free exploration.** Ask each pair to find a comparison where the winning
   measure is one they would not want to rely on.
7. **The challenge** on profile F.

## Debrief questions

1. Repetition separates A and D almost perfectly and does nothing for A against
   C. What does that say about "the most informative measure"?
2. Why can repeating a sentence be done without understanding it, and why does
   that make the task useful?
3. A and B are separated by fluency by seven and understanding by six. Which
   would you rather have, and why?
4. Naming is impaired in nearly every profile. Does that make it useful or
   useless, and for what?
5. Profile F fits no category. Is that a problem for profile F or for the
   categories?
6. Every measure here is a compound. Pick one and list what it bundles
   together.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Repetition is the most useful measure." | Only for some contrasts. It does nothing for A against C, where both are poor at it for possibly different reasons. |
| "Naming is the key measure — everyone notices it." | It is impaired almost everywhere, which makes it a poor discriminator. Noticeable and informative are different things. |
| "A and D are different syndromes." | That restates the difference. Ask what one has that the other does not. |
| "Profile F must be a testing error." | Uneven profiles are common. Assuming an error each time would discard a substantial minority of assessments. |
| "Fluent means the language is fine." | Fluent bundles rate, phrase length, effort, articulation, structure and content. Profile B is fluent and conveys very little. |
| "These profiles tell you where the damage is." | The tool mentions no anatomy anywhere. Language depends on a distributed network and on the white matter joining it. |
| "The largest gap is always the answer." | When two are within a point, it is not. The tool says so in its own feedback. |

## Limitations and cautions

- **No clinical materials.** No standardised battery, subtest or item is
  reproduced. The task descriptions are original and the 0–10 scale is a
  teaching device.
- **Nobody is assessed.** Six invented profiles; no real person or published
  case appears.
- **Six measures is a caricature.** Real assessment separates single-word from
  sentence comprehension, word from non-word repetition, regular from
  irregular reading, and much more.
- **Profiles are snapshots.** They change with time since onset, fatigue,
  material and day.
- **No syndrome is named**, deliberately. If students map the profiles onto
  labels, ask how much of the individual pattern the label discards.

## Accessibility considerations

- Native select, radio and button controls.
- The chart is `aria-hidden` and paired with a table giving each measure, what
  it asks for, both scores and the separation, with the largest separation
  named **in words** in its own cell. A second table gives all six profiles on
  all six measures with the selected pair marked.
- The two profiles are distinguished by fill **and** by the profile letter
  printed at the start of each bar; every bar prints its own score.
- The chart is pinned at 358px, so both profiles stay visible while the
  measure radios at the bottom of the control column are used. Verified at
  1366×768 and 375×812.
- Pair selection and answer checking announce through the polite live region.
- No horizontal page scroll at 320px.

## Optional extension tasks

1. **Split a measure.** Take fluency and propose three measures to replace it.
   Which pair of profiles would each of them separate better?
2. **Add a measure.** Repeating non-words is not in the set. Where would you
   expect each profile to score, and which contrasts would it sharpen?
3. **Design the discriminating pair.** Invent profile G such that only writing
   separates it from profile A.
4. **Map and discard.** Assign textbook labels to profiles A to E and list what
   each label throws away.
5. **Look up the anatomy.** Find a modern lesion-symptom mapping study of
   repetition and compare its conclusions with the classical diagram.

## The model

Scores run 0 to 10, where 10 is performance indistinguishable from a fictional
control group. Separation is the absolute difference. The most informative
measure for a pair is the largest separation; measures within **one point** of
it are reported as a near tie.

| Measure | A | B | C | D | E | F |
| --- | --- | --- | --- | --- | --- | --- |
| Fluency of spontaneous speech | 2 | 9 | 8 | 3 | 2 | 6 |
| Understanding what is said | 8 | 2 | 8 | 8 | 2 | 5 |
| Repeating what was said | 3 | 3 | 2 | 8 | 2 | 5 |
| Naming things | 4 | 3 | 5 | 4 | 1 | 3 |
| Reading aloud | 4 | 3 | 6 | 4 | 2 | 7 |
| Writing | 3 | 3 | 5 | 3 | 1 | 2 |

### Reference comparisons a lecturer can check

| Pair | Winning measure | Gap | Note |
| --- | --- | --- | --- |
| A vs D | Repetition | 5 | Everything else 1 or less — the cleanest separation available |
| A vs B | Fluency | 7 | Understanding at 6 — a near tie |
| C vs D | Repetition | 6 | Fluency at 5 — a near tie; the two err in opposite directions |
| B vs C | Understanding | 6 | The contrast fluency cannot make |
| A vs C | Fluency | 6 | Repetition separates them by 1 — both poor, possibly for different reasons |
| A vs A | none | 0 | Every separation zero |

## Citation and evidence notes

- **Goodglass and Kaplan**, and the classical taxonomy generally, for where
  the categories came from. The tool deliberately does not use their materials
  or their labels.
- **Caramazza (1984)** and **Schwartz (1984)** on why syndrome categories are
  a poor unit of analysis for cognitive neuropsychology.
- **Basso, Lecours, Moraschini and Vanier (1985)** and **Willmes and Poeck
  (1993)** on how often the classical anatomical claims fail to hold.
- **Fridriksson et al. (2018)** and **Mirman et al. (2015)** for modern
  lesion-symptom mapping of language, and how much less tidy it is than the
  diagrams.
- **Baldo, Klostermann and Dronkers (2008)** on repetition and the
  short-route account.
- **Hillis (2007)** for a review of the network view of language after stroke,
  including the contribution of diaschisis and perfusion to acute profiles.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional profiles from any of them.
