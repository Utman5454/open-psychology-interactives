# Simplified Edition — integration layer

How the 75 Simplified Edition activities are browsed, catalogued and kept in
step with the original edition. Written at the end of the integration phase,
on the `simplified-edition` branch. Nothing here has been merged or deployed.

## What was built

| Path | What it is |
| --- | --- |
| `scripts/build-simplified-catalogue.py` | Generates the catalogue and the six browsing pages from the 75 metadata files. `--check` verifies they are up to date. |
| `scripts/check-edition-pairing.py` | The drift gate. Verifies the 1:1 pairing between editions and the integrity of the navigation layer. |
| `scripts/test-edition-pairing.py` | Fault injection for the drift gate. Breaks one thing at a time in a throwaway copy and asserts the gate notices. |
| `scripts/check-answer-balance.py` | The answer-placement gate. Measures where the correct answer sits and how long it is, across every scoreable choice question in the edition. |
| `scripts/test-answer-balance.py` | Fault injection for that gate. Reintroduces each form of the bias in a throwaway copy and asserts the gate notices. |
| `.oxlintrc.json` | The JavaScript lint gate: cyclomatic complexity, nesting depth, redeclaration. |
| `data/catalogue-simplified.json` | Generated. The machine-readable index of the edition. |
| `simplified/index.html` | Generated. The edition landing page. |
| `simplified/modules/<slug>/index.html` × 5 | Generated. The module landing pages. |
| `simplified/assets/css/edition.css` | The browsing layer's styles. Separate from `patterns.css`. |
| `simplified/assets/js/edition-nav.js` | Runtime loader: breadcrumb and previous/next inside an activity. |

## Catalogue generation

The 75 `simplified/modules/*/tools/*/metadata.json` files are the source of
truth. Nothing in the catalogue or on a module page is hand-maintained.

`build-simplified-catalogue.py` validates before it writes, so an invalid
edition cannot produce a catalogue at all. It checks the total is 75, the
per-module counts are 21/12/12/18/12, ids and paths are unique, each file's
`moduleSlug` and `toolSlug` agree with where it actually sits, every activity
has an `index.html`, every `pairedWith` resolves to exactly one original in
the same module, `originalPath` agrees with `pairedWith`, no original is
claimed twice, and no original is left without a twin.

`--check` regenerates everything in memory and reports any file that differs,
so a hand-edited module page is caught rather than silently overwritten later.

### Why the module pages are generated rather than fetched

The original edition's module pages fetch `data/catalogue.json` and fall back
to a static "in preparation" message, which is right for a collection still
filling up. This edition is complete, and its activities are built to keep
working from a downloaded folder with no server, so its module pages are
written out in full: no JavaScript, no fetch, no origin, and no way for a page
to disagree with the catalogue because both come from the same run.

The catalogue is still a real loadable artefact. `edition-nav.js` reads it at
runtime for previous/next, which is the one lookup that genuinely has to
happen live.

## Navigation architecture

```
index.html  ──▶  simplified/index.html  ──▶  simplified/modules/<slug>/index.html
   (one new section)      (five module cards)          (all activities, in order)
                                  ▲                              │
404.html ─────────────────────────┘                              ▼
   (one new link)                          simplified/modules/<slug>/tools/<slug>/
                                            breadcrumb ▲   previous · module · next
```

Inside an activity, `edition-nav.js` adds two things and nothing else:

* a breadcrumb **before** `<main>`, so `#main` still means "the activity" and
  the skip link still lands on it;
* a strip **inside** `<main>` at the end, carrying previous, the module, and
  next.

It works in two layers. The way back to the module never depends on a network
request: an activity always sits at
`simplified/modules/<moduleSlug>/tools/<toolSlug>/`, so the module page is two
levels up and the edition landing page four, from any activity, always. The
module name comes from a five-entry map in the script itself, which
`check-edition-pairing.py` verifies against the catalogue.

Previous and next cannot be derived that way, because the order lives in the
catalogue, so they are fetched and appended afterwards. When the fetch cannot
happen — a `file://` open, a lone downloaded folder — the strip keeps the
module link and simply has no previous or next. The two links it could not
honour are absent rather than broken.

## Status

`status` is read in exactly one place in the whole project:
`assets/js/main.js` renders an original-edition tool on a module page only
when `tool.status === "published"`. The vocabulary documented in
`data/catalogue.json` and in `main.js` is `published`, `planned`,
`in-progress`, `draft`.

* All 75 originals are `"published"`, in both the catalogue and their own
  metadata. The five module-level `status` values are `"in-progress"` and are
  read by nothing; they are descriptive.
* All 75 simplified activities are now `"published"`, in both their own
  metadata and the generated catalogue. They were `"draft"` throughout the
  build and were changed at the release-candidate audit.

**Why the change was safe.** It was proved before it was made, not assumed.
`main.js` never reads `catalogue-simplified.json`; `edition-nav.js` does read
it, but only for previous and next, and never looks at `status`;
`check-edition-pairing.py` does not mention the field; and the string "draft"
appeared in none of the 81 shipped HTML pages. Flipping all 75 in a sandbox and
regenerating changed the 75 status values in `data/catalogue-simplified.json`
and **nothing else** — all six generated HTML pages came out byte-identical.

**Why the change was needed.** In this project's vocabulary `published` means
finished work that may be listed on the site, which is what the edition is once
the home page links to it. `data/catalogue-simplified.json` is a public,
machine-readable artefact, and leaving 75 entries in it marked `draft` would
have made the catalogue's own documented meaning false.

**Still open, deliberately.** `RENDERABLE_STATUSES` in the generator remains
`{"draft", "published"}`. Tightening it to `{"published"}` would make any
future draft activity a hard error rather than a listable one. That is a policy
decision about how work in progress is handled in this edition, not a release
blocker, so it has been left to the maintainer.


## Drift check

`scripts/check-edition-pairing.py` re-derives everything from the files as
committed, independently of the generator, and exits non-zero on:

* an original in the catalogue that is not on disk;
* an original with no simplified twin;
* one original claimed by more than one simplified activity;
* a `pairedWith` that is missing, empty, not a string, or not a bare toolSlug;
* a `pairedWith` that resolves in a different module from the activity's own;
* an `originalPath` that disagrees with `pairedWith`;
* a per-module count that does not match 21/12/12/18/12, or that differs
  between the two editions;
* a generated catalogue that lists a different set of activities from the tree,
  declares a count it does not match, or carries a path that does not resolve;
* a module name in `edition-nav.js` that has drifted from the catalogue;
* a relative path in `edition-nav.js` that does not resolve from a real
  activity directory;
* an activity that does not load the navigation layer;
* a module count on the home page that has drifted from the catalogue, or a
  home page that has lost the entry point altogether.

It is deliberately structural. It does not compare wording or behaviour
between an activity and its twin: an activity that keeps its pairing while
diverging in content is doing exactly what a simplified edition is for.

Two of these checks found a real bug during this phase. `TO_EDITION` and
`TO_CATALOGUE` in `edition-nav.js` were both one `../` short. Neither showed
up in the page or in an HTML link checker, because they are strings inside
JavaScript: the breadcrumb rendered a link that looked right and the fetch
silently found nothing.

### The gate is itself tested

A check that only ever runs against a healthy repository is untested code: it
exits 0 whether it is working or has quietly stopped looking. `python3
scripts/test-edition-pairing.py` copies what the check reads into a temporary
directory, breaks one thing at a time, and asserts that the check exits 1 and
says why. It restores after each scenario and deletes the copy at the end, so
it never touches the repository.

Seventeen faults are injected, one per bullet above plus the variants that are
easy to get wrong: a `pairedWith` that resolves but in the wrong module, a
catalogue listing an activity that is not in the tree, a stale count on the
home page. All seventeen are caught.

## Accessibility and browser QA

Rendered and inspected in Chromium at 1440x900, 768 and 320, over a local
server that mirrors the GitHub Pages base path so root-absolute and relative
links are both exercised for real. Eleven pages: the landing page, all five
module pages, and five activities chosen to cover the navigation's edge cases
(first in a module, middle, last, the 21-activity module, and a module whose
tool numbers have gaps).

Checked at every width: horizontal scrolling, console errors and failed
requests, one `h1` and no skipped heading levels, landmarks, the skip link,
`lang`, link accessible names, and the whole tab order with a check that each
stop shows a focus indicator. Separately: a keyboard-only journey from the
home page through to an activity and back, reduced motion, forced colours,
and the 404 page.

Everything passes. Three defects were found and fixed during this pass, all in
the integration layer and none in an activity:

1. **Contrast.** `.module-card__num` and `.activity-item__num` used
   `--gold-strong` as a text colour, which is 4.27:1 on white: enough for a
   graphic, not the 4.5:1 that 12px text needs. `simplified.css` states the
   rule at the token itself — gold is a highlight, never a text colour — and
   this was the only place in the project breaking it. Both now use `--blue`
   (7.06:1 on the card, 6.33:1 on the row's hover tint).
2. **Doubled focus rings.** The card and row patterns put the ring on the
   container, because the anchor's box is only as wide as its words while its
   hit area is the whole card. The anchor's own ring was never suppressed, so
   focus drew a box inside a box. It is now suppressed inside the same
   `:has()`-guarded rule, so a browser without `:has()` drops both and keeps
   the native ring rather than losing every indicator.
3. **Link text on `404.html`.** The link into the edition read "landing page
   lists all five modules", which does not identify itself out of context. It
   now reads "Simplified Edition landing page".

A comment in `edition-nav.js` also said the landing page was three levels up
from an activity when the code correctly used four. Corrected; the code was
never wrong.

### Known and accepted

At 320px the activity breadcrumb wraps to two lines and leaves its `/`
separator at the end of the first. It is legible and the separator is
`aria-hidden`, so nothing is lost; moving it would mean changing generated
markup and the navigation script for a cosmetic gain at one width.

## Files changed outside `simplified/`

| File | Change | Why |
| --- | --- | --- |
| `index.html` | One new `<section id="simplified">`, 50 lines added, nothing removed. | The only entry point from the original site. A section rather than a header-navigation item because that navigation is duplicated across `index.html`, the five module pages and `404.html`: a nav entry costs seven edits to stay consistent, this costs one. |
| `404.html` | One new paragraph, 14 lines added, nothing removed. | GitHub Pages serves `404.html` for any missing address, including one under `/simplified/`. Without this the module cards below would send a lost reader into the full-length edition without saying so. Root-absolute like every other path in that file, per its own header note. |
| `data/catalogue-simplified.json` | New, generated. | Requested. |
| `scripts/build-simplified-catalogue.py` | New. | Requested. |
| `scripts/check-edition-pairing.py` | New. | Requested. |
| `scripts/test-edition-pairing.py` | New. | Proves the drift check fails when it should. |

No original activity, the original catalogue, or the original build pipeline
was touched. `python3 scripts/build-standalone.py --all --check` reports all 75
exports up to date.

If a header-navigation entry is wanted as well, it is one `<li>` in each of the
seven files that carry the shared header.

## The 75 activities

Each gained exactly two lines at the end of its `<head>`, identical in every
file, applied by script:

```html
<link rel="stylesheet" href="../../../../assets/css/edition.css">
<script src="../../../../assets/js/edition-nav.js" defer></script>
```

150 insertions, 0 deletions, across 75 files. No activity content, markup or
behaviour changed. `simplified/template/README.md` documents the two lines so a
future activity gets them, and the drift check fails if one does not.

## Code-quality lint

`.oxlintrc.json` at the repository root configures [Oxlint][oxlint] over the
Simplified Edition's JavaScript. Nothing is installed: it runs from a pinned
version through `npx`, so there is no `package.json`, no lockfile and no
`node_modules` in the tree. The site itself still ships zero dependencies.

```
npx --yes oxlint@1.80.0        # from the repository root
```

`ignorePatterns` keeps it to `simplified/`. The original edition is
authoritative history and is not linted, in line with rule 1.

Three rules are errors:

| Rule | Setting | Why |
| --- | --- | --- |
| `complexity` | max 10 per function | Cyclomatic complexity. A ceiling low enough to notice a function doing several jobs, high enough that a genuine state machine or figure renderer clears it. |
| `max-depth` | max 4 | Block nesting. ESLint's own default, and the level at which a loop body stops being readable in place. |
| `no-redeclare` | error | Added after it would have caught a real bug: a helper named `verdict()` in a file that already had `var verdict = document.getElementById("verdict")`. Silent at parse time, fatal at run time. |

The `correctness` category runs as warnings. Those are advisory; the three
rules above are the gate.

At the time the gate went in, 2,865 functions were linted and six exceeded a
complexity of 10 (21, 15, 15, 13, 12, 11), with one function nested five deep.
Both counts are now zero. The tail was thin rather than systemic — 1,712
functions sit at a complexity of 1 — so the fix was seven targeted extractions,
not a sweep.

**What the threshold is for.** It is a prompt to look, not a number to satisfy.
Splitting a function into wrappers to get under 10 makes the code worse and the
metric better, which is the wrong trade. Where complexity is genuinely the
shape of the problem — a trial state machine, a Monte Carlo loop, a figure with
several panels — the right move is a named seam that a reader gains something
from, or an `oxlint-disable-next-line` carrying the reason. Learner-facing copy
is never rearranged to satisfy the linter.

[oxlint]: https://oxc.rs/docs/guide/usage/linter

## The browsing layer

The landing page and the five module pages are generated, so their layout
lives in `scripts/build-simplified-catalogue.py` and their styles in
`simplified/assets/css/edition.css`. Editing a generated page by hand is
reverted by the next run and reported by `--check`.

**Landing page.** The five modules are full-width rows rather than a grid of
cards. A grid of five leaves an orphan on the second line at every column
count that fits three, and the gap reads as a missing sixth module; rows also
give each module enough width for a line naming the activity it opens and
closes with, which is what actually helps someone choose between them. Each
row carries a numbered badge in the module's accent colour. The colour is
never the only difference: the badge holds the number, the preview line
repeats it in words, and the title says which module it is.

**Module pages.** The hero is copy on the left and a small illustration on the
right, at roughly a third of the hero's width. The activities are compact
cards in two columns from tablet width up and one below. Twelve to twenty-one
rows in a single column is a contents page; the same set in two columns is
something you browse. Each card carries a number badge, the title as its only
link, one line of description, a duration and a quiet "Open" affordance that
warms on hover. The whole card is the hit area and takes exactly one focus
stop.

The two-column count is **stated, not derived**. An `auto-fill` track count
gives three columns at desk width, and three columns of small cards is a
contents page again: the eye travels too far along each row to keep the
teaching order.

**Stat chips** answer "how much of this is there and how long will it take"
before anything is opened, which is the question a listing page is worst at
answering and the first one a teacher planning a session asks. A chip is never
a link and never the only place a number appears.

## Module figures

One small editorial illustration per module page, defined in `MOTIFS` in the
generator and animated by CSS in `edition.css`. No script, no image file and
no network request, so a module page still works from a downloaded folder.

They are **not teaching figures**. The activities are the teaching; a
navigation page that opens with a lecture diagram pushes the thing a reader
came for below the fold. A figure earns its place only if it states the
module's central finding, and should be readable in about two seconds.

| Module | What it shows |
| --- | --- |
| Cognitive | A valid cue shortening the response against an invalid one |
| Research Methods | Individual observations scattered wide; sample means in a narrow hump |
| Neuropsychology | A crossed pair of deficits: two patients, two tasks |
| Social & Critical | One event branching to two accounts of it |
| Personality | Two different profiles sharing one average |

### The rules they follow

Each of these was learned by breaking it first.

* **Small.** A 240x140 viewBox at about a third of the hero's width, roughly
  190px tall. At twice that it dominated the page and pushed the activities
  most of the way down the viewport.
* **Short labels only**, two or three words. Every explanatory sentence lives
  in the HTML caption beneath. A sentence inside an SVG cannot wrap, cannot be
  selected, and silently overruns the viewBox.
* **Nothing may exceed the viewBox.** `.hero` sets `overflow: hidden`, so text
  that overruns is not untidy, it is cut off mid-word. A 52-character label in
  a 260-unit box reached x=276 and was clipped exactly that way.
* **Interface-scale type**, landing around 13px on screen, the same size as
  the chips beside it.
* **Every shape carries its own `fill` or `stroke` attribute** as well as its
  class. An SVG shape with no fill from any source paints **black**, so a
  stylesheet that fails to arrive turns a diagram into black boxes sitting
  over its own labels. The class is the truth and comes from the design
  tokens; the attribute is the fallback.
* **A class selector beats a presentation attribute.** `.motif__bar { fill:
  var(--teal) }` silently overrode the per-shape fills and drew every
  neuropsychology bar teal while the key promised two colours. Any series that
  is not the default needs its own class in the stylesheet too. There is a
  check for this.
* **Animation moves data marks, never labels**, and no animated state may
  cover text. Where movement adds nothing the figure is static: the social and
  critical figure is a branch, and a branch is legible at a glance.
* **Reduced motion must leave a correct figure.** Every animation ends at the
  state that carries the meaning, so `animation: none` leaves five finished
  drawings. Bars are drawn at true size in the markup and scaled up from zero
  rather than drawn empty and scaled out.

Each figure carries a `<title>` and `<desc>` for a screen reader and a visible
caption in words, so none is the only route to its point. Where a figure
asserts arithmetic, the arithmetic is real and commented: the two personality
profiles sum to 164 apiece, so the dashed average at a height of 41 is true of
both rather than drawn where it looks right.

**Not extended into the activities.** The activities already contain live,
manipulable models, which is what this edition exists to preserve. Adding
animation on top of a running simulation would compete with it, and the
browsing layer was where the gap actually was.

## Visual QA

Structural checks passed the first version of this layout while it had text
clipped mid-word, a legend describing colours that were not on screen, and
chips stretched into tall ovals. DOM geometry is not enough: **render the six
browsing pages at 1440, 1024, 768, 375 and 320, and look at the screenshots.**

The harness that runs alongside that inspection asserts, at every width:

* no horizontal scroll, and nothing clipped by a hero that hides its overflow;
* no text wider than the box painting it;
* every SVG label inside its viewBox, no more than three words, rendered
  between 9 and 17px;
* no shape painting black, and no shape whose computed fill differs from its
  own `fill` attribute;
* no shape painted over a label, and no animated shape overlapping one;
* the figure between 120 and 260px tall and 25-42% of the hero's width;
* the hero no taller than 300px, with the fourth activity on the first screen;
* two card columns at desk and tablet width, one at phone width;
* one focus target per card and per module row;
* chips at pill height, not stretched by their container;
* a stacked figure aligned to the copy above it;
* reduced motion stopping every animation and leaving no bar collapsed.

## Answer placement

Choice questions in this edition are gated on two properties a learner could
otherwise exploit without reading: where the correct answer sits, and how long
it is.

**What the audit found.** Across the 28 scoreable choice questions, the correct
answer was in position 1 in **25 of 26** of the ones written into page markup,
and it was the longest option in 46% of them. Neither is visible while reading
one activity. Both are obvious in aggregate, and together they meant a learner
who noticed could clear most of two modules on the pattern rather than on the
psychology. Notably, the two multi-round activities were already balanced
(answers at 1, 2, 3, 4 and at 2, 1, 4, 3), and one activity's header comment
already described rotating its options to defeat exactly this tell and claimed
a test suite checked it. There was no such suite. There is now.

**What changed.** Twenty-six option lists were reordered so the answer now sits
at position 1, 2, 3 and 4 in roughly equal measure (18%, 32%, 29%, 21%).
Distractors kept their existing relative order, because that order is
sometimes doing work — a magnitude scale, a narrow-to-broad progression — and
a blind shuffle would have destroyed it silently. Six activities had a
distractor strengthened, because the correct answer being conspicuously the
longest is a tell of the same kind; the correct answers themselves were not
trimmed, so no teaching was weakened to move a number.

**What the gate does not do.** It cannot judge whether a distractor is
plausible, and it does not try. Padding a list with weak options to make the
positions come out evenly would be a worse fault than the bias it fixed, so
the gate measures only the two things that are mechanically checkable and
leaves plausibility to review.

## How to verify all of this

```
npx --yes oxlint@1.80.0                                 # no complexity or nesting errors
python3 scripts/check-answer-balance.py                 # no positional or length tell
python3 scripts/test-answer-balance.py                  # that gate still bites
python3 scripts/build-simplified-catalogue.py --check   # catalogue and pages current
python3 scripts/check-edition-pairing.py                # the two editions in step
python3 scripts/test-edition-pairing.py                 # the drift gate still bites
python3 scripts/build-standalone.py --all --check       # the original 75 untouched
```

All seven exit 0 on this branch.

## Deferred

* Merging, publishing and deployment.
* The status change described above.
* A simplified standalone exporter. Not needed: nothing in the integration
  depends on one.
* Original-to-simplified cross-links on the 75 original pages. The reverse
  direction already exists on all 75 simplified pages.
* A header-navigation entry for the Simplified Edition.
* The 320px breadcrumb separator described under Accessibility and browser QA.
