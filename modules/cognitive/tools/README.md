# modules/cognitive/tools/

Tools for the **Cognitive Psychology** module live here, one folder per tool.

**This folder is currently empty.** No cognitive psychology tool has been built
yet. The module page at `modules/cognitive/index.html` describes the planned
scope.

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
