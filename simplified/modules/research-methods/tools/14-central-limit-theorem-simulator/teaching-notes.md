# Central Limit Theorem Simulator — Simplified Edition

**Module:** Research Methods
**Duration:** 5–7 minutes
**Level:** First or second year, once means and standard deviations are secure
**Edition:** Simplified. The longer version adds four populations, excess
kurtosis alongside skewness, a three-part prediction and a challenge on what
the theorem claims. It is at
`modules/research-methods/tools/14-central-limit-theorem-simulator/`.

## Learning objectives

By the end, a student should be able to:

1. tell a population, one sample, and the distribution of a statistic apart;
2. say what the theorem is about, and what it does not claim about data;
3. predict how the standard error moves with sample size and check it;
4. explain why "thirty is enough" depends on the population;
5. recognise that rescaling a picture changes the picture, not the spread.

## Preparation

None. It runs in a browser with no account, no network and no setup.

If you are projecting it, note the seed you use. The same seed and settings
reproduce the same run exactly, so the figure you show in the lecture is the
figure students can get back at home.

## Suggested use

**Projected, in about three minutes.** Draw one sample and point at the ticks.
Draw fifty and let the lower panel fill. Then ask the room what has happened
to the upper panel, and wait. The answer is nothing, and most groups have to
be asked twice before they say it.

**As preparation** before any session that uses a standard error. Ask students
to arrive able to say what the lower panel is a distribution *of*.

**Alongside the zoom control**, as a deliberate trap. Draw fifty at a sample
size of five, then fifty at a hundred, and let students describe what happened
to the spread. Then turn the zoom on and ask again.

## Prediction question

Before students open it, ask:

> You draw a thousand samples of thirty from a population with a long right
> tail and plot the thousand means. What shape is that plot? And what shape is
> the population now?

The second half is the one that catches people.

## Activity sequence

1. The skewed population is on screen from the start, with nothing drawn.
2. **Draw one sample.** Twenty-five ticks appear under the population, and one
   mean lands in the lower panel.
3. **Draw fifty.** The lower panel becomes a distribution.
4. Move the **sample size**. The pile clears, because means from samples of a
   different size are not comparable. Draw again and watch the standard error
   in the table follow sigma over the square root of n.
5. **Zoom** the lower panel and watch the picture widen while the number does
   not.
6. Switch to the **bimodal** population and see a different starting shape
   converge at a different rate.

## Debrief questions

- What is the lower panel a distribution of? Say it in a full sentence.
- The upper panel has not changed once. Why can it not?
- At a sample size of five the means were wide; at a hundred they were narrow.
  Did the data become less variable?
- The zoom made the means look four times as wide. What actually changed?
- The skewed population still has a predicted skewness of 0.37 in the mean at
  thirty. What does that do to "thirty is enough"?

## The moment worth stopping on

The zoom control, used immediately after a large sample size. Students who
have just watched the means narrow on the shared axis will describe the
zoomed picture as "wider again", and the standard error in the table has not
moved by a thousandth. It is the cleanest demonstration in the activity that a
picture is a choice about presentation, and it is one click.

## Likely misconceptions

**"With a big enough sample the data become normal."** The upper panel is the
standing refutation. Data do not become anything; a statistic computed from
them has a distribution.

**"The central limit theorem says n = 30."** It says nothing of the kind. Set
the skewed population to thirty and read the predicted skewness.

**"A bigger sample means less variable data."** It means a less variable
*mean*. Point at the ticks, which are just as spread out at any n.

**"The histogram is the sample."** It is one bar per sample, and each bar
counts means. With fifty samples of a hundred there are five thousand
observations behind fifty marks.

**"The predicted column is an estimate."** Both populations are mathematical
distributions with exactly known moments. The prediction is arithmetic.

## Limitations and cautions

- Both populations are inventions chosen to make a point. Real data are
  messier and rarely have exactly known moments.
- The simulation shows the distribution of the mean under repeated sampling
  from a known population. That is not the situation a researcher is in, who
  has one sample and no access to the population.
- Nothing here addresses what happens when observations are not independent,
  which is the assumption that fails most often in practice.
- The skewness measured from a few dozen means is itself a noisy estimate.
  Draw more samples before reading much into it.

## Accessibility

Keyboard operable throughout. The three objects in the figure differ by mark
as well as by colour: the population is a filled curve, one sample is a row of
ticks, the means are a histogram, and each is named in text inside the figure.
The description is rewritten on every change and states the population, the
sample size, how many means exist and their centre and spread against the
prediction. Every plotted quantity also appears in the table. The axis states
in words whether the panels share a scale. There is no timed content and no
motion.

## Extension

Ask how large a sample would have to be for the skewed population's mean to be
as symmetric as the bimodal population's mean at ten. The predicted skewness
formula gives the answer directly, and it is larger than most students expect.

## Evidence and reading

Any mathematical statistics text covers the theorem and its conditions. The
useful thing to send students to next is the finite-sample literature on when
the approximation is poor, which is where the rules of thumb come from and
where their limits are stated.
