# Teaching notes — Self-Esteem Stability Tracker

`modules/personality-individual-differences/tools/50-self-esteem-stability-tracker/`

Four fictional people, one shared baseline, and four completely different six
weeks.

---

## Before you run this

This is the most personally resonant tool in the module, and it is built to
stay firmly on the side of description.

- It **asks the user nothing about themselves**, offers no questionnaire and
  produces no score for anybody.
- Low or variable values are framed throughout as **characteristics that
  differ between people**, never as symptoms.
- Nothing on the page is diagnostic, a screening instrument, or a basis for
  interpreting anyone's wellbeing.
- The limitations panel ends with a line acknowledging that a page about
  self-worth may land personally, and points to student services.

Say the framing aloud at the start. Students will otherwise map themselves
onto one of the four within about ninety seconds, and the useful discussion is
about measurement rather than about them.

If a student does raise something personal, the appropriate response is the
ordinary one — acknowledge it, do not analyse it, and mention support routes
after the session rather than in front of the group.

## Running it from the front

Start with no events at all. Ari and Bea already look like different people, and nothing has happened to either of them — that is volatility on its own, with level held constant.

Then add the same criticism twice, once in work and once in friendship. Cal moves sharply for the first and barely at all for the second. That is contingency, and it is invisible until you vary the domain.

## Intended level

First- or second-year undergraduate. It pairs directly with the State versus
Trait Tracker in this module: that tool separates level from variability in
general, this one adds contingency and recovery, and applies them to a
construct where the distinction has real consequences.

## Learning objectives

After the activity a student should be able to:

1. separate typical level from day-to-day volatility;
2. explain domain contingency and why the same event moves people differently;
3. distinguish recovery speed from both level and reactivity;
4. explain why one administration cannot distinguish a low level from a point
   on a recovery trajectory;
5. describe variability as an individual difference rather than a symptom.

## Estimated duration

- **Demonstration from the front:** 10 minutes.
- **Students in pairs:** 25 minutes.
- **With the challenge and full debrief:** 35 minutes.

## The prediction question

> Four people complete a self-esteem measure once. All four score the same.
> **What does that tell you about their next six weeks?**

Two of the four options are correct — "very little" and "nothing that could be
checked without measuring them repeatedly" — and both are marked as such. The
third option ("the ones who fluctuate more have a problem") is the one to
watch for, and its feedback is a gentle correction rather than a wrong answer
buzzer, because it is the assumption the whole tool is designed to dislodge.

## The two demonstrations worth doing from the front

**One: volatility, with nothing happening.** Before adding any event, show Ari
and Bea alone. Same baseline, same average, and one line is nearly flat while
the other swings widely. Nothing has happened to either of them. That is
volatility as a characteristic.

**Two: contingency, by varying only the domain.** Add a criticism in *work or
study*, note how far Cal drops. Clear events, add the same criticism in
*friendship*. Cal barely moves. The event was identical; what differed was what
Cal's self-evaluation is staked on.

## Activity sequence

1. **Predict** from the single score.
2. **No events.** Level and volatility only.
3. **One event.** Watch all four react differently to the same thing.
4. **Vary the domain.** Contingency becomes visible.
5. **Look at Dee after an event.** She reacts moderately and is still below
   baseline a fortnight later. Ask what a one-off measurement taken then would
   conclude.
6. **The parameter table.** What actually differs between the four.
7. **The challenge.**

## Debrief questions

1. Ari and Bea have the same average. Is one of them better off?
2. Cal looks stable for weeks at a time. Under what circumstances would that
   description be wrong?
3. You measure Dee once, ten days after a rejection. What do you conclude, and
   what would you have concluded a month earlier?
4. Which of the four characteristics could a single questionnaire administration
   detect? *(Approximately one, and not reliably.)*
5. If someone's self-esteem is highly contingent on one domain, what follows
   practically? Is the answer "make it less contingent"?
6. What would you need to measure, and how often, to describe these four people
   properly?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Bea has low self-esteem." | She has exactly the same average as Ari. She has high variability, which is a different thing. |
| "Unstable self-esteem is unhealthy." | It is an individual difference. The literature associates instability with some outcomes, and that is a correlation between characteristics — not a verdict on a person, and not something to read off a graph. |
| "Cal is fine, he's stable." | Until something happens at work. Stability observed during a quiet period in the contingent domain tells you very little. |
| "Dee just has lower self-esteem." | She has the same baseline. She is further from it for longer. Measuring once cannot tell those apart, which is the point. |
| "You could fix this by measuring more carefully." | More careful measurement of *one occasion* does not help at all. What is needed is more occasions. |
| "So which one am I?" | None — they are four parameter sets. Redirect to the measurement question; this is the moment the framing at the top earns its place. |

## Limitations and cautions

- **Nothing here is diagnostic.** No pattern is a symptom, disorder or risk
  indicator.
- **Nobody is measured.** The tool asks the user nothing and scores no one.
- **Variability is not pathology.**
- **These are not data.** A generator, four parameter sets and a decay rate.
- **The model is simple.** Real self-evaluation is domain specific, socially
  embedded, partly reconstructed at recall, and shaped by what a person does in
  response to an event. None of that is modelled.

## Accessibility considerations

- Events are added through **selects and a button**, never by clicking on the
  chart, so there is no pointer-only interaction and nothing to drag.
- The four series are distinguished three ways — colour, dash pattern and a
  name printed at the end of each line.
- The chart is hidden from assistive technology and paired with a visible table
  giving average, day-to-day SD, range and days to return to baseline.
- Delivered events are listed in text as well as marked on the plot, so the
  event history is never only a set of vertical lines.
- Changes are announced through the shell's live region.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Design the study.** You want to establish that two people differ in
   stability rather than in level. What do you measure, how often, and for how
   long?
2. **The reporting problem.** Write the sentence a paper would use to describe
   Bea if it had measured her once, and then the sentence it should have used.
3. **Contingency in practice.** If self-esteem contingent on one domain
   produces sharp reactions in it, what are the options — and what does each
   cost? Is reducing contingency always desirable?
4. **Recovery as an outcome.** Argue for recovery speed as the most useful of
   the four characteristics to measure, then argue against it.

## The model

Also documented at the top of `tool.js`.

```
state(t) = baseline + carry(t) + wobble(t)
carry(t+1) = carry(t) × recovery
```

An event adds `size × contingency[domain]` to the carry on its day. `wobble` is
normal with a person-specific SD. All four people share a baseline of 58 on an
arbitrary 0–100 scale.

| Person | Volatility | Recovery rate | Work | Friendship | Appearance |
| --- | --- | --- | --- | --- | --- |
| Ari | 2.5 | 0.72 | 0.35 | 0.35 | 0.30 |
| Bea | 9.0 | 0.70 | 0.50 | 0.50 | 0.45 |
| Cal | 3.5 | 0.68 | **1.50** | 0.20 | 0.15 |
| Dee | 3.5 | **0.94** | 0.60 | 0.60 | 0.55 |

Ari and Bea differ **only** in volatility. Cal differs mainly in contingency.
Dee differs mainly in recovery. The design is deliberately one-variable-at-a-time
so that each characteristic can be isolated in class.

Event sizes: praise +12, criticism −13, success +16, rejection −17. A "neutral
week" adds nothing and exists so students can look at the series with no events
at all.

## Citation and evidence notes

- **Kernis (2005)** on stability of self-esteem as a construct distinct from
  level, and the argument that the two predict different things.
- **Crocker and Wolfe (2001)** on contingencies of self-worth — the source of
  the domain-contingency idea modelled here.
- **Rosenberg (1965)** for the standard single-administration measure, which is
  what the opening question is about.
- **Kuppens, Oravecz and Tuerlinckx (2010)** on emotional variability and
  inertia, for the recovery-rate dimension.
- **Fleeson (2001)** on density distributions, for the general argument that a
  trait is a distribution rather than a setting.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
