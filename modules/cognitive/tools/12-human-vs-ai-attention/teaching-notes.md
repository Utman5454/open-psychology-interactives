# Teaching notes - Human Attention versus AI Attention

`modules/cognitive/tools/12-human-vs-ai-attention/`

**What it teaches.** "Attention" names two unrelated things here: a body
of human findings about selection, capacity and awareness, and a
normalised similarity score with no experience, no bottleneck and no
cost to dividing it. A weight map is not an explanation of what a model
produced; weights can shift substantially without the output changing,
and identical outputs can come from different weight patterns.

**Before students start.** Say that "attention" is being used as the
same English word for two different things on this page, deliberately,
and that the two senses are not meant to line up.

**What students do.**
1. Predict what it would show if a model's weights landed on the same
   word a student chose.
2. Resolve what "it" refers to in two ambiguous sentences.
3. Compute weights by hand: pick a position, a head, a temperature and
   whether later words are masked, then compare against three presets.
4. Read the panel showing exactly where the numbers come from.
5. Sort eight statements into human, transformer, both, or neither.

**What to look for.** The masking setting changes the weight pattern
more than switching heads does. Point at that before students start
attributing the pattern to one head "noticing meaning" and another
"noticing recency."

**Debrief.** Say what an attention weight is without using any verb that
implies an agent. Two of the eight statements in the sorting task are
true of both systems. State each one precisely enough that it is not an
overclaim.

**Common misconception / caution.** "The model is paying attention to
the noun" needs correcting on the spot: it computed a dot product and
normalised it. A weight map is not an explanation of an output; weights
can shift substantially while the output stays the same, and identical
outputs can arise from different weight patterns.

**Use in class / timing.** A demonstration runs about 8 minutes.
Students working through all three stages takes 15 minutes. With the
debrief, about 25 minutes.
