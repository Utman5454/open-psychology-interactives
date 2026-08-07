# Teaching notes — Research Question to Method Mapper

`modules/research-methods/tools/01-research-question-method-mapper/`

The tool never names a statistical test. That is the point of it.

---

## Running it from the front

Question 6 is the one to spend time on. It can be read as a question about explanation or a question about interpretation, and both readings are defensible; which one you take depends on what you think an answer would look like, not on the wording. Ask the room to argue for each before checking.

Question 3 catches almost everyone on part 4: the observations are nested within shift workers, so the independence assumption of an ordinary correlation is already broken before any analysis is chosen.

## Intended level

First- or second-year undergraduate research methods, and useful again with
final-year project students who have collected data before deciding what claim
they wanted to make. It assumes no statistics at all.

## Learning objectives

After the activity a student should be able to:

1. identify what kind of claim a research question is trying to support;
2. distinguish description, difference, association, prediction, explanation
   and interpretation as aims;
3. explain why the same data structure can require different treatment
   depending on the design that produced it;
4. name what a method choice still depends on — nesting, allocation, level of
   measurement, number of predictors, epistemological position;
5. recognise a question that cannot yet be answered, and say what would settle
   it.

## Estimated duration

- **Demonstration from the front:** 10 minutes — questions 3 and 6 alone carry
  most of the argument.
- **Students in pairs:** 25 minutes for all six.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. If you want a single slide beforehand, put the six aims on it:
description, difference, association, prediction, explanation, interpretation.

## The demonstration worth doing from the front

Question 3, the shift-worker sleep diary. Ask the room what test they would
use. Almost everyone says a correlation. Then read the vignette again: 40
workers, 14 days each.

Ask what that makes of the 560 rows. The answer — that they are nested within
40 people, that treating them as independent will overstate the precision, and
that "people who sleep more perform better" and "a person performs better after
their own longer nights" are two different questions that can point in opposite
directions — is worth more than the whole of the rest of the tool.

Then question 6, which the tool refuses to settle. Take a vote on explanation
against interpretation, hear an argument for each, and only then check.

## Prediction question

*What most determines which analysis a study should use?* — the type of data,
the level of measurement of the outcome, the claim the question is trying to
support together with the design that could support it, or the number of groups.

All four options receive a written response. The two flowchart answers (data
type; number of groups) are treated as late questions rather than wrong ones.

## Activity sequence

1. **Commit to an answer** on the opening question.
2. **Question 1 — belonging.** Interpretative, qualitative, interview study.
   The decisive missing item is the epistemological position: the same
   transcripts support an experiential and a discursive reading.
3. **Question 2 — mindfulness.** Difference, quantitative, between-groups. Note
   that "whether allocation was random" is *already answered in the vignette*;
   selecting it is a reading slip and the tool says so.
4. **Question 3 — sleep.** The nesting trap. See above.
5. **Question 4 — forecasting.** Prediction, not explanation. A model can
   forecast well using variables that produce nothing.
6. **Question 5 — prevalence.** Two decisive missing items: how the sample was
   recruited, and where the threshold for "lonely" sits.
7. **Question 6 — group work.** Deliberately ambiguous. Both readings are
   marked well supported and the tool says why it will not choose.
8. **The challenge**, which returns to group work with data already in hand.

## Debrief questions

1. Question 2 and question 3 both end up relating two quantities. Why can only
   one of them support a sentence with the word "reduce" in it?
2. In question 4, name a variable that would forecast marks well and produce
   nothing. What would you have to do to tell the two apart?
3. Question 5 asks how common loneliness is. Two researchers using the same
   questionnaire report 18% and 41%. Give two ways that could happen without
   either of them making a mistake.
4. In question 1, what would change about the analysis if the researcher took a
   discursive rather than an experiential position?
5. Question 6 has no settled answer. Is that a defect in the question, or a
   stage of the research not yet completed?
6. The tool never names a test. What would you need to add to each of the six
   before naming one would be sensible?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "You look at the data and pick the test." | Question 2 against question 3. Same kind of numbers, incompatible treatment, because of how they were produced. |
| "Correlation and regression are different tests." | Question 4 uses regression to forecast; question 3 uses association to describe covariation. The arithmetic overlaps; the claims do not. |
| "Qualitative means you did not have enough participants for statistics." | Question 1 and question 6's interpretative reading. Neither would be improved by a larger n; they ask something a number cannot answer. |
| "Mixed methods means doing both." | The tool refuses that in three separate places. A design earns the name when each strand answers a stated part of one question and the two are integrated. |
| "Random allocation makes a study good." | It makes one particular claim payable. It does nothing for question 2's volunteer sample. |
| "A big n fixes sampling problems." | Question 5. A mailing-list survey with 4,000 responses estimates the same biased quantity more precisely. |
| "Why-questions are qualitative." | Question 6. "Why" belongs to no tradition; the wording does not settle it. |

## Limitations and cautions

- **These are not the only defensible readings.** The tool records a small
  number per question. A supervisor could argue for others, and question 6
  exists to make that explicit.
- **No real studies.** All six are invented, including the settings and sample
  sizes.
- **It does not name a test**, deliberately. It stops where a test could
  sensibly be chosen.
- **The qualitative design options are compressed.** One "interview or
  focus-group study" option stands in for a large family of designs with quite
  different commitments.
- **Reading a question well is not competent research.** It says nothing about
  whether the measures are any good or whether the study is worth doing.

## Accessibility considerations

- Native selects, radios, checkboxes and buttons; every control has an explicit
  label and sits in a fieldset with a legend.
- The question text and a running summary of the learner's reading are pinned
  to the top of the stage, so the question stays visible while the four
  controls below are set. This is what keeps the exercise viewport-local.
- Feedback prints its standing in words — *Well supported*, *Defensible*,
  *Hard to defend from this wording* — so the coloured left border never
  carries the meaning on its own.
- The stage track marks the current and completed questions with visually
  hidden text as well as with styling.
- Focus moves to the mapper heading when it unlocks and to the challenge
  heading when it opens.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Rewrite question 6 twice** so that the first version can only be read as a
   question about explanation and the second only as a question about
   interpretation. Compare what each version gives up.
2. **Break question 2.** Change one word so that the design described can no
   longer support the claim.
3. **The missing seventh.** Write a research question from your own area, run
   it through the four decisions, and hand it to someone else to read
   independently. Compare.
4. **Prevalence detective.** Find two published prevalence figures for the same
   construct that differ by more than a factor of two, and account for the
   difference using only what question 5 raises.

## The model

There is no scoring. Every option, for every question, carries a standing and a
written note:

| Standing | Meaning |
| --- | --- |
| `strong` | Well supported by the wording as written |
| `ok` | Defensible; the note says what it commits you to |
| `weak` | Hard to defend from this wording; the note says why |

Part 4 uses a different set, because it is about what is missing rather than
what is right:

| Standing | Meaning |
| --- | --- |
| `key` | Genuinely unknown and would change the analysis |
| `fair` | Reasonable to want, for a stated reason |
| `given` | Already stated in the vignette — selecting it is a reading slip |
| `none` | Would not bear on this question |

The summary verdict counts how many of parts 1–3 are `weak`; part 4 is reported
separately, as decisive items held and decisive items missed. Nothing is
totalled into a mark.

### The six questions and their well-supported readings

| # | Question | Aim | Kind | Design | Decisive missing item(s) |
| --- | --- | --- | --- | --- | --- |
| 1 | Belonging | Interpretation | Qualitative | Interview | Epistemological position |
| 2 | Mindfulness recording | Difference | Quantitative | Between-groups | Level of measurement |
| 3 | Sleep and working memory | Association | Quantitative | Repeated within people | Independence / nesting |
| 4 | Forecasting marks | Prediction | Quantitative | Existing records | Number and overlap of predictors |
| 5 | Loneliness prevalence | Description | Quantitative | Survey | Sampling; level of measurement |
| 6 | Group-work disengagement | Explanation *and* interpretation | All three defensible | Interview, survey or records | Epistemological position; allocation |

"Show a worked reading" fills in the first well-supported option for parts 1–3
and every `key` item for part 4, then checks it.

## Citation and evidence notes

- **Braun and Clarke (2013, 2022)** for the argument that qualitative method
  follows from the research question and the researcher's theoretical position
  rather than from the data type. Relevant to questions 1 and 6.
- **Shmueli (2010), "To explain or to predict?"** is the cleanest statement of
  the distinction question 4 turns on.
- **Kievit et al. (2013)** on the between-person / within-person confusion in
  question 3.
- **Rousseau, Bertrand and Boyer (2019)** or any standard multilevel text for
  why nested observations are not a technicality.
- **Meehl (1990)** remains the sharpest account of what goes wrong when a
  procedure is chosen before a claim is specified.

References are deliberately not embedded in the page, so the tool does not
appear to derive its fictional questions from any of them.
