# Teaching notes - Human Attention versus AI Attention (Simplified)

`simplified/modules/cognitive/tools/12-human-vs-ai-attention/`

**What it teaches.** A model's "attention weight," in this simplified
form, is nothing but a score divided by the total of all the scores, not
the everyday psychological sense of attention at all.

**Before students start.** Say that "attention" here means one specific
calculation, not the everyday sense of the word most students bring
into the room.

**What students do.**
1. Resolve what "it" refers to in one ambiguous sentence.
2. Add up five given scores, then watch them turned into weights by
   dividing each by the total.
3. Sort five statements into you, the model, both, or neither.

**What to look for.** The highest score does not automatically belong to
the word a student picked as the referent. Dividing by the total is the
entire calculation; there is no further step modelling anything
psychological.

**Debrief.** Say what a weight is here without using a verb that implies
understanding. Is dividing by a total the same operation a person does
when working out what a pronoun refers to?

**Common misconception / caution.** "The model understood the sentence"
needs correcting: it computed a ratio. This page also simplifies how
real models compute attention, using division instead of the softmax a
real transformer uses, so do not extend conclusions drawn here to real
model weights without that caveat.

**Use in class / timing.** All three stages together take about 5 to 7
minutes.
