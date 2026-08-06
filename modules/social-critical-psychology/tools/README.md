# modules/social-critical-psychology/tools/

Tools for the **Social and Critical Psychology** module live here, one folder
per tool.

**This folder is currently empty.** No social and critical psychology tool has
been built yet. The module page at
`modules/social-critical-psychology/index.html` describes the planned scope.

## Canonical tool structure

Each tool is a self-contained folder named with a short, lowercase, hyphenated
slug that matches its `toolSlug` in `data/catalogue.json`:

```
modules/social-critical-psychology/tools/<tool-slug>/
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
5. Add the same record to the `social-critical-psychology` module's `tools`
   array in [`../../../data/catalogue.json`](../../../data/catalogue.json).

The module page lists a tool only when its catalogue `status` is exactly
`"published"`, so a work in progress can be recorded without appearing on the
site as finished.

## Extra requirements for contested material

This module covers material where evidence, theory and politics are easily run
together. Tools here must keep them apart:

- Distinguish what was measured, in whom, and with what result, from the
  theoretical account offered for it.
- Where a construct or interpretation is contested, say so on the page. Do not
  present one position as a settled fact, and do not present a contested
  framework as a neutral description.
- Do not infer an individual's attitudes or characteristics from a group-level
  finding, and make that inferential limit explicit where a tool invites it.
- State the sample the evidence rests on, including its limits — WEIRD samples,
  a single cohort, one cultural context.
- Where a classic study is used, include its methodological and ethical
  criticisms as part of the material rather than as a footnote.
- Avoid stigmatising labels and caricatures of any group.

## Privacy requirements

- Do not ask for names, protected characteristics, health information or any
  other identifying detail.
- Do not score, label, diagnose or profile the person using the tool.
- Any response a student gives stays in the browser tab: nothing stored,
  nothing transmitted, and the page says so.
- Default to fictional data and fictional cases, clearly labelled as such.

See [`../../../docs/accessibility.md`](../../../docs/accessibility.md).

## Planned topics

Conformity and social influence · attitudes and what a measure captures ·
intergroup bias and its measurement · sampling, generalisability and WEIRD
samples · constructing the object of study.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
