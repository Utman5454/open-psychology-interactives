# Teaching notes — Intelligence-Test Battery Builder

`modules/personality-individual-differences/tools/31-intelligence-test-battery-builder/`

Seven task families, one session, three purposes, and no configuration that
wins on everything.

---

## Intended level

Second- or third-year undergraduate on an individual differences,
psychometrics or assessment strand. It assumes students have met the idea of a
cognitive battery and have probably not been asked to build one.

Also useful for postgraduates before a placement involving standardised
assessment — not to teach assessment, which requires supervised training, but
to make the design decisions behind the instruments visible.

## Learning objectives

After the activity a student should be able to:

1. explain why validity is a property of a stated use rather than of a test;
2. name the constraints that assembling a battery forces into conflict;
3. explain why composite reliability rises with length almost regardless of
   content, and why that makes it weak evidence of quality;
4. explain why removing language reduces some demands without removing
   dependence on experience;
5. justify a battery against a stated purpose rather than in the abstract.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students working in pairs:** 25 minutes.
- **With all three scenarios and full debrief:** 40 minutes.

## Preparation

None. Read the "What this is not" panel aloud if you are running this with a
group who may have encountered real cognitive assessment — it matters that
nobody leaves thinking they have done a simplified version of clinical
practice.

## The prediction question

> **What makes one test battery better than another?**

The options are: the longest, the most reliable, it depends what it is for,
and the one free of cultural content. Most students choose "the most reliable"
or "free of cultural content". Both are instructive wrong answers, and the
feedback for each points at the tool in this module that takes it apart — the
Alpha Trap for reliability, the Culture-Fair Test Challenge for the second.

## Activity sequence

1. **Commit to an answer.** The task list stays locked until they do.
2. **Build for the research scenario.** 45 minutes, breadth and reliability
   weighted heavily. Students usually fill the time and are surprised by how
   quickly it goes.
3. **Submit.** The battery is scored, and then scored again against the other
   two purposes.
4. **Change the purpose without changing the battery.** This is the moment
   worth doing from the front. Every number moves. Nothing about the battery
   has changed.
5. **Build for the screening scenario.** Twenty minutes and a tired person.
   Students discover that almost everything they wanted has to go.
6. **Build for the educational scenario.** The one where a flat composite is
   least useful and profile coverage matters most.

## Debrief questions

1. You built a battery for research and it scored badly for screening. Is it a
   good battery?
2. Which single task did you find hardest to leave out, and what did including
   it cost?
3. Composite reliability went up every time you added a task. Did the battery
   get better every time?
4. Vocabulary has the highest reliability of any task here and the second
   highest exposure-dependence. When is that a good trade, and when is it a
   disaster?
5. What could a low score on this battery mean, other than low ability?
   *(Unfamiliarity with the format, fatigue, anxiety, sensory or motor demands,
   language of administration, not having been taught the content, not
   understanding that speed was wanted.)*
6. The screening scenario says the result decides only whether a fuller
   assessment is arranged. Why is that sentence in the brief?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Just pick the most reliable tasks." | Build that battery and look at coverage. Reliability is the cheapest property to buy and says nothing about what is being measured. |
| "Matrix reasoning is culture-free." | Its exposure-dependence is 0.35 here, not 0. Ask what a person needs to know before a matrix puzzle makes sense: that there is one answer, that the rule is abstract, that speed matters, that guessing is allowed. |
| "Longer is better." | Burden. Fatigue depresses later tasks, so a battery at the ceiling measures endurance as well as ability. |
| "The high-scoring battery is the right one." | "Fit to purpose" is a weighted sum invented for this tool. It makes trade-offs visible; it is not a real index and should not be treated as one. |
| "This is what an IQ test is." | It is a model of the *design decisions* behind one. No real test, item, norm or scoring rule appears here, and nothing is administered to anyone. |
| "So intelligence testing is arbitrary." | Overcorrection. The decisions are constrained, defensible and consequential — which is the opposite of arbitrary. What they are not is neutral. |

## Limitations and cautions

State the first three aloud.

- **No real test is involved.** Seven generic families, described in general
  terms. No published item, subtest, norm, scoring rule or test name is
  reproduced. The numbers are illustrative values written for this page.
- **No one is measured.** The tool scores batteries, never people, and
  produces no ability estimate for anybody.
- **No group differences are modelled anywhere.** Exposure-dependence is a
  property of a *task* — how much its score depends on prior opportunity to
  learn its content. It is never attached to a person or a population in this
  tool and must not be read that way. If a student starts to talk about group
  scores, that is the moment to point at the Culture-Fair Test Challenge, which
  is built to handle the question properly.
- **Composite reliability is simplified** — Spearman–Brown on the mean task
  reliability, ignoring intercorrelations, which a real calculation needs.
- **"Fit to purpose" is invented for this tool** and is not a recognised
  index.
- **Real assessment involves far more**: rapport, standardised administration,
  qualification requirements, behavioural observation, convergent evidence, and
  the judgement to know when a score should not be interpreted at all.

## Accessibility considerations

- Native checkboxes, a select and buttons throughout; no custom widgets and no
  dragging.
- Each task card carries its costs as text — minutes, reliability, burden,
  exposure-dependence — so no one has to interpret a chart to make a choice.
- The coverage chart is hidden from assistive technology and paired with a
  visible table that says "not sampled" and "barely" in words as well as
  showing bar length.
- The requirements checklist writes "(met)" or "(not yet)" into the text, so
  the tick marker is never the only carrier.
- Every toggle announces the running totals: minutes used, burden, domains
  sampled.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **The impossible brief.** Ask students to build a battery that scores above
   60% fit on all three purposes at once. Have them report what stopped them.
2. **Defend it in writing.** Three sentences justifying their screening
   battery to a supervisor, including one sentence on what it cannot tell you.
3. **The eighth task.** Design a task family that would improve the
   educational-support battery, and state its minutes, reliability, domains,
   burden and exposure-dependence. Then say how you would find those values
   out.
4. **Re-weight the purpose.** If the research scenario cared only about
   reliability, what battery would win, and what would the resulting paper be
   entitled to claim?

## The model

Also documented at the top of `tool.js`.

- **Breadth** = 0.6 × (proportion of the six domains sampled at ≥ 0.3) + 0.4 ×
  (normalised Shannon evenness of coverage across domains). The evenness term
  is there so that measuring one domain four ways does not count as breadth.
- **Composite reliability** = Spearman–Brown applied to the mean task
  reliability: `k·r̄ / (1 + (k−1)·r̄)`.
- **Exposure-dependence** = time-weighted mean of the tasks' own values.
- **Burden** = simple sum, compared against the scenario's cap.
- **Fit to purpose** = a weighted sum of breadth, composite reliability,
  (1 − exposure-dependence) and a burden term, with weights that differ by
  scenario.

### The seven task families

| Task | Min | Reliability | Domains | Exposure | Burden |
| --- | --- | --- | --- | --- | --- |
| Vocabulary and word meaning | 12 | 0.90 | Verbal 0.9 | 0.85 | 2 |
| Matrix reasoning | 18 | 0.88 | Fluid 0.85, Spatial 0.2 | 0.35 | 3 |
| Symbol–digit coding | 6 | 0.82 | Speed 0.9, Memory 0.15 | 0.30 | 3 |
| Sequence recall and reordering | 10 | 0.83 | Memory 0.9 | 0.25 | 4 |
| Mental rotation of figures | 9 | 0.80 | Spatial 0.9, Fluid 0.2 | 0.30 | 3 |
| Applied numerical problems | 14 | 0.86 | Quantitative 0.85 | 0.75 | 4 |
| General knowledge questions | 8 | 0.84 | Verbal 0.6 | 0.95 | 2 |

### The three scenarios

| Scenario | Minutes | Burden cap | Weights (coverage / reliability / exposure / burden) |
| --- | --- | --- | --- |
| Research study | 45 | 14 | 0.40 / 0.35 / 0.15 / 0.10 |
| Educational support | 60 | 12 | 0.50 / 0.15 / 0.20 / 0.15 |
| Brief screening | 20 | 8 | 0.35 / 0.20 / 0.20 / 0.25 |

## Citation and evidence notes

- **Messick (1989)** and the current *Standards for Educational and
  Psychological Testing* are the sources for validity as a property of an
  interpretation and use, not of an instrument.
- **Carroll (1993)** and the Cattell–Horn–Carroll synthesis are behind the
  choice to treat ability as several broad domains rather than one.
- **Cronbach and Gleser (1957)** on bandwidth–fidelity applies here as
  directly as it does to personality.
- **Flanagan and Harrison (eds.), *Contemporary Intellectual Assessment***
  covers cross-battery reasoning and why domain coverage drives battery
  selection in practice.
- On the limits of "culture-fair", see the reading suggested with the
  Culture-Fair Test Challenge in this module.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them. They come from the model above
and nowhere else.
