# Teaching notes — Measurement-Invariance Translator

`modules/personality-individual-differences/tools/21-measurement-invariance-translator/`

Manufacture a group difference between two groups who do not differ at all,
using nothing but one item's intercept.

---

## Before you run this

The two groups are **Group A** and **Group B**. They have no nationality,
ethnicity, language, region or culture, and the tool cannot support any claim
about any real population.

Where the tool explains why an item might behave differently, it does so in
terms of a **setting** — whether disagreeing openly is invited or costly —
rather than a people. That distinction is the whole reason the tool is safe to
teach with: the mechanism is about the situation a person is answering from,
not about who they are.

If a student wants to apply this to real group comparisons, the honest answer
is that this is exactly the machinery you would need, and that running it
properly means fitting nested models to real data rather than moving sliders.

## Intended level

Third-year undergraduate or postgraduate. It assumes familiarity with factor
loadings. It pairs with the Culture-Fair Test Challenge, which asks what
evidence comparability requires; this tool shows what that evidence looks like.

## Learning objectives

After the activity a student should be able to:

1. recognise loading and intercept differences from a graph;
2. state what each level licences;
3. explain why an observed mean difference is not yet a finding;
4. explain how an item can be harder to endorse at the same level of the trait;
5. confine claims to the level of invariance actually reached.

## Estimated duration

- **Demonstration from the front:** 8 minutes — the intercept preset alone.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## The demonstration worth doing from the front

Load **One item harder to endorse**.

- Both latent means are **0.00** — the groups are identical on the trait.
- The observed means differ anyway.
- Only one thing changed: the intercept on "I speak up when I disagree with
  the group".

Say it plainly: *these two groups do not differ. A study comparing raw means
would report that they do, and would be describing an item rather than a
person.*

Then load **A real trait difference** and compare. The observed numbers look
similar in both cases. Only the invariance evidence tells them apart — which
is the argument for doing the test.

## The prediction question

> A four-item assertiveness scale is given to two groups. Group B scores
> higher, significantly, with a large sample. **What does that establish?**

"Group B is more assertive" is the answer to dislodge. The tool then lets
students build a case where the observed difference is real, significant, and
entirely produced by one item.

Note that the third option — "the scale is biased against group A" — is also
corrected, more gently. Bias has a technical meaning here, is established by
evidence rather than asserted, and is not an accusation about anybody's
intentions.

## Activity sequence

1. **Commit to an answer.**
2. **Everything equal.** Baseline: lines lie on top of each other, all three
   rungs hold.
3. **A real trait difference.** Lines still coincide; the groups sit at
   different points along them.
4. **One item harder to endorse.** The vertical gap. Latent means identical,
   observed means not.
5. **One item measures differently.** A slope difference. Now even
   correlations are off the table.
6. **Free exploration.** Ask students to break scalar invariance while keeping
   metric, then to break both.
7. **The challenge**, which is scored against whatever they have currently set.

## Debrief questions

1. In the intercept preset, what exactly is different about the two groups?
2. Why does a loading difference cost you more than an intercept difference?
3. A study reports metric but not scalar invariance. What may it still claim?
4. Why does the tool refuse to give you a fit index or a p-value?
5. The speaking-up item is harder to endorse in one setting. Is that a problem
   with the item, with the scale, or with the comparison?
6. What would you write in a results section if you found partial invariance?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "A significant difference is a real difference." | The intercept preset. Significant, large sample, latent difference exactly zero. |
| "Non-invariance means the scale is broken." | Metric-but-not-scalar is common and usable. It costs you means, not everything. |
| "You can fix it by dropping the bad item." | Sometimes, and it changes what the scale measures. Partial invariance is a real option with its own literature and its own critics. |
| "Invariance is about fairness." | It is about whether numbers mean the same thing. Fairness is a further argument that needs this evidence but is not identical to it. |
| "Scalar invariance means the groups are equal." | It means they can be *compared*. They may still differ, genuinely — that is the point of the "real trait difference" preset. |
| "This proves group differences are artefacts." | It proves they *can* be. Which they are in any real case is an empirical question this tool cannot answer. |

## Limitations and cautions

- **No real group is modelled.** See the note at the top.
- **No model is fitted.** Invariance is read straight off the parameters.
  Real testing compares nested models and weighs changes in fit indices, with
  judgement, sample-size sensitivity and disagreement about cut-offs.
- **No fit statistics or p-values are invented**, deliberately.
- **Partial invariance is not modelled.**
- **Four items, two groups** is the simplest possible case; real work often
  involves more of both, or longitudinal rather than group comparisons.

## Accessibility considerations

- Each item's parameter group is a `fieldset` whose floated `legend` carries
  the item text, so sliders are never announced orphaned.
- Every slider announces what it controls in words — "how readily this item is
  endorsed at an average level of the trait" rather than a bare number.
- The item-behaviour panels are hidden from assistive technology and paired
  with a table giving every loading and intercept, plus a column saying in
  words whether the slope, the level, or both differ.
- The ladder gives each level in **plain language first**, its status as the
  word "Holds" or "Does not hold", and the technical term second — so the
  status is never carried by border colour.
- The two groups' lines differ by colour, dash pattern and an A/B label.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Break metric while keeping the means equal.** Then say what a researcher
   comparing correlations would wrongly conclude.
2. **Write the results paragraph.** Report the intercept preset honestly in
   three sentences.
3. **Design the follow-up.** You find non-invariance on the speaking-up item.
   What would you do next, and what would you need to collect?
4. **Longitudinal version.** The same logic applies to one group measured
   twice. What would non-invariance mean there? *(That the measure changed, not
   the people — which is fatal to a study of change.)*

## The model

Also documented at the top of `tool.js`.

```
mean(item, group) = intercept(item, group) + loading(item, group) × latentMean(group)
```

Invariance is determined directly, with a tolerance of 0.04:

| Level | Condition | Licences |
| --- | --- | --- |
| Configural | same items, one factor, both groups | the construct has the same shape |
| Metric | loadings equal across groups | comparison of relationships |
| Scalar | loadings **and** intercepts equal | comparison of means |

### The four presets

| Preset | What differs | Levels holding |
| --- | --- | --- |
| Everything equal | nothing | all three |
| A real trait difference | latent means only | all three |
| One item harder to endorse | intercept on item 1 | configural, metric |
| One item measures differently | loading on item 1 | configural only |

### The items

Four original items about assertiveness. Item 1 — "I speak up when I disagree
with the group" — is the one whose intercept the presets move, because it is
the clearest real case: speaking up costs different amounts in different
settings, so equally assertive people endorse it at different rates.

## Citation and evidence notes

- **Meredith (1993)** established the measurement-invariance framework and the
  levels used here.
- **Vandenberg and Lance (2000)** review practice and are the source of the
  conventional testing sequence.
- **Cheung and Rensvold (2002)** on fit-index cut-offs — worth citing precisely
  because the cut-offs are contested, which is why this tool produces none.
- **Byrne, Shavelson and Muthén (1989)** on partial invariance, for the option
  the tool does not model.
- **Borsboom (2006)**, *When does measurement invariance matter?*, for the
  argument that this is a question about what scores mean rather than a
  statistical formality.
- **Putnick and Bornstein (2016)** for a practical review including reporting
  standards.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its parameters from any of them.
