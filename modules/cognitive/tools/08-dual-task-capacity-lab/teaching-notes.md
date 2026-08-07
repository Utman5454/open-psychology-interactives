# Teaching notes — Dual-Task and Limited Capacity Laboratory

`modules/cognitive/tools/08-dual-task-capacity-lab/`

A dual-task cost is a difference. Half the value of this laboratory is in
refusing to let anyone reach block 3 before they have their own baselines.

---

## Before you run this

- **Nothing is timed out and nothing animates.** Each display waits for its
  answer; blocks can be stopped between trials; no CSS transition is used
  anywhere.
- **The block order is enforced on purpose.** Letters alone, numbers alone,
  then both. Students will ask why they cannot skip to the interesting one.
  That question is the lesson.
- **Say the confound out loud.** Block 3 always comes last, so the cost is
  measured against baselines from a less practised person. A real experiment
  counterbalances. This one cannot, and the limits panel says so.
- **The worked example needs nobody to perform anything**, and it contains
  both settings, which is the comparison that matters.

## Running it from the front

The set of three takes about two minutes. The comparison worth budgeting time for is a second set with the number task set to count at the end — that is the manipulation that separates a general-capacity story from a response-selection bottleneck, and it is the only one on the page that does.

Twenty trials a block is far too few for a stable difference, and the results panel says so. Pool the room if you want anything more than a conversation.

## Intended level

First- or second-year undergraduate. It pairs well with the Stroop tool
(interference from an irrelevant dimension) and contrasts with it usefully:
Stroop is about one response competing with another within a task, this is
about two tasks competing for something shared.

## Learning objectives

After the activity a student should be able to:

1. compute a dual-task cost against a matched baseline and say why the
   baseline has to be their own;
2. read an asymmetric cost and ask who decided which task to protect;
3. predict what removing the second task's choice response should do, on each
   account;
4. state a prediction on which capacity and bottleneck accounts differ;
5. explain why "multitasking ability" is not what this measures.

## Estimated duration

- **Demonstration from the front:** 5 minutes — the worked example, two sets.
- **Students running one set of three blocks:** 8–10 minutes.
- **With a second set at the other overlap setting, the challenge and the
  debrief:** 30 minutes.

## Preparation

Run one set yourself in each mode. The counting version feels very different
from the inside, and it is worth being able to say so.

## The prediction question

> What will adding the second task do to the first one?

Four options: slower only, less accurate only, both, or neither. The intended
answer is *both*, and *slower only* gets warm feedback because it is often
mostly right — people trade accuracy for time when nothing is timed out.
*Neither* gets the most useful feedback: two tasks this easy still interfere,
which is exactly why the effect is interesting.

## The demonstration worth doing from the front

1. Load the **worked example**. Two simulated sets appear in the "every set"
   table.
2. Read Set A: letters +130 ms, numbers +273 ms. Ask: *why did one task pay
   twice as much as the other, when nobody was told to prioritise either?*
3. Read Set B: the same tasks, but the numbers are only counted. Letters
   +98 ms. Ask: *the number still had to be read, held and added to a running
   total. Why did the letter task recover so much?*
4. That second question is the capacity/bottleneck distinction, and students
   usually get there themselves.

## Activity sequence

1. **Predict** what the second task will do to the first.
2. **Block 1** — letters alone.
3. **Block 2** — numbers alone. Note that there is still no cost to report.
4. **Block 3** — both. Read the results.
5. **A second set** with the overlap setting changed.
6. **Open the excluded-responses panel** and talk about the cut-offs.
7. **The challenge** — five findings, two accounts.
8. **Debrief.**

## Debrief questions

1. Why does the tool refuse to let you run block 3 first?
2. Your cost was 140 ms and your neighbour's was 260 ms. What would you need
   before saying anything about the two of you?
3. One task paid more than the other. What decided that?
4. In the counting version the number still has to be read and held. Why did
   the letter task suffer so much less?
5. If your time cost got smaller but your errors got worse, did the cost get
   smaller?
6. What would it take to show that someone is a better multitasker in general
   rather than at this particular pair of tasks?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "I'm good at multitasking." | Two arbitrary tasks, twenty trials, one session, and a cost that was never referred to a common baseline. Also: dual-task improvement is largely specific to the practised pair. |
| "The dual-task time is the result." | The dual-task time is a number. The result is the difference from your own single-task time. |
| "Both tasks got worse, so it's a shared pool." | Both families predict that. It is the finding that separates nothing, and the one students most often treat as decisive. |
| "The bottleneck theory says only one thing happens at a time." | It says one *stage* — usually choosing a response — is serial. Perception and memory can overlap freely. That is why the counting version is the informative one. |
| "The counting version is easier, so of course the cost is smaller." | It is not obviously easier: holding a running total across twenty items is demanding. What it removes is a *choice response* on each item, which is a specific claim, not a claim about general difficulty. |
| "So capacity theory is wrong." | Making the second task harder without changing its response also costs, which is what a capacity account predicts and a strict bottleneck does not. Most working models now contain both. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Block length | 20 trials |
| Block order | letters alone → numbers alone → both (enforced) |
| Letter task | a letter, vowel or consonant (F / J) |
| Number task, easy | one digit 1–9, odd or even (D / K) |
| Number task, hard | two digits 12–98, is their **sum** odd or even (D / K) |
| Overlap: respond | a choice response to every number |
| Overlap: count | no per-item choice; count the odd ones, report at the end |
| Inter-trial interval | 500 ms |
| Time limit | none, on any display |
| Anticipation cut-off | responses under 200 ms excluded and counted |
| Lapse cut-off | responses over 4000 ms excluded and counted |
| Errors | excluded from time means, reported as accuracy |

In counting mode block 2 is paced by a single non-choice **Next** press, which
gives a viewing time per number without engaging response selection. In block 3
the number is on screen for exactly as long as the letter response takes, so no
separate number time is reported there — the number-task measure in the dual
block is the count.

## The worked example — reference values

One simulated participant who ran both settings, 60 trials per block.
`RT = base + Normal(0, 80) + Exponential(mean 55)`, floored at 220 ms.
Verified against the running tool.

**Set A — respond mode, easy, seed 20260971.** Bases 610 / 780 for letters and
570 / 850 for numbers; accuracies .97 / .93 and .96 / .90.

| Task | Condition | Trials | Correct | Mean RT | Cost |
| --- | --- | --- | --- | --- | --- |
| Letters | Alone | 60 | 100% | 683 ms | baseline |
| Letters | Both at once | 60 | 98% | 813 ms | +130 ms |
| Numbers | Alone | 60 | 95% | 639 ms | baseline |
| Numbers | Both at once | 60 | 93% | 912 ms | +273 ms |

**Set B — counting mode, easy, seed 20260972.** Bases 610 / 690 for letters,
700 for the number viewing time; counting error 0 alone and 2 in the dual
block. Letter cost **+98 ms**.

The "every set so far" table therefore reads:

| Set | Source | Number task | Answer needed | Cost to letters | Cost to numbers |
| --- | --- | --- | --- | --- | --- |
| Worked example A | Simulated | Easy (one digit) | Every item | +130 ms | +273 ms |
| Worked example B | Simulated | Easy (one digit) | Once at the end | +98 ms | count 2 out |

Both the asymmetry in Set A and the reduced letter cost in Set B are **built
into the generator**. They illustrate the shape of the classic findings; they
are not evidence for them, not norms and not anybody's data.

A note for the sharp-eyed: in the simulated sets, accuracy and reaction time
come from the same draws, so a trial that "failed" the accuracy check is simply
absent from the mean. Real speed–accuracy trade-offs are more interesting than
that, and the excluded-responses panel is where a learner's own data show it.

## What the tool refuses to do

**It will not let a cost be computed without both baselines.** The stage track
and the enforced block order exist for this.

**It will not compare one person's cost with another's.** The results note says
why in one sentence.

**It will not treat two of the learner's sets as an experiment.** They differ in
order, practice and fatigue as well as in setting, and the sets table says so.

## The challenge

| Finding | Answer | Why |
| --- | --- | --- |
| Both tasks slow down when combined | Both accounts | Predicted by everything; settles nothing |
| Cost nearly vanishes when the second task needs no choice response | Bottleneck | The separating manipulation |
| Harder second task, same response, larger cost | Capacity | A strict bottleneck predicts little effect |
| Practice shrinks the cost | Both accounts | And the failure to transfer is the interesting part |
| "A 90 ms cost means a better multitasker than a 260 ms cost" | Neither | No common baseline, unreliable difference score, unmeasured trait |

Two of the five separate the accounts and two do not. Being able to say which
is which matters more than knowing which account is currently favoured.

## Limitations and cautions

- **Not a measure of anybody**, and certainly not of "multitasking ability".
- **Order is confounded**: block 3 is always last.
- **Twenty trials a block**, and a cost is a difference between two noisy
  means, which adds their noise together.
- **Speed and accuracy trade**; read both columns.
- **Uncontrolled browser timing.**
- **The two settings suggest but cannot establish** anything about capacity
  versus bottleneck, from one person's two sets.
- **The worked example is simulated**, with the pattern set by hand.

## Accessibility considerations

- No display is timed out; nothing animates or transitions.
- The number sits directly above the letter, so no eye movement is needed
  between tasks.
- Responses by pointer or by F / J / D / K, or the space bar in counting mode;
  targets 3.25rem tall; every button has an explicit accessible name and the
  key hint is decorative and hidden.
- The stage track marks the current block by border, background,
  `aria-current="step"` and a number — never by colour alone.
- Chart bars print their values; the combined bars are hatched as well as
  differently filled; the chart is paired with a six-column table.
- The trial display is `aria-hidden` during a block.
- Headings do not skip; focus moves to the results heading; forced-colours
  rules are supplied.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Counterbalance it.** Design the version of this experiment that removes
   the order confound. How many blocks does each participant now run?
2. **Predict the PRP curve.** If the number appeared 100 ms after the letter
   rather than at the same moment, what should happen to each task's time, on
   each account?
3. **Find the trade-off.** In your own data, is there a trial range where your
   time improved and your accuracy fell? What would you conclude?
4. **The applied claim.** Find a claim about driving and phone use that cites
   dual-task research, and identify what it assumes about generalising from
   laboratory pairs of tasks.
5. **Write the correction.** In three sentences, correct "some people are good
   at multitasking", keeping whatever is true in it.

## Citation and evidence notes

- **Welford (1952)** and **Pashler (1994)** for the response-selection
  bottleneck and the psychological refractory period.
- **Kahneman (1973)**, *Attention and Effort*, for the single-capacity account.
- **Navon and Gopher (1979)** and **Wickens (1984, 2002)** for multiple
  resources, the position most working models occupy now.
- **Schumacher et al. (2001)** for near-perfect time-sharing after practice,
  and what it does and does not show.
- **Spelke, Hirst and Neisser (1976)** for the classic demonstration of
  practice effects on dual-task performance.
- **Watson and Strayer (2010)** for the very small minority who show almost no
  cost — and for how carefully that claim is made.
- **Hedge, Powell and Sumner (2018)** for why difference scores from robust
  experimental effects make poor individual-difference measures.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
