# Teaching notes — Operationalisation Laboratory

`modules/research-methods/tools/02-operationalisation-laboratory/`

The coverage figure is arithmetic on a list somebody wrote down. Say that out
loud at least twice.

---

## Running it from the front

Start with a single measure and read the coverage map aloud. Then press Tick everything: coverage rises, three facets go from missing to covered, and reactivity and feasibility both collapse. The plan that measures the construct best is the plan nobody can afford to run, and it still does not reach the construct.

The most useful single line in the tool is the coverage figure's own caveat: it is calculated against a facet list that somebody wrote down. Change the list and the best measure changes with it.

## Intended level

First-year undergraduate research methods, and useful again with project
students writing a methods section. No statistics are required.

## Learning objectives

After the activity a student should be able to:

1. explain why an operational definition is a claim rather than a translation;
2. distinguish construct under-representation from construct-irrelevant
   variance and give an example of each;
3. describe the reactivity and feasibility costs of getting closer to a
   construct;
4. say what combining measures from different families buys, and what it does
   not;
5. recognise a design in which the intervention acts directly on the outcome
   measure.

## Estimated duration

- **Demonstration from the front:** 8 minutes.
- **Students in pairs:** 20 minutes, using two of the three constructs.
- **With the challenge and debrief:** 30 minutes.

## Preparation

None. If you want one line on a slide beforehand, use: *nobody has ever
measured engagement; they have measured things they hoped stood in for it.*

## The demonstration worth doing from the front

Start on **Academic engagement** and tick **lecture attendance records** only.
Read the coverage map aloud: one facet well reached, four not reached at all.
Then read the "also records" list — commuting distance, timetable clashes,
whether the lecture was recorded. Both halves of the problem in one screen.

Now press **Tick everything**. Coverage goes to its maximum, every facet is
reached, and two numbers move the wrong way: reactivity rises to *high* and
feasibility falls to *low*. Ask who is going to run that study.

Then the line that matters: even at maximum coverage, this is coverage of a
list of five facets that somebody invented. A different theory of engagement
would score the same plan differently, and none of the plans is the construct.

## Prediction question

*A study needs a measure of academic engagement. Which single measure would
come closest to capturing it?* Five options, including "none of them on its own
comes close" — which is the answer the tool argues for, and which gets its own
explanation rather than a tick.

The most instructive wrong answer is **hours logged on the virtual learning
environment**, because it is the one universities actually use and it is the
weakest of the six. The challenge at the foot of the page returns to it.

## Activity sequence

1. **Commit to an answer** on the opening question.
2. **One measure at a time.** Tick each of the six alone, and read what changes
   in the coverage map and in the "also records" list.
3. **Two measures, same family.** Tick the self-report scale and experience
   sampling. Coverage rises; the interpretation warns that agreement between
   two self-reports may show only that the same person answered both in the
   same mood.
4. **Show a defensible plan.** More than one family, every facet reached at
   least partly, feasibility no worse than moderate. Note that this is *not*
   the maximum-coverage plan, and ask why that might be the right call.
5. **Tick everything.** The affordability collapse.
6. **Switch construct** to Stress or Social connection and repeat step 2. The
   cortisol entry is worth reading aloud: time of day dominates the signal.
7. **The challenge.**

## Debrief questions

1. Give one thing that lecture attendance measures which has nothing to do with
   engagement, and one part of engagement it cannot see.
2. Why does the tool take the *maximum* facet level across measures rather than
   adding them up?
3. Two measures from the same family agree closely. Why is that weaker evidence
   than two measures from different families agreeing?
4. The experience-sampling entry says the prompt "interrupts the state it is
   asking about". Name another measure in the tool with the same problem.
5. The coverage figure never reaches "measures the construct". What would have
   to be true for it to?
6. In the challenge, the department could have kept the same intervention and
   made the claim safe. How?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Objective measures are better than self-report." | Attendance and logged hours are the most objective and the least informative here. Objectivity is about who records the number, not about what the number means. |
| "Use more measures and you will get there." | Tick everything. Coverage maxes out, feasibility collapses, and the construct is still not reached. |
| "The scale is validated, so it measures engagement." | Validation is an accumulating argument, not a property stamped on an instrument. The scale still reaches the behavioural facet only partly. |
| "Reactivity means the participants lied." | No. Reactivity is the measurement changing the thing measured — an observer changes the seminar even if nobody is dishonest. |
| "Confounds are about the independent variable." | Construct-irrelevant variance is a confound inside the *measure*. The challenge is a case where the intervention and the measure are the same system. |
| "The coverage percentage tells me how good the measure is." | It tells you how the measure scores against five facets somebody invented. Change the facets and the ranking changes. |

## Limitations and cautions

- **The facet lists are invented for teaching.** Five per construct, chosen to
  make the trade-offs visible. Real theoretical accounts disagree.
- **The coverage percentage is not a validity coefficient** and must not be
  quoted as evidence about any real instrument.
- **No real instruments.** Measures are described generically; no published
  scale, item or proprietary assessment appears.
- **Reactivity and feasibility are three-level labels.** In practice both
  depend on setting, population and resources.
- **Nothing here validates anything.** The tool shows what a validity argument
  would have to cover, not whether one succeeds.

## Accessibility considerations

- Native select, checkboxes and buttons; every control labelled, every group in
  a fieldset with a legend.
- The coverage map is HTML, not an image. Each row prints its facet name and
  its standing in words — *not reached*, *partly reached*, *well reached* — so
  neither bar length nor fill colour carries meaning alone.
- The map and the four-figure readout are pinned to the top of the stage, so
  they stay visible while the measure list below is worked through.
- Every tick announces a full sentence through the polite live region,
  including the running coverage summary.
- The bar transition is disabled under `prefers-reduced-motion`.
- Forced-colours rules provided; usable at 320px and at projector widths.

## Optional extension tasks

1. **Rewrite the facet list.** Drop "agentic" and add "attendance-independent
   preparation". Which measure becomes the best one? What does that show about
   the coverage figure?
2. **Design the cheapest defensible plan** for one construct: the smallest
   number of measures that reaches four of five facets with feasibility no
   worse than moderate. Defend it in three sentences.
3. **Find the contamination in your own project.** Take the outcome measure
   from a study you are reading and list four things it records that are not
   the construct.
4. **The disagreement case.** Two measures of stress point in opposite
   directions for the same person. Write the paragraph a paper would need.

## The model

Also documented at the top of `tool.js`.

Each measure carries, per facet, a coverage level:

| Level | Meaning |
| --- | --- |
| 0 | does not reach this facet |
| 1 | reaches it partly |
| 2 | reaches it well |

For a plan, the level of a facet is `max` across the selected measures, never
the sum. Coverage is reported as the total over `2 × 5 = 10` points.

- **Plan reactivity** = highest reactivity among the selected measures. One
  intrusive measure makes the whole protocol intrusive.
- **Plan feasibility** = lowest among the selected measures, then reduced by
  one step for every measure beyond two, floored at *low*.

### Reference values a lecturer can check

Academic engagement, with **lecture attendance records** alone:

- coverage **2 of 10 points**; facets missed entirely **4**;
- reactivity **low**; feasibility **high**.

Academic engagement, **Show a defensible plan** (attendance records +
self-report scale):

- coverage **8 of 10 points**; facets missed entirely **0**;
- reactivity **moderate**; feasibility **high**.

Academic engagement, **Tick everything** (all six):

- coverage **9 of 10 points**; facets missed entirely **0**;
- reactivity **high**; feasibility **low**.

Note that all six measures together reach **9**, not 10. No measure in the set
reaches *agentic* engagement well — asking questions and shaping one's own
learning is the facet nobody has a good instrument for, and that is worth
pointing out from the front.

The three "defensible plan" presets are:

| Construct | Measures | Coverage | Reactivity | Feasibility |
| --- | --- | --- | --- | --- |
| Academic engagement | Attendance records + self-report scale | 8 of 10 | moderate | high |
| Stress | Perceived stress questionnaire + heart-rate variability | 9 of 10 | moderate | moderate |
| Social connection | Name generator + loneliness scale + society memberships | 7 of 10 | moderate | moderate |

Each preset draws on more than one family deliberately, so that one family's
irrelevant influences do not run through the whole study, and none of them is
the maximum-coverage plan. The best affordable plan and the most complete plan
are different objects, which is the argument.

## Citation and evidence notes

- **Messick (1989, 1995)** for construct under-representation and
  construct-irrelevant variance, which are the two axes the tool is built on.
- **Campbell and Fiske (1959)** for why measures from different families
  agreeing is stronger evidence than measures from one family agreeing.
- **Cronbach and Meehl (1955)** for construct validity as an accumulating
  argument rather than a property.
- **Webb, Campbell, Schwartz and Sechrest (1966)** on unobtrusive measures and
  reactivity.
- **Fredricks, Blumenfeld and Paris (2004)**, and **Reeve and Tseng (2011)** for
  the agentic facet, if you want a real engagement literature to set the
  invented facet list against.
- **Flake and Fried (2020)** on measurement practices, for the point that most
  published operationalisations are never justified at all.

References are deliberately not embedded in the page, so the tool does not
appear to derive its fictional measures from any of them.
