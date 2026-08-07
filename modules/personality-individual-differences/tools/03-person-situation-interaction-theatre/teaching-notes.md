# Teaching notes — Person–Situation Interaction Theatre

`modules/personality-individual-differences/tools/03-person-situation-interaction-theatre/`

Four fictional characters, five situations, and two rankings — the second of
which reorders them.

---

## Intended level

First- or second-year undergraduate meeting the person–situation debate for the
first time, or final-year students who have been taught "Mischel showed
personality doesn't predict behaviour" and need the rest of the sentence.

## Learning objectives

After the activity a student should be able to:

1. explain what makes a situation strong or weak, and what a strong situation
   does to observed between-person variation;
2. distinguish situational **constraint** from situational **affordance**, and
   explain why two equally weak situations can rank the same people
   differently;
3. explain why low observed behavioural variance is not evidence of low trait
   variance;
4. say why neither "personality matters more" nor "situations matter more" is
   a defensible summary;
5. relate behavioural consistency to aggregation across situations and
   occasions.

## Estimated duration

- **Demonstration from the front:** 10 minutes (both rankings, then the
  strength slider).
- **Students working in pairs:** 25 minutes.
- **With the matrix, challenge and full debrief:** 35 minutes.

## Preparation

None. Read the cast aloud once if you are running it from the front — the two
rankings only work if students have a feel for the four people.

## The prediction questions

There are two, and the second is the one that matters.

> **Round 1.** At a party where they know few people, rank these four for how
> much they approach people and start conversations.

Nearly everyone gets this roughly right. The party affords extraversion, it
prescribes almost nothing, and the ranking follows the trait. Students conclude
that traits show through.

> **Round 2.** Same four people, anonymous online discussion. Rank them for how
> outspoken and blunt they are.

Most rooms reproduce their Round 1 ranking, because both situations are weak.
The ranking changes anyway: anonymity carries a *negative* weight on
politeness, so the most polite character drops and the least polite rises.
Nobody's personality changed. What changed is which part of it the situation
let out.

That contrast — two weak situations, different orderings — is the single most
useful thing in the tool. Do not skip Round 2 for time.

## Activity sequence

1. **Read the cast.** Four people, four trait scores each.
2. **Round 1 — the party.** Rank, reveal, discuss why it was easy.
3. **Round 2 — anonymous discussion.** Rank, reveal, discuss why it was not.
4. **The controls unlock.** Situation, strength slider, assigned role.
5. **The affordance diagram.** Which traits this situation lets show, and how
   thin those paths get as strength rises.
6. **The matrix.** All five situations at once, with the mean rank correlation
   between them.
7. **Challenge.** Get the between-person spread below 2 points, then answer
   what can no longer be measured.

## Debrief questions

1. Between the party and the anonymous discussion, what changed — the people
   or the situations? What does that do to the phrase "true personality"?
2. You push the strength slider to 1 and everyone behaves identically. Have
   the traits gone away? Where are they?
3. A study finds personality explains 4% of the variance in behaviour. What
   would you want to know about the situations it sampled before believing that
   is a fact about personality?
4. The mean rank correlation across situations is around 0.3–0.5 at default
   settings. Is that "consistent" or "inconsistent"? *(Both, and the argument
   about which word to use is most of what the debate was.)*
5. Why does a trait score predict a single act badly and a thousand acts well?
6. Situation strength here is a dial the author set. How would you measure it
   in real research without using the very behaviour you are trying to explain?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "So personality isn't real." | Push the strength slider back down and ask them to say that again. Traits reappear the moment the situation permits them. |
| "So situations don't matter, the person shows through anyway." | Round 2. Same person, different situation, different order. |
| "Strong situations change people." | They change behaviour, not traits. The cast list does not move. Point at it while sliding. |
| "Weak situations are more valid." | Neither is more valid. They afford different things. A job interview is a real situation with real consequences; it just tells you less about who the person is. |
| "The anonymous condition reveals their true selves." | Tempting and wrong. It reveals what they do when the cost of bluntness is removed — another situation, not an unmasking. |
| "Rank correlation of 0.4 means personality is 40% right." | It is a rank correlation between two situations, not a proportion of anything. |

## Limitations and cautions

- **These are not data.** Four invented people, five invented situations, and
  behaviour computed from a formula. No effect size here comes from any study.
- **Situation strength is stipulated, not estimated.** In real research it is
  usually inferred from the behaviour it is then used to explain. That
  circularity is worth naming in class rather than concealing.
- **No occasion-to-occasion variability.** The same person in the same
  situation always does the same thing here. The State versus Trait Tracker in
  this module is where that enters.
- **No trait interactions.** The person term is a weighted sum, so no trait
  moderates another.
- **Affordance weights are chosen for legibility**, not measured. Which traits
  a situation affords is a genuine empirical question.
- **Nobody is assessed.** Students rank fictional characters and answer nothing
  about themselves.

## Accessibility considerations

- Ranking is done with one native `select` per character. There is no
  drag-and-drop, so WCAG 2.5.7 (Dragging Movements) is satisfied by
  construction rather than by providing an alternative.
- Duplicate ranks produce a written, announced error naming the problem, not a
  silent refusal.
- The behaviour chart and the affordance diagram are hidden from assistive
  technology and paired with visible tables carrying the same numbers.
- Edge weights in the diagram are printed as text beside each edge and repeated
  in its table; a negative weight is dashed *and* signed, so the distinction
  never rests on colour.
- The strength slider announces "weak situation, 0.20" rather than "20".
- Reset is reachable from Round 1 onwards, not only once the explorer appears.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Design a situation.** Invent a sixth situation: give it a strength, a norm
   and a set of affordance weights, and predict which character comes top.
   Students discover that "designing a situation" is mostly deciding what it
   rewards.
2. **The selection problem.** If an employer interviews candidates (a strong
   situation) to predict performance on a six-week project (a weak one), what
   has gone wrong? What would fix it?
3. **Find the ceiling.** What is the highest mean rank correlation you can
   reach across all five situations, and what did you have to do to get it?
4. **Rewrite the claim.** Take "personality explains only a small proportion of
   the variance in behaviour" and rewrite it so that it is both true and not
   misleading.

## The simulation model

Also documented at the top of `tool.js`.

```
behaviour = k · norm + (1 − k) · disposition + role
disposition = 50 + 1.35 · Σ wₜ (traitₜ − 50)
```

`k` is situation strength (0–1); `norm` is what the situation prescribes; `wₜ`
are the affordance weights, which are zero for traits the situation does not
afford and may be **negative** where the situation rewards the low end. An
assigned role adds an offset *and* increases `k`, because a prescribed role is
itself a constraint.

Rank correlations are Spearman's rho on four people, so
`rho = 1 − (Σd²)/10`.

### The cast

| Character | Extraversion | Conscientiousness | Politeness | Emotional stability |
| --- | --- | --- | --- | --- |
| Mara | 84 | 58 | 28 | 70 |
| Jonah | 30 | 88 | 62 | 66 |
| Elif | 62 | 60 | 86 | 58 |
| Theo | 66 | 44 | 60 | 26 |

### The situations

| Situation | Affords | Norm | Strength |
| --- | --- | --- | --- |
| Party | Extraversion +0.80, Politeness +0.20 | 55 | 0.20 |
| Job interview | Extraversion +0.45, Stability +0.35, Conscientiousness +0.20 | 72 | 0.72 |
| Collaborative project | Conscientiousness +0.50, Extraversion +0.30, Politeness +0.20 | 50 | 0.28 |
| Emergency | Stability +0.50, Extraversion +0.30, Conscientiousness +0.20 | 62 | 0.78 |
| Anonymous discussion | Politeness **−0.45**, Extraversion +0.35, Stability +0.20 | 50 | 0.15 |

The negative politeness weight in the last row is what makes Round 2 work.

## Citation and evidence notes

- **Mischel (1968)** is the book everyone cites and few read. The claim was
  about the predictive limits of trait measures for single behaviours, not that
  personality is a fiction.
- **Epstein (1979)** on aggregation is the other half of the argument: the same
  traits predict well once behaviour is averaged over occasions.
- **Kenrick and Funder (1988)**, *Profiting from controversy*, is the best
  single summary of what the debate settled.
- **Mischel and Shoda (1995)** on if–then behavioural signatures is where
  "inconsistency" turns out to be stable, patterned and person-specific.
- **Cooper and Withey (2009)** review situational strength, including the
  measurement circularity noted above.
- **Reis (2008)** and work on situational affordances/taxonomies (for example
  the DIAMONDS framework) cover the affordance side.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its numbers from any of them.
