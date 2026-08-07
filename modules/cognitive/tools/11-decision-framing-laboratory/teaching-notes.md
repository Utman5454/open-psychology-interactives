# Teaching notes — Decision Framing Laboratory

`modules/cognitive/tools/11-decision-framing-laboratory/`

Everyone can quote the famous version. Far fewer can say what a framing effect
is a claim about, or write a version of the problem in which it gets smaller.
This tool is aimed at the second thing.

---

## Before you run this

- **Nothing here is timed and nothing moves.** It is a reading-and-deciding
  task throughout.
- **The scenarios contain no people.** Seedlings, servers, grain and bicycles.
  That is deliberate: it separates the framing effect from how a reader feels
  about the stakes. It also limits what the demonstration generalises to, and
  the limits panel says so.
- **Split the room if you can.** Half on "completely certain", half on "very
  likely". That comparison is the certainty effect, and it is the more
  interesting of the two findings on the page.
- **Say before anybody starts that four decisions can show nothing.** Each
  scenario is seen in one frame only. Without that warning the debrief turns
  into a conversation about who was rational.

## Intended level

First-year undergraduate. It sits naturally in a lecture on judgement and
decision making, and it also works as a methods example: the reason one
person's data cannot show the effect is a between-subjects design point.

## Learning objectives

After the activity a student should be able to:

1. define a framing effect as a shift in a proportion, not a property of a
   person;
2. explain reference dependence and loss aversion in one paragraph;
3. say what the certainty manipulation separates;
4. rewrite a decision problem so the asymmetry is smaller, and say why each
   edit helps;
5. explain why "people are irrational" does not follow.

## Estimated duration

- **Demonstration from the front:** 6 minutes — the worked example's four bars.
- **Students making four decisions and reading the reveal:** 10 minutes.
- **With the rewriting challenge and the debrief:** 25 minutes.

## Preparation

Make the four decisions yourself once with the reference point set to "only
just arrived". The loss-framed wording reads oddly under that reference point,
and that oddness is a good thing to be able to point at.

## The prediction question

> Which way of describing the outcomes should push people towards the gamble?

Four options. The intended answer is *describing the outcome as things lost*.
The most valuable wrong answer is *neither — the arithmetic is identical*: it
gets warm feedback, because it is what a purely arithmetic account predicts and
because failing it is not the same as being irrational.

## The demonstration worth doing from the front

1. Load the **worked example**. Four bars appear.
2. Read the two "completely certain" bars: 74% and 33%. Same arithmetic, twice.
3. Then read across: gain-certain 74% against gain-very-likely 53%. Ask what
   changed. (Not the expected outcome. Only the guarantee.)
4. Now the loss row: 33% against 29%. Almost nothing. Ask why removing a
   guarantee should matter so much in one frame and so little in the other.
5. That question is the certainty effect, and it is a better use of ten minutes
   than another retelling of the famous problem.

## Activity sequence

1. **Predict** which wording pushes people to the gamble.
2. **Set the two conditions** — certainty and reference point.
3. **Four decisions.** Nothing is timed.
4. **The reveal** — each decision printed beside the wording not shown.
5. **The simulated class data** — the aggregate pattern.
6. **The rewriting challenge** — six edits, four of which help.
7. **Debrief.**

## Debrief questions

1. Nothing about the arithmetic changed. What did change?
2. Why can your own four decisions not show a framing effect?
3. What is a reference point, and where was yours in each scenario?
4. Removing the guarantee cost the safe option 21 points in the gain frame and
   4 in the loss frame. What does that asymmetry suggest?
5. Is a preference that depends on a reference point a mistake? Argue both
   ways.
6. Which of your six edits would you actually use if you had to write a real
   decision brief, and what would it cost you?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "This proves people are irrational." | It shows a group-level shift in proportions. Reference dependence is how nearly every everyday evaluation works; a system without it would be strange rather than wise. |
| "I chose the safe one, so I fell for it." | You saw one frame. There is no counterfactual for you personally, and there could not be. |
| "The two options are the same, so it doesn't matter which you pick." | They have the same expected outcome and different variance. Preferring one variance to another is a preference, not an error. |
| "The effect is about big numbers being scary." | Multiplying every quantity by ten does very little. The effect is about the direction outcomes are evaluated from. |
| "It's just bad wording." | Partly, and that is the interesting part: whoever writes the description has some influence over the decision, which is a claim about writing as much as about minds. |
| "The famous version is about lives, so this is watered down." | The stakes are removed on purpose, so that the effect cannot be confused with how anyone feels about the stakes. The trade is that nothing here generalises to high-stakes decisions. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Scenarios | four, fictional, no people: seedlings 810, servers 540, grain 1,080, bicycles 1,620 |
| Safe option (certain) | save exactly one third of the stock |
| Safe option (very likely) | a 90% chance of saving one third ÷ 0.9 |
| Gamble | a 1 in 3 chance of saving everything, else nothing |
| Expected outcome | one third of the stock, for every option |
| Frame | two gain and two loss, assigned at random |
| Reference point | "long established and yours" or "only just arrived" |
| Time limit | none, anywhere |

Every stock is divisible by 27, so all three quantities are whole numbers. For
the seedlings: 270 saved for certain, or a 90% chance of 300, or a 1 in 3
chance of 810 — all with an expected outcome of 270.

## The worked example — reference values

Simulated with `mulberry32` seed **20261011**: 300 fictional participants in
each certainty condition, four decisions each (two gain-framed, two
loss-framed), so 600 decisions per cell. Verified against the running tool.

| Frame | Safe option was | Decisions | Safe option chosen |
| --- | --- | --- | --- |
| Gain — things saved | Completely certain | 600 | 74% |
| Gain — things saved | Very likely | 600 | 53% |
| Loss — things lost | Completely certain | 600 | 33% |
| Loss — things lost | Very likely | 600 | 29% |

Generator rates: .74, .52, .33, .27. Both the framing effect (rows) and the
certainty effect (columns, much larger in the gain frame) are **built in**.
They illustrate two well-replicated findings; they are not evidence for either,
they are not norms, and they are not anybody's data. Any specific percentage in
the literature belongs to a particular study — the size of these effects varies
considerably with wording, sample and domain.

## The reference-point setting

It changes no number, and it is deliberately **not modelled** in the worked
example. Inventing a small effect would be worse than reporting none. What it
is for is the question the reveal asks: under "only just arrived and not yet
logged as yours", is the loss-framed version describing a loss at all? The tool
cannot tell which reference point a reader used, and neither can any study that
does not ask — which is a good methodological point to leave a class with.

## The rewriting challenge

| Edit | Reduces the asymmetry? |
| --- | --- |
| State both complements in every option | Yes — the single most effective edit |
| Print the expected outcome of each option | Yes |
| Lay the options out in a matched table | Yes |
| Ask for a one-sentence justification first | Yes, in most studies |
| Describe the gamble more vividly | No — increases it |
| Multiply every quantity by ten | No — little effect |

The selected edits are then **applied**, so the learner reads the version they
have built. Encourage them to notice that the fully edited version is longer,
duller and much harder to put on a slide — which is a real reason such problems
are not usually written that way.

## What the tool refuses to do

**It will not score anybody's rationality.** There is no correct choice in any
of the four scenarios, and the results prose says so.

**It will not present the learner's four decisions as evidence.** The prose
states in its second sentence that they cannot show a framing effect.

**It will not model the reference-point manipulation.** See above.

## Limitations and cautions

- **Four decisions from one person show nothing.**
- **A framing effect is a shift in a proportion**, not a property of a person.
- **The mechanism is not settled**: reference dependence, the certainty effect,
  ambiguity about the unstated complement and conversational implicature all
  contribute.
- **Fictional stock is not a hospital.** Removing the stakes is what makes the
  demonstration clean and what stops it generalising.
- **Effect sizes vary across replications.**
- **The worked example is simulated**, with both effects set by hand.

## Accessibility considerations

- Nothing is timed; nothing moves; no CSS animation or transition anywhere.
- The two options are large text blocks, labelled Option A and Option B in
  words, because a decision made from a sentence should not be made from a
  control the size of a checkbox.
- Chart bars print their own percentages; loss-framed bars are hatched; the
  chart is paired with a four-column table.
- The reveal sets the two framings side by side as ordinary text.
- The challenge uses native checkboxes with visible labels and per-item text
  feedback.
- Headings do not skip; focus moves to the results heading and to the first
  option of each scenario; forced-colours rules are supplied.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Write the fifth scenario.** Invent one with the same structure and a
   different domain, and state its three quantities.
2. **Design the within-subjects version.** How would you show both frames to
   the same person without the trick being obvious? What does your solution
   cost you?
3. **Predict the expert result.** Would domain experts show a smaller effect on
   a problem in their own domain? What would you need to hold constant?
4. **The applied case.** Find a public-health or financial message written in
   one frame, rewrite it in the other, and say which you would publish and why.
5. **Argue for the defence.** In 200 words, argue that reference-dependent
   preferences are not irrational.

## Citation and evidence notes

- **Tversky and Kahneman (1981)** for the framing effect and the problem
  structure this tool borrows (with entirely new materials).
- **Kahneman and Tversky (1979)** for prospect theory, reference dependence
  and loss aversion.
- **Allais (1953)** for the certainty effect, which predates the framing
  literature and is often taught after it.
- **Levin, Schneider and Gaeth (1998)** for the taxonomy of framing effects —
  risky choice, attribute and goal framing are not the same thing.
- **Kühberger (1998)** for a meta-analysis, and for how much the effect size
  depends on the details.
- **Mandel (2014)** and **Chick, Reyna and Corbin (2016)** on the role of the
  unstated complement, which is the finding behind the most effective rewrite
  in the challenge.
- **Gigerenzer (2018)** for a sustained argument against reading these results
  as demonstrations of irrationality — worth reading alongside, not instead of,
  the originals.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
