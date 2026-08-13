# Teaching notes — Human Attention versus AI Attention

`modules/cognitive/tools/12-human-vs-ai-attention/`

Two literatures, one word. The tool's job is to make a student able to say
exactly what is being claimed whenever that word turns up.

---

## Before you run this

- **Run the stages in order.** Stage 1 is the human task, stage 2 is the
  arithmetic. It is much harder to over-read a weight map when you have just
  done the human thing yourself, and the tool enforces the order by keeping
  stage 2 hidden until stage 1 is answered.
- **Watch your own verbs.** The commonest way this session goes wrong is the
  demonstrator saying "and now the model looks at the noun". The page never
  says that, and neither should the person running it. A weight is a number.
- **Nothing is timed and nothing moves.** It is a reading, deciding and
  computing task throughout.
- **No model is run.** Every number was written by hand. That is not a
  shortcut — it is the second teaching point, and the provenance panel exists
  to make it unmissable.

## Running it from the front

Use the three presets in order and let the room name what each one "means" before you tell them the vectors were written by hand to produce exactly those three pictures. The point lands harder when a class has already narrated the first preset as the model "working out the referent".

The mask checkbox is worth a minute on its own. It changes the weights a great deal and it is a property of the architecture, not of the sentence — a useful antidote to reading every pattern as a discovery about language.

## Intended level

Second-year undergraduate, or a first-year cohort with a good lecture behind
them. It is the natural closing tool for the module because it requires the
distinctions built in the other eleven: overt versus covert orienting, the
cost of dividing attention, selection versus awareness.

## Learning objectives

After the activity a student should be able to:

1. state what a transformer attention weight is, in arithmetic terms, in two
   sentences;
2. name the two respects in which the two uses of the word genuinely
   correspond, and state them precisely rather than loosely;
3. name four respects in which they do not;
4. explain why a weight map is not an explanation of an output;
5. notice when a shared word is carrying an argument it has not earned.

## Estimated duration

- **Demonstration from the front:** 8 minutes — stage 1 with the room, then
  the presets.
- **Students working through all three stages:** 15 minutes.
- **With the debrief:** 25 minutes.

Head A and the temperature slider are on show; heads B and C sit behind
**Look at another head**, and the provenance of the numbers behind **Where
these numbers came from**. A front-of-room demonstration should open both.

## Preparation

Do stage 2 once and change the temperature slider slowly from 0.4 to 2.5 while
watching the bars. Being able to say "this is one division" while a picture
that looks like understanding dissolves into a flat line is the most useful
thirty seconds in the tool.

## The prediction question

> If a transformer's attention weights for the word "it" land on the same noun
> you chose, what would that show?

Four options. The intended answer is *very little on its own*. The other three
are the three errors the page is about, and each gets substantive feedback:
same-mechanism, explains-the-output, and paying-attention-in-the-ordinary-sense.

## The demonstration worth doing from the front

This is the sequence that makes the point land.

1. Do **stage 1** with the room. Two sentences, two shows of hands. Establish
   three things out loud: it was fast, it used the end of the sentence, and
   everyone can *say* what they decided.
2. Open **stage 2** and press the first preset, *the one that looks
   meaningful*. Say nothing.
3. Ask the room to describe what the model is doing. They will narrate it —
   "it's working out that 'it' means the lorry".
4. Now open the **provenance panel** and read the first sentence aloud: every
   number was written by hand, and the author decided which token would win
   before choosing numbers that made it win.
5. Press the second preset, *the one that is just recency*, and the third, *the
   one that says nothing at all*. Same sentence, same operation, three
   different stories — none of which the arithmetic contains.
6. Finish with the mask checkbox: the pattern changes a great deal, and the
   thing that changed it is a rule about the architecture, not a fact about
   the sentence.

## Activity sequence

1. **Predict** what agreement between the two stages would show.
2. **Stage 1** — resolve "it" in two sentences.
3. **Stage 2** — compute the weights; work through the three presets; move the
   temperature; toggle the mask.
4. **Open the provenance panel.**
5. **Stage 3** — the eight-statement sort.
6. **Debrief.**

## Debrief questions

1. Say what an attention weight is without using any verb that implies an
   agent.
2. In stage 1 you could report what you decided. What is the machine-side
   equivalent, and why is a model's sentence about its own weights not one?
3. Spreading the weights evenly over ten positions costs the same arithmetic as
   concentrating them on one. What does the human literature say about the cost
   of spreading attention, and what follows?
4. The mask changed the picture more than the head did. What kind of fact is a
   mask?
5. Two of the eight statements are true of both. State each one carefully
   enough that it is not an overclaim.
6. If the operation had been called "weighted pooling", which parts of today's
   discussion would disappear?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "The model is paying attention to the noun." | It computed a dot product and normalised it. Ask them to restate the sentence without an agent; the restatement is the learning. |
| "The heatmap shows why it answered that way." | Weights can be altered substantially without altering the output, and identical outputs arise from different weight patterns. Weights are one factor in one operation in one layer. |
| "So attention in AI has nothing to do with psychology." | Too strong the other way. Two things genuinely correspond — selection under a constraint, and dependence on prior context — and the challenge marks them as "both". Overcorrecting is its own error. |
| "Transformers have limited capacity too, so it's the same bottleneck." | The constraint is the shape of a matrix, not a limit on a system operating in real time, and there is no cost of dividing the weights. Same word, different quantity. |
| "You could measure human attention the way you read the weights." | You cannot. Human selection is inferred from responses, errors, eye position and electrophysiology, and every inference is contested. This is the one place the machine case is easier. |
| "Eye tracking measures attention, so that's shared ground." | Neither, in fact. A transformer has no eyes, and in the human case eye position measures overt orienting only — covert attention moves without it, which is the whole point of the cueing tool earlier in this module. |

## The design, exactly as built

| Setting | Value |
| --- | --- |
| Sentence | "the cyclist passed the lorry because it was moving slowly" |
| Tokens | 10, each with a hand-written key vector of three numbers |
| Heads | A [8.0, 0.4, 0.4], B [0.4, 0.4, 9.0], C [1.0, 1.0, 1.0] |
| Query vector | the query token's key vector, multiplied elementwise by the head |
| Score | (query · key) ÷ √3 |
| Mask | scores for positions after the query set to minus infinity |
| Weights | softmax(score ÷ temperature) |
| Temperature | 0.4 to 2.5, default 1.0 |
| Value vectors | none — the operation stops at the weights |

The three coordinates are **never given names** anywhere in the interface.
Naming a coordinate after the thing it appears to track is the interpretive
error the tool exists to make visible, and doing it in the interface would
undo the lesson.

## Reference values

Verified against the running tool.

**Default** — position 7 ("it"), head A, temperature 1.00, no mask:

| Position | Token | Weight |
| --- | --- | --- |
| 5 | lorry | 35.4% |
| 2 | cyclist | 18.5% |
| 7 | it (query) | 12.9% |
| 9 | moving | 6.2% |
| 3 | passed | 5.3% |
| 10 | slowly | 4.8% |
| 6 | because | 4.7% |
| 8 | was | 4.2% |
| 4 | the | 4.1% |
| 1 | the | 4.0% |

**Preset 1 — "the one that looks meaningful"** (head A, temperature 0.60):
lorry 56.4%, cyclist 19.1%, it 10.5%, moving 3.1%.

**Preset 2 — "the one that is just recency"** (head B, temperature 0.60,
masked): it 23.1%, because 18.1%, lorry 17.8%, the 12.4%; three positions
masked at zero.

**Preset 3 — "the one that says nothing at all"** (head C, temperature 2.50):
every position between 9% and 11%, largest lorry at 10.7%.

## Where the analogy holds — say these precisely

**Both are selection under a constraint.** A person cannot fully process
everything arriving at once. A transformer layer must produce one output vector
per position and does so by weighting. Both are formally allocation problems.
The constraints are not the same kind of thing, and the sentence should be
stated at that level of care.

**Both depend on prior context.** Human selection is shaped by expectation,
recent experience and the current task. A transformer's weights are a function
of the preceding tokens, and under a causal mask of nothing else.

## Where it fails — four, and none of them is close

1. **No experience.** Nothing in a softmax corresponds to awareness, and no
   question could be put to the model whose answer would be a report of one.
2. **No bottleneck of the same kind.** Every pairwise score is computed in
   parallel and then normalised. Nothing waits for anything.
3. **No cost of dividing it.** A flat distribution costs exactly the same
   arithmetic as a peaked one.
4. **Fully inspectable.** All ten weights can be read to a decimal place.
   Human attention cannot be read off anything directly — and being inspectable
   still does not make the weights an explanation.

## The sorting challenge

| Statement | Answer |
| --- | --- |
| Selecting one thing costs processing something else | Human |
| Produces a report that is evidence about an experience | Human |
| Non-negative numbers over positions summing to one | Transformer |
| Can be read off the internal state completely | Transformer |
| Depends on what came earlier, not only the current input | Both |
| A way of allocating something limited | Both |
| A picture of it explains the output | Neither |
| Measurable by tracking the eyes | Neither |

The last row surprises people, and it is the one worth spending time on: it
requires them to remember that eye position measures overt orienting only.

## What the tool refuses to do

**It will not use agentive language for the computation.** No noticing, no
focusing, no ignoring, no caring — anywhere on the page.

**It will not present the weights as an explanation.** Stated in the
prediction feedback, in the readout note, in the debrief and in the limits
panel.

**It will not pretend a model was run.** The provenance panel is unambiguous.

## Limitations and cautions

- **No model was run**, and the numbers were chosen to produce three legible
  pictures.
- **It is one attention operation** — one head, three dimensions, ten tokens,
  no value vectors, no residual stream, no feed-forward layer, no second layer.
- **Stage 1 measures nothing** about how people resolve pronouns; it
  establishes only that they can and can report it.
- **Agreement between the stages would mean very little**, and so would
  disagreement.
- **Nothing here bears on machine understanding, awareness or intent.**

## Accessibility considerations

- Nothing is timed; nothing moves; no CSS animation or transition anywhere.
- The query position is marked by border weight, a filled background and the
  printed word "query"; masked positions by a dashed border and the word
  "masked" — never by hue.
- The chart is paired with an always-visible paragraph giving the three largest
  weights, the smallest, the number masked and the fact that they sum to 100%,
  with the full five-column table one click away inside the same figure.
- The temperature range carries an `aria-valuetext` in words.
- A pinned primary block keeps the token strip and the chart in view while the
  controls column is scrolled.
- Focus moves to each stage heading as it is revealed.
- Headings do not skip; every control has an accessible name; forced-colours
  rules are supplied.
- Usable at 320px and at projector widths.

## Optional extension tasks

1. **Write the caption.** Describe the first preset's chart in two sentences
   with no agentive verbs. Then write the version a journalist would publish,
   and list what it added.
2. **Break the illusion further.** Change one number in a key vector so the
   first preset picks the cyclist instead. What does the ease of doing that
   tell you?
3. **Find the second rhyme, or show there isn't one.** The debrief now claims
   exactly one genuine correspondence — that both allocate limited influence.
   Argue for a second, and see whether it survives being stated precisely.
4. **The borrowed-word audit.** "Memory", "learning" and "representation" are
   also borrowed. Pick one and write the two-sentence disambiguation.
5. **The interpretability claim.** Find a published figure showing attention
   weights and state exactly what it does and does not establish.

## Citation and evidence notes

- **Vaswani et al. (2017)** for the operation and for the name.
- **Bahdanau, Cho and Bengio (2015)** for the earlier alignment mechanism the
  name was inherited from.
- **Jain and Wallace (2019)**, *Attention is not Explanation*, and **Wiegreffe
  and Pinter (2019)**, *Attention is not not Explanation*, for the argument
  about what weight maps establish — worth setting as a pair.
- **Bibal et al. (2022)** for a survey of the same question.
- **Posner (1980)** for covert orienting, which is why the eye-tracking row in
  the challenge is "neither".
- **Lavie (1995)** and **Pashler (1994)** for the capacity and bottleneck
  findings that the machine side has no counterpart to.
- **Shanahan (2024)** on talking about large language models without importing
  assumptions the vocabulary smuggles in.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive any quantity from them.
