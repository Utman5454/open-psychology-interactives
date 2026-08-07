# Teaching notes — Gene × Environment Interaction Visualiser

`modules/personality-individual-differences/tools/42-gene-environment-interaction-visualiser/`

Three theories, two straight lines, and one decision about who to recruit.

---

## Intended level

Second- or third-year undergraduate, or postgraduate. Assumes familiarity with
regression lines and interaction terms. It pairs naturally with the Twin-Study
Simulator in this module, which handles variance components; this one handles
moderation.

## Learning objectives

After the activity a student should be able to:

1. distinguish diathesis–stress, differential susceptibility and vantage
   sensitivity by where the crossover falls;
2. explain why the sampled environmental range can decide which theory a study
   appears to support;
3. explain why a significant interaction term does not choose between them;
4. state what evidence would license a differential-susceptibility claim;
5. describe sensitivity as responsiveness in both directions.

## Estimated duration

- **Demonstration from the front:** 8 minutes — the opening round alone makes
  the point.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. If you have limited time, run only the opening round and the single
manipulation described below.

## The prediction question

Students see a scatter and two lines covering environmental quality from −1.00
to 0.00 — the adverse half only. The higher-sensitivity group does worse, and
the gap narrows towards the right-hand edge.

> **Which pattern does this support?**

Almost everyone says diathesis–stress, and from that window they are right to.
Committing to the answer is what makes the reveal land: the range then widens
to the full −1.00 to +1.00 and the lines cross. The same two groups, the same
slopes, a different theory.

## The one manipulation worth doing from the front

In the explorer: load **Differential susceptibility**, then drag *most
supportive sampled* down to 0.00. The verdict label changes to
**Diathesis–stress**, with no slope and no crossover having moved.

That is the entire argument of the tool in one drag. If you do nothing else,
do that.

## Activity sequence

1. **Name the pattern** in the restricted window.
2. **The reveal** — the full range, side by side with what was reported.
3. **The three presets.** Load each and note that only the crossover moves.
4. **Restrict the range** on differential susceptibility until it reads as
   diathesis–stress; then restrict from the other side until it reads as
   vantage sensitivity.
5. **Noise.** Push it up and watch the visual impression become unreliable
   while the underlying lines are unchanged.
6. **The evidence challenge.**

## Debrief questions

1. What changed between the two graphs in the reveal? *(The sampling. Nothing
   about the people.)*
2. Why can no increase in sample size rescue the restricted study?
3. All three theories predict differing slopes. What does a significant
   interaction term therefore establish?
4. A study recruits only from high-adversity settings and finds that the
   sensitive group does worse. What is it entitled to conclude, and what is it
   not?
5. If differential susceptibility is right, which group has the most to gain
   from improving the environment? What does that do to the phrase "risk
   group"?
6. The tool draws straight lines. How would the argument change if the true
   relationships were curved?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The interaction is significant, so it's differential susceptibility." | All three theories predict a significant interaction. Significance establishes differing slopes and nothing more. |
| "A bigger sample would settle it." | Only if it sampled a wider range. Precision about a restricted window is still restricted. |
| "Sensitive people are at risk." | Half the curve. Under differential susceptibility they also do better in good conditions, which reverses the practical implication. |
| "The genes cause the outcome." | No gene appears anywhere in this tool. A slope is an average tendency across a group, not a mechanism and not a prediction about a person. |
| "So the literature is worthless." | Overcorrection. The pattern is real and testable; the design requirement is specific and often was not met in earlier work. |
| "The crossover is where the effect is." | The crossover is where the *difference between groups* is zero. Both groups are still responding to the environment there. |

## Limitations and cautions

- **No gene is involved.** The grouping variable is a fictional sensitivity
  score. Real candidate-gene interaction findings have a poor replication
  record and nothing here supports any specific genetic claim.
- **No clinical content.** The outcome is unnamed and standardised: no
  disorder, diagnosis, symptom or risk estimate anywhere.
- **Straight lines and two groups** are both simplifications, and both are
  stated on the page. Sensitivity as modelled would be continuous, and
  dichotomising a continuum can manufacture apparent interactions.
- **No confidence bands.** The lines are drawn from parameters rather than
  fitted, so no sampling uncertainty is shown. Real interaction estimates are
  imprecise, and that is a large part of why the literature is contested.
- **No figure corresponds to any published finding.**

## Accessibility considerations

- Native ranges, checkboxes and buttons; no dragging of chart elements.
- Sliders announce meaningful text — the crossover slider says "crossover
  inside the range" rather than a bare number.
- Charts are hidden from assistive technology and paired with a visible table
  giving both groups' outcomes and their difference at three points in the
  sampled window.
- The two groups are distinguished three ways: colour, dash pattern, and a
  label printed at the end of each line.
- The pattern the visible data support is stated in words in a verdict box,
  not left to visual inference.
- The unsampled region is shaded *and* reported as "proportion of the full
  range sampled" in the readout.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Manufacture a disagreement.** Set one window that reads as
   diathesis–stress and another that reads as vantage sensitivity, from the
   same underlying parameters. Write the two abstracts.
2. **Design the study.** What recruitment strategy would let you locate the
   crossover, and what would it cost?
3. **The curved case.** Sketch what two curved relationships would look like
   and say why locating a crossover becomes much harder.
4. **Read a paper.** Find a published gene–environment interaction study and
   report the range of environments it sampled. Ask whether it could have
   detected an advantage.

## The model

Also documented at the top of `tool.js`.

```
outcome(group, x) = slope(group) · (x − crossover) + noise
```

with `x` running from −1 (most adverse) to +1 (most supportive). The three
theories are the same two lines with the crossover in three places:

| Pattern | Crossover | Signature |
| --- | --- | --- |
| Diathesis–stress | +1.0 (or beyond) | Groups differ when adverse, converge when supportive |
| Differential susceptibility | 0.0 (inside the range) | Sensitive group worse at one end, better at the other |
| Vantage sensitivity | −1.0 (or below) | Groups alike when adverse, diverge when supportive |

The verdict box classifies from **the visible window only**, which is what
makes range restriction change the answer. Default slopes are 0.95 for the
higher-sensitivity group and 0.28 for the lower.

## Citation and evidence notes

- **Belsky and Pluess (2009)**, *Beyond diathesis stress*, is the paper that
  named differential susceptibility and set out the design requirements.
- **Pluess (2017)** on vantage sensitivity as the third pattern.
- **Roisman et al. (2012)** on how to test for differential susceptibility
  properly, including regions of significance and the crossover location —
  this is the source of the "test the crossover" item in the challenge.
- **Duncan and Keller (2011)** on the replication record of candidate
  gene-by-environment findings, which is why this tool names no gene.
- **Belsky, Bakermans-Kranenburg and van IJzendoorn (2007)** for the
  "for better and for worse" framing.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
