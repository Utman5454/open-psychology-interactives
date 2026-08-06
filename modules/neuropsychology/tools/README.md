# modules/neuropsychology/tools/

Tools for the **Neuropsychology** module live here, one folder per tool.

**This folder is currently empty.** No neuropsychology tool has been built yet.
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
