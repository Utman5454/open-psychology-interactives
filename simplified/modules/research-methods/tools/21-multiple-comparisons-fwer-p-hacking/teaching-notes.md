# The Garden of Forking Paths — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** Second year and above, once t-tests and p-values are secure
**Edition:** Simplified, and deliberately narrower than its parent. This is the
forking-paths half of **Multiple Comparisons, FWER and p-Hacking**. The
family-wise error rate simulation, the Bonferroni correction shown with its
cost, and the vignette classification are all in the longer version at
`modules/research-methods/tools/21-multiple-comparisons-fwer-p-hacking/`.

## Learning objectives

By the end, a student should be able to:

1. say what a p-value is a statement about, and why it depends on the analysis
   having been fixed in advance;
2. recognise that one reported analysis may be one of many that were
   available, without the others ever having been run;
3. explain why nobody has to be dishonest for the number to mislead;
4. say why correlated paths resist a simple correction;
5. name pre-registration and reporting the analysis space as responses.

## Preparation

None. The dataset is generated from a fixed seed, so every student sees the
same 90 students and you can quote the same figures.

## Suggested use

**Projected, with the room choosing.** Ask for an outcome, then an exclusion
rule, then a subgroup, taking each from a different student and asking them to
justify it. Every justification will be reasonable. Run it, then ask for a
different set. Then reveal.

**As preparation** before a session on pre-registration, so that the answer
arrives after the problem.

**Immediately before students analyse their own project data.** Five minutes
here is worth an hour of exhortation afterwards.

## Prediction question

Before students open it, ask:

> Ninety students, four outcomes, a baseline score, a speed measure and a year
> label. How many different complete, defensible analyses could you write up
> from that?

Most rooms guess single figures. The answer here is seventy-two, and that is
with only four decisions.

## Activity sequence

1. Four choices: which outcome, which exclusions, which students, adjust for
   baseline or not. Every one is defensible.
2. **Run this analysis.** A real pooled t-test on the filtered rows, with a
   p-value, a sample size and a difference in points.
3. Walk two more paths. The trail records what was run.
4. **Show me every path.** All 72 analyses appear at once on a p-value axis,
   with the ones walked marked, and the page says what the room has not been
   told until this moment: the data were generated with no group difference in
   them at all.

Seven of the seventy-two fall below 0.05, and the smallest is 0.008.

## Debrief questions

- Which of the four choices would you have found hardest to justify? Which
  would a reviewer have questioned?
- Nobody ran seventy-two tests. Why is that the difficult part?
- The smallest p is 0.008. What would a paper reporting that look like?
- What would have to have been recorded, and when, for the p-value to mean
  what it says?
- Should we divide 0.05 by 72? Why not?

## The moment worth stopping on

The second and last questions together. The intuitive fix is a correction, and
it is the wrong shape for this problem: nobody performed a family of tests, and
the paths share participants and outcomes, so they are heavily correlated
rather than independent. There is no family to correct over on paper. That is
why the answers are pre-registration and reporting the whole analysis space,
not arithmetic on an alpha level. If your group has already met Bonferroni,
this is the moment to say what it does not solve.

## Likely misconceptions

**"This is p-hacking, and p-hacking is cheating."** The activity refuses that
framing. Every choice offered is one a careful researcher might make in good
faith. The problem is that the reasons for a choice are available after the
data are, and a choice that would have gone the other way on other data is a
degree of freedom the p-value has not accounted for.

**"So all published p-values are worthless."** No. A p-value from a
pre-specified analysis means what it says. The issue is knowing which kind you
are reading.

**"A Bonferroni correction fixes it."** See above.

**"Exploratory analysis is bad."** It is essential. Reporting it as
confirmatory is the problem.

**"Seven out of seventy-two, so about one in ten analyses is a false
positive."** That number is a property of this one simulated dataset. Another
seed gives a different count, sometimes zero. Say so; the activity's
limitations section does.

## Limitations and cautions

- The dataset is invented and the exact count of significant paths is a
  property of this one sample. Do not quote 7 of 72 as a general rate.
- Four decisions is a deliberate understatement. Real analyses involve many
  more, including how a variable is coded, which model is fitted and what
  counts as an outlier.
- The paths here are correlated in a particular way that follows from one
  latent tendency driving all four outcomes. Real correlation structures
  differ, and the number of paths that reach significance depends on them.
- The activity does not cover the family-wise error rate, corrections or their
  costs. Those are separate ideas and are in the longer version.
- Nothing here tells a student how to analyse their own data. It tells them
  what to record, and when.

## Accessibility

Keyboard operable throughout, with every analysis choice a labelled native
select. Each result is reported as text giving the p-value, the sample size
and the difference in points, and the trail of analyses run is an ordered list
rather than only a graphic. The reveal figure carries a description stating
how many of the 72 analyses fall below 0.05, how many the learner walked, and
that the data contain no difference, so the counts never depend on reading the
dots. Walked paths differ from the rest by size and fill as well as by colour.
There is no timed content and no motion.

## Extension

Ask students to write the methods section for the path with the smallest
p-value, honestly, in the form it would take in a paper. Then ask what a
reader would have to be told for it to be read correctly, and where in a
normal paper that information would go. The answer is usually nowhere, which
is the argument for pre-registration in one sentence.

## Evidence and reading

Gelman and Loken on the garden of forking paths, and Simmons, Nelson and
Simonsohn on researcher degrees of freedom, are the two to send students to.
Both are short and both are better read after this activity than before it.
