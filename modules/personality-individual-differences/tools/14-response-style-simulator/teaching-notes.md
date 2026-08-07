# Teaching notes — Response-Style Simulator

`modules/personality-individual-differences/tools/14-response-style-simulator/`

Seven people with the same true standing, seven different totals, and none of
the difference is the trait.

---

## Intended level

First- or second-year undergraduate meeting questionnaire measurement, or any
group about to collect self-report data. It pairs well with The Alpha Trap:
that tool is about what a scale's items do to each other, this one is about
what respondents do to the items.

## Learning objectives

After the activity a student should be able to:

1. recognise the main response styles from their evidence;
2. explain why balanced keying neutralises acquiescence and unbalanced keying
   disguises it;
3. explain why a total score reflects scale use as well as the trait;
4. state what a response pattern can and cannot establish;
5. frame a screening decision as a methodological choice rather than a
   judgement about people.

## Estimated duration

- **Demonstration from the front:** 8 minutes — the keying switch alone is
  worth the session.
- **Students in pairs:** 25 minutes.
- **With the identification challenge and debrief:** 35 minutes.

## Preparation

None. Read the "word about moralising" panel before you start; the framing
matters and it is easy to slip into treating these patterns as misbehaviour.

## The demonstration worth doing from the front

Show the summary table with the acquiescent and attentive rows visible, then
switch **balanced keying** off.

- With balanced keying the two totals sit close together (a gap of about 6
  points out of 100): agreeing with an item and with its opposite largely
  cancels in the recoded total.
- With unbalanced keying they separate sharply (a gap of about 15): agreeing
  with everything becomes hard to distinguish from a high standing on the
  trait.

The residual 6-point gap is worth pointing at rather than glossing. It exists
because the scale stops at 5: the acquiescent shift is truncated at the top and
so cannot be perfectly undone by recoding. Real balanced scales carry the same
residual for the same reason, which is why balanced keying is described as
mitigating acquiescence rather than removing it.

Nothing about either respondent changed. Only the questionnaire did. That is
the practical argument for balanced scales in one move, and students who have
been told to "include some reverse items" without being told why usually
remember this.

## Activity sequence

1. **Look at the raw grids.** Before any statistics. Ask which patterns are
   obvious and which are not.
2. **The distributions.** Extreme and midpoint responding are visible here in
   a way they are not in a total.
3. **The summary table.** Notice that split-half correlation catches random
   responding, and longest-run catches straight-lining, and neither catches
   acquiescence.
4. **The keying switch.** As above.
5. **Move the true standing slider.** All seven move together; the gaps between
   them do not close.
6. **The challenge.** Identify a mystery pattern, then answer the second
   question about motive.
7. **Draw a different respondent** two or three times.

## Debrief questions

1. Seven people, one true standing, seven totals. Which of those totals is the
   person's score?
2. Which styles did the summary statistics catch, and which slipped through?
3. Why is acquiescence invisible on an unbalanced scale but visible in the raw
   grid?
4. Reverse-worded items fix acquiescence. What do they cost? *(Harder to
   understand, often form their own method factor, and are answered
   inconsistently by people reading quickly — which is a different problem.)*
5. You find twelve straight-lined responses in a dataset of 300. What do you do,
   and what exactly do you write in the paper?
6. Is extreme responding an error? Under what description would it not be?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Straight-liners weren't paying attention." | Sometimes. And a genuinely consistent person answering a short unbalanced scale produces the same grid. The pattern is real; the inference is not. |
| "You should just remove the bad responses." | Define "bad" without reference to a motive you cannot observe. Then decide it before seeing the results, and report it. |
| "Reverse items solve the problem." | They solve acquiescence and introduce comprehension difficulty and a method factor. It is a trade, not a fix. |
| "Extreme responding means strong feelings." | It varies systematically between cultures and with education. Treating it as a personality signal has caused real measurement error in cross-cultural work. |
| "Impression management means lying." | It is modelled here as a shift towards the desirable end. Social desirability scales have a long history of being over-read as lie detectors; they are not. |
| "This is why self-report is useless." | Overcorrection. It is why self-report needs balanced keying, sensible screening rules and honest reporting — all of which are available. |

## Limitations and cautions

- **These are not data.** Seven fictional respondents from a generator. No real
  questionnaire, item or dataset appears.
- **The styles are caricatures.** Real respondents mix styles and drift through
  a questionnaire; mixed and drifting patterns are much harder to detect than
  these pure ones.
- **Detection is simplified** to five summary statistics. Real work uses
  long-string indices, person-fit statistics, response latencies,
  instructed-response items and multivariate outlier detection.
- **Impression management is not deception**, is not measured as deception, and
  should not be described as such.
- **No motive is ever established by the tool**, and any answer attributing one
  is marked as overreaching.

## Accessibility considerations

- Every answer is printed as its own digit inside its cell, so a grid is
  readable as text; the shading is a redundant cue that makes a twenty-item
  pattern visible at a glance.
- Reverse-keyed items carry a dotted underline and are described in the text
  above the grids — never distinguished by colour alone.
- The distribution chart is hidden from assistive technology and paired with a
  visible summary table.
- Native checkboxes, radios, range and number inputs; the standing slider
  announces "true standing on the trait 0.80, well above average".
- The seed is exposed so a class demonstration is exactly reproducible.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Write the screening rule.** Draft a pre-registered rule for excluding
   responses, and a sentence for the methods section. Then say what proportion
   of genuine respondents it would wrongly exclude.
2. **Design the balanced scale.** Take ten positively worded items and write
   the reverse-worded partners. Notice how many become awkward or ambiguous.
3. **The cross-cultural problem.** Two samples differ in extreme responding.
   What would you have to establish before comparing their means? *(This is
   the measurement-invariance question — see the Culture-Fair Test Challenge
   in this module.)*
4. **Find the limits of detection.** Set the true standing high and see which
   styles are still distinguishable from a genuinely high scorer.

## The model

Also documented at the top of `tool.js`.

```
raw   = 3 + trueStanding · keying(i) · 0.9 + noise
shown = style(raw)
```

`keying(i)` is +1 for positively keyed items and −1 for reverse keyed ones;
balanced scales alternate, unbalanced scales are all +1. Reverse items are
recoded before summing, which is exactly why acquiescence cancels on a
balanced scale.

| Style | Transformation |
| --- | --- |
| Attentive | unchanged |
| Acquiescence | pulled towards agreement regardless of keying |
| Extreme | pushed away from the midpoint by a factor of 2.4 |
| Midpoint | pulled towards 3 by a factor of 0.28 |
| Impression management | pulled towards the desirable end of each item |
| Random | independent of the trait entirely |
| Straight-lining | one value repeated, with occasional drift |

Randomness uses a seeded mulberry32 generator, so any configuration is exactly
reproducible from the seed shown in the controls.

## Citation and evidence notes

- **Paulhus (1991)** on measurement and control of response bias, including the
  two-component model of socially desirable responding.
- **Van Vaerenbergh and Thomas (2013)** for a review of response styles and
  their correlates.
- **Weijters, Geuens and Schillewaert (2010)** on the stability of response
  styles across time and instruments — they behave like traits.
- **Harzing (2006)** on cross-national differences in acquiescence and extreme
  responding, which is the strongest evidence against treating either as a
  simple error.
- **Meade and Craig (2012)** on identifying careless responses, and the
  detection indices this tool simplifies.
- **Curran (2016)** for a practical treatment of screening decisions and how to
  report them.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its patterns from any of them.
