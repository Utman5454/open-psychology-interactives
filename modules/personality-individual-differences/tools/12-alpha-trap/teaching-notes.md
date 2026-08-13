# Teaching notes — The Alpha Trap

`modules/personality-individual-differences/tools/12-alpha-trap/`

Students are given a short, broad scale and one move: add another way of
asking a question it already contains. Alpha climbs; the scale narrows.

---

## Running it from the front

The trap is structural, not a matter of luck. The scale starts at alpha 0.684, just under the 0.70 a reviewer would ask for, and there is exactly one thing the learner can do about it: ask the same question again. Five additions later alpha is 0.852 and three fifths of the scale is about meeting deadlines.

The number to keep pointing at is not alpha. It is the third row of the readout: effective content areas, which falls 5.00 → 4.50 → 3.77 → 3.20 → 2.79 → 2.50 while "content areas covered" sits at five out of five the whole way. A scale can narrow without losing an area.

## Intended level

Second-year undergraduate and above, on a psychometrics, individual
differences, research methods or measurement strand. It assumes students have
met Cronbach's alpha as a formula or a line of software output, and have
probably been told that "0.7 is acceptable" without being told what the number
is sensitive to.

It works equally well as a corrective with postgraduates and staff, most of
whom have reported an alpha in a paper.

## Learning objectives

After the activity, a student should be able to:

1. explain that alpha rises with the number of items and with their average
   intercorrelation, and that neither is a property of the construct;
2. explain why a high alpha is not evidence of unidimensionality;
3. explain why a high alpha is not evidence of validity, and describe the
   bloated specific factor as the mechanism;
4. judge a scale on content coverage and item redundancy, not on its
   reliability coefficient alone;
5. treat a very high alpha in a short scale as a warning about redundancy.

## Estimated duration

- **Minimum demonstration from the front:** 8–10 minutes.
- **Students working individually or in pairs:** 20 minutes.
- **With full debrief and the two challenges:** 30–35 minutes.

## Preparation

None. It is a single web page that runs offline, needs no account and stores
nothing. Open it, or send students the link.

Two things are worth doing beforehand:

- Decide whether you want students to predict individually on the page, or to
  predict as a room. The page has a **Skip — I am demonstrating** button for
  the second case.
- Read the *simulation model* section at the foot of these notes, so you can
  answer "but where do these numbers come from?" — which someone always asks,
  and should.

## Suggested lecture or seminar use

**As a live demonstration (8 minutes).** Take a show of hands on the
prediction, then press **Add another way of asking it** five times with the
readout on screen. Read all three numbers aloud each time. Alpha reaches 0.852;
the outcome correlation ends *below* where it started. The silence at that
point is the lesson.

**As a seminar activity (20 minutes).** Students work in pairs through the
additions, the repair and the two challenges, then report back. Ask each pair
what the first addition did to the outcome correlation, and what the fifth did.
Those two answers are different, and the difference is the whole argument.

**As a lab preface.** Run it immediately before students compute alpha on real
data for the first time. The habit you are trying to install — look at the
items, not only at the coefficient — is cheapest to install before they have
any output of their own to defend.

## The prediction question

Asked on the page before the scale opens. In a lecture, ask it aloud:

> You have a five-item scale measuring "academic conscientiousness", one item
> from each of five content areas. The only thing you can do is add another way
> of asking a question it already contains. **How many of the five areas do you
> think the resulting scale will
> cover?** And **what would you expect it to correlate with a relevant
> outcome?**

Most rooms predict four or five areas, and a correlation around 0.6. Both are
wrong, and wrong in the direction that matters.

The page offers a fourth option on the second question — *alpha on its own
does not tell you* — which is the correct answer. Students who choose it get
feedback saying so. It is worth noting how few choose it before the
demonstration and how obvious it looks afterwards.

## Activity sequence

1. **Predict.** Both questions, then the scale opens.
2. **Add, five times.** One button. After each press, alpha, effective content
   areas and — after the reveal — the outcome correlation all move. The first
   addition is worth dwelling on: it *raises* the outcome correlation, which is
   why the lesson is not "never add items".
3. **The reveal.** On the fifth addition the simulated outcome correlation
   appears for the first time, and the feedback quotes the learner's own
   near-duplicate items back to them.
4. **Drop the repeats.** One button. Alpha falls from 0.852 to 0.711 and the
   outcome correlation rises from 0.536 to 0.581 — the highest figure anywhere
   in the model.
5. **Compare.** A table of the two scales side by side.
6. **Challenge 1 — diagnosis.** Three fictional published scales; choose the
   best measure. The intended answer is B, the middling alpha.
7. **Challenge 2 — transfer.** Predict what happens when four near-duplicates
   are added back to the repaired scale, then apply it and see.

## Debrief questions

Use these in the order given; each depends on the one before.

1. The bloated scale had a higher alpha than the repaired one. Which would you
   rather have published, and why?
2. What exactly did the extra paraphrases add to the total score? What did
   they add to the *construct*?
3. A reviewer writes: "the reliability of this scale is excellent (α = .93)".
   What have they established? What have they not?
4. Alpha went **up** and the correlation with the outcome went **down**. If
   reliability sets a ceiling on validity, how is that possible?
   *(Because reliability limits validity but does not supply it, and because
   the added variance was reliable variance that the outcome does not care
   about. Precision about the wrong thing is still precision.)*
5. When is a low alpha the more informative result? *(When it is telling you
   the total score is mostly error — which is what Scale C in Challenge 1
   shows, and what alpha is genuinely good at.)*
6. You have to evaluate a questionnaire and you may look at exactly one thing.
   Do you look at alpha, or at the items? Why?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "High alpha means the items measure one thing." | Alpha is not a test of dimensionality. A two-factor scale with enough items can have a high alpha; this simulation's alpha-chasing scale is unidimensional *and* narrow, which is a different problem again. Dimensionality is a question for factor analysis. |
| "Alpha above 0.9 is excellent." | For a broad construct in a short scale, it usually means the items repeat each other. Ask what alpha would be if you photocopied one item ten times. |
| "More items always make a scale better." | They always make alpha bigger. Challenge 2 exists to separate those two claims. |
| "The repaired scale is worse — its alpha is lower." | Ask which scale they would rather use to predict something, and note that they have just answered a different question from the one alpha answers. |
| "So alpha is useless." | Overcorrection, and worth heading off. A low alpha is a real warning; alpha is a reasonable summary of internal consistency. The claim is only that it is not sufficient. |
| "This is rigged." | It is — deliberately, and the page says so. Point at the model description: the wording factor is put there on purpose because the failure mode it produces is real. The rigging is the demonstration, not a trick. |

## Limitations and cautions

State at least the first three aloud. They are also written on the page.

- **These are not data.** Every figure is what a fictional model implies for a
  population. Nothing here was measured on anyone. No number is a norm, a
  validated coefficient or a cut-off.
- **No sampling error is modelled.** A real alpha is a sample estimate with a
  confidence interval, often wider than people expect. The tool shows point
  values only, and deliberately does not offer a spurious interval around a
  quantity that has no sample behind it.
- **The construct is invented.** "Academic conscientiousness" and its five
  areas were written for this page. Nothing here is a claim about the structure
  of conscientiousness, and these items are not a usable questionnaire.
- **Narrow is not the same as wrong.** A scale built to measure one facet is
  perfectly legitimate if it is described that way. The failure modelled here
  is claiming broad coverage while measuring narrowly.
- **Alpha is not on trial.** The target is the inference from alpha to
  validity, not the coefficient.
- **The tool assesses nobody.** Students choose items; they do not answer them.
  There is no score, no profile and no feedback about any person.
- **Item source.** Every item was written for this tool. No published or
  commercial instrument is reproduced, in whole or in part.

## Accessibility considerations

- Everything is operable from the keyboard using native checkboxes, radio
  buttons and buttons. No custom widgets, no drag interactions.
- The coverage chart is hidden from assistive technology and paired with a
  visible table carrying the same numbers, so nobody is asked to interpret a
  graphic they cannot see. Each bar is also labelled with its own count.
- Changes are announced through a polite live region: the item added or
  removed, the item count, alpha, areas covered and any near-duplicate pairs.
- The redundancy and outcome verdicts state their severity in words
  ("None", "Some", "Heavy") as well as by border colour.
- Progress through the three stages is carried by `aria-current` and by visible
  text, not by colour.
- Nothing animates, so a reduced-motion preference has nothing to switch off.
- Usable at 320px and at projector widths. The scale list stacks above the
  results on narrow screens.
- If you are running this with a screen-reader user in the room, the live
  announcements make all three figures audible on every addition, which is
  actually a better experience of the demonstration than watching a number
  change.

## Optional extension tasks

1. **The honest scale report.** Write the two sentences you would put in a
   methods section describing the bloated scale, without misleading the reader.
   Students discover that an honest description of it is close to an admission
   that it should not be used.
2. **Break it the other way.** Build the scale with the *lowest* alpha that
   still covers all five areas. What would you have to conclude about a real
   measure that looked like this? (Answer: that it is either measuring several
   things or measuring one thing badly — and that alpha alone cannot say
   which.)
3. **Find the ceiling.** Ask students to reach alpha 0.85 without using two
   items from the same wording family. They cannot; the maximum is 0.844. That
   the trap has no honest solution is worth showing explicitly.
4. **Take it to the literature.** Find a published scale in your field
   reporting α > 0.90 with fewer than ten items. Read the items. Ask how many
   distinct questions are being asked.

## The simulation model

Reproduced here so you can check what the tool is claiming. It is also
documented at the top of `tool.js`.

Each item is standardised and generated from four independent sources:

```
X_i = g_i·G  +  f_i·F(content area)  +  w_i·W(wording family)  +  e_i
```

where `G` is a general factor common to all items, `F` is specific to one of
the five content areas, and `W` is shared only by items that paraphrase each
other. The correlation between two items is therefore

```
r_ij = g_i·g_j  +  f_i·f_j [same area]  +  w_i·w_j [same wording family]
```

Loadings: distinct items `g = 0.55, f = 0.32`; paraphrase items
`g = 0.45, f = 0.30, w = 0.62`. The implied item correlations are 0.68 between
two paraphrases, 0.41 between two distinct items in the same area, and 0.20 to
0.30 across areas.

The simulated outcome — fictional tutor-rated dependability — is

```
Y = 0.55·G  +  0.55·(F1 + F2 + F3 + F4 + F5)/√5  +  noise
```

so it responds to the general factor and to breadth of coverage, and is
completely indifferent to wording-specific variance. Adding paraphrases
inflates `Var(T)`, the denominator of the validity coefficient, while adding
nothing to its numerator. That asymmetry is the entire demonstration.

Alpha is computed from the total-score variance in the usual way,
`α = (k/(k−1))·(1 − k/Var(T))`. Because the items are standardised, the raw and
standardised forms coincide.

### Reference values

Computed from the model, and worth having to hand when a student asks whether
their result is typical:

The sequence the learner walks, one press at a time:

| Additions | Items | Alpha | Areas | Effective areas | Outcome r |
| --- | --- | --- | --- | --- | --- |
| none (the starting scale) | 5 | 0.684 | 5 of 5 | 5.00 | 0.573 |
| 1 | 6 | 0.711 | 5 of 5 | 4.50 | 0.581 |
| 2 | 7 | 0.753 | 5 of 5 | 3.77 | 0.574 |
| 3 | 8 | 0.793 | 5 of 5 | 3.20 | 0.562 |
| 4 | 9 | 0.826 | 5 of 5 | 2.79 | 0.549 |
| 5 | 10 | 0.852 | 5 of 5 | 2.50 | 0.536 |
| repeats dropped | 6 | 0.711 | 5 of 5 | 4.50 | 0.581 |

Three things to draw out of that table. Alpha rises monotonically. The outcome
correlation peaks at the *first* addition and falls thereafter, so the honest
lesson is about repetition rather than about length. And "areas covered" never
moves, which is why the readout carries effective content areas as well —
the inverse Simpson index over the area proportions, which is the number of
areas the scale behaves as though it has.

### Two guarantees, checked exhaustively

Both were verified by enumerating the relevant space rather than by sampling,
so neither depends on which items a particular student happens to pick.

- **Alpha rises and breadth falls at every single step.** Not on average, and
  not usually: at each of the five additions, alpha is higher and effective
  breadth lower than at the step before. The learner cannot get a run of the
  demonstration in which the two move together.
- **The repaired scale is the best predictor in the model.** Its outcome
  correlation, 0.581, is higher than any point in the addition sequence,
  including the starting scale. Dropping items improved the scale.
- **Challenge 2 always behaves as described.** Adding the four remaining
  deadline paraphrases back to the repaired scale raises alpha and lowers the
  outcome correlation. There is only one repaired scale, so there is no
  student-specific case in which the explanation is wrong.

## Citation and evidence notes

The demonstration is a teaching illustration, not a finding. The ideas behind
it are long-standing in the psychometric literature and are worth pointing
students at:

- **Cronbach (1951)**, who introduced the coefficient, is explicit that it is
  not an index of unidimensionality — a caveat lost almost immediately in
  applied use.
- **Cattell's "bloated specific"** names the failure mode reproduced here: a
  cluster of near-synonymous items producing a narrow factor with excellent
  internal consistency.
- **Boyle (1991)**, *Does item homogeneity indicate internal consistency or
  item redundancy in psychometric scales?*, is the most direct statement of
  this argument and is a good single reading to set alongside the tool.
- **Sijtsma (2009)**, on the misuse of alpha, and **McNeish (2018)**,
  *Thanks coefficient alpha, we'll take it from here*, cover the modern
  alternatives (omega, and why the assumptions behind alpha usually fail).
- **Clark and Watson (1995)** on scale construction is the practical
  counterpart: aim for a moderate average inter-item correlation, and treat a
  very high one as a redundancy warning.

Full references are deliberately not embedded in the page, so that the tool
does not appear to derive its numbers from any of them. The numbers come from
the model above and from nowhere else.
