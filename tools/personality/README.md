# tools/personality/

Interactives for the **Personality and Individual Differences** collection live
here, one folder per tool.

**This folder is currently empty.** No personality interactive has been built
yet. The collection page at `collections/personality/index.html` describes the
planned scope.

## Folder convention

Each interactive is a self-contained folder named with a short, lowercase,
hyphenated slug that matches its `id` in `data/catalogue.json`:

```
tools/personality/
└── reliability-and-attenuation/
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
4. Add an entry to the `personality` collection's `interactives` array in
   [`../../data/catalogue.json`](../../data/catalogue.json). The collection page
   picks it up from there — no HTML edit is needed to list it.

## Questionnaire items: a hard rule

Tools in this collection often need scale items. Use only public-domain or
openly licensed item pools, and record the source in the tool's README.
**Do not reproduce commercial inventories**, in whole or in part, even as
"examples". If a tool collects self-report answers, they stay in the browser
tab: no storage, no transmission, and a plain statement on the page that the
result is a classroom illustration and not an assessment.

## Planned topics

Trait structure and the Big Five · factor analysis · reliability · validity and
measurement error · reading a trait profile.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
