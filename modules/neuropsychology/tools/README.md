# modules/neuropsychology/tools/

<!-- PUBLISHED:START -->
| Tool | Folder | Topic |
| --- | --- | --- |
| Double Dissociation Detective | [`01-double-dissociation-detective/`](01-double-dissociation-detective/) | Single and double dissociations: what a crossover rules out, what measurement precision permits, and where task impurity defeats both |
| Lesion-Symptom Inference Trap | [`02-lesion-symptom-inference-trap/`](02-lesion-symptom-inference-trap/) | Why 'damage here, difficulty there' is not 'this region does that': lesion extent, vascular territory, diaschisis, premorbid level, co-occurring damage and task demands |
| Network Disconnection Mapper | [`03-network-disconnection-mapper/`](03-network-disconnection-mapper/) | Disconnection: why a deficit can follow from a cut pathway between intact regions, and why the same profile can have several different causes |
| Visual Neglect Laboratory | [`04-visual-neglect-line-bisection/`](04-visual-neglect-line-bisection/) | Neglect against field loss, and viewer-centred against object-centred neglect: the task signatures that separate them and what cueing fixes |
| Visual Field Defect Mapper | [`05-visual-field-defect-mapper/`](05-visual-field-defect-mapper/) | Predicting field loss from a point on the visual pathway - and finding out how little the pattern can say in reverse |
| Memory Systems Detective | [`06-memory-systems-amnesia-detective/`](06-memory-systems-amnesia-detective/) | When a memory profile supports a distinction between systems, when it counts against one, and the twelve times out of twenty-five that it cannot decide |
| Aphasia Profile Comparator | [`07-aphasia-profile-comparator/`](07-aphasia-profile-comparator/) | Which piece of language evidence separates two profiles, why repetition is disproportionately informative, and why the classical categories are prototypes |
| Executive Function Task Laboratory | [`08-executive-function-task-laboratory/`](08-executive-function-task-laboratory/) | Why no executive task is pure, why a low score identifies nothing on its own, and what a summary score hides about strategy |
| Split-Brain Laboratory | [`09-hemispheric-lateralisation-split-brain/`](09-hemispheric-lateralisation-split-brain/) | Why the split-brain findings are about routing rather than about what each hemisphere is for, and what the classic demonstration quietly depends on |
| Face Recognition Detective | [`10-face-recognition-prosopagnosia-detective/`](10-face-recognition-prosopagnosia-detective/) | Why recognising someone is several separable steps, how a voice task decides whether a difficulty is about faces, and when a profile has no answer |
| Assessment Battery Builder | [`11-neuropsych-assessment-battery-builder/`](11-neuropsych-assessment-battery-builder/) | Why a battery is chosen from the referral question, and why the measures that answer no question at all are the ones that make the rest interpretable |
| Recovery and Plasticity Simulator | [`12-recovery-plasticity-simulator/`](12-recovery-plasticity-simulator/) | Why four different processes all look like getting better, and what evidence separates recovered function from a better strategy |

<!-- PUBLISHED:END -->

Tools for the **Neuropsychology** module live here, one folder per tool.

Twelve tools are published; they are listed above.
The module page at `modules/neuropsychology/index.html` describes the planned
scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/neuropsychology/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record (see CLAUDE.md metadata standard)
└── teaching-notes.md   educator guidance (see CLAUDE.md teaching-notes standard)
```

Tool-specific CSS and JavaScript live in the same folder — `tool.css` and
`tool.js` are the usual names. Self-contained means the folder can be copied
out of this repository and still work, provided `assets/css/main.css` and the
two `components/` files travel with it. Nothing is fetched from a CDN and
nothing is bundled.

A tool page sits four levels below the repository root, so shared assets are
referenced as `../../../../assets/css/main.css`.

## Adding one

1. Read [`../../../CONTRIBUTING.md`](../../../CONTRIBUTING.md) for the full
   checklist.
2. Read [`../../../docs/adapting-a-tool.md`](../../../docs/adapting-a-tool.md)
   for the interactive-shell markup contract and a working skeleton.
3. Create the folder and build the page against the shell.
4. Write `metadata.json` and `teaching-notes.md`.
5. Add the same record to the `neuropsychology` module's `tools` array in
   [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Extra requirements for timed tasks

Reaction-time paradigms carry obligations that other tools do not. Every timed
tool here must:

- be fully operable from the keyboard, with keys stated on screen before the
  block starts;
- offer an untimed practice mode, and let the student leave a block at any
  point without losing the explanation;
- provide a non-timed route to the same concept, so a student who cannot
  complete the task still meets the idea;
- honour `prefers-reduced-motion` — no flashing, and nothing that flickers
  faster than three times per second (WCAG 2.3.1);
- state plainly on the page that it is a demonstration of a paradigm run in
  uncontrolled conditions, not an assessment of the person using it.

## Extra requirements for brain–behaviour claims

- Avoid crude one-region–one-function statements where network or
  disconnection accounts are the better explanation.
- Make clear what a dissociation licenses you to conclude, and what it does not.
- Use fictional or clearly labelled illustrative cases; do not present
  simulated patient data as real.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md).

## Planned topics

Classic attention tasks · working memory and span · dissociation logic ·
executive function · interpreting deficits.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
