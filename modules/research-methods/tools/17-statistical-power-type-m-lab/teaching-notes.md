# Teaching notes — Statistical Power and Type M Error

`modules/research-methods/tools/17-statistical-power-type-m-lab/`

Take a show of hands on the Experiment 2 prediction before running anything.
The most popular answer is usually "about the same, each study is unbiased" —
which is true of the studies and false of the ones that get published. Holding
both of those in mind at once is the point of the session.

---

## Running it from the front

Start where the prediction left off: d = 0.50, twenty per group, &alpha; = .05. Power is 32.9%. Ask what that means for a literature in which most studies look like this one.

Then use the target-power readout. Reaching 80% at d = 0.50 needs 64 per group; at d = 0.25 it needs 253. Drag the effect size slowly and watch the required n climb as the square of the reciprocal.

Finally set &alpha; to .005 and watch power fall without a single participant being lost. Every threshold is a trade between the two error rates, and moving one moves the other.

Take a show of hands on the prediction before running anything. The most popular answer is usually "about the same, each study is unbiased" &mdash; which is true of the studies and false of the ones that get published, and holding both of those in mind at once is the point of the exercise.

Run the low-power setting first, then the high-power one, and put the two exaggeration ratios side by side. At fifteen per group the significant estimates average well over twice the truth; at a hundred and twenty they are within a few per cent of it.

The sign errors are worth a moment too. At very low power a noticeable share of the significant results point the wrong way entirely, and every one of them would be written up as a finding.

## Intended level

Final-year undergraduate or taught postgraduate, and essential for anyone
designing a study or reading a small literature. It assumes effect sizes
(tool 15) and the t-test (tool 16). It sets up the multiplicity tool that
closes this module.

## Learning objectives

After the activity a student should be able to:

1. identify α, β and power as areas on two sampling distributions;
2. work out the sample size a planned study needs;
3. explain why observed power adds nothing after the fact;
4. explain how conditioning on significance exaggerates effects without
   biasing any individual study;
5. recognise Type S errors.

## Estimated duration

- **Demonstration from the front:** 15 minutes.
- **Students in pairs:** 30 minutes.
- **With the challenge and debrief:** 50 minutes.

## Preparation

None. Write "power is a plan, not a post-mortem" on the board.

## The demonstration worth doing from the front

1. Take the prediction as a vote. "About 80%" usually wins. The answer is
   **32.9%**.
2. Point at the two curves and name the four areas out loud before touching
   anything.
3. Read the **target-power** readout: 80% at *d* = 0.50 needs **64** per group.
   Drag *d* to 0.25 and it needs **253**.
4. Set **α to .005**. Power falls to 8.1% without a single participant being
   lost. Every threshold trades one error rate against the other.
5. Open Experiment 2, vote on the prediction, then run the **low-power
   setting**: 301 significant out of 2,000, mean of all estimates **0.35**,
   mean of the significant ones **0.97**.
6. Run the **high-power setting** and put the two exaggeration ratios side by
   side: **2.76** against **1.17**.
7. Finish on the three wrong-signed significant results at low power, and ask
   what each of them would have been titled.

## Prediction questions

**Experiment 1 gate.** *Two groups of 20, α = .05, true d = 0.50. What is the
probability of a significant result?* — about 80%; about 50%; **about 34%**;
about 5%.

"About 5%" is the instructive wrong answer: it confuses the false-positive rate
with the power, which are two shaded regions on two different curves.

**Experiment 2.** *Among the studies that come out significant, the average
estimate will be …* — about the same; one and a half times; **two and a half
times**; smaller.

## Activity sequence

1. **Commit to the power prediction.**
2. **Name the four areas** on the picture.
3. **Sweep the effect size** and watch the required n climb.
4. **Change α** and watch power move without n moving.
5. **Commit to the Type M prediction.**
6. **Run the low-power setting**, then the high-power one.
7. **The challenge**, which is seven statements about power.

## Debrief questions

1. Where is α on the picture, and where is power? Why are they on different
   curves?
2. Halving the effect size you want to detect roughly quadruples the sample.
   Why?
3. A paper reports "observed power was 21%, so the study was underpowered."
   What is wrong with that sentence?
4. The mean of all 2,000 estimates was 0.35 and the mean of the significant
   ones was 0.97. Which of those is biased, and what is doing the biasing?
5. Three significant results pointed the wrong way. What would each have been
   called?
6. Where does the effect size in a power calculation come from, and what is the
   problem with the usual answer?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "n = 20 per group is a normal study, so it must be fine." | 32.9%. |
| "α is the power." | Two curves, two regions. |
| "Observed power tells you what went wrong." | It is a function of *p*. It cannot explain *p*. |
| "Doubling n doubles power." | 32.9% to 59.7%, and 94% to 99.9% higher up. |
| "Low power biases every study." | Mean of all estimates: 0.35. |
| "The published effect is the real one." | 0.97 against 0.35. |
| "A tighter α is always safer." | .005 takes power to 8.1%. |
| "Underpowered studies just find nothing." | Three of them found the opposite. |

## Limitations and cautions

- **No real studies.** Everything is generated, and the "true effect" is a
  number the simulation was told.
- **Power needs an effect size you do not have.** In a real protocol it is an
  assumption, often taken from literature that this very tool suggests is
  inflated.
- **The power curve uses a normal approximation** beyond an exact *t*
  threshold. The difference is a fraction of a percentage point here.
- **Publication bias is only one filter.** Selective outcome reporting,
  flexible analysis and undisclosed exclusions do the same job — tool 21.
- **Power is not the only thing that matters.** A large study of a badly
  operationalised construct answers nothing precisely.

## Accessibility considerations

- Native ranges, selects, radios, checkboxes and buttons; every control
  labelled, every group in a fieldset with a legend.
- The Type M slider announces both the sample size and the power it produces.
- Both charts are hidden from assistive technology and paired inside their
  figures with **visible tables**; a disclosure holds the required sample size
  at four target levels.
- α and β are **hatched in opposite directions**, the null curve is dashed and
  the alternative solid, both labelled inside the picture; the three reference
  lines on the Type M histogram differ in dash pattern and carry printed
  labels.
- Pinned primaries measure 514px and 565px tall at 1366×768.
- Every control, preset and run announces a full sentence; focus moves to each
  experiment's heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Design a study.** Choose a smallest effect worth detecting, pick a target
   power, and report the sample size and the total cost in participants.
2. **Reverse-engineer a literature.** If published effects average 0.9 and the
   typical study has 20 per group, what might the real effect be?
3. **Write the protocol paragraph.** State the assumed effect, its source, α,
   the target power and the resulting n, in four sentences.
4. **Find the n at which exaggeration disappears.** Raise the Type M sample
   size until the ratio drops below 1.1, and explain what changed.

## The model

```
Experiment 1:
  SE        = sqrt(2 / n)
  threshold = tCritical(alpha, 2n - 2) * SE          [exact]
  power     = 1 - Phi((threshold - d)/SE) + Phi((-threshold - d)/SE)
  required n: scan upwards until power reaches the target

Experiment 2, per study (2,000 of them):
  group A ~ Normal(0, 1),  group B ~ Normal(0.35, 1),  n each
  pooled s, observed d, t = d / sqrt(2/n)
  significant when |t| >= tCritical(.05, 2n - 2)
```

The power area uses a normal rather than a non-central *t*; Experiment 2 uses
no approximation at all. Randomness is seeded with `mulberry32` plus
Box–Muller.

### Reference values a lecturer can check

Experiment 1 at α = .05:

| d | n per group | Power | Threshold |
| --- | --- | --- | --- |
| 0.50 | 20 | 32.9% | ±0.64 |
| 0.50 | 40 | 59.7% | — |

Sample size required per group, at α = .05:

| Target power | d = 0.50 | d = 0.25 |
| --- | --- | --- |
| 50% | 32 | 125 |
| 80% | 64 | 253 |
| 90% | 85 | 337 |
| 95% | 105 | 417 |

At *d* = 0.50, n = 20 and **α = .005**: power **8.1%**, threshold ±0.94, and
109 per group would be needed for 80%.

Experiment 2, true effect 0.35, α = .05, seed 5477, 2,000 studies:

| n per group | Significant | Mean of all | Mean of significant | Exaggeration | Wrong sign |
| --- | --- | --- | --- | --- | --- |
| 15 | 301 (15.0%) | 0.35 | 0.97 | 2.76× | 3 (1.0%) |
| 120 | 1530 (76.5%) | 0.36 | 0.41 | 1.17× | 0 |

The **mean of all** column is the one to point at: unbiased at both sample
sizes, which is what makes the significant column's behaviour a property of
the filter rather than of the studies.

## Citation and evidence notes

- **Cohen (1962, 1988, 1992)** for the original power surveys of the
  literature and for the conventional 80% target.
- **Gelman and Carlin (2014)**, "Beyond power calculations", the source of the
  Type M and Type S framing that Experiment 2 implements.
- **Hoenig and Heisey (2001)**, "The abuse of power", for why observed power is
  a restatement of the *p*-value.
- **Button et al. (2013)**, "Power failure", for the empirical claim that
  typical power in a real field is low and what follows for its published
  effect sizes.
- **Ioannidis (2008)**, "Why most discovered true associations are inflated".
- **Lakens (2022)** on justifying a sample size rather than defaulting to a
  target.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated studies from any of them.
