# Contributing

Thank you for considering it. This project is for teaching staff and students,
and it gets better mainly through people who teach these topics adding the
demonstration they already run by hand.

> **Current status.** The repository holds the site scaffold: landing page,
> three collection pages, the shared interactive shell, and documentation. No
> interactives have been built yet. All fifteen planned topics are unclaimed.

---

## Ways to help

You do not have to write code to be useful.

| Contribution | What it looks like |
| --- | --- |
| **Report a problem** | Open an issue. Broken layout, unclear wording, an accessibility barrier — all valuable. |
| **Suggest a tool** | Open an issue describing the idea, the misconception it targets, and how you would use it in class. |
| **Improve the writing** | The explanations on these pages are the teaching. Clearer wording is a real contribution. |
| **Improve the documentation** | Especially the teaching guide, which needs input from people who have used tools like these in a real room. |
| **Test with assistive technology** | The most valuable thing currently missing. See [`docs/accessibility.md`](docs/accessibility.md). |
| **Build an interactive** | The main event. See below. |

## Before you start building

**Open an issue first.** Say which topic you intend to take, and roughly how you
plan to show it. This avoids two people building the same thing, and it is much
cheaper to reshape an idea in a comment thread than after the code is written.

Planned topics are listed on each collection page and in
[`data/catalogue.json`](data/catalogue.json). A topic that is not on those lists
is not thereby excluded — propose it.

## Ground rules

These are firm, and a pull request that breaks one will be asked to change
before it is merged.

1. **No dependencies.** Plain HTML, CSS and vanilla JavaScript. No React, no
   npm, no bundler, no TypeScript compile step, no CDN link, no external font.
   The project's central promise is that these pages still work in ten years and
   work with no internet connection.
2. **No backend, no external API.** Everything runs in the browser. If a tool
   needs data, that data is a small JSON file or an array in the source.
3. **Relative paths only.** The site is published under
   `/open-psychology-interactives/`, so any path starting with `/` breaks.
4. **Nothing leaves the browser.** No analytics, no telemetry, no cookies, no
   third-party requests. Student responses stay in the tab and are never stored
   or transmitted.
5. **No copyrighted media.** No photographs, stock images, icon fonts or clip
   art. Graphics are drawn with inline SVG, `<canvas>` or CSS. This keeps the
   whole repository reusable under one licence with nothing to check.
6. **No copyrighted test material.** Do not reproduce commercial personality
   inventories or neuropsychological test batteries, in whole or in part. Use
   public-domain or openly licensed item pools and record the source.
7. **Accessibility is a merge requirement.** WCAG 2.1 AA. Not a follow-up issue.
8. **Never claim a tool exists before it does.** Placeholder text says plainly
   what is not there yet. This matters: a lecturer who plans a seminar around a
   tool that turns out to be a stub has had their time wasted.

## Building an interactive

### 1. Decide the one idea

Write the sentence that will sit under the title before you write any code. If
it needs the word "and", you probably have two tools.

Then write down the misconception you expect to surface. The tool exists to make
that misconception visible and then untenable.

### 2. Create the folder

```
tools/<collection>/<tool-slug>/
├── index.html
├── tool.js
├── tool.css        (optional)
└── README.md
```

`<collection>` is `statistics`, `personality` or `neuropsychology`. The slug is
short, lowercase and hyphenated, and matches the `id` you will add to the
catalogue.

### 3. Build against the shared shell

[`docs/adapting-a-tool.md`](docs/adapting-a-tool.md) has the full markup
contract and JavaScript API for `components/interactive-shell.{css,js}`,
plus a working skeleton to copy. Use the shell: it is what makes every tool
behave consistently and handles the live region, reset wiring and slider
labelling that are easy to get subtly wrong.

Your page needs the standard site header, footer and skip link. Copy them from
`collections/statistics/index.html` and fix the relative depth — a tool page is
three levels deep, so assets are at `../../../`.

### 4. Register it in the catalogue

Add an entry to the matching collection's `interactives` array in
[`data/catalogue.json`](data/catalogue.json):

```json
{
  "id": "sampling-distribution",
  "title": "Sampling distribution of the mean",
  "path": "tools/statistics/sampling-distribution/index.html",
  "summary": "Draw repeated samples from a population you control and watch the distribution of the sample mean take shape.",
  "teaches": "Why a sample statistic varies, and how that variation shrinks with n.",
  "level": "Introductory",
  "duration": "5–10 minutes",
  "added": "2026-09-01"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Matches the folder name. |
| `title` | yes | Sentence case, no trailing full stop. |
| `path` | yes | Relative to the repository root; the site script resolves it per page. |
| `summary` | yes | One or two sentences, aimed at a lecturer deciding whether to open it. |
| `teaches` | no | The single idea, for maintainers and future indexes. |
| `level` | no | e.g. `Introductory`, `Intermediate`. Shown on the card. |
| `duration` | no | Realistic classroom time. Shown on the card. |
| `added` | no | ISO date. |

Adding the entry is what makes the tool appear on its collection page —
`assets/js/main.js` reads the catalogue and replaces the "nothing published yet"
placeholder. You do not need to edit the collection page's HTML.

Also update the collection page's status badge and the landing page's status
section once a collection is no longer empty, so that the pages stop saying
nothing has been published.

### 5. Write the tool's README

A short paragraph on what it teaches, any assumptions built into it (a
distribution, a fixed effect size, an item pool and its source), and the
accessibility checks you ran.

### 6. Check it

Run through this before opening a pull request, and say in the description what
you ran:

**Function**
- [ ] Works when opened directly from disk (`file://`), not just from a server.
- [ ] Works in at least two browsers, one of them not Chromium-based.
- [ ] Reset returns the tool to exactly its starting state.
- [ ] No errors or warnings in the browser console.

**Accessibility** — the fuller list is in [`docs/accessibility.md`](docs/accessibility.md)
- [ ] Fully operable by keyboard; focus always visible; tab order sensible.
- [ ] No keyboard trap.
- [ ] Every graphic has a visible text equivalent showing the same numbers.
- [ ] Changes announced through `shell.announce()`.
- [ ] Every control has a real `<label>`; groups use `<fieldset>`/`<legend>`.
- [ ] Nothing depends on colour alone.
- [ ] Contrast at least 4.5:1 for text, in both light and dark themes.
- [ ] Usable at 320px wide and at 400% zoom, with no horizontal page scrolling.
- [ ] `prefers-reduced-motion` honoured.
- [ ] Checked with a screen reader (say which one).
- [ ] Timed tasks: untimed practice mode, keys stated on screen, and a non-timed
      route to the same concept.

**Content**
- [ ] The statistics or psychology is correct, and any simplification is stated.
- [ ] Item pools or datasets are openly licensed, and the source is recorded.
- [ ] Teaching notes are present.

## Style

**HTML** — semantic elements first; one `<h1>` per page; no skipped heading
levels; ARIA only where no native element does the job.

**CSS** — use the design tokens in `assets/css/main.css` rather than new
hard-coded colours; `rem` for sizes; tool-specific styling stays in the tool's
own `tool.css`.

**JavaScript** — two-space indent, semicolons, single quotes, `const`/`let`
(never `var` in new tool code — the older syntax in `components/` and
`assets/js/` is deliberate, for maximum compatibility when a page is opened
from disk). Wrap tool code in an IIFE. Comment the *why*, not the *what*.

**Prose** — British English. Address the reader as "you". Say what a thing does,
not how exciting it is. No claims about tools that do not exist.

## Pull requests

1. Fork, and branch from `main`.
2. Keep the change to one thing: one tool, or one fix.
3. In the description, say what you built, which topic it covers, and which
   checks you ran.
4. Expect review comments about wording and accessibility. They are not
   criticism of the work; consistency across the collection is much of what
   makes it usable.

There is no CI. Every check is manual, which is exactly why the checklist above
matters.

## Licence

Contributions are made under the [MIT licence](LICENSE), the same licence as the
rest of the project. By opening a pull request you agree that your contribution
can be distributed under it.

## Conduct

Be decent to each other. Assume the person on the other side is teaching a full
load and doing this in gaps between classes. Disagree about the psychology, the
statistics and the design as much as you like; do not make it personal.

Behaviour that makes the project unpleasant to take part in will get you removed
from it. To raise a concern, open an issue or contact the repository owner
through GitHub.
