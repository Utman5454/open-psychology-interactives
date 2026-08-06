# tools/neuropsychology/

Interactives for the **Neuropsychology** collection live here, one folder per
tool.

**This folder is currently empty.** No neuropsychology interactive has been
built yet. The collection page at `collections/neuropsychology/index.html`
describes the planned scope.

## Folder convention

Each interactive is a self-contained folder named with a short, lowercase,
hyphenated slug that matches its `id` in `data/catalogue.json`:

```
tools/neuropsychology/
└── stroop-interference/
    ├── index.html      the page itself
    ├── tool.js         the logic for this interactive
    ├── tool.css        styling specific to this interactive (optional)
    └── README.md       one paragraph: what it teaches, and how it was checked
```

Self-contained means the folder can be copied out of this repository and still
work, as long as `assets/css/main.css` and the two `components/` files travel
with it. Nothing is fetched from a CDN and nothing is bundled.

## Adding one

1. Read [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) for the full checklist.
2. Read [`../../docs/adapting-a-tool.md`](../../docs/adapting-a-tool.md) for the
   interactive-shell markup contract.
3. Create the folder, build the page against the shell.
4. Add an entry to the `neuropsychology` collection's `interactives` array in
   [`../../data/catalogue.json`](../../data/catalogue.json). The collection page
   picks it up from there — no HTML edit is needed to list it.

## Extra requirements for timed tasks

Reaction-time paradigms carry obligations that other tools do not. Every timed
interactive here must:

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

See [`../../docs/accessibility.md`](../../docs/accessibility.md).

## Planned topics

Classic attention tasks · working memory and span · dissociation logic ·
executive function · interpreting deficits.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
