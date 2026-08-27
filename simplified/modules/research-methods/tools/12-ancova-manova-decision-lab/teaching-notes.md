# What a Covariate Can and Cannot Buy — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** Final year and postgraduate, once regression and ANOVA are secure
**Edition:** Simplified, and deliberately much narrower than its parent. This is
the covariate-adjustment experiment from **ANCOVA / MANOVA Decision
Laboratory**, cut down to the single point that changes what a reader may
conclude. The variable-role assignment stage, the entire multivariate half, the
homogeneity-of-slopes violation and the described designs to classify are in
the longer version at
`modules/research-methods/tools/12-ancova-manova-decision-lab/`.

## Learning objectives

By the end, a student should be able to:

1. read an adjusted difference off a plot as the vertical gap between two
   fitted lines of common slope;
2. explain that under randomisation a covariate buys precision, not correction;
3. say what an adjusted difference estimates when the groups were intact;
4. recognise that the same arithmetic can carry different warrants;
5. state the common-slope assumption and what its failure costs.

## Preparation

None. Seed 3140 with the default settings gives every student the same cohort,
so you can quote the same two numbers.

## Suggested use

**Projected, and built around one moment.** Set it up, let the students read
the four figures, then switch the design from *Random allocation* to *Two
intact classes* and say nothing. Wait. Someone will point out that nothing
moved. That is the lesson, and it lands better as a discovery than as a claim.

**In a dissertation supervision**, with a student who has proposed to
"control for" a baseline difference between two schools, two cohorts or two
clinics. Five minutes here replaces a long and usually unpersuasive argument.

**As preparation** before a lecture on quasi-experimental designs.

## Prediction question

Ask before the design is switched:

> The adjusted difference is +4.7 points. I am now going to tell you that these
> were not randomly allocated children but two existing classes. What happens
> to the 4.7?

Most students expect the number to change, or expect to be told the analysis
was wrong. Neither happens. The number is the same number, computed the same
way, and it is now answering a question nobody wanted the answer to.

## Activity sequence

1. **Read the four figures** at the default settings and locate the adjusted
   difference on the plot as the gap between the lines.
2. **Push the September gap to 10** under random allocation. The unadjusted
   difference is dragged well above the truth; the adjusted difference stays
   near it. Note the small caveat the activity adds here: a gap that large is
   not something randomisation plausibly produces, and the page says so rather
   than pretending otherwise.
3. **Return the gap to 0 and raise the covariate strength.** The estimate does
   not move much; the standard error falls noticeably. That is the precision
   argument, and it is the honest reason to include a covariate in a randomised
   trial.
4. **Set the covariate strength to 0 with a large gap.** Adjustment now does
   nothing except add noise. A covariate unrelated to the outcome buys nothing
   and costs a degree of freedom.
5. **Switch the design.** Nothing moves. Read the new warrant aloud.
6. **Release the explanation** and read the caution, which is the most
   important paragraph on the page.

## Debrief questions

- If adjustment cannot fix a non-equivalent comparison, why is it in almost
  every quasi-experimental paper you have read?
- A paper reports an adjusted difference and calls it "the effect of the
  programme, controlling for prior attainment". What has it claimed that its
  design cannot support?
- The standard error fell when we raised the covariate strength. Did the
  estimate get closer to the truth?
- Under what circumstances is there no single adjusted difference to report?

## Likely misconceptions

- **Adjustment removes confounding.** It removes the part of the difference
  that the measured covariate accounts for. Everything unmeasured stays.
  This is the misconception the activity exists to break.
- **A covariate is pointless in a randomised trial.** It is often very
  valuable, but for precision rather than correction. Step 3 is built for this.
- **Precision means accuracy.** Raising the covariate strength tightens the
  estimate whether or not the estimate is aimed at the right quantity.
- **"Controlling for" a variable is the same as holding it constant.** It is a
  statement about a fitted model, not about the world.
- **Any covariate helps.** One unrelated to the outcome buys nothing, and one
  measured *after* allocation can actively do harm, which is why the September
  timing is stressed on the page.

## Limitations and cautions

The simulation is deliberately generous to the intact-classes case: September
genuinely is the only systematic difference between the groups, because that is
how the data are generated. Real intact groups differ in ways nobody measured,
and there is no way to check from inside the data. Say this explicitly; the
page does, but it is worth repeating. The activity also assumes one common
slope for both groups. Where a covariate works differently in the two groups
there is no single adjusted figure to report, and the difference in slopes is
itself the finding; that violation lives in the longer version. Every number
here is fictional and none is a norm or a benchmark.

## Accessibility considerations

Everything is keyboard operable. The design switch is a two-option radio group
with both labels permanently visible, which was a deliberate change from a
dropdown: the pivot of the activity should not be a control whose alternative
state is hidden, and its option text cannot be truncated at any width. The
figure description carries every quantity, so a screen-reader user can follow
the whole argument without reading the plot. Groups differ by marker shape and
line dash as well as colour. On a narrow screen the figure scrolls sideways
rather than shrinking its labels below legibility. No timed content, no motion.

## Optional extension

Ask students to find a published quasi-experimental evaluation in their reading
list and to write one sentence saying what the adjusted difference in it
actually estimates. Most will find the paper's own abstract does not manage it.

## Evidence and citation notes

For what adjustment does and does not achieve with non-equivalent groups, see
Shadish, Cook and Campbell (2002), *Experimental and Quasi-Experimental Designs
for Generalized Causal Inference*, chapters 4 and 5. On covariate adjustment for
precision in randomised trials, see Senn (1994), *Testing for baseline balance
in clinical trials*, **Statistics in Medicine**, 13(17), 1715–1726. Lord's
paradox, which is the sharpest statement of the difficulty this activity
demonstrates, is in Lord (1967), *A paradox in the interpretation of group
comparisons*, **Psychological Bulletin**, 68(5), 304–305.
