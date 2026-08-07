# Teaching notes — Attitude-Behaviour Gap Laboratory

`modules/social-critical-psychology/tools/03-attitude-behaviour-gap/`

Four people, one score, four working lives. Marek is the case that does the
teaching.

---

## Running it from the front

Marek is the one to stop on. His attitude, his confidence and his habit are all as strong as Rowan's; his estimated behaviour is low because the occasion rarely arises. Opportunity in this model multiplies rather than adds, which is the difference between a condition that helps and a condition that gates. Ask the room what a training course aimed at Marek's attitude would achieve.

In experiment 3, switch the setting from uniform to real teams and read the correlation aloud. Nothing about anybody's attitude has changed. The correlation fell because the outcome now depends on things the questionnaire never asked about - which is most of what people mean when they say attitudes predict behaviour poorly.

## Intended level

First- or second-year undergraduate on a social psychology strand. It needs no
statistics beyond an intuitive reading of a correlation, and it is a good session
to run immediately after attitudes and before conformity, because it introduces
the move — from a property of a person to a property of a situation — that the
rest of the module keeps making.

## Learning objectives

After the activity a student should be able to:

1. distinguish a measured evaluation from an action and name what stands between
   them;
2. explain why norms, confidence and habit add to the odds while opportunity
   gates them;
3. say how measurement correspondence changes an association without changing the
   person;
4. explain why the same correlation is larger under uniform conditions than in
   real teams;
5. say what an individual-level model represents well, and what representing
   constraints as *perceived* control makes harder to see.

## Estimated duration

- **Demonstration from the front:** 8 minutes — experiment 1, then Marek.
- **Students in pairs, all three experiments:** 30 minutes.
- **With the challenge and the debrief:** 45 minutes.

## Preparation

None. Read Aisha's score aloud and ask the room, before opening the tool, how
often she speaks up. Someone will give a number. Write it on the board.

## The demonstration worth doing from the front

Run **experiment 1** properly: get the room to commit to a band for each of the
four colleagues before pressing the reveal. The model gives:

| Colleague | Estimated behaviour | Band |
| --- | --- | --- |
| Rowan | 82% of occasions | usually |
| Priya | 48% | sometimes |
| Devi | 28% | sometimes |
| Marek | 14% | rarely |

Almost everyone puts Marek high, because his description contains every internal
condition that Rowan's does. Then open **experiment 2**, load Marek, and push
attitude, norm, control and habit to 100 while leaving opportunity where it is.
The estimate barely moves. Say: *opportunity multiplies; the others add.* Then
ask what an attitude-change workshop aimed at Marek would achieve.

The second demonstration is **experiment 3**. Switch the setting from uniform
conditions to real teams and read the correlation aloud:

| Measure | Uniform conditions | Real teams |
| --- | --- | --- |
| General values questionnaire | 0.69 | 0.20 |
| Behaviour-level attitude scale | 0.84 | 0.35 |
| Matched specific intention | 0.87 | 0.41 |

Down a column, the measure changed and the people did not. Across a row, the
setting changed and the people and the measure did not. Every cell uses the same
300 simulated colleagues and the same attitude draws.

## Prediction question

*Aisha scores 6.2 out of 7. On what proportion of occasions where she disagrees
will she say so?*

The intended answer is the fourth: the score does not license any of the three
frequencies. The first three options are all reasonable-sounding, and the
feedback for each names the specific step it skips.

## Activity sequence

1. **Commit to the opening judgement.** It gates the laboratory.
2. **Experiment 1.** Predict all four, then reveal. The tool will not advance
   until both are done.
3. **Experiment 2.** Load Marek. Move one slider at a time. Then load Devi and
   ask which single change would raise her most.
4. **The measure control.** Same person, three questionnaires, three estimates.
5. **Experiment 3.** Setting first, then measure.
6. **The four claims.** Two are marked against the settings currently in force.

## Debrief questions

1. Rowan and Marek have the same attitude, the same confidence and almost the
   same habit. Why do they behave so differently?
2. What would you have to change in Devi's team to raise her rate? Name three
   things, and say which of them are inside her.
3. The model's largest single coefficient is attitude. Does that make attitude
   the most important thing here?
4. Why does a general values questionnaire predict this act worse than a matched
   intention does, even if both are perfectly reliable?
5. An experiment reports r = 0.84 between attitude and behaviour. What have you
   learned about attitudes, and what have you learned about the experiment?
6. The model represents the chair's behaviour as Devi's "perceived control" and
   "situational constraint". What is gained and what is lost by putting them
   inside her head?
7. Whose interests are served by an account in which the problem is Devi's
   confidence?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The questionnaire must be badly made." | Claim 4. Reliability is agreement with itself; correspondence is about target, context and time. A perfect values scale still predicts Thursday poorly, and that is not a defect. |
| "Marek clearly doesn't really believe it." | Claim 2. Inferring the absence of a disposition from the absence of a behaviour requires that the occasion arose. |
| "Attitudes don't predict behaviour." | Experiment 3, uniform column. Under some conditions they predict very well indeed. The claim has to be indexed to a setting. |
| "So we should measure intentions instead." | Look down the specific row: it helps, and 0.41 still leaves most of the variance elsewhere. Better measurement cannot recover variance that lives in the rota. |
| "Situational constraint is just another variable." | It is, in this model — and that is the model's most important simplification. It represents a chair's behaviour as a number inside an individual. |
| "Speaking up is the good outcome." | The limitations panel. The model estimates a frequency, not a virtue, and the costs of speaking up fall unevenly. |

## Limitations and cautions

- **The coefficients are invented.** They are printed on screen and above, so
  nothing is hidden, and they are chosen to make a pattern visible. They are not
  estimates and the correlations that follow are not findings.
- **A simulation cannot test a theory.** This illustrates the logic of
  reasoned-action models and one standard criticism of them. It is not evidence
  for or against the theory of planned behaviour.
- **Six conditions is a simplification.** Mood, fatigue, what happened last time,
  who is in the room and what is at stake are all absent.
- **It does not show attitudes are unimportant.** Attitude carries the largest
  coefficient in the model.
- **No real workplace or person is described**, and the questionnaire is never
  administered to the person using the tool.
- **The moral question is not modelled.** Whether voicing disagreement is wise in
  a given meeting is outside the model entirely, and the costs of doing so are
  distributed very unevenly across a workforce — which is itself worth a
  discussion.

## Accessibility considerations

- Native radios, ranges and selects. No dragging, no timing, no hover-only
  content.
- Each experiment exposes only its own controls and its own result. The pinned
  primary is 125px in experiment 2 and 301px in experiment 3, so it stays visible
  while the six sliders are scrolled.
- The contribution chart prints each term's signed value beside its bar and is
  paired with a visible table of settings and contributions.
- The scatterplot is paired with a sentence stating the correlation, the number
  of people above 0.7 and below 0.4 on the measure, and each group's mean
  behaviour — so the shape of the cloud is available without seeing it.
- Every slider carries an `aria-valuetext` naming the percentage and both ends of
  its range in words.
- Focus moves to the new experiment heading when a navigation button is pressed.
- Reduced-motion and forced-colours rules are provided. No horizontal page scroll
  at 320px, 375px, 1366px, 1440px or 1920px.

## Optional extension tasks

1. **Design Devi's intervention.** Using only the six conditions, find the
   cheapest change that raises her rate above 50%. Then say who would have to do
   it.
2. **Write the abstract.** Write the abstract of a study that reports r = 0.84
   and one that reports r = 0.35, using the same data-generating model. What is
   the smallest honest sentence that both could contain?
3. **Add a seventh condition.** What is missing from the six? Where would it go,
   and would it add or gate?
4. **The critical version.** Rewrite the debrief of this tool from the position
   that representing a chair's behaviour as Devi's "perceived control" is the
   central problem rather than a simplification.

## The model

Documented at the top of `tool.js`.

```
logit = -1.30 + 2.60*c*attitude + 1.30*norm + 1.50*control + 1.40*habit
        - 1.80*constraint
p     = logistic(logit) * opportunity
```

All conditions run 0 to 1. The correspondence weight `c` is 0.35 for a general
values questionnaire, 0.70 for a behaviour-level attitude scale and 1.00 for a
matched specific intention.

### The four colleagues

| | Attitude | Norm | Control | Habit | Constraint | Opportunity | Estimate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rowan | .86 | .85 | .85 | .80 | .15 | .85 | 82% |
| Devi | .86 | .15 | .20 | .10 | .80 | .75 | 28% |
| Marek | .86 | .60 | .85 | .70 | .25 | .15 | 14% |
| Priya | .86 | .50 | .55 | .40 | .50 | .60 | 48% |

### Experiment 3

300 simulated colleagues from `mulberry32(20260419)`. Attitude is drawn once,
uniformly on 0.15–0.90, and reused in every cell. Under **uniform conditions**
everyone gets norm .50, control .55, habit .40, constraint .40 and opportunity
.75. Under **real teams** the conditions are drawn on 0.20–0.80 (norm, control),
0.15–0.75 (habit, constraint) and 0.45–1.00 (opportunity). Observed behaviour is
the model probability plus a fixed noise draw of at most ±0.06, clipped to the
unit interval. The resulting correlations are the six values in the table above.

The **worked example** loads the four predictions most cohorts make (Marek
"usually"), reveals experiment 1 at 3 of 4 correct, and drops Marek into
experiment 2 at 14% with the real-teams setting selected in experiment 3.

## Citation and evidence notes

- **LaPiere (1934)** for the original demonstration, and for the methodological
  criticisms that make it a poor piece of evidence and a very good teaching case.
- **Wicker (1969)** for the review that made the gap a problem the field had to
  answer.
- **Ajzen and Fishbein (1977)** for the compatibility principle, which is what
  the measure control in experiment 2 implements.
- **Ajzen (1991)** for the theory of planned behaviour, whose structure the model
  here borrows and simplifies.
- **Sheeran (2002)** on the intention-behaviour gap, and **Webb and Sheeran
  (2006)** for the experimental evidence that changing intentions changes
  behaviour by much less than the correlations imply.
- **Ouellette and Wood (1998)** and **Verplanken and Orbell (2003)** for habit as
  a term that is not reducible to intention.
- **Ross and Nisbett (1991), *The Person and the Situation*** for the general
  argument, and for the point that "situational" and "weak" are not synonyms.
- **Bourdieu (1977)** or **Billig (1996)**, if you want a reading that refuses
  the individual-level framing altogether rather than adding terms to it.

Full references are deliberately not embedded in the page, so the invented
coefficients are not mistaken for estimates derived from any of them.
