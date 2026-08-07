# Teaching notes — Culture-Fair Test Challenge

`modules/personality-individual-differences/tools/34-culture-fair-test-challenge/`

Six design decisions, six demands, and the discovery that removing the words
removes one of them.

---

## A note before you run this

This tool deliberately does **not** model groups of people. The four fictional
participants are described only by their prior experience of testing formats,
devices and puzzle conventions. None has a nationality, ethnicity, region,
language or group membership. The tool produces no score for anyone and
simulates no difference between any populations.

That is a considered decision, not squeamishness. The concept being taught is
*opportunity to learn a format*, and it applies to anyone who has not met a
particular way of being tested. Attaching it to real groups would convert a
point about instruments into an apparent claim about people, which is the exact
inferential error the tool exists to block.

If a student asks the obvious follow-up question — "but what about real group
differences in test scores?" — the honest answer is that observed group
differences in test scores are real, extensively documented, and *not*
interpretable without exactly the evidence the final challenge asks for. The
tool gives you the vocabulary to have that conversation properly rather than
simulating an answer to it.

## Running it from the front

The move worth making from the front: press Show the lowest-demand design and point at the construct-relevant share. It rises a long way and does not reach 100%, and every improvement was bought with administration time. Fairness here is a design cost, not a property a test either has or lacks.

## Intended level

Second- or third-year undergraduate on individual differences, psychometrics,
assessment or a critical-psychology strand. Assumes familiarity with the idea
of a reasoning test.

## Learning objectives

After the activity a student should be able to:

1. explain why removing language removes the reading demand and leaves the
   others;
2. distinguish construct-relevant from construct-irrelevant demands, and use
   that framing in place of "culture-free";
3. explain opportunity to learn a format as a fact about exposure, not
   capacity;
4. state what evidence is required before group scores can be compared;
5. recognise that reducing construct-irrelevant demand costs administration
   time and is a decision rather than a discovery.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the evidence challenge and full debrief:** 35–40 minutes.

## Preparation

None. Read the "How this handles groups" panel aloud before starting. It sets
the terms of the discussion and saves having to redirect it later.

## The prediction question

> A test designer removes every word from a reasoning test — no written
> instructions, no verbal items, nothing to read. **What has that achieved?**

"The test is now culture-free" is the common answer and the productive wrong
one. The feedback names the five demands that survive, and the designer then
shows them.

## Activity sequence

1. **Commit to an answer.** The designer stays locked until they do.
2. **Meet the deliberately poor default.** Written instructions, no practice,
   strict timing, mouse input, depth-cue stimuli, penalty scoring. Roughly half
   the score is something other than reasoning.
3. **Change one decision at a time.** Ask students to predict which change will
   move the construct-relevant share most before making it. Practice items with
   feedback usually surprises people.
4. **Press "Show the lowest-demand design".** The share rises a long way and
   stops short of 100%. Ask what the remaining demand is, and what it would
   cost to remove.
5. **The four participants.** Watch the spread between them narrow as the
   design improves. Note aloud that the figure is a count of hurdles, not a
   score.
6. **The evidence challenge.** Multi-select. This is the part that matters most
   for anyone going on to read the literature.

## Debrief questions

1. Which single design decision moved the construct-relevant share most? Why
   that one?
2. The best available design still leaves demands. What are they, and could any
   test remove them?
3. The improvements cost administration time. Who pays that cost in a real
   testing programme, and what usually happens as a result?
4. "Construct-irrelevant load" is not a score. What exactly is it a count of,
   and why does the distinction matter?
5. Two groups score differently on a well-designed non-verbal test. List three
   things that could produce that difference before anyone mentions ability.
6. What is the difference between a test *looking* neutral and a test
   *functioning* equivalently? Which one can a panel of reviewers establish?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Non-verbal means culture-free." | The whole tool. Reading is one of six demands. |
| "Abstract shapes are neutral." | Abstract-puzzle reasoning is a learned genre. The stimulus selector shows abstract figures carrying a *higher* puzzle-familiarity demand than everyday objects. |
| "If the test looks fair it is fair." | The expert-panel option in the evidence challenge. Reviewers have a poor record of predicting which items will actually function differently. |
| "Similar means prove comparability." | Also in the challenge. Means are what you want to interpret, not evidence that you may. |
| "So no test can ever be compared across groups." | Overcorrection. Comparability is establishable — it just has to be established rather than assumed, and the four "counts" options are how. |
| "This shows some groups are disadvantaged by tests." | Redirect carefully. The tool shows that *designs* place demands unevenly on people with different prior exposure to formats. Which real populations have which exposure is an empirical question the tool does not touch. |

## Limitations and cautions

- **No real groups are modelled anywhere.** See the note at the top.
- **No scores are produced.** Construct-irrelevant load counts demands, not
  performance.
- **These are not data.** Six decisions with illustrative demand values written
  for this page.
- **Six demands is a simplification.** Motivation, stereotype threat, rapport
  with the administrator, the consequences attached to the result, health,
  sleep and hunger all affect performance and none is modelled.
- **Good design is not invariance.** Reducing demand makes the problem smaller;
  only empirical checking tells you what remains.

## Accessibility considerations

- Native radios, checkboxes and buttons; no custom widgets, no dragging.
- Every design option carries its consequence as a line of text under the
  label, so the trade-off is legible without consulting the chart.
- The demand chart is hidden from assistive technology and paired with a table
  rating each demand "high", "moderate" or "low" in words.
- The construct-share bar prints its own labels and percentages *inside* each
  segment and repeats both in the note beneath, so the split never depends on
  the two fill colours.
- Participant cards state the load as text as well as drawing a meter.
- Changes are announced, including the note explaining what the choice does.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Cost the fairness.** Estimate the administration time of the
   lowest-demand design versus the default. Who would refuse to pay it, and
   what would they say?
2. **Design the study.** You suspect your task functions differently for people
   with different schooling backgrounds. Write the method section: what data
   would you collect, and what analysis would you run?
3. **The seventh demand.** Name a source of construct-irrelevant variance the
   tool does not model, and say how you would reduce it.
4. **Read a manual.** Find a published test's technical manual and locate what
   it says about invariance or DIF. Report how much space it gets relative to
   reliability.

## The model

Also documented at the top of `tool.js`.

Six demands are tracked: reading, testing conventions, puzzle familiarity,
speed expectations, device and motor demands, and test-taking strategy. Each
of the six design decisions sets levels on some of them; where two decisions
touch the same demand the **maximum** is taken rather than the sum, because a
requirement is a requirement however many features impose it.

```
construct-relevant share = 1 − mean(demand levels) × 0.8
```

For each fictional participant:

```
construct-irrelevant load = mean over demands of (demand level × their unfamiliarity)
```

which is a count of hurdles weighted by how unfamiliar each is — explicitly not
a score, and labelled as such everywhere it appears.

### The four participants

| | Described as | High unfamiliarity on |
| --- | --- | --- |
| A | Many timed multiple-choice tests; does puzzle books | nothing in particular |
| B | Assessed by oral and long-form written work; never sat a timed multiple-choice test | conventions, speed, strategy |
| C | Smartphone daily, rarely a desktop mouse; comfortable with paper tests | device |
| D | Returned to education after twenty years; no experience of abstract-shape problems | puzzle familiarity |

### Reference designs

| Design | Construct-relevant share |
| --- | --- |
| Default (written, no practice, strict, mouse, depth cues, penalty) | 37% |
| Lowest-demand (demonstrated, practice with feedback, untimed, paper, abstract, number correct) | 79% |

In the lowest-demand design the reading demand falls to 5% ("low") while
puzzle familiarity remains at 60% ("high") — which is the comparison to put on
screen when making the central point.

The second figure not reaching 100% is the point of the exercise.

## Citation and evidence notes

- **Messick (1989)** on construct-irrelevant variance and construct
  under-representation is the source of the framing used throughout.
- The current **Standards for Educational and Psychological Testing** (AERA,
  APA, NCME) set out the fairness and comparability requirements the evidence
  challenge is built from.
- **Meredith (1993)** and **Vandenberg and Lance (2000)** on measurement
  invariance; **Holland and Wainer (eds.), *Differential Item Functioning***
  on DIF.
- **Greenfield (1997)**, *You can't take it with you*, on why the assumptions
  behind ability testing do not travel automatically between contexts.
- **Cole (1996)**, *Cultural Psychology*, for the broader argument about
  cognition and context.
- On the limits of "culture-fair" specifically, the history of attempts to
  build such tests is itself the best evidence: each was proposed as neutral
  and each turned out to carry demands its designers had not noticed.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
