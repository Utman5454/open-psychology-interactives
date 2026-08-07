# Teaching notes — Reverse-Item Disaster

`modules/personality-individual-differences/tools/13-reverse-item-disaster/`

Four ways to score the same six items. One is right. Two are loud. One is
silent.

---

## Running it from the front

Move through the four methods in this order: no recoding, reversed-in-the-head, wrong maximum, correct. The first two are arithmetically identical and produce an obvious disaster — negative item-total correlations and a scrambled order. The third is the dangerous one: alpha barely moves, no item statistic looks wrong, and every score is a point or two out.

## Intended level

First-year undergraduate, or any student about to score their own
questionnaire data for the first time. It is the most practical tool in the
module and the one most likely to prevent a real mistake.

## Learning objectives

After the activity a student should be able to:

1. recode a reverse-keyed item correctly for a given scale range;
2. recognise a negative corrected item-total correlation as a scoring signature;
3. explain why the wrong-maximum error is harder to catch than forgetting;
4. distinguish understanding an item as reversed from recoding its number;
5. state the costs of reverse wording as well as its benefits.

## Estimated duration

- **Demonstration from the front:** 8 minutes.
- **Students working through all four methods and the repair:** 20 minutes.
- **With the debrief:** 30 minutes.

## Preparation

None.

## The prediction question

> A researcher scores this scale and forgets to recode the two reverse-keyed
> items. **What is the most serious consequence?**

Most students say alpha drops — which is true, taught, and the least important
answer available. The consequence that matters is that the respondents come
out in the **wrong order**, so every subsequent correlation is computed on
scores that describe different people from the ones measured.

## The sequence worth following

Move through the methods in this order. The order is the argument.

1. **No recoding at all.** Loud. Item-total correlations on items 3 and 5 go
   negative, alpha collapses, the ranking scrambles. Anybody inspecting item
   statistics catches this.
2. **Reversed in the head, not in the data.** Identical arithmetic, different
   mistake. Worth dwelling on: a researcher who fully understood the item
   wording produced exactly the same corrupt dataset as one who never noticed.
3. **Wrong scale maximum.** The dangerous one. Subtracting from 6 instead of
   5 — or assuming a 1–6 scale — shifts every reverse answer by exactly one
   point. Alpha barely moves. No item-total correlation looks wrong. Nothing
   in the output is anomalous, and every score is wrong.
4. **Correct recoding.** For comparison.

Say at step 3: *this is the one that gets published.*

## Debrief questions

1. Which of the three errors would you catch in your own data, and how?
2. The wrong-maximum error moves every reverse answer by exactly one point.
   Why does alpha barely notice?
3. Two of the methods are arithmetically identical. Why are they listed
   separately?
4. A colleague reports a negative item-total correlation. Give three
   explanations besides mis-scoring.
5. If reverse items cause this much trouble, why include them at all?
6. What would you write in a pre-registration to make this error impossible?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Alpha will catch it." | Load the wrong-maximum method and look at alpha. It barely moves. |
| "I understood the item was reversed, so I scored it right." | Method 2 exists for exactly this. Understanding is not recoding. |
| "Subtract from the number of points." | A 1–5 scale has five points and you subtract from six. The rule is min + max, not the count. This is the origin of the wrong-maximum error. |
| "It only affects two items out of six." | And it moves those two in the wrong direction, so the error is doubled relative to simply dropping them. |
| "Reverse items are best practice." | They are a trade. See the Response-Style Simulator for the benefit and this tool's debrief for the cost. |
| "You could just delete the reverse items." | Then acquiescence is unopposed, and you have changed what the scale measures. |

## The repair mode

Two reverse items, one respondent, one at a time, with the formula displayed
and the arithmetic done by the student. The input recognises three responses
specifically:

- the **correct** value;
- the **wrong-maximum** value, which gets a specific correction rather than a
  generic "no";
- the **raw** value unchanged, which gets the "reading it as reversed is not
  recoding it" message.

That specificity matters: a student who types 2 instead of 1 has made a
diagnosable error, and being told which one is the teaching.

## Limitations and cautions

- **These are not data.** Six original items, six fictional respondents whose
  answers were written so the true ordering is unambiguous.
- **Six respondents is far too few** for real item analysis. The alpha and
  item-total figures illustrate a *direction*, not a magnitude, and would be
  wildly unstable in reality.
- **The answers were written to make the point.** Real reordering would be
  messier and harder to see.
- **A negative item-total correlation has other causes** — a badly written
  item, a double-barrelled item, genuine multidimensionality.
- **Alpha is not the diagnostic.** See The Alpha Trap for why it is weak
  evidence generally.

## Accessibility considerations

- Every item states its keying in words ("Reverse-keyed"), never by tint alone.
- Every recoded cell prints the transformation as text — "5 → 1" — so the
  recoding is legible without interpreting a highlight.
- Item-total correlations carry a written reading ("negative — flags a
  problem").
- The profile chart is hidden from assistive technology, and each bar is
  labelled in text with whether it is the correct or the current total.
- The repair input accepts Enter as well as the button, and gives error-specific
  feedback rather than a generic rejection.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Write the syntax.** Write the recoding line you would use in your usual
   software, and say how you would check it worked.
2. **Design the check.** What single output would you inspect after scoring any
   scale, before doing anything else? *(Corrected item-total correlations, for
   every item.)*
3. **The seven-point scale.** The same scale with responses 1–7. What is the
   recoding formula, and what would the wrong-maximum error look like?
4. **Argue for removal.** Make the case for a questionnaire with no reverse
   items, and say what you would do about acquiescence instead.

## The model

Also documented at the top of `tool.js`. For a scale running min to max:

```
recoded = (min + max) − raw
```

so for 1–5, `recoded = 6 − raw`.

| Method | Formula on reverse items | Character |
| --- | --- | --- |
| Correct recoding | 6 − raw | The intended scoring |
| No recoding | raw | Loud: negative item-totals, alpha collapses |
| Reversed in the head | raw | Same arithmetic, different mistake |
| Wrong scale maximum | 7 − raw | Silent: every reverse answer one point too high |

Corrected item-total correlation is each item against the total of the *other*
five. Alpha is computed from the item variances and the total variance in the
usual way.

### The scale

Six original items about persistence. Items 3 ("I give up on things once they
become difficult") and 5 ("I move on to something else as soon as progress
slows") are reverse-keyed.

### The respondents

| | Answers | Correct | No recoding | Wrong maximum |
| --- | --- | --- | --- | --- |
| A | 5, 2, 1, 5, 1, 5 | 27 | 19 | 29 |
| B | 4, 5, 4, 5, 2, 5 | 25 | 25 | 27 |
| C | 3, 3, 1, 4, 1, 3 | 23 | 15 | 25 |
| D | 4, 3, 1, 3, 2, 3 | 22 | 16 | 24 |
| E | 3, 4, 5, 2, 2, 5 | 19 | 21 | 21 |
| F | 1, 1, 5, 4, 5, 1 | 9 | 17 | 11 |

Correct order **A > B > C > D > E > F**. With no recoding it becomes
**B > E > A > F > D > C** — all six change position. Under the wrong maximum
the order is unchanged and every total is exactly two points too high.

**Why the answers are not tidier.** An obvious first draft gives each
respondent perfectly consistent answers (5,5,1,5,1,5 and so on). That set does
*not* reorder when the reverse items are left unrecoded: with only two of six
items reversed, the four positive items still dominate the total, so the error
compresses the scores without changing anybody's rank — and the tool's central
claim would have been false. These answers carry the ordinary inconsistency
real respondents show, which is enough for the reordering to appear while the
correct ordering stays unambiguous. Respondent E is the most mixed and moves
furthest, which is worth pointing out: the people a scoring error damages most
are the ones who answered least consistently.

Reference statistics: alpha is 0.78 under correct scoring, −0.04 with no
recoding (four items showing negative corrected item-total correlations), and
0.78 again under the wrong maximum — identical to correct, with no negative
item-totals and nothing anomalous anywhere in the output.

## Citation and evidence notes

- **DeVellis, *Scale Development***, for the standard treatment of reverse
  wording and its scoring.
- **Weijters and Baumgartner (2012)**, *Misresponse to reversed and negated
  items*, on how often respondents themselves get reverse items wrong — a
  problem that survives correct scoring.
- **Marsh (1996)** on negative-item method factors, for why reverse items so
  often produce an artefactual second factor.
- **Podsakoff et al. (2003)** on common method variance, for the wider context.
- **Schmitt and Stults (1985)** on the effect of even a small proportion of
  careless respondents on reverse-item factor structure.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its items from any of them.
