# modules/cognitive/tools/

<!-- PUBLISHED:START -->
| Tool | Folder | Topic |
| --- | --- | --- |
| Posner Spatial Cueing | [`01-posner-spatial-cueing/`](01-posner-spatial-cueing/) | Spatial cueing: separating the benefit of a valid cue from the cost of an invalid one |
| Visual Search Laboratory | [`02-visual-search-laboratory/`](02-visual-search-laboratory/) | Feature and conjunction search: set size, search slopes, and what a slope does not prove |
| Inattentional Blindness | [`03-inattentional-blindness/`](03-inattentional-blindness/) | Inattentional blindness: attention, awareness, and a surprise that works exactly once |
| Change Blindness | [`04-change-blindness-flicker/`](04-change-blindness-flicker/) | Change blindness: what the blank interval does, and what it does not show |
| Attentional Blink | [`05-attentional-blink/`](05-attentional-blink/) | Attentional blink: the shape of the cost over time, and the accounts it cannot separate |
| Stroop Interference Laboratory | [`06-stroop-interference-lab/`](06-stroop-interference-lab/) | Stroop interference: what a neutral baseline adds, and what a difference score is not |
| Dichotic Listening and Selection Theories | [`07-dichotic-listening-selection/`](07-dichotic-listening-selection/) | Selective attention: what gets through from an ignored channel, and which theory each finding troubles |
| Dual-Task and Limited Capacity Laboratory | [`08-dual-task-capacity-lab/`](08-dual-task-capacity-lab/) | Dual-task costs: baselines, asymmetry, and why multitasking is not a trait |
| Working-Memory Load Laboratory | [`09-working-memory-load-lab/`](09-working-memory-load-lab/) | Working-memory load: storage, control and similarity are three different things |
| False Memory and Source Monitoring | [`10-false-memory-source-monitoring/`](10-false-memory-source-monitoring/) | False memory and source monitoring: recognition, confidence and source can disagree |
| Decision Framing Laboratory | [`11-decision-framing-laboratory/`](11-decision-framing-laboratory/) | Framing and reference dependence: identical arithmetic, two descriptions, different choices |
| Human Attention versus AI Attention | [`12-human-vs-ai-attention/`](12-human-vs-ai-attention/) | Human attention and transformer attention: one word, two different things |

<!-- PUBLISHED:END -->

Tools for the **Cognitive Psychology** module live here, one folder per tool.

Twelve tools are published; they are listed above. The module page at
`modules/cognitive/index.html` describes the scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/cognitive/tools/<tool-slug>/
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
5. Add the same record to the `cognitive` module's `tools` array in
   [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Extra requirements for performance tasks

Most tools in this module ask the student to *do* something and then show them
their own result. Those tools must:

- state plainly that the result is a demonstration of a paradigm run in
  uncontrolled conditions, and not a measurement of the person's attention,
  memory or ability;
- provide an untimed route to the same concept, so no student has to complete a
  speeded task to take part;
- be fully operable from the keyboard, with the keys stated on screen before a
  block begins;
- honour `prefers-reduced-motion`, and never flash more than three times per
  second (WCAG 2.3.1);
- keep every response in the browser tab — nothing stored, nothing transmitted.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md).

## Planned topics

Selective attention and its costs · working memory capacity · reconstructive
memory · perception as inference · judgement under uncertainty.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
