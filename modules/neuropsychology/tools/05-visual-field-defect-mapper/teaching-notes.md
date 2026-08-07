# Teaching notes — Visual Field Defect Mapper

`modules/neuropsychology/tools/05-visual-field-defect-mapper/`

The visual pathway is the tidiest structure-to-function mapping in the nervous
system. It is worth learning, and it is a terrible model for everything else —
which is why the tool ends by showing what the pattern still cannot tell you.

---

## Intended level

First-year undergraduate. No prior anatomy is assumed; two facts are stated in
the opening panel and everything else is derived from them. It works as a
gentle entry point to the module before the harder inference tools.

## Learning objectives

After the activity a student should be able to:

1. predict the field consequence of damage in front of, at and behind the
   chiasm;
2. explain why only *half* the fibres crossing is what makes a field pattern
   informative;
3. read a field chart for the one thing it reliably says — which side of the
   chiasm the damage is on;
4. list the points on the pathway compatible with a complete homonymous
   defect, and say why the pattern cannot choose between them;
5. say why the quadrant diagrams are a teaching fiction.

## Estimated duration

- **Demonstration from the front:** 10 minutes for all six points.
- **Students in pairs:** 20 minutes, predicting before each reveal.
- **With the challenge and debrief:** 30 minutes.

## Preparation

None. Read the "not an eye test" panel aloud — students routinely try to check
their own vision against the diagrams, and the diagrams cannot support that.

## The demonstration worth doing from the front

Work the first three points in order and say almost nothing.

1. **Left optic nerve.** One eye, entirely. Nothing has crossed yet.
2. **Centre of the chiasm.** The outer half of each eye. Ask *which halves of
   the world are those?* — they are opposite halves, which is why this pattern
   cannot be produced by anything behind the chiasm.
3. **Right optic tract.** The same half of the world in both eyes.

After those three, most rooms can derive the two radiation cases unaided. Ask
them to predict before you select.

Then do the demonstration the tool is really for: put **right optic tract** and
**right occipital cortex** side by side in the summary table. In quadrant terms
they are the same row. Say: *the field chart says which side and that the
damage is behind the chiasm. It stops there.*

## Prediction question

> Which fibres cross at the chiasm, and what do they carry?

The intended answer: the fibres from the **nasal half of each retina**, which
see the **outer (temporal) half** of that eye's field. Most students who get
this wrong have the retina and the field the right way round for one eye and
the wrong way round for the other, and working case 2 usually fixes it.

## Activity sequence

1. **Commit to the opening judgement.**
2. **Left optic nerve** — predict, reveal, read.
3. **Centre of the chiasm** — predict, reveal, read.
4. **Right optic tract** — predict, reveal, read.
5. **The two halves of the radiation** — students should now be getting 8 of 8.
6. **Right occipital cortex** — and the identity with case 3.
7. **The challenge**: four of eight points are compatible.

## Debrief questions

1. Why does a defect confined to one eye have to be in front of the chiasm?
2. Why is a bitemporal pattern impossible from damage behind the chiasm?
3. Adding the two radiation cases together gives the tract case. What does that
   tell you about inferring a location from a field pattern?
4. Four points produce a complete left homonymous defect. What evidence — not
   from the field chart — would narrow it?
5. The tool draws quadrants as present or absent. What does a real field
   examination measure instead, and what is lost by simplifying it?
6. This mapping is unusually orderly. What is the risk of treating it as a
   model for how brain structure relates to function generally?

## Likely misconceptions

| What students say | What to do with it |
| --- | --- |
| "Everything crosses, so each hemisphere gets one eye." | Then a defect behind the chiasm would look like a defect in front of it, and a field chart would tell you nothing. |
| "Temporal retina sees the temporal field." | Retina and field are mirror images. The nasal retina looks outwards. |
| "A hemianopia means the occipital lobe." | Four points produce it. That is the challenge. |
| "Macular sparing proves it is cortical." | A clue, not proof, and its explanation is still argued about. |
| "The field chart localises the lesion." | It localises the *side*, and says behind or in front of the chiasm. Imaging does the rest. |
| "So the person sees a black rectangle." | Many people are unaware of a hemianopia until they bump into something. Field loss and awareness of it are separate. |
| "Real defects look like these diagrams." | They have soft edges, vary in depth, and rarely respect a quadrant boundary. |

## Limitations and cautions

- **Not an eye test.** Nothing on the page examines anybody's vision, and no
  result means anything about the person using it.
- **Not a diagnosis.** No cause is named anywhere. Real interpretation uses
  acuity, pupil responses, the rest of the examination and imaging.
- **Idealised mappings.** Textbook one-to-one correspondences. Real lesions are
  partial and produce incomplete, asymmetric defects far more often.
- **A schematic, not an atlas.** Nothing is to scale and the layout carries no
  spatial meaning.
- **Macular sparing is contested.** Included because it is universally taught;
  the tool says its explanation is unsettled.

## Accessibility considerations

- Native radio, checkbox and button controls. The eight prediction checkboxes
  sit in two 2×2 grids to keep the control column short; each target keeps its
  full 2.75rem height.
- Both graphics are `aria-hidden` and paired with visible tables — a
  quadrant-by-quadrant table giving prediction against mapping for all eight
  cells, and a summary table of every point on the pathway.
- Nothing depends on colour. A lost quadrant carries a printed **cross**, a
  predicted quadrant a **dot**, the damage marker is a **circled cross**, the
  crossing fibres are **dashed**, and the two sides of the brain are labelled
  **L** and **R**.
- Changing a prediction after a reveal **withdraws** the reveal, so a marked
  result can never be stale.
- Reveals and site changes announce through the polite live region.
- The pinned primary is about 420px at 1366×768 — larger than most in this
  module because it carries two graphics, and still comfortably inside the
  practical maximum. Verified at 1366×768, 375×812 and 320×720 with no
  horizontal page scroll.

## Optional extension tasks

1. **Junctional defects.** Look up what happens at the junction of the optic
   nerve and the chiasm, and why the anatomical explanation for it is disputed.
2. **Congruity.** Find out what congruity means and why a defect from the tract
   is usually less congruous than one from the cortex.
3. **Add a point.** What field pattern would damage to the *left* temporal
   radiation give? Predict it, then check against the logic.
4. **Blindsight.** Read about residual visual function in a cortically blind
   field. What does it suggest about the pathways this diagram omits?
5. **Draw the real thing.** Find an example of a perimetry chart and list every
   way it differs from the quadrant diagrams here.

## The model

Field quadrants are coded per eye as upper-left, lower-left, upper-right and
lower-right of that eye's own field.

| Damage at | Left eye's field | Right eye's field | Usual description |
| --- | --- | --- | --- |
| Left optic nerve | the whole field | nothing lost | Loss of vision in the left eye only |
| Centre of the chiasm | upper-left, lower-left | upper-right, lower-right | Loss of the outer half of each eye's field |
| Right optic tract | upper-left, lower-left | upper-left, lower-left | Loss of the left half of the world in both eyes |
| Right temporal radiation | upper-left | upper-left | Loss of the upper-left quadrant in both eyes |
| Right parietal radiation | lower-left | lower-left | Loss of the lower-left quadrant in both eyes |
| Right occipital cortex | upper-left, lower-left | upper-left, lower-left | The same, with the centre spared |

Rows 3 and 6 are identical in the first three columns. That is the tool's
argument, and the challenge turns on it.

### The challenge

Given a complete left homonymous defect with a sharp vertical border and no
other finding, **four of the eight options are compatible**: the right optic
tract, the right lateral geniculate nucleus, both halves of the right optic
radiation together, and the right occipital cortex. The four that are not: the
left optic nerve (one eye only), the centre of the chiasm (opposite halves of
the world), the right temporal radiation alone (upper quadrant only) and the
left occipital cortex (the mirror image).

## Citation and evidence notes

- Any standard neuroanatomy or neuro-ophthalmology text covers the mappings
  used here; they are long-established public knowledge rather than anybody's
  finding.
- **Horton and Hoyt (1991)** on the representation of the visual field in
  striate cortex, and the argument about macular sparing.
- **Leff (2004)** for a historical review of the macular sparing debate.
- **Kolmel (1988)** and **Zhang et al. (2006)** on how often real homonymous
  defects are complete and congruous, which is considerably less often than
  textbook diagrams imply.
- **Weiskrantz (1986)** on blindsight, for the extension task.

Full references are deliberately not embedded in the page, so the tool does not
appear to derive its fictional cases from any of them.
