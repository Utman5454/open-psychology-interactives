# Teaching notes — Twin-Study Simulator

`modules/personality-individual-differences/tools/39-twin-study-simulator/`

Set the truth, generate the pairs, estimate it back, then break the
assumptions and watch which way each one bends the answer.

---

## Running it from the front

The Equalise everyone's environment button is the most useful thing here. It removes shared-environment variance and heritability rises sharply, with no gene changing. A high heritability can be evidence that environments have been made more equal — which is close to the opposite of how the number is usually read aloud.

## Intended level

Second- or third-year undergraduate meeting behaviour genetics, or
postgraduates who need to read twin literature critically. It assumes
familiarity with correlation and is otherwise self-contained.

The trait is deliberately never named. The argument is about the method, and
naming a trait invites students to argue about that trait instead.

## Learning objectives

After the activity a student should be able to:

1. state what heritability is a property of;
2. explain why it says nothing about any individual, and nothing about
   malleability;
3. derive ACE estimates from MZ and DZ correlations;
4. name the assumptions and say which direction each violation biases the
   estimate;
5. explain why equalising environments raises heritability with no genetic
   change.

## Estimated duration

- **Demonstration from the front:** 12 minutes.
- **Students in pairs:** 30 minutes.
- **With the challenge and full debrief:** 45 minutes.

## Preparation

None, but decide in advance how you will handle the question that always
arrives: *what about differences between groups?* See the note below.

The default seed is `4471`; note any seed you want to reproduce.

## The question that always comes up

Someone will ask whether high heritability within a population implies that
differences *between* populations are genetic. The answer is no, and it is
worth having ready:

> Heritability within a group is calculated from variation inside that group.
> It carries no information about why two groups differ on average, because
> the causes of variation within a group and the causes of a difference
> between groups are separate questions. The standard illustration is genetically
> identical seed sown in two fields, one rich and one poor: within each field,
> height differences are entirely genetic — heritability is 1.0 — and the
> difference between the fields is entirely environmental.

The simulator contains a single undifferentiated population and can neither
support nor refute any between-group claim. Say so plainly if it comes up.

## The prediction question

> A study reports that a trait has a heritability of 0.50. **What does that
> mean?**

The individual interpretation — "half of each person's trait is genetic" — is
the most common answer and is the one the whole tool is built to dislodge. Its
feedback is deliberately the bluntest on the page.

## Activity sequence

1. **The definition question.** The simulator stays closed until answered.
2. **Recover the truth.** With all assumptions holding, the estimates land
   close. Students see the machinery work.
3. **Draw new samples repeatedly.** The estimates move by several points
   between samples of 250 pairs. That movement is what a confidence interval
   summarises, and it is larger than most students expect.
4. **One violation at a time.** Unequal environments first — h² rises above
   truth, c² collapses. Then assortative mating alone — h² falls below truth.
   Point out that they oppose each other.
5. **Both at once.** The estimate can look unremarkable while being wrong
   twice.
6. **Gene–environment correlation.** The covariance has to be assigned
   somewhere and the model gives it to the genetic term.
7. **Equalise the environment.** The button. Heritability jumps, no gene
   moved.
8. **The challenge.**

## Debrief questions

1. You just raised heritability by about a third by changing the environment,
   with the genetic slider untouched. What does that tell you about what h² is
   measuring?
2. A trait has heritability 0.8. What follows about whether an intervention
   could change it? *(Nothing.)*
3. Why does e² in this model include measurement error? What would that do to
   a study using an unreliable measure?
4. Unequal environments inflate h²; assortative mating deflates it. What
   should you do when reading a study where both are plausible?
5. Why is there no truth column in a real twin study, and what follows for how
   confidently the estimates should be reported?
6. What would you have to know to interpret a difference in average scores
   between two populations? *(Not this. Something else entirely.)*

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "h² = 0.5 means half of my personality is genetic." | The opening question, and the debrief. There is no coherent way to split one person's trait; they had one genome and one life. |
| "Highly heritable means fixed." | Height. Spectacles. Both highly heritable, both readily changed. |
| "Heritability is a property of the trait." | Press the equalise button. Same trait, same genes, different number. |
| "The shared environment estimate is near zero, so families don't matter." | c² near zero means families do not make siblings *similar to each other* on this measure in this population. It does not mean upbringing is irrelevant — non-shared environment includes everything about a family that affects siblings differently. |
| "Twin studies are discredited." | Overcorrection. The assumptions are known, testable and partly violated; that makes the estimates uncertain and directionally biased, not worthless. |
| "The MZ correlation is the heritability." | It is a² + c². The whole point of the DZ group is to separate those two. |

## Limitations and cautions

- **These are not data.** Fictional pairs from a seeded generator; no real
  study, family or dataset.
- **No group comparisons anywhere.** One undifferentiated population. The tool
  cannot address between-group questions and should not be used to.
- **The model is the simplest possible.** Purely additive genetic effects: no
  dominance, no epistasis, no sex differences, no age moderation, no
  gene–environment *interaction* (correlation is modelled; interaction is the
  subject of the Gene × Environment Interaction Visualiser in this module).
- **Falconer's method is not what modern studies use** — it is here because it
  makes the logic visible in three lines. Current work uses structural equation
  models across many relationships, with intervals and model comparison.
- **No confidence intervals.** Resampling repeatedly is the substitute, and it
  is worth doing in front of the class.

## Accessibility considerations

- Native ranges, a number input and buttons; no custom widgets, no dragging.
- Every slider announces meaningful text — the violation sliders say
  "assumption held" at zero rather than "0".
- The three scatterplots are hidden from assistive technology and paired with
  a visible table of pair counts and correlations; each panel's correlation is
  also printed as text beneath it.
- The truth-against-estimate table labels every discrepancy "overestimate",
  "underestimate" or "close" in words, so no judgement rests on comparing two
  numbers visually.
- The seed is a plain number input, so any dataset can be recorded and
  restored.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Find the sample size.** Resample repeatedly at 250 pairs and record the
   range of h² estimates. How large would a study need to be to pin h² to
   ±0.05?
2. **Cancel one bias with another.** Find settings where unequal environments
   and assortative mating produce an apparently accurate estimate. Then write
   the sentence a reader of that study would wrongly believe.
3. **The unreliable measure.** Push measurement error to 0.3. What happens to
   each of the three estimates, and which one absorbs the error?
4. **Write the caveat.** Draft the two sentences of limitations you would want
   attached to any reported heritability figure.

## The model

Also documented at the top of `tool.js`.

```
P = a·A + c·C + e·E + m·M          (squared coefficients sum to 1)

r(MZ) = a² + c²
r(DZ) = ½a² + c²

h² = 2(r_MZ − r_DZ)
c² = 2r_DZ − r_MZ
e² = 1 − r_MZ                      (absorbs measurement error)
```

Pairs are generated by giving each pair a shared and a unique component of A
and of C, in proportions set by the group and modified by the violations:

| Violation | Mechanism | Effect on the estimate |
| --- | --- | --- |
| Unequal environments | DZ and sibling pairs share less C than MZ pairs | h² **over**estimated, c² underestimated |
| Assortative mating | DZ and sibling pairs share more than ½ of A | h² **under**estimated |
| Gene–environment correlation | C is partly a function of A | covariance assigned to the genetic term |

Non-twin siblings additionally share 0.25 less C than twins, since they are
not the same age or in the same cohort.

### Reference values (seed 4471, assumptions holding)

Defaults are A = 0.40, C = 0.35, E = 0.20, error = 0.05. The recovered
estimates land within roughly 0.07 of the truth (A ≈ 0.43, C ≈ 0.28,
E + error ≈ 0.28). Resampling moves them by a few hundredths either way; that
spread is the point of step 3 in the sequence.

The shared-environment share is deliberately large in the default, because the
*equalise the environment* demonstration works by removing C — and if C starts
small there is nothing to remove. With these defaults, pressing the button
takes the heritability estimate from about **0.43 to about 0.58** with the
genetic slider untouched.

Violation reference points, each set on its own from the default:

| Violation | Setting | h² estimate | c² estimate |
| --- | --- | --- | --- |
| none | — | 0.43 | 0.28 |
| unequal environments | 0.40 | rises sharply | falls to near zero |
| assortative mating | 0.60 | falls well below truth | rises |
| gene–environment correlation | 0.60 | rises | falls |

## Citation and evidence notes

- **Falconer and Mackay**, *Introduction to Quantitative Genetics*, for the
  formulae and the logic behind them.
- **Plomin, DeFries, Knopik and Neiderhiser**, *Behavioral Genetics*, is the
  standard textbook treatment, including the assumptions.
- **Turkheimer (2000)** on the "three laws" of behaviour genetics, and his
  later writing on what heritability does and does not license.
- **Lewontin (1970)**, *Race and intelligence*, is the source of the two-fields
  argument reproduced above and remains the clearest statement of why
  within-group heritability is silent about between-group differences.
- **Felson (2014)** and others on empirical tests of the equal-environments
  assumption.
- **Scarr and McCartney (1983)** on gene–environment correlation, for the
  distinction between passive, evocative and active forms.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
