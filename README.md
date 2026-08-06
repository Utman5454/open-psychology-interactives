# Open Psychology Interactives

Free, accessible, classroom-ready browser-based teaching tools for **statistics**,
**personality and individual differences**, and **neuropsychology**.

**Site:** <https://utman5454.github.io/open-psychology-interactives/>
*(live once GitHub Pages is enabled — see [Publishing](#publishing-with-github-pages))*

---

## Status

**Scaffold stage. No interactives have been published yet.**

What exists today: the landing page, three collection pages, the shared
interactive shell that tools will be built on, and the documentation. The
collection pages describe their intended scope and say plainly that they are
empty. Nothing here is ready to use in a class yet.

All fifteen planned topics are unclaimed — see [Contributing](#contributing).

## What this is

Several ideas in a psychology degree are far easier to see than to be told. What
a sampling distribution does when you change *n*. Why an unreliable measure caps
the correlation it can produce. What a Stroop trial actually feels like. This
project builds small, single-purpose interactives for exactly those ideas.

Every tool is a plain web page:

- **No dependencies** — no React, no npm, no bundler, no build step.
- **No backend, no external API** — everything runs in the browser.
- **No accounts, no tracking, no cookies** — nothing a student does is recorded
  or transmitted.
- **Works offline** — download the folder and it still runs.
- **WCAG 2.1 AA** as a merge requirement, not a follow-up task.
- **MIT licensed** — reuse, edit and re-host without asking.

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
URLs, so the catalogue-driven listing on the collection pages does not run. The
pages detect this and keep their static content, so nothing appears broken —
you simply see the same "in preparation" text either way. Once interactives
exist, they will still open and work perfectly from disk; only the auto-generated
*listing* needs a server.

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

### Forking to your own site

Fork or copy the repository, enable Pages the same way, and your version appears
at `https://<your-username>/<your-repository>/`. Every internal link is relative,
so the site works under any project sub-path without any configuration. The only
absolute URLs are the `canonical` and Open Graph tags in each page's `<head>`,
which you should update to your own address.

## Repository layout

```
.
├── index.html                     landing page
├── .nojekyll                      switches off GitHub's Jekyll build
├── assets/
│   ├── css/main.css               design tokens, site chrome, cards, footer
│   └── js/main.js                 nav toggle, footer year, catalogue loading
├── components/
│   ├── interactive-shell.css      shared frame for every interactive
│   └── interactive-shell.js       live region, reset wiring, slider labelling
├── collections/
│   ├── statistics/index.html      collection landing pages
│   ├── personality/index.html
│   └── neuropsychology/index.html
├── tools/
│   ├── statistics/                one folder per interactive (all empty today)
│   ├── personality/
│   └── neuropsychology/
├── data/catalogue.json            machine-readable index of what is published
├── docs/
│   ├── teaching-guide.md          using the tools in lectures, labs and revision
│   ├── accessibility.md           the standard, how it is tested, known gaps
│   └── adapting-a-tool.md         copying, changing and re-hosting a tool
├── CONTRIBUTING.md
└── LICENSE
```

`data/catalogue.json` is the single source of truth for what has been published.
Adding an entry there is what makes a tool appear on its collection page; the
page's HTML does not need editing.

## Documentation

- **[Teaching guide](docs/teaching-guide.md)** — using the interactives in
  lectures, labs and independent study, with collection-specific cautions.
- **[Accessibility](docs/accessibility.md)** — the standard every page is held
  to, how it is checked, and what is still missing.
- **[Adapting a tool](docs/adapting-a-tool.md)** — copying a tool for your own
  course, the interactive shell's markup contract and JavaScript API, and
  hosting your version.
- **[Contributing](CONTRIBUTING.md)** — ground rules, folder conventions and the
  pre-merge checklist.

## Contributing

Contributions are welcome, and not only code: bug reports, clearer wording,
testing with assistive technology, and suggestions for tools are all useful.

If you want to build an interactive, **open an issue first** saying which topic
you are taking. Then read [CONTRIBUTING.md](CONTRIBUTING.md) for the folder
layout and the checklist, and [docs/adapting-a-tool.md](docs/adapting-a-tool.md)
for the shell's API and a working skeleton to copy.

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
