# Teaching notes — Emotional-Intelligence Claims Laboratory

`modules/personality-individual-differences/tools/49-emotional-intelligence-claims-laboratory/`

Three fictional measures share a label and behave differently. Students find
out how much of that is method, how much is content, and what the marketing
would need in order to be honest.

---

## Before you run this

Emotional intelligence is a live research area with serious people on several
sides of it. This tool is **not** an argument that it does not exist, and it
should not be taught as one. It is an argument about evidence: a name shared by
measures that correlate weakly has not yet earned the treatment it gets, and
the evidence that would earn it is describable in advance. The "If the label
were true" preset exists so that argument stays honest.

No published measure is reproduced, quoted, paraphrased or scored anywhere in
the tool. The six measures are fictional descriptions of *method types*.

## Intended level

Second or third-year undergraduate. It assumes correlation and the general idea
of regression, but not matrix algebra. It pairs naturally with a lecture on
construct validity, and works as the applied half of a session whose first half
is the nomological network.

## Learning objectives

After the activity a student should be able to:

1. tell convergent evidence from correlation produced by a shared method;
2. state what incremental validity asks that a raw correlation does not;
3. explain why self-report and maximal-performance measures of the same label
   can behave differently;
4. judge a construct claim against evidence rather than plausibility;
5. explain construct proliferation and what protects a discipline from it.

## Estimated duration

- **Demonstration from the front:** 10 minutes — the matrix, reordered, and
  the two method sliders.
- **Students in pairs:** 30 minutes.
- **With the five claims and the debrief:** 45 minutes.

## Preparation

Nothing to install. Open the page, answer or skip the opening question, and the
laboratory unlocks. Everything runs in the browser tab.

If you want to project it, the "Grouped by how they were collected" ordering is
the version to have on screen; the block structure is obvious at the back of a
lecture theatre.

## The demonstration worth doing from the front

1. Show the matrix in the administered order. Ask which pairs are large.
2. Switch to the grouped order. The blocks appear: the two questionnaires, then
   the three timed tests.
3. Someone will say "that is just method variance". Good — it is the right
   instinct and it is testable. Load **Method effects removed**.
4. The self-report scale still correlates about .54 with the personality
   questionnaire. The overlap is content: the scale is asking about
   dispositions that agreeableness and emotional stability already cover.
5. Load **If the label were true** and ask what changed. The top row moves
   sides. This is what the evidence would have to look like.

## The prediction question

> Four measures, all called measures of emotional intelligence. **How will they
> correlate with each other?**

"Strongly — they measure the same thing" is the answer to dislodge, and it is
the reasonable one. The answer the matrix supports is that the correlations
depend on how each measure was collected rather than on the label.

## Activity sequence

1. **Commit to an answer.**
2. **Read the matrix**, then reorder it by method and read it again.
3. **Turn both method sliders to zero.** Ask what survives.
4. **Turn them up to maximum.** Ask what changed and what did not — the
   across-method correlations do not move at all.
5. **Move the mix slider to 100.** Now the self-report scale correlates with
   the tasks and not with the personality questionnaire.
6. **Run the incremental analysis.** Add the self-report scale; note the
   change. Then add the emotion-management task instead and note that the
   measure with the *smaller* raw correlation adds more.
7. **Judge the five claims.** They are scored against whatever the student has
   currently set, so a pair who moved the sliders will get different verdicts —
   which is worth surfacing rather than fixing.

## Debrief questions

1. Why do two questionnaires correlate more than a questionnaire and a task,
   even when both claim to measure the same thing?
2. The self-report scale correlates .36 with observed effectiveness and adds
   about three points of variance over personality and reasoning. Which of
   those two numbers belongs in the brochure, and which one belongs in the
   paper?
3. What would you have to find for "distinct capability" to be a fair claim?
4. Why does the emotion-management task correlate with a reasoning test at all,
   and does that make it a worse measure or a more honest one?
5. A consensus scoring key defines the right answer as the one most people
   give. When is that defensible, and when is it a problem?
6. Nothing here shows that emotional intelligence does not exist. What would?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "It is all method variance." | Testable, and it fails. Method sliders to zero; the overlap survives. |
| "The self-report measure is just bad." | It is a perfectly good measure of something — largely of dispositions already named. The failure is in the claim, not the questionnaire. |
| "The task has right answers, so it is objective." | It correlates .37 with a reasoning test, and its key is defined by consensus. Better anchored, not objective. |
| "A correlation of .36 with effectiveness is impressive." | Compare it with what personality alone achieves, then look at the incremental row. |
| "This proves emotional intelligence is a myth." | It proves this fictional matrix does not support this fictional advertising. Load "If the label were true" to see the other outcome. |
| "Constructs that predict outcomes are real." | Prediction is one strand. Convergence and discrimination are the other two, and the label needs all three. |

## Limitations and cautions

- **No real measure and no real data.** Six fictional method descriptions and a
  three-slider generative model.
- **The numbers are not estimates** of anything published and should never be
  quoted as effect sizes.
- **One outcome, one sample, one matrix.** Real construct validation uses many
  indicators, several outcomes and confirmatory models.
- **No confidence intervals.** Everything is model-implied and therefore exact;
  real matrices come with sampling error, and the tool would mislead if it
  invented standard errors for numbers that have none.
- **Self-report is not the villain.** For questions about a person's own
  experience it is the appropriate method.
- **Nobody is assessed.** The tool produces no score for the person using it
  and asks nothing about them.

## Accessibility considerations

- The correlation matrix is an ordinary table. Every cell states its number,
  every row header names the collection method, and pairs sharing a method are
  marked with a dotted underline as well as by ordering — the tint carries no
  information of its own.
- The scatterplot is hidden from assistive technology and paired with a visible
  table giving the pair, the model correlation with a plain-language band, the
  correlation observed in the simulated sample, and the variance shared.
- Every slider announces what it controls in words: "almost entirely general
  dispositions — a personality questionnaire under another name" rather than
  "16".
- The judged claims state agreement in words as well as by border colour.
- Reduced motion honoured; forced-colours rules provided; usable at 320px and
  at projector widths.

## Optional extension tasks

1. **Write the press release honestly.** Three sentences about the self-report
   scale that a methods reviewer would let through.
2. **Design the study that would settle it.** What would you measure, in what
   order, and what result would change your mind?
3. **Find the setting where every claim is supported.** Then say what a
   researcher would have had to do to produce that evidence.
4. **The other direction.** Which of the five claims stays false however you
   set the sliders, and why? *(Claim 5 — "shows you will be" is a claim about
   an individual, and no correlation licenses it at any size.)*

## The model

Also documented at the top of `tool.js`. Each measure is a weighted sum of
independent standard normal sources, scaled to unit variance:

```
z = P·dispositional + A·emotion ability + G·general cognitive
    + Q·questionnaire method + T·testing method + unique
```

so that

```
r(x, y) = Px·Py + Ax·Ay + Gx·Gy + Qx·Qy + Tx·Ty
```

The self-report scale's content is a fixed quantity split by one angle:
`P = 0.72·cos(theta)`, `A = 0.72·sin(theta)`, `theta = mix × 90°`. The mix
slider therefore points the scale rather than improving it.

Standardised regression weights are solved from the matrix by Gaussian
elimination and the variance accounted for is `b · r`.

### Reference values at the default settings

| Pair | r |
| --- | --- |
| Self-report EI × personality questionnaire | .63 |
| Self-report EI × emotion-management task | .13 |
| Emotion-management task × recognition | .51 |
| Emotion-management task × reasoning | .37 |
| Self-report EI × observed effectiveness | .36 |
| Personality questionnaire × observed effectiveness | .35 |
| Emotion-management task × observed effectiveness | .26 |
| Reasoning × observed effectiveness | .11 |

Personality and reasoning together account for about 13% of the variance in
observed effectiveness. Adding the self-report scale gains roughly three
percentage points; adding the emotion-management task instead gains rather
more, despite its smaller raw correlation.

## Citation and evidence notes

- **Campbell and Fiske (1959)** on the multitrait–multimethod matrix — the
  source of the whole method-versus-trait argument this tool rests on.
- **Cronbach and Meehl (1955)** for construct validity and the nomological net.
- **Landy (2005)** and **Locke (2005)** for the sharper critiques of how
  emotional intelligence has been defined and sold.
- **Joseph and Newman (2010)** and **O'Boyle et al. (2011)** for
  meta-analytic work on prediction and incremental validity over personality
  and cognitive ability.
- **Mayer, Caruso and Salovey (2016)** for the ability-model reply, which is
  the position the "If the label were true" preset takes seriously.
- **Podsakoff et al. (2003)** on common-method variance.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its simulated numbers from any of them.
