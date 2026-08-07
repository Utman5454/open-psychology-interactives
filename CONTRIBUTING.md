# Contributing

Thank you for considering it. This project is for teaching staff and students,
and it gets better mainly through people who teach these topics adding the
demonstration they already run by hand.

> **Current status.** Twelve tools are published, all of them in Personality
> and Individual Differences. The other four modules hold the scaffold —
> module page, shared interactive shell and documentation — and are unclaimed.
> See `data/catalogue.json` for the authoritative list.

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
| **Build a tool** | The main event. See below. |

## The five modules

Every tool belongs to exactly one module. These slugs are canonical — they are
the folder name, the CSS modifier and the `moduleSlug` in the catalogue.

| Module | Slug |
| --- | --- |
| Cognitive Psychology | `cognitive` |
| Research Methods | `research-methods` |
| Neuropsychology | `neuropsychology` |
| Social and Critical Psychology | `social-critical-psychology` |
| Personality and Individual Differences | `personality-individual-differences` |

## Before you start building

**Open an issue first.** Say which topic you intend to take, and roughly how you
plan to show it. This avoids two people building the same thing, and it is much
cheaper to reshape an idea in a comment thread than after the code is written.

Planned topics are listed on each module page and in
[`data/catalogue.json`](data/catalogue.json). A topic that is not on those lists
is not thereby excluded — propose it.

## Ground rules

These are firm, and a pull request that breaks one will be asked to change
before it is merged.

1. **No dependencies.** Plain HTML, CSS and vanilla JavaScript. No React, no
   Vue, no npm, no bundler, no TypeScript compile step, no CDN link, no external
   font. The project's central promise is that these pages still work in ten
   years and work with no internet connection.
2. **No backend, no external API, no database.** Everything runs in the browser.
   If a tool needs data, that data is a small JSON file or an array in the
   source.
3. **Relative paths only.** The site is published under
   `/open-psychology-interactives/`, so any path starting with `/` breaks. The
   single approved exception is `404.html`, which must use root-absolute paths
   because GitHub Pages serves it at the address that was requested rather than
   at its own location; the reasoning is documented in that file.
4. **Nothing leaves the browser.** No analytics, no telemetry, no cookies, no
   third-party requests. Student responses stay in the tab and are never stored
   or transmitted.
5. **No copyrighted media.** No photographs, stock images, icon fonts or clip
   art. Graphics are drawn with inline SVG, `<canvas>` or CSS. This keeps the
   whole repository reusable under one licence with nothing to check.
6. **No copyrighted test material.** Do not reproduce commercial personality
   inventories or neuropsychological test batteries, in whole or in part. Use
   public-domain or openly licensed item pools and record the source.
7. **Accessibility is a merge requirement.** WCAG 2.2 AA. Not a follow-up issue.
8. **Never claim a tool exists before it does.** Placeholder text says plainly
   what is not there yet, and the catalogue lists a tool on its module page only
   when its `status` is exactly `"published"`. This matters: a lecturer who
   plans a seminar around a tool that turns out to be a stub has had their time
   wasted.
9. **British English** in learner-facing text.
10. **No diagnosis or assessment.** Nothing here scores, labels, profiles or
    assesses the person using it, and no tool asks for names, health
    information or protected characteristics.

## Building a tool

### 1. Decide the one idea

Write the sentence that will sit under the title before you write any code. If
it needs the word "and", you probably have two tools.

Then write down the misconception you expect to surface. The tool exists to make
that misconception visible and then untenable.

### 2. Create the folder

```
modules/<module-slug>/tools/<tool-slug>/
├── index.html          the tool itself
├── metadata.json       the catalogue record
├── teaching-notes.md   educator guidance
├── tool.js             the logic
└── tool.css            styling specific to this tool (optional)
```

The slug is short, lowercase and hyphenated, and matches the `toolSlug` you will
put in the catalogue.

### 3. Build against the shared shell

[`docs/adapting-a-tool.md`](docs/adapting-a-tool.md) has the full markup
contract and JavaScript API for `components/interactive-shell.{css,js}`, plus a
working skeleton to copy. Use the shell: it is what makes every tool behave
consistently and handles the live region, reset wiring and slider labelling that
are easy to get subtly wrong.

Your page needs the standard site header, footer and skip link. Copy them from
`modules/research-methods/index.html` and fix the relative depth — a tool page
is four levels deep, so assets are at `../../../../`.

### 4. Follow the learning loop

A substantive tool normally contains a concise learning objective; a prediction
before the reveal; a meaningful manipulation; a live consequence; a
plain-language interpretation; one or more challenge tasks; explanatory feedback
rather than only "correct" or "incorrect"; a "What this demonstrates" section; a
"What this does not demonstrate" section; and reset plus worked-example
controls.

Do not force these into a tool where a different structure is pedagogically
stronger, but keep the underlying predict–manipulate–observe–explain–apply
sequence.

### 5. Write `metadata.json`

The same object goes into the module's `tools` array in
[`data/catalogue.json`](data/catalogue.json):

```json
{
  "id": "sampling-distribution",
  "title": "Sampling distribution of the mean",
  "module": "Research Methods",
  "moduleSlug": "research-methods",
  "toolSlug": "sampling-distribution",
  "summary": "Draw repeated samples from a population you control and watch the distribution of the sample mean take shape.",
  "learningObjectives": [
    "Explain why a sample statistic varies from sample to sample.",
    "Predict how the spread of the sampling distribution responds to n."
  ],
  "topics": ["sampling", "variability", "central limit theorem"],
  "interactionTypes": ["slider", "repeated simulation"],
  "estimatedMinutes": 10,
  "difficulty": "Introductory",
  "status": "published",
  "version": "1.0.0",
  "lastUpdated": "2026-09-01",
  "licenceCode": "MIT",
  "licenceContent": "CC BY 4.0",
  "privacy": "No data collected; all computation in the browser.",
  "accessibilityNotes": "Keyboard operable; chart paired with a text readout; reduced motion honoured."
}
```

| Field | Notes |
| --- | --- |
| `id` | Matches the folder name and `toolSlug`. |
| `title` | Sentence case, no trailing full stop. |
| `module` / `moduleSlug` | Full module name and its canonical slug. |
| `toolSlug` | The folder name. The site derives the path from this. |
| `summary` | One or two sentences, aimed at a lecturer deciding whether to open it. |
| `learningObjectives` | Array of statements a student should be able to make afterwards. |
| `topics`, `interactionTypes` | Arrays of short keywords, for search and filtering. |
| `estimatedMinutes` | Realistic classroom time, as a number. Shown on the card. |
| `difficulty` | e.g. `Introductory`, `Intermediate`. Shown on the card. |
| `status` | **Only `"published"` makes a tool appear on the site.** Use `"planned"`, `"in-progress"` or `"draft"` while building. |
| `version`, `lastUpdated` | Semantic version and ISO date. |
| `licenceCode`, `licenceContent` | Licence for the code and for the written content. |
| `privacy` | One sentence on what the tool does with responses. |
| `accessibilityNotes` | What you did and what you checked. |

Optionally include `path` to override the derived location. Preserve any
additional fields the repository has already established.

### 6. Write `teaching-notes.md`

Intended level; learning objectives; estimated duration; preparation; suggested
lecture or seminar use; the prediction question; the activity sequence; debrief
questions; likely misconceptions; limitations and cautions; accessibility
considerations; an optional extension task; and citation or evidence notes where
appropriate.

### 7. Integrate it

- Add the catalogue entry (step 5). The module page picks it up from there — no
  HTML edit is needed to list it.
- Update the module page's status badge and the landing page's status section
  once a module is no longer empty, so the pages stop saying nothing has been
  published.
- Verify the tool can be reached from both the home page and its module page.

### 8. Check it

Run through this before opening a pull request, and say in the description what
you ran:

**Function**
- [ ] Works when opened directly from disk (`file://`), not just from a server.
- [ ] Works in at least two browsers, one of them not Chromium-based.
- [ ] Reset restores the entire initial state.
- [ ] Prediction-before-reveal behaves correctly, including on a second run.
- [ ] Random and worked-example controls behave correctly.
- [ ] No errors or warnings in the browser console.
- [ ] `metadata.json` is valid JSON and matches the catalogue entry.
- [ ] Teaching notes match what the tool actually does.

**Accessibility** — the fuller list is in [`docs/accessibility.md`](docs/accessibility.md)
- [ ] Fully operable by keyboard; focus always visible; tab order sensible.
- [ ] Focus never hidden behind the sticky header (WCAG 2.2, 2.4.11).
- [ ] Anything draggable also works without dragging (2.5.7).
- [ ] Pointer targets at least 24 × 24px (2.5.8); the shell's 44px default
      clears this.
- [ ] No keyboard trap.
- [ ] Every graphic has a visible text equivalent showing the same numbers.
- [ ] Changes announced through `shell.announce()`.
- [ ] Every control has a real `<label>`; groups use `<fieldset>`/`<legend>`.
- [ ] Nothing depends on colour, hover or timing alone.
- [ ] Contrast at least 4.5:1 for text, in both light and dark themes.
- [ ] Usable at 320px wide and at 400% zoom, with no horizontal page scrolling.
- [ ] `prefers-reduced-motion` honoured.
- [ ] Checked with a screen reader (say which one).
- [ ] Timed tasks: untimed practice mode, keys stated on screen, and a non-timed
      route to the same concept.

**Content**
- [ ] The psychology and statistics are correct, and any simplification is
      stated on the page as well as in the source.
- [ ] Simulated values are labelled as simulated, and are not presented as norms
      or cut-offs.
- [ ] No causal claim the design does not support.
- [ ] Contested constructs and interpretations are flagged as contested.
- [ ] Item pools or datasets are openly licensed, and the source is recorded.

## Style

**HTML** — semantic elements first; one `<h1>` per page; no skipped heading
levels; ARIA only where no native element does the job.

**CSS** — use the design tokens in `assets/css/main.css` rather than new
hard-coded colours; `rem` for sizes; tool-specific styling stays in the tool's
own `tool.css`.

**JavaScript** — two-space indent, semicolons, single quotes, `const`/`let`
(never `var` in new tool code — the older syntax in `components/` and
`assets/js/` is deliberate, for maximum compatibility when a page is opened
from disk). Wrap tool code in an IIFE. Avoid unexplained constants and
duplicated magic numbers. Validate inputs and prevent impossible states.
Comment the *why*, not the *what*, and comment the educational model.

**Prose** — British English. Address the reader as "you". Say what a thing does,
not how exciting it is. No claims about tools that do not exist.

## Pull requests

1. Fork, and branch from `main`.
2. Keep the change to one thing: one tool, or one fix.
3. In the description, say what you built, which module and topic it covers, and
   which checks you ran.
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
