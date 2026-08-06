# modules/research-methods/tools/

Tools for the **Research Methods** module live here, one folder per tool.

**This folder is currently empty.** No research methods tool has been built
yet. The module page at `modules/research-methods/index.html` describes the
planned scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/research-methods/tools/<tool-slug>/
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
5. Add the same record to the `research-methods` module's `tools` array in
   [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Extra requirements for statistical tools

- Distinguish the sample, the population, the model, the estimate and the
  uncertainty around it — in the interface, not only in the notes.
- Where randomisation matters, support a visible or documented seed so a
  demonstration can be reproduced in front of a class.
- Label simulated data as simulated. Never present generated numbers as norms,
  published effect sizes or validated cut-offs.
- Comment the educational model and any deliberate simplification in the source,
  and state the simplification on the page where a student could be misled.
- State what the tool does *not* demonstrate as explicitly as what it does.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md) for the
accessibility requirements every tool must meet, including the text or tabular
alternative that must accompany every chart.

## Planned topics

Sampling distributions · confidence intervals · p-values and significance
testing · correlation and regression · statistical power.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
