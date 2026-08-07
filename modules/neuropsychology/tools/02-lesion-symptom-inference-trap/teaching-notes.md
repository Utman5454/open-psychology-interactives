# Teaching notes — Lesion-Symptom Inference Trap

`modules/neuropsychology/tools/02-lesion-symptom-inference-trap/`

The inference "damage here, difficulty there, therefore this region does that"
has six things wrong with it, and they arrive one at a time.

---

## Intended level

First- or second-year undergraduate neuropsychology. It assumes nothing beyond
the idea that strokes damage tissue and that behaviour can be tested. It pairs
naturally with the Double Dissociation Detective, which handles the behavioural
side of the same inference, and with the Network Disconnection Mapper, which
handles what happens when the damage is to a pathway.

## Learning objectives

After the activity a student should be able to:

1. state what lesion evidence establishes — necessity, in a person, on a task —
   and what it does not;
2. name the six complications and say which claim each one attacks;
3. explain why vascular co-occurrence does not average out as a lesion sample
   grows;
4. distinguish deficits attributable to damaged tissue from deficits
   attributable to oedema and diaschisis;
5. explain why "comprehension is intact" is under-specified until you know how
   it was probed.

## Estimated duration

- **Demonstration from the front:** 12 minutes — reveal all six with commentary.
- **Students in pairs:** 25 minutes.
- **With the challenge and debrief:** 40 minutes.

## Preparation

None. Read the "localisation is not the villain" panel aloud first. Without it,
students reliably conclude that lesion studies are worthless, which is the
wrong lesson and a harder one to undo than the one being taught.

## The demonstration worth doing from the front

Read the referral. Ask the room for a confidence figure, out loud, before
touching the slider — most rooms land between 70 and 85. Set the slider there.

Then reveal the complications one at a time and say nothing except the heading.
Let the gap between the two bars do the work. Around complication 3 someone
will object that the ceiling is arbitrary. Agree immediately: it is a judgement,
it is stated to be one, and arguing about where it should sit is the exercise.

Stop on **complication 2** and make it explicit: strokes take the shape of the
vessel that failed, one vessel supplies several functionally distinct regions,
so those regions are damaged together in case after case. Then ask the killer
question — *does collecting more patients fix this?* It does not, because the
co-occurrence is systematic. That is the single most useful thing in the tool.

Stop on **complication 6** and ask what they would have concluded had formal
comprehension testing come first.

## Prediction question

> The referral describes effortful speech, apparently preserved comprehension,
> and damage centred on the left inferior frontal region. What does this case,
> as described so far, support?

The intended answer is *that tissue in the damaged area was necessary for
fluent speech output in this person*. The wording is the lesson: one person,
this occasion, these tasks, necessity rather than function.

## Activity sequence

1. **Commit to the opening inference** and to an initial confidence.
2. **Reveal complication 1** (lesion extent). Re-rate.
3. **Complication 2** (vascular territory). Re-rate. Discuss the sample-size
   question above.
4. **Complication 3** (oedema and diaschisis). Re-rate. Note that this one also
   predicts recovery without reorganisation.
5. **Complication 4** (premorbid level, handedness). Re-rate.
6. **Complication 5** (an older lesion). Re-rate.
7. **Complication 6** (task demands). Re-rate.
8. **Read the synthesis panel**, which lists what still stands.
9. **The challenge**: sort four claims by how well the case supports them.

## Debrief questions

1. Which of the six complications attacks the *specific* claim about this
   person, rather than the general one about the region?
2. Why does collecting a hundred more stroke patients not solve the vascular
   co-occurrence problem?
3. If a third of the deficit at two weeks is oedema and diaschisis, what does
   that predict about her performance at six months, and what would it be wrong
   to call that improvement?
4. She taught English for 38 years. Why does that make "comprehension appears
   good" harder rather than easier to interpret?
5. What single additional piece of evidence would move the ceiling most, and
   why?
6. Write the sentence you would actually put in a report about her, given
   everything on the table.

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "So lesion studies are useless." | The caution panel and the synthesis. Lesion evidence is one of very few sources of evidence about necessity, which imaging cannot supply. |
| "More patients would sort it out." | Complication 2. Vascular co-occurrence is systematic, not random noise. |
| "The scan shows what is damaged." | It shows structural damage. Diaschisis and oedema affect tissue the scan calls intact. |
| "She has intact comprehension." | Complication 6. Intact on which task, probed how? |
| "A region is either language or it isn't." | The lesion crosses whatever boundary was drawn on it, and the white matter underneath connects to regions that are not damaged at all. |
| "The ceiling numbers are the answer." | They are a teaching device and the page says so. Ask students to propose their own and defend them. |
| "Left-handed means language is on the right." | No. Language organisation is more *variable* in left-handers; most still have left-dominant language. The point is uncertainty, not reversal. |

## Limitations and cautions

- **The ceiling is not a calculation.** It encodes a judgement, is labelled as
  one in the tool, and is worth arguing with.
- **The map is a schematic.** Two rounded outlines and some labelled ellipses.
  Nothing is to scale, and no real scan, image or template is reproduced.
- **Person M does not exist.** No real patient, published case or clinical
  record is described. Nothing here diagnoses anybody or offers a prognosis.
- **No syndrome labels.** The case avoids classical aphasia categories on
  purpose; the tool is about the inference, not the naming.
- **One case is one case.** Nothing here says how often any complication
  matters, and no number on the page is a prevalence.

## Accessibility considerations

- Native range, radio and button controls throughout.
- The slider announces "70 per cent confident in the general localisation
  claim".
- The map is `aria-hidden` and paired with a table decoding every mark by
  letter, name and meaning. Marks carry letters, not just fills, and each
  letter has a page-coloured halo so it stays legible on any fill.
- The gauge is `aria-hidden`; both bars print their percentage, the overshoot
  is drawn as a dashed outline **and** stated in a sentence underneath.
- The confidence trace is `aria-hidden` and paired with a full step table; the
  two series are distinguished by marker shape (circles and squares) as well as
  by line style, and both are named in the axis caption.
- The pinned primary is 264px tall at 1366×768, so the map and gauge stay
  visible while the revealed-evidence list at the bottom of the control column
  is read. Verified at 1366×768, 1440×900, 1920×1080 and 375×812.
- Wide tables scroll inside their own containers; the page never scrolls
  sideways at 320px.

## Optional extension tasks

1. **Argue with the ceiling.** Propose your own seven numbers and justify each
   drop. Which complication deserves the largest?
2. **Design the converging study.** What three additional sources of evidence
   would you want, and what would each rule out?
3. **The imaging comparison.** A functional imaging study shows this region
   active during speech. What does that add, and what does it still not
   establish?
4. **Write two reports.** One for the notes, one for a paper. Note how much of
   the hedging survives the second.
5. **Find the artefact.** Take a published case summary and list what you would
   need to know before accepting its central dissociation.

## The model

The ceiling by step:

| Step | What has been revealed | Ceiling |
| --- | --- | --- |
| 0 | The referral only | 50% |
| 1 | The lesion is larger than its label | 40% |
| 2 | It follows a vascular territory | 32% |
| 3 | Oedema and diaschisis | 26% |
| 4 | Premorbid level and individual variation | 21% |
| 5 | A second, older lesion | 17% |
| 6 | The dissociation depended on the questions | 12% |

The gauge verdict thresholds: more than 20 points above the ceiling is called a
claim made on your own account; 6 to 20 points is a stretch; within 5 points
above to 10 below is described as proportionate; more than 10 below prompts the
reminder that the case does still support the specific claim.

The specific claim is never given a ceiling, because the whole point is that it
does not move. If a student asks why there is no second slider, that is the
answer, and it is a good question to have provoked.

## Citation and evidence notes

- **Rorden and Karnath (2004)** on what lesion mapping adds that functional
  imaging cannot, and on necessity versus involvement.
- **Mah, Husain, Rees and Nachev (2014)** on the systematic bias that vascular
  anatomy imposes on lesion-symptom maps, and why it does not average out.
- **Sperber and Karnath (2017)** on lesion size and location confounds in
  voxel-based lesion-symptom mapping.
- **von Monakow (1914)** for the original statement of diaschisis;
  **Carrera and Tononi (2014)** for the modern network reading of it.
- **Catani and ffytche (2005)** on disconnection syndromes and why the white
  matter under a cortical lesion is so often the relevant damage.
- **Knecht et al. (2000)** on the distribution of language lateralisation in
  left- and right-handers.
- **Caramazza (1986)** and **Shallice (1988)** on the logic of inference from
  single cases.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional case from any of them.
