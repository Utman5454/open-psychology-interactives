# Open Psychology Interactives
# Learner-Facing Copy Standard

**Filename:** `LEARNER_COPY_STYLE.md`

**Purpose:** Use this guide when revising learner-facing copy across the Open Psychology Interactives repository.

This is a writing and interaction standard, not a word-count reduction exercise.

The central problem this guide is designed to solve is **hierarchy, timing and cognitive load**. Existing tools may contain strong psychological, statistical and methodological content while still feeling heavy because too much of that content appears at the exact moment the learner is meant to act.

The aim is to preserve the intellectual sophistication of the complete interactive while changing **when, where and how much explanation appears**.

The target rhythm is:

> **short setup → do something → notice something → brief explanation → continue**

During active interaction, keep prose extremely focused.

After the learner has experienced the phenomenon, explanation can deepen.

---

## 1. Core principle

The single most important rule is:

> **The closer the learner is to doing something, the less prose they should have to read.**

A learner who is about to choose, drag, compare, predict, reveal, classify or test something needs:

- a clear task;
- the minimum context needed to perform it;
- one or two things worth noticing;
- a reason to continue.

They usually do **not** need, at that moment:

- the full mechanism;
- every methodological caveat;
- every alternative interpretation;
- a literature review;
- author rationale;
- a preview of the final debrief;
- a restatement of what the interface already shows.

Immediate feedback should normally answer:

> **What should I notice from what just happened?**

One feedback box should normally have **one intellectual job**.

If a feedback state is simultaneously:

1. telling the learner whether they were right;
2. explaining the mechanism;
3. qualifying the mechanism;
4. discussing competing interpretations;
5. relating it to the literature;
6. previewing the debrief;

then the state is overloaded.

Move some of that work elsewhere.

---

## 2. Target voice

Write as:

> **an experienced lecturer who knows exactly what matters, trusts intelligent students to keep up, and explains more only when it becomes useful.**

The voice should be:

- natural;
- concise;
- confident;
- conversational but professional;
- conceptually precise;
- concrete;
- easy to scan;
- occasionally memorable.

It should sound like someone who understands the material well enough to say less.

It should **not** sound like:

- a journal article;
- a textbook paragraph;
- a policy document;
- an ethics application;
- generic AI explanation;
- a script that narrates every pedagogical decision;
- a lecturer who keeps stopping the activity to explain what the activity is meant to teach.

### 2.1 Spoken-language test

Prefer wording a good lecturer could plausibly say aloud.

Prefer:

> The slope is fine. The uncertainty is not.

over:

> It is important to recognise that the inferential consequence of this pattern primarily concerns the accuracy of the estimated standard error rather than the unbiasedness of the regression coefficient.

Prefer:

> Same profile. Different category.

over:

> The profile remains numerically identical despite being assigned to a different categorical classification under the alternative threshold rule.

The shorter version is not less intelligent when the interaction has already supplied the evidence.

---

## 3. Preserve technical language when it matters

Do not replace precise terminology with vague everyday wording simply to sound conversational.

If the technical term is part of the learning, teach it plainly and then use it normally.

For example:

> **Homoscedasticity** means the residual spread stays roughly constant.

Then continue using *homoscedasticity*.

Do not repeatedly translate it back into a longer explanation every time it appears.

The same applies to terms such as:

- residual;
- heteroscedasticity;
- dissociation;
- latency;
- construct;
- validity;
- inference;
- impairment;
- dimensional;
- threshold;
- attentional weight;
- standard error;
- network;
- category;
- association.

The goal is **plain precision**, not avoidance of disciplinary language.

---

## 4. Editorial levels

When revising a tool, classify learner-facing prose conceptually into four levels.

These are **editorial categories**. They are not interface labels that should automatically appear on the page.

### ACTIVE COPY

What the learner needs **now** to perform the task and notice the result.

Typical content:

- short setup;
- task instruction;
- prediction question;
- control hint;
- immediate result;
- one key interpretation;
- next action.

Active copy should usually be the shortest and most concrete copy in the tool.

### OPTIONAL DEPTH

Useful methodological or theoretical detail that is worth preserving but does not need to interrupt the learner.

Typical content:

- fuller mechanism;
- secondary interpretation;
- important confound;
- technical derivation;
- alternative explanation;
- measurement qualification;
- extra methodological detail.

Good homes include:

- disclosure;
- expandable panel;
- secondary note;
- optional “Why?” section.

Optional depth should reward curiosity, not block progress.

### LATER DEBRIEF

Important synthesis that becomes useful **after** the learner has experienced the phenomenon.

Typical content:

- conceptual integration;
- comparison of competing explanations;
- methodological implications;
- theoretical significance;
- limits of inference;
- links between stages;
- broader critical interpretation.

The debrief may be longer because the learner now has something concrete to think with.

### REMOVE / TEACHING NOTES

Content that should not remain in the learner journey.

Typical content:

- repeated caveats;
- author rationale;
- facilitator instructions;
- suggested classroom discussion prompts;
- “why this pair is useful to demonstrate”;
- defensive prose written to pre-empt every possible misunderstanding;
- prose that simply narrates what the graph, profile, animation or simulation already shows;
- explanations already made clearly elsewhere.

Instructor-facing material belongs in `teaching-notes.md`.

---

## 5. The learner rhythm

A good interaction sequence usually looks like this:

1. **Orient**
   - What is the problem?
   - What is the learner about to do?

2. **Commit**
   - Ask for a prediction, judgement or choice where useful.

3. **Act**
   - Let the learner manipulate, compare, classify, reveal or test.

4. **Notice**
   - Point to the relationship that matters.

5. **Explain briefly**
   - Give the smallest explanation needed to make sense of the result.

6. **Continue**
   - Send the learner into the next useful action.

7. **Deepen later**
   - Use disclosure or debrief for the larger methodological or theoretical argument.

The interaction should not repeatedly become:

> **prompt → click → large explanation → next instruction → another large explanation → disclosure → more explanation**

Prefer:

> **action → consequence → one takeaway → next action**

---

## 6. Trust the interaction

The graph, animation, profile, simulation, slider, score table or comparison is part of the explanation.

Let it carry some of the teaching.

### Rule

> **Do not narrate what the learner can already see unless the sentence directs attention to a meaningful relationship.**

Good:

> Repetition differs while the rest of the profile barely does.

This identifies a relationship that matters.

Poor:

> Profile A scores 3 on repetition, 7 on comprehension, 5 on naming, 6 on reading...

if those values are already clearly visible.

Good:

> The residuals fan out, but the slope barely moves.

Poor:

> The residual plot is narrow on the left and wider on the right, while the fitted slope shown above is 0.49...

when the learner can already see both.

The question is not:

> Can this sentence describe the display?

The question is:

> Does this sentence help the learner notice something the display alone may not organise conceptually?

---

## 7. Do not explain the discovery before it happens

Instructions should usually tell the learner **what to do**, not explain in advance why the result will matter.

Prefer:

> Try the last two patterns.

over:

> The last two are worth visiting because they demonstrate that the inferential consequences depend on where the variance is concentrated rather than simply on the visual prominence of the fan shape.

Let the learner see the difference first.

Then explain it.

### Before interaction

Use copy to:

- establish the task;
- define unfamiliar controls;
- state essential safety boundaries;
- ask for a prediction.

Do not use pre-task copy to deliver the conclusion the interaction is meant to reveal.

---

## 8. Dynamic interaction copy

Dynamic and JavaScript-generated text deserves the strictest editing because it appears at moments when the learner is actively doing something.

When revising a tool, inspect **all learner-facing strings in `tool.js`**, not only static HTML.

This includes:

- prediction feedback;
- correct and incorrect answer feedback;
- result cards;
- slider updates;
- preset messages;
- reveal states;
- challenge feedback;
- stage-unlock text;
- empty states;
- reset messages;
- retry messages;
- dynamic labels;
- conditional warnings;
- tooltips;
- dynamically inserted disclosures.

### 8.1 Prediction feedback

Prediction feedback should usually:

1. acknowledge the choice;
2. state the key conceptual consequence;
3. direct the learner towards the next task.

Typical target:

> Correct. The slope can survive while its standard error fails. Now make that happen in the lab.

Avoid turning every answer option into a mini-essay.

For an incorrect answer, explain **why the distinction matters**, not everything known about the topic.

Good:

> Too strong. A fan shape is a warning about uncertainty, not a reason to discard the regression.

Less good:

> Too strong. A fan shape is a reason to be careful about the standard errors, not a reason to discard the analysis. Robust standard errors, transformation and weighted least squares are all possible responses...

The intervention options may be useful later. They are not necessary for correcting the prediction.

### 8.2 Correct / incorrect feedback

Do not mechanically reward correct answers with “Correct!” plus a paragraph.

Sometimes the best feedback is simply:

> Exactly. Repetition is the thing that changed.

Or:

> Not this time. The score and the shortlist do not line up for this person.

Correctness is secondary to the conceptual observation.

### 8.3 Result cards

A live result card should usually answer:

- What changed?
- What did not?
- What is the one relationship worth noticing?

Good:

> The residuals fan out.  
> The slope is still close to 0.50.  
> The classical standard error is too small.  
> **The estimate survives; the uncertainty does not.**

Poor:

A single paragraph that also explains the standard-error formula, confidence interval coverage, leverage, robust alternatives and small-sample uncertainty.

### 8.4 Slider and preset updates

A slider should not trigger a fresh paragraph every time if the conceptual message has not changed.

Prefer:

- short state labels;
- concise result summaries;
- values updating visually;
- one interpretation only when the state crosses into a meaningfully different pattern.

If ten nearby slider values produce the same lesson, do not generate ten verbose variants.

### 8.5 Button-triggered text

A button should not normally reveal an essay.

Use the button to reveal:

- the consequence;
- the key comparison;
- one brief interpretation;
- a next action.

If the result requires more depth, offer it separately.

### 8.6 Sequential stages

At a stage transition, do not recap everything from the previous stage.

Use a bridge.

Good:

> The last three words changed your answer. Nothing around *it* changed.  
> Now compare that with the machine-side operation.

Poor:

A five-paragraph summary of everything the learner did, what the task did not measure and how this anticipates the next section.

### 8.7 Challenge feedback

Challenges can tolerate slightly more explanation because the learner is now consolidating.

Still, each answer should focus on the distinction the challenge is testing.

Good:

> The spread is fairly even. The band itself bends. That is not heteroscedasticity; the model has missed the shape of the relationship.

Avoid repeating the entire debrief after every challenge item.

### 8.8 Progressive disclosure

Use disclosure when the learner may reasonably want the deeper answer **now**, but most learners do not need it to continue.

Suitable material:

- “Why does that happen?”
- technical mechanism;
- confounds;
- fuller calculation;
- alternative interpretations;
- measurement limitations;
- extra methodological detail.

A disclosure should not be a hidden dumping ground for every paragraph removed from the active task. Edit it too.

### 8.9 Reset and retry copy

Keep reset/retry text functional.

Prefer:

> Reset complete.

or no message at all if the visual reset is obvious.

For retries:

> Try another sample.

> Compare a different pair.

> Change the threshold again.

Avoid motivational filler such as:

> Great effort! Why not have another go and see what you discover?

The tool is for postgraduate learners. Trust them.

---

## 9. One feedback box, one intellectual job

Before finalising a dynamic state, ask:

> What is this box for?

Possible jobs include:

- confirm the prediction;
- correct one misconception;
- point out one contrast;
- state one result;
- identify one inferential boundary;
- prompt the next action.

If the answer is “all of these”, split or move content.

A state may contain two or three short sentences, but they should work together towards **one main idea**.

---

## 10. Repetition and caveats

### Core rule

> **A caveat normally gets one home.**

Do not automatically repeat the same qualification in:

- opening disclaimer;
- prediction feedback;
- result panel;
- disclosure;
- debrief;
- limitations.

Before adding a caveat, search the whole tool for the same idea.

If it is already stated clearly in a sensible place, do not restate it unless the new context genuinely changes its meaning.

### 10.1 Necessary safety framing

Keep essential safety and ethical boundaries.

Examples:

- a clinical teaching tool is not a diagnostic tool;
- a fictional task does not assess the learner;
- fictional groups are not real populations;
- simulated values are illustrative;
- a tool does not provide medical advice.

State the boundary clearly and proportionately.

Usually this can be done in one or two short sentences.

### 10.2 Methodological nuance

Preserve it, but place it where it becomes useful.

Examples:

- a residual plot is a diagnostic, not a verdict;
- a weak population relationship does not support individual prediction;
- a category is imposed on continuous variation;
- a selective behavioural difference does not map automatically onto one brain region;
- an attention heatmap is not a complete causal explanation.

These may belong in:

- optional depth;
- challenge feedback;
- debrief;
- limitations.

They do not all need to appear before the first interaction.

### 10.3 Defensive over-explanation

Remove prose whose main function is to prevent every imaginable misreading.

Signs include:

- multiple sentences beginning with “This does not mean...”;
- long lists of things the tool cannot establish;
- caveats repeated after every dynamic result;
- arguments defending why the activity was designed a particular way;
- pre-emptive responses to objections the learner has not encountered.

The aim is not to remove intellectual caution.

It is to stop caution from becoming the dominant learner experience.

---

## 11. Openings

An opening should establish:

- the interesting problem;
- the contrast or phenomenon;
- what the learner will do.

It should not function as a mini literature review.

Typical target: **roughly 20–45 words**.

Example:

> Psychology and AI both use the word *attention*. They do not mean the same thing.  
> In this activity, you will do both kinds on the same sentence and compare them.

An opening may be longer when essential context genuinely cannot be supplied later, but longer should be a deliberate choice.

---

## 12. Learning objectives

A learning objective should normally be:

- one sentence;
- roughly 15–30 words;
- focused on the central intellectual move.

Avoid inventorying every subskill in the tool.

Prefer:

> By the end, you should be able to spot non-constant residual variance and explain what it does, and does not, damage in a regression.

over:

> By the end you should be able to define homoscedasticity as approximately constant conditional residual variance, read a residual-against-fitted plot, explain why non-constant variance leaves the slope estimate unbiased while making its standard error untrustworthy, and say why one residual plot is a diagnostic rather than a verdict.

The fuller outcomes can still be achieved. They do not all need to appear in the opening sentence.

---

## 13. Instructions

Pre-task instructions should usually be **1–3 short sentences**.

Use imperative verbs:

- choose;
- compare;
- drag;
- reveal;
- predict;
- inspect;
- try;
- switch;
- move;
- classify;
- draw;
- check.

Good:

> Reduce the sample to 16. Draw three new samples. Watch how much the shape changes.

Poor:

> It is useful to reduce the sample size because doing so demonstrates that small samples can produce visually unstable residual patterns, which is important when interpreting heteroscedasticity.

The learner should usually perform the action before receiving the explanation.

---

## 14. Prediction questions

Prediction questions work best when they create a meaningful commitment.

They should:

- isolate the key conceptual contrast;
- use plausible alternatives;
- avoid long stem explanations;
- avoid giving away the result;
- lead naturally into the activity.

Prediction options should carry some of the intellectual work.

Do not add a paragraph before the question explaining the distinction the learner is meant to predict.

---

## 15. Immediate feedback

Typical warning range: **roughly 15–40 words**.

The target is not a fixed length.

A five-word result may be perfect:

> **Same profile. Different category.**

A 60-word explanation may be justified if the learner has reached a point where that depth is genuinely useful.

The question is always:

> Is this the right amount of explanation **at this moment**?

Immediate feedback should usually contain **one principal idea**.

---

## 16. Live result text

Typical warning range: **roughly 20–50 words**.

A good result card often has this shape:

1. observation;
2. comparison;
3. conceptual anchor.

For example:

> The residuals fan out.  
> The slope is still close to 0.50.  
> The classical standard error is too small.  
> **The estimate survives; the uncertainty does not.**

Do not pad a concise state merely to meet a target.

Do not compress a genuinely necessary explanation merely to stay under one.

These ranges are warnings against uncontrolled growth, not templates.

---

## 17. Strong conceptual anchors

Short, memorable lines are encouraged when they **compress an argument the learner has just experienced**.

Examples from the calibrated tools:

> **The estimate survives; the uncertainty does not.**

> **The instrument is not the construct.**

> **The exercise is the prediction, not the arithmetic.**

> **Same profile. Different category.**

> **Two levels. One causal claim. No bridge.**

> **A label can summarise a profile. It should not replace the profile.**

These work because the interaction has already supplied the evidence.

Do not manufacture slogans merely because the style guide contains them.

A conceptual anchor should:

- name a distinction;
- compress a result;
- be earned by the interaction;
- make the idea easier to carry forward.

If a short line oversimplifies a genuinely contested issue, do not use it.

---

## 18. Debriefs

The debrief is where the tool can breathe.

It may be longer than active copy because the learner now has an experience to interpret.

A good debrief should:

- synthesise rather than replay;
- connect stages;
- name the larger distinction;
- preserve methodological nuance;
- address important limitations;
- show why the interaction mattered.

Do not simply repeat:

- the prediction;
- each button result;
- every displayed value;
- every caveat already stated elsewhere.

### Good debrief question

> What can the learner now understand that was difficult to explain before they used the tool?

Write that.

### Good debrief structure

Two to four genuinely distinct sections are usually stronger than seven overlapping sections.

Possible structure:

1. What happened?
2. What does it mean?
3. What does it not establish?
4. Why does the distinction matter?

This is a guide, not a mandatory template.

---

## 19. Limitations

Limitations should contain **newly useful boundaries**, not a second debrief.

Before keeping a limitation, ask:

- Has this already been stated?
- Is it important enough to retain?
- Is “limitations” genuinely the best home?
- Does it change how the learner should interpret the activity?

Avoid five to seven bullets that merely restate the opening caution panel.

---

## 20. Instructor-facing versus learner-facing copy

Instructor rationale, demonstration advice and facilitation material belong in `teaching-notes.md`.

Examples to remove from learner-facing pages:

- “Notes for whoever is running this”
- “Start with A versus D”
- “Ask the room what they notice”
- “This pair is useful because...”
- “From the front, run Stage 1 first”
- suggested discussion questions for the lecturer;
- comments explaining why the author designed the activity in a particular order.

The learner page should contain what the learner needs.

The teaching notes should contain what the instructor needs.

Do not blur the two.

---

## 21. Preserve sophistication

A concise interactive must not become a simplistic one.

When editing, do **not**:

- remove a distinction merely because it is technical;
- turn contested claims into certainties;
- erase methodological limitations;
- replace precise terminology with vague everyday language;
- remove critical comparison between levels or frameworks;
- convert a diagnostic into a rule;
- imply causation where only association is shown;
- collapse population and individual inference;
- collapse description and explanation;
- remove psychometric or measurement nuance;
- turn postgraduate content into introductory-level simplification;
- shorten every paragraph by a fixed percentage.

Instead:

> **Move depth to the point where it becomes useful.**

A long debrief can be excellent.

A long result card is usually suspicious.

A detailed disclosure can be valuable.

A detailed “Correct!” response usually is not.

---

## 22. Module-sensitive guidance

### Cognitive Psychology

Let learners experience the effect before explaining the mechanism.

Task instructions should be especially lean because cognitive demonstrations lose force when the result is explained in advance.

Priorities:

- preserve experimental distinctions;
- distinguish behaviour from mechanism;
- avoid anthropomorphic language unless it is the topic being examined;
- do not use long conceptual warnings before the demonstration;
- move theoretical comparison into debrief once the learner has experienced both sides.

### Research Methods

Preserve statistical and methodological precision.

Keep clear distinctions between:

- observation;
- diagnostic pattern;
- statistical consequence;
- inferential consequence;
- decision.

Do not turn diagnostics into rigid rules.

Prefer:

> Small sample. Do not diagnose the shape yet.

over:

> This plot is invalid because the sample is small.

Keep terms such as standard error, residual, homoscedasticity, leverage and coverage when they matter.

Explain them plainly.

### Neuropsychology

Preserve distinctions around:

- dissociation;
- selective impairment;
- route and network inference;
- profile comparison;
- severity;
- category versus mechanism;
- uncertainty.

Avoid clinical-textbook density during active comparison.

The learner should first see the separation.

Then discuss what kind of inference that separation supports.

Do not silently convert behavioural profiles into claims about single brain regions.

### Social & Critical Psychology

Preserve competing lenses and levels of analysis.

Concision must not turn critical reasoning into one “correct” ideological answer.

Keep distinctions between:

- observed procedure;
- inferred construct;
- alternative explanation;
- individual-level claim;
- group-level claim;
- institutional-level claim.

Where appropriate, use the reusable structure:

> **Observed**  
> **Possible inference**  
> **Not established**

Do not let the structure imply that only one interpretation is ever legitimate when the evidence remains contestable.

### Personality & Individual Differences

Preserve:

- psychometric nuance;
- dimensional thinking;
- threshold effects;
- impairment and functioning;
- clinical uncertainty;
- responsible safety boundaries.

Do not let disclaimers overwhelm the activity.

State essential safety framing briefly at the start.

Move fuller assessment caveats into optional depth or debrief.

Do not imply that a slider configuration is a diagnosis.

Do not remove the distinction between unusualness, distress, persistence, inflexibility and impairment.

---

## 23. Calibrated exemplars

The following five patterns define the intended style.

They are examples of **timing and hierarchy**, not phrases that must be copied mechanically.

### 23.1 Cognitive 12: Human Attention versus AI Attention

**Before**

The page explains at length, before the learner has seen the computation, why a transformer attention weight is not human noticing, caring or focusing.

**After**

> Psychology and AI both use the word *attention*. They do not mean the same thing.  
> In this activity, you will do both kinds on the same sentence and compare them.

After the human task:

> The last three words changed your answer.  
> Nothing around *it* changed.  
> **You used the sentence as a whole to resolve the pronoun.**  
> Now compare that with the machine-side operation.

**Rule illustrated:** experience the human and computational tasks first; deliver the full conceptual comparison later.

---

### 23.2 Research Methods 20: Homoscedasticity and Residual Diagnostics

**Before**

A live result explains the pattern, the coefficient, standard error, confidence interval, test behaviour and methodological qualification in one state.

**After**

> The residuals fan out.  
> The slope is still close to 0.50.  
> The classical standard error is too small.  
> **The estimate survives; the uncertainty does not.**

Optional depth can then explain why.

**Rule illustrated:** observation first; deeper inferential explanation later.

---

### 23.3 Neuropsychology 07: Aphasia Profile Comparator

**Before**

A pair comparison moves immediately from the numerical difference to a full route-versus-region argument.

**After**

> **This is a clean separation: repetition differs, while the rest of the profile barely does.**  
> That makes repetition the informative measure for this comparison.

Optional depth:

> Repetition can use a relatively direct route from heard sounds to spoken sounds. A selective repetition difference therefore supports a more specific inference than overall severity.

**Rule illustrated:** show the profile separation first; explain the route or network inference after the learner has seen it.

---

### 23.4 SCP 11: Measuring Prejudice

**Before**

Each instrument produces a dense four-part mini-essay covering observation, inference, confounds and unsupported conclusions.

**After**

> **Observed:** a difference in sorting speed.  
> **Possible inference:** one association was more accessible than another.  
> **Not established:** how this individual will behave.

Confounds sit in optional depth.

**Rule illustrated:** separate evidence from inference without forcing every qualification into the immediate result.

---

### 23.5 PID 55: Personality Disorder Continuum

**Before**

The tool opens with several paragraphs of diagnostic and clinical caveating, then keeps a long “what is still unknown” panel visible throughout the active task.

**After**

Opening:

> **Teaching tool only:** this is not a self-test and does not diagnose anyone.

During the comparison:

> Trait extremity did not move.  
> Flexibility, persistence and interference did.  
> **Same unusual traits. Very different clinical significance.**

Fuller assessment boundaries sit in optional depth.

**Rule illustrated:** state the essential safety boundary once; keep richer clinical caveats available without allowing them to dominate the interaction.

---

## 24. Revision workflow for Claude Code

When revising an existing interactive, follow this procedure.

### Step 1: Read the complete tool

Read:

- `index.html`;
- `tool.js`;
- `teaching-notes.md`;
- relevant metadata or configuration files.

Do not revise from the static HTML alone.

### Step 2: Identify the central teaching claim

Write down, privately, the one or two ideas the learner should carry away.

Examples:

- the estimate can survive while uncertainty fails;
- a selective behavioural separation supports a more specific inference than general severity;
- instrument output and construct are not identical;
- continuous profiles can change category when the threshold changes.

Use this to decide what deserves emphasis.

### Step 3: Trace the real learner journey

Follow the tool in order.

Include every state created dynamically by JavaScript.

Map:

- what the learner sees first;
- what they click;
- what appears after the click;
- what changes after each control;
- where new instructions appear;
- what feedback appears;
- what remains on screen;
- what disclosures open;
- what appears in the debrief.

Do not assume the source-file order matches the learner experience.

### Step 4: Classify the copy

Conceptually mark each learner-facing text unit as:

- ACTIVE;
- OPTIONAL DEPTH;
- LATER DEBRIEF;
- REMOVE / MOVE TO TEACHING NOTES.

Do not add these labels to the interface unless they genuinely belong there.

### Step 5: Find repetition before rewriting

Search the whole tool for repeated ideas.

Typical repeated ideas include:

- safety disclaimers;
- “what this cannot prove”;
- methodological caveats;
- interpretation boundaries;
- explanations of the same graph;
- “this is not a diagnosis”;
- “correlation does not predict the individual”;
- “the measure is not the construct”.

Choose the best home for each.

### Step 6: Rewrite active copy first

Start with:

- opening;
- task instructions;
- prediction;
- immediate feedback;
- result cards;
- slider and preset text;
- stage transitions;
- challenge feedback.

Make the interaction move.

Do not begin by polishing the debrief while leaving overloaded dynamic states untouched.

### Step 7: Consolidate caveats

For each important caveat, ask:

> Where does this do the most pedagogical work?

Put it there.

Do not preserve duplicates simply because they already exist in different files or functions.

### Step 8: Move instructor rationale

Move facilitator-only material into `teaching-notes.md`.

Do not delete useful instructor content merely because it does not belong on the learner page.

### Step 9: Preserve useful depth

After simplifying active states, make sure important content has not vanished.

Where appropriate, retain it in:

- disclosure;
- debrief;
- limitations;
- teaching notes.

This is a redistribution pass, not a deletion contest.

### Step 10: Run the interaction

Use the tool as a learner.

Read every dynamic state in context.

Ask:

- Does the page keep moving?
- Does a click reveal too much?
- Is the explanation arriving at the right time?
- Is the interface already showing what the prose says?
- Is a caveat repeated?
- Does the debrief now feel earned?

### Step 11: Re-read the full copy as one experience

A tool may contain individually good sentences and still feel repetitive in sequence.

Read from top to bottom.

Pay special attention to transitions such as:

> feedback → new instruction → result → disclosure

These are common overload points.

### Step 12: Preserve behavioural and technical correctness

Do not change:

- calculations;
- scoring;
- branching logic;
- labels whose wording is functionally tied to code;
- data meaning;
- accessibility semantics;
- safety behaviour;

unless the task explicitly includes those changes.

When changing a dynamic string, confirm that placeholders and interpolated values still work.

---

## 25. Practical editing heuristics

Use these as judgement aids.

### If a paragraph appears immediately after a click

Assume it is too long until proven otherwise.

Ask what single idea must survive.

### If a paragraph begins “What this does not mean...”

Search for the same caveat elsewhere before keeping it.

### If the result card contains more than one “because”

It may be doing debrief work.

### If instructions contain “because”

Consider whether the explanation should come after the action.

### If a result describes every visible value

Cut it to the relationship between the values.

### If the learner is told the same conceptual warning at the top and bottom

Keep the stronger version and change the other section's job.

### If a disclaimer is longer than the opening hook

Check whether methodological nuance has been mistaken for necessary safety framing.

### If an incorrect-answer response explains three alternative methods

Move the alternatives later unless choosing between them is the point of the question.

### If every dynamic state ends with a caveat

Consolidate the caveat.

### If the debrief reads like a transcript of the interaction

Rewrite it as synthesis.

---

## 26. Copy-density guidance

These ranges are **warning thresholds, not rigid templates**.

| Copy type | Typical range |
| --- | --- |
| Opening hook | roughly 20–45 words |
| Learning objective | normally 1 sentence, roughly 15–30 words |
| Pre-task instruction | normally 1–3 short sentences |
| Prediction feedback | roughly 15–40 words |
| Live result | normally 20–50 words |
| Immediate feedback | one principal idea |
| Debrief | may be substantially longer after interaction |

A brilliant five-word result should not be padded to twenty words.

A genuinely necessary 60-word explanation is acceptable if that is the right pedagogical moment.

Do not rewrite to a quota.

Use the ranges to notice when a dynamic state has quietly turned into an essay.

---

## 27. What not to optimise for

Do not optimise for:

- shortest possible page;
- lowest word count;
- identical box lengths;
- identical sentence structures;
- simplified vocabulary at all costs;
- cheerful tone;
- maximum friendliness;
- maximum explanation;
- mechanically consistent feedback length;
- fixed percentage reductions.

The goal is a better **learning rhythm**.

A long page with strong hierarchy can work very well.

A short page can still feel exhausting if every action triggers another explanation.

---

## 28. QA checklist

Before completing a copy revision, check the entire learner journey.

### Orientation

- Can I understand what to do within a few seconds?
- Is the opening about the interesting problem rather than the author's rationale?
- Is the learning objective focused on the central intellectual move?
- Is essential safety framing brief and clear?

### Active task

- Are instructions telling me what to do rather than explaining the result in advance?
- Does pressing a button reveal an essay?
- Does immediate feedback contain more than one main idea?
- After something interesting happens, does the copy let me continue?
- Is a result panel mixing observation, mechanism, caveat and literature discussion?
- Is dynamic JavaScript-generated copy as carefully edited as the static HTML?

### Trusting the interface

- Am I being told something the graph, animation, profile or simulation already shows?
- If I am repeating visible information, am I directing attention to a meaningful relationship?
- Could the visual interaction carry more of the teaching?

### Repetition and caveats

- Has the same caveat appeared somewhere else?
- Does this qualification have one sensible home?
- Is this necessary safety framing, useful methodological nuance or defensive over-explanation?
- Have I repeated “what this does not show” in the opening, feedback, debrief and limitations?

### Timing

- Is the explanation arriving before the learner could discover the result?
- Have I explained why a manipulation matters before the learner tries it?
- Could this mechanism move to optional depth?
- Could this interpretation wait until the debrief?

### Feedback

- Does each feedback box have one intellectual job?
- Does correct/incorrect feedback focus on the distinction being tested?
- Does feedback direct the learner towards the next useful action?
- Are repeated state updates genuinely different enough to justify separate prose?

### Instructor versus learner copy

- Is instructor-facing material visible to students?
- Are facilitator prompts, demonstration advice or author rationale still in the learner page?
- Should any of this move to `teaching-notes.md`?

### Debrief

- Does the debrief synthesise rather than replay?
- Does it connect the learner's observations into a larger argument?
- Does it preserve the important methodological or theoretical distinction?
- Are limitations adding something new?

### Intellectual quality

- Have I preserved technical terminology where it matters?
- Have I preserved uncertainty where the evidence is uncertain?
- Have I preserved competing interpretations where they matter?
- Have I accidentally turned a diagnostic into a rule?
- Have I collapsed observation into inference?
- Have I collapsed group-level evidence into individual-level claims?
- Have I removed a difficult idea merely because it was difficult?
- Does the tool still sound intelligent?

### Voice

- Would a good lecturer actually say this aloud?
- Does the copy sound confident enough not to qualify every sentence?
- Is it natural without becoming generic?
- Is there a strong conceptual sentence where one has been earned?
- Have I avoided manufacturing slogans where none are needed?

### Final learner-flow check

Read the interaction from beginning to end and ask:

> **Does this now feel like short setup → do something → notice something → brief explanation → continue?**

If not, keep editing.

---

## 29. Final instruction to the revising model

Do not treat this guide as a request to “make the copy shorter”.

Treat it as a request to **rebuild the hierarchy of explanation**.

Preserve the psychology.

Preserve the methodological distinctions.

Preserve the interesting complications.

But put each piece of explanation where it does the most teaching.

During the interaction:

> **say what matters, then let the learner act.**

After the learner has experienced the phenomenon:

> **give the nuance somewhere it can actually be understood.**

### Accessibility exception

Do not remove or substantially weaken text that provides a non-visual equivalent for a chart, diagram, animation or other visual result.

Accessibility text is not redundant simply because a sighted learner can see the same information.

Distinguish between:

- **visible learner-facing prose that unnecessarily narrates a visual**, which may be shortened; and
- **accessible text equivalents, tables, captions, `aria` content or screen-reader descriptions**, which must preserve the information needed to understand the result without seeing it.

Do not hide, remove or weaken important accessibility information merely to reduce apparent word count.

---

### Scope of this pass

This is primarily a **learner-copy and information-hierarchy pass**.

Do not redesign a working interaction, replace controls, change data visualisations, alter task sequencing or introduce new functionality simply because different copy might support a different design.

Small structural changes are appropriate when they improve hierarchy without changing the interaction itself. Examples include:

- moving existing prose into an existing disclosure or debrief;
- consolidating repeated caveats;
- moving instructor-facing material into `teaching-notes.md`.

If a tool appears to require substantial UX redesign rather than copy revision, **flag it separately rather than redesigning it during this pass**.