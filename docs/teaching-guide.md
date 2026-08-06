# Teaching guide

How to use Open Psychology Interactives in university teaching.

> **Current status.** The site scaffold exists; no tools have been published
> yet. This guide sets out how the tools are intended to be used and what each
> one will provide, so that it is ready when the first tools land and so
> contributors know what they are building towards.

---

## What these tools are for

Tools here are built for one job: making a mechanism visible. They are not
lecture replacements, not assessments, and not textbooks. Each takes a single
idea that is easier to see than to be told, and lets a student predict what will
happen, change one input at a time, and watch what follows.

That framing has a consequence worth stating up front. A tool on its own teaches
very little. What teaches is the question you ask while it is on screen — the
prediction you make students commit to before you move the slider. The tools are
built to make that moment cheap to stage, and most will ask for the prediction
themselves before revealing anything.

## The four settings

### 1. Live demonstration

Open the tool on the lecture display and drive it yourself while narrating.

- Ask for a prediction *before* you change anything, and get a show of hands.
  A wrong prediction that the class has committed to is worth more than a
  correct explanation they watched passively.
- Change one control at a time. The tools are built to make single-variable
  changes easy precisely so this is possible.
- Use the reset button between runs so the second demonstration starts from the
  same place as the first. Where randomisation matters, tools support a visible
  or documented seed, so you can reproduce a particular run in front of a class.
- Layouts are readable when projected and stay usable when zoomed to 200% for a
  large room.

### 2. Guided lab or seminar

Students work on their own devices while you set tasks.

- Give a specific target rather than "have a play": *find the smallest sample
  size at which the interval usually contains the true value*.
- Each tool carries a **Teaching notes** panel on the page (collapsed by
  default), and a fuller `teaching-notes.md` beside it in the repository, with
  prompts, likely misconceptions and debrief questions. These are written for
  you, not for students; there is no harm in students reading them.
- Ask for a written sentence at the end. "What did you find?" produces better
  learning than "did it work?".

### 3. Independent revision

Link the tool from your VLE. There is no login, so a URL is all a student needs,
and it works on a phone. Nothing a student does is recorded — which also means
you cannot use these tools to check whether a student engaged. That is
deliberate.

### 4. Adapted for your own course

Copy the tool's folder, change the defaults, the wording or the worked example,
and host your version wherever you like. See
[`adapting-a-tool.md`](adapting-a-tool.md). The MIT licence permits this without
asking; keep the copyright notice with any substantial portion you reuse.

## What every tool will give you

- **One idea, stated in one sentence** at the top of the page.
- **A prediction step** before the result is revealed.
- **Controls that change one thing at a time.**
- **A visualisation paired with the same information in text**, so a student who
  cannot see the graphic gets the same numbers.
- **A status line** that says in words what just changed.
- **A plain-language interpretation**, and an explicit statement of what the
  tool does *not* demonstrate.
- **Teaching notes**: suggested prompts, and the misconception targeted.
- **Reset and worked-example controls.**
- **No account, no storage, no transmission.** Everything stays in the tab.

## Module notes

### Cognitive Psychology

The recurring difficulty is that students treat cognition as introspectively
available: they expect to be able to notice their own attentional limits or
inspect their own memory. Tools here work by producing an experience that
contradicts that expectation, then explaining it.

Two prompts that do work:

- Before a task: *"How many of these do you expect to get right? Write the
  number down."*
- After: *"Your confidence and your accuracy came apart. Which one would you
  have trusted in a witness box?"*

A caution: results a student produces on a laptop are a demonstration of a
paradigm, not a measurement of that student. Say so before you run it. A student
who performs poorly on a span task in a seminar has learned nothing about
themselves.

### Research Methods

The recurring difficulty is that students treat a sample statistic as a fixed
property of the world rather than something that varies. Almost every tool in
this module attacks that directly, by showing repeated sampling rather than
describing it.

Two prompts that consistently do work:

- Before revealing anything: *"If I ran this study again tomorrow with a fresh
  sample, how different would the number be?"*
- After a run: *"What in this display would change if I doubled n — and what
  would not?"*

Tools here distinguish the sample, the population, the model, the estimate and
the uncertainty around it, and label simulated data as simulated. None of the
generated numbers are norms or published effect sizes.

### Neuropsychology

Running the paradigm before reading about it changes how the finding lands.
A student who has felt Stroop interference does not need to be persuaded that it
exists.

Two cautions for classroom use:

- **Timing conditions are uncontrolled.** Browser timing on a mixed set of
  student laptops is not laboratory timing. Group patterns will usually
  replicate the classic direction; individual numbers should not be treated as
  measurements. Say this before the class starts, not after someone gets an odd
  result.
- **Never treat performance as diagnostic.** Tools state this on the page; state
  it aloud as well.

Tools here also avoid crude one-region–one-function claims. Where a pattern is
better explained by a network or a disconnection account, the tool says so.

Every timed task provides an untimed practice mode and a non-timed route to the
same concept, so no student is required to complete a speeded task to take part.

### Social and Critical Psychology

The difficulty here is that evidence, theory and politics are easily run
together, and students often cannot see the seams. Tools in this module keep
them apart explicitly: what was measured, in whom, with what result; what
account is offered for it; and which parts of that account are disputed.

Prompts that work:

- *"Who was in this sample? What would you need before generalising it to
  anyone else?"*
- *"This is a group-level difference. What does it tell you about the next
  person who walks through the door?"*

Where a classic study is used, its methodological and ethical criticisms are
part of the material, not a footnote. Where a construct is contested, the tool
says so rather than presenting one position as settled fact. Nothing in this
module scores, labels or profiles the person using it.

### Personality and Individual Differences

The difficulty here is measurement, not content. Students can recite the Big
Five long before they can say why an unreliable measure limits the correlation
it can produce, or why the number of factors retained is a decision rather than
a discovery.

Tools in this module use only openly licensed or public-domain item pools. Where
a tool asks students to answer items about themselves, it will say plainly on
the page that the result is a classroom illustration, not an assessment. Please
repeat that out loud — students take a scored profile more seriously than we
intend them to, particularly for traits with everyday moral connotations.

Traits are treated as probabilistic, dimensional and context-sensitive
throughout. No tool implies that a score determines behaviour, and profiles are
shown with the uncertainty band around them rather than as a point.

## Practical checks before a class

1. Open the tool on the machine you will actually teach from, ahead of time.
2. Check it at the zoom level and resolution of the room display.
3. If the room has no internet, download the repository beforehand — the tools
   work from a local folder.
4. Run through the demonstration once, including the reset.

## Citing and crediting

There is no requirement to cite these tools in teaching, but if you would like
to credit them, this form is enough:

> Open Psychology Interactives.
> <https://utman5454.github.io/open-psychology-interactives/>

If you adapt a tool and share your version, a line such as *"Adapted from Open
Psychology Interactives"* with a link back is appreciated. Retaining the MIT
copyright notice with substantial reused portions is the actual licence
condition.

## Feedback

If a tool does not work in your teaching, that is useful information. Open an
issue on the [repository](https://github.com/utman5454/open-psychology-interactives/issues)
describing what you were trying to show and where it fell down.
