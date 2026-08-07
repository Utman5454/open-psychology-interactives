# Teaching notes — Multiple Comparisons, FWER and Forking Paths

`modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/`

Let the room drive Experiment 2. Ask for the outcome first, then take
suggestions when the first analysis comes back null — somebody will propose
dropping the slow responders, somebody else will propose looking at first-years,
and every suggestion will be perfectly sensible. Keep count out loud.

---

## Running it from the front

Press Run one experiment half a dozen times before running the thousand. Most runs produce one or two marked squares out of twenty, in data where there is nothing at all to find. Ask what a paper reporting one of those squares would look like.

Then run the thousand and compare the counted rate with 1 &minus; (1 &minus; &alpha;)k in the disclosure. Drag k and watch the curve bend: at k = 14 the family-wise rate has already passed a half.

Now set how many have a real effect to 5 and switch the correction on. The false-positive rate collapses, which is what Bonferroni is for &mdash; and the detection rate for the five real effects collapses with it. Both figures are in the readout, deliberately side by side.

Let the room drive. Ask for the outcome first, then take suggestions when the first analysis comes back null: somebody will propose dropping the slow responders, somebody else will propose looking at first-years, and each suggestion will be perfectly sensible. Keep count out loud.

When a significant result appears, stop and ask what the paper would say. Then press Show me every path. The point is not that the analyst was dishonest &mdash; the point is that the p-value in the paper is the smallest of many, and its stated meaning assumed it was the only one.

Fresh dataset regenerates the data with no effect in it and clears the search, so the demonstration can be run again with a different room and a different route through the garden.

## Intended level

Final-year undergraduate or taught postgraduate, and worth running with anybody
about to analyse their own data. It assumes *p*-values (tool 08), the t-test
(tool 16) and power (tool 17). It is the last tool in the module and the one
that puts the rest into context.

## Learning objectives

After the activity a student should be able to:

1. compute a family-wise error rate and say which family it belongs to;
2. describe what a Bonferroni correction buys and what it costs;
3. explain how ordinary analytic flexibility inflates false positives without
   anyone intending to cheat;
4. explain why a reported *p*-value assumes it was the only analysis run;
5. distinguish planned multiplicity, exploratory analysis, undisclosed
   selective reporting and confirmatory inference.

## Estimated duration

- **Demonstration from the front:** 15 minutes.
- **Students in pairs:** 30 minutes.
- **With the challenge and debrief:** 50 minutes.

## Preparation

None. It is worth saying at the start that nobody in this laboratory is going
to cheat, and that this is what makes the problem hard.

## The demonstration worth doing from the front

1. Take the prediction as a vote. "About 5%" is common and is the whole
   misconception in one answer.
2. Press **Run one experiment** half a dozen times. Most runs show one or two
   crossed squares out of twenty, in data with nothing to find. Ask what a paper
   reporting one of those squares would look like.
3. Run the **thousand** and compare the counted rate (**63.0%**) with the
   predicted **64.2%** in the disclosure.
4. Drag **k** and watch the rate bend: it passes a half at fourteen tests.
5. Set **five real effects** and run a thousand: **53.2%** of experiments give a
   false positive and **75.6%** of the real effects are found. Now switch
   **Bonferroni** on and run again: **3.9%** and **33.9%**. Both numbers, one
   readout, one trade.
6. Move to Experiment 2 and let the room choose. Keep a tally on the board.
7. When something significant appears, stop. Ask what the paper would say. Then
   press **Show me every path**.

## Prediction question

*Twenty independent tests, every null true, α = .05. What is the probability
that at least one comes out significant?* — about 5%; about 20%; **about 64%**;
about 95%.

"About 5%" is the instructive wrong answer: it is the rate for one test, and the
question was about the family.

## Activity sequence

1. **Commit to the prediction.**
2. **Six single experiments**, counting crosses each time.
3. **A thousand**, then compare with the formula.
4. **Sweep k** and find where the rate passes a half.
5. **Five real effects, correction off, then on** — record all four numbers.
6. **Experiment 2**: search the garden, counting paths aloud.
7. **Reveal every path.**
8. **The challenge**: four studies, four practices.

## Debrief questions

1. Every test used α = .05 and 63% of experiments produced a false positive.
   Which of those two numbers is wrong?
2. Who decides what counts as the family?
3. Bonferroni took the false-positive rate from 53% to 4%. What else did it
   take, and by how much?
4. In Experiment 2 you ran one test and reported one *p*-value. What is there to
   correct for?
5. What would the paper have claimed, and what would a reader have believed?
6. Which of the four practices in the challenge is a problem, and why is it not
   the one with the most tests?
7. What does preregistration actually record?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Each test is fine, so the study is fine." | 63% of experiments produce a false positive. |
| "Corrections make everything safe." | Detection of real effects: 75.6% to 33.9%. |
| "Bonferroni is the right correction." | It is the simplest. Holm controls the same rate with more power. |
| "I only ran one test, so there is nothing to correct." | Experiment 2. |
| "This is about dishonest researchers." | Every choice in the garden is defensible on its own. |
| "Exploratory work is bad science." | Study B is fine. It is labelled. |
| "More tests is the problem." | Study B has twelve and is fine; Study C has eight and is not. |
| "A p-value means the same thing however it was found." | It means what it says only if the analysis was fixed in advance. |

## Limitations and cautions

- **No real study and no real dataset.** The ninety students are invented and
  the generating model contains no group difference on anything, so every
  significant result found in Experiment 2 is a false positive by construction.
- **Independence is assumed in Experiment 1 and false in Experiment 2.** The
  formula needs independent tests; real families overlap, which usually makes
  the true rate somewhat lower than the formula and never as low as α.
- **Bonferroni is not the only or the best correction.** Holm's step-down
  procedure and false-discovery-rate methods are both worth naming.
- **Seventy-two is a small garden.** A real analysis has far more paths; the
  count here is bounded because a menu had to fit on a page.
- **Correcting after the fact is not a repair.** It cannot recover the analyses
  that were considered and abandoned. The remedy is a record, not a formula.
- **This is not a technique.** The tool says so in the caution panel, in the
  goal banner and in the feedback, and it should be said out loud too.

## Accessibility considerations

- Native ranges, selects, radios, a number input and buttons; every control
  labelled, every group in a fieldset with a legend.
- Sliders announce meanings in words ("every null in the family is true").
- Both charts are hidden from assistive technology and paired inside their
  figures with **visible tables**; disclosures hold the theory-beside-simulation
  table and the distribution of all 72 paths.
- A significant test carries a **cross** as well as a fill; a test with a real
  effect has a **heavier outline**; the current path is **ringed**; the goal
  checklist writes "(met)" or "(not yet)" in words.
- Pinned primaries measure 477px and 463px tall at 1366×768.
- Every action announces a full sentence; focus moves to each experiment's
  heading; forced-colours rules provided; usable at 320px.

## Optional extension tasks

1. **Find the k at which the family-wise rate passes 50%** at each of the three
   α values, and put the three numbers beside each other.
2. **Write the two abstracts.** For the significant path you found in
   Experiment 2, write the abstract as it would have appeared, then write the
   honest version.
3. **Preregister it.** Write a four-line analysis plan for the fictional study
   in Experiment 2 that would have closed the garden, and say what it costs.
4. **Count your own garden.** For a study you are planning, list the outcomes,
   exclusion rules, subgroups and covariates you might use, and multiply.

## The model

```
Experiment 1, per experiment:
  k independent two-sample t-tests, 40 per group
  `real` of them have a true effect of d = 0.60; the rest have none
  threshold = alpha, or alpha/k under Bonferroni
  FWER = 1 - (1 - threshold)^k
  expected false positives = (k - real) * threshold

Experiment 2, one dataset of 90 students, no group difference on anything:
  4 outcomes (correlated) x 3 exclusion rules x 3 subgroups x 2 covariate
  decisions = 72 paths
  each path: filter rows, optionally residualise the outcome on baseline,
  run a pooled two-sample t-test
```

Randomness is seeded with `mulberry32` plus Box–Muller.

### Reference values a lecturer can check

Experiment 1 at **k = 20, α = .05, seed 4711**:

| Setting | Predicted FWER | Counted over 1,000 | Real effects found |
| --- | --- | --- | --- |
| No correction, 0 real | 64.2% | 63.0% | — |
| No correction, 5 real | 53.7% | 53.2% | 75.6% |
| Bonferroni, 5 real | 4.9% | 3.9% | 33.9% |

False positives per experiment with no correction and no real effects: **1.00**
predicted, **0.98** counted. Under Bonferroni the per-test threshold is
**.0025**.

Experiment 2 on the **default dataset (seed 8820)**:

| Range of p | Number of the 72 paths |
| --- | --- |
| Below .01 | 0 |
| .01 to .05 | 5 |
| .05 to .10 | 8 |
| Above .10 | 59 |

The smallest of all 72 is **p = .026**. The first path in the menus — overall
revision score, no exclusions, everyone, unadjusted — gives **p = .173**; simply
changing the outcome to comprehension score gives **p = .030**, which is a
significant result on the third analysis anyone is likely to try. **Fresh
dataset** regenerates with a new seed, still with no effect, so the
demonstration can be run again with a different route through the garden.

## Citation and evidence notes

- **Gelman and Loken (2013)**, "The garden of forking paths", the source of the
  framing in Experiment 2 and of the argument that the damage does not require
  conscious multiple testing.
- **Simmons, Nelson and Simonsohn (2011)**, "False-positive psychology", for the
  demonstration that a handful of researcher degrees of freedom takes the
  false-positive rate above 60%.
- **Steegen, Tuerlinckx, Gelman and Vanpaemel (2016)** on multiverse analysis,
  which is the constructive response to the same observation.
- **Wicherts et al. (2016)** for a checklist of the degrees of freedom
  available at each stage of a study.
- **Nosek, Ebersole, DeHaven and Mellor (2018)** on preregistration as a record
  of which kind of inference is being made rather than as a moral test.
- **Holm (1979)** and **Benjamini and Hochberg (1995)** for the corrections the
  page names as better alternatives to Bonferroni.

References are deliberately not embedded in the page, so the tool does not
appear to derive its simulated studies from any of them.
