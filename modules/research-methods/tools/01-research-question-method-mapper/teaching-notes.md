# Teaching notes — Research Question to Method Mapper

`modules/research-methods/tools/01-research-question-method-mapper/`

The tool never names a statistical test. That is the point of it.

---

## Running it from the front

Question 4 is the one to spend time on. It can be read as a question about explanation or a question about interpretation, and both readings are defensible; which one you take depends on what you think an answer would look like, not on the wording. Ask the room to argue for each before checking.

Question 3 catches almost everyone on part 4: a prevalence figure depends on how the sample was recruited and where the threshold sits, and neither is stated, so no sample size makes the estimate mean anything on its own.

## Intended level

First- or second-year undergraduate research methods, and useful again with
final-year project students who have collected data before deciding what claim
they wanted to make. It assumes no statistics at all.

## Learning objectives

After the activity a student should be able to:

1. identify what kind of claim a research question is trying to support;
2. distinguish description, difference, association, prediction, explanation
   and interpretation as aims;
3. explain why the same kind of number can require different treatment
   depending on the design that produced it;
4. name what a method choice still depends on — sampling, allocation, level of
   measurement, epistemological position;
5. recognise a question that cannot yet be answered, and say what would settle
   it.

## Estimated duration

- **Demonstration from the front:** 8 minutes — questions 3 and 4 alone carry
  most of the argument.
- **Students in pairs:** 20 minutes for all four.
- **With the challenge and debrief:** 35 minutes.

## Preparation

None. If you want a single slide beforehand, put the six aims on it:
description, difference, association, prediction, explanation, interpretation.
The four questions in the tool instantiate four of them; the other two are
worth naming so that students have the full contrast set in view.

## The demonstration worth doing from the front

Question 3, the loneliness prevalence survey. Ask the room what would settle
the figure. Almost everyone reaches for the sample size.

Then read the vignette again and ask the two questions the tool marks as
decisive: how were people recruited, and where does the threshold for "lonely"
sit? Two researchers using the same questionnaire can report 18% and 41%
without either making an error, and neither number is improved by collecting
more of the same responses. A description is only as good as the frame it is
estimated over.

Then question 4, which the tool refuses to settle. Take a vote on explanation
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
4. **Question 3 — prevalence.** Two decisive missing items: how the sample was
   recruited, and where the threshold for "lonely" sits. See above.
5. **Question 4 — group work.** Deliberately ambiguous. Both readings are
   marked well supported and the tool says why it will not choose.
6. **The challenge**, which returns to group work with data already in hand.

## Debrief questions

1. Question 2 compares two groups and question 3 estimates one figure. Why can
   only one of them support a sentence with the word "reduce" in it?
2. Question 3 asks how common loneliness is. Two researchers using the same
   questionnaire report 18% and 41%. Give two ways that could happen without
   either of them making a mistake.
3. In question 1, what would change about the analysis if the researcher took a
   discursive rather than an experiential position?
4. Question 4 has no settled answer. Is that a defect in the question, or a
   stage of the research not yet completed?
5. The tool never names a test. What would you need to add to each of the four
   before naming one would be sensible?
6. Two of the six aims — association and prediction — appear as options but as
   no question's well-supported reading. Write a research question for each,
   and say what the tool would have to ask you next.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "You look at the data and pick the test." | Question 2 against question 3. Both produce numbers about anxiety or loneliness; only one was produced by a design that supports a comparison. |
| "Qualitative means you did not have enough participants for statistics." | Question 1 and question 4's interpretative reading. Neither would be improved by a larger n; they ask something a number cannot answer. |
| "Mixed methods means doing both." | The tool refuses that in three separate places. A design earns the name when each strand answers a stated part of one question and the two are integrated. |
| "Random allocation makes a study good." | It makes one particular claim payable. It does nothing for question 2's volunteer sample. |
| "A big n fixes sampling problems." | Question 3. A mailing-list survey with 4,000 responses estimates the same biased quantity more precisely. |
| "Why-questions are qualitative." | Question 4. "Why" belongs to no tradition; the wording does not settle it. |

## Limitations and cautions

- **These are not the only defensible readings.** The tool records a small
  number per question. A supervisor could argue for others, and question 4
  exists to make that explicit.
- **No real studies.** All four are invented, including the settings and sample
  sizes.
- **Four questions, six aims.** The tool was cut from six questions to four so
  that it fits a seminar slot. Association and prediction now appear only as
  options and as feedback, never as a question's well-supported reading; if you
  need students to work through those two aims, the last debrief question and
  the third extension task are where to do it.
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

1. **Rewrite question 4 twice** so that the first version can only be read as a
   question about explanation and the second only as a question about
   interpretation. Compare what each version gives up.
2. **Break question 2.** Change one word so that the design described can no
   longer support the claim.
3. **The two missing aims.** Write one research question that is clearly about
   association and one that is clearly about prediction, run each through the
   four decisions, and say what you would still need to know. Shmueli (2010) is
   the reading for the second.
4. **Prevalence detective.** Find two published prevalence figures for the same
   construct that differ by more than a factor of two, and account for the
   difference using only what question 3 raises.

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

### The four questions and their well-supported readings

| # | Question | Aim | Kind | Design | Decisive missing item(s) |
| --- | --- | --- | --- | --- | --- |
| 1 | Belonging | Interpretation | Qualitative | Interview | Epistemological position |
| 2 | Mindfulness recording | Difference | Quantitative | Between-groups | Level of measurement |
| 3 | Loneliness prevalence | Description | Quantitative | Survey | Sampling; level of measurement |
| 4 | Group-work disengagement | Explanation *and* interpretation | All three defensible | Interview, survey or records | Epistemological position; allocation |

"Show a worked reading" fills in the first well-supported option for parts 1–3
and every `key` item for part 4, then checks it.

## Citation and evidence notes

- **Braun and Clarke (2013, 2022)** for the argument that qualitative method
  follows from the research question and the researcher's theoretical position
  rather than from the data type. Relevant to questions 1 and 4.
- **Shmueli (2010), "To explain or to predict?"** is the cleanest statement of
  the explanation / prediction distinction. No question now turns on it, so it
  is the reading for the third extension task rather than for the tool itself.
- **Meehl (1990)** remains the sharpest account of what goes wrong when a
  procedure is chosen before a claim is specified.

References are deliberately not embedded in the page, so the tool does not
appear to derive its fictional questions from any of them.
