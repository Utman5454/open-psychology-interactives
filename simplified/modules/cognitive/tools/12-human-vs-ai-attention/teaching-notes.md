# Two Things Called Attention — Simplified Edition

**Module:** Cognitive Psychology
**Duration:** 5–7 minutes
**Level:** Second year and above, or any group discussing AI and cognition
**Edition:** Simplified, and narrower than its parent. This keeps the three
stages and the hand computation from **Human Attention versus AI Attention**.
The second sentence where the resolution flips, more of the architecture, and
the longer treatment of interpretability are in the longer version at
`modules/cognitive/tools/12-human-vs-ai-attention/`.

## Learning objectives

By the end, a student should be able to:

1. say what the operation called attention computes in a language model;
2. say why a weight distribution is not an explanation of an output;
3. distinguish using world knowledge from reweighting tokens by similarity;
4. say that a shared name does not imply a shared mechanism;
5. say what the arithmetic here leaves out.

## Preparation

None. Students need no prior knowledge of machine learning, and the whole
computation is one division repeated five times.

## Suggested use

**Projected, with the room doing stage two out loud.** Reading the scores off
and dividing by thirty takes about a minute and is much more convincing than
any diagram of a transformer.

**In a session on AI and cognition**, as the antidote to the assumption that
borrowed vocabulary implies borrowed theory. It works equally well for anyone
who has met "memory", "learning" or "hallucination" used the same way.

**Before a critical-appraisal exercise on interpretability claims**, so that
attention heatmaps are met with the right question.

## Prediction question

Ask after stage one, before stage two:

> You just worked out that the trophy was too big. What would a computer need
> to know in order to get that right?

Students usually say something about knowing what trophies and suitcases are.
Then show them what the model actually computes, which contains none of it,
and ask how it manages to get the answer right anyway. That question is the
genuinely interesting one and the activity leaves it open on purpose.

## Activity sequence

1. **Stage one.** Resolve the pronoun. Do not mention models yet.
2. **Draw out what was used**: rough sizes of objects and what fitting means.
   None of it is in the sentence.
3. **Stage two.** Add the five scores, then divide each by thirty. Make
   students do it rather than reading it.
4. **Look at where the weight went**: 0.30 on trophy, but also 0.10 on
   *because* and 0.13 on *was*, which refer to nothing. This is the moment.
5. **Stage three.** Sort the five claims. Every one gives its reason.
6. **Read the caution**, particularly the sentence about what is disputed.

## Debrief questions

- What did you use to decide that the trophy was too big?
- The model put 0.10 on the word *because*. What does that number mean?
- If someone shows you a heatmap of attention weights and says "this is why
  the model answered that", what should you ask?
- Current models usually get this sentence right. Does that mean they did what
  you did?
- What else in this field has borrowed a word from psychology?

## Likely misconceptions

- **Attention in a model means the model is concentrating.** It is a weighted
  average over positions.
- **The highest weight points at the referent.** It does not, and the figure
  the student computes shows the weight spread across function words.
- **This proves models do not understand.** It does not, and the activity does
  not claim it. It shows the mechanism is different, which is a narrower and
  better-supported claim.
- **Attention weights explain the output.** Genuinely disputed in the
  literature, and the caution says so rather than taking a side.
- **I have now implemented attention.** The caution lists exactly what was left
  out: the exponential, the scale, the parallel heads and the layers.

## Limitations and cautions

The scores are invented for a five-word illustration. A real model
exponentiates before normalising, works over far more tokens, and runs many
weightings in parallel at every layer, so what students compute is the shape
of the operation rather than the operation. Whether attention weights explain
model outputs is disputed; this activity shows only that a weight distribution
is not by itself an explanation. And nothing here says a model cannot resolve
the sentence: current models usually do. The claim is about mechanism, not
about the score.

## Accessibility considerations

Every choice is a labelled button, keyboard operable, marked with a glyph and
a hidden note as well as a colour. Nothing is timed and there is no motion. The
scores and weights appear in a real table as well as in the figure, so the
computation can be followed entirely without the graphic, and the figure
carries a description listing every weight and stating that they sum to one.
Each claim's explanation appears whether the answer was right or wrong.

## Optional extension

Ask students to invent a set of five scores that *would* put nearly all the
weight on one word, then ask whether a model producing those weights would
thereby have understood the sentence. Working out that the answer is no, for
the same reason as before, is the point arriving under its own steam.

## Evidence and citation notes

The operation is from Vaswani and colleagues (2017), *Attention is all you
need*, **Advances in Neural Information Processing Systems** 30. The sentence
is a Winograd schema of the kind set out in Levesque, Davis and Morgenstern
(2012), *The Winograd Schema Challenge*, in **Proceedings of KR 2012**. On
whether attention weights explain outputs, compare Jain and Wallace (2019),
*Attention is not explanation*, **Proceedings of NAACL 2019**, with Wiegreffe
and Pinter (2019), *Attention is not not explanation*, **Proceedings of EMNLP
2019**; the disagreement between those two papers is worth showing students
directly.
