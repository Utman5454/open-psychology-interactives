# Open Psychology Interactives

Free, accessible, classroom-ready browser-based teaching tools for university
psychology, organised into five modules: **cognitive psychology**, **research
methods**, **neuropsychology**, **social and critical psychology**, and
**personality and individual differences**.

**Site:** <https://utman5454.github.io/open-psychology-interactives/>
*(live once GitHub Pages is enabled — see [Publishing](#publishing-with-github-pages))*

---

## Status

**Seventy-five tools published, across all five modules.**

| Module | Tools |
| --- | --- |
| Cognitive Psychology | 12 |
| Research Methods | 21 |
| Neuropsychology | 12 |
| Social and Critical Psychology | 12 |
| Personality and Individual Differences | 18 |

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

`data/catalogue.json` is the authoritative list of what is published.

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
│   └── interactive-shell.js       live region, reset wiring, slider labelling
├── modules/
│   ├── cognitive/
│   │   ├── index.html             module landing page
│   │   └── tools/                 one folder per tool (empty today)
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
├── data/catalogue.json            machine-readable index of what is published
├── docs/
│   ├── teaching-guide.md          using the tools in lectures, labs and revision
│   ├── accessibility.md           the WCAG 2.2 AA standard, testing, known gaps
│   └── adapting-a-tool.md         copying, changing and re-hosting a tool
├── CONTRIBUTING.md
└── LICENSE
```

Each tool will live at `modules/<module-slug>/tools/<tool-slug>/` and contain
`index.html`, `metadata.json` and `teaching-notes.md`.

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
