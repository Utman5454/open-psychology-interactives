# ANOVA F-Ratio Visualiser — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** Second year and above, or first year alongside a lecture that has
just introduced ANOVA
**Edition:** Simplified, and deliberately narrower than its parent. This is the
first experiment of **ANOVA F-Ratio Visualiser**. The second experiment on what
F cannot carry, the worked-example presets, the browse-then-commit
identification task and the select-all interpretation challenge are in the
longer version at
`modules/research-methods/tools/10-anova-f-ratio-visualiser/`.

## Learning objectives

By the end, a student should be able to:

1. describe F as one variance estimate divided by another, and say what each is
   built from;
2. explain why F wanders around 1 rather than 0 when nothing differs;
3. separate the three things that move F, only one of which is the effect;
4. explain why F is not a measure of how large a difference is, and what the
   share of variance adds;
5. state what a significant F does and does not license.

## Preparation

None. Randomness is seeded, so the default settings and seed 4021 give every
student the same figure and you can quote the same F on the board.

## Suggested use

**Projected, driven from the front.** Start at separation 0 and press *Draw a
fresh sample* five or six times. Ask the room to call out F each time. It never
settles at zero. That is the whole lesson about the null and it takes ninety
seconds.

**As preparation** before the lecture that derives the sums of squares, so the
algebra arrives as a description of something already seen.

**In a lab**, immediately before students run their first ANOVA on real data.

## Prediction question

Ask before touching anything:

> The three populations are identical. Not similar: identical. What will F be?

Most of a room says zero. Take that answer seriously, write it up, then run it.
The gap between the predicted 0 and the observed wandering around 1 is where
the ratio becomes intelligible: the numerator is not measuring the difference,
it is measuring how far three sample means drifted apart, and they always
drift.

## Activity sequence

1. **Separation 0.** Redraw several times. F wanders around 1. Establish why.
2. **Raise separation** to 8, then 16. F climbs. This is the effect.
3. **Return separation to 8 and raise the within spread.** F falls even though
   the populations are exactly as far apart as they were. The denominator is
   the yardstick and a longer yardstick makes the same gap read shorter.
4. **Return the spread and raise the sample size** from 30 to 120. F climbs
   again, and now watch the share of variance beside it, which barely moves.
   Nothing about the populations changed. This is the step students remember.
5. **Release the explanation** and read the caution.

## Debrief questions

- Two studies report F = 4.2. One has 15 people per group, the other 150. Are
  they reporting the same finding?
- The share of variance hardly moved when the sample size quadrupled and F
  doubled. Which of the two is answering the question *how big is this*?
- F is significant. Which groups differ?
- What would have to be true of the data for the p-value beside F to be
  trustworthy?

## Likely misconceptions

- **F = 0 under the null.** The most common and the most productive. The
  activity is built to fail this prediction on the first click.
- **A larger F means a larger difference.** True only at fixed n and fixed
  spread, which is exactly the condition students forget. The size control
  breaks this directly.
- **Between-groups variance measures the effect.** It measures the effect plus
  noise. Under the null it is all noise, which is why it still estimates the
  same quantity as the denominator.
- **A significant F identifies the difference.** It does not say which pair, in
  which direction, or by how much.
- **The p-value is a property of the populations.** It is computed from one
  sample and moves on every redraw. Redrawing at fixed settings makes this
  visible in a way that words do not.

## Limitations and cautions

Every figure comes from one generated sample and moves when redrawn; that is
the demonstration rather than a defect. The simulation draws from normal
populations with equal spreads and independent observations, which is precisely
what makes the reference distribution for F correct. Real data meet those
assumptions to varying degrees, and the activity does not model what happens
when they fail. The share of variance shown is the sample proportion, which is
positively biased as an estimate of the population value, most noticeably at
small n; the longer version takes that up. No number here is a norm.

## Accessibility considerations

Everything is reachable and operable from the keyboard, and each control
reports its value in text beside its label. The figure carries a description
giving the group means, the settings, F, its degrees of freedom, p and the
share of variance, so a student using a screen reader gets every quantity the
sighted reader gets. Group means are marked by a heavy tick, not by colour.
On a narrow screen the figure scrolls sideways rather than shrinking its labels
below legibility, and becomes a keyboard-reachable region when it does. Each
redraw is announced politely. There is no timed element and no motion.

## Optional extension

Set separation to 0 and n to 5, then redraw twenty times while a student tallies
how often p falls below 0.05. It should land near one in twenty. That is the
Type I error rate stopping being a definition and becoming a count, and it sets
up **Multiple Comparisons, FWER and p-Hacking** directly.

## Evidence and citation notes

The demonstration is the standard decomposition of variance behind the one-way
ANOVA; any methods text covers it. Fisher's original development is in *The
Design of Experiments* (1935). For the distinction between F and effect size,
and the bias of the sample share of variance, see Olejnik and Algina (2003),
*Generalized eta and omega squared statistics*, **Psychological Methods**,
8(4), 434–447.
