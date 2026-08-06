# tools/statistics/

Interactives for the **Statistics** collection live here, one folder per tool.

**This folder is currently empty.** No statistics interactive has been built
yet. The collection page at `collections/statistics/index.html` describes the
planned scope.

## Folder convention

Each interactive is a self-contained folder named with a short, lowercase,
hyphenated slug that matches its `id` in `data/catalogue.json`:

```
tools/statistics/
└── sampling-distribution/
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
4. Add an entry to the `statistics` collection's `interactives` array in
   [`../../data/catalogue.json`](../../data/catalogue.json). The collection page
   picks it up from there — no HTML edit is needed to list it.

## Planned topics

Sampling distributions · confidence intervals · p-values and significance
testing · correlation and regression · statistical power.

All are unclaimed. Open an issue before starting so two people do not build the
same thing.
