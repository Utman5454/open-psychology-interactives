# Teaching notes — Facet-Level Detective

`modules/personality-individual-differences/tools/09-facet-level-detective/`

Two fictional people with the same broad trait score and visibly different
behaviour. Students work out why before any facet score is shown.

---

## Running it from the front

The two people in every case are constructed to average to the same broad score, so a prediction made from the broad score alone is necessarily identical for both — it is one number standing in for two. The reveal shows this as two columns of identical figures beside two columns that separate them.

## Intended level

First- or second-year undergraduate, on a personality, individual differences
or psychometrics strand. It assumes students have met the Big Five as five
scores and have probably not been shown what sits underneath them.

It also works with final-year students about to interpret trait profiles in a
project, who often need the bandwidth–fidelity point more than the first-years
do.

## Learning objectives

After the activity a student should be able to:

1. explain why a domain score, being an average, cannot distinguish two people
   who reach it from opposite directions;
2. predict specific behaviour from facet scores, and say why the domain score
   cannot do that job;
3. state the bandwidth–fidelity trade-off in both directions;
4. describe why the facet level is less settled and less reliably measured
   than the domain level;
5. explain how a domain score depends on the questionnaire's item sampling as
   well as on the person.

## Estimated duration

- **Demonstration from the front:** 8 minutes.
- **Students working individually or in pairs:** 20 minutes.
- **With the studio, the item-mix stage and full debrief:** 30 minutes.

## Preparation

None. A single page, runs offline, stores nothing.

Worth deciding in advance: whether students answer the opening question
individually on the page or as a room. The page has a **Skip — I am
demonstrating** button for the second case.

If you have already run **The Alpha Trap** with this group, the two tools make
a natural pair: that one is about a number that says less than it appears to,
and so is this one.

## The prediction question

Asked on the page before any facet is visible. Aloud, it is:

> Two people complete the same personality questionnaire. Their broad scores
> on one domain come out within a point of each other. Watched over several
> weeks they behave quite differently, in ways everyone who knows them
> recognises. **What is the most likely explanation?**

Rooms divide mostly between "the questionnaire is unreliable" and "they are in
different situations". Both are reasonable and both are wrong here, which is
what makes the question worth asking. The tool's feedback says so without
dismissing either, and points at the two other tools in this module where each
of those explanations *is* the right one.

## Activity sequence

1. **Commit to an explanation.** The evidence stays locked until they do.
2. **Assign the evidence.** Four behavioural observations, two people, no facet
   scores visible. Students decide from behaviour alone. This is the part that
   does the work: they are forced to notice that the behaviours fall into two
   kinds before anyone tells them there are two facets.
3. **Reveal.** Facet profiles appear, and each observation gets a verdict
   explaining which facet it loaded on and by how much.
4. **The two prediction columns.** The table shows the model's prediction from
   the broad score and from the facets. The two broad-score columns are
   *identical for every observation*. Point at this. It is the whole argument
   in one place: one number cannot separate two people, however reliable it is.
5. **Studio.** Students build their own matched pair. The target is a broad-score
   gap under one point with a facet gap over twenty.
6. **Item mix.** Predict, then drag. The two scores separate and cross over.
   Nothing about either person changed.

## Debrief questions

1. The broad-score columns in the prediction table are identical. Is that a
   flaw in the questionnaire, or in the person using it?
2. If facets predict specific behaviour better, why does anyone use domains?
   *(Aggregate outcomes, stability, replicability, and far fewer significance
   tests. Breadth predicts breadth.)*
3. You want to predict whether someone will meet a deadline next Tuesday.
   Domain or facet? What if you want to predict their degree classification?
4. In the last stage the rank order reversed. What exactly changed?
   *(The questionnaire. Not the people.)*
5. Two published studies measure "Conscientiousness" and disagree. Give two
   explanations that have nothing to do with either study being wrong.
6. If facets are more informative, why not go narrower still — down to single
   items? *(Reliability collapses. There is a floor, and single items are below
   it.)*

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "So the Big Five is wrong." | Overcorrection. Nothing here shows the domains are invalid — only that they are broad. A map at 1:1,000,000 is not wrong for omitting your street. |
| "Facets are the real traits." | Neither level is more real. They are descriptions at a chosen grain. Ask which grain they would want for predicting a single act, and which for predicting a career. |
| "This means personality scores are arbitrary." | The item-mix stage invites this and it needs heading off. The scores are systematic, reproducible and informative; they are also partly a property of the instrument. Both are true. |
| "The two people are basically the same, then." | They average the same. That is a fact about the average, not about them. |
| "Just always use facets." | Facet scales have fewer items, lower reliability, less agreement about their number and boundaries, and worse replication records. Going narrow has a real price. |
| "The questionnaire should just be fixed." | There is no mix that is correct in the abstract. The right mix depends on what the score is for — which is a design decision, not a measurement error. |

## Limitations and cautions

State the first two aloud.

- **These are not data.** The people are invented; the scores are illustrative
  values on an arbitrary 0–100 scale with no norms, no standard error and no
  reference sample. Nobody was measured.
- **Two facets per domain is a simplification.** Real facet systems have
  between two and six per domain and do not agree with one another. Two is
  enough to make the arithmetic visible.
- **Behaviour is modelled far too simply** — a straight line from facet scores,
  with no error, no situation and no interaction between traits. The
  Person–Situation Interaction Theatre in this module is where situations
  enter.
- **The tool assesses nobody.** Students read about fictional people; they
  answer nothing about themselves and receive no score or description.
- **Facet names are borrowed; values are invented.** The four facet pairs are
  named after a published two-aspect account of the Big Five, so that students
  learn vocabulary that exists. No published item, norm or finding is
  reproduced.

## Accessibility considerations

- Fully keyboard operable with native radios, a select, ranges and buttons. No
  custom widgets and no dragging.
- Each observation is a `fieldset` whose `legend` carries the behaviour, so a
  screen-reader user hears the question with each option rather than meeting
  two orphaned names.
- Both charts are hidden from assistive technology and paired with visible
  tables carrying the same numbers; each bar also prints its person's name and
  value inside it, so the two series never depend on fill colour.
- Verdicts state their tone in words ("Correct.", "Not this one.") as well as
  by border colour.
- The item-mix slider announces its value as "62 per cent Assertiveness items,
  38 per cent Enthusiasm items" rather than a bare number.
- Changes are announced through the shell's polite live region.
- Usable at 320px and at projector widths; the evidence list and profile chart
  stack on narrow screens.

## Optional extension tasks

1. **Write the report.** Draft the two sentences describing Rowan and Devi that
   a report quoting only the broad Extraversion score would produce. Then draft
   the honest version. Students find the first version is not false, merely
   useless — which is the harder thing to notice.
2. **Design the questionnaire.** Given a job that genuinely needs assertiveness
   and not enthusiasm, what item mix should the questionnaire use, and what
   would you have to stop claiming about the resulting score?
3. **Find it in the literature.** Locate a paper reporting a domain-level null
   result and check whether facet-level analyses were run. Ask what would have
   to be true for the null to be a real absence rather than an aggregation
   artefact.
4. **The other direction.** Construct a case where the *facet* analysis
   misleads and the domain score is the better summary. (It is possible: many
   small facet differences in the same direction aggregate into a real domain
   difference that no single facet shows convincingly.)

## The simulation model

Also documented at the top of `tool.js`.

Each domain has two facets. A person is a pair of facet scores on a 0–100
scale, and the broad score is their weighted mean:

```
domain = mix · facetA + (1 − mix) · facetB
```

with `mix = 0.5` for the balanced questionnaire the cases assume. Each
observation carries weights on the two facets summing to one, and the
model-implied tendency to show it is

```
tendency = wA · facetA + wB · facetB
```

The **facet prediction** uses the person's two facet scores. The **domain
prediction** replaces both facet scores with the single domain score, which is
what using a domain score actually does — and since the two people share a
domain score, that prediction is necessarily identical for both. The identity
is structural, not a quirk of the chosen numbers.

In the final stage `mix` varies. Because each pair trades one facet against the
other, moving the mix moves their scores in opposite directions and reverses
their rank order at the crossover

```
mix* = (b₂ − b₁) / ((a₁ − b₁) − (a₂ − b₂))
```

which the tool reports for the current case.

### Reference values

| Case | Facets | Person 1 | Person 2 | Broad score (both) | Crossover |
| --- | --- | --- | --- | --- | --- |
| Extraversion | Assertiveness / Enthusiasm | 82 / 54 | 55 / 81 | 68 | ≈ 49% |
| Conscientiousness | Industriousness / Orderliness | 84 / 48 | 50 / 82 | 66 | ≈ 49% |
| Agreeableness | Compassion / Politeness | 83 / 51 | 52 / 80 | 67 | ≈ 49% |
| Openness | Intellect / Aesthetic openness | 85 / 53 | 54 / 84 | 69 | ≈ 48% |

## Citation and evidence notes

The demonstration is an illustration, not a finding. The ideas are standard and
worth pointing students towards:

- **Cronbach and Gleser (1957)** named the bandwidth–fidelity dilemma, and it
  has not been improved on as a way of putting the problem.
- **DeYoung, Quilty and Peterson (2007)** set out the two-aspect structure the
  facet pairs here are named after — each Big Five domain splitting into two
  intermediate aspects.
- **Ones and Viswesvaran (1996)** argue the case for broad measures; **Paunonen
  and Ashton (2001)** the case for facets. Setting the two against each other
  is a good seminar.
- **Soto and John (2017)** on hierarchical personality measurement covers the
  practical version of the trade-off, including why facet scales are shorter
  and less reliable.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them. They come from the model above
and nowhere else.
