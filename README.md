# Open Psychology Interactives

Free, accessible, classroom-ready browser-based teaching tools for university
psychology, organised into five modules: **cognitive psychology**, **research
methods**, **neuropsychology**, **social and critical psychology**, and
**personality and individual differences**.

**Site:** <https://utman5454.github.io/open-psychology-interactives/>
**Simplified Edition:**
<https://utman5454.github.io/open-psychology-interactives/simplified/>

---

## Status

**Seventy-five tools published, across all five modules, each with a shorter
Simplified Edition twin. 150 activities in total.**

| Module | Tools | Simplified twins |
| --- | --- | --- |
| Cognitive Psychology | 12 | 12 |
| Research Methods | 21 | 21 |
| Neuropsychology | 12 | 12 |
| Social and Critical Psychology | 12 | 12 |
| Personality and Individual Differences | 18 | 18 |
| **Total** | **75** | **75** |

Cognitive covers covert orienting, visual search, inattentional and change
blindness, the attentional blink, interference, selection, dual-task cost,
working-memory load, false memory and source monitoring, framing, and a
comparison between human attention and what "attention" names in a transformer.
Research Methods runs from question-to-method fit, operationalisation,
confounding and sampling through reflexive thematic analysis to distribution,
sampling, inference, uncertainty, effect size, power, the general linear model
and multiplicity. Neuropsychology teaches inference from lesion evidence:
dissociation logic, disconnection, neglect, visual fields, memory systems,
aphasia profiles, executive demands, lateralisation, face recognition,
assessment design and recovery. Social and Critical pairs mainstream social
psychology with critical analysis: epistemology, category construction, the
attitude–behaviour gap, conformity, the self, discourse, norm formation,
minimal groups, crowds, power, prejudice measurement, and person versus setting.
Personality and Individual Differences covers trait structure and facets,
person–situation interaction, states versus traits, factor rotation,
reliability, response styles, intelligence-test construction, culture-fair
testing, behaviour genetics, gene–environment interaction, explanation and
underdetermination, and self-esteem dynamics.

Each tool is a self-contained page with teaching notes.

`data/catalogue.json` is the authoritative list of what is published in the
original edition; `data/catalogue-simplified.json` is its counterpart for the
Simplified Edition.

### Release history

| Date | Release |
| --- | --- |
| 2026-08-27 | **Simplified Edition**, 75 shorter twins across all five modules, with its own landing and module pages, a generated catalogue, and pairing, answer-balance and lint gates. |
| 2026-08 | **Seventy-five tools**, the original edition complete across all five modules. |

## What this is

Several ideas in a psychology degree are far easier to see than to be told. What
a sampling distribution does when you change *n*. Why an unreliable measure caps
the correlation it can produce. What a Stroop trial actually feels like. This
project builds small, single-purpose tools for exactly those ideas.

Every tool is a plain web page:

- **No dependencies** — no React, no npm, no bundler, no build step.
- **No backend, no external API** — everything runs in the browser.
- **No accounts, no tracking, no cookies** — nothing a student does is recorded
  or transmitted.
- **Works offline** — download the folder and it still runs.
- **WCAG 2.2 AA** as a merge requirement, not a follow-up task.
- **MIT licensed** — reuse, edit and re-host without asking.

## The five modules

| Module | Slug | Scope |
| --- | --- | --- |
| [Cognitive Psychology](modules/cognitive/index.html) | `cognitive` | Attention, working memory, reconstructive memory, perception, judgement |
| [Research Methods](modules/research-methods/index.html) | `research-methods` | Sampling distributions, confidence intervals, p-values, correlation, power |
| [Neuropsychology](modules/neuropsychology/index.html) | `neuropsychology` | Attention and executive paradigms, span, dissociation logic, interpreting deficits |
| [Social and Critical Psychology](modules/social-critical-psychology/index.html) | `social-critical-psychology` | Social influence, attitude measurement, intergroup bias, generalisability, contested constructs |
| [Personality and Individual Differences](modules/personality-individual-differences/index.html) | `personality-individual-differences` | Trait structure, factor analysis, reliability, validity, profile interpretation |

The slugs are canonical: they are the folder name, the CSS modifier and the
`moduleSlug` in the catalogue.

## Two editions

Every topic exists twice, at two lengths. The activities are twins, not
duplicates: the same underlying model, taught at a different scale.

| | Original edition | Simplified Edition |
| --- | --- | --- |
| **Length** | 15 to 30 minutes | 3 to 7 minutes |
| **Teaching jobs** | several, built up in stages | one |
| **Where** | [`modules/`](modules/) &middot; [site root](https://utman5454.github.io/open-psychology-interactives/) | [`simplified/`](simplified/) &middot; [`/simplified/`](https://utman5454.github.io/open-psychology-interactives/simplified/) |
| **Catalogue** | `data/catalogue.json` | `data/catalogue-simplified.json` |
| **Count** | 75 | 75 |

**The original edition** is the full treatment: more stages, more controls, and
the challenge and transfer tasks the shorter version leaves out. It is the
right choice for a lab session or independent study.

**The Simplified Edition** is a shorter, focused twin of each original. Each
one keeps the working model from its full-length version and cuts the lesson
around it: the simulation stays a simulation and a manipulable model stays
manipulable, and what was removed is the number of things being taught at once.
The learner predicts something, changes something, sees what follows, and reads
a short account of what it did and did not show. There is one idea to take away
rather than five. Each activity names its full-length twin and links to it.

The pairing is exact and enforced: every original has one simplified twin and
every twin names one original, checked on every build by
`scripts/check-edition-pairing.py`.

Both editions are self-contained pages with teaching notes, work offline, and
carry the same accessibility standard. Neither depends on the other at runtime.

Maintaining the Simplified Edition is documented separately in
**[docs/simplified-edition-maintenance.md](docs/simplified-edition-maintenance.md)**.

## Using it locally

Nothing to install.

**Simplest route.** Download the repository (**Code → Download ZIP** on GitHub),
unzip it, and double-click `index.html`. Every page and link works from disk.

With Git:

```sh
git clone https://github.com/utman5454/open-psychology-interactives.git
cd open-psychology-interactives
```

Then open `index.html` in a browser.

**One caveat when opening from disk.** Browsers block `fetch()` on `file://`
URLs, so the catalogue-driven listing on the module pages does not run. The
pages detect this and keep their static content, so nothing appears broken:
every module page lists its published tools from its own markup. Tools
themselves open and work perfectly from disk; only the auto-generated *listing*
needs a server.

If you want the listing too, serve the folder over HTTP with anything you
already have:

```sh
python -m http.server 8000       # Python 3
npx serve .                      # Node, if you have it
php -S localhost:8000            # PHP
```

Then visit <http://localhost:8000>.

Because every path in the site is relative, the same files also work from a
university web server, a VLE file upload, or a USB stick.

## Publishing with GitHub Pages

The repository is ready to publish as-is; no workflow file or build step is
needed.

1. Push to GitHub.
2. **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Branch: **`main`**, folder: **`/ (root)`**. Save.
5. Wait a minute, then visit
   `https://utman5454.github.io/open-psychology-interactives/`.

### Why `.nojekyll`

The `.nojekyll` file at the repository root is required. Without it, GitHub runs
its Jekyll build over the site, which silently ignores any file or directory
whose name begins with an underscore. Keeping the file switches that step off
and publishes the repository exactly as it is. Do not delete it.

### The `404.html` exception

`404.html` is the only file that uses root-absolute paths beginning
`/open-psychology-interactives/`. GitHub Pages serves the error document at the
address that was *requested*, not at its own location, so relative paths inside
it would resolve against a mistyped deep URL and break. The reasoning is
documented at the top of the file.

### Forking to your own site

Fork or copy the repository, enable Pages the same way, and your version appears
at `https://<your-username>.github.io/<your-repository>/`. Every internal link
is relative, so the site works under any project sub-path without configuration.
Two things do need updating in a fork:

- the project prefix in `404.html`;
- the `canonical` and Open Graph tags in each page's `<head>`.

## Repository layout

```
.
├── index.html                     landing page, five module cards
├── 404.html                       error page (see note above)
├── .nojekyll                      switches off GitHub's Jekyll build
├── CLAUDE.md                      project rules and standards
├── assets/
│   ├── css/main.css               design tokens, site chrome, cards, footer
│   └── js/main.js                 nav toggle, footer year, catalogue loading
├── components/
│   ├── interactive-shell.css      shared frame for every tool
│   ├── interactive-shell.js       live region, reset wiring, slider labelling
│   ├── tool-kit.css               page furniture around the shell
│   ├── activity-fullscreen.js     the "Full screen" control (travels into copies)
│   ├── learner-help.js            the optional "Need a hand?" guide (16 tools)
│   └── copy-activity.js           the "Copy activity HTML" control (excluded from copies)
│                                  ("Download activity HTML" is a plain link and needs no script)
├── scripts/
│   ├── build-standalone.py        generates each tool's standalone.html
│   ├── add-export-control.py      adds the lecturer controls to a tool page
│   ├── build-simplified-catalogue.py   generates the Simplified Edition's index and pages
│   ├── check-edition-pairing.py   verifies the 1:1 pairing between editions
│   ├── test-edition-pairing.py    fault injection for that check
│   ├── check-answer-balance.py    answer position and wording-length gate
│   └── test-answer-balance.py     fault injection for that gate
├── modules/
│   ├── cognitive/
│   │   ├── index.html             module landing page
│   │   └── tools/                 one folder per tool
│   ├── research-methods/
│   │   ├── index.html
│   │   └── tools/
│   ├── neuropsychology/
│   │   ├── index.html
│   │   └── tools/
│   ├── social-critical-psychology/
│   │   ├── index.html
│   │   └── tools/
│   └── personality-individual-differences/
│       ├── index.html
│       └── tools/
├── simplified/                    the Simplified Edition (75 shorter twins)
│   ├── index.html                 GENERATED landing page
│   ├── assets/                    its own CSS and JS; shares nothing with the original
│   ├── template/                  scaffolding for a new activity, not an activity
│   └── modules/<slug>/
│       ├── index.html             GENERATED module page
│       └── tools/<slug>/          index.html, activity.js, metadata.json, teaching-notes.md
├── .oxlintrc.json                 lint gate for the Simplified Edition's JavaScript
├── data/
│   ├── catalogue.json             machine-readable index of the original edition
│   └── catalogue-simplified.json  GENERATED index of the Simplified Edition
├── docs/
│   ├── teaching-guide.md          using the tools in lectures, labs and revision
│   ├── accessibility.md           the WCAG 2.2 AA standard, testing, known gaps
│   ├── adapting-a-tool.md         copying, changing and re-hosting a tool
│   ├── simplified-edition.md      why the Simplified Edition exists, and its rules
│   ├── simplified-edition-maintenance.md   how to change it safely
│   └── simplified-edition-integration.md   how its browsing layer was built
├── CONTRIBUTING.md
└── LICENSE
```

Each tool lives at `modules/<module-slug>/tools/<tool-slug>/` and contains
`index.html`, `metadata.json`, `teaching-notes.md` and `standalone.html`.

`standalone.html` is generated, not written by hand. It is the embeddable copy
of that one activity. It is what **Copy activity HTML** puts on the clipboard
and what **Download activity HTML** saves as a file — the same bytes either
way: markup, styles, script and accessibility text in a single block, scoped to
a `.opi-activity` wrapper so it can be pasted into a VLE page without
disturbing what is already there. Rebuild the copies with

```sh
python scripts/build-standalone.py --all
```

and verify that none has gone stale — which happens whenever a tool or one of
the shared stylesheets changes — with

```sh
python scripts/build-standalone.py --all --check
```

which exits non-zero if any committed copy no longer matches its source. There
is no build step for the site itself; this is the only generated artefact, and
Python 3 is all it needs.

`data/catalogue.json` is the single source of truth for what has been published.
Adding an entry there is what makes a tool appear on its module page; the page's
HTML does not need editing. A tool is listed only when its `status` is exactly
`"published"`, so work in progress can be recorded without being presented as
finished.

## Documentation

- **[Teaching guide](docs/teaching-guide.md)** — using the tools in lectures,
  labs and independent study, with module-specific cautions.
- **[Accessibility](docs/accessibility.md)** — the WCAG 2.2 AA standard every
  page is held to, how it is checked, and what is still missing.
- **[Adapting a tool](docs/adapting-a-tool.md)** — copying a tool for your own
  course, the interactive shell's markup contract and JavaScript API, and
  hosting your version.
- **[The Simplified Edition](docs/simplified-edition.md)** — why the shorter
  edition exists, what was cut and what was kept.
- **[Simplified Edition maintenance](docs/simplified-edition-maintenance.md)** —
  directory structure, metadata and pairing, catalogue generation, the quality
  gates, and how to add or change an activity safely.
- **[Contributing](CONTRIBUTING.md)** — ground rules, folder conventions,
  metadata standard and the pre-merge checklist.
- **[CLAUDE.md](CLAUDE.md)** — the project's standing rules for structure,
  pedagogy, accuracy and privacy.

## Contributing

Contributions are welcome, and not only code: bug reports, clearer wording,
testing with assistive technology, and suggestions for tools are all useful.

If you want to build a tool, **open an issue first** saying which module and
topic you are taking. Then read [CONTRIBUTING.md](CONTRIBUTING.md) for the
folder layout, metadata standard and checklist, and
[docs/adapting-a-tool.md](docs/adapting-a-tool.md) for the shell's API and a
working skeleton to copy.

The ground rules in short: no dependencies, no backend, relative paths only,
nothing leaves the browser, no copyrighted media or commercial test material,
accessibility checked before merge, and never claim a tool exists before it
does.

## Licence

[MIT](LICENSE). Use these tools in your teaching, host them yourself, change
them, build on them — commercially or otherwise — without asking permission. The
only condition is that the copyright notice and licence text stay with any
substantial portion you reuse.

No photographs, stock images, fonts or third-party libraries are bundled here,
so there is no separate licence to check before reusing anything.

A credit line such as *"Adapted from Open Psychology Interactives"* with a link
back is appreciated but not required.
