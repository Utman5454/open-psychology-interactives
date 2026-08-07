# Teaching notes — Sampling Distribution and p-Value Simulator

`modules/research-methods/tools/08-sampling-distribution-pvalue-simulator/`

Run twenty studies slowly before you run a thousand. Watching differences of
1.2, then −3.4, then 6.1 arrive from a world where the truth is zero does the
work.

---

## Intended level

First- or second-year undergraduate meeting significance testing, and again
with anyone who has to write a results section. It assumes the mean and the
standard deviation and nothing else. It sets up the confidence-interval,
t-test, power and multiplicity tools later in this module.

## Learning objectives

After the activity a student should be able to:

1. describe a sampling distribution as the spread of a statistic across
   repeated studies under a stated model;
2. read a p-value off that distribution as a tail area;
3. state what a p-value is not — in particular, that it is not the probability
   the null hypothesis is true and not the probability the result was chance;
4. explain why the same observed difference gives different p-values at
   different sample sizes;
5. list what a reported p-value is conditional on.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Put "the true difference here is exactly zero" on the board and leave it
there for the whole session.

## The demonstration worth doing from the front

1. Press **Run 20 more, slowly**. Read the last five differences aloud from the
   status line. Every one came from a world with no effect.
2. Press **Run 1,000 null studies**. The pile is the sampling distribution.
3. Point at the shaded tails and read the table: about 7% below −5, about 8%
   above +5, so **p ≈ .14**. Compare with the model's **.136** in the readout.
   The tail area is a count, not a convention.
4. Now the move that matters. Leave the observed difference at **5.0** and drag
   the sample size from **40** to **200**. p falls from about .14 to below
   .001. Ask what the study found. It found a difference of 5.0 points, both
   times.

## Prediction question

*Two groups of 40, drawn from the same population, SD 15. How often will such a
study produce a difference of 5 points or more in either direction?* — less
than 1 in 100; about 1 in 20; **about 1 in 7**; about 1 in 3.

"About 1 in 20" is the instructive wrong answer and gets its own response: one
in twenty is where the conventional threshold sits, which is why it comes to
mind, and the threshold is a decision rather than a property of this study.

## Activity sequence

1. **Commit to a prediction.**
2. **Twenty slow studies**, then a thousand.
3. **Move the observed difference** from 0 to 20 and watch the shading.
4. **Change n** with the observed difference fixed — the central demonstration.
5. **Change σ** and note that it does the same job in the opposite direction.
6. **Open "Theory beside simulation"** and check that the simulated spread
   matches σ√(2/n).
7. **The challenge**, which is six statements about one p-value.

## Debrief questions

1. Every study in the pile has a true effect of zero. Why is the pile not a
   single spike at zero?
2. p = .14. Complete the sentence honestly: "If the null model were true,
   then …"
3. Why can the calculation not tell you how likely the null hypothesis is?
4. The same 5.0-point difference gives p = .5 and p < .001 at different sample
   sizes. What has changed, and what has not?
5. A study reports p = .30 and concludes there is no effect. What is wrong with
   that, and what would you write instead?
6. Name three things the p-value on screen is conditional on that nobody
   checked.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "p is the probability the null is true." | The simulation begins by assuming the null. Nothing about the plausibility of the hypothesis ever enters, so nothing about it can come out. |
| "p is the probability it was chance." | Every study in the histogram was produced by chance. p says how often chance alone goes this far, not what share of your result was chance. |
| "p < .05 means a real effect." | The tool never mentions .05. Ask what would justify that particular number here. |
| "A big p means no effect." | Set the difference to 5 with n = 10 and then n = 200. Same finding, opposite verdicts. |
| "A small p means a big effect." | Same demonstration, read the other way. |
| "1 − p is the chance of replicating." | Replication probability is a power calculation and needs an assumed true effect that p does not supply. |
| "The simulation proves the formula." | It agrees with the formula. Both rest on the same model, so agreement is a check on the arithmetic rather than on the world. |

## Limitations and cautions

- **No real data.** Every study is generated; the observed difference is a
  slider, not a finding.
- **The null model is unusually clean** — normal populations, equal and known
  variances, no measurement error, no dropout, no dependence.
- **The reference distribution is normal, not *t*.** The model states σ, so z
  is exactly right. A real t-test estimates σ and pays with heavier tails.
- **A small p does not identify what is wrong with the model.** An effect is
  one explanation; dependence, skew or a selected analysis are others.
- **Nothing here justifies a threshold**, and the tool deliberately never
  prints .05 as one.

## Accessibility considerations

- Native ranges, number input, checkboxes and buttons; every control labelled,
  every group in a fieldset with a legend.
- Sliders announce meaningful text ("40 participants in each group").
- The histogram is hidden from assistive technology and paired inside its
  figure with a **visible three-row table** of how many studies fell below
  −obs, between, and above +obs, with shares.
- Tail bars carry a **diagonal hatch** as well as a different fill, and the
  observed value is a labelled rule, so the tail area never depends on colour.
- p-values below .001 are printed as "< .001" rather than as a spurious digit.
- Every run announces a full sentence including the simulated p.
- The pinned block is capped so it fits inside a 768px-tall viewport with the
  controls beside it; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the n that makes 5.0 points "significant" at one in twenty.** Then
   say what that tells you about the effect.
2. **Two studies, one truth.** Set n = 20 and record p; set n = 200 and record
   p. Write the two abstracts. Which is more honest?
3. **Break the model.** The simulation assumes independence. Describe a design
   in which it fails, and say which direction the p-value would be wrong in.
4. **Rewrite six sentences.** Take the five incorrect statements from the
   challenge and rewrite each one so that it is true.

## The model

```
group A ~ Normal(0, sigma),  group B ~ Normal(0, sigma),  n per group
statistic     = mean(A) - mean(B)
SE            = sigma * sqrt(2 / n)
reference     = Normal(0, SE)
theoretical p = 2 * (1 - Phi(|observed| / SE))
simulated p   = share of simulated studies with |difference| >= |observed|
```

Φ is computed with the Abramowitz and Stegun 26.2.17 approximation. Randomness
is seeded (`mulberry32` plus Box–Muller), and changing n or σ clears the pile,
because those studies came from a different null world.

### Reference values a lecturer can check

At the defaults — **n = 40, σ = 15, observed difference 5.0**:

- standard error **3.35 points**;
- observed difference **1.49 SE** from zero;
- model tail area **p = .136**;
- counted tail area over 1,000 studies, seed 5140: **p = .147**
  (70 below −5.0, 853 between, 77 above +5.0).

Holding the observed difference at 5.0 and changing only n:

| n per group | Standard error | Model p |
| --- | --- | --- |
| 10 (σ = 30) | 13.42 | .709 |
| 40 | 3.35 | .136 |
| 200 | 1.50 | < .001 |

The counted value moves with the seed; the model value does not.

## Citation and evidence notes

- **Wasserstein and Lazar (2016)**, the American Statistical Association
  statement on p-values — the six principles it lists are effectively the
  syllabus of this tool.
- **Greenland et al. (2016)**, "Statistical tests, P values, confidence
  intervals, and power: a guide to misinterpretations" — the source for the
  taxonomy of errors in the challenge.
- **Cohen (1994)**, "The earth is round (p < .05)" on reversing the
  conditional.
- **Gigerenzer (2004)**, "Mindless statistics", on where the .05 ritual came
  from.
- **Haller and Krauss (2002)** for the finding that the misinterpretations in
  the challenge are common among researchers and among the people teaching
  them.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated studies from any of them.
